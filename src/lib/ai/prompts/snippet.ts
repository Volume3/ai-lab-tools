// 增强现有提示词生成函数
export function getSnippetPrompt(
  userInput: string,
  options: {
    language?: 'zh' | 'en';
    framework?: 'react' | 'vue' | 'angular' | 'svelte';
    cssFramework?: 'tailwind' | 'emotion' | 'styled-components' | 'none';
    level?: 'basic' | 'advanced';
    extraContext?: string;
    provider?: 'gemini' | 'openai' | 'anthropic';
  } = {},
) {
  const {
    language = 'zh',
    framework = 'react',
    cssFramework = 'tailwind',
    level = 'basic',
    extraContext = '',
    provider = 'gemini',
  } = options;

  // 基础提示词
  const basePrompt =
    language === 'zh'
      ? `请帮我生成高质量的${framework}代码，需求如下：${userInput}`
      : `Please generate high-quality ${framework} code for the following requirement: ${userInput}`;

  // 根据框架添加特定指导
  const frameworkGuidance = getFrameworkGuidance(framework, cssFramework, language);

  // 添加额外上下文
  const contextInfo = extraContext
    ? language === 'zh'
      ? `\n\n上下文信息：${extraContext}`
      : `\n\nContext information: ${extraContext}`
    : '';

  // 高级提示词包含更多细节要求
  const detailRequirements = level === 'advanced' ? getDetailRequirements(language) : '';

  // 为Gemini添加额外的上下文提示，帮助它更好地理解和执行代码生成任务
  const providerSpecificPrompt =
    provider === 'gemini'
      ? language === 'zh'
        ? '\n\n注意：请直接生成完整代码，不需要解释，不要使用markdown代码块，直接输出完整可运行的代码。'
        : "\n\nNote: Please generate complete code directly without explanations, don't use markdown code blocks, output the complete runnable code directly."
      : '';

  return `${basePrompt}${frameworkGuidance}${contextInfo}${detailRequirements}${providerSpecificPrompt}`;
}

// 各框架特定指导
function getFrameworkGuidance(framework: string, cssFramework: string, language: string) {
  const isZh = language === 'zh';

  switch (framework) {
    case 'react':
      return isZh
        ? `\n\n请使用React ${
            cssFramework === 'tailwind' ? '和Tailwind CSS ' : ''
          }语法，确保代码简洁可读，支持TypeScript类型。`
        : `\n\nPlease use React ${
            cssFramework === 'tailwind' ? 'with Tailwind CSS ' : ''
          }syntax, ensure the code is clean and readable, with TypeScript support.`;

    case 'vue':
      return isZh
        ? `\n\n请使用Vue ${
            cssFramework === 'tailwind' ? '和Tailwind CSS ' : ''
          }语法，优先使用组合式API (Composition API)，支持TypeScript类型。`
        : `\n\nPlease use Vue ${
            cssFramework === 'tailwind' ? 'with Tailwind CSS ' : ''
          }syntax, prioritize Composition API, with TypeScript support.`;

    case 'angular':
      return isZh
        ? '\n\n请使用Angular语法，确保遵循Angular最佳实践，包括适当的模块组织和依赖注入。'
        : '\n\nPlease use Angular syntax, ensuring you follow Angular best practices, including proper module organization and dependency injection.';

    case 'svelte':
      return isZh
        ? `\n\n请使用Svelte ${
            cssFramework === 'tailwind' ? '和Tailwind CSS ' : ''
          }语法，利用Svelte的反应性系统，确保代码简洁高效。`
        : `\n\nPlease use Svelte ${
            cssFramework === 'tailwind' ? 'with Tailwind CSS ' : ''
          }syntax, leveraging Svelte's reactivity system, ensuring the code is concise and efficient.`;

    default:
      return isZh
        ? '\n\n请生成简洁、高效、可维护的代码。'
        : '\n\nPlease generate concise, efficient, and maintainable code.';
  }
}

// 高级要求
function getDetailRequirements(language: string) {
  return language === 'zh'
    ? `\n\n请确保代码：
       1. 类型安全，使用TypeScript
       2. 组件可复用，props接口设计合理
       3. 注重性能优化
       4. 遵循最新的编码规范和最佳实践
       5. 提供简要的使用说明`
    : `\n\nPlease ensure the code is:
       1. Type-safe with TypeScript
       2. Reusable with well-designed props interface
       3. Performance optimized
       4. Following the latest coding standards and best practices
       5. Provided with brief usage instructions`;
}
