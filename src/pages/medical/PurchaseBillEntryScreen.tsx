import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  ShoppingCart, Save, Trash2, RotateCcw, Plus, Trash, Printer, 
  LogOut, X, Search, FileText, Truck, Calendar, Tag, CreditCard 
} from 'lucide-react';
import './PurchaseBillEntryScreen.css';

interface PurchaseBillEntryScreenProps {
  onClose: () => void;
}

interface SupplierItem {
  name: string;
  place: string;
  address?: string;
}

interface PurchaseItemRow {
  id: string;
  productName: string;
  pack: string;
  qty: string;
  freeQty: string;
  totalQty: string;
  batchNo: string;
  expDate: string;
  discPercent: string;
  sDiscPercent: string;
  schAmount: string;
  taxCode: string;
  pRate: string;
  mrp: string;
  amount: string;
  tProfitPercent: string;
  ePRate: string;
  eMrp: string;
  profitPercent: string;
  cgstPercent: string;
  sgstPercent: string;
  igstPercent: string;
  cgstAmt: string;
  sgstAmt: string;
  igstAmt: string;
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

const createEmptyRow = (id: string): PurchaseItemRow => ({
  id,
  productName: '',
  pack: '10',
  qty: '',
  freeQty: '',
  totalQty: '',
  batchNo: '',
  expDate: '',
  discPercent: '',
  sDiscPercent: '',
  schAmount: '',
  taxCode: 'GST12',
  pRate: '',
  mrp: '',
  amount: '',
  tProfitPercent: '',
  ePRate: '',
  eMrp: '',
  profitPercent: '',
  cgstPercent: '6',
  sgstPercent: '6',
  igstPercent: '0',
  cgstAmt: '',
  sgstAmt: '',
  igstAmt: ''
});

const PurchaseBillEntryScreen: React.FC<PurchaseBillEntryScreenProps> = ({ onClose }) => {
  // Header / Form States (Blank by default)
  const [purRefNo, setPurRefNo] = useState('');
  const [invDate, setInvDate] = useState('');
  const [pInvNo, setPInvNo] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [address, setAddress] = useState('');
  const [place, setPlace] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [terms, setTerms] = useState('Credit');
  const [crDays, setCrDays] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const [supplierSearch, setSupplierSearch] = useState('');

  // Items Table State (25 Columns)
  const [items, setItems] = useState<PurchaseItemRow[]>([createEmptyRow('1')]);

  const handleSelectSupplier = (s: SupplierItem) => {
    setSupplierName(s.name);
    setPlace(s.place);
    setAddress(s.address || `${s.place} Medical Hub`);
  };

  const handleAddRow = () => {
    setItems(prev => [
      ...prev,
      createEmptyRow(Date.now().toString())
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof PurchaseItemRow, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      
      const qtyNum = parseFloat(updated.qty) || 0;
      const freeNum = parseFloat(updated.freeQty) || 0;
      const totalQtyNum = qtyNum + freeNum;
      updated.totalQty = totalQtyNum > 0 ? totalQtyNum.toString() : '';

      const pRateNum = parseFloat(updated.pRate) || 0;
      const mrpNum = parseFloat(updated.mrp) || 0;
      const discNum = parseFloat(updated.discPercent) || 0;
      const sDiscNum = parseFloat(updated.sDiscPercent) || 0;
      const schAmtNum = parseFloat(updated.schAmount) || 0;

      const grossAmt = qtyNum * pRateNum;
      const discAmt = grossAmt * (discNum / 100) + grossAmt * (sDiscNum / 100);
      const netLineAmt = Math.max(0, grossAmt - discAmt - schAmtNum);
      updated.amount = netLineAmt > 0 ? netLineAmt.toFixed(2) : '';

      // Effective rates
      const ePRateNum = totalQtyNum > 0 ? netLineAmt / totalQtyNum : pRateNum;
      const eMrpNum = totalQtyNum > 0 ? (qtyNum * mrpNum) / totalQtyNum : mrpNum;
      updated.ePRate = ePRateNum > 0 ? ePRateNum.toFixed(2) : '';
      updated.eMrp = eMrpNum > 0 ? eMrpNum.toFixed(2) : '';

      // Profits
      const profitNum = pRateNum > 0 ? (((mrpNum - pRateNum) / pRateNum) * 100) : 0;
      const tProfitNum = ePRateNum > 0 ? (((eMrpNum - ePRateNum) / ePRateNum) * 100) : 0;
      updated.profitPercent = profitNum ? profitNum.toFixed(1) : '';
      updated.tProfitPercent = tProfitNum ? tProfitNum.toFixed(1) : '';

      // Taxes
      const cgstNum = parseFloat(updated.cgstPercent) || 0;
      const sgstNum = parseFloat(updated.sgstPercent) || 0;
      const igstNum = parseFloat(updated.igstPercent) || 0;

      const cgstAmtVal = (netLineAmt * cgstNum) / 100;
      const sgstAmtVal = (netLineAmt * sgstNum) / 100;
      const igstAmtVal = (netLineAmt * igstNum) / 100;

      updated.cgstAmt = cgstAmtVal > 0 ? cgstAmtVal.toFixed(2) : '';
      updated.sgstAmt = sgstAmtVal > 0 ? sgstAmtVal.toFixed(2) : '';
      updated.igstAmt = igstAmtVal > 0 ? igstAmtVal.toFixed(2) : '';

      return updated;
    }));
  };

