<template>
  <div class="content">
    <site-header />
    <main>
      <section id="home">
        <h1>Why this website?</h1>
        <div v-html="renderedContent"></div>
      </section>
    </main>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { marked } from 'marked';
import SiteHeader from '@/components/SiteHeader.vue';
import SiteFooter from '@/components/SiteFooter.vue';

export default defineComponent({
  components: {
    SiteHeader,
    SiteFooter
  },
  setup() {
    const content = `Oh, ideas. My brain is full of them. There's never enough time to build all of the things I want to see in the world, and they range from websites and mobile apps to physical products, books, gardening hacks, and more. It's challenging to keep them all straight, and even more challenging to keep them prioritized. I even wrote a little [Task Prioritizer](https://www.davehague.com/projects/experiments#tasks) to help me figure out which one to take on next. Historically it's been a challenge to finish those projects and bring them "to market". My commitment to you, dear reader, through this website is to finish those projects, one by one.

In general, I'm following this strategy with my projects:

1. Build things I want to see in the world 
2. Share what I've built with others, solve their problems as well. Give value away for free.
3. If enough people ~~like~~ LOVE it, maybe I'm on to something and that's a sign that it needs more support and dedication.

So, follow along, try one of my solutions if you've got the same problem as me, and give me some feedback ([LinkedIn](https://www.linkedin.com/in/david-hague-developer/) is a good place to find me).`;

    const renderedContent = ref('');

    onMounted(async () => {
      try {
        renderedContent.value = await marked.parse(content);
      } catch (error) {
        console.error('Error parsing markdown content', error);
      }
    });

    return {
      renderedContent
    };
  }
});
</script>
