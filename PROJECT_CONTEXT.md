# Kaam Project Context & Progress Summary

This document serves as a high-level technical summary of the project's current state and its specific roles, permissions, and business rules.

## 🚀 Project Overview
**Kaam** is a Management System for University Societies. It provides a tiered hierarchy for managing organizations, teams, and tasks.

### Core Tech Stack
- **Next.js 14+ (App Router)** | **TypeScript** | **Tailwind CSS**
- **Radix UI** components (Dialog, Dropdown, etc.)
- **Supabase** backend transition (Ongoing)

---

## � Detailed Role & Access Hierarchy

### 1. Global (Super Admin)
- **Role:** Full platform oversight.
- **Access:** Create/Edit/Archive Societies, Manage Global Admins, View all users across all organizations.
- **Tools:** `/super/societies`, `/super/admins`, `/super/users`.

### 2. Society-Level Roles (Office Bearers)
Configured in `MockDataContext.tsx` via `OfficeBearerRole`.

| Role | Access Scope | Specific Permissions |
|---|---|---|
| **President** | **Full Society** | Access to **all teams**, manage all boards, view every user. |
| **GS / PS / Treasurer** | **Assigned Teams Only** | Access restricted to `assignedTeamIds`. Manage boards/members for those teams. |
| **Custom Positions** | **Variable** | Super or President can create custom titles (e.g., "Media Head") with assigned team IDs. |

### 3. Team-Level Roles (Board/Direct Operations)
Configured in `MockDataContext.tsx` via `TeamRole`.

| Role | Board Access | Team Management |
|---|---|---|
| **Director / DD** | Add cards, Assign tasks, Comment. | None. |
| **HR** | Add cards, Assign tasks, Comment. | **Add/Remove members** from the team. |
| **Executive** | **Comment Only**. | None. |

---

## 📋 Core Business Rules & Features

### 🏢 Societies & Users
- **Multi-Society Affiliation:** Users (`AppUser`) are linked to multiple societies via `societyIds: string[]`. Filtering is applied so admins only see users in their scope.
- **Society Registry:** Rich metadata (Name, Acronym, Contact mail, Accent color, Description, WhatsApp group link).
- **Logo Support:** Organizations have an optional `logo` field (Base64 or URL). Upload supports **Drag-and-Drop**.

### 🛠️ The "Board" System
- **Severity Stripe:** Cards display a top colored stripe: 🔴 High, 🟠 Medium, 🟢 Low.
- **Deadline Logic:** Urgent deadlines (≤2 days) turn orange; overdue turns red.
- **Task Assignment:** Cards track `assignedTo` (member name). Only Dir/DD/HR/OBs can assign tasks via a dropdown picker in the card detail modal.
- **Activity Log:** Every card has an activity feed (comments + status changes).

### 🖥️ Dashboard Logic
- **"Assigned to Me":** A primary dashboard section that automatically aggregates all board tasks across all teams where the current user is recorded as `assignedTo`.

---

## 🛠️ Supabase Transition Progress
- **Client/Server Utils:** Initialized in `lib/supabase/`.
- **Environment:** `.env.local` configured with URL, Anon Key, and Service Role (Admin).
- **Auth:** Ready for Supabase Auth integration.

## ⏭️ Immediate Roadmap
1. **Migration:** Convert `MockDataContext` state into Supabase Tables.
2. **Auth:** Move from mock identities to Supabase JWT/Auth sessions.
3. **RLS (Row Level Security):** Crucial step to enforce `society_ids` and `team_ids` scoping at the database level.
