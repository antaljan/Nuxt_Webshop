export default defineI18nLocale(async (locale) => {
  return {
    $vuetify: {
      input: {
        clear: 'Feld leeren',
        appendAction: "Aktion"
      },
      noDataText: "keine Daten vorhanden",
      dataFooter: {
        itemsPerPageText: "item pro Seite",
        itemsPerPageAll: "alle",
        pageText: "{0}-{1} / {2}",
        firstPage: "erste Seite",
        prevPage: "vorige Seite",
        nextPage: "nächste Seite",
        lastPage: "letzte Seite"
      },
      carousel: {
        prev: 'vorherige',
        next: 'nächste',
        ariaLabel: {
          delimiter: 'Slide {0} / {1}'
        }
      },
      pagination: {
        ariaLabel: {
          root: "Seitennavigation"
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
    cibersecu: "Cibersecurity",
    Posts: "Blogbeiträge bearbeiten",
    blog: {
        title: "Blog Editor",
        listTitle: "Blog Posten",
        createTitle: "Neue Blogeintrag",
        language:"Sprache",
        editTitle: "Edit Blogeintrag",
        form: {
          title: "Title",
          subtitle: "Subtitle",
          author: "Author",
          date: "Date",
          slug: "Slug (URL)",
          image: "Bild",
          content: "Innhalt",
          uploadImage: "Bild aufladen",
          imageHint: "Klick für hochladen oder hier ziehen"
        },
        actions: {
          create: "Blog Post erstellen",
          update: "Blog Post aktualisieren",
          saveSuccess: "Blog Post erfolgreich gespeichert!",
          saveError: "Fehler beim speichern!",
          deleteConfirm: "Wills Du wirchlig der Blogeintrag löschen?"
        }
    },
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
      menu: "Produkte verwalten",
      language: 'Produkt Sprache'
    },
    brand: {
      menu: "Brand Einstellungen",
      primary: "Haupt Farbe",
      background: "Hintergrund Farbe",
      text: "Text Farbe",
      accent: "Aushebung Farbe",
      font: "Font Type",
      previewTitle: "Vorshau",
      previewText: "so wird deine Webseite aussehen mit der aktuelle Einstellungen",
      previewButton: "Muster Taste"
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
    },
    newsletter: {
      title: "Newsletter Verwalten",
      campaigns: "Newsletters",
      subscribers: "Abonenten",
      sendNow: "Senden",
      templates: "Sablonen",
      newSubscriber: "neue Abonenten",
      sendDialogTitle: "Newsletter senden",
      stats: {
        totalNewsletters: "Anzahl Newsletters",
        totalSubscribers: "Alle Abonenten",
        totalOpened: "Alle Geöffneten",
        totalClicks: "Alle Klicks"
      },
      form: {
        subject: "Subject",
        date: "Datum"
      }
    },
    coaching: {
      menu:"Coaching Zeiten"
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
    edit:"Bearbeiten",
    closeEditor: "Editor schließen",
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
    delete: "löschen",
    reset:"zurücksetsen auf Grundeinstellungen",
    gdpr:"General Data Protection Regulation (GDPR)",
    agb:"Allgemeine Geschäftsbedingungen",
    user: "Benutzer",
    bookings: "Meine Buchungen",
    noBookings: "Keine aktiven Buchungen.",
    canceling: "Buchung abbrechen",
    termin: "Termin",
    type: "Type",
    command: "Kommando",
    completed: "Abgeschlossen",
    noBooking: "Keine Buchung verfügbar.",
    booking: "Termin buchen",
    bookingClosed: "Der Termin ist geschlossen",
    video: "Video",
    downloadableFiles: "Downloadbare Dateien",
    schedulerTitle: "Zeitfenster auswählen",
    all:"Alle"
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
    backToList: "Zurück zur Liste",
    yourproducts: "Ihre Produkte",
    loading: "Wird geladen...",
    error: "Fehler beim Laden der Produkte.",
    open: "Öffnen",
    backToDashboard: "Zurück zum Dashboard",
    coachingSessions: "Meine Coaching-Sessions",
    purchaseDetails: "Kaufdetails",
    errorMissing: "Sie haben keine Berechtigung, auf diesen Inhalt zuzugreifen oder das Produkt ist nicht verfügbar."
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
    products: "Meine Produkte",
    productsDescription: "Meine gekauften Workshops, Videos und PDFs",
    profileDescription: "Persönliche Daten und Einstellungen",
    welcome: "Willkommen zurück",
    deleteAccount: "Konto löschen",
    deleteAccountConfirm: "Sind Sie sicher, dass Sie Ihr Konto löschen möchten?",
    deleteAccountConfirmText: 'Die Löschung ist dauerhaft, und alle Ihre Daten und Zugriffe werden verloren gehen.',
    deleteAccountConfirmButton:"Ja, lösche mein Konto"
  },
  auth: {
  register: {
    title: "Registrierung",
    firstname: "Vorname",
    lastname: "Nachname",
    email: "Email",
    password: "Password",
    country:"Land",
    zip:"Postglietzahl",
    city:"Stadt",
    street:"Strasse, Haus Nr.",
    adress: "Adresse (benötigt für Rechnung)",
    phone: "Telephone Nummer (optional)",
    button: "registrierung",
    haveAccount: "Ich habe schon registriert, melde ich ein",
    errors: {
      required: "Bitte alle pflicht Felde ausfüllen!",
      emailExists: "Die angegebene Email ist bereits registriert.",
      general: "Eine Fehler ist beim Registrierung aufgeträten.",
      acceptTerms: "Um sich zu registrieren, müssen Sie die Allgemeinen Geschäftsbedingungen und die Datenschutzerklärung akzeptieren."
    },
    acceptAgb: "Ich akzeptiere die Allgemeinen Geschäftsbedingungen",
    readAgb: "Allgemeine Geschäftsbedingungen anzeigen",
    acceptGdpr: "Ich akzeptiere die Datenschutzerklärung",
    readGdpr: "Datenschutzerklärung anzeigen",
    acceptNewsletter: "Ich möchte den Newsletter abonnieren"
  },
  login: {
    title: "Einmelden",
    email: "Email",
    password: "Password",
    button: "einmelden",
    noAccount: "Ich habe noch keine Account,  Ich registriere.",
    forgotenPsw: "Vergessene Password",
    errors: {
      invalid: "Email oder Passwort inkorrekt.",
      general: "Ein Fehler beim Einmeldung aufgeträten."
    }
  }
},
cookie: {
  message: "Diese Website verwendet technisch notwendige Cookies und localStorage.",
  more: "Mehr erfahren",
  accept: "Akzeptieren"
}
}})
