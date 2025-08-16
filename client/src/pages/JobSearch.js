import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Building, DollarSign, Clock } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      const response = await axios.post('/api/search/jobs', { query });
      setJobs(response.data.jobs);
      setAppliedFilters(response.data.appliedFilters || {});
      toast.success(`Found ${response.data.totalFound} jobs`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/search/jobs', { filters });
      setJobs(response.data.jobs);
      setAppliedFilters(response.data.appliedFilters || {});
      toast.success(`Found ${response.data.totalFound} jobs with filters`);
    } catch (error) {
      console.error('Filter error:', error);
      toast.error('Filter application failed.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    // Reload all jobs
    handleSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-gray-600">
          Use natural language or advanced filters to discover opportunities
        </p>
      </div>

      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search for jobs like 'Python developers in Bangalore with 3+ years experience'"
        type="jobs"
      />

      <div className="mt-8 grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="e.g., Bangalore, Remote"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  value={filters.skills || ''}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  placeholder="e.g., Python, React, Java"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <select
                  value={filters.experience || ''}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Experience</option>
                  <option value="0">Entry Level (0-1 years)</option>
                  <option value="2">Junior (2-3 years)</option>
                  <option value="4">Mid Level (4-6 years)</option>
                  <option value="7">Senior (7+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType || ''}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Salary (LPA)
                </label>
                <input
                  type="number"
                  value={filters.minSalary || ''}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                  placeholder="e.g., 10"
                  className="input-field"
                />
              </div>

              <button
                onClick={applyFilters}
                className="w-full btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {appliedFilters && Object.keys(appliedFilters).length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Applied Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(appliedFilters).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {key}: {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start your job search</h3>
              <p className="text-gray-600">
                Use the search bar above to find opportunities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`}>
      <div className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-primary-600">
              {job.salary?.min && job.salary?.max 
                ? `${job.salary.min}-${job.salary.max} LPA`
                : job.salary?.min 
                ? `${job.salary.min}+ LPA`
                : 'Salary not specified'
              }
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {job.jobType}
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {job.requirements?.skills?.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.requirements?.skills?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                +{job.requirements.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
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
        </div>
      </div>
    </Link>
  );
};

export default JobSearch;
