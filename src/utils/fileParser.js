import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract plain text from PDF or TXT files
 */
export async function parseFileToText(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt')) {
    return await file.text();
  }

  if (fileName.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText.trim();
    } catch (err) {
      console.warn('PDF parsing error, attempting text fallback:', err);
      return await file.text();
    }
  }

  // Fallback for docx or other files
  return await file.text();
}
