"use client";

import { useMemo, useState } from "react";
import {
  Brain,
  CheckCircle2,
  Code2,
  Flame,
  Gauge,
  MessageCircle,
  Minus,
  Plus,
  RefreshCcw,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { InterviewConfig as InterviewConfigValues } from "@/lib/site-config";
import {
  defaultInterviewConfig,
  normalizeInterviewConfig,
  siteConfig,
} from "@/lib/site-config";
interface InterviewConfigProps {
  onConfigSubmit: (config: InterviewConfigValues) => void;
  isDisabled?: boolean;
}

type DifficultyKey = InterviewConfigValues["difficulty"];

type CategoryKey =
  | "technicalCount"
  | "behavioralCount"
  | "rolesCount"
  | "systemDesignCount";

type DifficultyMeta = {
  label: string;
  description: string;
  outerRing: string;
  innerRing: string;
  icon: LucideIcon;
};

type CategoryMeta = {
  label: string;
  description: string;
  icon: LucideIcon;
};

const difficultyMeta: Record<DifficultyKey, DifficultyMeta> = {
  easy: {
    label: "Warm-up Mode",
    description:
      "Gentle questions to build confidence and ease into the interview.",
    outerRing: "bg-emerald-100/70 shadow-[0_0_40px_rgba(16,185,129,0.35)]",
    innerRing: "bg-emerald-200/80",
    icon: Gauge,
  },
  medium: {
    label: "Growth Mode",
    description: "Balanced difficulty that mirrors a typical onsite interview.",
    outerRing: "bg-blue-100/70 shadow-[0_0_40px_rgba(59,130,246,0.35)]",
    innerRing: "bg-blue-200/80",
    icon: Brain,
  },
  hard: {
    label: "Challenge Mode",
    description: "Deep, multi-layered prompts for seasoned candidates.",
    outerRing: "bg-orange-100/70 shadow-[0_0_40px_rgba(234,88,12,0.35)]",
    innerRing: "bg-orange-200/80",
    icon: Flame,
  },
};

const categoryMeta: Record<CategoryKey, CategoryMeta> = {
  technicalCount: {
    label: "Technical",
    description: "Algorithms, data structures, and coding prompts.",
    icon: Code2,
  },
  behavioralCount: {
    label: "Behavioral",
    description: "Collaboration, leadership, and situational stories.",
    icon: MessageCircle,
  },
  rolesCount: {
    label: "Role Specific",
    description: "Domain-focused questions tied to the job description.",
    icon: Workflow,
  },
  systemDesignCount: {
    label: "System Design",
    description: "Architecture and scalability conversations.",
    icon: Workflow,
  },
};

const HARD_MIN = siteConfig.limits.minQuestionsPerCategory;
const HARD_MAX = siteConfig.limits.maxQuestionsPerCategory;

export function InterviewConfig({
  onConfigSubmit,
  isDisabled = false,
}: InterviewConfigProps) {
  const [config, setConfig] = useState<InterviewConfigValues>({
    ...defaultInterviewConfig,
  });

  const totalQuestions = useMemo(
    () =>
      config.technicalCount +
      config.behavioralCount +
      config.rolesCount +
      config.systemDesignCount,
    [
      config.behavioralCount,
      config.rolesCount,
      config.systemDesignCount,
      config.technicalCount,
    ]
  );

  const recommendedRange = totalQuestions >= 6 && totalQuestions <= 10;

  const handleDifficultyChange = (difficulty: DifficultyKey) => {
    setConfig((previous) => ({
      ...previous,
      difficulty,
    }));
  };

  const clampCount = (value: number) =>
    Math.min(
      HARD_MAX,
      Math.max(HARD_MIN, Number.isNaN(value) ? HARD_MIN : value)
    );

  const adjustCount = (key: CategoryKey, delta: number) => {
    setConfig((previous) => ({
      ...previous,
      [key]: clampCount(previous[key] + delta),
    }));
  };

  const handleManualCountChange = (key: CategoryKey, value: string) => {
    const parsed = Number.parseInt(value, 10);
    setConfig((previous) => ({
      ...previous,
      [key]: clampCount(parsed),
    }));
  };

  const handleReset = () => {
    setConfig({ ...defaultInterviewConfig });
  };

  const handleSubmit = () => {
    onConfigSubmit(normalizeInterviewConfig(config));
  };

  const activeDifficulty = difficultyMeta[config.difficulty];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${activeDifficulty.outerRing}`}
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${activeDifficulty.innerRing}`}
            >
              <activeDifficulty.icon className="w-12 h-12 text-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-xl">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          {activeDifficulty.label}
        </h3>
        <p className="text-muted-foreground text-sm">
          {activeDifficulty.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {(Object.keys(difficultyMeta) as DifficultyKey[]).map((difficulty) => {
          const meta = difficultyMeta[difficulty];
          const isSelected = config.difficulty === difficulty;
          return (
            <Button
              key={difficulty}
              onClick={() => handleDifficultyChange(difficulty)}
              variant={isSelected ? "default" : "outline"}
              size="lg"
              className="gap-2 px-6"
            >
              <meta.icon className="w-4 h-4" />
              {meta.label}
            </Button>
          );
        })}
      </div>

      <Card className="w-full max-w-3xl border border-border/60 bg-card/90 p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">
              Question Mix
            </h4>
            <span className="text-sm font-medium text-muted-foreground">
              Total: {totalQuestions}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Use the controls below to set how many prompts you expect for each
            interview dimension.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(categoryMeta) as CategoryKey[]).map((key) => {
            const meta = categoryMeta[key];
            const Icon = meta.icon;
            return (
              <Card
                key={key}
                className="border border-border/50 bg-background/70 p-4 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-foreground">
                      {meta.label}
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustCount(key, -1)}
                      disabled={config[key] <= HARD_MIN}
                      aria-label={`Decrease ${meta.label} questions`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min={HARD_MIN}
                      max={HARD_MAX}
                      value={config[key]}
                      onChange={(event) =>
                        handleManualCountChange(key, event.target.value)
                      }
                      className="w-16 text-center"
                      aria-label={`${meta.label} question count`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => adjustCount(key, 1)}
                      disabled={config[key] >= HARD_MAX}
                      aria-label={`Increase ${meta.label} questions`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Range {HARD_MIN}-{HARD_MAX}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div
          className={`flex items-center gap-2 rounded-md border p-3 text-sm ${
            recommendedRange
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {recommendedRange
            ? "Great mix! Six to ten questions keeps the conversation balanced."
            : "Consider targeting between six and ten questions for a balanced session."}
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 px-8"
          disabled={isDisabled || totalQuestions === 0}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Apply Configuration
        </Button>
        <Button
          onClick={handleReset}
          size="lg"
          variant="secondary"
          className="gap-2"
          disabled={isDisabled}
        >
          <RefreshCcw className="w-5 h-5" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
