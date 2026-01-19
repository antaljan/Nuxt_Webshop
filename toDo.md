Rövid “architectural reality check”
Mostani állapot alapján:
Backen (NODE Express)
    összekapcsolva a MongoDB adatbázissal, kész és fut produktív módban egy VPS-en, nem konténerbe vagy devszerveren, mert a fejlesztésre használt gépem 8Gb memóriája nem bírja.
Nuxt-Backend (Nuxt server routes):
    Auth, blog, products, newsletter, stats, users, stb. endpointok már strukturálva vannak.
    Van külön backend.ts util a külső Node backendhez (ez igazából csak a BACKEND_BASE_URL definiálja ami most a VPS domain neve, de produktív módban ez a localhost:4000 lesz, mert a NUXT frontend és NODE backend ugyanazon a szerveren fog futni).
Frontend:
    Nuxt 4 SSR, Vuetify, n18n, komponens‑alapú felépítés ✔️
    Már van: useAuth, useContent, de a többi composable (blog, product, newsletter, user) még üres.


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
index.vue for landingPage ✔️
GenericImageTextSection ✔️
GenericTextSection ✔️

Tasks are open:
→ Generic elemek létrehozása (transzformálás a meglévő VUE projektből):
    - GenericFeedbackSection
    - GenericContactSection
    - sectionSeparator
    - blogSection
→ Landing page
    - összerakás a Generic elemekből
    - Tailwind
    - SSR content loader finomítása
→ Admin dashboard (pages/admin/index.vue)
    - tatisztikák
    - funnel
    - pageview
    - newsletter performance
→ User dashboard (pages/user/index.vue)
    - vásárlások
    - videók
    - letölthető anyagok
