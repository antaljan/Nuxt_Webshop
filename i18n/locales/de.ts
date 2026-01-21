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
    blog: "Blog"
  },
  admin: {
    newPost: "Neue Beitrag",
    Posts: "Beiträge",
    users: "Benutzer",
    newsletter: "Newsletter",
    statistics: "Statistiken",
    products: "Produkte",
    images: "Bilder"
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
    backtohome: "← Zurück zur Startseite"
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
  },  products: {
    title: "Produkte",
    viewDetails: "Details",
    buyFor: "Kaufen für",
    noProducts: "Keine Produkte verfügbar."
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
}
}
})
