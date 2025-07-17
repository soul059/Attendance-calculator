import React, { useState } from 'react';
import { Upload, Calculator, FileText, Calendar, Percent } from 'lucide-react';
import TimetableUpload from './TimetableUpload';
import SubjectForm from './SubjectForm';
import AttendanceResults from './AttendanceResults';

const AttendanceCalculator = () => {
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const calculateAttendance = () => {
    const calculatedResults = subjects.map(subject => {
      const totalLectures = subject.lecturesPerWeek * 4; // Assuming 4 weeks per month
      const requiredLectures = Math.ceil((totalLectures * targetPercentage) / 100);
      const canSkip = totalLectures - requiredLectures;
      const actualPercentage = ((totalLectures - canSkip) / totalLectures) * 100;

      return {
        ...subject,
        totalLecturesPerMonth: totalLectures,
        requiredLectures,
        canSkip: Math.max(0, canSkip),
        actualPercentage: actualPercentage.toFixed(1)
      };
    });

    setResults(calculatedResults);
    setCurrentStep(4);
  };

  const resetCalculator = () => {
    setSubjects([]);
    setResults(null);
    setCurrentStep(1);
    setTargetPercentage(75);
  };

  const steps = [
    { number: 1, title: 'Upload Timetable', icon: Upload },
    { number: 2, title: 'Set Target %', icon: Percent },
    { number: 3, title: 'Review Subjects', icon: FileText },
    { number: 4, title: 'View Results', icon: Calculator }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        {/* Desktop Progress Steps */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Progress Steps */}
        <div className="md:hidden">
          {/* Current Step Indicator */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500 mb-1">
              Step {currentStep} of {steps.length}
            </div>
            <div className="font-medium text-gray-800">
              {steps[currentStep - 1].title}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
              ></div>
            </div>
          </div>

          {/* Mobile Steps List */}
          <div className="space-y-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className={`flex items-center p-2 rounded-lg ${
                  isActive ? 'bg-blue-50 border border-blue-200' : ''
                }`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon size={14} />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {isCompleted && (
                    <span className="ml-auto text-green-500 text-xs">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {currentStep === 1 && (
          <TimetableUpload 
            onSubjectsExtracted={setSubjects}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Set Your Target Attendance Percentage
              </h2>
              <p className="text-gray-600 mb-6">
                Enter the minimum attendance percentage you want to maintain
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Attendance Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="75"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-lg">%</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!targetPercentage || targetPercentage < 1 || targetPercentage > 100}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <SubjectForm
            subjects={subjects}
            setSubjects={setSubjects}
            onBack={() => setCurrentStep(2)}
            onCalculate={calculateAttendance}
          />
        )}

        {currentStep === 4 && results && (
          <AttendanceResults
            results={results}
            targetPercentage={targetPercentage}
            onReset={resetCalculator}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceCalculator;
