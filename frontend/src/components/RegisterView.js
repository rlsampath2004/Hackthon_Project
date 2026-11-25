import React, { useState } from 'react';
import { authApi } from '../api/axiosClient';

export default function RegisterView({
  onAuthSuccess,
  onNavigateToLogin,
  onNavigateToDashboard,
  onNavigateToIntro,
  isDarkMode,
  toggleTheme,
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Strength Calculation (0 to 4)
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#059669'];

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please recheck.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await authApi.register({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        currency: currency
      });

      localStorage.setItem('finintel_user', JSON.stringify(user));
      localStorage.setItem('finintel_token', user.token);
      setSuccessMessage('Account created successfully! Preparing dashboard...');
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
        setErrorMessage(serverMsg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-4 py-md-5 px-3 min-vh-80 position-relative">
      {/* Top Helper Navigation */}
      <div className="mb-3 w-100 d-flex justify-content-between align-items-center" style={{ maxWidth: '480px' }} data-aos="fade-down">
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
        </div>
      </div>

      {/* Main Full-Page Register Card */}
      <div
        className="custom-card border shadow-lg position-relative"
        data-aos="fade-up"
        data-aos-duration="600"
        style={{
          maxWidth: '480px',
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
            <i className="bi bi-person-plus-fill fs-4"></i>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)', letterSpacing: '-0.4px' }}>
            Create FinIntel Account
          </h4>
          <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
            Start tracking, analyzing, and optimizing your wealth with AI.
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

        {/* Register Form */}
        <form onSubmit={handleRegister} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Full Name
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
                placeholder="e.g. Alex Vance"
                className="form-control-pro w-100"
                style={{ paddingLeft: '44px', height: '44px', fontSize: '13.5px' }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Email Address
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

          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Phone Number
            </label>
            <div className="position-relative">
              <div
                className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '100%', pointerEvents: 'none', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-telephone fs-6"></i>
              </div>
              <input
                type="tel"
                required
                placeholder="e.g. +1 (555) 019-2834"
                className="form-control-pro w-100"
                style={{ paddingLeft: '44px', height: '44px', fontSize: '13.5px' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Base Currency Selection */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Base Currency
            </label>
            <div className="position-relative">
              <div
                className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '100%', pointerEvents: 'none', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-currency-exchange fs-6"></i>
              </div>
              <select
                className="form-control-pro w-100 form-select"
                style={{ paddingLeft: '44px', height: '44px', fontSize: '13.5px', cursor: 'pointer' }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="CAD">CAD ($) - Canadian Dollar</option>
                <option value="AUD">AUD ($) - Australian Dollar</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Password
            </label>
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
                placeholder="At least 6 characters"
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

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small text-muted" style={{ fontSize: '11px' }}>Password Strength:</span>
                  <span className="small fw-semibold" style={{ fontSize: '11px', color: strengthColors[strengthScore] }}>
                    {strengthLabels[strengthScore]}
                  </span>
                </div>
                <div className="d-flex gap-1" style={{ height: '4px' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className="flex-grow-1 rounded-1"
                      style={{
                        backgroundColor: strengthScore >= step ? strengthColors[strengthScore] : 'var(--card-border)',
                        transition: 'background-color 0.25s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" style={{ color: 'var(--text-main)' }}>
              Confirm Password
            </label>
            <div className="position-relative">
              <div
                className="position-absolute start-0 top-50 translate-middle-y d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '100%', pointerEvents: 'none', color: 'var(--text-muted)' }}
              >
                <i className="bi bi-shield-lock fs-6"></i>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Repeat password"
                className="form-control-pro w-100 font-mono-num"
                style={{ paddingLeft: '44px', paddingRight: '48px', height: '44px', fontSize: '13.5px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-1 p-0 d-flex align-items-center justify-content-center text-decoration-none"
                style={{ width: '36px', height: '36px', color: 'var(--text-muted)' }}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="registerAgreeTermsCheck"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ backgroundColor: agreeTerms ? '#0d6efd' : 'transparent', borderColor: 'var(--card-border)' }}
            />
            <label className="form-check-label small" htmlFor="registerAgreeTermsCheck" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>.
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Link to Login Page */}
        <div className="text-center mt-3 pt-2" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="btn btn-link p-0 fw-semibold text-decoration-none"
            style={{ fontSize: '13px', color: '#0d6efd' }}
          >
            Sign in
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

