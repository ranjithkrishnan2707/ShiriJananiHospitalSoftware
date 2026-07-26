import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Database, 
  FileEdit, 
  Search as SearchIcon, 
  LogOut, 
  UserPlus, 
  TestTube2, 
  ClipboardCheck, 
  Printer, 
  Receipt,
  Plus,
  Eye,
  X,
  FileSpreadsheet,
  RefreshCw,
  Edit,
  Trash2,
  Upload,
  Trash,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserCheck,
  HardDriveDownload,
  HardDriveUpload,
  Sliders,
  Settings as SettingsIcon,
  ChevronDown,
  FolderTree,
  TestTube,
  Stethoscope,
  Tag
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './LabDashboard.css';

interface MasterTest {
  id: string;
  name: string;
  category: string;
  price: number;
  normalRange: string;
  unit: string;
  ttype?: string;
  defaultSpecimen?: string;
}

interface TestResultItem {
  testId: string;
  testName: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
  specimen?: string;
  remarks?: string;
}

interface LabEntry {
  labId: string;
  uhid: string;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  refDoctor: string;
  date: string;
  time: string;
  tests: MasterTest[];
  results: TestResultItem[];
  totalAmount: number;
  discount: number;
  paidAmount: number;
  paymentMode: string;
  status: 'Sample Collected' | 'Results Pending' | 'Completed';
}

interface PatientRecord {
  pid: string;
  pname: string;
  address: string;
  city: string;
  contact1: string;
  contact2: string;
  gender: string;
  age: string;
  email: string;
  photoPath?: string;
}

interface DoctorRecord {
  id: string;
  name: string;
  qualification: string;
  hospital: string;
  phone: string;
}

interface TestGroupRecord {
  id: string;
  name: string;
  onlyBill: boolean;
  totalCost: number;
  remarks: string;
}

interface TestNameEntryRecord {
  id: string;
  groupName: string;
  orderNo: number;
  testName: string;
  subHead: number;
  specimen: string;
  unit: string;
  maleMin: string;
  maleMax: string;
  femaleMin: string;
  femaleMax: string;
  maleNormal: string;
  femaleNormal: string;
  refValue: string;
  cost: number;
  method: string;
  remarks: string;
}

const DEFAULT_PATIENTS_DATA: PatientRecord[] = [
  {
    pid: '1',
    pname: 'Rajesh Kumar',
    address: '12 Gandhi Road',
    city: 'Gobichettipalayam',
    contact1: '9876543210',
    contact2: '',
    gender: 'Male',
    age: '45',
    email: 'rajesh.kumar@gmail.com',
    photoPath: 'E:\\LabSoft\\Photo\\sample.jpg'
  },
  {
    pid: '2',
    pname: 'Priya Sharma',
    address: '45 Main Street',
    city: 'Erode',
    contact1: '8765432109',
    contact2: '',
    gender: 'Female',
    age: '32',
    email: 'priya.sharma@yahoo.com',
    photoPath: 'E:\\LabSoft\\Photo\\priya.jpg'
  },
  {
    pid: '3',
    pname: 'Karthik Subramanian',
    address: '88 Hospital Road',
    city: 'Gobichettipalayam',
    contact1: '9443322110',
    contact2: '04285-224411',
    gender: 'Male',
    age: '28',
    email: 'karthik.sub@gmail.com',
    photoPath: 'E:\\LabSoft\\Photo\\karthik.jpg'
  }
];

const DEFAULT_MASTER_TESTS: MasterTest[] = [
  { id: 'T01', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 450, normalRange: '4.5 - 11.0', unit: '10^3/µL', ttype: 'Package', defaultSpecimen: 'Whole Blood (EDTA)' },
  { id: 'T02', name: 'Hemoglobin (Hb)', category: 'Hematology', price: 150, normalRange: '12.0 - 16.0', unit: 'g/dL', ttype: 'Single', defaultSpecimen: 'Whole Blood' },
  { id: 'T03', name: 'Fasting Blood Sugar (FBS)', category: 'Biochemistry', price: 120, normalRange: '70 - 100', unit: 'mg/dL', ttype: 'Single', defaultSpecimen: 'Plasma (Fluoride)' },
  { id: 'T04', name: 'Post Prandial Blood Sugar (PPBS)', category: 'Biochemistry', price: 120, normalRange: '100 - 140', unit: 'mg/dL', ttype: 'Single', defaultSpecimen: 'Plasma (Fluoride)' },
  { id: 'T05', name: 'Lipid Profile Complete', category: 'Biochemistry', price: 850, normalRange: 'Desirable <200', unit: 'mg/dL', ttype: 'Package', defaultSpecimen: 'Serum' },
  { id: 'T06', name: 'Thyroid Stimulating Hormone (TSH)', category: 'Endocrinology', price: 400, normalRange: '0.4 - 4.2', unit: 'µIU/mL', ttype: 'Single', defaultSpecimen: 'Serum' },
  { id: 'T07', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 750, normalRange: 'Varies', unit: 'U/L', ttype: 'Package', defaultSpecimen: 'Serum' },
  { id: 'T08', name: 'Renal Function Test (RFT / KFT)', category: 'Biochemistry', price: 650, normalRange: 'Varies', unit: 'mg/dL', ttype: 'Package', defaultSpecimen: 'Serum' },
  { id: 'T09', name: 'Urine Routine Examination', category: 'Microbiology', price: 200, normalRange: 'Normal', unit: '-', ttype: 'Routine', defaultSpecimen: 'Mid-stream Urine' },
  { id: 'T10', name: 'HbA1c (Glycated Hemoglobin)', category: 'Biochemistry', price: 550, normalRange: '4.0 - 5.6', unit: '%', ttype: 'Single', defaultSpecimen: 'Whole Blood' }
];

const DEFAULT_DOCTORS: DoctorRecord[] = [
  { id: 'DOC-1', name: 'Dr. Sarah Jenkins', qualification: 'M.D. (Internal Med)', hospital: 'Shri Janani Hospital', phone: '9876543210' },
  { id: 'DOC-2', name: 'Dr. Rajiv Menon', qualification: 'M.B.B.S, D.N.B', hospital: 'City Clinic', phone: '9876512345' },
  { id: 'DOC-3', name: 'Dr. Aris Thorne', qualification: 'M.D. (Pathology)', hospital: 'Apex Diagnostics', phone: '9443311220' }
];

const DEFAULT_GROUP_RECORDS: TestGroupRecord[] = [
  { id: '70', name: 'HAEMATOLOGY', onlyBill: false, totalCost: 0.00, remarks: '' },
  { id: '71', name: 'BIO CHEMISTRY', onlyBill: false, totalCost: 0.00, remarks: '' },
  { id: '72', name: 'COMPLETE BLOOD COUNT (CBC)', onlyBill: true, totalCost: 260.00, remarks: '' },
  { id: '73', name: 'ESR', onlyBill: true, totalCost: 100.00, remarks: '' },
  { id: '74', name: 'LIPID PROFILE.', onlyBill: true, totalCost: 500.00, remarks: '' },
  { id: '75', name: 'LIVER FUNCTION TEST', onlyBill: true, totalCost: 600.00, remarks: '' },
  { id: '76', name: 'RENAL FUNCTION TEST', onlyBill: true, totalCost: 200.00, remarks: '' },
  { id: '77', name: 'ELECTROLYTES', onlyBill: true, totalCost: 400.00, remarks: '' },
  { id: '78', name: 'HBA1C', onlyBill: true, totalCost: 350.00, remarks: '' },
  { id: '79', name: 'SEROLOGY', onlyBill: true, totalCost: 350.00, remarks: '' },
  { id: '80', name: 'DENGUE TEST', onlyBill: true, totalCost: 500.00, remarks: '' },
  { id: '81', name: 'WIDAL TEST', onlyBill: true, totalCost: 100.00, remarks: '' },
  { id: '82', name: 'THYROID PROFILE', onlyBill: true, totalCost: 250.00, remarks: '' }
];

const DEFAULT_TEST_NAME_RECORDS: TestNameEntryRecord[] = [
  {
    id: '524',
    groupName: 'HBA1C',
    orderNo: 1,
    testName: 'HbA1c',
    subHead: 0,
    specimen: '',
    unit: '%',
    maleMin: '3',
    maleMax: '10',
    femaleMin: '3',
    femaleMax: '10',
    maleNormal: '3 - 10',
    femaleNormal: '3 - 10',
    refValue: '3.2-5.6% -Normal',
    cost: 350,
    method: 'HPLC',
    remarks: 'Glycated Hemoglobin'
  },
  {
    id: '525',
    groupName: 'HBA1C',
    orderNo: 2,
    testName: 'Average Blood Glucose (eAG)',
    subHead: 0,
    specimen: '',
    unit: 'gm/dl',
    maleMin: '90',
    maleMax: '120',
    femaleMin: '90',
    femaleMax: '120',
    maleNormal: '',
    femaleNormal: '',
    refValue: '90 - 120 : Good Control',
    cost: 0,
    method: 'Calculated',
    remarks: ''
  },
  {
    id: '526',
    groupName: 'COMPLETE BLOOD COUNT (CBC)',
    orderNo: 1,
    testName: 'Total WBC Count',
    subHead: 0,
    specimen: 'EDTA Blood',
    unit: '10^3/uL',
    maleMin: '5000',
    maleMax: '12000',
    femaleMin: '5000',
    femaleMax: '12000',
    maleNormal: '5000 - 12000',
    femaleNormal: '5000 - 12000',
    refValue: '4.0 - 10.0',
    cost: 260,
    method: 'Automated Cell Counter',
    remarks: ''
  },
  {
    id: '527',
    groupName: 'COMPLETE BLOOD COUNT (CBC)',
    orderNo: 2,
    testName: 'Lymph%',
    subHead: 0,
    specimen: 'EDTA Blood',
    unit: '%',
    maleMin: '20',
    maleMax: '40',
    femaleMin: '20',
    femaleMax: '40',
    maleNormal: '20 - 40',
    femaleNormal: '20 - 40',
    refValue: '20 - 40',
    cost: 0,
    method: 'Differential',
    remarks: ''
  },
  {
    id: '528',
    groupName: 'COMPLETE BLOOD COUNT (CBC)',
    orderNo: 3,
    testName: 'MID%',
    subHead: 0,
    specimen: 'EDTA Blood',
    unit: '%',
    maleMin: '1.5',
    maleMax: '15',
    femaleMin: '1.5',
    femaleMax: '15',
    maleNormal: '1.5 - 15',
    femaleNormal: '1.5 - 15',
    refValue: '1.5 - 15',
    cost: 0,
    method: 'Differential',
    remarks: ''
  },
  {
    id: '529',
    groupName: 'COMPLETE BLOOD COUNT (CBC)',
    orderNo: 4,
    testName: 'Gran%',
    subHead: 0,
    specimen: 'EDTA Blood',
    unit: '%',
    maleMin: '50',
    maleMax: '70',
    femaleMin: '50',
    femaleMax: '70',
    maleNormal: '50 - 70',
    femaleNormal: '50 - 70',
    refValue: '50 - 70',
    cost: 0,
    method: 'Differential',
    remarks: ''
  },
  {
    id: '530',
    groupName: 'COMPLETE BLOOD COUNT (CBC)',
    orderNo: 5,
    testName: 'Lymph#',
    subHead: 0,
    specimen: 'EDTA Blood',
    unit: '10^3/uL',
    maleMin: '800',
    maleMax: '4000',
    femaleMin: '800',
    femaleMax: '4000',
    maleNormal: '800 - 4000',
    femaleNormal: '800 - 4000',
    refValue: '0.8 - 4.0',
    cost: 0,
    method: 'Absolute Count',
    remarks: ''
  }
];

const LabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { labRequests, markLabComplete } = useHospital();

  // Navigation Sub-Bar & Active Views State
  const [activeTab, setActiveTab] = useState<'patient-entry' | 'test-entry' | 'test-result' | 'print-result' | 'bill-print' | 'test-group'>('patient-entry');
  const [showSearchModal, setShowSearchModal] = useState(false);

  // --- COMPANY DROPDOWN STATE ---
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showReportMarginModal, setShowReportMarginModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // --- MASTER DROPDOWN STATE ---
  const [showMasterDropdown, setShowMasterDropdown] = useState(false);
  const [showTestNameModal, setShowTestNameModal] = useState(false);
  const [showDoctorListModal, setShowDoctorListModal] = useState(false);
  const [showPriceListModal, setShowPriceListModal] = useState(false);

  // Master Test Groups State (Matching Screenshot)
  const [testGroupsGrid, setTestGroupsGrid] = useState<TestGroupRecord[]>(DEFAULT_GROUP_RECORDS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [formGroupId, setFormGroupId] = useState('');
  const [formGroupName, setFormGroupName] = useState('');
  const [formOnlyBill, setFormOnlyBill] = useState(false);
  const [formTotalCost, setFormTotalCost] = useState('');
  const [formRemarks, setFormRemarks] = useState('');

  // Master Test Name Entry State (Matching Screenshot)
  const [testNameGrid, setTestNameGrid] = useState<TestNameEntryRecord[]>(DEFAULT_TEST_NAME_RECORDS);
  const [selectedTestNameId, setSelectedTestNameId] = useState<string>('');
  const [tnId, setTnId] = useState('');
  const [tnSecondaryId, setTnSecondaryId] = useState('');
  const [tnTestGroup, setTnTestGroup] = useState('');
  const [tnSubHeadChecked, setTnSubHeadChecked] = useState(false);
  const [tnSubHeadVal, setTnSubHeadVal] = useState('');
  const [tnSpecimen, setTnSpecimen] = useState('');
  const [tnTestName, setTnTestName] = useState('');
  const [tnUnit, setTnUnit] = useState('');
  const [tnCost, setTnCost] = useState('');
  const [tnMaleMin, setTnMaleMin] = useState('');
  const [tnMaleMax, setTnMaleMax] = useState('');
  const [tnFemaleMin, setTnFemaleMin] = useState('');
  const [tnFemaleMax, setTnFemaleMax] = useState('');
  const [tnRefValue, setTnRefValue] = useState('');
  const [tnMethod, setTnMethod] = useState('');
  const [tnRemarks, setTnRemarks] = useState('');

  // Master Doctor List State
  const [doctorsList, setDoctorsList] = useState<DoctorRecord[]>(DEFAULT_DOCTORS);
  const [newDocName, setNewDocName] = useState('');
  const [newDocQual, setNewDocQual] = useState('');
  const [newDocHosp, setNewDocHosp] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');

  // Company Details Form
  const [compName, setCompName] = useState('Shri Janani Hospital Diagnostics');
  const [compAddress, setCompAddress] = useState('12 Gandhi Road, Gobichettipalayam');
  const [compPhone, setCompPhone] = useState('9715425302');
  const [compGstin, setCompGstin] = useState('33AAAAA0000A1Z5');

  // User Creation Form
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState('Lab Technician');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userList, setUserList] = useState<{ name: string; role: string }[]>([
    { name: 'Admin', role: 'Administrator' },
    { name: 'Dr. Aris Thorne', role: 'Consultant Pathologist' },
    { name: 'Tech Rajesh', role: 'Lab Technician' }
  ]);

  // Report Margins State (in mm)
  const [topMargin, setTopMargin] = useState('15');
  const [bottomMargin, setBottomMargin] = useState('15');
  const [leftMargin, setLeftMargin] = useState('10');
  const [rightMargin, setRightMargin] = useState('10');

  // System Settings State
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [defaultPrintFormat, setDefaultPrintFormat] = useState('A5');
  const [headerTitleColor, setHeaderTitleColor] = useState('#6082b6');

  // Master Test Catalog State
  const [masterTests, setMasterTests] = useState<MasterTest[]>(DEFAULT_MASTER_TESTS);

  // --- PATIENT DETAILS (PATIENT ENTRY TAB) STATE ---
  const [patientGrid, setPatientGrid] = useState<PatientRecord[]>(DEFAULT_PATIENTS_DATA);
  const [selectedPid, setSelectedPid] = useState<string>('');

  // Patient Form Fields
  const [formPid, setFormPid] = useState('');
  const [formPname, setFormPname] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formAge, setFormAge] = useState('');
  const [formContact1, setFormContact1] = useState('');
  const [formContact2, setFormContact2] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPhotoPath, setFormPhotoPath] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // --- TEST BILL ENTRY (TEST ENTRY TAB) STATE ---
  const [testNo, setTestNo] = useState<string>('');
  const [testBillDate, setTestBillDate] = useState<string>('');
  const [patientTitle, setPatientTitle] = useState<string>('Mr.');
  const [refBy, setRefBy] = useState<string>('SELF');
  const [labHospital, setLabHospital] = useState<string>('SELF');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL GROUPS');
  const [selectAllGroupTests, setSelectAllGroupTests] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<number>(0);
  const [balancePaid, setBalancePaid] = useState<number>(0);
  const [viewCount, setViewCount] = useState<number>(0);

  // --- TEST RESULT ENTRY (TEST RESULT TAB) STATE ---
  const [resultTestNo, setResultTestNo] = useState<string>('');
  const [resultReportDate, setResultReportDate] = useState<string>('');
  const [resultValues, setResultValues] = useState<{ [testId: string]: string }>({});
  const [specimenValues, setSpecimenValues] = useState<{ [testId: string]: string }>({});
  const [remarksValues, setRemarksValues] = useState<{ [testId: string]: string }>({});
  const [resultSelectAll, setResultSelectAll] = useState<boolean>(true);

  // --- BILL PRINT DIALOG STATE ---
  const [billPrintNo, setBillPrintNo] = useState<string>('');
  const [printDesign, setPrintDesign] = useState<string>('BILLDESIGN-2-A5-Mode');
  const [withLetterHead, setWithLetterHead] = useState<boolean>(false);
  const [letterheadCounter, setLetterheadCounter] = useState<number>(0);
  const [showBillPreviewSheet, setShowBillPreviewSheet] = useState<boolean>(false);

  // Selected Tests for Current Patient
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMode] = useState<string>('Cash');

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Saved Lab Records List
  const [labRecords, setLabRecords] = useState<LabEntry[]>([
    {
      labId: 'LAB-2026-001',
      uhid: 'UHID-1001',
      patientName: 'Rajesh Kumar',
      age: '45',
      gender: 'Male',
      phone: '9876543210',
      refDoctor: 'Dr. Sarah Jenkins',
      date: '2026-07-22',
      time: '09:30 AM',
      tests: [DEFAULT_MASTER_TESTS[0], DEFAULT_MASTER_TESTS[2]],
      results: [
        { testId: 'T01', testName: 'Complete Blood Count (CBC)', value: '8.5', unit: '10^3/µL', normalRange: '4.5 - 11.0', isAbnormal: false, specimen: 'Whole Blood (EDTA)', remarks: 'Normal Hemogram' },
        { testId: 'T03', testName: 'Fasting Blood Sugar (FBS)', value: '118', unit: 'mg/dL', normalRange: '70 - 100', isAbnormal: true, specimen: 'Plasma (Fluoride)', remarks: 'Slightly Elevated FBS' }
      ],
      totalAmount: 570,
      discount: 20,
      paidAmount: 550,
      paymentMode: 'UPI',
      status: 'Completed'
    }
  ]);

  // Test Group Selection in Grid
  const handleSelectGroupRow = (grp: TestGroupRecord) => {
    setSelectedGroupId(grp.id);
    setFormGroupId(grp.id);
    setFormGroupName(grp.name);
    setFormOnlyBill(grp.onlyBill);
    setFormTotalCost(grp.totalCost.toFixed(2));
    setFormRemarks(grp.remarks || '');
  };

  const handleRefreshGroupForm = () => {
    const nextId = (testGroupsGrid.length + 70).toString();
    setFormGroupId(nextId);
    setFormGroupName('');
    setFormOnlyBill(false);
    setFormTotalCost('0.00');
    setFormRemarks('');
    setSelectedGroupId('');
  };

  const handleSaveGroupRecord = () => {
    if (!formGroupName) {
      alert('Please enter Test Group Name!');
      return;
    }

    const existingIdx = testGroupsGrid.findIndex(g => g.id === formGroupId);
    const newRecord: TestGroupRecord = {
      id: formGroupId || (testGroupsGrid.length + 70).toString(),
      name: formGroupName.toUpperCase().trim(),
      onlyBill: formOnlyBill,
      totalCost: parseFloat(formTotalCost) || 0,
      remarks: formRemarks
    };

    if (existingIdx >= 0) {
      const updated = [...testGroupsGrid];
      updated[existingIdx] = newRecord;
      setTestGroupsGrid(updated);
      alert(`Test Group '${formGroupName}' updated successfully!`);
    } else {
      setTestGroupsGrid([...testGroupsGrid, newRecord]);
      alert(`New Test Group '${formGroupName}' added successfully!`);
    }
  };

  const handleDeleteGroupRecord = () => {
    if (!selectedGroupId) {
      alert('Please select a Test Group row to delete!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete Test Group ID ${selectedGroupId}?`)) {
      setTestGroupsGrid(testGroupsGrid.filter(g => g.id !== selectedGroupId));
      handleRefreshGroupForm();
    }
  };

  const handleChangeTestOrder = () => {
    alert('Reordering test groups sequence.');
  };

  // Test Name Entry Row Selection Handler (Matching Screenshot)
  const handleSelectTestNameRow = (tn: TestNameEntryRecord) => {
    setSelectedTestNameId(tn.id);
    setTnId(tn.id);
    setTnTestGroup(tn.groupName);
    setTnSubHeadChecked(tn.subHead > 0);
    setTnSubHeadVal(tn.subHead.toString());
    setTnSpecimen(tn.specimen);
    setTnTestName(tn.testName);
    setTnUnit(tn.unit);
    setTnCost(tn.cost.toFixed(2));
    setTnMaleMin(tn.maleMin);
    setTnMaleMax(tn.maleMax);
    setTnFemaleMin(tn.femaleMin);
    setTnFemaleMax(tn.femaleMax);
    setTnRefValue(tn.refValue);
    setTnMethod(tn.method || '');
    setTnRemarks(tn.remarks || '');
  };

  const handleRefreshTestNameForm = () => {
    const nextId = (testNameGrid.length + 524).toString();
    setTnId(nextId);
    setTnSecondaryId('');
    setTnTestGroup('HBA1C');
    setTnSubHeadChecked(false);
    setTnSubHeadVal('');
    setTnSpecimen('EDTA Blood');
    setTnTestName('');
    setTnUnit('%');
    setTnCost('0.00');
    setTnMaleMin('');
    setTnMaleMax('');
    setTnFemaleMin('');
    setTnFemaleMax('');
    setTnRefValue('');
    setTnMethod('');
    setTnRemarks('');
    setSelectedTestNameId('');
  };

  const handleSaveTestNameRecord = () => {
    if (!tnTestName) {
      alert('Please enter Test Name!');
      return;
    }

    const existingIdx = testNameGrid.findIndex(t => t.id === tnId);
    const maleNorm = tnMaleMin && tnMaleMax ? `${tnMaleMin} - ${tnMaleMax}` : '';
    const femaleNorm = tnFemaleMin && tnFemaleMax ? `${tnFemaleMin} - ${tnFemaleMax}` : '';

    const newRecord: TestNameEntryRecord = {
      id: tnId || (testNameGrid.length + 524).toString(),
      groupName: tnTestGroup,
      orderNo: testNameGrid.length + 1,
      testName: tnTestName,
      subHead: tnSubHeadChecked ? (parseInt(tnSubHeadVal) || 1) : 0,
      specimen: tnSpecimen,
      unit: tnUnit,
      maleMin: tnMaleMin,
      maleMax: tnMaleMax,
      femaleMin: tnFemaleMin,
      femaleMax: tnFemaleMax,
      maleNormal: maleNorm,
      femaleNormal: femaleNorm,
      refValue: tnRefValue || `${maleNorm}`,
      cost: parseFloat(tnCost) || 0,
      method: tnMethod,
      remarks: tnRemarks
    };

    if (existingIdx >= 0) {
      const updated = [...testNameGrid];
      updated[existingIdx] = newRecord;
      setTestNameGrid(updated);
      alert(`Test Name '${tnTestName}' updated successfully!`);
    } else {
      setTestNameGrid([...testNameGrid, newRecord]);
      alert(`New Test Name '${tnTestName}' added successfully!`);
    }
  };

  const handleDeleteTestNameRecord = () => {
    if (!selectedTestNameId) {
      alert('Please select a Test Name row to delete!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete Test Name ID ${selectedTestNameId}?`)) {
      setTestNameGrid(testNameGrid.filter(t => t.id !== selectedTestNameId));
      handleRefreshTestNameForm();
    }
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    const newDoc: DoctorRecord = {
      id: `DOC-${doctorsList.length + 1}`,
      name: newDocName,
      qualification: newDocQual || 'M.B.B.S',
      hospital: newDocHosp || 'SELF',
      phone: newDocPhone || '-'
    };
    setDoctorsList([...doctorsList, newDoc]);
    setNewDocName('');
    setNewDocQual('');
    setNewDocHosp('');
    setNewDocPhone('');
    alert(`Doctor '${newDocName}' added to Master list successfully!`);
  };

  // Backup Action Handler
  const handleTriggerBackup = () => {
    setShowCompanyDropdown(false);
    const backupData = {
      timestamp: new Date().toISOString(),
      company: { name: compName, address: compAddress, phone: compPhone, gstin: compGstin },
      patients: patientGrid,
      masterTests,
      records: labRecords
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LabSoft_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Full System Backup Downloaded Successfully!');
  };

  // Create User Handler
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newUserPassword) return;
    setUserList([...userList, { name: newUsername, role: newUserRole }]);
    setNewUsername('');
    setNewUserPassword('');
    alert(`New User '${newUsername}' created successfully as ${newUserRole}!`);
  };

  // Restore Handler
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.patients) setPatientGrid(parsed.patients);
          if (parsed.masterTests) setMasterTests(parsed.masterTests);
          if (parsed.records) setLabRecords(parsed.records);
          alert('Database restored successfully from backup file!');
          setShowRestoreModal(false);
        } catch {
          alert('Invalid backup file format!');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle row click in Patient Entry Table
  const handleSelectPatientRow = (patient: PatientRecord) => {
    setSelectedPid(patient.pid);
    setFormPid(patient.pid);
    setFormPname(patient.pname);
    setFormGender(patient.gender);
    setFormAge(patient.age);
    setFormContact1(patient.contact1);
    setFormContact2(patient.contact2 || '');
    setFormEmail(patient.email);
    setFormAddress(patient.address);
    setFormCity(patient.city);
    setFormPhotoPath(patient.photoPath || 'E:\\LabSoft\\Photo\\sample.jpg');
  };

  // Patient Search Handlers
  const handleSearchByPid = () => {
    const found = patientGrid.find(p => p.pid.toLowerCase() === formPid.toLowerCase());
    if (found) {
      handleSelectPatientRow(found);
    } else {
      alert(`Patient ID '${formPid}' not found!`);
    }
  };

  const handleSearchByName = () => {
    const found = patientGrid.find(p => p.pname.toLowerCase().includes(formPname.toLowerCase()));
    if (found) {
      handleSelectPatientRow(found);
    } else {
      alert(`Patient Name '${formPname}' not found!`);
    }
  };

  const handleSearchByContact = () => {
    const found = patientGrid.find(p => p.contact1.includes(formContact1));
    if (found) {
      handleSelectPatientRow(found);
    } else {
      alert(`Contact '${formContact1}' not found!`);
    }
  };

  // Reset / Refresh Patient Form
  const handleRefreshPatientForm = () => {
    setFormPid('');
    setFormPname('');
    setFormGender('Male');
    setFormAge('');
    setFormContact1('');
    setFormContact2('');
    setFormEmail('');
    setFormAddress('');
    setFormCity('');
    setFormPhotoPath('');
    setPhotoPreview(null);
    setSelectedPid('');
  };

  // Save / Add Patient Record
  const handleSavePatientRecord = () => {
    if (!formPname) {
      alert('Please enter Patient Name!');
      return;
    }

    const existingIdx = patientGrid.findIndex(p => p.pid === formPid);
    const newRecord: PatientRecord = {
      pid: formPid || (patientGrid.length + 1).toString(),
      pname: formPname,
      address: formAddress,
      city: formCity,
      contact1: formContact1,
      contact2: formContact2,
      gender: formGender,
      age: formAge,
      email: formEmail,
      photoPath: formPhotoPath
    };

    if (existingIdx >= 0) {
      const updated = [...patientGrid];
      updated[existingIdx] = newRecord;
      setPatientGrid(updated);
      alert(`Patient '${formPname}' updated successfully!`);
    } else {
      setPatientGrid([...patientGrid, newRecord]);
      alert(`New Patient '${formPname}' added successfully!`);
    }
  };

  // Delete Patient Record
  const handleDeletePatientRecord = () => {
    if (!selectedPid) {
      alert('Please select a patient row to delete!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete Patient ID ${selectedPid}?`)) {
      setPatientGrid(patientGrid.filter(p => p.pid !== selectedPid));
      handleRefreshPatientForm();
    }
  };

  // Export Table Data to CSV Excel format
  const handleExportExcel = () => {
    const headers = ['Pid', 'Pname', 'Address', 'City', 'Contact1', 'Contact2', 'Gender', 'Age', 'Email'];
    const rows = patientGrid.map(p => [
      p.pid,
      `"${p.pname}"`,
      `"${p.address}"`,
      `"${p.city}"`,
      p.contact1,
      p.contact2 || '',
      p.gender,
      p.age,
      p.email
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Patient_Entry_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Photo Upload Trigger
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormPhotoPath(`E:\\LabSoft\\Photo\\${file.name}`);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // --- TEST ENTRY (TEST BILL ENTRY) HANDLERS ---
  const filteredTestsByGroup = masterTests.filter(t => {
    if (selectedGroup === 'ALL GROUPS') return true;
    return t.category.toUpperCase() === selectedGroup.toUpperCase();
  });

  const handleToggleGroupSelectAll = (checked: boolean) => {
    setSelectAllGroupTests(checked);
    if (checked) {
      const groupIds = filteredTestsByGroup.map(t => t.id);
      const combined = Array.from(new Set([...selectedTestIds, ...groupIds]));
      setSelectedTestIds(combined);
    } else {
      const groupIds = filteredTestsByGroup.map(t => t.id);
      setSelectedTestIds(selectedTestIds.filter(id => !groupIds.includes(id)));
    }
  };

  const toggleTestSelection = (id: string) => {
    if (selectedTestIds.includes(id)) {
      setSelectedTestIds(selectedTestIds.filter(tId => tId !== id));
    } else {
      setSelectedTestIds([...selectedTestIds, id]);
    }
  };

  const handleRemoveTestFromBill = (id: string) => {
    setSelectedTestIds(selectedTestIds.filter(tId => tId !== id));
  };

  const handleRefreshTestBill = () => {
    setTestNo((parseInt(testNo || '3500') + 1).toString());
    setSelectedTestIds([]);
    setDiscount(0);
    setPaidAmount(0);
    setExpenses(0);
    setBalancePaid(0);
  };

  // --- TEST RESULT ENTRY NAVIGATION HANDLERS ---
  const handlePrevTestNo = () => {
    const num = Math.max(1, parseInt(resultTestNo || '3574') - 1);
    setResultTestNo(num.toString());
  };

  const handleNextTestNo = () => {
    const num = parseInt(resultTestNo || '3574') + 1;
    setResultTestNo(num.toString());
  };

  const handleToggleResultSelectAll = (checked: boolean) => {
    setResultSelectAll(checked);
  };

  // Calculate cost totals
  const selectedTestsObj = masterTests.filter(t => selectedTestIds.includes(t.id));
  const subtotal = selectedTestsObj.reduce((acc, curr) => acc + curr.price, 0);
  const netAmount = Math.max(0, subtotal - discount);
  const balance = Math.max(0, netAmount - paidAmount);

  // Save current Lab Entry
  const handleSaveLabEntry = () => {
    if (!formPname) {
      alert('Please enter patient details in Patient Entry!');
      setActiveTab('patient-entry');
      return;
    }
    if (selectedTestIds.length === 0) {
      alert('Please select at least one test in Test Entry!');
      setActiveTab('test-entry');
      return;
    }

    const compiledResults: TestResultItem[] = selectedTestsObj.map(t => ({
      testId: t.id,
      testName: t.name,
      value: resultValues[t.id] || 'Pending',
      unit: t.unit,
      normalRange: t.normalRange,
      isAbnormal: parseFloat(resultValues[t.id] || '0') > 110,
      specimen: specimenValues[t.id] || t.defaultSpecimen || 'Blood',
      remarks: remarksValues[t.id] || 'Normal'
    }));

    const newLabId = `LAB-2026-0${labRecords.length + 1}`;
    const newEntry: LabEntry = {
      labId: newLabId,
      uhid: `UHID-${1000 + parseInt(formPid || '1')}`,
      patientName: `${patientTitle} ${formPname}`,
      age: formAge,
      gender: formGender,
      phone: formContact1,
      refDoctor: refBy,
      date: testBillDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tests: selectedTestsObj,
      results: compiledResults,
      totalAmount: netAmount,
      discount,
      paidAmount: paidAmount || netAmount,
      paymentMode,
      status: 'Completed'
    };

    setLabRecords([newEntry, ...labRecords]);
    
    const matchingReq = labRequests.find(l => l.patientName.toLowerCase() === formPname.toLowerCase());
    if (matchingReq) {
      markLabComplete(matchingReq.id);
    }

    alert(`Test Result for Bill #${resultTestNo} (${newLabId}) saved successfully!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeRecord = labRecords[0] || null;

  return (
    <div className="lab-module-container">
      {/* --- DESKTOP SOFTWARE TOP WINDOW BAR --- */}
      <div className="lab-software-titlebar">
        <span className="titlebar-text">Kumaran Soft Solution - Gobichettipalayam - Contact - 9715425302</span>
        <button className="titlebar-close-btn" title="Close Application" onClick={() => navigate('/')}>X</button>
      </div>

      {/* --- TOP NAV BAR WITH COMPANY & MASTER DROPDOWNS --- */}
      <header className="lab-navbar">
        <nav className="lab-nav-links">
          {/* Company Dropdown Menu Button */}
          <div className="dropdown-container">
            <button 
              className={`nav-item-btn ${showCompanyDropdown ? 'active' : ''}`} 
              onClick={() => {
                setShowCompanyDropdown(!showCompanyDropdown);
                setShowMasterDropdown(false);
              }}
            >
              <Building2 size={16} />
              <span>Company</span>
              <ChevronDown size={14} className="ml-1" />
            </button>

            {showCompanyDropdown && (
              <div className="company-dropdown-menu">
                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    setShowCreateCompanyModal(true);
                  }}
                >
                  <Building2 size={16} />
                  <span>Create Company</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    setShowCreateUserModal(true);
                  }}
                >
                  <UserCheck size={16} />
                  <span>Create User</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={handleTriggerBackup}
                >
                  <HardDriveDownload size={16} />
                  <span>Backup</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    setShowRestoreModal(true);
                  }}
                >
                  <HardDriveUpload size={16} />
                  <span>Restore</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    setShowReportMarginModal(true);
                  }}
                >
                  <Sliders size={16} />
                  <span>Report Margin</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    setShowSettingsModal(true);
                  }}
                >
                  <SettingsIcon size={16} />
                  <span>Settings</span>
                </button>

                <div className="dropdown-divider"></div>

                <button 
                  className="dropdown-menu-item logout-item"
                  onClick={() => {
                    setShowCompanyDropdown(false);
                    navigate('/');
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Master Dropdown Menu Button */}
          <div className="dropdown-container">
            <button 
              className={`nav-item-btn ${showMasterDropdown ? 'active' : ''}`}
              onClick={() => {
                setShowMasterDropdown(!showMasterDropdown);
                setShowCompanyDropdown(false);
              }}
            >
              <Database size={16} />
              <span>Master</span>
              <ChevronDown size={14} className="ml-1" />
            </button>

            {showMasterDropdown && (
              <div className="company-dropdown-menu">
                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowMasterDropdown(false);
                    setActiveTab('test-group');
                  }}
                >
                  <FolderTree size={16} />
                  <span>Test Group</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowMasterDropdown(false);
                    setShowTestNameModal(true);
                  }}
                >
                  <TestTube size={16} />
                  <span>Test Name</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowMasterDropdown(false);
                    setShowDoctorListModal(true);
                  }}
                >
                  <Stethoscope size={16} />
                  <span>Doctor List</span>
                </button>

                <button 
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowMasterDropdown(false);
                    setShowPriceListModal(true);
                  }}
                >
                  <Tag size={16} />
                  <span>Price List</span>
                </button>
              </div>
            )}
          </div>

          <button className="nav-item-btn active">
            <FileEdit size={16} />
            <span>Entry</span>
          </button>

          <button className="nav-item-btn" onClick={() => setShowSearchModal(true)}>
            <SearchIcon size={16} />
            <span>Search</span>
          </button>

          <button className="nav-item-btn exit-btn" onClick={() => navigate('/')}>
            <LogOut size={16} />
            <span>Exit</span>
          </button>
        </nav>
      </header>

      {/* --- SUB ACTION TABS BAR --- */}
      <div className="lab-subtabs-row">
        <button 
          className={`subtab-btn ${activeTab === 'patient-entry' ? 'active' : ''}`}
          onClick={() => setActiveTab('patient-entry')}
        >
          <UserPlus size={16} />
          <span>Patient Entry</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'test-entry' ? 'active' : ''}`}
          onClick={() => setActiveTab('test-entry')}
        >
          <TestTube2 size={16} />
          <span>Test Entry</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'test-result' ? 'active' : ''}`}
          onClick={() => setActiveTab('test-result')}
        >
          <ClipboardCheck size={16} />
          <span>Test Result</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'print-result' ? 'active' : ''}`}
          onClick={() => setActiveTab('print-result')}
        >
          <Printer size={16} />
          <span>Print Result</span>
        </button>

        <button 
          className={`subtab-btn ${activeTab === 'bill-print' ? 'active' : ''}`}
          onClick={() => setActiveTab('bill-print')}
        >
          <Receipt size={16} />
          <span>Bill Print</span>
        </button>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <main className="lab-main-body">
        {/* ========================================== */}
        {/* TAB 1: PATIENT ENTRY (PATIENT DETAILS)     */}
        {/* ========================================== */}
        {activeTab === 'patient-entry' && (
          <div className="patient-entry-desktop-window card fade-in">
            <div className="window-header">
              <div className="window-header-left">
                <UserPlus size={18} />
                <span>Patient Entry</span>
              </div>
              <button className="window-close-red" onClick={() => navigate('/')}>X</button>
            </div>

            <div className="window-body">
              <h2 className="patient-details-banner">PATIENT DETAILS</h2>

              <div className="patient-form-grid-layout">
                <div className="left-form-fields">
                  <div className="form-row">
                    <label className="field-label">Patient ID</label>
                    <div className="field-inline-group">
                      <input 
                        type="text" 
                        className="form-control-desktop pid-input"
                        value={formPid}
                        onChange={e => setFormPid(e.target.value)}
                      />
                      <button className="btn-search-red" onClick={handleSearchByPid}>Search</button>
                      <input 
                        type="text" 
                        className="form-control-desktop path-input"
                        value={formPhotoPath}
                        onChange={e => setFormPhotoPath(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="field-label">Patient Name</label>
                    <div className="field-inline-group">
                      <select 
                        className="form-control-desktop name-select"
                        value={formPname}
                        onChange={e => {
                          setFormPname(e.target.value);
                          const found = patientGrid.find(p => p.pname === e.target.value);
                          if (found) handleSelectPatientRow(found);
                        }}
                      >
                        <option value="">-- Select Name --</option>
                        {patientGrid.map(p => (
                          <option key={p.pid} value={p.pname}>{p.pname}</option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        className="form-control-desktop name-text-input" 
                        placeholder="Type Patient Name"
                        value={formPname}
                        onChange={e => setFormPname(e.target.value)}
                      />
                      <button className="btn-search-red" onClick={handleSearchByName}>Search</button>
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="field-label">Gender</label>
                    <div className="field-inline-group">
                      <select 
                        className="form-control-desktop gender-select"
                        value={formGender}
                        onChange={e => setFormGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>

                      <label className="field-label-inline">Age</label>
                      <input 
                        type="text" 
                        className="form-control-desktop age-input"
                        value={formAge}
                        onChange={e => setFormAge(e.target.value)}
                        placeholder="Age"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="field-label">Contact No</label>
                    <div className="field-inline-group">
                      <input 
                        type="text" 
                        className="form-control-desktop contact-input"
                        value={formContact1}
                        onChange={e => setFormContact1(e.target.value)}
                      />
                      <input 
                        type="text" 
                        className="form-control-desktop contact2-input"
                        placeholder="Secondary Contact"
                        value={formContact2}
                        onChange={e => setFormContact2(e.target.value)}
                      />
                      <button className="btn-search-red" onClick={handleSearchByContact}>Search</button>
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="field-label">E-Mail</label>
                    <input 
                      type="text" 
                      className="form-control-desktop full-width-input"
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="form-row">
                    <label className="field-label">Address</label>
                    <input 
                      type="text" 
                      className="form-control-desktop full-width-input"
                      value={formAddress}
                      onChange={e => setFormAddress(e.target.value)}
                      placeholder="Street Address"
                    />
                  </div>

                  <div className="form-row">
                    <label className="field-label">City</label>
                    <input 
                      type="text" 
                      className="form-control-desktop full-width-input"
                      value={formCity}
                      onChange={e => setFormCity(e.target.value)}
                      placeholder="City Name"
                    />
                  </div>
                </div>

                <div className="right-photo-box-section">
                  <div className="photo-preview-box">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Patient" className="photo-img" />
                    ) : (
                      <div className="photo-placeholder">
                        <UserPlus size={48} className="placeholder-icon" />
                        <span>Patient Photo</span>
                      </div>
                    )}
                  </div>
                  <label htmlFor="photo-upload-input" className="btn-add-photo">
                    <Upload size={14} /> Add Photo
                  </label>
                  <input 
                    id="photo-upload-input" 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              <div className="patient-grid-container">
                <table className="desktop-patient-table">
                  <thead>
                    <tr>
                      <th>Pid</th>
                      <th>Pname</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>Contact1</th>
                      <th>Contact2</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientGrid.map(patient => (
                      <tr 
                        key={patient.pid} 
                        className={selectedPid === patient.pid ? 'selected-row' : ''}
                        onClick={() => handleSelectPatientRow(patient)}
                      >
                        <td>{patient.pid}</td>
                        <td><strong>{patient.pname}</strong></td>
                        <td>{patient.address}</td>
                        <td>{patient.city}</td>
                        <td>{patient.contact1}</td>
                        <td>{patient.contact2 || '-'}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.age}</td>
                        <td>{patient.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="desktop-action-bar">
                <button className="btn-desktop btn-export-excel" onClick={handleExportExcel}>
                  <FileSpreadsheet size={16} /> EXPORT EXCEL
                </button>
                <button className="btn-desktop" onClick={handleSavePatientRecord}>
                  Save
                </button>
                <button className="btn-desktop" onClick={handleSavePatientRecord}>
                  <Edit size={14} /> Edit
                </button>
                <button className="btn-desktop" onClick={handleDeletePatientRecord}>
                  <Trash2 size={14} /> Delete
                </button>
                <button className="btn-desktop" onClick={() => navigate('/')}>
                  Close
                </button>
                <button className="btn-desktop" onClick={handleRefreshPatientForm}>
                  <RefreshCw size={14} /> Referesh
                </button>
                <button className="btn-desktop btn-bill-entry" onClick={() => setActiveTab('test-entry')}>
                  Bill Entry &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: TEST GROUP CREATE WINDOW (EXACT REPLICA OF USER'S SCREENSHOT IMAGE)   */}
        {/* ========================================================================= */}
        {activeTab === 'test-group' && (
          <div className="test-group-modal-dialog card fade-in">
            <div className="test-group-dialog-header">
              <div className="test-group-title-left">
                <FolderTree size={16} />
                <span>Test Group Create</span>
              </div>
              <button className="window-close-red" onClick={() => setActiveTab('patient-entry')}>X</button>
            </div>

            <div className="test-group-dialog-body">
              <div className="test-group-banner-row">
                <input 
                  type="text" 
                  className="tg-id-box" 
                  value={formGroupId}
                  onChange={e => setFormGroupId(e.target.value)}
                />
                <h2 className="tg-blue-title">TEST GROUP</h2>
                <button className="tg-red-x-btn" onClick={() => setActiveTab('patient-entry')}>X</button>
              </div>

              <div className="tg-form-container">
                <div className="tg-field-row">
                  <label className="tg-label">Test Group Name</label>
                  <input 
                    type="text" 
                    className="tg-input-wide"
                    value={formGroupName}
                    onChange={e => setFormGroupName(e.target.value)}
                  />
                </div>

                <div className="tg-field-row flex-items-center">
                  <div className="only-bill-group">
                    <input 
                      type="checkbox" 
                      id="only-bill-cb"
                      checked={formOnlyBill}
                      onChange={e => setFormOnlyBill(e.target.checked)}
                    />
                    <label htmlFor="only-bill-cb" className="tg-cb-label">ONLY BILL</label>
                  </div>

                  <div className="total-cost-group">
                    <label className="tg-label-sm">Total Cost</label>
                    <input 
                      type="text" 
                      className="tg-input-cost"
                      value={formTotalCost}
                      onChange={e => setFormTotalCost(e.target.value)}
                    />
                  </div>
                </div>

                <div className="tg-field-row">
                  <label className="tg-label">Remarks</label>
                  <input 
                    type="text" 
                    className="tg-input-wide"
                    value={formRemarks}
                    onChange={e => setFormRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="tg-table-wrapper">
                <table className="tg-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Groupname</th>
                      <th style={{ width: '25%' }}>Cost</th>
                      <th style={{ width: '30%' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testGroupsGrid.map(grp => {
                      const isSelected = selectedGroupId === grp.id;
                      return (
                        <tr 
                          key={grp.id} 
                          className={isSelected ? 'tg-selected-row' : ''}
                          onClick={() => handleSelectGroupRow(grp)}
                        >
                          <td><strong>{grp.name}</strong></td>
                          <td>{grp.totalCost.toFixed(2)}</td>
                          <td>{grp.remarks || ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="tg-action-bar">
                <div className="tg-left-buttons">
                  <button className="tg-btn-action" onClick={handleSaveGroupRecord}>
                    Save
                  </button>
                  <button className="tg-btn-action" onClick={handleSaveGroupRecord}>
                    Edit
                  </button>
                  <button className="tg-btn-action" onClick={handleDeleteGroupRecord}>
                    Delete
                  </button>
                  <button className="tg-btn-action" onClick={() => setActiveTab('patient-entry')}>
                    Close
                  </button>
                  <button className="tg-btn-action" onClick={handleRefreshGroupForm}>
                    Refresh
                  </button>
                </div>

                <button className="tg-btn-action tg-change-order-btn" onClick={handleChangeTestOrder}>
                  Change<br />Test Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: TEST ENTRY (TEST BILL ENTRY IMAGE)  */}
        {/* ========================================== */}
        {activeTab === 'test-entry' && (
          <div className="test-entry-desktop-window card fade-in">
            <div className="window-header">
              <div className="window-header-left">
                <TestTube2 size={18} />
                <span>Test Entry</span>
              </div>
              <button className="window-close-red" onClick={() => navigate('/')}>X</button>
            </div>

            <div className="window-body">
              <div className="test-bill-header-row">
                <div className="test-no-group">
                  <label className="field-label-sm">Test No</label>
                  <input 
                    type="text" 
                    className="form-control-desktop testno-input" 
                    value={testNo} 
                    onChange={e => setTestNo(e.target.value)}
                  />
                  <label className="field-label-sm">Date</label>
                  <input 
                    type="date" 
                    className="form-control-desktop testdate-input" 
                    value={testBillDate} 
                    onChange={e => setTestBillDate(e.target.value)}
                  />
                </div>
                <h2 className="test-bill-title-banner">TEST BILL ENTRY</h2>
              </div>

              <div className="patient-demographics-bar">
                <div className="demo-field">
                  <label>Title</label>
                  <select 
                    className="form-control-desktop title-select" 
                    value={patientTitle} 
                    onChange={e => setPatientTitle(e.target.value)}
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Master">Master</option>
                    <option value="Baby">Baby</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                <div className="demo-field flex-grow">
                  <label>Patient Name</label>
                  <div className="patient-browse-group">
                    <input 
                      type="text" 
                      className="form-control-desktop full-width" 
                      value={formPname} 
                      onChange={e => setFormPname(e.target.value)}
                      placeholder="Enter Patient Name"
                    />
                    <button 
                      className="btn-browse" 
                      title="Browse Registered Patients"
                      onClick={() => setActiveTab('patient-entry')}
                    >
                      ...
                    </button>
                  </div>
                </div>

                <div className="demo-field">
                  <label>Age</label>
                  <input 
                    type="text" 
                    className="form-control-desktop age-mini" 
                    value={formAge} 
                    onChange={e => setFormAge(e.target.value)}
                  />
                </div>

                <div className="demo-field">
                  <label>Gender</label>
                  <select 
                    className="form-control-desktop gender-mini" 
                    value={formGender} 
                    onChange={e => setFormGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="demo-field">
                  <label>Ref.By</label>
                  <select 
                    className="form-control-desktop refby-select" 
                    value={refBy} 
                    onChange={e => setRefBy(e.target.value)}
                  >
                    <option value="SELF">SELF</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="demo-field">
                  <label>Mobile No</label>
                  <input 
                    type="text" 
                    className="form-control-desktop mobile-mini" 
                    value={formContact1} 
                    onChange={e => setFormContact1(e.target.value)}
                  />
                </div>

                <div className="demo-field">
                  <label>Lab / Hospital</label>
                  <select 
                    className="form-control-desktop labhospital-select" 
                    value={labHospital} 
                    onChange={e => setLabHospital(e.target.value)}
                  >
                    <option value="SELF">SELF</option>
                    <option value="Shri Janani Hospital">Shri Janani Hospital</option>
                    <option value="City Clinic">City Clinic</option>
                  </select>
                </div>
              </div>

              <div className="test-bill-workspace-grid">
                <div className="group-selection-pane">
                  <h3 className="group-header-title">TEST GROUP NAME</h3>
                  <select 
                    className="form-control-desktop group-select" 
                    value={selectedGroup} 
                    onChange={e => setSelectedGroup(e.target.value)}
                  >
                    <option value="ALL GROUPS">ALL GROUPS</option>
                    {testGroupsGrid.map(grp => (
                      <option key={grp.id} value={grp.name}>{grp.name}</option>
                    ))}
                  </select>

                  <div className="select-all-row">
                    <input 
                      type="checkbox" 
                      id="select-all-cb" 
                      checked={selectAllGroupTests} 
                      onChange={e => handleToggleGroupSelectAll(e.target.checked)}
                    />
                    <label htmlFor="select-all-cb">Select All</label>
                  </div>

                  <div className="master-tests-checkbox-box">
                    {filteredTestsByGroup.map(test => {
                      const isChecked = selectedTestIds.includes(test.id);
                      return (
                        <div 
                          key={test.id} 
                          className={`test-check-row ${isChecked ? 'active' : ''}`}
                          onClick={() => toggleTestSelection(test.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {}}
                          />
                          <span className="test-name-span">{test.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="submit-btn-row">
                    <button className="btn-submit-group" onClick={() => alert('Test selections submitted!')}>
                      SUBMIT
                    </button>
                    <input type="text" className="form-control-desktop mini-box-below" readOnly value={selectedTestIds.length} />
                  </div>
                </div>

                <div className="test-details-table-pane">
                  <div className="details-table-container">
                    <table className="test-details-table">
                      <thead>
                        <tr>
                          <th>Test Details</th>
                          <th>Amount</th>
                          <th>Delete</th>
                          <th>TType</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTestsObj.map(test => (
                          <tr key={test.id}>
                            <td><strong>{test.name}</strong></td>
                            <td>₹{test.price.toFixed(2)}</td>
                            <td>
                              <button 
                                className="btn-delete-test-row" 
                                title="Remove test"
                                onClick={() => handleRemoveTestFromBill(test.id)}
                              >
                                <Trash size={14} />
                              </button>
                            </td>
                            <td>{test.ttype || 'Single'}</td>
                          </tr>
                        ))}
                        {selectedTestsObj.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center empty-td">
                              No tests selected. Choose tests from left group box.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="cost-summary-pane">
                  <div className="summary-field-row">
                    <label>No Of Tests</label>
                    <input type="text" className="summary-input" readOnly value={selectedTestIds.length} />
                  </div>

                  <div className="red-divider-line"></div>

                  <div className="summary-field-row">
                    <label>Total Cost</label>
                    <input type="text" className="summary-input" readOnly value={subtotal.toFixed(2)} />
                  </div>

                  <div className="summary-field-row">
                    <label>Discount</label>
                    <input 
                      type="number" 
                      className="summary-input" 
                      value={discount} 
                      onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="summary-field-row">
                    <label>Amount</label>
                    <input type="text" className="summary-input" readOnly value={netAmount.toFixed(2)} />
                  </div>

                  <div className="summary-field-row">
                    <label>Amount Paid</label>
                    <input 
                      type="number" 
                      className="summary-input" 
                      value={paidAmount} 
                      onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="summary-field-row">
                    <label>Balance</label>
                    <input type="text" className="summary-input" readOnly value={balance.toFixed(2)} />
                  </div>

                  <div className="summary-field-row">
                    <label>Balance Paid</label>
                    <input 
                      type="number" 
                      className="summary-input" 
                      value={balancePaid} 
                      onChange={e => setBalancePaid(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="red-divider-line"></div>

                  <div className="summary-field-row">
                    <label>Expenses</label>
                    <input 
                      type="number" 
                      className="summary-input" 
                      value={expenses} 
                      onChange={e => setExpenses(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="test-bill-action-bar">
                <button className="btn-bill-action" onClick={handleSaveLabEntry}>
                  SAVE
                </button>
                <button className="btn-bill-action" onClick={() => setActiveTab('test-result')}>
                  RESULT
                </button>
                <button className="btn-bill-action" onClick={() => navigate('/')}>
                  CLOSE
                </button>
                <button className="btn-bill-action" onClick={handleRefreshTestBill}>
                  REFRESH
                </button>
                <button className="btn-bill-action" onClick={() => setActiveTab('bill-print')}>
                  PRINT BILL
                </button>
                <div className="btn-view-group">
                  <button className="btn-bill-action" onClick={() => setViewCount(viewCount + 1)}>
                    VIEW
                  </button>
                  <input type="text" className="view-counter-box" readOnly value={viewCount} />
                </div>
                <button className="btn-bill-action btn-edit-highlight" onClick={handleSaveLabEntry}>
                  EDIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* TAB 3: TEST RESULT (TEST RESULT ENTRY IMAGE)  */}
        {/* ============================================== */}
        {activeTab === 'test-result' && (
          <div className="test-result-desktop-window card fade-in">
            <div className="window-header">
              <div className="window-header-left">
                <ClipboardCheck size={18} />
                <span>Test Result Entry</span>
              </div>
              <button className="window-close-red" onClick={() => navigate('/')}>X</button>
            </div>

            <div className="window-body">
              <div className="result-entry-header-row">
                <div className="nav-arrow-group">
                  <button className="btn-nav-arrow" title="Previous Test No" onClick={handlePrevTestNo}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="btn-nav-arrow" title="Next Test No" onClick={handleNextTestNo}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="testno-view-group">
                  <label className="field-label-sm">Test No</label>
                  <input 
                    type="text" 
                    className="form-control-desktop result-testno-input" 
                    value={resultTestNo} 
                    onChange={e => setResultTestNo(e.target.value)}
                  />
                  <button className="btn-view-blue" onClick={() => alert(`Loaded Record for Test No ${resultTestNo}`)}>
                    View
                  </button>
                </div>

                <h2 className="result-entry-title-banner">TEST RESULT ENTRY</h2>

                <button className="btn-bill-view-red" onClick={() => setActiveTab('bill-print')}>
                  BILL VIEW
                </button>
              </div>

              <div className="patient-demographics-bar">
                <div className="demo-field">
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="form-control-desktop" 
                    value={testBillDate} 
                    onChange={e => setTestBillDate(e.target.value)}
                  />
                </div>

                <div className="demo-field flex-grow">
                  <label>Patient Name</label>
                  <input 
                    type="text" 
                    className="form-control-desktop full-width" 
                    value={`${patientTitle} ${formPname}`} 
                    onChange={e => setFormPname(e.target.value)}
                  />
                </div>

                <div className="demo-field">
                  <label>Age</label>
                  <input 
                    type="text" 
                    className="form-control-desktop age-mini" 
                    value={formAge} 
                    onChange={e => setFormAge(e.target.value)}
                  />
                </div>

                <div className="demo-field">
                  <label>Gender</label>
                  <select 
                    className="form-control-desktop gender-mini" 
                    value={formGender} 
                    onChange={e => setFormGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="demo-field">
                  <label>Ref.By</label>
                  <select 
                    className="form-control-desktop refby-select" 
                    value={refBy} 
                    onChange={e => setRefBy(e.target.value)}
                  >
                    <option value="SELF">SELF</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="demo-field">
                  <label>Lab / Hospital</label>
                  <select 
                    className="form-control-desktop labhospital-select" 
                    value={labHospital} 
                    onChange={e => setLabHospital(e.target.value)}
                  >
                    <option value="SELF">SELF</option>
                    <option value="Shri Janani Hospital">Shri Janani Hospital</option>
                  </select>
                </div>

                <div className="demo-field">
                  <label>Report Date</label>
                  <input 
                    type="date" 
                    className="form-control-desktop" 
                    value={resultReportDate} 
                    onChange={e => setResultReportDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="result-entry-workspace-grid">
                <div className="result-left-list-pane">
                  <div className="purple-select-all-row">
                    <input 
                      type="checkbox" 
                      id="result-select-all-cb" 
                      checked={resultSelectAll} 
                      onChange={e => handleToggleResultSelectAll(e.target.checked)}
                    />
                    <label htmlFor="result-select-all-cb" className="purple-label">Select All</label>
                  </div>

                  <div className="result-test-scroll-box">
                    {selectedTestsObj.map(test => (
                      <div key={test.id} className="result-test-checkbox-item">
                        <input 
                          type="checkbox" 
                          checked={true} 
                          onChange={() => {}} 
                        />
                        <span>{test.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="left-counter-bottom">
                    <input 
                      type="text" 
                      className="form-control-desktop mini-counter-box" 
                      readOnly 
                      value={selectedTestsObj.length}
                    />
                  </div>
                </div>

                <div className="result-table-pane">
                  <div className="result-grid-table-container">
                    <table className="desktop-result-entry-table">
                      <thead>
                        <tr>
                          <th>Group Name</th>
                          <th>Test Name</th>
                          <th>Result</th>
                          <th>Unit</th>
                          <th>Normal Value</th>
                          <th>Specimen</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTestsObj.map(test => (
                          <tr key={test.id}>
                            <td>{test.category}</td>
                            <td><strong>{test.name}</strong></td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control-desktop table-result-input"
                                value={resultValues[test.id] || ''}
                                placeholder="Value"
                                onChange={e => setResultValues({ ...resultValues, [test.id]: e.target.value })}
                              />
                            </td>
                            <td>{test.unit}</td>
                            <td>{test.normalRange}</td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control-desktop table-specimen-input"
                                value={specimenValues[test.id] || ''}
                                onChange={e => setSpecimenValues({ ...specimenValues, [test.id]: e.target.value })}
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control-desktop table-remarks-input"
                                value={remarksValues[test.id] || ''}
                                placeholder="Remarks"
                                onChange={e => setRemarksValues({ ...remarksValues, [test.id]: e.target.value })}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="result-bottom-action-bar">
                <div className="result-summary-left-group">
                  <div className="res-summary-item">
                    <label>No Of Tests</label>
                    <input type="text" className="summary-input" readOnly value={selectedTestIds.length} />
                  </div>

                  <div className="res-summary-item">
                    <label>Total Cost</label>
                    <input type="text" className="summary-input" readOnly value={subtotal.toFixed(2)} />
                  </div>

                  <div className="res-summary-item balance-group">
                    <label className="green-label">Balance</label>
                    <input type="text" className="summary-input" readOnly value={balance.toFixed(2)} />
                  </div>
                </div>

                <div className="result-btn-right-group">
                  <button className="btn-result-action" onClick={handleSaveLabEntry}>
                    SAVE
                  </button>
                  <button className="btn-result-action" onClick={() => setActiveTab('print-result')}>
                    PRINT
                  </button>
                  <button className="btn-result-action" onClick={() => navigate('/')}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Print Result */}
        {activeTab === 'print-result' && (
          <div className="tab-content-card card fade-in">
            <div className="card-header-bar">
              <div>
                <h3>Laboratory Diagnostic Test Report</h3>
                <p>Preview and print formal patient test result report.</p>
              </div>
              <button className="btn-print-action" onClick={handlePrint}>
                <Printer size={18} /> Print Report
              </button>
            </div>

            <div className="lab-report-sheet print-area">
              <div className="report-header">
                <h2>SHRI JANANI HOSPITAL & DIAGNOSTICS</h2>
                <p>123 Healthcare Boulevard, Medical Enclave | Phone: +91 98765 43210</p>
                <div className="report-badge">PATHOLOGY LABORATORY REPORT</div>
              </div>

              <div className="report-patient-info">
                <div className="info-col">
                  <p><strong>Patient Name:</strong> {patientTitle} {formPname || 'Rajesh Kumar'}</p>
                  <p><strong>Test No / PID:</strong> {resultTestNo} / PID-{formPid}</p>
                  <p><strong>Age / Gender:</strong> {formAge || '45 Y'} / {formGender}</p>
                </div>
                <div className="info-col">
                  <p><strong>Ref Doctor:</strong> {refBy}</p>
                  <p><strong>Sample Date:</strong> {testBillDate}</p>
                  <p><strong>Report Status:</strong> Final Verified</p>
                </div>
              </div>

              <table className="report-table">
                <thead>
                  <tr>
                    <th>TEST NAME</th>
                    <th>RESULT VALUE</th>
                    <th>UNIT</th>
                    <th>REFERENCE RANGE</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTestsObj.map(test => {
                    const val = resultValues[test.id] || '8.5';
                    const rem = remarksValues[test.id] || 'Normal';
                    return (
                      <tr key={test.id}>
                        <td><strong>{test.name}</strong></td>
                        <td><strong>{val}</strong></td>
                        <td>{test.unit}</td>
                        <td>{test.normalRange}</td>
                        <td>{rem}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="report-footer-sign">
                <div className="sign-box">
                  <p><strong>Lab Technician</strong></p>
                  <span>Verified Sample</span>
                </div>
                <div className="sign-box text-right">
                  <p><strong>Dr. Aris Thorne, M.D.</strong></p>
                  <span>Consultant Pathologist</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: BILL PRINT (BILL PRINT IMAGE UI)    */}
        {/* ========================================== */}
        {activeTab === 'bill-print' && (
          <div className="bill-print-desktop-window card fade-in">
            <div className="dialog-header">
              <div className="dialog-header-left">
                <Receipt size={16} />
                <span>Bill Print</span>
              </div>
              <div className="dialog-window-controls">
                <span className="ctrl-btn">-</span>
                <span className="ctrl-btn">□</span>
                <button className="window-close-red" onClick={() => navigate('/')}>X</button>
              </div>
            </div>

            <div className="dialog-body">
              <div className="dialog-inner-card">
                <button className="inner-close-red" onClick={() => navigate('/')}>X</button>
                <h2 className="bill-print-banner">BILL PRINT</h2>

                <div className="dialog-fields-grid">
                  <div className="dialog-field-row">
                    <label className="dialog-label">BILL NO</label>
                    <div className="billno-group">
                      <input 
                        type="text" 
                        className="form-control-desktop billno-input"
                        value={billPrintNo}
                        onChange={e => setBillPrintNo(e.target.value)}
                      />
                      <button className="btn-bill-view-red" onClick={() => setShowBillPreviewSheet(true)}>
                        BILL VIEW
                      </button>
                    </div>
                  </div>

                  <div className="dialog-field-row">
                    <label className="dialog-label">PRINT DESIGN</label>
                    <select 
                      className="form-control-desktop print-design-select"
                      value={printDesign}
                      onChange={e => setPrintDesign(e.target.value)}
                    >
                      <option value="BILLDESIGN-2-A5-Mode">BILLDESIGN-2-A5-Mode</option>
                      <option value="BILLDESIGN-1-A4-Mode">BILLDESIGN-1-A4-Mode</option>
                      <option value="THERMAL-RECEIPT-Mode">THERMAL-RECEIPT-Mode</option>
                    </select>
                  </div>
                </div>

                <div className="dialog-buttons-stack">
                  <div className="three-btn-row">
                    <button className="btn-dialog-action" onClick={() => setShowBillPreviewSheet(true)}>
                      PREVIEW
                    </button>
                    <button className="btn-dialog-action" onClick={handlePrint}>
                      PRINT
                    </button>
                    <button className="btn-dialog-action" onClick={() => navigate('/')}>
                      CANCEL
                    </button>
                  </div>

                  <button className="btn-dialog-action full-width-btn" onClick={handlePrint}>
                    <FileText size={16} /> CONVER TO PDF
                  </button>
                </div>

                <div className="dialog-options-row">
                  <div className="letterhead-checkbox-group">
                    <span className="green-option-label">WITH LETTER HEAD</span>
                    <input 
                      type="checkbox" 
                      checked={withLetterHead} 
                      onChange={e => {
                        setWithLetterHead(e.target.checked);
                        if (e.target.checked) setLetterheadCounter(prev => prev + 1);
                      }}
                    />
                    <input type="text" className="counter-box-mini" readOnly value={letterheadCounter} />
                  </div>
                </div>
              </div>
            </div>

            {showBillPreviewSheet && (
              <div className="bill-preview-modal-area">
                <div className="card-header-bar">
                  <h4>Preview Mode: {printDesign}</h4>
                  <button className="btn-print-action" onClick={handlePrint}>
                    <Printer size={16} /> Print Official Bill
                  </button>
                </div>

                <div className="lab-bill-sheet print-area">
                  {withLetterHead && (
                    <div className="letterhead-top-banner">
                      <h1>SHRI JANANI MULTISPECIALITY HOSPITAL</h1>
                      <p>123 Healthcare Boulevard, Main City | ISO 9001:2015 | Reg: TN-LAB-88412</p>
                    </div>
                  )}

                  <div className="bill-header">
                    <h2>KUMARAN SOFT SOLUTION DIAGNOSTICS</h2>
                    <p>Lab Cash Receipt & Tax Invoice</p>
                    <div className="invoice-no">Bill #: {billPrintNo} ({activeRecord?.labId || 'LAB-2026-001'})</div>
                  </div>

                  <div className="bill-meta-grid">
                    <div><strong>Patient Name:</strong> {patientTitle} {formPname || 'Rajesh Kumar'}</div>
                    <div><strong>Ref Doctor:</strong> {refBy}</div>
                    <div><strong>Date:</strong> {testBillDate}</div>
                    <div><strong>City / Lab:</strong> {formCity || 'Gobichettipalayam'} ({labHospital})</div>
                  </div>

                  <table className="bill-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Test Description</th>
                        <th className="text-right">Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTestsObj.map((test, index) => (
                        <tr key={test.id}>
                          <td>{index + 1}</td>
                          <td>{test.name}</td>
                          <td className="text-right">₹{test.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bill-summary-totals">
                    <div className="bill-row"><span>Subtotal:</span> ₹{subtotal.toFixed(2)}</div>
                    <div className="bill-row"><span>Discount:</span> ₹{discount.toFixed(2)}</div>
                    <div className="bill-row grand"><span>Total Amount:</span> ₹{netAmount.toFixed(2)}</div>
                    <div className="bill-row"><span>Paid ({paymentMode}):</span> ₹{(paidAmount || netAmount).toFixed(2)}</div>
                    <div className="bill-row"><span>Balance Due:</span> ₹{Math.max(0, netAmount - (paidAmount || netAmount)).toFixed(2)}</div>
                  </div>

                  <div className="bill-footer">
                    <p>Thank you for choosing Shri Janani Hospital Diagnostics!</p>
                    <span>Authorized Signatory</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MASTER DROPDOWN SUB-MODAL 2: TEST NAME ENTRY (EXACT USER SCREENSHOT UI)  */}
      {/* ========================================================================= */}
      {showTestNameModal && (
        <div className="lab-modal-overlay">
          <div className="test-name-modal-dialog card fade-in">
            <div className="test-group-dialog-header">
              <div className="test-group-title-left">
                <TestTube size={16} />
                <span>Test Name Entry</span>
              </div>
              <button className="window-close-red" onClick={() => setShowTestNameModal(false)}>X</button>
            </div>

            <div className="test-name-dialog-body">
              <div className="test-group-banner-row">
                <div className="flex gap-1 items-center">
                  <input type="text" className="tg-id-box" value={tnId} onChange={e => setTnId(e.target.value)} />
                  <input type="text" className="tg-id-box" value={tnSecondaryId} onChange={e => setTnSecondaryId(e.target.value)} />
                </div>
                <h2 className="tg-blue-title">TEST NAME ENTRY</h2>
                <button className="tg-red-x-btn" onClick={() => setShowTestNameModal(false)}>X</button>
              </div>

              {/* Form Controls Section */}
              <div className="tn-form-grid">
                <div className="tn-row">
                  <div className="tn-col">
                    <label className="tn-label">Test Group</label>
                    <select 
                      className="tn-select"
                      value={tnTestGroup}
                      onChange={e => setTnTestGroup(e.target.value)}
                    >
                      {testGroupsGrid.map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="tn-col flex-items-center gap-1">
                    <label className="tn-label-inline">SubHead</label>
                    <input 
                      type="checkbox" 
                      checked={tnSubHeadChecked} 
                      onChange={e => setTnSubHeadChecked(e.target.checked)} 
                    />
                    <input 
                      type="text" 
                      className="tn-mini-input" 
                      value={tnSubHeadVal}
                      onChange={e => setTnSubHeadVal(e.target.value)}
                    />
                  </div>

                  <div className="tn-col">
                    <label className="tn-label">Specimen</label>
                    <select 
                      className="tn-select"
                      value={tnSpecimen}
                      onChange={e => setTnSpecimen(e.target.value)}
                    >
                      <option value="">-- Select Specimen --</option>
                      <option value="EDTA Blood">EDTA Blood</option>
                      <option value="Whole Blood">Whole Blood</option>
                      <option value="Serum">Serum</option>
                      <option value="Plasma">Plasma</option>
                      <option value="Urine">Urine</option>
                    </select>
                  </div>
                </div>

                <div className="tn-row">
                  <div className="tn-col-wide flex gap-2 items-center">
                    <label className="tn-label">Test Name</label>
                    <input 
                      type="text" 
                      className="tn-input-flex"
                      value={tnTestName}
                      onChange={e => setTnTestName(e.target.value)}
                    />
                    <button className="tn-btn-browse">...</button>
                  </div>

                  <div className="tn-col">
                    <label className="tn-label">Unit</label>
                    <select 
                      className="tn-select"
                      value={tnUnit}
                      onChange={e => setTnUnit(e.target.value)}
                    >
                      <option value="%">%</option>
                      <option value="gm/dl">gm/dl</option>
                      <option value="10^3/uL">10^3/uL</option>
                      <option value="mg/dL">mg/dL</option>
                      <option value="µIU/mL">µIU/mL</option>
                      <option value="U/L">U/L</option>
                    </select>
                  </div>
                </div>

                {/* Middle Card Layout (Cost, Ref Value, Min/Max, Method, Remarks) */}
                <div className="tn-middle-card">
                  <div className="tn-mid-left">
                    <div className="tn-field-item">
                      <label className="tn-label">Cost</label>
                      <input 
                        type="text" 
                        className="tn-input-cost"
                        value={tnCost}
                        onChange={e => setTnCost(e.target.value)}
                      />
                    </div>

                    <div className="tn-field-item flex-col align-start">
                      <label className="tn-label">Ref.Value</label>
                      <textarea 
                        className="tn-textarea-ref"
                        rows={2}
                        value={tnRefValue}
                        onChange={e => setTnRefValue(e.target.value)}
                      />
                      <button className="tn-btn-browse mt-1">...</button>
                    </div>
                  </div>

                  <div className="tn-mid-right">
                    <div className="minmax-row">
                      <div className="minmax-group">
                        <label className="tn-label-sm">Male Min</label>
                        <input 
                          type="text" 
                          className="tn-input-small"
                          value={tnMaleMin}
                          onChange={e => setTnMaleMin(e.target.value)}
                        />
                      </div>
                      <div className="minmax-group">
                        <label className="tn-label-sm">Male Max</label>
                        <input 
                          type="text" 
                          className="tn-input-small"
                          value={tnMaleMax}
                          onChange={e => setTnMaleMax(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="minmax-row">
                      <div className="minmax-group">
                        <label className="tn-label-sm">Female Min</label>
                        <input 
                          type="text" 
                          className="tn-input-small"
                          value={tnFemaleMin}
                          onChange={e => setTnFemaleMin(e.target.value)}
                        />
                      </div>
                      <div className="minmax-group">
                        <label className="tn-label-sm">Female Max</label>
                        <input 
                          type="text" 
                          className="tn-input-small"
                          value={tnFemaleMax}
                          onChange={e => setTnFemaleMax(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="tn-mid-field-row">
                      <label className="tn-label">Method</label>
                      <input 
                        type="text" 
                        className="tn-input-wide"
                        value={tnMethod}
                        onChange={e => setTnMethod(e.target.value)}
                      />
                    </div>

                    <div className="tn-mid-field-row">
                      <label className="tn-label">Remarks</label>
                      <div className="flex gap-1 items-center flex-1">
                        <input 
                          type="text" 
                          className="tn-input-wide"
                          value={tnRemarks}
                          onChange={e => setTnRemarks(e.target.value)}
                        />
                        <button className="tn-btn-browse">...</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table Grid */}
              <div className="tn-table-wrapper">
                <table className="tn-data-table">
                  <thead>
                    <tr>
                      <th>Groupname</th>
                      <th>Torderno</th>
                      <th>Testname</th>
                      <th>SHead</th>
                      <th>Speciman</th>
                      <th>Uname</th>
                      <th>Malenormal</th>
                      <th>Femalenormal</th>
                      <th>Refvalue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testNameGrid.map(tn => {
                      const isSelected = selectedTestNameId === tn.id;
                      return (
                        <tr 
                          key={tn.id}
                          className={isSelected ? 'tn-selected-row' : ''}
                          onClick={() => handleSelectTestNameRow(tn)}
                        >
                          <td><strong>{tn.groupName}</strong></td>
                          <td>{tn.orderNo}</td>
                          <td><strong>{tn.testName}</strong></td>
                          <td>{tn.subHead}</td>
                          <td>{tn.specimen || '-'}</td>
                          <td>{tn.unit}</td>
                          <td>{tn.maleNormal || '-'}</td>
                          <td>{tn.femaleNormal || '-'}</td>
                          <td>{tn.refValue}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons Bar */}
              <div className="tg-action-bar">
                <div className="tg-left-buttons">
                  <button className="tg-btn-action" onClick={handleSaveTestNameRecord}>
                    Save
                  </button>
                  <button className="tg-btn-action" onClick={handleSaveTestNameRecord}>
                    Edit
                  </button>
                  <button className="tg-btn-action" onClick={handleDeleteTestNameRecord}>
                    Delete
                  </button>
                  <button className="tg-btn-action" onClick={() => setShowTestNameModal(false)}>
                    Close
                  </button>
                  <button className="tg-btn-action" onClick={handleRefreshTestNameForm}>
                    Refresh
                  </button>
                </div>

                <button className="tg-btn-action tg-change-order-btn" onClick={handleChangeTestOrder}>
                  Change<br />Test Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MASTER DROPDOWN SUB-MODAL 3: DOCTOR LIST --- */}
      {showDoctorListModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card large">
            <div className="modal-header">
              <h3><Stethoscope size={20} /> Referring Doctor Master List</h3>
              <button className="close-btn" onClick={() => setShowDoctorListModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form className="add-master-form" onSubmit={handleAddDoctor}>
                <h4>Add New Referring Doctor</h4>
                <div className="form-grid-3col">
                  <input 
                    type="text" 
                    placeholder="Doctor Name (e.g. Dr. A. Kumar)" 
                    className="form-control" 
                    value={newDocName} 
                    onChange={e => setNewDocName(e.target.value)}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Qualification (e.g. M.D. Pathology)" 
                    className="form-control" 
                    value={newDocQual} 
                    onChange={e => setNewDocQual(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Hospital / Clinic Name" 
                    className="form-control" 
                    value={newDocHosp} 
                    onChange={e => setNewDocHosp(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Mobile / Contact No" 
                    className="form-control" 
                    value={newDocPhone} 
                    onChange={e => setNewDocPhone(e.target.value)}
                  />
                  <button type="submit" className="btn-add-test">
                    <Plus size={16} /> Add Doctor
                  </button>
                </div>
              </form>

              <table className="master-catalog-table">
                <thead>
                  <tr>
                    <th>Doc ID</th>
                    <th>Doctor Name</th>
                    <th>Qualification</th>
                    <th>Hospital / Clinic</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorsList.map(doc => (
                    <tr key={doc.id}>
                      <td>{doc.id}</td>
                      <td><strong>{doc.name}</strong></td>
                      <td>{doc.qualification}</td>
                      <td>{doc.hospital}</td>
                      <td>{doc.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MASTER DROPDOWN SUB-MODAL 4: PRICE LIST --- */}
      {showPriceListModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card large">
            <div className="modal-header">
              <h3><Tag size={20} /> Lab Test Price List Master</h3>
              <button className="close-btn" onClick={() => setShowPriceListModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm color-text-light mb-0">Full diagnostic test catalog and pricing list.</p>
                <button className="btn-desktop btn-export-excel" onClick={handleExportExcel}>
                  <FileSpreadsheet size={16} /> Export Price List
                </button>
              </div>

              <table className="master-catalog-table">
                <thead>
                  <tr>
                    <th>Test Code</th>
                    <th>Test Name</th>
                    <th>Category</th>
                    <th>Test Type</th>
                    <th>Standard Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {masterTests.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.id}</strong></td>
                      <td>{t.name}</td>
                      <td>{t.category}</td>
                      <td>{t.ttype || 'Single'}</td>
                      <td><strong className="text-blue-700">₹{t.price.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPANY DROPDOWN SUB-MODAL 1: CREATE COMPANY --- */}
      {showCreateCompanyModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card">
            <div className="modal-header">
              <h3><Building2 size={20} /> Create / Edit Company Profile</h3>
              <button className="close-btn" onClick={() => setShowCreateCompanyModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); alert('Company Details Saved Successfully!'); setShowCreateCompanyModal(false); }}>
                <div className="form-group mb-3">
                  <label className="form-label">Company / Lab Name</label>
                  <input type="text" className="form-control" value={compName} onChange={e => setCompName(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" value={compAddress} onChange={e => setCompAddress(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Phone / Contact No</label>
                  <input type="text" className="form-control" value={compPhone} onChange={e => setCompPhone(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">GSTIN / Lab License No</label>
                  <input type="text" className="form-control" value={compGstin} onChange={e => setCompGstin(e.target.value)} />
                </div>
                <button type="submit" className="btn-add-test w-full">Save Company Profile</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPANY DROPDOWN SUB-MODAL 2: CREATE USER --- */}
      {showCreateUserModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card">
            <div className="modal-header">
              <h3><UserCheck size={20} /> Create User Account</h3>
              <button className="close-btn" onClick={() => setShowCreateUserModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddUser} className="add-master-form">
                <h4>Add New User</h4>
                <div className="form-group mb-2">
                  <label className="form-label">User Name</label>
                  <input type="text" className="form-control" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label">Role</label>
                  <select className="form-control" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Consultant Pathologist">Consultant Pathologist</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-add-test w-full">Create User</button>
              </form>

              <h4 className="mt-4 mb-2 font-bold text-sm">Existing Users</h4>
              <table className="master-catalog-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u, i) => (
                    <tr key={i}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPANY DROPDOWN SUB-MODAL 3: RESTORE DATABASE --- */}
      {showRestoreModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card">
            <div className="modal-header">
              <h3><HardDriveUpload size={20} /> Restore System Backup</h3>
              <button className="close-btn" onClick={() => setShowRestoreModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p className="mb-4 text-sm color-text-light">Select a previously saved backup file (.json) to restore system lab data and patient records.</p>
              <label htmlFor="restore-file-input" className="btn-add-test text-center cursor-pointer block p-3">
                <Upload size={16} /> Choose Backup File (.json)
              </label>
              <input 
                id="restore-file-input" 
                type="file" 
                accept=".json" 
                style={{ display: 'none' }} 
                onChange={handleRestoreFile} 
              />
            </div>
          </div>
        </div>
      )}

      {/* --- COMPANY DROPDOWN SUB-MODAL 4: REPORT MARGIN --- */}
      {showReportMarginModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card">
            <div className="modal-header">
              <h3><Sliders size={20} /> Report Print Margin Setup</h3>
              <button className="close-btn" onClick={() => setShowReportMarginModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); alert('Report Margins Saved!'); setShowReportMarginModal(false); }}>
                <div className="form-grid-2col mb-4">
                  <div className="form-group">
                    <label className="form-label">Top Margin (mm)</label>
                    <input type="number" className="form-control" value={topMargin} onChange={e => setTopMargin(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bottom Margin (mm)</label>
                    <input type="number" className="form-control" value={bottomMargin} onChange={e => setBottomMargin(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Left Margin (mm)</label>
                    <input type="number" className="form-control" value={leftMargin} onChange={e => setLeftMargin(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Right Margin (mm)</label>
                    <input type="number" className="form-control" value={rightMargin} onChange={e => setRightMargin(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn-add-test w-full">Save Print Margins</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPANY DROPDOWN SUB-MODAL 5: SETTINGS --- */}
      {showSettingsModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card">
            <div className="modal-header">
              <h3><SettingsIcon size={20} /> Module Settings</h3>
              <button className="close-btn" onClick={() => setShowSettingsModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); alert('System Settings Saved!'); setShowSettingsModal(false); }}>
                <div className="form-group mb-3 flex items-center justify-between">
                  <label className="form-label mb-0">Automatic Daily Backup</label>
                  <input type="checkbox" checked={autoBackupEnabled} onChange={e => setAutoBackupEnabled(e.target.checked)} />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Default Paper Format</label>
                  <select className="form-control" value={defaultPrintFormat} onChange={e => setDefaultPrintFormat(e.target.value)}>
                    <option value="A5">A5 Half Sheet</option>
                    <option value="A4">A4 Full Sheet</option>
                    <option value="Thermal">Thermal Receipt</option>
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">Header Theme Color</label>
                  <input type="color" className="form-control h-10 p-1" value={headerTitleColor} onChange={e => setHeaderTitleColor(e.target.value)} />
                </div>
                <button type="submit" className="btn-add-test w-full">Save Settings</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: SEARCH RECORDS --- */}
      {showSearchModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card large">
            <div className="modal-header">
              <h3><SearchIcon size={20} /> Search Lab Records & Patient Test History</h3>
              <button className="close-btn" onClick={() => setShowSearchModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                className="form-control search-large-input" 
                placeholder="Search by UHID, Patient Name, Lab ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />

              <table className="search-results-table">
                <thead>
                  <tr>
                    <th>Lab ID</th>
                    <th>UHID</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Tests Count</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {labRecords
                    .filter(r => 
                      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      r.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      r.labId.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(r => (
                      <tr key={r.labId}>
                        <td><strong>{r.labId}</strong></td>
                        <td>{r.uhid}</td>
                        <td>{r.patientName}</td>
                        <td>{r.date}</td>
                        <td>{r.tests.length} Tests</td>
                        <td>₹{r.totalAmount}</td>
                        <td><span className="badge-status normal">{r.status}</span></td>
                        <td>
                          <button 
                            className="btn-icon-action"
                            onClick={() => {
                              setFormPname(r.patientName);
                              setShowSearchModal(false);
                              setActiveTab('print-result');
                            }}
                          >
                            <Eye size={16} /> View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;
