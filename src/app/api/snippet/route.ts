import { NextResponse } from 'next/server';
import { generateCode } from '@/lib/ai/generate';

export const runtime = 'edge'; // 使用Edge运行时以支持流式响应

export async function POST(req: Request) {
  try {
    const {
      prompt,
      provider = process.env.DEFAULT_AI_PROVIDER || 'gemini',
      model,
      temperature = 0.7,
      stream = true,
      language = 'zh',
      framework = 'react',
      cssFramework = 'tailwind',
      level = 'basic',
      systemPrompt,
    } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: '缺少prompt参数' }, { status: 400 });
    }

    // 调用统一生成函数
    const result = await generateCode(prompt, {
      provider,
      model,
      temperature,
      stream,
      language,
      framework,
      cssFramework,
      level,
      systemPrompt,
    });

    // 如果是流式响应，直接返回ReadableStream
    if (stream && result instanceof ReadableStream) {
      return new Response(result);
    }

    // 否则返回常规JSON响应
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('代码生成错误:', error);

    return NextResponse.json(
      {
        error: error.message || 'AI请求失败',
      },
      { status: 500 },
    );
  }
}
