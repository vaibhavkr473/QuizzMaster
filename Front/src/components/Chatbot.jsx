import React, { useState, useRef, useEffect } from 'react';
import { IconButton, TextField, Button, Tooltip, Badge, Fab, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Send, Close, SmartToy, School, AccessTime, MenuBook, Info, Chat, Psychology, SmartButton } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTheme } from '@mui/material/styles';
import styles from '../styles/components/Chatbot.module.css';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import QuizMasterIcon from './QuizMasterIcon';

const Chatbot = ({ open, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm QuizMaster AI. How can I help you today?", 
      sender: 'bot',
      model: 'gemini' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const quickActions = [
    { icon: <School />, text: "Study Tips" },
    { icon: <AccessTime />, text: "Time Management" },
    { icon: <MenuBook />, text: "Course Help" },
    { icon: <Info />, text: "Quiz Rules" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  useEffect(() => {
    // Sync with system preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.setAttribute('data-theme', 
      darkModeMediaQuery.matches ? 'dark' : 'light'
    );

    // Listen for system theme changes
    const handleThemeChange = (e) => {
      document.documentElement.setAttribute('data-theme', 
        e.matches ? 'dark' : 'light'
      );
    };
    
    darkModeMediaQuery.addEventListener('change', handleThemeChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const getAIResponse = async (input) => {
    try {
      const genAI = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await genAI.generateContent(input);
      return result.response.text();
    } catch (error) {
      console.error('AI Response Error:', error);
      return "Sorry, I encountered an error. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(input);
      const botMessage = { 
        id: messages.length + 2, 
        text: aiResponse, 
        sender: 'bot',
        model: 'gemini' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Show FAB only when dialog is closed */}
      {!isOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(135deg, #4F46E5, #2563EB)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338CA, #1D4ED8)'
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <ChatIcon />
          </Badge>
        </Fab>
      )}

      {/* Chat dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            minHeight: '60vh',
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle>
          QuizMaster Assistant
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '60vh',
            p: 0
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: 'var(--chat-bg, #f8fafc)'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  margin: '8px 0',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    borderRadius: 16,
                    background: msg.sender === 'user' ? '#6366f1' : '#e0e7ef',
                    color: msg.sender === 'user' ? '#fff' : '#222',
                    maxWidth: '80%',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {isTyping && (
              <div style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>QuizMaster is typing…</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderTop: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #4F46E5, #2563EB)'
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type your question…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              disabled={isTyping}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
