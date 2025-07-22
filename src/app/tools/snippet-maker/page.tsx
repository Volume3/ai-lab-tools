'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, ConfigProvider, theme as antTheme } from 'antd';
import { PromptInput, CodeDisplay, SettingsPanel } from '@/components/CodeStudio';
import type { HistoryItem } from '@/components/CodeStudio';
import { GenerationOptions } from '@/types/codeStudio';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function CodeStudioPage() {
  // 基础状态管理
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 使用本地存储钩子管理选项和历史记录
  const [options, setOptions] = useLocalStorage<GenerationOptions>('code-studio-options', {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    language: 'zh',
    framework: 'react',
    cssFramework: 'tailwind',
    level: 'basic',
    theme: 'light',
    showLineNumbers: true,
  });

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('code-history', []);

  // 主题状态
  const [darkMode, setDarkMode] = useState(options.theme === 'dark');

  // 更新主题
  useEffect(() => {
    setDarkMode(options.theme === 'dark');
  }, [options.theme]);

  // 提交表单，生成代码
  const handleGenerate = async (promptText: string, genOptions: GenerationOptions) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          ...genOptions,
          stream: false, // 先使用非流式API，后续添加流式支持
        }),
      });

      if (!res.ok) {
        let errorMsg = '接口请求失败';
        try {
          const errorData = await res.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch {}
        setError(errorMsg);
        setResult('');
        return;
      }

      const data = await res.json();
      setResult(data.result);

      // 添加到历史记录
      const newHistoryItem: HistoryItem = {
        prompt: promptText,
        result: data.result,
        timestamp: Date.now(),
        options: { ...genOptions },
      };

      setHistory([newHistoryItem, ...history.slice(0, 19)]);
    } catch (err) {
      console.error(err, 'handleGenerate');
      setError('生成失败');
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  // 处理历史记录项选择
  const handleHistorySelect = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setResult(item.result);
    setOptions(item.options);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      <div className="container mx-auto p-4">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">代码工作室</h1>
        </header>

        <Tabs
          defaultActiveKey="editor"
          items={[
            {
              key: 'editor',
              label: '代码生成',
              children: (
                <div className="space-y-4">
                  <PromptInput
                    initialValue={prompt}
                    onChange={setPrompt}
                    onSubmit={handleGenerate}
                    onHistorySelect={handleHistorySelect}
                    options={options}
                    onOptionsChange={setOptions}
                  />

                  {error && (
                    <div className="p-4 border border-red-300 rounded bg-red-50 text-red-700">
                      {error}
                    </div>
                  )}

                  {result && (
                    <CodeDisplay
                      code={result}
                      theme={darkMode ? 'dark' : 'light'}
                      showLineNumbers={options.showLineNumbers}
                    />
                  )}
                </div>
              ),
            },
            {
              key: 'history',
              label: '历史记录',
              children: (
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">暂无历史记录</div>
                  ) : (
                    history.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleHistorySelect(item)}
                      >
                        <div className="flex justify-between mb-2">
                          <div className="font-medium truncate max-w-lg">{item.prompt}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs truncate">
                          {item.result.substring(0, 100)}...
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ),
            },
            {
              key: 'settings',
              label: '设置',
              children: (
                <SettingsPanel
                  options={options}
                  onChange={setOptions}
                  theme={darkMode ? 'dark' : 'light'}
                />
              ),
            },
          ]}
        />
      </div>
    </ConfigProvider>
  );
}
