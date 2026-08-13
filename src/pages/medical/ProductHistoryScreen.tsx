import React, { useState } from 'react';
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
  const [selectedCode, setSelectedCode] = useState<string>('PROD-1001');

  // Form Fields State
  const activeProduct = productList.find(p => p.code === selectedCode) || SAMPLE_PRODUCTS[0];

  const [code, setCode] = useState(activeProduct.code);
  const [name, setName] = useState(activeProduct.name);
  const [generic, setGeneric] = useState(activeProduct.generic);
  const [category, setCategory] = useState(activeProduct.category);
  const [manufacturer, setManufacturer] = useState(activeProduct.manufacturer);
  const [rack, setRack] = useState(activeProduct.rack);
  const [hsn, setHsn] = useState(activeProduct.hsn);
  const [schedule, setSchedule] = useState(activeProduct.schedule);
  const [productType, setProductType] = useState(activeProduct.type);

  const [minStock, setMinStock] = useState(activeProduct.minStock);
  const [maxStock, setMaxStock] = useState(activeProduct.maxStock);
  const [reorderLevel, setReorderLevel] = useState(activeProduct.reorderLevel);
  const [hideProduct, setHideProduct] = useState(activeProduct.hide);

  const [packingType, setPackingType] = useState(activeProduct.packingType);
  const [maxDiscount, setMaxDiscount] = useState(activeProduct.maxDiscount);
  const [defaultDiscount, setDefaultDiscount] = useState(activeProduct.defaultDiscount);

  // Load product details when selection changes
  const handleSelectProduct = (selected: ProductItem) => {
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
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      alert(`Product "${name}" deleted.`);
    }
  };

  const handleContinue = () => {
    setCode(`PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setGeneric('');
    setCategory('');
    setManufacturer('');
    setRack('');
    setHsn('');
    setSchedule('Scheduled');
    setProductType('COMPANY');
    setMinStock('10');
    setMaxStock('100');
    setReorderLevel('20');
    setHideProduct(false);
    setPackingType('10');
    setMaxDiscount('0');
    setDefaultDiscount('0');
  };

  const historyRows = INITIAL_HISTORY[selectedCode] || [
    { date: new Date().toISOString().split('T')[0], type: 'Purchase', refNo: 'INV-NEW', partyName: 'Initial Opening Stock', batchNo: 'BATCH-01', expiry: '2028-12', inQty: 100, outQty: 0, balance: 100, rate: 50, mrp: 75 }
  ];

  return (
    <div className="phs-overlay">
      <div className="phs-window">

        {/* --- TOP WOODEN HEADER BANNER --- */}
        <div className="phs-header-banner">
          <div className="phs-header-doctor">DR.G.SRI JANANI,MD(OG).,</div>
          <div className="phs-header-titlebar">
            <span>Product History Screen</span>
            <button className="phs-top-close" onClick={onClose} title="Close Window">X</button>
          </div>
        </div>

        {/* --- MAIN CONTENT: LEFT FORM + RIGHT GRID --- */}
        <div className="phs-main-body">

          {/* LEFT SIDE: DETAILS OF PRODUCT FORM */}
          <div className="phs-left-panel">
            <h3 className="phs-section-title">Details of Product</h3>

            {/* Product Quick Selector Dropdown */}
            <div className="phs-form-row" style={{ marginBottom: '4px' }}>
              <label className="phs-label" style={{ color: '#0000aa' }}>Quick Select</label>
              <select
                className="phs-select"
                value={selectedCode}
                onChange={(e) => {
                  const found = productList.find(p => p.code === e.target.value);
                  if (found) handleSelectProduct(found);
                }}
              >
                {productList.map(p => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Product Code</label>
              <input type="text" className="phs-input readonly" value={code} onChange={e => setCode(e.target.value)} />
            </div>

            <div className="phs-form-row">
              <label className="phs-label red">Product Name</label>
              <input type="text" className="phs-input" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Generic Name</label>
              <input type="text" className="phs-input" value={generic} onChange={e => setGeneric(e.target.value)} />
            </div>

            <div className="phs-form-row">
              <label className="phs-label red">Category</label>
              <input type="text" className="phs-input" value={category} onChange={e => setCategory(e.target.value)} />
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Manufacturer</label>
              <input type="text" className="phs-input" value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
            </div>

            <div className="phs-form-grid-2">
              <div className="phs-form-col">
                <label className="phs-label">Rack Position</label>
                <input type="text" className="phs-input" value={rack} onChange={e => setRack(e.target.value)} />
              </div>
              <div className="phs-form-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <label className="phs-label" style={{ whiteSpace: 'nowrap', background: '#fff', padding: '2px 4px', border: '1px solid #7f9db9' }}>HSN Code</label>
                  <input type="text" className="phs-input" value={hsn} onChange={e => setHsn(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="phs-form-row">
              <label className="phs-label">Schedule</label>
              <select className="phs-select" value={schedule} onChange={e => setSchedule(e.target.value)}>
                <option value="Scheduled">Scheduled</option>
                <option value="Non-Scheduled">Non-Scheduled</option>
                <option value="H1">H1</option>
                <option value="X">X</option>
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

            {/* LEVEL'S & PACKING TYPE SUB-SECTIONS */}
            <div className="phs-sub-sections-grid">

              {/* LEVEL'S */}
              <div className="phs-sub-card">
                <h4 className="phs-sub-title">Level's</h4>

                <div className="phs-sub-row">
                  <label>Min. Stock Level</label>
                  <input type="text" className="phs-input-sm" value={minStock} onChange={e => setMinStock(e.target.value)} />
                </div>

                <div className="phs-sub-row">
                  <label>Max. Stock Level</label>
                  <input type="text" className="phs-input-sm" value={maxStock} onChange={e => setMaxStock(e.target.value)} />
                </div>

                <div className="phs-sub-row">
                  <label className="red">Reorder Level</label>
                  <input type="text" className="phs-input-sm" value={reorderLevel} onChange={e => setReorderLevel(e.target.value)} />
                </div>

                <div className="phs-checkbox-row">
                  <label className="red" style={{ fontSize: '12px' }}>If u want Hide this Product</label>
                  <input type="checkbox" checked={hideProduct} onChange={e => setHideProduct(e.target.checked)} />
                </div>
              </div>

              {/* PACKING TYPE */}
              <div className="phs-sub-card">
                <h4 className="phs-sub-title">Packing Type</h4>

                <div className="phs-sub-row">
                  <label className="red">Packing Type</label>
                  <select className="phs-select-sm" value={packingType} onChange={e => setPackingType(e.target.value)}>
                    <option value="10">10</option>
                    <option value="1">1</option>
                    <option value="15">15</option>
                    <option value="100">100</option>
                    <option value="Bottles">Bottles</option>
                    <option value="Strips">Strips</option>
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

          {/* RIGHT SIDE: PRODUCT HISTORY STOCK TRANSACTION GRID TABLE */}
          <div className="phs-right-panel">
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
                      <td style={{ fontWeight: 'bold', color: '#0000aa' }}>{row.refNo}</td>
                      <td>{row.partyName}</td>
                      <td style={{ fontWeight: 'bold' }}>{row.batchNo}</td>
                      <td>{row.expiry}</td>
                      <td style={{ color: '#008000', fontWeight: 'bold' }}>{row.inQty > 0 ? row.inQty : '-'}</td>
                      <td style={{ color: '#c00000', fontWeight: 'bold' }}>{row.outQty > 0 ? row.outQty : '-'}</td>
                      <td style={{ fontWeight: 'bold' }}>{row.balance}</td>
                      <td>₹{row.rate.toFixed(2)}</td>
                      <td>₹{row.mrp.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ACTION TOOLBAR BUTTONS & SHORTCUT LEGENDS --- */}
        <div className="phs-bottom-toolbar">
          <div className="phs-btn-group">
            <button className="phs-action-btn" onClick={handleSave}><u>S</u>ave</button>
            <button className="phs-action-btn" onClick={handleDelete}><u>D</u>elete</button>
            <button className="phs-action-btn" onClick={handleContinue}><u>C</u>ontinue</button>
            <button className="phs-action-btn" onClick={() => window.print()}><u>P</u>rint</button>
            <button className="phs-action-btn" onClick={() => alert('Packing Master Dialog')}>Packing</button>
            <button className="phs-action-btn" onClick={() => alert('Category Master Dialog')}>Category</button>
            <button className="phs-action-btn" onClick={() => alert('Tax Master Dialog')}>Tax</button>
            <button className="phs-action-btn" onClick={() => alert('Manufacturer Master Dialog')}>Mfr</button>
            <button className="phs-action-btn" onClick={() => alert('Generic Master Dialog')}>Gen.Master</button>
            <button className="phs-action-btn" onClick={onClose}><u>E</u>xit</button>
          </div>

          <div className="phs-shortcuts-legend">
            <div><span className="red">F1</span> - Product Type Master</div>
            <div><span className="red">F5</span> - Schedule Master</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductHistoryScreen;
