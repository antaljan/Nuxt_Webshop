<template>
  <div>

    <!-- PAGE CONTENT -->

    <template
      v-for="sec in editableSections"
      :key="sec.key"
    >
      <component
        :is="componentMap[sec.type]"
        v-if="contentMap[sec.key]"
        v-bind="getSectionProps(
          sec,
          contentMap[sec.key]
        )"
      />
    </template>

    <!-- EMPTY PAGE -->

    <div
      v-if="editableSections.length === 0"
      class="text-center py-12 text-grey"
    >
      Az oldal még nem tartalmaz szekciókat.
    </div>

    <!-- PAGE BUILDER -->

    <v-card
      v-if="isAdmin"
      class="page-builder-card"
      elevation="10"
    >

      <v-card-title>
        Oldal struktúra
      </v-card-title>

      <v-card-text>

        <draggable
          v-model="editableSections"
          item-key="key"
          animation="200"
        >

          <template #item="{ element,index }">

            <v-card
              class="mb-2"
              variant="outlined"
            >

              <div
                class="flex justify-between items-center pa-2"
              >

                <div>

                  <v-icon
                    size="small"
                    class="mr-2"
                  >
                    mdi-drag
                  </v-icon>

                  {{ element.type }}

                </div>

                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeSection(index)"
                />

              </div>

            </v-card>

          </template>

        </draggable>

        <v-select
          v-model="selectedType"
          :items="availableSections"
          label="Új szekció"
          variant="outlined"
          class="mt-3"
        />

        <v-btn
          block
          color="primary"
          @click="addSection"
        >
          Hozzáadás
        </v-btn>

        <v-divider class="my-4" />

        <h3 class="mb-2 mt-4">
  SEO
</h3>

<v-tabs
  v-model="seoTab"
  density="compact"
  color="primary"
>
  <v-tab value="hu">
    HU
  </v-tab>

  <v-tab value="en">
    EN
  </v-tab>

  <v-tab value="de">
    DE
  </v-tab>
</v-tabs>

<v-window
  v-model="seoTab"
  class="mt-3"
>

  <v-window-item value="hu">

    <v-text-field
      v-model="seoForm.hu.title"
      label="SEO Title"
      variant="outlined"
      density="compact"
    />

    <v-textarea
      v-model="seoForm.hu.description"
      label="Meta Description"
      variant="outlined"
      rows="3"
    />

  </v-window-item>

  <v-window-item value="en">

    <v-text-field
      v-model="seoForm.en.title"
      label="SEO Title"
      variant="outlined"
      density="compact"
    />

    <v-textarea
      v-model="seoForm.en.description"
      label="Meta Description"
      variant="outlined"
      rows="3"
    />

  </v-window-item>

  <v-window-item value="de">

    <v-text-field
      v-model="seoForm.de.title"
      label="SEO Title"
      variant="outlined"
      density="compact"
    />

    <v-textarea
      v-model="seoForm.de.description"
      label="Meta Description"
      variant="outlined"
      rows="3"
    />

  </v-window-item>

</v-window>

        <v-btn
          block
          color="success"
          :loading="saving"
          @click="saveStructure"
        >
          Struktúra mentése
        </v-btn>

      </v-card-text>

    </v-card>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
    >
      {{ snackbarText }}

      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
         Bezárás
        </v-btn>
      </template>

    </v-snackbar>

  </div>
</template>

<script setup>

import draggable from 'vuedraggable'
import { useI18n } from 'vue-i18n'

import GenericHeroSection from '~/components/GenericHeroSection.vue'
import GenericHtmlTextSection from '~/components/GenericHtmlTextSection.vue'
import GenericImageTextSection from '~/components/GenericImageTextSection.vue'
import GenericContactSection from '~/components/GenericContactSection.vue'
import GenericFeedbackSection from '~/components/GenericFeedbackSection.vue'
import GenericBlogSection from '~/components/GenericBlogSection.vue'
import SectionSeparator from '~/components/sectionSeparator.vue'
import GenericLeadMagnetSubscribe from '~/components/GenericLeadMagnetSubscribe.vue'

import {
  useContentInitializer
} from '~/composables/useContentInitializer'

