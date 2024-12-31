"use client";

import { useState, useEffect, useRef } from 'react';
import { Container, Box, Button, TextField, Typography, Paper, CircularProgress, Avatar, IconButton } from '@mui/material';
import { Upload as UploadIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon, Clear as ClearIcon } from '@mui/icons-material';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light'); // Light or dark theme

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setLoading(true);
    setError('');

    try {
      for (const file of uploadedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/upload/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Upload failed');
        }

        const result = await response.json();
        console.log('Upload response:', result);
        setFiles(prev => [...prev, file.name]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(`Upload failed: ${error.message}`);
    }

    setLoading(false);
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: query }]);
    setLoading(true);
    setError('');

    try {
      console.log('Sending query:', query);
      const response = await fetch('http://localhost:8000/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Query failed');
      }

      const data = await response.json();
      console.log('Query response:', data);

      if (!data.answer) {
        throw new Error('No answer received from server');
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.answer,
        sources: data.sources
      }]);
    } catch (error) {
      console.error('Error querying:', error);
      setError(`Query failed: ${error.message}`);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme === 'light' ? 'linear-gradient(135deg, #f0f4f8, #e2e8f0)' : 'linear-gradient(135deg, #1e293b, #0f172a)', // Gradient background
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: '300px',
          bgcolor: theme === 'light' ? '#ffffff' : '#334155',
          borderRight: '1px solid #e2e8f0',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" sx={{ color: theme === 'light' ? '#334155' : '#f8fafc', fontWeight: 600 }}>
          PDF Q&A System
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={loading}
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': {
                bgcolor: '#2563eb',
              },
              textTransform: 'none',
              borderRadius: '8px',
              py: 1.5
            }}
          >
            Upload PDFs
            <input
              type="file"
              hidden
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="outlined"
            onClick={toggleTheme}
            startIcon={theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            sx={{
              borderColor: theme === 'light' ? '#e2e8f0' : '#64748b',
              color: theme === 'light' ? '#64748b' : '#f8fafc',
              '&:hover': {
                borderColor: '#94a3b8',
              },
              textTransform: 'none',
              borderRadius: '8px',
              py: 1.5
            }}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>

          <Button
            variant="outlined"
            onClick={clearChat}
            startIcon={<ClearIcon />}
            sx={{
              borderColor: theme === 'light' ? '#e2e8f0' : '#64748b',
              color: theme === 'light' ? '#64748b' : '#f8fafc',
              '&:hover': {
                borderColor: '#94a3b8',
              },
              textTransform: 'none',
              borderRadius: '8px',
              py: 1.5
            }}
          >
            Clear Chat
          </Button>
        </Box>

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: theme === 'light' ? '#64748b' : '#94a3b8', mb: 1 }}>
              Uploaded Files:
            </Typography>
            {files.map((file, index) => (
              <Typography key={index} variant="body2" sx={{ color: theme === 'light' ? '#334155' : '#f8fafc' }}>
                {file}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          maxWidth: 'calc(100% - 300px)',
          height: '100vh'
        }}
      >
        <Box
          sx={{
            flex: 1,
            bgcolor: theme === 'light' ? '#ffffff' : '#334155',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            p: 2
          }}
        >
          <Box
            ref={chatContainerRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: message.type === 'user' ? '#3b82f6' : (theme === 'light' ? '#f8fafc' : '#475569'),
                    borderRadius: message.type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    maxWidth: '80%'
                  }}
                >
                  <Typography sx={{ color: message.type === 'user' ? '#ffffff' : (theme === 'light' ? '#334155' : '#f8fafc'), lineHeight: 1.6 }}>
                    {message.content}
                  </Typography>
                  {message.sources && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        color: message.type === 'user' ? '#e0f2fe' : (theme === 'light' ? '#64748b' : '#94a3b8')
                      }}
                    >
                      Sources: {message.sources.map(s => `${s.filename} (Page ${s.page})`).join(', ')}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ color: theme === 'light' ? '#64748b' : '#94a3b8' }}>Typing...</Typography>
              </Box>
            )}
          </Box>

          <Box
            component="form"
            onSubmit={handleQuery}
            sx={{
              p: 2,
              borderTop: '1px solid #e2e8f0',
              bgcolor: theme === 'light' ? '#ffffff' : '#334155'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading || files.length === 0}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme === 'light' ? '#f8fafc' : '#475569',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#94a3b8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: theme === 'light' ? '#334155' : '#f8fafc',
                  }
                }}
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || files.length === 0 || !query.trim()}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': {
                    bgcolor: '#2563eb',
                  },
                  boxShadow: 'none',
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3,
                  minWidth: '80px'
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                ) : (
                  'Ask'
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}