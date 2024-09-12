<template>
  <!-- Back arrow button -->
  <router-link to="/blog/manage"
    class="absolute top-20 left-8 flex items-center text-blue-500 hover:text-blue-600 font-semibold transition duration-300 ease-in-out">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back to manage
  </router-link>
  <div class="container mx-auto px-4 py-24">
    <h1 class="text-4xl font-bold mb-6">Edit Blog Post</h1>
    <BlogForm v-if="post" :is-edit="true" :initial-data="post" @submit="updatePost" />
    <p v-else>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type BlogPost } from '~/types/interfaces'

const route = useRoute()
const router = useRouter()
const post = ref<BlogPost | null>(null)

const fetchPost = async () => {
  try {
    const response = await fetch(`/api/blog?slug=${route.params.slug}`)
    if (!response.ok) throw new Error('Failed to fetch blog post')
    post.value = await response.json()
  } catch (error) {
    console.error('Error fetching blog post:', error)
    alert('Failed to fetch blog post')
  }
}

const updatePost = async (data: Partial<BlogPost> & { password: string }) => {
  try {
    const response = await fetch(`/api/blog?slug=${route.params.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, newSlug: data.slug })
    })
    if (!response.ok) throw new Error('Failed to update blog post')
    await router.push('/blog/manage')
  } catch (error) {
    console.error('Error updating blog post:', error)
    alert('Failed to update blog post')
  }
}

onMounted(fetchPost)
</script>