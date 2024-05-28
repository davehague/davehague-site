<template>
  <div class="content">
    <site-header />
    <main>
      <section>
        <h1>Other Little Experiments</h1>
        <ul>
          <li><a href="/experiments/prompts/index.html">Prompting Library</a></li>
          <li><a href="https://tasks.davehague.com/">Task Prioritizer</a></li>
          <li><a href="/experiments/github-stats/index.html">Github Stats</a></li>
          <li><a href="#">Chase Offers Script</a></li>
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
