export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupId: string;
    coverageLevel: string;
    deductibleMet: number;
    deductibleTotal: number;
    status: 'Active' | 'Pending' | 'Expired';
  };
}

export interface Appointment {
  id: string;
  dentist: string;
  dentistTitle: string;
  dentistAvatar?: string;
  procedure: string;
  category: 'Checkup' | 'Restorative' | 'Orthodontics' | 'Emergency' | 'Cosmetic';
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'Confirmed' | 'Pending Confirmation' | 'Completed' | 'Cancelled';
  notes?: string;
  isUpcoming: boolean;
}

export interface OdontogramTooth {
  number: number;
  name: string;
  arch: 'upper' | 'lower';
  type: 'Incisor' | 'Canine' | 'Premolar' | 'Molar';
  status: 'healthy' | 'crown' | 'cavity' | 'implant' | 'watch';
  lastInspected: string;
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  dentist: string;
  dentistTitle: string;
  category: 'Routine Checkup' | 'Restorative' | 'Orthodontics' | 'Surgical';
  diagnosis: string;
  treatment: string;
  medication?: string;
}

export interface DentalRadiograph {
  id: string;
  title: string;
  type: 'PANORAMIC' | 'BITEWING' | 'CEPHALOMETRIC' | 'PERIAPICAL';
  date: string;
  dentist: string;
  imageUrl: string;
  description: string;
  resolution: string;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  totalAmount: number;
  insuranceCovered: number;
  patientAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  receiptUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: 'Appointment' | 'Clinical' | 'Billing' | 'System';
  icon: string;
  unread: boolean;
  bgClass: string;
  textClass: string;
}
