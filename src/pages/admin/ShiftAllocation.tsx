import React, { useState } from 'react';
import { 
  Clock, Calendar, Users, ShieldAlert, CheckCircle, 
  Search, Filter, ArrowUpDown, Plus, Download, Printer, 
  RotateCcw, AlertCircle, Briefcase, FileText
} from 'lucide-react';
import './ShiftAllocation.css';

export interface ShiftRosterItem {
  id: string;
  empId: string;
  staffName: string;
  role: string;
  department: string;
  shiftType: 'Morning' | 'Evening' | 'Night' | 'Emergency' | 'Off Day';
  shiftTiming: string;
  assignedWard: string;
  fromDate: string;
  toDate: string;
  remarks: string;
}

const INITIAL_ROSTER: ShiftRosterItem[] = [
  {
    id: 'RST-101',
    empId: 'EMP001',
    staffName: 'Dr. Kumar',
    role: 'Doctor',
    department: 'Cardiology',
    shiftType: 'Morning',
    shiftTiming: '08:00 AM - 04:00 PM',
    assignedWard: 'Cath Lab / Cardiology OPD 1',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Morning surgical rounds & consultations'
  },
  {
    id: 'RST-102',
    empId: 'EMP-001',
    staffName: 'Dr. Sarah Jenkins',
    role: 'Doctor',
    department: 'Cardiology',
    shiftType: 'Morning',
    shiftTiming: '08:00 AM - 04:00 PM',
    assignedWard: 'Cardiology OPD 2',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Routine OPD consultations'
  },
  {
    id: 'RST-103',
    empId: 'EMP002',
    staffName: 'Priya',
    role: 'Nurse',
    department: 'ICU',
    shiftType: 'Night',
    shiftTiming: '10:00 PM - 06:00 AM',
    assignedWard: 'Main ICU - Bed 1 to 6',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Night shift critical care monitoring'
  },
  {
    id: 'RST-104',
    empId: 'EMP-002',
    staffName: 'James Miller',
    role: 'Nurse',
    department: 'ICU',
    shiftType: 'Morning',
    shiftTiming: '08:00 AM - 04:00 PM',
    assignedWard: 'Emergency Care Unit',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Trauma & ER nursing'
  },
  {
    id: 'RST-105',
    empId: 'EMP003',
    staffName: 'Ravi',
    role: 'Pharmacy',
    department: 'Pharmacy',
    shiftType: 'Morning',
    shiftTiming: '08:00 AM - 04:00 PM',
    assignedWard: 'Central Pharmacy',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Dispensary & stock inventory'
  },
  {
    id: 'RST-106',
    empId: 'EMP004',
    staffName: 'Anita Sharma',
    role: 'Receptionist',
    department: 'Front Desk',
    shiftType: 'Evening',
    shiftTiming: '02:00 PM - 10:00 PM',
    assignedWard: 'Main Lobby Help Desk',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'OPD registration & patient billing'
  },
  {
    id: 'RST-107',
    empId: 'EMP005',
    staffName: 'Suresh',
    role: 'Lab',
    department: 'Laboratory',
    shiftType: 'Morning',
    shiftTiming: '08:00 AM - 04:00 PM',
    assignedWard: 'Pathology Lab 1',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Blood sample processing'
  },
  {
    id: 'RST-108',
    empId: 'EMP006',
    staffName: 'Dr. Sarah',
    role: 'Doctor',
    department: 'Neurology',
    shiftType: 'Emergency',
    shiftTiming: '24 Hours On-Call',
    assignedWard: 'Neurology ER Duty',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Covering stroke emergency cases'
  },
  {
    id: 'RST-109',
    empId: 'EMP007',
    staffName: 'Ramesh Admin',
    role: 'Admin',
    department: 'Management',
    shiftType: 'Morning',
    shiftTiming: '08:00 AM - 04:00 PM',
    assignedWard: 'Admin Office Floor 2',
    fromDate: '2026-07-26',
    toDate: '2026-08-01',
    remarks: 'Hospital operations management'
  }
];

