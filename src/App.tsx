import React, { useState, useEffect } from 'react';
import { SpendProject } from './types';
import { CreateSpendModal } from './components/CreateSpendModal';
import { ProjectDetailView } from './components/ProjectDetailView';
import { AuthModal, UserProfile } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { subscribeProjects, saveProjectToFirestore, deleteProjectFromFirestore } from './firebase';
import { Plus, Wallet, Sparkles, TrendingUp, ArrowRight, ShieldCheck, PieChart, Trash2, FolderPlus, User, Settings, LogIn, UserPlus } from 'lucide-react';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<SpendProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auth & Settings state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('baaki_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    // Clear legacy mock data from local storage if any exists
    localStorage.removeItem('baaki_projects');

    // Subscribe to Firestore projects collection
    const unsubscribe = subscribeProjects((fetchedProjects) => {
      setProjects(fetchedProjects);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('baaki_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('baaki_current_user');
    setIsSettingsModalOpen(false);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('baaki_current_user', JSON.stringify(updatedUser));
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleCreateProject = async (newProject: SpendProject) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
    await saveProjectToFirestore(newProject);
  };

  const handleUpdateProject = async (updatedProject: SpendProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    await saveProjectToFirestore(updatedProject);
  };

  const handleDeleteProject = async (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this spending project? This cannot be undone.')) {
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
      setProjects(projects.filter(p => p.id !== projectId));
      await deleteProjectFromFirestore(projectId);
    }
  };

  const totalGlobalSpent = projects.reduce((acc, p) => {
    return acc + p.expenses.reduce((s, e) => s + e.amount, 0);
  }, 0);

  const totalGlobalExpensesCount = projects.reduce((acc, p) => acc + p.expenses.length, 0);


  return (
    <div>
      {/* Top Navbar */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-logo" onClick={() => setActiveProjectId(null)} style={{ cursor: 'pointer' }}>
            <div className="brand-icon-box">
              <Wallet size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="brand-title">Baaki</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} /> New Spending Project
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Logged in: Show User Profile Icon & Settings Button */}
                <div
                  onClick={() => setIsSettingsModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-light)',
                    padding: '5px 12px 5px 6px',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="View Profile & Settings"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)' }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
                </div>

                <button
                  className="btn"
                  onClick={() => setIsSettingsModalOpen(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-light)',
                    padding: '8px',
                    borderRadius: '50%',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn"
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-light)', gap: '6px' }}
                >
                  <LogIn size={16} /> Log In
                </button>
                <button
                  className="btn"
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#a5b4fc', gap: '6px' }}
                >
                  <UserPlus size={16} /> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-container">
        {activeProject ? (
          <ProjectDetailView
            project={activeProject}
            onBack={() => setActiveProjectId(null)}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={(id) => handleDeleteProject(id)}
          />
        ) : (
          /* HOME PAGE DASHBOARD */
          <div>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', padding: '40px 20px 48px', maxWidth: '750px', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '6px 16px', borderRadius: '30px', color: '#818cf8', fontWeight: 600, fontSize: '0.88rem', marginBottom: '16px', border: '1px solid rgba(99,102,241,0.3)' }}>
                <Sparkles size={16} /> Equal & Custom Bill Splitting Made Effortless
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Split Group Expenses Without The Awkwardness
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '28px', lineHeight: 1.6 }}>
                Create spending projects for trips, apartment rent, parties & couples. Split equally, by portions, percentages, or exact amounts.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => setIsCreateModalOpen(true)}>
                  <Plus size={20} /> Create New Spend
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div className="card-glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Spent Across Projects</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                    ₹ {totalGlobalSpent.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="card-glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
                  <PieChart size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Spend Projects</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                    {projects.length} Projects
                  </div>
                </div>
              </div>

              <div className="card-glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-pink)' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Recorded Expenditures</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                    {totalGlobalExpensesCount} Expenditures
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid Section */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                Your Spending Projects
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Select a project to add or view expenditures
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
                  <FolderPlus size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>No Projects Created Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.98rem' }}>
                  All mock data has been removed. Create your first project to start tracking expenses with real Firestore storage!
                </p>
                <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={() => setIsCreateModalOpen(true)}>
                  <Plus size={18} /> Create Your First Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {projects.map(proj => {
                  const projectTotal = proj.expenses.reduce((sum, e) => sum + e.amount, 0);

                  return (
                    <div
                      key={proj.id}
                      className="card-glass"
                      onClick={() => setActiveProjectId(proj.id)}
                      style={{
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      {/* Top Gradient Banner */}
                      <div style={{ height: '110px', background: proj.coverGradient, padding: '20px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
                          {proj.category}
                        </span>
                        <button
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          style={{
                            background: 'rgba(0,0,0,0.4)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '6px',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)'
                          }}
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Card Content Body */}
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: 'white' }}>
                            {proj.title}
                          </h3>
                          {proj.description && (
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {proj.description}
                            </p>
                          )}
                        </div>

                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>Total Spent</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                              {proj.currency} {projectTotal.toLocaleString()}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', marginLeft: '-6px' }}>
                              {proj.members.slice(0, 3).map((m, idx) => (
                                <img
                                  key={m.id}
                                  src={m.avatar}
                                  alt={m.name}
                                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #1e293b', marginLeft: idx > 0 ? '-8px' : 0 }}
                                />
                              ))}
                              {proj.members.length > 3 && (
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid #1e293b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }}>
                                  +{proj.members.length - 3}
                                </div>
                              )}
                            </div>
                            <ArrowRight size={18} color="var(--primary)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Spending Project Modal */}
      <CreateSpendModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* Register & Login Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Account Settings & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
};
