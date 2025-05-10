# HeadDoWell - Mental Wellness Companion

HeadDoWell is an intelligent mental wellness companion that leverages advanced Natural Language Processing (NLP) to provide empathetic conversations and mental health support. The application combines modern web technologies with sophisticated AI capabilities to create a safe, supportive space for users to express their feelings and receive guidance.

## 🌟 Key Features

- **AI-Powered Chat Interface**: Intelligent conversational agent that understands and responds to users' emotional states
- **Sentiment Analysis**: Real-time analysis of user messages to detect emotional tone and intensity
- **Symptom Detection**: Advanced NLP system to identify potential mental health symptoms and concerns
- **Personalized Responses**: Context-aware responses that adapt to the user's emotional state and needs
- **Voice Recognition**: Support for voice input to make the interaction more natural and accessible
- **Chat History**: Secure storage and review of past conversations for tracking progress
- **Crisis Resources**: Quick access to emergency resources and professional help

## 🛠️ Technology Stack

### Frontend
- React with TypeScript for robust type safety
- Vite for fast development and building
- Radix UI components for accessible and customizable UI elements
- TailwindCSS for modern and responsive styling
- React Query for efficient data fetching and state management

### Backend
- FastAPI for high-performance API endpoints
- Advanced NLP processing using:
  - NLTK for natural language processing
  - Spacy for advanced text analysis
  - Sentence Transformers for semantic understanding
  - Scikit-learn for machine learning capabilities

### Additional Features
- Supabase integration for secure data storage
- Voice recognition capabilities
- Emoji support for expressive communication
- Fuzzy matching for improved text understanding

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd head
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd public
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
cd public
uvicorn api:app --reload
```

2. Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌐 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for mental wellness
