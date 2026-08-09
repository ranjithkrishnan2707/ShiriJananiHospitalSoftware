import React, { useState } from 'react';
import { Tag, Plus, Trash2, Search } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import type { DepartmentType } from '../../context/ExpenseContext';

const ExpenseCategoriesPage: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useExpense();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  
  // New Category Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDept, setNewCatDept] = useState<DepartmentType>('Medical');
  const [newCatDesc, setNewCatDesc] = useState('');

  const filteredCategories = categories.filter(cat => {
    if (selectedDeptFilter !== 'ALL' && cat.department !== selectedDeptFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return cat.name.toLowerCase().includes(q) || (cat.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert('Category name is required.');
      return;
    }

    addCategory({
      name: newCatName.trim(),
      department: newCatDept,
      description: newCatDesc.trim()
    });

    setNewCatName('');
    setNewCatDesc('');
    setIsAddOpen(false);
    alert('New Expense Category added successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Add Button Bar */}
      <div className="filter-card">
        <div className="filter-header-row">
          <div className="global-search-container">
            <Search className="global-search-icon" size={16} />
            <input 
              type="text"
              className="global-search-input"
              placeholder="Search category name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select 
              className="filter-control"
              style={{ width: '180px' }}
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
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

            <button 
              type="button" 
              className="btn-add-expense-primary" 
              style={{ fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setIsAddOpen(true)}
            >
              <Plus size={16} /> + New Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="expenses-table-card">
        <div className="table-meta-bar">
          <span className="table-results-count">
            Total <strong>{filteredCategories.length}</strong> Category Master Records
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Code</th>
                <th>Category Name</th>
                <th>Assigned Department</th>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No expense categories found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 700, color: '#be185d' }}>{cat.id}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{cat.name}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#334155'
                      }}>
                        {cat.department}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontSize: '13px' }}>{cat.description || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        type="button" 
                        className="btn-action-icon void"
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        title="Delete Category"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="modal-overlay">
          <div className="modal-box-card" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#be185d" /> Add Expense Category
              </h3>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsAddOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-field-group">
                <label>Category Name <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Oxygen Cylinder Refill" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group">
                <label>Assigned Department <span className="required-asterisk">*</span></label>
                <select 
                  className="form-control"
                  value={newCatDept}
                  onChange={(e) => setNewCatDept(e.target.value as DepartmentType)}
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
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  placeholder="Short description of items under this category" 
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-reset-filters" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-add-expense-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategoriesPage;
