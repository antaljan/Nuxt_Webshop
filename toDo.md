Short “architectural reality check”
current situation:
backend (NODE Express)
    Running in productive mode on a VPS (IONOS) , connected to MongoDB. (not on dev-server in docker or container because my developer hardware has only 8GB RAM)
Nuxt-Backend (Nuxt server routes):
    Auth, blog, products, newsletter, stats, users ect... endpoints are structured and done.
    There is an a backend.ts in /server/utils witch exported the BACKEND_BASE_URL item, this is the URL for NODE API Server on VPS. (backend and frontend will be running on same VPS in productive system. frontend on port:3000 backend on port:4000 within the NODE backend will be not any more visible for other, only for frontend.)
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
- useAuth.ts ✔️
- auth.ts ✔️
- admin.global.ts ✔️
- login.post.ts ✔️
- layouts/default.vue ✔️
- i18n ✔️
- MyHeader.vue ✔️
- MyFooter.vue ✔️
- chart.js installed ✔️
- LineChart.vue and BarChart.vue added to components/charts/ ✔️

Landing Page (public page):
- GeneralHeroSection.vue ✔️
- landing page (index.vue) create from generic items, Tailwind, SSR content loader fine tuning ✔️
- sectionSeparator ✔️
- GenericImageTextSection ✔️
- GenericTextSection ✔️
- GenericFeedbackSection ✔️
- GenericContactSection ✔️
- GenericBlogSection ✔️
- Generic create and integrate them in landing page ✔️
- Blog pages (overview, one view) ✔️
- Blog admin (list, create with tiptap editor, edit, delete) ✔️
- SSR safe user status, stabilized duo to useRequestHeaders(['cookie']) ✔️
- menu links are ssr safe fixed ✔️

Admin functions:
- access control for admin dashboard and pages realized ✔️
- Backend endpoints for product (router, model) ✔️
- backend checkout, with stripe module ✔️
- Admin sites for product (overview,create) ✔️

User functions:
- Product overview site with searching(picture, name, short description, price on v-card) ✔️
- Product site with details and buy ✔️
- Shopping Cart (basket) ✔️
- paying due to service provider stripe --> in sandbox running well ✔️

Tasks are open:
→ WEB Shop (products):
    - the checkout doesn't give over the userID for backend therefore no new item in purchase table of mongoDB database
        honestly the user authentication is since the beginning an a big problem under SSR, maybe has to be rethink the concept, there
        are many possible solutions one of them is the serverSupabaseUser - Nuxt Supabase.
    - product - upload of education products (pdf file) and link in products database
    - product - upload education video to Bunny Stream or Vimeo Pro and link it in the database
→ User dashboard (pages/user/index.vue)
    - My Products overview, i think same like the product overview, but instead of price and purchase button, only the purchase datum screened:
    - My product view. opening the product from overview and read, view or download:
        - video
        - download materials (ebook, pdf..)
        - Scheduled consultations/coaching --> take a look on scheduled time
→ Admin: user management
→ Admin: newsletter management
→ Admin dashboard (pages/admin/index.vue)
    - statistics
    - funnel
    - pageview
    - newsletter + performance

