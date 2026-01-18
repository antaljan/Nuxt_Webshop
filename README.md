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
├─ app.vue                          # Nuxt 4 application
├─ nuxt.config.json                 # Nuxt config
├─ package-lock.json                # package lock
├─ package.json                     # package config
├─ i18n.config.ts                   # i18n config
├─ assets/                          # built assets
│  └─ css/
│  └─ images/
├─ components/                      # UI, blog, products, admin, newsletter
│  └─ GenericHeroSection.vue
│  └─ MyHeadder.vue
├─ composables/                     # useAuth, useUser, useProducts, etc.
│  └─ useAuth.ts
│  └─                               # useBlog.ts - empty
│  └─ useContent.ts
│  └─                               # useNewsletter.ts - empty
│  └─                               # useProduct.ts -empty
│  └─                               # useUser.ts - empty
├─ layouts/                         # default, user, admin
│  └─ admin.vue
│  └─ default.vue
│  └─ user.vue
├─ middleware/                      # middleware
│  └─ admin.global.ts
│  └─ auth.ts
├─ pages/                           # pages
│  └─ admin/
│  │    ├─ blog/
│  │    │   ├─ create.vue
│  │    │   └─ index.vue
│  │    ├─ content/
│  │    │   └─ index.vue
│  │    ├─ newsletter/
│  │    │   ├─ create.vue
│  │    │   ├─ index.vue
│  │    │   ├─ schedule.vue
│  │    │   └─ stats.vue
│  │    ├─ products/
│  │    │   ├─ create.vue
│  │    │   └─ index.vue
│  │    ├─ stat/
│  │    │   └─ index.vue
│  │    ├─ users/
│  │    │   └─ index.vue
│  │    └─ index.vue
│  ├─ blog/
│  │    ├─ [slug].vue
│  │    └─ index.vue
│  ├─ products/
│  │    └─ index.vue
│  ├─ user/
│  │    ├─ index.vue
│  │    ├─ orders.vue
│  │    ├─ products.vue
│  │    ├─ settings.vue
│  │    └─ videos.vue
│  ├─ index.vue
│  ├─ login.vue
│  └─ register.vue
├─ plugins/                           # plugins
├─ public/                            # static files
│  ├─ favicon.ivo
│  └─ robots.txt
└─ server/                            # SSR backend layer
   ├─ api/
   │    ├─ auth/
   │    │   ├─ login.post.ts
   │    │   ├─ logout.post.ts
   │    │   └─ me.get.ts
   │    ├─ blog/
   │    │   ├─ [id].delete.ts
   │    │   ├─ [id].get.ts
   │    │   ├─ [id].put.ts
   │    │   ├─ [slug].get.ts
   │    │   ├─ create.post.ts
   │    │   └─ index.get.ts
   │    ├─ booking/
   │    │   ├─ [date].get.ts
   │    │   ├─ [id].delete.ts
   │    │   ├─ [id].put.ts
   │    │   ├─ all.get.ts
   │    │   └─ new.post.ts
   │    ├─ content/
   │    │   ├─ [section]/
   │    │   │     ├─ language.get.ts
   │    │   │     └─ language.put.ts
   │    │   └─ upload.post.ts
   │    ├─ content-upload/
   │    │   └─ index.post.ts
   │    ├─ dashboard/
   │    │   ├─ campaigns.get.ts
   │    │   └─ summary.get.ts
   │    ├─ emial/
   │    │   └─ send.post.ts
   │    ├─ feedbacks/
   │    │   ├─ [id].delete.ts
   │    │   ├─ [id].get.ts
   │    │   ├─ [id].put.ts
   │    │   ├─ index.get.ts
   │    │   └─ new.post.ts
   │    ├─ images/
   │    │   ├─ [filename].delete.ts
   │    │   └─ index.get.ts
   │    ├─ logs/
   │    │   └─ stats.get.ts
   │    ├─ newsletter/
   │    │   ├─ unsubscribe/
   │    │   │     └─ [email].get.ts
   │    │   ├─ deletetemplate.post.ts
   │    │   ├─ getonetemplate.post.ts
   │    │   ├─ getscheduled.post.ts
   │    │   ├─ gettemplates.post.ts
   │    │   ├─ save.post.ts
   │    │   ├─ schedule.post.ts
   │    │   ├─ send.post.ts
   │    │   ├─ subscribe.post.ts
   │    │   ├─ subscriber.put.ts
   │    │   └─ subscribers.post.ts
   │    ├─ products/
   │    │   ├─ [id].get.ts
   │    │   └─ index.get.ts
   │    ├─ stats/
   │    │   └─ track.post.ts
   │    ├─ track/
   │    │   ├─ click/
   │    │   │     └─ [emailid].get.ts
   │    │   └─ open/
   │    │         └─ [emailid].get.ts
   │    ├─ upload/
   │    │   └─ index.post.ts
   │    └─ users/
   │        ├─ create.post.ts
   │        ├─ delete.post.ts
   │        ├─ index.post.ts
   │        └─ update.post.ts
   └─ utils/
      └─ backend.ts                   # BACKEND_BASE_URL

🔐 Authentication & Authorization
Login Flow:
  1. Nuxt → backend: email + password
  2. Backend generates JWT
  3. Nuxt server stores JWT in HTTP‑only cookie
  4. SSR recognizes user state
  5. Middleware controls access

Middleware:
- auth.ts – checks login
- admin.global.ts – checks admin role

🛠️ Nuxt 4 Initialization:
  npx nuxi init
  npm install
  npm run dev
  npx nuxi@latest module add vuetify-nuxt-module
  npm install @mdi/font
  npm install @nuxtjs/i18n

🚀 Deployment (VPS)
- NGINX reverse proxy
- PM2 process manager
- HTTPS via Let's Encrypt
- Node backend + Nuxt SSR as separate processes

📄 License
  License can be chosen freely (MIT recommended).