import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, Star, GraduationCap, Building, Calendar, ArrowLeft, Download, MessageCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CandidateDetail = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(`/api/candidates/${id}`);
        setCandidate(response.data);
      } catch (error) {
        console.error('Error fetching candidate:', error);
        setError('Failed to load candidate details');
        toast.error('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg">Loading candidate details...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-red-500 mb-4">
          <Building className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The candidate you are looking for does not exist.'}</p>
        <Link to="/candidates" className="btn-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/candidates" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Link>
        
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">{candidate.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{candidate.availability}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {candidate.expectedSalary?.min && candidate.expectedSalary?.max 
                  ? `${candidate.expectedSalary.min}-${candidate.expectedSalary.max} LPA`
                  : candidate.expectedSalary?.min 
                  ? `${candidate.expectedSalary.min}+ LPA`
                  : 'Salary not specified'
                }
              </div>
              <div className="text-sm text-gray-500">
                {candidate.experience?.total || 0} years experience
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{candidate.phone}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {candidate.availability === 'immediate' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                Available Immediately
              </span>
            )}
            {candidate.experience?.total >= 5 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                Senior Level
              </span>
            )}
            {candidate.education?.some(edu => edu.institution?.toLowerCase().includes('iit')) && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                IIT Graduate
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display flex items-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Skills & Expertise</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {candidate.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  skill.level === 'expert' ? 'bg-red-100 text-red-800' :
                  skill.level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                  skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {candidate.experience?.details && candidate.experience.details.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-500" />
            <span>Work Experience</span>
          </h2>
          <div className="space-y-6">
            {candidate.experience.details.map((exp, index) => (
              <div key={index} className="border-l-4 border-primary-200 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                <p className="text-gray-700 mb-3">{exp.description}</p>
                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {candidate.education && candidate.education.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-green-500" />
            <span>Education</span>
          </h2>
          <div className="space-y-4">
            {candidate.education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.level}</h3>
                    {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    {edu.institution && <p className="text-gray-600 font-medium">{edu.institution}</p>}
                  </div>
                  <div className="text-right">
                    {edu.graduationYear && (
                      <span className="text-sm text-gray-500">{edu.graduationYear}</span>
                    )}
                    {edu.gpa && (
                      <div className="text-sm text-gray-500">GPA: {edu.gpa}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{edu.fullTime ? 'Full-time' : 'Part-time'} Program</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {candidate.certifications && candidate.certifications.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Certifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {candidate.certifications.map((cert, index) => (
              <div key={index} className="p-4 bg-accent-50 rounded-xl border border-accent-200">
                <h3 className="font-semibold text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-gray-600 text-sm mb-2">Issued by {cert.issuer}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  {cert.date && <span>Issued: {new Date(cert.date).toLocaleDateString()}</span>}
                  {cert.expiry && <span>Expires: {new Date(cert.expiry).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Actions Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Interested in this candidate?</h2>
          <p className="text-gray-600 mb-6">
            This candidate appears to be a great fit for your team. 
            Get in touch to discuss opportunities!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Candidate
            </button>
            {candidate.resumeUrl && (
              <button className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </button>
            )}
            <button className="btn-accent">
              <Star className="h-4 w-4 mr-2" />
              Shortlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;