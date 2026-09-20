# Chat With Files

A **local AI-powered file analysis and question-answering system** that allows you to select an entire folder and chat with the files inside it.

The project uses **local AI models**, embeddings, and a vector database to understand and search through your files without sending their contents to a cloud AI service.

## Features

* 📁 Select an entire folder using Windows File Explorer
* 🔍 Recursively scan files inside subfolders
* 📄 Extract text from multiple file formats
* 🧩 Split large documents into manageable chunks
* 🧠 Generate semantic embeddings using Sentence Transformers
* 🗃️ Store and search document embeddings using ChromaDB
* 🤖 Generate answers using a local LLM through Ollama
* 🔒 Designed for local/private processing
* 💬 Ask natural-language questions about your files
* 🐍 Built entirely with Python

## Supported File Types

The current version supports:

### Text & Code

* `.txt`
* `.md`
* `.py`
* `.js`
* `.jsx`
* `.ts`
* `.tsx`
* `.java`
* `.c`
* `.cpp`
* `.h`
* `.hpp`
* `.cs`
* `.go`
* `.rs`
* `.php`
* `.rb`
* `.swift`
* `.kt`
* `.html`
* `.css`
* `.scss`
* `.sql`
* `.sh`
* `.bat`
* `.ps1`
* `.yaml`
* `.yml`
* `.json`
* `.xml`
* `.svg`
* `.log`

### Documents

* `.pdf`
* `.docx`
* `.pptx`

### Data

* `.csv`
* `.xlsx`
* `.xls`

Unsupported binary files are currently skipped rather than executed.

## How It Works

```text
                 Selected Folder
                       │
                       ▼
                 Folder Scanner
                       │
                       ▼
                  File Loader
                       │
                       ▼
                    Chunker
                       │
                       ▼
              Sentence Transformers
                       │
                       ▼
                   ChromaDB
                       │
                  Semantic Search
                       │
                       ▼
                  Relevant Chunks
                       │
                       ▼
                 Ollama / Qwen3
                       │
                       ▼
                    Answer
```

The project follows a **Retrieval-Augmented Generation (RAG)** architecture.

Instead of sending an entire folder to the AI, the system:

1. Reads the files.
2. Splits their contents into chunks.
3. Converts the chunks into embeddings.
4. Stores the embeddings in ChromaDB.
5. Searches for chunks relevant to the user's question.
6. Sends the relevant information to the local LLM.
7. Generates an answer based on the retrieved content.

---

# Requirements

## Hardware

The project can run on a normal modern computer.

For a comfortable experience:

* **RAM:** 16 GB recommended
* **GPU:** Optional
* **VRAM:** 4 GB or more can be useful
* **Storage:** Several GB for Python packages and local AI models

The project is designed to work with a local LLM, so performance depends on your hardware and selected model.

## Software

Install:

* Python 3.10+
* Ollama
* Git (optional, for cloning the repository)
* VS Code (recommended)

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/chat-with-files.git
```

Enter the project directory:

```bash
cd chat-with-files
```

You can also download the repository as a ZIP and extract it.

---

## 2. Create a Virtual Environment

Open the project in VS Code.

Open the terminal:

```text
Terminal → New Terminal
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

You should see something similar to:

```text
(venv) C:\...\chat-with-files>
```

---

## 3. Install Python Dependencies

Run:

```bash
pip install -r requirements.txt
```

If you don't have a `requirements.txt` yet, install the packages manually:

```bash
pip install ollama chromadb sentence-transformers pypdf pandas openpyxl python-docx python-pptx
```

---

# Install Ollama

Ollama is used to run the AI model locally.

Install Ollama from its official website:

https://ollama.com/

After installation, open a terminal and download the model:

```bash
ollama pull qwen3:4b
```

You can test the model with:

```bash
ollama run qwen3:4b
```

Try asking:

```text
What is Python?
```

If the model responds, Ollama is working.

Exit with:

```text
Ctrl + C
```

---

# Run the Project

Make sure your virtual environment is activated:

```bash
venv\Scripts\activate
```

Then run:

```bash
python app.py
```

A Windows folder-selection dialog will appear.

Select the folder you want the AI to analyze.

For example:

```text
MyProject/
│
├── main.py
├── README.md
├── data.csv
├── report.pdf
│
├── src/
│   ├── model.py
│   └── utils.py
│
└── documents/
    └── research.pdf
```

The system will recursively scan the entire folder.

---

# Asking Questions

After the files have been processed, you can ask questions such as:

```text
What is this project about?
```

```text
What programming languages are used?
```

```text
What does main.py do?
```

```text
What are the important functions?
```

```text
What algorithms are used in this project?
```

```text
Summarize the research paper.
```

The system searches the indexed files and provides relevant information to the local AI model.

Type:

```text
exit
```

to close the application.

---

# Project Structure

```text
chat-with-files/
│
├── app.py
│
├── scanner.py
│
├── loader.py
│
├── chunker.py
│
├── vector_store.py
│
├── llm.py
│
├── requirements.txt
│
├── README.md
│
└── chroma_db/
```

