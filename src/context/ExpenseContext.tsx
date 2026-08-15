import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/apiClient';
import { queueMutation } from '../services/offlineSyncEngine';

// --- Interfaces ---
export type DepartmentType = 'Medical' | 'Lab' | 'Scan' | 'OPD' | 'IPD' | 'Admin' | 'Maintenance' | 'Other';

export type PaymentModeType = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Future Payment' | 'Other';

export type PaymentStatusType = 'Paid' | 'Advance Paid' | 'Pending';

export interface Expense {
  id: string; // EXP-000125
  expenseDate: string; // YYYY-MM-DD
  expenseTime: string; // HH:MM
  department: DepartmentType;
  category: string;
  vendor: string;
  invoiceNo: string;
  description: string;
  amount: number;
  paymentMode: PaymentModeType;
  paymentStatus: PaymentStatusType;
  advancePercentage?: number;
  paidAmount?: number;
  pendingAmount?: number;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  status: 'Active' | 'Voided';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  department: DepartmentType;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin?: string;
  address?: string;
  category?: string;
}

export interface ExpenseAuditLog {
  id: string;
  expenseId: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  reason: string;
}

export interface IncomeBreakdown {
  opd: number;
  ipd: number;
  medical: number;
  lab: number;
  scan: number;
  other: number;
}

interface ExpenseContextType {
  expenses: Expense[];
  categories: ExpenseCategory[];
  vendors: Vendor[];
  auditLogs: ExpenseAuditLog[];
  incomeData: IncomeBreakdown;
  
  // Actions
  addExpense: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'status'>) => Expense;
  updateExpense: (id: string, updatedData: Partial<Expense>, reasonForChange: string, updatedBy: string) => void;
  voidExpense: (id: string, reasonForVoid: string, voidedBy: string) => void;
  
  addCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  deleteCategory: (id: string) => void;
  
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (id: string) => void;
  
  getNextExpenseId: () => string;
}

// Initial Pre-seeded Categories
const INITIAL_CATEGORIES: ExpenseCategory[] = [
  { id: 'CAT-1', name: 'Medicine Purchase', department: 'Medical', description: 'Bulk & retail pharmaceutical purchases' },
  { id: 'CAT-2', name: 'Medical Supplies', department: 'Medical', description: 'Syringes, bandages, gloves, IV sets' },
  { id: 'CAT-3', name: 'Lab Supplies', department: 'Lab', description: 'Reagents, testing tubes, diagnostic kits' },
  { id: 'CAT-4', name: 'Scan Supplies & Maintenance', department: 'Scan', description: 'X-Ray films, gel, contrast dye, machine AMC' },
  { id: 'CAT-5', name: 'Electricity', department: 'Admin', description: 'Electricity bills for hospital building' },
  { id: 'CAT-6', name: 'Water', department: 'Admin', description: 'Water supply & purification expenses' },
  { id: 'CAT-7', name: 'Maintenance', department: 'Maintenance', description: 'AC, generator, building repairs' },
  { id: 'CAT-8', name: 'Salary', department: 'Admin', description: 'Staff, nurses & support staff salaries' },
  { id: 'CAT-9', name: 'Transport', department: 'Admin', description: 'Ambulance fuel & staff conveyance' },
  { id: 'CAT-10', name: 'Stationery', department: 'Admin', description: 'Prescription pads, register books, printer paper' },
  { id: 'CAT-11', name: 'Equipment', department: 'OPD', description: 'BP apparatus, stethoscopes, thermometers' },
  { id: 'CAT-12', name: 'Cleaning', department: 'Maintenance', description: 'Sanitizers, disinfectants, housekeeping supplies' },
  { id: 'CAT-13', name: 'Other', department: 'Other', description: 'Miscellaneous operational expenses' },
];

// Initial Pre-seeded Vendors
const INITIAL_VENDORS: Vendor[] = [
  { id: 'VEND-1', name: 'MedPlus Wholesale Distributors', phone: '9840112233', email: 'orders@medplusdist.com', gstin: '33AAAAA0000A1Z5', address: '12 Hospital Road, Chennai', category: 'Medicine Purchase' },
  { id: 'VEND-2', name: 'Apex Surgicals & Diagnostics', phone: '9840223344', email: 'sales@apexsurgicals.in', gstin: '33BBBBB1111B2Z6', address: '45 Health Ave, Salem', category: 'Medical Supplies' },
  { id: 'VEND-3', name: 'BioLab Reagents Pvt Ltd', phone: '9840334455', email: 'info@biolab.co.in', gstin: '33CCCCC2222C3Z7', address: '88 Biotech Park, Coimbatore', category: 'Lab Supplies' },
  { id: 'VEND-4', name: 'TNEB Power Supply Ltd', phone: '1912', email: 'billing@tneb.gov.in', address: 'Electricity Board Office', category: 'Electricity' },
  { id: 'VEND-5', name: 'CleanCare Housekeeping Services', phone: '9840556677', email: 'contact@cleancare.org', gstin: '33EEEEE4444E5Z9', address: '77 Clean Way, Erode', category: 'Cleaning' },
  { id: 'VEND-6', name: 'Siemens Medical Tech Repair', phone: '9840667788', email: 'service@siemens-med.com', gstin: '33FFFFF5555F6Z0', address: 'Industrial Estate, Trichy', category: 'Maintenance' },
];

