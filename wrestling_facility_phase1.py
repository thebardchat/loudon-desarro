# ============================================================================
# PHASE 1 WRESTLING TRAINING FACILITY - FreeCAD Model
# ============================================================================
# Ben & Gino Wrestling Program - Hazel Green, Alabama
# 10,000 SF (100' x 100') Pre-Engineered Metal Building
#
# Contractors:
#   - Summer Time Metals: Metal building (kit + erection)
#   - SRM Concrete: 6" reinforced slab foundation
#   - Coach's Window Company: Windows/glazing
#
# Interior Layout:
#   - 3x Wrestling Mats (42' x 42' each with safety border)
#   - Weight Room / Strength Training
#   - Men's & Women's Locker Rooms / Restrooms
#   - Office / Viewing Area for Parents
#
# Run: Open FreeCAD > Macro > Execute Macro > Select this file
# Or: Copy/paste into FreeCAD Python console
# ============================================================================

import FreeCAD as App
import Draft

# ============================================================================
# CONVERSION: All FreeCAD dimensions in mm
# ============================================================================
FT = 304.8        # 1 foot = 304.8 mm
IN = 25.4         # 1 inch = 25.4 mm

# ============================================================================
# BUILDING PARAMETERS (Edit these to change the design)
# ============================================================================

# Overall Building
BLDG_LENGTH = 100 * FT     # 100 feet (North-South)
BLDG_WIDTH  = 100 * FT     # 100 feet (East-West)
EAVE_HEIGHT = 18 * FT      # 18 feet eave height (good for wrestling)
ROOF_PITCH  = 3             # 3:12 pitch (standard metal building)

# Slab Foundation
SLAB_THICK  = 6 * IN       # 6 inch reinforced concrete slab
SLAB_DEPTH  = SLAB_THICK   # Below grade depth

# ---- Telescopic Beam System (PLEX FLEX™) ----
TELE_ROWS         = 16              # 16 rows of elevating beams
TELE_EXTRA_SEATS  = 2600            # Extra spectator capacity
TELE_STOW_Z       = -24 * FT       # Stowed position (below slab)
TELE_DEPLOY_Z     =  42 * FT       # Fully deployed position
TELE_BEAM_HEIGHT  =  4 * FT        # Height of each beam/row
TELE_HORIZ_STEP   =  4 * FT        # Horizontal step between rows
TELE_PIT_DEPTH    =  26 * FT       # Pit depth below grade (24' beams + 2' clearance)
TELE_PIT_LENGTH   =  76 * FT       # Pit length (spans mat area width)
TELE_PIT_WIDTH    =  12 * FT       # Pit width at each end
TELE_FLAP_THICK   =   4 * IN       # Safety flap cover thickness

# Walls
EXT_WALL_THICK = 6 * IN    # Metal panel wall thickness
INT_WALL_THICK = 4 * IN    # Interior partition thickness

# Wrestling Mats (3 mats side by side along the length)
MAT_SIZE    = 42 * FT      # 42' x 42' competition mat with safety border
MAT_THICK   = 2 * IN       # 2 inch mat thickness
MAT_GAP     = 4 * FT       # 4 feet between mats
MAT_OFFSET_Y = 6 * FT      # Offset from south wall

# Support Areas (along east wall, 24' deep)
SUPPORT_DEPTH = 24 * FT    # Depth of support area (east side)

# Individual Room Widths (along east wall, north to south)
OFFICE_WIDTH     = 20 * FT  # Office / viewing area
LOCKER_M_WIDTH   = 16 * FT  # Men's locker room
LOCKER_W_WIDTH   = 16 * FT  # Women's locker room
WEIGHT_WIDTH     = 24 * FT  # Weight room / strength training
MECH_WIDTH       = 24 * FT  # Mechanical / storage

# Doors
ROLL_DOOR_W  = 12 * FT     # Roll-up door width
ROLL_DOOR_H  = 12 * FT     # Roll-up door height
MAN_DOOR_W   = 3 * FT      # Man door width
MAN_DOOR_H   = 7 * FT      # Man door height

