const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const demoCandidates = [
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91-98765-43210",
    location: "Mumbai, Maharashtra",
    skills: [
      { name: "Java", level: "expert" },
      { name: "Spring Boot", level: "advanced" },
      { name: "Microservices", level: "advanced" },
      { name: "Docker", level: "intermediate" }
    ],
    experience: {
      total: 6,
      details: [
        {
          company: "TechCorp India",
          position: "Senior Java Developer",
          duration: "2020-2023",
          description: "Led development of microservices architecture",
          skills: ["Java", "Spring Boot", "Microservices"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Computer Science",
        institution: "IIT Bombay",
        graduationYear: 2017,
        gpa: 8.5,
        fullTime: true
      }
    ],
    availability: "immediate",
    expectedSalary: { min: 25, max: 35, currency: "INR" }
  },
  {
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91-87654-32109",
    location: "Bangalore, Karnataka",
    skills: [
      { name: "Python", level: "expert" },
      { name: "Machine Learning", level: "advanced" },
      { name: "TensorFlow", level: "advanced" },
      { name: "Data Science", level: "expert" }
    ],
    experience: {
      total: 4,
      details: [
        {
          company: "AI Solutions Ltd",
          position: "ML Engineer",
          duration: "2021-2023",
          description: "Developed recommendation systems and predictive models",
          skills: ["Python", "Machine Learning", "TensorFlow"]
        }
      ]
    },
    education: [
      {
        level: "Masters",
        field: "Data Science",
        institution: "IIT Delhi",
        graduationYear: 2020,
        gpa: 8.8,
        fullTime: true
      }
    ],
    availability: "2-weeks",
    expectedSalary: { min: 20, max: 30, currency: "INR" }
  },
  {
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91-76543-21098",
    location: "Pune, Maharashtra",
    skills: [
      { name: "React", level: "advanced" },
      { name: "Node.js", level: "intermediate" },
      { name: "JavaScript", level: "expert" },
      { name: "MongoDB", level: "intermediate" }
    ],
    experience: {
      total: 3,
      details: [
        {
          company: "WebTech Solutions",
          position: "Frontend Developer",
          duration: "2021-2023",
          description: "Built responsive web applications using React",
          skills: ["React", "JavaScript", "HTML", "CSS"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Information Technology",
        institution: "JIIT Noida",
        graduationYear: 2020,
        gpa: 7.8,
        fullTime: true
      }
    ],
    availability: "1-month",
    expectedSalary: { min: 15, max: 25, currency: "INR" }
  },
  {
    name: "Neha Singh",
    email: "neha.singh@email.com",
    phone: "+91-65432-10987",
    location: "Hyderabad, Telangana",
    skills: [
      { name: "DevOps", level: "advanced" },
      { name: "AWS", level: "expert" },
      { name: "Kubernetes", level: "intermediate" },
      { name: "Jenkins", level: "advanced" }
    ],
    experience: {
      total: 5,
      details: [
        {
          company: "CloudTech Inc",
          position: "DevOps Engineer",
          duration: "2019-2023",
          description: "Managed cloud infrastructure and CI/CD pipelines",
          skills: ["AWS", "DevOps", "Jenkins", "Docker"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Computer Engineering",
        institution: "SRM University",
        graduationYear: 2018,
        gpa: 8.2,
        fullTime: true
      }
    ],
    availability: "negotiable",
    expectedSalary: { min: 22, max: 32, currency: "INR" }
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.malhotra@email.com",
    phone: "+91-54321-09876",
    location: "Chennai, Tamil Nadu",
    skills: [
      { name: "C++", level: "expert" },
      { name: "System Design", level: "advanced" },
      { name: "Linux", level: "advanced" },
      { name: "Embedded Systems", level: "intermediate" }
    ],
    experience: {
      total: 7,
      details: [
        {
          company: "Embedded Solutions",
          position: "Senior System Engineer",
          duration: "2018-2023",
          description: "Designed and developed embedded systems",
          skills: ["C++", "System Design", "Linux"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Electronics & Communication",
        institution: "IIT Madras",
        graduationYear: 2016,
        gpa: 8.7,
        fullTime: true
      }
    ],
    availability: "3-months",
    expectedSalary: { min: 28, max: 40, currency: "INR" }
  },
  {
    name: "Anjali Desai",
    email: "anjali.desai@email.com",
    phone: "+91-43210-98765",
    location: "Gurgaon, Haryana",
    skills: [
      { name: "Angular", level: "advanced" },
      { name: "TypeScript", level: "intermediate" },
      { name: "UI/UX Design", level: "expert" },
      { name: "Figma", level: "advanced" }
    ],
    experience: {
      total: 4,
      details: [
        {
          company: "DesignTech Solutions",
          position: "UI/UX Developer",
          duration: "2020-2023",
          description: "Created user-friendly interfaces and improved user experience",
          skills: ["Angular", "UI/UX Design", "Figma"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Computer Science",
        institution: "VIT Vellore",
        graduationYear: 2019,
        gpa: 8.1,
        fullTime: true
      }
    ],
    availability: "immediate",
    expectedSalary: { min: 18, max: 28, currency: "INR" }
  },
  {
    name: "Rajesh Verma",
    email: "rajesh.verma@email.com",
    phone: "+91-32109-87654",
    location: "Noida, Uttar Pradesh",
    skills: [
      { name: "Python", level: "intermediate" },
      { name: "Django", level: "advanced" },
      { name: "PostgreSQL", level: "intermediate" },
      { name: "REST APIs", level: "advanced" }
    ],
    experience: {
      total: 2,
      details: [
        {
          company: "StartupXYZ",
          position: "Backend Developer",
          duration: "2022-2023",
          description: "Developed RESTful APIs and database models",
          skills: ["Python", "Django", "PostgreSQL"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Computer Science",
        institution: "BITS Pilani",
        graduationYear: 2021,
        gpa: 7.9,
        fullTime: true
      }
    ],
    availability: "2-weeks",
    expectedSalary: { min: 12, max: 20, currency: "INR" }
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91-21098-76543",
    location: "Bangalore, Karnataka",
    skills: [
      { name: "Data Analysis", level: "expert" },
      { name: "SQL", level: "advanced" },
      { name: "Tableau", level: "advanced" },
      { name: "Python", level: "intermediate" }
    ],
    experience: {
      total: 6,
      details: [
        {
          company: "Analytics Corp",
          position: "Senior Data Analyst",
          duration: "2019-2023",
          description: "Analyzed business data and created insights",
          skills: ["Data Analysis", "SQL", "Tableau"]
        }
      ]
    },
    education: [
      {
        level: "Masters",
        field: "Business Analytics",
        institution: "IIT Kanpur",
        graduationYear: 2019,
        gpa: 8.4,
        fullTime: true
      }
    ],
    availability: "1-month",
    expectedSalary: { min: 24, max: 34, currency: "INR" }
  },
  {
    name: "Karan Mehta",
    email: "karan.mehta@email.com",
    phone: "+91-10987-65432",
    location: "Mumbai, Maharashtra",
    skills: [
      { name: "Mobile Development", level: "expert" },
      { name: "React Native", level: "advanced" },
      { name: "iOS", level: "intermediate" },
      { name: "Android", level: "advanced" }
    ],
    experience: {
      total: 5,
      details: [
        {
          company: "MobileTech Solutions",
          position: "Mobile App Developer",
          duration: "2019-2023",
          description: "Developed cross-platform mobile applications",
          skills: ["React Native", "Mobile Development", "Android"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Computer Science",
        institution: "IIT Roorkee",
        graduationYear: 2018,
        gpa: 8.3,
        fullTime: true
      }
    ],
    availability: "negotiable",
    expectedSalary: { min: 20, max: 30, currency: "INR" }
  },
  {
    name: "Pooja Gupta",
    email: "pooja.gupta@email.com",
    phone: "+91-09876-54321",
    location: "Delhi, NCR",
    skills: [
      { name: "Cybersecurity", level: "expert" },
      { name: "Network Security", level: "advanced" },
      { name: "Penetration Testing", level: "advanced" },
      { name: "Linux", level: "intermediate" }
    ],
    experience: {
      total: 4,
      details: [
        {
          company: "SecureNet Solutions",
          position: "Security Engineer",
          duration: "2020-2023",
          description: "Implemented security measures and conducted security audits",
          skills: ["Cybersecurity", "Network Security", "Penetration Testing"]
        }
      ]
    },
    education: [
      {
        level: "Bachelors",
        field: "Information Security",
        institution: "NSIT Delhi",
        graduationYear: 2020,
        gpa: 8.0,
        fullTime: true
      }
    ],
    availability: "immediate",
    expectedSalary: { min: 18, max: 28, currency: "INR" }
  }
];

const demoJobs = [
  {
    title: "Senior Java Developer",
    company: "TechCorp India",
    location: "Mumbai, Maharashtra",
    description: "We are looking for a senior Java developer with expertise in Spring Boot and microservices architecture. The ideal candidate should have strong experience in building scalable applications.",
    requirements: {
      skills: ["Java", "Spring Boot", "Microservices", "Docker"],
      experience: { min: 5, max: 8 },
      education: {
        level: "Bachelors",
        field: "Computer Science",
        institution: "IIT"
      }
    },
    salary: { min: 25, max: 35, currency: "INR" },
    jobType: "full-time",
    remote: false,
    immediateJoining: true
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Solutions Ltd",
    location: "Bangalore, Karnataka",
    description: "Join our AI team to develop cutting-edge machine learning models. Experience with TensorFlow, PyTorch, and data science is required.",
    requirements: {
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
      experience: { min: 3, max: 6 },
      education: {
        level: "Masters",
        field: "Data Science",
        institution: "IIT"
      }
    },
    salary: { min: 20, max: 30, currency: "INR" },
    jobType: "full-time",
    remote: true,
    immediateJoining: false
  },
  {
    title: "Frontend Developer",
    company: "WebTech Solutions",
    location: "Pune, Maharashtra",
    description: "We need a skilled frontend developer proficient in React and modern JavaScript. Experience with responsive design and UI/UX is a plus.",
    requirements: {
      skills: ["React", "JavaScript", "HTML", "CSS"],
      experience: { min: 2, max: 5 },
      education: {
        level: "Bachelors",
        field: "Information Technology",
        institution: "Any"
      }
    },
    salary: { min: 15, max: 25, currency: "INR" },
    jobType: "full-time",
    remote: false,
    immediateJoining: true
  },
  {
    title: "DevOps Engineer",
    company: "CloudTech Inc",
    location: "Hyderabad, Telangana",
    description: "Join our DevOps team to manage cloud infrastructure and CI/CD pipelines. AWS experience is mandatory.",
    requirements: {
      skills: ["DevOps", "AWS", "Jenkins", "Docker"],
      experience: { min: 4, max: 7 },
      education: {
        level: "Bachelors",
        field: "Computer Engineering",
        institution: "Any"
      }
    },
    salary: { min: 22, max: 32, currency: "INR" },
    jobType: "full-time",
    remote: true,
    immediateJoining: false
  },
  {
    title: "System Engineer",
    company: "Embedded Solutions",
    location: "Chennai, Tamil Nadu",
    description: "We are looking for a system engineer with expertise in C++ and embedded systems. Experience with Linux and system design is required.",
    requirements: {
      skills: ["C++", "System Design", "Linux", "Embedded Systems"],
      experience: { min: 6, max: 9 },
      education: {
        level: "Bachelors",
        field: "Electronics & Communication",
        institution: "IIT"
      }
    },
    salary: { min: 28, max: 40, currency: "INR" },
    jobType: "full-time",
    remote: false,
    immediateJoining: false
  }
];

async function populateDatabase() {
  console.log('🚀 Populating database with demo data...\n');

  try {
    // Create candidates
    console.log('📝 Creating demo candidates...');
    for (const candidate of demoCandidates) {
      try {
        const response = await axios.post(`${BASE_URL}/api/candidates`, candidate);
        console.log(`✅ Created candidate: ${response.data.name}`);
      } catch (error) {
        console.log(`⚠️  Candidate ${candidate.name} already exists or error: ${error.response?.data?.error || error.message}`);
      }
    }

    // Create jobs
    console.log('\n💼 Creating demo jobs...');
    for (const job of demoJobs) {
      try {
        const response = await axios.post(`${BASE_URL}/api/jobs`, job);
        console.log(`✅ Created job: ${response.data.title} at ${response.data.company}`);
      } catch (error) {
        console.log(`⚠️  Job ${job.title} already exists or error: ${error.response?.data?.error || error.message}`);
      }
    }

    console.log('\n🎉 Database population completed!');
    console.log('\n📊 Demo Data Summary:');
    console.log(`- Candidates: ${demoCandidates.length} (5 IIT graduates, 5 other colleges)`);
    console.log(`- Jobs: ${demoJobs.length} (various requirements and locations)`);
    console.log('\n🧪 Now you can test:');
    console.log('- Search queries like "IIT undergraduates for software engineering"');
    console.log('- Precision filtering for specific criteria');
    console.log('- Resume upload and profile creation');
    console.log('- Job and candidate matching');

  } catch (error) {
    console.error('❌ Error populating database:', error.message);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  populateDatabase();
}

module.exports = { populateDatabase, demoCandidates, demoJobs };
