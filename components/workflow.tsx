"use client";

import { forwardRef, useRef } from "react";
import {
  ArrowDown,
  AudioWaveform,
  Brain,
  ClipboardCheck,
  Code2,
  Headset,
  MessagesSquare,
  Settings2,
  SquareKanban,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBeam } from "@/components/workflow/animated-beam";

const workflowStages = [
  {
    title: "Setup & Personalization",
    icon: Settings2,
    summary:
      "Candidate uploads context, selects the microphone, and tailors the interview mix before joining the room.",
    highlights: [
      "CV or job posting upload with optional name fallback",
      "Hardware setup via microphone picker with permission checks",
      "Difficulty and question category configuration",
    ],
  },
  {
    title: "Voice Interview Loop",
    icon: Headset,
    summary:
      "LiveKit powers the real-time voice room while the agent listens, transcribes, and routes each exchange.",
    highlights: [
      "Bi-directional audio session managed by LiveKit",
      "Speech-to-text transcription streamed to the agent",
      "Adaptive prompts delivered back through text-to-speech",
    ],
  },
  {
    title: "Agent Orchestration",
    icon: Brain,
    summary:
      "Interview state machine decides follow-ups, evaluates answers, and queues coaching moments in real time.",
    highlights: [
      "Conversation memory captured for scoring",
      "Dynamic question selection by role and difficulty",
      "Targeted hints or clarifications when confidence dips",
    ],
  },
  {
    title: "Coding Challenge",
    icon: Code2,
    summary:
      "Candidate can pivot into the collaborative code editor for practical tasks at any point in the interview.",
    highlights: [
      "One-click switch from voice interview to coding round",
      "Inline tests and lint commands inside the editor",
      "Agent supplies hints or review commentary on demand",
    ],
  },
  {
    title: "Scoring & Insights",
    icon: ClipboardCheck,
    summary:
      "Responses, code quality, and communication cues feed into the scoring rubric to generate the recap.",
    highlights: [
      "Competency scoring across behavior, technical, and systems",
      "Automatic transcript summarization",
      "Strengths plus growth opportunities surfaced instantly",
    ],
  },
  {
    title: "Storage & Reporting",
    icon: SquareKanban,
    summary:
      "Artifacts persist for follow-up reviews and can flow into downstream HR tools via export hooks.",
    highlights: [
      "Interview transcript and audio archive",
      "Annotated code submissions with review notes",
      "Dashboard-ready JSON for external systems",
    ],
  },
];

const signalPipelines = [
  {
    name: "Audio",
    icon: AudioWaveform,
    details: [
      "Microphone capture",
      "Noise suppression",
      "Voice activity detection",
    ],
    accentClass: "bg-emerald-500/15 text-emerald-500",
    detailClass: "border-emerald-500/30 bg-emerald-500/5",
    ringClass: "ring-1 ring-emerald-500/20",
    beamColor: "#10b981",
    pathColor: "rgba(16, 185, 129, 0.35)",
  },
  {
    name: "Conversation",
    icon: MessagesSquare,
    details: ["STT transcription", "Prompt routing", "TTS playback"],
    accentClass: "bg-sky-500/15 text-sky-500",
    detailClass: "border-sky-500/30 bg-sky-500/5",
    ringClass: "ring-1 ring-sky-500/20",
    beamColor: "#0ea5e9",
    pathColor: "rgba(14, 165, 233, 0.35)",
  },
  {
    name: "Analysis",
    icon: Brain,
    details: ["Intent classification", "Skill tagging", "Confidence scoring"],
    accentClass: "bg-amber-500/15 text-amber-500",
    detailClass: "border-amber-500/30 bg-amber-500/5",
    ringClass: "ring-1 ring-amber-500/20",
    beamColor: "#f59e0b",
    pathColor: "rgba(245, 158, 11, 0.35)",
  },
] as const;

export function WorkflowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const nodeRefs = [audioRef, conversationRef, analysisRef] as const;

  return (
    <div className="flex flex-col items-center gap-10">
      <section className="grid w-full max-w-5xl gap-6">
        {workflowStages.map((stage, index) => {
          const StageIcon = stage.icon;
          const showArrow = index < workflowStages.length - 1;

          return (
            <div key={stage.title} className="flex flex-col items-center gap-6">
              <Card className="w-full border-2 shadow-sm">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="rounded-md bg-primary/10 p-3">
                    <StageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {stage.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {stage.summary}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
                    {stage.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="rounded-md border border-border/60 bg-muted/30 px-3 py-2"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {showArrow && (
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </section>

      <section className="w-full max-w-5xl">
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Real-time Signal Pipelines
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Audio, conversation, and analysis streams run in parallel so the
              agent stays responsive and context-aware.
            </p>
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              className="relative grid gap-6 md:grid-cols-3"
            >
              {signalPipelines.map((pipeline, index) => (
                <PipelineNode
                  key={pipeline.name}
                  ref={nodeRefs[index]}
                  icon={pipeline.icon}
                  name={pipeline.name}
                  details={pipeline.details}
                  accentClass={pipeline.accentClass}
                  detailClass={pipeline.detailClass}
                  ringClass={pipeline.ringClass}
                />
              ))}

              {nodeRefs.slice(0, -1).map((fromRef, index) => (
                <AnimatedBeam
                  key={`${signalPipelines[index].name}-${
                    signalPipelines[index + 1].name
                  }`}
                  className="hidden md:block"
                  containerRef={containerRef}
                  fromRef={fromRef}
                  toRef={nodeRefs[index + 1]}
                  gradientStartColor={signalPipelines[index].beamColor}
                  gradientStopColor={signalPipelines[index + 1].beamColor}
                  pathColor={signalPipelines[index].pathColor}
                  pathWidth={3}
                  pathOpacity={0.45}
                  particleColor={signalPipelines[index].beamColor}
                  particleSize={3}
                  particleSpeed={3.5}
                  particleCount={3}
                  delay={index * 0.35}
                  curvature={60}
                  startXOffset={112}
                  endXOffset={-112}
                  startYOffset={-36}
                  endYOffset={-36}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface PipelineNodeProps {
  icon: LucideIcon;
  name: string;
  details: readonly string[];
  accentClass: string;
  detailClass: string;
  ringClass: string;
}

const PipelineNode = forwardRef<HTMLDivElement, PipelineNodeProps>(
  ({ icon: Icon, name, details, accentClass, detailClass, ringClass }, ref) => (
    <div
      ref={ref}
      className={`relative z-10 h-full overflow-hidden rounded-xl border border-border/60 bg-background/85 p-5 shadow-sm backdrop-blur ${ringClass}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-md p-2 ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">{name}</h4>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {details.map((detail) => (
          <li
            key={detail}
            className={`rounded-md border px-3 py-2 text-xs ${detailClass}`}
          >
            {detail}
          </li>
        ))}
      </ul>
    </div>
  )
);

PipelineNode.displayName = "PipelineNode";
