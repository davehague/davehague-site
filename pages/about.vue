<template>
  <div class="content">
    <site-header />
    <main>
      <section>
        <h1>Who is Dave?</h1>
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
    const content = `Hi there. Hey. Hello.  I'm Dave.  Here's a little about me. 

I live in central Ohio with my wife, dog, and toddler, and I love to write software.   When speaking with a career coach I was telling him how I get into a zone when I start writing code and hours can fly by.  "Well, that sounds like your passion", he said.  I had never though about it that way, I just knew that I loved to code.  Funny how you can get slapped upside the head with something so obvious.  So here I am, I code every day and quite honestly it's wonderful to see my ideas come to life.`;

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
