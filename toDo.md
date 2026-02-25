Short “architectural reality check”

backend (NODE Express)
    Running in productive mode on a VPS (IONOS) on port 3000, connected to MongoDB.
    linked with 2 domains: https://antaligyongyi.hu/api (primary), https://yowayoli.com/api
    hosted with nginx, nginx controlled the /api tag.
Nuxt-Backend (Nuxt server routes):
    Auth, blog, products, newsletter, stats, users ect... endpoints are structured and done.
    The backend and frontend running on same VPS in productive system, frontend on port:3000 backend on port:4000.
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
- Email sending for user and admin bei one slot reservation ✔️
- GO LIVE (nuxt app deployed on server and running under pm2) ✔️
- favicon recolor to green ✔️
- add info@antaligyongyi.hu mail service to backend ✔️
- create user language depending mail service: hu - info@antaligyongyi.hu , de,en - info@yowayoli.com ✔️

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
- backend: install stripe api + add order routes + webhook --> paying due to service provider stripe --> in sandbox running well ✔️
- password forgoten --> backend user.controller and routes, frontend, link in pages/login.vue ✔️
    - backend/controllers/user.controller.js: add forgoten-passwor and password-reset functions ✔️
    - frontend/pages/forgot-password.vue ✔️
    - frontend/pages/reset-password.vue ✔️
- create General Terms and Conditions (inclusive therms of Services, with the usage of digital content) ✔️
- create data privacy pollicie ✔️
- /pages/products/index.vue --> filter the product for language - product has to be language relevant ✔️
- Frontend/components/MyFooter.vue --> insta icon has to be recolored to insta color (i think R:215,G:96,B:183) ✔️
- extra site for newsletter subscribe: frontend/pages/subscribe.vue (Gyöngyi will be distribute one subscribe link in social medien) ✔️

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
- /pages/admin/user/index.vue --> Admin user management (list with paginator, sort, filter, edit, delete + create button)  ✔️
- /pages/admin/images/index.vue --> Admin images management (list in mosaic with name, delete button)  ✔️
- /pages/admin/newsletter/index.vue --> admin newsletter management (list of newsletters with status and figures , paginator, filter, sort)  ✔️
- /pages/admin/newsletter/create.vue --> admin newsletter template creator  ✔️
- /pages/admin/newsletter/schedule.vue --> admin newsletter scheduler  ✔️
- /pages/admin/coaching/index.vue --> overview of scheduled coaching sections in calender + create new slots button  ✔️
- /pages/admin/coaching/create.vue --> crate new coaching slot in calendar  ✔️
- /pages/admin/index.vue --> admin dashboard  ✔️
    - statistics  ✔️
    - funnel  ✔️
    - pageviews  ✔️
    - newsletter + performance  ✔️
- /pages/admin/cibersecu.vue --> admin cyber security dashboard  ✔️
- Branding design setup:
    - all commponents cleaned from direct coloring, we use only: ✔️
        - theme.themes.value.brandTheme.colors.primary = s.primaryColor
        - theme.themes.value.brandTheme.colors.secondary = s.accentColor
        - theme.themes.value.brandTheme.colors.background = s.backgroundColor
        - theme.themes.value.brandTheme.colors.surface = s.backgroundColor
        - theme.themes.value.brandTheme.colors.info = s.accentColor
        - theme.themes.value.brandTheme.colors.success = s.accentColor
        - theme.themes.value.brandTheme.colors.warning = s.accentColor
        - theme.themes.value.brandTheme.colors.error = s.primaryColor
    - /plugins/brand-theme-client.ts + define brandTheme in nuxt.config.ts ✔️
    - /components/BrandThemeUpdater.vue + insert in layouts/default.vue ✔️
    - /composable/useBrand + server/admin/brand.get.ts + server/admin/brand.put.ts ✔️
- pages/admim/brand/index.vue ✔️
- /pages/admin/products/create.vue --> add the language to product creating or edit - product has to be language relevant ✔️
- admin has to be complete the booking slots, the frontend is missing, but the backend has already an a endpoint for that PUT:booking/complete/:id (verifyAdmin) ✔️
- new function on pages/admin/brand: maintanance modus, if ist on than only a commong soon section available on the landing page and only admin  can log in (she can see and edit everything) ✔️
- frontend/pages/admin/users/index.vue --> add language settings option to users on admin user management ✔️
- frontend/pages/admin/newsletter/index.vue --> add language settings option to subscribers on admin newsletter management ✔️
- New newsletter template with json amd tiptap editor for paragraph ✔️
- Campaigns with campaigns manager based on newsletter, campaign is a scheduled row of newsletters ✔️

User functions:
- /pages/products/index.vue --> Product overview site with searching(picture, name, short description, price on v-card) ✔️
- /pages/products/[id].vue --> Product site with details and buy ✔️
- /components/CartDrawer.vue + add to default layout --> Shopping Cart (basket) ✔️
- /pages/checkout/success.vue + cancel.vue + proxy + backend routes --> checkout process is correct ✔️
- /pages/user/index.vue --> dashboard is done ✔️
- /pages/user/products.vue --> User my products view is done  ✔️
- /pages/register.vue --> registering new user ✔️
- /pages/user/profile.vue --> Settings Account settings: change billing adders ...  ✔️
- /components/GenericScheduler.vue --> schedule coaching slot in calender according the availability  ✔️
- /pages/user/product/[id].vue --> User product view: download pdf, scheduling multiple coaching section  ✔️
- /pages/user/product/[id].vue --> integrate bunny video player in product view ✔️
- User dashboard (/pages/user/index.vue) is extended with list of booked coaching ✔️
- /pages/user/profile --> add cancel end profile delete function ✔️
- GenericScheduler.vue dont has to be show the reserved slots, only the availables ✔️
- frontend/pages/user/profile --> add language settings option to user profile settings ✔️

Bugs:
    critical:
        - none
    Warnings:
        - none

Tasks are open:
→ details view page for purchases: list with filters
→ rework newsletter/campaigns admin dashboard: daily email send and scheduling diagramm for actual month, but with filter possibility for from-to dates. Time Line campaigns with opening and click rate
→ welcome newsletter package for newcommers: 5-6 newsletters scheduled in weekly (o rtwo per week) after registration with pre defined content acc. sales rolues
→ billing with backend acc EN16
A invoiceNumber.js + a purchase.model.js módosítás + a webhook frissítése együtt már teljesen működő számlaszám‑generálást ad:
/ CREATE purchase
async function createPurchase(data) {
  const db = getDb();
  const purchase = {
    userId: new ObjectId(data.userId),
    items: data.items,
    amount: data.amount,
    currency: data.currency,
    stripeSessionId: data.stripeSessionId,
    createdAt: new Date(),
    invoiceNumber: data.invoiceNumber
  };
  const result = await db.collection(COLLECTION).insertOne(purchase);
  return { ...purchase, _id: result.insertedId };
}
Következő lépés (ha szeretnéd):
Most, hogy a számlaszám a helyére került, jöhet a következő finomítás:
👉 1) Seller adatok beépítése (német előírás szerint kötelező)
cégnév
cím
Steuernummer vagy USt-IdNr
email
bankszámla (ha kell)
👉 2) Payment Means beépítése a ZUGFeRD XML-be
Stripe
kártya
PaymentIntent ID
👉 3) PDF/A‑3 metaadatok finomítása
XMP metadata
ZUGFeRD profil jelölése
👉 4) Admin UI-ban a számlaszám megjelenítése
purchases listában
purchase detail nézetben
