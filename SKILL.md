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
6. **Always ask the user about transport mode** between locations. Do not assume.
7. **Always web-research visit duration** for each attraction. Cite the source.
8. **Always web-research transit data** (transit time + waiting time + fare) for each leg. Cite the source.
9. **Total day plan = sum of (visit durations + transit times + waiting times + meals + buffer)**. No hand-waving.

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
- Exact date range (origin / destination of flight if international)
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
### 6. Research destination
Cover, in 1–2 short paragraphs each:
- Climate and what to pack for the season
- Peak / shoulder / off-season status and crowd impact
- Local holidays or major events inside the trip window
- **Local specialties, souvenirs, and signature experiences** (see sub-section below)

**If international** (from step 1):
- Visa / entry requirements for the traveler's passport (and any transit countries)
- Passport validity (typically 6 months beyond trip end)
- Recommended or required vaccinations
- Time zone difference vs origin and jet lag impact on first/last day
- Local currency, payment norms (cash vs card), and exchange options
- Language basics and translation tools
- Travel advisory level

**If domestic**: skip the international items above.

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

### 7. Confirm transport mode with the user
**Re-confirm or refine** the transport preference captured in step 2a. This step ensures the user's choice is still correct after they've seen the destination / spots / hotel options, and gives them a chance to switch (e.g., "actually, given the hotel location, let's just take taxis"). The confirmed choice shapes step 9 and the budget:
- Walking only (limited radius, slow pace)
- Public transit (metro / bus / train) — proceed to step 9a
- Taxi / rideshare — proceed to step 9b
- Rental car — proceed to step 9c
- Mixed (e.g., transit by day, taxi at night) — split legs and apply 9a / 9b per leg

### 8. Research visit durations and opening hours
For each picked attraction, **search the web** for typical visit duration AND business hours. Never fabricate either.

Query patterns:
- `"<attraction>" average visit duration`
- `how long to spend at "<attraction>"`
- `"<attraction>" typical time`
- `"<attraction>" opening hours`
- `"<attraction>" opening hours <day-of-week>`
- `"<attraction>" closed days`
- `"<attraction>" last entry time`

Record per attraction:
- Attraction name
- **Typical visit duration** (with range; median if conflicting)
- **Opening hours** by day of week
- **Closed days** (e.g. "closed Mondays", "closed 2nd & 4th Tuesday")
- **Last-entry / cut-off time** if any (e.g. "last entry 30 min before close")
- **Time-of-day restrictions** (e.g. "mornings only for guided tours")
- **Source URL** for both duration and hours

If web research fails, fall back to a clearly-labeled estimate and tell the user which items need verification.

### 9. Research transit segments
For every leg between consecutive points, **search the web** for actual data. For public transit (9a), break the leg into four sub-times and web-search each:

- **Walk-to-station** — minutes from origin (hotel / previous attraction) to the boarding station
- **Wait / headway** — typical frequency at the planned time of day (off-peak + peak)
- **Ride** — minutes on the vehicle, including transfers
- **Walk-from-station** — minutes from alighting station to the next attraction / hotel

**Total transit time used in step 10 = walk-to-station + wait + ride + walk-from-station.** Do not silently drop any of the four.

**9a. Public transit** — search:
- `"<from>" to "<to>" by metro <city>` (overall leg)
- `"<station> to <station> metro <city>"` (ride only)
- `"<city> <line> schedule / frequency <time of day>"` (wait / headway)
- `"walk from <hotel> to <station> minutes"` (walk-to-station)
- `"walk from <station> to <attraction> minutes"` (walk-from-station)
- `"<from>" to "<to>" bus route <city>`

Capture per leg:
- Walk-to-station minutes
- Wait / headway minutes (off-peak + peak separately if both occur)
- Ride minutes (with transfers if any)
- Walk-from-station minutes
- Total leg time (sum)
- Fare
- **Source URL** for each component

