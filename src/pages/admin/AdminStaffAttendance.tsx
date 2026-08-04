import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, Calendar, Search, Filter, 
  ArrowLeft, Clock, FileText, CheckCircle2, XCircle, 
  AlertCircle, Edit2, X, ExternalLink, CalendarDays,
  Percent, Check, Printer, Download, RefreshCw, Save
} from 'lucide-react';
import './AdminStaffAttendance.css';

// --- Data Models ---
export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  role: string;
  shift: string;
  photoColor: string;
}

export interface DailyAttendanceRecord {
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  remarks: string;
}

export interface AttendanceHistoryEntry {
  date: string;
  day: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  remarks: string;
}

// Initial Staff Dataset
const INITIAL_STAFF_LIST: StaffMember[] = [
  { id: 'EMP-001', name: 'Dr. Sarah Jenkins', department: 'Cardiology', role: 'Doctor', shift: 'Morning', photoColor: '#2563eb' },
  { id: 'EMP-002', name: 'Priya Sharma', department: 'ICU', role: 'Nurse', shift: 'Night', photoColor: '#ec4899' },
  { id: 'EMP-003', name: 'Ravi Kumar', department: 'Pharmacy', role: 'Pharmacist', shift: 'Morning', photoColor: '#8b5cf6' },
  { id: 'EMP-004', name: 'Anita Verma', department: 'Front Desk', role: 'Receptionist', shift: 'Evening', photoColor: '#06b6d4' },
  { id: 'EMP-005', name: 'Suresh Patel', department: 'Laboratory', role: 'Lab Technician', shift: 'Morning', photoColor: '#f97316' },
  { id: 'EMP-006', name: 'Dr. Rajiv Menon', department: 'Neurology', role: 'Doctor', shift: 'Evening', photoColor: '#16a34a' },
  { id: 'EMP-007', name: 'Ramesh Admin', department: 'Management', role: 'Admin', shift: 'Morning', photoColor: '#64748b' },
  { id: 'EMP-008', name: 'Kavitha Nathan', department: 'Pediatrics', role: 'Nurse', shift: 'Morning', photoColor: '#0284c7' },
];

// Initial Attendance Database Records
const INITIAL_ATTENDANCE: Record<string, DailyAttendanceRecord> = {
  'EMP-001': { status: 'Present', checkIn: '08:00 AM', checkOut: '04:00 PM', totalHours: '8h 0m', remarks: 'On time' },
  'EMP-002': { status: 'Absent', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', remarks: 'Uninformed absence' },
  'EMP-003': { status: 'Present', checkIn: '08:15 AM', checkOut: '04:30 PM', totalHours: '8h 15m', remarks: '' },
  'EMP-004': { status: 'Leave', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', remarks: 'Sick leave approved' },
  'EMP-005': { status: 'Present', checkIn: '07:55 AM', checkOut: '04:00 PM', totalHours: '8h 5m', remarks: 'Early check-in' },
  'EMP-006': { status: 'Present', checkIn: '01:50 PM', checkOut: '09:50 PM', totalHours: '8h 0m', remarks: 'Evening shift' },
  'EMP-007': { status: 'Present', checkIn: '08:30 AM', checkOut: '05:30 PM', totalHours: '9h 0m', remarks: '' },
  'EMP-008': { status: 'Leave', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', remarks: 'Casual leave' },
};

// Generates historical attendance records for staff member
const generateStaffHistory = (staff: StaffMember): AttendanceHistoryEntry[] => {
  const history: AttendanceHistoryEntry[] = [];
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 15; i++) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - i);
    const dayOfWeek = dateObj.getDay();
    const dateStr = dateObj.toISOString().split('T')[0];
    const dayName = dayNames[dayOfWeek];

    let status: AttendanceStatus = 'Present';
    let checkIn = '08:00 AM';
    let checkOut = '04:00 PM';
    let totalHours = '8h 0m';
    let remarks = 'Regular shift';

    if (dayOfWeek === 0) {
      status = 'Leave';
      checkIn = '--:--';
      checkOut = '--:--';
      totalHours = '0h 0m';
      remarks = 'Weekly Off (Sunday)';
    } else if (i === 3) {
      status = 'Leave';
      checkIn = '--:--';
      checkOut = '--:--';
      totalHours = '0h 0m';
      remarks = 'Approved Leave';
    } else if (i === 7) {
      status = 'Absent';
      checkIn = '--:--';
      checkOut = '--:--';
      totalHours = '0h 0m';
      remarks = 'Unexcused Absence';
    } else if (i === 5) {
      status = 'Late';
      checkIn = '09:20 AM';
      checkOut = '05:00 PM';
      totalHours = '7h 40m';
      remarks = 'Traffic delay';
    }

    history.push({
      date: dateStr,
      day: dayName,
      status,
      checkIn,
      checkOut,
      totalHours,
      remarks
    });
  }

  return history;
};

