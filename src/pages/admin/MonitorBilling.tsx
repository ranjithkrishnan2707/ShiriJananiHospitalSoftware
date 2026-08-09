import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  DollarSign, 
  AlertCircle, 
  Calendar, 
  ArrowLeft,
  Search,
  RotateCcw,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Ban,
  FileText,
  TrendingUp,
  History,
  Eye,
  Pill,
  TestTube2,
  Activity,
  Stethoscope,
  Tag
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import './MonitorBilling.css';

export interface TabletPurchaseItem {
  name: string;
  qty: number;
  rate: number;
  total: number;
}

export interface LabTestItem {
  name: string;
  rate: number;
}

export interface ScanTestItem {
  name: string;
  rate: number;
}

export interface DoctorFeeItem {
  doctorName: string;
  fee: number;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  mode: string;
  refNo?: string;
  type: 'Collection' | 'Refund';
  collectedBy: string;
}

export interface BillRecord {
  id: string;
  uhid: string;
  patientName: string;
  mobile: string;
  department: 'OPD' | 'IPD' | 'Medical' | 'Lab' | 'Scan';
  date: string; // YYYY-MM-DD
  time: string;
  
  // Breakdown Amounts for Table Columns
  doctorFee: number;
  labFee: number;
  scanFee: number;
  pharmacyFee: number;
  discount: number; // EDITABLE!
  
  subtotalAmount: number;
  billedAmount: number; // subtotal - discount
  paidAmount: number;
  balanceAmount: number; // billedAmount - paidAmount
  refundedAmount: number;
  
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Credit';
  cashPaid: number;
  upiPaid: number;
  status: 'Paid' | 'Partial' | 'Pending' | 'Cancelled' | 'Refunded';
  receivedBy: string;
  txnRef: string;

  // Detailed Particulars for Bill Click Modal
  tablets: TabletPurchaseItem[];
  labTests: LabTestItem[];
  scanTests: ScanTestItem[];
  doctorDetails: DoctorFeeItem;

  paymentHistory: PaymentTransaction[];
}

export interface BillingAuditLog {
  id: string;
  billId: string;
  patientName: string;
  action: string;
  user: string;
  date: string;
  notes: string;
}

