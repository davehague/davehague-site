# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Generate static site**: `npm run generate`
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Architecture Overview

This is a Nuxt 3 application for Dave Hague's personal website with the following key architectural components:

### Core Technologies
- **Nuxt 3** with TypeScript (strict mode enabled)
- **Vue 3** with Composition API
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Supabase** for database operations
- **Chart.js** with vue-chartjs for data visualization

### Data Layer
- **Supabase Integration**: Database operations through `utils/supabaseClient.ts` using custom schema `davehaguesite`
- **GitHub Data Sync**: Automated GitHub repository and commit data fetching stored in Supabase
- **Blog System**: Markdown-based blog posts with Supabase backend for metadata
- **Gist Integration**: GitHub gists display and management

### Key Stores (Pinia)
- **githubStore**: Manages GitHub repositories and commits with 4-hour caching strategy
- **blogStore**: Handles blog post CRUD operations
- **gistsStore**: Manages GitHub gists data

### Server API Routes (`server/api/`)
- **GitHub Integration**: `/github/repos.ts`, `/github/commits.ts`, `/github/gists.ts`, `/github/cron-refresh.ts`, `/github/refresh.ts`
- **Blog Management**: `/blog.ts`, `/posts.ts`, `/blogSubscribers.ts`
- **AI Integration**: `/openai.ts`, `/openrouter.ts`
- **Email Service**: `/sendEmail.ts` (using Mailjet)

### Pages Structure
- **Home**: Landing page with project showcase
- **Blog**: Full blog system with create/edit/manage capabilities
- **Projects**: Dedicated project showcase pages
- **Stats**: GitHub activity visualization with charts
- **Contact**: Contact form with email integration

### Composables
- **useGithubData**: GitHub API integration utilities
- **useChartUtils**: Chart.js configuration helpers
- **useColorUtils**: Color manipulation utilities

### Content Management
- **Blog Posts**: Stored as markdown in `public/posts/` with naming convention `yyyy-mm-dd-post-title.md`
- **Static Assets**: Images and resources in `public/images/`
- **Experiments**: Interactive demos in `public/experiments/`

### Authentication & Security
- Admin functionality protected by `ADMIN_TOKEN` environment variable
- Vercel Cron jobs authenticated via `CRON_SECRET` environment variable
- Supabase RLS (Row Level Security) enabled for data protection

### Deployment
- **Vercel optimized**: Custom `vercel-build` script handles markdown file copying
- **Static generation**: Support for SSG via `nuxt generate`

## Important Notes
- GitHub data is cached locally for 4 hours to avoid API rate limits
- GitHub sync runs via Vercel Cron (twice daily, 7-day incremental) or manual refresh (90-day full sync)
- GitHub data only includes commits from `david.hague@gmail.com` starting from 1/1/2024
- Blog posts use markdown format and are processed server-side
- The site includes analytics via Vercel Analytics
- All TypeScript interfaces are defined in `types/interfaces.ts`