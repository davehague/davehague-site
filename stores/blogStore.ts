import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabaseClient'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  created_at: string
}

export const useBlogStore = defineStore('blog', () => {
  const blogPosts = ref<BlogPost[]>([])
  const loading = ref(false)
  const lastFetchTime = ref<number | null>(null)
  const fetchInterval = 30 * 60 * 1000 // 30 minutes

  const slugs = computed(() => blogPosts.value.map(post => post.slug))

  async function fetchBlogPosts(forceRefresh = false) {
    const now = Date.now()
    if (
      !forceRefresh &&
      blogPosts.value.length > 0 &&
      lastFetchTime.value &&
      now - lastFetchTime.value < fetchInterval
    ) {
      // Data is fresh enough, no need to fetch
      return
    }

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, content, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      blogPosts.value = data as BlogPost[]
      lastFetchTime.value = now
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      loading.value = false
    }
  }

  function isSlugUnique(slug: string): boolean {
    return !slugs.value.includes(slug)
  }

  function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.value.find(post => post.slug === slug)
  }

  function getRecentPosts(count: number = 6): BlogPost[] {
    return blogPosts.value.slice(0, count)
  }

  function searchPosts(query: string): BlogPost[] {
    const lowercaseQuery = query.toLowerCase()
    return blogPosts.value.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) || 
      post.content.toLowerCase().includes(lowercaseQuery)
    )
  }

  return { 
    blogPosts, 
    loading, 
    slugs, 
    fetchBlogPosts, 
    isSlugUnique, 
    getPostBySlug, 
    getRecentPosts, 
    searchPosts 
  }
})
