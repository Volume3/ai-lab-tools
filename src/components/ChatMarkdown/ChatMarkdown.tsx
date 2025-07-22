'use client';

import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

function isBlockElement(node: ReactNode): boolean {
  if (!React.isValidElement(node)) return false;

  const blockTags = ['pre', 'table', 'ul', 'ol', 'div'];
  const tag = node.type;

  // 如果是 HTML 元素标签
  if (typeof tag === 'string' && blockTags.includes(tag)) return true;

  // 如果是组件（比如你自己封装的 ChatBlockQuote 这类组件）
  // 你也可以额外判断 `tag.displayName` 等等
  return false;
}

function hasBlockChild(children: ReactNode[]): boolean {
  return children.some((child) => isBlockElement(child));
}

export default function ChatMarkdown({ content, className }: ChatMarkdownProps) {
  // console.log(content, 'content');
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            const isBlock = Array.isArray(children) && hasBlockChild(children);
            if (isBlock) {
              return <div className="mt-4">{children}</div>;
            }
            return <p className="mt-4">{children}</p>;
          },
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            // console.log('Inline:', inline, 'Content:', children);
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
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
