# Signify

A real-time sign language recognition system using MediaPipe, OpenCV, and scikit-learn. The system provides a web-based user interface devloped using React.js, Vite, and Tailwind CSS.

## Features

- Real-time hand gesture recognition
- 10 sign language classes: "I Love You", "Hello", "Thank you", "Me/I", "Want", "Question", "Help", "Water", "A", "Yes"
- 100% accuracy on training data
- Webcam-based inference
- Light/dark mode toggle
- Resizable interpreted text
  

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Collect training data:
```bash
python collect_images.py
```

3. Process the data:
```bash
python create_dataset.py
```

4. Train the model:
```bash
python train_classifier.py
```

5. Run inference:
```bash
python inference_classifier.py
```

6.

## Files

- `collect_images.py` - Collects training images from webcam
- `create_dataset.py` - Processes images and extracts hand landmarks
- `train_classifier.py` - Trains the RandomForest classifier
- `inference_classifier.py` - Real-time sign language recognition
- `data/` - Training images organized by class
- `data.pickle` - Processed hand landmark data
- `model.p` - Trained classifier model

## Usage

The system uses MediaPipe for hand detection and extracts 21 hand landmarks per hand. The RandomForest classifier is trained on normalized landmark coordinates to recognize different sign language gestures.
