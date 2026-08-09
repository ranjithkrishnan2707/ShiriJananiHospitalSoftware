import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Calendar, Award, 
  Clock, ShieldCheck, FileText, CheckCircle2, 
  XCircle, AlertTriangle, Printer, ArrowLeft, X,
  Briefcase, HeartPulse, Stethoscope, Hash, Percent,
  ChevronRight, Filter
} from 'lucide-react';
import './StaffDetail.css';

interface DailyLog {
  date: string;
  day: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'Duty';
  inTime: string;
  outTime: string;
  hours: string;
  remarks: string;
}

interface MonthAttendance {
  monthKey: string;
  monthName: string;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  lateDays: number;
  dutyDays: number;
  attendancePercentage: string;
  dailyLogs: DailyLog[];
}

interface DetailedStaffProfile {
  id: string;
  name: string;
  department: string;
  role: string;
  designation: string;
  specialization?: string;
  shift: string;
  mobile: string;
  altPhone?: string;
  email: string;
  address: string;
  bloodGroup: string;
  gender: string;
  dob: string;
  age: string;
  joiningDate: string;
  qualification: string;
  experience: string;
  employmentType: string;
  salaryBand: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  photoColor: string;
  status: 'Active' | 'On Leave' | 'On Duty';
  attendanceRate: string;
  totalHoursThisMonth: string;
  avgClockIn: string;
  assignedWard: string;
  licenseNo?: string;
  monthlyAttendance: MonthAttendance[];
}

// Generate Month Logs Helper
const generateMonthLogs = (year: number, monthIdx: number, monthName: string, shift: string): MonthAttendance => {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const logs: DailyLog[] = [];
  let present = 0;
  let absent = 0;
  let leave = 0;
  let late = 0;
  let duty = 0;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let d = daysInMonth; d >= 1; d--) {
    const dateObj = new Date(year, monthIdx, d);
    const dayOfWeek = dateObj.getDay();
    const dayStr = dayNames[dayOfWeek];
    const formattedDate = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (dayOfWeek === 0) {
      // Sunday - Off / Leave
      logs.push({
        date: formattedDate,
        day: dayStr,
        status: 'Leave',
        inTime: '--:--',
        outTime: '--:--',
        hours: '0h 0m',
        remarks: 'Weekly Off / Sunday'
      });
      leave++;
    } else if (d === 12 || d === 21) {
      logs.push({
        date: formattedDate,
        day: dayStr,
        status: 'Duty',
        inTime: '08:00 AM',
        outTime: '06:00 PM',
        hours: '10h 0m',
        remarks: 'Special Duty Cover'
      });
      duty++;
    } else if (d === 5) {
      logs.push({
        date: formattedDate,
        day: dayStr,
        status: 'Absent',
        inTime: '--:--',
        outTime: '--:--',
        hours: '0h 0m',
        remarks: 'Casual leave'
      });
      absent++;
    } else if (d === 9 || d === 18) {
      logs.push({
        date: formattedDate,
        day: dayStr,
        status: 'Late',
        inTime: '08:45 AM',
        outTime: '04:00 PM',
        hours: '7h 15m',
        remarks: 'Traffic delay'
      });
      late++;
      present++;
    } else {
      logs.push({
        date: formattedDate,
        day: dayStr,
        status: 'Present',
        inTime: '08:00 AM',
        outTime: '04:00 PM',
        hours: '8h 0m',
        remarks: 'On time'
      });
      present++;
    }
  }

  const totalWorking = daysInMonth - leave;
  const pct = Math.round(((present + duty) / totalWorking) * 100);

  return {
    monthKey: `${year}-${String(monthIdx + 1).padStart(2, '0')}`,
    monthName,
    totalWorkingDays: totalWorking,
    presentDays: present,
    absentDays: absent,
    leaveDays: leave,
    lateDays: late,
    dutyDays: duty,
    attendancePercentage: `${pct}%`,
    dailyLogs: logs
  };
};

const currentYr = new Date().getFullYear();
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const generateRecentMonthLogs = () => {
  const now = new Date();
  const logsList = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mIdx = d.getMonth();
    const label = `${MONTH_NAMES[mIdx]} ${yr}`;
    logsList.push(generateMonthLogs(yr, mIdx, label, 'Morning'));
  }
  return logsList;
};

