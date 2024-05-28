<template>
  <div class="chart-container">
    <h2>Total commits: {{ totalCommits }}</h2>
    <select v-model="timeframe" @change="updateChart">
      <option value="quarter">120 days</option>
      <option value="ninety">90 days</option>
      <option value="sixty">60 days</option>
      <option value="month">30 days</option>
      <option value="week">7 days</option>
      <option value="day">1 day</option>
    </select>
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else class="canvas-wrapper">
      <canvas ref="commitChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { getCachedCommits, saveCommitsToIndexedDB, clearCache, isCacheValid, setLastPulledDate } from '@/assets/helpers/indexedDBHelper';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default defineComponent({
  name: 'RadarChart',
  setup() {
    const commitChart = ref<HTMLCanvasElement | null>(null);
    const timeframe = ref('month');
    let chartInstance: Chart | null = null;
    const totalCommits = ref('');
    const isLoading = ref(false);

    const fetchUserRepos = async (since: string): Promise<string[]> => {
      try {
        const response = await fetch(`/api/github/repos?since=${encodeURIComponent(since)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        return data.map((repo: { full_name: string }) => repo.full_name);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
      }
    };

    const fetchCommitCount = async (repo: string, since: Date): Promise<number> => {
      try {
        console.log('Fetching from cache for repo ', repo);
        const cachedData = await getCachedCommits(repo);

        if (cachedData && cachedData.length > 0) {
          return cachedData.length;
        }

        console.log('Fetching from API for repo ', repo, ' since ', since.toISOString());
        const response = await fetch(`/api/github/commits?repo=${repo}&since=${since.toISOString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch commits for repo ${repo}`);
        }
        const data = await response.json();
        await saveCommitsToIndexedDB(data);

        return data.length;
      } catch (error) {
        console.error('Error fetching commits:', error);
        return 0;
      }
    };


    const updateChart = async () => {
      isLoading.value = true;
      try {
        const now = new Date();
        let since: Date;
        switch (timeframe.value) {
          case 'day':
            since = new Date(now);
            since.setDate(now.getDate() - 1);
            break;
          case 'week':
            since = new Date(now);
            since.setDate(now.getDate() - 7);
            break;
          case 'month':
            since = new Date(now);
            since.setDate(now.getDate() - 30);
            break;
          case 'sixty':
            since = new Date(now);
            since.setDate(now.getDate() - 60);
            break;
          case 'ninety':
            since = new Date(now);
            since.setDate(now.getDate() - 90);
            break;
          case 'quarter':
            since = new Date(now);
            since.setDate(now.getDate() - 120);
            break;
          default:
            since = new Date(now);
            since.setDate(now.getDate() - 30);
            break;
        }

        const repos = await fetchUserRepos(since.toISOString());
        const commitData = await Promise.all(repos.map((repo: string) => fetchCommitCount(repo, since)));
        const filteredData = commitData.filter((data) => data > 0);
        const filteredRepos = repos.filter((repo, index) => commitData[index] > 0);
        totalCommits.value = filteredData.reduce((acc, curr) => acc + curr, 0).toString();

        if (chartInstance) {
          chartInstance.destroy();
        }

        if (commitChart.value) {
          const ctx = commitChart.value.getContext('2d');
          if (ctx) {
            chartInstance = new Chart(ctx, {
              type: 'radar',
              data: {
                labels: filteredRepos,
                datasets: [{
                  label: 'Number of Commits',
                  data: filteredData,
                  fill: true,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgb(54, 162, 235)',
                  pointBackgroundColor: 'rgb(54, 162, 235)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
              },
              options: {
                scales: {
                  r: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 2,
                    },
                  }
                },
                maintainAspectRatio: false,
                elements: {
                  line: {
                    borderWidth: 3
                  }
                }
              }
            });
          }
        }
      }
      catch (error) {
        console.error('Error fetching commits:', error);
        isLoading.value = false;
      }
      finally {
        isLoading.value = false;
      }

    };

    onMounted(async () => {
      isLoading.value = true;
      if (!isCacheValid()) {
        console.log('Cache is older than 24 hours, clearing')
        await clearCache();
        setLastPulledDate();
      }
      updateChart();
      isLoading.value = false;
    });


    watch(timeframe, async () => {
      isLoading.value = true;
      if (!isCacheValid()) {
        console.log('Cache is older than 24 hours, clearing')
        await clearCache();
        setLastPulledDate();
      }
      updateChart();
      isLoading.value = false;
    });

    return {
      commitChart,
      timeframe,
      updateChart,
      totalCommits,
      isLoading
    };
  }
});
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(70vh - 60px);
}

select {
  margin-bottom: 20px;
}

canvas {
  width: 100% !important;
  height: calc(70vh - 60px) !important;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(70vh - 60px);
}

.spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
