#!/usr/bin/env python3
"""
CineGo Movie Ticket Booking System - Demo Script PDF Generator
Generates a comprehensive, professional PDF matching the College Lab Evaluation format:
- Stakeholder 1: Customer Booking & Post-Booking Flow (Steps 1 to 19)
- Stakeholder 2: Theatre Manager Operations & Turnstile Gate Flow (Steps 20 to 24)
- Stakeholder 3: CinemaBook Platform Admin Governance Flow (Steps 25 to 30)

Each card features:
1. Operation Title with Accent
2. PROCEDURE / FUNCTION CALL Box (SQL*Plus ACCEPT + PL/SQL Block)
3. INPUT VALUES Table with field names and sample values to remember
4. VERIFICATION QUERY Box
5. SAY TO MAM Callout Box with student presentation speech
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Draw bottom footer
        self.drawString(40, 25, "Movie Ticket Booking System - Demo Script")
        self.drawRightString(letter[0] - 40, 25, f"Page {self._pageNumber} of {page_count}")
        
        # Subtle footer divider rule
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 36, letter[0] - 40, 36)
        
        self.restoreState()


def create_demo_pdf(filename="CineGo_PLSQL_Demo_Script_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    style_header_title = ParagraphStyle(
        'HeaderTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.white
    )

    style_header_sub = ParagraphStyle(
        'HeaderSub',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#94A3B8")
    )

    style_section_badge = ParagraphStyle(
        'SectionBadge',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=12,
        spaceAfter=6
    )

    style_card_title = ParagraphStyle(
        'CardTitle',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0F172A")
    )

    style_block_label = ParagraphStyle(
        'BlockLabel',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#475569")
    )

    style_code = ParagraphStyle(
        'CodeText',
        fontName='Courier',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#334155")
    )

    style_table_value = ParagraphStyle(
        'TableValue',
        fontName='Courier-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )

    style_say_label = ParagraphStyle(
        'SayLabel',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#047857")
    )

    style_say_text = ParagraphStyle(
        'SayText',
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#065F46")
    )

    style_note_text = ParagraphStyle(
        'NoteText',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#B91C1C")
    )

    story = []

    # 1. TOP HEADER BANNER
    banner_content = [
        [
            Paragraph("Movie Ticket Booking System", style_header_title),
        ],
        [
            Paragraph("PL/SQL Procedure Calls, Functions & Verification Demo Script (Oracle 21c)", style_header_sub)
        ]
    ]
    banner_table = Table(banner_content, colWidths=[letter[0] - 72])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E293B")),
        ('TOPPADDING', (0,0), (-1,-1), 16),
        ('BOTTOMPADDING', (0,0), (-1,-1), 16),
        ('LEFTPADDING', (0,0), (-1,-1), 18),
        ('RIGHTPADDING', (0,0), (-1,-1), 18),
        ('CORNERPAD', (0,0), (-1,-1), 8),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 14))

    # Helper function to generate standardized cards
    def build_card(
        card_num_title,
        proc_call_code,
        input_values_list,
        verif_query=None,
        say_to_mam=None,
        important_note=None
    ):
        card_elements = []

        # 1. Card Header
        card_elements.append(Paragraph(card_num_title, style_card_title))
        card_elements.append(Spacer(1, 4))
        card_elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#3B82F6"), spaceAfter=8))

        # 2. Procedure / Function Call Box
        card_elements.append(Paragraph("PROCEDURE / FUNCTION CALL:", style_block_label))
        card_elements.append(Spacer(1, 3))

        code_lines = proc_call_code.strip().replace("\n", "<br/>")
        code_p = Paragraph(code_lines, style_code)
        code_table = Table([[code_p]], colWidths=[letter[0] - 96])
        code_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        card_elements.append(code_table)
        card_elements.append(Spacer(1, 6))

        # 3. Input Values Table (if present)
        if input_values_list:
            card_elements.append(Paragraph("INPUT VALUES:", style_block_label))
            card_elements.append(Spacer(1, 3))

            table_rows = []
            for field, val in input_values_list:
                table_rows.append([
                    Paragraph(field, style_table_cell),
                    Paragraph(val, style_table_value)
                ])

            inputs_table = Table(table_rows, colWidths=[140, letter[0] - 96 - 140])
            inputs_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ]))
            card_elements.append(inputs_table)
            card_elements.append(Spacer(1, 6))

        # 4. Important Note (if present)
        if important_note:
            note_p = Paragraph(f"<b>Important:</b> {important_note}", style_note_text)
            note_table = Table([[note_p]], colWidths=[letter[0] - 96])
            note_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
                ('LINEBEFORE', (0,0), (0,0), 3, colors.HexColor("#EF4444")),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#FECACA")),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ]))
            card_elements.append(note_table)
            card_elements.append(Spacer(1, 6))

        # 5. Verification Query (if present)
        if verif_query:
            card_elements.append(Paragraph("VERIFICATION QUERY:", style_block_label))
            card_elements.append(Spacer(1, 3))

            v_lines = verif_query.strip().replace("\n", "<br/>")
            v_p = Paragraph(v_lines, style_code)
            v_table = Table([[v_p]], colWidths=[letter[0] - 96])
            v_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ]))
            card_elements.append(v_table)
            card_elements.append(Spacer(1, 6))

        # 6. Say To Mam Callout Box
        if say_to_mam:
            say_content = [
                Paragraph("SAY TO MAM:", style_say_label),
                Spacer(1, 2),
                Paragraph(f'"{say_to_mam}"', style_say_text)
            ]
            say_table = Table([[say_content]], colWidths=[letter[0] - 96])
            say_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
                ('LINEBEFORE', (0,0), (0,0), 3, colors.HexColor("#10B981")),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#A7F3D0")),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ]))
            card_elements.append(say_table)

        # Wrap in outer card container
        card_wrapper = Table([[card_elements]], colWidths=[letter[0] - 72])
        card_wrapper.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ]))
        return card_wrapper

    # =========================================================================
    # STAKEHOLDER 1: CUSTOMER LIFECYCLE OPERATIONS (Cards 1 to 19)
    # =========================================================================

    story.append(Paragraph("STAKEHOLDER 1: CUSTOMER BOOKING LIFECYCLE", style_section_badge))
    story.append(Spacer(1, 6))

    # 1. REGISTER CUSTOMER
    story.append(KeepTogether(build_card(
        "1. REGISTER CUSTOMER",
        """ACCEPT name CHAR PROMPT 'Enter Customer Name: '
