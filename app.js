// ── Constants ────────────────────────────────────────────────────────────────

const DXDATA_URL =
  "https://cdn.jsdelivr.net/gh/gekichumai/dxrating@main/packages/dxdata/dxdata.json";
const JACKET_CDN = "https://shama.dxrating.net/images/cover/v2";
const SEGA_URL = "https://maimai.sega.jp/data/maimai_songs.json";

// Rating table (myjian/mai-tools)
// [minAchv, factor, maxAchv|null, maxFactor|null]
const RANK_TABLE = [
  [100.5, 0.224, null, null],
  [100.0, 0.216, 100.4999, 0.222],
  [99.5, 0.211, 99.9999, 0.214],
  [99.0, 0.208, null, null],
  [98.0, 0.203, 98.9999, 0.206],
  [97.0, 0.2, null, null],
  [94.0, 0.168, 96.9999, 0.176],
  [90.0, 0.152, null, null],
  [80.0, 0.136, null, null],
  [75.0, 0.12, 79.9999, 0.128],
  [70.0, 0.112, null, null],
  [60.0, 0.096, null, null],
  [50.0, 0.08, null, null],
  [0.0, 0.016, null, null],
];

const RANK_LABELS = [
  [100.5, "SSS+"],
  [100.0, "SSS"],
  [99.5, "SS+"],
  [99.0, "SS"],
  [98.0, "S+"],
  [97.0, "S"],
  [94.0, "AAA"],
  [90.0, "AA"],
  [80.0, "A"],
  [75.0, "BBB"],
  [70.0, "BB"],
  [60.0, "B"],
  [50.0, "C"],
  [0.0, "D"],
];

const CLEAR_LABELS = { 0: "", 1: "", 2: "", 3: "FC", 4: "FC+", 5: "AP", 6: "AP+" };
const AP_CLEAR_TYPES = new Set([5, 6]);

const RANK_IMAGES = {
  "D": "assets/d.png", "C": "assets/c.png", "B": "assets/b.png",
  "BB": "assets/bb.png", "BBB": "assets/bbb.png", "A": "assets/a.png",
  "AA": "assets/aa.png", "AAA": "assets/aaa.png", "S": "assets/s.png",
  "S+": "assets/splus.png", "SS": "assets/ss.png", "SS+": "assets/ssplus.png",
  "SSS": "assets/sss.png", "SSS+": "assets/sssplus.png",
};

const CLEAR_IMAGES = {
  "FC": "assets/fc.png", "FC+": "assets/fcplus.png",
  "AP": "assets/ap.png", "AP+": "assets/applus.png",
};

function rankImg(rank, height) {
  const src = RANK_IMAGES[rank];
  if (!src) return rank;
  const h = height || 16;
  return `<img class="icon-rank" src="${src}" height="${h}" alt="${rank}" title="${rank}">`;
}

function clearImg(clear, height) {
  const src = CLEAR_IMAGES[clear];
  if (!src) return clear;
  const h = height || 16;
  return `<img class="icon-clear" src="${src}" height="${h}" alt="${clear}" title="${clear}">`;
}

const DXSTAR_IMAGES = {
  1: "assets/music_icon_dxstar_1.png",
  2: "assets/music_icon_dxstar_2.png",
  3: "assets/music_icon_dxstar_3.png",
  4: "assets/music_icon_dxstar_4.png",
  5: "assets/music_icon_dxstar_5.png",
};

function dxStarImg(stars, height) {
  const src = DXSTAR_IMAGES[stars];
  if (!src) return "";
  const h = height || 16;
  return `<img class="icon-dxstar" src="${src}" height="${h}" alt="${stars} stars" title="${stars} DX stars">`;
}

const RATING_PLATE_IMAGES = {
  normal:   "assets/rating_base_normal.png",
  blue:     "assets/rating_base_blue.png",
  green:    "assets/rating_base_green.png",
  orange:   "assets/rating_base_orange.png",
  red:      "assets/rating_base_red.png",
  purple:   "assets/rating_base_purple.png",
  bronze:   "assets/rating_base_bronze.png",
  silver:   "assets/rating_base_silver.png",
  gold:     "assets/rating_base_gold.png",
  platinum: "assets/rating_base_platinum.png",
  rainbow:  "assets/rating_base_rainbow.png",
};
const RATING_PLATE_ASPECT = 296 / 86;

function getRatingTier(rating) {
  if (rating >= 15000) return "rainbow";
  if (rating >= 14500) return "platinum";
  if (rating >= 14000) return "gold";
  if (rating >= 13000) return "silver";
  if (rating >= 12000) return "bronze";
  if (rating >= 10000) return "purple";
  if (rating >= 7000)  return "red";
  if (rating >= 4000)  return "orange";
  if (rating >= 2000)  return "green";
  if (rating >= 1000)  return "blue";
  return "normal";
}

// Tier for partial pools (OLD/NEW): use the sum value for correct tier color.
function getPoolTier(sum, count) {
  if (!count) return "normal";
  return getRatingTier(sum);
}

function ratingPlateHtml(value, tier, height, srcOverride) {
  const src = srcOverride || RATING_PLATE_IMAGES[tier] || RATING_PLATE_IMAGES.normal;
  const w = (height * RATING_PLATE_ASPECT).toFixed(1);
  // font-size = height makes 1em == plate height, so child em values scale.
  return `<span class="rating-plate" style="height:${height}px;width:${w}px;font-size:${height}px;">`
    + `<img class="rating-plate-bg" src="${src}" alt="">`
    + `<span class="rating-plate-value">${value}</span>`
    + `</span>`;
}

const RATING_IF_RANKS = [
  { key: "rating_s", rank: "S", minAchv: 97.0 },
  { key: "rating_sp", rank: "S+", minAchv: 98.0 },
  { key: "rating_ss", rank: "SS", minAchv: 99.0 },
  { key: "rating_ssp", rank: "SS+", minAchv: 99.5 },
  { key: "rating_sss", rank: "SSS", minAchv: 100.0 },
  { key: "rating_sssp", rank: "SSS+", minAchv: 100.5 },
];

const ALIAS_TO_DIFF = {
  Basic: "basic",
  Advanced: "advanced",
  Expert: "expert",
  Master: "master",
  "Re:Master": "remaster",
};

// Version name map (v100–v260, source: zetaraku/arcade-songs-fetch)
const VERSION_NAMES = {
  100: "maimai", 110: "maimai PLUS", 120: "GreeN", 130: "GreeN PLUS",
  140: "ORANGE", 150: "ORANGE PLUS", 160: "PiNK", 170: "PiNK PLUS",
  180: "MURASAKi", 185: "MURASAKi PLUS", 190: "MiLK", 195: "MiLK PLUS",
  199: "FiNALE", 200: "maimaiDX", 205: "maimaiDX+", 210: "Splash",
  215: "Splash+", 220: "UNiVERSE", 225: "UNiVERSE+", 230: "FESTiVAL",
  235: "FESTiVAL+", 240: "BUDDiES", 245: "BUDDiES+", 250: "PRiSM",
  255: "PRiSM+", 260: "CiRCLE", 265: "CiRCLE+",
};

function versionName(v) {
  let name = "";
  if (typeof v === "string") {
    // dxdata.json may provide version as a string directly
    const num = parseInt(v, 10);
    if (!isNaN(num) && VERSION_NAMES[num]) name = VERSION_NAMES[num];
    else name = v;
  } else {
    name = VERSION_NAMES[v] || (v ? `v${v}` : "");
  }
  return standardizeVersion(name);
}

const DIFF_CLASS = {
  Basic: "diff-basic",
  Advanced: "diff-advanced",
  Expert: "diff-expert",
  Master: "diff-master",
  "Re:Master": "diff-remaster",
};

// ── State ────────────────────────────────────────────────────────────────────

let chartConstants = {};
let songCategories = {};
let songVersions = {};
let songImages = {}; // normalizedTitle → imageName (for jacket images)
let firstRender = true;
let allSongsList = [];
let recentChecked = JSON.parse(localStorage.getItem("recentChecked") || "[]");
let recentPlayed = JSON.parse(localStorage.getItem("recentPlayed") || "[]");

// Song name aliases: cache title (normalized, lowercase) → dxdata title (normalized, lowercase)
const songAliases = {
  "sunday night feat kanata.n": "sunday night feat. kanata.n",
  "sunday night feat. kanata.n": "sunday night feat kanata.n",
  "bad apple!! feat nomico": "bad apple!! feat.nomico",
  "コンティニュー!feat. 藍月なくる": "コンティニュー! feat. 藍月なくる",
  "フェイスフェイク・フェイルセイフ": "フェイクフェイス・フェイルセイフ",
};
// Manual chart data for songs missing from server. Fallback only.
// Key: "title (lowercase)|type|difficulty" → { ilv, version, category, image? }
// `image` (relative asset path) attaches to the song; only needs to be set on
// one difficulty per song — derived per-title via `localSongMeta` below.
const chartOverrides = {
  "break the speakers|dx|basic":    { ilv: 5.0,  version: "CiRCLE PLUS", category: "maimai" },
  "break the speakers|dx|advanced": { ilv: 8.7,  version: "CiRCLE PLUS", category: "maimai" },
  "break the speakers|dx|expert":   { ilv: 12.7, version: "CiRCLE PLUS", category: "maimai" },
  "break the speakers|dx|master":   { ilv: 14.7, version: "CiRCLE PLUS", category: "maimai", image: "assets/fillers/BreakTheSpeakers.png" },
};

// Per-title fallback metadata derived from chartOverrides.
// Keyed by lowercased title → { image, category } (first non-null wins).
const localSongMeta = (() => {
  const out = {};
  for (const [key, v] of Object.entries(chartOverrides)) {
    const title = key.split("|")[0];
    if (!out[title]) out[title] = {};
    if (v.image    && !out[title].image)    out[title].image    = v.image;
    if (v.category && !out[title].category) out[title].category = v.category;
  }
  return out;
})();

