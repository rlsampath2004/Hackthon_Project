import React, { useState } from 'react';
import { authApi } from '../api/axiosClient';

export default function LoginView({ 
  onAuthSuccess, 
  onNavigateToRegister, 
  onNavigateToDashboard, 
  onNavigateToIntro,
  isDarkMode,
  toggleTheme,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Quick Fill Demo Credentials (Alex Vance)
  const handleDemoLogin = () => {
    setEmail('demo@finintel.ai');
    setPassword('Password123!');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await authApi.login(email.trim(), password);
      localStorage.setItem('finintel_user', JSON.stringify(user));
      localStorage.setItem('finintel_token', user.token);
      setSuccessMessage('Signing in...');
      setTimeout(() => {
        setIsLoading(false);
        if (onAuthSuccess) onAuthSuccess(user);
      }, 200);
    } catch (err) {
      setIsLoading(false);
      if (!err.response) {
        setErrorMessage('Cannot reach backend server at http://localhost:8989. Please ensure the backend is running.');
      } else {
        const serverMsg = err.response?.data?.message || err.response?.data?.error;
        setErrorMessage(serverMsg || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-4 py-md-5 px-3 min-vh-80 position-relative">
      {/* Top Helper Navigation */}
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

        <div className="d-flex align-items-center gap-2 ms-auto">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="theme-switch-btn"
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              type="button"
              aria-label="Toggle Theme"
            >
              <span className={`theme-pill-option ${!isDarkMode ? 'active' : ''}`}>
                <i className="bi bi-sun-fill text-warning"></i>
              </span>
              <span className={`theme-pill-option ${isDarkMode ? 'active' : ''}`}>
                <i className="bi bi-moon-stars-fill text-primary"></i>
              </span>
            </button>
          )}

          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="btn btn-sm btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1.5"
              style={{ color: 'var(--text-muted)', fontSize: '13px' }}
            >
              <span>Skip to Dashboard</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          )}
        </div>
      </div>

      {/* Main Full-Page Sign In Card */}
      <div
        className="custom-card border shadow-lg position-relative"
        data-aos="fade-up"
        data-aos-duration="600"
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: 'var(--surface-bg)',
          borderColor: 'var(--card-border)',
          borderRadius: '16px',
          padding: '2.25rem 2rem',
        }}
      >
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white mb-2.5 shadow-sm"
            style={{ width: '48px', height: '48px' }}
            data-aos="zoom-in"
          >
            <i className="bi bi-wallet2 fs-4"></i>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)', letterSpacing: '-0.4px' }}>
            Sign in to FinIntel
          </h4>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Welcome back! Enter your credentials to access your account.
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div
            className="alert py-2.5 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2 border border-danger border-opacity-25"
            style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ef4444' }}
            role="alert"
          >
            <i className="bi bi-exclamation-circle-fill flex-shrink-0 text-danger"></i>
            <span className="fw-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="alert py-2.5 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2 border border-success border-opacity-25"
            style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)', color: '#10b981' }}
            role="alert"
          >
            <i className="bi bi-check-circle-fill flex-shrink-0 text-success"></i>
            <span className="fw-medium">{successMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Address */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Email address
            </label>
            <div className="position-relative">
              <div
                className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '100%', pointerEvents: 'none', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-envelope fs-6"></i>
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="form-control-pro w-100"
                style={{ paddingLeft: '44px', height: '44px', fontSize: '13.5px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('For hackathon evaluation: Use demo@finintel.ai / Password123! or click Demo Account below.')}
                className="btn btn-link p-0 small text-decoration-none"
                style={{ fontSize: '12px', color: '#0d6efd' }}
              >
                Forgot password?
              </button>
            </div>

            <div className="position-relative">
              <div
                className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '100%', pointerEvents: 'none', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-lock fs-6"></i>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                className="form-control-pro w-100 font-mono-num"
                style={{ paddingLeft: '44px', paddingRight: '48px', height: '44px', fontSize: '13.5px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-1 p-0 d-flex align-items-center justify-content-center text-decoration-none"
                style={{ width: '36px', height: '36px', color: 'var(--text-muted)' }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="loginRememberMeCheck"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ backgroundColor: rememberMe ? '#0d6efd' : 'transparent', borderColor: 'var(--card-border)' }}
            />
            <label className="form-check-label small" htmlFor="loginRememberMeCheck" style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
            style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
          >
            {isLoading ? (
              <>
                <i className="bi bi-arrow-repeat spin-anim"></i>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>

          {/* Divider */}
          <div className="d-flex align-items-center my-3">
            <div className="flex-grow-1 border-top" style={{ borderColor: 'var(--card-border)' }}></div>
            <span className="px-2 small text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              or continue with
            </span>
            <div className="flex-grow-1 border-top" style={{ borderColor: 'var(--card-border)' }}></div>
          </div>

          {/* 1-Click Fast Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ height: '42px', fontSize: '13px', borderRadius: '8px' }}
          >
            <i className="bi bi-person-check-fill text-primary"></i>
            <span>Demo Account (Alex Vance)</span>
          </button>
        </form>

        {/* Link to Register Page */}
        <div className="text-center mt-3 pt-2" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="btn btn-link p-0 fw-semibold text-decoration-none"
            style={{ fontSize: '13px', color: '#0d6efd' }}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="text-center mt-4" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }} data-aos="fade-up" data-aos-delay="400">
        <i className="bi bi-shield-check me-1 text-success"></i>
        <span>Bank-grade security &bull; TLS 1.3 encrypted &bull; VCUBE Hack Quest</span>
      </div>
    </div>
  );
}
