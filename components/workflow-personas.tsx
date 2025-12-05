"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import {
  ArrowDown,
  ArrowRightLeft,
  Bot,
  Brain,
  CheckCircle,
  ClipboardCheck,
  Code2,
  FileText,
  Loader2,
  MessageSquare,
  Mic,
  NotebookPen,
  Settings2,
  Sparkle,
  Upload,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBeam } from "@/components/workflow/animated-beam";

const personaFlow = [
  {
    step: "01",
    title: "Personalise",
    user: {
      icon: Upload,
      label: "Candidate",
      accent: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
    },
    agent: {
      icon: Bot,
      label: "AI Agent",
      accent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    },
    transition: {
      icon: Sparkle,
      label: "Context Sync",
    },
  },
  {
    step: "02",
    title: "Kick Off",
    user: {
      icon: Mic,
      label: "Candidate",
      accent: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    },
    agent: {
      icon: Brain,
      label: "AI Agent",
      accent: "bg-violet-500/10 text-violet-500 border-violet-500/30",
    },
    transition: {
      icon: MessageSquare,
      label: "Session Start",
    },
  },
  {
    step: "03",
    title: "Interview Loop",
    user: {
      icon: User,
      label: "Candidate",
      accent: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    },
    agent: {
      icon: NotebookPen,
      label: "AI Agent",
      accent: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    },
    transition: {
      icon: ArrowRightLeft,
      label: "Turn Taking",
    },
  },
  {
    step: "04",
    title: "Coding Challenge",
    user: {
      icon: Code2,
      label: "Candidate",
      accent: "bg-teal-500/10 text-teal-500 border-teal-500/30",
    },
    agent: {
      icon: ClipboardCheck,
      label: "AI Agent",
      accent: "bg-lime-500/10 text-lime-500 border-lime-500/30",
    },
    transition: {
      icon: FileText,
      label: "Review & Score",
    },
  },
] as const;

type ComponentState = "idle" | "loading" | "success";

