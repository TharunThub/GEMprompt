import {
  RequisitionInput,
  SourcingActionPlan,
  PersonaScorecard,
  BooleanSearchSection,
  CompanyMappingMatrix,
  JobPostingCopy,
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
  const yearsExp = extractYearsOfExp(combinedText) || '4-8+';

  // Extract Companies & Exclusions
  const companiesFromNotes = extractCompanies(input.intakeNotes + '\n' + input.jobDescription);
  const targetCompanies = companiesFromNotes.targets.length > 0 ? companiesFromNotes.targets : generateFallbackCompanies(roleName, detectedSkills);
  const customExclusions = companiesFromNotes.exclusions.length > 0
    ? companiesFromNotes.exclusions.map(e => `${e.name} (${e.reason})`).join('; ')
    : 'Direct competitor non-solicit / sister portfolio companies under active pacts';

  // 1. Core Persona & Evaluation Scorecard
  const customIntakeAnalysis = parseCustomIntakeNotes(input.intakeNotes);

  const mustHavesPillar1 = customIntakeAnalysis.mustHaves.length > 0
    ? customIntakeAnalysis.mustHaves.join('; ')
    : `At least ${yearsExp} years hands-on experience in ${coreSkills[0] || 'core engineering'} & ${coreSkills[1] || 'distributed architecture'}. Production track record in ${coreSkills.slice(0, 3).join(', ')}.`;

  const flexZonesPillar1 = customIntakeAnalysis.flexZones.length > 0
    ? customIntakeAnalysis.flexZones.join('; ')
    : `Strong fundamentals in adjacent stacks (${adjacentSkills.slice(0, 2).join(', ') || 'modern frameworks'}) acceptable with demonstrated fast ramp-up.`;

  const dealbreakersPillar1 = customIntakeAnalysis.dealbreakers.length > 0
    ? customIntakeAnalysis.dealbreakers.join('; ')
    : `Pure theoretical/academic experience without verifiable production scale; lacking hands-on implementation depth.`;

  const personaScorecard: PersonaScorecard = {
    targetProfile: `${seniority} ${roleName} with proven track record in ${coreSkills.slice(0, 3).join(', ')}${input.location ? ` in ${input.location}` : ''}. Proven hands-on capability in architecting and delivering high-impact solutions in high-scale environments.`,
    pillars: [
      {
        pillar: 'Domain / Technical Depth',
        weight: '30%',
        mustHaves: mustHavesPillar1,
        flexZones: flexZonesPillar1,
        dealbreakers: dealbreakersPillar1
      },
      {
        pillar: 'System Architecture & Scale',
        weight: '20%',
        mustHaves: `Proven track record with high-throughput distributed systems, microservices, and concurrency optimization.`,
        flexZones: `YOE can be relaxed for top-tier performers with demonstrable high-scale product impact.`,
        dealbreakers: `Experience limited to low-scale CRUD apps or purely managing outsourced vendors.`
      },
      {
        pillar: 'Pedigree / Education / Craft',
        weight: '15%',
        mustHaves: `B.Tech/M.Tech in Computer Science or equivalent practical engineering achievements.`,
        flexZones: `Tier-1 pedigree preferred but stellar GitHub / open-source contributions easily override university background.`,
        dealbreakers: `Inability to clear hands-on live architecture and problem-solving evaluation.`
      },
      {
        pillar: 'Location & Notice Period',
        weight: '15%',
        mustHaves: `${input.location ? `${input.location} (${input.workModel || 'Hybrid'})` : 'Flexible / Hybrid'}; Max 30-45 days notice period preferred.`,
        flexZones: `Buyout options available for immediate/exceptional joiners.`,
        dealbreakers: `Notice period > 60-90 days with zero buyout flexibility; unwilling to adhere to work model.`
      },
      {
        pillar: 'Compensation / Band Fit',
        weight: '20%',
        mustHaves: `Market competitive compensation aligned with ${seniority} ${roleName} band.`,
        flexZones: `Compensation flexibility available for top 5% talent with critical domain expertise.`,
        dealbreakers: `CTC expectations exceeding budgeted ceiling by > 20% without prior HM approval.`
      }
    ]
  };

  // 2. Boolean Search Strings & Platform Filters
  const primaryTitles = generateRelatedTitles(roleName, seniority);
  const broadTitles = [roleName, ...primaryTitles.slice(0, 3)];
  const nicheTitles = primaryTitles.slice(0, 2);
  const diversityTitles = generateAlternativeTitles(roleName);

  const broadVariants = generatePlatformVariants(broadTitles, coreSkills.slice(0, 2), [], [], input.location);
  const broadSearch = {
    description: 'Captures standard job titles and core foundational skills across target geographies.',
    linkedInRecruiter: broadVariants.linkedInRecruiter,
    naukri: broadVariants.naukri,
    googleXray: broadVariants.googleXray
  };

  const targetCompanyNames = targetCompanies.map(c => c.name);
  const targetedVariants = generatePlatformVariants(nicheTitles, coreSkills, secondarySkills.slice(0, 2), targetCompanyNames.slice(0, 5), input.location);
  const targetedSearch = {
    description: 'Highly focused on specific frameworks, deep tech keywords, and candidate poaching pools.',
    linkedInRecruiter: targetedVariants.linkedInRecruiter,
    naukri: targetedVariants.naukri,
    googleXray: targetedVariants.googleXray
  };

  const diversityVariants = generatePlatformVariants(diversityTitles, adjacentSkills, secondarySkills.slice(0, 2), [], input.location);
  const diversitySearch = {
    description: 'Explores non-traditional titles, adjacent industry domains, and parallel skill backgrounds.',
    linkedInRecruiter: diversityVariants.linkedInRecruiter,
    naukri: diversityVariants.naukri,
    googleXray: diversityVariants.googleXray
  };

  const booleanStrings: BooleanSearchSection = {
    broadSearch,
    targetedSearch,
    diversitySearch,
    naukriFilters: {
      experience: `${yearsExp} Years`,
      location: input.location || 'Bengaluru, Hyderabad, Pune, Delhi NCR, Mumbai',
      noticePeriod: '0-30 Days / Serving Notice Period',
      salary: 'Target Market Band / Competitive LPA',
      activePeriod: 'Active in last 30 days'
    }
  };

  // 3. Target Company Mapping Matrix
  const tier1Companies = targetCompanies.slice(0, 5).map(c => c.name);
  const tier2Companies = targetCompanies.slice(5).map(c => c.name);
  const fallbackTier2 = ['Uber', 'Stripe', 'Atlassian', 'Datadog', 'Snowflake', 'Grab'];
  const fallbackTier3 = ['Zepto', 'Groww', 'Postman', 'BrowserStack', 'Zomato', 'InMobi'];

  const companyMapping: CompanyMappingMatrix = {
    segments: [
      {
        segment: 'Tier 1: Direct Competitors & High-Scale Product Leaders',
        companies: tier1Companies.length > 0 ? tier1Companies : ['Razorpay', 'Swiggy', 'CRED', 'Flipkart', 'PhonePe', 'Juspay'],
        businessUnits: 'Core Platform Engineering / High-Throughput Microservices / Distributed Systems GCCs',
        targetDesignations: `${seniority} ${roleName}, Lead Engineer, Member of Technical Staff`,
        exclusions: customExclusions
      },
      {
        segment: 'Tier 2: Adjacent Tech Sectors & Global Capability Centers (GCCs)',
        companies: tier2Companies.length > 0 ? tier2Companies : fallbackTier2,
        businessUnits: 'Enterprise Cloud Architecture / High-Scale Data Infrastructure / Platform Pods',
        targetDesignations: `Senior Software Engineer, Tech Lead, Staff Software Engineer`,
        exclusions: 'Low-scale IT consulting services / bodyshop vendors'
      },
      {
        segment: 'Tier 3: High-Growth Product Startups & Scaled Scaleups',
        companies: fallbackTier3,
        businessUnits: 'Fast-paced Core Product & Infrastructure Engineering',
        targetDesignations: `SDE-2, SDE-3, Senior Platform Engineer`,
        exclusions: 'Early-stage stealth startups with high retention lock-in'
      }
    ]
  };

  // 4. Job Posting Copy
  const jobPostingCopy: JobPostingCopy = {
    naukri: {
      headline: `Hiring ${seniority} ${roleName} - ${coreSkills.slice(0, 3).join(' / ')} | ${input.location || 'Bengaluru / Hybrid'}`,
      keyTags: Array.from(new Set([...coreSkills, ...secondarySkills.slice(0, 3), roleName, 'Microservices', 'Distributed Systems', 'Cloud Architecture'])).slice(0, 8),
      summary: `Exciting opportunity for a ${seniority} ${roleName} with hands-on expertise in ${coreSkills.slice(0, 3).join(', ')}. Join a high-velocity engineering team architecting resilient, high-throughput systems at scale. Excellent compensation and growth opportunities (${input.location ? `${input.location} - ` : ''}${input.workModel || 'Hybrid'}).`
    },
    linkedIn: {
      hook: `🚀 We are actively seeking a talented ${seniority} ${roleName} to join our team! If you thrive on solving complex engineering challenges and architecting scalable systems using ${coreSkills.slice(0, 2).join(' and ')}, let's talk.`,
      responsibilitiesAndRequirements: [
        `Architect, develop, and scale resilient microservices and distributed systems with sub-millisecond latencies.`,
        `Hands-on implementation leveraging ${coreSkills.slice(0, 3).join(', ')} in modern cloud environments.`,
        `Drive technical design reviews, mentor team members, and maintain high standards of code craft.`,
        `Proven experience (${yearsExp} years) building high-scale production services in fast-paced product environments.`,
        `Strong foundation in data structures, algorithms, and concurrency primitives.`
      ]
    }
  };

  // 5. Candidate Outreach & Messaging Strategy
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

  // 6. Day-1 Immediate Checklist
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
      text: `Apply Naukri Resdex filters (${booleanStrings.naukriFilters.experience}, notice period: ${booleanStrings.naukriFilters.noticePeriod}) and export top active candidate matches.`,
      category: 'Sourcing',
      completed: false
    },
    {
      id: 'step-4',
      text: `Personalize and dispatch the first batch of 15-20 targeted InMails using the Hook & Value Proposition template.`,
      category: 'Outreach',
      completed: false
    },
    {
      id: 'step-5',
      text: `Cross-reference target company mapping to identify second-degree connection referrals from existing engineering team.`,
      category: 'Pipeline',
      completed: false
    },
    {
      id: 'step-6',
      text: `Sync with Hiring Manager with first 5 calibration profiles to align on scorecard pillars before full-throttle outreach.`,
      category: 'Sync',
      completed: false
    }
  ];

  return {
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    personaScorecard,
    booleanStrings,
    companyMapping,
    jobPostingCopy,
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
