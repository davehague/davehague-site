import OpenAI from "openai";
const openai = new OpenAI();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userMessage = body.message;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0]);

  return completion.choices[0];
});
