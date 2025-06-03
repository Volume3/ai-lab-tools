'use client';

import React, { useState } from 'react';
import { Input, Button, Typography, Card, Space, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useMock, mockResponse } from '@/lib/mocks/snippet';

const { TextArea } = Input;
const { Paragraph } = Typography;

export default function SnippetMakerPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('test');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMock) {
        await new Promise((res) => setTimeout(res, 800));
        setResult(mockResponse);
      } else {
        // 这里写你实际调用 Gemini 接口的逻辑
        const res = await fetch('/api/snippet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input || '一个包含姓名和年龄的表单' }),
        });
        console.log(res, 'res');
        if (!res.ok) {
          let errorMsg = '接口请求失败';
          try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch {}
          setError(errorMsg);
          setResult('');
          return;
        }
        const data = await res.json();
        console.log(data, 'data');
        setResult(data.result);
      }
    } catch (err) {
      console.log(err, 'handleGenerate');
      setError('生成失败');
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    message.success('已复制到剪贴板');
  };

  return (
    <Card title="代码片段生成器" style={{ maxWidth: 800, margin: '40px auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          rows={4}
          placeholder="请输入你想生成的代码描述，比如：一个包含姓名和年龄的表单"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="primary" onClick={handleGenerate} loading={loading}>
          生成代码
        </Button>

        {result && (
          <Card
            type="inner"
            title="生成结果"
            extra={
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
            }
          >
            <Paragraph code style={{ whiteSpace: 'pre-wrap' }}>
              {result}
            </Paragraph>
          </Card>
        )}

        {error && (
          <Card type="inner" title="错误" style={{ borderColor: 'red', color: 'red' }}>
            <Paragraph>{error}</Paragraph>
          </Card>
        )}
      </Space>
    </Card>
  );
}
