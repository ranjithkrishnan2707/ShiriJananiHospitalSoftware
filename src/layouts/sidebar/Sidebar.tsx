import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Bed, 
  Pill, 
  TestTube2, 
  Activity, 
  Users, 
  Receipt, 
  Settings,
  BriefcaseMedical,
  ChevronDown,
  ClipboardList
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { prescriptions, labRequests, scanRequests, openDoctorListModal } = useHospital();
  const navigate = useNavigate();

  // Accordion state for attendance
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending').length;
  const pendingLabs = labRequests.filter(l => l.status === 'Pending').length;
  const pendingScans = scanRequests.filter(s => s.status === 'Pending').length;

  // Dummy notification counts for Attendance
  const lateEmployees = 3;
  const leaveRequests = 2;
  const missingCheckOut = 1;
  const totalAttendanceNotifs = lateEmployees + leaveRequests + missingCheckOut;

  const handleAttendanceSubMenuClick = (filter: string) => {
    // In a real app, you would pass this filter via URL params or global state
    navigate(`/attendance?filter=${filter}`);
  };

  const topMenuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/opd', name: 'OPD', icon: <Stethoscope size={20} /> },
    { path: '/ipd', name: 'IPD', icon: <Bed size={20} /> },
    { path: '/doctor', name: 'Doctor', icon: <BriefcaseMedical size={20} /> },
    { path: '/medical', name: 'Medical', icon: <Pill size={20} /> },
    { path: '/lab', name: 'Lab', icon: <TestTube2 size={20} /> },
    { path: '/scan', name: 'Scan', icon: <Activity size={20} /> },
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

          {/* Accordion Menu: Staff Attendance */}
          <li>
            <div 
              className="sidebar-accordion-header" 
              onClick={() => {
                setIsAttendanceOpen(!isAttendanceOpen);
                if (!isAttendanceOpen) {
                  navigate('/attendance');
                }
              }}
            >
              <span className="sidebar-icon"><Users size={20} /></span>
              <span className="sidebar-text">Staff Attendance</span>
              {totalAttendanceNotifs > 0 && !isAttendanceOpen && (
                <span className="notification-badge">{totalAttendanceNotifs}</span>
              )}
              <ChevronDown 
                size={16} 
                className={`accordion-arrow ${isAttendanceOpen ? 'open' : ''}`} 
                style={{ marginLeft: totalAttendanceNotifs > 0 && !isAttendanceOpen ? '8px' : 'auto' }}
              />
            </div>
            
            <div className={`sidebar-submenu ${isAttendanceOpen ? 'open' : ''}`}>
              <a href="#" className="submenu-link" onClick={(e) => { e.preventDefault(); handleAttendanceSubMenuClick('late'); }}>
                Late Employees
                <span className="submenu-badge" style={{ backgroundColor: '#FF9800' }}>{lateEmployees}</span>
              </a>
              <a href="#" className="submenu-link" onClick={(e) => { e.preventDefault(); handleAttendanceSubMenuClick('leave'); }}>
                Leave Requests
                <span className="submenu-badge" style={{ backgroundColor: '#2196F3' }}>{leaveRequests}</span>
              </a>
              <a href="#" className="submenu-link" onClick={(e) => { e.preventDefault(); handleAttendanceSubMenuClick('missing'); }}>
                Missing Check-Out
                <span className="submenu-badge">{missingCheckOut}</span>
              </a>
            </div>
          </li>

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

          {/* Quick Doctor List Modal Trigger */}
          <li>
            <div 
              className="sidebar-link"
              onClick={openDoctorListModal}
              style={{ cursor: 'pointer', color: '#0284c7' }}
              title="Open Doctor Details Modal"
            >
              <span className="sidebar-icon"><ClipboardList size={20} /></span>
              <span className="sidebar-text" style={{ fontWeight: 600 }}>Doctor List</span>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
