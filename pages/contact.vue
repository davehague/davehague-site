<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <SiteHeader />

    <main class="pt-20">
      <section id="contact" class="py-20 bg-white">
        <div class="container mx-auto px-6">
          <h1 class="text-4xl font-bold mb-8 text-gray-900 text-center">Send me an email</h1>
          <div class="max-w-2xl mx-auto">
            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Your Name</label>
                <input v-model="form.name" type="text" id="name" name="name" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Your Email</label>
                <input v-model="form.email" type="email" id="email" name="email" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                <textarea v-model="form.message" id="message" name="message" rows="4" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
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
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navItems = [
  { id: 'about', name: 'About' },
  { id: 'projects', name: 'Projects' },
  { id: 'blog', name: 'Blog' },
  { id: 'contact', name: 'Contact' },
]

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitStatus = ref(null)

const submitForm = async () => {
  try {
    const response = await $fetch('/api/sendEmail', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      submitStatus.value = { success: true, message: 'Thank you for your message! I will get back to you soon.' }
      form.value = { name: '', email: '', message: '' }
    } else {
      throw new Error(response.message || 'Failed to send message')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    submitStatus.value = { success: false, message: 'Failed to send message. Please try again later.' }
  }
}
</script>