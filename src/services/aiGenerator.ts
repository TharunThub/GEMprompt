import {
  RequisitionInput,
  SourcingActionPlan,
  ApiSettings
} from '../types/sourcing';
import { extractSourcingStrategyLocally } from './localExtractor';

const SYSTEM_PROMPT = `You are an expert Talent Sourcing Strategist. Your task is to analyze the provided Job Description (JD) and Hiring Manager (HM) Requisition Intake Notes to create an immediate, high-impact sourcing action plan.

Respond strictly with valid JSON conforming to this structure:
{
  "personaSummary": {
    "targetProfile": "2-3 sentence summary of the ideal candidate profile",
    "nonNegotiables": ["Mandatory skill/experience 1", "Mandatory skill 2", "Mandatory skill 3", "Mandatory skill 4"],
    "flexZones": ["Area HM is willing to compromise 1", "Area 2", "Area 3"],
    "dealbreakers": ["Disqualifier explicitly stated 1", "Disqualifier 2", "Disqualifier 3"]
  },
  "booleanStrings": {
    "broadSearch": {
      "description": "Captures standard job titles and core skills",
      "standard": "...",
      "linkedInRecruiter": "...",
      "naukri": "...",
      "googleXray": "..."
    },
    "targetedSearch": {
      "description": "Includes specific tools, target companies, or domain keywords",
      "standard": "...",
      "linkedInRecruiter": "...",
      "naukri": "...",
      "googleXray": "..."
    },
    "diversitySearch": {
      "description": "Alternative job titles or adjacent industries",
      "standard": "...",
      "linkedInRecruiter": "...",
      "naukri": "...",
      "googleXray": "..."
    }
  },
  "companyMapping": {
    "targetCompanies": [
      { "name": "Company Name", "category": "Tier 1 / Sub-domain", "rationale": "Why poach from here" }
    ],
    "exclusions": [
      { "name": "Company/Region", "reason": "Why off-limits" }
    ]
  },
  "outreachStrategy": {
    "valueProposition": [
      "Top selling point / hook 1",
      "Top selling point / hook 2"
    ],
    "inMailTemplate": {
      "subject": "Compelling subject line with [First Name]",
      "body": "Short, personalized, 3-paragraph InMail template highlighting the role hook with placeholder brackets like [First Name], [Specific Skill/Scale Metric], [Current Company], [Recruiter Name]."
    }
  },
  "dayOneChecklist": [
    { "id": "step-1", "text": "Concrete actionable step 1", "category": "Sourcing", "completed": false },
    { "id": "step-2", "text": "Concrete actionable step 2", "category": "Sourcing", "completed": false },
    { "id": "step-3", "text": "Concrete actionable step 3", "category": "Outreach", "completed": false },
    { "id": "step-4", "text": "Concrete actionable step 4", "category": "Pipeline", "completed": false },
    { "id": "step-5", "text": "Concrete actionable step 5", "category": "Sync", "completed": false }
  ]
}

Tone & Guidelines:
- Keep the response concise, tactical, and immediately actionable.
- Avoid generic recruitment jargon; focus on actionable sourcing steps.
- Capitalize standard acronyms (e.g., JD, HM, ATS, KPI, B2B, SaaS).
`;

export async function generateSourcingStrategy(
  input: RequisitionInput,
  settings: ApiSettings
): Promise<SourcingActionPlan> {
  // If local engine selected or no API key, use local extractor
  if (settings.provider === 'local' || !settings.apiKey.trim()) {
    // Artificial small delay to give realistic loading feel
    await new Promise(r => setTimeout(r, 450));
    return extractSourcingStrategyLocally(input);
  }

  try {
    if (settings.provider === 'gemini') {
      return await callGeminiApi(input, settings.apiKey, settings.modelName || 'gemini-1.5-flash');
    } else if (settings.provider === 'openai') {
      return await callOpenAiApi(input, settings.apiKey, settings.modelName || 'gpt-4o-mini');
    }
  } catch (error) {
    console.warn('API call failed, falling back to intelligent local extractor:', error);
  }

  return extractSourcingStrategyLocally(input);
}

async function callGeminiApi(input: RequisitionInput, apiKey: string, model: string): Promise<SourcingActionPlan> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const userPrompt = `Job Title: ${input.title}
Location: ${input.location || 'Not specified'}
Seniority: ${input.seniority || 'Not specified'}
Work Model: ${input.workModel || 'Flexible'}

=== JOB DESCRIPTION ===
${input.jobDescription}

=== HIRING MANAGER INTAKE NOTES ===
${input.intakeNotes}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');

  const parsed = JSON.parse(rawText);
  return {
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    ...parsed
  };
}

async function callOpenAiApi(input: RequisitionInput, apiKey: string, model: string): Promise<SourcingActionPlan> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const userPrompt = `Job Title: ${input.title}
Location: ${input.location || 'Not specified'}
Seniority: ${input.seniority || 'Not specified'}
Work Model: ${input.workModel || 'Flexible'}

=== JOB DESCRIPTION ===
${input.jobDescription}

=== HIRING MANAGER INTAKE NOTES ===
${input.intakeNotes}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) throw new Error('Empty response from OpenAI');

  const parsed = JSON.parse(rawText);
  return {
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    ...parsed
  };
}
