# CineGo: Cloud-Native Full-Stack Cinema Ticket Reservation System Powered by Oracle 21c PL/SQL

## College DBMS Comprehensive Project Report

**Department of Computer Science & Engineering**  
**Course**: Database Management Systems (DBMS) Laboratory & Theory  
**Application Title**: CineGo — Your Movies. Your Seats. Your Experience.  
**Target Database**: Oracle Database 21c Express Edition (XE)  

---

## 1. Abstract

Modern digital entertainment platforms necessitate high-throughput, transactionally sound reservation architectures capable of preventing seat concurrency collisions, guaranteeing ACID integrity, and delivering instantaneous seat updates. Traditional student database projects frequently rely on trivial client-side state manipulation and basic CRUD primitives that break under concurrent conditions.

**CineGo** addresses this gap by engineering a commercial-grade, multi-tier movie booking platform. The presentation layer is built in React 18, TypeScript, and Tailwind CSS. The intermediate layer operates on Node.js and Express with parameterized Oracle connection pooling. The authoritative persistence layer is rooted in **Oracle Database 21c XE**, fully leveraging advanced PL/SQL constructs:
- 19 Normalized Relational Tables (3NF)
- 10 Auto-Increment Sequences
- 22 Stored Procedures encapsulating transactions and cursors
- 2 Authoritative Stored Functions (dynamic pricing and coupon calculus)
- 3 Autonomous Event-Driven Triggers (state machine lifecycle for bookings, payments, and releases)
- Multi-tier Role-Based Access Control (RBAC) isolating Customers, Theatre Managers, and Administrators.

---

## 2. Problem Statement & Objectives

### 2.1 Problem Statement
Cinema ticketing platforms handle time-sensitive inventory. In concurrent environments, two users attempting to purchase the same seat simultaneously will cause severe double-booking anomalies if the state is evaluated solely at the client or API layer. Furthermore, complex post-transaction side effects—such as creating tickets, updating seat availability, or processing refunds upon cancellation—must happen reliably without leaving the database in an orphaned or inconsistent state.

### 2.2 Objectives
1. Implement a complete commercial cinema ticket booking system resembling BookMyShow.
2. Ensure Oracle 21c XE remains the **authoritative single source of truth** for all transactions.
3. Eliminate double-booking hazards using Oracle ACID transaction blocks and event-driven triggers.
4. Demonstrate core DBMS competencies:
   - Stored Procedures with explicit and implicit cursors.
   - Stored Functions with dual-table calculations.
   - Database Triggers managing lifecycle transitions (`AVAILABLE` -> `BOOKED` -> `AVAILABLE`).
   - Sequence generation preventing race conditions.
   - Integrity constraints, check clauses, foreign keys, and cascading rules.
5. Provide a responsive, cinematic dark-mode user experience with interactive seat selection maps, concessions ordering, simulated payment flows, and an e-admission QR pass.

---

## 3. Technology Stack

| Layer | Technologies Employed | Rationale |
|---|---|---|
| **Client Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion | High-performance SPA with cinematic dark aesthetics, instant component reactivity, and type safety |
| **Server Backend** | Node.js, Express, TypeScript, `oracledb` Driver, Zod Validation, JWT | Parameterized query execution, robust middleware routing, and zero client exposure of database credentials |
| **Authoritative Database** | Oracle Database 21c XE, PL/SQL Engine | Enterprise transactional integrity, multi-version concurrency control, compiled stored procedures, and triggers |
| **Authentication Support** | Supabase OTP & JWT Session Tokens | Secure telephone number verification and cryptographic session verification |

---

## 4. Relational Database Design & Normalization

The schema has been fully normalized to **Third Normal Form (3NF)**:
1. **1NF**: All table columns are atomic; repeating groups are eliminated into separate child tables (e.g., individual `SEATS` in `SCREENS`, individual `FOOD_ORDERS` in `BOOKINGS`).
2. **2NF**: Every non-key attribute is fully functionally dependent on the primary key (composite key dependencies in `SHOW_SEATS` use unique constraints while retaining a synthetic sequence surrogate key).
3. **3NF**: No transitive dependencies exist. Cinema metadata resides in `THEATRES`, location details in `LOCATIONS`, and movie details in `MOVIES`.

### Complete Table Roster (19 Tables):
1. `CUSTOMERS` — User profiles, roles, and credentials.
2. `LOCATIONS` — Cities with latitude and longitude coordinates.
3. `MOVIES` — Film title, language, genre, runtime, and poster metadata.
4. `THEATRES` — Physical cinema properties and manager attribution.
5. `SCREENS` — Auditorium halls within a theatre.
6. `SEATS` — Physical seat matrix (Rows A-J, tiers: Regular, Premium, Recliner).
7. `SHOWS` — Scheduled screenings connecting movies, screens, dates, and base prices.
8. `SHOW_SEATS` — Dynamic inventory state for each seat in each show.
9. `BOOKINGS` — Master reservation records with total and discounted amounts.
10. `TICKETS` — Individual admission vouchers generated for each seat.
11. `FOOD` — Concessions food and beverage catalog.
12. `FOOD_ORDERS` — Concessions items ordered under a booking.
13. `COUPONS` — Promotional discount codes with usage limits and expiry dates.
14. `PAYMENTS` — Simulated financial payment transactions.
15. `REFUNDS` — Cancellation compensation records.
16. `REVIEWS` — Verified user star ratings and comments.
17. `FAVORITES` — Customer bookmarked movies and cinemas.
18. `NOTIFICATIONS` — User activity notifications.
19. `AUDIT_LOG` — Immutable administrative operations log.

