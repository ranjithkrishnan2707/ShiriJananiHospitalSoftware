import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
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
  cashAmount?: number;
  gpayAmount?: number;
  paymentMode: 'Cash' | 'Card' | 'UPI' | 'GPay';
}

const getTodayStr = () => new Date().toISOString().split('T')[0];

const INITIAL_BILLS: BillItem[] = [
  { bNo: 'OPB-101', bDate: getTodayStr(), ophuid: '3490', pName: 'JAYA SUDHA', age: '29 Yrs', refDoc: 'Dr.Sri Janani', gross: 500, discount: 0, total: 500, cashAmount: 500, gpayAmount: 0, paymentMode: 'Cash' },
  { bNo: 'OPB-102', bDate: getTodayStr(), ophuid: '3491', pName: 'DEEPIKA', age: '26 Yrs', refDoc: 'Dr.Sri Janani', gross: 750, discount: 50, total: 700, cashAmount: 0, gpayAmount: 700, paymentMode: 'GPay' },
  { bNo: 'OPB-103', bDate: getTodayStr(), ophuid: '3492', pName: 'MUNESHWARI', age: '21 Yrs', refDoc: 'Dr. Sarah Jenkins', gross: 600, discount: 0, total: 600, cashAmount: 600, gpayAmount: 0, paymentMode: 'Cash' },
  { bNo: 'OPB-104', bDate: getTodayStr(), ophuid: '3493', pName: 'KALAIVANI', age: '30 Yrs', refDoc: 'Dr. Rajiv Menon', gross: 1200, discount: 100, total: 1100, cashAmount: 0, gpayAmount: 1100, paymentMode: 'GPay' },
  { bNo: 'OPB-105', bDate: getTodayStr(), ophuid: '3494', pName: 'KEERTHANA', age: '27 Yrs', refDoc: 'Dr.Sri Janani', gross: 500, discount: 0, total: 500, cashAmount: 500, gpayAmount: 0, paymentMode: 'Cash' },
];

const OpBillReport: React.FC = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('ALL');
  const [fromDate, setFromDate] = useState(getTodayStr());
  const [toDate, setToDate] = useState(getTodayStr());
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
      ['Bill No', 'Date', 'OP OPHUID', 'Patient Name', 'Age', 'Ref Doctor', 'Gross Amount', 'Discount', 'Cash Amount', 'GPay Amount', 'Total Amount', 'Payment Mode'],
      ...filteredBills.map(b => {
        const cashVal = b.cashAmount !== undefined ? b.cashAmount : (b.paymentMode === 'Cash' ? b.total : 0);
        const gpayVal = b.gpayAmount !== undefined ? b.gpayAmount : (b.paymentMode === 'UPI' || b.paymentMode === 'Card' || b.paymentMode === 'GPay' ? b.total : 0);
        return [
          b.bNo,
          b.bDate,
          b.ophuid,
          `"${b.pName}"`,
          b.age,
          `"${b.refDoc}"`,
          b.gross,
          b.discount,
          cashVal,
          gpayVal,
          b.total,
          b.paymentMode
        ];
      })
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

  const totalCashSum = filteredBills.reduce((sum, b) => {
    const cashVal = b.cashAmount !== undefined ? b.cashAmount : (b.paymentMode === 'Cash' ? b.total : 0);
    return sum + cashVal;
  }, 0);

  const totalGPaySum = filteredBills.reduce((sum, b) => {
    const gpayVal = b.gpayAmount !== undefined ? b.gpayAmount : (b.paymentMode === 'UPI' || b.paymentMode === 'Card' || b.paymentMode === 'GPay' ? b.total : 0);
    return sum + gpayVal;
  }, 0);

  return (
    <div className="bill-report-container page-transition">
      <div className="bill-report-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>OP BILL REPORT</h2>
        <button
          type="button"
          className="btn-back-page"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1e293b',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
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
              <option value="Dr.Sri Janani">Dr.Sri Janani</option>
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
        {/* Full Width Data Table */}
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
                  <th>Cash</th>
                  <th>GPay</th>
                  <th>Total</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No bills found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((b) => {
                    const cashVal = b.cashAmount !== undefined ? b.cashAmount : (b.paymentMode === 'Cash' ? b.total : 0);
                    const gpayVal = b.gpayAmount !== undefined ? b.gpayAmount : (b.paymentMode === 'UPI' || b.paymentMode === 'Card' || b.paymentMode === 'GPay' ? b.total : 0);

                    return (
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
                        <td>
                          <button
                            type="button"
                            className="clickable-patient-name-btn"
                            title="Click to view full medical and billing history for this patient"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/doctor/patient-history/${b.ophuid}`);
                            }}
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
                            {b.pName}
                          </button>
                        </td>
                        <td>{b.age}</td>
                        <td>{b.refDoc}</td>
                        <td>₹{b.gross}</td>
                        <td>₹{b.discount}</td>
                        <td style={{ color: cashVal > 0 ? '#16a34a' : '#94a3b8', fontWeight: cashVal > 0 ? 600 : 400 }}>
                          {cashVal > 0 ? `₹${cashVal.toFixed(2)}` : '-'}
                        </td>
                        <td style={{ color: gpayVal > 0 ? '#0284c7' : '#94a3b8', fontWeight: gpayVal > 0 ? 600 : 400 }}>
                          {gpayVal > 0 ? `₹${gpayVal.toFixed(2)}` : '-'}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{b.total.toFixed(2)}</td>
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: b.paymentMode === 'Cash' ? '#dcfce7' : '#e0f2fe',
                            color: b.paymentMode === 'Cash' ? '#166534' : '#0369a1'
                          }}>
                            {b.paymentMode}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {filteredBills.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                    <td colSpan={7} style={{ textAlign: 'right', padding: '12px' }}>SUMMARY TOTAL:</td>
                    <td>₹{totalGross.toFixed(2)}</td>
                    <td style={{ color: 'var(--color-error)' }}>-₹{totalDiscount.toFixed(2)}</td>
                    <td style={{ color: '#16a34a' }}>₹{totalCashSum.toFixed(2)}</td>
                    <td style={{ color: '#0284c7' }}>₹{totalGPaySum.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#0f172a', fontSize: '15px' }}>₹{totalNet.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpBillReport;
