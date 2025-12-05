"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react"

interface ScoreData {
  category: string
  score: number
  maxScore: number
  feedback: string[]
}

interface InterviewScorecardProps {
  scores: ScoreData[]
  overallScore: number
  areasOfImprovement: string[]
  suggestions: string[]
  interviewDuration: number
  questionsAnswered: number
}

export function InterviewScorecard({
  scores,
  overallScore,
  areasOfImprovement,
  suggestions,
  interviewDuration,
  questionsAnswered,
}: InterviewScorecardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50"
    if (score >= 60) return "bg-yellow-50"
    return "bg-red-50"
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Overall Score */}
      <Card className={`${getScoreBgColor(overallScore)}`}>
        <CardHeader>
          <CardTitle className="text-2xl">Interview Complete!</CardTitle>
          <CardDescription>Your Performance Summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</div>
              <p className="text-sm text-muted-foreground mt-2">Overall Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{questionsAnswered}</div>
              <p className="text-sm text-muted-foreground mt-2">Questions Answered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(interviewDuration / 60)}m</div>
              <p className="text-sm text-muted-foreground mt-2">Interview Duration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scores.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.category}</span>
                <span className={`text-lg font-bold ${getScoreColor(category.score)}`}>{category.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    category.score >= 80 ? "bg-green-500" : category.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${category.score}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{category.feedback[0]}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Areas of Improvement */}
      {areasOfImprovement.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="w-5 h-5" />
              Areas of Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {areasOfImprovement.map((area, index) => (
                <li key={index} className="flex gap-2 text-sm text-yellow-900">
                  <span className="font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CheckCircle2 className="w-5 h-5" />
              Suggestions for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2 text-sm text-blue-900">
                  <span className="font-bold">✓</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
