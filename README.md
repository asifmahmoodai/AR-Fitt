# ARFitt

**Virtual fashion try-on, personalized recommendations, and apparel and cosmetics discovery.**

ARFitt combines a React shopping experience with camera-based try-on, body and face scanning flows, subscription billing, and an administration workspace for managing users, products, categories, and Android app releases.

[Screenshots](#screenshots) · [Features](#features) · [Tech stack](#tech-stack) · [Local setup](#local-setup) · [Configuration](#configuration) · [Project structure](#project-structure)

## Screenshots

Screenshots captured from the application running locally. Click an image to view it at full resolution.

### Landing page

[![ARFitt desktop landing page with virtual fashion imagery and links to suggestions, cosmetics, and apparel](docs/screenshots/landing-desktop.png)](docs/screenshots/landing-desktop.png)

### Account access

| Sign in | Create an account |
| --- | --- |
| [![Customer sign-in page with email, password, and guest access](docs/screenshots/login.png)](docs/screenshots/login.png) | [![Account registration form](docs/screenshots/signup.png)](docs/screenshots/signup.png) |

### Administration and mobile view

| Admin sign in | Mobile landing page |
| --- | --- |
| [![Administrator sign-in page](docs/screenshots/admin-login.png)](docs/screenshots/admin-login.png) | [<img src="docs/screenshots/landing-mobile.png" alt="ARFitt landing page at a mobile viewport" width="280">](docs/screenshots/landing-mobile.png) |

## Features

- **Apparel and cosmetics discovery:** browse categories, view product images and details, and explore suggested items.
- **Virtual try-on:** use Snap Camera Kit and product lens references to preview supported items through the camera.
- **Personalized recommendations:** body-image analysis supports size, color, and shirt recommendations through a separate Python service.
- **Customer onboarding:** account registration, email OTP verification, subscription selection, scan flows, and guest access.
- **Account recovery:** password reset requests and reset-password screens.
- **Subscriptions:** Stripe Checkout integration and webhook handling for subscription events.
- **Shopping interface:** cart, checkout form, and order-summary screens.
- **Administration:** separate admin authentication and tools for managing users, products, categories, and Android APK releases.
- **Android distribution:** public download page backed by release metadata and APK download endpoints.

Some flows need configured external services; see [Configuration](#configuration) and [Service dependencies and current limits](#service-dependencies-and-current-limits).

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Create React App |
| UI | Material UI, Tailwind CSS, styled-components |
| State and requests | Redux, Redux Persist, React Query, Axios |
| Routing | React Router |
| AR camera | Snap Camera Kit |
| API | Node.js, Hono, `@hono/node-server` |
| Database | PostgreSQL, Prisma ORM with the PostgreSQL driver adapter |
| Authentication | JWT through `jose`, separate customer and admin sessions |
| Billing and email | Stripe, SendGrid |
| Recommendation service | Python, Flask, OpenAI client |
| Hosting support | Nginx configuration snippets, local image and APK storage |

The current API runs on Hono. Some controller directories retain their earlier `express` naming and are connected through a compatibility adapter.

## Local setup

### Prerequisites

- Node.js **20.19+ within Node 20**, **22.12+ within Node 22**, or **24+**, as required by the installed Prisma version. The frontend's `.nvmrc` selects Node 20.
- npm.
- A running PostgreSQL server and an empty database, such as `arfitt`.
- Python 3 and pip if you want to run the optional recommendation service.
- A camera-capable browser for scanning and try-on. Camera access requires localhost or HTTPS and browser permission.

Run the following commands from the repository root unless a step changes directories.

### 1. Configure the API

Create `ar-fitt_backend-main/.env`:

```dotenv
EXPRESS_APP_PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_DATABASE_PASSWORD@localhost:5432/arfitt?schema=public
ALLOWED_ORIGIN_URL=http://localhost:3000
SERVER_HOST_URL=http://localhost:3001
SIGN_ACCESS_TOKEN_PRIVATE_KEY=REPLACE_WITH_A_LONG_RANDOM_ACCESS_TOKEN_SECRET
SIGN_REFRESH_TOKEN_PRIVATE_KEY=REPLACE_WITH_A_DIFFERENT_LONG_RANDOM_REFRESH_TOKEN_SECRET
```

Use your own database credentials and distinct random token secrets. To generate a secret, run:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

### 2. Install and start the API

```bash
cd ar-fitt_backend-main
npm ci
npx prisma migrate deploy
npm start
```

`npm ci` runs `prisma generate` through the package's `postinstall` script. The API listens on `http://localhost:3001` by default. Its port variable is still named `EXPRESS_APP_PORT`.

For automatic restarts during development, use `npm run dev` instead of `npm start`.

To populate sample inventory, run this in a second terminal inside `ar-fitt_backend-main`:

```bash
npm run db:seed
```

Use the Prisma migrations for a fresh database. The repository also contains older SQL snapshots; importing those in addition to the migrations is not part of this setup.

### 3. Configure the frontend

Create `AR-fitt_web_FE/.env.local`:

```dotenv
REACT_APP_NODE_BACKEND_BASE_URL=http://localhost:3001
```

Add the optional integration variables from [Configuration](#configuration) when enabling camera lenses, scanning, or billing. Frontend `REACT_APP_*` values are embedded in the browser bundle; restart the development server or rebuild after changing them. Keep backend secrets in the API environment.

### 4. Install and start the frontend

In a new terminal:

```bash
cd AR-fitt_web_FE
npm ci
npm start
```

Open **http://localhost:3000**. The landing page, customer sign-in and registration screens, and admin sign-in page can be viewed without completing external-service setup. API-backed features require the API and database.

### 5. Set up a local demo administrator

On your local development database, run:

```bash
cd ar-fitt_backend-main
node database_setup/deploy/AddAdminRole.js
```

Then open **http://localhost:3000/admin/login**.

| Field | Local demo value |
| --- | --- |
| Email | `admin@arfitt.com` |
| Password | `admin123` |

This script creates or updates that account and resets its password to the demo value. Use it only with a local development database.

## Configuration

### Frontend integrations

Set these in `AR-fitt_web_FE/.env.local` as needed:

| Variable | Purpose |
| --- | --- |
| `REACT_APP_NODE_BACKEND_BASE_URL` | Base URL of the Node API, such as `http://localhost:3001` |
| `REACT_APP_FRONT_BASE_URL` | Separate scan/try-on service exposing `/full_body_check`, `/face_check`, and `/try_on` |
| `REACT_APP_CAMERA_KIT_API_TOKEN` | Camera Kit token enabled for your application |
| `REACT_APP_CAMERA_KIT_API_HOSTNAME` | Optional API hostname override; defaults to `camera-kit-api.snapar.com` |
| `REACT_APP_CAMERA_KIT_LENS_GROUP_IDS` | Comma-separated Camera Kit lens group IDs |
| `REACT_APP_ONE_TIME_PLAN_PRICE_ID` | Stripe price ID used by the one-time plan option |
| `REACT_APP_MONTHLY_PLAN_PRICE_ID` | Stripe monthly price ID |
| `REACT_APP_QUARTERLY_PLAN_PRICE_ID` | Stripe quarterly price ID |
| `REACT_APP_YEARLY_PLAN_PRICE_ID` | Stripe yearly price ID |

### API integrations and storage

Add these to `ar-fitt_backend-main/.env` as needed:

| Variable | Purpose |
| --- | --- |
| `EMAIL_SERVICE_API_KEY_VALUE` | SendGrid API key |
| `FORGET_PASSWORD_EMAIL_SENDER` | Verified sender used for account emails |
| `FORGET_PASSWORD_URL` | Reset page URL template; the code inserts a token at `%s`, for example `http://localhost:3000/resetPassword?token=%s` |
| `PAYMENT_SERVICE_API_KEY` | Stripe secret API key |
| `PAYMENT_SERVICE_SUCCESS_URL` | Checkout success redirect, including `session_id={CHECKOUT_SESSION_ID}` |
| `PAYMENT_SERVICE_CANCEL_URL` | Checkout cancellation redirect |
| `PAYMENT_SERVICE_WEBHOOK_API_KEY` | Stripe webhook signing secret |
| `PRODUCT_IMAGES_DIR` | Product image storage directory; defaults to `product_images` relative to the API working directory |
| `APK_RELEASES_DIR` | APK release storage directory; defaults to `app_releases` relative to the API working directory |

For local Stripe webhook forwarding, with Stripe CLI installed and authenticated:

```bash
stripe listen --forward-to localhost:3001/payment/webhook
```

Set `PAYMENT_SERVICE_WEBHOOK_API_KEY` to the signing secret printed by that command, then restart the API. Use matching Stripe test credentials and price IDs for local development.

### Optional Python recommendation service

The included Flask service exposes `POST /recommend` on port `5000` and reads product data from the adjacent `products_arfit.csv` file.

```bash
cd ar-python
python3 -m venv .venv
source .venv/bin/activate
python -m pip install flask openai
export OPENAI_API_KEY=YOUR_OPENAI_API_KEY
python get_user_size_latest.py
```

The API's body-image controller currently calls a hard-coded recommendation URL. For local integration, change that URL in [`UserBodyImageController.js`](ar-fitt_backend-main/adapters/express/controllers/UserBodyImageController.js) to `http://127.0.0.1:5000/recommend`. Setting `REACT_APP_FRONT_BASE_URL` does not change the API's recommendation URL.

## Application routes

| Route | Screen |
| --- | --- |
| `/` | Landing page |
| `/signup` | Registration and onboarding |
| `/login` | Customer sign in and guest access |
| `/forgotPassword` | Password reset request |
| `/resetPassword` | Password reset form |
| `/home` | Customer home |
| `/home/suggestion` | Suggested products and category browsing |
| `/home/item` | Selected product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form |
| `/order-details/:orderId` | Order summary |
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | Users, products, categories, and Android releases |
| `/download-app` | Android app download and installation instructions |
| `/terms-and-conditions` | Terms and conditions |

Customer home and product routes require a valid customer or guest session. The administration dashboard requires a verified admin session. Product and order detail screens also rely on application state populated by earlier navigation.

## Project structure

```text
arfit/
├── README.md
├── docs/screenshots/              # Application screenshots used above
├── AR-fitt_web_FE/
│   ├── public/                   # Static assets and product images
│   ├── src/
│   │   ├── components/           # Shared UI and camera components
│   │   ├── pages/                # Customer and admin screens
│   │   ├── redux/                # Signup, catalogue, and cart state
│   │   ├── services/             # API clients
│   │   └── utils/                # Constants and helpers
│   └── package.json
├── ar-fitt_backend-main/
│   ├── adapters/                 # Controllers, database repositories, integrations
│   ├── entities/                 # Domain entities
│   ├── frameworks/               # Controller and service wiring
│   ├── infra/                    # Configuration, database, storage, and utilities
│   ├── middleware/               # Authentication, hashing, and validation
│   ├── prisma/                   # Schema and migrations
│   ├── usecases/                 # Business logic
│   ├── test/                     # Node test files
│   ├── server.js                 # Node server entry point
│   └── worker.js                 # Hono app and route registration
├── ar-python/                    # Flask recommendation service and product CSV
└── ops/                          # Nginx and APK deployment notes
```

## Development commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `AR-fitt_web_FE` | `npm start` | Start the frontend development server |
| `AR-fitt_web_FE` | `npm run build` | Build the frontend into `build/` |
| `AR-fitt_web_FE` | `CI=true npm test -- --watchAll=false` | Run frontend tests once |
| `ar-fitt_backend-main` | `npm start` | Start the API |
| `ar-fitt_backend-main` | `npm run dev` | Start the API with nodemon |
| `ar-fitt_backend-main` | `npx prisma generate` | Regenerate the Prisma client |
| `ar-fitt_backend-main` | `npx prisma migrate deploy` | Apply existing migrations |
| `ar-fitt_backend-main` | `npm run db:migrate` | Create and apply a development migration |
| `ar-fitt_backend-main` | `npm run db:seed` | Populate sample inventory |
| `ar-fitt_backend-main` | `node --test test/*.test.js` | Run the included Node tests |

The API package's `npm test` command is still a placeholder; use the direct Node test command above.

## Service dependencies and current limits

- **Scanning:** the frontend expects `/full_body_check`, `/face_check`, and `/try_on` from another service. The included Flask recommendation service implements `/recommend` only.
- **Recommendations:** body-image processing depends on the configured recommendation endpoint, API credentials, and its product CSV. Image-based size estimates are recommendations, not measured garment dimensions.
- **Try-on:** camera permission, an enabled Camera Kit token, and valid product lens references are required.
- **Shopping checkout:** the current product checkout creates an order summary in frontend navigation state. Stripe integration handles subscriptions; product-order payment and persistent order storage are not implemented in this checkout flow.
- **Storage:** product images and APK releases live on local disk. Preserve those directories when deploying. Admin sessions are held in process memory and are lost on API restart.

## Deployment notes

Build the frontend with `npm run build` inside `AR-fitt_web_FE`, then serve its `build/` directory with SPA fallback to `index.html` so direct links to application routes work. Set the frontend environment for the target deployment before building.

Run the API from `ar-fitt_backend-main`, apply its database migrations, and configure `ALLOWED_ORIGIN_URL` to match the frontend's exact origin. Use HTTPS for deployed camera access.

Additional configuration is documented in:

- [Camera Kit Nginx proxy notes](ops/nginx/README.md)
- [APK upload and download operations](ops/APK-downloads.md)

