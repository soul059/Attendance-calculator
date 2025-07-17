// Simple fallback PDF text extractor that doesn't rely on external workers
// This is a basic implementation for when PDF.js fails due to CORS or other issues

export const extractTextSimple = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const arrayBuffer = e.target.result;
        const text = new TextDecoder().decode(arrayBuffer);
        
        // Very basic PDF text extraction (limited, but works for simple PDFs)
        // This looks for readable text patterns in the PDF binary data
        const textMatches = text.match(/\w+/g) || [];
        const extractedText = textMatches
          .filter(word => word.length > 2 && /^[a-zA-Z]/.test(word))
          .join(' ');
        
        if (extractedText.length > 10) {
          resolve(extractedText);
        } else {
          reject(new Error('Could not extract readable text from PDF'));
        }
      } catch (error) {
        reject(new Error('Failed to read PDF file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
