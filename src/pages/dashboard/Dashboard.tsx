import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Bed, 
  Pill, 
  TestTube2, 
  Activity, 
  Users, 
  Receipt, 
  Settings,
  ArrowRight,
  BriefcaseMedical
} from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'OPD', path: '/opd', icon: <Stethoscope size={32} />, desc: 'Out Patient Dept', color: '#4CAF50' },
    { name: 'IPD', path: '/ipd', icon: <Bed size={32} />, desc: 'In Patient Dept', color: '#2196F3' },
    { name: 'Doctor', path: '/doctor', icon: <BriefcaseMedical size={32} />, desc: 'Doctor Module', color: '#00BCD4' },
    { name: 'Medical', path: '/medical', icon: <Pill size={32} />, desc: 'Pharmacy & Stock', color: '#9C27B0' },
    { name: 'Lab', path: '/lab', icon: <TestTube2 size={32} />, desc: 'Laboratory Tests', color: '#F44336' },
    { name: 'Scan', path: '/scan', icon: <Activity size={32} />, desc: 'X-Ray & Scans', color: '#FF9800' },
    { name: 'Attendance', path: '/attendance', icon: <Users size={32} />, desc: 'Staff Management', color: '#795548' },
    { name: 'Billing', path: '/billing', icon: <Receipt size={32} />, desc: 'Patient Invoices', color: '#607D8B' },
    { name: 'Admin', path: '/admin', icon: <Settings size={32} />, desc: 'System Settings', color: '#E91E63' }
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-container page-transition">
      <div className="welcome-card card">
        <div className="welcome-content">
          <div>
            <h2 className="welcome-title" style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Welcome, Admin!</h2>
            <p className="welcome-subtitle">Here is what's happening at SHIRI JANANI HOSPITALS today.</p>
            <p className="welcome-date">{currentDate}</p>
            
            <div style={{ marginTop: '24px' }}>
              <button 
                className="btn-add-patient-dash" 
                onClick={() => navigate('/opd')}
              >
                + Add New Patient
              </button>
            </div>
          </div>
          <div className="welcome-graphic">
             <img src="/logo.png" alt="SHIRI JANANI HOSPITALS Logo" className="dash-large-logo-img" />
          </div>
        </div>
      </div>

      <div className="section-title">
        <h3>Quick Access</h3>
        <span className="section-subtitle">Manage modules</span>
      </div>

      <div className="quick-links-grid">
        {quickLinks.map((link) => (
          <div 
            key={link.path} 
            className="card clickable-card quick-link-card"
            onClick={() => navigate(link.path)}
          >
            <div className="icon-wrapper" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
              {link.icon}
            </div>
            <div className="quick-link-info">
              <h4>{link.name}</h4>
              <p>{link.desc}</p>
            </div>
            <div className="quick-link-arrow">
              <ArrowRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
