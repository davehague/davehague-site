// server/api/github/commits.ts
import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { repo, since } = query;

  if (!repo || !since) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required query parameters'
    });
  }

  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(`https://api.github.com/repos/${repo}/commits?since=${since}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch commits'
    });
  }

  const data = await response.json();
  return data;
});
