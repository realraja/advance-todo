'use client';
import React, { useState } from 'react';
import './FullscreenPage.css'; // Optional styling

const FullscreenPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error entering fullscreen:', err));
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false));
      }
    }
  };

  return (
    <div className={`fullscreen-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <h1>My Website</h1>
      <p>Click the button below to toggle fullscreen mode</p>
      
      <button 
        onClick={toggleFullscreen}
        className="fullscreen-button"
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </button>
      
      <div className="content">
        {/* Your regular website content goes here */}
        <p>This is the main content of your website.</p>
      </div>
    </div>
  );
};

export default FullscreenPage;