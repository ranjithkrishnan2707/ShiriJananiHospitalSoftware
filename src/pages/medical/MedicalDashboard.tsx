import React, { useState } from 'react';
import { Pill, CheckCircle, FileText, User, Phone, Clock, FileWarning } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './MedicalDashboard.css';

const MedicalDashboard: React.FC = () => {
  const { prescriptions, markPrescriptionComplete } = useHospital();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');
  const selectedPrescription = pendingPrescriptions.find(p => p.id === selectedId);

  // If selected prescription is completed by another action, clear selection
  if (selectedId && !selectedPrescription) {
    setSelectedId(null);
  }

  const handleDispense = (id: string) => {
    if (window.confirm('Are you sure you want to mark this as Dispensed & Completed?')) {
      markPrescriptionComplete(id);
      setSelectedId(null);
    }
  };

  return (
    <div className="medical-dashboard-container page-transition">
      <div className="medical-header">
        <Pill size={40} />
        <div>
          <h2>Pharmacy & Medical Module</h2>
          <p>Manage and dispense pending prescriptions</p>
        </div>
      </div>

      <div className="medical-content">
        
        {/* Left Pane (List) */}
        <div className="prescription-list-pane">
          <div className="pane-header">
            Pending Prescriptions ({pendingPrescriptions.length})
          </div>
          <div className="list-container">
            {pendingPrescriptions.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <CheckCircle size={48} color="#4CAF50" style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h4>All Clear!</h4>
                <p style={{ fontSize: '14px' }}>No pending prescriptions.</p>
              </div>
            ) : (
              pendingPrescriptions.map(p => (
                <div 
                  key={p.id} 
                  className={`prescription-list-item ${selectedId === p.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div className="list-item-header">
                    <span className="list-item-name">{p.patientName}</span>
                    <span className="list-item-time">{p.time}</span>
                  </div>
                  <div className="list-item-doctor">
                    {p.doctorName} • {p.uhid}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane (Detail) */}
        <div className="prescription-detail-pane">
          {!selectedPrescription ? (
            <div className="empty-state">
              <FileText size={80} className="empty-state-icon" />
              <h3>Select a Prescription</h3>
              <p>Click on a prescription from the list to view details and dispense medicines.</p>
            </div>
          ) : (
            <>
              <div className="pane-header" style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Prescription Details</span>
                <span style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>Ref: {selectedPrescription.id}</span>
              </div>
              
              <div className="detail-scroll-area">
                
                {/* Patient Info Grid */}
                <div className="detail-grid">
                  <div className="detail-box">
                    <div className="detail-label"><User size={14} style={{ display: 'inline', marginRight: '4px' }}/>Patient Details</div>
                    <div className="detail-value">{selectedPrescription.patientName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                      ID: {selectedPrescription.patientId} | UHID: {selectedPrescription.uhid}
                    </div>
                  </div>
                  
                  <div className="detail-box">
                    <div className="detail-label"><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/>Consultation Info</div>
                    <div className="detail-value">{selectedPrescription.doctorName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                      {selectedPrescription.date} at {selectedPrescription.time}
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-label"><Phone size={14} style={{ display: 'inline', marginRight: '4px' }}/>Contact</div>
                    <div className="detail-value">{selectedPrescription.phone || 'N/A'}</div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-label">Diagnosis / Medical Report</div>
                    <div className="detail-value" style={{ color: 'var(--color-error)' }}>
                      {selectedPrescription.diagnosis || 'No diagnosis provided'}
                    </div>
                  </div>
                </div>

                {/* Medicines */}
                <div className="medicines-box">
                  <div className="detail-label" style={{ marginBottom: '12px' }}>
                    <Pill size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/>
                    Prescribed Medicines (Dosage & Quantity)
                  </div>
                  <div className="medicines-content">
                    {selectedPrescription.medicines}
                  </div>
                </div>

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div className="notes-box">
                    <div className="detail-label" style={{ color: '#E65100', marginBottom: '8px' }}>
                      <FileWarning size={14} style={{ display: 'inline', marginRight: '4px' }}/>
                      Examintion from Doctor
                    </div>
                    <div style={{ color: '#E65100', fontSize: '14px' }}>
                      {selectedPrescription.notes}
                    </div>
                  </div>
                )}
                
              </div>

              {/* Footer Action */}
              <div className="detail-footer">
                <button 
                  className="btn-dispense"
                  onClick={() => handleDispense(selectedPrescription.id)}
                >
                  <CheckCircle size={20} />
                  Dispense & Complete
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default MedicalDashboard;
