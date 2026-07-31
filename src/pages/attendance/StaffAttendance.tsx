import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, CheckCircle, FileText, Save, ArrowLeft, Check
} from 'lucide-react';
import './StaffAttendance.css';

// --- Data Model ---
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
  'EMP001': { status: 'Present', inTime: '08:00 AM', outTime: '04:00 PM', totalHours: '8h 0m', overtime: '0h', remarks: 'On time' },
  'EMP002': { status: 'Absent', inTime: '--:--', outTime: '--:--', totalHours: '0h 0m', overtime: '0h', remarks: 'Unplanned absence' },
  'EMP003': { status: 'Late', inTime: '09:45 AM', outTime: '--:--', totalHours: 'Ongoing', overtime: '0h', remarks: 'Traffic delay' },
  'EMP004': { status: 'Leave', inTime: '--:--', outTime: '--:--', totalHours: '0h 0m', overtime: '0h', remarks: 'Approved sick leave' },
  'EMP005': { status: 'Present', inTime: '07:55 AM', outTime: '04:00 PM', totalHours: '8h 5m', overtime: '0h', remarks: '' },
  'EMP006': { status: 'Duty', inTime: '02:00 PM', outTime: '10:00 PM', totalHours: '8h 0m', overtime: '2h', remarks: 'Covering ER' },
  'EMP007': { status: 'Half-Day', inTime: '08:00 AM', outTime: '12:00 PM', totalHours: '4h 0m', overtime: '0h', remarks: 'Personal work' },
};

const StaffAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(INITIAL_RECORDS);

  // Form State
  const [formStaffId, setFormStaffId] = useState<string>('EMP001');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('Present');
  const [formInTime, setFormInTime] = useState<string>('08:00 AM');
  const [formOutTime, setFormOutTime] = useState<string>('04:00 PM');
  const [formOvertime, setFormOvertime] = useState<string>('0h');
  const [formRemarks, setFormRemarks] = useState<string>('');
  const [formSuccessAlert, setFormSuccessAlert] = useState<boolean>(false);

  const formSelectedStaff = DUMMY_STAFF.find(s => s.id === formStaffId) || DUMMY_STAFF[0];

  // Update Form fields when formStaffId changes
  const handleFormStaffChange = (empId: string) => {
    setFormStaffId(empId);
    const rec = records[empId];
    if (rec) {
      setFormStatus(rec.status);
      setFormInTime(rec.inTime !== '--:--' ? rec.inTime : '08:00 AM');
      setFormOutTime(rec.outTime !== '--:--' ? rec.outTime : '04:00 PM');
      setFormOvertime(rec.overtime || '0h');
      setFormRemarks(rec.remarks || '');
    }
  };

  // Form Submit Action
  const handleFormSave = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords(prev => ({
      ...prev,
      [formStaffId]: {
        ...prev[formStaffId],
        status: formStatus,
        inTime: formInTime,
        outTime: formOutTime,
        overtime: formOvertime,
        remarks: formRemarks,
        totalHours: formStatus === 'Absent' || formStatus === 'Leave' ? '0h' : '8h 0m'
      }
    }));

    setFormSuccessAlert(true);
    setTimeout(() => setFormSuccessAlert(false), 3500);
  };

  return (
    <div className="attendance-dashboard page-transition">
      {/* Top Header */}
      <div className="attendance-page-header">
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={26} color="var(--color-primary)" /> Staff Attendance Form
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Select staff name and ID to record check-in time, check-out time, and attendance status
          </p>
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
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Attendance Entry Form */}
      <div className="tab-pane-entry-form" style={{ marginTop: '8px' }}>
        <form className="attendance-entry-form-card" onSubmit={handleFormSave}>
          <div className="form-card-header">
            <div>
              <h3><FileText size={22} color="var(--color-primary)" /> Attendance Details</h3>
              <p>Fill in the staff details below to save attendance</p>
            </div>

            {formSuccessAlert && (
              <div className="form-success-toast">
                <CheckCircle size={18} /> Attendance Saved Successfully!
              </div>
            )}
          </div>

          <div className="form-fields-grid">
            {/* Staff Selection */}
            <div className="form-group-item col-span-2">
              <label>STAFF NAME & STAFF ID *</label>
              <select 
                className="form-control-select"
                value={formStaffId}
                onChange={e => handleFormStaffChange(e.target.value)}
                required
              >
                {DUMMY_STAFF.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {s.department} • {s.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group-item">
              <label>ATTENDANCE DATE *</label>
              <input 
                type="date" 
                className="form-control-input"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                required
              />
            </div>

            {/* Department & Shift Readonly */}
            <div className="form-group-item">
              <label>DEPARTMENT & SHIFT</label>
              <input 
                type="text" 
                className="form-control-input readonly-input"
                value={`${formSelectedStaff.department} (${formSelectedStaff.shift} Shift)`}
                readOnly
              />
            </div>

            {/* Attendance Status Pills */}
            <div className="form-group-item col-span-2">
              <label>ATTENDANCE STATUS *</label>
              <div className="status-pill-selector">
                {(['Present', 'Absent', 'Late', 'Leave', 'Half-Day', 'Duty'] as AttendanceStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`status-select-btn ${st.toLowerCase().replace(' ', '-')} ${formStatus === st ? 'selected' : ''}`}
                    onClick={() => setFormStatus(st)}
                  >
                    {formStatus === st && <Check size={16} />}
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Check In Time */}
            <div className="form-group-item">
              <label>CHECK-IN TIME</label>
              <input 
                type="text" 
                className="form-control-input"
                placeholder="e.g. 08:00 AM"
                value={formInTime}
                onChange={e => setFormInTime(e.target.value)}
              />
            </div>

            {/* Check Out Time */}
            <div className="form-group-item">
              <label>CHECK-OUT TIME</label>
              <input 
                type="text" 
                className="form-control-input"
                placeholder="e.g. 04:00 PM"
                value={formOutTime}
                onChange={e => setFormOutTime(e.target.value)}
              />
            </div>

            {/* Overtime Hours */}
            <div className="form-group-item">
              <label>OVERTIME HOURS</label>
              <input 
                type="text" 
                className="form-control-input"
                placeholder="e.g. 1h 30m"
                value={formOvertime}
                onChange={e => setFormOvertime(e.target.value)}
              />
            </div>

            {/* Remarks */}
            <div className="form-group-item col-span-2">
              <label>REMARKS / NOTES</label>
              <textarea 
                className="form-control-textarea"
                rows={3}
                placeholder="Enter any attendance remarks or notes..."
                value={formRemarks}
                onChange={e => setFormRemarks(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="form-actions-row">
            <button type="button" className="btn-reset-form" onClick={() => handleFormStaffChange(formStaffId)}>
              Reset
            </button>
            <button type="submit" className="btn-submit-attendance">
              <Save size={18} /> Save Attendance Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAttendance;
