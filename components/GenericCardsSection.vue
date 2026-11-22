<template>

<section
  :id="sectionKey"
  class="py-8"
>

  <!-- SECTION TITLE -->

  <div
    v-if="localContent.title"
    class="text-center mb-8"
  >

    <h2
      class="text-3xl font-bold"
      :style="{
        color: localContent.titleColor
      }"
    >
      {{ localContent.title }}
    </h2>

    <p
      v-if="localContent.description"
      class="mt-2"
      :style="{
        color: localContent.descriptionColor
      }"
    >
      {{ localContent.description }}
    </p>

  </div>

  <!-- CARDS -->

<v-row
  v-if="
    localContent.cards.length > 0
  "
>

    <v-col

      v-for="(card,index) in localContent.cards"

      :key="index"

      cols="12"

      :md="columnWidth"
    >

      <v-card
        :variant="localContent.variant"
        :rounded="
          localContent.rounded
            ? 'lg'
            : 0
        "
        :elevation="
          localContent.elevation
        "
        class="h-full"
        :style="{
          backgroundColor:
            localContent.cardColor,
          border:
            localContent.showBorder
              ? undefined
              : 'none'
        }"
      >

        <!-- TITLE -->
        <v-card-title>
          <v-icon
            v-if="card.icon"
            class="mb-3"
          >
            {{ card.icon }}
          </v-icon>
          <div
            v-if="card.title"
            :style="{
              color:
              localContent.cardTitleColor
            }"
          >
            {{ card.title }}
          </div>
        </v-card-title>

        <!-- SUBTITLE -->
        <v-card-subtitle
          v-if="card.subtitle"
        >
          {{ card.subtitle }}
        </v-card-subtitle>

        <!-- TEXT -->
        <v-card-text
          :style="{
            color:
              localContent.cardTextColor
          }"
        >
          <div   class="card-html" v-html="card.text" />
        </v-card-text>

        <!-- ACTION -->
        <template
          v-if="
            card.buttonText &&
            card.buttonUrl
          "
          #actions
        >

          <v-btn
            :to="card.buttonUrl"
            :color="localContent.buttonColor"
            :variant="localContent.buttonVariant"
          >
            {{ card.buttonText }}
          </v-btn>

        </template>

      </v-card>

    </v-col>

  </v-row>
  <div
    v-else
    class="text-center py-8"
    >
        Nincs még kártya.
    </div>

</section>

<!-- ADMIN EDITOR -->

<div
  v-if="
    isAdmin &&
    editMode
  "
  class="
    mt-6
    p-4
    border
    rounded-lg
  "
>

  <h3
    class="
      text-h6
      mb-4
    "
  >
    Cards szekció szerkesztése
  </h3>

  <!-- SECTION -->

  <v-text-field
    v-model="localContent.title"
    label="Szekció címe"
  />

  <v-textarea
    v-model="
      localContent.description
    "
    label="Szekció leírása"
    rows="3"
  />

  <!-- DESIGN -->

  <v-divider class="my-4" />

  <h4 class="mb-3">
    Megjelenés
  </h4>

  <v-select

    v-model="
      localContent.variant
    "

    :items="[
      'outlined',
      'elevated',
      'flat',
      'tonal',
      'plain',
      'text'
    ]"

    label="Kártya típus"

  />

  <v-select

    v-model="
      localContent.buttonVariant
    "

    :items="[
      'flat',
      'outlined',
      'tonal',
      'text'
    ]"

    label="Gomb típus"

  />

  <v-checkbox
    v-model="
      localContent.rounded
    "
    label="Lekerekített sarkok"
  />

  <v-checkbox
    v-model="
      localContent.showBorder
    "
    label="Keret megjelenítése"
  />

  <v-slider
    v-model="
      localContent.elevation
    "
    min="0"
    max="24"
    step="1"
    label="Árnyék"
  />

  <div class="mt-3">

    <label>
      Kártya háttérszín
    </label>

    <input
      type="color"
      v-model="
        localContent.cardColor
      "
    />

  </div>

  <div class="mt-3">

    <label>
      Kártya cím szín
    </label>

    <input
      type="color"
      v-model="
        localContent.cardTitleColor
      "
    />

  </div>

  <div class="mt-3">

    <label>
      Kártya szöveg szín
    </label>

    <input
      type="color"
      v-model="
        localContent.cardTextColor
      "
    />

  </div>

  <!-- CARDS -->

  <v-divider
    class="my-4"
  />

  <h4 class="mb-3">
    Kártyák
  </h4>

  <v-expansion-panels>

    <v-expansion-panel

      v-for="
        (
          card,
          index
        ) in localContent.cards
      "

      :key="index"

    >

      <v-expansion-panel-title>

        Kártya
        {{ index + 1 }}

      </v-expansion-panel-title>

      <v-expansion-panel-text>

        <v-text-field
          v-model="card.title"
          label="Cím"
        />

        <v-text-field
          v-model="card.subtitle"
          label="Alcím"
        />

        <div class="mb-4">
          <label
            class="
              text-sm
              font-medium
              mb-2
             block
            "
          >
            Szöveg
          </label>
          <RichTextEditor
            v-model="card.text"
            minHeight="200px"
          />
        </div>

        <v-text-field
          v-model="card.icon"
          label="Ikon (mdi)"
        />

        <v-text-field
          v-model="
            card.buttonText
          "
          label="Gomb felirat"
        />

        <v-text-field
          v-model="
            card.buttonUrl
          "
          label="Gomb URL"
        />

        <v-btn

          color="error"

          variant="outlined"

          class="mt-2"

          @click="
            removeCard(index)
          "

        >

          Kártya törlése

        </v-btn>

      </v-expansion-panel-text>

    </v-expansion-panel>

  </v-expansion-panels>

  <!-- ADD CARD -->

  <v-btn

    color="primary"

    class="mt-4"

    :disabled="
      localContent.cards
        .length >= 3
    "

    @click="addCard"

  >

    Kártya hozzáadása

  </v-btn>

  <!-- SAVE -->

  <div
    class="
      mt-6
      flex
      gap-3
    "
  >

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

