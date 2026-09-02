# Tasks

## Phase 1: Database and Backend Config
- [x] Update `EmpresaConfiguraciones` database schema/model to include a `group` text column.
- [x] Create a database migration script to add the column and set default values (e.g., 'General').
- [x] Create a database migration script to update existing SMTP-related configuration rows to have `group = 'correo avisos'`.
- [x] Update backend config retrieval endpoints to expose the `group` field.

## Phase 2: SMTP Integration
- [x] Implement `getSmtpConfig()` in the backend configuration service.
- [x] Update the Mailer/SMTP service to dynamically instantiate its connection using the fetched settings for 'correo avisos'.
- [x] Update the password recovery flow to utilize this dynamic Mailer service.
- [x] Test password recovery email sending locally.

## Phase 3: Frontend UI
- [x] Update the configuration API client to parse the new `group` field.
- [x] Implement a Tabs UI component on the settings page.
- [x] Group the settings dynamically based on the `group` field and render them within their respective tabs.
- [x] Ensure saving configurations still works correctly with the new grouped state.
