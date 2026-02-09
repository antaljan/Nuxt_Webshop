<template>
  <section :id="sectionKey" class="py-20 bg-background text-text">
    <div class="container mx-auto max-w-4xl">

      <!-- TITLES -->
      <h2 class="text-3xl font-bold mb-4">
        {{ localContent.title0 }}
      </h2>

      <ul class="mb-10 space-y-2">
        <li><h3 class="text-xl font-semibold">{{ localContent.title1 }}</h3></li>
        <li><h3 class="text-xl font-semibold">{{ localContent.title2 }}</h3></li>
      </ul>

      <!-- CONTACT FORM -->
      <form @submit.prevent="handleSendEmail" class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            class="w-full border rounded-lg p-3"
            :placeholder="localContent.placeholderName"
            v-model="subject"
            required
          />

          <input
            type="email"
            class="w-full border rounded-lg p-3"
            :placeholder="localContent.placeholderEmail"
            v-model="email"
            required
          />
        </div>

        <textarea
          class="w-full border rounded-lg p-3 h-32"
          :placeholder="localContent.placeholderMessage"
          v-model="message"
          required
        ></textarea>

        <!-- GDPR -->
        <label class="flex items-start space-x-3">
          <input type="checkbox" required class="mt-1" />
          <span>
            {{ localContent.gdpr1 }}
            <NuxtLink to="/gdpr" class="text-primary hover:underline text-base font-medium font-semibold">{{ $t('common.gdpr') }}</NuxtLink>
            , 
            <NuxtLink to="/agb" class="text-primary hover:underline text-base font-medium font-semibold">{{ $t('common.agb') }}</NuxtLink>
            {{ localContent.gdpr3 }}
          </span>
        </label>

        <button
          type="submit"
          class="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          {{ localContent.buttonText }}
        </button>
      </form>

      <!-- ADMIN: TOGGLE EDITOR -->
      <div v-if="isAdmin" class="text-center mt-10">
        <v-btn color="primary" @click="showEditor = !showEditor">
          {{ showEditor ? t('common.closeEditor') :  t('common.edit') }}
        </v-btn>
      </div>

      <!-- ADMIN: EDITOR PANEL -->
      <v-form
        v-if="showEditor"
        class="pa-4 mt-6 rounded-lg shadow"
        color="background"
      >
        <v-text-field v-model="localContent.title0" label="Title 0" />
        <v-text-field v-model="localContent.title1" label="Title 1" />
        <v-text-field v-model="localContent.title2" label="Title 2" />

        <v-text-field v-model="localContent.placeholderName" label="Placeholder: Name" />
        <v-text-field v-model="localContent.placeholderEmail" label="Placeholder: Email" />
        <v-text-field v-model="localContent.placeholderMessage" label="Placeholder: Message" />

        <v-text-field v-model="localContent.buttonText" label="Button Text" />

        <v-text-field v-model="localContent.gdpr1" label="GDPR Part 1" />
        <v-text-field v-model="localContent.gdpr2" label="GDPR Link Text" />
        <v-text-field v-model="localContent.gdpr3" label="GDPR Part 3" />

        <v-btn color="primary" class="mt-4" @click="saveContent">
          Save Contact Content
        </v-btn>
      </v-form>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
/* ---------------------------
   PROPS
--------------------------- */
const props = defineProps({
  content: { type: Object, required: true },
  sectionKey: { type: String, required: true }
})

/* ---------------------------
   AUTH
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* ---------------------------
   LOCAL COPY OF CONTENT
--------------------------- */
const localContent = ref({})
watch(
  () => props.content,
  (val) => {
    if (val) localContent.value = structuredClone(val)
  },
  { immediate: true }
)

/* ---------------------------
   FORM FIELDS
--------------------------- */
const email = ref('')
const subject = ref('')
const message = ref('')

/* ---------------------------
   RUNTIME CONFIG
--------------------------- */
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

/* ---------------------------
   SEND EMAIL
--------------------------- */
async function handleSendEmail() {
  try {
    await $fetch('/api/email/send', {
      method: 'POST',
      body: {
        email: 'antali.gyongyi@gmail.com',
        subject: `Kapcsolatfelvétel a honlapról: ${subject.value}`,
        message: `Feladó: ${email.value}\nÜzenet: ${message.value}`
      }
    })

    alert('Email sent successfully!')
    subject.value = ''
    email.value = ''
    message.value = ''
  } catch (err) {
    console.error('Email sending failed:', err)
    alert('Error sending email')
  }
}

/* ---------------------------
   SAVE CONTENT
--------------------------- */
const { locale } = useI18n()

async function saveContent() {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: localContent.value
    })
    alert('Contact content saved!')
  } catch (err) {
    console.error('Saving contact content failed:', err)
    alert('Error saving contact content')
  }
}

/* ---------------------------
   ADMIN EDITOR TOGGLE
--------------------------- */
const showEditor = ref(false)
</script>
