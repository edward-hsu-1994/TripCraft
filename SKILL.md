---
name: tripcraft
description: Use when a user wants to plan a trip, choose a destination, receive attraction recommendations, or build a complete itinerary. TripCraft runs a research-driven, user-led workflow and produces a verified, standalone interactive itinerary HTML file.
---

# TripCraft

## Trigger

Use this skill for a complete travel-planning request: choosing a destination, selecting attractions, organizing a multi-day trip, or producing an itinerary.

Do **not** use it for a single flight, hotel, visa, weather, booking, or payment request unless that request is part of a complete itinerary.

## Language policy

1. Determine the output language from the first **substantive travel-planning message**. Ignore greetings, acknowledgements, and links without a request.
2. Preserve the dominant language and script throughout the conversation: Traditional Chinese (`zh-Hant`), Simplified Chinese (`zh-Hans`), Japanese (`ja`), English (`en`), or another confidently detected language.
3. Use that language for every user-facing planning response: questions, recommendations, research findings, itinerary text, notices, and generated HTML labels.
4. A later explicit language request overrides the stored language for all subsequent user-facing output.
5. If the first substantive request is genuinely mixed or indeterminate, ask one concise language-selection question before planning.
6. Keep official names, proper nouns, route identifiers, source citations, and intentional multilingual place-reference cells in their useful native forms. Localize surrounding prose and labels.

## Non-negotiable rules

- Follow the 12 steps in order. Skip only information the user has already supplied.
- Keep decisions user-led. Never silently remove chosen stops, select a hotel, force a restaurant reservation, or change a budget.
- Use web research whenever it is available. Never invent prices, hours, coordinates, visit durations, transit details, safety facts, or availability.
- Prefer a smooth geographic flow over a rigid round trip. Evaluate Open-Jaw routing whenever it avoids backtracking, fatigue, or unnecessary cost.
- For overnight trips, prefer continuous stays in each base area over needless hotel changes.
- Build each day from researched visit time + transit + meals + a **30-minute** station waiting/transfer buffer + contingency time.
- Do not schedule a venue, restaurant, shop, service, or transport option until its exact-date operating status is verified. If status is unpublished or uncertain, label it as pending, provide an operating backup, and do not make it indispensable.

## 12-step workflow

### 1. Confirm origin and trip scope

Capture the user's city/country of origin and whether the trip is domestic or international.

### 2. Capture preferences and recommend destinations

Ask about travel style, pace, budget, climate, companions, accessibility, transport preference, dietary needs, and must-avoid conditions.

Then research and present **5–8** choices:

- International: countries that fit the origin, visa practicality, distance, value, and stated preferences.
- Domestic: cities or regions that fit the same preferences.

For every choice, give a concise characteristic, best season, travel style, and a concrete reason it matches the user. Let the user choose before continuing.

### 3. Confirm duration

Capture the number of days, including half-days where needed. Use duration, pace, transit, and stamina to set density.

| Duration | Typical stop count | Default pace |
| --- | ---: | --- |
| 2–3 days | 3–6 | Relaxed |
| 4–5 days | 6–10 | Balanced |
| 6–7 days | 8–12 | Balanced |
| 8–10 days | 10–15 | Mixed |
| 10+ days | 12–18 plus day trips | Relaxed |

### 4. Confirm attractions

If the user has named stops, verify their exact locations, flag an infeasible density, offer at most 1–2 relevant additions, and ask what to retain or remove.

If the user wants recommendations, refine interests, iconic-vs-hidden preference, indoor/outdoor preference, pace, walking tolerance, and must-avoid conditions. Research stops and show each stop's category, physical demand, short description, and preference match. Scale the list to the duration and let the user choose.

### 5. Complete trip and lodging requirements

Collect the missing requirements in this order:

- Exact dates; airport routing; Open-Jaw versus round-trip preference.
- Travelers, relationships, total budget, and currency. If the user does not name a currency, default to the origin currency.
- Accessibility, dietary needs, age range or self-reported stamina, and meal pace.
- Optional restaurant preferences. Respect spontaneous dining; do not turn this into mandatory reservations.

For an overnight trip, also collect lodging type, location, nightly budget, room configuration, required amenities, check-in/out constraints, loyalty programs, and booking constraints.

Research **3–5** lodging options that fit the requirements. Record name/brand, address or nearest station and walking time, ratings with source/sample size, date-specific approximate nightly price, transit access, and source URLs. The user chooses; do not silently default. If no option fits, explain whether dates, location, or budget must change. The selected lodging becomes each day's default start and end point.

### 6. Research destination, safety, and local context

Research and summarize:

