import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with larger limit for big transcripts
app.use(express.json({ limit: "15mb" }));

// Helper to initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("找不到 GEMINI_API_KEY 環境變數，請在 AI Studio 中設定密鑰。");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 定義專業會議記錄助理的 System Instructions 常數
const SYSTEM_INSTRUCTIONS = `你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。
請務必遵守以下輸出格式要求：

1. **會議主題與時間**：擷取會議的主題與時間。
2. **與會者**：列出參與會議的人員。
3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。`;

// REST API for meeting record summarization & translation
app.post("/api/summarize", async (req, res) => {
  const { content, style, targetLanguage, model } = req.body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ error: "會議內容不能為空" });
  }

  // Fallback to recommended gemini-3.5-flash if none provided
  const selectedModel = model || "gemini-3.5-flash";

  try {
    const ai = getGeminiClient();

    // Mapping style configurations
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

    // Configure dynamically if standard is selected, we directly inject the requested constraint
    const systemInstruction = style === "standard" 
      ? SYSTEM_INSTRUCTIONS 
      : `${SYSTEM_INSTRUCTIONS}\n\n附加風格風格微調需求：${styleInstruction}`;

    const userPrompt = `以下是我們提供的會議紀錄或逐字稿，請為我們進行總結與翻譯處理：

${content}`;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature to keep it analytical and minimize hallucinations
      },
    });

    if (!response.text) {
      throw new Error("Gemini 沒有返回任何文字結果。");
    }

    res.json({
      success: true,
      result: response.text,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "處理會議記錄時發生未知錯誤，請稍後再試。",
    });
  }
});

// Vite or Static Assets serving handler
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback error handler
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Dev Server] Running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Prod Server] Running on port ${PORT}`);
  });
}
