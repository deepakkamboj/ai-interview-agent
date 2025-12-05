"use client";

import Link from "next/link";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { SampleQuestions } from "@/components/sample-questions";
import { WorkflowDiagram } from "@/components/workflow";
import { PersonaWorkflowDiagram } from "@/components/workflow-personas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Bot,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Mic,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const navAnchors = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#architecture", label: "Architecture" },
  { href: "#workflow", label: "Workflow" },
  { href: "#persona-workflow", label: "Agent & Candidate" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#features", label: "Features" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold">InterviewAI</span>
          </div>
          <div className="hidden items-center gap-6 text-sm md:flex">
            {navAnchors.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/coding-interview">Coding Practice</Link>
            </Button>
            <Button asChild>
              <Link href="/demo">Voice Demo</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="hidden lg:inline-flex"
            >
              <Link href="/interview-results">Sample Results</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Badge
            variant="secondary"
            className="mb-6 inline-flex items-center gap-2 uppercase tracking-wide"
          >
            AI-Powered Interview Practice
          </Badge>
          <h1 className="text-4xl font-bold md:text-6xl">
            Master Your Interviews with AI
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Practice with a lifelike AI interviewer. Powered by LiveKit,
            real-time speech processing, and Mistral AI for personalised
            preparation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/demo">
                <Mic className="h-5 w-5" /> Try Demo
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/coding-interview">Coding Interview</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/interview-results">Review Results</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mic className="h-5 w-5" /> Voice Recognition
            </span>
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5" /> Mistral AI
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Real-time Chat
            </span>
          </div>
        </div>
      </section>

      <section id="problem" className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <Card className="border-2 border-destructive/20">
              <CardHeader className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-2xl">The Problem</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ProblemItem
                  icon={Target}
                  title="Interview Anxiety"
                  description="Nervousness leads to missed opportunities and weak delivery."
                />
                <ProblemItem
                  icon={Clock}
                  title="Limited Practice Access"
                  description="Quality interview practice is hard to schedule and sustain."
                />
                <ProblemItem
                  icon={Users}
                  title="Generic Preparation"
                  description="One-size-fits-all prep rarely matches specific roles or industries."
                />
                <ProblemItem
                  icon={MessageSquare}
                  title="No Real-time Feedback"
                  description="Hard to improve without immediate, actionable guidance."
                />
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">The Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <ProblemItem
                  icon={Bot}
                  title="AI-Powered Practice"
                  description="Mock interviews anytime with intelligent, context-aware responses."
                />
                <ProblemItem
                  icon={Target}
                  title="Personalised Questions"
                  description="Prompting tailored to your CV, experience, and desired role."
                />
                <ProblemItem
                  icon={Mic}
                  title="Voice Interaction"
                  description="Realistic, natural conversations with speech recognition and synthesis."
                />
                <ProblemItem
                  icon={TrendingUp}
                  title="Performance Analytics"
                  description="Detailed transcripts and insights to track progress over time."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="solution" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">Our AI Interview Agent</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Conducts realistic interviews, provides targeted follow-ups, and
              helps you prepare with confidence.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Mic}
              title="Voice Interaction"
              description="Natural voice-to-voice conversations with real-time STT and TTS."
            />
            <FeatureCard
              icon={Brain}
              title="Smart Questions"
              description="AI generates behavioural, technical, and situational prompts."
            />
            <FeatureCard
              icon={FileText}
              title="Full Transcripts"
              description="Save and review conversations to reinforce interview skills."
            />
          </div>
        </div>
      </section>

      <section id="architecture" className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">System Architecture</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              How real-time audio, AI processing, and storage work together.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-5xl">
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      <section id="workflow" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">Interview Workflow</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From onboarding to actionable feedback in six simple steps.
            </p>
          </div>
          <div className="mx-auto mt-12">
            <WorkflowDiagram />
          </div>
        </div>
      </section>

      <section id="persona-workflow" className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">Agent & Candidate Collaboration</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how the AI interviewer and candidate coordinate through each stage,
              sharing context, signals, and artifacts in real time.
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-5xl">
            <PersonaWorkflowDiagram />
          </div>
        </div>
      </section>

      <section id="tech-stack" className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">Technology Stack</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Modern tooling across the full experience.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <TechCard
              title="Frontend"
              items={[
                "React",
                "TypeScript",
                "Next.js",
                "Tailwind CSS",
                "shadcn/ui",
                "Zod",
              ]}
            />
            <TechCard
              title="Real-time"
              items={["LiveKit", "WebRTC", "Speech-to-Text", "Text-to-Speech"]}
            />
            <TechCard
              title="AI & Backend"
              items={[
                "Mistral AI",
                "OpenAI Whisper",
                "Edge Functions",
                "Serverless APIs",
              ]}
            />
            <TechCard
              title="Ops & Delivery"
              items={["PostgreSQL", "File Storage", "Vercel", "CI/CD"]}
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold">Key Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to prepare like a pro.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="Real-time Processing"
              description="Instant speech recognition and responses for natural flow."
            />
            <FeatureCard
              icon={FileText}
              title="Document Upload"
              description="Drag-and-drop CVs and job posts for personalised questions."
            />
            <FeatureCard
              icon={Brain}
              title="Customisable Questions"
              description="Configure interview focus areas to match the role."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Full Transcripts"
              description="Downloadable transcripts for review and coaching."
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Encrypted storage, private sessions, and user control."
            />
            <FeatureCard
              icon={Mic}
              title="Voice Interaction"
              description="Practice speaking naturally with lifelike AI voices."
            />
          </div>
        </div>
      </section>

      <SampleQuestions />

      <section className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold">
              Ready to ace your next interview?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start practicing with AI today and walk into your next interview
              with confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/demo">Try Demo Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/coding-interview">Start Coding Practice</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/interview-results">See Sample Results</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>
              © {new Date().getFullYear()} InterviewAI. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

interface ProblemItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function ProblemItem({ icon: Icon, title, description }: ProblemItemProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 h-5 w-5 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="space-y-3">
        <Icon className="h-8 w-8 text-primary" />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface TechCardProps {
  title: string;
  items: string[];
}

function TechCard({ title, items }: TechCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item} variant="secondary" className="px-3 py-1">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
