# 🏢 Society Admin & Office Bearer (OB) Documentation

Society Admins and Office Bearers are responsible for the internal governance of a specific organization and its member lifecycle.

---

## 📂 Managed Pages & Workings

### 1. Member Management (`/admin/users`)
The dedicated hub for handling society membership.
- **Pending Approvals:** Review new user requests. Admins match a user's chosen society name to the correct internal `societyId`.
- **Active Users:** A filtered table showing only members affiliated with this specific society.
- **User Actions:** Admins can Approve, Decline, or Delete users from the society scope.

### 2. Office Bearer Hierarchy (`/admin/office-bearers`)
The management of the society's leadership structure.
- **Standard Positions:** Defaults include President, General Secretary, Press Secretary, and Treasurer.
- **Scope Assignment:** Assigning which teams (by ID) each Office Bearer can manage.
- **Visuals:** Hierarchical view of who is leading which department.

### 3. Team Management (`/dashboard/team`)
The bridge between high-level society goals and day-to-day execution.
- **Team Creation:** Add new functional teams (e.g., Marketing, Tech, PR).
- **Team Visuals:** Assign brand colors and logos to specific teams.
- **Member Overview:** View all members, their calculated activity, and their specific roles (Director, HR, etc.).

---

## 🎭 Role Hierarchy & Access Control

### 1. The President
- **Scope:** "All Teams".
- **Privileges:** Has a master-view of every board in the society. Can assign tasks, join any team chat, and manage any department.

### 2. GS, PS, & Treasurer
- **Scope:** Restricted to specific `assignedTeamIds`.
- **Privileges:** They only see the dashboards/boards for the 3-4 teams they are assigned to. Within those teams, they act with full administrative authority to oversee progress.

### 3. Custom Office Positions
- The President or Super Admin can create custom boxes (e.g., "Media Head") and assign specific team scopes to them. They use the same dashboard logic as a GS or Treasurer.

---

## �️ Society-Level Rules
- **Filtering:** All data on these pages is strictly filtered by the current Admin's `societyId`.
- **Administrative Link:** These roles bridge the gap between "Super-level registry" and "Team-level execution".
