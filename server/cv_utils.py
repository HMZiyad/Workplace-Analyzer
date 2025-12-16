import cv2
import numpy as np
from deepface import DeepFace

# Using DeepFace's built-in analysis which includes detection.
# We will use 'ssd' or 'mtcnn' backend for better detection than Haar.
# Defaulting to 'ssd' for a balance of speed and accuracy.
# If 'ssd' is missing, it falls back or errors, but deepface usually handles it.
DETECTOR_BACKEND = 'retinaface'

def analyze_image_cv(image_path, detector_backend='retinaface'):
    """
    Analyzes the image for people (faces) and their mood using DeepFace.
    Returns a list of dicts: {'bbox': [x, y, w, h], 'mood': 'Happy'}
    """
    results = []
    
    try:
        # DeepFace.analyze can take an image path or numpy array.
        # It detects faces and analyzes attributes.
        # actions=['emotion']
        
        # Mapping UI model names to DeepFace backends if needed
        # YOLOv8 in DeepFace is usually 'yolov8'
        
        objs = DeepFace.analyze(
            img_path=image_path, 
            actions=['emotion'],
            detector_backend=detector_backend,
            enforce_detection=False, # If no face found, don't crash, just return empty list or handle it
            silent=True
        )
        
        # DeepFace returns a list of dicts
        if not isinstance(objs, list):
            objs = [objs]
            
        for obj in objs:
            # Region is dict {'x': 239, 'y': 105, 'w': 393, 'h': 393}
            region = obj.get('region', {})
            x = region.get('x', 0)
            y = region.get('y', 0)
            w = region.get('w', 0)
            h = region.get('h', 0)
            
            # Emotion
            dominant_emotion = obj.get('dominant_emotion', 'neutral')
            
            # Map to our standard categories
            mood_label = map_mood(dominant_emotion)
            
            # Filter out very small detections if necessary (noise)
            if w > 20 and h > 20: 
                results.append({
                    "bbox": [int(x), int(y), int(w), int(h)],
                    "mood": mood_label
                })
                

                
    except Exception as e:
        # Use repr() to avoid UnicodeEncodeError on Windows consoles if the error message contains special chars
        print(f"DeepFace analysis error: {repr(e)}")
        import traceback
        traceback.print_exc()
        # Only return empty list if genuinely failed
        return []

    return results

def map_mood(emotion):
    mapping = {
        'happy': 'Happy',
        'neutral': 'Neutral',
        'sad': 'Sleepy',     # Proxy
        'surprise': 'Focused', # Proxy
        'fear': 'Focused',     # Proxy
        'angry': 'Angry',
        'disgust': 'Angry'
    }
    return mapping.get(emotion.lower(), 'Neutral')
