<!-- components/SiteHeader.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <nav class="container mx-auto px-6 py-3">
      <ul class="flex justify-center space-x-8">
        <li v-for="item in navItems" :key="item.id">
          <NuxtLink 
            :to="item.link || `/#${item.id}`"
            class="text-lg font-medium hover:text-blue-600 transition-colors duration-300"
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
const navItems = [
  { id: 'home', name: 'Home', link: '/' },
  { id: 'about', name: 'About' },
  { id: 'projects', name: 'Projects' },
  { id: 'blog', name: 'Blog' },
  { id: 'stats', name: 'Stats', link: '/stats2' }
]
</script>