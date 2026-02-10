<template>
  <v-footer class="bg-gray-50 text-text py-10 mt-12" padless>
    <v-container class="text-center">
      <!-- Divider -->
        <div class="w-full h-[1px] bg-gray-400 my-6"></div>
      <!-- Newsletter button -->
      <div class="flex justify-center mt-4">
        <NuxtLink
          to="/subscribe"
          class="text-primary hover:underline text-sm flex items-center gap-2"
        >
          <v-icon size="18" class="text-primary">mdi-email-plus-outline</v-icon>
          {{ $t('newsletter.subscribeButton') }}
        </NuxtLink>
      </div>
      <!-- Social icons -->
      <div class="flex justify-center gap-4 text-text mt-4">
        <!--  facebook  -->
        <a href="https://www.facebook.com/profile.php?id=100064353450604" target="_blank">
          <v-icon size="28" style="color:#1877F2;">mdi-facebook</v-icon>
        </a>
        <a href="https://www.instagram.com/antaligyongyiedit/" target="_blank">
          <v-icon size="28" style="color: #D760B7;">mdi-instagram</v-icon>
        </a>
        <a href="https://www.linkedin.com/in/gy%C3%B6ngyi-edit-antali-09a1aa174/" target="_blank">
          <v-icon size="28" style="color:#0A66C2;">mdi-linkedin</v-icon>
        </a>
      </div>
      <!-- GDPR & Data Privacy -->
      <div class="flex justify-center gap-6 text-text mt-6">
        <NuxtLink to="/gdpr" class="text-primary hover:underline text-sm flex items-center gap-2">{{ $t('common.gdpr') }}</NuxtLink>
        <NuxtLink to="/agb" class="text-primary hover:underline text-sm flex items-center gap-2">{{ $t('common.agb') }}</NuxtLink>
      </div>
      <!--  copy right  -->
      <p class="text-text/70 mt-4">
        © {{ new Date().getFullYear() }} Antali Gyöngyi Edit — All rights reserved.
      </p>
    </v-container>
  </v-footer>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const dialog = ref(false)
const valid = ref(false)
const firstname = ref('')
const name = ref('')
const email = ref('')
const gdpr = ref(false)
const form = ref(null)


async function submit() {
  if (form.value && await form.value.validate()) {
    try {
      await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {
          firstname: firstname.value,
          name: name.value,
          email: email.value
        }
      })

      alert('Subscribe successful. Thank you!')
      dialog.value = false

      firstname.value = ''
      name.value = ''
      email.value = ''
      gdpr.value = false
      form.value.resetValidation()

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }
}

</script>

<style scoped>
a {
  color: inherit;
}
a:hover {
  opacity: 0.8;
}
</style>
