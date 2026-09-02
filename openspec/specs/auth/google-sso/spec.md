# Google SSO Specification

## Purpose
Lets users authenticate using their Google accounts via Single Sign-On (SSO).

## Requirements

### Requirement: Google SSO Authentication
The system SHALL allow users to log in using their Google account credentials.
#### Scenario: Successful Google login
- **WHEN** the user clicks the "Iniciar sesión con Google" button and authenticates successfully with Google
- **THEN** the system creates an active session and redirects the user to the main dashboard.
