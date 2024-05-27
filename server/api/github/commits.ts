import { defineEventHandler, getQuery, createError, H3Event } from 'h3';

interface CommitQueryParams {
  repo: string;
  since: string;
}

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event) as CommitQueryParams;

  if (!query.repo || !query.since) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required query parameters: repo and since are required',
    });
  }

  const token = process.env.GITHUB_TOKEN;
  const username = 'davehague';
  let allCommits: any[] = [];
  let page = 1;
  let fetchMore = true;

  while (fetchMore) {
    const url = `https://api.github.com/repos/${query.repo}/commits?author=${username}&since=${query.since}&per_page=100&page=${page}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch commits: ${response.statusText}`,
      });
    }

    const data = await response.json();
    if (data.length > 0) {
      allCommits = allCommits.concat(data);
      page++;
    } else {
      fetchMore = false;
    }
  }

  return allCommits;
});
