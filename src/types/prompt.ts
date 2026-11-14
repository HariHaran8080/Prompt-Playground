export type Prompt = {
  id: string;
  title: string;
  content: string;
  category: string;
  favorite: boolean;
  systemInstruction?: string;
  createdAt?: number;
  updatedAt?: number;
};

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  systemInstruction?: string;
};

export type AIProvider = "mock" | "gemini" | "openai" | "groq";

export type AISettings = {
  provider: AIProvider;
  geminiKey: string;
  openaiKey: string;
  groqKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemInstruction: string;
};

export type ExecutionResult = {
  status: "idle" | "loading" | "success" | "error";
  output: string;
  latencyMs?: number;
  provider?: AIProvider;
  model?: string;
  error?: string;
  timestamp?: number;
};

export type Toast = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};
