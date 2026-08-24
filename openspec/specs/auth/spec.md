# Auth Specification

## Purpose
This capability manages user authentication, routing defaults (e.g. redirection to login), and session handling including silent background refresh for users who opt into "Remember me".

## Requirements

### Requirement: Default Navigation
When a user navigates to the root URL (`/`), the application MUST redirect them to the `/login` route by default if they are not authenticated.
- **Scenario: Accessing root unauthenticated**
  - **WHEN** user accesses `http://localhost:4200/` without an active session
  - **THEN** system immediately loads the login page. No blank page is displayed.

### Requirement: Session Expiration Notification & Redirection
When an API request returns a `401 Unauthorized` status (indicating an invalid or expired token) and the session cannot be refreshed, the system MUST notify the user, clear the session state, and redirect to the login page.
- **Scenario: Token expires without refresh ability**
  - **WHEN** user makes an API request and receives a 401 response and refresh is not possible
  - **THEN** system notifies the user ("Su sesión ha finalizado"), clears local session state, and redirects to the `/login` screen without the application hanging or failing silently.

### Requirement: "Remember Me" Background Refresh
If a user selects the "Remember me" option during login, the system MUST attempt to silently refresh their session when the access token expires.
- **Scenario: Successful silent refresh**
  - **WHEN** a `401 Unauthorized` response occurs and "Remember me" is active
  - **THEN** system triggers a background request to obtain a new access token (using the refresh token). Upon success, the original failed request is retried seamlessly.
- **Scenario: Failed silent refresh**
  - **WHEN** a `401 Unauthorized` response occurs and "Remember me" is active but the refresh token itself is expired or invalid
  - **THEN** system falls back to the Session Expiration Notification & Redirection behavior.