ACCEPT email CHAR PROMPT 'Enter Email: '
ACCEPT mobile CHAR PROMPT 'Enter Mobile: '
ACCEPT password CHAR PROMPT 'Enter Password: '

BEGIN
    REGISTER_CUSTOMER('&name','&email','&mobile','&password');
END;
/""",
        [
            ("Name", "Vijay"),
            ("Email", "vijay@gmail.com"),
            ("Mobile", "9000000004"),
            ("Password", "1234")
        ],
        verif_query="""SELECT CUSTOMER_ID, NAME, EMAIL, MOBILE, ROLE
FROM CUSTOMERS
WHERE EMAIL='&email';""",
        say_to_mam="The customer is registered successfully. I am verifying the newly inserted customer record in the CUSTOMERS table."
    )))
    story.append(Spacer(1, 12))

    # 2. LOGIN CUSTOMER
    story.append(KeepTogether(build_card(
        "2. LOGIN CUSTOMER",
        """ACCEPT email CHAR PROMPT 'Enter Email: '
ACCEPT password CHAR PROMPT 'Enter Password: '

BEGIN
    LOGIN_CUSTOMER('&email','&password');
END;
/""",
        [
            ("Email", "vijay@gmail.com"),
            ("Password", "1234")
        ],
        say_to_mam="This procedure checks whether the entered email and password are valid using an implicit cursor and outputs the customer ID and role."
    )))
    story.append(PageBreak())

    # 3. SELECT LOCATION
    story.append(KeepTogether(build_card(
        "3. SELECT LOCATION",
        """BEGIN
    SELECT_LOCATION;
