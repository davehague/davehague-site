import { ref, computed } from "vue";
import { useGithubStore } from "@/stores/githubStore";

// Check if period is a year (4-digit number)
const isYearPeriod = (period: string): boolean => /^\d{4}$/.test(period);

export const getStartDate = (selectedPeriod: string): Date => {
  const now = new Date();

  // Handle year periods dynamically
  if (isYearPeriod(selectedPeriod)) {
    const year = parseInt(selectedPeriod);
    return new Date(year, 0, 1); // Jan 1 of that year
  }

  switch (selectedPeriod) {
    case "7":
      return new Date(now.setDate(now.getDate() - 7));
    case "30":
      return new Date(now.setDate(now.getDate() - 30));
    case "60":
      return new Date(now.setDate(now.getDate() - 60));
    case "90":
      return new Date(now.setDate(now.getDate() - 90));
    case "ytd":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now.setDate(now.getDate() - 30));
  }
};

export const getEndDate = (selectedPeriod: string): Date => {
  // Handle year periods - end at Dec 31 of that year
  if (isYearPeriod(selectedPeriod)) {
    const year = parseInt(selectedPeriod);
    return new Date(year, 11, 31, 23, 59, 59);
  }
  // For all other periods, end is today
  return new Date();
};

export const recentPeriods = [
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "60 days", value: "60" },
  { label: "90 days", value: "90" },
];

// Generate year periods dynamically: YTD first, then previous years back to 2024
const EARLIEST_YEAR = 2024;

export const getYearPeriods = () => {
  const currentYear = new Date().getFullYear();
  const periods = [{ label: "YTD", value: "ytd" }];
  for (let year = currentYear - 1; year >= EARLIEST_YEAR; year--) {
    periods.push({ label: String(year), value: String(year) });
  }
  return periods;
};

// Combined for backwards compatibility
export const timePeriods = [
  ...recentPeriods,
  ...getYearPeriods(),
];

export const daysSincePeriod = (period: string): number => {
  const sinceDate = getStartDate(period);
  const endDate = getEndDate(period);
  return Math.floor((endDate.getTime() - sinceDate.getTime()) / (24 * 60 * 60 * 1000));
}

export const useChartUtils = () => {
  const githubStore = useGithubStore();
  const selectedPeriod = ref("30");

  const projects = computed(() =>
    githubStore.getProjectsByPeriod(selectedPeriod.value)
  );

  const loading = computed(() => githubStore.loading);

  const ensureDataFreshness = async () => {
    await githubStore.ensureDataFreshness();
  };

  const getReposAndCommits = (period: string) => {
    const filteredProjects = githubStore.getProjectsByPeriod(period);
    return {
      repos: filteredProjects,
      commits: filteredProjects.flatMap(project => 
        project.allCommits.map(commit => ({
          ...commit,
          repo_id: project.id
        }))
      )
    };
  };

  const updateSelectedPeriod = (newPeriod: string) => {
    selectedPeriod.value = newPeriod;
  };

  return {
    selectedPeriod,
    projects,
    loading,
    timePeriods,
    recentPeriods,
    getYearPeriods,
    daysSincePeriod,
    ensureDataFreshness,
    getStartDate,
    getEndDate,
    getReposAndCommits,
    updateSelectedPeriod,
  };
};