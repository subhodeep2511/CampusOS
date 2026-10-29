# CampusOS — Academic Workspace & Student Success Planner

## Project synopsis
CampusOS is a responsive academic workspace prototype built with HTML5, CSS3, and vanilla JavaScript. Beyond storing sample records, it demonstrates rule-based academic action briefs, attendance what-if calculations, timetable conflict detection, validated assessment entry, and downloadable reports. The prototype uses fictional data and browser-local persistence.


## Problem statement
Academic information is often spread across different systems or manually maintained records. Students and faculty can benefit from a single, understandable workspace for viewing attendance, coursework, assessment results, and timetable information.

## Aim
To design and implement a responsive academic workspace prototype using HTML, CSS, and JavaScript that demonstrates academic record workflows, client-side data management, and visual analytics.

## Objectives
1. Design a consistent, responsive user interface.
2. Display subject-wise attendance and minimum-threshold status.
3. Create and manage assignment records.
4. Record assessment scores and calculate percentages and grades.
5. Display a weekly timetable and prevent overlapping sessions.
6. Visualize attendance and assessment summaries.
7. Persist demo data locally and support data export.
8. Apply form validation and basic accessibility practices.

## Modules
- Overview dashboard and transparent academic action brief
- Attendance what-if planner
- Overview dashboard
- Attendance management
- Assignment management
- Marks and results
- Timetable
- Analytics
- Settings and data export

## Technology
- HTML5 for structure and forms
- CSS3 for layout, responsive styling, and visual components
- Vanilla JavaScript for state management, validation, rendering, and interaction
- Browser localStorage for prototype persistence

## Scope and limitations
The current implementation is a single-user front-end prototype. It is not an authenticated or multi-user system and must not be used to store confidential or official academic data. The seeded dataset is fictional sample data. A production implementation would require a backend, database, authentication, authorization, server-side validation, audit logging, backups, and institutional review.

## Important implementation note
The current build is a front-end prototype. The action brief uses explicit rules (such as a recorded attendance rate below 75%, a pending deadline within three days, or a subject average below 60%). It does not use machine learning or claim to predict student outcomes. Attendance-planner calculations assume accurate class totals and no further absences beyond the scenario being calculated.

## Testing checklist
- [ ] Open the app in a desktop browser.
- [ ] Open the navigation on a narrow screen.
- [ ] Record present and absent attendance and check totals.
- [ ] Try a score greater than its maximum; confirm validation prevents it.
- [ ] Add a class that overlaps an existing class on the same day; confirm it is rejected.
- [ ] Add, edit, search, filter, submit, and reopen an assignment.
- [ ] Add and delete an assessment result.
- [ ] Export JSON and CSV files.
- [ ] Refresh the page and verify changes persist.
- [ ] Reset demo data and verify the original records return.
- [ ] Inspect the browser console for errors.

## Viva questions to prepare
1. What is the DOM, and how does JavaScript manipulate it?
2. Why use semantic HTML elements?
3. What is the difference between `let`, `const`, and `var`?
4. How do event listeners work?
5. What is event delegation and why is it used here?
6. What is JSON serialization?
7. What are the advantages and limitations of localStorage?
8. How are attendance percentages calculated?
9. How does the timetable overlap check work?
10. Why is client-side validation insufficient for production security?
11. How would you convert this into a full-stack application?
12. How would you protect student records and implement roles securely?