let allScores = [];
let filteredScores = [];
let sortCol = "rating";
let sortAsc = false;
let activeTab = "all";

// B50 state
let b50NewVersions = new Set();    // versions the user marked as "new" pool
let b50IgnoreNewer = false;
let b50Combined = false;
let b50Excluded = new Set(); // keys of scores excluded from B50
const B50_DEFAULT_NEW_COUNT = 2;   // # newest versions auto-selected on load / Latest button

// ── Rating functions ─────────────────────────────────────────────────────────

function getFactor(achievement) {
  const achv = Math.min(achievement, 100.5);
  for (const [minA, factor, maxA, maxFactor] of RANK_TABLE) {
    if (achv >= minA) {
      if (maxA !== null && achv >= maxA) return maxFactor;
      return factor;
    }
  }
  return 0.0;
}

function getRating(internalLevel, achievement) {
  const achv = Math.min(achievement, 100.5);
  // maimai DX Rating formula: internalLevel * (achv / 100) * factor * 100 => internalLevel * achv * factor
  return Math.floor(Math.abs(internalLevel) * (achv / 100) * getFactor(achv) * 100);
}

function getRankLabel(achievement) {
  const achv = Math.min(achievement, 100.5);
  for (const [threshold, label] of RANK_LABELS) {
    if (achv >= threshold) return label;
  }
  return "D";
}

