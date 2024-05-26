// server/api/github/repos.ts
import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async () => {
  const token = process.env.GITHUB_TOKEN;

  const response = await fetch('https://api.github.com/user/repos', {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch repositories'
    });
  }

  const data = await response.json();
  return data;
});
