export default defineI18nLocale(async (locale) => {
  return {
  $vuetify: {
    carousel: {
      prev: 'Előző',
      next: 'Következő',
      ariaLabel: {
        delimiter: 'Carousel slide {0} / {1}'
      }
    }
  },
  menu: {
    home: "Kezdőlap",
    about: "Rólam",
    story: "Történetem",
    methode: "Módszer",
    contact: "Kapcsolat",
    blog: "Blog"
  },
  admin: {
    newPost: "Új bejegyzés",
    Posts: "Bejegyzések",
    users: "Felhasználók",
    newsletter: "Hírlevél",
    statistics: "Statisztika",
    products: "Termékek",
    images: "Képek"
  },
  header: {
    login: "Bejelentkezés",
    logout: "Kijelentkezés",
    admin: "Admin"
  },
  newsletter: {
    subscribeButton: "Hírlevél feliratkozás",
    firstname: "Keresztnév",
    lastname: "Vezetéknév",
    email: "Email",
    errorName: "A név kötelező",
    errorEmail: "Kérjük, adjon meg egy érvényes e-mail címet!",
    errorGdpr: "Kérjük, fogadja el az adatvédelmi nyilatkozatot!",
    gdpr: {
      before: "Elfogadom az ",
      link: "adatvédelmi nyilatkozatot."
    }
  },
  common: {
    send: "Elküldés",
    cancel: "Mégse",
    backtohome: "← Vissza a kezdőlapra"
  },
  feedback: {
    title: "Visszajelzések"
  },
  blog: {
    latest: "Legfrissebb Blogbejegyzések",
    loading: "Betöltés...",
    error: "Hiba történt a bejegyzések betöltésekor.",
    empty: "Jelenleg nincs elérhető bejegyzés ezen a nyelven.",
    readMore: "Tovább olvasom",
    viewAll: "Összes bejegyzés megtekintése",
    allPosts: "Összes bejegyzés",
    backToList: "Vissza a listához"
  },
  products: {
    title: "Termékek",
    viewDetails: "Részletek",
    buyFor: "Vásárlás",
    noProducts: "Nincs elérhető termék."
  },
  cart: {
  title: "Bevásárló kosár",
  empty: "A kosár üres.",
  total: "Végösszeg",
  checkout: "Tovább a fizetéshez",
  clear: "Kosár ürítése"
},
checkout: {
  successTitle: "Sikeres fizetés",
  successText: "Köszönöm a vásárlást! A termékek hamarosan elérhetőek a felhasználói fiókodban.",
  goToDashboard: "Tovább a felhasználói felületre",
  cancelTitle: "A fizetés megszakadt",
  cancelText: "Nem történt terhelés. Ha szeretnéd, újra megpróbálhatod a vásárlást.",
  backToProducts: "Vissza a termékekhez"
}
}})
