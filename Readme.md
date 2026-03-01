# Kaam — Multi-Society Task Management Platform

> A comprehensive admin + member platform for university societies to manage teams, tasks, members, and operations — built with Next.js 14, TypeScript, and Tailwind CSS. Supabase integration planned for Phase 2.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| UI Components | Radix UI (Dialog, Tabs, DropdownMenu, etc.) |
| Icons | Lucide React |
| Theme | next-themes (Dark / Light mode) |
| State (mock) | React Context (`MockDataContext`) |
| Backend (planned) | Supabase (Auth, DB, Storage, Realtime) |
| Deployment | Vercel |

---

## 🏗️ Project Structure

```
app/
├── login/               # Login page (email + password)
├── signup/              # Sign-up with referral code flow
├── dashboard/           # Member-facing dashboard
│   ├── page.tsx         # Overview / home
│   ├── board/           # Kanban task board
│   ├── team/            # My Team page (NEW)
│   ├── profile/         # Member profile & stats
│   └── settings/        # User preferences
├── admin/               # Society admin panel
│   ├── page.tsx         # Admin overview
│   ├── users/           # Member management + pending approvals
│   ├── teams/           # Team management (Manage + Create modals)
│   ├── society/         # Society profile & details
│   ├── settings/        # Admin settings
│   └── chat/            # Chat placeholder (Under Construction)
├── super/               # Super admin (platform-level)
│   ├── page.tsx         # Super overview
│   ├── societies/       # Society registry with rich cards
│   ├── admins/          # Admin access management
│   └── users/           # Global user database
├── context/
│   └── MockDataContext.tsx  # Centralized mock data store
components/
├── ui/                  # Reusable UI component library
└── ...
```

---

## 👤 User Roles & Access

### 1. **Regular Member** (`/dashboard`)
- View overview, Kanban task board, personal profile, and settings
- **My Team page** — see team identity, all members, team leads, and recent activity
- All data scoped to their assigned society and team

### 2. **Society Admin / Office Bearer** (`/admin`)
- **Overview** — Society-level stats and quick actions
- **User Management** — Approve / reject sign-up requests; view active members; invite new users via link or referral code; delete users from `...` dropdown
- **Teams Management** — View all teams as rich cards; **Create New Team** modal (name, type, color, leads); **Manage Team** modal with two tabs:
  - *Members & Roles* — Add/remove members, make/demote leads
  - *Team Settings* — Rename team, change accent color, assign HR/Point of Contact, archive team
- **Society Details** — Edit society name, description, contact email, website
- **Settings** — Admin preferences
- **Chat** — Under Construction page with dynamic WhatsApp link pulled from society data

### 3. **Super Admin** (`/super`)
- **Overview** — Platform-wide stats
- **Societies Registry** — Rich stat cards (members, boards, tasks, activity level); **Register Organization** dialog (name, acronym, type, president, email, color); **Edit Profile** per society (name, description, email, website, WhatsApp group link, status toggle) via `...` menu or "Edit Profile" button
- **Admins** — Admin cards with role + scope; **Make Admin** dialog (select registered user → assign role → link to society)
- **Global Users** — Full searchable user table across all societies; delete from `...` dropdown

---

## 🔐 Test Credentials

| Role | Email | Password |
|---|---|---|
| Regular User | `user@test.com` | `user123` |
| Society Admin | `admin@test.com` | `admin123` |
| Super Admin | `super@test.com` | `super123` |

---

## 📦 Mock Data Layer (`MockDataContext`)

All data is currently managed in a React Context at `app/context/MockDataContext.tsx`. This is intentionally designed to be **drop-in replaced with Supabase** queries in Phase 2.

### Current Data Entities

| Entity | Fields |
|---|---|
| `Society` | id, name, acronym, members, status, description, email, website, **whatsapp** |
| `GlobalAdmin` | id, name, email, role, scope |
| `AppUser` | id, name, email, society, joined, role, team, status |
| `PendingUser` | id, name, email, society, time, status |
| `Team` | id, name, members, leads[], color, type |

### Available Actions

| Action | Description |
|---|---|
| `addSociety` | Register a new society |
| `updateSociety` | Edit society profile (name, description, email, website, whatsapp, status) |
| `addAdmin` | Grant admin access to a user |
| `addUser` | Add a new approved member |
| `removeUser` | Delete a user from the platform |
| `approvePendingUser` | Move pending → active with role + team |
| `rejectPendingUser` | Remove from pending queue |
| `addTeam` | Create a new team |

