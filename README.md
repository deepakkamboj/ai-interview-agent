# AI Interview Agent

An intelligent, AI-powered interview practice platform that provides realistic voice conversations, personalized questions, instant feedback, and integrated coding challenges.

## 🎯 Problem Statement

Interview preparation remains one of the most stressful aspects of career development. Candidates face multiple barriers:

- **Interview Anxiety & Performance Pressure** - Nervousness during interviews leads to poor performance
- **Limited Access to Quality Practice** - Mock interviews are expensive and hard to schedule
- **Generic, One-Size-Fits-All Preparation** - Generic interview prep doesn't match specific roles
- **Lack of Real-time Feedback** - No immediate guidance during practice

## 💡 Solution Overview

AI Interview Agent provides:

- **Realistic Voice Conversations**: Natural, lifelike interviews using real-time speech processing
- **Personalized Questions**: CV and job description analysis for tailored interview scenarios
- **Instant Feedback**: Real-time performance insights and detailed transcripts
- **Coding Challenges**: Integrated code editor for technical interview practice
- **Multi-Modal Practice**: Combines behavioral, technical, and coding assessments

## ✨ Key Features

### Voice Interview System

- Real-time voice conversations using LiveKit WebRTC
- Natural speech-to-text and text-to-speech processing
- Live transcription of interview sessions
- Adaptive questioning based on candidate responses

### Coding Interview Platform

- Integrated Monaco code editor
- Multiple language support
- AI-powered code review and feedback
- Real-time syntax highlighting and validation

### Intelligent Analysis

- CV and job description parsing
- Context-aware question generation using Mistral AI
- Performance scoring and evaluation
- Detailed improvement recommendations

### Results Dashboard

- Comprehensive performance metrics
- Full interview transcripts
- Strengths and improvement areas
- Historical session tracking

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Monaco Editor** - VS Code editor component

### Real-Time Communication

- **LiveKit** - WebRTC infrastructure
- **Speech-to-Text** - Real-time transcription
- **Text-to-Speech** - Natural voice synthesis

### AI & Backend

- **Mistral AI** (pixtral-large-latest) - Large Language Model
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- LiveKit account and API keys
- Mistral AI API key
- PostgreSQL database

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ai-interview-agent
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud

# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
ai-interview-agent/
├── app/                        # Next.js app directory
│   ├── api/                   # API routes
│   │   ├── interview/         # Interview endpoints
│   │   └── livekit/          # LiveKit token generation
│   ├── coding-interview/     # Coding interview page
│   ├── demo/                 # Demo page
│   └── interview-results/    # Results page
├── components/               # React components
│   ├── ui/                  # UI components (shadcn)
│   ├── chat/                # Chat components
│   └── workflow/            # Workflow components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── types/                   # TypeScript type definitions
```

## 🔑 Key Integrations

### LiveKit

Provides real-time audio communication, speech-to-text, and text-to-speech capabilities for natural voice interviews.

### Mistral AI

Powers intelligent question generation, CV analysis, code review, and performance evaluation using the pixtral-large-latest model.

### PostgreSQL

Stores interview sessions, transcripts, code submissions, and performance metrics for historical tracking and analytics.

## 📊 Interview Workflow

1. **Setup & Personalization** - Upload CV/resume, add job description, configure settings
2. **Voice Interview Loop** - Real-time conversation with AI interviewer
3. **Agent Orchestration** - Context maintenance and difficulty adjustment
4. **Coding Challenge** - Present problems and review code submissions
5. **Scoring & Insights** - Calculate metrics and generate feedback
6. **Storage & Reporting** - Persist data and generate reports

## 🔒 Security & Privacy

- End-to-end encryption for voice data
- Secure WebRTC connections
- Encrypted storage for transcripts
- GDPR-compliant data handling
- User data deletion on request

## 🎯 Roadmap

### Phase 1: Core Improvements

- Enhanced multi-dimensional scoring
- Mobile optimization
- Performance improvements

### Phase 2: Feature Expansion

- Multi-language support
- Advanced analytics dashboard
- Interview templates

### Phase 3: Platform Evolution

- Video interview capability
- AI interviewer personas
- Integration ecosystem

### Phase 4: Enterprise Features

- Corporate training platform
- White-label solution
- Advanced AI models

## 📝 Documentation

For detailed technical documentation, system architecture, and workflow diagrams, see [DEVELOPER-MERMAID.md](./DEVELOPER-MERMAID.md).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [LiveKit](https://livekit.io/)
- [Mistral AI](https://mistral.ai/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Empowering candidates to ace their interviews through AI-powered practice** ❤️
