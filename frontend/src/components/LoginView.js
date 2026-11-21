import React from 'react';
import AuthCard from './AuthCard';

export default function LoginView({ 
  onAuthSuccess, 
  onNavigateToDashboard, 
  onNavigateToIntro 
}) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-4 py-md-5 px-3 min-vh-75 position-relative">
      {/* Navigation Helper Links */}
      <div className="mb-3 w-100 d-flex justify-content-between align-items-center" style={{ maxWidth: '440px' }} data-aos="fade-down">
        {onNavigateToIntro && (
          <button
            onClick={onNavigateToIntro}
            className="btn btn-sm btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1.5"
            style={{ color: 'var(--text-muted)', fontSize: '13px' }}
          >
            <i className="bi bi-play-circle-fill text-primary"></i>
            <span>Watch Intro Video</span>
          </button>
        )}

        {onNavigateToDashboard && (
          <button
            onClick={onNavigateToDashboard}
            className="btn btn-sm btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1.5 ms-auto"
            style={{ color: 'var(--text-muted)', fontSize: '13px' }}
          >
            <span>Skip to Dashboard</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        )}
      </div>

      {/* Main Authentication Card */}
      <AuthCard onAuthSuccess={onAuthSuccess} />

      {/* Trust & Security Badge */}
      <div className="text-center mt-4" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }} data-aos="fade-up" data-aos-delay="500">
        <i className="bi bi-shield-check me-1 text-success"></i>
        <span>Bank-grade security &bull; TLS 1.3 encrypted &bull; VCUBE Hack Quest</span>
      </div>
    </div>
  );
}
