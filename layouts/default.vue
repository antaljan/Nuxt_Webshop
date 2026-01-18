<script setup>
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
</script>

<template>
  <v-app>
    <MyHeader />

    <v-main>
      <slot />
    </v-main>

    <MyFooter />
  </v-app>
</template>
