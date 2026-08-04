import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { Bell, User, Calendar, Clock, Check, X, Shield, Lock, ArrowLeft } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'prescription' | 'lab' | 'scan' | 'system';
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { prescriptions } = useHospital();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMasterMenu, setShowMasterMenu] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'New Prescription Created', desc: 'Dr. Sarah created a prescription for Rajesh Kumar', time: '10 mins ago', read: false, type: 'prescription' },
    { id: '2', title: 'Lab Test Requested', desc: 'Lipid Profile test pending for UHID-1001', time: '25 mins ago', read: false, type: 'lab' },
    { id: '3', title: 'Staff Shift Alert', desc: '3 employees arrived late today', time: '1 hour ago', read: false, type: 'system' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update notification list if new prescriptions/labs arrive
  useEffect(() => {
    const pendingRx = prescriptions.filter(p => p.status === 'Pending');
    if (pendingRx.length > 0) {
      const latest = pendingRx[0];
      setNotifications(prev => {
        if (prev.some(n => n.id === `rx-${latest.id}`)) return prev;
        return [
          {
            id: `rx-${latest.id}`,
            title: `New Rx: ${latest.patientName}`,
            desc: `Medicines: ${latest.medicines}`,
            time: `${latest.time}`,
            read: false,
            type: 'prescription'
          },
          ...prev
        ];
      });
    }
  }, [prescriptions]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLockScreen = () => {
    sessionStorage.removeItem('admin_unlocked');
    sessionStorage.removeItem('medical_unlocked');
    sessionStorage.removeItem('lab_unlocked');
    sessionStorage.removeItem('scan_unlocked');
    setShowProfile(false);
    alert('Session Locked. Navigating to Security Settings.');
    navigate('/admin/security');
  };

  return (
    <header className="hospital-header">
      <div className="header-left">
        <div className="logo-placeholder" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">SJH</span>
        </div>
      </div>
      
      <div className="header-center">
        <div style={{ textAlign: 'center' }}>
          <h1 className="hospital-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            SHRI JANANI HOSPITAL
          </h1>
          <div className="top-menu-bar">
            <span className="top-menu-item" onClick={() => navigate('/')}>Company</span>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span 
                className="top-menu-item" 
                onClick={() => setShowMasterMenu(!showMasterMenu)}
                style={{ fontWeight: 600, color: 'var(--color-primary)' }}
              >
                Master ▾
              </span>
              {showMasterMenu && (
                <div className="master-dropdown-menu">
                  <div 
                    className="master-menu-option" 
                    onClick={() => {
                      navigate('/admin/manage-staff');
                      setShowMasterMenu(false);
                    }}
                  >
                    👥 Staff Master
                  </div>
                </div>
              )}
            </div>
            <span className="top-menu-item" onClick={() => navigate('/opd')}>Entry</span>
            <span className="top-menu-item" onClick={() => navigate('/billing')}>Reports</span>
            <span className="top-menu-item" onClick={() => navigate('/opd')}>Search</span>
            <span className="top-menu-item" onClick={() => navigate('/')}>Exit</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="datetime-widget">
          <div className="date">
            <Calendar size={16} />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="time">
            <Clock size={16} />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="user-info">
          <span className="user-name">Dr. Admin</span>
        </div>

        {/* Notifications Button & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            title="System Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="header-dropdown-menu notifications-popover card">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button className="btn-text" onClick={markAllAsRead}>
                    <Check size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                      <div className="notif-content">
                        <strong>{n.title}</strong>
                        <p>{n.desc}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                      <button className="btn-dismiss" onClick={() => dismissNotification(n.id)} title="Dismiss">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button & Modal */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn profile-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            title="Admin User Profile"
          >
            <User size={20} />
          </button>

          {showProfile && (
            <div className="header-dropdown-menu profile-popover card">
              <div className="profile-popover-header">
                <div className="avatar-large">DA</div>
                <div>
                  <h4>Dr. Admin</h4>
                  <span className="badge-role">System Administrator</span>
                </div>
              </div>

              <div className="profile-details-list">
                <div className="detail-row">
                  <span>Shift Status:</span> <strong>Active (Morning)</strong>
                </div>
                <div className="detail-row">
                  <span>Logged in since:</span> <strong>08:00 AM</strong>
                </div>
                <div className="detail-row">
                  <span>Access Level:</span> <strong>Full Master Access</strong>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-profile-action" onClick={() => { setShowProfile(false); navigate('/admin/security'); }}>
                  <Shield size={16} /> Security Settings
                </button>
                <button className="btn-profile-action btn-lock" onClick={handleLockScreen}>
                  <Lock size={16} /> Lock Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Button (Right Corner) */}
        <button 
          type="button"
          className="header-back-btn" 
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }} 
          title="Go back / Close tab"
          style={{ marginLeft: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
