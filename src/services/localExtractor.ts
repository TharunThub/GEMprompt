import {
  RequisitionInput,
  SourcingActionPlan,
  PersonaSummary,
  BooleanSearchSection,
  CompanyMapping,
  OutreachStrategy,
  ChecklistItem
} from '../types/sourcing';
import { generatePlatformVariants } from './booleanBuilder';

/**
 * Intelligent local extraction and synthesis engine
 * Parses raw JD + HM Intake Notes into a structured Sourcing Action Plan
 */
export function extractSourcingStrategyLocally(input: RequisitionInput): SourcingActionPlan {
  const combinedText = `${input.title}\n${input.location || ''}\n${input.jobDescription}\n${input.intakeNotes}`;
  
  // Extract Titles & Seniority
  const title = input.title || 'Specialist Professional';
  const seniority = input.seniority || extractSeniority(combinedText) || 'Senior';
  const roleName = cleanRoleName(title);

  // Extract Key Tech / Skills / Terms
  const detectedSkills = extractSkills(combinedText);
  const coreSkills = detectedSkills.slice(0, 4);
  const secondarySkills = detectedSkills.slice(4, 9);
  const adjacentSkills = extractAdjacentSkills(detectedSkills, roleName);

  // Extract Companies
  const companiesFromNotes = extractCompanies(input.intakeNotes + '\n' + input.jobDescription);
  const targetCompanies = companiesFromNotes.targets.length > 0 ? companiesFromNotes.targets : generateFallbackCompanies(roleName, detectedSkills);
  const exclusions = companiesFromNotes.exclusions.length > 0 ? companiesFromNotes.exclusions : [
    { name: 'Direct Competitors under active Non-Solicit / Investor Portfolio', reason: 'Explicit legal non-poach policy' },
    { name: 'Low-scale IT Services / Outsourced bodyshop vendors', reason: 'HM explicitly requested product engineering / high-scale environment' }
  ];

  // 1. Core Persona & Key Criteria Summary
  const personaSummary: PersonaSummary = {
    targetProfile: `${seniority} ${roleName} with proven track record in ${coreSkills.slice(0, 3).join(', ')}${input.location ? ` in ${input.location}` : ''}. Proven hands-on capability in architecting and delivering high-impact solutions in high-scale environments.`,
    nonNegotiables: [
      `At least ${extractYearsOfExp(combinedText) || '4-6+'} years hands-on experience in ${coreSkills[0] || 'core domain'} and ${coreSkills[1] || 'production systems'}.`,
      `Demonstrated production track record handling ${coreSkills.slice(0, 3).join(' / ')}.`,
      `Deep expertise in system architecture, performance optimization, and industry standard tooling.`,
      `Demonstrated problem solving and ability to navigate fast-paced product environments without constant oversight.`
    ],
    flexZones: [
      `Years of experience (YOE) can be relaxed for top-tier performers with proven pedigree or high-growth company experience.`,
      `Domain flexibility: Strong foundational skills in adjacent stacks or architectures acceptable with demonstrated ramp-up capability.`,
      `Degree/Pedigree: Tier-1 academic background is preferred but hands-on product achievements, open-source impact, or top-tier portfolios easily override pedigree.`
    ],
    dealbreakers: [
      `Pure academic/theoretical experience without verifiable production scale deployments.`,
      `Excessive short job tenures (frequent hopping under 10-12 months without clear rationale).`,
      `Candidates lacking hands-on coding/technical execution experience (e.g. exclusively managing vendors/outsourced teams).`
    ]
  };

  // Check if intake notes contain explicit dealbreakers or flex items
  const customIntakeAnalysis = parseCustomIntakeNotes(input.intakeNotes);
  if (customIntakeAnalysis.mustHaves.length > 0) personaSummary.nonNegotiables = customIntakeAnalysis.mustHaves;
  if (customIntakeAnalysis.flexZones.length > 0) personaSummary.flexZones = customIntakeAnalysis.flexZones;
  if (customIntakeAnalysis.dealbreakers.length > 0) personaSummary.dealbreakers = customIntakeAnalysis.dealbreakers;

  // 2. Boolean Search Strings
  const primaryTitles = generateRelatedTitles(roleName, seniority);
  const broadTitles = [roleName, ...primaryTitles.slice(0, 3)];
  const nicheTitles = primaryTitles.slice(0, 2);
  const diversityTitles = generateAlternativeTitles(roleName);

  const broadSearch = {
    description: 'Captures standard job titles and core foundational skills across target geographies.',
    ...generatePlatformVariants(broadTitles, coreSkills.slice(0, 2), [], [], input.location)
  };

  const targetCompanyNames = targetCompanies.map(c => c.name);
  const targetedSearch = {
    description: 'Highly focused on specific frameworks, deep tech keywords, and candidate poaching pools.',
    ...generatePlatformVariants(nicheTitles, coreSkills, secondarySkills.slice(0, 2), targetCompanyNames.slice(0, 5), input.location)
  };

  const diversitySearch = {
    description: 'Explores non-traditional titles, adjacent industry domains, and parallel skill backgrounds.',
    ...generatePlatformVariants(diversityTitles, adjacentSkills, secondarySkills.slice(0, 2), [], input.location)
  };

  const booleanStrings: BooleanSearchSection = {
    broadSearch,
    targetedSearch,
    diversitySearch
  };

  // 3. Target Company Mapping
  const companyMapping: CompanyMapping = {
    targetCompanies,
    exclusions
  };

  // 4. Candidate Outreach & Messaging Strategy
  const valueProposition = [
    `High-impact engineering scale & autonomy: Direct ownership of critical high-throughput infrastructure.`,
    `Modern, developer-first culture with top-of-market compensation and flexible working arrangements.`
  ];

  const inMailTemplate = {
    subject: `[First Name], quick question on your ${coreSkills[0] || 'engineering'} architecture at [Current Company]?`,
    body: `Hi [First Name],

I came across your profile and was genuinely impressed by your background in ${coreSkills.slice(0, 2).join(' and ')} at [Current Company]. Your experience with [Specific Skill/Scale Metric] stands out as a strong match for the engineering scale we're solving.

We are currently building out our core ${roleName} team in ${input.location || 'our flagship hub'}, tackling massive high-throughput workloads and sub-second latencies with modern architecture (${coreSkills.join(', ')}). This role offers direct technical ownership, zero legacy bureaucracy, and a highly competitive equity/compensation package.

Would you be open to a casual, 15-minute introductory conversation this week to see if this aligns with your career goals? If so, let me know what day works best or feel free to grab a time here: [Calendar Link].

Best regards,

[Recruiter Name]
[Title] | [Company Name]`
  };

  const outreachStrategy: OutreachStrategy = {
    valueProposition,
    inMailTemplate
  };

  // 5. Day-1 Immediate Checklist
  const dayOneChecklist: ChecklistItem[] = [
    {
      id: 'step-1',
      text: `Execute Broad & Targeted Boolean strings in LinkedIn Recruiter and save initial 30 qualified profiles to Pipeline Project.`,
      category: 'Sourcing',
      completed: false
    },
    {
      id: 'step-2',
      text: `Run Google X-Ray searches to surface un-indexed profiles and open-source GitHub / portfolio contributors.`,
      category: 'Sourcing',
      completed: false
    },
    {
      id: 'step-3',
      text: `Personalize and dispatch the first batch of 15-20 targeted InMails using the Hook & Value Proposition template.`,
      category: 'Outreach',
      completed: false
    },
    {
      id: 'step-4',
      text: `Cross-reference target company mapping to identify second-degree connection referrals from existing engineering team.`,
      category: 'Pipeline',
      completed: false
    },
    {
      id: 'step-5',
      text: `Sync with Hiring Manager with first 5 calibration profiles to align on calibration feedback before full-throttle outreach.`,
      category: 'Sync',
      completed: false
    }
  ];

  return {
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    personaSummary,
    booleanStrings,
    companyMapping,
    outreachStrategy,
    dayOneChecklist
  };
}

