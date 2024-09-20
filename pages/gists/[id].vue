<template>
  <div>
    <router-link to="/blog"
      class="absolute top-20 left-8 flex items-center text-blue-500 hover:text-blue-600 font-semibold transition duration-300 ease-in-out">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to gists
    </router-link>

    <div class="flex-grow flex items-start justify-center py-20">
      <div v-if="gist" class="container mx-auto p-6 max-w-3xl">
        <h1 class="text-4xl font-bold mb-2">{{ gist.description || 'Untitled Gist' }}</h1>
        <p class="text-sm italic text-gray-600 mb-6">Updated: {{ formatDate(gist.updated_at) }}</p>
        <div v-for="file in Object.values(gist.files)" :key="file.filename" class="mb-8">
          <div class="prose lg:prose-xl markdown-content" v-html="file.renderedContent"></div>
        </div>
        <a :href="gist.html_url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
          View on GitHub
        </a>
      </div>
      <div v-else class="text-center">
        <p>Gist not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app'
import { marked } from 'marked'
import { formatDate } from '@/utils/date'
import { useGistsStore } from '@/stores/gistsStore'
import type { Gist, GistFile } from '@/types/interfaces'
import '@/assets/marked.css';

const route = useRoute()
const gistsStore = useGistsStore()

const { data: gist } = await useAsyncData<Gist | undefined>('gist', async () => {
  await gistsStore.fetchGists()
  const fetchedGist = gistsStore.getGistById(route.params.id as string)

  if (fetchedGist) {
    // Process each file's content with marked
    const processedFiles: { [key: string]: GistFile & { renderedContent: string } } = {};
    for (const [filename, file] of Object.entries(fetchedGist.files)) {
      processedFiles[filename] = {
        ...file,
        renderedContent: await marked.parse(file.content)
      };
    }

    return {
      ...fetchedGist,
      files: processedFiles
    };
  }

  return undefined;
})

useHead(() => ({
  title: gist.value?.description || 'Untitled Gist',
  meta: [
    { name: 'description', content: `Gist: ${gist.value?.description || 'Untitled'}` },
    { property: 'og:title', content: gist.value?.description || 'Untitled Gist' },
    { property: 'og:description', content: `Gist: ${gist.value?.description || 'Untitled'}` },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://davehague.com/gists/${route.params.id}` },
  ],
}))
</script>