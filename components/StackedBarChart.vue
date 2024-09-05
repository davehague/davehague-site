<template>
  <div class="w-full h-64 md:h-96">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, eachDayOfInterval } from 'date-fns';
import { useChartUtils } from '@/composables/useChartUtils'
import { useColorUtils } from '@/composables/useColorUtils';

Chart.register(...registerables);

const props = defineProps({
  timeframe: {
    type: String,
    default: '30'
  }
});

const { 
  selectedPeriod, 
  getStartDate, 
  getReposAndCommits, 
  ensureDataFreshness,
  updateSelectedPeriod
} = useChartUtils()

selectedPeriod.value = props.timeframe;

const { getColorForRepo } = useColorUtils();

const chartRef = ref(null);
let chart = null;

const reposAndCommits = computed(() => {
  const startDate = getStartDate(selectedPeriod.value);
  return getReposAndCommits(selectedPeriod.value);
});

const prepareChartData = (repos, commits) => {
  const startDate = getStartDate(selectedPeriod.value);
  const endDate = new Date();
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const datasets = repos.map(repo => ({
    label: repo.name,
    data: new Array(days.length).fill(0),
    backgroundColor: getColorForRepo(repo.name),
  }));

  const dateIndex = {};
  days.forEach((day, index) => {
    dateIndex[format(day, 'yyyy-MM-dd')] = index;
  });

  commits.forEach(commit => {
    const repoIndex = repos.findIndex(repo => repo.id === commit.repo_id);
    if (repoIndex !== -1) {
      const dayIndex = dateIndex[format(new Date(commit.author_date), 'yyyy-MM-dd')];
      if (dayIndex !== undefined) {
        datasets[repoIndex].data[dayIndex]++;
      }
    }
  });

  return {
    labels: days.map(day => format(day, 'MMM d')),
    datasets,
  };
};

const createChart = (data) => {
  if (process.client && chartRef.value) {
    const ctx = chartRef.value.getContext('2d');
    
    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Commits'
            },
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              beforeBody: (tooltipItems) => {
                const filteredItems = tooltipItems.filter(item => item.parsed.y !== 0);
                return filteredItems.map(item => `${item.dataset.label}: ${item.parsed.y}`);
              },
              label: () => null
            }
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  }
};

const updateChart = () => {
  const { repos, commits } = reposAndCommits.value;
  const chartData = prepareChartData(repos, commits);
  createChart(chartData);
};

onMounted(async () => {
  if (import.meta.client) {
    await ensureDataFreshness();
    updateChart();
  }
});

watch(() => props.timeframe, (newTimeframe) => {
  updateSelectedPeriod(newTimeframe);
});

watch(selectedPeriod, async () => {
  if (import.meta.client) {
    await ensureDataFreshness();
    updateChart();
  }
});

watch(reposAndCommits, updateChart, { deep: true });
</script>