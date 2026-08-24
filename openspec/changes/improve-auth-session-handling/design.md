# Design: Improve Auth Session Handling & Routing

## Approach

### 1. Default Route Redirect
- Modify the Angular application's main routing module (`app-routing.module.ts` or equivalent).
- Add or update the default route configuration (`path: ''`) to redirect to `/login` (e.g., `{ path: '', redirectTo: '/login', pathMatch: 'full' }`).
- Optionally, if an Auth Guard is present, it can check if the user is already authenticated and redirect to the dashboard instead.

### 2. Session Expiration Handling
- Implement or update an Angular HTTP Interceptor (`auth.interceptor.ts`).
- Catch `401 Unauthorized` responses from the API.
- When a 401 is detected:
  - Display a notification to the user (e.g., using a Toast or Snackbar component) informing them that their session has expired.
  - Clear the local session data (token, user info).
  - Redirect the user to the `/login` route using the Angular `Router`.

### 3. "Remember Me" Functionality
- **Frontend changes**:
  - Store a `rememberMe` flag in `localStorage` when the user logs in with the option checked.
  - If a refresh token mechanism is available from the backend, store the refresh token in an HttpOnly cookie or `localStorage`.
- **Backend changes** (assumed, if not already implemented):
  - Provide a `/refresh-token` endpoint.
  - Return short-lived access tokens and longer-lived refresh tokens.
- **Silent Refresh Flow**:
  - In the HTTP Interceptor, when a `401 Unauthorized` occurs, check if `rememberMe` is true and a refresh token exists.
  - If yes, intercept the failed request, call the `/refresh-token` endpoint to get a new access token.
  - If the refresh succeeds, update the stored access token and retry the original failed request.
  - If the refresh fails (refresh token expired), proceed with the session expiration handling (notify and redirect to login).

## Alternatives Considered
- Instead of intercepting 401s, we could set a timer based on the JWT expiration claim (e.g., `exp`). However, intercepting 401s is generally more robust as it handles token invalidation on the server side as well.
