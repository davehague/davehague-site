<template>
  <div class="container mx-auto p-6 max-w-md">
    <h1 class="text-3xl font-bold mb-4">Unsubscribe from Blog Updates</h1>
    <p v-if="!email" class="mb-4">
      No email address provided. Please check the link in your email.
    </p>
    <div v-else>
      <p class="mb-4">
        Are you sure you want to unsubscribe {{ email }} from blog updates?
      </p>
      <button @click="unsubscribe"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300" :disabled="isLoading">
        {{ isLoading ? 'Processing...' : 'Unsubscribe' }}
      </button>
      <p v-if="message" :class="{ 'text-green-600': !error, 'text-red-600': error }" class="mt-4">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const email = ref('')
const isLoading = ref(false)
const message = ref('')
const error = ref(false)

onMounted(() => {
  email.value = route.query.email as string || ''
})

const unsubscribe = async () => {
  isLoading.value = true
  message.value = ''
  error.value = false

  try {
    const response = await fetch(`/api/blogSubscribers?email=${encodeURIComponent(email.value)}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Unsubscribe failed')
    }

    message.value = 'You have been successfully unsubscribed.'
  } catch (err) {
    error.value = true
    message.value = 'Failed to unsubscribe. Please try again or contact support.'
  } finally {
    isLoading.value = false
  }
}
</script>