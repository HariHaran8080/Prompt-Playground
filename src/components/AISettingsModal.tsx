import { useState } from "react";
import { Key, X, Eye, EyeOff, ShieldCheck, ExternalLink } from "lucide-react";
import type { AISettings } from "../types/prompt";

type Props = {
  isOpen: boolean;
  settings: AISettings;
  onSave: (updated: Partial<AISettings>) => void;
  onClose: () => void;
};

export default function AISettingsModal({
  isOpen,
  settings,
  onSave,
  onClose,
}: Props) {
  const [geminiKey, setGeminiKey] = useState(settings.geminiKey || "");
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey || "");
  const [groqKey, setGroqKey] = useState(settings.groqKey || "");

  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGroq, setShowGroq] = useState(false);

  if (!isOpen) return null;

  function handleSave() {
    onSave({
      geminiKey: geminiKey.trim(),
      openaiKey: openaiKey.trim(),
      groqKey: groqKey.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg border border-gray-200 shadow-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Key size={16} />
            <h2 className="font-semibold text-sm">AI Provider API Keys</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 hover:bg-gray-100 text-gray-500 hover:text-black"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">
            <ShieldCheck size={16} className="text-gray-700 shrink-0 mt-0.5" />
            <p>
              Your API keys are stored solely in your browser's{" "}
              <code className="bg-gray-200 px-1 py-0.5 rounded-none text-[11px]">
                localStorage
              </code>
              . They are never transmitted to any third-party server besides direct calls to the chosen provider.
            </p>
          </div>

          {/* Gemini */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                Get free key <ExternalLink size={10} />
              </a>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full border border-gray-200 px-3 py-2 pr-9 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black"
              >
                {showGemini ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* OpenAI */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                OpenAI API Key
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                OpenAI platform <ExternalLink size={10} />
              </a>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showOpenai ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full border border-gray-200 px-3 py-2 pr-9 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowOpenai(!showOpenai)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black"
              >
                {showOpenai ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Groq */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Groq API Key
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                Groq Console <ExternalLink size={10} />
              </a>
            </div>
            <div className="relative mt-1.5">
              <input
                type={showGroq ? "text" : "password"}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full border border-gray-200 px-3 py-2 pr-9 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowGroq(!showGroq)}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black"
              >
                {showGroq ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 text-xs font-medium bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white px-5 py-2 text-xs font-medium hover:bg-gray-800"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
}

