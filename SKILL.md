---
name: tripcraft
description: This skill should be used when the user says they want to travel, asks to plan a trip, asks for recommendations of places to visit, or wants to organize a travel itinerary. It guides the Coding Agent through a research-driven workflow: confirm the user's origin and whether the trip is domestic or international, ask about trip preferences (shopping / culture / nature / food / nightlife / pace / budget / climate / companions / must-avoid), recommend 5–8 countries (international) or 5–8 destinations (domestic) with characteristic descriptions and per-preference rationale for the user to pick from, ask how many days the user wants to spend, then ask whether they have specific spots in mind or want recommendations based on preferences (with the spot count scaled to the trip duration), web-search and propose a short list of spots, gather full requirements, ask the user's preferred transport mode, web-search visit durations and transit data for each leg, then build a day-by-day itinerary with budget, packing list, and pre-trip booking checklist. International trips add visa/passport, currency, time zone, language, insurance, and embassy logistics. Do NOT trigger for single-component travel questions or generic travel info lookup without itinerary intent.
---

# TripCraft

## When to use this skill

**Trigger** when the user says any of:
- "I want to travel" / "想規劃一趟旅行"
- "I want to go to `<destination>`" / "想去某地旅遊"
- "Plan a trip to `<destination>`"
- "Recommend places to visit in `<destination>`" / "推薦 `<destination>` 景點"
- "I don't know which spots to pick in `<destination>`" / "不曉得要去哪裡比較合適"
- "Help me organize travel / create an itinerary"

**Do NOT trigger** for:
- Single-component questions (flight only, hotel only, visa only, weather only)
- Generic travel info lookup without itinerary intent
- Booking or payment actions (defer to a booking tool)

## Core principles

1. **Always confirm origin and trip scope first** (domestic vs international). Origin shapes trip-type logic; trip type shapes the destination recommendation and all later steps.
2. **Always ask about preferences before recommending destinations** — shopping / culture / nature / food / nightlife / pace / budget / climate / companions / must-avoid. Preferences filter the country/location list and feed the spot list.
3. **Always recommend 5–8 destinations** (countries if international, locations if domestic) with characteristic descriptions before going deeper. Let the user pick.
4. **Always ask the trip duration** after the destination is picked. Duration determines how many spots to recommend.
5. **Always check with the user about spots** at the picked destination. Either use the user's named spots, or — if they don't know — refine the step-2 preferences at the spot level and recommend a count that fits the duration.
6. **Always ask the user about transport mode** between locations. Proactively evaluate and integrate **Walking, Public Transit (Metro / Bus / Train), Public Bike Sharing (e.g. YouBike / Docomo Bike / HELLO CYCLING), Scenic Rental Bicycles / E-Bikes (e.g. Kibiji / Biei / Karuizawa / Shimanami Kaido), Taxi, and Rental Car**. **Mandatory Bicycle Station & Shop Research & Sequence Alignment**: When bicycles are selected, the agent MUST web-research the exact rental shop name (店家名稱、營業時間、租金與車型), public bike docking station locations (借車站點/還車站點), and identify whether one-way drop-off (甲租乙還) or round-trip return (同店歸還) applies. **Crucially, the itinerary sequence MUST be dynamically structured around actual rental availability** — if a region only has bike rental facilities at specific stations (e.g. JR 備前一宮站 has a bike rental shop, while JR 吉備津站 does NOT), the itinerary MUST route to the rental origin (備前一宮站) FIRST before heading to other attractions (e.g. 先至備前一宮站租車 ➔ 吉備津彥神社 ➔ 吉備津神社). Never schedule cycling starting from a spot/station that lacks rental facilities. Do not assume.
7. **Always web-research visit duration, opening/operating hours, and coordinates** (`coords: [lat, lng]`) for every attraction, restaurant, shop, facility, and hub. For each itinerary date, verify the official source for weekly closing days, public holidays, consecutive-holiday periods, year-end/New Year closures, seasonal or temporary closures, last admission/order, reservation or timed-entry rules. Never assume normal weekday hours, blindly guess, or fabricate data; if the date-specific schedule is unpublished or uncertain, mark it as pending, provide a backup, and do not make it an irreplaceable core stop.
8. **Always web-research transit data** (transit line name, train name, travel time, walking time e.g. "步行 X 分", cycling route time & distance with rental shop pickup/drop-off e.g. "於站前租借單車 ➔ 騎行 20 分 (約 3.5km) ➔ 景點", and fare) for each leg.
9. **Always apply realistic station waiting & transfer buffer assumptions (候車與轉乘時間假設預設為 30 分鐘)**: Total day plan = sum of (visit durations + transit times + **waiting times [預設候車時間 30 分鐘]** + meals + buffer). When planning train/bus station departures or transfers, budget a 30-minute buffer for headway waiting, ticketing, platform finding, and bike return/rental logistics (`停留 0 時 30 分 (候車與轉乘)` 或 `歸還單車與候車 30 分`). No hand-waving.
10. **Output format is an interactive single-file Vue 3 + Tailwind CSS + OpenStreetMap HTML** placed in `templates/<destination>-travel.html`.
11. **Always research and include safety, visa, insurance, and hazard intelligence**: Destination travel advisory levels (外交部旅遊警示燈號), visa/entry rules, travel insurance essentials (海外突發疾病醫療/旅遊不便險), local scam/safety risks, seasonal typhoon/extreme weather contingency, and regional wildlife hazards (e.g. 熊出沒 / bear alerts in mountain regions, volcanic alert levels) must be researched and integrated into the itinerary notes and overview notices.
12. **Always prioritize itinerary flow over rigid airport pairing (Flexible Open-Jaw Strategy)**: Flights do NOT need to arrive and depart from the same airport. Proactively evaluate and propose open-jaw / multi-city flight routes (不同點/雙機場進出，例如：關西國際機場 KIX 進、東京成田機場 NRT 出；新千歲機場 CTS 進、函館機場 HKD 出；福岡機場 FUK 進、鹿兒島機場 KOJ 出) whenever a linear one-way flow eliminates backtracking, saves hours of redundant transit time, and reduces transportation costs. **Itinerary smoothness and optimal travel flow always come first (一切以行程流暢度為主)**.

