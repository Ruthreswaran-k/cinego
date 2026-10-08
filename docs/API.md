# CineGo — REST API Reference & Specification

Base URL: `http://localhost:3000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### Register Customer
- **Endpoint**: `POST /api/auth/register`
- **PL/SQL Procedure**: `REGISTER_CUSTOMER`
- **Request Body**:
```json
{
  "name": "Karthik",
  "email": "karthik2026@gmail.com",
  "mobile": "9000000011",
  "password": "hashed_password"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "1004",
      "name": "Karthik",
      "email": "karthik2026@gmail.com",
      "role": "CUSTOMER"
    }
  }
}
```

### Login Customer
- **Endpoint**: `POST /api/auth/login`
- **PL/SQL Procedure**: `LOGIN_CUSTOMER`
- **Request Body**:
```json
{
  "email": "ravi@gmail.com",
  "password": "hashed_1234"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "1003",
      "name": "Ravi Kumar",
      "role": "CUSTOMER"
    }
  }
}
```

---

## 2. Location & Cinema Endpoints

### List Locations
- **Endpoint**: `GET /api/locations`
- **PL/SQL Procedure**: `SELECT_LOCATION` (Cursor)
- **Response (200 OK)**:
```json
[
  { "id": 1, "city": "Chennai", "state": "Tamil Nadu", "latitude": 13.0827, "longitude": 80.2707 },
  { "id": 2, "city": "Pondicherry", "state": "Puducherry", "latitude": 11.9416, "longitude": 79.8083 }
]
```

### Search Theatres
- **Endpoint**: `GET /api/theatres?locationId=1&movieId=101`
- **PL/SQL Procedure**: `SELECT_THEATRE` (Cursor)
- **Response (200 OK)**:
```json
[
  {
    "id": 201,
    "name": "PVR Grand Mall",
    "locationId": 1,
    "address": "Velachery, Chennai",
    "rating": 4.3,
    "amenities": ["Parking", "Dolby Atmos", "4K Projection"]
  }
]
```

---

## 3. Movie Discovery & Showtimes

### Get Movies by Location
- **Endpoint**: `GET /api/movies?locationId=1`
- **PL/SQL Procedure**: `SELECT_MOVIE(1)`
- **Response (200 OK)**:
```json
[
  {
    "id": 101,
    "title": "Retro",
    "language": "Tamil",
    "genre": "Drama",
    "duration": 160,
    "rating": 4.2,
    "format": "2D"
  }
]
```

### Get Shows for Movie & Theatre
- **Endpoint**: `GET /api/shows?movieId=101&theatreId=201&date=2026-10-01`
- **PL/SQL Procedure**: `SELECT_SHOW(101, 201, TO_DATE('2026-10-01','YYYY-MM-DD'))`
- **Response (200 OK)**:
```json
[
  {
    "showId": 501,
    "time": "10:30 AM",
    "screenName": "Audi 1",
    "format": "2D",
    "basePrice": 200
  }
]
```

---

## 4. Seats & Authoritative Pricing

### View Available Seats
- **Endpoint**: `GET /api/seats/:showId`
- **PL/SQL Procedure**: `VIEW_AVAILABLE_SEATS(504)`
- **Response (200 OK)**:
```json
[
  { "showSeatId": 1001, "row": "A", "seatNumber": 1, "type": "PREMIUM", "price": 300, "status": "AVAILABLE" },
  { "showSeatId": 1002, "row": "A", "seatNumber": 2, "type": "PREMIUM", "price": 300, "status": "BOOKED" }
]
```

### Calculate Total Price
- **Endpoint**: `GET /api/price?showId=504&numSeats=2`
- **PL/SQL Function**: `CALCULATE_TICKET_PRICE(504, 2)`
- **Response (200 OK)**:
```json
{
  "basePrice": 500,
  "convenienceFee": 60,
  "finalAmount": 560
}
```

### Apply Coupon
- **Endpoint**: `POST /api/coupons/apply`
- **PL/SQL Function**: `APPLY_COUPON('WELCOME100', 600)`
- **Request Body**: `{ "code": "WELCOME100", "orderAmount": 600 }`
- **Response (200 OK)**:
```json
{
  "couponCode": "WELCOME100",
  "originalAmount": 600,
  "discountAmount": 100,
  "discountedTotal": 500
}
```

---

## 5. Bookings, Payments, & Cancellations

### Create Booking
- **Endpoint**: `POST /api/bookings`
- **PL/SQL Procedure**: `CREATE_BOOKING(p_customer_id, p_show_id, p_show_seat_id)`
- **Trigger Fired**: `TRG_BOOK_SEAT`
- **Request Body**:
```json
{
  "customerId": 1003,
  "showId": 504,
  "seatIds": [1001]
}
```
- **Response (201 Created)**:
```json
{
  "bookingId": 5010,
  "status": "PENDING",
  "totalAmount": 280,
  "expiresAt": "2026-10-04T19:55:00Z"
}
```

### Process Simulated Payment
- **Endpoint**: `POST /api/payments`
- **PL/SQL Procedure**: `PROCESS_PAYMENT(5010, 'UPI', 280)`
- **Trigger Fired**: `TRG_PAYMENT_CONFIRM`
- **Request Body**:
```json
{
  "bookingId": 5010,
  "paymentMethod": "UPI",
  "amount": 280
}
```
- **Response (200 OK)**:
```json
{
  "paymentId": 8012,
  "status": "COMPLETED",
  "bookingStatus": "CONFIRMED"
}
```

### Cancel Booking
- **Endpoint**: `POST /api/bookings/:id/cancel`
- **PL/SQL Procedure**: `CANCEL_BOOKING(p_booking_id, p_customer_id)`
- **Trigger Fired**: `TRG_RELEASE_SEAT`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully. Seats released and refund initiated."
}
```
