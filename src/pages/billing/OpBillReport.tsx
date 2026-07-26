import React, { useState } from 'react';
import { Download } from 'lucide-react';
import './OpBillReport.css';

interface BillItem {
  bNo: string;
  bDate: string;
  ophuid: string;
  pName: string;
  age: string;
  refDoc: string;
  gross: number;
  discount: number;
  total: number;
  paymentMode: 'Cash' | 'Card' | 'UPI';
}

const INITIAL_BILLS: BillItem[] = [
  { bNo: 'OPB-101', bDate: '2026-05-21', ophuid: '3490', pName: 'JAYA SUDHA', age: '29 Yrs', refDoc: 'Dr. G. Srijaya', gross: 500, discount: 0, total: 500, paymentMode: 'Cash' },
  { bNo: 'OPB-102', bDate: '2026-05-21', ophuid: '3491', pName: 'DEEPIKA', age: '26 Yrs', refDoc: 'Dr. G. Srijaya', gross: 750, discount: 50, total: 700, paymentMode: 'Card' },
  { bNo: 'OPB-103', bDate: '2026-05-21', ophuid: '3492', pName: 'MUNESHWARI', age: '21 Yrs', refDoc: 'Dr. Sarah Jenkins', gross: 600, discount: 0, total: 600, paymentMode: 'Cash' },
  { bNo: 'OPB-104', bDate: '2026-05-21', ophuid: '3493', pName: 'KALAIVANI', age: '30 Yrs', refDoc: 'Dr. Rajiv Menon', gross: 1200, discount: 100, total: 1100, paymentMode: 'UPI' },
  { bNo: 'OPB-105', bDate: '2026-05-21', ophuid: '3494', pName: 'KEERTHANA', age: '27 Yrs', refDoc: 'Dr. G. Srijaya', gross: 500, discount: 0, total: 500, paymentMode: 'Cash' },
];

