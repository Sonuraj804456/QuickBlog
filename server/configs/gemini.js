import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main(prompt) {
  const enhancedPrompt = `
You are a professional blog writer.
Generate a well-structured blog post in clean HTML format.

Rules:
- Use <h2> and <h3> for headings
- Use <p> for paragraphs
- Use <ul><li> for points if needed
- Keep content readable and UI-friendly
- Do NOT include markdown
- Do NOT include explanations

Topic:
${prompt}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: enhancedPrompt,
  });

  return response.text;
}

export default main;
