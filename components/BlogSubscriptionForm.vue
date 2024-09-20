<template>
  <div class="mt-16 p-4 bg-blue-100 rounded-lg">
    <p class="mb-4">Enter your email to get the latest blog posts in your inbox</p>
    <form @submit.prevent="subscribe" class="flex flex-col sm:flex-row gap-2">
      <input v-model="email" type="email" placeholder="Your email address" required
        class="flex-grow px-3 py-2 border rounded" />
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        :disabled="isLoading">
        {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
      </button>
    </form>
    <p v-if="message" :class="{ 'text-green-600': !error, 'text-red-600': error }" class="mt-2">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)
const message = ref('')
const error = ref(false)

const subscribe = async () => {
  isLoading.value = true
  message.value = ''
  error.value = false

  try {
    const response = await fetch('/api/blogSubscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    })

    const result = await response.json()

    if (response.ok) {
      if (result.success) {
        message.value = result.message
        email.value = ''
      } else {
        error.value = true
        message.value = result.message
      }
    } else {
      throw new Error(result.message || 'Subscription failed')
    }
  } catch (err) {
    console.error('Subscription error:', err)
    error.value = true
    message.value = err instanceof Error ? err.message : 'Failed to subscribe. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>