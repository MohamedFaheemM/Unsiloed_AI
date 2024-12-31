# PDF Question-Answering System

An interactive system that allows users to query PDF documents using natural language questions. Built with FastAPI, Next.js, and leveraging RAG (Retrieval-Augmented Generation) for accurate, context-aware responses.

## Features

- 📁 Multiple PDF file upload support
- 🔍 Advanced text extraction and processing
- 💡 Intelligent question answering with citations
- 💬 Interactive chat interface
- 🔗 Context-aware responses
- 📄 Source citations with page numbers

## Tech Stack

- **Backend**: Python/FastAPI
- **Frontend**: Next.js
- **Vector Database**: Chroma DB
## Repository Structure

```
pdf-qa-system/
├── backend/        # FastAPI server
├── frontend/       # Next.js application
└── docs/          # Additional documentation
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Gemini API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-qa-system.git
cd pdf-qa-system
```

2. Backend setup:
```bash
cd backend
pip install -r requirements.txt
```

3. Frontend setup:
```bash
cd frontend
npm install
```

### Running the Development Environment

1. Start the backend server:

#### Create .env in backend directory

```bash
GOOGLE_API_KEY=your_actual_gemini_api_key_here
```

#### Run

```bash
python main.py
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
