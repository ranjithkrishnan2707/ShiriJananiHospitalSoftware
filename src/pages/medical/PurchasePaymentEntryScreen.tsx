import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  CreditCard, Save, RotateCcw, Trash2, Printer, LogOut, X, 
  Search, Truck, Calendar, Tag, DollarSign, CheckCircle2 
} from 'lucide-react';
import './PurchasePaymentEntryScreen.css';

interface PurchasePaymentEntryScreenProps {
  onClose: () => void;
}

interface SupplierItem {
  name: string;
  place: string;
  address: string;
}

interface PaymentRowItem {
  id: string;
  sNo: number;
  refNo: string;
  part: string;
  invNo: string;
  date: string;
  invValue: number;
  adjAmt: number;
  paidAmt: number;
  payment: number;
  balance: number;
  secNo: string;
  payDate: string;
}

const SAMPLE_SUPPLIERS: SupplierItem[] = [
  { name: 'AAKASH PHARMA', place: 'ERODE', address: 'Bhavani Main Road, Erode' },
  { name: 'ABC PHARMA', place: 'ERODE', address: 'Mettur Road, Erode' },
  { name: 'AKT PHARMA', place: 'NAMAKKAL-1', address: 'Salem Main Road, Namakkal' },
  { name: 'ALAGU PHARMA', place: 'ERODE', address: 'Brough Road, Erode' },
  { name: 'ALTUS HEALTH CARE SOLUTIONS', place: 'COIMBATORE-641103', address: 'Peelamedu, Coimbatore' },
  { name: 'ANANTH SURGICALS', place: 'FOUR ROADS SALEM-636009', address: 'Four Roads, Salem' },
  { name: 'ANNAI AGENCY', place: 'ERODE -638001', address: 'Sathy Road, Erode' },
  { name: 'ASTER MEDI SUPPLIES', place: 'ERODE-638001', address: 'Gandhijii Road, Erode' }
];

const getTodayDateStr = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const createDefaultRows = (supplierName: string): PaymentRowItem[] => {
  if (!supplierName) {
    return Array.from({ length: 6 }, (_, i) => ({
      id: `row-${i + 1}`,
      sNo: i + 1,
      refNo: '',
      part: '',
      invNo: '',
      date: '',
      invValue: 0,
      adjAmt: 0,
      paidAmt: 0,
      payment: 0,
      balance: 0,
      secNo: '',
      payDate: ''
    }));
  }

  // Pre-fill sample pending bills for selected supplier
  const sampleBills = [
    { refNo: 'REF-101', part: 'PUR', invNo: 'INV-8821', date: '01-08-2026', invValue: 12500, paidAmt: 2500 },
    { refNo: 'REF-104', part: 'PUR', invNo: 'INV-8904', date: '08-08-2026', invValue: 8400, paidAmt: 0 },
    { refNo: 'REF-110', part: 'PUR', invNo: 'INV-9012', date: '12-08-2026', invValue: 15600, paidAmt: 5000 },
  ];

  const rows: PaymentRowItem[] = [];
  for (let i = 0; i < 6; i++) {
    if (i < sampleBills.length) {
      const b = sampleBills[i];
      const bal = b.invValue - b.paidAmt;
      rows.push({
        id: `row-${i + 1}`,
        sNo: i + 1,
        refNo: b.refNo,
        part: b.part,
        invNo: b.invNo,
        date: b.date,
        invValue: b.invValue,
        adjAmt: 0,
        paidAmt: b.paidAmt,
        payment: bal,
        balance: 0,
        secNo: `SEC-${100 + i}`,
        payDate: getTodayDateStr()
      });
    } else {
      rows.push({
        id: `row-${i + 1}`,
        sNo: i + 1,
        refNo: '',
        part: '',
        invNo: '',
        date: '',
        invValue: 0,
        adjAmt: 0,
        paidAmt: 0,
        payment: 0,
        balance: 0,
        secNo: '',
        payDate: ''
      });
    }
  }

  return rows;
};

