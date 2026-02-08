<template>
  <!-- Client-only kell, mert a drawer pozícióját a szerver és a kliens eltérően számolja ki -->
  <client-only>
    <v-navigation-drawer
      v-model="isOpen"
      location="right"
      width="380"
      temporary
    >
      <v-toolbar flat>
        <v-toolbar-title>{{ $t('cart.title') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="isOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-container>
        <div v-if="cart.length === 0" class="text-center py-10">
          <v-icon size="48" class="mb-4">mdi-cart-outline</v-icon>
          <p>{{ $t('cart.empty') }}</p>
        </div>

        <v-list v-else>
          <v-list-item
            v-for="(item, index) in cart"
            :key="index"
            :title="item.title"
            :subtitle="'€' + item.price"
          >
            <!-- Vuetify 3-as megoldás az avatarhoz -->
            <template #prepend>
              <v-avatar rounded="0" size="48">
                <v-img :src="item.cover" cover />
              </v-avatar>
            </template>

            <template #append>
              <v-btn
                icon
                variant="text"
                color="error"
                @click="removeFromCart(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div v-if="cart.length > 0">
          <div class="text-xl font-semibold mb-4">
            {{ $t('cart.total') }}: €{{ cartTotal() }}
          </div>

          <v-btn
            block
            color="primary"
            size="large"
            @click="checkout"
          >
            {{ $t('cart.checkout') }}
          </v-btn>

          <v-btn
            block
            variant="tonal"
            class="mt-2"
            @click="clearCart"
          >
            {{ $t('cart.clear') }}
          </v-btn>
        </div>
      </v-container>
    </v-navigation-drawer>
  </client-only>
</template>

<script setup>
import { useProducts } from '~/composables/useProducts'
import { useCartDrawer } from '~/composables/useCartDrawer'

const { cart, removeFromCart, clearCart, cartTotal, checkout } = useProducts()
const { isOpen } = useCartDrawer()
</script>