function parseLevel(value) {
  const s = String(value || "").trim();
  if (s.endsWith("+")) {
    const n = parseFloat(s.slice(0, -1));
    return isNaN(n) ? 0 : n + 0.7;
  }
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

// ── Level filter helpers ─────────────────────────────────────────────────────
const VISIBLE_LEVELS = [
  "1","2","3","4","5","6",
  "7","7+","8","8+","9","9+",
  "10","10+","11","11+","12","12+",
  "13","13+","14","14+","15"
];

// Constant range [start, end] for a visible label.
// "X"  → [X.0, X.6]; "X+" → [X.7, X.9]; "15" capped at [15.0, 15.0].
function visibleLevelRange(label) {
  if (label === "15") return [15.0, 15.0];
  const isPlus = label.endsWith("+");
  const n = parseInt(isPlus ? label.slice(0, -1) : label, 10);
  if (isPlus) return [+(n + 0.7).toFixed(1), +(n + 0.9).toFixed(1)];
  return [n, +(n + 0.6).toFixed(1)];
}

function constantToVisibleLabel(c) {
  if (c >= 15.0) return "15";
  const floor = Math.floor(c);
  return (c - floor) >= 0.7 ? floor + "+" : String(floor);
}

// Snap min DOWN to the start of the visible level it falls in.
function snapMinDown(c) {
  if (c >= 15.0) return 15.0;
  const floor = Math.floor(c);
  return (c - floor) >= 0.7 ? +(floor + 0.7).toFixed(1) : floor;
}

// Snap max UP to the end of the visible level it falls in.
function snapMaxUp(c) {
  if (c >= 15.0) return 15.0;
  const floor = Math.floor(c);
  return (c - floor) >= 0.7 ? +(floor + 0.9).toFixed(1) : +(floor + 0.6).toFixed(1);
}

// Normalize fullwidth/special chars for matching (cache vs dxdata differences)
function normalizeTitle(s) {
  return s
    .normalize("NFC")      // compose decomposed chars (e.g. タ+゙ → ダ)
    .replace(/～/g, "~")   // fullwidth tilde → regular
    .replace(/＆/g, "&")   // fullwidth ampersand
    .replace(/　/g, " ")   // fullwidth space
    .replace(/？/g, "?")   // fullwidth question mark
    .replace(/！/g, "!")   // fullwidth exclamation
    .replace(/：/g, ":")   // fullwidth colon
    .replace(/＃/g, "#")   // fullwidth hash → regular
    .replace(/[\u2018\u2019]/g, "'") // smart quotes → straight apostrophe
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes → straight
    .trim();
}

// Extract [DX]/[ST] from title and return cleaned title + type hint
function parseTitle(rawTitle) {
  const m = rawTitle.match(/\[(DX|ST|SD)\]\s*/i);
  if (m) {
    return {
      cleanTitle: rawTitle.replace(m[0], "").trim(),
      typeHint: m[1].toUpperCase() === "DX" ? "dx" : "std", // ST and SD both map to std
    };
  }
  return { cleanTitle: rawTitle, typeHint: null };
}

// Lookup helper: try typeHint first, then both types
function _lookupInStore(store, titleLower, alias, typeHint) {
  const diff = ALIAS_TO_DIFF[alias] || alias.toLowerCase();
  if (typeHint) {
    const v = store[`${titleLower}|${typeHint}|${diff}`];
    if (v != null) return { value: v, matchedType: typeHint };
  }
  for (const t of ["dx", "std"]) {
    const v = store[`${titleLower}|${t}|${diff}`];
    if (v != null) return { value: v, matchedType: t };
  }
  return null;
}

// Try raw title first, then with [DX]/[ST]/[SD] stripped, then song alias
function lookupChart(store, rawTitleLower, cleanTitleLower, alias, typeHint) {
  return _lookupInStore(store, rawTitleLower, alias, typeHint)
    ?? _lookupInStore(store, cleanTitleLower, alias, typeHint)
    ?? (songAliases[cleanTitleLower]
      ? _lookupInStore(store, songAliases[cleanTitleLower], alias, typeHint)
      : null);
}

// Lookup override data for a chart (fallback when server data missing)
function lookupOverride(titleLower, alias, typeHint) {
  const diff = ALIAS_TO_DIFF[alias] || alias.toLowerCase();
  if (typeHint) {
    const o = chartOverrides[`${titleLower}|${typeHint}|${diff}`];
    if (o) return { ...o, matchedType: typeHint };
  }
  for (const t of ["dx", "std"]) {
    const o = chartOverrides[`${titleLower}|${t}|${diff}`];
    if (o) return { ...o, matchedType: t };
  }
  return null;
}

// maimai DX version names that indicate DX era (v200+)
const DX_VERSIONS = new Set([
  "maimaiでらっくす", "maimaiでらっくす PLUS",
  "Splash", "Splash PLUS",
  "UNiVERSE", "UNiVERSE PLUS",
  "FESTiVAL", "FESTiVAL PLUS",
  "BUDDiES", "BUDDiES PLUS",
  "PRiSM", "PRiSM PLUS",
  "CiRCLE", "CiRCLE PLUS",
]);

// Ordered list of all maimai versions (oldest → newest) for B50 sorting
const VERSION_ORDER = [
  "maimai", "maimai PLUS", "GreeN", "GreeN PLUS",
  "ORANGE", "ORANGE PLUS", "PiNK", "PiNK PLUS",
  "MURASAKi", "MURASAKi PLUS", "MiLK", "MiLK PLUS", "FiNALE",
  "maimaiでらっくす", "maimaiでらっくす PLUS",
  "Splash", "Splash PLUS",
  "UNiVERSE", "UNiVERSE PLUS",
  "FESTiVAL", "FESTiVAL PLUS",
  "BUDDiES", "BUDDiES PLUS",
  "PRiSM", "PRiSM PLUS",
  "CiRCLE", "CiRCLE PLUS",
];
const VERSION_RANK = {};
VERSION_ORDER.forEach((v, i) => { VERSION_RANK[v] = i; });

function standardizeVersion(v) {
  if (!v) return "";
  let s = String(v).trim();
  if (s === "maimaiDX" || s === "maimai DX") return "maimaiでらっくす";
  if (s === "maimaiDX+" || s === "maimai DX+") return "maimaiでらっくす PLUS";
  return s;
}

function chartTypeFromVersion(versionStr) {
  const v = standardizeVersion(versionStr);
  if (!v) return "";
  return DX_VERSIONS.has(v) ? "DX" : "ST";
}

function getVersionRank(versionStr) {
  const v = standardizeVersion(versionStr);
  return VERSION_RANK[v] ?? -1;
}

// ── Data fetching ────────────────────────────────────────────────────────────

async function fetchChartData() {
  const status = document.getElementById("status");

  try {
    const res = await fetch(DXDATA_URL);
    const data = await res.json();

    allSongsList = data.songs || [];
    for (const song of allSongsList) {
      const title = normalizeTitle(song.title || "").toLowerCase();
      if (song.category) {
        songCategories[title] = song.category;
      }
      if (song.imageName) {
        songImages[title] = song.imageName;
      }
      for (const sheet of song.sheets || []) {
        const type = (sheet.type || "").toLowerCase();
        const diff = (sheet.difficulty || "").toLowerCase();
        const key = `${title}|${type}|${diff}`;
        const ilv = sheet.internalLevelValue;
        if (ilv != null) {
          chartConstants[key] = ilv;
        }
        if (sheet.version) {
          songVersions[key] = sheet.version;
        }
      }
    }

    // Load song aliases from local config
    try {
      const aliasRes = await fetch("song_aliases.json");
      const aliasData = await aliasRes.json();
      if (aliasData && aliasData.aliases) {
        for (const [k, v] of Object.entries(aliasData.aliases)) {
          songAliases[k.toLowerCase()] = v.toLowerCase();
        }
      }
    } catch (e) {
      console.warn("Failed to load song aliases:", e);
    }

    status.textContent = "Chart data loaded. Ready for Lookup or Cache Import.";
  } catch (e) {
    console.warn("Failed to fetch chart data:", e);
    status.textContent = "Chart data unavailable (offline?). Upload your cache file — ratings will use display levels.";
  }

  // Try SEGA API for genre data (may fail due to CORS)
  try {
    const res = await fetch(SEGA_URL);
    const data = await res.json();
    for (const entry of data) {
      const title = normalizeTitle(entry.title || "").toLowerCase();
      if (entry.catcode && !songCategories[title]) {
        songCategories[title] = entry.catcode;
      }
    }
  } catch (_) {
    // CORS or network error — genre will use dxdata categories or be empty
  }

  // Initialize offline lookup features
  initLookupTab();
}

// ── Cache parsing ────────────────────────────────────────────────────────────

function parseCache(arrayBuffer) {
  const compressed = new Uint8Array(arrayBuffer);
  const raw = pako.inflateRaw(compressed);
  const text = new TextDecoder().decode(raw);
  return JSON.parse(text);
}

// ── Score processing ─────────────────────────────────────────────────────────

function processScores(cache) {
  const scores = [];

  for (const [, meta] of Object.entries(cache.level_metadata || {})) {
    const rawTitle = meta.title || "";
    const { cleanTitle, typeHint } = parseTitle(rawTitle);
    const rawTitleLower = normalizeTitle(rawTitle).toLowerCase();
    const cleanTitleLower = normalizeTitle(cleanTitle).toLowerCase();
    const aliasTitle = songAliases[cleanTitleLower];
    const localMeta = localSongMeta[cleanTitleLower] || localSongMeta[rawTitleLower] || {};
    // Override values win when set; API fills in only what the override leaves blank.
    const genre = localMeta.category
      || songCategories[cleanTitleLower] || songCategories[rawTitleLower]
      || (aliasTitle && songCategories[aliasTitle])
      || "";
    const imageName = localMeta.image
      || songImages[cleanTitleLower] || songImages[rawTitleLower]
      || (aliasTitle && songImages[aliasTitle])
      || "";

    const dbSong = allSongsList.find(song => {
      const t = (song.title || "").toLowerCase();
      return t === cleanTitleLower || t === rawTitleLower || (aliasTitle && t === aliasTitle);
    });
    const searchAcronyms = dbSong ? dbSong.searchAcronyms || [] : [];

    for (const diff of meta.difficulties || []) {
      const stats = diff.stats || {};
      const plays = stats.completePlays || 0;
      if (plays === 0) continue;

      let alias = diff.alias || "";
      if (!alias && diff.id != null) {
        // Fallback for null difficulty aliases using diff.id
        const idToDiff = {
          1: "Basic",
          2: "Basic",
          3: "Advanced",
          4: "Expert",
          5: "Master",
          6: "Re:Master"
        };
        alias = idToDiff[diff.id] || "";
      }
      const value = diff.value || "";
      const acc = stats.achievementRate || 0;
      const ct = stats.clearType || 0;

      const lvMatch = lookupChart(chartConstants, rawTitleLower, cleanTitleLower, alias, typeHint);
      // Always look up override; per-field, override wins when set.
      const override = lookupOverride(cleanTitleLower, alias, typeHint);
      const internalLv = override?.ilv ?? (lvMatch ? lvMatch.value : parseLevel(value));

      const verMatch = lookupChart(songVersions, rawTitleLower, cleanTitleLower, alias, typeHint);
      const version = override?.version || (verMatch ? verMatch.value : "") || "maimai";

      // Determine chart type: from [DX]/[ST] prefix, matched sheet type, or version era
      let chartType = "";
      if (typeHint) {
        chartType = typeHint === "dx" ? "DX" : "ST";
      } else if (lvMatch || override) {
        const mt = (lvMatch || override).matchedType;
        chartType = mt === "dx" ? "DX" : "ST";
      } else if (version) {
        chartType = chartTypeFromVersion(version);
      }

      const baseRating = getRating(internalLv, acc);
      const apBonus = AP_CLEAR_TYPES.has(ct) ? 1 : 0;
      const totalRating = baseRating + apBonus;

      // Rating-if columns
      const ratingIf = {};
      for (const { key, minAchv } of RATING_IF_RANKS) {
        if (acc >= minAchv) {
          ratingIf[key] = null;
        } else {
          const hypothetical = getRating(internalLv, minAchv);
          ratingIf[key] = hypothetical - baseRating;
        }
      }

      scores.push({
        name: cleanTitle,
        chartType,
        version,
        genre,
        imageName,
        searchAcronyms,
        playcount: plays,
        difficulty: alias,
        level: internalLv,
        levelFromServer: !!(lvMatch || override?.ilv),
        clear: CLEAR_LABELS[ct] || "",
        clearType: ct,
        accuracy: acc,
        rank: getRankLabel(acc),
        rating: totalRating,
        internalLv,
        dxScore: stats.dxScore || 0,
        totalNotes: stats.totalNotesCount || 0,
        dxStars: getDxStars(stats.dxScore || 0, stats.totalNotesCount || 0),
        ...ratingIf,
      });
    }
  }

  // Deduplicate: same song+difficulty → keep highest rating
  const best = new Map();
  for (const s of scores) {
    const key = `${s.name.toLowerCase()}|${s.chartType}|${s.difficulty}`;
    const existing = best.get(key);
    if (!existing || s.rating > existing.rating) {
      best.set(key, s);
    }
  }

  return Array.from(best.values());
}

// ── Table rendering ──────────────────────────────────────────────────────────

function renderTable() {
  const tbody = document.getElementById("score-body");
  const info = document.getElementById("table-info");

  // Sort
  const col = sortCol;
  filteredScores.sort((a, b) => {
    let va = a[col], vb = b[col];
    if (va == null) va = -Infinity;
    if (vb == null) vb = -Infinity;
    if (typeof va === "string") {
      const cmp = va.localeCompare(vb);
      return sortAsc ? cmp : -cmp;
    }
    return sortAsc ? va - vb : vb - va;
  });

  // Build rows
  const fragment = document.createDocumentFragment();
  filteredScores.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.className = DIFF_CLASS[s.difficulty] || "";

    const cells = [
      i + 1,
      s.chartType,
      versionName(s.version),
      s.genre,
      s.playcount,
    ];

    for (const val of cells) {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    }

    // Name cell with jacket tooltip
    const tdName = document.createElement("td");
    tdName.textContent = s.name;
    if (s.imageName) {
      tdName.className = "has-jacket";
      tdName.style.setProperty("--jacket", `url(${jacketUrl(s.imageName)})`);
    }
    tr.appendChild(tdName);

    // Lv (bold)
    const tdLv = document.createElement("td");
    tdLv.textContent = s.levelFromServer ? s.level.toFixed(1) : s.level.toFixed(0);
    tdLv.className = "col-bold";
    tr.appendChild(tdLv);

    // Clear (image)
    const tdClear = document.createElement("td");
    if (s.clear) tdClear.innerHTML = clearImg(s.clear, 16);
    tr.appendChild(tdClear);

    // Accuracy
    const tdAcc = document.createElement("td");
    tdAcc.textContent = s.accuracy.toFixed(4) + "%";
    tr.appendChild(tdAcc);

    // Rank (image)
    const tdRank = document.createElement("td");
    tdRank.innerHTML = rankImg(s.rank, 16);
    tr.appendChild(tdRank);

    // Rating (bold)
    const tdRating = document.createElement("td");
    tdRating.textContent = s.rating;
    tdRating.className = "col-bold";
    tr.appendChild(tdRating);

    // DX Stars
    const tdDx = document.createElement("td");
    if (s.dxStars > 0) tdDx.innerHTML = dxStarImg(s.dxStars, 16);
    tr.appendChild(tdDx);

    // Rating-if columns
    for (const { key } of RATING_IF_RANKS) {
      const td = document.createElement("td");
      const gain = s[key];
      if (gain != null && gain > 0) {
        td.textContent = "+" + gain;
        td.className = "gain";
      }
      tr.appendChild(td);
    }

    fragment.appendChild(tr);
  });

  tbody.innerHTML = "";
  tbody.appendChild(fragment);
  info.textContent = `${filteredScores.length} scores`;

  if (firstRender) {
    tbody.classList.add("animate-rows");
    const rows = tbody.querySelectorAll("tr");
    const STAGGER_COUNT = Math.min(rows.length, 20);
    for (let i = 0; i < STAGGER_COUNT; i++) {
      rows[i].style.animationDelay = `${i * 0.02}s`;
    }
    // Remove after animation done
    setTimeout(() => {
      tbody.classList.remove("animate-rows");
      rows.forEach(r => r.style.animationDelay = "");
    }, STAGGER_COUNT * 20 + 300);
    firstRender = false;
  }
}

// Level filter state — defaults cover the full 1.0–15.0 range (no filter).
let levelMin = 1.0;
let levelMax = 15.0;
let levelMode = "visible";

function syncVisibleInputs() {
  document.getElementById("level-min-visible").value = constantToVisibleLabel(levelMin);
  document.getElementById("level-max-visible").value = constantToVisibleLabel(levelMax);
}
function syncConstantInputs() {
  document.getElementById("level-min-constant").value = levelMin.toFixed(1);
  document.getElementById("level-max-constant").value = levelMax.toFixed(1);
}