END;
/""",
        [
            ("Note", "No input required. Uses explicit cursor to display all active cinema locations.")
        ],
        say_to_mam="This displays all available cinema locations using an explicit cursor loop across the LOCATIONS table."
    )))
    story.append(Spacer(1, 12))

    # 4. SELECT MOVIE
    story.append(KeepTogether(build_card(
        "4. SELECT MOVIE",
        """ACCEPT loc_id NUMBER PROMPT 'Enter Location ID: '

BEGIN
    SELECT_MOVIE(&loc_id);
END;
/""",
        [
            ("Location ID", "2 (Puducherry)")
        ],
        say_to_mam="I selected location 2, which is Puducherry. Now the movies available in this location are displayed by joining SHOWS, SCREENS, and THEATRES."
    )))
    story.append(PageBreak())

    # 5. SELECT THEATRE
    story.append(KeepTogether(build_card(
        "5. SELECT THEATRE",
        """ACCEPT loc_id NUMBER PROMPT 'Enter Location ID: '
ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '

BEGIN
    SELECT_THEATRE(&loc_id, &movie_id);
END;
/""",
        [
            ("Location ID", "2 (Puducherry)"),
            ("Movie ID", "1 (Baththa)")
        ],
        say_to_mam="Now I am selecting the theatre exhibiting the chosen movie in Puducherry using an explicit cursor."
    )))
    story.append(Spacer(1, 12))

    # 6. SELECT SHOW
    story.append(KeepTogether(build_card(
        "6. SELECT SHOW",
        """ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '
ACCEPT theatre_id NUMBER PROMPT 'Enter Theatre ID: '
ACCEPT show_date CHAR PROMPT 'Enter Show Date (YYYY-MM-DD): '

BEGIN
    SELECT_SHOW(
        &movie_id,
        &theatre_id,
        TO_DATE('&show_date','YYYY-MM-DD')
    );
END;
/""",
        [
            ("Movie ID", "1 (Baththa)"),
            ("Theatre ID", "2 (PVR INOX, White Town)"),
            ("Show Date", "2026-10-05")
        ],
        say_to_mam="This displays the scheduled shows available for the selected movie, theatre, and date including screen name, time, and base price."
    )))
    story.append(PageBreak())

    # 7. VIEW AVAILABLE SEATS
    story.append(KeepTogether(build_card(
        "7. VIEW AVAILABLE SEATS",
        """ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '

BEGIN
    VIEW_AVAILABLE_SEATS(&show_id);
END;
/""",
        [
            ("Show ID", "501 (or 504)")
        ],
        important_note="Check the output and confirm that the seat you want to book is shown with STATUS = 'AVAILABLE'.",
        say_to_mam="Before booking, I am checking the available seats for this show. The cursor displays seat row, seat number, and ticket price."
    )))
    story.append(Spacer(1, 12))

    # 8. CALCULATE TICKET PRICE - FUNCTION
    story.append(KeepTogether(build_card(
        "8. CALCULATE TICKET PRICE — PL/SQL FUNCTION",
        """ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '
ACCEPT seat_count NUMBER PROMPT 'Enter Number of Seats: '

SELECT CALCULATE_TICKET_PRICE(&show_id, &seat_count) AS TOTAL_TICKET_PRICE
FROM DUAL;""",
        [
            ("Show ID", "501"),
            ("Number of Seats", "2")
        ],
        say_to_mam="This PL/SQL function calculates the total ticket price by fetching the base price from the SHOWS table and adding convenience fees of Rs 30 per seat."
    )))
    story.append(PageBreak())

    # 9. APPLY COUPON - FUNCTION
    story.append(KeepTogether(build_card(
        "9. APPLY COUPON — PL/SQL FUNCTION",
        """ACCEPT coupon_code CHAR PROMPT 'Enter Coupon Code: '
ACCEPT amount NUMBER PROMPT 'Enter Ticket Amount: '

