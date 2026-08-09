import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Users, ShieldAlert, Clock, Stethoscope, ArrowLeft, UserCheck, Wallet } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { openDoctorListModal } = useHospital();

  const options = [
    { 
      title: 'Monitor Billing Details', 
      desc: 'View comprehensive billing reports and revenue analytics',
      path: '/admin/monitor-billing', 
      icon: <LineChart size={36} /> 
    },
    { 
      title: 'Expense Monitor', 
      desc: 'View complete expense history, department spending, and financial logs',
      path: '/admin/expenses', 
      icon: <Wallet size={36} /> 
    },
    { 
      title: 'Manage Staff', 
      desc: 'Add, edit, or remove hospital staff profiles',
      path: '/admin/manage-staff', 
      icon: <Users size={36} /> 
    },
    { 
      title: 'Staff Attendance', 
      desc: 'Track daily attendance, mark present/absent/leave status, and review history',
      path: '/admin/staff-attendance', 
      icon: <UserCheck size={36} /> 
    },
    { 
      title: 'Doctor Master List', 
      desc: 'Manage referring and consulting doctor directory',
      onClick: openDoctorListModal,
      icon: <Stethoscope size={36} /> 
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Admin Panel</h2>
            <p style={{ margin: '4px 0 0 0' }}>Manage hospital settings, personnel, and security</p>
          </div>
          <button 
            type="button"
            className="btn-back-page" 
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="admin-options-grid">
        {options.map((option, index) => (
          <div 
            key={index} 
            className="admin-option-card"
            onClick={() => option.onClick ? option.onClick() : option.path && navigate(option.path)}
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
