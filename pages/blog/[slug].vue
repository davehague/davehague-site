<template>
  <!-- Back arrow button -->
  <router-link to="/blog"
    class="absolute top-20 left-8 flex items-center text-blue-500 hover:text-blue-600 font-semibold transition duration-300 ease-in-out">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    All blog posts
  </router-link>

  <div class="flex-grow flex items-start justify-center py-12">
    <div v-if="post" class="container mx-auto p-6 max-w-3xl">
      <h1 class="text-4xl font-bold mb-6">{{ post.title }}</h1>
      <div class="prose lg:prose-xl markdown-content" v-html="renderedContent"></div>
    </div>
    <div v-else class="text-center">
      <p>Loading...</p>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from "@/utils/supabaseClient";
import { marked } from 'marked'
import '../assets/marked.css';

const route = useRoute()
const post = ref(null)

const fetchBlogPost = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', route.params.slug)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
  } else {
    post.value = data
  }
}

const renderedContent = computed(() => {
  return post.value ? marked.parse(post.value.content) : ''
})

fetchBlogPost()
</script>