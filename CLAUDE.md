# CLAUDE.md - Loudon/DeSarro Athletic Complex

> **Last Updated:** February 14, 2026
> **Version:** 1.0
> **Owner:** Shane Brazelton (SRM Dispatch, Alabama)
> **Repo:** github.com/thebardchat/loudon-desarro

---

## Project Overview

Interactive 3D visualizations and investor-facing landing page for the **Loudon/DeSarro Athletic Complex** — a proposed 50,000 SF multi-sport facility in Hazel Green, Alabama. Named for Coach Loudon (in memory) and Coach DeSarro (in honor), two wrestling legends.

**Tech:** HTML + CSS + Three.js (CDN). Zero build tools. Open any HTML file in a browser.

---

## File Structure

```
loudon-desarro/
├── CLAUDE.md                    # This file
├── README.md                    # Project overview and specs
├── index.html                   # Investor-facing landing page
├── explore-quonset.html         # Quonset arch 3D walkthrough
├── explore-rectangular.html     # Rectangular steel 3D walkthrough
├── plexflex.html                # PLEX FLEX beam deploy demo
├── floorplan.html               # Option C SVG floor plan
├── js/
│   └── facility-core.js         # Shared 3D layout, materials, zones, cameras, animation
└── archive/
    └── explore-original.html    # Old combined explore (replaced)
```

---

## Architecture

### Shared Core Pattern
Both explore pages load `js/facility-core.js` and pass a shell builder callback:

```js
FacilityCore.init(document.getElementById('container'), function(scene, materials, constants) {
  // Build shell geometry (arch or rectangular)
  // Return shell mesh group
});
```

~90% of code is shared. Only the building shell differs between versions.

### Layout: Option C (200' x 250')

```
       WEST (Glass Garage Doors)                    EAST (PLEX FLEX)
  X=0                                                          X=200'
  +------------------------------------------------------------+ Z=0
  |                  GRAND ENTRANCE (25' deep)                  |
  +------------+-----------------------------------------------+ Z=25'
  |   TURF     |        WRESTLING ARENA (140' x 120')           |
  |  STRIP     |       3x NCAA 42'x42' mats                    |
  |  60' wide  +-----------------------------------------------+ Z=145'
  |  225' long |        STRENGTH & CONDITIONING (140' x 105')   |
  |  = 75 yds  |        Power racks, platforms                  |
  +------------+-----------------------------------------------+ Z=250'

  East wall: PLEX FLEX beams deploy OUTWARD (2,500 seats)
  West wall: Glass garage doors open to outdoor training field
```

### PLEX FLEX Behavior

- **16 rows x 12 sections = 192 beams** (20' each)
- **Outward deploy ONLY** — beams extend through east wall
- **Stowed:** Flush in east wall, full 200' interior clear
- **Deployed:** 2,500 outdoor seats with stepped rake sightlines
- **No indoor deploy mode exists**

### Key Constants (facility-core.js)

| Constant | Value | Description |
|----------|-------|-------------|
| `FT` | 0.3048 | Feet to meters conversion |
| `BW` | 200' | Building width (X axis) |
| `BL` | 250' | Building length (Z axis) |
| `BH` | 40' | Building height (Y axis) |
| `BEAM_L` | 20' | PLEX FLEX beam length |
| `PF_ROWS` | 16 | PLEX FLEX rows |
| `PF_SECTIONS` | 12 | PLEX FLEX sections per row |
| `TURF_W` | 60' | Turf strip width |
| `ENT_DEPTH` | 25' | Entrance depth |

---

## Key Design Rules

1. **Glass garage doors on WEST wall** (X=0) — open to outdoor field
2. **PLEX FLEX on EAST wall** (X=200') — beams deploy outward only
3. **Camera views must have 5'+ clearance** from all geometry (no clipping)
4. **Three.js r128** via CDN — no npm, no build step
5. **All pages work offline** after first CDN load
6. **Performance target: 30fps** on low-end hardware (Raspberry Pi)

---

## Testing

Open each HTML file directly in a browser:
```
explore-quonset.html    — Quonset arch with 13-phase build animation
explore-rectangular.html — Rectangular steel with build animation
plexflex.html           — Deploy/stow beams, swap view
floorplan.html          — SVG floor plan (no 3D)
index.html              — Landing page with links to all demos
```

Verify:
- No camera clipping through geometry
- PLEX FLEX beams deploy outward only, retract flush
- All zone proportions match the layout diagram
- All links between pages work
- Smooth 30fps rendering

---

## Named For

- **Coach Loudon** — Head wrestling coach at Hazel Green HS. Lost to a heart attack. His name goes on the front door.
- **Coach DeSarro** — Retired head coach at Grissom HS. One of the winningest wrestling coaches in Alabama history. Coached Coach Loudon. Coached Shane.

---

## Contact

**Builder:** Shane Brazelton
**Email:** shanebrain@theangel.cloud
**Ko-fi:** ko-fi.com/shanebrain
**Discord:** discord.gg/xbHQZkggU7
