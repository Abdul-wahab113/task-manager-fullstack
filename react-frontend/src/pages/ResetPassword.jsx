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
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors({});

    if (password !== confirmPassword) {
      return setFieldErrors({ newPassword: ['Passwords do not match'] });
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
        const err = new Error(data.message || 'Failed to reset password');
        err.fieldErrors = data.errors;
        throw err;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
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
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Create new password</h1>
          <p className="text-secondary">Please enter your new password below.</p>
        </div>

        {error && Object.keys(fieldErrors).length === 0 && (
          <div
            className="d-flex align-center mb-3"
            style={{ padding: '0.7rem 0.875rem', background: 'var(--color-danger-soft)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
          >
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label className="form-label" htmlFor="password">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-control ${fieldErrors.newPassword ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem', ...(fieldErrors.newPassword ? { borderColor: 'var(--color-danger)' } : {}) }}
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
            {fieldErrors.newPassword && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {Array.isArray(fieldErrors.newPassword) ? fieldErrors.newPassword[0] : fieldErrors.newPassword}
              </div>
            )}
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
