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
- /pages/register.vue --> registring new user ✔️
- /pages/admin/user/index.vue --> Admin user management (list with paginator, sort, filter, edit, delete + create button)  ✔️
- /pages/admin/images/index.vue --> Admin images management (list in mosaic with name, delete button)  ✔️
- /pages/user/profile.vue --> Settings Account settings: change billing adders ...  ✔️
- /pages/admin/newsletter/index.vue --> admin newsletter management (list of newsletters with status and figures , paginator, filter, sort)  ✔️
- /pages/admin/newsletter/create.vue --> admin newsletter template creator  ✔️
- /pages/admin/newsletter/schedule.vue --> admin newsletter scheduler  ✔️
- /pages/admin/coaching/index.vue --> overview of scheduled coaching sections in calender + create new slots button  ✔️
- /pages/admin/coaching/create.vue --> crate new coaching slot in calendar  ✔️
- /components/GenericScheduler.vue --> schedule coaching slot in calender according the availability  ✔️
- /pages/user/product/[id].vue --> User product view: download pdf, scheduling coaching section or video view  ✔️
- /pages/admin/index.vue --> admin dashboard  ✔️
    - statistics  ✔️
    - funnel  ✔️
    - pageviews  ✔️
    - newsletter + performance  ✔️
- User dashboard (/pages/user/index.vue) is extended with list of booked coachings ✔️

Tasks are open:
→ /pages/user/product/[id].vue --> User product open:  play video integrate bunny video
→ /pages/admin/cibersecu.vue --> admin ciber security dashboard (feching potential risks from logs)
→ /pages/admin/products/create.vue --> add the language to product creatig or edit - product has to be language relevant
→ /pages/products/index.vue --> filter the product for language - product has to be language relevant

Bugs:
critical:
- none
Warnings:
→ [intlify] Not found '$vuetify.input.clear' key in 'hu' locale messages

--> a terméket töbször is megvejeti a user, mert csak egy coaching időpontot foglalhat vele, így nem elég a termékre szűrni. meg kell vizsgálni, hogy hányszor vettemeg a terméket és hány foglalása van és ezeket is meg kell jeleníteni a GeneralScheduler.vue-ban. valamint amikor a coaching lezárult, már nem szabad, hogy módosítsa az időpontot. De mivel ez egy nagyobb feladat és nekem már nincs több időm, így majd estére marad.
A Logikai Terv (Estére)
1. Vásárlások számlálása: Meg kell nézni a purchases tömbben, hányszor szerepel az adott productId. Ez lesz a felhasználó "kerete".
2. Foglalások számlálása: Le kell kérni az összes foglalást, ami ehhez a termékhez és felhasználóhoz tartozik.
3. Különbségkezelés: * Ha vásárlások száma > foglalások száma, akkor a Scheduler engedjen új időpontot választani.
4. Ha egyenlő, akkor csak a meglévők listázása és (ha még nem zajlott le) módosítása engedélyezett.
5. Múltbéli időpontok védelme: A cancelSlot gombot egy extra feltétellel kell ellátni: if (new Date(slot.start) > new Date()). Ha az időpont már elmúlt, a lemondás/módosítás gomb tűnjön el.
Amiben segíteni tudok, ha visszatérsz:
- Egy olyan számított mező (computed property) megírása, ami összesíti a "szabad kreditjeit" a felhasználónak.
- A GenericScheduler.vue sablonjának felkészítése arra, hogy ne csak egy, hanem több korábbi foglalást is szépen kilistázzon (pl. "1. alkalom - Lezárult", "2. alkalom - Közelgő").
- A backend lekérdezés finomítása, hogy egyszerre kapjuk meg a vásárlási adatokat és a slotokat.