"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { InterviewView } from "./interview-view";
import { SetupModal } from "./setup-modal";
import type { SessionMessage } from "@/lib/chat-types";
import { readJsonStorage, writeJsonStorage } from "@/lib/local-storage";
import {
  buildAssistantGreeting,
  defaultCvContent,
  defaultInterviewConfig,
  defaultJobPostingContent,
  getQuestionGoal,
  normalizeInterviewConfig,
  type InterviewConfig,
} from "@/lib/site-config";

type SessionState = "idle" | "listening" | "speaking" | "thinking";

const SILENCE_TIMEOUT_MS = 15000;
const MAX_NO_SPEECH_RETRIES = 3;

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const createUserMessage = (
  content: string,
  source: SessionMessage["source"]
): SessionMessage => ({
  id: createMessageId(),
  role: "user",
  content,
  timestamp: new Date(),
  source,
});

const createAssistantMessage = (content: string): SessionMessage => ({
  id: createMessageId(),
  role: "assistant",
  content,
  timestamp: new Date(),
  source: "voice",
});

type StartOverrides = {
  config?: InterviewConfig;
  cvContent?: string;
  jobPostingContent?: string;
  hasCv?: boolean;
  hasJobPosting?: boolean;
  intervieweeName?: string;
};

const MIC_STORAGE_KEY = "ai-interview-selected-mic";

