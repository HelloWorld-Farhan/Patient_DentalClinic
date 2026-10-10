# Smile Clinic — Patient Portal (Patient_DentalClinic)

A modern, responsive, HIPAA-compliant patient web portal built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Features

- **Authentication & Registration**:
  - Secure Patient Portal login with Patient ID / Email, remember device, passkey authentication, and Verified Health ID / NHS shortcuts.
  - 3-Step Patient Registration wizard (Personal Details, Dental History & Insurance, Security Verification) with real-time password strength validation.
  - Password recovery flow with simulated SMS/Email verification.
- **Patient Dashboard**:
  - Personalized greeting with priority check-in reminder and next scheduled visit banner.
  - Animated 92% Oral Health Score circular gauge.
  - Quick action shortcuts (Book Appointment, View 3D X-Rays, Pay Copay, Oral Care Tips).
  - Active Treatment Progress Tracker (Laser Whitening 100%, Invisalign 30% Aligner 6 of 20 with 22hr reminder).
  - Recent visit history table with summary modal.
- **Appointment Scheduling**:
  - Real-time scheduled visits view with doctor information and location details.
  - Interactive "Book New Appointment" modal (procedure, doctor, date, and available time slot selector).
  - Sync to device calendar, reschedule visit, and cancellation workflows with feedback toasts.
  - Past appointment history with dynamic search filter.
- **Dental Records & Imaging Archive**:
  - Interactive 32-tooth odontogram (Upper Arch 1-16 & Lower Arch 32-17) with anatomical names, restoration statuses (Crown, Watch, Healthy), and inspection notes.
  - Chronological doctor consultation notes with prescribed treatments and medications.
  - High-resolution imaging archive (Panoramic X-Ray, Bitewings, Cephalometric scan) with full-screen lightbox viewer featuring zoom and DICOM export simulation.
- **Billing & Insurance**:
  - Delta Dental Premier policy status card with interactive annual deductible progress meter ($350 / $500 met).
  - Outstanding copay statement badge ($45.50 Due) with instant "Pay Balance" modal.
  - Itemized statement and payment history table with instant PDF receipt download simulation.
- **Settings & Profile**:
  - Personal contact details and emergency contact editor.
  - Dental insurance subscriber and policy editor with card upload simulation.
  - Communication preferences (SMS reminders, Email summaries).
  - Security settings (2FA toggle, passkey configuration).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🛡️ Vercel Deployment
The project includes a `vercel.json` file configured with SPA rewrites to ensure direct links and browser page refreshes never return a 404 error:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📂 Repository
- **GitHub**: [https://github.com/HelloWorld-Farhan/Patient_DentalClinic](https://github.com/HelloWorld-Farhan/Patient_DentalClinic)