**9b. Taxi / rideshare** — search:
- `taxi fare "<from>" to "<to>" <city>`
- `drive time "<from>" to "<to>" <city>`

Capture: drive time, estimated fare, **source URL**.

**9c. Rental car** — search:
- `driving "<from>" to "<to>" <city>`
- `parking near "<attraction>" <city>`

Capture: drive time, parking notes, **source URL**.

If the destination has no public transit (rural area), state that explicitly, note the gap, and suggest alternative modes.

### 10. Build the day-by-day itinerary

Assemble each day's time-blocked table from the researched data (steps 8 and 9).

Row rules:
- One row = one continuous activity. Split a leg with a wait > 15 min into two rows if the wait matters.
- `Location / Activity` column must include the activity type in parentheses: `(visit)` / `(transit)` / `(meal)` / `(check-in)` / `(departure)` / `(rest)`.
- `Transit & method` column must describe the mode and fare (or `walk`, `—` for non-transit rows).
- Times must be realistic: arrival + visit duration + transit duration + buffer = start of next slot.
- **Always reserve the first half-day for arrival logistics and the last half-day for departure.**
- Alternate high-intensity and low-intensity days.
- Add one contingency option per day (rain plan / indoor alternative).
- **Visit times must fall within the attraction's opening hours from step 8** — never schedule a visit outside open hours or on a closed day. If the only way to fit a spot is during closed hours, flag and ask the user before moving it.
- Total day plan must fit within the user's pace preference.
- **Day count must match the duration from step 3** — if spots overflow, flag and ask before cutting.
- If any leg crosses rush hour, note it explicitly (e.g. "crosses 17:30–19:30 rush — buffer +10 min").
- **Every row needs a source URL** (or `—` for items with no research value, like generic meals / rest).
| `09:00–10:30` | `Hotel → Narita Airport` (transit) | `~90 min` | `JR Narita Express; JPY 3,070` | `<URL>` |
| `10:30–12:00` | `Senso-ji Temple + Nakamise` (visit) | `1.5 hr` | `(walk from station)` | `<URL>` |
| `12:00–13:00` | `Lunch in Asakusa` (meal) | `1 hr` | `—` | `—` |

### 11. Add logistics
- Booking lead times for popular restaurants, museums, tours
- Connectivity (SIM / pocket WiFi / eSIM)
- Day-level contingency for legs with unreliable transit time

**If international** (from step 1):
- International flight booking lead time and rough price range (earlier for longer duration)
- Travel insurance (medical + trip cancellation)
- Currency exchange / international card with no foreign transaction fee
- eSIM for destination (data plan)
- Vaccinations if required
- Power adapter / voltage for destination
- Embassy / consulate contact in destination
- Arrival logistics: airport transfers, immigration wait time estimate

**If domestic**: skip the international items above.

### 12. Produce final plan

**Transit leg structure**: every transit leg between two consecutive non-transit activities is broken into **multiple time-blocked rows** showing each phase:

1. **Departure prep** at origin (only if origin is the hotel): wake up, freshen up, pack, etc. (activity type `(departure)`).
2. **Walk-to origin station** (activity type `(walk)`).
3. **Wait for the vehicle** at the boarding station (activity type `(transit)` with mode "wait at X station").
4. **Ride** on the vehicle (activity type `(transit)` with the line / mode + fare).
5. **Arrive at destination station** (activity type `(arrival)` — typically zero-duration, marks the handoff).
6. **Walk from station** to the next visit / hotel (activity type `(walk)`).
7. **Arrive at destination** (activity type `(arrival)` — zero-duration marker before the next visit).

Example for "Hotel in Okayama → Kurashiki Bikan Historical Quarter":

