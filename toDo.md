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

Bugs:
    critical:
        - none
    Warnings:
        → [intlify] Not found '$vuetify.input.clear' key in 'hu' locale messages

Tasks are open:
→ /pages/admin/cibersecu.vue --> admin ciber security dashboard (feching potential risks from logs)
→ /pages/admin/products/create.vue --> add the language to product creatig or edit - product has to be language relevant
→ /pages/products/index.vue --> filter the product for language - product has to be language relevant

→ /pages/user/product/[id].vue 
    --> User product open:  integrate bunny video
    --> A Coaching terméket töbször is megveheti a user, mert egy vásárlás csak egy alkalomra jogosítja fel, a vásárlás után lefoglalhatja az elérhető időpontok közül amelyik megfelő neki és a foglalás napjáig módosíthatja akár többször is. Nem szeretnék a user termék oldalán több kártyát listázni az azonos termékre, mert elveszti az átekinhetőséget, ha egy 20 alkalmas coaching sorozatot vásárol és 20 kártya lesz a listában. Összafoglalva, a coaching termék betöltésekor meg kell vizsgálni, hogy hányszor vettemeg a terméket és ezeket listázni. A listában fel kel tünteni, hogy van-e már időpont foglalva, ha van lehesen módosítani, ha nincs akkor jelenjen meg egy foglalás gomb (icon). Ha a lefoglalt coaching időpont teljesült akkor ez legyen felismerhető a listában a teljesülés dátumával és ne lessen többé módosítani. Ehhez a phurcase adarbáziba be kell rakni a foglalás számát és a foglalásba a státuszt. Továbbá a termék egyedi lapját (frontend/pages/user/product/[id].vue) ki kell egészíteni egy csak a coaching tipusu termékeknél megjelenő listával és a GenericScheduler.vue modult el kell rejteni és majs csak a foglalás vagy módosítás akciókra megjeleníteni.
    A Logikai Terv:
        1. Vásárlások számlálása: Meg kell nézni a purchases tömbben, hányszor szerepel az adott productId. Ezeket listázni kell.
        2. Le kell kérni az összes foglalást, amelyet a purchase tömb az adot termékhez és userhez rendel.
        3. Azoknál a vásárlásoknál ahol nincs foglalás, legyen egy a foglalást engedélyező gomb.
        4. Azoknál a vásárlásoknál ahol van foglalás, de holnap vagy azutáni időpontra, legyen engedélyezve az átfoglalás és cancel.
        5. A mai vagy múltbéli időpontok védelme: Ha az időpont már elmúlt vagy mai, a lemondás/módosítás gomb tűnjön el.
        6. A teljesült időpontok esetében (melyeket a coach visszaigazol) jelenjen meg, hogy teljesült és mikor(dátum).
