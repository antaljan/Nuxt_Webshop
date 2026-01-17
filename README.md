Webshop & Content Management Platform for Coaches, Psychologists, and Consultants
Modern MEVN + Nuxt 4 SSR based content and client management system

📌 Overview
This project is a complete webshop + content management + client portal designed for coaches, psychologists, and consultants operating as small businesses.
The platform enables:
- Selling digital products (PDFs, e‑books, videos, coaching time)
- Managing blog content and newsletters
- Providing a multilingual, SEO‑optimized public website
- Offering a secure user dashboard for purchased content
- Running a scalable, modern architecture (Nuxt 4 SSR + Node + MongoDB)
The system supports three main user roles:
- Visitor (public user)
- Customer (authenticated user)
- Admin (coach / business owner)

👤 User Roles & Capabilities
1) Visitor (Public User)
Capabilities:
- View landing page
- Browse blog posts
- Subscribe to newsletter
- View products
- Add to cart & purchase (guest checkout or registration)
Technical Notes:
- All public pages rendered via SSR
- Full SEO, i18n, and fast performance
- Nuxt SSR ensures optimal indexing and speed
2) Customer (Authenticated User)
Capabilities:
- Login
- Access personal dashboard
- View purchased products:
- coaching sessions
- downloadable PDFs / e‑books
- training videos (streaming)
- Purchase additional products
- Manage newsletter preferences
Technical Notes:
- JWT + HTTP‑only cookie authentication
- User state available during SSR
- Dashboard protected via route middleware
- Backend authorization for digital product access
3) Admin (Coach / Business Owner)
Capabilities:
- Manage blog posts
- Manage landing and static content
- Manage products
- View purchases
- User management
- Newsletter management:
  - WYSIWYG/Markdown editor
  - templates
  - audience segmentation
  - scheduled sending
  - open/click statistics
Technical Notes:
- Dedicated admin layout (/admin)
- SSR + auth middleware + role checks
- Newsletter scheduler via backend cron
- External email provider recommended (SMTP Server or Mailgun / SendGrid)

🌍 Multilingual Support & Design
- Clean, modern UI (Vuetify + MDI)
- Supported languages: English, German, Hungarian
- Automatic language detection via browser settings
- Default language: English
- Multi‑domain support

🎬 Video Streaming
Recommended providers:
- Bunny Stream
- Vimeo Pro
Why?
- HLS streaming
- Domain lock
- Token‑based protection
- No load on the VPS
- Easy integration (iframe or SDK)

🏗️ Technology Stack
Frontend:
- Nuxt 4 (SSR)
- Vue 3
- Vuetify
- MDI Icons
- i18n
- SSR data fetching (useAsyncData, useFetch)
Backend:
- Node.js  (Express)
- MongoDB
- JWT Auth (HTTP‑only cookies)
- Cron scheduler (newsletter)
Hosting:
- VPS (IONOS – 4 CPU, 8GB RAM, 256GB SSD)
- NGINX reverse proxy
- PM2 (recomended for monitorin)

🧱 Backend Modules
User Management:
- registration, login
- roles: user, admin
- purchase history
- access control
Content Management:
- blog CRUD
- landing content
- media metadata
- SEO fields
Newsletter Management:
- subscriber database
- templates
- editor
- scheduler
- sending via Mailgun/SendGrid
Webshop:
- products
- cart
- payment (Stripe/PayPal)
- digital product access
Statistics:
- page views
- newsletter opens
- purchase funnel
- admin dashboard charts

📁 Project Structure (Nuxt 4 Recommended)
project/
├─ app/               # Nuxt 4 application
│  ├─ pages/          # routes
│  ├─ layouts/        # default, user, admin
│  ├─ components/     # UI, blog, products, admin, newsletter
│  ├─ composables/    # useAuth, useUser, useProducts, etc.
│  └─ plugins/        # i18n, analytics
│
├─ server/            # SSR backend layer
│  └─ api/            # auth, blog, products, newsletter, stats
│
├─ public/            # static files
└─ assets/            # built assets

🔐 Authentication & Authorization
Login Flow:
  1. Nuxt → backend: email + password
  2. Backend generates JWT
  3. Nuxt server stores JWT in HTTP‑only cookie
  4. SSR recognizes user state
  5. Middleware controls access

Middleware:
- auth.global.ts – checks login
- admin.global.ts – checks admin role

🛠️ Nuxt 4 Initialization:
  npx nuxi init
  npm install
  npm run dev
  npx nuxi@latest module add vuetify-nuxt-module
  npm install @mdi/font

🚀 Deployment (VPS)
- NGINX reverse proxy
- PM2 process manager
- HTTPS via Let's Encrypt
- Node backend + Nuxt SSR as separate processes

📄 License
  License can be chosen freely (MIT recommended).