| Time | Location / Activity | Duration | Transit & method | Source |
| --- | --- | --- | --- | --- |
| `07:30–08:00` | Hotel wake up + get ready (departure) | 30 min | — | — |
| `08:00–08:15` | Walk to Okayama Station (walk) | 15 min | walk | <URL> |
| `08:15–08:20` | Wait for JR train (transit) | 5 min | JR Okayama, platform 5–7 | <URL> |
| `08:20–08:45` | Ride JR to Kurashiki (transit) | ~25 min | JR Sanyo Line; JPY 330 | <URL> |
| `08:45` | Arrive Kurashiki Station (arrival) | — | — | — |
| `08:45–08:55` | Walk to Bikan Historical Quarter (walk) | 10 min | walk | <URL> |
- Include 2–3 meal suggestions per day as **flexible options** — restaurants/eateries **near the current or next attraction** (e.g., "Lunch near Senso-ji" → walkable from the temple; "Dinner after Shibuya Sky" → near Shibuya Station), not locked restaurant bookings. **Pick the meal location based on what's nearby at that point in the day**, not based on some unrelated "best restaurant" lookup. **Do not bake in wait times** — meal rows are flexible placeholders, not locked bookings. If the user wants leisurely pacing, allocate more meal time; if quick, allocate less. Never let meal rows force tighter-than-asked spacing between spots.
| `08:55` | Arrive at Bikan Historical Quarter (arrival) | — | — | — |
| `08:55–10:25` | Kurashiki Bikan Historical Quarter (visit) | 1.5 hr | — | <URL> |

Skip rows that are zero or near-zero in the user's context (e.g. a same-station transfer where walk is < 2 min — fold into the next row). For the airport arrival at the start of a trip, the departure prep comes *before* leaving for the airport.


**Output language rule**: the final markdown **must be written in the same language the user used to talk to you**. If the user wrote in Traditional Chinese (繁體中文), the output is in Traditional Chinese — including the title, all section headers, descriptions, checklist items, and any commentary. If the user wrote in English, the output is in English. If the user mixed languages, follow the dominant language; switch only for proper nouns (place names, brand names) and source quotes.

This rule applies to **all user-facing content**:
- Title block
- Section headers
- Section descriptions / intros
- Row content in tables (translations of place names are OK to keep in original script)
- Checklist items
- Notes and recommendations

`SKILL.md` itself stays in English (the skill definition is portable).
**Output format**: the final plan is a **self-contained HTML file** (`.html`). If the user explicitly asks for markdown, produce markdown instead — but HTML is the default. See sub-section 12d for the HTML template specification.

Output a complete file. **Required top-level sections** (in this order):

1. **Title block** — H1: `[City/Region, Country] [N]-Day Itinerary — [Month Year]`. Sub-line with origin, destination, dates, duration, travelers, trip type, transport mode, pace, stated preferences, age + stamina.
2. **行前注意事項 / Pre-trip Notes** — see sub-section 12b below for checklist + trip-specific notes
3. **氣候資訊 / Climate Information** — see sub-section 12c below for weather summary + clothing
4. **行程表 / Itinerary** — one **time-blocked table per day** with columns: `Time` | `Location / Activity` | `Duration` | `Transit & method` | `Source`. Each row is one continuous activity (visit / transit / meal / check-in / rest / departure); transit rows include the walk + wait + ride + walk-from breakdown from step 9; every row carries a source URL. Title each day with date + area.

**Appendix sections** (after the itinerary, for reference and verification):

5. **Recommended destinations on the table** — the list from step 2 (with per-preference rationale)
6. **Proposed spots considered** — the candidate list from step 4 (with per-preference rationale + physical demand tags)
7. **Hotel recommendation** — from step 5c (3–5 options with rating, price, source)
8. **Local Specialties & Experiences** — from step 6a (5–10 items: products, souvenirs, signature experiences)
9. **Attraction visit durations & opening hours** — table: name, duration, opening hours, closed days, source URL
10. **Transit segments** — table: from→to, mode, walk-to + wait + ride + walk-from, fare, source URL
11. **Tickets & Passes** — from step 11 (city passes, attraction tickets, lead times)
12. **Budget estimate** — by category (lodging, transit, food, activities, **flights if international**, contingency)
13. **Packing list** — tailored to destination, season, and trip type
14. **Local tips** — language basics, customs, emergency numbers
15. **If international**: entry requirements summary (visa, passport validity, vaccinations), time zone, currency, embassy contact
16. **Review Notes** — checklist output from step 12b

