const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    skills: [String],
    experience: {
      min: Number,
      max: Number
    },
    education: {
      level: String,
      field: String,
      institution: String
    },
    certifications: [String]
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time'
  },
  remote: {
    type: Boolean,
    default: false
  },
  immediateJoining: {
    type: Boolean,
    default: false
  },
  vectorEmbedding: [Number],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  active: {
    type: Boolean,
    default: true
  }
});

jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ 'requirements.skills': 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ 'requirements.education.institution': 1 });

module.exports = mongoose.model('Job', jobSchema);
