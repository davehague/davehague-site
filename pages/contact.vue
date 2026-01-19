<template>
  <section id="contact" class="pt-20 p-6 sm:p-20 bg-white">
    <div class="container mx-auto px-6">
      <h1 class="text-4xl font-bold mb-8 text-gray-900 text-center">Send me an email</h1>
      <p class="text-center mb-8 text-gray-700">
        <span class="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
          You can email me
          <a href="mailto:dave@davehague.com" class="text-blue-600 hover:text-blue-800">
            dave@davehague.com
          </a>
          <button @click="copyEmail" class="p-1 hover:bg-gray-100 rounded-full" title="Copy email address">
            <Copy v-if="!copied" class="w-4 h-4 text-gray-600" />
            <Check v-else class="w-4 h-4 text-green-600" />
          </button>
          <span>or use the form below, which will do it for you.</span>
        </span>
      </p>
      <div class="max-w-2xl mx-auto">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Honeypot field - hidden from humans, bots will fill it -->
          <div class="absolute -left-[9999px]" aria-hidden="true">
            <label for="website">Website</label>
            <input v-model="form.website" type="text" id="website" name="website" tabindex="-1" autocomplete="off">
          </div>
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
            <input v-model="form.name" type="text" id="name" name="name" required
              class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Your Email</label>
            <input v-model="form.email" type="email" id="email" name="email" required
              class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea v-model="form.message" id="message" name="message" rows="4" required
              class="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
          </div>
          <div class="text-center">
            <button type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
              Send Message
            </button>
          </div>
        </form>
        <div v-if="submitStatus" :class="submitStatus.success ? 'text-green-600' : 'text-red-600'"
          class="mt-6 text-center">
          {{ submitStatus.message }}
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { Copy, Check } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
  website: '' // Honeypot field
})

const submitStatus = ref(null)
const copied = ref(false)
const formLoadTime = ref(Date.now())

// Reset load time when component mounts (for client-side navigation)
onMounted(() => {
  formLoadTime.value = Date.now()
})

const submitForm = async () => {
  try {
    const response = await $fetch('/api/sendEmail', {
      method: 'POST',
      body: {
        ...form.value,
        action: 'contact',
        _loadTime: formLoadTime.value
      }
    })

    if (response.success) {
      submitStatus.value = { success: true, message: 'Thank you for your message! I will get back to you soon.' }
      form.value = { name: '', email: '', message: '', website: '' }
    } else {
      throw new Error(response.message || 'Failed to send message')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    submitStatus.value = { success: false, message: 'Failed to send message. Please try again later.' }
  }
}

const copyEmail = () => {
  navigator.clipboard.writeText('dave@davehague.com')
    .then(() => {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    })
}
</script>