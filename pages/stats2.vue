<template>
  <section id="github-activity" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold mb-8 text-gray-900 text-center">My GitHub Activity</h2>

      <div class="mb-8 flex justify-center space-x-4">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          class="px-4 py-2 rounded-full transition-colors duration-300"
          :class="selectedPeriod === period.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ period.label }}
        </button>
      </div>

      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-700">Loading your awesome projects...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center">
        <GithubIcon class="mx-auto h-16 w-16 text-gray-400" />
        <p class="mt-4 text-xl text-gray-700">No activity found for the selected period.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in filteredProjects" :key="project.id" class="bg-gray-100 rounded-lg p-6 shadow-md transition-transform duration-300 hover:scale-105">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900">{{ project.name }}</h3>
          <p class="text-gray-600 mb-4">Last updated: {{ formatDate(project.last_updated) }}</p>
          <a :href="project.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4 block">
            View on GitHub
          </a>
          <h4 class="text-lg font-semibold mb-2 text-gray-900">Recent Commits:</h4>
          <ul class="space-y-2">
            <li v-for="commit in project.commits" :key="commit.id" class="bg-white rounded p-2 shadow-sm">
              <p class="text-sm text-gray-800">{{ commit.message }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ formatDate(commit.commit_date) }} by {{ commit.author }}</p>
            </li>
          </ul>
          <div v-if="project.summary" class="mt-4 p-3 bg-gray-200 rounded-lg">
            <h4 class="text-lg font-semibold mb-2 text-gray-900">Summary:</h4>
            <p class="text-sm text-gray-700">{{ project.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GithubIcon } from 'lucide-vue-next'

const sampleProjects = [
  {
    id: 1,
    name: "My Awesome Project",
    last_updated: "2024-09-01T12:00:00Z",
    url: "https://github.com/user/my-awesome-project",
    commits: [
      { id: 101, message: "Update README.md", commit_date: "2024-09-01T11:30:00Z", author: "John Doe" },
      { id: 102, message: "Fix bug in login component", commit_date: "2024-08-30T15:45:00Z", author: "Jane Smith" },
      { id: 103, message: "Add new feature", commit_date: "2024-08-28T09:20:00Z", author: "John Doe" },
    ],
    summary: "In this period, there were 3 commits. The work focused on updating documentation, fixing bugs, and adding new features."
  },
  {
    id: 2,
    name: "Cool API",
    last_updated: "2024-08-25T14:30:00Z",
    url: "https://github.com/user/cool-api",
    commits: [
      { id: 201, message: "Implement caching", commit_date: "2024-08-25T14:00:00Z", author: "Alice Johnson" },
      { id: 202, message: "Optimize database queries", commit_date: "2024-08-23T10:15:00Z", author: "Bob Williams" },
    ],
    summary: "In this period, there were 2 commits. The work focused on improving performance through caching and query optimization."
  },
  {
    id: 3,
    name: "Mobile App",
    last_updated: "2024-08-20T09:45:00Z",
    url: "https://github.com/user/mobile-app",
    commits: [
      { id: 301, message: "Update UI design", commit_date: "2024-08-20T09:30:00Z", author: "Eve Brown" },
      { id: 302, message: "Implement push notifications", commit_date: "2024-08-18T16:20:00Z", author: "Charlie Davis" },
      { id: 303, message: "Fix crash on startup", commit_date: "2024-08-15T11:10:00Z", author: "Eve Brown" },
    ],
    summary: "In this period, there were 3 commits. The work focused on improving the user interface, adding new features like push notifications, and fixing critical bugs."
  }
];

const projects = ref(sampleProjects)
const loading = ref(false)
const selectedPeriod = ref('30')

const timePeriods = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'Last year', value: '365' },
]

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStartDate = () => {
  const now = new Date()
  switch (selectedPeriod.value) {
    case '7':
      return new Date(now.setDate(now.getDate() - 7))
    case '30':
      return new Date(now.setDate(now.getDate() - 30))
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1)
    case '365':
      return new Date(now.setFullYear(now.getFullYear() - 1))
    default:
      return new Date(now.setDate(now.getDate() - 30))
  }
}

const filteredProjects = computed(() => {
  const startDate = getStartDate()
  return projects.value.filter(project => {
    const lastUpdated = new Date(project.last_updated)
    return lastUpdated >= startDate
  })
})

// Commented out Supabase-related code for now
// const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

// const fetchProjects = async () => {
//   loading.value = true
//   // Supabase fetching logic here
//   loading.value = false
// }

// watch(selectedPeriod, fetchProjects)
</script>