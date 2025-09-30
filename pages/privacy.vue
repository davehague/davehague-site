<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8">Privacy Policy</h1>

    <div class="prose prose-lg max-w-none">
      <p class="text-gray-600 mb-6">Last updated: {{ currentDate }}</p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Information Collection</h2>
        <p>When you contact me through the contact form, I collect your name, email address, and any message content you provide. This information is used solely to respond to your inquiry.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. Blog Subscriptions</h2>
        <p>If you subscribe to blog updates, I collect your email address to send you notifications about new posts. You can unsubscribe at any time.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Analytics</h2>
        <p>This website uses Vercel Analytics to collect anonymous usage data to help improve the site. This data does not personally identify you.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Cookies</h2>
        <p>This website uses minimal cookies for essential functionality only. No tracking cookies are used.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Data Storage</h2>
        <p>Your data is stored securely using Supabase and is never shared with third parties except as necessary to provide the services you request (e.g., email delivery services).</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Your Rights</h2>
        <p>You have the right to request access to, correction of, or deletion of your personal data. Contact me at the email address provided on the contact page.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">7. Changes to Privacy Policy</h2>
        <p>I may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">8. Contact</h2>
        <p>If you have questions about this privacy policy, please contact me through the contact form on this website.</p>
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
  title: 'Privacy Policy - Dave Hague',
  meta: [
    { name: 'description', content: 'Privacy Policy for davehague.com' }
  ]
});
</script>