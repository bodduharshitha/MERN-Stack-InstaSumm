import React, { useState } from 'react';
import './App.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Snackbar,
} from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import StickyNotes from './StickyNotes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Summarizer />} />
        <Route path="/stickynotes" element={<StickyNotes />} />
      </Routes>
    </Router>
  );
}

function Summarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result.summary);
      } else {
        setError(result.error || 'Error summarizing text');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setSummary('');
  };

  const handleCustomize = () => {
    navigate('/stickynotes');
  };

  const [copyButtonText, setCopyButtonText] = useState('Copy');

const handleCopy = () => {
  navigator.clipboard.writeText(summary);
  setCopyButtonText('Copied!');
  setTimeout(() => setCopyButtonText('Copy'), 2000); // Reset text after 2 seconds
};


  return (
    <div>
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
          boxShadow: 'none',
          padding: '10px 0',
        }}
      >
        <Toolbar sx={{ flexDirection: 'column', textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              fontFamily: 'Times New Roman, Times, serif',
              letterSpacing: '2px',
            }}
          >
            InstaSumm
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000000',
              fontSize: '1.2rem',
              fontFamily: 'Times New Roman, Times, serif',
              marginTop: '10px',
              letterSpacing: '1px',
            }}
          >
            Empowering Users with API-Driven Text Summarization and Personalizable Notes
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ marginBottom: '20px' }}
            >
              Enter Text to Summarize
            </Typography>

            {/* Text Input */}
            <TextField
              label="Input Text"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter text (min 500 characters, max 5000 characters)"
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                onClick={handleSummarize}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
                  color: 'black',
                  '&:hover': {
                    background: 'linear-gradient(to right, #ADD8E6, #FFB6C1)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Summarize'}
              </Button>
              <Button
                variant="contained"
                onClick={handleClear}
                sx={{
                  background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
                  color: '#000000',
                  '&:hover': {
                    background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
                    color: 'black',
                  },
                }}
              >
                Clear
              </Button>
            </Box>

            {/* Summary Output */}
            {summary && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6">Summarized Text:</Typography>
    <TextField
      multiline
      rows={4}
      fullWidth
      value={summary}
      variant="outlined"
      InputProps={{ readOnly: true }}
      sx={{ mt: 2 }}
    />
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2,borderSpacing:1 }}>
      <Button
        variant="contained"
        onClick={handleCustomize}
        sx={{
          background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
          color: 'black',
          '&:hover': {
            background: 'linear-gradient(to right, #ADD8E6, #FFB6C1)',
          },
        }}
      >
        Customize
      </Button>
      <Button
        variant="contained"
        onClick={handleCopy}
        sx={{
          background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
          color: 'black',
          '&:hover': {
            background: 'linear-gradient(to right, #ADD8E6, #FFB6C1)',
          },
        }}
      >
        {copyButtonText}
      </Button>
    </Box>
  </Box>
)}

          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 2,
          background: 'linear-gradient(to right, #FFB6C1, #ADD8E6)',
          color: 'white',
        }}
      >
        <Typography variant="body2">© 2024 AI Text Summarizer</Typography>
      </Box>

      {/* Snackbar for Errors */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        message={error}
      />
    </div>
  );
}

// function Customize() {
//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Customize Page
//       </Typography>
//       <Typography variant="body1">
//         Add your customization options here.
//       </Typography>
//     </Container>
//   );
// }

export default App;
