<template>
  <div>
    <router-link to="/blog"
      class="absolute top-20 left-8 flex items-center text-blue-500 hover:text-blue-600 font-semibold transition duration-300 ease-in-out">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to blog posts
    </router-link>

    <div class="flex-grow flex items-start justify-center py-20">
      <div v-if="post" class="container mx-auto p-6 max-w-3xl">
        <h1 class="text-4xl font-bold mb-2">{{ post.title }}</h1>
        <p class="text-sm italic text-gray-600 mb-6">{{ formatDate(post.updated_at) }}</p>
        <div class="prose lg:prose-xl markdown-content" v-html="post.renderedContent"></div>
        <BlogSubscriptionForm />
      </div>
      <div v-else class="text-center">
        <p>Post not found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData } from '#app'
import { marked } from 'marked'
import { formatDate } from '@/utils/date'
import '@/assets/marked.css';

const route = useRoute()

const { data: post, error } = await useAsyncData('post', async () => {
  try {
    const rawPost = await $fetch(`/api/blog?slug=${route.params.slug}`)
    if (!rawPost) {
      throw new Error('Post not found')
    }
    return {
      ...rawPost,
      renderedContent: marked.parse(rawPost.content)
    }
  } catch (err) {
    console.error('Error fetching blog post:', err)
  }
})

useHead(() => ({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.excerpt },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: post.value?.excerpt },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://davehague.com/blog/${route.params.slug}` },
  ],
}))
</script>