import React, { useState } from 'react';
import { Edit, X, Save, History, AlertCircle, Percent } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import type { Expense, DepartmentType, PaymentModeType, PaymentStatusType } from '../../context/ExpenseContext';

interface ExpenseEditModalProps {
  expense: Expense;
  onClose: () => void;
}

const ExpenseEditModal: React.FC<ExpenseEditModalProps> = ({ expense, onClose }) => {
  const { categories, updateExpense } = useExpense();

  const [expenseDate, setExpenseDate] = useState<string>(expense.expenseDate);
  const [expenseTime, setExpenseTime] = useState<string>(expense.expenseTime);
  const [department, setDepartment] = useState<DepartmentType>(expense.department);
  const [category, setCategory] = useState<string>(expense.category);
  const [vendor, setVendor] = useState<string>(expense.vendor);
  const [invoiceNo, setInvoiceNo] = useState<string>(expense.invoiceNo || '');
  const [description, setDescription] = useState<string>(expense.description || '');
  const [amount, setAmount] = useState<string>(expense.amount.toString());
  const [paymentMode, setPaymentMode] = useState<PaymentModeType>(expense.paymentMode);

  // Payment Status: Paid, Advance Paid, Pending
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>(expense.paymentStatus || 'Paid');
  const [advancePercentage, setAdvancePercentage] = useState<string>(
    expense.advancePercentage !== undefined ? expense.advancePercentage.toString() : '50'
  );

  const [notes, setNotes] = useState<string>(expense.notes || '');

  // MANDATORY Audit Reason
  const [reasonForChange, setReasonForChange] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Computed calculations for Advance Paid
  const totalAmtNum = parseFloat(amount) || 0;
  const advPctNum = parseFloat(advancePercentage) || 0;
  const calculatedPaid = paymentStatus === 'Paid' ? totalAmtNum : paymentStatus === 'Pending' ? 0 : Math.round((totalAmtNum * advPctNum) / 100 * 100) / 100;
  const calculatedPending = totalAmtNum - calculatedPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Amount must be greater than 0.');
      return;
    }

    if (paymentStatus === 'Advance Paid') {
      if (isNaN(advPctNum) || advPctNum <= 0 || advPctNum >= 100) {
        setErrorMsg('Advance paid percentage must be between 1% and 99%.');
        return;
      }
    }

    if (!reasonForChange.trim()) {
      setErrorMsg('Reason for Change is MANDATORY for financial audit history tracking.');
      return;
    }

    updateExpense(
      expense.id,
      {
        expenseDate,
        expenseTime,
        department,
        category,
        vendor: vendor.trim(),
        invoiceNo: invoiceNo.trim(),
        description: description.trim(),
        amount: parsedAmount,
        paymentMode,
        paymentStatus,
        advancePercentage: paymentStatus === 'Advance Paid' ? advPctNum : undefined,
        paidAmount: calculatedPaid,
        pendingAmount: calculatedPending,
        notes: notes.trim()
      },
      reasonForChange.trim(),
      'Dr. Admin'
    );

    alert(`Expense ${expense.id} updated and audit log saved successfully.`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="add-expense-modal-card">
        <div className="add-expense-modal-header" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}>
          <h3>
            <Edit size={20} /> Edit Expense Record ({expense.id})
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-expense-form-body">
          {errorMsg && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {/* Audit Notice */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#b45309'
          }}>
            <strong>Financial Audit Tracking Enabled:</strong> Any modifications to this expense record will generate a permanent audit trail entry.
          </div>

          <div className="form-row-grid-2">
            <div className="form-field-group">
              <label>Expense Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
              />
            </div>

            <div className="form-field-group">
              <label>Expense Time</label>
              <input 
                type="time" 
                className="form-control" 
                value={expenseTime}
                onChange={(e) => setExpenseTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-grid-2">
            <div className="form-field-group">
              <label>Department</label>
              <select 
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                required
              >
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

            <div className="form-field-group">
              <label>Expense Category</label>
              <select 
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-grid-2">
            <div className="form-field-group">
              <label>Vendor / Paid To</label>
              <input 
                type="text" 
                className="form-control" 
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                required
              />
            </div>

            <div className="form-field-group">
              <label>Invoice / Bill Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </div>
          </div>

          {/* Amount, Payment Mode, Payment Status */}
          <div className="form-row-grid-3">
            <div className="form-field-group">
              <label>Total Amount (₹)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                className="form-control" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ fontSize: '16px', fontWeight: 700, color: '#b45309' }}
              />
            </div>

            <div className="form-field-group">
              <label>Payment Mode</label>
              <select 
                className="form-control"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentModeType)}
                required
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Future Payment">Future Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field-group">
              <label>Payment Status</label>
              <select 
                className="form-control"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatusType)}
                required
                style={{
                  fontWeight: 700,
                  color: paymentStatus === 'Paid' ? '#15803d' : paymentStatus === 'Advance Paid' ? '#0369a1' : '#b45309',
                  backgroundColor: paymentStatus === 'Paid' ? '#f0fdf4' : paymentStatus === 'Advance Paid' ? '#f0f9ff' : '#fffbeb'
                }}
              >
                <option value="Paid">Paid (Full)</option>
                <option value="Advance Paid">Advance Paid (% Paid)</option>
                <option value="Pending">Pending (Unpaid)</option>
              </select>
            </div>
          </div>

          {/* ADVANCE PAID CALCULATIONS IN EDIT MODAL */}
          {paymentStatus === 'Advance Paid' && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1.5px dashed #0284c7',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Percent size={16} /> Advance Payment Details (% Paid)
                </span>
              </div>

              <div className="form-row-grid-3" style={{ alignItems: 'center' }}>
                <div className="form-field-group">
                  <label style={{ color: '#0369a1' }}>% Paid (Advance Percentage)</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      min="1"
                      max="99"
                      step="1"
                      className="form-control" 
                      value={advancePercentage}
                      onChange={(e) => setAdvancePercentage(e.target.value)}
                      required
                      style={{ paddingRight: '30px', fontWeight: 700, fontSize: '15px', color: '#0284c7' }}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#0284c7' }}>%</span>
                  </div>
                </div>

                <div className="form-field-group">
                  <label style={{ color: '#15803d' }}>Advance Amount Paid (₹)</label>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#15803d'
                  }}>
                    ₹{calculatedPaid.toLocaleString()}
                  </div>
                </div>

                <div className="form-field-group">
                  <label style={{ color: '#b45309' }}>Remaining Pending Amount (₹)</label>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#b45309'
                  }}>
                    ₹{calculatedPending.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-field-group">
            <label>Description / Reason</label>
            <textarea 
              className="form-control" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-field-group">
            <label>Additional Notes</label>
            <input 
              type="text" 
              className="form-control" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* MANDATORY REASON FOR CHANGE INPUT */}
          <div className="form-field-group" style={{ backgroundColor: '#fef3c7', padding: '14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <label style={{ color: '#b45309', fontSize: '13px', fontWeight: 700 }}>
              <History size={16} /> Reason for Change <span className="required-asterisk">*</span>
            </label>
            <textarea 
              className="form-control" 
              placeholder="e.g. Updated payment status to Advance Paid (50%) per vendor agreement"
              value={reasonForChange}
              onChange={(e) => setReasonForChange(e.target.value)}
              required
              rows={2}
              style={{ backgroundColor: '#ffffff' }}
            />
            <span style={{ fontSize: '11px', color: '#92400e' }}>
              This explanation will be logged permanently in the financial audit trail alongside your user ID (Dr. Admin).
            </span>
          </div>

          <div className="add-expense-modal-footer">
            <button type="button" className="btn-reset-filters" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit-expense" 
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
            >
              <Save size={18} /> Update & Log Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseEditModal;
