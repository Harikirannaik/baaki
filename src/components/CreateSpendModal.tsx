import React, { useState, useEffect } from 'react';
import { SpendProject, Person } from '../types';
import { PROJECT_GRADIENTS } from '../utils';
import { Plus, X, Sparkles, UserPlus, Check, UserCheck } from 'lucide-react';
import { subscribeUsersFromFirestore } from '../firebase';

interface CreateSpendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: SpendProject) => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

export const CreateSpendModal: React.FC<CreateSpendModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  currentUserEmail,
  currentUserName,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'trip' | 'home' | 'event' | 'couple' | 'other'>('trip');
  const [selectedGradient, setSelectedGradient] = useState(PROJECT_GRADIENTS[0]);
  const [currency, setCurrency] = useState('₹');

  // Members list (support full Person objects with email/avatar)
  const [selectedMembers, setSelectedMembers] = useState<Person[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [registeredUsersMap, setRegisteredUsersMap] = useState<Record<string, any>>({});

  // Auto-fetch existing users from Firestore DB
  useEffect(() => {
    const unsubscribe = subscribeUsersFromFirestore((fetchedUsers) => {
      setRegisteredUsersMap(fetchedUsers);
    });
    return () => unsubscribe();
  }, []);

  // Initialize currentUser as default member when modal opens
  useEffect(() => {
    if (isOpen && currentUserName && selectedMembers.length === 0) {
      const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];
      setSelectedMembers([{
        id: `m-owner-${Date.now()}`,
        name: currentUserName,
        email: currentUserEmail?.toLowerCase().trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUserName)}`,
        color: colors[0]
      }]);
    }
  }, [isOpen, currentUserName, currentUserEmail]);

  if (!isOpen) return null;

  const existingUsersList = Object.values(registeredUsersMap);

  const toggleRegisteredUser = (user: any) => {
    const isSelected = selectedMembers.some(m => m.email?.toLowerCase() === user.email.toLowerCase());
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.email?.toLowerCase() !== user.email.toLowerCase()));
    } else {
      setSelectedMembers([...selectedMembers, {
        id: `m-${Date.now()}-${selectedMembers.length}`,
        name: user.name,
        email: user.email.toLowerCase().trim(),
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
        color: colors[selectedMembers.length % colors.length]
      }]);
    }
  };

  const handleAddCustomMember = () => {
    if (newMemberName.trim()) {
      const name = newMemberName.trim();
      const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];
      setSelectedMembers([...selectedMembers, {
        id: `m-${Date.now()}-${selectedMembers.length}`,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        color: colors[selectedMembers.length % colors.length]
      }]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (id: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedMembers.length === 0) return;

    const newProject: SpendProject = {
      id: `proj-${Date.now()}`,
      ownerId: currentUserEmail?.toLowerCase().trim(),
      title: title.trim(),
      description: description.trim(),
      category,
      coverGradient: selectedGradient,
      currency,
      createdAt: new Date().toISOString(),
      members: selectedMembers,
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
            <label className="form-label"> Khaata Title *</label>
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
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Select Registered Users (DB)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{existingUsersList.length} users registered</span>
            </label>

            {existingUsersList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', maxHeight: '120px', overflowY: 'auto', padding: '6px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                {existingUsersList.map((user: any) => {
                  const isSelected = selectedMembers.some(m => m.email?.toLowerCase() === user.email.toLowerCase());
                  return (
                    <div
                      key={user.email}
                      onClick={() => toggleRegisteredUser(user)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: isSelected ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        color: isSelected ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 400,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                      />
                      <span>{user.name}</span>
                      {isSelected ? <UserCheck size={14} color="var(--primary)" /> : <Plus size={14} />}
                    </div>
                  );
                })}
              </div>
            )}

            <label className="form-label">Or Add Custom Member</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Enter custom member name..."
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomMember(); } }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddCustomMember}
              >
                <UserPlus size={18} /> Add
              </button>
            </div>

            <label className="form-label">Selected Project Members ({selectedMembers.length})</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedMembers.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.88rem',
                    color: 'white'
                  }}
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                  />
                  <span>{m.name}</span>
                  {selectedMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      style={{ background: 'none', border: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex' }}
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
