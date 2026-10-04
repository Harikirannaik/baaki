import React, { useState } from 'react';
import { SpendProject, SplitType, Expense, SplitShare } from '../types';
import { CATEGORY_ICONS } from '../utils';
import { Plus, X, Users, Percent, Calculator, UserCheck } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  project: SpendProject;
  onClose: () => void;
  onAddExpense: (expense: Expense) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  project,
  onClose,
  onAddExpense
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState<string>(project.members[0]?.id || '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [notes, setNotes] = useState('');

  // Selected members for split (defaults to all members)
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    project.members.map(m => m.id)
  );

  // Custom split amounts for exact / portions / percentage
  const [customPortions, setCustomPortions] = useState<Record<string, number>>({});
  const [customExacts, setCustomExacts] = useState<Record<string, number>>({});
  const [customPercentages, setCustomPercentages] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const totalAmountNum = parseFloat(amount) || 0;

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMemberIds.includes(memberId)) {
      if (selectedMemberIds.length > 1) {
        setSelectedMemberIds(selectedMemberIds.filter(id => id !== memberId));
      }
    } else {
      setSelectedMemberIds([...selectedMemberIds, memberId]);
    }
  };

  const handlePortionChange = (memberId: string, value: number) => {
    setCustomPortions(prev => ({ ...prev, [memberId]: Math.max(0, value) }));
  };

  const handleExactChange = (memberId: string, value: number) => {
    setCustomExacts(prev => ({ ...prev, [memberId]: Math.max(0, value) }));
  };

  const handlePercentageChange = (memberId: string, value: number) => {
    setCustomPercentages(prev => ({ ...prev, [memberId]: Math.max(0, value) }));
  };

  const calculateFinalSplits = (): SplitShare[] => {
    if (selectedMemberIds.length === 0 || totalAmountNum <= 0) return [];

    if (splitType === 'equal') {
      const perPerson = totalAmountNum / selectedMemberIds.length;
      return selectedMemberIds.map(id => ({
        personId: id,
        amount: Math.round(perPerson * 100) / 100
      }));
    }

    if (splitType === 'portions') {
      let totalPortions = 0;
      selectedMemberIds.forEach(id => {
        totalPortions += (customPortions[id] ?? 1);
      });
      if (totalPortions <= 0) totalPortions = selectedMemberIds.length;

      return selectedMemberIds.map(id => {
        const p = customPortions[id] ?? 1;
        const share = (totalAmountNum * p) / totalPortions;
        return {
          personId: id,
          amount: Math.round(share * 100) / 100,
          portion: p
        };
      });
    }

    if (splitType === 'percentage') {
      return selectedMemberIds.map(id => {
        const pct = customPercentages[id] ?? (100 / selectedMemberIds.length);
        const share = (totalAmountNum * pct) / 100;
        return {
          personId: id,
          amount: Math.round(share * 100) / 100,
          percentage: pct
        };
      });
    }

    if (splitType === 'exact') {
      return selectedMemberIds.map(id => {
        const ex = customExacts[id] ?? (totalAmountNum / selectedMemberIds.length);
        return {
          personId: id,
          amount: Math.round(ex * 100) / 100
        };
      });
    }

    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalAmountNum <= 0) return;

    const splits = calculateFinalSplits();

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amount: totalAmountNum,
      date: new Date().toISOString(),
      category,
      paidBy: paidBy || project.members[0].id,
      splitType,
      splits,
      notes: notes.trim()
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add Expenditure</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Project: {project.title}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Expense Title *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Dinner, Petrol, Hotel Bill"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount ({project.currency}) *</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control" 
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                {Object.keys(CATEGORY_ICONS).map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Paid By</label>
              <select className="form-control" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                {project.members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Strategy Selection */}
          <div className="form-group">
            <label className="form-label">Split Strategy</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { type: 'equal', label: 'Equally', icon: Users },
                { type: 'portions', label: 'Portions', icon: Calculator },
                { type: 'exact', label: 'Exact Amt', icon: UserCheck },
                { type: 'percentage', label: '% Share', icon: Percent },
              ].map(item => {
                const IconComponent = item.icon;
                const isSelected = splitType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSplitType(item.type as SplitType)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--primary-light)' : 'rgba(15, 23, 42, 0.5)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      color: isSelected ? '#818cf8' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    <IconComponent size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Member Split Checkbox Matrix & Portion Inputs */}
          <div className="form-group">
            <label className="form-label">Split Among Members</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(15, 23, 42, 0.4)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              {project.members.map(member => {
                const isSelected = selectedMemberIds.includes(member.id);
                return (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMemberSelection(member.id)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontWeight: 500 }}>{member.name}</span>
                    </label>

                    {isSelected && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {splitType === 'portions' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shares:</span>
                            <input 
                              type="number"
                              min="1"
                              value={customPortions[member.id] ?? 1}
                              onChange={e => handlePortionChange(member.id, parseFloat(e.target.value) || 1)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', background: '#0f172a', color: 'white' }}
                            />
                          </div>
                        )}

                        {splitType === 'exact' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{project.currency}</span>
                            <input 
                              type="number"
                              step="0.01"
                              value={customExacts[member.id] ?? (totalAmountNum / (selectedMemberIds.length || 1)).toFixed(2)}
                              onChange={e => handleExactChange(member.id, parseFloat(e.target.value) || 0)}
                              style={{ width: '90px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', background: '#0f172a', color: 'white' }}
                            />
                          </div>
                        )}

                        {splitType === 'percentage' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input 
                              type="number"
                              step="1"
                              value={customPercentages[member.id] ?? Math.round(100 / (selectedMemberIds.length || 1))}
                              onChange={e => handlePercentageChange(member.id, parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', background: '#0f172a', color: 'white' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>%</span>
                          </div>
                        )}

                        {splitType === 'equal' && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                            {project.currency} {(totalAmountNum / (selectedMemberIds.length || 1)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Receipt Link (Optional)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Paid via GPay, includes tip"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-emerald">
              <Plus size={18} /> Record Expenditure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
