<h1 align="center">🦷 Patient DentalCare Portal — Confidential Health & Records System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge" alt="MIT License"/>
</p>

<p align="center">
  <strong>Patient DentalCare Portal</strong> is a modern, ultra-responsive, and HIPAA-compliant electronic dental health web application built for patients.<br/>
  It provides interactive treatment timelines, 32-tooth odontogram inspection, high-resolution DICOM radiograph exploration,<br/>
  real-time appointment booking and management, multi-step OTP verification, and instant copay payment settlement.
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Patient Overview Dashboard** | Personalized welcome banner, 92% Oral Health Score circular gauge, upcoming visit pass, 4 quick actions, active treatment progress meters (Invisalign & Whitening), and recent visit history. |
| 📅 **Appointment Management** | View upcoming appointments with doctor photos, one-click calendar sync, interactive reschedule & cancel modals, and searchable past appointment history with clinical summary viewer. |
| ➕ **Real-Time Appointment Booking** | Book new visits with treatment category selector, attending dentist choice, preferred date, time slot, and clinical symptoms notepad. |
| 🦷 **Interactive 32-Tooth Odontogram** | Universal Numbering System dental chart for upper (1–16) and lower (32–17) arches with color-coded restoration states (`Healthy`, `Crown`, `Needs Work`) and inspection detail drawer. |
| 🔬 **DICOM Imaging Archive & Lightbox** | Panoramic OPG scans, bitewings, and cephalometrics with full-screen zoomable lightbox viewer, resolution telemetry, and simulated DICOM original download. |
| 💳 **Billing & Insurance Telemetry** | Two-column bento hero featuring Current Balance card with secure checkout button, Delta Dental Premier policy stats, and deductible progress meter (`$350 / $500 met`). |
| 🧾 **Invoice History & Checkout Modal** | Searchable itemized invoice table with pending/paid filters, statement breakdown, and 256-bit encrypted card checkout modal. |
| 🔐 **Multi-Step OTP Password Reset** | 3-step security recovery: Account Identification, interactive 6-digit OTP code input with auto-focus, paste support, sample code auto-fill (`482910`), and real-time countdown timer. |
| 📝 **3-Step Patient Intake Wizard** | Personal Details & clinic chart linking, Dental History & allergy tags, and 2FA credentials with electronic digital consent signature. |
| 🛡️ **Patient Profile & Settings** | Animated 3-tab preferences center (`Personal Information`, `Notifications & Alerts`, `Security & Passkeys`) with 2FA toggle, biometric passkey configuration, and instant feedback toasts. |
| 🔔 **Notification Hub & Quick Profile** | Slide-down notification tray with category badges and unread filters. Top-right profile click navigation leading directly to Settings & Profile. |
| 📱 **100% Mobile-First Responsiveness** | All modals utilize React Portals (`z-[9999]`), `max-h-[90vh]` constraints, and scrollable bodies to guarantee flawless rendering from 320px mobile viewports to 4K displays. |

---

## 💻 How to Build (For Developers)

Before you begin, ensure you have **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended) and **npm** installed on your system.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/HelloWorld-Farhan/Patient_DentalClinic.git
cd Patient_DentalClinic
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Run Locally

```bash
npm run dev
```

> The application will be running live at `http://localhost:5173`.

### Step 4 — Build for Production

```bash
npm run build
```

> Your optimized production bundle will be generated inside the `dist/` directory.

---

## 📁 Project Structure

```text
Patient_DentalClinic/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.tsx         # Patient sidebar (4 clean links), top header, emergency triage, notifications & profile trigger
│   ├── pages/
│   │   ├── Dashboard.tsx      # Welcome hero, health score gauge, treatment progress, quick actions & visit modals
│   │   ├── Appointments.tsx   # Upcoming visit passes, calendar sync, reschedule/cancel flows & booking modal
│   │   ├── DentalRecords.tsx  # 32-tooth odontogram chart, doctor clinical notes & DICOM radiograph lightbox viewer
│   │   ├── Billing.tsx        # Balance hero, Delta Dental policy stats, deductible progress & secure checkout modal
│   │   ├── Settings.tsx       # Profile preferences, notification toggles & biometric security passkeys
│   │   ├── Login.tsx          # Patient portal sign-in, ambient clinic photo, community stats & passkey auth
│   │   ├── Signup.tsx         # 3-step registration intake (personal details, dental history & security consent)
│   │   └── ForgotPassword.tsx # 3-step password recovery (account ID, 6-digit OTP verification & password reset)
│   ├── data/
│   │   └── mockData.ts        # Comprehensive mock data (patient profile, odontogram teeth, appointments, invoices)
│   ├── types.ts               # Strict TypeScript definitions for clinical entities
│   ├── App.tsx                # Client-side router configuration with animated transitions
│   ├── main.tsx               # Application entrypoint
│   └── index.css              # Global styles, clinical design tokens & Tailwind directives
├── tailwind.config.js         # Healthcare theme extensions, custom color tokens & border radiuses
├── tsconfig.json              # TypeScript strict configuration
└── package.json               # Dependencies and scripts
```

---

## 👨‍💻 Author

**Farhan Khalid**

📧 [farhankhalid17968@gmail.com](mailto:farhankhalid17968@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/farhan-khalid-117514259/)  
🐙 [GitHub](https://github.com/HelloWorld-Farhan)

---

## 📄 License

```text
MIT License

Copyright (c) 2026 Farhan Khalid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🌟 Support

If you found this patient portal helpful, please consider giving it a ⭐ on GitHub!

<p align="center">Made with ❤️ in India</p>
