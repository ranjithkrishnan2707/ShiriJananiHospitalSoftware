import React, { useState } from 'react';
import { 
  X, 
  Receipt, 
  FileText, 
  Edit, 
  History,
  Eye,
  CheckCircle,
  Percent,
  Clock
} from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import type { Expense } from '../../context/ExpenseContext';

interface ExpenseDetailModalProps {
  expense: Expense;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ expense, onClose, onEdit }) => {
  const { auditLogs } = useExpense();
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

  // Filter logs related to this expense
  const logsForExpense = auditLogs.filter(log => log.expenseId === expense.id);

  const pStatus = expense.paymentStatus || 'Paid';
  const isAdv = pStatus === 'Advance Paid';
  const isPend = pStatus === 'Pending';
  const advPct = expense.advancePercentage !== undefined ? expense.advancePercentage : 50;
  const paidAmt = expense.paidAmount !== undefined ? expense.paidAmount : (isPend ? 0 : isAdv ? Math.round(expense.amount * 0.5) : expense.amount);
  const pendAmt = expense.pendingAmount !== undefined ? expense.pendingAmount : (isPend ? expense.amount : isAdv ? expense.amount - paidAmt : 0);

  return (
    <div className="modal-overlay">
      <div className="modal-box-card" style={{ maxWidth: '780px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)', color: 'white', padding: '16px 20px', margin: '-24px -24px 20px -24px', borderRadius: '12px 12px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={22} color="white" />
            <div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Expense Details: {expense.id}</h3>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
                Department: {expense.department} • Status: {expense.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {expense.status === 'Active' && (
              <button 
                type="button" 
                onClick={() => onEdit(expense)}
                style={{
                  backgroundColor: 'white',
                  color: '#9d174d',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit size={14} /> Edit Expense
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Key Info Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Expense ID</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#be185d' }}>{expense.id}</div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Amount</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>₹{expense.amount.toLocaleString()}</div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Payment Mode</span>
              <div>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: expense.paymentMode === 'Cash' ? '#fef3c7' : '#ccfbf1',
                  color: expense.paymentMode === 'Cash' ? '#b45309' : '#0f766e'
                }}>
                  {expense.paymentMode}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Payment Status</span>
              <div>
                {pStatus === 'Paid' && (
                  <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}>
                    <CheckCircle size={12} /> Paid
                  </span>
                )}
                {pStatus === 'Advance Paid' && (
                  <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                    <Percent size={12} /> Advance Paid ({advPct}%)
                  </span>
                )}
                {pStatus === 'Pending' && (
                  <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                    <Clock size={12} /> Pending (Unpaid)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ADVANCE & PENDING FINANCIAL BREAKDOWN */}
          {pStatus === 'Advance Paid' && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>
                  Advance Payment Settlement ({advPct}% Paid)
                </span>
                <div style={{ fontSize: '13px', color: '#0f172a', marginTop: '2px' }}>
                  Paid Amount: <strong style={{ color: '#15803d' }}>₹{paidAmt.toLocaleString()}</strong> | Remaining Pending: <strong style={{ color: '#b45309' }}>₹{pendAmt.toLocaleString()}</strong>
                </div>
              </div>

              <span style={{
                backgroundColor: '#0284c7',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                {advPct}% Settled
              </span>
            </div>
          )}

          {/* Details Table Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Date & Time:</span>
                <strong style={{ fontSize: '13px' }}>{expense.expenseDate} ({expense.expenseTime})</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Department:</span>
                <strong style={{ fontSize: '13px' }}>{expense.department}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Category:</span>
                <strong style={{ fontSize: '13px' }}>{expense.category}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Vendor / Paid To:</span>
                <strong style={{ fontSize: '13px', color: '#be185d' }}>{expense.vendor}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Invoice / Bill No:</span>
                <strong style={{ fontSize: '13px' }}>{expense.invoiceNo || 'N/A'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Created By:</span>
                <strong style={{ fontSize: '13px' }}>{expense.createdBy}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Created At:</span>
                <strong style={{ fontSize: '13px' }}>{expense.createdAt}</strong>
              </div>

              {expense.updatedBy && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Last Updated By:</span>
                  <strong style={{ fontSize: '13px', color: '#d97706' }}>{expense.updatedBy} ({expense.updatedAt})</strong>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Description / Purpose</span>
            <p style={{ fontSize: '13px', color: '#0f172a', margin: '4px 0 0 0', fontWeight: 500 }}>
              {expense.description || 'No description provided.'}
            </p>
          </div>

          {/* Attachment Preview Box */}
          {expense.attachmentName && (
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} color="#be185d" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{expense.attachmentName}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Type: {expense.attachmentType?.toUpperCase() || 'DOCUMENT'}
                  </span>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-action-icon view"
                onClick={() => setShowAttachmentPreview(!showAttachmentPreview)}
              >
                <Eye size={14} /> {showAttachmentPreview ? 'Hide Preview' : 'Preview Document'}
              </button>
            </div>
          )}

          {showAttachmentPreview && expense.attachmentName && (
            <div style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#ffffff' }}>
              {expense.attachmentUrl ? (
                expense.attachmentType === 'pdf' ? (
                  <iframe src={expense.attachmentUrl} title="Invoice PDF" style={{ width: '100%', height: '300px', border: 'none' }} />
                ) : (
                  <img src={expense.attachmentUrl} alt="Bill Invoice" style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '6px' }} />
                )
              ) : (
                <div style={{ padding: '20px', color: '#64748b' }}>
                  📄 <strong>{expense.attachmentName}</strong> attached. (Simulated document preview mode)
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
              <strong>Notes:</strong> {expense.notes}
            </div>
          )}

          {/* Audit Trail Log for this Expense */}
          <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <History size={16} color="#be185d" />
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                Audit History Trail ({logsForExpense.length} record(s))
              </h4>
            </div>

            {logsForExpense.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                No changes recorded for this expense. Original record intact.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {logsForExpense.map(log => (
                  <div key={log.id} style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#92400e', fontWeight: 700, marginBottom: '4px' }}>
                      <span>Changed by {log.changedBy} on {log.changedAt}</span>
                      <span>Log ID: {log.id}</span>
                    </div>
                    <div style={{ color: '#78350f', marginBottom: '2px' }}>
                      <strong>Reason:</strong> {log.reason}
                    </div>
                    <div style={{ fontSize: '11px', color: '#b45309' }}>
                      <strong>Old:</strong> {log.oldValue} <br />
                      <strong>New:</strong> {log.newValue}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
          <button type="button" className="btn-reset-filters" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailModal;
