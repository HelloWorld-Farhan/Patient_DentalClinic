import { 
  PatientProfile, 
  Appointment, 
  OdontogramTooth, 
  ClinicalNote, 
  DentalRadiograph, 
  Invoice, 
  NotificationItem 
} from '../types';

export const initialPatientProfile: PatientProfile = {
  id: 'PT-84920',
  name: 'Ananya Verma',
  email: 'ananya.verma@smileclinic.com',
  phone: '(555) 349-8821',
  dob: '24 / 08 / 1994',
  gender: 'Female',
  address: '428 Park Avenue, Apt 6B, Metro City, NY 10022',
  emergencyContact: {
    name: 'Karan Verma',
    relationship: 'Spouse',
    phone: '(555) 349-8829'
  },
  insurance: {
    provider: 'Delta Dental Premier',
    policyNumber: 'DD-8849-209',
    groupId: 'GRP-40291',
    coverageLevel: '80% Preventive & Basic Care',
    deductibleMet: 350,
    deductibleTotal: 500,
    status: 'Active'
  }
};

export const initialAppointments: Appointment[] = [
  {
    id: 'APT-101',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Cosmetic & General Dentist',
    procedure: 'Routine Cleaning & Comprehensive Checkup',
    category: 'Checkup',
    date: 'Oct 24, 2026',
    time: '10:00 AM - 11:00 AM',
    duration: '60 mins',
    location: 'Smile Clinic Main Branch, Suite 402, Downtown',
    status: 'Confirmed',
    notes: 'Please arrive 10 mins early for periodic periodontal charting.',
    isUpcoming: true
  },
  {
    id: 'APT-102',
    dentist: 'Dr. Vikram Chawla',
    dentistTitle: 'DMD, Specialist Orthodontist',
    procedure: 'Invisalign Aligner Check & Refinement',
    category: 'Orthodontics',
    date: 'Nov 05, 2026',
    time: '02:30 PM - 03:15 PM',
    duration: '45 mins',
    location: 'Smile Clinic North Practice, 789 Medical Plaza',
    status: 'Pending Confirmation',
    notes: 'Bring current aligner tray set #6.',
    isUpcoming: true
  },
  {
    id: 'APT-098',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Cosmetic & General Dentist',
    procedure: 'Comprehensive Exam & Scaling',
    category: 'Checkup',
    date: 'Apr 12, 2026',
    time: '11:15 AM - 12:00 PM',
    duration: '45 mins',
    location: 'Smile Clinic Main Branch, Suite 402',
    status: 'Completed',
    notes: 'Probing depths 1-3mm, minor supragingival calculus removed.',
    isUpcoming: false
  },
  {
    id: 'APT-092',
    dentist: 'Dr. Rohan Chauhan',
    dentistTitle: 'DMD, Endodontic Specialist',
    procedure: 'Cavity Composite Restoration (Tooth #14)',
    category: 'Restorative',
    date: 'Jan 15, 2026',
    time: '03:00 PM - 04:00 PM',
    duration: '60 mins',
    location: 'Smile Clinic Main Branch, Suite 402',
    status: 'Completed',
    notes: 'Tooth #14 restored with composite resin shade A2 under rubber dam isolation.',
    isUpcoming: false
  },
  {
    id: 'APT-087',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Cosmetic & General Dentist',
    procedure: 'Biannual Dental Prophylaxis',
    category: 'Checkup',
    date: 'Oct 02, 2025',
    time: '09:00 AM - 09:45 AM',
    duration: '45 mins',
    location: 'Smile Clinic Main Branch, Suite 402',
    status: 'Completed',
    notes: 'Routine plaque removal and fluoride varnish applied.',
    isUpcoming: false
  }
];

