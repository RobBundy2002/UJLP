# Security maintenance — October 31, 2026

The initial npm audit reported 77 affected packages (15 high, 51 moderate, 11 low), largely inherited from Create React App / React Scripts. The updated lockfile reports **zero known npm vulnerabilities** as of this check. This is a point-in-time advisory result, not a guarantee against future vulnerabilities.

React Scripts was replaced by Vite 8 and Vitest 5. React and the application routes remain in place. Existing `REACT_APP_*` browser configuration names, `BUILD_PATH` for isolated tests, the `build/` deployment directory, CNAME, PDF assets, and GitHub Pages deep-link recovery are preserved. The HTML entry point is now root `index.html`. Node 22.13 or newer is required; GitHub workflows use Node 22.

The CI workflow now declares `contents: read`, addressing the open `actions/missing-workflow-permissions` CodeQL finding. GitHub alerts will only update after the corrected files reach the default branch and scanners rerun; none were dismissed manually.

Validation passed: production build, 15 unit tests, database permission tests, journal reader checks, synthetic member/admin flows, accessibility scans, documentation freshness, deployment asset checks, and desktop/mobile screenshot comparisons. Existing portrait crop filenames are preserved in Vite output.

Run `npm start` to start the Vite development server on port 3000. Restart any previously running React Scripts server after this tooling change. Run `npm test`, `npm run build`, and `npm audit` to repeat the core checks.
