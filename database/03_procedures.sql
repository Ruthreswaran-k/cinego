SET DEFINE OFF;

CREATE OR REPLACE PROCEDURE REGISTER_CUSTOMER(
    p_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_mobile IN VARCHAR2,
    p_password IN VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM CUSTOMERS WHERE EMAIL = p_email OR MOBILE = p_mobile;
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: Customer with this email or mobile already exists.');
        RETURN;
    END IF;

    INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL, MOBILE, PASSWORD_HASH)
    VALUES (CUSTOMER_SEQ.NEXTVAL, p_name, p_email, p_mobile, p_password);
    
    DBMS_OUTPUT.PUT_LINE('Customer registered successfully. Welcome ' || p_name);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error registering customer: ' || SQLERRM);
END REGISTER_CUSTOMER;
/

CREATE OR REPLACE PROCEDURE LOGIN_CUSTOMER(
    p_email IN VARCHAR2,
    p_password IN VARCHAR2
) AS
    v_customer_id CUSTOMERS.CUSTOMER_ID%TYPE;
    v_name CUSTOMERS.NAME%TYPE;
    v_role CUSTOMERS.ROLE%TYPE;
BEGIN
    SELECT CUSTOMER_ID, NAME, ROLE INTO v_customer_id, v_name, v_role
    FROM CUSTOMERS
    WHERE EMAIL = p_email AND PASSWORD_HASH = p_password;
    
    DBMS_OUTPUT.PUT_LINE('Login Successful!');
    DBMS_OUTPUT.PUT_LINE('Customer ID: ' || v_customer_id || ' | Name: ' || v_name || ' | Role: ' || v_role);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: Invalid email or password.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error during login: ' || SQLERRM);
END LOGIN_CUSTOMER;
/

CREATE OR REPLACE PROCEDURE SELECT_LOCATION AS
    CURSOR cur_loc IS SELECT LOCATION_ID, CITY, STATE FROM LOCATIONS WHERE IS_ACTIVE = 1;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Available Locations:');
    FOR rec IN cur_loc LOOP
        DBMS_OUTPUT.PUT_LINE(rec.LOCATION_ID || ' - ' || rec.CITY || ', ' || rec.STATE);
    END LOOP;
END SELECT_LOCATION;
/

CREATE OR REPLACE PROCEDURE SELECT_MOVIE(
    p_location_id IN NUMBER
) AS
    CURSOR cur_movies IS 
        SELECT DISTINCT m.MOVIE_ID, m.TITLE, m.FORMAT, m.LANGUAGE 
        FROM MOVIES m
        JOIN SHOWS s ON m.MOVIE_ID = s.MOVIE_ID
        JOIN SCREENS sc ON s.SCREEN_ID = sc.SCREEN_ID
        JOIN THEATRES t ON sc.THEATRE_ID = t.THEATRE_ID
        WHERE t.LOCATION_ID = p_location_id AND m.STATUS = 'RUNNING';
BEGIN
    DBMS_OUTPUT.PUT_LINE('Movies showing at location ID ' || p_location_id || ':');
    FOR rec IN cur_movies LOOP
        DBMS_OUTPUT.PUT_LINE(rec.MOVIE_ID || ' - ' || rec.TITLE || ' (' || rec.LANGUAGE || ', ' || rec.FORMAT || ')');
    END LOOP;
END SELECT_MOVIE;
/

CREATE OR REPLACE PROCEDURE SELECT_THEATRE(
    p_location_id IN NUMBER,
    p_movie_id IN NUMBER
) AS
    CURSOR cur_theatres IS 
        SELECT DISTINCT t.THEATRE_ID, t.NAME, t.ADDRESS 
        FROM THEATRES t
        JOIN SCREENS sc ON t.THEATRE_ID = sc.THEATRE_ID
        JOIN SHOWS s ON sc.SCREEN_ID = s.SCREEN_ID
        WHERE t.LOCATION_ID = p_location_id AND s.MOVIE_ID = p_movie_id AND t.IS_ACTIVE = 1;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Theatres showing movie ID ' || p_movie_id || ' in location ID ' || p_location_id || ':');
    FOR rec IN cur_theatres LOOP
        DBMS_OUTPUT.PUT_LINE(rec.THEATRE_ID || ' - ' || rec.NAME || ' | ' || rec.ADDRESS);
    END LOOP;
END SELECT_THEATRE;
/

