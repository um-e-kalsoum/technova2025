print("Starting imports...")
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import pickle
import base64
import io
from PIL import Image
print("All imports completed!")

print("Creating Flask app...")
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
print("Flask app created!")

# Load the trained model
print("Loading model...")
try:
    model_dict = pickle.load(open('./model.p', 'rb'))
    model = model_dict['model']
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Initialize MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(
    static_image_mode=True, 
    min_detection_confidence=0.3,
    max_num_hands=1
)

# Labels dictionary matching your trained model
labels_dict = {
    0: 'Question', 
    1: 'Water', 
    2: 'Help', 
    3: 'I Love You', 
    4: 'Hello', 
    5: 'Thanks', 
    6: 'A', 
    7: 'Want', 
    8: 'I', 
    9: 'Yes'
}

@app.route('/api/predict', methods=['POST'])
def predict_sign():
    try:
        if not model:
            return jsonify({'error': 'Model not loaded'}), 500
            
        # Get image data from request
        data = request.json
        image_data = data['image']
        
        # Decode base64 image
        image_data = image_data.split(',')[1]  # Remove data:image/jpeg;base64, prefix
        image_bytes = base64.b64decode(image_data)
        
        # Convert to OpenCV format
        image = Image.open(io.BytesIO(image_bytes))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        H, W, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe
        results = hands.process(frame_rgb)
        
        if results.multi_hand_landmarks:
            data_aux = []
            x_ = []
            y_ = []
            
            for hand_landmarks in results.multi_hand_landmarks:
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    
                    data_aux.append(x)
                    data_aux.append(y)
                    x_.append(x)
                    y_.append(y)
            
            # Make prediction
            if len(data_aux) == 42:  # 21 landmarks * 2 coordinates
                prediction = model.predict([np.asarray(data_aux)])
                predicted_character = labels_dict[int(prediction[0])]
                
                # Calculate bounding box
                x1 = int(min(x_) * W) - 10
                y1 = int(min(y_) * H) - 10
                x2 = int(max(x_) * W) + 10
                y2 = int(max(y_) * H) + 10
                
                return jsonify({
                    'prediction': predicted_character,
                    'confidence': 'high',
                    'bbox': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2}
                })
            else:
                return jsonify({'error': 'Invalid hand landmarks data'}), 400
        else:
            return jsonify({'prediction': 'No hand detected', 'confidence': 'none'})
            
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'supported_signs': list(labels_dict.values())
    })

if __name__ == '__main__':
    print("Starting Signify API server...")
    print(f"Supported signs: {list(labels_dict.values())}")
    app.run(debug=True, host='0.0.0.0', port=5000)
