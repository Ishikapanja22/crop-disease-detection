const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer();
app.post('/api/detect', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded.");
        const formData = new FormData();
        formData.append('image', req.file.buffer, { filename: req.file.originalname });
        const aiResponse = await axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: formData.getHeaders()
        });
        res.json(aiResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI Engine is not responding." });
    }
});
app.listen(8080, () => console.log("Backend running on http://localhost:8080"));