# TAKU AI - Offline AI Tutor

An intelligent, offline-first AI tutoring platform that helps students learn from their own documents using local LLM inference powered by Ollama.

## ✨ Features

- **100% Offline**: All AI processing happens locally via Ollama
- **Document-Based Learning**: Upload PDFs, TXT files and get AI-powered Q&A
- **RAG System**: ChromaDB-powered semantic search for relevant context
- **Cross-Platform**: Built with Tauri 2.0 for Windows, macOS, and Linux
- **Privacy-First**: Your documents never leave your machine

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Desktop Runtime** | Tauri 2.0 (Rust) |
| **Backend** | Python 3.13, FastAPI |
| **AI Inference** | Ollama (Mistral 7B) |
| **Vector Store** | ChromaDB |
| **Database** | SQLite |

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- Python 3.13+
- Rust (installed via rustup)
- Ollama with Mistral model

### Installation

1. **Clone and install dependencies**
   ```bash
   cd taku-ai
   npm install
   ```

2. **Set up Python environment**
   ```bash
   cd src-tauri/src-python
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Ensure Ollama is running with Mistral**
   ```bash
   ollama pull mistral
   ollama serve
   ```

5. **Start development server**
   ```bash
   npm run tauri dev
   ```

## 📁 Project Structure

```
taku-ai/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── lib/               # API utilities
│   └── App.tsx            # Main app entry
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/               # Rust source
│   └── src-python/        # Python backend services
├── public/                # Static assets
└── .ai-reference/         # Development documentation
```

## 📚 Reference Documentation

- `.ai-reference/taku-ai-implementation-guide.md` - Step-by-step development guide
- `.ai-reference/taku-ai-pdlc-documentation.md` - Technical specifications
- `.ai-reference/taku-ai-research-complete.md` - Technology decisions

## 🧪 Development

```bash
# Run development server
npm run tauri dev

# Build for production
npm run tauri build

# Type check
npm run build
```

## 📄 License

MIT License - Built with ❤️ for offline learning
