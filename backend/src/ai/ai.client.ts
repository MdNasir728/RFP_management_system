import axios from "axios";
import { env } from "../config/env";

/**
 * Call local Ollama LLM
 * HARD DEPENDENCY: Ollama must be running
 */
export const callOllama = async (
  prompt: string,
  systemPrompt?: string
): Promise<string> => {
  if (!env.OLLAMA_API_URL || !env.OLLAMA_MODEL) {
    throw new Error("Ollama env vars missing");
  }


  const response = await axios.post(
    `${env.OLLAMA_API_URL}/api/chat`,
    {
      model: env.OLLAMA_MODEL,
      messages: [
        ...(systemPrompt
          ? [{ role: "system", content: systemPrompt }]
          : []),
        { role: "user", content: prompt }
      ],
      stream: false
    },
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  const content = response.data?.message?.content;

  if (!content) {
    throw new Error("Empty response from Ollama");
  }

  return content;
};
