# CineGo — Academic Viva & Live Demonstration Guide

This guide details the exact step-by-step presentation flow to showcase CineGo's full-stack implementation and Oracle Database concepts to college faculty.

---

## 🎭 Demonstration Walkthrough Script

### Act 1: The Commercial Platform Experience (5 Minutes)

1. **Launch the Application**:
   - Navigate to `http://localhost:5173`.
   - Show the **Hero Section** with dark cinematic aesthetics, marquee movies, and dynamic search.
   - Select Location: **Chennai** (retrieved from `SELECT_LOCATION` cursor).

2. **Movie & Showtime Discovery**:
   - Click on blockbuster **"Vikram"** (`MOVIE_ID = 102`).
   - Observe cast information, certificate, duration, and format tags.
   - Click **Book Tickets** -> Navigate to **Theatres & Showtimes** (`SELECT_SHOW`).
   - Select **PVR Grand Mall** -> **07:30 PM Show** (`SHOW_ID = 504`).

3. **Realistic Seat Map & Authoritative Pricing**:
   - Open Seat Selection map (`VIEW_AVAILABLE_SEATS(504)`).
   - Point out curved **Cinema Screen Indicator**, aisles, and seat tiers (Premium / Regular / Recliner).
   - Select 2 seats: **A4 & A5**.
   - Point out that ticket subtotal and convenience fees are calculated via Oracle function:
     $$\text{SELECT CALCULATE\_TICKET\_PRICE}(504, 2) \text{ FROM DUAL}$$

4. **Concessions & Coupon Application**:
   - Add **1 Large Popcorn** and **2 Cokes** (mapped to Oracle procedure `ORDER_FOOD`).
   - In order summary, enter coupon code: `WELCOME100`.
   - Demonstrate real-time discount deduction verified through Oracle function `APPLY_COUPON`.

5. **Simulated Payment & Trigger Confirmation**:
   - Select payment method: **UPI**.
   - Click **Pay ₹620**.
   - Show that this executes `PROCESS_PAYMENT`, inserting into `PAYMENTS`.
   - **Highlight Database Magic**: Trigger `TRG_PAYMENT_CONFIRM` automatically promoted `BOOKINGS.STATUS` to `'CONFIRMED'`.

6. **E-Ticket Generation**:
   - View generated E-Admission ticket with dynamic QR Code, seat numbers, and booking ID (`GENERATE_TICKET`).

---

### Act 2: Demonstrating ACID & Trigger Seat Releases (3 Minutes)

1. **Navigate to Customer Bookings**:
   - Open `/bookings`.
   - Locate the newly confirmed reservation.

2. **Execute Cancellation**:
   - Click **Cancel Reservation**.
   - Confirm cancellation modal.
   - **Highlight Database Magic**:
     - Procedure `CANCEL_BOOKING` sets `STATUS = 'CANCELLED'`.
     - Trigger `TRG_RELEASE_SEAT` automatically executes:
       1. Resets seat status in `SHOW_SEATS` back to `'AVAILABLE'`.
       2. Cancels corresponding entry in `TICKETS`.
       3. Inserts an automated compensation refund into `REFUNDS`.
   - Return to the seat map for that show: demonstrate that seats **A4 & A5** are now green and available for purchase again!

---

### Act 3: College DBMS Demonstration Page (2 Minutes)

1. **Open `/dbms-demo`**:
   - Show the interactive DBMS concepts panel.
   - Demonstrate the complete mapping table showing:
     - UI Operation
     - Express API Route
     - Oracle Stored Procedure / Function
     - Underlying DBMS concept (Trigger, Sequence, Cursor, Transaction)

2. **Open `/db-architecture`**:
   - Review the multi-tier architectural flow diagram and ER relationship map.

---

### Act 4: Manager & Admin RBAC Portals (3 Minutes)

1. **Theatre Manager Portal (`/manager`)**:
   - Show that manager `manager@pvr.com` only has access to **PVR Grand Mall**.
   - Demonstrate today's live screen inventory and `VIEW_THEATRE_BOOKINGS` cursor output.

2. **System Admin Console (`/admin`)**:
   - Open `/admin/movies`: demonstrate `ADD_MOVIE` and `REMOVE_MOVIE` soft-deletes.
   - Open `/admin/shows`: demonstrate `CREATE_SHOW` procedure that auto-generates seat inventory.
   - Open `/admin/reports`: demonstrate multi-table aggregation cursor `VIEW_BOOKING_REPORT`.
