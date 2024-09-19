<template>
  <section id="projects" class="py-20 bg-gray-100">
    <div class="container mx-auto px-6">
      <h2 class="text-4xl font-bold mb-12 text-gray-900 text-center">Projects</h2>

      <div class="space-y-16">
        <div v-for="(projectGroup, index) in projectGroups" :key="index" class="bg-white rounded-lg shadow-lg p-8">
          <h3 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{{ projectGroup.title }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="project in projectGroup.projects" :key="project.id"
              class="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105">
              <component :is="project.icon" class="w-full h-32 object-cover text-gray-400 p-4" />
              <div class="p-6">
                <h4 class="text-xl font-semibold mb-2 text-gray-900">{{ project.name }}</h4>
                <p class="text-gray-600 mb-4">{{ project.description }}</p>
              </div>
              <div class="px-6 pb-4">
                <div class="text-xs text-gray-500 mb-1 italic">
                  <span v-if="project.techLanguages">{{ project.techLanguages }}</span>
                  <span v-if="project.techFrameworks">, {{ project.techFrameworks }}</span>
                  <span v-if="project.techServices">, {{ project.techServices }}</span>
                </div>
              </div>
              <div class="py-4 px-6">
                <p v-if="project.link && !project.link.includes('http')" class="text-sm text-gray-400 italic">
                  {{ project.link }}
                </p>
                <a v-else-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import {
  Coins, TrainFrontTunnel, Binoculars, Blocks, Clock8,
  ScanEye, Soup, PencilRuler, NotebookPen, PhoneIncoming, SquareCheckBig, Keyboard
} from 'lucide-vue-next'

const shippedProjects = [
  {
    id: 1,
    name: 'JobScout',
    description: 'Get job postings that match your skills, experience, and preferences and take the guesswork out of your job search.',
    icon: Binoculars,
    techLanguages: 'Typescript, Python',
    techFrameworks: 'VueJS, NuxtJS',
    techServices: 'Supabase, LLMs, GCP Cloud Functions, Mailjet, Vercel',
    link: 'https://jobs.timetovalue.org/',
  },
  {
    id: 2,
    name: 'PromptBlocks',
    description: 'A prompt library that enabled you to compose, share, tag, and parameterize your LLM prompts.',
    techLanguages: 'Typescript',
    techFrameworks: 'VueJS, NuxtJS',
    techServices: 'Supabase, LLMs, Mailjet, Vercel',
    icon: Blocks,
    link: 'https://promptblocks.app/',
  },
]

const emergingProjects = [
  {
    id: 3,
    name: 'Commission Controls',
    description: 'Track and reconcile insurance commissions with your book of business.',
    icon: Coins,
    techLanguages: 'Typescript, Python',
    techFrameworks: 'VueJS, NuxtJS, FastAPI',
    techServices: 'Postgres',
    link: 'Link coming soon',
  },
  {
    id: 4,
    name: 'Prompt Central Station',
    description: 'Decouple prompt management from application code. Enable non-technical users to modify prompts and parameters without code changes.',
    icon: TrainFrontTunnel,
    techLanguages: 'Python',
    link: 'https://github.com/davehague/prompt-central-station/',
  },
  {
    id: 5,
    name: 'Motes',
    description: 'Write your entire life autobiography, one tweet at a time',
    icon: NotebookPen,
    techLanguages: 'Typescript',
    techFrameworks: 'VueJS, NuxtJS',
    techServices: 'Firebase',
    link: 'https://timeline.davehague.com',
  },
]

const experiments = [
  {
    id: 6,
    name: 'Pickleball Watcher',
    description: 'Never get locked out, get daily emails when new sessions are posted.',
    icon: ScanEye,
    techLanguages: 'Python',
    techServices: 'Mailjet',
    link: 'Link coming soon',
  },
  {
    id: 7,
    name: 'The Yoosz',
    description: 'The usual order from the usual places, shared with the usual people.',
    icon: Soup,
    techLanguages: 'Typescript',
    techFrameworks: 'VueJS, NuxtJS',
    techServices: 'Supabase',
    link: 'Link coming soon',
  },
  // {
  //   id: 3,
  //   name: 'Home Maintenance Tracker',
  //   description: 'Stay on top of your home maintenance tasks and projects.',
  //   icon: PencilRuler,
  //   techLanguages: 'TBD',
  //   link: 'Link coming soon',
  // },
  {
    id: 8,
    name: 'Caller Coach',
    description: 'Get a call from AI to keep you on track with your goals.',
    icon: PhoneIncoming,
    techLanguages: 'Python',
    link: 'Link coming soon', //'https://github.com/davehague/caller_coach',
  },
  {
    id: 9,
    name: 'Task Prioritizer',
    description: 'Compare tasks that you are considering to find your next top task.',
    icon: SquareCheckBig,
    techLanguages: 'Typescript',
    techFrameworks: 'ReactJS, NextJS',
    link: 'https://tasks.davehague.com/',
  },
  {
    id: 10,
    name: 'LLM Desktop',
    description: 'Hotkey to your favorite LLM models.',
    icon: Keyboard,
    techLanguages: 'Typescript',
    techFrameworks: 'Electron',
    link: 'https://github.com/davehague/llm-wrapper-electron',
  },
]

const projectGroups = ref([
  { title: 'Shipped', projects: shippedProjects },
  { title: 'Emerging', projects: emergingProjects },
  { title: 'Experiments', projects: experiments },
])
</script>