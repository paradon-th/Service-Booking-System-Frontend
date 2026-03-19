# Migration Task List

> Master checklist for migrating the Angular iCube console to the Next.js + shadcn stack. Update this file as tasks are completed or re-prioritised.

## 1. Platform Foundations
- [ ] Confirm runtime stack (Node ≥18, Bun, strict mode) across local/CI and document setup script
- [ ] Harden global layout: header, sidebar, theme customiser, responsive breakpoints, keyboard shortcuts
- [ ] Finalise navigation metadata (`lib/auth/navigation.ts`) and permission mapping to service functions
- [ ] Review authentication flow (login, refresh, logout, password reset) against backend contract and add integration tests
- [ ] Implement global error / loading boundaries for `(app)` and `(public)` routes
- [ ] Configure ESLint/Prettier/Turbo caching and ensure lint/format scripts run in CI
- [ ] Set up shared utilities: fetching layer, toast wrapper, date/time helpers, number/locale helpers
- [ ] Document environment variables / secrets required for API access in README

## 2. API & Data Contracts
- [ ] Automate OpenAPI client generation (scripts/generate-api.sh) with version pin + CI guard
- [ ] Map legacy Angular services to new client modules; list missing endpoints or gaps
- [ ] Define data mappers/adapters for each feature (DTO → UI model) and house in `lib/services/*`
- [ ] Establish error normalisation strategy for API routes (success, validation, auth failure) and update BFF handlers
- [ ] Create mock fixtures for offline/unit testing (Tag, TagRelation, ValueEditor, etc.)

## 3. Global State & Permission Handling
- [ ] Finalise permission store shape (`store/permission-store.ts`) and add optimistic refresh strategy
- [ ] Implement role/permission caching (revalidation rules) and logout invalidation
- [ ] Provide reusable `PermissionGate` variants (read-only, CRUD button guard, field-level guard)
- [ ] Audit every feature route to ensure required `ServiceFunction` IDs are declared

## 4. Core Feature Modules

### 4.1 Overview
- [ ] Rebuild dashboard cards (Factory, Server, Services, Charts) with responsive layout, skeletons, and KPI parity
- [ ] Port SignalR/WebSocket hooks (live status, event counts) or queue polling fallback
- [ ] Implement chart widgets (API latency, error trend) with date range + tooltip support
- [ ] Add drill-down links to relevant modules and permission-based visibility of cards
- [ ] Provide factory/server selector controls mirroring Angular behaviour

### 4.2 Data → Value Editor (`/data/editor`)
- [ ] Implement tag list pane with filters, debounce search, status badges, and PrimeNG-style paginator parity
- [ ] Replicate tag detail panel (description, type, last updated) and ensure permission gate per tag
- [ ] Port historical value grid: pagination, sortable columns, quality/status badges, timezone conversion
- [ ] Recreate modals:
  - [ ] Add value (support numeric/string/bool, timestamp validation, quality/status dropdown)
  - [ ] Edit value (inline + modal) with change log
  - [ ] Delete value (single + bulk)
  - [ ] CSV upload workflow (preview invalid rows, delimiter detection, append vs replace, error messaging)
- [ ] Implement toolbar actions: time range picker (epoch + datetime), TOP/LAST toggle, auto refresh interval, export CSV/Excel, sample file download
- [ ] Wire to TagValueService endpoints (list/create/update/delete/import/export) and normalise error responses
- [ ] Provide optimistic update or targeted refetch after mutations to keep table state
- [ ] Add loading/error skeletons and empty states consistent with Angular UX

