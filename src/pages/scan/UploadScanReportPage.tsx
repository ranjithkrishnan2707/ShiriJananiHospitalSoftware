import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHospital, type ScanRequest } from '../../context/HospitalContext';
import { 
  ArrowLeft, Upload, CheckCircle, User, 
  Search, ShieldCheck, Activity, Printer, Image, Trash2, X, FileText, Download
} from 'lucide-react';
import './UploadScanReportPage.css';

const SCAN_TYPES = [
  'NT SCAN',
  'ANOMALY SCAN',
  'ABDOMEN KUB PELVIS',
  'EARLY-VIABILTY',
  'PELVIC SCAN',
  'GROWTH'
];

const UploadScanReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, scanRequests, addScanRequest, updateScanReport } = useHospital();

  // Location state passed when navigating from pending scan row
  const locationState = location.state as { scanId?: string } | null;
  const targetScanId = locationState?.scanId;

  // Form states
  const [existingScan, setExistingScan] = useState<ScanRequest | null>(null);
  const [scanId, setScanId] = useState('');
  const [uhid, setUhid] = useState('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [scanType, setScanType] = useState('NT SCAN');
  const [radiologist, setRadiologist] = useState('Dr. G. Srijaya');
  const [amount, setAmount] = useState('2000');
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // --- IMAGE UPLOAD STATES ---
  const [scanImageFile, setScanImageFile] = useState<File | null>(null);
  const [scanImagePreview, setScanImagePreview] = useState<string>('');
  const [fileName, setFileName] = useState('');

  // --- PRINT MODAL STATES ---
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [savedScanForPrint, setSavedScanForPrint] = useState<ScanRequest | null>(null);

  // --- NT SCAN SPECIFIC FORM STATES ---
  const [ntLmpDate, setNtLmpDate] = useState('');
  const [ntEddLmp, setNtEddLmp] = useState('');
  const [ntGestationalAgeLmp, setNtGestationalAgeLmp] = useState('');
  const [ntPlacenta, setNtPlacenta] = useState('Anterior');

  // Biometry
  const [crlCm, setCrlCm] = useState('');
  const [crlWeeks, setCrlWeeks] = useState('');
  const [crlDays, setCrlDays] = useState('');

  const [bpdCm, setBpdCm] = useState('');
  const [bpdWeeks, setBpdWeeks] = useState('');
  const [bpdDays, setBpdDays] = useState('');

  const [hcCm, setHcCm] = useState('');
  const [hcWeeks, setHcWeeks] = useState('');
  const [hcDays, setHcDays] = useState('');

  const [flCm, setFlCm] = useState('');
  const [flWeeks, setFlWeeks] = useState('');
  const [flDays, setFlDays] = useState('');

  // NT & Nasal Markers
  const [ntValueMm, setNtValueMm] = useState('');
  const [nasalBoneMm, setNasalBoneMm] = useState('');

  // Fetal Cardiac & Doppler
  const [fhrBpm, setFhrBpm] = useState('156');
  const [tricuspidRegurgitation, setTricuspidRegurgitation] = useState('No tricuspid regurgitation');
  const [ductusVenosusFlow, setDuctusVenosusFlow] = useState('Appears Normal');
  const [fetalSkullSpine, setFetalSkullSpine] = useState('Appear Normal Grossly');

  // Maternal Doppler
  const [rightUterinePi, setRightUterinePi] = useState('');
  const [leftUterinePi, setLeftUterinePi] = useState('');

  // Impression & EDD
  const [usgWeeks, setUsgWeeks] = useState('');
  const [usgDays, setUsgDays] = useState('');
  const [ntEddUsg, setNtEddUsg] = useState('');
  const [suggestedAnomalyWeeks, setSuggestedAnomalyWeeks] = useState('18 - 22');

  // Initialize form if targetScanId is passed
  useEffect(() => {
    if (targetScanId) {
      const found = scanRequests.find(s => s.id === targetScanId);
      if (found) {
        setExistingScan(found);
        setScanId(found.id);
        setUhid(found.uhid);
        setPatientName(found.patientName);
        setScanType(found.scanType);
        setRadiologist(found.radiologist || 'Dr. G. Srijaya');
        setAmount((found.amount || 2000).toString());
      }
    } else {
      setScanId(`SCN-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [targetScanId, scanRequests]);

  const handleSelectPatient = (p: any) => {
    setUhid(p.uhid);
    setPatientName(p.name);
    setPhone(p.phone || '');
    setShowPatientDropdown(false);
    setPatientSearch('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setScanImageFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setScanImageFile(null);
    setScanImagePreview('');
    setFileName('');
  };

  const generateFindingsText = () => {
    if (scanType === 'NT SCAN') {
      return `NT SCAN RADIOLOGICAL REPORT:
--------------------------------------------------
L.M.P Date: ${ntLmpDate || 'N/A'}
E.D.D as per L.M.P: ${ntEddLmp || 'N/A'}
Gestational Age (as per LMP): ${ntGestationalAgeLmp || 'N/A'}

Placenta: ${ntPlacenta || 'Anterior'}

FETAL BIOMETRY:
• CRL: ${crlCm || '--'} cm (corresponding to ${crlWeeks || '--'} weeks ${crlDays || '--'} days)
• BPD: ${bpdCm || '--'} cm (corresponding to ${bpdWeeks || '--'} weeks ${bpdDays || '--'} days)
• HC: ${hcCm || '--'} cm (corresponding to ${hcWeeks || '--'} weeks ${hcDays || '--'} days)
• FL: ${flCm || '--'} cm (corresponding to ${flWeeks || '--'} weeks ${flDays || '--'} days)

NT & NASAL BONE MARKERS:
• Nuchal Translucency (NT): ${ntValueMm || '--'} mm
• Nasal Bone: Visualized ${nasalBoneMm ? nasalBoneMm + ' mm' : 'Yes'}

FETAL ANATOMY & CARDIAC DOPPLER:
• Fetal Heart Rate: ${fhrBpm || '--'} bpm regular rhythm
• Tricuspid Regurgitation: ${tricuspidRegurgitation}
• Ductus Venosus Flow: ${ductusVenosusFlow}
• Fetal Skull & Spine: ${fetalSkullSpine}

MATERNAL UTERINE DOPPLER:
• Right Uterine Artery PI: ${rightUterinePi || '--'} | Left Uterine Artery PI: ${leftUterinePi || '--'}

IMPRESSION:
Single live intra uterine gestational age corresponding to about ${usgWeeks || '--'} weeks ${usgDays || '--'} days as per USG.
E.D.D as per USG: ${ntEddUsg || 'N/A'}
Suggested ANOMALY Scan between: ${suggestedAnomalyWeeks || '18 - 22'} weeks.`;
    } else {
      return `Single live intrauterine gestation corresponding to gestational age. Fetal cardiac activity and physiological parameters within normal limits for ${scanType}.`;
    }
  };

  const saveScanRecord = (): ScanRequest => {
    const reportFileToSave = fileName.trim() || `${scanType.replace(/\s+/g, '_')}_Report.pdf`;
    const findingsText = generateFindingsText();

    const scanRecord: ScanRequest = {
      id: existingScan ? existingScan.id : (scanId || `SCN-${Date.now().toString().slice(-4)}`),
      patientName: patientName.trim(),
      uhid: uhid.trim() || 'UHID-NEW',
      scanType: scanType,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      reportFile: reportFileToSave,
      findings: findingsText,
      radiologist: radiologist,
      amount: parseFloat(amount) || 2000
    };

    if (existingScan) {
      updateScanReport(existingScan.id, reportFileToSave, findingsText, radiologist);
    } else {
      addScanRequest(scanRecord);
    }

    return scanRecord;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('Please enter or select a Patient Name');
      return;
    }

    saveScanRecord();
    alert(`Scan report saved successfully for ${patientName}!`);
    navigate('/scan');
  };

  const handleSaveAndPrint = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('Please enter or select a Patient Name');
      return;
    }

    const record = saveScanRecord();
    setSavedScanForPrint(record);
    setShowPrintModal(true);
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.uhid.toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.phone && p.phone.includes(patientSearch))
  );

  return (
    <div className="upload-scan-container page-transition">
      {/* Top Header Navigation */}
      <div className="upload-scan-header">
        <div className="header-title-group">
          <button className="btn-back" onClick={() => navigate('/scan')}>
            <ArrowLeft size={18} /> Back to Scan Center
          </button>
          <div>
            <h2>Upload  Scan Report</h2>
            <p>Enter patient details, select scan type, attach scan images, and print report</p>
          </div>
        </div>

        <div className="header-scan-badge">
          <Upload size={20} />
          <span>Report Upload & Print Mode</span>
        </div>
      </div>

      {/* Main Upload Form Card */}
      <div className="upload-scan-card">
        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Patient Selection & Details */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={18} className="title-icon" /> Patient Information
            </h3>

            <div className="patient-selector-box">
              <label>Search & Select Registered Patient (Optional)</label>
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text"
                  placeholder="Type Patient Name, UHID, or Mobile Number..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setShowPatientDropdown(true);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
              </div>

              {showPatientDropdown && patientSearch.trim() !== '' && (
                <div className="patient-dropdown-menu">
                  {filteredPatients.length === 0 ? (
                    <div className="patient-dropdown-item empty">No matching registered patients found</div>
                  ) : (
                    filteredPatients.map((p, idx) => (
                      <div 
                        key={idx} 
                        className="patient-dropdown-item"
                        onClick={() => handleSelectPatient(p)}
                      >
                        <div className="p-name">{p.name}</div>
                        <div className="p-details">UHID: {p.uhid} | Phone: {p.phone || 'N/A'}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Patient UHID <span className="required">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={uhid}
                  onChange={(e) => setUhid(e.target.value)}
                  placeholder="e.g. UHID-3490"
                  required
                />
              </div>

              <div className="form-group">
                <label>Patient Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter full patient name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Scan Modality & Radiologist */}
          <div className="form-section">
            <h3 className="section-title">
              <ShieldCheck size={18} className="title-icon" /> Scan Selection & Radiologist Details
            </h3>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Select Scan <span className="required">*</span></label>
                <select 
                  className="form-control select-scan-type"
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  required
                >
                  {SCAN_TYPES.map((st, idx) => (
                    <option key={idx} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Consulting Radiologist</label>
                <select 
                  className="form-control"
                  value={radiologist}
                  onChange={(e) => setRadiologist(e.target.value)}
                >
                  <option value="Dr. G. Srijaya">Dr. G. Srijaya, MD (OG)</option>
                  <option value="Dr. S. Raman">Dr. S. Raman, MD (Radiology)</option>
                  <option value="Dr. Consulting Radiologist">Dr. Consulting Radiologist</option>
                </select>
              </div>

              <div className="form-group">
                <label>Scan Charges (₹)</label>
                <div className="amount-input-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: NT SCAN Detailed Inputs (Rendered only when scanType === 'NT SCAN') */}
          {scanType === 'NT SCAN' && (
            <div className="form-section nt-scan-section">
              <h3 className="section-title nt-title">
                <Activity size={18} className="title-icon" /> NT SCAN Detailed Clinical Findings & Biometry
              </h3>

              {/* LMP & Gestational Age Sub-block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">LMP & Clinical Gestational Age</h4>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label>L.M.P Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={ntLmpDate}
                      onChange={(e) => setNtLmpDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>E.D.D as per L.M.P</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. 19-02-2027"
                      value={ntEddLmp}
                      onChange={(e) => setNtEddLmp(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gestational Age (as per LMP)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. 12 weeks 3 days"
                      value={ntGestationalAgeLmp}
                      onChange={(e) => setNtGestationalAgeLmp(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Placenta Position</label>
                    <select 
                      className="form-control"
                      value={ntPlacenta}
                      onChange={(e) => setNtPlacenta(e.target.value)}
                    >
                      <option value="Anterior">Anterior</option>
                      <option value="Posterior">Posterior</option>
                      <option value="Fundal">Fundal</option>
                      <option value="Low-Lying">Low-Lying</option>
                      <option value="Lateral Right">Lateral Right</option>
                      <option value="Lateral Left">Lateral Left</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fetal Biometry Grid Block */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Biometry Measurements</h4>
                <div className="biometry-table-wrapper">
                  <table className="biometry-input-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Measurement (cm)</th>
                        <th>Corresponding Weeks</th>
                        <th>Corresponding Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>CRL (Crown-Rump Length)</strong></td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="e.g. 5.8"
                            value={crlCm} onChange={(e) => setCrlCm(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="wks"
                            value={crlWeeks} onChange={(e) => setCrlWeeks(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="days"
                            value={crlDays} onChange={(e) => setCrlDays(e.target.value)} 
                          />
                        </td>
                      </tr>

                      <tr>
                        <td><strong>BPD (Biparietal Diameter)</strong></td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="e.g. 2.1"
                            value={bpdCm} onChange={(e) => setBpdCm(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="wks"
                            value={bpdWeeks} onChange={(e) => setBpdWeeks(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="days"
                            value={bpdDays} onChange={(e) => setBpdDays(e.target.value)} 
                          />
                        </td>
                      </tr>

                      <tr>
                        <td><strong>HC (Head Circumference)</strong></td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="e.g. 7.6"
                            value={hcCm} onChange={(e) => setHcCm(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="wks"
                            value={hcWeeks} onChange={(e) => setHcWeeks(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="days"
                            value={hcDays} onChange={(e) => setHcDays(e.target.value)} 
                          />
                        </td>
                      </tr>

                      <tr>
                        <td><strong>FL (Femur Length)</strong></td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="e.g. 0.9"
                            value={flCm} onChange={(e) => setFlCm(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="wks"
                            value={flWeeks} onChange={(e) => setFlWeeks(e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" className="form-control" placeholder="days"
                            value={flDays} onChange={(e) => setFlDays(e.target.value)} 
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NT & Nasal Bone Markers Card */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Aneuploidy Screening Markers</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Nuchal Translucency (NT) <span className="unit-label">(mm)</span></label>
                    <input 
                      type="text" 
                      className="form-control nt-highlight-input" 
                      placeholder="e.g. 1.2 mm"
                      value={ntValueMm}
                      onChange={(e) => setNtValueMm(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nasal Bone Visualized <span className="unit-label">(mm)</span></label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 2.1 mm"
                      value={nasalBoneMm}
                      onChange={(e) => setNasalBoneMm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Fetal Cardiac & Doppler Markers */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Fetal Cardiac & Anatomical Evaluation</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Fetal Heart Rate (FHR)</label>
                    <div className="input-suffix-wrapper">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 156"
                        value={fhrBpm}
                        onChange={(e) => setFhrBpm(e.target.value)}
                      />
                      <span className="input-suffix">bpm regular rhythm</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tricuspid Regurgitation</label>
                    <select 
                      className="form-control"
                      value={tricuspidRegurgitation}
                      onChange={(e) => setTricuspidRegurgitation(e.target.value)}
                    >
                      <option value="No tricuspid regurgitation">No tricuspid regurgitation</option>
                      <option value="Tricuspid regurgitation present">Tricuspid regurgitation present</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ductus Venosus Flow</label>
                    <select 
                      className="form-control"
                      value={ductusVenosusFlow}
                      onChange={(e) => setDuctusVenosusFlow(e.target.value)}
                    >
                      <option value="Appears Normal">Ductus venosus flow appears normal</option>
                      <option value="Abnormal / Reversed A-Wave">Abnormal / Reversed A-Wave</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fetal Skull & Spine</label>
                    <select 
                      className="form-control"
                      value={fetalSkullSpine}
                      onChange={(e) => setFetalSkullSpine(e.target.value)}
                    >
                      <option value="Appear Normal Grossly">Fetal skull and spine appear normal grossly</option>
                      <option value="Requires Followup">Requires Followup</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Maternal Uterine Doppler */}
              <div className="nt-block-card">
                <h4 className="nt-block-title">Maternal Uterine Artery Doppler</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Right Uterine Artery PI</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 1.4"
                      value={rightUterinePi}
                      onChange={(e) => setRightUterinePi(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Left Uterine Artery PI</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 1.5"
                      value={leftUterinePi}
                      onChange={(e) => setLeftUterinePi(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Impression & EDD as per USG */}
              <div className="nt-block-card impression-card">
                <h4 className="nt-block-title">USG Impression & Follow-up Recommendation</h4>
                
                <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>USG Gestational Age (Weeks)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 12"
                      value={usgWeeks}
                      onChange={(e) => setUsgWeeks(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>USG Gestational Age (Days)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 4"
                      value={usgDays}
                      onChange={(e) => setUsgDays(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>E.D.D as per USG</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 21-02-2027"
                      value={ntEddUsg}
                      onChange={(e) => setNtEddUsg(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Suggested ANOMALY Scan between (Weeks)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 18 - 22"
                      value={suggestedAnomalyWeeks}
                      onChange={(e) => setSuggestedAnomalyWeeks(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Section 4: Upload Scan Image / Attachment */}
          <div className="form-section">
            <h3 className="section-title">
              <Image size={18} className="title-icon" /> Upload Scan Image / Digital Medical File
            </h3>

            <div className="scan-image-upload-box">
              {!scanImagePreview ? (
                <div 
                  className="file-dropzone-large"
                  onClick={() => document.getElementById('page-scan-file-input')?.click()}
                >
                  <Upload size={36} color="#0284c7" className="dropzone-icon" />
                  <h4>Click here or drag & drop to attach USG Scan Image / DICOM / PDF File</h4>
                  <p>Supports PNG, JPG, DICOM, and PDF scan images for digital archiving & printing</p>
                  <input 
                    type="file" 
                    id="page-scan-file-input" 
                    accept="image/*,.pdf,.dcm"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="scan-image-preview-card">
                  <div className="preview-image-wrapper">
                    <img src={scanImagePreview} alt="Scan Upload Preview" className="scan-preview-img" />
                  </div>
                  <div className="preview-info-side">
                    <div className="file-name-heading">
                      <FileText size={18} color="#0284c7" />
                      <strong>{fileName || 'Attached_Scan_Image.png'}</strong>
                    </div>
                    <span className="file-status-badge"><CheckCircle size={14} /> Image Attached & Saved</span>
                    <div className="preview-actions">
                      <button 
                        type="button" 
                        className="btn-change-img"
                        onClick={() => document.getElementById('page-scan-file-input')?.click()}
                      >
                        Change Image
                      </button>
                      <button 
                        type="button" 
                        className="btn-remove-img"
                        onClick={removeImage}
                      >
                        <Trash2 size={14} /> Remove Image
                      </button>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    id="page-scan-file-input" 
                    accept="image/*,.pdf,.dcm"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions-bar">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/scan')}
            >
              Cancel
            </button>

            <button 
              type="button" 
              className="btn-save-print"
              onClick={handleSaveAndPrint}
            >
              <Printer size={18} /> Save & Print Report
            </button>

            <button 
              type="submit" 
              className="btn-save-report"
            >
              <CheckCircle size={18} /> Save Scan Report
            </button>
          </div>

        </form>
      </div>

      {/* --- PRINTABLE SCAN REPORT MODAL --- */}
      {showPrintModal && savedScanForPrint && (
        <div className="modal-overlay printable-scan-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
          <div className="card printable-scan-modal-card" style={{ width: '750px', padding: '32px', background: 'white', position: 'relative', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '20px' }}>
              {/* <div>
                <h2 style={{ margin: 0, color: '#0284c7', fontSize: '22px', fontWeight: 800 }}>SHRI JANANI HOSPITAL</h2>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>DEPARTMENT OF RADIOLOGY & ULTRASOUND IMAGING</span>
              </div> */}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowPrintModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div><strong>Scan ID:</strong> {savedScanForPrint.id}</div>
              <div><strong>Date:</strong> {savedScanForPrint.date}</div>
              <div><strong>Patient Name:</strong> {savedScanForPrint.patientName}</div>
              <div><strong>Patient UHID:</strong> {savedScanForPrint.uhid}</div>
              <div><strong>Scan Modality:</strong> {savedScanForPrint.scanType}</div>
              <div><strong>Radiologist:</strong> {savedScanForPrint.radiologist || radiologist}</div>
            </div>

            {/* Scan Image Preview in Print Slip */}
            {scanImagePreview && (
              <div style={{ textAlign: 'center', marginBottom: '20px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', background: '#f0f9ff' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#0369a1', marginBottom: '8px' }}>ATTACHED ULTRASOUND SCAN IMAGE</strong>
                <img src={scanImagePreview} alt="Scan Image" style={{ maxHeight: '250px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              </div>
            )}

            <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginBottom: '24px', background: 'white' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} /> RADIOLOGICAL IMPRESSION & DETAILED FINDINGS
              </h4>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-line', fontFamily: 'monospace, sans-serif' }}>
                {savedScanForPrint.findings}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Report Verified & Signed by <strong>{savedScanForPrint.radiologist || radiologist}</strong>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-cancel" onClick={() => { setShowPrintModal(false); navigate('/scan'); }}>
                  Done & Return to Scans
                </button>
                <button 
                  className="btn-save-print" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} 
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

export default UploadScanReportPage;
