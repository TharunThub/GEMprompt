import { SourcingActionPlan } from '../types/sourcing';

/**
 * Formats the entire Sourcing Action Plan into clean, human-readable Markdown
 */
export function formatPlanAsMarkdown(plan: SourcingActionPlan): string {
  const { input, personaSummary, booleanStrings, companyMapping, outreachStrategy, dayOneChecklist } = plan;

  return `# SOURCING ACTION PLAN: ${input.title.toUpperCase()}
**Target Location**: ${input.location || 'Flexible'} | **Seniority**: ${input.seniority || 'Mid-Senior'} | **Work Model**: ${input.workModel || 'Flexible'}
**Generated On**: ${new Date(plan.createdAt).toLocaleDateString()}

---

## 1. CORE PERSONA & KEY CRITERIA SUMMARY

### Target Profile
${personaSummary.targetProfile}

### Non-Negotiables (Must-Haves)
${personaSummary.nonNegotiables.map(item => `- **${item}**`).join('\n')}

### Flex Zones (Nice-to-Haves)
${personaSummary.flexZones.map(item => `- ${item}`).join('\n')}

### Dealbreakers & Disqualifiers
${personaSummary.dealbreakers.map(item => `- ❌ ${item}`).join('\n')}

---

## 2. BOOLEAN SEARCH STRINGS

### String 1: Broad / Standard Search
*${booleanStrings.broadSearch.description}*

**LinkedIn Recruiter:**
\`\`\`
${booleanStrings.broadSearch.linkedInRecruiter}
\`\`\`

**Naukri:**
\`\`\`
${booleanStrings.broadSearch.naukri}
\`\`\`

**Google X-Ray:**
\`\`\`
${booleanStrings.broadSearch.googleXray}
\`\`\`

### String 2: Targeted / Niche Search
*${booleanStrings.targetedSearch.description}*

**LinkedIn Recruiter:**
\`\`\`
${booleanStrings.targetedSearch.linkedInRecruiter}
\`\`\`

**Naukri:**
\`\`\`
${booleanStrings.targetedSearch.naukri}
\`\`\`

**Google X-Ray:**
\`\`\`
${booleanStrings.targetedSearch.googleXray}
\`\`\`

### String 3: Diversity / Out-of-the-Box Search
*${booleanStrings.diversitySearch.description}*

**LinkedIn Recruiter:**
\`\`\`
${booleanStrings.diversitySearch.linkedInRecruiter}
\`\`\`

**Naukri:**
\`\`\`
${booleanStrings.diversitySearch.naukri}
\`\`\`

**Google X-Ray:**
\`\`\`
${booleanStrings.diversitySearch.googleXray}
\`\`\`

---

## 3. TARGET & OFF-LIMITS COMPANY MAPPING

### Target Companies to Poach From
${companyMapping.targetCompanies.map(c => `- **${c.name}** (${c.category}): ${c.rationale}`).join('\n')}

### Exclusions & Off-Limits
${companyMapping.exclusions.map(e => `- ⚠️ **${e.name}**: ${e.reason}`).join('\n')}

---

## 4. CANDIDATE OUTREACH & MESSAGING STRATEGY

### Value Proposition / Selling Hooks
${outreachStrategy.valueProposition.map(vp => `1. **${vp}**`).join('\n')}

### Cold Outreach InMail Template
**Subject:** ${outreachStrategy.inMailTemplate.subject}

\`\`\`
${outreachStrategy.inMailTemplate.body}
\`\`\`

---

## 5. DAY-1 IMMEDIATE CHECKLIST
${dayOneChecklist.map((c, i) => `${i + 1}. [ ] **[${c.category}]** ${c.text}`).join('\n')}
`;
}

/**
 * Download Markdown file directly
 */
export function downloadMarkdownFile(plan: SourcingActionPlan) {
  const md = formatPlanAsMarkdown(plan);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const filename = `Sourcing_Plan_${plan.input.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