- Seasonal climate, packing, crowd level, local holidays, and major events in the trip window.
- **5–10 total** local specialties, souvenirs, and signature experiences, including where to buy/book, approximate price or lead time when relevant, and source URLs.
- Official travel advisories, common scams, local emergency numbers, and unsafe areas or hours. For Taiwan travelers, include the MOFA advisory and Overseas Emergency Hotline `+886-800-085-095` when relevant.
- Passport validity, visa or visa-waiver terms, digital entry declarations, and official entry sources.
- Travel insurance: overseas emergency medical cover with evacuation, travel inconvenience cover, and accident cover.
- Baggage-claim preparation: photograph luggage exterior and identifiers, the baggage tag, claim stub, and check-in weight.
- Seasonal disasters, transport suspension plans, official weather/transport apps, wildlife hazards, bear precautions and [KumaMap](https://kumamap.com/zh-Hant) for relevant Japanese mountain or rural travel, earthquake readiness, and volcanic restrictions.

### 7. Confirm transport mode

Reconfirm the transport preference after destination, stops, and lodging are known. Evaluate walking, public transit, public bike share, scenic rental bikes or e-bikes, taxi/rideshare, rental car, and mixed transport.

For cycling, research and schedule around the actual rental ecosystem:

- Exact shop or dock name, location, hours, price, bike type, and final return time.
- Availability-driven sequence: route to a valid pickup point before cycling; never start at a station without a rental option.
- One-way drop-off versus round-trip return, including verified return locations.
- Realistic route distance and riding time; use **12–15 km/h** as the default flat-route cycling baseline. Recommend e-bikes for hilly routes.

### 8. Research each stop

For every attraction, restaurant, shop, paid facility, lodging service, transport service, station, airport, and bike provider, record:

- Official name, useful local-script name, and `coords: [latitude, longitude]`.
- Research-based visit duration.
- Official hours, weekly closure, exact-date holiday or long-weekend status, year-end/New Year and seasonal/temporary closures, last admission/order, reservations, and timed entry.
- Source URL and date checked.

Search the exact visit date; never substitute ordinary weekday hours for a holiday. If the source has not published the schedule, mark the item as pending and add a nearby verified backup.

### 9. Research every transit leg

For every consecutive pair of stops, research the actual route, duration, fare where useful, and operator/service name.

- Walking: state realistic walking minutes.
- Cycling: state route, distance, duration, and pickup/return logistics.
- Rail/metro: state operator, line, service, and transfer path.
- Bus/shuttle: state operator or line.
- Flights: state airline, flight number, and flight duration when known.
- At rail, metro, and bus departures or transfers, add **30 minutes** for ticketing, platform finding, headways, and bike-return logistics.

### 10. Build the itinerary data model

Use the structure and naming convention of `templates/okayama-travel.html`. At minimum, provide `trip`, `tabs`, `overview`, and `itinerary.day1` through `itinerary.dayN`.

Each itinerary item needs a localized name, time, optional tag, type, researched duration, coordinates, and the following transit object when applicable:

```javascript
{ icon: 'train', text: 'Operator, line, and researched travel time' }
```

The overview must include notes, three weather cards, notices, and a place/station reference table derived **one-to-one** from actual itinerary entities.

### 11. Validate logistics and contingency

Confirm that every day starts and ends at the selected lodging or an airport; arrival and departure days include immigration, baggage, and check-in time; all hours and reservations fit the exact dates; and every pending item has a non-breaking backup.

### 12. Deliver the interactive HTML itinerary

Write the complete, self-contained file to `templates/<destination>-travel.html`. The final response and every user-visible HTML string must follow the language policy.

## HTML contract

Use `templates/okayama-travel.html` as the CLI reference implementation. Preserve its Vue 3, Tailwind CSS, Leaflet/OpenStreetMap, responsive visual hierarchy, and behavior:

- Header card; sticky, text-only pill tabs; URL hash sync for overview and every day.
- Overview with notes, three weather cards, safety notices, and a responsive place/station reference table strictly derived one-to-one from the itinerary.
- Daily route map above the itinerary cards, numbered rose markers, dashed route polyline, and map cleanup before re-instantiation.
- Bidirectional map behavior: a numbered card badge focuses the map at zoom 17 and opens its popup; the active tab or reset control restores the full-day view.
- Responsive daily cards with time, type icon, tag, name, duration, and explicit transit connectors. Include a fallback for a day with no items.
- A locale-aware document language, localized labels, and fonts that render Chinese, Japanese, and English.
- No omitted days, ellipses, TODOs, mock data, or external build step. CDN dependencies are limited to Vue, Tailwind, Leaflet, and fonts.

Before delivery, open the generated HTML in a browser and verify Vue rendering, tab/hash behavior, Leaflet lifecycle, map interactions, all researched coordinates/transit, and language-correct labels.