function initLevelFilter() {
  const minSel = document.getElementById("level-min-visible");
  const maxSel = document.getElementById("level-max-visible");
  for (const lv of VISIBLE_LEVELS) {
    minSel.add(new Option(lv, lv));
    maxSel.add(new Option(lv, lv));
  }
  // Defaults: full range
  minSel.value = "1";
  maxSel.value = "15";
  syncConstantInputs();

  minSel.addEventListener("change", () => {
    levelMin = visibleLevelRange(minSel.value)[0];
    if (levelMin > levelMax) { levelMax = visibleLevelRange(minSel.value)[1]; syncVisibleInputs(); }
    syncConstantInputs();
    applyFilters();
  });
  maxSel.addEventListener("change", () => {
    levelMax = visibleLevelRange(maxSel.value)[1];
    if (levelMax < levelMin) { levelMin = visibleLevelRange(maxSel.value)[0]; syncVisibleInputs(); }
    syncConstantInputs();
    applyFilters();
  });

  const minIn = document.getElementById("level-min-constant");
  const maxIn = document.getElementById("level-max-constant");
  minIn.addEventListener("input", () => {
    const v = parseFloat(minIn.value);
    if (!isNaN(v)) {
      levelMin = Math.max(1.0, Math.min(15.0, v));
      applyFilters();
    }
  });
  maxIn.addEventListener("input", () => {
    const v = parseFloat(maxIn.value);
    if (!isNaN(v)) {
      levelMax = Math.max(1.0, Math.min(15.0, v));
      applyFilters();
    }
  });

  // Mode toggle
  document.querySelectorAll(".level-mode-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      levelMode = btn.dataset.mode;
      document.querySelectorAll(".level-mode-toggle button")
        .forEach(b => b.classList.toggle("active", b === btn));
      document.querySelector(".visible-inputs").classList.toggle("hidden", levelMode !== "visible");
      document.querySelector(".constant-inputs").classList.toggle("hidden", levelMode !== "constant");
      // Switching to visible: auto-snap so the dropdown actually reflects the filter.
      if (levelMode === "visible") {
        const before = [levelMin, levelMax];
        levelMin = snapMinDown(levelMin);
        levelMax = snapMaxUp(levelMax);
        syncVisibleInputs();
        syncConstantInputs();
        if (before[0] !== levelMin || before[1] !== levelMax) applyFilters();
      } else {
        syncConstantInputs();
      }
    });
  });

  // Snap button: expand range outward to nearest visible-level boundaries.
  document.getElementById("level-snap").addEventListener("click", () => {
    levelMin = snapMinDown(levelMin);
    levelMax = snapMaxUp(levelMax);
    syncVisibleInputs();
    syncConstantInputs();
    applyFilters();
  });
}

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const checkedDiffs = new Set(
    Array.from(document.querySelectorAll('#diff-filters input:checked'))
      .map(cb => cb.value)
  );

  // Use ±0.0001 tolerance for float comparison.
  const minTol = levelMin - 0.0001;
  const maxTol = levelMax + 0.0001;

  const qRomaji = toRomaji(query);

  filteredScores = allScores.filter(s => {
    if (!checkedDiffs.has(s.difficulty)) return false;
    if (query) {
      const nameRomaji = toRomaji(s.name.toLowerCase());
      const acronymMatch = (s.searchAcronyms || []).some(acr => 
        (acr || "").toLowerCase().includes(query)
      );
      if (!nameRomaji.includes(qRomaji) && !acronymMatch) return false;
    }
    if (s.level < minTol || s.level > maxTol) return false;
    return true;
  });

  renderTable();
}

// ── Best 50 ─────────────────────────────────────────────────────────────────

function scoreKey(s) {
  return `${s.name.toLowerCase()}|${s.chartType}|${s.difficulty}`;
}

// Returns the unique versions present in allScores, sorted newest-first.
function getAvailableVersions() {
  const set = new Set();
  for (const s of allScores) {
    if (s.version && getVersionRank(s.version) >= 0) set.add(s.version);
  }
  return Array.from(set).sort((a, b) => getVersionRank(b) - getVersionRank(a));
}

// Build the version-checkbox UI from played scores. Called on file load.
// Preserves any prior selection that's still valid.
function setupB50VersionPicker() {
  const host = document.getElementById("b50-version-checks");
  const wrap = document.getElementById("b50-new-versions");
  if (!host) return;

  const versions = getAvailableVersions();
  if (versions.length === 0) {
    wrap.classList.add("hidden");
    return;
  }
  wrap.classList.remove("hidden");

  // Drop versions from b50NewVersions that are no longer present.
  for (const v of Array.from(b50NewVersions)) {
    if (!versions.includes(v)) b50NewVersions.delete(v);
  }
  // First-time setup: default to the newest N.
  if (b50NewVersions.size === 0) {
    for (const v of versions.slice(0, B50_DEFAULT_NEW_COUNT)) b50NewVersions.add(v);
  }

  host.innerHTML = "";
  for (const v of versions) {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = String(v);
    cb.checked = b50NewVersions.has(v);
    label.classList.toggle("checked", cb.checked);
    cb.addEventListener("change", () => {
      if (cb.checked) b50NewVersions.add(v);
      else b50NewVersions.delete(v);
      label.classList.toggle("checked", cb.checked);
      renderB50();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(versionName(v)));
    host.appendChild(label);
  }
}

function setB50NewVersions(versions) {
  b50NewVersions = new Set(versions);
  // Refresh checkbox visual state without rebuilding the DOM.
  const host = document.getElementById("b50-version-checks");
  if (host) {
    for (const cb of host.querySelectorAll("input[type=checkbox]")) {
      cb.checked = b50NewVersions.has(cb.value);
      cb.parentElement.classList.toggle("checked", cb.checked);
    }
  }
  renderB50();
}

function computeBest50() {
  // Use the user-selected "new" versions directly.
  const newVersions = b50NewVersions;

  // Determine max allowed version rank (for ignore-newer feature)
  let maxRank = Infinity;
  if (b50IgnoreNewer && newVersions.size > 0) {
    maxRank = Math.max(...Array.from(newVersions).map(v => getVersionRank(v)));
  }

  // Filter scores that have a known version and are not excluded
  const eligible = allScores.filter(s => {
    if (b50Excluded.has(scoreKey(s))) return false;
    const rank = getVersionRank(s.version);
    if (rank < 0) return false;
    if (b50IgnoreNewer && rank > maxRank) return false;
    return true;
  });

  // Split into new/old and sort by rating desc
  const newScores = eligible
    .filter(s => newVersions.has(s.version))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 15);

  const oldScores = eligible
    .filter(s => !newVersions.has(s.version))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 35);

  return { newScores, oldScores };
}

function animateRatingPlate(elementId, targetValue) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const plateValue = el.querySelector(".rating-plate-value");
  if (!plateValue) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    plateValue.textContent = targetValue;
    return;
  }

  const duration = 400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    plateValue.textContent = Math.round(eased * targetValue);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderB50() {
  const { newScores, oldScores } = computeBest50();

  const newSum = newScores.reduce((s, x) => s + x.rating, 0);
  const oldSum = oldScores.reduce((s, x) => s + x.rating, 0);
  const total = newSum + oldSum;

  const totalCount = newScores.length + oldScores.length;
  const PLATE_H_LIVE = 44;
  document.getElementById("b50-old-sum").innerHTML = ratingPlateHtml(0, getPoolTier(oldSum, oldScores.length), PLATE_H_LIVE);
  document.getElementById("b50-new-sum").innerHTML = ratingPlateHtml(0, getPoolTier(newSum, newScores.length), PLATE_H_LIVE);
  document.getElementById("b50-total").innerHTML  = ratingPlateHtml(0,  getRatingTier(total),                     PLATE_H_LIVE);

  animateRatingPlate("b50-old-sum", oldSum);
  animateRatingPlate("b50-new-sum", newSum);
  animateRatingPlate("b50-total", total);

  document.getElementById("b50-new-avg").textContent = newScores.length ? (newSum / newScores.length).toFixed(1) : "0";
  document.getElementById("b50-old-avg").textContent = oldScores.length ? (oldSum / oldScores.length).toFixed(1) : "0";
  document.getElementById("b50-total-avg").textContent = totalCount ? (total / totalCount).toFixed(1) : "0";

  // Build row list — separate (NEW block then OLD block) or combined (single sorted list)
  let rows;
  if (b50Combined) {
    const all = [
      ...newScores.map(s => ({ ...s, pool: "NEW" })),
      ...oldScores.map(s => ({ ...s, pool: "OLD" })),
    ].sort((a, b) => b.rating - a.rating);
    rows = all.map((s, i) => ({ ...s, idx: i + 1 }));
  } else {
    rows = [
      ...newScores.map((s, i) => ({ ...s, pool: "NEW", idx: i + 1 })),
      ...oldScores.map((s, i) => ({ ...s, pool: "OLD", idx: i + 1 })),
    ];
  }

  // Update excluded count / clear button
  const excludeInfo = document.getElementById("b50-exclude-info");
  if (b50Excluded.size > 0) {
    excludeInfo.innerHTML = `${b50Excluded.size} score(s) excluded <button id="b50-clear-excluded" type="button">Clear</button>`;
    document.getElementById("b50-clear-excluded").addEventListener("click", () => {
      b50Excluded.clear();
      renderB50();
    });
    excludeInfo.classList.remove("hidden");
  } else {
    excludeInfo.classList.add("hidden");
  }

  const tbody = document.getElementById("b50-body");
  const fragment = document.createDocumentFragment();

  for (const s of rows) {
    const tr = document.createElement("tr");
    tr.className = DIFF_CLASS[s.difficulty] || "";

    // Exclude button column
    const tdExcl = document.createElement("td");
    tdExcl.className = "b50-exclude-cell";
    const btn = document.createElement("button");
    btn.className = "b50-exclude-btn";
    btn.textContent = "\u00d7";
    btn.title = "Exclude from B50";
    btn.addEventListener("click", () => {
      b50Excluded.add(scoreKey(s));
      renderB50();
    });
    tdExcl.appendChild(btn);
    tr.appendChild(tdExcl);

    // # column
    const tdIdx = document.createElement("td");
    tdIdx.textContent = s.idx;
    tr.appendChild(tdIdx);

    // Pool column
    const tdPool = document.createElement("td");
    tdPool.textContent = s.pool;
    tdPool.className = s.pool === "NEW" ? "pool-new" : "pool-old";
    tr.appendChild(tdPool);

    // Rest of columns
    const cells = [
      s.chartType,
      versionName(s.version),
      s.genre,
      s.playcount,
    ];

    for (const val of cells) {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    }

    // Name cell with jacket tooltip
    const tdName = document.createElement("td");
    tdName.textContent = s.name;
    if (s.imageName) {
      tdName.className = "has-jacket";
      tdName.style.setProperty("--jacket", `url(${jacketUrl(s.imageName)})`);
    }
    tr.appendChild(tdName);

    // Lv (bold)
    const tdLv = document.createElement("td");
    tdLv.textContent = s.levelFromServer ? s.level.toFixed(1) : s.level.toFixed(0);
    tdLv.className = "col-bold";
    tr.appendChild(tdLv);

    // Clear (image)
    const tdClear = document.createElement("td");
    if (s.clear) tdClear.innerHTML = clearImg(s.clear, 16);
    tr.appendChild(tdClear);

    // Accuracy
    const tdAcc = document.createElement("td");
    tdAcc.textContent = s.accuracy.toFixed(4) + "%";
    tr.appendChild(tdAcc);

    // Rank (image)
    const tdRank = document.createElement("td");
    tdRank.innerHTML = rankImg(s.rank, 16);
    tr.appendChild(tdRank);

    // Rating (bold)
    const tdRating = document.createElement("td");
    tdRating.textContent = s.rating;
    tdRating.className = "col-bold";
    tr.appendChild(tdRating);

    // DX Stars
    const tdDx = document.createElement("td");
    if (s.dxStars > 0) tdDx.innerHTML = dxStarImg(s.dxStars, 16);
    tr.appendChild(tdDx);

    // Rating-if columns
    for (const { key } of RATING_IF_RANKS) {
      const td = document.createElement("td");
      td.className = "col-if";
      const gain = s[key];
      if (gain != null && gain > 0) {
        td.textContent = "+" + gain;
        td.classList.add("gain");
      }
      tr.appendChild(td);
    }

    fragment.appendChild(tr);
  }

  tbody.innerHTML = "";
  tbody.appendChild(fragment);

  renderB50TopPlays(newScores, oldScores);

  // Pre-fetch jacket images in background for export
  preloadExportImages([...newScores, ...oldScores]);
}

