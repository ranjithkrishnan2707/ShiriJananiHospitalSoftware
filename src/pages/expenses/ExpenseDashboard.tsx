import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, 
  RotateCcw, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  AlertTriangle,
  CheckCircle,
  Percent,
  Clock
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import type { Expense } from '../../context/ExpenseContext';
import ExpenseDetailModal from './ExpenseDetailModal';
import ExpenseEditModal from './ExpenseEditModal';
import './ExpenseDashboard.css';

interface OutletContextType {
  onOpenAddModal: () => void;
}

const ExpenseDashboard: React.FC = () => {
  const { expenses, categories, vendors, voidExpense } = useExpense();
  const { onOpenAddModal } = useOutletContext<OutletContextType>();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('ALL');
  const [selectedVendor, setSelectedVendor] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active'); // Default to Active

  // Modal States
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [voidingExpense, setVoidingExpense] = useState<Expense | null>(null);
  const [voidReason, setVoidReason] = useState('');

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setSelectedDept('ALL');
    setSelectedCat('ALL');
    setSelectedMode('ALL');
    setSelectedPaymentStatus('ALL');
    setSelectedVendor('ALL');
    setSelectedUser('ALL');
    setSelectedStatus('Active');
  };

  // Compute Summary Statistics (using Active expenses for financials)
  const stats = useMemo(() => {
    const activeExpenses = expenses.filter(e => e.status === 'Active');
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Calculated start of week (Monday)
    const dayOfWeek = now.getDay();
    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diffToMonday)).toISOString().split('T')[0];

    const currentMonth = todayStr.substring(0, 7); // YYYY-MM

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let grandTotal = 0;

    let cashTotal = 0;
    let upiTotal = 0;
    let bankTotal = 0;
    let cardTotal = 0;

    let paidTotal = 0;
    let advancePaidTotal = 0;
    let pendingTotal = 0;

    activeExpenses.forEach(exp => {
      const amt = exp.amount;
      grandTotal += amt;

      if (exp.expenseDate === todayStr) {
        todayTotal += amt;
      }
      if (exp.expenseDate >= startOfWeek) {
        weekTotal += amt;
      }
      if (exp.expenseDate.startsWith(currentMonth)) {
        monthTotal += amt;
      }

      if (exp.paymentMode === 'Cash') cashTotal += amt;
      else if (exp.paymentMode === 'UPI') upiTotal += amt;
      else if (exp.paymentMode === 'Bank Transfer') bankTotal += amt;
      else if (exp.paymentMode === 'Card') cardTotal += amt;

      // Payment Status totals
      const pStatus = exp.paymentStatus || 'Paid';
      if (pStatus === 'Paid') {
        paidTotal += (exp.paidAmount !== undefined ? exp.paidAmount : amt);
      } else if (pStatus === 'Advance Paid') {
        advancePaidTotal += (exp.paidAmount !== undefined ? exp.paidAmount : Math.round(amt * 0.5));
        pendingTotal += (exp.pendingAmount !== undefined ? exp.pendingAmount : Math.round(amt * 0.5));
      } else if (pStatus === 'Pending') {
        pendingTotal += (exp.pendingAmount !== undefined ? exp.pendingAmount : amt);
      }
    });

    return {
      todayTotal,
      weekTotal,
      monthTotal,
      grandTotal,
      cashTotal,
      upiTotal,
      bankTotal,
      cardTotal,
      paidTotal,
      advancePaidTotal,
      pendingTotal
    };
  }, [expenses]);

  // Unique list of creators for filter
  const uniqueAddedBy = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach(e => {
      if (e.createdBy) set.add(e.createdBy);
    });
    return Array.from(set);
  }, [expenses]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // Global Search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchId = exp.id.toLowerCase().includes(query);
        const matchVendor = exp.vendor.toLowerCase().includes(query);
        const matchInvoice = (exp.invoiceNo || '').toLowerCase().includes(query);
        const matchDesc = (exp.description || '').toLowerCase().includes(query);
        if (!matchId && !matchVendor && !matchInvoice && !matchDesc) return false;
      }

      // Date Range
      if (dateFrom && exp.expenseDate < dateFrom) return false;
      if (dateTo && exp.expenseDate > dateTo) return false;

      // Department
      if (selectedDept !== 'ALL' && exp.department !== selectedDept) return false;

      // Category
      if (selectedCat !== 'ALL' && exp.category !== selectedCat) return false;

      // Payment Mode
      if (selectedMode !== 'ALL' && exp.paymentMode !== selectedMode) return false;

      // Payment Status (Paid, Advance Paid, Pending)
      if (selectedPaymentStatus !== 'ALL') {
        const pStatus = exp.paymentStatus || 'Paid';
        if (pStatus !== selectedPaymentStatus) return false;
      }

      // Vendor
      if (selectedVendor !== 'ALL' && exp.vendor !== selectedVendor) return false;

      // Added By
      if (selectedUser !== 'ALL' && exp.createdBy !== selectedUser) return false;

      // Status
      if (selectedStatus !== 'ALL' && exp.status !== selectedStatus) return false;

      return true;
    });
  }, [
    expenses, 
    searchTerm, 
    dateFrom, 
    dateTo, 
    selectedDept, 
    selectedCat, 
    selectedMode, 
    selectedPaymentStatus,
    selectedVendor, 
    selectedUser, 
    selectedStatus
  ]);

  // Handle Confirm Void
  const handleConfirmVoid = () => {
    if (!voidingExpense) return;
    if (!voidReason.trim()) {
      alert('Please provide a reason for voiding this financial record.');
      return;
    }
    voidExpense(voidingExpense.id, voidReason, 'Dr. Admin');
    setVoidingExpense(null);
    setVoidReason('');
  };

  return (
    <div>
      {/* Top Dashboard Summary Cards */}
      <div className="dashboard-summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box today">
            <Calendar size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Today's Expense</span>
            <span className="summary-amount">₹{stats.todayTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box week">
            <Wallet size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">This Week</span>
            <span className="summary-amount">₹{stats.weekTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box month">
            <DollarSign size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">This Month</span>
            <span className="summary-amount">₹{stats.monthTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box total">
            <Building2 size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Total Expense</span>
            <span className="summary-amount">₹{stats.grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* PAYMENT STATUS CARDS (PAID, ADVANCE PAID, PENDING) */}
        <div className="summary-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="summary-icon-box" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Fully Paid</span>
            <span className="summary-amount" style={{ color: '#16a34a' }}>₹{stats.paidTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="summary-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div className="summary-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Percent size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Advance Paid</span>
            <span className="summary-amount" style={{ color: '#0284c7' }}>₹{stats.advancePaidTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="summary-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="summary-icon-box" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Pending Balance</span>
            <span className="summary-amount" style={{ color: '#d97706' }}>₹{stats.pendingTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Mode Breakdown */}
        <div className="summary-card">
          <div className="summary-icon-box cash">
            <Wallet size={20} />
          </div>
          <div className="summary-content">
            <span className="summary-label">Cash Expense</span>
            <span className="summary-amount" style={{ fontSize: '17px', color: '#d97706' }}>
              ₹{stats.cashTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-card">
        <div className="filter-header-row">
          <div className="global-search-container">
            <Search className="global-search-icon" size={16} />
            <input 
              type="text" 
              className="global-search-input"
              placeholder="Search by Expense ID, Vendor, Invoice No, Description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            className="btn-reset-filters" 
            onClick={handleResetFilters}
            title="Reset all filters to default"
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>

        <div className="filter-row-grid">
          <div className="filter-item">
            <label>From Date</label>
            <input 
              type="date" 
              className="filter-control" 
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>To Date</label>
            <input 
              type="date" 
              className="filter-control" 
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>Department</label>
            <select 
              className="filter-control"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              <option value="Medical">Medical</option>
              <option value="Lab">Lab</option>
              <option value="Scan">Scan</option>
              <option value="OPD">OPD</option>
              <option value="IPD">IPD</option>
              <option value="Admin">Admin</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Expense Category</label>
            <select 
              className="filter-control"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Payment Mode</label>
            <select 
              className="filter-control"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              <option value="ALL">All Payment Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* PAYMENT STATUS FILTER: PAID, ADVANCE PAID, PENDING */}
          <div className="filter-item">
            <label>Payment Status</label>
            <select 
              className="filter-control"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              style={{ fontWeight: selectedPaymentStatus !== 'ALL' ? 700 : 400 }}
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Paid">Paid (Full)</option>
              <option value="Advance Paid">Advance Paid (% Paid)</option>
              <option value="Pending">Pending (Unpaid)</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Vendor / Paid To</label>
            <select 
              className="filter-control"
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
            >
              <option value="ALL">All Vendors</option>
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Added By</label>
            <select 
              className="filter-control"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="ALL">All Users</option>
              {uniqueAddedBy.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Status</label>
            <select 
              className="filter-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Voided">Voided</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Expense Table */}
      <div className="expenses-table-card">
        <div className="table-meta-bar">
          <span className="table-results-count">
            Showing <strong>{filteredExpenses.length}</strong> expense record(s)
          </span>
          <button 
            type="button" 
            className="btn-add-expense-primary" 
            style={{ fontSize: '13px', padding: '6px 14px' }}
            onClick={onOpenAddModal}
          >
             Add Expense
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense ID</th>
                <th>Department</th>
                <th>Category</th>
                <th>Vendor</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Amount</th>
                <th>Added By</th>
                <th>Record Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No expenses found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const pStatus = exp.paymentStatus || 'Paid';
                  const isAdv = pStatus === 'Advance Paid';
                  const isPend = pStatus === 'Pending';
                  const advPct = exp.advancePercentage !== undefined ? exp.advancePercentage : 50;
                  const paidAmt = exp.paidAmount !== undefined ? exp.paidAmount : (isPend ? 0 : isAdv ? Math.round(exp.amount * 0.5) : exp.amount);
                  const pendAmt = exp.pendingAmount !== undefined ? exp.pendingAmount : (isPend ? exp.amount : isAdv ? exp.amount - paidAmt : 0);

                  return (
                    <tr key={exp.id} style={{ opacity: exp.status === 'Voided' ? 0.65 : 1 }}>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{exp.expenseDate}</td>
                      <td>
                        <span 
                          style={{ color: '#be185d', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => setViewingExpense(exp)}
                        >
                          {exp.id}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          color: '#334155'
                        }}>
                          {exp.department}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{exp.category}</td>
                      <td style={{ fontWeight: 600 }}>{exp.vendor}</td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 
                            exp.paymentMode === 'Cash' ? '#fef3c7' :
                            exp.paymentMode === 'UPI' ? '#ccfbf1' :
                            exp.paymentMode === 'Bank Transfer' ? '#e0e7ff' : '#fae8ff',
                          color:
                            exp.paymentMode === 'Cash' ? '#b45309' :
                            exp.paymentMode === 'UPI' ? '#0f766e' :
                            exp.paymentMode === 'Bank Transfer' ? '#3730a3' : '#a21caf'
                        }}>
                          {exp.paymentMode}
                        </span>
                      </td>

                      {/* PAYMENT STATUS BADGE */}
                      <td>
                        {pStatus === 'Paid' && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <CheckCircle size={12} /> Paid
                          </span>
                        )}

                        {pStatus === 'Advance Paid' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 800,
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              border: '1px solid #bae6fd',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              width: 'fit-content'
                            }}>
                              <Percent size={11} /> Advance Paid ({advPct}%)
                            </span>
                            <span style={{ fontSize: '10.5px', color: '#0369a1', fontWeight: 600 }}>
                              Paid: ₹{paidAmt.toLocaleString()} | Due: ₹{pendAmt.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {pStatus === 'Pending' && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: '#fef3c7',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Clock size={12} /> Pending (Unpaid)
                          </span>
                        )}
                      </td>

                      <td style={{ fontWeight: 700, color: exp.status === 'Voided' ? '#94a3b8' : '#0f172a' }}>
                        ₹{exp.amount.toLocaleString()}
                      </td>
                      <td style={{ fontSize: '12px', color: '#475569' }}>{exp.createdBy}</td>
                      <td>
                        <span className={`badge-status ${exp.status.toLowerCase()}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                          <button 
                            type="button"
                            className="btn-action-icon view"
                            onClick={() => setViewingExpense(exp)}
                            title="View Details"
                          >
                            <Eye size={13} /> View
                          </button>

                          {exp.status === 'Active' && (
                            <>
                              <button 
                                type="button"
                                className="btn-action-icon edit"
                                onClick={() => setEditingExpense(exp)}
                                title="Edit Expense"
                              >
                                <Edit size={13} /> Edit
                              </button>

                              <button 
                                type="button"
                                className="btn-action-icon void"
                                onClick={() => setVoidingExpense(exp)}
                                title="Soft Delete / Void Record"
                              >
                                <Trash2 size={13} /> Void
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Detail View Modal */}
      {viewingExpense && (
        <ExpenseDetailModal 
          expense={viewingExpense}
          onClose={() => setViewingExpense(null)}
          onEdit={(exp) => {
            setViewingExpense(null);
            setEditingExpense(exp);
          }}
        />
      )}

      {/* Expense Edit Modal */}
      {editingExpense && (
        <ExpenseEditModal 
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {/* Void / Soft Delete Confirmation Dialog */}
      {voidingExpense && (
        <div className="modal-overlay">
          <div className="modal-box-card">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle color="#dc2626" size={24} />
                <h3 style={{ color: '#dc2626' }}>Confirm Void Expense Record</h3>
              </div>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                onClick={() => setVoidingExpense(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '14px', color: '#334155', margin: 0 }}>
                Are you sure you want to void expense <strong>{voidingExpense.id}</strong> (₹{voidingExpense.amount.toLocaleString()} - {voidingExpense.vendor})?
              </p>
              
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#991b1b'
              }}>
                <strong>Important Audit Rule:</strong> Financial records are not permanently deleted. The status will be changed to <strong>Voided</strong> and preserved in audit history.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Reason for Voiding <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea 
                  className="form-control"
                  placeholder="e.g. Duplicate entry created by mistake / Order cancelled"
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  style={{ minHeight: '60px' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-reset-filters" 
                onClick={() => setVoidingExpense(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={handleConfirmVoid}
              >
                Yes, Void Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;
