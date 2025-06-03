import { getSnippetPrompt } from './prompts/snippet';
import { DEFAULT_MODEL } from './models';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export async function generateFromOpenAI(prompt: string) {
  try {
    const finalPrompt = getSnippetPrompt(prompt);
    console.log(finalPrompt, process.env.GEMINI_API_KEY, 1, 'finalPrompt');
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'user',
          content: finalPrompt,
        },
      ],
    });
    console.log(completion, completion?.choices, 'completion');
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI API error:', error);
    throw error;
  }
}

const geminiai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateFromGemini(prompt: string) {
  try {
    const finalPrompt = getSnippetPrompt(prompt);

    const response = await geminiai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: finalPrompt,
    });
    console.log(response.text, 'response');
    return response.text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
