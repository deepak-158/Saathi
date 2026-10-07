import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Copy, Check } from 'lucide-react';

export default function MarkdownRenderer({ content, className = '' }) {
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className={`chat-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Styled Table Container with Horizontal Scroll
          table({ node, children, ...props }) {
            return (
              <div className="table-wrapper my-3.5 overflow-hidden rounded-xl border border-slate-200/90 shadow-xs bg-white">
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs border-collapse" {...props}>
                    {children}
                  </table>
                </div>
              </div>
            );
          },
          thead({ node, children, ...props }) {
            return (
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-xs tracking-wider" {...props}>
                {children}
              </thead>
            );
          },
          th({ node, children, ...props }) {
            return (
              <th className="px-3.5 py-2.5 font-semibold text-slate-800 border-r border-slate-200/70 last:border-r-0 whitespace-nowrap text-xs bg-slate-100/60" {...props}>
                {children}
              </th>
            );
          },
          tbody({ node, children, ...props }) {
            return (
              <tbody className="divide-y divide-slate-100 bg-white" {...props}>
                {children}
              </tbody>
            );
          },
          tr({ node, children, ...props }) {
            return (
              <tr className="hover:bg-indigo-50/40 transition-colors even:bg-slate-50/40" {...props}>
                {children}
              </tr>
            );
          },
          td({ node, children, ...props }) {
            return (
              <td className="px-3.5 py-2.5 text-slate-700 border-r border-slate-100/80 last:border-r-0 align-top text-xs sm:text-[13px] leading-relaxed" {...props}>
                {children}
              </td>
            );
          },

          // Typography: Headings
          h1({ node, children, ...props }) {
            return (
              <h1 className="text-xl font-bold text-slate-900 mt-5 mb-2 pb-1.5 border-b border-slate-100 first:mt-0" {...props}>
                {children}
              </h1>
            );
          },
          h2({ node, children, ...props }) {
            return (
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-4 mb-2 first:mt-0" {...props}>
                {children}
              </h2>
            );
          },
          h3({ node, children, ...props }) {
            return (
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mt-3 mb-1.5 first:mt-0" {...props}>
                {children}
              </h3>
            );
          },
          h4({ node, children, ...props }) {
            return (
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mt-2.5 mb-1 first:mt-0" {...props}>
                {children}
              </h4>
            );
          },

          // Paragraphs
          p({ node, children, ...props }) {
            return (
              <p className="my-2 leading-relaxed text-slate-700 text-sm last:mb-0" {...props}>
                {children}
              </p>
            );
          },

          // Lists
          ul({ node, children, ...props }) {
            return (
              <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700 text-sm" {...props}>
                {children}
              </ul>
            );
          },
          ol({ node, children, ...props }) {
            return (
              <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700 text-sm" {...props}>
                {children}
              </ol>
            );
          },
          li({ node, children, ...props }) {
            return (
              <li className="leading-relaxed pl-0.5" {...props}>
                {children}
              </li>
            );
          },

          // Quotes & Dividers
          blockquote({ node, children, ...props }) {
            return (
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/40 rounded-r-xl px-4 py-2.5 my-3 text-slate-700 text-sm italic" {...props}>
                {children}
              </blockquote>
            );
          },
          hr({ node, ...props }) {
            return <hr className="my-4 border-t border-slate-200" {...props} />;
          },

          // Links
          a({ node, children, href, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5"
                {...props}
              >
                {children}
              </a>
            );
          },

          // Code blocks & Inline Code
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isBlockCode = Boolean(match) || codeString.includes('\n');
            const codeKey = `code-${codeString.substring(0, 16)}`;

            if (isBlockCode) {
              const language = match ? match[1] : 'text';
              return (
                <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-700">
                  <div className="flex items-center justify-between bg-[#0F172A] px-3.5 py-1.5 text-[11px] text-slate-300 font-mono">
                    <span className="uppercase tracking-wider font-semibold">{language}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(codeString, codeKey)}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCodeId === codeKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={vs2015}
                    language={language}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: '1rem', background: '#0F172A', fontSize: '13px' }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono font-medium border border-slate-200/50" {...props}>
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
