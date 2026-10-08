# CineGo — Testing Strategy & Verification Plan

## 1. Test Overview

The testing suite validates correctness across:
1. **Oracle PL/SQL Procedures & Functions** (standalone verification in SQL*Plus / SQL Developer)
2. **Oracle Database Triggers** (`TRG_BOOK_SEAT`, `TRG_PAYMENT_CONFIRM`, `TRG_RELEASE_SEAT`)
3. **Backend REST APIs** (parameter binding, response codes, and transaction commits)
4. **Concurrency & Double-Booking Prevention**
5. **Frontend Reactive State & Responsive Navigation**

---

## 2. Test Execution Matrix

| Test ID | Domain | Operation Tested | Expected Outcome | Pass/Fail |
|---|---|---|---|:---:|
| `TC-01` | Customer Auth | `REGISTER_CUSTOMER('Karthik', ...)` | Sequence `CUSTOMER_SEQ` generates ID; email uniqueness enforced | PASS |
| `TC-02` | Customer Auth | `REGISTER_CUSTOMER` (Duplicate Email) | Caught by validation block; duplicate rejected | PASS |
| `TC-03` | Discovery | `SELECT_LOCATION` (Cursor) | Loops over all 5 active locations | PASS |
| `TC-04` | Discovery | `SELECT_MOVIE(1)` (Cursor Join) | Returns movies actively showing in Chennai | PASS |
| `TC-05` | Pricing | `CALCULATE_TICKET_PRICE(504, 2)` | Authoritative base price + 2 × ₹30 convenience fee | PASS |
| `TC-06` | Coupons | `APPLY_COUPON('WELCOME100', 600)` | Returns 500; increments `COUPONS.USED_COUNT` | PASS |
| `TC-07` | Booking | `CREATE_BOOKING` (Available Seat) | Generates `BOOKING_ID`; fires `TRG_BOOK_SEAT` -> Seat='BOOKED' | PASS |
| `TC-08` | Concurrency | 2 Concurrent Bookings on Seat 1001 | 1st succeeds; 2nd throws seat unavailable error | PASS |
| `TC-09` | Payment | `PROCESS_PAYMENT` (Valid Booking) | Inserts payment; fires `TRG_PAYMENT_CONFIRM` -> Status='CONFIRMED' | PASS |
| `TC-10` | Cancellation | `CANCEL_BOOKING` (Confirmed Booking) | Fires `TRG_RELEASE_SEAT` -> Seat='AVAILABLE', creates Refund | PASS |
| `TC-11` | Administration | `ADD_MOVIE` / `REMOVE_MOVIE` | Adds title; remove performs soft-delete to 'CANCELLED' | PASS |
| `TC-12` | Reporting | `VIEW_BOOKING_REPORT` (Cursor) | Aggregates admissions and revenue grouped by film title | PASS |

---

## 3. Concurrency & Double-Booking Test Script

In Oracle SQL*Plus, open two concurrent sessions to verify transaction safety:

### Session 1:
```sql
SET SERVEROUTPUT ON;
-- Customer A selects seat 1001 for show 504
EXEC CREATE_BOOKING(1003, 504, 1001);
-- Trigger TRG_BOOK_SEAT executes and locks seat 1001
```

### Session 2 (Simultaneous execution):
```sql
SET SERVEROUTPUT ON;
-- Customer B attempts to select the identical seat 1001
EXEC CREATE_BOOKING(1004, 504, 1001);
-- Output: "Error: Seat is not available."
```

---

## 4. Trigger Verification Steps

### Step 1: Verify `TRG_BOOK_SEAT`
```sql
SELECT STATUS FROM SHOW_SEATS WHERE SHOW_SEAT_ID = 1001;
-- Output: AVAILABLE

EXEC CREATE_BOOKING(1003, 504, 1001);

SELECT STATUS FROM SHOW_SEATS WHERE SHOW_SEAT_ID = 1001;
-- Output: BOOKED (Updated automatically by trigger)

SELECT * FROM TICKETS WHERE SHOW_SEAT_ID = 1001;
-- Output: 1 Ticket row generated
```

### Step 2: Verify `TRG_PAYMENT_CONFIRM`
```sql
SELECT STATUS FROM BOOKINGS WHERE BOOKING_ID = 5001;
-- Output: PENDING

EXEC PROCESS_PAYMENT(5001, 'UPI', 280);

SELECT STATUS FROM BOOKINGS WHERE BOOKING_ID = 5001;
-- Output: CONFIRMED (Updated automatically by trigger)
```

### Step 3: Verify `TRG_RELEASE_SEAT`
```sql
EXEC CANCEL_BOOKING(5001, 1003);

SELECT STATUS FROM SHOW_SEATS WHERE SHOW_SEAT_ID = 1001;
-- Output: AVAILABLE (Released automatically by trigger)

SELECT * FROM REFUNDS WHERE BOOKING_ID = 5001;
-- Output: Refund record automatically created with AMOUNT = 280
```
