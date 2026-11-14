
import { useMemo, useState } from "react";
import { Search, FileText, ArrowUpRight, X } from "lucide-react";
import { templates } from "../data/templates";
import type { PromptTemplate } from "../types/prompt";

type Props = {
  onUse: (template: PromptTemplate) => void;
};

const categories = ["All", "Development", "Writing", "Learning"];

export default function TemplateLibrary({ onUse }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<PromptTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        `${template.title} ${template.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || template.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full border border-gray-200 pl-9 pr-3 py-2.5 text-sm"
          />
        </div>

        <span className="text-xs text-gray-400">
          {filteredTemplates.length} templates
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`px-4 py-2 text-xs border transition ${
              category === item
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-black"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <article
              key={template.id}
              className="border border-gray-200 p-5 flex flex-col min-h-[220px] hover:border-gray-500 transition"
            >
              <div className="flex justify-between items-center mb-5">
                <FileText size={18} className="text-gray-500" />

                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  {template.category}
                </span>
              </div>

              <h3 className="font-semibold text-sm">
                {template.title}
              </h3>

              <p className="text-xs text-gray-500 leading-6 mt-2 flex-1">
                {template.description}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelected(template)}
                  className="text-xs text-gray-500 hover:text-black"
                >
                  Preview
                </button>

                <button
                  onClick={() => onUse(template)}
                  className="flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  Use template
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 py-16 text-center">
          <p className="text-sm font-medium">No templates found</p>
          <p className="text-xs text-gray-400 mt-2">
            Try another search or category.
          </p>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-400">
                  {selected.category}
                </p>
                <h2 className="font-semibold mt-1">
                  {selected.title}
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close preview"
                className="p-2 hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-500 mb-5">
                {selected.description}
              </p>

              <pre className="whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 p-4 text-sm leading-7 font-mono">
                {selected.content}
              </pre>

              <button
                onClick={() => {
                  onUse(selected);
                  setSelected(null);
                }}
                className="w-full bg-black text-white py-3 text-sm mt-5 hover:bg-gray-800"
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
