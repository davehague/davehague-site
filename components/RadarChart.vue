<template>
  <div class="chart-container">
    <h2>Total commits: {{ totalCommits }}</h2>
    <select v-model="timeframe" @change="updateChart">
      <option value="hundred-twenty">120 days</option>
      <option value="ninety">90 days</option>
      <option value="sixty">60 days</option>
      <option value="thirty">30 days</option>
      <option value="seven">7 days</option>
      <option value="one">1 day</option>
    </select>
    <button title="Give me a summary of this timeframe, based on the commits" class="tldr-link"
      @click="emitTimeframe">tl;dr</button>
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else class="canvas-wrapper">
      <canvas ref="commitChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, defineEmits } from 'vue';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { type GitHubRepo } from '@/types/interfaces';
import { supabase } from "@/utils/supabaseClient";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default defineComponent({
  name: 'RadarChart',
  emits: ['timeframe'],
  setup(_, { emit }) {
    const commitChart = ref<HTMLCanvasElement | null>(null);
    const timeframe = ref('seven');
    let chartInstance: Chart | null = null;
    const totalCommits = ref('');
    const isLoading = ref(false);

    const passedInSince = ref('');

    const emitTimeframe = async () => {
      const { data, error } = await supabase
        .from('github_commits')
        .select('message')
        .gte('author_date', passedInSince.value);

      if (error) {
        console.error('Error fetching commits:', error);
        return;
      }

      console.log('All messages:', data);

      let allMessages = data.map((commit: any) => commit.message).join('\n');

      let timeframeInt = 30;
      switch (timeframe.value) {
        case 'one': timeframeInt = 1; break;
        case 'seven': timeframeInt = 7; break;
        case 'thirty': timeframeInt = 30; break;
        case 'sixty': timeframeInt = 60; break;
        case 'ninety': timeframeInt = 90; break;
        case 'hundred-twenty': timeframeInt = 120; break;
        default: timeframeInt = 1; break;
      };

      emit('timeframe', timeframeInt, allMessages);
    };

    const fetchUserRepos = async (since: string): Promise<GitHubRepo[]> => {
      passedInSince.value = since;
      const { data, error } = await supabase
        .from('github_repos')
        .select('*')
        .gte('pushed_at', since);

      if (error) {
        console.error('Error fetching repositories:', error);
        return [];
      }

      return data as GitHubRepo[];
    };

    const fetchCommitCount = async (repo: GitHubRepo, since: Date): Promise<number> => {
      const { data, error } = await supabase
        .from('github_commits')
        .select('count', { count: 'exact' })
        .eq('repo_id', repo.id)
        .gte('author_date', since.toISOString());

      if (error) {
        console.error('Error fetching commit count:', error);
        return 0;
      }

      return data ? data[0].count : 0;
    };


    const updateChart = async () => {
      isLoading.value = true;
      try {
        const now = new Date();
        let since: Date;
        switch (timeframe.value) {
          case 'one':
            since = new Date(now);
            since.setDate(now.getDate() - 1);
            break;
          case 'seven':
            since = new Date(now);
            since.setDate(now.getDate() - 7);
            break;
          case 'thirty':
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
          case 'hundred-twenty':
            since = new Date(now);
            since.setDate(now.getDate() - 120);
            break;
          default:
            since = new Date(now);
            since.setDate(now.getDate() - 30);
            break;
        }

        const repos = await fetchUserRepos(since.toISOString());
        console.log('Charting repos:', repos);

        const commitData = await Promise.all(repos.map((repo: GitHubRepo) => fetchCommitCount(repo, since)));

        const filteredData = commitData.filter((data) => data > 0);
        const filteredRepos = repos.filter((repo, index) => commitData[index] > 0);
        const filteredRepoNames = filteredRepos.map(repo => repo.name);

        totalCommits.value = filteredData.reduce((acc, curr) => acc + curr, 0).toString();
        const stepSize = Math.ceil(Math.max(...filteredData) / 5);

        if (chartInstance) {
          chartInstance.destroy();
        }

        if (commitChart.value) {
          const ctx = commitChart.value.getContext('2d');
          if (ctx) {
            const labelClickPlugin = {
              id: 'labelClick',
              afterEvent(chart: any, args: any) {
                const event = args.event;
                if (event.type === 'click') {
                  console.log('Click event:', event);
                  const { ctx, scales: { r } } = chart;
                  const { x, y } = event;
                  const angleStep = (2 * Math.PI) / chart.data.labels.length;

                  chart.data.labels.forEach((label: string, index: number) => {
                    const angle = angleStep * index - Math.PI / 2;
                    const xLabel = r.xCenter + Math.cos(angle) * r.drawingArea;
                    const yLabel = r.yCenter + Math.sin(angle) * r.drawingArea;

                    const distance = Math.sqrt((x - xLabel) ** 2 + (y - yLabel) ** 2);

                    console.log('Distance to label:', label, distance);
                    if (distance < 50) {
                      const repo = filteredRepos.find(repo => repo.name === label);
                      if (repo) {
                        window.open(repo.html_url, '_blank');
                      }
                    }
                  });
                }
              }
            };

            chartInstance = new Chart(ctx, {
              type: 'radar',
              data: {
                labels: filteredRepoNames,
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
                      stepSize: stepSize
                    },
                    pointLabels: {
                      color: '#00468c',
                      font: {
                        size: 14,
                        weight: 'lighter',
                      }
                    }
                  }
                },
                maintainAspectRatio: false,
                elements: {
                  line: {
                    borderWidth: 3
                  }
                }
              },
              plugins: [labelClickPlugin]
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
      updateChart();
      isLoading.value = false;
    });

    watch(timeframe, async () => {
      isLoading.value = true;
      updateChart();
      isLoading.value = false;
    });

    return {
      commitChart,
      timeframe,
      updateChart,
      totalCommits,
      isLoading,
      emitTimeframe
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

.tldr-link {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  margin-bottom: 20px;
  text-decoration: underline;
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
