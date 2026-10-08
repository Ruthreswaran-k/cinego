SET SERVEROUTPUT ON;
SET VERIFY OFF;
SET DEFINE ON;

PROMPT
PROMPT ==================================================
PROMPT          CINEGO MOVIE TICKET BOOKING SYSTEM
PROMPT                 CUSTOMER BOOKING FLOW
PROMPT ==================================================
PROMPT

----------------------------------------------------------
-- STEP 1 : SELECT LOCATION
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 1: SELECT LOCATION
PROMPT ==================================================

BEGIN
    SELECT_LOCATION;
END;
/

ACCEPT loc_id NUMBER PROMPT 'Enter Location ID: '

PROMPT
PROMPT Location &loc_id selected successfully.
PROMPT

----------------------------------------------------------
-- STEP 2 : SELECT MOVIE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 2: SELECT MOVIE IN LOCATION
PROMPT ==================================================

BEGIN
    SELECT_MOVIE(&loc_id);
END;
/

ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '

PROMPT
PROMPT Movie &movie_id selected successfully.
PROMPT

----------------------------------------------------------
-- STEP 3 : SELECT THEATRE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 3: SELECT THEATRE EXHIBITING MOVIE
PROMPT ==================================================

BEGIN
    SELECT_THEATRE(&loc_id, &movie_id);
END;
/

ACCEPT theatre_id NUMBER PROMPT 'Enter Theatre ID: '

PROMPT
PROMPT Theatre &theatre_id selected successfully.
PROMPT

----------------------------------------------------------
-- STEP 4 : SELECT SHOW & AUDITORIUM
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 4: SELECT SHOWTIME
PROMPT ==================================================

ACCEPT show_date CHAR PROMPT 'Enter Show Date (YYYY-MM-DD): '

BEGIN
    SELECT_SHOW(
        &movie_id,
        &theatre_id,
        TO_DATE('&show_date','YYYY-MM-DD')
    );
END;
/

ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '

PROMPT
PROMPT Show &show_id selected successfully.
PROMPT

----------------------------------------------------------
-- STEP 5 : VIEW AVAILABLE SEATS
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 5: VIEW AVAILABLE AUDITORIUM SEATS
PROMPT ==================================================

BEGIN
    VIEW_AVAILABLE_SEATS(&show_id);
END;
/

ACCEPT show_seat_id NUMBER PROMPT 'Enter Show Seat ID: '

PROMPT
PROMPT Seat &show_seat_id selected successfully.
PROMPT

----------------------------------------------------------
-- STEP 6 : CUSTOMER AUTHENTICATION / LOGIN
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 6: CUSTOMER SIGN-IN (MANDATORY AT PAYMENT)
PROMPT ==================================================

ACCEPT email CHAR PROMPT 'Enter Email: '
ACCEPT password CHAR PROMPT 'Enter Password: '

BEGIN
    LOGIN_CUSTOMER('&email', '&password');
END;
/

ACCEPT customer_id NUMBER PROMPT 'Enter Customer ID: '

PROMPT
PROMPT Customer #&customer_id authenticated successfully.
PROMPT

----------------------------------------------------------
-- STEP 7 : CALCULATE TICKET PRICE (PL/SQL FUNCTION)
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 7: CALCULATE TICKET PRICE (FUNCTION)
PROMPT ==================================================

ACCEPT seat_count NUMBER PROMPT 'Enter Number of Seats: '

COLUMN CALCULATED_PRICE FORMAT 999,999.99

SELECT CALCULATE_TICKET_PRICE(
    &show_id,
    &seat_count
) AS CALCULATED_PRICE
FROM DUAL;

----------------------------------------------------------
-- STEP 8 : APPLY COUPON DISCOUNT (PL/SQL FUNCTION)
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 8: APPLY COUPON CODE (FUNCTION)
PROMPT ==================================================

ACCEPT booking_amount NUMBER PROMPT 'Enter Booking Subtotal: '
ACCEPT coupon_code CHAR PROMPT 'Enter Coupon Code: '

COLUMN DISCOUNTED_PAYABLE FORMAT 999,999.99

SELECT APPLY_COUPON(
    '&coupon_code',
    &booking_amount
) AS DISCOUNTED_PAYABLE
FROM DUAL;

----------------------------------------------------------
-- STEP 9 : CONCESSIONS & FOOD MENU
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 9: FOOD AND CONCESSIONS MENU
PROMPT ==================================================

BEGIN
    VIEW_FOOD_MENU;
END;
/

ACCEPT food_choice NUMBER PROMPT 'Enter Food ID (0 for No Food): '
ACCEPT food_quantity NUMBER PROMPT 'Enter Food Quantity: '

----------------------------------------------------------
-- STEP 10 : CREATE BOOKING (ACID TRANSACTION + TRIGGER)
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 10: CREATE BOOKING (TRIP TRG_BOOK_SEAT)
PROMPT ==================================================

