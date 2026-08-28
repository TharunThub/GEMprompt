export interface RequisitionInput {
  title: string;
  location?: string;
  seniority?: string;
  workModel?: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  jobDescription: string;
  intakeNotes: string;
}

export interface PersonaSummary {
  targetProfile: string;
  nonNegotiables: string[];
  flexZones: string[];
  dealbreakers: string[];
}

export interface BooleanStringPlatformVariants {
  linkedInRecruiter: string;
  naukri: string;
  googleXray: string;
  standard: string;
}

export interface BooleanSearchSection {
  broadSearch: BooleanStringPlatformVariants & { description: string };
  targetedSearch: BooleanStringPlatformVariants & { description: string };
  diversitySearch: BooleanStringPlatformVariants & { description: string };
}

export interface CompanyMapping {
  targetCompanies: {
    name: string;
    category: string;
    rationale: string;
  }[];
  exclusions: {
    name: string;
    reason: string;
  }[];
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
  personaSummary: PersonaSummary;
  booleanStrings: BooleanSearchSection;
  companyMapping: CompanyMapping;
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
