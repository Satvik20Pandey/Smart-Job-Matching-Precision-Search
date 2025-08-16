# Smart Job Matcher - AI-Powered Recruitment Platform

**Made by: Satvik Pandey for Eraah Internship Assignment**

A sophisticated job and candidate matching system that combines AI-powered semantic search with precision filtering for highly accurate recruitment results. This project demonstrates advanced AI/ML implementation, full-stack development skills, and innovative problem-solving approaches.

## 🚀 Features

### Core Functionalities
- **AI-Powered Matching Engine**: TF-IDF + Cosine Similarity for semantic relevance
- **Precision Filtering**: Dynamic rule-based filtering that adapts to query intent
- **Natural Language Processing**: Parse complex queries like "IIT undergraduates with 3+ years experience"
- **Resume Parsing**: Automatic extraction from PDF/DOCX with field mapping
- **Hybrid Search**: Combines semantic search with strict filtering for accuracy

### Key Capabilities
- **Smart Query Understanding**: Automatically detects skills, location, experience, education, salary requirements
- **False Positive Elimination**: Removes irrelevant matches using strict filtering rules
- **Resume Intelligence**: Extracts skills, experience, education, and contact information
- **Real-time Search**: Instant results with intelligent suggestions and autocomplete

## 🏗️ Architecture

### Backend Stack
- **Node.js + Express**: RESTful API with middleware for security and rate limiting
- **MongoDB**: Document-based database with optimized indexing
- **AI/ML Engine**: Custom matching algorithm using natural language processing
- **File Processing**: PDF and DOCX parsing with intelligent field extraction

### Frontend Stack
- **React 18**: Modern component-based UI with hooks
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing with navigation

### AI/ML Components
- **TF-IDF Algorithm**: Term frequency-inverse document frequency for text analysis
- **Cosine Similarity**: Vector similarity calculation for semantic matching
- **Natural Language Processing**: Query intent extraction using compromise.js
- **Precision Filtering**: Dynamic rule application based on detected criteria

## 🔧 Technical Implementation

### Matching Engine Architecture
```javascript
// Hybrid search combining semantic and structured filtering
const hybridSearch = (query, documents, topK) => {
  const filters = extractFilters(query);           // NLP parsing
  const semanticResults = semanticSearch(query, documents, topK * 2);
  const filteredResults = applyStrictFilters(semanticResults, filters);
  return { results: filteredResults.slice(0, topK), filters };
};
```

### Natural Language Query Processing
The system automatically detects:
- **Skills**: "Python developers", "React engineers"
- **Location**: "in Bangalore", "from Mumbai"
- **Experience**: "3+ years", "senior level"
- **Education**: "undergraduates", "IIT graduates"
- **Salary**: "above 20 LPA", "more than 15 lakhs"
- **Requirements**: "remote", "immediate joining"

### Precision Filtering Examples
- **Query**: "Only undergraduates from IIT"
  - **Filter**: Institution = "IIT", Education Level = "Bachelors", Full-time = true
  - **Excludes**: Part-time students, online courses, visiting faculty

- **Query**: "Java developers in Bangalore with 5+ years experience"
  - **Filter**: Skills includes "Java", Location = "Bangalore", Experience ≥ 5 years
  - **Excludes**: Junior developers, remote workers, different locations

## 📁 Project Structure

```
smart-job-matcher/
├── server.js                 # Express server entry point
├── package.json             # Backend dependencies
├── config.env              # Environment variables
├── models/                 # MongoDB schemas
│   ├── Job.js             # Job posting model
│   └── Candidate.js       # Candidate profile model
├── routes/                 # API endpoints
│   ├── jobs.js            # Job CRUD operations
│   ├── candidates.js      # Candidate CRUD operations
│   ├── search.js          # AI search endpoints
│   └── upload.js          # Resume upload & parsing
├── utils/                  # Core utilities
│   ├── matchingEngine.js  # AI matching algorithm
│   └── resumeParser.js    # PDF/DOCX parsing
└── client/                 # React frontend
    ├── package.json       # Frontend dependencies
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   └── App.js         # Main application
    └── public/            # Static assets
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB 5.0+
- Git

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd smart-job-matcher

# Install dependencies
npm install

# Configure environment
cp config.env.example config.env
# Edit config.env with your MongoDB URI and JWT secret

# Start MongoDB (ensure it's running)
mongod

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start
```

### Database Setup
```bash
# MongoDB will be created automatically when you first run the application
# Sample data can be inserted using the API endpoints
```

## 🔌 API Endpoints

### Search & Matching
- `POST /api/search/jobs` - AI-powered job search
- `POST /api/search/candidates` - AI-powered candidate search
- `POST /api/search/hybrid` - Combined search for both
- `GET /api/search/suggestions` - Search suggestions and autocomplete

### Jobs
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create new job posting
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Deactivate job

### Candidates
- `GET /api/candidates` - List candidates with filtering
- `POST /api/candidates` - Create candidate profile
- `GET /api/candidates/:id` - Get candidate details
- `PUT /api/candidates/:id` - Update candidate profile
- `DELETE /api/candidates/:id` - Delete candidate

### Resume Upload
- `POST /api/upload/resume` - Upload and parse resume
- `POST /api/upload/resume/validate` - Validate resume with confidence scoring

## 🎯 Usage Examples

### Natural Language Queries
```javascript
// Search for specific candidate requirements
const query = "Show me Python developers in Pune with 3+ years experience who can join immediately";

// System automatically extracts:
// - Skills: ["Python"]
// - Location: "Pune"
// - Experience: 3+ years
// - Availability: "immediate"
```

### Precision Filtering
```javascript
// Query: "Only candidates with PMP certification"
// Applied filters:
{
  certifications: ["PMP"],
  strict: true  // No fuzzy matching
}

// Query: "Jobs within 10 km of Mumbai Central paying above 15 LPA"
// Applied filters:
{
  location: "Mumbai Central",
  radius: 10,
  minSalary: 15,
  currency: "LPA"
}
```

## 🧪 Testing

### Backend Testing
```bash
# Run backend tests
npm test

# Test specific endpoints
curl -X POST http://localhost:5000/api/search/jobs \
  -H "Content-Type: application/json" \
  -d '{"query": "Python developers in Bangalore"}'
```

### Frontend Testing
```bash
cd client
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=5000
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN cd client && npm install && npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Features

- **Helmet.js**: Security headers and protection
- **Rate Limiting**: API request throttling
- **Input Validation**: Request sanitization
- **CORS**: Cross-origin resource sharing configuration
- **File Upload Security**: File type and size validation

## 📊 Performance Optimizations

- **Database Indexing**: Optimized MongoDB queries
- **Caching**: In-memory result caching
- **Pagination**: Efficient data loading
- **Lazy Loading**: Component and data lazy loading
- **Compression**: Response compression for large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎥 Demo Video

[Link to demo video showing core features]

## 📞 Support

For questions and support, please contact:
- Email: support@smartjobmatcher.com
- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)

---

**Built with ❤️ by Satvik Pandey for the Eraah Internship Assignment**

This project showcases advanced AI/ML implementation, full-stack development expertise, and innovative problem-solving approaches in the recruitment technology domain.
