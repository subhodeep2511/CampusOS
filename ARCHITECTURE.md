# CampusOS architecture

## Architecture overview

CampusOS is intentionally implemented as a no-build front-end project for a Web Programming course. The current version has three main layers:

1. **Presentation** — `index.html` defines semantic page structure and form controls; `styles.css` defines design tokens, layout, responsive behavior, and focus states.
2. **Application logic** — `app.js` handles navigation, rendering, form validation, data calculations, event delegation, exports, and user feedback.
3. **Prototype persistence** — `localStorage` saves the demo state for the current browser origin. The sample dataset is initialized by `defaultData()`.

```text
User action
    ↓
HTML form / button
    ↓
Event handler in app.js
    ↓
Validate input and update in-memory data
    ↓
Persist JSON to localStorage
    ↓
Re-render affected view and announce result
```

## Main data entities

- **Profile**: display name, programme, academic session.
- **Subject**: ID, name, code, faculty, classes held, classes attended, display color.
- **Assignment**: ID, title, subject, due date, status, description, priority.
- **Assessment**: ID, assessment title, subject, date, score, maximum score.
- **Class session**: ID, weekday, start time, end time, subject, room, display color.
- **Attendance log**: subject ID, date, and present/absent result for newly recorded classes.

The sample records are fictional. The current UI does not claim that these are official records or that it has multiple authenticated users.

## Key calculations

### Attendance percentage

`attendance % = classes attended / classes held × 100`

If the target rate is `t` as a decimal, current attended count is `A`, and classes held is `H`, the number of consecutive classes that must be attended to reach the target is:

`n = max(0, ceil((t × H − A) / (1 − t)))`

This assumes every future class is attended and that the underlying totals are accurate.

The maximum number of additional absences while staying at or above a target is calculated as:

`m = max(0, floor(A / t − H))`

This is a mathematical boundary, not advice to skip classes. Institutions may apply rounding, condonation, lab-specific rules, or other requirements.

### Timetable overlap

For sessions on the same weekday, intervals `[startA, endA)` and `[startB, endB)` overlap when:

`startA < endB AND endA > startB`

The form also requires the end time to be later than the start time.

### Assessment percentage

`assessment % = score / maximum score × 100`

The input is rejected when the score is negative or greater than the maximum score.

## Design rationale

- The dashboard puts high-value summary information first and moves detailed records to dedicated views.
- Labels and text accompany status colors so color is not the only signal.
- Layout uses CSS Grid and Flexbox with breakpoints for smaller screens.
- Forms use native input types and HTML constraint validation, enhanced with application-specific checks.
- The application includes visible focus indicators, a skip link, dialog labels, and reduced-motion handling.
- Academic insights state their trigger rules so the user can inspect why an item was raised.

## Production evolution

A production version should replace browser storage with a backend API and relational database, authenticate users, enforce role-based access on the server, validate every request server-side, record audit events, implement backups and retention rules, and obtain institutional approval before processing real student data. Client-side role or visibility checks alone are not security controls.
