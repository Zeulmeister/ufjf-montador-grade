import * as pdfjsLib from 'pdfjs-dist';

// Set worker CDN for browser PDF parsing
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by line (using Y position coordinate)
    const linesMap = new Map();

    textContent.items.forEach(item => {
      if (!item.str) return;
      // Round Y coordinate to group items on the same line
      const y = Math.round(item.transform[5]);
      if (!linesMap.has(y)) {
        linesMap.set(y, []);
      }
      linesMap.get(y).push(item);
    });

    // Sort lines by Y descending (top to bottom of page)
    const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);

    sortedY.forEach(y => {
      // Sort items on the same line by X ascending (left to right)
      const lineItems = linesMap.get(y).sort((a, b) => a.transform[4] - b.transform[4]);
      const lineText = lineItems.map(i => i.str).join(' ');
      fullText += lineText + '\n';
    });

    fullText += '\n'; // Page separator
  }

  return fullText;
}
