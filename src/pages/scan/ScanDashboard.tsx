import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital, type ScanRequest } from '../../context/HospitalContext';
import { 
  Activity, Upload, Search, FileText, CheckCircle, Clock, 
  Printer, X, Plus, ArrowLeft, Download, ShieldCheck, Eye 
} from 'lucide-react';
import './ScanDashboard.css';

const ScanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, scanRequests, addScanRequest, updateScanReport } = useHospital();

  // Filter and tab state
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Active record for modals
  const [selectedScan, setSelectedScan] = useState<ScanRequest | null>(null);

  // Upload Modal Form State
  const [uploadScanId, setUploadScanId] = useState('');
  const [uploadUhid, setUploadUhid] = useState('');
  const [uploadPatientName, setUploadPatientName] = useState('');
  const [uploadScanType, setUploadScanType] = useState('Obstetric Anomaly USG Scan');
  const [uploadRadiologist, setUploadRadiologist] = useState('Dr. G. Srijaya');
  const [uploadFindings, setUploadFindings] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadAmount, setUploadAmount] = useState('2000');

  // New Scan Entry Modal Form State
  const [newUhid, setNewUhid] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newScanType, setNewScanType] = useState('NT SCAN');
  const [newRadiologist, setNewRadiologist] = useState('Dr. G. Srijaya');
  const [newAmount, setNewAmount] = useState('2500');

  // Filtered Scans List
  const filteredScans = useMemo(() => {
    return scanRequests.filter(scan => {
      // Tab filter
      if (activeTab === 'pending' && scan.status !== 'Pending') return false;
      if (activeTab === 'completed' && scan.status !== 'Completed') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          scan.patientName.toLowerCase().includes(query) ||
          scan.uhid.toLowerCase().includes(query) ||
          scan.scanType.toLowerCase().includes(query) ||
          scan.id.toLowerCase().includes(query) ||
          (scan.radiologist && scan.radiologist.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [scanRequests, activeTab, searchQuery]);

  // Statistics calculation
  const totalScans = scanRequests.length;
  const pendingScansCount = scanRequests.filter(s => s.status === 'Pending').length;
  const completedScansCount = scanRequests.filter(s => s.status === 'Completed').length;
  const totalCollections = scanRequests.reduce((sum, s) => sum + (s.amount || 2000), 0);

  // Handlers
  const handleOpenUploadModal = (scan?: ScanRequest) => {
    if (scan) {
      setSelectedScan(scan);
      setUploadScanId(scan.id);
      setUploadUhid(scan.uhid);
      setUploadPatientName(scan.patientName);
      setUploadScanType(scan.scanType);
      setUploadRadiologist(scan.radiologist || 'Dr. G. Srijaya');
      setUploadFindings(scan.findings || '');
      setUploadFileName(scan.reportFile || `${scan.scanType.replace(/\s+/g, '_')}_Report.pdf`);
      setUploadAmount((scan.amount || 2000).toString());
    } else {
      setSelectedScan(null);
      setUploadScanId(`SCN-${Math.floor(100 + Math.random() * 900)}`);
      setUploadUhid('');
      setUploadPatientName('');
      setUploadScanType('Obstetric Anomaly USG Scan');
      setUploadRadiologist('Dr. G. Srijaya');
      setUploadFindings('');
      setUploadFileName('');
      setUploadAmount('');
    }
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFileName(e.target.files[0].name);
    }
  };

  const handleSaveUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPatientName.trim()) {
      alert('Please select or enter Patient Name');
      return;
    }

    const reportFileToSave = uploadFileName.trim() || `${uploadScanType.replace(/\s+/g, '_')}_Report.pdf`;

    if (selectedScan) {
      updateScanReport(selectedScan.id, reportFileToSave, uploadFindings, uploadRadiologist);
      alert(`Scan Report successfully uploaded and attached for ${selectedScan.patientName}!`);
    } else {
      const newScan: ScanRequest = {
        id: uploadScanId || `SCN-${Date.now().toString().slice(-4)}`,
        patientName: uploadPatientName,
        uhid: uploadUhid || 'UHID-NEW',
        scanType: uploadScanType,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        reportFile: reportFileToSave,
        findings: uploadFindings,
        radiologist: uploadRadiologist,
        amount: parseFloat(uploadAmount) || 2000
      };
      addScanRequest(newScan);
      alert(`New Scan Record and Report saved successfully for ${uploadPatientName}!`);
    }

    setShowUploadModal(false);
  };

  const handleCreateNewScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) {
      alert('Please enter Patient Name');
      return;
    }

    const newScan: ScanRequest = {
      id: `SCN-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newPatientName,
      uhid: newUhid || `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      scanType: newScanType,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      radiologist: newRadiologist,
      amount: parseFloat(newAmount) || 2000
    };

    addScanRequest(newScan);
    alert(`Scan Order created successfully for ${newPatientName}!`);
    setShowNewScanModal(false);

    // Reset Form
    setNewUhid('');
    setNewPatientName('');
  };

  const handleOpenViewModal = (scan: ScanRequest) => {
    setSelectedScan(scan);
    setShowViewModal(true);
  };

  const handleSelectPatientForNewScan = (p: any) => {
    setNewUhid(p.uhid);
    setNewPatientName(p.name);
  };

  const handleSelectPatientForUpload = (p: any) => {
    setUploadUhid(p.uhid);
    setUploadPatientName(p.name);
  };

  return (
    <div className="scan-container page-transition">
      
      {/* Header Banner */}
      <div className="scan-header">
        <div>
          <h2>RADIOLOGY & SCAN CENTER</h2>
          <p>Scan Orders, Digital Imaging Report Uploads, and Diagnostic Results Management</p>
        </div>
        <div className="scan-header-actions">
          <button 
            type="button" 
            className="btn-view"
            style={{ backgroundColor: '#0284c7', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/scan/upload')}
          >
            <Upload size={16} /> Upload Scan Report
          </button>

          <button 
            type="button" 
            className="btn-view"
            style={{ backgroundColor: '#10b981', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowNewScanModal(true)}
          >
            <Plus size={16} /> New Scan Entry
          </button>

          <button 
            type="button" 
            className="btn-view" 
            onClick={() => navigate('/admin/expenses/add?dept=Scan&from=scan')}
            style={{ background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add Expense
          </button>

          <button 
            type="button" 
            className="btn-back-page" 
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#1e293b', color: 'white', border: 'none',
              padding: '8px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="scan-stats-grid">
        <div className="scan-stat-card">
          <div className="scan-stat-icon blue"><Activity size={24} /></div>
          <div className="scan-stat-info">
            <h4>Total Scan Orders</h4>
            <div className="stat-value">{totalScans}</div>
          </div>
        </div>

        <div className="scan-stat-card">
          <div className="scan-stat-icon orange"><Clock size={24} /></div>
          <div className="scan-stat-info">
            <h4>Pending Uploads</h4>
            <div className="stat-value">{pendingScansCount}</div>
          </div>
        </div>

        <div className="scan-stat-card">
          <div className="scan-stat-icon green"><CheckCircle size={24} /></div>
          <div className="scan-stat-info">
            <h4>Reports Uploaded</h4>
            <div className="stat-value">{completedScansCount}</div>
          </div>
        </div>

        <div className="scan-stat-card">
          <div className="scan-stat-icon purple"><FileText size={24} /></div>
          <div className="scan-stat-info">
            <h4>Total Scan Revenue</h4>
            <div className="stat-value">₹{totalCollections.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Scan Records List & Filters */}
      <div className="scan-main-card">
        <div className="scan-controls-bar">
          <div className="scan-tabs">
            <button 
              className={`scan-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Scans ({totalScans})
            </button>
            <button 
              className={`scan-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Uploads ({pendingScansCount})
            </button>
            <button 
              className={`scan-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Reports Uploaded ({completedScansCount})
            </button>
          </div>

          <div className="scan-search-wrapper">
            <Search className="scan-search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search patient, UHID, or scan type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scan Records Table */}
        <div className="scan-table-wrapper">
          <table className="scan-data-table">
            <thead>
              <tr>
                <th>Scan ID</th>
                <th>Patient UHID</th>
                <th>Patient Name</th>
                <th>Scan Modality / Type</th>
                <th>Date</th>
                <th>Radiologist</th>
                <th>Charges (₹)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No scan records match the criteria.
                  </td>
                </tr>
              ) : (
                filteredScans.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 700, color: '#0284c7' }}>{row.id}</td>
                    <td><span className="badge-uhid">UHID: {row.uhid}</span></td>
                    <td style={{ fontWeight: 600 }}>{row.patientName}</td>
                    <td>{row.scanType}</td>
                    <td>{row.date}</td>
                    <td>{row.radiologist || 'Dr. G. Srijaya'}</td>
                    <td style={{ fontWeight: 600 }}>₹{(row.amount || 2000).toLocaleString()}</td>
                    <td>
                      {row.status === 'Completed' ? (
                        <span className="scan-badge completed">
                          <CheckCircle size={14} /> Report Ready
                        </span>
                      ) : (
                        <span className="scan-badge pending">
                          <Clock size={14} /> Upload Pending
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {row.status === 'Pending' ? (
                          <button 
                            className="tbl-btn tbl-btn-upload"
                            onClick={() => navigate('/scan/upload', { state: { scanId: row.id } })}
                            title="Upload Scan Report File"
                          >
                            <Upload size={14} /> Upload Report
                          </button>
                        ) : (
                          <button 
                            className="tbl-btn tbl-btn-view"
                            onClick={() => handleOpenViewModal(row)}
                            title="View Attached Scan Report"
                          >
                            <Eye size={14} /> View Report
                          </button>
                        )}
                        <button 
                          className="tbl-btn tbl-btn-print"
                          onClick={() => handleOpenViewModal(row)}
                          title="Print Scan Slip"
                        >
                          <Printer size={14} /> Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: UPLOAD SCAN REPORT MODAL --- */}
      {showUploadModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card" style={{ width: '650px', padding: '28px', background: 'white', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={20} /> Upload Scan Report
              </h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUploadReport}>
              <div className="modal-form-group">
                <label>Select Registered Patient (Optional)</label>
                <select 
                  className="form-control"
                  value=""
                  onChange={(e) => {
                    const found = patients.find(p => p.name === e.target.value);
                    if (found) handleSelectPatientForUpload(found);
                  }}
                >
                  <option value="">-- Choose Existing Registered Patient --</option>
                  {patients.map((p, idx) => (
                    <option key={idx} value={p.name}>
                      {p.name} (UHID: {p.uhid} | Ph: {p.phone || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Patient UHID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={uploadUhid} 
                    onChange={(e) => setUploadUhid(e.target.value)} 
                    placeholder="e.g. 3490"
                  />
                </div>

                <div className="modal-form-group">
                  <label>Patient Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={uploadPatientName} 
                    onChange={(e) => setUploadPatientName(e.target.value)} 
                    placeholder="Enter patient full name"
                  />
                  {patients.length > 0 && uploadPatientName && (
                    <div className="patient-name-dropdown" style={{ position: 'absolute', zIndex: 100, background: '#fff', border: '1px solid #ccc', width: '100%', maxHeight: '150px', overflowY: 'auto' }}>
                      {patients.filter(p => p.name.toLowerCase().includes(uploadPatientName.toLowerCase())).map((p, idx) => (
                        <div
                          key={idx}
                          style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px' }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectPatientForUpload(p);
                          }}
                          onClick={() => handleSelectPatientForUpload(p)}
                        >
                          <strong>{p.name}</strong> (UHID: {p.uhid} | Ph: {p.phone})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Scan Modality / Type</label>
                  <select 
                    className="form-control"
                    value={uploadScanType}
                    onChange={(e) => setUploadScanType(e.target.value)}
                  >
                    <option value="Obstetric Anomaly USG Scan">Obstetric Anomaly USG Scan</option>
                    <option value="Abdomen & Pelvis USG Scan">Abdomen & Pelvis USG Scan</option>
                    <option value="Fetal Echocardiography">Fetal Echocardiography</option>
                    <option value="NT Scan & Nasal Bone">NT Scan & Nasal Bone</option>
                    <option value="Transvaginal Scan (TVS)">Transvaginal Scan (TVS)</option>
                    <option value="Growth & Color Doppler USG">Growth & Color Doppler USG</option>
                    <option value="Chest X-Ray PA View">Chest X-Ray PA View</option>
                    <option value="Mammography">Mammography</option>
                    <option value="Follicular Monitoring Scan">Follicular Monitoring Scan</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label>Consulting Radiologist</label>
                  <select 
                    className="form-control"
                    value={uploadRadiologist}
                    onChange={(e) => setUploadRadiologist(e.target.value)}
                  >
                    <option value="Dr. G. Srijaya">Dr. G. Srijaya, MD (OG)</option>
                    <option value="Dr. S. Raman">Dr. S. Raman, MD (Radiology)</option>
                    <option value="Dr. Consulting Radiologist">Dr. Consulting Radiologist</option>
                  </select>
                </div>
              </div>

              <div className="modal-form-group">
                <label>Radiological Findings / Clinical Impression</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={uploadFindings}
                  onChange={(e) => setUploadFindings(e.target.value)}
                  placeholder="Enter scan summary, fetal gestational age, weight, and impression..."
                ></textarea>
              </div>

              <div className="modal-form-group">
                <label>Attach Scan Report File (PDF / Images / DICOM)</label>
                <div className="file-dropzone" onClick={() => document.getElementById('scan-file-input')?.click()}>
                  <Upload size={28} color="#0284c7" style={{ marginBottom: '8px' }} />
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    {uploadFileName ? `Attached: ${uploadFileName}` : 'Click to select or drag & drop Scan Report file'}
                  </p>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Supports PDF, PNG, JPG, DICOM files</span>
                  <input 
                    type="file" 
                    id="scan-file-input" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Scan Charges (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={uploadAmount}
                    onChange={(e) => setUploadAmount(e.target.value)} 
                  />
                </div>

                <div className="modal-form-group">
                  <label>Status</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value="Completed & Report Ready" 
                    disabled 
                    style={{ backgroundColor: '#f1f5f9' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="action-btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn-view" style={{ backgroundColor: '#0284c7', color: 'white', padding: '8px 24px' }}>
                  Upload & Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: NEW SCAN ENTRY MODAL --- */}
      {showNewScanModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card" style={{ width: '550px', padding: '28px', background: 'white', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '12px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} /> Create New Scan Order
              </h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowNewScanModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewScan}>
              <div className="modal-form-group">
                <label>Select Registered Patient</label>
                <select 
                  className="form-control"
                  onChange={(e) => {
                    const found = patients.find(p => p.name === e.target.value);
                    if (found) handleSelectPatientForNewScan(found);
                  }}
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p, idx) => (
                    <option key={idx} value={p.name}>
                      {p.name} (UHID: {p.uhid})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Patient UHID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newUhid} 
                    onChange={(e) => setNewUhid(e.target.value)} 
                    placeholder="e.g. 3490"
                  />
                </div>

                <div className="modal-form-group">
                  <label>Patient Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newPatientName} 
                    onChange={(e) => setNewPatientName(e.target.value)} 
                    placeholder="Patient Name"
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>Scan Modality / Test Type</label>
                <select 
                  className="form-control"
                  value={newScanType}
                  onChange={(e) => setNewScanType(e.target.value)}
                >
                  <option value="NT SCAN">NT SCAN</option>
                  <option value="ANOMALY SCAN">ANOMALY SCAN</option>
                  <option value="ABDOMEN KUB PELVIS">ABDOMEN KUB PELVIS</option>
                  <option value="EARLY-VIABILTY">EARLY-VIABILTY</option>
                  <option value="PELVIC SCAN">PELVIC SCAN</option>
                  <option value="GROWTH">GROWTH</option>
                </select>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Radiologist</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newRadiologist} 
                    onChange={(e) => setNewRadiologist(e.target.value)} 
                  />
                </div>

                <div className="modal-form-group">
                  <label>Scan Fee (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newAmount} 
                    onChange={(e) => setNewAmount(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="action-btn" onClick={() => setShowNewScanModal(false)}>Cancel</button>
                <button type="submit" className="btn-view" style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 24px' }}>
                  Create Scan Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: VIEW SCAN REPORT & PRINT SLIP --- */}
      {showViewModal && selectedScan && (
        <div className="modal-overlay printable-scan-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card printable-scan-modal-card" style={{ width: '650px', padding: '32px', background: 'white', position: 'relative', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '20px' }}>
              {/* <div>
                <h2 style={{ margin: 0, color: '#0284c7', fontSize: '22px', fontWeight: 800 }}>SHRI JANANI HOSPITAL</h2>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>DEPARTMENT OF RADIOLOGY & ULTRASOUND IMAGING</span>
              </div> */}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div><strong>Scan Token ID:</strong> {selectedScan.id}</div>
              <div><strong>Date:</strong> {selectedScan.date}</div>
              <div><strong>Patient Name:</strong> {selectedScan.patientName}</div>
              <div><strong>Patient UHID:</strong> {selectedScan.uhid}</div>
              <div><strong>Scan Modality:</strong> {selectedScan.scanType}</div>
              <div><strong>Radiologist:</strong> {selectedScan.radiologist || 'Dr. G. Srijaya'}</div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '20px', background: 'white' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} /> RADIOLOGICAL IMPRESSION & FINDINGS
              </h4>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-line' }}>
                {selectedScan.findings || 'Single live intrauterine gestation corresponding to gestational age. Fetal cardiac activity, amniotic fluid index, and placenta position appear within normal physiological limits.'}
              </p>
            </div>

            <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', background: '#f1f5f9', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={24} color="#0284c7" />
                <div>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{selectedScan.reportFile || 'Scan_Digital_Report.pdf'}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Digital Medical Image & Report Document</div>
                </div>
              </div>
              <button 
                className="tbl-btn tbl-btn-upload"
                onClick={() => alert(`Downloading file "${selectedScan.reportFile || 'Scan_Report.pdf'}"...`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <Download size={14} /> Download
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Report Verified & Signed by Radiologist
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="action-btn" onClick={() => setShowViewModal(false)}>Close</button>
                <button 
                  className="btn-view" 
                  style={{ backgroundColor: '#1e293b', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px' }} 
                  onClick={() => window.print()}
                >
                  <Printer size={16} /> Print Report Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ScanDashboard;
