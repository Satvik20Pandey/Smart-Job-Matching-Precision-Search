const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Smart Job Matcher...\n');

// Create necessary directories
const dirs = [
  'uploads',
  'logs',
  'data'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Check if MongoDB is running
console.log('\n📋 Prerequisites Check:');
console.log('1. Ensure MongoDB is running on localhost:27017');
console.log('2. Node.js 16+ is installed');
console.log('3. npm is available');

console.log('\n🔧 Installation Steps:');
console.log('1. Install backend dependencies: npm install');
console.log('2. Install frontend dependencies: cd client && npm install');
console.log('3. Start backend: npm run dev');
console.log('4. Start frontend: cd client && npm start');

console.log('\n🌐 The application will be available at:');
console.log('- Backend API: http://localhost:5000');
console.log('- Frontend: http://localhost:3000');

console.log('\n📚 Sample API calls to test:');
console.log('- POST /api/search/jobs with query: "Python developers in Bangalore"');
console.log('- POST /api/upload/resume with a PDF/DOCX file');
console.log('- GET /api/jobs to list all jobs');

console.log('\n✨ Setup complete! Happy coding!');
