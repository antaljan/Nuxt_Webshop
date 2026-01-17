<!-- app/pages/index.vue -->
<template>
    <div>
        <h1>Blog oldal</h1>
        <p>itt lesz blog tartalom</p>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'blog'
})
</script>