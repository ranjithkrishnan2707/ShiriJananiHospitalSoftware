import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import { Upload, Printer, X, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import './OpdRegistration.css';

export interface OpdRecord {
  uhid: string;
  patientId: string;
  rchId: string;
  aadharNumber?: string;
  date: string;
  name: string;
  age: string;
  gender: string;
  doc: string;
  phone: string;
  address: string;
  city: string;
  session: string;
  height?: string;
  weight?: string;
  bmi?: string;
  bp?: string;
  temp?: string;
  pulse?: string;
  spo2?: string;
  bloodGroup?: string;
  complaints?: string;
}

const getTodayStr = () => new Date().toISOString().split('T')[0];

const INITIAL_OPD_RECORDS: OpdRecord[] = [
  { uhid: '3490', patientId: '1210', rchId: 'RCH-001', aadharNumber: '9876 5432 1098', date: getTodayStr(), name: 'JAYA SUDHA W/O RAMESH', age: '29 Yrs', gender: 'Female', doc: 'Dr.Sri Janani', phone: '9876543210', address: '12 Main St', city: 'Chennai', session: 'morning', bp: '120/80', temp: '98.6', pulse: '72', spo2: '99', complaints: 'Routine ANC checkup' },
  { uhid: '3491', patientId: '1211', rchId: 'RCH-002', aadharNumber: '8765 4321 0987', date: getTodayStr(), name: 'DEEPIKA W/O KANAN', age: '26 Yrs', gender: 'Female', doc: 'Dr.Sri Janani', phone: '', address: '45 Cross Rd', city: 'Chennai', session: 'morning', bp: '110/70', temp: '98.4', pulse: '76', spo2: '98', complaints: 'Nausea & fever' },
  { uhid: '3492', patientId: '1212', rchId: 'RCH-003', aadharNumber: '7654 3210 9876', date: getTodayStr(), name: 'MUNESHWARI W/O SEKAR', age: '21 Yrs', gender: 'Female', doc: 'Dr.Sri Janani', phone: '9876543212', address: '8 Gandhi St', city: 'Chennai', session: 'morning', bp: '115/75', temp: '98.6', pulse: '74', spo2: '99', complaints: 'Headache' },
  { uhid: '3493', patientId: '1213', rchId: 'RCH-004', aadharNumber: '6543 2109 8765', date: getTodayStr(), name: 'KALAIVANI W/O MANI', age: '30 Yrs', gender: 'Female', doc: 'Dr.Sri Janani', phone: '9876543213', address: '99 North Ave', city: 'Chennai', session: 'evening', bp: '122/82', temp: '99.0', pulse: '80', spo2: '97', complaints: 'Back ache' },
  { uhid: '3494', patientId: '1214', rchId: 'RCH-005', aadharNumber: '5432 1098 7654', date: getTodayStr(), name: 'KEERTHANA W/O SURYA', age: '27 Yrs', gender: 'Female', doc: 'Dr.Sri Janani', phone: '9876543214', address: '14 Park St', city: 'Chennai', session: 'evening', bp: '118/78', temp: '98.6', pulse: '72', spo2: '99', complaints: 'General weakness' },
];

const OpdRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { patients, addOrUpdatePatient, deletePatient, doctors } = useHospital();

  const [isNewPatient, setIsNewPatient] = useState(false);
  const [opdList, setOpdList] = useState<OpdRecord[]>(INITIAL_OPD_RECORDS);
  const [selectedRecordUhid, setSelectedRecordUhid] = useState<string>('3490');

  // Form State
  const [uhid, setUhid] = useState('3498');
  const [session, setSession] = useState('morning');
  const [patientId, setPatientId] = useState('1217');
  const [rchId, setRchId] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('mrs');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [doctorName, setDoctorName] = useState('Dr.Sri Janani');

  // Vitals & History State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [hemoglobin, setHemoglobin] = useState('');
  const [bp, setBp] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pulse, setPulse] = useState('');
  const [spo2, setSpo2] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [complaints, setComplaints] = useState('');

  // Table Date Filter State
  const [fromDate, setFromDate] = useState(getTodayStr());
  const [toDate, setToDate] = useState(getTodayStr());
  const [filteredOpdList, setFilteredOpdList] = useState<OpdRecord[]>(INITIAL_OPD_RECORDS);

  // Patient Name Dropdown State
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const nameDropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['Blood_Report_3490.pdf', 'Scan_Report_3490.png']);

  // Collect previous patient records for suggestions dropdown
  const previousPatients = useMemo(() => {
    const map = new Map<string, any>();
    patients.forEach(p => {
      if (p.name) {
        map.set(p.name.toLowerCase().trim(), {
          uhid: p.uhid,
          patientId: p.patientId,
          rchId: '',
          aadharNumber: p.aadharNumber || '',
          name: p.name,
          age: p.age,
          gender: p.sex,
          phone: p.phone,
          doc: p.preferredDoctor,
          address: '12 Main St',
          city: 'Chennai',
          bp: p.bloodPressure,
          pulse: p.pulseRate,
          weight: p.weight,
        });
      }
    });
    opdList.forEach(o => {
      if (o.name) {
        map.set(o.name.toLowerCase().trim(), {
          uhid: o.uhid,
          patientId: o.patientId,
          rchId: o.rchId,
          aadharNumber: o.aadharNumber || '',
          name: o.name,
          age: o.age,
          gender: o.gender,
          phone: o.phone,
          doc: o.doc,
          address: o.address,
          city: o.city,
          bp: o.bp,
          temp: o.temp,
          pulse: o.pulse,
          spo2: o.spo2,
          complaints: o.complaints
        });
      }
    });
    return Array.from(map.values());
  }, [patients, opdList]);

  const filteredPreviousPatients = useMemo(() => {
    if (!patientName.trim()) return previousPatients;
    const query = patientName.toLowerCase().trim();
    return previousPatients.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.uhid && p.uhid.toLowerCase().includes(query)) ||
      (p.patientId && p.patientId.toLowerCase().includes(query)) ||
      (p.rchId && p.rchId.toLowerCase().includes(query)) ||
      (p.aadharNumber && p.aadharNumber.includes(query)) ||
      (p.phone && p.phone.includes(query))
    );
  }, [previousPatients, patientName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(event.target as Node)) {
        setShowNameDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search buttons
  const handleSearchPatientId = () => {
    const found = patients.find(p => p.patientId === patientId) || opdList.find(o => o.patientId === patientId);
    if (found) {
      populateFormFromRecord(found);
      alert(`Patient found: ${found.name}`);
    } else {
      alert(`No patient found with ID: ${patientId}`);
    }
  };

  const handleSearchRchId = () => {
    const found = opdList.find(o => o.rchId.toLowerCase() === rchId.toLowerCase());
    if (found) {
      populateFormFromRecord(found);
      alert(`Patient found: ${found.name}`);
    } else {
      alert(`No patient found with RCH ID: ${rchId}`);
    }
  };

  const handleSearchAadhar = () => {
    const cleanTerm = aadharNumber.replace(/\s+/g, '').toLowerCase();
    if (!cleanTerm) {
      alert('Please enter an Aadhar Number to search.');
      return;
    }
    const found = patients.find(p => p.aadharNumber && p.aadharNumber.replace(/\s+/g, '').toLowerCase().includes(cleanTerm)) ||
      opdList.find(o => o.aadharNumber && o.aadharNumber.replace(/\s+/g, '').toLowerCase().includes(cleanTerm));
    if (found) {
      populateFormFromRecord(found);
      alert(`Patient found: ${found.name}`);
    } else {
      alert(`No patient found with Aadhar Number: ${aadharNumber}`);
    }
  };

  const handleSearchName = () => {
    const term = patientName.toLowerCase();
    const found = patients.find(p => p.name.toLowerCase().includes(term)) || opdList.find(o => o.name.toLowerCase().includes(term));
    if (found) {
      populateFormFromRecord(found);
      alert(`Found patient record for ${found.name}`);
    } else {
      alert(`No existing patient matching name "${patientName}"`);
    }
  };

  const handleSearchContact = () => {
    const term = contact1 || contact2;
    const found = patients.find(p => p.phone.includes(term)) || opdList.find(o => o.phone.includes(term));
    if (found) {
      populateFormFromRecord(found);
      alert(`Found record for ${found.name} (Ph: ${found.phone})`);
    } else {
      alert(`No patient found with phone number ${term}`);
    }
  };

  const populateFormFromRecord = (rec: any) => {
    setUhid(rec.uhid || rec.patientUhid || '3499');
    setPatientId(rec.patientId || '1218');
    setRchId(rec.rchId || '');
    setAadharNumber(rec.aadharNumber || rec.aadharNo || '');
    setPatientName(rec.name || rec.patientName || '');
    setAge(rec.age || '');
    setGender(rec.gender?.toLowerCase() || rec.sex?.toLowerCase() || 'female');
    setAddress(rec.address || '');
    setCity(rec.city || '');
    setContact1(rec.phone || rec.contact1 || '');
    setDoctorName(rec.doc || rec.preferredDoctor || 'Dr.Sri Janani');
    setBp(rec.bp || rec.bloodPressure || '120/80');
    setTemperature(rec.temp || '98.6');
    setPulse(rec.pulse || rec.pulseRate || '72');
    setSpo2(rec.spo2 || '99');
    setComplaints(rec.complaints || '');
  };

  // Filter Table
  const handleFilterTable = () => {
    // Filter records matching fromDate & toDate or return all if blank
    if (!fromDate && !toDate) {
      setFilteredOpdList(opdList);
    } else {
      const filtered = opdList.filter(rec => {
        if (fromDate && rec.date < fromDate) return false;
        if (toDate && rec.date > toDate) return false;
        return true;
      });
      setFilteredOpdList(filtered);
    }
  };

  // Action Buttons
  const handleSave = () => {
    if (!patientName.trim()) {
      alert('Please enter Patient Name before saving.');
      return;
    }

    const formattedName = `${titlePrefix.toUpperCase()} ${patientName.toUpperCase()}`;
    const newRecord: OpdRecord = {
      uhid: uhid || `OP-${Date.now().toString().slice(-4)}`,
      patientId: patientId || `PT-${Date.now().toString().slice(-3)}`,
      rchId: rchId || 'RCH-NEW',
      aadharNumber: aadharNumber || '',
      date: new Date().toISOString().split('T')[0],
      name: formattedName,
      age: age ? `${age} Yrs` : '25 Yrs',
      gender: gender === 'male' ? 'Male' : 'Female',
      doc: doctorName,
      phone: contact1,
      address,
      city,
      session,
      height,
      weight,
      bmi,
      bp,
      temp: temperature,
      pulse,
      spo2,
      bloodGroup,
      complaints
    };

    // Update list
    const updatedList = [newRecord, ...opdList.filter(o => o.uhid !== newRecord.uhid)];
    setOpdList(updatedList);
    setFilteredOpdList(updatedList);
    setSelectedRecordUhid(newRecord.uhid);

    // Save to context
    addOrUpdatePatient({
      uhid: newRecord.uhid,
      patientId: newRecord.patientId,
      name: formattedName,
      age: age || '25',
      sex: newRecord.gender,
      weight: weight || '60',
      pulseRate: pulse || '72',
      bloodPressure: bp || '120/80',
      phone: contact1 || '9876543210',
      preferredDoctor: doctorName,
      aadharNumber: aadharNumber,
      history: []
    });

    alert(`OP Registration Saved Successfully for ${formattedName}!`);
  };

  const handleEdit = () => {
    const target = opdList.find(o => o.uhid === selectedRecordUhid);
    if (target) {
      populateFormFromRecord(target);
      alert(`Loaded record ${target.uhid} (${target.name}) for editing.`);
    } else {
      alert('Please select a patient row from the right table to edit.');
    }
  };

  const handleDelete = () => {
    const target = opdList.find(o => o.uhid === selectedRecordUhid);
    if (!target) {
      alert('Please select a patient row to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete OP Registration record for ${target.name} (UHID: ${target.uhid})?`)) {
      const updated = opdList.filter(o => o.uhid !== target.uhid);
      setOpdList(updated);
      setFilteredOpdList(updated);
      deletePatient(target.uhid);
      handleRefresh();
      alert('OP Record deleted successfully.');
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    setUhid((Math.floor(Math.random() * 9000) + 1000).toString());
    setPatientId((Math.floor(Math.random() * 9000) + 1000).toString());
    setRchId('');
    setAadharNumber('');
    setPatientName('');
    setAge('');
    setAddress('');
    setCity('');
    setContact1('');
    setContact2('');
    setHeight('');
    setWeight('');
    setBmi('');
    setHemoglobin('');
    setBp('');
    setTemperature('');
    setPulse('');
    setSpo2('');
    setComplaints('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setUploadedFiles(prev => [...prev, fileName]);
      alert(`File "${fileName}" attached successfully!`);
    }
  };

  const activeRecord = opdList.find(o => o.uhid === selectedRecordUhid) || opdList[0];

  return (
    <div className="opd-container page-transition">
      <div className="opd-header">
        <h2>OP REGISTRATION</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <input type="checkbox" checked={isNewPatient} onChange={(e) => setIsNewPatient(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            New Patient Detailed Assessment
          </label>
          <span className="opd-id">OPUHID: {uhid}</span>
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
      </div>

      <div className="opd-main-content">
        {/* Left Form Area */}
        <div className="card opd-form-card">
          <div className="form-group">
            <label>Patient UHID</label>
            <div className="input-container">
              <input type="text" className="form-control" value={uhid} onChange={(e) => setUhid(e.target.value)} style={{ width: '40%' }} />
              <label style={{ width: 'auto', margin: '8px 8px 0' }}>Session</label>
              <select className="form-control" value={session} onChange={(e) => setSession(e.target.value)}>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Patient ID</label>
            <div className="input-container">
              <input type="text" className="form-control" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
              <button className="search-btn" type="button" onClick={handleSearchPatientId}>Search</button>
            </div>
          </div>

          <div className="form-group">
            <label>RCH ID</label>
            <div className="input-container">
              <input type="text" className="form-control" placeholder="Enter RCH ID" value={rchId} onChange={(e) => setRchId(e.target.value)} />
              <button className="search-btn" type="button" onClick={handleSearchRchId}>Search</button>
            </div>
          </div>

          <div className="form-group">
            <label>Aadhar No</label>
            <div className="input-container">
              <input
                type="text"
                className="form-control"
                placeholder="Enter 12-digit Aadhar No"
                maxLength={14}
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />
              <button className="search-btn" type="button" onClick={handleSearchAadhar}>Search</button>
            </div>
          </div>

          <div className="form-group">
            <label>Patient Name</label>
            <div className="input-container">
              <select className="form-control" style={{ width: '30%' }} value={titlePrefix} onChange={(e) => setTitlePrefix(e.target.value)}>
                <option value="mr">Mr.</option>
                <option value="ms">Ms.</option>
                <option value="mrs">Mrs.</option>
              </select>
              <div style={{ flex: 1, position: 'relative' }} ref={nameDropdownRef}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Patient Name"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    setShowNameDropdown(true);
                  }}
                  onFocus={() => setShowNameDropdown(true)}
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
                          populateFormFromRecord(p);
                          setShowNameDropdown(false);
                        }}
                        onClick={() => {
                          populateFormFromRecord(p);
                          setShowNameDropdown(false);
                        }}
                      >
                        <div className="patient-item-name">{p.name}</div>
                        <div className="patient-item-details">
                          {p.uhid && <span className="badge-uhid">UHID: {p.uhid}</span>}
                          {p.patientId && <span className="badge-id">ID: {p.patientId}</span>}
                          {p.aadharNumber && <span className="badge-id">Aadhar: {p.aadharNumber}</span>}
                          {p.phone && <span>Ph: {p.phone}</span>}
                          {p.age && <span>Age: {p.age}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="search-btn" type="button" onClick={handleSearchName}>Search</button>
            </div>
          </div>

          <div className="form-group">
            <label>Age</label>
            <div className="input-container">
              <input type="text" className="form-control" placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} />
              <label style={{ width: 'auto', margin: '8px 8px 0' }}>Gender</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <div className="input-container">
              <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address..."></textarea>
            </div>
          </div>

          <div className="form-group">
            <label>City</label>
            <div className="input-container">
              <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City / Location" />
            </div>
          </div>

          <div className="form-group">
            <label>Contact</label>
            <div className="input-container">
              <input type="text" className="form-control" placeholder="Primary Mobile" value={contact1} onChange={(e) => setContact1(e.target.value)} />
              <input type="text" className="form-control" placeholder="Secondary Phone" value={contact2} onChange={(e) => setContact2(e.target.value)} />
              <button className="search-btn" type="button" onClick={handleSearchContact}>Search</button>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label>Doctor Name</label>
            <div className="input-container">
              <select className="form-control" value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.dname}>{doc.dname}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Table Area */}
        <div className="card opd-table-card">
          <div className="table-filters">
            <div className="filter-group">
              <label>From</label>
              <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>To</label>
              <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <button className="btn-view" type="button" onClick={handleFilterTable}>View</button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>OPUHID</th>
                  <th>RCH ID</th>
                  <th>Aadhar No</th>
                  <th>OP Date</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Ref.Doc</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpdList.map((row) => (
                  <tr
                    key={row.uhid}
                    className={selectedRecordUhid === row.uhid ? 'active-row' : ''}
                    onClick={() => {
                      setSelectedRecordUhid(row.uhid);
                      populateFormFromRecord(row);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{row.uhid}</td>
                    <td>{row.rchId}</td>
                    <td>{row.aadharNumber || '-'}</td>
                    <td>{row.date}</td>
                    <td>{row.name}</td>
                    <td>{row.age}</td>
                    <td>{row.gender}</td>
                    <td>{row.doc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isNewPatient && (
        <div className="card section-card new-patient-section">
          <div className="np-header" style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '12px' }}>New Patient Detailed Assessment</div>

          <div className="section-header" style={{ marginBottom: '12px' }}>Personal Details</div>
          <div className="new-patient-grid">
            <div className="np-group">
              <label>Aadhar Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="12-digit Aadhar No"
                maxLength={14}
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />
            </div>
            <div className="np-group"><label>Husband/Father's Name</label><input type="text" className="form-control" /></div>
            <div className="np-group"><label>Education</label><input type="text" className="form-control" /></div>
            <div className="np-group"><label>Job</label><input type="text" className="form-control" /></div>
            <div className="np-group">
              <label>Marital Status</label>
              <select className="form-control">
                <option value="married">Married</option>
                <option value="single">Single</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Vitals Section */}
      <div className="opd-bottom-section">
        <div className="card section-card">
          <div className="section-header">Patient Physical Stats</div>
          <div className="vital-group">
            <label>Height</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="165" />
              <span className="vital-unit">Cm</span>
            </div>
          </div>
          <div className="vital-group">
            <label>Weight</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="62" />
              <span className="vital-unit">Kg</span>
            </div>
          </div>
          <div className="vital-group">
            <label>BMI</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={bmi} onChange={(e) => setBmi(e.target.value)} placeholder="22.7" />
              <span className="vital-unit">Kg/m²</span>
            </div>
          </div>
          <div className="vital-group">
            <label>Hemoglobin</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={hemoglobin} onChange={(e) => setHemoglobin(e.target.value)} placeholder="12.5" />
              <span className="vital-unit">g/dL</span>
            </div>
          </div>
        </div>

        <div className="card section-card">
          <div className="section-header">Vital Sign</div>
          <div className="vital-group">
            <label>BP</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" />
              <span className="vital-unit">mm/Hg</span>
            </div>
          </div>
          <div className="vital-group">
            <label>Temperature</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="98.6" />
              <span className="vital-unit">°F</span>
            </div>
          </div>
          <div className="vital-group">
            <label>Pulse</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="72" />
              <span className="vital-unit">Bpm</span>
            </div>
          </div>
          <div className="vital-group">
            <label>SPO2</label>
            <div className="vital-input-wrapper">
              <input type="text" className="form-control" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="99" />
              <span className="vital-unit">%</span>
            </div>
          </div>
          <div className="vital-group">
            <label>Blood Group</label>
            <div className="vital-input-wrapper">
              <select className="form-control" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="O+">O positive (O+)</option>
                <option value="A+">A positive (A+)</option>
                <option value="B+">B positive (B+)</option>
                <option value="AB+">AB positive (AB+)</option>
                <option value="O-">O negative (O-)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card section-card">
          <div className="section-header">Present Complaints</div>
          <textarea
            className="form-control complaints-textarea"
            value={complaints}
            onChange={(e) => setComplaints(e.target.value)}
            placeholder="Enter patient complaints & clinical observations..."
          ></textarea>
        </div>
      </div>

      {/* Action Bar */}
      <div className="opd-action-bar">
        <button className="action-btn" type="button" onClick={handleSave}>Save</button>
        <button className="action-btn" type="button" onClick={handleEdit}>Edit</button>
        <button className="action-btn" type="button" onClick={handleDelete}>Delete</button>
        <button className="action-btn btn-close" type="button" onClick={handleClose}>Close</button>
        <button className="action-btn" type="button" onClick={handleRefresh}>Refresh</button>
        <button className="action-btn" type="button" onClick={() => setShowUploadModal(true)}>Document Upload</button>
        <button className="action-btn" type="button" onClick={() => setShowPrintModal(true)}>Print Slip</button>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card" style={{ width: '500px', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={20} color="var(--color-primary)" /> Upload Patient Documents
              </h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Upload lab test reports, insurance cards, or scan images for <strong>{patientName || 'Selected Patient'}</strong> (UHID: {uhid}).
            </p>

            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '24px', textAlign: 'center', marginBottom: '16px', background: '#f8fafc' }}>
              <Upload size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Choose file or drag & drop</p>
              <input type="file" onChange={handleFileUpload} style={{ fontSize: '12px' }} />
            </div>

            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Attached Files ({uploadedFiles.length})</h4>
            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} color="#0284c7" /> {file}</span>
                  <CheckCircle size={16} color="#22c55e" />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="action-btn" onClick={() => setShowUploadModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Slip Modal */}
      {showPrintModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="card" style={{ width: '600px', padding: '32px', position: 'relative', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-primary)', paddingBottom: '12px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '22px' }}>SHRI JANANI HOSPITAL</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>OP REGISTRATION SLIP</span>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowPrintModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', marginBottom: '20px' }}>
              <div><strong>OP UHID:</strong> {activeRecord.uhid}</div>
              <div><strong>OP Date:</strong> {activeRecord.date}</div>
              <div><strong>Patient Name:</strong> {activeRecord.name}</div>
              <div><strong>Age / Sex:</strong> {activeRecord.age} / {activeRecord.gender}</div>
              <div><strong>RCH ID:</strong> {activeRecord.rchId}</div>
              <div><strong>Aadhar No:</strong> {activeRecord.aadharNumber || 'N/A'}</div>
              <div><strong>Ref. Doctor:</strong> {activeRecord.doc}</div>
              <div><strong>Contact:</strong> {activeRecord.phone}</div>
              <div><strong>Session:</strong> {activeRecord.session.toUpperCase()}</div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '6px', background: '#f8fafc', marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569' }}>VITALS SUMMARY</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '13px' }}>
                <div><strong>BP:</strong> {activeRecord.bp || '120/80'}</div>
                <div><strong>Pulse:</strong> {activeRecord.pulse || '72'} bpm</div>
                <div><strong>Temp:</strong> {activeRecord.temp || '98.6'}°F</div>
                <div><strong>SPO2:</strong> {activeRecord.spo2 || '99'}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="action-btn" onClick={() => setShowPrintModal(false)}>Close</button>
              <button className="btn-view" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => window.print()}>
                <Printer size={16} /> Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpdRegistration;
