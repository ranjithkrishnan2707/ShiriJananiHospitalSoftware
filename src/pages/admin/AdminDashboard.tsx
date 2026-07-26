import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Users, ShieldAlert, Clock } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    { 
      title: 'Monitor Billing Details', 
      desc: 'View comprehensive billing reports and revenue analytics',
      path: '/admin/monitor-billing', 
      icon: <LineChart size={36} /> 
    },
    { 
      title: 'Manage Staff & Doctors', 
      desc: 'Add, edit, or remove hospital staff and doctor profiles',
      path: '/admin/manage-staff', 
      icon: <Users size={36} /> 
    },
    { 
      title: 'Staff Shift Allocation', 
      desc: 'Assign and schedule Morning, Evening, Night, or Emergency shifts to staff',
      path: '/admin/shift-allocation', 
      icon: <Clock size={36} /> 
    },
    { 
      title: 'Security & Passwords', 
      desc: 'Set credentials for Medical, Scan, Lab, and Admin modules',
      path: '/admin/security', 
      icon: <ShieldAlert size={36} /> 
    }
  ];

  return (
    <div className="admin-dashboard-container page-transition">
      <div className="admin-dashboard-header">
        <h2>Admin Panel</h2>
        <p>Manage hospital settings, personnel, and security</p>
      </div>

      <div className="admin-options-grid">
        {options.map((option, index) => (
          <div 
            key={index} 
            className="admin-option-card"
            onClick={() => navigate(option.path)}
          >
            <div className="admin-option-icon">
              {option.icon}
            </div>
            <div>
              <h3 className="admin-option-title">{option.title}</h3>
              <p className="admin-option-desc">{option.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
