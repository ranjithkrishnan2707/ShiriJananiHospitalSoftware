import React, { useState, useEffect } from 'react';
import { LockKeyhole, Eye, EyeOff } from 'lucide-react';
import './ProtectedModule.css';

interface ProtectedModuleProps {
  moduleKey: string;
  moduleName: string;
  children: React.ReactNode;
}

const ProtectedModule: React.FC<ProtectedModuleProps> = ({ moduleKey, moduleName, children }) => {
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const savedPassword = localStorage.getItem(`${moduleKey}_password`);
    return !!savedPassword;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear any obsolete session unlocks so every navigation requires password entry
    sessionStorage.removeItem(`${moduleKey}_unlocked`);
    const savedPassword = localStorage.getItem(`${moduleKey}_password`);
    if (savedPassword) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  }, [moduleKey]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem(`${moduleKey}_password`);
    
    if (passwordInput === savedPassword) {
      // Success: Unlock for current page view
      setIsLocked(false);
      setError('');
      setPasswordInput('');
    } else {
      // Error
      setError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="protected-container page-transition">
      <div className="lock-card">
        <div className="lock-icon-container">
          <div className="lock-icon">
            <LockKeyhole size={40} />
          </div>
        </div>
        
        <div className="lock-header">
          <h2>{moduleName} Locked</h2>
          <p>Please enter the administrative password to access this module.</p>
        </div>

        <form className="lock-form" onSubmit={handleUnlock}>
          <div className="password-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              name={`password_${moduleKey}`}
              autoComplete="new-password"
              className={`password-input ${error ? 'input-error' : ''}`}
              placeholder="Enter Password" 
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setError(''); // Clear error when typing
              }}
              autoFocus
            />
            <button 
              type="button" 
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-light)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="error-message">{error}</div>
          <button type="submit" className="btn-unlock">Unlock Module</button>
        </form>
      </div>
    </div>
  );
};

export default ProtectedModule;
