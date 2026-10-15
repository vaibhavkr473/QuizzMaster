import React from 'react';
import '../styles/components/QuizMasterIcon.css';

const QuizMasterIcon = ({ size = 32 }) => {
  return (
    <div className="quiz-master-icon" style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 512 512" 
        xmlns="http://www.w3.org/2000/svg"
        className="icon-svg"
      >
        <rect width="512" height="512" rx="128" className="icon-background" />
        <path 
          className="icon-symbol" 
          d="M256 96c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160S344.4 96 256 96zm-8 216c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm28-64h-56c-4.4 0-8-3.6-8-8v-80c0-4.4 3.6-8 8-8h56c4.4 0 8 3.6 8 8v80c0 4.4-3.6 8-8 8z"
        />
      </svg>
    </div>
  );
};

export default QuizMasterIcon;