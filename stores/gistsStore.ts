import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Import the Gist interface
import type { Gist } from '@/types/interfaces'

export const useGistsStore = defineStore('gists', () => {
  const gists = ref<Gist[]>([])
  const loading = ref(false)
  const lastFetchTime = ref<number | null>(null)
  const fetchInterval = 12 * 60 * 60 * 1000 // 12 hours ago

  const publicGists = computed(() => gists.value.filter(gist => gist.public))

  async function fetchGists(forceRefresh = false) {
    const now = Date.now()
    if (
      !forceRefresh &&
      gists.value.length > 0 &&
      lastFetchTime.value &&
      now - lastFetchTime.value < fetchInterval
    ) {
      // Data is fresh enough, no need to fetch
      return
    }

    loading.value = true
    try {
      const sinceDate = new Date('2024-01-01').toISOString(); // Adjust this date as needed
      const response = await fetch(`/api/github/gists?since=${sinceDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gists');
      }
      gists.value = await response.json();
      lastFetchTime.value = now
    } catch (error) {
      console.error('Error fetching gists:', error)
    } finally {
      loading.value = false
    }
  }

  function getGistById(id: string): Gist | undefined {
    return gists.value.find(gist => gist.id === id)
  }

  function getRecentGists(count: number = 6): Gist[] {
    return publicGists.value.slice(0, count)
  }

  function searchGists(query: string): Gist[] {
    const lowercaseQuery = query.toLowerCase()
    return gists.value.filter(gist => 
      gist.description?.toLowerCase().includes(lowercaseQuery) ||
      Object.keys(gist.files).some(filename => 
        filename.toLowerCase().includes(lowercaseQuery) ||
        gist.files[filename].language?.toLowerCase().includes(lowercaseQuery)
      )
    )
  }

  return { 
    gists,
    publicGists,
    loading,
    fetchGists,
    getGistById,
    getRecentGists,
    searchGists
  }
})