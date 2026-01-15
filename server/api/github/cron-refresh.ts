// server/api/github/cron-refresh.ts
// Endpoint for Vercel Cron - authenticated via CRON_SECRET header

import { defineEventHandler, createError, getHeader } from 'h3'
import { useGithubData } from '~/composables/useGithubData'

export default defineEventHandler(async (event) => {
  // Verify the request is from Vercel Cron
  const authHeader = getHeader(event, 'authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET not configured')
    throw createError({
      statusCode: 500,
      statusMessage: 'Cron not configured',
    })
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  try {
    console.log('Vercel Cron: Starting GitHub data refresh')
    const { checkAndUpdateGithubData } = useGithubData()
    await checkAndUpdateGithubData()
    console.log('Vercel Cron: GitHub data refresh complete')

    return {
      success: true,
      message: 'GitHub data refreshed successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Vercel Cron: Error refreshing GitHub data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error refreshing GitHub data',
    })
  }
})