CREATE OR REPLACE PROCEDURE SELECT_SHOW(
    p_movie_id IN NUMBER,
    p_theatre_id IN NUMBER,
    p_show_date IN DATE
) AS
    CURSOR cur_shows IS 
        SELECT s.SHOW_ID, s.SHOW_TIME, sc.SCREEN_NAME, s.FORMAT, s.BASE_PRICE 
        FROM SHOWS s
        JOIN SCREENS sc ON s.SCREEN_ID = sc.SCREEN_ID
        WHERE s.MOVIE_ID = p_movie_id AND sc.THEATRE_ID = p_theatre_id 
        AND TRUNC(s.SHOW_DATE) = TRUNC(p_show_date) AND s.IS_ACTIVE = 1;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Shows for movie ' || p_movie_id || ' at theatre ' || p_theatre_id || ' on ' || TO_CHAR(p_show_date, 'DD-MON-YYYY') || ':');
    FOR rec IN cur_shows LOOP
        DBMS_OUTPUT.PUT_LINE('Show ID: ' || rec.SHOW_ID || ' | Time: ' || rec.SHOW_TIME || ' | Screen: ' || rec.SCREEN_NAME || ' | Format: ' || rec.FORMAT || ' | Price: ' || rec.BASE_PRICE);
    END LOOP;
END SELECT_SHOW;
/

CREATE OR REPLACE PROCEDURE VIEW_AVAILABLE_SEATS(
    p_show_id IN NUMBER
) AS
    CURSOR cur_seats IS 
        SELECT ss.SHOW_SEAT_ID, s.ROW_NAME, s.SEAT_NUMBER, s.SEAT_TYPE, ss.PRICE
        FROM SHOW_SEATS ss
        JOIN SEATS s ON ss.SEAT_ID = s.SEAT_ID
        WHERE ss.SHOW_ID = p_show_id AND ss.STATUS = 'AVAILABLE'
        ORDER BY s.ROW_NAME, s.SEAT_NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Available Seats for Show ID ' || p_show_id || ':');
    FOR rec IN cur_seats LOOP
        DBMS_OUTPUT.PUT_LINE('Seat ID: ' || rec.SHOW_SEAT_ID || ' | Row: ' || rec.ROW_NAME || ' | No: ' || rec.SEAT_NUMBER || ' | Type: ' || rec.SEAT_TYPE || ' | Price: Rs ' || rec.PRICE);
    END LOOP;
END VIEW_AVAILABLE_SEATS;
/

CREATE OR REPLACE PROCEDURE CREATE_BOOKING(
    p_customer_id IN NUMBER,
    p_show_id IN NUMBER,
    p_show_seat_id IN NUMBER
) AS
    v_status VARCHAR2(20);
    v_price NUMBER(10,2);
    v_booking_id NUMBER;
BEGIN
    -- Check seat status
    SELECT STATUS, PRICE INTO v_status, v_price FROM SHOW_SEATS WHERE SHOW_SEAT_ID = p_show_seat_id;
    
    IF v_status != 'AVAILABLE' THEN
        DBMS_OUTPUT.PUT_LINE('Error: Seat is not available.');
        RETURN;
    END IF;
    
    -- We're simplifying to 1 seat booking in this procedure based on prompt "CREATE_BOOKING(p_customer_id, p_show_id, p_show_seat_id)"
    v_booking_id := BOOKING_SEQ.NEXTVAL;
    
    -- Insert Booking
    INSERT INTO BOOKINGS (BOOKING_ID, CUSTOMER_ID, SHOW_ID, STATUS, TOTAL_AMOUNT, CONVENIENCE_FEE, FINAL_AMOUNT, NUM_SEATS, SEAT_IDS)
    VALUES (v_booking_id, p_customer_id, p_show_id, 'PENDING', v_price, 30, v_price + 30, 1, TO_CHAR(p_show_seat_id));
    
    DBMS_OUTPUT.PUT_LINE('Booking initiated. Booking ID: ' || v_booking_id || '. Please proceed to payment.');
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: Show Seat not found.');
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error creating booking: ' || SQLERRM);
END CREATE_BOOKING;
/

CREATE OR REPLACE PROCEDURE ORDER_FOOD(
    p_booking_id IN NUMBER,
    p_food_id IN NUMBER,
    p_quantity IN NUMBER
) AS
    v_price NUMBER(10,2);
    v_subtotal NUMBER(10,2);
