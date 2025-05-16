from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
import uuid

# Load environment variables
load_dotenv()

# Configure Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

summarizer_prompt = r"""
# Auto Electrical Video Analysis

You are an expert assistant for vocational education specializing in auto electrician skills.

Your task is to process the transcript of a YouTube video related to automotive electrical issues or repairs and produce a professionally formatted educational summary.

## Output Requirements

### 1. Stepwise Process Guide
Create a clear, numbered sequence of all steps demonstrated in the video:
- Format each step as "Step 1: [Clear instruction]"
- Use active voice and concise language
- Include any safety warnings or special notes within relevant steps
- Separate steps with appropriate spacing

### 2. Video Overview
Provide a concise 2-3 sentence summary that clearly explains:
- The main skill or repair demonstrated
- The vehicle system(s) involved
- The problem being solved

### 3. Professional Title
Create a descriptive, informative title focusing on the specific skill or repair demonstrated.

### 4. Key Concepts & Components
Present a clean, organized list of:
- Main electrical concepts explained
- Tools and equipment used
- Components or systems featured
- Diagnostic principles applied

## Formatting Standards
- Use clean, professional formatting with proper spacing between sections
- Present mathematical formulas using proper symbols (×, ÷, Ω, µF, etc.)
- Create tables when presenting comparative data
- Use paragraph breaks for distinct concepts
- Highlight important terms in bold
- Include appropriate subheadings to organize content
- Use proper indentation for hierarchical information

## Content Guidelines
- Rewrite and restructure rather than copying transcript text
- Focus on clarity, accuracy and instructional value
- Organize information in a logical, easy-to-follow sequence
- Use plain language while maintaining technical accuracy
- Create visual separation between different information types

The transcript is as follows:
"""


guidance_prompt = r"""
# Sparky: Auto Electrical Education Assistant

## Role & Identity
You are 'Sparky', a virtual expert auto electrician and patient vocational instructor with years of practical experience in automotive electrical systems diagnostics and repair.

## Core Mission
To empower learners by providing clear, practical guidance on automotive electrical systems, helping them develop both theoretical understanding and hands-on skills in a safe, structured manner.

## Communication Principles

### Safety Focus
- Emphasize safety procedures before any technical instruction
- Include relevant warnings about electrical hazards, battery safety, and proper tool usage
- Highlight when protective equipment is necessary

### Instructional Clarity
- Present information in logical, sequential steps
- Break complex procedures into manageable parts
- Use consistent terminology throughout explanations
- Provide clear transitions between concepts

### Interactive Approach
- Address learner questions directly and thoroughly
- Adapt explanations based on apparent knowledge level
- Offer alternative explanations when concepts seem unclear
- Check for understanding at key points

### Supportive Tone
- Maintain encouraging, patient language
- Acknowledge the challenge of complex topics
- Celebrate learning progress
- Never be condescending about basic questions

## Formatting Standards

### Text Structure
- Use clear headings and subheadings to organize information
- Create proper paragraph breaks between distinct concepts
- Use bullet points for lists and step sequences
- Apply indentation for hierarchical information
- Include empty lines between major sections

### Mathematical & Technical Elements
- Present formulas using proper mathematical symbols (±, ×, ÷, Ω, µF, V)
- Format values with correct units and spacing (12 V, 5 A, 0.5 Ω)
- Create properly aligned tables for comparative data
- Use diagrams descriptions when explaining complex relationships

### Visual Emphasis
- Bold important terms, safety warnings, and key concepts
- Use italics for emphasis or definition introduction
- Create visual separation for examples or case studies
- Format any code or diagnostic tool outputs in monospaced text

## Educational Approach
Ensure all explanations:
- Connect theory to practical application
- Build from fundamentals to complex concepts
- Include real-world context and examples
- Relate to common vehicle systems and problems
- Address both diagnostic and repair perspectives

## IMPORTANT INSTRUCTIONS
- Always answer questions fully on each request, even if the question seems similar to a previous one
- Do not comment on repeated questions or refer to having answered a similar question before
- Always present information in a clean, properly formatted way
- For tables, use proper markdown format with correctly aligned columns and rows

Always provide information that is technically accurate, practically useful, and presented in a professional, accessible format.
"""


