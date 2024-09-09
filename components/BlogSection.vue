<template>
  <section id="blog" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold mb-8 text-gray-900">Blog</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in blogPosts" :key="post.id" class="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-900">{{ post.title }}</h3>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <NuxtLink 
              :to="`/blog/${post.slug}`"
              class="text-blue-600 hover:underline"
            >
              Read More
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabaseClient'

const blogPosts = ref([])

const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching blog posts:', error)
  } else {
    blogPosts.value = data
    console.log(data)
  }
}

onMounted(() => {
  fetchBlogPosts()
})
</script>