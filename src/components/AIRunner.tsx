import { useState } from "react";
import {
  Play,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Key,
  Clock,
  Cpu,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PROVIDER_MODELS, executePrompt } from "../services/aiService";
import { TactileButton } from "./TactileButton";
import type { AIProvider, AISettings, ExecutionResult } from "../types/prompt";

type Props = {
  promptText: string;
  settings: AISettings;
  onUpdateSettings: (updated: Partial<AISettings>) => void;
  onOpenKeySettings: () => void;
  onShowToast: (message: string, type?: "success" | "error" | "info") => void;
};

export default function AIRunner({
  promptText,
  settings,
  onUpdateSettings,
  onOpenKeySettings,
  onShowToast,
}: Props) {
  const [result, setResult] = useState<ExecutionResult>({
    status: "idle",
    output: "",
  });
  const [copied, setCopied] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const availableModels = PROVIDER_MODELS[settings.provider] || [];

  function handleProviderChange(provider: AIProvider) {
    const newModels = PROVIDER_MODELS[provider] || [];
    const defaultModel = newModels[0]?.id || "";
    onUpdateSettings({
      provider,
      model: defaultModel,
    });
  }

  async function handleRun() {
    if (!promptText.trim()) {
      onShowToast("Prompt content is empty. Add some text first.", "error");
      return;
    }

    setResult({
      status: "loading",
      output: "",
    });

    try {
      const res = await executePrompt(promptText, settings);
      setResult({
        status: "success",
        output: res.output,
        latencyMs: res.latencyMs,
        provider: res.provider,
        model: res.model,
        timestamp: Date.now(),
      });
      onShowToast(`Completed in ${res.latencyMs}ms`, "success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to run prompt";
      setResult({
        status: "error",
        output: "",
        error: message,
      });
      onShowToast(message, "error");
    }
  }

  async function handleCopy() {
    if (!result.output) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      onShowToast("Response copied to clipboard", "success");
    } catch {
      onShowToast("Failed to copy response", "error");
    }
  }

  const hasApiKey =
    settings.provider === "mock" ||
    (settings.provider === "gemini" && Boolean(settings.geminiKey)) ||
    (settings.provider === "openai" && Boolean(settings.openaiKey)) ||
    (settings.provider === "groq" && Boolean(settings.groqKey));

  return (
    <div className="border border-[#E5DACB] bg-[#FAF7F2] rounded-none shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#E5DACB] bg-[#F2EAE0]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-neutral-900" />
          <h2 className="text-sm font-semibold text-neutral-900">
            Playground AI Runner
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeySettings}
            className="flex items-center gap-1.5 text-xs bg-white/95 border border-[#E5DACB] px-2.5 py-1.5 hover:bg-white text-neutral-800 rounded-none transition shadow-2xs font-medium"
            title="Configure API Keys"
          >
            <Key size={13} />
            <span className="hidden sm:inline">API Keys</span>
            {!hasApiKey && (
              <span className="w-2 h-2 bg-[#df5f34]" />
            )}
          </button>

          <TactileButton
            size="sm"
            onClick={handleRun}
            variant="terracotta"
            isLoading={result.status === "loading"}
            disabled={result.status === "loading"}
          >
            {result.status === "loading" ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play size={13} className="fill-white/80" />
                <span>Run Prompt</span>
              </>
            )}
          </TactileButton>
        </div>
      </div>

      {/* Model & Parameter Controls */}
      <div className="p-5 border-b border-[#E5DACB] bg-[#F7F2EA] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Provider */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider block mb-1.5">
              Provider
            </label>
            <select
              value={settings.provider}
              onChange={(e) =>
                handleProviderChange(e.target.value as AIProvider)
              }
              className="w-full border border-[#E5DACB] bg-white rounded-none px-3 py-2 text-xs font-medium focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34] outline-none"
            >
              <option value="mock">Simulated AI (No Key)</option>
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="groq">Groq Cloud</option>
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider block mb-1.5">
              Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => onUpdateSettings({ model: e.target.value })}
              className="w-full border border-[#E5DACB] bg-white rounded-none px-3 py-2 text-xs font-medium focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34] outline-none"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider">
                Temperature
              </label>
              <span className="text-xs font-mono font-semibold text-neutral-900">
                {settings.temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) =>
                onUpdateSettings({ temperature: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-[#d8cbba] rounded-none appearance-none cursor-pointer accent-[#df5f34]"
            />
          </div>

          {/* Max Tokens */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold text-neutral-900 uppercase tracking-wider">
                Max Tokens
              </label>
              <span className="text-xs font-mono font-semibold text-neutral-900">
                {settings.maxTokens}
              </span>
            </div>
            <input
              type="range"
              min="256"
              max="4096"
              step="128"
              value={settings.maxTokens}
              onChange={(e) =>
                onUpdateSettings({ maxTokens: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-[#d8cbba] rounded-none appearance-none cursor-pointer accent-[#df5f34]"
            />
          </div>
        </div>

        {/* System Instruction Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            className="flex items-center gap-1.5 text-xs text-neutral-900 hover:text-black font-semibold"
          >
            <SlidersHorizontal size={13} />
            System Instructions
            {showSystemPrompt ? (
              <ChevronUp size={13} />
            ) : (
              <ChevronDown size={13} />
            )}
          </button>

          {showSystemPrompt && (
            <div className="mt-2.5">
              <textarea
                value={settings.systemInstruction}
                onChange={(e) =>
                  onUpdateSettings({ systemInstruction: e.target.value })
                }
                placeholder="Optional system context or persona..."
                rows={2}
                className="w-full border border-[#E5DACB] bg-white rounded-none p-2.5 text-xs leading-relaxed focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34] outline-none resize-none font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {/* Output Console */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-neutral-900">
            <span className="font-semibold text-neutral-900">Output</span>
            {result.latencyMs !== undefined && (
              <span className="flex items-center gap-1 font-mono text-[11px] bg-white/80 px-2 py-0.5 rounded-none border border-[#E5DACB]">
                <Clock size={12} />
                {result.latencyMs}ms
              </span>
            )}
            {result.model && (
              <span className="flex items-center gap-1 font-mono text-[11px] bg-white/80 px-2 py-0.5 rounded-none border border-[#E5DACB]">
                <Cpu size={12} />
                {result.model}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {result.output && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs bg-white text-neutral-800 hover:text-black border border-[#E5DACB] rounded-none px-2.5 py-1 hover:bg-neutral-50 shadow-2xs font-medium"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() =>
                    setResult({ status: "idle", output: "" })
                  }
                  className="p-1 bg-white/80 border border-[#E5DACB] rounded-none text-neutral-700 hover:text-black"
                  title="Clear output"
                >
                  <RotateCcw size={13} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Output Box */}
        <div className="min-h-[160px] border border-[#E5DACB] bg-white rounded-none p-4 text-xs font-mono leading-6 shadow-xs">
          {result.status === "loading" && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
              <Loader2 size={20} className="animate-spin text-[#df5f34]" />
              <span>Querying {settings.model}...</span>
            </div>
          )}

          {result.status === "error" && (
            <div className="flex items-start gap-2.5 text-red-600 p-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Execution Failed</p>
                <p className="mt-1 text-neutral-800">{result.error}</p>
              </div>
            </div>
          )}

          {result.status === "success" && (
            <pre className="whitespace-pre-wrap break-words text-neutral-900 font-mono">
              {result.output}
            </pre>
          )}

          {result.status === "idle" && (
            <div className="text-neutral-700 py-10 text-center font-sans">
              Click <strong className="text-[#df5f34]">Run Prompt</strong> above
              to execute your prompt against the selected model.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
