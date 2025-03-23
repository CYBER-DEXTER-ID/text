const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve the frontend
app.use(express.static('public'));

// Endpoint for image upload and text extraction
app.post('/api/extract-text', upload.single('image'), async (req, res) => {
    const apiKey = 'YOUR_API_KEY'; // Replace with your API Ninjas API key
    const imagePath = req.file.path;

    try {
        // Read the image file and send it to the API
        const imageBuffer = fs.readFileSync(imagePath);
        
        const formData = new FormData();
        formData.append('image', imageBuffer, { filename: req.file.originalname });

        const apiResponse = await axios.post('https://api.api-ninjas.com/v1/imagetotext', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Api-Key': apiKey
            }
        });

        // Send back the extracted text
        res.json({ text: apiResponse.data.text });

        // Clean up the uploaded file
        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error extracting text:', error);
        res.status(500).json({ message: 'Error extracting text' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
