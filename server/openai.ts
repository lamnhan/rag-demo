import { OpenAI } from 'openai';

import config from './config.js';

const openaiClient = new OpenAI({
  apiKey: config.openaiApiKey,
});

export default openaiClient;