---

## 5. PL/SQL Implementation Highlights

### 5.1 PL/SQL Stored Procedures
- `CREATE_BOOKING`: Takes `(p_customer_id, p_show_id, p_show_seat_id)`. Verifies that `SHOW_SEATS.STATUS = 'AVAILABLE'`. If available, generates a new booking using `BOOKING_SEQ.NEXTVAL` within an explicit transaction block with `COMMIT` and `ROLLBACK` handlers.
- `CANCEL_BOOKING`: Validates customer ownership, transitions `STATUS = 'CANCELLED'`, activating automated triggers.
- `CREATE_SHOW`: Admin procedure that creates the show record and executes a PL/SQL cursor loop across all seats in the screen, inserting `SHOW_SEATS` with tiered price calculations based on seat classification.
- `VIEW_AVAILABLE_SEATS`: Explicit cursor procedure extracting currently available seats for real-time frontend rendering.
- `VIEW_BOOKING_REPORT`: Explicit cursor aggregation grouping bookings by film title to compute total admissions and cumulative revenue.

### 5.2 PL/SQL Stored Functions
- `CALCULATE_TICKET_PRICE(p_show_id NUMBER, p_num_seats NUMBER)`: Authoritative pricing calculation that queries base admission from `SHOWS` and factors in convenience fees.
- `APPLY_COUPON(p_coupon_code VARCHAR2, p_order_amount NUMBER)`: Evaluates promotional constraints and computes discounted totals while atomically updating `COUPONS.USED_COUNT`.

### 5.3 Event-Driven Triggers
1. **`TRG_BOOK_SEAT` (AFTER INSERT ON BOOKINGS)**:
   Transitions seat status from `'AVAILABLE'` to `'BOOKED'` and creates the associated row in `TICKETS` using `TICKET_SEQ.NEXTVAL`.
2. **`TRG_PAYMENT_CONFIRM` (AFTER INSERT ON PAYMENTS)**:
   When `PAYMENT_STATUS = 'COMPLETED'`, promotes the corresponding booking from `'PENDING'` to `'CONFIRMED'`.
3. **`TRG_RELEASE_SEAT` (AFTER UPDATE OF STATUS ON BOOKINGS)**:
   When status transitions to `'CANCELLED'`, automatically releases `SHOW_SEATS` back to `'AVAILABLE'`, cancels the ticket, and inserts a compensation entry into `REFUNDS`.

---

## 6. Security & Multi-Role Access Control

CineGo implements multi-role authorization across three actors:
1. **Customer**: Can browse, reserve seats, order food, simulate payments, view personal history, cancel reservations, and submit reviews.
2. **Theatre Manager**: Scoped strictly to their assigned cinema (`THEATRES.MANAGER_ID = CUSTOMERS.CUSTOMER_ID`). Can view daily auditorium occupancy, scheduled screenings, and cinema admissions. Cannot view or alter data for other cinemas.
3. **System Administrator**: Unrestricted access to movie catalog management (`ADD_MOVIE`, `UPDATE_MOVIE`, `REMOVE_MOVIE`), show scheduling (`CREATE_SHOW`), the central bookings ledger, and box office analytics (`VIEW_BOOKING_REPORT`).

SQL Injection prevention is enforced through 100% parameterized Oracle bind variable query executions.

---

## 7. Testing & Experimental Results

A comprehensive verification matrix was executed against Oracle 21c XE:
1. **ACID Transaction Test**: Successfully rolled back partial bookings when an invalid seat ID was supplied, leaving seat inventory unmodified.
2. **Double-Booking Concurrency Test**: Two concurrent client requests targeting Seat 1001 for Show 504 resulted in Session 1 receiving confirmation and Session 2 receiving an immediate `409 Conflict: Seat Not Available` rejection.
3. **Trigger Cascade Test**: Cancelling Booking #5001 resulted in:
   - `SHOW_SEATS.STATUS` resetting from `BOOKED` to `AVAILABLE`.
   - `TICKETS.STATUS` updating to `CANCELLED`.
   - New `REFUNDS` row generated with the full booking amount.
4. **Build & Compilation**: Both Node.js backend (`tsc`) and React frontend (`vite build`) compiled with **zero warnings and zero errors**.

---

## 8. Conclusion & Future Enhancements

The **CineGo** full-stack movie reservation platform demonstrates how enterprise database design and modern web frameworks integrate seamlessly. By delegating data consistency, transactions, and inventory state to Oracle 21c XE PL/SQL, the application achieves commercial-grade reliability suitable for real-world deployment.

### Future Enhancements:
- Implementation of dynamic pricing algorithms based on real-time auditorium demand.
- Integration of physical IoT turnstile hardware utilizing the generated QR admission passes.
- Partitioning of `BOOKINGS` and `SHOW_SEATS` tables across calendar quarters for high-volume archiving.
