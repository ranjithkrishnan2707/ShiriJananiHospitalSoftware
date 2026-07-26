import React, { useState } from 'react';
import { Search, History, Plus, Trash2, Pill } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import type { Patient } from '../../context/HospitalContext';
import './DoctorConsultation.css';

export interface PrescribedTabletRow {
  id: number;
  tabletName: string;
  mg: string;
  timing: string; // 'AF' | 'BF'
  days: string;
}

const DoctorConsultation: React.FC = () => {
  const { patients, addConsultation, openDoctorListModal } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [labTests, setLabTests] = useState('');
  const [scanRequests, setScanRequests] = useState('');
  const [notes, setNotes] = useState('');
  const [fee, setFee] = useState('');

  // Table State for Prescribed Medicines / Tablets
  const [medicineRows, setMedicineRows] = useState<PrescribedTabletRow[]>([
    { id: 1, tabletName: ' ', mg: ' ', timing: ' ', days: ' ' },
  ]);

  const addMedicineRow = () => {
    const nextId = medicineRows.length ? Math.max(...medicineRows.map(m => m.id)) + 1 : 1;
    setMedicineRows(prev => [
      ...prev,
      { id: nextId, tabletName: '', mg: '500', timing: 'AF', days: '5' }
    ]);
  };

  const removeMedicineRow = (id: number) => {
    setMedicineRows(prev => prev.filter(m => m.id !== id));
  };

  const updateMedicineRow = (id: number, field: keyof PrescribedTabletRow, value: string) => {
    setMedicineRows(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setShowDropdown(false);
  };

  const handleUpdate = () => {
    if (!selectedPatient) return;

    // Convert medicine rows into formatted string for context & pharmacy dispatch
    const formattedMedicines = medicineRows
      .filter(m => m.tabletName.trim() !== '')
      .map(m => `${m.tabletName} ${m.mg ? m.mg + 'mg' : ''} (${m.timing}) - ${m.days} days`)
      .join('; ');

    addConsultation(
      selectedPatient.uhid,
      diagnosis,
      formattedMedicines || 'No medicines prescribed',
      labTests,
      scanRequests,
      notes,
      fee
    );

    alert('Consultation updated successfully! Prescriptions sent to Pharmacy & notifications dispatched.');
    
    // Clear form
    setSelectedPatient(null);
    setSearchTerm('');
    setDiagnosis('');
    setMedicineRows([
      { id: 1, tabletName: '', mg: '', timing: 'AF', days: '' }
    ]);
    setLabTests('');
    setScanRequests('');
    setNotes('');
    setFee('');
  };

  return (
    <div className="doctor-consultation-container page-transition">
      {/* Left Column */}
      <div className="consultation-form-section">
        
        {/* Smart Search & Quick Doctor List Trigger */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="search-container" style={{ flex: 1 }}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="smart-search-input" 
              placeholder="Smart Patient Search (Name, UHID, ID, Phone)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            
            {showDropdown && searchTerm && (
              <div className="search-dropdown">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(p => (
                    <div key={p.uhid} className="search-item" onClick={() => handleSelectPatient(p)}>
                      <div>
                        <strong>{p.name}</strong> ({p.age} {p.sex})
                        <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                          UHID: {p.uhid} | Ph: {p.phone}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-item" style={{ color: 'var(--color-text-light)' }}>No patients found.</div>
                )}
              </div>
            )}
          </div>
          
          <button 
            type="button" 
            className="action-btn"
            onClick={openDoctorListModal}
            style={{ 
              backgroundColor: '#0284c7', 
              color: 'white', 
              border: 'none', 
              padding: '10px 16px', 
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📋 Doctor List
          </button>
        </div>

        {/* Patient Details (Auto-populated) */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Patient Details</h3>
          <div className="patient-details-grid">
            <div className="detail-group"><label>Patient Name</label><div className="value">{selectedPatient?.name || '-'}</div></div>
            <div className="detail-group"><label>Age</label><div className="value">{selectedPatient?.age || '-'}</div></div>
            <div className="detail-group"><label>Sex</label><div className="value">{selectedPatient?.sex || '-'}</div></div>
            <div className="detail-group"><label>Weight (kg)</label><div className="value">{selectedPatient?.weight || '-'}</div></div>
            <div className="detail-group"><label>PR (bpm)</label><div className="value">{selectedPatient?.pulseRate || '-'}</div></div>
            <div className="detail-group"><label>BP (mmHg)</label><div className="value">{selectedPatient?.bloodPressure || '-'}</div></div>
            <div className="detail-group"><label>Patient UHID</label><div className="value">{selectedPatient?.uhid || '-'}</div></div>
            <div className="detail-group"><label>Patient ID</label><div className="value">{selectedPatient?.patientId || '-'}</div></div>
            <div className="detail-group"><label>Phone Number</label><div className="value">{selectedPatient?.phone || '-'}</div></div>
            <div className="detail-group" style={{ gridColumn: 'span 3' }}>
              <label>Preferred Doctor</label>
              <div className="value">{selectedPatient?.preferredDoctor || '-'}</div>
            </div>
          </div>
        </div>

        {/* Consultation Form */}
        <div className="card consultation-form">
          <h3 style={{ color: 'var(--color-primary)' }}>Consultation</h3>
          
          <div>
            <label>Diagnosis / Medical Report</label>
            <textarea className="form-control" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter detailed diagnosis..." />
          </div>

          {/* Dynamic Table for Prescribed Medicines / Tablets */}
          <div className="prescription-table-container">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Pill size={18} color="var(--color-primary)" /> Prescribed Medicines / Tablets
            </label>

            <table className="medicine-input-table">
              <thead>
                <tr>
                  <th>Tablet Name</th>
                  <th style={{ width: '100px' }}>Mg</th>
                  <th style={{ width: '130px' }}>AF / BF</th>
                  <th style={{ width: '110px' }}>No. of Days</th>
                  <th style={{ width: '40px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {medicineRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Tab. Paracetamol" 
                        value={row.tabletName} 
                        onChange={(e) => updateMedicineRow(row.id, 'tabletName', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 500" 
                        value={row.mg} 
                        onChange={(e) => updateMedicineRow(row.id, 'mg', e.target.value)} 
                      />
                    </td>
                    <td>
                      <select 
                        className="form-control" 
                        value={row.timing} 
                        onChange={(e) => updateMedicineRow(row.id, 'timing', e.target.value)}
                      >
                        <option value="AF">AF (After Food)</option>
                        <option value="BF">BF (Before Food)</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 5" 
                        value={row.days} 
                        onChange={(e) => updateMedicineRow(row.id, 'days', e.target.value)} 
                      />
                    </td>
                    <td>
                      <button 
                        type="button" 
                        className="btn-icon btn-delete-row" 
                        onClick={() => removeMedicineRow(row.id)} 
                        title="Delete row"
                        disabled={medicineRows.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="button" className="btn-add-med-row" onClick={addMedicineRow}>
              <Plus size={16} /> Add Tablet Row
            </button>
          </div>

          <div>
            <label>Laboratory Test Requests</label>
            <textarea className="form-control" value={labTests} onChange={(e) => setLabTests(e.target.value)} placeholder="Enter lab requests (Sends to Laboratory)..." />
          </div>

          <div>
            <label>Scan / Radiology Requests</label>
            <textarea className="form-control" value={scanRequests} onChange={(e) => setScanRequests(e.target.value)} placeholder="Enter scan requests (Sends to Scan Center)..." />
          </div>

          <div>
            <label>Examintion</label>
            <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Doctor's personal notes..." />
          </div>

          <div>
            <label>Doctor Consultation Fee (₹)</label>
            <input type="number" className="form-control" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="0.00" />
          </div>

          <button className="btn-update-consultation" onClick={handleUpdate} disabled={!selectedPatient}>
            Update Consultation
          </button>
        </div>

      </div>

      {/* Right Column (History) */}
      <div className="card history-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '8px' }}>
          <History color="var(--color-primary)" />
          <h3 style={{ margin: 0 }}>Previous Medical History</h3>
        </div>

        {!selectedPatient ? (
          <div className="empty-history">
            <p>Select a patient to view their medical history.</p>
          </div>
        ) : selectedPatient.history.length === 0 ? (
          <div className="empty-history">
            <p>No previous history found for this patient.</p>
          </div>
        ) : (
          selectedPatient.history.map((hist) => (
            <div key={hist.id} className="card history-card" style={{ padding: '12px 16px' }}>
              <div className="history-date">Consultation on {hist.date}</div>
              
              {hist.diagnosis && (
                <div className="history-item">
                  <strong>Diagnosis:</strong>
                  <p>{hist.diagnosis}</p>
                </div>
              )}
              
              {hist.prescription && (
                <div className="history-item">
                  <strong>Prescriptions:</strong>
                  <p>{hist.prescription}</p>
                </div>
              )}
              
              {hist.labRequest && (
                <div className="history-item">
                  <strong>Lab Reports/Requests:</strong>
                  <p>{hist.labRequest}</p>
                </div>
              )}
              
              {hist.scanRequest && (
                <div className="history-item">
                  <strong>Scan/Radiology:</strong>
                  <p>{hist.scanRequest}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default DoctorConsultation;
