<template>
<section
  :id="sectionKey"
  class="py-20"
>

  <div
    class="container mx-auto max-w-5xl"
  >

    <!-- INTRO CONTENT public -->
    <div
      v-if="!isAdmin || !editContentMode"
      class="prose max-w-none mb-10"
      v-html="sanitizedHtml"
    />
    <!-- INTRO CONTENT EDITOR -->
    <div
      v-if="isAdmin && editContentMode"
      class="space-y-4"
    >
      <RichTextEditor
        v-model="localContent.html"
        minHeight="350px"
      />
      <v-btn
        class="admin-success"
        @click="saveContent"
      >
        Mentés
      </v-btn>
      <v-btn
        class="admin-secondary"
        @click="cancelContent"
      >
        Mégse
      </v-btn>
    </div>

    <!-- CONTACT FORM -->
    <form
      @submit.prevent="handleSendEmail"
      class="space-y-6"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          v-model="subject"
          :placeholder="localContent.placeholderName"
          required
          class="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-primary"
        />
        <input
          v-model="email"
          :placeholder="localContent.placeholderEmail"
          required
          class="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-primary"
        />
      </div>
      <textarea
        v-model="message"
        :placeholder="localContent.placeholderMessage"
        required
        class="
          w-full
          min-h-[180px]
          border
          border-gray-300
          rounded-lg
          px-4
          py-3
          bg-white
        "
      >
      </textarea>

      <!-- GDPR public -->
      <label
        class="flex items-start gap-3"
      >
        <input
          type="checkbox"
          required
        />
        <div
          v-if="!isAdmin || !editContentMode"
          class="prose max-w-none"
          v-html="sanitizedGdprHtml"
        />
      </label>
        <!-- GDPR EDITOR -->
        <div
          v-if="isAdmin && editContentMode"
          class="space-y-4"
        >
          <RichTextEditor
            v-model="localContent.gdprHtml"
            minHeight="150px"
          />
          <v-btn
            class="admin-success"
           @click="saveContent"
           >
            Mentés
          </v-btn>
          <v-btn
            class="admin-secondary"
            @click="cancelContent"
          >
            Mégse
          </v-btn>
        </div>

      <!-- CTA -->
      <button
        type="submit"
        class="
          px-6
          py-3
          rounded-lg
          font-medium
          transition-all
          duration-200
        "
        :style="{
          backgroundColor:
            hovering
              ? localContent.ctaHoverColor
              : localContent.ctaColor,
          color:
            localContent.ctaTextColor
        }"
        @mouseover="hovering = true"
        @mouseleave="hovering = false"
      >
        {{ localContent.buttonText }}
      </button>
    </form>

    <!-- ADMIN FORM SETTINGS EDITOR -->
    <div
      v-if="isAdmin && editFormMode"
      class="
        mt-8
        p-6
        rounded-xl
        border
        bg-white
        space-y-4
      "
    >
    <v-text-field
      v-model="localContent.placeholderName"
      label="Név placeholder"
    />
    <v-text-field
      v-model="localContent.placeholderEmail"
      label="Email placeholder"
    />
    <v-text-field
      v-model="localContent.placeholderMessage"
      label="Üzenet placeholder"
    />
    <v-text-field
      v-model="localContent.buttonText"
      label="Gomb szöveg"
    />
    <div class="space-y-2">
      <label>
        CTA szín
      </label>
      <input
        type="color"
        v-model="localContent.ctaColor"
      />
    </div>
    <div class="space-y-2">
      <label>
        CTA hover szín
      </label>
      <input
        type="color"
        v-model="localContent.ctaHoverColor"
      />
    </div>
    <div class="space-y-2">
      <label>
        CTA szöveg színe
      </label>
      <input
        type="color"
        v-model="localContent.ctaTextColor"
      />
      <div
        class="
         flex
         gap-3
         mt-4
        "
      >
        <v-btn
         class="admin-success"
          @click="saveFormSettings"
        >
         Mentés
        </v-btn>
        <v-btn
         class="admin-secondary"
         @click="cancelFormEditor"
        >
         Mégse
        </v-btn>
      </div>
    </div>
</div>

    <!-- ADMIN TOOLS -->
    <div
      v-if="isAdmin"
      class="mt-10 flex gap-3"
    >
      <v-btn
        class="admin-primary"
        @click="openContentEditor"
      >
        Tartalom szerkesztése
      </v-btn>
      <v-btn
        class="admin-secondary"
        @click="openFormEditor"
      >
        Űrlap beállításai
      </v-btn>
    </div>
  </div>

</section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import DOMPurify from 'dompurify'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import RichTextEditor from '@/components/editor/RichTextEditor.vue'

/* -------------------------------------------------------------
   PROPS
------------------------------------------------------------- */

const props = defineProps({
  content: {
    type: Object,
    required: true
  },
  sectionKey: {
    type: String,
    required: true
  }
})

/* -------------------------------------------------------------
   I18N
------------------------------------------------------------- */

const { locale } = useI18n()

/* -------------------------------------------------------------
   AUTH
------------------------------------------------------------- */

const { user } = useAuth()

const isAdmin =
  computed(
    () => user.value?.role === 'admin'
  )

/* -------------------------------------------------------------
   MODES
------------------------------------------------------------- */

const editContentMode = ref(false)
const editFormMode = ref(false)

/* -------------------------------------------------------------
   CONTENT
------------------------------------------------------------- */

