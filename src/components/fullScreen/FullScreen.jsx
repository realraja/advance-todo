'use client';

import { useState, useEffect } from "react";

const FullScreenPageComponent = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [exitMessage, setExitMessage] = useState("");

  const handleEnterFullScreen = () => {
    const elem = document.documentElement; // Make the entire page fullscreen

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const handleExitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const onFullScreenChange = () => {
      const isNowFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      setIsFullScreen(!!isNowFullScreen);

      if (!isNowFullScreen) {
        setExitMessage("Exited fullscreen mode");
        setTimeout(() => setExitMessage(""), 3000);
      }
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("msfullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
      document.removeEventListener("msfullscreenchange", onFullScreenChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Fullscreen Mode</h1>

      <div className="flex gap-4">
        {!isFullScreen && (
          <button
            onClick={handleEnterFullScreen}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-lg"
          >
            Enter Fullscreen
          </button>
        )}

        {isFullScreen && (
          <button
            onClick={handleExitFullScreen}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-lg"
          >
            Exit Fullscreen
          </button>
        )}
      </div>

      {exitMessage && (
        <p className="mt-6 text-green-400 text-lg animate-pulse">{exitMessage}</p>
      )}
    </div>
  );
};

export default FullScreenPageComponent;
