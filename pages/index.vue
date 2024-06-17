<template>
  <div class="content">
    <site-header />
    <main>
      <section id="home">
        <h2>Just launched! The <a href="https://jobs.davehague.com">The Jobs App</a></h2>
        <img src="/images/jobs-app.gif " width="1200" height="600" alt="The Jobs App" />
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
    const content = `
Job searching sucks! I decided to do something about it. If you're in the job market or know someone who is, I'd love for you to try out my new AI-powered job matching tool!
Hi all, I've been working on something I'm "soft launching" for friends and family today. This project started exactly one month ago today. My brother was looking for a job and I wanted to help him out. So I started building a job aggregator to search for jobs and only show him the most relevant ones according to his resume (using the power of AI with large language models).
My premise and features:
- You've got to apply fast!  It searches for jobs for you three times per day, so when you see them (and get notified via email) you'll be in the first set of candidates for the job.
- Get to the point! I've used AI to standardize all jobs to have the salary listed, a short summary, and a short list of requirements. If you still like the job after that, you can go read the full posting, if you want to dig deeper into the company, their values, their history, etc.  Or just APPLY!
- TL;DR Just tell me if it's good (rate it for me). The app will (very unscientifically) rate the job as a match specifically FOR YOU based on:
     - How you might rate this job on a scale from 1 to 100 for desirability
     - How you might rate this job on a scale from 1 to 100 for experience match
     - How the hiring manager might rate you from 1 to 100 on skills match
     - How the hiring manager might rate you on a scale from 1 to 100 for experience match
     - An overall match score, tailored for your resume and desired job preferences
- Emails!  You can get emailed immediately when new jobs are posted, once a day with a summary of jobs, or not at all (just come try out the site and see if you like it)

You can find all of this at https://jobs.davehague.com/ 

If you find this tool useful or know someone who could benefit from it, please sign up and share it with them. As an early adopter, your feedback is invaluable! I'm eager to hear your ideas for cool features and any pain points you experience while using the app. My goal is to create a product that genuinely helps people find BETTER jobs FASTER. Please reach out with your suggestions and stories via Facebook, Discord (link in the comments), or your preferred method. Together, we can build something amazing!
Thanks, and happy job hunting!


## Why this site?
Oh, ideas. My brain is full of them. There's never enough time to build all of the things I want to see in the world, and they range from websites and mobile apps to physical products, books, gardening hacks, and more. It's challenging to keep them all straight, and even more challenging to keep them prioritized. I even wrote a little [Task Prioritizer](https://www.davehague.com/projects/experiments#tasks) to help me figure out which one to take on next. Historically it's been a challenge to finish those projects and bring them "to market". My commitment to you, dear reader, through this website is to finish those projects, one by one.

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

<style scoped></style>