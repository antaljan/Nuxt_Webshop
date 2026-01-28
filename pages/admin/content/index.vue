<template>
    <div>
        <h1>Admin Content</h1>
        <!-- Content management content will be rendered here -->
    </div>
</template>
<script setup>
   /*-----------------------------------
        Admin Auth Guard
  ---------------------------------- */
const { isAdmin, loggedIn } = useAuth()
// Client site guard
onMounted(() => {
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
// automatic redirecting if you log out
watch([loggedIn, isAdmin], () => {
  if (!loggedIn.value) {
    navigateTo('/')
  } else if (!isAdmin.value) {
    navigateTo('/')
  }
})

</script>