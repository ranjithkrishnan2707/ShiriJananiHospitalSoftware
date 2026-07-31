import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ icon, title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="page-transition placeholder-page">
      <div style={{ alignSelf: 'flex-end', marginBottom: '16px' }}>
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
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div className="placeholder-icon">
        {icon}
      </div>
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-description">{description}</p>
    </div>
  );
};

export default PlaceholderPage;