// Initial Pre-seeded Hospital Billing Records
const INITIAL_BILLS: BillRecord[] = [
  {
    id: 'BILL-2026-089',
    uhid: 'UHID-1001',
    patientName: 'Rajesh Kumar',
    mobile: '9840112233',
    department: 'OPD',
    date: '2026-08-08',
    time: '10:15 AM',
    
    doctorFee: 500,
    labFee: 400,
    scanFee: 0,
    pharmacyFee: 600,
    discount: 0,
    
    subtotalAmount: 1500,
    billedAmount: 1500,
    paidAmount: 1500,
    balanceAmount: 0,
    refundedAmount: 0,

    paymentMode: 'UPI',
    cashPaid: 0,
    upiPaid: 1500,
    status: 'Paid',
    receivedBy: 'Dr. Admin',
    txnRef: 'UPI/609211/GPay',

    doctorDetails: { doctorName: 'Dr. Ramesh (General Medicine)', fee: 500 },
    tablets: [
      { name: 'Tab Amoxicillin 500mg', qty: 2, rate: 120, total: 240 },
      { name: 'Tab Paracetamol 650mg', qty: 3, rate: 120, total: 360 }
    ],
    labTests: [
      { name: 'ECG & Basic Vital Checkup', rate: 400 }
    ],
    scanTests: [],

    paymentHistory: [
      { id: 'TXN-1', date: '2026-08-08 10:15 AM', amount: 1500, mode: 'UPI', refNo: 'UPI/609211/GPay', type: 'Collection', collectedBy: 'Dr. Admin' }
    ]
  },
  {
    id: 'BILL-2026-088',
    uhid: 'UHID-1002',
    patientName: 'Priya Sharma',
    mobile: '9840223344',
    department: 'IPD',
    date: '2026-08-08',
    time: '11:45 AM',

    doctorFee: 25000,
    labFee: 3000,
    scanFee: 5000,
    pharmacyFee: 12000,
    discount: 0,

    subtotalAmount: 45000,
    billedAmount: 45000,
    paidAmount: 25000,
    balanceAmount: 20000,
    refundedAmount: 0,

    paymentMode: 'Bank Transfer',
    cashPaid: 0,
    upiPaid: 0,
    status: 'Partial',
    receivedBy: 'Cashier Priya',
    txnRef: 'NEFT/HDFC/90412',

    doctorDetails: { doctorName: 'Dr. Janani (Chief Gynecologist)', fee: 25000 },
    tablets: [
      { name: 'Inj Pantop 40mg (IV)', qty: 5, rate: 200, total: 1000 },
      { name: 'IV Fluids NS 500ml', qty: 10, rate: 300, total: 3000 },
      { name: 'Surgical Consumables Pack', qty: 1, rate: 8000, total: 8000 }
    ],
    labTests: [
      { name: 'CBC Blood Count & Chemistry', rate: 1200 },
      { name: 'Urinary Routine & Culture', rate: 1800 }
    ],
    scanTests: [
      { name: 'Abdomen & Pelvis USG Scan', rate: 2500 },
      { name: 'Chest X-Ray Digital', rate: 2500 }
    ],

    paymentHistory: [
      { id: 'TXN-2', date: '2026-08-08 11:45 AM', amount: 25000, mode: 'Bank Transfer', refNo: 'NEFT/HDFC/90412', type: 'Collection', collectedBy: 'Cashier Priya' }
    ]
  },
  {
    id: 'BILL-2026-087',
    uhid: 'UHID-1003',
    patientName: 'Karthik Raja',
    mobile: '9840334455',
    department: 'Medical',
    date: '2026-08-07',
    time: '02:30 PM',

    doctorFee: 0,
    labFee: 0,
    scanFee: 0,
    pharmacyFee: 3200,
    discount: 200,

    subtotalAmount: 3400,
    billedAmount: 3200,
    paidAmount: 3200,
    balanceAmount: 0,
    refundedAmount: 0,

    paymentMode: 'Cash',
    cashPaid: 3200,
    upiPaid: 0,
    status: 'Paid',
    receivedBy: 'Pharmacy Admin',
    txnRef: 'CASH-8812',

    doctorDetails: { doctorName: 'Direct Pharmacy Purchase', fee: 0 },
    tablets: [
      { name: 'Tab Amoxicillin 500mg (10s)', qty: 2, rate: 120, total: 240 },
      { name: 'Inj Pantop 40mg', qty: 3, rate: 180, total: 540 },
      { name: 'Surgical Gauze & Antiseptic Gel', qty: 1, rate: 2620, total: 2620 }
    ],
    labTests: [],
    scanTests: [],

    paymentHistory: [
      { id: 'TXN-3', date: '2026-08-07 02:30 PM', amount: 3200, mode: 'Cash', refNo: 'CASH-8812', type: 'Collection', collectedBy: 'Pharmacy Admin' }
    ]
  },
  {
    id: 'BILL-2026-086',
    uhid: 'UHID-1004',
    patientName: 'Sunita Devi',
    mobile: '9840445566',
    department: 'Lab',
    date: '2026-08-07',
    time: '04:15 PM',

    doctorFee: 0,
    labFee: 4800,
    scanFee: 0,
    pharmacyFee: 0,
    discount: 0,

    subtotalAmount: 4800,
    billedAmount: 4800,
    paidAmount: 0,
    balanceAmount: 4800,
    refundedAmount: 0,

    paymentMode: 'Cash',
    cashPaid: 0,
    upiPaid: 0,
    status: 'Pending',
    receivedBy: 'Dr. Admin',
    txnRef: 'N/A',

    doctorDetails: { doctorName: 'Dr. Ramesh (Referred)', fee: 0 },
    tablets: [],
    labTests: [
      { name: 'CBC Blood Count Test', rate: 800 },
      { name: 'Thyroid Profile (T3, T4, TSH)', rate: 1500 },
      { name: 'HbA1c Blood Sugar Test', rate: 1000 },
      { name: 'Comprehensive Lipid Profile', rate: 1500 }
    ],
    scanTests: [],

    paymentHistory: []
  },
  {
    id: 'BILL-2026-085',
    uhid: 'UHID-1005',
    patientName: 'Muneshwari S.',
    mobile: '9840556677',
    department: 'Scan',
    date: '2026-08-06',
    time: '09:00 AM',

    doctorFee: 500,
    labFee: 0,
    scanFee: 6000,
    pharmacyFee: 0,
    discount: 0,

    subtotalAmount: 6500,
    billedAmount: 6500,
    paidAmount: 6500,
    balanceAmount: 0,
    refundedAmount: 0,

    paymentMode: 'Card',
    cashPaid: 0,
    upiPaid: 0,
    status: 'Paid',
    receivedBy: 'Cashier Priya',
    txnRef: 'CARD/POS-9912',

    doctorDetails: { doctorName: 'Dr. Janani', fee: 500 },
    tablets: [],
    labTests: [],
    scanTests: [
      { name: 'Abdomen & Pelvis Ultrasound Scan', rate: 3500 },
      { name: 'Digital Chest X-Ray', rate: 2500 }
    ],

    paymentHistory: [
      { id: 'TXN-4', date: '2026-08-06 09:00 AM', amount: 6500, mode: 'Card', refNo: 'CARD/POS-9912', type: 'Collection', collectedBy: 'Cashier Priya' }
    ]
  }
];

const INITIAL_AUDIT: BillingAuditLog[] = [
  {
    id: 'LOG-B101',
    billId: 'BILL-2026-088',
    patientName: 'Priya Sharma',
    action: 'Partial Payment Collected',
    user: 'Cashier Priya',
    date: '2026-08-08 11:45 AM',
    notes: 'Collected ₹25,000 via NEFT advance for IP Surgery bill. Balance: ₹20,000'
  }
];

