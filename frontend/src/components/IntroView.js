import React, { useRef, useState, useEffect } from 'react';
import videoSource from '../assets/ai_powered_finance.mp4';

export default function IntroView({ onSkipVideo }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser policy:', err);
      });
    }
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      {/* Full-Screen Video (Pure Video Display with No Text Overlay) */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={onSkipVideo}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          backgroundColor: '#000000',
        }}
      >
        <source src={videoSource} type="video/mp4" />
        <source src={`${process.env.PUBLIC_URL}/ai_powered_finance.mp4`} type="video/mp4" />
        <source src={`${process.env.PUBLIC_URL}/AI_personal_finance_video_intro_8ce3c005.mp4`} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Sound Mute / Unmute Toggle Button (Top-Left) */}
      <button
        type="button"
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100000,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          color: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        <i className={`bi ${isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'} fs-6`}></i>
      </button>

      {/* Skip Video Button (Top-Right) */}
      <button
        type="button"
        onClick={onSkipVideo}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          padding: '8px 18px',
          color: '#ffffff',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.9)';
          e.currentTarget.style.borderColor = '#0d6efd';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span>Skip Video</span>
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}
