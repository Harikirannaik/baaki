import React, { useState } from 'react';
import { SpendProject } from '../types';
import { PROJECT_GRADIENTS } from '../utils';
import { Plus, X, Sparkles, UserPlus } from 'lucide-react';

interface CreateSpendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: SpendProject) => void;
}

export const CreateSpendModal: React.FC<CreateSpendModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'trip' | 'home' | 'event' | 'couple' | 'other'>('trip');
  const [selectedGradient, setSelectedGradient] = useState(PROJECT_GRADIENTS[0]);
  const [currency, setCurrency] = useState('₹');

  // Initial members input list
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [newMemberName, setNewMemberName] = useState('');


  if (!isOpen) return null;

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      setMemberNames([...memberNames, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (index: number) => {
    if (memberNames.length <= 1) return; // Keep at least 1 member
    setMemberNames(memberNames.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || memberNames.length === 0) return;

    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

    const newProject: SpendProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      coverGradient: selectedGradient,
      currency,
      createdAt: new Date().toISOString(),
      members: memberNames.map((name, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        color: colors[idx % colors.length]
      })),
      expenses: [],
      settlements: []
    };

    onCreate(newProject);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
              <Sparkles size={20} />
            </div>
            <h3 className="modal-title">Create New Spend Project</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Spending Project Title *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Thailand Vacation 2026, House Rent, Birthday Bash"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Short note about what this spending project is for..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-control" 
                value={category}
                onChange={e => setCategory(e.target.value as any)}
              >
                <option value="trip">🏖️ Trip / Vacation</option>
                <option value="home">🏠 Home & Apartment</option>
                <option value="event">🎉 Party & Event</option>
                <option value="couple">❤️ Couple / Pair</option>
                <option value="other">✨ Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <input 
                type="text" 
                className="form-control" 
                value={currency} 
                onChange={e => setCurrency(e.target.value)}
                placeholder="₹, $, €, £"
                maxLength={4}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Card Theme Gradient</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {PROJECT_GRADIENTS.map((grad, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedGradient(grad)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: grad,
                    cursor: 'pointer',
                    border: selectedGradient === grad ? '3px solid #fff' : '2px solid transparent',
                    boxShadow: selectedGradient === grad ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">People Involved (Members)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input 
                type="text"
                className="form-control"
                placeholder="Add member name..."
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddMember(); } }}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleAddMember}
              >
                <UserPlus size={18} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {memberNames.map((name, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.88rem'
                  }}
                >
                  <span>👤 {name}</span>
                  {memberNames.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMember(idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Create Spend Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