function renderB50TopPlays(newScores, oldScores) {
  const container = document.getElementById("b50-top-plays");

  function makeCard(s) {
    const diffCls = DIFF_CLASS[s.difficulty] || "";
    const isDX = s.chartType === "DX";
    const lvText = s.levelFromServer ? s.level.toFixed(1) : s.level.toFixed(0);
    const artSrc = s.imageName ? jacketUrl(s.imageName) : "";
    const artHtml = artSrc
      ? `<img class="tp-card-art" src="${artSrc}" onerror="this.style.visibility='hidden'">`
      : `<div class="tp-card-art tp-card-art-empty"></div>`;
    const clearStr = CLEAR_LABELS[s.clearType] || "";
    const clearHtml = clearStr ? clearImg(clearStr, 16) : "";
    const dxHtml = s.dxStars > 0 ? dxStarImg(s.dxStars, 18) : "";

    return `<div class="tp-card ${diffCls}">
      <div class="tp-card-top">
        <div class="tp-card-top-info">
          <span class="tp-card-name">${s.name}</span>
          <span class="tp-card-constant">${lvText}</span>
        </div>
      </div>
      <div class="tp-card-content">
        ${artHtml}
        <div class="tp-card-info">
          <div class="tp-card-rank-row">
            ${rankImg(s.rank, 20)}
            <div class="tp-card-type ${isDX ? "dx" : "std"}">${isDX ? "DX" : "ST"}</div>
          </div>
          <div class="tp-card-info-bottom">
            <div class="tp-card-accuracy">${s.accuracy.toFixed(4)}%</div>
            <div class="tp-card-difficulty">${s.difficulty}</div>
            <div class="tp-card-rating-row">
              ${dxHtml}${clearHtml}
              <span class="tp-card-rating">${s.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  const oldCards = oldScores.map(makeCard).join("");
  const newCards = newScores.map(makeCard).join("");

  container.innerHTML = `
    <div class="tp-grids-row">
      <div class="tp-grid-section tp-old-section">
        <div class="tp-section-label old">OLD CHARTS</div>
        <div class="tp-card-grid tp-grid-7">${oldCards}</div>
      </div>
      <div class="tp-grid-divider"></div>
      <div class="tp-grid-section tp-new-section">
        <div class="tp-section-label new">NEW CHARTS</div>
        <div class="tp-card-grid tp-grid-3">${newCards}</div>
      </div>
    </div>`;

  const cards = container.querySelectorAll(".tp-card");
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.025}s`;
  });

}

// ── Statistics ────────────────────────────────────────────────────────────────

const DX_STAR_THRESHOLDS = [
  { stars: 5, min: 97 },
  { stars: 4, min: 95 },
  { stars: 3, min: 93 },
  { stars: 2, min: 90 },
  { stars: 1, min: 85 },
];

function getDxStars(dxScore, totalNotes) {
  if (!totalNotes || totalNotes <= 0) return 0;
  const maxDx = totalNotes * 3;
  const pct = (dxScore / maxDx) * 100;
  for (const { stars, min } of DX_STAR_THRESHOLDS) {
    if (pct >= min) return stars;
  }
  return 0;
}

function jacketUrl(imageName) {
  if (!imageName) return "";
  // Local fallback (path already starts with "assets/")
  if (imageName.startsWith("assets/")) return imageName;
  return `${JACKET_CDN}/${imageName}.jpg`;
}

function jacketImg(imageName, size) {
  if (!imageName) return "";
  const sz = size || 28;
  return `<img class="stat-jacket" src="${jacketUrl(imageName)}" width="${sz}" height="${sz}" loading="lazy" onerror="this.style.display='none'">`;
}

function buildBar(label, value, max, color) {
  const pct = max > 0 ? (value / max * 100) : 0;
  return `<div class="stat-bar-row">
    <span class="stat-bar-label">${label}</span>
    <div class="stat-bar-track">
      <div class="stat-bar-fill" style="width:${pct}%;background:${color}"></div>
    </div>
    <span class="stat-bar-value">${value}</span>
  </div>`;
}

