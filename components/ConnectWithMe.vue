<template>
    <div class="flex-grow flex flex-col justify-center items-center space-y-4">
        <a href="https://www.linkedin.com/in/david-hague-developer/" target="_blank"
            class="max-w-xs inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 space-x-2">
            <LinkedinIcon class="w-5 h-5" />
            <span>Connect on LinkedIn</span>
        </a>
        <a href="https://calendly.com/dave-hague" target="_blank"
            class="max-w-xs inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 space-x-2">
            <CalendarIcon class="w-5 h-5" />
            <span>Schedule a chat</span>
        </a>
        <a href="contact"
            class="max-w-xs inline-flex items-center bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 space-x-2">
            <MailIcon class="w-5 h-5" />
            <span>Send me an email</span>
        </a>
    </div>
</template>

<script setup lang="ts">
import { LinkedinIcon, CalendarIcon, MailIcon } from 'lucide-vue-next'
</script>