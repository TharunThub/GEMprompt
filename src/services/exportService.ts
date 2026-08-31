import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';
import { SourcingActionPlan } from '../types/sourcing';

/**
 * Formats the entire Sourcing Action Plan into clean, human-readable Markdown
 */
export function formatPlanAsMarkdown(plan: SourcingActionPlan): string {
  const {
    input,
    personaScorecard,
    booleanStrings,
    companyMapping,
    jobPostingCopy,
    outreachStrategy,
    dayOneChecklist
  } = plan;

  return `# SOURCING ACTION PLAN: ${input.title.toUpperCase()}
**Target Location**: ${input.location || 'Flexible'} | **Seniority**: ${input.seniority || 'Mid-Senior'} | **Work Model**: ${input.workModel || 'Flexible'}
**Generated On**: ${new Date(plan.createdAt).toLocaleDateString()}

---

## 1. CORE PERSONA & EVALUATION SCORECARD

### Target Profile Narrative
${personaScorecard.targetProfile}

### 5-Pillar Scorecard Matrix
| Evaluation Pillar | Weight | Must-Have Criteria | Flex / Compromise | Absolute Dealbreakers |
| :--- | :--- | :--- | :--- | :--- |
${personaScorecard.pillars.map(p => `| **${p.pillar}** | ${p.weight} | ${p.mustHaves.replace(/\|/g, '\\|')} | ${p.flexZones.replace(/\|/g, '\\|')} | ${p.dealbreakers.replace(/\|/g, '\\|')} |`).join('\n')}

---

## 2. BOOLEAN SEARCH STRINGS & PLATFORM FILTERS

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

### Naukri Platform Filters
- **Experience:** ${booleanStrings.naukriFilters.experience}
- **Location:** ${booleanStrings.naukriFilters.location}
- **Notice Period:** ${booleanStrings.naukriFilters.noticePeriod}
- **Salary / CTC:** ${booleanStrings.naukriFilters.salary}
- **Candidate Activity:** ${booleanStrings.naukriFilters.activePeriod}

---

## 3. TARGET COMPANY MAPPING

### Company Segmentation Matrix
| Target Segment | Target Companies | Target Business Units | Target Designations | Segment Exclusions |
| :--- | :--- | :--- | :--- | :--- |
${companyMapping.segments.map(s => `| **${s.segment}** | ${s.companies.join(', ')} | ${s.businessUnits.replace(/\|/g, '\\|')} | ${s.targetDesignations.replace(/\|/g, '\\|')} | ${s.exclusions.replace(/\|/g, '\\|')} |`).join('\n')}

---

## 4. JOB POSTING COPY

### Naukri Job Posting
- **Headline:** ${jobPostingCopy.naukri.headline}
- **Key Tags / Skills:** ${jobPostingCopy.naukri.keyTags.join(', ')}
- **Summary:**
${jobPostingCopy.naukri.summary}

### LinkedIn Job Posting
- **Hook:**
${jobPostingCopy.linkedIn.hook}

- **Key Responsibilities & Requirements:**
${jobPostingCopy.linkedIn.responsibilitiesAndRequirements.map(req => `- ${req}`).join('\n')}

---

## 5. OUTREACH STRATEGY & INMAIL

### Value Proposition Selling Hooks
${outreachStrategy.valueProposition.map((vp, i) => `${i + 1}. **${vp}**`).join('\n')}

### Cold Outreach InMail Template
**Subject:** ${outreachStrategy.inMailTemplate.subject}

${outreachStrategy.inMailTemplate.body}

---

## 6. DAY-1 IMMEDIATE CHECKLIST
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

/**
 * Download as PDF
 */
export function downloadPDFFile(plan: SourcingActionPlan) {
  const doc = new jsPDF();
  const textLines = doc.splitTextToSize(formatPlanAsMarkdown(plan).replace(/\*\*/g, '').replace(/```/g, ''), 180);
  doc.setFontSize(10);
  let y = 10;
  textLines.forEach((line: string) => {
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
    doc.text(line, 10, y);
    y += 5;
  });
  doc.save(`Sourcing_Plan_${plan.input.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * Download as DOCX
 */
export async function downloadDOCXFile(plan: SourcingActionPlan) {
  const {
    input,
    personaScorecard,
    booleanStrings,
    companyMapping,
    jobPostingCopy,
    outreachStrategy,
    dayOneChecklist
  } = plan;

  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: `SOURCING ACTION PLAN: ${input.title.toUpperCase()}`,
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Target Location: ${input.location || 'Flexible'} | `, bold: true }),
        new TextRun({ text: `Seniority: ${input.seniority || 'Mid-Senior'} | `, bold: true }),
        new TextRun({ text: `Work Model: ${input.workModel || 'Flexible'} | `, bold: true }),
        new TextRun({ text: `Generated On: ${new Date(plan.createdAt).toLocaleDateString()}`, bold: true })
      ]
    }),
    new Paragraph({ text: '--------------------------------------------------' }),

    // 1. Persona Scorecard
    new Paragraph({
      text: '1. CORE PERSONA & EVALUATION SCORECARD',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: 'Target Profile Narrative',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({
      children: [new TextRun(personaScorecard.targetProfile)]
    }),
    new Paragraph({
      text: '5-Pillar Scorecard Matrix',
      heading: HeadingLevel.HEADING_3
    }),
    ...personaScorecard.pillars.flatMap(p => [
      new Paragraph({
        children: [
          new TextRun({ text: `• ${p.pillar} `, bold: true }),
          new TextRun(`(Weight: ${p.weight})`)
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '   - Must-Haves: ', bold: true }),
          new TextRun(p.mustHaves)
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '   - Flex Zones: ', bold: true }),
          new TextRun(p.flexZones)
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '   - Dealbreakers: ', bold: true }),
          new TextRun(p.dealbreakers)
        ]
      })
    ]),
    new Paragraph({ text: '--------------------------------------------------' }),

    // 2. Boolean Search Strings & Platform Filters
    new Paragraph({
      text: '2. BOOLEAN SEARCH STRINGS & PLATFORM FILTERS',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: 'String 1: Broad / Standard Search',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: booleanStrings.broadSearch.description, italics: true })] }),
    new Paragraph({ children: [new TextRun({ text: 'LinkedIn Recruiter: ', bold: true }), new TextRun(booleanStrings.broadSearch.linkedInRecruiter)] }),
    new Paragraph({ children: [new TextRun({ text: 'Naukri: ', bold: true }), new TextRun(booleanStrings.broadSearch.naukri)] }),
    new Paragraph({ children: [new TextRun({ text: 'Google X-Ray: ', bold: true }), new TextRun(booleanStrings.broadSearch.googleXray)] }),

    new Paragraph({
      text: 'String 2: Targeted / Niche Search',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: booleanStrings.targetedSearch.description, italics: true })] }),
    new Paragraph({ children: [new TextRun({ text: 'LinkedIn Recruiter: ', bold: true }), new TextRun(booleanStrings.targetedSearch.linkedInRecruiter)] }),
    new Paragraph({ children: [new TextRun({ text: 'Naukri: ', bold: true }), new TextRun(booleanStrings.targetedSearch.naukri)] }),
    new Paragraph({ children: [new TextRun({ text: 'Google X-Ray: ', bold: true }), new TextRun(booleanStrings.targetedSearch.googleXray)] }),

    new Paragraph({
      text: 'String 3: Diversity / Out-of-the-Box Search',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: booleanStrings.diversitySearch.description, italics: true })] }),
    new Paragraph({ children: [new TextRun({ text: 'LinkedIn Recruiter: ', bold: true }), new TextRun(booleanStrings.diversitySearch.linkedInRecruiter)] }),
    new Paragraph({ children: [new TextRun({ text: 'Naukri: ', bold: true }), new TextRun(booleanStrings.diversitySearch.naukri)] }),
    new Paragraph({ children: [new TextRun({ text: 'Google X-Ray: ', bold: true }), new TextRun(booleanStrings.diversitySearch.googleXray)] }),

    new Paragraph({
      text: 'Naukri Platform Filters',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: '• Experience: ', bold: true }), new TextRun(booleanStrings.naukriFilters.experience)] }),
    new Paragraph({ children: [new TextRun({ text: '• Location: ', bold: true }), new TextRun(booleanStrings.naukriFilters.location)] }),
    new Paragraph({ children: [new TextRun({ text: '• Notice Period: ', bold: true }), new TextRun(booleanStrings.naukriFilters.noticePeriod)] }),
    new Paragraph({ children: [new TextRun({ text: '• Salary / CTC: ', bold: true }), new TextRun(booleanStrings.naukriFilters.salary)] }),
    new Paragraph({ children: [new TextRun({ text: '• Candidate Activity: ', bold: true }), new TextRun(booleanStrings.naukriFilters.activePeriod)] }),
    new Paragraph({ text: '--------------------------------------------------' }),

    // 3. Target Company Mapping
    new Paragraph({
      text: '3. TARGET COMPANY MAPPING',
      heading: HeadingLevel.HEADING_2
    }),
    ...companyMapping.segments.flatMap(s => [
      new Paragraph({
        text: s.segment,
        heading: HeadingLevel.HEADING_3
      }),
      new Paragraph({ children: [new TextRun({ text: '• Target Companies: ', bold: true }), new TextRun(s.companies.join(', '))] }),
      new Paragraph({ children: [new TextRun({ text: '• Business Units: ', bold: true }), new TextRun(s.businessUnits)] }),
      new Paragraph({ children: [new TextRun({ text: '• Target Designations: ', bold: true }), new TextRun(s.targetDesignations)] }),
      new Paragraph({ children: [new TextRun({ text: '• Exclusions: ', bold: true }), new TextRun(s.exclusions)] })
    ]),
    new Paragraph({ text: '--------------------------------------------------' }),

    // 4. Job Posting Copy
    new Paragraph({
      text: '4. JOB POSTING COPY',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: 'Naukri Job Posting',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: 'Headline: ', bold: true }), new TextRun(jobPostingCopy.naukri.headline)] }),
    new Paragraph({ children: [new TextRun({ text: 'Key Tags: ', bold: true }), new TextRun(jobPostingCopy.naukri.keyTags.join(', '))] }),
    new Paragraph({ children: [new TextRun({ text: 'Summary: ', bold: true }), new TextRun(jobPostingCopy.naukri.summary)] }),

    new Paragraph({
      text: 'LinkedIn Job Posting',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: 'Hook: ', bold: true }), new TextRun(jobPostingCopy.linkedIn.hook)] }),
    new Paragraph({ children: [new TextRun({ text: 'Key Responsibilities & Requirements:', bold: true })] }),
    ...jobPostingCopy.linkedIn.responsibilitiesAndRequirements.map(req =>
      new Paragraph({ children: [new TextRun({ text: '• ' }), new TextRun(req)] })
    ),
    new Paragraph({ text: '--------------------------------------------------' }),

    // 5. Outreach Strategy
    new Paragraph({
      text: '5. OUTREACH STRATEGY & INMAIL',
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      text: 'Value Proposition Selling Hooks',
      heading: HeadingLevel.HEADING_3
    }),
    ...outreachStrategy.valueProposition.map((vp, idx) =>
      new Paragraph({ children: [new TextRun({ text: `${idx + 1}. `, bold: true }), new TextRun(vp)] })
    ),
    new Paragraph({
      text: 'Cold Outreach InMail Template',
      heading: HeadingLevel.HEADING_3
    }),
    new Paragraph({ children: [new TextRun({ text: 'Subject: ', bold: true }), new TextRun(outreachStrategy.inMailTemplate.subject)] }),
    new Paragraph({ children: [new TextRun(outreachStrategy.inMailTemplate.body)] }),
    new Paragraph({ text: '--------------------------------------------------' }),

    // 6. Day-1 Execution Checklist
    new Paragraph({
      text: '6. DAY-1 IMMEDIATE CHECKLIST',
      heading: HeadingLevel.HEADING_2
    }),
    ...dayOneChecklist.map((c, i) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${i + 1}. [${c.category}] `, bold: true }),
          new TextRun(c.text)
        ]
      })
    )
  ];

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const filename = `Sourcing_Plan_${plan.input.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

