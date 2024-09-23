<template>
  <div class="container mx-auto px-4 py-20">
    <!-- Search bar -->
    <div class="mb-6 relative">
      <input v-model="searchQuery" type="text" placeholder="Search blog posts and gists..."
        class="w-full p-2 pr-10 border border-gray-300 rounded" @input="debouncedSearch" />
      <button v-if="searchQuery" @click="clearSearch"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
        ✕
      </button>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <button v-for="tab in ['Blog Posts', 'Gists']" :key="tab" @click="activeTab = tab" :class="[
          'w-full rounded-lg py-2.5 text-sm font-semibold leading-5 transition-colors',
          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          activeTab === tab
            ? 'bg-white shadow text-blue-700'
            : 'text-blue-900 hover:bg-blue-200 hover:text-blue-800'
        ]" :aria-selected="activeTab === tab" role="tab">
          <span class="flex items-center justify-center">
            {{ tab }}
            <span v-if="getIndicatorCount(tab) > 0"
              class="ml-3 px-2 py-0.5 text-xs font-bold text-white bg-blue-300 rounded-full">
              {{ getIndicatorCount(tab) }}
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="activeTab === 'Blog Posts'">
      <blockquote>
        <p>
          The thing that stops most of us from writing a compelling article that gets noticed is that most of us
          don't write enough crappy articles. We're too afraid to fail publicly, to write something less than perfect.
          But that's exactly the opposite of what we need to be doing. Adam Grant, author of The Originals, nails it:
          "You need a lot of bad ideas in order to get a few good ones. One of the best predictors of the greatness of a
          classical composer is the <span class="underline">sheer number of compositions that they've generated</span>.
          Bach, Beethoven, and Mozart had to generate hundreds and hundreds of compositions in order to get to a much
          smaller number of masterpieces. The starting point is that if most of us want to be more original, we have to
          generate
          more ideas." So my plea to you is write more, and don't worry if every blog isn't War and Peace.
        </p>
        <p>
          <em>
            Debbie Madden,
            <a href="https://www.amazon.com/Hire-Women-Framework-Retaining-Technology-ebook/dp/B07G8QTJNH">
              Hire Women: An Agile Framework for Hiring and Retaining Women in Technology
            </a>
          </em>
        </p>
      </blockquote>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>

    <div v-else-if="activeTab === 'Gists'">
      <p class="m-2 mb-8 italic">Gists are technical snippets stored on <a href="https://gist.github.com/">Github</a>.
        I've used them over time to keep little snippets of code and instructions that don't quite rise to the level
        of full repository. I'll frequently refer back to gists that I've written, and I hope you find these useful as
        well!</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="gist in displayedGists" :key="gist.id" class="bg-white rounded-lg overflow-hidden shadow-lg">
          <div class="p-6">
            <div class="mb-4">
              <NuxtLink :to="`/gists/${gist.id}`" class="text-xl font-semibold hover:text-blue-600">
                {{ gist.description || 'Untitled Gist' }}
              </NuxtLink>
              <p class="text-sm text-gray-500 italic">Updated: {{ formatDate(gist.updated_at) }}</p>
            </div>
            <div class="text-gray-600 mb-4">
              <div v-for="file in Object.values(gist.files)" :key="file.filename">
                {{ file.content.substring(0, 120) }}{{ file.content.length > 100 ? '...' : '' }}
              </div>
            </div>
            <NuxtLink :to="`/gists/${gist.id}`" class="text-blue-600 hover:underline">
              View Gist
            </NuxtLink>
          </div>
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
const debouncedSearchQuery = ref('')
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const currentPage = ref(1)
const postsPerPage = 9
const activeTab = useState('blogActiveTab', () => 'Blog Posts')

const getIndicatorCount = (tab: string) => {
  if (!debouncedSearchQuery.value) return 0
  if (tab === 'Blog Posts' && activeTab.value === 'Gists') {
    return filteredPosts.value.length
  }
  if (tab === 'Gists' && activeTab.value === 'Blog Posts') {
    return filteredGists.value.length
  }
  return 0
}

const filteredPosts = computed(() => {
  if (!debouncedSearchQuery.value) return blogStore.publishedPosts
  return blogStore.searchPosts(debouncedSearchQuery.value)
})

const filteredGists = computed(() => {
  if (!debouncedSearchQuery.value) return gistsStore.publicGists
  return gistsStore.searchGists(debouncedSearchQuery.value)
})

const debouncedSearch = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    debouncedSearchQuery.value = searchQuery.value
    currentPage.value = 1
  }, 300) // 300ms delay
}

const clearSearch = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  currentPage.value = 1
}

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