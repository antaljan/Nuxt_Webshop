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
    blog: "Blog"
  },
  admin: {
    newPost: "New Post",
    Posts: "Posts",
    users: "Users",
    newsletter: "Newsletter",
    statistics: "Statistics",
    products: "Products",
    images: "Images"
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
  }
}
})