SELECT APPLY_COUPON('&coupon_code', &amount) AS DISCOUNTED_AMOUNT
FROM DUAL;""",
        [
            ("Coupon Code", "WELCOME100"),
            ("Ticket Amount", "560")
        ],
        say_to_mam="This function validates the coupon against usage limits, expiry, and minimum order, applies the discount, and increments the coupon USED_COUNT."
    )))
    story.append(Spacer(1, 12))

    # 10. VIEW FOOD MENU
    story.append(KeepTogether(build_card(
        "10. VIEW FOOD MENU",
        """BEGIN
    VIEW_FOOD_MENU;
END;
/""",
        [
            ("Note", "No input required. Lists all available F&B popcorn, beverages, and combo packs.")
        ],
        say_to_mam="This procedure displays the available cinema concession snacks and beverages with item ID, category, and unit price."
    )))
    story.append(PageBreak())

    # 11. CREATE BOOKING
    story.append(KeepTogether(build_card(
        "11. CREATE BOOKING",
        """ACCEPT customer_id NUMBER PROMPT 'Enter Customer ID: '
ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '
ACCEPT show_seat_id NUMBER PROMPT 'Enter Show Seat ID: '

BEGIN
    CREATE_BOOKING(
        &customer_id,
        &show_id,
        &show_seat_id
    );
END;
/""",
        [
            ("Customer ID", "1001"),
            ("Show ID", "501"),
            ("Show Seat ID", "1 (Seat A1)")
        ],
        important_note="Trigger TRG_BOOK_SEAT automatically fires after insertion, updating the show seat status to BOOKED and generating a ticket record.",
        verif_query="""SELECT BOOKING_ID, CUSTOMER_ID, SHOW_ID, STATUS, TOTAL_AMOUNT
FROM BOOKINGS
WHERE CUSTOMER_ID = &customer_id
ORDER BY BOOKING_ID DESC;""",
        say_to_mam="The booking has been created. The AFTER INSERT trigger TRG_BOOK_SEAT marks the seat as BOOKED and generates the initial ticket record."
    )))
    story.append(Spacer(1, 12))

    # 12. ORDER FOOD
    story.append(KeepTogether(build_card(
        "12. ORDER FOOD CONCESSIONS",
        """ACCEPT booking_id NUMBER PROMPT 'Enter Booking ID: '
ACCEPT food_id NUMBER PROMPT 'Enter Food ID: '
ACCEPT quantity NUMBER PROMPT 'Enter Quantity: '

BEGIN
    ORDER_FOOD(
        &booking_id,
        &food_id,
        &quantity
    );
END;
/""",
        [
            ("Booking ID", "5001"),
            ("Food ID", "602 (Large Popcorn)"),
            ("Quantity", "1")
        ],
        verif_query="""SELECT FOOD_ORDER_ID, BOOKING_ID, FOOD_ID, QUANTITY, SUBTOTAL
FROM FOOD_ORDERS
WHERE BOOKING_ID = &booking_id;""",
        say_to_mam="The food order is inserted for this booking. The procedure calculates the subtotal from the FOOD table price and attaches it to the booking."
    )))
    story.append(PageBreak())

    # 13. PROCESS PAYMENT
    story.append(KeepTogether(build_card(
        "13. PROCESS PAYMENT",
        """ACCEPT booking_id NUMBER PROMPT 'Enter Booking ID: '
ACCEPT method CHAR PROMPT 'Enter Payment Method (UPI/CARD/NET_BANKING): '
ACCEPT amount NUMBER PROMPT 'Enter Payment Amount: '

BEGIN
    PROCESS_PAYMENT(
        &booking_id,
        '&method',
        &amount
    );
END;
/""",
        [
            ("Booking ID", "5001"),
            ("Payment Method", "UPI"),
            ("Payment Amount", "620")
        ],
        verif_query="""SELECT PAYMENT_ID, BOOKING_ID, PAYMENT_METHOD, AMOUNT, PAYMENT_STATUS
