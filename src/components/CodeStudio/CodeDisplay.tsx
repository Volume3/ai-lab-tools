'use client';

import React, { useState } from 'react';
import { Button, message, Dropdown, Menu, Tooltip, Switch } from 'antd';
import {
  CopyOutlined,
  DownloadOutlined,
  EditOutlined,
  CheckOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import ChatMarkdown from '@/components/ChatMarkdown';
import { CodeResult } from '@/types/codeStudio';

interface CodeDisplayProps {
  code: string;
  language?: string;
  fileName?: string;
  onSave?: (code: string) => void;
  onEdit?: (code: string) => void;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  showLineNumbers?: boolean;
  allowCopy?: boolean;
  allowDownload?: boolean;
}

// 检测代码语言
function detectLanguage(code: string): string {
  // 简单的语言检测逻辑
  if (
    code.includes('import React') ||
    code.includes('from "react"') ||
    code.includes("from 'react'")
  )
    return 'tsx';
  if (code.includes('<template>')) return 'vue';
  if (code.includes('import { Component }') && code.includes('@angular')) return 'typescript';
  if (code.includes('const styles = {')) return 'jsx';
  return 'tsx'; // 默认
}

export default function CodeDisplay({
  code,
  language: initialLanguage,
  fileName = 'generated-code.tsx',
  onSave,
  onEdit,
  theme = 'light',
  readOnly = true,
  showLineNumbers = true,
  allowCopy = true,
  allowDownload = true,
}: CodeDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);
  const [showLineNumbersState, setShowLineNumbersState] = useState(showLineNumbers);

  const language = initialLanguage || detectLanguage(code);

  // 处理复制
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    message.success('已复制到剪贴板');
  };

  // 处理下载
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 处理保存编辑
  const handleSave = () => {
    if (onSave) {
      onSave(editedCode);
    }
    setIsEditing(false);
  };

  // 处理编辑取消
  const handleCancelEdit = () => {
    setEditedCode(code);
    setIsEditing(false);
  };

  return (
    <div
      className={`code-display ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } border rounded overflow-hidden`}
    >
      <div
        className={`code-header flex justify-between items-center p-2 ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          <CodeOutlined className="mr-2" />
          <span>{fileName}</span>
        </div>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <Button
              icon={isEditing ? <CheckOutlined /> : <EditOutlined />}
              size="small"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? '保存' : '编辑'}
            </Button>
          )}

          {isEditing && (
            <Button size="small" onClick={handleCancelEdit}>
              取消
            </Button>
          )}

          <Tooltip title="显示行号">
            <Switch
              size="small"
              checked={showLineNumbersState}
              onChange={setShowLineNumbersState}
            />
          </Tooltip>

          {allowCopy && (
            <Button icon={<CopyOutlined />} size="small" onClick={handleCopy}>
              复制
            </Button>
          )}

          {allowDownload && (
            <Button icon={<DownloadOutlined />} size="small" onClick={handleDownload}>
              下载
            </Button>
          )}
        </div>
      </div>

      <div className="code-content">
        {isEditing ? (
          <textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            className={`w-full h-96 p-4 font-mono text-sm ${
              theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
            }`}
          />
        ) : (
          <div className={`${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            <ChatMarkdown content={`\`\`\`${language}\n${code}\n\`\`\``} className="p-0" />
          </div>
        )}
      </div>
    </div>
  );
}
