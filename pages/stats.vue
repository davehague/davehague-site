<template>
  <div class="content">
    <site-header />
    <main>
      <section id="home">
        <h1>Github Stats</h1>
        <RadarChart />
      </section>
    </main>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import RadarChart from '@/components/RadarChart.vue'
import { supabase } from "@/utils/supabaseClient";


interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  html_url: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubCommit {
  commit_id: number;
  author_name: string;
  author_username: string;
  author_email: string;
  author_date: Date;
  message: string;
  html_url: string;
}


export default defineComponent({
  components: {
    SiteHeader,
    SiteFooter,
    RadarChart
  },
  setup() {
    const fetchUserRepos = async (since: string): Promise<GitHubRepo[]> => {
      try {
        const response = await fetch(`/api/github/repos?since=${encodeURIComponent(since)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        return data.map((repo: any) => {
          return {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: repo.full_name.split('/')[0],
            html_url: repo.html_url,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at
          };
        });
      } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
      }
    };

    const fetchCommits = async (repo_owner: string, repo: string, since: string): Promise<GitHubCommit[]> => {
      try {
        const response = await fetch(`/api/github/commits?repo_owner=${repo_owner}&repo=${repo}&since=${since}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch commits for repo ${repo}`);
        }
        const data = await response.json();
        console.log('Found ', data.length, ' commits for repo ', repo, 'since ', since);
        return data.map((commit: any) => {
          return {
            commit_id: commit.sha,
            author_name: commit.commit.author.name,
            author_email: commit.commit.author.email,
            author_username: commit.author.login,
            author_date: commit.commit.author.date,
            message: commit.commit.message,
            html_url: commit.html_url
          };
        })
      } catch (error) {
        console.error('Error fetching commits:', error);
        return [];
      }
    };

    onMounted(async () => {
      const now = new Date();
      let since: Date;
      since = new Date(now);

      const { data: latest_commit } = await supabase
        .from('github_commits')
        .select('author_date')
        .order('author_date', { ascending: false })
        .limit(1);

      let latest_db_date = new Date(latest_commit?.[0].author_date || now.getDate() - 1);
      console.log('Latest commit date:', latest_db_date);
      let days_between = Math.ceil((now.getTime() - latest_db_date.getTime()) / (1000 * 3600 * 24));
      since.setDate(now.getDate() - days_between);

      console.log('Fetching repos that have pushed since:', since.toISOString());
      const repos = await fetchUserRepos(since.toISOString());

      for (const repo of repos) {
        const { data, error } = await supabase
          .from('github_repos')
          .upsert([{ 
            id: repo.id, name: repo.name, full_name: repo.full_name, html_url: repo.html_url, 
            updated_at: repo.updated_at, pushed_at: repo.pushed_at 
          }])
          .select();

        if (error) {
          console.error('Error when fetching repo:', error);
          return null;
        }

        const repo_id = (data as any)[0].id;
        const commits = await fetchCommits(repo.owner, repo.name, since.toISOString());
        console.log(commits);

        for (const commit of commits) {
          const { data, error } = await supabase
            .from('github_commits')
            .upsert([{
              commit_id: commit.commit_id,
              author_name: commit.author_name,
              author_username: commit.author_username,
              author_email: commit.author_email,
              author_date: commit.author_date,
              message: commit.message,
              html_url: commit.html_url,
              repo_id: repo_id
            }])
            .select();

          if (error) {
            console.error('Error when fetching repo:', error);
            return null;
          }
        }
      }
    });

  }
})
</script>
