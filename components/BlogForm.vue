<template>
  <form @submit.prevent="showPasswordModal" class="space-y-4">
    <!-- Form fields-->
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input v-model="title" id="title" type="text" required @input="generateSlug"
        class="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>
    <div>
      <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
      <input v-model="slug" id="slug" type="text" required
        class="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      <p v-if="!isSlugUnique" class="text-sm text-red-500 italic">This slug is already in use.</p>
    </div>
    <div>
      <label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
      <textarea v-model="formData.excerpt" id="excerpt" rows="3"
        class="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
    </div>

    <!-- Content field with preview -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
        <button type="button" @click="togglePreview" class="text-sm text-indigo-600 hover:text-indigo-800">
          {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
        </button>
      </div>
      <div class="flex mt-1 space-x-4">
        <div :class="{ 'w-full': !showPreview, 'w-1/2': showPreview }">
          <textarea v-model="formData.content" id="content" rows="20" required
            class="block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-mono"
            @input="updatePreview"></textarea>
        </div>
        <div v-if="showPreview" class="w-1/2">
          <div v-html="markdownPreview"
            class="markdown-content prose max-w-none p-4 border rounded-md bg-white overflow-auto h-[490px]"></div>
        </div>
      </div>
    </div>

    <!-- Submit and Cancel buttons -->
    <div class="flex gap-2 pt-4">
      <button type="submit"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {{ submitButtonText }}
      </button>
      <button type="button" @click="goToManagePage"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Cancel
      </button>
      <div class="ml-4">
        <label class="flex items-center py-2">
          <input type="checkbox" v-model="formData.is_draft"
            class="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out">
          <span class="ml-2 text-sm text-gray-700">Mark as draft</span>
        </label>
      </div>
    </div>
  </form>

  <!-- Password Modal -->
  <div v-if="isPasswordModalVisible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Enter Admin Password</h2>
      <input v-model="password" type="password" placeholder="Admin Password"
        class="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        @keyup.enter="submitForm">
      <div class="mt-4 flex justify-end space-x-2">
        <button @click="closePasswordModal"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
        <button @click="submitForm"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { marked } from 'marked'
import { type BlogPost } from '~/types/interfaces'
import { useBlogStore } from '~/stores/blogStore'
import '../assets/marked.css';

const router = useRouter()
const blogStore = useBlogStore()

const props = defineProps<{
  initialData?: Partial<BlogPost>
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: Partial<BlogPost> & { password: string }): void
}>()

const markdownPreview = ref('');
const showPreview = ref(false);

const formData = ref<Partial<BlogPost>>({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  is_draft: false,
  ...props.initialData
})

const title = computed({
  get: () => formData.value.title || '',
  set: (value) => {
    formData.value.title = value
    if (!props.isEdit) {
      generateSlug()
    }
  }
})

const slug = computed({
  get: () => formData.value.slug || '',
  set: (value) => formData.value.slug = value
})

const isSlugUnique = computed(() =>
  props.isEdit ? true : blogStore.isSlugUnique(slug.value)
)

function generateSlug() {
  slug.value = title.value.trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

const password = ref('')
const isPasswordModalVisible = ref(false)
const submitButtonText = computed(() => props.isEdit ? 'Update Post' : 'Create Post')

const showPasswordModal = () => {
  if (!isSlugUnique.value) {
    alert('Please choose a unique slug')
    return
  }
  isPasswordModalVisible.value = true
}

const closePasswordModal = () => {
  isPasswordModalVisible.value = false
  password.value = ''
}

const submitForm = () => {
  if (password.value.trim() === '') {
    alert('Please enter the admin password')
    return
  }
  emit('submit', { ...formData.value, password: password.value })
  closePasswordModal()
}

const goToManagePage = () => {
  router.push('/blog/manage')
}

const updatePreview = useDebounceFn(async () => {
  if (showPreview.value) {
    markdownPreview.value = await marked(formData.value.content || '')
  }
}, 300)

const togglePreview = () => {
  showPreview.value = !showPreview.value
  if (showPreview.value) {
    updatePreview()
  }
}

onMounted(async () => {
  blogStore.fetchBlogPosts()
  updatePreview()
})
</script>