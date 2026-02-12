<template>
  <v-card flat class="pa-4 mb-4" color="grey-lighten-4">
    <v-row align="center" no-gutters>

      <!-- QUICK RANGE BUTTONS -->
      <v-col cols="12" md="6">
        <v-btn-toggle
          v-model="quickRange"
          mandatory
          divided
          color="primary"
          class="mr-4"
          @update:model-value="applyQuickRange"
        >
          <v-btn value="today">Ma</v-btn>
          <v-btn value="yesterday">Tegnap</v-btn>
          <v-btn value="7d">7 nap</v-btn>
          <v-btn value="30d">30 nap</v-btn>
          <v-btn value="90d">90 nap</v-btn>
          <v-btn value="1y">1 év</v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- CUSTOM DATE RANGE -->
      <v-col cols="12" md="6" class="d-flex justify-end">

        <!-- FROM -->
        <v-menu v-model="menuFrom" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              label="Dátumtól"
              density="compact"
              variant="outlined"
              class="mr-2"
              :model-value="formatDateTime(from)"
              readonly
            />
          </template>

          <v-card>
            <v-date-picker v-model="fromDate" />
            <v-time-picker v-model="fromTime" format="24hr" />
            <v-card-actions>
              <v-btn color="primary" @click="applyCustomRange">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- TO -->
        <v-menu v-model="menuTo" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              label="Dátumig"
              density="compact"
              variant="outlined"
              :model-value="formatDateTime(to)"
              readonly
            />
          </template>

          <v-card>
            <v-date-picker v-model="toDate" />
            <v-time-picker v-model="toTime" format="24hr" />
            <v-card-actions>
              <v-btn color="primary" @click="applyCustomRange">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- REFRESH -->
        <v-btn icon="mdi-refresh" class="ml-2" @click="refresh" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const emit = defineEmits(['update:params'])

/* -------------------------
   INTERNAL STATE
------------------------- */

const quickRange = ref('7d')

const menuFrom = ref(false)
const menuTo = ref(false)

const from = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
const to = ref(new Date())

// Date pickers store strings, not Date objects
const fromDate = ref(from.value.toISOString().substring(0, 10))
const toDate = ref(to.value.toISOString().substring(0, 10))

// Time pickers store "HH:mm"
const fromTime = ref('00:00')
const toTime = ref('23:59')

/* -------------------------
   HELPERS
------------------------- */

function formatDateTime(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return ''
  return d.toISOString().replace('T', ' ').substring(0, 16)
}

function buildDate(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  const dt = new Date(`${dateStr}T${timeStr}`)
  return isNaN(dt.getTime()) ? null : dt
}

/* -------------------------
   APPLY QUICK RANGE
------------------------- */

function applyQuickRange() {
  emit('update:params', { range: quickRange.value })
}

/* -------------------------
   APPLY CUSTOM RANGE
------------------------- */

function applyCustomRange() {
  const newFrom = buildDate(fromDate.value, fromTime.value)
  const newTo = buildDate(toDate.value, toTime.value)

  if (!newFrom || !newTo) return

  from.value = newFrom
  to.value = newTo

  emit('update:params', {
    from: newFrom.toISOString(),
    to: newTo.toISOString()
  })

  menuFrom.value = false
  menuTo.value = false
}

/* -------------------------
   REFRESH BUTTON
------------------------- */

function refresh() {
  emit('update:params', {
    from: from.value.toISOString(),
    to: to.value.toISOString()
  })
}
</script>