BEGIN
    SELECT PRICE INTO v_price FROM FOOD WHERE FOOD_ID = p_food_id AND IS_AVAILABLE = 1;
    v_subtotal := v_price * p_quantity;
    
    INSERT INTO FOOD_ORDERS (FOOD_ORDER_ID, BOOKING_ID, FOOD_ID, QUANTITY, SUBTOTAL)
    VALUES (FOOD_ORDER_SEQ.NEXTVAL, p_booking_id, p_food_id, p_quantity, v_subtotal);
    
    DBMS_OUTPUT.PUT_LINE('Food order added. Subtotal: Rs ' || v_subtotal);
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: Food item not found or unavailable.');
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error ordering food: ' || SQLERRM);
END ORDER_FOOD;
/

CREATE OR REPLACE PROCEDURE PROCESS_PAYMENT(
    p_booking_id IN NUMBER,
    p_payment_method IN VARCHAR2,
    p_amount IN NUMBER
) AS
    v_payment_id NUMBER;
BEGIN
    v_payment_id := PAYMENT_SEQ.NEXTVAL;
    INSERT INTO PAYMENTS (PAYMENT_ID, BOOKING_ID, AMOUNT, PAYMENT_METHOD, PAYMENT_STATUS)
    VALUES (v_payment_id, p_booking_id, p_amount, p_payment_method, 'COMPLETED');
    
    DBMS_OUTPUT.PUT_LINE('Payment processed successfully. Payment ID: ' || v_payment_id);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error processing payment: ' || SQLERRM);
END PROCESS_PAYMENT;
/

CREATE OR REPLACE PROCEDURE GENERATE_TICKET(
    p_booking_id IN NUMBER
) AS
    CURSOR cur_ticket IS
        SELECT t.TICKET_ID, b.BOOKING_ID, m.TITLE, th.NAME AS THEATRE_NAME, sc.SCREEN_NAME, s.SHOW_DATE, s.SHOW_TIME,
               se.ROW_NAME, se.SEAT_NUMBER, t.STATUS, b.FINAL_AMOUNT
        FROM TICKETS t
        JOIN BOOKINGS b ON t.BOOKING_ID = b.BOOKING_ID
        JOIN SHOWS s ON b.SHOW_ID = s.SHOW_ID
        JOIN MOVIES m ON s.MOVIE_ID = m.MOVIE_ID
        JOIN SCREENS sc ON s.SCREEN_ID = sc.SCREEN_ID
        JOIN THEATRES th ON sc.THEATRE_ID = th.THEATRE_ID
        JOIN SHOW_SEATS ss ON t.SHOW_SEAT_ID = ss.SHOW_SEAT_ID
        JOIN SEATS se ON ss.SEAT_ID = se.SEAT_ID
        WHERE b.BOOKING_ID = p_booking_id;
        
    v_found BOOLEAN := FALSE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('--- TICKET DETAILS ---');
    FOR rec IN cur_ticket LOOP
        v_found := TRUE;
        DBMS_OUTPUT.PUT_LINE('Ticket ID: ' || rec.TICKET_ID || ' | Booking ID: ' || rec.BOOKING_ID);
        DBMS_OUTPUT.PUT_LINE('Movie: ' || rec.TITLE);
        DBMS_OUTPUT.PUT_LINE('Theatre: ' || rec.THEATRE_NAME || ' - ' || rec.SCREEN_NAME);
        DBMS_OUTPUT.PUT_LINE('Date and Time: ' || TO_CHAR(rec.SHOW_DATE, 'DD-MON-YYYY') || ' ' || rec.SHOW_TIME);
        DBMS_OUTPUT.PUT_LINE('Seat: ' || rec.ROW_NAME || rec.SEAT_NUMBER);
        DBMS_OUTPUT.PUT_LINE('Status: ' || rec.STATUS);
        DBMS_OUTPUT.PUT_LINE('Amount Paid: Rs ' || rec.FINAL_AMOUNT);
        DBMS_OUTPUT.PUT_LINE('------------------------');
    END LOOP;
    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No tickets found for Booking ID ' || p_booking_id);
    END IF;
END GENERATE_TICKET;
/

