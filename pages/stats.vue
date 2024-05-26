<template>
  <div class="content">
    <site-header />
    <main>
      <section id="home">
        <h1>Github Stats</h1>
        <RadarChart />
      </section>
    </main>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import RadarChart from '@/components/RadarChart.vue'

export default defineComponent({
  components: {
    SiteHeader,
    SiteFooter,
    RadarChart
  }
})
</script>
