"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/public/placeholder-logo.png";

const Editor = dynamic(
  async () => {
    const mod = await import("@monaco-editor/react");
    return mod.default;
  },
  { ssr: false }
);

interface Feedback {
  type: "success" | "warning" | "suggestion";
  message: string;
}

export default function CodingInterviewPage() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here
  
}`);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const problem = {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists",
    ],
  };

  const handleRunCode = async () => {
    setIsAnalyzing(true);
    toast("Analyzing Code", {
      description: "AI is reviewing your solution...",
    });

    setTimeout(() => {
      const mockFeedback: Feedback[] = [
        {
          type: "success",
          message: "Good use of variable names and code structure.",
        },
        {
          type: "warning",
          message:
            "Consider edge cases: What if the array is empty or has only one element?",
        },
        {
          type: "suggestion",
          message:
            "Time complexity could be improved from O(n²) to O(n) using a hash map.",
        },
        {
          type: "suggestion",
          message:
            "Add input validation to check if nums and target are valid.",
        },
      ];

      setFeedback(mockFeedback);
      setIsAnalyzing(false);

      toast("Analysis Complete", {
        description: "Review the feedback below to improve your solution.",
      });
    }, 2000);
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getFeedbackBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-950/20 border-green-200";
      case "warning":
        return "bg-orange-50 dark:bg-orange-950/20 border-orange-200";
      case "suggestion":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4 gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-3">
            <Image
              src={logo}
              alt="AI Interview Agent Logo"
              className="h-10 w-10"
            />
            <h1 className="text-3xl font-bold text-foreground">
              Coding Interview
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{problem.title}</CardTitle>
                  <Badge
                    variant={
                      problem.difficulty === "Easy" ? "outline" : "default"
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </div>
                <CardDescription>{problem.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Examples:</h3>
                  {problem.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="mb-2 rounded-md bg-muted p-3 text-sm"
                    >
                      <div>
                        <strong>Input:</strong> {example.input}
                      </div>
                      <div>
                        <strong>Output:</strong> {example.output}
                      </div>
                      {example.explanation ? (
                        <div className="mt-1 text-muted-foreground">
                          {example.explanation}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Constraints:</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {feedback.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>AI Code Review</CardTitle>
                  <CardDescription>
                    Suggestions to improve your solution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {feedback.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-3 ${getFeedbackBg(
                        item.type
                      )}`}
                    >
                      <div className="flex items-start gap-3">
                        {getFeedbackIcon(item.type)}
                        <p className="text-sm">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Solution</CardTitle>
                <CardDescription>Write your code below</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <Editor
                    height="400px"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value ?? "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={handleRunCode}
                disabled={isAnalyzing}
                className="flex-1"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                {isAnalyzing ? "Analyzing..." : "Run & Get Feedback"}
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/demo">Voice Interview</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
