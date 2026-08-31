import {
  RequisitionInput,
  SourcingActionPlan,
  ApiSettings
} from '../types/sourcing';
import { extractSourcingStrategyLocally } from './localExtractor';

const SYSTEM_PROMPT = `You are an elite Talent Sourcing Strategist specializing in the India & APAC Tech/Non-Tech Markets. Your objective is to analyze the provided Job Description (JD) and Hiring Manager (HM) Intake Notes, then construct a deeply tactical, execution-ready Strategic Sourcing Plan.

Analyze the input data and generate the Sourcing Plan strictly adhering to the structured framework below.

Your output must be purely in valid JSON format matching this exact schema. Do not include any markdown formatting outside the JSON object.

{
  "personaScorecard": {
    "targetProfile": "2-3 sentence narrative describing the ideal candidate persona.",
    "pillars": [
      {
        "pillar": "Domain / Technical Depth",
        "weight": "30%",
        "mustHaves": "...",
        "flexZones": "...",
        "dealbreakers": "..."
      },
      {
        "pillar": "Leadership / Scope",
        "weight": "20%",
        "mustHaves": "...",
        "flexZones": "...",
        "dealbreakers": "..."
      },
      {
        "pillar": "Mandatory Certifications / Edu",
        "weight": "15%",
        "mustHaves": "(e.g., CA, CFA, B.Tech)",
        "flexZones": "...",
        "dealbreakers": "..."
      },
      {
        "pillar": "Location & Notice Period",
        "weight": "15%",
        "mustHaves": "(e.g., Max 30 Days, Hyb Pune)",
        "flexZones": "...",
        "dealbreakers": "> 60 days, Unwilling to relocate"
      },
      {
        "pillar": "Compensation / Band Fit",
        "weight": "20%",
        "mustHaves": "(e.g., Target LPA Range)",
        "flexZones": "...",
        "dealbreakers": "> CTC Ceiling"
      }
    ]
  },
  "booleanStrings": {
    "broadSearch": {
      "description": "Keywords + Mandatory Tools + Location Hubs.",
      "linkedInRecruiter": "...",
      "naukri": "...",
      "googleXray": "..."
    },
    "targetedSearch": {
      "description": "Specific Frameworks/Certifications + Domain Keywords.",
      "linkedInRecruiter": "...",
      "naukri": "...",
      "googleXray": "..."
    },
    "diversitySearch": {
      "description": "Diversity and alternate naming constructs.",
      "linkedInRecruiter": "...",
      "naukri": "...",
      "googleXray": "..."
    },
    "naukriFilters": {
      "experience": "[Min - Max Yrs]",
      "location": "[Target Cities]",
      "noticePeriod": "[e.g., 0-30 Days / Serving Notice]",
      "salary": "[Target LPA Range]",
      "activePeriod": "Active in last 30 days"
    }
  },
  "companyMapping": {
    "segments": [
      {
        "segment": "Tier 1 (Direct Competitors)",
        "companies": ["Company A", "Company B"],
        "businessUnits": "e.g., Global Capability Centers (GCCs)",
        "targetDesignations": "e.g., Lead, AVPs",
        "exclusions": "..."
      },
      {
        "segment": "Tier 2 (Adjacent Sectors)",
        "companies": ["Company C", "Company D"],
        "businessUnits": "...",
        "targetDesignations": "e.g., Senior Managers",
        "exclusions": "..."
      }
    ]
  },
  "jobPostingCopy": {
    "naukri": {
      "headline": "(Optimized for high Naukri search volume)",
      "keyTags": ["Top 8-10 keywords", "for maximum", "resume-match score"],
      "summary": "High-converting summary highlighting CTC, Location, and Core Hook."
    },
    "linkedIn": {
      "hook": "2 catchy sentences highlighting growth, stack, and impact.",
      "responsibilitiesAndRequirements": [
        "Bulleted, concise list",
        "avoiding corporate fluff"
      ]
    }
  },
  "outreachStrategy": {
    "valueProposition": ["Hook 1", "Hook 2"],
    "inMailTemplate": {
      "subject": "...",
      "body": "..."
    }
  },
  "dayOneChecklist": [
    { "id": "1", "text": "Run boolean X", "category": "Sourcing", "completed": false }
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
