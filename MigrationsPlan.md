Nuxt 4 Migrációs Projektterv (Frissített, professzionális verzió)
1. Nuxt 4 SSR architektúra véglegesítése
1.1 Oldalszerkezet és routing
Public:
/ – Landing page

/blog – Blog lista

/blog/[slug] – Blog cikk

/products – Terméklista

/products/[id] – Termékoldal

/login, /register

User (auth szükséges):

/user – Dashboard

/user/products – Vásárolt termékek

/user/videos – Videók

/user/settings – Profil + hírlevél beállítások

Admin (role: admin):

/admin – Admin dashboard

/admin/blog – Blog CRUD

/admin/products – Termék CRUD

/admin/content – CMS

/admin/newsletter – Editor, scheduler, stats

1.2 API‑kommunikációs minták
Nuxt 4 SSR alatt három szintű API hívás lesz:

Public SSR fetch  
useAsyncData(() => $fetch('/api/blog'))

Authenticated SSR fetch  
useAsyncData(() => $fetch('/api/user/me', { credentials: 'include' }))

Client‑side interakciók  
pl. form submit, kosár, newsletter subscribe

Modulok:

Auth API

Blog API

Product API

Newsletter API

Statistics API

1.3 SEO stratégia
Meta tag-ek: useHead()

Canonical URL: dinamikusan generálva

JSON‑LD: blog cikkekhez, termékekhez

i18n SEO:

hreflang

locale‑based routing

default: EN

2. A jelenlegi Vue projekt migrációs terve Nuxt 4‑be
2.1 Komponensek kategorizálása
Három csoportra bontva:

A) 1:1‑ben átvehető komponensek
UI elemek (gombok, kártyák, layout elemek)

Form komponensek

ProductCard, BlogCard

Admin táblázatok (Vuetify DataTable)

B) Minimális módosítással átvehető
BlogList.vue

ProductList.vue

UserDashboard.vue
→ csak az adatbetöltést kell SSR‑re átírni

C) Újragondolást igényel (SSR miatt)
blogRead.vue

jelenleg client‑side fetch

Nuxt‑ban SSR fetch + SEO meta + JSON‑LD

canonical + slug validáció

VideoPlayer.vue

streaming provider integráció

tokenes védelem backend oldalon

LandingPage.vue

CMS‑ből töltött tartalom SSR‑rel

2.2 Lifecycle migráció
Vue 2/3	Nuxt 4 SSR megfelelő
onMounted	useAsyncData / useFetch
created	server‑side fetch
mounted	csak UI interakciók
axios	$fetch / server routes
2.3 Külön figyelmet igénylő részek
Client‑side only pluginok → plugins/*.client.ts

LocalStorage → csak client oldalon

Auth state → server route + cookie

3. Backend integráció lépésről lépésre
3.1 Nuxt SSR → Node/Mongo backend hívása
A meglévő backend marad külön processz, külön porton.

Nuxt SSR hívások:

Kód
/api/* → Nginx → Node backend
Nuxt oldalon:

Kód
const data = await $fetch('/api/blog')
3.2 Auth / JWT kezelés Nuxt oldalon
Login → backend JWT generál

Nuxt server route → JWT → HTTP‑only cookie

SSR alatt a cookie alapján:

user állapot betöltése

role ellenőrzés (admin middleware)

3.3 API integrációk
Blog API → SSR blog lista + cikk

Statistics API → pageview tracking

Content manager → landing + statikus oldalak

Newsletter API → admin editor + scheduler

3.4 Deploy stratégia
Nuxt SSR → PM2 process

Backend API → PM2 process

Nginx reverse proxy

HTTPS (Let’s Encrypt)

3.5 Port kiosztás
Backend API: :3001

Nuxt SSR: :3000

Nginx: :80 / :443

4. Nginx konfiguráció
4.1 Routing
Kód
/        → Nuxt SSR
/api/*   → Node backend
4.2 PM2 processzek
nuxt-ssr

backend-api

Restart stratégia:

pm2 restart nuxt-ssr --update-env

pm2 restart backend-api

Logolás:

pm2 logs nuxt-ssr

pm2 logs backend-api