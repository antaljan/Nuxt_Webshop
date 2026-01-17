<template>
  <div class="blog-list">
    <h1>Blog</h1>
    <p>Latest articles for coaches, psychologists, and consultants.</p>

    <div v-if="pending">Loading...</div>
    <div v-else>
      <div
        v-for="post in data"
        :key="post.slug"
        class="blog-list__item"
      >
        <NuxtLink :to="`/blog/${post.slug}`">
          <h2>{{ post.title }}</h2>
          <p>{{ post.excerpt }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pending } = await useAsyncData('blog-list', () =>
  $fetch('/api/blog')
)
</script>

<style scoped>
.blog-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.blog-list__item {
  margin-bottom: 1.5rem;
}
</style>
