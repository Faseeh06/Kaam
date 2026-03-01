# 🚀 User & Team Operations Documentation

This section covers the workspace for the people getting the work done—Directors, HR, and Executives.

---

## 📂 Workspace Pages & Workings

### 1. Command Center (`/dashboard`)
The daily home for every member.
- **Assigned to Me:** A dynamic section pulling every task from every board where the user is listed as the `assignee`. It shows the task title, its severity (color-coded), and the due date.
- **Today's Focus:** High-priority cards are highlighted here for immediate action.
- **Stats:** Personal productivity stats (Tasks completed, active involvements).

### 2. Use-Case Board (`/dashboard/board`)
A Kanban-style workspace organizing team execution.
- **Lists & Cards:** Tasks flow from "To Do" to "Done".
- **Severity Stripes:**
  - 🔴 **High:** Critical items.
  - 🟠 **Medium:** Standard workflow.
  - 🟢 **Low:** Backlog/Maintenance.
- **Deadline Chips:**
  - **Red:** Overdue.
  - **Orange:** Due in ≤ 2 days.
- **Activity Log:** Every card tracks its own history (e.g., "Mike moved this to Review", "Alice added a comment").

---

## 🎭 Detailed Team Roles & Assignments

The Board behaves differently based on your role:

### 1. Director & Deputy Director (DD)
- **Privileges:** Can add new cards, edit descriptions, and set severity/deadlines.
- **Assignment Power:** Can **Assign Tasks to anyone** in the team, including other Directors or Executives.

### 2. HR (Human Resources)
- **Privileges:** Same Board powers as a Director (Add/Assign/Edit).
- **Team Management:** The specific user who can **Add or Remove members** from the actual team list. They bridge the gap between the society's user pool and the specific team board.

### 3. Executive (Member)
- **Privileges:** **Comment-Only**. Executives cannot create cards, move them, or assign them to others.
- **The "Assignee" Rule:** While they cannot *give* work, they can *receive* it. When a Director/HR assigns a task to an Executive, it appears on the Executive's personal dashboard for them to execute and comment on.

---

## 📋 General Rules
- **Multi-Society:** If a user is in multiple societies, their `/dashboard` will aggregate "Assigned to Me" tasks from all of their societies' respective boards.
- **Task Transparency:** Everyone in a team can see all cards on the board, but only specific roles can modify the "source of truth".
