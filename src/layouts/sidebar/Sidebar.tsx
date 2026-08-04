import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Bed, 
  Pill, 
  TestTube2, 
  Activity, 
  UserCheck,
  Receipt, 
  Settings,
  BriefcaseMedical,
  ChevronDown
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { prescriptions, labRequests, scanRequests } = useHospital();
  
  const isAdminActive = location.pathname.startsWith('/admin');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(isAdminActive);

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
  const pendingLabs = labRequests.filter(l => l.status === 'Pending').length;
  const pendingScans = scanRequests.filter(s => s.status === 'Pending').length;

  const topMenuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/opd', name: 'OPD', icon: <Stethoscope size={20} /> },
    { path: '/ipd', name: 'IPD', icon: <Bed size={20} /> },
    { path: '/doctor', name: 'Doctor', icon: <BriefcaseMedical size={20} /> },
    { path: '/medical', name: 'Medical', icon: <Pill size={20} /> },
    { path: '/lab', name: 'Lab', icon: <TestTube2 size={20} /> },
    { path: '/scan', name: 'Scan', icon: <Activity size={20} /> },
    { path: '/attendance', name: 'Attendance', icon: <UserCheck size={20} /> },
  ];

  const adminSubItems = [
    { path: '/admin', name: 'Admin Panel Overview', exact: true },
    { path: '/admin/staff-attendance', name: 'Staff Attendance' },
    { path: '/admin/manage-staff', name: 'Manage Staff' },
    { path: '/admin/monitor-billing', name: 'Monitor Billing' },
    { path: '/admin/shift-allocation', name: 'Shift Allocation' },
    { path: '/admin/security', name: 'Security & Passwords' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {topMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
                
                {/* Notification Badges */}
                {item.name === 'Medical' && pendingPrescriptions > 0 && (
                  <span className="notification-badge">{pendingPrescriptions}</span>
                )}
                {item.name === 'Lab' && pendingLabs > 0 && (
                  <span className="notification-badge">{pendingLabs}</span>
                )}
                {item.name === 'Scan' && pendingScans > 0 && (
                  <span className="notification-badge">{pendingScans}</span>
                )}
              </NavLink>
            </li>
          ))}

          <li>
            <NavLink 
              to="/billing" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><Receipt size={20} /></span>
              <span className="sidebar-text">Patient Billing History</span>
            </NavLink>
          </li>

          {/* Admin Accordion Menu */}
          <li>
            <div 
              className={`sidebar-accordion-header ${isAdminActive ? 'active' : ''}`}
              onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
              <span className="sidebar-icon"><Settings size={20} /></span>
              <span className="sidebar-text">Admin</span>
              <ChevronDown 
                size={18} 
                className={`accordion-arrow ${isAdminOpen ? 'open' : ''}`} 
              />
            </div>

            <div className={`sidebar-submenu ${isAdminOpen ? 'open' : ''}`}>
              {adminSubItems.map((sub) => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  end={sub.exact}
                  className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    color: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.75)',
                    fontWeight: isActive ? 700 : 500
                  })}
                >
                  {sub.name}
                </NavLink>
              ))}
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
