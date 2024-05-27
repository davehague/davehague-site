<template>
  <div class="content">
    <site-header />
    <main>
      <section>
        <h1>Other Little Experiments</h1>
        <ul>
          <li><nuxt-link to="/experiments/prompts/index.html">Prompting Library</nuxt-link></li>
          <li><a href="https://tasks.davehague.com/">Task Prioritizer</a></li>
          <li><nuxt-link to="/experiments/github-stats/index.html">Github Stats</nuxt-link></li>
        </ul>
      </section>
    </main>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

export default defineComponent({
  components: {
    SiteHeader,
    SiteFooter
  }
})
</script>

<style scoped>
/* Add your CSS here */
</style>
