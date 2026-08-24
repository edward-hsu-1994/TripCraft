# TripCraft

一個可移植的 **Coding Agent skill**，用於研究驅動（research-driven）的旅遊行程規劃。

---

## 📸 行程網頁範本預覽 (Template Previews)

TripCraft 產出的互動式單一檔案 HTML 範本（Vue 3 + Tailwind CSS + OpenStreetMap 雙向互動地圖），預設進入頁面為**「總覽頁 (Overview)」**：

### 1. 2027 初秋北海道深度 7 天 6 夜（札幌 ➔ 函館雙城連續居住）
| 總覽頁（行程筆記、天氣資訊、注意事項、旅遊警報） | 每日行程與 OpenStreetMap 互動地圖（紅圈序號定位、虛線路徑） |
| :---: | :---: |
| ![北海道總覽頁](./docs/images/hokkaido-7days-overview.png) | ![北海道每日行程地圖](./docs/images/hokkaido-7days-daydetail.png) |

### 2. 2027 九州福岡 8 天 7 夜（博多 ➔ 熊本雙城連續居住）
| 總覽頁預覽 | 每日行程與關門海峽環線地圖 |
| :---: | :---: |
| ![九州總覽頁](./docs/images/kyushu-8days-overview.png) | ![九州每日行程地圖](./docs/images/kyushu-8days-daydetail.png) |

### 3. 更多經典範本預覽
| 關西 7 天 6 夜深度二訪範本 | 岡山山陽關西 8 天 7 夜標準範本 |
| :---: | :---: |
| ![關西總覽頁](./docs/images/kansai-7days-overview.png) | ![岡山總覽頁](./docs/images/okayama-8days-overview.png) |

---

## 特色

TripCraft 不是樣板行程產生器，是**研究驅動 + 對話驅動**的行程規劃。Workflow 嚴格遵循使用者決策優先：

1. **國內 vs 國外** — 一開始就問；依結果推薦 5–8 個國家（國外）或地點（國內）附特色與偏好對齊
2. **詢問偏好** — 購物 / 文化 / 自然 / 美食 / 夜生活 / 步調 / 預算 / 氣候 / 同行者 / 必免。偏好決定推薦內容
3. **確認天數** — 依天數規模推薦最適景點數量
4. **確認景點** — 使用者指定或 Agent 上網查推薦，兩條分支
5. **航班與動線規劃（彈性雙機場 Open-Jaw）** — 不拘泥同機場進出，主動評估並推薦不同點進出（如關西進東京出、新千歲進函館出、福岡進鹿兒島出），**一切以行程流暢度為最高優先**，徹底消除長途折返跑疲勞與多餘車資
6. **住宿規劃（區塊連續居住）** — 連續入住同城市同飯店數日，避免頻繁搬家換房；使用者給偏好，Agent 上網查 3–5 家飯店讓使用者挑
7. **安全與目的地研究**：
   - **旅遊警報**：外交部旅遊警示燈號（灰色/黃色/橙色/紅色）與緊急救援電話
   - **簽證與入境**：護照 6 個月效期、免簽天數與官方數位入境卡（Visit Japan Web 等）
   - **旅遊保險與行李防護**：必備海外突發疾病醫療險（含緊急運送）與旅遊不便險（班機延誤/行李損失）；行李託運前拍攝外觀、託運條、存根聯與重量以利延誤/損壞理賠
   - **天候與天災風險**：季節性颱風頻率、大眾運輸停駛應變機制
   - **野生動物與自然危害**：山區景點「熊出沒（熊鈴防範守則，附即時熊出沒地圖 kumamap.com）」與火山活動警戒
8. **交通方式（多模態移動與單車站點動線校準）** — 步行 / 大眾運輸（鐵道/地鐵/巴士/渡輪） / **公共自行車與觀光單車租借（強制查證租借站點與閉環動線，依租借店家所在位置動態調整行程順序，例如先抵達有租借店的備前一宮站借車，再依序騎行至吉備津彥神社與吉備津神社）** / 計程車 / 租車 / 混搭，必問
9. **景點停留時間（強制上網查詢）** — 若有聯網工具，必須實查官方或旅客公認之停留時間預估（`建議停留時間 / 所要時間 / visit duration`），並取得精確經緯度（`coords: [lat, lng]`）
10. **交通時間 + 自行車騎行路徑 + 車站候車緩衝（預設 30 分鐘）** — 上網查該地大眾運輸與自行車騎行實際數據（含租借店家名稱、鐵道路線、自行車騎行距離與時間、班距、步行分鐘、來源 URL），車站出發/轉乘一律預留 30 分鐘候車緩衝
11. **day-by-day 時間表** — 每一天都是 `Time | Spot | Duration | Transit` 的卡片與路線串接
12. **全天行程 = 停留時間 + 交通時間 + 等候時間（候車假設 30min） + 用餐 + 緩衝**，不憑感覺拼湊
13. **產出互動式 HTML 網頁** — 單一獨立檔案，自帶 OpenStreetMap 雙向互動、純文字膠囊 Tab 列與總覽四大區塊（含 1:1 車站地名對照表）

---

## 專案結構

