// Configure the worker to use a CDN to avoid Vite/bundling issues with web workers
if (typeof window !== 'undefined') {
  (window as any).pdfjsWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

// Dynamically load mammoth from CDN
async function getMammoth() {
  if ((window as any).mammoth) return (window as any).mammoth;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js';
    script.onload = () => resolve((window as any).mammoth);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Dynamically load pdfjs from CDN
async function getPdfJs() {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = (window as any).pdfjsWorkerSrc;
      resolve(pdfjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function parseFileToText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return parsePdf(file);
  } else if (extension === 'docx') {
    return parseDocx(file);
  } else if (extension === 'txt') {
    return file.text();
  } else {
    throw new Error('Unsupported file format. Please upload a .pdf, .docx, or .txt file.');
  }
}

async function parsePdf(file: File): Promise<string> {
  const pdfjsLib = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  
  // Use pdf.js to extract text
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText.trim();
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await getMammoth();
  const arrayBuffer = await file.arrayBuffer();
  // mammoth extracts raw text cleanly from .docx
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

