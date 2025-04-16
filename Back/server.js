require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || 'http://localhost:3000';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log(`Email configured with: ${process.env.EMAIL_USER}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});