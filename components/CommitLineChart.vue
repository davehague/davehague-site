<template>
  <div class="w-full h-64 md:h-96">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { supabase } from "@/utils/supabaseClient";

Chart.register(...registerables);

const props = defineProps({
  timeframe: {
    type: String,
    required: true
  }
});

const chartRef = ref(null);
let chart = null;

const getStartDate = computed(() => {
  const now = new Date();
  switch (props.timeframe) {
    case '7':
      return new Date(now.setDate(now.getDate() - 7));
    case '30':
      return new Date(now.setDate(now.getDate() - 30));
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1);
    case '365':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
});

const fetchCommits = async () => {
  const { data, error } = await supabase
    .from('github_commits')
    .select('author_date')
    .gte('author_date', getStartDate.value.toISOString())
    .order('author_date', { ascending: true });

  if (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
  return data;
};

const prepareChartData = (commits) => {
  const dateMap = new Map();
  const startDate = getStartDate.value;
  const endDate = new Date();

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateMap.set(d.toISOString().split('T')[0], 0);
  }

  commits.forEach(commit => {
    const date = commit.author_date.split('T')[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  return Array.from(dateMap).map(([date, count]) => ({ x: new Date(date), y: count }));
};

const createChart = (chartData) => {
  const ctx = chartRef.value.getContext('2d');
  
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Commits per day',
        data: chartData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'MMM d, yyyy'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Commits'
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
};

const updateChart = async () => {
  const commits = await fetchCommits();
  const chartData = prepareChartData(commits);
  createChart(chartData);
};

onMounted(updateChart);

watch(() => props.timeframe, updateChart);
</script>