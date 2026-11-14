
import { useRef } from "react";

type PromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function PromptEditor({
  value,
  onChange,
  placeholder,
}: PromptEditorProps) {
  const highlightRef = useRef<HTMLDivElement>(null);

  const parts = value.split(/({{\s*[\w]+\s*}})/g);

  function handleScroll() {
    if (highlightRef.current) {
      const textarea = document.getElementById(
        "prompt-content-editor"
      ) as HTMLTextAreaElement | null;

      if (textarea) {
        highlightRef.current.scrollTop = textarea.scrollTop;
        highlightRef.current.scrollLeft = textarea.scrollLeft;
      }
    }
  }

  return (
    <div className="relative min-h-[284px] w-full border border-gray-200 bg-white">
      {/* Highlight layer */}
      <div
        ref={highlightRef}
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 font-mono text-sm leading-7 text-gray-800 pointer-events-none"
      >
        {parts.map((part, index) => {
          const isVariable = /^{{\s*[\w]+\s*}}$/.test(part);

          return isVariable ? (
            <span
              key={index}
              className="rounded-none bg-blue-100 px-1 text-blue-700"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </div>

      {/* Actual editable textarea */}
      <textarea
        id="prompt-content-editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        spellCheck={false}
        className="relative z-10 block min-h-[284px] w-full resize-none overflow-auto bg-transparent p-4 font-mono text-sm leading-7 text-transparent caret-black placeholder:text-gray-400 focus:outline-none selection:bg-blue-200/60"
      />
    </div>
  );
}
