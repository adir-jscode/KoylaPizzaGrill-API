# Koyla Pizza Grill API

This is the backend API for Koyla Pizza Grill, a restaurant management and ordering system. It is built with Node.js, Express, TypeScript, MongoDB, and supports features like menu management, order processing, authentication, coupons, restaurant hours, scheduled closing, and payment integration (Stripe).

## 🌐 Live Deployment

🔗 [Click to access the live API](https://koyla-pizza-grill-api-drab.vercel.app/)

## 📁 Directory Structure

```plaintext
src/
└── app/
├── config/
│ ├── db.ts
│ └── cloudinary.ts
├── middlewares/
│ ├── auth.ts
│ ├── errorHandler.ts
│ └── validateRequest.ts
├── modules/
│ ├── admin/
│ │ ├── admin.controller.ts
│ │ ├── admin.interface.ts
│ │ ├── admin.model.ts
│ │ └── admin.routes.ts
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.interface.ts
│ │ ├── auth.model.ts
│ │ └── auth.routes.ts
│ ├── category/
│ │ ├── category.controller.ts
│ │ ├── category.interface.ts
│ │ ├── category.model.ts
│ │ └── category.routes.ts
│ ├── menuItem/
│ │ ├── menuItem.controller.ts
│ │ ├── menuItem.interface.ts
│ │ ├── menuItem.model.ts
│ │ └── menuItem.routes.ts
│ ├── order/
│ │ ├── order.controller.ts
│ │ ├── order.interface.ts
│ │ ├── order.model.ts
│ │ └── order.routes.ts
│ ├── coupon/
│ │ ├── coupon.controller.ts
│ │ ├── coupon.interface.ts
│ │ ├── coupon.model.ts
│ │ └── coupon.routes.ts
│ ├── restaurantSettings/
│ │ ├── restaurantSettings.controller.ts
│ │ ├── restaurantSettings.interface.ts
│ │ ├── restaurantSettings.model.ts
│ │ └── restaurantSettings.routes.ts
│ ├── restaurantHours/
│ │ ├── restaurantHours.controller.ts
│ │ ├── restaurantHours.interface.ts
│ │ ├── restaurantHours.model.ts
│ │ └── restaurantHours.routes.ts
│ ├── scheduledClosing/
│ │ ├── scheduledClosing.controller.ts
│ │ ├── scheduledClosing.interface.ts
│ │ ├── scheduledClosing.model.ts
│ │ └── scheduledClosing.routes.ts
│ └── otp/
│ ├── otp.controller.ts
│ ├── otp.interface.ts
│ ├── otp.model.ts
│ └── otp.routes.ts
├── routes/
│ └── index.ts
├── utils/
│ ├── jwt.ts
│ ├── stripe.ts
│ └── redis.ts
├── app.ts
└── server.ts
.env
```

---

## Features

- Admin authentication (JWT)
- Menu item CRUD (with Cloudinary image upload)
- Category management
- Order creation and tracking
- Coupon management
- Restaurant settings and hours
- Scheduled closing management
- OTP verification for cash orders
- Stripe payment integration
- Redis caching for OTP

## Getting Started

1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in your environment variables.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Build and run:
   ```sh
   npm run build
   npm start
   ```
   For development:
   ```sh
   npm run dev
   ```

## API Endpoints

### Auth

- `POST /api/v1/auth/login` — Admin login
- `POST /api/v1/auth/refresh-token` — Get new access token
- `POST /api/v1/auth/reset-password` — Reset password (auth required)
- `POST /api/v1/auth/logout` — Logout

### Admin

- `POST /api/v1/admin/register` — Register new admin (auth required)
- `GET /api/v1/admin/` — Get all admins (auth required)

### Categories

- `POST /api/v1/category/create-category` — Create category (auth required)
- `GET /api/v1/category/` — List categories
- `GET /api/v1/category/:id` — Get category by ID
- `PUT /api/v1/category/:id` — Update category (auth required)
- `DELETE /api/v1/category/:id` — Delete category (auth required)

### Menu Items

- `POST /api/v1/menu-item/add-menu` — Add menu item (auth required, image upload)
- `GET /api/v1/menu-item/` — List menu items
- `GET /api/v1/menu-item/:id` — Get menu item by ID
- `PUT /api/v1/menu-item/:id` — Update menu item (auth required, image upload)
- `DELETE /api/v1/menu-item/:id` — Delete menu item (auth required)

### Orders

- `POST /api/v1/order/` — Create order
- `GET /api/v1/order/` — List all orders (auth required)
- `GET /api/v1/order/history/:orderNumber` — Get order history (auth required)
- `PUT /api/v1/order/:id` — Change order status (auth required)
- `GET /api/v1/order/filter` — Filter orders (auth required)
- `POST /api/v1/order/payment-intent` — Create Stripe payment intent
- `POST /api/v1/order/stripe/webhook` — Stripe webhook endpoint

### Coupons

- `POST /api/v1/coupon/add-coupon` — Create coupon (auth required)
- `GET /api/v1/coupon/` — List coupons (auth required)
- `DELETE /api/v1/coupon/:id` — Delete coupon (auth required)
- `PATCH /api/v1/coupon/update-status/:id` — Update coupon status (auth required)
- `PUT /api/v1/coupon/:id` — Update coupon (auth required)

### Restaurant Settings

- `GET /api/v1/restaurant-settings/` — Get settings
- `POST /api/v1/restaurant-settings/add-settings` — Add settings (auth required)
- `PUT /api/v1/restaurant-settings/` — Update settings (auth required)

### Restaurant Hours

- `POST /api/v1/restaurant-hours/add-hours` — Add hours (auth required)
- `GET /api/v1/restaurant-hours/` — List hours
- `GET /api/v1/restaurant-hours/:day` — Get hours by day
- `PUT /api/v1/restaurant-hours/:day` — Update hours by day (auth required)

### Scheduled Closing

- `GET /api/v1/scheduled-closing/` — List scheduled closings (auth required)
- `GET /api/v1/scheduled-closing/:id` — Get closing by ID (auth required)
- `POST /api/v1/scheduled-closing/` — Create closing (auth required)
- `PATCH /api/v1/scheduled-closing/:id` — Update closing (auth required)
- `DELETE /api/v1/scheduled-closing/:id` — Delete closing (auth required)

### OTP

- `POST /api/v1/otp/send` — Send OTP to email
- `POST /api/v1/otp/verify` — Verify OTP

## Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- REST API design
- Custom App Error, Zod Validation, Mongoose schema validation & middlewares

---
