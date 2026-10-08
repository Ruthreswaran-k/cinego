SET SERVEROUTPUT ON;
SET VERIFY OFF;
SET DEFINE ON;

PROMPT
PROMPT ==================================================
PROMPT          CINEGO MOVIE TICKET BOOKING SYSTEM
PROMPT              CINEMABOOK ADMIN PANEL
PROMPT ==================================================
PROMPT

----------------------------------------------------------
-- STEP 1 : ADD MOVIE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 1: ADD NEW MOVIE TO CATALOG
PROMPT ==================================================

ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '
ACCEPT movie_name CHAR PROMPT 'Enter Movie Name: '
ACCEPT language CHAR PROMPT 'Enter Language: '
ACCEPT genre CHAR PROMPT 'Enter Genre: '
ACCEPT duration NUMBER PROMPT 'Enter Duration in Minutes: '

BEGIN
    ADD_MOVIE(
        &movie_id,
        '&movie_name',
        '&language',
        '&genre',
        &duration
    );
END;
/

PROMPT
PROMPT Verifying Newly Added Movie:
PROMPT ==================================================

COLUMN TITLE FORMAT A25
COLUMN LANGUAGE FORMAT A12
COLUMN GENRE FORMAT A18
COLUMN STATUS FORMAT A12

SELECT MOVIE_ID,
       TITLE,
       LANGUAGE,
       GENRE,
       DURATION_MINUTES,
       STATUS
FROM MOVIES
WHERE MOVIE_ID = &movie_id;

----------------------------------------------------------
-- STEP 2 : UPDATE MOVIE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 2: UPDATE MOVIE DETAILS AND STATUS
PROMPT ==================================================

ACCEPT update_movie_id NUMBER PROMPT 'Enter Movie ID to Update: '
ACCEPT new_movie_name CHAR PROMPT 'Enter Updated Movie Name: '
ACCEPT movie_status CHAR PROMPT 'Enter Status (RUNNING/UPCOMING/COMPLETED): '

BEGIN
    UPDATE_MOVIE(
        &update_movie_id,
        '&new_movie_name',
        UPPER('&movie_status')
    );
END;
/

PROMPT
PROMPT Verifying Updated Movie Record:
PROMPT ==================================================

SELECT MOVIE_ID,
       TITLE,
       STATUS
FROM MOVIES
WHERE MOVIE_ID = &update_movie_id;

----------------------------------------------------------
-- STEP 3 : VERIFY PARTNER THEATRE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 3: VERIFY PARTNER THEATRE LICENSE
PROMPT ==================================================

ACCEPT verify_theatre_id NUMBER PROMPT 'Enter Theatre ID to Verify: '

BEGIN
    VERIFY_THEATRE(&verify_theatre_id);
END;
/

PROMPT
PROMPT Verifying Theatre Approval Status:
PROMPT ==================================================

SELECT THEATRE_ID,
       NAME,
       VERIFICATION_STATUS,
       IS_ACTIVE
FROM THEATRES
WHERE THEATRE_ID = &verify_theatre_id;

----------------------------------------------------------
-- STEP 4 : CREATE SHOW AND AUTO-SEAT GENERATION
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 4: SCHEDULE SHOW AND GENERATE SEATS
PROMPT ==================================================

ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '
ACCEPT show_movie_id NUMBER PROMPT 'Enter Movie ID: '
ACCEPT screen_id NUMBER PROMPT 'Enter Screen ID: '
ACCEPT admin_show_date CHAR PROMPT 'Enter Show Date (YYYY-MM-DD): '
ACCEPT admin_show_time CHAR PROMPT 'Enter Show Time: '
ACCEPT ticket_price NUMBER PROMPT 'Enter Base Price: '

BEGIN
    CREATE_SHOW(
        &show_id,
        &show_movie_id,
        &screen_id,
        TO_DATE('&admin_show_date','YYYY-MM-DD'),
        '&admin_show_time',
        &ticket_price
    );
END;
/

PROMPT
PROMPT Verifying Created Show AND Generated Seats:
PROMPT ==================================================

COLUMN BASE_PRICE FORMAT 999,999.99

SELECT SHOW_ID,
       MOVIE_ID,
       SCREEN_ID,
       SHOW_DATE,
       SHOW_TIME,
       BASE_PRICE,
       IS_ACTIVE
FROM SHOWS
WHERE SHOW_ID = &show_id;

SELECT COUNT(*) AS SEATS_GENERATED_FOR_SHOW
FROM SHOW_SEATS
WHERE SHOW_ID = &show_id;

----------------------------------------------------------
-- STEP 5 : PLATFORM BOOKING AND REVENUE REPORT
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 5: PLATFORM BOOKING AND REVENUE REPORT
PROMPT ==================================================

BEGIN
    VIEW_BOOKING_REPORT;
END;
/

PROMPT
PROMPT Platform revenue audit report rendered successfully.
PROMPT

----------------------------------------------------------
-- STEP 6 : REMOVE / ARCHIVE MOVIE
----------------------------------------------------------

PROMPT
PROMPT ==================================================
PROMPT STEP 6: REMOVE / ARCHIVE MOVIE
PROMPT ==================================================

ACCEPT remove_movie_id NUMBER PROMPT 'Enter Movie ID to Remove: '

BEGIN
    REMOVE_MOVIE(&remove_movie_id);
END;
/

PROMPT
PROMPT Verifying Movie Deactivation:
PROMPT ==================================================

SELECT MOVIE_ID,
       TITLE,
       STATUS
FROM MOVIES
WHERE MOVIE_ID = &remove_movie_id;

PROMPT
PROMPT ==================================================
PROMPT       ADMIN CATALOG OPERATIONS COMPLETED!
PROMPT ==================================================
PROMPT