FROM PAYMENTS
WHERE BOOKING_ID = &booking_id;

-- Verify Booking Status Updated by Trigger:
SELECT BOOKING_ID, STATUS, FINAL_AMOUNT
FROM BOOKINGS
WHERE BOOKING_ID = &booking_id;""",
        say_to_mam="The payment record has been inserted. Trigger TRG_PAYMENT_CONFIRM automatically changes the booking status from PENDING to CONFIRMED."
    )))
    story.append(Spacer(1, 12))

    # 14. GENERATE E-TICKET
    story.append(KeepTogether(build_card(
        "14. GENERATE E-TICKET",
        """ACCEPT booking_id NUMBER PROMPT 'Enter Booking ID: '

BEGIN
    GENERATE_TICKET(&booking_id);
END;
/""",
        [
            ("Booking ID", "5001")
        ],
        verif_query="""SELECT TICKET_ID, BOOKING_ID, SHOW_SEAT_ID, STATUS, GENERATED_AT
FROM TICKETS
WHERE BOOKING_ID = &booking_id;""",
        say_to_mam="The e-ticket is generated by joining 8 relational tables (BOOKINGS, SHOWS, MOVIES, THEATRES, SCREENS, TICKETS, SHOW_SEATS, SEATS) with movie, theatre, showtime, seat, and price."
    )))
    story.append(PageBreak())

    # 15. VIEW BOOKING HISTORY
    story.append(KeepTogether(build_card(
        "15. VIEW BOOKING HISTORY",
        """ACCEPT customer_id NUMBER PROMPT 'Enter Customer ID: '

BEGIN
    VIEW_BOOKING_HISTORY(&customer_id);
END;
/""",
        [
            ("Customer ID", "1001")
        ],
        say_to_mam="This displays the complete booking history of the customer including past and confirmed reservations."
    )))
    story.append(Spacer(1, 12))

    # 16. CANCEL BOOKING
    story.append(KeepTogether(build_card(
        "16. CANCEL BOOKING",
        """ACCEPT booking_id NUMBER PROMPT 'Enter Booking ID: '
ACCEPT customer_id NUMBER PROMPT 'Enter Customer ID: '

BEGIN
    CANCEL_BOOKING(
        &booking_id,
        &customer_id
    );
END;
/""",
        [
            ("Booking ID", "5001"),
            ("Customer ID", "1001")
        ],
        verif_query="""SELECT BOOKING_ID, CUSTOMER_ID, STATUS, FINAL_AMOUNT
FROM BOOKINGS
WHERE BOOKING_ID = &booking_id;""",
        say_to_mam="The customer cancelled the reservation. Trigger TRG_RELEASE_SEAT automatically fires to release the seat, cancel the ticket, and initiate a refund."
    )))
    story.append(PageBreak())

    # 17. VERIFY SEAT RELEASE
    story.append(KeepTogether(build_card(
        "17. VERIFY SEAT RELEASE TRIGGER",
        """-- Check seat status after booking cancellation:
ACCEPT show_seat_id NUMBER PROMPT 'Enter Show Seat ID: '

SELECT SHOW_SEAT_ID, SHOW_ID, STATUS
FROM SHOW_SEATS
WHERE SHOW_SEAT_ID = &show_seat_id;""",
        [
            ("Show Seat ID", "1 (Seat A1)")
        ],
        important_note="Trigger TRG_RELEASE_SEAT automatically updates STATUS back to 'AVAILABLE' upon cancellation.",
        say_to_mam="When the booking was cancelled, the trigger automatically released the seat and changed its status back to AVAILABLE for other customers."
    )))
    story.append(Spacer(1, 12))

    # 18. VIEW REFUND STATUS
    story.append(KeepTogether(build_card(
        "18. VIEW REFUND STATUS",
        """ACCEPT booking_id NUMBER PROMPT 'Enter Booking ID: '

BEGIN
    VIEW_REFUND_STATUS(&booking_id);
