export interface MeetingPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
}

export const MEETING_PRESETS: MeetingPreset[] = [
  {
    id: "scrum-daily",
    title: "⚡ 軟體系統開發每日站立會議 (Daily Standup)",
    description: "適合測試研發團隊的進度匯報，包含阻礙點與後續計畫。",
    category: "軟體開發",
    content: `時間：2026年5月26日 早上 09:30
出席成員：小明 (前端), 阿華 (後端), 美美 (產品經理), 志強 (測試工程師)

美美 (PM)：大家早！那我們照慣例快速開始今天的 Standup。小明，你的購物車重構跑得怎麼樣了？
小明 (前端)：大家早。昨天我完成了購物車頁面的 RWD 切版調整，以及串接阿華開出來的 mock 優惠券 API。在 iPad 或者是 iPhone 的版面上看都已經正常了。今天我打算繼續做「立即結帳」按鈕的防重複點擊邏輯，還有寫一下 unit test。目前沒有任何 blocker。
美美 (PM)：讚，這部分進度很穩。那阿華昨天進度呢？
阿華 (後端)：我昨天主要是在修資料庫死鎖的問題，就是當大量使用者同時搶購時發生的鎖定問題。我已經優化了 SQL 的 index，並且重構了交易處理邏輯。目前在 Staging 環境壓測 2000 RPS 已經不會再報錯。今天會把這個 Hotfix 部署到 Pre-production。另外，我今天也會開出正式的優惠券查詢 API 給小明。現在沒有 blocker。
美美 (PM)：太好了，辛苦阿華！那志強呢？
志強 (QA)：昨天我把首頁的自動化迴歸測試腳本寫完了，並跑了 3 輪，全部 pass。今天我會開始測試小明昨晚發過來的購物車 RWD 頁面。今天如果阿華發了正式的優惠券 API，我也會納入整合測試。
小明 (前端)：對了阿華，優惠券 API 那個欄位，回傳的欄位名稱有一點點變動對吧？之前的 'discount_rate' 好像改成 'discount_percentage' 了？
阿華 (後端)：啊沒錯，因為我們後來要支援小數，所以改了名稱。等一下我會貼最新 API 規格書到 Slack，你只要對照一下就好了。
美美 (PM)：好的，那等一下阿華記得先和群組同步規格變動。今天看起來大家進度都很順利，我們就繼續前進囉！散會！`
  },
  {
    id: "marketing-strategy",
    title: "🎨 2026年 Q3 產品發表行銷策略規劃會議",
    description: "涉及跨部門合作、廣告預算與社群媒體平台推廣方案的討論。",
    category: "行銷策劃",
    content: `會議名稱：Q3 年度旗艦智慧手錶發表行銷策略同步會議
日期：2026年5月25日
發言人：Sarah (行銷總監), Edward (社群經理), Leo (預算分析師), Tina (視覺設計)

Sarah：好的各位，下個月 15 號就是我們 Q3 旗艦智慧手錶的正式發表日。時間非常緊迫，我們需要確保宣傳攻勢能夠全方位鋪開。Edward，社群推廣的進度到哪裡了？
Edward：我們已經完成了首波預熱文案與社群影音的腳本，包括網紅宣傳合約。這次我們找了 5 位科技 YouTube 主力，還有 10 位穿搭風格的 Instagram 小網紅。合約都簽署完畢了，開箱影片會配合在發表會當天解禁。不過，現在有一個待處理的事情是：Tina 那邊的官方視覺海報和主視覺 3D 圖還沒提供，網紅們需要這些高解析度去背素材來當影片封面圖。
Tina：哈囉，主視覺方面我的進度目前大概是 80%。手錶的 3D 原創渲染圖我們昨天剛拿到工程部門最終版的 CAD 檔案（金屬邊框有些微微調），所以昨晚我們正在重新渲染。今天下午五點前，我一定會把包含金色、黑色和銀色三個版本的高畫質去背圖，上傳到共享雲端硬碟給 Edward。
Sarah：太棒了。Tina 這邊加緊腳步！Leo，這次 Q3 行銷預算的分配結果如何？
Leo：這次的總預算大約是 150 萬台幣。我與 Sarah 討論後分配比重如下：數位聯播網與關鍵字廣告（Google/Meta）佔 45%，網紅開箱合作佔 30%，線下捷運站大型看板與發表會現場佔 20%，其餘 5% 是緊急預備金。我預計今天下午會將正式預算報表提交到 ERP 系統送審，需要 Sarah 明天中午前在系統上幫我點同意。
Sarah：沒問題，Leo 提交後在 Slack 呼叫我，我會立刻核准。另外，有一點我想提醒：這款手錶主打健康偵測與極簡運動風格，這兩個 key values 在 Edward 的所有網紅行銷 briefs 中，一定要特別強調不准漏掉。
Edward：收到，我待會兒會重新檢查一次給網紅的 briefs，並在今晚前將修改後的 briefed version 給 Sarah 複審。
Sarah：很好，那我們每天下午都保持高度彈性溝通，本週五要再對一次完整發表會當天的細化流程。謝謝大家！`
  },
  {
    id: "international-sync",
    title: "🌐 跨國線上教育平台產品功能同步會 (繁/英混合)",
    description: "適合測試 AI 發掘雙語轉譯、時區對焦以及多國語言組織能力。",
    category: "跨國團隊",
    content: `Meeting: Global Learning Platform UI Sync
Participants: Ken (Product Director), Yuki (UX Designer, Tokyo), David (Tech Lead, Taipei)

Ken: Hi everyone, let's go over the progress on the interactive quiz feature translation and local deployment on the localized platforms. David, are we ready with the backend DB migration?
David: Hi Ken. Yes, the database schema migration scripts for localized courses are ready. 我們已經在 Staging 環境完成測試，運行非常順利。但是有一點，因為這次 Yuki 提的新設計中有新增「即時同儕互動反饋（peer engagement feedback）」，這個部分我們原來的資料庫關聯表需要額外補一個 timestamp 欄位，這部分我大概需要多花半天時間微調，預計本週三（5/27）下午可以完成。
Yuki: Thank you, David. About the peer engagement UI, I've updated the Figma file. I changed the active user dots from amber to neon blue to make it highly distinguishable. Did you see the new update in Team Workspace?
David: 喔！看到了，那個藍色在暗色模式下非常搶眼。那我前端跟樣式就改用 indigo-500 或者與我們整體色彩規範一致的顏色。Yuki 能幫我確認一下那個狀態點的 CSS shadow 數值嗎？
Yuki: Yes, I added the CSS token in Figma comment. I will also email you the exportable SVG code by tomorrow morning.
Ken: Perfect. Yuki, thank you. What about the localization texts? We need teachers/students UI in English, Simplified Chinese, Traditional Chinese and Japanese.
Yuki: Traditional Chinese and Japanese are 100% completed of translation dictionary keys. But Simplified Chinese has some phrases missing. I need some agency review.
Ken: I will take care of the Simplified Chinese review with our Shanghai team today. I will ping you on Teams once it's done. David, once you receive the tokens and localized texts, when do you think we can push this to regional pre-releases?
David: 如果 Yuki 明早和 Ken 今晚都提供資訊，我會在星期五以前全部打包上線到 staging-regional 環境，讓跨國的營運團隊夥伴們可以預覽測試。
Ken: Fantastic. Let's aim for staging preview by Friday noon. Thanks team!`
  }
];
