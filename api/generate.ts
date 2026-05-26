import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

// System instructions for the meeting assistant
const SYSTEM_INSTRUCTIONS = `你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。
請務必遵守以下輸出格式要求：

1. **會議主題與時間**：擷取會議的主題與時間。
2. **與會者**：列出參與會議的人員。
3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { content, style, provider } = req.body as {
    content?: string;
    style?: string;
    provider?: string;
  };

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ error: "會議內容不能為空" });
  }

  // Build style instruction
  let styleInstruction = "";
  switch (style) {
    case "standard":
      styleInstruction = "請完整套用上述 1~5 點的結構進行完整繁體中文摘要與英文對譯。";
      break;
    case "concise":
      styleInstruction = "提供超精簡的摘要，只保留最重要的 3-5 個關鍵結論，去除冗長對話。仍需包含 1~5 點的核心結構。";
      break;
    case "detailed":
      styleInstruction = "提供深度的條列式會議紀錄，詳細還原討論過程、各方論點以及各項工作細節。仍需符合 1~5 點的基礎框架。";
      break;
    case "action-only":
      styleInstruction = "專注於行動方針（Action Items），詳細列出執行項目、負責人、預定完成時間。其他的 1~4 點可以簡配，主要聚焦於待辦事項。";
      break;
    case "translation-only":
      styleInstruction = "主要以整段逐字翻譯為主，並使用 Markdown 整理格式使其好讀。";
      break;
    default:
      styleInstruction = "請完整套用預設的 1~5 點結構，做好中英對照。";
  }

  const systemInstruction =
    style === "standard"
      ? SYSTEM_INSTRUCTIONS
      : `${SYSTEM_INSTRUCTIONS}\n\n附加風格微調需求：${styleInstruction}`;

  const userPrompt = `以下是我們提供的會議紀錄或逐字稿，請為我們進行總結與翻譯處理：\n\n${content}`;

  try {
    let result = "";
    let modelUsed = "";

    if (provider === "nvidia") {
      // ── NVIDIA path via OpenAI-compatible client ──
      const nvApiKey = process.env.NVIDIA_API_KEY;
      if (!nvApiKey) {
        return res.status(500).json({ error: "伺服器尚未配置 NVIDIA_API_KEY 環境變數。" });
      }

      const openai = new OpenAI({
        apiKey: nvApiKey,
        baseURL: "https://integrate.api.nvidia.com/v1",
      });

      modelUsed = "nvidia/nemotron-mini-4b-instruct";

      const completion = await openai.chat.completions.create({
        model: modelUsed,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      });

      result = completion.choices[0]?.message?.content ?? "";
    } else {
      // ── Gemini path (default) ──
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        return res.status(500).json({ error: "伺服器尚未配置 GEMINI_API_KEY 環境變數。" });
      }

      modelUsed = "gemini-2.5-flash-lite";
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });

      const response = await ai.models.generateContent({
        model: modelUsed,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      result = response.text ?? "";
    }

    if (!result) {
      throw new Error("AI 服務沒有返回任何文字結果，請稍後再試。");
    }

    return res.status(200).json({ success: true, result, modelUsed });
  } catch (error: any) {
    console.error("[API /api/generate] Error:", error);
    return res.status(500).json({
      error: error.message || "處理會議記錄時發生未知錯誤，請稍後再試。",
    });
  }
}
