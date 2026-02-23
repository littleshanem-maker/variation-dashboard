'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)', // Placeholder gradient
            borderRadius: 12,
            margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 24
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: '#1a1f36',
            marginBottom: 8,
            letterSpacing: '-0.02em'
          }}>
            Welcome back!
          </h1>
          <div style={{ color: '#697386', fontSize: 15 }}>
            Don't have an account? <a href="#" style={{ color: '#635BFF', textDecoration: 'none', fontWeight: 500 }}>Sign up</a>
          </div>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <button style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            width: '100%', height: 44,
            background: 'white', border: '1px solid #e6ebf1', borderRadius: 8,
            fontSize: 15, fontWeight: 500, color: '#3c4257',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="" />
            Continue with Google
          </button>
          
          <button style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            width: '100%', height: 44,
            background: 'white', border: '1px solid #e6ebf1', borderRadius: 8,
            fontSize: 15, fontWeight: 500, color: '#3c4257',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7z"/>
            </svg>
            Continue with SSO
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#e6ebf1' }} />
          <span style={{ fontSize: 13, color: '#697386' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e6ebf1' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', height: 44,
                padding: '0 40px 0 14px',
                border: '1px solid #e6ebf1', borderRadius: 8,
                fontSize: 15, color: '#1a1f36',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            />
            <div style={{ position: 'absolute', right: 14, top: 12, color: '#697386' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', height: 44,
                padding: '0 40px 0 14px',
                border: '1px solid #e6ebf1', borderRadius: 8,
                fontSize: 15, color: '#1a1f36',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            />
            <div style={{ position: 'absolute', right: 14, top: 12, color: '#697386' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 44,
              background: '#635BFF',
              color: 'white',
              border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 5px rgba(99,91,255,0.4)',
              transition: 'transform 0.1s',
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="#" style={{ fontSize: 14, color: '#635BFF', textDecoration: 'none', fontWeight: 500 }}>
            Forgot Password?
          </a>
        </div>

      </div>
    </div>
  );
}
