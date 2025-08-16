const express = require('express');
const multer = require('multer');
const router = express.Router();
const resumeParser = require('../utils/resumeParser');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

router.post('/resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let parsedData;
    if (req.file.mimetype === 'application/pdf') {
      parsedData = await resumeParser.parsePDF(req.file.buffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      parsedData = await resumeParser.parseDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.json({
      success: true,
      data: parsedData,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Resume parsing failed', 
      details: error.message 
    });
  }
});

router.post('/resume/validate', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let parsedData;
    if (req.file.mimetype === 'application/pdf') {
      parsedData = await resumeParser.parsePDF(req.file.buffer);
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      parsedData = await resumeParser.parseDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const validation = {
      isValid: true,
      fields: {
        name: !!parsedData.name,
        email: !!parsedData.email,
        phone: !!parsedData.phone,
        skills: parsedData.skills.length > 0,
        experience: parsedData.experience.total > 0,
        education: parsedData.education.length > 0,
        location: !!parsedData.location
      },
      confidence: calculateConfidence(parsedData),
      suggestions: generateSuggestions(parsedData)
    };

    res.json({
      success: true,
      data: parsedData,
      validation,
      filename: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Resume validation failed', 
      details: error.message 
    });
  }
});

function calculateConfidence(data) {
  let score = 0;
  let total = 7;
  
  if (data.name) score++;
  if (data.email) score++;
  if (data.phone) score++;
  if (data.skills.length > 0) score++;
  if (data.experience.total > 0) score++;
  if (data.education.length > 0) score++;
  if (data.location) score++;
  
  return Math.round((score / total) * 100);
}

function generateSuggestions(data) {
  const suggestions = [];
  
  if (!data.name) suggestions.push('Name not detected - please check resume format');
  if (!data.email) suggestions.push('Email not detected - please check resume format');
  if (!data.phone) suggestions.push('Phone number not detected - please check resume format');
  if (data.skills.length === 0) suggestions.push('Skills not detected - please check resume format');
  if (data.experience.total === 0) suggestions.push('Experience not detected - please check resume format');
  if (data.education.length === 0) suggestions.push('Education not detected - please check resume format');
  if (!data.location) suggestions.push('Location not detected - please check resume format');
  
  return suggestions;
}

module.exports = router;
