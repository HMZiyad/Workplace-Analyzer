import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from cv_utils import analyze_image_cv

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save file temporarily - DeepFace prefers file paths
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    # Get model choice from form data, default to retinaface
    model_choice = request.form.get('model', 'retinaface')
    print(f"Analyzing file: {filepath} with model: {model_choice}")

    try:
        
        # Call consolidated analysis
        # Pass filepath directly to DeepFace for best format handling
        detections = analyze_image_cv(filepath, detector_backend=model_choice)
        
        print(f"Detections found: {len(detections)}")

        results = []
        mood_counts = {}

        for i, det in enumerate(detections):
            mood = det['mood']
            mood_counts[mood] = mood_counts.get(mood, 0) + 1
            
            results.append({
                "id": i + 1,
                "bbox": det['bbox'],
                "mood": mood
            })

        response = {
            "total_people": len(results),
            "mood_breakdown": mood_counts,
            "people": results
        }
        
        return jsonify(response), 200

    except Exception as e:
        error_msg = str(e)
        try:
            with open("server_error.log", "w", encoding="utf-8") as f:
                f.write(error_msg)
                import traceback
                traceback.print_exc(file=f)
        except:
            pass
            
        print(f"Error processing image: {repr(e)}")
        return jsonify({"error": "An error occurred during analysis. Check server logs."}), 500
    finally:
        # Cleanup
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except:
                pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
