<template>
  <div class="container mx-auto px-4 py-20">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold">Manage Blog Posts</h1>
      <NuxtLink to="/blog/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        New Post
      </NuxtLink>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in blogStore.blogPosts" :key="post.id" class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="flex flex-col h-full p-4">
          <div class="flex justify-between items-center mb-2">
            <NuxtLink :to="`/blog/${post.slug}`" class="text-xl font-semibold hover:text-blue-600">
              {{ post.title }}
            </NuxtLink>
            <span v-if="post.is_draft" class="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">Draft</span>
          </div>
          <p class="text-gray-600 mb-4 flex-grow">{{ post.excerpt }}</p>
          <div class="flex justify-end space-x-2 mt-auto">
            <NuxtLink :to="`/blog/edit/${post.slug}`"
              class="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit
            </NuxtLink>
            <button @click="openDeleteModal(post)"
              class="bg-gray-700 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
        <p class="mb-4">Are you sure you want to delete the post "{{ postToDelete?.title }}"?</p>
        <div class="mb-4">
          <label for="deletePassword" class="block text-sm font-medium text-gray-700">Admin Password</label>
          <input v-model="deletePassword" type="password" id="deletePassword"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="closeDeleteModal"
            class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button @click="confirmDelete" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from '~/stores/blogStore'
import type { BlogPost } from '~/types/interfaces'

const blogStore = useBlogStore()
const showDeleteModal = ref(false)
const postToDelete = ref<BlogPost | null>(null)
const deletePassword = ref('')

const fetchPosts = async () => {
  await blogStore.fetchBlogPosts(true, true)
}

const openDeleteModal = (post: BlogPost) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  postToDelete.value = null
  deletePassword.value = ''
}

const confirmDelete = async () => {
  if (!postToDelete.value) return

  try {
    const response = await fetch(`/api/blog?slug=${postToDelete.value.slug}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePassword.value })
    })
    if (!response.ok) throw new Error('Failed to delete blog post')
    await fetchPosts()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting blog post:', error)
    alert('Failed to delete blog post')
  }
}

onMounted(fetchPosts)
</script>