# CineGo — Security & Authorization Architecture

## 1. Security Principles

CineGo employs a defense-in-depth security model combining network isolation, credential protection, strict role-based authorization, and parameter-safe database communication.

---

## 2. Threat Modeling & Protections

### 2.1 SQL Injection Prevention
- **Threat**: Attackers injecting arbitrary SQL clauses via URL query parameters or booking forms.
- **Defense**:
  - The application strictly forbids dynamic SQL concatenation in JavaScript.
  - All calls to Oracle execute through `oracledb` using parameterized bind variables:
  ```typescript
  // SECURE: Oracle Bind Variable syntax
  const sql = `SELECT * FROM SHOWS WHERE MOVIE_ID = :movieId AND TRUNC(SHOW_DATE) = :showDate`;
  await connection.execute(sql, { movieId, showDate });
  ```
  - PL/SQL stored procedures receive strongly-typed input arguments (`NUMBER`, `VARCHAR2`, `DATE`), causing any malformed input to be rejected at compile/parse time.

### 2.2 Credential Protection
- **Threat**: Accidental leakage of Oracle Database administrative credentials or Supabase service keys.
- **Defense**:
  - Oracle credentials (`ORACLE_USER`, `ORACLE_PASSWORD`, `ORACLE_CONNECTION_STRING`) are loaded strictly on the backend via environment variables (`.env`).
  - No database connection strings or database driver instances are exposed to the browser client.
  - `SUPABASE_SERVICE_ROLE_KEY` is restricted solely to administrative server processes; the client bundle only receives `SUPABASE_ANON_KEY`.

---

## 3. Role-Based Access Control (RBAC) Matrix

The system enforces granular authorization across three distinct personas:

| Module / Action | `CUSTOMER` | `THEATRE_MANAGER` | `ADMIN` |
|---|:---:|:---:|:---:|
| Browse Movies, Theatres, & Showtimes | ✅ | ✅ | ✅ |
| Select Seats & Calculate Authoritative Pricing | ✅ | ✅ | ✅ |
| Create Booking & Submit Simulated Payment | ✅ | ❌ | ❌ |
| View Own Booking History & E-Tickets | ✅ | ❌ | ❌ |
| Cancel Own Reservation & Request Refund | ✅ | ❌ | ❌ |
| View Assigned Cinema Daily Schedule | ❌ | ✅ (Scoped) | ✅ |
| View Assigned Cinema Bookings (`VIEW_THEATRE_BOOKINGS`) | ❌ | ✅ (Own Only)| ✅ (Global) |
| Add / Modify / Remove Catalogue Movies (`ADD_MOVIE`, etc.) | ❌ | ❌ | ✅ |
| Schedule Showtimes & Generate Seat Pools (`CREATE_SHOW`) | ❌ | ❌ | ✅ |
| Query Global Revenue Cursor (`VIEW_BOOKING_REPORT`) | ❌ | ❌ | ✅ |
| Manage Discount Coupons & Global Settings | ❌ | ❌ | ✅ |

### Backend Middleware Enforcement:
```typescript
// Role protection middleware factory
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Unauthorized: Access restricted to ' + allowedRoles.join(', '));
    }
    next();
  };
};
```

---

## 4. Error Sanitization
Raw Oracle database internal tracebacks and ORA error numbers (e.g., `ORA-00001: unique constraint violated`) are intercepted by the global Express error middleware:
```typescript
// Sanitized user-friendly response
res.status(409).json({
  success: false,
  message: "The requested seat has already been reserved by another customer."
});
```
Internal error logs preserve the stack trace for DevOps debugging while ensuring clients receive safe, informative notifications.
