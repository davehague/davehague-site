<template>
  <div class="content">
    <site-header />
    <main>
      <section id="blog">
        <h1>Dave's Blog</h1>
        <div id="blog-posts">
          <div v-for="post in blogPosts" :key="post.title" class="blog-post">
            <h2>{{ post.title }}</h2>
            <div class="content" v-html="post.contentHtml"></div>
          </div>
        </div>
      </section>
    </main>
    <site-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { marked } from 'marked'

interface BlogPost {
  title: string
  date: string
  url: string
  content: string,
  contentHtml: string
}

export default defineComponent({
  components: {
    SiteHeader,
    SiteFooter
  },
  setup() {
    const blogPosts = ref<BlogPost[]>([]);

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const postData = await response.json();

        if (postData) {
          for (const post of postData) {
            post.contentHtml = await marked(post.content);;
            blogPosts.value.push(post);
          }
        }
      } catch (error) {
        console.error('Failed to load post:', error);
      }
    };

    onMounted(fetchPosts);

    return {
      blogPosts
    };
  }
})
</script>

<style scoped>
.blog-post {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