const ShiftAllocation: React.FC = () => {
  const [rosterList, setRosterList] = useState<ShiftRosterItem[]>(INITIAL_ROSTER);
  const [search, setSearch] = useState('');
  const [filterShift, setFilterShift] = useState('All');
  const [filterDept, setFilterDept] = useState('All');

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [shiftType, setShiftType] = useState<'Morning' | 'Evening' | 'Night' | 'Emergency' | 'Off Day'>('Morning');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState('2026-08-02');
  const [assignedWard, setAssignedWard] = useState('OPD Ward 1');
  const [remarks, setRemarks] = useState('');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // Compute Shift Counts
  const morningCount = rosterList.filter(r => r.shiftType === 'Morning').length;
  const eveningCount = rosterList.filter(r => r.shiftType === 'Evening').length;
  const nightCount = rosterList.filter(r => r.shiftType === 'Night').length;
  const emergencyCount = rosterList.filter(r => r.shiftType === 'Emergency').length;

  const handleClearForm = () => {
    setSelectedEmpId('');
    setShiftType('Morning');
    setFromDate(new Date().toISOString().split('T')[0]);
    setToDate('2026-08-02');
    setAssignedWard('OPD Ward 1');
    setRemarks('');
    setIsEditingId(null);
  };

  const handleSelectStaffToEdit = (item: ShiftRosterItem) => {
    setSelectedEmpId(item.empId);
    setShiftType(item.shiftType);
    setFromDate(item.fromDate);
    setToDate(item.toDate);
    setAssignedWard(item.assignedWard);
    setRemarks(item.remarks);
    setIsEditingId(item.id);
  };

  const handleSaveShiftAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) {
      alert('Please select a staff member to allocate shift!');
      return;
    }

    const matchedStaff = rosterList.find(r => r.empId === selectedEmpId);
    const staffName = matchedStaff ? matchedStaff.staffName : `Staff (${selectedEmpId})`;
    const role = matchedStaff ? matchedStaff.role : 'Staff';
    const department = matchedStaff ? matchedStaff.department : 'General';

    let timing = '08:00 AM - 04:00 PM';
    if (shiftType === 'Evening') timing = '02:00 PM - 10:00 PM';
    else if (shiftType === 'Night') timing = '10:00 PM - 06:00 AM';
    else if (shiftType === 'Emergency') timing = '24 Hours On-Call';
    else if (shiftType === 'Off Day') timing = 'Weekly Off';

    const newItem: ShiftRosterItem = {
      id: isEditingId || `RST-${100 + rosterList.length + 1}`,
      empId: selectedEmpId,
      staffName,
      role,
      department,
      shiftType,
      shiftTiming: timing,
      assignedWard: assignedWard || 'General Duty',
      fromDate,
      toDate,
      remarks: remarks || 'Shift allocated by Admin'
    };

    const existingIndex = rosterList.findIndex(r => r.empId === selectedEmpId || r.id === isEditingId);

    if (existingIndex >= 0) {
      const updated = [...rosterList];
      updated[existingIndex] = newItem;
      setRosterList(updated);
      alert(`Shift for ${staffName} updated to ${shiftType} (${timing}) successfully!`);
    } else {
      setRosterList([newItem, ...rosterList]);
      alert(`Shift '${shiftType}' allocated to ${staffName} successfully!`);
    }

    handleClearForm();
  };

  const handleRemoveShift = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove shift allocation for ${name}?`)) {
      setRosterList(rosterList.filter(r => r.id !== id));
    }
  };

  // Filter Roster
  const filteredRoster = rosterList.filter(r => {
    const matchSearch = r.staffName.toLowerCase().includes(search.toLowerCase()) || 
                        r.empId.toLowerCase().includes(search.toLowerCase()) || 
                        r.department.toLowerCase().includes(search.toLowerCase());
    const matchShift = filterShift === 'All' ? true : r.shiftType === filterShift;
    const matchDept = filterDept === 'All' ? true : r.department === filterDept;
    return matchSearch && matchShift && matchDept;
  });

  const handleExportCSV = () => {
    const headers = ['Roster ID', 'EMP ID', 'Staff Name', 'Role', 'Department', 'Shift Type', 'Timing', 'Assigned Ward', 'From Date', 'To Date', 'Remarks'];
    const rows = rosterList.map(r => [
      r.id,
      r.empId,
      `"${r.staffName}"`,
      r.role,
      r.department,
      r.shiftType,
      `"${r.shiftTiming}"`,
      `"${r.assignedWard}"`,
      r.fromDate,
      r.toDate,
      `"${r.remarks}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Staff_Shift_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="shift-alloc-container page-transition">
      {/* Header */}
      <div className="shift-header">
        <div>
          <h2><Clock color="#2563eb" size={28} /> Staff Shift Allocation & Roster</h2>
          <p>Assign, reschedule, and manage duty shifts for doctors, nurses, and hospital personnel</p>
        </div>

        <div className="shift-header-actions">
          <button className="action-btn-mini" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="action-btn-mini" onClick={() => window.print()}>
            <Printer size={14} /> Print Roster
          </button>
        </div>
      </div>

      {/* Shift Overview Cards */}
      <div className="shift-cards-grid">
        <div className="shift-overview-card shift-card-morning">
          <div className="shift-card-header">
            <span className="shift-title">Morning Shift</span>
            <span className="shift-count-badge">{morningCount} Staff</span>
          </div>
          <div className="shift-time-range"><Clock size={14} /> 08:00 AM - 04:00 PM</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Primary OPD & Clinical Duty</div>
        </div>

        <div className="shift-overview-card shift-card-evening">
          <div className="shift-card-header">
            <span className="shift-title">Evening Shift</span>
            <span className="shift-count-badge">{eveningCount} Staff</span>
          </div>
          <div className="shift-time-range"><Clock size={14} /> 02:00 PM - 10:00 PM</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Evening OPD & Ward Care</div>
        </div>

        <div className="shift-overview-card shift-card-night">
          <div className="shift-card-header">
            <span className="shift-title">Night Shift</span>
            <span className="shift-count-badge">{nightCount} Staff</span>
          </div>
          <div className="shift-time-range"><Clock size={14} /> 10:00 PM - 06:00 AM</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Overnight ICU & Emergency</div>
        </div>

        <div className="shift-overview-card shift-card-emergency">
          <div className="shift-card-header">
            <span className="shift-title">Emergency On-Call</span>
            <span className="shift-count-badge">{emergencyCount} Staff</span>
          </div>
          <div className="shift-time-range"><AlertCircle size={14} /> 24 Hours On-Call</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Trauma & Critical Care Duty</div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="shift-workspace-grid">
        {/* Left Form: Shift Allocation */}
        <div className="shift-form-card">
          <div className="shift-form-header">
            <Plus size={18} color="#2563eb" />
            <span>{isEditingId ? 'Edit Shift Allocation' : 'Allocate Shift to Staff'}</span>
          </div>

          <form className="shift-form-body" onSubmit={handleSaveShiftAssignment}>
            <div className="shift-form-group">
              <label>Select Staff Member *</label>
              <select 
                className="shift-form-control"
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
              >
                <option value="">-- Choose Staff Member --</option>
                {rosterList.map(r => (
                  <option key={r.empId} value={r.empId}>
                    {r.staffName} ({r.empId} - {r.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="shift-form-group">
              <label>Shift Type *</label>
              <select 
                className="shift-form-control"
                value={shiftType}
                onChange={e => setShiftType(e.target.value as any)}
              >
                <option value="Morning">Morning Shift (08:00 AM - 04:00 PM)</option>
                <option value="Evening">Evening Shift (02:00 PM - 10:00 PM)</option>
                <option value="Night">Night Shift (10:00 PM - 06:00 AM)</option>
                <option value="Emergency">Emergency On-Call (24 Hours)</option>
                <option value="Off Day">Off Day / Leave</option>
              </select>
            </div>

            <div className="form-row-2col">
              <div className="shift-form-group">
                <label>From Date</label>
                <input 
                  type="date" 
                  className="shift-form-control" 
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
              </div>
              <div className="shift-form-group">
                <label>To Date</label>
                <input 
                  type="date" 
                  className="shift-form-control" 
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="shift-form-group">
              <label>Assigned Ward / Station</label>
              <select 
                className="shift-form-control"
                value={assignedWard}
                onChange={e => setAssignedWard(e.target.value)}
              >
                <option value="Cardiology OPD 1">Cardiology OPD 1</option>
                <option value="Cardiology OPD 2">Cardiology OPD 2</option>
                <option value="Cath Lab">Cath Lab</option>
                <option value="Main ICU - Bed 1 to 6">Main ICU - Bed 1 to 6</option>
                <option value="Emergency Care Unit">Emergency Care Unit</option>
                <option value="Central Pharmacy">Central Pharmacy</option>
                <option value="Pathology Lab 1">Pathology Lab 1</option>
                <option value="Main Lobby Help Desk">Main Lobby Help Desk</option>
                <option value="Admin Office Floor 2">Admin Office Floor 2</option>
                <option value="Neurology ER Duty">Neurology ER Duty</option>
              </select>
            </div>

            <div className="shift-form-group">
              <label>Special Instructions / Remarks</label>
              <textarea 
                className="shift-form-control"
                rows={3}
                placeholder="e.g. Covering emergency surgical rounds"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-assign-shift">
              <CheckCircle size={16} /> {isEditingId ? 'Update Shift Allocation' : 'Assign Shift'}
            </button>

            {isEditingId && (
              <button type="button" className="btn-clear-shift" onClick={handleClearForm}>
                <RotateCcw size={14} /> Cancel Editing
              </button>
            )}
          </form>
        </div>

        {/* Right Section: Roster Table */}
        <div className="roster-card">
          <div className="roster-header">
            <div className="roster-header-left">
              <span style={{ fontWeight: 700, color: '#0f172a' }}>Current Shift Roster</span>
              <input 
                type="text" 
                className="roster-search-input"
                placeholder="Search staff name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                className="action-btn-mini" 
                value={filterShift} 
                onChange={e => setFilterShift(e.target.value)}
              >
                <option value="All">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="Emergency">Emergency</option>
                <option value="Off Day">Off Day</option>
              </select>

              <select 
                className="action-btn-mini" 
                value={filterDept} 
                onChange={e => setFilterDept(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Cardiology">Cardiology</option>
                <option value="ICU">ICU</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Neurology">Neurology</option>
                <option value="Management">Management</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="roster-table">
              <thead>
                <tr>
                  <th>EMP ID</th>
                  <th>Staff Name</th>
                  <th>Department</th>
                  <th>Assigned Shift</th>
                  <th>Timing</th>
                  <th>Assigned Ward</th>
                  <th>Effective Dates</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{item.empId}</td>
                    <td>
                      <a 
                        href={`/staff-detail/${item.empId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}
                      >
                        {item.staffName}
                      </a>
                    </td>
                    <td>{item.department}</td>
                    <td>
                      <span className={`shift-badge ${item.shiftType.toLowerCase().replace(' ', '')}`}>
                        ● {item.shiftType}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>{item.shiftTiming}</td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{item.assignedWard}</td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>{item.fromDate} to {item.toDate}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="action-btn-mini" 
                          title="Edit Shift"
                          onClick={() => handleSelectStaffToEdit(item)}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn-mini" 
                          style={{ color: '#dc2626' }}
                          title="Remove Shift"
                          onClick={() => handleRemoveShift(item.id, item.staffName)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No shift roster records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftAllocation;
