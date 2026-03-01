# 👑 Super Admin (Global) Documentation

The Super Admin is the platform's highest authority, responsible for the overall maintenance of organizations and administrative access control.

---

## 📂 Managed Pages & Workings

### 1. Societies Registry (`/super/societies`)
The primary engine for onboarding and modifying organizations.
- **Register New Society:** Requires Name, Acronym, President's Name, and Contact Email.
- **Visual Branding:** Includes a **Society Logo Upload** (with drag-and-drop or file browsing) and **Accent Color Picker** (Violet, Rose, Blue, etc.).
- **Society Cards:** Displays real-time stats (Members count, active Board count, total Tasks, and calculated Activity level).
- **Edit Profile:** Super Admins can update any society's metadata (Description, Website, WhatsApp group link, Status).

### 2. Administrator Access (`/super/admins`)
A dedicated control panel for managing the people who run the platform.
- **Admin Table:** Displays all administrators with their Name, Email, Role, and Scope.
- **Statistics Strip:** Shows Total Admins, count of Super Admins vs. Society Admins, and total registered Societies.
- **Search & Filter:** Find admins instantly by name or email.
- **Revoke Access:** Super Admins can delete administrative privileges.
  - **Security Rule:** "Revoke Access" is disabled for Global/Super Admins to prevent a total platform lockout.

### 3. User Central Registry (`/super/users`)
A high-level view of every registered user across all affiliated organizations.
- **Multi-Society Logic:** Users can belong to multiple societies; these are displayed as colored chips on their profile.
- **Society Filter:** Allows filtering the entire user base to see members of a specific society only.
- **User Management:** Super can view joining dates, current status, and primary teams.

---

## 🔑 Core Logic & Security
- **Global Scope:** Super Admins bypass any organization-level restrictions (RLS).
- **Admin Escalation:** Only Super Admins can promote a standard User to a Global Admin.
- **Platform Health:** The "Registry" view gives the Super Admin a "God-eye" view of which organizations are highly active vs. inactive.
