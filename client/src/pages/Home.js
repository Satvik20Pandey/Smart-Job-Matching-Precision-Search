import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, Upload, Sparkles, Target, Zap, Award, Globe, Shield } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    console.log('Home: Starting search for query:', query);
    setIsSearching(true);
    setSearchResults(null);
    
    try {
      console.log('Home: Searching for candidates...');
      // First try to search for candidates
      const candidateResponse = await axios.post('/api/search/candidates', { query });
      console.log('Home: Candidate search response:', candidateResponse.data);
      
      console.log('Home: Searching for jobs...');
      // Then try to search for jobs
      const jobResponse = await axios.post('/api/search/jobs', { query });
      console.log('Home: Job search response:', jobResponse.data);
      
      const results = {
        candidates: candidateResponse.data.candidates || [],
        jobs: jobResponse.data.jobs || [],
        query: query,
        totalFound: (candidateResponse.data.totalFound || 0) + (jobResponse.data.totalFound || 0)
      };
      
      console.log('Home: Combined results:', results);
      setSearchResults(results);
      
      if (results.totalFound > 0) {
        toast.success(`Found ${results.totalFound} results for "${query}"`);
      } else {
        toast.info(`No results found for "${query}". Try different keywords.`);
      }
      
    } catch (error) {
      console.error('Home: Search error:', error);
      console.error('Home: Error response:', error.response?.data);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'AI-Powered Search',
      description: 'Natural language queries with semantic understanding and precision filtering',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Combines vector similarity with strict rule-based filtering for accurate results',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Upload,
      title: 'Smart Resume Parsing',
      description: 'Automatically extract skills, experience, and education from PDF/DOCX resumes',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Hybrid Search Engine',
      description: 'Seamlessly switch between semantic search and structured filtering',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { label: 'Jobs Matched', value: '10K+', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Candidates', value: '50K+', icon: Users, color: 'text-green-600' },
    { label: 'Companies', value: '500+', icon: Globe, color: 'text-purple-600' },
    { label: 'Success Rate', value: '95%', icon: Award, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 shadow-soft mb-6">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Eraah Internship Assignment</span>
            </div>
            <h1 className="section-title mb-6">
              Smart Job Matching with{' '}
              <span className="gradient-text">AI Precision</span>
            </h1>
            <p className="section-subtitle mb-8">
              Experience the future of recruitment with our hybrid AI system that combines 
              semantic search with strict filtering for highly accurate job-candidate matches.
            </p>
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-soft">
                <Shield className="h-4 w-4 text-success-600" />
                <span className="text-sm font-semibold text-gray-700">Built by Satvik Pandey</span>
              </div>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} />
          
          {/* Search Results Display */}
          {isSearching && (
            <div className="mt-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for "{searchResults?.query || 'your query'}"...</p>
            </div>
          )}

          {searchResults && !isSearching && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Search Results for "{searchResults.query}"
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{searchResults.jobs.length}</div>
                    <div className="text-sm text-blue-700">Jobs Found</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{searchResults.candidates.length}</div>
                    <div className="text-sm text-green-700">Candidates Found</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  {searchResults.jobs.length > 0 && (
                    <Link
                      to="/jobs"
                      className="btn-primary"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      View All Jobs
                    </Link>
                  )}
                  {searchResults.candidates.length > 0 && (
                    <Link
                      to="/candidates"
                      className="btn-accent"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View All Candidates
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick Preview of Results */}
              {searchResults.jobs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <span>Top Job Matches</span>
                  </h4>
                  <div className="space-y-3">
                    {searchResults.jobs.slice(0, 3).map((job, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                        <h5 className="font-semibold text-gray-900">{job.title}</h5>
                        <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                        <p className="text-gray-500 text-sm mt-1">{job.description?.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.candidates.length > 0 && (
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Top Candidate Matches</span>
                  </h4>
                  <div className="space-y-3">
                    {searchResults.candidates.slice(0, 3).map((candidate, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border-l-4 border-green-500">
                        <h5 className="font-semibold text-gray-900">{candidate.name}</h5>
                        <p className="text-gray-600 text-sm">{candidate.location} • {candidate.experience?.total || 0} years exp</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills?.slice(0, 3).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {typeof skill === 'string' ? skill : skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft border border-gray-100 mb-4 group-hover:shadow-medium transition-all duration-300`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 font-display">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="section-title mb-6">
              How It Works
            </h2>
            <p className="section-subtitle">
              Our system intelligently parses your requirements and delivers precise matches
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-8 group">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} text-white rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-medium`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="section-title mb-6">
              Ready to Get Started?
            </h2>
            <p className="section-subtitle mb-8">
              Choose your path to intelligent job matching
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/jobs" className="group">
              <div className="card-hover group-hover:border-primary-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-medium">
                  <Briefcase className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Find Jobs</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Search for opportunities using natural language or advanced filters
                </p>
                <div className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  Browse Jobs →
                </div>
              </div>
            </Link>

            <Link to="/candidates" className="group">
              <div className="card-hover group-hover:border-green-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-medium">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Find Candidates</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Discover talented professionals with AI-powered matching
                </p>
                <div className="text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                  Browse Candidates →
                </div>
              </div>
            </Link>

            <Link to="/upload" className="group">
              <div className="card-hover group-hover:border-purple-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-medium">
                  <Upload className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Upload Resume</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Let AI extract your skills and experience automatically
                </p>
                <div className="text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                  Upload Now →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl mx-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-accent-600/90"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6 font-display">
            Experience the Power of AI-Driven Recruitment
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Join thousands of companies and candidates who trust our intelligent matching system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-medium hover:shadow-large transform hover:-translate-y-1"
            >
              Start Searching
            </Link>
            <Link
              to="/upload"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Upload Resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
