import type { SessionMessage } from "@/lib/chat-types";

export type InterviewDifficulty = "easy" | "medium" | "hard";

export interface InterviewConfig {
  technicalCount: number;
  behavioralCount: number;
  rolesCount: number;
  systemDesignCount: number;
  difficulty: InterviewDifficulty;
}

export interface SiteConfig {
  defaults: {
    interviewConfig: InterviewConfig;
    cvContent: string;
    jobPostingContent: string;
    minimumQuestions: number;
  };
  limits: {
    minQuestionsPerCategory: number;
    maxQuestionsPerCategory: number;
  };
  ui: {
    emptyChatMessage: string;
    typingIndicatorLabel: string;
  };
}

export const siteConfig: SiteConfig = {
  defaults: {
    interviewConfig: {
      technicalCount: 3,
      behavioralCount: 3,
      rolesCount: 2,
      systemDesignCount: 1,
      difficulty: "medium",
    },
    cvContent:
      "Candidate is a software engineer with experience in TypeScript, React, and cloud services. Key strengths include building customer-facing web applications, collaborating with cross-functional teams, and mentoring junior developers.",
    jobPostingContent:
      "Company is hiring a senior full-stack engineer to build AI-assisted interview experiences. The role values practical problem solving, system design rigor, and effective communication across product and research teams.",
    minimumQuestions: 6,
  },
  limits: {
    minQuestionsPerCategory: 1,
    maxQuestionsPerCategory: 20,
  },
  ui: {
    emptyChatMessage: "No messages yet. Start the interview to begin.",
    typingIndicatorLabel: "Interview assistant is responding",
  },
};

export const defaultInterviewConfig = siteConfig.defaults.interviewConfig;
export const defaultCvContent = siteConfig.defaults.cvContent;
export const defaultJobPostingContent = siteConfig.defaults.jobPostingContent;

const clampQuestionCount = (
  value: number | undefined,
  fallback: number
): number => {
  const parsed = Number.isFinite(value) ? Number(value) : Number.NaN;
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(
    siteConfig.limits.maxQuestionsPerCategory,
    Math.max(siteConfig.limits.minQuestionsPerCategory, Math.floor(parsed))
  );
};

export const normalizeInterviewConfig = (
  config?: InterviewConfig | null
): InterviewConfig => {
  if (!config) {
    return { ...defaultInterviewConfig };
  }

  return {
    technicalCount: clampQuestionCount(
      config.technicalCount,
      defaultInterviewConfig.technicalCount
    ),
    behavioralCount: clampQuestionCount(
      config.behavioralCount,
      defaultInterviewConfig.behavioralCount
    ),
    rolesCount: clampQuestionCount(
      config.rolesCount,
      defaultInterviewConfig.rolesCount
    ),
    systemDesignCount: clampQuestionCount(
      config.systemDesignCount,
      defaultInterviewConfig.systemDesignCount
    ),
    difficulty: config.difficulty ?? defaultInterviewConfig.difficulty,
  };
};

export const getTotalQuestions = (config: InterviewConfig): number =>
  config.technicalCount +
  config.behavioralCount +
  config.rolesCount +
  config.systemDesignCount;

export const getQuestionGoal = (config: InterviewConfig): number => {
  const total = getTotalQuestions(config);
  return Math.max(total, siteConfig.defaults.minimumQuestions);
};

export const buildAssistantGreeting = (
  hasCv: boolean,
  hasJobPosting: boolean,
  candidateName?: string
): SessionMessage => {
  const namePrefix = candidateName ? `Hello ${candidateName}!` : "Hello!";
  const greetingBody =
    hasCv || hasJobPosting
      ? "Welcome to your AI-powered interview session. I've reviewed your background and the role details. Could you start by walking me through the experience that best aligns with this position?"
      : "Welcome to your AI-powered interview session. Let's begin with a quick introduction—could you tell me about your current role and what interests you about new opportunities?";

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: `${namePrefix} ${greetingBody}`,
    timestamp: new Date(),
    source: "voice",
  };
};
