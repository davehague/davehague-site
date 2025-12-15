<!-- components/SiteHeader.vue -->
<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex md:justify-center items-center justify-end">
        <!-- Hamburger menu for mobile -->
        <button @click="toggleMenu" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <!-- Desktop menu -->
        <ul class="hidden md:flex space-x-6">
          <li v-for="item in navItems" :key="item.id">
            <NuxtLink :to="item.link || `/#${item.id}`"
              class="text-lg font-medium hover:text-blue-600 transition-colors duration-300 mr-2">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Mobile menu -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <ul v-if="isMenuOpen" class="md:hidden mt-4 space-y-2">
          <li v-for="item in navItems" :key="item.id">
            <NuxtLink :to="item.link || `/#${item.id}`"
              class="block py-2 text-lg font-medium hover:text-blue-600 transition-colors duration-300"
              @click="closeMenu">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
  id: string;
  name: string;
  link?: string;
}

const navItems: NavItem[] = [
  { id: 'home', name: 'Home', link: '/' },
  { id: 'about', name: 'About' },
  { id: 'my-work', name: 'Work' },
  { id: 'blog', name: 'Blog', link: '/blog' },
  { id: 'stats', name: 'Stats', link: '/stats' },
  { id: 'contact', name: 'Contact' }
]

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>