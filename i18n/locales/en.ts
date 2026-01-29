export default defineI18nLocale(async (locale) => {
  return {
    $vuetify: {
    carousel: {
      prev: 'Previous',
      next: 'Next',
      ariaLabel: {
        delimiter: 'Carousel slide {0} / {1}'
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
    Posts: "Edit Blog Posts",
    newsletter: "Manage Newsletter",
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
    images: "Manage Images",
    adminSection: "Admin Section",
    users: {
      title: "User management",
      new: "New user",
      edit: "Edit user",
      create: "Create user",
      role: "Rolle",
      confirmDelete: "Do you want wrily delete the user?"
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
    delete: "delete"
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
    phone: "Phone (optional)",
    button: "Registring",
    haveAccount: "I have already account, log in",
    errors: {
      required: "Please fill all mandantory fields!",
      emailExists: "The email is already registered.",
      general: "Failure by registring."
    }
  },
  login: {
    title: "Login",
    email: "Email",
    password: "Password",
    button: "login",
    noAccount: "I do not have account, i will register one.",
    errors: {
      invalid: "Failure by email or password",
      general: "Failure by login."
    }
  }
}
}})
