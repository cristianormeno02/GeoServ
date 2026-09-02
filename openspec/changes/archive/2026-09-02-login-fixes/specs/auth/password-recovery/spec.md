## Purpose
Lets users recover access to their accounts by requesting a password reset.

## ADDED Requirements

### Requirement: Password Recovery Request
The system SHALL provide a way for users to request a password reset via email.
#### Scenario: Requesting password reset
- **WHEN** the user clicks "Olvidé contraseña", enters their email, and submits the form
- **THEN** the system sends a password recovery email to the provided address (if it exists in the system) and displays a confirmation message.
