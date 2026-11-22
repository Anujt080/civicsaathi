import React from 'react';
import { ServicesExplorer } from './ServicesExplorer';
import { CivicService } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: CivicService) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = (props) => {
  return <ServicesExplorer {...props} />;
};

export default ServicesSection;
