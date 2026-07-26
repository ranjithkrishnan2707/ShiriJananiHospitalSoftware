import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import DoctorListModal from '../components/DoctorListModal';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <DoctorListModal />
    </div>
  );
};

export default MainLayout;
