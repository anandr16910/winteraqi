# WinterAQI quality baseline

This document records the initial repository review and the staged plan for making
WinterAQI testable, reproducible, secure, and maintainable.

## Current baseline

Reviewed on 2026-11-24 against the `main` branch.

### Repository and automation

- The repository has frontend and backend package manifests, but no committed
  npm lockfiles were found.
- Frontend dependencies include `latest` version selectors. The root
  `concurrently` dependency also uses `latest`.
- No GitHub Actions workflow was present at the time of review.
- No automated unit, integration, API, or browser test suite was found.
- No ESLint or Prettier configuration was found.
- The frontend package exposes a production build script, but Vite's build
  does not by itself perform a full TypeScript type-check.
- No explicit Node.js engine version is declared.

### Backend findings

- `backend/server.js` imports `node-fetch`, but `node-fetch` is not declared
  as a direct dependency in `backend/package.json`. A clean installation
  should not rely on a transitive dependency being hoisted.
- The HTTP proxy route has rate limiting. The WebSocket proxy path needs its
  own connection, message-size, concurrency, and per-client rate controls.
- The backend uses a shared proxy header value that is also embedded in
  browser-side code. Anything shipped to a browser is public and must not be
  treated as a secret or as user authentication.
- There is no dedicated automated backend test suite or explicit health-check
  test in the current baseline.

### Configuration and security

- `backend/.env.local` is tracked in the public repository. Its contents were
  inspected without reproducing values in this report.
- A local environment file should not be committed. Remove it from version
  control, provide a safe `.env.example`, and rotate any value that was intended
  to be secret. Removing a file from the latest commit does not erase its
  earlier Git history.
- The exposed browser-side proxy header is not a security boundary. The proxy
  needs an abuse-control design appropriate for a public application, including
  request limits and controls for WebSocket usage.

### AQI data correctness

- AQI generation currently depends on Gemini responses and fallback handling.
  The application needs explicit validation of pollutant ranges, AQI category
  consistency, timestamps, source attribution, and stale/error states.
- AI-generated or fallback values must not be presented as instrument readings.
  The UI should distinguish sourced observations, model estimates, and demo
  fallback data.

## Initial CI checks in this branch

The workflow added in this branch performs two smoke checks:

1. Install frontend dependencies and run the production Vite build.
2. Parse-check the backend server with Node.js.

These are baseline checks, not a complete test strategy. The workflow currently
uses a temporary install because lockfiles are absent. It must be changed to
`npm ci` after exact dependency versions and lockfiles are committed.

## Staged maintenance plan

### Phase 1 — Reproducible builds and safe configuration

- Pin the Node.js runtime and dependency versions.
- Generate and commit lockfiles for each independently installed package.
- Replace the tracked local environment file with `.env.example`.
- Remove secrets from source control and rotate exposed credentials where
  applicable.
- Replace the browser-visible shared-header assumption with appropriate
  server-side abuse controls.

### Phase 2 — Backend tests

- Extract pure validation and proxy-policy logic into testable modules.
- Add Node's built-in test runner or a chosen test framework.
- Cover URL allow-listing, request-body limits, header filtering, error paths,
  response validation, and WebSocket lifecycle handling.
- Add HTTP integration tests for health, proxy success, invalid input, and
  upstream failures.

### Phase 3 — Frontend tests and type safety

- Add a dedicated TypeScript type-check command.
- Add ESLint and Prettier with consistent repository-wide rules.
- Test AQI parsing, normalization, category mapping, fallback states, and
  source/timestamp presentation.
- Add component tests for loading, empty, stale, error, and successful states.

### Phase 4 — End-to-end and regression validation

- Add Playwright smoke tests for the main user journeys.
- Add regression fixtures for known AQI payloads and edge cases.
- Establish coverage thresholds only after meaningful tests exist.
- Add dependency and secret scanning to CI.
- Require all quality checks to pass before merging or deploying.

## Working rules

- Keep changes small and reviewable; do not rewrite the application wholesale.
- Every bug fix must include a regression test.
- Every feature must include tests for normal, invalid, and failure paths.
- Do not deploy automatically until the quality gates and rollback procedure
  are agreed.
- Record the exact commands run and their results; never describe an unrun test
  as passing.
