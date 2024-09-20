import { defineEventHandler, readBody } from "h3";
import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

const sendContactFormEmail = async (
  name: string,
  email: string,
  message: string
) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "dave@promptblocks.app",
          Name: "David Hague",
        },
        To: [
          {
            Email: "david.hague@gmail.com",
            Name: "David Hague",
          },
        ],
        Subject: "New Contact Form Submission",
        HTMLPart: `
                    <h3>New contact form submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message}</p>
                `,
      },
    ],
  });
};

const sendSubscriptionConfirmation = async (email: string) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "dave@promptblocks.app",
          Name: "David Hague",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Subscription Confirmation for Dave Hague's Blog",
        HTMLPart: `<h3>Thanks for subscribing to the blog at davehague.com!</h3>
            <p>Hey, David here. Thanks for wanting to keep up to date with everything I'm doing.  If you ever want to chat, just reply to this email.  Looking forward to sharing my journey with you!</p>
            <br />
            <p style="font-size: smaller; font-style: italic;">If you didn't intend to subscribe, you can unsubscribe by clicking <a href="https://davehague.com/blog/unsubscribe?email=${email}">here</a>.</p>
            `,
      },
    ],
  });
};

const sendUnsubscribeConfirmation = async (email: string) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "dave@promptblocks.app",
          Name: "David Hague",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: "Unsubscribe Confirmation",
        HTMLPart: `
                    <h3>You've been unsubscribed</h3>
                    <p>We're sorry to see you go. You've been successfully unsubscribed from our blog updates.</p>
                    <p>If you change your mind, you can always subscribe again on our blog page.</p>
                `,
      },
    ],
  });
};

const sendNewBlogPosted = async (
  email: string,
  title: string,
  excerpt: string,
  slug: string
) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "dave@promptblocks.app",
          Name: "David Hague",
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: `New Blog Post: ${title}`,
        HTMLPart: `
            <p>A new blog post has been published on davehague.com!</p>
            <h2>${title}</h2>
            <p>${excerpt}</p>
            <p><a href="https://davehague.com/blog/${slug}">Read the full post here</a></p>
            <br />
            <p style="font-size: smaller; font-style: italic;">If you no longer wish to receive these updates, you can unsubscribe by clicking <a href="https://davehague.com/blog/unsubscribe?email=${email}">here</a>.</p>
          `,
      },
    ],
  });
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, message, action, title, excerpt, slug } = body;

  try {
    if (action === "contact") {
      await sendContactFormEmail(name, email, message);
    } else if (action === "subscribe") {
      await sendSubscriptionConfirmation(email);
    } else if (action === "unsubscribe") {
      await sendUnsubscribeConfirmation(email);
    } else if (action === "newBlogPost") {
      await sendNewBlogPosted(email, title, excerpt, slug);
    } else {
      throw new Error("Invalid action");
    }

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error(
      "Failed to send email with error:",
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