## Workflow

Follow the steps in order. Skip a sub-step only if the user has already supplied that information.

### 1. Confirm origin and trip scope
Ask the user: **"Where are you currently located, and do you want to travel domestically or internationally?"**

Capture:
- **Origin** — country and (ideally) city
- **Trip scope** — domestic / international

These two together determine the rest of the workflow:
- Domestic = origin country = destination country
- International = origin country ≠ destination country

### 2. Ask preferences and recommend destinations
First ask about preferences. Then web-search and propose a short list. Let the user pick.

#### 2a. Ask about trip preferences
Ask the user what kind of trip they want. Cover (multi-select where useful):

- **Trip style** — shopping / culture / nature / food / nightlife / beach / mountain / city / offbeat / heritage / theme-park
- **Pace preference** — relaxed / balanced / packed
- **Budget tier** — backpacker / mid-range / luxury
- **Climate preference** — warm / temperate / cold / snow / no-preference
- **Travel companions** — solo / couple / family with kids / friends group / seniors
- **Transport mode preference** — walking only (limited radius) / public transit (metro / bus / train) / taxi / rideshare / rental car / mixed (e.g., transit by day, taxi at night). Capture this **upfront** so step 4 spot filtering and step 5b hotel location can use it. Step 7 will confirm / refine this choice before building the itinerary.
- **Must-avoid** — long flights, crowds, language barriers, very early starts, etc.
These preferences filter and weight the recommendations in 2b / 2c. Step 4 may refine them at the spot level.

#### 2b. International from `<origin>` (Branch A)
Recommend **5–8 countries** popular with travelers from `<origin>` AND matching the user's preferences from 2a. For each entry, include:
- Country name
- One-line **characteristic** (climate / culture / food / vibe / what kind of trip it suits)
- Typical travel style
- Best season to visit
- One-line **why it appeals to `<origin>` travelers** (visa ease, distance, value, language familiarity)
- One-line **why it matches the user's preferences from 2a**

Search queries:
- `"popular destinations from <origin>"`
- `"best countries for <origin> travelers"`
- `"visa free countries for <origin> passport"`
- `"<origin> outbound tourism top destinations"`
- `"<style> travel destinations <origin> travelers"`

User picks a country → continue to step 3.

#### 2c. Domestic in `<origin country>` (Branch B)
Recommend **5–8 destinations** within `<origin country>` matching the user's preferences from 2a. For each entry, include:
- Location name (city / region)
- One-line **characteristic** (what kind of trip it suits)
- Typical travel style
- Best season
- One-line **why it matches the user's preferences from 2a**

Search queries:
- `"top destinations <origin country>"`
- `"best places to visit <origin country>"`
- `"<origin country> popular tourist spots"`
- `"<origin country> travel ideas <season>"`
- `"<style> destinations <origin country>"`

User picks a destination → continue to step 3.

### 3. Confirm trip duration
Ask the user: **"How many days do you want to spend on this trip?"** (e.g. weekend / 3 days / 5 days / 1 week / 2 weeks).

Capture:
- **Duration** in days (integer or half-day increments)

The duration shapes step 4: how many spots the agent recommends in Branch B, and how dense the day-by-day plan is in step 10.

Suggested spot counts by duration (rough guide — adjust for pace and travel time between spots):

| Duration | Suggested spot count | Typical pace |
| --- | --- | --- |
| 2–3 days (weekend) | 3–6 spots | relaxed |
| 4–5 days | 6–10 spots | balanced |
| 6–7 days | 8–12 spots | balanced |
| 8–10 days | 10–15 spots | mixed (relaxed + packed) |
| 10+ days | 12–18 spots + day trips | relaxed |

If the user wants both spot recommendations AND a duration-driven count, this table is the calibration.

### 4. Get spot input
Ask the user: **"Any specific spots in mind, or would you like me to recommend?"** Then branch. **Use the duration from step 3 to size Branch B's recommendation list.**

#### Branch A — User has spots in mind
1. Confirm the named spots (echo them back to verify spelling / exact location).
2. Optionally web-search the destination's common spots and suggest 1–2 additions the user might have missed.
3. If the named count clearly exceeds the duration budget, flag it (e.g. "10 spots in 3 days is packed — want to drop any?"). Do not silently cut.
4. Ask if anything should be removed.
5. Proceed to step 5 with the confirmed spot list.