const localContent = ref({

  html: '',

  gdprHtml: '',

  placeholderName: '',
  placeholderEmail: '',
  placeholderMessage: '',

  buttonText: 'Üzenet küldése',

  ctaColor: '#b87d8e',
  ctaHoverColor: '#9a6373',
  ctaTextColor: '#ffffff'
})

/* -------------------------------------------------------------
   SNAPSHOTS
------------------------------------------------------------- */

const originalContent = ref<any>(null)

const originalFormSettings = ref<any>(null)

/* -------------------------------------------------------------
   LOAD CONTENT
------------------------------------------------------------- */

watch(
  () => props.content,
  (val) => {

    if (!val) {
      return
    }

    localContent.value = {

      html:
        val.html || '',

      gdprHtml:
        val.gdprHtml || '',

      placeholderName:
        val.placeholderName || '',

      placeholderEmail:
        val.placeholderEmail || '',

      placeholderMessage:
        val.placeholderMessage || '',

      buttonText:
        val.buttonText || 'Üzenet küldése',

      ctaColor:
        val.ctaColor || '#b87d8e',

      ctaHoverColor:
        val.ctaHoverColor || '#9a6373',

      ctaTextColor:
        val.ctaTextColor || '#ffffff'
    }
  },
  {
    immediate: true
  }
)

/* -------------------------------------------------------------
   SANITIZE
------------------------------------------------------------- */

const sanitizedHtml =
  computed(() => {

    if (import.meta.server) {
      return localContent.value.html
    }

    return DOMPurify.sanitize(
      localContent.value.html || '',
      {
        ALLOWED_ATTR: [
          'style',
          'class',
          'href',
          'target',
          'rel'
        ]
      }
    )
  })

const sanitizedGdprHtml =
  computed(() => {

    if (import.meta.server) {
      return localContent.value.gdprHtml
    }

    return DOMPurify.sanitize(
      localContent.value.gdprHtml || '',
      {
        ALLOWED_ATTR: [
          'style',
          'class',
          'href',
          'target',
          'rel'
        ]
      }
    )
  })

/* -------------------------------------------------------------
   CONTACT FORM
------------------------------------------------------------- */

const subject = ref('')
const email = ref('')
const message = ref('')

const hovering = ref(false)

/* -------------------------------------------------------------
   SEND EMAIL
------------------------------------------------------------- */

async function handleSendEmail() {

  try {

    await $fetch(
      '/api/email/send',
      {
        method: 'POST',

        body: {

          subject:
            `Kapcsolatfelvétel: ${subject.value}`,

          message:
            `Feladó: ${email.value}\n\n${message.value}`
        }
      }
    )

    alert(
      'Üzenet sikeresen elküldve!'
    )

    subject.value = ''
    email.value = ''
    message.value = ''

  } catch (err) {

    console.error(err)

    alert(
      'Hiba az üzenet küldésekor.'
    )
  }
}

/* -------------------------------------------------------------
   CONTENT EDITOR
------------------------------------------------------------- */

const openContentEditor = () => {

  editFormMode.value = false

  originalContent.value = {

    html:
      localContent.value.html,

    gdprHtml:
      localContent.value.gdprHtml
  }

  editContentMode.value = true
}

const cancelContent = () => {

  if (
    originalContent.value
  ) {

    localContent.value.html =
      originalContent.value.html

    localContent.value.gdprHtml =
      originalContent.value.gdprHtml
  }

  editContentMode.value = false
}

const saveContent = async () => {

  try {

    await $fetch(
      `/api/content/${props.sectionKey}/${locale.value}`,
      {
        method: 'PUT',

        body: {

          ...props.content,

          html:
            localContent.value.html,

          gdprHtml:
            localContent.value.gdprHtml
        }
      }
    )

    editContentMode.value = false

  } catch (err) {

    console.error(err)

    alert(
      'Hiba a tartalom mentésekor.'
    )
  }
}

/* -------------------------------------------------------------
   FORM SETTINGS EDITOR
------------------------------------------------------------- */

const openFormEditor = () => {

  editContentMode.value = false

  originalFormSettings.value = {

    placeholderName:
      localContent.value.placeholderName,

    placeholderEmail:
      localContent.value.placeholderEmail,

    placeholderMessage:
      localContent.value.placeholderMessage,

    buttonText:
      localContent.value.buttonText,

    ctaColor:
      localContent.value.ctaColor,

    ctaHoverColor:
      localContent.value.ctaHoverColor,

    ctaTextColor:
      localContent.value.ctaTextColor
  }

  editFormMode.value = true
}

const cancelFormEditor = () => {

  if (
    originalFormSettings.value
  ) {

    Object.assign(
      localContent.value,
      originalFormSettings.value
    )
  }

  editFormMode.value = false
}

const saveFormSettings =
  async () => {

    try {

      await $fetch(
        `/api/content/${props.sectionKey}/${locale.value}`,
        {
          method: 'PUT',

          body: {

            ...props.content,

            placeholderName:
              localContent.value.placeholderName,

            placeholderEmail:
              localContent.value.placeholderEmail,

            placeholderMessage:
              localContent.value.placeholderMessage,

            buttonText:
              localContent.value.buttonText,

            ctaColor:
              localContent.value.ctaColor,

            ctaHoverColor:
              localContent.value.ctaHoverColor,

            ctaTextColor:
              localContent.value.ctaTextColor
          }
        }
      )

      editFormMode.value = false

    } catch (err) {

      console.error(err)

      alert(
        'Hiba az űrlap mentésekor.'
      )
    }
}
</script>
