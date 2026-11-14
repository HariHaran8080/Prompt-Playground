import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarTrigger,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar";
import logoImage from "../assets/logo.jpg";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  FileText,
  Bookmark,
  LayoutTemplate,
  Folder,
  GalleryVerticalEnd,
  MoreHorizontal,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Key,
  Download,
  Upload,
  Code2,
  Search,
  Sparkle,
  User,
} from "lucide-react";
import type { Prompt } from "../types/prompt";

type Props = {
  activeView: string;
  onSelectView: (view: string) => void;
  onCreatePrompt: () => void;
  prompts: Prompt[];
  activePromptId: string;
  onSelectPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (prompt: Prompt) => void;
  onToggleFavorite: (prompt: Prompt) => void;
  onOpenAISettings: () => void;
  onOpenCodeExport: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  search: string;
  onSearchChange: (value: string) => void;
};

const TEAMS = [
  {
    name: "Prompt Playground",
    logoImage: logoImage,
    plan: "For All Time • Always",
    logo: GalleryVerticalEnd,
  },
  {
    name: "Engineering Corp",
    logo: AudioWaveform,
    plan: "Team",
  },
  {
    name: "Personal Lab",
    logo: Command,
    plan: "Free",
  },
];

const USER_DATA = {
  name: "Hariharan",
  email: "hariharan@example.com",
};

