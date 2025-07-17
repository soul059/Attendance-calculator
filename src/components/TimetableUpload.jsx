import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { extractTextFromPDF, parseSubjectsFromText } from '../utils/pdfExtractor';

const TimetableUpload = ({ onSubjectsExtracted, onNext }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [extractedSubjects, setExtractedSubjects] = useState([]);
  const [error, setError] = useState('');
  const [showExtractedText, setShowExtractedText] = useState(false);

  // Sample subjects for demo when no PDF is uploaded
  const sampleSubjects = [
    { name: 'Mathematics', lecturesPerWeek: 4, isLab: false },
    { name: 'Physics', lecturesPerWeek: 3, isLab: false },
    { name: 'Chemistry', lecturesPerWeek: 3, isLab: false },
    { name: 'Physics Lab', lecturesPerWeek: 2, isLab: true },
    { name: 'Chemistry Lab', lecturesPerWeek: 2, isLab: true },
    { name: 'Computer Science', lecturesPerWeek: 4, isLab: false },
    { name: 'Computer Programming Lab', lecturesPerWeek: 3, isLab: true },
    { name: 'English', lecturesPerWeek: 2, isLab: false }
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setFile(selectedFile);
    setError('');
    setIsProcessing(true);
    setExtractedText('');
    setExtractedSubjects([]);

    try {
      // Extract text from PDF
      console.log('Processing PDF:', selectedFile.name);
      const text = await extractTextFromPDF(selectedFile);
      setExtractedText(text);

      // Parse subjects from extracted text
      const subjects = parseSubjectsFromText(text);
      
      if (subjects.length > 0) {
        setExtractedSubjects(subjects);
        onSubjectsExtracted(subjects);
        setError(''); // Clear any previous errors
      } else {
        // If no subjects found, fall back to sample subjects
        setExtractedSubjects(sampleSubjects);
        onSubjectsExtracted(sampleSubjects);
        setError('No subjects detected in PDF. Using sample subjects. You can edit them in the next step.');
      }
      
      setIsProcessing(false);
    } catch (err) {
      console.error('PDF processing error:', err);
      
      // Use the specific error message from the PDF extractor
      const errorMessage = err.message || 'Error processing PDF file';
      setError(`${errorMessage} Using sample subjects as fallback - you can edit them in the next step.`);
      
      // Fall back to sample subjects
      setExtractedSubjects(sampleSubjects);
      onSubjectsExtracted(sampleSubjects);
      setIsProcessing(false);
    }
  };

  const handleManualEntry = () => {
    // For users who want to enter subjects manually
    onSubjectsExtracted([]);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Upload Your Timetable
        </h2>
        <p className="text-gray-600 mb-6">
          Upload a PDF of your class timetable to automatically extract subject information, 
          or choose to enter subjects manually.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : file
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Processing PDF...</p>
          </div>
        ) : file ? (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <p className="text-green-600 font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">PDF uploaded successfully</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop your PDF timetable here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {file && !isProcessing && extractedSubjects.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Extracted Subjects:</h3>
            {extractedText && (
              <button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                {showExtractedText ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showExtractedText ? 'Hide' : 'Show'} extracted text</span>
              </button>
            )}
          </div>
          
          {showExtractedText && extractedText && (
            <div className="bg-white p-3 rounded border text-xs text-gray-600 max-h-32 overflow-y-auto">
              <strong>Raw extracted text:</strong>
              <div className="mt-1 whitespace-pre-wrap">{extractedText.substring(0, 500)}{extractedText.length > 500 ? '...' : ''}</div>
            </div>
          )}
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {extractedSubjects.map((subject, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{subject.name}</span>
                    {subject.isLab && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Lab
                      </span>
                    )}
                    {subject.confidence && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        subject.confidence > 0.7 
                          ? 'bg-green-100 text-green-800' 
                          : subject.confidence > 0.5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(subject.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {subject.lecturesPerWeek} lectures/week
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <strong>Note:</strong> The subjects above were automatically extracted from your PDF. 
            You can edit, add, or remove subjects in the next step to ensure accuracy.
          </div>
        </div>
      )}

      {file && !isProcessing && extractedSubjects.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800 mb-2">
            <AlertCircle size={20} />
            <span className="font-medium">No subjects detected</span>
          </div>
          <p className="text-yellow-700 text-sm">
            We couldn't automatically detect subjects in your PDF. You can add them manually in the next step.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleManualEntry}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <FileText size={20} />
          <span>Enter Manually</span>
        </button>
        
        {file && !isProcessing && (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default TimetableUpload;
