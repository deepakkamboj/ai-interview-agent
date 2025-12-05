"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Question {
  question: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const questions: Record<string, Question[]> = {
  behavioral: [
    {
      question:
        "Tell me about a time when you had to deal with a difficult team member.",
      category: "Teamwork",
      difficulty: "Medium",
    },
    {
      question: "Describe a situation where you had to meet a tight deadline.",
      category: "Time Management",
      difficulty: "Easy",
    },
    {
      question:
        "Can you give an example of when you had to handle conflict in the workplace?",
      category: "Conflict Resolution",
      difficulty: "Hard",
    },
    {
      question: "Tell me about a time you failed and what you learned from it.",
      category: "Self-Awareness",
      difficulty: "Medium",
    },
  ],
  hr: [
    {
      question: "Why do you want to work for our company?",
      category: "Motivation",
      difficulty: "Easy",
    },
    {
      question: "Where do you see yourself in 5 years?",
      category: "Career Goals",
      difficulty: "Easy",
    },
    {
      question: "What are your salary expectations?",
      category: "Compensation",
      difficulty: "Medium",
    },
    {
      question: "Why are you leaving your current job?",
      category: "Career Change",
      difficulty: "Medium",
    },
  ],
  technical: [
    {
      question: "Explain the difference between SQL and NoSQL databases.",
      category: "Database",
      difficulty: "Easy",
    },
    {
      question: "What is the difference between REST and GraphQL?",
      category: "API Design",
      difficulty: "Medium",
    },
    {
      question: "How would you design a URL shortening service like bit.ly?",
      category: "System Design",
      difficulty: "Hard",
    },
    {
      question: "Explain the concept of closures in JavaScript.",
      category: "Programming",
      difficulty: "Medium",
    },
    {
      question: "What are the SOLID principles in software engineering?",
      category: "Software Design",
      difficulty: "Medium",
    },
  ],
  coding: [
    {
      question: "Reverse a linked list",
      category: "Data Structures",
      difficulty: "Easy",
    },
    {
      question: "Find the longest substring without repeating characters",
      category: "Strings",
      difficulty: "Medium",
    },
    {
      question: "Implement an LRU cache",
      category: "Design",
      difficulty: "Hard",
    },
    {
      question: "Binary tree level order traversal",
      category: "Trees",
      difficulty: "Medium",
    },
  ],
};

function difficultyTone(difficulty: Question["difficulty"]) {
  switch (difficulty) {
    case "Easy":
      return "bg-secondary/80 text-secondary-foreground border-secondary/60";
    case "Medium":
      return "bg-accent/80 text-accent-foreground border-accent/60";
    case "Hard":
      return "bg-destructive/15 text-destructive border-destructive/40";
    default:
      return "";
  }
}

export function SampleQuestions() {
  return (
    <section id="sample-questions" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-foreground">
            Sample Interview Questions
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Practice with real interview questions across behavioral, HR,
            technical, and coding categories.
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="behavioral" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="hr">HR</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="coding">Coding</TabsTrigger>
            </TabsList>
            {Object.entries(questions).map(([key, questionList]) => (
              <TabsContent key={key} value={key} className="space-y-4 pt-4">
                {questionList.map((item) => (
                  <Card
                    key={item.question}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle className="text-lg leading-relaxed text-foreground">
                            {item.question}
                          </CardTitle>
                          <CardDescription>{item.category}</CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={difficultyTone(item.difficulty)}
                        >
                          {item.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
