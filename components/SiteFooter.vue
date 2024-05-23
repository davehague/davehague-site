<template>
  <footer>
    <p>&copy; 2024 David Hague</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SiteFooter'
})
</script>

<style scoped>
footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 1rem;
  width: 100%;
  margin-top: auto;
}
</style>
