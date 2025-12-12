import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

export function MarkdownSection({ content, title, icon, loading, className }) {
  if (loading) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-6 skeleton-shimmer rounded w-1/3" />
          <div className="h-4 skeleton-shimmer rounded w-full" />
          <div className="h-4 skeleton-shimmer rounded w-4/5" />
          <div className="h-4 skeleton-shimmer rounded w-2/3" />
          <div className="h-24 skeleton-shimmer rounded w-full mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
