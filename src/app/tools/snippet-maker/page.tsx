'use client';

import React, { useState } from 'react';
import { Input, Button, Typography, Card, Space, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useMock, mockResponse, markdownContent, markdownContent1 } from '@/lib/mocks/snippet';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ChatMarkdown from '@/components/ChatMarkdown';

const { TextArea } = Input;
const { Paragraph } = Typography;

export default function SnippetMakerPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(markdownContent1);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useMock) {
        await new Promise((res) => setTimeout(res, 800));
        setResult(mockResponse);
      } else {
        const res = await fetch('/api/snippet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input || '一个包含姓名和年龄的表单' }),
        });

        if (!res.ok) {
          let errorMsg = '接口请求失败';
          try {
            const errorData = await res.json();
            if (errorData?.message) errorMsg = errorData.message;
          } catch {}
          setError(errorMsg);
          setResult('');
          return;
        }

        const data = await res.json();
        setResult(data.result);
      }
    } catch (err) {
      console.error(err, 'handleGenerate');
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
    <Card
      title="代码片段生成器"
      style={{ maxWidth: 800, margin: '40px auto' }}
      // className={styles.markdownBody}
    >
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
            // className="prose max-w-none prose-pre:mt-4 prose-p:mt-4"
            extra={
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
            }
          >
            <ChatMarkdown content={result} />
            {/* <ReactMarkdown
              children={result}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <SyntaxHighlighter
                      style={solarizedlight}
                      language={match ? match[1] : 'tsx'}
                      PreTag="div"
                      wrapLongLines
                      customStyle={{ margin: 0, borderRadius: 4 }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      style={{
                        background: '#eee',
                        borderRadius: 3,
                        padding: '0 4px',
                        fontSize: '95%',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            /> */}
          </Card>
        )}

        {error && (
          <Card type="inner" title="错误" style={{ borderColor: 'red', color: 'red' }}>
            <Paragraph>{error}</Paragraph>
          </Card>
        )}
      </Space>
      <p className="text-red-500 text-xl">Tailwind生效了吗？</p>
    </Card>
  );
}
