import React from "react";
import { Sparkles, FileText, CheckCircle, Languages } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/85 backdrop-blur-md sticky top-0 z-10" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2.5 rounded-xl shadow-md text-white flex items-center justify-center">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">AI 智慧會議記錄與翻譯工具</h1>
                <span className="hidden sm:inline-block bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-indigo-100">
                  多 AI 核心支援
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">一鍵提煉精華，支援多國語言翻譯與 Action Items 智能提取</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>逐字稿整理</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <Languages className="h-3.5 w-3.5 text-violet-600" />
              <span>多國語言</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