---

## 🎨 UI Features & Design

- **Dark / Light mode** toggle with persistent preference
- **Collapsible sidebar** on both admin and dashboard layouts
- **Accent color system** — each team and society has a selectable accent color (Rose, Blue, Emerald, Amber, Violet, Fuchsia)
- **Rich stat cards** — societies and teams shown as detailed cards with member counts, boards, tasks, and activity indicators
- **Dropdown menus** (Radix `DropdownMenu`) for contextual row actions
- **Tabbed modals** (Radix `Tabs`) for complex management UIs like Manage Team
- **Referral / Invite system** — copy full invite link or referral code only
- **Hover-reveal actions** — action buttons fade in on row hover for a clean table look
- **Full-width layouts** — Society Details and Settings pages use the full screen width on large displays

---

## 📋 Implemented Feature Checklist

### Auth & Access
- [x] Login page with role-based redirect
- [x] Signup with approval flow + referral codes
- [x] Super / Admin / Member route separation
- [x] Logout on all sidebars

### Member Dashboard (`/dashboard`)
- [x] Overview with stats and task summaries
- [x] Kanban board with drag-and-drop columns
- [x] **My Team page** — team card, leads section, members list, recent activity
- [x] Profile page with performance metrics
- [x] Settings / preferences

### Admin Panel (`/admin`)
- [x] Admin overview dashboard
- [x] Pending user approvals (Accept / Reject)
- [x] Active user management with `...` dropdown (Edit Role, **Delete User**)
- [x] Invite modal — full link copy + referral code copy
- [x] Teams grid with Create Team dialog (name, type, color, leads)
- [x] Manage Team modal — Members & Roles tab + Team Settings tab
- [x] Society Details page (full-width on large screens)
- [x] Admin Settings page (full-width on large screens)
- [x] Chat placeholder — Under Construction UI with dynamic WhatsApp link

### Super Panel (`/super`)
- [x] Platform overview
- [x] Society registry with **rich stat cards** (members, boards, tasks, activity)
- [x] Register Organization dialog (full form with color picker)
- [x] **Edit Society Profile** dialog per card (name, desc, email, website, WhatsApp, status)
- [x] Admin cards — role + society scope display
- [x] **Make Admin** dialog — pick user + assign role + link to society
- [x] Global user table with search + avatars + `...` Delete dropdown

---

## 🗺️ Roadmap

### Phase 1 — UI & Mock Layer ✅ (Current)
- Full admin, super, and member UIs in Next.js
- MockDataContext for all CRUD operations
- All dialogs, modals, dropdowns, and flows functional

### Phase 2 — Supabase Integration (Next)
- Replace MockDataContext with real Supabase queries
- Supabase Auth (email + password, RBAC via middleware)
- Row Level Security policies per role
- Real-time team/task updates via Supabase Realtime
- Storage for profile pictures and task attachments
- Actual invite/referral code validation on signup

### Phase 3 — Advanced Features
- Analytics dashboard (completion rates, team performance)
- Attendance tracking system
- Calendar view for events and deadlines
- Push notifications (PWA)
- AI-powered task summaries
- Gamification / leaderboards

---

## 🗄️ Planned Database Schema (Supabase)

```sql
users          -- Auth integration, profile info
societies      -- id, name, acronym, description, email, website, whatsapp, status
teams          -- id, society_id, name, color, type
society_members-- id, user_id, society_id, role
team_members   -- id, team_id, member_id, position, is_lead
tasks          -- id, society_id, team_id, assigned_to, title, description, status, deadline, priority
task_submissions-- id, task_id, submitted_by, text_submission, link_submission, submitted_at
invites        -- id, society_id, email, referral_code, status, invited_by, created_at
notifications  -- id, user_id, message, read, created_at
events         -- id, society_id, title, date
attendance     -- id, society_id, member_id, event_id, status
```

---

## ⚙️ Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📝 Notes

- All data mutations happen in-memory via `MockDataContext` — **a full page refresh resets all data**. This will be resolved when Supabase is integrated.
- The WhatsApp link on the Chat page is pulled dynamically from the first active society's `whatsapp` field — set it via Super Admin → Edit Society Profile.
- CSS linting warnings for `@custom-variant`, `@theme`, and `@apply` in `globals.css` are expected — these are Tailwind v4 directives and can be safely ignored.