# 🎯 GRAYMARK AI — Career & Resume Intelligence

> A minimalist, production-ready full-stack AI web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS), target specific job descriptions, and practice interactive mock interviews with live AI feedback.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_API-Supported-green)
![Design Theme](https://img.shields.io/badge/Aesthetic-Coffee_%26_Cream-brown)

---

## 🌟 Key Features

### 1. 📄 ATS Resume Analyzer
- **PDF & TXT File Reader**: Upload actual `.pdf` or `.txt` resumes directly using browser `pdfjs-dist` text extraction.
- **Metric Distribution Radar**: Interactive SVG spider chart rating your resume across **Impact**, **Brevity**, **Style**, and **Keywords**.
- **Actionable AI Feedback**: Categorized improvements with concrete bullet point rewrite examples.
- **1-Click PDF Report Export**: Export formatted PDF report cards for offline reference or portfolio showcase.

### 2. 🎯 Job Description Matcher
- **Role Fit Score**: Calculate hard and soft skill alignment percentages against target job listings.
- **Keyword Gap Tag Cloud**: Highlight missing keywords required by ATS recruiters.
- **AI Tailored Bullet Suggestions**: 1-click copyable resume bullet points tailored to target job descriptions.

### 3. 🎙️ Interactive AI Mock Interviewer
- **Multi-Role Tracks**: Practice interview questions for Software Engineering, Data Science, and Product Management.
- **Voice Microphone Input (Speech-to-Text)**: Answer questions out loud using native Web Speech API with live transcript rendering.
- **Text-to-Speech Question Reader**: Listen to AI questions read aloud.
- **STAR Framework Evaluation**: Real-time evaluation of clarity, relevance, and STAR (Situation, Task, Action, Result) methodology.

### 4. 🧠 Smart Candidate Memory
- **Persistent Context**: Remembers target roles, best ATS scores, and identified skill gaps across browser sessions via `localStorage`.

### 5. ⚡ Dual-Engine AI Architecture
- **Instant Demo Engine**: Smart out-of-the-box evaluation algorithm allowing portfolio reviewers to test every feature instantly without an API key.
- **Live Gemini API Mode**: Optional modal allowing users to enter a Google Gemini API key (`gemini-1.5-flash`) for real-time live LLM responses.

---

## 🎨 Design Philosophy: Coffee & Cream Minimalist

Built with a curated **Coffee & Cream** color system:
- **Background**: Soft warm cream (`#FAF7F2`)
- **Cards & Surfaces**: Clean soft cream (`#FFFFFF`) with warm latte borders (`#E6DED6`)
- **Typography**: Rich roasted espresso (`#2C1E16`) & warm mocha secondary text (`#6E5A4F`)
- **Emblem**: Custom SVG logo blending a career target ring with coffee tones

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 18, Vite
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism, Micro-animations)
- **Icons**: Lucide React
- **Document Parsing**: `pdfjs-dist` (Client-side PDF text extraction)
- **AI Integration**: Google Gemini REST API (`gemini-1.5-flash`) & Smart Client-side Fallback Engine
- **Voice APIs**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 🚀 Quick Start & Local Setup

```bash
# 1. Navigate to directory
cd ai-resume-career-coach

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser at `http://localhost:3000/`.

---

## 📝 License

Distributed under the MIT License.
