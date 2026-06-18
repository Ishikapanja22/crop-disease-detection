import os
import io
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
app = Flask(__name__)
CORS(app)
CLASS_NAMES = [
    'Cashew anthracnose', 'Cashew gumosis', 'Cashew healthy', 'Cashew leaf miner', 'Cashew red rust',
    'Cassava bacterial blight', 'Cassava brown spot', 'Cassava green mite', 'Cassava healthy', 'Cassava mosaic',
    'Maize fall armyworm', 'Maize grasshoper', 'Maize healthy', 'Maize leaf beetle', 'Maize leaf blight', 'Maize leaf spot',
    'Maize streak virus', 'Tomato healthy', 'Tomato leaf blight', 'Tomato leaf curl', 'Tomato septoria leaf spot', 'Tomato verticulium wilt'
]
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'plant_ml.keras')
print("--> Loading trained Keras engine layer paths...")
try:
    model = load_model(MODEL_PATH, compile=False)
    print("--> Model loaded successfully! Server is ready.")
except Exception as e:
    print(f"FAILED TO LOAD MODEL: {str(e)}")
    model = None
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224), Image.Resampling.BILINEAR)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)  # Shape: (1, 224, 224, 3)
    return img_array
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"success": False, "error": "AI Engine layer is offline."})
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image payload found."})
    file = request.files['image']
    try:
        img_bytes = file.read()
        processed_tensor = preprocess_image(img_bytes)
        predictions = model(processed_tensor, training=False).numpy()
        predicted_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_idx]) * 100
        print(f"[DEBUG LOG] Native Model Output Array: {predictions[0]}")
        print(f"[DEBUG LOG] Max Index Selected: {predicted_idx} -> Label: {CLASS_NAMES[predicted_idx]}")
        return jsonify({
            "success": True,
            "class": CLASS_NAMES[predicted_idx],
            "confidence": round(confidence, 2)
        })
    except Exception as e:
        return jsonify({"success": False, "error": f"Inference engine failure: {str(e)}"})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)