interface CodeBlockProps {
  code: string;
  language: string;
}

/** Renders read-only source code in a horizontally scrollable region. */
export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        <span>{language}</span>
      </div>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