export function InterviewSession() {
  const router = useRouter();
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [cvContent, setCvContent] = useState(defaultCvContent);
  const [jobPostingContent, setJobPostingContent] = useState(
    defaultJobPostingContent
  );
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>(
    defaultInterviewConfig
  );
  const [questionCount, setQuestionCount] = useState(0);
  const [questionGoal, setQuestionGoal] = useState(
    getQuestionGoal(defaultInterviewConfig)
  );
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [intervieweeName, setIntervieweeName] = useState("");
  const [hasUploadedCv, setHasUploadedCv] = useState(false);
  const [hasUploadedJobPosting, setHasUploadedJobPosting] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectedRef = useRef(false);
  const isRestartingRef = useRef(false);
  const noSpeechCountRef = useRef(0);
  const lastTranscriptRef = useRef<string>("");
  const currentTranscriptRef = useRef<string>("");
  const sessionStateRef = useRef<SessionState>("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isMicMutedRef = useRef(false);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 1000);
  }, [stopTimer]);

  const updateSessionState = (state: SessionState) => {
    sessionStateRef.current = state;
    setSessionState(state);
  };

  const appendMessage = useCallback((message: SessionMessage) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (
        last &&
        last.role === message.role &&
        last.source === message.source &&
        last.content === message.content
      ) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const requestMicrophoneAccess = useCallback(async (deviceId?: string) => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      throw new Error("Browser does not support microphone access");
    }

    let constraints: MediaStreamConstraints = { audio: true };

    if (deviceId && deviceId !== "default") {
      constraints = {
        audio: {
          deviceId: { exact: deviceId } as ConstrainDOMString,
        } as MediaTrackConstraints,
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = stream;
    audioStreamRef.current
      .getAudioTracks()
      .forEach((track) => (track.enabled = !isMicMutedRef.current));

    return stream;
  }, []);

  const speak = (text: string, onComplete: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onComplete();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = onComplete;
      utterance.onerror = onComplete;
      window.speechSynthesis.speak(utterance);
    } catch {
      onComplete();
    }
  };

  const attemptRecognitionStart = () => {
    if (
      !recognitionRef.current ||
      !isConnectedRef.current ||
      isMicMutedRef.current
    ) {
      return;
    }
    try {
      isRestartingRef.current = false;
      recognitionRef.current.start();
    } catch (error) {
      console.log("[voice] Failed to start recognition:", error);
    }
  };

  const stopRecognition = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.log("[voice] Failed to stop recognition:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      console.warn(
        "[voice] SpeechRecognition API is not available in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      lastTranscriptRef.current = "";
      currentTranscriptRef.current = "";
      setIsRecording(true);
      updateSessionState("listening");
      isRestartingRef.current = false;
      noSpeechCountRef.current = 0;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isConnectedRef.current) {
          console.log("[voice] Silence timeout - stopping recognition");
          recognitionRef.current.stop();
        }
      }, SILENCE_TIMEOUT_MS);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (
        sessionStateRef.current === "listening" &&
        isConnectedRef.current &&
        !isRestartingRef.current
      ) {
        isRestartingRef.current = true;
        setTimeout(() => {
          if (recognitionRef.current && isConnectedRef.current) {
            try {
              console.log("[voice] Restarting recognition after stop");
              recognitionRef.current.start();
              isRestartingRef.current = false;
            } catch (error) {
              console.log("[voice] Recognition restart failed:", error);
              isRestartingRef.current = false;
            }
          }
        }, 500);
      }
    };

    recognition.onresult = async (event: any) => {
      let transcript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinal = true;
        }
      }

      const trimmed = transcript.trim();
      if (!trimmed) {
        return;
      }

      if (isFinal) {
        noSpeechCountRef.current = 0;
        if (trimmed !== lastTranscriptRef.current) {
          lastTranscriptRef.current = trimmed;
          currentTranscriptRef.current = "";
          setCurrentTranscript("");
          try {
            isRestartingRef.current = true;
            stopRecognition();
          } catch (_) {
            /* ignore stop errors */
          }
          await handleUserMessage(trimmed, "voice");
        } else {
          currentTranscriptRef.current = "";
          setCurrentTranscript("");
          isRestartingRef.current = false;
        }
      } else {
        noSpeechCountRef.current = 0;
        currentTranscriptRef.current = transcript;
        setCurrentTranscript(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech") {
        console.debug("[voice] No speech detected");
        noSpeechCountRef.current += 1;
        if (
          noSpeechCountRef.current < MAX_NO_SPEECH_RETRIES &&
          isConnectedRef.current
        ) {
          setTimeout(() => {
            if (
              recognitionRef.current &&
              isConnectedRef.current &&
              !isRestartingRef.current
            ) {
              try {
                isRestartingRef.current = true;
                recognitionRef.current.stop();
                setTimeout(() => {
                  if (recognitionRef.current && isConnectedRef.current) {
                    try {
                      recognitionRef.current.start();
                    } finally {
                      isRestartingRef.current = false;
                    }
                  } else {
                    isRestartingRef.current = false;
                  }
                }, 300);
              } catch (error) {
                console.log("[voice] Error restarting after no-speech:", error);
              }
            }
          }, 1000);
        } else if (noSpeechCountRef.current >= MAX_NO_SPEECH_RETRIES) {
          const errorMessage = createAssistantMessage(
            "I'm having trouble detecting your voice. Please check your microphone connection and speak clearly when you're ready."
          );
          appendMessage(errorMessage);
          noSpeechCountRef.current = 0;
        }
      } else {
        console.warn("[voice] Recognition warning:", event.error);
        if (event.error === "audio-capture") {
          const errorMessage = createAssistantMessage(
            "I cannot detect a microphone. Please verify microphone permissions and hardware before continuing."
          );
          appendMessage(errorMessage);
        }
      }
    };

    recognition.onspeechend = () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      setIsRecording(false);
      if (currentTranscriptRef.current.trim()) {
        try {
          isRestartingRef.current = true;
          stopRecognition();
        } catch (error) {
          console.log(
            "[voice] Error stopping recognition on speechend:",
            error
          );
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort?.();
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      stopTimer();
    };
  }, [appendMessage, stopTimer]);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  useEffect(() => {
    sessionStateRef.current = sessionState;
  }, [sessionState]);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  useEffect(() => {
    const storedDeviceId = readJsonStorage<string>(MIC_STORAGE_KEY);
    if (storedDeviceId) {
      setSelectedMic(storedDeviceId);
    }
  }, []);

  useEffect(() => {
    return () => {
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!selectedMic || !isConnectedRef.current) {
      return;
    }

    let cancelled = false;

    requestMicrophoneAccess(selectedMic)
      .then(() => {
        if (cancelled) {
          return;
        }

        if (
          isConnectedRef.current &&
          recognitionRef.current &&
          !isMicMutedRef.current
        ) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.log(
              "[voice] Unable to stop recognition during mic switch:",
              error
            );
          }

          setTimeout(() => {
            if (
              isConnectedRef.current &&
              recognitionRef.current &&
              !isMicMutedRef.current
            ) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log(
                  "[voice] Unable to restart recognition after mic switch:",
                  error
                );
              }
            }
          }, 200);
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        console.error("[voice] Failed to access selected microphone:", error);

        const isRecoverable =
          error instanceof DOMException &&
          (error.name === "OverconstrainedError" ||
            error.name === "NotFoundError");

        if (isRecoverable && selectedMic !== "default") {
          setSelectedMic("default");
          writeJsonStorage(MIC_STORAGE_KEY, "default");
          return;
        }

        if (isConnectedRef.current) {
          appendMessage(
            createAssistantMessage(
              "I couldn't access the selected microphone. Please check permissions and try again."
            )
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appendMessage, requestMicrophoneAccess, selectedMic]);

  const handleUserMessage = async (
    content: string,
    source: SessionMessage["source"]
  ) => {
    const cleaned = content.trim();
    if (!cleaned) return;

    updateSessionState("thinking");
    setIsRecording(false);
    setCurrentTranscript("");

    const userMessage = createUserMessage(cleaned, source);
    appendMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: cleaned,
          cvContent,
          jobPostingContent,
          config: interviewConfig,
          questionCount,
          questionGoal,
          intervieweeName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response as string | undefined;
      if (!aiResponse) {
        throw new Error("No response from AI service");
      }

      const assistantMessage = createAssistantMessage(aiResponse);
      appendMessage(assistantMessage);

      if (questionCount < questionGoal) {
        setQuestionCount((prev) => Math.min(prev + 1, questionGoal));
      }

      updateSessionState("speaking");
      speak(aiResponse, () => {
        updateSessionState("listening");
        attemptRecognitionStart();
      });
    } catch (error) {
      console.error("[voice] Error getting AI response:", error);
      const errorMessage = createAssistantMessage(
        `I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please verify your configuration and try again.`
      );
      appendMessage(errorMessage);
      updateSessionState("listening");
      attemptRecognitionStart();
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async (overrides?: StartOverrides) => {
    try {
      await requestMicrophoneAccess(selectedMic || undefined);
    } catch (error) {
      const needsFallback =
        error instanceof DOMException &&
        (error.name === "OverconstrainedError" ||
          error.name === "NotFoundError");

      if (needsFallback) {
        try {
          setSelectedMic("default");
          writeJsonStorage(MIC_STORAGE_KEY, "default");
          await requestMicrophoneAccess(undefined);
        } catch (retryError) {
          console.error(
            "[voice] Unable to access microphone after fallback:",
            retryError
          );
          appendMessage(
            createAssistantMessage(
              "I couldn't access your microphone. Please allow microphone permissions and try again."
            )
          );
          return;
        }
      } else {
        console.error("[voice] Unable to access microphone:", error);
        appendMessage(
          createAssistantMessage(
            "I couldn't access your microphone. Please allow microphone permissions and try again."
          )
        );
        return;
      }
    }

    const normalizedConfig = overrides?.config
      ? normalizeInterviewConfig(overrides.config)
      : interviewConfig;

    const cvToUse = overrides?.cvContent ?? cvContent;
    const jobToUse = overrides?.jobPostingContent ?? jobPostingContent;
    const hasCv = overrides?.hasCv ?? hasUploadedCv;
    const hasJobPosting = overrides?.hasJobPosting ?? hasUploadedJobPosting;
    const name = overrides?.intervieweeName ?? intervieweeName;

    setInterviewConfig(normalizedConfig);
    setCvContent(cvToUse);
    setJobPostingContent(jobToUse);
    setHasUploadedCv(hasCv);
    setHasUploadedJobPosting(hasJobPosting);
    setIntervieweeName(name ?? "");

    setQuestionGoal(getQuestionGoal(normalizedConfig));
    setQuestionCount(0);
    setMessages([]);
    setElapsedMs(0);

    if (!recognitionRef.current) {
      console.warn(
        "[voice] Cannot start interview without speech recognition support."
      );
    }

    setIsConnected(true);
    isConnectedRef.current = true;
    isMicMutedRef.current = false;
    lastTranscriptRef.current = "";
    currentTranscriptRef.current = "";
    startTimer();

    try {
      isRestartingRef.current = true;
      stopRecognition();
    } catch (error) {
      console.log("[voice] Error resetting recognition before start:", error);
    }

    const greetingMessage = buildAssistantGreeting(hasCv, hasJobPosting, name);
    setMessages([greetingMessage]);
    updateSessionState("speaking");

    speak(greetingMessage.content, () => {
      updateSessionState("listening");
      attemptRecognitionStart();
    });
  };

  const stopInterview = () => {
    if (startTimeRef.current) {
      setElapsedMs(Date.now() - startTimeRef.current);
    }
    stopTimer();
    startTimeRef.current = null;
    isConnectedRef.current = false;
    setIsConnected(false);
    setIsRecording(false);
    updateSessionState("idle");
    setIsMicMuted(false);
    isMicMutedRef.current = false;

    recognitionRef.current?.abort?.();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
  };

  const resetInterview = () => {
    stopInterview();
    setMessages([]);
    setQuestionCount(0);
    setCurrentTranscript("");
    setInterviewConfig(defaultInterviewConfig);
    setCvContent(defaultCvContent);
    setJobPostingContent(defaultJobPostingContent);
    setHasUploadedCv(false);
    setHasUploadedJobPosting(false);
    setIntervieweeName("");
    setQuestionGoal(getQuestionGoal(defaultInterviewConfig));
    lastTranscriptRef.current = "";
    currentTranscriptRef.current = "";
    startTimeRef.current = null;
    setElapsedMs(0);
  };

  const toggleMicMute = () => {
    setIsMicMuted((previous) => {
      const next = !previous;
      isMicMutedRef.current = next;

      audioStreamRef.current
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = !next));

      if (next) {
        stopRecognition();
        setIsRecording(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        updateSessionState("idle");
      } else if (isConnectedRef.current) {
        if (sessionStateRef.current === "idle") {
          updateSessionState("listening");
        }
        attemptRecognitionStart();
      }

      return next;
    });
  };

  const handleConfigSubmit = (
    config: InterviewConfig,
    cv: string,
    jobPosting: string,
    candidateName: string
  ) => {
    const normalized = normalizeInterviewConfig(config);
    const trimmedCv = cv.trim();
    const trimmedJob = jobPosting.trim();
    const trimmedName = candidateName.trim();

    const mergedCv = trimmedCv || defaultCvContent;
    const mergedJob = trimmedJob || defaultJobPostingContent;

    setShowSetupModal(false);

    void startInterview({
      config: normalized,
      cvContent: mergedCv,
      jobPostingContent: mergedJob,
      hasCv: Boolean(trimmedCv),
      hasJobPosting: Boolean(trimmedJob),
      intervieweeName: trimmedName,
    });
  };

  const switchToCodingRound = () => {
    stopInterview();
    router.push("/coding-interview");
  };

  const handleMicChange = (deviceId: string) => {
    setSelectedMic(deviceId);
  };

  return (
    <div className="min-h-screen">
      <SetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
        onConfigSubmit={handleConfigSubmit}
      />

      <InterviewView
        sessionState={sessionState}
        messages={messages}
        currentTranscript={currentTranscript}
        isLoading={isLoading}
        isRecording={isRecording}
        onMicChange={handleMicChange}
        isConnected={isConnected}
        questionCount={questionCount}
        elapsedMs={elapsedMs}
        onStart={() => {
          void startInterview();
        }}
        onEnd={stopInterview}
        onReset={resetInterview}
        onOpenSetup={() => setShowSetupModal(true)}
        onSwitchToCoding={switchToCodingRound}
        isMicMuted={isMicMuted}
        onToggleMute={toggleMicMute}
      />
    </div>
  );
}
