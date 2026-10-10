import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import ToastNotification from '../components/ToastNotification';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface UpcomingApt {
  id: string;
  dentist: string;
  dentistImg: string;
  procedure: string;
  location: string;
  month: string;
  day: string;
  fullDate: string;
  timeSlot: string;
  note: string;
  status: 'Confirmed' | 'Pending Confirmation';
}

interface PastApt {
  id: string;
  date: string;
  time: string;
  dentist: string;
  dentistTitle: string;
  treatment: string;
  category: 'Preventive' | 'Restorative' | 'Orthodontics' | 'Periodontics' | 'Cosmetic';
  notes: string;
  status: 'Completed' | 'Follow-up Scheduled';
  tooth?: string;
  code: string;
  fee: number;
  insurancePaid: number;
  patientCopay: number;
  rxPrescribed?: string;
  vitals?: { bp: string; pulse: string };
  findings?: string;
}

const initialUpcoming: UpcomingApt[] = [
  {
    id: 'APT-1',
    dentist: 'Dr. Priya Patel, DDS',
    dentistImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6hrazIG_NsiGGYzWnDz0m5A333wxrviBRPqIFBOs8QjhjyclfL_nyvgWFig0hw4yV2tWGA_1HuEAfZZNC494yj0oCb5v2S3wxppMSO5VjDuMBxIr1JRnweFq0fm1N213Pp6_RLmSxLx7Vcoa7_AjoO5EiOhmwUpJPDbIpTnyOiAOEyLRRniQQ5kpIIBlD1px1-FvX48OzeoIFBbfLlYvccFYXVluhs9awRBIBrrUhEYTv6SpSHI65',
    procedure: 'Routine Checkup & Cleaning',
    location: 'Smile Clinic Main Branch, Suite 402, Downtown',
    month: 'OCT',
    day: '24',
    fullDate: 'Thursday, 10:00 AM - 11:00 AM',
    timeSlot: '10:00 AM - 11:00 AM',
    note: 'Please arrive 10 mins early for paperwork.',
    status: 'Confirmed'
  },
  {
    id: 'APT-2',
    dentist: 'Dr. Vikram Chawla, DMD',
    dentistImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXeNJ08d85ETK0TSzaE-HTxsfkltSc69VdgoDDmXIucrfMQg9lqLj73uvPZQx3L9PWWuIeSpka9etRy-fJ0Zyv-2g0WCv89kJMEO5ezi_VXYTekmOkuHvOYbWTHFh09CK1TUCPmMSjyvfJsE5ST8xfSX5OSIj90uLcZQXfiq3JME61-135_DtCuC3d2duhy_w0ChoFZvMVYboUziB5xuEJZQH3b1YEeY9Uw8vOykw5Z5A-KofgVgjS',
    procedure: 'Orthodontic Adjustment',
    location: 'Smile Clinic North Practice, 789 Medical Plaza',
    month: 'NOV',
    day: '05',
    fullDate: 'Sunday, 02:30 PM - 03:15 PM',
    timeSlot: '02:30 PM - 03:15 PM',
    note: 'Awaiting final confirmation from front desk.',
    status: 'Pending Confirmation'
  }
];

