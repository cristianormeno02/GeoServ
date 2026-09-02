# Spec: Dynamic Configuration Tabs and SMTP Integration

## 1. Database Changes
- Table: `EmpresaConfiguraciones`
- New Column: `group` (Type: String/Varchar, Nullable: False, Default: 'General')
- Data Migration: Ensure existing records are assigned a default group, and SMTP-related settings are migrated to the 'correo avisos' group.

## 2. API / Backend Updates
- The settings fetch endpoint must include the `group` field in its response.
- The mailer service must be updated. Instead of hardcoded or ENV variables for SMTP, it should query `EmpresaConfiguraciones` for keys related to SMTP where group is 'correo avisos'.
- The password recovery flow must instantiate the mailer using these dynamically fetched SMTP settings.

## 3. Frontend / UI Changes
- The settings page must group the fetched configurations by the `group` property.
- Implement a tabbed navigation interface, where each tab corresponds to a unique group name.
- Within each tab, render the inputs for the settings belonging to that group.
