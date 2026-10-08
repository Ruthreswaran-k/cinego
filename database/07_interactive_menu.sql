SET SERVEROUTPUT ON;
SET VERIFY OFF;
SET DEFINE ON;

PROMPT
PROMPT ==================================================
PROMPT          CINEGO MOVIE TICKET BOOKING SYSTEM
PROMPT              MASTER INTERACTIVE MENU
PROMPT ==================================================
PROMPT
PROMPT  1. CUSTOMER FLOW (End-to-End Booking Lifecycle)
PROMPT  2. THEATRE MANAGER FLOW (Operations and Gate Verification)
PROMPT  3. CINEMABOOK ADMIN FLOW (Governance and Catalog Management)
PROMPT  4. EXIT
PROMPT ==================================================

ACCEPT main_option NUMBER PROMPT 'Enter Option: '

COLUMN script_to_run NEW_VALUE script_name NOPRINT;

SELECT CASE &main_option
         WHEN 1 THEN 'C:\Users\RUTHRA\Documents\projectWE\CineGo\database\customer_flow.sql'
         WHEN 2 THEN 'C:\Users\RUTHRA\Documents\projectWE\CineGo\database\manager_flow.sql'
         WHEN 3 THEN 'C:\Users\RUTHRA\Documents\projectWE\CineGo\database\admin_flow.sql'
         ELSE 'C:\Users\RUTHRA\Documents\projectWE\CineGo\database\exit.sql'
       END AS script_to_run
FROM DUAL;

@&script_name