const initialPast: PastApt[] = [
  {
    id: 'REC-2026-1014',
    date: 'Oct 14, 2026',
    time: '09:00 AM',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Cosmetic & General Clinician',
    treatment: 'Comprehensive Exam & Ultrasonic Scaling',
    category: 'Preventive',
    code: 'CDT D1110 / D0120',
    tooth: 'Full Dentition',
    fee: 165.50,
    insurancePaid: 120.00,
    patientCopay: 45.50,
    vitals: { bp: '118/76 mmHg', pulse: '68 bpm' },
    findings: 'Gingival margins stable. Sulcus depths 1-3mm with zero bleeding on probing.',
    notes: 'Biannual dental prophylaxis completed with piezon ultrasonic instrumentation and fine prophy paste. Topical 5% sodium fluoride varnish applied to all quadrants.',
    rxPrescribed: 'Fluoridex Daily Home Defense 1.1% NaF paste',
    status: 'Completed'
  },
  {
    id: 'REC-2026-0602',
    date: 'Jun 02, 2026',
    time: '02:15 PM',
    dentist: 'Dr. Rohan Chauhan',
    dentistTitle: 'DMD, Restorative & Endodontics Lead',
    treatment: 'Nanohybrid Composite Restoration',
    category: 'Restorative',
    code: 'CDT D2391',
    tooth: 'Tooth #14 (MOD)',
    fee: 380.00,
    insurancePaid: 280.00,
    patientCopay: 100.00,
    vitals: { bp: '122/78 mmHg', pulse: '72 bpm' },
    findings: 'Mesial-occlusal dentin carious involvement. Pulpal floor intact with no sensitivity.',
    notes: 'Local infiltration administered (1.8mL 4% Septocaine with 1:100k epi). Carious lesion excised under rubber dam isolation. 3M Filtek Supreme A2 composite layered and cured in 2mm increments.',
    rxPrescribed: 'Ibuprofen 400mg PO PRN for mild soreness',
    status: 'Completed'
  },
  {
    id: 'REC-2026-0115',
    date: 'Jan 15, 2026',
    time: '11:30 AM',
    dentist: 'Dr. Vikram Chawla',
    dentistTitle: 'DMD, Orthodontic Specialist',
    treatment: 'Invisalign Progress Check & Tray Delivery',
    category: 'Orthodontics',
    code: 'CDT D8080',
    tooth: 'Upper & Lower Arches',
    fee: 950.00,
    insurancePaid: 600.00,
    patientCopay: 350.00,
    vitals: { bp: '115/74 mmHg', pulse: '65 bpm' },
    findings: 'Excellent aligner tracking compliance. Anterior contact points harmonized.',
    notes: 'Interproximal reduction (IPR) performed on mesial of tooth #24 (0.2mm). Delivered aligner trays #6 through #10 with patient instructions for 22h daily wear.',
    rxPrescribed: 'Orthodontic relief wax & chewies',
    status: 'Completed'
  },
  {
    id: 'REC-2025-1002',
    date: 'Oct 02, 2025',
    time: '09:45 AM',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Cosmetic & General Clinician',
    treatment: 'Diagnostic Bitewing Scans & Oral Screening',
    category: 'Preventive',
    code: 'CDT D0274',
    tooth: 'Bilateral Posterior',
    fee: 140.00,
    insurancePaid: 140.00,
    patientCopay: 0.00,
    vitals: { bp: '116/75 mmHg', pulse: '70 bpm' },
    findings: 'No interproximal lesions detected on distal of premolars or molars.',
    notes: 'Four vertical bitewing radiographs exposed and analyzed. Oral cancer visual and palpation screening negative. Velscope fluorescence examination clear.',
    status: 'Completed'
  },
  {
    id: 'REC-2025-0518',
    date: 'May 18, 2025',
    time: '03:00 PM',
    dentist: 'Dr. Sarah Sharma',
    dentistTitle: 'DDS, Periodontal Therapy Specialist',
    treatment: 'Periodontal Debridement & Therapy',
    category: 'Periodontics',
    code: 'CDT D4341',
    tooth: 'Upper Right (Quadrant 1)',
    fee: 420.00,
    insurancePaid: 330.00,
    patientCopay: 90.00,
    vitals: { bp: '120/78 mmHg', pulse: '74 bpm' },
    findings: 'Local pocket depth reduction noted from 5mm to 3mm at molar sites.',
    notes: 'Ultrasonic and hand scaling performed with subgingival chlorhexidine irrigation. Patient counseled on water flosser adoption.',
    rxPrescribed: 'Chlorhexidine Gluconate 0.12% Oral Rinse (16 fl oz)',
    status: 'Completed'
  },
  {
    id: 'REC-2025-0210',
    date: 'Feb 10, 2025',
    time: '10:15 AM',
    dentist: 'Dr. Rohan Chauhan',
    dentistTitle: 'DMD, Restorative & Endodontics Lead',
    treatment: 'Ceramic Inlay Preparation & Digital Impression',
    category: 'Restorative',
    code: 'CDT D2610',
    tooth: 'Tooth #3',
    fee: 620.00,
    insurancePaid: 450.00,
    patientCopay: 170.00,
    vitals: { bp: '124/80 mmHg', pulse: '76 bpm' },
    findings: 'Existing fractured amalgam removed. Pulp vitality confirmed via Endo-Ice.',
    notes: 'Tooth prepared for porcelain inlay. 3D intraoral digital optical scan transmitted to in-house milling unit. Temporary restoration fabricated with Telio CS.',
    status: 'Completed'
  },
  {
    id: 'REC-2024-1108',
    date: 'Nov 08, 2024',
    time: '01:30 PM',
    dentist: 'Dr. Vikram Chawla',
    dentistTitle: 'DMD, Orthodontic Specialist',
    treatment: 'Orthodontic 3D Imaging & Cephalometric Study',
    category: 'Orthodontics',
    code: 'CDT D0330 / D0340',
    tooth: 'Maxillofacial Region',
    fee: 350.00,
    insurancePaid: 250.00,
    patientCopay: 100.00,
    vitals: { bp: '118/76 mmHg', pulse: '66 bpm' },
    findings: 'Class I molar occlusion with 3.2mm anterior crowding. Skeletal profile straight.',
    notes: 'Full cephalometric tracing and panoramic radiograph reviewed. ClinCheck 3D treatment simulations evaluated with patient approval.',
    status: 'Completed'
  },
  {
    id: 'REC-2024-0722',
    date: 'Jul 22, 2024',
    time: '04:00 PM',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, Lead Cosmetic & General Clinician',
    treatment: 'In-Office Zoom Laser Teeth Whitening',
    category: 'Cosmetic',
    code: 'CDT D9972',
    tooth: 'Anterior Teeth (#6 to #11)',
    fee: 390.00,
    insurancePaid: 0.00,
    patientCopay: 390.00,
    vitals: { bp: '117/74 mmHg', pulse: '70 bpm' },
    findings: 'Starting shade A3.5 recorded with VITA Classical guide.',
    notes: 'Gingival barrier placed with light cure dam. Three 15-minute cycles of 25% hydrogen peroxide with LED accelerator. Final shade achieved: B1 (4 shades brighter).',
    rxPrescribed: 'Relief ACP desensitizing oral gel',
    status: 'Completed'
  },
  {
    id: 'REC-2024-0314',
    date: 'Mar 14, 2024',
    time: '11:00 AM',
    dentist: 'Dr. Rohan Chauhan',
    dentistTitle: 'DMD, Restorative Lead',
    treatment: 'Preventative Pit & Fissure Sealants',
    category: 'Preventive',
    code: 'CDT D1351',
    tooth: 'Teeth #18, #19, #30',
    fee: 180.00,
    insurancePaid: 180.00,
    patientCopay: 0.00,
    vitals: { bp: '115/72 mmHg', pulse: '68 bpm' },
    findings: 'Deep occlusal anatomy with no active decay.',
    notes: 'Pumice prophylaxis, 37% phosphoric acid etch for 20s, rinsed, and Clinpro sealant resin cured with LED light. Occlusion checked and clear.',
    status: 'Completed'
  },
  {
    id: 'REC-2023-1115',
    date: 'Nov 15, 2023',
    time: '02:00 PM',
    dentist: 'Dr. Sarah Sharma',
    dentistTitle: 'DDS, Periodontal Lead',
    treatment: 'Periodontal Maintenance Care & Charting',
    category: 'Periodontics',
    code: 'CDT D4910',
    tooth: 'Full Dentition',
    fee: 230.00,
    insurancePaid: 190.00,
    patientCopay: 40.00,
    vitals: { bp: '119/76 mmHg', pulse: '71 bpm' },
    findings: 'Full mouth probing complete. Bleeding index reduced by 60%.',
    notes: 'Maintenance therapy with subgingival ultrasonic irrigation. Home hygiene compliance praised.',
    status: 'Completed'
  },
  {
    id: 'REC-2023-0805',
    date: 'Aug 05, 2023',
    time: '08:45 AM',
    dentist: 'Dr. Priya Patel',
    dentistTitle: 'DDS, General Clinician',
    treatment: 'Emergency Diagnostic Check for Cold Sensitivity',
    category: 'Restorative',
    code: 'CDT D0140',
    tooth: 'Tooth #6 (Cervical)',
    fee: 145.00,
    insurancePaid: 145.00,
    patientCopay: 0.00,
    vitals: { bp: '122/80 mmHg', pulse: '78 bpm' },
    findings: 'Gingival recession 1.5mm on facial aspect with exposed root dentin.',
    notes: 'Gluma desensitizer placed on cervical margins with instant resolution of air sensitivity. Scheduled for monitoring.',
    status: 'Follow-up Scheduled'
  },
  {
    id: 'REC-2023-0419',
    date: 'Apr 19, 2023',
    time: '10:30 AM',
    dentist: 'Dr. Vikram Chawla',
    dentistTitle: 'DMD, Orthodontics',
    treatment: 'Custom Bruxism Night Guard Delivery & Fit',
    category: 'Orthodontics',
    code: 'CDT D9944',
    tooth: 'Maxillary Arch',
    fee: 480.00,
    insurancePaid: 320.00,
    patientCopay: 160.00,
    vitals: { bp: '116/74 mmHg', pulse: '67 bpm' },
    findings: 'Nocturnal clenching and mild masseter hypertrophy noted.',
    notes: 'Dual-laminate thermoformed occlusal guard delivered. Contacts adjusted to canine guidance with no posterior interference.',
    status: 'Completed'
  }
];

