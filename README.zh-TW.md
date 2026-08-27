# TripCraft

[English](./README.md)

TripCraft 是可攜式、研究驅動的旅遊規劃 Skill，適用於 Coding Agent 與網頁版 AI 助理。它會將由使用者主導的對話，轉換為經查證的獨立互動式行程網頁。

## 多語系旅遊規劃

TripCraft 以第一則具實質旅遊規劃內容的訊息判定輸出語言，並將該語言持續套用至整個規劃流程與最終 HTML。它直接支援繁體中文、簡體中文、日文與英文；使用者後續明確指定語言時，後續輸出會立即切換。若第一則需求真正混合多種語言或無法判定，TripCraft 會先用一句簡短問題確認語言。

地名、官方名稱、路線編號、來源引用，以及刻意保留的多語系地點／車站對照表，會維持最有用的原文形式；其餘敘述與所有介面標籤皆使用選定的輸出語言。

## 行程範本預覽

所有獨立 HTML 範本均使用 Vue 3、Tailwind CSS 與雙向 OpenStreetMap/Leaflet 互動，開啟時預設顯示總覽頁。

### 北海道：7 天，札幌至函館

| 總覽頁 | 每日行程與地圖 |
| :---: | :---: |
| ![北海道總覽頁](./docs/images/hokkaido-7days-overview.png) | ![北海道每日行程](./docs/images/hokkaido-7days-daydetail.png) |

### 九州：8 天，博多至熊本

| 總覽頁 | 每日行程與關門海峽路線地圖 |
| :---: | :---: |
| ![九州總覽頁](./docs/images/kyushu-8days-overview.png) | ![九州每日行程](./docs/images/kyushu-8days-daydetail.png) |

### 其他範例

| 關西深度二訪 | 岡山、山陽與關西 |
| :---: | :---: |
| ![關西總覽頁](./docs/images/kansai-7days-overview.png) | ![岡山總覽頁](./docs/images/okayama-8days-overview.png) |

## TripCraft 的規劃內容

TripCraft 不是通用行程產生器。它的工作流要求：

1. 先確認出發地、國內／國外、偏好、天數與景點選擇，再進入細節規劃。
2. 依旅程長度與步調，研究後推薦目的地與景點。
3. 評估 Open-Jaw 航班與連續住宿基地，減少折返、疲勞與換飯店次數。
4. 研究具體住宿選項，由使用者選擇，不會自行預設。
5. 研究安全、簽證、保險、行李理賠準備、氣候、災害、野生動物與當地活動。
6. 規劃多模態交通，包含單車租借／還車點查證，以及依可租借性調整的自行車動線。
7. 查證景點停留時間、經緯度、實際日期的營業時間、連假休館、預約限制與未確認項目的備案。
8. 查詢真實交通、步行／騎行時間，並在車站候車與轉乘預留 30 分鐘。
9. 以景點停留、交通、用餐、等候與緩衝時間建立逐日時間軸。
10. 產出含本地化介面、四大總覽區塊、1:1 地點對照、Hash 分頁、數字地圖標記與卡片定位互動的完整 HTML 行程。

## 專案結構

```text
TripCraft/
├── README.md                  英文專案說明
├── README.zh-TW.md            繁體中文專案說明
├── SKILL.md                   Coding Agent／CLI Skill
├── SKILL-for-Web.md           網頁版 AI 專用系統提示詞與完整 HTML 參考
├── docs/images/               範本截圖
└── templates/
    ├── hokkaido-7days.html
    ├── kyushu-8days.html
    ├── kansai-7days.html
    ├── okayama-travel.html
    └── tokyo-8days.html
```

## 選擇整合方式

| 平台 | 使用檔案 | 安裝或使用方式 |
| --- | --- | --- |
| ChatGPT 網頁版／GPTs | [`SKILL-for-Web.md`](./SKILL-for-Web.md) | 將完整提示詞貼到指令欄位或對話中。 |
| Gemini Gems | [`SKILL-for-Web.md`](./SKILL-for-Web.md) | 將完整提示詞貼到 Gem 指令中。 |
| Claude 網頁版 | [`SKILL-for-Web.md`](./SKILL-for-Web.md) | 將完整提示詞貼到專案指令或對話中。 |
| Claude Code | [`SKILL.md`](./SKILL.md) | 安裝到 `~/.claude/skills/tripcraft/SKILL.md`。 |
| Codex CLI | [`SKILL.md`](./SKILL.md) | 安裝到 `~/.codex/skills/tripcraft/SKILL.md`。 |
| Google Antigravity | [`SKILL.md`](./SKILL.md) | 安裝到 `<appDataDir>/skills/tripcraft/SKILL.md`。 |

CLI Skill 可以直接讀取 repository 內的範本；網頁版提示詞因無法讀取本機檔案，故內嵌完整 HTML 參考實作。

## 開始規劃

請使用你希望 TripCraft 用來對話與產出行程的語言開啟需求。

- English：`Plan an 8-day public-transit trip to Hokkaido from Taipei. I am travelling solo and prefer cooked food.`
- 日本語：`台北から北海道へ8日間旅行したいです。公共交通機関で、一人旅、加熱した料理を中心にしたいです。`
- 繁體中文：`我想規劃日本北海道 8 天 7 夜，台北出發，個人獨旅、熟食為主、大眾運輸。`

TripCraft 會循序詢問尚未提供的資訊，查證指定日期與營業限制，並在行程確認後產出 HTML 網頁。

## 交付的 HTML 行程網頁

每份產出均為自包含檔案，可直接用瀏覽器開啟，包含：

- 含行程筆記、天氣、安全注意事項與 1:1 地點／車站對照表的總覽頁。
- 總覽與每日純文字膠囊 Tab，並與 `#overview`、`#day1` 等 URL Hash 同步。
- 透過 CDN 載入 Vue 3、Tailwind CSS 與 Leaflet/OpenStreetMap，無需建置步驟。
- 玫瑰粉數字標記、虛線路徑、自動縮放、全景重設，以及卡片點擊後以 Zoom 17 聚焦地圖。
- 與使用者選定輸出語言一致的文件語言與介面標籤。
