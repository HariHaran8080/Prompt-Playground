import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Copy,
  Save,
  Trash2,
  Bookmark,
  Check,
  Code2,
  Key,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { DynamicButton } from "./components/DynamicButton";

import TemplateLibrary from "./components/TemplateLibrary";
import PromptEditor from "./components/PromptEditor";
import AIRunner from "./components/AIRunner";
import AISettingsModal from "./components/AISettingsModal";
import CodeExportModal from "./components/CodeExportModal";
import ConfirmModal from "./components/ConfirmModal";
import ToastContainer from "./components/Toast";

import { DEFAULT_AI_SETTINGS } from "./services/aiService";
import type { Prompt, PromptTemplate, AISettings, Toast } from "./types/prompt";

const starterPrompts: Prompt[] = [
  {
    id: "1",
    title: "JavaScript Tutor",
    category: "Development",
    favorite: true,
    content:
      "Act as a {{role}}. Explain {{topic}} in a {{tone}} manner. Include practical examples and common mistakes.",
  },
  {
    id: "2",
    title: "Technical Interview",
    category: "Development",
    favorite: false,
    content:
      "Act as a technical interviewer. Ask me {{number}} interview questions about {{topic}}. Rate my answers and explain improvements.",
  },
  {
    id: "3",
    title: "Content Writer",
    category: "Writing",
    favorite: false,
    content:
      "Write a {{format}} about {{subject}} using a {{tone}} tone. Keep it clear and engaging.",
  },
];

const defaultPrompt: Prompt = {
  id: "",
  title: "",
  category: "Development",
  favorite: false,
  content: "",
};

function getSavedPrompts(): Prompt[] {
  try {
    const saved = localStorage.getItem("prompt-playground-prompts");
    return saved ? (JSON.parse(saved) as Prompt[]) : starterPrompts;
  } catch {
    return starterPrompts;
  }
}

