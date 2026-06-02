import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoMark from '../components/LogoMark';
import { UserPlus, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
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
        <div className="surface-card text-center animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
          <CheckCircle2 size={44} color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.3rem' }}>Account created</h2>
          <p className="text-muted mt-1">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-center align-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="surface-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="d-flex flex-column align-center text-center mb-3" style={{ gap: '0.75rem' }}>
          <Link to="/" className="app-logo" style={{ fontSize: '1.25rem' }}>
            <LogoMark size={32} /> Tasker
          </Link>
          <p className="text-secondary" style={{ margin: 0 }}>Create your account to get started.</p>
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
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="johndoe"
              style={fieldErrors.username ? { borderColor: 'var(--color-danger)' } : {}}
            />
            {fieldErrors.username && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {Array.isArray(fieldErrors.username) ? fieldErrors.username[0] : fieldErrors.username}
              </div>
            )}
          </div>

          <div className="form-group mb-2">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={fieldErrors.email ? { borderColor: 'var(--color-danger)' } : {}}
            />
            {fieldErrors.email && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {Array.isArray(fieldErrors.email) ? fieldErrors.email[0] : fieldErrors.email}
              </div>
            )}
          </div>
          
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem', ...(fieldErrors.password ? { borderColor: 'var(--color-danger)' } : {}) }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {Array.isArray(fieldErrors.password) ? fieldErrors.password[0] : fieldErrors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : (
              <>
                <UserPlus size={18} />
                Register
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
          <span className="text-muted">Already have an account? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
