"use client";

import Link from "next/link";
import { Bot, ArrowLeft, Sparkles } from "lucide-react";
import { InterviewSession } from "@/components/interview-session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <div className="hidden text-sm text-muted-foreground md:flex md:items-center md:gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Live AI Interview Experience
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3">
              <Bot className="h-9 w-9 text-primary" />
              <h1 className="text-3xl font-semibold">AI Interview Agent</h1>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Practice interview conversations with real-time voice recognition,
              adaptive questioning, and instant feedback.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-2">
        <section className="mx-auto flex max-w-5xl flex-col gap-10">
          <Card className="border border-border/70 shadow-lg">
            <div className="rounded-3xl bg-card/60 p-4 md:p-8">
              <InterviewSession />
            </div>
          </Card>

          <aside className="rounded-3xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            Tip: Use a quiet space and a quality microphone for the best
            recognition accuracy. You can restart the session anytime from the
            controls.
          </aside>
        </section>
      </div>

      <footer className="border-t border-border bg-card/80 py-6 text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-col items-center gap-3 px-4 md:flex-row md:justify-between">
          <span>Powered by LiveKit • Practice makes perfect</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
