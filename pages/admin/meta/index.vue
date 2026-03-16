<template>
  <v-container>
    <v-row class="mb-6" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold">
          <v-icon color="pink" class="mr-2">mdi-instagram</v-icon>
          Meta Automatizáció (DM Bot)
        </h1>
        <p class="text-subtitle-1 text-grey">Állíts be kulcsszavakat, amikre a rendszer automatikusan válaszol.</p>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="openDialog()">Új szabály</v-btn>
      </v-col>
    </v-row>

    <!-- Aktív kampányok kártyái -->
    <v-row v-if="rules && rules.length">
      <v-col v-for="rule in rules" :key="rule._id" cols="12" md="4">
        <v-card border flat class="rounded-lg">
          <v-card-item>
            <template v-slot:overline>
               {{ rule.type === 'message' ? 'Direct Message (DM)' : 'Komment válasz' }}
            </template>
            <v-card-title class="text-primary font-weight-black">
              "{{ rule.keyword.toUpperCase() }}"
            </v-card-title>
          </v-card-item>

          <v-card-text>
            <div class="mb-2"><strong>Válasz:</strong> {{ rule.responseMessage }}</div>
            <v-chip size="x-small" color="info" variant="flat" :href="rule.link" target="_blank">
              {{ rule.link }}
            </v-chip>
          </v-card-text>

          <v-divider></v-divider>
          
          <v-card-actions class="pa-4">
            <v-icon size="small" color="grey">mdi-chart-line</v-icon>
            <span class="text-caption ml-1">{{ rule.usageCount }} küldés</span>
            <v-spacer></v-spacer>
            <v-switch v-model="rule.isActive" @change="toggleStatus(rule)" hide-details density="compact" color="success" class="mr-4"></v-switch>
            <v-btn icon="mdi-pencil" variant="text" size="small" @click="openDialog(rule)"></v-btn>
            <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteRule(rule._id)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" variant="tonal" class="mt-4">
      Még nincsenek beállított automatizációk. Hozz létre egyet a jobb felső sarokban!
    </v-alert>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialog" max-width="550px">
      <v-card rounded="xl" class="pa-4">
        <v-card-title class="text-h5">{{ editedItem._id ? 'Szabály szerkesztése' : 'Új automatizáció' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field 
              v-model="editedItem.keyword" 
              label="Kulcsszó (amire a bot figyel)" 
              placeholder="pl: FREEBIE" 
              variant="outlined"
              hint="Kis- és nagybetű nem számít"
              persistent-hint
              class="mb-4"
            ></v-text-field>

            <v-textarea 
              v-model="editedItem.responseMessage" 
              label="Válasz üzenet" 
              variant="outlined"
              rows="3"
              counter="500"
            ></v-textarea>

            <v-text-field 
              v-model="editedItem.link" 
              label="Cél Link (opcionális)" 
              placeholder="https://..." 
              variant="outlined"
              prepend-inner-icon="mdi-link"
            ></v-text-field>

            <v-select
              v-model="editedItem.type"
              :items="[{title: 'Instagram DM', value: 'message'}, {title: 'Komment (Fejlesztés alatt)', value: 'comment'}]"
              label="Esemény típusa"
              variant="outlined"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Mégse</v-btn>
          <v-btn color="primary" rounded="pill" min-width="120" @click="save">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { data: rules, refresh } = await useFetch('/api/admin/automation')
const dialog = ref(false)
const editedItem = ref({ keyword: '', responseMessage: '', link: '', type: 'message', isActive: true })

const openDialog = (item = null) => {
  editedItem.value = item ? { ...JSON.parse(JSON.stringify(item)) } : { keyword: '', responseMessage: '', link: '', type: 'message', isActive: true }
  dialog.value = true
}

const save = async () => {
  const method = editedItem.value._id ? 'PUT' : 'POST'
  const url = editedItem.value._id ? `/api/admin/automation/${editedItem.value._id}` : '/api/admin/automation'
  
  await $fetch(url, { method, body: editedItem.value })
  await refresh()
  dialog.value = false
}

const toggleStatus = async (rule) => {
  await $fetch(`/api/admin/automation/${rule._id}`, {
    method: 'PUT',
    body: { isActive: rule.isActive }
  })
}

const deleteRule = async (id) => {
  if (confirm('Biztosan törlöd ezt az automatizációt?')) {
    await $fetch(`/api/admin/automation/${id}`, { method: 'DELETE' })
    await refresh()
  }
}
</script>
