import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Receipt, Save, Printer, RotateCcw, Trash2, Plus, Trash, LogOut, 
  X, Clock, User, FileText, Tag, CreditCard, DollarSign, AlertTriangle, AlertCircle 
} from 'lucide-react';
import './MedicalSalesBillingScreen.css';

interface MedicalSalesBillingScreenProps {
  onClose: () => void;
}

interface SalesItemRow {
  id: string;
  productName: string;
  batchNo: string;
  expDate: string;
  qty: string;
  taxPercent: string;
  mrp: string;
  amount: string;
}

interface MedicineStockPreset {
  name: string;
  batchNo: string;
  expDate: string;
  mrp: string;
}

// Sample Stock Master Medicines with Expiry Dates
const SAMPLE_MEDICINE_STOCK: MedicineStockPreset[] = [
  { name: 'Tab. Paracetamol 650mg', batchNo: 'BT-901', expDate: '30-08-2026', mrp: '32.00' },
  { name: 'Inj. Amikacin 500mg', batchNo: 'BT-882', expDate: '22-08-2026', mrp: '145.00' },
  { name: 'Syp. Cough Relief 100ml', batchNo: 'BT-704', expDate: '10-08-2026', mrp: '110.00' },
  { name: 'Tab. Pantocid 40mg', batchNo: 'BT-990', expDate: '31-12-2027', mrp: '98.00' },
  { name: 'Tab. Amoxicillin 500mg', batchNo: 'BT-551', expDate: '28-08-2026', mrp: '45.00' }
];

export interface ExpiryStatus {
  status: 'valid' | 'near_expiry' | 'expired';
  daysLeft: number;
  message: string;
}

// Function to check Expiry Date (Supports 30-08-2026, 2026-08-30, 08/26, 30/08/2026)
const checkExpiryStatus = (expStr: string): ExpiryStatus => {
  if (!expStr || !expStr.trim()) return { status: 'valid', daysLeft: 999, message: '' };

  // Current System Date (2026-08-15)
  const now = new Date('2026-08-15');
  let expDate: Date | null = null;
  const s = expStr.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    expDate = new Date(s);
  } else if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(s)) {
    const [d, m, y] = s.split(/[\/\-]/);
    expDate = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  } else if (/^\d{2}[\/\-]\d{2}$/.test(s)) {
    const [m, y] = s.split(/[\/\-]/);
    const year = 2000 + parseInt(y, 10);
    expDate = new Date(year, parseInt(m, 10), 0);
  } else if (/^\d{2}[\/\-]\d{4}$/.test(s)) {
    const [m, y] = s.split(/[\/\-]/);
    expDate = new Date(parseInt(y, 10), parseInt(m, 10), 0);
  }

  if (!expDate || isNaN(expDate.getTime())) return { status: 'valid', daysLeft: 999, message: '' };

  const diffTime = expDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: 'expired',
      daysLeft,
      message: `⛔ EXPIRED MEDICINE: Expired on ${expStr}! Selling expired medicine is strictly prohibited.`
    };
  } else if (daysLeft <= 30) {
    return {
      status: 'near_expiry',
      daysLeft,
      message: `⚠️ NEAR EXPIRY ALERT: Expires on ${expStr} (${daysLeft} days remaining)! Alert active (Aug 20 to Aug 30).`
    };
  }

  return { status: 'valid', daysLeft, message: '' };
};

const createEmptyRow = (id: string): SalesItemRow => ({
  id,
  productName: '',
  batchNo: '',
  expDate: '',
  qty: '1',
  taxPercent: '12',
  mrp: '',
  amount: ''
});

