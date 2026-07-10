# Advanced Backend Project — Bank Transaction System

A backend system simulating real bank transfers using **Node.js**, **Express**, and **MongoDB** with double-entry ledger, idempotent transactions, JWT auth with token blacklisting, and MongoDB transactions/sessions.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + httpOnly cookies |
| Password Hashing | bcryptjs |
| Email | Nodemailer (Gmail OAuth2) |

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Gmail account with OAuth2 (optional — for transactional emails)

### Docker (Recommended)

```bash
docker pull csakib049/bank-transaction-system
```

### Local Installation

```bash
git clone https://github.com/csakib049/-Advanced-Backend-Project-Bank-Transaction-System-with-Node.js-Express-MongoDB-.git
cd -Advanced-Backend-Project-Bank-Transaction-System-with-Node.js-Express-MongoDB-
npm install
```

### Running the server

```bash
# Development
npm run dev
# Production
npm start
```

### Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bank-transaction-system
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_gmail_address@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

The app will still run without email config — email calls fail silently.

## Key Concepts

- **Double-Entry Ledger**: Every transfer creates a `DEBIT` and a `CREDIT` ledger entry. Balance is derived on-demand via aggregation, never stored directly.
- **Idempotency**: Each transfer requires an `idempotencyKey` — duplicate requests return the existing state instead of double-charging.
- **Atomicity**: Transactions write both ledger entries inside a MongoDB session — all or nothing.
- **JWT Blacklisting**: On logout, tokens are stored in a blacklist collection (with TTL index) so they can't be replayed after logout.

## API Reference

All protected routes accept JWT via httpOnly cookie (`token`) or `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create user, returns JWT cookie + sends welcome email |
| POST | `/login` | Public | Authenticate, returns JWT cookie |
| POST | `/logout` | Public | Blacklists token, clears cookie |

### Accounts — `/api/accounts`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Create a bank account |
| GET | `/` | Required | List user's accounts |
| GET | `/balance/:accountID` | Required | Get derived balance |

### Transactions — `/api/transaction`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Transfer funds between accounts |
| POST | `/system/initial-funds` | System only | Seed account from system |

## Project Structure

```
├── server.js
├── src/
│   ├── app.js
│   ├── config/db.js
│   ├── models/       # user, account, transaction, ledger, blackList
│   ├── controllers/  # auth, account, transaction
│   ├── middleware/    # auth middleware
│   ├── routes/       # auth, account, transaction
│   └── services/     # email service
└── package.json
```

## Security

- Passwords hashed with bcrypt (`select: false`)
- JWTs stored in httpOnly cookies
- Logout invalidates token server-side via blacklist
- Ledger entries immutable at schema level

## License

ISC
