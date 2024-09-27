// server/api/github/refresh.ts

import { defineEventHandler, readBody } from 'h3'
import { useGithubData } from '~/composables/useGithubData'

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }

  try {
    const body = await readBody(event)
    const { password } = body

    // Check if the password is correct
    if (password !== process.env.ADMIN_TOKEN) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // If the password is correct, proceed with updating GitHub data
    const { checkAndUpdateGithubData } = useGithubData()
    await checkAndUpdateGithubData()

    return {
      statusCode: 200,
      body: { message: 'GitHub data refreshed successfully' },
    }
  } catch (error) {
    console.error('Error refreshing GitHub data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error refreshing GitHub data',
    })
  }
})