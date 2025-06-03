import { NextResponse } from 'next/server';
import { generateFromGemini, generateFromOpenAI } from '@/lib/ai/generate';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }
    const result = await generateFromOpenAI(prompt);
    // const result = await generateFromGemini(prompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('route error:', error);

    return NextResponse.json({ error: 'OpenAI 请求失败' }, { status: 500 });
  }
}
