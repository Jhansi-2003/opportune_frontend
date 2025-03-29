// src/ForgotPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import './ForgotPasswordOTP.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // Basic email format check
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset link sent to your email!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-title">Forgot Password</h2>
      <form onSubmit={handleReset} className="forgot-form">
        <input
          type="text"
          placeholder="Enter your email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="forgot-button">Send Reset Link</button>
      </form>
      {message && <p className="forgot-success">{message}</p>}
      {error && <p className="forgot-error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
