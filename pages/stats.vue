<template>
  <div class="content">
    <site-header />
    <main>
      <section id="home">
        <h1>Github Stats</h1>
        <RadarChart @timeframe="handleTimeframe" />
        <DismissableMarkdownModal v-if="showModal" :isVisible="showModal" :content="tldrText"
          @close="showModal = false" />
      </section>
    </main>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import SiteHeader from '@/components/SiteHeader.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import RadarChart from '@/components/RadarChart.vue';
import DismissableMarkdownModal from '@/components/DismissableMarkdownModal.vue';
import { supabase } from "@/utils/supabaseClient";
import { type GitHubRepo, type GitHubCommit } from '@/types/interfaces';

export default defineComponent({
  components: {
    SiteHeader,
    SiteFooter,
    RadarChart,
    DismissableMarkdownModal
  },
  setup() {
    const commits = ref<GitHubCommit[]>([]);
    let daysBetween = ref(0);
    let tldrText = ref('');
    const showModal = ref(false);

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

    const tldr = async (timeframe: number, commitMessages: any) => {
      try {
        let message = "Following is a list of commit messages from a number of Github repositories."
          + ` David has worked on these commits for the past ${timeframe} day(s). For each repo, `
          + " give 3 top level bullets, summarizing the major changes. Order the summary by the repos"
          + " with the most changes at the top. Start with the sentence "
          + `'Here is a summary of David's changes over the past ${timeframe} days:'` 
          + "\n\n"
          + commitMessages;

        console.log(message);

        const res = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message }),
        });

        const data = await res.json();
        console.log(data.message.content);
        tldrText.value = data.message.content;
        showModal.value = true;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const handleTimeframe = async (timeframe: number) => {
      console.log('Timeframe:', timeframe);
      let authorDate = new Date();
      authorDate.setDate(authorDate.getDate() - timeframe);
      console.log('Author date:', authorDate);

      const { data, error } = await supabase
        .from('github_commits')
        .select(`message, github_repos (name)`)
        .gt('author_date', authorDate.toISOString());

      if (error) {
        console.error('Error fetching data:', error);
        return null;
      }

      const result = data.map((commit: any) => {
        return {
          repo_name: commit.github_repos.name,
          message: commit.message
        };
      }).reduce((acc: any, curr: any) => {
        if (acc[curr.repo_name]) {
          acc[curr.repo_name].push(curr.message);
        } else {
          acc[curr.repo_name] = [curr.message];
        }
        return acc;
      }, {});

      tldr(timeframe, JSON.stringify(result, null, 2));
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
      daysBetween.value = Math.ceil((now.getTime() - latest_db_date.getTime()) / (1000 * 3600 * 24));
      since.setDate(now.getDate() - daysBetween.value);

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
        commits.value = await fetchCommits(repo.owner, repo.name, since.toISOString());
        console.log(commits);

        for (const commit of commits.value) {
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

    return {
      tldr,
      tldrText,
      showModal,
      handleTimeframe
    };
  }
})
</script>
