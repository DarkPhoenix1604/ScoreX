import PyPDF2
import docx
import nltk
import re
import pandas as pd
import sys
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# --- NLTK Resource Download ---
# This block ensures that all necessary NLTK data packages are downloaded
# before any processing happens. This prevents LookupError exceptions.
def download_nltk_resources():
    """Downloads all required NLTK resources if they are not already present."""
    # List of tuples: (resource_name_for_download, path_for_find_function)
    required_resources = [
        ('punkt', 'tokenizers/punkt'),
        ('stopwords', 'corpora/stopwords'),
        ('punkt_tab', 'tokenizers/punkt_tab') 
    ]
    for name, path in required_resources:
        try:
            nltk.data.find(path)
            # Print diagnostic messages to stderr
            print(f"NLTK resource '{name}' already exists.", file=sys.stderr)
        except LookupError:
            print(f"NLTK resource '{name}' not found. Downloading...", file=sys.stderr)
            # quiet=True prevents a GUI downloader from popping up on some systems
            nltk.download(name, quiet=True)
            print(f"NLTK resource '{name}' downloaded successfully.", file=sys.stderr)

# Run the downloader function when the module is loaded
download_nltk_resources()


# --- Text Extraction Functions ---

def extract_text_from_pdf(file_path):
    """Extracts text content from a PDF file."""
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"Error reading PDF {file_path}: {e}", file=sys.stderr)
    return text

def extract_text_from_docx(file_path):
    """Extracts text content from a DOCX file."""
    text = ""
    try:
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX {file_path}: {e}", file=sys.stderr)
    return text

def extract_text_from_csv(file_path):
    """Extracts all text content from a CSV file."""
    text = ""
    try:
        # Read the csv and convert all its content to a single string
        df = pd.read_csv(file_path)
        text = ' '.join(df.astype(str).apply(lambda x: ' '.join(x), axis=1))
    except Exception as e:
        print(f"Error reading CSV {file_path}: {e}", file=sys.stderr)
    return text

def extract_text(file_path):
    """Extracts text from a file based on its extension."""
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    elif file_path.endswith(".csv"):
        return extract_text_from_csv(file_path)
    else:
        # Fallback for .txt or other plain text files
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            print(f"Error reading plain text file {file_path}: {e}", file=sys.stderr)
            return ""

# --- Text Cleaning Function ---

def clean_text(text):
    """Cleans the text by lowercasing, removing punctuation, and stopwords."""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    # Tokenize the text
    tokens = word_tokenize(text)
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words and word.isalpha()]
    
    return " ".join(filtered_tokens)
