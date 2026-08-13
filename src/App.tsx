import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import OpdRegistration from './pages/opd/OpdRegistration';
import IpdRegistration from './pages/ipd/IpdRegistration';
import IpdDashboard from './pages/ipd/IpdDashboard';
import IpdDischargeSummary from './pages/ipd/IpdDischargeSummary';
import AdminDashboard from './pages/admin/AdminDashboard';
import MonitorBilling from './pages/admin/MonitorBilling';
import SecurityPasswords from './pages/admin/SecurityPasswords';
import ManageStaff from './pages/admin/ManageStaff';
import ShiftAllocation from './pages/admin/ShiftAllocation';
import OpBillReport from './pages/billing/OpBillReport';
import DoctorConsultation from './pages/doctor/DoctorConsultation';
import DoctorPatientHistoryList from './pages/doctor/DoctorPatientHistoryList';
import DoctorPatientDetailHistory from './pages/doctor/DoctorPatientDetailHistory';
import MedicalDashboard from './pages/medical/MedicalDashboard';
import LabDashboard from './pages/lab/LabDashboard';
import LabDashboardOverview from './pages/lab/LabDashboardOverview';
import ScanDashboard from './pages/scan/ScanDashboard';
import UploadScanReportPage from './pages/scan/UploadScanReportPage';
import StaffAttendance from './pages/attendance/StaffAttendance';
import AdminStaffAttendance from './pages/admin/AdminStaffAttendance';
import StaffDetail from './pages/staff/StaffDetail';

// Expenses Module Imports
import { ExpenseProvider } from './context/ExpenseContext';
import ExpensesLayout from './pages/expenses/ExpensesLayout';
import ExpenseDashboard from './pages/expenses/ExpenseDashboard';
import AddExpensePage from './pages/expenses/AddExpensePage';
import ExpenseCategoriesPage from './pages/expenses/ExpenseCategoriesPage';
import VendorsPage from './pages/expenses/VendorsPage';
import ExpenseReportsPage from './pages/expenses/ExpenseReportsPage';
import ExpenseAuditLogsPage from './pages/expenses/ExpenseAuditLogsPage';

import PlaceholderPage from './components/PlaceholderPage';
import ProtectedModule from './components/ProtectedModule';
import { HospitalProvider } from './context/HospitalContext';
import { 
  Printer,
  Activity, 
  Receipt
} from 'lucide-react';

const App: React.FC = () => {
  return (
    <HospitalProvider>
      <ExpenseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              
              <Route path="opd" element={<OpdRegistration />} />
              
              <Route path="ipd">
                <Route index element={<IpdDashboard />} />
                <Route path="registration" element={<IpdRegistration />} />
                <Route path="discharge" element={<IpdDischargeSummary />} />
                <Route path="bill" element={
                  <PlaceholderPage 
                    icon={<Receipt size={48} />}
                    title="IP Bill"
                    description="Manage In-Patient Billing here. Features will be added in the next development phase."
                  />
                } />
                <Route path="print-discharge" element={
                  <PlaceholderPage 
                    icon={<Printer size={48} />}
                    title="Print Discharge Summary"
                    description="Print Discharge Summaries here. Features will be added in the next development phase."
                  />
                } />
              </Route>
              
              <Route path="doctor" element={<DoctorConsultation />} />
              <Route path="doctor/patient-history" element={<DoctorPatientHistoryList />} />
              <Route path="doctor/patient-history/:uhid" element={<DoctorPatientDetailHistory />} />
              
              <Route path="medical" element={
                <ProtectedModule moduleKey="medical" moduleName="Medical Module">
                  <MedicalDashboard />
                </ProtectedModule>
              } />
              
              <Route path="lab" element={
                <ProtectedModule moduleKey="lab" moduleName="Lab Module">
                  <LabDashboardOverview />
                </ProtectedModule>
              } />

              <Route path="lab/detailed" element={
                <ProtectedModule moduleKey="lab" moduleName="Lab Module">
                  <LabDashboard />
                </ProtectedModule>
              } />
              
              <Route path="scan" element={
                <ProtectedModule moduleKey="scan" moduleName="Scan Module">
                  <ScanDashboard />
                </ProtectedModule>
              } />

              <Route path="scan/upload" element={
                <ProtectedModule moduleKey="scan" moduleName="Scan Module">
                  <UploadScanReportPage />
                </ProtectedModule>
              } />
              
              <Route path="attendance" element={<StaffAttendance />} />
              <Route path="staff-detail/:empId" element={<StaffDetail />} />
              <Route path="staff/:empId" element={<StaffDetail />} />
              
              <Route path="billing" element={<OpBillReport />} />
              
              {/* Redirect old /expenses to /admin/expenses */}
              <Route path="expenses" element={<Navigate to="/admin/expenses" replace />} />
              <Route path="expenses/*" element={<Navigate to="/admin/expenses" replace />} />

              {/* Admin Routes with Expenses Moved Inside Admin */}
              <Route path="admin" element={
                <ProtectedModule moduleKey="admin" moduleName="Admin Module">
                  <Outlet />
                </ProtectedModule>
              }>
                <Route index element={<AdminDashboard />} />
                
                {/* Expenses Module under Admin */}
                <Route path="expenses" element={<ExpensesLayout />}>
                  <Route index element={<ExpenseDashboard />} />
                  <Route path="add" element={<AddExpensePage />} />
                  <Route path="categories" element={<ExpenseCategoriesPage />} />
                  <Route path="vendors" element={<VendorsPage />} />
                  <Route path="reports" element={<ExpenseReportsPage />} />
                  <Route path="audit-logs" element={<ExpenseAuditLogsPage />} />
                </Route>

                <Route path="monitor-billing" element={<MonitorBilling />} />
                <Route path="manage-staff" element={<ManageStaff />} />
                <Route path="staff-attendance" element={<AdminStaffAttendance />} />
                <Route path="attendance" element={<AdminStaffAttendance />} />
                <Route path="shift-allocation" element={<ShiftAllocation />} />
                <Route path="security" element={<SecurityPasswords />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ExpenseProvider>
    </HospitalProvider>
  );
};

export default App;
