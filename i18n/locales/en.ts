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
    users: "Manage Users",
    newsletter: "Manage Newsletter",
    products: "Manage Products",
    images: "Manage Images",
    adminSection: "Admin Section"
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
    backtohome: "← Back to Home"
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
    noProducts: "No products available."
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
    profile: "My Profile"
  }
}})
