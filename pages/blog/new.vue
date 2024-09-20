<template>
  <router-link to="/blog/manage"
    class="absolute top-20 left-8 flex items-center text-blue-500 hover:text-blue-600 font-semibold transition duration-300 ease-in-out">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back to manage
  </router-link>
  <div class="container mx-auto px-4 py-24">
    <h1 class="text-4xl font-bold mb-6">Create New Blog Post</h1>
    <BlogForm :is-edit="false" @submit="createPost" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type BlogPost } from '~/types/interfaces'
import { publishPost } from '~/utils/blogUtils'

const router = useRouter()

const createPost = async (data: Partial<BlogPost> & { password: string }) => {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create blog post')
    
    if (!data.is_draft) {
      await publishPost(data)
    }
    
    await router.push('/blog/manage')
  } catch (error) {
    console.error('Error creating blog post:', error)
    alert('Failed to create blog post')
  }
}
</script>