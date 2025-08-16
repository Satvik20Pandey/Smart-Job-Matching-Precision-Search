import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Briefcase, Upload, Sparkles, Target, Zap } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const features = [
    {
      icon: Search,
      title: 'AI-Powered Search',
      description: 'Natural language queries with semantic understanding and precision filtering'
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Combines vector similarity with strict rule-based filtering for accurate results'
    },
    {
      icon: Upload,
      title: 'Smart Resume Parsing',
      description: 'Automatically extract skills, experience, and education from PDF/DOCX resumes'
    },
    {
      icon: Zap,
      title: 'Hybrid Search Engine',
      description: 'Seamlessly switch between semantic search and structured filtering'
    }
  ];

  const stats = [
    { label: 'Jobs Matched', value: '10K+' },
    { label: 'Candidates', value: '50K+' },
    { label: 'Companies', value: '500+' },
    { label: 'Success Rate', value: '95%' }
  ];

  return (
    <div className="space-y-16">
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Job Matching with{' '}
            <span className="text-primary-600">AI Precision</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience the future of recruitment with our hybrid AI system that combines 
            semantic search with strict filtering for highly accurate job-candidate matches.
          </p>
          
          <SearchBar onSearch={handleSearch} />
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white rounded-2xl shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Our system intelligently parses your requirements and delivers precise matches
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Choose your path to intelligent job matching
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/jobs" className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group-hover:border-primary-300">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Jobs</h3>
                <p className="text-gray-600 mb-4">
                  Search for opportunities using natural language or advanced filters
                </p>
                <div className="text-primary-600 font-medium group-hover:text-primary-700">
                  Browse Jobs →
                </div>
              </div>
            </Link>

            <Link to="/candidates" className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group-hover:border-primary-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Candidates</h3>
                <p className="text-gray-600 mb-4">
                  Discover talented professionals with AI-powered matching
                </p>
                <div className="text-primary-600 font-medium group-hover:text-primary-700">
                  Browse Candidates →
                </div>
              </div>
            </Link>

            <Link to="/upload" className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group-hover:border-primary-300">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Resume</h3>
                <p className="text-gray-600 mb-4">
                  Let AI extract your skills and experience automatically
                </p>
                <div className="text-primary-600 font-medium group-hover:text-primary-700">
                  Upload Now →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">
            Experience the Power of AI-Driven Recruitment
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of companies and candidates who trust our intelligent matching system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Searching
            </Link>
            <Link
              to="/upload"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
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
