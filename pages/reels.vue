# pages/reels.vue
<template>
  <div class="container mx-auto px-4 py-20">
    <h1 class="text-3xl font-bold mb-8">Instagram Reel Transcription</h1>

    <!-- Input Form -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-8">
      <form @submit.prevent="transcribeReel" class="space-y-4">
        <div>
          <label for="reelUrl" class="block text-sm font-medium text-gray-700 mb-1">
            Instagram Reel URL
          </label>
          <input id="reelUrl" v-model="reelUrl" type="url" required placeholder="https://www.instagram.com/reels/..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex items-center space-x-2">
          <input id="uploadToReadwise" v-model="uploadToReadwise" type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label for="uploadToReadwise" class="text-sm font-medium text-gray-700">
            Upload to Readwise
          </label>
        </div>

        <div v-if="uploadToReadwise">
          <label for="readwiseToken" class="block text-sm font-medium text-gray-700 mb-1">
            Readwise API Token
          </label>
          <input id="readwiseToken" v-model="readwiseToken" type="password" required
            placeholder="Enter your Readwise API token"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Transcribing...' : 'Transcribe Reel' }}
        </button>
      </form>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="result" class="bg-white shadow-md rounded-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-2xl font-semibold">{{ result.title }}</h2>
        <button @click="copyContent"
          class="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
          <span class="text-sm">{{ copied ? 'Copied!' : 'Copy' }}</span>
          <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
            fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>


      <div class="mb-4">
        <span class="text-gray-600">Author:</span>
        <span class="ml-2">{{ result.author }}</span>
      </div>

      <div class="mb-4">
        <span class="text-gray-600">Source:</span>
        <a :href="result.source_url" target="_blank" rel="noopener noreferrer"
          class="ml-2 text-blue-600 hover:text-blue-800">
          {{ result.source_url }}
        </a>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-2">Transcript:</h3>
        <p class="whitespace-pre-wrap text-gray-700">{{ result.transcript }}</p>
      </div>

      <div v-if="result.readwise_upload" class="mt-4 p-4 bg-green-50 rounded-md">
        <p class="text-green-700">Successfully uploaded to Readwise!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const reelUrl = ref('')
const uploadToReadwise = ref(false)
const readwiseToken = ref('')
const loading = ref(false)
const error = ref(null)
const result = ref(null)
const copied = ref(false)

const copyContent = async () => {
  if (!result.value) return

  const textToCopy = `${result.value.title}\n\nTranscript:\n${result.value.transcript}`

  try {
    await navigator.clipboard.writeText(textToCopy)
    copied.value = true

    // Reset the "Copied!" state after 2 seconds
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    error.value = 'Failed to copy to clipboard'
  }
}

const transcribeReel = async () => {
  loading.value = true
  error.value = null
  result.value = null

  try {
    const response = await fetch('https://us-east4-davehague-site.cloudfunctions.net/transcribe-reel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: reelUrl.value,
        upload_to_readwise: uploadToReadwise.value,
        readwise_token: uploadToReadwise.value ? readwiseToken.value : undefined
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to transcribe reel')
    }

    result.value = await response.json()

    // Clear form if successful
    reelUrl.value = ''
    if (uploadToReadwise.value) {
      uploadToReadwise.value = false
      readwiseToken.value = ''
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>