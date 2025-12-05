import { generateText } from "ai";
import { createMistral } from "@ai-sdk/mistral";

interface InterviewConfig {
  technicalCount: number;
  behavioralCount: number;
  rolesCount: number;
  systemDesignCount: number;
  difficulty: "easy" | "medium" | "hard";
}

export async function POST(req: Request) {
  const { transcript, cvContent, jobPostingContent, config, questionCount } =
    await req.json();

  if (!transcript) {
    return Response.json({ error: "No transcript provided" }, { status: 400 });
  }

  try {
    const totalQuestions =
      (config?.technicalCount || 0) +
      (config?.behavioralCount || 0) +
      (config?.rolesCount || 0) +
      (config?.systemDesignCount || 0);

    // Determine which type of question to ask based on config
    let questionTypeGuidance = "";
    if (config && questionCount < totalQuestions) {
      const technicalQuestions = config.technicalCount || 0;
      const behavioralQuestions = config.behavioralCount || 0;
      const roleQuestions = config.rolesCount || 0;
      const systemDesignQuestions = config.systemDesignCount || 0;

      const currentQuestion = questionCount;

      if (currentQuestion < technicalQuestions) {
        questionTypeGuidance =
          "Ask a TECHNICAL question about coding, algorithms, or problem-solving skills.";
      } else if (currentQuestion < technicalQuestions + behavioralQuestions) {
        questionTypeGuidance =
          "Ask a BEHAVIORAL question using the STAR method (Situation, Task, Action, Result). Focus on soft skills, teamwork, and past experiences.";
      } else if (
        currentQuestion <
        technicalQuestions + behavioralQuestions + roleQuestions
      ) {
        questionTypeGuidance =
          "Ask a ROLE-SPECIFIC question directly related to the job posting requirements and the candidate's CV alignment.";
      } else {
        questionTypeGuidance =
          "Ask a SYSTEM DESIGN question about architecture, scalability, or design patterns.";
      }
    }

    const contextSection =
      cvContent || jobPostingContent
        ? `
CANDIDATE CONTEXT:
${cvContent ? `CV Summary: ${cvContent.substring(0, 500)}...` : ""}
${
  jobPostingContent
    ? `Job Requirements: ${jobPostingContent.substring(0, 500)}...`
    : ""
}
`
        : "";

    const difficultyLevel = config?.difficulty || "medium";
    const difficultyGuidance = {
      easy: "Ask beginner-friendly questions focusing on fundamentals and basic concepts.",
      medium:
        "Ask intermediate-level questions that require solid understanding and some problem-solving.",
      hard: "Ask challenging questions that require deep expertise, optimization thinking, and advanced concepts.",
    }[difficultyLevel];

    const systemPrompt = `You are an experienced technical interview interviewer conducting a professional interview.

INTERVIEW CONTEXT:
${contextSection}
Difficulty Level: ${difficultyLevel} - ${difficultyGuidance}
${questionTypeGuidance}

Your responsibilities:
1. Ask ONE clear, focused question per turn
2. Listen carefully to the candidate's response
3. Provide brief, constructive feedback (1 sentence)
4. Ask follow-up or next question relevant to the interview flow
5. Keep responses concise (max 3 sentences)
6. Be professional, encouraging, and fair
7. Adapt questions based on the candidate's responses

Current question: ${questionCount + 1} of ${totalQuestions}
${
  questionCount >= totalQuestions
    ? "Thank the candidate for their time and summarize key takeaways."
    : ""
}`;

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return Response.json(
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
      prompt: transcript,
      temperature: 0.7,
      maxTokens: 200,
    });

    return Response.json({ response: text });
  } catch (error) {
    console.error("AI generation error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Error details:", {
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (errorMessage.toLowerCase().includes("fetch")) {
      return Response.json(
        {
          error:
            "Network error connecting to Mistral. Confirm your internet connection and that the Mistral API key is valid.",
        },
        { status: 503 }
      );
    }

    return Response.json(
      { error: `Failed to generate response: ${errorMessage}` },
      { status: 500 }
    );
  }
}
