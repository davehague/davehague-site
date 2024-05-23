<template>
  <div class="content">
    <site-header />
    <main>
      <section id="promptblocks">
        <h1>Who is Dave?</h1>
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
