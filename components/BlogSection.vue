<template>
  <section id="blog" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold mb-8 text-gray-900">Blog</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in blogPosts" :key="post.id" class="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-900">{{ post.title }}</h3>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <a :href="post.link" class="text-blue-600 hover:underline">Read More</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const blogPosts = ref([
  {
    id: 1,
    title: 'The Future of AI in Software Development',
    excerpt: 'Exploring how AI is reshaping the landscape of software development and what it means for developers.',
    link: '#',
  },
  {
    id: 2,
    title: 'Building Scalable APIs with FastAPI',
    excerpt: 'A deep dive into creating efficient and scalable APIs using FastAPI and best practices.',
    link: '#',
  },
  {
    id: 3,
    title: 'My Journey from .NET to Python and TypeScript',
    excerpt: 'Reflecting on the transition from .NET to Python and TypeScript, and the lessons learned along the way.',
    link: '#',
  },
])
</script>