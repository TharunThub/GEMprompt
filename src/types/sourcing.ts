export interface RequisitionInput {
  title: string;
  location?: string;
  seniority?: string;
  workModel?: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  jobDescription: string;
  intakeNotes: string;
}

export interface ScorecardPillar {
  pillar: string;
  weight: string;
  mustHaves: string;
  flexZones: string;
  dealbreakers: string;
}

export interface PersonaScorecard {
  targetProfile: string;
  pillars: ScorecardPillar[];
}

export interface BooleanStringPlatformVariants {
  linkedInRecruiter: string;
  naukri: string;
  googleXray: string;
}

export interface BooleanSearchSection {
  broadSearch: BooleanStringPlatformVariants & { description: string };
  targetedSearch: BooleanStringPlatformVariants & { description: string };
  diversitySearch: BooleanStringPlatformVariants & { description: string };
  naukriFilters: {
    experience: string;
    location: string;
    noticePeriod: string;
    salary: string;
    activePeriod: string;
  };
}

export interface TargetSegment {
  segment: string;
  companies: string[];
  businessUnits: string;
  targetDesignations: string;
  exclusions: string;
}

export interface CompanyMappingMatrix {
  segments: TargetSegment[];
}

export interface JobPostingCopy {
  naukri: {
    headline: string;
    keyTags: string[];
    summary: string;
  };
  linkedIn: {
    hook: string;
    responsibilitiesAndRequirements: string[];
  };
}

export interface OutreachStrategy {
  valueProposition: string[];
  inMailTemplate: {
    subject: string;
    body: string;
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'Sourcing' | 'Outreach' | 'Pipeline' | 'Sync';
  completed: boolean;
}

export interface SourcingActionPlan {
  id: string;
  createdAt: string;
  input: RequisitionInput;
  personaScorecard: PersonaScorecard;
  booleanStrings: BooleanSearchSection;
  companyMapping: CompanyMappingMatrix;
  jobPostingCopy: JobPostingCopy;
  outreachStrategy: OutreachStrategy;
  dayOneChecklist: ChecklistItem[];
}

export interface ApiSettings {
  provider: 'local' | 'gemini' | 'openai';
  apiKey: string;
  modelName: string;
}

export interface PresetRequisition {
  id: string;
  label: string;
  badge: string;
  input: RequisitionInput;
}
