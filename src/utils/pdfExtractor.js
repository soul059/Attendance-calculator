import * as pdfjsLib from 'pdfjs-dist';
import { extractTextSimple } from './simplePdfExtractor';

// Set up the worker to avoid CORS issues
// Use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';

export const extractTextFromPDF = async (file) => {
  try {
    // Validate file
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Invalid PDF file');
    }

    // First try the advanced PDF.js method
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Configure PDF.js with better error handling
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ') // Clean up multiple spaces
            .trim();
          
          if (pageText) {
            fullText += pageText + '\n';
          }
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          // Continue with other pages
        }
      }

      // Clean up the PDF document
      await pdf.destroy();

      if (!fullText.trim()) {
        throw new Error('No text could be extracted from the PDF using PDF.js');
      }

      console.log('Successfully extracted text using PDF.js');
      return fullText.trim();
      
    } catch (pdfJsError) {
      console.warn('PDF.js extraction failed, trying fallback method:', pdfJsError);
      
      // Fallback to simple extraction method
      try {
        const simpleText = await extractTextSimple(file);
        console.log('Successfully extracted text using fallback method');
        return simpleText;
      } catch (fallbackError) {
        console.error('Both extraction methods failed:', fallbackError);
        throw fallbackError;
      }
    }

  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    
    // Provide more specific error messages
    if (error.message.includes('CORS')) {
      throw new Error('PDF processing failed due to security restrictions. Please try a different PDF or enter subjects manually.');
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error('The uploaded file is not a valid PDF. Please upload a PDF file.');
    } else if (error.message.includes('No text')) {
      throw new Error('This PDF appears to be image-based or encrypted. Please try a text-based PDF or enter subjects manually.');
    }
    
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
};

