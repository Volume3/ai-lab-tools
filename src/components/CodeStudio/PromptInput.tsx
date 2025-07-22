'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Switch, Collapse, Space, Typography } from 'antd';
import { HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { GenerationOptions } from '@/types/codeStudio';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Text } = Typography;

interface PromptInputProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (prompt: string, options: GenerationOptions) => void;
  onHistorySelect?: (item: HistoryItem) => void;
  options?: GenerationOptions;
  onOptionsChange?: (options: GenerationOptions) => void;
}

export interface HistoryItem {
  prompt: string;
  result: string;
  timestamp: number;
  options: GenerationOptions;
}

export default function PromptInput({
  initialValue = '',
  onChange,
  onSubmit,
  onHistorySelect,
  options = {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    language: 'zh',
    framework: 'react',
    cssFramework: 'tailwind',
    level: 'basic',
  },
  onOptionsChange,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialValue);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 加载本地存储的历史记录
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('code-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('加载历史记录失败', error);
    }
  }, []);

  // 处理提交
  const handleSubmit = () => {
    if (onSubmit && prompt.trim()) {
      onSubmit(prompt, options);
    }
  };

  // 处理输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    if (onChange) {
      onChange(value);
    }
  };

  // 处理选项变更
  const handleOptionChange = (key: keyof GenerationOptions, value: any) => {
    const newOptions = { ...options, [key]: value };
    if (onOptionsChange) {
      onOptionsChange(newOptions);
    }
  };

  // 选择历史记录项
  const handleSelectHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    if (onChange) {
      onChange(item.prompt);
    }
    if (onOptionsChange) {
      onOptionsChange(item.options);
    }
    if (onHistorySelect) {
      onHistorySelect(item);
    }
    setShowHistory(false);
  };

  // 格式化时间戳
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="prompt-input-container">
      <TextArea
        value={prompt}
        onChange={handleInputChange}
        placeholder="请输入代码需求描述..."
        autoSize={{ minRows: 4, maxRows: 8 }}
        className="mb-2"
      />

      <div className="flex justify-between items-center mb-4">
        <Space>
          <Button type="primary" onClick={handleSubmit} disabled={!prompt.trim()}>
            生成代码
          </Button>

          <Button
            icon={<SettingOutlined />}
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            type={showAdvancedOptions ? 'default' : 'text'}
          >
            高级选项
          </Button>

          <Button
            icon={<HistoryOutlined />}
            onClick={() => setShowHistory(!showHistory)}
            disabled={history.length === 0}
            type={showHistory ? 'default' : 'text'}
          >
            历史记录
          </Button>
        </Space>
      </div>

      {showAdvancedOptions && (
        <div className="advanced-options border rounded p-4 mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text strong>AI提供商</Text>
              <Select
                value={options.provider}
                onChange={(value) => handleOptionChange('provider', value)}
                style={{ width: '100%' }}
              >
                <Option value="gemini">Gemini (Google)</Option>
                <Option value="openai">OpenAI</Option>
                <Option value="auto">自动 (先尝试Gemini，失败后回退到OpenAI)</Option>
              </Select>
            </div>

            <div>
              <Text strong>语言</Text>
              <Select
                value={options.language}
                onChange={(value) => handleOptionChange('language', value)}
                style={{ width: '100%' }}
              >
                <Option value="zh">中文</Option>
                <Option value="en">English</Option>
              </Select>
            </div>

            <div>
              <Text strong>框架</Text>
              <Select
                value={options.framework}
                onChange={(value) => handleOptionChange('framework', value)}
                style={{ width: '100%' }}
              >
                <Option value="react">React</Option>
                <Option value="vue">Vue</Option>
                <Option value="angular">Angular</Option>
                <Option value="svelte">Svelte</Option>
              </Select>
            </div>

            <div>
              <Text strong>CSS框架</Text>
              <Select
                value={options.cssFramework}
                onChange={(value) => handleOptionChange('cssFramework', value)}
                style={{ width: '100%' }}
              >
                <Option value="tailwind">Tailwind CSS</Option>
                <Option value="emotion">Emotion</Option>
                <Option value="styled-components">Styled Components</Option>
                <Option value="none">无 CSS 框架</Option>
              </Select>
            </div>

            <div>
              <Text strong>复杂度</Text>
              <Select
                value={options.level}
                onChange={(value) => handleOptionChange('level', value)}
                style={{ width: '100%' }}
              >
                <Option value="basic">基础</Option>
                <Option value="advanced">高级（更多代码质量要求）</Option>
              </Select>
            </div>

            <div>
              <Text strong>温度 (创造性)</Text>
              <div className="flex items-center">
                <Text type="secondary">精确 0</Text>
                <Select
                  value={options.temperature}
                  onChange={(value) => handleOptionChange('temperature', value)}
                  style={{ width: '100%', margin: '0 8px' }}
                >
                  {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => (
                    <Option key={t} value={t}>
                      {t}
                    </Option>
                  ))}
                </Select>
                <Text type="secondary">创造 1</Text>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="history-list border rounded p-4 mb-4 bg-gray-50 max-h-64 overflow-y-auto">
          {history.map((item, index) => (
            <div
              key={index}
              className="history-item p-2 mb-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectHistory(item)}
            >
              <div className="text-sm text-gray-500">{formatTime(item.timestamp)}</div>
              <div className="truncate">{item.prompt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
