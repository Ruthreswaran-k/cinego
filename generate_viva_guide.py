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
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "CineGo — End-to-End Architecture, Data Storage & Viva Defense Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "CineGo Architecture Defense Guide &bull; Student Project Viva &bull; Author: Ruthra K")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_viva_guide_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    PRIMARY = colors.HexColor("#E50914") # Crimson Red
    DARK = colors.HexColor("#0F172A")
    TEXT = colors.HexColor("#1E293B")
    BLUE = colors.HexColor("#0284C7")
    GREEN = colors.HexColor("#059669")
    PURPLE = colors.HexColor("#7C3AED")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569"),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=DARK,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT,
        spaceAfter=5
    )

    speech_style = ParagraphStyle(
        'SpeechScript',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#0369A1"),
        backColor=colors.HexColor("#F0F9FF"),
        borderPadding=7,
        spaceAfter=7
    )

    step_box = ParagraphStyle(
        'StepBox',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK,
        backColor=colors.HexColor("#F8FAFC"),
        borderPadding=6,
        spaceAfter=5
    )

    story = []

    # Title Banner
    story.append(Paragraph("🎬 CINEGO ARCHITECTURE & VIVA DEFENSE GUIDE", title_style))
    story.append(Paragraph("<b>End-to-End Data Flow: Where Data is Stored, Image Handling, and API Access</b><br/>Complete Viva Answers and Presentation Script for Evaluators", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=10))

    # SECTION 1: QUESTION 1
    story.append(Paragraph("1. Question 1: \"When a user books a ticket in UI, WHERE is it stored?\"", h1_style))
    story.append(Paragraph(
        "<b>Direct Answer to Mam:</b> <i>\"Ma'am, booking a ticket in our React UI triggers a coordinated 4-table persistence pipeline inside our Oracle 21c Database, governed by automated database triggers and sequences.\"</i>",
        speech_style
    ))
    story.append(Paragraph(
        "Here is the exact step-by-step lifecycle of where and how the booking is stored:",
        body_style
    ))

    flow_data = [
        [
            Paragraph("<b>Step & Component</b>", body_style),
            Paragraph("<b>Target Oracle Table</b>", body_style),
            Paragraph("<b>What Gets Saved & Database Action</b>", body_style)
        ],
        [
            Paragraph("<b>1. Booking Master Record</b><br/>(React UI &rarr; API &rarr; SQL)", body_style),
            Paragraph("<b><code>BOOKINGS</code></b>", body_style),
            Paragraph("Creates master booking record with <code>BOOKING_ID</code> from <code>BOOKING_SEQ.NEXTVAL</code>. Stores <code>CUSTOMER_ID</code>, <code>SHOW_ID</code>, <code>NUM_SEATS</code>, <code>TOTAL_AMOUNT</code>, <code>FINAL_AMOUNT</code>, and initial <code>STATUS = 'PENDING'</code>.", body_style)
        ],
        [
            Paragraph("<b>2. Instant Seat Lock</b><br/>(Database Trigger fires)", body_style),
            Paragraph("<b><code>SHOW_SEATS</code></b>", body_style),
            Paragraph("Automated Trigger <b><code>TRG_BOOK_SEAT</code></b> fires upon insert on <code>BOOKINGS</code>. It updates <code>STATUS = 'BOOKED'</code> on the selected <code>SHOW_SEAT_ID</code>, preventing any other user from selecting those seats.", body_style)
        ],
        [
            Paragraph("<b>3. E-Ticket Generation</b><br/>(Trigger Action)", body_style),
            Paragraph("<b><code>TICKETS</code></b>", body_style),
            Paragraph("Trigger <b><code>TRG_BOOK_SEAT</code></b> simultaneously generates an official ticket record in <code>TICKETS</code> using <code>TICKET_SEQ.NEXTVAL</code> with <code>STATUS = 'ACTIVE'</code>, linking <code>BOOKING_ID</code> and <code>SHOW_SEAT_ID</code>.", body_style)
        ],
        [
            Paragraph("<b>4. Payment Confirmation</b><br/>(Simulated / Gateway)", body_style),
            Paragraph("<b><code>PAYMENTS</code></b> &rarr; <b><code>BOOKINGS</code></b>", body_style),
            Paragraph("Stores payment receipt in <code>PAYMENTS</code> (<code>PAYMENT_SEQ.NEXTVAL</code>, amount, method, status). Trigger <b><code>TRG_PAYMENT_CONFIRM</code></b> flips <code>BOOKINGS.STATUS = 'CONFIRMED'</code>.", body_style)
        ],
        [
            Paragraph("<b>5. Concessions (Optional)</b><br/>(Food & Snacks Cart)", body_style),
            Paragraph("<b><code>FOOD_ORDERS</code></b>", body_style),
            Paragraph("If snacks are selected, saves line items into <code>FOOD_ORDERS</code> with <code>FOOD_ID</code>, quantity, and subtotal linked to the parent <code>BOOKING_ID</code>.", body_style)
        ]
    ]
    t_flow = Table(flow_data, colWidths=[120, 110, 270])
    t_flow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FEE2E2")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_flow)
    story.append(Spacer(1, 8))

    # SECTION 2: QUESTION 2
    story.append(Paragraph("2. Question 2: \"Where are the photos taken from and where are they saved?\"", h1_style))
    story.append(Paragraph(
        "<b>Direct Answer to Mam:</b> <i>\"Ma'am, in modern enterprise software, high-resolution multimedia files are NEVER stored as raw binary BLOBs inside relational database tables. Storing heavy images in relational tables degrades query speed, causes database bloat, and crashes connection pools.\"</i>",
        speech_style
    ))
    story.append(Paragraph("<b>The 3 Pillars of Image Architecture in CineGo:</b>", h2_style))

    image_points = [
        ("1. Database Storage (Metadata URLs):", 
         "The Oracle database stores optimized <b>CDN URI strings</b> in <code>VARCHAR2(500)</code> columns: <code>MOVIES.POSTER_URL</code>, <code>MOVIES.BACKDROP_URL</code>, <code>FOOD.IMAGE_URL</code>, and <code>CUSTOMERS.PROFILE_IMAGE</code>. The database stores the pointer; the browser fetches the optimized image asset directly from the CDN."),

        ("2. Media Source & CDN Providers:", 
         "Posters and cinema backdrops are hosted on ultra-fast Content Delivery Networks (Unsplash Cinema CDN, Cloudinary/Supabase CDN, and local public web assets in <code>/public/posters/</code>). They leverage automatic WebP compression, lazy loading, and hardware GPU acceleration."),

        ("3. Dynamic QR Code Tickets (Generated On-the-Fly):", 
         "The E-Ticket QR code shown at the cinema turnstile gate is <b>dynamically generated in real-time</b> by the <code>qrcode.react</code> library in the frontend and <code>qrcode</code> on the backend. It encodes the unique cryptographic hash: <code>{ bookingId: 5001, seats: ['A1','A2'], verifyToken: 'SECURE_HASH' }</code>. No static QR images are stored, saving disk space!")
    ]
    for p_title, p_desc in image_points:
        story.append(Paragraph(f"<b>{p_title}</b> {p_desc}", body_style))

    story.append(Spacer(1, 8))

    # SECTION 3: QUESTION 3
    story.append(Paragraph("3. Question 3: \"How does the API access the Database and Frontend?\"", h1_style))
    story.append(Paragraph(
        "<b>Direct Answer to Mam:</b> <i>\"Ma'am, our system uses an Enterprise 3-Tier Client-Server Architecture: Frontend (Presentation Tier) &harr; REST API (Application Tier) &harr; Oracle Database (Data Tier).\"</i>",
        speech_style
    ))

    arch_data = [
        [
            Paragraph("<b>Tier</b>", body_style),
            Paragraph("<b>Technology</b>", body_style),
            Paragraph("<b>How It Communicates & Operates</b>", body_style)
        ],
        [
            Paragraph("<b>Tier 1: Presentation (Frontend)</b>", body_style),
            Paragraph("React 18 + Vite + TypeScript", body_style),
            Paragraph("Uses <b>Axios HTTP Client</b> (<code>apiClient.ts</code>) configured with <code>baseURL: '/api'</code>. Sends asynchronous JSON payloads with JWT tokens: <code>POST /api/bookings</code>, <code>POST /api/payments</code>.", body_style)
        ],
        [
            Paragraph("<b>Tier 2: Application (REST API)</b>", body_style),
            Paragraph("Node.js + Express + TypeScript", body_style),
            Paragraph("Listens on <code>PORT 3000 / 10000</code>. Intercepts incoming requests, validates schema using <b>Zod</b>, checks JWT security, and dispatches to business services (<code>bookingService.ts</code>).", body_style)
        ],
        [
            Paragraph("<b>Tier 3: Data Access (Database Connector)</b>", body_style),
            Paragraph("Oracle Database 21c XE + <code>oracledb</code> Pool", body_style),
            Paragraph("The backend maintains an active <b>Oracle Connection Pool</b> (<code>config/database.ts</code>) via <code>localhost:1522/XEPDB1</code>. It invokes PL/SQL stored procedures (<code>CREATE_BOOKING</code>, <code>PROCESS_PAYMENT</code>) using safe <b>bind parameters</b> (<code>:p_customer_id</code>) to guarantee ACID atomicity and prevent SQL injection.", body_style)
        ]
    ]
    t_arch = Table(arch_data, colWidths=[110, 110, 280])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EFF6FF")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 8))

    story.append(PageBreak())

    # SECTION 4: EXACT SCRIPT TO EXPLAIN TO MAM
    story.append(Paragraph("4. Word-for-Word Script to Explain to Mam (Viva Presentation)", h1_style))
    story.append(Paragraph(
        "When Mam asks you questions about where data is stored, how photos work, or how the API connects, speak this exact response:",
        body_style
    ))

    viva_speech = (
        "<i>\"Respected Ma'am, let me walk you through the complete end-to-end flow of our CineGo application:<br/><br/>"
        "<b>1. When a user books a ticket in our UI:</b><br/>"
        "The customer selects seats on our interactive Seat Map and clicks 'Pay'. The React frontend sends an HTTP POST request to our Express REST API at <code>/api/bookings</code>. "
        "The API calls our Oracle stored procedure <code>CREATE_BOOKING</code> using bind parameters. "
        "Inside Oracle 21c, the master record is inserted into the <b><code>BOOKINGS</code></b> table with a generated sequence ID. "
        "Immediately, an automated trigger <b><code>TRG_BOOK_SEAT</code></b> fires to update the <b><code>SHOW_SEATS</code></b> table to 'BOOKED' and generates an official admission entry in the <b><code>TICKETS</code></b> table. "
        "Upon payment completion, the <b><code>PAYMENTS</code></b> table records the receipt, and trigger <b><code>TRG_PAYMENT_CONFIRM</code></b> marks the booking 'CONFIRMED'.<br/><br/>"
        "<b>2. Regarding photo and media storage:</b><br/>"
        "We follow industry standards by storing <b>image URI pointers</b> in Oracle's <code>VARCHAR2(500)</code> columns—specifically <code>POSTER_URL</code> and <code>BACKDROP_URL</code> in the <code>MOVIES</code> table. "
        "The actual binary images are served through fast CDNs with modern WebP compression. This keeps our database lightweight and high-performing. "
        "Furthermore, our E-Ticket QR codes are dynamically generated in real-time by the frontend using booking encryption hashes, so no static QR images take up server disk space.<br/><br/>"
        "<b>3. How the API accesses the database and frontend:</b><br/>"
        "Our frontend connects to the backend over REST HTTP endpoints via Axios. "
        "The Node.js backend maintains an active <b>Oracle connection pool</b> via the official <code>oracledb</code> native driver. "
        "Every database action is executed through compiled PL/SQL stored procedures and explicit cursors with ACID transaction commits. "
        "Once Oracle commits the transaction, the API returns a JSON response to React, which dynamically routes the user to their confirmed E-Ticket with confetti celebration.\"</i>"
    )
    story.append(Paragraph(viva_speech, speech_style))

    # SECTION 5: QUICK RAPID-FIRE VIVA DEFENSE
    story.append(Paragraph("5. Rapid-Fire Teacher Questions & 10-Second Answers", h1_style))

    rapid_fire = [
        ("Mam: \"Where is the customer password saved?\"",
         "<b>You:</b> \"Ma'am, in the <code>CUSTOMERS</code> table under <code>PASSWORD_HASH VARCHAR2(255)</code>. We never store plain text passwords; they are hashed using secure cryptographic hashing.\""),

        ("Mam: \"What sequence generates the Booking ID?\"",
         "<b>You:</b> \"Ma'am, <code>BOOKING_SEQ</code>, which starts at 5000 so customer-facing booking numbers are clean and professional.\""),

        ("Mam: \"What happens if the user closes the tab before paying?\"",
         "<b>You:</b> \"Ma'am, the seat remains temporarily locked with a 10-minute timestamp (<code>LOCKED_AT</code> in <code>SHOW_SEATS</code>). If payment is not completed, our scheduled unlock function automatically frees the seat back to 'AVAILABLE'.\""),

        ("Mam: \"Can you show me the SQL tables right now?\"",
         "<b>You:</b> \"Yes Ma'am! We can open SQL*Plus or SQL Developer and run <code>SELECT * FROM BOOKINGS;</code> and <code>SELECT * FROM SHOW_SEATS WHERE STATUS='BOOKED';</code> to see the live records!\"")
    ]

    for q, a in rapid_fire:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=6))
    story.append(Paragraph("<b>CineGo Movie Ticket Booking System</b> &bull; Oracle Database 21c XE &bull; React TypeScript &bull; Express REST API &bull; Author: Ruthra K", body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Viva Guide PDF built successfully: {filename}")

if __name__ == '__main__':
    target = os.path.join(os.getcwd(), 'CineGo_Viva_Architecture_and_Data_Guide.pdf')
    build_viva_guide_pdf(target)
