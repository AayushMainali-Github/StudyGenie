# StudyGenie ⚡️

**StudyGenie** is a high-octane, AI-powered study ecosystem designed for the modern learner. It transforms your passive reading into active mastery through intelligent summaries, flashcards, interactive quizzes, and architectural mind-map visualizations. 

Wrapped in a bold **Brutalist Design**, StudyGenie isn't just a tool—it's your academic cockpit.

---

## 🚀 Core Intelligence Features

- **Knowledge Architecture (Mind-Maps)**: Visualize the hierarchical structure of your notes with AI-generated interactive mind-maps powered by Mermaid.js.
- **Smart Synthesis**: Instantly transform long documents or raw text into structured study reports.
- **Active Recall Engine**: Automatically generate flashcards based on your content, with a dedicated review system.
- **Assessment Lab**: Challenge yourself with dynamically generated quizzes that test your understanding.
- **AI Tutor (24/7)**: Chat with a dedicated AI tutor that has full context of your specific notes.
- **Subject-Centric Library**: Manage your learning resources with a beautiful, high-contrast dashboard.

## 🎨 Design Philosophy: Brutalist Learning

StudyGenie breaks away from corporate minimalism. We employ a **Modern Brutalist** aesthetic:
- **High-Contrast Typography**: Bold headings and clear data structures.
- **Tactile UI**: Heavy borders, offset "haptic" shadows, and vibrant accent colors (Synthetic Pink, Neon Cyan, Midnight Purple).
- **Zero Fluff**: Focus on functionality and raw data visibility.

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, Vite, Mermaid.js, Font Awesome.
- **Backend**: Node.js, Express, MongoDB/Mongoose.
- **Intelligence**: Google Gemini API (`gemini-2.0-flash`).
- **Security**: JWT-based Authentication & Password Hashing.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Gemini API Key

### Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

---

## 🛠 How to Use

1. **Upload**: Drag and drop a file or paste raw text. Define your custom subject title.
2. **Review**: Check the AI-generated summary and extract key insights.
3. **Master**: 
   - Generate **Flashcards** for long-term retention.
   - Take **Quizzes** to verify knowledge.
   - Open the **Architecture Map** to see the big picture.
4. **Clarify**: If you're stuck, use the **Chat Tutor** to ask questions about your note.

---

*StudyGenie - Engineering Knowledge.*