#### 12b. Pre-trip Notes (行前注意事項)
Two sub-blocks: a **checklist** and **trip-specific notes**.

**Checklist** — markdown checkbox list. Cover at minimum:
- [ ] Travel insurance purchased (medical + trip cancellation)
- [ ] Passport validity verified (≥ 6 months past trip end)
- [ ] Visa / entry permit secured (if international)
- [ ] International flight booked (or domestic transport booked)
- [ ] Hotel booked (address confirmed)
- [ ] Tickets / passes booked (museum passes, timed-entry attractions, etc.)
- [ ] eSIM or pocket WiFi ordered
- [ ] Currency exchanged / international card activated
- [ ] Vaccinations updated (if required)
- [ ] Embassy / consulate contact saved offline
- [ ] Travel insurance policy number saved offline
- [ ] Emergency contacts (family, doctor) shared with traveling companion
- [ ] Photocopy of passport stored separately from the original

Adapt the list to the trip — drop irrelevant items (e.g. embassy for domestic), add trip-specific ones (e.g. trekking permit for a hike-heavy trip).

**Trip-specific notes** — destination-specific reminders:
- Visa requirement (if international)
- Travel advisory level
- Local laws / customs to be aware of
- Health precautions (water, food, altitude)
- Common scams / tourist traps to avoid
- Emergency numbers (police, ambulance, embassy)

#### 12c. Climate Information (氣候資訊)
Pull from step 6 (destination research) and tailor to the trip dates. Cover:

- **Weather summary** — expected high / low temperatures for the trip dates, rainfall / humidity, typhoon / snow season risk, sunrise / sunset times if relevant. Source URLs required.
- **Clothing recommendations** — derived from weather + planned activities:
  - Day / night temperature ranges and layering
  - Footwear for the walking budget (e.g., "comfortable walking shoes — expect 10–15 km/day")
  - Activity-specific needs ("temples require removable shoes" → slip-ons; "rainy season" → quick-dry layers)
  - Cultural / venue dress codes if any
  - Rain / cold protection (foldable umbrella, light jacket, etc.)
- Do not skip step 2. Destination selection is a user decision, not an agent assumption.
- Do not skip step 3. Duration drives spot count and day-by-day sizing.
- Do not skip step 4. Spot selection is a user decision, not an agent assumption.
- Do not skip step 7. Transport mode is a user decision, not an agent assumption.
- In step 2 Branch A, every recommended country must include both a "why it appeals to <origin> travelers" rationale and a "why it matches the user's preferences" rationale.
- In step 4 Branch B, the recommended spot count must be scaled to the duration from step 3.
- In step 4 Branch B, every recommended spot must include a one-line rationale tied back to the refined preferences.
- For international trips, the agent must surface the visa requirement early (step 6) — if the user cannot get a visa, the rest of the plan is moot.

#### 12d. HTML output template
The final HTML file **must follow this specification** (see `examples/reference/*.html` for complete working examples):

**Self-containment rules**:
- One single `.html` file — no external CSS or JS files. All custom CSS/JS is embedded in `<style>`/`<script>` tags inside the file.
- External CDNs allowed (and required): **Tailwind CSS** via `<script src="https://cdn.tailwindcss.com"></script>`, **Leaflet** CSS + JS via unpkg CDN. No build step, no npm.
- Use Tailwind utility classes for all styling (layout, typography, colors, cards, tables). Avoid hand-written CSS except for marker icons, scroll-margin, and print styles.

