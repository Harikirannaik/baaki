import React from 'react';
import { Wallet, Sparkles, ShieldCheck, Zap, Users, ArrowRight, CheckCircle, PieChart, RefreshCw } from 'lucide-react';

interface LandingPageProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenRegister, onOpenLogin }) => {
  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 20px 80px', maxWidth: '850px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.15)',
          padding: '8px 20px',
          borderRadius: '30px',
          color: '#818cf8',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '24px',
          border: '1px solid rgba(99,102,241,0.3)'
        }}>
          <Sparkles size={16} /> The Smartest Way to Split Expenses with Friends
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3.4rem',
          fontWeight: 800,
          lineHeight: 1.12,
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          No More Awkward Math. <br />
          Settle Debts in Seconds.
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '36px', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 36px' }}>
          Baaki keeps track of shared bills for trips, roomies, couples & parties. Equal & custom splits, automated debt simplification, and real-time cloud sync.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem', gap: '8px' }} onClick={onOpenRegister}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }} onClick={onOpenLogin}>
            Log In to Account
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
            Everything You Need to Track Group Money
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Designed for modern trips, apartments, and group spending.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px' }}>
              <Zap size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Flexible Split Modes</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Split expenses equally, by exact custom amounts, percentage share, or weighted portions per member.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '20px' }}>
              <RefreshCw size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Smart Debt Simplification</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Minimizes the number of payments required between group members with automatic debt-balancing algorithms.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '32px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-pink)', marginBottom: '20px' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>Real-time Database Sync</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              All registered users and spending projects sync instantly with Cloud Firestore database.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section style={{ maxWidth: '900px', margin: '0 auto 60px', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: '48px 32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Ready to Start Splitting?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '540px', margin: '0 auto 28px' }}>
            Create an account or log in now to manage your group projects seamlessly.
          </p>
          <button className="btn btn-emerald" style={{ padding: '14px 32px', fontSize: '1rem' }} onClick={onOpenRegister}>
            Create Account Now
          </button>
        </div>
      </section>
    </div>
  );
};
