<template>
  <div class="chart-container">
    <h2>Total commits: {{ totalCommits }}</h2>
    <select v-model="timeframe" @change="updateChart">
      <option value="ytd">Year to Date</option>
      <option value="month">Current Month</option>
      <option value="week">Current Week</option>
      <option value="day">Today</option>
    </select>
    <canvas ref="commitChart"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default defineComponent({
  name: 'RadarChart',
  setup() {
    const commitChart = ref<HTMLCanvasElement | null>(null);
    const timeframe = ref('week');
    let chartInstance: Chart | null = null;
    const totalCommits = ref('');


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

    const fetchCommits = async (repo: string, since: Date): Promise<number> => {
      try {
        const response = await fetch(`/api/github/commits?repo=${repo}&since=${since.toISOString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch commits for repo ${repo}`);
        }
        const data = await response.json();
        return data.length;
      } catch (error) {
        console.error('Error fetching commits:', error);
        return 0;
      }
    };

    const updateChart = async () => {
      const now = new Date();
      let since: Date;
      switch (timeframe.value) {
        case 'day':
          since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
          break;
        case 'month':
          since = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'ytd':
          since = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          since = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const repos = await fetchUserRepos(since.toISOString());
      const commitData = await Promise.all(repos.map((repo: string) => fetchCommits(repo, since)));

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
                    stepSize: 1,
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
    };

    onMounted(() => {
      updateChart();
    });

    watch(timeframe, () => {
      updateChart();
    });

    return {
      commitChart,
      timeframe,
      updateChart,
      totalCommits
    };
  }
});
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70vh;
}

select {
  margin-bottom: 20px;
}

canvas {
  width: 100%;
  height: calc(70vh - 60px);
}
</style>