  // Calculations Summary
  const subTotal = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const totalCgst = items.reduce((acc, item) => acc + (parseFloat(item.cgstAmt) || 0), 0);
  const totalSgst = items.reduce((acc, item) => acc + (parseFloat(item.sgstAmt) || 0), 0);
  const totalIgst = items.reduce((acc, item) => acc + (parseFloat(item.igstAmt) || 0), 0);
  const totalTaxAmount = totalCgst + totalSgst + totalIgst;
  const netAmount = subTotal + totalTaxAmount;

  const handleSave = () => {
    if (!supplierName.trim()) return alert('Please enter or select a Supplier Name');
    if (!pInvNo.trim()) return alert('Please enter Purchase Invoice No (P.Inv No)');
    alert(`Purchase Bill Invoice "${pInvNo}" for ${supplierName} saved successfully to inventory stock!`);
  };

  const handleClear = () => {
    setPurRefNo('');
    setInvDate('');
    setPInvNo('');
    setSupplierName('');
    setAddress('');
    setPlace('');
    setTotalValue('');
    setCrDays('');
    setDueDate('');
    setRemarks('');
    setItems([createEmptyRow('1')]);
  };

  const filteredSuppliers = SAMPLE_SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    s.place.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  return ReactDOM.createPortal(
    <div className="pbe-overlay">
      <div className="pbe-window">

        {/* --- HEADER BANNER --- */}
        <div className="pbe-header-banner">
          <div className="pbe-header-left">
            <div className="pbe-header-icon-box">
              <ShoppingCart size={24} />
            </div>
            <div className="pbe-header-titles">
              <h2>
                Purchase Bill Entry Master
                <span className="pbe-doctor-chip">DR. G. SRI JANANI, MD (OG)</span>
              </h2>
              <p>Pharmacy vendor invoice entry, inward medicine stock & purchase ledger</p>
            </div>
          </div>

          <div className="pbe-header-actions">
            <button className="pbe-top-close" onClick={onClose} title="Close Window">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- MAIN BODY --- */}
        <div className="pbe-main-body">

          {/* TOP SECTION: INVOICE DETAILS + SUPPLIER QUICK LIST */}
          <div className="pbe-top-card">
            
            {/* LEFT FORM FIELDS */}
            <div className="pbe-form-grid-3">
              <div className="pbe-form-group">
                <label className="pbe-label">Pur-Ref-No</label>
                <input type="text" className="pbe-input" value={purRefNo} onChange={e => setPurRefNo(e.target.value)} placeholder="e.g. PUR-2026-90" />
              </div>

              <div className="pbe-form-group">
                <label className="pbe-label">Inv. Date</label>
                <input type="date" className="pbe-input" value={invDate} onChange={e => setInvDate(e.target.value)} />
              </div>

              <div className="pbe-form-group">
                <label className="pbe-label red">P.Inv No<span className="pbe-req">*</span></label>
                <input type="text" className="pbe-input" value={pInvNo} onChange={e => setPInvNo(e.target.value)} placeholder="Vendor Invoice Bill No" />
              </div>

