<!-- layouts/default.vue -->
<template>
  <div class="flex flex-col min-h-screen bg-gray-100 text-gray-800">
    <SiteHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'
</script>