<template>
  <div class="content">
    <site-header />
    <main>
      <section id="home">
        <h1>Welcome to My Personal Site</h1>
        <p>This site features my blog, projects, and more about me.</p>
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
