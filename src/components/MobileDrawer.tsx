import { X, Plus, FileText, Bookmark, LayoutTemplate, Search, Download, Upload } from "lucide-react";
import SidebarItem from "./SidebarItem";
import type { Prompt } from "../types/prompt";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
  onCreatePrompt: () => void;
  prompts: Prompt[];
  activePromptId: string;
  onSelectPrompt: (prompt: Prompt) => void;
  search: string;
  onSearchChange: (val: string) => void;
  onExportPrompts: () => void;
  onImportPrompts: () => void;
};

export default function MobileDrawer({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  onCreatePrompt,
  prompts,
  activePromptId,
  onSelectPrompt,
  search,
  onSearchChange,
  onExportPrompts,
  onImportPrompts,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white h-full flex flex-col p-5 shadow-2xl z-10 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-black text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-semibold text-sm">Prompt Playground</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 hover:bg-gray-100 text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => {
            onCreatePrompt();
            onClose();
          }}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white text-sm py-2.5 hover:bg-[#333] transition"
        >
          <Plus size={15} />
          New prompt
        </button>

        {/* Workspace views */}
        <div className="mt-6">
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">
            WORKSPACE
          </p>
          <nav className="space-y-1">
            <SidebarItem
              icon={<FileText size={16} />}
              label="All prompts"
              active={activeView === "All prompts"}
              onClick={() => {
                onSelectView("All prompts");
                onClose();
              }}
            />
            <SidebarItem
              icon={<Bookmark size={16} />}
              label="Favorites"
              active={activeView === "Favorites"}
              onClick={() => {
                onSelectView("Favorites");
                onClose();
              }}
            />
            <SidebarItem
              icon={<LayoutTemplate size={16} />}
              label="Templates"
              active={activeView === "Templates"}
              onClick={() => {
                onSelectView("Templates");
                onClose();
              }}
            />
          </nav>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">
            CATEGORIES
          </p>
          {["Development", "Writing", "Learning"].map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelectView(category);
                onClose();
              }}
              className={`w-full text-left px-3 py-2 text-sm transition ${
                activeView === category
                  ? "bg-[#f0f0f0] text-black font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Saved prompts inside mobile drawer */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">
            SAVED PROMPTS ({prompts.length})
          </p>
          <div className="relative mb-2">
            <Search
              size={14}
              className="absolute left-2.5 top-2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prompts..."
              className="w-full bg-gray-50 border border-gray-200 py-1.5 pl-8 pr-2 text-xs"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPrompt(p);
                  onClose();
                }}
                className={`w-full text-left px-2.5 py-2 text-xs transition truncate ${
                  activePromptId === p.id
                    ? "bg-gray-100 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p.title || "Untitled prompt"}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={() => {
              onExportPrompts();
              onClose();
            }}
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-black py-1.5 px-2 hover:bg-gray-50"
          >
            <Download size={14} />
            Export prompts (JSON)
          </button>
          <button
            onClick={() => {
              onImportPrompts();
              onClose();
            }}
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-black py-1.5 px-2 hover:bg-gray-50"
          >
            <Upload size={14} />
            Import prompts (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}

