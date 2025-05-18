import React, { useState } from 'react';
import './AuthPage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/'); // Redirect to MapView after success
    } catch (err) {
      setError(isRegistering ? 'Registration failed.' : 'Invalid login credentials.');
    }
  };

  const toggleMode = () => setIsRegistering((prev) => !prev);

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
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
        <button type="button" className="register-button" onClick={toggleMode}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;