// Helpers for NLP extraction
function cleanRoleName(title: string): string {
  return title
    .replace(/(Senior|Staff|Lead|Principal|Junior|Mid-level|Head of|VP of|Director of|Manager)/gi, '')
    .replace(/[-–—:(].*$/, '')
    .trim() || 'Software Engineer';
}

function extractSeniority(text: string): string {
  if (/staff|principal|director|head of/i.test(text)) return 'Staff / Principal';
  if (/lead|architect|manager/i.test(text)) return 'Lead / Architect';
  if (/senior|sr\./i.test(text)) return 'Senior';
  if (/entry|junior|jr\./i.test(text)) return 'Junior / Associate';
  return 'Senior';
}

function extractYearsOfExp(text: string): string | null {
  const match = text.match(/(\d+\s*[-+to]\s*\d+|\d+\+?)\s*(?:years?|yoe|yrs?)/i);
  return match ? match[0] : null;
}

const COMMON_SKILLS = [
  'Go', 'Golang', 'Python', 'Java', 'Rust', 'C++', 'TypeScript', 'JavaScript', 'React', 'Node.js',
  'Kubernetes', 'Docker', 'AWS', 'GCP', 'Azure', 'Kafka', 'Redis', 'PostgreSQL', 'MongoDB',
  'Cassandra', 'gRPC', 'GraphQL', 'Microservices', 'Distributed Systems', 'CI/CD',
  'PyTorch', 'TensorFlow', 'LLM', 'Generative AI', 'RAG', 'LangChain', 'LangGraph', 'Vector DB',
  'Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Product Strategy',
  'MEDDPICC', 'Enterprise Sales', 'B2B SaaS', 'Account Executive', 'Fintech', 'Cybersecurity'
];

function extractSkills(text: string): string[] {
  const found: string[] = [];
  for (const skill of COMMON_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i');
    if (regex.test(text)) {
      found.push(skill);
    }
  }
  return found.length > 0 ? found : ['Distributed Systems', 'Cloud Architecture', 'System Design', 'Backend Engineering'];
}

function extractAdjacentSkills(skills: string[], role: string): string[] {
  const map: Record<string, string[]> = {
    'Golang': ['C++', 'Rust', 'Java', 'Distributed Systems'],
    'Go': ['C++', 'Rust', 'Java', 'Erlang'],
    'Python': ['Scala', 'Java', 'Go', 'Data Engineering'],
    'React': ['Vue.js', 'Next.js', 'Angular', 'Frontend Architecture'],
    'LLM': ['NLP', 'Deep Learning', 'Transformers', 'Search & Ranking'],
    'Figma': ['Design Tokens', 'Design Ops', 'User Testing', 'Interaction Design']
  };

  const adjacent: string[] = [];
  for (const s of skills) {
    if (map[s]) adjacent.push(...map[s]);
  }
  return adjacent.length > 0 ? Array.from(new Set(adjacent)).slice(0, 4) : ['Microservices', 'High Concurrency', 'Cloud Native'];
}

function generateRelatedTitles(roleName: string, seniority: string): string[] {
  const clean = roleName.trim();
  return [
    `${seniority} ${clean}`,
    `${clean}`,
    `Software Engineer (${clean})`,
    `Platform Engineer`,
    `Core Infrastructure Engineer`
  ];
}

function generateAlternativeTitles(roleName: string): string[] {
  return [
    `Software Development Engineer II`,
    `Member of Technical Staff`,
    `Systems Engineer`,
    `Infrastructure Architect`,
    `Technical Lead`
  ];
}

function generateFallbackCompanies(role: string, skills: string[]): { name: string; category: string; rationale: string }[] {
  if (skills.includes('Golang') || skills.includes('Go') || skills.includes('Kafka')) {
    return [
      { name: 'Razorpay', category: 'Fintech Tier-1', rationale: 'High QPS transactional ledger architecture in Go/Kafka' },
      { name: 'Swiggy', category: 'High Scale Consumer', rationale: 'Ultra low-latency dispatch and tracking microservices' },
      { name: 'CRED', category: 'Fintech / Platform', rationale: 'High engineering bar in distributed Go and gRPC services' },
      { name: 'Flipkart', category: 'E-commerce Core', rationale: 'Proven scale across large distributed systems and data pipelines' },
      { name: 'PhonePe', category: 'Payment Infrastructure', rationale: 'Mission-critical payment processing and fault tolerance' },
      { name: 'Juspay', category: 'Deep Tech Payments', rationale: 'Known for high functional programming craft and micro-optimization' }
    ];
  }
  if (skills.includes('LLM') || skills.includes('PyTorch') || skills.includes('Generative AI')) {
    return [
      { name: 'Perplexity AI', category: 'AI Search', rationale: 'Direct experience with low-latency LLM retrieval and serving' },
      { name: 'Scale AI', category: 'Enterprise AI', rationale: 'Complex fine-tuning, RLHF and agentic pipelines' },
      { name: 'Cohere', category: 'Foundational Models', rationale: 'Enterprise RAG and embeddings architecture' },
      { name: 'Glean', category: 'Workplace Search', rationale: 'Massive enterprise semantic search and knowledge graph indexing' },
      { name: 'Cursor / Anysphere', category: 'AI Developer Tools', rationale: 'Leading edge prompt cache and agent orchestration' }
    ];
  }
  return [
    { name: 'Stripe', category: 'Fintech & Developer API', rationale: 'World-class API design and rigorous engineering standards' },
    { name: 'Datadog', category: 'Cloud Infrastructure', rationale: 'Extreme scale data ingestion and distributed telemetry' },
    { name: 'Uber', category: 'Real-Time Platforms', rationale: 'Microservice orchestration and high-concurrency dispatch systems' },
    { name: 'Snowflake', category: 'Data Cloud', rationale: 'Deep distributed query engines and cloud scalability' },
    { name: 'Atlassian', category: 'Enterprise SaaS', rationale: 'Collaborative cloud architecture and robust platform practices' }
  ];
}

function extractCompanies(text: string): { targets: { name: string; category: string; rationale: string }[]; exclusions: { name: string; reason: string }[] } {
  const targets: { name: string; category: string; rationale: string }[] = [];
  const exclusions: { name: string; reason: string }[] = [];

  const targetMatch = text.match(/(?:Target Companies|Poach From|Ideal Companies|Target List)[\s\S]*?(?=(?:Off-Limits|Exclusions|Dealbreakers|Compensation|$))/i);
  if (targetMatch) {
    const lines = targetMatch[0].split('\n').slice(1);
    for (const line of lines) {
      const cleaned = line.replace(/^[-*•\d.]+\s*/, '').trim();
      if (cleaned.length > 2 && !cleaned.toLowerCase().includes('target')) {
        const parts = cleaned.split(/[:–—]/);
        if (parts.length >= 2) {
          targets.push({
            name: parts[1].trim(),
            category: parts[0].trim(),
            rationale: 'Directly specified by Hiring Manager in intake notes'
          });
        } else {
          targets.push({
            name: cleaned,
            category: 'Tier-1 Target',
            rationale: 'Aligned engineering culture & tech stack match'
          });
        }
      }
    }
  }

  const exclMatch = text.match(/(?:Off-Limits|Exclusions|Avoid|Do Not Poach)[\s\S]*?(?=(?:Target|Compensation|Timeline|$))/i);
  if (exclMatch) {
    const lines = exclMatch[0].split('\n').slice(1);
    for (const line of lines) {
      const cleaned = line.replace(/^[-*•\d.]+\s*/, '').trim();
      if (cleaned.length > 2 && !cleaned.toLowerCase().includes('off-limit')) {
        exclusions.push({
          name: cleaned,
          reason: 'Explicitly marked as off-limits/restricted in HM intake'
        });
      }
    }
  }

  return { targets: targets.slice(0, 8), exclusions: exclusions.slice(0, 4) };
}

function parseCustomIntakeNotes(notes: string): { mustHaves: string[]; flexZones: string[]; dealbreakers: string[] } {
  const mustHaves: string[] = [];
  const flexZones: string[] = [];
  const dealbreakers: string[] = [];

  const extractSection = (headerPattern: RegExp): string[] => {
    const match = notes.match(headerPattern);
    if (!match) return [];
    const block = match[0];
    return block
      .split('\n')
      .slice(1)
      .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(l => l.length > 5 && !l.endsWith(':'));
  };

  const mh = extractSection(/(?:Must-Haves|Non-Negotiables|Mandatory|Essential)[\s\S]*?(?=(?:Flexibility|Flex Zones|Nice-to-Haves|Dealbreakers|Target|$))/i);
  const fz = extractSection(/(?:Flexibility|Flex Zones|Nice-to-Haves|Compromise)[\s\S]*?(?=(?:Dealbreakers|Non-Negotiables|Must-Haves|Target|$))/i);
  const db = extractSection(/(?:Dealbreakers|Disqualifiers|Avoid|Red Flags)[\s\S]*?(?=(?:Target|Off-Limits|Flexibility|$))/i);

  if (mh.length > 0) mustHaves.push(...mh.slice(0, 5));
  if (fz.length > 0) flexZones.push(...fz.slice(0, 4));
  if (db.length > 0) dealbreakers.push(...db.slice(0, 4));

  return { mustHaves, flexZones, dealbreakers };
}
