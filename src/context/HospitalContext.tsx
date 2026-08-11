import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export interface PatientHistory {
  id: string;
  date: string;
  time?: string;
  visitType?: string;
  doctorName?: string;
  complaints?: string;
  diagnosis: string;
  prescription: string;
  labRequest?: string;
  scanRequest?: string;
  notes?: string;
  bp?: string;
  pulse?: string;
  temp?: string;
  weight?: string;
  fee?: string;
}

export interface Patient {
  uhid: string;
  patientId: string;
  name: string;
  age: string;
  sex: string;
  weight: string;
  pulseRate: string;
  bloodPressure: string;
  phone: string;
  preferredDoctor: string;
  aadharNumber?: string;
  history: PatientHistory[];
}

export interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  uhid: string;
  phone: string;
  doctorName: string;
  medicines: string;
  diagnosis: string;
  notes: string;
  date: string;
  time: string;
  status: 'Pending' | 'Completed';
}

export interface LabRequest {
  id: string;
  patientName: string;
  uhid: string;
  tests: string;
  date: string;
  status: 'Pending' | 'Completed';
}

export interface ScanRequest {
  id: string;
  patientName: string;
  uhid: string;
  scanType: string;
  date: string;
  status: 'Pending' | 'Completed';
  reportFile?: string;
  findings?: string;
  radiologist?: string;
  amount?: number;
}

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getDaysAgoStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const INITIAL_SCAN_REQUESTS: ScanRequest[] = [
  {
    id: 'SCN-101',
    patientName: 'JAYA SUDHA W/O RAMESH',
    uhid: '3490',
    scanType: 'Obstetric Anomaly USG Scan',
    date: getTodayStr(),
    status: 'Pending',
    radiologist: 'Dr. G. Srijaya',
    amount: 2500
  },
  {
    id: 'SCN-102',
    patientName: 'DEEPIKA W/O KANAN',
    uhid: '3491',
    scanType: 'Abdomen & Pelvis USG Scan',
    date: getTodayStr(),
    status: 'Completed',
    reportFile: 'USG_Pelvis_Report_3491.pdf',
    findings: 'Single live intrauterine gestation of ~28 weeks. Normal fetal cardiac activity & liquor volume.',
    radiologist: 'Dr. G. Srijaya',
    amount: 1800
  },
  {
    id: 'SCN-103',
    patientName: 'MUNESHWARI W/O SEKAR',
    uhid: '3492',
    scanType: 'Fetal Echocardiography',
    date: getDaysAgoStr(1),
    status: 'Completed',
    reportFile: 'Fetal_Echo_Report_3492.pdf',
    findings: 'Normal 4-chamber cardiac view. No obvious congenital structural heart anomaly detected.',
    radiologist: 'Dr. G. Srijaya',
    amount: 3200
  },
  {
    id: 'SCN-104',
    patientName: 'KALAIVANI W/O MANI',
    uhid: '3493',
    scanType: 'Transvaginal Scan (TVS)',
    date: getDaysAgoStr(1),
    status: 'Pending',
    radiologist: 'Dr. G. Srijaya',
    amount: 1500
  }
];

