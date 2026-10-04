import React from 'react';
import { 
  Sparkles, Wallet, Shield, Zap, ArrowRight, PieChart, Users, 
  Lock, CheckCircle2, Star, Globe, ChevronRight, UserPlus, LogIn 
} from 'lucide-react';

interface LandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegister,
  onOpenLogin,
}) => {
  return (
    <div className="landing-wrapper" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Glow Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: '1200px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.15) 40%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '80px', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '30px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '28px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={16} /> Next-Gen Bill Splitting & Group Expense Protocol
          </div>

          {/* Futuristic Title */}
          <h1 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Split Bills Seamlessly.<br />Zero Awkward Calculations.
          </h1>

          <p 
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              maxWidth: '640px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            Track shared expenses for trips, roommates, and events. Equal or custom split shares, real-time Firestore sync, and automated debt simplification in a sleek, modern interface.
          </p>

          {/* Action CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={onOpenRegister}
              style={{ 
                padding: '14px 32px', 
                fontSize: '1.05rem', 
                borderRadius: '30px', 
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={20} /> Get Started Free <ArrowRight size={18} />
            </button>

            <button 
              className="btn"
              onClick={onOpenLogin}
              style={{ 
                padding: '14px 28px', 
                fontSize: '1.05rem', 
                borderRadius: '30px', 
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <LogIn size={20} /> Log In to Account
            </button>
          </div>

        </div>
      </section>

      {/* Interactive App Preview Showcase Card */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto 100px', padding: '0 20px' }}>
        <div 
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-active)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.2)',
          }}
        >
          {/* Card Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginLeft: '12px' }}>baaki.app/dashboard</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Firestore Live Sync Active
            </div>
          </div>

          {/* Feature Grid inside Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '12px' }}><PieChart size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Custom & Equal Splits</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Split by exact amounts, shares, or percentage among group members instantly.</p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}><Zap size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Debt Simplification</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Automated graph algorithm to minimize total transaction count between members.</p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--accent-pink)', marginBottom: '12px' }}><Lock size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Secure Account Storage</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Registered accounts and trip budgets safely stored across devices via Firebase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-main)' }}>
            <Wallet size={20} color="var(--primary)" /> Baaki Bill Protocol
          </div>
          <div>© {new Date().getFullYear()} Baaki. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
