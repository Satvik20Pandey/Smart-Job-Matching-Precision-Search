import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SearchBar = ({ onSearch, placeholder = "Search for jobs, candidates, or skills...", type = "general" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const exampleQueries = [
    "IIT undergraduates for software engineering",
    "Python developers in Bangalore with 3+ years experience",
    "Remote frontend roles paying above 20 LPA",
    "Java developers who can join immediately",
    "Machine learning engineers from top colleges",
    "DevOps engineers with AWS experience"
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        console.log('Fetching suggestions for:', query);
        const response = await axios.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        console.log('Suggestions response:', response.data);
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    console.log('SearchBar: Initiating search for:', searchQuery);
    setIsSearching(true);
    try {
      await onSearch(searchQuery);
      setShowSuggestions(false);
      console.log('SearchBar: Search completed successfully');
    } catch (error) {
      console.error('SearchBar: Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    setQuery(suggestion.text || suggestion);
    handleSearch(suggestion.text || suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed, searching for:', query);
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-soft"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="ml-2 px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Queries */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-3">Try these example queries:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                console.log('Example query clicked:', example);
                setQuery(example);
                handleSearch(example);
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-all duration-200 border border-gray-200 hover:border-primary-300"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-large z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Search Suggestions</span>
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                >
                  <div className="font-medium">{suggestion.text}</div>
                  {suggestion.type && (
                    <div className="text-xs text-gray-500 mt-1">
                      {suggestion.type} • {suggestion.count || 0} results
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Search Info */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">
            AI-Powered Search with Precision Filtering
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Our system understands natural language and applies strict filters for accurate results
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
