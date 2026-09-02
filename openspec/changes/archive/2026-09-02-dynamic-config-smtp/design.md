# Design: Dynamic Configuration Tabs and SMTP Integration

## System Architecture Updates

### Database (Prisma/TypeORM/SQL)
- Add the `group` field to the `EmpresaConfiguraciones` entity/model.
- Run a migration to populate this field.

### Backend (Node.js/Express/NestJS etc.)
- **Config Service**: Add a method `getSmtpConfig()` that filters `EmpresaConfiguraciones` by `group = 'correo avisos'`.
- **Mailer Service**: Inject the Config Service. When `sendPasswordRecoveryEmail()` is called, retrieve SMTP settings, instantiate a dynamic Nodemailer transporter (or similar), and send the email.

### Frontend (React/Vue/Angular etc.)
- **State Management**: Group the fetched configuration array into a map or object keyed by the `group` string.
- **UI Components**:
  - `Tabs`: A new component to render the tab headers.
  - `TabPanel`: Renders the configuration form fields for the currently active tab.
