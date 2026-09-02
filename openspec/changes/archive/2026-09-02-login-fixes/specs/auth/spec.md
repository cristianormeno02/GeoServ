## ADDED Requirements

### Requirement: Welcome Message Personalization
The system SHALL display a personalized welcome message on the login screen using the company name derived from the workspace or subdomain.
#### Scenario: Personalized login title
- **WHEN** the user accesses the login page for a specific tenant/company
- **THEN** the title displays "Ingresa a tu cuenta de {Empresa}" instead of a generic text.

### Requirement: Front-end Login Validation
The system SHALL validate the presence of both email and password before attempting to authenticate.
#### Scenario: Missing credentials
- **WHEN** the user clicks "Ingresar" without filling out both email and password
- **THEN** the system displays a clear message indicating which fields are missing and prevents the API request from being sent.

### Requirement: Login Failure Feedback
The system SHALL provide accurate and appropriately styled feedback when authentication fails, and MUST restore the login button state.
#### Scenario: Incorrect credentials
- **WHEN** the user attempts to log in with invalid credentials (resulting in a 401 response during login)
- **THEN** the system displays an error message indicating that the credentials are incorrect (instead of "El usuario ha finalizado su sesión").
#### Scenario: Error message styling
- **WHEN** a login error occurs
- **THEN** the alert message is displayed using the established error color (red) and not the success color.
#### Scenario: Button state restoration
- **WHEN** a login attempt fails
- **THEN** the "Ingresar" button's text is restored from "Ingresando..." back to its original state and is re-enabled.
