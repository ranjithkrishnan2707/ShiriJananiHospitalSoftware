import React, { createContext, useContext, useState } from 'react';

// --- Types ---
export interface PatientHistory {
  id: string;
  date: string;
  diagnosis: string;
  prescription: string;
  labRequest: string;
  scanRequest: string;
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
}

// --- Dummy Database ---
const DUMMY_PATIENTS: Patient[] = [
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
    preferredDoctor: 'Dr. Sarah Jenkins',
    history: [
      {
        id: 'H1',
        date: '2026-06-10',
        diagnosis: 'Mild Hypertension',
        prescription: 'Amlodipine 5mg OD',
        labRequest: 'Lipid Profile',
        scanRequest: 'ECG'
      }
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
    preferredDoctor: 'Dr. Rajiv Menon',
    history: [
      {
        id: 'H2',
        date: '2026-07-01',
        diagnosis: 'Migraine',
        prescription: 'Sumatriptan 50mg PRN',
        labRequest: '',
        scanRequest: 'MRI Brain'
      }
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
  { id: '1', dname: 'SELF', contact: '', email: '', city: '' },
  { id: '2', dname: 'DR.SRI JANANI,MD.,OG.,', contact: '', email: '', city: '' },
  { id: '3', dname: 'DR.G.PRASANNA BALAJ, MD...', contact: '', email: '', city: '' },
  { id: '4', dname: 'DR.PRIYA DHARSHINI, MBBS...', contact: '', email: '', city: '' },
  { id: '5', dname: 'DR. SARANYA MBBS., DCH.', contact: '9585822...', email: '', city: '' },
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
  const [scanRequests, setScanRequests] = useState<ScanRequest[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>(INITIAL_DOCTORS);
  const [isDoctorListOpen, setIsDoctorListOpen] = useState(false);

  const openDoctorListModal = () => setIsDoctorListOpen(true);
  const closeDoctorListModal = () => setIsDoctorListOpen(false);

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
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
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
  };

  const deletePatient = (uhid: string) => {
    setPatients(prev => prev.filter(p => p.uhid !== uhid));
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
      id: Date.now().toString(),
      date,
      diagnosis,
      prescription: medicines,
      labRequest: tests,
      scanRequest: scans
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
