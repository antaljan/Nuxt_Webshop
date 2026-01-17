<template>
    <v-container class="py-10" max-width="400">
        <v-card class="pa-6">
            <v-text-field v-model="email" label="Email" />
            <v-text-field v-model="psw" label="Password" type="password" />
            <v-btn color="primary" block class="mt-4" @click="doregister">
                Register
            </v-btn>
            <v-alert v-if="error" type="error" class="mt-4">
                {{ error }}
            </v-alert>
        </v-card>
    </v-container>
</template>

<script setup>
    const email = ref('')
    const psw = ref('')
    const error = ref(null)
async function doRegister() {
    console.log('Registering', email.value, psw.value)
}
</script>
