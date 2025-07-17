import React from 'react';
import { RefreshCw, Download, Calendar, BookOpen, CheckCircle, AlertTriangle, FlaskConical, Book } from 'lucide-react';

const AttendanceResults = ({ results, targetPercentage, onReset, onBack }) => {
  const totalSubjects = results.length;
  const canSkipAny = results.filter(r => r.canSkip > 0).length;
  const totalLectures = results.reduce((sum, r) => sum + r.totalLecturesPerMonth, 0);
  const totalCanSkip = results.reduce((sum, r) => sum + r.canSkip, 0);

  const exportResults = () => {
    const csvContent = [
      ['Subject', 'Type', 'Lectures per Week', 'Total Lectures (Month)', 'Required Lectures', 'Can Skip', 'Actual Percentage'],
      ...results.map(r => [
        r.name,
        r.isLab ? 'Lab/Practical' : 'Theory',
        r.lecturesPerWeek,
        r.totalLecturesPerMonth,
        r.requiredLectures,
        r.canSkip,
        r.actualPercentage + '%'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-calculation-${targetPercentage}percent.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Attendance Calculation Results
        </h2>
        <p className="text-gray-600 mb-6">
          Based on your target attendance of <span className="font-bold text-blue-600">{targetPercentage}%</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-800">{totalSubjects}</div>
          <div className="text-sm text-blue-600">Total Subjects</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-800">{totalLectures}</div>
          <div className="text-sm text-green-600">Total Lectures/Month</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-800">{totalCanSkip}</div>
          <div className="text-sm text-orange-600">Can Skip (Total)</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-800">{canSkipAny}</div>
          <div className="text-sm text-purple-600">Subjects with Buffer</div>
        </div>
      </div>

      {/* Detailed Results */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Subject-wise Breakdown</h3>
        <div className="space-y-4">
          {results.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.isLab ? (
                        <FlaskConical size={20} className="text-blue-600" />
                      ) : (
                        <Book size={20} className="text-gray-600" />
                      )}
                      <h4 className="text-xl font-semibold text-gray-800">{result.name}</h4>
                      {result.isLab && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Lab/Practical
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Per Week:</span>
                        <div className="font-medium">{result.lecturesPerWeek} {result.isLab ? 'sessions' : 'lectures'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Per Month:</span>
                        <div className="font-medium">{result.totalLecturesPerMonth} {result.isLab ? 'sessions' : 'lectures'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Required:</span>
                        <div className="font-medium text-green-600">{result.requiredLectures} {result.isLab ? 'sessions' : 'lectures'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Can Skip:</span>
                        <div className={`font-medium ${result.canSkip > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                          {result.canSkip} {result.isLab ? 'sessions' : 'lectures'}
                        </div>
                      </div>
                    </div>
                  </div>                <div className="lg:ml-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      result.actualPercentage >= targetPercentage ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.actualPercentage}%
                    </div>
                    <div className="text-sm text-gray-500">Final Attendance</div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Attendance Progress</span>
                  <span>{result.requiredLectures}/{result.totalLecturesPerMonth} required</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      result.actualPercentage >= targetPercentage ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(result.requiredLectures / result.totalLecturesPerMonth) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                {result.canSkip > 0 ? (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-green-600">Good news!</span> You can skip up to{' '}
                    <span className="font-bold">{result.canSkip} {result.isLab ? 'lab sessions' : 'lectures'}</span> and still maintain {targetPercentage}% attendance.
                    {result.isLab && (
                      <span className="block mt-1 text-orange-600 font-medium">
                        ⚠️ Note: Lab sessions are usually more important for practical learning and assessment.
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-red-600">Important!</span> You cannot afford to skip any {result.isLab ? 'lab sessions' : 'lectures'} 
                    to maintain {targetPercentage}% attendance.
                    {result.isLab && (
                      <span className="block mt-1 text-red-600 font-medium">
                        🚨 Critical: Lab attendance is often mandatory and heavily weighted!
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-800 mb-3">💡 Pro Tips for Managing Attendance</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Keep track of your attendance regularly using a calendar or app</li>
          <li>• Plan your leaves strategically for subjects where you have buffer lectures</li>
          <li>• Prioritize attending subjects where you cannot afford to skip any lectures</li>
          <li>• <strong>Lab sessions are critical:</strong> They often have stricter attendance requirements and practical assessments</li>
          <li>• Consider attending extra classes or makeup sessions when available</li>
          <li>• Always aim for higher than minimum required attendance for safety</li>
          <li>• Check your institution's specific attendance policies for lab vs theory subjects</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Edit
          </button>
          <button
            onClick={exportResults}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>
        
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <RefreshCw size={20} />
          <span>New Calculation</span>
        </button>
      </div>
    </div>
  );
};

export default AttendanceResults;