BEGIN
    CREATE_BOOKING(
        &customer_id,
        &show_id,
        &show_seat_id
    );
END;
/

PROMPT
PROMPT Verifying Newly Created Booking Record:
PROMPT ==================================================

COLUMN STATUS FORMAT A15
COLUMN TOTAL_AMOUNT FORMAT 999,999.99

SELECT BOOKING_ID,
       CUSTOMER_ID,
       SHOW_ID,
       STATUS,
       TOTAL_AMOUNT
FROM BOOKINGS
WHERE CUSTOMER_ID = &customer_id
ORDER BY BOOKING_ID DESC;

-- Automatically capture latest booking ID
COLUMN LATEST_B_ID NEW_VALUE booking_id NOPRINT;
SELECT MAX(BOOKING_ID) AS LATEST_B_ID
FROM BOOKINGS
WHERE CUSTOMER_ID = &customer_id;

----------------------------------------------------------
-- STEP 11 : ORDER FOOD CONCESSIONS
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 11: ATTACH FOOD ORDER TO BOOKING #&booking_id
PROMPT ==================================================

BEGIN
    IF &food_choice <> 0 THEN
        ORDER_FOOD(
            &booking_id,
            &food_choice,
            &food_quantity
        );
    END IF;
END;
/

PROMPT
PROMPT Verifying Food Order Record:
PROMPT ==================================================

COLUMN SUBTOTAL FORMAT 999,999.99

SELECT FOOD_ORDER_ID,
       BOOKING_ID,
       FOOD_ID,
       QUANTITY,
       SUBTOTAL
FROM FOOD_ORDERS
WHERE BOOKING_ID = &booking_id;

----------------------------------------------------------
-- STEP 12 : PROCESS PAYMENT & TRIGGER AUTO-CONFIRMATION
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 12: PROCESS PAYMENT (TRIP TRG_PAYMENT_CONFIRM)
PROMPT ==================================================

ACCEPT payment_method CHAR PROMPT 'Enter Payment Method (UPI/CARD/NET_BANKING): '
ACCEPT payment_amount NUMBER PROMPT 'Enter Payment Amount: '

BEGIN
    PROCESS_PAYMENT(
        &booking_id,
        '&payment_method',
        &payment_amount
    );
END;
/

PROMPT
PROMPT Verifying Payment AND Trigger Auto-Confirmation Status:
PROMPT ==================================================

COLUMN PAYMENT_METHOD FORMAT A15
COLUMN PAYMENT_STATUS FORMAT A15
COLUMN AMOUNT FORMAT 999,999.99

SELECT PAYMENT_ID,
       BOOKING_ID,
       PAYMENT_METHOD,
       AMOUNT,
       PAYMENT_STATUS
FROM PAYMENTS
WHERE BOOKING_ID = &booking_id;

SELECT BOOKING_ID,
       STATUS,
       FINAL_AMOUNT
FROM BOOKINGS
WHERE BOOKING_ID = &booking_id;

----------------------------------------------------------
-- STEP 13 : GENERATE E-TICKET
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 13: GENERATE VERIFIED E-TICKET
PROMPT ==================================================

BEGIN
    GENERATE_TICKET(&booking_id);
END;
/

PROMPT
PROMPT Verifying Ticket Table Record:
PROMPT ==================================================

COLUMN STATUS FORMAT A15

SELECT TICKET_ID,
       BOOKING_ID,
       SHOW_SEAT_ID,
       STATUS,
       GENERATED_AT
FROM TICKETS
WHERE BOOKING_ID = &booking_id;

----------------------------------------------------------
-- STEP 14 : VIEW BOOKING HISTORY
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 14: CUSTOMER BOOKING HISTORY
PROMPT ==================================================

BEGIN
    VIEW_BOOKING_HISTORY(&customer_id);
END;
/

----------------------------------------------------------
-- STEP 15 : ADD MOVIE REVIEW
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 15: SUBMIT CUSTOMER REVIEW
PROMPT ==================================================

ACCEPT rating NUMBER PROMPT 'Enter Rating (1-5): '
ACCEPT review_text CHAR PROMPT 'Enter Review Text: '

BEGIN
    ADD_REVIEW(
        &customer_id,
        &movie_id,
        &rating,
        '&review_text'
    );
END;
/

PROMPT
PROMPT Verifying Inserted Review:
PROMPT ==================================================

SELECT REVIEW_ID,
       CUSTOMER_ID,
       MOVIE_ID,
       RATING,
       TO_CHAR(REVIEW_TEXT) AS REVIEW_CONTENT
FROM REVIEWS
WHERE CUSTOMER_ID = &customer_id AND MOVIE_ID = &movie_id;

PROMPT
PROMPT ==================================================
PROMPT      CUSTOMER BOOKING LIFECYCLE COMPLETED!
PROMPT ==================================================
PROMPT
