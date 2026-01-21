Short “architectural reality check”
current situation:
Backen (NODE Express)
    Running in productiv mode on a VPS (IONOS) , connected to MongoDB. (not on dev-server in docker or contener because my developper hardware has only 8GB RAM)
Nuxt-Backend (Nuxt server routes):
    Auth, blog, products, newsletter, stats, users ect... endpoints are structured and done.
    There is an a backend.ts in /server/utils witch exported the BACKEND_BASE_URL item, this is the URL for NODE API Server on VPS. (backend and frontend will be running on same VPS in productiv system. frontend on port:3000 backend on port:4000 withit the NODE backend will be not any more visible for othert, only for frontend.)
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
useAuth.ts ✔️
auth.ts ✔️
admin.global.ts ✔️
login.post.ts ✔️
layouts/default.vue ✔️
layouts/user.vue ✔️
layouts/admin.vue ✔️
i18n ✔️
MyHeader.vue ✔️
Myfooter.vue ✔️
GeneralHeroSection.vue ✔️
landing page (index.vue) összerakás a Generic elemekből, Tailwind, SSR content loader finomítása ✔️
sectionSeparator ✔️
GenericImageTextSection ✔️
GenericTextSection ✔️
GenericFeedbackSection ✔️
GenericContactSection ✔️
GenericBlogSection ✔️
Generic elemek létrehozása és integrálása a landing page-re (transzformálás a meglévő VUE projektből) ✔️
Blog pages (overview, one view) ✔️
Blog admin (list, create with tiptap editor, edit, delete) ✔️
SSR safe user status, stabilised duo to useRequestHeaders(['cookie']) ✔️
menü links are ssr safe fixed ✔️
chart.js installed ✔️
LineChart.vue and BarChart.vue added to components/charts/ ✔️
admin dashbord and pages acsess controll realised ✔️

Tasks are open:
→ Admin dashboard (pages/admin/index.vue)
    - statistics
    - funnel
    - pageview
    - newsletter + performance
→ webshop (products):
    - overview with searching(picture, name, short descripion, price on v-card)
    - product site / product with detalis and buy
    - shopping basket
    - purchase only registred user can buy (because billing) --> login or registration by buying
    - paying due to serviceprovider (socket)
→ User dashboard (pages/user/index.vue)
    - My Products:
        - video
        - download materials (ebook, pdf..)
        - Scheduled consultations/choacings