const OpBillReport: React.FC = () => {
  const [reportType, setReportType] = useState('ALL');
  const [fromDate, setFromDate] = useState('2026-05-21');
  const [toDate, setToDate] = useState('2026-05-21');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  
  const [bills] = useState<BillItem[]>(INITIAL_BILLS);
  const [filteredBills, setFilteredBills] = useState<BillItem[]>(INITIAL_BILLS);
  const [activeBillNo, setActiveBillNo] = useState<string>('OPB-101');

  // Handle OK button filter
  const handleApplyFilter = () => {
    let result = [...bills];

    if (fromDate) {
      result = result.filter(b => b.bDate >= fromDate);
    }
    if (toDate) {
      result = result.filter(b => b.bDate <= toDate);
    }
    if (selectedDoctor) {
      result = result.filter(b => b.refDoc.toLowerCase() === selectedDoctor.toLowerCase());
    }

    setFilteredBills(result);
    alert(`Filtered OP Bill Report: ${result.length} record(s) found.`);
  };

  // Export CSV
  const handleExportExcel = () => {
    const csvRows = [
      ['Bill No', 'Date', 'OP OPHUID', 'Patient Name', 'Age', 'Ref Doctor', 'Gross Amount', 'Discount', 'Total Amount', 'Payment Mode'],
      ...filteredBills.map(b => [
        b.bNo,
        b.bDate,
        b.ophuid,
        `"${b.pName}"`,
        b.age,
        `"${b.refDoc}"`,
        b.gross,
        b.discount,
        b.total,
        b.paymentMode
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OP_Bill_Report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalGross = filteredBills.reduce((sum, b) => sum + b.gross, 0);
  const totalDiscount = filteredBills.reduce((sum, b) => sum + b.discount, 0);
  const totalNet = filteredBills.reduce((sum, b) => sum + b.total, 0);

  const cashTotal = filteredBills.filter(b => b.paymentMode === 'Cash').reduce((sum, b) => sum + b.total, 0);
  const cardTotal = filteredBills.filter(b => b.paymentMode === 'Card' || b.paymentMode === 'UPI').reduce((sum, b) => sum + b.total, 0);
  const doctorCommissionTotal = Math.round(totalNet * 0.15); // 15% commission estimate

  return (
    <div className="bill-report-container page-transition">
      <div className="bill-report-header">
        <h2>OP BILL REPORT</h2>
      </div>

      <div className="card filter-bar-card">
        <div className="filter-left">
          <div className="radio-group">
            <input 
              type="radio" 
              id="all" 
              name="reportType" 
              checked={reportType === 'ALL'} 
              onChange={() => setReportType('ALL')} 
            />
            <label htmlFor="all">ALL</label>
          </div>

          <div className="date-filters">
            <div className="date-group">
              <label>From</label>
              <input 
                type="date" 
                className="form-control" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
              />
            </div>
            <div className="date-group">
              <label>To</label>
              <input 
                type="date" 
                className="form-control" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
              />
            </div>
            <button className="btn-ok" type="button" onClick={handleApplyFilter}>OK</button>
          </div>

          <div className="doctor-filter">
            <label>Doctor Wise Report</label>
            <select 
              className="form-control" 
              style={{ width: '220px' }}
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">All Doctors</option>
              <option value="Dr. G. Srijaya">Dr. G. Srijaya</option>
              <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
              <option value="Dr. Rajiv Menon">Dr. Rajiv Menon</option>
            </select>
          </div>
        </div>

        <button className="btn-export" type="button" onClick={handleExportExcel}>
          <Download size={16} />
          EXPORT TO EXCEL
        </button>
      </div>

      <div className="bill-main-content">
        {/* Left Side: Data Table */}
        <div className="card table-card">
          <div className="table-container" style={{ border: 'none', height: '100%', minHeight: '400px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}></th>
                  <th>B.No</th>
                  <th>B.Date</th>
                  <th>OPHUID</th>
                  <th>PName</th>
                  <th>Age</th>
                  <th>Ref Doc</th>
                  <th>Gross</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No bills found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((b) => (
                    <tr 
                      key={b.bNo} 
                      className={activeBillNo === b.bNo ? 'active-row' : ''}
                      onClick={() => setActiveBillNo(b.bNo)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{activeBillNo === b.bNo ? '▶' : ''}</td>
                      <td>{b.bNo}</td>
                      <td>{b.bDate}</td>
                      <td>{b.ophuid}</td>
                      <td>{b.pName}</td>
                      <td>{b.age}</td>
                      <td>{b.refDoc}</td>
                      <td>₹{b.gross}</td>
                      <td>₹{b.discount}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{b.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Summary Panels */}
        <div className="summary-panels">
          <div className="card summary-card">
            <h3 className="summary-title">Collection Register Summary</h3>
            
            <div className="summary-row">
              <span>Gross Collection</span>
              <span className="summary-value">₹{totalGross.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Total Discount</span>
              <span className="summary-value" style={{ color: 'var(--color-error)' }}>-₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="summary-row" style={{ marginTop: '12px', fontWeight: 'bold', fontSize: '16px' }}>
              <span>Net Collection</span>
              <span className="summary-value" style={{ color: '#2e7d32' }}>₹{totalNet.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span style={{ color: 'var(--color-text)' }}>Cash Payment</span>
              <span className="summary-value">₹{cashTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--color-text)' }}>Card / UPI Payment</span>
              <span className="summary-value">₹{cardTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="card summary-card">
            <h3 className="summary-title">Doctor Wise Commission (15%)</h3>
            <div className="summary-row">
              <span>Doctor Selected</span>
              <span className="summary-value" style={{ fontSize: '13px' }}>{selectedDoctor || 'All Doctors'}</span>
            </div>
            <div className="summary-row" style={{ marginTop: '8px' }}>
              <span>Total Commission Amount</span>
              <span className="summary-value" style={{ color: '#0284c7', fontSize: '16px' }}>₹{doctorCommissionTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpBillReport;
