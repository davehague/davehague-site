<template>
  <div class="container mx-auto py-20 px-4">
    <h1 class="text-3xl font-bold mb-8 text-center">Refresh GitHub Stats</h1>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label for="adminPassword" class="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
        <input
          v-model="password"
          id="adminPassword"
          type="password"
          class="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Enter admin password"
        />
      </div>
      <button
        @click="refreshGithubData"
        class="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Refreshing...' : 'Refresh GitHub Data' }}
      </button>
      <p v-if="message" class="mt-4 text-sm" :class="{ 'text-green-600': !error, 'text-red-600': error }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
const message = ref('')
const error = ref(false)
const isLoading = ref(false)

const refreshGithubData = async () => {
  if (!password.value) {
    message.value = 'Please enter the admin password.'
    error.value = true
    return
  }

  isLoading.value = true
  message.value = ''
  error.value = false

  try {
    const response = await fetch('/api/github/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password.value }),
    })

    const result = await response.json()

    if (response.ok) {
      message.value = result.message || 'GitHub data refreshed successfully.'
      error.value = false
    } else {
      throw new Error(result.statusMessage || 'Failed to refresh GitHub data')
    }
  } catch (err) {
    console.error('Error refreshing GitHub data:', err)
    message.value = err instanceof Error ? err.message : 'An error occurred while refreshing GitHub data.'
    error.value = true
  } finally {
    isLoading.value = false
    password.value = ''
  }
}
</script>