const MedicalSalesBillingScreen: React.FC<MedicalSalesBillingScreenProps> = ({ onClose }) => {
  // Live Clock Time State
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form Fields State
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [billType, setBillType] = useState('Cash');
  const [pCode, setPCode] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('Mr.');
  const [patientName, setPatientName] = useState('');
  const [address, setAddress] = useState('');
  const [place, setPlace] = useState('');
  const [doctorName, setDoctorName] = useState('DR.G.SRI JANANI,MD(OG)');

  // Calculation Fields State
  const [lessDisPercent, setLessDisPercent] = useState('');
  const [amtTendered, setAmtTendered] = useState('');

  // Items Table State - Pre-fill one sample row for demonstration
  const [items, setItems] = useState<SalesItemRow[]>([
    {
      id: '1',
      productName: 'Tab. Paracetamol 650mg',
      batchNo: 'BT-901',
      expDate: '30-08-2026',
      qty: '2',
      taxPercent: '12',
      mrp: '32.00',
      amount: '64.00'
    }
  ]);

  const handleAddRow = () => {
    setItems(prev => [...prev, createEmptyRow(Date.now().toString())]);
  };

  const handleRemoveRow = (id: string) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRemoveLastRow = () => {
    if (items.length <= 1) return;
    setItems(prev => prev.slice(0, -1));
  };

  const handleItemChange = (id: string, field: keyof SalesItemRow, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };

      // Auto fill batch, expDate, mrp if productName matches preset stock
      if (field === 'productName') {
        const found = SAMPLE_MEDICINE_STOCK.find(s => s.name.toLowerCase() === value.toLowerCase());
        if (found) {
          updated.batchNo = found.batchNo;
          updated.expDate = found.expDate;
          updated.mrp = found.mrp;
        }
      }

      const qtyNum = parseFloat(updated.qty) || 0;
      const mrpNum = parseFloat(updated.mrp) || 0;
      const lineTotal = qtyNum * mrpNum;

      updated.amount = lineTotal > 0 ? lineTotal.toFixed(2) : '';
      return updated;
    }));
  };

  // Check all items in bill for near-expiry or expired status
  const itemExpiryStatuses = items.map(item => ({
    item,
    expiryInfo: checkExpiryStatus(item.expDate)
  }));

  const alertItems = itemExpiryStatuses.filter(i => i.expiryInfo.status !== 'valid');
  const hasExpiredItem = alertItems.some(i => i.expiryInfo.status === 'expired');

  // Calculations Summary
  const grossTotal = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const disPercentNum = parseFloat(lessDisPercent) || 0;
  const discountAmt = (grossTotal * disPercentNum) / 100;
  const netAmount = Math.max(0, grossTotal - discountAmt);

  const handleSave = () => {
    if (!patientName.trim()) return alert('Please enter Patient Name (P.Name)');
    if (hasExpiredItem) {
      if (!window.confirm('⚠️ WARNING: You have EXPIRED medicines in this bill! Are you sure you want to proceed?')) {
        return;
      }
    }
    alert(`Medicine Sales Bill saved successfully for ${titlePrefix} ${patientName}! Net Total: ₹${netAmount.toFixed(2)}`);
  };

  const handleClear = () => {
    setBillNo('');
    setPCode('');
    setTitlePrefix('Mr.');
    setPatientName('');
    setAddress('');
    setPlace('');
    setDoctorName('DR.G.SRI JANANI,MD(OG)');
    setLessDisPercent('');
    setAmtTendered('');
    setItems([createEmptyRow('1')]);
  };

  return ReactDOM.createPortal(
    <div className="msb-overlay">
      <div className="msb-window">

        {/* --- HEADER BANNER --- */}
        <div className="msb-header-banner">
          <div className="msb-header-left">
            <div className="msb-header-icon-box">
              <Receipt size={24} />
            </div>
            <div className="msb-header-titles">
              <h2>
                Medicine Sales Billing Screen - I
                <span className="msb-doctor-chip">DR. G. SRI JANANI, MD (OG)</span>
              </h2>
              <p>OPD & Retail medicine prescription sales billing & POS checkout</p>
            </div>
          </div>

          <div className="msb-header-actions">
            <div className="msb-time-badge">
              <Clock size={14} /> Time: {currentTime}
            </div>
            <button className="msb-top-close" onClick={onClose} title="Close Window">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- MAIN BODY --- */}
        <div className="msb-main-body">

          {/* TOP SECTION: PATIENT & BILLING DETAILS CARD */}
          <div className="msb-top-card">
            <div className="msb-form-grid-4">
              
              <div className="msb-form-group">
                <label className="msb-label">Bill No</label>
                <input
                  type="text"
                  className="msb-input"
                  value={billNo}
                  onChange={e => setBillNo(e.target.value)}
                  placeholder="e.g. BILL-686"
                />
              </div>

              <div className="msb-form-group">
                <label className="msb-label">Date</label>
                <input
                  type="date"
                  className="msb-input"
                  value={billDate}
                  onChange={e => setBillDate(e.target.value)}
                />
              </div>

              <div className="msb-form-group">
                <label className="msb-label red">Type<span className="msb-req">*</span></label>
                <select
                  className="msb-select"
                  value={billType}
                  onChange={e => setBillType(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI / GPay</option>
                  <option value="Future Payment">Future Payment</option>
                  <option value="IP Bill">IP Ward Bill</option>
                </select>
              </div>

              <div className="msb-form-group">
                <label className="msb-label">P.Code</label>
                <input
                  type="text"
                  className="msb-input"
                  value={pCode}
                  onChange={e => setPCode(e.target.value)}
                  placeholder="Patient Code (UHID)"
                />
              </div>

              <div className="msb-form-group" style={{ gridColumn: 'span 2' }}>
                <label className="msb-label red">P.Name (Patient Name)<span className="msb-req">*</span></label>
                <div className="msb-name-input-group">
                  <select
                    className="msb-select msb-name-prefix"
                    value={titlePrefix}
                    onChange={e => setTitlePrefix(e.target.value)}
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Baby">Baby</option>
                    <option value="Master">Master</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input
                    type="text"
                    className="msb-input"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="Enter full patient name"
                  />
                </div>
              </div>

              <div className="msb-form-group">
                <label className="msb-label">Place</label>
                <input
                  type="text"
                  className="msb-input"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder="City / Place"
                />
              </div>

              <div className="msb-form-group">
                <label className="msb-label red">Doctor<span className="msb-req">*</span></label>
                <input
                  type="text"
                  className="msb-input"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  placeholder="Prescribing Doctor"
                />
              </div>

              <div className="msb-form-group" style={{ gridColumn: 'span 4' }}>
                <label className="msb-label">Address</label>
                <input
                  type="text"
                  className="msb-input"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Patient residential address"
                />
              </div>

            </div>
          </div>

          {/* EXPIRY ALERT NOTIFICATION BANNER */}
          {alertItems.length > 0 && (
            <div className={`msb-expiry-alert-banner ${hasExpiredItem ? 'has-expired' : ''}`}>
              <div className={`alert-banner-header ${hasExpiredItem ? 'error' : 'warning'}`}>
                {hasExpiredItem ? <AlertCircle size={18} /> : <AlertTriangle size={18} />}
                <span>
                  {hasExpiredItem ? '⛔ CRITICAL EXPIRED MEDICINE WARNING IN BILL!' : '⚠️ MEDICINE NEAR-EXPIRY ALERT NOTIFICATION (Aug 20 - Aug 30)'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {alertItems.map((ai, index) => (
                  <div key={index} className={`alert-banner-item ${ai.expiryInfo.status}`}>
                    <span>• {ai.item.productName || 'Medicine'} (Batch: {ai.item.batchNo || 'N/A'}):</span>
                    <span>{ai.expiryInfo.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MIDDLE SECTION: MEDICINE SALES ITEMS TABLE */}
          <div className="msb-items-card">
            <div className="msb-items-header">
              <h4>
                <FileText size={16} color="#16a34a" /> Prescription Medicine Sales Items Ledger
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a', fontWeight: 700 }}>
                  ⚠️ Near Expiry = Amber Row
                </span>
                <span style={{ fontSize: '11px', color: '#b91c1c', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fca5a5', fontWeight: 700 }}>
                  ⛔ Expired = Red Row
                </span>
                <button className="msb-action-btn primary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={handleAddRow}>
                  <Plus size={14} /> Add Medicine Row
                </button>
              </div>
            </div>

            <div className="msb-table-container">
              {/* Datalist for preset medicine selection */}
              <datalist id="stock-medicine-list">
                {SAMPLE_MEDICINE_STOCK.map((med, i) => (
                  <option key={i} value={med.name}>
                    {med.name} | Batch: {med.batchNo} | Exp: {med.expDate} (₹{med.mrp})
                  </option>
                ))}
              </datalist>

              <table className="msb-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>S.No</th>
                    <th>Product Name</th>
                    <th style={{ width: '130px' }}>Batch No</th>
                    <th style={{ width: '130px' }}>Exp.Date</th>
                    <th style={{ width: '90px' }}>Qty</th>
                    <th style={{ width: '90px' }}>Tax %</th>
                    <th style={{ width: '120px' }}>M.R.P (₹)</th>
                    <th style={{ width: '140px' }}>Amount (₹)</th>
                    <th style={{ width: '50px' }}>Del</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const expiryInfo = checkExpiryStatus(item.expDate);
                    let rowClass = '';
                    if (expiryInfo.status === 'near_expiry') rowClass = 'row-near-expiry';
                    else if (expiryInfo.status === 'expired') rowClass = 'row-expired';

                    return (
                      <tr key={item.id} className={rowClass}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            list="stock-medicine-list"
                            placeholder="Select or type medicine name..."
                            value={item.productName}
                            onChange={e => handleItemChange(item.id, 'productName', e.target.value)}
                          />
                          {expiryInfo.status === 'near_expiry' && (
                            <div className="badge-expiry near-expiry">
                              ⚠️ Near Expiry (Aug 20 - 30)
                            </div>
                          )}
                          {expiryInfo.status === 'expired' && (
                            <div className="badge-expiry expired">
                              ⛔ EXPIRED MEDICINE
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Batch No"
                            value={item.batchNo}
                            onChange={e => handleItemChange(item.id, 'batchNo', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="30-08-2026"
                            value={item.expDate}
                            onChange={e => handleItemChange(item.id, 'expDate', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.qty}
                            onChange={e => handleItemChange(item.id, 'qty', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Tax %"
                            value={item.taxPercent}
                            onChange={e => handleItemChange(item.id, 'taxPercent', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            placeholder="MRP"
                            value={item.mrp}
                            onChange={e => handleItemChange(item.id, 'mrp', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            readOnly
                            style={{ background: '#f1f5f9', fontWeight: 700, color: '#16a34a' }}
                            value={item.amount ? `₹${item.amount}` : ''}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                            onClick={() => handleRemoveRow(item.id)}
                          >
                            <Trash size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM SECTION: RS GRAND TOTAL & CALCULATIONS */}
          <div className="msb-bottom-summary">
            <div className="msb-grand-total-display">
              Rs. <strong>{netAmount.toFixed(2)}</strong>
            </div>

            <div className="msb-calc-grid">
              <div className="msb-calc-item">
                <label>Less Dis %</label>
                <input
                  type="text"
                  className="msb-input"
                  placeholder="e.g. 5%"
                  value={lessDisPercent}
                  onChange={e => setLessDisPercent(e.target.value)}
                />
              </div>

              <div className="msb-calc-item">
                <label>Amt Tendered</label>
                <input
                  type="number"
                  className="msb-input"
                  placeholder="₹ Cash Received"
                  value={amtTendered}
                  onChange={e => setAmtTendered(e.target.value)}
                />
              </div>

              <div className="msb-calc-item">
                <label className="red">Net Amount (₹)</label>
                <input
                  type="text"
                  className="msb-input"
                  style={{ fontWeight: 800, color: '#16a34a', background: '#f0fdf4' }}
                  readOnly
                  value={`₹${netAmount.toFixed(2)}`}
                />
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ACTION TOOLBAR --- */}
        <div className="msb-bottom-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="msb-last-bill-chip">
              <Tag size={15} /> Last Bill No : 685 Rs.205.55
            </div>
            <span className="msb-help-chip">F1 - Help Keys</span>
          </div>

          <div className="msb-btn-group">
            <button className="msb-action-btn primary" onClick={handleSave}>
              <Save size={15} /> Save
            </button>
            <button className="msb-action-btn" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <button className="msb-action-btn" onClick={handleClear}>
              <RotateCcw size={15} /> Continue
            </button>
            <button className="msb-action-btn" onClick={handleClear}>
              <Trash2 size={15} /> Delete
            </button>
            <button className="msb-action-btn" onClick={handleRemoveLastRow}>
              <Trash size={15} /> DelRow
            </button>
            <button className="msb-action-btn exit-btn" onClick={onClose}>
              <LogOut size={15} /> Exit
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default MedicalSalesBillingScreen;
