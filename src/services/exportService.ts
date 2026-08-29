import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';
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

### Broad Search
**LinkedIn Recruiter:**
${booleanStrings.broadSearch.linkedInRecruiter}

**Naukri:**
${booleanStrings.broadSearch.naukri}

### Targeted Search
**LinkedIn Recruiter:**
${booleanStrings.targetedSearch.linkedInRecruiter}

**Naukri:**
${booleanStrings.targetedSearch.naukri}

---

## 3. TARGET COMPANY MAPPING

### Target Companies
${companyMapping.targetCompanies.map(c => `- **${c.name}** (${c.category}): ${c.rationale}`).join('\n')}

### Exclusions & Off-Limits
${companyMapping.exclusions.map(e => `- ⚠️ **${e.name}**: ${e.reason}`).join('\n')}

---

## 4. OUTREACH STRATEGY

### Value Proposition
${outreachStrategy.valueProposition.map(vp => `1. **${vp}**`).join('\n')}

### InMail Template
**Subject:** ${outreachStrategy.inMailTemplate.subject}

${outreachStrategy.inMailTemplate.body}

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

/**
 * Download as PDF
 */
export function downloadPDFFile(plan: SourcingActionPlan) {
  const doc = new jsPDF();
  const textLines = doc.splitTextToSize(formatPlanAsMarkdown(plan).replace(/\*\*/g, ''), 180);
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
  const md = formatPlanAsMarkdown(plan).replace(/\*\*/g, '');
  const lines = md.split('\n');
  
  const paragraphs = lines.map(line => {
    if (line.startsWith('# ')) {
      return new Paragraph({ text: line.replace('# ', ''), heading: HeadingLevel.HEADING_1 });
    } else if (line.startsWith('## ')) {
      return new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2 });
    } else if (line.startsWith('### ')) {
      return new Paragraph({ text: line.replace('### ', ''), heading: HeadingLevel.HEADING_3 });
    } else if (line.trim() === '---') {
      return new Paragraph({ text: '--------------------------------------------------' });
    } else {
      return new Paragraph({ children: [new TextRun(line)] });
    }
  });

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
