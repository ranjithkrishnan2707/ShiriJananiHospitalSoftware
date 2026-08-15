import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  Package, Printer, Save, Trash2, X, Plus, RotateCcw, Tag, 
  Receipt, Building2, Database, LogOut, Sliders, ShieldCheck, 
  FileText, CheckCircle, Boxes, Layers, Clock, AlertTriangle 
} from 'lucide-react';
import './ProductHistoryScreen.css';

interface ProductHistoryScreenProps {
  onClose: () => void;
}

interface ProductItem {
  code: string;
  name: string;
  generic: string;
  category: string;
  manufacturer: string;
  rack: string;
  hsn: string;
  schedule: string;
  type: string;
  minStock: string;
  maxStock: string;
  reorderLevel: string;
  hide: boolean;
  packingType: string;
  maxDiscount: string;
  defaultDiscount: string;
}

interface HistoryRow {
  date: string;
  type: 'Purchase' | 'Sale' | 'Return' | 'Adjustment';
  refNo: string;
  partyName: string;
  batchNo: string;
  expiry: string;
  inQty: number;
  outQty: number;
  balance: number;
  rate: number;
  mrp: number;
}

const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    code: 'PROD-1001',
    name: 'Tab. Paracetamol 650mg',
    generic: 'Paracetamol / Acetaminophen',
    category: 'Analgesics / Antipyretic',
    manufacturer: 'Sun Pharmaceutical Ltd',
    rack: 'Rack A-12',
    hsn: '30049099',
    schedule: 'Scheduled',
    type: 'COMPANY',
    minStock: '50',
    maxStock: '1000',
    reorderLevel: '100',
    hide: false,
    packingType: '10',
    maxDiscount: '10',
    defaultDiscount: '5'
  },
  {
    code: 'PROD-1002',
    name: 'Inj. Amikacin 500mg',
    generic: 'Amikacin Sulfate Injection',
    category: 'Antibiotics / Injectable',
    manufacturer: 'Cipla Healthcare Ltd',
    rack: 'Rack Cold-02',
    hsn: '30042010',
    schedule: 'Scheduled',
    type: 'COMPANY',
    minStock: '20',
    maxStock: '300',
    reorderLevel: '40',
    hide: false,
    packingType: '1',
    maxDiscount: '15',
    defaultDiscount: '5'
  },
  {
    code: 'PROD-1003',
    name: 'Syp. Benadryl 100ml',
    generic: 'Diphenhydramine HCl Syrup',
    category: 'Cough & Cold',
    manufacturer: 'Johnson & Johnson',
    rack: 'Rack B-05',
    hsn: '30049030',
    schedule: 'Scheduled',
    type: 'COMPANY',
    minStock: '15',
    maxStock: '200',
    reorderLevel: '30',
    hide: false,
    packingType: 'Bottles',
    maxDiscount: '8',
    defaultDiscount: '0'
  },
  {
    code: 'PROD-1004',
    name: 'Tab. Pantocid 40mg',
    generic: 'Pantoprazole Sodium 40mg',
    category: 'Gastrointestinal',
    manufacturer: 'Mankind Pharma Ltd',
    rack: 'Rack C-08',
    hsn: '30049099',
    schedule: 'Scheduled',
    type: 'COMPANY',
    minStock: '40',
    maxStock: '500',
    reorderLevel: '80',
    hide: false,
    packingType: '10',
    maxDiscount: '12',
    defaultDiscount: '5'
  }
];

