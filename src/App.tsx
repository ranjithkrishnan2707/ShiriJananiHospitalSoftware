import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import MedicalDashboard from './pages/medical/MedicalDashboard';
import LabDashboard from './pages/lab/LabDashboard';
import StaffAttendance from './pages/attendance/StaffAttendance';
import StaffDetail from './pages/staff/StaffDetail';
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
          
          <Route path="medical" element={
            <ProtectedModule moduleKey="medical" moduleName="Medical Module">
              <MedicalDashboard />
            </ProtectedModule>
          } />
          
          <Route path="lab" element={
            <ProtectedModule moduleKey="lab" moduleName="Lab Module">
              <LabDashboard />
            </ProtectedModule>
          } />
          
          <Route path="scan" element={
            <ProtectedModule moduleKey="scan" moduleName="Scan Module">
              <PlaceholderPage 
                icon={<Activity size={48} />}
                title="X-Ray & Scans"
                description="Manage X-Ray and Scans here. Features will be added in the next development phase."
              />
            </ProtectedModule>
          } />
          
          <Route path="attendance" element={<StaffAttendance />} />
          <Route path="staff-detail/:empId" element={<StaffDetail />} />
          <Route path="staff/:empId" element={<StaffDetail />} />
          
          <Route path="billing" element={<OpBillReport />} />
          
          <Route path="admin" element={
            <ProtectedModule moduleKey="admin" moduleName="Admin Module">
              <Outlet />
            </ProtectedModule>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="monitor-billing" element={<MonitorBilling />} />
            <Route path="manage-staff" element={<ManageStaff />} />
            <Route path="attendance" element={<StaffAttendance />} />
            <Route path="shift-allocation" element={<ShiftAllocation />} />
            <Route path="security" element={<SecurityPasswords />} />
          </Route>
          </Route>
        </Routes>
      </Router>
    </HospitalProvider>
  );
};

export default App;
