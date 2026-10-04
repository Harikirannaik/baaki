import React, { useState } from 'react';
import { User, LogIn, UserPlus, Lock, Mail, AlertCircle, X } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const savedUsersStr = localStorage.getItem('baaki_registered_users');
    const registeredUsers: Record<string, { name: string; email: string; avatar: string; passwordHash: string }> = 
      savedUsersStr ? JSON.parse(savedUsersStr) : {};

    const normalizedEmail = email.toLowerCase().trim();

    if (mode === 'register') {
      if (registeredUsers[normalizedEmail]) {
        setError('An account with this email already exists. Please login.');
        return;
      }

      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || normalizedEmail)}`;
      const newUser = {
        name,
        email: normalizedEmail,
        avatar,
        passwordHash: password, // Simple mockup store
      };

      registeredUsers[normalizedEmail] = newUser;
      localStorage.setItem('baaki_registered_users', JSON.stringify(registeredUsers));

      const userProfile: UserProfile = { name: newUser.name, email: newUser.email, avatar: newUser.avatar };
      onAuthSuccess(userProfile);
      onClose();
    } else {
      // Login mode
      const existingUser = registeredUsers[normalizedEmail];
      if (!existingUser) {
        setError('No account found with this email. Please register first.');
        return;
      }

      if (existingUser.passwordHash !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      const userProfile: UserProfile = {
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
      };
      onAuthSuccess(userProfile);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', padding: '32px' }}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            {mode === 'register' ? <UserPlus size={28} /> : <LogIn size={28} />}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px' }}>
            {mode === 'register' ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {mode === 'register'
              ? 'Register to start splitting bills effortlessly with Baaki'
              : 'Log in to manage your spending projects'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-subtle)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-subtle)' }} />
              <input
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-subtle)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
            {mode === 'register' ? 'Register Account' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {mode === 'register' ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register Now
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
