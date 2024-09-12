import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabaseClient'

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  is_draft: boolean;
}

export const useBlogStore = defineStore('blog', () => {
  const blogPosts = ref<BlogPost[]>([])
  const loading = ref(false)
  const lastFetchTime = ref<number | null>(null)
  const fetchInterval = 5 * 60 * 1000 // 5 minutes in milliseconds

  const publishedPosts = computed(() => blogPosts.value.filter(post => !post.is_draft))
  const draftPosts = computed(() => blogPosts.value.filter(post => post.is_draft))
  const allSlugs = computed(() => blogPosts.value.map(post => post.slug))
  const publishedSlugs = computed(() => publishedPosts.value.map(post => post.slug))

  async function fetchBlogPosts(forceRefresh = false, includeDrafts = false) {
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
      let query = supabase
        .from('blogs')
        .select('id, title, slug, excerpt, content, created_at, updated_at, is_draft')
        .order('created_at', { ascending: false })

      if (!includeDrafts) {
        query = query.eq('is_draft', false)
      }

      const { data, error } = await query

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
    return !allSlugs.value.includes(slug)
  }

  function getPostBySlug(slug: string, includeDrafts = false): BlogPost | undefined {
    return includeDrafts
      ? blogPosts.value.find(post => post.slug === slug)
      : publishedPosts.value.find(post => post.slug === slug)
  }

  function getRecentPosts(count: number = 6): BlogPost[] {
    return publishedPosts.value.slice(0, count)
  }

  function searchPosts(query: string, includeDrafts = false): BlogPost[] {
    const lowercaseQuery = query.toLowerCase()
    const postsToSearch = includeDrafts ? blogPosts.value : publishedPosts.value
    return postsToSearch.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) || 
      post.content.toLowerCase().includes(lowercaseQuery)
    )
  }

  return { 
    blogPosts,
    publishedPosts,
    draftPosts,
    loading, 
    allSlugs,
    publishedSlugs,
    fetchBlogPosts, 
    isSlugUnique, 
    getPostBySlug, 
    getRecentPosts, 
    searchPosts 
  }
})