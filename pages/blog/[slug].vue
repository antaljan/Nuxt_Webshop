<template>
  <article class="blog-article" v-if="post">
    <h1>{{ post.title }}</h1>
    <p class="blog-article__meta">
      {{ post.publishedAt }}
    </p>
    <div v-html="post.content" class="blog-article__content" />
  </article>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(
  () => `blog-${route.params.slug}`,
  () => $fetch(`/api/blog/${route.params.slug}`)
)

useHead(() => ({
  title: post.value?.title
    ? `${post.value.title} | Blog`
    : 'Blog article',
  meta: [
    {
      name: 'description',
      content: post.value?.excerpt || ''
    }
  ]
}))
</script>

<style scoped>
.blog-article {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.blog-article__meta {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.blog-article__content {
  line-height: 1.6;
}
</style>
