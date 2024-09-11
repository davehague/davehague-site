<template>
  <div class="container mx-auto px-4 py-20 max-w-3xl">
    <h1 class="text-4xl font-bold mb-6">Create New Blog Post</h1>
    <BlogForm :is-edit="false" @submit="createPost" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type BlogPost } from '~/types/interfaces'

const router = useRouter()

const createPost = async (data: Partial<BlogPost> & { password: string }) => {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create blog post')
    await router.push('/blog/manage')
  } catch (error) {
    console.error('Error creating blog post:', error)
    alert('Failed to create blog post')
  }
}
</script>