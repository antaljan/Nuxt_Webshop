<template>
  <div class="landing">
    <section class="hero">
      <h1 class="hero__title">
        Coaching, Psychology & Consulting Platform
      </h1>
      <p class="hero__subtitle">
        Sell digital products, manage clients, and grow your practice with a modern web presence.
      </p>
      <div class="hero__actions">
        <v-btn color="primary" class="mr-4" to="/products">
          View Products
        </v-btn>
        <v-btn variant="outlined" to="/blog">
          Read the Blog
        </v-btn>
      </div>
    </section>

    <section class="features">
      <h2>Main Features</h2>
      <ul>
        <li>Digital product webshop (PDF, e‑book, video, coaching time)</li>
        <li>Blog & newsletter system</li>
        <li>Multilingual, SEO‑friendly SSR architecture</li>
        <li>Admin & client dashboards</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Home | Coaching Platform'
})
</script>

<style scoped>
.landing {
  padding: 3rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero__title {
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  font-weight: 700;
  line-height: 1.1;
}

.hero__subtitle {
  margin-top: 1rem;
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #555;
}

.hero__actions {
  margin-top: 2rem;
}

.features h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}
</style>
