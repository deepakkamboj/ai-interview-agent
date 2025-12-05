"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "./document-upload";
import { InterviewConfig } from "./interview-config";
import type { InterviewConfig as InterviewConfigValues } from "@/lib/site-config";
import { FileText, Settings, ChevronRight } from "lucide-react";

interface SetupPanelProps {
  onConfigSubmit: (
    config: InterviewConfigValues,
    cv: string,
    jobPosting: string,
    intervieweeName: string
  ) => void;
}

export function SetupPanel({ onConfigSubmit }: SetupPanelProps) {
  const [cvContent, setCvContent] = useState<string>("");
  const [jobPostingContent, setJobPostingContent] = useState<string>("");
  const [step, setStep] = useState<"documents" | "config">("documents");
  const [intervieweeName, setIntervieweeName] = useState<string>("");

  const handleProceed = () => {
    if (cvContent || jobPostingContent || intervieweeName) {
      setStep("config");
    }
  };

  const handleConfigSubmit = (config: InterviewConfigValues) => {
    onConfigSubmit(config, cvContent, jobPostingContent, intervieweeName);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {step === "documents" && (
        <>
          <Card className="p-8 bg-gradient-to-br from-card to-muted">
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Upload Your Documents</h2>
                  <p className="text-muted-foreground">
                    Upload your CV and job posting to personalize the interview
                  </p>
                </div>
              </div>
            </div>

            <DocumentUpload
              onCVUpload={setCvContent}
              onJobPostingUpload={setJobPostingContent}
            />

            {!cvContent && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Your Name (Required)
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={intervieweeName}
                  onChange={(e) => setIntervieweeName(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-amber-800 mt-2">
                  Since you haven't uploaded a CV, please provide your name so
                  the interviewer can personalize the interview.
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Tip:</span> Upload both your
                CV and the job posting for the most personalized interview
                experience. However, you can proceed with just one or neither to
                have a general practice interview.
              </p>
            </div>

            <Button
              onClick={handleProceed}
              disabled={!cvContent && !jobPostingContent && !intervieweeName}
              size="lg"
              className="w-full mt-8 gap-2"
            >
              Continue to Configuration
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>
        </>
      )}

      {step === "config" && (
        <>
          <Card className="p-8 bg-gradient-to-br from-card to-muted">
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">2</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Configure Interview</h2>
                  <p className="text-muted-foreground">
                    Choose the types and difficulty of questions
                  </p>
                </div>
              </div>
            </div>

            {(cvContent || jobPostingContent || intervieweeName) && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900">
                  <span className="font-semibold">✓ Interview Setup:</span>
                  {intervieweeName && ` Candidate: ${intervieweeName}`}
                  {cvContent && " • CV loaded"}
                  {jobPostingContent && " • Job posting loaded"}
                </p>
              </div>
            )}

            <InterviewConfig
              onConfigSubmit={handleConfigSubmit}
              isDisabled={false}
            />

            <Button
              onClick={() => setStep("documents")}
              variant="outline"
              className="w-full mt-4"
            >
              Back to Documents
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
