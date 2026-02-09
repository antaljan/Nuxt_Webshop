<template>
  <!--  back to home  -->
  <NuxtLink
    to="/"
    class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
  >
    {{ $t('common.backtohome') }}
  </NuxtLink>
  <GenericHtmlTextSection section="agb" />
</template>
