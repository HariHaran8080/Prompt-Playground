import { useState, useMemo } from "react";
import { Code2, X, Copy, Check, Terminal } from "lucide-react";
import type { AISettings } from "../types/prompt";

type Props = {
  isOpen: boolean;
  promptText: string;
  settings: AISettings;
  onClose: () => void;
  onShowToast: (message: string, type?: "success" | "error" | "info") => void;
};

type Tab = "python" | "javascript" | "curl";

export default function CodeExportModal({
  isOpen,
  promptText,
  settings,
  onClose,
  onShowToast,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("python");
  const [copied, setCopied] = useState(false);

  const snippets = useMemo(() => {
    const escapedPrompt = JSON.stringify(promptText);
    const escapedSystem = JSON.stringify(settings.systemInstruction || "");

    // 1. Python
    let python = "";
    if (settings.provider === "gemini") {
      python = `from google import genai
from google.genai import types

client = genai.Client(api_key="${settings.geminiKey ? "YOUR_GEMINI_API_KEY" : "YOUR_GEMINI_API_KEY"}")

response = client.models.generate_content(
    model="${settings.model || "gemini-2.5-flash"}",
    contents=${escapedPrompt},
    config=types.GenerateContentConfig(
        temperature=${settings.temperature},
        max_output_tokens=${settings.maxTokens},
        system_instruction=${escapedSystem},
    )
)

print(response.text)
`;
    } else {
      const isGroq = settings.provider === "groq";
      const baseUrl = isGroq ? 'base_url="https://api.groq.com/openai/v1", ' : '';
      const keyVar = isGroq ? "GROQ_API_KEY" : "OPENAI_API_KEY";
      const model = settings.model || (isGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

      python = `from openai import OpenAI

client = OpenAI(
    ${baseUrl}api_key="${keyVar}"
)

messages = []
if ${escapedSystem}:
    messages.append({"role": "system", "content": ${escapedSystem}})
messages.append({"role": "user", "content": ${escapedPrompt}})

response = client.chat.completions.create(
    model="${model}",
    messages=messages,
    temperature=${settings.temperature},
    max_tokens=${settings.maxTokens},
)

print(response.choices[0].message.content)
`;
    }

    // 2. JavaScript / TypeScript
    let javascript = "";
    if (settings.provider === "gemini") {
      javascript = `// Using standard fetch with Gemini REST API
const apiKey = "${settings.geminiKey ? "YOUR_GEMINI_API_KEY" : "YOUR_GEMINI_API_KEY"}";
const model = "${settings.model || "gemini-2.5-flash"}";

async function runPrompt() {
  const response = await fetch(
    \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${apiKey}\`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: ${escapedPrompt} }] }],
        systemInstruction: { parts: [{ text: ${escapedSystem} }] },
        generationConfig: {
          temperature: ${settings.temperature},
          maxOutputTokens: ${settings.maxTokens},
        },
      }),
    }
  );

  const data = await response.json();
  console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
}

runPrompt();
`;
    } else {
      const isGroq = settings.provider === "groq";
      const endpoint = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const model = settings.model || (isGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

      javascript = `// Node.js or browser fetch
const apiKey = "YOUR_API_KEY";

async function runPrompt() {
  const messages = [];
  if (${escapedSystem}) {
    messages.push({ role: "system", content: ${escapedSystem} });
  }
  messages.push({ role: "user", content: ${escapedPrompt} });

  const response = await fetch("${endpoint}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${apiKey}\`,
    },
    body: JSON.stringify({
      model: "${model}",
      messages,
      temperature: ${settings.temperature},
      max_tokens: ${settings.maxTokens},
    }),
  });

  const data = await response.json();
  console.log(data.choices?.[0]?.message?.content);
}

runPrompt();
`;
    }

    // 3. cURL
    let curl = "";
    if (settings.provider === "gemini") {
      const model = settings.model || "gemini-2.5-flash";
      curl = `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=YOUR_GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -X POST \\
  -d '{
    "contents": [{"parts": [{"text": ${escapedPrompt}}]}],
    "generationConfig": {
      "temperature": ${settings.temperature},
      "maxOutputTokens": ${settings.maxTokens}
    }
  }'`;
    } else {
      const isGroq = settings.provider === "groq";
      const endpoint = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const model = settings.model || (isGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

      curl = `curl "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${model}",
    "messages": [
      {"role": "user", "content": ${escapedPrompt}}
    ],
    "temperature": ${settings.temperature},
    "max_tokens": ${settings.maxTokens}
  }'`;
    }

    return { python, javascript, curl };
  }, [promptText, settings]);

  if (!isOpen) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippets[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      onShowToast("Code snippet copied to clipboard", "success");
    } catch {
      onShowToast("Failed to copy code snippet", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl border border-gray-200 shadow-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Code2 size={16} />
            <h2 className="font-semibold text-sm">Export Code Snippet</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close export modal"
            className="p-1 hover:bg-gray-100 text-gray-500 hover:text-black"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab("python")}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition -mb-px ${
              activeTab === "python"
                ? "border-black text-black bg-white"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setActiveTab("javascript")}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition -mb-px ${
              activeTab === "javascript"
                ? "border-black text-black bg-white"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            JavaScript / TypeScript
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition -mb-px flex items-center gap-1.5 ${
              activeTab === "curl"
                ? "border-black text-black bg-white"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            <Terminal size={12} />
            cURL
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 z-10 flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-2.5 py-1 text-xs hover:bg-gray-50 shadow-sm"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy Code"}
            </button>

            <pre className="p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs leading-6 overflow-x-auto rounded-none border border-gray-800">
              <code>{snippets[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-[11px] text-gray-500">
            Exported using active provider:{" "}
            <strong className="text-gray-800 uppercase">
              {settings.provider}
            </strong>{" "}
            ({settings.model})
          </p>
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-1.5 text-xs font-medium bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