# Colors (R, G, B) 0.0-1.0
COLOR_SLAB      = (0.75, 0.75, 0.75)   # Concrete gray
COLOR_EXT_WALL  = (0.25, 0.35, 0.50)   # Blue-gray metal
COLOR_INT_WALL  = (0.85, 0.85, 0.80)   # Off-white
COLOR_MAT       = (0.80, 0.10, 0.10)   # Red wrestling mat
COLOR_MAT_CIRCLE = (0.90, 0.85, 0.20)  # Yellow circle
COLOR_WEIGHT    = (0.40, 0.40, 0.45)   # Dark gray
COLOR_LOCKER    = (0.70, 0.80, 0.90)   # Light blue
COLOR_OFFICE    = (0.90, 0.85, 0.70)   # Warm beige
COLOR_ROOF      = (0.55, 0.55, 0.55)   # Metal roof gray
COLOR_BEAM      = (0.82, 0.80, 0.76)  # Concrete beam (light gray)
COLOR_PIT       = (0.35, 0.35, 0.35)  # Pit interior (dark)
COLOR_FLAP      = (0.65, 0.65, 0.60)  # Safety flap (steel gray)

# ============================================================================
# CREATE DOCUMENT
# ============================================================================

doc = App.newDocument("WrestlingFacility_Phase1")
App.setActiveDocument("WrestlingFacility_Phase1")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def make_box(name, length, width, height, x=0, y=0, z=0, color=None):
    """Create a box (Part::Box) at given position with optional color."""
    obj = doc.addObject("Part::Box", name)
    obj.Length = length
    obj.Width = width
    obj.Height = height
    obj.Placement = App.Placement(
        App.Vector(x, y, z),
        App.Rotation(0, 0, 0)
    )
    if color:
        obj.ViewObject.ShapeColor = color
    return obj

def make_text_label(name, text, x, y, z=500):
    """Create a text annotation at position."""
    try:
        label = Draft.make_text([text], App.Vector(x, y, z))
        label.Label = name
        return label
    except:
        pass  # Text may not work in all FreeCAD versions

# ============================================================================
# 1. CONCRETE SLAB FOUNDATION (SRM Concrete)
# ============================================================================

slab = make_box(
    "Slab_Foundation",
    BLDG_LENGTH, BLDG_WIDTH, SLAB_THICK,
    x=0, y=0, z=-SLAB_THICK,
    color=COLOR_SLAB
)

# Thickened edge (perimeter footing - 12" wide x 18" deep)
footing_width = 12 * IN
footing_depth = 18 * IN

# North footing
make_box("Footing_North", BLDG_LENGTH, footing_width, footing_depth,
         x=0, y=BLDG_WIDTH - footing_width, z=-footing_depth, color=COLOR_SLAB)
# South footing
make_box("Footing_South", BLDG_LENGTH, footing_width, footing_depth,
         x=0, y=0, z=-footing_depth, color=COLOR_SLAB)
# East footing
make_box("Footing_East", footing_width, BLDG_WIDTH, footing_depth,
         x=BLDG_LENGTH - footing_width, y=0, z=-footing_depth, color=COLOR_SLAB)
# West footing
make_box("Footing_West", footing_width, BLDG_WIDTH, footing_depth,
         x=0, y=0, z=-footing_depth, color=COLOR_SLAB)

# ============================================================================
# 2. EXTERIOR WALLS (Summer Time Metals)
# ============================================================================

# North wall (back)
make_box("Wall_North", BLDG_LENGTH, EXT_WALL_THICK, EAVE_HEIGHT,
         x=0, y=BLDG_WIDTH - EXT_WALL_THICK, z=0, color=COLOR_EXT_WALL)

# South wall (front - main entrance)
make_box("Wall_South", BLDG_LENGTH, EXT_WALL_THICK, EAVE_HEIGHT,
         x=0, y=0, z=0, color=COLOR_EXT_WALL)

# East wall
make_box("Wall_East", EXT_WALL_THICK, BLDG_WIDTH, EAVE_HEIGHT,
         x=BLDG_LENGTH - EXT_WALL_THICK, y=0, z=0, color=COLOR_EXT_WALL)

# West wall
make_box("Wall_West", EXT_WALL_THICK, BLDG_WIDTH, EAVE_HEIGHT,
         x=0, y=0, z=0, color=COLOR_EXT_WALL)

# ============================================================================
# 3. INTERIOR PARTITION WALL (Separates mat area from support rooms)
# ============================================================================

# Main divider wall - runs North-South, 76' from west wall (leaving 24' for support)
divider_x = BLDG_LENGTH - SUPPORT_DEPTH

make_box("Wall_Divider_Main", INT_WALL_THICK, BLDG_WIDTH, EAVE_HEIGHT,
         x=divider_x, y=0, z=0, color=COLOR_INT_WALL)

