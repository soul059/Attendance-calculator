import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, FlaskConical, Book } from 'lucide-react';

const SubjectForm = ({ subjects, setSubjects, onBack, onCalculate }) => {
  const [newSubject, setNewSubject] = useState({ name: '', lecturesPerWeek: '', isLab: false });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingSubject, setEditingSubject] = useState({ name: '', lecturesPerWeek: '', isLab: false });

  const addSubject = () => {
    if (newSubject.name.trim() && newSubject.lecturesPerWeek > 0) {
      setSubjects([...subjects, {
        name: newSubject.name.trim(),
        lecturesPerWeek: Number(newSubject.lecturesPerWeek),
        isLab: newSubject.isLab
      }]);
      setNewSubject({ name: '', lecturesPerWeek: '', isLab: false });
    }
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingSubject({ ...subjects[index] });
  };

  const saveEdit = () => {
    if (editingSubject.name.trim() && editingSubject.lecturesPerWeek > 0) {
      const updatedSubjects = subjects.map((subject, index) =>
        index === editingIndex
          ? {
              name: editingSubject.name.trim(),
              lecturesPerWeek: Number(editingSubject.lecturesPerWeek),
              isLab: editingSubject.isLab
            }
          : subject
      );
      setSubjects(updatedSubjects);
      setEditingIndex(-1);
      setEditingSubject({ name: '', lecturesPerWeek: '', isLab: false });
    }
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditingSubject({ name: '', lecturesPerWeek: '', isLab: false });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Review and Edit Subjects
        </h2>
        <p className="text-gray-600 mb-6">
          Add, edit, or remove subjects and specify the number of lectures per week for each subject.
        </p>
      </div>

      {/* Add New Subject */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Subject</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, addSubject)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mathematics, Physics Lab, Chemistry"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lectures per Week
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newSubject.lecturesPerWeek}
                onChange={(e) => setNewSubject({ ...newSubject, lecturesPerWeek: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, addSubject)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 4"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSubject.isLab}
                  onChange={(e) => setNewSubject({ ...newSubject, isLab: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <FlaskConical size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">This is a Lab/Practical subject</span>
              </label>
            </div>
            
            <button
              onClick={addSubject}
              disabled={!newSubject.name.trim() || !newSubject.lecturesPerWeek || newSubject.lecturesPerWeek <= 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      {subjects.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Your Subjects ({subjects.length})
          </h3>
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                {editingIndex === index ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editingSubject.name}
                          onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-full sm:w-32">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={editingSubject.lecturesPerWeek}
                          onChange={(e) => setEditingSubject({ ...editingSubject, lecturesPerWeek: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSubject.isLab}
                          onChange={(e) => setEditingSubject({ ...editingSubject, isLab: e.target.checked })}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <FlaskConical size={16} className="text-blue-600" />
                        <span className="text-sm text-gray-700">Lab/Practical subject</span>
                      </label>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {subject.isLab ? (
                          <FlaskConical size={18} className="text-blue-600" />
                        ) : (
                          <Book size={18} className="text-gray-600" />
                        )}
                        <h4 className="font-medium text-gray-800">{subject.name}</h4>
                        {subject.isLab && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Lab
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {subject.lecturesPerWeek} lectures per week • {subject.lecturesPerWeek * 4} lectures per month
                        {subject.isLab && " • Laboratory/Practical sessions"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(index)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => removeSubject(index)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No subjects added yet</p>
          <p className="text-gray-400">Add your subjects using the form above</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onCalculate}
          disabled={subjects.length === 0}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Calculate Attendance
        </button>
      </div>
    </div>
  );
};

export default SubjectForm;
