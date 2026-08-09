import React, { useState } from 'react';
import { Users, Plus, Trash2, Search, Edit } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import type { Vendor } from '../../context/ExpenseContext';

const VendorsPage: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useExpense();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form State
  const [vName, setVName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vGstin, setVGstin] = useState('');
  const [vAddress, setVAddress] = useState('');
  const [vCategory, setVCategory] = useState('Medicine Purchase');

  const filteredVendors = vendors.filter(v => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        (v.phone || '').toLowerCase().includes(q) ||
        (v.email || '').toLowerCase().includes(q) ||
        (v.gstin || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setVName('');
    setVPhone('');
    setVEmail('');
    setVGstin('');
    setVAddress('');
    setVCategory('Medicine Purchase');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setVName(v.name);
    setVPhone(v.phone || '');
    setVEmail(v.email || '');
    setVGstin(v.gstin || '');
    setVAddress(v.address || '');
    setVCategory(v.category || 'Medicine Purchase');
    setIsAddOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) {
      alert('Vendor Name is required.');
      return;
    }

    if (editingVendor) {
      updateVendor({
        ...editingVendor,
        name: vName.trim(),
        phone: vPhone.trim(),
        email: vEmail.trim(),
        gstin: vGstin.trim(),
        address: vAddress.trim(),
        category: vCategory
      });
      alert(`Vendor "${vName}" updated!`);
    } else {
      addVendor({
        name: vName.trim(),
        phone: vPhone.trim(),
        email: vEmail.trim(),
        gstin: vGstin.trim(),
        address: vAddress.trim(),
        category: vCategory
      });
      alert(`New Vendor "${vName}" added!`);
    }

    setIsAddOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search & Add Bar */}
      <div className="filter-card">
        <div className="filter-header-row">
          <div className="global-search-container">
            <Search className="global-search-icon" size={16} />
            <input 
              type="text" 
              className="global-search-input"
              placeholder="Search vendor name, phone, email, GSTIN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            className="btn-add-expense-primary"
            style={{ fontSize: '13px', padding: '8px 16px' }}
            onClick={handleOpenAdd}
          >
            <Plus size={16} /> + New Vendor
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="expenses-table-card">
        <div className="table-meta-bar">
          <span className="table-results-count">
            Total <strong>{filteredVendors.length}</strong> Registered Vendors
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor Code</th>
                <th>Vendor / Company Name</th>
                <th>Primary Contact</th>
                <th>Email</th>
                <th>GSTIN No</th>
                <th>Primary Supply Category</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No vendors found.
                  </td>
                </tr>
              ) : (
                filteredVendors.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 700, color: '#be185d' }}>{v.id}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{v.name}</td>
                    <td style={{ fontWeight: 500 }}>{v.phone || '—'}</td>
                    <td style={{ color: '#0284c7' }}>{v.email || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{v.gstin || '—'}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3'
                      }}>
                        {v.category || 'General Supplier'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                        <button 
                          type="button" 
                          className="btn-action-icon edit"
                          onClick={() => handleOpenEdit(v)}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button 
                          type="button" 
                          className="btn-action-icon void"
                          onClick={() => {
                            if (window.confirm(`Delete vendor "${v.name}"?`)) {
                              deleteVendor(v.id);
                            }
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit Vendor */}
      {isAddOpen && (
        <div className="modal-overlay">
          <div className="modal-box-card" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#be185d" /> {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsAddOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-field-group">
                <label>Vendor / Company Name <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Apex Surgicals Pvt Ltd" 
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-grid-2">
                <div className="form-field-group">
                  <label>Contact Phone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="9840XXXXXX" 
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="orders@vendor.com" 
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="form-field-group">
                  <label>GSTIN Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="33AAAAA0000A1Z5" 
                    value={vGstin}
                    onChange={(e) => setVGstin(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>Supply Category</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Medical Supplies" 
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Vendor Address</label>
                <textarea 
                  className="form-control" 
                  placeholder="Street, City, State" 
                  value={vAddress}
                  onChange={(e) => setVAddress(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-reset-filters" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-add-expense-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                  {editingVendor ? 'Update Vendor' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
