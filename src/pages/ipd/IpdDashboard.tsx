import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Receipt, Printer, UserPlus } from 'lucide-react';
import './IpdDashboard.css';

const IpdDashboard: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    { 
      title: 'IP Registration', 
      path: '/ipd/registration', 
      icon: <UserPlus size={32} /> 
    },
    { 
      title: 'Discharge Summary', 
      path: '/ipd/discharge', 
      icon: <FileText size={32} /> 
    },
    { 
      title: 'IP Bill', 
      path: '/ipd/bill', 
      icon: <Receipt size={32} /> 
    },
    { 
      title: 'Print Discharge Summary', 
      path: '/ipd/print-discharge', 
      icon: <Printer size={32} /> 
    }
  ];

  return (
    <div className="ipd-dashboard-container page-transition">
      <div className="ipd-dashboard-header">
        <h2>In-Patient Department (IPD)</h2>
        <p>Please select an option below to proceed.</p>
      </div>

      <div className="ipd-options-grid">
        {options.map((option, index) => (
          <div 
            key={index} 
            className="ipd-option-card"
            onClick={() => navigate(option.path)}
          >
            <div className="ipd-option-icon">
              {option.icon}
            </div>
            <h3 className="ipd-option-title">{option.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IpdDashboard;
