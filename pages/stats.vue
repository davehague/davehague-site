<template>
  <section id="github-activity" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold mb-8 text-gray-900 text-center">My GitHub Activity</h2>

      <div class="mb-8 flex justify-center space-x-2 md:space-x-4">
        <button v-for="period in timePeriods" :key="period.value" @click="updateSelectedPeriod(period.value)"
          class="px-2 md:px-4 py-2 rounded-md transition-colors duration-300 text-sm md:text-lg"
          :class="selectedPeriod === period.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          {{ period.label }}
        </button>
      </div>

      <StackedBarChart :timeframe="selectedPeriod" class="mb-8" />

      <div class="text-center text-gray-700 mb-12">
        <p v-if="averageCommitsPerDay(true) > 0">
          Averaging <strong>{{ averageCommitsPerDay(false).toFixed(2) }}</strong> commits per day in this period.
        </p>

        <p v-if="averageCommitsPerDay(true) > 0">
          Averaging <strong>{{ averageCommitsPerDay(true).toFixed(2) }}</strong> commits per weekday in this period.
        </p>

        <p v-else>
          No commits found in the selected period.
        </p>
      </div>

      <div v-if="loading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-700">Getting the latest projects...</p>
      </div>

      <div v-else-if="projects.length === 0" class="text-center">
        <GithubIcon class="mx-auto h-16 w-16 text-gray-400" />
        <p class="mt-4 text-xl text-gray-700">No activity found for the selected period.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in projects" :key="project.id"
          class="bg-gray-100 rounded-lg p-6 shadow-md transition-transform duration-300 hover:scale-105">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900">{{ project.name }}</h3>
          <p class="text-gray-600 mb-4">Last updated: {{ formatDate(project.updated_at) }}</p>
          <a :href="project.html_url" target="_blank" rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-4 block">
            View on GitHub
          </a>
          <h4 class="text-lg font-semibold mb-2 text-gray-900">Recent Commits:</h4>
          <ul v-if="project.allCommits && project.allCommits.length" class="space-y-2">
            <li v-for="commit in project.allCommits.slice(0, 3)" :key="commit.commit_id"
              class="bg-white rounded p-2 shadow-sm">
              <p class="text-sm text-gray-800">{{ commit.message }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ formatDate(commit.author_date) }} by {{ commit.author_name }}</p>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-700">No recent commits found.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- TLDR -->
  <div class="w-full flex justify-center mb-4">
    <button v-if="isSelectedPeriodShort && !isTldrLoading" title="Give me a summary of this timeframe, based on the commits"
      @click="giveTldr">tl;dr</button>
    <div v-else-if="!isSelectedPeriodShort"></div>
      <div v-else class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>

  <DismissableMarkdownModal v-if="showModal" :isVisible="showModal" :content="modalText" @close="showModal = false" />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { GithubIcon } from 'lucide-vue-next'
import { useChartUtils } from '@/composables/useChartUtils'
import { useGithubStore } from '@/stores/githubStore';
import DismissableMarkdownModal from '@/components/DismissableMarkdownModal.vue';
import { getRandomLLMModel } from '@/utils/llm';


const showModal = ref(false);
const modalText = ref('');
const isTldrLoading = ref(false);

const { selectedPeriod, projects, loading, timePeriods, daysSincePeriod, ensureDataFreshness, updateSelectedPeriod } = useChartUtils()
const isSelectedPeriodShort = computed(() => daysSincePeriod(selectedPeriod.value) <= 60)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const averageCommitsPerDay = (weekdaysOnly) => {
  const githubStore = useGithubStore();
  const commitsInPeriod = githubStore.getCommitsByPeriod(selectedPeriod.value);
  const commitMessagesCount = commitsInPeriod.reduce((count, commit) => count + commit.messages.length, 0);

  const days = daysSincePeriod(selectedPeriod.value);
  
  const weekDaysInPeriod = getWeekdaysInPeriod(selectedPeriod.value);
  return weekdaysOnly ? commitMessagesCount / weekDaysInPeriod : commitMessagesCount / days;
};


function getWeekdaysInPeriod(period) {
  const start = getStartDateForPeriod(period);
  const end = new Date(); // Assuming we're calculating up to today
  let weekdays = 0;
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) weekdays++;
  }
  
  return weekdays;
}

function getStartDateForPeriod(period) {
  const today = new Date();
  let startDate = new Date(today);

  switch (period) {
    case "7":
    case "30":
    case "60":
    case "90":
      // Subtract the number of days from today
      startDate.setDate(today.getDate() - parseInt(period));
      break;
    case "ytd":
      // Set to January 1st of the current year
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    default:
      throw new Error("Invalid period selected");
  }

  return startDate;
}

const giveTldr = async () => {
  isTldrLoading.value = true;
  const githubStore = useGithubStore();

  const commitsInPeriod = githubStore.getCommitsByPeriod(selectedPeriod.value); 
  console.log('Commits in period:', commitsInPeriod);
  const formattedCommits =  JSON.stringify(commitsInPeriod);
  try {
    const days = daysSincePeriod(selectedPeriod.value);
    const randomModel = getRandomLLMModel();
    const message = `${formattedCommits}. This is a list of repos and their associated commit messages.
      David has worked on these commits for the past ${days} day(s). 
      For each repo, give a two sentence summary of what you deem to be the most important changes during the time period.
      Use markdown headers and markdown formatting in your response to make it readable.  Put the repo with the most activity at the top.
      Start your response with the sentence  'Here is a summary of David's changes over the past ${days} days.`;

      console.log('Message:', message);


    const response = await fetch('/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: randomModel,
        messages: [{ role: 'user', content: message }],
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);

    if (data.success && data.data.choices && data.data.choices.length > 0) {
      const generatedContent = data.data.choices[0].message.content.trim();
      console.log(generatedContent);
      const summaryCourtesyText = `*Summary courtesy of <a href="https://openrouter.ai/models/${randomModel}">${randomModel}</a> on <a href="https://openrouter.ai/">OpenRouter</a>*<br /><br /> `;

      modalText.value = summaryCourtesyText + generatedContent;
      showModal.value = true;
    } else {
      console.error(`Unexpected response structure from OpenRouter, check the model at https://openrouter.ai/models/${randomModel}`,
        data.data.error.message);
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    modalText.value = 'Error generating summary. Please try again later.';
  } finally {
    isTldrLoading.value = false;
  }

  return commitsInPeriod;
};

onMounted(async () => {
  await ensureDataFreshness()
})

watch(selectedPeriod, async () => {
  await ensureDataFreshness()
})
</script>