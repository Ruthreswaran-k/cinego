import os
import sys
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
        self.setFillColor(colors.HexColor("#71717A"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "CineGo — Theatre Manager & Admin Operations Guide | Academic Project Viva")
            self.setStrokeColor(colors.HexColor("#E4E4E7"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "Confidential — CineGo Movie Ticket Booking System — Oracle Database & Full-Stack")
        self.setStrokeColor(colors.HexColor("#E4E4E7"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styling
    PRIMARY = colors.HexColor("#E50914") # CineGo Crimson
    DARK = colors.HexColor("#0F172A")
    TEXT = colors.HexColor("#1E293B")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    ACCENT_BLUE = colors.HexColor("#2563EB")
    ACCENT_GREEN = colors.HexColor("#059669")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=DARK,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT,
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderPadding=6,
        spaceAfter=6
    )

    speech_style = ParagraphStyle(
        'SpeechScript',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#0369A1"),
        backColor=colors.HexColor("#F0F9FF"),
        borderPadding=8,
        spaceAfter=8
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    story = []

    # Title Banner
    story.append(Paragraph("🎬 CINEGO MOVIE TICKET BOOKING SYSTEM", title_style))
    story.append(Paragraph("<b>Comprehensive Role Guide: Theatre Manager vs. System Admin</b><br/>Operational Options, Database Architecture, and Project Viva Presentation Script", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=14))

    # Executive Overview
    story.append(Paragraph("1. System Overview & Role Separation (RBAC)", h1_style))
    story.append(Paragraph(
        "CineGo implements a secure <b>Role-Based Access Control (RBAC)</b> architecture separating operational responsibilities. "
        "The system distinguishes between internal operational branch duties (<b>Theatre Manager</b>) and enterprise platform oversight (<b>CinemaBook Admin</b>). "
        "This enforces the <i>Principle of Least Privilege</i> in database management systems.",
        body_style
    ))

    # Comparison Table
    role_table_data = [
        [
            Paragraph("<b>Dimension</b>", body_style),
            Paragraph("<b>THEATRE MANAGER</b>", body_style),
            Paragraph("<b>CINEMABOOK ADMIN</b>", body_style)
        ],
        [
            Paragraph("<b>Target Scope</b>", body_style),
            Paragraph("Single Theatre Property / Branch (e.g. PVR Grand Mall)", body_style),
            Paragraph("Entire Global Platform (All Theatres, Movies, Cities)", body_style)
        ],
        [
            Paragraph("<b>Core Focus</b>", body_style),
            Paragraph("Onboarding, Gate Entry, Occupancy & Daily Concessions", body_style),
            Paragraph("Catalog Governance, Partner Verification, Global Analytics", body_style)
        ],
        [
            Paragraph("<b>Web Portal Route</b>", body_style),
            Paragraph("<code>/manager</code> (Manager Command Center)", body_style),
            Paragraph("<code>/admin</code> (Admin Master Console)", body_style)
        ],
        [
            Paragraph("<b>CLI / SQL Flow</b>", body_style),
            Paragraph("<code>@database/manager_flow.sql</code>", body_style),
            Paragraph("<code>@database/admin_flow.sql</code>", body_style)
        ],
        [
            Paragraph("<b>Key PL/SQL Procedures</b>", body_style),
            Paragraph("REGISTER_THEATRE, VIEW_THEATRE_BOOKINGS, GENERATE_TICKET", body_style),
            Paragraph("ADD_MOVIE, UPDATE_MOVIE, VERIFY_THEATRE, CREATE_SHOW, VIEW_BOOKING_REPORT", body_style)
        ]
    ]
    t = Table(role_table_data, colWidths=[110, 195, 195])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EDE9FE")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # SECTION 2: THEATRE MANAGER
    story.append(Paragraph("2. Theatre Manager: Options & Operations Explained", h1_style))
    story.append(Paragraph(
        "A Theatre Manager represents the venue owner or operational supervisor of a specific cinema branch. "
        "Their capabilities ensure smooth daily theater operations, gate security, and concession management.",
        body_style
    ))

    mgr_options = [
        ("Option 1: Register / Onboard Theatre Property", 
         "<b>PL/SQL Procedure:</b> <code>REGISTER_THEATRE(...)</code><br/>"
         "<b>What it does:</b> Captures cinema branch legal data including Theatre ID, Name, City Location ID, Physical Address, License Number, GSTIN, Fire Safety NOC, and Duty Manager ID. New registrations start in <i>'PENDING'</i> status awaiting central Admin approval."),
        
        ("Option 2: View Theatre Bookings & Revenue", 
         "<b>PL/SQL Procedure:</b> <code>VIEW_THEATRE_BOOKINGS(p_theatre_id)</code><br/>"
         "<b>What it does:</b> Executes an explicit cursor joining <code>BOOKINGS</code>, <code>SHOWS</code>, and <code>MOVIES</code>. It outputs ticket sales, customer names, seat numbers, and total revenue earned specifically for that theater."),

        ("Option 3: Real-Time Seat Occupancy Audit", 
         "<b>PL/SQL Procedure:</b> <code>VIEW_AVAILABLE_SEATS(p_show_id)</code><br/>"
         "<b>What it does:</b> Displays the real-time status of every seat in the auditorium for an active showtime. Shows which seats are <code>AVAILABLE</code>, <code>LOCKED</code> by online customers, or <code>BOOKED</code>."),

        ("Option 4: Audit Cafeteria & Food Menu", 
         "<b>PL/SQL Procedure:</b> <code>VIEW_FOOD_MENU</code><br/>"
         "<b>What it does:</b> Lists all available cafeteria food items, category (Snacks, Combos, Beverages), pricing, and dietary classification (Veg/Non-Veg) for customer concessions."),

        ("Option 5: Turnstile Gate Admission & Ticket Verification", 
         "<b>PL/SQL Procedure:</b> <code>GENERATE_TICKET(p_booking_id)</code> & Query on <code>TICKETS</code><br/>"
         "<b>What it does:</b> Scans customer E-tickets or Booking IDs at cinema gate turnstiles. Validates that the ticket is in <code>ACTIVE</code> status, displays seat assignments, and updates status to prevent double-entry.")
    ]

    for opt_title, opt_desc in mgr_options:
        story.append(Paragraph(opt_title, h2_style))
        story.append(Paragraph(opt_desc, body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))

    # SECTION 3: CINEMABOOK ADMIN
    story.append(Paragraph("3. CinemaBook Admin: Options & Governance Explained", h1_style))
    story.append(Paragraph(
        "The System Administrator possesses platform-wide governance permissions across the entire multi-city catalog, legal verifications, and financial auditing.",
        body_style
    ))

    admin_options = [
        ("Option 1: Add New Movie to Master Catalog", 
         "<b>PL/SQL Procedure:</b> <code>ADD_MOVIE(p_movie_id, p_title, p_language, p_genre, p_duration)</code><br/>"
         "<b>What it does:</b> Inserts new cinematic release records into <code>MOVIES</code> table with certification, genre, and duration. Default release status begins as <i>'RUNNING'</i> or <i>'UPCOMING'</i>."),

        ("Option 2: Update Movie Metadata & Lifecycle", 
         "<b>PL/SQL Procedure:</b> <code>UPDATE_MOVIE(p_movie_id, p_title, p_status)</code><br/>"
         "<b>What it does:</b> Updates movie titles and shifts screening status from <i>'UPCOMING'</i> to <i>'RUNNING'</i> to <i>'COMPLETED'</i>, directly controlling public visibility in booking searches."),

        ("Option 3: Verify & Approve Partner Theatres", 
         "<b>PL/SQL Procedure:</b> <code>VERIFY_THEATRE(p_theatre_id)</code><br/>"
         "<b>What it does:</b> Reviews legal license and safety NOC credentials submitted by Theatre Managers. Updates <code>VERIFICATION_STATUS</code> to <i>'APPROVED'</i> and activates the property (<code>IS_ACTIVE = 1</code>)."),

        ("Option 4: Schedule Shows with Automated Seat Matrix Generation", 
         "<b>PL/SQL Procedure:</b> <code>CREATE_SHOW(p_show_id, p_movie_id, p_screen_id, p_show_date, p_show_time, p_base_price)</code><br/>"
         "<b>What it does:</b> Creates show screening record AND dynamically iterates through all seats configured in that screen, generating fresh <code>SHOW_SEATS</code> entries in <code>'AVAILABLE'</code> state in one transaction!"),

        ("Option 5: Platform-Wide Booking & Revenue Audit Report", 
         "<b>PL/SQL Procedure:</b> <code>VIEW_BOOKING_REPORT</code><br/>"
         "<b>What it does:</b> Executes analytical aggregations across all bookings: calculates Gross Merchandise Value (GMV), total discount deductions, platform convenience fee totals, and confirmed ticket counts."),

        ("Option 6: Archive / Deactivate Movie (Soft Delete)", 
         "<b>PL/SQL Procedure:</b> <code>REMOVE_MOVIE(p_movie_id)</code><br/>"
         "<b>What it does:</b> Soft-deletes movies by toggling status to <i>'CANCELLED'</i> rather than destructive DELETE, maintaining referential integrity across prior customer tickets and historical audit tables.")
    ]

    for opt_title, opt_desc in admin_options:
        story.append(Paragraph(opt_title, h2_style))
        story.append(Paragraph(opt_desc, body_style))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    # SECTION 4: HOW TO EXPLAIN TO MAM
    story.append(Paragraph("4. How to Explain to Mam (Viva Presentation Script)", h1_style))
    story.append(Paragraph(
        "Follow this structured 4-step script during your project presentation or external viva examination. "
        "It covers your architectural rationale, role distinctions, and technical depth.",
        body_style
    ))

    # Speech Step 1
    story.append(Paragraph("Step 1: Introduction & Architecture Overview (Say this first)", h2_style))
    script_1 = (
        "<i>\"Respected Ma'am, our project <b>CineGo</b> is a next-generation full-stack movie ticket booking system built on an enterprise 3-tier architecture: "
        "a high-performance React TypeScript frontend, a Node.js REST API layer, and an Oracle 21c Database engine utilizing PL/SQL procedures, functions, packages, and automated triggers.<br/><br/>"
        "To enforce data security and business integrity, we implemented <b>Role-Based Access Control (RBAC)</b> with three distinct user actors: "
        "<b>Customer</b>, <b>Theatre Manager</b>, and <b>CinemaBook System Admin</b>. Today, I would like to demonstrate the operational differences between the Theatre Manager and Admin flows.\"</i>"
    )
    story.append(Paragraph(script_1, speech_style))

    # Speech Step 2
    story.append(Paragraph("Step 2: Explaining the Theatre Manager Flow (Say this next)", h2_style))
    script_2 = (
        "<i>\"Ma'am, the <b>Theatre Manager</b> handles the local branch operations for a cinema property like PVR Grand Mall. Their key responsibilities are:<br/>"
        "1. <b>Venue Registration:</b> They submit their cinema details, GSTIN, and safety licenses using the <code>REGISTER_THEATRE</code> stored procedure.<br/>"
        "2. <b>Real-Time Occupancy:</b> Before and during a show, they audit the auditorium seat matrix using <code>VIEW_AVAILABLE_SEATS</code> to monitor real-time occupancy.<br/>"
        "3. <b>Revenue Tracking:</b> They use <code>VIEW_THEATRE_BOOKINGS</code> with an explicit cursor to inspect ticket revenues generated specifically at their branch.<br/>"
        "4. <b>Turnstile Gate Verification:</b> At the entry gate, our system allows the manager to scan the customer's QR ticket. Under the hood, this executes <code>GENERATE_TICKET</code> and queries the <code>TICKETS</code> table to verify the ticket is active and prevent fraudulent double-admissions.\"</i>"
    )
    story.append(Paragraph(script_2, speech_style))

    # Speech Step 3
    story.append(Paragraph("Step 3: Explaining the CinemaBook Admin Flow (Say this next)", h2_style))
    script_3 = (
        "<i>\"In contrast, the <b>CinemaBook Admin</b> holds platform-wide governance over all theaters and movies across all cities:<br/>"
        "1. <b>Catalog Management:</b> Using <code>ADD_MOVIE</code> and <code>UPDATE_MOVIE</code>, the Admin maintains release dates, certifications, and movie statuses.<br/>"
        "2. <b>Partner Verification:</b> Admin reviews the safety and license documents submitted by Theatre Managers and approves them via <code>VERIFY_THEATRE</code>.<br/>"
        "3. <b>Show & Automated Seat Generation:</b> When scheduling a screening with <code>CREATE_SHOW</code>, our Oracle procedure automatically loops through all screen seats and populates the <code>SHOW_SEATS</code> table in a single atomic transaction.<br/>"
        "4. <b>Platform Auditing & Soft Deletes:</b> Admin runs <code>VIEW_BOOKING_REPORT</code> for global revenue analytics and archives retired movies via <code>REMOVE_MOVIE</code> with soft-delete semantics to maintain referential integrity with past tickets.\"</i>"
    )
    story.append(Paragraph(script_3, speech_style))

    # SECTION 5: TOP VIVA QUESTIONS & ANSWERS
    story.append(Paragraph("5. Top 5 Viva Questions & Bulletproof Answers", h1_style))

    qa_list = [
        ("Q1: Why use PL/SQL stored procedures instead of putting all logic in Node.js / JavaScript?",
         "<b>Answer:</b> <i>\"Ma'am, executing business rules inside Oracle PL/SQL ensures maximum performance and security. It eliminates network round-trips by running logic close to the data, enforces centralized ACID transaction control, and prevents SQL injection because all parameters are strongly typed and bound.\"</i>"),

        ("Q2: How does the system handle concurrent seat selection by two users simultaneously?",
         "<b>Answer:</b> <i>\"Ma'am, we utilize Oracle transaction row-locking. When a user selects a seat, its status shifts from 'AVAILABLE' to 'LOCKED' with a locked timestamp. If another customer attempts to book the same seat simultaneously, our UNIQUE constraint on (SHOW_ID, SEAT_ID) and WHERE STATUS = 'AVAILABLE' clause prevents race conditions and overbooking.\"</i>"),

        ("Q3: What happens in the database when a booking is cancelled?",
         "<b>Answer:</b> <i>\"Ma'am, cancellation triggers our automated trigger <code>TRG_RELEASE_SEAT</code> on the <code>BOOKINGS</code> table. Upon status change to 'CANCELLED', the trigger automatically releases all associated seats back to 'AVAILABLE', marks tickets as 'CANCELLED', and generates an audit record in the <code>REFUNDS</code> table.\"</i>"),

        ("Q4: Why does REMOVE_MOVIE do a soft-delete instead of a SQL DELETE statement?",
         "<b>Answer:</b> <i>\"Ma'am, a hard DELETE would violate Foreign Key referential integrity because existing BOOKINGS and TICKETS reference that MOVIE_ID. Changing STATUS to 'CANCELLED' or 'COMPLETED' preserves historical audit ledgers and financial accounting.\"</i>"),

        ("Q5: How does the Admin show scheduler automatically create seats?",
         "<b>Answer:</b> <i>\"Ma'am, inside <code>CREATE_SHOW</code>, we run an <code>INSERT INTO SHOW_SEATS SELECT ... FROM SEATS WHERE SCREEN_ID = p_screen_id</code>. This copies every physical seat blueprint into the show instance in O(1) database time.\"</i>")
    ]

    for q_text, a_text in qa_list:
        story.append(Paragraph(f"<b>{q_text}</b>", h2_style))
        story.append(Paragraph(a_text, body_style))
        story.append(Spacer(1, 2))

    # Footer note
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=8))
    story.append(Paragraph("<b>Project:</b> CineGo Movie Ticket Booking System &bull; <b>Author:</b> Ruthra K &bull; <b>Database:</b> Oracle Database 21c XE", body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF built successfully: {filename}")

if __name__ == '__main__':
    target = os.path.join(os.getcwd(), 'CineGo_Manager_and_Admin_Guide.pdf')
    build_pdf(target)
