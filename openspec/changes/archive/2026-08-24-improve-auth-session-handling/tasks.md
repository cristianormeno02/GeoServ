# Implementation Tasks: Improve Auth Session Handling & Routing

- [x] **Task 1: Default Route Redirect**
  - Locate the main routing module (e.g., `app-routing.module.ts` or `app.routes.ts`).
  - Add or verify a route for `path: ''` that redirects to `/login`.
  - Ensure the redirect works when accessing the base URL `http://localhost:4200/`.

- [x] **Task 2: Setup HTTP Interceptor for 401 Unauthorized**
  - Create or locate the authentication interceptor.
  - Implement error handling in the interceptor to catch `HttpErrorResponse` with status `401`.
  - Add logic to clear local storage (tokens, user state) upon receiving a 401.
  - Inject the `Router` and redirect to `/login`.
  - Inject a notification service (like MatSnackBar or Toastr) to show the message: "Su sesión ha finalizado. Por favor, vuelva a ingresar."

- [x] **Task 3: Backend Support Verification & Implementation (Refresh Token)**
  - Update `User` domain model or entity to store a `RefreshToken` and `RefreshTokenExpiryTime`.
  - Create or update the EF Core Migration for the new fields.
  - Update the Login endpoint in the backend to generate and return a `refreshToken` alongside the `token`.
  - Create a new endpoint `/refresh-token` that validates the provided tokens, checks expiration, and issues a new JWT and Refresh Token.

- [x] **Task 4: Implement Silent Token Refresh (Remember Me)**
  - Update `LoginResponse` interface in `auth.service.ts` to include `refreshToken`.
  - Update the login component/service to store the `refreshToken` in `localStorage` if "Remember Me" is true.
  - In the HTTP Interceptor's 401 handler, call the backend `/refresh-token` endpoint using the stored tokens.
  - If the refresh token request succeeds:
    - Update the stored access and refresh tokens.
    - Retry the original request with the new access token.
  - If the refresh token request fails (e.g., returns 401):
    - Proceed to show the session expired message and redirect to `/login`.

- [x] **Task 5: Testing**
  - Verify that the backend migration applies correctly.
  - Test refresh token interceptor behavior manually.
