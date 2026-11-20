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
  title: '',
  description: '',
  text: '',
  url: '/',
  icon: 'mdi-home',
  variant: 'link',
  openInNewWindow: false,
  alignment: 'left',
  color: '#2563eb',
  backgroundColor: '',
  titleColor: '#222222',
  descriptionColor: '#555555'
})

watch(
  () => props.content,
  value => {

    if (!value) {
      return
    }

    localContent.value = {
      title:
        value.title || '',
      description:
        value.description || '',
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
        value.color || '#2563eb',
      backgroundColor:
        value.backgroundColor || '',
      titleColor:
        value.titleColor || '#222222',
      descriptionColor:
        value.descriptionColor || '#555555'
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
          title: localContent.value.title,
          description: localContent.value.description,
          text: localContent.value.text,
          url: localContent.value.url,
          icon: localContent.value.icon,
          variant: localContent.value.variant,
          openInNewWindow: localContent.value.openInNewWindow,
          alignment: localContent.value.alignment,
          color: localContent.value.color,
          backgroundColor: localContent.value.backgroundColor,
          titleColor: localContent.value.titleColor,
          descriptionColor: localContent.value.descriptionColor
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
    title:
      props.content?.title || '',
    description:
      props.content?.description || '',
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
      props.content?.color || '#2563eb',
    backgroundColor:
      props.content?.backgroundColor || '',
    titleColor:
      props.content?.titleColor || '#222222',
    descriptionColor:
      props.content?.descriptionColor || '#555555'
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
      class="
        py-6
        px-4
        rounded-lg
      "
      :style="{
        backgroundColor: localContent.backgroundColor
      }"
    >
    <!-- Title and Description -->
    <div
      v-if="
        localContent.title ||
        localContent.description
      "
      class="mb-4"
      :class="wrapperClass"
    >
    <!-- Title -->
    <h2
      v-if="localContent.title"
      class="
        text-3xl
       font-bold
       mb-2
     "
      :style="{
        color:
          localContent.titleColor
      }"
    >
      {{ localContent.title }}
    </h2>
    <!-- Description -->
    <p
      v-if="localContent.description"
      :style="{
        color:
          localContent.descriptionColor
      }"
    >
      {{ localContent.description }}
    </p>
  </div>
  <!-- Link -->
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
            color: localContent.color
          }
    "
  >
        <!-- Icon -->
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
       v-model="localContent.title"
       label="Cím"
      />

      <v-textarea
       v-model= "localContent.description"
        label="Leírás"
        rows="3"
      />
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
      <label>
        Link/Gomb szín
      </label>
      <input
        type="color"
        v-model="
          localContent.color
        "
      />
      <label>
        Háttérszín
      </label>
      <input
        type="color"
        v-model="localContent.backgroundColor"
      />
      <label>
        Cím színe
      </label>
      <input
        type="color"
        v-model="localContent.titleColor"
      />

      <label>
        Leírás színe
      </label>
      <input
        type="color"
        v-model="localContent.descriptionColor"
      />

      <v-select
        v-model="localContent.variant"
        :items="[
          'link',
          'button'
        ]"
        label="Megjelenés"
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
