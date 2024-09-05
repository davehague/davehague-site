<template>
  <div class="w-full h-64 md:h-96">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { supabase } from "@/utils/supabaseClient";
import { format, eachDayOfInterval } from 'date-fns';

Chart.register(...registerables);

const props = defineProps({
  timeframe: {
    type: String,
    required: true
  }
});

const chartRef = ref(null);
let chart = null;

const fetchReposAndCommits = async () => {
  const startDate = getStartDate(props.timeframe);
  const { data: repos, error: repoError } = await supabase
    .from('github_repos')
    .select('id, name, pushed_at')
    .gte('pushed_at', startDate.toISOString())
    .order('pushed_at', { ascending: false }); // Order by pushed_at, newest first

  if (repoError) {
    console.error('Error fetching repos:', repoError);
    return { repos: [], commits: [] };
  }

  const { data: commits, error: commitError } = await supabase
    .from('github_commits')
    .select('repo_id, author_date')
    .gte('author_date', startDate.toISOString())
    .order('author_date', { ascending: true });

  if (commitError) {
    console.error('Error fetching commits:', commitError);
    return { repos, commits: [] };
  }

  return { repos, commits };
};

const prepareChartData = (repos, commits) => {
  const startDate = getStartDate(props.timeframe);
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

const getColorForRepo = (repoName) => {
  const storedColors = JSON.parse(localStorage.getItem('repoColors') || '{}');
  if (storedColors[repoName]) {
    return storedColors[repoName];
  }
  
  const newColor = generateDistinctColor(Object.values(storedColors));
  storedColors[repoName] = newColor;
  localStorage.setItem('repoColors', JSON.stringify(storedColors));
  return newColor;
};

const generateDistinctColor = (existingColors) => {
  const goldenRatioConjugate = 0.618033988749895;
  let hue = Math.random();
  const maxAttempts = 20;
  
  const getHSLAColor = (h) => `hsla(${Math.floor(h * 360)}, 70%, 60%, 0.7)`;
  
  // Check if the color is distinct enough
  const isDistinct = (color, existingColors) => {
    return existingColors.every(existingColor => {
      const hue1 = parseInt(color.match(/hsla\((\d+)/)[1]);
      const hue2 = parseInt(existingColor.match(/hsla\((\d+)/)[1]);
      const hueDiff = Math.min(Math.abs(hue1 - hue2), 360 - Math.abs(hue1 - hue2));
      return hueDiff > 30;
    });
  };
  
  // Generate colors until a distinct one is found or max attempts reached
  for (let i = 0; i < maxAttempts; i++) {
    hue += goldenRatioConjugate;
    hue %= 1;
    const color = getHSLAColor(hue);
    if (existingColors.length === 0 || isDistinct(color, existingColors)) {
      return color;
    }
  }
  
  // If we couldn't find a distinct color, just return the last generated one
  return getHSLAColor(hue);
};

const createChart = (data) => {
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
            label: () => null // This removes the default label
          }
        },
        legend: {
          position: 'top',
        }
      }
    }
  });
};

const updateChart = async () => {
  const { repos, commits } = await fetchReposAndCommits();
  const chartData = prepareChartData(repos, commits);
  createChart(chartData);
};

onMounted(updateChart);

watch(() => props.timeframe, updateChart);
</script>