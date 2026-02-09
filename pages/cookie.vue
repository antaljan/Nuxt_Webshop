<template>
    <!--  back to home  -->
    <NuxtLink
        to="/"
        class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
        {{ $t('common.backtohome') }}
    </NuxtLink>
    <section class="max-w-4xl mx-auto py-10 px-4">
        <h1 class="text-3xl font-bold mb-6">{{ $t('cookie.more') }}</h1>
        <GenericHtmlTextSection section="cookie" />
    </section>
</template>
