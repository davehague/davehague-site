<template>
  <section id="projects" class="py-20 bg-gray-100">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold mb-8 text-gray-900">Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="project in projects" :key="project.id"
          class="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
          <img :src="project.image" :alt="project.name" class="w-full h-48 object-cover" />
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-900">{{ project.name }}</h3>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            <a :href="project.link" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const projects = ref([
{
    id: 5,
    name: 'Commission Controls',
    description: 'Track and reconcile insurance commissions with your book of business.',
    image: 'images/commission-control.png?height=300&width=400',
    link: 'https://github.com/davehague/',
  },
  {
    id: 4,
    name: 'Prompt Central Station',
    description: 'Decouple prompt management from application code and enable non-technical users to modify prompts and parameters without code changes.',
    image: 'images/steam_locomotive.png?height=300&width=400',
    link: 'https://github.com/davehague/prompt-central-station/',
  },
  {
    id: 3,
    name: 'JobScout',
    description: 'Get job postings that match your skills, experience, and preferences and take the guesswork out of your job search.',
    image: 'images/jobscout.png?height=300&width=400',
    link: 'https://jobs.timetovalue.org/',
  },
  {
    id: 2,
    name: 'PromptBlocks',
    description: 'A prompt library that allows for composability, shareability, tagging and categorization, and parameterization of prompts.',
    image: 'images/promptblocks.png?height=300&width=400',
    link: 'https://promptblocks.app/',
  },
  {
    id: 1,
    name: 'Task Prioritizer',
    description: 'A task prioritization matrix that allows you to compare tasks that you are considering, comparing them to each other to find your next top task.',
    image: 'images/question.png?height=300&width=400',
    link: 'https://tasks.davehague.com/',
  },
])
</script>