import React, { useState } from 'react';
import { 
  Users, CheckCircle, XCircle, Clock, Briefcase, CalendarOff,
  FileText, Download, Printer, Save, X, ExternalLink
} from 'lucide-react';
import './StaffAttendance.css';

// --- Complex Dummy Data Model ---
type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Half-Day' | 'Duty';

interface StaffProfile {
  id: string;
  name: string;
  department: string;
  type: string;
  designation?: string;
  shift: string;
  mobile: string;
  photoColor: string;
}

interface AttendanceRecord {
  status: AttendanceStatus;
  inTime: string;
  outTime: string;
  totalHours: string;
  breakTime: string;
  overtime: string;
  remarks: string;
}

const DUMMY_STAFF: StaffProfile[] = [
  { id: 'EMP001', name: 'Dr. Kumar', department: 'Cardiology', type: 'Doctor', shift: 'Morning', mobile: '9876543210', photoColor: '#1976D2' },
  { id: 'EMP002', name: 'Priya', department: 'ICU', type: 'Nurse', shift: 'Night', mobile: '8765432109', photoColor: '#E91E63' },
  { id: 'EMP003', name: 'Ravi', department: 'Pharmacy', type: 'Pharmacy', shift: 'Morning', mobile: '7654321098', photoColor: '#9C27B0' },
  { id: 'EMP004', name: 'Anita Sharma', department: 'Front Desk', type: 'Receptionist', shift: 'Evening', mobile: '6543210987', photoColor: '#00BCD4' },
  { id: 'EMP005', name: 'Suresh', department: 'Laboratory', type: 'Lab', shift: 'Morning', mobile: '5432109876', photoColor: '#FF9800' },
  { id: 'EMP006', name: 'Dr. Sarah', department: 'Neurology', type: 'Doctor', shift: 'Evening', mobile: '4321098765', photoColor: '#4CAF50' },
  { id: 'EMP007', name: 'Ramesh Admin', department: 'Management', type: 'Admin', shift: 'Morning', mobile: '3210987654', photoColor: '#607D8B' },
];

const INITIAL_RECORDS: Record<string, AttendanceRecord> = {
  'EMP001': { status: 'Present', inTime: '08:00 AM', outTime: '04:00 PM', totalHours: '8h 0m', breakTime: '30m', overtime: '0h', remarks: 'On time' },
  'EMP002': { status: 'Absent', inTime: '--:--', outTime: '--:--', totalHours: '0h 0m', breakTime: '0m', overtime: '0h', remarks: 'Unplanned absence' },
  'EMP003': { status: 'Late', inTime: '09:45 AM', outTime: '--:--', totalHours: 'Ongoing', breakTime: '0m', overtime: '0h', remarks: 'Traffic delay' },
  'EMP004': { status: 'Leave', inTime: '--:--', outTime: '--:--', totalHours: '0h 0m', breakTime: '0m', overtime: '0h', remarks: 'Approved sick leave' },
  'EMP005': { status: 'Present', inTime: '07:55 AM', outTime: '04:00 PM', totalHours: '8h 5m', breakTime: '45m', overtime: '0h', remarks: '' },
  'EMP006': { status: 'Duty', inTime: '02:00 PM', outTime: '10:00 PM', totalHours: '8h 0m', breakTime: '30m', overtime: '2h', remarks: 'Covering ER' },
  'EMP007': { status: 'Half-Day', inTime: '08:00 AM', outTime: '12:00 PM', totalHours: '4h 0m', breakTime: '0m', overtime: '0h', remarks: 'Personal work' },
};

const StaffAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [reportType, setReportType] = useState('Daily Report');
  const [showPdfModal, setShowPdfModal] = useState(false);
  
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(INITIAL_RECORDS);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  const selectedStaff = DUMMY_STAFF.find(s => s.id === selectedEmpId);
  const selectedRecord = selectedEmpId ? records[selectedEmpId] : null;

  // Compute Summaries
  const totalStaff = DUMMY_STAFF.length;
  const present = Object.values(records).filter(r => r.status === 'Present').length;
  const absent = Object.values(records).filter(r => r.status === 'Absent').length;
  const late = Object.values(records).filter(r => r.status === 'Late').length;
  const duty = Object.values(records).filter(r => r.status === 'Duty').length;
  const leave = Object.values(records).filter(r => r.status === 'Leave').length;

  // Apply Filters
  const filteredList = DUMMY_STAFF.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept ? s.department === filterDept : true;
    const matchType = filterType ? s.type === filterType : true;
    const matchShift = filterShift ? s.shift === filterShift : true;
    return matchSearch && matchDept && matchType && matchShift;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'Late': return 'status-late';
      case 'Leave': return 'status-leave';
      case 'Half-Day': return 'status-halfday';
      case 'Duty': return 'status-present';
      default: return '';
    }
  };

  const handleUpdateStatus = (status: AttendanceStatus) => {
    if (!selectedEmpId) return;
    setRecords({
      ...records,
      [selectedEmpId]: { ...records[selectedEmpId], status }
    });
  };

  const handleSave = () => {
    alert('Attendance details saved successfully!');
  };

  // Export handlers
  const handleExportExcel = () => {
    const csvRows = [
      ['Employee ID', 'Name', 'Department', 'Type', 'Shift', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Remarks'],
      ...filteredList.map(s => {
        const r = records[s.id];
        return [
          s.id,
          s.name,
          s.department,
          s.type,
          s.shift,
          selectedDate,
          r.inTime,
          r.outTime,
          r.totalHours,
          r.status,
          `"${r.remarks || ''}"`
        ];
      })
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Staff_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    setShowPdfModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="attendance-dashboard page-transition">
      
      {/* 1. Top Summary Cards */}
      <div className="summary-cards-row">
        <div className="att-summary-card card-total">
          <div className="att-summary-title"><Users size={16} /> Total Staff</div>
          <div className="att-summary-value">{totalStaff}</div>
        </div>
        <div className="att-summary-card card-present">
          <div className="att-summary-title"><CheckCircle size={16} color="#4CAF50" /> Present Today</div>
          <div className="att-summary-value" style={{ color: '#2E7D32' }}>{present}</div>
        </div>
        <div className="att-summary-card card-absent">
          <div className="att-summary-title"><XCircle size={16} color="#F44336" /> Absent</div>
          <div className="att-summary-value" style={{ color: '#C62828' }}>{absent}</div>
        </div>
        <div className="att-summary-card card-late">
          <div className="att-summary-title"><Clock size={16} color="#FF9800" /> Late Entry</div>
          <div className="att-summary-value" style={{ color: '#EF6C00' }}>{late}</div>
        </div>
        <div className="att-summary-card card-duty">
          <div className="att-summary-title"><Briefcase size={16} color="#9C27B0" /> On Duty</div>
          <div className="att-summary-value" style={{ color: '#6A1B9A' }}>{duty}</div>
        </div>
        <div className="att-summary-card card-leave">
          <div className="att-summary-title"><CalendarOff size={16} color="#2196F3" /> On Leave</div>
          <div className="att-summary-value" style={{ color: '#1565C0' }}>{leave}</div>
        </div>
      </div>

      {/* 2. Filters & Reports Toolbar */}
      <div className="attendance-toolbar">
        <div className="filter-group-row">
          <input type="date" className="toolbar-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          
          <select className="toolbar-input" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="ICU">ICU</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Front Desk">Front Desk</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Neurology">Neurology</option>
          </select>

          <select className="toolbar-input" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Staff Types</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Lab">Lab</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Admin">Admin</option>
          </select>

          <select className="toolbar-input" value={filterShift} onChange={e => setFilterShift(e.target.value)}>
            <option value="">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>

          <input 
            type="text" 
            className="toolbar-input toolbar-search" 
            placeholder="Search Staff Name / ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="export-group">
          <select className="toolbar-input" style={{ width: '180px' }} value={reportType} onChange={e => setReportType(e.target.value)}>
            <option>Daily Report</option>
            <option>Weekly Report</option>
            <option>Monthly Report</option>
            <option>Dept Wise Report</option>
          </select>
          <button className="btn-export" type="button" onClick={handleExportPdf}><FileText size={16} color="#F44336"/> PDF</button>
          <button className="btn-export" type="button" onClick={handleExportExcel}><Download size={16} color="#4CAF50"/> Excel</button>
          <button className="btn-export" type="button" onClick={handlePrint}><Printer size={16} color="#607D8B"/> Print</button>
        </div>
      </div>

      {/* 3. Master-Detail Layout */}
      <div className="attendance-main-content">
        
        {/* Left Pane (Table) */}
        <div className="attendance-list-pane">
          <div className="table-scroll-container">
            <table className="att-master-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map(staff => {
                  const status = records[staff.id].status;
                  return (
                    <tr 
                      key={staff.id} 
                      className={selectedEmpId === staff.id ? 'selected' : ''}
                      onClick={() => setSelectedEmpId(staff.id)}
                    >
                      <td style={{ fontWeight: 600 }}>{staff.id}</td>
                      <td>
                        <a 
                          href={`/staff-detail/${staff.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Click to open full staff profile in new tab"
                          style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/staff-detail/${staff.id}`, '_blank');
                          }}
                        >
                          {staff.name}
                          <ExternalLink size={13} style={{ opacity: 0.7 }} />
                        </a>
                      </td>
                      <td>{staff.department}</td>
                      <td>{staff.shift}</td>
                      <td>
                        <div className={`status-text ${getStatusClass(status)}`}>
                          <span className="status-dot"></span>
                          {status}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane (Details) */}
        <div className="attendance-detail-pane">
          {!selectedStaff || !selectedRecord ? (
            <div className="empty-detail-state">
              <Users size={64} style={{ opacity: 0.2 }} />
              <h3>Select a Staff Member</h3>
              <p>Click on a row in the left table to view complete attendance details, modify status, and view history.</p>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="detail-header-profile">
                <div className="profile-photo" style={{ backgroundColor: selectedStaff.photoColor }}>
                  {selectedStaff.name.charAt(0)}
                </div>
                <div className="profile-info">
                  <h3>
                    {selectedStaff.name}{' '}
                    <a 
                      href={`/staff-detail/${selectedStaff.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full profile in new tab"
                      style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', textDecoration: 'none', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      <ExternalLink size={14} /> Full Details
                    </a>
                  </h3>
                  <p><strong>{selectedStaff.id}</strong> • {selectedStaff.designation || selectedStaff.type}</p>
                  <p>{selectedStaff.department} • Shift: {selectedStaff.shift} • Ph: {selectedStaff.mobile}</p>
                </div>
              </div>

              {/* Scrollable Detail Body */}
              <div className="detail-scroll-content">

                <div className="attendance-actions-section">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--color-text-light)' }}>MARK ATTENDANCE</h4>
                  <div className="action-buttons-grid">
                    <button 
                      className={`btn-mark btn-mark-present ${selectedRecord.status === 'Present' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus('Present')}
                    >
                      <CheckCircle size={18} /> Mark Present
                    </button>
                    <button 
                      className={`btn-mark btn-mark-absent ${selectedRecord.status === 'Absent' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus('Absent')}
                    >
                      <XCircle size={18} /> Mark Absent
                    </button>
                    <button 
                      className={`btn-mark btn-mark-leave ${selectedRecord.status === 'Leave' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus('Leave')}
                    >
                      <CalendarOff size={18} /> Mark Leave
                    </button>
                    <button 
                      className={`btn-mark btn-mark-halfday ${selectedRecord.status === 'Half-Day' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus('Half-Day')}
                    >
                      <Clock size={18} /> Half Day
                    </button>
                    <button 
                      className={`btn-mark btn-mark-late ${selectedRecord.status === 'Late' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus('Late')}
                    >
                      <Clock size={18} /> Mark Late
                    </button>
                  </div>
                </div>

                <div className="remarks-section">
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--color-text-light)' }}>REMARKS</h4>
                  <textarea 
                    value={selectedRecord.remarks} 
                    onChange={e => setRecords({...records, [selectedStaff.id]: {...selectedRecord, remarks: e.target.value}})}
                    placeholder="Enter any attendance remarks or reasons..."
                  />
                </div>

                {/* Monthly History Table inside detail pane */}
                <div className="history-section-mini">
                  <h4>Monthly History</h4>
                  <table className="mini-history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Shift</th>
                        <th>In</th>
                        <th>Out</th>
                        <th>Hrs</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>15 Jul 2026</td>
                        <td>{selectedStaff.shift}</td>
                        <td>08:05 AM</td>
                        <td>04:10 PM</td>
                        <td>8h</td>
                        <td><span style={{ color: '#2E7D32', fontWeight: 600 }}>Present</span></td>
                      </tr>
                      <tr>
                        <td>14 Jul 2026</td>
                        <td>{selectedStaff.shift}</td>
                        <td>08:00 AM</td>
                        <td>04:00 PM</td>
                        <td>8h</td>
                        <td><span style={{ color: '#2E7D32', fontWeight: 600 }}>Present</span></td>
                      </tr>
                      <tr>
                        <td>13 Jul 2026</td>
                        <td>{selectedStaff.shift}</td>
                        <td>--:--</td>
                        <td>--:--</td>
                        <td>0h</td>
                        <td><span style={{ color: '#1565C0', fontWeight: 600 }}>Leave</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Detail Footer */}
              <div className="detail-footer-actions">
                <button className="btn-save-attendance" onClick={handleSave}>
                  <Save size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* PDF / Report Preview Modal */}
      {showPdfModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card" style={{ width: '700px', padding: '32px', position: 'relative', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-primary)', paddingBottom: '12px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>SHRI JANANI HOSPITAL</h2>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>STAFF ATTENDANCE {reportType.toUpperCase()} ({selectedDate})</span>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowPdfModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '13px', color: '#475569' }}>
              <div>Total Staff: <strong>{totalStaff}</strong></div>
              <div>Present: <strong style={{ color: '#2e7d32' }}>{present}</strong></div>
              <div>Absent: <strong style={{ color: '#c62828' }}>{absent}</strong></div>
              <div>Late: <strong style={{ color: '#ef6c00' }}>{late}</strong></div>
              <div>On Leave: <strong style={{ color: '#1565c0' }}>{leave}</strong></div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Emp ID</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Dept</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Shift</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>In Time</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px' }}>{s.id}</td>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '8px' }}>{s.department}</td>
                    <td style={{ padding: '8px' }}>{s.shift}</td>
                    <td style={{ padding: '8px' }}>{records[s.id].inTime}</td>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{records[s.id].status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-export" onClick={() => setShowPdfModal(false)}>Close</button>
              <button className="btn-export" style={{ background: 'var(--color-primary)', color: 'white' }} onClick={() => window.print()}>
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffAttendance;
