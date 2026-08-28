import { BooleanStringPlatformVariants } from '../types/sourcing';

export interface BooleanStringInput {
  titles: string[];
  mandatorySkills: string[];
  toolsAndTech: string[];
  targetCompanies?: string[];
  locations?: string[];
  exclusions?: string[];
}

/**
 * Clean and quote terms that contain spaces or special characters
 */
function quoteTerm(term: string): string {
  const trimmed = term.trim();
  if (trimmed.includes(' ') && !trimmed.startsWith('"') && !trimmed.endsWith('"')) {
    return `"${trimmed}"`;
  }
  return trimmed;
}

function buildOrGroup(terms: string[]): string {
  const valid = terms.filter(t => t && t.trim().length > 0).map(quoteTerm);
  if (valid.length === 0) return '';
  if (valid.length === 1) return valid[0];
  return `(${valid.join(' OR ')})`;
}

/**
 * Builds platform-tailored Boolean search variants
 */
export function generatePlatformVariants(
  titles: string[],
  coreKeywords: string[],
  secondaryKeywords: string[] = [],
  companies: string[] = [],
  location: string = '',
  negativeKeywords: string[] = ['intern', 'trainee', 'student', 'recruiter', 'hr']
): BooleanStringPlatformVariants {
  const titleGroup = buildOrGroup(titles);
  const coreGroup = buildOrGroup(coreKeywords);
  const secondaryGroup = secondaryKeywords.length > 0 ? buildOrGroup(secondaryKeywords) : '';
  const companyGroup = companies.length > 0 ? buildOrGroup(companies) : '';

  // 1. Standard / Generic Boolean
  const standardParts: string[] = [];
  if (titleGroup) standardParts.push(titleGroup);
  if (coreGroup) standardParts.push(coreGroup);
  if (secondaryGroup) standardParts.push(secondaryGroup);
  if (companyGroup) standardParts.push(companyGroup);
  const standard = standardParts.join(' AND ');

  // 2. LinkedIn Recruiter Boolean (optimised for LinkedIn field matching and operators)
  const liParts: string[] = [];
  if (titleGroup) liParts.push(titleGroup);
  if (coreGroup) liParts.push(coreGroup);
  if (secondaryGroup) liParts.push(secondaryGroup);
  if (companyGroup) liParts.push(companyGroup);
  if (negativeKeywords.length > 0) {
    liParts.push(`NOT (${negativeKeywords.map(quoteTerm).join(' OR ')})`);
  }
  const linkedInRecruiter = liParts.join(' AND ');

  // 3. Naukri Boolean (Naukri Resdex search supports uppercase AND, OR, brackets)
  const naukriParts: string[] = [];
  if (titleGroup) naukriParts.push(titleGroup);
  if (coreGroup) naukriParts.push(coreGroup);
  if (secondaryGroup) naukriParts.push(secondaryGroup);
  if (companyGroup) naukriParts.push(companyGroup);
  const naukri = naukriParts.join(' AND ');

  // 4. Google X-Ray Search for LinkedIn Profiles
  const xrayTitles = titles.slice(0, 4).map(t => `intitle:${quoteTerm(t)}`).join(' OR ');
  const xrayTitleGroup = xrayTitles ? `(${xrayTitles})` : '';
  const xrayLocation = location ? quoteTerm(location) : '';
  const xrayNegatives = negativeKeywords.slice(0, 5).map(n => `-intitle:${n}`).join(' ');

  const xrayParts: string[] = ['site:linkedin.com/in/'];
  if (xrayTitleGroup) xrayParts.push(xrayTitleGroup);
  if (coreGroup) xrayParts.push(coreGroup);
  if (secondaryGroup) xrayParts.push(secondaryGroup);
  if (companyGroup) xrayParts.push(companyGroup);
  if (xrayLocation) xrayParts.push(xrayLocation);
  if (xrayNegatives) xrayParts.push(xrayNegatives);
  const googleXray = xrayParts.join(' ');

  return {
    standard,
    linkedInRecruiter,
    naukri,
    googleXray
  };
}