function renderStats() {
  const container = document.getElementById("stats-container");
  const scores = allScores;

  // ── Play Summary ──
  const totalPlays = scores.reduce((s, x) => s + x.playcount, 0);
  const uniqueCharts = scores.length;
  const avgPlays = uniqueCharts ? (totalPlays / uniqueCharts).toFixed(1) : "0";

  // ── Most Played Charts (individual chart+difficulty) ──
  const topCharts = [...scores].sort((a, b) => b.playcount - a.playcount).slice(0, 10);
  const topChartMax = topCharts[0]?.playcount || 1;

  // ── Version Breakdown ──
  const versionPlays = new Map();
  for (const s of scores) {
    const v = s.version || "Unknown";
    versionPlays.set(v, (versionPlays.get(v) || 0) + s.playcount);
  }
  const versionEntries = Array.from(versionPlays.entries())
    .sort((a, b) => getVersionRank(a[0]) - getVersionRank(b[0]));
  const versionMax = Math.max(...versionEntries.map(e => e[1]), 1);

  // ── Genre Breakdown ──
  const genrePlays = new Map();
  for (const s of scores) {
    const g = s.genre || "Unknown";
    genrePlays.set(g, (genrePlays.get(g) || 0) + s.playcount);
  }
  const genreEntries = Array.from(genrePlays.entries()).sort((a, b) => b[1] - a[1]);
  const genreMax = Math.max(...genreEntries.map(e => e[1]), 1);

  // ── Difficulty Breakdown ──
  const diffOrder = ["Basic", "Advanced", "Expert", "Master", "Re:Master"];
  const diffColors = { Basic: "#22bb5b", Advanced: "#f0a030", Expert: "#ee4444", Master: "#bb66ee", "Re:Master": "#dda0ff" };
  const diffPlays = new Map();
  for (const s of scores) diffPlays.set(s.difficulty, (diffPlays.get(s.difficulty) || 0) + s.playcount);
  const diffMax = Math.max(...diffOrder.map(d => diffPlays.get(d) || 0), 1);

  // ── DX Stars ──
  const starCounts = [0, 0, 0, 0, 0, 0];
  for (const s of scores) {
    starCounts[getDxStars(s.dxScore, s.totalNotes)]++;
  }
  const starMax = Math.max(...starCounts, 1);

  // ── Rank Distribution ──
  const rankOrder = ["D", "C", "B", "BB", "BBB", "A", "AA", "AAA", "S", "S+", "SS", "SS+", "SSS", "SSS+"];
  const rankCounts = new Map();
  for (const r of rankOrder) rankCounts.set(r, 0);
  for (const s of scores) rankCounts.set(s.rank, (rankCounts.get(s.rank) || 0) + 1);
  const rankMax = Math.max(...rankOrder.map(r => rankCounts.get(r) || 0), 1);

  // ── Clear Type Distribution ──
  const clearOrder = [
    { key: "clear", label: "Clear", types: [0, 1, 2] },
    { key: "fc", label: "FC", types: [3] },
    { key: "fcp", label: "FC+", types: [4] },
    { key: "ap", label: "AP", types: [5] },
    { key: "app", label: "AP+", types: [6] },
  ];
  const clearColors = { clear: "#888", fc: "#44bbee", fcp: "#33ddaa", ap: "#ffcc44", app: "#ff8844" };
  const clearCounts = {};
  for (const c of clearOrder) clearCounts[c.key] = 0;
  for (const s of scores) {
    for (const c of clearOrder) {
      if (c.types.includes(s.clearType)) { clearCounts[c.key]++; break; }
    }
  }
  const clearMax = Math.max(...Object.values(clearCounts), 1);

  // ── Build HTML ──
  let html = `<div class="stats-grid">`;

  // Play Summary
  html += `<div class="stat-card stat-card-wide">
    <h3>Play Summary</h3>
    <div class="stat-summary-row">
      <div class="stat-big"><span class="stat-big-num">${totalPlays.toLocaleString()}</span><span class="stat-big-label">Total Plays</span></div>
      <div class="stat-big"><span class="stat-big-num">${uniqueCharts}</span><span class="stat-big-label">Charts Played</span></div>
      <div class="stat-big"><span class="stat-big-num">${avgPlays}</span><span class="stat-big-label">Avg Plays/Chart</span></div>
    </div>
  </div>`;

  // Most Played Charts
  html += `<div class="stat-card stat-card-wide">
    <h3>Most Played Charts</h3>
    <div class="top-charts">`;
  for (let i = 0; i < topCharts.length; i++) {
    const s = topCharts[i];
    const diffCls = DIFF_CLASS[s.difficulty] || "";
    const jacket = s.imageName
      ? `<img class="top-chart-jacket" src="${jacketUrl(s.imageName)}" loading="lazy" onerror="this.style.visibility='hidden'">`
      : `<div class="top-chart-jacket top-chart-jacket-empty"></div>`;
    const typeTag = s.chartType ? `[${s.chartType}]` : "";
    const clearStr = s.clear || "";
    html += `<div class="top-chart-row">
      <span class="top-chart-rank">${i + 1}</span>
      ${jacket}
      <div class="top-chart-info">
        <span class="top-chart-name ${diffCls}">${s.name} <span class="top-chart-type">${typeTag}</span></span>
        <span class="top-chart-meta"><span class="${diffCls}">${s.difficulty}</span> <span class="top-chart-lv">${s.levelFromServer ? s.level.toFixed(1) : s.level.toFixed(0)}</span></span>
      </div>
      <div class="top-chart-stats">
        <span class="top-chart-acc">${s.accuracy.toFixed(2)}%</span>
        <span class="top-chart-icons">${rankImg(s.rank, 14)}${clearStr ? " " + clearImg(clearStr, 14) : ""}${s.dxStars > 0 ? " " + dxStarImg(s.dxStars, 14) : ""}</span>
      </div>
      <span class="top-chart-plays">${s.playcount} plays</span>
    </div>`;
  }
  html += `</div></div>`;

  // Version Breakdown
  html += `<div class="stat-card">
    <h3>Version Breakdown</h3>`;
  for (const [v, count] of versionEntries) {
    html += buildBar(versionName(v), count, versionMax, "#7c5cbf");
  }
  html += `</div>`;

  // Genre Breakdown
  html += `<div class="stat-card">
    <h3>Genre Breakdown</h3>`;
  for (const [g, count] of genreEntries) {
    html += buildBar(g, count, genreMax, "#5c8abf");
  }
  html += `</div>`;

  // Difficulty Breakdown
  html += `<div class="stat-card">
    <h3>Difficulty Breakdown</h3>`;
  for (const d of diffOrder) {
    html += buildBar(d, diffPlays.get(d) || 0, diffMax, diffColors[d] || "#7c5cbf");
  }
  html += `</div>`;

  // DX Stars
  html += `<div class="stat-card">
    <h3>DX Score Stars</h3>`;
  for (let i = 0; i <= 5; i++) {
    const label = i === 0 ? "No stars" : dxStarImg(i, 18);
    html += buildBar(label, starCounts[i], starMax, i === 0 ? "#555" : `hsl(${40 + i * 10}, 90%, ${50 + i * 5}%)`);
  }
  html += `</div>`;

  // Rank Distribution
  html += `<div class="stat-card">
    <h3>Rank Distribution</h3>`;
  for (const r of rankOrder) {
    const c = rankCounts.get(r) || 0;
    html += buildBar(rankImg(r, 14), c, rankMax, "#7c5cbf");
  }
  html += `</div>`;

  // Clear Type Distribution
  html += `<div class="stat-card">
    <h3>Clear Type</h3>`;
  for (const c of clearOrder) {
    const label = CLEAR_IMAGES[c.label] ? clearImg(c.label, 14) : c.label;
    html += buildBar(label, clearCounts[c.key], clearMax, clearColors[c.key]);
  }
  html += `</div>`;

  html += `</div>`;
  container.innerHTML = html;
}

// ── B50 Export (standalone page approach) ────────────────────────────────────

const IMG_PROXY = "https://images.weserv.nl/?url=";

// Convert local asset to data URL for embedding in export page
const _assetDataUrls = new Map();
function assetToDataUrl(path) {
  if (_assetDataUrls.has(path)) return _assetDataUrls.get(path);
  const p = new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      try { resolve(c.toDataURL("image/png")); }
      catch { resolve(path); }
    };
    img.onerror = () => resolve(path);
    img.src = path;
  });
  _assetDataUrls.set(path, p);
  return p;
}

// Preload asset data URLs when B50 renders
function preloadExportImages(scores) {
  // Preload all rank/clear/dxstar assets as data URLs
  for (const src of Object.values(RANK_IMAGES)) assetToDataUrl(src);
  for (const src of Object.values(CLEAR_IMAGES)) assetToDataUrl(src);
  for (const src of Object.values(DXSTAR_IMAGES)) assetToDataUrl(src);
}

function showExportModal(canvas) {
  const modal = document.getElementById("export-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");
  const overlayBtn = document.getElementById("modal-overlay-btn");

  if (!modal || !modalBody) return;

  modalBody.innerHTML = "";
  modalBody.appendChild(canvas);
  modal.classList.remove("hidden");

  function closeModal() {
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
    closeBtn.removeEventListener("click", closeModal);
    overlayBtn.removeEventListener("click", closeModal);
  }

  closeBtn.addEventListener("click", closeModal);
  overlayBtn.addEventListener("click", closeModal);
}

function loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => resolve(window.html2canvas);
    s.onerror = (err) => reject(new Error("Failed to load html2canvas library. Please check your internet connection."));
    document.head.appendChild(s);
  });
}

async function exportB50Image() {
  const btn = document.getElementById("b50-export");
  if (!btn) return;
  btn.disabled = true;
  btn.textContent = "Loading renderer...";

  try {
    // Dynamic load html2canvas to avoid blocking initial upload UI
    await loadHtml2Canvas();
    
    btn.textContent = "Rendering...";

    const el = document.getElementById("b50-capture");
    if (!el) {
      alert("Capture region not found.");
      return;
    }
    
    // Temporarily show the footer for the capture
    const footer = document.getElementById("b50-footer");
    if (footer) footer.style.display = "block";
    
    // We capture with a beautiful high resolution scale of 2
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    const bg = theme === "light" ? "#f4f4f5" : "#0f0f13";

    // Set allowTaint: true so it doesn't fail under file:/// CORS blocks, and useCORS: false so it uses already loaded elements directly
    const canvas = await html2canvas(el, {
      backgroundColor: bg,
      scale: 2,
      useCORS: false,
      allowTaint: true,
      logging: false,
    });

    if (footer) footer.style.display = "";

    try {
      // Try direct programmatic download first
      const a = document.createElement("a");
      a.download = "best50.png";
      a.href = canvas.toDataURL("image/png");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (downloadErr) {
      // If direct download is blocked by browser CORS sandbox, show fallback modal
      console.warn("Direct download blocked (canvas is tainted). Falling back to modal.", downloadErr);
      showExportModal(canvas);
    }
  } catch (e) {
    console.error("Export error:", e);
    alert(e.message || "Export failed. Make sure chart images are loaded correctly, or take a manual screenshot of the Best 50 board.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Export Board as Image";
  }
}

function switchTab(tab) {
  const tabButton = document.querySelector(`.tab[data-tab="${tab}"]`);
  if (tabButton && tabButton.disabled) return;

  activeTab = tab;
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.tab === tab);
  });
  
  document.getElementById("tab-lookup").classList.toggle("hidden", tab !== "lookup");
  document.getElementById("tab-upload").classList.toggle("hidden", tab !== "upload");
  document.getElementById("tab-all").classList.toggle("hidden", tab !== "all");
  document.getElementById("tab-b50").classList.toggle("hidden", tab !== "b50");
  document.getElementById("tab-stats").classList.toggle("hidden", tab !== "stats");

  if (tab === "b50" && allScores.length > 0) {
    renderB50();
  }
  if (tab === "stats" && allScores.length > 0) {
    renderStats();
  }
}

// ── Event setup ──────────────────────────────────────────────────────────────

function setupEvents() {
  // File upload
  const fileInput = document.getElementById("file-input");
  const uploadArea = document.getElementById("upload-area");

  fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#7c5cbf";
  });
  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "";
  });
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "";
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  // Search
  document.getElementById("search").addEventListener("input", applyFilters);

  // Difficulty filters
  document.querySelectorAll("#diff-filters input").forEach(cb => {
    cb.addEventListener("change", applyFilters);
  });

  // Level filter
  initLevelFilter();

  // Tabs
  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => switchTab(t.dataset.tab));
  });

  // B50 settings
  document.getElementById("b50-versions-latest").addEventListener("click", () => {
    const versions = getAvailableVersions().slice(0, B50_DEFAULT_NEW_COUNT);
    setB50NewVersions(versions);
  });
  document.getElementById("b50-versions-clear").addEventListener("click", () => {
    setB50NewVersions([]);
  });

  document.getElementById("b50-ignore-newer").addEventListener("change", (e) => {
    b50IgnoreNewer = e.target.checked;
    if (allScores.length > 0) renderB50();
  });

  document.getElementById("b50-display-mode").addEventListener("change", (e) => {
    b50Combined = e.target.value === "combined";
    if (allScores.length > 0) renderB50();
  });

  // B50 export
  document.getElementById("b50-export").addEventListener("click", exportB50Image);

  // Column sort
  document.querySelectorAll("#score-table th[data-col]").forEach(th => {
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      if (col === "#") return;

      if (sortCol === col) {
        sortAsc = !sortAsc;
      } else {
        sortCol = col;
        sortAsc = col === "name" || col === "chartType" || col === "version" || col === "genre";
      }

      // Update header classes
      document.querySelectorAll("#score-table th").forEach(h => {
        h.classList.remove("sorted", "asc", "desc");
      });
      th.classList.add("sorted", sortAsc ? "asc" : "desc");

      renderTable();
    });
  });
}

