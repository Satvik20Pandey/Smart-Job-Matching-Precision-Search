import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, User, GraduationCap, Clock, Star, Building } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import toast from 'react-hot-toast';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      const response = await axios.post('/api/search/candidates', { query });
      setCandidates(response.data.candidates);
      setAppliedFilters(response.data.appliedFilters || {});
      toast.success(`Found ${response.data.totalFound} candidates`);
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
      const response = await axios.post('/api/search/candidates', { filters });
      setCandidates(response.data.candidates);
      setAppliedFilters(response.data.appliedFilters || {});
      toast.success(`Found ${response.data.totalFound} candidates with filters`);
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
    handleSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="section-title mb-4">
          Find Top Talent
        </h1>
        <p className="section-subtitle">
          Use natural language or advanced filters to discover skilled professionals
        </p>
      </div>

      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search for candidates like 'Python developers in Bangalore with 3+ years experience'"
        type="candidates"
      />

      <div className="mt-8 grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-display">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
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
                  Education Level
                </label>
                <select
                  value={filters.educationLevel || ''}
                  onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Education</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={filters.institution || ''}
                  onChange={(e) => handleFilterChange('institution', e.target.value)}
                  placeholder="e.g., IIT, IIM, NIT"
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
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <h4 className="font-semibold text-primary-900 mb-2">Applied Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(appliedFilters).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full font-medium"
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
              <p className="text-gray-600">Searching for candidates...</p>
            </div>
          ) : candidates.length > 0 ? (
            <div className="space-y-6">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate._id} candidate={candidate} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start your candidate search</h3>
              <p className="text-gray-600">
                Use the search bar above to find talented professionals
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CandidateCard = ({ candidate }) => {
  return (
    <Link to={`/candidates/${candidate._id}`}>
      <div className="card-hover">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
              {candidate.name}
            </h3>
            <div className="flex items-center space-x-4 text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{candidate.availability}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-primary-600">
              {candidate.expectedSalary?.min && candidate.expectedSalary?.max 
                ? `${candidate.expectedSalary.min}-${candidate.expectedSalary.max} LPA`
                : candidate.expectedSalary?.min 
                ? `${candidate.expectedSalary.min}+ LPA`
                : 'Salary not specified'
              }
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {candidate.experience?.total || 0} years exp
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Skills</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills?.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  skill.level === 'expert' ? 'bg-red-100 text-red-800' :
                  skill.level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                  skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {skill.name} ({skill.level})
              </span>
            ))}
            {candidate.skills?.length > 5 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                +{candidate.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {candidate.education?.slice(0, 1).map((edu, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>{edu.level} from {edu.institution}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Building className="h-4 w-4" />
            <span>
              {candidate.experience?.details?.length || 0} companies
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CandidateSearch;