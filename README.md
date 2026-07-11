# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**

GearUp is a backend REST API for a sports and outdoor equipment rental service. Customers can browse gear, place rental orders, pay online, and return equipment. Providers manage their gear inventory and fulfill rental orders. Admins oversee the platform, users, and listings.

Live: [gear-up-backend-theta.vercel.app](https://gear-up-backend-theta.vercel.app)

---

## 🛠️ Tech Stack

- **Runtime / Language:** Node.js, TypeScript
- **Framework:** Express 5
- **Database / ORM:** PostgreSQL, Prisma 7
- **Auth:** JWT (access + refresh tokens, HTTP-only cookies), bcrypt password hashing
- **Payments:** Stripe (payment intents + webhooks)
- **Validation:** Zod
- **Tooling:** tsx, tsup, ESLint, Prettier

---

## 👥 Roles & Permissions

| Role         | Description                | Key Permissions                                                                                            |
| ------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Customer** | Users who rent sports gear | Browse gear, place rental orders, pay via Stripe, track orders, return gear, leave reviews, manage profile |
| **Provider** | Gear vendors/rental shops  | Add/edit/remove gear, manage stock, view incoming orders, update order status                              |
| **Admin**    | Platform moderators        | View/manage all users, view all gear & rentals, create/update categories                                   |

> 💡 Users select their role (`CUSTOMER`, `PROVIDER`, or `ADMIN`) during registration.

---

## ✨ Features

### Public

- Browse all available gear with search, filters, sorting & pagination
- View gear details (specs, category, provider, average rating, rental/review counts)
- View all gear categories

### Customer

- Register and log in
- View and update own profile
- Place rental orders (select gear, dates, quantity)
- Pay for a rental order via **Stripe**
- View payment history
- Track rental order status and view order details
- Mark a rented item as returned
- Leave a review after returning gear

### Provider

- Register and log in
- Add, update, and delete gear listings
- View incoming rental orders and full order history
- View gear items that need restocking (low/no stock)
- Update rental order status (confirm, mark picked up, etc.)

### Admin

- View all users on the platform
- Suspend or reactivate a user account
- View all gear listings across all providers
- View all rental orders across the platform
- Create and update gear categories

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint                  | Access                        | Description                                                   |
| ------ | ------------------------- | ----------------------------- | ------------------------------------------------------------- |
| POST   | `/api/auth/login`         | Public                        | Log in, returns access & refresh tokens (also set as cookies) |
| POST   | `/api/auth/refresh-token` | Public (needs refresh cookie) | Issue a new access token                                      |

### Users — `/api/users`

| Method | Endpoint                | Access        | Description                                   |
| ------ | ----------------------- | ------------- | --------------------------------------------- |
| POST   | `/api/users/register`   | Public        | Register a new user (customer/provider/admin) |
| GET    | `/api/users/me`         | Authenticated | Get current logged-in user's profile          |
| PUT    | `/api/users/my-profile` | Authenticated | Update current user's profile                 |

### Gear — `/api/gear` (Public)

| Method | Endpoint        | Description                                                                                                                                                  |
| ------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/api/gear`     | Get all gear. Supports `searchTerm`, `name`, `brand`, `categoryId`, `pricePerDay` (max), `providerId`, `stock` (min), `sortBy`, `sortOrder`, `page`, `limit` |
| GET    | `/api/gear/:id` | Get gear details by ID                                                                                                                                       |

### Categories — `/api/category`

| Method | Endpoint               | Access | Description                 |
| ------ | ---------------------- | ------ | --------------------------- |
| GET    | `/api/category`        | Public | Get all gear categories     |
| POST   | `/api/category/create` | Admin  | Create a new category       |
| PUT    | `/api/category/:id`    | Admin  | Update an existing category |

### Rental Orders — `/api/rentals` (Customer)

| Method | Endpoint                  | Access          | Description                                |
| ------ | ------------------------- | --------------- | ------------------------------------------ |
| POST   | `/api/rentals`            | Customer        | Create a new rental order                  |
| GET    | `/api/rentals`            | Customer        | Get the logged-in customer's rental orders |
| GET    | `/api/rentals/:id`        | Customer, Admin | Get rental order details                   |
| PATCH  | `/api/rentals/return/:id` | Customer        | Mark a rental order as returned            |

### Payments — `/api/payments` (Stripe)

| Method | Endpoint                | Access           | Description                                       |
| ------ | ----------------------- | ---------------- | ------------------------------------------------- |
| POST   | `/api/payments/create`  | Customer         | Create a Stripe payment intent for a rental order |
| POST   | `/api/payments/webhook` | Stripe (webhook) | Stripe webhook to confirm payment status          |
| GET    | `/api/payments`         | Customer         | Get the logged-in customer's payment history      |

### Provider — `/api/provider`

| Method | Endpoint                       | Access   | Description                         |
| ------ | ------------------------------ | -------- | ----------------------------------- |
| POST   | `/api/provider/gear`           | Provider | Add a new gear item to inventory    |
| PUT    | `/api/provider/gear/:id`       | Provider | Update a gear listing               |
| DELETE | `/api/provider/gear/:id`       | Provider | Remove a gear item from inventory   |
| GET    | `/api/provider/incomingOrders` | Provider | Get newly placed/incoming orders    |
| GET    | `/api/provider/orders`         | Provider | Get all of the provider's orders    |
| GET    | `/api/provider/stock`          | Provider | Get gear items that need restocking |
| PATCH  | `/api/provider/orders/:id`     | Provider | Update a rental order's status      |

### Reviews — `/api/reviews`

| Method | Endpoint       | Access   | Description                                       |
| ------ | -------------- | -------- | ------------------------------------------------- |
| POST   | `/api/reviews` | Customer | Create a review for gear after it's been returned |

### Admin — `/api/admin`

| Method | Endpoint               | Access | Description                               |
| ------ | ---------------------- | ------ | ----------------------------------------- |
| GET    | `/api/admin/users`     | Admin  | Get all users                             |
| PATCH  | `/api/admin/users/:id` | Admin  | Update a user's status (suspend/activate) |
| GET    | `/api/admin/gear`      | Admin  | Get all gear listings                     |
| GET    | `/api/admin/rentals`   | Admin  | Get all rental orders                     |

---

## 🗄️ Database Schema (Prisma)

- **User** — `id`, `name`, `email`, `password`, `role` (ADMIN/PROVIDER/CUSTOMER), `status` (ACTIVE/SUSPENDED)
- **Profile** — `profilePhoto`, `phone`, `address`, `bio` (1:1 with User)
- **Category** — `name`, `description`
- **GearItem** — `providerId`, `categoryId`, `name`, `description`, `brand`, `pricePerDay`, `stock`, `images[]`, `specifications`, `isAvailable`
- **RentalOrder** — `customerId`, `gearItemId`, `startDate`, `endDate`, `quantity`, `totalAmount`, `status` (PLACED → CONFIRMED → PAYMENT_INITIATED → PAID → PICKED_UP → RETURNED, or CANCELLED)
- **Payment** — `rentalOrderId`, `stripePaymentIntentId`, `stripeCustomerId`, `amount`, `method` (STRIPE/SSLCOMMERZ), `status` (PENDING/COMPLETED/FAILED/REFUNDED), `paidAt`
- **Review** — `customerId`, `gearItemId`, `rentalOrderId`, `rating`, `comment` (one review per rental order)

---

## ⚙️ Environment Variables

```env
DATABASE_URL="your-postgres-connection-string"
APP_URL="http://localhost:5000/"
PORT=5000

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=access-secret
JWT_REFRESH_SECRET=refresh-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

STRIPE_PRODUCT_ID=your-stripe-product-id
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# generate prisma client & run migrations
npx prisma generate
npx prisma migrate dev

# run in development
npm run dev

# forward Stripe webhooks locally
npm run stripe:webhook

# build & run in production
npm run build
npm start
```

The server starts on `http://localhost:<PORT>` (or wherever configured), with all routes mounted under `/api`.

---

## 📮 Postman

A ready-to-use Postman collection is included: [`GearUp-backend.postman_collection.json`](./GearUp-backend.postman_collection.json)