```
TripCraft/
├── README.md                        專案說明與範本畫面展示
├── SKILL.md                         TripCraft CLI Skill 本體（給 Coding Agent / CLI 讀取）
├── SKILL-for-Web.md                 TripCraft 網頁版專用提示詞（複合完整 HTML 樣板代碼，供 ChatGPT / Gemini / Claude Web 使用）
├── docs/
│   └── images/                      範本高畫質實際畫面截圖
│       ├── hokkaido-7days-overview.png
│       ├── hokkaido-7days-daydetail.png
│       ├── kyushu-8days-overview.png
│       ├── kyushu-8days-daydetail.png
│       ├── kansai-7days-overview.png
│       ├── okayama-8days-overview.png
│       └── okayama-8days-daydetail.png
└── templates/
    ├── hokkaido-7days.html          2027 初秋北海道深度 7 天 6 夜雙城連續居住互動網頁範本
    ├── kyushu-8days.html            2027 初春九州福岡 8 天 7 夜雙城連續居住互動網頁範本
    ├── kansai-7days.html            2026 初春關西深度 7 天 6 夜京都大阪雙城互動網頁範本
    └── okayama-travel.html          2026 山陽關西 8 天 7 夜標準互動網頁範本
```

---

## 這是什麼

TripCraft 提供兩種靈活使用方式：
1. **Coding Agent / CLI 模式**：以 [`SKILL.md`](./SKILL.md) 為核心，適用於 Claude Code、Codex CLI、Google Antigravity (AGY) 等具備本機讀寫工具的 Agent。
2. **網頁版 AI 對話模式**：以 [`SKILL-for-Web.md`](./SKILL-for-Web.md) 為核心，已將 12 步工作流與完整 HTML 範本結構複合為獨立提示詞，可直接複製貼入 **ChatGPT (Custom GPT)、Google Gemini (Gems)、Claude.ai** 網頁版中直接使用！

---

## 安裝與使用

| 平台 / 工具                  | 建議使用檔案               | 安裝 / 設定方式                                         |
| ---------------------------- | -------------------------- | ------------------------------------------------------- |
| **網頁版 ChatGPT (GPTs)**    | [`SKILL-for-Web.md`](./SKILL-for-Web.md) | 複製全文貼入 GPT Instructions 或對話視窗中              |
| **網頁版 Gemini (Gems)**     | [`SKILL-for-Web.md`](./SKILL-for-Web.md) | 複製全文貼入 Gem 系統提示詞（Instructions）中           |
| **Claude.ai 網頁版**         | [`SKILL-for-Web.md`](./SKILL-for-Web.md) | 複製全文貼入 Project Instructions 或對話視窗中          |
| **Claude Code (CLI)**        | [`SKILL.md`](./SKILL.md)   | 放置於 `~/.claude/skills/tripcraft/SKILL.md`            |
| **Codex CLI**                | [`SKILL.md`](./SKILL.md)   | 放置於 `~/.codex/skills/tripcraft/SKILL.md`             |
| **Google Antigravity (AGY)** | [`SKILL.md`](./SKILL.md)   | 放置於 `<appDataDir>/skills/tripcraft/SKILL.md`         |

---

## 使用方式

對你的 Coding Agent 說：

- 「我想規劃一趟旅行」（Agent 會開始循序問問題）
- 「我想去日本北海道 7 天 6 夜，台北出發，個人獨旅，熟食為主、大眾運輸」
- 「我想去日本九州 8 天 7 夜，台北出發，熟食為主、大眾運輸」
- 「我想去關西 7 天 6 夜深度二訪，不要去清水寺、二條城」

Agent 會依 [`SKILL.md`](./SKILL.md) 的 12 步 workflow 依序執行並產出符合標準規範的互動式 HTML 網頁！

---

## 輸出格式

最終行程規劃輸出為**自包含 HTML 檔案**（見 [`templates/hokkaido-7days.html`](./templates/hokkaido-7days.html)）：

- **預設首頁**：載入時預設顯示**「總覽頁 (Overview)」**，直觀呈現行程筆記、天氣資訊、注意事項與旅遊警報。
- **純文字膠囊導航列 (Tab Bar)**：具有寬裕內邊距（`rounded-[26px] p-3 md:p-3.5`），按鈕為乾淨純文字（`總覽頁`、`第1天` ~ `第N天`，無多餘圖示）。
- **Vue 3 + Tailwind CSS**（CDN）：負責所有響應式資料與現代美觀樣式；所有程式碼直接嵌入單一 HTML 檔案，不需外部建置流程。
- **OpenStreetMap + Leaflet**（CDN）互動地圖：
  - 每個景點以**玫瑰粉數字圓形標記**（`1`, `2`, `3`...）呈現，序號與下方行程卡片完全一致。
  - 景點間自動繪製軌跡虛線，切換 TAB 時自動縮放至當日全景範圍（Auto `fitBounds`）。
  - **雙向互動**：點擊下方行程卡片的紅色數字圖標可直接將地圖放大飛入該景點（Zoom 17）並開啟資訊氣泡；點擊當前 TAB 或「🔄 檢視全部景點」可一鍵平滑還原全景視野。
- **天數分頁與網址 Hash 同步**：支援「總覽頁」與「第 1 天 ~ 第 N 天」，即時與 URL Hash（`#overview`, `#day1`...）雙向綁定。
- **行程卡片設計**：時間、類型圖示（✈️, 🛏️, 🚆, 🏯, ⛩️, 🍜 等）、景點名稱與停留時間；景點間清楚標註具體路線與步行時間（如「步行 X 分」）。