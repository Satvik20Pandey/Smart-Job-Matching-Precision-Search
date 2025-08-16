import { Briefcase, Users } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import axios from 'axios';

const SearchBar = ({ onSearch, placeholder = "Search jobs or candidates...", type = "both" }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`/api/search/suggestions?q=${query}`);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const examples = [
    "Python developers in Bangalore with 3+ years experience",
    "Only candidates with PMP certification",
    "Remote frontend roles paying above 20 LPA",
    "IIT undergraduates for software engineering",
    "Java developers who can join immediately"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
          <div className="flex items-center pl-4 pr-2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 py-4 px-2 text-lg text-gray-900 placeholder-gray-500 focus:outline-none"
          />
          
          <button
            onClick={() => handleSearch()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-r-2xl font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
              >
                <div className={`p-2 rounded-full ${
                  suggestion.type === 'job' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {suggestion.type === 'job' ? <Briefcase className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                </div>
                <span className="text-gray-700">{suggestion.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-3">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium">Try these natural language queries:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(example);
                handleSearch(example);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
