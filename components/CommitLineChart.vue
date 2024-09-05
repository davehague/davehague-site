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

const fetchRepos = async () => {
  const { data, error } = await supabase
    .from('github_repos')
    .select('id, name')
    .gte('pushed_at', getStartDate.value.toISOString());

  if (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
  return data;
};

const fetchCommits = async (repoId) => {
  const { data, error } = await supabase
    .from('github_commits')
    .select('author_date')
    .eq('repo_id', repoId)
    .gte('author_date', getStartDate.value.toISOString())
    .order('author_date', { ascending: true });

  if (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
  return data;
};

const prepareChartData = (repos, commitsPerRepo) => {
  const startDate = getStartDate.value;
  const endDate = new Date();
  
  return repos.map(repo => {
    const dateMap = new Map();
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateMap.set(d.toISOString().split('T')[0], 0);
    }

    commitsPerRepo[repo.id].forEach(commit => {
      const date = commit.author_date.split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    return {
      label: repo.name,
      data: Array.from(dateMap).map(([date, count]) => ({ x: new Date(date), y: count }))
    };
  });
};

const createChart = (datasets) => {
  const ctx = chartRef.value.getContext('2d');
  
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
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
  const repos = await fetchRepos();
  const commitsPerRepo = {};
  
  for (const repo of repos) {
    commitsPerRepo[repo.id] = await fetchCommits(repo.id);
  }

  const datasets = prepareChartData(repos, commitsPerRepo);
  createChart(datasets);
};

onMounted(updateChart);

watch(() => props.timeframe, updateChart);
</script>