# ============================================================================
# 4. SUPPORT ROOM DIVIDER WALLS (East side, 24' deep section)
# ============================================================================

# Room layout from South to North along east wall:
# [Office 20'] [Men's Locker 16'] [Women's Locker 16'] [Weight Room 24'] [Mech 24']

room_start_y = 0
rooms = [
    ("Wall_Office_North", OFFICE_WIDTH),
    ("Wall_LockerM_North", LOCKER_M_WIDTH),
    ("Wall_LockerW_North", LOCKER_W_WIDTH),
    ("Wall_Weight_North", WEIGHT_WIDTH),
    # Mech fills remaining space to north wall
]

current_y = 0
room_positions = []

for wall_name, room_width in rooms:
    room_positions.append(("Room", current_y, current_y + room_width))
    current_y += room_width
    # Create divider wall at top of each room
    make_box(wall_name, SUPPORT_DEPTH, INT_WALL_THICK, 10 * FT,
             x=divider_x, y=current_y, z=0, color=COLOR_INT_WALL)

# ============================================================================
# 5. WRESTLING MAT AREA (3 mats - 76' x 100' open space)
# ============================================================================

# Mat area: West side of building, 76' wide x 100' long
# 3 mats arranged: 1 row of 3, each 42' x 42'
# Total mat width: 3 x 42' = 126' -- TOO WIDE
# Arrange: 2 mats side by side (84') + 1 mat offset, or 3 in an L

# REVISED: 76' width available. Each mat is 42'.
# Layout: 2 mats side-by-side along south wall (84' needed but only 76' wide)
# Better: Mats are 40' competition + 2' safety = 42'. Use 38' mats + 2' buffer.
# BEST: Place mats lengthwise (3 across the 100' length, 42' deep into 76' width)

# 3 mats along the length (north-south): 3 x 42' = 126' > 100'
# 3 mats: use 38' mats with 2' safety = 40' each
# 3 x 40' = 120' -- still too long

# ACTUAL LAYOUT: 2 mats side by side + 1 stacked
# Row 1 (south): 2 mats @ 42' each = 84' in 100' length, centered
# Row 2 (north): 1 mat centered for warm-up / practice

mat_area_width = divider_x - EXT_WALL_THICK  # ~76' usable

# Row 1: Two mats side by side (south half)
mat1_x = 8 * FT                              # 8' from west wall
mat1_y = MAT_OFFSET_Y                        # 6' from south wall

mat2_x = mat1_x + MAT_SIZE + MAT_GAP         # Second mat east of first
mat2_y = MAT_OFFSET_Y

# Row 2: One mat centered (north half, for practice/warm-up)
mat3_x = (mat_area_width - MAT_SIZE) / 2 + EXT_WALL_THICK  # Centered
mat3_y = MAT_OFFSET_Y + MAT_SIZE + MAT_GAP   # Above row 1

# Create mat surfaces
make_box("Wrestling_Mat_1", MAT_SIZE, MAT_SIZE, MAT_THICK,
         x=mat1_x, y=mat1_y, z=0, color=COLOR_MAT)

make_box("Wrestling_Mat_2", MAT_SIZE, MAT_SIZE, MAT_THICK,
         x=mat2_x, y=mat2_y, z=0, color=COLOR_MAT)

make_box("Wrestling_Mat_3_Warmup", MAT_SIZE, MAT_SIZE, MAT_THICK,
         x=mat3_x, y=mat3_y, z=0, color=COLOR_MAT)

# ============================================================================
# 6. SUPPORT ROOM FLOOR MARKERS (colored floors to show room use)
# ============================================================================

room_z = 1  # Just above slab (1mm) for visibility

# Office / Viewing Area (south end, east side)
make_box("Floor_Office", SUPPORT_DEPTH - INT_WALL_THICK, OFFICE_WIDTH, 50,
         x=divider_x + INT_WALL_THICK, y=0, z=room_z, color=COLOR_OFFICE)

# Men's Locker Room
make_box("Floor_LockerM", SUPPORT_DEPTH - INT_WALL_THICK, LOCKER_M_WIDTH, 50,
         x=divider_x + INT_WALL_THICK, y=OFFICE_WIDTH, z=room_z, color=COLOR_LOCKER)

