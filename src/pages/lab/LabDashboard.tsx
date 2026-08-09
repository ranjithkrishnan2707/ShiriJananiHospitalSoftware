import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const { patients, labRequests, markLabComplete, doctors, openDoctorListModal } = useHospital();

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
  const [showPreviousReportsModal, setShowPreviousReportsModal] = useState(false);
  // --- MASTER DROPDOWN STATE ---
  const [showMasterDropdown, setShowMasterDropdown] = useState(false);
  const [showTestNameModal, setShowTestNameModal] = useState(false);
  const [showPriceListModal, setShowPriceListModal] = useState(false);

  // Top Navbar Reports Dropdown State
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);

  // TestWise Report Window State (Matching Screenshot)
  const [testWiseFromDate, setTestWiseFromDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [testWiseToDate, setTestWiseToDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [testWiseReportGroup, setTestWiseReportGroup] = useState<string>('ALL GROUPS');
  const [testWiseReportTest, setTestWiseReportTest] = useState<string>('ALL TESTS');
  const [clickedTestWiseOk, setClickedTestWiseOk] = useState<boolean>(true);

  // Bill View Reports Window State (Matching Screenshot)
  const [bvFilterStatus, setBvFilterStatus] = useState<'ALL' | 'Pending' | 'Completed'>('ALL');
  const [bvFromDate, setBvFromDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bvToDate, setBvToDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bvDoctorFilter, setBvDoctorFilter] = useState<string>('');
  const [bvLabFilter, setBvLabFilter] = useState<string>('');
  const [bvTestTypeFilter, setBvTestTypeFilter] = useState<string>('');
  const [bvCommissionPct, setBvCommissionPct] = useState<string>('');
  const [bvCommissionAmt, setBvCommissionAmt] = useState<string>('');

  const DEFAULT_BILL_REPORTS = useMemo(() => [
    { testNo: '3643', testDate: '07/08/2026', patientName: 'MISS.DURGA D/O MR. SAMINATHAN', age: '25yrs', gender: 'Female', refDoc: 'DR.SRI JANANI,MD.,OG.,', cost: 410.00, discount: 0, total: 410.00, advance: 410.00, balance: 0, expenses: 0, status: 'Completed' },
    { testNo: '3644', testDate: '07/08/2026', patientName: 'MRS.DHARSHINI W/O GOKUL', age: '21yrs', gender: 'Female', refDoc: 'DR.SRI JANANI,MD.,OG.,', cost: 500.00, discount: 0, total: 500.00, advance: 500.00, balance: 0, expenses: 0, status: 'Completed' },
    { testNo: '3645', testDate: '07/08/2026', patientName: 'MR.YASAR ARAFATH H/O AYESHA', age: '22yrs', gender: 'Male', refDoc: 'DR.SRI JANANI,MD.,OG.,', cost: 475.00, discount: 0, total: 475.00, advance: 475.00, balance: 0, expenses: 0, status: 'Completed' },
    { testNo: '3646', testDate: '07/08/2026', patientName: 'MRS.YOGALAXMI W/O MANI', age: '52yrs', gender: 'Female', refDoc: 'DR.SRI JANANI,MD.,OG.,', cost: 735.00, discount: 0, total: 735.00, advance: 735.00, balance: 0, expenses: 0, status: 'Completed' },
    { testNo: '3647', testDate: '07/08/2026', patientName: 'MRS.SARULATHA W/O VIJAY', age: '24yrs', gender: 'Female', refDoc: 'DR.SRI JANANI,MD.,OG.,', cost: 100.00, discount: 0, total: 100.00, advance: 100.00, balance: 0, expenses: 0, status: 'Completed' }
  ], []);

  // Price List Filters & View State
  const [priceListGroupFilter, setPriceListGroupFilter] = useState<string>('ALL GROUPS');
  const [priceListNameFilter, setPriceListNameFilter] = useState<string>('');
  const [hasClickedShowPriceList, setHasClickedShowPriceList] = useState<boolean>(false);
  const [showPriceListPreview, setShowPriceListPreview] = useState<boolean>(false);

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

  const allMasterTestItems = useMemo(() => {
    const list: {
      id: string;
      groupName: string;
      testName: string;
      unit: string;
      specimen: string;
      cost: number;
      refValue: string;
    }[] = [];

    if (testNameGrid) {
      testNameGrid.forEach(t => {
        list.push({
          id: t.id,
          groupName: t.groupName,
          testName: t.testName,
          unit: t.unit || '-',
          specimen: t.specimen || 'EDTA Blood / Serum',
          cost: t.cost,
          refValue: t.refValue || t.maleNormal || 'Normal'
        });
      });
    }

    if (masterTests) {
      masterTests.forEach(m => {
        const exists = list.some(l => l.testName.toLowerCase() === m.name.toLowerCase());
        if (!exists) {
          list.push({
            id: m.id,
            groupName: m.category.toUpperCase(),
            testName: m.name,
            unit: m.unit || '-',
            specimen: m.defaultSpecimen || 'Blood / Serum',
            cost: m.price,
            refValue: m.normalRange || 'Normal'
          });
        }
      });
    }

    return list;
  }, [testNameGrid, masterTests]);

  const filteredPriceListItems = useMemo(() => {
    return allMasterTestItems.filter(item => {
      const matchesGroup = priceListGroupFilter === 'ALL GROUPS' || 
        item.groupName.toUpperCase() === priceListGroupFilter.toUpperCase();
      const matchesName = !priceListNameFilter.trim() || 
        item.testName.toLowerCase().includes(priceListNameFilter.toLowerCase().trim()) ||
        item.groupName.toLowerCase().includes(priceListNameFilter.toLowerCase().trim());
      return matchesGroup && matchesName;
    });
  }, [allMasterTestItems, priceListGroupFilter, priceListNameFilter]);

  const handleExportPriceListExcel = (itemsToExport: any[]) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      alert('No test price items available to export!');
      return;
    }
    const headers = ['S.No', 'Test Code', 'Test Group', 'Test Name', 'Unit', 'Specimen', 'Reference Value', 'Price (INR)'];
    const rows = itemsToExport.map((item, index) => [
      index + 1,
      `"${item.id}"`,
      `"${item.groupName}"`,
      `"${item.testName}"`,
      `"${item.unit}"`,
      `"${item.specimen}"`,
      `"${(item.refValue || '').replace(/"/g, '""')}"`,
      item.cost.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Test_Price_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Patient Name Dropdown State for Lab
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showTestEntryNameDropdown, setShowTestEntryNameDropdown] = useState(false);
  const labNameDropdownRef = useRef<HTMLDivElement>(null);
  const testEntryNameDropdownRef = useRef<HTMLDivElement>(null);

  const previousPatientsForLab = useMemo(() => {
    const map = new Map<string, any>();
    if (patients) {
      patients.forEach(p => {
        if (p.name) {
          map.set(p.name.toLowerCase().trim(), {
            uhid: p.uhid,
            patientId: p.patientId,
            name: p.name,
            age: p.age,
            gender: p.sex,
            phone: p.phone,
            contact2: (p as any).secondaryPhone || '',
            address: (p as any).address || '',
            city: (p as any).city || '',
            email: (p as any).email || '',
            doc: p.preferredDoctor
          });
        }
      });
    }
    if (patientGrid) {
      patientGrid.forEach(pg => {
        if (pg.pname) {
          map.set(pg.pname.toLowerCase().trim(), {
            uhid: '',
            patientId: pg.pid,
            name: pg.pname,
            age: pg.age,
            gender: pg.gender,
            phone: pg.contact1,
            contact2: pg.contact2 || '',
            address: pg.address || '',
            city: pg.city || '',
            email: pg.email || '',
            doc: ''
          });
        }
      });
    }
    return Array.from(map.values());
  }, [patients, patientGrid]);

  const filteredPreviousPatientsForLab = useMemo(() => {
    if (!formPname.trim()) return previousPatientsForLab;
    const query = formPname.toLowerCase().trim();
    return previousPatientsForLab.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.uhid && p.uhid.toLowerCase().includes(query)) ||
      (p.patientId && p.patientId.toLowerCase().includes(query)) ||
      (p.phone && p.phone.includes(query))
    );
  }, [previousPatientsForLab, formPname]);

  const handleSelectPatientFromDropdown = (p: any) => {
    setFormPname(p.name);
    const foundInGrid = patientGrid.find(pg => pg.pname.toLowerCase() === p.name.toLowerCase() || pg.pid === p.patientId);
    if (foundInGrid) {
      handleSelectPatientRow(foundInGrid);
    } else {
      if (p.patientId) setFormPid(p.patientId);
      if (p.age) setFormAge(p.age.replace(/\D/g, ''));
      if (p.gender) setFormGender(p.gender);
      if (p.phone) setFormContact1(p.phone);
      if (p.contact2) setFormContact2(p.contact2);
      if (p.address) setFormAddress(p.address);
      if (p.city) setFormCity(p.city);
      if (p.email) setFormEmail(p.email);
    }
    setShowNameDropdown(false);
    setShowTestEntryNameDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (labNameDropdownRef.current && !labNameDropdownRef.current.contains(event.target as Node)) {
        setShowNameDropdown(false);
      }
      if (testEntryNameDropdownRef.current && !testEntryNameDropdownRef.current.contains(event.target as Node)) {
        setShowTestEntryNameDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const [withLetterHead, setWithLetterHead] = useState<boolean>(true);
  const [letterheadCounter, setLetterheadCounter] = useState<number>(0);
  const [showBillPreviewSheet, setShowBillPreviewSheet] = useState<boolean>(false);

  // Selected Tests for Current Patient
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);

  const selectedTestsObj = useMemo(() => {
    return allMasterTestItems.filter(t => selectedTestIds.includes(t.id));
  }, [allMasterTestItems, selectedTestIds]);

  const groupedSelectedTests = useMemo(() => {
    const map = new Map<string, typeof selectedTestsObj>();
    selectedTestsObj.forEach(test => {
      const grp = (test.groupName || test.category || 'GENERAL').toUpperCase();
      if (!map.has(grp)) {
        map.set(grp, []);
      }
      map.get(grp)!.push(test);
    });
    return Array.from(map.entries()).map(([groupName, items]) => ({
      groupName,
      items
    }));
  }, [selectedTestsObj]);
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

  // Search Modal Tabs & Test-Wise Report State
  const [searchModalTab, setSearchModalTab] = useState<'patient-records' | 'test-wise-report'>('patient-records');
  const [testWiseGroupFilter, setTestWiseGroupFilter] = useState<string>('ALL GROUPS');
  const [testWiseTestFilter, setTestWiseTestFilter] = useState<string>('ALL TESTS');
  const [testWiseStatusFilter, setTestWiseStatusFilter] = useState<'ALL' | 'ABNORMAL' | 'NORMAL'>('ALL');
  const [testWiseSearchQuery, setTestWiseSearchQuery] = useState<string>('');

  const allTestWiseEntries = useMemo(() => {
    const entries: {
      labId: string;
      uhid: string;
      patientName: string;
      age: string;
      gender: string;
      phone: string;
      refDoctor: string;
      date: string;
      time: string;
      testId: string;
      testName: string;
      value: string;
      unit: string;
      normalRange: string;
      isAbnormal: boolean;
      specimen: string;
      remarks: string;
      groupName: string;
    }[] = [];

    labRecords.forEach(record => {
      if (record.results && record.results.length > 0) {
        record.results.forEach(res => {
          const master = allMasterTestItems.find(m => m.id === res.testId || m.testName.toLowerCase() === res.testName.toLowerCase());
          entries.push({
            labId: record.labId,
            uhid: record.uhid,
            patientName: record.patientName,
            age: record.age,
            gender: record.gender,
            phone: record.phone,
            refDoctor: record.refDoctor,
            date: record.date,
            time: record.time,
            testId: res.testId,
            testName: res.testName,
            unit: res.unit,
            normalRange: res.normalRange,
            isAbnormal: res.isAbnormal,
            specimen: res.specimen || 'Blood',
            remarks: res.remarks || '',
            value: res.value,
            groupName: master ? master.groupName : 'GENERAL'
          });
        });
      }
    });

    return entries;
  }, [labRecords, allMasterTestItems]);

  const filteredTestWiseEntries = useMemo(() => {
    return allTestWiseEntries.filter(entry => {
      // 1. Group Filter
      const matchesGroup = testWiseGroupFilter === 'ALL GROUPS' ||
        entry.groupName.toUpperCase() === testWiseGroupFilter.toUpperCase();

      // 2. Test Name Filter
      const matchesTest = testWiseTestFilter === 'ALL TESTS' ||
        entry.testName.toLowerCase() === testWiseTestFilter.toLowerCase();

      // 3. Status Filter
      const matchesStatus = testWiseStatusFilter === 'ALL' ||
        (testWiseStatusFilter === 'ABNORMAL' && entry.isAbnormal) ||
        (testWiseStatusFilter === 'NORMAL' && !entry.isAbnormal);

      // 4. Text Search
      const query = testWiseSearchQuery.toLowerCase().trim();
      const matchesQuery = !query ||
        entry.patientName.toLowerCase().includes(query) ||
        entry.testName.toLowerCase().includes(query) ||
        entry.labId.toLowerCase().includes(query) ||
        entry.uhid.toLowerCase().includes(query) ||
        entry.value.toLowerCase().includes(query);

      return matchesGroup && matchesTest && matchesStatus && matchesQuery;
    });
  }, [allTestWiseEntries, testWiseGroupFilter, testWiseTestFilter, testWiseStatusFilter, testWiseSearchQuery]);

  const isGroupMatch = useCallback((entryGroup: string, targetGroup: string) => {
    if (!targetGroup || targetGroup === 'ALL GROUPS') return true;

    const grp1 = (entryGroup || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const grp2 = (targetGroup || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (grp1 === grp2) return true;
    if (grp1.includes(grp2) || grp2.includes(grp1)) return true;

    if (
      (grp1.includes('HAEMATOLOGY') || grp1.includes('HEMATOLOGY')) &&
      (grp2.includes('HAEMATOLOGY') || grp2.includes('HEMATOLOGY'))
    ) return true;

    if (
      (grp1.includes('BIO') || grp1.includes('CHEMISTRY')) &&
      (grp2.includes('BIO') || grp2.includes('CHEMISTRY'))
    ) return true;

    return false;
  }, []);

  const availableTestsForSelectedGroup = useMemo(() => {
    const masterMatching = allMasterTestItems
      .filter(t => isGroupMatch(t.groupName, testWiseReportGroup))
      .map(t => t.testName);

    const entriesMatching = allTestWiseEntries
      .filter(e => isGroupMatch(e.groupName, testWiseReportGroup))
      .map(e => e.testName);

    const combined = Array.from(new Set([...masterMatching, ...entriesMatching]));
    return combined.sort();
  }, [allMasterTestItems, allTestWiseEntries, testWiseReportGroup, isGroupMatch]);

  const testWiseReportFilteredList = useMemo(() => {
    return allTestWiseEntries.filter(entry => {
      if (testWiseFromDate && entry.date < testWiseFromDate) return false;
      if (testWiseToDate && entry.date > testWiseToDate) return false;

      if (testWiseReportGroup && testWiseReportGroup !== 'ALL GROUPS') {
        if (!isGroupMatch(entry.groupName, testWiseReportGroup) && !isGroupMatch(entry.testName, testWiseReportGroup)) {
          return false;
        }
      }

      if (testWiseReportTest && testWiseReportTest !== 'ALL TESTS') {
        const eTest = entry.testName.trim().toLowerCase();
        const tTest = testWiseReportTest.trim().toLowerCase();
        if (eTest !== tTest && !eTest.includes(tTest) && !tTest.includes(eTest)) {
          return false;
        }
      }

      return true;
    });
  }, [allTestWiseEntries, testWiseFromDate, testWiseToDate, testWiseReportGroup, testWiseReportTest, isGroupMatch]);

  const previousPatientReports = useMemo(() => {
    if (!formPname) return allTestWiseEntries;
    const nameQuery = formPname.toLowerCase().trim();
    const filtered = allTestWiseEntries.filter(entry =>
      entry.patientName.toLowerCase().trim().includes(nameQuery) ||
      nameQuery.includes(entry.patientName.toLowerCase().trim())
    );
    return filtered.length > 0 ? filtered : allTestWiseEntries;
  }, [allTestWiseEntries, formPname]);

  const handleOpenTestResultForPatient = useCallback((
    patientNameInput: string,
    testNoOrLabIdInput?: string,
    extraParams?: {
      age?: string;
      gender?: string;
      refDoctor?: string;
      uhid?: string;
      date?: string;
      testName?: string;
    }
  ) => {
    const qName = (patientNameInput || '').trim();
    const qId = (testNoOrLabIdInput || '').trim();

    // 1. Search in labRecords
    const matchedLabRecord = labRecords.find(r => 
      (qId && (r.labId.toLowerCase() === qId.toLowerCase() || r.uhid.toLowerCase() === qId.toLowerCase())) ||
      (qName && r.patientName.toLowerCase().includes(qName.toLowerCase())) ||
      (qName && qName.toLowerCase().includes(r.patientName.toLowerCase()))
    );

    // 2. Search in patients from HospitalContext
    const matchedContextPatient = patients.find(p =>
      (qId && (p.patientId.toLowerCase() === qId.toLowerCase() || p.uhid.toLowerCase() === qId.toLowerCase())) ||
      (qName && p.name.toLowerCase().includes(qName.toLowerCase()))
    );

    // 3. Search in patientGrid
    const matchedGridPatient = patientGrid.find(pg =>
      (qId && pg.pid.toLowerCase() === qId.toLowerCase()) ||
      (qName && pg.pname.toLowerCase().includes(qName.toLowerCase()))
    );

    // 4. Search in labRequests from HospitalContext
    const matchedLabReq = labRequests.find(lr =>
      (qId && (lr.id.toLowerCase() === qId.toLowerCase() || lr.uhid.toLowerCase() === qId.toLowerCase())) ||
      (qName && lr.patientName.toLowerCase().includes(qName.toLowerCase()))
    );

    // Determine display values - ALWAYS prioritize explicit inputs passed from the report row!
    const rawName = qName || matchedLabRecord?.patientName || matchedContextPatient?.name || matchedGridPatient?.pname || 'PATIENT';
    
    let title = 'Mr.';
    let nameWithoutTitle = rawName;
    const upperRaw = rawName.toUpperCase();
    if (upperRaw.startsWith('MR.')) {
      title = 'Mr.';
      nameWithoutTitle = rawName.substring(3).trim();
    } else if (upperRaw.startsWith('MRS.')) {
      title = 'Mrs.';
      nameWithoutTitle = rawName.substring(4).trim();
    } else if (upperRaw.startsWith('MISS.')) {
      title = 'Miss.';
      nameWithoutTitle = rawName.substring(5).trim();
    } else if (upperRaw.startsWith('MS.')) {
      title = 'Ms.';
      nameWithoutTitle = rawName.substring(3).trim();
    } else if (extraParams?.gender === 'Female' || matchedContextPatient?.sex === 'Female' || matchedGridPatient?.gender === 'Female') {
      title = 'Mrs.';
    }

    const ageVal = extraParams?.age || matchedLabRecord?.age || matchedContextPatient?.age || matchedGridPatient?.age || '28';
    const genderVal = extraParams?.gender || matchedLabRecord?.gender || matchedContextPatient?.sex || matchedGridPatient?.gender || 'Male';
    const refDocVal = extraParams?.refDoctor || matchedLabRecord?.refDoctor || matchedContextPatient?.preferredDoctor || 'DR.SRI JANANI,MD.,OG.,';
    
    // Test No: ALWAYS use exact qId passed from report row, or matched record labId
    const testNoVal = qId || matchedLabRecord?.labId || matchedContextPatient?.uhid || matchedContextPatient?.patientId || '3574';
    const pidVal = extraParams?.uhid || matchedLabRecord?.uhid || matchedContextPatient?.uhid || matchedContextPatient?.patientId || matchedGridPatient?.pid || qId || '3490';
    const reportDateVal = extraParams?.date || matchedLabRecord?.date || new Date().toISOString().split('T')[0];

    setPatientTitle(title);
    setFormPname(nameWithoutTitle);
    setFormAge(ageVal.replace(/\D/g, '') || '28');
    setFormGender(genderVal.toLowerCase().includes('female') ? 'Female' : 'Male');
    setRefBy(refDocVal);
    setResultTestNo(testNoVal);
    setFormPid(pidVal);
    setTestBillDate(reportDateVal);
    setResultReportDate(reportDateVal);

    // Find required tests for this patient / bill
    let reqIds: string[] = [];
    const initResults: { [key: string]: string } = {};
    const initSpecimens: { [key: string]: string } = {};
    const initRemarks: { [key: string]: string } = {};

    if (matchedLabRecord && matchedLabRecord.tests && matchedLabRecord.tests.length > 0) {
      reqIds = matchedLabRecord.tests.map(t => t.id);
      if (matchedLabRecord.results) {
        matchedLabRecord.results.forEach(res => {
          initResults[res.testId] = res.value;
          initSpecimens[res.testId] = res.specimen || '';
          initRemarks[res.testId] = res.remarks || '';
        });
      }
    } else if (matchedLabReq && matchedLabReq.tests) {
      const reqNames = matchedLabReq.tests.split(',').map(s => s.trim().toLowerCase());
      reqIds = allMasterTestItems
        .filter(m => reqNames.some(rn => m.testName.toLowerCase().includes(rn) || rn.includes(m.testName.toLowerCase())))
        .map(m => m.id);
    } else if (extraParams?.testName) {
      const tName = extraParams.testName.toLowerCase();
      const foundTest = allMasterTestItems.find(m => m.testName.toLowerCase().includes(tName) || tName.includes(m.testName.toLowerCase()));
      if (foundTest) {
        reqIds = [foundTest.id];
      }
    }

    // Fallback required tests if none matched specifically: assign first 5 master tests
    if (reqIds.length === 0) {
      reqIds = allMasterTestItems.slice(0, 5).map(m => m.id);
    }

    setSelectedTestIds(reqIds);
    setResultValues(initResults);
    setSpecimenValues(initSpecimens);
    setRemarksValues(initRemarks);

    setShowPreviousReportsModal(false);
    setShowSearchModal(false);
    setShowReportsDropdown(false);
    setActiveTab('test-result');
  }, [labRecords, patients, patientGrid, labRequests, allMasterTestItems]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const testNoParam = searchParams.get('testNo');
    const patientIdParam = searchParams.get('patientId') || searchParams.get('uhid');
    const patientNameParam = searchParams.get('patientName') || searchParams.get('pName');
    const ageParam = searchParams.get('age');
    const genderParam = searchParams.get('gender');
    const refDocParam = searchParams.get('refDoc') || searchParams.get('refDoctor');

    if (tabParam === 'test-result' || testNoParam || patientIdParam || patientNameParam) {
      handleOpenTestResultForPatient(patientNameParam || '', testNoParam || patientIdParam || '', {
        age: ageParam || undefined,
        gender: genderParam || undefined,
        refDoctor: refDocParam || undefined,
        uhid: patientIdParam || undefined
      });
    }
  }, [searchParams, handleOpenTestResultForPatient]);

  const filteredBillReports = useMemo(() => {
    return DEFAULT_BILL_REPORTS.filter(r => {
      if (bvFilterStatus !== 'ALL' && r.status !== bvFilterStatus) return false;
      if (bvDoctorFilter && r.refDoc !== bvDoctorFilter) return false;
      return true;
    });
  }, [DEFAULT_BILL_REPORTS, bvFilterStatus, bvDoctorFilter]);

  const bvCollectionTotal = useMemo(() => {
    return filteredBillReports.reduce((acc, r) => acc + r.total, 0);
  }, [filteredBillReports]);

  const bvBalanceTotal = useMemo(() => {
    return filteredBillReports.reduce((acc, r) => acc + r.balance, 0);
  }, [filteredBillReports]);

  const handleExportTestWiseExcel = (entries: any[]) => {
    if (!entries || entries.length === 0) {
      alert('No test-wise report entries available to export!');
      return;
    }
    const headers = ['S.No', 'Date & Time', 'Lab ID', 'UHID', 'Patient Name', 'Age/Gender', 'Test Group', 'Test Name', 'Result Value', 'Unit', 'Normal Range', 'Abnormal Flag', 'Ref Doctor'];
    const rows = entries.map((e, idx) => [
      idx + 1,
      `"${e.date} ${e.time}"`,
      `"${e.labId}"`,
      `"${e.uhid}"`,
      `"${e.patientName}"`,
      `"${e.age} / ${e.gender}"`,
      `"${e.groupName}"`,
      `"${e.testName}"`,
      `"${e.value}"`,
      `"${e.unit}"`,
      `"${(e.normalRange || '').replace(/"/g, '""')}"`,
      e.isAbnormal ? 'ABNORMAL' : 'NORMAL',
      `"${e.refDoctor}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,'
      + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lab_Test_Wise_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  const filteredTestsByGroup = useMemo(() => {
    if (selectedGroup === 'ALL GROUPS') {
      return allMasterTestItems;
    }

    const targetGroup = selectedGroup.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    return allMasterTestItems.filter(item => {
      const itemGroup = (item.groupName || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const itemName = (item.testName || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

      // 1. Direct group name match
      if (itemGroup === targetGroup) return true;

      // 2. Partial group name match (e.g. "COMPLETE BLOOD COUNT" vs "COMPLETE BLOOD COUNT (CBC)")
      if (itemGroup.includes(targetGroup) || targetGroup.includes(itemGroup)) return true;

      // 3. Category alias match (e.g. HAEMATOLOGY vs HEMATOLOGY, BIO CHEMISTRY vs BIOCHEMISTRY)
      if (
        (targetGroup.includes('HAEMATOLOGY') || targetGroup.includes('HEMATOLOGY')) &&
        (itemGroup.includes('HAEMATOLOGY') || itemGroup.includes('HEMATOLOGY'))
      ) return true;

      if (
        (targetGroup.includes('BIO') || targetGroup.includes('CHEMISTRY')) &&
        (itemGroup.includes('BIO') || itemGroup.includes('CHEMISTRY'))
      ) return true;

      // 4. Test name contains group name or vice versa
      if (itemName.includes(targetGroup) || targetGroup.includes(itemName)) return true;

      return false;
    });
  }, [allMasterTestItems, selectedGroup]);

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

  const subtotal = useMemo(() => {
    return selectedTestsObj.reduce((acc, curr) => acc + curr.cost, 0);
  }, [selectedTestsObj]);

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
      testName: t.testName,
      value: resultValues[t.id] || 'Pending',
      unit: t.unit,
      normalRange: t.refValue,
      isAbnormal: parseFloat(resultValues[t.id] || '0') > 110,
      specimen: specimenValues[t.id] || t.specimen || 'Blood',
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
    const reportEl = document.getElementById('official-lab-report-printable');
    if (!reportEl) {
      alert('Report not ready. Please open the Print Result tab first.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      alert('Popup blocked. Please allow popups for this site.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Lab Report - ${formPname || 'Patient'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #000; background: #fff; }

    /* Letterhead Banner */
    .sjh-letterhead-banner { border-bottom: 2px solid #D91B5C; padding-bottom: 6px; margin-bottom: 12px; }
    .sjh-top-accent-stripe { height: 8px; background: linear-gradient(90deg, #3B1E64 0%, #5C1D6D 60%, #D91B5C 100%); margin-bottom: 10px; border-radius: 2px; }
    .sjh-header-main-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .sjh-logo-left { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; }
    .sjh-header-center-text { text-align: center; flex: 1; }
    .sjh-title-main { font-size: 26px; font-weight: 900; color: #1A103C; margin: 0; letter-spacing: 0.5px; text-decoration: underline; font-family: 'Times New Roman', Times, serif; }
    .sjh-address-line { font-size: 12px; color: #D91B5C; font-weight: 700; margin: 3px 0 1px 0; }
    .sjh-phone-line { font-size: 13px; color: #000; font-weight: 800; margin: 0; }
    .sjh-logo-right { width: 65px; height: 70px; display: flex; align-items: center; justify-content: center; }
    .sjh-sub-banner-title { text-align: center; font-size: 16px; font-weight: 900; color: #0A1931; letter-spacing: 0.8px; margin: 8px 0 10px 0; text-transform: uppercase; }

    /* Demographics */
    .report-demographics-grid { display: flex; justify-content: space-between; align-items: flex-start; border: 1px solid #ccc; padding: 10px 14px; margin-bottom: 14px; font-size: 12px; line-height: 1.7; }
    .demo-left-column { flex: 1; }
    .demo-right-column { width: 260px; text-align: right; }
    .demo-row { display: grid; grid-template-columns: 100px 12px 1fr; align-items: center; margin-bottom: 2px; }
    .demo-label { font-weight: 700; }
    .demo-colon { font-weight: 700; }
    .demo-value { font-weight: 600; }
    .barcode-align-row { display: flex; justify-content: flex-end; margin-bottom: 6px; }
    .demo-right-column .demo-row { display: flex; justify-content: flex-end; gap: 6px; }

    /* Report Table */
    .official-report-data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    .official-report-data-table th { border: 1px solid #000; background-color: #f0f0f0; color: #000; font-weight: 800; font-size: 11px; padding: 6px 10px; text-transform: uppercase; text-align: left; }
    .official-report-data-table td { border: 1px solid #bbb; padding: 6px 10px; color: #000; vertical-align: top; }
    .report-group-header-tr td { background-color: #fff; border-top: 1px solid #000; border-bottom: 1px solid #000; border-left: none; border-right: none; font-weight: 900; color: #000; font-size: 12px; text-transform: uppercase; padding: 6px 10px; }
    .report-item-name { font-weight: 600; }
    .report-item-result { font-weight: 800; }

    /* Footer */
    .report-bottom-footer { margin-top: 60px; }
    .end-of-report-tag { text-align: center; font-weight: 800; font-size: 13px; color: #000; margin-bottom: 60px; }
    .report-signature-row { display: flex; justify-content: space-between; padding: 0 20px; }
    .signature-box { text-align: center; font-size: 12px; font-weight: 800; color: #000; text-transform: uppercase; }

    @page { margin: 15mm; size: A4 portrait; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  ${reportEl.innerHTML}
</body>
</html>`);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const activeRecord = labRecords[0] || null;

  return (
    <div className="lab-module-container">


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
                    openDoctorListModal();
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

          {/* Reports Dropdown Menu Button */}
          <div className="dropdown-container">
            <button
              className={`nav-item-btn ${showReportsDropdown ? 'active' : ''}`}
              onClick={() => {
                setShowReportsDropdown(!showReportsDropdown);
                setShowCompanyDropdown(false);
                setShowMasterDropdown(false);
              }}
            >
              <FileText size={16} />
              <span>Reports</span>
              <ChevronDown size={14} className="ml-1" />
            </button>

            {showReportsDropdown && (
              <div className="company-dropdown-menu">
                <button
                  className="dropdown-menu-item"
                  onClick={() => {
                    setShowReportsDropdown(false);
                    setActiveTab('test-wise-report');
                  }}
                >
                  <FileText size={16} />
                  <span>TestWise Report</span>
                </button>
              </div>
            )}
          </div>

          <button 
            className="nav-item-btn" 
            onClick={() => navigate('/admin/expenses/add?dept=Lab&from=lab')} 
            style={{ background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)', color: 'white', fontWeight: 700 }}
          >
            <Plus size={16} />
            <span> Add Expense</span>
          </button>

          <button className="nav-item-btn" onClick={() => navigate(-1)} style={{ backgroundColor: '#1e293b', color: 'white' }}>
            <ChevronLeft size={16} />
            <span>Back</span>
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

        <button
          className={`subtab-btn ${activeTab === 'test-wise-report' ? 'active' : ''}`}
          onClick={() => setActiveTab('test-wise-report')}
        >
          <FileText size={16} />
          <span>TestWise Report</span>
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
                    <div className="field-inline-group" style={{ position: 'relative' }} ref={labNameDropdownRef}>
                      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-control-desktop name-text-input"
                          placeholder="Type Patient Name to filter..."
                          value={formPname}
                          onChange={e => {
                            setFormPname(e.target.value);
                            setShowNameDropdown(true);
                          }}
                          onFocus={() => setShowNameDropdown(true)}
                          autoComplete="off"
                          style={{ width: '100%', paddingRight: '28px' }}
                        />
                        <button
                          type="button"
                          className="btn-dropdown-toggle"
                          onClick={() => setShowNameDropdown(!showNameDropdown)}
                          title="Toggle Patient List"
                          style={{
                            position: 'absolute',
                            right: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#555',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                        >
                          <ChevronDown size={14} />
                        </button>

                        {showNameDropdown && (
                          <div className="patient-name-dropdown">
                            <div className="dropdown-header">
                              {filteredPreviousPatientsForLab.length > 0 
                                ? `Matching Patients (${filteredPreviousPatientsForLab.length})` 
                                : 'No Matching Patients'}
                            </div>
                            {filteredPreviousPatientsForLab.map((p, idx) => (
                              <div
                                key={idx}
                                className="dropdown-item"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectPatientFromDropdown(p);
                                }}
                              >
                                <div className="patient-item-name">{p.name}</div>
                                <div className="patient-item-details">
                                  {p.uhid && <span className="badge-uhid">UHID: {p.uhid}</span>}
                                  {p.patientId && <span className="badge-id">ID: {p.patientId}</span>}
                                  {p.age && <span>Age: {p.age}</span>}
                                  {p.gender && <span>{p.gender}</span>}
                                  {p.phone && <span>Ph: {p.phone}</span>}
                                </div>
                              </div>
                            ))}
                            {filteredPreviousPatientsForLab.length === 0 && (
                              <div className="dropdown-item-empty" style={{ padding: '10px 12px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                                No patient matching "{formPname}". Type name to register new patient.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                  <div className="patient-browse-group" style={{ position: 'relative' }} ref={testEntryNameDropdownRef}>
                    <input
                      type="text"
                      className="form-control-desktop full-width"
                      value={formPname}
                      onChange={e => {
                        setFormPname(e.target.value);
                        setShowTestEntryNameDropdown(true);
                      }}
                      onFocus={() => setShowTestEntryNameDropdown(true)}
                      placeholder="Type Patient Name to filter..."
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="btn-browse"
                      title="Toggle Patient List"
                      onClick={() => setShowTestEntryNameDropdown(!showTestEntryNameDropdown)}
                    >
                      <ChevronDown size={14} />
                    </button>

                    {showTestEntryNameDropdown && (
                      <div className="patient-name-dropdown">
                        <div className="dropdown-header">
                          {filteredPreviousPatientsForLab.length > 0 
                            ? `Registered Patients (${filteredPreviousPatientsForLab.length})` 
                            : 'No Matching Patients'}
                        </div>
                        {filteredPreviousPatientsForLab.map((p, idx) => (
                          <div
                            key={idx}
                            className="dropdown-item"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectPatientFromDropdown(p);
                            }}
                          >
                            <div className="patient-item-name">{p.name}</div>
                            <div className="patient-item-details">
                              {p.uhid && <span className="badge-uhid">UHID: {p.uhid}</span>}
                              {p.patientId && <span className="badge-id">ID: {p.patientId}</span>}
                              {p.age && <span>Age: {p.age}</span>}
                              {p.gender && <span>{p.gender}</span>}
                              {p.phone && <span>Ph: {p.phone}</span>}
                            </div>
                          </div>
                        ))}
                        {filteredPreviousPatientsForLab.length === 0 && (
                          <div className="dropdown-item-empty" style={{ padding: '10px 12px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                            No patient matching "{formPname}".
                          </div>
                        )}
                      </div>
                    )}
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
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.dname}>{doc.dname}</option>
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
                            onChange={() => { }}
                          />
                          <span className="test-name-span">{test.testName}</span>
                          <span className="test-price-tag" style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 'bold', color: '#102A43' }}>
                            ₹{test.cost.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                    {filteredTestsByGroup.length === 0 && (
                      <div style={{ padding: '12px', fontSize: '12px', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
                        No tests found for group "{selectedGroup}".
                      </div>
                    )}
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
                          <th>Group</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTestsObj.map(test => (
                          <tr key={test.id}>
                            <td><strong>{test.testName}</strong></td>
                            <td>₹{test.cost.toFixed(2)}</td>
                            <td>
                              <button
                                className="btn-delete-test-row"
                                title="Remove test"
                                onClick={() => handleRemoveTestFromBill(test.id)}
                              >
                                <Trash size={14} />
                              </button>
                            </td>
                            <td><small>{test.groupName}</small></td>
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

                <button className="btn-bill-view-red" onClick={() => setShowPreviousReportsModal(true)}>
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
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.dname}>{doc.dname}</option>
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
                          checked={selectedTestIds.includes(test.id)}
                          onChange={() => toggleTestSelection(test.id)}
                        />
                        <span>{test.testName || test.name}</span>
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
                            <td>{test.groupName || test.category || 'GENERAL'}</td>
                            <td><strong>{test.testName || test.name}</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control-desktop table-result-input"
                                value={resultValues[test.id] || ''}
                                placeholder="Value"
                                onChange={e => setResultValues({ ...resultValues, [test.id]: e.target.value })}
                              />
                            </td>
                            <td>{test.unit || '-'}</td>
                            <td>{test.refValue || test.normalRange || 'Normal'}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control-desktop table-specimen-input"
                                value={specimenValues[test.id] || test.specimen || 'EDTA Blood'}
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

        {/* ========================================================================= */}
        {/* TAB 4: PRINT DIAGNOSTIC TEST REPORT (EXACT LETTERHEAD & PRINT LAYOUT)     */}
        {/* ========================================================================= */}
        {activeTab === 'print-result' && (
          <div className="tab-content-card card fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="card-header-bar flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Laboratory Diagnostic Test Report</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Official pathology report print preview with Shri Janani Hospitals letterhead.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <input
                    type="checkbox"
                    checked={withLetterHead}
                    onChange={e => setWithLetterHead(e.target.checked)}
                  />
                  <span>Show Letterhead Banner</span>
                </label>
                <button className="btn-desktop" onClick={() => setActiveTab('test-result')}>
                  <ChevronLeft size={16} /> Back to Entry
                </button>
                <button className="btn-print-action" onClick={handlePrint}>
                  <Printer size={18} /> Print Report
                </button>
              </div>
            </div>

            <div className="lab-report-sheet-container">
              <div className="official-lab-report-sheet print-area" id="official-lab-report-printable">
                {/* 1. Letterhead Banner (Shown when withLetterHead is true) */}
                {withLetterHead && (
                  <div className="sjh-letterhead-banner">
                    <div className="sjh-top-accent-stripe"></div>
                    <div className="sjh-header-main-row">
                      <div className="sjh-logo-left">
                        <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <text x="5" y="65" fill="#3B1E64" fontSize="62" fontWeight="900" fontFamily="serif">S</text>
                          <text x="35" y="78" fill="#D91B5C" fontSize="68" fontWeight="900" fontFamily="serif">J</text>
                          <text x="55" y="65" fill="#3B1E64" fontSize="62" fontWeight="900" fontFamily="serif">H</text>
                        </svg>
                      </div>

                      <div className="sjh-header-center-text">
                        <h1 className="sjh-title-main">SHRI JANANI HOSPITALS</h1>
                        <p className="sjh-address-line">No 65 SSD Road, Opp Ulavar Santhai, <strong>TIRUCHENGODE - 637 211</strong></p>
                        <p className="sjh-phone-line">Ph : 90801 22772, 85258 22772</p>
                      </div>

                      <div className="sjh-logo-right">
                        <svg width="60" height="65" viewBox="0 0 100 100" fill="#D91B5C">
                          <path d="M50 10 L50 90 M40 20 C60 25, 60 35, 50 40 C40 45, 40 55, 50 60 C60 65, 60 75, 50 80 M50 15 L30 25 L50 20 L70 25 Z" stroke="#D91B5C" strokeWidth="4" fill="none" />
                          <circle cx="50" cy="10" r="6" fill="#D91B5C" />
                          <path d="M30 22 Q50 32 70 22 Q50 42 30 22 Z" fill="#D91B5C" opacity="0.8" />
                        </svg>
                      </div>
                    </div>
                    <div className="sjh-bottom-magenta-line"></div>
                    <h3 className="sjh-sub-banner-title">SHRI PRASANNA BALAJI DIAGNOSTICS</h3>
                  </div>
                )}

                {/* Blank Header spacing for pre-printed letterhead stationary when withLetterHead is false */}
                {!withLetterHead && (
                  <div style={{ height: '140px' }} className="preprinted-letterhead-spacer"></div>
                )}

                {/* 2. Patient Demographics Block (Exact matching user sample) */}
                <div className="report-demographics-grid">
                  <div className="demo-left-column">
                    <div className="demo-row">
                      <span className="demo-label">Test No</span>
                      <span className="demo-colon">:</span>
                      <span className="demo-value"><strong>{resultTestNo || '3648'}</strong></span>
                    </div>
                    <div className="demo-row">
                      <span className="demo-label">Patient Name</span>
                      <span className="demo-colon">:</span>
                      <span className="demo-value"><strong>{patientTitle} {formPname || 'SANTHIYA D/O.MR.VADIVEL'}</strong></span>
                    </div>
                    <div className="demo-row">
                      <span className="demo-label">Age / Sex</span>
                      <span className="demo-colon">:</span>
                      <span className="demo-value">{formAge || '14'} YRS / {formGender}</span>
                    </div>
                    <div className="demo-row">
                      <span className="demo-label">Ref.Doctor</span>
                      <span className="demo-colon">:</span>
                      <span className="demo-value"><strong>{refBy || 'DR.SRI JANANI,MD.,OG.,'}</strong></span>
                    </div>
                  </div>

                  <div className="demo-right-column">
                    <div className="barcode-align-row">
                      <div className="report-barcode-box">
                        <svg width="150" height="28" viewBox="0 0 150 28">
                          <rect x="5" y="2" width="2" height="22" fill="#000"/>
                          <rect x="9" y="2" width="4" height="22" fill="#000"/>
                          <rect x="15" y="2" width="1" height="22" fill="#000"/>
                          <rect x="18" y="2" width="3" height="22" fill="#000"/>
                          <rect x="23" y="2" width="2" height="22" fill="#000"/>
                          <rect x="27" y="2" width="5" height="22" fill="#000"/>
                          <rect x="34" y="2" width="1" height="22" fill="#000"/>
                          <rect x="37" y="2" width="3" height="22" fill="#000"/>
                          <rect x="42" y="2" width="4" height="22" fill="#000"/>
                          <rect x="48" y="2" width="2" height="22" fill="#000"/>
                          <rect x="52" y="2" width="1" height="22" fill="#000"/>
                          <rect x="55" y="2" width="5" height="22" fill="#000"/>
                          <rect x="62" y="2" width="2" height="22" fill="#000"/>
                          <rect x="66" y="2" width="3" height="22" fill="#000"/>
                          <rect x="71" y="2" width="1" height="22" fill="#000"/>
                          <rect x="74" y="2" width="4" height="22" fill="#000"/>
                          <rect x="80" y="2" width="2" height="22" fill="#000"/>
                          <rect x="84" y="2" width="5" height="22" fill="#000"/>
                          <rect x="91" y="2" width="1" height="22" fill="#000"/>
                          <rect x="94" y="2" width="3" height="22" fill="#000"/>
                          <rect x="99" y="2" width="2" height="22" fill="#000"/>
                          <rect x="103" y="2" width="4" height="22" fill="#000"/>
                          <rect x="109" y="2" width="1" height="22" fill="#000"/>
                          <rect x="112" y="2" width="3" height="22" fill="#000"/>
                          <rect x="117" y="2" width="5" height="22" fill="#000"/>
                          <rect x="124" y="2" width="2" height="22" fill="#000"/>
                          <rect x="128" y="2" width="1" height="22" fill="#000"/>
                          <rect x="131" y="2" width="4" height="22" fill="#000"/>
                          <rect x="137" y="2" width="2" height="22" fill="#000"/>
                        </svg>
                      </div>
                    </div>
                    <div className="demo-row">
                      <span className="demo-label">Collected Date</span>
                      <span className="demo-colon">:</span>
                      <span className="demo-value">{testBillDate || new Date().toLocaleDateString('en-GB')} 10:57:33</span>
                    </div>
                    <div className="demo-row">
                      <span className="demo-label">Reported Date</span>
                      <span className="demo-colon">:</span>
                      <span className="demo-value">{resultReportDate || testBillDate || new Date().toLocaleDateString('en-GB')} 10:58:53</span>
                    </div>
                  </div>
                </div>

                {/* 3. Official Pathology Test Results Table (Exact matching user sample) */}
                <table className="official-report-data-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', width: '38%' }}>TEST NAME</th>
                      <th style={{ textAlign: 'left', width: '22%' }}>RESULT</th>
                      <th style={{ textAlign: 'left', width: '15%' }}>UNIT</th>
                      <th style={{ textAlign: 'left', width: '25%' }}>NORMAL RANGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSelectedTests.map((group, gIdx) => (
                      <React.Fragment key={'grp_' + gIdx}>
                        <tr className="report-group-header-tr">
                          <td colSpan={4} className="report-group-header-td">
                            <strong>{group.groupName}</strong>
                          </td>
                        </tr>
                        {group.items.map((test, tIdx) => {
                          const val = resultValues[test.id] || 'PALE YELLOW';
                          const unit = test.unit && test.unit !== '-' ? test.unit : '';
                          const range = test.refValue || test.normalRange || '';
                          return (
                            <tr key={'test_row_' + test.id + '_' + tIdx} className="report-item-tr">
                              <td className="report-item-name">{test.testName || test.name}</td>
                              <td className="report-item-result"><strong>{val}</strong></td>
                              <td className="report-item-unit">{unit}</td>
                              <td className="report-item-range">{range}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {/* 4. Report Bottom Footer & Signatures */}
                <div className="report-bottom-footer">
                  <div className="end-of-report-tag">
                    ****End of Report****
                  </div>

                  <div className="report-signature-row">
                    <div className="signature-box left">
                      <strong>DOCTOR SIGNATURE</strong>
                    </div>
                    <div className="signature-box right">
                      <strong>LAB TECHNICIAN</strong>
                    </div>
                  </div>
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

        {/* ========================================================================= */}
        {/* TAB: TESTWISE REPORT WINDOW (EXACT REPLICA OF USER'S SCREENSHOT IMAGE)    */}
        {/* ========================================================================= */}
        {activeTab === 'test-wise-report' && (
          <div className="test-wise-report-desktop-window card fade-in">
            <div className="window-header">
              <div className="window-header-left">
                <FileText size={18} />
                <span>TestWise Report</span>
              </div>
              <div className="window-header-right-controls" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button className="window-close-red" onClick={() => setActiveTab('patient-entry')}>X</button>
              </div>
            </div>

            <div className="window-body">
              {/* Top Filter Bar Section */}
              <div className="tw-top-controls-card">
                <div className="tw-reports-title-label">
                  REPORTS
                </div>

                <div className="tw-filter-form-grid">
                  <div className="tw-date-row">
                    <label className="tw-label">From</label>
                    <input
                      type="date"
                      className="form-control-desktop tw-date-input"
                      value={testWiseFromDate}
                      onChange={e => setTestWiseFromDate(e.target.value)}
                    />

                    <label className="tw-label">Group Wise Report</label>
                    <select
                      className="form-control-desktop tw-select-wide"
                      value={testWiseReportGroup}
                      onChange={e => {
                        setTestWiseReportGroup(e.target.value);
                        setTestWiseReportTest('ALL TESTS');
                      }}
                    >
                      <option value="ALL GROUPS">-- ALL GROUPS --</option>
                      {testGroupsGrid.map(grp => (
                        <option key={grp.id} value={grp.name}>{grp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="tw-date-row">
                    <label className="tw-label">To</label>
                    <input
                      type="date"
                      className="form-control-desktop tw-date-input"
                      value={testWiseToDate}
                      onChange={e => setTestWiseToDate(e.target.value)}
                    />

                    <label className="tw-label">Test Wise Report</label>
                    <select
                      className="form-control-desktop tw-select-wide"
                      value={testWiseReportTest}
                      onChange={e => setTestWiseReportTest(e.target.value)}
                    >
                      <option value="ALL TESTS">-- ALL TESTS --</option>
                      {availableTestsForSelectedGroup.map((testName, idx) => (
                        <option key={testName + '_' + idx} value={testName}>
                          {testName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="tw-actions-column">
                  <div className="tw-btn-pair">
                    <button className="tw-btn-action" onClick={() => window.print()}>
                      PRINT
                    </button>
                    <button className="tw-btn-action" onClick={() => setClickedTestWiseOk(true)}>
                      OK
                    </button>
                  </div>
                  <div className="tw-btn-pair">
                    <button className="tw-btn-action tw-btn-export" onClick={() => handleExportTestWiseExcel(testWiseReportFilteredList)}>
                      EXPORT TO EXCEL
                    </button>
                    <button
                      className="tw-btn-action"
                      onClick={() => {
                        setTestWiseReportGroup('HAEMATOLOGY');
                        setTestWiseReportTest('ALL TESTS');
                        setClickedTestWiseOk(true);
                      }}
                    >
                      BLOOD GROUP DET
                    </button>
                  </div>
                </div>

                <button className="tw-window-red-x" onClick={() => setActiveTab('patient-entry')}>
                  X
                </button>
              </div>

              {/* Main Content Layout (Table on Left, Count Box on Right) */}
              <div className="tw-workspace-layout">
                <div className="tw-table-container">
                  <table className="tw-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>S.No</th>
                        <th>Date & Time</th>
                        <th>Lab ID</th>
                        <th>UHID</th>
                        <th>Patient Name</th>
                        <th>Test Group</th>
                        <th>Test Name</th>
                        <th>Result Value</th>
                        <th>Normal Range</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testWiseReportFilteredList.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="text-center empty-td" style={{ padding: '40px', color: '#64748b' }}>
                            No test-wise report records found matching the specified date range and test filters.
                          </td>
                        </tr>
                      ) : (
                        testWiseReportFilteredList.map((entry, idx) => (
                          <tr key={'tw_' + entry.labId + '_' + entry.testId + '_' + idx}>
                            <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                            <td><small>{entry.date} {entry.time}</small></td>
                            <td><code>{entry.labId}</code></td>
                            <td>{entry.uhid}</td>
                            <td>
                              <button
                                type="button"
                                className="clickable-patient-name-btn"
                                title="Click to view test results for this patient"
                                onClick={() => handleOpenTestResultForPatient(entry.patientName, entry.labId || entry.uhid, {
                                  age: entry.age,
                                  gender: entry.gender,
                                  refDoctor: entry.refDoctor,
                                  uhid: entry.uhid,
                                  date: entry.date,
                                  testName: entry.testName
                                })}
                              >
                                {entry.patientName}
                              </button>
                              <br />
                              <small style={{ color: '#64748b' }}>({entry.age}/{entry.gender})</small>
                            </td>
                            <td><small>{entry.groupName}</small></td>
                            <td><strong style={{ color: '#102A43' }}>{entry.testName}</strong></td>
                            <td>
                              <strong style={{ fontSize: '13px', color: entry.isAbnormal ? '#dc2626' : '#16a34a' }}>
                                {entry.value} {entry.unit}
                              </strong>
                            </td>
                            <td><small>{entry.normalRange}</small></td>
                            <td>
                              {entry.isAbnormal ? (
                                <span className="badge-status" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                                  ABNORMAL
                                </span>
                              ) : (
                                <span className="badge-status" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                                  NORMAL
                                </span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn-icon-action"
                                onClick={() => handleOpenTestResultForPatient(entry.patientName, entry.labId || entry.uhid, {
                                  age: entry.age,
                                  gender: entry.gender,
                                  refDoctor: entry.refDoctor,
                                  uhid: entry.uhid,
                                  date: entry.date,
                                  testName: entry.testName
                                })}
                              >
                                <Eye size={14} /> Report
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Right Count Box (Matching Screenshot) */}
                <div className="tw-count-box-side">
                  <h4 className="tw-count-header">Count</h4>
                  <div className="tw-count-display">
                    <span className="tw-total-label">Total</span>
                    <span className="tw-total-value">{testWiseReportFilteredList.length}</span>
                  </div>
                </div>
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
      {/* --- PREVIOUS TEST REPORTS / BILL VIEW WINDOW (EXACT MATCH OF USER SCREENSHOT) --- */}
      {showPreviousReportsModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card large fade-in" style={{ maxWidth: '1480px', width: '98%', backgroundColor: '#DDE8FA', border: '2px solid #5C768D' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(180deg, #1E3F66 0%, #0F172A 100%)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardCheck size={20} />
                <h3 style={{ margin: 0, color: 'white' }}>Reports</h3>
              </div>
              <button className="close-btn" onClick={() => setShowPreviousReportsModal(false)}><X size={18} /></button>
            </div>

            <div className="modal-body" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* TOP CONTROL BAR (MATCHING SCREENSHOT) */}
              <div className="bv-top-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#E6F0FA', padding: '8px 12px', borderRadius: '4px', border: '1px solid #90A4AE', flexWrap: 'wrap' }}>
                {/* Radio Box */}
                <div style={{ border: '1px solid #90A4AE', padding: '4px 10px', borderRadius: '4px', background: '#D9E5F6' }}>
                  <div style={{ color: '#000080', fontWeight: 900, fontSize: '13px', marginBottom: '2px' }}>REPORTS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', fontWeight: 700 }}>
                    <label style={{ color: '#900', cursor: 'pointer' }}>
                      <input type="radio" name="bvStatus" checked={bvFilterStatus === 'ALL'} onChange={() => setBvFilterStatus('ALL')} /> ALL
                    </label>
                    <label style={{ color: '#900', cursor: 'pointer' }}>
                      <input type="radio" name="bvStatus" checked={bvFilterStatus === 'Pending'} onChange={() => setBvFilterStatus('Pending')} /> Pending
                    </label>
                    <label style={{ color: '#900', cursor: 'pointer' }}>
                      <input type="radio" name="bvStatus" checked={bvFilterStatus === 'Completed'} onChange={() => setBvFilterStatus('Completed')} /> Completed
                    </label>
                  </div>
                </div>

                {/* From / To Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800 }}>From</label>
                    <input type="date" className="form-control-desktop" style={{ width: '130px', padding: '2px 6px' }} value={bvFromDate} onChange={e => setbvFromDate(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800 }}>To</label>
                    <input type="date" className="form-control-desktop" style={{ width: '130px', padding: '2px 6px' }} value={bvToDate} onChange={e => setbvToDate(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button className="tw-btn-action" style={{ background: '#D9E5F6', border: '1px solid #5C768D', padding: '4px 12px', fontWeight: 800 }} onClick={() => window.print()}>Print</button>
                  <button className="tw-btn-action" style={{ background: '#D9E5F6', border: '1px solid #5C768D', padding: '4px 12px', fontWeight: 800 }} onClick={() => alert('Previewing Report')}>Preview</button>
                  <button className="tw-btn-action" style={{ background: '#D9E5F6', border: '1px solid #5C768D', padding: '4px 12px', fontWeight: 800 }} onClick={() => setClickedTestWiseOk(true)}>OK</button>
                </div>

                {/* Dropdowns Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, minWidth: '110px' }}>Doctor Wise Report</label>
                    <select className="form-control-desktop" style={{ flex: 1, padding: '2px 6px' }} value={bvDoctorFilter} onChange={e => setBvDoctorFilter(e.target.value)}>
                      <option value="">-- ALL DOCTORS --</option>
                      <option value="DR.SRI JANANI,MD.,OG.,">DR.SRI JANANI,MD.,OG.,</option>
                    </select>
                    <button className="tw-btn-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => window.print()}>Doc.Print</button>
                    <button className="tw-btn-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => alert('Preview Doc Report')}>Preview</button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, minWidth: '110px' }}>LAB Wise Report</label>
                    <select className="form-control-desktop" style={{ flex: 1, padding: '2px 6px' }} value={bvLabFilter} onChange={e => setBvLabFilter(e.target.value)}>
                      <option value="">-- ALL LABS --</option>
                      <option value="SELF">SELF</option>
                    </select>
                    <button className="tw-btn-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => window.print()}>Lab.Print</button>
                    <button className="tw-btn-action" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => alert('Preview Lab Report')}>Preview</button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, minWidth: '110px' }}>Test Type</label>
                    <select className="form-control-desktop" style={{ flex: 1, padding: '2px 6px' }} value={bvTestTypeFilter} onChange={e => setBvTestTypeFilter(e.target.value)}>
                      <option value="">-- ALL TYPES --</option>
                      <option value="Single">Single</option>
                      <option value="Group">Group</option>
                    </select>
                  </div>
                </div>

                {/* Export & Consolidate */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  <button className="tw-btn-action tw-btn-export" style={{ width: '150px', background: '#D9E5F6', border: '1px solid #5C768D', fontWeight: 800 }} onClick={() => handleExportTestWiseExcel(filteredBillReports)}>
                    EXPORT TO EXCEL
                  </button>
                  <div style={{ fontSize: '11px', fontWeight: 800, textAlign: 'center', marginTop: '2px' }}>Monthwise Consolidate</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="tw-btn-action" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => alert('Consolidate Preview')}>Preview</button>
                    <button className="tw-btn-action" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => window.print()}>Print</button>
                  </div>
                </div>

                {/* Daily Test & Cash/Due Cards */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ border: '1px solid #5C768D', background: '#D9E5F6', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#900' }}>Daily Test<br />Report</div>
                    <button className="tw-btn-action" style={{ padding: '2px 8px', marginTop: '4px', fontSize: '10px' }} onClick={() => alert('Daily Test Report')}>Preview</button>
                  </div>
                  <div style={{ border: '1px solid #5C768D', background: '#D9E5F6', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#900' }}>Cash/Due<br />Report</div>
                    <button className="tw-btn-action" style={{ padding: '2px 8px', marginTop: '4px', fontSize: '10px' }} onClick={() => alert('Cash/Due Report')}>Preview</button>
                  </div>
                </div>

                <button className="tw-window-red-x" onClick={() => setShowPreviousReportsModal(false)} style={{ marginLeft: 'auto', background: '#D32F2F', color: 'white', padding: '8px 14px', fontWeight: 900 }}>
                  X
                </button>
              </div>

              {/* MAIN CONTENT SPLIT LAYOUT */}
              <div style={{ display: 'flex', gap: '12px', minHeight: '440px' }}>
                {/* Left Table Grid */}
                <div style={{ flex: 1, background: 'white', border: '1px solid #90A4AE', borderRadius: '4px', overflowY: 'auto', maxHeight: '480px' }}>
                  <table className="search-results-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr style={{ position: 'sticky', top: 0, background: '#1E3F66', color: 'white', zIndex: 10 }}>
                        <th>Test No</th>
                        <th>Test Date</th>
                        <th>Patient Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Ref Doc</th>
                        <th style={{ textAlign: 'right' }}>Cost</th>
                        <th style={{ textAlign: 'right' }}>Discount</th>
                        <th style={{ textAlign: 'right' }}>Total</th>
                        <th style={{ textAlign: 'right' }}>Advance</th>
                        <th style={{ textAlign: 'right' }}>Balance</th>
                        <th style={{ textAlign: 'right' }}>Expenses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBillReports.map((r, idx) => (
                        <tr key={'bv_row_' + r.testNo + '_' + idx}>
                          <td>
                            <strong
                              style={{ color: '#1d4ed8', cursor: 'pointer', textDecoration: 'underline' }}
                              onClick={() => handleOpenTestResultForPatient(r.patientName, r.testNo, {
                                age: r.age,
                                gender: r.gender,
                                refDoctor: r.refDoc,
                                date: r.testDate
                              })}
                            >
                              {r.testNo}
                            </strong>
                          </td>
                          <td>{r.testDate}</td>
                          <td>
                               <button
                                 type="button"
                                 className="clickable-patient-name-btn"
                                 title="Click to view test results for this patient"
                                 onClick={() => handleOpenTestResultForPatient(r.patientName, r.testNo, {
                                   age: r.age,
                                   gender: r.gender,
                                   refDoctor: r.refDoc,
                                   date: r.testDate
                                 })}
                                 style={{
                                   background: 'none',
                                   border: 'none',
                                   padding: 0,
                                   color: '#1d4ed8',
                                   fontWeight: 700,
                                   cursor: 'pointer',
                                   textDecoration: 'underline',
                                   textAlign: 'left'
                                 }}
                               >
                                 {r.patientName}
                               </button>
                             </td>
                          <td>{r.age}</td>
                          <td>{r.gender}</td>
                          <td><small>{r.refDoc}</small></td>
                          <td style={{ textAlign: 'right' }}>{r.cost.toFixed(2)}</td>
                          <td style={{ textAlign: 'right' }}>{r.discount.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{r.total.toFixed(2)}</td>
                          <td style={{ textAlign: 'right' }}>{r.advance.toFixed(2)}</td>
                          <td style={{ textAlign: 'right' }}>{r.balance.toFixed(2)}</td>
                          <td style={{ textAlign: 'right' }}>{r.expenses.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right Side Summary Panel (Matching Screenshot) */}
                <div style={{ width: '250px', background: '#E6F0FA', border: '1px solid #90A4AE', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Collection Register */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h4 style={{ margin: 0, color: '#800000', fontSize: '13px', fontWeight: 900 }}>Collection Register</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Collection Amount</span>
                      <span style={{ color: '#7B0080', fontSize: '15px' }}>{bvCollectionTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Balance</span>
                      <span style={{ color: '#7B0080', fontSize: '15px' }}>.{bvBalanceTotal.toFixed(0)}0</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Total</span>
                      <span style={{ color: '#7B0080', fontSize: '15px' }}>{bvCollectionTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <hr style={{ border: '0.5px solid #CBD5E1', margin: 0 }} />

                  {/* Doctor Wise Commission */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h4 style={{ margin: 0, color: '#800000', fontSize: '13px', fontWeight: 900 }}>Doctor Wise Commission</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Collection Amount</span>
                      <span style={{ color: '#7B0080' }}>.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Expenses</span>
                      <span style={{ color: '#7B0080' }}>.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Total Amount</span>
                      <span style={{ color: '#7B0080' }}>.00</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, marginTop: '4px' }}>
                      <span>Commission Percentage</span>
                      <input type="text" className="form-control-desktop" style={{ width: '60px', padding: '1px 4px' }} value={bvCommissionPct} onChange={e => setBvCommissionPct(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800 }}>
                      <span>Commission Amount</span>
                      <input type="text" className="form-control-desktop" style={{ width: '60px', padding: '1px 4px' }} value={bvCommissionAmt} onChange={e => setBvCommissionAmt(e.target.value)} />
                    </div>
                  </div>

                  <hr style={{ border: '0.5px solid #CBD5E1', margin: 0 }} />

                  {/* Expenses */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
                    <h4 style={{ margin: 0, color: '#800000', fontSize: '13px', fontWeight: 900 }}>Expenses</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                      <span>Total</span>
                      <span style={{ color: '#7B0080' }}>.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: SEARCH RECORDS & TEST-WISE REPORT --- */}
      {showSearchModal && (
        <div className="lab-modal-overlay">
          <div className="lab-modal-card card large fade-in" style={{ maxWidth: '1250px', width: '95%' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(180deg, #1E3F66 0%, #0F172A 100%)', color: 'white' }}>
              <h3><SearchIcon size={20} /> Search Lab Records & Test-Wise Reports</h3>
              <button className="close-btn" onClick={() => setShowSearchModal(false)}><X size={18} /></button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Search Sub-Tabs Bar */}
              <div className="search-tab-bar" style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #CBD5E1', paddingBottom: '8px' }}>
                <button
                  type="button"
                  className={`subtab-btn ${searchModalTab === 'patient-records' ? 'active' : ''}`}
                  onClick={() => setSearchModalTab('patient-records')}
                  style={{ flex: '0 1 auto', padding: '6px 18px' }}
                >
                  <UserPlus size={16} /> Patient & Lab Records
                </button>
                <button
                  type="button"
                  className={`subtab-btn ${searchModalTab === 'test-wise-report' ? 'active' : ''}`}
                  onClick={() => setSearchModalTab('test-wise-report')}
                  style={{ flex: '0 1 auto', padding: '6px 18px' }}
                >
                  <TestTube2 size={16} /> Test-Wise Report Analytics ({allTestWiseEntries.length})
                </button>
              </div>

              {/* TAB 1: PATIENT & LAB RECORDS SEARCH */}
              {searchModalTab === 'patient-records' && (
                <div className="search-tab-content fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control search-large-input"
                      placeholder="Search by UHID, Patient Name, Lab ID, Phone..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>

                  <table className="search-results-table">
                    <thead>
                      <tr>
                        <th>Lab ID</th>
                        <th>UHID</th>
                        <th>Patient Name</th>
                        <th>Date & Time</th>
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
                          r.labId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.phone && r.phone.includes(searchQuery))
                        )
                        .map(r => (
                          <tr key={r.labId}>
                            <td><strong>{r.labId}</strong></td>
                            <td>{r.uhid}</td>
                            <td>
                              <button
                                type="button"
                                className="clickable-patient-name-btn"
                                title="Click to view test results for this patient"
                                onClick={() => handleOpenTestResultForPatient(r.patientName, r.labId || r.uhid, {
                                  age: r.age,
                                  gender: r.gender,
                                  refDoctor: r.refDoctor,
                                  uhid: r.uhid,
                                  date: r.date
                                })}
                              >
                                {r.patientName}
                              </button>
                            </td>
                            <td>{r.date} <small>{r.time}</small></td>
                            <td>{r.tests.length} Tests</td>
                            <td>₹{r.totalAmount.toFixed(2)}</td>
                            <td><span className="badge-status normal">{r.status}</span></td>
                            <td>
                              <button
                                className="btn-icon-action"
                                onClick={() => handleOpenTestResultForPatient(r.patientName, r.labId || r.uhid, {
                                  age: r.age,
                                  gender: r.gender,
                                  refDoctor: r.refDoctor,
                                  uhid: r.uhid,
                                  date: r.date
                                })}
                              >
                                <Eye size={16} /> View Full Report
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 2: TEST-WISE REPORT SEARCH */}
              {searchModalTab === 'test-wise-report' && (
                <div className="search-tab-content fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Test-Wise Filter Controls */}
                  <div className="test-wise-filters-row" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap', background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Filter Test Group:</label>
                      <select
                        className="form-control-desktop"
                        value={testWiseGroupFilter}
                        onChange={e => {
                          setTestWiseGroupFilter(e.target.value);
                          setTestWiseTestFilter('ALL TESTS');
                        }}
                      >
                        <option value="ALL GROUPS">-- ALL GROUPS --</option>
                        {testGroupsGrid.map(g => (
                          <option key={g.id} value={g.name}>{g.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Filter Test Name:</label>
                      <select
                        className="form-control-desktop"
                        value={testWiseTestFilter}
                        onChange={e => setTestWiseTestFilter(e.target.value)}
                      >
                        <option value="ALL TESTS">-- ALL TESTS --</option>
                        {allMasterTestItems
                          .filter(t => testWiseGroupFilter === 'ALL GROUPS' || t.groupName.toUpperCase() === testWiseGroupFilter.toUpperCase())
                          .map((t, idx) => (
                            <option key={t.id + '_' + idx} value={t.testName}>{t.testName}</option>
                          ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '130px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Result Status:</label>
                      <select
                        className="form-control-desktop"
                        value={testWiseStatusFilter}
                        onChange={e => setTestWiseStatusFilter(e.target.value as any)}
                      >
                        <option value="ALL">All Results</option>
                        <option value="ABNORMAL">Abnormal Only</option>
                        <option value="NORMAL">Normal Only</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Search Query:</label>
                      <input
                        type="text"
                        className="form-control-desktop"
                        placeholder="Search patient, test, value..."
                        value={testWiseSearchQuery}
                        onChange={e => setTestWiseSearchQuery(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-price-action btn-export-list"
                      onClick={() => handleExportTestWiseExcel(filteredTestWiseEntries)}
                    >
                      <FileSpreadsheet size={15} /> Export Excel
                    </button>
                  </div>

                  {/* Test-Wise Report Results Table */}
                  <div style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid #CBD5E1', borderRadius: '4px' }}>
                    <table className="search-results-table">
                      <thead>
                        <tr style={{ position: 'sticky', top: 0, zIndex: 10, background: '#1E3F66', color: 'white' }}>
                          <th>Date</th>
                          <th>Lab ID</th>
                          <th>Patient Name</th>
                          <th>Test Group</th>
                          <th>Test Name</th>
                          <th>Result Value</th>
                          <th>Normal Range</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTestWiseEntries.length === 0 ? (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontStyle: 'italic' }}>
                              No test-wise report records found matching the filters.
                            </td>
                          </tr>
                        ) : (
                          filteredTestWiseEntries.map((entry, idx) => (
                            <tr key={entry.labId + '_' + entry.testId + '_' + idx}>
                              <td><small>{entry.date} {entry.time}</small></td>
                              <td><code>{entry.labId}</code></td>
                              <td>
                                <button
                                  type="button"
                                  className="clickable-patient-name-btn"
                                  title="Click to view test results for this patient"
                                  onClick={() => handleOpenTestResultForPatient(entry.patientName, entry.labId || entry.uhid, {
                                    age: entry.age,
                                    gender: entry.gender,
                                    refDoctor: entry.refDoctor,
                                    uhid: entry.uhid,
                                    date: entry.date,
                                    testName: entry.testName
                                  })}
                                >
                                  {entry.patientName}
                                </button>
                                <br />
                                <small style={{ color: '#64748b' }}>{entry.age} / {entry.gender}</small>
                              </td>
                              <td><small>{entry.groupName}</small></td>
                              <td><strong style={{ color: '#1e3a8a' }}>{entry.testName}</strong></td>
                              <td>
                                <strong style={{ fontSize: '13px', color: entry.isAbnormal ? '#dc2626' : '#16a34a' }}>
                                  {entry.value} {entry.unit}
                                </strong>
                              </td>
                              <td><small>{entry.normalRange}</small></td>
                              <td>
                                {entry.isAbnormal ? (
                                  <span className="badge-status" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                                    ABNORMAL
                                  </span>
                                ) : (
                                  <span className="badge-status" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                                    NORMAL
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn-icon-action"
                                  onClick={() => handleOpenTestResultForPatient(entry.patientName, entry.labId || entry.uhid, {
                                    age: entry.age,
                                    gender: entry.gender,
                                    refDoctor: entry.refDoctor,
                                    uhid: entry.uhid,
                                    date: entry.date,
                                    testName: entry.testName
                                  })}
                                >
                                  <Eye size={14} /> Report
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#475569' }}>
                    <span>Showing <strong>{filteredTestWiseEntries.length}</strong> test report entries</span>
                    <button className="btn-desktop" onClick={() => setShowSearchModal(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MASTER DROPDOWN: PRICE LIST PAGE                                          */}
      {/* ========================================================================= */}
      {showPriceListModal && (
        <div className="lab-modal-overlay">
          <div className="price-list-window card fade-in">
            <div className="price-list-header">
              <div className="price-list-header-left">
                <Tag size={18} />
                <span>Test Master Price List</span>
              </div>
              <button className="window-close-red" onClick={() => setShowPriceListModal(false)}>X</button>
            </div>

            <div className="price-list-body">
              <div className="price-list-filters-bar">
                <div className="price-filter-group">
                  <label className="price-filter-label">1. Select Test Group:</label>
                  <select
                    className="form-control-desktop price-group-select"
                    value={priceListGroupFilter}
                    onChange={e => setPriceListGroupFilter(e.target.value)}
                  >
                    <option value="ALL GROUPS">-- ALL GROUPS --</option>
                    {testGroupsGrid.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="price-filter-group flex-1">
                  <label className="price-filter-label">2. Test Name:</label>
                  <input
                    type="text"
                    className="form-control-desktop price-name-input"
                    placeholder="Enter or type Test Name to filter..."
                    value={priceListNameFilter}
                    onChange={e => setPriceListNameFilter(e.target.value)}
                  />
                </div>

                <div className="price-filter-actions">
                  <button
                    type="button"
                    className="btn-price-action btn-show-list"
                    onClick={() => setHasClickedShowPriceList(true)}
                  >
                    <SearchIcon size={15} /> Show Price List
                  </button>

                  <button
                    type="button"
                    className="btn-price-action btn-preview-list"
                    onClick={() => {
                      setHasClickedShowPriceList(true);
                      setShowPriceListPreview(true);
                    }}
                  >
                    <Eye size={15} /> Preview
                  </button>

                  <button
                    type="button"
                    className="btn-price-action btn-export-list"
                    onClick={() => handleExportPriceListExcel(filteredPriceListItems)}
                  >
                    <FileSpreadsheet size={15} /> Export to Excel
                  </button>
                </div>
              </div>

              {/* Price List Table Container */}
              <div className="price-list-table-container">
                <table className="price-list-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>S.No</th>
                      <th style={{ width: '80px' }}>Test ID</th>
                      <th>Test Group</th>
                      <th>Test Name</th>
                      <th>Unit</th>
                      <th>Specimen</th>
                      <th>Normal Reference Value</th>
                      <th style={{ textAlign: 'right', paddingRight: '16px' }}>Price / Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!hasClickedShowPriceList ? (
                      <tr>
                        <td colSpan={8} className="text-center empty-td" style={{ padding: '30px', color: '#64748b' }}>
                          Select Test Group or enter Test Name and click <strong>"Show Price List"</strong> to display item rates.
                        </td>
                      </tr>
                    ) : filteredPriceListItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center empty-td" style={{ padding: '30px', color: '#ef4444' }}>
                          No test items found matching the selected group / name criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPriceListItems.map((item, idx) => (
                        <tr key={item.id + '_' + idx}>
                          <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                          <td><code>{item.id}</code></td>
                          <td><strong>{item.groupName}</strong></td>
                          <td><span className="test-name-bold">{item.testName}</span></td>
                          <td>{item.unit}</td>
                          <td>{item.specimen}</td>
                          <td><small style={{ color: '#475569' }}>{item.refValue}</small></td>
                          <td style={{ textAlign: 'right', fontWeight: '800', color: '#1e3a8a', paddingRight: '16px' }}>
                            ₹{item.cost.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="price-list-footer-bar">
                <span className="price-count-badge">
                  Total Items: <strong>{hasClickedShowPriceList ? filteredPriceListItems.length : 0}</strong>
                </span>
                <button className="btn-desktop" onClick={() => setShowPriceListModal(false)}>
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL ITEMS PRICE LIST PREVIEW PAGE (PRINTABLE & EXPORTABLE REPORT)         */}
      {/* ========================================================================= */}
      {showPriceListPreview && (
        <div className="lab-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="price-list-preview-window">
            <div className="preview-toolbar no-print">
              <div className="preview-toolbar-left">
                <FileText size={18} />
                <span>Full Items Price List - Formal Preview</span>
              </div>
              <div className="preview-toolbar-right">
                <button type="button" className="btn-preview-tool btn-print" onClick={() => window.print()}>
                  <Printer size={15} /> Print Price List
                </button>
                <button
                  type="button"
                  className="btn-preview-tool btn-excel"
                  onClick={() => handleExportPriceListExcel(filteredPriceListItems)}
                >
                  <FileSpreadsheet size={15} /> Export to Excel
                </button>
                <button type="button" className="btn-preview-tool btn-close" onClick={() => setShowPriceListPreview(false)}>
                  <X size={15} /> Close Preview
                </button>
              </div>
            </div>

            <div className="preview-report-sheet print-area">
              <div className="report-header-banner">
                <h1 className="hospital-name-heading">SHRI JANANI HOSPITAL & DIAGNOSTICS</h1>
                <p className="hospital-sub-heading">12 Gandhi Road, Gobichettipalayam | Ph: 9715425302</p>
                <div className="report-divider-line"></div>
                <h2 className="report-title-heading">MASTER TEST PRICE LIST REPORT</h2>
                <div className="report-meta-row">
                  <span>Category Filter: <strong>{priceListGroupFilter}</strong></span>
                  <span>Generated Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
                  <span>Total Items Listed: <strong>{filteredPriceListItems.length}</strong></span>
                </div>
              </div>

              <table className="preview-report-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>S.No</th>
                    <th style={{ width: '70px' }}>Code</th>
                    <th>Test Group</th>
                    <th>Test Name</th>
                    <th>Specimen</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                    <th style={{ textAlign: 'right' }}>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPriceListItems.map((item, idx) => (
                    <tr key={'prev_' + item.id + '_' + idx}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td><code>{item.id}</code></td>
                      <td><strong>{item.groupName}</strong></td>
                      <td>{item.testName}</td>
                      <td>{item.specimen}</td>
                      <td>{item.unit}</td>
                      <td><small>{item.refValue}</small></td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{item.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="report-footer-signatures">
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <span>Lab Manager</span>
                </div>
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <span>Pathologist Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;
