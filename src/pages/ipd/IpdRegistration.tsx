import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { Search, X, UserCheck, ArrowLeft } from 'lucide-react';
import './IpdRegistration.css';

const IpdRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { patients, addOrUpdatePatient } = useHospital();

  const [formData, setFormData] = useState({
    type: 'IP',
    patientIpid: '',
    patientUhid: '',
    patientName: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    contact1: '',
    contact2: '',
    doa: new Date().toISOString().split('T')[0],
    refDoctor: ''
  });

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown state for Patient Name
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const nameDropdownRef = useRef<HTMLDivElement>(null);

  const filteredPreviousPatients = useMemo(() => {
    if (!formData.patientName.trim()) return patients;
    const query = formData.patientName.toLowerCase().trim();
    return patients.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.uhid.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );
  }, [patients, formData.patientName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(event.target as Node)) {
        setShowNameDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchUhid = () => {
    setShowSearchModal(true);
  };

  const selectPatientFromModal = (p: any) => {
    setFormData(prev => ({
      ...prev,
      patientUhid: p.uhid,
      patientName: p.name,
      age: p.age,
      gender: p.sex ? p.sex.toLowerCase() : '',
      contact1: p.phone,
      refDoctor: p.preferredDoctor || '',
      address: p.address || '',
      city: p.city || ''
    }));
    setShowSearchModal(false);
  };

  const handleSave = () => {
    if (!formData.patientName) {
      alert("Please enter patient name");
      return;
    }
    
    addOrUpdatePatient({
      uhid: formData.patientUhid || `UHID-${Date.now().toString().slice(-4)}`,
      patientId: formData.patientIpid ? `PT-${formData.patientIpid}` : `PT-${Date.now().toString().slice(-3)}`,
      name: formData.patientName,
      age: formData.age || '',
      sex: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : '',
      weight: '',
      pulseRate: '',
      bloodPressure: '',
      phone: formData.contact1 || '',
      preferredDoctor: formData.refDoctor,
      history: []
    });

    alert(`IP Registration for ${formData.patientName} Saved Successfully!`);
  };

  const handleEdit = () => {
    alert("Edit Mode Activated. You can now modify patient IPD details.");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete IP Record for ${formData.patientName}?`)) {
      handleRefresh();
      alert("Record Deleted.");
    }
  };

  const handleClose = () => {
    navigate('/ipd');
  };

  const handleRefresh = () => {
    setFormData({
      type: 'IP',
      patientIpid: '',
      patientUhid: '',
      patientName: '',
      age: '',
      gender: '',
      address: '',
      city: '',
      contact1: '',
      contact2: '',
      doa: new Date().toISOString().split('T')[0],
      refDoctor: ''
    });
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  return (
    <div className="ipd-container page-transition">
      <div className="ipd-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>IP REGISTRATION</h2>
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
            padding: '6px 14px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="card ipd-form-card">
        <div className="form-group">
          <label>Type</label>
          <div className="input-container">
            <select 
              className="form-control" 
              name="type" 
              value={formData.type} 
              onChange={handleInputChange} 
              style={{ maxWidth: '200px' }}
            >
              <option value="IP">IP (In-Patient)</option>
              <option value="Emergency">Emergency IP</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Patient IPID</label>
          <div className="input-container">
            <input 
              type="text" 
              className="form-control" 
              name="patientIpid" 
              value={formData.patientIpid} 
              onChange={handleInputChange} 
              style={{ maxWidth: '200px' }} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Patient UHID</label>
          <div className="input-container">
            <input 
              type="text" 
              className="form-control" 
              name="patientUhid" 
              value={formData.patientUhid} 
              onChange={handleInputChange} 
              style={{ maxWidth: '300px' }} 
              placeholder="e.g. UHID-1001"
            />
            <button className="btn-secondary" type="button" onClick={handleSearchUhid} title="Search Patient Database">...</button>
            <button className="btn-primary" type="button" onClick={handleSearchUhid}>View</button>
          </div>
        </div>

        <div className="form-group">
          <label>Patient Name</label>
          <div className="input-container" style={{ position: 'relative' }} ref={nameDropdownRef}>
            <input 
              type="text" 
              className="form-control" 
              name="patientName" 
              value={formData.patientName} 
              onChange={(e) => {
                handleInputChange(e);
                setShowNameDropdown(true);
              }}
              onFocus={() => setShowNameDropdown(true)}
              placeholder="Full Patient Name"
              autoComplete="off"
            />

            {showNameDropdown && filteredPreviousPatients.length > 0 && (
              <div className="patient-name-dropdown">
                <div className="dropdown-header">Previous Patients ({filteredPreviousPatients.length})</div>
                {filteredPreviousPatients.map((p, idx) => (
                  <div
                    key={idx}
                    className="dropdown-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectPatientFromModal(p);
                      setShowNameDropdown(false);
                    }}
                    onClick={() => {
                      selectPatientFromModal(p);
                      setShowNameDropdown(false);
                    }}
                  >
                    <div className="patient-item-name">{p.name}</div>
                    <div className="patient-item-details">
                      {p.uhid && <span className="badge-uhid">UHID: {p.uhid}</span>}
                      {p.patientId && <span className="badge-id">ID: {p.patientId}</span>}
                      {p.phone && <span>Ph: {p.phone}</span>}
                      {p.age && <span>Age: {p.age}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Age</label>
          <div className="input-container">
            <input 
              type="text" 
              className="form-control" 
              name="age" 
              value={formData.age} 
              onChange={handleInputChange} 
              style={{ maxWidth: '150px' }} 
              placeholder="e.g. 45"
            />
            <label style={{ width: 'auto', margin: '8px 12px 0' }}>Gender</label>
            <select 
              className="form-control" 
              name="gender" 
              value={formData.gender} 
              onChange={handleInputChange} 
              style={{ maxWidth: '150px' }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <div className="input-container">
            <textarea 
              className="form-control" 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange}
              placeholder="Residential address..."
            ></textarea>
          </div>
        </div>

        <div className="form-group">
          <label>City</label>
          <div className="input-container">
            <input 
              type="text" 
              className="form-control" 
              name="city" 
              value={formData.city} 
              onChange={handleInputChange} 
              placeholder="City"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contact</label>
          <div className="input-container">
            <input 
              type="text" 
              className="form-control" 
              name="contact1" 
              value={formData.contact1} 
              onChange={handleInputChange} 
              placeholder="Primary Phone"
            />
            <input 
              type="text" 
              className="form-control" 
              name="contact2" 
              value={formData.contact2} 
              onChange={handleInputChange} 
              placeholder="Secondary Phone"
            />
          </div>
        </div>

        <div className="form-group">
          <label>DOA</label>
          <div className="input-container">
            <input 
              type="date" 
              className="form-control" 
              name="doa" 
              value={formData.doa} 
              onChange={handleInputChange} 
              style={{ maxWidth: '200px' }} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ref.Doctor</label>
          <div className="input-container">
            <select 
              className="form-control" 
              name="refDoctor" 
              value={formData.refDoctor} 
              onChange={handleInputChange}
            >
              <option value="">Select Doctor</option>
              <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
              <option value="Dr. Rajiv Menon">Dr. Rajiv Menon</option>
              <option value="Dr. G. Srijaya">Dr. G. Srijaya</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ipd-action-bar">
        <button className="action-btn" type="button" onClick={handleSave}>Save</button>
        <button className="action-btn" type="button" onClick={handleEdit}>Edit</button>
        <button className="action-btn" type="button" onClick={handleDelete}>Delete</button>
        <button className="action-btn btn-close" type="button" onClick={handleClose}>Close</button>
        <button className="action-btn" type="button" onClick={handleRefresh}>Refresh</button>
      </div>

      {/* Patient Search Picker Modal */}
      {showSearchModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card" style={{ width: '600px', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="var(--color-primary)" /> Select Patient for IP Admission
              </h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowSearchModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search patient name, UHID, or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px' }}
                autoFocus
              />
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {filteredPatients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No matching patients found.</div>
              ) : (
                filteredPatients.map(p => (
                  <div 
                    key={p.uhid} 
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0',
                      marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                    onClick={() => selectPatientFromModal(p)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                  >
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--color-text)' }}>{p.name}</strong> ({p.age} Yrs, {p.sex})
                      <div style={{ fontSize: '12px', color: '#64748b' }}>UHID: {p.uhid} | Ph: {p.phone}</div>
                    </div>
                    <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }}>Select</button>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="action-btn" onClick={() => setShowSearchModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default IpdRegistration;
