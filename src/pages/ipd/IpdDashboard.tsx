import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Receipt, Printer, UserPlus, ArrowLeft } from 'lucide-react';
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <h2 style={{ margin: 0 }}>In-Patient Department (IPD)</h2>
            <p style={{ margin: '4px 0 0 0' }}>Please select an option below to proceed.</p>
          </div>
          <button 
            type="button"
            className="btn-back-page" 
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
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
