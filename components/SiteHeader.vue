<template>
  <header>
    <nav>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/blog">Blog</nuxt-link></li>
        <li class="dropdown">
          <a href="#" class="dropbtn">Projects</a>
          <div class="dropdown-content">
            <nuxt-link to="/projects/promptblocks">PromptBlocks</nuxt-link>
            <nuxt-link to="/projects/jobscraper">JobScraper</nuxt-link>
            <nuxt-link to="/projects/podcast">The AI Daily Longread Podcast</nuxt-link>
            <nuxt-link to="/projects/experiments">Other Experiments</nuxt-link>
          </div>
        </li>
        <li><nuxt-link to="/about">About Me</nuxt-link></li>
        <li><nuxt-link to="/stats">Stats</nuxt-link></li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SiteHeader'
})
</script>

<style scoped>
header {
  background-color: #333;
  color: #fff;
  padding: 1rem;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
}

nav a {
  color: #fff;
  text-decoration: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #333;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #575757;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
