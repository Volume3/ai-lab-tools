// AI代码生成选项接口
export interface GenerationOptions {
  provider?: 'gemini' | 'openai' | 'anthropic' | 'auto';
  model?: string;
  temperature?: number;
  stream?: boolean;
  language?: 'zh' | 'en';
  framework?: 'react' | 'vue' | 'angular' | 'svelte';
  cssFramework?: 'tailwind' | 'emotion' | 'styled-components' | 'none';
  level?: 'basic' | 'advanced';
  systemPrompt?: string;
  theme?: 'light' | 'dark';
  showLineNumbers?: boolean;
}

// 代码生成结果接口
export interface CodeResult {
  code: string;
  language?: string;
  fileName?: string;
  theme?: 'light' | 'dark';
}

// 历史记录项接口
export interface HistoryItem {
  prompt: string;
  result: string;
  timestamp: number;
  options: GenerationOptions;
}