function handleFile(file) {
  const status = document.getElementById("status");
  status.textContent = "Parsing cache...";

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const cache = parseCache(e.target.result);
      allScores = processScores(cache);
      filteredScores = [...allScores];

      // Unlock all tabs
      document.querySelectorAll(".tab.disabled-tab").forEach(t => {
        t.disabled = false;
        t.classList.remove("disabled-tab");
        t.removeAttribute("title");
      });

      document.getElementById("controls").classList.remove("hidden");
      document.getElementById("table-section").classList.remove("hidden");
      document.getElementById("b50-ignore-label").classList.remove("hidden");

      setupB50VersionPicker();

      // Default sort: rating descending
      sortCol = "rating";
      sortAsc = false;
      renderTable();

      // Auto switch to Best 50 tab
      switchTab("b50");

      status.textContent = `Loaded ${allScores.length} scores.`;
    } catch (err) {
      console.error(err);
      status.textContent = "Error: could not parse cache file. Make sure it's a valid AstroDX cache.";
    }
  };
  reader.readAsArrayBuffer(file);
}

// ── Offline Constant Lookup & Play Tracker ───────────────────────────────────

const KANA_MAP = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'ta':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','mi':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','đ':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','る':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n',
  'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
  'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
  'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
  'パ':'pa','pi':'pi','プ':'pu','ペ':'pe','ポ':'po',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
  'ァ':'a','ィ':'i','ゥ':'u','ェ':'e','ォ':'o',
  'っ':'tsu','ッ':'tsu','ゃ':'ya','ゅ':'yu','ょ':'yo',
  'ャ':'ya','ュ':'yu','ョ':'yo','ゎ':'wa','ヮ':'wa',
  'ー':''
};

const KANA_COMBINATIONS = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  'ぎゃ':'gya','ぎゅ':'gyu','giょ':'gyo',
  'じゃ':'ja','じゅ':'ju','じょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'キャ':'kya','キュ':'kyu','キョ':'kyo',
  'シャ':'sha','シュ':'shu','ショ':'sho',
  'チャ':'cha','チュ':'chu','チョ':'cho',
  'ニャ':'nya','ニュ':'nyu','ニョ':'nyo',
  'ヒャ':'hya','ヒュ':'hyu','ヒョ':'hyo',
  'ミャ':'mya','ミュ':'myu','ミョ':'myo',
  'リャ':'rya','リュ':'ryu','リョ':'ryo',
  'ギャ':'gya','ギュ':'gyu','ギョ':'gyo',
  'ジャ':'ja','ジュ':'ju','ジョ':'jo',
  'ビャ':'bya','ビュ':'byu','ビョ':'byo',
  'ピャ':'pya','ピュ':'pyu','ピョ':'pyo',
  'ティ':'ti','ディ':'di','デュ':'du',
  'ファ':'fa','フィ':'fi','フェ':'fe','フォ':'fo',
  'ウィ':'wi','ウェ':'we','ウォ':'wo',
  'ヴァ':'va','ヴィ':'vi','ヴェ':'ve','ヴォ':'vo'
};

function toRomaji(str) {
  if (!str) return "";
  let result = "";
  let i = 0;
  while (i < str.length) {
    const char = str[i];
    const nextChar = str[i + 1] || "";
    const combo = char + nextChar;

    if (KANA_COMBINATIONS[combo]) {
      result += KANA_COMBINATIONS[combo];
      i += 2;
    } else if (char === "っ" || char === "ッ") {
      if (nextChar) {
        let nextRomaji = "";
        const nextCombo = nextChar + (str[i + 2] || "");
        if (KANA_COMBINATIONS[nextCombo]) {
          nextRomaji = KANA_COMBINATIONS[nextCombo];
        } else if (KANA_MAP[nextChar]) {
          nextRomaji = KANA_MAP[nextChar];
        }
        if (nextRomaji && !["a","i","u","e","o","n"].includes(nextRomaji[0])) {
          result += nextRomaji[0];
        }
      }
      i += 1;
    } else if (KANA_MAP[char]) {
      result += KANA_MAP[char];
      i += 1;
    } else {
      result += char;
      i += 1;
    }
  }
  return result.toLowerCase();
}

let currentManualSong = null;

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function initLookupTab() {
  const filterIds = [
    "lk-category", "lk-diff", "lk-version", "lk-artist", 
    "lk-title", "lk-min-level", "lk-max-level", "lk-type", 
    "lk-charter", "lk-min-bpm", "lk-max-bpm"
  ];

  filterIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const eventType = el.tagName === "INPUT" ? "input" : "change";
    el.addEventListener(eventType, applyLookupFilters);
  });

  // Modal events
  const closeBtn = document.getElementById("manual-modal-close");
  const overlayBtn = document.getElementById("manual-modal-overlay-btn");
  const modal = document.getElementById("manual-score-modal");
  
  function closeManualModal() {
    modal.classList.add("hidden");
    currentManualSong = null;
  }
  
  if (closeBtn) closeBtn.addEventListener("click", closeManualModal);
  if (overlayBtn) overlayBtn.addEventListener("click", closeManualModal);

  const submitBtn = document.getElementById("manual-submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", saveManualPlayRecord);
  }

  // Populate dynamic dropdown options from the songs database
  populateLookupFilters();

  // Initial render of lists
  renderRecentChecked();
  renderRecentPlayed();
  
  // Initial results render (show some defaults or ALL if no query)
  applyLookupFilters();
}

function populateLookupFilters() {
  const categorySelect = document.getElementById("lk-category");
  const versionSelect = document.getElementById("lk-version");
  const charterSelect = document.getElementById("lk-charter");

  if (!categorySelect || !versionSelect || !charterSelect) return;

  const categories = new Set();
  const versions = new Set();
  const charters = new Set();

  for (const song of allSongsList) {
    if (song.category) categories.add(song.category);
    for (const sheet of song.sheets || []) {
      if (sheet.version) versions.add(sheet.version);
      if (sheet.charter) charters.add(sheet.charter);
    }
  }

  // Populate Categories
  categorySelect.innerHTML = `<option value="ALL">ALL</option>`;
  Array.from(categories).sort().forEach(cat => {
    categorySelect.add(new Option(cat, cat));
  });

  // Populate Versions
  versionSelect.innerHTML = `<option value="ALL">ALL</option>`;
  Array.from(versions).sort((a, b) => getVersionRank(b) - getVersionRank(a)).forEach(ver => {
    versionSelect.add(new Option(ver, ver));
  });

  // Populate Charters
  charterSelect.innerHTML = `<option value="ALL">ALL</option>`;
  Array.from(charters).sort().forEach(charter => {
    charterSelect.add(new Option(charter, charter));
  });
}

