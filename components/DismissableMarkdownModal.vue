<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" @click.self="closeModal">
    <div class="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-y-auto relative">
      <button class="absolute top-2 right-2 text-2xl font-bold hover:text-gray-700 focus:outline-none" @click="closeModal">
        &times;
      </button>
      <div v-html="parsedContent" class="markdown-content prose max-w-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps<{
  content: string;
  isVisible: boolean;
}>();


const emit = defineEmits<{
  (e: 'close'): void;
}>();

const parsedContent = computed(() => {
  // Configure marked to use GitHub flavored markdown
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  return marked.parse(props.content);
});

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.markdown-content {
  line-height: 1.6;
  color: #333;
  padding: 20px;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(h4) {
  font-size: 1em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.markdown-content :deep(ul) {
  list-style-type: none;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5em;
  position: relative;
}

.markdown-content :deep(ul > li::before) {
  content: '•';
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
  position: absolute;
}

.markdown-content :deep(ol > li::before) {
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1.5em;
  position: absolute;
  text-align: right;
}

.markdown-content :deep(ol) {
  counter-reset: list-counter;
}

.markdown-content :deep(ol > li) {
  counter-increment: list-counter;
}

.markdown-content :deep(ol > li::before) {
  content: counter(list-counter) ".";
}

.markdown-content :deep(li > p) {
  margin-bottom: 0.5em;
}

.markdown-content :deep(code) {
  font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
  color: #d73a49;  /* A reddish color for code */
}

.markdown-content :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(blockquote) {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-content :deep(th), .markdown-content :deep(td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-content :deep(tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

.markdown-content :deep(hr) {
  border: 0;
  border-top: 1px solid #dfe2e5;
  margin: 24px 0;
}
</style>