const INITIAL_HISTORY: Record<string, HistoryRow[]> = {
  'PROD-1001': [
    { date: '2026-08-10', type: 'Purchase', refNo: 'INV-4890', partyName: 'Sun Pharma Distributors', batchNo: 'B-892', expiry: '2028-12', inQty: 500, outQty: 0, balance: 500, rate: 22.50, mrp: 32.00 },
    { date: '2026-08-11', type: 'Sale', refNo: 'BILL-1042', partyName: 'OPD Patient - DURGA', batchNo: 'B-892', expiry: '2028-12', inQty: 0, outQty: 2, balance: 498, rate: 32.00, mrp: 32.00 },
    { date: '2026-08-12', type: 'Sale', refNo: 'BILL-1045', partyName: 'OPD Patient - DHARSHINI', batchNo: 'B-892', expiry: '2028-12', inQty: 0, outQty: 1, balance: 497, rate: 32.00, mrp: 32.00 },
    { date: '2026-08-13', type: 'Sale', refNo: 'BILL-1050', partyName: 'IP Patient - SARULATHA', batchNo: 'B-892', expiry: '2028-12', inQty: 0, outQty: 5, balance: 492, rate: 32.00, mrp: 32.00 }
  ],
  'PROD-1002': [
    { date: '2026-08-05', type: 'Purchase', refNo: 'INV-3320', partyName: 'Cipla Healthcare Ltd', batchNo: 'AMK-04', expiry: '2027-08', inQty: 120, outQty: 0, balance: 120, rate: 110.00, mrp: 145.00 },
    { date: '2026-08-08', type: 'Sale', refNo: 'BILL-1011', partyName: 'IP Emergency Ward', batchNo: 'AMK-04', expiry: '2027-08', inQty: 0, outQty: 4, balance: 116, rate: 145.00, mrp: 145.00 }
  ]
};

