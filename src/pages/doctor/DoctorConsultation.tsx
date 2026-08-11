import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, Plus, Trash2, Pill, ArrowLeft, FolderHeart, Sparkles, Zap, RotateCcw } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import type { Patient } from '../../context/HospitalContext';
import './DoctorConsultation.css';

export interface PrescribedTabletRow {
  id: number;
  tabletName: string;
  mg: string;
  dosage: string; // e.g. '1 - 0 - 1'
  timing: string; // 'AF' | 'BF'
  days: string;
}

const DoctorConsultation: React.FC = () => {
  const navigate = useNavigate();
  const { patients, addConsultation } = useHospital();
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
    { id: 1, tabletName: '', mg: '', dosage: '1 - 0 - 1', timing: 'AF', days: '' },
  ]);

  const addMedicineRow = () => {
    const nextId = medicineRows.length ? Math.max(...medicineRows.map(m => m.id)) + 1 : 1;
    setMedicineRows(prev => [
      ...prev,
      { id: nextId, tabletName: '', mg: '', dosage: '1 - 0 - 1', timing: 'AF', days: '' }
    ]);
  };

  const quickAddMedicine = (name: string, mg: string, defaultDosage: string, timing: string, days: string) => {
    // Check if the last row is completely empty, fill it; otherwise append a new row
    setMedicineRows(prev => {
      const lastRow = prev[prev.length - 1];
      if (lastRow && !lastRow.tabletName.trim()) {
        return prev.map(m => m.id === lastRow.id ? { ...m, tabletName: name, mg, dosage: defaultDosage, timing, days } : m);
      }
      const nextId = prev.length ? Math.max(...prev.map(m => m.id)) + 1 : 1;
      return [...prev, { id: nextId, tabletName: name, mg, dosage: defaultDosage, timing, days }];
    });
  };

  const applyDosageShortcut = (dosageVal: string) => {
    setMedicineRows(prev => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      return prev.map((m, idx) => idx === lastIndex ? { ...m, dosage: dosageVal } : m);
    });
  };

  const clearAllMedicineRows = () => {
    setMedicineRows([
      { id: 1, tabletName: '', mg: '', dosage: '1 - 0 - 1', timing: 'AF', days: '' }
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
      .map(m => `${m.tabletName} ${m.mg ? m.mg + 'mg' : ''} ${m.dosage ? '[' + m.dosage + ']' : ''} (${m.timing}) - ${m.days} days`)
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
      { id: 1, tabletName: '', mg: '', dosage: '1 - 0 - 1', timing: 'AF', days: '' }
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

        {/* Smart Search & Back Button */}
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
            className="btn-back-page"
            onClick={() => navigate('/doctor/patient-history')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
            }}
          >
            <FolderHeart size={16} /> Previous Patient History
          </button>

          <button
            type="button"
            className="btn-back-page"
            onClick={() => navigate('/admin/expenses/add?dept=OPD&from=doctor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(190, 24, 93, 0.25)'
            }}
          >
            <Plus size={16} />  Add Expense
          </button>

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
              padding: '10px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <ArrowLeft size={16} /> Back
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
            <div className="med-section-header">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Pill size={18} color="var(--color-primary)" /> Prescribed Medicines / Tablets
              </label>
              <span className="med-row-count-badge">{medicineRows.length} {medicineRows.length === 1 ? 'Item' : 'Items'}</span>
            </div>

            {/* Quick Prescription Chips */}
            <div className="quick-presets-wrapper">
              <span className="quick-presets-label">
                <Sparkles size={13} color="#0284c7" /> Quick Prescribe:
              </span>
              <div className="quick-presets-scroll">
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Calcium Carbonate', '500', '1 - 0 - 1', 'AF', '30')}>
                  + Tab Calcium 500mg
                </button>
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Iron & Folic Acid', '100', '1 - 0 - 0', 'BF', '30')}>
                  + Tab Iron & Folic Acid
                </button>
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Paracetamol', '650', '1 - 0 - 1', 'AF', '5')}>
                  + Tab Paracetamol 650mg
                </button>
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Doxinate', '10', '1 - 0 - 1', 'BF', '10')}>
                  + Tab Doxinate
                </button>
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Folvite', '5', '1 - 0 - 0', 'AF', '30')}>
                  + Tab Folvite 5mg
                </button>
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Pantocid', '40', '1 - 0 - 0', 'BF', '10')}>
                  + Tab Pantocid 40mg
                </button>
                <button type="button" className="med-chip" onClick={() => quickAddMedicine('Tab Autrin', '', '1 - 0 - 0', 'AF', '30')}>
                  + Tab Autrin
                </button>
              </div>
            </div>

            <table className="medicine-input-table">
              <thead>
                <tr>
                  <th>Tablet Name</th>
                  <th style={{ width: '85px' }}>Mg</th>
                  <th style={{ width: '135px' }}>Dosage (e.g. 1-0-1)</th>
                  <th style={{ width: '135px' }}>AF / BF</th>
                  <th style={{ width: '95px' }}>No. Days</th>
                  <th style={{ width: '40px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {medicineRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="text"
                        className="form-control med-input-name"
                        placeholder="e.g. Tab Paracetamol"
                        value={row.tabletName}
                        onChange={(e) => updateMedicineRow(row.id, 'tabletName', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="650"
                        value={row.mg}
                        onChange={(e) => updateMedicineRow(row.id, 'mg', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control dosage-input-highlight"
                        placeholder="1 - 0 - 1"
                        value={row.dosage}
                        onChange={(e) => updateMedicineRow(row.id, 'dosage', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className={`form-control timing-select ${row.timing.toLowerCase()}`}
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
                        placeholder="5"
                        value={row.days}
                        onChange={(e) => updateMedicineRow(row.id, 'days', e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
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

            {/* Quick Dosage Shortcut Bar */}
            <div className="quick-dosage-toolbar">
              <span className="dosage-tool-label">
                <Zap size={13} color="#ea580c" /> Dosage Shortcuts for active row:
              </span>
              <div className="dosage-btn-group">
                <button type="button" className="dosage-pill-btn" onClick={() => applyDosageShortcut('1 - 0 - 1')}>1 - 0 - 1</button>
                <button type="button" className="dosage-pill-btn" onClick={() => applyDosageShortcut('1 - 1 - 1')}>1 - 1 - 1</button>
                <button type="button" className="dosage-pill-btn" onClick={() => applyDosageShortcut('1 - 0 - 0')}>1 - 0 - 0</button>
                <button type="button" className="dosage-pill-btn" onClick={() => applyDosageShortcut('0 - 0 - 1')}>0 - 0 - 1</button>
                <button type="button" className="dosage-pill-btn" onClick={() => applyDosageShortcut('1 - 1 - 1 - 1')}>1 - 1 - 1 - 1</button>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="med-table-actions-bar">
              <button type="button" className="btn-add-med-row" onClick={addMedicineRow}>
                <Plus size={16} /> Add Tablet Row
              </button>
              
              {medicineRows.length > 1 && (
                <button type="button" className="btn-clear-med-rows" onClick={clearAllMedicineRows}>
                  <RotateCcw size={14} /> Clear All Rows
                </button>
              )}
            </div>
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
