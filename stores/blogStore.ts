import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const slugs = ref<string[]>([])
  const loading = ref(false)

  async function fetchSlugs() {
    loading.value = true
    try {
      const response = await fetch('/api/blog?getSlugs=true')
      if (!response.ok) throw new Error('Failed to fetch slugs')
      slugs.value = await response.json()
    } catch (error) {
      console.error('Error fetching slugs:', error)
    } finally {
      loading.value = false
    }
  }

  function isSlugUnique(slug: string): boolean {
    return !slugs.value.includes(slug)
  }

  return { slugs, loading, fetchSlugs, isSlugUnique }
})