export function PersonaWorkflowDiagram() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [componentStates, setComponentStates] = useState<
    Record<string, ComponentState>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize all refs upfront to avoid conditional hook calls
  const user01Ref = useRef<HTMLDivElement>(null);
  const user02Ref = useRef<HTMLDivElement>(null);
  const user03Ref = useRef<HTMLDivElement>(null);
  const user04Ref = useRef<HTMLDivElement>(null);

  const agent01Ref = useRef<HTMLDivElement>(null);
  const agent02Ref = useRef<HTMLDivElement>(null);
  const agent03Ref = useRef<HTMLDivElement>(null);
  const agent04Ref = useRef<HTMLDivElement>(null);

  const transition01Ref = useRef<HTMLDivElement>(null);
  const transition02Ref = useRef<HTMLDivElement>(null);
  const transition03Ref = useRef<HTMLDivElement>(null);
  const transition04Ref = useRef<HTMLDivElement>(null);

  // Helper functions to access refs
  const getUserRef = (step: string) => {
    switch (step) {
      case "01":
        return user01Ref;
      case "02":
        return user02Ref;
      case "03":
        return user03Ref;
      case "04":
        return user04Ref;
      default:
        return user01Ref;
    }
  };

  const getAgentRef = (step: string) => {
    switch (step) {
      case "01":
        return agent01Ref;
      case "02":
        return agent02Ref;
      case "03":
        return agent03Ref;
      case "04":
        return agent04Ref;
      default:
        return agent01Ref;
    }
  };

  const getTransitionRef = (step: string) => {
    switch (step) {
      case "01":
        return transition01Ref;
      case "02":
        return transition02Ref;
      case "03":
        return transition03Ref;
      case "04":
        return transition04Ref;
      default:
        return transition01Ref;
    }
  };

  const updateComponentState = (key: string, state: ComponentState) => {
    setComponentStates((prev) => ({ ...prev, [key]: state }));
  };

  const startAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(true);
    setComponentStates({});

    let currentStep = 0;
    const animateNextStep = () => {
      if (currentStep < personaFlow.length) {
        const stage = personaFlow[currentStep];

        setTimeout(() => {
          setAnimationStep(currentStep + 1);

          // Set user component to loading
          updateComponentState(`user-${stage.step}`, "loading");

          setTimeout(() => {
            // User completes, transition activates
            updateComponentState(`user-${stage.step}`, "success");
            updateComponentState(`transition-${stage.step}`, "loading");

            setTimeout(() => {
              // Transition completes, agent starts
              updateComponentState(`transition-${stage.step}`, "success");
              updateComponentState(`agent-${stage.step}`, "loading");

              setTimeout(() => {
                // Agent completes
                updateComponentState(`agent-${stage.step}`, "success");

                currentStep++;
                if (currentStep < personaFlow.length) {
                  animateNextStep();
                } else {
                  setTimeout(() => setIsAnimating(false), 1000);
                }
              }, 800);
            }, 600);
          }, 800);
        }, 500);
      }
    };

    setTimeout(animateNextStep, 500);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isAnimating && animationStep === 0) {
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isAnimating, animationStep]);

  useEffect(() => {
    if (animationStep === personaFlow.length && !isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [animationStep, isAnimating]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-12 overflow-hidden"
    >
      {personaFlow.map((stage, index) => {
        const userState = componentStates[`user-${stage.step}`] || "idle";
        const agentState = componentStates[`agent-${stage.step}`] || "idle";
        const transitionState =
          componentStates[`transition-${stage.step}`] || "idle";
        const isStageActive = animationStep > index;

        return (
          <div key={stage.step} className="space-y-8">
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto_1fr]">
              <PersonaBox
                ref={getUserRef(stage.step)}
                icon={stage.user.icon}
                label={stage.user.label}
                accent={stage.user.accent}
                state={userState}
              />

              <TransitionBox
                ref={getTransitionRef(stage.step)}
                title={stage.title}
                icon={stage.transition.icon}
                label={stage.transition.label}
                state={transitionState}
              />

              <PersonaBox
                ref={getAgentRef(stage.step)}
                icon={stage.agent.icon}
                label={stage.agent.label}
                accent={stage.agent.accent}
                state={agentState}
              />

              {/* Animated beams */}
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={getUserRef(stage.step)}
                toRef={getTransitionRef(stage.step)}
                isActive={isStageActive && userState === "success"}
                gradientStartColor="#6366f1"
                gradientStopColor="#8b5cf6"
                pathColor="rgba(99, 102, 241, 0.3)"
                pathWidth={2}
                particleSize={2.5}
                particleSpeed={2.5}
                particleCount={2}
                curvature={40}
              />

              <AnimatedBeam
                containerRef={containerRef}
                fromRef={getTransitionRef(stage.step)}
                toRef={getAgentRef(stage.step)}
                isActive={isStageActive && transitionState === "success"}
                gradientStartColor="#8b5cf6"
                gradientStopColor="#10b981"
                pathColor="rgba(139, 92, 246, 0.3)"
                pathWidth={2}
                particleSize={2.5}
                particleSpeed={2.5}
                particleCount={2}
                curvature={40}
              />
            </div>

            {index < personaFlow.length - 1 && (
              <div className="relative flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
            )}

            {index === personaFlow.length - 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {personaFlow.map((stage, i) => (
                    <div
                      key={stage.step}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i < animationStep
                          ? "bg-green-500"
                          : i === animationStep
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface PersonaBoxProps {
  icon: LucideIcon;
  label: string;
  accent: string;
  state?: ComponentState;
}

const PersonaBox = forwardRef<HTMLDivElement, PersonaBoxProps>(
  ({ icon: Icon, label, accent, state = "idle" }, ref) => {
    const getStateIcon = () => {
      switch (state) {
        case "loading":
          return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
        case "success":
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 backdrop-blur-sm transition-all duration-500 ${
          state === "loading"
            ? "border-blue-400 bg-blue-50/50 shadow-lg scale-105 ring-2 ring-blue-400/20"
            : state === "success"
            ? "border-green-400 bg-green-50/50 shadow-md ring-2 ring-green-400/20"
            : "border-border/40 bg-card/50"
        }`}
      >
        <div className={`rounded-lg p-3 ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {getStateIcon() && (
          <div className="absolute -top-2 -right-2 rounded-full bg-background p-1 shadow-md">
            {getStateIcon()}
          </div>
        )}
      </div>
    );
  }
);

PersonaBox.displayName = "PersonaBox";

interface TransitionBoxProps {
  title: string;
  icon: LucideIcon;
  label: string;
  state?: ComponentState;
}

const TransitionBox = forwardRef<HTMLDivElement, TransitionBoxProps>(
  ({ title, icon: Icon, label, state = "idle" }, ref) => {
    const getStateIcon = () => {
      switch (state) {
        case "loading":
          return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
        case "success":
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        default:
          return null;
      }
    };

    return (
      <div ref={ref} className="flex flex-col items-center gap-3 text-center">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
        <div
          className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 backdrop-blur-sm transition-all duration-500 ${
            state === "loading"
              ? "border-blue-400 bg-blue-50/50 animate-pulse"
              : state === "success"
              ? "border-green-400 bg-green-50/50"
              : "border-border/40 bg-muted/30"
          }`}
        >
          <div
            className={`rounded-full p-2 transition-colors ${
              state === "loading"
                ? "bg-blue-100 text-blue-600"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          {getStateIcon() && (
            <div className="absolute -top-2 -right-2 rounded-full bg-background p-1 shadow-md">
              {getStateIcon()}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TransitionBox.displayName = "TransitionBox";
