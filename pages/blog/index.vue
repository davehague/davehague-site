<template>
  <div class="container mx-auto px-4 py-20">

    <!-- Search bar -->
    <div class="mb-6">
      <input v-model="searchQuery" type="text" placeholder="Search blog posts..."
        class="w-full p-2 border border-gray-300 rounded" @input="searchPosts" />
    </div>

    <!-- Blog post list -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in displayedPosts" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-lg">
        <div class="p-6">
          <div class="mb-4">
            <NuxtLink :to="`/blog/${post.slug}`" class="text-xl font-semibold hover:text-blue-600">
              {{ post.title }}
            </NuxtLink>
          </div>

          <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
          <NuxtLink :to="`/blog/${post.slug}`" class="text-blue-600 hover:underline">
            Read More
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <button v-for="page in totalPages" :key="page" @click="currentPage = page" class="mx-1 px-3 py-1 border rounded"
        :class="{ 'bg-blue-500 text-white': currentPage === page }">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blogStore'

const blogStore = useBlogStore()
const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = 9

const filteredPosts = computed(() => {
  if (!searchQuery.value) return blogStore.publishedPosts
  return blogStore.searchPosts(searchQuery.value)
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

const displayedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const searchPosts = () => {
  currentPage.value = 1
}

onMounted(() => {
  blogStore.fetchBlogPosts()
})
</script>