const DYNAMIC_MONTHLY_ATTENDANCE = generateRecentMonthLogs();

const FULL_STAFF_DATABASE: Record<string, DetailedStaffProfile> = {
  'EMP001': {
    id: 'EMP001',
    name: 'Dr. Kumar',
    department: 'Cardiology',
    role: 'Doctor',
    designation: 'Senior Consultant Cardiologist',
    specialization: 'Interventional Cardiology',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    mobile: '9876543210',
    altPhone: '9876543211',
    email: 'dr.kumar@jananihospital.com',
    address: '45 Green Park Avenue, Erode, Tamil Nadu',
    bloodGroup: 'O+',
    gender: 'Male',
    dob: '1980-05-14',
    age: '46',
    joiningDate: '2019-03-15',
    qualification: 'M.B.B.S, M.D (Cardiology), DM',
    experience: '16 Years',
    employmentType: 'Full-Time Permanent',
    salaryBand: 'Grade A - Executive Medical',
    emergencyContactName: 'Lakshmi Kumar',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9876599999',
    photoColor: '#1976D2',
    status: 'On Duty',
    attendanceRate: '98.2%',
    totalHoursThisMonth: '168 Hours',
    avgClockIn: '07:55 AM',
    assignedWard: 'Cath Lab / Cardiology OPD 1',
    licenseNo: 'TN-MED-45892',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP-001': {
    id: 'EMP-001',
    name: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    role: 'Doctor',
    designation: 'Senior Cardiologist',
    specialization: 'Cardiology & Echocardiography',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    mobile: '9876543210',
    altPhone: '9876543212',
    email: 'dr.sarah@jananihospital.com',
    address: '12 Hospital Road, Gobichettipalayam',
    bloodGroup: 'A+',
    gender: 'Female',
    dob: '1985-08-22',
    age: '40',
    joiningDate: '2023-01-15',
    qualification: 'MBBS, MD, FACC',
    experience: '12 Years',
    employmentType: 'Full-Time Consultant',
    salaryBand: 'Grade A Medical',
    emergencyContactName: 'Robert Jenkins',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9876588888',
    photoColor: '#4CAF50',
    status: 'Active',
    attendanceRate: '96.5%',
    totalHoursThisMonth: '160 Hours',
    avgClockIn: '08:05 AM',
    assignedWard: 'Cardiology OPD 2',
    licenseNo: 'TN-MED-56210',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP002': {
    id: 'EMP002',
    name: 'Priya',
    department: 'ICU',
    role: 'Nurse',
    designation: 'Head Nursing Officer',
    specialization: 'Critical Care Nursing',
    shift: 'Night (10:00 PM - 06:00 AM)',
    mobile: '8765432109',
    altPhone: '8765432110',
    email: 'priya.nurse@jananihospital.com',
    address: '88 West Street, Gobichettipalayam',
    bloodGroup: 'B+',
    gender: 'Female',
    dob: '1992-11-03',
    age: '33',
    joiningDate: '2021-06-10',
    qualification: 'B.Sc Nursing, Critical Care Cert.',
    experience: '8 Years',
    employmentType: 'Full-Time Staff',
    salaryBand: 'Grade B Nursing',
    emergencyContactName: 'Suresh Kumar',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '8765477777',
    photoColor: '#E91E63',
    status: 'Active',
    attendanceRate: '94.0%',
    totalHoursThisMonth: '152 Hours',
    avgClockIn: '09:55 PM',
    assignedWard: 'Main ICU - Bed 1 to 6',
    licenseNo: 'TN-NUR-78120',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP-002': {
    id: 'EMP-002',
    name: 'James Miller',
    department: 'ICU',
    role: 'Nurse',
    designation: 'Senior Staff Nurse',
    specialization: 'Trauma & Emergency Care',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    mobile: '8765432109',
    email: 'james.miller@jananihospital.com',
    address: '24 Anna Nagar, Erode',
    bloodGroup: 'AB+',
    gender: 'Male',
    dob: '1990-04-18',
    age: '36',
    joiningDate: '2023-03-10',
    qualification: 'B.Sc Nursing',
    experience: '6 Years',
    employmentType: 'Full-Time Staff',
    salaryBand: 'Grade B Nursing',
    emergencyContactName: 'Mary Miller',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '8765466666',
    photoColor: '#00BCD4',
    status: 'Active',
    attendanceRate: '95.8%',
    totalHoursThisMonth: '160 Hours',
    avgClockIn: '07:58 AM',
    assignedWard: 'Emergency Care Unit',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP003': {
    id: 'EMP003',
    name: 'Ravi',
    department: 'Pharmacy',
    role: 'Pharmacy',
    designation: 'Senior Pharmacist',
    specialization: 'Hospital Clinical Pharmacy',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    mobile: '7654321098',
    email: 'ravi.pharmacy@jananihospital.com',
    address: '15 College Road, Gobichettipalayam',
    bloodGroup: 'O-',
    gender: 'Male',
    dob: '1988-02-14',
    age: '38',
    joiningDate: '2020-09-01',
    qualification: 'B.Pharm, M.Pharm',
    experience: '10 Years',
    employmentType: 'Full-Time Staff',
    salaryBand: 'Grade B Pharmacy',
    emergencyContactName: 'Kavitha Ravi',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '7654355555',
    photoColor: '#9C27B0',
    status: 'Active',
    attendanceRate: '97.1%',
    totalHoursThisMonth: '164 Hours',
    avgClockIn: '08:00 AM',
    assignedWard: 'Central Medical Store',
    licenseNo: 'TN-PHARM-12490',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP004': {
    id: 'EMP004',
    name: 'Anita Sharma',
    department: 'Front Desk',
    role: 'Receptionist',
    designation: 'Senior Front Desk Executive',
    specialization: 'Patient Relations & Billing Coordination',
    shift: 'Evening (02:00 PM - 10:00 PM)',
    mobile: '6543210987',
    email: 'anita.reception@jananihospital.com',
    address: '67 Gandhi Street, Gobichettipalayam',
    bloodGroup: 'A-',
    gender: 'Female',
    dob: '1995-07-29',
    age: '31',
    joiningDate: '2022-01-10',
    qualification: 'B.A Communication, Hospital Admin Diploma',
    experience: '5 Years',
    employmentType: 'Full-Time Staff',
    salaryBand: 'Grade C Admin',
    emergencyContactName: 'Rajesh Sharma',
    emergencyContactRelation: 'Brother',
    emergencyContactPhone: '6543244444',
    photoColor: '#00BCD4',
    status: 'On Leave',
    attendanceRate: '92.5%',
    totalHoursThisMonth: '144 Hours',
    avgClockIn: '01:55 PM',
    assignedWard: 'Main Lobby OPD Help Desk',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP005': {
    id: 'EMP005',
    name: 'Suresh',
    department: 'Laboratory',
    role: 'Lab',
    designation: 'Senior Lab Technician',
    specialization: 'Hematology & Biochemistry Analysis',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    mobile: '5432109876',
    email: 'suresh.lab@jananihospital.com',
    address: '102 Main Road, Sathyamangalam',
    bloodGroup: 'B+',
    gender: 'Male',
    dob: '1987-12-05',
    age: '38',
    joiningDate: '2018-04-01',
    qualification: 'DMLT, B.Sc Biochemistry',
    experience: '12 Years',
    employmentType: 'Full-Time Staff',
    salaryBand: 'Grade B Technical',
    emergencyContactName: 'Meena Suresh',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '5432133333',
    photoColor: '#FF9800',
    status: 'Active',
    attendanceRate: '99.0%',
    totalHoursThisMonth: '172 Hours',
    avgClockIn: '07:50 AM',
    assignedWard: 'Diagnostic Pathology Lab 1',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP006': {
    id: 'EMP006',
    name: 'Dr. Sarah',
    department: 'Neurology',
    role: 'Doctor',
    designation: 'Consultant Neuro Physician',
    specialization: 'Stroke & Epilepsy Management',
    shift: 'Evening (02:00 PM - 10:00 PM)',
    mobile: '4321098765',
    email: 'dr.sarah.neuro@jananihospital.com',
    address: '19 Park View, Erode',
    bloodGroup: 'O+',
    gender: 'Female',
    dob: '1986-09-12',
    age: '39',
    joiningDate: '2021-11-15',
    qualification: 'M.B.B.S, M.D, DM (Neurology)',
    experience: '11 Years',
    employmentType: 'Full-Time Consultant',
    salaryBand: 'Grade A Executive',
    emergencyContactName: 'David Paul',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '4321022222',
    photoColor: '#4CAF50',
    status: 'On Duty',
    attendanceRate: '97.8%',
    totalHoursThisMonth: '168 Hours',
    avgClockIn: '01:50 PM',
    assignedWard: 'Neurology Ward & ER Consultation',
    licenseNo: 'TN-MED-62194',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  },
  'EMP007': {
    id: 'EMP007',
    name: 'Ramesh Admin',
    department: 'Management',
    role: 'Admin',
    designation: 'Hospital Operations Manager',
    specialization: 'Healthcare Facilities Management',
    shift: 'Morning (08:00 AM - 04:00 PM)',
    mobile: '3210987654',
    email: 'ramesh.admin@jananihospital.com',
    address: '5 West Canal Bank, Gobichettipalayam',
    bloodGroup: 'A+',
    gender: 'Male',
    dob: '1982-01-30',
    age: '44',
    joiningDate: '2017-02-01',
    qualification: 'MBA (Hospital Management), B.Com',
    experience: '17 Years',
    employmentType: 'Full-Time Executive',
    salaryBand: 'Grade A Management',
    emergencyContactName: 'Sita Ramesh',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '3210911111',
    photoColor: '#607D8B',
    status: 'Active',
    attendanceRate: '96.0%',
    totalHoursThisMonth: '160 Hours',
    avgClockIn: '08:00 AM',
    assignedWard: 'Administrative Office Floor 2',
    monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
  }
};

