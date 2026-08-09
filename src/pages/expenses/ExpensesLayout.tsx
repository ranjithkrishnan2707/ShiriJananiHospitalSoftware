import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Receipt, 
  PlusCircle, 
  Tag, 
  Users, 
  BarChart3, 
  History,
  LayoutGrid
} from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import './ExpensesLayout.css';

const ExpensesLayout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fromSource = searchParams.get('from');
  const isDirectDepartmentEntry = Boolean(fromSource);

  const handleOpenAdd = () => setIsAddModalOpen(true);
  const handleCloseAdd = () => setIsAddModalOpen(false);

  return (
    <div className="expenses-layout-container page-transition">
      {/* Header Banner */}
      <div className="expenses-header-card">
        <div className="expenses-header-left">
          <div className="expenses-icon-badge">
            <Receipt size={26} color="#ffffff" />
          </div>
          <div className="expenses-title-group">
            <h2>EXPENSE MANAGEMENT</h2>
            <div className="expenses-subtitle">
              {isDirectDepartmentEntry 
                ? 'Shri Janani Hospital • Direct Department Expense Entry'
                : 'Shri Janani Hospital • Admin Financial Tracker & Expense Auditing'
              }
            </div>
          </div>
        </div>

        {!isDirectDepartmentEntry && (
          <div className="expenses-header-actions">
            <button 
              type="button" 
              className="btn-add-expense-primary"
              onClick={handleOpenAdd}
            >
              <PlusCircle size={18} />
               Add Expense
            </button>
          </div>
        )}
      </div>

      {/* Sub Navigation Bar - ONLY VISIBLE TO ADMIN (Hidden when accessed directly from Doctor, Lab, Medical) */}
      {!isDirectDepartmentEntry && (
        <div className="expenses-nav-bar">
          <div className="expenses-nav-links">
            <NavLink 
              to="/admin/expenses" 
              end
              className={({ isActive }) => `expenses-nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutGrid size={16} /> All Expenses
            </NavLink>

            <NavLink 
              to="/admin/expenses/categories" 
              className={({ isActive }) => `expenses-nav-item ${isActive ? 'active' : ''}`}
            >
              <Tag size={16} /> Expense Categories
            </NavLink>

            <NavLink 
              to="/admin/expenses/vendors" 
              className={({ isActive }) => `expenses-nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={16} /> Vendors
            </NavLink>

            <NavLink 
              to="/admin/expenses/reports" 
              className={({ isActive }) => `expenses-nav-item ${isActive ? 'active' : ''}`}
            >
              <BarChart3 size={16} /> Expense Reports
            </NavLink>

            <NavLink 
              to="/admin/expenses/audit-logs" 
              className={({ isActive }) => `expenses-nav-item ${isActive ? 'active' : ''}`}
            >
              <History size={16} /> Audit History
            </NavLink>
          </div>

          <button 
            type="button" 
            onClick={() => navigate('/admin/expenses/add')} 
            style={{
              background: 'none',
              border: 'none',
              color: '#be185d',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            Open Standalone Add Form
          </button>
        </div>
      )}

      {/* Main Sub-Page Content */}
      <div className="expenses-content-area">
        <Outlet context={{ onOpenAddModal: handleOpenAdd }} />
      </div>

      {/* Global Add Expense Modal */}
      {isAddModalOpen && (
        <AddExpenseModal onClose={handleCloseAdd} />
      )}
    </div>
  );
};

export default ExpensesLayout;
