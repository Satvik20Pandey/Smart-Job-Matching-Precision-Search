const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');

class ResumeParser {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.skillKeywords = [
      'javascript', 'python', 'java', 'react', 'node.js', 'mongodb', 'sql', 'aws',
      'docker', 'kubernetes', 'git', 'html', 'css', 'typescript', 'angular', 'vue',
      'express', 'django', 'flask', 'spring', 'hibernate', 'junit', 'maven', 'gradle',
      'npm', 'yarn', 'webpack', 'babel', 'jest', 'mocha', 'selenium', 'jenkins',
      'terraform', 'ansible', 'linux', 'unix', 'agile', 'scrum', 'kanban', 'jira',
      'confluence', 'slack', 'teams', 'zoom', 'figma', 'sketch', 'photoshop',
      'illustrator', 'invision', 'zeplin', 'storybook', 'cypress', 'playwright'
    ];
    
    this.educationKeywords = [
      'bachelor', 'master', 'phd', 'b.tech', 'b.e', 'b.sc', 'm.tech', 'm.e', 'm.sc',
      'mba', 'bca', 'mca', 'diploma', 'certification', 'course', 'training'
    ];
    
    this.institutionKeywords = [
      'iit', 'iim', 'nit', 'university', 'college', 'institute', 'school'
    ];
  }

  async parsePDF(buffer) {
    try {
      const data = await pdfParse(buffer);
      return this.extractFields(data.text);
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  async parseDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return this.extractFields(result.value);
    } catch (error) {
      throw new Error(`DOCX parsing failed: ${error.message}`);
    }
  }

  extractFields(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    return {
      name: this.extractName(lines),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      location: this.extractLocation(lines)
    };
  }

  extractName(lines) {
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line.length > 3 && line.length < 50 && 
          /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(line)) {
        return line;
      }
    }
    return '';
  }

  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex);
    return emails ? emails[0] : '';
  }

  extractPhone(text) {
    const phoneRegex = /(\+?[\d\s\-\(\)]{10,})/g;
    const phones = text.match(phoneRegex);
    return phones ? phones[0].replace(/[\s\-\(\)]/g, '') : '';
  }

  extractSkills(text) {
    const lowerText = text.toLowerCase();
    const foundSkills = [];
    
    this.skillKeywords.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push({
          name: skill,
          level: this.determineSkillLevel(lowerText, skill)
        });
      }
    });
    
    return foundSkills;
  }

  determineSkillLevel(text, skill) {
    const skillIndex = text.indexOf(skill);
    const context = text.substring(Math.max(0, skillIndex - 100), skillIndex + 100);
    
    if (context.includes('expert') || context.includes('senior') || context.includes('lead')) {
      return 'expert';
    } else if (context.includes('advanced') || context.includes('proficient')) {
      return 'advanced';
    } else if (context.includes('intermediate') || context.includes('moderate')) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }

  extractExperience(text) {
    const experienceRegex = /(\d+)\s*(?:year|years?|yr|yrs?)\s*(?:of\s*)?experience/gi;
    const matches = text.match(experienceRegex);
    
    if (matches) {
      const years = parseInt(matches[0].match(/\d+/)[0]);
      return {
        total: years,
        details: this.extractExperienceDetails(text)
      };
    }
    
    return { total: 0, details: [] };
  }

  extractExperienceDetails(text) {
    const details = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('experience') || line.includes('work') || line.includes('employment')) {
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const detailLine = lines[j];
          if (detailLine.length > 10 && detailLine.length < 200) {
            details.push({
              company: this.extractCompany(detailLine),
              position: this.extractPosition(detailLine),
              duration: this.extractDuration(detailLine),
              description: detailLine,
              skills: this.extractSkills(detailLine)
            });
            break;
          }
        }
      }
    }
    
    return details.slice(0, 3);
  }

  extractCompany(text) {
    const companyPatterns = [
      /at\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.|$)/i,
      /with\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.|$)/i,
      /([A-Z][a-zA-Z\s&]+?)\s+(?:inc|corp|company|ltd|llc)/i
    ];
    
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  }

  extractPosition(text) {
    const positionPatterns = [
      /(?:as\s+)?([A-Z][a-zA-Z\s]+?(?:developer|engineer|manager|analyst|consultant))/i,
      /(?:position[:\s]+)([A-Z][a-zA-Z\s]+)/i
    ];
    
    for (const pattern of positionPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  }

  extractDuration(text) {
    const durationPatterns = [
      /(\d{4}\s*-\s*\d{4})/,
      /(\d{4}\s*to\s*\d{4})/,
      /(\d+\s*(?:month|year)s?)/i
    ];
    
    for (const pattern of durationPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  }

  extractEducation(text) {
    const education = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (this.educationKeywords.some(keyword => line.includes(keyword))) {
        const eduLine = lines[i];
        if (eduLine.length > 10) {
          education.push({
            level: this.extractEducationLevel(eduLine),
            field: this.extractEducationField(eduLine),
            institution: this.extractInstitution(eduLine),
            graduationYear: this.extractGraduationYear(eduLine),
            gpa: this.extractGPA(eduLine),
            fullTime: this.isFullTime(eduLine)
          });
        }
      }
    }
    
    return education.slice(0, 3);
  }

  extractEducationLevel(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('phd') || lowerText.includes('doctorate')) return 'PhD';
    if (lowerText.includes('master') || lowerText.includes('m.tech') || lowerText.includes('mba')) return 'Masters';
    if (lowerText.includes('bachelor') || lowerText.includes('b.tech') || lowerText.includes('b.e')) return 'Bachelors';
    if (lowerText.includes('diploma')) return 'Diploma';
    return 'Other';
  }

  extractEducationField(text) {
    const fieldPatterns = [
      /(?:in|of)\s+([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|$)/i,
      /([A-Z][a-zA-Z\s]+?)\s+(?:engineering|science|arts|commerce|technology)/i
    ];
    
    for (const pattern of fieldPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return '';
  }

  extractInstitution(text) {
    for (const keyword of this.institutionKeywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        const words = text.split(/\s+/);
        const keywordIndex = words.findIndex(word => 
          word.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (keywordIndex !== -1) {
          let institution = '';
          for (let i = Math.max(0, keywordIndex - 2); i <= keywordIndex + 2; i++) {
            if (words[i]) {
              institution += words[i] + ' ';
            }
          }
          return institution.trim();
        }
      }
    }
    return '';
  }

  extractGraduationYear(text) {
    const yearPattern = /\b(19|20)\d{2}\b/;
    const match = text.match(yearPattern);
    return match ? parseInt(match[0]) : null;
  }

  extractGPA(text) {
    const gpaPattern = /(?:gpa|grade|score)[:\s]*(\d+\.?\d*)/i;
    const match = text.match(gpaPattern);
    return match ? parseFloat(match[1]) : null;
  }

  isFullTime(text) {
    const lowerText = text.toLowerCase();
    return !lowerText.includes('part-time') && !lowerText.includes('online') && !lowerText.includes('distance');
  }

  extractLocation(lines) {
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('location') || line.includes('address') || line.includes('based')) {
        const nextLine = lines[i + 1];
        if (nextLine && nextLine.length > 3 && nextLine.length < 100) {
          return nextLine.trim();
        }
      }
    }
    return '';
  }
}

module.exports = new ResumeParser();
