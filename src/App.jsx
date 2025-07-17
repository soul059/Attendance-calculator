import { useState } from 'react'
import AttendanceCalculator from './components/AttendanceCalculator'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Attendance Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate how many lectures you can skip while maintaining your desired attendance percentage
          </p>
        </header>
        <AttendanceCalculator />
      </div>
    </div>
  )
}

export default App
