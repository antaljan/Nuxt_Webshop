<!-- app/pages/index.vue -->
 <template>
  <div>
    <h1>User oldal</h1>
    <p>itt lesz a felhasználói tartalom</p>
  </div>
  <v-container class="pa-4">
    <v-btn color="primary">Vuetify működik</v-btn>
  </v-container>
</template>
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