// --- Dummy Database with 10 Multi-Visit Patient Histories ---
const DUMMY_PATIENTS: Patient[] = [
  {
    uhid: '3490',
    patientId: '1210',
    name: 'JAYA SUDHA W/O RAMESH',
    age: '29',
    sex: 'Female',
    weight: '62',
    pulseRate: '74',
    bloodPressure: '120/80',
    phone: '9876543210',
    preferredDoctor: 'DR.SRI JANANI,MD.,OG.,',
    aadharNumber: '9876 5432 1098',
    history: [
      { id: 'VIS-10', date: getTodayStr(), time: '10:30 AM', visitType: 'ANC Routine Consultation', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Routine ANC checkup at 28 weeks gestation', diagnosis: '28 Weeks Gestation — Normal Fetal Growth', prescription: 'Tab Calcium Carbonate 500mg (AF) - 30 days; Tab Iron Folic Acid (BF) - 30 days', labRequest: 'Complete Blood Count (CBC), Urine Routine', scanRequest: 'Obstetric Growth USG Scan', notes: 'Fetal movements good, weight gain adequate +1.5kg.', bp: '120/80', pulse: '74', temp: '98.6', weight: '62', fee: '500' },
      { id: 'VIS-09', date: getDaysAgoStr(15), time: '11:15 AM', visitType: 'Follow-up Checkup', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Mild lower back ache', diagnosis: '26 Weeks ANC - Lumbar Strain', prescription: 'Syp Calcium Syrup 10ml BD - 15 days; Gel Volini Topical', labRequest: '', scanRequest: '', notes: 'Advised pelvic rest and prenatal posture exercises.', bp: '118/78', pulse: '76', temp: '98.4', weight: '61', fee: '400' },
      { id: 'VIS-08', date: getDaysAgoStr(30), time: '09:45 AM', visitType: 'Anomaly USG Review', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Routine 24 weeks checkup & scan review', diagnosis: 'Targeted Anomaly Scan Normal', prescription: 'Tab Multivitamin OD - 30 days', labRequest: 'OGTT 75g Glucose Tolerance Test', scanRequest: 'Fetal Echocardiography', notes: 'Gestational diabetes screen negative. Fetal cardiac anatomy normal.', bp: '122/80', pulse: '72', temp: '98.6', weight: '60.5', fee: '600' },
      { id: 'VIS-07', date: getDaysAgoStr(60), time: '04:20 PM', visitType: 'Second Trimester Visit', doctorName: 'DR.PRIYA DHARSHINI, MBBS...', complaints: 'Fetal movement verification', diagnosis: '20 Weeks Gestation - Active Fetal Movement', prescription: 'Tab Autrin (Iron) OD - 30 days', labRequest: 'Hemoglobin (Hb)', scanRequest: 'Targeted Anomaly Scan (TIFFA)', notes: 'Quickening reported by patient. Tetanus Toxoid 2nd Dose administered.', bp: '116/76', pulse: '78', temp: '98.4', weight: '58.5', fee: '500' },
      { id: 'VIS-06', date: getDaysAgoStr(90), time: '10:00 AM', visitType: 'TT Vaccination Visit', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Vaccination visit', diagnosis: '16 Weeks Gestation - TT-1 Administered', prescription: 'Tab Folvite 5mg OD - 30 days', labRequest: 'Quadruple Marker Test', scanRequest: '', notes: 'TT Injection 0.5ml IM given on left deltoid.', bp: '120/80', pulse: '74', temp: '98.6', weight: '57', fee: '300' },
      { id: 'VIS-05', date: getDaysAgoStr(120), time: '11:45 AM', visitType: 'NT Scan Consultation', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: '12 Weeks NT Scan review', diagnosis: '12 Weeks ANC - Normal NT Thickness 1.2mm', prescription: 'Tab Pregnacare OD - 30 days', labRequest: 'Double Marker Test', scanRequest: 'NT Scan & Nasal Bone', notes: 'Low risk for chromosomal aneuploidies. Nasal bone present.', bp: '118/74', pulse: '72', temp: '98.6', weight: '55.5', fee: '700' },
      { id: 'VIS-04', date: getDaysAgoStr(150), time: '05:10 PM', visitType: 'First Trimester Visit', doctorName: 'DR.SARANYA MBBS., DCH.', complaints: 'Morning sickness & nausea', diagnosis: '8 Weeks Gestation - Emesis Gravidarum', prescription: 'Tab Doxinate OD - 10 days; Tab Folic Acid 5mg - 30 days', labRequest: 'Thyroid Stimulating Hormone (TSH)', scanRequest: 'Viability Scan', notes: 'Single live intrauterine embryo with FHR 156 bpm.', bp: '110/70', temp: '98.4', weight: '55', fee: '500' },
      { id: 'VIS-03', date: getDaysAgoStr(180), time: '10:15 AM', visitType: 'Pregnancy Confirmation', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Missed period by 10 days', diagnosis: 'Early Pregnancy Confirmed (UPT Positive)', prescription: 'Tab Folic Acid 5mg OD - 30 days', labRequest: 'Beta hCG Quantitative, Blood Grouping & Rh', scanRequest: 'Early Transvaginal Scan (TVS)', notes: 'Gestational sac visualized inside uterine cavity.', bp: '112/72', temp: '98.6', weight: '54.8', fee: '500' },
      { id: 'VIS-02', date: getDaysAgoStr(240), time: '03:30 PM', visitType: 'Pre-conceptional Counseling', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Pre-conceptional health checkup', diagnosis: 'Pre-conception Screening - Healthy', prescription: 'Tab Folvite 5mg OD - 30 days', labRequest: 'HbA1c, Rubella IgG, Thyroid Profile', scanRequest: 'Pelvic USG', notes: 'Uterus & ovaries normal. Advised pre-conceptional folic acid.', bp: '120/78', temp: '98.6', weight: '54', fee: '400' },
      { id: 'VIS-01', date: getDaysAgoStr(360), time: '11:00 AM', visitType: 'General OPD Visit', doctorName: 'DR.G.PRASANNA BALAJ, MD...', complaints: 'Mild fever & sore throat', diagnosis: 'Acute Pharyngitis', prescription: 'Tab Azithromycin 500mg OD - 3 days; Tab Paracetamol 650mg TDS - 3 days', labRequest: 'CBC Test', scanRequest: '', notes: 'Throat congestion noted. Warm saline gargle advised.', bp: '118/76', temp: '99.2', weight: '53.5', fee: '350' }
    ]
  },
  {
    uhid: '3491',
    patientId: '1211',
    name: 'DEEPIKA W/O KANAN',
    age: '26',
    sex: 'Female',
    weight: '58',
    pulseRate: '76',
    bloodPressure: '110/70',
    phone: '9876543211',
    preferredDoctor: 'DR.SRI JANANI,MD.,OG.,',
    history: [
      { id: 'D-05', date: getTodayStr(), time: '11:00 AM', visitType: 'OPD Consultation', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Nausea & feverish feeling', diagnosis: 'Viral Fever & Mild Dehydration', prescription: 'Tab Paracetamol 650mg TDS - 3 days; Syp ORS Solution', labRequest: 'Widal Test, Dengue NS1', scanRequest: 'Abdomen & Pelvis USG Scan', notes: 'Hydration advised.', bp: '110/70', pulse: '76', temp: '99.4', weight: '58', fee: '500' },
      { id: 'D-04', date: getDaysAgoStr(20), time: '02:30 PM', visitType: 'Follow-up', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Abdominal pain', diagnosis: 'Gastritis', prescription: 'Tab Pantocid 40mg OD - 10 days', labRequest: 'Serum Amylase', scanRequest: '', notes: 'Avoid spicy food.', bp: '112/72', pulse: '74', temp: '98.4', weight: '58', fee: '400' },
      { id: 'D-03', date: getDaysAgoStr(45), time: '10:15 AM', visitType: 'General Visit', doctorName: 'DR.SARANYA MBBS., DCH.', complaints: 'Headache & fatigue', diagnosis: 'Anemia Mild', prescription: 'Tab Autrin OD - 30 days', labRequest: 'Hemoglobin, Serum Ferritin', scanRequest: '', notes: 'Iron rich diet advised.', bp: '108/68', pulse: '78', temp: '98.6', weight: '57.5', fee: '350' },
      { id: 'D-02', date: getDaysAgoStr(90), time: '04:00 PM', visitType: 'Routine Checkup', doctorName: 'DR.SRI JANANI,MD.,OG.,', complaints: 'Irregular cycles', diagnosis: 'PCOD Screening', prescription: 'Tab Glycomet 500mg BD - 30 days', labRequest: 'LH, FSH, Serum Prolactin', scanRequest: 'Pelvic Ultrasound', notes: 'Polycystic ovarian morphology noted on USG.', bp: '110/70', pulse: '72', temp: '98.6', weight: '57', fee: '500' },
      { id: 'D-01', date: getDaysAgoStr(150), time: '09:30 AM', visitType: 'Initial Visit', doctorName: 'DR.PRIYA DHARSHINI, MBBS...', complaints: 'General body pain', diagnosis: 'Vitamin D Deficiency', prescription: 'Sachet Cholecalciferol 60K - Weekly once x 8 weeks', labRequest: '25-Hydroxy Vitamin D', scanRequest: '', notes: 'Sunlight exposure advised.', bp: '114/74', pulse: '70', temp: '98.6', weight: '56.5', fee: '400' }
    ]
  },
  {
    uhid: 'UHID-1001',
    patientId: 'PT-901',
    name: 'Rajesh Kumar',
    age: '45',
    sex: 'Male',
    weight: '75',
    pulseRate: '72',
    bloodPressure: '120/80',
    phone: '9876543210',
    preferredDoctor: 'DR.G.PRASANNA BALAJ, MD...',
    history: [
      { id: 'R-04', date: getTodayStr(), time: '09:15 AM', visitType: 'Cardiology Review', doctorName: 'DR.G.PRASANNA BALAJ, MD...', complaints: 'Routine BP checkup', diagnosis: 'Controlled Essential Hypertension', prescription: 'Tab Amlodipine 5mg OD - 30 days; Tab Telmisartan 40mg OD - 30 days', labRequest: 'Lipid Profile, Serum Creatinine', scanRequest: 'ECG 12 Lead', notes: 'BP well controlled at 120/80.', bp: '120/80', pulse: '72', temp: '98.6', weight: '75', fee: '500' },
      { id: 'R-03', date: getDaysAgoStr(40), time: '11:30 AM', visitType: 'Lab Followup', doctorName: 'DR.G.PRASANNA BALAJ, MD...', complaints: 'Mild dyspnea on exertion', diagnosis: 'Hyperlipidemia & Mild HTN', prescription: 'Tab Atorvastatin 10mg HS - 30 days', labRequest: 'Lipid Profile Complete', scanRequest: '2D Echocardiography', notes: 'EF 65%, no regional wall motion abnormality.', bp: '128/84', pulse: '76', temp: '98.4', weight: '76', fee: '600' },
      { id: 'R-02', date: getDaysAgoStr(90), time: '05:00 PM', visitType: 'OPD Consultation', doctorName: 'DR.G.PRASANNA BALAJ, MD...', complaints: 'Occasional chest tightness', diagnosis: 'Stage 1 Hypertension', prescription: 'Tab Amlodipine 5mg OD - 30 days', labRequest: 'Fasting Blood Sugar, TSH', scanRequest: 'Treadmill Test (TMT)', notes: 'TMT negative for inducible ischemia at 9 METS.', bp: '138/88', pulse: '80', temp: '98.6', weight: '77', fee: '500' },
      { id: 'R-01', date: getDaysAgoStr(180), time: '10:00 AM', visitType: 'Health Checkup', doctorName: 'DR.G.PRASANNA BALAJ, MD...', complaints: 'Master Health Checkup', diagnosis: 'High Borderline Blood Pressure', prescription: 'Dietary salt restriction & 30 min daily brisk walk', labRequest: 'Complete Master Health Panel', scanRequest: 'Abdominal USG', notes: 'Grade 1 Fatty Liver noted.', bp: '134/86', pulse: '78', temp: '98.6', weight: '78', fee: '1000' }
    ]
  },
  {
    uhid: 'UHID-1002',
    patientId: 'PT-902',
    name: 'Priya Sharma',
    age: '32',
    sex: 'Female',
    weight: '60',
    pulseRate: '78',
    bloodPressure: '110/75',
    phone: '8765432109',
    preferredDoctor: 'DR.PRIYA DHARSHINI, MBBS...',
    history: [
      { id: 'P-03', date: getDaysAgoStr(10), time: '03:15 PM', visitType: 'Neurology Review', doctorName: 'DR.PRIYA DHARSHINI, MBBS...', complaints: 'Throbbing right-sided headache', diagnosis: 'Acute Migraine Exacerbation', prescription: 'Tab Sumatriptan 50mg PRN; Tab Naproxen 500mg BD - 3 days', labRequest: '', scanRequest: 'MRI Brain Scan', notes: 'MRI Brain normal. Stress reduction advised.', bp: '110/75', pulse: '78', temp: '98.6', weight: '60', fee: '500' },
      { id: 'P-02', date: getDaysAgoStr(60), time: '10:45 AM', visitType: 'General Consultation', doctorName: 'DR.PRIYA DHARSHINI, MBBS...', complaints: 'Frequent tension headache', diagnosis: 'Tension Type Headache', prescription: 'Tab Amitriptyline 10mg HS - 30 days', labRequest: 'CBC, ESR', scanRequest: '', notes: 'Adequate hydration & sleep cycle emphasized.', bp: '112/74', pulse: '74', temp: '98.4', weight: '60.5', fee: '400' },
      { id: 'P-01', date: getDaysAgoStr(120), time: '11:30 AM', visitType: 'Initial Visit', doctorName: 'DR.SARANYA MBBS., DCH.', complaints: 'Cervical stiffness', diagnosis: 'Cervical Spondylosis', prescription: 'Tab Thiocholchicoside 4mg BD - 5 days; Neck isometric exercises', labRequest: '', scanRequest: 'X-Ray Cervical Spine AP/Lat', notes: 'Soft cervical collar recommended during travel.', bp: '110/70', pulse: '76', temp: '98.6', weight: '61', fee: '450' }
    ]
  }
];

export interface DoctorItem {
  id: string;
  dname: string;
  contact: string;
  email: string;
  city: string;
}

const INITIAL_DOCTORS: DoctorItem[] = [
  { id: '1', dname: 'DR.SRI JANANI,MD.,OG.,', contact: '', email: '', city: '' },
  { id: '2', dname: 'DR.G.PRASANNA BALAJ, MD...', contact: '', email: '', city: '' },
  { id: '3', dname: 'DR.PRIYA DHARSHINI, MBBS...', contact: '', email: '', city: '' },
  { id: '4', dname: 'DR. SARANYA MBBS., DCH.', contact: '9585822...', email: '', city: '' },
];

// --- Context Definition ---
interface HospitalContextType {
  patients: Patient[];
  prescriptions: Prescription[];
  labRequests: LabRequest[];
  scanRequests: ScanRequest[];
  doctors: DoctorItem[];
  isDoctorListOpen: boolean;
  
  // Actions
  addConsultation: (
    patientUhid: string, 
    diagnosis: string, 
    medicines: string, 
    tests: string, 
    scans: string,
    notes: string,
    fee: string
  ) => void;
  addOrUpdatePatient: (patient: Patient) => void;
  deletePatient: (uhid: string) => void;
  markPrescriptionComplete: (id: string) => void;
  markLabComplete: (id: string) => void;
  markScanComplete: (id: string) => void;
  addScanRequest: (scan: ScanRequest) => void;
  updateScanReport: (id: string, reportFile: string, findings: string, radiologist?: string) => void;
  addOrUpdateDoctor: (doctor: DoctorItem) => void;
  deleteDoctor: (id: string) => void;
  openDoctorListModal: () => void;
  closeDoctorListModal: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(DUMMY_PATIENTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [scanRequests, setScanRequests] = useState<ScanRequest[]>(INITIAL_SCAN_REQUESTS);
  const [doctors, setDoctors] = useState<DoctorItem[]>(INITIAL_DOCTORS);
  const [isDoctorListOpen, setIsDoctorListOpen] = useState(false);

  const openDoctorListModal = () => setIsDoctorListOpen(true);
  const closeDoctorListModal = () => setIsDoctorListOpen(false);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [patRes, docRes, scnRes, rxRes, labRes] = await Promise.allSettled([
          fetch('http://localhost:5000/api/patients').then(r => r.ok ? r.json() : null),
          fetch('http://localhost:5000/api/doctors').then(r => r.ok ? r.json() : null),
          fetch('http://localhost:5000/api/scan').then(r => r.ok ? r.json() : null),
          fetch('http://localhost:5000/api/prescriptions').then(r => r.ok ? r.json() : null),
          fetch('http://localhost:5000/api/lab').then(r => r.ok ? r.json() : null)
        ]);

        if (patRes.status === 'fulfilled' && patRes.value && patRes.value.length > 0) setPatients(patRes.value);
        if (docRes.status === 'fulfilled' && docRes.value && docRes.value.length > 0) setDoctors(docRes.value);
        if (scnRes.status === 'fulfilled' && scnRes.value && scnRes.value.length > 0) setScanRequests(scnRes.value);
        if (rxRes.status === 'fulfilled' && rxRes.value && rxRes.value.length > 0) setPrescriptions(rxRes.value);
        if (labRes.status === 'fulfilled' && labRes.value && labRes.value.length > 0) setLabRequests(labRes.value);
      } catch (err) {
        console.log('MySQL API fetch fallback:', err);
      }
    };
    fetchApiData();
  }, []);

  const addOrUpdateDoctor = (doc: DoctorItem) => {
    setDoctors(prev => {
      const idx = prev.findIndex(d => d.id === doc.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = doc;
        return updated;
      }
      return [...prev, doc];
    });

    fetch('http://localhost:5000/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    }).catch(err => console.error('MySQL Save Doctor Error:', err));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    fetch(`http://localhost:5000/api/doctors/${id}`, { method: 'DELETE' })
      .catch(err => console.error('MySQL Delete Doctor Error:', err));
  };

  const addOrUpdatePatient = (patient: Patient) => {
    setPatients(prev => {
      const idx = prev.findIndex(p => p.uhid === patient.uhid || (patient.patientId && p.patientId === patient.patientId));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...prev[idx], ...patient };
        return updated;
      }
      return [patient, ...prev];
    });

    fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    }).catch(err => console.error('MySQL Save Patient Error:', err));
  };

  const deletePatient = (uhid: string) => {
    setPatients(prev => prev.filter(p => p.uhid !== uhid));
    fetch(`http://localhost:5000/api/patients/${uhid}`, { method: 'DELETE' })
      .catch(err => console.error('MySQL Delete Patient Error:', err));
  };

  const addConsultation = (
    patientUhid: string, 
    diagnosis: string, 
    medicines: string, 
    tests: string, 
    scans: string,
    notes: string,
    _fee: string // unused in history, maybe goes to billing later
  ) => {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const patientIndex = patients.findIndex(p => p.uhid === patientUhid);
    
    if (patientIndex === -1) return;
    const patient = patients[patientIndex];

    // 1. Update Patient History
    const newHistory: PatientHistory = {
      id: `VIS-${Date.now()}`,
      date,
      time,
      visitType: 'OPD Consultation',
      doctorName: patient.preferredDoctor || 'DR.SRI JANANI,MD.,OG.,',
      complaints: diagnosis ? `Consultation for ${diagnosis}` : 'Routine OPD Checkup',
      diagnosis,
      prescription: medicines,
      labRequest: tests,
      scanRequest: scans,
      notes,
      bp: patient.bloodPressure || '120/80',
      pulse: patient.pulseRate || '74',
      temp: '98.6',
      weight: patient.weight || '60',
      fee: _fee || '500'
    };

    const updatedPatients = [...patients];
    updatedPatients[patientIndex] = {
      ...patient,
      history: [newHistory, ...patient.history]
    };
    setPatients(updatedPatients);

    // 2. Dispatch to Medical/Pharmacy
    if (medicines.trim() !== '') {
      setPrescriptions(prev => [
        {
          id: `RX-${Date.now()}`,
          patientName: patient.name,
          patientId: patient.patientId,
          uhid: patient.uhid,
          phone: patient.phone,
          doctorName: patient.preferredDoctor || 'Dr. Assigned',
          medicines,
          diagnosis,
          notes,
          date,
          time,
          status: 'Pending'
        },
        ...prev
      ]);
    }

    // 3. Dispatch to Lab
    if (tests.trim() !== '') {
      setLabRequests(prev => [
        {
          id: `LAB-${Date.now()}`,
          patientName: patient.name,
          uhid: patient.uhid,
          tests,
          date,
          status: 'Pending'
        },
        ...prev
      ]);
    }

    // 4. Dispatch to Scan
    if (scans.trim() !== '') {
      setScanRequests(prev => [
        {
          id: `SCN-${Date.now()}`,
          patientName: patient.name,
          uhid: patient.uhid,
          scanType: scans,
          date,
          status: 'Pending'
        },
        ...prev
      ]);
    }
  };

  const markPrescriptionComplete = (id: string) => {
    setPrescriptions(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status: 'Completed' as const } : p);
      
      // Also update patient history to mark as dispensed
      const targetPrescription = prev.find(p => p.id === id);
      if (targetPrescription) {
        setPatients(currentPatients => 
          currentPatients.map(patient => {
            if (patient.uhid === targetPrescription.uhid) {
              return {
                ...patient,
                history: patient.history.map(h => 
                  // If history matches the date and prescription, append (Dispensed)
                  h.date === targetPrescription.date && h.prescription === targetPrescription.medicines
                    ? { ...h, prescription: `${h.prescription} (Dispensed)` }
                    : h
                )
              };
            }
            return patient;
          })
        );
      }
      return updated;
    });
  };

  const markLabComplete = (id: string) => {
    setLabRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'Completed' } : l));
  };

  const markScanComplete = (id: string) => {
    setScanRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
  };

  const addScanRequest = (scan: ScanRequest) => {
    setScanRequests(prev => [scan, ...prev]);
    fetch('http://localhost:5000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scan)
    }).catch(err => console.error('MySQL Add Scan Error:', err));
  };

  const updateScanReport = (id: string, reportFile: string, findings: string, radiologist?: string) => {
    setScanRequests(prev => prev.map(s => 
      s.id === id 
        ? { 
            ...s, 
            status: 'Completed', 
            reportFile: reportFile || s.reportFile || 'Scan_Report.pdf', 
            findings: findings || s.findings || '', 
            radiologist: radiologist || s.radiologist || 'Dr. G. Srijaya' 
          } 
        : s
    ));
    fetch(`http://localhost:5000/api/scan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportFile, findings, radiologist })
    }).catch(err => console.error('MySQL Update Scan Report Error:', err));
  };

  return (
    <HospitalContext.Provider value={{
      patients,
      prescriptions,
      labRequests,
      scanRequests,
      doctors,
      isDoctorListOpen,
      addConsultation,
      addOrUpdatePatient,
      deletePatient,
      markPrescriptionComplete,
      markLabComplete,
      markScanComplete,
      addScanRequest,
      updateScanReport,
      addOrUpdateDoctor,
      deleteDoctor,
      openDoctorListModal,
      closeDoctorListModal
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