const MonitorBilling: React.FC = () => {
  const navigate = useNavigate();
  const { expenses } = useExpense();

  const [bills, setBills] = useState<BillRecord[]>(INITIAL_BILLS);
  const [auditLogs, setAuditLogs] = useState<BillingAuditLog[]>(INITIAL_AUDIT);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'audit'>('dashboard');

  // Quick Filter State
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH'>('ALL');

  // Filter Bar States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'AMT_DESC' | 'AMT_ASC'>('DATE_DESC');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [viewingBill, setViewingBill] = useState<BillRecord | null>(null);
  const [collectingBill, setCollectingBill] = useState<BillRecord | null>(null);
  const [refundingBill, setRefundingBill] = useState<BillRecord | null>(null);
  const [patientHistoryUhid, setPatientHistoryUhid] = useState<string | null>(null);

  // Form State for Collect Payment Modal
  const [collectAmount, setCollectAmount] = useState('');
  const [collectMode, setCollectMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Card'>('Cash');
  const [collectRef, setCollectRef] = useState('');

  // Form State for Refund / Cancel Modal
  const [refundActionType, setRefundActionType] = useState<'Refund' | 'Cancel'>('Refund');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Handle Dynamic Editable Discount Change
  const handleDiscountChange = (billId: string, newDiscountStr: string) => {
    const newDiscount = Math.max(0, parseFloat(newDiscountStr) || 0);

    setBills(prev => prev.map(b => {
      if (b.id !== billId) return b;

      const subtotal = b.doctorFee + b.labFee + b.scanFee + b.pharmacyFee;
      const updatedBilled = Math.max(0, subtotal - newDiscount);
      const updatedBalance = Math.max(0, updatedBilled - b.paidAmount);

      let updatedStatus = b.status;
      if (b.status !== 'Cancelled' && b.status !== 'Refunded') {
        if (updatedBalance === 0) {
          updatedStatus = 'Paid';
        } else if (b.paidAmount > 0) {
          updatedStatus = 'Partial';
        } else {
          updatedStatus = 'Pending';
        }
      }

      return {
        ...b,
        discount: newDiscount,
        subtotalAmount: subtotal,
        billedAmount: updatedBilled,
        balanceAmount: updatedBalance,
        status: updatedStatus
      };
    }));
  };

  // Reset Filters
  const handleResetFilters = () => {
    setQuickFilter('ALL');
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setSelectedDept('ALL');
    setSelectedStatus('ALL');
    setSelectedMode('ALL');
    setSortBy('DATE_DESC');
    setCurrentPage(1);
  };

  // Quick Filter Selector Handle
  const handleQuickFilterSelect = (filter: 'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH') => {
    setQuickFilter(filter);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (filter === 'TODAY') {
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (filter === 'YESTERDAY') {
      const yest = new Date(now);
      yest.setDate(now.getDate() - 1);
      const yestStr = yest.toISOString().split('T')[0];
      setDateFrom(yestStr);
      setDateTo(yestStr);
    } else if (filter === 'WEEK') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      setDateFrom(weekStart.toISOString().split('T')[0]);
      setDateTo(todayStr);
    } else if (filter === 'MONTH') {
      const monthStart = `${todayStr.substring(0, 7)}-01`;
      setDateFrom(monthStart);
      setDateTo(todayStr);
    } else {
      setDateFrom('');
      setDateTo('');
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let todayCollected = 0;
    let totalRefunded = 0;

    const deptCollected = { OPD: 0, IPD: 0, Medical: 0, Lab: 0, Scan: 0 };

    bills.forEach(b => {
      if (b.status !== 'Cancelled') {
        totalBilled += b.billedAmount;
        totalCollected += b.paidAmount;
        totalPending += b.balanceAmount;
        totalRefunded += b.refundedAmount;

        if (b.department in deptCollected) {
          deptCollected[b.department] += b.paidAmount;
        }

        b.paymentHistory.forEach(tx => {
          if (tx.date.startsWith(todayStr) && tx.type === 'Collection') {
            todayCollected += tx.amount;
          }
        });
      }
    });

    return {
      totalBilled,
      totalCollected,
      totalPending,
      todayCollected,
      totalRefunded,
      deptCollected
    };
  }, [bills]);

  // Total Active Expenses for Income vs Expense Statement
  const totalActiveExpenses = useMemo(() => {
    return expenses
      .filter(e => e.status === 'Active')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Filtered and Sorted Bills
  const filteredBills = useMemo(() => {
    return bills.filter(b => {
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const mId = b.id.toLowerCase().includes(query);
        const mUhid = b.uhid.toLowerCase().includes(query);
        const mName = b.patientName.toLowerCase().includes(query);
        const mPhone = b.mobile.includes(query);
        if (!mId && !mUhid && !mName && !mPhone) return false;
      }

      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;

      if (selectedDept !== 'ALL' && b.department !== selectedDept) return false;
      if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
      if (selectedMode !== 'ALL' && b.paymentMode !== selectedMode) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'DATE_DESC') return b.date.localeCompare(a.date);
      if (sortBy === 'DATE_ASC') return a.date.localeCompare(b.date);
      if (sortBy === 'AMT_DESC') return b.billedAmount - a.billedAmount;
      if (sortBy === 'AMT_ASC') return a.billedAmount - b.billedAmount;
      return 0;
    });
  }, [bills, searchTerm, dateFrom, dateTo, selectedDept, selectedStatus, selectedMode, sortBy]);

  // Paginated List
  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(start, start + itemsPerPage);
  }, [filteredBills, currentPage]);

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage) || 1;

  // Handle Submit Collect Pending Payment
  const handleConfirmCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingBill) return;

    const amtNum = parseFloat(collectAmount);
    if (isNaN(amtNum) || amtNum <= 0) {
      alert('Please enter a valid collection amount.');
      return;
    }

    if (amtNum > collectingBill.balanceAmount) {
      alert(`Collection amount cannot exceed remaining balance of ₹${collectingBill.balanceAmount.toLocaleString()}`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTxn: PaymentTransaction = {
      id: `TXN-${Date.now()}`,
      date: formattedDate,
      amount: amtNum,
      mode: collectMode,
      refNo: collectRef.trim() || 'N/A',
      type: 'Collection',
      collectedBy: 'Dr. Admin'
    };

    setBills(prev => prev.map(b => {
      if (b.id !== collectingBill.id) return b;

      const updatedPaid = b.paidAmount + amtNum;
      const updatedBalance = b.billedAmount - updatedPaid;
      const newStatus: BillRecord['status'] = updatedBalance <= 0 ? 'Paid' : 'Partial';

      return {
        ...b,
        paidAmount: updatedPaid,
        balanceAmount: updatedBalance < 0 ? 0 : updatedBalance,
        status: newStatus,
        paymentHistory: [...b.paymentHistory, newTxn]
      };
    }));

    // Add to Audit Log
    const auditEntry: BillingAuditLog = {
      id: `LOG-${Date.now()}`,
      billId: collectingBill.id,
      patientName: collectingBill.patientName,
      action: amtNum === collectingBill.balanceAmount ? 'Full Settlement Collected' : 'Partial Payment Collected',
      user: 'Dr. Admin',
      date: formattedDate,
      notes: `Collected ₹${amtNum.toLocaleString()} via ${collectMode}. Ref: ${collectRef || 'N/A'}`
    };

    setAuditLogs(prev => [auditEntry, ...prev]);

    alert(`Payment of ₹${amtNum.toLocaleString()} recorded successfully for ${collectingBill.id}!`);
    setCollectingBill(null);
    setCollectAmount('');
    setCollectRef('');
  };

  // Handle Confirm Refund / Cancel Bill
  const handleConfirmRefundCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundingBill) return;

    if (!refundReason.trim()) {
      alert('Mandatory audit reason is required for refund or bill cancellation.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (refundActionType === 'Cancel') {
      setBills(prev => prev.map(b => {
        if (b.id !== refundingBill.id) return b;
        return {
          ...b,
          status: 'Cancelled',
          balanceAmount: 0
        };
      }));

      setAuditLogs(prev => [{
        id: `LOG-${Date.now()}`,
        billId: refundingBill.id,
        patientName: refundingBill.patientName,
        action: 'Bill Cancelled',
        user: 'Dr. Admin',
        date: formattedDate,
        notes: `Bill cancelled. Reason: ${refundReason}`
      }, ...prev]);

      alert(`Bill ${refundingBill.id} cancelled successfully.`);
    } else {
      const refAmt = parseFloat(refundAmount);
      if (isNaN(refAmt) || refAmt <= 0) {
        alert('Please enter a valid refund amount.');
        return;
      }

      if (refAmt > refundingBill.paidAmount) {
        alert(`Refund amount cannot exceed total collected amount of ₹${refundingBill.paidAmount.toLocaleString()}`);
        return;
      }

      const refundTxn: PaymentTransaction = {
        id: `TXN-${Date.now()}`,
        date: formattedDate,
        amount: refAmt,
        mode: 'Cash',
        refNo: 'REFUND-VOUCHER',
        type: 'Refund',
        collectedBy: 'Dr. Admin'
      };

      setBills(prev => prev.map(b => {
        if (b.id !== refundingBill.id) return b;
        return {
          ...b,
          refundedAmount: b.refundedAmount + refAmt,
          status: 'Refunded',
          paymentHistory: [...b.paymentHistory, refundTxn]
        };
      }));

      setAuditLogs(prev => [{
        id: `LOG-${Date.now()}`,
        billId: refundingBill.id,
        patientName: refundingBill.patientName,
        action: 'Payment Refunded',
        user: 'Dr. Admin',
        date: formattedDate,
        notes: `Refunded ₹${refAmt.toLocaleString()} to patient. Reason: ${refundReason}`
      }, ...prev]);

      alert(`Refund voucher of ₹${refAmt.toLocaleString()} issued for ${refundingBill.id}.`);
    }

    setRefundingBill(null);
    setRefundAmount('');
    setRefundReason('');
  };

  // Export Table to CSV
  const handleExportCSV = () => {
    const headers = ['Bill ID', 'UHID', 'Patient Name', 'Mobile', 'Department', 'Date', 'Doctor Fee', 'Lab Fee', 'Scan Fee', 'Pharmacy Fee', 'Discount', 'Total Billed', 'Paid Amount', 'Balance Due', 'Status', 'Payment Mode'];
    const rows = filteredBills.map(b => [
      b.id,
      b.uhid,
      `"${b.patientName}"`,
      b.mobile,
      b.department,
      b.date,
      b.doctorFee,
      b.labFee,
      b.scanFee,
      b.pharmacyFee,
      b.discount,
      b.billedAmount,
      b.paidAmount,
      b.balanceAmount,
      b.status,
      b.paymentMode
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hospital_Billing_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="billing-dashboard-container page-transition">
      {/* Header Banner */}
      <div className="billing-header-card">
        <div className="billing-header-left">
          <div className="billing-icon-badge">
            <LineChart size={28} color="#ffffff" />
          </div>
          <div className="billing-title-group">
            <h2>MONITOR BILLING DETAILS</h2>
            <div className="billing-subtitle">
              Shri Janani Hospital • Department Fee Breakdown, Editable Discounts & Itemized Particulars
            </div>
          </div>
        </div>

        <div className="billing-header-actions">
          <button 
            type="button" 
            className="btn-add-expense-primary"
            onClick={handleExportCSV}
            style={{ color: '#1e40af' }}
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>
          <button 
            type="button"
            className="btn-add-expense-primary" 
            onClick={() => window.print()}
            style={{ color: '#1e40af' }}
          >
            <Printer size={16} /> Print Report
          </button>
          <button 
            type="button"
            className="btn-add-expense-primary" 
            onClick={() => navigate(-1)}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Nav Tabs Bar */}
      <div className="billing-nav-bar">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className={`billing-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LineChart size={16} /> Billing History & Table
          </button>
          <button 
            type="button"
            className={`billing-tab-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <TrendingUp size={16} /> Financial Statements & Income vs Expense
          </button>
          <button 
            type="button"
            className={`billing-tab-item ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <History size={16} /> Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD & BILLING HISTORY TABLE */}
      {activeTab === 'dashboard' && (
        <>
          {/* KPI Cards Grid */}
          <div className="billing-summary-grid">
            <div className="kpi-card">
              <div className="kpi-icon-box billed">
                <DollarSign size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Total Billed</span>
                <span className="kpi-amount">₹{stats.totalBilled.toLocaleString()}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box collected">
                <CheckCircle size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Total Collected</span>
                <span className="kpi-amount" style={{ color: '#15803d' }}>₹{stats.totalCollected.toLocaleString()}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box pending">
                <Clock size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Pending Balance</span>
                <span className="kpi-amount" style={{ color: '#d97706' }}>₹{stats.totalPending.toLocaleString()}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box today">
                <Calendar size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Today's Collection</span>
                <span className="kpi-amount" style={{ color: '#0284c7' }}>₹{stats.todayCollected.toLocaleString()}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-box refunded">
                <Ban size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Total Refunded</span>
                <span className="kpi-amount" style={{ color: '#7e22ce' }}>₹{stats.totalRefunded.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Filters Bar Card */}
          <div className="billing-filter-card">
            {/* Quick Filter Buttons */}
            <div className="quick-filter-bar">
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginRight: '6px' }}>
                Quick Date Filters:
              </span>
              <button 
                type="button" 
                className={`quick-filter-btn ${quickFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => handleQuickFilterSelect('ALL')}
              >
                All Time
              </button>
              <button 
                type="button" 
                className={`quick-filter-btn ${quickFilter === 'TODAY' ? 'active' : ''}`}
                onClick={() => handleQuickFilterSelect('TODAY')}
              >
                Today
              </button>
              <button 
                type="button" 
                className={`quick-filter-btn ${quickFilter === 'YESTERDAY' ? 'active' : ''}`}
                onClick={() => handleQuickFilterSelect('YESTERDAY')}
              >
                Yesterday
              </button>
              <button 
                type="button" 
                className={`quick-filter-btn ${quickFilter === 'WEEK' ? 'active' : ''}`}
                onClick={() => handleQuickFilterSelect('WEEK')}
              >
                This Week
              </button>
              <button 
                type="button" 
                className={`quick-filter-btn ${quickFilter === 'MONTH' ? 'active' : ''}`}
                onClick={() => handleQuickFilterSelect('MONTH')}
              >
                This Month
              </button>

              <button 
                type="button" 
                className="btn-reset-filters" 
                onClick={handleResetFilters}
                style={{ marginLeft: 'auto' }}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            </div>

            {/* Filter Inputs Grid */}
            <div className="filter-grid-5">
              <div className="filter-input-group" style={{ gridColumn: 'span 2' }}>
                <label>Search Patient / Bill</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    className="filter-control-box"
                    placeholder="Bill ID, Patient Name, UHID, Mobile..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    style={{ paddingLeft: '34px' }}
                  />
                  <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              <div className="filter-input-group">
                <label>From Date</label>
                <input 
                  type="date"
                  className="filter-control-box"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="filter-input-group">
                <label>To Date</label>
                <input 
                  type="date"
                  className="filter-control-box"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="filter-input-group">
                <label>Department</label>
                <select 
                  className="filter-control-box"
                  value={selectedDept}
                  onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">All Departments</option>
                  <option value="OPD">OPD</option>
                  <option value="IPD">IPD</option>
                  <option value="Medical">Medical / Pharmacy</option>
                  <option value="Lab">Lab</option>
                  <option value="Scan">Scan</option>
                </select>
              </div>

              <div className="filter-input-group">
                <label>Payment Status</label>
                <select 
                  className="filter-control-box"
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Paid">Paid (Full)</option>
                  <option value="Partial">Partial Paid</option>
                  <option value="Pending">Pending (Unpaid)</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div className="filter-input-group">
                <label>Payment Mode</label>
                <select 
                  className="filter-control-box"
                  value={selectedMode}
                  onChange={(e) => { setSelectedMode(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">All Modes</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div className="filter-input-group">
                <label>Sort By</label>
                <select 
                  className="filter-control-box"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="DATE_DESC">Date (Newest First)</option>
                  <option value="DATE_ASC">Date (Oldest First)</option>
                  <option value="AMT_DESC">Amount (High to Low)</option>
                  <option value="AMT_ASC">Amount (Low to High)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing Data Table with requested columns */}
          <div className="billing-table-card">
            <div className="table-toolbar">
              <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>
                Showing <strong>{filteredBills.length}</strong> billing record(s) • Click Bill ID or Patient Name to view Tablets, Lab, Scan & Doctor fee particulars
              </span>

              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
            </div>

            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Bill ID</th>
                    <th>Patient UHID & Name</th>
                    <th>Doctor Fee (₹)</th>
                    <th>Lab Fee (₹)</th>
                    <th>Scan Fee (₹)</th>
                    <th>Pharmacy Fee (₹)</th>
                    <th style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>Discount (₹) [Editable]</th>
                    <th>Total Billed (₹)</th>
                    <th>Paid Amount (₹)</th>
                    <th>Balance Due (₹)</th>
                    <th>Payment Mode</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBills.length === 0 ? (
                    <tr>
                      <td colSpan={13} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        No billing records found matching the selected search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedBills.map(bill => (
                      <tr key={bill.id}>
                        {/* 1. Date & Time */}
                        <td style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: '12px' }}>
                          {bill.date} <br />
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{bill.time}</span>
                        </td>

                        {/* 2. Bill ID (Clickable) */}
                        <td>
                          <span 
                            style={{ color: '#1e40af', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setViewingBill(bill)}
                            title="Click to view full Bill Details (Tablets, Lab, Scan, Doctor Fee)"
                          >
                            {bill.id}
                          </span>
                        </td>

                        {/* 3. Patient UHID & Name (Clickable) */}
                        <td>
                          <strong 
                            style={{ color: '#0f172a', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setViewingBill(bill)}
                            title="Click to view full Bill Details"
                          >
                            {bill.patientName}
                          </strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {bill.uhid} • Ph: {bill.mobile}
                          </div>
                        </td>

                        {/* 4. Doctor Fee */}
                        <td style={{ fontWeight: 600 }}>₹{bill.doctorFee.toLocaleString()}</td>

                        {/* 5. Lab Fee */}
                        <td style={{ fontWeight: 600 }}>₹{bill.labFee.toLocaleString()}</td>

                        {/* 6. Scan Fee */}
                        <td style={{ fontWeight: 600 }}>₹{bill.scanFee.toLocaleString()}</td>

                        {/* 7. Pharmacy Fee */}
                        <td style={{ fontWeight: 600 }}>₹{bill.pharmacyFee.toLocaleString()}</td>

                        {/* 8. EDITABLE DISCOUNT COLUMN */}
                        <td style={{ backgroundColor: '#f0f9ff' }}>
                          <input 
                            type="number"
                            min="0"
                            className="editable-discount-input"
                            value={bill.discount}
                            onChange={(e) => handleDiscountChange(bill.id, e.target.value)}
                            title="Type to edit discount amount in ₹"
                          />
                        </td>

                        {/* 9. Total Billed (Subtotal - Discount) */}
                        <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                          ₹{bill.billedAmount.toLocaleString()}
                        </td>

                        {/* 10. Paid Amount */}
                        <td style={{ fontWeight: 700, color: '#15803d' }}>
                          ₹{bill.paidAmount.toLocaleString()}
                        </td>

                        {/* 11. Balance Due */}
                        <td style={{ fontWeight: 800, color: bill.balanceAmount > 0 ? '#b45309' : '#64748b' }}>
                          ₹{bill.balanceAmount.toLocaleString()}
                        </td>

                        {/* 12. Payment Mode */}
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: bill.paymentMode === 'Cash' ? '#fef3c7' : '#e0f2fe',
                            color: bill.paymentMode === 'Cash' ? '#b45309' : '#0369a1'
                          }}>
                            {bill.paymentMode}
                          </span>
                        </td>

                        {/* 13. Actions */}
                        <td style={{ textAlign: 'center' }}>
                          <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                            <button 
                              type="button" 
                              className="btn-action-icon view"
                              onClick={() => setViewingBill(bill)}
                              title="View Particulars (Tablets, Lab, Scan, Doctor Fee)"
                            >
                              <Eye size={13} /> View
                            </button>

                            {bill.balanceAmount > 0 && bill.status !== 'Cancelled' && (
                              <button 
                                type="button" 
                                className="btn-action-icon edit"
                                onClick={() => {
                                  setCollectingBill(bill);
                                  setCollectAmount(bill.balanceAmount.toString());
                                }}
                                title="Collect Pending Balance"
                              >
                                <DollarSign size={13} /> Collect
                              </button>
                            )}

                            {bill.status !== 'Cancelled' && (
                              <button 
                                type="button" 
                                className="btn-action-icon void"
                                onClick={() => {
                                  setRefundingBill(bill);
                                  setRefundAmount(bill.paidAmount.toString());
                                }}
                                title="Issue Refund / Cancel Bill"
                              >
                                <RotateCcw size={13} /> Refund
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-container">
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Showing Page {currentPage} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn-page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                >
                  Previous Page
                </button>
                <button 
                  type="button" 
                  className="btn-page"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: FINANCIAL REPORTS & STATEMENT */}
      {activeTab === 'reports' && (
        <div className="report-card-grid">
          {/* Income vs Expense Statement */}
          <div className="report-section-box" style={{ gridColumn: 'span 2' }}>
            <div className="report-section-title">
              <span>Hospital Income vs Expense Net Surplus Statement</span>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>August 2026 Financial Summary</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '10px' }}>
                <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Gross Revenue Billed</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>₹{stats.totalBilled.toLocaleString()}</div>
                <span style={{ fontSize: '11px', color: '#166534' }}>Collections: ₹{stats.totalCollected.toLocaleString()}</span>
              </div>

              <div style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', padding: '16px', borderRadius: '10px' }}>
                <span style={{ fontSize: '12px', color: '#be185d', fontWeight: 700, textTransform: 'uppercase' }}>Total Active Expenses</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#be185d', marginTop: '4px' }}>₹{totalActiveExpenses.toLocaleString()}</div>
                <span style={{ fontSize: '11px', color: '#9d174d' }}>Operational & Purchase Costs</span>
              </div>

              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '10px' }}>
                <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Net Hospital Surplus</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: (stats.totalCollected - totalActiveExpenses) >= 0 ? '#1e40af' : '#dc2626', marginTop: '4px' }}>
                  ₹{(stats.totalCollected - totalActiveExpenses).toLocaleString()}
                </div>
                <span style={{ fontSize: '11px', color: '#1d4ed8' }}>Formula: Total Collections - Expenses</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL LOG */}
      {activeTab === 'audit' && (
        <div className="billing-table-card">
          <div className="report-section-title" style={{ marginBottom: '16px' }}>
            <span>Financial Billing Audit Trail ({auditLogs.length} entries)</span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Log Date & Time</th>
                <th>Bill ID</th>
                <th>Patient Name</th>
                <th>Action Performed</th>
                <th>Performed By</th>
                <th>Audit Notes</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: '12px' }}>{log.date}</td>
                  <td style={{ fontWeight: 800, color: '#1e40af' }}>{log.billId}</td>
                  <td style={{ fontWeight: 600 }}>{log.patientName}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: '#fffbeb',
                      color: '#b45309',
                      border: '1px solid #fde68a'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#475569' }}>{log.user}</td>
                  <td style={{ fontSize: '12.5px', color: '#334155' }}>{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: BILL DETAILS PARTICULAR PARTICULARS (TABLETS, LAB, SCAN, DOCTOR FEE) */}
      {viewingBill && (
        <div className="modal-overlay">
          <div className="modal-box-card" style={{ maxWidth: '840px', width: '94%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: 'white', padding: '18px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="white" />
                <div>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Bill Particulars & Itemized Breakdown ({viewingBill.id})</h3>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
                    Patient: {viewingBill.patientName} • UHID: {viewingBill.uhid} • Dept: {viewingBill.department}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setViewingBill(null)} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 1. DOCTOR CONSULTATION DETAILS */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#1e40af', fontWeight: 800, fontSize: '14px' }}>
                  <Stethoscope size={18} />
                  <span>DOCTOR CONSULTATION FEE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                  <div>
                    <strong>{viewingBill.doctorDetails.doctorName}</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Consultation & Clinical Assessment</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    ₹{viewingBill.doctorDetails.fee.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 2. TABLETS & PHARMACY MEDICINES PURCHASED */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#be185d', fontWeight: 800, fontSize: '14px' }}>
                    <Pill size={18} />
                    <span>TABLETS & MEDICINES PURCHASED ({viewingBill.tablets.length})</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#be185d' }}>
                    Subtotal: ₹{viewingBill.pharmacyFee.toLocaleString()}
                  </span>
                </div>

                {viewingBill.tablets.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No pharmacy medicines included in this bill.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tablet / Medicine Name</th>
                        <th style={{ textAlign: 'center' }}>Qty Purchased</th>
                        <th style={{ textAlign: 'right' }}>Unit Rate (₹)</th>
                        <th style={{ textAlign: 'right' }}>Subtotal (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingBill.tablets.map((m, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{m.qty}</td>
                          <td style={{ textAlign: 'right' }}>₹{m.rate.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800 }}>₹{m.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 3. LAB TESTS CONDUCTED */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 800, fontSize: '14px' }}>
                    <TestTube2 size={18} />
                    <span>LAB DIAGNOSTIC TESTS ({viewingBill.labTests.length})</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>
                    Subtotal: ₹{viewingBill.labFee.toLocaleString()}
                  </span>
                </div>

                {viewingBill.labTests.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No lab tests included in this bill.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lab Test Particulars</th>
                        <th style={{ textAlign: 'right' }}>Test Fee (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingBill.labTests.map((t, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{t.name}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{t.rate.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 4. SCAN & RADIOLOGY TESTS */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7e22ce', fontWeight: 800, fontSize: '14px' }}>
                    <Activity size={18} />
                    <span>SCAN & RADIOLOGY REPORTS ({viewingBill.scanTests.length})</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#7e22ce' }}>
                    Subtotal: ₹{viewingBill.scanFee.toLocaleString()}
                  </span>
                </div>

                {viewingBill.scanTests.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No radiology scans included in this bill.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Scan Procedure Name</th>
                        <th style={{ textAlign: 'right' }}>Scan Fee (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingBill.scanTests.map((s, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{s.rate.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Amount Summary Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>SUBTOTAL</span>
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{viewingBill.subtotalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#be185d', fontWeight: 700 }}>DISCOUNT</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#be185d' }}>- ₹{viewingBill.discount.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>PAID AMOUNT</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803d' }}>₹{viewingBill.paidAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 700 }}>BALANCE DUE</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#b45309' }}>₹{viewingBill.balanceAmount.toLocaleString()}</div>
                </div>
              </div>

            </div>

            <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-reset-filters" onClick={() => setViewingBill(null)}>
                Close
              </button>
              <button type="button" className="btn-add-expense-primary" onClick={() => window.print()} style={{ color: '#1e40af' }}>
                <Printer size={16} /> Print Full Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COLLECT PENDING PAYMENT */}
      {collectingBill && (
        <div className="modal-overlay">
          <div className="modal-box-card" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', color: 'white', padding: '16px 20px' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Collect Payment: {collectingBill.id}</h3>
              <button type="button" onClick={() => setCollectingBill(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleConfirmCollect} className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '13px' }}>
                Patient: <strong>{collectingBill.patientName} ({collectingBill.uhid})</strong><br />
                Total Billed: <strong>₹{collectingBill.billedAmount.toLocaleString()}</strong> | Already Paid: <strong style={{ color: '#15803d' }}>₹{collectingBill.paidAmount.toLocaleString()}</strong><br />
                Remaining Balance Due: <strong style={{ color: '#b45309', fontSize: '15px' }}>₹{collectingBill.balanceAmount.toLocaleString()}</strong>
              </div>

              <div className="filter-input-group">
                <label>Collection Amount (₹) <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="number"
                  step="1"
                  max={collectingBill.balanceAmount}
                  className="form-control"
                  placeholder={`Max ₹${collectingBill.balanceAmount}`}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  required
                  style={{ fontSize: '16px', fontWeight: 800 }}
                />
              </div>

              <div className="filter-input-group">
                <label>Payment Mode <span style={{ color: '#dc2626' }}>*</span></label>
                <select className="form-control" value={collectMode} onChange={(e) => setCollectMode(e.target.value as any)}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI (GPay/PhonePe)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Card">Card (POS Swiped)</option>
                </select>
              </div>

              <div className="filter-input-group">
                <label>Txn / Reference Number</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. UPI Txn ID / NEFT Ref"
                  value={collectRef}
                  onChange={(e) => setCollectRef(e.target.value)}
                />
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '10px' }}>
                <button type="button" className="btn-reset-filters" onClick={() => setCollectingBill(null)}>Cancel</button>
                <button type="submit" className="btn-submit-expense" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)' }}>
                  Confirm Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REFUND / CANCEL BILL */}
      {refundingBill && (
        <div className="modal-overlay">
          <div className="modal-box-card" style={{ maxWidth: '520px', width: '90%' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: 'white', padding: '16px 20px' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Refund / Cancel Bill: {refundingBill.id}</h3>
              <button type="button" onClick={() => setRefundingBill(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleConfirmRefundCancel} className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca', fontSize: '13px' }}>
                Patient: <strong>{refundingBill.patientName} ({refundingBill.uhid})</strong><br />
                Collected Amount: <strong style={{ color: '#15803d' }}>₹{refundingBill.paidAmount.toLocaleString()}</strong>
              </div>

              <div className="filter-input-group">
                <label>Action Type</label>
                <select className="form-control" value={refundActionType} onChange={(e) => setRefundActionType(e.target.value as any)}>
                  <option value="Refund">Issue Payment Refund</option>
                  <option value="Cancel">Cancel & Void Entire Bill</option>
                </select>
              </div>

              {refundActionType === 'Refund' && (
                <div className="filter-input-group">
                  <label>Refund Amount (₹) <span style={{ color: '#dc2626' }}>*</span></label>
                  <input 
                    type="number"
                    max={refundingBill.paidAmount}
                    className="form-control"
                    placeholder={`Max ₹${refundingBill.paidAmount}`}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="filter-input-group">
                <label>Reason for Refund / Cancellation <span style={{ color: '#dc2626' }}>*</span></label>
                <textarea 
                  className="form-control"
                  placeholder="Mandatory audit reason..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                  rows={2}
                />
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '10px' }}>
                <button type="button" className="btn-reset-filters" onClick={() => setRefundingBill(null)}>Cancel</button>
                <button type="submit" className="btn-submit-expense" style={{ background: '#dc2626' }}>
                  Execute {refundActionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MonitorBilling;
