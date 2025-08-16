const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

router.post('/', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, location, skills, education } = req.query;
    const query = {};
    
    if (location) query.location = new RegExp(location, 'i');
    if (skills) query['skills.name'] = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
    if (education) query['education.institution'] = new RegExp(education, 'i');
    
    const candidates = await Candidate.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastUpdated: -1 });
    
    const total = await Candidate.countDocuments(query);
    
    res.json({
      candidates,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    req.body.lastUpdated = new Date();
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