const StaffDetail: React.FC = () => {
  const { empId } = useParams<{ empId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'employment' | 'attendance' | 'clinical'>('profile');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);

  // Fallback if staff id not found
  const staff = (empId && FULL_STAFF_DATABASE[empId]) 
    ? FULL_STAFF_DATABASE[empId]
    : Object.values(FULL_STAFF_DATABASE).find(s => s.id.toLowerCase() === (empId || '').toLowerCase() || s.name.toLowerCase().includes((empId || '').toLowerCase()))
    || {
      id: empId || 'EMP001',
      name: 'Staff Member (' + (empId || 'EMP001') + ')',
      department: 'General Staff',
      role: 'Staff',
      designation: 'Hospital Healthcare Professional',
      shift: 'Morning (08:00 AM - 04:00 PM)',
      mobile: '9876543210',
      email: 'staff@jananihospital.com',
      address: 'Shri Janani Hospital Campus',
      bloodGroup: 'B+',
      gender: 'Male',
      dob: '1990-01-01',
      age: '36',
      joiningDate: '2022-01-01',
      qualification: 'Degree in Healthcare',
      experience: '5 Years',
      employmentType: 'Full-Time',
      salaryBand: 'Grade B',
      emergencyContactName: 'Contact Person',
      emergencyContactRelation: 'Family',
      emergencyContactPhone: '9876500000',
      photoColor: '#2563eb',
      status: 'Active',
      attendanceRate: '95.0%',
      totalHoursThisMonth: '160 Hours',
      avgClockIn: '08:00 AM',
      assignedWard: 'General Ward',
      monthlyAttendance: DYNAMIC_MONTHLY_ATTENDANCE
    };

  const currentMonthData = staff.monthlyAttendance[selectedMonthIndex] || staff.monthlyAttendance[0];

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin/staff-attendance');
    }
  };

  return (
    <div className="staff-detail-container">
      {/* Header Banner */}
      <div className="staff-header-card">
        <div className="staff-header-left">
          <div className="staff-avatar-large" style={{ backgroundColor: staff.photoColor, color: '#ffffff' }}>
            {staff.name.charAt(0)}
          </div>
          <div className="staff-header-info">
            <h1>{staff.name}</h1>
            <div className="staff-badges-row">
              <span className="badge-empid">ID: {staff.id}</span>
              <span className="badge-role">{staff.role}</span>
              <span className="badge-dept">{staff.department}</span>
              <span style={{ 
                background: staff.status === 'Active' ? '#dcfce7' : staff.status === 'On Duty' ? '#e0f2fe' : '#fee2e2',
                color: staff.status === 'Active' ? '#166534' : staff.status === 'On Duty' ? '#075985' : '#991b1b',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700
              }}>
                ● {staff.status}
              </span>
            </div>
          </div>
        </div>

        <div className="staff-header-actions">
          <button className="btn-header-action" onClick={() => navigate(-1)} style={{ backgroundColor: '#1e293b', color: 'white' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="btn-header-action btn-header-print" onClick={handlePrint}>
            <Printer size={16} /> Print Profile
          </button>
          <button className="btn-header-action btn-header-close" onClick={handleClose}>
            <X size={16} /> Close Tab
          </button>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="staff-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#2563eb' }}>
            <Percent size={22} />
          </div>
          <div className="metric-data">
            <div className="metric-label">Attendance Rate</div>
            <div className="metric-value">{staff.attendanceRate}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#059669' }}>
            <Clock size={22} />
          </div>
          <div className="metric-data">
            <div className="metric-label">Hours (This Month)</div>
            <div className="metric-value">{staff.totalHoursThisMonth}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#7c3aed' }}>
            <Briefcase size={22} />
          </div>
          <div className="metric-data">
            <div className="metric-label">Experience</div>
            <div className="metric-value">{staff.experience}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box" style={{ background: '#d97706' }}>
            <HeartPulse size={22} />
          </div>
          <div className="metric-data">
            <div className="metric-label">Assigned Ward</div>
            <div className="metric-value" style={{ fontSize: '15px' }}>{staff.assignedWard}</div>
          </div>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="staff-detail-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Personal Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'employment' ? 'active' : ''}`}
          onClick={() => setActiveTab('employment')}
        >
          <Briefcase size={16} /> Employment & Credentials
        </button>
        <button 
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Clock size={16} /> Month-Wise Attendance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clinical' ? 'active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          <Stethoscope size={16} /> Duty & Clinical Scope
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'profile' && (
        <div className="staff-section-card fade-in">
          <h2 className="section-title"><User size={20} color="#2563eb" /> Contact & Personal Profile</h2>
          <div className="section-grid">
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{staff.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender / Age</span>
              <span className="detail-value">{staff.gender} ({staff.age} Years)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date of Birth</span>
              <span className="detail-value">{staff.dob}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Blood Group</span>
              <span className="detail-value" style={{ color: '#dc2626' }}>{staff.bloodGroup}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mobile Number</span>
              <span className="detail-value">{staff.mobile}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Alternate Contact</span>
              <span className="detail-value">{staff.altPhone || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{staff.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Residential Address</span>
              <span className="detail-value">{staff.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Emergency Contact Person</span>
              <span className="detail-value">{staff.emergencyContactName} ({staff.emergencyContactRelation})</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Emergency Contact Phone</span>
              <span className="detail-value">{staff.emergencyContactPhone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Employment & Credentials */}
      {activeTab === 'employment' && (
        <div className="staff-section-card fade-in">
          <h2 className="section-title"><Briefcase size={20} color="#2563eb" /> Employment & Academic Credentials</h2>
          <div className="section-grid">
            <div className="detail-item">
              <span className="detail-label">Employee ID</span>
              <span className="detail-value" style={{ color: '#2563eb' }}>{staff.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Designation</span>
              <span className="detail-value">{staff.designation}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span className="detail-value">{staff.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Specialization</span>
              <span className="detail-value">{staff.specialization || 'General Healthcare'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Qualification / Degree</span>
              <span className="detail-value">{staff.qualification}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Medical License Number</span>
              <span className="detail-value">{staff.licenseNo || 'N/A - General Staff'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Joining Date</span>
              <span className="detail-value">{staff.joiningDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Experience</span>
              <span className="detail-value">{staff.experience}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Employment Type</span>
              <span className="detail-value">{staff.employmentType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Salary Band</span>
              <span className="detail-value">{staff.salaryBand}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Month-Wise Attendance List */}
      {activeTab === 'attendance' && (
        <div className="staff-section-card fade-in">
          <h2 className="section-title"><Calendar size={20} color="#2563eb" /> Month-Wise Attendance List</h2>

          {/* Month Selector Toolbar */}
          <div className="month-selector-toolbar">
            <div className="month-selector-left">
              <Filter size={18} color="#64748b" />
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '14px' }}>Select Attendance Month:</span>
              <select 
                className="month-dropdown-select"
                value={selectedMonthIndex}
                onChange={e => setSelectedMonthIndex(Number(e.target.value))}
              >
                {staff.monthlyAttendance.map((m, idx) => (
                  <option key={m.monthKey} value={idx}>{m.monthName}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Showing {currentMonthData.dailyLogs.length} Records for {currentMonthData.monthName}
            </div>
          </div>

          {/* Monthly Summary Stat Badges */}
          <div className="month-stats-grid">
            <div className="month-stat-box">
              <div className="month-stat-val">{currentMonthData.totalWorkingDays}</div>
              <div className="month-stat-lbl">Working Days</div>
            </div>

            <div className="month-stat-box" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
              <div className="month-stat-val" style={{ color: '#166534' }}>{currentMonthData.presentDays}</div>
              <div className="month-stat-lbl" style={{ color: '#166534' }}>Present</div>
            </div>

            <div className="month-stat-box" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
              <div className="month-stat-val" style={{ color: '#991b1b' }}>{currentMonthData.absentDays}</div>
              <div className="month-stat-lbl" style={{ color: '#991b1b' }}>Absent</div>
            </div>

            <div className="month-stat-box" style={{ borderColor: '#fed7aa', background: '#fff7ed' }}>
              <div className="month-stat-val" style={{ color: '#c2410c' }}>{currentMonthData.lateDays}</div>
              <div className="month-stat-lbl" style={{ color: '#c2410c' }}>Late Arrival</div>
            </div>

            <div className="month-stat-box" style={{ borderColor: '#c7d2fe', background: '#eef2ff' }}>
              <div className="month-stat-val" style={{ color: '#3730a3' }}>{currentMonthData.leaveDays}</div>
              <div className="month-stat-lbl" style={{ color: '#3730a3' }}>Off / Leave</div>
            </div>

            <div className="month-stat-box" style={{ borderColor: '#bae6fd', background: '#f0f9ff' }}>
              <div className="month-stat-val" style={{ color: '#0369a1' }}>{currentMonthData.attendancePercentage}</div>
              <div className="month-stat-lbl" style={{ color: '#0369a1' }}>Punctuality</div>
            </div>
          </div>

          {/* Month-Wise Attendance Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="attendance-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Total Hours</th>
                  <th>Remarks / Notes</th>
                </tr>
              </thead>
              <tbody>
                {currentMonthData.dailyLogs.map((log, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{log.date}</td>
                    <td style={{ color: '#64748b' }}>{log.day}</td>
                    <td>
                      <span className={`status-badge ${log.status.toLowerCase()}`}>
                        ● {log.status}
                      </span>
                    </td>
                    <td>{log.inTime}</td>
                    <td>{log.outTime}</td>
                    <td>{log.hours}</td>
                    <td>{log.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Clinical & Duty */}
      {activeTab === 'clinical' && (
        <div className="staff-section-card fade-in">
          <h2 className="section-title"><Stethoscope size={20} color="#2563eb" /> Clinical Responsibilities & Duty Scope</h2>
          <div className="section-grid">
            <div className="detail-item">
              <span className="detail-label">Primary Duty Station</span>
              <span className="detail-value">{staff.assignedWard}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Shift Hours</span>
              <span className="detail-value">{staff.shift}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role Category</span>
              <span className="detail-value">{staff.role}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hospital Compliance Status</span>
              <span className="detail-value" style={{ color: '#059669' }}>Verified & Cleared</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDetail;
