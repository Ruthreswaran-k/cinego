SET SERVEROUTPUT ON;
SET VERIFY OFF;
SET DEFINE ON;

PROMPT
PROMPT ==================================================
PROMPT          CINEGO MOVIE TICKET BOOKING SYSTEM
PROMPT              THEATRE MANAGER PANEL
PROMPT ==================================================
PROMPT

----------------------------------------------------------
-- STEP 1 : ONBOARD / REGISTER THEATRE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 1: REGISTER THEATRE PROPERTY
PROMPT ==================================================

ACCEPT theatre_id NUMBER PROMPT 'Enter Theatre ID: '
ACCEPT theatre_name CHAR PROMPT 'Enter Theatre Name: '
ACCEPT loc_id NUMBER PROMPT 'Enter Location ID: '
ACCEPT address CHAR PROMPT 'Enter Address: '
ACCEPT license_num CHAR PROMPT 'Enter License Number: '
ACCEPT gstin CHAR PROMPT 'Enter GSTIN: '
ACCEPT fire_noc CHAR PROMPT 'Enter Fire Safety NOC: '
ACCEPT phone CHAR PROMPT 'Enter Contact Phone: '
ACCEPT email CHAR PROMPT 'Enter Email: '
ACCEPT manager_id NUMBER PROMPT 'Enter Duty Manager ID: '

BEGIN
    REGISTER_THEATRE(
        &theatre_id,
        '&theatre_name',
        &loc_id,
        '&address',
        '&license_num',
        '&gstin',
        '&fire_noc',
        '&phone',
        '&email',
        &manager_id
    );
END;
/

PROMPT
PROMPT Verifying Registered Theatre Record:
PROMPT ==================================================

COLUMN NAME FORMAT A25
COLUMN ADDRESS FORMAT A30
COLUMN IS_VERIFIED FORMAT 9
COLUMN IS_ACTIVE FORMAT 9

SELECT THEATRE_ID,
       NAME,
       LOCATION_ID,
       PHONE,
       VERIFICATION_STATUS,
       IS_ACTIVE
FROM THEATRES
WHERE THEATRE_ID = &theatre_id;

----------------------------------------------------------
-- STEP 2 : VIEW THEATRE BOOKINGS & REVENUE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 2: VIEW THEATRE BOOKINGS
PROMPT ==================================================

ACCEPT view_theatre_id NUMBER PROMPT 'Enter Theatre ID to Inspect Bookings: '

BEGIN
    VIEW_THEATRE_BOOKINGS(&view_theatre_id);
END;
/

PROMPT
PROMPT Theatre booking details displayed successfully.
PROMPT

----------------------------------------------------------
-- STEP 3 : AUDIT REAL-TIME SEAT OCCUPANCY
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 3: AUDIT AUDITORIUM SEAT OCCUPANCY
PROMPT ==================================================

ACCEPT show_id NUMBER PROMPT 'Enter Show ID to Audit Occupancy: '

BEGIN
    VIEW_AVAILABLE_SEATS(&show_id);
END;
/

PROMPT
PROMPT Auditorium seat occupancy audit completed.
PROMPT

----------------------------------------------------------
-- STEP 4 : AUDIT CONCESSIONS & FOOD MENU
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 4: CONCESSIONS AND CAFETERIA MENU
PROMPT ==================================================

BEGIN
    VIEW_FOOD_MENU;
END;
/

PROMPT
PROMPT Food and concessions cafeteria items displayed successfully.
PROMPT

----------------------------------------------------------
-- STEP 5 : VERIFY TURNSTILE TICKET AT ENTRANCE GATE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 5: TURNSTILE GATE ADMISSION VERIFICATION
PROMPT ==================================================

ACCEPT scan_booking_id NUMBER PROMPT 'Enter Scanned Ticket / Booking ID: '

BEGIN
    GENERATE_TICKET(&scan_booking_id);
END;
/

PROMPT
PROMPT Verifying Ticket Table Status:
PROMPT ==================================================

COLUMN STATUS FORMAT A15

SELECT TICKET_ID,
       BOOKING_ID,
       SHOW_SEAT_ID,
       STATUS,
       GENERATED_AT
FROM TICKETS
WHERE BOOKING_ID = &scan_booking_id;

PROMPT
PROMPT ==================================================
PROMPT      THEATRE MANAGER OPERATIONS COMPLETED!
PROMPT ==================================================
PROMPT
