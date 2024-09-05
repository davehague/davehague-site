import { defineStore } from "pinia";
import { supabase } from "@/utils/supabaseClient";

interface Commit {
  commit_id: string;
  message: string;
  author_date: string;
  author_name: string;
}

interface Project {
  id: number;
  name: string;
  html_url: string;
  updated_at: string;
  pushed_at: string;
  allCommits: Commit[];
}

const LAST_FETCH_KEY = "github_last_fetch_time";
const PROJECTS_CACHE_KEY = "github_projects_cache";

export const useGithubStore = defineStore("github", {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    lastFetchTime: null as Date | null,
  }),

  actions: {
    async ensureDataFreshness() {
      const now = new Date();
      const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
      const ytdDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year

      // Load lastFetchTime from localStorage
      const storedLastFetch = localStorage.getItem(LAST_FETCH_KEY);
      if (storedLastFetch) {
        this.lastFetchTime = new Date(storedLastFetch);
      }

      // Load projects from localStorage if they're not already loaded
      if (this.projects.length === 0) {
        const storedProjects = localStorage.getItem(PROJECTS_CACHE_KEY);
        if (storedProjects) {
          this.projects = JSON.parse(storedProjects);
        }
      }

      if (
        this.lastFetchTime &&
        this.lastFetchTime > fourHoursAgo &&
        this.projects.length > 0
      ) {
        console.log("Using cached data (last pull was less than 4 hours ago)");
        return;
      }

      console.log("Fetching fresh data...");
      await this.fetchProjects();
      console.log(this.projects);

    },

    async fetchProjects() {
      this.loading = true;
      const ytdDate = new Date(new Date().getFullYear(), 0, 1); // January 1st of current year

      try {
        const repos = await this.fetchUserRepos(ytdDate.toISOString());
        const projectsWithCommits = await Promise.all(
          repos.map(async (repo) => {
            const allCommits = await this.fetchCommits(repo.id, ytdDate);
            return { ...repo, allCommits };
          })
        );

        projectsWithCommits.sort((a, b) => a.name.localeCompare(b.name));

        this.projects = projectsWithCommits;
        this.lastFetchTime = new Date();

        localStorage.setItem(LAST_FETCH_KEY, this.lastFetchTime.toISOString());
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(this.projects));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserRepos(since: string) {
      const { data, error } = await supabase
        .from("github_repos")
        .select("*")
        .gte("pushed_at", since);

      if (error) {
        console.error("Error fetching repositories:", error);
        return [];
      }

      console.log("Fetched", data.length, "repositories", data);
      return data;
    },

    async fetchCommits(repoId: number, since: Date, limit?: number) {
      const sinceUTC = since.toISOString();
      let query = supabase
        .from("github_commits")
        .select("*")
        .eq("repo_id", repoId)
        .gte("author_date", sinceUTC)
        .order("author_date", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching commits:", error);
        return [];
      }
      return data;
    },
  },

  getters: {
    getProjectsByPeriod: (state) => (period: string) => {
      const now = new Date();
      let sinceDate: Date;

      if (period === "ytd") {
        sinceDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
      } else {
        const days = parseInt(period);
        sinceDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      }

      return state.projects.filter(
        (project) => new Date(project.pushed_at) >= sinceDate
      );
    },
  },
});
