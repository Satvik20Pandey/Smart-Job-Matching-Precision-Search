import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobSearch from './pages/JobSearch';
import CandidateSearch from './pages/CandidateSearch';
import ResumeUpload from './pages/ResumeUpload';
import JobDetail from './pages/JobDetail';
import CandidateDetail from './pages/CandidateDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/candidates" element={<CandidateSearch />} />
            <Route path="/upload" element={<ResumeUpload />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
