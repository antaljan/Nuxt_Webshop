export default defineI18nLocale(async (locale) => {
  return {
    $vuetify: {
    carousel: {
      prev: 'Vorherige',
      next: 'Nächste',
      ariaLabel: {
        delimiter: 'Carousel slide {0} / {1}'
      }
    }
  },
  menu: {
    home: "Startseite",
    about: "Über mich",
    story: "Meine Geschichte",
    methode: "Methode",
    contact: "Kontakt",
    blog: "Blog",
    products: "Produkte"
  },
  admin: {
    dashboard: "Admin Dashboard",
    Posts: "Blogbeiträge bearbeiten",
    newsletter: "Newsletter verwalten",
    products: {
      title: "Produkte verwalten",
      listTitle: "Produkte",
      new: "Neues Produkt",
      edit: "Bearbeiten",
      delete: "Löschen",
      confirmDelete: "Sind Sie sicher, dass Sie dieses Produkt löschen möchten?",
      price: "Preis",
      actions: "Aktionen",
      cover: "Cover-Bild",
      uploadPdf: "PDF hochladen",
      existingPdfs: "Vorhandene PDF-Dateien",
      videoUrl: "Video-URL (Bunny Stream)",
      fullDescription: "Vollständige Beschreibung",
      save: "Speichern",
      update: "Aktualisieren",
      cancel: "Abbrechen",
      menu: "Produkte verwalten"
    },
    images: "Bilder verwalten",
    adminSection: "Admin Section",
    users: {
      title: "Benutzern verwalten",
      new: "Neue Benutzer",
      edit: "Benutzerdaten ändern",
      create: "Neue Benutzer",
      role: "Rollen",
      confirmDelete: "Wollen Sie wirklich die Benutzer Löschen?"
    }
  },
  header: {
    login: "Einloggen",
    logout: "Ausloggen",
    admin: "Admin"
  },
  newsletter: {
    subscribeButton: "Newsletter abonnieren",
    firstname: "Vorname",
    lastname: "Nachname",
    email: "Email",
    errorName: "Name muss mindestens 2 Zeichen lang sein!",
    errorEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein!",
    errorGdpr: "Bitte akzeptieren Sie die Datenschutzerklärung!",
    gdpr: {
      before: "Ich akzeptiere die ",
      link: "Datenschutzerklärung."
    }
  },
  common: {
    send: "Senden",
    cancel: "Abbrechen",
    backtohome: "← Zurück zur Startseite",
    sortBy: "Sortieren nach",
    titleAZ: "Titel (A-Z)",
    titleZA: "Titel (Z-A)",
    priceLowHigh: "Preis (niedrig → hoch)",
    priceHighLow: "Preis (hoch → niedrig)",
    newestFirst: "Neueste zuerst",
    oldestFirst: "Älteste zuerst",
    loadMore: "Mehr laden",
    noItemsFound: "Keine Einträge gefunden.",
    search: "Suche",
    priceRange: "Preisbereich",
    save: "speichern",
    delete: "löschen"
  },
  feedback: {
    title: "Rückmeldungen unserer Kunden"
  },
  blog: {
    latest: "Neueste Blogbeiträge",
    loading: "Wird geladen...",
    error: "Fehler beim Laden der Blogbeiträge.",
    empty: "Derzeit keine Beiträge in dieser Sprache verfügbar.",
    readMore: "Weiterlesen",
    viewAll: "Alle Beiträge anzeigen",
    allPosts: "Alle Beiträge",
    backToList: "Zurück zur Liste"
  },  
  products: {
    title: "Produkten",
    viewDetails: "Details",
    buyFor: "Kaufen für",
    noProducts: "Keine Produkte verfügbar.",
    price: "Preis",
    description: "Beschreibung",
    downloadableFiles: "Downloadbare Dateien",
    video: "Video",
    backToList: "Zurück zur Liste"
  },
  cart: {
    title: "Einkaufswagen",
    empty: "Ihr Warenkorb ist leer.",
    total: "Gesamt",
    checkout: "Zur Kasse gehen",
    clear: "Warenkorb leeren"
  },
  checkout: {
    successTitle: "Erfolgreiche Zahlung",
    successText: "Vielen Dank für Ihren Einkauf! Die Produkte stehen bald in Ihrem Benutzerkonto zur Verfügung.",
    goToDashboard: "Zum Benutzerbereich",
    cancelTitle: "Zahlung abgebrochen",
    cancelText: "Es wurden keine Gebühren berechnet. Wenn Sie möchten, können Sie erneut versuchen zu kaufen.",
    backToProducts: "Zurück zu den Produkten"
  },
  user: {
    dashboard: "Mein Dashboard",
    profile: "Mein Profil",
    products: "Meine Produkte"
  },
  auth: {
  register: {
    title: "Registrierung",
    firstname: "Vorname",
    lastname: "Nachname",
    email: "Email",
    password: "Password",
    adress: "Adresse (benötigt für Rechnung)",
    phone: "Telephone Nummer (optional)",
    button: "registrierung",
    haveAccount: "Ich habe schon registriert, melde ich ein",
    errors: {
      required: "Bitte alle pflicht Felde ausfüllen!",
      emailExists: "Die angegebene Email ist bereits registriert.",
      general: "Eine Fehler ist beim Registrierung aufgeträten."
    }
  },
  login: {
    title: "Einmelden",
    email: "Email",
    password: "Password",
    button: "einmelden",
    noAccount: "Ich habe noch keine Account,  Ich registriere.",
    errors: {
      invalid: "Email oder Passwort inkorrekt.",
      general: "Ein Fehler beim Einmeldung aufgeträten."
    }
  }
}
}
})
