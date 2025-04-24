
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  background?: string;
  to?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  background,
  to,
  onClick,
  children,
}) => {
  const cardContent = (
    <div 
      className={`feature-card ${background || ''}`}
      onClick={onClick}
    >
      <div className="feature-card-content">
        {icon && <div className="mb-3">{icon}</div>}
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {description && <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{cardContent}</Link>;
  }

  return cardContent;
};

export default FeatureCard;
