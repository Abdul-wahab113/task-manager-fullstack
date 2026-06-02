import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { API_URL } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
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
          <h2>Check Your Email</h2>
          <p className="text-muted mt-1 mb-3">
            If an account exists with <strong>{email}</strong>, we have sent a password reset link.
          </p>
          <Link to="/login" className="btn btn-secondary d-inline-flex align-center" style={{ gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-center align-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="text-center mb-3">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Forgot password</h1>
          <p className="text-secondary">Enter your email and we'll send you a reset link.</p>
        </div>

        {error && (
          <div
            className="d-flex align-center mb-3"
            style={{ padding: '0.7rem 0.875rem', background: 'var(--color-danger-soft)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
          >
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.85rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : (
              <>
                <Mail size={18} style={{ marginRight: '0.5rem' }} />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="text-center" style={{ fontSize: '0.9rem' }}>
          <Link to="/login" className="text-muted d-inline-flex align-center" style={{ gap: '0.25rem' }}>
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
