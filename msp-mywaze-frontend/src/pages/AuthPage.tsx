import React, { useState } from 'react';
import './AuthPage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { login, register } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        await register(email, password);
        setIsConfirming(true);
      } catch (err) {
        setError('Registration failed.');
      }
    } else {
      try {
        await login(email, password);
        navigate('/');
      } catch (err) {
        setError('Invalid login credentials.');
      }
    }
  };

  const handleConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate success and navigate for now
    navigate('/');
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setIsConfirming(false);
    setError('');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={isConfirming ? handleConfirmation : handleSubmit}>
        <h2>
          {isConfirming
            ? 'Confirm Your Email'
            : isRegistering
            ? 'Register'
            : 'Login'}
        </h2>

        {!isConfirming ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isRegistering && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" className="login-button">
              {isRegistering ? 'Register' : 'Login'}
            </button>
            <button
              type="button"
              className="register-button"
              onClick={toggleMode}
            >
              {isRegistering
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </button>
          </>
        ) : (
          <>
            <p>We've sent a 6-digit confirmation code to your email.</p>
            <small>In the prototype, you can enter any code to continue</small>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="auth-input"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              maxLength={6}
              required
            />
            <button type="submit" className="login-button">
              Confirm Email
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AuthPage;