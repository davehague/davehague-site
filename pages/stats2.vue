<template>
  <SiteHeader />
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

      <CommitLineChart :timeframe="selectedPeriod" class="mb-12" />

      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-700">Getting the latest projects...</p>
      </div>

      <div v-else-if="projects.length === 0" class="text-center">
        <GithubIcon class="mx-auto h-16 w-16 text-gray-400" />
        <p class="mt-4 text-xl text-gray-700">No activity found for the selected period.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in projects" :key="project.id" class="bg-gray-100 rounded-lg p-6 shadow-md transition-transform duration-300 hover:scale-105">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900">{{ project.name }}</h3>
          <p class="text-gray-600 mb-4">Last updated: {{ formatDate(project.updated_at) }}</p>
          <a :href="project.html_url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4 block">
            View on GitHub
          </a>
          <h4 class="text-lg font-semibold mb-2 text-gray-900">Recent Commits:</h4>
          <ul v-if="project.commits && project.commits.length" class="space-y-2">
            <li v-for="commit in project.commits" :key="commit.commit_id" class="bg-white rounded p-2 shadow-sm">
              <p class="text-sm text-gray-800">{{ commit.message }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ formatDate(commit.author_date) }} by {{ commit.author_name }}</p>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-700">No recent commits found.</p>
        </div>
      </div>
    </div>
  </section>
  <SiteFooter />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { GithubIcon } from 'lucide-vue-next'
import { supabase } from "@/utils/supabaseClient";

const projects = ref([])
const loading = ref(true)
const selectedPeriod = ref('30')

const timePeriods = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'Last 365 days', value: '365' },
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

const fetchUserRepos = async (since) => {
  const { data, error } = await supabase
    .from('github_repos')
    .select('*')
    .gte('pushed_at', since);
  
  if (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
  return data;
};

const fetchCommits = async (repoId) => {
  const { data, error } = await supabase
    .from('github_commits')
    .select('*')
    .eq('repo_id', repoId)
    .order('author_date', { ascending: false })
    .limit(3);
  
  if (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
  return data;
};

const fetchProjects = async () => {
  loading.value = true;
  const since = getStartDate();
  const repos = await fetchUserRepos(since.toISOString());
  
  const projectsWithCommits = await Promise.all(repos.map(async (repo) => {
    const commits = await fetchCommits(repo.id);
    return { ...repo, commits };
  }));

  // sort projectsWithCommits by pushed_at
  projectsWithCommits.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

  projects.value = projectsWithCommits;
  loading.value = false;
};

onMounted(fetchProjects);
watch(selectedPeriod, fetchProjects);
</script>