CREATE OR REPLACE PROCEDURE VIEW_BOOKING_HISTORY(
    p_customer_id IN NUMBER
) AS
    CURSOR cur_hist IS
        SELECT b.BOOKING_ID, m.TITLE, t.NAME AS THEATRE_NAME, s.SHOW_DATE, b.STATUS, b.FINAL_AMOUNT
        FROM BOOKINGS b
        JOIN SHOWS s ON b.SHOW_ID = s.SHOW_ID
        JOIN MOVIES m ON s.MOVIE_ID = m.MOVIE_ID
        JOIN SCREENS sc ON s.SCREEN_ID = sc.SCREEN_ID
        JOIN THEATRES t ON sc.THEATRE_ID = t.THEATRE_ID
        WHERE b.CUSTOMER_ID = p_customer_id
        ORDER BY b.BOOKING_DATE DESC;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Booking History for Customer ID: ' || p_customer_id);
    FOR rec IN cur_hist LOOP
        DBMS_OUTPUT.PUT_LINE('Booking ID: ' || rec.BOOKING_ID || ' | Movie: ' || rec.TITLE || ' | Theatre: ' || rec.THEATRE_NAME || ' | Date: ' || TO_CHAR(rec.SHOW_DATE, 'DD-MON-YYYY') || ' | Status: ' || rec.STATUS || ' | Amount: Rs ' || rec.FINAL_AMOUNT);
    END LOOP;
END VIEW_BOOKING_HISTORY;
/

CREATE OR REPLACE PROCEDURE CANCEL_BOOKING(
    p_booking_id IN NUMBER,
    p_customer_id IN NUMBER
) AS
    v_cust_id NUMBER;
    v_status VARCHAR2(20);
BEGIN
    SELECT CUSTOMER_ID, STATUS INTO v_cust_id, v_status FROM BOOKINGS WHERE BOOKING_ID = p_booking_id;
    
    IF v_cust_id != p_customer_id THEN
        DBMS_OUTPUT.PUT_LINE('Error: You are not authorized to cancel this booking.');
        RETURN;
    END IF;
    IF v_status = 'CANCELLED' THEN
        DBMS_OUTPUT.PUT_LINE('Booking is already cancelled.');
        RETURN;
    END IF;
    
    UPDATE BOOKINGS SET STATUS = 'CANCELLED' WHERE BOOKING_ID = p_booking_id;
    DBMS_OUTPUT.PUT_LINE('Booking cancelled successfully.');
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: Booking not found.');
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error cancelling booking: ' || SQLERRM);
END CANCEL_BOOKING;
/

CREATE OR REPLACE PROCEDURE VIEW_REFUND_STATUS(
    p_booking_id IN NUMBER
) AS
    CURSOR cur_refund IS
        SELECT REFUND_ID, AMOUNT, STATUS, REFUND_DATE FROM REFUNDS WHERE BOOKING_ID = p_booking_id;
    v_found BOOLEAN := FALSE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Refund Status for Booking ID: ' || p_booking_id);
    FOR rec IN cur_refund LOOP
        v_found := TRUE;
        DBMS_OUTPUT.PUT_LINE('Refund ID: ' || rec.REFUND_ID || ' | Amount: Rs ' || rec.AMOUNT || ' | Status: ' || rec.STATUS || ' | Date: ' || TO_CHAR(rec.REFUND_DATE, 'DD-MON-YYYY'));
    END LOOP;
    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No refund initiated for this booking.');
    END IF;
END VIEW_REFUND_STATUS;
/

CREATE OR REPLACE PROCEDURE ADD_REVIEW(
    p_customer_id IN NUMBER,
    p_movie_id IN NUMBER,
    p_rating IN NUMBER,
    p_review_text IN CLOB
) AS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM REVIEWS WHERE CUSTOMER_ID = p_customer_id AND MOVIE_ID = p_movie_id;
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: You have already reviewed this movie.');
        RETURN;
    END IF;
    
    INSERT INTO REVIEWS (REVIEW_ID, CUSTOMER_ID, MOVIE_ID, RATING, REVIEW_TEXT)
    VALUES (REVIEW_SEQ.NEXTVAL, p_customer_id, p_movie_id, p_rating, p_review_text);
    
    DBMS_OUTPUT.PUT_LINE('Review added successfully.');
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error adding review: ' || SQLERRM);
END ADD_REVIEW;
/

CREATE OR REPLACE PROCEDURE ADD_MOVIE(
    p_movie_id IN NUMBER,
    p_title IN VARCHAR2,
    p_language IN VARCHAR2,
    p_genre IN VARCHAR2,
    p_duration IN NUMBER
) AS
BEGIN
    INSERT INTO MOVIES (MOVIE_ID, TITLE, LANGUAGE, GENRE, DURATION_MINUTES)
    VALUES (p_movie_id, p_title, p_language, p_genre, p_duration);
    DBMS_OUTPUT.PUT_LINE('Movie added successfully.');
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error adding movie: ' || SQLERRM);
END ADD_MOVIE;
/

