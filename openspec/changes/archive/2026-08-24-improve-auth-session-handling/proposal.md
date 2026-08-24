# Proposal: Improve Auth Session Handling & Routing

## What
1. **Default Route Redirect**: Automatically redirect users from the default route (`/`) to the login page (`/login`) if they are not authenticated.
2. **Session Expiration Handling**: When the JWT token expires and API calls fail, notify the user that their session has expired and redirect them to the login page.
3. **"Remember Me" Functionality**: Implement a mechanism so that if the user checked "Remember me" during login, their session is seamlessly refreshed in the background without requiring manual re-authentication.

## Why
- Currently, navigating to `http://localhost:4200/` results in a blank page, causing confusion. The user should be correctly routed to `/login`.
- When a token expires, the application silently fails API calls without any visual feedback. The user is unaware that their session ended, leading to a poor user experience.
- Users who opt for "Remember me" expect their session to persist across visits or beyond the standard token lifetime. Implementing silent token refresh will provide a seamless experience.
