<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800"
  >
    <v-card rounded="xl">

      <v-card-title
        class="bg-blue-darken-3 text-white py-4 px-6"
      >
        Feliratkozói csoportok kezelése
      </v-card-title>

      <v-card-text class="pa-6">

        <!-- LISTA -->

        <div class="mb-6">

          <div
            v-for="group in groups"
            :key="group._id"
            class="flex items-center justify-between border-b py-3"
          >

            <div>
              <div class="font-medium">
                {{ group.name }}
              </div>

              <div class="text-sm text-grey">
                {{ group.slug }}
              </div>
            </div>

            <div class="flex gap-2">

              <v-chip
                :color="group.color"
                size="small"
              >
                {{ group.color }}
              </v-chip>

              <v-btn
                icon="mdi-pencil"
                variant="text"
                @click="editGroup(group)"
              />

              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="removeGroup(group)"
              />

            </div>

          </div>

        </div>

        <v-divider class="my-6" />

        <!-- FORM -->

        <h3 class="text-lg font-medium mb-4">
          {{
            form._id
              ? 'Csoport szerkesztése'
              : 'Új csoport létrehozása'
          }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <v-text-field
            v-model="form.name"
            label="Megnevezés"
          />

          <v-text-field
            v-model="form.slug"
            label="Slug"
            :disabled="!!form._id"
            hint="Létrehozás után nem módosítható"
            persistent-hint
          />

          <v-text-field
            v-model="form.description"
            label="Leírás"
          />

          <v-select
            v-model="form.color"
            :items="colors"
            label="Szín"
          />

          <v-text-field
            v-model.number="form.order"
            type="number"
            label="Sorrend"
          />

        </div>

      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4">

        <v-btn
          variant="text"
          @click="resetForm"
        >
          Új
        </v-btn>

        <v-spacer />

        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Bezárás
        </v-btn>

        <v-btn
          color="primary"
          @click="saveGroup"
        >
          Mentés
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>

const props = defineProps({
  modelValue: Boolean,
  groups: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:modelValue',
  'refresh'
])

const colors = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info'
]

const form = ref({
  _id: null,
  name: '',
  slug: '',
  description: '',
  color: 'primary',
  order: 999
})

function resetForm() {
  form.value = {
    _id: null,
    name: '',
    slug: '',
    description: '',
    color: 'primary',
    order: 999
  }
}

function editGroup(group) {
  form.value = {
    ...group
  }
}

async function saveGroup() {

  try {

    if (form.value._id) {

      await $fetch(
        `/api/newsletter/groups/${form.value._id}`,
        {
          method: 'PUT',
          body: form.value
        }
      )

    } else {

      await $fetch(
        '/api/newsletter/groups',
        {
          method: 'POST',
          body: form.value
        }
      )

    }

    resetForm()

    emit('refresh')

  } catch (err) {
    console.error(err)
  }
}

async function removeGroup(group) {

  if (
    !confirm(
      `Biztosan deaktiválod a(z) "${group.name}" csoportot?`
    )
  ) {
    return
  }

  try {

    await $fetch(
      `/api/newsletter/groups/${group._id}`,
      {
        method: 'DELETE'
      }
    )

    emit('refresh')

    if (form.value._id === group._id) {
      resetForm()
    }

  } catch (err) {
    console.error(err)
  }
}

</script>