import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';

const ExpenseAuditLogsPage: React.FC = () => {
  const { auditLogs } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      log.expenseId.toLowerCase().includes(q) ||
      log.changedBy.toLowerCase().includes(q) ||
      log.reason.toLowerCase().includes(q) ||
      log.oldValue.toLowerCase().includes(q) ||
      log.newValue.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Filter */}
      <div className="filter-card">
        <div className="filter-header-row">
          <div className="global-search-container">
            <Search className="global-search-icon" size={16} />
            <input 
              type="text" 
              className="global-search-input"
              placeholder="Search audit trail by Expense ID, Changed By, or Reason..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="expenses-table-card">
        <div className="table-meta-bar">
          <span className="table-results-count">
            Total <strong>{filteredLogs.length}</strong> Audit History Log Entries
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Expense ID</th>
                <th>Changed At</th>
                <th>Changed By</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Reason for Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No financial audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 700, color: '#be185d' }}>{log.id}</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{log.expenseId}</td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: '#475569' }}>{log.changedAt}</td>
                    <td style={{ fontWeight: 600 }}>{log.changedBy}</td>
                    <td style={{ fontSize: '12px', color: '#991b1b', backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '4px' }}>
                      {log.oldValue}
                    </td>
                    <td style={{ fontSize: '12px', color: '#166534', backgroundColor: '#f0fdf4', padding: '6px 10px', borderRadius: '4px' }}>
                      {log.newValue}
                    </td>
                    <td style={{ fontWeight: 600, color: '#b45309', fontSize: '12px' }}>
                      {log.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAuditLogsPage;
