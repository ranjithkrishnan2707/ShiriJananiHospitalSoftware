import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, CheckCircle, FileText, User, Phone, Clock, FileWarning, ArrowLeft,
  Calendar, UserCheck, Truck, Package, ShoppingCart, Receipt, ClipboardList,
  Wallet, RotateCcw, FileSpreadsheet, CreditCard, BookOpen, Bell, Building2,
  Database, ShieldCheck, LogOut, X, Plus, Printer, Download, Save, KeyRound,
  MessageSquare, Bed, RefreshCw, ChevronRight, Search, SlidersHorizontal
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import './MedicalDashboard.css';

const MedicalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { prescriptions, markPrescriptionComplete } = useHospital();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  
  // State for active modal dialog
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states for modals
  const [salesYear, setSalesYear] = useState('2026-2027');
  const [activeUser, setActiveUser] = useState('Dr. Admin (Pharmacist)');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Electricity');
  const [expenseAmount, setExpenseAmount] = useState('');

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');
  const filteredPrescriptions = pendingPrescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.uhid.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(searchFilter.toLowerCase())
  );
  
  const selectedPrescription = pendingPrescriptions.find(p => p.id === selectedId);

  // If selected prescription is completed by another action, clear selection
  if (selectedId && !selectedPrescription) {
    setSelectedId(null);
  }

  const handleDispense = (id: string) => {
    if (window.confirm('Are you sure you want to mark this as Dispensed & Completed?')) {
      markPrescriptionComplete(id);
      setSelectedId(null);
    }
  };

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to exit the Medical & Pharmacy module?')) {
      navigate('/');
    }
  };

  // Pharmacy Operations List (Card 1)
  const pharmacyOperationsList = [
    { id: 'product', label: 'Product', icon: <Package size={18} /> },
    { id: 'purchase', label: 'Purchase', icon: <ShoppingCart size={18} /> },
    { id: 'billing', label: 'Billing', icon: <Receipt size={18} /> },
    { id: 'pr-register', label: 'PR Register', icon: <ClipboardList size={18} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
    { id: 'supplier-master', label: 'Supplier Master', icon: <Truck size={18} /> },
    { id: 'sales-return', label: 'Sales Return', icon: <RotateCcw size={18} /> },
    { id: 'custwise-bill', label: 'Sales Report', icon: <FileSpreadsheet size={18} /> },
    { id: 'expenses-entry', label: 'Expenses Entry', icon: <Wallet size={18} /> },
    { id: 'sales-year', label: 'Sales Year', icon: <Calendar size={18} /> },
    { id: 'address-book', label: 'Address Book', icon: <BookOpen size={18} /> },
    { id: 'rc-remainder', label: 'R.C Remainder', icon: <Bell size={18} /> },
    { id: 'sale-company', label: 'Sale Company', icon: <Building2 size={18} /> },
    { id: 'dummy-bill', label: 'Dummy/Insure Bill', icon: <ShieldCheck size={18} /> },
    { id: 'backup', label: 'Backup', icon: <Database size={18} /> },
    { id: 'quit', label: 'Exit', icon: <LogOut size={18} /> },
  ];

  // Help Keys (Keyboard Shortcuts - Card 2)
  const helpKeysList = [
    { key: 'F1', label: 'Supplier Index', modalId: 'supplier-master' },
    { key: 'F2', label: 'Stock Tips', modalId: 'product' },
    { key: 'F3', label: 'General Index', modalId: 'custwise-bill' },
    { key: 'F4', label: 'Product Enquiry', modalId: 'product' },
    { key: 'F5', label: 'Sales Bill', modalId: 'billing' },
    { key: 'F6', label: 'Important Notes', modalId: 'notes-help' },
    { key: 'F7', label: 'IP Patient Issue', modalId: 'ip-issue' },
    { key: 'F8', label: 'IP Issue Return', modalId: 'ip-return' },
    { key: 'F9', label: 'Sales Report', modalId: 'pr-register' },
    { key: 'F10', label: 'Collection Report', modalId: 'payment' },
    { key: 'F11', label: 'Wanted Note', modalId: 'rc-remainder' },
    { key: 'F12', label: 'Wanted Supplier Entry', modalId: 'supplier-master' },
    { key: 'Ctrl + G', label: 'Generic Search', modalId: 'product' },
    { key: 'Ctrl + M', label: 'Product Merge', modalId: 'prod-merge' },
    { key: 'Ctrl + S', label: 'Supplier Compare', modalId: 'sale-company' },
    { key: 'Ctrl + N', label: 'Greetings Entry', modalId: 'greetings' },
    { key: 'Ctrl + K', label: 'Supplier Change', modalId: 'supplier-master' },
    { key: 'Ctrl + E', label: 'Edit Company', modalId: 'sale-company' },
    { key: 'Ctrl + P', label: 'Product Change', modalId: 'product' },
  ];

  // Global Keyboard Listener (F1-F12, Ctrl+Key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') { e.preventDefault(); setActiveModal('supplier-master'); }
      else if (e.key === 'F2') { e.preventDefault(); setActiveModal('product'); }
      else if (e.key === 'F3') { e.preventDefault(); setActiveModal('custwise-bill'); }
      else if (e.key === 'F4') { e.preventDefault(); setActiveModal('product'); }
      else if (e.key === 'F5') { e.preventDefault(); setActiveModal('billing'); }
      else if (e.key === 'F6') { e.preventDefault(); setActiveModal('notes-help'); }
      else if (e.key === 'F7') { e.preventDefault(); setActiveModal('ip-issue'); }
      else if (e.key === 'F8') { e.preventDefault(); setActiveModal('ip-return'); }
      else if (e.key === 'F9') { e.preventDefault(); setActiveModal('pr-register'); }
      else if (e.key === 'F10') { e.preventDefault(); setActiveModal('payment'); }
      else if (e.key === 'F11') { e.preventDefault(); setActiveModal('rc-remainder'); }
      else if (e.key === 'F12') { e.preventDefault(); setActiveModal('supplier-master'); }
      
      else if (e.ctrlKey && (e.key === 'g' || e.key === 'G')) { e.preventDefault(); setActiveModal('product'); }
      else if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) { e.preventDefault(); setActiveModal('prod-merge'); }
      else if (e.ctrlKey && (e.key === 's' || e.key === 'S')) { e.preventDefault(); setActiveModal('sale-company'); }
      else if (e.ctrlKey && (e.key === 'n' || e.key === 'N')) { e.preventDefault(); setActiveModal('greetings'); }
      else if (e.ctrlKey && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setActiveModal('supplier-master'); }
      else if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) { e.preventDefault(); setActiveModal('sale-company'); }
      else if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); setActiveModal('product'); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpClick = (id: string) => {
    if (id === 'quit') {
      handleQuit();
    } else {
      setActiveModal(id);
    }
  };

  const getModalTitle = () => {
    const foundOp = pharmacyOperationsList.find(item => item.id === activeModal);
    if (foundOp) return foundOp.label;
    const helpFound = helpKeysList.find(h => h.modalId === activeModal);
    if (helpFound) return `${helpFound.key}: ${helpFound.label}`;
    return 'Pharmacy Operation';
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'sales-year':
        return (
          <div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
              Select accounting & sales year for pharmacy stock and financial transactions:
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['2026-2027 (Current Active)', '2025-2026', '2024-2025'].map(yr => (
                <button 
                  key={yr}
                  className="form-control"
                  style={{ 
                    padding: '12px 16px', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    borderColor: yr.includes(salesYear) ? '#2563EB' : '#cbd5e1',
                    backgroundColor: yr.includes(salesYear) ? '#EFF6FF' : 'white',
                    color: yr.includes(salesYear) ? '#1E40AF' : '#1E293B'
                  }}
                  onClick={() => {
                    setSalesYear(yr.split(' ')[0]);
                    alert(`Active Sales Year switched to ${yr.split(' ')[0]}`);
                    setActiveModal(null);
                  }}
                >
                  📅 {yr}
                </button>
              ))}
            </div>
          </div>
        );

      case 'user-change':
        return (
          <div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
              Current Active User Session: <strong>{activeUser}</strong>
            </p>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Select User to Switch:</label>
            <select className="form-control" onChange={e => {
              setActiveUser(e.target.value);
              alert(`Switched active user session to ${e.target.value}`);
              setActiveModal(null);
            }}>
              <option value="Dr. Admin (Pharmacist)">Dr. Admin (Pharmacist)</option>
              <option value="Ramesh Kumar (Senior Pharmacist)">Ramesh Kumar (Senior Pharmacist)</option>
              <option value="Anita Sharma (Billing Staff)">Anita Sharma (Billing Staff)</option>
            </select>
          </div>
        );

      case 'supplier-master':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Add New Supplier / Vendor</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="Supplier Company Name" value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} />
              <input type="text" className="form-control" placeholder="Contact Phone No" value={newSupplierPhone} onChange={e => setNewSupplierPhone(e.target.value)} />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              if(!newSupplierName) return alert('Enter supplier name');
              alert(`Supplier "${newSupplierName}" added successfully!`);
              setNewSupplierName('');
              setNewSupplierPhone('');
              setActiveModal(null);
            }}>
              <Save size={16} /> Save Supplier
            </button>

            <h4 style={{ margin: '24px 0 12px 0', fontSize: '15px' }}>Registered Pharmacy Suppliers</h4>
            <table className="medication-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>SUPPLIER NAME</th>
                  <th>PHONE</th>
                  <th>CITY</th>
                  <th>GST NO</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Sun Pharma Distributors</td><td>9876543210</td><td>Chennai</td><td>33AAAAC1234A1Z1</td></tr>
                <tr><td>Cipla Healthcare Ltd</td><td>8765432109</td><td>Erode</td><td>33BBBBC5678B1Z2</td></tr>
                <tr><td>Mankind Pharma Agencies</td><td>7654321098</td><td>Coimbatore</td><td>33CCCC19101C1Z3</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'product':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Product & Medicine Inventory Master</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="Medicine Brand Name (e.g. Paracetamol 650mg)" value={newProductName} onChange={e => setNewProductName(e.target.value)} />
              <input type="text" className="form-control" placeholder="Price (₹)" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px', marginBottom: '20px' }} onClick={() => {
              if(!newProductName) return alert('Enter medicine product name');
              alert(`Product "${newProductName}" added to stock master!`);
              setNewProductName('');
              setNewProductPrice('');
              setActiveModal(null);
            }}>
              <Plus size={16} /> Add Product
            </button>

            <table className="medication-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>MEDICINE NAME</th>
                  <th>STOCK QTY</th>
                  <th>MRP (₹)</th>
                  <th>EXPIRY</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tab. Paracetamol 650mg</td><td>500 Strips</td><td>₹32.00</td><td>2028-12</td></tr>
                <tr><td>Inj. Amikacin 500mg</td><td>120 Vials</td><td>₹145.00</td><td>2027-08</td></tr>
                <tr><td>Syp. Benadryl 100ml</td><td>85 Bottles</td><td>₹110.00</td><td>2027-05</td></tr>
                <tr><td>Tab. Pantocid 40mg</td><td>350 Strips</td><td>₹98.00</td><td>2028-04</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'purchase':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Purchase Entry Form</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input type="text" className="form-control" placeholder="Inv / Bill No" defaultValue="PUR-2026-88" />
              <select className="form-control">
                <option>Sun Pharma Distributors</option>
                <option>Cipla Healthcare Ltd</option>
              </select>
              <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="Medicine Name" defaultValue="Tab Amoxicillin 500mg" />
              <input type="number" className="form-control" placeholder="Qty" defaultValue="100" />
              <input type="text" className="form-control" placeholder="Purchase Rate (₹)" defaultValue="45.00" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Purchase entry saved to inventory stock successfully!');
              setActiveModal(null);
            }}>
              <Save size={16} /> Save Purchase Entry
            </button>
          </div>
        );

      case 'billing':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Pharmacy POS Sales Counter</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input type="text" className="form-control" placeholder="Patient / Customer Name" defaultValue="Karthik Raja" />
              <input type="text" className="form-control" placeholder="UHID / Phone" defaultValue="UHID-3490" />
            </div>
            <table className="medication-table" style={{ width: '100%', marginBottom: '16px' }}>
              <thead>
                <tr><th>MEDICINE</th><th>QTY</th><th>RATE</th><th>TOTAL</th></tr>
              </thead>
              <tbody>
                <tr><td>Tab Paracetamol 650mg</td><td>2 Strips</td><td>₹32.00</td><td>₹64.00</td></tr>
                <tr><td>Syp Benadryl 100ml</td><td>1 Bottle</td><td>₹110.00</td><td>₹110.00</td></tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Total Payable: ₹174.00</div>
              <button className="btn-erp-dispense" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={() => {
                alert('Pharmacy POS Bill Printed & Receipt Generated!');
                setActiveModal(null);
              }}>
                <Printer size={16} /> Print POS Bill
              </button>
            </div>
          </div>
        );

      case 'pr-register':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Purchase & Purchase Return Register</h4>
            <table className="medication-table" style={{ width: '100%' }}>
              <thead>
                <tr><th>TYPE</th><th>INV NO</th><th>DATE</th><th>SUPPLIER</th><th>AMOUNT</th></tr>
              </thead>
              <tbody>
                <tr><td><span style={{ color: 'green', fontWeight: 700 }}>PURCHASE</span></td><td>PUR-901</td><td>2026-07-28</td><td>Sun Pharma</td><td>₹45,200</td></tr>
                <tr><td><span style={{ color: 'red', fontWeight: 700 }}>RETURN</span></td><td>PR-102</td><td>2026-07-25</td><td>Cipla Ltd</td><td>₹3,400</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'expenses-entry':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Pharmacy Expenses Logger</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <select className="form-control" value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)}>
                <option value="Electricity">Electricity & Utility</option>
                <option value="Freight">Transport & Freight</option>
                <option value="Refreshment">Staff Refreshments</option>
                <option value="Maintenance">Store Maintenance</option>
              </select>
              <input type="number" className="form-control" placeholder="Amount (₹)" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              if(!expenseAmount) return alert('Enter expense amount');
              alert(`Expense of ₹${expenseAmount} (${expenseCategory}) logged!`);
              setExpenseAmount('');
              setActiveModal(null);
            }}>
              <Wallet size={16} /> Record Expense
            </button>
          </div>
        );

      case 'sales-return':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Medicine Sales Return & Credit Note</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="Original Bill No (e.g. OPB-101)" />
              <input type="text" className="form-control" placeholder="Refund Amount (₹)" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Sales Return & Refund Voucher issued successfully!');
              setActiveModal(null);
            }}>
              <RotateCcw size={16} /> Process Return
            </button>
          </div>
        );

      case 'custwise-bill':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Customer-Wise Sales Billing Report</h4>
            <input type="text" className="form-control" placeholder="Search Customer Name or Phone..." style={{ marginBottom: '12px' }} />
            <table className="medication-table" style={{ width: '100%' }}>
              <thead>
                <tr><th>PATIENT / CUSTOMER</th><th>BILL NO</th><th>DATE</th><th>TOTAL AMOUNT</th></tr>
              </thead>
              <tbody>
                <tr><td>Jaya Sudha</td><td>OPB-101</td><td>2026-07-30</td><td>₹500.00</td></tr>
                <tr><td>Deepika</td><td>OPB-102</td><td>2026-07-29</td><td>₹700.00</td></tr>
                <tr><td>Muneshwari</td><td>OPB-103</td><td>2026-07-28</td><td>₹600.00</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'payment':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Supplier Payment Voucher Entry</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <select className="form-control">
                <option>Sun Pharma Distributors (Bal: ₹12,400)</option>
                <option>Cipla Healthcare (Bal: ₹8,900)</option>
              </select>
              <input type="number" className="form-control" placeholder="Payment Amount (₹)" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Supplier Payment Voucher Recorded!');
              setActiveModal(null);
            }}>
              <CreditCard size={16} /> Submit Payment
            </button>
          </div>
        );

      case 'address-book':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Pharmacy Address Book Directory</h4>
            <table className="medication-table" style={{ width: '100%' }}>
              <thead>
                <tr><th>CATEGORY</th><th>NAME</th><th>PHONE</th><th>CITY</th></tr>
              </thead>
              <tbody>
                <tr><td>Supplier</td><td>Sun Pharma Distributors</td><td>9876543210</td><td>Chennai</td></tr>
                <tr><td>Doctor</td><td>Dr. G. Sri Janani</td><td>9486640452</td><td>Erode</td></tr>
                <tr><td>Patient</td><td>Rajesh Kumar</td><td>9876500000</td><td>Chennai</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'rc-remainder':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Reorder Level & Expiry Reminders (R.C)</h4>
            <div style={{ background: '#FFF3E0', padding: '12px', borderRadius: '8px', border: '1px solid #FFE0B2', marginBottom: '16px' }}>
              <h5 style={{ color: '#E65100', margin: '0 0 8px 0' }}>⚠️ Low Stock Alert (Reorder Needed)</h5>
              <p style={{ margin: 0, fontSize: '13px' }}>1. Inj. Atropine 0.6mg — Only 12 Vials Remaining</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>2. Tab. Divalproex 500mg — Only 28 Strips Remaining</p>
            </div>
            <div style={{ background: '#FFEBEE', padding: '12px', borderRadius: '8px', border: '1px solid #FFCDD2' }}>
              <h5 style={{ color: '#C62828', margin: '0 0 8px 0' }}>⏳ Upcoming Medicine Expiry (&lt; 60 Days)</h5>
              <p style={{ margin: 0, fontSize: '13px' }}>1. Batch #SP-2024 (Syp Cough relief) — Expires 2026-08-30</p>
            </div>
          </div>
        );

      case 'sale-company':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Company-Wise Sales Breakdown</h4>
            <table className="medication-table" style={{ width: '100%' }}>
              <thead>
                <tr><th>MANUFACTURER / COMPANY</th><th>TOTAL UNITS SOLD</th><th>TOTAL SALES (₹)</th></tr>
              </thead>
              <tbody>
                <tr><td>Sun Pharmaceutical Industries</td><td>1,420 Units</td><td>₹84,500.00</td></tr>
                <tr><td>Cipla Healthcare Ltd</td><td>980 Units</td><td>₹62,100.00</td></tr>
                <tr><td>Mankind Pharma Ltd</td><td>650 Units</td><td>₹34,800.00</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 'backup':
        return (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Database size={60} color="#2563EB" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontSize: '16px' }}>Pharmacy Database & Stock Backup</h4>
            <p style={{ color: '#64748B', marginBottom: '24px', fontSize: '13px' }}>Download the latest backup archive of pharmacy stock, purchases, and sales ledgers.</p>
            <button className="btn-erp-dispense" style={{ margin: '0 auto' }} onClick={() => {
              alert('Pharmacy Backup Archive (.JSON/.CSV) downloaded successfully!');
              setActiveModal(null);
            }}>
              <Download size={18} /> Download Backup Now
            </button>
          </div>
        );

      case 'dummy-bill':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Insurance Proforma & Dummy Bill Generator</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="Insurance Claim / Policy No" defaultValue="INS-99412" />
              <input type="text" className="form-control" placeholder="Policyholder Name" defaultValue="Rajesh Kumar" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Insurance Proforma Invoice Generated & Ready for Print!');
              setActiveModal(null);
            }}>
              <Printer size={16} /> Generate Insurance Proforma
            </button>
          </div>
        );

      case 'notes-help':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Pharmacy Important Notes (F6 Shortcut)</h4>
            <textarea className="form-control" rows={4} placeholder="Type important pharmacy notes or shift handover instructions..." defaultValue="1. Check cold storage temperature at 6:00 PM&#10;2. Restock Amoxicillin 500mg from main store" />
            <button className="btn-erp-dispense" style={{ marginTop: '12px', padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Pharmacy Note saved!');
              setActiveModal(null);
            }}>
              <Save size={16} /> Save Notes
            </button>
          </div>
        );

      case 'ip-issue':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>IP Patient Direct Medicine Issue (F7 Shortcut)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="IP Patient ID / Bed No" defaultValue="IPID-48 (Bed 04)" />
              <input type="text" className="form-control" placeholder="Medicine Requested" defaultValue="Inj Pantop 40mg" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Medicines issued directly to IP Bed!');
              setActiveModal(null);
            }}>
              <Bed size={16} /> Issue to IP Ward
            </button>
          </div>
        );

      case 'ip-return':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>IP Issue Return & Refund (F8 Shortcut)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="IP ID" defaultValue="IPID-48" />
              <input type="text" className="form-control" placeholder="Unused Medicine Returned" defaultValue="1 Vial Inj Amikacin" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('IP Medicine Return accepted & credited back!');
              setActiveModal(null);
            }}>
              <RefreshCw size={16} /> Accept Return
            </button>
          </div>
        );

      case 'prod-merge':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Product Merge Utility (Ctrl + M)</h4>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>Merge duplicate medicine codes into a single primary stock item:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input type="text" className="form-control" placeholder="Duplicate Code" defaultValue="MED-1049" />
              <input type="text" className="form-control" placeholder="Target Master Code" defaultValue="MED-1001" />
            </div>
            <button className="btn-erp-dispense" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Products merged successfully!');
              setActiveModal(null);
            }}>
              <Save size={16} /> Execute Merge
            </button>
          </div>
        );

      case 'greetings':
        return (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Greetings & Patient SMS Manager (Ctrl + N)</h4>
            <textarea className="form-control" rows={3} defaultValue="Dear Patient, Shri Janani Hospital wishes you good health! Take your prescribed medicines on time." />
            <button className="btn-erp-dispense" style={{ marginTop: '12px', padding: '8px 18px', fontSize: '13px' }} onClick={() => {
              alert('Greeting template updated!');
              setActiveModal(null);
            }}>
              <MessageSquare size={16} /> Update Greeting
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMedicinesTable = (medicinesText: string) => {
    if (!medicinesText) return <p style={{ color: '#64748B' }}>No medicines prescribed.</p>;

    const lines = medicinesText
      .split(/\n|,/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return (
      <div style={{ overflowX: 'auto', marginTop: '10px' }}>
        <table className="medication-table" style={{ width: '100%', background: 'white', borderRadius: '10px', overflow: 'hidden', border: '1px solid #BFDBFE' }}>
          <thead>
            <tr style={{ background: '#DBEAFE', color: '#1E40AF', fontSize: '12px' }}>
              <th style={{ padding: '10px 14px', width: '45px', textAlign: 'center' }}>#</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>MEDICINE NAME</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>DOSAGE / FREQUENCY</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>TIMING</th>
              <th style={{ padding: '10px 14px', textAlign: 'center' }}>DURATION</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => {
              const parts = line.split(/-|—|:/).map(p => p.trim());
              const name = parts[0] || line;
              const dosage = parts[1] || '1 Tab / 5ml';
              const timing = parts[2] || 'AF (After Food)';
              const duration = parts[3] || '5 Days';

              return (
                <tr key={index} style={{ borderBottom: '1px solid #E2E8F0', fontSize: '13px' }}>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#2563EB' }}>{index + 1}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Pill size={15} color="#2563EB" />
                      <span>{name.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>{dosage}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      {timing}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{duration}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="medical-erp-container page-transition">
      
      {/* CENTER COLUMN (55% Layout Area) */}
      <div className="erp-center-column">
        
        {/* Header Banner */}
        <div className="erp-header-banner">
          <div className="banner-title-area">
            <div className="banner-icon-badge">
              <Pill size={28} />
            </div>
            <div className="banner-text">
              <h2>Pharmacy & Medical Module</h2>
              <p>Hospital ERP Master Inventory, Sales Counter & Prescription Dispensing</p>
            </div>
          </div>
          <div className="banner-actions">
            <button 
              type="button" 
              className="btn-erp-back" 
              onClick={() => navigate(-1)} 
              title="Go to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Large Card: Pending Prescriptions Feed */}
        <div className="erp-prescription-card">
          <div className="erp-card-header">
            <div className="card-header-title">
              <FileText size={20} color="#2563EB" />
              <span>Pending Prescriptions Feed</span>
              <span className="badge-pending-count">{pendingPrescriptions.length} Active Orders</span>
            </div>
            <div className="search-input-wrapper" style={{ width: '280px' }}>
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search patient, UHID or doctor..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="full-prescription-feed-container">
            {filteredPrescriptions.length === 0 ? (
              <div className="erp-empty-state" style={{ padding: '60px 20px' }}>
                <CheckCircle size={48} color="#16A34A" style={{ opacity: 0.6, marginBottom: '12px' }} />
                <h4 style={{ margin: 0, fontSize: '15px', color: '#1E293B', fontWeight: 700 }}>All Clear! No Pending Prescriptions</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>New OPD & IPD prescriptions from doctors will appear here automatically.</p>
              </div>
            ) : (
              <div className="prescription-grid-feed">
                {filteredPrescriptions.map(p => (
                  <div 
                    key={p.id} 
                    className="erp-prescription-feed-card"
                    onClick={() => setSelectedId(p.id)}
                  >
                    <div className="feed-card-header">
                      <div className="feed-patient-name">{p.patientName}</div>
                      <span className="feed-time-tag">{p.time}</span>
                    </div>
                    
                    <div className="feed-card-body">
                      <div className="feed-meta-row">
                        <span>UHID: <strong>{p.uhid}</strong></span>
                        <span>Doctor: <strong>{p.doctorName}</strong></span>
                      </div>
                      
                      <div className="feed-diagnosis-tag">
                        Diagnosis: {p.diagnosis || 'General Consultation'}
                      </div>

                      <div className="feed-medicines-preview">
                        💊 {p.medicines.length > 65 ? p.medicines.substring(0, 65) + '...' : p.medicines}
                      </div>
                    </div>

                    <div className="feed-card-footer">
                      <span className="btn-view-details">
                        View Details & Dispense <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>



      {/* RIGHT SIDEBAR: Pharmacy Operations Card */}
      <div className="erp-right-sidebar">
        
        {/* Pharmacy Operations Card */}
        <div className="erp-sidebar-card">
          <div className="sidebar-card-title">
            <SlidersHorizontal size={18} color="#2563EB" />
            <span>Pharmacy Operations</span>
          </div>

          <div className="operations-vertical-list">
            {pharmacyOperationsList.map(op => (
              <button 
                key={op.id}
                type="button"
                className={`erp-op-button ${op.id === 'quit' ? 'btn-op-exit' : ''}`}
                onClick={() => handleOpClick(op.id)}
              >
                <div className="op-left-content">
                  <span className="op-icon-badge">{op.icon}</span>
                  <span>{op.label}</span>
                </div>
                <ChevronRight size={16} className="op-arrow" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Selected Prescription Details Modal Card Popup */}
      {selectedPrescription && (
        <div className="erp-modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="erp-modal-card" style={{ maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
            <div className="erp-modal-header">
              <h3>
                <Pill size={22} color="#93C5FD" />
                Prescription Details — {selectedPrescription.patientName} ({selectedPrescription.uhid})
              </h3>
              <button className="erp-modal-close" onClick={() => setSelectedId(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="erp-modal-body">
              {/* Patient & Doctor Grid */}
              <div className="details-section-grid">
                <div className="erp-info-card">
                  <div className="info-card-label"><User size={14} color="#2563EB" /> Patient Info</div>
                  <div className="info-card-value">{selectedPrescription.patientName}</div>
                  <div className="info-card-subtext">ID: {selectedPrescription.patientId} • UHID: {selectedPrescription.uhid}</div>
                </div>

                <div className="erp-info-card">
                  <div className="info-card-label"><Clock size={14} color="#2563EB" /> Consultation</div>
                  <div className="info-card-value">{selectedPrescription.doctorName}</div>
                  <div className="info-card-subtext">{selectedPrescription.date} at {selectedPrescription.time}</div>
                </div>

                <div className="erp-info-card">
                  <div className="info-card-label"><Phone size={14} color="#2563EB" /> Contact Number</div>
                  <div className="info-card-value">{selectedPrescription.phone || 'N/A'}</div>
                </div>

                <div className="erp-info-card">
                  <div className="info-card-label" style={{ color: '#DC2626' }}>Diagnosis Report</div>
                  <div className="info-card-value" style={{ color: '#DC2626' }}>{selectedPrescription.diagnosis || 'General OPD'}</div>
                </div>
              </div>

              {/* Prescribed Medicines Box - One by One Table */}
              <div className="erp-medicines-card">
                <div className="medicines-card-title">
                  <Pill size={16} /> Prescribed Medicines (Dosage & Instructions Table)
                </div>
                {renderMedicinesTable(selectedPrescription.medicines)}
              </div>

              {/* Examination Notes */}
              {selectedPrescription.notes && (
                <div className="erp-notes-card">
                  <div className="notes-card-title">
                    <FileWarning size={14} /> Doctor Examination Notes
                  </div>
                  <div className="notes-text-body">
                    {selectedPrescription.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="erp-modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="form-control" 
                style={{ width: 'auto', padding: '8px 20px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px' }}
                onClick={() => setSelectedId(null)}
              >
                Close
              </button>
              <button 
                className="btn-erp-dispense"
                onClick={() => handleDispense(selectedPrescription.id)}
              >
                <CheckCircle size={20} />
                <span>Dispense & Complete Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active ERP Modal Dialog Overlay */}
      {activeModal && (
        <div className="erp-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="erp-modal-card" onClick={e => e.stopPropagation()}>
            <div className="erp-modal-header">
              <h3>
                <Pill size={20} color="#93C5FD" />
                {getModalTitle()}
              </h3>
              <button className="erp-modal-close" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              {renderModalContent()}
            </div>
            <div className="erp-modal-footer">
              <button 
                type="button"
                className="form-control" 
                style={{ width: 'auto', padding: '8px 20px', fontWeight: 600, cursor: 'pointer', borderRadius: '8px' }}
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicalDashboard;
