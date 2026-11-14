# Prompt Studio

A client-side prompt engineering studio and evaluation workbench built with React 19, TypeScript, Tailwind CSS v4, and Motion.

---

## Overview

Prompt Studio is an interactive web platform designed for authoring, evaluating, and exporting structured prompts for Large Language Models (LLMs). The platform provides real-time token interpolation, multi-provider model execution (Google Gemini, OpenAI, Groq Cloud, and an offline simulated runtime), multi-target production code export, and local-first data persistence.

---

## Architecture and Key Capabilities

### 1. Template Authoring and Token Interpolation
* **Dynamic Token Syntax**: Real-time syntax detection and visual highlight overlays for `{{variable}}` tokens.
* **Automated Form Generation**: Parses template tokens into structured input controls with completeness state validation.
* **Synchronous Live Preview**: Interpolates runtime values into the target prompt instantaneously.
* **Statistical Metrics**: Real-time computation of character count, word count, token count, and estimated LLM token usage (~4 characters per token).

### 2. Multi-Provider Execution Engine
* **Google Gemini API**: Native client integration supporting Gemini 2.5 Flash, 1.5 Flash, and 1.5 Pro.
* **OpenAI API**: Integration supporting GPT-4o and GPT-4o-mini.
* **Groq Cloud API**: High-throughput inference integration supporting Llama 3.3 70B Versatile and Llama 3.1 8B Instant.
* **Offline Mock Runtime**: Deterministic local simulation engine for validating prompt structures without network access or API credentials.
* **Inference Parameter Tuning**: Fine-grained controls for Temperature (0.0 to 1.0), Max Output Tokens (256 to 4096), and system-level context.
* **Telemetry and Latency**: Displays execution duration in milliseconds along with active model identifiers.

### 3. Multi-Target Code Export
* Generates runnable production code snippets directly from interpolated prompts:
  * **Python**: Official Google GenAI SDK and OpenAI client implementations.
  * **TypeScript / JavaScript**: Standard Fetch API payload specifications.
  * **cURL**: Command-line HTTP request definitions.

### 4. Interface and Interaction Architecture
* **Navigation Sidebar**: Radix-based sidebar component supporting dual-state desktop dock (280px full width and 68px compact rail), workspace switching, search filtering, and off-canvas mobile drawers.
* **Micro-Interactions**: Physics-based layout transitions via Motion and tactile button state feedback.
* **Design System**: Warm editorial theme utilizing high-contrast light linen containers, terracotta primary actions, and sharp geometric framing.

### 5. Security and Data Privacy
* **Local-First Architecture**: All prompt templates, collections, and configurations are persisted exclusively to browser `localStorage`.
* **Zero Intermediary Backend**: API requests to AI providers are routed directly from the client browser to provider endpoints. No user data or credentials transit through external application servers.
* **Data Portability**: JSON export and schema-validated import utilities for complete local backup and restoration.

---

## Technical Stack

| Component | Technology | Description |
|---|---|---|
| Framework | React 19 | Core UI component model and reactive state |
| Language | TypeScript 5 | End-to-end type safety and interface definitions |
| Build Tool | Vite 8 | Development server and production bundling |
| Styling | Tailwind CSS v4 | CSS variable configuration and utility layout styling |
| Motion Engine | Motion | Layout-measured transitions and spring physics |
| Icons | Lucide React | Modular SVG icon architecture |

---

## Getting Started

### Prerequisites
* Node.js version 18.0.0 or higher
* npm, pnpm, or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/<username>/prompt-playground.git
   cd prompt-playground
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Verify production build:
   ```bash
   npm run build
   ```

5. Run static lint analysis:
   ```bash
   npm run lint
   ```

---

## Provider Configuration

API credentials are optional. The platform includes a Simulated AI mode that functions immediately without credentials. To connect live foundation models:

1. Select **AI Settings** from the application navigation header.
2. Enter the appropriate API key:
   * Google Gemini: [Google AI Studio](https://aistudio.google.com/)
   * OpenAI: [OpenAI Platform](https://platform.openai.com/)
   * Groq: [Groq Console](https://console.groq.com/)
3. Click **Save Settings**. Keys are stored exclusively in the client browser's local storage and are never committed to version control.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