const AdminStaffAttendance: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, DailyAttendanceRecord>>(INITIAL_ATTENDANCE);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // History Drawer State
  const [selectedStaffForHistory, setSelectedStaffForHistory] = useState<StaffMember | null>(null);
  const [historyList, setHistoryList] = useState<AttendanceHistoryEntry[]>([]);

  // Edit Modal State
  const [editStaff, setEditStaff] = useState<StaffMember | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editCheckIn, setEditCheckIn] = useState<string>('');
  const [editCheckOut, setEditCheckOut] = useState<string>('');
  const [editRemarks, setEditRemarks] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick mark status for a single staff member
  const handleQuickMarkStatus = (staffId: string, newStatus: AttendanceStatus) => {
    setAttendanceData(prev => {
      const current = prev[staffId] || { checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', remarks: '' };
      let updatedCheckIn = current.checkIn;
      let updatedCheckOut = current.checkOut;
      let updatedHours = current.totalHours;

      if (newStatus === 'Present') {
        if (updatedCheckIn === '--:--') updatedCheckIn = '08:00 AM';
        if (updatedCheckOut === '--:--') updatedCheckOut = '04:00 PM';
        updatedHours = '8h 0m';
      } else if (newStatus === 'Absent' || newStatus === 'Leave') {
        updatedCheckIn = '--:--';
        updatedCheckOut = '--:--';
        updatedHours = '0h 0m';
      }

      return {
        ...prev,
        [staffId]: {
          ...current,
          status: newStatus,
          checkIn: updatedCheckIn,
          checkOut: updatedCheckOut,
          totalHours: updatedHours
        }
      };
    });

    const staffObj = INITIAL_STAFF_LIST.find(s => s.id === staffId);
    showToast(`Marked ${staffObj?.name || staffId} as ${newStatus}`);
  };

  // Bulk Actions
  const handleMarkAllPresent = () => {
    const updated: Record<string, DailyAttendanceRecord> = {};
    INITIAL_STAFF_LIST.forEach(s => {
      updated[s.id] = { status: 'Present', checkIn: '08:00 AM', checkOut: '04:00 PM', totalHours: '8h 0m', remarks: 'Marked Present' };
    });
    setAttendanceData(updated);
    showToast('Marked all staff members as Present');
  };

  const handleMarkAllAbsent = () => {
    const updated: Record<string, DailyAttendanceRecord> = {};
    INITIAL_STAFF_LIST.forEach(s => {
      updated[s.id] = { status: 'Absent', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', remarks: 'Bulk Absent' };
    });
    setAttendanceData(updated);
    showToast('Marked all staff members as Absent');
  };

  const handleResetAttendance = () => {
    setAttendanceData(INITIAL_ATTENDANCE);
    showToast('Reset attendance records to initial state');
  };

  // Export Daily Report to CSV/Text
  const handleExportCSV = () => {
    let csvContent = "Employee ID,Staff Name,Department,Role,Shift,Date,Status,Check-In,Check-Out,Total Hours,Remarks\n";
    INITIAL_STAFF_LIST.forEach(staff => {
      const rec = attendanceData[staff.id] || { status: 'Present', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', remarks: '' };
      csvContent += `"${staff.id}","${staff.name}","${staff.department}","${staff.role}","${staff.shift}","${selectedDate}","${rec.status}","${rec.checkIn}","${rec.checkOut}","${rec.totalHours}","${rec.remarks}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Staff_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported successfully!');
  };

  // Print Daily Attendance Sheet
  const handlePrintDailySheet = () => {
    window.print();
  };

  // Open History Drawer
  const handleOpenHistory = (staff: StaffMember) => {
    setSelectedStaffForHistory(staff);
    setHistoryList(generateStaffHistory(staff));
  };

  // Open Edit Modal
  const handleOpenEditModal = (staff: StaffMember) => {
    const record = attendanceData[staff.id] || { status: 'Present', checkIn: '08:00 AM', checkOut: '04:00 PM', totalHours: '8h 0m', remarks: '' };
    setEditStaff(staff);
    setEditStatus(record.status);
    setEditCheckIn(record.checkIn);
    setEditCheckOut(record.checkOut);
    setEditRemarks(record.remarks);
  };

  // Save Edit Modal
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaff) return;

    setAttendanceData(prev => ({
      ...prev,
      [editStaff.id]: {
        status: editStatus,
        checkIn: editStatus === 'Absent' || editStatus === 'Leave' ? '--:--' : (editCheckIn || '08:00 AM'),
        checkOut: editStatus === 'Absent' || editStatus === 'Leave' ? '--:--' : (editCheckOut || '04:00 PM'),
        totalHours: editStatus === 'Absent' || editStatus === 'Leave' ? '0h 0m' : '8h 0m',
        remarks: editRemarks
      }
    }));

    showToast(`Updated attendance details for ${editStaff.name}`);
    setEditStaff(null);
  };

  // Metrics Calculations
  const totalStaffCount = INITIAL_STAFF_LIST.length;
  const presentCount = Object.values(attendanceData).filter(r => r.status === 'Present' || r.status === 'Late').length;
  const absentCount = Object.values(attendanceData).filter(r => r.status === 'Absent').length;
  const leaveCount = Object.values(attendanceData).filter(r => r.status === 'Leave').length;
  const presentRate = Math.round((presentCount / totalStaffCount) * 100);

  // Filter Departments List
  const departments = ['All', ...Array.from(new Set(INITIAL_STAFF_LIST.map(s => s.department)))];

  // Filtered Staff List
  const filteredStaff = INITIAL_STAFF_LIST.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || staff.department === deptFilter;
    const staffRecord = attendanceData[staff.id];
    const matchesStatus = statusFilter === 'All' || (staffRecord && staffRecord.status === statusFilter);

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="admin-attendance-container page-transition">
      {/* Success Toast Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '14px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <CheckCircle2 size={18} color="#4ade80" /> {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-attendance-header">
        <div className="admin-attendance-title">
          <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '10px' }}>
            <UserCheck size={28} />
          </div>
          <div>
            <h2>Staff Attendance Management</h2>
            <p>Track, mark, and analyze daily hospital personnel attendance records</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="date-picker-box">
            <Calendar size={18} color="#0f766e" />
            <span>Date:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)} 
            />
          </div>

          <button 
            type="button" 
            className="btn-bulk"
            onClick={handleExportCSV}
            style={{ backgroundColor: '#0284c7', color: 'white' }}
            title="Export Attendance Sheet to CSV"
          >
            <Download size={16} /> Export CSV
          </button>

          <button 
            type="button" 
            className="btn-bulk"
            onClick={handlePrintDailySheet}
            style={{ backgroundColor: '#475569', color: 'white' }}
            title="Print Attendance Sheet"
          >
            <Printer size={16} /> Print
          </button>

          <button 
            type="button" 
            className="btn-view-profile"
            onClick={() => navigate('/admin')}
            style={{ backgroundColor: '#1e293b' }}
          >
            <ArrowLeft size={16} /> Back to Admin
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="attendance-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-total">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalStaffCount}</div>
            <div className="stat-label">Total Staff</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-present">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{presentCount}</div>
            <div className="stat-label">Present Today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-absent">
            <UserX size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{absentCount}</div>
            <div className="stat-label">Absent Today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-leave">
            <CalendarDays size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{leaveCount}</div>
            <div className="stat-label">On Leave</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-rate">
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{presentRate}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="attendance-controls-card">
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search staff name or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <select 
              className="filter-select"
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
        </div>

        <div className="quick-bulk-actions">
          <button 
            type="button" 
            className="btn-bulk btn-bulk-present"
            onClick={handleMarkAllPresent}
          >
            <Check size={16} /> Mark All Present
          </button>

          <button 
            type="button" 
            className="btn-bulk"
            onClick={handleMarkAllAbsent}
            style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}
          >
            <UserX size={16} /> Mark All Absent
          </button>

          <button 
            type="button" 
            className="btn-bulk"
            onClick={handleResetAttendance}
            style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
            title="Reset Records"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Main Staff Attendance Table */}
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Today's Status</th>
              <th>Quick Mark</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Total Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No staff members match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredStaff.map(staff => {
                const record = attendanceData[staff.id] || { 
                  status: 'Present', 
                  checkIn: '--:--', 
                  checkOut: '--:--', 
                  totalHours: '0h 0m', 
                  remarks: '' 
                };

                return (
                  <tr key={staff.id}>
                    {/* Staff Name (Clickable link to history) */}
                    <td>
                      <div className="staff-info-cell">
                        <div 
                          className="staff-avatar-badge" 
                          style={{ backgroundColor: staff.photoColor }}
                        >
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <span 
                            className="staff-name-link"
                            onClick={() => handleOpenHistory(staff)}
                            title="Click to view complete attendance history"
                          >
                            {staff.name}
                          </span>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {staff.role} • {staff.shift} Shift
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td>
                      <span className="emp-id-badge">{staff.id}</span>
                    </td>

                    {/* Department */}
                    <td>
                      <span className="dept-badge">{staff.department}</span>
                    </td>

                    {/* Status Pill Badge */}
                    <td>
                      <span className={`status-badge status-${record.status.toLowerCase()}`}>
                        {record.status === 'Present' && <CheckCircle2 size={14} />}
                        {record.status === 'Absent' && <XCircle size={14} />}
                        {record.status === 'Leave' && <AlertCircle size={14} />}
                        {record.status}
                      </span>
                    </td>

                    {/* Quick Mark Buttons */}
                    <td>
                      <div className="quick-mark-btn-group">
                        <button 
                          type="button" 
                          className={`btn-mark-status ${record.status === 'Present' ? 'active-present' : ''}`}
                          onClick={() => handleQuickMarkStatus(staff.id, 'Present')}
                          title="Mark Present"
                        >
                          P
                        </button>
                        <button 
                          type="button" 
                          className={`btn-mark-status ${record.status === 'Absent' ? 'active-absent' : ''}`}
                          onClick={() => handleQuickMarkStatus(staff.id, 'Absent')}
                          title="Mark Absent"
                        >
                          A
                        </button>
                        <button 
                          type="button" 
                          className={`btn-mark-status ${record.status === 'Leave' ? 'active-leave' : ''}`}
                          onClick={() => handleQuickMarkStatus(staff.id, 'Leave')}
                          title="Mark Leave"
                        >
                          L
                        </button>
                      </div>
                    </td>

                    {/* Check-In Time */}
                    <td>
                      <span className="time-text">{record.checkIn}</span>
                    </td>

                    {/* Check-Out Time */}
                    <td>
                      <span className="time-text">{record.checkOut}</span>
                    </td>

                    {/* Total Working Hours */}
                    <td>
                      <span className="working-hours-tag">{record.totalHours}</span>
                    </td>

                    {/* Edit & History Action */}
                    <td>
                      <button 
                        type="button" 
                        className="btn-edit-row"
                        onClick={() => handleOpenEditModal(staff)}
                        title="Edit attendance details"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- ATTENDANCE HISTORY DRAWER --- */}
      {selectedStaffForHistory && (
        <div className="history-modal-overlay" onClick={() => setSelectedStaffForHistory(null)}>
          <div className="history-drawer" onClick={e => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="drawer-title-group">
                <div 
                  className="staff-avatar-badge" 
                  style={{ backgroundColor: selectedStaffForHistory.photoColor }}
                >
                  {selectedStaffForHistory.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedStaffForHistory.name} — Attendance History</h3>
                  <p>{selectedStaffForHistory.id} • {selectedStaffForHistory.department} ({selectedStaffForHistory.role})</p>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-close-drawer"
                onClick={() => setSelectedStaffForHistory(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="drawer-body">
              {/* Summary Stats for Staff */}
              <div className="history-summary-box">
                <div>
                  <div className="h-stat-num" style={{ color: '#16a34a' }}>
                    {historyList.filter(h => h.status === 'Present').length} Days
                  </div>
                  <div className="h-stat-lbl">Present (Last 15 Days)</div>
                </div>
                <div>
                  <div className="h-stat-num" style={{ color: '#dc2626' }}>
                    {historyList.filter(h => h.status === 'Absent').length} Days
                  </div>
                  <div className="h-stat-lbl">Absent</div>
                </div>
                <div>
                  <div className="h-stat-num" style={{ color: '#d97706' }}>
                    {historyList.filter(h => h.status === 'Leave').length} Days
                  </div>
                  <div className="h-stat-lbl">On Leave</div>
                </div>
              </div>

              {/* History Table */}
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date & Day</th>
                    <th>Status</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Hours</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((entry, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{entry.date}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{entry.day}</div>
                      </td>
                      <td>
                        <span className={`status-badge status-${entry.status.toLowerCase()}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="time-text">{entry.checkIn}</td>
                      <td className="time-text">{entry.checkOut}</td>
                      <td style={{ fontWeight: 600 }}>{entry.totalHours}</td>
                      <td style={{ fontSize: '12px', color: '#64748b' }}>{entry.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Drawer Footer */}
            <div className="drawer-footer">
              <button 
                type="button"
                className="btn-view-profile"
                onClick={() => {
                  const empId = selectedStaffForHistory.id;
                  setSelectedStaffForHistory(null);
                  navigate(`/staff-detail/${empId}`);
                }}
              >
                View Complete Profile & Full Month Transcript <ExternalLink size={14} />
              </button>

              <button 
                type="button" 
                className="btn-bulk"
                onClick={() => window.print()}
                style={{ backgroundColor: '#0284c7', color: 'white' }}
              >
                <Printer size={14} /> Print Log
              </button>

              <button 
                type="button" 
                className="btn-bulk"
                onClick={() => setSelectedStaffForHistory(null)}
                style={{ backgroundColor: '#e2e8f0', color: '#334155' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT ATTENDANCE MODAL --- */}
      {editStaff && (
        <div className="history-modal-overlay" onClick={() => setEditStaff(null)}>
          <div className="edit-modal-content" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3 style={{ margin: 0, fontSize: '16px' }}>Edit Attendance — {editStaff.name}</h3>
              <button type="button" className="btn-close-drawer" onClick={() => setEditStaff(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="edit-modal-body">
                <div className="form-field">
                  <label>Attendance Status</label>
                  <select 
                    value={editStatus} 
                    onChange={e => setEditStatus(e.target.value as AttendanceStatus)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                    <option value="Late">Late</option>
                  </select>
                </div>

                {editStatus !== 'Absent' && editStatus !== 'Leave' && (
                  <>
                    <div className="form-field">
                      <label>Check-In Time</label>
                      <input 
                        type="text" 
                        value={editCheckIn} 
                        onChange={e => setEditCheckIn(e.target.value)} 
                        placeholder="e.g. 08:00 AM" 
                      />
                    </div>

                    <div className="form-field">
                      <label>Check-Out Time</label>
                      <input 
                        type="text" 
                        value={editCheckOut} 
                        onChange={e => setEditCheckOut(e.target.value)} 
                        placeholder="e.g. 04:00 PM" 
                      />
                    </div>
                  </>
                )}

                <div className="form-field">
                  <label>Remarks / Reason</label>
                  <textarea 
                    rows={3} 
                    value={editRemarks} 
                    onChange={e => setEditRemarks(e.target.value)}
                    placeholder="Enter any attendance notes or leave reason..."
                  />
                </div>
              </div>

              <div className="edit-modal-footer">
                <button 
                  type="button" 
                  className="btn-bulk" 
                  onClick={() => setEditStaff(null)}
                  style={{ backgroundColor: '#e2e8f0', color: '#334155' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-view-profile">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffAttendance;