// Initial Pre-seeded Expenses
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'EXP-000125',
    expenseDate: '2026-08-08',
    expenseTime: '10:30',
    department: 'Medical',
    category: 'Medicine Purchase',
    vendor: 'MedPlus Wholesale Distributors',
    invoiceNo: 'INV-2026-881',
    description: 'Bulk purchase of Antibiotics & Painkillers for Pharmacy',
    amount: 85000,
    paymentMode: 'Bank Transfer',
    paymentStatus: 'Paid',
    paidAmount: 85000,
    pendingAmount: 0,
    attachmentName: 'Invoice_881.pdf',
    attachmentType: 'pdf',
    notes: 'Urgent stock update for emergency pharmacy',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-08 10:30 AM',
    status: 'Active'
  },
  {
    id: 'EXP-000124',
    expenseDate: '2026-08-07',
    expenseTime: '14:15',
    department: 'Lab',
    category: 'Lab Supplies',
    vendor: 'BioLab Reagents Pvt Ltd',
    invoiceNo: 'BL-9041',
    description: 'CBC and Blood Chemistry Test Reagent Kits',
    amount: 32500,
    paymentMode: 'UPI',
    paymentStatus: 'Advance Paid',
    advancePercentage: 50,
    paidAmount: 16250,
    pendingAmount: 16250,
    attachmentName: 'BioLab_Receipt.jpg',
    attachmentType: 'image',
    notes: '50% Advance paid via GPay, balance on stock delivery',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-07 02:15 PM',
    status: 'Active'
  },
  {
    id: 'EXP-000123',
    expenseDate: '2026-08-06',
    expenseTime: '11:00',
    department: 'Scan',
    category: 'Scan Supplies & Maintenance',
    vendor: 'Siemens Medical Tech Repair',
    invoiceNo: 'SM-5521',
    description: 'USG Probe Calibration & Ultrasound Gel Stocks',
    amount: 18000,
    paymentMode: 'Card',
    paymentStatus: 'Pending',
    paidAmount: 0,
    pendingAmount: 18000,
    attachmentName: 'Siemens_Service_Report.pdf',
    attachmentType: 'pdf',
    notes: 'Invoice generated, pending management approval',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-06 11:00 AM',
    status: 'Active'
  },
  {
    id: 'EXP-000122',
    expenseDate: '2026-08-05',
    expenseTime: '16:45',
    department: 'Maintenance',
    category: 'Maintenance',
    vendor: 'Siemens Medical Tech Repair',
    invoiceNo: 'MNT-404',
    description: 'Generator Service & Diesel refill',
    amount: 12000,
    paymentMode: 'Cash',
    paymentStatus: 'Paid',
    paidAmount: 12000,
    pendingAmount: 0,
    attachmentName: 'Diesel_Bill.jpg',
    attachmentType: 'image',
    notes: '50 Liters diesel filled for backup generator',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-05 04:45 PM',
    status: 'Active'
  },
  {
    id: 'EXP-000121',
    expenseDate: '2026-08-04',
    expenseTime: '09:30',
    department: 'Medical',
    category: 'Medical Supplies',
    vendor: 'Apex Surgicals & Diagnostics',
    invoiceNo: 'APX-7712',
    description: 'IV Sets, Syringes, Disposable Gloves, Gauze Roll',
    amount: 12500,
    paymentMode: 'UPI',
    paymentStatus: 'Advance Paid',
    advancePercentage: 40,
    paidAmount: 5000,
    pendingAmount: 7500,
    attachmentName: 'Surgical_Bill.pdf',
    attachmentType: 'pdf',
    notes: '40% advance paid to supplier',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-04 09:30 AM',
    status: 'Active'
  },
  {
    id: 'EXP-000120',
    expenseDate: '2026-08-03',
    expenseTime: '15:20',
    department: 'Admin',
    category: 'Electricity',
    vendor: 'TNEB Power Supply Ltd',
    invoiceNo: 'EB-2026-08',
    description: 'Monthly Hospital Main Electricity Bill Payment',
    amount: 25500,
    paymentMode: 'Bank Transfer',
    paymentStatus: 'Paid',
    paidAmount: 25500,
    pendingAmount: 0,
    attachmentName: 'Electricity_Bill_Aug.pdf',
    attachmentType: 'pdf',
    notes: 'Paid online via NEFT',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-03 03:20 PM',
    status: 'Active'
  },
  {
    id: 'EXP-000119',
    expenseDate: '2026-08-02',
    expenseTime: '12:10',
    department: 'Medical',
    category: 'Other',
    vendor: 'CleanCare Housekeeping Services',
    invoiceNo: 'CC-1092',
    description: 'Hospital Grade Disinfectants & Hand Sanitizer Dispensers',
    amount: 3500,
    paymentMode: 'Cash',
    paymentStatus: 'Paid',
    paidAmount: 3500,
    pendingAmount: 0,
    notes: 'Regular sanitization replenishment',
    createdBy: 'Dr. Admin',
    createdAt: '2026-08-02 12:10 PM',
    status: 'Active'
  },
  {
    id: 'EXP-000118',
    expenseDate: '2026-07-28',
    expenseTime: '10:00',
    department: 'OPD',
    category: 'Stationery',
    vendor: 'City Book Distributors',
    invoiceNo: 'ST-505',
    description: 'Prescription Pads, OPD Case Sheets, Receipt Printers Roll',
    amount: 7500,
    paymentMode: 'Cash',
    paymentStatus: 'Pending',
    paidAmount: 0,
    pendingAmount: 7500,
    notes: 'Delivered to reception desk',
    createdBy: 'Dr. Admin',
    createdAt: '2026-07-28 10:00 AM',
    status: 'Active'
  }
];