### 4.3 Data → Value Relation Editor (`/data/relation-editor`)
- [ ] Build relation selector with search, identity filters, hypertable/view label, permission guard
- [ ] Port dynamic column grid driven by relation schema; include identity chips, status columns, timezone handling
- [ ] Recreate value CRUD modals with schema-driven form generation (per column type) + CSV upload validation
- [ ] Implement execute preview for SQL/view mode and display dynamic result set with pagination
- [ ] Support limit selector (100/500/…), TOP/LAST toggle, auto refresh, export actions
- [ ] Hook into TagRelationValueService (list/query/insert/update/delete/import) with consistent error mapping
- [ ] Provide optimistic update or refetch behaviour similar to Angular (temp table, highlight updates)
- [ ] Add empty/loading/error states and maintain stopwatch indicators used in legacy app

### 4.4 Tag → Tag Config (`/tag/configuration`)
- [x] Create CRUD form using shadcn components (drawer → dialog) with conditional validation mirroring Angular rules (tagSource/tagMode/interface combos)
- [ ] Ensure tag form validators cover: tagName (3-50 chars), description (≤450), subDescription (≤255), period range (0-1e6), tagSubscribe (Event mode), equation/evaluate requirements, interface-specific fields
- [ ] Add interface-specific helpers (Modbus read test, OPC DA/UA preview, evaluate button)
- [ ] Implement tag/data permission matrix with user/group search, owner auto-selection, and read-only owner row
- [ ] Recreate toolbar actions (export, copy metadata, refresh server info) and global search sorter (A-Z, newest, etc.)
- [ ] Wire SSR/CSR data loading with pagination, search, and service function guard
- [ ] Write unit/integration tests for form submission, validation branches, and BFF routes

### 4.5 Tag → Tag Relation Config (`/tag/relation-configuration`)
- [x] Build relation form with field mapping editor, view/hypertable toggles, validators (name pattern, forbidden words, unique column names)
- [ ] Add identity mapping editor (source tag selector, set identity flags) with drag-and-drop ordering and validation
- [ ] Recreate tag/data permission assignment with default owners and duplicate prevention
- [ ] Implement SQL script execution preview, hypertable/view switches, and script validation flags
- [ ] Support CSV import/export, sample template generation, and dynamic column preview tables
- [ ] Integrate TagRelationService/API envelope mapping and add unit tests for BFF handlers

### 4.6 Interface → Interface Config (`/interface/configuration`)
- [ ] Port interface list view with filters (type/status), card badges, and permission guard
- [ ] Rebuild interface create/edit wizard for each protocol (Modbus Serial/TCP, OPC DA/UA, MQTT, DB, REST, SharePoint, iCube)
  - [ ] Mirror field validators (IP/port ranges, namespace patterns, credential requirements)
  - [ ] Support encryption public key retrieval + copy
  - [ ] Persist schedule/alert toggles and advanced settings
- [ ] Implement interface testing actions: connectivity test, read value preview per protocol
- [ ] Recreate interface mapping subpages (mapping builder, schedule actions) or split into dedicated routes
- [ ] Handle bulk actions (enable/disable, delete) and confirm dialogs
- [ ] Wire to InterfaceService endpoints, including pagination and update flows

### 4.7 Integration → Provider / Publisher
- [ ] Build provider table with enable/disable toggles, copy URL button, status badges, filter/search
- [ ] Recreate provider detail drawer (webhook URLs, credentials, rate limit, allowed IPs)
- [ ] Rebuild publisher mapping forms for Tag/TagRelation (field mapping, scheduler actions, validation)
- [ ] Handle token/API key generation workflow, confirmation dialogs, and secret masking
- [ ] Add activity/status indicators (last sync, error count) and background job feedback
- [ ] Ensure permission guard per integration feature and connect to IntegrationService endpoints

### 4.8 Trigger → Scheduler Config (`/scheduling/configuration`)
- [ ] Implement scheduler list with cron display, filters (status/type), and enable/disable toggles
- [ ] Port scheduler form: name/description validators, cron editor, natural language expression, timezone support
- [ ] Recreate action mapping UI (Tag/TagRelation target selection, payload mapping, validation)
- [ ] Hook up test execution / dry-run, highlight validation errors returned by backend
- [ ] Ensure permission checks (create/modify/delete) per scheduler + service function guard
- [ ] Prepare monitoring view (`/scheduling/monitoring`) with logs timeline, run history, filter controls

