import React, { useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please upload or select a leaf image first!");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || "Inference pipeline failed.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to AI server. Make sure your backend terminal (app.py) is running!",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AgriVision AI</h1>
        <p>
          Instant Disease & Pest Diagnosis for Cashew, Cassava, Maize, and
          Tomato Crops
        </p>
      </header>
      <main className="main-content">
        <div className="card upload-card">
          <h2>Step 1: Upload Leaf Image</h2>
          <label className="file-drop-zone">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="drop-zone-text">
              {selectedFile
                ? "📄 Change selected image"
                : "📁 Click to browse leaf image"}
            </div>
          </label>
          {selectedFile && (
            <p className="file-name">Selected: {selectedFile.name}</p>
          )}
          {previewUrl && (
            <div className="image-preview-container">
              <img
                src={previewUrl}
                alt="Leaf Preview"
                className="leaf-preview"
              />
            </div>
          )}
          <button
            className="action-btn"
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            {loading ? "Analyzing Cellular Patterns..." : "Run AI Diagnosis"}
          </button>
        </div>
        <div className="card result-card">
          <h2>Step 2: Diagnostic Results</h2>
          {loading && (
            <div className="loading-spinner-container">
              <div className="spinner"></div>
              <p>
                Evaluating crop features against 22 known condition matrices...
              </p>
            </div>
          )}
          {error && <div className="error-display">⚠️ {error}</div>}
          {result && (
            <div className="success-display">
              <div className="badge-container">
                <span className="badge">AI Match Found</span>
              </div>
              <div className="metric-row">
                <span className="label">Detected Class:</span>
                <span className="value health-condition">{result.class}</span>
              </div>
              <div className="metric-row">
                <span className="label">Model Confidence:</span>
                <span className="value confidence-pct">
                  {result.confidence}%
                </span>
              </div>
              <div className="treatment-notice">
                <p>
                  <strong>Note:</strong> Cross-reference this classification
                  score with field symptoms before deploying localized chemical
                  or organic crop treatments.
                </p>
              </div>
            </div>
          )}
          {!loading && !result && !error && (
            <p className="placeholder-text">
              Upload a sample image and click diagnose to stream real-time deep
              learning classifications.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
export default App;
