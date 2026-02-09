export default defineI18nLocale(async (locale) => {
  return {
    $vuetify: {
      input: {
        clear: 'Field clear',
        appendAction: "Action"
      },
      noDataText: "no data",
      dataFooter: {
        itemsPerPageText: "item per page:",
        itemsPerPageAll: "all",
        pageText: "{0}-{1} / {2}",
        firstPage: "first page",
        prevPage: "prevous page",
        nextPage: "next page",
        lastPage: "last page"
      },
      carousel: {
        prev: 'prev',
        next: 'next',
        ariaLabel: {
          delimiter: 'Slide {0} / {1}'
        }
      },
      pagination: {
        ariaLabel: {
          root: "Page navigation"
        }
      }
  },
  menu: {
    home: "home",
    about: "About",
    story: "My Story",
    methode: "Method",
    contact: "Contact",
    blog: "Blog",
    products: "Products"
  },
  admin: {
    dashboard: "Admin Dashboard",
    cibersecu: "Cibersecurity",
    Posts: "Edit Blog Posts",
    blog: {
        title: "Blog editor",
        listTitle: "Blog posts",
        createTitle: "Create new blog post",
        editTitle: "Edit blog post",
        form: {
          title: "title",
          subtitle: "subtitle",
          author: "author",
          date: "date",
          slug: "Slug (URL)",
          image: "cover image",
          content: "content",
          uploadImage: "upload image",
          imageHint: "click for upload or pull there"
        },
        actions: {
          create: "Create Blog",
          update: "Update Blog",
          saveSuccess: "Save Succesful!",
          saveError: "Failure by saving!",
          deleteConfirm: "Do you wrilly wat to delete?"
        }
    },
    products: {
      title: "Manage Products",
      listTitle: "Products",
      new: "New Product",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this product?",
      price: "Price",
      actions: "Actions",
      cover: "Cover Image",
      uploadPdf: "Upload PDF",
      existingPdfs: "Existing PDF Files",
      videoUrl: "Video URL (Bunny Stream)",
      fullDescription: "Full Description",
      save: "Save",
      update: "Update",
      cancel: "Cancel",
      menu: "Manage Products"
    },
    brand: {
      menu: "Brand Settings",
      primary: "primary collor",
      background: "background collor",
      text: "text collor",
      accent: "accent collor",
      font: "Font type",
      previewTitle: "preview",
      previewText: "so will be looks like your Website witch the actual settings",
      previewButton: "example button"
    },
    images: "Manage Images",
    adminSection: "Admin Section",
    users: {
      title: "User management",
      new: "New user",
      edit: "Edit user",
      create: "Create user",
      role: "Rolle",
      confirmDelete: "Do you want wrily delete the user?"
    },
    newsletter: {
      title: "Newsletter management",
      campaigns: "Newsletters",
      subscribers: "Subscribers",
      sendNow: "Send newsletter",
      templates: "Templates",
      newSubscriber: "New subscribers",
      sendDialogTitle: "Newsletter sending",
      stats: {
        totalNewsletters: "Number of Newsletters",
        totalSubscribers: "total subscribers",
        totalOpened: "total opened",
        totalClicks: "total clicks"
      },
      form: {
        subject: "Subject",
        date: "Date"
      }
    },
    coaching: {
      menu:"Coaching times"
    }
  },
  header: {
    login: "Login",
    logout: "Logout",
    admin: "Admin"
  },
  newsletter: {
    subscribeButton: "Subscribe to newsletter",
    firstname: "First Name",
    lastname: "Last Name",
    email: "Email",
    errorName: "Name must be defined",
    errorEmail: "please enter a valid email address",
    errorGdpr: "Please accept the privacy policy!",
    gdpr: {
      before: "I accept the ",
      link: "privacy policy."
    }
  },
  common: {
    send: "Send",
    cancel: "Cancel",
    edit:"Edit",
    closeEditor: "Close Editor",
    backtohome: "← Back to Home",
    sortBy: "Sort By",
    titleAZ: "Title (A-Z)",
    titleZA: "Title (Z-A)",
    priceLowHigh: "Price (Low → High)",
    priceHighLow: "Price (High → Low)",
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    loadMore: "Load More",
    noItemsFound: "No items found.",
    search: "Search",
    priceRange: "Price Range",
    save: "save",
    delete: "delete",
    reset:"reset",
    gdpr:"General Data Protection Regulation (GDPR)",
    agb:"Terms of Service (AGB)"
  },
  feedback: {
    title: "Testimonials"
  },
  blog: {
    latest: "Latest Blog Posts",
    loading: "Loading...",
    error: "Error loading blog posts.",
    empty: "No posts available in this language.",
    readMore: "Read More",
    viewAll: "View All Posts",
    allPosts: "All Posts",
    backToList: "Back to List"
  },
  products: {
    title: "Products",
    viewDetails: "Details",
    buyFor: "Buy for",
    noProducts: "No products available.",
    price: "Price",
    description: "Description",
    downloadableFiles: "Downloadable Files",
    video: "Video",
    backToList: "Back to List"
  },
  cart: {
    title: "Shopping Cart",
    empty: "Your cart is empty.",
    total: "Total",
    checkout: "Proceed to Checkout",
    clear: "Clear Cart"
  },
  checkout: {
    successTitle: "Successful Payment",
    successText: "Thank you for your purchase! The products will be available in your user account soon.",
    goToDashboard: "Go to User Dashboard",
    cancelTitle: "Payment Cancelled",
    cancelText: "No charges were made. If you'd like, you can try purchasing again.",
    backToProducts: "Back to Products"
  },
  user: {
    dashboard: "My Dashboard",
    profile: "My Profile",
    products: "My Products"
  },
  auth: {
  register: {
    title: "Register",
    firstname: "First name",
    lastname: "Name",
    email: "Email",
    password: "Password",
    adress: "Adress (mandantory for billing)",
    country:"Country",
    zip:"ZIP",
    city:"City",
    street:"Street, Nr.",
    phone: "Phone (optional)",
    button: "Registring",
    haveAccount: "I have already account, log in",
    errors: {
      required: "Please fill all mandantory fields!",
      emailExists: "The email is already registered.",
      general: "Failure by registring.",
      acceptTerms: "To register, you must accept the Terms of Service and Privacy Policy."
    },
    acceptAgb: "I accept the Terms of Service",
    readAgb: "Read Terms of Service",
    acceptGdpr: "I accept the Privacy Policy",
    readGdpr: "Read Privacy Policy",
    acceptNewsletter: "I would like to subscribe to the newsletter"
  },
  login: {
    title: "Login",
    email: "Email",
    password: "Password",
    button: "login",
    noAccount: "I do not have account, i will register one.",
    forgotenPsw: "Forgotten Password",
    errors: {
      invalid: "Failure by email or password",
      general: "Failure by login."
    }
  }
},
cookie: {
  message: "This website uses essential cookies and localStorage for functionality.",
  more: "Learn more",
  accept: "Accept"
}
}})
