# Thycare Lab - User Guide

## 🎨 UI Overview

### Color Scheme
- **Primary**: Blue (#3b82f6) - Professional and trustworthy
- **Success**: Green (#10b981) - Completed actions
- **Warning**: Orange (#f59e0b) - Pending states
- **Danger**: Red (#ef4444) - Errors/Critical
- **Background**: Light gray (#f8fafc) - Clean workspace

---

## 👥 User Roles & Access

### 1. Admin User
**Full Access to All Features:**
- ✅ Dashboard with financial metrics
- ✅ Patient management (Add, View, Edit)
- ✅ Test result entry
- ✅ PDF report generation
- ✅ Profile Manager (Add/Edit test profiles)
- ✅ Test Master (Manage individual tests)
- ✅ Financial Management
- ✅ Expense tracking
- ✅ Settings configuration

### 2. Staff User
**Limited Access:**
- ✅ Staff Dashboard (no financial data)
- ✅ Patient management (Add, View)
- ✅ Test result entry
- ✅ PDF report generation
- ❌ No Profile Manager access
- ❌ No Test Master access
- ❌ No Financial Management access
- ❌ No Settings access

---

## 📱 Pages & Features

### 🏠 Dashboard

#### Admin Dashboard
**Location**: `/`

**Features:**
- **Statistics Cards** (4 cards):
  - Patients Today
  - Total Patients
  - Revenue This Month
  - Profit This Month

- **Quick Actions** (3 buttons):
  - Add Patient → Navigate to patient form
  - View Patients → Navigate to patient list
  - Enter Results → Navigate to results page

- **Recent Patients List**:
  - Shows last 5 patients
  - Click to view patient details

**UI Elements:**
- Large stat cards with icons (64px)
- Color-coded metrics
- Hover effects with border highlighting
- Responsive grid layout

#### Staff Dashboard
**Location**: `/`

**Features:**
- Same as Admin but WITHOUT financial metrics
- Shows only patient-related statistics
- Limited quick actions

---

### 👤 Add Patient Page

**Location**: `/patients/add`

**UI Design:**
- Modern sectioned form layout
- Two main sections with icons
- Responsive 2-column grid (1 column on mobile)

**Section 1: Personal Information**
- **Full Name** * (required)
  - Text input with User icon
  - Auto-focused on page load
  - Placeholder: "Enter patient's full name"

- **Age** * (required)
  - Number input with Calendar icon
  - Min: 0, Max: 150
  - Placeholder: "Age"

- **Gender** * (required)
  - Dropdown with UserCircle icon
  - Options: Male, Female, Other

- **Phone Number** * (required)
  - Tel input with Phone icon
  - Placeholder: "Enter phone number"

- **Address** (optional)
  - Text input with MapPin icon
  - Full width field
  - Placeholder: "Enter address (optional)"

**Section 2: Test Information**
- **Test Profile** * (required)
  - Dropdown with Stethoscope icon
  - Shows: Profile Name (Short Name) - ₹Price
  - Profile preview badge appears after selection
  - Displays selected profile details

- **Referred By Doctor** (optional)
  - Text input with Stethoscope icon
  - Placeholder: "Doctor name (optional)"

**Action Buttons:**
- **Cancel** (Ghost button) → Back to patient list
- **Save & Continue to Results** (Primary button with Save icon)
  - Creates patient record
  - Auto-navigates to Enter Results page

**User Flow:**
1. Fill patient details
2. Select test profile
3. Click "Save & Continue"
4. Automatically redirected to results entry

---

### 📋 Patients List

**Location**: `/patients`

**UI Features:**
- **Search Bar**:
  - Search icon on left
  - Placeholder: "Search by name or phone number..."
  - Real-time filtering
  - Focus state with blue border

- **Add New Patient Button**:
  - Top right corner
  - Primary blue with Plus icon

**Table Columns:**
1. **Patient Name**
   - Avatar circle with initial
   - Full name displayed

2. **Age/Gender**
   - Format: "25 yrs / Male"

3. **Phone**
   - Monospace font
   - Format: Displayed as entered

4. **Test Profile**
   - Color badge with short name
   - Blue background badge

5. **Registered Date**
   - Format: "17 Nov 2025"
   - Local date format

6. **Status**
   - Badge with color coding:
     - 🟠 Registered (Orange)
     - 🔵 Results Entered (Blue)
     - 🟢 Completed (Green)

7. **Actions**
   - **View** button (Outline style with Eye icon)
   - Navigates to patient details

**Empty State:**
- Large User icon (64px, gray)
- "No patients found" heading
- "Add your first patient to get started" message
- Primary "Add Patient" button

**Interactions:**
- Hover on rows → Background changes to light gray
- Click View button → Navigate to patient details

---

### 🔬 Enter Results Page

**Location**: `/results/enter/:patientId`

**Page Header:**
- Back to Patients button (Ghost style with Arrow icon)

**1. Patient Info Card**
- **Gradient Background** (Blue)
- **White text**
- **Grid Layout** with 4 items:
  - Patient Name
  - Age/Gender (e.g., "25 yrs • Male")
  - Phone
  - Test Profile (Badge style)

**2. Sample Timestamps Card**
- **3 Timestamp Fields** (All datetime-local inputs):

  a. **Blood Collection Time** * (Required)
     - Clock icon
     - Red asterisk for required
     - Format: DD/MM/YYYY HH:MM

  b. **Lab Received Time** * (Required)
     - Clock icon
     - Red asterisk for required
     - Format: DD/MM/YYYY HH:MM

  c. **Report Generated Time** (Optional)
     - Clock icon
     - Auto-filled on PDF generation
     - Can be manually set
     - Format: DD/MM/YYYY HH:MM

**3. Test Results Table**
- **Responsive table** with horizontal scroll on mobile

**Table Columns:**
- **Test Name**
  - Test name in bold
  - Category label below (smaller, gray)
  
- **Result Value**
  - Input field (type varies by test):
    - Number input (for numeric tests)
    - Text input (for text tests)
    - Dropdown (for selection tests)
    - Disabled field (for calculated tests)
  - Focus state: Blue border with shadow
  
- **Unit**
  - Gray text
  - Display only
  
- **Reference Range**
  - Gray text
  - Gender-specific when applicable
  
- **Status**
  - Badge appears for abnormal values:
    - 🔴 HIGH (Red badge)
    - 🔵 LOW (Blue badge)
    - Empty for NORMAL values

**Row Highlighting:**
- Normal rows: White background
- Abnormal rows: Light red background (rgba(239, 68, 68, 0.05))
- Hover: Light gray background

**Auto-Save Feature:**
- Saves every 2 seconds automatically
- Indicator at bottom: "Auto-saving..." with animated clock icon

**Action Buttons:**
- **Save Results** (Secondary gray button with Save icon)
  - Saves current state
  - Shows success toast
  
- **Generate PDF Report** (Primary blue button with FileText icon)
  - Validates timestamps first
  - Shows error if timestamps missing
  - Updates patient status to "Completed"
  - Navigates to patient details

**Validation Rules:**
- Cannot generate PDF without Blood Collection Time
- Cannot generate PDF without Lab Received Time
- Test values validated against reference ranges
- Abnormal values highlighted automatically

**User Flow:**
1. View patient info
2. Enter Blood Collection Time
3. Enter Lab Received Time
4. Fill test results in table
5. Values auto-validate (show HIGH/LOW badges)
6. Click "Generate PDF Report"
7. System validates timestamps
8. PDF generated and patient marked complete
9. Redirect to patient details

---

### 📄 Patient Details

**Location**: `/patients/:id`

**Page Header:**
- Back to Patients button (Ghost style)

**Patient Information Card**
- **Grid Layout** with icon cards
- Each info item has:
  - Colored icon circle (40px)
  - Label (uppercase, small, gray)
  - Value (large, bold)

**Information Displayed:**
1. Full Name (User icon)
2. Age (Calendar icon)
3. Gender (UserCircle icon)
4. Phone Number (Phone icon)
5. Address (MapPin icon) - if available
6. Test Profile (Stethoscope icon)
7. Referred By (Stethoscope icon) - if available
8. Registered On (Calendar icon) - with date/time
9. Status (FileText icon) - color-coded badge

**Conditional Actions:**

**If Status = "Registered":**
- **Enter Test Results** button (Primary, full width)
  - Navigates to results entry page

**If Results Available:**
- **Report Actions Card** with 3 buttons:
  
  a. **Download PDF** (Primary blue)
     - Downloads report to computer
     - Shows loading state
     - Success toast on completion
  
  b. **Print Report** (Secondary gray)
     - Opens print dialog
     - Shows loading state
     - Success toast
  
  c. **Share via WhatsApp** (Success green)
     - Opens WhatsApp with report
     - Uses patient phone number
     - Shows loading state
     - Success/error toast

**User Flow:**
1. View patient details
2. If registered → Enter results
3. If completed → Download/Print/Share report

---

### ⚙️ Admin Pages (Admin Only)

#### Profile Manager
**Location**: `/admin/profiles`

**Features:**
- Create test profiles (e.g., Kidney Function Test)
- Add tests to profiles
- Set profile pricing
- Edit existing profiles
- Activate/Deactivate profiles

**UI:**
- Profile list with cards
- Add Profile button
- Edit buttons on each profile

#### Test Master
**Location**: `/admin/tests`

**Features:**
- Manage individual tests
- Set test parameters:
  - Test name
  - Unit
  - Reference ranges
  - Gender-specific ranges
  - Test type (Number, Text, Dropdown)
- Organize by category
- Activate/Deactivate tests

**UI:**
- Categorized test list
- Add Test button
- Edit/Delete options

#### Financial Management
**Location**: `/financial`

**Features:**
- Revenue tracking
- Expense management
- Profit/Loss reports
- Pricing manager

**Sub-pages:**
- Expense Management
- Profit & Loss Report
- Pricing Manager

---

## 🔄 Complete User Workflows

### Workflow 1: New Patient Registration & Testing

**Steps:**
1. **Dashboard** → Click "Add Patient"
2. **Add Patient Page**:
   - Fill patient details
   - Select test profile
   - Click "Save & Continue to Results"
3. **Enter Results Page** (Auto-navigated):
   - Enter Blood Collection Time
   - Enter Lab Received Time
   - Fill all test values
   - Values auto-validate
   - Click "Generate PDF Report"
4. **Patient Details Page** (Auto-navigated):
   - View complete patient info
   - Download/Print/Share report

### Workflow 2: View Existing Patient

**Steps:**
1. **Dashboard** → Click "View Patients"
2. **Patients List**:
   - Search for patient (optional)
   - Click "View" button
3. **Patient Details**:
   - View all information
   - Perform actions based on status

### Workflow 3: Complete Pending Results

**Steps:**
1. **Patients List** → Find patient with "Registered" status
2. Click "View"
3. **Patient Details** → Click "Enter Test Results"
4. **Enter Results Page**:
   - Complete timestamps
   - Fill test values
   - Generate PDF

### Workflow 4: Reprint/Share Report

**Steps:**
1. **Patients List** → Find patient with "Completed" status
2. Click "View"
3. **Patient Details**:
   - Click "Download PDF" or
   - Click "Print Report" or
   - Click "Share via WhatsApp"

---

## 🎯 Button Types & Actions

### Primary Buttons (Blue)
- Add New Patient
- Save & Continue to Results
- Generate PDF Report
- Download PDF
- Enter Test Results

### Secondary Buttons (Gray)
- Save Results
- Print Report
- Back navigation

### Success Buttons (Green)
- Share via WhatsApp

### Outline Buttons
- View (in patient list)

### Ghost Buttons
- Cancel
- Back to Patients
- Navigation buttons

---

## 📱 Responsive Behavior

### Desktop (> 768px)
- Multi-column grids
- Side-by-side layouts
- Horizontal action buttons
- Full table visibility

### Mobile (≤ 768px)
- Single column forms
- Stacked buttons
- Scrollable tables
- Collapsed grids
- Touch-friendly targets (min 44px)

---

## ✨ UI Interactions

### Hover Effects
- Buttons: Slight lift (translateY -1px)
- Cards: Border color change
- Table rows: Background change
- Patient items: Slide right effect

### Focus States
- Inputs: Blue border + shadow glow
- Buttons: Outline visible
- Links: Color change

### Loading States
- Buttons show spinner
- Disabled during action
- "Generating..." text

### Validation
- Real-time for test values
- Required fields marked with *
- Error messages via toast
- Visual feedback (red border)

---

## 🔔 Notifications (Toast)

### Success (Green)
- "Patient added successfully!"
- "Results saved successfully!"
- "Report generated!"
- "PDF downloaded successfully!"

### Error (Red)
- "Please fill Blood Collection and Received times"
- "Failed to generate PDF"
- "No test results available"

### Info (Blue)
- "Opening print dialog..."
- "Auto-saving..."

---

## 🎨 Visual Hierarchy

### Typography Scale
- **Headings**: 2rem (32px) → 1.125rem (18px)
- **Body**: 0.9375rem (15px)
- **Small**: 0.875rem (14px)
- **Tiny**: 0.75rem (12px)

### Spacing Scale
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px

### Border Radius
- **Small**: 6px (badges)
- **Medium**: 10px (buttons, inputs)
- **Large**: 14px (cards)
- **Full**: 9999px (pills, avatars)

---

## 🔐 Access Control Summary

| Feature | Admin | Staff |
|---------|-------|-------|
| Dashboard | ✅ Full | ✅ Limited |
| Add Patient | ✅ | ✅ |
| View Patients | ✅ | ✅ |
| Enter Results | ✅ | ✅ |
| Generate PDF | ✅ | ✅ |
| Profile Manager | ✅ | ❌ |
| Test Master | ✅ | ❌ |
| Financial | ✅ | ❌ |
| Settings | ✅ | ❌ |

---

This guide covers all pages, UI elements, user flows, and features in the Thycare Lab application.
