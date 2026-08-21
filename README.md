# TripCraft

一個可移植的 **Coding Agent skill**，用於研究驅動（research-driven）的旅遊行程規劃。

## 特色

TripCraft 不是樣板行程產生器，是**研究驅動 + 對話驅動**的行程規劃。Workflow 嚴格遵循使用者決策優先：

1. **國內 vs 國外** — 一開始就問；依結果推薦 5–8 個國家（國外）或地點（國內）附特色與偏好對齊
2. **詢問偏好** — 購物 / 文化 / 自然 / 美食 / 夜生活 / 步調 / 預算 / 氣候 / 同行者 / 必免。偏好決定推薦內容
3. **確認天數** — 週末 3–6 個點、5 天 6–10 個點、7 天 8–12 個點，依此規模推薦景點
4. **確認景點** — 使用者指定或 Agent 上網查推薦，兩條分支
5. **住宿需求 + 飯店推薦** — 過夜才問；使用者給偏好，Agent 上網查 3–5 家飯店（位置 / 價格 / 評分 / 來源 URL）讓使用者挑
6. **研究目的地** — 氣候、旺季/淡季、當地節慶、特產與簽證 / 貨幣 / 時差等國際資訊
7. **交通方式** — 步行 / 大眾運輸 / 計程車 / 租車 / 混搭，必問
8. **景點停留時間** — 上網查實際資料，每個景點附來源 URL
9. **交通時間 + 等候時間** — 上網查該地大眾運輸實際資料（含路線、班距、票價、來源 URL）
10. **day-by-day 時間表** — 每一天都是 `Time | Location/Activity | Duration | Transit & method | Source` 的表格
11. **全天行程 = 停留時間 + 交通時間 + 等候時間 + 用餐 + 緩衝**，不憑感覺拼湊
12. **國際行程附**：簽證、護照效期、貨幣、時差、語言、保險、eSIM、機場接送、緊急聯絡

## 這是什麼

TripCraft 以 [`SKILL.md`](./SKILL.md) 為核心，採用 Coding Agent 的最小公約格式（YAML frontmatter + Markdown），可安裝到任何相容的 Coding Agent。

目前相容的 Agent：
- Claude Code
- OpenAI Codex CLI
- 其他遵循相同 SKILL 規範的 Agent（依該 Agent 的 skill 載入規範放置 `SKILL.md`）

## 安裝

依不同 Agent 將 `SKILL.md` 載入對應位置：

| Agent         | 安裝路徑範例                              |
| ------------- | ----------------------------------------- |
| Claude Code   | `~/.claude/skills/tripcraft/SKILL.md`     |
| Codex CLI     | `~/.codex/skills/tripcraft/SKILL.md`      |
| 其他          | 依該 Agent 的 skill 載入規範              |

## 使用方式

對你的 Coding Agent 說：

- 「我想規劃一趟旅行」（Agent 會開始問問題）
- 「我想去日本東京 5 天，文化美食 2 大人」
- 「規劃一趟家庭冰島旅遊，預算 15 萬台幣」
- 「幫我安排巴黎週末行程」

Agent 會依 [`SKILL.md`](./SKILL.md) 的 12 步 workflow 依序執行：
1. 確認出發地 + 國內/國外
2. 詢問偏好 → 推薦 5–8 個目的地
3. 確認天數
4. 確認景點（使用者指定 / Agent 推薦）
5. 確認住宿需求 → 上網查 3–5 家飯店
6. 研究目的地（簽證、氣候、活動…）
7. 確認交通方式
8. 上網查每個景點的停留時間（含來源）
9. 上網查每段交通的時間、班距、票價（含來源）
10. 拼成 day-by-day 時間表（表格）
11. 加上訂位、SIM、保險、緊急聯絡等 logistics
12. 產出預算、行李、訂位清單

## 專案結構

```
TripCraft/
├── README.md                        專案說明
├── SKILL.md                         Skill 本體（給 Coding Agent 讀）
└── templates/
    └── okayama-travel.html          岡山 8 天 7 夜行程標準 HTML 範本（Vue 3 + Tailwind CSS + OpenStreetMap 數字標記地圖）
```

## 輸出格式

最終行程規劃輸出為**自包含 HTML 檔案**（預設格式，見 [`templates/okayama-travel.html`](./templates/okayama-travel.html)）：

- **Vue 3 + Tailwind CSS**（CDN）：負責所有響應式資料與現代美觀樣式；所有程式碼直接嵌入單一 HTML 檔案，不需外部建置流程。
- **OpenStreetMap + Leaflet**（CDN）互動地圖：
  - 每個景點以**玫瑰粉數字圓形標記**（`1`, `2`, `3`...）呈現，序號與下方行程卡片完全一致。
  - 景點間自動繪製軌跡虛線，切換 TAB 時自動縮放至當日全景範圍（Auto `fitBounds`）。
  - **雙向互動**：點擊下方行程卡片的紅色數字圖標可直接將地圖放大飛入該景點（Zoom 17）並開啟資訊氣泡；點擊當前 TAB 或「🔄 檢視全部景點」可一鍵平滑還原全景視野。
- **天數分頁與網址 Hash 同步**：支援「總覽頁」與「第 1 天 ~ 第 N 天」，即時與 URL Hash（`#overview`, `#day1`...）雙向綁定。
- **行程卡片設計**：時間、類型圖示（✈️, 🛏️, 🚆, 🏯, ⛩️ 等）、景點名稱與停留時間；景點間清楚標註具體路線與步行時間（如「步行 X 分」）。