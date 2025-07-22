import { getSnippetPrompt } from './prompts/snippet';
import { DEFAULT_MODEL } from './models';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI客户端实例
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Generative AI客户端实例
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 统一生成函数，支持多种提供商和选项
export async function generateCode(
  prompt: string,
  options: {
    provider?: 'gemini' | 'openai' | 'anthropic' | 'auto';
    model?: string;
    temperature?: number;
    stream?: boolean;
    language?: 'zh' | 'en';
    framework?: 'react' | 'vue' | 'angular' | 'svelte';
    cssFramework?: 'tailwind' | 'emotion' | 'styled-components' | 'none';
    level?: 'basic' | 'advanced';
    systemPrompt?: string;
  } = {},
): Promise<string | ReadableStream> {
  const {
    provider = process.env.DEFAULT_AI_PROVIDER || 'gemini',
    model,
    temperature = 0.7,
    stream = false,
    language = 'zh',
    framework = 'react',
    cssFramework = 'tailwind',
    level = 'basic',
    systemPrompt,
  } = options;

  // 获取完整的提示词
  const finalPrompt = getSnippetPrompt(prompt, {
    language,
    framework,
    cssFramework,
    level,
    provider: provider as 'gemini' | 'openai' | 'anthropic',
  });

  // 如果有系统提示词，添加到finalPrompt
  const promptWithSystem = systemPrompt ? `${systemPrompt}\n\n${finalPrompt}` : finalPrompt;

  try {
    // 根据提供商选择不同的实现
    switch (provider) {
      case 'gemini': {
        return generateFromGemini(promptWithSystem, model, stream);
        // return generateFromOpenAI1(promptWithSystem);
      }

      case 'openai': {
        return generateFromOpenAI(promptWithSystem, model, temperature, stream);
      }

      case 'auto':
      default: {
        // 先尝试使用Gemini（默认）
        try {
          return await generateFromGemini(promptWithSystem, model, stream);
        } catch (error) {
          console.warn('Gemini API错误，回退到OpenAI:', error);
          // 如果Gemini失败，尝试回退到OpenAI
          return generateFromOpenAI(promptWithSystem, model, temperature, stream);
        }
      }
    }
  } catch (error) {
    console.error('AI生成错误:', error);
    throw error;
  }
}

// 使用OpenAI生成代码
export async function generateFromOpenAI(
  prompt: string,
  model = 'gpt-3.5-turbo',
  temperature = 0.7,
  stream = false,
): Promise<string | ReadableStream> {
  try {
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      stream,
    });

    // 处理流式响应
    if (stream) {
      // 将OpenAI流式响应转换为标准ReadableStream
      return (response as any).pipe();
    }

    // 返回非流式响应
    return (response as any).choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// 使用Gemini生成代码
export async function generateFromGemini(
  prompt: string,
  model = 'gemini-2.0-flash',
  stream = false,
): Promise<string | ReadableStream> {
  try {
    const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash' });

    if (stream) {
      // 创建流式生成
      const result = await geminiModel.generateContentStream(prompt);

      // 转换为可读流
      return new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(text);
          }
          controller.close();
        },
      });
    } else {
      // 非流式生成
      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