const {
  initializeSection,
  deleteSectionContent
} = useContentInitializer()

const props = defineProps({
  page: {
    type: Object,
    required: true
  },

  isAdmin: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()
const saving = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const selectedType = ref(null)
const editableSections = ref(
  [...(props.page.sections || [])]
)
const deletedSections = ref([])

const seoTab = ref('hu')

const seoForm = ref(
  JSON.parse(
    JSON.stringify(
      props.page.seo || {
        hu: {
          title: '',
          description: ''
        },
        en: {
          title: '',
          description: ''
        },
        de: {
          title: '',
          description: ''
        }
      }
    )
  )
)

watch(
  () => props.page.sections,
  (value) => {
    editableSections.value = [...(value || [])]
  }
)

const availableSections = [
  'Hero',
  'HtmlText',
  'ImageText',
  'Contact',
  'Feedback',
  'Blog',
  'Separator',
  'Subscribe'
]

const componentMap = {
  Hero: GenericHeroSection,
  HtmlText: GenericHtmlTextSection,
  ImageText: GenericImageTextSection,
  Contact: GenericContactSection,
  Feedback: GenericFeedbackSection,
  Blog: GenericBlogSection,
  Separator: SectionSeparator,
  Subscribe: GenericLeadMagnetSubscribe
}

//
// CONTENT LOAD
//

const sectionKeys = computed(() =>
  editableSections.value?.map(
    section => section.key
  ) || []
)

const { data: contents, refresh } =
  await useAsyncData(
    () =>
      `page-content-${props.page._id}-${locale.value}`,
    () =>
      $fetch('/api/content/bulk-load', {
        method: 'POST',
        body: {
          keys: sectionKeys.value,
          lang: locale.value
        }
      })
  )

watch(locale, () => refresh())

const contentMap = computed(() => {

  const rawContents =
    Array.isArray(contents.value)
      ? contents.value
      : []

  return rawContents.reduce(
    (acc, curr) => {

      const key =
        curr.section ||
        curr.sectionKey

      if (key) {
        acc[key] = curr
      }

      return acc

    },
    {}
  )

})

//
// PROPS BUILDER
//

function getSectionProps(
  sec,
  content
) {

  const safeContent =
    content || {}

  if (
    sec.type === 'Feedback'
  ) {

    return {
      content: safeContent,
      sectionKey: sec.key,
      ...sec.props
    }

  }

  return {
    content: safeContent,
    sectionKey: sec.key,
    ...sec.props
  }

}

//
// STRUCTURE BUILDER
//

function addSection() {

  if (!selectedType.value) return

  const newSection = {
    type: selectedType.value,

    key:
      `${selectedType.value.toLowerCase()}-${Date.now()}`,

    props: {}
  }

  editableSections.value.push(
    newSection
  )

  selectedType.value = null

}

function removeSection(index) {

  const section =
    editableSections.value[index]

  if (section) {

    deletedSections.value.push(
      section
    )

  }

  editableSections.value.splice(
    index,
    1
  )

}

async function saveStructure() {

  try {

    saving.value = true

    await $fetch(
      `/api/page/admin/${props.page._id}`,
      {
        method: 'PUT',

        body: {
          ...props.page,
          sections:editableSections.value,
          seo: seoForm.value
        }
      }
    )

    // Új szekciók inicializálása

    for (const section of editableSections.value) {

      await initializeSection(
        section
      )

    }

    // Törölt szekciók takarítása

    for (const section of deletedSections.value) {

      await deleteSectionContent(
        section.key
      )

    }

    deletedSections.value = []

    await refresh()

    snackbarText.value =
      `Struktúra mentve (${editableSections.value.length} szekció)`

    snackbarColor.value =
      'success'

    snackbar.value = true

  } catch (err) {

    console.error(err)

    snackbarText.value =
      'A struktúra mentése sikertelen.'

    snackbarColor.value =
      'error'

    snackbar.value = true

  } finally {

    saving.value = false

  }

}

</script>

<style scoped>

.page-builder-card {

  position: fixed;

  top: 120px;

  right: 20px;

  width: 360px;

  max-height: 80vh;

  overflow-y: auto;

  z-index: 2000;
}

</style>