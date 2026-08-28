# GEMprompt — AI Talent Sourcing Strategist

GEMprompt is an intelligent, high-impact talent sourcing strategy application designed for Talent Sourcers, Recruiters, and Hiring Teams. It analyzes Job Descriptions (JDs) and Hiring Manager Requisition Intake Notes to generate an actionable 5-pillar sourcing execution plan.

![GEMprompt](https://img.shields.io/badge/GEMprompt-v1.2-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?style=flat-square&logo=tailwindcss)

---

## 🚀 Key Sourcing Framework

1. **Core Persona & Key Criteria Summary**
   - Target Profile summary
   - Non-Negotiables (Must-Haves)
   - Flex Zones (Nice-to-Haves & Compromises)
   - Dealbreakers & Disqualifiers
2. **Boolean Search Strings Engine**
   - **Broad / Standard Search**
   - **Targeted / Niche Search**
   - **Diversity / Out-of-the-Box Search**
   - Formats for **LinkedIn Recruiter**, **Naukri**, **Google X-Ray**, and **Standard syntax** with 1-click copy and live Google search trigger.
3. **Target & Off-Limits Company Mapping**
   - Target Companies to poach from with alignment rationales
   - Exclusions & Off-Limits organizations with risk factors
4. **Candidate Outreach & Messaging Strategy**
   - Top 2 Value Proposition Hooks
   - 3-Paragraph Cold InMail template with dynamic placeholder highlights
5. **Day-1 Immediate Action Checklist**
   - Interactive 5-step checklist with progress tracking

---

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd talent-sourcing-strategist

# Install dependencies
npm install

# Start local dev server
npm run dev
```

The application will be running at `http://localhost:3000/`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🤖 AI Engine Options
- **Built-in Smart Heuristic Engine (Default)**: Instant, zero-config parsing without any API key.
- **Google Gemini API**: Configurable via in-app Settings modal with `gemini-1.5-flash` or `gemini-2.0-flash`.
- **OpenAI API**: Configurable with `gpt-4o-mini` or `gpt-4o`.
