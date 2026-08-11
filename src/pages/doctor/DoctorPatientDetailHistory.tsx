import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Calendar, Phone, Activity, FileText,
  Pill, TestTube2, Activity as ScanIcon, Printer, History,
  ShieldCheck, Stethoscope, Clock, CheckCircle2, ChevronRight,
  Receipt, MapPin, AlertCircle, Sparkles, HeartPulse, Scale
} from 'lucide-react';
import { useHospital, type PatientHistory } from '../../context/HospitalContext';
import './DoctorPatientDetailHistory.css';

const DoctorPatientDetailHistory: React.FC = () => {
  const { uhid } = useParams<{ uhid: string }>();
  const navigate = useNavigate();
  const { patients, labRequests, scanRequests } = useHospital();

  // Find patient record
  const patient = patients.find(p => p.uhid === uhid || p.patientId === uhid);

  // Selected Visit state (defaults to the most recent visit if available)
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(
    patient && patient.history && patient.history.length > 0 ? patient.history[0].id : null
  );

  if (!patient) {
    return (
      <div className="patient-detail-page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <User size={64} color="#94a3b8" />
          <h2 style={{ color: '#1e293b', marginTop: '16px' }}>Patient Record Not Found</h2>
          <p style={{ color: '#64748b' }}>No matching patient record was found for UHID: {uhid}</p>
          <button
            className="btn-profile-action primary"
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/doctor/patient-history')}
          >
            <ArrowLeft size={16} /> Return to Patient Directory
          </button>
        </div>
      </div>
    );
  }

  const visits = patient.history || [];
  const selectedVisit: PatientHistory | undefined = visits.find(v => v.id === selectedVisitId) || visits[0];

  // Helper to parse prescribed medicine strings into formatted rows
  const parseMedicinesList = (medStr: string) => {
    if (!medStr || medStr.trim() === '' || medStr.toLowerCase().includes('no medicines')) return [];
    return medStr.split(';').map(m => m.trim()).filter(Boolean);
  };

  // Filter lab & scan records for this patient matching the visit date
  const selectedVisitLabs = selectedVisit
    ? labRequests.filter(l =>
        (l.uhid === patient.uhid || l.patientName.toLowerCase() === patient.name.toLowerCase()) &&
        (l.date === selectedVisit.date || selectedVisit.labRequest?.includes(l.tests))
      )
    : [];

  const selectedVisitScans = selectedVisit
    ? scanRequests.filter(s =>
        (s.uhid === patient.uhid || s.patientName.toLowerCase() === patient.name.toLowerCase()) &&
        (s.date === selectedVisit.date || selectedVisit.scanRequest?.includes(s.scanType))
      )
    : [];

  const handlePrintDayTreatment = () => {
    window.print();
  };

  return (
    <div className="patient-detail-page page-transition">
      
      {/* Executive Patient Profile Top Header Card */}
      <div className="patient-profile-header-card">
        <div className="profile-top-bar">
          <div className="profile-identity">
            <div className="patient-avatar-box">
              {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <h2 className="patient-name-title">
                {patient.name}
              </h2>
              <div className="patient-meta-row">
                <span className="patient-meta-pill"><strong>UHID:</strong> {patient.uhid}</span>
                <span className="patient-meta-pill"><strong>ID:</strong> {patient.patientId || '-'}</span>
                <span className="patient-meta-pill"><strong>Age:</strong> {patient.age} Yrs</span>
                <span className="patient-meta-pill"><strong>Gender:</strong> {patient.sex}</span>
                {patient.phone && (
                  <span className="patient-meta-pill"><strong>Phone:</strong> {patient.phone}</span>
                )}
                {patient.aadharNumber && (
                  <span className="patient-meta-pill"><strong>Aadhar:</strong> {patient.aadharNumber}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              className="btn-profile-action primary"
              onClick={() => navigate('/doctor')}
            >
              <Stethoscope size={16} /> New Consultation
            </button>
            <button
              className="btn-profile-action"
              onClick={handlePrintDayTreatment}
            >
              <Printer size={16} /> Print Selected Day Treatment
            </button>
            <button
              className="btn-profile-action"
              onClick={() => navigate('/doctor/patient-history')}
            >
              <ArrowLeft size={16} /> Back to Directory
            </button>
          </div>
        </div>

        {/* Patient Vitals Overview Cards Grid */}
        <div className="patient-vitals-grid">
          <div className="vital-metric-card">
            <div className="header-row">
              <span className="label">Blood Pressure</span>
              <div className="icon-wrap red">
                <HeartPulse size={15} />
              </div>
            </div>
            <div className="value">{selectedVisit?.bp || patient.bloodPressure || '120/80'}</div>
            <div className="subtext">mmHg</div>
          </div>

          <div className="vital-metric-card">
            <div className="header-row">
              <span className="label">Pulse Rate</span>
              <div className="icon-wrap blue">
                <Activity size={15} />
              </div>
            </div>
            <div className="value">{selectedVisit?.pulse || patient.pulseRate || '74'}</div>
            <div className="subtext">bpm</div>
          </div>

          <div className="vital-metric-card">
            <div className="header-row">
              <span className="label">Body Weight</span>
              <div className="icon-wrap green">
                <Scale size={15} />
              </div>
            </div>
            <div className="value">{selectedVisit?.weight || patient.weight || '-'}</div>
            <div className="subtext">kg</div>
          </div>

          <div className="vital-metric-card">
            <div className="header-row">
              <span className="label">Contact Phone</span>
              <div className="icon-wrap purple">
                <Phone size={15} />
              </div>
            </div>
            <div className="value" style={{ fontSize: '15px' }}>{patient.phone || '-'}</div>
            <div className="subtext">Primary Contact</div>
          </div>

          <div className="vital-metric-card">
            <div className="header-row">
              <span className="label">Preferred Doctor</span>
              <div className="icon-wrap amber">
                <Stethoscope size={15} />
              </div>
            </div>
            <div className="value" style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {patient.preferredDoctor || 'DR.SRI JANANI,MD.,OG.,'}
            </div>
            <div className="subtext">Attending Physician</div>
          </div>

          <div className="vital-metric-card">
            <div className="header-row">
              <span className="label">Total Visits</span>
              <div className="icon-wrap blue">
                <History size={15} />
              </div>
            </div>
            <div className="value">{visits.length}</div>
            <div className="subtext">Hospital Visits</div>
          </div>
        </div>
      </div>

      {/* Master-Detail Split Container */}
      <div className="history-master-detail-grid">
        
        {/* Left Sidebar: Master Visit List with Date & Time */}
        <div className="visit-master-panel">
          <div className="visit-master-header">
            <h4>
              <History size={18} /> Hospital Visit History ({visits.length})
            </h4>
            <span className="badge">
              Select Visit
            </span>
          </div>

          <div className="visit-list-scroll">
            {visits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748b' }}>
                <History size={36} color="#cbd5e1" />
                <p style={{ marginTop: '8px', fontSize: '14px' }}>No previous visit records found.</p>
              </div>
            ) : (
              visits.map((v, index) => {
                const isSelected = (selectedVisit && selectedVisit.id === v.id) || (selectedVisitId === v.id);
                const visitNumber = visits.length - index;

                return (
                  <div
                    key={v.id || index}
                    className={`visit-list-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedVisitId(v.id)}
                  >
                    <div className="visit-item-top">
                      <span className="visit-time-badge">
                        <Calendar size={12} /> {v.date} {v.time ? `• ${v.time}` : ''}
                      </span>
                      <span className="visit-number-tag">Visit #{visitNumber}</span>
                    </div>

                    <div className="visit-item-diag">
                      {v.diagnosis || 'Routine Consultation / Checkup'}
                    </div>

                    <div className="visit-item-sub">
                      <span className="visit-item-doctor">{v.visitType || 'OPD Consultation'}</span>
                      <span className="visit-view-link">
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Panel: Treatments & Care Provided On That Day */}
        <div className="visit-detail-panel">
          {!selectedVisit ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <Stethoscope size={48} color="#cbd5e1" />
              <h4 style={{ marginTop: '12px', color: '#1e293b' }}>Select a Visit Date & Time</h4>
              <p>Click on any hospital visit from the left list to inspect the complete treatment provided on that day.</p>
            </div>
          ) : (
            <div>
              {/* Day Treatment Banner */}
              <div className="day-treatment-header">
                <div className="day-treatment-title">
                  <h3>
                    <Stethoscope size={22} color="#60A5FA" />
                    Treatment Provided On {selectedVisit.date} {selectedVisit.time ? `@ ${selectedVisit.time}` : ''}
                  </h3>
                  <div className="day-treatment-sub">
                    Attending Physician: <strong>{selectedVisit.doctorName || patient.preferredDoctor || 'DR.SRI JANANI,MD.,OG.,'}</strong> • Type: {selectedVisit.visitType || 'OPD Consultation'}
                  </div>
                </div>

                <div>
                  <span className="badge-tag green" style={{ fontSize: '13px', padding: '6px 14px' }}>
                    Consultation Fee: ₹{selectedVisit.fee || '500'} Paid
                  </span>
                </div>
              </div>

              {/* 1. Clinical Vitals & Chief Complaints */}
              <div className="treatment-section-card">
                <h5>
                  <Activity size={18} color="#2563eb" /> 1. Vitals & Chief Complaints Recorded On That Visit
                </h5>

                <div className="day-vitals-row" style={{ marginBottom: '14px' }}>
                  <div className="day-vital-box">
                    <div className="v-label">Blood Pressure</div>
                    <div className="v-value">{selectedVisit.bp || '120/80'} mmHg</div>
                  </div>
                  <div className="day-vital-box">
                    <div className="v-label">Pulse Rate</div>
                    <div className="v-value">{selectedVisit.pulse || '74'} bpm</div>
                  </div>
                  <div className="day-vital-box">
                    <div className="v-label">Body Temperature</div>
                    <div className="v-value">{selectedVisit.temp || '98.6'} °F</div>
                  </div>
                  <div className="day-vital-box">
                    <div className="v-label">Body Weight</div>
                    <div className="v-value">{selectedVisit.weight || patient.weight || '-'} kg</div>
                  </div>
                </div>

                {selectedVisit.complaints && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ fontSize: '13px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chief Complaints & Symptoms:</strong>
                    <p style={{ margin: '6px 0 0 0', fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>
                      {selectedVisit.complaints}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Diagnosis & Doctor Assessment */}
              <div className="treatment-section-card">
                <h5>
                  <FileText size={18} color="#2563eb" /> 2. Diagnosis & Doctor Examination Notes
                </h5>
                
                <div style={{ marginBottom: '14px' }}>
                  <strong style={{ fontSize: '13px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Diagnosis:</strong>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                    {selectedVisit.diagnosis || 'General Clinical Consultation / Routine Checkup'}
                  </div>
                </div>

                {selectedVisit.notes && (
                  <div style={{ backgroundColor: '#eff6ff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <strong style={{ fontSize: '13px', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Doctor Advice & Examination Notes:</strong>
                    <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#1e293b', lineHeight: 1.5 }}>
                      {selectedVisit.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Prescribed Treatments & Medicines */}
              <div className="treatment-section-card">
                <h5>
                  <Pill size={18} color="#059669" /> 3. Prescribed Medications & Dosage Provided On That Day
                </h5>

                {parseMedicinesList(selectedVisit.prescription).length === 0 ? (
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
                    No medicines prescribed during this visit.
                  </p>
                ) : (
                  <table className="day-meds-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Prescribed Medicine & Dosage</th>
                        <th>Status / Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseMedicinesList(selectedVisit.prescription).map((med, idx) => (
                        <tr key={idx}>
                          <td style={{ width: '60px', fontWeight: 700, color: '#64748b' }}>#{idx + 1}</td>
                          <td><strong style={{ color: '#0f172a' }}>{med}</strong></td>
                          <td>
                            <span className="badge-tag green">
                              <CheckCircle2 size={13} /> Prescribed & Dispatched
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 4. Laboratory Tests On That Day */}
              <div className="treatment-section-card">
                <h5>
                  <TestTube2 size={18} color="#9333ea" /> 4. Laboratory Tests & Pathology Orders On That Day
                </h5>

                {!selectedVisit.labRequest && selectedVisitLabs.length === 0 ? (
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
                    No lab tests requested or conducted on this date.
                  </p>
                ) : (
                  <div>
                    {selectedVisit.labRequest && (
                      <div style={{ backgroundColor: '#faf5ff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e9d5ff', marginBottom: '12px' }}>
                        <strong style={{ fontSize: '13px', color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lab Investigation Request:</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: 700, color: '#3b0764' }}>
                          {selectedVisit.labRequest}
                        </p>
                      </div>
                    )}

                    {selectedVisitLabs.map(lab => (
                      <div key={lab.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>{lab.tests}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Order ID: {lab.id} • Date: {lab.date}</div>
                        </div>
                        <span className={`badge-tag ${lab.status === 'Completed' ? 'green' : 'blue'}`}>
                          {lab.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Scan & Radiology Findings On That Day */}
              <div className="treatment-section-card">
                <h5>
                  <ScanIcon size={18} color="#d97706" /> 5. Scan & Ultrasound Procedures On That Day
                </h5>

                {!selectedVisit.scanRequest && selectedVisitScans.length === 0 ? (
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
                    No scan or radiology procedures performed on this date.
                  </p>
                ) : (
                  <div>
                    {selectedVisit.scanRequest && (
                      <div style={{ backgroundColor: '#fffbeb', padding: '14px 16px', borderRadius: '10px', border: '1px solid #fde68a', marginBottom: '12px' }}>
                        <strong style={{ fontSize: '13px', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ultrasound / Scan Requested:</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: 700, color: '#78350f' }}>
                          {selectedVisit.scanRequest}
                        </p>
                      </div>
                    )}

                    {selectedVisitScans.map(scan => (
                      <div key={scan.id} style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <strong style={{ color: '#0f172a', fontSize: '15px' }}>{scan.scanType}</strong>
                          <span className={`badge-tag ${scan.status === 'Completed' ? 'green' : 'amber'}`}>
                            {scan.status}
                          </span>
                        </div>
                        {scan.radiologist && (
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Radiologist: <strong>{scan.radiologist}</strong>
                          </div>
                        )}
                        {scan.findings && (
                          <div style={{ marginTop: '10px', fontSize: '14px', color: '#1e293b', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', lineHeight: 1.5 }}>
                            <strong style={{ color: '#0f172a' }}>Radiology Findings:</strong> {scan.findings}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Billing & Consultation Summary */}
              <div className="treatment-section-card" style={{ marginBottom: 0 }}>
                <h5>
                  <Receipt size={18} color="#2563eb" /> 6. Consultation Billing & Charges On That Day
                </h5>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>OPD Consultation & Service Fee</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>₹{selectedVisit.fee || '500'}.00</div>
                  </div>

                  <span className="badge-tag green" style={{ fontSize: '13px', padding: '6px 14px' }}>
                    <CheckCircle2 size={14} /> Payment Received • Cash/GPay
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DoctorPatientDetailHistory;
