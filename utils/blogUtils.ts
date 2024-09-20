// utils/blogUtils.ts

import type { BlogPost, BlogSubscriber } from '~/types/interfaces'

export async function fetchSubscribers(): Promise<BlogSubscriber[]> {
  try {
    const response = await fetch('/api/blogSubscribers')
    if (!response.ok) throw new Error('Failed to fetch subscribers')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    throw error
  }
}

export async function sendEmailToSubscribers(post: Partial<BlogPost>) {
  try {
    const subscribers = await fetchSubscribers()

    for (const subscriber of subscribers) {
      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriber.email,
          action: 'newBlogPost',
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug
        })
      })
    }
  } catch (error) {
    console.error('Error sending emails to subscribers:', error)
    throw error
  }
}

export async function publishPost(post: Partial<BlogPost>) {
  try {
    await sendEmailToSubscribers(post)
    // Note: This function doesn't update any client-side state.
    // The calling component should handle any necessary state updates or refetching.
  } catch (error) {
    console.error('Error publishing post:', error)
    throw error
  }
}