#### Branch B — User does not know / wants recommendations
1. **Refine preferences** from step 2a for the spot level:
   - **Interests** (multi-select) — food / nature / culture / history / shopping / nightlife / view / art / architecture
   - **Trip style** — iconic landmarks / hidden gems / mix
   - **Indoor vs outdoor preference**
   - **Pace** — confirm or adjust the step-2a choice
   - **Stamina / physical demand** — pulled from step 5a. Filter out strenuous spots (long hikes, many stairs, hilltop temples without transport) when stamina is `low` or `limited`. Tag each recommended spot with its physical demand (light / moderate / strenuous) so the user can see the mix.
   - **Must-avoid** — crowds, long walks, hills, very early starts, etc.
2. Web-search spots matching these refined preferences:
   - `"<destination> best spots for <interest>"`
   - `"<destination> hidden gems <interest>"`
   - `"<destination> itinerary for <style>"`
   - `"<destination> top things to do"`
   - `"<destination> easy walking spots"` or `"<destination> accessible attractions"` (if stamina low)
3. Present **spots scaled to duration** (use the table in step 3 as a guide). For each spot:
   - Name
   - 1-line description
   - Category tag (nature / culture / food / shopping / nightlife / view / art)
   - Physical demand tag (light / moderate / strenuous)
   - One-line "why it matches your preferences"
4. Ask the user to pick, add, or remove.
5. Proceed to step 5 with the confirmed spot list.

### 5. Gather remaining requirements and accommodation needs
Ask for any missing item, in priority order. **Sub-step 5b is required only when the trip has at least one overnight stay** (duration from step 3 > 1 day). Skip 5b entirely for a single-day trip.

#### 5a. Remaining requirements
- Exact date range & flight routing strategy: Single airport round-trip vs. Flexible Open-Jaw (雙機場/不同點進出，例如關西進東京出、新千歲進函館出、福岡進鹿兒島出). **Always prioritize overall itinerary flow, eliminate backtracking, and minimize transit fatigue.**
- Number of travelers and relationships (family / couple / solo / group)
- Total budget and currency (budget currency = origin currency by default)
- Mobility constraints and dietary needs (interests and pace were captured in steps 2a / 4 Branch B)
- **Age range** — used to estimate stamina; affects step 4 spot recommendations (skip strenuous ones for low-stamina travelers) and step 10 day-plan intensity (rest breaks, daily walking budget). If the user is uncomfortable sharing, take "prefer not to say" and rely on the stamina question below.
- **Physical condition / stamina** — direct self-rating: high (can hike 8+ km/day, hills OK) / moderate (~5 km/day, some hills OK) / low (frequent rest, flat terrain preferred) / limited (mobility aids, very short walks). Use this together with age to size the daily plan.
- **Meal pacing** — quick counter / casual sit-down / leisurely multi-course. This calibrates how much time to budget per meal in step 10; helps prevent over-dense scheduling. **Do not force restaurant reservations** — if the user prefers to eat spontaneously, just note the pacing and skip restaurant work entirely.
- **Restaurant preferences** (optional) — any specific restaurants the user wants to visit? cuisine types they prefer or avoid? Captured only for optional use in step 12 (itinerary meal suggestions); does **not** lock meal rows in step 10.

