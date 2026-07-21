import sys
import os
import json
import pandas as pd
from core.nlp_processor import extract_text, clean_text
from core.ranker import rank_resumes
from core.visualizer import generate_wordcloud

def main():
    # --- 1. Argument Parsing ---
    # The script expects the first argument to be the JD path,
    # and all subsequent arguments to be resume paths.
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python main.py <jd_path> <resume_path_1> ..."}))
        sys.exit(1)

    jd_path = sys.argv[1]
    resume_paths = sys.argv[2:]
    
    # Get original filenames
    jd_filename = os.path.basename(jd_path)
    resume_filenames = [os.path.basename(p) for p in resume_paths]

    # --- 2. Text Processing ---
    jd_text = extract_text(jd_path)
    resume_texts = [extract_text(p) for p in resume_paths]
    
    cleaned_jd_text = clean_text(jd_text)
    cleaned_resume_texts = [clean_text(t) for t in resume_texts]

    # --- 3. Ranking ---
    scores = rank_resumes(cleaned_jd_text, cleaned_resume_texts)
    
    # --- 4. Visualization ---
    # Define the output directory for word clouds (relative to the backend)
    # The Node.js controller runs from the `backend` directory
    output_dir = "uploads" 
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate word cloud for JD
    jd_wc_path = generate_wordcloud(
        cleaned_jd_text, 
        os.path.join(output_dir, f"wc_jd_{jd_filename}.png")
    )
    
    # Generate word clouds for resumes
    resume_wc_paths = [
        generate_wordcloud(
            text, 
            os.path.join(output_dir, f"wc_resume_{os.path.basename(path)}.png")
        ) 
        for text, path in zip(cleaned_resume_texts, resume_paths)
    ]

    # --- 5. Formatting Output ---
    # Create a list of dictionaries for the scores
    scores_data = []
    for i, filename in enumerate(resume_filenames):
        scores_data.append({
            "fileName": filename,
            "score": round(scores[i] * 100, 2), # Convert to percentage
            "wordCloudPath": resume_wc_paths[i]
        })
        
    # Sort results by score in descending order
    scores_data.sort(key=lambda x: x['score'], reverse=True)

    # Prepare final JSON output
    results = {
        "jobDescription": {
            "fileName": jd_filename,
            "wordCloudPath": jd_wc_path
        },
        "scores": scores_data
    }
    
    # Print the JSON string to standard output
    print(json.dumps(results, indent=4))

if __name__ == "__main__":
    main()

