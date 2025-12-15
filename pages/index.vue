<template>
  <div>
    <section id="hero"
      class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-300 via-gray-200 to-white">
      <div class="text-center">
        <div class="mb-8">
          <img src="/dave-headshot.png" alt="Dave Hague"
            class="rounded-full w-48 h-48 mx-auto border-4 border-white shadow-lg" />
        </div>
        <h1 class="text-5xl font-bold mb-4 text-black">Dave Hague</h1>
        <p class="text-xl mb-8 text-gray-700">Founder | Developer | AI Enthusiast</p>
      </div>
    </section>

    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold mb-8 text-gray-900">About Me</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p class="text-lg mb-4 text-gray-700">
              I'm a seasoned developer with a passion for building and shipping software that solves real world
              problems. I'm currently focused on building using Python
              and TypeScript, but I'm a former .NET developer, Java developer, integrations consultant, and engineering
              leader. I've seen a lot, but there's always more to learn. I'm passionate about AI and its potential to
              transform industries and improve lives, so if you've got questions about that, let's chat!
            </p>
            <p class="text-lg mt-4 text-gray-700">
              I live in central Ohio with my wife, dog, and daughter, and I love to write software.
              When I'm not coding, you can find me spending time with my family, reading, or playing pickleball.
            </p>
          </div>
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-900">Most Used Technologies</h3>
            <ul class="grid grid-cols-2 gap-2">
              <li v-for="tech in technologies" :key="tech"
                class="bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700">
                {{ tech }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section id="my-work" class="py-20 bg-gray-100">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-8 text-gray-900">My Work @ Time To Value</h2>
        <p class="text-xl mb-4 text-gray-700">
          I help individuals and small businesses use AI
          to do more with less.
        </p>
        <p class="text-lg mb-8 text-gray-700">
          I bring years of software delivery experience to every engagement: clean architecture, proper
          testing, and AI that actually scales.
        </p>
        <a href="https://www.time2value.com/" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 text-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          See My Services
        </a>
      </div>
    </section>

    <BlogSection />

    <section id="contact" class="py-20 bg-gradient-to-b from-white via-gray-200 to-gray-300">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-8 text-gray-900">Get in Touch</h2>
        <p class="text-xl mb-8 text-gray-700">Interested in collaborating or just want to say hi? Feel free to reach
          out!</p>
        <ConnectWithMe />
        <div class="mt-16 flex justify-center space-x-6">
          <a v-for="social in socialLinks" :key="social.name" :href="social.url" target="_blank"
            rel="noopener noreferrer" class="text-gray-600 hover:text-blue-600 transition-colors duration-300">
            <component :is="social.icon" class="h-8 w-8" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { GithubIcon, TwitterIcon, LinkedinIcon } from 'lucide-vue-next'

const technologies = [
  'Vue.js', 'Python', 'Nuxt', 'FastAPI', 'TypeScript', 'LLMs',
  'Supabase', 'Google Cloud Platform', 'Firebase', 'Postgres'
]

const socialLinks = [
  { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/davehague' },
  { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/getdavehague' },
]
</script>