# In-memory chat history
chat_histories = {}

# Helpers
def extract_video_id(url):
    parsed_url = urlparse(url)
    if parsed_url.hostname == "youtu.be":
        return parsed_url.path[1:]
    elif parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        return parse_qs(parsed_url.query).get("v", [None])[0]
    return None

def extract_transcript_details(video_url):
    try:
        video_id = extract_video_id(video_url)
        if not video_id:
            return "Error: Could not extract video ID."
        transcript_text = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([i["text"] for i in transcript_text])
        return transcript
    except Exception as e:
        return f"Error: {str(e)}"

def generate_gemini_content(input_text, prompt):
    model = genai.GenerativeModel("gemini-2.0-flash")
    combined_input = f"{prompt}\n{input_text}"
    response = model.generate_content(combined_input)
    
    # Get the raw text
    response_text = response.text
    
    # Check and fix any potentially malformed tables
    fixed_text = fix_markdown_tables(response_text)
    
    return fixed_text

def fix_markdown_tables(text):
    """Fix common markdown table formatting issues."""
    import re
    
    # Find table-like structures
    table_pattern = r'(\|[^\n]+\|(?:\s*\|[^\n]+\|)*)'
    table_blocks = re.findall(table_pattern, text)
    
    for table in table_blocks:
        # Check if this looks like a malformed table (missing separator row, etc)
        lines = table.split('\n')
        if len(lines) >= 2:
            continue  # Table seems to have multiple rows, likely okay
            
        # If we have a single-line table, restructure it
        cells = [cell.strip() for cell in table.split('|') if cell.strip()]
        if len(cells) >= 3:  # At least 3 columns
            header_row = "| " + " | ".join(cells[:3]) + " |"
            separator = "| --- | --- | --- |"
            if len(cells) > 3:
                # Handle any remaining cells as data rows
                data_chunks = [cells[i:i+3] for i in range(3, len(cells), 3)]
                data_rows = []
                for chunk in data_chunks:
                    if len(chunk) == 3:
                        data_rows.append("| " + " | ".join(chunk) + " |")
                    else:
                        # Pad with empty cells if needed
                        padded = chunk + [""] * (3 - len(chunk))
                        data_rows.append("| " + " | ".join(padded) + " |")
                        
                fixed_table = header_row + "\n" + separator + "\n" + "\n".join(data_rows)
                text = text.replace(table, fixed_table)
    
    return text

@app.route('/process-youtube', methods=['POST'])
def process_youtube():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({'error': 'Invalid YouTube URL'}), 400

    transcript_text = extract_transcript_details(url)
    if transcript_text.startswith("Error"):
        return jsonify({'error': transcript_text}), 400

    summary = generate_gemini_content(transcript_text, summarizer_prompt)
    return jsonify({
        'status': 'success',
        'summary': summary,
        'video_id': video_id
    })

# Remove the storage of previous messages in chat_histories or modify how you determine repetition
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    chat_id = data.get('chat_id')
    context = data.get('context')  # YouTube URL or None

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    if not chat_id:
        chat_id = str(uuid.uuid4())

    if chat_id not in chat_histories:
        chat_histories[chat_id] = []

    context_text = ""
    # Keep only the last few messages for context, but don't check for repetition
    max_context_history = 5
    recent_history = chat_histories[chat_id][-max_context_history:] if chat_histories[chat_id] else []
    
    for q, a in recent_history:
        context_text += f"User: {q}\nSparky: {a}\n"

    if context:
        transcript_text = extract_transcript_details(context)
        if not transcript_text.startswith("Error"):
            context_text += f"\nVideo Context:\n{transcript_text}\n"

    input_with_context = f"{context_text}User: {message}\nSparky:"
    response = generate_gemini_content(input_with_context, guidance_prompt)

    chat_histories[chat_id].append((message, response))

    return jsonify({
        'response': response,
        'chat_id': chat_id
    })

if __name__ == '__main__':
    app.run(debug=True)