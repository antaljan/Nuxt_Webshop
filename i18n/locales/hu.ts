import { read } from "@popperjs/core"
import Products from "~/pages/user/products.vue"
import Profile from "~/pages/user/profile.vue"

export default defineI18nLocale(async (locale) => {
  return {
  $vuetify: {
      input: {
        clear: 'Mező törlése',
        appendAction: "Művelet"
      },
      noDataText: "Nem áll rendelkezésre adat",
      dataFooter: {
        itemsPerPageText: "Elem per lap:",
        itemsPerPageAll: "Mind",
        pageText: "{0}-{1} / {2}",
        firstPage: "Első lap",
        prevPage: "Előző lap",
        nextPage: "Következő lap",
        lastPage: "Utolsó lap"
      },
      carousel: {
        prev: 'Előző',
        next: 'Következő',
        ariaLabel: {
          delimiter: 'Slide {0} / {1}'
        }
      },
      pagination: {
        ariaLabel: {
          root: "Oldal navigáció"
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
    cibersecu: "Cibersecurity",
    Posts: "Blogok szerkesztése",
    blog: {
        title: "Blog kezelése",
        listTitle: "Blogbejegyzések",
        createTitle: "Új blogbejegyzés létrehozása",
        language:"Nyelv",
        editTitle: "Blogbejegyzés szerkesztése",
        form: {
          title: "Cím",
          subtitle: "Alcím",
          author: "Szerző",
          date: "Publikálás dátuma",
          slug: "Slug (URL útvonal)",
          image: "Borítókép",
          content: "Tartalom",
          uploadImage: "Kép feltöltése",
          imageHint: "Kattints a kép feltöltéséhez vagy húzd ide"
        },
        actions: {
          create: "Bejegyzés létrehozása",
          update: "Bejegyzés frissítése",
          saveSuccess: "A bejegyzés sikeresen mentve!",
          saveError: "Hiba történt a mentés során.",
          deleteConfirm: "Biztosan törölni szeretnéd ezt a bejegyzést?"
        }
    },
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
      menu: "Termékek kezelése",
      language: 'Termék nyelve'
    },
    brand: {
      menu: "Arculat beállítások",
      primary: "Fő szín",
      background: "Háttérszín",
      text: "Szövegszín",
      accent: "Kiemelő szín",
      font: "Betűtípus",
      previewTitle: "Előnézet",
      previewText: "Így fog kinézni az oldal az aktuális beállításokkal.",
      previewButton: "Példa gomb"
    },
    images: "Képek kezelése",
    adminSection: "Admin menü",
    users: {
      title: "Felhasználók kezelése",
      new: "Új felhasználó",
      edit: "Felhasználó szerkesztése",
      create: "Új felhasználó létrehozása",
      role: "Szerepkör",
      confirmDelete: "Biztosan törlöd ezt a felhasználót?"
    },
    newsletter: {
      title: "Hírlevél menedzsment",
      campaigns: "Hírlevelek",
      subscribers: "Feliratkozók",
      sendNow: "Hírlevél küldése",
      templates: "Sablonok",
      newSubscriber: "Új feliratkozó",
      sendDialogTitle: "Hírlevél kiküldése",
      stats: {
        totalNewsletters: "Hírlevelek száma",
        totalSubscribers: "Feliratkozók",
        totalOpened: "Megnyitások",
        totalClicks: "Kattintások"
      },
      form: {
        subject: "Hírlevél tárgya",
        date: "Küldés dátuma"
      }
    },
    coaching: {
      menu:"Időpontok"
    }
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
    },
    subscribeTitle: "Hírlevél feliratkozás",
    subscribeDescription: "Gyakorlati önismereti eszközök, coaching-technikák és fejlődést támogató gondolatok — akkor, amikor valóban értéket adnak. A hírleveleim célja, hogy olyan módszereket, felismeréseket és útmutatásokat osszak meg veled, amelyek segítenek tudatosabban vezetni az életedet, jobban kezelni a kihívásokat és magabiztosabban meghozni a döntéseidet. Nem ígérek felesleges zajt vagy üres leveleket. Csak akkor írok, amikor valódi, használható tartalmat tudok adni — olyat, ami tényleg támogat a fejlődésedben.",
    successMessage: "Sikeres feliratkozás! Köszönöm a bizalmadat.",
    errorGeneral: "Hiba történt a feliratkozás során."
  },
  common: {
    send: "Elküldés",
    cancel: "Mégse",
    edit:"Szerkesztés",
    closeEditor: "Szerkesztő bezárása",
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
    save: "Mentés",
    delete: "Törlés",
    reset:"Alapértelmezés visszaállítása",
    gdpr:"Általános Adatvédelmi Rendelet (GDPR)",
    agb:"Általános Szerződési Feltételek",
    user: "Felhasználó",
    bookings: "Foglalt időpontjaim",
    noBookings: "Nincs aktív foglalásod.",
    canceling: "Lemondás",
    termin: "Időpont",
    type: "Típus",
    command: "Művelet",
    completed: "Teljesítve",
    noBooking: "Még nincs időpont foglalva.",
    booking: "Időpont foglalása",
    bookingClosed: "Az időpont lezárult",
    video: "Videó",
    downloadableFiles: "Letölthető fájlok",
    schedulerTitle: "Időpont választása",
    all:"Összes"
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
    backToList: "Vissza a terméklistához",
    yourproducts: "Saját termékek",
    loading: "Betöltés...",
    error: "Hiba történt a termékek betöltésekor.",
    open: "Megnyitás",
    backToDashboard: "Vissza a fiókomhoz",
    coachingSessions: "Coaching alkalmaim",
    purchaseDetails: "Vásárlási részletek",
    errorMissing: "Nincs jogosultságod a tartalomhoz vagy a termék nem található."
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
    profile: "Fiók beállítások",
    products: "Saját termékek",
    productsDescription: "Megvásárolt workshopok, videók, PDF-ek",
    profileDescription: "Személyes adatok, beállítások",
    welcome: "Üdv újra",
    deleteAccount: "Fiók törlése",
    deleteAccountConfirm: "Biztosan törlöd a fiókodat?",
    deleteAccountConfirmText: 'A törlés végleges, minden adatod és hozzáférésed megszűnik.',
    deleteAccountConfirmButton:"Igen, törlöm a fiókomat"
  },
  auth: {
  register: {
    title: "Regisztráció",
    firstname: "Keresztnév",
    lastname: "Vezetéknév",
    email: "Email",
    password: "Jelszó",
    adress: "Cím (számlázáshoz kötelező)",
    country:"Ország",
    zip:"Irányítószám",
    city:"Város",
    street:"Utca, Házszám",
    phone: "Telefonszám (opcionális)",
    button: "Regisztráció",
    haveAccount: "Már van fiókom, belépek",
    errors: {
      required: "Kérlek tölts ki minden kötelező mezőt!",
      emailExists: "Ez az email cím már regisztrálva van.",
      general: "Hiba történt a regisztráció során.",
      acceptTerms: "A regisztrációhoz el kell fogadnod az ÁSZF-et és az Adatkezelési tájékoztatót."
    },
    acceptAgb: "Elfogadom az Általános Szerződési Feltételeket",
    readAgb: "ÁSZF megtekintése",
    acceptGdpr: "Elfogadom az Adatkezelési tájékoztatót",
    readGdpr: "GDPR megtekintése",
    acceptNewsletter: "Szeretnék feliratkozni a hírlevélre"
  },
  login: {
    title: "Bejelentkezés",
    email: "Email",
    password: "Jelszó",
    button: "Belépés",
    noAccount: "Még nincs fiókom, regisztrálok",
    forgotenPsw: "Elfelejtett jelszó",
    errors: {
      invalid: "Hibás email vagy jelszó.",
      general: "Hiba történt a bejelentkezés során."
    }
  }
},
cookie: {
  message: "A weboldal technikai cookie-kat és localStorage-t használ a működéshez.",
  more: "További információ",
  accept: "Elfogadom"
}
}
})