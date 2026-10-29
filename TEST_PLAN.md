# CampusOS manual test plan

Run the app from `http://localhost:8000` or VS Code Live Server. Start with the seeded demo data and reset between test groups when needed.

| ID | Area | Action | Expected result |
|---|---|---|---|
| T01 | Launch | Open `index.html` in a current browser | Dashboard loads with no blank screen; sample cards and navigation are visible |
| T02 | Navigation | Open each sidebar item | Correct view appears; breadcrumb and active navigation item update |
| T03 | Responsive | Resize to a narrow mobile viewport | Sidebar can be opened and closed; cards stack; controls remain usable |
| T04 | Attendance | Record a present class | Classes held and attended both increase by one; percentage is recalculated |
| T05 | Attendance | Record an absent class | Classes held increases by one; attended count stays unchanged; percentage decreases |
| T06 | Attendance planner | Select a subject and target | Result shows current rate and a mathematically calculated attendance plan |
| T07 | Assignment | Add an assignment with required fields | Assignment appears in the list and pending count updates |
| T08 | Assignment | Search and filter assignments | Only matching records are displayed; tab counts remain consistent with all records |
| T09 | Assignment | Mark pending work as done, then reopen | Status changes between Pending and Submitted |
| T10 | Assessment | Add a valid score | Result appears and summary metrics update |
| T11 | Assessment | Enter score greater than maximum | Browser validation prevents submission or the app reports the invalid score |
| T12 | Timetable | Add a valid class | Class appears on the selected weekday |
| T13 | Timetable | Add a class overlapping an existing session on the same day | Submission is rejected with a clear message |
| T14 | Timetable | Enter end time earlier than start time | Submission is rejected |
| T15 | Analytics | Export academic report | CSV downloads and includes attendance and assessment rows |
| T16 | Data export | Export workspace | JSON downloads and contains the current profile and records |
| T17 | Persistence | Add a record, refresh the page | Record remains for the same browser origin |
| T18 | Reset | Reset demo data | Confirmation is shown and seeded records are restored |
| T19 | Keyboard | Tab through navigation and form controls | Focus is visible; controls can be activated with keyboard |
| T20 | Console | Inspect DevTools console while using main flows | No uncaught JavaScript errors |

## Test evidence to capture for submission

Capture your own screenshots after running the project:

1. Overview dashboard with academic action brief.
2. Attendance table and what-if planner showing a real calculation.
3. Assignment creation or filtering.
4. Timetable overlap validation message.
5. Analytics report or downloaded CSV opened in a spreadsheet editor.
6. Responsive layout in browser device emulation.

Do not claim tests passed until you have run them on your own machine.
