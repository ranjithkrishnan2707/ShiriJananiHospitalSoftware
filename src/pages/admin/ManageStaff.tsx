import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './ManageStaff.css';

interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  phone: string;
  department: string;
  shift?: string;
  joinDate: string;
}

const initialStaff: Staff[] = [
  { id: 'EMP-001', name: 'Dr. Sarah Jenkins', role: 'Doctor', specialization: 'Cardiology', phone: '9876543210', department: 'Cardiology', shift: 'Morning', joinDate: '2023-01-15' },
  { id: 'EMP-002', name: 'James Miller', role: 'Nurse', specialization: '', phone: '8765432109', department: 'ICU', shift: 'Morning', joinDate: '2023-03-10' },
  { id: 'EMP-003', name: 'Anita Kumar', role: 'Receptionist', specialization: '', phone: '7654321098', department: 'Front Desk', shift: 'Evening', joinDate: '2024-05-20' },
  { id: 'EMP-004', name: 'Dr. Rajiv Menon', role: 'Doctor', specialization: 'Neurology', phone: '6543210987', department: 'Neurology', shift: 'Emergency', joinDate: '2022-11-05' },
];

const ManageStaff: React.FC = () => {
  const { openDoctorListModal } = useHospital();
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const cached = localStorage.getItem('sjh_cached_staff');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse cached staff list', e);
      }
    }
    return initialStaff;
  });

  useEffect(() => {
    localStorage.setItem('sjh_cached_staff', JSON.stringify(staffList));
  }, [staffList]);

  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Doctor');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [shift, setShift] = useState('Morning');
  const [joinDate, setJoinDate] = useState('');

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'doctor': return 'role-doctor';
      case 'nurse': return 'role-nurse';
      case 'receptionist': return 'role-reception';
      default: return 'role-other';
    }
  };

  const handleClear = () => {
    setEmpId('');
    setName('');
    setRole('Doctor');
    setSpecialization('');
    setPhone('');
    setDepartment('');
    setShift('Morning');
    setJoinDate('');
    setIsEditing(false);
  };

  const handleEdit = (staff: Staff) => {
    setEmpId(staff.id);
    setName(staff.name);
    setRole(staff.role);
    setSpecialization(staff.specialization || '');
    setPhone(staff.phone);
    setDepartment(staff.department);
    setShift(staff.shift || 'Morning');
    setJoinDate(staff.joinDate);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const targetId = empId.trim() ? empId.trim() : `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newStaff: Staff = {
      id: targetId,
      name,
      role,
      specialization,
      phone,
      department: department || 'General',
      shift,
      joinDate: joinDate || new Date().toISOString().split('T')[0]
    };

    let updatedList: Staff[];
    if (isEditing || staffList.some(s => s.id === targetId)) {
      updatedList = staffList.map(s => s.id === targetId ? newStaff : s);
      alert(`Staff profile for ${name} updated successfully!`);
    } else {
      updatedList = [newStaff, ...staffList];
      alert(`Staff member ${name} registered successfully!`);
    }

    setStaffList(updatedList);
    localStorage.setItem('sjh_cached_staff', JSON.stringify(updatedList));
    handleClear();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      const updatedList = staffList.filter(s => s.id !== id);
      setStaffList(updatedList);
      localStorage.setItem('sjh_cached_staff', JSON.stringify(updatedList));
      if (empId === id) handleClear();
    }
  };

  return (
    <div className="manage-staff-container page-transition">
      
      {/* Left: Registration Form */}
      <div className="card" style={{ padding: 0 }}>
        <div className="staff-form-header">
          <h3>{isEditing ? 'Edit Staff / Doctor' : 'Register Staff / Doctor'}</h3>
        </div>
        <form className="staff-form-body" onSubmit={handleSave}>
          <div className="staff-form-group">
            <label>Employee ID</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Auto-generated if empty" 
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              disabled={isEditing}
            />
          </div>

          <div className="staff-form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter full name" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="staff-form-group">
            <label>Role *</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {role === 'Doctor' && (
            <div className="staff-form-group">
              <label>Specialization</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., Cardiology, General" 
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
          )}

          <div className="staff-form-group">
            <label>Department</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g., ICU, Front Desk" 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="staff-form-group">
            <label>Assigned Shift</label>
            <select 
              className="form-control" 
              value={shift} 
              onChange={(e) => setShift(e.target.value)}
            >
              <option value="Morning">Morning Shift (08:00 AM - 04:00 PM)</option>
              <option value="Evening">Evening Shift (02:00 PM - 10:00 PM)</option>
              <option value="Night">Night Shift (10:00 PM - 06:00 AM)</option>
              <option value="Emergency">Emergency On-Call (24 Hrs)</option>
            </select>
          </div>

          <div className="staff-form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              className="form-control" 
              placeholder="Enter 10-digit number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="staff-form-group">
            <label>Joining Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
            />
          </div>

          <div className="staff-form-actions">
            <button type="submit" className="btn-save">{isEditing ? 'Update Profile' : 'Save Profile'}</button>
            <button type="button" className="btn-clear" onClick={handleClear}>Clear</button>
          </div>
        </form>
      </div>

      {/* Right: Data Table */}
      <div className="card staff-list-section" style={{ padding: 0 }}>
        <div className="staff-list-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', gap: '12px' }}>
          <h3 style={{ margin: 0 }}>Staff Directory</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search by name, ID, or role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              type="button"
              className="btn-save"
              onClick={openDoctorListModal}
              style={{ backgroundColor: '#0284c7', padding: '8px 14px', fontSize: '13px', whiteSpace: 'nowrap', width: 'auto' }}
              title="Open Doctor Master List"
            >
              📋 Doctor Master List
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="staff-table">
            <thead>
              <tr>
                <th>EMP ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Assigned Shift</th>
                <th>Phone</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{staff.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      <a 
                        href={`/staff-detail/${staff.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Click to open full staff profile in new tab"
                        style={{ color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {staff.name}
                        <ExternalLink size={13} style={{ opacity: 0.7 }} />
                      </a>
                    </div>
                    {staff.specialization && <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{staff.specialization}</div>}
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(staff.role)}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td>{staff.department}</td>
                  <td>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '10px', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      background: staff.shift === 'Night' ? '#f1f5f9' : staff.shift === 'Evening' ? '#ede9fe' : staff.shift === 'Emergency' ? '#fee2e2' : '#dbeafe',
                      color: staff.shift === 'Night' ? '#0f172a' : staff.shift === 'Evening' ? '#5b21b6' : staff.shift === 'Emergency' ? '#991b1b' : '#1e40af'
                    }}>
                      {staff.shift || 'Morning'}
                    </span>
                  </td>
                  <td>{staff.phone}</td>
                  <td>{staff.joinDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Edit" onClick={() => handleEdit(staff)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon" title="Delete" onClick={() => handleDelete(staff.id)}>
                        <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-light)' }}>
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageStaff;