export default function Appointments() {
  const [upcomingList, setUpcomingList] = useState<UpcomingApt[]>(initialUpcoming);
  const [pastList] = useState<PastApt[]>(initialPast);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Follow-up Scheduled'>('All');
  const [dentistFilter, setDentistFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<UpcomingApt | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState<UpcomingApt | null>(null);
  const [calendarModalApt, setCalendarModalApt] = useState<UpcomingApt | null>(null);

  // Popups for Eye Icon and Book Icon
  const [selectedNotesModal, setSelectedNotesModal] = useState<PastApt | null>(null);
  const [selectedRecordModal, setSelectedRecordModal] = useState<PastApt | null>(null);

  // New Booking State
  const [newService, setNewService] = useState('Routine Cleaning & Exam');
  const [newDentist, setNewDentist] = useState('Dr. Priya Patel, DDS (Main Branch)');
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newTime, setNewTime] = useState('10:00 AM - Morning');
  const [newNotes, setNewNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lock background scroll when any appointment modal is active
  useBodyScrollLock(Boolean(
    bookModalOpen ||
    rescheduleModalOpen ||
    cancelModalOpen ||
    calendarModalApt ||
    selectedNotesModal ||
    selectedRecordModal
  ));

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(newDate);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthStr = months[dateObj.getMonth()] || 'DEC';
    const dayStr = String(dateObj.getDate()).padStart(2, '0');

    const newAppointment: UpcomingApt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      dentist: newDentist.split('(')[0].trim(),
      dentistImg: newDentist.includes('Chawla')
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXeNJ08d85ETK0TSzaE-HTxsfkltSc69VdgoDDmXIucrfMQg9lqLj73uvPZQx3L9PWWuIeSpka9etRy-fJ0Zyv-2g0WCv89kJMEO5ezi_VXYTekmOkuHvOYbWTHFh09CK1TUCPmMSjyvfJsE5ST8xfSX5OSIj90uLcZQXfiq3JME61-135_DtCuC3d2duhy_w0ChoFZvMVYboUziB5xuEJZQH3b1YEeY9Uw8vOykw5Z5A-KofgVgjS'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6hrazIG_NsiGGYzWnDz0m5A333wxrviBRPqIFBOs8QjhjyclfL_nyvgWFig0hw4yV2tWGA_1HuEAfZZNC494yj0oCb5v2S3wxppMSO5VjDuMBxIr1JRnweFq0fm1N213Pp6_RLmSxLx7Vcoa7_AjoO5EiOhmwUpJPDbIpTnyOiAOEyLRRniQQ5kpIIBlD1px1-FvX48OzeoIFBbfLlYvccFYXVluhs9awRBIBrrUhEYTv6SpSHI65',
      procedure: newService,
      location: newDentist.includes('North') ? 'Smile Clinic North Practice, 789 Medical Plaza' : 'Smile Clinic Main Branch, Suite 402, Downtown',
      month: monthStr,
      day: dayStr,
      fullDate: `${newDate}, ${newTime}`,
      timeSlot: newTime,
      note: newNotes || 'Confirmed appointment booked online.',
      status: 'Confirmed'
    };

    setUpcomingList([newAppointment, ...upcomingList]);
    setBookModalOpen(false);
    showToast(`Appointment booked successfully with ${newAppointment.dentist}!`);
  };

  const handleCancelAppointment = (id: string) => {
    setUpcomingList(upcomingList.filter(apt => apt.id !== id));
    setCancelModalOpen(null);
    showToast('Appointment cancelled successfully.');
  };

  // Filtered Past Appointments
  const filteredPast = useMemo(() => {
    return pastList.filter(p => {
      const matchesSearch =
        p.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesDentist = dentistFilter === 'All' || p.dentist.includes(dentistFilter);
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesDentist && matchesCategory;
    });
  }, [pastList, searchTerm, statusFilter, dentistFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPast.length / itemsPerPage));

  // Current page items
  const paginatedPast = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPast.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPast, currentPage, itemsPerPage]);

  const activeFiltersCount = (statusFilter !== 'All' ? 1 : 0) + (dentistFilter !== 'All' ? 1 : 0) + (categoryFilter !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setStatusFilter('All');
    setDentistFilter('All');
    setCategoryFilter('All');
    setCurrentPage(1);
    setIsFilterOpen(false);
    showToast('Filters cleared.');
  };

  // Add to Calendar handlers
  const handleCalendarExport = (type: 'google' | 'apple' | 'outlook' | 'yahoo', apt: UpcomingApt) => {
    const title = encodeURIComponent(`${apt.procedure} - Smile Clinic`);
    const details = encodeURIComponent(`Appointment with ${apt.dentist}. Location: ${apt.location}. Notes: ${apt.note}`);
    const location = encodeURIComponent(apt.location);

    if (type === 'google') {
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
      window.open(url, '_blank');
      showToast('Opening Google Calendar event creator...');
    } else if (type === 'outlook') {
      const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&location=${location}`;
      window.open(url, '_blank');
      showToast('Opening Outlook Calendar event creator...');
    } else if (type === 'yahoo') {
      const url = `https://calendar.yahoo.com/?v=60&title=${title}&desc=${details}&in_loc=${location}`;
      window.open(url, '_blank');
      showToast('Opening Yahoo Calendar event creator...');
    } else if (type === 'apple') {
      // Generate .ics file dynamically
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Smile Clinic//Dental Portal//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${apt.procedure} - ${apt.dentist}`,
        `DESCRIPTION:${apt.note}`,
        `LOCATION:${apt.location}`,
        `STATUS:CONFIRMED`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `SmileClinic_${apt.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Apple iCal (.ics) file downloaded!');
    }
    setCalendarModalApt(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Bar / Header Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-bold block mb-1">
            Schedule Management
          </span>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Your Appointments</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Manage upcoming visits, book new treatments, and access past clinical notes and treatment certificates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBookModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-primary-container transition-all shadow-md hover:shadow-lg cursor-pointer text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Quick Stats / Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] border border-surface-container-high/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant block">Next Visit</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">Oct 24, 10:00 AM</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] border border-surface-container-high/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[24px]">clinical_notes</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant block">Active Treatment Plan</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">Orthodontics Phase II</h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] border border-surface-container-high/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant block">Recorded Visits</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">{pastList.length} Sessions Logged</h3>
          </div>
        </div>
      </div>

      {/* Main Section: Upcoming Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">upcoming</span>
            <span>Upcoming Appointments</span>
          </h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {upcomingList.length} Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingList.map((apt) => (
            <div
              key={apt.id}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(0,119,130,0.06)] border border-surface-container-high/60 flex flex-col justify-between relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 text-[11px] px-3 py-1 rounded-bl-lg font-bold ${
                apt.status === 'Confirmed'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-secondary-fixed text-on-secondary-fixed'
              }`}>
                {apt.status}
              </div>

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-surface-container-high"
                    style={{ backgroundImage: `url('${apt.dentistImg}')` }}
                  />
                  <div>
                    <span className="text-xs text-primary uppercase font-bold block">{apt.procedure}</span>
                    <h3 className="text-base sm:text-lg font-bold text-on-surface">{apt.dentist}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                      <span>{apt.location}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 mb-4 border border-surface-container-high">
                  <div className="bg-surface-container-lowest px-4 py-2 rounded-lg text-center shadow-xs border border-surface-container-high shrink-0">
                    <span className="text-[10px] uppercase font-bold text-primary block">{apt.month}</span>
                    <span className="text-xl font-extrabold text-on-surface leading-none">{apt.day}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">{apt.fullDate}</span>
                    <span className="text-xs text-on-surface-variant">{apt.note}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-container-high">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCalendarModalApt(apt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-secondary bg-secondary-fixed/50 hover:bg-secondary-fixed transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">event_available</span>
                    <span>Add to Calendar</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRescheduleModalOpen(apt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setCancelModalOpen(apt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Appointments Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              <span>Past Appointment History</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Click the eye icon for clinical examination notes or the book icon for official treatment records.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search past visits, doctors..."
                className="bg-surface-container-lowest px-4 py-2 rounded-lg text-xs sm:text-sm text-on-surface border border-outline-variant focus:outline-none focus:border-primary pl-9 w-48 sm:w-64"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[18px]">search</span>
            </div>

            {/* Filter Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant hover:bg-surface-container'
                }`}
                title="Filter records"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span className="hidden sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Filter Popover Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high p-4 z-30 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                    <span className="font-bold text-on-surface text-sm">Filter Appointments</span>
                    <button
                      onClick={resetFilters}
                      className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-2.5 py-1.5 text-on-surface font-medium"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                    </select>
                  </div>

                  {/* Dentist Filter */}
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">Clinician</label>
                    <select
                      value={dentistFilter}
                      onChange={(e) => {
                        setDentistFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-2.5 py-1.5 text-on-surface font-medium"
                    >
                      <option value="All">All Clinicians</option>
                      <option value="Dr. Priya Patel">Dr. Priya Patel</option>
                      <option value="Dr. Vikram Chawla">Dr. Vikram Chawla</option>
                      <option value="Dr. Rohan Chauhan">Dr. Rohan Chauhan</option>
                      <option value="Dr. Sarah Sharma">Dr. Sarah Sharma</option>
                    </select>
                  </div>

                  {/* Treatment Category */}
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">Treatment Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-2.5 py-1.5 text-on-surface font-medium"
                    >
                      <option value="All">All Categories</option>
                      <option value="Preventive">Preventive</option>
                      <option value="Restorative">Restorative</option>
                      <option value="Orthodontics">Orthodontics</option>
                      <option value="Periodontics">Periodontics</option>
                      <option value="Cosmetic">Cosmetic</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,119,130,0.04)] overflow-hidden border border-surface-container-high/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Dentist & Treatment</th>
                  <th className="py-3.5 px-5">Summary Notes</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {paginatedPast.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-outline block mb-1">search_off</span>
                      No appointment records found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPast.map((past) => (
                    <tr key={past.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-5 text-on-surface font-medium whitespace-nowrap">
                        {past.date}
                        <br />
                        <span className="text-xs text-on-surface-variant">{past.time}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-on-surface block">{past.dentist}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-primary font-medium">{past.treatment}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-surface-container-high text-on-surface-variant rounded">
                            {past.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-on-surface-variant max-w-xs truncate">
                        {past.notes}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          past.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {past.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Eye Icon: Clinical Visit Notes & Exam Details */}
                          <button
                            onClick={() => setSelectedNotesModal(past)}
                            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer"
                            title="View Clinical Examination Notes"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>

                          {/* 2. Book Icon: Official Clinical Treatment Record */}
                          <button
                            onClick={() => setSelectedRecordModal(past)}
                            className="p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-all cursor-pointer"
                            title="View Official Treatment Record & Certificate"
                          >
                            <span className="material-symbols-outlined text-[20px]">menu_book</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-surface-container-high/60 gap-3 text-xs text-on-surface-variant bg-surface-container-lowest">
            <span>
              Showing {filteredPast.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredPast.length)} of {filteredPast.length} recorded visits
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container disabled:opacity-40 font-medium cursor-pointer transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container disabled:opacity-40 font-medium cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EYE ICON MODAL: CLINICAL VISIT NOTES & EXAM DETAILS                   */}
      {/* ========================================================================= */}
      {selectedNotesModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedNotesModal(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-surface-container-high bg-primary/5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[24px]">visibility</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Clinical Visit Examination
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{selectedNotesModal.id}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface mt-0.5">{selectedNotesModal.treatment}</h3>
                  <p className="text-xs text-on-surface-variant">{selectedNotesModal.date} • {selectedNotesModal.time}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotesModal(null)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Doctor Details */}
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-on-surface-variant block">Attending Clinician:</span>
                  <span className="font-bold text-on-surface text-sm">{selectedNotesModal.dentist}</span>
                  <span className="text-xs text-primary block">{selectedNotesModal.dentistTitle}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant block">Procedure Code:</span>
                  <span className="font-mono font-bold text-on-surface">{selectedNotesModal.code}</span>
                  <span className="text-xs text-on-surface-variant block">Tooth: {selectedNotesModal.tooth || 'N/A'}</span>
                </div>
              </div>

              {/* Vitals & Findings */}
              {selectedNotesModal.vitals && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Blood Pressure</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{selectedNotesModal.vitals.bp}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Resting Pulse</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{selectedNotesModal.vitals.pulse}</span>
                  </div>
                </div>
              )}

              {/* Clinical Examination Notes */}
              <div className="p-4 bg-surface-container-lowest border border-surface-container-high rounded-xl space-y-1.5">
                <span className="font-bold text-on-surface flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">stethoscope</span>
                  <span>Doctor Examination Notes & Procedure Summary</span>
                </span>
                <p className="text-on-surface-variant leading-relaxed text-xs sm:text-sm">
                  {selectedNotesModal.notes}
                </p>
              </div>

              {/* Findings */}
              {selectedNotesModal.findings && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                    <span>Diagnostic Findings</span>
                  </span>
                  <p className="text-emerald-900 text-xs leading-relaxed">
                    {selectedNotesModal.findings}
                  </p>
                </div>
              )}

              {/* Prescriptions */}
              {selectedNotesModal.rxPrescribed && (
                <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <span className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">prescriptions</span>
                    <span>Post-Care Prescription & Product Recommendation</span>
                  </span>
                  <p className="text-purple-900 font-mono text-xs">
                    {selectedNotesModal.rxPrescribed}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low/60 border-t border-surface-container-high flex items-center justify-between shrink-0">
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
                Confidential Electronic Health Record
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Clinical visit notes downloaded as PDF.');
                  }}
                  className="px-3.5 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNotesModal(null)}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. BOOK ICON MODAL: OFFICIAL CLINICAL TREATMENT RECORD                   */}
      {/* ========================================================================= */}
      {selectedRecordModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedRecordModal(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[92vh]"
          >
            {/* Header Letterhead */}
            <div className="p-6 bg-slate-900 text-white shrink-0 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-teal-400 text-[24px]">dentistry</span>
                  <span className="font-bold text-lg tracking-tight">SMILE CLINIC DENTAL CORPORATION</span>
                </div>
                <p className="text-xs text-slate-400">Department of Oral Health & Restorative Dentistry • Suite 402, Downtown</p>
                <p className="text-[10px] text-teal-300 font-mono mt-1">OFFICIAL CLINICAL TREATMENT SUMMARY • RECORD #{selectedRecordModal.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecordModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Document Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800">
              {/* Patient & Clinic Meta Table */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Patient Information</span>
                  <strong className="text-slate-900 text-sm block">Ananya Verma</strong>
                  <span className="text-slate-600 block">ID: #PT-84920 • DOB: 24/08/1994</span>
                  <span className="text-slate-600 block">Policy: Delta Dental Premier #DD-8849</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Provider Details</span>
                  <strong className="text-slate-900 text-sm block">{selectedRecordModal.dentist}</strong>
                  <span className="text-slate-600 block">{selectedRecordModal.dentistTitle}</span>
                  <span className="text-slate-600 block">Visit Date: {selectedRecordModal.date} ({selectedRecordModal.time})</span>
                </div>
              </div>

              {/* Itemized Procedures Table */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">Itemized Clinical Services</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">CDT Code</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Tooth / Site</th>
                        <th className="p-3 text-right">Fee</th>
                        <th className="p-3 text-right">Insurance</th>
                        <th className="p-3 text-right">Patient Copay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-mono font-bold text-slate-900">{selectedRecordModal.code}</td>
                        <td className="p-3 font-semibold text-slate-800">{selectedRecordModal.treatment}</td>
                        <td className="p-3 text-slate-600">{selectedRecordModal.tooth || 'Arch'}</td>
                        <td className="p-3 text-right font-mono">${selectedRecordModal.fee.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono text-emerald-700">-${selectedRecordModal.insurancePaid.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">${selectedRecordModal.patientCopay.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Treatment Notes & Certification */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-xs text-slate-900 block">Clinical Documentation & Certification:</span>
                <p className="text-xs leading-relaxed text-slate-700">
                  {selectedRecordModal.notes}
                </p>
                {selectedRecordModal.findings && (
                  <p className="text-xs text-slate-600 italic">
                    Findings: {selectedRecordModal.findings}
                  </p>
                )}
              </div>

              {/* Doctor Digital Signature Seal */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Digitally Certified By</span>
                  <div className="font-serif italic text-base text-slate-900 mt-1 font-semibold">{selectedRecordModal.dentist}</div>
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Digitally Sealed & Cryptographically Verified
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Clinic License</span>
                  <span className="font-mono text-xs text-slate-700">NY-DDS-89421A</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">Official Patient Record copy</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRecordModal(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 3. ADD TO CALENDAR POPUP MODAL                                            */}
      {/* ========================================================================= */}
      {calendarModalApt && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setCalendarModalApt(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm"
          >
            <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Add to Calendar</h3>
                  <p className="text-xs text-on-surface-variant">Sync dental visit with your preferred calendar</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCalendarModalApt(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container-high space-y-1">
                <strong className="text-on-surface text-sm block">{calendarModalApt.procedure}</strong>
                <span className="text-xs text-primary font-semibold block">{calendarModalApt.dentist}</span>
                <span className="text-xs text-on-surface-variant block">{calendarModalApt.fullDate}</span>
                <span className="text-[11px] text-outline block">{calendarModalApt.location}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-on-surface block">Choose Calendar Service:</span>

                <button
                  type="button"
                  onClick={() => handleCalendarExport('google', calendarModalApt)}
                  className="w-full p-3 rounded-xl border border-surface-container-high hover:border-primary/50 hover:bg-primary/5 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                      G
                    </div>
                    <div>
                      <strong className="text-xs text-on-surface block group-hover:text-primary">Google Calendar</strong>
                      <span className="text-[10px] text-on-surface-variant">Open in browser and save directly</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">open_in_new</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCalendarExport('apple', calendarModalApt)}
                  className="w-full p-3 rounded-xl border border-surface-container-high hover:border-primary/50 hover:bg-primary/5 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    </div>
                    <div>
                      <strong className="text-xs text-on-surface block group-hover:text-primary">Apple iCal (.ics)</strong>
                      <span className="text-[10px] text-on-surface-variant">Download .ics file for Mac / iPhone</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">download</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCalendarExport('outlook', calendarModalApt)}
                  className="w-full p-3 rounded-xl border border-surface-container-high hover:border-primary/50 hover:bg-primary/5 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                      O
                    </div>
                    <div>
                      <strong className="text-xs text-on-surface block group-hover:text-primary">Microsoft Outlook</strong>
                      <span className="text-[10px] text-on-surface-variant">Sync to Outlook 365 / Web</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">open_in_new</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-high flex justify-end">
              <button
                type="button"
                onClick={() => setCalendarModalApt(null)}
                className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 4. BOOKING MODAL                                                          */}
      {/* ========================================================================= */}
      {bookModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setBookModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-primary text-white shrink-0">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                <span>Book New Dental Appointment</span>
              </h3>
              <button
                type="button"
                onClick={() => setBookModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-on-surface mb-1">Select Treatment Type *</label>
                <select
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                  required
                >
                  <option value="Routine Cleaning & Exam">Routine Cleaning & Exam</option>
                  <option value="Cavity Filling / Restoration">Cavity Filling / Restoration</option>
                  <option value="Orthodontic Consultation / Adjustment">Orthodontic Consultation / Adjustment</option>
                  <option value="Teeth Whitening">Teeth Whitening</option>
                  <option value="Emergency Toothache Relief">Emergency Toothache Relief</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Select Preferred Dentist *</label>
                <select
                  value={newDentist}
                  onChange={(e) => setNewDentist(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                  required
                >
                  <option value="Dr. Priya Patel, DDS (General / Cosmetic)">Dr. Priya Patel, DDS (General / Cosmetic)</option>
                  <option value="Dr. Vikram Chawla, DMD (Orthodontics)">Dr. Vikram Chawla, DMD (Orthodontics)</option>
                  <option value="Dr. Sarah Sharma, DDS (Periodontics)">Dr. Sarah Sharma, DDS (Periodontics)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Preferred Time Slot *</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary font-medium"
                    required
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM</option>
                    <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Additional Symptoms or Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Sensitivity on upper left premolar..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2 text-on-surface focus:outline-none focus:border-primary font-medium resize-none text-xs sm:text-sm"
                ></textarea>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">verified_user</span>
                <span className="text-[11px] text-on-surface-variant leading-tight">
                  Covered under active Delta Dental insurance policy. Estimated patient copay: $0.00 - $15.00.
                </span>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-surface-container-high shrink-0">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-surface-container-high text-on-surface-variant font-bold hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container transition-colors shadow-sm font-bold cursor-pointer"
                >
                  Confirm Booking Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 5. RESCHEDULE MODAL                                                       */}
      {/* ========================================================================= */}
      {rescheduleModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setRescheduleModalOpen(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs sm:text-sm max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-container-high shrink-0">
              <h3 className="font-bold text-base text-on-surface">Reschedule Appointment</h3>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-on-surface-variant">
                Select a new appointment slot for <strong>{rescheduleModalOpen.procedure}</strong> with {rescheduleModalOpen.dentist}:
              </p>

              <div>
                <label className="block font-bold text-on-surface mb-1">Select New Date *</label>
                <input
                  type="date"
                  defaultValue="2026-11-20"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-lg border border-surface-container-high font-medium text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Select New Time Slot *</label>
                <select
                  defaultValue="11:30 AM - 12:30 PM"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-lg border border-surface-container-high font-medium text-xs sm:text-sm"
                >
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-high flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(null)}
                className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRescheduleModalOpen(null);
                  showToast('Appointment rescheduled successfully! SMS confirmation sent.');
                }}
                className="px-4 py-2 bg-primary text-white font-bold rounded-lg cursor-pointer"
              >
                Update Slot
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 6. CANCEL CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {cancelModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setCancelModalOpen(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto text-xs max-h-[90vh]"
          >
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[26px]">event_busy</span>
              </div>
              <h3 className="font-bold text-base text-on-surface">Cancel Appointment?</h3>
              <p className="text-on-surface-variant leading-relaxed text-xs">
                Are you sure you want to cancel your visit for <strong>{cancelModalOpen.procedure}</strong> with {cancelModalOpen.dentist}?
              </p>
            </div>

            <div className="p-4 bg-surface-container-low/50 border-t border-surface-container-high flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCancelModalOpen(null)}
                className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-lg cursor-pointer"
              >
                Keep Visit
              </button>
              <button
                type="button"
                onClick={() => handleCancelAppointment(cancelModalOpen.id)}
                className="px-4 py-2 bg-error text-white font-bold rounded-lg cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
