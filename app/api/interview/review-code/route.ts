import { generateText } from "ai";
import { createMistral } from "@ai-sdk/mistral";
import { type NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { code, problemDescription, language } = await req.json();

    if (!code || !problemDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert code reviewer and software engineer. Your task is to review the submitted code and provide constructive feedback. 

Analyze the code for:
1. Correctness - Does it solve the problem correctly?
2. Code Quality - Is the code clean, readable, and well-structured?
3. Efficiency - Is it optimal in terms of time and space complexity?
4. Best Practices - Does it follow best practices for the language?
5. Edge Cases - Does it handle edge cases properly?

Provide your review in a structured format with:
- A score from 0-100
- Positive aspects of the code
- Issues found (if any)
- Suggestions for improvement
- Corrected code if needed`;

    const userPrompt = `Please review this ${language} code for the following problem:

Problem: ${problemDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide detailed feedback and a score.`;

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing MISTRAL_API_KEY. Add it to your environment (.env, Vercel project settings, etc.).",
        },
        { status: 500 }
      );
    }

    const mistral = createMistral({ apiKey });

    const { text } = await generateText({
      model: mistral("mistral-small-latest"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Parse the review to extract score and feedback
    const scoreMatch = text.match(/(\d+)\s*(?:\/|out of|out)\s*100/);
    const score = scoreMatch ? Number.parseInt(scoreMatch[1]) : 75;

    return NextResponse.json({
      review: text,
      score,
      feedback: {
        issues: extractIssues(text),
        suggestions: extractSuggestions(text),
      },
    });
  } catch (error) {
    console.error("[v0] Code review error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to review code";

    if (message.toLowerCase().includes("fetch")) {
      return NextResponse.json(
        {
          error:
            "Network error connecting to Mistral. Confirm your internet connection and that the Mistral API key is valid.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractIssues(text: string): string[] {
  const issuesMatch = text.match(
    /(?:issue|problem|bug|error)s?:?\s*\n?([\s\S]*?)(?:\n\n|suggestions?:|$)/i
  );
  if (!issuesMatch) return [];
  return issuesMatch[1]
    .split("\n")
    .filter(
      (line) => line.trim().startsWith("-") || line.trim().startsWith("•")
    )
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

function extractSuggestions(text: string): string[] {
  const suggestionsMatch = text.match(
    /suggestions?:?\s*\n?([\s\S]*?)(?:\n\n|$)/i
  );
  if (!suggestionsMatch) return [];
  return suggestionsMatch[1]
    .split("\n")
    .filter(
      (line) => line.trim().startsWith("-") || line.trim().startsWith("•")
    )
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter((line) => line.length > 0);
}
