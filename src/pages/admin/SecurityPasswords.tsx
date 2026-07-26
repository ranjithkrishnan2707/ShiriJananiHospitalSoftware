import React, { useState } from 'react';
import { ShieldAlert, Pill, TestTube2, Activity, Settings, Eye, EyeOff } from 'lucide-react';
import './SecurityPasswords.css';

interface PasswordCardProps {
  moduleKey: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const PasswordCard: React.FC<PasswordCardProps> = ({ moduleKey, name, description, icon }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleUpdate = () => {
    if (!newPassword) {
      setMessage({ text: 'Password cannot be empty', type: 'error' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    // Save to localStorage
    localStorage.setItem(`${moduleKey}_password`, newPassword);
    
    // Clear the current session so the lock screen appears immediately on next visit
    sessionStorage.removeItem(`${moduleKey}_unlocked`);
    
    setMessage({ text: 'Password updated successfully!', type: 'success' });
    setNewPassword('');
    setConfirmPassword('');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="security-card">
      <div className="security-card-header">
        <div className="security-icon">
          {icon}
        </div>
        <div>
          <h3>{name}</h3>
          <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{description}</span>
        </div>
      </div>

      <div className="form-group-vertical">
        <label>New Password</label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type={showNewPassword ? "text" : "password"}
            name={`new-password-${moduleKey}`}
            autoComplete="new-password"
            className="form-control" 
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <button 
            type="button" 
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-light)',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px'
            }}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="form-group-vertical" style={{ marginTop: '12px' }}>
        <label>Confirm Password</label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type={showConfirmPassword ? "text" : "password"}
            name={`confirm-password-${moduleKey}`}
            autoComplete="new-password"
            className="form-control" 
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <button 
            type="button" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-light)',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px'
            }}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{ 
          color: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)', 
          fontSize: '13px', 
          fontWeight: 600,
          marginTop: '4px'
        }}>
          {message.text}
        </div>
      )}

      <button className="btn-update" onClick={handleUpdate}>Update Password</button>
    </div>
  );
};

const SecurityPasswords: React.FC = () => {
  const modules = [
    { moduleKey: 'admin', name: 'Admin Module', icon: <Settings size={24} />, description: 'Master control access' },
    { moduleKey: 'medical', name: 'Medical Module', icon: <Pill size={24} />, description: 'Pharmacy & Stock access' },
    { moduleKey: 'lab', name: 'Lab Module', icon: <TestTube2 size={24} />, description: 'Laboratory access' },
    { moduleKey: 'scan', name: 'Scan Module', icon: <Activity size={24} />, description: 'X-Ray & Scans access' }
  ];

  return (
    <div className="security-container page-transition">
      <div className="security-header">
        <ShieldAlert size={40} />
        <div>
          <h2>Security & Passwords</h2>
          <p>Set and manage access credentials for hospital modules</p>
        </div>
      </div>

      <div className="security-grid">
        {modules.map((mod) => (
          <PasswordCard 
            key={mod.moduleKey}
            moduleKey={mod.moduleKey}
            name={mod.name}
            description={mod.description}
            icon={mod.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default SecurityPasswords;
