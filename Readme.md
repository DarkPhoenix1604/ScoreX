# ScoreX - AI-Powered Resume Analyzer

ScoreX is a full-stack web application designed to streamline the initial stages of recruitment. It takes a job description and a batch of resumes as input, and leverages a Python-based NLP model to analyze and rank the resumes based on their semantic similarity to the job description. The results are then presented in a clean, interactive dashboard featuring scores, charts, and keyword-based word clouds.

This project demonstrates a modern MERN-stack architecture integrated with a standalone Python machine learning service.

---

## ✨ Features

- **File Upload:** Easily upload one job description (`.pdf`, `.docx`, `.csv`) and multiple resumes (`.pdf`, `.docx`).
- **AI-Powered Ranking:** Utilizes TF-IDF and Cosine Similarity to score and rank resumes against the job description.
- **Data Visualization:** Displays results in a clear, ranked bar chart for quick comparison.
- **Keyword Analysis:** Generates word clouds for the job description and each resume to highlight key terms and skills.
- **RESTful API:** A robust Express.js backend serves the analysis results to the frontend.
- **Modern Frontend:** A responsive and user-friendly interface built with React, Vite, and Tailwind CSS.

---

## 🛠️ Tech Stack

This project is a monorepo containing three separate modules:

### Frontend

- **Framework:** React 18 (with Hooks)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **API Communication:** Axios

### Backend

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **File Handling:** Multer
- **Module System:** ES Modules

### Machine Learning Model

- **Language:** Python 3
- **NLP:** Scikit-learn (TF-IDF, Cosine Similarity), NLTK (tokenization, stopwords)
- **File Reading:** PyPDF2, python-docx, Pandas
- **Visualization:** WordCloud, Matplotlib

---

## 🚀 Installation and Setup

To get this project running locally, you'll need to set up the backend, the Python model environment, and the frontend.

### Prerequisites

- Node.js (v14 or newer)
- npm
- Python (v3.8 or newer)
- pip
- A MongoDB Atlas account or a local MongoDB instance

---

### 1. Backend Setup

Navigate to the backend directory:

```sh
cd backend
```

Install Dependencies:

```sh
npm install
```

Create Environment File:

Create a `.env` file in the backend directory and add your configuration:

```env
# Server Port
PORT=8000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Replace the `MONGO_URI` with your actual MongoDB connection string.

Run the Server:

```sh
npm run dev
```

The backend server will start on [http://localhost:8000](http://localhost:8000).

---

### 2. Python Model Setup

In a separate terminal, navigate to the python-model directory:

```sh
cd python-model
```

Create a Virtual Environment (Recommended):

```sh
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install Python Dependencies:

```sh
pip install -r requirements.txt
```

This will install all necessary libraries like scikit-learn, nltk, pandas, etc. The script will automatically download NLTK data on its first run.

---

### 3. Frontend Setup

In a third terminal, navigate to the frontend directory:

```sh
cd frontend
```

Install Dependencies:

```sh
npm install
```

Run the Frontend Development Server:

```sh
npm run dev
```

The React application will start on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is busy). The `vite.config.js` file is already configured to proxy API requests to the backend.

---

## 💻 Usage

Once all three parts are running, open your web browser and navigate to the frontend URL (e.g., [http://localhost:5173](http://localhost:5173)).

1. Upload a job description file.
2. Upload 2 to 10 resume files.
3. Click the "Analyze Documents" button.
4. View the ranked results, charts, and word clouds on the dashboard.

---

## 🌟 Future Improvements

- **User Authentication:** Implement user accounts to save and track past analysis sessions.
- **Advanced NLP Models:** Integrate more sophisticated models like Word2Vec, Doc2Vec, or fine-tuned transformers (e.g., BERT) for more nuanced semantic understanding.
- **Database for Keywords:** Store extracted keywords in the database for further analytics and search.