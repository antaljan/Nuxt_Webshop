<script setup>
    const { logout } = useAuth()
    await logout()
    navigateTo('/')
</script>