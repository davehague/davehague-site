export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  html_url: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubCommit {
  commit_id: number;
  author_name: string;
  author_username: string;
  author_email: string;
  author_date: Date;
  message: string;
  html_url: string;
}
