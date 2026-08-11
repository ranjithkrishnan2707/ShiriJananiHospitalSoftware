import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, User, ArrowLeft, History, Clock, Activity,
  Phone, ShieldCheck, Filter, ChevronRight, Eye, FolderHeart,
  Stethoscope, Users, Calendar, Plus
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './DoctorPatientHistoryList.css';

const DoctorPatientHistoryList: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'uhid'>('recent');

  // Filtered & Sorted Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Gender filter
      if (genderFilter !== 'ALL') {
        const pGender = (p.sex || '').toLowerCase();
        if (genderFilter === 'Male' && pGender !== 'male') return false;
        if (genderFilter === 'Female' && pGender !== 'female') return false;
      }

      // Search query filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(query) ||
          p.uhid.toLowerCase().includes(query) ||
          p.patientId.toLowerCase().includes(query) ||
          (p.phone && p.phone.includes(query)) ||
          (p.aadharNumber && p.aadharNumber.includes(query)) ||
          (p.preferredDoctor && p.preferredDoctor.toLowerCase().includes(query))
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'uhid') {
        return a.uhid.localeCompare(b.uhid);
      }
      return 0; // Default order
    });
  }, [patients, searchTerm, genderFilter, sortBy]);

  // Statistics calculation
  const totalPatientsCount = patients.length;
  const totalConsultationsCount = patients.reduce((acc, p) => acc + (p.history ? p.history.length : 0), 0);
  const malePatientsCount = patients.filter(p => (p.sex || '').toLowerCase() === 'male').length;
  const femalePatientsCount = patients.filter(p => (p.sex || '').toLowerCase() === 'female').length;

  return (
    <div className="history-page-container page-transition">
      
      {/* Top Header Banner */}
      <div className="history-page-header">
        <div className="history-header-title">
          <h2>
            <FolderHeart size={26} color="#60A5FA" /> Doctor's Patient History Directory
          </h2>
          <p>Search, filter, and review complete medical history records for all hospital patients</p>
        </div>

        <div className="history-header-actions">
          <button
            className="btn-doc-nav btn-doc-primary"
            onClick={() => navigate('/doctor')}
          >
            <Stethoscope size={16} /> New Consultation Page
          </button>
          <button
            className="btn-doc-nav btn-doc-dark"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="history-stats-grid">
        <div className="history-stat-card">
          <div className="history-stat-icon blue">
            <Users size={24} />
          </div>
          <div>
            <div className="history-stat-value">{totalPatientsCount}</div>
            <div className="history-stat-label">Total Registered Patients</div>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon green">
            <History size={24} />
          </div>
          <div>
            <div className="history-stat-value">{totalConsultationsCount}</div>
            <div className="history-stat-label">Total Medical History Records</div>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon purple">
            <User size={24} />
          </div>
          <div>
            <div className="history-stat-value">{femalePatientsCount}</div>
            <div className="history-stat-label">Female Patients</div>
          </div>
        </div>

        <div className="history-stat-card">
          <div className="history-stat-icon amber">
            <Activity size={24} />
          </div>
          <div>
            <div className="history-stat-value">{malePatientsCount}</div>
            <div className="history-stat-label">Male Patients</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="history-filter-toolbar">
        <div className="history-search-input-wrapper">
          <Search className="history-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search Patient Name, UHID, Patient ID, Phone, Aadhar or Doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="history-filter-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            <Filter size={15} /> Gender:
          </div>
          <select
            className="history-select"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="ALL">All Genders</option>
            <option value="Female">Female Only</option>
            <option value="Male">Male Only</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', marginLeft: '8px' }}>
            Sort By:
          </div>
          <select
            className="history-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="recent">Default / Recent</option>
            <option value="name">Patient Name (A-Z)</option>
            <option value="uhid">UHID Code</option>
          </select>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="patient-list-card">
        {filteredPatients.length === 0 ? (
          <div className="no-records-box">
            <Users size={48} color="#cbd5e1" />
            <p>No patient records found matching your search term or filters.</p>
          </div>
        ) : (
          <table className="patient-history-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>UHID & ID</th>
                <th>Contact Phone</th>
                <th>Vitals (BP / Pulse / Wt)</th>
                <th>Total Consultations</th>
                <th>Assigned / Preferred Doctor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const historyCount = patient.history ? patient.history.length : 0;
                const latestHistory = historyCount > 0 ? patient.history[0] : null;

                return (
                  <tr key={patient.uhid}>
                    <td>
                      <div className="patient-name-cell">
                        <span className="patient-main-name">{patient.name}</span>
                        <span className="patient-sub-details">
                          {patient.age} Yrs • {patient.sex} {patient.aadharNumber ? `• Aadhar: ${patient.aadharNumber}` : ''}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill blue">UHID: {patient.uhid}</span>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        ID: {patient.patientId || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="#64748b" />
                        <span>{patient.phone || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                        BP: {patient.bloodPressure || '120/80'} | PR: {patient.pulseRate || '72'} bpm
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Weight: {patient.weight || '-'} kg
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill teal">
                        {historyCount} Visit Record{historyCount !== 1 ? 's' : ''}
                      </span>
                      {latestHistory && (
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                          Last: {latestHistory.date}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
                        {patient.preferredDoctor || 'Dr. G. Srijaya'}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-view-patient-history"
                        onClick={() => navigate(`/doctor/patient-history/${patient.uhid}`)}
                      >
                        <Eye size={15} /> View Full History <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default DoctorPatientHistoryList;
