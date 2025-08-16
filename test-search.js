const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSearchEndpoints() {
  console.log('🔍 Testing Search API Endpoints...\n');

  const testQueries = [
    "IIT undergraduates for software engineering",
    "Python developers in Bangalore",
    "Java developers",
    "Machine learning engineers"
  ];

  for (const query of testQueries) {
    console.log(`\n📝 Testing query: "${query}"`);
    
    try {
      // Test candidate search
      console.log('  🔍 Searching candidates...');
      const candidateResponse = await axios.post(`${BASE_URL}/api/search/candidates`, { query });
      console.log(`  ✅ Found ${candidateResponse.data.totalFound || 0} candidates`);
      
      // Test job search
      console.log('  🔍 Searching jobs...');
      const jobResponse = await axios.post(`${BASE_URL}/api/search/jobs`, { query });
      console.log(`  ✅ Found ${jobResponse.data.totalFound || 0} jobs`);
      
      // Test suggestions
      console.log('  🔍 Getting suggestions...');
      const suggestionsResponse = await axios.get(`${BASE_URL}/api/search/suggestions?q=${encodeURIComponent(query.split(' ')[0])}`);
      console.log(`  ✅ Found ${suggestionsResponse.data.suggestions?.length || 0} suggestions`);
      
    } catch (error) {
      console.error(`  ❌ Error testing query "${query}":`, error.response?.data?.error || error.message);
    }
  }

  console.log('\n🎉 Search API testing completed!');
}

// Run the test
testSearchEndpoints().catch(console.error);
