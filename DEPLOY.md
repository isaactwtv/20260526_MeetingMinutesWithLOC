# AI 智慧會議記錄與翻譯工具 - Vercel 部署指南

本專案為 React (Vite) 前端 + Vercel Serverless Functions 後端的全端應用程式，支援 **Google Gemini** 及 **NVIDIA** 兩種 AI 服務。

---

## 📋 必備環境變數設定

在部署之前，請確保配置了以下環境變數：

| 變數名稱 | 必填 | 說明 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | 使用 Gemini 時必填 | 您的 Google Gemini API 金鑰 (於 [Google AI Studio](https://ai.studio) 取得) |
| `NVIDIA_API_KEY` | 使用 NVIDIA 時必填 | 您的 NVIDIA API 金鑰 (於 [NVIDIA Developer](https://build.nvidia.com) 取得) |

> ⚠️ **安全提醒**：API 金鑰只能設定在伺服器端的環境變數中，`.env.local` 僅供本機開發使用，**絕對不可提交至 GitHub**（`.gitignore` 已自動排除）。

---

## ⚡ 部署方案一：發布至 Vercel（GitHub 整合，最推薦）

Vercel 能自動將前端打包成靜態網站，並將 `api/` 目錄轉換為 Serverless Functions，完全無須管理伺服器。

1. 將本專案推送至您的 **GitHub** 儲存庫。
2. 登入 [Vercel 官網](https://vercel.com/)，點選 **"Add New" → "Project"**。
3. 匯入您的 GitHub 儲存庫。
4. Vite 框架會自動被偵測，建置設定無須手動修改。
5. 在 **"Environment Variables"** 欄位新增以下金鑰（依您需要使用的 AI 服務填寫）：
   - `GEMINI_API_KEY` → 填入您的 Gemini API 金鑰
   - `NVIDIA_API_KEY` → 填入您的 NVIDIA API 金鑰
6. 點選 **"Deploy"**，幾分鐘後即可取得 HTTPS 公開網址！

---

## 🖥️ 部署方案二：使用 Vercel CLI（本機或 CI/CD）

1. 安裝 Vercel CLI：
   ```bash
   npm install -g vercel
   ```
2. 在專案根目錄登入並部署：
   ```bash
   vercel login
   vercel
   ```
3. 在 Vercel 後台 (Dashboard) 的 **Settings → Environment Variables** 設定 `GEMINI_API_KEY` 與 `NVIDIA_API_KEY`。
4. 執行生產部署：
   ```bash
   vercel --prod
   ```

---

## 🔧 本地開發測試（含 API 函數）

> **注意**：一般的 `npm run dev` 只會啟動 Vite 前端，無法執行 `api/` 目錄下的 Serverless Functions。若需測試完整的前後端，請使用 `vercel dev`。

1. 確認 `.env.local` 已正確配置兩組 API Key：
   ```env
   GEMINI_API_KEY=你的_Gemini_API_Key
   NVIDIA_API_KEY=你的_NVIDIA_API_Key
   ```
2. 安裝 Vercel CLI（若尚未安裝）：
   ```bash
   npm install -g vercel
   ```
3. 啟動本地完整開發伺服器：
   ```bash
   vercel dev
   ```
   這會在本地同時運行 Vite 前端與 Serverless Functions。

---

## 📁 專案架構說明

```
.
├── api/
│   └── generate.ts   # Vercel Serverless Function (AI API 後端)
├── src/
│   ├── App.tsx       # 主應用程式元件（含 AI 提供商選擇 UI）
│   └── components/   # 共用元件
├── vercel.json       # Vercel 路由設定
└── vite.config.ts    # Vite 前端打包設定
```
