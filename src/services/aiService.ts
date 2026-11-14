import type { AIProvider, AISettings } from "../types/prompt";

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: "mock",
  geminiKey: "",
  openaiKey: "",
  groqKey: "",
  model: "mock-fast",
  temperature: 0.7,
  maxTokens: 1024,
  systemInstruction: "You are a helpful, precise, and thoughtful AI assistant.",
};

export const PROVIDER_MODELS: Record<AIProvider, { id: string; name: string; description: string }[]> = {
  mock: [
    { id: "mock-fast", name: "Mock Assistant (Fast)", description: "Instant local simulation, no API key needed" },
    { id: "mock-pro", name: "Mock Reasoning (Detailed)", description: "In-depth simulated response with breakdown" },
  ],
  gemini: [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Google's ultra-fast, intelligent multimodal model" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Fast and versatile performance" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Complex reasoning and in-depth responses" },
  ],
  openai: [
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Affordable, intelligent small model" },
    { id: "gpt-4o", name: "GPT-4o", description: "OpenAI's flagship omni model" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", description: "Ultra-fast inference via Groq LPU" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", description: "Blazing fast lightweight model" },
  ],
};

function generateMockResponse(prompt: string, model: string, temp: number): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("javascript") || lower.includes("code") || lower.includes("python") || lower.includes("review")) {
    return `### 💻 Code Analysis & Solution\n\nBased on your prompt, here is a clean, practical breakdown:\n\n\`\`\`javascript\n// Core Implementation Example\nfunction processData(items, options = {}) {\n  const { filterActive = true, sortBy = 'id' } = options;\n  \n  return items\n    .filter(item => filterActive ? Boolean(item.active) : true)\n    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));\n}\n\n// Usage demonstration\nconst sampleData = [\n  { id: 101, name: "Alpha", active: true },\n  { id: 102, name: "Beta", active: false },\n  { id: 103, name: "Gamma", active: true }\n];\n\nconsole.log(processData(sampleData));\n\`\`\`\n\n**Key Takeaways:**\n- Handled edge cases with default argument destructuring.\n- Predictable O(n log n) sorting performance.\n- Modular structure ready for unit testing.`;
  }

  if (lower.includes("interview") || lower.includes("question")) {
    return `### 🎯 Technical Interview Session\n\nWelcome! Here is your structured interview assessment:\n\n1. **Core Concept:** Can you walk me through how execution context and lexical environment interact in modern engines?\n2. **Practical Scenario:** Suppose you notice an unexpected memory leak in long-running single-page applications. Which profiling tools and patterns would you use to trace it?\n3. **Trade-offs:** How do you balance runtime memoization against garbage collection pressure?\n\n*Take your time to structure your answer using the STAR (Situation, Task, Action, Result) method.*`;
  }

  if (lower.includes("email") || lower.includes("writing") || lower.includes("post") || lower.includes("content")) {
    return `**Subject:** Project Roadmap Update & Next Milestones\n\nHi Team,\n\nI wanted to share a brief update regarding our recent progress and the key priorities on deck for this sprint.\n\n### Highlights\n- Successfully delivered the core playground architecture with responsive live previews.\n- Integrated multi-provider LLM support and variable parameter controls.\n\n### Next Steps\n1. Finalize end-to-end integration testing.\n2. Review test coverage and UX feedback.\n\nPlease feel free to reply directly with questions or suggestions.\n\nBest regards,\nEngineering Team`;
  }

  return `### Response generated for your prompt\n\nHere is a structured response reflecting your configuration (temperature: ${temp}, model: ${model}):\n\n- **Prompt Summary:** Your request has been parsed and structured into actionable output.\n- **Clarity & Focus:** Variables were successfully interpolated into the context.\n- **Recommendation:** You can connect real API keys (Gemini, OpenAI, or Groq) in Settings to test this prompt against live production models anytime!`;
}

export async function executePrompt(
  promptText: string,
  settings: AISettings
): Promise<{ output: string; latencyMs: number; provider: AIProvider; model: string }> {
  const startTime = performance.now();

  if (settings.provider === "mock") {
    // Simulate network latency (between 400ms and 800ms)
    await new Promise((resolve) => setTimeout(resolve, 600));
    const output = generateMockResponse(promptText, settings.model, settings.temperature);
    const latencyMs = Math.round(performance.now() - startTime);
    return { output, latencyMs, provider: "mock", model: settings.model };
  }

  if (settings.provider === "gemini") {
    if (!settings.geminiKey?.trim()) {
      throw new Error("Gemini API key is required. Please add your key in AI Settings.");
    }

    const modelName = settings.model || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
      settings.geminiKey.trim()
    )}`;

    const body: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens,
      },
    };

    if (settings.systemInstruction?.trim()) {
      body.systemInstruction = {
        parts: [{ text: settings.systemInstruction.trim() }],
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `Gemini API error (${response.status})`);
    }

    const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!output) {
      throw new Error("No text returned by the model.");
    }

    const latencyMs = Math.round(performance.now() - startTime);
    return { output, latencyMs, provider: "gemini", model: modelName };
  }

  if (settings.provider === "openai") {
    if (!settings.openaiKey?.trim()) {
      throw new Error("OpenAI API key is required. Please add your key in AI Settings.");
    }

    const modelName = settings.model || "gpt-4o-mini";
    const messages: { role: string; content: string }[] = [];

    if (settings.systemInstruction?.trim()) {
      messages.push({ role: "system", content: settings.systemInstruction.trim() });
    }
    messages.push({ role: "user", content: promptText });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openaiKey.trim()}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `OpenAI API error (${response.status})`);
    }

    const output = data.choices?.[0]?.message?.content;
    if (!output) {
      throw new Error("No response returned by OpenAI.");
    }

    const latencyMs = Math.round(performance.now() - startTime);
    return { output, latencyMs, provider: "openai", model: modelName };
  }

  if (settings.provider === "groq") {
    if (!settings.groqKey?.trim()) {
      throw new Error("Groq API key is required. Please add your key in AI Settings.");
    }

    const modelName = settings.model || "llama-3.3-70b-versatile";
    const messages: { role: string; content: string }[] = [];

    if (settings.systemInstruction?.trim()) {
      messages.push({ role: "system", content: settings.systemInstruction.trim() });
    }
    messages.push({ role: "user", content: promptText });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.groqKey.trim()}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `Groq API error (${response.status})`);
    }

    const output = data.choices?.[0]?.message?.content;
    if (!output) {
      throw new Error("No response returned by Groq.");
    }

    const latencyMs = Math.round(performance.now() - startTime);
    return { output, latencyMs, provider: "groq", model: modelName };
  }

  throw new Error(`Unsupported provider: ${settings.provider}`);
}