### 4.9 Trigger → Event Config (`/event/configuration`)
- [ ] Reconstruct event rule list with status toggles, type filters, permission guard
- [ ] Implement rule editor: name/description validators, trigger conditions (tag thresholds, scheduler link), action assignment
- [ ] Support multi-step condition builder (AND/OR groups) mirroring Angular UI
- [ ] Add notification/integration hooks (email, webhooks, provider triggers) per legacy behaviour
- [ ] Wire to EventService endpoints and handle validation/errors

### 4.10 Logs (`/log/*`)
- [ ] Build individual pages for Application/System/Security/Error with shared layout + tabs
- [ ] Implement filters: date range (absolute/relative), severity level, keyword search, service source
- [ ] Provide infinite scroll/virtualised list with row actions (expand details, copy payload)
- [ ] Add export/download (CSV/Excel) and print view if required
- [ ] Ensure permission gating per log type & integrate with SecurityService limits API
- [ ] Handle log retention messaging and empty states

### 4.11 Security (`/security/*`)
- [ ] User management: list with filters, create/edit forms (validators, password reset), group assignment modal, permission guard
- [ ] Group management: list, member add/remove (user search), permission matrix, bulk operations
- [ ] Role & Permission: service-function matrix editor, inheritances, audit log of changes
- [ ] Token provider: list with status, create/update token w/ expiry validation, revoke/delete workflow, download secret
- [ ] Align validation/error messaging with backend rules and ensure all operations check service functions
- [ ] Add import/export (if legacy supports) or document alternative flows

## 5. Cross-cutting UX
- [ ] Ensure consistent dialog/modal behaviour (focus trap, ESC/enter shortcuts, scroll lock, restore focus)
- [ ] Provide global notification strategy (sonner) with standard success/failure/info patterns
- [ ] Implement dark/light theme parity, store preference, and sync with system
- [ ] Audit accessibility: ARIA roles, keyboard navigation, form labels, colour contrast, screen-reader announcements
- [ ] Establish responsive breakpoints + mobile behaviour for drawers/menus based on legacy UX
- [ ] Add global loading indicator and page-level skeleton patterns

## 6. Testing & Quality
- [ ] Establish Playwright/Cypress suite for critical flows (auth, tag CRUD, scheduler, data editor uploads)
- [ ] Add Jest/RTL unit tests for hooks, permission logic, conditional validators, API transforms
- [ ] Set up MSW or mock server for API stubbing during tests and storybook scenarios
- [ ] Configure CI pipeline (lint, typecheck, test, build) with caching and secret management
- [ ] Track performance metrics (Next.js middleware logging, Core Web Vitals, API latency dashboards)
- [ ] Define regression test checklist for migration sign-off per module

## 7. Deployment & Ops
- [ ] Define build outputs & Docker image (if required) for Next app, including bun/Node versions
- [ ] Document deployment steps (env vars, reverse proxy config, static assets, SSL certs)
- [ ] Plan feature flag/rollback strategy during phased migration and parallel-run period
- [ ] Set up monitoring/logging dashboards for Next app + BFF routes; update operational runbooks
- [ ] Coordinate data migration/backfill steps if necessary (e.g., new collections)

## 8. Migration Readiness Checklist
- [ ] Verify parity for each legacy route (functionality + permissions) with sign-off checklist per module
- [ ] Conduct UAT with domain users per feature module (Data, Tag, Interface, Integration, Security, etc.)
- [ ] Prepare training materials/screenshots/quick-start guides for new UI
- [ ] Schedule production switchover, communicate downtime, and define backup/rollback procedure
- [ ] Capture open issues/known gaps and plan post-cutover iteration
