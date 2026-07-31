import React from 'react';
import { NavLink } from 'react-router-dom';
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
  BriefcaseMedical
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { prescriptions, labRequests, scanRequests } = useHospital();

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

  const bottomMenuItems = [
    { path: '/billing', name: 'Patient Billing History', icon: <Receipt size={20} /> },
    { path: '/admin', name: 'Admin', icon: <Settings size={20} /> },
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

          {bottomMenuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
