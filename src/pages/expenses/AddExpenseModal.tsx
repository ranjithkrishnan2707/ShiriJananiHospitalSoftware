import React, { useState } from 'react';
import { 
  PlusCircle, 
  X, 
  Upload, 
  CheckCircle,
  Clock,
  User,
  Percent,
  DollarSign
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import type { DepartmentType, PaymentModeType, PaymentStatusType } from '../../context/ExpenseContext';
import './AddExpenseModal.css';

interface AddExpenseModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose, onSuccess }) => {
  const { getNextExpenseId, categories, vendors, addExpense } = useExpense();

  const [generatedId] = useState<string>(getNextExpenseId());
  const now = new Date();
  
  const [expenseDate, setExpenseDate] = useState<string>(now.toISOString().split('T')[0]);
  const [expenseTime, setExpenseTime] = useState<string>(
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  
  const [department, setDepartment] = useState<DepartmentType>('Medical');
  const [category, setCategory] = useState<string>('Medicine Purchase');
  const [vendor, setVendor] = useState<string>('');
  const [invoiceNo, setInvoiceNo] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentModeType>('Cash');
  
  // Payment Status: Paid, Advance Paid, Pending
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>('Paid');
  const [advancePercentage, setAdvancePercentage] = useState<string>('50');

  const [notes, setNotes] = useState<string>('');

  // File Upload State
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf'>('image');
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');

  // Form Errors & Submitting state
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Computed calculations for Advance Paid
  const totalAmtNum = parseFloat(amount) || 0;
  const advPctNum = parseFloat(advancePercentage) || 0;
  const calculatedPaid = paymentStatus === 'Paid' ? totalAmtNum : paymentStatus === 'Pending' ? 0 : Math.round((totalAmtNum * advPctNum) / 100 * 100) / 100;
  const calculatedPending = totalAmtNum - calculatedPaid;

  // Department change automatically pre-selects relevant category
  const handleDepartmentChange = (dept: DepartmentType) => {
    setDepartment(dept);
    const relevantCat = categories.find(c => c.department === dept);
    if (relevantCat) {
      setCategory(relevantCat.name);
    }
  };

  // Mock Attachment Handle
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      setAttachmentType(isPdf ? 'pdf' : 'image');

      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachmentUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Business Rules Validation
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

    if (!department) {
      setErrorMsg('Department is required.');
      return;
    }

    if (!category) {
      setErrorMsg('Category is required.');
      return;
    }

    if (!paymentMode) {
      setErrorMsg('Payment mode is required.');
      return;
    }

    if (!expenseDate) {
      setErrorMsg('Expense date is required.');
      return;
    }

    if (!vendor.trim()) {
      setErrorMsg('Vendor / Paid To name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      addExpense({
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
        attachmentName: attachmentName || undefined,
        attachmentType: attachmentName ? attachmentType : undefined,
        attachmentUrl: attachmentUrl || undefined,
        notes: notes.trim(),
        createdBy: 'Dr. Admin'
      });

      alert(`Expense record ${generatedId} (${paymentStatus}) created successfully!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg('Error saving expense. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-expense-modal-card">
        <div className="add-expense-modal-header">
          <h3>
            <PlusCircle size={20} /> Add New Expense
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="auto-id-badge">{generatedId}</span>
            <button 
              type="button" 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}
            >
              <X size={20} />
            </button>
          </div>
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
              fontWeight: 600
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Row 1: ID, Date, Time */}
          <div className="form-row-grid-3">
            <div className="form-field-group">
              <label>Expense ID (Auto)</label>
              <input 
                type="text" 
                className="form-control" 
                value={generatedId} 
                disabled 
                style={{ backgroundColor: '#f1f5f9', fontWeight: 700, color: '#be185d' }}
              />
            </div>

            <div className="form-field-group">
              <label>Expense Date <span className="required-asterisk">*</span></label>
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

          {/* Row 2: Department & Category */}
          <div className="form-row-grid-2">
            <div className="form-field-group">
              <label>Department <span className="required-asterisk">*</span></label>
              <select 
                className="form-control"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value as DepartmentType)}
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
              <label>Expense Category <span className="required-asterisk">*</span></label>
              <select 
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name} ({cat.department})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Vendor & Invoice Number */}
          <div className="form-row-grid-2">
            <div className="form-field-group">
              <label>Vendor / Paid To <span className="required-asterisk">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Select or enter supplier / paid person name"
                list="modal-vendors-list"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                required
              />
              <datalist id="modal-vendors-list">
                {vendors.map(v => (
                  <option key={v.id} value={v.name} />
                ))}
              </datalist>
            </div>

            <div className="form-field-group">
              <label>Invoice / Bill Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. INV-2026-091"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Total Amount, Payment Mode & Payment Status (Paid, Advance Paid, Pending) */}
          <div className="form-row-grid-3">
            <div className="form-field-group">
              <label>Total Amount (₹) <span className="required-asterisk">*</span></label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                className="form-control" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}
              />
            </div>

            <div className="form-field-group">
              <label>Payment Mode <span className="required-asterisk">*</span></label>
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
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field-group">
              <label>Payment Status <span className="required-asterisk">*</span></label>
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

          {/* ADVANCE PAID SPECIAL INPUT & CALCULATIONS */}
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
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                  Enter percentage of total amount paid in advance
                </span>
              </div>

              <div className="form-row-grid-3" style={{ alignItems: 'center' }}>
                <div className="form-field-group">
                  <label style={{ color: '#0369a1' }}>% Paid (Advance Percentage) <span className="required-asterisk">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      min="1"
                      max="99"
                      step="1"
                      className="form-control" 
                      placeholder="e.g. 50"
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

          {/* Row 5: Description */}
          <div className="form-field-group">
            <label>Description / Reason</label>
            <textarea 
              className="form-control" 
              placeholder="Describe the purpose or items purchased..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Row 6: Bill / Invoice Attachment */}
          <div className="form-field-group">
            <label>Bill / Invoice Attachment (Image / PDF)</label>
            <label className="file-upload-box">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              {attachmentName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 600 }}>
                  <CheckCircle size={18} />
                  <span>{attachmentName} ({attachmentType.toUpperCase()})</span>
                </div>
              ) : (
                <>
                  <Upload size={24} color="#94a3b8" />
                  <span style={{ fontSize: '13px', color: '#475569' }}>
                    Click to browse or upload receipt image / PDF invoice
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Supports JPG, PNG, WEBP, PDF
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Row 7: Additional Notes */}
          <div className="form-field-group">
            <label>Additional Notes</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Any additional remarks, warranty details, or batch numbers"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Bottom System Audit Bar */}
          <div className="system-info-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Entered By: <strong>Dr. Admin</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> Created Date & Time: <strong>Automatic ({expenseDate} {expenseTime})</strong>
            </div>
          </div>

          <div className="add-expense-modal-footer">
            <button 
              type="button" 
              className="btn-reset-filters"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit-expense"
              disabled={isSubmitting}
            >
              <PlusCircle size={18} /> Save Expense Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
