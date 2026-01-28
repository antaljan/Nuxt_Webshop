Short “architectural reality check”

backend (NODE Express)
    Running in productive mode on a VPS (IONOS) on port 3000, connected to MongoDB.
    linked with 2 domains: https://antaligyongyi.hu/api (primary), https://yowayoli.com/api
    hosted with nginx, nginx controlled the /api tag.
Nuxt-Backend (Nuxt server routes):
    Auth, blog, products, newsletter, stats, users ect... endpoints are structured and done.
    At the future (if the frontend finished and deployed on vps) the backend and frontend will be running on same VPS in productive system, frontend on port:3000 backend on port:4000 within the NODE backend will be not any more visible for others, only for frontend.
Frontend:
    Nuxt 4 SSR, Vuetify, n18n, Tailwind and component based design ✔️
    The composables useAuth, useContent are integrated, the others (blog, product, newsletter, user) not yet.
    The content pictures are stored on upload directory of NODE backend server, in the nuxt.config.ts is an a environmental variable defined for reach out that:
    runtimeConfig: {
        public: {
            backendBase: process.env.BACKEND_BASE_URL || 'https://antaligyongyi.hu/api'
        }
    }

Tasks are done:
Architect:
- .env ✔️
- .gitignore ✔️
- nuxt.config.ts ✔️
- tailwind.config.js ✔️
- /composable/useAuth.ts ✔️
- /composable/useBlog.ts ✔️
- /composable/useChartDrawer.ts ✔️
- /composable/useContent.ts ✔️
- /composable/useProducts.ts ✔️
- /composable/useProductsAdmin.ts ✔️
- /middleware/auth.ts ✔️
- /server/auth/login.post.ts ✔️
- /server/auth/logout.post.ts ✔️
- /server/auth/me.get.ts ✔️
- /server/auth/register.post.ts ✔️
- /server/content/[section]/language.get.ts ✔️
- /server/content/[section]/language.put.ts ✔️
- /server/content/upload.post.ts ✔️
- /server/content-upload/index.post.ts ✔️
- /server/email/send.post.ts ✔️
- /server/images/[filename].delete.ts ✔️
- /server/images/index.get.ts ✔️
- /server/track/click/[emailid].get.ts ✔️
- /server/track/open/[emailid].get.ts ✔️
- /server/upload/index.post.ts ✔️
- /layouts/default.vue ✔️
- install and config i18n ✔️
- create /i18n/locales/hu.ts + de.ts + en.ts ✔️
- /components/MyHeader.vue ✔️
- /components/MyFooter.vue ✔️
- chart.js installed ✔️
- /components/charts/LineChart.vue + BarChart.vue ✔️
Landing Page (public page):
- /components/GeneralHeroSection.vue ✔️
- /components/sectionSeparator ✔️
- /components/GenericImageTextSection ✔️
- /components/GenericTextSection ✔️
- /components/GenericFeedbackSection ✔️
- /components/GenericContactSection ✔️
- /components/GenericBlogSection ✔️
- /pages/index.vue --> landing page create from generic items, Tailwind, SSR content loader fine tuning ✔️
- /pages/blog/index.vue --> Blog overview ✔️
- /pages/blog/[id].vue --> Blog details view ✔️
- SSR safe user status, stabilized duo to useRequestHeaders(['cookie']) ✔️
- menu links are ssr safe fixed ✔️
Admin functions:
- access control for admin dashboard and pages realized ✔️
- /pages/admin/blog/index.vue --> admin blog post list with edit, delete + create ✔️
- /pages/admin/blog/create.vue --> admin blog post create  ✔️
    - add upload of educations material (pdf file) and link in products database ✔️
    - add upload education video to Bunny Stream or Vimeo Pro and link it in the database ✔️
- backend endpoints for product created (router, model) ✔️
- backend checkout, with stripe module created  ✔️
- /pages/admin/products/index.vue --> admin product overview (list with paginator, sort, filter, delete, edit) ✔️
- /pages/admin/products/create.vue --> admin product create or edit ✔️
User functions:
- /pages/products/index.vue --> Product overview site with searching(picture, name, short description, price on v-card) ✔️
- /pages/products/[id].vue --> Product site with details and buy ✔️
- /components/CartDrawer.vue + add to default layout --> Shopping Cart (basket) ✔️
- backend: install stripe api + add order routes + webhook --> paying due to service provider stripe --> in sandbox running well ✔️
- /pages/checkout/success.vue + cancel.vue + proxy + backend routes --> checkout process is correct ✔️
- /pages/user/index.vue --> dashboard is done ✔️
- /pages/user/products.vue --> User my products view is done  ✔️

Tasks are open:
→ relive the /pages/register.vue --> link in login and test it.
→ /pages/admin/coaching/index.vue --> overview of scheduled coaching sections in calender + create new slots button
→ /pages/admin/coaching/create.vue --> crate new coaching slot in calendar
→ /components/GenericScheduler.vue --> schedule coaching slot in calender according the availability
→ /pages/user/product/[id].vue --> User product open: download pdf or play video or schedule/reschedule coaching sections
→ /pages/user/profile.vue --> Settings Account settings: change billing adders ...
→ /pages/admin/user/index.vue --> Admin user management (list with paginator, sort, filter, edit, delete + create button)
→ /pages/admin/newsletter/index.vue --> admin newsletter management (list of newsletters with status and figures , paginator, filter, sort)
→ /pages/admin/newsletter/create.vue --> admin newsletter template creator
→ /pages/admin/newsletter/schedule.vue --> admin newsletter scheduler
→ /pages/admin/newsletter/stats.vue --> admin newsletter statistic
→ /pages/admin/index.vue --> admin dashboard
    - statistics
    - funnel
    - pageviews
    - newsletter + performance

