export default defineEventHandler(async (event) => {
  let posts = [
    {
      title: "Second Post",
      date: "2024-05-23",
      url: "https://gdyjsqmpybjcsrevmlmq.supabase.co/storage/v1/object/public/blog-posts/2024-05-23-second-post.md?t=2024-05-24T15%3A32%3A43.322Z",
      content: "",
    },
    {
      title: "First Post",
      date: "2024-05-22",
      url: "https://gdyjsqmpybjcsrevmlmq.supabase.co/storage/v1/object/public/blog-posts/2024-05-22-first-post.md?t=2024-05-24T15%3A17%3A51.291Z",
      content: "",
    },
  ];

  async function fetchFile(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }
    const text = await response.text();
    return text;
  }

  try {
    for (let post of posts) {
      const markdownContent = await fetchFile(post.url);
      post.content = markdownContent;
    }
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
});
