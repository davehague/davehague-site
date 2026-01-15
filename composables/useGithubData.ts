// composables/useGithubData.ts

import { ref } from "vue";
import { supabase } from "@/utils/supabaseClient";
import { type GitHubRepo, type GitHubCommit } from "@/types/interfaces";

// Only sync commits from this author
const AUTHOR_EMAIL = "david.hague@gmail.com";

export function useGithubData() {
  const commits = ref<GitHubCommit[]>([]);
  const daysBetween = ref(0);

  const fetchUserRepos = async (since: string): Promise<GitHubRepo[]> => {
    try {
      const sinceDate = new Date(since);
      const formattedSince = sinceDate.toISOString();

      let response;
      if (import.meta.server) {
        // Server-side: use GitHub API directly
        const token = process.env.GITHUB_TOKEN;
        response = await fetch("https://api.github.com/user/repos?per_page=100", {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
      } else {
        // Client-side: use Nuxt API route
        response = await fetch(
          `/api/github/repos?since=${encodeURIComponent(formattedSince)}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      //console.log("Fetched", data.length, "repositories", data.map((repo: any) => repo.full_name));

      // Filter repos on the server side when using GitHub API directly
      const filteredData = import.meta.server
        ? data.filter((repo: any) => new Date(repo.pushed_at) >= sinceDate)
        : data;

      return filteredData.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.full_name.split("/")[0],
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
      }));
    } catch (error) {
      console.error("Error fetching repositories:", error);
      return [];
    }
  };

  const getBranches = async (
    repo_owner: string,
    repo: string
  ): Promise<Branch[]> => {
    const url = `/api/github/branches?repo_owner=${encodeURIComponent(
      repo_owner
    )}&repo=${encodeURIComponent(repo)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch branches: ${response.statusText}`);
    }
    return response.json();
  };

  interface GitHubCommit {
    commit_id: string;
    author_name: string;
    author_email: string;
    author_username?: string;
    author_date: string;
    message: string;
    html_url: string;
  }

  interface Branch {
    name: string;
  }

  const fetchCommits = async (
    repo_owner: string,
    repo: string,
    since: string
  ): Promise<GitHubCommit[]> => {
    const allCommits: GitHubCommit[] = [];

    const fetchFromGitHub = async (
      url: string,
      headers: HeadersInit = {}
    ): Promise<any> => {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.statusText}`);
      }
      return response.json();
    };

    const processCommits = (commits: any[]): GitHubCommit[] => {
      return commits.map((commit: any) => ({
        commit_id: commit.sha,
        author_name: commit.commit.author.name,
        author_email: commit.commit.author.email,
        author_username: commit.author?.login,
        author_date: commit.commit.author.date,
        message: commit.commit.message,
        html_url: commit.html_url,
      }));
    };

    try {
      let branches: Branch[];
      const headers: HeadersInit = {};

      if (import.meta.server) {
        // Server-side: use GitHub API directly
        const token = process.env.GITHUB_TOKEN;
        headers.Authorization = `token ${token}`;
        headers.Accept = "application/vnd.github.v3+json";

        const branchesUrl = `https://api.github.com/repos/${repo_owner}/${repo}/branches`;
        branches = await fetchFromGitHub(branchesUrl, headers);
      } else {
        // Client-side: use Nuxt API route
        const branchesUrl = `/api/github/branches?repo_owner=${encodeURIComponent(
          repo_owner
        )}&repo=${encodeURIComponent(repo)}`;
        branches = await fetchFromGitHub(branchesUrl);
      }

      for (const branch of branches) {
        console.log("Fetching commits for branch:", branch.name);

        if (import.meta.server) {
          // Server-side: paginate through all commits
          let page = 1;
          let fetchMore = true;
          while (fetchMore) {
            const url = `https://api.github.com/repos/${repo_owner}/${repo}/commits?sha=${branch.name}&since=${since}&per_page=100&page=${page}`;
            const branchCommits = await fetchFromGitHub(url, headers);
            if (branchCommits.length > 0) {
              allCommits.push(...processCommits(branchCommits));
              page++;
            } else {
              fetchMore = false;
            }
          }
        } else {
          // Client-side: API endpoint handles pagination
          const url = `/api/github/commits?repo_owner=${encodeURIComponent(
            repo_owner
          )}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(
            branch.name
          )}&since=${encodeURIComponent(since)}`;
          const branchCommits = await fetchFromGitHub(url, headers);
          allCommits.push(...processCommits(branchCommits));
        }
      }

      console.log("Found", allCommits.length, "commits for repo", repo, "since", since);
      return allCommits;
    } catch (error) {
      console.error("Error fetching commits:", error);
      return [];
    }
  };

  const updateGithubData = async () => {
    const now = new Date();
    // Look back 2 years to cover full historical data
    // Using upsert ensures duplicates won't be created
    const since = new Date(now);
    since.setFullYear(now.getFullYear() - 2);

    console.log("Fetching repos that have pushed since:", since.toISOString());
    const repos = await fetchUserRepos(since.toISOString());

    for (const repo of repos) {
      const { data, error } = await supabase
        .from("github_repos")
        .upsert([
          {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
          },
        ])
        .select();

      if (error) {
        console.error("Error when fetching repo:", error);
        return null;
      }

      const repo_id = (data as any)[0].id;
      commits.value = await fetchCommits(
        repo.owner,
        repo.name,
        since.toISOString()
      );

      // Only store commits from the configured author
      const myCommits = commits.value.filter(
        (commit) => commit.author_email === AUTHOR_EMAIL
      );

      for (const commit of myCommits) {
        const { error } = await supabase
          .from("github_commits")
          .upsert([
            {
              commit_id: commit.commit_id,
              author_name: commit.author_name,
              author_username: commit.author_username,
              author_email: commit.author_email,
              author_date: commit.author_date,
              message: commit.message,
              html_url: commit.html_url,
              repo_id: repo_id,
            },
          ])
          .select();

        if (error) {
          console.error("Error when fetching repo:", error);
          return null;
        }
      }
    }
  };

  const checkAndUpdateGithubData = async () => {
    const now = new Date();
    const { data: latest_commit } = await supabase
      .from("github_commits")
      .select("author_date")
      .order("author_date", { ascending: false })
      .limit(1);

    if (latest_commit && latest_commit.length > 0) {
      const latest_db_date = new Date(latest_commit[0].author_date);
      console.log("Latest commit date:", latest_db_date);
      const daysSinceLastUpdate = Math.ceil(
        (now.getTime() - latest_db_date.getTime()) / (1000 * 3600 * 24)
      );

      if (daysSinceLastUpdate >= 1) {
        console.log(
          "Days since last update:",
          daysSinceLastUpdate,
          ", updating data"
        );
        await updateGithubData();
      } else {
        console.log("Data is up to date, no update needed");
      }
    } else {
      console.log("No commits in the database, updating data");
      await updateGithubData();
    }
  };

  return {
    commits,
    daysBetween,
    checkAndUpdateGithubData,
  };
}
