"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "./document-upload";
import { InterviewConfig } from "./interview-config";
import type { InterviewConfig as InterviewConfigValues } from "@/lib/site-config";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface SetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSubmit: (
    config: InterviewConfigValues,
    cv: string,
    jobPosting: string,
    intervieweeName: string
  ) => void;
}

export function SetupModal({
  open,
  onOpenChange,
  onConfigSubmit,
}: SetupModalProps) {
  const [cvContent, setCvContent] = useState<string>("");
  const [jobPostingContent, setJobPostingContent] = useState<string>("");
  const [intervieweeName, setIntervieweeName] = useState<string>("");
  const [step, setStep] = useState<"documents" | "config">("documents");

  const isDocumentsReady = cvContent || jobPostingContent || intervieweeName;

  const handleConfigSubmit = (config: InterviewConfigValues) => {
    onConfigSubmit(config, cvContent, jobPostingContent, intervieweeName);
  };

  useEffect(() => {
    if (!open) {
      setStep("documents");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl sm:max-w-6xl lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-muted p-0">
        <DialogTitle className="sr-only">Interview Setup</DialogTitle>
        <div className="space-y-6 p-6">
          {step === "documents" && (
            <Card className="p-6 bg-background/90 border border-border/60">
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Upload Your Documents
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add your CV and the job posting to personalize the
                      conversation.
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
                    onChange={(event) => setIntervieweeName(event.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-xs text-amber-800 mt-2">
                    Provide your name so we can personalize the interview when
                    no CV is supplied.
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Uploading both
                  documents produces the most tailored prompts, but you can
                  continue with one or none.
                </p>
              </div>

              {isDocumentsReady && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-900">
                    <p className="font-semibold">Ready for configuration</p>
                    <p className="text-xs mt-1">
                      {intervieweeName && `Candidate: ${intervieweeName}`}
                      {cvContent && " • CV loaded"}
                      {jobPostingContent && " • Job posting loaded"}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setStep("config")}
                disabled={!isDocumentsReady}
                size="lg"
                className="w-full mt-6 gap-2"
              >
                Continue to Configuration
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          )}

          {step === "config" && (
            <Card className="p-6 bg-background/90 border border-border/60">
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Configure Interview
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tune the difficulty and the mix of question types.
                    </p>
                  </div>
                </div>
              </div>

              {isDocumentsReady && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    <span className="font-semibold">Setup summary:</span>
                    {intervieweeName && ` Candidate: ${intervieweeName}`}
                    {cvContent && " • CV loaded"}
                    {jobPostingContent && " • Job posting loaded"}
                  </p>
                </div>
              )}

              <InterviewConfig onConfigSubmit={handleConfigSubmit} />

              <Button
                onClick={() => setStep("documents")}
                variant="outline"
                className="w-full mt-4"
              >
                Back to Documents
              </Button>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
