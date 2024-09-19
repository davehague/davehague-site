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
  console.log('Fetching gists from https://api.github.com/gists');
  const response = await fetch("https://api.github.com/gists", {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: "Failed to fetch gists",
    });
  }

  const gists = await response.json();
  const sinceDate = new Date(since);
  console.log('Filtering gists updated since:', sinceDate.toISOString());
  const filteredGists = gists.filter(
    (gist: any) => new Date(gist.updated_at) >= sinceDate
  );

  return filteredGists;
});