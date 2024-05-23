import { defineEventHandler } from "h3";
import { promises as fs } from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    let workingDir = process.cwd() || "";
    console.log("Working directory:", workingDir);
    
    const postsDirectory = path.join("public", "posts");
    console.log("Posts directory:", postsDirectory);

    let files;
    try {
      files = await fs.readdir(postsDirectory);
      console.log("Files:", files);
    } catch (error) {
      console.error("Error reading posts directory:", error);
      throw new Error("Failed to read posts directory");
    }

    const posts = [];

    for (const file of files) {
      const filePath = path.join(postsDirectory, file);
      const content = await fs.readFile(filePath, "utf-8");
      const post = {
        title: file
          .split("-")
          .slice(5)
          .join("-")
          .replace(".md", "")
          .replace(/-/g, " "),
        date: file.split("-").slice(0, 5).join("-"),
        content,
        file: filePath,
      };
      posts.push(post);
    }

    // Sort posts by date in descending order
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
});
