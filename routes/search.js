const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const matchingEngine = require('../utils/matchingEngine');

router.post('/jobs', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    let jobs = await Job.find({ active: true });
    
    if (query) {
      const searchResults = matchingEngine.hybridSearch(query, jobs, 50);
      jobs = searchResults.results.map(r => r.document);
      
      res.json({
        jobs,
        totalFound: searchResults.totalFound,
        appliedFilters: searchResults.filters,
        semanticScore: searchResults.semanticScore
      });
    } else {
      const filteredJobs = matchingEngine.applyStrictFilters(
        jobs.map((job, index) => ({ index, score: 1, document: job })),
        filters
      );
      
      res.json({
        jobs: filteredJobs.map(r => r.document),
        totalFound: filteredJobs.length,
        appliedFilters: filters
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/candidates', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    let candidates = await Candidate.find();
    
    if (query) {
      const searchResults = matchingEngine.hybridSearch(query, candidates, 50);
      candidates = searchResults.results.map(r => r.document);
      
      res.json({
        candidates,
        totalFound: searchResults.totalFound,
        appliedFilters: searchResults.filters,
        semanticScore: searchResults.semanticScore
      });
    } else {
      const filteredCandidates = matchingEngine.applyStrictFilters(
        candidates.map((candidate, index) => ({ index, score: 1, document: candidate })),
        filters
      );
      
      res.json({
        candidates: filteredCandidates.map(r => r.document),
        totalFound: filteredCandidates.length,
        appliedFilters: filters
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hybrid', async (req, res) => {
  try {
    const { query, type = 'both', filters = {} } = req.body;
    
    let results = {};
    
    if (type === 'jobs' || type === 'both') {
      const jobs = await Job.find({ active: true });
      const jobResults = matchingEngine.hybridSearch(query, jobs, 25);
      results.jobs = {
        data: jobResults.results.map(r => r.document),
        totalFound: jobResults.totalFound,
        appliedFilters: jobResults.filters
      };
    }
    
    if (type === 'candidates' || type === 'both') {
      const candidates = await Candidate.find();
      const candidateResults = matchingEngine.hybridSearch(query, candidates, 25);
      results.candidates = {
        data: candidateResults.results.map(r => r.document),
        totalFound: candidateResults.totalFound,
        appliedFilters: candidateResults.filters
      };
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const jobs = await Job.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ],
      active: true
    }).limit(5);
    
    const candidates = await Candidate.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'skills.name': { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    }).limit(5);
    
    const suggestions = [
      ...jobs.map(job => ({ type: 'job', text: `${job.title} at ${job.company}`, id: job._id })),
      ...candidates.map(candidate => ({ type: 'candidate', text: `${candidate.name} - ${candidate.skills.map(s => s.name).join(', ')}`, id: candidate._id }))
    ];
    
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