              <div className="pbe-form-group" style={{ gridColumn: 'span 2' }}>
                <label className="pbe-label red">Supplier Name<span className="pbe-req">*</span></label>
                <input type="text" className="pbe-input" value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="Enter or select supplier name" />
              </div>

              <div className="pbe-form-group">
                <label className="pbe-label">Place</label>
                <input type="text" className="pbe-input" value={place} onChange={e => setPlace(e.target.value)} placeholder="City / Location" />
              </div>

              <div className="pbe-form-group" style={{ gridColumn: 'span 3' }}>
                <label className="pbe-label">Address</label>
                <input type="text" className="pbe-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Supplier complete address" />
              </div>

              <div className="pbe-form-group">
                <label className="pbe-label">Terms</label>
                <select className="pbe-select" value={terms} onChange={e => setTerms(e.target.value)}>
                  <option value="Credit">Credit</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Online</option>
                  <option value="Future Payment">Future Payment</option>
                </select>
              </div>

              <div className="pbe-form-group">
                <label className="pbe-label">Cr.Days</label>
                <input type="text" className="pbe-input" value={crDays} onChange={e => setCrDays(e.target.value)} placeholder="e.g. 30" />
              </div>

              <div className="pbe-form-group">
                <label className="pbe-label">Due Dt.</label>
                <input type="date" className="pbe-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>

            {/* RIGHT SIDE: SUPPLIER SEARCH & INDEX LIST */}
            <div className="pbe-supplier-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4><Truck size={14} color="#0284c7" /> Registered Suppliers List</h4>
                <input
                  type="text"
                  className="pbe-input"
                  style={{ width: '130px', padding: '3px 6px', fontSize: '11px' }}
                  placeholder="Filter supplier..."
                  value={supplierSearch}
                  onChange={e => setSupplierSearch(e.target.value)}
                />
              </div>

