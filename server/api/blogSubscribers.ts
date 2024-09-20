import { defineEventHandler, readBody, getQuery, createError } from "h3";
import { supabase } from "~/utils/supabaseClient";
import { BlogSubscribers } from "~/types/interfaces";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === "POST") {
    const body = await readBody(event);
    const { email } = body;

    const { data, error } = await supabase
      .from("blog_subscribers")
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      // Check if the error is due to a duplicate email
      if (error.code === '23505') {
        return { success: false, message: "This email is already subscribed." };
      }
      
      console.error("Error adding subscriber:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Error adding subscriber",
      });
    }

    // Send confirmation email
    await $fetch("/api/sendEmail", {
      method: "POST",
      body: JSON.stringify({ email, action: "subscribe" }),
    });

    return { success: true, message: "Successfully subscribed!", data };
  } else if (method === "DELETE") {
    const query = getQuery(event);
    const email = query.email as string;

    const { error } = await supabase
      .from("blog_subscribers")
      .delete()
      .eq("email", email);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error removing subscriber",
      });
    }

    return { success: true, message: "Subscriber removed successfully" };
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }
});