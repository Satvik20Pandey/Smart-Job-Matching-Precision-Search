const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Smart Job Matcher API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health check passed:', health.data.message);

    // Test 2: Create a sample job
    console.log('\n2. Testing job creation...');
    const jobData = {
      title: 'Senior Python Developer',
      company: 'TechCorp India',
      location: 'Bangalore, Karnataka',
      description: 'We are looking for a senior Python developer with expertise in Django and React.',
      requirements: {
        skills: ['Python', 'Django', 'React', 'MongoDB'],
        experience: { min: 5, max: 8 },
        education: {
          level: 'Bachelors',
          field: 'Computer Science',
          institution: 'IIT Delhi'
        }
      },
      salary: { min: 25, max: 35, currency: 'INR' },
      jobType: 'full-time',
      remote: false
    };

    const jobResponse = await axios.post(`${BASE_URL}/api/jobs`, jobData);
    console.log('✅ Job created:', jobResponse.data.title);

    // Test 3: Test AI search
    console.log('\n3. Testing AI-powered search...');
    const searchQuery = 'Python developers in Bangalore with 5+ years experience';
    const searchResponse = await axios.post(`${BASE_URL}/api/search/jobs`, { query: searchQuery });
    console.log('✅ Search completed. Found:', searchResponse.data.totalFound, 'jobs');
    console.log('   Applied filters:', searchResponse.data.appliedFilters);

    // Test 4: Test precision filtering
    console.log('\n4. Testing precision filtering...');
    const filterQuery = 'Only candidates with IIT education';
    const filterResponse = await axios.post(`${BASE_URL}/api/search/candidates`, { query: filterQuery });
    console.log('✅ Filtering completed. Applied filters:', filterResponse.data.appliedFilters);

    // Test 5: Test suggestions
    console.log('\n5. Testing search suggestions...');
    const suggestionsResponse = await axios.get(`${BASE_URL}/api/search/suggestions?q=Python`);
    console.log('✅ Suggestions generated:', suggestionsResponse.data.suggestions.length, 'items');

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- Health check: ✅');
    console.log('- Job creation: ✅');
    console.log('- AI search: ✅');
    console.log('- Precision filtering: ✅');
    console.log('- Search suggestions: ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
