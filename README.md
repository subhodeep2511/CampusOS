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
