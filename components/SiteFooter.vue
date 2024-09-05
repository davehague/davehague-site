<!-- components/SiteFooter.vue -->
<template>
  <footer class="bg-gray-300 py-6">
    <div class="container mx-auto px-6 text-center text-gray-700">
      <p>&copy; {{ currentYear }} Dave Hague. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>