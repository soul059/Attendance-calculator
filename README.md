# 📚 Attendance Calculator

A smart, interactive web application that helps students calculate how many lectures they can skip while maintaining their desired attendance percentage. Built with React, Vite, and Tailwind CSS.

![Attendance Calculator Demo](https://img.shields.io/badge/Status-Active-green) ![React](https://img.shields.io/badge/React-18+-blue) ![Vite](https://img.shields.io/badge/Vite-Latest-purple)

## ✨ Features

### 🎯 **Smart Attendance Calculation**
- Set your target attendance percentage (e.g., 75%)
- Calculate exactly how many lectures you can skip per subject
- Monthly breakdown showing total lectures and required attendance
- Visual progress bars and indicators

### 📄 **PDF Timetable Processing**
- **Upload PDF timetables** and automatically extract subject names
- **Intelligent subject detection** using advanced pattern matching
- **Lab subject recognition** - automatically identifies lab/practical subjects
- **Case-insensitive parsing** - works with any text formatting
- **Confidence scoring** - shows how certain the system is about each subject

### 🧪 **Lab Subject Support**
- Special handling for laboratory and practical subjects
- Visual indicators with lab icons and badges
- Different terminology (sessions vs lectures)
- Specific recommendations for lab attendance requirements

### 📊 **Detailed Results**
- **Subject-wise breakdown** with visual cards
- **Summary statistics** showing totals across all subjects
- **Color-coded recommendations** (green = safe, red = critical)
- **Export functionality** - download results as CSV
- **Pro tips** for managing attendance effectively

### 🎨 **Modern UI/UX**
- **Responsive design** - works on desktop and mobile
- **Step-by-step wizard** with progress indicators
- **Dark/light theme support** via Tailwind CSS
- **Smooth animations** and transitions
- **Accessibility features** with proper focus management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/attendance-calculator.git
   cd attendance-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📖 How to Use

### Step 1: Upload Timetable
- **Option A**: Upload a PDF timetable file
  - Drag and drop or click to browse
  - System automatically extracts subject names
  - Reviews detected subjects with confidence scores
- **Option B**: Enter subjects manually
  - Click "Enter Manually" to skip PDF upload

### Step 2: Set Target Percentage
- Enter your desired attendance percentage (1-100%)
- Common targets: 75%, 80%, 85%

### Step 3: Review Subjects
- **Edit extracted subjects** or add new ones
- **Mark lab subjects** using the checkbox
- **Adjust lectures per week** for each subject
- **Remove unwanted subjects**

### Step 4: View Results
- See detailed breakdown for each subject
- **Can Skip**: Number of lectures you can miss
- **Required**: Minimum lectures to attend
- **Final %**: Your actual attendance percentage
- **Export**: Download results as CSV file

## 🔧 Technical Details

### Architecture
```
src/
├── components/           # React components
│   ├── AttendanceCalculator.jsx    # Main container
│   ├── TimetableUpload.jsx         # PDF upload & processing
│   ├── SubjectForm.jsx             # Subject management
│   └── AttendanceResults.jsx       # Results display
├── utils/               # Utility functions
│   ├── pdfExtractor.js             # PDF text extraction
│   └── simplePdfExtractor.js       # Fallback extraction
└── App.jsx              # Root component
```

### Technologies Used
- **Frontend**: React 18+, Vite 7+
- **Styling**: Tailwind CSS 4+
- **PDF Processing**: PDF.js, pdfjs-dist
- **Icons**: Lucide React
- **Date Handling**: date-fns

### PDF Processing Features
- **Primary Method**: PDF.js with local worker (no CORS issues)
- **Fallback Method**: Simple binary text extraction
- **Subject Patterns**: Regex patterns for 50+ academic subjects
- **Lab Detection**: Multiple patterns for lab/practical subjects
- **Error Handling**: Graceful degradation with helpful messages

## 🎯 Calculation Logic

The attendance calculator uses this formula:

```javascript
// For each subject:
totalLecturesPerMonth = lecturesPerWeek × 4
requiredLectures = Math.ceil((totalLectures × targetPercentage) / 100)
canSkip = totalLectures - requiredLectures
actualPercentage = ((totalLectures - canSkip) / totalLectures) × 100
```

### Example Calculation
- **Subject**: Mathematics (4 lectures/week)
- **Target**: 75% attendance
- **Result**:
  - Total monthly lectures: 4 × 4 = 16
  - Required lectures: (16 × 75) ÷ 100 = 12
  - **Can skip**: 16 - 12 = **4 lectures**

## 📱 Supported PDF Formats

The system can extract subjects from various PDF timetable formats:

### ✅ **Supported Subjects**
- **STEM**: Mathematics, Physics, Chemistry, Biology, Computer Science
- **Engineering**: Electrical, Mechanical, Civil, Chemical, Aerospace
- **Business**: Management, Accounting, Finance, Marketing
- **Humanities**: English, History, Geography, Economics
- **Medical**: Medicine, Nursing, Pharmacy, Dentistry
- **Arts**: Music, Art, Design, Fine Arts
- **Languages**: Spanish, French, German, Japanese, Chinese
- **Labs**: Any subject + Lab/Practical/Workshop

### ✅ **Text Formats**
- Regular text PDFs (not scanned images)
- Various case formats (UPPERCASE, lowercase, Title Case)
- Different layouts and structures
- Multi-page documents

## 🔒 Privacy & Security

- **No data upload**: All PDF processing happens in your browser
- **No server storage**: Nothing is saved on external servers
- **Local processing**: PDF.js runs entirely client-side
- **No tracking**: No analytics or user tracking implemented

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
- **Components**: Modular React components with clear responsibilities
- **Utils**: Reusable utility functions for PDF processing
- **Styling**: Tailwind CSS with custom components
- **Build**: Vite for fast development and optimized production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PDF.js** - Mozilla's PDF rendering library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **Vite** - Next generation frontend tooling

## 📞 Support

If you encounter any issues:

1. **Check the console** for error messages
2. **Try manual entry** if PDF upload fails
3. **Use different PDF** if text extraction doesn't work
4. **Report bugs** by creating an issue

---

**Made with ❤️ for students who want to optimize their attendance strategy!**
