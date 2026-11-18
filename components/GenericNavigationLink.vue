<script setup lang="ts">

import {
  ref,
  computed,
  watch
} from 'vue'

import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const { user } = useAuth()

const isAdmin = computed(
  () => user.value?.role === 'admin'
)

const props = defineProps<{
  content: any
  sectionKey: string
}>()

const editMode = ref(false)

/* -------------------------------------------------------------
   LOCAL CONTENT
------------------------------------------------------------- */

const localContent = ref({

  text: '',

  url: '/',

  icon: 'mdi-home',

  variant: 'link',

  openInNewWindow: false,

  alignment: 'left',

  color: '#2563eb'

})

watch(
  () => props.content,
  value => {

    if (!value) {
      return
    }

    localContent.value = {

      text:
        value.text || '',

      url:
        value.url || '/',

      icon:
        value.icon || 'mdi-home',

      variant:
        value.variant || 'link',

      openInNewWindow:
        value.openInNewWindow || false,

      alignment:
        value.alignment || 'left',

      color:
        value.color || '#2563eb'

    }

  },
  {
    immediate: true
  }
)

/* -------------------------------------------------------------
   ICONS
------------------------------------------------------------- */

const iconOptions = [

  'mdi-home',

  'mdi-arrow-left',

  'mdi-arrow-right',

  'mdi-account',

  'mdi-email',

  'mdi-phone',

  'mdi-web',

  'mdi-file-document',

  'mdi-information',

  'mdi-chevron-left',

  'mdi-chevron-right'

]

/* -------------------------------------------------------------
   ALIGNMENT
------------------------------------------------------------- */

const wrapperClass =
  computed(() => {

    switch (
      localContent.value.alignment
    ) {

      case 'center':
        return 'text-center'

      case 'right':
        return 'text-right'

      default:
        return 'text-left'

    }

  })

/* -------------------------------------------------------------
   STYLE
------------------------------------------------------------- */

const linkClass =
  computed(() => {

    switch (
      localContent.value.variant
    ) {

      case 'button':

        return `
          inline-flex
          items-center
          px-4
          py-2
          rounded-lg
          text-white
        `

      default:

        return `
          inline-flex
          items-center
          hover:underline
        `

    }

  })

const buttonStyle =
  computed(() => {

    if (
      localContent.value.variant !==
      'button'
    ) {
      return {}
    }

    return {

      backgroundColor:
        localContent.value.color

    }

  })

/* -------------------------------------------------------------
   SAVE
------------------------------------------------------------- */

async function saveContent() {

  try {

    await $fetch(
      `/api/content/${props.sectionKey}/${locale.value}`,
      {
        method: 'PUT',

        body: {

          ...props.content,

          text:
            localContent.value.text,

          url:
            localContent.value.url,

          icon:
            localContent.value.icon,

          variant:
            localContent.value.variant,

          openInNewWindow:
            localContent.value
              .openInNewWindow,

          alignment:
            localContent.value
              .alignment,

          color:
            localContent.value
              .color

        }

      }
    )

    editMode.value = false

  } catch (err) {

    console.error(
      'Saving navigation link failed:',
      err
    )

    alert(
      'Hiba a mentés során'
    )

  }

}

// cancel edit mode when content changes externally
function cancelEdit() {

  localContent.value = {

    text:
      props.content?.text || '',

    url:
      props.content?.url || '/',

    icon:
      props.content?.icon || 'mdi-home',

    variant:
      props.content?.variant || 'link',

    openInNewWindow:
      props.content?.openInNewWindow || false,

    alignment:
      props.content?.alignment || 'left',

    color:
      props.content?.color || '#2563eb'

  }

  editMode.value = false

}

</script>

<template>

  <section
    :id="sectionKey"
    class="py-4"
  >

    <div
      :class="wrapperClass"
    >

<NuxtLink
  :to="localContent.url"

  :target="
    localContent.openInNewWindow
      ? '_blank'
      : undefined
  "

  :class="linkClass"

  :style="
    localContent.variant === 'button'
      ? buttonStyle
      : {
          color:
            localContent.color
        }
  "
>


        <v-icon
          v-if="localContent.icon"
          size="small"
          class="mr-1"
        >
          {{ localContent.icon }}
        </v-icon>

        {{ localContent.text }}

      </NuxtLink>

    </div>

    <div
      v-if="
        isAdmin &&
        editMode
      "
      class="
        mt-4
        p-4
        border
        rounded-lg
      "
    >

      <v-text-field
        v-model="localContent.text"
        label="Link szöveg"
      />

      <v-text-field
        v-model="localContent.url"
        label="URL"
      />

      <v-select
        v-model="localContent.icon"
        :items="iconOptions"
        label="Ikon"
      />

      <v-select
        v-model="localContent.alignment"
        :items="[
          'left',
          'center',
          'right'
        ]"
        label="Igazítás"
      />

      <v-checkbox
        v-model="
          localContent.openInNewWindow
        "
        label="Új lapon nyíljon"
      />

      <input
        type="color"
        v-model="
          localContent.color
        "
      />

<div class="mt-3 flex gap-3">

  <v-btn
    color="success"
    @click="saveContent"
  >
    Mentés
  </v-btn>

  <v-btn
    variant="outlined"
    @click="cancelEdit"
  >
    Mégse
  </v-btn>

</div>

    </div>

    <div
      v-if="
        isAdmin &&
        !editMode
      "
      class="mt-3"
    >

      <v-btn
        size="small"
        @click="
          editMode = true
        "
      >
        Link szerkesztése
      </v-btn>

    </div>

  </section>

</template>