END;
/""",
        [
            ("Booking ID", "5001")
        ],
        verif_query="""SELECT REFUND_ID, BOOKING_ID, AMOUNT, STATUS, REFUND_DATE
FROM REFUNDS
WHERE BOOKING_ID = &booking_id;""",
        say_to_mam="This procedure displays the refund record created automatically by TRG_RELEASE_SEAT with status INITIATED."
    )))
    story.append(PageBreak())

    # 19. ADD REVIEW
    story.append(KeepTogether(build_card(
        "19. ADD MOVIE REVIEW",
        """ACCEPT customer_id NUMBER PROMPT 'Enter Customer ID: '
ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '
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
/""",
        [
            ("Customer ID", "1001"),
            ("Movie ID", "1 (Baththa)"),
            ("Rating", "5"),
            ("Review Text", "Blockbuster action drama with outstanding music!")
        ],
        verif_query="""SELECT REVIEW_ID, CUSTOMER_ID, MOVIE_ID, RATING, TO_CHAR(REVIEW_TEXT) AS REVIEW
FROM REVIEWS
WHERE CUSTOMER_ID = &customer_id AND MOVIE_ID = &movie_id;""",
        say_to_mam="The customer review has been inserted and I am verifying it in the REVIEWS table. It prevents duplicate reviews per user for the same movie."
    )))
    story.append(PageBreak())

    # =========================================================================
    # STAKEHOLDER 2: THEATRE MANAGER OPERATIONS (Cards 20 to 24)
    # =========================================================================

    story.append(Paragraph("STAKEHOLDER 2: THEATRE MANAGER OPERATIONS", style_section_badge))
    story.append(Spacer(1, 6))

    # 20. REGISTER THEATRE
    story.append(KeepTogether(build_card(
        "20. THEATRE MANAGER — ONBOARD / REGISTER THEATRE",
        """ACCEPT theatre_id NUMBER PROMPT 'Enter Theatre ID: '
ACCEPT name CHAR PROMPT 'Enter Theatre Name: '
ACCEPT location_id NUMBER PROMPT 'Enter Location ID: '
ACCEPT address CHAR PROMPT 'Enter Address: '
ACCEPT phone CHAR PROMPT 'Enter Phone: '
ACCEPT email CHAR PROMPT 'Enter Email: '
ACCEPT manager_id NUMBER PROMPT 'Enter Manager Customer ID: '

BEGIN
    REGISTER_THEATRE(
        &theatre_id,
        '&name',
        &location_id,
        '&address',
        '&phone',
        '&email',
        &manager_id
    );
END;
/""",
        [
            ("Theatre ID", "209"),
            ("Name", "PVR Heritage Pondy"),
            ("Location ID", "2 (Puducherry)"),
            ("Address", "Mission Street, White Town, Puducherry"),
            ("Phone", "0413-2223344"),
            ("Email", "pondy@pvr.com"),
            ("Manager Customer ID", "1002")
        ],
        important_note="Newly registered theatres start with IS_VERIFIED = 0 until platform admin verifies licenses and safety clearance.",
        verif_query="""SELECT THEATRE_ID, NAME, LOCATION_ID, IS_VERIFIED, IS_ACTIVE
FROM THEATRES
WHERE THEATRE_ID = &theatre_id;""",
        say_to_mam="The theatre owner registers their cinema property with contact details. The system initializes it with IS_VERIFIED = 0 pending admin document verification."
    )))
    story.append(Spacer(1, 12))

    # 21. VIEW THEATRE BOOKINGS
    story.append(KeepTogether(build_card(
        "21. THEATRE MANAGER — VIEW THEATRE BOOKINGS",
        """ACCEPT theatre_id NUMBER PROMPT 'Enter Theatre ID: '

BEGIN
    VIEW_THEATRE_BOOKINGS(&theatre_id);
