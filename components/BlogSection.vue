<template>
  <section id="blog" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold mb-8 text-gray-900">Blog</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in recentPosts" :key="post.id" class="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div class="p-6">
            <div class="mb-4">
              <NuxtLink :to="`/blog/${post.slug}`" class="text-xl font-semibold hover:text-blue-600">
                {{ post.title }}
              </NuxtLink>
            </div>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <NuxtLink :to="`/blog/${post.slug}`" class="text-blue-600 hover:underline">
              Read More
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="mt-8 text-center">
        <NuxtLink to="/blog" class="text-blue-600 hover:underline font-medium">
          See more posts &rarr;
        </NuxtLink>
      </div>
    </div>
  </section>
</template>


<script setup>
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blogStore'

const blogStore = useBlogStore()
const recentPosts = computed(() => blogStore.getRecentPosts(3))

onMounted(() => {
  blogStore.fetchBlogPosts()
})
</script>