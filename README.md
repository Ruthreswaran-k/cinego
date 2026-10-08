# 🎬 CineGo — Your Movies. Your Seats. Your Experience.

A full-stack movie ticket booking system built with **React**, **Node.js/Express**, **Oracle Database 21c XE**, and **Supabase Auth**.

> **CineGo** is a production-style cinema booking platform demonstrating comprehensive DBMS concepts including PL/SQL Procedures, Functions, Cursors, Triggers, Sequences, Transactions, and Role-Based Access Control.

---

## 🏗️ Architecture

```
USER → React Frontend → REST API → Node/Express Backend → Oracle Database
                                  ↘ Supabase (OTP Auth)
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6 |
| **Backend** | Node.js, Express, TypeScript, OracleDB driver |
| **Database** | Oracle Database 21c XE, PL/SQL |
| **Auth** | Supabase (OTP), JWT |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |

## 📁 Project Structure

```
CineGo/
├── database/          # Oracle SQL scripts
│   ├── 01_sequences.sql
│   ├── 02_tables.sql
│   ├── 03_procedures.sql
│   ├── 04_functions.sql
│   ├── 05_triggers.sql
│   ├── 06_seed_data.sql
│   └── run_all.sql
├── backend/           # Node.js + Express + TypeScript
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── routes/
│       ├── middleware/
│       ├── types/
│       └── utils/
├── frontend/          # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── api/
│       ├── types/
│       └── utils/
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Oracle Database 21c XE (running on `localhost:1522/XEPDB1`)
- Oracle Instant Client
- Supabase account (for OTP auth)

### 1. Setup Database
```bash
cd database
# Connect to Oracle and run:
@run_all.sql
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Oracle and Supabase credentials
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 👥 User Roles

| Role | Access |
|------|--------|
| **Customer** | Browse, book, cancel, review, favorites |
| **Admin** | Full platform management |
| **Theatre Manager** | Their theatre's shows, bookings, analytics |

## 🗄️ DBMS Concepts Demonstrated

| Concept | Usage |
|---------|-------|
| **Procedures** | REGISTER_CUSTOMER, CREATE_BOOKING, PROCESS_PAYMENT, etc. |
| **Functions** | CALCULATE_TICKET_PRICE, APPLY_COUPON |
| **Explicit Cursors** | SELECT_MOVIE, VIEW_AVAILABLE_SEATS, VIEW_BOOKING_REPORT |
| **Implicit Cursors** | SELECT_LOCATION, VIEW_FOOD_MENU |
| **Triggers** | TRG_BOOK_SEAT, TRG_PAYMENT_CONFIRM, TRG_RELEASE_SEAT |
| **Sequences** | CUSTOMER_SEQ, BOOKING_SEQ, TICKET_SEQ, etc. |
| **Transactions** | COMMIT/ROLLBACK in booking and payment flows |
| **Constraints** | PK, FK, UNIQUE, CHECK, NOT NULL, DEFAULT |
| **Joins** | Multi-table joins in booking reports |
| **Aggregations** | Revenue reports, booking analytics |

## 📋 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cinego.com | admin1234 |
| Manager | manager@pvr.com | manager1234 |
| Customer | ravi@gmail.com | 1234 |

## 📄 Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture
- [DATABASE.md](docs/DATABASE.md) — Database design & ER diagram
- [API.md](docs/API.md) — REST API reference
- [SECURITY.md](docs/SECURITY.md) — Security measures
- [DEMO_FLOW.md](docs/DEMO_FLOW.md) — End-to-end demo walkthrough

---

**Built for DBMS Course Project — Demonstrating Oracle PL/SQL + Full-Stack Development**
