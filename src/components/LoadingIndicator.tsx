import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  "正在上傳會議紀錄，啟動智慧分析語意...",
  "正在分割發言人語音與文字脈絡...",
  "正在釐清各方論點：核心大綱建置中...",
  "正在萃取關鍵決議與待辦行動方針 (Action Items)...",
  "正在對齊多國語言商務習慣、修辭轉換與優化...",
  "正在根據專業秘書排版格式渲染 Markdown...",
  "即將完成，編排目錄與基本資訊中..."
];

export default function LoadingIndicator() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" id="loading-indicator">
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulse rink */}
        <div className="absolute w-20 h-20 bg-indigo-50 rounded-full animate-ping opacity-60"></div>
        {/* Inner spinner */}
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-800 tracking-tight animate-pulse mb-2">
        AI 正在全力為您梳理會議精華...
      </h3>
      <p className="text-sm text-slate-500 max-w-sm h-6 transition-all duration-300">
        {LOADING_MESSAGES[msgIndex]}
      </p>
    </div>
  );
}
