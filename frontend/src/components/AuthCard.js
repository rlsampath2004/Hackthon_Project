import React, { useState } from 'react';
import { authApi } from '../api/axiosClient';

export default function AuthCard({ onAuthSuccess, onDismiss, isModal = false }) {
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    currency: 'USD',
  });

  // Fast 1-Click Demo Login (Alex Vance)
  const handleDemoLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await authApi.login('demo@finintel.ai', 'Password123!');
      user.name = 'Alex Vance';
      user.email = 'demo@finintel.ai';
      user.currency = 'USD';
      user.role = 'ROLE_USER';

      setSuccessMessage('Welcome back, Alex. Signing you in...');
      setTimeout(() => {
        localStorage.setItem('finintel_user', JSON.stringify(user));
        localStorage.setItem('finintel_token', user.token);
        setIsLoading(false);
        if (onAuthSuccess) onAuthSuccess(user);
      }, 500);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.response?.data?.message || 'Unable to connect. Please retry.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (authMode === 'REGISTER' && !formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'LOGIN') {
        const user = await authApi.login(formData.email.trim(), formData.password);
        setSuccessMessage('Signing in...');
        setTimeout(() => {
          localStorage.setItem('finintel_user', JSON.stringify(user));
          localStorage.setItem('finintel_token', user.token);
          setIsLoading(false);
          if (onAuthSuccess) onAuthSuccess(user);
        }, 450);
      } else {
        const newUser = await authApi.register({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          currency: formData.currency,
        });
        setSuccessMessage('Account created successfully! Logging you in...');
        setTimeout(() => {
          localStorage.setItem('finintel_user', JSON.stringify(newUser));
          localStorage.setItem('finintel_token', newUser.token);
          setIsLoading(false);
          if (onAuthSuccess) onAuthSuccess(newUser);
        }, 500);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(
        err.response?.data?.message || 
        (authMode === 'LOGIN' ? 'Incorrect email or password. Please try again.' : 'Could not create account. Please try again.')
      );
    }
  };

  // Human-friendly password strength meter
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: '#ef4444' };
      case 2:
        return { score: 2, label: 'Fair', color: '#f59e0b' };
      case 3:
        return { score: 3, label: 'Good', color: '#3b82f6' };
      case 4:
        return { score: 4, label: 'Strong', color: '#10b981' };
      default:
        return { score: 0, label: '', color: '' };
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div
      className="custom-card border shadow-lg position-relative"
      data-aos="fade-up"
      data-aos-duration="600"
      style={{
        maxWidth: '440px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: 'var(--surface-bg)',
        borderColor: 'var(--card-border)',
        borderRadius: '16px',
        padding: '2rem 1.75rem',
      }}
    >
      {/* Optional Dismiss button if in modal mode */}
      {isModal && onDismiss && (
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          style={{ filter: 'var(--bs-btn-close-filter)', zIndex: 10 }}
          onClick={onDismiss}
          aria-label="Close"
        />
      )}

      {/* Header: Clean Brand Icon & Title */}
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white mb-2 shadow-sm"
          style={{ width: '48px', height: '48px' }}
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <i className="bi bi-wallet2 fs-4"></i>
        </div>
        <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)', letterSpacing: '-0.4px' }}>
          {authMode === 'LOGIN' ? 'Welcome back' : 'Create your account'}
        </h4>
        <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
          {authMode === 'LOGIN'
            ? 'Sign in to access your financial intelligence ledger'
            : 'Get started with automated budgeting and expense tracking'}
        </p>
      </div>

      {/* Segmented Mode Switcher (Slim & Reduced Radius) */}
      <div
        className="d-flex mb-3"
        style={{
          padding: '2px',
          borderRadius: '6px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--card-border)',
        }}
        data-aos="fade-in"
        data-aos-delay="150"
      >
        <button
          type="button"
          onClick={() => {
            setAuthMode('LOGIN');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className="btn btn-sm w-50 fw-semibold transition-all"
          style={{
            borderRadius: '4px',
            backgroundColor: authMode === 'LOGIN' ? 'var(--surface-bg)' : 'transparent',
            color: authMode === 'LOGIN' ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: authMode === 'LOGIN' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            border: authMode === 'LOGIN' ? '1px solid var(--card-border)' : '1px solid transparent',
            fontSize: '12.5px',
            padding: '5px 8px',
          }}
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('REGISTER');
            setErrorMessage('');
            setSuccessMessage('');
          }}
          className="btn btn-sm w-50 fw-semibold transition-all"
          style={{
            borderRadius: '4px',
            backgroundColor: authMode === 'REGISTER' ? 'var(--surface-bg)' : 'transparent',
            color: authMode === 'REGISTER' ? 'var(--text-main)' : 'var(--text-muted)',
            boxShadow: authMode === 'REGISTER' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            border: authMode === 'REGISTER' ? '1px solid var(--card-border)' : '1px solid transparent',
            fontSize: '12.5px',
            padding: '5px 8px',
          }}
        >
          Create account
        </button>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div
          className="alert py-2.5 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2 border border-danger border-opacity-25"
          style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#ef4444' }}
          role="alert"
          data-aos="fade-in"
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
          data-aos="fade-in"
        >
          <i className="bi bi-check-circle-fill flex-shrink-0 text-success"></i>
          <span className="fw-medium">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name (Sign Up only) */}
        {authMode === 'REGISTER' && (
          <div className="mb-3" data-aos="fade-up" data-aos-delay="200">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Full name
            </label>
            <div className="position-relative">
              <div
                className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '100%', pointerEvents: 'none', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-person fs-6"></i>
              </div>
              <input
                type="text"
                required
                placeholder="Alex Vance"
                className="form-control-pro w-100"
                style={{ paddingLeft: '44px', height: '44px', fontSize: '13.5px' }}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Email Address */}
        <div className="mb-3" data-aos="fade-up" data-aos-delay="250">
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
              placeholder="you@example.com"
              className="form-control-pro w-100"
              style={{ paddingLeft: '44px', height: '44px', fontSize: '13.5px' }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3" data-aos="fade-up" data-aos-delay="300">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
              Password
            </label>
            {authMode === 'LOGIN' && (
              <button
                type="button"
                onClick={() => alert('For hackathon evaluation: Use demo@finintel.ai or click Demo Account below.')}
                className="btn btn-link p-0 small text-decoration-none"
                style={{ fontSize: '12px', color: '#0d6efd' }}
              >
                Forgot password?
              </button>
            )}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          {/* Password Strength Indicator (Sign Up only) */}
          {authMode === 'REGISTER' && formData.password && (
            <div className="mt-2">
              <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
                <span className="fw-semibold" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
              <div className="d-flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="flex-grow-1 rounded-pill transition-all"
                    style={{
                      height: '3.5px',
                      backgroundColor: step <= strength.score ? strength.color : 'var(--card-border)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Currency Selector (Sign Up only) */}
        {authMode === 'REGISTER' && (
          <div className="mb-3" data-aos="fade-up" data-aos-delay="350">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Primary Currency
            </label>
            <select
              className="form-select-pro w-100"
              style={{ height: '44px', fontSize: '13.5px' }}
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
              <option value="GBP">£ GBP - British Pound</option>
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="JPY">¥ JPY - Japanese Yen</option>
            </select>
          </div>
        )}

        {/* Remember Me Checkbox (Sign In only) */}
        {authMode === 'LOGIN' && (
          <div className="form-check mb-3" data-aos="fade-in" data-aos-delay="320">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMeCheck"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ backgroundColor: rememberMe ? '#0d6efd' : 'transparent', borderColor: 'var(--card-border)' }}
            />
            <label className="form-check-label small" htmlFor="rememberMeCheck" style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
              Remember me for 30 days
            </label>
          </div>
        )}

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
          style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {isLoading ? (
            <>
              <i className="bi bi-arrow-repeat spin-anim"></i>
              <span>{authMode === 'LOGIN' ? 'Signing in...' : 'Creating account...'}</span>
            </>
          ) : (
            <span>{authMode === 'LOGIN' ? 'Sign in' : 'Create account'}</span>
          )}
        </button>

        {/* Divider */}
        <div className="d-flex align-items-center my-3" data-aos="fade-in">
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
          data-aos="fade-up"
          data-aos-delay="450"
        >
          <i className="bi bi-person-check-fill text-primary"></i>
          <span>Demo Account (Alex Vance)</span>
        </button>
      </form>

      {/* Mode Switcher Link at Bottom */}
      <div className="text-center mt-3 pt-2" style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
        {authMode === 'LOGIN' ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => { setAuthMode('REGISTER'); setErrorMessage(''); }}
              className="btn btn-link p-0 fw-semibold text-decoration-none"
              style={{ fontSize: '12.5px', color: '#0d6efd' }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setAuthMode('LOGIN'); setErrorMessage(''); }}
              className="btn btn-link p-0 fw-semibold text-decoration-none"
              style={{ fontSize: '12.5px', color: '#0d6efd' }}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