export const parseSubjectsFromText = (text) => {
  const subjects = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Common subject patterns and keywords - all case insensitive
  const subjectPatterns = [
    // Subject names with common academic terms
    /(?:mathematics|math|calculus|algebra|geometry|statistics|trigonometry|linear\s*algebra)/i,
    /(?:physics|mechanics|thermodynamics|electromagnetism|optics|quantum|relativity)/i,
    /(?:chemistry|organic|inorganic|physical\s*chemistry|analytical|biochemistry)/i,
    /(?:computer\s*science|programming|algorithms|data\s*structures|software|coding|java|python|c\+\+)/i,
    /(?:engineering|electrical|mechanical|civil|chemical|aerospace|industrial)/i,
    /(?:biology|botany|zoology|genetics|microbiology|ecology|anatomy|physiology)/i,
    /(?:english|literature|grammar|composition|communication|writing|linguistics)/i,
    /(?:history|geography|economics|political\s*science|sociology|psychology|philosophy)/i,
    /(?:art|music|drawing|painting|design|fine\s*arts|visual\s*arts)/i,
    /(?:management|business|accounting|finance|marketing|economics|commerce)/i,
    /(?:computer|IT|information\s*technology|software\s*engineering|networking|database)/i,
    // Add more comprehensive patterns
    /(?:medical|medicine|nursing|pharmacy|dentistry)/i,
    /(?:law|legal|jurisprudence)/i,
    /(?:education|pedagogy|teaching)/i,
    /(?:environmental|ecology|sustainability)/i,
    /(?:statistics|probability|discrete\s*math)/i,
    /(?:foreign\s*language|spanish|french|german|japanese|chinese)/i,
    // Generic academic terms that might appear in subject names
    /(?:theory|principles|fundamentals|introduction|advanced|basic)/i,
  ];

  // Lab patterns - enhanced to catch more variations
  const labPatterns = [
    /(.+?)\s+lab(?:oratory)?/i,
    /lab(?:oratory)?\s+(.+)/i,
    /(.+?)\s+practical/i,
    /practical\s+(.+)/i,
    /(.+?)\s+workshop/i,
    /workshop\s+(.+)/i,
    /(.+?)\s+session/i,
    /session\s+(.+)/i,
    /(.+?)\s+demo/i,
    /demo\s+(.+)/i
  ];

  // Time patterns to identify schedule entries
  const timePattern = /(?:\d{1,2}:\d{2}|\d{1,2}\s*(?:am|pm))/i;
  const dayPattern = /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)/i;

  // Extract potential subject lines
  const potentialSubjects = [];
  
  for (const line of lines) {
    // Skip lines that are clearly time, day, or other metadata
    if (timePattern.test(line) || dayPattern.test(line) || 
        /^\d+$/.test(line) || line.length < 3) {
      continue;
    }

    // Check for lab subjects first - improved case handling
    for (const labPattern of labPatterns) {
      const match = line.match(labPattern);
      if (match) {
        const subjectName = match[1] || match[2];
        if (subjectName && subjectName.length > 2) {
          // Convert to proper case for consistency
          const properCaseName = subjectName
            .trim()
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          potentialSubjects.push({
            name: `${properCaseName} Lab`,
            isLab: true,
            originalLine: line
          });
        }
      }
    }

    // Check for regular subjects
    for (const pattern of subjectPatterns) {
      if (pattern.test(line)) {
        // Extract the subject name more precisely
        const words = line.split(/\s+/);
        const subjectWords = words.filter(word => 
          word.length > 2 && 
          !/^\d+$/.test(word) && 
          !timePattern.test(word)
        );
        
        if (subjectWords.length > 0) {
          // Convert to proper case for consistency
          const subjectName = subjectWords
            .join(' ')
            .trim()
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          potentialSubjects.push({
            name: subjectName,
            isLab: false,
            originalLine: line
          });
        }
      }
    }

    // Generic subject detection for other subjects - improved case handling
    if (line.length > 3 && line.length < 50 && 
        /^[a-zA-Z\s&\-\(\)\.0-9]+$/.test(line) && 
        !timePattern.test(line) && 
        !dayPattern.test(line)) {
      
      // Check if it might be a subject name
      const words = line.split(/\s+/);
      if (words.length >= 1 && words.length <= 8) {
        const cleanName = words
          .filter(word => word.length > 1 && !/^\d+$/.test(word))
          .join(' ')
          .trim();
        
        if (cleanName.length > 2) {
          // Convert to proper case for consistency
          const properCaseName = cleanName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          potentialSubjects.push({
            name: properCaseName,
            isLab: /lab|practical/i.test(cleanName),
            originalLine: line
          });
        }
      }
    }
  }

  // Remove duplicates and clean up
  const uniqueSubjects = [];
  const seenNames = new Set();

  for (const subject of potentialSubjects) {
    const normalizedName = subject.name.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    
    if (!seenNames.has(normalizedName) && normalizedName.length > 2) {
      seenNames.add(normalizedName);
      
      // Estimate lectures per week based on subject type
      let lecturesPerWeek = 3; // default
      
      if (subject.isLab) {
        lecturesPerWeek = 2; // Labs typically have fewer hours but longer sessions
      } else if (/math|physics|chemistry|computer/i.test(subject.name)) {
        lecturesPerWeek = 4; // Core subjects often have more lectures
      } else if (/english|history|art/i.test(subject.name)) {
        lecturesPerWeek = 2; // Some subjects may have fewer lectures
      }

      uniqueSubjects.push({
        name: subject.name,
        lecturesPerWeek: lecturesPerWeek,
        isLab: subject.isLab,
        confidence: calculateConfidence(subject.name, subject.originalLine)
      });
    }
  }

  // Sort by confidence and return top matches
  return uniqueSubjects
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 15); // Limit to reasonable number of subjects
};

const calculateConfidence = (subjectName, originalLine) => {
  let confidence = 0.5; // base confidence
  
  // Higher confidence for recognized academic terms
  const academicTerms = [
    'mathematics', 'physics', 'chemistry', 'biology', 'computer', 'engineering',
    'english', 'history', 'geography', 'economics', 'management', 'science'
  ];
  
  for (const term of academicTerms) {
    if (subjectName.toLowerCase().includes(term)) {
      confidence += 0.3;
      break;
    }
  }
  
  // Higher confidence for lab subjects
  if (/lab|practical/i.test(subjectName)) {
    confidence += 0.2;
  }
  
  // Lower confidence for very short or very long names
  if (subjectName.length < 4 || subjectName.length > 40) {
    confidence -= 0.2;
  }
  
  // Higher confidence for properly capitalized names
  if (/^[A-Z]/.test(subjectName)) {
    confidence += 0.1;
  }
  
  return Math.max(0, Math.min(1, confidence));
};
