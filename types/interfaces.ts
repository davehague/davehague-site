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

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  is_draft: boolean;
}

export interface Gist {
  id: string;
  node_id: string;
  html_url: string;
  git_pull_url: string;
  git_push_url: string;
  commits_url: string;
  forks_url: string;
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string | null;
  comments: number;
  comments_url: string;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    type: string;
  } | null;
  user: null;
  files: { [key: string]: GistFile };
  truncated: boolean;
}

export interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  content: string;
  renderedContent?: string;
}

export interface BlogSubscribers {
  id: number;
  email: string;
  created_at: Date;
}
