// ChatMarkdownWrapper.tsx
import dynamic from 'next/dynamic';

const ChatMarkdown = dynamic(() => import('./ChatMarkdown'), { ssr: false });

export default ChatMarkdown;
