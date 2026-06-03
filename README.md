# AssamMed Inventory & Order Management System

## Project Overview
This project is a high-precision inventory and order management system built for AssamMedChem. It features a robust conversion engine to handle extreme precision and multiple units for mass, volume, and count.

## Tech Stack
- **Frontend & Backend**: Next.js (App Router, Server Actions)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth.js (Role-based: ADMIN, SELLER)
- **Styling**: Custom CSS (No heavy UI libraries, focus on minimalism and speed)

## Base Unit Storage Strategy

Handling varying units (like `kg`, `g`, `L`, `mL`) and maintaining pricing precision can be notoriously complex. This application solves it using the **Base Unit Pattern**:

1. **Dimensions**:
   - `MASS` (Base Unit: `g`)
   - `VOLUME` (Base Unit: `mL`)
   - `COUNT` (Base Unit: `item`)

2. **Storage Rules**:
   - All inventory quantities are stored in the database exclusively as their **Base Unit**.
   - All prices are stored internally as **INR per Base Unit**.
   - `NUMERIC(18, 6)` is used for quantities to handle massive numbers and high decimal precision.
   - `NUMERIC(15, 4)` is used for prices to handle micro-paise scale cleanly.

3. **Conversion Flow**:
   - **User Input**: A user orders `5 kg`.
   - **Processing**: The system multiplies the requested quantity by the conversion factor (1000) -> `5000` base units (g). The database stores `5000`.
   - **Frontend Display**: When pulling from the database, if the user wishes to view stock in `kg`, the system fetches `5000` (g) and divides by the factor (1000) to safely display `5 kg`.

## Database Schema & Precision
- **`Product.pricePerBaseUnit`**: `Decimal(15, 4)`. E.g., if Rice is ₹50/kg, the base unit price is `0.05` INR/g.
- **`Product.stockInBaseUnit`**: `Decimal(18, 6)`. Allows accurate tracking of micro-quantities of chemicals.
- **`OrderItem.requestedDisplayQuantity` & `requestedDisplayUnit`**: Kept intact to preserve exact user intent (e.g., storing "2.5" and "kg").
- **`OrderItem.itemTotalInr`**: `Decimal(15, 4)`. Rounded to exactly 2 decimals before rendering in the UI for INR format.

## Setup Instructions

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Database Setup (Neon)**:
   - Create a PostgreSQL database on Neon.
   - Copy `.env.example` to `.env` and paste your Neon Connection URI.
   ```bash
   cp .env.example .env
   ```

3. **Apply Schema & Seed**:
   ```bash
   npx prisma db push
   npx prisma generate
   # Note: A seed script can be added, or you can manually create accounts/products.
   ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## Roles & Authentication
The app features two roles:
- **Admin**: Can view inventory, create products, set prices, and monitor all orders in internal Base Units alongside User Units.
- **Seller**: Can browse products, view real-time dynamic quotations across varying units, and place orders.

Credentials for testing:
- Admin: `admin@test.com` (Password: `password123`)
- Seller: `seller@test.com` (Password: `password123`)
