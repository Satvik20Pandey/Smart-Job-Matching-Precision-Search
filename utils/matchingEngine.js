const natural = require('natural');
const nlp = require('compromise');

class MatchingEngine {
  constructor() {
    this.tfidf = new natural.TfIdf();
    this.tokenizer = new natural.WordTokenizer();
  }

  preprocessText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  extractFilters(query) {
    const doc = nlp(query.toLowerCase());
    const filters = {};

    const skills = doc.match('#Noun+ (developer|engineer|programmer|analyst|manager)').out('array');
    if (skills.length > 0) {
      filters.skills = skills.map(s => s.replace(/\s+(developer|engineer|programmer|analyst|manager)/, ''));
    }

    const locations = doc.match('(in|from|at) #Place+').out('array');
    if (locations.length > 0) {
      filters.location = locations[0].replace(/(in|from|at)\s+/, '');
    }

    const experience = doc.match('#Number+ (year|years)').out('array');
    if (experience.length > 0) {
      const exp = experience[0].match(/#Number+/).out('array')[0];
      filters.experience = parseInt(exp);
    }

    const education = doc.match('(undergraduate|graduate|phd|bachelor|master)').out('array');
    if (education.length > 0) {
      filters.educationLevel = education[0];
    }

    const institutions = doc.match('(IIT|IIM|NIT|university|college)').out('array');
    if (institutions.length > 0) {
      filters.institution = institutions[0];
    }

    const salary = doc.match('(above|more than|over) #Number+ (LPA|lakh|lpa)').out('array');
    if (salary.length > 0) {
      const sal = salary[0].match(/#Number+/).out('array')[0];
      filters.minSalary = parseInt(sal);
    }

    const remote = doc.match('remote').out('array');
    if (remote.length > 0) {
      filters.remote = true;
    }

    const immediate = doc.match('(immediately|immediate|join now)').out('array');
    if (immediate.length > 0) {
      filters.immediateJoining = true;
    }

    return filters;
  }

  calculateTFIDF(text, corpus) {
    this.tfidf.addDocument(text);
    corpus.forEach(doc => this.tfidf.addDocument(doc));
    
    const scores = {};
    this.tfidf.listTerms(0).forEach(item => {
      scores[item.term] = item.score;
    });
    
    this.tfidf.reset();
    return scores;
  }

  cosineSimilarity(vec1, vec2) {
    if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  semanticSearch(query, documents, topK = 10) {
    const queryText = this.preprocessText(query);
    const queryTokens = this.tokenizer.tokenize(queryText);
    
    const scores = documents.map((doc, index) => {
      const docText = this.preprocessText(doc.text || doc.description || '');
      const docTokens = this.tokenizer.tokenize(docText);
      
      const queryTFIDF = this.calculateTFIDF(queryText, [docText]);
      const docTFIDF = this.calculateTFIDF(docText, [queryText]);
      
      let similarity = 0;
      queryTokens.forEach(token => {
        if (docTokens.includes(token)) {
          similarity += (queryTFIDF[token] || 0) * (docTFIDF[token] || 0);
        }
      });
      
      return { index, score: similarity, document: doc };
    });
    
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(item => item.score > 0);
  }

  applyStrictFilters(results, filters) {
    return results.filter(result => {
      const doc = result.document;
      
      if (filters.skills && filters.skills.length > 0) {
        const docSkills = doc.skills || doc.requirements?.skills || [];
        if (!filters.skills.some(skill => 
          docSkills.some(ds => ds.toLowerCase().includes(skill.toLowerCase()) || 
          (typeof ds === 'object' && ds.name && ds.name.toLowerCase().includes(skill.toLowerCase())))
        )) {
          return false;
        }
      }
      
      if (filters.location) {
        if (!doc.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }
      
      if (filters.experience) {
        const docExp = doc.experience?.total || doc.requirements?.experience?.min || 0;
        if (docExp < filters.experience) {
          return false;
        }
      }
      
      if (filters.educationLevel) {
        const docEdu = doc.education || doc.requirements?.education;
        if (docEdu) {
          const hasLevel = Array.isArray(docEdu) 
            ? docEdu.some(edu => edu.level?.toLowerCase().includes(filters.educationLevel.toLowerCase()))
            : docEdu.level?.toLowerCase().includes(filters.educationLevel.toLowerCase());
          if (!hasLevel) return false;
        }
      }
      
      if (filters.institution) {
        const docEdu = doc.education || doc.requirements?.education;
        if (docEdu) {
          const hasInstitution = Array.isArray(docEdu)
            ? docEdu.some(edu => edu.institution?.toLowerCase().includes(filters.institution.toLowerCase()))
            : docEdu.institution?.toLowerCase().includes(filters.institution.toLowerCase());
          if (!hasInstitution) return false;
        }
      }
      
      if (filters.minSalary) {
        const docSalary = doc.salary?.min || doc.expectedSalary?.min || 0;
        if (docSalary < filters.minSalary) {
          return false;
        }
      }
      
      if (filters.remote !== undefined) {
        if (doc.remote !== filters.remote) {
          return false;
        }
      }
      
      if (filters.immediateJoining) {
        if (doc.immediateJoining !== true && doc.availability !== 'immediate') {
          return false;
        }
      }
      
      return true;
    });
  }

  hybridSearch(query, documents, topK = 20) {
    const filters = this.extractFilters(query);
    const semanticResults = this.semanticSearch(query, documents, topK * 2);
    const filteredResults = this.applyStrictFilters(semanticResults, filters);
    
    return {
      results: filteredResults.slice(0, topK),
      filters: filters,
      totalFound: filteredResults.length,
      semanticScore: semanticResults.length > 0 ? semanticResults[0].score : 0
    };
  }
}

module.exports = new MatchingEngine();