# Women's Locker Room
make_box("Floor_LockerW", SUPPORT_DEPTH - INT_WALL_THICK, LOCKER_W_WIDTH, 50,
         x=divider_x + INT_WALL_THICK,
         y=OFFICE_WIDTH + LOCKER_M_WIDTH, z=room_z,
         color=(0.90, 0.75, 0.80))  # Pink tint

# Weight Room
make_box("Floor_WeightRoom", SUPPORT_DEPTH - INT_WALL_THICK, WEIGHT_WIDTH, 50,
         x=divider_x + INT_WALL_THICK,
         y=OFFICE_WIDTH + LOCKER_M_WIDTH + LOCKER_W_WIDTH, z=room_z,
         color=COLOR_WEIGHT)

# Mechanical / Storage (remaining space)
mech_y = OFFICE_WIDTH + LOCKER_M_WIDTH + LOCKER_W_WIDTH + WEIGHT_WIDTH
mech_height = BLDG_WIDTH - mech_y
make_box("Floor_Mechanical", SUPPORT_DEPTH - INT_WALL_THICK, mech_height, 50,
         x=divider_x + INT_WALL_THICK, y=mech_y, z=room_z,
         color=(0.60, 0.60, 0.55))

# ============================================================================
# 7. ROOF (Simple gable - represented as flat for now)
# ============================================================================

# Flat roof representation at eave height
make_box("Roof_Panel", BLDG_LENGTH, BLDG_WIDTH, 4 * IN,
         x=0, y=0, z=EAVE_HEIGHT, color=COLOR_ROOF)

# Ridge beam (center peak for gable indication)
ridge_height = (BLDG_WIDTH / 2) * (ROOF_PITCH / 12)  # Rise from 3:12 pitch
make_box("Ridge_Beam", BLDG_LENGTH, 8 * IN, 12 * IN,
         x=0, y=BLDG_WIDTH / 2 - 4 * IN, z=EAVE_HEIGHT + ridge_height,
         color=(0.40, 0.40, 0.40))

# ============================================================================
# 8. STEEL COLUMNS (Typical metal building frame - every 25')
# ============================================================================

col_size = 8 * IN  # W8 column representation
col_spacing = 25 * FT

for i in range(5):  # 5 frames at 0', 25', 50', 75', 100'
    y_pos = i * col_spacing
    if y_pos >= BLDG_WIDTH:
        y_pos = BLDG_WIDTH - col_size

    # West column
    make_box(f"Column_West_{i}", col_size, col_size, EAVE_HEIGHT,
             x=col_size, y=y_pos, z=0, color=(0.30, 0.30, 0.30))

    # East column (at divider wall for interior support)
    make_box(f"Column_East_{i}", col_size, col_size, EAVE_HEIGHT,
             x=BLDG_LENGTH - SUPPORT_DEPTH, y=y_pos, z=0,
             color=(0.30, 0.30, 0.30))

    # Far east column (exterior)
    make_box(f"Column_FarEast_{i}", col_size, col_size, EAVE_HEIGHT,
             x=BLDG_LENGTH - col_size * 2, y=y_pos, z=0,
             color=(0.30, 0.30, 0.30))

# ============================================================================
# 9. DOORS
# ============================================================================

# Main entrance - double door on south wall (centered on mat area)
entrance_x = mat_area_width / 2 - MAN_DOOR_W
make_box("Door_Main_Entrance", MAN_DOOR_W * 2, EXT_WALL_THICK + 100, MAN_DOOR_H,
         x=entrance_x, y=-50, z=0, color=(0.55, 0.35, 0.15))

# Roll-up door on north wall (equipment access)
make_box("Door_RollUp_North", ROLL_DOOR_W, EXT_WALL_THICK + 100, ROLL_DOOR_H,
         x=20 * FT, y=BLDG_WIDTH - EXT_WALL_THICK - 50, z=0,
         color=(0.45, 0.45, 0.45))

# Office entrance (south wall, east side)
make_box("Door_Office", MAN_DOOR_W, EXT_WALL_THICK + 100, MAN_DOOR_H,
         x=divider_x + 4 * FT, y=-50, z=0, color=(0.55, 0.35, 0.15))

# Emergency exit (east wall)
make_box("Door_Emergency_East", EXT_WALL_THICK + 100, MAN_DOOR_W, MAN_DOOR_H,
         x=BLDG_LENGTH - EXT_WALL_THICK - 50, y=50 * FT, z=0,
         color=(0.80, 0.10, 0.10))

