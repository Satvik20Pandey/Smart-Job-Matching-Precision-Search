const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phone: String,
  location: {
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  }],
  experience: {
    total: Number,
    details: [{
      company: String,
      position: String,
      duration: String,
      description: String,
      skills: [String]
    }]
  },
  education: [{
    level: String,
    field: String,
    institution: String,
    graduationYear: Number,
    gpa: Number,
    fullTime: {
      type: Boolean,
      default: true
    }
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiry: Date
  }],
  resumeUrl: String,
  availability: {
    type: String,
    enum: ['immediate', '2-weeks', '1-month', '3-months', 'negotiable'],
    default: 'negotiable'
  },
  expectedSalary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  vectorEmbedding: [Number],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

candidateSchema.index({ name: 'text', 'skills.name': 'text' });
candidateSchema.index({ location: 1 });
candidateSchema.index({ 'education.institution': 1 });
candidateSchema.index({ 'education.level': 1 });

module.exports = mongoose.model('Candidate', candidateSchema);