const PurchasePaymentEntryScreen: React.FC<PurchasePaymentEntryScreenProps> = ({ onClose }) => {
  // Form Header States
  const [payNo, setPayNo] = useState('73');
  const [date, setDate] = useState(getTodayDateStr());
  const [partyName, setPartyName] = useState('');
  const [address, setAddress] = useState('');
  const [place, setPlace] = useState('');
  const [rsText, setRsText] = useState('');
  const [terms, setTerms] = useState('Cash');
  const [amountInput, setAmountInput] = useState('');
  const [lineMan, setLineMan] = useState('');

  // Supplier Search State
  const [supplierSearch, setSupplierSearch] = useState('');

  // Rows State
  const [rows, setRows] = useState<PaymentRowItem[]>(() => createDefaultRows(''));

  // Select Supplier Handler
  const handleSelectSupplier = (s: SupplierItem) => {
    setPartyName(s.name);
    setAddress(s.address);
    setPlace(s.place);
    const newRows = createDefaultRows(s.name);
    setRows(newRows);
  };

  // Recalculate Totals & Balance whenever rows change
  const updatedRows = rows.map(r => {
    const calcBal = (r.invValue || 0) - ((r.adjAmt || 0) + (r.paidAmt || 0) + (r.payment || 0));
    return {
      ...r,
      balance: Math.max(0, calcBal)
    };
  });

  const totalInvValue = updatedRows.reduce((acc, r) => acc + (r.invValue || 0), 0);
  const totalAdjAmt = updatedRows.reduce((acc, r) => acc + (r.adjAmt || 0), 0);
  const totalPaidAmt = updatedRows.reduce((acc, r) => acc + (r.paidAmt || 0), 0);
  const totalPayment = updatedRows.reduce((acc, r) => acc + (r.payment || 0), 0);
  const totalBalance = updatedRows.reduce((acc, r) => acc + (r.balance || 0), 0);

  // Sync Amount Input with Total Payment if not manually set
  useEffect(() => {
    if (totalPayment > 0) {
      setAmountInput(totalPayment.toFixed(2));
      setRsText(totalPayment.toFixed(2));
    }
  }, [totalPayment]);

  const handleRowChange = (id: string, field: keyof PaymentRowItem, value: string) => {
    setRows(prevRows =>
      prevRows.map(r => {
        if (r.id !== id) return r;
        const numVal = parseFloat(value) || 0;
        if (field === 'invValue' || field === 'adjAmt' || field === 'paidAmt' || field === 'payment') {
          return { ...r, [field]: numVal };
        }
        return { ...r, [field]: value };
      })
    );
  };

  const filteredSuppliers = SAMPLE_SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    s.place.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!partyName) {
      alert('Please select a Supplier / Party Name before saving.');
      return;
    }
    alert(`Payment Voucher #${payNo} of ₹${amountInput || totalPayment} for ${partyName} saved successfully!`);
    handleContinue();
  };

  const handleContinue = () => {
    setPayNo(prev => (parseInt(prev, 10) + 1).toString());
    setPartyName('');
    setAddress('');
    setPlace('');
    setRsText('');
    setAmountInput('');
    setLineMan('');
    setRows(createDefaultRows(''));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to clear this payment voucher entry?')) {
      setPartyName('');
      setAddress('');
      setPlace('');
      setRsText('');
      setAmountInput('');
      setLineMan('');
      setRows(createDefaultRows(''));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return ReactDOM.createPortal(
    <div className="ppe-overlay">
      <div className="ppe-window">
        
        {/* --- HEADER BANNER (MODERN THEME) --- */}
        <div className="ppe-header-banner">
          <div className="ppe-header-left">
            <div className="ppe-header-icon-box">
              <CreditCard size={22} />
            </div>
            <div className="ppe-header-titles">
              <h2>
                Purchase Payment Entry Screen
                <span className="ppe-doctor-chip">DR. G. SRI JANANI, MD(OG).</span>
              </h2>
              <p>Hospital Pharmacy Supplier Payment Voucher & Pending Invoices Ledger</p>
            </div>
          </div>
          <div className="ppe-header-actions">
            <button className="ppe-top-close" onClick={onClose} title="Close Screen (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* --- MAIN BODY AREA --- */}
        <div className="ppe-main-body">
          
          {/* TOP CARD: VOUCHER DETAILS & SUPPLIER DIRECTORY */}
          <div className="ppe-top-card">
            
            {/* LEFT FORM GRID */}
            <div className="ppe-form-grid-3" style={{ gridColumn: 'span 1' }}>
              <div className="ppe-form-group">
                <label className="ppe-label purple">Pay No. <span className="ppe-req">*</span></label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  value={payNo} 
                  onChange={e => setPayNo(e.target.value)} 
                />
              </div>

              <div className="ppe-form-group">
                <label className="ppe-label">Date <span className="ppe-req">*</span></label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                />
              </div>

              <div className="ppe-form-group">
                <label className="ppe-label">Rs. (Amount)</label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  placeholder="0.00"
                  value={rsText} 
                  onChange={e => setRsText(e.target.value)} 
                />
              </div>

              <div className="ppe-form-group" style={{ gridColumn: 'span 3' }}>
                <label className="ppe-label purple">Party / Supplier Name <span className="ppe-req">*</span></label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  placeholder="Select a supplier from right directory list..."
                  value={partyName} 
                  onChange={e => setPartyName(e.target.value)} 
                />
              </div>

              <div className="ppe-form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ppe-label">Address</label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  placeholder="Supplier address..."
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                />
              </div>

              <div className="ppe-form-group">
                <label className="ppe-label">Place</label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  placeholder="City / Place..."
                  value={place} 
                  onChange={e => setPlace(e.target.value)} 
                />
              </div>
            </div>

            {/* RIGHT SUPPLIER SEARCH DIRECTORY */}
            <div className="ppe-supplier-box">
              <h4>
                <Truck size={16} color="#7c3aed" /> Select Registered Supplier
              </h4>
              <div className="ppe-supplier-search-input">
                <Search size={14} color="#64748b" />
                <input 
                  type="text" 
                  placeholder="Search supplier or place..." 
                  value={supplierSearch} 
                  onChange={e => setSupplierSearch(e.target.value)} 
                />
              </div>
              <div className="ppe-supplier-table-wrap">
                <table className="ppe-supplier-table">
                  <thead>
                    <tr>
                      <th>Supplier Name</th>
                      <th>Place</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((sup, idx) => (
                      <tr 
                        key={idx} 
                        className={partyName === sup.name ? 'selected-supplier-row' : ''}
                        onClick={() => handleSelectSupplier(sup)}
                      >
                        <td>{sup.name}</td>
                        <td>{sup.place}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* MIDDLE CARD: PAYMENT ITEMS INVOICES TABLE */}
          <div className="ppe-items-card">
            <div className="ppe-items-header">
              <h4>
                <DollarSign size={16} color="#7c3aed" /> Purchase Invoices & Payment Ledger Table
              </h4>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Enter payment amounts to auto-calculate invoice balance
              </div>
            </div>

            <div className="ppe-table-container">
              <table className="ppe-table">
                <thead>
                  <tr>
                    <th style={{ width: '45px', textAlign: 'center' }}>SNo.</th>
                    <th style={{ width: '100px' }}>Ref No</th>
                    <th style={{ width: '70px' }}>Part.</th>
                    <th style={{ width: '110px' }}>Inv. No</th>
                    <th style={{ width: '100px' }}>Date</th>
                    <th style={{ width: '110px' }}>Inv. Value</th>
                    <th style={{ width: '100px' }}>Adj. Amt</th>
                    <th style={{ width: '100px' }}>Paid Amt</th>
                    <th style={{ width: '120px', color: '#16a34a' }}>Payment</th>
                    <th style={{ width: '110px', color: '#dc2626' }}>Balance</th>
                    <th style={{ width: '100px' }}>Sec. No</th>
                    <th style={{ width: '110px' }}>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {updatedRows.map(row => (
                    <tr key={row.id}>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#7c3aed' }}>{row.sNo}</td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Ref No"
                          value={row.refNo} 
                          onChange={e => handleRowChange(row.id, 'refNo', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Part"
                          value={row.part} 
                          onChange={e => handleRowChange(row.id, 'part', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Inv No"
                          value={row.invNo} 
                          onChange={e => handleRowChange(row.id, 'invNo', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Date"
                          value={row.date} 
                          onChange={e => handleRowChange(row.id, 'date', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={row.invValue || ''} 
                          onChange={e => handleRowChange(row.id, 'invValue', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={row.adjAmt || ''} 
                          onChange={e => handleRowChange(row.id, 'adjAmt', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={row.paidAmt || ''} 
                          onChange={e => handleRowChange(row.id, 'paidAmt', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="input-payment" 
                          placeholder="0.00"
                          value={row.payment || ''} 
                          onChange={e => handleRowChange(row.id, 'payment', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          readOnly 
                          className="input-balance" 
                          value={row.balance > 0 ? `₹${row.balance.toFixed(2)}` : '₹0.00'} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Sec No"
                          value={row.secNo} 
                          onChange={e => handleRowChange(row.id, 'secNo', e.target.value)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Pay Date"
                          value={row.payDate} 
                          onChange={e => handleRowChange(row.id, 'payDate', e.target.value)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM SUMMARY & CALCULATIONS CARD */}
          <div className="ppe-bottom-summary">
            <div className="ppe-form-grid-2">
              <div className="ppe-form-group">
                <label className="ppe-label">Payment Terms</label>
                <select 
                  className="ppe-select" 
                  value={terms} 
                  onChange={e => setTerms(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div className="ppe-form-group">
                <label className="ppe-label">Voucher Amount (₹)</label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  value={amountInput} 
                  onChange={e => setAmountInput(e.target.value)} 
                  placeholder="0.00" 
                />
              </div>

              <div className="ppe-form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ppe-label">Line Man / Representative</label>
                <input 
                  type="text" 
                  className="ppe-input" 
                  value={lineMan} 
                  onChange={e => setLineMan(e.target.value)} 
                  placeholder="Sales Representative / Line Man name..." 
                />
              </div>
            </div>

            <div className="ppe-calc-grid">
              <div className="ppe-calc-item">
                <span>Total Inv Value:</span>
                <span>₹{totalInvValue.toFixed(2)}</span>
              </div>
              <div className="ppe-calc-item">
                <span>Total Paid Amt:</span>
                <span>₹{totalPaidAmt.toFixed(2)}</span>
              </div>
              <div className="ppe-calc-item">
                <span>Total Payment:</span>
                <span style={{ color: '#16a34a' }}>₹{totalPayment.toFixed(2)}</span>
              </div>
              <div className="ppe-calc-item">
                <span>Total Balance:</span>
                <span style={{ color: '#dc2626' }}>₹{totalBalance.toFixed(2)}</span>
              </div>
              <div className="ppe-calc-item net">
                <span>Net Payment Amount:</span>
                <span>₹{(amountInput ? parseFloat(amountInput) || totalPayment : totalPayment).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ACTION TOOLBAR --- */}
        <div className="ppe-bottom-toolbar">
          <div className="ppe-voucher-chip">
            <Tag size={15} /> Payment Voucher No: #{payNo}
          </div>

          <div className="ppe-btn-group">
            <button className="ppe-action-btn primary" onClick={handleSave}>
              <Save size={15} /> Save Voucher
            </button>
            <button className="ppe-action-btn" onClick={handleContinue}>
              <RotateCcw size={15} /> Clear / Continue
            </button>
            <button className="ppe-action-btn" onClick={handleDelete}>
              <Trash2 size={15} /> Delete Entry
            </button>
            <button className="ppe-action-btn" onClick={handlePrint}>
              <Printer size={15} /> Print Voucher
            </button>
            <button className="ppe-action-btn exit-btn" onClick={onClose}>
              <LogOut size={15} /> Exit
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default PurchasePaymentEntryScreen;