function applyLookupFilters() {
  const resultsContainer = document.getElementById("lookup-results");
  const countBadge = document.getElementById("lookup-results-count");
  if (!resultsContainer) return;

  const category = document.getElementById("lk-category").value;
  const diff = document.getElementById("lk-diff").value;
  const version = document.getElementById("lk-version").value;
  const artist = document.getElementById("lk-artist").value.trim().toLowerCase();
  const title = document.getElementById("lk-title").value.trim().toLowerCase();
  const minLvl = parseFloat(document.getElementById("lk-min-level").value);
  const maxLvl = parseFloat(document.getElementById("lk-max-level").value);
  const type = document.getElementById("lk-type").value;
  const charter = document.getElementById("lk-charter").value;
  const minBpm = parseInt(document.getElementById("lk-min-bpm").value, 10);
  const maxBpm = parseInt(document.getElementById("lk-max-bpm").value, 10);

  const titleRomaji = toRomaji(title);
  const artistRomaji = toRomaji(artist);

  // If no filters are active at all, show hint to avoid massive dom rendering
  const filtersActive = category !== "ALL" || diff !== "ALL" || version !== "ALL" || 
                        artist || title || minLvl > 1.0 || maxLvl < 15.0 || 
                        type !== "ALL" || charter !== "ALL" || !isNaN(minBpm) || !isNaN(maxBpm);

  if (!filtersActive && allSongsList.length > 0) {
    resultsContainer.innerHTML = `<p class="lookup-hint-text">Adjust any filters above to start searching & filtering constants...</p>`;
    if (countBadge) countBadge.textContent = "0";
    return;
  }

  const results = allSongsList.filter(song => {
    // 1. Title match (Romaji & Acronyms)
    if (title) {
      const sTitleRomaji = toRomaji((song.title || "").toLowerCase());
      const acronymMatch = (song.searchAcronyms || []).some(acr => 
        (acr || "").toLowerCase().includes(title)
      );
      if (!sTitleRomaji.includes(titleRomaji) && !acronymMatch) return false;
    }

    // 2. Artist match (Romaji)
    if (artist) {
      const sArtistRomaji = toRomaji((song.artist || "").toLowerCase());
      if (!sArtistRomaji.includes(artistRomaji)) return false;
    }

    // 3. Category match
    if (category !== "ALL" && song.category !== category) return false;

    // 4. BPM match
    if (!isNaN(minBpm) && (song.bpm || 0) < minBpm) return false;
    if (!isNaN(maxBpm) && (song.bpm || 0) > maxBpm) return false;

    // 5. Sheet specific criteria
    const hasMatchingSheet = (song.sheets || []).some(sheet => {
      // Difficulty check
      if (diff !== "ALL" && (sheet.difficulty || "").toLowerCase() !== diff.toLowerCase()) return false;

      // Level check
      const sheetLvl = sheet.internalLevelValue || parseLevel(sheet.level || "0");
      if (sheetLvl < (minLvl - 0.0001) || sheetLvl > (maxLvl + 0.0001)) return false;

      // Type check
      if (type !== "ALL") {
        const isDX = (sheet.type || "").toLowerCase() === "dx";
        if (type === "DX" && !isDX) return false;
        if (type === "Standard" && isDX) return false;
      }

      // Notes Designer (Charter) check
      if (charter !== "ALL" && sheet.charter !== charter) return false;

      // Version check
      if (version !== "ALL" && sheet.version !== version) return false;

      return true;
    });

    if (!hasMatchingSheet) return false;

    return true;
  });

  const displayedResults = results.slice(0, 40);
  if (countBadge) {
    countBadge.textContent = results.length > 40 ? `40+ of ${results.length}` : `${results.length}`;
  }

  if (displayedResults.length === 0) {
    resultsContainer.innerHTML = `<p class="lookup-hint-text">No songs matched your advanced search criteria.</p>`;
    return;
  }

  let html = "";
  for (const song of displayedResults) {
    const artSrc = song.imageName ? jacketUrl(song.imageName) : "";
    const artHtml = artSrc
      ? `<img class="lookup-card-art" src="${artSrc}" loading="lazy" onerror="this.style.visibility='hidden'">`
      : `<div class="lookup-card-art lookup-card-art-empty"></div>`;

    const diffsOrder = ["basic", "advanced", "expert", "master", "remaster"];
    const diffLabels = { basic: "BSC", advanced: "ADV", expert: "EXP", master: "MAS", remaster: "REM" };
    const diffColors = { basic: "#22c55e", advanced: "#f59e0b", expert: "#ef4444", master: "#a855f7", remaster: "#ec4899" };

    let sheetsHtml = `<div class="lookup-card-sheets">`;
    const sheetsMap = {};
    for (const sheet of song.sheets || []) {
      const diffLower = (sheet.difficulty || "").toLowerCase();
      sheetsMap[diffLower] = sheet;
    }

    for (const d of diffsOrder) {
      const sheet = sheetsMap[d];
      if (sheet) {
        const lv = sheet.level || "";
        const constant = sheet.internalLevelValue ? sheet.internalLevelValue.toFixed(1) : "?";
        const label = diffLabels[d];
        const color = diffColors[d];
        const titleEsc = encodeURIComponent(song.title);
        const diffEsc = encodeURIComponent(sheet.difficulty);
        const imageEsc = encodeURIComponent(song.imageName || "");
        sheetsHtml += `
          <div class="lookup-diff-badge" style="border-color: ${color};" onclick="event.stopPropagation(); triggerPlayModal('${titleEsc}', '${diffEsc}', ${sheet.internalLevelValue || 0}, '${imageEsc}')">
            <span class="l-diff-name" style="background: ${color};">${label}</span>
            <span class="l-diff-val">${constant} <span class="l-diff-lv">(${lv})</span></span>
          </div>`;
      }
    }
    sheetsHtml += `</div>`;

    const songTitleEsc = encodeURIComponent(song.title);
    const songImageEsc = encodeURIComponent(song.imageName || "");
    html += `
      <div class="lookup-card" onclick="addToRecentChecked('${songTitleEsc}', '${songImageEsc}')">
        <div class="lookup-card-top">
          ${artHtml}
          <div class="lookup-card-info">
            <span class="lookup-card-name" title="${escapeHtml(song.title)}">${song.title}</span>
            <span class="lookup-card-artist" title="${escapeHtml(song.artist || "")}">${song.artist || "Unknown Artist"}</span>
            <span class="lookup-card-cat">${song.category || ""}</span>
          </div>
        </div>
        ${sheetsHtml}
      </div>`;
  }
  resultsContainer.innerHTML = html;
}

function addToRecentChecked(titleEncoded, imageNameEncoded) {
  const title = decodeURIComponent(titleEncoded);
  const imageName = decodeURIComponent(imageNameEncoded);

  // Remove existing
  recentChecked = recentChecked.filter(x => x.title !== title);
  // Put at start
  recentChecked.unshift({ title, imageName });
  // Limit to 10
  if (recentChecked.length > 10) recentChecked.pop();

  localStorage.setItem("recentChecked", JSON.stringify(recentChecked));
  renderRecentChecked();
}

function renderRecentChecked() {
  const container = document.getElementById("lookup-recent-checked");
  if (!container) return;

  if (recentChecked.length === 0) {
    container.innerHTML = `<p class="lookup-hint-text">No songs viewed recently.</p>`;
    return;
  }

  let html = "";
  for (const item of recentChecked) {
    const artSrc = item.imageName ? jacketUrl(item.imageName) : "";
    const artHtml = artSrc
      ? `<img class="lookup-recent-art" src="${artSrc}" loading="lazy">`
      : `<div class="lookup-recent-art lookup-recent-art-empty"></div>`;

    html += `
      <div class="lookup-recent-item" onclick="document.getElementById('lookup-search').value = '${escapeHtml(item.title)}'; searchSongs('${escapeHtml(item.title)}');">
        ${artHtml}
        <span class="lookup-recent-name" title="${escapeHtml(item.title)}">${item.title}</span>
      </div>`;
  }
  container.innerHTML = html;
}

function triggerPlayModal(titleEncoded, diffEncoded, constant, imageNameEncoded) {
  const title = decodeURIComponent(titleEncoded);
  const difficulty = decodeURIComponent(diffEncoded);
  const imageName = decodeURIComponent(imageNameEncoded);

  currentManualSong = { title, difficulty, constant, imageName };

  document.getElementById("manual-song-title").textContent = title;
  
  const diffSelect = document.getElementById("manual-diff");
  if (diffSelect) {
    diffSelect.innerHTML = `<option value="${difficulty}">${difficulty} (Constant: ${constant.toFixed(1)})</option>`;
  }

  // Default values
  document.getElementById("manual-acc").value = "";
  document.getElementById("manual-clear").value = "0";

  document.getElementById("manual-score-modal").classList.remove("hidden");
}

function saveManualPlayRecord() {
  if (!currentManualSong) return;

  const accInput = document.getElementById("manual-acc");
  const acc = parseFloat(accInput.value);
  if (isNaN(acc) || acc < 0 || acc > 101) {
    alert("Please enter a valid achievement rate between 0% and 101%.");
    return;
  }

  const clearType = parseInt(document.getElementById("manual-clear").value, 10);
  const baseRating = getRating(currentManualSong.constant, acc);
  const apBonus = AP_CLEAR_TYPES.has(clearType) ? 1 : 0;
  const rating = baseRating + apBonus;

  // Add play record
  const record = {
    title: currentManualSong.title,
    difficulty: currentManualSong.difficulty,
    constant: currentManualSong.constant,
    imageName: currentManualSong.imageName,
    accuracy: acc,
    clearType: clearType,
    rating: rating,
    timestamp: Date.now()
  };

  // Remove existing play of same song+diff to keep best/recent
  recentPlayed = recentPlayed.filter(x => !(x.title === record.title && x.difficulty === record.difficulty));
  recentPlayed.unshift(record);
  if (recentPlayed.length > 20) recentPlayed.pop(); // keep last 20

  localStorage.setItem("recentPlayed", JSON.stringify(recentPlayed));
  renderRecentPlayed();

  // Close modal
  document.getElementById("manual-score-modal").classList.add("hidden");
  currentManualSong = null;
}

function renderRecentPlayed() {
  const container = document.getElementById("lookup-recent-played");
  if (!container) return;

  if (recentPlayed.length === 0) {
    container.innerHTML = `<p class="lookup-hint-text">No recently played songs recorded yet.</p>`;
    return;
  }

  const diffColors = { Basic: "#22c55e", Advanced: "#f59e0b", Expert: "#ef4444", Master: "#a855f7", "Re:Master": "#ec4899" };
  let html = "";
  for (const item of recentPlayed) {
    const artSrc = item.imageName ? jacketUrl(item.imageName) : "";
    const artHtml = artSrc
      ? `<img class="lookup-recent-art" src="${artSrc}" loading="lazy">`
      : `<div class="lookup-recent-art lookup-recent-art-empty"></div>`;

    const color = diffColors[item.difficulty] || "#7c5cbf";
    const clearStr = item.clearType ? CLEAR_LABELS[item.clearType] || "" : "";
    const clearHtml = clearStr ? clearImg(clearStr, 14) : "";
    const rankLabel = getRankLabel(item.accuracy);

    html += `
      <div class="lookup-recent-item played">
        ${artHtml}
        <div class="lookup-recent-played-info">
          <span class="lookup-recent-name" title="${escapeHtml(item.title)}">${item.title}</span>
          <div class="lookup-recent-played-meta">
            <span class="l-played-diff" style="color: ${color};">${item.difficulty}</span>
            <span class="l-played-acc">${item.accuracy.toFixed(4)}%</span>
            <span class="l-played-rank">${rankImg(rankLabel, 14)}${clearHtml}</span>
            <span class="l-played-rating">+${item.rating}</span>
          </div>
        </div>
      </div>`;
  }
  container.innerHTML = html;
}

// ── Theme Setup ──────────────────────────────────────────────────────────────


function setupTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  if (!toggleBtn || !sunIcon || !moonIcon) return;

  // Read theme from localStorage or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (savedTheme === "light") {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "light") {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    } else {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    }
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  setupTheme();
  setupEvents();
  await fetchChartData();
}

init();
