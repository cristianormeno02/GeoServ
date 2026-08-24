# Spec: Improve Auth Session Handling & Routing

## Context
This is a delta spec detailing the changes to be made to the authentication and routing system to improve the user experience around session expiration and default navigation.

## Requirements

### 1. Default Navigation
- **Behavior**: When a user navigates to the root URL (`/`), the application MUST redirect them to the `/login` route by default if they are not authenticated.
- **Acceptance Criteria**: Accessing `http://localhost:4200/` immediately loads the login page. No blank page is displayed.

### 2. Session Expiration Notification & Redirection
- **Behavior**: When an API request returns a `401 Unauthorized` status (indicating an invalid or expired token) and the session cannot be refreshed, the system MUST:
  1. Notify the user that their session has expired.
  2. Clear the local session state.
  3. Redirect the user to the `/login` page.
- **Acceptance Criteria**: The user sees a clear message (e.g., "Su sesión ha finalizado") and is taken back to the login screen without the application hanging or failing silently.

### 3. "Remember Me" Background Refresh
- **Behavior**: If a user selects the "Remember me" option during login, the system MUST attempt to silently refresh their session when the access token expires.
- **Acceptance Criteria**: 
  - A `401 Unauthorized` response triggers a background request to obtain a new access token (using a refresh token or similar mechanism).
  - If successful, the original failed request is retried seamlessly.
  - If the refresh attempt fails (e.g., the refresh token itself is expired), the system falls back to the Session Expiration Notification & Redirection behavior.