# ============================================================================
# 10. TELESCOPIC BEAM SYSTEM — PLEX FLEX™
# ============================================================================
# The 6" slab is modified with deep pits at the North and South ends to house
# the telescopic beams.  16 rows of beams rise from the floor (Z = -24' stowed
# to Z = +42' fully deployed) to seat 2,600 additional spectators.
# Automated safety flaps cover the floor gaps when the bleachers ascend.

mat_area_width_val = divider_x - EXT_WALL_THICK  # Usable mat-area width

# ---- 10a. Deep Pits (North & South) ----
# North pit — sits against the inside of the north wall
pit_north_y = BLDG_WIDTH - EXT_WALL_THICK - TELE_PIT_WIDTH
make_box("Pit_North", TELE_PIT_LENGTH, TELE_PIT_WIDTH, TELE_PIT_DEPTH,
         x=EXT_WALL_THICK, y=pit_north_y, z=-TELE_PIT_DEPTH,
         color=COLOR_PIT)

# South pit — sits against the inside of the south wall
pit_south_y = EXT_WALL_THICK
make_box("Pit_South", TELE_PIT_LENGTH, TELE_PIT_WIDTH, TELE_PIT_DEPTH,
         x=EXT_WALL_THICK, y=pit_south_y, z=-TELE_PIT_DEPTH,
         color=COLOR_PIT)

# ---- 10b. Elevating Beams (stowed position: Z = -24') ----
beam_length = TELE_PIT_LENGTH       # Each beam spans the pit length
beam_width  = TELE_PIT_WIDTH / TELE_ROWS * 3   # Width per beam section

for end_tag, pit_y in [("North", pit_north_y), ("South", pit_south_y)]:
    count = 1 if end_tag == "North" else -1
    for r in range(TELE_ROWS):
        elevation = r * TELE_BEAM_HEIGHT
        horizontal_step = (TELE_ROWS - 1 - r) * TELE_HORIZ_STEP * count

        beam = doc.addObject("Part::Box", f"ElevatingBeam_{end_tag}_Row_{r}")
        beam.Length = beam_length
        beam.Width  = beam_width
        beam.Height = TELE_BEAM_HEIGHT * 0.9  # Slight gap between rows
        beam.Placement = App.Placement(
            App.Vector(
                EXT_WALL_THICK,
                pit_y - horizontal_step,
                TELE_STOW_Z + elevation
            ),
            App.Rotation()
        )
        beam.ViewObject.ShapeColor = COLOR_BEAM

# ---- 10c. Safety Interlock Flaps ----
# Automated steel flaps cover the floor openings when beams are deployed.
# One flap per pit, hinged at the pit edge (modeled flat / closed position).

make_box("SafetyFlap_North", TELE_PIT_LENGTH, TELE_PIT_WIDTH, TELE_FLAP_THICK,
         x=EXT_WALL_THICK, y=pit_north_y, z=-TELE_FLAP_THICK,
         color=COLOR_FLAP)

make_box("SafetyFlap_South", TELE_PIT_LENGTH, TELE_PIT_WIDTH, TELE_FLAP_THICK,
         x=EXT_WALL_THICK, y=pit_south_y, z=-TELE_FLAP_THICK,
         color=COLOR_FLAP)

# ============================================================================
# 11. LABELS (Text annotations for rooms)
# ============================================================================

labels = [
    ("Label_Mat1", "MAT 1\n(Competition)", mat1_x + MAT_SIZE/2, mat1_y + MAT_SIZE/2),
    ("Label_Mat2", "MAT 2\n(Competition)", mat2_x + MAT_SIZE/2, mat2_y + MAT_SIZE/2),
    ("Label_Mat3", "MAT 3\n(Warm-Up/Practice)", mat3_x + MAT_SIZE/2, mat3_y + MAT_SIZE/2),
    ("Label_Office", "OFFICE /\nVIEWING AREA", divider_x + SUPPORT_DEPTH/2, OFFICE_WIDTH/2),
    ("Label_LockerM", "MEN'S\nLOCKER", divider_x + SUPPORT_DEPTH/2, OFFICE_WIDTH + LOCKER_M_WIDTH/2),
    ("Label_LockerW", "WOMEN'S\nLOCKER", divider_x + SUPPORT_DEPTH/2, OFFICE_WIDTH + LOCKER_M_WIDTH + LOCKER_W_WIDTH/2),
    ("Label_Weight", "WEIGHT ROOM", divider_x + SUPPORT_DEPTH/2, OFFICE_WIDTH + LOCKER_M_WIDTH + LOCKER_W_WIDTH + WEIGHT_WIDTH/2),
    ("Label_Mech", "MECH /\nSTORAGE", divider_x + SUPPORT_DEPTH/2, mech_y + mech_height/2),
    ("Label_Pit_North", "TELESCOPIC PIT\n(NORTH)", TELE_PIT_LENGTH/2 + EXT_WALL_THICK, pit_north_y + TELE_PIT_WIDTH/2),
    ("Label_Pit_South", "TELESCOPIC PIT\n(SOUTH)", TELE_PIT_LENGTH/2 + EXT_WALL_THICK, pit_south_y + TELE_PIT_WIDTH/2),
]

