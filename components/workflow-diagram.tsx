import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  Brain,
  FileDown,
  Mic,
  Play,
  Settings,
  Upload,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Documents",
    description: "User uploads CV & job posting to the system",
  },
  {
    icon: Settings,
    title: "Configure Questions",
    description:
      "Set the mix of behavioral, technical, and situational questions",
  },
  {
    icon: Play,
    title: "Start Interview",
    description: "Connect to the LiveKit room and begin the session",
  },
  {
    icon: Brain,
    title: "AI Interaction",
    description: "AI generates questions, listens, and provides follow-ups",
  },
  {
    icon: Mic,
    title: "Voice Conversation",
    description: "Real-time speech-to-text and text-to-speech communication",
  },
  {
    icon: FileDown,
    title: "Save Transcript",
    description: "Close the interview and download the conversation transcript",
  },
] as const;

export function WorkflowDiagram() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        return (
          <div
            key={step.title}
            className="flex w-full flex-col items-center gap-3"
          >
            <Card className="w-full border shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <StepIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded px-2 py-1 text-xs font-semibold text-primary">
                      STEP {index + 1}
                    </span>
                    <h4 className="text-base font-semibold text-foreground">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            {index < steps.length - 1 && (
              <ArrowDown className="h-5 w-5 text-primary" />
            )}
          </div>
        );
      })}
    </div>
  );
}