END;
/""",
        [
            ("Theatre ID", "2 (PVR INOX, White Town)")
        ],
        say_to_mam="This procedure allows the theatre manager to view all customer bookings, showtimes, seats, and gross revenue specific to their own theatre."
    )))
    story.append(PageBreak())

    # 22. AUDIT OCCUPANCY
    story.append(KeepTogether(build_card(
        "22. THEATRE MANAGER — AUDIT LIVE SEAT OCCUPANCY",
        """ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '

BEGIN
    VIEW_AVAILABLE_SEATS(&show_id);
END;
/""",
        [
            ("Show ID", "501")
        ],
        say_to_mam="The duty manager audits live screen occupancy and inspects available vs booked seats before admitting patrons at the turnstile gate."
    )))
    story.append(Spacer(1, 12))

    # 23. AUDIT CONCESSIONS
    story.append(KeepTogether(build_card(
        "23. THEATRE MANAGER — CONCESSIONS & FOOD INVENTORY",
        """BEGIN
    VIEW_FOOD_MENU;
END;
/""",
        [
            ("Note", "No input required. Lists active concession snacks, drinks, combos, and prices.")
        ],
        say_to_mam="This displays the cafeteria concession menu and prices for theatre staff to verify food order fulfillment."
    )))
    story.append(PageBreak())

    # 24. TURNSTILE TICKET SCAN AT GATE
    story.append(KeepTogether(build_card(
        "24. THEATRE MANAGER — VERIFY TURNSTILE TICKET AT GATE",
        """ACCEPT booking_id NUMBER PROMPT 'Enter Booking ID to Scan: '

BEGIN
    GENERATE_TICKET(&booking_id);
END;
/""",
        [
            ("Booking ID", "5001 (or Scanned QR ID)")
        ],
        verif_query="""SELECT TICKET_ID, BOOKING_ID, STATUS, GENERATED_AT
FROM TICKETS
WHERE BOOKING_ID = &booking_id;""",
        say_to_mam="When the customer arrives at the cinema gate, the duty manager scans the QR code or inputs the Booking ID to verify the movie title, auditorium screen, seat numbers, and ticket count before punching admission."
    )))
    story.append(PageBreak())

    # =========================================================================
    # STAKEHOLDER 3: PLATFORM ADMIN GOVERNANCE (Cards 25 to 30)
    # =========================================================================

    story.append(Paragraph("STAKEHOLDER 3: CINEMABOOK PLATFORM ADMIN GOVERNANCE", style_section_badge))
    story.append(Spacer(1, 6))

    # 25. ADMIN ADD MOVIE
    story.append(KeepTogether(build_card(
        "25. ADMIN — ADD MOVIE",
        """ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '
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
/""",
        [
            ("Movie ID", "107"),
            ("Movie Name", "Retro"),
            ("Language", "Tamil"),
            ("Genre", "Drama"),
            ("Duration", "160 mins")
        ],
        verif_query="""SELECT MOVIE_ID, TITLE, LANGUAGE, GENRE, DURATION_MINUTES, STATUS
FROM MOVIES
WHERE MOVIE_ID = &movie_id;""",
        say_to_mam="The platform admin adds a new movie release. The procedure initially creates it with UPCOMING status in the MOVIES table."
    )))
    story.append(Spacer(1, 12))

    # 26. ADMIN UPDATE MOVIE
    story.append(KeepTogether(build_card(
        "26. ADMIN — UPDATE MOVIE",
        """ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '
ACCEPT movie_name CHAR PROMPT 'Enter Updated Movie Name: '
ACCEPT status CHAR PROMPT 'Enter Status (RUNNING/UPCOMING/COMPLETED): '

BEGIN
    UPDATE_MOVIE(
        &movie_id,
        '&movie_name',
        '&status'
    );
END;
/""",
        [
            ("Movie ID", "107"),
            ("Updated Name", "Retro - Special Edition"),
            ("Status", "RUNNING")
        ],
        verif_query="""SELECT MOVIE_ID, TITLE, STATUS
