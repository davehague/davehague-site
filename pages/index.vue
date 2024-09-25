<template>
  <div>
    <section id="hero" class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-300 via-gray-200 to-white">
    <div class="text-center">
      <div class="mb-8">
        <img 
          src="../public/android-chrome-512x512.png" 
          alt="Dave Hague"
          class="rounded-full w-48 h-48 mx-auto border-4 border-white shadow-lg" 
        />
      </div>
      <h1 class="text-5xl font-bold mb-4 text-black">Dave Hague</h1>
      <p class="text-xl mb-8 text-gray-700">Developer | AI Enthusiast</p>
      <a href="#projects"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
          View My Work
        </a>
    </div>
  </section>

    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold mb-8 text-gray-900">About Me</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p class="text-lg mb-4 text-gray-700">
              I'm a seasoned developer with a passion for building and shipping software, currently focused on <span class="font-semibold italic">Python
              and TypeScript.</span>
              As a former .NET developer, Java Delevoper, integrations consultant, and engineering leader I bring a diverse skill set to every project. 
            </p>
            <p class="text-lg text-gray-700">
              Recently, I've embarked on a journey of entrepreneurship, which means I'm <em>working on my shipping muscle 💪</em>
              while I explore the
              exciting world of <span class="font-semibold italic">generative AI</span> and building solutions that solve real problems.
            </p>
            <p class="text-lg mt-4 text-gray-700">
              I live in central Ohio with my wife, dog, and toddler, and I love to write software.
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

    <ProjectsSection />

    <BlogSection />

    <section id="contact" class="py-20 bg-gradient-to-b from-white via-gray-200 to-gray-300">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-8 text-gray-900">Get in Touch</h2>
        <p class="text-xl mb-8 text-gray-700">Interested in collaborating or just want to say hi? Feel free to reach
          out!</p>
        <a href="contact"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
          Send me an email
        </a>
        <div class="mt-8 flex justify-center space-x-6">
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
  'PocketBase', 'Google Cloud Platform', 'Supabase', 'Postgres'
]

const socialLinks = [
  { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/davehague' },
  { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/getdavehague' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/in/david-hague-developer/' },
]
</script>