<template>
  <v-footer class="bg-gray-50 text-text py-10 mt-12" padless>
    <v-container class="text-center">
      <!-- Newsletter dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="text-h6">
            {{ $t('newsletter.subscribeButton') }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="firstname"
                :label="$t('newsletter.firstname')"
                :rules="[v => !!v || $t('newsletter.errorName')]"
                required
              />
              <v-text-field
                v-model="name"
                :label="$t('newsletter.lastname')"
                :rules="[v => !!v || $t('newsletter.errorName')]"
                required
              />
              <v-text-field
                v-model="email"
                :label="$t('newsletter.email')"
                :rules="[v => /.+@.+\..+/.test(v) || $t('newsletter.errorEmail')]"
                required
              />
              <v-checkbox
                v-model="gdpr"
                :rules="[v => !!v || $t('newsletter.errorGdpr')]"
                required
              >
                <template #label>
                  {{ $t('newsletter.gdpr.before') }}
                  <NuxtLink to="/gdpr" target="_blank" class="text-primary">
                    {{ $t('newsletter.gdpr.link') }}
                  </NuxtLink>
                </template>
              </v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" variant="text" @click="submit">
              {{ $t('common.send') }}
            </v-btn>
            <v-btn color="grey" variant="text" @click="dialog = false">
              {{ $t('common.cancel') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Divider -->
        <div class="w-full h-[1px] bg-gray-400 my-6"></div>
      <!-- Newsletter button -->
      <div class="flex justify-center mt-4">
        <button
          class="text-primary hover:underline text-sm flex items-center gap-2"
          @click="dialog = true"
        >
          <v-icon size="18" class="text-primary">mdi-email-plus-outline</v-icon>
          {{ $t('newsletter.subscribeButton') }}
        </button>
      </div>
      <!-- Social icons -->
      <div class="flex justify-center gap-6 text-text mt-4">
        <!--  facebook  -->
        <a href="https://www.facebook.com/profile.php?id=100064353450604" target="_blank">
           <v-icon size="28" class="text-primary">mdi-facebook</v-icon>
        </a>
        <a href="https://www.instagram.com/antaligyongyiedit/" target="_blank">
           <v-icon size="28" class="text-primary">mdi-instagram</v-icon>
        </a>
        <a href="https://www.linkedin.com/in/gy%C3%B6ngyi-edit-antali-09a1aa174/" target="_blank">
           <v-icon size="28" class="text-primary">mdi-linkedin</v-icon>
        </a>
      </div>
      <!-- GDPR & Data Privacy -->
      <div class="flex justify-center gap-6 text-text mt-4">
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
