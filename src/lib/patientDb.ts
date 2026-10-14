import { useState, useEffect, useCallback } from 'react';
import { initialPatientProfile, initialAppointments } from '../data/mockData';

export interface UpcomingApt {
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
  status: 'Confirmed' | 'Pending Confirmation' | 'Cancelled';
}

export interface PastApt {
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

export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  insuranceCovered: number;
  patientAmount: number;
  status: 'Pending' | 'Paid';
  procedureCode: string;
  dentist: string;
  paymentMethod?: string;
  transactionRef?: string;
}

const STORAGE_KEY_UPCOMING = 'smileclinic_patient_apts_upcoming_v2';
const STORAGE_KEY_PAST = 'smileclinic_patient_apts_past_v2';
const STORAGE_KEY_INVOICES = 'smileclinic_patient_invoices_v2';
const STORAGE_KEY_PROFILE = 'smileclinic_patient_profile_v2';
const PATIENT_DB_EVENT = 'smileclinic_patient_db_change';

export const defaultUpcomingApts: UpcomingApt[] = [
  {
    id: 'APT-1',
    dentist: 'Dr. Priya Patel, DDS',
    dentistImg: 'https://images.unsplash.com/photo-1594824813512-8877e8a9366e?auto=format&fit=crop&w=256&q=80',
    procedure: 'Routine Checkup & Cleaning',
    location: 'Smile Clinic Main Branch, Suite 402, Downtown',
    month: 'OCT',
    day: '24',
    fullDate: 'Thursday, 10:00 AM - 11:00 AM',
    timeSlot: '10:00 AM - 11:00 AM',
    note: 'Please arrive 10 mins early for paperwork.',
    status: 'Confirmed',
  },
  {
    id: 'APT-2',
    dentist: 'Dr. Vikram Chawla, DMD',
    dentistImg: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80',
    procedure: 'Orthodontic Adjustment',
    location: 'Smile Clinic North Practice, 789 Medical Plaza',
    month: 'NOV',
    day: '05',
    fullDate: 'Sunday, 02:30 PM - 03:15 PM',
    timeSlot: '02:30 PM - 03:15 PM',
    note: 'Awaiting final confirmation from front desk.',
    status: 'Pending Confirmation',
  },
];

export const defaultPastApts: PastApt[] = [
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
    status: 'Completed',
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
    status: 'Completed',
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
    vitals: { bp: '116/74 mmHg', pulse: '66 bpm' },
    findings: 'Aligner tracking optimal. Overjet reduced by 1.2mm.',
    notes: 'Attachment integrity verified. Delivered aligners #7 through #12 with instruction for 10-day cycle changes.',
    status: 'Completed',
  },
];

export const defaultInvoices: InvoiceItem[] = [
  {
    id: '#INV-2026-892',
    date: 'Nov 14, 2026',
    description: 'Comprehensive Periodic Exam & Ultrasonic Cleaning',
    procedureCode: 'CDT D0120 / D1110',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 120.0,
    patientAmount: 45.5,
    status: 'Pending',
    paymentMethod: 'Delta Dental Direct Claim',
  },
  {
    id: '#INV-2026-741',
    date: 'Oct 02, 2026',
    description: 'Posterior Nanohybrid Composite Restoration (MOD)',
    procedureCode: 'CDT D2391',
    dentist: 'Dr. Rohan Chauhan, DMD',
    insuranceCovered: 280.0,
    patientAmount: 100.0,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-8492019',
  },
  {
    id: '#INV-2026-512',
    date: 'May 20, 2026',
    description: 'Invisalign Treatment Phase II & 3D Intraoral Scan',
    procedureCode: 'CDT D8080',
    dentist: 'Dr. Vikram Chawla, DMD',
    insuranceCovered: 600.0,
    patientAmount: 350.0,
    status: 'Paid',
    paymentMethod: 'Visa •••• 4092',
    transactionRef: 'TXN-8491823',
  },
  {
    id: '#INV-2026-304',
    date: 'Jan 11, 2026',
    description: 'Diagnostic Bitewing Radiographs & Fluoride Prophylaxis',
    procedureCode: 'CDT D0274 / D1206',
    dentist: 'Dr. Priya Patel, DDS',
    insuranceCovered: 200.0,
    patientAmount: 0.0,
    status: 'Paid',
    paymentMethod: 'Delta Dental 100% Preventive',
    transactionRef: 'TXN-8490011',
  },
];

