<template>
    <div>
        <h1>Admin Newsletter Schedule</h1>
        <!-- Newsletter schedule will be rendered here -->
    </div>
</template>
<script setup>
   /*-----------------------------------
        Admin Auth Guard
  ---------------------------------- */
const { isAdmin, loggedIn } = useAuth()
// Client oldali guard
onMounted(() => {
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
// Ha kilépsz → automatikusan redirectel
watch([loggedIn, isAdmin], () => {
  if (!loggedIn.value) {
    navigateTo('/')
  } else if (!isAdmin.value) {
    navigateTo('/')
  }
})

</script>