<template>
  <div class="flex-grow flex items-start justify-center py-12">
    <div v-if="post" class="container mx-auto p-6 max-w-3xl">
      <h1 class="text-4xl font-bold mb-6">{{ post.title }}</h1>
      <div class="prose lg:prose-xl" v-html="renderedContent"></div>
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