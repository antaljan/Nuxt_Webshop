<!-- app/pages/index.vue -->
<template>
    <div>
        <h1>Products oldal</h1>
        <p>itt lesz a termék tartalom</p>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'products'
})
</script>