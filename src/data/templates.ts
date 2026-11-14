
import type { PromptTemplate } from "../types/prompt";

export const templates: PromptTemplate[] = [
  {
    id: "javascript-tutor",
    title: "JavaScript Learning Assistant",
    description: "Learn programming concepts with practical examples and explanations.",
    category: "Development",
    content: `Act as a {{role}}.

Explain {{topic}} in a {{level}} manner.

Include:
1. A simple explanation
2. Practical JavaScript examples
3. Common mistakes
4. Interview questions
5. A coding task`,
  },
  {
    id: "code-review",
    title: "Code Review Assistant",
    description: "Review code for quality, readability and performance.",
    category: "Development",
    content: `Act as a senior software engineer.

Review the following code:

{{code}}

Analyze:
1. Code quality
2. Performance
3. Potential bugs
4. Security issues
5. Recommended improvements

Provide an improved version of the code.`,
  },
  {
    id: "technical-interview",
    title: "Technical Interview Preparation",
    description: "Prepare for technical interviews with structured questions.",
    category: "Development",
    content: `Act as a technical interviewer.

Conduct an interview about {{topic}} for a {{experience}} developer.

Ask {{number}} questions one at a time.

Evaluate my answers and explain how I can improve.`,
  },
  {
    id: "content-writer",
    title: "Professional Content Writer",
    description: "Create professional content for articles and social platforms.",
    category: "Writing",
    content: `Act as a professional content writer.

Write a {{format}} about {{subject}}.

Tone: {{tone}}

Requirements:
- Clear and natural language
- Well-structured content
- Avoid unnecessary words
- Keep the target audience in mind`,
  },
  {
    id: "email-writer",
    title: "Professional Email Writer",
    description: "Draft clear and professional workplace emails.",
    category: "Writing",
    content: `Act as a professional communication specialist.

Write an email to {{recipient}}.

Purpose: {{purpose}}

Tone: {{tone}}

Keep the email professional, concise and easy to understand.`,
  },
  {
    id: "concept-explainer",
    title: "Concept Explainer",
    description: "Break down complex topics into easy-to-understand explanations.",
    category: "Learning",
    content: `Act as an experienced educator.

Explain {{topic}} to someone at a {{level}} level.

Include:
- Core concepts
- Real-world examples
- Step-by-step explanation
- Common misconceptions
- A short knowledge check`,
  },
];
