import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import type { DoctorItem } from '../context/HospitalContext';
import './DoctorListModal.css';

const DoctorListModal: React.FC = () => {
  const { doctors, isDoctorListOpen, closeDoctorListModal, addOrUpdateDoctor, deleteDoctor } = useHospital();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>('1');
  const [dname, setDname] = useState('SELF');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // Synchronize form when doctor selected
  useEffect(() => {
    if (selectedDoctorId) {
      const found = doctors.find(d => d.id === selectedDoctorId);
      if (found) {
        setDname(found.dname);
        setContact(found.contact || '');
        setEmail(found.email || '');
        setCity(found.city || '');
      }
    }
  }, [selectedDoctorId, doctors]);

  if (!isDoctorListOpen) return null;

  const handleRowClick = (doc: DoctorItem) => {
    setSelectedDoctorId(doc.id);
    setDname(doc.dname);
    setContact(doc.contact || '');
    setEmail(doc.email || '');
    setCity(doc.city || '');
  };

  const handleSave = () => {
    if (!dname.trim()) {
      alert('Please enter Doctor Name.');
      return;
    }

    const docId = selectedDoctorId || Date.now().toString();
    const newDoc: DoctorItem = {
      id: docId,
      dname: dname.trim(),
      contact: contact.trim(),
      email: email.trim(),
      city: city.trim()
    };

    addOrUpdateDoctor(newDoc);
    setSelectedDoctorId(docId);
    alert(`Doctor details for "${dname}" saved successfully.`);
  };

  const handleEdit = () => {
    if (!selectedDoctorId) {
      alert('Please select a doctor from the list to edit.');
      return;
    }
    const target = doctors.find(d => d.id === selectedDoctorId);
    if (target) {
      setDname(target.dname);
      setContact(target.contact || '');
      setEmail(target.email || '');
      setCity(target.city || '');
      alert(`Editing details for doctor "${target.dname}".`);
    }
  };

  const handleDelete = () => {
    if (!selectedDoctorId) {
      alert('Please select a doctor to delete.');
      return;
    }
    const target = doctors.find(d => d.id === selectedDoctorId);
    if (target) {
      if (window.confirm(`Are you sure you want to delete doctor "${target.dname}"?`)) {
        deleteDoctor(selectedDoctorId);
        handleRefresh();
        alert('Doctor deleted successfully.');
      }
    }
  };

  const handleRefresh = () => {
    setSelectedDoctorId(null);
    setDname('');
    setContact('');
    setEmail('');
    setCity('');
  };

  return (
    <div className="doctor-list-modal-overlay" onClick={closeDoctorListModal}>
      <div className="doctor-list-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Outer Window Header Bar */}
        <div className="doctor-list-window-header">
          <div className="doctor-list-window-title">
            <span style={{ fontSize: '14px' }}>📋</span> Doctors List
          </div>
          <div className="doctor-list-window-controls">
            <button className="win-btn" title="Minimize">_</button>
            <button className="win-btn" title="Maximize">▫</button>
            <button className="win-btn win-btn-close" onClick={closeDoctorListModal} title="Close">✕</button>
          </div>
        </div>

        {/* Outer Window Body */}
        <div className="doctor-list-window-body">
          <div className="doctor-details-box">
            
            {/* Inner Title & Close X Button */}
            <div className="doctor-details-header">
              <div className="doctor-details-title">DOCTOR DETAILS</div>
              <button className="close-x-btn" onClick={closeDoctorListModal} title="Close">
                X
              </button>
            </div>

            {/* Input Form Fields */}
            <div className="doctor-form-grid">
              <div className="doctor-form-row">
                <label>Doctor Name</label>
                <input 
                  type="text" 
                  className="doctor-form-input" 
                  value={dname} 
                  onChange={(e) => setDname(e.target.value)} 
                  placeholder="Enter Doctor Name"
                />
              </div>

              <div className="doctor-form-row">
                <label>Contact</label>
                <input 
                  type="text" 
                  className="doctor-form-input" 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                  placeholder="Enter Contact Number"
                />
              </div>

              <div className="doctor-form-row">
                <label>Email ID</label>
                <input 
                  type="email" 
                  className="doctor-form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter Email Address"
                />
              </div>

              <div className="doctor-form-row">
                <label>City</label>
                <input 
                  type="text" 
                  className="doctor-form-input" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="Enter City"
                />
              </div>
            </div>

            <div className="doctor-divider"></div>

            {/* Doctor Table Grid */}
            <div className="doctor-table-wrapper">
              <table className="doctor-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Dname</th>
                    <th style={{ width: '20%' }}>Contact</th>
                    <th style={{ width: '20%' }}>Email</th>
                    <th style={{ width: '20%' }}>City</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr 
                      key={doc.id}
                      className={selectedDoctorId === doc.id ? 'selected-row' : ''}
                      onClick={() => handleRowClick(doc)}
                    >
                      <td>{doc.dname}</td>
                      <td>{doc.contact}</td>
                      <td>{doc.email}</td>
                      <td>{doc.city}</td>
                    </tr>
                  ))}

                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>
                        No doctor records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Buttons */}
            <div className="doctor-actions-row">
              <button className="doc-btn" onClick={handleSave}>Save</button>
              <button className="doc-btn" onClick={handleEdit}>Edit</button>
              <button className="doc-btn" onClick={handleDelete}>Delete</button>
              <button className="doc-btn" onClick={closeDoctorListModal}>Close</button>
              <button className="doc-btn" onClick={handleRefresh}>Refresh</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorListModal;
