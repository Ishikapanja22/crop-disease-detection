# Crop Disease Detection — Offline-First PWA

An AI-powered Progressive Web App that detects crop diseases from leaf images — works even with **zero internet connectivity** in the field.

##  Live Demo
[https://crop-disease-detection-mauve.vercel.app/]

## Preview
Preview (https://github.com/Ishikapanja22/crop-disease-detection/blob/main/crop%20preview.png)

##  Features
- Upload crop leaf image for instant disease detection
- 22-class deep learning classification (~93% validation accuracy)
- **Offline-first** — runs inference directly in browser using TensorFlow.js
- Stores scan history locally via IndexedDB when offline
- ~80ms on-device inference, no backend dependency once loaded
-  Service Worker caching for full offline app experience

## Tech Stack

**Machine Learning**
- TensorFlow / Keras (MobileNetV3Large backbone)
- NumPy, Pillow
- TensorFlow.js Converter (quantized model export)

**Backend**
- Flask + Flask-CORS
- REST API for image inference

**Frontend**
- React.js (PWA)
- TensorFlow.js (client-side inference)
- Service Workers (offline caching)
- IndexedDB + Dexie.js (offline data storage)

## Getting Started

### ML Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Folder Structure
crop-disease-detection/
├── backend/
│   ├── model/
│   │   └── plant_ml.keras       
│   ├── utils
│   ├── app.py                   
│   ├── server.js                
│   └── requirement.txt
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── manifest.json        
    │   └── robots.txt
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   └── index.js

