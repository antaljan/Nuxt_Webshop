import Products from "~/pages/user/products.vue"

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
    blog: "Blog",
    products: "Termékek",
    adminSection: "Admin szekció"
  },
  admin: {
    dashboard: "Admin irányítópult",
    Posts: "Blogok szerkesztése",
    users: "Felhasználók kezelése",
    newsletter: "Hírlevelek kezelése",
    products: {
      title: "Termékek kezelése",
      listTitle: "Termékek",
      new: "Új termék",
      edit: "Szerkesztés",
      delete: "Törlés",
      confirmDelete: "Biztosan törlöd ezt a terméket?",
      price: "Ár",
      actions: "Műveletek",
      cover: "Borítókép",
      uploadPdf: "PDF feltöltése",
      existingPdfs: "Meglévő PDF fájlok",
      videoUrl: "Videó URL (Bunny Stream)",
      fullDescription: "Teljes leírás",
      save: "Mentés",
      update: "Frissítés",
      cancel: "Mégse",
      menu: "Termékek kezelése"
    },
    images: "Képek kezelése",
    adminSection: "Admin menü"
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
    backtohome: "← Vissza a kezdőlapra",
    sortBy: "Rendezés",
    titleAZ: "Cím (A-Z)",
    titleZA: "Cím (Z-A)",
    priceLowHigh: "Ár (alacsony → magas)",
    priceHighLow: "Ár (magas → alacsony)",
    newestFirst: "Legújabbak elöl",
    oldestFirst: "Legrégebbiek elöl",
    loadMore: "További betöltése",
    noItemsFound: "Nincs találat.",
    search: "Keresés",
    priceRange: "Ártartomány",
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
    noProducts: "Nincs elérhető termék.",
    price: "Ár",
    description: "Leírás",
    downloadableFiles: "Letölthető fájlok",
    video: "Videó",
    backToList: "Vissza a terméklistához"
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
  },
  user: {
    dashboard: "Saját fiók",
    profile: "Profilom",
    products: "Saját termékek"
  }
}})