CREATE OR REPLACE PROCEDURE UPDATE_MOVIE(
    p_movie_id IN NUMBER,
    p_title IN VARCHAR2,
    p_status IN VARCHAR2
) AS
BEGIN
    UPDATE MOVIES SET TITLE = p_title, STATUS = p_status WHERE MOVIE_ID = p_movie_id;
    IF SQL%ROWCOUNT > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Movie updated successfully.');
        COMMIT;
    ELSE
        DBMS_OUTPUT.PUT_LINE('Movie not found.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error updating movie: ' || SQLERRM);
END UPDATE_MOVIE;
/

CREATE OR REPLACE PROCEDURE REMOVE_MOVIE(
    p_movie_id IN NUMBER
) AS
BEGIN
    UPDATE MOVIES SET STATUS = 'CANCELLED' WHERE MOVIE_ID = p_movie_id;
    IF SQL%ROWCOUNT > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Movie removed (soft delete) successfully.');
        COMMIT;
    ELSE
        DBMS_OUTPUT.PUT_LINE('Movie not found.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error removing movie: ' || SQLERRM);
END REMOVE_MOVIE;
/

CREATE OR REPLACE PROCEDURE CREATE_SHOW(
    p_show_id IN NUMBER,
    p_movie_id IN NUMBER,
    p_screen_id IN NUMBER,
    p_show_date IN DATE,
    p_show_time IN VARCHAR2,
    p_base_price IN NUMBER
) AS
BEGIN
    INSERT INTO SHOWS (SHOW_ID, MOVIE_ID, SCREEN_ID, SHOW_DATE, SHOW_TIME, BASE_PRICE)
    VALUES (p_show_id, p_movie_id, p_screen_id, p_show_date, p_show_time, p_base_price);
    
    FOR seat_rec IN (SELECT SEAT_ID, SEAT_TYPE FROM SEATS WHERE SCREEN_ID = p_screen_id) LOOP
        DECLARE
            v_premium NUMBER := 0;
        BEGIN
            IF seat_rec.SEAT_TYPE = 'PREMIUM' THEN v_premium := 50; END IF;
            IF seat_rec.SEAT_TYPE = 'RECLINER' THEN v_premium := 150; END IF;
            
            INSERT INTO SHOW_SEATS (SHOW_SEAT_ID, SHOW_ID, SEAT_ID, PRICE)
            VALUES (SHOW_SEAT_SEQ.NEXTVAL, p_show_id, seat_rec.SEAT_ID, p_base_price + v_premium);
        END;
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Show created and seats generated successfully.');
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error creating show: ' || SQLERRM);
END CREATE_SHOW;
/

CREATE OR REPLACE PROCEDURE VIEW_BOOKING_REPORT AS
    CURSOR cur_rep IS
        SELECT m.TITLE, COUNT(b.BOOKING_ID) AS TOTAL_BOOKINGS, SUM(b.FINAL_AMOUNT) AS REVENUE
        FROM BOOKINGS b
        JOIN SHOWS s ON b.SHOW_ID = s.SHOW_ID
        JOIN MOVIES m ON s.MOVIE_ID = m.MOVIE_ID
        WHERE b.STATUS = 'CONFIRMED'
        GROUP BY m.TITLE
        ORDER BY REVENUE DESC;
BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Booking Revenue Report ---');
    FOR rec IN cur_rep LOOP
        DBMS_OUTPUT.PUT_LINE('Movie: ' || rec.TITLE || ' | Total Bookings: ' || rec.TOTAL_BOOKINGS || ' | Revenue: Rs ' || NVL(rec.REVENUE, 0));
    END LOOP;
END VIEW_BOOKING_REPORT;
/

