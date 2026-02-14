# Loudon / DeSarro Athletic Complex

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20This%20Project-ff5f5f?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/shanebrain)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289da?style=for-the-badge&logo=discord)](https://discord.gg/xbHQZkggU7)

> **50,000 SF multi-sport athletic complex** honoring two wrestling legends.
> Filling the gap between Birmingham and Nashville. Hazel Green, Alabama.

---

## The Problem

Wrestling is booming in **Birmingham**. It's massive in **Nashville**. But between those two cities — 190 miles of nothing. No dedicated multi-sport training complex serves North Alabama's growing youth athletics corridor.

Kids drive hours or they don't go at all.

**That's the gap. This is the fix.**

---

## The Facility

| Feature | Spec |
|---------|------|
| **Total Footprint** | 50,000 SF (200' x 250') |
| **Building Options** | Quonset arch OR rectangular steel |
| **Wrestling Arena** | 3x NCAA regulation 42'x42' competition mats (140' x 120') |
| **PLEX FLEX™ System** | 2,500 retractable concrete beam seats (outward deploy only) |
| **Indoor Turf** | 75-yard strip along west wall (60' x 225') |
| **Strength & Conditioning** | Power racks, Olympic platforms, cable machines (140' x 105') |
| **Glass Garage Doors** | West wall opens to outdoor training field |
| **Glass Partitions** | Viewing between wrestling/S&C and turf |
| **Amenities** | Concessions, merch, locker rooms, offices, food truck parking |

### Layout (Option C)

```
       WEST (Glass Garage Doors)                    EAST (PLEX FLEX →)
  X=0                                                              X=200'
  ┌──────────────────────────────────────────────────────────────────┐ Z=0
  │                    GRAND ENTRANCE (25' deep)                     │
  ├────────────┬─────────────────────────────────────────────────────┤ Z=25'
  │   TURF     │           WRESTLING ARENA (140' × 120')             │
  │  STRIP     │        3× NCAA 42'×42' mats                        │
  │  60' wide  ├─────────────────────────────────────────────────────┤ Z=145'
  │  225' long │        STRENGTH & CONDITIONING (140' × 105')        │
  │  = 75 yds  │         Power racks · Platforms                     │
  ├────────────┴─────────────────────────────────────────────────────┤ Z=250'
  └──────────────────────────────────────────────────────────────────┘
```

### PLEX FLEX™ — The Innovation

16 rows × 12 sections of retractable concrete beams (20' each) that deploy **outward only** through the east wall. 2,500 seats with stepped rake sightlines. Full 200' interior stays clear at all times. Nothing like it exists.

---

## The Market Opportunity

```
Birmingham ←── 95 mi ──→ ★ HAZEL GREEN ←── 95 mi ──→ Nashville
(Established)              (On the State Line)         (Massive Market)
```

- **50+ schools** in draw radius (Madison County, Limestone County, southern Tennessee)
- **3-state draw** — Alabama, Tennessee, Georgia athletes within 2-hour drive
- **Year-round revenue** — tournaments, camps, S&C memberships, turf rentals, outdoor events
- **Zero competition** — no dedicated facility exists in this corridor

---

## Named for Legends

### Coach Loudon — *In Memory*
Head wrestling coach at Hazel Green High School. Lost to a heart attack at the start of this season. Poured everything into his wrestlers — not just technique, but character. His name goes on the front door.

### Coach DeSarro — *In Honor*
Retired head coach at Grissom High School. One of the winningest wrestling coaches in Alabama history. Built men for decades. Coached Coach Loudon. Coached me. Without him, none of us would be here.

---

## Interactive Demos

This repo includes full interactive 3D visualizations — open any HTML file in a browser:

| File | What It Shows |
|------|--------------|
| **[index.html](index.html)** | Investor-facing landing page with market analysis |
| **[explore-quonset.html](explore-quonset.html)** | Quonset arch 3D — dramatic curved shell, full walkthrough |
| **[explore-rectangular.html](explore-rectangular.html)** | Rectangular steel 3D — conventional building, same interior |
| **[plexflex.html](plexflex.html)** | PLEX FLEX™ demo — 20' beams deploy outward, 16×12 grid |
| **[floorplan.html](floorplan.html)** | Option C SVG floor plan with all zones labeled |

### Shared Code

| File | Purpose |
|------|---------|
| **[js/facility-core.js](js/facility-core.js)** | Shared layout, materials, zones, PLEX FLEX, cameras, animation |

Both explore pages load `facility-core.js` and pass their own shell builder function. ~90% shared code.

All demos run locally with zero dependencies (Three.js loaded via CDN for 3D pages).

---

## Who This Is For

- **Investors** — Untapped market, year-round revenue model, innovative IP (PLEX FLEX™)
- **Schools** — A facility they can't afford to build, available for tournaments and training
- **Parents** — A safe, world-class place for their kids to train year-round
- **Athletes** — Wrestling, football, soccer, track — multi-sport under one roof
- **Community** — Events, outdoor concerts (PLEX FLEX™ outdoor mode), food truck rallies

---

## The Builder

**Shane Brazelton** — Dispatch operator, father of five, youth wrestling coach in Hazel Green.

Self-taught engineer building everything from AI systems to 3D facility visualizations on a Raspberry Pi with 7.4GB of RAM. This project is personal — it's for the kids who train in the same gyms where I coach.

---

## Get Involved

Interested in investing, sponsoring, or partnering?

- **Email:** shanebrain@theangel.cloud
- **Ko-fi:** [ko-fi.com/shanebrain](https://ko-fi.com/shanebrain)
- **Discord:** [Join the community](https://discord.gg/xbHQZkggU7)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Landing Page | HTML + CSS (zero dependencies) |
| 3D Demos | Three.js (CDN) + shared facility-core.js |
| Floor Plan | SVG |
| Hosting | GitHub Pages |

---

*"The kids between Birmingham and Nashville deserve a world-class facility. We're going to build it."*

**Built with grit in Alabama.**
