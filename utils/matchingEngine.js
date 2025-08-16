const natural = require('natural');
const nlp = require('compromise');

class MatchingEngine {
  constructor() {
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

    // Extract skills with better patterns
    const skillPatterns = [
      '#Noun+ (developer|engineer|programmer|analyst|manager|specialist)',
      '(python|java|javascript|react|node|angular|vue|mongodb|sql|aws|docker|kubernetes)',
      'software engineering|web development|mobile development|data science|machine learning'
    ];
    
    for (const pattern of skillPatterns) {
      const skills = doc.match(pattern).out('array');
      if (skills.length > 0) {
        filters.skills = skills.map(s => s.replace(/\s+(developer|engineer|programmer|analyst|manager|specialist)/, ''));
        break;
      }
    }

    // Extract locations
    const locations = doc.match('(in|from|at|for) #Place+').out('array');
    if (locations.length > 0) {
      filters.location = locations[0].replace(/(in|from|at|for)\s+/, '');
    }

    // Extract experience requirements
    const experience = doc.match('#Number+ (year|years|yr|yrs)').out('array');
    if (experience.length > 0) {
      const exp = experience[0].match(/#Number+/).out('array')[0];
      filters.experience = parseInt(exp);
    }

    // Extract education level
    const educationLevels = doc.match('(undergraduate|graduate|phd|bachelor|master|b.tech|m.tech|b.e|m.e)').out('array');
    if (educationLevels.length > 0) {
      const level = educationLevels[0];
      if (level.includes('b.tech') || level.includes('b.e') || level.includes('bachelor')) {
        filters.educationLevel = 'Bachelors';
      } else if (level.includes('m.tech') || level.includes('m.e') || level.includes('master')) {
        filters.educationLevel = 'Masters';
      } else if (level.includes('phd')) {
        filters.educationLevel = 'PhD';
      } else {
        filters.educationLevel = level;
      }
    }

    // Extract institutions (IIT, IIM, etc.)
    const institutions = doc.match('(iit|iim|nit|university|college|institute|bits|srm|vit|jiit)').out('array');
    if (institutions.length > 0) {
      filters.institution = institutions[0];
    }

    // Extract salary requirements
    const salary = doc.match('(above|more than|over|paying) #Number+ (lpa|lakh|lpa|salary)').out('array');
    if (salary.length > 0) {
      const sal = salary[0].match(/#Number+/).out('array')[0];
      filters.minSalary = parseInt(sal);
    }

    // Extract remote preference
    const remote = doc.match('remote|work from home|wfh').out('array');
    if (remote.length > 0) {
      filters.remote = true;
    }

    // Extract immediate joining preference
    const immediate = doc.match('(immediately|immediate|join now|urgent|asap)').out('array');
    if (immediate.length > 0) {
      filters.immediateJoining = true;
    }

    return filters;
  }

  calculateTFIDF(text, corpus) {
    const tfidf = new natural.TfIdf();
    
    // Add the query text
    tfidf.addDocument(text);
    
    // Add corpus documents
    corpus.forEach(doc => tfidf.addDocument(doc));
    
    const scores = {};
    try {
      const terms = tfidf.listTerms(0);
      terms.forEach(item => {
        scores[item.term] = item.score;
      });
    } catch (error) {
      // Fallback if listTerms fails
      const words = this.tokenizer.tokenize(text);
      words.forEach(word => {
        if (word.length > 2) {
          scores[word] = 1;
        }
      });
    }
    
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
      // Create a comprehensive text representation of the document
      const docText = this.preprocessText(
        (doc.text || '') + ' ' + 
        (doc.description || '') + ' ' + 
        (doc.title || '') + ' ' + 
        (doc.name || '') + ' ' +
        (doc.skills ? doc.skills.map(s => typeof s === 'string' ? s : s.name).join(' ') : '') + ' ' +
        (doc.requirements?.skills ? doc.requirements.skills.join(' ') : '') + ' ' +
        (doc.location || '') + ' ' +
        (doc.company || '')
      );
      
      const docTokens = this.tokenizer.tokenize(docText);
      
      // Calculate similarity based on token overlap and exact matches
      let similarity = 0;
      let totalScore = 0;
      
      queryTokens.forEach(token => {
        if (token.length > 2) {
          // Exact match gets highest score
          if (docTokens.includes(token)) {
            similarity += 3;
          } else {
            // Check for partial matches
            const partialMatches = docTokens.filter(docToken => 
              docToken.includes(token) || token.includes(docToken)
            );
            if (partialMatches.length > 0) {
              similarity += 1;
            }
          }
          totalScore += 1;
        }
      });
      
      // Normalize score
      const finalScore = totalScore > 0 ? similarity / totalScore : 0;
      
      return { index, score: finalScore, document: doc };
    });
    
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(item => item.score > 0);
  }

  applyStrictFilters(results, filters) {
    return results.filter(result => {
      const doc = result.document;
      
      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        const docSkills = doc.skills || doc.requirements?.skills || [];
        const docSkillNames = docSkills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase());
        
        if (!filters.skills.some(skill => 
          docSkillNames.some(ds => ds.includes(skill.toLowerCase()))
        )) {
          return false;
        }
      }
      
      // Location filter
      if (filters.location) {
        const docLocation = (doc.location || '').toLowerCase();
        if (!docLocation.includes(filters.location.toLowerCase())) {
          return false;
        }
      }
      
      // Experience filter
      if (filters.experience) {
        const docExp = doc.experience?.total || doc.requirements?.experience?.min || 0;
        if (docExp < filters.experience) {
          return false;
        }
      }
      
      // Education level filter
      if (filters.educationLevel) {
        const docEdu = doc.education || doc.requirements?.education;
        if (docEdu) {
          const hasLevel = Array.isArray(docEdu) 
            ? docEdu.some(edu => edu.level?.toLowerCase().includes(filters.educationLevel.toLowerCase()))
            : docEdu.level?.toLowerCase().includes(filters.educationLevel.toLowerCase());
          if (!hasLevel) return false;
        }
      }
      
      // Institution filter
      if (filters.institution) {
        const docEdu = doc.education || doc.requirements?.education;
        if (docEdu) {
          const hasInstitution = Array.isArray(docEdu)
            ? docEdu.some(edu => edu.institution?.toLowerCase().includes(filters.institution.toLowerCase()))
            : docEdu.institution?.toLowerCase().includes(filters.institution.toLowerCase());
          if (!hasInstitution) return false;
        }
      }
      
      // Salary filter
      if (filters.minSalary) {
        const docSalary = doc.salary?.min || doc.expectedSalary?.min || 0;
        if (docSalary < filters.minSalary) {
          return false;
        }
      }
      
      // Remote filter
      if (filters.remote !== undefined) {
        if (doc.remote !== filters.remote) {
          return false;
        }
      }
      
      // Immediate joining filter
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
    console.log('Extracted filters:', filters); // Debug log
    
    const semanticResults = this.semanticSearch(query, documents, topK * 2);
    console.log('Semantic results count:', semanticResults.length); // Debug log
    
    const filteredResults = this.applyStrictFilters(semanticResults, filters);
    console.log('Filtered results count:', filteredResults.length); // Debug log
    
    return {
      results: filteredResults.slice(0, topK),
      filters: filters,
      totalFound: filteredResults.length,
      semanticScore: semanticResults.length > 0 ? semanticResults[0].score : 0
    };
  }
}

module.exports = new MatchingEngine();