FROM MOVIES
WHERE MOVIE_ID = &movie_id;""",
        say_to_mam="The movie details and release status have been updated. Customers can now book tickets since the status is RUNNING."
    )))
    story.append(PageBreak())

    # 27. ADMIN VERIFY THEATRE
    story.append(KeepTogether(build_card(
        "27. ADMIN — VERIFY PARTNER THEATRE",
        """ACCEPT theatre_id NUMBER PROMPT 'Enter Theatre ID to Verify: '

BEGIN
    VERIFY_THEATRE(&theatre_id);
END;
/""",
        [
            ("Theatre ID", "209")
        ],
        verif_query="""SELECT THEATRE_ID, NAME, IS_VERIFIED, IS_ACTIVE
FROM THEATRES
WHERE THEATRE_ID = &theatre_id;""",
        say_to_mam="CinemaBook admin verifies the theatre's commercial license and fire safety certificate, changing IS_VERIFIED to 1 so the cinema can host active shows."
    )))
    story.append(Spacer(1, 12))

    # 28. ADMIN CREATE SHOW
    story.append(KeepTogether(build_card(
        "28. ADMIN — CREATE SHOW & AUTO-SEAT GENERATION",
        """ACCEPT show_id NUMBER PROMPT 'Enter Show ID: '
ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID: '
ACCEPT screen_id NUMBER PROMPT 'Enter Screen ID: '
ACCEPT show_date CHAR PROMPT 'Enter Show Date (YYYY-MM-DD): '
ACCEPT show_time CHAR PROMPT 'Enter Show Time: '
ACCEPT price NUMBER PROMPT 'Enter Base Price: '

BEGIN
    CREATE_SHOW(
        &show_id,
        &movie_id,
        &screen_id,
        TO_DATE('&show_date','YYYY-MM-DD'),
        '&show_time',
        &price
    );
END;
/""",
        [
            ("Show ID", "507"),
            ("Movie ID", "1 (Baththa)"),
            ("Screen ID", "1"),
            ("Show Date", "2026-10-10"),
            ("Show Time", "07:30 PM"),
            ("Base Price", "200")
        ],
        important_note="CREATE_SHOW automatically generates SHOW_SEATS records for all physical seats in that screen with calculated seat tier pricing.",
        verif_query="""SELECT SHOW_ID, MOVIE_ID, SCREEN_ID, SHOW_DATE, SHOW_TIME, BASE_PRICE
FROM SHOWS
WHERE SHOW_ID = &show_id;

-- Verify Auto-Generated Seats:
SELECT COUNT(*) AS SEATS_GENERATED
FROM SHOW_SEATS
WHERE SHOW_ID = &show_id;""",
        say_to_mam="The admin creates a show. The procedure automatically creates SHOW_SEATS records for all seats in the screen, ready for customer reservations."
    )))
    story.append(PageBreak())

    # 29. ADMIN BOOKING REPORT
    story.append(KeepTogether(build_card(
        "29. ADMIN — PLATFORM BOOKING & REVENUE REPORT",
        """BEGIN
    VIEW_BOOKING_REPORT;
END;
/""",
        [
            ("Note", "No input required. Aggregates platform bookings, occupancy, and total revenue.")
        ],
        say_to_mam="This procedure displays platform-wide analytics using aggregation cursors across BOOKINGS to report total ticket bookings and gross revenue."
    )))
    story.append(Spacer(1, 12))

    # 30. ADMIN REMOVE MOVIE
    story.append(KeepTogether(build_card(
        "30. ADMIN — REMOVE / DEACTIVATE MOVIE",
        """ACCEPT movie_id NUMBER PROMPT 'Enter Movie ID to Remove: '

BEGIN
    REMOVE_MOVIE(&movie_id);
END;
/""",
        [
            ("Movie ID", "107")
        ],
        verif_query="""SELECT MOVIE_ID, TITLE, STATUS
FROM MOVIES
WHERE MOVIE_ID = &movie_id;""",
        say_to_mam="The admin soft-deletes the movie by updating its STATUS to CANCELLED, maintaining referential integrity for existing bookings."
    )))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated demo PDF successfully: {filename}")

if __name__ == '__main__':
    create_demo_pdf()
