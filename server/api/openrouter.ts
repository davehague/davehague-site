// server/api/openRouterChat.ts
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { model, messages, max_tokens} = await readBody(event);
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

  // https://openrouter.ai/docs/models
  const freeModels = [
    'mattshumer/reflection-70b:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'openchat/openchat-7b:free',
    'huggingfaceh4/zephyr-7b-beta:free',
  ];

  try {
    const randomFreeModel = freeModels[Math.floor(Math.random() * freeModels.length)];
    console.log('Using openrouter LLM model:', model || randomFreeModel);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || randomFreeModel,
        messages: messages,
        max_tokens: max_tokens || 300,
      }),
    });

    if (response.status != 200) {
      console.log('Failed to fetch from OpenRouter:', response.statusText);
      throw new Error('Failed to fetch from OpenRouter');
    }

    const responseData = await response.json();
    return {
      success: true,
      message: 'Message generated successfully',
      data: responseData,
    };
  } catch (error) {
    console.error('Error connecting to OpenRouter:', error);
    return {
      success: false,
      message: 'Failed to connect to OpenRouter',
      error: (error as Error).message || 'Unknown error',
    };
  }
});