**Map (OpenStreetMap + Leaflet)**:
- Load OpenStreetMap tiles via Leaflet: `L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", ...)` with attribution `&copy; OpenStreetMap`.
- **Every attraction gets a numbered marker** (①–⑳ style: a colored circle with the spot's number rendered via `L.divIcon`). Numbering matches the spot list and the appendix tables.
- Markers are colored by category (culture / food / shopping / nature / view / art) with a shared palette.
- The **hotel** gets a distinct marker (letter "H", different color).
- **Day tabs** (總覽 / Day 1 / … / Day N) sit in a sticky bar above the itinerary content. Switching a tab: shows **only that day's itinerary section**, filters the map markers to that day, **refits the map bounds to focus on those spots**, and scrolls to top. The 總覽 tab shows everything (overview + all days + appendix).
- Clicking a marker opens a popup with the spot name + day(s); clicking a spot name in the itinerary **switches to that spot's day tab**, scrolls to the section, and opens the marker popup (`scrollToSpot`).
- A spot visited on multiple days stores `days` as an **array** in the spot data.

**Layout**:
- Desktop (lg+): map in a **sticky sidebar** (~2/5 width) beside the scrollable itinerary content (~3/5).
- Mobile: map **on top** (fixed height ~420px), itinerary below.
- Header bar with trip title + one-line summary; overview cards (origin / destination / transport / budget).
- Each day is a `<section id="dayN">` with a time-blocked table: `時間` | `地點 / 活動` | `時長` | `交通方式` | `來源` (source link). Spot rows carry the numbered marker reference and category tags.
- Appendix sections after the itinerary: durations & hours, hotel, specialties, budget, packing list, local tips.
- `@media print` hides the map, tabs, and filter buttons.

**Verification before delivery**: open the file in a browser and confirm — Leaflet loads, all markers render, tab switching changes both visible sections and marker counts with map refocus, no JS console errors.

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
User: 5 days.
Agent: [step 4 → asks "Any spots in mind, or want me to recommend?"]
User: Senso-ji, Skytree, teamLab Borderless, Meiji Shrine, Harajuku, Shibuya, Tsukiji, Akihabara, Imperial Palace.
Agent: [confirms list, suggests Shinjuku Gyoen as an addition, notes 10 spots / 5 days is on the busier side but doable at balanced pace]
User: Yes. October, USD 4000, public transit.
Agent: [continues through steps 5–12 with international logistics → produces tokyo-5days.md]
```

**Domestic — user picks from location recommendation**

```
User: 我想規劃一趟國內旅行
Agent: [step 1 → asks "Where are you, and domestic or international?"]
User: 人在台北，想在國內玩
Agent: [step 2a → asks about preferences]
User: 文化 + 美食，步調輕鬆，中價位，怕人多
Agent: [step 2c → web-searches popular Taiwan destinations matching these → presents 5–8]
User: 我想去台南
Agent: [step 3 → asks "How many days?"]
User: 3 天
Agent: [step 4 → asks about spots; recommend 3–6 given the duration]
... (domestic flow; step 6 / step 11 skip visa, currency, embassy)
```

**Branch B at step 4 — user wants spot recommendations**

```
User: ... [after picking Japan, 5 days, with stated culture+food preference] ... but I don't know which spots in Tokyo to pick.
Agent: [step 4 Branch B → refines step-2a preferences for spot level]
User: Mix of iconic and hidden, mostly outdoor, want to avoid huge crowds.
Agent: [web-searches Tokyo culture + food spots → proposes 6–10 (scaled to 5 days) with rationale tied to refined preferences]
User: [picks a subset, adds two of their own]
Agent: [continues through steps 5–12 → produces tokyo-5days.md]
```

See [`examples/reference/tokyo-5days.html`](./examples/reference/tokyo-5days.html) for a full reference HTML output (Tailwind + OpenStreetMap numbered markers), and [`examples/reference/fukuoka-5days.html`](./examples/reference/fukuoka-5days.html) for a Traditional-Chinese example with multi-day spots. The original markdown versions are kept alongside as [`examples/reference/tokyo-5days.md`](./examples/reference/tokyo-5days.md) and [`examples/reference/fukuoka-5days.md`](./examples/reference/fukuoka-5days.md).