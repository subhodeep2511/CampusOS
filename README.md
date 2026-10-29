# CampusOS — Academic Workspace & Student Success Planner

CampusOS is a responsive front-end prototype for an academic workspace. It combines attendance, assignments, internal assessment results, a weekly timetable, analytics, and a transparent rule-based academic action brief in one application.

## What makes this version more than a dashboard?

- **Attendance what-if planner:** calculates how many consecutive classes are needed to reach a selected attendance target, or the mathematical absence buffer when the target is already met.
- **Transparent academic action brief:** highlights attendance below the reference threshold, overdue or near-due assignments, and low recorded assessment averages. Each insight shows the rule that triggered it.
- **Timetable conflict detection:** rejects overlapping class intervals on the same weekday and requires end time to be later than start time.
- **Assessment validation:** validates score against the maximum, computes percentages, and groups results into simple grade bands.
- **Practical exports:** download a JSON snapshot of the workspace and a CSV academic report.
- **Responsive, keyboard-aware UI:** navigation, visible focus indicators, skip link, dialog labels, and reduced-motion support.
- **No build tools required:** HTML5, CSS3, and vanilla JavaScript.

## Run locally

### Option A — Open directly

1. Extract `CampusOS_Project.zip`.
2. Open the `CampusOS` folder.
3. Double-click `index.html`.

### Option B — Recommended local server

1. Open the folder in VS Code.
2. Open Terminal → New Terminal.
3. Run:

```bash
python -m http.server 8000
```

4. Open `http://localhost:8000` in your browser.

Or install the VS Code **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

## Project structure

```text
CampusOS/
├── index.html              # Application structure and forms
├── styles.css              # Design system and responsive layouts
├── app.js                  # UI logic, calculations, validation, persistence
├── favicon.svg             # Project mark
├── ARCHITECTURE.md         # Data model, formulas, design rationale
├── TEST_PLAN.md            # Manual functional test cases
├── PROJECT_REPORT_NOTES.md # Report outline and viva prompts
└── README.md               # Setup and usage
```

## Demo data and persistence

The first launch loads fictional sample records from `defaultData()` in `app.js`. User changes are saved as JSON in browser `localStorage` under `campusos-demo-v1`. Export downloads the current data; Reset demo restores the seeded records.

## Important limitations

This is a single-user client-side prototype, not a production university information system. It has no backend, real login, server-side authorization, multi-user synchronization, or official institutional data. Browser storage is not appropriate for confidential student records. The performance comparison in the overview is explicitly illustrative, not a measured class average. Academic insights use simple visible rules; they are not validated predictions and should not be treated as automated academic decisions.

## Suggested viva topics

- Semantic HTML, form labels, and DOM manipulation
- CSS Grid, Flexbox, responsive media queries, and design tokens
- Event listeners and event delegation
- JSON serialization and `localStorage`
- Attendance and assessment calculations
- Interval overlap detection for timetable conflicts
- Input validation and why client-side validation is not a security boundary
- Accessibility, keyboard navigation, and meaningful data visualization
- How to evolve the prototype into a secure API-backed application

## Research-informed design choices

The layout prioritizes important metrics before detailed records, keeps chart labels and units clear, uses consistent status cues, and includes responsive and accessibility considerations. See the project report notes and architecture document for the implementation rationale and limitations.

Further reading:

- Government Analysis Function, [Data visualisation: testing dashboards for design and accessibility](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-testing-dashboards-for-design-and-accessibility/)
- MDN, [Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)
- OWASP, [HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)

## Recommended next milestone

Add a backend API and relational database, then implement real authentication, server-side role-based authorization, audit logging, automated tests, and a deployment pipeline. Do not process real student records until security and institutional requirements have been addressed.