<!-- ADMIN BUTTON -->

<div
  v-if="
    isAdmin &&
    !editMode
  "
  class="mt-4"
>

  <v-btn
    size="small"
    @click="
      editMode = true
    "
  >
    Cards szerkesztése
  </v-btn>

</div>

</template>

<script setup lang="ts">

import {
  ref,
  computed,
  watch
} from 'vue'

import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import RichTextEditor from '@/components/editor/RichTextEditor.vue'

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

type Card = {
  title: string
  subtitle: string
  text: string
  icon: string
  buttonText: string
  buttonUrl: string
}

type VuetifyVariant =
  | 'flat'
  | 'text'
  | 'elevated'
  | 'outlined'
  | 'plain'
  | 'tonal'

type CardsSectionContent = {
  title: string
  description: string
  variant: VuetifyVariant
  rounded: boolean
  elevation: number
  showBorder: boolean
  cardColor: string
  titleColor: string
  descriptionColor: string
  cardTitleColor: string
  cardTextColor: string
  buttonColor: string
  buttonVariant: VuetifyVariant
  cards: Card[]
}

const localContent =
  ref<CardsSectionContent>({
  title: '',
  description: '',
  variant: 'outlined',
  rounded: true,
  elevation: 2,
  showBorder: true,
  cardColor: '',
  titleColor: '#222222',
  descriptionColor: '#555555',
  cardTitleColor: '#222222',
  cardTextColor: '#555555',
  buttonColor: 'primary',
  buttonVariant: 'flat',
  cards: [] as Card[]
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
      variant:
        value.variant || 'outlined',
      rounded:
        value.rounded ?? true,
      elevation:
        value.elevation ?? 2,
      showBorder:
        value.showBorder ?? true,
      cardColor:
        value.cardColor || '',
      titleColor:
        value.titleColor || '#222222',
      descriptionColor:
        value.descriptionColor || '#555555',
      cardTitleColor:
        value.cardTitleColor || '#222222',
      cardTextColor:
        value.cardTextColor || '#555555',
      buttonColor:
        value.buttonColor || 'primary',
      buttonVariant:
        value.buttonVariant || 'flat',
      cards:
        value.cards || []
    }

  },

  {
    immediate: true
  }
)

const columnWidth =
  computed(() => {
    const count =
      localContent.value.cards?.length || 1
    if (count === 1) {
      return 12
    }
    if (count === 2) {
      return 6
    }
    return 4
})

function addCard() {
  if (
    localContent.value.cards.length >= 3
  ) {
    return
  }
  localContent.value.cards.push({
    title: '',
    subtitle: '',
    text: '',
    icon: '',
    buttonText: '',
    buttonUrl: ''
  })
}

function removeCard(index:number) {

  localContent.value.cards.splice(
    index,
    1
  )

}

async function saveContent() {

  try {

    await $fetch(

      `/api/content/${props.sectionKey}/${locale.value}`,

      {

        method: 'PUT',

        body: {

          ...props.content,

          ...localContent.value

        }

      }

    )

    editMode.value = false

  } catch (err) {

    console.error(err)

    alert(
      'Hiba a mentés során'
    )

  }

}

function cancelEdit() {
  resetContent()
  editMode.value = false
}

function resetContent() {
  const value =
    props.content || {}

  localContent.value = {
    title:
      value.title || '',
    description:
      value.description || '',
    variant:
      value.variant || 'outlined',
    rounded:
      value.rounded ?? true,
    elevation:
      value.elevation ?? 2,
    showBorder:
      value.showBorder ?? true,
    cardColor:
      value.cardColor || '',
    titleColor:
      value.titleColor || '#222222',
    descriptionColor:
      value.descriptionColor || '#555555',
    cardTitleColor:
      value.cardTitleColor || '#222222',
    cardTextColor:
      value.cardTextColor || '#555555',
    buttonColor:
      value.buttonColor || 'primary',
    buttonVariant:
      value.buttonVariant || 'flat',
    cards:
      value.cards || []
  }
}

</script>

<style scoped>

.card-html :deep(ul) {

  list-style-type: disc;

  padding-left: 1.5rem;

  margin-top: .5rem;

  margin-bottom: .5rem;
}

.card-html :deep(ol) {

  list-style-type: decimal;

  padding-left: 1.5rem;

  margin-top: .5rem;

  margin-bottom: .5rem;
}

.card-html :deep(li) {

  margin-bottom: .25rem;

}

</style>