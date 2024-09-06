// server/plugins/githubDataUpdate.ts

import { defineNitroPlugin } from "nitropack/runtime/plugin";
import { useGithubData } from "~/composables/useGithubData";

export default defineNitroPlugin((nitroApp) => {
  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN is not set in environment variables");
    return;
  }
  startPeriodicUpdate(nitroApp);
});
async function startPeriodicUpdate(nitroApp: any) {
  const { checkAndUpdateGithubData } = useGithubData();

  nitroApp.hooks.hook(
    "onSchedule",
    async (event: any) => {
      console.log("Running scheduled Github data update");
      await checkAndUpdateGithubData();
    },
    { schedule: "0 0 * * *" }
  ); // "every day at midnight"

  // Run the initial update
  await checkAndUpdateGithubData();
}