export function AppSidebar({
  activeView,
  onSelectView,
  onCreatePrompt,
  prompts,
  activePromptId,
  onSelectPrompt,
  onDeletePrompt,
  onToggleFavorite,
  onOpenAISettings,
  onOpenCodeExport,
  onExportJSON,
  onImportJSON,
  search,
  onSearchChange,
}: Props) {
  const isMobile = useIsMobile();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";
  const [activeTeam, setActiveTeam] = React.useState(TEAMS[0]);

  const filteredPrompts = React.useMemo(() => {
    if (!search.trim()) return prompts;
    const query = search.toLowerCase();
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [prompts, search]);

  return (
    <Sidebar collapsible="icon" className="bg-[#fdfbf7] border-r border-[#ede4d8]">
      {/* Sidebar Header with Logo & Menu Toggle Icon parallel inside left column */}
      <SidebarHeader className="border-b border-[#ede4d8] p-2 bg-[#fdfbf7]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-1 w-full">
            <div className="flex-1 min-w-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-[#f5eedf] data-[state=open]:text-black hover:bg-[#f5eedf]"
                      >
                        <div className="size-9 shrink-0 flex items-center justify-center">
                          {activeTeam.logoImage ? (
                            <img src={activeTeam.logoImage} alt="Logo" className="size-full object-contain" />
                          ) : (
                            <activeTeam.logo className="size-4 text-neutral-800" />
                          )}
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                          <span className="truncate font-semibold text-neutral-900">
                            {activeTeam.name}
                          </span>
                          <span className="truncate text-[11px] text-neutral-500">
                            {activeTeam.plan}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-neutral-400" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 rounded-none bg-white border border-[#ede4d8]"
                      align="start"
                      side={isMobile ? "bottom" : "right"}
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Workspaces
                      </DropdownMenuLabel>
                      {TEAMS.map((team, index) => (
                        <DropdownMenuItem
                          key={team.name}
                          onClick={() => setActiveTeam(team)}
                          className="gap-2 p-2 hover:bg-[#fdfbf7] rounded-none cursor-pointer"
                        >
                          <div className="size-6 shrink-0 flex items-center justify-center">
                            {team.logoImage ? (
                              <img src={team.logoImage} alt={team.name} className="size-full object-contain" />
                            ) : (
                              team.logo && <team.logo className="size-3.5 shrink-0 text-neutral-800" />
                            )}
                          </div>
                          <span className="truncate">{team.name}</span>
                          <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onCreatePrompt}
                        className="gap-2 p-2 rounded-none cursor-pointer"
                      >
                        <div className="flex size-6 items-center justify-center rounded-none border bg-background">
                          <Plus className="size-3.5" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          New prompt
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            {/* Menu icon parallel to Prompt Playground in left column */}
            <SidebarTrigger className="shrink-0 size-8 border border-[#ede4d8] bg-white text-neutral-700 hover:text-black hover:bg-[#f5eedf] rounded-none transition" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className="size-10 shrink-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition"
              onClick={() => toggleSidebar()}
              title="Prompt Playground - Click to expand"
            >
              <img src={logoImage} alt="Prompt Playground Logo" className="size-full object-contain" />
            </div>
            <SidebarTrigger className="size-8 border border-[#ede4d8] bg-white text-neutral-700 hover:text-black hover:bg-[#f5eedf] rounded-none transition" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-[#fdfbf7]">
        {/* + New Prompt Button */}
        {!isCollapsed ? (
          <div className="px-2 pt-1">
            <button
              onClick={onCreatePrompt}
              className="w-full flex items-center justify-center gap-2 bg-[#df5f34] text-white text-xs font-semibold py-2 rounded-none hover:bg-[#c94d25] active:scale-[0.98] transition shadow-xs"
            >
              <Plus size={14} />
              <span>New Prompt</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center px-1 pt-1">
            <button
              onClick={onCreatePrompt}
              title="New Prompt"
              className="size-8 flex items-center justify-center bg-[#df5f34] text-white rounded-none hover:bg-[#c94d25] active:scale-[0.98] transition shadow-xs"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {/* Search Prompts directly below + New Prompt */}
        {!isCollapsed ? (
          <div className="px-2 pt-2 pb-1">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-2.5 text-neutral-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search prompts..."
                className="w-full bg-white border border-[#ede4d8] rounded-none py-1.5 pl-8 pr-2.5 text-xs outline-none focus:border-[#df5f34] focus:ring-1 focus:ring-[#df5f34] transition text-gray-800 placeholder:text-neutral-400"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center px-1 pt-1">
            <button
              onClick={() => toggleSidebar()}
              title="Search prompts"
              className="size-8 flex items-center justify-center border border-[#ede4d8] bg-white text-neutral-600 hover:text-black hover:bg-[#f5eedf] rounded-none transition"
            >
              <Search size={14} />
            </button>
          </div>
        )}

        {/* Platform Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-500 font-semibold text-[10px] tracking-wider uppercase">
            Platform
          </SidebarGroupLabel>
          <SidebarMenu>
            {/* Playground Group */}
            <Collapsible defaultOpen={true} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Playground" className="hover:bg-[#f5eedf]">
                    <SquareTerminal />
                    <span>Playground</span>
                    <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeView === "All prompts"}
                        onClick={() => onSelectView("All prompts")}
                        className="cursor-pointer hover:bg-[#f5eedf]"
                      >
                        <FileText className="size-3.5" />
                        <span>All Prompts</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeView === "Favorites"}
                        onClick={() => onSelectView("Favorites")}
                        className="cursor-pointer hover:bg-[#f5eedf]"
                      >
                        <Bookmark className="size-3.5" />
                        <span>Favorites</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeView === "Templates"}
                        onClick={() => onSelectView("Templates")}
                        className="cursor-pointer hover:bg-[#f5eedf]"
                      >
                        <LayoutTemplate className="size-3.5" />
                        <span>Templates</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Categories Group */}
            <Collapsible defaultOpen={true} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Categories" className="hover:bg-[#f5eedf]">
                    <BookOpen />
                    <span>Categories</span>
                    <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {["Development", "Writing", "Learning"].map((cat) => (
                      <SidebarMenuSubItem key={cat}>
                        <SidebarMenuSubButton
                          isActive={activeView === cat}
                          onClick={() => onSelectView(cat)}
                          className="cursor-pointer hover:bg-[#f5eedf]"
                        >
                          <span>{cat}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* AI Models */}
            <Collapsible defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Models" className="hover:bg-[#f5eedf]">
                    <Bot />
                    <span>Models</span>
                    <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onOpenAISettings} className="cursor-pointer hover:bg-[#f5eedf]">
                        <span>Google Gemini</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onOpenAISettings} className="cursor-pointer hover:bg-[#f5eedf]">
                        <span>OpenAI GPT-4o</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onOpenAISettings} className="cursor-pointer hover:bg-[#f5eedf]">
                        <span>Groq Llama 3</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Settings & Tools */}
            <Collapsible defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Settings" className="hover:bg-[#f5eedf]">
                    <Settings2 />
                    <span>Settings & Tools</span>
                    <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onOpenAISettings} className="cursor-pointer hover:bg-[#f5eedf]">
                        <Key className="size-3.5" />
                        <span>API Keys</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onOpenCodeExport} className="cursor-pointer hover:bg-[#f5eedf]">
                        <Code2 className="size-3.5" />
                        <span>Export Code</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onExportJSON} className="cursor-pointer hover:bg-[#f5eedf]">
                        <Download className="size-3.5" />
                        <span>Export Backup</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton onClick={onImportJSON} className="cursor-pointer hover:bg-[#f5eedf]">
                        <Upload className="size-3.5" />
                        <span>Import Backup</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* Saved Prompts Section with search filter */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-500 font-semibold text-[10px] tracking-wider uppercase">
            Saved Prompts ({filteredPrompts.length})
          </SidebarGroupLabel>
          <SidebarMenu>
            {filteredPrompts.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activePromptId === item.id}
                  onClick={() => onSelectPrompt(item)}
                  className="cursor-pointer hover:bg-[#f5eedf]"
                >
                  <Sparkle className="size-3.5 shrink-0 text-[#df5f34]" />
                  <span className="truncate">{item.title || "Untitled prompt"}</span>
                  {item.favorite && (
                    <Bookmark size={11} className="ml-auto shrink-0 fill-current text-amber-500" />
                  )}
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-none bg-white border border-[#ede4d8]"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => onSelectPrompt(item)}>
                      <Folder className="text-muted-foreground mr-1.5" />
                      <span>Open Prompt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleFavorite(item)}>
                      <Bookmark className="text-muted-foreground mr-1.5" />
                      <span>{item.favorite ? "Unstar" : "Star"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeletePrompt(item)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="text-red-500 mr-1.5" />
                      <span>Delete Prompt</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}

            {filteredPrompts.length === 0 && (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No prompts match &quot;{search}&quot;
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Below in Left Column: User Profile Mail & Avatar */}
      <SidebarFooter className="border-t border-[#ede4d8] p-2 mt-auto bg-[#fdfbf7] shrink-0 sticky bottom-0 z-20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {!isCollapsed ? (
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-[#f5eedf] hover:bg-[#f5eedf]"
                  >
                    <div className="h-8 w-8 rounded-none border border-[#ede4d8] bg-white flex items-center justify-center text-neutral-500 shrink-0 shadow-2xs">
                      <User size={15} />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-neutral-900">
                        {USER_DATA.name}
                      </span>
                      <span className="truncate text-xs text-neutral-500">
                        {USER_DATA.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-neutral-400" />
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    size="lg"
                    tooltip={USER_DATA.name}
                    className="justify-center hover:bg-[#f5eedf] !p-0 h-10 w-full"
                  >
                    <div className="h-8 w-8 rounded-none border border-[#ede4d8] bg-white flex items-center justify-center text-neutral-500 shrink-0 shadow-2xs">
                      <User size={15} />
                    </div>
                  </SidebarMenuButton>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-none bg-white border border-[#ede4d8]"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="h-8 w-8 rounded-none border border-[#ede4d8] bg-white flex items-center justify-center text-neutral-500 shrink-0 shadow-2xs">
                      <User size={15} />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-neutral-900">
                        {USER_DATA.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {USER_DATA.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={onOpenAISettings} className="rounded-none">
                    <Sparkles className="mr-1.5 text-[#df5f34]" />
                    AI Provider Keys
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={onOpenCodeExport} className="rounded-none">
                    <Code2 className="mr-1.5" />
                    Export Snippets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportJSON} className="rounded-none">
                    <Download className="mr-1.5" />
                    Backup Data
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreatePrompt} className="rounded-none">
                  <Plus className="mr-1.5 text-[#df5f34]" />
                  New Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
