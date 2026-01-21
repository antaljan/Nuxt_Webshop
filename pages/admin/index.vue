<template>
    <div>
        <h1>Admin Dashboard </h1>
        <!-- User management content will be rendered here -->
    </div>
</template>
<script setup>
const { isAdmin, fetchUser } = useAuth()
console.log = "admin index isAdmin: ", isAdmin.value
onMounted(async () => {
  await fetchUser()

  if (!isAdmin.value) {
    alert('Access denied. Admins only.')
    return navigateTo('/')
  }
})
</script>
