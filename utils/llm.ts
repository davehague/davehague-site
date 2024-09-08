export const getRandomLLMModel = () => {
  const freeModels = [
    'meta-llama/llama-3.1-8b-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'openchat/openchat-7b:free',
    'huggingfaceh4/zephyr-7b-beta:free',
  ];

  const randomFreeModel = freeModels[Math.floor(Math.random() * freeModels.length)];
  return randomFreeModel;
}