import os
from wordcloud import WordCloud
import matplotlib.pyplot as plt

def generate_wordcloud(text, output_path):
    """
    Generates a word cloud from text and saves it to a file.

    Args:
        text (str): The input text for the word cloud.
        output_path (str): The file path to save the generated image.

    Returns:
        str: The path to the saved image, or None if generation failed.
    """
    if not text:
        return None
    try:
        # Generate the word cloud object
        wordcloud = WordCloud(
            width=800, 
            height=400, 
            background_color='white',
            colormap='viridis',
            contour_color='steelblue',
            contour_width=1
        ).generate(text)
        
        # Save the image
        wordcloud.to_file(output_path)
        
        return output_path
    except Exception as e:
        print(f"Error generating word cloud for {output_path}: {e}")
        return None