export const initialOdontogramTeeth: OdontogramTooth[] = [
  // Upper Arch (Maxillary) 1 to 16
  { number: 1, name: 'Upper Right Third Molar (Wisdom)', arch: 'upper', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026', notes: 'Erupted, clean margins' },
  { number: 2, name: 'Upper Right Second Molar', arch: 'upper', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 3, name: 'Upper Right First Molar', arch: 'upper', type: 'Molar', status: 'crown', lastInspected: 'Jun 2026', notes: 'Porcelain fused to zirconia crown placed' },
  { number: 4, name: 'Upper Right Second Premolar', arch: 'upper', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 5, name: 'Upper Right First Premolar', arch: 'upper', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 6, name: 'Upper Right Canine', arch: 'upper', type: 'Canine', status: 'cavity', lastInspected: 'Oct 2026', notes: 'Incipient lesion observed on mesial surface - monitoring' },
  { number: 7, name: 'Upper Right Lateral Incisor', arch: 'upper', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 8, name: 'Upper Right Central Incisor', arch: 'upper', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 9, name: 'Upper Left Central Incisor', arch: 'upper', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 10, name: 'Upper Left Lateral Incisor', arch: 'upper', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 11, name: 'Upper Left Canine', arch: 'upper', type: 'Canine', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 12, name: 'Upper Left First Premolar', arch: 'upper', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 13, name: 'Upper Left Second Premolar', arch: 'upper', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 14, name: 'Upper Left First Molar', arch: 'upper', type: 'Molar', status: 'crown', lastInspected: 'Jan 2026', notes: 'Ceramic crown restoration intact' },
  { number: 15, name: 'Upper Left Second Molar', arch: 'upper', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 16, name: 'Upper Left Third Molar', arch: 'upper', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },

  // Lower Arch (Mandibular) 32 down to 17
  { number: 32, name: 'Lower Right Third Molar', arch: 'lower', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 31, name: 'Lower Right Second Molar', arch: 'lower', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 30, name: 'Lower Right First Molar', arch: 'lower', type: 'Molar', status: 'watch', lastInspected: 'Oct 2026', notes: 'Mild attrition on occlusal surface' },
  { number: 29, name: 'Lower Right Second Premolar', arch: 'lower', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 28, name: 'Lower Right First Premolar', arch: 'lower', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 27, name: 'Lower Right Canine', arch: 'lower', type: 'Canine', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 26, name: 'Lower Right Lateral Incisor', arch: 'lower', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 25, name: 'Lower Right Central Incisor', arch: 'lower', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 24, name: 'Lower Left Central Incisor', arch: 'lower', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 23, name: 'Lower Left Lateral Incisor', arch: 'lower', type: 'Incisor', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 22, name: 'Lower Left Canine', arch: 'lower', type: 'Canine', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 21, name: 'Lower Left First Premolar', arch: 'lower', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 20, name: 'Lower Left Second Premolar', arch: 'lower', type: 'Premolar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 19, name: 'Lower Left First Molar', arch: 'lower', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 18, name: 'Lower Left Second Molar', arch: 'lower', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' },
  { number: 17, name: 'Lower Left Third Molar', arch: 'lower', type: 'Molar', status: 'healthy', lastInspected: 'Oct 2026' }
];

export const initialClinicalNotes: ClinicalNote[] = [
  {
    id: 'CN-301',
    date: 'October 14, 2026',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Clinician',
    category: 'Routine Checkup',
    diagnosis: 'Patient presented for biannual prophylaxis and examination. Periodontal probing depths 1-3mm throughout. No bleeding upon probing. Minor calculus accumulation on mandibular anterior lingual surfaces.',
    treatment: 'Ultrasonic scaling & polishing completed. 5% sodium fluoride varnish applied.',
    medication: 'None required. Continue daily flossing & soft-bristle brushing.'
  },
  {
    id: 'CN-289',
    date: 'June 02, 2026',
    dentist: 'Dr. Rohan Chauhan',
    dentistTitle: 'DMD, Restorative Lead',
    category: 'Restorative',
    diagnosis: 'Composite resin restoration placed on tooth #3 (MOD). Local anesthesia administered (1.8ml Septocaine). Occlusion adjusted and polished with Sof-Lex disks.',
    treatment: 'Shade A2 nanohybrid composite restoration. Marginal ridge anatomical contact verified.',
    medication: 'Ibuprofen 600mg PRN for mild post-op soreness (if needed).'
  },
  {
    id: 'CN-240',
    date: 'January 15, 2026',
    dentist: 'Dr. Vikram Chawla',
    dentistTitle: 'DMD, Orthodontics',
    category: 'Orthodontics',
    diagnosis: 'Progress check on Invisalign Aligner progression. Aligner tracking is optimal. No interproximal slippage.',
    treatment: 'Delivered aligners #6 through #10. IPR performed on mesial of #24 (0.2mm).',
    medication: 'Wear minimum 22 hours per day. Swap to next tray every 10 days.'
  }
];

export const initialRadiographs: DentalRadiograph[] = [
  {
    id: 'XR-01',
    title: 'Full Arch Panoramic Radiograph (OPG)',
    type: 'PANORAMIC',
    date: 'Oct 14, 2026',
    dentist: 'Dr. Priya Patel',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    description: 'High-contrast panoramic screening demonstrating maxillary and mandibular alveolar bone levels, TMJ condylar symmetry, and adult permanent root anatomy.',
    resolution: '4K Digital DICOM 300 DPI'
  },
  {
    id: 'XR-02',
    title: 'Right & Left Posterior Bitewings',
    type: 'BITEWING',
    date: 'Oct 14, 2026',
    dentist: 'Dr. Priya Patel',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    description: 'Bilateral bitewings evaluating interproximal enamel surfaces, marginal ridge bone crests, and restoration integrity.',
    resolution: 'High-Res Intraoral Sensor'
  },
  {
    id: 'XR-03',
    title: 'Cephalometric Orthodontic Tracing',
    type: 'CEPHALOMETRIC',
    date: 'Nov 02, 2025',
    dentist: 'Dr. Vikram Chawla',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    description: 'Lateral cephalometric radiographic scan for skeletal jaw relationship, incisal angulation, and soft-tissue profile assessment.',
    resolution: 'Orthodontic Digital Tracing'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-892',
    date: 'Oct 14, 2026',
    description: 'Comprehensive Periodic Exam & Ultrasonic Cleaning',
    totalAmount: 165.50,
    insuranceCovered: 120.00,
    patientAmount: 45.50,
    status: 'Pending'
  },
  {
    id: 'INV-2026-741',
    date: 'Jun 02, 2026',
    description: 'Posterior Nanohybrid Composite Restoration (MOD)',
    totalAmount: 380.00,
    insuranceCovered: 280.00,
    patientAmount: 100.00,
    status: 'Paid'
  },
  {
    id: 'INV-2026-512',
    date: 'Jan 15, 2026',
    description: 'Invisalign Treatment Phase II & 3D Intraoral Digital Scan',
    totalAmount: 950.00,
    insuranceCovered: 600.00,
    patientAmount: 350.00,
    status: 'Paid'
  },
  {
    id: 'INV-2025-320',
    date: 'Oct 02, 2025',
    description: 'Diagnostic Bitewing Radiographs & Fluoride Prophylaxis',
    totalAmount: 140.00,
    insuranceCovered: 140.00,
    patientAmount: 0.00,
    status: 'Paid'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Upcoming Cleaning in 14 Days',
    desc: 'Your scheduled Routine Cleaning with Dr. Priya Patel is on Oct 24 at 10:00 AM.',
    time: '2h ago',
    category: 'Appointment',
    icon: 'calendar_month',
    unread: true,
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-600'
  },
  {
    id: '2',
    title: 'New Digital X-Ray Available',
    desc: 'Dr. Priya Patel uploaded your high-resolution Panoramic Scan to your records.',
    time: 'Yesterday',
    category: 'Clinical',
    icon: 'radiology',
    unread: true,
    bgClass: 'bg-sky-500/10',
    textClass: 'text-sky-600'
  },
  {
    id: '3',
    title: 'Insurance Claim Settled',
    desc: 'Delta Dental covered $120.00 for your latest prophylaxis. Balance is $45.50.',
    time: '3d ago',
    category: 'Billing',
    icon: 'payments',
    unread: false,
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-600'
  },
  {
    id: '4',
    title: 'Invisalign Tray Swap Reminder',
    desc: 'Time to switch to aligner tray set #7 in 4 days.',
    time: '5d ago',
    category: 'Clinical',
    icon: 'dentistry',
    unread: false,
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-600'
  }
];
