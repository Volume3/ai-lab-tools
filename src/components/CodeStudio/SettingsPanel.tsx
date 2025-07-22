'use client';

import React from 'react';
import { Card, Form, Select, Switch, Typography, Divider } from 'antd';
import { GenerationOptions } from '@/types/codeStudio';

const { Option } = Select;
const { Text, Title } = Typography;

interface SettingsPanelProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
  theme?: 'light' | 'dark';
}

export default function SettingsPanel({ options, onChange, theme = 'light' }: SettingsPanelProps) {
  // 处理选项变更
  const handleOptionChange = (key: keyof GenerationOptions, value: any) => {
    const newOptions = { ...options, [key]: value };
    onChange(newOptions);

    // 保存到本地存储
    try {
      localStorage.setItem('code-studio-options', JSON.stringify(newOptions));
    } catch (error) {
      console.error('保存选项失败', error);
    }
  };

  return (
    <Card title="全局设置" className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}>
      <Form layout="vertical">
        <Title level={5}>默认 AI 设置</Title>

        <Form.Item label="默认 AI 提供商">
          <Select
            value={options.provider}
            onChange={(value) => handleOptionChange('provider', value)}
          >
            <Option value="gemini">Gemini (Google)</Option>
            <Option value="openai">OpenAI</Option>
            <Option value="auto">自动 (先尝试Gemini，失败后回退)</Option>
          </Select>
          <Text type="secondary">选择默认使用的AI提供商</Text>
        </Form.Item>

        <Form.Item label="默认语言">
          <Select
            value={options.language}
            onChange={(value) => handleOptionChange('language', value)}
          >
            <Option value="zh">中文</Option>
            <Option value="en">English</Option>
          </Select>
          <Text type="secondary">选择与AI交互的语言</Text>
        </Form.Item>

        <Divider />
        <Title level={5}>默认代码设置</Title>

        <Form.Item label="默认框架">
          <Select
            value={options.framework}
            onChange={(value) => handleOptionChange('framework', value)}
          >
            <Option value="react">React</Option>
            <Option value="vue">Vue</Option>
            <Option value="angular">Angular</Option>
            <Option value="svelte">Svelte</Option>
          </Select>
        </Form.Item>

        <Form.Item label="默认CSS框架">
          <Select
            value={options.cssFramework}
            onChange={(value) => handleOptionChange('cssFramework', value)}
          >
            <Option value="tailwind">Tailwind CSS</Option>
            <Option value="emotion">Emotion</Option>
            <Option value="styled-components">Styled Components</Option>
            <Option value="none">无 CSS 框架</Option>
          </Select>
        </Form.Item>

        <Form.Item label="默认复杂度">
          <Select value={options.level} onChange={(value) => handleOptionChange('level', value)}>
            <Option value="basic">基础</Option>
            <Option value="advanced">高级（更多代码质量要求）</Option>
          </Select>
        </Form.Item>

        <Divider />
        <Title level={5}>界面设置</Title>

        <Form.Item label="深色模式">
          <Switch
            checked={theme === 'dark'}
            onChange={(checked) => handleOptionChange('theme', checked ? 'dark' : 'light')}
          />
          <Text type="secondary" className="ml-2">
            切换深色/浅色模式
          </Text>
        </Form.Item>

        <Form.Item label="显示行号">
          <Switch
            checked={options.showLineNumbers}
            onChange={(checked) => handleOptionChange('showLineNumbers', checked)}
          />
          <Text type="secondary" className="ml-2">
            在代码中显示行号
          </Text>
        </Form.Item>
      </Form>
    </Card>
  );
}