#### 5b. Accommodation needs (overnight trips only)
Ask the user about lodging preferences. These inputs feed the itinerary (hotel address becomes the transit origin / destination for each day's start and end) and the budget (lodging category).
- **Type** — hotel / Airbnb / serviced apartment / hostel / ryokan (Japan) / guesthouse / capsule / hanok (Korea)
- **Location preference** — central (near main station) / near a specific neighborhood / quiet suburb / airport area
- **Budget per night** — refine from step 2a's budget tier
- **Room config** — single / double / twin / triple / family room
- **Must-have amenities** — breakfast included, kitchen, laundry, gym, workspace, onsen / pool
- **Check-in / check-out flexibility** — early arrival before official check-in? late departure after official check-out?
- **Loyalty programs** — any chain status (Marriott, Hilton, IHG, Accor, etc.) to leverage for upgrades or points
- **Booking constraints** — any must-avoid (no Airbnb, only chains, ground floor, etc.)

If the user is unsure, propose 2–3 concrete options that match their stated location + budget tier and let them pick (Branch B-style mini decision).

#### 5c. Web-search and recommend hotels (overnight trips only)
After 5b preferences are captured, **search the web** for concrete hotel options. Never fabricate hotel details.

Search queries:
- `"hotels <location preference> <city>"`
- `"best rated hotels <city> under <per-night price>"`
- `"<hotel type> <city> top rated"`
- `"hotels near <station or neighborhood> <city>"`
- `"<hotel candidate name> reviews booking"`

For each recommended hotel, capture:
- **Name + brand** (chain or boutique)
- **Address** / nearest station + walking minutes
- **Star rating** + **user rating** (TripAdvisor / Booking.com score with sample size, e.g. "8.7/10 from 2,340 reviews")
- **Approx price per night** for the trip dates (in origin or local currency)
- **Walking distance to nearest transit** (minutes)
- **Walking / transit distance to first planned spot** if feasible
- **Source URLs** — at least one from Booking.com / TripAdvisor / official site

Present **3–5 options** matching the user's 5b preferences. Ask the user to pick, or relax constraints to see more options. Do not silently default.

Once the user picks, the hotel address becomes the default transit origin / destination for every day in step 11 (Build itinerary).

If the destination has no suitable options at the user's stated budget, say so and ask if they want to adjust budget, location, or dates.
### 6. Research destination & safety intelligence
Cover, in 1–2 short paragraphs each:
- Climate and what to pack for the season
- Peak / shoulder / off-season status and crowd impact
- Local holidays or major events inside the trip window
- **Local specialties, souvenirs, and signature experiences** (see sub-section 6a)
- **Travel advisory & safety risks** (see sub-section 6b)
- **Visa, entry rules & travel insurance** (see sub-section 6c)
- **Weather, natural disasters & wildlife hazards (including typhoons & bear alerts 熊出沒)** (see sub-section 6d)

#### 6a. Local specialties, souvenirs, and signature experiences
After the destination is picked, **web-search** for the region's signature products and experiences. Capture for each entry:

- **Specialty products / souvenirs** (foods, crafts, regional goods)
  - Name
  - What it is (1-line)
  - Where to buy (specific shop / district / market)
  - Approx price tier
  - Source URL
- **Signature experiences** (workshops, ceremonies, regional activities)
  - Name
  - What it is (1-line)
  - Where / how to book or do it
  - Approx cost (if applicable)
  - Booking lead time if relevant
  - Source URL

Sample search queries:
- `"<destination> specialty products"`
- `"<destination> what to buy souvenirs"`
- `"<destination> best local food gifts"`
- `"<destination> signature experiences"`
- `"<destination> must try activities"`

Limit to **5–10 items total** (mix of products and experiences). These feed the "Local Specialties & Experiences" section in step 12.

#### 6b. 旅遊警報與安全風險 (Travel Advisory & Local Safety Risks)
Web-search official travel advisories and regional safety intelligence:

1. **外交部旅遊警示燈號 (MOFA Travel Advisory Level)**:
   - Check the destination's current travel warning level: 灰色警示 (提醒注意) / 黃色警示 (特別注意安全並檢討應否前往) / 橙色警示 (高度小心並避免非必要旅行) / 紅色警示 (不宜前往，儘速離境)。
   - Search: `"外交部領事事務局 <destination> 旅遊警示"`
2. **當地治安與常見詐騙 (Local Scams & Unsafe Zones)**:
   - Identify common tourist scams (e.g. bar rip-offs/bottakuri in nightlife districts, counterfeit transit passes, fake monks/teahouse scams, pickpocketing hotspots).
   - Nighttime safety zones and districts to avoid late at night (e.g. Roppongi/Kabukicho alleyways, specific train station back exits).
3. **緊急救援聯絡資訊 (Emergency Contacts)**:
   - Local emergency numbers (Police 110 / Ambulance & Fire 119 in Japan/Korea, 911 in US, 112 in Europe).
   - Taiwan Overseas Emergency Hotline (外交部緊急聯絡中心: `+886-800-085-095`) and local Representative Office / Embassy 24-hr emergency phone number.

#### 6c. 簽證規定、入境申報與旅遊保險 (Visa, Entry & Travel Insurance)
Web-search entry logistics and comprehensive insurance coverage:

1. **簽證與護照規定 (Visa & Passport Validity)**:
   - Passport validity requirement (minimum 6 months from travel date).
   - Visa exemption period for Taiwan passport holders (e.g. Japan 90 days visa-free, South Korea 90 days / K-ETA check, EU ETIAS, US ESTA).
   - Digital customs / immigration declaration requirements (e.g. Japan Visit Japan Web, Korea Q-CODE / E-Arrival, Singapore SG Arrival Card).
2. **必備旅遊保險組合 (Essential Travel Insurance Coverage)**:
   - **海外突發疾病醫療險 (Overseas Emergency Medical Insurance)**: Recommend sufficient medical limit covering hospitalization and emergency medical repatriation (海外急難救助).
   - **旅遊不便險 (Travel Inconvenience Insurance)**: Coverage for flight delay/cancellation (班機延誤), lost/delayed luggage (行李延誤/遺失), and trip interruption (行程更改).
   - **旅遊平安險 (Travel Accident Insurance)**: Accidental death and disability protection (意外身故與失能保障).
3. **託運行李拍照存證防護 (Checked Baggage Photography & Claim Verification Rule)**:
   - 行李託運前，務必提醒旅客拍照存證 4 大項目：
     - **行李外觀全貌**（正面/側面、顏色、特色綁帶或吊牌等辨識標記）
     - **託運條**（貼在行李箱上的條碼與班機航點資訊）
     - **託運存根聯**（地勤交付或貼於登機證後方之 Baggage Claim Tag 存根聯）
     - **地勤秤重螢幕之行李重量 (kg)**
   - 此存證為遇行李延誤、遺失或箱體摔損時，向航空公司開立事故證明 (PIR) 與申請旅遊不便險理賠的最有力依據。

#### 6d. 氣候天災、颱風與野生動物風險 (Weather, Typhoons & Wildlife Hazards)
Web-search specific natural hazards, disaster contingency, and wildlife risks:

1. **颱風與極端天候應變 (Typhoons & Extreme Weather Contingency)**:
   - For summer/autumn trips (July to October in East Asia), check seasonal typhoon frequencies.
   - Outline transportation contingency (e.g. JR/train planned suspension 計画運休, airline delay insurance claims, official weather apps like Japan Safety Tips / NHK World).
2. **野生動物風險與熊出沒防範 (Wildlife Hazards & Bear Alerts 熊出沒)**:
   - For mountainous, forested, or rural destinations (especially Hokkaido, Tohoku, Nagano, Gifu, Gunma, Kumamoto Aso mountain trails):
     - Check recent local bear sighting reports (熊の出沒情報 / 目撃情報).
     - **即時熊出沒地圖與警報查詢**：強烈建議在注意事項與行程規劃中附上日本全境即時熊出沒資訊地圖網站 [KumaMap 熊出沒地圖](https://kumamap.com/zh-Hant)，供旅客在前往山林郊野前查詢最新出沒點與歷史目擊紀錄。
     - Provide essential bear encounter precautions: carry bear bells (熊鈴), avoid lone hiking at early dawn or twilight, avoid carrying strongly scented food, slowly back away facing the bear without running or making loud sudden screams.
3. **地震與火山活動警戒 (Earthquake & Volcanic Alert Levels)**:
   - Check local volcanic restriction zones (e.g. Aso Crater alert level 1-3, Sakurajima, Mt. Fuji climbing regulations) and earthquake readiness (installing Safety Tips app, knowing hotel evacuation exits).

### 7. Confirm transport mode with the user
**Re-confirm or refine** the transport preference captured in step 2a. This step ensures the user's choice is still correct after they've seen the destination / spots / hotel options, and gives them a chance to switch (e.g., "actually, given the hotel location, let's just take taxis"). The confirmed choice shapes step 9 and the budget:
- **Walking only** (limited radius, slow pace)
- **Public transit** (metro / bus / train) — proceed to step 9a
- **Public bike sharing & scenic rental bicycles / E-bikes (公共自行車與觀光租賃單車定位、站點可得性與物流)**:
  - **精準定位租借店家與站點 (Exact Rental Shops & Docking Stations)**:
    - 查明出發點之**具體租借店家或公共站點名稱**（例如：`JR 備前一宮站前 荒木自行車租借店 (Rent-a-cycle Araki)`、`JR 美瑛站前 瀧川自轉車店 / 松浦商店`、`JR 輕井澤站北口 白貓自行車 (Shironeko)`、`Docomo Bike Share 站點 (札幌站南口)`）。
  - **動線順序與租借點對齊 (Itinerary Sequence Ordered by Bike Availability)**:
    - **務必根據「實際具備租借點之地點」安排行程前後順序**。若該區域只有特定車站/景點設有租借店或公共借車柱（例如：吉備路自行車路線僅「JR 備前一宮站前」與「JR 總社站前」有租借店，而「JR 吉備津站」無租車店），**行程必須優先排定先前往具備租借店的車站（如先搭車至備前一宮站借車）**，再依序騎行至後續景點（如 備前一宮 ➔ 吉備津彥神社 ➔ 吉備津神社），切勿安排從無租借點的車站出發騎單車！
  - **借還車機制與閉環動線設計 (Drop-off Logistics & Closed-Loop Routing)**:
    - **甲租乙還 (One-Way Drop-off)**: 如吉備路自行車道（備前一宮站租 ➔ 總社站還）、瀨戶內島波海道（尾道租 ➔ 今治還）。必須確認訖點站具備官方還車站點，並將起訖租借點明確列為行程中的起訖節點！
    - **同店原處歸還 (Round-Trip Return)**: 如吉備路環狀折返（備前一宮站租 ➔ 吉備津彥神社 ➔ 吉備津神社 ➔ 騎回備前一宮站還車）、美瑛拼布之路（美瑛站前同店借還）、輕井澤雲場池環線。必須在景點結束後安排騎回原店還車節點，再銜接後續大眾運輸。
  - **營業時間、費用與電輔車 (E-bike) 推薦**：查明店家營業時間（如 08:30-17:00）、最後還車時間、車種（普通車 vs 電輔車），在多丘陵起伏地貌（如美瑛、輕井澤、吉備路）強烈推薦電動輔助自行車。
- **Taxi / rideshare** — proceed to step 9b
- **Rental car** — proceed to step 9c
- **Mixed** (e.g., transit by day, taxi at night, or train to hub + bicycle touring) — split legs and apply per leg

### 8. Research visit durations, date-specific opening hours, holiday status, and coordinates
For each picked attraction, restaurant, shop, paid facility, and transit hub (airport, stations, hotels, bike rental shops & docking stations), **search the web** for typical visit duration, official opening/operating hours, closed days, holiday/long-weekend operation, last admission/order, reservation rules, and accurate coordinates (`coords: [lat, lng]`). Never fabricate data.

**Mandatory Web Search for Visit Duration, Operating Hours & Bike Rental Locations (停留時間、營業時間與單車租賃強制上網查詢)**:
Whenever web lookup tools are available, you MUST explicitly search the web for the official or traveler-consensus recommended visit duration, date-specific operating status, and bicycle rental locations:
- `"<attraction>" 建議停留時間 OR 停留時間 OR 所需時間`
- `"<attraction>" 所要時間 OR 滞在時間 OR 観光時間`
- `"<attraction>" average visit duration OR how long to spend`
- `"<station/spot>" 自行車租借 OR レンタサイクル OR bike rental shops`
- `"<cycling route>" 甲租乙還 OR 乗り捨て OR one-way bike drop-off`
- `"<attraction>" opening hours OR hours OR business hours OR closed days OR last admission`
- `"<restaurant/shop>" business hours OR last order OR reservation OR holiday hours`
- `"<attraction/shop>" <visit date> holiday opening OR year-end New Year closure OR temporary closure`
- `"<attraction/shop>" 臨時休業 OR 年末年始 営業 OR 祝日 営業 OR 連休 営業`
- `"<attraction>" coordinates latitude longitude` or geocode via OpenStreetMap

**Date-Specific Operating-Hours & Holiday Check (依實際日期查核營業狀態)**:
For every attraction, restaurant, shop, market, museum, garden, observatory, transport service, and hotel service used in the itinerary:
- Verify the official source for the exact visit date, including weekly closing days, public holidays, consecutive holidays, year-end/New Year closures, seasonal or temporary closures, last admission/order, reservation requirements, and timed-entry limits.
- Never substitute ordinary weekday hours for a holiday or consecutive-holiday date. If the official schedule is unpublished or uncertain, label the stop as `待確認`, provide a nearby operating backup, and do not make it an irreplaceable core stop.
- Record the source URL and the date checked so the itinerary can be re-verified before departure.
Record per spot:
- **Spot name** (official name in destination + original script, including bike rental shop if applicable)
- **Coordinates** — `coords: [latitude, longitude]` (essential for Leaflet pin rendering)
- **Typical visit duration** (e.g. `停留 1 時 30 分`, `08:30 離開`, `租借單車 10 分`, `歸還單車 5 分`, `返回飯店休息`, `返抵國門`) — strictly derived from web search findings
- **Opening/operating hours, closed days, date-specific holiday status, last admission/order, and reservation rules** (with source URL and date checked)
- **Type classification**: `flight` ✈️, `hotel` 🛏️, `train` 🚆, `bus` 🚌, `bike` 🚲, `shopping` 🛍️, `info` ℹ️, `castle` 🏯, `shrine` ⛩️, `park` 🌿, `cruise` 🚢, `tower` 🗼, `sight` 📍.

### 9. Research transit segments & station waiting buffers (交通路段與候車緩衝)
For every leg between consecutive points, **search the web** for transit method, duration, and line names:

- **Station Waiting & Transfer Buffer (車站候車與轉乘緩衝假設 30 分鐘)**:
  - 在各大鐵道車站、地鐵樞紐、巴士總站出發或進行轉乘時，**一律假設候車與轉乘時間為 30 分鐘（候車假設 30min）**，以充分預留現場購票/劃位、交通卡感應、尋找月台與車廂、吸收地方鐵道班距（Headway），以及單車歸還後的候車時間（例如：`停留 0 時 30 分 (候車與轉乘)`、`歸還單車與候車 30 分`）。
- **Walking**: Explicitly research and state walking time (e.g. `步行 6 分`).
- **Bicycles / Cycling (自行車騎行)**: Explicitly research and state cycling route duration, distance, and rental/return details (e.g. `於備前一宮站前租借單車 ➔ 騎行 10 分 (約 2.0km / 沿吉備路自行車道) ➔ 抵達吉備津彥神社`, `HELLO CYCLING 電輔單車騎行 12 分 (約 2.2km)`). Calculate realistic travel time based on 12-15 km/h avg speed.
- **Trains / Metro**: Explicitly state the railway operator, line name, and train service (e.g. `JR 瀨戶大橋線（特急南風 Nanpu / 特急潮風 Shiokaze）47 分`, `JR 山陽新幹線 25 分`, `JR 吉備線（桃太郎線）24 分`).
- **Buses / Shuttles**: Specific line name (e.g. `機場接駁巴士 35 分`, `岡山路面電車 / 巴士 20 分`, `City Loop 巴士 15 分`).
- **Flights**: Airline flight code and flight time (e.g. `台灣虎航 IT214 02:35`).

### 10. Build the reactive itinerary data structure
Organize the entire trip into a Vue 3 reactive data structure matching `templates/okayama-travel.html`:

```javascript
const trip = reactive({
  title: '2026山陽關西夏末八天七夜旅遊',
  dateRange: '2026/09/05 - 2026/09/12',
  description: '詳細旅遊規劃背景、航班接駁與時間安排說明。'
});

const activeTab = ref('overview'); // Default to overview tab

const tabs = reactive([
  { id: 'overview', name: '總覽頁' },
  { id: 'day1', name: '第1天' },
  { id: 'day2', name: '第2天' },
  // ...
]);

const overview = reactive({
  notes: '本次旅遊進出機場為...，交通注意事項...',
  weather: [
    { title: '平均氣溫', icon: '🌡️', value: '23°C ~ 30°C', desc: '夏末初秋，日間溫暖微熱，早晚微風舒適。' },
    { title: '晴雨概況', icon: '☀️', value: '晴朗少雨', desc: '降雨機率低但午後偶有陣雨。' },
    { title: '穿著建議', icon: '👕', value: '透氣夏裝 + 薄外套', desc: '白天穿著短袖透氣衣物，室內冷氣房備薄開衫。' }
  ],
  notices: [
    '機場交通：岡山機場往返市區搭乘接駁巴士...',
    '交通票券：建議準備 ICOCA 或 Suica 交通卡...',
    '營業時間：日本部分老街店鋪多於 17:00 休息...'
  ]
});

const itinerary = reactive({
  day1: [
    {
      name: '臺灣桃園國際機場',
      time: '08:30',
      tag: '',
      type: 'flight',
      duration: '11:30 起飛',
      coords: [25.0797, 121.2342],
      transit: { icon: 'plane', text: '台灣虎航 IT214 02:35' }
    },
    {
      name: '岡山機場',
      time: '14:05',
      tag: '',
      type: 'flight',
      duration: '停留 0 時 45 分',
      coords: [34.7570, 133.8550],
      transit: { icon: 'bus', text: '機場接駁巴士 35 分' }
    },
    // ...
    {
      name: '岡山站前大和ROYNET飯店 (Daiwa Roynet Hotel)',
      time: '20:30',
      tag: '',
      type: 'hotel',
      coords: [34.6657, 133.9202],
      duration: '返回飯店休息'
    }
  ],
  // day2, day3 ... dayN
});
```

### 11. Add logistics & contingency
- Verify every attraction, restaurant, shop, facility, and service is open on the exact visit date; account for weekly closing days, public holidays, consecutive holidays, year-end/New Year closures, last entry/order, and timed reservations.
- If hours or holiday operations are unconfirmed, label the stop as `待確認`, include a nearby operating backup, and leave enough slack to switch without breaking the day.
- Reserve buffer for customs/immigration on arrival day and airport check-in on departure day.
- Hotel is the start and final rest spot of every day.

### 12. Produce final interactive HTML template

**Output language rule**: The final output **must be written in the same language the user used** (e.g. Traditional Chinese 繁體中文).

**Output format**: The final plan is a **self-contained HTML file** saved into `templates/<destination>-travel.html` (e.g. [`templates/okayama-travel.html`](./templates/okayama-travel.html)).

#### 12a. HTML Template Strict Specifications

The generated HTML file must strictly reproduce the architecture and design language of [`templates/okayama-travel.html`](./templates/okayama-travel.html):

1. **CDN Libraries & Styling**:
   - Tailwind CSS CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
   - Vue 3 Global CDN (`<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>`)
   - Leaflet CSS & JS (`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`, `<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`)
   - Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap');`
   - Custom z-index rule: `.leaflet-pane { z-index: 10 !important; }`, `.leaflet-top, .leaflet-bottom { z-index: 15 !important; }`
   - Body & Root: `<body class="bg-gray-50 text-slate-800 antialiased min-h-screen">` and `<div id="app" class="max-w-4xl mx-auto px-4 py-8">`.

2. **Top Header Card**:
   - Card wrapper: `bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6`
   - Title: `<h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{{ trip.title }}</h1>`
   - Date range: `<div class="mt-3 text-slate-500 font-medium text-sm md:text-base tracking-wide">{{ trip.dateRange }}</div>`
   - Description block: `<div class="mt-5 border-l-2 border-slate-300 pl-4 py-0.5"><p class="text-sm md:text-base text-slate-500 leading-relaxed">{{ trip.description }}</p></div>`

3. **Sticky Navigation Tab Bar (Clean Text Pill Design)**:
   - Sticky bar wrapper: `sticky top-3 z-30 mb-6`
   - Pill container with internal padding: `<nav class="bg-white/95 backdrop-blur-md rounded-[26px] p-3 md:p-3.5 shadow-sm border border-slate-200/80 flex items-center gap-2 md:gap-2.5 overflow-x-auto custom-scrollbar">`
   - Tab buttons (Strictly text only, NO icons):
     - Classes: `'px-4 py-2.5 rounded-[16px] text-sm font-bold whitespace-nowrap transition-all select-none cursor-pointer'`
     - Active state: `bg-[#e11d48] text-white shadow-xs`
     - Inactive state: `text-slate-700 hover:text-slate-900 hover:bg-slate-50`
     - Semantic classes: `day-tab`, `day-detail-tab` for daily tabs, `overview-tab` for overview.
     - Two-way URL hash sync (`#overview`, `#day1` ... `#dayN`).

4. **Tab Content Container**:
   - Outer card: `<div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8">`

5. **Overview Tab (4 Standard Sections)**:
   - **行程筆記 (Notes)**: `<div class="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200/80 text-slate-700 leading-relaxed text-sm md:text-base">{{ overview.notes }}</div>` (Summarizes background, flight, multi-night continuous hotel bases, and dining style).
   - **天氣資訊 (Weather)**: 3-column grid of `<div class="bg-sky-50/50 rounded-xl p-4 border border-sky-100 flex flex-col justify-between">` containing `title` badge (`text-xs font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full`), icon, `value`, and `desc`.
   - **注意事項 (Notices)**: `<div class="bg-amber-50/40 rounded-xl p-5 border border-amber-200/60">` with `text-amber-500 font-bold •` bullet items. **Must include**:
     - 旅遊警報與安全：外交部旅遊警示燈號、緊急救助專線與報警電話。
     - 簽證與入境：免簽天數、護照效期 (6個月以上) 及數位入境申報 (如 Visit Japan Web)。
     - 旅遊保險：建議投保海外突發疾病醫療險 (含緊急救援) 與旅遊不便險 (班機延誤/行李損失)。
      - 託運行李保障：行李託運前務必拍照存證「行李外觀全貌（含辨識標記）」、「託運條」、「託運存根聯」及「秤重重量」，以利行李延誤/損壞時進行航空公司理賠與保險申請。
     - 氣候天災與颱風應變：季節性颱風監測、大眾運輸停駛應對與官方氣象 App。
      - 野生動物與自然危害：山區景點熊出沒防範 (防熊鈴/避開清晨黃昏，並附上 [KumaMap 熊出沒地圖](https://kumamap.com/zh-Hant) 供即時查詢)、火山活動管制等。
   - **實用車站與地名日英對照表 (Place & Station Reference Table)**:
     - Clear, responsive table with columns: `中文名稱` | `日文名稱 (漢字/假名)` | `英文 / 羅馬拼音 (Romaji)` | `類型`
     - **Strict Derivation Rule**: Must be directly and strictly extracted from all unique spots, stations, airports, hotels, and attractions appearing across the `itinerary` (Day 1 ~ Day N), ensuring **1-to-1 exact correspondence** with the actual trip itinerary. Never add arbitrary fabricated places not visited in the itinerary.
     - Essential for ticket vending machines, Google Maps search, asking train conductors, and reading bilingual signage during travel.

6. **Daily Detail Tabs (`day-detail-section`, `day-detail-content`)**:
   - **OpenStreetMap Container** (`:id="'map-' + day.id"`, `w-full h-64 md:h-80 rounded-xl overflow-hidden`):
     - Positioned directly above the spot list for each day.
     - Header includes title and `🔄 檢視全部景點` reset button.
     - Numbered circular red markers (`1`, `2`, `3`...) matching the spot numbers.
     - Dashed connecting route line (`#e11d48`, weight: 3.5, dashArray: '5, 8').
     - **Leaflet Lifecycle**: Must execute `if (mapInstances[dayId]) { mapInstances[dayId].remove(); delete mapInstances[dayId]; }` on tab switch before instantiating the new Leaflet map on `nextTick`.
   - **Bidirectional Map Interaction**:
     - Clicking the red number badge (`index + 1`) on any spot card triggers `focusSpotOnMap(day.id, index)`: smoothly scrolls to the map, flies/zooms in close (Zoom Level 17), and automatically opens the marker popup.
     - Clicking the active Tab button or the `🔄 檢視全部景點` button triggers `resetMapView(day.id)`: smoothly restores the map view to fit all spots for that day (`fitBounds`).
   - **Spot Card Timeline (No Image Dependencies)**:
     - Card: `bg-[#f0f4f9] rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm border border-slate-200/50 hover:bg-[#e8eff7] transition`
     - Left number badge: `w-9 h-9 md:w-10 md:h-10 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm md:text-base flex items-center justify-center shadow-sm flex-shrink-0 cursor-pointer select-none`
     - Right info: Type icon in circle border + time + optional tag + spot name `h3` + duration `p`.
     - Transit connector between cards: `py-3 pl-8 md:pl-9 flex items-center gap-3 text-slate-500 text-xs md:text-sm font-medium` with emoji and transit line / walk time.
     - Fallback placeholder included for days without data.

**Verification before delivery**: Open the template HTML in a browser to confirm:
- Vue 3 loads and tabs switch smoothly with URL hash sync.
- Leaflet map initializes cleanly without gray/white blank tile artifacts when switching between days.
- Clicking spot number badges zooms into the location; clicking tabs/reset button restores the full-day view.
- All coordinates, transit lines, and schedules match researched data.

## Example triggers

**International — user provides preferences, picks from country recommendation**

```
User: I want to travel.
Agent: [step 1 → asks "Where are you, and domestic or international?"]
User: I'm in Taipei, Taiwan. International.
Agent: [step 2a → asks about preferences]
User: Culture + food, balanced pace, mid-range, temperate, couple.
Agent: [step 2b → web-searches popular destinations from Taiwan matching these preferences → presents 5–8 countries with characteristics, Taiwan rationale, and preferences-match rationale]
User: Japan.
Agent: [step 3 → asks "How many days?"]
User: 8 days.
Agent: [step 4 → asks "Any spots in mind, or want me to recommend?"]
User: Okayama, Kurashiki, Himeji, Kobe, Takamatsu.
Agent: [confirms list, researches durations and transit, and generates interactive template in templates/okayama-travel.html]
```

See [`templates/okayama-travel.html`](./templates/okayama-travel.html) for the standard reference implementation (Vue 3 + Tailwind CSS + OpenStreetMap numbered markers + URL hash sync).