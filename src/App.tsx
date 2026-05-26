import { useState } from "react";
import React from "react";
import { 
  FileText, 
  Sparkles, 
  Languages, 
  Settings, 
  Clipboard, 
  ClipboardCheck, 
  Download, 
  BookOpen, 
  Trash2, 
  UserCheck, 
  Clock, 
  FileCheck2, 
  AlertCircle,
  Cpu
} from "lucide-react";
import Markdown from "react-markdown";

import Header from "./components/Header";
import LoadingIndicator from "./components/LoadingIndicator";
import { MEETING_PRESETS, MeetingPreset } from "./Presets";

export default function App() {
  // Application State
  const [inputText, setInputText] = useState("");
  const [outputStyle, setOutputStyle] = useState("standard");
  const [targetLanguage, setTargetLanguage] = useState("zh");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash");
  const [actualModelUsed, setActualModelUsed] = useState("gemini-3.5-flash");
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Stats calculation
  const charCount = inputText.length;
  const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;
  const estSpeakingTime = Math.ceil(charCount / 300); // Average human speaks ~300 Chinese chars per minute

  // Load Preset Handler
  const handleLoadPreset = (preset: MeetingPreset) => {
    setInputText(preset.content);
    setApiResult(null);
    setErrorMsg(null);
  };

  // Submit Handler to full-stack endpoint
  const handleProcessMeeting = async () => {
    if (!inputText.trim()) {
      setErrorMsg("請在輸入框中貼上一些會議文字！");
      return;
    }

    setIsLoading(true);
    setApiResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: inputText,
          style: outputStyle,
          targetLanguage: targetLanguage,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "伺服器處理時發生錯誤");
      }

      setApiResult(data.result);
      if (data.modelUsed) {
        setActualModelUsed(data.modelUsed);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "無法連線至後端服務，請確認環境設定好並且 API Key 已正確輸入。");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to Clipboard Action
  const handleCopyToClipboard = async () => {
    if (!apiResult) return;
    try {
      await navigator.clipboard.writeText(apiResult);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("無法複製文字", err);
    }
  };

  // Export as Markdown File Action
  const handleDownloadMarkdown = () => {
    if (!apiResult) return;
    
    // Formatting a tidy filename
    const date = new Date().toISOString().split("T")[0];
    const filename = `AI_會議紀錄_總結報告_${date}.md`;
    
    const blob = new Blob([apiResult], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800" id="meeting-app-root">
      {/* Header Bar */}
      <Header />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inputs, Presets & Action Options (7 Columns on large screens) */}
        <section className="lg:col-span-6 space-y-6 flex flex-col h-full" id="workspace-inputs">
          
          {/* Section: Presets / Fast Loading */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <span>快速測試！載入範例逐字稿</span>
            </h2>
            <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
              尚未準備好會議記錄？點選下方預設的情境模板，系統會自動填入，方便您立即體驗 AI 會後智慧摘要：
            </p>
            <div className="grid grid-cols-1 gap-2">
              {MEETING_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleLoadPreset(p)}
                  className="flex items-start text-left p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs bg-white text-slate-700"
                  id={`btn-preset-${p.id}`}
                >
                  <span className="flex-1 font-medium text-slate-900 block truncate">{p.title}</span>
                  <span className="ml-2 block text-2xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">{p.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Main Transcripts / Notes Textarea */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span>請在此貼上「會議記錄」或者是「語音逐字稿」</span>
              </h2>
              {inputText && (
                <button 
                  onClick={() => { setInputText(""); setApiResult(null); }}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center space-x-1 font-medium bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md transition-colors"
                  id="btn-clear-transcript"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>清除內容</span>
                </button>
              )}
            </div>

            {/* Textarea container */}
            <div className="relative flex-1 min-h-[320px] flex flex-col">
              <textarea
                placeholder="在此編輯或貼上您的會議記錄文字... (例如發言人對話紀錄、專案討論重點、語用手稿)"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full flex-1 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-100 focus:outline-hidden text-sm leading-relaxed text-slate-700 font-sans resize-none placeholder-slate-400 bg-slate-50/50"
                id="meeting-transcript-textarea"
              />
              
              {/* Floating counts inside textarea footer */}
              <div className="flex justify-between items-center border-t border-slate-100 bg-slate-50/70 p-3 rounded-b-xl text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <span>字數：<strong className="text-slate-700 font-mono">{charCount}</strong> 字</span>
                  <span className="hidden sm:inline">單字數：<strong className="text-slate-700 font-mono">{wordCount}</strong></span>
                </div>
                {charCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>預估錄音/朗讀：約 <strong className="text-slate-700 font-mono">{estSpeakingTime}</strong> 分鐘</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Output Preferences & Triggers */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
              <Settings className="h-4 w-4 text-indigo-500" />
              <span>第三步：AI 生成格式與目標翻譯語系設定</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dropdown: Core Model Selection */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center space-x-1">
                  <Cpu className="h-3.5 w-3.5 text-indigo-550 mr-0.5" />
                  <span>核心 AI 模型 (LLM Model)</span>
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-hidden text-xs text-slate-700 bg-white font-medium shadow-xs"
                  id="select-core-model"
                >
                  <option value="gemini-3.5-flash">🚀 Gemini 3.5 Flash (預設)</option>
                  <option value="gemini-3.1-flash-lite">⚡ Gemini 3.1 Lite (極速型)</option>
                  <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (付費級高推理)</option>
                </select>
              </div>

              {/* Dropdown: Output Format Style */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center space-x-1">
                  <FileCheck2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>整理風格 (Output Style)</span>
                </label>
                <select
                  value={outputStyle}
                  onChange={(e) => setOutputStyle(e.target.value)}
                  className="p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-hidden text-xs text-slate-700 bg-white shadow-xs"
                  id="select-output-style"
                >
                  <option value="standard">📌 標準商務摘要與翻譯 (預設)</option>
                  <option value="concise">⚡ 精簡決策記錄 (3-5 條黃金大綱)</option>
                  <option value="detailed">📋 深度完整會議記錄 (高度還原脈絡)</option>
                  <option value="action-only">🎯 只生成待辦清單 (Action Items)</option>
                  <option value="translation-only">✏️ 逐字純翻譯整理 (不大幅壓縮)</option>
                </select>
              </div>

              {/* Dropdown: Target Languages to Translate */}
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center space-x-1">
                  <Languages className="h-3.5 w-3.5 text-violet-500" />
                  <span>目標主力語系 (Language)</span>
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-hidden text-xs text-slate-700 bg-white shadow-xs"
                  id="select-target-language"
                >
                  <option value="zh">繁體中文 (Traditional Chinese)</option>
                  <option value="en">English (英文)</option>
                  <option value="ja">日本語 (日文)</option>
                  <option value="ko">한국어 (韓文)</option>
                  <option value="es">Español (西班牙文)</option>
                  <option value="fr">Français (法文)</option>
                </select>
              </div>
            </div>

            {/* Hint message specifically for the Pro model */}
            {selectedModel === "gemini-3.1-pro-preview" && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-xs flex items-start space-x-2 animate-pulse" id="pro-model-hint">
                <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-indigo-700">
                  您已選取 <strong>Gemini 3.1 Pro (付費級)</strong>。此模型具備極強的推理與多語言辨識對照能力。請確保您的 AI Studio 帳戶已配置足夠的配額支援。
                </p>
              </div>
            )}

            {/* ERROR ALERT DISPLAY (if any) */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-800 text-xs flex items-start space-x-2" id="error-alert">
                <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">系統提醒</span>
                  <p className="leading-relaxed text-rose-700">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* GENERATE SUBMIT BUTTON */}
            <button
              onClick={handleProcessMeeting}
              disabled={isLoading || !inputText.trim()}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all duration-300 flex items-center justify-center space-x-2 text-white ${
                isLoading 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : !inputText.trim()
                    ? "bg-slate-300 shadow-none cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-100"
              }`}
              id="btn-generate-and-translate"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>
                {isLoading 
                  ? "AI 祕書正在進行提煉與多國翻譯中..." 
                  : "✨ 自動提煉智慧摘要與多國語系翻譯"
                }
              </span>
            </button>
          </div>
        </section>

        {/* Right Side: AI Generated Multi-Format Summary & Download (5 Columns) */}
        <section className="lg:col-span-6 flex flex-col h-full" id="workspace-output">
          
          {/* Main Output Box container */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col h-full min-h-[450px]">
            
            {/* Header of Output Section */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">AI 智慧會議報告輸出區</h2>
                  <p className="text-2xs text-slate-400">系統即時生成、格式安全保障</p>
                </div>
              </div>
              
              {/* Copy and Export action buttons - enabled only when AI reports exist */}
              {apiResult && !isLoading && (
                <div className="flex items-center space-x-2">
                  {/* One click Copy */}
                  <button
                    onClick={handleCopyToClipboard}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all ${
                      isCopied 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                    title="複製整份報告為 Markdown"
                    id="btn-copy-to-clipboard"
                  >
                    {isCopied ? (
                      <>
                        <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                        <span>已複製！</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3.5 w-3.5 text-slate-400" />
                        <span>一鍵複製</span>
                      </>
                    )}
                  </button>

                  {/* One click Export as standard document */}
                  <button
                    onClick={handleDownloadMarkdown}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
                    title="下載 .md 格式會議記錄"
                    id="btn-download-md"
                  >
                    <Download className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="hidden sm:inline">下載 MD</span>
                  </button>
                </div>
              )}
            </div>

            {/* Outer box of content body depending on runtime states */}
            <div className="flex-1 overflow-y-auto max-h-[70vh] pr-1" id="output-content-root">
              {isLoading ? (
                /* Spinner Active Carousel State */
                <div className="flex items-center justify-center h-full">
                  <LoadingIndicator />
                </div>
              ) : apiResult ? (
                /* Dynamic Markdown Result Window */
                <article className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed" id="markdown-container">
                  <Markdown
                    components={{
                      h1: ({node, ...props}) => (
                        <h1 className="text-xl font-bold text-slate-900 mt-5 mb-3 pb-2 border-b border-slate-100 flex items-center space-x-2" {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 className="text-base font-bold text-slate-800 mt-6 mb-2.5 pb-1 flex items-center border-l-4 border-indigo-500 pl-2.5 bg-slate-50 py-1" {...props} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2 flex items-center" {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className="mb-3 text-slate-600 leading-relaxed text-xs sm:text-sm" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-600 text-xs sm:text-sm" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol className="list-decimal pl-5 mb-4 space-y-2 text-slate-600 text-xs sm:text-sm" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="text-slate-600 text-xs sm:text-sm" {...props} />
                      ),
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-indigo-200 pl-4 py-1.5 my-4 bg-indigo-50/50 rounded-r text-slate-600 italic text-xs sm:text-sm" {...props} />
                      ),
                      table: ({node, ...props}) => (
                        <div className="my-4 overflow-x-auto rounded-lg border border-slate-150">
                          <table className="min-w-full divide-y divide-slate-200" {...props} />
                        </div>
                      ),
                      thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                      tr: ({node, ...props}) => <tr className="divide-x divide-slate-100 border-b border-slate-100 hover:bg-slate-50" {...props} />,
                      th: ({node, ...props}) => (
                        <th className="px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 tracking-wider bg-slate-100/80" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="px-3.5 py-2.5 text-xs text-slate-600 whitespace-nowrap" {...props} />
                      ),
                    }}
                  >
                    {apiResult}
                  </Markdown>
                </article>
              ) : (
                /* Sleek Empty State Representation */
                <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center text-slate-400">
                  <div className="bg-slate-50 p-5 rounded-full border border-dashed border-slate-200 mb-5 relative">
                    <Sparkles className="h-8 w-8 text-indigo-400" />
                    <div className="absolute -top-1.5 -right-1.5 bg-violet-100 text-violet-700 rounded-full p-1 border-white border text-2xs font-extrabold max-h-5 min-w-5 leading-none flex items-center justify-center">AI</div>
                  </div>
                  <h3 className="text-slate-800 text-sm font-semibold mb-2">等候您的會議記錄</h3>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                    請於左側輸入區粘貼任何即時談話、日常站立會、專題研發或戰略會議的內容，點選「自動提煉」按鈕來解鎖極致、分層有序的智慧紀要。
                  </p>
                  
                  {/* Subtle checklist tips */}
                  <div className="text-left w-full max-w-xs border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-1.5 text-2xs text-slate-500">
                    <span className="font-semibold text-slate-600 block text-xs mb-1.5">🎁 支援之 AI 獨家整理亮點：</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>精準多國語音轉譯、中英句法自然轉換</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>萃取待辦清單 (Action Items) 負責人</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <span>自動重構紊亂口語，產出商務排版 Markdown</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mini Footer metadata info */}
            {apiResult && !isLoading && (
              <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-2xs text-slate-400 shrink-0">
                <span>模型搭載：<strong className="text-indigo-600 font-semibold">{actualModelUsed}</strong> (AI Studio)</span>
                <span>報告格式：標準 Markdown 規範 (.md)</span>
              </div>
            )}

          </div>
        </section>

      </main>

      {/* Tiny workspace credit footer representation */}
      <footer className="py-4 border-t border-slate-150 bg-slate-100/50 text-center text-slate-400 text-2xs tracking-wide shrink-0">
        <p>© 2026 AI 智慧會議記錄與翻譯大師 - 基於全球頂尖 Google Gemini 語言模型建構</p>
      </footer>
    </div>
  );
}