function getSavedAISettings(): AISettings {
  try {
    const saved = localStorage.getItem("prompt-playground-ai-settings");
    return saved
      ? { ...DEFAULT_AI_SETTINGS, ...(JSON.parse(saved) as Partial<AISettings>) }
      : DEFAULT_AI_SETTINGS;
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>(getSavedPrompts);
  const [activePrompt, setActivePrompt] = useState<Prompt>(defaultPrompt);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("All prompts");

  const [variables, setVariables] = useState<Record<string, string>>({});

  const [copied, setCopied] = useState(false);
  const [savedState, setSavedState] = useState(false);

  // Modals state
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false);
  const [aiSettings, setAISettings] = useState<AISettings>(getSavedAISettings);

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist prompts in localStorage
  useEffect(() => {
    localStorage.setItem(
      "prompt-playground-prompts",
      JSON.stringify(prompts)
    );
  }, [prompts]);

  // Persist AI settings in localStorage
  useEffect(() => {
    localStorage.setItem(
      "prompt-playground-ai-settings",
      JSON.stringify(aiSettings)
    );
  }, [aiSettings]);

  // Filtered prompts for view filtering
  const viewPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesView =
        activeView === "All prompts" ||
        (activeView === "Favorites" && prompt.favorite) ||
        prompt.category === activeView;

      return matchesView;
    });
  }, [prompts, activeView]);

  // Detect variables in prompt content
  const detectedVariables = useMemo(() => {
    const matches = activePrompt.content.match(/{{\s*[\w]+\s*}}/g) || [];
    return [
      ...new Set(matches.map((item) => item.replace(/[{}]/g, "").trim())),
    ];
  }, [activePrompt.content]);

  // Detect variables with empty values
  const missingVariables = useMemo(() => {
    return detectedVariables.filter((v) => !variables[v]?.trim());
  }, [detectedVariables, variables]);

  // Generate live preview
  const preview = useMemo(() => {
    return activePrompt.content.replace(
      /{{\s*([\w]+)\s*}}/g,
      (_, key: string) => variables[key] || `{{${key}}}`
    );
  }, [activePrompt.content, variables]);

  // Prompt statistics
  const wordCount = useMemo(() => {
    return activePrompt.content.trim()
      ? activePrompt.content.trim().split(/\s+/).length
      : 0;
  }, [activePrompt.content]);

  const characterCount = activePrompt.content.length;

  const previewWordCount = useMemo(() => {
    return preview.trim() ? preview.trim().split(/\s+/).length : 0;
  }, [preview]);

  const estimatedTokens = useMemo(() => {
    return Math.ceil(preview.length / 4);
  }, [preview]);

  const variableCount = detectedVariables.length;

  // Create new prompt
  function createPrompt() {
    setActivePrompt({ ...defaultPrompt });
    setVariables({});
    setActiveView("All prompts");
  }

  // Update prompt fields
  function updatePrompt(field: keyof Prompt, value: string | boolean) {
    setActivePrompt((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Save prompt with DynamicButton morphing
  function savePrompt() {
    if (!activePrompt.title.trim()) {
      showToast("Please enter a prompt title.", "error");
      return;
    }

    if (!activePrompt.content.trim()) {
      showToast("Please enter prompt content.", "error");
      return;
    }

    const exists = prompts.some(
      (prompt) => prompt.id === activePrompt.id && activePrompt.id !== ""
    );

    if (exists) {
      setPrompts((previous) =>
        previous.map((prompt) =>
          prompt.id === activePrompt.id
            ? { ...activePrompt, updatedAt: Date.now() }
            : prompt
        )
      );
      showToast("Prompt updated successfully.", "success");
    } else {
      const newPrompt: Prompt = {
        ...activePrompt,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setPrompts((previous) => [newPrompt, ...previous]);
      setActivePrompt(newPrompt);
      showToast("Prompt saved to library.", "success");
    }

    setSavedState(true);
    setTimeout(() => setSavedState(false), 2000);
  }

  // Delete prompt with custom modal
  function deletePrompt(targetPrompt?: Prompt) {
    const promptToDelete = targetPrompt || activePrompt;
    if (!promptToDelete.id) {
      createPrompt();
      showToast("Editor cleared.", "info");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Delete Prompt",
      message: `Are you sure you want to delete "${promptToDelete.title}"? This cannot be undone.`,
      onConfirm: () => {
        setPrompts((previous) =>
          previous.filter((prompt) => prompt.id !== promptToDelete.id)
        );
        if (activePrompt.id === promptToDelete.id) {
          createPrompt();
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast("Prompt deleted.", "success");
      },
    });
  }

  // Duplicate prompt
  function duplicatePrompt() {
    const duplicate: Prompt = {
      ...activePrompt,
      id: crypto.randomUUID(),
      title: `${activePrompt.title || "Untitled"} (Copy)`,
      createdAt: Date.now(),
    };

    setPrompts((previous) => [duplicate, ...previous]);
    setActivePrompt(duplicate);
    showToast("Prompt duplicated.", "success");
  }

  // Copy preview
  async function copyPrompt() {
    if (missingVariables.length > 0) {
      showToast(
        `Please fill in missing variables: ${missingVariables.join(", ")}`,
        "error"
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
      showToast("Interpolated prompt copied to clipboard.", "success");
    } catch {
      showToast("Unable to copy to clipboard.", "error");
    }
  }

  // Toggle favorite
  function toggleFavorite(targetPrompt?: Prompt) {
    const promptToToggle = targetPrompt || activePrompt;
    const updatedFavorite = !promptToToggle.favorite;

    if (promptToToggle.id) {
      setPrompts((previous) =>
        previous.map((prompt) =>
          prompt.id === promptToToggle.id
            ? { ...prompt, favorite: updatedFavorite }
            : prompt
        )
      );
    }

    if (activePrompt.id === promptToToggle.id) {
      updatePrompt("favorite", updatedFavorite);
    }

    showToast(
      updatedFavorite ? "Added to favorites." : "Removed from favorites.",
      "info"
    );
  }

  // Load selected template into editor
  function useTemplate(template: PromptTemplate) {
    setActivePrompt({
      id: "",
      title: template.title,
      content: template.content,
      category: template.category,
      favorite: false,
    });
    setActiveView("All prompts");
    showToast(`Loaded "${template.title}" template.`, "success");
  }

  // Export prompts as JSON
  function handleExportJSON() {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(prompts, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `prompt-playground-prompts-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Exported all prompts as JSON.", "success");
    } catch {
      showToast("Failed to export prompts.", "error");
    }
  }

  // Import prompts from JSON
  function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid file format. Expected a JSON array.");
        }

        const validPrompts = parsed
          .filter(
            (item) =>
              item &&
              typeof item.title === "string" &&
              typeof item.content === "string"
          )
          .map((p) => ({
            id: p.id || crypto.randomUUID(),
            title: p.title,
            content: p.content,
            category: p.category || "Development",
            favorite: Boolean(p.favorite),
          }));

        if (validPrompts.length === 0) {
          throw new Error("No valid prompts found in the file.");
        }

        setPrompts((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newEntries = validPrompts.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...newEntries, ...prev];
        });

        showToast(`Imported ${validPrompts.length} prompts.`, "success");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error reading JSON file";
        showToast(message, "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <SidebarProvider>
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Animate UI / Radix Sidebar */}
      <AppSidebar
        activeView={activeView}
        onSelectView={setActiveView}
        onCreatePrompt={createPrompt}
        prompts={viewPrompts}
        activePromptId={activePrompt.id}
        onSelectPrompt={setActivePrompt}
        onDeletePrompt={deletePrompt}
        onToggleFavorite={toggleFavorite}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
        onExportJSON={handleExportJSON}
        onImportJSON={() => fileInputRef.current?.click()}
        search={search}
        onSearchChange={setSearch}
      />

      <SidebarInset className="bg-[#fdfbf7]">
        {/* Top Header with Breadcrumb & Quick Actions */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[#ede4d8] px-3 sm:px-6 md:px-8 bg-[#fdfbf7] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden size-8 border border-[#ede4d8] bg-white text-neutral-700 hover:text-black hover:bg-[#f5eedf] rounded-none transition" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveView("All prompts");
                    }}
                    className="text-neutral-500 hover:text-neutral-900"
                  >
                    Prompt Playground
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-neutral-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-neutral-900 font-semibold">{activeView}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAISettingsOpen(true)}
              className="flex items-center gap-1.5 text-xs border border-[#ede4d8] bg-white px-3 py-1.5 hover:bg-[#f5eedf] text-neutral-700 rounded-none transition shadow-2xs font-medium"
            >
              <Key size={13} />
              <span className="hidden sm:inline">AI Settings</span>
            </button>

            <button
              onClick={() => setIsCodeExportOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-[#df5f34] text-white px-3.5 py-1.5 hover:bg-[#c94d25] transition rounded-none font-semibold shadow-xs"
            >
              <Code2 size={13} />
              <span className="hidden sm:inline">Export Code</span>
            </button>
          </div>
        </header>

        {/* Main Content Area (Background: #fdfbf7) */}
        <div className="flex-1 min-w-0 p-3 sm:p-5 md:p-8 bg-[#fdfbf7]">
          <div className="max-w-[1100px] mx-auto">
            {/* Template Library View */}
            {activeView === "Templates" ? (
              <TemplateLibrary onUse={useTemplate} />
            ) : (
              /* Single-column full-width container layout with warm light harmonious color */
              <div className="space-y-6">
                {/* 1. Prompt Configuration Box (Light warm color: #FAF7F2, Sharp Edges) */}
                <div className="border border-[#E5DACB] bg-[#FAF7F2] rounded-none shadow-xs overflow-hidden text-neutral-900">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5DACB] bg-[#F2EAE0]">
                    <span className="text-sm font-semibold text-neutral-900">
                      Prompt Configuration
                    </span>

                    <button
                      onClick={() => toggleFavorite()}
                      title="Toggle favorite"
                      className="text-neutral-800 hover:text-black p-1 transition"
                    >
                      <Bookmark
                        size={17}
                        fill={activePrompt.favorite ? "black" : "none"}
                      />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Title & Category row */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-neutral-900 block mb-1.5">
                          Prompt Title
                        </label>
                        <input
                          value={activePrompt.title}
                          onChange={(e) =>
                            updatePrompt("title", e.target.value)
                          }
                          placeholder="Enter prompt title"
                          className="w-full border border-[#E5DACB] bg-white px-3 py-2 text-sm text-neutral-900 focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34] outline-none rounded-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-900 block mb-1.5">
                          Category
                        </label>
                        <select
                          value={activePrompt.category}
                          onChange={(e) =>
                            updatePrompt("category", e.target.value)
                          }
                          className="w-full border border-[#E5DACB] bg-white px-3 py-2 text-sm text-neutral-900 focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34] outline-none rounded-none"
                        >
                          <option>Development</option>
                          <option>Writing</option>
                          <option>Learning</option>
                        </select>
                      </div>
                    </div>

                    {/* Prompt Content */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-neutral-900">
                          Prompt Content
                        </label>
                        <span className="text-[11px] text-neutral-800 font-mono">
                          Use {"{{variable}}"} syntax for dynamic tokens
                        </span>
                      </div>

                      <div className="rounded-none overflow-hidden border border-[#E5DACB] bg-white shadow-2xs">
                        <PromptEditor
                          value={activePrompt.content}
                          onChange={(value) => updatePrompt("content", value)}
                          placeholder="Write your prompt template here (e.g. Act as a {{role}} and explain {{topic}})..."
                        />
                      </div>

                      {/* Prompt Stats */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[11px] text-neutral-900">
                        <span>
                          <strong className="text-black font-semibold">{wordCount}</strong>{" "}
                          words
                        </span>
                        <span>
                          <strong className="text-black font-semibold">
                            {characterCount}
                          </strong>{" "}
                          characters
                        </span>
                        <span>
                          <strong className="text-black font-semibold">
                            {variableCount}
                          </strong>{" "}
                          variables
                        </span>
                        <span>
                          <strong className="text-black font-semibold">
                            ~{estimatedTokens}
                          </strong>{" "}
                          estimated tokens
                        </span>
                      </div>
                    </div>

                    {/* Actions toolbar */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E5DACB]">
                      {/* DynamicButton for Save Prompt with #df5f34 and Sharp Edges */}
                      <DynamicButton
                        onClick={savePrompt}
                        variant="primary"
                        stateKey={savedState ? "saved" : "save"}
                        icon={savedState ? <Check size={14} /> : <Save size={14} />}
                      >
                        {savedState ? "Saved!" : "Save prompt"}
                      </DynamicButton>

                      <button
                        onClick={copyPrompt}
                        className="flex items-center gap-1.5 border border-[#E5DACB] bg-white text-neutral-800 px-3.5 py-1.5 text-xs font-medium hover:bg-neutral-50 transition rounded-none shadow-2xs"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied" : "Copy preview"}
                      </button>

                      <button
                        onClick={() => setIsCodeExportOpen(true)}
                        className="flex items-center gap-1.5 border border-[#E5DACB] bg-white text-neutral-800 px-3.5 py-1.5 text-xs font-medium hover:bg-neutral-50 transition rounded-none shadow-2xs"
                      >
                        <Code2 size={14} />
                        Export code
                      </button>

                      <button
                        onClick={duplicatePrompt}
                        className="border border-[#E5DACB] bg-white text-neutral-800 px-3.5 py-1.5 text-xs font-medium hover:bg-neutral-50 transition rounded-none shadow-2xs"
                      >
                        Duplicate
                      </button>

                      <button
                        onClick={() => deletePrompt()}
                        className="flex items-center gap-1.5 border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition ml-auto rounded-none shadow-2xs"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Variables Configuration Box (Light warm color: #FAF7F2, Sharp Edges) */}
                <div className="border border-[#E5DACB] bg-[#FAF7F2] rounded-none shadow-xs overflow-hidden text-neutral-900">
                  <div className="px-5 py-4 border-b border-[#E5DACB] bg-[#F2EAE0]">
                    <h2 className="text-sm font-semibold text-neutral-900">Variables</h2>
                    <p className="text-xs text-neutral-800 mt-0.5">
                      Supply values for tokens detected in your prompt.
                    </p>
                  </div>

                  <div className="p-5">
                    {detectedVariables.length > 0 ? (
                      <>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {detectedVariables.map((variable) => {
                            const isMissing = !variables[variable]?.trim();

                            return (
                              <div key={variable}>
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-mono font-semibold text-neutral-900">
                                    {`{{${variable}}}`}
                                  </label>
                                  {isMissing ? (
                                    <span className="text-[10px] text-red-700 font-bold bg-red-100/80 px-2 py-0.5 rounded-none">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-green-800 font-semibold bg-green-100/80 px-2 py-0.5 rounded-none">
                                      Filled
                                    </span>
                                  )}
                                </div>

                                <input
                                  value={variables[variable] || ""}
                                  onChange={(e) =>
                                    setVariables((previous) => ({
                                      ...previous,
                                      [variable]: e.target.value,
                                    }))
                                  }
                                  placeholder={`Enter ${variable}`}
                                  className={`w-full border px-3 py-2 mt-1.5 text-xs outline-none rounded-none bg-white text-neutral-900 ${
                                    isMissing
                                      ? "border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                                      : "border-[#E5DACB] focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34]"
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {missingVariables.length > 0 ? (
                          <div className="mt-4 border border-red-300 bg-red-100/70 p-3 rounded-none">
                            <p className="text-xs text-red-800 font-medium">
                              {missingVariables.length} variable(s) need attention:{" "}
                              {missingVariables.join(", ")}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 flex items-center gap-2 border border-green-300 bg-green-100/70 p-2.5 rounded-none">
                            <Check size={14} className="text-green-800" />
                            <p className="text-xs text-green-900 font-semibold">
                              All variables filled. Ready to run or export.
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-neutral-800 py-3">
                        No variables detected. Add tokens like {"{{topic}}"} or{" "}
                        {"{{role}}"} in your prompt content above to customize
                        dynamically.
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Live Interpolated Preview Box (Light warm color: #FAF7F2, Sharp Edges) */}
                <div className="border border-[#E5DACB] bg-[#FAF7F2] rounded-none shadow-xs overflow-hidden text-neutral-900">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5DACB] bg-[#F2EAE0]">
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900">Live Preview</h2>
                      <p className="text-xs text-neutral-800 mt-0.5">
                        Interpolated output ready for execution.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-neutral-800 font-medium hidden sm:inline">
                        {previewWordCount} words
                      </span>
                      <button
                        onClick={copyPrompt}
                        className="text-xs flex items-center gap-1.5 border border-[#E5DACB] bg-white px-3 py-1.5 hover:bg-neutral-50 rounded-none text-neutral-800 font-medium shadow-2xs transition"
                      >
                        <Copy size={13} />
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm leading-7 text-neutral-900 min-h-24 bg-white p-4 border border-[#E5DACB] rounded-none shadow-2xs">
                      {preview || "Your prompt preview will appear here."}
                    </pre>
                  </div>
                </div>

                {/* 4. Playground AI Runner Box (Light warm color: #FAF7F2, Sharp Edges, Tactile Button #df5f34) */}
                <AIRunner
                  promptText={preview}
                  settings={aiSettings}
                  onUpdateSettings={(updated) =>
                    setAISettings((prev) => ({ ...prev, ...updated }))
                  }
                  onOpenKeySettings={() => setIsAISettingsOpen(true)}
                  onShowToast={showToast}
                />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        settings={aiSettings}
        onSave={(updated) => {
          setAISettings((prev) => ({ ...prev, ...updated }));
          showToast("AI provider settings saved.", "success");
        }}
        onClose={() => setIsAISettingsOpen(false)}
      />

      {/* Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeExportOpen}
        promptText={preview}
        settings={aiSettings}
        onClose={() => setIsCodeExportOpen(false)}
        onShowToast={showToast}
      />

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={confirmModal.onConfirm}
        onCancel={() =>
          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </SidebarProvider>
  );
}

export default App;
