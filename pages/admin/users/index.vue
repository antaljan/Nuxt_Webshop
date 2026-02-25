<template>
  <v-container class="py-10">
    <h1 class="text-h5 mb-6">{{ $t('admin.users.title') }}</h1>

      <!-- BACK BUTTON -->
      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/admin"
        class="mb-4"
      >
        Vissza az Admin Dashboardra
      </v-btn>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          :label="$t('common.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mr-4"
        />

        <v-spacer />

        <v-btn color="primary" @click="openCreateModal">
          {{ $t('admin.users.new') }}
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" @click="openEditModal(item)" />
          <v-btn icon="mdi-delete" size="small" color="red" @click="openDeleteModal(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- EDIT / CREATE MODAL -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ isEditing ? $t('admin.users.edit') : $t('admin.users.create') }}
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="form.firstname" :label="$t('auth.register.firstname')" />
          <v-text-field v-model="form.name" :label="$t('auth.register.lastname')" />
          <v-text-field v-model="form.email" :label="$t('auth.register.email')" />
          <v-text-field v-model="form.phone" :label="$t('auth.register.phone')" />
          <v-text-field v-model="form.adress" :label="$t('auth.register.adress')" />
          <v-select
            v-model="form.rolle"
            :items="roles"
            :label="$t('admin.users.role')"
          />
          <v-select
            v-model="form.language"
            :items="languages"
            item-title="title"
            item-value="value"
            :label="$t('common.language')"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="primary" @click="saveUser">{{ $t('common.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DELETE CONFIRM -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>{{ $t('admin.users.confirmDelete') }}</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="red" @click="deleteUser">{{ $t('common.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
// set language futures
const { t, locales } = useI18n()
// A nyelvek importálása a locales alapján, hogy a select-ben megjelenjenek
const languages = computed(() => 
  locales.value.map(l => ({
    title: l.code.toUpperCase(),
    value: l.code
  }))
)

// SSR-safe user loading
const { data: users, refresh } = await useFetch('/api/admin/users', {
  // Ez elengedhetetlen, hogy a Nuxt szerver átvegye a cookie-kat a böngészőtől!
  headers: useRequestHeaders(['cookie']) 
})

const search = ref('')
const editDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const selectedUser = ref(null)

const roles = ['user', 'admin']

const form = reactive({
  id: null,
  firstname: '',
  name: '',
  email: '',
  phone: '',
  adress: '',
  rolle: 'user',
  language: ''
})

const headers = [
  { title: t('auth.register.firstname'), key: 'firstname' },
  { title: t('auth.register.lastname'), key: 'name' },
  { title: t('auth.register.email'), key: 'email' },
  { title: t('auth.register.phone'), key: 'phone' },
  { title: t('common.language'), key: 'language' },
  { title: t('admin.users.role'), key: 'rolle' },
  { title: t('admin.products.actions'), key: 'actions', sortable: false }
]

const filteredUsers = computed(() => users.value || [])

// --- MODALS ---
function openCreateModal() {
  isEditing.value = false
  Object.assign(form, {
    id: null,
    firstname: '',
    name: '',
    email: '',
    phone: '',
    adress: '',
    rolle: 'user',
    language: ''
  })
  editDialog.value = true
}

function openEditModal(user) {
  isEditing.value = true
  Object.assign(form, {
    id: user._id,
    firstname: user.firstname,
    name: user.name,
    email: user.email,
    phone: user.phone,
    adress: user.adress,
    rolle: user.rolle,
    language: user.language
  })
  editDialog.value = true
}

function openDeleteModal(user) {
  selectedUser.value = user
  deleteDialog.value = true
}

// --- SAVE USER ---
async function saveUser() {
  if (isEditing.value) {
    await $fetch('/api/admin/users/update', {
      method: 'POST',
      body: { id: form.id, ...form }
    })
  } else {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { ...form, psw: 'Temp1234!' } // admin-created user gets temp password
    })
  }

  editDialog.value = false
  await refresh()
}

// --- DELETE USER ---
async function deleteUser() {
  await $fetch('/api/admin/users/delete', {
    method: 'POST',
    body: { id: selectedUser.value._id }
  })

  deleteDialog.value = false
  await refresh()
}
</script>