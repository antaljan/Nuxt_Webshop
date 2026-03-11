<script setup>
import draggable from 'vuedraggable'

const props = defineProps({
  modelValue: Array
})

const emit = defineEmits(['update:modelValue'])

// 🔥 Alapértelmezett props minden szekcióhoz
const defaultProps = {
  hero: {
    title: "",
    subtitle: "",
    bullets: [],
    image: ""
  },
  text: {
    title: "",
    paragraphs: []
  },
  imageText: {
    title: "",
    text: "",
    image: ""
  },
  feedback: {
    title: "",
    items: []
  },
  contact: {
    title: "",
    description: ""
  }
}

// 🔥 Új szekció hozzáadása — helyes inicializálással
const addSection = (type) => {
  const newSection = {
    type,
    props: JSON.parse(JSON.stringify(defaultProps[type])) // deep copy
  }

  emit('update:modelValue', [...props.modelValue, newSection])
}

// 🔥 Szekció törlése
const removeSection = (index) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

// 🔥 Drag & drop sorrend frissítése
const updateOrder = (e) => {
  emit('update:modelValue', e.to)
}
</script>

<template>
  <div>
    <h2 class="mb-4">Szekciók</h2>

    <!-- Add buttons -->
    <v-btn @click="addSection('hero')">Hero</v-btn>
    <v-btn @click="addSection('text')">Szöveg</v-btn>
    <v-btn @click="addSection('imageText')">Kép + szöveg</v-btn>
    <v-btn @click="addSection('feedback')">Visszajelzés</v-btn>
    <v-btn @click="addSection('contact')">Kapcsolat</v-btn>

    <!-- Drag & Drop list -->
    <draggable
      v-model="props.modelValue"
      item-key="type"
      handle=".drag-handle"
      @end="updateOrder"
      class="mt-6"
    >
      <template #item="{ element, index }">
        <div class="pa-4 mb-4 border rounded">
          <div class="d-flex justify-space-between align-center mb-2">
            <strong>{{ element.type }}</strong>
            <v-icon class="drag-handle" style="cursor: grab">mdi-drag</v-icon>
          </div>

          <!-- Szekció szerkesztő -->
          <SectionEditor
            :section="element"
            @update="(updated) => {
              const arr = [...props.modelValue]
              arr[index] = updated
              emit('update:modelValue', arr)
            }"
          />

          <v-btn color="error" size="small" @click="removeSection(index)">
            Törlés
          </v-btn>
        </div>
      </template>
    </draggable>
  </div>
</template>
