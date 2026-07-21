from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np

# Load pre-trained BERT model globally (do it once)
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

def rank_resumes(jd_text, resume_texts):
    """
    Ranks resumes based on their similarity to the job description using multiple parameters:
    - TF-IDF cosine similarity
    - BERT semantic similarity
    - Keyword match score

    Args:
        jd_text (str): The cleaned text of the job description.
        resume_texts (list of str): A list of cleaned resume texts.

    Returns:
        list of float: A list of combined similarity scores.
    """
    # Combine texts for TF-IDF vectorization
    all_texts = [jd_text] + resume_texts
    
    # 1. TF-IDF Cosine Similarity
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(all_texts)
    tfidf_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    
    # 2. BERT Semantic Similarity
    jd_embedding = bert_model.encode(jd_text)
    resume_embeddings = bert_model.encode(resume_texts)
    bert_scores = cosine_similarity([jd_embedding], resume_embeddings).flatten()
    
    # 3. Keyword Match Score
    keywords = [word.lower() for word in jd_text.split() if len(word) > 3]
    def keyword_score(resume):
        resume_lower = resume.lower()
        matched = sum(1 for kw in keywords if kw in resume_lower)
        return matched / len(keywords) if keywords else 0
    keyword_scores = np.array([keyword_score(r) for r in resume_texts])
    
    # 4. Final Weighted Score
    final_scores = 0.4 * tfidf_scores + 0.4 * bert_scores + 0.2 * keyword_scores

    return final_scores.tolist()
