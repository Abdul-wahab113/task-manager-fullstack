import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="d-flex justify-center align-center" style={{ minHeight: '100vh', padding: '1rem' }}>
        <div className="glass-panel text-center" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
          <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h2>Invalid Link</h2>
          <p className="text-muted mt-1 mb-3">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="btn btn-primary">Request New Link</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="d-flex justify-center align-center" style={{ minHeight: '100vh', padding: '1rem' }}>
        <div className="glass-panel text-center animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
          <CheckCircle2 size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2>Password Reset!</h2>
          <p className="text-muted mt-1 mb-3">Your password has been successfully updated.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-center align-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="text-center mb-3">
          <h1 className="text-primary" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create New Password</h1>
          <p className="text-muted">Please enter your new password below.</p>
        </div>

        {error && (
          <div className="d-flex align-center glass-panel mb-2" style={{ padding: '0.75rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label className="form-label" htmlFor="password">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0, display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : (
              <>
                <Lock size={18} style={{ marginRight: '0.5rem' }} />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
