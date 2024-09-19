<template>
  <div class="container mx-auto px-4 py-20">
    <!-- Search bar -->
    <div class="mb-6">
      <input v-model="searchQuery" type="text" placeholder="Search blog posts and gists..."
        class="w-full p-2 border border-gray-300 rounded" @input="searchContent" />
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <button v-for="tab in ['Blog Posts', 'Gists']" :key="tab" @click="activeTab = tab" :class="[
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          activeTab === tab
            ? 'bg-white shadow text-blue-700'
            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
        ]">
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="activeTab === 'Blog Posts'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in displayedPosts" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-lg">
        <div class="p-6">
          <div class="mb-4">
            <NuxtLink :to="`/blog/${post.slug}`" class="text-xl font-semibold hover:text-blue-600">
              {{ post.title }}
            </NuxtLink>
            <p class="text-sm text-gray-500 italic">{{ formatDate(post.updated_at.toString()) }}</p>
          </div>
          <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
          <NuxtLink :to="`/blog/${post.slug}`" class="text-blue-600 hover:underline">
            Read More
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'Gists'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="gist in displayedGists" :key="gist.id" class="bg-white rounded-lg overflow-hidden shadow-lg">
        <div class="p-6">
          <div class="mb-4">
            <a :href="gist.html_url" target="_blank" rel="noopener noreferrer"
              class="text-xl font-semibold hover:text-blue-600">
              {{ gist.description || 'Untitled Gist' }}
            </a>
            <p class="text-sm text-gray-500 italic">Created: {{ formatDate(gist.created_at) }}</p>
            <p class="text-sm text-gray-500 italic">Updated: {{ formatDate(gist.updated_at) }}</p>
          </div>
          <div class="text-gray-600 mb-4">
            <p>Files:</p>
            <ul class="list-disc list-inside">
              <li v-for="(file, filename) in gist.files" :key="filename">
                {{ filename }} ({{ file.language || 'Unknown language' }})
              </li>
            </ul>
          </div>
          <a :href="gist.html_url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
            View Gist
          </a>
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

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBlogStore } from '@/stores/blogStore'
import { useGistsStore } from '@/stores/gistsStore'
import { formatDate } from '@/utils/date'

const blogStore = useBlogStore()
const gistsStore = useGistsStore()

const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = 9
const activeTab = ref('Blog Posts')

const filteredPosts = computed(() => {
  if (!searchQuery.value) return blogStore.publishedPosts
  return blogStore.searchPosts(searchQuery.value)
})

const filteredGists = computed(() => {
  if (!searchQuery.value) return gistsStore.publicGists
  return gistsStore.searchGists(searchQuery.value)
})

const totalPages = computed(() => {
  const contentLength = activeTab.value === 'Blog Posts' ? filteredPosts.value.length : filteredGists.value.length
  return Math.ceil(contentLength / postsPerPage)
})

const displayedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const displayedGists = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredGists.value.slice(start, end)
})

const searchContent = () => {
  currentPage.value = 1
}

watch(activeTab, () => {
  currentPage.value = 1
})

onMounted(async () => {
  await Promise.all([
    blogStore.fetchBlogPosts(),
    gistsStore.fetchGists()
  ])
})
</script>