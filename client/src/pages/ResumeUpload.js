import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      handleFileUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setParsedData(response.data.data);
        toast.success('Resume uploaded and parsed successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleValidate = async () => {
    if (!uploadedFile) return;
    
    setIsParsing(true);
    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const response = await axios.post('/api/upload/resume/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setParsedData(response.data.data);
        toast.success(`Resume validated! Confidence: ${response.data.validation.confidence}%`);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(error.response?.data?.error || 'Failed to validate resume');
    } finally {
      setIsParsing(false);
    }
  };

  const downloadSampleResume = () => {
    const sampleData = `Name: John Doe
Email: john.doe@email.com
Phone: +91-98765-43210
Location: Bangalore, Karnataka

Skills:
- JavaScript (Expert)
- React (Advanced)
- Node.js (Advanced)
- MongoDB (Intermediate)
- Python (Beginner)

Experience:
5 years of experience as a Full Stack Developer

Education:
B.Tech in Computer Science from IIT Delhi (2018)`;
    
    const blob = new Blob([sampleData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-resume.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Your Resume
        </h1>
        <p className="text-lg text-gray-600">
          Let AI automatically extract your skills, experience, and education
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            
            {uploadedFile ? (
              <div className="space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    File Uploaded Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">{uploadedFile.name}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF and DOCX files up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="space-y-4">
              <button
                onClick={handleValidate}
                disabled={isParsing}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {isParsing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Validate & Parse Resume</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setParsedData(null);
                }}
                className="w-full btn-secondary"
              >
                Upload Different File
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Tips for Better Parsing</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use clear, structured formatting</li>
              <li>• Include all contact information</li>
              <li>• List skills with proficiency levels</li>
              <li>• Specify education institutions clearly</li>
              <li>• Include work experience with dates</li>
            </ul>
          </div>

          <button
            onClick={downloadSampleResume}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Sample Resume Format</span>
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Parsed Information
          </h3>

          {parsedData ? (
            <div className="space-y-6">
              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Personal Information</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{parsedData.name || 'Not detected'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{parsedData.email || 'Not detected'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{parsedData.phone || 'Not detected'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-gray-900">{parsedData.location || 'Not detected'}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-4">Skills</h4>
                {parsedData.skills && parsedData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          skill.level === 'expert' ? 'bg-red-100 text-red-800' :
                          skill.level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                          skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills detected</p>
                )}
              </div>

              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-4">Experience</h4>
                {parsedData.experience && parsedData.experience.total > 0 ? (
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {parsedData.experience.total} years of experience
                    </p>
                    {parsedData.experience.details && parsedData.experience.details.length > 0 && (
                      <div className="space-y-2">
                        {parsedData.experience.details.map((detail, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <strong>{detail.position}</strong> at {detail.company}
                            {detail.duration && ` • ${detail.duration}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No experience detected</p>
                )}
              </div>

              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-4">Education</h4>
                {parsedData.education && parsedData.education.length > 0 ? (
                  <div className="space-y-3">
                    {parsedData.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-primary-200 pl-4">
                        <div className="font-medium text-gray-900">{edu.level}</div>
                        {edu.field && <div className="text-gray-600">{edu.field}</div>}
                        {edu.institution && <div className="text-gray-600">{edu.institution}</div>}
                        {edu.graduationYear && <div className="text-gray-500">{edu.graduationYear}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No education detected</p>
                )}
              </div>

              <button className="w-full btn-primary">
                Create Candidate Profile
              </button>
            </div>
          ) : (
            <div className="card text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Resume Parsed Yet
              </h4>
              <p className="text-gray-600">
                Upload a resume to see the parsed information here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