// Initial Audit Logs
const INITIAL_AUDIT_LOGS: ExpenseAuditLog[] = [
  {
    id: 'LOG-1',
    expenseId: 'EXP-000125',
    oldValue: 'Amount: ₹15,000 | Notes: Standard purchase',
    newValue: 'Amount: ₹18,500 | Notes: Corrected invoice amount with tax adjustment',
    changedBy: 'Dr. Admin',
    changedAt: '2026-08-08 06:45 PM',
    reason: 'Corrected invoice amount per supplier revised bill'
  }
];

// Default Income figures for hospital integration
const DEFAULT_INCOME: IncomeBreakdown = {
  opd: 120000,
  ipd: 180000,
  medical: 90000,
  lab: 60000,
  scan: 40000,
  other: 10000
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('sjh_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [categories, setCategories] = useState<ExpenseCategory[]>(() => {
    const saved = localStorage.getItem('sjh_expense_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('sjh_expense_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [auditLogs, setAuditLogs] = useState<ExpenseAuditLog[]>(() => {
    const saved = localStorage.getItem('sjh_expense_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [incomeData] = useState<IncomeBreakdown>(DEFAULT_INCOME);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sjh_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('sjh_expense_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sjh_expense_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('sjh_expense_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Generate next Expense ID (e.g. EXP-000126)
  const getNextExpenseId = () => {
    let maxNum = 125;
    expenses.forEach(exp => {
      const match = exp.id.match(/EXP-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    return `EXP-${nextNum.toString().padStart(6, '0')}`;
  };

  // Add Expense
  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'status'>) => {
    const newId = getNextExpenseId();
    const now = new Date();
    const formattedCreatedAt = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const status = expenseData.paymentStatus || 'Paid';
    const total = expenseData.amount || 0;
    let advPct = expenseData.advancePercentage;
    let paid = total;
    let pending = 0;

    if (status === 'Advance Paid') {
      advPct = advPct !== undefined ? advPct : 50;
      paid = Math.round((total * advPct) / 100 * 100) / 100;
      pending = Math.round((total - paid) * 100) / 100;
    } else if (status === 'Pending') {
      paid = 0;
      pending = total;
    } else {
      paid = total;
      pending = 0;
    }

    const newExpense: Expense = {
      ...expenseData,
      id: newId,
      paymentStatus: status,
      advancePercentage: advPct,
      paidAmount: paid,
      pendingAmount: pending,
      createdAt: formattedCreatedAt,
      status: 'Active'
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Also add vendor to list if not existing
    if (expenseData.vendor && !vendors.some(v => v.name.toLowerCase() === expenseData.vendor.toLowerCase())) {
      const newVend: Vendor = {
        id: `VEND-${Date.now()}`,
        name: expenseData.vendor,
        phone: '',
        email: '',
        category: expenseData.category
      };
      setVendors(v => [...v, newVend]);
    }

    // Post to API / queue offline
    apiFetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(newExpense)
    }).then(res => {
      if (!res.ok || res.offline) {
        queueMutation('/api/expenses', 'POST', newExpense);
      }
    });

    return newExpense;
  };

  // Update Expense with Audit Logging
  const updateExpense = (
    id: string, 
    updatedData: Partial<Expense>, 
    reasonForChange: string, 
    updatedBy: string
  ) => {
    setExpenses(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;

      const oldExp = prev[idx];
      const now = new Date();
      const nowFormatted = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // Construct diff description for audit
      const oldVals: string[] = [];
      const newVals: string[] = [];

      if (updatedData.amount !== undefined && updatedData.amount !== oldExp.amount) {
        oldVals.push(`Amount: ₹${oldExp.amount.toLocaleString()}`);
        newVals.push(`Amount: ₹${updatedData.amount.toLocaleString()}`);
      }
      if (updatedData.department && updatedData.department !== oldExp.department) {
        oldVals.push(`Dept: ${oldExp.department}`);
        newVals.push(`Dept: ${updatedData.department}`);
      }
      if (updatedData.category && updatedData.category !== oldExp.category) {
        oldVals.push(`Category: ${oldExp.category}`);
        newVals.push(`Category: ${updatedData.category}`);
      }
      if (updatedData.vendor && updatedData.vendor !== oldExp.vendor) {
        oldVals.push(`Vendor: ${oldExp.vendor}`);
        newVals.push(`Vendor: ${updatedData.vendor}`);
      }
      if (updatedData.invoiceNo !== undefined && updatedData.invoiceNo !== oldExp.invoiceNo) {
        oldVals.push(`Invoice: ${oldExp.invoiceNo || 'N/A'}`);
        newVals.push(`Invoice: ${updatedData.invoiceNo || 'N/A'}`);
      }
      if (updatedData.paymentMode && updatedData.paymentMode !== oldExp.paymentMode) {
        oldVals.push(`Mode: ${oldExp.paymentMode}`);
        newVals.push(`Mode: ${updatedData.paymentMode}`);
      }
      if (updatedData.description && updatedData.description !== oldExp.description) {
        oldVals.push(`Desc: ${oldExp.description}`);
        newVals.push(`Desc: ${updatedData.description}`);
      }

      if (oldVals.length === 0) {
        oldVals.push('Updated details');
        newVals.push('Updated details');
      }

      // Add to Audit Log
      const logEntry: ExpenseAuditLog = {
        id: `LOG-${Date.now()}`,
        expenseId: id,
        oldValue: oldVals.join(' | '),
        newValue: newVals.join(' | '),
        changedBy: updatedBy || 'Dr. Admin',
        changedAt: nowFormatted,
        reason: reasonForChange || 'Details updated'
      };

      setAuditLogs(logs => [logEntry, ...logs]);

      const updatedList = [...prev];
      updatedList[idx] = {
        ...oldExp,
        ...updatedData,
        updatedBy: updatedBy || 'Dr. Admin',
        updatedAt: nowFormatted
      };

      return updatedList;
    });
  };

  // Void Expense (Soft Delete)
  const voidExpense = (id: string, reasonForVoid: string, voidedBy: string) => {
    setExpenses(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;

      const oldExp = prev[idx];
      const now = new Date();
      const nowFormatted = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const logEntry: ExpenseAuditLog = {
        id: `LOG-${Date.now()}`,
        expenseId: id,
        oldValue: `Status: Active (Amount ₹${oldExp.amount})`,
        newValue: `Status: Voided`,
        changedBy: voidedBy || 'Dr. Admin',
        changedAt: nowFormatted,
        reason: reasonForVoid || 'Expense record voided'
      };

      setAuditLogs(logs => [logEntry, ...logs]);

      const updatedList = [...prev];
      updatedList[idx] = {
        ...oldExp,
        status: 'Voided',
        updatedBy: voidedBy || 'Dr. Admin',
        updatedAt: nowFormatted
      };

      return updatedList;
    });
  };

  // Category Actions
  const addCategory = (category: Omit<ExpenseCategory, 'id'>) => {
    const newCat: ExpenseCategory = {
      ...category,
      id: `CAT-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Vendor Actions
  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVend: Vendor = {
      ...vendorData,
      id: `VEND-${Date.now()}`
    };
    setVendors(prev => [...prev, newVend]);
  };

  const updateVendor = (vendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === vendor.id ? vendor : v));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      categories,
      vendors,
      auditLogs,
      incomeData,
      addExpense,
      updateExpense,
      voidExpense,
      addCategory,
      deleteCategory,
      addVendor,
      updateVendor,
      deleteVendor,
      getNextExpenseId
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
