import { defineEventHandler, getQuery, createError, H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const since = query.since as string;

  if (!since) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required query parameter: since",
    });
  }

  const token = process.env.GITHUB_TOKEN;
  console.log('Fetching repos from https://api.github.com/user/repos');
  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: "Failed to fetch repositories",
    });
  }

  const repos = await response.json();
  const sinceDate = new Date(since);
  console.log('Filtering repos pushed since:', sinceDate.toISOString());
  const filteredRepos = repos.filter(
    (repo: any) => new Date(repo.pushed_at) >= sinceDate
  );

  return filteredRepos;
});
