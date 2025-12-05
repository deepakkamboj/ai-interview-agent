import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface SummaryCategory {
  name: string;
  score: number;
  feedback: string;
  color?: string;
}

interface InterviewSummaryPayload {
  overallScore: number;
  categories: SummaryCategory[];
  strengths: string[];
  improvements: string[];
}

interface InterviewMessage {
  id: string;
  role: "candidate" | "assistant";
  content: string;
  timestampLabel: string;
}

const fallbackSummary: InterviewSummaryPayload = {
  overallScore: 78,
  categories: [
    {
      name: "Communication",
      score: 85,
      feedback: "Excellent verbal communication. Speak clearly and concisely.",
      color: "text-green-600",
    },
    {
      name: "Technical Knowledge",
      score: 72,
      feedback:
        "Good foundation. Consider deepening knowledge in system design.",
      color: "text-blue-600",
    },
    {
      name: "Problem Solving",
      score: 80,
      feedback: "Strong analytical approach. Break down complex problems well.",
      color: "text-purple-600",
    },
    {
      name: "Confidence",
      score: 75,
      feedback: "Good confidence level. Try to reduce filler words.",
      color: "text-orange-600",
    },
  ],
  strengths: [
    "Clear and articulate communication",
    "Good problem-solving approach",
    "Demonstrates enthusiasm for the role",
    "Asks thoughtful questions",
  ],
  improvements: [
    "Provide more specific examples from past experience",
    "Structure answers using STAR method",
    "Research company background more thoroughly",
    "Practice technical concepts in more depth",
  ],
};

const fallbackTranscript: InterviewMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Welcome! Could you introduce yourself and highlight your current role?",
    timestampLabel: "10:00 AM",
  },
  {
    id: "2",
    role: "candidate",
    content:
      "I'm a full-stack engineer with five years of experience building SaaS platforms in React and Node.js.",
    timestampLabel: "10:01 AM",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Great. Tell me about a recent technical challenge you tackled and the outcome.",
    timestampLabel: "10:02 AM",
  },
  {
    id: "4",
    role: "candidate",
    content:
      "I led the migration of our legacy monolith to a modular Next.js architecture, improving load times by 40% and reducing costs.",
    timestampLabel: "10:03 AM",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "What strategies do you use to collaborate effectively with cross-functional partners?",
    timestampLabel: "10:05 AM",
  },
  {
    id: "6",
    role: "candidate",
    content:
      "I run weekly syncs with design and product, document decisions in Notion, and ensure everyone has clear success metrics.",
    timestampLabel: "10:06 AM",
  },
];

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function InterviewResultsPage({ searchParams = {} }: PageProps) {
  const scoreValue = searchParams["score"];
  const rawScore = Array.isArray(scoreValue) ? scoreValue[0] : scoreValue;
  const parsedScore = Number.parseInt(rawScore ?? "", 10);
  const summary: InterviewSummaryPayload =
    !Number.isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 100
      ? { ...fallbackSummary, overallScore: parsedScore }
      : fallbackSummary;

  const transcript = fallbackTranscript;
  const overallScore = summary.overallScore;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/demo">
                <ArrowLeft className="h-4 w-4" />
                Back to Interview
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-primary">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">
                AI Assessment Summary
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Interview Results
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl">Overall Performance</CardTitle>
              <CardDescription>
                Compiled from your most recent AI interview session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary">
                    {overallScore}%
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {overallScore >= 80
                      ? "Excellent"
                      : overallScore >= 60
                      ? "Good"
                      : "Needs Improvement"}
                  </div>
                </div>
              </div>
              <Progress value={overallScore} className="h-2" />
            </CardContent>
          </Card>

          <section className="grid gap-6 md:grid-cols-2">
            {summary.categories.map((category) => (
              <Card key={category.name}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <Badge variant="outline" className={category.color ?? ""}>
                    {category.score}%
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={category.score} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {category.feedback}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <Card className="border-green-200 bg-green-50/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {summary.strengths.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Target className="h-5 w-5" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {summary.improvements.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <TrendingDown className="mt-0.5 h-4 w-4 text-orange-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript Snapshot</CardTitle>
                <CardDescription>
                  Review the closing moments of your session. Download the full
                  transcript from the interview console.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcript.slice(-6).map((message) => (
                  <div
                    key={message.id}
                    className="rounded-lg border border-border bg-card/70 p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {message.role === "candidate"
                          ? "You"
                          : "AI Interviewer"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestampLabel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="flex flex-wrap justify-center gap-4 pt-6">
            <Button asChild size="lg">
              <Link href="/demo">Practice Again</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/coding-interview">Try Coding Interview</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/">Back to Home</Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