CREATE OR REPLACE PROCEDURE VIEW_THEATRE_BOOKINGS(
    p_theatre_id IN NUMBER
) AS
    CURSOR cur_tb IS
        SELECT b.BOOKING_ID, m.TITLE, s.SHOW_DATE, b.STATUS, b.FINAL_AMOUNT
        FROM BOOKINGS b
        JOIN SHOWS s ON b.SHOW_ID = s.SHOW_ID
        JOIN MOVIES m ON s.MOVIE_ID = m.MOVIE_ID
        JOIN SCREENS sc ON s.SCREEN_ID = sc.SCREEN_ID
        WHERE sc.THEATRE_ID = p_theatre_id
        ORDER BY s.SHOW_DATE DESC;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Bookings for Theatre ID: ' || p_theatre_id);
    FOR rec IN cur_tb LOOP
        DBMS_OUTPUT.PUT_LINE('Booking ID: ' || rec.BOOKING_ID || ' | Movie: ' || rec.TITLE || ' | Date: ' || TO_CHAR(rec.SHOW_DATE, 'DD-MON-YYYY') || ' | Status: ' || rec.STATUS || ' | Amount: Rs ' || rec.FINAL_AMOUNT);
    END LOOP;
END VIEW_THEATRE_BOOKINGS;
/

CREATE OR REPLACE PROCEDURE VIEW_FOOD_MENU AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('--- Food Menu ---');
    FOR rec IN (SELECT FOOD_ID, NAME, PRICE, CATEGORY FROM FOOD WHERE IS_AVAILABLE = 1 ORDER BY CATEGORY) LOOP
        DBMS_OUTPUT.PUT_LINE(rec.FOOD_ID || ' - ' || rec.NAME || ' (' || rec.CATEGORY || ') : Rs ' || rec.PRICE);
    END LOOP;
END VIEW_FOOD_MENU;
/

-- Procedure to Register a Theatre by Manager (Starts as PENDING_VERIFICATION)
CREATE OR REPLACE PROCEDURE REGISTER_THEATRE(
    p_theatre_id IN NUMBER,
    p_name IN VARCHAR2,
    p_location_id IN NUMBER,
    p_address IN VARCHAR2,
    p_license_number IN VARCHAR2 DEFAULT 'LIC-TN-2026-9812',
    p_gstin IN VARCHAR2 DEFAULT '33AAAAA0000A1Z5',
    p_fire_safety_noc IN VARCHAR2 DEFAULT 'NOC-FS-2026-441',
    p_phone IN VARCHAR2 DEFAULT '0413-2223344',
    p_email IN VARCHAR2 DEFAULT 'theatre@cinego.com',
    p_manager_id IN NUMBER DEFAULT 1002
) AS
BEGIN
    INSERT INTO THEATRES (
        THEATRE_ID, NAME, LOCATION_ID, ADDRESS, PHONE, EMAIL,
        MANAGER_ID, LICENSE_NUMBER, GSTIN, FIRE_SAFETY_NOC,
        VERIFICATION_STATUS, IS_ACTIVE
    ) VALUES (
        p_theatre_id, p_name, p_location_id, p_address, p_phone, p_email,
        p_manager_id, p_license_number, p_gstin, p_fire_safety_noc,
        'PENDING', 0
    );
    DBMS_OUTPUT.PUT_LINE('Theatre ' || p_name || ' registered. Awaiting Admin verification audit.');
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error registering theatre: ' || SQLERRM);
END REGISTER_THEATRE;
/

-- Procedure to Verify & Approve a Theatre by Admin
CREATE OR REPLACE PROCEDURE VERIFY_THEATRE(
    p_theatre_id IN NUMBER,
    p_admin_id IN NUMBER DEFAULT 1,
    p_status IN VARCHAR2 DEFAULT 'VERIFIED',
    p_remarks IN VARCHAR2 DEFAULT 'Verified by CinemaBook Admin'
) AS
BEGIN
    UPDATE THEATRES
    SET VERIFICATION_STATUS = p_status,
        IS_ACTIVE = CASE WHEN p_status = 'VERIFIED' THEN 1 ELSE 0 END,
        VERIFIED_AT = SYSDATE,
        VERIFIED_BY = p_admin_id
    WHERE THEATRE_ID = p_theatre_id;

    INSERT INTO AUDIT_LOG (
        LOG_ID, USER_ID, USER_ROLE, ACTION, ENTITY_TYPE, ENTITY_ID, DETAILS
    ) VALUES (
        AUDIT_LOG_SEQ.NEXTVAL, p_admin_id, 'ADMIN',
        'THEATRE_VERIFICATION', 'THEATRE', p_theatre_id,
        'Status: ' || p_status || ' | Remarks: ' || p_remarks
    );

    DBMS_OUTPUT.PUT_LINE('Theatre ID ' || p_theatre_id || ' status updated to ' || p_status);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error verifying theatre: ' || SQLERRM);
END VERIFY_THEATRE;
/

