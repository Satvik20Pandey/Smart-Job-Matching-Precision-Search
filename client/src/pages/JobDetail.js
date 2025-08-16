import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building, Clock, DollarSign, Calendar, Users, Star, ArrowLeft, ExternalLink } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-red-500 mb-4">
          <Building className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
        <Link to="/jobs" className="btn-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/jobs" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
        
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 font-display">{job.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {job.salary?.min && job.salary?.max 
                  ? `${job.salary.min}-${job.salary.max} LPA`
                  : job.salary?.min 
                  ? `${job.salary.min}+ LPA`
                  : 'Salary not specified'
                }
              </div>
              <div className="text-sm text-gray-500">
                {job.jobType}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {job.requirements?.experience?.min && job.requirements?.experience?.max
                  ? `${job.requirements.experience.min}-${job.requirements.experience.max} years`
                  : job.requirements?.experience?.min
                  ? `${job.requirements.experience.min}+ years`
                  : 'Experience not specified'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.remote && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                Remote
              </span>
            )}
            {job.immediateJoining && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                Immediate Joining
              </span>
            )}
            {job.active ? (
              <span className="px-3 py-1 bg-success-100 text-success-800 text-sm rounded-full font-medium">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">
                Closed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Job Description</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Requirements</h2>
        
        {job.requirements?.skills && job.requirements.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Required Skills</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.requirements.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.requirements?.education && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Education Requirements</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid md:grid-cols-2 gap-4">
                {job.requirements.education.level && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Level:</span>
                    <p className="text-gray-900">{job.requirements.education.level}</p>
                  </div>
                )}
                {job.requirements.education.field && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Field:</span>
                    <p className="text-gray-900">{job.requirements.education.field}</p>
                  </div>
                )}
                {job.requirements.education.institution && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Preferred Institution:</span>
                    <p className="text-gray-900">{job.requirements.education.institution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {job.requirements?.certifications && job.requirements.certifications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {job.requirements.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent-100 text-accent-800 text-sm rounded-full font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Company Info */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">About {job.company}</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{job.company}</h3>
              <p className="text-gray-600">{job.location}</p>
            </div>
          </div>
          <p className="text-gray-700">
            We are a dynamic company looking for talented individuals to join our team. 
            This position offers excellent growth opportunities and competitive compensation.
          </p>
        </div>
      </div>

      {/* Apply Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">Ready to Apply?</h2>
          <p className="text-gray-600 mb-6">
            If you meet the requirements and are interested in this position, 
            we'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              <Users className="h-4 w-4 mr-2" />
              Apply Now
            </button>
            <button className="btn-secondary">
              <ExternalLink className="h-4 w-4 mr-2" />
              Save Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;