              <div className="pbe-supplier-table-wrap">
                <table className="pbe-supplier-table">
                  <thead>
                    <tr>
                      <th>Supplier Name</th>
                      <th>Place</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((s, idx) => (
                      <tr key={idx} onClick={() => handleSelectSupplier(s)}>
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</td>
                        <td style={{ color: '#64748b' }}>{s.place}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* MIDDLE SECTION: PURCHASE ITEMS LEDGER GRID (25 COLUMNS) */}
          <div className="pbe-items-card">
            <div className="pbe-items-header">
              <h4>
                <FileText size={16} color="#0284c7" /> Purchase Inward Medicine Items Ledger (25 Detailed Data Columns)
              </h4>
              <button className="pbe-action-btn primary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={handleAddRow}>
                <Plus size={14} /> Add Product Row
              </button>
            </div>

            <div className="pbe-table-container">
              <table className="pbe-table">
                <thead>
                  <tr>
                    <th style={{ width: '35px' }}>S.No</th>
                    <th style={{ width: '180px' }}>Product Name</th>
                    <th style={{ width: '60px' }}>Pack</th>
                    <th style={{ width: '60px' }}>Qty</th>
                    <th style={{ width: '60px' }}>Free</th>
                    <th style={{ width: '60px' }}>T.Qty</th>
                    <th style={{ width: '90px' }}>Batch</th>
                    <th style={{ width: '85px' }}>Exp.Date</th>
                    <th style={{ width: '60px' }}>Disc%</th>
                    <th style={{ width: '65px' }}>S.Disc%</th>
                    <th style={{ width: '70px' }}>Sch.Amt</th>
                    <th style={{ width: '75px' }}>Tax Co</th>
                    <th style={{ width: '80px' }}>P.Rate</th>
                    <th style={{ width: '80px' }}>M.R.P</th>
                    <th style={{ width: '90px' }}>Amount</th>
                    <th style={{ width: '75px' }}>T.Profit%</th>
                    <th style={{ width: '80px' }}>E-P.Rate</th>
                    <th style={{ width: '80px' }}>E-M.R.P</th>
                    <th style={{ width: '70px' }}>Profit %</th>
                    <th style={{ width: '60px' }}>CGST</th>
                    <th style={{ width: '60px' }}>SGST</th>
                    <th style={{ width: '60px' }}>IGST</th>
                    <th style={{ width: '75px' }}>CGST Amt</th>
                    <th style={{ width: '75px' }}>SGST Amt</th>
                    <th style={{ width: '75px' }}>IGST Amt</th>
                    <th style={{ width: '40px' }}>Del</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Medicine / Item Brand Name"
                          value={item.productName}
                          onChange={e => handleItemChange(item.id, 'productName', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Pack"
                          value={item.pack}
                          onChange={e => handleItemChange(item.id, 'pack', e.target.value)}
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
                          type="number"
                          placeholder="Free"
                          value={item.freeQty}
                          onChange={e => handleItemChange(item.id, 'freeQty', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9', fontWeight: 700 }}
                          value={item.totalQty}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Batch"
                          value={item.batchNo}
                          onChange={e => handleItemChange(item.id, 'batchNo', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={item.expDate}
                          onChange={e => handleItemChange(item.id, 'expDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Disc%"
                          value={item.discPercent}
                          onChange={e => handleItemChange(item.id, 'discPercent', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="S.Disc%"
                          value={item.sDiscPercent}
                          onChange={e => handleItemChange(item.id, 'sDiscPercent', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Sch.Amt"
                          value={item.schAmount}
                          onChange={e => handleItemChange(item.id, 'schAmount', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Tax Co"
                          value={item.taxCode}
                          onChange={e => handleItemChange(item.id, 'taxCode', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="P.Rate"
                          value={item.pRate}
                          onChange={e => handleItemChange(item.id, 'pRate', e.target.value)}
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
                          style={{ background: '#f1f5f9', fontWeight: 700, color: '#0284c7' }}
                          value={item.amount}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9', color: '#16a34a', fontWeight: 700 }}
                          value={item.tProfitPercent ? `${item.tProfitPercent}%` : ''}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9' }}
                          value={item.ePRate}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9' }}
                          value={item.eMrp}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9', color: '#16a34a', fontWeight: 700 }}
                          value={item.profitPercent ? `${item.profitPercent}%` : ''}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="CGST%"
                          value={item.cgstPercent}
                          onChange={e => handleItemChange(item.id, 'cgstPercent', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="SGST%"
                          value={item.sgstPercent}
                          onChange={e => handleItemChange(item.id, 'sgstPercent', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="IGST%"
                          value={item.igstPercent}
                          onChange={e => handleItemChange(item.id, 'igstPercent', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9' }}
                          value={item.cgstAmt}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9' }}
                          value={item.sgstAmt}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          readOnly
                          style={{ background: '#f1f5f9' }}
                          value={item.igstAmt}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                          onClick={() => handleRemoveRow(item.id)}
                        >
                          <Trash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM SECTION: REMARKS & CALCULATIONS */}
          <div className="pbe-bottom-summary">
            <div className="pbe-form-group">
              <label className="pbe-label">Remarks / Note</label>
              <input
                type="text"
                className="pbe-input"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Enter remarks or invoice note..."
              />
            </div>

            <div className="pbe-calc-grid">
              <div className="pbe-calc-item">
                <span>Sub Total:</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="pbe-calc-item">
                <span>Total Tax (CGST+SGST+IGST):</span>
                <span>+ ₹{totalTaxAmount.toFixed(2)}</span>
              </div>
              <div className="pbe-calc-item net">
                <span>Net Amount:</span>
                <span>₹{netAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ACTION TOOLBAR --- */}
        <div className="pbe-bottom-toolbar">
          <div className="pbe-last-purchase-chip">
            <Tag size={15} /> Last Purchase No : 221
          </div>

          <div className="pbe-btn-group">
            <button className="pbe-action-btn primary" onClick={handleSave}>
              <Save size={15} /> Save
            </button>
            <button className="pbe-action-btn" onClick={handleClear}>
              <RotateCcw size={15} /> Clear / Continue
            </button>
            <button className="pbe-action-btn" onClick={handleAddRow}>
              <Plus size={15} /> Add Row
            </button>
            <button className="pbe-action-btn" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <button className="pbe-action-btn exit-btn" onClick={onClose}>
              <LogOut size={15} /> Exit
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default PurchaseBillEntryScreen;
