import React from 'react';
import {
  Fingerprint,
  FileText,
  CreditCard,
  Building,
  ShieldCheck,
  GraduationCap,
  HeartPulse,
  Landmark,
  Car,
  Home,
  Briefcase,
  Zap,
  Flame,
  Droplets,
  Layers,
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface ServiceIconProps {
  iconName?: string;
  category?: ServiceCategory;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  iconName,
  category,
  className = 'w-5 h-5',
}) => {
  // Check explicit iconName first
  if (iconName) {
    switch (iconName) {
      case 'Fingerprint':
        return <Fingerprint className={className} />;
      case 'CreditCard':
        return <CreditCard className={className} />;
      case 'Building':
        return <Building className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'Landmark':
        return <Landmark className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Home':
        return <Home className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'FileText':
        return <FileText className={className} />;
    }
  }

  // Fallback to category icon
  if (category) {
    switch (category) {
      case 'Identity & Documents':
        return <Fingerprint className={className} />;
      case 'Education':
        return <GraduationCap className={className} />;
      case 'Health':
        return <HeartPulse className={className} />;
      case 'Government Schemes':
        return <Landmark className={className} />;
      case 'Transport':
        return <Car className={className} />;
      case 'Housing':
        return <Home className={className} />;
      case 'Employment':
        return <Briefcase className={className} />;
      case 'Utilities':
        return <Zap className={className} />;
    }
  }

  return <Layers className={className} />;
};
