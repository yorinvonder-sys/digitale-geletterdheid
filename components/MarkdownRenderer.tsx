/**
 * Lazy-loaded ReactMarkdown — defers ~117 kB until first chat/markdown render.
 * Used by ChatBubble and StudentAIChat.
 */
import React, { Suspense } from 'react';

const ReactMarkdown = React.lazy(() =>
  import('react-markdown').then((m) => ({ default: m.default }))
);

interface MarkdownRendererProps {
  children: string;
  components?: Record<string, React.ComponentType<any>>;
}

const Fallback = () => (
  <span className="inline-block w-4 h-4 rounded bg-slate-200 animate-pulse" aria-hidden />
);

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  components,
}) => (
  <Suspense fallback={<Fallback />}>
    <ReactMarkdown components={components}>{children}</ReactMarkdown>
  </Suspense>
);
