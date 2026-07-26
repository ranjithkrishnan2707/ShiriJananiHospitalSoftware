import React from 'react';

interface PlaceholderPageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ icon, title, description }) => {
  return (
    <div className="page-transition placeholder-page">
      <div className="placeholder-icon">
        {icon}
      </div>
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-description">{description}</p>
    </div>
  );
};

export default PlaceholderPage;
