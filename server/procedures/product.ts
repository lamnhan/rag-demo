import { z } from 'zod';

import type { Product } from '../../shared/types.js';
import openaiClient from '../openai.js';
import { useDBOnce } from '../surreal.js';
import { publicProcedure } from '../trpc.js';

const LLM_TEMPERATURE = 0.5;

function createPromptWithContext(userMessage: string, products: Product[]) {
  const userMessageBlock = `
<user-message>
  ${userMessage}
</user-message>
  `;

  const productsBlock = products
    .map(
      (product, index) => `
<product-${index + 1}>

  Title: ${product.title}

  Description: ${product.description}

  URL: ${product.url}

</product-${index + 1}>
  `,
    )
    .join('\n\n');

  return `
You are a shopping assistant tasked with introducing the products to the user, try the best you can to make the user buy the products.

User tells us what they want, our retrieval system will look for the most relevant products.

Only reply with the user message and the products provided. If no product is provided (no <product-1> block found), reply with a short message and some suggestions, the message and suggestions should be concise, and should be in the same language as the user message.

Try not to use any prior knowledge that you have been trained on, but if you have to, use it to provide a better response.

Don't just list the products boringly, try to be creative, funny, caring and provide a response that is engaging and interesting.

Please provide your response in standard Markdown format.

${userMessageBlock}

<products>
  ${productsBlock}
</products>
  `;
}

async function convertUserMessageToEmbedding(input: string) {
  const response = await openaiClient.embeddings.create({
    model: 'text-embedding-3-small',
    input,
  });
  return response.data[0].embedding;
}

async function fetchAIResponse(input: string, model: string) {
  const response = await openaiClient.responses.create({
    model,
    input,
    temperature: LLM_TEMPERATURE,
  });
  return response.output_text;
}

async function getResponseAndProducts(userMessage: string) {
  const userMessageEmbedding = await convertUserMessageToEmbedding(userMessage);
  const products = (
    await useDBOnce((db) =>
      db.query('RETURN fn::search_for_products($userMessageEmbedding);', {
        userMessageEmbedding,
      }),
    )
  )[0] as Product[];
  const prompt = createPromptWithContext(userMessage, products);
  const response = await fetchAIResponse(prompt, 'gpt-4o-mini');
  return { products, response };
}

export default {
  getResponseAndProducts: publicProcedure
    .input(z.object({ userMessage: z.string().min(1) }))
    .query(({ input }) => getResponseAndProducts(input.userMessage)),
};
