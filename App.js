import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Optional: For extra custom styling if you want

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [cvId, setCvId] = useState(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('⚠️ Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    try {
      setMessage('Uploading...');
      const response = await axios.post('http://127.0.0.1:8000/api/cv/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('✅ File uploaded successfully!');
      setCvId(response.data.cv_id);
    } catch (error) {
      console.error(error);
      setMessage('❌ File upload failed.');
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!cvId) {
      setAnswer('⚠️ Please upload your CV first.');
      return;
    }
    if (!question.trim()) {
      setAnswer('⚠️ Please type a valid question.');
      return;
    }

    try {
      setLoading(true);
      setAnswer('');
      const response = await axios.post('http://127.0.0.1:8000/api/cv/chat/', {
        question: question,
        cv_id: cvId,
      });
      setAnswer(response.data.answer || "No answer found.");
    } catch (error) {
      console.error(error);
      setAnswer('❌ Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📄 CV Assistant</h1>

      <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Upload Your CV</h2>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <br /><br />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Upload
          </button>
        </form>
        {message && <p style={{ marginTop: '15px' }}>{message}</p>}
      </div>

      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Ask a Question</h2>
        <form onSubmit={handleAskQuestion}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <br /><br />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {loading && <p style={{ marginTop: '15px' }}>⏳ Generating Answer...</p>}

        {answer && (
          <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <h3>📝 Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