const ProductHistoryScreen: React.FC<ProductHistoryScreenProps> = ({ onClose }) => {
  const [productList] = useState<ProductItem[]>(SAMPLE_PRODUCTS);
  const [selectedCode, setSelectedCode] = useState<string>('');

  // Form Fields State (Empty by default)
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [generic, setGeneric] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [rack, setRack] = useState('');
  const [hsn, setHsn] = useState('');
  const [schedule, setSchedule] = useState('Scheduled');
  const [productType, setProductType] = useState('COMPANY');

  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [hideProduct, setHideProduct] = useState(false);

  const [packingType, setPackingType] = useState('10');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [defaultDiscount, setDefaultDiscount] = useState('');

  // Load product details when selection changes
  const handleSelectProduct = (selected: ProductItem | null) => {
    if (!selected) {
      setSelectedCode('');
      setCode('');
      setName('');
      setGeneric('');
      setCategory('');
      setManufacturer('');
      setRack('');
      setHsn('');
      setSchedule('Scheduled');
      setProductType('COMPANY');
      setMinStock('');
      setMaxStock('');
      setReorderLevel('');
      setHideProduct(false);
      setPackingType('10');
      setMaxDiscount('');
      setDefaultDiscount('');
      return;
    }

    setSelectedCode(selected.code);
    setCode(selected.code);
    setName(selected.name);
    setGeneric(selected.generic);
    setCategory(selected.category);
    setManufacturer(selected.manufacturer);
    setRack(selected.rack);
    setHsn(selected.hsn);
    setSchedule(selected.schedule);
    setProductType(selected.type);
    setMinStock(selected.minStock);
    setMaxStock(selected.maxStock);
    setReorderLevel(selected.reorderLevel);
    setHideProduct(selected.hide);
    setPackingType(selected.packingType);
    setMaxDiscount(selected.maxDiscount);
    setDefaultDiscount(selected.defaultDiscount);
  };

  const handleSave = () => {
    if (!name.trim()) return alert('Please enter Product Name');
    alert(`Product details for "${name}" saved successfully!`);
  };

  const handleDelete = () => {
    if (!name.trim()) return alert('No product selected to delete.');
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      alert(`Product "${name}" deleted.`);
      handleSelectProduct(null);
    }
  };

  const handleContinue = () => {
    handleSelectProduct(null);
  };

  const historyRows = INITIAL_HISTORY[selectedCode] || [
    { date: new Date().toISOString().split('T')[0], type: 'Purchase', refNo: 'INV-NEW', partyName: 'Initial Opening Stock', batchNo: 'BATCH-01', expiry: '2028-12', inQty: 100, outQty: 0, balance: 100, rate: 50, mrp: 75 }
  ];

  return ReactDOM.createPortal(
    <div className="phs-overlay">
      <div className="phs-window">

        {/* --- MODERN HEADER BANNER --- */}
        <div className="phs-header-banner">
          <div className="phs-header-left">
            <div className="phs-header-icon-box">
              <Package size={24} />
            </div>
            <div className="phs-header-titles">
              <h2>
                Product History Master
                <span className="phs-doctor-chip">DR. G. SRI JANANI, MD (OG)</span>
              </h2>
              <p>Comprehensive medication master, stock movement tracking & batch ledger</p>
            </div>
          </div>

          <div className="phs-header-actions">
            <button className="phs-top-close" onClick={onClose} title="Close Window">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT: LEFT FORM CARD + RIGHT HISTORY GRID --- */}
        <div className="phs-main-body">

          {/* LEFT SIDE: DETAILS OF PRODUCT FORM CARD */}
          <div className="phs-left-panel">
            <h3 className="phs-section-title">
              <Package size={18} color="#0284c7" /> Details of Product
            </h3>

            <div className="phs-form-row">
              <label className="phs-label">Product Code</label>
              <input type="text" className="phs-input" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. PROD-1001" />
            </div>

            <div className="phs-form-row">
              <label className="phs-label red">Product Name<span className="phs-req">*</span></label>
              <input type="text" className="phs-input" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" />
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Generic Name</label>
              <input type="text" className="phs-input" value={generic} onChange={e => setGeneric(e.target.value)} placeholder="Generic Composition" />
            </div>

            <div className="phs-form-row">
              <label className="phs-label red">Category<span className="phs-req">*</span></label>
              <input type="text" className="phs-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="Therapeutic Category" />
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Manufacturer</label>
              <input type="text" className="phs-input" value={manufacturer} onChange={e => setManufacturer(e.target.value)} placeholder="Manufacturer Company" />
            </div>

            <div className="phs-form-grid-2">
              <div className="phs-form-col">
                <label className="phs-label">Rack Position</label>
                <input type="text" className="phs-input" value={rack} onChange={e => setRack(e.target.value)} placeholder="Rack No" />
              </div>
              <div className="phs-form-col">
                <label className="phs-label">HSN Code</label>
                <input type="text" className="phs-input" value={hsn} onChange={e => setHsn(e.target.value)} placeholder="HSN Code" />
              </div>
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Schedule</label>
              <select className="phs-select" value={schedule} onChange={e => setSchedule(e.target.value)}>
                <option value="Scheduled">Scheduled</option>
                <option value="Non-Scheduled">Non-Scheduled</option>
                <option value="H1">Schedule H1</option>
                <option value="X">Schedule X</option>
                <option value="Narcotic">Narcotic</option>
              </select>
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Product Type</label>
              <select className="phs-select" value={productType} onChange={e => setProductType(e.target.value)}>
                <option value="COMPANY">COMPANY</option>
                <option value="GENERIC">GENERIC</option>
                <option value="ETHICAL">ETHICAL</option>
                <option value="OTC">OTC</option>
              </select>
            </div>

            {/* SUB SECTIONS (LEVEL'S & PACKING TYPE) */}
            <div className="phs-sub-sections-grid">

              {/* LEVEL'S */}
              <div className="phs-sub-card">
                <h4 className="phs-sub-title">
                  <Boxes size={14} /> Level's
                </h4>

                <div className="phs-sub-row">
                  <label>Min. Stock Level</label>
                  <input type="text" className="phs-input-sm" value={minStock} onChange={e => setMinStock(e.target.value)} />
                </div>

                <div className="phs-sub-row">
                  <label>Max. Stock Level</label>
                  <input type="text" className="phs-input-sm" value={maxStock} onChange={e => setMaxStock(e.target.value)} />
                </div>

                <div className="phs-sub-row">
                  <label className="red">Reorder Level<span className="phs-req">*</span></label>
                  <input type="text" className="phs-input-sm" value={reorderLevel} onChange={e => setReorderLevel(e.target.value)} />
                </div>

                <div className="phs-checkbox-row">
                  <label className="red" style={{ fontSize: '11px', fontWeight: 600 }}>If u want Hide this Product</label>
                  <input type="checkbox" checked={hideProduct} onChange={e => setHideProduct(e.target.checked)} />
                </div>
              </div>

              {/* PACKING TYPE */}
              <div className="phs-sub-card">
                <h4 className="phs-sub-title">
                  <Layers size={14} /> Packing Type
                </h4>

                <div className="phs-sub-row">
                  <label className="red">Packing Type<span className="phs-req">*</span></label>
                  <select className="phs-select-sm" value={packingType} onChange={e => setPackingType(e.target.value)}>
                    <option value="10">10</option>
                    <option value="1">1</option>
                    <option value="15">15</option>
                    <option value="100">100</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Strips">Strips</option>
                    <option value="Vials">Vials</option>
                  </select>
                </div>

                <div className="phs-sub-row">
                  <label>Max Dis.Per</label>
                  <input type="text" className="phs-input-sm" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} />
                </div>

                <div className="phs-sub-row">
                  <label>Default Dis.%</label>
                  <input type="text" className="phs-input-sm" value={defaultDiscount} onChange={e => setDefaultDiscount(e.target.value)} />
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE: PRODUCT HISTORY STOCK TRANSACTION GRID */}
          <div className="phs-right-panel">
            <div className="phs-grid-header">
              <h4>
                <FileText size={18} color="#0284c7" />
                Stock Movement & Transaction History ({name || 'Selected Product'})
              </h4>
            </div>

            <div className="phs-table-container">
              <table className="phs-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Ref / Inv No</th>
                    <th>Party / Patient Name</th>
                    <th>Batch No</th>
                    <th>Expiry</th>
                    <th>In Qty</th>
                    <th>Out Qty</th>
                    <th>Balance</th>
                    <th>Rate (₹)</th>
                    <th>MRP (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>
                        <span className={`phs-badge ${row.type.toLowerCase()}`}>{row.type}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0284c7' }}>{row.refNo}</td>
                      <td>{row.partyName}</td>
                      <td style={{ fontWeight: 600 }}>{row.batchNo}</td>
                      <td>{row.expiry}</td>
                      <td style={{ color: '#16a34a', fontWeight: 700 }}>{row.inQty > 0 ? row.inQty : '-'}</td>
                      <td style={{ color: '#dc2626', fontWeight: 700 }}>{row.outQty > 0 ? row.outQty : '-'}</td>
                      <td style={{ fontWeight: 700 }}>{row.balance}</td>
                      <td>₹{row.rate.toFixed(2)}</td>
                      <td>₹{row.mrp.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ACTION TOOLBAR --- */}
        <div className="phs-bottom-toolbar">
          <div className="phs-btn-group">
            <button className="phs-action-btn primary" onClick={handleSave}>
              <Save size={15} /> Save
            </button>
            <button className="phs-action-btn" onClick={handleDelete}>
              <Trash2 size={15} /> Delete
            </button>
            <button className="phs-action-btn" onClick={handleContinue}>
              <RotateCcw size={15} /> Continue
            </button>
            <button className="phs-action-btn" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <button className="phs-action-btn" onClick={() => alert('Packing Master Dialog')}>
              <Package size={15} /> Packing
            </button>
            <button className="phs-action-btn" onClick={() => alert('Category Master Dialog')}>
              <Tag size={15} /> Category
            </button>
            <button className="phs-action-btn" onClick={() => alert('Tax Master Dialog')}>
              <Receipt size={15} /> Tax
            </button>
            <button className="phs-action-btn" onClick={() => alert('Manufacturer Master Dialog')}>
              <Building2 size={15} /> Mfr
            </button>
            <button className="phs-action-btn" onClick={() => alert('Generic Master Dialog')}>
              <Database size={15} /> Gen.Master
            </button>
            <button className="phs-action-btn exit-btn" onClick={onClose}>
              <LogOut size={15} /> Exit
            </button>
          </div>

          <div className="phs-shortcuts-legend">
            <span className="phs-shortcut-chip"><strong>F1</strong> - Product Type Master</span>
            <span className="phs-shortcut-chip"><strong>F5</strong> - Schedule Master</span>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default ProductHistoryScreen;
