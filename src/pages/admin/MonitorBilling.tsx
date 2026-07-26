import React, { useState } from 'react';
import { LineChart, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import './MonitorBilling.css';

interface BillingRecord {
  id: string;
  patientName: string;
  uhid: string;
  date: string;
  time: string;
  type: 'IPD' | 'OPD';
  amount: number;
  status: 'Paid' | 'Pending';
}

const MOCK_BILLING_DATA: BillingRecord[] = [
  { id: 'BILL-1001', patientName: 'Rajesh Kumar', uhid: 'UHID-1001', date: '2026-07-16', time: '09:30 AM', type: 'OPD', amount: 500, status: 'Paid' },
  { id: 'BILL-1002', patientName: 'Priya Sharma', uhid: 'UHID-1002', date: '2026-07-16', time: '10:15 AM', type: 'IPD', amount: 15000, status: 'Pending' },
  { id: 'BILL-1003', patientName: 'Amit Patel', uhid: 'UHID-1003', date: '2026-07-15', time: '02:45 PM', type: 'OPD', amount: 650, status: 'Paid' },
  { id: 'BILL-1004', patientName: 'Sunita Devi', uhid: 'UHID-1004', date: '2026-07-15', time: '04:00 PM', type: 'IPD', amount: 8500, status: 'Paid' },
  { id: 'BILL-1005', patientName: 'Karthik Raja', uhid: 'UHID-1005', date: '2026-07-14', time: '11:20 AM', type: 'OPD', amount: 1200, status: 'Pending' },
];

const MonitorBilling: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredData = MOCK_BILLING_DATA.filter(record => {
    const typeMatch = filterType === 'All' || record.type === filterType;
    const statusMatch = filterStatus === 'All' || record.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const totalRevenue = MOCK_BILLING_DATA.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = MOCK_BILLING_DATA.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);
  const todayRevenue = MOCK_BILLING_DATA.filter(r => r.date === '2026-07-16' && r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="billing-dashboard page-transition">
      <div className="billing-header">
        <h2><LineChart size={28} /> Monitor Billing Details</h2>
      </div>

      <div className="billing-summary-cards">
        <div className="summary-card">
          <div className="card-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="card-info">
            <h3>Total Revenue</h3>
            <p className="amount">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon pending">
            <AlertCircle size={24} />
          </div>
          <div className="card-info">
            <h3>Pending Payments</h3>
            <p className="amount">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon today">
            <Calendar size={24} />
          </div>
          <div className="card-info">
            <h3>Today's Collection</h3>
            <p className="amount">₹{todayRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="billing-filters">
        <div className="filter-group">
          <label>Department Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Departments</option>
            <option value="IPD">IPD Only</option>
            <option value="OPD">OPD Only</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Payment Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="billing-table-container">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Patient Name (UHID)</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(record => (
                <tr key={record.id}>
                  <td><strong>{record.id}</strong></td>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.patientName} <br/><small className="text-gray-500">{record.uhid}</small></td>
                  <td>{record.type}</td>
                  <td>₹{record.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="action-links">
                    <button onClick={() => alert(`Viewing details for ${record.id}`)}>View</button>
                    {record.status === 'Pending' && (
                      <button onClick={() => alert(`Sending reminder for ${record.id}`)}>Remind</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No billing records found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitorBilling;
