# Proposal: Dynamic Configuration Tabs and SMTP Integration

## What
1. **Dynamic Configuration Groups**: Add a new `group` column to the `EmpresaConfiguraciones` table.
2. **Tabbed UI**: Update the frontend configuration view to dynamically group settings into tabs based on the new `group` column.
3. **SMTP Integration**: Update the backend to read SMTP configuration (grouped under "correo avisos") from the `EmpresaConfiguraciones` table to send password recovery emails.

## Why
- The `EmpresaConfiguraciones` table currently stores all settings in a flat list. Adding a `group` column will allow grouping related settings.
- The UI needs to be updated to present these grouped settings in a more organized, tabbed interface to improve user experience.
- The backend needs to utilize the existing SMTP settings to enable the password recovery email functionality, which is currently disconnected.

## Scope
- Database schema update for `EmpresaConfiguraciones`.
- Backend API adjustments to group/fetch configurations.
- Frontend UI overhaul for the settings page to use tabs.
- Backend mailer service integration to use SMTP settings for password recovery.