class PatientStore {
  private upcoming: UpcomingApt[] = [];
  private past: PastApt[] = [];
  private invoices: InvoiceItem[] = [];
  private profile = { ...initialPatientProfile };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (
          e.key === STORAGE_KEY_UPCOMING ||
          e.key === STORAGE_KEY_PAST ||
          e.key === STORAGE_KEY_INVOICES ||
          e.key === STORAGE_KEY_PROFILE
        ) {
          this.load();
          this.notify();
        }
      });
      window.addEventListener(PATIENT_DB_EVENT, () => {
        this.load();
        this.notify();
      });
    }
  }

  private init() {
    if (typeof window === 'undefined') {
      this.upcoming = [...defaultUpcomingApts];
      this.past = [...defaultPastApts];
      this.invoices = [...defaultInvoices];
      this.profile = { ...initialPatientProfile };
      return;
    }
    this.load();
  }

  private load() {
    try {
      const up = localStorage.getItem(STORAGE_KEY_UPCOMING);
      this.upcoming = up ? JSON.parse(up) : [...defaultUpcomingApts];
      if (!up) this.persistUpcoming();

      const ps = localStorage.getItem(STORAGE_KEY_PAST);
      this.past = ps ? JSON.parse(ps) : [...defaultPastApts];
      if (!ps) this.persistPast();

      const inv = localStorage.getItem(STORAGE_KEY_INVOICES);
      this.invoices = inv ? JSON.parse(inv) : [...defaultInvoices];
      if (!inv) this.persistInvoices();

      const prof = localStorage.getItem(STORAGE_KEY_PROFILE);
      this.profile = prof ? JSON.parse(prof) : { ...initialPatientProfile };
      if (!prof) this.persistProfile();
    } catch {
      this.upcoming = [...defaultUpcomingApts];
      this.past = [...defaultPastApts];
      this.invoices = [...defaultInvoices];
      this.profile = { ...initialPatientProfile };
    }
  }

  private persistUpcoming() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_UPCOMING, JSON.stringify(this.upcoming));
    }
  }

  private persistPast() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PAST, JSON.stringify(this.past));
    }
  }

  private persistInvoices() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(this.invoices));
    }
  }

  private persistProfile() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(this.profile));
    }
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PATIENT_DB_EVENT));
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  // --- APPOINTMENTS API ---
  public getUpcoming(): UpcomingApt[] {
    return [...this.upcoming];
  }

  public getPast(): PastApt[] {
    return [...this.past];
  }

  public getNextAppointment(): UpcomingApt | null {
    const valid = this.upcoming.filter((a) => a.status !== 'Cancelled');
    return valid.length > 0 ? valid[0] : null;
  }

  public addAppointment(data: Omit<UpcomingApt, 'id'> | UpcomingApt): UpcomingApt {
    const newId = 'id' in data && data.id ? data.id : `APT-${Math.floor(100 + Math.random() * 900)}`;
    const newApt: UpcomingApt = {
      ...data,
      id: newId,
      status: data.status || 'Confirmed',
    };
    this.upcoming = [newApt, ...this.upcoming];
    this.persistUpcoming();
    this.notify();
    return newApt;
  }

  public rescheduleAppointment(
    id: string,
    newDateStr: string,
    newTimeSlot: string
  ): UpcomingApt | null {
    const idx = this.upcoming.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const dateObj = new Date(newDateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthStr = months[dateObj.getMonth()] || 'NOV';
    const dayStr = String(dateObj.getDate()).padStart(2, '0');
    const dayOfWeek = days[dateObj.getDay()] || 'Day';

    const updated: UpcomingApt = {
      ...this.upcoming[idx],
      month: monthStr,
      day: dayStr,
      timeSlot: newTimeSlot,
      fullDate: `${dayOfWeek}, ${newDateStr} • ${newTimeSlot}`,
      status: 'Confirmed',
    };

    this.upcoming[idx] = updated;
    this.persistUpcoming();
    this.notify();
    return updated;
  }

  public cancelAppointment(id: string): boolean {
    const idx = this.upcoming.findIndex((a) => a.id === id);
    if (idx === -1) return false;

    // Filter out or mark cancelled
    this.upcoming = this.upcoming.filter((a) => a.id !== id);
    this.persistUpcoming();
    this.notify();
    return true;
  }

  // --- BILLING API ---
  public getInvoices(): InvoiceItem[] {
    return [...this.invoices];
  }

  public getOutstandingBalance(): number {
    return this.invoices
      .filter((i) => i.status === 'Pending')
      .reduce((sum, i) => sum + i.patientAmount, 0);
  }

  public payInvoice(invoiceId: string, paymentMethod = 'Visa •••• 4092'): InvoiceItem | null {
    const idx = this.invoices.findIndex((i) => i.id === invoiceId);
    if (idx === -1) return null;

    const paidInv: InvoiceItem = {
      ...this.invoices[idx],
      status: 'Paid',
      paymentMethod,
      transactionRef: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    this.invoices[idx] = paidInv;
    this.persistInvoices();

    // Increment deductible met
    this.profile.insurance.deductibleMet = Math.min(
      this.profile.insurance.deductibleTotal,
      this.profile.insurance.deductibleMet + paidInv.patientAmount
    );
    this.persistProfile();

    this.notify();
    return paidInv;
  }

  public payAllPendingInvoices(paymentMethod = 'Visa •••• 4092'): number {
    let totalSettled = 0;
    this.invoices = this.invoices.map((inv) => {
      if (inv.status === 'Pending') {
        totalSettled += inv.patientAmount;
        return {
          ...inv,
          status: 'Paid',
          paymentMethod,
          transactionRef: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
        };
      }
      return inv;
    });

    this.persistInvoices();

    this.profile.insurance.deductibleMet = Math.min(
      this.profile.insurance.deductibleTotal,
      this.profile.insurance.deductibleMet + totalSettled
    );
    this.persistProfile();

    this.notify();
    return totalSettled;
  }

  public getProfile() {
    return { ...this.profile };
  }

  // --- OFFICIAL STATEMENT / RECEIPT HTML GENERATION ---
  public downloadInvoiceHtml(inv: InvoiceItem) {
    const patientName = this.profile.name || 'Ananya Verma';
    const patientId = this.profile.id || 'PT-84920';
    const totalFee = (inv.insuranceCovered + inv.patientAmount).toFixed(2);
    const txnRef = inv.transactionRef || 'TXN-8492019';
    const isPaid = inv.status === 'Paid';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dental Statement - ${inv.id}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #f8fafc;
      padding: 40px 20px;
      margin: 0;
    }
    .invoice-card {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .header {
      background: #005c65;
      color: #ffffff;
      padding: 32px;
      position: relative;
    }
    .clinic-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .clinic-sub {
      font-size: 13px;
      opacity: 0.85;
      margin-top: 4px;
    }
    .badge-paid {
      position: absolute;
      top: 32px;
      right: 32px;
      background: #10b981;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-pending {
      position: absolute;
      top: 32px;
      right: 32px;
      background: #f59e0b;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .content {
      padding: 32px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .box {
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #f1f5f9;
      font-size: 13px;
    }
    .label {
      color: #64748b;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 4px;
      display: block;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 13px;
    }
    th {
      background: #f1f5f9;
      padding: 12px;
      text-align: left;
      font-weight: 700;
      color: #475569;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    .total-row {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      border-top: 2px solid #e2e8f0;
    }
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 20px 32px;
      font-size: 12px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #005c65;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-card { box-shadow: none; border: none; max-width: 100%; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <h1 class="clinic-title">SMILE CLINIC DENTAL CORPORATION</h1>
      <div class="clinic-sub">Center for Oral Surgery, Orthodontics & Restorative Health</div>
      <div class="${isPaid ? 'badge-paid' : 'badge-pending'}">${isPaid ? 'PAID IN FULL' : 'PAYMENT DUE'}</div>
    </div>
    <div class="content">
      <div class="grid">
        <div class="box">
          <span class="label">Billed To (Patient)</span>
          <strong>${patientName}</strong><br>
          Patient ID: ${patientId}<br>
          Primary Insurance: Delta Dental Premier
        </div>
        <div class="box">
          <span class="label">Statement Meta</span>
          <strong>Invoice Ref: ${inv.id}</strong><br>
          Service Date: ${inv.date}<br>
          Attending Clinician: ${inv.dentist}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>CDT Code</th>
            <th>Procedure Description</th>
            <th style="text-align:right">Total Fee</th>
            <th style="text-align:right">Insurance</th>
            <th style="text-align:right">Patient Copay</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>${inv.procedureCode}</code></td>
            <td><strong>${inv.description}</strong></td>
            <td style="text-align:right">$${totalFee}</td>
            <td style="text-align:right; color:#10b981">-$${inv.insuranceCovered.toFixed(2)}</td>
            <td style="text-align:right"><strong>$${inv.patientAmount.toFixed(2)}</strong></td>
          </tr>
          <tr class="total-row">
            <td colspan="4" style="text-align:right; padding-top:16px;">Total Patient Balance:</td>
            <td style="text-align:right; padding-top:16px; color:#005c65;">$${inv.patientAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="box" style="margin-top:20px;">
        <span class="label">Payment & Security Authorization</span>
        Method: <strong>${inv.paymentMethod || 'Visa •••• 4092'}</strong><br>
        Transaction Ref: <code>${txnRef}</code><br>
        Status: <strong style="color:${isPaid ? '#10b981' : '#f59e0b'}">${isPaid ? 'Settled & Reconciled' : 'Pending Authorization'}</strong>
      </div>
    </div>
    <div class="footer">
      <div>
        <strong>Smile Clinic Central Hospital</strong> • 742 Evergreen Suite • (555) 349-8821
      </div>
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmileClinic_Statement_${inv.id.replace('#', '')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export const patientDB = new PatientStore();

export function usePatientDB() {
  const [upcoming, setUpcoming] = useState<UpcomingApt[]>(() => patientDB.getUpcoming());
  const [past, setPast] = useState<PastApt[]>(() => patientDB.getPast());
  const [invoices, setInvoices] = useState<InvoiceItem[]>(() => patientDB.getInvoices());
  const [outstandingBalance, setOutstandingBalance] = useState<number>(() =>
    patientDB.getOutstandingBalance()
  );
  const [profile, setProfile] = useState(() => patientDB.getProfile());

  const refresh = useCallback(() => {
    setUpcoming(patientDB.getUpcoming());
    setPast(patientDB.getPast());
    setInvoices(patientDB.getInvoices());
    setOutstandingBalance(patientDB.getOutstandingBalance());
    setProfile(patientDB.getProfile());
  }, []);

  useEffect(() => {
    const unsubscribe = patientDB.subscribe(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const addAppointment = useCallback(
    (apt: Omit<UpcomingApt, 'id'> | UpcomingApt) => patientDB.addAppointment(apt),
    []
  );

  const rescheduleAppointment = useCallback(
    (id: string, date: string, time: string) => patientDB.rescheduleAppointment(id, date, time),
    []
  );

  const cancelAppointment = useCallback(
    (id: string) => patientDB.cancelAppointment(id),
    []
  );

  const payInvoice = useCallback(
    (id: string, method?: string) => patientDB.payInvoice(id, method),
    []
  );

  const payAllPendingInvoices = useCallback(
    (method?: string) => patientDB.payAllPendingInvoices(method),
    []
  );

  const downloadInvoiceHtml = useCallback(
    (inv: InvoiceItem) => patientDB.downloadInvoiceHtml(inv),
    []
  );

  const nextAppointment = upcoming.filter((a) => a.status !== 'Cancelled')[0] || null;

  return {
    upcoming,
    past,
    invoices,
    outstandingBalance,
    profile,
    nextAppointment,
    addAppointment,
    rescheduleAppointment,
    cancelAppointment,
    payInvoice,
    payAllPendingInvoices,
    downloadInvoiceHtml,
  };
}
