<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8">Terms of Service</h1>

    <div class="prose prose-lg max-w-none">
      <p class="text-gray-600 mb-6">Last updated: {{ currentDate }}</p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. Use License</h2>
        <p>Permission is granted to temporarily view the materials on this website for personal, non-commercial use only. This is the grant of a license, not a transfer of title.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Disclaimer</h2>
        <p>The materials on this website are provided on an 'as is' basis. I make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Limitations</h2>
        <p>In no event shall I or my suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Links</h2>
        <p>I have not reviewed all of the sites linked to from this website and am not responsible for the contents of any such linked site.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Modifications</h2>
        <p>I may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

useHead({
  title: 'Terms of Service - Dave Hague',
  meta: [
    { name: 'description', content: 'Terms of Service for davehague.com' }
  ]
});
</script>