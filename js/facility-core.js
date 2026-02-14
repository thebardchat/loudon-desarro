// ============================================================
// FACILITY-CORE.JS — Loudon / DeSarro Athletic Complex
// Shared layout, materials, zones, PLEX FLEX, cameras, animation
// ============================================================
(function () {
  'use strict';

  // ── CONSTANTS ──────────────────────────────────────────────
  var FT = 0.3048;
  var BW = 200 * FT;          // building width  (X: west=0 → east=BW)
  var BL = 250 * FT;          // building length  (Z: front=0 → back=BL)
  var ENT_DEPTH = 25 * FT;    // entrance zone depth
  var TURF_W = 60 * FT;       // turf strip width (along west wall)
  var TURF_START = ENT_DEPTH;
  var TURF_LEN = 225 * FT;    // 75 yards
  var WRESTLE_X = TURF_W;     // wrestling starts east of turf
  var WRESTLE_Z = ENT_DEPTH;
  var WRESTLE_W = BW - TURF_W; // 140'
  var WRESTLE_D = 120 * FT;
  var SC_Z = WRESTLE_Z + WRESTLE_D; // S&C starts at 145'
  var SC_W = BW - TURF_W;     // 140'
  var SC_D = 105 * FT;
  var MAT = 42 * FT;          // NCAA mat side

  // PLEX FLEX
  var BEAM_L = 20 * FT;
  var BEAM_H = 2.5 * FT;
  var PF_ROWS = 16;
  var PF_SECTIONS = 12;
  var PF_SEC_LEN = BL / PF_SECTIONS;
  var WALL_X = BW;             // east wall

  // ── HELPERS ────────────────────────────────────────────────
  function bx(w, h, d, x, y, z, mt) {
    var g = new THREE.BoxGeometry(w, h, d);
    var o = new THREE.Mesh(g, mt);
    o.position.set(x, y, z);
    return o;
  }

  function makeMat(c, opts) {
    var p = { color: c };
    if (opts) { for (var k in opts) p[k] = opts[k]; }
    return new THREE.MeshLambertMaterial(p);
  }

  // ── MATERIALS ──────────────────────────────────────────────
  function createMaterials() {
    return {
      slab:      makeMat(0x7a7a78),
      metal:     makeMat(0x2a3848),
      glass:     makeMat(0x88ccee, { transparent: true, opacity: 0.18 }),
      glassFr:   makeMat(0x445566, { transparent: true, opacity: 0.10 }),
      glassWall: makeMat(0x66aacc, { transparent: true, opacity: 0.12 }),
      steel:     makeMat(0x484848),
      mat:       makeMat(0xa01020),
      gold:      makeMat(0xd4af37),
      turf:      makeMat(0x2d7a30),
      white:     makeMat(0xeeeeee),
      rubber:    makeMat(0x1a1a1e),
      wall:      makeMat(0xe5e0d8),
      office:    makeMat(0xb8a07a),
      concrete:  makeMat(0x8a8a85),
      concSeat:  makeMat(0x9a9a95),
      track:     makeMat(0x555555),
      door:      makeMat(0xd4af37),
      asphalt:   makeMat(0x2a2a2a),
      ground:    makeMat(0x1e2a16),
      sign:      makeMat(0x0a0a0e),
      equip:     makeMat(0x222228),
      field:     makeMat(0x1a5a20),
      rectWall:  makeMat(0x3a4555),
      rectRoof:  makeMat(0x2a3040),
      partition: makeMat(0x77aacc, { transparent: true, opacity: 0.14, side: THREE.DoubleSide }),
      archSkin:  makeMat(0x6a7585, { side: THREE.DoubleSide }),
      glassCap:  makeMat(0x88ccee, { transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    };
  }

  // ── BUILD GROUPS ───────────────────────────────────────────
  function createGroups(scene) {
    var names = [
      'ground', 'foundation', 'steel', 'shell',
      'entrance', 'garageDoors', 'partitions',
      'mats', 'turf', 'sc', 'tracks', 'signage'
    ];
    var G = {};
    names.forEach(function (n) {
      G[n] = new THREE.Group();
      G[n].visible = false;
      scene.add(G[n]);
    });
    return G;
  }

  // ── ZONE BUILDERS ─────────────────────────────────────────

  function buildGround(G, M) {
    // large ground plane
    G.ground.add(bx(400, 0.02, 400, BW / 2, -0.35, BL / 2, M.ground));
    // parking lot south of entrance
    G.ground.add(bx(BW + 10 * FT, 0.04, 30 * FT, BW / 2, -0.22, -18 * FT, M.asphalt));
    // parking stripes
    for (var i = 0; i < 22; i++) {
      G.ground.add(bx(0.06, 0.01, 4 * FT, 6 * FT + i * 8 * FT, -0.15, -18 * FT, M.white));
    }
    // outdoor field east of building
    G.ground.add(bx(60 * FT, 0.03, BL, BW + 35 * FT, -0.28, BL / 2, M.field));
  }

  function buildFoundation(G, M) {
    G.foundation.add(bx(BW + 0.3, 0.2, BL + 0.3, BW / 2, -0.1, BL / 2, M.slab));
  }

  function buildEntrance(G, M) {
    // front wall with two door openings
    var wallH = 14 * FT;
    // left section
    G.entrance.add(bx(BW * 0.3, wallH, 0.15, BW * 0.15, wallH / 2, 0.08, M.wall));
    // right section
    G.entrance.add(bx(BW * 0.3, wallH, 0.15, BW * 0.85, wallH / 2, 0.08, M.wall));
    // above doors
    G.entrance.add(bx(BW * 0.4, wallH * 0.35, 0.15, BW / 2, wallH * 0.825, 0.08, M.wall));
    // glass doors (two entrances)
    var doorW = 4 * FT, doorH = 9 * FT;
    G.entrance.add(bx(doorW, doorH, 0.1, BW * 0.38, doorH / 2, 0.05, M.door));
    G.entrance.add(bx(doorW, doorH, 0.1, BW * 0.62, doorH / 2, 0.05, M.door));
    // glass transom above doors
    G.entrance.add(bx(BW * 0.4, 3 * FT, 0.08, BW / 2, doorH + 1.5 * FT, 0.05, M.glass));
    // interior entrance zone floor
    G.entrance.add(bx(BW - 2 * FT, 0.04, ENT_DEPTH - 1 * FT, BW / 2, 0.02, ENT_DEPTH / 2, M.office));
    // back wall of entrance (interior partition)
    G.entrance.add(bx(BW - 4 * FT, 10 * FT, 0.12, BW / 2, 5 * FT, ENT_DEPTH, M.wall));
    // pass-through openings
    G.entrance.add(bx(6 * FT, 8 * FT, 0.2, BW * 0.25, 4 * FT, ENT_DEPTH, makeMat(0x000000, { transparent: true, opacity: 0 })));
    G.entrance.add(bx(6 * FT, 8 * FT, 0.2, BW * 0.75, 4 * FT, ENT_DEPTH, makeMat(0x000000, { transparent: true, opacity: 0 })));
  }

  function buildSignage(G, M) {
    // sign above entrance
    G.signage.add(bx(18 * FT, 3 * FT, 0.08, BW / 2, 16 * FT, -0.2, M.sign));
    // gold trim under sign
    G.signage.add(bx(19 * FT, 0.08, 0.1, BW / 2, 14.4 * FT, -0.22, M.door));
  }

  function buildWrestlingArena(G, M) {
    // 3 NCAA mats in the wrestling zone
    // Zone: X = TURF_W to BW (140' wide), Z = ENT_DEPTH to ENT_DEPTH+WRESTLE_D (120' deep)
    var zoneXCenter = TURF_W + WRESTLE_W / 2;
    var zoneZCenter = WRESTLE_Z + WRESTLE_D / 2;

    // mat floor base
    G.mats.add(bx(WRESTLE_W - 4 * FT, 0.02, WRESTLE_D - 4 * FT, zoneXCenter, 0.01, zoneZCenter, M.rubber));

    // 3 mats: row of 3 along X
    var spacing = (WRESTLE_W - 3 * MAT) / 4;
    for (var i = 0; i < 3; i++) {
      var cx = TURF_W + spacing * (i + 1) + MAT * i + MAT / 2;
      var cz = zoneZCenter;
      // mat surface
      G.mats.add(bx(MAT, 0.06, MAT, cx, 0.04, cz, M.mat));
      // center circle
      var circle = new THREE.Mesh(
        new THREE.CylinderGeometry(3 * FT, 3 * FT, 0.01, 16),
        M.gold
      );
      circle.position.set(cx, 0.08, cz);
      G.mats.add(circle);
      // outer ring
      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(5.5 * FT, 0.08, 6, 20),
        M.gold
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(cx, 0.08, cz);
      G.mats.add(ring);
    }
  }

  function buildTurfStrip(G, M) {
    // Turf: X = 0 to TURF_W, Z = ENT_DEPTH to BL
    var cx = TURF_W / 2;
    var cz = ENT_DEPTH + TURF_LEN / 2;
    G.turf.add(bx(TURF_W - 2 * FT, 0.03, TURF_LEN - 2 * FT, cx, 0.015, cz, M.turf));

    // yard lines every 5 yards (15 feet)
    var yardLen = 15 * FT;
    for (var y = 0; y <= 15; y++) {
      var lz = ENT_DEPTH + 2 * FT + y * yardLen;
      if (lz > BL - 2 * FT) break;
      G.turf.add(bx(TURF_W - 6 * FT, 0.005, 0.06, cx, 0.035, lz, M.white));
    }
  }

  function buildSCZone(G, M) {
    // S&C: X = TURF_W to BW, Z = SC_Z to BL
    var cx = TURF_W + SC_W / 2;
    var cz = SC_Z + SC_D / 2;
    // rubber floor
    G.sc.add(bx(SC_W - 4 * FT, 0.03, SC_D - 4 * FT, cx, 0.015, cz, M.rubber));

    // power racks (2 rows of 5)
    for (var r = 0; r < 2; r++) {
      for (var i = 0; i < 5; i++) {
        var rx = TURF_W + 12 * FT + i * 22 * FT;
        var rz = SC_Z + 10 * FT + r * 30 * FT;
        // uprights
        G.sc.add(bx(0.12, 2.4, 0.12, rx - 0.6, 1.2, rz, M.steel));
        G.sc.add(bx(0.12, 2.4, 0.12, rx + 0.6, 1.2, rz, M.steel));
        // crossbar
        G.sc.add(bx(1.3, 0.08, 0.08, rx, 2.35, rz, M.steel));
        // platform
        G.sc.add(bx(2.2, 0.12, 1.6, rx, 0.06, rz, M.rubber));
      }
    }
    // cable machine row along back wall
    for (var j = 0; j < 6; j++) {
      var mx = TURF_W + 15 * FT + j * 18 * FT;
      var mz = SC_Z + SC_D - 6 * FT;
      G.sc.add(bx(0.8, 2, 0.6, mx, 1, mz, M.equip));
      G.sc.add(bx(0.04, 1.8, 0.04, mx - 0.3, 1.1, mz, M.steel));
      G.sc.add(bx(0.04, 1.8, 0.04, mx + 0.3, 1.1, mz, M.steel));
    }
  }

  function buildGlassPartitions(G, M) {
    // glass wall between turf and wrestling/S&C (X = TURF_W, Z = ENT_DEPTH to BL)
    var partH = 10 * FT;
    var partGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(BL - ENT_DEPTH - 2 * FT, partH),
      M.partition
    );
    partGlass.rotation.y = Math.PI / 2;
    partGlass.position.set(TURF_W, partH / 2 + 1 * FT, ENT_DEPTH + (BL - ENT_DEPTH) / 2);
    G.partitions.add(partGlass);

    // glass wall between wrestling and S&C (Z = SC_Z, X = TURF_W to BW)
    var divGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(WRESTLE_W - 4 * FT, partH),
      M.partition
    );
    divGlass.position.set(TURF_W + WRESTLE_W / 2, partH / 2 + 1 * FT, SC_Z);
    G.partitions.add(divGlass);

    // steel mullions on turf partition
    for (var i = 0; i < 8; i++) {
      var pz = ENT_DEPTH + 4 * FT + i * 25 * FT;
      if (pz > BL - 4 * FT) break;
      G.partitions.add(bx(0.06, partH, 0.06, TURF_W, partH / 2 + 1 * FT, pz, M.steel));
    }
  }

  function buildGarageDoors(G, M) {
    // Glass garage doors along WEST wall (X = 0)
    var doorCount = 8;
    var doorH = 14 * FT;
    var zoneStart = ENT_DEPTH + 5 * FT;
    var zoneLen = BL - ENT_DEPTH - 10 * FT;
    var doorSpacing = zoneLen / doorCount;

    for (var i = 0; i < doorCount; i++) {
      var dz = zoneStart + i * doorSpacing + doorSpacing / 2;
      // glass panel
      var panel = new THREE.Mesh(
        new THREE.PlaneGeometry(doorSpacing - 1 * FT, doorH),
        M.glass
      );
      panel.position.set(0.15, doorH / 2 + 0.5, dz);
      panel.rotation.y = -Math.PI / 2;
      G.garageDoors.add(panel);
      // gold frame top
      G.garageDoors.add(bx(0.06, 0.06, doorSpacing - 1 * FT, 0.1, doorH + 0.5, dz, M.door));
      // gold frame sides
      G.garageDoors.add(bx(0.06, doorH, 0.06, 0.1, doorH / 2 + 0.5, dz - doorSpacing / 2 + 0.5 * FT, M.door));
    }
  }

  // ── PLEX FLEX BEAMS ────────────────────────────────────────

  function createPlexFlex(scene, G, M) {
    var beams = [];

    for (var row = 0; row < PF_ROWS; row++) {
      var y = row * BEAM_H + BEAM_H / 2 + 0.5;
      for (var sec = 0; sec < PF_SECTIONS; sec++) {
        var z = sec * PF_SEC_LEN + PF_SEC_LEN / 2;
        var beam = new THREE.Mesh(
          new THREE.BoxGeometry(BEAM_L, BEAM_H * 0.9, PF_SEC_LEN - 0.3),
          M.concrete
        );
        beam.position.set(WALL_X, y, z);
        beam.visible = false;

        var seat = new THREE.Mesh(
          new THREE.BoxGeometry(BEAM_L, 0.06, PF_SEC_LEN - 0.3),
          M.concSeat
        );
        seat.position.set(WALL_X, y + BEAM_H * 0.45, z);
        seat.visible = false;

        scene.add(beam);
        scene.add(seat);
        beams.push({
          mesh: beam,
          seat: seat,
          row: row,
          sec: sec,
          targetX: WALL_X,
          currentX: WALL_X
        });
      }
    }

    // Track rails along east wall
    for (var r = 0; r < PF_ROWS; r++) {
      var ty = r * BEAM_H + 0.5;
      G.tracks.add(bx(BEAM_L * 1.8, 0.06, 0.06, WALL_X + BEAM_L * 0.4, ty, BL / 2, M.track));
    }
    // Support columns outside east wall
    for (var c = 0; c <= 4; c++) {
      var cz = c * BL / 4;
      G.tracks.add(bx(0.35, PF_ROWS * BEAM_H + 3, 0.35, WALL_X + BEAM_L + 3 * FT, (PF_ROWS * BEAM_H) / 2, cz, M.steel));
    }

    return beams;
  }

  // PLEX FLEX: outward-only deploy
  function setBeamTargets(beams, mode) {
    beams.forEach(function (b) {
      var stagger = b.row * 0.2 * FT; // each higher row steps further out
      if (mode === 'deployed') {
        b.targetX = WALL_X + BEAM_L / 2 + stagger;
      } else { // 'stowed'
        b.targetX = WALL_X; // flush in wall
      }
    });
  }

  // ── CAMERA VIEWS ───────────────────────────────────────────
  // All positions maintain 5'+ (1.5m+) clearance from geometry

  function getViews() {
    return [
      {
        p: [BW / 2 + 25, 18, -22],
        t: [BW / 2, 4, BL * 0.3],
        n: 'Exterior Overview',
        d: '200\' \u00d7 250\' Athletic Complex'
      },
      {
        p: [BW / 2, 5, -12],
        t: [BW / 2, 6, 8],
        n: 'Grand Entrance',
        d: 'Lobby \u00b7 Tickets \u00b7 Concessions \u00b7 Lockers'
      },
      {
        p: [TURF_W + 8, 6, WRESTLE_Z + 8],
        t: [TURF_W + WRESTLE_W / 2, 0.5, WRESTLE_Z + WRESTLE_D / 2],
        n: 'Wrestling Arena',
        d: '3\u00d7 NCAA 42\'\u00d742\' Competition Mats'
      },
      {
        p: [TURF_W / 2, 2.5, ENT_DEPTH + 4],
        t: [TURF_W / 2, 0.5, ENT_DEPTH + TURF_LEN * 0.6],
        n: '75-Yard Indoor Turf',
        d: 'Sprint \u00b7 Agility \u00b7 Multi-Sport \u00b7 Glass Garage Doors'
      },
      {
        p: [TURF_W + 10, 4, SC_Z + 8],
        t: [TURF_W + SC_W / 2, 1.5, SC_Z + SC_D * 0.5],
        n: 'Strength & Conditioning',
        d: 'Power Racks \u00b7 Platforms \u00b7 Cable Machines'
      },
      {
        p: [BW - 12, 6, BL * 0.45],
        t: [BW + 4, 4, BL * 0.45],
        n: 'PLEX FLEX\u2122 \u2014 Inside View',
        d: '16 Rows \u00b7 2,500 Seats \u00b7 Deploy Outward'
      },
      {
        p: [BW + BEAM_L + 8, 10, BL * 0.4],
        t: [BW, 5, BL * 0.4],
        n: 'PLEX FLEX\u2122 \u2014 Outside View',
        d: 'Outdoor Stadium \u00b7 2,500 Seats Deployed'
      },
      {
        p: [4, 3.5, BL * 0.45],
        t: [0, 4, BL * 0.45],
        n: 'Glass Garage Doors',
        d: 'West Wall \u00b7 Opens to Outdoor Training Field'
      },
      {
        p: [BW / 2, 50, BL * 0.45],
        t: [BW / 2, 0, BL * 0.45],
        n: 'Aerial Overview',
        d: '50,000 SF \u00b7 Loudon / DeSarro Athletic Complex'
      }
    ];
  }

  // ── LIGHTS ─────────────────────────────────────────────────

  function setupLights(scene) {
    scene.add(new THREE.AmbientLight(0x506080, 0.4));
    scene.add(new THREE.HemisphereLight(0x8ecae6, 0x2a1f0a, 0.5));
    var sun = new THREE.DirectionalLight(0xfff0d0, 1.5);
    sun.position.set(60, 80, 40);
    scene.add(sun);
    // interior point lights
    var pts = [
      { x: TURF_W / 2, y: 10, z: BL * 0.3 },
      { x: TURF_W + WRESTLE_W / 2, y: 10, z: WRESTLE_Z + WRESTLE_D / 2 },
      { x: TURF_W + SC_W / 2, y: 8, z: SC_Z + SC_D / 2 },
      { x: BW / 2, y: 8, z: ENT_DEPTH / 2 }
    ];
    pts.forEach(function (l) {
      var pl = new THREE.PointLight(0xffeedd, 0.8, 50);
      pl.position.set(l.x, l.y, l.z);
      scene.add(pl);
    });
  }

  // ── ANIMATION ENGINE ───────────────────────────────────────

  function AnimEngine() {
    this.queue = [];
    this.active = false;
    this.stepIdx = 0;
    this.stepStart = 0;
    this.currentStep = null;
  }

  AnimEngine.prototype.start = function (steps) {
    this.queue = steps;
    this.active = true;
    this.stepIdx = 0;
    this.runNext();
  };

  AnimEngine.prototype.runNext = function () {
    if (this.stepIdx >= this.queue.length) {
      this.active = false;
      if (this.onComplete) this.onComplete();
      return;
    }
    this.currentStep = this.queue[this.stepIdx];
    this.stepStart = performance.now();
    if (this.currentStep.setup) this.currentStep.setup();
    this.stepIdx++;
  };

  AnimEngine.prototype.update = function (now) {
    if (!this.active || !this.currentStep) return 0;
    var elapsed = (now - this.stepStart) / 1000;
    var dur = this.currentStep.duration || 3;
    var t = Math.min(elapsed / dur, 1);
    if (this.currentStep.update) this.currentStep.update(t);

    // overall progress
    var totalDur = 0;
    for (var i = 0; i < this.queue.length; i++) totalDur += (this.queue[i].duration || 3);
    var elapsedTotal = 0;
    for (var j = 0; j < this.stepIdx - 1; j++) elapsedTotal += (this.queue[j].duration || 3);
    elapsedTotal += elapsed;
    var progress = Math.min(elapsedTotal / totalDur, 1);

    if (t >= 1) {
      if (this.currentStep.complete) this.currentStep.complete();
      this.runNext();
    }
    return progress;
  };

  // ── BUILD SEQUENCE (13 PHASES) ─────────────────────────────

  function createBuildSequence(G, M, beams, cam, tp, tl, cl, setPhase) {
    return [
      // 1. Site prep
      {
        duration: 3, setup: function () {
          setPhase('Phase 1', 'Site Preparation');
          G.ground.visible = true;
          tp.set(BW / 2 + 25, 22, -15);
          tl.set(BW / 2, 0, BL * 0.35);
        }, update: function () {
          cam.position.lerp(tp, 0.04); cl.lerp(tl, 0.04); cam.lookAt(cl);
        }
      },
      // 2. Foundation
      {
        duration: 3.5, setup: function () {
          setPhase('Phase 2', 'Foundation \u00b7 50,000 SF Concrete Slab');
          tp.set(BW + 10, 14, -10);
          tl.set(BW / 2, 0, BL * 0.3);
        }, update: function (t) {
          if (!G.foundation.visible && t > 0.1) G.foundation.visible = true;
          G.foundation.scale.y = Math.min(t * 2, 1);
          cam.position.lerp(tp, 0.03); cl.lerp(tl, 0.03); cam.lookAt(cl);
        }
      },
      // 3. Steel frame
      {
        duration: 4, setup: function () {
          setPhase('Phase 3', 'Structural Steel Rising');
          tp.set(BW + 15, 18, -8);
          tl.set(BW / 2, 8, BL * 0.3);
        }, update: function (t) {
          if (!G.steel.visible && t > 0.05) G.steel.visible = true;
          G.steel.scale.y = Math.min(t * 1.5, 1);
          cam.position.lerp(tp, 0.025); cl.lerp(tl, 0.025); cam.lookAt(cl);
        }, complete: function () { G.steel.scale.y = 1; }
      },
      // 4. Shell
      {
        duration: 4, setup: function () {
          setPhase('Phase 4', 'Building Shell \u00b7 Envelope');
          tp.set(-15, 14, BL * 0.3);
          tl.set(BW / 2, 8, BL * 0.4);
        }, update: function (t) {
          if (!G.shell.visible && t > 0.1) G.shell.visible = true;
          cam.position.lerp(tp, 0.02); cl.lerp(tl, 0.02); cam.lookAt(cl);
        }
      },
      // 5. Entrance + signage
      {
        duration: 3, setup: function () {
          setPhase('Phase 5', 'Grand Entrance \u00b7 Signage');
          G.entrance.visible = true;
          G.signage.visible = true;
          tp.set(BW / 2, 8, -14);
          tl.set(BW / 2, 5, 4);
        }, update: function () {
          cam.position.lerp(tp, 0.04); cl.lerp(tl, 0.04); cam.lookAt(cl);
        }
      },
      // 6. Glass garage doors (west)
      {
        duration: 3, setup: function () {
          setPhase('Phase 6', 'Glass Garage Doors \u00b7 West Wall');
          G.garageDoors.visible = true;
          tp.set(-12, 6, BL * 0.4);
          tl.set(3, 5, BL * 0.4);
        }, update: function () {
          cam.position.lerp(tp, 0.035); cl.lerp(tl, 0.035); cam.lookAt(cl);
        }
      },
      // 7. Glass partitions
      {
        duration: 2.5, setup: function () {
          setPhase('Phase 7', 'Interior Glass Partitions');
          G.partitions.visible = true;
          tp.set(TURF_W + 6, 5, WRESTLE_Z + WRESTLE_D / 2);
          tl.set(TURF_W, 3, WRESTLE_Z + WRESTLE_D / 2);
        }, update: function () {
          cam.position.lerp(tp, 0.04); cl.lerp(tl, 0.04); cam.lookAt(cl);
        }
      },
      // 8. Wrestling mats
      {
        duration: 3, setup: function () {
          setPhase('Phase 8', 'NCAA Wrestling Mats \u00b7 Competition Ready');
          G.mats.visible = true;
          tp.set(TURF_W + 8, 6, WRESTLE_Z + 6);
          tl.set(TURF_W + WRESTLE_W / 2, 0.5, WRESTLE_Z + WRESTLE_D / 2);
        }, update: function () {
          cam.position.lerp(tp, 0.04); cl.lerp(tl, 0.04); cam.lookAt(cl);
        }
      },
      // 9. Turf strip
      {
        duration: 3, setup: function () {
          setPhase('Phase 9', '75-Yard Indoor Turf \u00b7 Multi-Sport');
          G.turf.visible = true;
          tp.set(TURF_W / 2, 3.5, ENT_DEPTH + 6);
          tl.set(TURF_W / 2, 0, ENT_DEPTH + TURF_LEN * 0.4);
        }, update: function () {
          cam.position.lerp(tp, 0.04); cl.lerp(tl, 0.04); cam.lookAt(cl);
        }
      },
      // 10. S&C equipment
      {
        duration: 3, setup: function () {
          setPhase('Phase 10', 'Strength & Conditioning \u00b7 Elite Equipment');
          G.sc.visible = true;
          tp.set(TURF_W + 10, 5, SC_Z + 6);
          tl.set(TURF_W + SC_W / 2, 1.5, SC_Z + SC_D * 0.4);
        }, update: function () {
          cam.position.lerp(tp, 0.04); cl.lerp(tl, 0.04); cam.lookAt(cl);
        }
      },
      // 11. PLEX FLEX tracks
      {
        duration: 3, setup: function () {
          setPhase('Phase 11', 'PLEX FLEX\u2122 \u00b7 Track System');
          G.tracks.visible = true;
          tp.set(BW + 12, 12, BL * 0.5);
          tl.set(BW, PF_ROWS * BEAM_H * 0.4, BL * 0.5);
        }, update: function () {
          cam.position.lerp(tp, 0.035); cl.lerp(tl, 0.035); cam.lookAt(cl);
        }
      },
      // 12. PLEX FLEX beam deployment (the money shot)
      {
        duration: 6, setup: function () {
          setPhase('PLEX FLEX\u2122', 'Deploying 2,500 Seats Outward \u2192');
          setBeamTargets(beams, 'deployed');
          beams.forEach(function (b) {
            b.mesh.visible = true; b.seat.visible = true;
            b.mesh.position.x = WALL_X;
            b.seat.position.x = WALL_X;
            b.currentX = WALL_X;
          });
          tp.set(BW + 15, 10, BL * 0.4);
          tl.set(BW + 4, 5, BL * 0.4);
        }, update: function (t) {
          beams.forEach(function (b) {
            var rowDelay = b.row * 0.03;
            var rt = Math.max(0, Math.min((t - rowDelay) / (1 - rowDelay * PF_ROWS / (PF_ROWS + 1)), 1));
            var eased = 1 - Math.pow(1 - rt, 2.5);
            var x = b.currentX + (b.targetX - b.currentX) * eased;
            b.mesh.position.x = x; b.seat.position.x = x;
          });
          cam.position.lerp(tp, 0.02); cl.lerp(tl, 0.02); cam.lookAt(cl);
        }, complete: function () {
          beams.forEach(function (b) {
            b.mesh.position.x = b.targetX;
            b.seat.position.x = b.targetX;
            b.currentX = b.targetX;
          });
        }
      },
      // 13. Final flyaround
      {
        duration: 5, setup: function () {
          setPhase('Complete', 'Loudon / DeSarro Athletic Complex \u00b7 50,000 SF');
          tp.set(BW / 2 + 28, 22, -18);
          tl.set(BW / 2, 4, BL * 0.3);
        }, update: function () {
          cam.position.lerp(tp, 0.025); cl.lerp(tl, 0.025); cam.lookAt(cl);
        }
      }
    ];
  }

  // ── MAIN INIT ──────────────────────────────────────────────

  function init(container, shellBuilder) {
    // Renderer
    var R = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    R.setSize(innerWidth, innerHeight);
    R.setPixelRatio(1);
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.05;
    container.appendChild(R.domElement);

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e14);
    var cam = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.5, 500);

    setupLights(scene);
    var M = createMaterials();
    var G = createGroups(scene);

    // Build all zones
    buildGround(G, M);
    buildFoundation(G, M);
    buildEntrance(G, M);
    buildSignage(G, M);
    buildWrestlingArena(G, M);
    buildTurfStrip(G, M);
    buildSCZone(G, M);
    buildGlassPartitions(G, M);
    buildGarageDoors(G, M);

    // Shell (provided by each HTML)
    if (shellBuilder) {
      var shellGroup = shellBuilder(scene, M, {
        FT: FT, BW: BW, BL: BL, ENT_DEPTH: ENT_DEPTH,
        TURF_W: TURF_W, WRESTLE_W: WRESTLE_W, WRESTLE_D: WRESTLE_D,
        SC_Z: SC_Z, SC_W: SC_W, SC_D: SC_D, WALL_X: WALL_X
      }, G);
      if (shellGroup) {
        G.shell.add(shellGroup);
      }
    }

    // Steel frame (will be populated by shell builder or here as fallback)

    // PLEX FLEX beams
    var beams = createPlexFlex(scene, G, M);

    // Camera state
    var tp = new THREE.Vector3(BW / 2 + 25, 18, -22);
    var tl = new THREE.Vector3(BW / 2, 4, BL * 0.3);
    var cl = tl.clone();
    var orbT = 0, orbP = 0, mouseDown = false, lastMouse = { x: 0, y: 0 };

    var VIEWS = getViews();
    var currentView = 0;

    // HUD elements
    var hudEl = document.getElementById('hud');
    var phaseEl = document.getElementById('phase');
    var pnEl = document.getElementById('PN');
    var pdEl = document.getElementById('PD');
    var pfillEl = document.getElementById('pfill');
    var vnEl = document.getElementById('VN');
    var vdEl = document.getElementById('VD');
    var navBar = document.getElementById('navBar');
    var cTop = document.getElementById('cTop');
    var cBot = document.getElementById('cBot');
    var stillEl = document.getElementById('still');
    var heroEl = document.getElementById('hero');

    function setPhase(name, desc) {
      if (pnEl) pnEl.textContent = name;
      if (pdEl) pdEl.textContent = desc;
    }

    function setView(i) {
      var v = VIEWS[i];
      currentView = i;
      tp.set(v.p[0], v.p[1], v.p[2]);
      tl.set(v.t[0], v.t[1], v.t[2]);
      if (vnEl) vnEl.textContent = v.n;
      if (vdEl) vdEl.textContent = v.d;
      var btns = document.querySelectorAll('.nb');
      btns.forEach(function (b, j) { b.classList.toggle('on', j === i); });
    }

    // Animation engine
    var anim = new AnimEngine();

    // FLEX animation
    var flexAnimating = false;

    function animateFlex(mode) {
      if (flexAnimating) return;
      flexAnimating = true;
      beams.forEach(function (b) { b.currentX = b.mesh.position.x; });
      setBeamTargets(beams, mode);

      if (mode === 'deployed') {
        tp.set(BW + BEAM_L + 8, 10, BL * 0.4);
        tl.set(BW + 4, 5, BL * 0.4);
      } else {
        tp.set(BW - 12, 6, BL * 0.45);
        tl.set(BW + 2, 4, BL * 0.45);
      }

      setPhase('PLEX FLEX\u2122', mode === 'deployed' ? 'Deploying Outward \u2192 2,500 Seats' : 'Stowing Beams \u2192 Flush in Wall');
      if (phaseEl) phaseEl.style.opacity = '1';

      var start = performance.now();
      var dur = 4000;

      function step() {
        var t = Math.min((performance.now() - start) / dur, 1);
        beams.forEach(function (b) {
          var rowDelay = b.row * 0.025;
          var rt = Math.max(0, Math.min((t - rowDelay) / (1 - rowDelay), 1));
          var eased = 1 - Math.pow(1 - rt, 2.8);
          var x = b.currentX + (b.targetX - b.currentX) * eased;
          b.mesh.position.x = x; b.seat.position.x = x;
        });
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          beams.forEach(function (b) {
            b.mesh.position.x = b.targetX;
            b.seat.position.x = b.targetX;
            b.currentX = b.targetX;
          });
          flexAnimating = false;
          setTimeout(function () { if (phaseEl) phaseEl.style.opacity = '0'; }, 2000);
        }
      }
      step();
    }

    // Still photo mode
    var stillMode = false;
    function toggleStill() {
      stillMode = !stillMode;
      if (stillEl) stillEl.classList.toggle('on', stillMode);
      if (cTop) cTop.classList.toggle('on', stillMode);
      if (cBot) cBot.classList.toggle('on', stillMode);
    }

    // Auto tour
    var tourTimer = null;
    function autoTour() {
      var i = 0;
      function nx() { setView(i % VIEWS.length); i++; tourTimer = setTimeout(nx, 5000); }
      nx();
    }
    function stopTour() { if (tourTimer) clearTimeout(tourTimer); tourTimer = null; }

    // Build explore nav
    function showExploreNav() {
      if (cTop) cTop.classList.remove('on');
      if (cBot) cBot.classList.remove('on');
      if (phaseEl) phaseEl.style.opacity = '0';
      if (!navBar) return;
      navBar.innerHTML = '';
      var btns = [];
      VIEWS.forEach(function (v, i) {
        btns.push({ label: v.n.replace('PLEX FLEX\u2122 \u2014 ', ''), idx: i });
      });
      btns.push({ label: '\u21bb Deploy Beams', action: 'deployed', gold: true });
      btns.push({ label: '\u21bb Stow Beams', action: 'stowed', gold: true });
      btns.push({ label: '\ud83d\udcf7 Still Mode', action: 'still' });
      btns.push({ label: '\u25b6 Auto Tour', action: 'tour' });

      btns.forEach(function (b) {
        var btn = document.createElement('button');
        btn.className = 'nb' + (b.gold ? ' gold' : '');
        btn.textContent = b.label;
        btn.onclick = function () {
          if (b.idx !== undefined) { stopTour(); setView(b.idx); }
          else if (b.action === 'still') toggleStill();
          else if (b.action === 'tour') autoTour();
          else if (b.action) animateFlex(b.action);
        };
        navBar.appendChild(btn);
      });
    }

    anim.onComplete = showExploreNav;

    // ── PUBLIC API ───────────────────────────────────────────

    function startBuild() {
      if (heroEl) heroEl.classList.add('off');
      if (hudEl) hudEl.classList.add('on');
      if (cTop) cTop.classList.add('on');
      if (cBot) cBot.classList.add('on');
      beams.forEach(function (b) { b.mesh.visible = false; b.seat.visible = false; });
      var steps = createBuildSequence(G, M, beams, cam, tp, tl, cl, setPhase);
      anim.start(steps);
    }

    function enterExplore() {
      if (heroEl) heroEl.classList.add('off');
      if (hudEl) hudEl.classList.add('on');
      // Show all groups
      Object.keys(G).forEach(function (k) { G[k].visible = true; });
      // Show beams deployed
      beams.forEach(function (b) { b.mesh.visible = true; b.seat.visible = true; });
      setBeamTargets(beams, 'deployed');
      beams.forEach(function (b) {
        b.mesh.position.x = b.targetX;
        b.seat.position.x = b.targetX;
        b.currentX = b.targetX;
      });
      showExploreNav();
      setView(0);
    }

    // Expose to window
    window.startBuild = startBuild;
    window.enterExplore = enterExplore;

    // ── CONTROLS ─────────────────────────────────────────────

    R.domElement.addEventListener('mousedown', function (e) {
      mouseDown = true; lastMouse = { x: e.clientX, y: e.clientY }; stopTour();
    });
    R.domElement.addEventListener('mousemove', function (e) {
      if (!mouseDown) return;
      orbT += (e.clientX - lastMouse.x) * 0.003;
      orbP = Math.max(-0.5, Math.min(0.5, orbP + (e.clientY - lastMouse.y) * 0.003));
      lastMouse = { x: e.clientX, y: e.clientY };
    });
    R.domElement.addEventListener('mouseup', function () { mouseDown = false; });
    R.domElement.addEventListener('touchstart', function (e) {
      mouseDown = true; lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    R.domElement.addEventListener('touchmove', function (e) {
      if (!mouseDown) return;
      orbT += (e.touches[0].clientX - lastMouse.x) * 0.005;
      orbP = Math.max(-0.5, Math.min(0.5, orbP + (e.touches[0].clientY - lastMouse.y) * 0.005));
      lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    R.domElement.addEventListener('touchend', function () { mouseDown = false; });
    R.domElement.addEventListener('wheel', function (e) {
      var d = cam.position.clone().sub(cl).normalize();
      tp.add(d.multiplyScalar(e.deltaY * 0.018));
    });

    // ── RENDER LOOP (30fps cap) ──────────────────────────────

    var lastFrame = 0;
    function render(now) {
      requestAnimationFrame(render);
      if (now - lastFrame < 32) return;
      lastFrame = now;

      var progress = anim.update(now);
      if (pfillEl && anim.active) {
        pfillEl.style.width = (progress * 100) + '%';
      }

      var sp = 0.05;
      var fp = tp.clone();
      if (orbT || orbP) {
        var off = cam.position.clone().sub(cl);
        var r = off.length();
        var th = Math.atan2(off.x, off.z) + orbT;
        var ph = Math.max(0.1, Math.min(1.4, Math.acos(off.y / r) + orbP));
        fp.set(
          cl.x + r * Math.sin(ph) * Math.sin(th),
          cl.y + r * Math.cos(ph),
          cl.z + r * Math.sin(ph) * Math.cos(th)
        );
      }
      cam.position.lerp(fp, sp);
      cl.lerp(tl, sp);
      cam.lookAt(cl);
      orbT *= 0.92;
      orbP *= 0.92;
      R.render(scene, cam);
    }
    render(0);

    addEventListener('resize', function () {
      cam.aspect = innerWidth / innerHeight;
      cam.updateProjectionMatrix();
      R.setSize(innerWidth, innerHeight);
    });

    return {
      scene: scene,
      camera: cam,
      renderer: R,
      groups: G,
      materials: M,
      beams: beams,
      startBuild: startBuild,
      enterExplore: enterExplore,
      setView: setView,
      animateFlex: animateFlex
    };
  }

  // ── EXPORT ─────────────────────────────────────────────────
  window.FacilityCore = { init: init };

})();