### `app.py`

Main application.

Handles:

* Folder selection
* File processing
* User questions
* Retrieval
* AI responses

### `scanner.py`

Recursively scans the selected folder and finds files.

### `loader.py`

Reads and extracts content from supported file formats.

### `chunker.py`

Splits large documents into smaller overlapping pieces.

### `vector_store.py`

Handles:

* Embedding generation
* ChromaDB
* Semantic search

### `llm.py`

Connects the application to the local Ollama model.

### `chroma_db/`

Stores the local vector database generated by the application.

---

# Privacy

The goal of this project is to keep file processing local.

The file contents are processed by:

* Local Python code
* Local embedding model
* Local ChromaDB database
* Local Ollama LLM

No cloud AI API is required for the core system.

However, users should still review the behavior of any third-party software installed on their computer.

---

# Current Limitations

The current version does not fully understand every possible file format.

For example:

* Images require a vision model.
* Scanned PDFs may require OCR.
* Audio files require speech-to-text.
* Video files require video/audio processing.
* Some binary/proprietary formats cannot be directly parsed.
* Complex Excel workbooks may require specialized processing.
* Images and charts inside documents are not currently analyzed.

The application currently focuses primarily on **text-based documents, source code, PDFs, spreadsheets, presentations, and structured data**.

---

# Planned Improvements

Future versions may include:

* 🖼️ Image understanding with a local vision model
* 📷 OCR for scanned PDFs
* 🎵 Audio transcription
* 🎬 Video analysis
* 📦 ZIP/archive extraction
* 🗄️ Database file analysis
* 📊 Better Excel analysis
* 📑 Table extraction from DOCX/PDF
* 🔄 Incremental indexing
* ⚡ Faster folder scanning
* 📈 Indexing progress display
* 🧠 Better code-aware chunking
* 💾 Persistent conversation history
* 🔎 Improved semantic search
* 🖥️ Minimal desktop interface

---

# Security Considerations

The application should **read and analyze files rather than execute them**.

Do not configure the application to automatically execute scripts, programs, macros, or other executable content from an analyzed folder.

Only the contents of supported files should be processed.

---

# Technology Stack

| Technology            | Purpose               |
| --------------------- | --------------------- |
| Python                | Core application      |
| Ollama                | Local LLM runtime     |
| Qwen3 4B              | Local language model  |
| Sentence Transformers | Text embeddings       |
| ChromaDB              | Vector database       |
| PyPDF                 | PDF extraction        |
| Pandas                | CSV/data processing   |
| OpenPyXL              | Excel processing      |
| python-docx           | DOCX processing       |
| python-pptx           | PowerPoint processing |
| Tkinter               | Folder selection      |

---

# RAG Architecture

This project uses **Retrieval-Augmented Generation (RAG)** rather than training a language model from scratch.

```text
Documents
    ↓
Text Extraction
    ↓
Chunking
    ↓
Embeddings
    ↓
Vector Database
    ↓
User Question
    ↓
Semantic Retrieval
    ↓
Relevant Context
    ↓
Local LLM
    ↓
Generated Answer
```

This allows the system to work with large collections of documents without putting the entire collection into the LLM's context window.

---

# License

This project is intended as an educational and experimental project.

Add your preferred license here, such as MIT, before publishing the repository.

---

# Author

**Sampat Sheshagiri Naik**

Built as a local AI/RAG project for experimenting with:

* Local LLMs
* Retrieval-Augmented Generation
* Vector databases
* Document processing
* Python
* AI/ML

## Running the Application

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/chat-with-files.git
cd chat-with-files
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

On Windows:

```bash
venv\Scripts\activate
```

You should see `(venv)` at the beginning of your terminal prompt.

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Install and Set Up Ollama

Download and install Ollama from:

https://ollama.com/

Then download the local language model:

```bash
ollama pull qwen3:4b
```

Verify that the model is installed:

```bash
ollama list
```

You should see:

```text
qwen3:4b
```

### 6. Run the Application

Make sure the virtual environment is activated:

```bash
venv\Scripts\activate
```

Then start the application:

```bash
python app.py
```

### 7. Select a Folder

A Windows folder-selection dialog will open.

Select the folder you want to analyze.

The application will recursively scan the selected folder and process all supported files.

### 8. Ask Questions

After the folder has been indexed, you can ask questions about its contents.

Example:

```text
What is this project about?
```

```text
What programming languages are used?
```

```text
Explain the main Python file.
```

```text
What algorithms are used in this project?
```

```text
Summarize the documents in this folder.
```

The system retrieves relevant information from the files and uses the local Qwen3 model to generate an answer.

### 9. Exit the Application

Type:

```text
exit
```

and press Enter.

---

## Quick Start

After the initial installation, simply run:

```bash
venv\Scripts\activate
python app.py
```

Then:

**Select Folder → Wait for Analysis → Ask Questions**
