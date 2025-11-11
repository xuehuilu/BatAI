import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TypewriterMarkdown = ({ content, speed = 5 }: { content: string; speed?: number }) => {
    const [displayedContent, setDisplayedContent] = useState('');

    useEffect(() => {
        // This effect creates the typewriter animation.
        // It checks if there's more content to display.
        if (displayedContent.length < content.length) {
            // It sets a timeout to add the next character after a short delay (controlled by `speed`).
            const timeoutId = setTimeout(() => {
                setDisplayedContent(content.substring(0, displayedContent.length + 1));
            }, speed);
            // Cleanup function to clear the timeout if the component unmounts or re-renders.
            return () => clearTimeout(timeoutId);
        }
    }, [content, displayedContent, speed]);

    return (
        <ReactMarkdown
            children={displayedContent}
            remarkPlugins={[remarkGfm]}
            components={{
                h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-6 mb-3 border-b pb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-4 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 pl-4 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />,
                code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <pre className="bg-gray-800 text-white p-4 rounded-md my-4 overflow-x-auto"><code className="text-sm font-mono" {...props}>{children}</code></pre>
                    ) : (
                        <code className="bg-gray-200 text-gray-800 rounded px-1.5 py-1 text-sm font-mono" {...props}>{children}</code>
                    );
                },
                table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse border border-gray-300" {...props} /></div>,
                thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                tr: ({ node, ...props }) => <tr className="border-b border-gray-200" {...props} />,
                th: ({ node, ...props }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-sm" {...props} />,
                td: ({ node, ...props }) => <td className="border border-gray-300 px-4 py-2 text-sm" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-6 border-gray-200" {...props} />,
            }}
        />
    );
};

export default TypewriterMarkdown;