for name, text, x, y in labels:
    make_text_label(name, text, x, y, z=500)

# ============================================================================
# 12. RECOMPUTE AND FIT VIEW
# ============================================================================

doc.recompute()

# Try to fit the view
try:
    import FreeCADGui as Gui
    Gui.activeDocument().activeView().viewIsometric()
    Gui.SendMsgToActiveView("ViewFit")
except:
    pass  # Running headless or no GUI

# ============================================================================
# BUILDING SUMMARY
# ============================================================================

print("=" * 60)
print("  PHASE 1 WRESTLING TRAINING FACILITY")
print("  Ben & Gino Wrestling Program - Hazel Green, AL")
print("=" * 60)
print(f"  Building:     {BLDG_LENGTH/FT:.0f}' x {BLDG_WIDTH/FT:.0f}' = {(BLDG_LENGTH/FT * BLDG_WIDTH/FT):,.0f} SF")
print(f"  Eave Height:  {EAVE_HEIGHT/FT:.0f} feet")
print(f"  Roof Pitch:   {ROOF_PITCH}:12")
print(f"  Slab:         {SLAB_THICK/IN:.0f}\" reinforced concrete")
print(f"")
print(f"  MAT AREA:     {mat_area_width/FT:.0f}' x {BLDG_WIDTH/FT:.0f}'")
print(f"  - Mat 1:      {MAT_SIZE/FT:.0f}' x {MAT_SIZE/FT:.0f}' (Competition)")
print(f"  - Mat 2:      {MAT_SIZE/FT:.0f}' x {MAT_SIZE/FT:.0f}' (Competition)")
print(f"  - Mat 3:      {MAT_SIZE/FT:.0f}' x {MAT_SIZE/FT:.0f}' (Warm-Up)")
print(f"")
print(f"  SUPPORT AREA: {SUPPORT_DEPTH/FT:.0f}' deep (east side)")
print(f"  - Office:     {SUPPORT_DEPTH/FT:.0f}' x {OFFICE_WIDTH/FT:.0f}'")
print(f"  - Men's Lock: {SUPPORT_DEPTH/FT:.0f}' x {LOCKER_M_WIDTH/FT:.0f}'")
print(f"  - Women Lock: {SUPPORT_DEPTH/FT:.0f}' x {LOCKER_W_WIDTH/FT:.0f}'")
print(f"  - Weight Rm:  {SUPPORT_DEPTH/FT:.0f}' x {WEIGHT_WIDTH/FT:.0f}'")
print(f"  - Mechanical: {SUPPORT_DEPTH/FT:.0f}' x {mech_height/FT:.0f}'")
print(f"")
print(f"  PLEX FLEX™ TELESCOPIC BEAMS:")
print(f"  - Rows:       {TELE_ROWS}")
print(f"  - Capacity:   {TELE_EXTRA_SEATS:,} extra spectators")
print(f"  - Stowed Z:   {TELE_STOW_Z/FT:.0f}' (below slab)")
print(f"  - Deployed Z: {TELE_DEPLOY_Z/FT:.0f}' (above floor)")
print(f"  - Pit Depth:  {TELE_PIT_DEPTH/FT:.0f}' below grade")
print(f"  - Safety:     Automated interlock flaps ({TELE_FLAP_THICK/IN:.0f}\" steel)")
print(f"")
print(f"  CONTRACTORS:")
print(f"  - Metal Bldg: Summer Time Metals")
print(f"  - Concrete:   SRM Concrete")
print(f"  - Windows:    Coach's Window Company")
print("=" * 60)
print("  Model created successfully! Use View > Fit All to see.")
print("=" * 60)
