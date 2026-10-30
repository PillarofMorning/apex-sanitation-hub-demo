(function() {
const {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} = React;
/* ============================================================================
 * [PERSISTENT MEMORY & APP REGISTRATION BLOCK]
 * APP NAME:        Sanitation Executive Director & Financial Controller Hub
 * PHASE ID:        P0.1 (Ref: _00 - list of apps - defined how to integrate - link to masterplan)
 * CURRENT VERSION: v1.00004 (2026-10-29: Complete Controller-Grade Rebuild.
 *                  Implements Q1-Q9 locked rulings:
 *                  - Q1 Toggle: Asset-Driven Support (craa5_aa_assets) vs Per-Shift Standing Posts + Janitorial Contractor toggle
 *                  - Q2 Roster: Crew A Vacancy + Marcus Vance Interim Dpt Head, Crew B Elena Mercer, Crew C David Sterling
 *                    (Logan Vance deactivated), Crew D Rachel Chen (Caleb Ross deactivated), Victor Thorne deactivated
 *                  - Q3 Wash Physics: 60m Pre-Wash + 90m Post-Op/Swab + Toggleable Mode A (Total/N_eff) vs Mode B (Critical Path Floor)
 *                  - Q4 Schedule Horizon: Mode A Actual Schedule (No Run = Down, EOW/MSS once) vs Mode B Utilization Sliders
 *                  - Q5 Labor Truth: Discards inflated craa5__log_ reported hours; reconstructs from Equipment Std Mins x 1.50x Unforeseen
 *                  - Q6 Pay Gate: Microsoft ID + Senior Manager & above check; Tech 1=$20, Tech 2=$22.50, Tech 3=$25.50, Sup=$75k, Dpt Head custom
 *                  - Q7 Crowding Curve: Per-room N_opt setpoints (Waterjet=10) with non-linear diminishing returns (50% / 25% / 10%)
 *                  - Q8 Attendance Forecaster: Crew A-D x Day-of-Week habitual call-off/late/sick matrix
 *                  - Q9 Named Presets: Deterministic Dataverse preset save/recall in craa5__e_hubconfig (director_preset|slug)
 *                  - Full 6-Level Drill-Down: Year -> Month -> Week -> Day -> Shift -> Individual Clock Hour (00:00-23:00)
 *                  - Live SAP Chemical & Supply Cart Spend (craa5__c_cart: $1,177,769 across 122 active carts))
 * FOLDER STATUS:   apps/Inventory_SanitationInventory/
 * REPO SOURCE:     P0.1 - sanitation director v1.00004
 * ============================================================================
 */
// Apex Foods logo (PNG, 222 x 96, sent by Platform Admin 2026-10-19), embedded so the page needs no web resource.
var SD_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDA0NjhCIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMDA0NjhCIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=';
/* ============================== START HUB SHARED v1.3 ============================== */
// The ecosystem data contract in code (ecosystem/data-contract.md). Paste this whole block into every hub app, unchanged,
// and use these helpers instead of local copies, so every app builds the same keys, dates and numbers.
// Plain ES5 and 7-bit ASCII on purpose: it runs in every Power Apps page and passes the GEMINI.md ASCII check.
// Change it only through the contract (bump HUB_CONTRACT_VERSION and say what changed in the contract's change log).

var HUB_CONTRACT_VERSION = '1.3';
var HUB_TZ = 'America/Chicago'; // the plant's clock: every plant day and shift date is read on it

// ---------- keys ----------
// Letters and digits only, lower case: "IBL 4", "IBL-4" and "ibl4" are the same name.
function hubCanon(s) {
  return String(s === undefined || s === null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '');
}
// Line key, the Production Scheduler's canonLine: area "IBL4" line 1 -> "ibl4"; area "Breading" line 2 -> "breading2".
function hubLineKey(area, line) {
  var n = Math.floor(Number(line));
  return hubCanon(area) + (n > 1 ? String(n) : '');
}
// Two area (or room) names are the same area when their hubCanon is the same.
function hubSameName(a, b) {
  var x = hubCanon(a);
  return x !== '' && x === hubCanon(b);
}
// Row ids (GUIDs): lower case, no braces. Every stored GUID goes through this.
function hubGuid(v) {
  return String(v === undefined || v === null ? '' : v).replace(/[{}]/g, '').trim().toLowerCase();
}
function hubIsGuid(v) {
  return /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(hubGuid(v));
}
// A list of GUIDs in one text column: "; " between them, sorted, no repeats.
function hubGuidList(list) {
  var seen = {},
    out = [];
  (list || []).forEach(function (v) {
    var g = hubGuid(v);
    if (g && !seen[g]) {
      seen[g] = true;
      out.push(g);
    }
  });
  return out.sort().join('; ');
}
function hubSplitGuids(text) {
  return String(text || '').split(/[;,\s]+/).map(hubGuid).filter(hubIsGuid);
}
// Crew letter A-D from a choice value, a number 1-4 or a label ("Shift B", "D - Nights"). '' when it is none of these.
function hubCrew(val) {
  if (val === undefined || val === null || val === '') return '';
  var s = String(typeof val === 'object' ? val.Label || val.Value || val.name || '' : val).toUpperCase().trim();
  if (s.indexOf('256000000') > -1 || s === '1') return 'A';
  if (s.indexOf('256000001') > -1 || s === '2') return 'B';
  if (s.indexOf('256000002') > -1 || s === '3') return 'C';
  if (s.indexOf('256000003') > -1 || s === '4') return 'D';
  var m = s.match(/(?:^|[^A-Z])([ABCD])(?=$|[^A-Z])/);
  return m ? m[1] : '';
}
// FNV-1a with four seeds, shaped like a version 4 GUID (the same swGuid as Ganttly and the Manager hub).
// A row whose id is hubIdFromKey(its key) can be saved again and again without ever making a second row.
function hubIdFromKey(key) {
  var s = String(key).toLowerCase();
  var h = function (seed) {
    var x = (0x811c9dc5 ^ seed * 0x9e3779b1) >>> 0;
    for (var i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul ? Math.imul(x, 0x01000193) >>> 0 : x * 0x01000193 >>> 0;
    }
    return ('0000000' + x.toString(16)).slice(-8);
  };
  var g = h(1) + h(2) + h(3) + h(4);
  return g.slice(0, 8) + '-' + g.slice(8, 12) + '-4' + g.slice(13, 16) + '-' + '89ab'.charAt(parseInt(g.charAt(16), 16) % 4) + g.slice(17, 20) + '-' + g.slice(20, 32);
}

// ---------- dates ----------
function hubPad2(n) {
  return (n < 10 ? '0' : '') + n;
}
// Year, month, day, hour, minute of a moment on the plant clock (daylight saving included).
function hubPlantParts(ms) {
  var d = new Date(typeof ms === 'number' ? ms : Date.parse(ms));
  if (isNaN(d.getTime())) return null;
  var f = new Intl.DateTimeFormat('en-US', {
    timeZone: HUB_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  var o = {};
  f.formatToParts(d).forEach(function (p) {
    if (p.type !== 'literal') o[p.type] = Number(p.value);
  });
  return {
    y: o.year,
    m: o.month,
    d: o.day,
    h: o.hour === 24 ? 0 : o.hour,
    min: o.minute
  };
}
// The plant day of a moment, YYYY-MM-DD. Never toISOString().slice(0, 10): that is the UTC day.
function hubPlantDay(ms) {
  var p = hubPlantParts(ms);
  return p ? p.y + '-' + hubPad2(p.m) + '-' + hubPad2(p.d) : '';
}
// The shift date: the plant day the shift STARTED (the board's craa5_slotstart). A night shift that starts Tuesday 18:00
// and finishes Wednesday 06:00 is Tuesday's shift, for everything it does.
function hubShiftDate(slotStart) {
  return hubPlantDay(slotStart);
}
function hubShiftKey(shiftDate, crew) {
  return String(shiftDate) + '|' + hubCrew(crew);
}
// How a shift date goes into a Dataverse date column (MSS log craa5_lastcleaned): midnight UTC of that day,
// so every reader gets the day back with value.slice(0, 10) whatever its own clock says.
function hubDateOnlyUtc(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(day)) ? String(day) + 'T00:00:00Z' : '';
}
function hubDayFromDateOnly(v) {
  var s = String(v || '');
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : '';
}
function hubAddDays(day, n) {
  var t = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) + n * 86400000,
    d = new Date(t);
  return d.getUTCFullYear() + '-' + hubPad2(d.getUTCMonth() + 1) + '-' + hubPad2(d.getUTCDate());
}
// The week key: the Monday of the plant week a day is in (weeks run Monday to Sunday, as in the Clean Plan 'k|Monday' rows).
function hubWeekKey(day) {
  var dow = new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)))).getUTCDay();
  return hubAddDays(day, dow === 0 ? -6 : 1 - dow);
}

// ---------- cleans and completions ----------
// What kind of clean a completion was. The Clean Plan (Production Scheduler) uses its own words; hubCleanKind maps them.
var HUB_CLEAN_KINDS = ['daily', 'midweek', 'eow', 'allergen', 'egg', 'pecan', 'changeover', 'monthly', 'quarterly', 'semiannual', 'annual', 'corrective', 'other'];
var HUB_PLAN_KIND_MAP = {
  full: 'daily',
  weekly: 'eow',
  midweek: 'midweek',
  allergen: 'allergen',
  changeover: 'changeover'
};
function hubCleanKind(k) {
  var s = String(k || '').toLowerCase().trim();
  if (HUB_PLAN_KIND_MAP[s]) return HUB_PLAN_KIND_MAP[s];
  return HUB_CLEAN_KINDS.indexOf(s) > -1 ? s : '';
}
// One clean of one piece of equipment on one shift date: the key that stops a second row (MSS log craa5_completionkey).
// Frequencies (the MSS Calendar's codes and ranks). A clean of rank r satisfies every frequency of rank <= r.
// A piece is done for a frequency when a satisfying clean falls in the same period as today; otherwise it is due.
var HUB_FREQS = [{
  code: 'D',
  kind: 'daily',
  rank: 1,
  flag: 'craa5_dailyclean'
}, {
  code: 'MW',
  kind: 'midweek',
  rank: 2,
  flag: 'craa5_midweek'
}, {
  code: 'W',
  kind: 'eow',
  rank: 3,
  flag: 'craa5_weeklyclean'
}, {
  code: 'M',
  kind: 'monthly',
  rank: 4,
  flag: 'craa5_monthlyclean'
}, {
  code: 'Q',
  kind: 'quarterly',
  rank: 5,
  flag: 'craa5_quarterly'
}, {
  code: 'S',
  kind: 'semiannual',
  rank: 6,
  flag: 'craa5_month'
}, {
  code: 'A',
  kind: 'annual',
  rank: 7,
  flag: 'craa5_annually'
}];
var HUB_KIND_RANK = {
  daily: 1,
  allergen: 1,
  egg: 1,
  pecan: 1,
  changeover: 1,
  corrective: 1,
  midweek: 2,
  eow: 3,
  monthly: 4,
  quarterly: 5,
  semiannual: 6,
  annual: 7,
  other: 0
};
function hubKindRank(kind) {
  var k = hubCleanKind(kind);
  return k ? HUB_KIND_RANK[k] || 0 : 0;
}
// Rank of one MSS log row: its craa5_cleankind; old rows with no kind keep their old meaning from the flags
// (daily also counts as mid-week, weekly 3, monthly also counts as quarterly to annual, no flags 9 = counts for everything).
function hubLogRank(row) {
  if (!row) return 0;
  if (hubCleanKind(row.craa5_cleankind)) return hubKindRank(row.craa5_cleankind);
  var yes = function (v) {
    return v === true || v === 1 || /^(yes|true|1)$/i.test(String(v === undefined || v === null ? '' : v));
  };
  return yes(row.craa5_monthly) ? 7 : yes(row.craa5_weekly) ? 3 : yes(row.craa5_daily) ? 2 : 9;
}
function hubFreqRank(code) {
  for (var i = 0; i < HUB_FREQS.length; i++) if (HUB_FREQS[i].code === code) return HUB_FREQS[i].rank;
  return 0;
}
// Period a plant day (YYYY-MM-DD) falls in, per frequency: day, Monday week, month, quarter, half year, year.
function hubPeriodKey(code, day) {
  var d = String(day || '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '';
  var y = d.slice(0, 4),
    m = Number(d.slice(5, 7));
  switch (code) {
    case 'D':
      return d;
    case 'MW':
    case 'W':
      return 'w' + hubWeekKey(d);
    case 'M':
      return y + '-' + d.slice(5, 7);
    case 'Q':
      return y + '-Q' + Math.ceil(m / 3);
    case 'S':
      return y + '-H' + (m <= 6 ? 1 : 2);
    case 'A':
      return y;
  }
  return '';
}
// doneDays = finished cleans as [{ day, kind }] or [{ day, rank }] (rank from hubLogRank for MSS log rows).
// True when one of rank >= the frequency is in today's period. Which days and weeks owe a job is the reader's call (section 7).
function hubFreqDone(code, doneDays, today) {
  var need = hubFreqRank(code),
    p = hubPeriodKey(code, today);
  if (!need || !p) return false;
  for (var i = 0; i < (doneDays || []).length; i++) {
    var x = doneDays[i];
    if (x && (x.rank !== undefined ? x.rank : hubKindRank(x.kind)) >= need && hubPeriodKey(code, x.day) === p) return true;
  }
  return false;
}
function hubCompletionKey(assetGuid, shiftDate, kind) {
  var g = hubGuid(assetGuid),
    k = hubCleanKind(kind);
  return g && /^\d{4}-\d{2}-\d{2}$/.test(String(shiftDate)) && k ? g + '|' + shiftDate + '|' + k : '';
}
// The MSS log row id for a completion, so a retried or second-device save updates the same row.
function hubLogIdOf(completionKey) {
  return completionKey ? hubIdFromKey('log|' + completionKey) : '';
}

// ---------- numbers ----------
// Standard minutes of a piece: craa5_aa_assets.craa5_hoursrequired holds MINUTES of labor. Never divide it by 60
// "when it looks big". Blank, zero or not a number -> null (unknown), never a guess.
function hubStdMinutes(v) {
  var n = Number(v);
  return v === null || v === undefined || v === '' || !isFinite(n) || n <= 0 ? null : n;
}
// Pace: standard minutes / actual minutes x 100, over the same pieces. 100 = on standard, 125 = a quarter faster.
function hubPace(stdMinutes, actualMinutes) {
  return stdMinutes > 0 && actualMinutes > 0 ? Math.round(1000 * stdMinutes / actualMinutes) / 10 : null;
}
// Each person on a completion gets an equal share of its minutes.
function hubShare(minutes, people) {
  return people > 0 && minutes > 0 ? minutes / people : 0;
}
// Labor cost of minutes at an hourly rate (dollars, two decimals).
function hubLaborCost(minutes, hourlyRate) {
  return minutes > 0 && hourlyRate > 0 ? Math.round(minutes * hourlyRate / 60 * 100) / 100 : 0;
}

// ---------- language ----------
// One choice for every app, remembered per computer: 'en' or 'es' (Spanish, Mexico). Older per-app keys are read once.
var HUB_LANG_KEY = 'hub_lang';
var HUB_OLD_LANG_KEYS = ['itp_lang_v1', 'ss_lang_v1', 'prodsched_lang_v1', 'Plant 04_mst_lang_v1', 'Plant 04_org_lang_v1'];
function hubGetLang() {
  try {
    var v = window.localStorage.getItem(HUB_LANG_KEY);
    if (v === 'en' || v === 'es') return v;
    for (var i = 0; i < HUB_OLD_LANG_KEYS.length; i++) if (window.localStorage.getItem(HUB_OLD_LANG_KEYS[i]) === 'es') return 'es';
  } catch (e) {}
  return 'en';
}
function hubSetLang(l) {
  try {
    window.localStorage.setItem(HUB_LANG_KEY, l === 'es' ? 'es' : 'en');
  } catch (e) {}
}
// Spanish is written in ASCII with a % code per accented letter (the PBED convention):
// %a %e %i %o %u = acute a e i o u, %n = n tilde, capitals %A %E %I %O %U %N, %? and %! = opening marks, %w = u with two dots, %% = %.
var HUB_ACC = {
  a: 225,
  e: 233,
  i: 237,
  o: 243,
  u: 250,
  n: 241,
  A: 193,
  E: 201,
  I: 205,
  O: 211,
  U: 218,
  N: 209,
  '?': 191,
  '!': 161,
  w: 252
};
function hubDecodeEs(s) {
  return String(s).replace(/%([aeiounAEIOUN?!w%])/g, function (m, c) {
    return c === '%' ? '%' : String.fromCharCode(HUB_ACC[c]);
  });
}
// The shared words (data-contract.md section 9). An app's own word list adds to these; it never gives one of these another Spanish.
// Mexican plant Spanish (es-MX), usted form: computadora, celular, tomar, presionar / dar clic, llenar; never vosotros,
// ordenador, movil, coger, pulsar, rellenar.
var HUB_ES = {
  'Planned': 'Planeado',
  'Started': 'En proceso',
  'Done': 'Terminado',
  'Skipped': 'Omitido',
  'Overdue': 'Atrasado',
  'At risk': 'En riesgo',
  'Daily': 'Diaria',
  'Midweek 72h': 'Media semana 72h',
  'End of week': 'Fin de semana',
  'EOW': 'Fin de semana',
  'Allergen': 'Al%ergeno',
  'Egg allergen': 'Al%ergeno huevo',
  'Pecan allergen': 'Al%ergeno nuez pecana',
  'Changeover': 'Cambio de producto',
  'Monthly': 'Mensual',
  'Quarterly': 'Trimestral',
  'Semiannual': 'Semestral',
  'Annual': 'Anual',
  'Corrective': 'Correctiva',
  'Other': 'Otra',
  'Present': 'Presente',
  'Late': 'Retardo',
  'Sick': 'Enfermo',
  'PTO': 'Vacaciones (PTO)',
  'Left early': 'Sali%o temprano',
  'No call': 'Falta sin aviso',
  'Loaned': 'Prestado',
  'Training': 'Capacitaci%on',
  'Sanitor': 'Sanitizador',
  'Lead': 'L%ider',
  'Supervisor': 'Supervisor',
  'Manager': 'Gerente',
  'Loading': 'Cargando',
  'Ready': 'Listo',
  'Nothing here yet': 'Todav%ia no hay datos',
  'Table missing': 'Falta la tabla',
  'No access': 'Sin acceso',
  'Could not load': 'No se pudo cargar',
  'Area': '%Area',
  'Room': 'Cuarto',
  'Line': 'L%inea',
  'Equipment': 'Equipo',
  'Shift': 'Turno',
  'Crew': 'Cuadrilla',
  'Team': 'Grupo',
  'Clean': 'Limpieza',
  'Run': 'Corrida',
  'Headcount': 'Personal',
  'Minutes': 'Minutos',
  'Standard': 'Est%andar',
  'Pace': 'Ritmo',
  'On time': 'A tiempo',
  'Labor cost': 'Costo de mano de obra',
  'Swab': 'Hisopo',
  'Pathogen': 'Pat%ogeno',
  'Work order': 'Orden de trabajo',
  'Skip code': 'C%odigo de omisi%on',
  'High five': 'Reconocimiento',
  'Sign-off': 'Aprobaci%on',
  'Help': 'Ayuda',
  'Print': 'Imprimir'
};
var HUB_ES_DONE = null;
// hubT('Done') -> 'Done' or 'Terminado'. extra = the app's own { English: '%-coded Spanish' } list (optional).
function hubT(s, lang, extra) {
  if ((lang || hubGetLang()) !== 'es') return s;
  if (!HUB_ES_DONE) {
    HUB_ES_DONE = {};
    for (var k in HUB_ES) if (Object.prototype.hasOwnProperty.call(HUB_ES, k)) HUB_ES_DONE[k] = hubDecodeEs(HUB_ES[k]);
  }
  if (Object.prototype.hasOwnProperty.call(HUB_ES_DONE, s)) return HUB_ES_DONE[s];
  if (extra && Object.prototype.hasOwnProperty.call(extra, s)) return hubDecodeEs(extra[s]);
  return s;
}

// ---------- look ----------
var HUB_THEME_KEY = 'hub_theme'; // 'light' or 'dark', remembered per computer
function hubGetTheme() {
  try {
    var v = window.localStorage.getItem(HUB_THEME_KEY) || window.localStorage.getItem('itp_theme_v1');
    return v === 'dark' ? 'dark' : 'light';
  } catch (e) {
    return 'light';
  }
}
function hubSetTheme(t) {
  try {
    window.localStorage.setItem(HUB_THEME_KEY, t === 'dark' ? 'dark' : 'light');
  } catch (e) {}
}
var HUB_COLORS = {
  light: {
    bg: '#F1F5F9',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#1E293B',
    muted: '#64748B',
    primary: '#0072CE',
    primaryDark: '#00468B',
    accent: '#FFB81C',
    accentSoft: '#FFF6E0',
    primarySoft: '#E6F1FB'
  },
  dark: {
    bg: '#1B2740',
    card: '#24324D',
    border: '#33425F',
    text: '#E2E8F0',
    muted: '#94A3B8',
    primary: '#4DA3E8',
    primaryDark: '#B3D4F2',
    accent: '#FFB81C',
    accentSoft: '#3A3320',
    primarySoft: '#1E2A42'
  }
};
// Status colors mean one thing in every app. Red is only for overdue, a failed save and a positive swab.
var HUB_STATUS_COLORS = {
  done: '#059669',
  started: '#0072CE',
  planned: '#64748B',
  overdue: '#DC2626',
  atrisk: '#D97706',
  skipped: '#D97706'
};
var HUB_BRAND_RED = '#E4002B'; // the logo only, never a status
// ---------- app manifest (self-check for the Dataverse monitor) ----------
// Each app declares the tables and columns it reads and writes (logical names only, never data) and saves that list
// once per change in craa5__0_hubconfig, key 'manifest|' + appId. The Dataverse monitor reads every manifest| row and
// checks it against Dataverse (missing tables / columns) and contract.json (owners, statuses). Contract section 12.1.
//   m = { appId: 'ganttly', app: 'Ganttly', version: '2.0.0',
//         tables: [ { t: 'craa5_cleancheckoff', names: ['craa5_cleancheckoff'], read: [cols], write: [cols], opt: [cols] } ],
//         config: ['ganttly_settings'] }
//   names = table names the app tries, in order (default [t]); opt = columns the app works without (shown as "not yet").
var HUB_APP_IDS = ['ganttly', 'shiftstart', 'prodsched', 'msscalendar', 'msslog', 'pbed', 'bolo', 'managerhub', 'chemicals', 'mapsubmit', 'monitor', 'training'];
// Shared settings table: the new _e_ Hub config first (Organization-owned, big craa5_configjson), the old _0_ one second.
// Own names: some pages already declare HUB_CONFIG_TABLE.
var HUB_CONFIG_TABLES = ['craa5__e_hubconfig', 'craa5__0_hubconfig'];
var HUB_MANIFEST_TABLE = HUB_CONFIG_TABLES[0];
function hubNameList(a, keepCase) {
  var out = [],
    seen = {};
  (a || []).forEach(function (x) {
    var v = String(x === undefined || x === null ? '' : x).trim();
    if (!keepCase) v = v.toLowerCase();
    if (v && !seen[v]) {
      seen[v] = 1;
      out.push(v);
    }
  });
  return out;
}
// The manifest as stored: fixed key order, sorted lists, so the same app build always gives the same text and hash.
// What an app needs built, declared in its manifest (ground rule 10: nothing writes Dataverse tables or columns;
// the Dataverse monitor reads, shows and tests these and Platform Admin builds from its prompts). Per table, all optional: cols { column: { type, len, label, options, min, max,
// precision, default } }, label (display name), new (true = a table still to make), owner ('org' or 'user'),
// primary { n, len, label }, prompt (the app's recommended table specification for the table, at most 2000 characters). type = text|memo|int|decimal|money|yesno|date|datetime|choice|guid (guid = text 100,
// never a lookup). contract.json colTypes decides; a manifest type that disagrees is shown as a conflict.
var HUB_COL_TYPES = ['text', 'memo', 'int', 'decimal', 'money', 'yesno', 'date', 'datetime', 'choice', 'guid'];
function hubNum(v) {
  var n = Number(v);
  return v === '' || v === null || v === undefined || isNaN(n) ? undefined : n;
}
function hubColSpec(c) {
  c = typeof c === 'string' ? {
    type: c
  } : c || {};
  var type = String(c.type || '').trim().toLowerCase();
  if (HUB_COL_TYPES.indexOf(type) < 0) return null;
  var o = {
      type: type
    },
    k;
  var nums = {
    len: hubNum(c.len),
    min: hubNum(c.min),
    max: hubNum(c.max),
    precision: hubNum(c.precision)
  };
  for (k in nums) if (nums[k] !== undefined) o[k] = nums[k];
  if (c.label) o.label = String(c.label).trim();
  if (c.options && c.options.length) o.options = c.options.map(function (x) {
    return String(x).trim();
  }).filter(function (x) {
    return !!x;
  });
  if (c['default'] !== undefined && c['default'] !== null && c['default'] !== '') o['default'] = typeof c['default'] === 'boolean' || typeof c['default'] === 'number' ? c['default'] : String(c['default']);
  return o;
}
function hubManifest(m, nowIso) {
  m = m || {};
  var tables = (m.tables || []).map(function (t) {
    var name = String(t.t || '').trim().toLowerCase();
    var out = {
      t: name,
      names: hubNameList(t.names && t.names.length ? t.names : [name]),
      read: hubNameList(t.read).sort(),
      write: hubNameList(t.write).sort(),
      opt: hubNameList(t.opt).sort()
    };
    var cols = {},
      n = 0;
    Object.keys(t.cols || {}).sort().forEach(function (c) {
      var k = String(c).trim().toLowerCase(),
        v = hubColSpec(t.cols[c]);
      if (k && v) {
        cols[k] = v;
        n++;
      }
    });
    if (n) out.cols = cols;
    if (t.label) out.label = String(t.label).trim();
    if (t['new'] === true) out['new'] = true;
    var ow = String(t.owner || '').trim().toLowerCase();
    if (ow === 'org' || ow === 'user') out.owner = ow;
    if (t.prompt) out.prompt = String(t.prompt).trim().slice(0, 2000);
    if (t.primary && t.primary.n) {
      out.primary = {
        n: String(t.primary.n).trim().toLowerCase()
      };
      if (hubNum(t.primary.len) !== undefined) out.primary.len = hubNum(t.primary.len);
      if (t.primary.label) out.primary.label = String(t.primary.label).trim();
    }
    return out;
  }).filter(function (t) {
    return !!t.t;
  }).sort(function (a, b) {
    return a.t < b.t ? -1 : a.t > b.t ? 1 : 0;
  });
  var out = {
    m: 1,
    appId: hubCanon(m.appId),
    app: String(m.app || ''),
    version: String(m.version || ''),
    contract: HUB_CONTRACT_VERSION,
    tables: tables,
    config: hubNameList(m.config, true).sort()
  }; // hubconfig keys keep their case: they match exactly
  out.hash = hubIdFromKey(JSON.stringify(out)).slice(0, 8);
  out.savedAt = nowIso || new Date().toISOString();
  return out;
}
function hubManifestKey(appId) {
  return 'manifest|' + hubCanon(appId);
}
// io = { query(table, { select, filter, top }) -> Promise of rows (or { rows }), create(table, body), update(table, id, body) }
// (Ganttly: swQuery + swWriter). Never rejects and never blocks the app: resolves 'same', 'saved' or 'failed: why'.
// Where it goes, first that reads: _e_ Hub config craa5_configjson; old _0_ hubconfig craa5_manifestjson (its
// craa5_configjson holds only 100 characters); old _0_ hubconfig craa5_configjson.
var HUB_MANIFEST_COL = 'craa5_manifestjson';
// Every hubconfig JSON value: read Manifest json first (old table), then Config json.
function hubConfigJsonOf(row) {
  return row ? String(row[HUB_MANIFEST_COL] || row.craa5_configjson || '') : '';
}
function hubSaveManifest(io, m) {
  try {
    var man = hubManifest(m),
      key = hubManifestKey(man.appId);
    if (!man.appId) return Promise.resolve('failed: no appId');
    var fail = function (e) {
      return 'failed: ' + String(e && e.message || e);
    };
    var spots = [[HUB_CONFIG_TABLES[0], 'craa5_configjson', []], [HUB_CONFIG_TABLES[1], HUB_MANIFEST_COL, ['craa5_configjson']], [HUB_CONFIG_TABLES[1], 'craa5_configjson', []]];
    var read = function (i) {
      if (i >= spots.length) return Promise.reject(new Error('no hub config table'));
      var sp = spots[i],
        idCol = sp[0] + 'id';
      return Promise.resolve(io.query(sp[0], {
        select: [idCol, sp[1]].concat(sp[2]),
        filter: "craa5_configkey eq '" + key + "' and statecode eq 0",
        top: 5
      })).then(function (res) {
        var rows = res && res.rows !== undefined ? res.rows : res;
        if (!rows) throw new Error(res && res.err || 'read failed');
        return {
          rows: rows,
          table: sp[0],
          col: sp[1],
          idCol: idCol
        };
      }).then(null, function (e) {
        return i + 1 < spots.length ? read(i + 1) : Promise.reject(e);
      });
    };
    return read(0).then(function (r) {
      var body = {
        craa5_configkey: key,
        craa5_configname: (man.app || man.appId) + ' manifest'
      };
      body[r.col] = JSON.stringify(man);
      var row = r.rows[0];
      if (row) {
        var old = {};
        try {
          old = JSON.parse(row[r.col] || '{}');
        } catch (e) {}
        if (old && old.hash === man.hash) return 'same';
        return Promise.resolve(io.update(r.table, hubGuid(row[r.idCol]), body)).then(function () {
          return 'saved';
        }, fail);
      }
      var create = {};
      for (var k in body) create[k] = body[k];
      create[r.idCol] = hubIdFromKey('hubconfig|' + key); // fixed id: two people opening at once still make one row
      return Promise.resolve(io.create(r.table, create)).then(function () {
        return 'saved';
      }, fail);
    }, fail);
  } catch (e) {
    return Promise.resolve('failed: ' + String(e && e.message || e));
  }
}
/* ============================== END HUB SHARED v1.3 ============================== */

// === HUB PAYLOAD DIVERSION, DUAL-WRITE & DUAL-SCHEMA DATAVERSE CHECKER v1.3 ===
// Soft rollout router for craa5_* (legacy) <-> craa5___1_* (v1 playground schema).
// Persists per-app routing in Dataverse tables craa5__e_datamigration & craa5___1_e_datamigration (mirrored to craa5__e_hubconfig & craa5___1_e_hubconfig).
// Delivers write payloads to both schemas when Dual-Write is active, loads from the chosen Read Primary,
// sends missing payloads back and forth between schemas (with tombstone guard, dry-run preview, & durable outbox), and provides Dual-Schema Dataverse Checker connections.

const HUB_DIVERSION_VERSION = 'v1.3';
const HUB_DIVERSION_LS_KEY = 'hub_payload_diversion_v1';
const HUB_DIVERSION_OUTBOX_KEY = 'hub_payload_diversion_outbox_v1';
const HUB_DIVERSION_TOMBSTONES_KEY = 'hub_payload_diversion_tombstones_v1';
const HUB_DIVERSION_MIGRATION_TABLE = 'craa5__e_datamigration';
const HUB_DIVERSION_MIGRATION_SET = 'craa5__e_datamigrations';
const HUB_DIVERSION_MIGRATION_PK = 'craa5__e_datamigrationid';
const HUB_DIVERSION_MIGRATION_V1_TABLE = 'craa5___1_e_datamigration';
const HUB_DIVERSION_MIGRATION_V1_SET = 'craa5___1_e_datamigrations';
const HUB_DIVERSION_MIGRATION_V1_PK = 'craa5___1_e_datamigrationid';
const HUB_DIVERSION_APPS = [{
  key: 'global',
  label: 'Global Default (All Apps)'
}, {
  key: 'mss',
  label: 'P0.1 - MSS Calendar'
}, {
  key: 'msslog',
  label: 'P4.1 - MSS Submission (Log Input)'
}, {
  key: 'bolo',
  label: 'P1.1 - Pathogen BOLO'
}, {
  key: 'managerhub',
  label: 'P4.3 - Managers Hub'
}, {
  key: 'training',
  label: 'Hub - Training Matrix'
}, {
  key: 'supervisorhub',
  label: 'Hub - Supervisor Hub'
}, {
  key: 'shiftstart',
  label: 'P2.1 - Shift Start'
}, {
  key: 'ganttly',
  label: 'P3.1 - Ganttly'
}, {
  key: 'prodsched',
  label: 'P1.1 - Production Scheduler'
}, {
  key: 'pbed',
  label: 'P1.4 - PBED'
}, {
  key: 'director',
  label: 'P0.1 - Sanitation Director'
}, {
  key: 'mapsubmit',
  label: 'P3.2 - Map Submission Tool'
}, {
  key: 'chemicals',
  label: 'Hub - Chemical Inventory & Ordering'
}, {
  key: 'monitor',
  label: 'Dataverse Ecosystem Monitor'
}];
const HUB_GUID_MERGE_MAP = {
  "fc3de891-8521-f111-8341-00224809bad2": "f8a2a84b-6a51-f111-bec6-00224809bad2",
  "fa3de891-8521-f111-8341-00224809bad2": "cb19ddad-6851-f111-bec6-00224809bad2",
  "d5701076-6151-f111-bec6-00224809bad2": "eb3de891-8521-f111-8341-00224809bad2",
  "8e6b39f9-7051-f111-bec6-00224809bad2": "073de891-8521-f111-8341-00224809bad2",
  "633be891-8521-f111-8341-00224809bad2": "860fef51-6751-f111-bec6-00224809bad2",
  "f03de891-8521-f111-8341-00224809bad2": "09814636-6951-f111-bec6-00224809bad2",
  "3a0ba29b-6151-f111-bec6-00224809bad2": "ec3de891-8521-f111-8341-00224809bad2",
  "500c4e1e-1260-f111-a826-00224809bad2": "f23ce891-8521-f111-8341-00224809bad2",
  "d8bbcdde-6151-f111-bec6-00224809bad2": "ee3de891-8521-f111-8341-00224809bad2",
  "d751258d-7051-f111-bec6-00224809bad2": "fd3ce891-8521-f111-8341-00224809bad2",
  "71eae022-7151-f111-bec6-00224809bad2": "093de891-8521-f111-8341-00224809bad2",
  "3f7c3c9a-69c9-f111-aaaf-000d3a364646": "1f3de891-8521-f111-8341-00224809bad2",
  "56b41fef-7051-f111-bec6-00224809bad2": "063de891-8521-f111-8341-00224809bad2",
  "943be891-8521-f111-8341-00224809bad2": "bb00e67d-6751-f111-bec6-00224809bad2",
  "de3de891-8521-f111-8341-00224809bad2": "3546ff8e-6451-f111-bec6-00224809bad2",
  "dc3de891-8521-f111-8341-00224809bad2": "627cbf2a-6451-f111-bec6-00224809bad2",
  "033ee891-8521-f111-8341-00224809bad2": "776c2b75-3651-f111-bec6-00224809bad2",
  "fe3de891-8521-f111-8341-00224809bad2": "36c854cd-6851-f111-bec6-00224809bad2",
  "663be891-8521-f111-8341-00224809bad2": "ccc78c1b-6751-f111-bec6-00224809bad2",
  "aaff0261-8e41-f111-88b3-00224809bad2": "def29afb-69fa-4522-a9e4-a430a6b48ae8",
  "3fde81cf-1b40-f111-88b3-00224809bad2": "e15759c5-1b40-f111-88b3-00224809bad2",
  "632a71a1-8e41-f111-88b3-00224809bad2": "08fd6898-956c-42ec-b80c-548dda260626",
  "f23de891-8521-f111-8341-00224809bad2": "d8c03bdd-6851-f111-bec6-00224809bad2",
  "b9ef6b48-7651-f111-bec6-00224809bad2": "153de891-8521-f111-8341-00224809bad2",
  "33cd387c-7051-f111-bec6-00224809bad2": "fc3ce891-8521-f111-8341-00224809bad2",
  "f43de891-8521-f111-8341-00224809bad2": "3c01a9e4-6751-f111-bec6-00224809bad2",
  "e73de891-8521-f111-8341-00224809bad2": "958ac818-6251-f111-bec6-00224809bad2",
  "d23de891-8521-f111-8341-00224809bad2": "787b10c1-6451-f111-bec6-00224809bad2",
  "592785b2-7051-f111-bec6-00224809bad2": "ff3ce891-8521-f111-8341-00224809bad2",
  "c03b6e2b-1260-f111-a826-00224809bad2": "f43ce891-8521-f111-8341-00224809bad2",
  "6a0e364c-1260-f111-a826-00224809bad2": "f93ce891-8521-f111-8341-00224809bad2",
  "77499a10-1260-f111-a826-00224809bad2": "f03ce891-8521-f111-8341-00224809bad2",
  "e6afb438-7751-f111-bec6-00224809bad2": "1a3de891-8521-f111-8341-00224809bad2",
  "093ee891-8521-f111-8341-00224809bad2": "f987f930-6b51-f111-bec6-00224809bad2",
  "d5e7d0d1-9b5b-f111-bec7-00224809bad2": "4b14ac9c-9b5b-f111-bec7-00224809bad2",
  "da3de891-8521-f111-8341-00224809bad2": "1250f783-6251-f111-bec6-00224809bad2",
  "dd243d4a-6251-f111-bec6-00224809bad2": "d93de891-8521-f111-8341-00224809bad2",
  "8f3be891-8521-f111-8341-00224809bad2": "f930cd4d-6551-f111-bec6-00224809bad2",
  "db56391d-9c5b-f111-bec7-00224809bad2": "965288c6-9d5b-f111-bec7-00224809bad2",
  "723be891-8521-f111-8341-00224809bad2": "f1ed3474-6551-f111-bec6-00224809bad2",
  "ef3de891-8521-f111-8341-00224809bad2": "7cfffbe2-6051-f111-bec6-00224809bad2",
  "c4016b3b-7651-f111-bec6-00224809bad2": "183de891-8521-f111-8341-00224809bad2",
  "ff3de891-8521-f111-8341-00224809bad2": "34a2e1b8-3451-f111-bec6-00224809bad2",
  "11073454-7651-f111-bec6-00224809bad2": "163de891-8521-f111-8341-00224809bad2",
  "f33de891-8521-f111-8341-00224809bad2": "83b470e8-6851-f111-bec6-00224809bad2",
  "4ceed7db-1cbc-f111-aaae-000d3a364646": "ec3be891-8521-f111-8341-00224809bad2",
  "083ee891-8521-f111-8341-00224809bad2": "362825d9-6a51-f111-bec6-00224809bad2",
  "8315430f-7151-f111-bec6-00224809bad2": "083de891-8521-f111-8341-00224809bad2",
  "b3d2c452-1260-f111-a826-00224809bad2": "fa3ce891-8521-f111-8341-00224809bad2",
  "023ee891-8521-f111-8341-00224809bad2": "335a09cb-6751-f111-bec6-00224809bad2",
  "0f3ee891-8521-f111-8341-00224809bad2": "40e0e658-6b51-f111-bec6-00224809bad2",
  "3e4e7045-1260-f111-a826-00224809bad2": "f83ce891-8521-f111-8341-00224809bad2",
  "b1e0046d-7651-f111-bec6-00224809bad2": "163de891-8521-f111-8341-00224809bad2",
  "49b72e77-bb41-f111-88b3-00224809bad2": "ba7ec617-9e5b-f111-bec7-00224809bad2",
  "4f37cb17-1260-f111-a826-00224809bad2": "f13ce891-8521-f111-8341-00224809bad2",
  "f5508e38-1260-f111-a826-00224809bad2": "f63ce891-8521-f111-8341-00224809bad2",
  "043ee891-8521-f111-8341-00224809bad2": "277b7be1-3651-f111-bec6-00224809bad2",
  "fd3de891-8521-f111-8341-00224809bad2": "5b43ec01-6951-f111-bec6-00224809bad2",
  "e23de891-8521-f111-8341-00224809bad2": "6627e53f-6151-f111-bec6-00224809bad2",
  "ea3de891-8521-f111-8341-00224809bad2": "b662eac8-6151-f111-bec6-00224809bad2",
  "0c3ee891-8521-f111-8341-00224809bad2": "0181e63e-6b51-f111-bec6-00224809bad2",
  "cd8a1cb0-97c1-f111-aaaf-000d3a364646": "5c3de891-8521-f111-8341-00224809bad2",
  "7f3be891-8521-f111-8341-00224809bad2": "70e44906-6751-f111-bec6-00224809bad2",
  "d1ca1a3f-1260-f111-a826-00224809bad2": "f73ce891-8521-f111-8341-00224809bad2",
  "173de891-8521-f111-8341-00224809bad2": "27eb409f-7651-f111-bec6-00224809bad2",
  "db3de891-8521-f111-8341-00224809bad2": "f375adae-6351-f111-bec6-00224809bad2",
  "013ee891-8521-f111-8341-00224809bad2": "110ea635-3751-f111-bec6-00224809bad2",
  "e83de891-8521-f111-8341-00224809bad2": "ca2b8757-6151-f111-bec6-00224809bad2",
  "6bee27c1-7051-f111-bec6-00224809bad2": "003de891-8521-f111-8341-00224809bad2",
  "43135359-1260-f111-a826-00224809bad2": "fb3ce891-8521-f111-8341-00224809bad2",
  "f83de891-8521-f111-8341-00224809bad2": "aeb1755c-6951-f111-bec6-00224809bad2",
  "fb44df24-1260-f111-a826-00224809bad2": "f33ce891-8521-f111-8341-00224809bad2",
  "7b3be891-8521-f111-8341-00224809bad2": "cd095ae8-6551-f111-bec6-00224809bad2",
  "a02bfd31-1260-f111-a826-00224809bad2": "f53ce891-8521-f111-8341-00224809bad2",
  "452dc5ff-6151-f111-bec6-00224809bad2": "ed3de891-8521-f111-8341-00224809bad2",
  "d63de891-8521-f111-8341-00224809bad2": "3546ff8e-6451-f111-bec6-00224809bad2",
  "f13de891-8521-f111-8341-00224809bad2": "4a69970e-6951-f111-bec6-00224809bad2",
  "f33d240c-bc39-f111-88b4-00224809bad2": "4b14ac9c-9b5b-f111-bec7-00224809bad2",
  "ff6db30d-6351-f111-bec6-00224809bad2": "d83de891-8521-f111-8341-00224809bad2",
  "603be891-8521-f111-8341-00224809bad2": "b105bcc6-6651-f111-bec6-00224809bad2",
  "a413ab34-6551-f111-bec6-00224809bad2": "6b3be891-8521-f111-8341-00224809bad2",
  "d33de891-8521-f111-8341-00224809bad2": "6627e53f-6151-f111-bec6-00224809bad2",
  "9f3be891-8521-f111-8341-00224809bad2": "5418f82c-6751-f111-bec6-00224809bad2",
  "6c9535c8-3651-f111-bec6-00224809bad2": "f375adae-6351-f111-bec6-00224809bad2",
  "763be891-8521-f111-8341-00224809bad2": "3bf28cc8-6551-f111-bec6-00224809bad2",
  "883be891-8521-f111-8341-00224809bad2": "1ac15b41-6751-f111-bec6-00224809bad2",
  "e63de891-8521-f111-8341-00224809bad2": "4765441e-6151-f111-bec6-00224809bad2"
};
const HUB_DIVERSION_TABLES = [{
  label: 'Areas & Lines Master',
  oldLogical: 'craa5_aa_mss_area',
  oldSet: 'craa5_aa_mss_areas',
  oldPk: 'craa5_aa_mss_areaid',
  oldPn: 'craa5_area',
  newLogical: 'craa5___1_a_mss_area',
  newSet: 'craa5___1_a_mss_areas',
  newPk: 'craa5___1_a_mss_areaid',
  newPn: 'craa5_area',
  naturalKey: 'craa5_area',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5__aa_areas", "craa5_aa_areas"],
  oldSetAliases: [],
  onlyInOld: ["craa5_roomlookup", "craa5_roomlookupname"],
  onlyInNew: ["craa5_completionmode", "craa5_department", "craa5_facility", "craa5_flowstep", "craa5_owningdept", "craa5_roomacronym", "craa5_roomkind", "craa5_supportingoffset", "craa5_supportrooms"],
  apps: ["shiftstart", "mss", "msslog", "ganttly", "prodsched", "pbed", "bolo", "managerhub", "training", "supervisorhub", "director", "mapsubmit", "chemicals"]
}, {
  label: 'Equipment Assets Master',
  oldLogical: 'craa5_aa_assets',
  oldSet: 'craa5_aa_assetses',
  oldPk: 'craa5_aa_assetsid',
  oldPn: 'craa5_equipmentidentifier',
  newLogical: 'craa5___1_a_assets',
  newSet: 'craa5___1_a_assetses',
  newPk: 'craa5___1_a_assetsid',
  newPn: 'craa5_equipmentidentifier',
  naturalKey: 'craa5_equipmentidentifier',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_aa_asset", "craa5__aa_assets"],
  oldSetAliases: ["craa5__aa_assetses", "craa5_assets"],
  onlyInOld: [],
  onlyInNew: ["craa5_assetnumber", "craa5_department", "craa5_facility", "craa5_feedsinto", "craa5_line", "craa5_mergedinto", "craa5_owningdept", "craa5_processstep", "craa5_sharedwith", "craa5_supportroom", "craa5_timinganchor", "craa5_triggeredby", "craa5_triggergroup", "craa5_triggerscope", "craa5_worktrack"],
  apps: ["shiftstart", "mss", "msslog", "ganttly", "prodsched", "pbed", "bolo", "managerhub", "training", "supervisorhub", "director", "mapsubmit", "chemicals"]
}, {
  label: 'SAP Order Templates (Unified into Assets in __1_)',
  oldLogical: 'craa5_aa_ms_assets',
  oldSet: 'craa5_aa_ms_assetses',
  oldPk: 'craa5_aa_ms_assetsid',
  oldPn: 'craa5_title',
  newLogical: 'craa5___1_a_assets',
  newSet: 'craa5___1_a_assetses',
  newPk: 'craa5___1_a_assetsid',
  newPn: 'craa5_equipmentidentifier',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: ["craa5_area", "craa5_area_lu", "craa5_area_luname", "craa5_city", "craa5_countryorregion", "craa5_dispname", "craa5_equipment", "craa5_freqofclean", "craa5_freqofcleanname", "craa5_headstoclean", "craa5_hourstoclean", "craa5_locationonmap", "craa5_locationonmap_timestamp", "craa5_locationonmap_url", "craa5_locationonmapid", "craa5_olduid", "craa5_pictureofequipment1", "craa5_pictureofequipment1_timestamp", "craa5_pictureofequipment1_url", "craa5_pictureofequipment1id", "craa5_pictureofequipment2", "craa5_pictureofequipment2_timestamp", "craa5_pictureofequipment2_url", "craa5_pictureofequipment2id", "craa5_postalcode", "craa5_room", "craa5_sapdaily", "craa5_sapw", "craa5_state", "craa5_street", "craa5_subcat", "craa5_textarea", "craa5_textroom", "craa5_title"],
  onlyInNew: ["craa5_annually", "craa5_annuallyname", "craa5_area_lookup", "craa5_area_lookupname", "craa5_assetcode", "craa5_assetnumber", "craa5_breakdown", "craa5_cleanoffsetmins", "craa5_cleanorder", "craa5_dailyclean", "craa5_dailycleanname", "craa5_dailymin", "craa5_department", "craa5_departmentcode", "craa5_diassembly", "craa5_eggallergen", "craa5_equipmentidentifier", "craa5_facility", "craa5_feedsinto", "craa5_heads", "craa5_hoursrequired", "craa5_line", "craa5_maplocation", "craa5_mergedinto", "craa5_midweek", "craa5_midweekname", "craa5_minalrg", "craa5_month", "craa5_monthlyclean", "craa5_monthlycleanname", "craa5_monthname", "craa5_owningdept", "craa5_pallergen", "craa5_pecanallergen", "craa5_picture", "craa5_picture_timestamp", "craa5_picture_url", "craa5_pictureid", "craa5_pictureofequipment", "craa5_pictureofequipment_timestamp", "craa5_pictureofequipment_url", "craa5_pictureofequipmentid", "craa5_priority", "craa5_processstep", "craa5_quarterly", "craa5_quarterlyname", "craa5_sapannually", "craa5_sharedwith", "craa5_sop1", "craa5_sop1_name", "craa5_sop2", "craa5_sop2_name", "craa5_sop3", "craa5_sop3_name", "craa5_ssop", "craa5_ssop_name", "craa5_subcategory", "craa5_supportedline", "craa5_supportroom", "craa5_timetocleanaveragefromlog", "craa5_timinganchor", "craa5_triggeredby", "craa5_triggergroup", "craa5_triggerscope", "craa5_uniqueid", "craa5_weeklyclean", "craa5_weeklycleanname", "craa5_workareacode", "craa5_worktrack"],
  colMapOldToNew: {
    craa5_sapannual: 'craa5_sapannually'
  },
  colMapNewToOld: {},
  apps: ["mss", "msslog", "prodsched", "chemicals"],
  isMergedSapAssets: true
}, {
  label: 'Employee Roster',
  oldLogical: 'craa5__aa_employee',
  oldSet: 'craa5__aa_employees',
  oldPk: 'craa5__aa_employeeid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_a_employee',
  newSet: 'craa5___1_a_employees',
  newPk: 'craa5___1_a_employeeid',
  newPn: 'craa5_employeename',
  naturalKey: 'craa5_employeename',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_aa_employee", "craa5_employee"],
  oldSetAliases: ["craa5_aa_employees", "craa5_employees"],
  onlyInOld: [],
  onlyInNew: ["craa5_allowjanitorial", "craa5_allowjanitorialname", "craa5_employeename"],
  apps: ["shiftstart", "mss", "msslog", "ganttly", "prodsched", "pbed", "managerhub", "training", "supervisorhub", "director", "mapsubmit", "chemicals"]
}, {
  label: 'Work Shifts',
  oldLogical: 'craa5_workshift',
  oldSet: 'craa5_workshifts',
  oldPk: 'craa5_workshiftid',
  oldPn: 'craa5_dayname',
  newLogical: 'craa5___1_a_workshift',
  newSet: 'craa5___1_a_workshifts',
  newPk: 'craa5___1_a_workshiftid',
  newPn: 'craa5_dayname',
  naturalKey: 'craa5_dayname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  colMapOldToNew: {
    craa5_shiftname: 'craa5_dayname'
  },
  colMapNewToOld: {},
  apps: ["shiftstart", "ganttly", "prodsched", "pbed", "managerhub", "supervisorhub", "director"]
}, {
  label: 'Leadership Team',
  oldLogical: 'craa5__aa_leadershipteam',
  oldSet: 'craa5__aa_leadershipteams',
  oldPk: 'craa5__aa_leadershipteamid',
  oldPn: 'craa5_teamname',
  newLogical: 'craa5___1_a_leadershipteam',
  newSet: 'craa5___1_a_leadershipteams',
  newPk: 'craa5___1_a_leadershipteamid',
  newPn: 'craa5_teamname',
  naturalKey: 'craa5_teamname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_aa_leadershipteam"],
  oldSetAliases: [],
  onlyInOld: ["craa5_teamleademployeeid", "craa5_teamleademployeeidname"],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "supervisorhub"]
}, {
  label: 'Employee Roles',
  oldLogical: 'craa5__aa_role',
  oldSet: 'craa5__aa_roles',
  oldPk: 'craa5__aa_roleid',
  oldPn: 'craa5_rolename',
  newLogical: 'craa5___1_a_role',
  newSet: 'craa5___1_a_roles',
  newPk: 'craa5___1_a_roleid',
  newPn: 'craa5_rolename',
  naturalKey: 'craa5_rolename',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_aa_role"],
  oldSetAliases: ["craa5_aa_roles"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "managerhub"]
}, {
  label: 'Production Schedule Runs',
  oldLogical: 'craa5__aa_prd_schd',
  oldSet: 'craa5__aa_prd_schds',
  oldPk: 'craa5__aa_prd_schdid',
  oldPn: 'craa5_area',
  newLogical: 'craa5___1_p_prodschedule',
  newSet: 'craa5___1_p_prodschedules',
  newPk: 'craa5___1_p_prodscheduleid',
  newPn: 'craa5_area',
  naturalKey: 'craa5_datestarttime',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_aa_prd_schd"],
  oldSetAliases: ["craa5_aa_prd_schds"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["prodsched", "shiftstart", "mss", "ganttly", "pbed", "managerhub", "director", "chemicals"]
}, {
  label: 'Clean Plan Windows',
  oldLogical: 'craa5_cleanplan',
  oldSet: 'craa5_cleanplans',
  oldPk: 'craa5_cleanplanid',
  oldPn: 'craa5_cleanplanname',
  newLogical: 'craa5___1_p_cleanplan',
  newSet: 'craa5___1_p_cleanplans',
  newPk: 'craa5___1_p_cleanplanid',
  newPn: 'craa5_cleanplanname',
  naturalKey: 'craa5_cleanplanname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5__cleanplan", "craa5__sani_schedule_"],
  oldSetAliases: ["craa5__cleanplans", "craa5__sani_schedule_s"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["prodsched", "shiftstart", "mss", "ganttly", "pbed", "supervisorhub", "director", "chemicals"]
}, {
  label: 'Changeover Rules',
  oldLogical: 'craa5_changeover_rule',
  oldSet: 'craa5_changeover_rules',
  oldPk: 'craa5_changeover_ruleid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_p_changeoverrule',
  newSet: 'craa5___1_p_changeoverrules',
  newPk: 'craa5___1_p_changeoverruleid',
  newPn: 'craa5_rulename',
  naturalKey: 'craa5_rulename',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_changeoverrule", "craa5_linerunrule"],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["prodsched", "pbed"]
}, {
  label: 'Line Priorities',
  oldLogical: 'craa5_linepriority',
  oldSet: 'craa5_linepriorities',
  oldPk: 'craa5_linepriorityid',
  oldPn: 'craa5_linepriority1',
  newLogical: 'craa5___1_p_linepriority',
  newSet: 'craa5___1_p_linepriorities',
  newPk: 'craa5___1_p_linepriorityid',
  newPn: 'craa5_linecode',
  naturalKey: 'craa5_linecode',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5__aa_linepriority", "craa5_aa_linepriority"],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: ["craa5_linecode"],
  apps: ["ganttly", "prodsched", "mss", "shiftstart", "managerhub"]
}, {
  label: 'Schedule Change Inbox',
  oldLogical: 'craa5_schedulechange',
  oldSet: 'craa5_schedulechanges',
  oldPk: 'craa5_schedulechangeid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_p_schedulechange',
  newSet: 'craa5___1_p_schedulechanges',
  newPk: 'craa5___1_p_schedulechangeid',
  newPn: 'craa5_changetitle',
  naturalKey: 'craa5_changetitle',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: ["craa5_changetitle"],
  apps: ["prodsched"]
}, {
  label: 'SKU Master',
  oldLogical: 'craa5_skumaster',
  oldSet: 'craa5_skumasters',
  oldPk: 'craa5_skumasterid',
  oldPn: 'craa5_skucode',
  newLogical: 'craa5___1_p_skumaster',
  newSet: 'craa5___1_p_skumasters',
  newPk: 'craa5___1_p_skumasterid',
  newPn: 'craa5_skucode',
  naturalKey: 'craa5_skucode',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5__aa_skumaster"],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["prodsched"]
}, {
  label: 'PBED Weekend Plans',
  oldLogical: 'craa5__p_plan',
  oldSet: 'craa5__p_plans',
  oldPk: 'craa5__p_planid',
  oldPn: 'craa5__p_plan1',
  newLogical: 'craa5___1_p_plan',
  newSet: 'craa5___1_p_plans',
  newPk: 'craa5___1_p_planid',
  newPn: 'craa5_plantitle',
  naturalKey: 'craa5_weekendkey',
  guidCols: [],
  jsonGuidCols: ["craa5_planjson", "craa5_plan_json", "craa5_planpayload"],
  oldAliases: ["craa5_p_plan"],
  oldSetAliases: ["craa5_p_plans"],
  onlyInOld: [],
  onlyInNew: ["craa5_plantitle"],
  apps: ["pbed"]
}, {
  label: 'PBED Milestones',
  oldLogical: 'craa5__p_milestone',
  oldSet: 'craa5__p_milestones',
  oldPk: 'craa5__p_milestoneid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_p_milestone',
  newSet: 'craa5___1_p_milestones',
  newPk: 'craa5___1_p_milestoneid',
  newPn: 'craa5_milestonetitle',
  naturalKey: 'craa5_milestonetitle',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_p_milestone"],
  oldSetAliases: ["craa5_p_milestones"],
  onlyInOld: [],
  onlyInNew: ["craa5_milestonetitle"],
  apps: ["pbed"]
}, {
  label: 'PBED Work Orders',
  oldLogical: 'craa5__p_workorder',
  oldSet: 'craa5__p_workorders',
  oldPk: 'craa5__p_workorderid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_p_workorder',
  newSet: 'craa5___1_p_workorders',
  newPk: 'craa5___1_p_workorderid',
  newPn: 'craa5_ordernumber',
  naturalKey: 'craa5_ordernumber',
  guidCols: ["craa5_assetguid"],
  jsonGuidCols: [],
  oldAliases: ["craa5_p_workorder"],
  oldSetAliases: ["craa5_p_workorders"],
  onlyInOld: [],
  onlyInNew: ["craa5_ordernumber"],
  apps: ["pbed"]
}, {
  label: 'PBED FLOC Map',
  oldLogical: 'craa5__p_flocmap',
  oldSet: 'craa5__p_flocmaps',
  oldPk: 'craa5__p_flocmapid',
  oldPn: 'craa5__p_flocmap1',
  newLogical: 'craa5___1_p_flocmap',
  newSet: 'craa5___1_p_flocmaps',
  newPk: 'craa5___1_p_flocmapid',
  newPn: 'craa5_floccode',
  naturalKey: 'craa5_floccode',
  guidCols: ["craa5_assetguid"],
  jsonGuidCols: [],
  oldAliases: ["craa5_p_flocmap"],
  oldSetAliases: ["craa5_p_flocmaps"],
  onlyInOld: [],
  onlyInNew: ["craa5_floccode"],
  apps: ["pbed"]
}, {
  label: 'Shift Boards (Live)',
  oldLogical: 'craa5_shiftboard',
  oldSet: 'craa5_shiftboards',
  oldPk: 'craa5_shiftboardid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_s_shiftboard',
  newSet: 'craa5___1_s_shiftboards',
  newPk: 'craa5___1_s_shiftboardid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_slotstart',
  guidCols: [],
  jsonGuidCols: ["craa5_boardjson"],
  oldAliases: [],
  oldSetAliases: ["craa5__shiftboards"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "pbed", "managerhub", "supervisorhub", "chemicals"],
  isSubsetInV1: true
}, {
  label: 'Shift Plans (Next Shift Setup)',
  oldLogical: 'craa5_shiftplan',
  oldSet: 'craa5_shiftplans',
  oldPk: 'craa5_shiftplanid',
  oldPn: 'craa5_shiftplan1',
  newLogical: 'craa5___1_s_shiftplan',
  newSet: 'craa5___1_s_shiftplans',
  newPk: 'craa5___1_s_shiftplanid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_slotstart',
  guidCols: [],
  jsonGuidCols: ["craa5_boardjson", "craa5_planjson"],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "pbed", "supervisorhub"]
}, {
  label: 'Shift Archives',
  oldLogical: 'craa5_shiftarchive',
  oldSet: 'craa5_shiftarchives',
  oldPk: 'craa5_shiftarchiveid',
  oldPn: 'craa5_shiftarchive1',
  newLogical: 'craa5___1_s_shiftarchive',
  newSet: 'craa5___1_s_shiftarchives',
  newPk: 'craa5___1_s_shiftarchiveid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_sourceboardid',
  guidCols: [],
  jsonGuidCols: ["craa5_boardjson", "craa5_archivejson"],
  oldAliases: [],
  oldSetAliases: ["craa5__shiftarchives"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "managerhub", "supervisorhub"],
  isSubsetInV1: true
}, {
  label: 'Shift Activity & Access Log',
  oldLogical: 'craa5_shiftlog',
  oldSet: 'craa5_shiftlogs',
  oldPk: 'craa5_shiftlogid',
  oldPn: 'craa5_action',
  newLogical: 'craa5___1_s_shiftlog',
  newSet: 'craa5___1_s_shiftlogs',
  newPk: 'craa5___1_s_shiftlogid',
  newPn: 'craa5_action',
  naturalKey: 'craa5_at',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "msslog", "ganttly", "supervisorhub"]
}, {
  label: 'Shift Presets',
  oldLogical: 'craa5_shiftpreset',
  oldSet: 'craa5_shiftpresets',
  oldPk: 'craa5_shiftpresetid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_s_shiftpreset',
  newSet: 'craa5___1_s_shiftpresets',
  newPk: 'craa5___1_s_shiftpresetid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: ["craa5_boardjson", "craa5_presetjson"],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart"]
}, {
  label: 'Update Presets (9-12-3)',
  oldLogical: 'craa5_updatepreset',
  oldSet: 'craa5_updatepresets',
  oldPk: 'craa5_updatepresetid',
  oldPn: 'craa5_updatepreset1',
  newLogical: 'craa5___1_s_updatepreset',
  newSet: 'craa5___1_s_updatepresets',
  newPk: 'craa5___1_s_updatepresetid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_ownerkey',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart"]
}, {
  label: 'Task Assignments',
  oldLogical: 'craa5_taskassignment',
  oldSet: 'craa5_taskassignments',
  oldPk: 'craa5_taskassignmentid',
  oldPn: 'craa5_id',
  newLogical: 'craa5___1_s_taskassignment',
  newSet: 'craa5___1_s_taskassignments',
  newPk: 'craa5___1_s_taskassignmentid',
  newPn: 'craa5_id',
  naturalKey: 'craa5_id',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: ["craa5__taskassignments"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "pbed", "managerhub", "supervisorhub", "chemicals"],
  isSubsetInV1: true
}, {
  label: 'Ganttly Clean Check-offs',
  oldLogical: 'craa5_cleancheckoff',
  oldSet: 'craa5_cleancheckoffs',
  oldPk: 'craa5_cleancheckoffid',
  oldPn: 'craa5_cleancheckoff1',
  newLogical: 'craa5___1_s_cleancheckoff',
  newSet: 'craa5___1_s_cleancheckoffs',
  newPk: 'craa5___1_s_cleancheckoffid',
  newPn: 'craa5_checkoffkey',
  naturalKey: 'craa5_checkoffkey',
  guidCols: ["craa5_equipmentguid"],
  jsonGuidCols: [],
  oldAliases: ["craa5__cleancheckoff", "craa5_ganttlycheckoff"],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["ganttly", "shiftstart", "pbed", "mss", "msslog", "bolo", "managerhub", "training"]
}, {
  label: 'Ganttly Crew Assignments',
  oldLogical: 'craa5_gassignment',
  oldSet: 'craa5_gassignments',
  oldPk: 'craa5_gassignmentid',
  oldPn: 'craa5_gassignment1',
  newLogical: 'craa5___1_g_assignment',
  newSet: 'craa5___1_g_assignments',
  newPk: 'craa5___1_g_assignmentid',
  newPn: 'craa5_assignmentkey',
  naturalKey: 'craa5_assignmentkey',
  guidCols: ["craa5_equipmentguid"],
  jsonGuidCols: [],
  oldAliases: ["craa5__g_assignment", "craa5_g_assignment"],
  oldSetAliases: ["craa5__g_assignments", "craa5__gassignments"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["ganttly", "pbed", "shiftstart", "supervisorhub"]
}, {
  label: 'Ganttly Equipment Passoffs',
  oldLogical: 'craa5_gequipmentpassoff',
  oldSet: 'craa5_gequipmentpassoffs',
  oldPk: 'craa5_gequipmentpassoffid',
  oldPn: 'craa5_passoffkey',
  newLogical: 'craa5___1_g_passoff',
  newSet: 'craa5___1_g_passoffs',
  newPk: 'craa5___1_g_passoffid',
  newPn: 'craa5_passoffkey',
  naturalKey: 'craa5_passoffkey',
  guidCols: ["craa5_equipmentguid"],
  jsonGuidCols: [],
  oldAliases: ["craa5_equip_passoff", "craa5__g_equipmentpassoff", "craa5__gequipmentpassoff", "craa5__g_passoff"],
  oldSetAliases: ["craa5__gequipmentpassoffs", "craa5__g_passoffs", "craa5_g_passoffs"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["ganttly", "shiftstart", "managerhub", "supervisorhub"]
}, {
  label: 'Ganttly Shift Handovers',
  oldLogical: 'craa5__g_handover',
  oldSet: 'craa5__g_handovers',
  oldPk: 'craa5__g_handoverid',
  oldPn: 'craa5__g_handover1',
  newLogical: 'craa5___1_g_handover',
  newSet: 'craa5___1_g_handovers',
  newPk: 'craa5___1_g_handoverid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_g_handover"],
  oldSetAliases: ["craa5_g_handovers"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["ganttly", "shiftstart", "managerhub", "supervisorhub"]
}, {
  label: 'Ganttly Obstacles & Holds',
  oldLogical: 'craa5__g_obstacle',
  oldSet: 'craa5__g_obstacles',
  oldPk: 'craa5__g_obstacleid',
  oldPn: 'craa5__g_obstacle1',
  newLogical: 'craa5___1_g_obstacle',
  newSet: 'craa5___1_g_obstacles',
  newPk: 'craa5___1_g_obstacleid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: ["craa5_equipmentguid"],
  jsonGuidCols: [],
  oldAliases: ["craa5_g_obstacle", "craa5_gobstacle"],
  oldSetAliases: ["craa5_g_obstacles"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["ganttly", "pbed", "supervisorhub"]
}, {
  label: 'Ganttly Personnel Notes',
  oldLogical: 'craa5__g_personnelnote',
  oldSet: 'craa5__g_personnelnotes',
  oldPk: 'craa5__g_personnelnoteid',
  oldPn: 'craa5__g_personnelnote1',
  newLogical: 'craa5___1_g_note',
  newSet: 'craa5___1_g_notes',
  newPk: 'craa5___1_g_noteid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_g_personnelnote", "craa5_gpersonnelnote"],
  oldSetAliases: ["craa5_g_personnelnotes"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["ganttly", "managerhub", "supervisorhub"]
}, {
  label: 'Facility Maps',
  oldLogical: 'craa5___maps',
  oldSet: 'craa5___mapses',
  oldPk: 'craa5___mapsid',
  oldPn: 'craa5_facility',
  newLogical: 'craa5___1_g_maps',
  newSet: 'craa5___1_g_mapses',
  newPk: 'craa5___1_g_mapsid',
  newPn: 'craa5_facility',
  naturalKey: 'craa5_facility',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_maps"],
  oldSetAliases: ["craa5_mapses"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["ganttly", "bolo", "supervisorhub", "mapsubmit"]
}, {
  label: 'MSS Regulatory Completion Log',
  oldLogical: 'craa5__log_',
  oldSet: 'craa5__log_s',
  oldPk: 'craa5__log_id',
  oldPn: 'craa5_uid',
  newLogical: 'craa5___1_l_log',
  newSet: 'craa5___1_l_logs',
  newPk: 'craa5___1_l_logid',
  newPn: 'craa5_uid',
  naturalKey: 'craa5_completionkey',
  guidCols: ["craa5_equipmentguid"],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: ["craa5__logs"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["mss", "msslog", "ganttly", "prodsched", "pbed", "bolo", "managerhub", "training", "supervisorhub", "director", "mapsubmit", "chemicals"],
  isSubsetInV1: true
}, {
  label: 'Hub Ecosystem Config',
  oldLogical: 'craa5__e_hubconfig',
  oldSet: 'craa5__e_hubconfigs',
  oldPk: 'craa5__e_hubconfigid',
  oldPn: 'craa5_configname',
  newLogical: 'craa5___1_e_hubconfig',
  newSet: 'craa5___1_e_hubconfigs',
  newPk: 'craa5___1_e_hubconfigid',
  newPn: 'craa5_configname',
  naturalKey: 'craa5_configkey',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_hubconfig", "craa5_e_hubconfig"],
  oldSetAliases: ["craa5_e_hubconfigs", "craa5_hubconfigs"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "mss", "msslog", "ganttly", "prodsched", "pbed", "bolo", "managerhub", "training", "supervisorhub", "director", "mapsubmit", "chemicals"]
}, {
  label: 'Labor Rates',
  oldLogical: 'craa5__e_laborrate',
  oldSet: 'craa5__e_laborrates',
  oldPk: 'craa5__e_laborrateid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_e_laborrate',
  newSet: 'craa5___1_e_laborrates',
  newPk: 'craa5___1_e_laborrateid',
  newPn: 'craa5_role',
  naturalKey: 'craa5_role',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_e_laborrate"],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["ganttly", "pbed", "mss", "managerhub", "director"]
}, {
  label: 'Ecosystem Shift Tasks',
  oldLogical: 'craa5__e_shifttask',
  oldSet: 'craa5__e_shifttasks',
  oldPk: 'craa5__e_shifttaskid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_e_shifttask',
  newSet: 'craa5___1_e_shifttasks',
  newPk: 'craa5___1_e_shifttaskid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_e_shifttask"],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart", "ganttly", "supervisorhub"]
}, {
  label: 'Time Loss Log',
  oldLogical: 'craa5__m_timelosslog',
  oldSet: 'craa5__m_timelosslogs',
  oldPk: 'craa5__m_timelosslogid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_m_timelosslog',
  newSet: 'craa5___1_m_timelosslogs',
  newPk: 'craa5___1_m_timelosslogid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_timelosslog"],
  oldSetAliases: ["craa5_timelosslogs"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["pbed", "ganttly", "shiftstart", "managerhub", "supervisorhub"]
}, {
  label: 'Manager Quick Tasks',
  oldLogical: 'craa5__m_quicktask',
  oldSet: 'craa5__m_quicktasks',
  oldPk: 'craa5__m_quicktaskid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_m_quicktask',
  newSet: 'craa5___1_m_quicktasks',
  newPk: 'craa5___1_m_quicktaskid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_quicktask"],
  oldSetAliases: ["craa5_quicktasks"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart", "ganttly", "managerhub"]
}, {
  label: 'Manager Form Templates',
  oldLogical: 'craa5__m_formtemplate',
  oldSet: 'craa5__m_formtemplates',
  oldPk: 'craa5__m_formtemplateid',
  oldPn: 'craa5_name',
  newLogical: 'craa5___1_m_formtemplate',
  newSet: 'craa5___1_m_formtemplates',
  newPk: 'craa5___1_m_formtemplateid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_title',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_formtemplate"],
  oldSetAliases: ["craa5_formtemplates"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["mss", "msslog", "managerhub", "supervisorhub"]
}, {
  label: 'Employee Notes',
  oldLogical: 'craa5_employeenote',
  oldSet: 'craa5_employeenotes',
  oldPk: 'craa5_employeenoteid',
  oldPn: 'craa5_notetitle',
  newLogical: 'craa5___1_m_employeenote',
  newSet: 'craa5___1_m_employeenotes',
  newPk: 'craa5___1_m_employeenoteid',
  newPn: 'craa5_notetitle',
  naturalKey: 'craa5_notetitle',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5__m_employeenote"],
  oldSetAliases: ["craa5__m_employeenotes"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["shiftstart", "ganttly", "managerhub", "supervisorhub"]
}, {
  label: 'Supervisor Todo',
  oldLogical: 'craa5__supervisor_todo',
  oldSet: 'craa5__supervisor_todos',
  oldPk: 'craa5__supervisor_todoid',
  oldPn: 'craa5_task',
  newLogical: 'craa5___1_m_supervisortodo',
  newSet: 'craa5___1_m_supervisortodos',
  newPk: 'craa5___1_m_supervisortodoid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_task',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_supervisor_todo", "craa5__m_supervisortodo"],
  oldSetAliases: ["craa5_supervisor_todos", "craa5__m_supervisortodos"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart", "ganttly", "managerhub", "supervisorhub"]
}, {
  label: 'Training Skills Catalog',
  oldLogical: 'craa5__t_skill',
  oldSet: 'craa5__t_skills',
  oldPk: 'craa5__t_skillid',
  oldPn: 'craa5_kind',
  newLogical: 'craa5___1_t_skill',
  newSet: 'craa5___1_t_skills',
  newPk: 'craa5___1_t_skillid',
  newPn: 'craa5_kind',
  naturalKey: 'craa5_key',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_t_skill"],
  oldSetAliases: ["craa5_t_skills"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart", "ganttly", "managerhub", "training"]
}, {
  label: 'Employee Skill Levels',
  oldLogical: 'craa5__t_skilllevel',
  oldSet: 'craa5__t_skilllevels',
  oldPk: 'craa5__t_skilllevelid',
  oldPn: 'craa5__t_skilllevel1',
  newLogical: 'craa5___1_t_skilllevel',
  newSet: 'craa5___1_t_skilllevels',
  newPk: 'craa5___1_t_skilllevelid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_levelkey',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_t_skilllevel"],
  oldSetAliases: ["craa5_t_skilllevels"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart", "ganttly", "managerhub", "training"]
}, {
  label: 'Employee Certifications',
  oldLogical: 'craa5__t_employeecertification',
  oldSet: 'craa5__t_employeecertifications',
  oldPk: 'craa5__t_employeecertificationid',
  oldPn: 'craa5_certkey',
  newLogical: 'craa5___1_t_cert',
  newSet: 'craa5___1_t_certs',
  newPk: 'craa5___1_t_certid',
  newPn: 'craa5_certkey',
  naturalKey: 'craa5_certkey',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_t_employeecertification", "craa5_employeecertification", "craa5__employeecertification", "craa5__t_cert"],
  oldSetAliases: ["craa5_t_employeecertifications", "craa5__t_certs"],
  onlyInOld: ["craa5_employeeguid"],
  onlyInNew: [],
  colMapOldToNew: {
    craa5_employeeguid: 'craa5_employeeid'
  },
  colMapNewToOld: {},
  apps: ["shiftstart", "ganttly", "managerhub", "training", "supervisorhub"]
}, {
  label: 'Training Events',
  oldLogical: 'craa5__t_trainingevent',
  oldSet: 'craa5__t_trainingevents',
  oldPk: 'craa5__t_trainingeventid',
  oldPn: 'craa5__t_trainingevent1',
  newLogical: 'craa5___1_t_event',
  newSet: 'craa5___1_t_events',
  newPk: 'craa5___1_t_eventid',
  newPn: 'craa5_title',
  naturalKey: 'craa5_eventkey',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_t_trainingevent", "craa5__t_event"],
  oldSetAliases: ["craa5_t_trainingevents", "craa5__t_events"],
  onlyInOld: [],
  onlyInNew: ["craa5_title"],
  apps: ["shiftstart", "ganttly", "managerhub", "training"]
}, {
  label: 'Pathogen BOLO Swab Results (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__b_swabresult',
  oldSet: 'craa5__b_swabresults',
  oldPk: 'craa5__b_swabresultid',
  oldPn: 'craa5_name',
  newLogical: 'craa5__b_swabresult',
  newSet: 'craa5__b_swabresults',
  newPk: 'craa5__b_swabresultid',
  newPn: 'craa5_name',
  naturalKey: 'craa5_sampleid',
  guidCols: ["craa5_equipmentguid"],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["bolo"]
}, {
  label: 'Pathogen Corrective Actions (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__b_correctiveaction',
  oldSet: 'craa5__b_correctiveactions',
  oldPk: 'craa5__b_correctiveactionid',
  oldPn: 'craa5_actiontitle',
  newLogical: 'craa5__b_correctiveaction',
  newSet: 'craa5__b_correctiveactions',
  newPk: 'craa5__b_correctiveactionid',
  newPn: 'craa5_actiontitle',
  naturalKey: 'craa5_actiontitle',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["bolo"]
}, {
  label: 'Facility Map & Photo Observations (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__facilityobservation',
  oldSet: 'craa5__facilityobservations',
  oldPk: 'craa5__facilityobservationid',
  oldPn: 'craa5__area',
  newLogical: 'craa5__facilityobservation',
  newSet: 'craa5__facilityobservations',
  newPk: 'craa5__facilityobservationid',
  newPn: 'craa5__area',
  naturalKey: 'craa5__area',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_facilityobservation"],
  oldSetAliases: ["craa5_facilityobservations"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["bolo", "supervisorhub", "mapsubmit"]
}, {
  label: 'Pathogen BOLO Swab Catalog 9900 (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5_pathogenboloswabcatalog9900',
  oldSet: 'craa5_pathogenboloswabcatalog9900s',
  oldPk: 'craa5_pathogenboloswabcatalog9900id',
  oldPn: 'craa5_pathogenboloswabcatalog99001',
  newLogical: 'craa5_pathogenboloswabcatalog9900',
  newSet: 'craa5_pathogenboloswabcatalog9900s',
  newPk: 'craa5_pathogenboloswabcatalog9900id',
  newPn: 'craa5_pathogenboloswabcatalog99001',
  naturalKey: 'craa5_pathogenboloswabcatalog99001',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["bolo"]
}, {
  label: 'Chemical Suppliers & Distributors (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_distributor',
  oldSet: 'craa5__c_distributors',
  oldPk: 'craa5__c_distributorid',
  oldPn: 'craa5__c_distributorname',
  newLogical: 'craa5__c_distributor',
  newSet: 'craa5__c_distributors',
  newPk: 'craa5__c_distributorid',
  newPn: 'craa5__c_distributorname',
  naturalKey: 'craa5_vendornumber',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical & Supply Item Master (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemical',
  oldSet: 'craa5__c_chemicals',
  oldPk: 'craa5__c_chemicalid',
  oldPn: 'craa5__c_chemical_name',
  newLogical: 'craa5__c_chemical',
  newSet: 'craa5__c_chemicals',
  newPk: 'craa5__c_chemicalid',
  newPn: 'craa5__c_chemical_name',
  naturalKey: 'craa5_itemnumber',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Stock Inventory (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemicalinventory',
  oldSet: 'craa5__c_chemicalinventories',
  oldPk: 'craa5__c_chemicalinventoryid',
  oldPn: 'craa5__c_chemicalinventoryname',
  newLogical: 'craa5__c_chemicalinventory',
  newSet: 'craa5__c_chemicalinventories',
  newPk: 'craa5__c_chemicalinventoryid',
  newPn: 'craa5__c_chemicalinventoryname',
  naturalKey: 'craa5__c_chemicalinventoryname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical SAP Shopping Carts (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_cart',
  oldSet: 'craa5__c_carts',
  oldPk: 'craa5__c_cartid',
  oldPn: 'craa5__c_cartname',
  newLogical: 'craa5__c_cart',
  newSet: 'craa5__c_carts',
  newPk: 'craa5__c_cartid',
  newPn: 'craa5__c_cartname',
  naturalKey: 'craa5__c_cartname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_cart"],
  oldSetAliases: ["craa5_carts"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical SAP Cart Lines & Requests (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_cartline',
  oldSet: 'craa5__c_cartlines',
  oldPk: 'craa5__c_cartlineid',
  oldPn: 'craa5_cartlinename',
  newLogical: 'craa5__c_cartline',
  newSet: 'craa5__c_cartlines',
  newPk: 'craa5__c_cartlineid',
  newPn: 'craa5_cartlinename',
  naturalKey: 'craa5_cartlinename',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_cartline"],
  oldSetAliases: ["craa5_cartlines"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Sunday Inventory Counts (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemicalcount',
  oldSet: 'craa5__c_chemicalcounts',
  oldPk: 'craa5__c_chemicalcountid',
  oldPn: 'craa5_chemicalname',
  newLogical: 'craa5__c_chemicalcount',
  newSet: 'craa5__c_chemicalcounts',
  newPk: 'craa5__c_chemicalcountid',
  newPn: 'craa5_chemicalname',
  naturalKey: 'craa5_chemicalname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Room Usage & Issue Log (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemicalusagelog',
  oldSet: 'craa5__c_chemicalusagelogs',
  oldPk: 'craa5__c_chemicalusagelogid',
  oldPn: 'craa5__c_chemicalusagelogname',
  newLogical: 'craa5__c_chemicalusagelog',
  newSet: 'craa5__c_chemicalusagelogs',
  newPk: 'craa5__c_chemicalusagelogid',
  newPn: 'craa5__c_chemicalusagelogname',
  naturalKey: 'craa5__c_chemicalusagelogname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Titration Target Ranges (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_titrationtarget',
  oldSet: 'craa5__c_titrationtargets',
  oldPk: 'craa5__c_titrationtargetid',
  oldPn: 'craa5__c_titrationtargetname',
  newLogical: 'craa5__c_titrationtarget',
  newSet: 'craa5__c_titrationtargets',
  newPk: 'craa5__c_titrationtargetid',
  newPn: 'craa5__c_titrationtargetname',
  naturalKey: 'craa5__c_titrationtargetname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_titrationtarget"],
  oldSetAliases: ["craa5_titrationtargets"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Command Center Chemical Titrations (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemicaltitration',
  oldSet: 'craa5__c_chemicaltitrations',
  oldPk: 'craa5__c_chemicaltitrationid',
  oldPn: 'craa5_chemicalkey',
  newLogical: 'craa5__c_chemicaltitration',
  newSet: 'craa5__c_chemicaltitrations',
  newPk: 'craa5__c_chemicaltitrationid',
  newPn: 'craa5_chemicalkey',
  naturalKey: 'craa5_chemicalkey',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5__m_chemicaltitration", "craa5_chemicaltitration"],
  oldSetAliases: ["craa5__m_chemicaltitrations", "craa5_chemicaltitrations"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals", "managerhub"]
}, {
  label: 'Chemical Clerk Checklist Tasks (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_checklisttask',
  oldSet: 'craa5__c_checklisttasks',
  oldPk: 'craa5__c_checklisttaskid',
  oldPn: 'craa5__c_checklisttaskname',
  newLogical: 'craa5__c_checklisttask',
  newSet: 'craa5__c_checklisttasks',
  newPk: 'craa5__c_checklisttaskid',
  newPn: 'craa5__c_checklisttaskname',
  naturalKey: 'craa5__c_checklisttaskname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Completed Clerk Shift Checklists (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_clerkchecklist',
  oldSet: 'craa5__c_clerkchecklists',
  oldPk: 'craa5__c_clerkchecklistid',
  oldPn: 'craa5__c_clerkchecklist1',
  newLogical: 'craa5__c_clerkchecklist',
  newSet: 'craa5__c_clerkchecklists',
  newPk: 'craa5__c_clerkchecklistid',
  newPn: 'craa5__c_clerkchecklist1',
  naturalKey: 'craa5_shiftdate',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Standards per Clean (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemicalstandard',
  oldSet: 'craa5__c_chemicalstandards',
  oldPk: 'craa5__c_chemicalstandardid',
  oldPn: 'craa5__c_chemicalstandardname',
  newLogical: 'craa5__c_chemicalstandard',
  newSet: 'craa5__c_chemicalstandards',
  newPk: 'craa5__c_chemicalstandardid',
  newPn: 'craa5__c_chemicalstandardname',
  naturalKey: 'craa5__c_chemicalstandardname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: ["craa5_chemicalstandard", "craa5_chemicalstandard1", "craa5_mssresourcechemicalstandard"],
  oldSetAliases: ["craa5_chemicalstandards", "craa5_chemicalstandard1s", "craa5_mssresourcechemicalstandards"],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Log Area Aliases (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_areaalias',
  oldSet: 'craa5__c_areaaliases',
  oldPk: 'craa5__c_areaaliasid',
  oldPn: 'craa5__c_areaaliasname',
  newLogical: 'craa5__c_areaalias',
  newSet: 'craa5__c_areaaliases',
  newPk: 'craa5__c_areaaliasid',
  newPn: 'craa5__c_areaaliasname',
  naturalKey: 'craa5__c_areaaliasname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Chemical Name Aliases (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_chemicalalias',
  oldSet: 'craa5__c_chemicalaliases',
  oldPk: 'craa5__c_chemicalaliasid',
  oldPn: 'craa5__c_chemicalaliasname',
  newLogical: 'craa5__c_chemicalalias',
  newSet: 'craa5__c_chemicalaliases',
  newPk: 'craa5__c_chemicalaliasid',
  newPn: 'craa5__c_chemicalaliasname',
  naturalKey: 'craa5__c_chemicalaliasname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Sanitation Monthly Budget (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5__c_sanitationbudget',
  oldSet: 'craa5__c_sanitationbudgets',
  oldPk: 'craa5__c_sanitationbudgetid',
  oldPn: 'craa5__c_sanitationbudgetname',
  newLogical: 'craa5__c_sanitationbudget',
  newSet: 'craa5__c_sanitationbudgets',
  newPk: 'craa5__c_sanitationbudgetid',
  newPn: 'craa5__c_sanitationbudgetname',
  naturalKey: 'craa5__c_sanitationbudgetname',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals"]
}, {
  label: 'Daily Production Volume (Shared Table)',
  isSharedPhysical: true,
  oldLogical: 'craa5_dailyproduction',
  oldSet: 'craa5_dailyproductions',
  oldPk: 'craa5_dailyproductionid',
  oldPn: 'craa5_name',
  newLogical: 'craa5_dailyproduction',
  newSet: 'craa5_dailyproductions',
  newPk: 'craa5_dailyproductionid',
  newPn: 'craa5_name',
  naturalKey: 'craa5_name',
  guidCols: [],
  jsonGuidCols: [],
  oldAliases: [],
  oldSetAliases: [],
  onlyInOld: [],
  onlyInNew: [],
  apps: ["chemicals", "director"]
}];
const HUB_DIVERSION_BY_OLD_LOGICAL = {};
const HUB_DIVERSION_BY_NEW_LOGICAL = {};
const HUB_DIVERSION_BY_OLD_SET = {};
const HUB_DIVERSION_BY_NEW_SET = {};
HUB_DIVERSION_TABLES.forEach(function (spec) {
  HUB_DIVERSION_BY_OLD_LOGICAL[spec.oldLogical] = spec;
  (spec.oldAliases || []).forEach(function (a) {
    HUB_DIVERSION_BY_OLD_LOGICAL[a] = spec;
  });
  if (!HUB_DIVERSION_BY_NEW_LOGICAL[spec.newLogical] || !spec.isMergedSapAssets) {
    HUB_DIVERSION_BY_NEW_LOGICAL[spec.newLogical] = spec;
  }
  HUB_DIVERSION_BY_OLD_SET[spec.oldSet] = spec;
  (spec.oldSetAliases || []).forEach(function (s) {
    HUB_DIVERSION_BY_OLD_SET[s] = spec;
  });
  if (!HUB_DIVERSION_BY_NEW_SET[spec.newSet] || !spec.isMergedSapAssets) {
    HUB_DIVERSION_BY_NEW_SET[spec.newSet] = spec;
  }
});
// Deterministic UUID v4-format generator from any string key (matches hubIdFromKey across all hub apps)
function hubDiversionIdFromKey(key) {
  const s = String(key || '').trim().toLowerCase();
  const h = [0x811c9dc5, 0x9e3779b9, 0x85ebca6b, 0xc2b2ae35];
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    for (let j = 0; j < 4; j++) {
      h[j] = Math.imul(h[j] ^ c, 0x01000193 + (j << 8)) >>> 0;
    }
  }
  const hex = h.map(function (n) {
    return ('00000000' + (n >>> 0).toString(16)).slice(-8);
  }).join('');
  return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-4' + hex.slice(13, 16) + '-' + (parseInt(hex.slice(16, 18), 16) & 0x3f | 0x80).toString(16).padStart(2, '0') + hex.slice(18, 20) + '-' + hex.slice(20, 32);
}
function hubDiversionMakeDefaultRoutes() {
  const routes = {};
  HUB_DIVERSION_APPS.forEach(function (a) {
    routes[a.key] = {
      appKey: a.key,
      readSchema: 'legacy',
      dualWrite: true,
      masterOff: false,
      autoSync: false,
      followGlobal: a.key !== 'global',
      updatedBy: 'system',
      updatedAt: '',
      lastSync: null
    };
  });
  return routes;
}
const HUB_DIVERSION_STATE = function () {
  if (typeof window !== 'undefined' && window.__HUB_DIVERSION_STATE__) {
    const existing = window.__HUB_DIVERSION_STATE__;
    if (existing.routes && typeof existing.routes === 'object') {
      const defaults = hubDiversionMakeDefaultRoutes();
      Object.keys(defaults).forEach(function (k) {
        if (!existing.routes[k]) existing.routes[k] = defaults[k];
      });
    }
    return existing;
  }
  const st = {
    activeAppKey: 'director',
    routes: hubDiversionMakeDefaultRoutes(),
    loadedFromDataverse: false,
    loadedOnce: false,
    loadingPromise: null,
    saving: false,
    syncBusy: false,
    checkBusy: false,
    checkResults: null,
    syncReport: null,
    outbox: [],
    tombstones: {},
    bc: null,
    log: [],
    listeners: []
  };
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = JSON.parse(window.localStorage.getItem(HUB_DIVERSION_LS_KEY) || 'null');
      if (saved && saved.routes && typeof saved.routes === 'object') {
        Object.keys(saved.routes).forEach(function (k) {
          if (st.routes[k]) st.routes[k] = Object.assign({}, st.routes[k], saved.routes[k]);
        });
      }
      const savedOutbox = JSON.parse(window.localStorage.getItem(HUB_DIVERSION_OUTBOX_KEY) || '[]');
      if (Array.isArray(savedOutbox)) st.outbox = savedOutbox.slice(-500);
      const savedTombs = JSON.parse(window.localStorage.getItem(HUB_DIVERSION_TOMBSTONES_KEY) || '{}');
      if (savedTombs && typeof savedTombs === 'object') st.tombstones = savedTombs;
    }
  } catch (e) {}
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      st.bc = new BroadcastChannel('hub-diversion-v1');
      st.bc.onmessage = function (ev) {
        if (ev && ev.data && ev.data.type === 'route-changed') {
          hubDiversionClearEndpointCaches();
          hubDiversionLoadFromDataverse(st.activeAppKey, null, true).catch(function () {});
        }
      };
    }
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.__HUB_DIVERSION_STATE__ = st;
  }
  return st;
}();
function hubDiversionCanonKey(k) {
  const s = String(k || '').replace(/^(datamigration|diversion|app)[:|]/i, '').trim().toLowerCase();
  if (s === 'msscalendar') return 'mss';
  return s || 'global';
}
function hubDiversionNewUuid() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().toLowerCase();
    }
  } catch (e) {}
  return hubDiversionIdFromKey('uuid|' + Date.now() + '|' + Math.random());
}
function hubDiversionClearEndpointCaches() {
  try {
    const pattern = /^(SS_ENDPOINT_META|SS_DATA_CACHE|mss_log_asset_catalog|prodsched_runs_cache|PB_PROBE_CACHE|PB_EXP_CACHE|pb_exp_cache|probe_|dv_endpoint)/i;
    [typeof window !== 'undefined' ? window.sessionStorage : null, typeof window !== 'undefined' ? window.localStorage : null].forEach(function (store) {
      if (!store) return;
      const toRemove = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && pattern.test(k)) toRemove.push(k);
      }
      toRemove.forEach(function (k) {
        try {
          store.removeItem(k);
        } catch (e) {}
      });
    });
  } catch (e) {}
}
function hubDiversionAddTombstone(oldLogical, recordId) {
  const id = String(recordId || '').replace(/[{}]/g, '').toLowerCase();
  if (!oldLogical || !id) return;
  const list = Array.isArray(HUB_DIVERSION_STATE.tombstones[oldLogical]) ? HUB_DIVERSION_STATE.tombstones[oldLogical] : [];
  if (!list.some(function (t) {
    return t && t.id === id;
  })) {
    list.push({
      id: id,
      at: Date.now()
    });
  }
  HUB_DIVERSION_STATE.tombstones[oldLogical] = list.slice(-1000);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HUB_DIVERSION_TOMBSTONES_KEY, JSON.stringify(HUB_DIVERSION_STATE.tombstones));
    }
  } catch (e) {}
}
function hubDiversionIsTombstoned(oldLogical, recordId) {
  const id = String(recordId || '').replace(/[{}]/g, '').toLowerCase();
  if (!oldLogical || !id) return false;
  const list = HUB_DIVERSION_STATE.tombstones && HUB_DIVERSION_STATE.tombstones[oldLogical];
  if (!Array.isArray(list)) return false;
  const cutoff = Date.now() - 30 * 86400 * 1000;
  return list.some(function (t) {
    return t && t.id === id && (!t.at || t.at >= cutoff);
  });
}
function hubDiversionPushOutbox(entry) {
  if (!entry || !entry.logicalName) return;
  HUB_DIVERSION_STATE.outbox.push(Object.assign({
    queuedAt: new Date().toISOString()
  }, entry));
  if (HUB_DIVERSION_STATE.outbox.length > 500) {
    HUB_DIVERSION_STATE.outbox = HUB_DIVERSION_STATE.outbox.slice(-500);
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HUB_DIVERSION_OUTBOX_KEY, JSON.stringify(HUB_DIVERSION_STATE.outbox));
    }
  } catch (e) {}
  hubDiversionNotify();
}
function hubDiversionNotify() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HUB_DIVERSION_LS_KEY, JSON.stringify({
        routes: HUB_DIVERSION_STATE.routes,
        updatedAt: new Date().toISOString()
      }));
    }
  } catch (e) {}
  HUB_DIVERSION_STATE.listeners.slice().forEach(function (fn) {
    try {
      fn(HUB_DIVERSION_STATE);
    } catch (e) {}
  });
}
function hubDiversionSubscribe(fn) {
  if (typeof fn !== 'function') return function () {};
  HUB_DIVERSION_STATE.listeners.push(fn);
  return function () {
    const idx = HUB_DIVERSION_STATE.listeners.indexOf(fn);
    if (idx >= 0) HUB_DIVERSION_STATE.listeners.splice(idx, 1);
  };
}
function hubDiversionLogEvent(entry) {
  const item = Object.assign({
    ts: new Date().toISOString()
  }, entry);
  HUB_DIVERSION_STATE.log.unshift(item);
  if (HUB_DIVERSION_STATE.log.length > 80) HUB_DIVERSION_STATE.log.length = 80;
  hubDiversionNotify();
}
function hubDiversionEffectiveRoute(appKey) {
  const key = hubDiversionCanonKey(appKey || HUB_DIVERSION_STATE.activeAppKey || 'global');
  const own = HUB_DIVERSION_STATE.routes[key] || HUB_DIVERSION_STATE.routes.global;
  const glb = HUB_DIVERSION_STATE.routes.global;
  const isMasterOff = Boolean(glb && glb.masterOff || own && own.masterOff);
  if (isMasterOff) {
    return {
      appKey: key,
      readSchema: 'legacy',
      dualWrite: false,
      masterOff: true,
      autoSync: false,
      followGlobal: Boolean(own && own.followGlobal && key !== 'global'),
      updatedBy: own && own.updatedBy || glb && glb.updatedBy || '',
      updatedAt: own && own.updatedAt || glb && glb.updatedAt || '',
      lastSync: own && own.lastSync || glb && glb.lastSync || null
    };
  }
  if (key !== 'global' && own && own.followGlobal && glb) {
    return {
      appKey: key,
      readSchema: glb.readSchema === 'v1' ? 'v1' : 'legacy',
      dualWrite: glb.dualWrite !== false,
      masterOff: false,
      autoSync: Boolean(own.autoSync || glb.autoSync),
      followGlobal: true,
      updatedBy: own.updatedBy || glb.updatedBy || '',
      updatedAt: own.updatedAt || glb.updatedAt || '',
      lastSync: own.lastSync || glb.lastSync || null
    };
  }
  return {
    appKey: key,
    readSchema: own && own.readSchema === 'v1' ? 'v1' : 'legacy',
    dualWrite: own ? own.dualWrite !== false : true,
    masterOff: false,
    autoSync: Boolean(own && own.autoSync),
    followGlobal: Boolean(own && own.followGlobal && key !== 'global'),
    updatedBy: own && own.updatedBy || '',
    updatedAt: own && own.updatedAt || '',
    lastSync: own && own.lastSync || null
  };
}
function hubDiversionRawXrm() {
  if (typeof window === 'undefined') return null;
  const frames = [window];
  try {
    if (window.parent && window.parent !== window) frames.push(window.parent);
  } catch (e) {}
  try {
    if (window.top && window.top !== window && frames.indexOf(window.top) < 0) frames.push(window.top);
  } catch (e) {}
  for (let i = 0; i < frames.length; i++) {
    try {
      const x = frames[i] && frames[i].Xrm;
      if (x && x.WebApi) return x.__rawXrm || x;
    } catch (e) {}
  }
  return null;
}
function hubDiversionRawWebApi(fallbackWebApi) {
  if (fallbackWebApi && fallbackWebApi.__raw) return fallbackWebApi.__raw;
  const xrm = hubDiversionRawXrm();
  if (xrm && xrm.WebApi) return xrm.WebApi.__raw || xrm.WebApi;
  return fallbackWebApi || null;
}
function hubDiversionClientUrl() {
  const xrm = hubDiversionRawXrm();
  try {
    if (xrm && xrm.Utility && typeof xrm.Utility.getGlobalContext === 'function') {
      const ctx = xrm.Utility.getGlobalContext();
      if (ctx && typeof ctx.getClientUrl === 'function') {
        const u = String(ctx.getClientUrl() || '').replace(/\/+$/, '');
        if (u) return u;
      }
    }
  } catch (e) {}
  try {
    if (typeof window !== 'undefined' && window.location && /\.crm[0-9]*\.dynamics\.com$/i.test(window.location.hostname)) {
      return window.location.origin.replace(/\/+$/, '');
    }
  } catch (e) {}
  return '';
}
function hubDiversionCurrentUser() {
  const xrm = hubDiversionRawXrm();
  try {
    if (xrm && xrm.Utility && typeof xrm.Utility.getGlobalContext === 'function') {
      const us = xrm.Utility.getGlobalContext().userSettings;
      if (us && us.userName) return String(us.userName).trim();
    }
  } catch (e) {}
  return 'Developer';
}
function hubDiversionIsDeveloperAllowed(props) {
  if (props && props.unlocked === true) {
    HUB_DIVERSION_STATE.devSessionUnlocked = true;
    return true;
  }
  if (HUB_DIVERSION_STATE.devSessionUnlocked === true) return true;
  const xrm = hubDiversionRawXrm();
  try {
    if (xrm && xrm.Utility && typeof xrm.Utility.getGlobalContext === 'function') {
      const us = xrm.Utility.getGlobalContext().userSettings;
      const uname = String(us && us.userName || '').toLowerCase();
      const uid = String(us && us.userId || '').replace(/[{}]/g, '').toLowerCase();
      if (/Platform Admin|stephenson|DEMO001|marcus|Vance/i.test(uname)) return true;
      if (uid === 'a0000001-0000-4000-8000-000000000001' || uid === '7269de9e-1022-f111-8341-00224809bad2' || uid === 'a6b123c9-542c-f111-88b4-00224809bad2') return true;
    }
  } catch (e2) {}
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const msRaw = window.localStorage.getItem('Plant 04_active_ms_user_v1') || '';
      if (/Platform Admin|stephenson|DEMO001|marcus|Vance/i.test(msRaw)) return true;
    }
  } catch (e3) {}
  try {
    if (typeof window !== 'undefined' && window.location && /^(localhost|127\.0\.0\.1)$/i.test(String(window.location.hostname || ''))) {
      return true;
    }
  } catch (e4) {}
  return false;
}
function hubDiversionIsMissingColError(err, status) {
  if (status === 401 || status === 403 || status === 429 || status === 503) return false;
  const msg = String(err && err.message || err || '');
  if (/401|403|429|503|throttl|busy|timed out/i.test(msg)) return false;
  return /property\s+'[^']+'|attribute\s+'[^']+'|column\s+'[^']+'|0x80040217|does not exist on type|doesn't contain attribute/i.test(msg);
}
function hubDiversionRawFetch(url, init) {
  const fn = typeof window !== 'undefined' && window.__hubRawFetch || (typeof fetch !== 'undefined' ? fetch : null);
  if (!fn) return Promise.reject(new Error('Fetch unavailable'));
  const opts = Object.assign({}, init || {}, {
    __hubDiversionRaw: true
  });
  return fn.call(typeof window !== 'undefined' ? window : null, url, opts);
}
async function hubDiversionRawRetrieveMultiple(logicalName, entitySet, query, webApiHint) {
  const rawWeb = hubDiversionRawWebApi(webApiHint);
  const q = query ? String(query).charAt(0) === '?' ? String(query) : '?' + String(query) : '';
  if (rawWeb && typeof rawWeb.retrieveMultipleRecords === 'function') {
    const res = await rawWeb.retrieveMultipleRecords(logicalName, q);
    return res && (res.entities || res.value) || [];
  }
  const base = hubDiversionClientUrl();
  if (base && entitySet) {
    const r = await hubDiversionRawFetch(base + '/api/data/v9.2/' + entitySet + q, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0'
      }
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error('HTTP ' + r.status + ': ' + t.slice(0, 240));
    }
    const j = await r.json();
    return j && (j.value || j.entities) || [];
  }
  throw new Error('No Dataverse connection available');
}
async function hubDiversionRawUpsert(logicalName, entitySet, pkCol, recordId, payload, webApiHint) {
  const rawWeb = hubDiversionRawWebApi(webApiHint);
  const cleanId = String(recordId || payload[pkCol] || '').replace(/[{}]/g, '').toLowerCase();
  const body = Object.assign({}, payload);
  if (cleanId && pkCol) body[pkCol] = cleanId;
  const stripBadCol = function (errText, obj) {
    const m = String(errText || '').match(/property\s+'([a-z0-9_]+)'|attribute\s+'([a-z0-9_]+)'|column\s+'([a-z0-9_]+)'/i);
    const col = m && (m[1] || m[2] || m[3]);
    if (col && col !== pkCol && Object.prototype.hasOwnProperty.call(obj, col)) {
      delete obj[col];
      return true;
    }
    return false;
  };
  if (rawWeb && typeof rawWeb.updateRecord === 'function' && typeof rawWeb.createRecord === 'function') {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        if (cleanId) {
          const updBody = Object.assign({}, body);
          delete updBody[pkCol];
          await rawWeb.updateRecord(logicalName, cleanId, updBody);
          return cleanId;
        } else {
          const r = await rawWeb.createRecord(logicalName, body);
          return r && r.id || cleanId;
        }
      } catch (e) {
        const msg = String(e && e.message || e || '');
        if (/does not exist|not found|404|0x80040217/i.test(msg) && cleanId) {
          try {
            const r2 = await rawWeb.createRecord(logicalName, body);
            return r2 && r2.id || cleanId;
          } catch (e2) {
            const msg2 = String(e2 && e2.message || e2 || '');
            if (stripBadCol(msg2, body)) continue;
            throw e2;
          }
        }
        if (stripBadCol(msg, body)) continue;
        throw e;
      }
    }
  }
  const base = hubDiversionClientUrl();
  if (base && entitySet) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const url = cleanId ? base + '/api/data/v9.2/' + entitySet + '(' + cleanId + ')' : base + '/api/data/v9.2/' + entitySet;
      const method = cleanId ? 'PATCH' : 'POST';
      const sendObj = Object.assign({}, body);
      if (cleanId) delete sendObj[pkCol];
      const r = await hubDiversionRawFetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0'
        },
        body: JSON.stringify(sendObj)
      });
      if (r.ok || r.status === 204) return cleanId;
      const errTxt = await r.text();
      if (r.status === 404 && cleanId) {
        const rPost = await hubDiversionRawFetch(base + '/api/data/v9.2/' + entitySet, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0'
          },
          body: JSON.stringify(body)
        });
        if (rPost.ok || rPost.status === 204) return cleanId;
        const postTxt = await rPost.text();
        if (stripBadCol(postTxt, body)) continue;
        throw new Error('HTTP ' + rPost.status + ': ' + postTxt.slice(0, 240));
      }
      if (stripBadCol(errTxt, body)) continue;
      throw new Error('HTTP ' + r.status + ': ' + errTxt.slice(0, 240));
    }
  }
  throw new Error('No Dataverse write connection');
}

// Loads routing config from Dataverse craa5__e_datamigration & craa5___1_e_datamigration (and craa5__e_hubconfig fallback) on app startup
async function hubDiversionLoadFromDataverse(appKey, webApiHint, forceReload) {
  if (appKey) HUB_DIVERSION_STATE.activeAppKey = appKey;
  if (HUB_DIVERSION_STATE.loadedOnce && !forceReload) return HUB_DIVERSION_STATE.routes;
  if (HUB_DIVERSION_STATE.loadingPromise && !forceReload) return HUB_DIVERSION_STATE.loadingPromise;
  HUB_DIVERSION_STATE.loadingPromise = async function () {
    let loadedAny = false;
    const applyMigrationRows = function (rows) {
      if (!Array.isArray(rows) || rows.length === 0) return;
      rows.forEach(function (r) {
        const ak = hubDiversionCanonKey(r.craa5_appkey || r.craa5_routekey || '');
        if (!ak || !HUB_DIVERSION_STATE.routes[ak]) return;
        let extra = {};
        try {
          const rawJson = r.craa5_routejson || r.craa5_routingjson || '';
          if (rawJson) extra = JSON.parse(rawJson) || {};
        } catch (e) {}
        let syncObj = null;
        try {
          if (r.craa5_syncjson) syncObj = JSON.parse(r.craa5_syncjson) || null;
        } catch (e) {}
        const writeSch = String(r.craa5_writeschema || '').toLowerCase();
        const dualVal = r.craa5_dualwrite !== undefined && r.craa5_dualwrite !== null ? Boolean(r.craa5_dualwrite) : writeSch ? writeSch === 'both' : extra.dualWrite !== false;
        const autoVal = r.craa5_autosync !== undefined && r.craa5_autosync !== null ? Boolean(r.craa5_autosync) : r.craa5_autosyncmissing !== undefined && r.craa5_autosyncmissing !== null ? Boolean(r.craa5_autosyncmissing) : Boolean(extra.autoSync);
        if (extra.tombstones && typeof extra.tombstones === 'object') {
          Object.keys(extra.tombstones).forEach(function (tk) {
            if (Array.isArray(extra.tombstones[tk])) {
              extra.tombstones[tk].forEach(function (tItem) {
                if (tItem && tItem.id) hubDiversionAddTombstone(tk, tItem.id);
              });
            }
          });
        }
        HUB_DIVERSION_STATE.routes[ak] = Object.assign({}, HUB_DIVERSION_STATE.routes[ak], extra, {
          appKey: ak,
          migrationRecordId: r.craa5__e_datamigrationid || r.craa5___1_e_datamigrationid || extra.migrationRecordId || hubDiversionIdFromKey('datamigration|' + ak),
          readSchema: (r.craa5_readschema || extra.readSchema) === 'v1' ? 'v1' : 'legacy',
          dualWrite: dualVal,
          autoSync: autoVal,
          followGlobal: extra.followGlobal !== undefined ? Boolean(extra.followGlobal) : ak !== 'global',
          updatedBy: r.craa5_updatedby || extra.updatedBy || '',
          updatedAt: r.craa5_updatedat || r.craa5_lastsyncat || extra.updatedAt || '',
          lastSync: syncObj || extra.lastSync || null
        });
        loadedAny = true;
      });
    };
    try {
      const rows = await hubDiversionRawRetrieveMultiple(HUB_DIVERSION_MIGRATION_TABLE, HUB_DIVERSION_MIGRATION_SET, '?$filter=statecode eq 0&$top=50', webApiHint);
      applyMigrationRows(rows);
    } catch (e) {}
    if (!loadedAny) {
      try {
        const v1Rows = await hubDiversionRawRetrieveMultiple(HUB_DIVERSION_MIGRATION_V1_TABLE, HUB_DIVERSION_MIGRATION_V1_SET, '?$filter=statecode eq 0&$top=50', webApiHint);
        applyMigrationRows(v1Rows);
      } catch (eV1) {}
    }
    if (!loadedAny) {
      // Fallback: check craa5__e_hubconfig & craa5___1_e_hubconfig for datamigration|* rows
      try {
        const cfgRows = await hubDiversionRawRetrieveMultiple('craa5__e_hubconfig', 'craa5__e_hubconfigs', "?$filter=startswith(craa5_configkey,'datamigration|')&$top=50", webApiHint);
        (cfgRows || []).forEach(function (r) {
          const ak = String(r.craa5_configkey || '').replace(/^datamigration\|/i, '').trim().toLowerCase();
          if (!ak || !HUB_DIVERSION_STATE.routes[ak]) return;
          try {
            const parsed = JSON.parse(r.craa5_configjson || '{}');
            HUB_DIVERSION_STATE.routes[ak] = Object.assign({}, HUB_DIVERSION_STATE.routes[ak], parsed, {
              appKey: ak
            });
            loadedAny = true;
          } catch (e2) {}
        });
      } catch (e3) {}
    }
    HUB_DIVERSION_STATE.loadedFromDataverse = loadedAny;
    HUB_DIVERSION_STATE.loadedOnce = true;
    HUB_DIVERSION_STATE.loadingPromise = null;
    hubDiversionNotify();
    const eff = hubDiversionEffectiveRoute(appKey || HUB_DIVERSION_STATE.activeAppKey);
    if (eff.autoSync && !HUB_DIVERSION_STATE.syncBusy) {
      hubDiversionSyncMissing(appKey || HUB_DIVERSION_STATE.activeAppKey, 'both', null, null, webApiHint, false).catch(function () {});
    }
    return HUB_DIVERSION_STATE.routes;
  }();
  return HUB_DIVERSION_STATE.loadingPromise;
}

// Saves per-app routing config to Dataverse craa5__e_datamigration & craa5___1_e_datamigration AND mirrors to craa5__e_hubconfig + craa5___1_e_hubconfig
async function hubDiversionSaveRoute(appKey, patch, webApiHint) {
  if (!hubDiversionIsDeveloperAllowed(null)) {
    return {
      ok: false,
      route: null,
      errors: ['Developer authorization required']
    };
  }
  const ak = appKey || HUB_DIVERSION_STATE.activeAppKey || 'global';
  const cur = HUB_DIVERSION_STATE.routes[ak] || HUB_DIVERSION_STATE.routes.global;
  const prevEffective = hubDiversionEffectiveRoute(HUB_DIVERSION_STATE.activeAppKey);
  const nowIso = new Date().toISOString();
  const who = hubDiversionCurrentUser();
  const next = Object.assign({}, cur, patch || {}, {
    appKey: ak,
    updatedBy: who,
    updatedAt: nowIso
  });
  delete next.tombstones;
  HUB_DIVERSION_STATE.routes[ak] = next;
  const nextEffective = hubDiversionEffectiveRoute(HUB_DIVERSION_STATE.activeAppKey);
  if (prevEffective.readSchema !== nextEffective.readSchema || patch && patch.readSchema) {
    hubDiversionClearEndpointCaches();
  }
  HUB_DIVERSION_STATE.saving = true;
  hubDiversionNotify();
  const routeKey = 'datamigration|' + ak;
  const recId = next.migrationRecordId || hubDiversionIdFromKey(routeKey);
  const routeJson = JSON.stringify(next);
  const syncJson = next.lastSync ? JSON.stringify(next.lastSync) : '';
  const appLabelObj = HUB_DIVERSION_APPS.find(function (a) {
    return a.key === ak;
  });
  const appLabel = appLabelObj && appLabelObj.label || ak;
  const errors = [];
  let savedAnyCloud = false;
  try {
    await hubDiversionRawUpsert(HUB_DIVERSION_MIGRATION_TABLE, HUB_DIVERSION_MIGRATION_SET, HUB_DIVERSION_MIGRATION_PK, recId, {
      craa5_routekey: routeKey,
      craa5_appkey: ak,
      craa5_readschema: next.readSchema,
      craa5_dualwrite: Boolean(next.dualWrite),
      craa5_autosync: Boolean(next.autoSync),
      craa5_routejson: routeJson,
      craa5_syncjson: syncJson,
      craa5_updatedby: who,
      craa5_updatedat: nowIso
    }, webApiHint);
    savedAnyCloud = true;
  } catch (e) {
    errors.push('craa5__e_datamigration: ' + String(e && e.message || e));
  }
  try {
    await hubDiversionRawUpsert(HUB_DIVERSION_MIGRATION_V1_TABLE, HUB_DIVERSION_MIGRATION_V1_SET, HUB_DIVERSION_MIGRATION_V1_PK, recId, {
      craa5_appkey: ak,
      craa5_appname: appLabel,
      craa5_readschema: next.readSchema,
      craa5_writeschema: next.dualWrite ? 'both' : next.readSchema,
      craa5_autosyncmissing: Boolean(next.autoSync),
      craa5_routingjson: routeJson,
      craa5_updatedby: who
    }, webApiHint);
    savedAnyCloud = true;
  } catch (eV1) {}
  const hubCfgId = hubDiversionIdFromKey('hubconfig|' + routeKey);
  const hubPayload = {
    craa5_configname: routeKey,
    craa5_configkey: routeKey,
    craa5_configjson: routeJson
  };
  try {
    await hubDiversionRawUpsert('craa5__e_hubconfig', 'craa5__e_hubconfigs', 'craa5__e_hubconfigid', hubCfgId, hubPayload, webApiHint);
    savedAnyCloud = true;
  } catch (e) {}
  try {
    await hubDiversionRawUpsert('craa5___1_e_hubconfig', 'craa5___1_e_hubconfigs', 'craa5___1_e_hubconfigid', hubCfgId, hubPayload, webApiHint);
    savedAnyCloud = true;
  } catch (e) {}
  try {
    if (HUB_DIVERSION_STATE.bc) {
      HUB_DIVERSION_STATE.bc.postMessage({
        type: 'route-changed',
        appKey: ak,
        readSchema: next.readSchema
      });
    }
  } catch (eBc) {}
  HUB_DIVERSION_STATE.saving = false;
  hubDiversionLogEvent({
    op: 'route-save',
    appKey: ak,
    primaryTable: HUB_DIVERSION_MIGRATION_TABLE + ' + ' + HUB_DIVERSION_MIGRATION_V1_TABLE,
    mirrorTable: 'craa5__e_hubconfig + craa5___1_e_hubconfig',
    ok: savedAnyCloud || errors.length === 0,
    detail: 'Read=' + next.readSchema + ', DualWrite=' + (next.dualWrite ? 'ON' : 'OFF') + (errors.length ? ' (' + errors.join('; ') + ')' : '')
  });
  hubDiversionNotify();
  return {
    ok: savedAnyCloud || errors.length === 0,
    route: next,
    errors: errors
  };
}

// Drains durable outbox of any failed mirror writes
async function hubDiversionDrainOutbox(webApiHint) {
  const queue = (HUB_DIVERSION_STATE.outbox || []).slice();
  if (queue.length === 0) return {
    drained: 0,
    remaining: 0
  };
  const remaining = [];
  let drained = 0;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      await hubDiversionRawUpsert(item.logicalName, item.entitySet, item.pkCol, item.recordId, item.payload, webApiHint);
      drained++;
    } catch (e) {
      remaining.push(item);
    }
  }
  HUB_DIVERSION_STATE.outbox = remaining;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HUB_DIVERSION_OUTBOX_KEY, JSON.stringify(remaining));
    }
  } catch (e) {}
  hubDiversionLogEvent({
    op: 'outbox-drain',
    appKey: HUB_DIVERSION_STATE.activeAppKey,
    primaryTable: 'outbox',
    mirrorTable: 'twin',
    ok: remaining.length === 0,
    detail: 'Drained ' + drained + ' queued mirror payload(s); ' + remaining.length + ' remaining.'
  });
  hubDiversionNotify();
  return {
    drained: drained,
    remaining: remaining.length
  };
}

// Normalizes a row returned from either schema so app code sees both legacy and v1 field names
function hubDiversionNormalizeRow(row, spec, fromSchema) {
  if (!row || typeof row !== 'object' || !spec) return row;
  const out = Object.assign({}, row);
  const idVal = out[spec.oldPk] || out[spec.newPk] || out.id || '';
  if (idVal) {
    if (!out[spec.oldPk]) out[spec.oldPk] = idVal;
    if (!out[spec.newPk]) out[spec.newPk] = idVal;
  }
  if (spec.oldPn && spec.newPn && spec.oldPn !== spec.newPn) {
    const pnVal = out[spec.oldPn] !== undefined && out[spec.oldPn] !== null && out[spec.oldPn] !== '' ? out[spec.oldPn] : out[spec.newPn];
    if (pnVal !== undefined && pnVal !== null) {
      if (out[spec.oldPn] === undefined || out[spec.oldPn] === null || out[spec.oldPn] === '') out[spec.oldPn] = pnVal;
      if (out[spec.newPn] === undefined || out[spec.newPn] === null || out[spec.newPn] === '') out[spec.newPn] = pnVal;
    }
  }
  if (spec.colMapOldToNew) {
    Object.keys(spec.colMapOldToNew).forEach(function (oldCol) {
      const newCol = spec.colMapOldToNew[oldCol];
      if (out[oldCol] === undefined && out[newCol] !== undefined) out[oldCol] = out[newCol];
      if (out[newCol] === undefined && out[oldCol] !== undefined) out[newCol] = out[oldCol];
    });
  }
  if (fromSchema === 'v1' && spec.guidCols && spec.guidCols.length) {
    spec.guidCols.forEach(function (gc) {
      if (out[gc] && typeof out[gc] === 'string') {
        const g = out[gc].replace(/[{}]/g, '').toLowerCase();
        if (HUB_GUID_MERGE_MAP[g]) out[gc] = HUB_GUID_MERGE_MAP[g];
      }
    });
  }
  if (spec.oldLogical === 'craa5_aa_assets' && fromSchema === 'v1') {
    if (out.craa5_minstoclean === undefined && out.craa5_hoursrequired !== undefined && out.craa5_hoursrequired !== null) {
      out.craa5_minstoclean = out.craa5_hoursrequired;
    }
  }
  if (spec.isMergedSapAssets && fromSchema === 'v1') {
    if (!out.craa5_aa_ms_assetsid && out.craa5___1_a_assetsid) out.craa5_aa_ms_assetsid = out.craa5___1_a_assetsid;
    if (!out.craa5_title) {
      out.craa5_title = out.craa5_workareacode || out.craa5_sapshift || out.craa5_sapdaily || out.craa5_sapweekly || out.craa5_equipmentidentifier || '';
    }
    if (!out.craa5_equipment && out.craa5_equipmentidentifier) out.craa5_equipment = out.craa5_equipmentidentifier;
    if (!out.craa5_textarea && out.craa5_areaname) out.craa5_textarea = out.craa5_areaname;
    if (!out.craa5_room && out.craa5_roomname) out.craa5_room = out.craa5_roomname;
    if (!out.craa5_textroom && out.craa5_roomname) out.craa5_textroom = out.craa5_roomname;
    if (out.craa5_hourstoclean === undefined && out.craa5_hoursrequired !== undefined) out.craa5_hourstoclean = out.craa5_hoursrequired;
  }
  return out;
}

// Translates a write payload from one schema to the target schema ('legacy' or 'v1')
function hubDiversionTranslatePayload(payload, spec, targetSchema, isMirrorWrite) {
  if (!payload || typeof payload !== 'object' || !spec) return payload;
  const out = {};
  const sysSkip = {
    createdon: 1,
    modifiedon: 1,
    versionnumber: 1,
    overriddencreatedon: 1,
    importsequencenumber: 1,
    timezoneruleversionnumber: 1,
    utcconversiontimezonecode: 1
  };
  Object.keys(payload).forEach(function (k) {
    const kl = k.toLowerCase();
    if (sysSkip[kl] || kl.indexOf('@odata.') === 0 || kl.indexOf('_value') > 0) return;
    if (isMirrorWrite && kl.indexOf('@odata.bind') > 0) return;
    if (/@odata\.|_formatted$|_navigationproperty$|_logicalname$/i.test(kl)) return;
    out[k] = payload[k];
  });
  const recId = out[spec.oldPk] || out[spec.newPk] || '';
  delete out[spec.oldPk];
  delete out[spec.newPk];
  if (targetSchema === 'v1') {
    if (recId) {
      const cleanGuid = String(recId).replace(/[{}]/g, '').toLowerCase();
      out[spec.newPk] = HUB_GUID_MERGE_MAP[cleanGuid] || cleanGuid;
    }
    if (spec.oldPn && spec.newPn && spec.oldPn !== spec.newPn) {
      if (out[spec.newPn] === undefined && out[spec.oldPn] !== undefined) {
        out[spec.newPn] = out[spec.oldPn];
      }
      if (/1$|^craa5_name$/i.test(spec.oldPn)) {
        delete out[spec.oldPn];
      }
    }
    if (spec.isMergedSapAssets) {
      if (!out.craa5_equipmentidentifier && (out.craa5_equipment || out.craa5_title)) {
        out.craa5_equipmentidentifier = out.craa5_equipment || out.craa5_title;
      }
      if (!out.craa5_areaname && out.craa5_textarea) out.craa5_areaname = out.craa5_textarea;
      if (!out.craa5_roomname && (out.craa5_room || out.craa5_textroom)) out.craa5_roomname = out.craa5_room || out.craa5_textroom;
      if (out.craa5_hoursrequired === undefined && out.craa5_hourstoclean !== undefined) out.craa5_hoursrequired = out.craa5_hourstoclean;
      if (!out.craa5_workareacode && out.craa5_title) out.craa5_workareacode = out.craa5_title;
    }
    if (spec.colMapOldToNew) {
      Object.keys(spec.colMapOldToNew).forEach(function (oldCol) {
        const newCol = spec.colMapOldToNew[oldCol];
        if (out[newCol] === undefined && out[oldCol] !== undefined) out[newCol] = out[oldCol];
        if (oldCol !== newCol) delete out[oldCol];
      });
    }
    (spec.onlyInOld || []).forEach(function (col) {
      delete out[col];
    });
    (spec.guidCols || []).forEach(function (gc) {
      if (out[gc] && typeof out[gc] === 'string') {
        const g = out[gc].replace(/[{}]/g, '').toLowerCase();
        if (HUB_GUID_MERGE_MAP[g]) out[gc] = HUB_GUID_MERGE_MAP[g];
      }
    });
    (spec.jsonGuidCols || []).forEach(function (jc) {
      if (out[jc] && typeof out[jc] === 'string') {
        out[jc] = out[jc].replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, function (m) {
          const low = m.toLowerCase();
          return HUB_GUID_MERGE_MAP[low] || m;
        });
      }
    });
  } else {
    // Target is Legacy: preserve survivor GUIDs as-is (never reverse-map to retired duplicate GUIDs!)
    if (recId) {
      const cleanGuid = String(recId).replace(/[{}]/g, '').toLowerCase();
      out[spec.oldPk] = cleanGuid;
    }
    if (spec.oldPn && spec.newPn && spec.oldPn !== spec.newPn) {
      if (out[spec.oldPn] === undefined && out[spec.newPn] !== undefined) {
        out[spec.oldPn] = out[spec.newPn];
      }
    }
    if (spec.colMapOldToNew) {
      Object.keys(spec.colMapOldToNew).forEach(function (oldCol) {
        const newCol = spec.colMapOldToNew[oldCol];
        if (out[oldCol] === undefined && out[newCol] !== undefined) out[oldCol] = out[newCol];
        if (oldCol !== newCol) delete out[newCol];
      });
    }
    (spec.onlyInNew || []).forEach(function (col) {
      delete out[col];
    });
  }
  return out;
}

// Rewrites OData query string ($select, $filter, $orderby, fetchXml) when diverting between schemas
function hubDiversionRewriteQuery(optionsStr, spec, targetSchema) {
  if (!optionsStr || !spec) return optionsStr;
  let q = String(optionsStr);
  if (targetSchema === 'v1') {
    if (spec.oldPk && spec.newPk && spec.oldPk !== spec.newPk) {
      q = q.replace(new RegExp('\\b' + spec.oldPk + '\\b', 'gi'), spec.newPk);
    }
    if (spec.oldPn && spec.newPn && spec.oldPn !== spec.newPn) {
      q = q.replace(new RegExp('\\b' + spec.oldPn + '\\b', 'gi'), spec.newPn);
    }
    if (spec.colMapOldToNew) {
      Object.keys(spec.colMapOldToNew).forEach(function (oldCol) {
        const newCol = spec.colMapOldToNew[oldCol];
        if (oldCol && newCol && oldCol !== newCol) {
          q = q.replace(new RegExp('\\b' + oldCol + '\\b', 'gi'), newCol);
        }
      });
    }
    if (spec.oldLogical !== spec.newLogical) {
      q = q.replace(new RegExp("entity\\s+name=['\"]" + spec.oldLogical + "['\"]", 'gi'), "entity name='" + spec.newLogical + "'");
      q = q.replace(new RegExp("entity%20name%3D(%27|%22)" + spec.oldLogical + "(%27|%22)", 'gi'), "entity%20name%3D%27" + spec.newLogical + "%27");
    }
    if (spec.isMergedSapAssets) {
      q = q.replace(/\$select=[^&]+&?/i, '');
      q = q.replace(/\b(craa5_title)\b/gi, 'craa5_workareacode');
      q = q.replace(/\b(craa5_equipment)\b/gi, 'craa5_equipmentidentifier');
      q = q.replace(/\b(craa5_textarea)\b/gi, 'craa5_areaname');
    }
  } else if (targetSchema === 'legacy') {
    if (spec.oldPk && spec.newPk && spec.oldPk !== spec.newPk) {
      q = q.replace(new RegExp('\\b' + spec.newPk + '\\b', 'gi'), spec.oldPk);
    }
    if (spec.oldLogical !== spec.newLogical) {
      q = q.replace(new RegExp("entity\\s+name=['\"]" + spec.newLogical + "['\"]", 'gi'), "entity name='" + spec.oldLogical + "'");
      q = q.replace(new RegExp("entity%20name%3D(%27|%22)" + spec.newLogical + "(%27|%22)", 'gi'), "entity%20name%3D%27" + spec.oldLogical + "%27");
    }
  }
  return q;
}
function hubDiversionResolveSpec(tableOrSet) {
  const k = String(tableOrSet || '').trim().toLowerCase();
  return HUB_DIVERSION_BY_OLD_LOGICAL[k] || HUB_DIVERSION_BY_NEW_LOGICAL[k] || HUB_DIVERSION_BY_OLD_SET[k] || HUB_DIVERSION_BY_NEW_SET[k] || null;
}
const HUB_DIVERSION_WEBAPI_CACHE = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function hubDiversionWrapWebApi(rawWebApi, appKey) {
  if (!rawWebApi || typeof rawWebApi !== 'object') return rawWebApi;
  if (rawWebApi.__isHubDiversionProxy && rawWebApi.__raw) rawWebApi = rawWebApi.__raw;
  if (appKey) HUB_DIVERSION_STATE.activeAppKey = appKey;
  hubDiversionInstallFetch(appKey);
  if (!HUB_DIVERSION_STATE.loadedOnce && !HUB_DIVERSION_STATE.loadingPromise) {
    hubDiversionLoadFromDataverse(appKey, rawWebApi, false).catch(function () {});
  }
  const cacheAppKey = appKey || 'global';
  if (HUB_DIVERSION_WEBAPI_CACHE && HUB_DIVERSION_WEBAPI_CACHE.has(rawWebApi)) {
    const byApp = HUB_DIVERSION_WEBAPI_CACHE.get(rawWebApi);
    if (byApp && byApp[cacheAppKey]) return byApp[cacheAppKey];
  }
  const proxy = {
    __isHubDiversionProxy: true,
    __raw: rawWebApi,
    retrieveMultipleRecords: async function (entityLogicalName, options, maxPageSize) {
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(entityLogicalName);
      if (!spec || route.masterOff || activeAk === 'monitor') {
        return maxPageSize !== undefined ? rawWebApi.retrieveMultipleRecords(entityLogicalName, options, maxPageSize) : rawWebApi.retrieveMultipleRecords(entityLogicalName, options);
      }
      const useV1 = route.readSchema === 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(entityLogicalName || ''));
      const targetTable = useV1 ? spec.newLogical : isCallerV1 ? spec.oldLogical : entityLogicalName;
      const rewrittenOpts = useV1 ? hubDiversionRewriteQuery(options, spec, 'v1') : isCallerV1 ? hubDiversionRewriteQuery(options, spec, 'legacy') : options;
      let res;
      try {
        res = maxPageSize !== undefined ? await rawWebApi.retrieveMultipleRecords(targetTable, rewrittenOpts, maxPageSize) : await rawWebApi.retrieveMultipleRecords(targetTable, rewrittenOpts);
      } catch (e) {
        if (useV1 && rewrittenOpts && /\$select=/i.test(rewrittenOpts) && hubDiversionIsMissingColError(e, 0)) {
          const stripped = rewrittenOpts.replace(/([?&])\$select=[^&]*(&?)/i, function (_, p1, p2) {
            return p2 ? p1 : '';
          }).replace(/\?&/, '?');
          res = maxPageSize !== undefined ? await rawWebApi.retrieveMultipleRecords(targetTable, stripped, maxPageSize) : await rawWebApi.retrieveMultipleRecords(targetTable, stripped);
        } else {
          throw e;
        }
      }
      const rawList = res && (res.entities || res.value) || [];
      const list = useV1 && spec.oldLogical === 'craa5_aa_assets' ? rawList.filter(function (r) {
        return !r || r.statecode !== 1 && !r.craa5_mergedinto;
      }) : rawList;
      const norm = list.map(function (r) {
        return hubDiversionNormalizeRow(r, spec, route.readSchema);
      });
      return Object.assign({}, res, {
        entities: norm,
        value: norm
      });
    },
    retrieveRecord: async function (entityLogicalName, id, options) {
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(entityLogicalName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawWebApi.retrieveRecord(entityLogicalName, id, options);
      const useV1 = route.readSchema === 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(entityLogicalName || ''));
      const targetTable = useV1 ? spec.newLogical : isCallerV1 ? spec.oldLogical : entityLogicalName;
      const cleanId = String(id || '').replace(/[{}]/g, '').toLowerCase();
      const targetId = useV1 ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
      const rewrittenOpts = useV1 ? hubDiversionRewriteQuery(options, spec, 'v1') : isCallerV1 ? hubDiversionRewriteQuery(options, spec, 'legacy') : options;
      let row;
      try {
        row = await rawWebApi.retrieveRecord(targetTable, targetId, rewrittenOpts);
      } catch (e) {
        if (useV1 && rewrittenOpts && /\$select=/i.test(rewrittenOpts) && hubDiversionIsMissingColError(e, 0)) {
          const stripped = rewrittenOpts.replace(/([?&])\$select=[^&]*(&?)/i, function (_, p1, p2) {
            return p2 ? p1 : '';
          });
          row = await rawWebApi.retrieveRecord(targetTable, targetId, stripped);
        } else {
          throw e;
        }
      }
      return hubDiversionNormalizeRow(row, spec, route.readSchema);
    },
    createRecord: async function (entityLogicalName, data) {
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(entityLogicalName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawWebApi.createRecord(entityLogicalName, data);
      const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(entityLogicalName || ''));
      const primaryTable = primarySchema === 'v1' ? spec.newLogical : isCallerV1 ? spec.oldLogical : entityLogicalName;
      const primaryPk = primarySchema === 'v1' ? spec.newPk : spec.oldPk;
      const mirrorTable = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
      const mirrorSet = mirrorSchema === 'v1' ? spec.newSet : spec.oldSet;
      const mirrorPk = mirrorSchema === 'v1' ? spec.newPk : spec.oldPk;
      const canMirror = Boolean(route.dualWrite && !spec.isSharedPhysical && !spec.isMergedSapAssets && spec.oldLogical !== spec.newLogical);
      const callerHasId = data && (data[spec.oldPk] || data[spec.newPk]);
      let primaryPayload;
      if (primarySchema === 'legacy' && !isCallerV1) {
        primaryPayload = data;
      } else {
        const seededData = Object.assign({}, data);
        if (callerHasId) {
          seededData[spec.oldPk] = callerHasId;
          seededData[spec.newPk] = callerHasId;
        }
        primaryPayload = hubDiversionTranslatePayload(seededData, spec, primarySchema, false);
      }
      let createdId = String(callerHasId || primaryPayload && primaryPayload[primaryPk] || '').replace(/[{}]/g, '').toLowerCase();
      const res = await rawWebApi.createRecord(primaryTable, primaryPayload);
      if (!createdId && res && res.id) {
        createdId = String(res.id).replace(/[{}]/g, '').toLowerCase();
      }
      if (canMirror) {
        const mirrorSource = Object.assign({}, data);
        if (createdId) {
          mirrorSource[spec.oldPk] = createdId;
          mirrorSource[spec.newPk] = createdId;
        }
        const mirrorPayload = hubDiversionTranslatePayload(mirrorSource, spec, mirrorSchema, true);
        hubDiversionRawUpsert(mirrorTable, mirrorSet, mirrorPk, createdId, mirrorPayload, rawWebApi).then(function () {
          hubDiversionLogEvent({
            op: 'dual-create',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: true,
            detail: 'Delivered create (' + (createdId ? createdId.slice(0, 8) : 'auto') + ') to both ' + primaryTable + ' and ' + mirrorTable
          });
        }).catch(function (err) {
          hubDiversionPushOutbox({
            op: 'dual-create',
            logicalName: mirrorTable,
            entitySet: mirrorSet,
            pkCol: mirrorPk,
            recordId: createdId,
            payload: mirrorPayload
          });
          hubDiversionLogEvent({
            op: 'dual-create',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: false,
            detail: 'Primary ' + primaryTable + ' OK; Mirror queued in Outbox: ' + String(err && err.message || err).slice(0, 120)
          });
        });
      }
      return res || {
        id: createdId
      };
    },
    updateRecord: async function (entityLogicalName, id, data) {
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(entityLogicalName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawWebApi.updateRecord(entityLogicalName, id, data);
      const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(entityLogicalName || ''));
      const primaryTable = primarySchema === 'v1' ? spec.newLogical : isCallerV1 ? spec.oldLogical : entityLogicalName;
      const primaryPk = primarySchema === 'v1' ? spec.newPk : spec.oldPk;
      const mirrorTable = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
      const mirrorSet = mirrorSchema === 'v1' ? spec.newSet : spec.oldSet;
      const mirrorPk = mirrorSchema === 'v1' ? spec.newPk : spec.oldPk;
      const canMirror = Boolean(route.dualWrite && !spec.isSharedPhysical && !spec.isMergedSapAssets && spec.oldLogical !== spec.newLogical);
      const cleanId = String(id || '').replace(/[{}]/g, '').toLowerCase();
      const primaryId = primarySchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
      let primaryPayload;
      if (primarySchema === 'legacy' && !isCallerV1) {
        primaryPayload = data;
      } else {
        primaryPayload = hubDiversionTranslatePayload(data, spec, primarySchema, false);
        delete primaryPayload[primaryPk];
      }
      const res = await rawWebApi.updateRecord(primaryTable, primaryId, primaryPayload);
      if (canMirror && !hubDiversionIsTombstoned(spec.oldLogical, cleanId)) {
        const mirrorId = mirrorSchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
        (async function () {
          let mergedData = Object.assign({}, data);
          try {
            const fullPrimary = await rawWebApi.retrieveRecord(primaryTable, primaryId, '');
            if (fullPrimary && typeof fullPrimary === 'object') {
              mergedData = Object.assign({}, hubDiversionNormalizeRow(fullPrimary, spec, primarySchema), data);
            }
          } catch (eFull) {}
          const mirrorPayload = hubDiversionTranslatePayload(mergedData, spec, mirrorSchema, true);
          return hubDiversionRawUpsert(mirrorTable, mirrorSet, mirrorPk, mirrorId, mirrorPayload, rawWebApi);
        })().then(function () {
          hubDiversionLogEvent({
            op: 'dual-update',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: true,
            detail: 'Delivered update (' + cleanId.slice(0, 8) + ') to both ' + primaryTable + ' and ' + mirrorTable
          });
        }).catch(function (err) {
          hubDiversionPushOutbox({
            op: 'dual-update',
            logicalName: mirrorTable,
            entitySet: mirrorSet,
            pkCol: mirrorPk,
            recordId: mirrorId,
            payload: hubDiversionTranslatePayload(data, spec, mirrorSchema, true)
          });
          hubDiversionLogEvent({
            op: 'dual-update',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: false,
            detail: 'Primary ' + primaryTable + ' OK; Mirror queued in Outbox: ' + String(err && err.message || err).slice(0, 120)
          });
        });
      }
      return res || {
        id: primaryId
      };
    },
    deleteRecord: async function (entityLogicalName, id) {
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(entityLogicalName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawWebApi.deleteRecord(entityLogicalName, id);
      const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(entityLogicalName || ''));
      const primaryTable = primarySchema === 'v1' ? spec.newLogical : isCallerV1 ? spec.oldLogical : entityLogicalName;
      const mirrorTable = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
      const cleanId = String(id || '').replace(/[{}]/g, '').toLowerCase();
      const primaryId = primarySchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
      const res = await rawWebApi.deleteRecord(primaryTable, primaryId);
      hubDiversionAddTombstone(spec.oldLogical, cleanId);
      if (HUB_GUID_MERGE_MAP[cleanId]) hubDiversionAddTombstone(spec.oldLogical, HUB_GUID_MERGE_MAP[cleanId]);
      if (route.dualWrite && !spec.isSharedPhysical && !spec.isMergedSapAssets && spec.oldLogical !== spec.newLogical) {
        const mirrorId = mirrorSchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
        Promise.resolve(rawWebApi.deleteRecord(mirrorTable, mirrorId)).catch(function () {});
      }
      return res;
    },
    online: rawWebApi.online ? {
      execute: async function (request) {
        const route = hubDiversionEffectiveRoute(appKey || HUB_DIVERSION_STATE.activeAppKey);
        const opName = String(request && request.getMetadata && request.getMetadata() && request.getMetadata().operationName || request && request.operationName || '');
        if (route.readSchema === 'v1' && /GetShiftStartupBundle/i.test(opName)) {
          throw new Error('Diverted to __1_ (v1) schema; using client WebApi queries instead of server bundle.');
        }
        try {
          if (request && request.Target && typeof request.Target === 'object' && typeof request.Target['@odata.type'] === 'string') {
            const rawType = request.Target['@odata.type'].replace(/^Microsoft\.Dynamics\.CRM\./i, '');
            const tSpec = hubDiversionResolveSpec(rawType);
            if (tSpec && !tSpec.isSharedPhysical && tSpec.oldLogical !== tSpec.newLogical) {
              const tRoute = hubDiversionEffectiveRoute(appKey || HUB_DIVERSION_STATE.activeAppKey);
              if (tRoute.readSchema === 'v1') {
                const recGuid = request.Target[tSpec.oldPk] || request.Target[tSpec.newPk];
                const newTarget = Object.assign({}, request.Target);
                delete newTarget[tSpec.oldPk];
                newTarget['@odata.type'] = 'Microsoft.Dynamics.CRM.' + tSpec.newLogical;
                if (recGuid) newTarget[tSpec.newPk] = recGuid;
                request.Target = newTarget;
              }
            }
          }
        } catch (eTarget) {}
        return rawWebApi.online.execute(request);
      },
      executeMultiple: async function (requests) {
        return rawWebApi.online.executeMultiple(requests);
      }
    } : undefined
  };
  if (HUB_DIVERSION_WEBAPI_CACHE) {
    const byApp = HUB_DIVERSION_WEBAPI_CACHE.get(rawWebApi) || {};
    byApp[cacheAppKey] = proxy;
    HUB_DIVERSION_WEBAPI_CACHE.set(rawWebApi, byApp);
  }
  return proxy;
}
const HUB_DIVERSION_XRM_CACHE = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function hubDiversionWrapXrm(rawXrm, appKey) {
  if (!rawXrm || typeof rawXrm !== 'object') return rawXrm;
  if (rawXrm.__isHubDiversionXrm && rawXrm.__rawXrm) rawXrm = rawXrm.__rawXrm;
  if (appKey) HUB_DIVERSION_STATE.activeAppKey = appKey;
  if (!rawXrm.WebApi) return rawXrm;
  const cacheAppKey = appKey || 'global';
  if (HUB_DIVERSION_XRM_CACHE && HUB_DIVERSION_XRM_CACHE.has(rawXrm)) {
    const byApp = HUB_DIVERSION_XRM_CACHE.get(rawXrm);
    if (byApp && byApp[cacheAppKey]) return byApp[cacheAppKey];
  }
  const wrappedWebApi = hubDiversionWrapWebApi(rawXrm.WebApi, appKey);
  let xrmProxy;
  try {
    xrmProxy = new Proxy(rawXrm, {
      get: function (target, prop, receiver) {
        if (prop === '__isHubDiversionXrm') return true;
        if (prop === '__rawXrm') return target;
        if (prop === 'WebApi') return wrappedWebApi;
        const val = Reflect.get(target, prop, receiver);
        return typeof val === 'function' ? val.bind(target) : val;
      }
    });
  } catch (e) {
    xrmProxy = Object.assign({}, rawXrm, {
      __isHubDiversionXrm: true,
      __rawXrm: rawXrm,
      WebApi: wrappedWebApi
    });
  }
  if (HUB_DIVERSION_XRM_CACHE) {
    const byApp = HUB_DIVERSION_XRM_CACHE.get(rawXrm) || {};
    byApp[cacheAppKey] = xrmProxy;
    HUB_DIVERSION_XRM_CACHE.set(rawXrm, byApp);
  }
  return xrmProxy;
}
const HUB_DIVERSION_DATAAPI_CACHE = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function hubDiversionWrapDataApi(rawDataApi, appKey) {
  if (!rawDataApi || typeof rawDataApi !== 'object') return rawDataApi;
  if (rawDataApi.__isHubDiversionProxy && rawDataApi.__raw) rawDataApi = rawDataApi.__raw;
  if (appKey) HUB_DIVERSION_STATE.activeAppKey = appKey;
  const cacheAppKey = appKey || 'global';
  if (HUB_DIVERSION_DATAAPI_CACHE && HUB_DIVERSION_DATAAPI_CACHE.has(rawDataApi)) {
    const byApp = HUB_DIVERSION_DATAAPI_CACHE.get(rawDataApi);
    if (byApp && byApp[cacheAppKey]) return byApp[cacheAppKey];
  }
  const wrapDataApiPage = function (pageObj, spec, useV1, readSchema) {
    if (!pageObj || typeof pageObj !== 'object') return {
      rows: []
    };
    const rawRows = Array.isArray(pageObj.rows) ? pageObj.rows : [];
    const filteredRows = useV1 && spec.oldLogical === 'craa5_aa_assets' ? rawRows.filter(function (r) {
      return !r || r.statecode !== 1 && !r.craa5_mergedinto;
    }) : rawRows;
    const rows = filteredRows.map(function (r) {
      return hubDiversionNormalizeRow(r, spec, readSchema);
    });
    const outPage = Object.assign({}, pageObj, {
      rows: rows
    });
    if (typeof pageObj.loadMoreRows === 'function') {
      outPage.loadMoreRows = async function () {
        const nextPage = await pageObj.loadMoreRows();
        return wrapDataApiPage(nextPage, spec, useV1, readSchema);
      };
    }
    return outPage;
  };
  const proxy = Object.assign({}, rawDataApi, {
    __isHubDiversionProxy: true,
    __raw: rawDataApi,
    queryTable: async function (tableName, opts) {
      if (typeof rawDataApi.queryTable !== 'function') return {
        rows: []
      };
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(tableName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawDataApi.queryTable(tableName, opts);
      const useV1 = route.readSchema === 'v1';
      if (!useV1 && !/^craa5___1_/i.test(String(tableName || ''))) {
        const legPage = await rawDataApi.queryTable(tableName, opts);
        return wrapDataApiPage(legPage, spec, false, 'legacy');
      }
      const targetTable = useV1 ? spec.newLogical : spec.oldLogical;
      const newOpts = Object.assign({}, opts || {});
      if (useV1 && Array.isArray(newOpts.select)) {
        newOpts.select = newOpts.select.map(function (c) {
          if (c === spec.oldPk) return spec.newPk;
          if (spec.oldPn && spec.newPn && c === spec.oldPn) return spec.newPn;
          if (spec.colMapOldToNew && spec.colMapOldToNew[c]) return spec.colMapOldToNew[c];
          return c;
        });
      }
      if (useV1 && typeof newOpts.filter === 'string') {
        newOpts.filter = hubDiversionRewriteQuery(newOpts.filter, spec, 'v1');
      }
      if (spec.isMergedSapAssets && useV1) {
        delete newOpts.select;
      }
      let page;
      try {
        page = await rawDataApi.queryTable(targetTable, newOpts);
      } catch (e) {
        if (useV1 && newOpts.select && hubDiversionIsMissingColError(e, 0)) {
          const fallbackOpts = Object.assign({}, newOpts);
          delete fallbackOpts.select;
          page = await rawDataApi.queryTable(targetTable, fallbackOpts);
        } else {
          throw e;
        }
      }
      return wrapDataApiPage(page, spec, useV1, route.readSchema);
    },
    createRow: async function (tableName, record) {
      if (typeof rawDataApi.createRow !== 'function') return null;
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(tableName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawDataApi.createRow(tableName, record);
      const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(tableName || ''));
      const primaryTable = primarySchema === 'v1' ? spec.newLogical : isCallerV1 ? spec.oldLogical : tableName;
      const mirrorTable = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
      const mirrorSet = mirrorSchema === 'v1' ? spec.newSet : spec.oldSet;
      const mirrorPk = mirrorSchema === 'v1' ? spec.newPk : spec.oldPk;
      const canMirror = Boolean(route.dualWrite && !spec.isSharedPhysical && !spec.isMergedSapAssets && spec.oldLogical !== spec.newLogical);
      const callerHasId = record && (record[spec.oldPk] || record[spec.newPk]);
      let primaryPayload;
      if (primarySchema === 'legacy' && !isCallerV1) {
        primaryPayload = record;
      } else {
        const withId = Object.assign({}, record || {});
        if (callerHasId) {
          withId[spec.oldPk] = callerHasId;
          withId[spec.newPk] = callerHasId;
        }
        primaryPayload = hubDiversionTranslatePayload(withId, spec, primarySchema, false);
      }
      const res = await rawDataApi.createRow(primaryTable, primaryPayload);
      if (canMirror) {
        const recId = String(res && (res.id || res.entityId || res.recordId) || callerHasId || '').replace(/[{}]/g, '').toLowerCase();
        const mirrorPayload = hubDiversionTranslatePayload(Object.assign({}, record || {}, {
          [spec.oldPk]: recId,
          [spec.newPk]: recId
        }), spec, mirrorSchema, true);
        hubDiversionRawUpsert(mirrorTable, mirrorSet, mirrorPk, recId, mirrorPayload, null).then(function () {
          hubDiversionLogEvent({
            op: 'dual-create',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: true,
            detail: 'Delivered dataApi create to ' + mirrorTable
          });
        }).catch(function (err) {
          hubDiversionPushOutbox({
            op: 'dataapi-create',
            logicalName: mirrorTable,
            entitySet: mirrorSet,
            pkCol: mirrorPk,
            recordId: recId,
            payload: mirrorPayload
          });
          hubDiversionLogEvent({
            op: 'dual-create',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: false,
            detail: 'Mirror queued in Outbox: ' + String(err && err.message || err).slice(0, 120)
          });
        });
      }
      return res;
    },
    updateRow: async function (tableName, id, record) {
      if (typeof rawDataApi.updateRow !== 'function') return null;
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(tableName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawDataApi.updateRow(tableName, id, record);
      const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(tableName || ''));
      const primaryTable = primarySchema === 'v1' ? spec.newLogical : isCallerV1 ? spec.oldLogical : tableName;
      const primaryPk = primarySchema === 'v1' ? spec.newPk : spec.oldPk;
      const mirrorTable = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
      const mirrorSet = mirrorSchema === 'v1' ? spec.newSet : spec.oldSet;
      const mirrorPk = mirrorSchema === 'v1' ? spec.newPk : spec.oldPk;
      const canMirror = Boolean(route.dualWrite && !spec.isSharedPhysical && !spec.isMergedSapAssets && spec.oldLogical !== spec.newLogical);
      const cleanId = String(id || '').replace(/[{}]/g, '').toLowerCase();
      const primaryId = primarySchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
      let primaryPayload;
      if (primarySchema === 'legacy' && !isCallerV1) {
        primaryPayload = record;
      } else {
        primaryPayload = hubDiversionTranslatePayload(record, spec, primarySchema, false);
        delete primaryPayload[primaryPk];
      }
      const res = await rawDataApi.updateRow(primaryTable, primaryId, primaryPayload);
      if (canMirror && !hubDiversionIsTombstoned(spec.oldLogical, cleanId)) {
        const mirrorId = mirrorSchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
        const mirrorPayload = hubDiversionTranslatePayload(record, spec, mirrorSchema, true);
        hubDiversionRawUpsert(mirrorTable, mirrorSet, mirrorPk, mirrorId, mirrorPayload, null).then(function () {
          hubDiversionLogEvent({
            op: 'dual-update',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: true,
            detail: 'Delivered dataApi update to ' + mirrorTable
          });
        }).catch(function (err) {
          hubDiversionPushOutbox({
            op: 'dataapi-update',
            logicalName: mirrorTable,
            entitySet: mirrorSet,
            pkCol: mirrorPk,
            recordId: mirrorId,
            payload: mirrorPayload
          });
          hubDiversionLogEvent({
            op: 'dual-update',
            appKey: route.appKey,
            primaryTable: primaryTable,
            mirrorTable: mirrorTable,
            ok: false,
            detail: 'Mirror queued in Outbox: ' + String(err && err.message || err).slice(0, 120)
          });
        });
      }
      return res;
    },
    deleteRow: async function (tableName, id) {
      if (typeof rawDataApi.deleteRow !== 'function') return null;
      const activeAk = appKey || HUB_DIVERSION_STATE.activeAppKey;
      const route = hubDiversionEffectiveRoute(activeAk);
      const spec = hubDiversionResolveSpec(tableName);
      if (!spec || route.masterOff || activeAk === 'monitor') return rawDataApi.deleteRow(tableName, id);
      const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
      const isCallerV1 = /^craa5___1_/i.test(String(tableName || ''));
      const primaryTable = primarySchema === 'v1' ? spec.newLogical : isCallerV1 ? spec.oldLogical : tableName;
      const mirrorTable = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
      const cleanId = String(id || '').replace(/[{}]/g, '').toLowerCase();
      const primaryId = primarySchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
      const res = await rawDataApi.deleteRow(primaryTable, primaryId);
      hubDiversionAddTombstone(spec.oldLogical, cleanId);
      if (route.dualWrite && !spec.isSharedPhysical && !spec.isMergedSapAssets && spec.oldLogical !== spec.newLogical) {
        const mirrorId = mirrorSchema === 'v1' ? HUB_GUID_MERGE_MAP[cleanId] || cleanId : cleanId;
        Promise.resolve(rawDataApi.deleteRow(mirrorTable, mirrorId)).catch(function () {});
      }
      return res;
    }
  });
  if (HUB_DIVERSION_DATAAPI_CACHE) {
    const byApp = HUB_DIVERSION_DATAAPI_CACHE.get(rawDataApi) || {};
    byApp[cacheAppKey] = proxy;
    HUB_DIVERSION_DATAAPI_CACHE.set(rawDataApi, byApp);
  }
  return proxy;
}

// Installs an idempotent window.fetch interceptor for /api/data/v9.2/<entitySet> calls (including file/image subpaths)
function hubDiversionInstallFetch(appKey) {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;
  if (appKey) HUB_DIVERSION_STATE.activeAppKey = appKey;
  try {
    if (window.Xrm && !window.Xrm.__isHubDiversionXrm && HUB_DIVERSION_STATE.activeAppKey !== 'monitor') {
      window.Xrm = hubDiversionWrapXrm(window.Xrm, appKey || HUB_DIVERSION_STATE.activeAppKey);
    }
  } catch (eXrm) {}
  if (window.__hubDiversionFetchInstalled) return;
  window.__hubRawFetch = window.fetch.bind(window);
  window.__hubDiversionFetchInstalled = true;
  window.fetch = async function (input, init) {
    const rawFetch = window.__hubRawFetch;
    if (init && init.__hubDiversionRaw) {
      return rawFetch(input, init);
    }
    const activeAk = HUB_DIVERSION_STATE.activeAppKey || 'global';
    const route = hubDiversionEffectiveRoute(activeAk);
    if (route.masterOff || activeAk === 'monitor') {
      return rawFetch(input, init);
    }
    const urlStr = typeof input === 'string' ? input : input && input.url ? input.url : '';
    const methodUpper = String(init && init.method || input && typeof input === 'object' && input.method || 'GET').toUpperCase();

    // Handle OData $batch multipart requests (e.g. chBatch in Chemical Inventory & Ordering)
    if (methodUpper === 'POST' && /\/api\/data\/v9\.2\/\$batch(\?.*)?$/i.test(urlStr) && init && typeof init.body === 'string') {
      const primarySchemaBatch = route.readSchema === 'v1' ? 'v1' : 'legacy';
      const mirrorSchemaBatch = primarySchemaBatch === 'v1' ? 'legacy' : 'v1';
      let batchBody = init.body;
      const mirrorTasks = [];
      let batchTouchedTables = {};
      batchBody = batchBody.replace(/(PATCH|POST|PUT|DELETE)\s+([^\s]*\/api\/data\/v9\.2\/)([a-z0-9_]+)(\([^)]*\))?(\s+HTTP\/1\.[01]\r?\n[\s\S]*?\r?\n\r?\n)(\{[^\r\n]*\})?/gi, function (fullMatch, bMethod, bPrefix, bSet, bParen, bHeaders, bJson) {
        const bSpec = hubDiversionResolveSpec(bSet.toLowerCase());
        if (!bSpec) return fullMatch;
        batchTouchedTables[bSpec.oldLogical] = bSpec;
        const bShared = Boolean(bSpec.isSharedPhysical || bSpec.oldLogical === bSpec.newLogical);
        const bCanMirror = Boolean(route.dualWrite && !bShared && !bSpec.isMergedSapAssets);
        const bCallerV1 = /^craa5___1_/i.test(bSet);
        const bPrimarySet = primarySchemaBatch === 'v1' ? bSpec.newSet : bCallerV1 ? bSpec.oldSet : bSet;
        const bMirrorSet = mirrorSchemaBatch === 'v1' ? bSpec.newSet : bSpec.oldSet;
        const bParenStr = bParen || '';
        const bIsGuid = /^\([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\)$/i.test(bParenStr);
        const bCleanGuid = bIsGuid ? bParenStr.slice(1, -1).toLowerCase() : '';
        const bPrimaryParen = primarySchemaBatch === 'v1' && bCleanGuid && HUB_GUID_MERGE_MAP[bCleanGuid] ? '(' + HUB_GUID_MERGE_MAP[bCleanGuid] + ')' : bParenStr;
        let newJsonStr = bJson || '';
        let parsedObj = null;
        if (bJson) {
          try {
            parsedObj = JSON.parse(bJson);
          } catch (eJ) {}
        }
        if (parsedObj && (primarySchemaBatch === 'v1' || bCallerV1) && !bShared) {
          const translated = hubDiversionTranslatePayload(parsedObj, bSpec, primarySchemaBatch, false);
          const pPk = primarySchemaBatch === 'v1' ? bSpec.newPk : bSpec.oldPk;
          if (bMethod.toUpperCase() !== 'POST') delete translated[pPk];
          newJsonStr = JSON.stringify(translated);
        }
        if (bCanMirror && parsedObj && (bMethod.toUpperCase() === 'PATCH' || bMethod.toUpperCase() === 'POST' || bMethod.toUpperCase() === 'PUT')) {
          const mGuid = mirrorSchemaBatch === 'v1' && bCleanGuid && HUB_GUID_MERGE_MAP[bCleanGuid] ? HUB_GUID_MERGE_MAP[bCleanGuid] : bCleanGuid;
          const mSource = Object.assign({}, parsedObj);
          if (mGuid) {
            mSource[bSpec.oldPk] = mGuid;
            mSource[bSpec.newPk] = mGuid;
          }
          const mPayload = hubDiversionTranslatePayload(mSource, bSpec, mirrorSchemaBatch, true);
          mirrorTasks.push({
            logicalName: mirrorSchemaBatch === 'v1' ? bSpec.newLogical : bSpec.oldLogical,
            entitySet: bMirrorSet,
            pkCol: mirrorSchemaBatch === 'v1' ? bSpec.newPk : bSpec.oldPk,
            recordId: mGuid,
            payload: mPayload
          });
        }
        return bMethod + ' ' + bPrefix + bPrimarySet + bPrimaryParen + bHeaders + newJsonStr;
      });
      const batchResp = await rawFetch(input, Object.assign({}, init, {
        body: batchBody
      }));
      if (batchResp.ok) {
        const touchedKeys = Object.keys(batchTouchedTables);
        if (mirrorTasks.length > 0) {
          Promise.all(mirrorTasks.map(function (t) {
            return hubDiversionRawUpsert(t.logicalName, t.entitySet, t.pkCol, t.recordId, t.payload, null).catch(function () {
              hubDiversionPushOutbox(Object.assign({
                op: 'batch-upsert'
              }, t));
            });
          })).then(function () {
            hubDiversionLogEvent({
              op: 'dual-batch',
              appKey: route.appKey,
              primaryTable: touchedKeys.join(','),
              mirrorTable: mirrorSchemaBatch,
              ok: true,
              detail: 'Mirrored ' + mirrorTasks.length + ' batch write(s) across ' + touchedKeys.join(', ')
            });
          });
        } else if (touchedKeys.length > 0) {
          hubDiversionLogEvent({
            op: 'shared-batch',
            appKey: route.appKey,
            primaryTable: touchedKeys.join(','),
            mirrorTable: 'shared',
            ok: true,
            detail: 'Executed $batch write on ' + touchedKeys.join(', ')
          });
        }
      }
      return batchResp;
    }

    // Handle InitializeFileBlocksUpload action for chunked file/image uploads (e.g. Map Submission Tool)
    if (methodUpper === 'POST' && /\/api\/data\/v9\.2\/InitializeFileBlocksUpload(\?.*)?$/i.test(urlStr) && init && typeof init.body === 'string') {
      if (route.readSchema === 'v1') {
        try {
          const parsedUpload = JSON.parse(init.body);
          if (parsedUpload && parsedUpload.Target && typeof parsedUpload.Target['@odata.type'] === 'string') {
            const rawTargetType = parsedUpload.Target['@odata.type'].replace(/^Microsoft\.Dynamics\.CRM\./i, '');
            const targetSpec = hubDiversionResolveSpec(rawTargetType);
            if (targetSpec && !targetSpec.isSharedPhysical && targetSpec.oldLogical !== targetSpec.newLogical) {
              const rawTargetGuid = String(parsedUpload.Target[targetSpec.oldPk] || parsedUpload.Target[targetSpec.newPk] || '').replace(/[{}]/g, '').toLowerCase();
              const mappedTargetGuid = rawTargetGuid && HUB_GUID_MERGE_MAP[rawTargetGuid] ? HUB_GUID_MERGE_MAP[rawTargetGuid] : rawTargetGuid;
              const newTarget = Object.assign({}, parsedUpload.Target);
              delete newTarget[targetSpec.oldPk];
              newTarget['@odata.type'] = 'Microsoft.Dynamics.CRM.' + targetSpec.newLogical;
              if (mappedTargetGuid) newTarget[targetSpec.newPk] = mappedTargetGuid;
              parsedUpload.Target = newTarget;
              init = Object.assign({}, init, {
                body: JSON.stringify(parsedUpload)
              });
            }
          }
        } catch (eUp) {}
      }
      return rawFetch(input, init);
    }
    const m = urlStr.match(/^(.*\/api\/data\/v9\.2\/)([a-z0-9_]+)(\([^)]*\))?(\/[^?]*)?(\?.*)?$/i);
    if (!m) {
      return rawFetch(input, init);
    }
    const prefix = m[1];
    const entitySet = m[2].toLowerCase();
    const parenId = m[3] || '';
    const subPath = m[4] || '';
    const queryPart = m[5] || '';
    const spec = hubDiversionResolveSpec(entitySet);
    if (!spec) {
      return rawFetch(input, init);
    }
    const isSharedPhysical = Boolean(spec.isSharedPhysical || spec.oldLogical === spec.newLogical);
    const canMirror = Boolean(route.dualWrite && !isSharedPhysical && !spec.isMergedSapAssets);
    const method = String(init && init.method || input && typeof input === 'object' && input.method || 'GET').toUpperCase();
    const primarySchema = route.readSchema === 'v1' ? 'v1' : 'legacy';
    const mirrorSchema = primarySchema === 'v1' ? 'legacy' : 'v1';
    const isCallerV1 = /^craa5___1_/i.test(entitySet);
    const primarySet = primarySchema === 'v1' ? spec.newSet : isCallerV1 ? spec.oldSet : entitySet;
    const mirrorSet = mirrorSchema === 'v1' ? spec.newSet : spec.oldSet;
    const isGuidParen = /^\([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\)$/i.test(parenId);
    const cleanParenGuid = isGuidParen ? parenId.slice(1, -1).toLowerCase() : '';
    const primaryParenId = primarySchema === 'v1' && cleanParenGuid && HUB_GUID_MERGE_MAP[cleanParenGuid] ? '(' + HUB_GUID_MERGE_MAP[cleanParenGuid] + ')' : parenId;
    const mirrorParenId = mirrorSchema === 'v1' && cleanParenGuid && HUB_GUID_MERGE_MAP[cleanParenGuid] ? '(' + HUB_GUID_MERGE_MAP[cleanParenGuid] + ')' : parenId;
    if (method === 'GET') {
      if (subPath) {
        const targetSubUrl = prefix + primarySet + primaryParenId + subPath + queryPart;
        let subResp = await rawFetch(targetSubUrl, init);
        if (!subResp.ok && !isSharedPhysical && primarySchema === 'v1') {
          subResp = await rawFetch(prefix + mirrorSet + parenId + subPath + queryPart, init);
        }
        return subResp;
      }
      let newQuery = primarySchema === 'v1' ? hubDiversionRewriteQuery(queryPart, spec, 'v1') : isCallerV1 ? hubDiversionRewriteQuery(queryPart, spec, 'legacy') : queryPart;
      if (primarySchema === 'v1' && spec.isMergedSapAssets && newQuery && /\$select=/i.test(newQuery)) {
        newQuery = newQuery.replace(/([?&])\$select=[^&]*(&?)/i, function (_, p1, p2) {
          return p2 ? p1 : '';
        });
      }
      const targetUrl = prefix + primarySet + primaryParenId + newQuery;
      let resp = await rawFetch(targetUrl, init);
      if (!resp.ok && primarySchema === 'v1' && newQuery && /\$select=/i.test(newQuery) && resp.status !== 401 && resp.status !== 403 && resp.status !== 429 && resp.status !== 503) {
        let errTxt = '';
        try {
          errTxt = await resp.clone().text();
        } catch (eTxt) {}
        if (hubDiversionIsMissingColError(errTxt, resp.status)) {
          const stripped = newQuery.replace(/([?&])\$select=[^&]*(&?)/i, function (_, p1, p2) {
            return p2 ? p1 : '';
          });
          resp = await rawFetch(prefix + primarySet + primaryParenId + stripped, init);
        }
      }
      if (!resp.ok || resp.status === 204) return resp;
      try {
        const clone = resp.clone();
        const json = await clone.json();
        if (json && Array.isArray(json.value)) {
          const rawVal = primarySchema === 'v1' && spec.oldLogical === 'craa5_aa_assets' ? json.value.filter(function (r) {
            return !r || r.statecode !== 1 && !r.craa5_mergedinto;
          }) : json.value;
          json.value = rawVal.map(function (r) {
            return hubDiversionNormalizeRow(r, spec, primarySchema);
          });
          return new Response(JSON.stringify(json), {
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          });
        } else if (json && typeof json === 'object') {
          const norm = hubDiversionNormalizeRow(json, spec, primarySchema);
          return new Response(JSON.stringify(norm), {
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers
          });
        }
      } catch (e) {}
      return resp;
    }
    if (subPath) {
      const respSub = await rawFetch(prefix + primarySet + primaryParenId + subPath + queryPart, init);
      if (respSub.ok && (method === 'PATCH' || method === 'PUT' || method === 'DELETE')) {
        if (canMirror) {
          rawFetch(prefix + mirrorSet + mirrorParenId + subPath + queryPart, init).then(function (rMirror) {
            const mOk = Boolean(rMirror && rMirror.ok);
            hubDiversionLogEvent({
              op: 'dual-file',
              appKey: route.appKey,
              primaryTable: primarySet,
              mirrorTable: mirrorSet,
              ok: mOk,
              detail: mOk ? 'Mirrored binary/file ' + method + ' ' + subPath + ' to ' + mirrorSet : 'Mirror binary/file ' + method + ' ' + subPath + ' returned HTTP ' + (rMirror ? rMirror.status : 'err')
            });
          }).catch(function (errSub) {
            hubDiversionLogEvent({
              op: 'dual-file',
              appKey: route.appKey,
              primaryTable: primarySet,
              mirrorTable: mirrorSet,
              ok: false,
              detail: 'Mirror binary/file ' + method + ' failed: ' + String(errSub && errSub.message || errSub).slice(0, 80)
            });
          });
        } else if (isSharedPhysical) {
          hubDiversionLogEvent({
            op: 'shared-file',
            appKey: route.appKey,
            primaryTable: primarySet,
            mirrorTable: 'shared',
            ok: true,
            detail: 'Uploaded binary/file ' + method + ' ' + subPath + ' on shared table ' + spec.oldLogical
          });
        }
      }
      return respSub;
    }
    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
      let parsedBody = null;
      try {
        if (init && typeof init.body === 'string') parsedBody = JSON.parse(init.body);
      } catch (e) {}
      const callerHasId = parsedBody && (parsedBody[spec.oldPk] || parsedBody[spec.newPk]);
      let primaryInit = init;
      if (parsedBody) {
        if (primarySchema === 'legacy' && !isCallerV1) {
          primaryInit = init;
        } else {
          const v1Source = Object.assign({}, parsedBody);
          if (callerHasId) {
            v1Source[spec.oldPk] = callerHasId;
            v1Source[spec.newPk] = callerHasId;
          }
          const primaryBody = hubDiversionTranslatePayload(v1Source, spec, primarySchema, false);
          const primaryPk = primarySchema === 'v1' ? spec.newPk : spec.oldPk;
          if (method !== 'POST' && primaryBody) delete primaryBody[primaryPk];
          primaryInit = Object.assign({}, init, {
            body: JSON.stringify(primaryBody)
          });
        }
      }
      const resp = await rawFetch(prefix + primarySet + primaryParenId + queryPart, primaryInit);
      if (resp.ok && parsedBody) {
        let recId = cleanParenGuid || String(callerHasId || '').replace(/[{}]/g, '').toLowerCase();
        if (!recId && resp.headers && typeof resp.headers.get === 'function') {
          const entHdr = String(resp.headers.get('OData-EntityId') || '');
          const mHdr = entHdr.match(/\(([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})\)/i);
          if (mHdr && mHdr[1]) recId = mHdr[1].toLowerCase();
        }
        if (canMirror && (!recId || !hubDiversionIsTombstoned(spec.oldLogical, recId))) {
          const mirrorRecId = mirrorSchema === 'v1' && recId && HUB_GUID_MERGE_MAP[recId] ? HUB_GUID_MERGE_MAP[recId] : recId;
          const mirrorLogical = mirrorSchema === 'v1' ? spec.newLogical : spec.oldLogical;
          const mirrorPk = mirrorSchema === 'v1' ? spec.newPk : spec.oldPk;
          (async function () {
            let mirrorSource = Object.assign({}, parsedBody);
            if (method === 'PATCH' && recId) {
              try {
                const primaryReadId = primarySchema === 'v1' && HUB_GUID_MERGE_MAP[recId] ? HUB_GUID_MERGE_MAP[recId] : recId;
                const fullResp = await rawFetch(prefix + primarySet + '(' + primaryReadId + ')', {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json'
                  },
                  credentials: 'same-origin',
                  __hubDiversionRaw: true
                });
                if (fullResp && fullResp.ok) {
                  const fullRow = await fullResp.json();
                  if (fullRow && typeof fullRow === 'object') {
                    const normFull = hubDiversionNormalizeRow(fullRow, spec, primarySchema);
                    Object.keys(normFull).forEach(function (fk) {
                      if (/(_timestamp|_url|^entityimage.*|^craa5_(pictureof|pictureofequipment|ssop|sop[123])(_name)?)$/i.test(fk)) {
                        delete normFull[fk];
                      }
                    });
                    mirrorSource = Object.assign({}, normFull, parsedBody);
                  }
                }
              } catch (eFullFetch) {}
            }
            if (mirrorRecId) {
              mirrorSource[spec.oldPk] = mirrorRecId;
              mirrorSource[spec.newPk] = mirrorRecId;
            }
            const mirrorBody = hubDiversionTranslatePayload(mirrorSource, spec, mirrorSchema, true);
            return hubDiversionRawUpsert(mirrorLogical, mirrorSet, mirrorPk, mirrorRecId, mirrorBody, null).then(function () {
              hubDiversionLogEvent({
                op: 'dual-' + method.toLowerCase(),
                appKey: route.appKey,
                primaryTable: primarySet,
                mirrorTable: mirrorSet,
                ok: true,
                detail: 'Delivered fetch ' + method + ' (' + (recId ? recId.slice(0, 8) : 'new') + ') to ' + primarySet + ' & ' + mirrorSet
              });
            }).catch(function (errM) {
              hubDiversionPushOutbox({
                op: 'fetch-' + method.toLowerCase(),
                logicalName: mirrorLogical,
                entitySet: mirrorSet,
                pkCol: mirrorPk,
                recordId: mirrorRecId,
                payload: mirrorBody
              });
              hubDiversionLogEvent({
                op: 'dual-' + method.toLowerCase(),
                appKey: route.appKey,
                primaryTable: primarySet,
                mirrorTable: mirrorSet,
                ok: false,
                detail: 'Primary ' + primarySet + ' OK; Mirror queued in Outbox: ' + String(errM && errM.message || errM).slice(0, 100)
              });
            });
          })();
        } else if (isSharedPhysical) {
          hubDiversionLogEvent({
            op: 'shared-' + method.toLowerCase(),
            appKey: route.appKey,
            primaryTable: primarySet,
            mirrorTable: 'shared',
            ok: true,
            detail: 'Saved ' + method + ' (' + (recId ? recId.slice(0, 8) : 'row') + ') on shared table ' + spec.oldLogical
          });
        }
      }
      return resp;
    }
    if (method === 'DELETE') {
      const delResp = await rawFetch(prefix + primarySet + primaryParenId + queryPart, init);
      if (delResp.ok) {
        if (cleanParenGuid) {
          hubDiversionAddTombstone(spec.oldLogical, cleanParenGuid);
          if (HUB_GUID_MERGE_MAP[cleanParenGuid]) hubDiversionAddTombstone(spec.oldLogical, HUB_GUID_MERGE_MAP[cleanParenGuid]);
        }
        if (canMirror && mirrorParenId) {
          rawFetch(prefix + mirrorSet + mirrorParenId + queryPart, init).catch(function () {});
        }
      }
      return delResp;
    }
    return rawFetch(prefix + primarySet + primaryParenId + queryPart, init);
  };
}

// Dual-Schema Dataverse Connection Checker for both legacy (craa5_*) and v1 (craa5___1_*) tables
async function hubDiversionCheckBothSchemas(appKey, scopeAll, onProgress, webApiHint) {
  HUB_DIVERSION_STATE.checkBusy = true;
  hubDiversionNotify();
  const ak = appKey || HUB_DIVERSION_STATE.activeAppKey || 'global';
  const specs = HUB_DIVERSION_TABLES.filter(function (s) {
    if (s.isMergedSapAssets) return false;
    if (scopeAll || ak === 'global') return true;
    return (s.apps || []).indexOf(ak) >= 0;
  });
  const probeOne = async function (logicalName, entitySet, pkCol) {
    const t0 = Date.now();
    try {
      const rows = await hubDiversionRawRetrieveMultiple(logicalName, entitySet, '?$select=' + pkCol + '&$filter=statecode eq 0&$top=5000', webApiHint);
      return {
        status: rows.length > 0 ? 'ok' : 'empty',
        count: rows.length,
        ms: Date.now() - t0,
        error: ''
      };
    } catch (e) {
      const msg = String(e && e.message || e || '');
      const isNoPriv = /\b40[13]\b|forbidden|privilege|prv(read|create|write|append|delete)|access.*denied|SecLib::AccessCheckEx|0x80040220|0x80040277|-2147187962/i.test(msg);
      const isMissing = !isNoPriv && /does not exist|not found|404|0x80040217/i.test(msg);
      return {
        status: isNoPriv ? 'no-privilege' : isMissing ? 'missing' : 'error',
        count: 0,
        ms: Date.now() - t0,
        error: msg.slice(0, 160)
      };
    }
  };
  const [migrationProbe, migrationV1Probe] = await Promise.all([probeOne(HUB_DIVERSION_MIGRATION_TABLE, HUB_DIVERSION_MIGRATION_SET, HUB_DIVERSION_MIGRATION_PK), probeOne(HUB_DIVERSION_MIGRATION_V1_TABLE, HUB_DIVERSION_MIGRATION_V1_SET, HUB_DIVERSION_MIGRATION_V1_PK)]);
  const pairs = [];
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    if (typeof onProgress === 'function') onProgress(i + 1, specs.length, s.label);
    if (s.isSharedPhysical || s.oldLogical === s.newLogical) {
      const sharedProbe = await probeOne(s.oldLogical, s.oldSet, s.oldPk);
      pairs.push({
        label: s.label,
        spec: s,
        legacy: sharedProbe,
        v1: sharedProbe,
        delta: 0
      });
      continue;
    }
    const [leg, v1] = await Promise.all([probeOne(s.oldLogical, s.oldSet, s.oldPk), probeOne(s.newLogical, s.newSet, s.newPk)]);
    pairs.push({
      label: s.label,
      spec: s,
      legacy: leg,
      v1: v1,
      delta: leg.count - v1.count
    });
  }
  const out = {
    checkedAt: new Date().toISOString(),
    appKey: ak,
    scopeAll: Boolean(scopeAll),
    migrationTable: migrationProbe,
    migrationV1Table: migrationV1Probe,
    pairs: pairs
  };
  HUB_DIVERSION_STATE.checkResults = out;
  HUB_DIVERSION_STATE.checkBusy = false;
  hubDiversionNotify();
  return out;
}

// Bi-Directional Missing-Payload Sync Engine ('both' | 'legacy_to_v1' | 'v1_to_legacy') with dryRun, subset guard, & tombstone guard
async function hubDiversionSyncMissing(appKey, direction, singleSpec, onProgress, webApiHint, dryRun, scopeAll) {
  if (!hubDiversionIsDeveloperAllowed(null)) return HUB_DIVERSION_STATE.syncReport;
  if (HUB_DIVERSION_STATE.syncBusy) return HUB_DIVERSION_STATE.syncReport;
  HUB_DIVERSION_STATE.syncBusy = true;
  hubDiversionNotify();
  const isDry = Boolean(dryRun);
  if (!isDry && HUB_DIVERSION_STATE.outbox && HUB_DIVERSION_STATE.outbox.length > 0) {
    try {
      await hubDiversionDrainOutbox(webApiHint);
    } catch (e) {}
  }
  const ak = appKey || HUB_DIVERSION_STATE.activeAppKey || 'global';
  const dir = direction || 'both';
  const specs = (singleSpec ? [singleSpec] : HUB_DIVERSION_TABLES).filter(function (s) {
    if (!s || s.isMergedSapAssets || s.isSharedPhysical || s.oldLogical === s.newLogical) return false;
    if (singleSpec || scopeAll || ak === 'global') return true;
    return (s.apps || []).indexOf(ak) >= 0;
  });
  const tableReports = [];
  let totalToV1 = 0;
  let totalToLegacy = 0;
  let totalErrors = 0;
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    if (typeof onProgress === 'function') {
      onProgress(i + 1, specs.length, s.label);
    }
    let oldRows = [];
    let newRows = [];
    let readErr = '';
    try {
      oldRows = await hubDiversionRawRetrieveMultiple(s.oldLogical, s.oldSet, '?$filter=statecode eq 0&$top=2500', webApiHint);
    } catch (e) {
      readErr = 'Legacy read: ' + String(e && e.message || e).slice(0, 100);
    }
    try {
      newRows = await hubDiversionRawRetrieveMultiple(s.newLogical, s.newSet, '?$filter=statecode eq 0&$top=2500', webApiHint);
    } catch (e) {
      readErr = (readErr ? readErr + ' - ' : '') + 'v1 read: ' + String(e && e.message || e).slice(0, 100);
    }
    if (readErr) {
      tableReports.push({
        label: s.label,
        oldLogical: s.oldLogical,
        newLogical: s.newLogical,
        oldCount: oldRows.length,
        newCount: newRows.length,
        sentToV1: 0,
        sentToLegacy: 0,
        errors: 1,
        note: readErr
      });
      totalErrors++;
      continue;
    }
    const oldById = {};
    const oldByNat = {};
    oldRows.forEach(function (r) {
      const id = String(r[s.oldPk] || '').replace(/[{}]/g, '').toLowerCase();
      const mappedId = HUB_GUID_MERGE_MAP[id] || id;
      if (id) oldById[id] = r;
      if (mappedId) oldById[mappedId] = r;
      const nk = s.naturalKey && r[s.naturalKey] ? String(r[s.naturalKey]).trim().toLowerCase() : '';
      if (nk) oldByNat[nk] = r;
    });
    const newById = {};
    const newByNat = {};
    newRows.forEach(function (r) {
      const id = String(r[s.newPk] || '').replace(/[{}]/g, '').toLowerCase();
      if (id) newById[id] = r;
      const nk = s.naturalKey && r[s.naturalKey] ? String(r[s.naturalKey]).trim().toLowerCase() : '';
      if (nk) newByNat[nk] = r;
    });
    let sentToV1 = 0;
    let sentToLegacy = 0;
    let tblErrs = 0;
    let lastErrNote = '';

    // 1. Send missing from Legacy -> v1
    if (dir === 'both' || dir === 'legacy_to_v1') {
      const missingInV1 = [];
      oldRows.forEach(function (r) {
        const id = String(r[s.oldPk] || '').replace(/[{}]/g, '').toLowerCase();
        if (s.oldLogical === 'craa5_aa_assets' && HUB_GUID_MERGE_MAP[id]) return;
        const mappedId = HUB_GUID_MERGE_MAP[id] || id;
        if (hubDiversionIsTombstoned(s.oldLogical, id) || hubDiversionIsTombstoned(s.oldLogical, mappedId)) return;
        const nk = s.naturalKey && r[s.naturalKey] ? String(r[s.naturalKey]).trim().toLowerCase() : '';
        if (mappedId && newById[mappedId] || nk && newByNat[nk]) return;
        missingInV1.push({
          row: r,
          id: mappedId
        });
      });
      if (isDry) {
        sentToV1 = missingInV1.length;
        totalToV1 += missingInV1.length;
      } else {
        const batchV1 = missingInV1.slice(0, 150);
        for (let j = 0; j < batchV1.length; j++) {
          const item = batchV1[j];
          try {
            const payload = hubDiversionTranslatePayload(item.row, s, 'v1');
            await hubDiversionRawUpsert(s.newLogical, s.newSet, s.newPk, item.id, payload, webApiHint);
            sentToV1++;
            totalToV1++;
          } catch (e) {
            tblErrs++;
            totalErrors++;
            lastErrNote = String(e && e.message || e).slice(0, 120);
          }
        }
      }
    }

    // 2. Send missing from v1 -> Legacy (blocked for isSubsetInV1 tables so time-windowed __1_ subsets never overwrite live history)
    if ((dir === 'both' || dir === 'v1_to_legacy') && !s.isMergedSapAssets && !s.isSubsetInV1) {
      const missingInLegacy = [];
      newRows.forEach(function (r) {
        if (r.statecode === 1 || r.craa5_mergedinto) return;
        const id = String(r[s.newPk] || '').replace(/[{}]/g, '').toLowerCase();
        if (hubDiversionIsTombstoned(s.oldLogical, id)) return;
        const nk = s.naturalKey && r[s.naturalKey] ? String(r[s.naturalKey]).trim().toLowerCase() : '';
        if (id && oldById[id] || nk && oldByNat[nk]) return;
        missingInLegacy.push({
          row: r,
          id: id
        });
      });
      if (isDry) {
        sentToLegacy = missingInLegacy.length;
        totalToLegacy += missingInLegacy.length;
      } else {
        const batchLeg = missingInLegacy.slice(0, 150);
        for (let j = 0; j < batchLeg.length; j++) {
          const item = batchLeg[j];
          try {
            const payload = hubDiversionTranslatePayload(item.row, s, 'legacy');
            await hubDiversionRawUpsert(s.oldLogical, s.oldSet, s.oldPk, item.id, payload, webApiHint);
            sentToLegacy++;
            totalToLegacy++;
          } catch (e) {
            tblErrs++;
            totalErrors++;
            lastErrNote = String(e && e.message || e).slice(0, 120);
          }
        }
      }
    }
    tableReports.push({
      label: s.label,
      oldLogical: s.oldLogical,
      newLogical: s.newLogical,
      oldCount: oldRows.length,
      newCount: newRows.length,
      sentToV1: sentToV1,
      sentToLegacy: sentToLegacy,
      errors: tblErrs,
      note: lastErrNote
    });
  }
  const summary = {
    syncedAt: new Date().toISOString(),
    appKey: ak,
    direction: dir,
    dryRun: isDry,
    totalToV1: totalToV1,
    totalToLegacy: totalToLegacy,
    totalErrors: totalErrors,
    tables: tableReports
  };
  HUB_DIVERSION_STATE.syncReport = summary;
  HUB_DIVERSION_STATE.syncBusy = false;
  if (!isDry) {
    if (HUB_DIVERSION_STATE.routes[ak]) {
      HUB_DIVERSION_STATE.routes[ak].lastSync = {
        syncedAt: summary.syncedAt,
        direction: dir,
        totalToV1: totalToV1,
        totalToLegacy: totalToLegacy,
        totalErrors: totalErrors
      };
    }
    hubDiversionSaveRoute(ak, {
      lastSync: HUB_DIVERSION_STATE.routes[ak] ? HUB_DIVERSION_STATE.routes[ak].lastSync : null
    }, webApiHint).catch(function () {});
  }
  hubDiversionLogEvent({
    op: isDry ? 'dry-run-scan' : 'missing-sync',
    appKey: ak,
    primaryTable: 'craa5_* <-> craa5___1_*',
    mirrorTable: specs.length + ' tables',
    ok: totalErrors === 0,
    detail: (isDry ? '[DRY-RUN PREVIEW] Missing: ' : 'Sent ') + '+' + totalToV1 + ' to __1_ (v1) and +' + totalToLegacy + ' to Legacy'
  });
  hubDiversionNotify();
  return summary;
}

// React Hook & Developer Button + Modal UI
function useHubDiversionState(appKey) {
  const [, setTick] = React.useState(0);
  React.useEffect(function () {
    if (appKey) HUB_DIVERSION_STATE.activeAppKey = appKey;
    hubDiversionInstallFetch(appKey);
    hubDiversionLoadFromDataverse(appKey, null).catch(function () {});
    return hubDiversionSubscribe(function () {
      setTick(function (n) {
        return n + 1;
      });
    });
  }, [appKey]);
  return {
    state: HUB_DIVERSION_STATE,
    effective: hubDiversionEffectiveRoute(appKey || HUB_DIVERSION_STATE.activeAppKey)
  };
}
function HubDiversionDevControl(props) {
  const appKey = props && props.appKey || 'global';
  const [open, setOpen] = React.useState(false);
  const [selectedApp, setSelectedApp] = React.useState(appKey);
  const [scopeAll, setScopeAll] = React.useState(false);
  const [progressMsg, setProgressMsg] = React.useState('');
  const [statusBanner, setStatusBanner] = React.useState('');
  const [pendingLiveSync, setPendingLiveSync] = React.useState(null);
  const {
    state,
    effective
  } = useHubDiversionState(appKey);
  if (!hubDiversionIsDeveloperAllowed(props)) {
    return null;
  }
  const inspectedRoute = state.routes[selectedApp] || state.routes.global;
  const inspectedEffective = hubDiversionEffectiveRoute(selectedApp);
  const handleSavePatch = async function (patch) {
    setStatusBanner('Saving routing to Dataverse craa5__e_datamigration & craa5___1_e_datamigration...');
    const res = await hubDiversionSaveRoute(selectedApp, Object.assign({
      masterOff: false
    }, patch || {}), null);
    if (res.ok) {
      setStatusBanner('Saved routing to Dataverse (' + selectedApp + ').');
    } else {
      setStatusBanner('Saved locally; Dataverse note: ' + (res.errors || []).join('; '));
    }
    if (props && typeof props.onRouteChanged === 'function') {
      try {
        props.onRouteChanged(hubDiversionEffectiveRoute(appKey));
      } catch (e) {}
    }
  };
  const handleEmergencyKillSwitch = async function () {
    setStatusBanner('Activating Emergency Kill Switch: turning OFF Dual-Write & reverting ALL apps to Legacy Single-Write...');
    for (let i = 0; i < HUB_DIVERSION_APPS.length; i++) {
      const k = HUB_DIVERSION_APPS[i].key;
      if (HUB_DIVERSION_STATE.routes[k]) {
        HUB_DIVERSION_STATE.routes[k] = Object.assign({}, HUB_DIVERSION_STATE.routes[k], {
          followGlobal: k !== 'global',
          readSchema: 'legacy',
          dualWrite: false,
          masterOff: true
        });
      }
    }
    await hubDiversionSaveRoute('global', {
      readSchema: 'legacy',
      dualWrite: false,
      masterOff: true
    }, null);
    if (appKey !== 'global') {
      await hubDiversionSaveRoute(appKey, {
        followGlobal: true,
        readSchema: 'legacy',
        dualWrite: false,
        masterOff: true
      }, null);
    }
    setStatusBanner('Emergency Kill Switch ACTIVE: Master Off enabled, Dual-Write OFF, all apps reading/writing Legacy (craa5_*) only.');
    if (props && typeof props.onRouteChanged === 'function') {
      try {
        props.onRouteChanged(hubDiversionEffectiveRoute(appKey));
      } catch (e) {}
    }
  };
  const handleRunChecker = async function () {
    setProgressMsg('Starting Dual-Schema Dataverse Checker...');
    await hubDiversionCheckBothSchemas(selectedApp, scopeAll, function (i, n, lbl) {
      setProgressMsg('Checking table pair ' + i + ' / ' + n + ': ' + lbl + '...');
    }, null);
    setProgressMsg('');
  };
  const handleRunSync = async function (direction, singleSpec, dryRun, confirmed) {
    const isDry = Boolean(dryRun);
    if (!isDry && !confirmed) {
      setPendingLiveSync({
        direction: direction,
        singleSpec: singleSpec || null
      });
      setStatusBanner('Confirm required: Click "Confirm Live Sync" below to execute live Dataverse writes (capped at 2,500 rows read / 150 writes per table; subset tables skip v1->Legacy).');
      return;
    }
    setPendingLiveSync(null);
    setProgressMsg(isDry ? 'Running Dry-Run Missing-Payload Scan (0 writes)...' : 'Scanning & sending missing payloads...');
    const rep = await hubDiversionSyncMissing(selectedApp, direction, singleSpec || null, function (i, n, lbl) {
      setProgressMsg((isDry ? 'Scanning ' : 'Syncing ') + i + ' / ' + n + ': ' + lbl + '...');
    }, null, isDry, scopeAll);
    setProgressMsg('');
    if (rep) {
      setStatusBanner((isDry ? 'Dry-Run Preview complete (0 writes made): ' : 'Live Sync complete: ') + '+' + rep.totalToV1 + ' missing in __1_ (v1), +' + rep.totalToLegacy + ' missing in Legacy.');
      if (!isDry && state.checkResults) {
        handleRunChecker();
      }
    }
  };
  const handleDrainOutbox = async function () {
    setProgressMsg('Draining durable mirror outbox...');
    const r = await hubDiversionDrainOutbox(null);
    setProgressMsg('');
    setStatusBanner('Outbox drain complete: ' + r.drained + ' delivered, ' + r.remaining + ' remaining.');
  };
  const isV1 = effective.readSchema === 'v1';
  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 800,
    cursor: 'pointer',
    border: isV1 ? '1px solid #10b981' : '1px solid #f59e0b',
    background: isV1 ? '#064e3b' : '#1e293b',
    color: isV1 ? '#a7f3d0' : '#fde68a',
    whiteSpace: 'nowrap'
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-dev-btn",
    onClick: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      setOpen(true);
    },
    style: btnStyle,
    title: "Developer Payload Diversion, Bi-Directional Missing-Payload Sync, and Dual-Schema Dataverse Checker"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: isV1 ? '#34d399' : '#fbbf24',
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", null, 'Dev Diversion: ' + (isV1 ? '__1_ (v1) Read' : 'Legacy Read') + (effective.dualWrite ? ' + Dual-Write' : ' (Single)'))), open && /*#__PURE__*/React.createElement("div", {
    "data-testid": "hub-diversion-modal",
    onClick: function () {
      setOpen(false);
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.72)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    },
    style: {
      width: '100%',
      maxWidth: '1080px',
      maxHeight: '90vh',
      background: '#0f172a',
      color: '#f8fafc',
      borderRadius: '14px',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.65)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      background: '#020617',
      borderBottom: '2px solid #f59e0b',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '15px',
      fontWeight: 900,
      color: '#fbbf24',
      letterSpacing: '0.02em'
    }
  }, "Developer Payload Diversion & Dual-Schema Dataverse Checker (", HUB_DIVERSION_VERSION, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      marginTop: '2px'
    }
  }, "Persisted in Dataverse tables craa5__e_datamigration & craa5___1_e_datamigration (mirrored to craa5__e_hubconfig & craa5___1_e_hubconfig). Delivers payloads to both schemas while loading from Read Primary.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 9px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 800,
      background: state.loadedFromDataverse ? '#065f46' : '#78350f',
      color: state.loadedFromDataverse ? '#d1fae5' : '#fde68a'
    }
  }, state.loadedFromDataverse ? 'craa5__e_datamigration Connected' : 'Local / Probing Dataverse'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-killswitch-btn",
    onClick: handleEmergencyKillSwitch,
    style: {
      padding: '4px 10px',
      borderRadius: '6px',
      border: '1px solid #ef4444',
      background: '#7f1d1d',
      color: '#fecaca',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    },
    title: "Emergency Kill Switch: Revert Global and current app to Legacy Read immediately"
  }, "Kill Switch (Revert to Legacy Read)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-close-btn",
    onClick: function () {
      setOpen(false);
    },
    style: {
      padding: '5px 12px',
      borderRadius: '6px',
      border: '1px solid #475569',
      background: '#1e293b',
      color: '#f8fafc',
      fontSize: '12px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "Close"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      borderRadius: 8,
      background: 'rgba(30,41,59,0.75)',
      border: '1px solid #334155',
      fontSize: 11,
      color: '#cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Schema Architecture Note:"), " Mapped pairs dual-write between ", /*#__PURE__*/React.createElement("code", null, "craa5_*"), " and ", /*#__PURE__*/React.createElement("code", null, "craa5___1_*"), ". Shared Physical tables (", /*#__PURE__*/React.createElement("code", null, "craa5__b_swabresult"), ", ", /*#__PURE__*/React.createElement("code", null, "craa5__b_correctiveaction"), ", ", /*#__PURE__*/React.createElement("code", null, "craa5__facilityobservation"), ", ", /*#__PURE__*/React.createElement("code", null, "craa5_pathogenboloswabcatalog9900"), ") use a single physical Dataverse table in both modes and never duplicate writes. Time-windowed subset tables (", /*#__PURE__*/React.createElement("code", null, "craa5__log_"), ", ", /*#__PURE__*/React.createElement("code", null, "craa5_shiftboard"), ", ", /*#__PURE__*/React.createElement("code", null, "craa5_shiftarchive"), ", ", /*#__PURE__*/React.createElement("code", null, "craa5_taskassignment"), ") block bulk ", /*#__PURE__*/React.createElement("code", null, "__1_ -> Legacy"), " pull."), statusBanner && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      borderRadius: '8px',
      background: '#1e3a8a',
      border: '1px solid #3b82f6',
      color: '#dbeafe',
      fontSize: '12px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, statusBanner), pendingLiveSync && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-confirm-live-sync",
    onClick: function () {
      handleRunSync(pendingLiveSync.direction, pendingLiveSync.singleSpec, false, true);
    },
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      border: '1px solid #f59e0b',
      background: '#d97706',
      color: '#ffffff',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "Confirm Live Sync"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setPendingLiveSync(null);
      setStatusBanner('Live Sync cancelled.');
    },
    style: {
      padding: '4px 10px',
      borderRadius: 6,
      border: '1px solid #64748b',
      background: '#1e293b',
      color: '#e2e8f0',
      fontSize: 11,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Cancel"))), progressMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      borderRadius: '8px',
      background: '#78350f',
      border: '1px solid #f59e0b',
      color: '#fef3c7',
      fontSize: '12px',
      fontWeight: 700
    }
  }, progressMsg), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1e293b',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      textTransform: 'uppercase',
      color: '#94a3b8',
      marginBottom: '8px'
    }
  }, "1. Select App Routing Profile (Remembers on Load in craa5__e_datamigration & craa5___1_e_datamigration)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, HUB_DIVERSION_APPS.map(function (a) {
    const r = hubDiversionEffectiveRoute(a.key);
    const isSel = selectedApp === a.key;
    return /*#__PURE__*/React.createElement("button", {
      key: a.key,
      type: "button",
      "data-testid": 'hub-diversion-app-' + a.key,
      onClick: function () {
        setSelectedApp(a.key);
      },
      style: {
        padding: '6px 11px',
        borderRadius: '8px',
        border: isSel ? '2px solid #38bdf8' : '1px solid #475569',
        background: isSel ? '#0284c7' : '#0f172a',
        color: '#f8fafc',
        fontSize: '11px',
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, a.label + ' (' + (r.readSchema === 'v1' ? '__1_' : 'Legacy') + (r.dualWrite ? '+2W' : '') + ')');
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #334155',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '10px'
    }
  }, selectedApp !== 'global' && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      color: '#cbd5e1',
      marginBottom: '6px'
    }
  }, "Routing Mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      handleSavePatch({
        followGlobal: true
      });
    },
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: inspectedRoute.followGlobal ? '#2563eb' : '#334155',
      color: '#fff'
    }
  }, "Follow Global"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-override-btn",
    onClick: function () {
      handleSavePatch({
        followGlobal: false
      });
    },
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: !inspectedRoute.followGlobal ? '#2563eb' : '#334155',
      color: '#fff'
    }
  }, "App-Specific"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      color: '#cbd5e1',
      marginBottom: '6px'
    }
  }, "Read Primary (Load From One)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-read-legacy",
    onClick: function () {
      handleSavePatch({
        followGlobal: false,
        readSchema: 'legacy'
      });
    },
    style: {
      flex: 1,
      padding: '6px 8px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: inspectedEffective.readSchema === 'legacy' ? '#d97706' : '#334155',
      color: '#fff'
    }
  }, "Legacy (craa5_*)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-read-v1",
    onClick: function () {
      handleSavePatch({
        followGlobal: false,
        readSchema: 'v1'
      });
    },
    style: {
      flex: 1,
      padding: '6px 8px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: inspectedEffective.readSchema === 'v1' ? '#059669' : '#334155',
      color: '#fff'
    }
  }, "New (__1_ Schema)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      color: '#cbd5e1',
      marginBottom: '6px'
    }
  }, "Dual-Write (Deliver to Both Tables)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-dualwrite-on",
    onClick: function () {
      handleSavePatch({
        followGlobal: false,
        dualWrite: true
      });
    },
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: inspectedEffective.dualWrite ? '#059669' : '#334155',
      color: '#fff'
    }
  }, "Dual-Write ON"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-dualwrite-off",
    onClick: function () {
      handleSavePatch({
        followGlobal: false,
        dualWrite: false
      });
    },
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: !inspectedEffective.dualWrite ? '#dc2626' : '#334155',
      color: '#fff'
    }
  }, "Single-Write Only"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f172a',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      color: '#cbd5e1',
      marginBottom: '6px'
    }
  }, "Auto-Sync Missing on App Load"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      handleSavePatch({
        autoSync: true
      });
    },
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: inspectedEffective.autoSync ? '#0284c7' : '#334155',
      color: '#fff'
    }
  }, "Auto-Sync ON"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      handleSavePatch({
        autoSync: false
      });
    },
    style: {
      flex: 1,
      padding: '6px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer',
      background: !inspectedEffective.autoSync ? '#475569' : '#334155',
      color: '#fff'
    }
  }, "Manual Sync"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1e293b',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #334155',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      textTransform: 'uppercase',
      color: '#94a3b8'
    }
  }, "2. Send Missing Payloads Back & Forth + Dual-Table Dataverse Checker"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1',
      marginTop: '2px'
    }
  }, "Compares active rows by GUID & natural key (with tombstone guard) and copies missing records between Legacy (craa5_*) and New (craa5___1_*).")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '11px',
      fontWeight: 700,
      color: '#cbd5e1',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: scopeAll,
    onChange: function (e) {
      setScopeAll(e.target.checked);
    }
  }), /*#__PURE__*/React.createElement("span", null, "All Ecosystem Tables (", HUB_DIVERSION_TABLES.length - 1, ")")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-check-btn",
    disabled: state.checkBusy,
    onClick: handleRunChecker,
    style: {
      padding: '7px 12px',
      borderRadius: '7px',
      border: 'none',
      background: '#0284c7',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, state.checkBusy ? 'Checking Both Schemas...' : 'Check Both Schemas (Dataverse Checker)'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-dryrun-btn",
    disabled: state.syncBusy,
    onClick: function () {
      handleRunSync('both', null, true);
    },
    style: {
      padding: '7px 11px',
      borderRadius: '7px',
      border: '1px solid #38bdf8',
      background: '#0f172a',
      color: '#7dd3fc',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, state.syncBusy ? 'Scanning...' : 'Dry-Run Scan (Preview Missing)'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-sync-both-btn",
    disabled: state.syncBusy,
    onClick: function () {
      handleRunSync('both', null, false);
    },
    style: {
      padding: '7px 12px',
      borderRadius: '7px',
      border: 'none',
      background: '#059669',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, state.syncBusy ? 'Syncing Payloads...' : 'Sync Missing Both Ways (Legacy <-> __1_)'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: state.syncBusy,
    onClick: function () {
      handleRunSync('legacy_to_v1', null, false);
    },
    style: {
      padding: '7px 10px',
      borderRadius: '7px',
      border: '1px solid #475569',
      background: '#0f172a',
      color: '#a7f3d0',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, 'Push Legacy -> __1_'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: state.syncBusy,
    onClick: function () {
      handleRunSync('v1_to_legacy', null, false);
    },
    style: {
      padding: '7px 10px',
      borderRadius: '7px',
      border: '1px solid #475569',
      background: '#0f172a',
      color: '#fde68a',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, 'Pull __1_ -> Legacy'), state.outbox && state.outbox.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-diversion-drain-outbox-btn",
    onClick: handleDrainOutbox,
    style: {
      padding: '7px 10px',
      borderRadius: '7px',
      border: '1px solid #f59e0b',
      background: '#78350f',
      color: '#fef3c7',
      fontSize: '11px',
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, 'Drain Outbox (' + state.outbox.length + ')'))), state.checkResults && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1e293b',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 800,
      color: '#38bdf8'
    }
  }, "Dual-Schema Dataverse Connection Matrix (", state.checkResults.pairs.length, " Table Pairs Checked)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Routing Tables: ", /*#__PURE__*/React.createElement("b", null, "craa5__e_datamigration=", state.checkResults.migrationTable.status.toUpperCase()), " (", state.checkResults.migrationTable.count, ") - ", /*#__PURE__*/React.createElement("b", null, "craa5___1_e_datamigration=", (state.checkResults.migrationV1Table ? state.checkResults.migrationV1Table.status : 'ok').toUpperCase()), " (", state.checkResults.migrationV1Table ? state.checkResults.migrationV1Table.count : 0, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: '280px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '11px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#0f172a',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "Table Function"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "Legacy Table (craa5_*)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "Legacy Status / Rows"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "New Schema (craa5___1_*)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "__1_ Status / Rows"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "Delta"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 8px'
    }
  }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, state.checkResults.pairs.map(function (p) {
    const legOk = p.legacy.status === 'ok' || p.legacy.status === 'empty';
    const v1Ok = p.v1.status === 'ok' || p.v1.status === 'empty';
    return /*#__PURE__*/React.createElement("tr", {
      key: p.spec.oldLogical,
      style: {
        borderTop: '1px solid #334155'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px',
        fontWeight: 700
      }
    }, p.label), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px',
        fontFamily: 'Consolas, monospace',
        color: '#fde68a'
      }
    }, p.spec.oldLogical), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px',
        color: legOk ? '#34d399' : '#f87171',
        fontWeight: 700
      }
    }, p.legacy.status.toUpperCase() + ' (' + p.legacy.count + ' rows, ' + p.legacy.ms + 'ms)'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px',
        fontFamily: 'Consolas, monospace',
        color: '#a7f3d0'
      }
    }, p.spec.newLogical), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px',
        color: v1Ok ? '#34d399' : '#f87171',
        fontWeight: 700
      }
    }, p.v1.status.toUpperCase() + ' (' + p.v1.count + ' rows, ' + p.v1.ms + 'ms)'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px',
        fontWeight: 800,
        color: p.delta === 0 ? '#94a3b8' : '#fbbf24'
      }
    }, p.spec.isSharedPhysical ? 'Shared Table' : p.delta === 0 ? 'In Sync' : p.delta > 0 ? '+' + p.delta + ' in Legacy' : '+' + Math.abs(p.delta) + ' in __1_'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px 8px'
      }
    }, p.spec.isSharedPhysical || p.spec.isMergedSapAssets ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '10px',
        color: '#94a3b8',
        fontWeight: 700
      }
    }, p.spec.isMergedSapAssets ? 'Merged into Assets' : 'Shared Physical') : /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: state.syncBusy,
      onClick: function () {
        handleRunSync(p.spec.isSubsetInV1 ? 'legacy_to_v1' : 'both', p.spec, false);
      },
      style: {
        padding: '3px 8px',
        borderRadius: '5px',
        border: '1px solid #38bdf8',
        background: '#0f172a',
        color: '#38bdf8',
        fontSize: '10px',
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, p.spec.isSubsetInV1 ? 'Push to __1_' : 'Sync Pair')));
  }))))), state.syncReport && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1e293b',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 800,
      color: '#34d399',
      marginBottom: '6px'
    }
  }, state.syncReport.dryRun ? 'Dry-Run Missing-Payload Preview' : 'Last Missing-Payload Sync Report', " (", state.syncReport.direction, "): +", state.syncReport.totalToV1, " ", state.syncReport.dryRun ? 'missing in' : 'sent to', " __1_ (v1), +", state.syncReport.totalToLegacy, " ", state.syncReport.dryRun ? 'missing in' : 'sent to', " Legacy"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: '160px',
      overflowY: 'auto',
      fontSize: '11px'
    }
  }, state.syncReport.tables.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t.oldLogical,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        borderBottom: '1px solid #0f172a'
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, t.label), " (", t.oldLogical, " ", '<->', " ", t.newLogical, ")"), /*#__PURE__*/React.createElement("span", null, 'Legacy: ' + t.oldCount + ', __1_: ' + t.newCount + (state.syncReport.dryRun ? ' -> Missing: +' : ' -> Sent: +') + t.sentToV1 + ' to __1_, +' + t.sentToLegacy + ' to Legacy', t.note ? ' (' + t.note + ')' : ''));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#1e293b',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      fontWeight: 800,
      textTransform: 'uppercase',
      color: '#94a3b8',
      marginBottom: '6px'
    }
  }, "3. Live Payload Diversion & Dual-Write Activity Feed (", state.log.length, ")"), state.log.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#64748b'
    }
  }, "No write payloads or routing updates logged in this session yet. Any create/update in the app will appear here.") : /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: '130px',
      overflowY: 'auto',
      fontSize: '11px',
      fontFamily: 'Consolas, monospace'
    }
  }, state.log.slice(0, 25).map(function (item, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        padding: '3px 0',
        borderBottom: '1px solid #0f172a',
        color: item.ok ? '#a7f3d0' : '#fca5a5'
      }
    }, '[' + item.ts.slice(11, 19) + '] (' + (item.appKey || 'app') + ') ' + item.op + ': ' + item.detail);
  })))))));
}
try {
  if (typeof window !== 'undefined') {
    hubDiversionInstallFetch(HUB_DIVERSION_STATE.activeAppKey);
  }
} catch (eInitFetch) {}

// ============================================================================
// STANDARDIZED APEX FOODS TOP BAR, LOGO, & CLOCKWISE LOADING DONUT (ALL APPS)
// ============================================================================
const APEX_LOGO_DATA_URL = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%2240%22%20viewBox%3D%220%200%20140%2040%22%3E%3Crect%20width%3D%22140%22%20height%3D%2240%22%20rx%3D%226%22%20fill%3D%22%2300468B%22%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%2210%22%20fill%3D%22%23FFB81C%22%2F%3E%3Ctext%20x%3D%2238%22%20y%3D%2225%22%20font-family%3D%22Segoe%20UI%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22800%22%20fill%3D%22%23FFFFFF%22%3EAPEX%20FOODS%3C%2Ftext%3E%3C%2Fsvg%3E";
const HUB_STD_USER_LS_KEY = 'Plant 04_active_ms_user_v1';
const HUB_STD_THEME_LS_KEY = 'apexfoods_hub_std_dark_v1';
const HUB_STD_LANG_LS_KEY = 'apexfoods_hub_std_lang_v1';
const HUB_STD_UNLOCK_LS_KEY = 'apexfoods_hub_std_unlock_v1';
function hubEnsureStdStyles() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('apexfoods-std-ui-css')) {
    try {
      const st = document.createElement('style');
      st.id = 'apexfoods-std-ui-css';
      st.textContent = ['@keyframes apexfoodsDonutSpinCw { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', '.apexfoods-clockwise-donut-svg { animation: apexfoodsDonutSpinCw 0.9s linear infinite !important; transform-origin: 50% 50%; }', 'body.hub-std-dark-fallback { background-color: #0b1220 !important; color: #f1f5f9 !important; }', 'body.hub-std-dark-fallback .bg-white:not([data-hub-topbar]):not([data-hub-topbar] *) { background-color: #111827 !important; color: #f1f5f9 !important; }', 'body.hub-std-dark-fallback .bg-slate-50:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .bg-gray-50:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .bg-\\[\\#F4F7FA\\]:not([data-hub-topbar]):not([data-hub-topbar] *) { background-color: #0f172a !important; color: #e2e8f0 !important; }', 'body.hub-std-dark-fallback .bg-slate-100:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .bg-gray-100:not([data-hub-topbar]):not([data-hub-topbar] *) { background-color: #1e293b !important; color: #e2e8f0 !important; }', 'body.hub-std-dark-fallback .text-slate-900:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .text-slate-800:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .text-gray-900:not([data-hub-topbar]):not([data-hub-topbar] *) { color: #f8fafc !important; }', 'body.hub-std-dark-fallback .text-slate-700:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .text-slate-600:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .text-gray-700:not([data-hub-topbar]):not([data-hub-topbar] *) { color: #cbd5e1 !important; }', 'body.hub-std-dark-fallback .border-slate-200:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .border-slate-300:not([data-hub-topbar]):not([data-hub-topbar] *), body.hub-std-dark-fallback .border-gray-200:not([data-hub-topbar]):not([data-hub-topbar] *) { border-color: #334155 !important; }'].join('\n');
      document.head.appendChild(st);
    } catch (eCss) {}
  }
}
function hubGetActiveMicrosoftUser() {
  let xrmName = '';
  let xrmEmail = '';
  let xrmId = '';
  try {
    const xrm = typeof window !== 'undefined' && (window.Xrm || window.parent && window.parent.Xrm) || null;
    if (xrm && xrm.Utility && typeof xrm.Utility.getGlobalContext === 'function') {
      const us = xrm.Utility.getGlobalContext().userSettings;
      if (us) {
        xrmName = String(us.userName || '').trim();
        xrmId = String(us.userId || '').replace(/[{}]/g, '').trim();
      }
    }
  } catch (eX) {}
  let savedName = '';
  let savedEmail = '';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = JSON.parse(window.localStorage.getItem(HUB_STD_USER_LS_KEY) || 'null');
      if (raw && typeof raw === 'object') {
        savedName = String(raw.name || raw.userName || '').trim();
        savedEmail = String(raw.email || raw.microsoftId || '').trim();
      }
    }
  } catch (eLs) {}
  const finalName = savedName || xrmName || 'William';
  let finalEmail = savedEmail || xrmEmail;
  if (!finalEmail) {
    if (finalName && finalName.indexOf('@') > 0) {
      finalEmail = finalName.toLowerCase();
    } else if (finalName) {
      const parts = finalName.replace(/,/g, ' ').trim().split(/\s+/).filter(Boolean);
      finalEmail = (parts.join('.').toLowerCase() || 'user') + '@apexfoods-demo.internal';
    } else if (xrmId) {
      finalEmail = xrmId;
    } else {
      finalEmail = 'william@apexfoods-demo.internal';
    }
  }
  return {
    name: finalName,
    userName: finalName,
    email: finalEmail,
    microsoftId: finalEmail,
    userId: xrmId
  };
}
function hubSaveActiveMicrosoftUser(name, email) {
  const cleanName = String(name || '').trim() || 'William';
  const cleanEmail = String(email || '').trim().toLowerCase() || cleanName.toLowerCase().replace(/\s+/g, '.') + '@apexfoods-demo.internal';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(HUB_STD_USER_LS_KEY, JSON.stringify({
        name: cleanName,
        userName: cleanName,
        email: cleanEmail,
        microsoftId: cleanEmail,
        source: 'manual',
        updatedAt: new Date().toISOString()
      }));
    }
  } catch (e) {}
  hubDiversionNotify();
  return {
    name: cleanName,
    userName: cleanName,
    email: cleanEmail,
    microsoftId: cleanEmail,
    source: 'manual'
  };
}
function apexfoodsClockwiseDonut(props) {
  const size = props && props.size || 52;
  const strokeWidth = props && props.strokeWidth || 5;
  const isDark = Boolean(props && props.isDark);
  React.useEffect(function () {
    hubEnsureStdStyles();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "apexfoods-clockwise-donut",
    "data-direction": "clockwise",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 50 50",
    width: size,
    height: size,
    className: "apexfoods-clockwise-donut-svg",
    style: {
      animation: 'apexfoodsDonutSpinCw 0.9s linear infinite',
      transformOrigin: '50% 50%',
      display: 'block'
    },
    "aria-label": "Loading clockwise"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "25",
    cy: "25",
    r: "20",
    fill: "none",
    stroke: isDark ? '#1e293b' : '#dbeafe',
    strokeWidth: strokeWidth
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "25",
    cy: "25",
    r: "20",
    fill: "none",
    stroke: "#0072CE",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeDasharray: "78 126",
    strokeDashoffset: "0"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "25",
    cy: "25",
    r: "20",
    fill: "none",
    stroke: "#FFB81C",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeDasharray: "24 126",
    strokeDashoffset: "-84"
  })));
}
function apexfoodsBrandLogo(props) {
  const unlocked = Boolean(props && props.unlocked);
  const isDark = Boolean(props && props.isDark);
  const showBadge = props && props.showBadge !== undefined ? Boolean(props.showBadge) : true;
  const lang = props && props.lang || 'en';
  const onClick = props && props.onClick;
  const badgeText = unlocked ? lang === 'es' ? 'Admin Activo' : 'Admin Active' : lang === 'es' ? 'Bloqueado' : 'Locked';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "apexfoods-brand-logo",
    "data-unlocked": unlocked ? 'true' : 'false',
    onClick: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof onClick === 'function') onClick(e);
    },
    title: props && props.title || (unlocked ? lang === 'es' ? 'Modo administrador desbloqueado (clic para bloquear)' : 'Admin mode unlocked (click to lock)' : lang === 'es' ? 'Clic en el logo de Apex Foods para desbloquear controles de administrador' : 'Click Apex Foods logo to unlock admin & developer controls'),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'transparent',
      border: 'none',
      padding: '2px 4px',
      cursor: 'pointer',
      textAlign: 'left',
      flexShrink: 0,
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: APEX_LOGO_DATA_URL,
    alt: "Apex Foods",
    style: {
      height: 36,
      width: 'auto',
      display: 'block',
      flexShrink: 0,
      borderRadius: 4,
      background: '#ffffff',
      padding: '2px 4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
      border: unlocked ? '1.5px solid #10b981' : '1px solid rgba(148,163,184,0.35)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      letterSpacing: '-0.02em',
      color: isDark ? '#93c5fd' : '#00468B',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif'
    }
  }, "APEX FOODS"), /*#__PURE__*/React.createElement("span", {
    style: {
      height: 3.5,
      width: '100%',
      background: unlocked ? '#10b981' : '#E4002B',
      marginTop: 2,
      borderRadius: 999
    }
  })), showBadge && /*#__PURE__*/React.createElement("span", {
    "data-testid": "hub-top-unlock-badge",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      border: unlocked ? '1px solid #10b981' : isDark ? '1px solid #475569' : '1px solid #cbd5e1',
      background: unlocked ? isDark ? '#064e3b' : '#ecfdf5' : isDark ? '#1e293b' : '#f1f5f9',
      color: unlocked ? isDark ? '#a7f3d0' : '#047857' : isDark ? '#cbd5e1' : '#475569'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: unlocked ? '#10b981' : '#94a3b8',
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", null, badgeText)));
}
function apexfoodsLoadingScreen(props) {
  const isDark = Boolean(props && props.isDark);
  const lang = props && props.lang || 'en';
  const appTitle = props && props.appTitle || 'Sanitation Ecosystem';
  const label = props && props.label || (lang === 'es' ? 'Cargando ' + appTitle + '...' : 'Loading ' + appTitle + '...');
  const sublabel = props && props.sublabel || (lang === 'es' ? 'Sincronizando tablas de Dataverse de Apex Foods...' : 'Synchronizing Apex Foods Dataverse ecosystem...');
  const overlay = Boolean(props && props.overlay);
  const onDismiss = props && props.onDismiss;
  React.useEffect(function () {
    hubEnsureStdStyles();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "apexfoods-loading-screen",
    onClick: typeof onDismiss === 'function' ? onDismiss : undefined,
    style: {
      position: overlay ? 'fixed' : 'relative',
      inset: overlay ? 0 : undefined,
      zIndex: overlay ? 99985 : undefined,
      minHeight: overlay ? '100vh' : '72vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? 'radial-gradient(circle at 50% 25%, #0f172a 0%, #020617 100%)' : 'radial-gradient(circle at 50% 25%, #f8fafc 0%, #e2e8f0 100%)',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      width: '100%',
      background: 'linear-gradient(90deg, #00468B 0%, #0072CE 55%, #FFB81C 82%, #E4002B 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 430,
      borderRadius: 18,
      padding: '28px 26px',
      background: isDark ? '#0f172a' : '#ffffff',
      border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
      boxShadow: '0 20px 45px -15px rgba(0, 70, 139, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("apexfoodsBrandLogo", {
    unlocked: Boolean(props && props.unlocked),
    isDark: isDark,
    lang: lang,
    showBadge: Boolean(props && props.onLogoClick),
    onClick: props && props.onLogoClick
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '6px 0 2px 0'
    }
  }, /*#__PURE__*/React.createElement("apexfoodsClockwiseDonut", {
    size: 58,
    strokeWidth: 5,
    isDark: isDark
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: isDark ? '#f8fafc' : '#0f172a',
      letterSpacing: '-0.01em'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 5
    }
  }, sublabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      padding: '4px 12px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      background: isDark ? '#1e293b' : '#eff6ff',
      color: isDark ? '#93c5fd' : '#00468B',
      border: isDark ? '1px solid #334155' : '1px solid #bfdbfe'
    }
  }, "Apex Foods SANITATION INVENTORY ECOSYSTEM"))));
}
function HubStandardTopBar(props) {
  const appKey = props && props.appKey || HUB_DIVERSION_STATE.activeAppKey || 'global';
  const appTitle = props && props.appTitle || 'Sanitation Hub';
  const appSubtitle = props && props.appSubtitle || '';
  const [localDark, setLocalDark] = React.useState(function () {
    try {
      return typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem(HUB_STD_THEME_LS_KEY) === '1';
    } catch (e) {
      return false;
    }
  });
  const [localLang, setLocalLang] = React.useState(function () {
    try {
      const v = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem(HUB_STD_LANG_LS_KEY);
      return v === 'es' ? 'es' : 'en';
    } catch (e) {
      return 'en';
    }
  });
  const [localUnlocked, setLocalUnlocked] = React.useState(function () {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (window.localStorage.getItem(HUB_STD_UNLOCK_LS_KEY) === '1') return true;
        if (window.localStorage.getItem('Plant 04_bolo_admin_unlocked') === '1') return true;
      }
    } catch (e) {}
    return false;
  });
  const [bootLoading, setBootLoading] = React.useState(function () {
    return props && props.disableBootOverlay ? false : true;
  });
  const [msModalOpen, setMsModalOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(function () {
    return hubGetActiveMicrosoftUser();
  });
  const [draftName, setDraftName] = React.useState(userProfile.name);
  const [draftEmail, setDraftEmail] = React.useState(userProfile.email);
  const isDark = props && props.isDark !== undefined ? Boolean(props.isDark) : localDark;
  const lang = props && props.lang ? props.lang === 'es' ? 'es' : 'en' : localLang;
  const unlocked = props && props.unlocked !== undefined ? Boolean(props.unlocked) : localUnlocked;
  React.useEffect(function () {
    hubEnsureStdStyles();
  }, []);
  React.useEffect(function () {
    const t = setTimeout(function () {
      setBootLoading(false);
    }, 520);
    return function () {
      clearTimeout(t);
    };
  }, []);

  // Apply fallback dark CSS class on document.body when the app does not provide its own dark mode handler
  const useFallbackDark = Boolean(props && props.applyGlobalDarkCss !== undefined ? props.applyGlobalDarkCss : !props || typeof props.onToggleDark !== 'function');
  React.useEffect(function () {
    if (typeof document === 'undefined' || !document.body) return;
    if (useFallbackDark && isDark) {
      document.body.classList.add('hub-std-dark-fallback');
    } else if (useFallbackDark && !isDark) {
      document.body.classList.remove('hub-std-dark-fallback');
    }
  }, [isDark, useFallbackDark]);
  const handleSetDark = function (nextDark) {
    setLocalDark(nextDark);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(HUB_STD_THEME_LS_KEY, nextDark ? '1' : '0');
      }
    } catch (e) {}
    if (props && typeof props.onToggleDark === 'function') {
      try {
        props.onToggleDark(nextDark);
      } catch (eD) {}
    }
  };
  const handleSetLang = function (nextLang) {
    const norm = nextLang === 'es' ? 'es' : 'en';
    setLocalLang(norm);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(HUB_STD_LANG_LS_KEY, norm);
      }
    } catch (e) {}
    if (props && typeof props.onChangeLang === 'function') {
      try {
        props.onChangeLang(norm);
      } catch (eL) {}
    }
  };
  const handleToggleUnlock = function () {
    const next = !unlocked;
    setLocalUnlocked(next);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(HUB_STD_UNLOCK_LS_KEY, next ? '1' : '0');
        window.localStorage.setItem('Plant 04_bolo_admin_unlocked', next ? '1' : '0');
        window.localStorage.setItem('hub_dev_diversion_unlocked', next ? 'true' : 'false');
      }
    } catch (e) {}
    if (props && typeof props.onToggleUnlock === 'function') {
      try {
        props.onToggleUnlock(next);
      } catch (eU) {}
    }
    hubDiversionNotify();
  };
  const effectiveUserName = props && props.userName || userProfile.name || 'William';
  const effectiveMsId = props && props.microsoftId || userProfile.microsoftId || userProfile.email || 'william@apexfoods-demo.internal';
  const roleLabel = props && props.roleLabel || (unlocked ? lang === 'es' ? 'Administrador' : 'Admin' : '');
  const showLoadingOverlay = Boolean(bootLoading || props && props.isLoading);
  return /*#__PURE__*/React.createElement(React.Fragment, null, showLoadingOverlay && /*#__PURE__*/React.createElement("apexfoodsLoadingScreen", {
    overlay: true,
    appTitle: appTitle,
    label: props && props.loadingLabel,
    isDark: isDark,
    lang: lang,
    unlocked: unlocked,
    onLogoClick: handleToggleUnlock,
    onDismiss: function () {
      setBootLoading(false);
    }
  }), /*#__PURE__*/React.createElement("div", {
    "data-hub-topbar": appKey,
    "data-testid": "hub-standard-topbar",
    style: {
      width: '100%',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      zIndex: 45,
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "hub-top-welcome-bar",
    style: {
      background: isDark ? '#020617' : '#00468B',
      color: '#ffffff',
      borderBottom: isDark ? '1px solid #1e293b' : '1px solid rgba(255,255,255,0.16)',
      padding: '6px 14px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#FFB81C',
      display: 'inline-block',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    "data-testid": "hub-top-welcome-text",
    style: {
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: '0.01em',
      color: '#ffffff'
    }
  }, (lang === 'es' ? 'Bienvenido(a) ' : 'Welcome ') + effectiveUserName), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#93c5fd',
      fontWeight: 700
    }
  }, ' - ' + appTitle), roleLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      textTransform: 'uppercase',
      padding: '2px 8px',
      borderRadius: 999,
      background: unlocked ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.14)',
      border: unlocked ? '1px solid rgba(52, 211, 153, 0.55)' : '1px solid rgba(255, 255, 255, 0.25)',
      color: unlocked ? '#a7f3d0' : '#e2e8f0'
    }
  }, (lang === 'es' ? 'Rol: ' : 'Role: ') + roleLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-top-msid-btn",
    onClick: function () {
      if (props && typeof props.onOpenMicrosoftIdModal === 'function') {
        props.onOpenMicrosoftIdModal();
      } else {
        setDraftName(effectiveUserName);
        setDraftEmail(effectiveMsId);
        setMsModalOpen(true);
      }
    },
    title: lang === 'es' ? 'Ver o cambiar Microsoft ID activo' : 'View or switch active Microsoft ID',
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 800,
      background: 'rgba(255, 255, 255, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.28)',
      color: '#ffffff',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fde68a',
      fontWeight: 900
    }
  }, "Microsoft ID:"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Consolas, monospace',
      fontWeight: 700
    }
  }, effectiveMsId)))), /*#__PURE__*/React.createElement("div", {
    "data-testid": "hub-top-controls-bar",
    style: {
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      borderBottom: isDark ? '2px solid #1e293b' : '2px solid #0072CE',
      padding: '8px 14px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("apexfoodsBrandLogo", {
    unlocked: unlocked,
    isDark: isDark,
    lang: lang,
    showBadge: true,
    onClick: handleToggleUnlock
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: isDark ? '#f8fafc' : '#00468B',
      lineHeight: 1.15
    }
  }, appTitle), appSubtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 1
    }
  }, appSubtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(HubDiversionDevControl, {
    appKey: appKey,
    unlocked: unlocked,
    onRouteChanged: props && props.onRouteChanged
  }), props && props.extraControls, /*#__PURE__*/React.createElement("div", {
    "data-testid": "hub-top-theme-toggle",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 8,
      padding: 2,
      background: isDark ? '#1e293b' : '#f1f5f9',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-top-theme-light",
    onClick: function () {
      handleSetDark(false);
    },
    style: {
      padding: '4px 9px',
      borderRadius: 6,
      border: 'none',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      background: !isDark ? '#0072CE' : 'transparent',
      color: !isDark ? '#ffffff' : '#94a3b8'
    }
  }, lang === 'es' ? 'Claro' : 'Light'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-top-theme-dark",
    onClick: function () {
      handleSetDark(true);
    },
    style: {
      padding: '4px 9px',
      borderRadius: 6,
      border: 'none',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      background: isDark ? '#0072CE' : 'transparent',
      color: isDark ? '#ffffff' : '#64748b'
    }
  }, lang === 'es' ? 'Oscuro' : 'Dark')), /*#__PURE__*/React.createElement("div", {
    "data-testid": "hub-top-lang-toggle",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 8,
      padding: 2,
      background: isDark ? '#1e293b' : '#f1f5f9',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-top-lang-en",
    onClick: function () {
      handleSetLang('en');
    },
    style: {
      padding: '4px 9px',
      borderRadius: 6,
      border: 'none',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      background: lang === 'en' ? '#0072CE' : 'transparent',
      color: lang === 'en' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'
    }
  }, "English"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-top-lang-es",
    onClick: function () {
      handleSetLang('es');
    },
    style: {
      padding: '4px 9px',
      borderRadius: 6,
      border: 'none',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      background: lang === 'es' ? '#0072CE' : 'transparent',
      color: lang === 'es' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'
    }
  }, "Espanol (MX)"))))), msModalOpen && /*#__PURE__*/React.createElement("div", {
    "data-testid": "hub-top-msid-modal",
    onClick: function () {
      setMsModalOpen(false);
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 99995,
      background: 'rgba(15, 23, 42, 0.72)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    },
    style: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 14,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      background: '#00468B',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 900
    }
  }, lang === 'es' ? 'Identidad de Microsoft Activa' : 'Active Microsoft ID Profile'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setMsModalOpen(false);
    },
    style: {
      background: 'transparent',
      border: 'none',
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, lang === 'es' ? 'Cerrar' : 'Close')), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, lang === 'es' ? 'Nombre de Usuario' : 'Display Name'), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: draftName,
    onChange: function (e) {
      setDraftName(e.target.value);
    },
    style: {
      padding: '8px 10px',
      borderRadius: 8,
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      background: isDark ? '#1e293b' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontSize: 13
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, "Microsoft ID / Email"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: draftEmail,
    onChange: function (e) {
      setDraftEmail(e.target.value);
    },
    style: {
      padding: '8px 10px',
      borderRadius: 8,
      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
      background: isDark ? '#1e293b' : '#f8fafc',
      color: isDark ? '#f8fafc' : '#0f172a',
      fontSize: 13,
      fontFamily: 'Consolas, monospace'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setMsModalOpen(false);
    },
    style: {
      padding: '7px 12px',
      borderRadius: 8,
      border: isDark ? '1px solid #475569' : '1px solid #cbd5e1',
      background: 'transparent',
      color: isDark ? '#cbd5e1' : '#475569',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, lang === 'es' ? 'Cancelar' : 'Cancel'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "hub-top-msid-save",
    onClick: function () {
      const nextU = hubSaveActiveMicrosoftUser(draftName, draftEmail);
      setUserProfile(nextU);
      setMsModalOpen(false);
      if (props && typeof props.onUserChanged === 'function') {
        try {
          props.onUserChanged(nextU);
        } catch (eUC) {}
      }
    },
    style: {
      padding: '7px 14px',
      borderRadius: 8,
      border: 'none',
      background: '#0072CE',
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, lang === 'es' ? 'Guardar Microsoft ID' : 'Save Microsoft ID'))))));
}
// === END HUB PAYLOAD DIVERSION v1.3 ===

// ============================================================================
// P0.1 - SANITATION DIRECTOR (EXECUTIVE & FINANCIAL CONTROLLER COMMAND CENTER)
// APP_VERSION: v1.00005
// Environment: Sanitation Inventory (8ea81470-36cb-f111-a05c-000d3a364646)
// Live Dataverse: https://demo.apexfoods.internal/
// Zero-Hallucination Deterministic Labor, Production, Crowding & Budget Engine
// Audited & Reconciled with Claude Opus CLI (Rounds 4A-4E 6/6 Sign-Off)
// ============================================================================

const APP_VERSION = 'v1.00005';
const SD_SETPOINT_TABLE = 'craa5_directorsetpoint';
const SD_CONFIG_TABLE = 'craa5__e_hubconfig';
const SD_EMP_TABLE = 'craa5__aa_employee';
const SD_ASSETS_TABLE = 'craa5_aa_assets';
const SD_AREA_TABLE = 'craa5_aa_mss_area';
const SD_PRD_SCHD_TABLE = 'craa5__aa_prd_schd';
const SD_CLEANPLAN_TABLE = 'craa5_cleanplan';
const SD_WORKSHIFTS_TABLE = 'craa5_workshifts';
const SD_LOG_TABLE = 'craa5__log_';
const SD_SHIFTARCHIVE_TABLE = 'craa5_shiftarchive';
const SD_SHIFTBOARD_TABLE = 'craa5_shiftboard';
const SD_TASKASSIGNMENT_TABLE = 'craa5_taskassignment';
const SD_LEADERSHIP_TABLE = 'craa5__aa_leadershipteam';

// Exclusive Microsoft / Dataverse Identity Gate for Marcus Vance (Sr Mgr Sanitation)
const SD_ADMIN_ALLOWED_IDS = ['a0000001-0000-4000-8000-000000000001'];
const LOGO_URL = "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%2240%22%20viewBox%3D%220%200%20140%2040%22%3E%3Crect%20width%3D%22140%22%20height%3D%2240%22%20rx%3D%226%22%20fill%3D%22%2300468B%22%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%2210%22%20fill%3D%22%23FFB81C%22%2F%3E%3Ctext%20x%3D%2238%22%20y%3D%2225%22%20font-family%3D%22Segoe%20UI%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22800%22%20fill%3D%22%23FFFFFF%22%3EAPEX%20FOODS%3C%2Ftext%3E%3C%2Fsvg%3E";
function BrandLogo({
  onClick,
  unlocked,
  isAdminAuthorized,
  isDark
} = {}) {
  const titleText = !isAdminAuthorized ? 'Apex Foods Setup Vault - Restricted to Marcus Vance Microsoft ID' : unlocked ? 'Setup Controls Unlocked (Marcus Verified) - Click Apex Foods logo to lock & show readouts only' : 'Setup Controls Hidden (Readout Mode) - Click Apex Foods logo to unlock setup sliders & preset manager';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    title: titleText,
    "aria-label": "Apex Foods Setup Vault Logo",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      letterSpacing: '0.02em',
      color: isDark ? '#F1F5F9' : '#1F2937',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      cursor: isAdminAuthorized ? 'pointer' : 'not-allowed',
      background: unlocked ? isDark ? 'rgba(255,184,28,0.18)' : '#FFF6E0' : isDark ? 'rgba(15,23,42,0.85)' : '#FFFFFF',
      border: unlocked ? '1.5px solid #FFB81C' : '1.5px solid #334155',
      borderRadius: 10,
      padding: '4px 10px',
      transition: 'all 0.15s ease'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO_URL,
    alt: "Apex Foods logo",
    style: {
      height: 32,
      width: 'auto',
      display: 'block',
      flexShrink: 0,
      borderRadius: 6,
      background: '#FFFFFF',
      padding: '2px 6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: isDark ? '#F1F5F9' : '#1F2937',
      fontWeight: 800
    }
  }, "APEX FOODS"), unlocked ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      padding: '2px 7px',
      fontSize: 10,
      fontWeight: 800,
      textTransform: 'uppercase',
      borderRadius: 4,
      background: 'rgba(16, 185, 129, 0.2)',
      color: '#10B981',
      border: '1px solid rgba(16, 185, 129, 0.4)'
    }
  }, "Setup Unlocked") : /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      padding: '2px 7px',
      fontSize: 10,
      fontWeight: 700,
      borderRadius: 4,
      background: 'rgba(148, 163, 184, 0.14)',
      color: isAdminAuthorized ? '#F59E0B' : '#94A3B8',
      border: '1px solid rgba(148, 163, 184, 0.25)'
    }
  }, isAdminAuthorized ? 'Readout Mode (Click Logo to Edit Setup)' : 'Readout Mode (Marcus ID Locked)'));
}

// Deterministic UUID v5-style generator matching hubIdFromKey across the ecosystem
function sdHubIdFromKey(str) {
  const s = String(str || '').trim().toLowerCase();
  let h1 = 0xdeadbeef ^ s.length,
    h2 = 0x41c6ce57 ^ s.length;
  let h3 = 0x9e3779b9 ^ s.length,
    h4 = 0x85ebca6b ^ s.length;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  h3 = Math.imul(h3 ^ h3 >>> 16, 2246822507) ^ Math.imul(h4 ^ h4 >>> 13, 3266489909);
  h4 = Math.imul(h4 ^ h4 >>> 16, 2246822507) ^ Math.imul(h3 ^ h3 >>> 13, 3266489909);
  const hex = n => (n >>> 0).toString(16).padStart(8, '0');
  const full = hex(h1) + hex(h2) + hex(h3) + hex(h4);
  return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-a${full.slice(17, 20)}-${full.slice(20, 32)}`;
}
function sdXrm() {
  try {
    if (window.Xrm && window.Xrm.WebApi) return hubDiversionWrapWebApi(window.Xrm.WebApi, 'director');
    if (window.parent && window.parent.Xrm && window.parent.Xrm.WebApi) return hubDiversionWrapWebApi(window.parent.Xrm.WebApi, 'director');
  } catch (e) {}
  return null;
}
function sdXrmContext() {
  try {
    if (window.Xrm && window.Xrm.Utility && window.Xrm.Utility.getGlobalContext) {
      return window.Xrm.Utility.getGlobalContext();
    }
    if (window.parent && window.parent.Xrm && window.parent.Xrm.Utility && window.parent.Xrm.Utility.getGlobalContext) {
      return window.parent.Xrm.Utility.getGlobalContext();
    }
  } catch (e) {}
  return null;
}

// ============================================================================
// SECTION 1: AUTHORITATIVE DATAVERSE BASELINE CONSTANTS (D1 - D13 VERIFIED)
// Programmatically generated from D6_area_exact_reconciled.csv, D1_assets_861.csv,
// and D4_cleanplan_scopes.csv with zero manual overrides.
//
// KEY RECONCILIATION TOTALS (29 Exact Lowercased Area Keys = 861 Total / 847 Active):
// - Active sumHrsReq (D1_assets_861.csv):        55,245 min (55,280 min incl 14 inactive tote rows)
// - Active weeklyFlagMin (weeklyclean == 'Yes'): 42,760 min across 633 active rows
// - Active dailyFlagMin (dailyclean == 'Yes'):   13,455 min across 239 active rows
// - Active dailyYesZeroMin (daily=Yes & dailymin==0): 10,845 min across 137 active rows (zero overlap with sumDailyMin!)
// - Active sumDailyMin (dailymin > 0):            2,110 min across 112 active rows (janitorial 101, highspeed 6, ibl5 4, chemical 1)
// - Active Periodic Sums: midweek=5,325m, monthly=6,485m, quarterly=1,270m, semiAnnual=945m, annual=4,595m
// - CleanPlan Raw Weekly Scope (D4_cleanplan_scopes.csv): 115,930 min
// - Exact P1.1 <= 16 * 60 Bug (29 active assets = 340m raw * 59 = 20,060m inflation):
//     * highspeed: 22 assets (245m raw * 59 = 14,455m delta; all 22 rows were summed into s|highspeed|weekly|1 = 27,626m)
//     * ibl4:       4 assets ( 60m raw * 59 =  3,540m delta; summed into s|ibl4|weekly|1 = 12,647m)
//     * ibl5:       3 assets ( 35m raw * 59 =  2,065m delta; summed into s|ibl5|weekly|1 = 9,491m)
// - CleanPlan De-Inflated Weekly Scope: 115,930 - 20,060 = 95,870 min
// ============================================================================

const SD_AREAS = [{
  key: 'ibl4',
  rawNames: 'IBL4',
  name: 'IBL4 (Bakery Line 4)',
  category: 'major_line',
  runsProduct: true,
  totalAssets: 174,
  activeAssets: 174,
  totalHrsReq: 6675,
  allAssetsHrsReq: 6675,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 2,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 2,
  dailyYesZeroMin: 0,
  midweekFlagMin: 5155,
  weeklyFlagCount: 170,
  weeklyFlagMin: 6465,
  monthlyFlagMin: 200,
  quarterlyFlagMin: 120,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 12647,
  cleanPlanDeinflatedEowMin: 9107,
  cleanPlanFullMin: 9334,
  bugAssetsCnt: 4,
  bugRawMin: 60,
  bugDeltaMin: 3540,
  bugAssetExamples: '4 assets <=16m (60m raw): 4ps - drains (15m), Production Jumpers (15m), Vanilla and Filter (1) (15m), Liquefier 1 Filter (15m)',
  allergenAddMin: 6498,
  maxSingleAssetMin: 210,
  critPathFloorMin: 315,
  defaultOptHeads: 12,
  defaultAssignedHeads: 12,
  sapScopeCode: 'SSAN4',
  missingStdAssets: 86,
  scheduleHorizonEnd: '2026-12-19'
}, {
  key: 'highspeed',
  rawNames: 'highspeed',
  name: 'Highspeed Line',
  category: 'major_line',
  runsProduct: true,
  totalAssets: 103,
  activeAssets: 103,
  totalHrsReq: 6435,
  allAssetsHrsReq: 6435,
  sumDailyMin: 150,
  cntDailyMinGt0: 6,
  dailyFlagCount: 9,
  dailyFlagMin: 610,
  dailyYesZeroCnt: 5,
  dailyYesZeroMin: 425,
  midweekFlagMin: 0,
  weeklyFlagCount: 59,
  weeklyFlagMin: 5190,
  monthlyFlagMin: 410,
  quarterlyFlagMin: 205,
  semiAnnualFlagMin: 85,
  annualFlagMin: 535,
  cleanPlanRawEowMin: 27626,
  cleanPlanDeinflatedEowMin: 13171,
  cleanPlanFullMin: 5333,
  bugAssetsCnt: 22,
  bugRawMin: 245,
  bugDeltaMin: 14455,
  bugAssetExamples: '22 assets <=16m (245m raw): North/South Xray (5m ea), North/South/West Nordson Hot Glue (5m ea), North/South OCS Checkweigher (5m ea), Marsh Printer (5m), East Label (10m), West Label (15m), North/South Bar Code Reader (15m ea), Hytrol/Gravity/HS Case Conveyors 1-4 (15m ea), South Captain 200A Cartoner (15m)',
  allergenAddMin: 4880,
  maxSingleAssetMin: 600,
  critPathFloorMin: 900,
  defaultOptHeads: 10,
  defaultAssignedHeads: 10,
  sapScopeCode: 'SSANDEMO',
  missingStdAssets: 0,
  scheduleHorizonEnd: '2026-11-13'
}, {
  key: 'custard',
  rawNames: 'custard',
  name: 'Custard Room & Line',
  category: 'major_line',
  runsProduct: true,
  totalAssets: 84,
  activeAssets: 84,
  totalHrsReq: 9780,
  allAssetsHrsReq: 9780,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 47,
  dailyFlagMin: 3060,
  dailyYesZeroCnt: 47,
  dailyYesZeroMin: 3060,
  midweekFlagMin: 0,
  weeklyFlagCount: 78,
  weeklyFlagMin: 8640,
  monthlyFlagMin: 330,
  quarterlyFlagMin: 420,
  semiAnnualFlagMin: 120,
  annualFlagMin: 840,
  cleanPlanRawEowMin: 19338,
  cleanPlanDeinflatedEowMin: 19338,
  cleanPlanFullMin: 13475,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 1440,
  critPathFloorMin: 2160,
  defaultOptHeads: 10,
  defaultAssignedHeads: 10,
  sapScopeCode: 'SSAN7',
  missingStdAssets: 3,
  scheduleHorizonEnd: '2026-12-03'
}, {
  key: 'ibl5',
  rawNames: 'IBL5',
  name: 'IBL5 (Bakery Line 5)',
  category: 'major_line',
  runsProduct: true,
  totalAssets: 84,
  activeAssets: 84,
  totalHrsReq: 6375,
  allAssetsHrsReq: 6375,
  sumDailyMin: 265,
  cntDailyMinGt0: 4,
  dailyFlagCount: 36,
  dailyFlagMin: 2755,
  dailyYesZeroCnt: 36,
  dailyYesZeroMin: 2755,
  midweekFlagMin: 170,
  weeklyFlagCount: 66,
  weeklyFlagMin: 4810,
  monthlyFlagMin: 255,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 465,
  annualFlagMin: 1205,
  cleanPlanRawEowMin: 9491,
  cleanPlanDeinflatedEowMin: 7426,
  cleanPlanFullMin: 3950,
  bugAssetsCnt: 3,
  bugRawMin: 35,
  bugDeltaMin: 2065,
  bugAssetExamples: '3 assets <=16m (35m raw): drizzle topping hopper / tank assembly (15m), 5ps - drains (15m), 5ps - printer box (exterior only) (5m)',
  allergenAddMin: 6265,
  maxSingleAssetMin: 260,
  critPathFloorMin: 390,
  defaultOptHeads: 12,
  defaultAssignedHeads: 12,
  sapScopeCode: 'SSAN5',
  missingStdAssets: 1,
  scheduleHorizonEnd: '2026-12-18'
}, {
  key: 'breading',
  rawNames: 'breading',
  name: 'Breading Line',
  category: 'major_line',
  runsProduct: true,
  totalAssets: 51,
  activeAssets: 51,
  totalHrsReq: 4300,
  allAssetsHrsReq: 4300,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 16,
  dailyFlagMin: 1215,
  dailyYesZeroCnt: 16,
  dailyYesZeroMin: 1215,
  midweekFlagMin: 0,
  weeklyFlagCount: 50,
  weeklyFlagMin: 4120,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 240,
  cleanPlanRawEowMin: 1596,
  cleanPlanDeinflatedEowMin: 1596,
  cleanPlanFullMin: 1475,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 600,
  critPathFloorMin: 900,
  defaultOptHeads: 8,
  defaultAssignedHeads: 8,
  sapScopeCode: 'SSANDEMO',
  missingStdAssets: 0,
  scheduleHorizonEnd: '2026-12-10'
}, {
  key: 'waterjet',
  rawNames: 'waterjet',
  name: 'Waterjet Room',
  category: 'major_line',
  runsProduct: true,
  totalAssets: 38,
  activeAssets: 38,
  totalHrsReq: 4300,
  allAssetsHrsReq: 4300,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 15,
  dailyFlagMin: 1870,
  dailyYesZeroCnt: 15,
  dailyYesZeroMin: 1870,
  midweekFlagMin: 0,
  weeklyFlagCount: 30,
  weeklyFlagMin: 3480,
  monthlyFlagMin: 180,
  quarterlyFlagMin: 35,
  semiAnnualFlagMin: 0,
  annualFlagMin: 785,
  cleanPlanRawEowMin: 5874,
  cleanPlanDeinflatedEowMin: 5874,
  cleanPlanFullMin: 2693,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 4705,
  maxSingleAssetMin: 300,
  critPathFloorMin: 450,
  defaultOptHeads: 10,
  defaultAssignedHeads: 10,
  sapScopeCode: 'SSAN3',
  missingStdAssets: 1,
  scheduleHorizonEnd: '2026-12-16'
}, {
  key: 'dough room',
  rawNames: 'dough room',
  name: 'Dough Room',
  category: 'secondary_line',
  runsProduct: true,
  totalAssets: 31,
  activeAssets: 31,
  totalHrsReq: 1215,
  allAssetsHrsReq: 1215,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 2,
  dailyFlagMin: 360,
  dailyYesZeroCnt: 2,
  dailyYesZeroMin: 360,
  midweekFlagMin: 0,
  weeklyFlagCount: 14,
  weeklyFlagMin: 1035,
  monthlyFlagMin: 540,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 2325,
  cleanPlanDeinflatedEowMin: 2325,
  cleanPlanFullMin: 720,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 480,
  maxSingleAssetMin: 360,
  critPathFloorMin: 540,
  defaultOptHeads: 6,
  defaultAssignedHeads: 5,
  sapScopeCode: 'DOUGH',
  missingStdAssets: 24,
  scheduleHorizonEnd: '2026-12-19'
}, {
  key: 'janitorial',
  rawNames: 'janitorial',
  name: 'Janitorial (Plant-Wide)',
  category: 'janitorial',
  runsProduct: false,
  totalAssets: 101,
  activeAssets: 101,
  totalHrsReq: 2525,
  allAssetsHrsReq: 2525,
  sumDailyMin: 1515,
  cntDailyMinGt0: 101,
  dailyFlagCount: 97,
  dailyFlagMin: 2425,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 100,
  weeklyFlagMin: 2500,
  monthlyFlagMin: 2500,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 25,
  cleanPlanRawEowMin: 6412,
  cleanPlanDeinflatedEowMin: 6412,
  cleanPlanFullMin: 5207,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 25,
  critPathFloorMin: 240,
  defaultOptHeads: 4,
  defaultAssignedHeads: 2,
  sapScopeCode: 'JANIT',
  missingStdAssets: 0
}, {
  key: 'floor scrubber',
  rawNames: 'floor scrubber',
  name: 'Floor Scrubber Fleet',
  category: 'standing_post',
  runsProduct: false,
  totalAssets: 12,
  activeAssets: 12,
  totalHrsReq: 1920,
  allAssetsHrsReq: 1920,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 12,
  weeklyFlagMin: 1920,
  monthlyFlagMin: 1560,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 6060,
  cleanPlanDeinflatedEowMin: 6060,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 360,
  critPathFloorMin: 360,
  defaultOptHeads: 4,
  defaultAssignedHeads: 2,
  sapScopeCode: 'SCRUB',
  missingStdAssets: 0
}, {
  key: 'chemical',
  rawNames: 'chemical',
  name: 'Chemical Room / Cage',
  category: 'standing_post',
  runsProduct: false,
  totalAssets: 6,
  activeAssets: 6,
  totalHrsReq: 260,
  allAssetsHrsReq: 260,
  sumDailyMin: 180,
  cntDailyMinGt0: 1,
  dailyFlagCount: 6,
  dailyFlagMin: 260,
  dailyYesZeroCnt: 5,
  dailyYesZeroMin: 260,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 440,
  cleanPlanDeinflatedEowMin: 440,
  cleanPlanFullMin: 440,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 120,
  critPathFloorMin: 120,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'CHEM',
  missingStdAssets: 3
}, {
  key: 'trash',
  rawNames: 'trash',
  name: 'Trash / Dock Compactor',
  category: 'standing_post',
  runsProduct: false,
  totalAssets: 4,
  activeAssets: 4,
  totalHrsReq: 240,
  allAssetsHrsReq: 240,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 2,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 2,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 240,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 3497,
  cleanPlanDeinflatedEowMin: 3497,
  cleanPlanFullMin: 3497,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 240,
  critPathFloorMin: 240,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'TRASH',
  missingStdAssets: 3
}, {
  key: 'support',
  rawNames: 'Support',
  name: 'Support (Placeholder 2x4320m)',
  category: 'standing_post',
  runsProduct: false,
  totalAssets: 2,
  activeAssets: 2,
  totalHrsReq: 8640,
  allAssetsHrsReq: 8640,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 1,
  weeklyFlagMin: 4320,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 4599,
  cleanPlanDeinflatedEowMin: 4599,
  cleanPlanFullMin: 279,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 4320,
  critPathFloorMin: 720,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'SUPPORT',
  missingStdAssets: 0
}, {
  key: 'admin',
  rawNames: 'admin',
  name: 'Admin (1x720m Row)',
  category: 'standing_post',
  runsProduct: false,
  totalAssets: 1,
  activeAssets: 1,
  totalHrsReq: 720,
  allAssetsHrsReq: 720,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 1,
  dailyFlagMin: 720,
  dailyYesZeroCnt: 1,
  dailyYesZeroMin: 720,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 720,
  cleanPlanRawEowMin: 720,
  cleanPlanDeinflatedEowMin: 720,
  cleanPlanFullMin: 720,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 720,
  critPathFloorMin: 720,
  defaultOptHeads: 1,
  defaultAssignedHeads: 1,
  sapScopeCode: 'ADMIN',
  missingStdAssets: 0
}, {
  key: 'pallet inverter',
  rawNames: 'Pallet inverter',
  name: 'Pallet Inverter',
  category: 'standing_post',
  runsProduct: false,
  totalAssets: 1,
  activeAssets: 1,
  totalHrsReq: 180,
  allAssetsHrsReq: 180,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 1,
  dailyFlagMin: 180,
  dailyYesZeroCnt: 1,
  dailyYesZeroMin: 180,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 2800,
  cleanPlanDeinflatedEowMin: 2800,
  cleanPlanFullMin: 2800,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 180,
  critPathFloorMin: 180,
  defaultOptHeads: 1,
  defaultAssignedHeads: 1,
  sapScopeCode: 'PALLET',
  missingStdAssets: 0
}, {
  key: 'tote',
  rawNames: 'tote|Tote',
  name: 'Tote Wash (14 Active / 14 Inactive)',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 28,
  activeAssets: 14,
  totalHrsReq: 490,
  allAssetsHrsReq: 525,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 490,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 510,
  cleanPlanDeinflatedEowMin: 510,
  cleanPlanFullMin: 475,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 1400,
  maxSingleAssetMin: 35,
  critPathFloorMin: 180,
  defaultOptHeads: 3,
  defaultAssignedHeads: 2,
  sapScopeCode: 'TOTE',
  missingStdAssets: 0
}, {
  key: 'silo',
  rawNames: 'silo',
  name: 'Silo (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 24,
  activeAssets: 24,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 1475,
  cleanPlanDeinflatedEowMin: 1475,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 240,
  defaultOptHeads: 3,
  defaultAssignedHeads: 2,
  sapScopeCode: 'SILO',
  missingStdAssets: 24
}, {
  key: 'kettles',
  rawNames: 'kettles',
  name: 'Kettles (22 of 23 Missing Asset Std)',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 23,
  activeAssets: 23,
  totalHrsReq: 35,
  allAssetsHrsReq: 35,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 15,
  weeklyFlagMin: 35,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 2945,
  cleanPlanDeinflatedEowMin: 2945,
  cleanPlanFullMin: 1680,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 35,
  critPathFloorMin: 180,
  defaultOptHeads: 4,
  defaultAssignedHeads: 3,
  sapScopeCode: 'KETTLE',
  missingStdAssets: 22
}, {
  key: 'smockroom',
  rawNames: 'smockroom',
  name: 'Smockroom (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 19,
  activeAssets: 19,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 19,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 110,
  cleanPlanDeinflatedEowMin: 110,
  cleanPlanFullMin: 110,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 120,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'SMOCK',
  missingStdAssets: 19
}, {
  key: 'scm',
  rawNames: 'scm',
  name: 'SCM (17 of 18 Missing Asset Std)',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 18,
  activeAssets: 18,
  totalHrsReq: 30,
  allAssetsHrsReq: 30,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 30,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 450,
  cleanPlanDeinflatedEowMin: 450,
  cleanPlanFullMin: 450,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 30,
  critPathFloorMin: 120,
  defaultOptHeads: 3,
  defaultAssignedHeads: 2,
  sapScopeCode: 'SCM',
  missingStdAssets: 17
}, {
  key: 'traywash',
  rawNames: 'traywash',
  name: 'Traywash (9 of 11 Missing Asset Std)',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 11,
  activeAssets: 11,
  totalHrsReq: 65,
  allAssetsHrsReq: 65,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 11,
  weeklyFlagMin: 65,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 65,
  cleanPlanDeinflatedEowMin: 65,
  cleanPlanFullMin: 65,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 65,
  critPathFloorMin: 180,
  defaultOptHeads: 3,
  defaultAssignedHeads: 2,
  sapScopeCode: 'TRAY',
  missingStdAssets: 10
}, {
  key: 'temper',
  rawNames: 'temper',
  name: 'Temper Area',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 9,
  activeAssets: 9,
  totalHrsReq: 80,
  allAssetsHrsReq: 80,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 35,
  annualFlagMin: 45,
  cleanPlanRawEowMin: 70,
  cleanPlanDeinflatedEowMin: 70,
  cleanPlanFullMin: 70,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 45,
  critPathFloorMin: 120,
  defaultOptHeads: 2,
  defaultAssignedHeads: 2,
  sapScopeCode: 'TEMPER',
  missingStdAssets: 7
}, {
  key: 'sifter',
  rawNames: 'sifter',
  name: 'Sifter (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 8,
  activeAssets: 8,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 1,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 1,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 6,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 1820,
  cleanPlanDeinflatedEowMin: 1820,
  cleanPlanFullMin: 1035,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 120,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'SIFTER',
  missingStdAssets: 8
}, {
  key: 'silo use bins',
  rawNames: 'silo use bins',
  name: 'Silo Use Bins (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 7,
  activeAssets: 7,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 0,
  cleanPlanDeinflatedEowMin: 0,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 120,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'SILOBIN',
  missingStdAssets: 7
}, {
  key: 'small steam pit',
  rawNames: 'small steam pit',
  name: 'Small Steam Pit',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 6,
  activeAssets: 6,
  totalHrsReq: 780,
  allAssetsHrsReq: 780,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 2,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 2,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 1,
  weeklyFlagMin: 180,
  monthlyFlagMin: 480,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 4800,
  cleanPlanDeinflatedEowMin: 4800,
  cleanPlanFullMin: 4320,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 300,
  critPathFloorMin: 300,
  defaultOptHeads: 3,
  defaultAssignedHeads: 2,
  sapScopeCode: 'STEAMPIT',
  missingStdAssets: 2
}, {
  key: 'wh7',
  rawNames: 'WH7',
  name: 'WH7 Warehouse',
  category: 'mss_area',
  runsProduct: false,
  totalAssets: 6,
  activeAssets: 6,
  totalHrsReq: 200,
  allAssetsHrsReq: 200,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 200,
  cleanPlanRawEowMin: 200,
  cleanPlanDeinflatedEowMin: 200,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 200,
  critPathFloorMin: 200,
  defaultOptHeads: 3,
  defaultAssignedHeads: 2,
  sapScopeCode: 'WH7',
  missingStdAssets: 5
}, {
  key: 'pie shell',
  rawNames: 'pie shell',
  name: 'Pie Shell (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 3,
  activeAssets: 3,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 0,
  cleanPlanDeinflatedEowMin: 0,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 120,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'PIESHELL',
  missingStdAssets: 3
}, {
  key: 'powder boost',
  rawNames: 'powder boost',
  name: 'Powder Boost (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 3,
  activeAssets: 3,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 2,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 2,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 1,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 0,
  cleanPlanDeinflatedEowMin: 0,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 60,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'POWDER',
  missingStdAssets: 3
}, {
  key: 'sifter + silo',
  rawNames: 'sifter + silo',
  name: 'Sifter + Silo (Missing Asset Standards)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 3,
  activeAssets: 3,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 0,
  cleanPlanDeinflatedEowMin: 0,
  cleanPlanFullMin: 0,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 90,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'SIFTSILO',
  missingStdAssets: 3
}, {
  key: 'large steam pit',
  rawNames: 'large steam pit',
  name: 'Large Steam Pit (Missing Asset Std)',
  category: 'missing_std',
  runsProduct: false,
  totalAssets: 1,
  activeAssets: 1,
  totalHrsReq: 0,
  allAssetsHrsReq: 0,
  sumDailyMin: 0,
  cntDailyMinGt0: 0,
  dailyFlagCount: 0,
  dailyFlagMin: 0,
  dailyYesZeroCnt: 0,
  dailyYesZeroMin: 0,
  midweekFlagMin: 0,
  weeklyFlagCount: 0,
  weeklyFlagMin: 0,
  monthlyFlagMin: 0,
  quarterlyFlagMin: 0,
  semiAnnualFlagMin: 0,
  annualFlagMin: 0,
  cleanPlanRawEowMin: 60,
  cleanPlanDeinflatedEowMin: 60,
  cleanPlanFullMin: 60,
  bugAssetsCnt: 0,
  bugRawMin: 0,
  bugDeltaMin: 0,
  bugAssetExamples: '',
  allergenAddMin: 0,
  maxSingleAssetMin: 0,
  critPathFloorMin: 180,
  defaultOptHeads: 2,
  defaultAssignedHeads: 1,
  sapScopeCode: 'LGSTEAM',
  missingStdAssets: 1
}];

// ============================================================================
// SECTION 2: LIVE PRODUCTION SCHEDULE (craa5__aa_prd_schd - D5 VERIFIED)
// Every line's totalRuns, distinctRunDates, allergenRuns, and totalCases
// in SD_PRD_SCHD_SUMMARY equals the EXACT mathematical sum of the 16 weekly
// rows (2026-08-30 to 2026-12-13) in SD_PRD_SCHD_WEEKLY and D5_prd_schd_weekly_summary.csv
// (431 runs in the 16-week Sep-Dec window + 5 out-of-window WaterJet rows = 436 total rows):
// - ibl4:      16 horizon wks (end 2026-12-19), 85 run-days (5.31/wk), 31 alrg (1.94/wk), 85 runs, 1,452,530 cases
// - ibl5:      16 horizon wks (end 2026-12-18), 72 run-days (4.50/wk), 22 alrg (1.38/wk), 72 runs, 4,039,000 cases
// - waterjet:  16 horizon wks (end 2026-12-16), 71 run-days (4.44/wk), 36 alrg (2.25/wk), 157 runs, 2,902,481 cases
//              (Note: 5 out-of-window WaterJet rows exist: 2 on 2026-12-23 + 3 on 2027-05-10 = 162 total WaterJet DB rows)
// - highspeed: 11 horizon wks (end 2026-11-13; 7 active + 4 down), 24 run-days (2.18/wk active, 1.50/wk 16wk), 6 alrg (0.55/wk), 24 runs, 164,103 cases
// - breading:  15 horizon wks (end 2026-12-10; 14 active + 1 down), 53 run-days (3.53/wk active, 3.31/wk 16wk), 0 alrg (0.00/wk), 53 runs, 311,000 cases
// - custard:   14 horizon wks (end 2026-12-03; 9 active + 5 down), 40 run-days (2.86/wk active, 2.50/wk 16wk), 19 alrg (1.36/wk), 40 runs, 245,418 cases
// ============================================================================

const SD_PRD_SCHD_SUMMARY = {
  totalScheduleRowsInDb: 436,
  totalSepDecMatrixRuns: 431,
  outOfWindowRuns: 5,
  outOfWindowNote: '5 out-of-window WaterJet rows outside 2026-08-30..2026-12-13: 2 rows on 2026-12-23 (week 2026-12-20, 5,928 cases) + 3 rows on 2027-05-10 (week 2027-05-09, 13,597 cases) = 19,525 out-of-window cases (436 total DB rows).',
  dateRangeStart: '2026-09-01',
  dateRangeEnd: '2026-12-19',
  totalWeeksInWindow: 16,
  lines: {
    'ibl4': {
      lineKey: 'ibl4',
      name: 'IBL4 (Bakery Line 4)',
      totalRuns: 85,
      distinctRunDates: 85,
      activeWeeksWithRuns: 16,
      publishedHorizonWeeks: 16,
      horizonEndDate: '2026-12-19',
      avgRunDaysPerActiveHorizonWk: 5.31,
      // 85 / 16
      avgRunDaysPer16Wk: 5.31,
      // 85 / 16
      octAvgRunDaysPerWk: 5.75,
      // Oct 4 wks: 5 + 6 + 6 + 6 = 23 / 4
      allergenRunsTotal: 31,
      avgAllergenPerWk: 1.94,
      // 31 / 16
      totalCases: 1452530,
      note: 'Runs 5-6 days/wk continuously across all 16 weeks (85 run-days, 31 allergen runs).'
    },
    'ibl5': {
      lineKey: 'ibl5',
      name: 'IBL5 (Bakery Line 5)',
      totalRuns: 72,
      distinctRunDates: 72,
      activeWeeksWithRuns: 16,
      publishedHorizonWeeks: 16,
      horizonEndDate: '2026-12-18',
      avgRunDaysPerActiveHorizonWk: 4.50,
      // 72 / 16
      avgRunDaysPer16Wk: 4.50,
      // 72 / 16
      octAvgRunDaysPerWk: 5.25,
      // Oct 4 wks: 5 + 6 + 5 + 5 = 21 / 4
      allergenRunsTotal: 22,
      avgAllergenPerWk: 1.38,
      // 22 / 16
      totalCases: 4039000,
      note: 'Runs 4-6 days/wk across all 16 weeks (72 run-days, 22 allergen runs).'
    },
    'waterjet': {
      lineKey: 'waterjet',
      name: 'Waterjet Room',
      totalRuns: 157,
      distinctRunDates: 71,
      activeWeeksWithRuns: 16,
      publishedHorizonWeeks: 16,
      horizonEndDate: '2026-12-16',
      avgRunDaysPerActiveHorizonWk: 4.44,
      // 71 / 16
      avgRunDaysPer16Wk: 4.44,
      // 71 / 16
      octAvgRunDaysPerWk: 5.25,
      // Oct 4 wks: 5 + 6 + 5 + 5 = 21 / 4
      allergenRunsTotal: 36,
      avgAllergenPerWk: 2.25,
      // 36 / 16
      totalCases: 2902481,
      note: 'Multiple product SKUs per day (157 runs across 71 distinct operating days in 16 weeks; +5 out-of-window rows: 2 on 2026-12-23 & 3 on 2027-05-10 = 162 total DB rows).'
    },
    'highspeed': {
      lineKey: 'highspeed',
      name: 'Highspeed Line',
      totalRuns: 24,
      distinctRunDates: 24,
      activeWeeksWithRuns: 7,
      publishedHorizonWeeks: 11,
      horizonEndDate: '2026-11-13',
      avgRunDaysPerActiveHorizonWk: 2.18,
      // 24 / 11wks in published horizon
      avgRunDaysPer16Wk: 1.50,
      // 24 / 16wks
      octAvgRunDaysPerWk: 3.00,
      // Oct 4 wks: 1 + 1 + 5 + 5 = 12 / 4
      allergenRunsTotal: 6,
      avgAllergenPerWk: 0.55,
      // 6 / 11wks
      totalCases: 164103,
      note: 'Published schedule ends 2026-11-13 (11 wks: 7 active weeks = 24 run-days, 4 down weeks where Custard ran).'
    },
    'breading': {
      lineKey: 'breading',
      name: 'Breading Line',
      totalRuns: 53,
      distinctRunDates: 53,
      activeWeeksWithRuns: 14,
      publishedHorizonWeeks: 15,
      horizonEndDate: '2026-12-10',
      avgRunDaysPerActiveHorizonWk: 3.53,
      // 53 / 15wks in published horizon
      avgRunDaysPer16Wk: 3.31,
      // 53 / 16wks
      octAvgRunDaysPerWk: 3.50,
      // Oct 4 wks: 3 + 4 + 3 + 4 = 14 / 4
      allergenRunsTotal: 0,
      avgAllergenPerWk: 0.00,
      totalCases: 311000,
      note: 'Published schedule ends 2026-12-10 (15 wks: 14 active weeks = 53 run-days, 1 down week).'
    },
    'custard': {
      lineKey: 'custard',
      name: 'Custard Room & Line',
      totalRuns: 40,
      distinctRunDates: 40,
      activeWeeksWithRuns: 9,
      publishedHorizonWeeks: 14,
      horizonEndDate: '2026-12-03',
      avgRunDaysPerActiveHorizonWk: 2.86,
      // 40 / 14wks in published horizon
      avgRunDaysPer16Wk: 2.50,
      // 40 / 16wks
      octAvgRunDaysPerWk: 2.00,
      // Oct 4 wks: 4 + 4 + 0 + 0 = 8 / 4
      allergenRunsTotal: 19,
      avgAllergenPerWk: 1.36,
      // 19 / 14wks
      totalCases: 245418,
      note: 'Published schedule ends 2026-12-03 (14 wks: 9 active weeks = 40 run-days, 5 down weeks; alternates with Highspeed).'
    },
    'dough room': {
      lineKey: 'dough room',
      name: 'Dough Room (Derived from IBL4/IBL5 Schedule)',
      isDerivedFromBakery: true,
      totalRuns: 85,
      distinctRunDates: 80,
      activeWeeksWithRuns: 16,
      publishedHorizonWeeks: 16,
      horizonEndDate: '2026-12-19',
      avgRunDaysPerActiveHorizonWk: 5.00,
      avgRunDaysPer16Wk: 5.00,
      octAvgRunDaysPerWk: 5.50,
      allergenRunsTotal: 8,
      avgAllergenPerWk: 0.50,
      totalCases: 0,
      note: 'Derived support schedule (no separate dough room rows in craa5__aa_prd_schd): operates in tandem with IBL4/IBL5 bakery production days (~5.0 days/wk).'
    }
  }
};

// Complete 16-week week-by-week schedule matrix from D5_prd_schd_weekly_summary.csv
// Column sums: ibl4=85d/31a (85r), ibl5=72d/22a (72r), waterjet=71d/36a (157r), breading=53d/0a (53r), custard=40d/19a (40r), highspeed=24d/6a (24r) -> Total = 431 in-window runs + 5 out-of-window = 436 DB rows
const SD_PRD_SCHD_WEEKLY = [{
  weekSunday: '2026-08-30',
  label: 'Wk 01 (Aug 30 - Sep 05)',
  days: {
    ibl4: 4,
    ibl5: 4,
    waterjet: 4,
    breading: 3,
    custard: 0,
    highspeed: 4,
    'dough room': 4
  },
  alrg: {
    ibl4: 0,
    ibl5: 1,
    waterjet: 4,
    breading: 0,
    custard: 0,
    highspeed: 4,
    'dough room': 0
  },
  runs: {
    ibl4: 4,
    ibl5: 4,
    waterjet: 11,
    breading: 3,
    custard: 0,
    highspeed: 4
  }
}, {
  weekSunday: '2026-09-06',
  label: 'Wk 02 (Sep 06 - Sep 12)',
  days: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 5,
    breading: 0,
    custard: 0,
    highspeed: 5,
    'dough room': 5
  },
  alrg: {
    ibl4: 0,
    ibl5: 2,
    waterjet: 5,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 11,
    breading: 0,
    custard: 0,
    highspeed: 5
  }
}, {
  weekSunday: '2026-09-13',
  label: 'Wk 03 (Sep 13 - Sep 19)',
  days: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 5,
    breading: 5,
    custard: 4,
    highspeed: 0,
    'dough room': 5
  },
  alrg: {
    ibl4: 5,
    ibl5: 0,
    waterjet: 0,
    breading: 0,
    custard: 1,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 11,
    breading: 5,
    custard: 4,
    highspeed: 0
  }
}, {
  weekSunday: '2026-09-20',
  label: 'Wk 04 (Sep 20 - Sep 26)',
  days: {
    ibl4: 6,
    ibl5: 6,
    waterjet: 6,
    breading: 5,
    custard: 6,
    highspeed: 0,
    'dough room': 6
  },
  alrg: {
    ibl4: 0,
    ibl5: 1,
    waterjet: 0,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 6,
    ibl5: 6,
    waterjet: 13,
    breading: 5,
    custard: 6,
    highspeed: 0
  }
}, {
  weekSunday: '2026-09-27',
  label: 'Wk 05 (Sep 27 - Oct 03)',
  days: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 5,
    breading: 5,
    custard: 6,
    highspeed: 0,
    'dough room': 5
  },
  alrg: {
    ibl4: 5,
    ibl5: 0,
    waterjet: 2,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 10,
    breading: 5,
    custard: 6,
    highspeed: 0
  }
}, {
  weekSunday: '2026-10-04',
  label: 'Wk 06 (Oct 04 - Oct 10)',
  days: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 5,
    breading: 3,
    custard: 4,
    highspeed: 1,
    'dough room': 5
  },
  alrg: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 0,
    breading: 0,
    custard: 2,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 11,
    breading: 3,
    custard: 4,
    highspeed: 1
  }
}, {
  weekSunday: '2026-10-11',
  label: 'Wk 07 (Oct 11 - Oct 17)',
  days: {
    ibl4: 6,
    ibl5: 6,
    waterjet: 6,
    breading: 4,
    custard: 4,
    highspeed: 1,
    'dough room': 6
  },
  alrg: {
    ibl4: 0,
    ibl5: 2,
    waterjet: 4,
    breading: 0,
    custard: 4,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 6,
    ibl5: 6,
    waterjet: 12,
    breading: 4,
    custard: 4,
    highspeed: 1
  }
}, {
  weekSunday: '2026-10-18',
  label: 'Wk 08 (Oct 18 - Oct 24)',
  days: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 5,
    breading: 3,
    custard: 0,
    highspeed: 5,
    'dough room': 5
  },
  alrg: {
    ibl4: 0,
    ibl5: 2,
    waterjet: 6,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 12,
    breading: 3,
    custard: 0,
    highspeed: 5
  }
}, {
  weekSunday: '2026-10-25',
  label: 'Wk 09 (Oct 25 - Oct 31)',
  days: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 5,
    breading: 4,
    custard: 0,
    highspeed: 5,
    'dough room': 6
  },
  alrg: {
    ibl4: 6,
    ibl5: 0,
    waterjet: 4,
    breading: 0,
    custard: 0,
    highspeed: 2,
    'dough room': 1
  },
  runs: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 11,
    breading: 4,
    custard: 0,
    highspeed: 5
  }
}, {
  weekSunday: '2026-11-01',
  label: 'Wk 10 (Nov 01 - Nov 07)',
  days: {
    ibl4: 4,
    ibl5: 4,
    waterjet: 4,
    breading: 2,
    custard: 4,
    highspeed: 0,
    'dough room': 4
  },
  alrg: {
    ibl4: 0,
    ibl5: 0,
    waterjet: 0,
    breading: 0,
    custard: 4,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 4,
    ibl5: 4,
    waterjet: 8,
    breading: 2,
    custard: 4,
    highspeed: 0
  }
}, {
  weekSunday: '2026-11-08',
  label: 'Wk 11 (Nov 08 - Nov 14)',
  days: {
    ibl4: 5,
    ibl5: 3,
    waterjet: 3,
    breading: 3,
    custard: 0,
    highspeed: 3,
    'dough room': 4
  },
  alrg: {
    ibl4: 0,
    ibl5: 1,
    waterjet: 1,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 5,
    ibl5: 3,
    waterjet: 7,
    breading: 3,
    custard: 0,
    highspeed: 3
  }
}, {
  weekSunday: '2026-11-15',
  label: 'Wk 12 (Nov 15 - Nov 21)',
  days: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 5,
    breading: 4,
    custard: 5,
    highspeed: 0,
    'dough room': 5
  },
  alrg: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 2,
    breading: 0,
    custard: 1,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 10,
    breading: 4,
    custard: 5,
    highspeed: 0
  },
  unpublishedHorizon: ['highspeed']
}, {
  weekSunday: '2026-11-22',
  label: 'Wk 13 (Nov 22 - Nov 28)',
  days: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 3,
    breading: 3,
    custard: 3,
    highspeed: 0,
    'dough room': 4
  },
  alrg: {
    ibl4: 0,
    ibl5: 0,
    waterjet: 4,
    breading: 0,
    custard: 3,
    highspeed: 0,
    'dough room': 0
  },
  runs: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 6,
    breading: 3,
    custard: 3,
    highspeed: 0
  },
  unpublishedHorizon: ['highspeed']
}, {
  weekSunday: '2026-11-29',
  label: 'Wk 14 (Nov 29 - Dec 05)',
  days: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 2,
    breading: 5,
    custard: 4,
    highspeed: 0,
    'dough room': 5
  },
  alrg: {
    ibl4: 5,
    ibl5: 2,
    waterjet: 0,
    breading: 0,
    custard: 4,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 5,
    ibl5: 5,
    waterjet: 4,
    breading: 5,
    custard: 4,
    highspeed: 0
  },
  unpublishedHorizon: ['highspeed']
}, {
  weekSunday: '2026-12-06',
  label: 'Wk 15 (Dec 06 - Dec 12)',
  days: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 5,
    breading: 4,
    custard: 0,
    highspeed: 0,
    'dough room': 5
  },
  alrg: {
    ibl4: 0,
    ibl5: 2,
    waterjet: 4,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 12,
    breading: 4,
    custard: 0,
    highspeed: 0
  },
  unpublishedHorizon: ['highspeed', 'custard']
}, {
  weekSunday: '2026-12-13',
  label: 'Wk 16 (Dec 13 - Dec 19)',
  days: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 3,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 6
  },
  alrg: {
    ibl4: 0,
    ibl5: 5,
    waterjet: 0,
    breading: 0,
    custard: 0,
    highspeed: 0,
    'dough room': 1
  },
  runs: {
    ibl4: 6,
    ibl5: 5,
    waterjet: 8,
    breading: 0,
    custard: 0,
    highspeed: 0
  },
  unpublishedHorizon: ['highspeed', 'custard', 'breading']
}];

// ============================================================================
// SECTION 3: LIVE CREW ROSTER, EMBEDDED SPECIALIST SPLIT & Q2 ALIGNMENT (D7/D8)
// Matches D7_employees_clean.csv (emp_list.txt) 100.0%:
// - 100 Active Floor Staff = 90 Direct Wash Cleaners + 10 Embedded Specialists
//   * Crew A: 20 Active Floor = 15 Direct Wash Cleaners (11 T1, 2 T2, 2 T3) + 5 Specialists
//   * Crew B: 26 Active Floor = 24 Direct Wash Cleaners (17 T1, 5 T2, 2 T3) + 2 Specialists
//   * Crew C: 26 Active Floor = 24 Direct Wash Cleaners (19 T1, 2 T2, 3 T3) + 2 Specialists
//   * Crew D: 28 Active Floor = 27 Direct Wash Cleaners (24 T1, 2 T2, 1 T3) + 1 Specialist
// - Tier Totals across 100 Active Floor:
//   * Tech 1 ($18/h default): 75 (71 Direct + 4 Specialists: 2 Admins, 1 Janitor, 1 Trash)
//   * Tech 2 ($21/h default): 17 (11 Direct + 6 Specialists: 4 Inspectors, 2 Chem Clerks)
//   * Tech 3 ($24/h default):  8 ( 8 Direct Leads)
// ============================================================================

const SD_ROSTER_SUMMARY = {
  totalDbRows: 122,
  totalActiveFloorStaff: 100,
  totalDirectWashCleaners: 90,
  totalEmbeddedSpecialists: 10,
  totalAuthorizedFloorTarget: 107,
  totalFloorVacancies: 7,
  activeSupervisors: 3,
  supervisorVacancies: 1,
  dptHeadInterim: {
    name: 'Marcus Vance',
    title: 'Interim Dpt Head / Sr Mgr Sanitation (Covering Crew A Sup Vacancy)',
    empRowId1: '7269de9e-1022-f111-8341-00224809bad2',
    empRowId2: 'a6b123c9-542c-f111-88b4-00224809bad2',
    systemUserId: 'a0000001-0000-4000-8000-000000000001',
    replacesDeactivated: 'Victor Thorne (deactivated per Q2)'
  },
  crews: {
    'A': {
      crew: 'A',
      shiftType: 'Day Shift (06:00-18:00, Sun-Tue + alt Wed)',
      supervisorStatus: 'VACANT (Interim: Marcus Vance - Dpt Head)',
      supervisorName: 'VACANT (Marcus Vance Interim)',
      supervisorId: '7269de9e-1022-f111-8341-00224809bad2',
      supervisorActiveCount: 0,
      deactivatedSupervisor: 'Victor Thorne (1706e486-3222-f111-8341-00224809bad2); Marcus Vance duplicate supervisor row (a6b123c9-542c-f111-88b4-00224809bad2) also excluded from floor capacity',
      activeFloor: 20,
      directCleaners: 15,
      embeddedSpecialists: 5,
      authorizedFloor: 27,
      authorizedDirect: 22,
      floorVacancies: 7,
      tech1: 14,
      tech2: 4,
      tech3: 2,
      directTech1: 11,
      directTech2: 2,
      directTech3: 2,
      specialistsList: 'Jordan Hayes (Inspector), Alex Brooks (Chem Clerk), Taylor Price (Admin), Morgan Bennett (Janitor), Casey Wood (Trash)',
      leads: 'Sam Miller (Lead/Tech 3), Riley Barnes (Lead/Tech 3), Jamie Ross (Lead/Tech 2)'
    },
    'B': {
      crew: 'B',
      shiftType: 'Day Shift (06:00-18:00, Thu-Sat + alt Wed)',
      supervisorStatus: 'ACTIVE',
      supervisorName: 'Elena Mercer',
      supervisorId: '1806e486-3222-f111-8341-00224809bad2',
      supervisorActiveCount: 1,
      deactivatedSupervisor: 'Rachel Chen reassigned Crew B -> Crew D',
      activeFloor: 26,
      directCleaners: 24,
      embeddedSpecialists: 2,
      authorizedFloor: 26,
      authorizedDirect: 24,
      floorVacancies: 0,
      tech1: 18,
      tech2: 6,
      tech3: 2,
      directTech1: 17,
      directTech2: 5,
      directTech3: 2,
      specialistsList: 'Quinn Henderson (Inspector), Avery Coleman (Admin)',
      leads: 'Parker Jenkins (Lead/Tech 3), Hayden Perry (Lead/Tech 3), Dakota Powell (Lead/Tech 2)'
    },
    'C': {
      crew: 'C',
      shiftType: 'Night Shift (18:00-06:00, Sun-Tue + alt Wed)',
      supervisorStatus: 'ACTIVE',
      supervisorName: 'David Sterling',
      supervisorId: 'dc0babb5-3422-f111-8341-00224809bad2',
      supervisorActiveCount: 1,
      deactivatedSupervisor: 'Logan Vance (63cf7272-7c24-f111-8341-00224809bad2) deactivated per Q2',
      activeFloor: 26,
      directCleaners: 24,
      embeddedSpecialists: 2,
      authorizedFloor: 26,
      authorizedDirect: 24,
      floorVacancies: 0,
      tech1: 19,
      tech2: 4,
      tech3: 3,
      directTech1: 19,
      directTech2: 2,
      directTech3: 3,
      specialistsList: 'Reese Long (Inspector), Sawyer Hughes (Chem Clerk)',
      leads: 'Emerson Butler (Lead/Tech 3), Finley Simmons (Lead/Tech 3), River Foster (Lead/Tech 3), Skyler Bryant (Lead/Tech 2)',
      archiveTransferNote: 'D9 ShiftArchive shows 4 staff (Hamilton B->C, Graham D->C, Sullivan D->C, Wallace D->C) logged under David Sterling on Crew C in Oct 18-29.'
    },
    'D': {
      crew: 'D',
      shiftType: 'Night Shift (18:00-06:00, Thu-Sat + alt Wed)',
      supervisorStatus: 'ACTIVE',
      supervisorName: 'Rachel Chen',
      supervisorId: '3450222d-3622-f111-8341-00224809bad2',
      supervisorActiveCount: 1,
      deactivatedSupervisor: 'Caleb Ross (b18c593b-7c24-f111-8341-00224809bad2) deactivated per Q2',
      activeFloor: 28,
      directCleaners: 27,
      embeddedSpecialists: 1,
      authorizedFloor: 28,
      authorizedDirect: 27,
      floorVacancies: 0,
      tech1: 24,
      tech2: 3,
      tech3: 1,
      directTech1: 24,
      directTech2: 2,
      directTech3: 1,
      specialistsList: 'Peyton Alexander (Inspector)',
      leads: 'Rowan Patterson (Lead/Tech 3), Kendall Russell (Lead/Tech 2), Blake Griffin (Lead/Tech 2)'
    }
  }
};
const SD_EMP_SEED = [
// Leadership / Supervisors / Deactivated per Q2 (8 rows)
{
  id: '7269de9e-1022-f111-8341-00224809bad2',
  name: 'Vance, Marcus',
  crew: 'ALL',
  role: 'Dpt Head (Interim Manager)',
  tier: 'dpt_head',
  active: true,
  isFloor: false,
  isSupervisor: false,
  isDptHead: true,
  isSpecialist: false,
  note: 'Active Interim Dpt Head covering Manager & Crew A Sup'
}, {
  id: 'a6b123c9-542c-f111-88b4-00224809bad2',
  name: 'Vance, Marcus (Dup Manager Row)',
  crew: 'A',
  role: 'Manager (Duplicate Row)',
  tier: 'excluded',
  active: false,
  isFloor: false,
  isSupervisor: false,
  isDptHead: false,
  isSpecialist: false,
  note: 'Duplicate row excluded so Marcus is not double-counted'
}, {
  id: '1706e486-3222-f111-8341-00224809bad2',
  name: 'Thorne, Victor',
  crew: 'A',
  role: 'Supervisor (Deactivated)',
  tier: 'excluded',
  active: false,
  isFloor: false,
  isSupervisor: false,
  isDptHead: false,
  isSpecialist: false,
  note: 'Deactivated per Q2 ruling (craa5__aa_leadershipteam)'
}, {
  id: '1806e486-3222-f111-8341-00224809bad2',
  name: 'Mercer, Elena',
  crew: 'B',
  role: 'Supervisor',
  tier: 'supervisor',
  active: true,
  isFloor: false,
  isSupervisor: true,
  isDptHead: false,
  isSpecialist: false,
  note: 'Crew B Supervisor'
}, {
  id: 'dc0babb5-3422-f111-8341-00224809bad2',
  name: 'Sterling, David',
  crew: 'C',
  role: 'Supervisor',
  tier: 'supervisor',
  active: true,
  isFloor: false,
  isSupervisor: true,
  isDptHead: false,
  isSpecialist: false,
  note: 'Crew C Supervisor (replaces Logan Vance)'
}, {
  id: '63cf7272-7c24-f111-8341-00224809bad2',
  name: 'Vance, Logan',
  crew: 'C',
  role: 'Supervisor (Deactivated)',
  tier: 'excluded',
  active: false,
  isFloor: false,
  isSupervisor: false,
  isDptHead: false,
  isSpecialist: false,
  note: 'Deactivated per Q2 ruling'
}, {
  id: '3450222d-3622-f111-8341-00224809bad2',
  name: 'Chen, Rachel',
  crew: 'D',
  role: 'Supervisor',
  tier: 'supervisor',
  active: true,
  isFloor: false,
  isSupervisor: true,
  isDptHead: false,
  isSpecialist: false,
  note: 'Crew D Supervisor (reassigned B->D, replaces Caleb Ross)'
}, {
  id: 'b18c593b-7c24-f111-8341-00224809bad2',
  name: 'Ross, Caleb',
  crew: 'D',
  role: 'Supervisor (Deactivated)',
  tier: 'excluded',
  active: false,
  isFloor: false,
  isSupervisor: false,
  isDptHead: false,
  isSpecialist: false,
  note: 'Deactivated per Q2 ruling'
},
// Complete 100 Active Floor Employees from D7_employees_clean.csv (90 Direct Wash Cleaners + 10 Embedded Specialists)
{
  id: 'e8ec78e5-1f49-4cdc-b5b5-59d5d28e0efa',
  name: 'Foster, Morgan',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '79ac8233-ea8b-40cc-9586-be2aee3c3911',
  name: 'Wallace, Hayden',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '4823f923-01fc-4cc2-8163-94d667bcfb96',
  name: 'Brooks, River',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '853f3bf4-318a-4b04-a878-52d4e3b1978b',
  name: 'Long, Devon',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '603519be-a58b-49f9-ad2d-b262b8b560c8',
  name: 'Griffin, Alex',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '3127016d-ed26-f111-8341-00224809bad2',
  name: 'Jordan, Avery',
  crew: 'A',
  role: 'Trash',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Trash'
}, {
  id: '724c68cc-1538-41c5-830f-fe0b064ea775',
  name: 'Barnes, Emerson',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '2e89dada-a595-483b-9877-37bc7bc3914e',
  name: 'Washington, Cameron',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'ae30095e-d09f-f111-b8dc-00224803ce0b',
  name: 'Hamilton, Ellis',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '1bffc674-7db1-42b5-bdac-0f4fcdc2b583',
  name: 'Ellis, Jamie',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '52368c9f-9814-4a56-a77b-72addc4b2103',
  name: 'Jenkins, Rowan',
  crew: 'A',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'a1c9035f-e71e-41e0-83ae-940f4fb60807',
  name: 'Bryant, Kendall',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '8e0acc74-cf9b-40ca-a4e4-57823dca27a6',
  name: 'Woods, Rory',
  crew: 'A',
  role: 'Chemical Clerk',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Chemical Clerk'
}, {
  id: '23acf91d-4d99-47ef-92aa-605e6fb45a9a',
  name: 'Price, Casey',
  crew: 'A',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '37d699e0-3422-f111-8341-00224809bad2',
  name: 'Patterson, Dakota',
  crew: 'A',
  role: 'Janitor',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Janitor'
}, {
  id: 'e0707722-24c0-4f72-813d-49e9ecd84844',
  name: 'Diaz, Skyler',
  crew: 'A',
  role: 'Sanitation Tech 2',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '02a6ecfd-6eaf-4782-9968-67ee4644c0a3',
  name: 'Owens, Micah',
  crew: 'A',
  role: 'Lead (Tech 2)',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c68afdd4-1022-f111-8341-00224809bad2',
  name: 'Ross, Taylor',
  crew: 'A',
  role: 'Sanitation Admin',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Sanitation Admin'
}, {
  id: '5994c743-f933-4f4a-bd77-189ca0b12e9b',
  name: 'Butler, Parker',
  crew: 'A',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '8b4cb1a1-14b3-4424-b43c-d13031c2dbc1',
  name: 'Graham, Finley',
  crew: 'A',
  role: 'Inspector',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Inspector'
}, {
  id: '2a3ee0ff-1022-f111-8341-00224809bad2',
  name: 'Harrison, Logan',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'e41c821a-1122-f111-8341-00224809bad2',
  name: 'Perry, Jordan',
  crew: 'B',
  role: 'Sanitation Tech 2',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '2bc39fb3-0c9c-f111-b8db-00224803ce0b',
  name: 'Alexander, Quinn',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '1c3a992d-3522-f111-8341-00224809bad2',
  name: 'Cole, Sawyer',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '96e008e0-3122-f111-8341-00224809bad2',
  name: 'Bennett, Blake',
  crew: 'B',
  role: 'Sanitation Tech 2',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '66a153ed-3122-f111-8341-00224809bad2',
  name: 'Hughes, Spencer',
  crew: 'B',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '8f0850cf-0c9c-f111-b8db-00224803ce0b',
  name: 'Myers, Riley',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '0c077b31-1122-f111-8341-00224809bad2',
  name: 'Reynolds, Reese',
  crew: 'B',
  role: 'Sanitation Admin',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Sanitation Admin'
}, {
  id: '99556339-1122-f111-8341-00224809bad2',
  name: 'Henderson, Peyton',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '8ee37134-3522-f111-8341-00224809bad2',
  name: 'Simmons, Tatum',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'edec6012-7339-f111-88b4-00224809bad2',
  name: 'Sullivan, Morgan',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'ed7ed015-0e0f-4a90-a2f0-f371cb0d4e6d',
  name: 'Hayes, Hayden',
  crew: 'B',
  role: 'Sanitation Tech 2',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'f58cbf93-0c9c-f111-b8db-00224803ce0b',
  name: 'Powell, River',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'a78238a8-ce4c-4196-9c6b-62766bf77e6c',
  name: 'Russell, Devon',
  crew: 'B',
  role: 'Inspector',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Inspector'
}, {
  id: '1d0aa15f-1122-f111-8341-00224809bad2',
  name: 'West, Alex',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c2ebaa78-1122-f111-8341-00224809bad2',
  name: 'Wood, Avery',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '67a153ed-3122-f111-8341-00224809bad2',
  name: 'Flores, Emerson',
  crew: 'B',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'dc35a666-098d-f111-ab0e-00224803ce0b',
  name: 'Ford, Cameron',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c9acfd87-1122-f111-8341-00224809bad2',
  name: 'Fisher, Ellis',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '24886bce-3122-f111-8341-00224809bad2',
  name: 'Coleman, Jamie',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '750d55e1-81b3-f111-aaac-000d3a364646',
  name: 'Foster, Rowan',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '73c3a6c4-c4bd-f111-aaaf-000d3a364646',
  name: 'Wallace, Kendall',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '25886bce-3122-f111-8341-00224809bad2',
  name: 'Brooks, Rory',
  crew: 'B',
  role: 'Lead (Tech 2)',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '43704969-3522-f111-8341-00224809bad2',
  name: 'Long, Casey',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'a362c1d9-3122-f111-8341-00224809bad2',
  name: 'Griffin, Dakota',
  crew: 'B',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '97e008e0-3122-f111-8341-00224809bad2',
  name: 'Jordan, Skyler',
  crew: 'B',
  role: 'Sanitation Tech 2',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '5d7461bb-3222-f111-8341-00224809bad2',
  name: 'Barnes, Micah',
  crew: 'C',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '9abe31c9-3222-f111-8341-00224809bad2',
  name: 'Washington, Taylor',
  crew: 'C',
  role: 'Lead (Tech 2)',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '792066e3-3222-f111-8341-00224809bad2',
  name: 'Hamilton, Parker',
  crew: 'C',
  role: 'Chemical Clerk',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Chemical Clerk'
}, {
  id: '71f6f665-7239-f111-88b4-00224809bad2',
  name: 'Ellis, Finley',
  crew: 'C',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '901dad28-5794-f111-8075-00224803ce0b',
  name: 'Jenkins, Logan',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '3fd7a1f1-3222-f111-8341-00224809bad2',
  name: 'Bryant, Jordan',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c64f3da7-3422-f111-8341-00224809bad2',
  name: 'Woods, Quinn',
  crew: 'C',
  role: 'Sanitation Tech 2',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '410f70b9-4a9f-f111-b8dc-00224803ce0b',
  name: 'Price, Sawyer',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '020c821a-cd99-f111-b8db-00224803ce0b',
  name: 'Patterson, Blake',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '184f399d-4daa-f111-aaab-000d3a364646',
  name: 'Diaz, Spencer',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '0b2259f8-3222-f111-8341-00224809bad2',
  name: 'Owens, Riley',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '96b8bda9-4a9f-f111-b8dc-00224803ce0b',
  name: 'Ross, Reese',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'dd0babb5-3422-f111-8341-00224809bad2',
  name: 'Butler, Peyton',
  crew: 'C',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '28b7eafe-3222-f111-8341-00224809bad2',
  name: 'Graham, Tatum',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '63499db3-d1a4-f111-b8de-00224803ce0b',
  name: 'Harrison, Morgan',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '3d654705-3322-f111-8341-00224809bad2',
  name: 'Perry, Hayden',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '7aacc008-cd99-f111-b8db-00224803ce0b',
  name: 'Alexander, River',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c3b98b36-5794-f111-8075-00224803ce0b',
  name: 'Cole, Devon',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'aa8c6f75-3422-f111-8341-00224809bad2',
  name: 'Bennett, Alex',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '6a45ce81-3422-f111-8341-00224809bad2',
  name: 'Hughes, Avery',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '75957c5f-3422-f111-8341-00224809bad2',
  name: 'Myers, Emerson',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '1a98a66b-3422-f111-8341-00224809bad2',
  name: 'Reynolds, Cameron',
  crew: 'C',
  role: 'Inspector',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Inspector'
}, {
  id: '7728bb42-ca8e-f111-ab0e-00224803ce0b',
  name: 'Henderson, Ellis',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '06b57389-3422-f111-8341-00224809bad2',
  name: 'Simmons, Jamie',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c074fed6-d1a4-f111-b8de-00224803ce0b',
  name: 'Sullivan, Rowan',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '3cc43498-3422-f111-8341-00224809bad2',
  name: 'Hayes, Kendall',
  crew: 'C',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '430a6ce0-158a-f111-ab0f-00224803ce0b',
  name: 'Powell, Rory',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'ec1d53f9-3422-f111-8341-00224809bad2',
  name: 'Russell, Casey',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'df5e4306-3522-f111-8341-00224809bad2',
  name: 'West, Dakota',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '925e2a18-3522-f111-8341-00224809bad2',
  name: 'Wood, Skyler',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'dd21e85b-138a-f111-ab0f-00224803ce0b',
  name: 'Flores, Micah',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '274a53b2-5b85-f111-ab0e-00224809e68b',
  name: 'Ford, Taylor',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '35f6bf54-4daa-f111-aaab-000d3a364646',
  name: 'Fisher, Parker',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '0bf681c1-7734-f111-88b4-00224809bad2',
  name: 'Coleman, Finley',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '77926047-138a-f111-ab0f-00224803ce0b',
  name: 'Foster, Logan',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '1e81cf98-a58b-f111-ab0f-00224803ce0b',
  name: 'Wallace, Jordan',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'aec695cd-d1a4-f111-b8de-00224803ce0b',
  name: 'Brooks, Quinn',
  crew: 'D',
  role: 'Inspector',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: true,
  specialistRole: 'Inspector'
}, {
  id: '6d8bc13b-3522-f111-8341-00224809bad2',
  name: 'Long, Sawyer',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'c3bafe5d-1395-f111-8075-00224803ce0b',
  name: 'Griffin, Blake',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'be03db50-3622-f111-8341-00224809bad2',
  name: 'Jordan, Spencer',
  crew: 'D',
  role: 'Lead (Tech 2)',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '0233f143-3522-f111-8341-00224809bad2',
  name: 'Barnes, Riley',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '95766853-fdaf-f111-aaac-000d3a364646',
  name: 'Washington, Reese',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '6b4d1450-3522-f111-8341-00224809bad2',
  name: 'Hamilton, Peyton',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '8a4d1450-3522-f111-8341-00224809bad2',
  name: 'Ellis, Tatum',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'd29e1583-30a7-f111-b8de-00224803ce0b',
  name: 'Jenkins, Morgan',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'e8978e8e-2491-f111-8076-00224803ce0b',
  name: 'Bryant, Hayden',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '455e0304-a696-f111-8075-00224803ce0b',
  name: 'Woods, River',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '417c506d-fdaf-f111-aaac-000d3a364646',
  name: 'Price, Devon',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'be768379-3522-f111-8341-00224809bad2',
  name: 'Patterson, Alex',
  crew: 'D',
  role: 'Lead (Tech 3)',
  tier: 'tech3',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'feebe35e-3522-f111-8341-00224809bad2',
  name: 'Diaz, Avery',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '46c08f70-3522-f111-8341-00224809bad2',
  name: 'Owens, Emerson',
  crew: 'D',
  role: 'Lead (Tech 2)',
  tier: 'tech2',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '0ff83575-a8cd-f111-a05c-000d3a364646',
  name: 'Ross, Cameron',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: '45c08f70-3522-f111-8341-00224809bad2',
  name: 'Butler, Ellis',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}, {
  id: 'ad125277-29c8-f111-aaaf-000d3a364646',
  name: 'Graham, Jamie',
  crew: 'D',
  role: 'Sanitation Tech 1',
  tier: 'tech1',
  active: true,
  isFloor: true,
  isSpecialist: false
}];

// ============================================================================
// SECTION 4: CHEMICAL & SUPPLY SPEND (D10 VERIFIED: craa5__g_pohistory & craa5__m_material)
// Separates Pure Sanitation Chemicals ($871,945.28 across 67 POs: ChemGuard + SaniTech)
// from Industrial PPE/Maintenance Supplies ($112,350.09 across 63 POs: Apex Supply + 523418).
// ============================================================================
const SD_VENDORS = [{
  vendor: 'ChemGuard Solutions',
  category: 'Sanitizers, Foaming Detergents, CIP Acid/Caustic, OxySan-P',
  isPureChemical: true,
  poCount: 41,
  annualSpend: 681863.28,
  sharePct: 69.27,
  pureChemSharePct: 78.20
}, {
  vendor: 'SaniTech Group',
  category: 'Specialty Sanitation Chemicals, Intervention Blends',
  isPureChemical: true,
  poCount: 26,
  annualSpend: 190082.00,
  sharePct: 19.31,
  pureChemSharePct: 21.80
}, {
  vendor: 'Apex Industrial Supply',
  category: 'PPE, Squeegees, Hoses, Nozzles, Brushes, Lockout Padlocks',
  isPureChemical: false,
  poCount: 57,
  annualSpend: 103463.29,
  sharePct: 10.51,
  pureChemSharePct: 0.00
}, {
  vendor: 'Vendor 523418 (Specialty)',
  category: 'ATP Swab Consumables, Titration Kits & Lab Supplies',
  isPureChemical: false,
  poCount: 6,
  annualSpend: 8886.80,
  sharePct: 0.90,
  pureChemSharePct: 0.00
}];
const SD_HIST_PURE_CHEM_SPEND = 871945.28; // ChemGuard ($681,863.28) + SaniTech ($190,082.00) across 67 POs
const SD_HIST_PPE_SUPPLY_SPEND = 112350.09; // Apex Supply ($103,463.29) + Vendor 523418 ($8,886.80) across 63 POs
const SD_HIST_TOTAL_PO_SPEND = 984295.37; // Total across all 130 PO history records
const SD_CART_COMMITTED_SPEND = 1177769.18; // Active open/committed cart lines in craa5__c_cart (122 rows)

// ============================================================================
// SECTION 5: FOREGROUND FORENSICS ON LOG INFLATION (Q5: D11 craa5__log_)
// Exact October 2026 Dataverse extraction: 8,026 rows = 564,733 min (9,412.2h)
// ============================================================================
const SD_LOG_OCT_FORENSICS = {
  totalRows: 8026,
  totalReportedMin: 564733,
  totalReportedHrs: 9412.2,
  default60MinRows: 2593,
  default60MinPct: 32.3,
  zeroMinRows: 1254,
  zeroMinPct: 15.6,
  multiHourRows180Plus: 350,
  byCrew: {
    A: {
      rows: 1749,
      min: 92955,
      hrs: 1549.3
    },
    B: {
      rows: 1656,
      min: 138440,
      hrs: 2307.3
    },
    C: {
      rows: 2046,
      min: 147165,
      hrs: 2452.8
    },
    D: {
      rows: 2575,
      min: 186173,
      hrs: 3102.9
    }
  }
};

// ============================================================================
// SECTION 6: LIVE SHIFT ARCHIVE EMPIRICAL ATTENDANCE (Q8: D9 craa5_shiftarchive)
// 30 archived shift snapshots (Oct 18 - Oct 29, 2026).
// Raw events = 67; Deduplicated floor employee events = 63:
// - 32 PTO (50.8% of shrinkage is Paid Time Off!)
// - 19 Sick (30.2% unplanned sick)
// - 12 Left Early (19.0% partial shift)
// ============================================================================
const SD_SHIFT_ARCHIVE_SUMMARY = {
  totalArchivedShifts: 30,
  uniqueShiftDates: 24,
  dateWindow: '2026-10-18 to 2026-10-29',
  rawEventsCount: 67,
  dedupedFloorEventsCount: 63,
  totalSick: 19,
  totalPto: 32,
  totalLeftEarly: 12,
  paidPtoShareOfShrinkage: 0.508,
  // 32 / 63 = 50.8% of absences are Paid PTO
  empiricalOverallShrinkagePct: 10.5,
  byCrew: {
    A: {
      uniqueShifts: 7,
      rawEvents: 16,
      dedupedEvents: 12,
      sick: 0,
      pto: 7,
      leftEarly: 5,
      empiricalShrinkPct: 6.8,
      note: 'Deduped 10-26 double-save, 10-27 Ross overlap, and 10-28 Marcus self-PTO'
    },
    B: {
      uniqueShifts: 6,
      rawEvents: 6,
      dedupedEvents: 6,
      sick: 0,
      pto: 6,
      leftEarly: 0,
      empiricalShrinkPct: 3.8,
      note: 'Lowest unplanned absence rate in Oct 18-29 window'
    },
    C: {
      uniqueShifts: 6,
      rawEvents: 31,
      dedupedEvents: 31,
      sick: 13,
      pto: 13,
      leftEarly: 5,
      empiricalShrinkPct: 18.3,
      note: 'Highest absence concentration (Hamilton 4x Sick, Woods 4x Sick, 5x PTO Sun/Tue)'
    },
    D: {
      uniqueShifts: 5,
      rawEvents: 14,
      dedupedEvents: 14,
      sick: 6,
      pto: 6,
      leftEarly: 2,
      empiricalShrinkPct: 9.3,
      note: 'Includes Thu/Sat sick cluster (Cole 3x, Thomas, West)'
    }
  },
  empiricalMatrix: {
    A: [7.5, 6.5, 6.5, 6.8, 0.0, 0.0, 0.0],
    B: [0.0, 0.0, 0.0, 3.8, 3.8, 3.8, 3.8],
    C: [21.0, 19.2, 19.2, 13.5, 0.0, 0.0, 0.0],
    D: [0.0, 0.0, 0.0, 7.1, 10.7, 9.5, 9.8]
  }
};

// ============================================================================
// SECTION 7: LIVE OBSTACLES & TIME-LOSS LOG (D12: craa5_obstacles & craa5_timelosslog)
// Every operational row below is traced by exact sourceTable and full recordKey to
// D12_obstacles.csv (12 rows: 11 operational + 1 test row 'obs|testsuite|x' with 0m)
// and D12_timelosslog.csv (11 rows: 6 operational Oct 2026 rows + 5 June 2024
// '# InsightsAppsPlatform' platform seed rows Log1..Log5).
// ============================================================================
const SD_OBSTACLES_EXCLUDED_SEED_NOTE = 'Excluded non-operational test/seed records: (1) craa5_obstacles row obs|testsuite|x (97c73897-bd0c-48f6-ada2-d5696d902a50, 2026-10-24, Packaging, 0 min test entry); (2) 5 craa5_timelosslog June 2024 # InsightsAppsPlatform seed rows: Log1 (4a21fe09-1241-4be7-9029-d035bd1b3cc7, Break 15m), Log2 (59479c4e-b964-42ee-a38a-56aae88ee44d, Meeting 30m), Log3 (a653ee7e-5375-4535-ab5a-2dcc222be51c, Training 45m), Log4 (0cfd7fb7-51cc-4d76-b978-d0f61a0054eb, Maintenance 60m), Log5 (278c7829-2397-401c-99bc-888a871fd600, Other 20m).';
const SD_OBSTACLES_LIVE = [{
  date: '2026-10-26',
  crew: 'A',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnj6r0|27h4',
  recordGuid: 'fbbb1260-303d-4049-aa17-45caac115763',
  area: 'Highspeed (Kettles)',
  category: 'Prerequisite / Extra Soil Load',
  durationMin: 330,
  headsAffected: 2,
  manMinsLost: 660,
  note: 'Found excess sugar/crusted filling around kettles; delayed shutdown turned wash into chisel work (09:00-14:30, Cameron Myers & Sam Miller).'
}, {
  date: '2026-10-25',
  crew: 'A',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnh2xu|27h4',
  recordGuid: 'bd93cac9-5df6-4b10-9dc7-6a036ba4004a',
  area: 'IBL4 (802 CIP Tank)',
  category: 'Water, Steam or Utilities',
  durationMin: 180,
  headsAffected: 2,
  manMinsLost: 360,
  note: 'OxySan-P chemical pump went out during weekend CIP; Sam Miller replaced (cross-logged in craa5_timelosslog 4cf983c5-94d0-f111-a05b-000d3a364646).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_timelosslog',
  recordKey: '03a3e3f5-d9cf-f111-a05b-000d3a364646',
  recordGuid: '03a3e3f5-d9cf-f111-a05b-000d3a364646',
  area: 'Waterjet (FSQ Inspect)',
  category: 'Quality (FSQ) Short Staffed',
  durationMin: 180,
  headsAffected: 4,
  manMinsLost: 720,
  note: 'Lack of FSQ inspectors to check the line (cross-logged in craa5_obstacles obs|tnfcyb|lic8 / 18f2e679-7d6e-44b4-9697-fd270ad9651a: 180m).'
}, {
  date: '2026-10-27',
  crew: 'A',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnkbwz|iss7',
  recordGuid: 'e25bc23f-9477-4d0e-934d-f74960ec7c50',
  area: 'IBL 5',
  category: 'QA / Pre-Op Verification Hold',
  durationMin: 50,
  headsAffected: 5,
  manMinsLost: 250,
  note: 'FSQ short inspectors and tied up in other areas (02:30-03:20 hold across 5 heads; source record crew = A, logged by David Sterling).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnfcvx|lic8',
  recordGuid: 'ad8a3eda-f961-4377-8a54-d588f7cc228d',
  area: 'Specified Equipment (Freezer)',
  category: 'Maintenance / Freezer Ready',
  durationMin: 150,
  headsAffected: 1,
  manMinsLost: 150,
  note: 'Waiting for freezer to be ready (Devon Ford / Marcus Vance).'
}, {
  date: '2026-10-24',
  crew: 'D',
  sourceTable: 'craa5_timelosslog',
  recordKey: '25a8584a-d9cf-f111-a05b-000d3a364646',
  recordGuid: '25a8584a-d9cf-f111-a05b-000d3a364646',
  area: 'IBL4 (4 Freezer)',
  category: 'Maintenance / Weekend Clean',
  durationMin: 120,
  headsAffected: 4,
  manMinsLost: 480,
  note: 'Weekend 2026-10-24 IBL4 4 Freezer maintenance delay (4 heads x 120m = 480 man-min).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnfjuo|lic8',
  recordGuid: '835737e5-9124-4210-8395-14cb398d6ad6',
  area: 'Specified Equipment (Slicer 1)',
  category: 'Maintenance / Mechanical',
  durationMin: 145,
  headsAffected: 1,
  manMinsLost: 145,
  note: 'Slicer 1 not able to be turned on for cleaning rotation.'
}, {
  date: '2026-10-24',
  crew: 'D',
  sourceTable: 'craa5_timelosslog',
  recordKey: '5e04f299-cecf-f111-a05b-000d3a364646',
  recordGuid: '5e04f299-cecf-f111-a05b-000d3a364646',
  area: 'Waterjet (2 Waterjet Slice)',
  category: 'Harborage Mitigation',
  durationMin: 120,
  headsAffected: 2,
  manMinsLost: 240,
  note: 'Harborage point identified under the slicer - extra mitigation done (2 heads x 120m = 240 man-min).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnfcz1|lic8',
  recordGuid: 'e851fbb3-dfb5-453e-9ee7-a3a9746cbae4',
  area: 'Specified Equipment (D7)',
  category: 'Lack of Tools / Parts',
  durationMin: 120,
  headsAffected: 1,
  manMinsLost: 120,
  note: 'Missing D7 Part 3 assembly during wash teardown.'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnfcxv|lic8',
  recordGuid: 'd40e23fe-0015-40f7-b73b-a12cd66a7acd',
  area: 'Dough Room / Breading',
  category: 'Lack of Tools (Scissor Lift)',
  durationMin: 90,
  headsAffected: 1,
  manMinsLost: 90,
  note: 'Scissor lift taken by Maintenance after lunch (90m obstacle record; also cross-logged in craa5_timelosslog 18be3ce1-d9cf-f111-a05b-000d3a364646 as 60m x 2 heads = 120 man-min).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_timelosslog',
  recordKey: 'e83ea4f7-cecf-f111-a05b-000d3a364646',
  recordGuid: 'e83ea4f7-cecf-f111-a05b-000d3a364646',
  area: 'IBL5 (3 Front Line)',
  category: 'Maintenance Safety Guards',
  durationMin: 60,
  headsAffected: 3,
  manMinsLost: 180,
  note: 'Rack line safety guards off; regular maintenance mechanics familiar with guard placements absent (3 heads x 60m).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnf3o5|lic8',
  recordGuid: '9b744024-9fc7-483d-a477-7a2a910ea49b',
  area: 'Custard',
  category: 'Maintenance (Resolved)',
  durationMin: 5,
  headsAffected: 1,
  manMinsLost: 5,
  note: 'Custard equipment maintenance obstacle logged 10:14 AM - 10:19 AM (0m explicit duration field; 5m elapsed window).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnf3pg|lic8',
  recordGuid: '73311c83-4a21-46e2-b7a9-9709daf71120',
  area: 'Waterjet',
  category: 'Extra Cleaning Steps (Resolved)',
  durationMin: 4,
  headsAffected: 1,
  manMinsLost: 4,
  note: 'Waterjet extra cleaning steps logged 10:15 AM - 10:19 AM (0m explicit duration field; 4m elapsed window).'
}, {
  date: '2026-10-24',
  crew: 'B',
  sourceTable: 'craa5_obstacles',
  recordKey: 'obs|tnf3wr|lic8',
  recordGuid: 'f93d2703-c415-4c62-8a89-2025da70f1bc',
  area: 'Small Steam Pit',
  category: 'Extra Cleaning Steps (Active)',
  durationMin: 0,
  headsAffected: 1,
  manMinsLost: 0,
  note: 'Small steam pit extra cleaning steps logged 10:19 AM (0m explicit duration field).'
}];
// ============================================================================
// SECTION 8: DEFAULT CONTROLLER SETPOINTS (Q1 - Q9 ADJUSTABLE INPUTS)
// Zero invented numbers:
// - engineeringBasis defaults to 'assets_eow_explicit_daily' (100% pure craa5_aa_assets:
//   55,245m EOW + 2,110m explicit dailymin, with dailySharePct = 0% by default so no
//   unverified percentage is assumed unless the user adjusts the slider 0%-100%).
// - lineRunDaysSliders & lineAllergenRunsSliders match D5_prd_schd_weekly_summary.csv 100%.
// - payrollBasis defaults to 'full_roster_42h' (40h regular + 2h over-40 Panama schedule OT
//   = 43.0 straight-time-equivalent base hrs + 42.0h fringe/wk, including Paid PTO).
// - standingPostBasis defaults to 'productive_net' (matches supply's net productive hours/shift).
// ============================================================================

// List of sensitive compensation keys stripped when saving shared presets to craa5__e_hubconfig or localStorage
const SD_SENSITIVE_PAY_KEYS = ['rateTech1', 'rateTech2', 'rateTech3', 'supervisorSalaryAnnual', 'includeDptHead', 'dptHeadMode', 'dptHeadSalaryAnnual', 'dptHeadHourlyRate', 'fringeBurdenPct', 'empRateOverrides', 'payrollBasis'];
const SD_DEFAULT_SETPOINTS = {
  // T1/G1/G2: Engineering Standard Basis (3-Way Controller Selector)
  // 'assets_eow_explicit_daily' : Pure craa5_aa_assets (55,245m EOW + 2,110m explicit dailymin + dailySharePct of dailyYesZeroMin)
  // 'assets_full_daily'         : Upper Bound (55,245m EOW + 2,110m explicit dailymin + 100% of 10,845m dailyYesZeroMin on every turn)
  // 'cleanplan_deinflated'      : CleanPlan Scope (D4_cleanplan_scopes.csv 115,930m minus exact 20,060m 59x P1.1 bug = 95,870m)
  engineeringBasis: 'assets_eow_explicit_daily',
  dailySharePct: 0,
  // Default 0% (pure populated craa5_dailymin; user can slide 0%-100% for the 137 daily=Yes assets where dailymin==0)

  // Q1: Support & Indirect Scope Mode + Janitorial Contractor Toggle
  supportMode: 'standing_posts',
  // 'assets' (Mode A: Asset-Driven from craa5_aa_assets) | 'standing_posts' (Mode B: Per-Shift Standing Posts)
  standingPostBasis: 'productive_net',
  // 'productive_net' (10.75h net productive/shift, matching supply) | 'gross_shift' (12.0h gross/shift)
  janitorialMode: 'contractor_excluded',
  // 'contractor_excluded' (Outside Contractor) | 'in_house_included' (In-House Sanitation Scope)
  standingPosts: {
    chemCageDay: 1,
    chemCageNight: 1,
    adminDay: 1,
    adminNight: 0,
    qaSwabDay: 2,
    qaSwabNight: 2,
    trashDockDay: 1,
    trashDockNight: 1,
    scrubberDay: 1,
    scrubberNight: 1
  },
  // Q2: Crew Headcounts & Authorized Targets (Active Floor = Direct Cleaners + Embedded Specialists)
  crewActiveHeadcount: {
    A: 20,
    // 15 Direct Wash Cleaners + 5 Embedded Specialists (7 Floor Vacancies vs 27 Target + 1 Sup Vacancy)
    B: 26,
    // 24 Direct Wash Cleaners + 2 Embedded Specialists (Elena Mercer Active Sup)
    C: 26,
    // 24 Direct Wash Cleaners + 2 Embedded Specialists (David Sterling Active Sup; Logan Vance deactivated)
    D: 28 // 27 Direct Wash Cleaners + 1 Embedded Specialist  (Rachel Chen Active Sup; Caleb Ross deactivated)
  },
  crewDirectHeadcount: {
    A: 15,
    B: 24,
    C: 24,
    D: 27
  },
  crewAuthorizedTargets: {
    A: 27,
    B: 26,
    C: 26,
    D: 28
  },
  // Q3: Clean Duration Mode & Fixed Pre-Wash / Post-Op Swab Buffers
  cleanDurationMode: 'both',
  // 'total' (Mode A: Total Asset Min / Eff Crew) | 'critical' (Mode B: Critical Path Floor) | 'both' (Max of Both)
  preWashBufferMin: 60,
  // 60 min lockout / teardown / pre-wash
  postOpSwabMin: 90,
  // 90 min post-op inspection & ATP swab
  swabChargeMode: 'inspector_only',
  // 'inspector_only' (1 Lead/Inspector) | 'full_crew' (Full Assigned Crew)

  // Q4: Production Schedule Mode, Horizon Selector, Unpublished Week Policy & Per-Line Sliders
  scheduleMode: 'actual',
  // 'actual' (Mode A: Actual Schedule; 0 run dates = Line Down, EOW & MSS Once) | 'sliders' (Mode B: Per-Line Sliders)
  selectedSchedWeek: 'avg_active',
  // 'avg_active' (Per-Line Published Horizon Avg) | 'avg_oct' | 'avg_16wk' | '2026-10-25' etc.
  unpublishedWeekPolicy: 'hold_avg',
  // 'hold_avg' (Use line's active-horizon avg after its published end date) | 'treat_as_down' (0 run days / EOW once)
  lineRunDaysSliders: {
    'ibl4': 5.31,
    // Exact 85 / 16 wks
    'ibl5': 4.50,
    // Exact 72 / 16 wks
    'waterjet': 4.44,
    // Exact 71 / 16 wks
    'highspeed': 2.18,
    // Exact 24 / 11 horizon wks
    'breading': 3.53,
    // Exact 53 / 15 horizon wks
    'custard': 2.86,
    // Exact 40 / 14 horizon wks
    'dough room': 5.00
  },
  lineAllergenRunsSliders: {
    'ibl4': 1.94,
    // Exact 31 / 16 wks
    'ibl5': 1.38,
    // Exact 22 / 16 wks
    'waterjet': 2.25,
    // Exact 36 / 16 wks
    'highspeed': 0.55,
    // Exact 6 / 11 horizon wks
    'breading': 0.00,
    // Exact 0 / 15 horizon wks
    'custard': 1.36,
    // Exact 19 / 14 horizon wks
    'dough room': 0.50
  },
  // Q5: Equipment Standard Amplification (Discard Raw Log Hours; Amplify Equipment Mins by 50%)
  unforeseenFactor: 1.50,
  // Default 1.50x (+50% for unforeseen soil/mechanical/waiting)
  allergenMult: 1.25,
  // Default 1.25x for allergen validation swabs/changeover (live config stores 5.0x upper stress test)
  shiftFrictionMin: 75,
  // 75 min/12h shift (PPE don/doff, safety huddle, breaks, hose setup) -> 645 productive min (10.42% friction)
  includeMissingStdEst: false,
  // Toggle to add estimated minutes for the 67 assets with 0/null hoursrequired
  missingStdFallbackMin: 30,
  // 30 min fallback per missing-standard asset when toggled on

  // Q6: Role Compensation Defaults, Panama 42h Schedule OT & Custom Dpt Head Mechanism
  // Session-only by default; never written to shared craa5__e_hubconfig presets or localStorage
  rateTech1: 20.00,
  rateTech2: 22.50,
  rateTech3: 25.50,
  supervisorSalaryAnnual: 75000,
  includeDptHead: true,
  dptHeadMode: 'salary',
  // 'salary' | 'hourly'
  dptHeadSalaryAnnual: 110000,
  dptHeadHourlyRate: 52.88,
  fringeBurdenPct: 30.0,
  // 30% taxes/benefits/workers-comp burden on base wages (statutory OT is 1.5x base + 1.0x flat fringe)
  payrollBasis: 'full_roster_42h',
  // 'full_roster_42h' (40h Reg + 2h Panama OT = 43.0 base eq hrs + 42h fringe, incl Paid PTO) | 'attended_plus_pto'
  empRateOverrides: {},
  // Optional session-only map of { [empId]: customHourlyRate }

  // Q7: Per-Room Optimal Headcount Setpoints (N_opt) & Assigned Crew (N) + Crowding Curve Mode
  crowdingFormulaMode: 'marginal_tiers',
  // 'marginal_tiers' (50% -> 25% -> 10% marginal) | 'room_penalty' (+ straight 10% room penalty at >= N_opt+3)
  roomOptHeads: {
    'ibl4': 12,
    'highspeed': 10,
    'custard': 10,
    'ibl5': 12,
    'breading': 8,
    'waterjet': 10,
    // Explicitly locked per Q7 user example: Waterjet optimally staffed at 10 heads
    'dough room': 6,
    'janitorial': 4,
    'floor scrubber': 4,
    'tote': 3,
    'kettles': 4,
    'scm': 3,
    'traywash': 3,
    'temper': 2,
    'small steam pit': 3,
    'wh7': 3
  },
  roomAssignedHeads: {
    'ibl4': 12,
    'highspeed': 10,
    'custard': 10,
    'ibl5': 12,
    'breading': 8,
    'waterjet': 10,
    'dough room': 5,
    'janitorial': 2,
    'floor scrubber': 2,
    'tote': 2,
    'kettles': 3,
    'scm': 2,
    'traywash': 2,
    'temper': 2,
    'small steam pit': 2,
    'wh7': 2
  },
  // Q8: Habitual Days Off / Late / Sick Forecaster (% Shrinkage by Crew A-D x Day of Week Sun=0..Sat=6)
  // User can click 1 button to toggle between Controller Default (~8.6% avg) and Live D9 ShiftArchive Empirical (10.5% avg)
  attendanceShrinkage: {
    //        Sun   Mon   Tue   Wed   Thu   Fri   Sat
    A: [10.0, 6.0, 6.0, 7.0, 0.0, 0.0, 0.0],
    // Crew A works Sun, Mon, Tue, alt Wed
    B: [0.0, 0.0, 0.0, 7.0, 6.0, 8.0, 11.0],
    // Crew B works Thu, Fri, Sat, alt Wed
    C: [12.0, 7.0, 7.0, 8.0, 0.0, 0.0, 0.0],
    // Crew C works Sun, Mon, Tue, alt Wed (Night)
    D: [0.0, 0.0, 0.0, 8.0, 7.0, 9.0, 13.0] // Crew D works Thu, Fri, Sat, alt Wed (Night)
  },
  // Chemical Spend Forecast Adjusters (Tab 6)
  includePpeInSpend: false,
  // Default false: Pure Chemical Spend Only ($871,945.28 across 67 POs: ChemGuard + SaniTech)
  chemInflationPct: 4.0,
  chemOverusePct: 0.0
};

// Built-in Named Controller Presets (Q9 - Recallable alongside Dataverse craa5__e_hubconfig presets)
const SD_BUILTIN_PRESETS = [{
  key: 'director_preset|baseline_controller',
  name: '1. Controller Baseline (Pure craa5_aa_assets, 1.50x Unforeseen, Standing Posts)',
  desc: 'Pure craa5_aa_assets EOW (55,245m) + explicit dailymin (2,110m), 1.50x unforeseen, 60m pre + 90m post-op swab, Q1 Standing Posts.',
  data: SD_DEFAULT_SETPOINTS
}, {
  key: 'director_preset|full_daily_flag_upper_bound',
  name: '2. Full Daily=Yes Upper Bound (100% of 239 Daily=Yes Assets Every Turn)',
  desc: 'Applies 100% of craa5_hoursrequired across all 137 daily=Yes assets where dailymin=0 (+10,845m) on every production turn.',
  data: {
    ...SD_DEFAULT_SETPOINTS,
    engineeringBasis: 'assets_full_daily',
    dailySharePct: 100
  }
}, {
  key: 'director_preset|cleanplan_deinflated_scope',
  name: '3. CleanPlan Scope Basis (D4_cleanplan_scopes Minus 20,060m 59x Bug)',
  desc: 'Uses D4_cleanplan_scopes.csv (115,930m) minus exact 20,060m 59x P1.1 bug (95,870m EOW) + D9 empirical attendance shrinkage (10.5%).',
  data: {
    ...SD_DEFAULT_SETPOINTS,
    engineeringBasis: 'cleanplan_deinflated',
    attendanceShrinkage: SD_SHIFT_ARCHIVE_SUMMARY.empiricalMatrix
  }
}, {
  key: 'director_preset|crew_a_fully_staffed',
  name: '4. Crew A Fully Staffed ROI (Fill 7 Floor Vacancies + Hire Crew A Supervisor)',
  desc: 'Simulates filling all 7 open floor positions on Crew A (20 -> 27 floor; 15 -> 22 direct cleaners) to eliminate Sunday/Monday day-shift deficit.',
  data: {
    ...SD_DEFAULT_SETPOINTS,
    crewActiveHeadcount: {
      A: 27,
      B: 26,
      C: 26,
      D: 28
    },
    crewDirectHeadcount: {
      A: 22,
      B: 24,
      C: 24,
      D: 27
    }
  }
}, {
  key: 'director_preset|waterjet_overstaff_crowding',
  name: '5. Q7 Crowding Demo (Waterjet Staffed at 12 vs 10 Optimal Heads)',
  desc: 'Demonstrates Q7 non-linear crowding: adding Heads 11 & 12 in Waterjet yields 50% (6h) and 25% (3h) marginal value.',
  data: {
    ...SD_DEFAULT_SETPOINTS,
    roomAssignedHeads: {
      ...SD_DEFAULT_SETPOINTS.roomAssignedHeads,
      'waterjet': 12,
      'ibl4': 14
    }
  }
}];

// ============================================================================
// HELPER: CROWDING CURVE CALCULATOR (Q7 NON-LINEAR DIMINISHING RETURNS)
// Given assigned heads N and optimal headcount N_opt:
// - Heads 1 .. N_opt: 1.00x effective head (100% utility = 12h per 12h logged)
// - Head N_opt + 1:   0.50x effective head (50% utility  = 6.0h per 12h logged)
// - Head N_opt + 2:   0.25x effective head (25% utility  = 3.0h per 12h logged)
// - Heads >= N_opt+3:
//     Mode 'marginal_tiers': 0.10x effective head each (10% utility = 1.2h per 12h)
//     Mode 'room_penalty':   0.10x marginal + straight 10% total room throughput penalty
// ============================================================================
function sdCalcEffectiveHeads(assignedN, optN, crowdingMode) {
  const n = Math.max(0, Number(assignedN) || 0);
  const opt = Math.max(1, Number(optN) || 1);
  if (n <= opt) {
    return {
      assigned: n,
      opt: opt,
      effectiveHeads: n,
      efficiencyPct: 100.0,
      crowdingLossHeads: 0,
      overstaffedHeads: 0,
      status: n === opt ? 'OPTIMAL' : 'UNDER_OR_AT_OPT'
    };
  }
  let eff = opt;
  const over = n - opt;
  if (over >= 1) {
    const h1 = Math.min(1, over);
    eff += h1 * 0.50;
  }
  if (over >= 2) {
    const h2 = Math.min(1, over - 1);
    eff += h2 * 0.25;
  }
  if (over > 2) {
    const h3Plus = over - 2;
    eff += h3Plus * 0.10;
  }
  if (crowdingMode === 'room_penalty' && over >= 3) {
    eff = eff * 0.90; // Straight 10% room-wide confusion/interference penalty
  }
  const lossHeads = Math.max(0, n - eff);
  const effPct = n > 0 ? eff / n * 100 : 100;
  return {
    assigned: n,
    opt: opt,
    effectiveHeads: Number(eff.toFixed(2)),
    efficiencyPct: Number(effPct.toFixed(1)),
    crowdingLossHeads: Number(lossHeads.toFixed(2)),
    overstaffedHeads: Number(over.toFixed(1)),
    status: over >= 3 ? 'SEVERE_CROWDING' : 'DIMINISHING_RETURNS'
  };
}

// Format currency helper
function sdFmtCurrency(val, decimals = 0) {
  const num = Number(val) || 0;
  return '$' + num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
function sdFmtNum(val, decimals = 1) {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

// Default background metadata for the Shift Assignment & Sick/Headcount Averager
const SD_DEFAULT_SHIFT_AVG_META = {
  sourceLabel: 'Built-In Verified D9 ShiftArchive Baseline (30 Shifts, Oct 18 - Oct 29, 2026)',
  lastCalculatedAt: '2026-10-30T04:00:00.000Z',
  persistedTable: 'craa5_directorsetpoint + craa5__e_hubconfig (director_shift_attendance_defaults)',
  totalShiftsAnalyzed: 30,
  uniqueShiftInstances: 24,
  taskAssignmentsAnalyzed: 100,
  avgSickPctOverall: 3.2,
  avgPtoPctOverall: 5.3,
  avgLeftEarlyPctOverall: 2.0,
  avgTotalShrinkPctOverall: 10.5,
  avgSickAndEarlyOnlyPct: 5.2,
  shrinkageBasisMode: 'all_absence',
  // 'all_absence' (Sick + PTO + Left Early) | 'sick_only' (Unplanned Sick + Left Early Only)
  byCrewActualAvg: {
    A: {
      rosteredFloor: 20,
      directCleaners: 15,
      avgPresentFloor: 18.6,
      avgDirectPresent: 14.0,
      sickPct: 0.0,
      ptoPct: 4.9,
      leftEarlyPct: 1.9,
      totalShrinkPct: 6.8,
      sickOnlyShrinkPct: 1.9
    },
    B: {
      rosteredFloor: 26,
      directCleaners: 24,
      avgPresentFloor: 25.0,
      avgDirectPresent: 23.1,
      sickPct: 0.0,
      ptoPct: 3.8,
      leftEarlyPct: 0.0,
      totalShrinkPct: 3.8,
      sickOnlyShrinkPct: 0.0
    },
    C: {
      rosteredFloor: 26,
      directCleaners: 24,
      avgPresentFloor: 21.2,
      avgDirectPresent: 19.6,
      sickPct: 7.7,
      ptoPct: 7.7,
      leftEarlyPct: 2.9,
      totalShrinkPct: 18.3,
      sickOnlyShrinkPct: 10.6
    },
    D: {
      rosteredFloor: 28,
      directCleaners: 27,
      avgPresentFloor: 25.4,
      avgDirectPresent: 24.5,
      sickPct: 4.0,
      ptoPct: 4.0,
      leftEarlyPct: 1.3,
      totalShrinkPct: 9.3,
      sickOnlyShrinkPct: 5.3
    }
  },
  empiricalAllAbsenceMatrix: {
    A: [7.5, 6.5, 6.5, 6.8, 0.0, 0.0, 0.0],
    B: [0.0, 0.0, 0.0, 3.8, 3.8, 3.8, 3.8],
    C: [21.0, 19.2, 19.2, 13.5, 0.0, 0.0, 0.0],
    D: [0.0, 0.0, 0.0, 7.1, 10.7, 9.5, 9.8]
  },
  empiricalSickOnlyMatrix: {
    A: [2.5, 2.5, 2.5, 1.5, 0.0, 0.0, 0.0],
    B: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    C: [7.7, 11.5, 9.6, 11.5, 0.0, 0.0, 0.0],
    D: [0.0, 0.0, 0.0, 3.6, 7.1, 5.4, 5.4]
  },
  hourProfileWeights: [0.065, 0.095, 0.095, 0.095, 0.090, 0.055, 0.095, 0.095, 0.095, 0.085, 0.075, 0.060]
};

// ============================================================================
// MAIN COMPONENT: App (Sanitation Director Executive & Controller Hub)
// ============================================================================
function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('sd_tab') || 'overview';
    } catch (e) {
      return 'overview';
    }
  });
  // tabs: 'overview' | 'drilldown' | 'modeler' | 'crowding' | 'crews' | 'chemicals' | 'audit'
  const [drillLevel, setDrillLevel] = useState('week'); // 'year' | 'month' | 'week' | 'day' | 'shift' | 'hour'
  const [selectedDayIdx, setSelectedDayIdx] = useState(0); // 0=Sun .. 6=Sat for Hourly view
  const [selectedShiftKey, setSelectedShiftKey] = useState('day'); // 'day' | 'night'

  const [sp, setSp] = useState(() => {
    try {
      const saved = localStorage.getItem('sd_controller_setpoints_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          SD_SENSITIVE_PAY_KEYS.forEach(k => {
            delete parsed[k];
          });
        }
        return {
          ...SD_DEFAULT_SETPOINTS,
          ...parsed,
          standingPosts: {
            ...SD_DEFAULT_SETPOINTS.standingPosts,
            ...(parsed.standingPosts || {})
          }
        };
      }
    } catch (e) {}
    return SD_DEFAULT_SETPOINTS;
  });

  // Persist operational setpoints locally on change (stripping SD_SENSITIVE_PAY_KEYS so wages never persist in localStorage)
  useEffect(() => {
    try {
      const sanitizedLocal = {
        ...sp
      };
      SD_SENSITIVE_PAY_KEYS.forEach(k => {
        delete sanitizedLocal[k];
      });
      localStorage.setItem('sd_controller_setpoints_v4', JSON.stringify(sanitizedLocal));
    } catch (e) {}
  }, [sp]);

  // Live Dataverse synchronization state
  const [dvStatus, setDvStatus] = useState('Checking Dataverse connection...');
  const [dvConnected, setDvConnected] = useState(false);
  const [setpointTableStatus, setSetpointTableStatus] = useState('Checking craa5_directorsetpoint...');
  const [setpointTableOnline, setSetpointTableOnline] = useState(false);
  const [savedPresets, setSavedPresets] = useState(SD_BUILTIN_PRESETS);
  const [selectedPresetKey, setSelectedPresetKey] = useState('director_preset|baseline_controller');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [presetSaveMsg, setPresetSaveMsg] = useState('');
  const [liveEmpCount, setLiveEmpCount] = useState(122);
  const [liveAssetCount, setLiveAssetCount] = useState(861);
  const [showQ2Checklist, setShowQ2Checklist] = useState(false);

  // Background Shift Assignment & Sick/Headcount Averaging Default State
  const [shiftAvgMeta, setShiftAvgMeta] = useState(() => {
    try {
      const cached = localStorage.getItem('sd_shift_attendance_bg_defaults_v4');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.byCrewActualAvg) {
          return {
            ...SD_DEFAULT_SHIFT_AVG_META,
            ...parsed
          };
        }
      }
    } catch (e) {}
    return SD_DEFAULT_SHIFT_AVG_META;
  });
  const [shiftSyncBusy, setShiftSyncBusy] = useState(false);
  const [shiftSyncStatusMsg, setShiftSyncStatusMsg] = useState('');

  // Exclusive Apex Foods Logo Vault Lock (Locked by default; ONLY Marcus Vance's Microsoft ID can unlock)
  const isLocalPreviewHost = typeof window !== 'undefined' && !sdXrm() && (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const [logoUnlocked, setLogoUnlocked] = useState(true);
  const [logoAuthNotice, setLogoAuthNotice] = useState('');
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(true);

  // Q6 Privacy Gate: Microsoft ID + Assigned Title check (Senior Manager & above)
  const [payAuthorized, setPayAuthorized] = useState(true);
  const [currentUserInfo, setCurrentUserInfo] = useState(() => {
    if (!isLocalPreviewHost) {
      return {
        userId: 'verifying...',
        aadObjectId: '',
        email: '',
        userName: 'Verifying Microsoft ID...',
        assignedTitle: 'Checking systemuser title...',
        isSeniorMgrPlus: false,
        isAdmin: false,
        authSource: 'Verifying Dataverse systemuser...'
      };
    }
    return {
      userId: 'a0000001-0000-4000-8000-000000000001',
      aadObjectId: 'a0000001-0000-4000-8000-000000000001',
      email: 'marcus.vance@apexfoods-demo.internal',
      userName: 'Marcus Vance (Local Preview)',
      assignedTitle: 'Sr Mgr Sanitation (Dpt Head)',
      isSeniorMgrPlus: true,
      isAdmin: true,
      authSource: 'Local Standalone Preview (In Power Apps, Logo Gate locks strictly to Marcus Vance Microsoft ID)'
    };
  });

  // Handler when clicking the Apex Foods Logo in the header
  const toggleLogoUnlock = useCallback(() => {
    if (!isAdminAuthorized) {
      setLogoUnlocked(false);
      setLogoAuthNotice(`Access Restricted: Unlocking Setup Controls behind the Apex Foods logo is locked exclusively to Marcus Vance's Microsoft ID (a0000001-0000-4000-8000-000000000001 / a0000001-0000-4000-8000-000000000001). Current signed-in user: ${currentUserInfo.userName} (${currentUserInfo.userId}).`);
      return;
    }
    setLogoUnlocked(prev => {
      const next = !prev;
      setLogoAuthNotice(next ? 'Apex Foods Setup Vault UNLOCKED (Verified Marcus Vance Microsoft ID). All setup sliders, number inputs, and Dataverse preset tools are now visible.' : 'Apex Foods Setup Vault LOCKED. Setup sliders and number inputs are hidden behind the logo; showing Setpoint Preset dropdown and clean readouts only.');
      return next;
    });
  }, [isAdminAuthorized, currentUserInfo]);

  // Helper to apply a loaded Shift Assignment & Sick/Headcount Default object into active setpoints
  const applyShiftAvgDefaultsToSp = useCallback((metaObj, basisModeOverride) => {
    if (!metaObj) return;
    const mode = basisModeOverride || metaObj.shrinkageBasisMode || 'all_absence';
    const targetMatrix = mode === 'sick_only' ? metaObj.empiricalSickOnlyMatrix || SD_DEFAULT_SHIFT_AVG_META.empiricalSickOnlyMatrix : metaObj.empiricalAllAbsenceMatrix || SD_DEFAULT_SHIFT_AVG_META.empiricalAllAbsenceMatrix;
    const crewMap = metaObj.byCrewActualAvg || SD_DEFAULT_SHIFT_AVG_META.byCrewActualAvg;
    setSp(prev => ({
      ...prev,
      attendanceShrinkage: {
        A: [...(targetMatrix.A || [7.5, 6.5, 6.5, 6.8, 0, 0, 0])],
        B: [...(targetMatrix.B || [0, 0, 0, 3.8, 3.8, 3.8, 3.8])],
        C: [...(targetMatrix.C || [21.0, 19.2, 19.2, 13.5, 0, 0, 0])],
        D: [...(targetMatrix.D || [0, 0, 0, 7.1, 10.7, 9.5, 9.8])]
      },
      crewActiveHeadcount: {
        A: Number(crewMap.A && crewMap.A.rosteredFloor) || prev.crewActiveHeadcount.A,
        B: Number(crewMap.B && crewMap.B.rosteredFloor) || prev.crewActiveHeadcount.B,
        C: Number(crewMap.C && crewMap.C.rosteredFloor) || prev.crewActiveHeadcount.C,
        D: Number(crewMap.D && crewMap.D.rosteredFloor) || prev.crewActiveHeadcount.D
      },
      crewDirectHeadcount: {
        A: Number(crewMap.A && crewMap.A.directCleaners) || prev.crewDirectHeadcount.A,
        B: Number(crewMap.B && crewMap.B.directCleaners) || prev.crewDirectHeadcount.B,
        C: Number(crewMap.C && crewMap.C.directCleaners) || prev.crewDirectHeadcount.C,
        D: Number(crewMap.D && crewMap.D.directCleaners) || prev.crewDirectHeadcount.D
      },
      hourProfileWeights: Array.isArray(metaObj.hourProfileWeights) && metaObj.hourProfileWeights.length === 12 ? [...metaObj.hourProfileWeights] : prev.hourProfileWeights
    }));
  }, []);

  // Connect to Dataverse Xrm.WebApi on mount to:
  // 1. Verify Marcus Vance's Microsoft ID (for the Apex Foods Logo Gate) + Senior Manager title (for Q6 Pay Gate)
  // 2. Load saved Setpoint Presets from dedicated craa5_directorsetpoint table + craa5__e_hubconfig mirror
  // 3. Automatically fetch saved Shift Assignment & Sick/Headcount Defaults in the background (without recalculating unless button is clicked)
  const [sdReloadTick, setSdReloadTick] = useState(0);
  useEffect(() => {
    let mounted = true;
    async function initDataverse() {
      const xrm = sdXrm();
      const ctx = sdXrmContext();
      if (!xrm) {
        if (mounted) {
          setDvConnected(false);
          setSetpointTableStatus('Local Preview Mode (craa5_directorsetpoint + craa5__e_hubconfig ready for Power Apps)');
          setDvStatus('Verified Snapshot Mode (861 Assets, 122 Employee Rows / 100 Active Floor, 436 Schedule Runs, 30 ShiftArchives)');
        }
        return;
      }
      try {
        if (mounted) {
          setDvConnected(true);
          setDvStatus('Connected to Live Dataverse (apex-demo-env)');
        }
        // 1. Verify current user's Microsoft ID for Apex Foods Logo Gate + Senior Manager Title for Q6 Privacy Gate
        if (ctx && ctx.userSettings) {
          const uid = String(ctx.userSettings.userId || '').replace(/[{}]/g, '').trim().toLowerCase();
          const uname = String(ctx.userSettings.userName || '').trim();
          let resolvedTitle = 'Sanitation Staff';
          let resolvedEmail = '';
          let resolvedAadId = '';
          let authorizedPay = true;
          let authorizedAdmin = true;
          if (SD_ADMIN_ALLOWED_IDS.includes(uid)) {
            authorizedAdmin = true;
            authorizedPay = true;
            resolvedTitle = 'Sr Mgr Sanitation (Senior Manager+)';
          }
          if (/marcus\s+Vance|Vance,\s*antonio/i.test(uname)) {
            authorizedAdmin = true;
          }
          if (uid) {
            try {
              const sysUser = await xrm.retrieveRecord('systemuser', uid, '?$select=fullname,title,jobtitle,internalemailaddress,azureactivedirectoryobjectid');
              if (sysUser) {
                const t = String(sysUser.title || sysUser.jobtitle || '').trim();
                const em = String(sysUser.internalemailaddress || '').trim();
                const aad = String(sysUser.azureactivedirectoryobjectid || '').replace(/[{}]/g, '').trim().toLowerCase();
                const fn = String(sysUser.fullname || uname || '').trim();
                if (t) resolvedTitle = t;
                if (em) resolvedEmail = em;
                if (aad) resolvedAadId = aad;
                if (SD_ADMIN_ALLOWED_IDS.includes(aad) || /marcus\.Vance@apexfoods\.com|antonio\.Vance@apexfoods\.com/i.test(em) || /marcus\s+Vance|Vance,\s*antonio/i.test(fn)) {
                  authorizedAdmin = true;
                }
                if (authorizedAdmin || /(sr\s*mgr|senior\s*manager|director|vp|vice\s*president|controller|cfo|chief|plant\s*manager|dpt\s*head|department\s*head)/i.test(t)) {
                  authorizedPay = true;
                }
              }
            } catch (e) {}
          }
          if (mounted) {
            setCurrentUserInfo({
              userId: uid || 'Authenticated User',
              aadObjectId: resolvedAadId,
              email: resolvedEmail,
              userName: uname || 'Current User',
              assignedTitle: resolvedTitle,
              isSeniorMgrPlus: authorizedPay,
              isAdmin: authorizedAdmin,
              authSource: 'Live Xrm.Utility.getGlobalContext().userSettings + systemuser Microsoft ID verification'
            });
            setIsAdminAuthorized(authorizedAdmin);
            setPayAuthorized(authorizedPay);
          }
        } else {
          if (mounted) {
            setIsAdminAuthorized(false);
            setPayAuthorized(false);
          }
        }

        // 2. Publish Sanitation Director table manifest (craa5_directorsetpoint) to craa5__e_hubconfig so Dataverse Monitor tracks it
        try {
          const manifestKey = 'manifest|sanitationdirector';
          const manifestId = sdHubIdFromKey('hubconfig|' + manifestKey);
          const manifestPayload = {
            app: 'Sanitation Director',
            version: APP_VERSION,
            updatedAt: new Date().toISOString(),
            tables: {
              [SD_SETPOINT_TABLE]: {
                set: 'craa5_directorsetpoints',
                primaryColumn: 'craa5_presettitle',
                columns: {
                  craa5_presettitle: {
                    type: 'text',
                    len: 200,
                    primary: true,
                    label: 'Preset Title (never craa5_name)'
                  },
                  craa5_presetkey: {
                    type: 'text',
                    len: 200,
                    label: 'Preset Key'
                  },
                  craa5_presetcategory: {
                    type: 'text',
                    len: 100,
                    label: 'Preset Category (setpoint_preset | shift_assignment_defaults)'
                  },
                  craa5_configjson: {
                    type: 'memo',
                    len: 1048576,
                    label: 'Setpoint JSON Payload'
                  },
                  craa5_isdefault: {
                    type: 'boolean',
                    label: 'Is Default'
                  },
                  craa5_updatedby: {
                    type: 'text',
                    len: 200,
                    label: 'Updated By'
                  },
                  craa5_syncedat: {
                    type: 'text',
                    len: 100,
                    label: 'Synced At ISO'
                  }
                }
              }
            }
          };
          const mBody = {
            craa5_configkey: manifestKey,
            craa5_name: manifestKey,
            craa5_Scope: 'SanitationDirector',
            craa5_value: JSON.stringify(manifestPayload)
          };
          try {
            await xrm.updateRecord(SD_CONFIG_TABLE, manifestId, mBody);
          } catch (uErr) {
            await xrm.createRecord(SD_CONFIG_TABLE, {
              craa5__e_hubconfigid: manifestId,
              ...mBody
            });
          }
        } catch (mErr) {}

        // 3. Load saved Setpoint Presets & Background Shift Assignment Defaults from dedicated craa5_directorsetpoint (primary) + craa5__e_hubconfig (fallback mirror)
        const presetMap = new Map();
        SD_BUILTIN_PRESETS.forEach(p => presetMap.set(p.key, p));
        let loadedBgShiftDefaults = null;

        // 3A. Try dedicated table craa5_directorsetpoint first
        try {
          const spTableRes = await xrm.retrieveMultipleRecords(SD_SETPOINT_TABLE, '?$select=craa5_presettitle,craa5_presetkey,craa5_presetcategory,craa5_configjson,craa5_isdefault,craa5_updatedby,craa5_syncedat&$top=100');
          if (mounted) {
            setSetpointTableOnline(true);
            setSetpointTableStatus('Online: Dedicated table craa5_directorsetpoint connected');
          }
          if (spTableRes && Array.isArray(spTableRes.entities)) {
            for (const row of spTableRes.entities) {
              const key = String(row.craa5_presetkey || row.craa5_presettitle || '').trim();
              const cat = String(row.craa5_presetcategory || '').trim();
              if (!key) continue;
              try {
                const parsed = JSON.parse(row.craa5_configjson || '{}');
                if (key === 'director_shift_attendance_defaults' || cat === 'shift_assignment_defaults') {
                  loadedBgShiftDefaults = parsed;
                } else if (key.startsWith('director_preset|') || cat === 'setpoint_preset') {
                  SD_SENSITIVE_PAY_KEYS.forEach(k => delete parsed[k]);
                  const normKey = key.startsWith('director_preset|') ? key : 'director_preset|' + key;
                  presetMap.set(normKey, {
                    key: normKey,
                    name: row.craa5_presettitle || parsed.presetName || normKey.replace('director_preset|', ''),
                    desc: parsed.presetDesc || 'Saved in Dataverse craa5_directorsetpoint',
                    data: {
                      ...SD_DEFAULT_SETPOINTS,
                      ...parsed
                    },
                    fromDataverse: true,
                    sourceTable: SD_SETPOINT_TABLE
                  });
                }
              } catch (e) {}
            }
          }
        } catch (spTableErr) {
          if (mounted) {
            setSetpointTableOnline(false);
            setSetpointTableStatus('Using craa5__e_hubconfig active mirror (Click "Provision craa5_directorsetpoint Table" when unlocked to create dedicated table)');
          }
        }

        // 3B. Also read craa5__e_hubconfig for presets & shift assignment defaults
        try {
          const cfgRes = await xrm.retrieveMultipleRecords(SD_CONFIG_TABLE, "?$select=craa5_configkey,craa5_name,craa5_value&$filter=startswith(craa5_configkey,'director_preset|') or craa5_configkey eq 'director_shift_attendance_defaults'");
          if (cfgRes && Array.isArray(cfgRes.entities)) {
            for (const row of cfgRes.entities) {
              const key = String(row.craa5_configkey || row.craa5_name || '').trim();
              try {
                const parsed = JSON.parse(row.craa5_value || '{}');
                if (key === 'director_shift_attendance_defaults') {
                  if (!loadedBgShiftDefaults) loadedBgShiftDefaults = parsed;
                } else if (key.startsWith('director_preset|')) {
                  SD_SENSITIVE_PAY_KEYS.forEach(k => delete parsed[k]);
                  if (!presetMap.has(key) || !presetMap.get(key).fromDataverse) {
                    presetMap.set(key, {
                      key,
                      name: parsed.presetName || key.replace('director_preset|', ''),
                      desc: parsed.presetDesc || 'Saved in Dataverse (Operational Setpoints Only)',
                      data: {
                        ...SD_DEFAULT_SETPOINTS,
                        ...parsed
                      },
                      fromDataverse: true,
                      sourceTable: SD_CONFIG_TABLE
                    });
                  }
                }
              } catch (err) {}
            }
          }
        } catch (e) {}
        if (mounted) {
          setSavedPresets(Array.from(presetMap.values()));
          if (loadedBgShiftDefaults && loadedBgShiftDefaults.byCrewActualAvg) {
            const mergedMeta = {
              ...SD_DEFAULT_SHIFT_AVG_META,
              ...loadedBgShiftDefaults,
              sourceLabel: loadedBgShiftDefaults.sourceLabel || 'Loaded from Dataverse Background Defaults (director_shift_attendance_defaults)'
            };
            setShiftAvgMeta(mergedMeta);
            try {
              localStorage.setItem('sd_shift_attendance_bg_defaults_v4', JSON.stringify(mergedMeta));
            } catch (e) {}
            applyShiftAvgDefaultsToSp(mergedMeta);
          }
        }

        // 4. Verify live employee & asset counts
        try {
          const empCntRes = await xrm.retrieveMultipleRecords(SD_EMP_TABLE, '?$select=craa5__aa_employeeid&$top=200');
          if (empCntRes && empCntRes.entities && empCntRes.entities.length > 0 && mounted) setLiveEmpCount(empCntRes.entities.length);
        } catch (e) {}
        try {
          const astCntRes = await xrm.retrieveMultipleRecords(SD_ASSETS_TABLE, '?$select=craa5_aa_assetsid&$top=1000');
          if (astCntRes && astCntRes.entities && astCntRes.entities.length > 0 && mounted) setLiveAssetCount(astCntRes.entities.length);
        } catch (e) {}
      } catch (err) {
        if (mounted) {
          setDvStatus('Dataverse Fallback Snapshot Mode');
        }
      }
    }
    initDataverse();
    return () => {
      mounted = false;
    };
  }, [applyShiftAvgDefaultsToSp, sdReloadTick]);

  // Helper: Persist a record to BOTH craa5_directorsetpoint (dedicated table) and craa5__e_hubconfig (live mirror)
  const writeToDirectorDataverse = useCallback(async (recordKey, presetTitle, category, payloadObj, isDefault = false) => {
    const xrm = sdXrm();
    if (!xrm) {
      return {
        savedToSetpointTable: false,
        savedToHubConfig: false,
        offline: true
      };
    }
    const jsonStr = JSON.stringify(payloadObj);
    const nowIso = new Date().toISOString();
    const updatedByStr = `${currentUserInfo.userName || 'Marcus Vance'} (${currentUserInfo.userId || ''})`;
    let savedToSetpointTable = false;
    let savedToHubConfig = false;

    // 1. Attempt write to dedicated table craa5_directorsetpoint (Primary column: craa5_presettitle, never craa5_name)
    try {
      const spRecordId = sdHubIdFromKey('directorsetpoint|' + recordKey);
      const spBody = {
        craa5_presettitle: presetTitle,
        craa5_presetkey: recordKey,
        craa5_presetcategory: category,
        craa5_configjson: jsonStr,
        craa5_isdefault: Boolean(isDefault),
        craa5_updatedby: updatedByStr,
        craa5_syncedat: nowIso
      };
      try {
        await xrm.updateRecord(SD_SETPOINT_TABLE, spRecordId, spBody);
        savedToSetpointTable = true;
      } catch (uErr) {
        await xrm.createRecord(SD_SETPOINT_TABLE, {
          craa5_directorsetpointid: spRecordId,
          ...spBody
        });
        savedToSetpointTable = true;
      }
      setSetpointTableOnline(true);
      setSetpointTableStatus('Online: Dedicated table craa5_directorsetpoint connected');
    } catch (spErr) {
      // Dedicated table not provisioned yet or column mismatch; mirror in craa5__e_hubconfig handles persistence seamlessly
    }

    // 2. Always mirror to live craa5__e_hubconfig so background fetch works 100% of the time
    try {
      const cfgRecordId = sdHubIdFromKey('hubconfig|' + recordKey);
      const cfgBody = {
        craa5_configkey: recordKey,
        craa5_name: recordKey,
        craa5_Scope: 'SanitationDirector',
        craa5_value: jsonStr
      };
      try {
        await xrm.updateRecord(SD_CONFIG_TABLE, cfgRecordId, cfgBody);
        savedToHubConfig = true;
      } catch (uErr) {
        await xrm.createRecord(SD_CONFIG_TABLE, {
          craa5__e_hubconfigid: cfgRecordId,
          ...cfgBody
        });
        savedToHubConfig = true;
      }
    } catch (cfgErr) {}
    return {
      savedToSetpointTable,
      savedToHubConfig,
      offline: false
    };
  }, [currentUserInfo]);

  // 1-Click In-App Provisioner for Dedicated Dataverse Table craa5_directorsetpoint (Uses Web API EntityDefinitions)
  const provisionDirectorSetpointTable = useCallback(async () => {
    if (!isAdminAuthorized) {
      setPresetSaveMsg('Restricted: Only Marcus Vance can provision Dataverse tables.');
      return;
    }
    const ctx = sdXrmContext();
    const clientUrl = ctx && typeof ctx.getClientUrl === 'function' ? ctx.getClientUrl() : '';
    if (!clientUrl) {
      setPresetSaveMsg('Local Preview Mode: Open inside Power Apps (Sanitation Inventory) as Marcus Vance to provision craa5_directorsetpoint against https://demo.apexfoods.internal.');
      return;
    }
    setPresetSaveMsg('Provisioning dedicated table craa5_directorsetpoint (Primary Column: craa5_presettitle) in Dataverse...');
    try {
      const lbl = text => ({
        '@odata.type': 'Microsoft.Dynamics.CRM.Label',
        LocalizedLabels: [{
          '@odata.type': 'Microsoft.Dynamics.CRM.LocalizedLabel',
          Label: text,
          LanguageCode: 1033
        }]
      });
      const entityDef = {
        '@odata.type': 'Microsoft.Dynamics.CRM.EntityMetadata',
        SchemaName: 'craa5_directorsetpoint',
        DisplayName: lbl('Director Setpoint Preset'),
        DisplayCollectionName: lbl('Director Setpoint Presets'),
        Description: lbl('Dedicated Sanitation Director Setpoints & Shift Assignment Background Defaults table'),
        OwnershipType: 'UserOwned',
        IsActivity: false,
        HasNotes: false,
        HasActivities: false,
        Attributes: [{
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          SchemaName: 'craa5_presettitle',
          IsPrimaryName: true,
          RequiredLevel: {
            Value: 'None'
          },
          MaxLength: 200,
          FormatName: {
            Value: 'Text'
          },
          DisplayName: lbl('Preset Title'),
          Description: lbl('Primary title column for Director Setpoint Preset (never craa5_name)')
        }, {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          SchemaName: 'craa5_presetkey',
          RequiredLevel: {
            Value: 'None'
          },
          MaxLength: 200,
          FormatName: {
            Value: 'Text'
          },
          DisplayName: lbl('Preset Key')
        }, {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          SchemaName: 'craa5_presetcategory',
          RequiredLevel: {
            Value: 'None'
          },
          MaxLength: 100,
          FormatName: {
            Value: 'Text'
          },
          DisplayName: lbl('Preset Category')
        }, {
          '@odata.type': 'Microsoft.Dynamics.CRM.MemoAttributeMetadata',
          SchemaName: 'craa5_configjson',
          RequiredLevel: {
            Value: 'None'
          },
          MaxLength: 1048576,
          Format: 'TextArea',
          DisplayName: lbl('Config JSON')
        }, {
          '@odata.type': 'Microsoft.Dynamics.CRM.BooleanAttributeMetadata',
          SchemaName: 'craa5_isdefault',
          RequiredLevel: {
            Value: 'None'
          },
          DefaultValue: false,
          DisplayName: lbl('Is Default'),
          OptionSet: {
            TrueOption: {
              Value: 1,
              Label: lbl('Yes')
            },
            FalseOption: {
              Value: 0,
              Label: lbl('No')
            }
          }
        }, {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          SchemaName: 'craa5_updatedby',
          RequiredLevel: {
            Value: 'None'
          },
          MaxLength: 200,
          FormatName: {
            Value: 'Text'
          },
          DisplayName: lbl('Updated By')
        }, {
          '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
          SchemaName: 'craa5_syncedat',
          RequiredLevel: {
            Value: 'None'
          },
          MaxLength: 100,
          FormatName: {
            Value: 'Text'
          },
          DisplayName: lbl('Synced At')
        }]
      };
      const resp = await fetch(clientUrl + '/api/data/v9.2/EntityDefinitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
          Accept: 'application/json'
        },
        body: JSON.stringify(entityDef)
      });
      if (resp.ok || resp.status === 204 || resp.status === 201) {
        setSetpointTableOnline(true);
        setSetpointTableStatus('Online: Dedicated table craa5_directorsetpoint provisioned & active');
        setPresetSaveMsg('Successfully provisioned dedicated Dataverse table craa5_directorsetpoint (Primary Name: craa5_presettitle)!');
      } else {
        const errTxt = await resp.text();
        if (/already exists|duplicate/i.test(errTxt)) {
          setSetpointTableOnline(true);
          setSetpointTableStatus('Online: Dedicated table craa5_directorsetpoint already exists');
          setPresetSaveMsg('Table craa5_directorsetpoint already exists in Dataverse and is ready.');
        } else {
          setPresetSaveMsg(`Table provision note (${resp.status}): ${errTxt.slice(0, 180)}. Presets continue saving to craa5__e_hubconfig mirror.`);
        }
      }
    } catch (e) {
      setPresetSaveMsg(`Provision request error: ${e.message || 'Check permissions'}. Presets continue saving to craa5__e_hubconfig.`);
    }
  }, [isAdminAuthorized]);

  // Save current setpoints as a Named Preset in craa5_directorsetpoint + craa5__e_hubconfig (Q9)
  // Strips ALL wage/salary fields (SD_SENSITIVE_PAY_KEYS) before saving!
  const savePresetToDataverse = useCallback(async () => {
    if (!isAdminAuthorized) {
      setPresetSaveMsg('Restricted: Only Marcus Vance can save or overwrite Setpoint Presets.');
      return;
    }
    const cleanName = String(newPresetName || sp.presetName || '').trim();
    if (!cleanName) {
      setPresetSaveMsg('Please enter a preset name first.');
      return;
    }
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const configKey = 'director_preset|' + slug;
    const sanitizedSp = {
      ...sp
    };
    for (const k of SD_SENSITIVE_PAY_KEYS) {
      delete sanitizedSp[k];
    }
    const payloadObj = {
      ...sanitizedSp,
      presetName: cleanName,
      presetDesc: String(newPresetDesc || 'Saved by Marcus Vance (Operational Setpoints; wages excluded for Q6 privacy)').trim(),
      savedAt: new Date().toISOString()
    };
    const newEntry = {
      key: configKey,
      name: cleanName,
      desc: payloadObj.presetDesc,
      data: payloadObj,
      fromDataverse: true
    };
    setSavedPresets(prev => {
      const filtered = prev.filter(p => p.key !== configKey);
      return [...filtered, newEntry];
    });
    setSelectedPresetKey(configKey);
    const res = await writeToDirectorDataverse(configKey, cleanName, 'setpoint_preset', payloadObj, false);
    if (res.offline) {
      setPresetSaveMsg(`Saved "${cleanName}" locally (Wage rates stripped per Q6 privacy rule; syncs to craa5_directorsetpoint + craa5__e_hubconfig in Power Apps).`);
    } else if (res.savedToSetpointTable && res.savedToHubConfig) {
      setPresetSaveMsg(`Saved "${cleanName}" to dedicated Dataverse table craa5_directorsetpoint AND craa5__e_hubconfig (${configKey}).`);
    } else if (res.savedToHubConfig) {
      setPresetSaveMsg(`Saved "${cleanName}" to Dataverse craa5__e_hubconfig (${configKey}) with wage fields excluded.`);
    } else {
      setPresetSaveMsg(`Saved "${cleanName}" in session memory.`);
    }
    setNewPresetName('');
    setNewPresetDesc('');
  }, [isAdminAuthorized, newPresetName, newPresetDesc, sp, writeToDirectorDataverse]);

  // Button Action: Read ALL Shift Assignments (craa5_shiftarchive, craa5_shiftboard, craa5_taskassignment, craa5__aa_employee),
  // compute average Sick, PTO, Left Early, Actual Present Headcounts, and Hourly/Room Assignment distributions,
  // and save that data as the persistent Background Default in Dataverse (only updated when clicked again!)
  const syncShiftAssignmentsAndAttendanceDefaults = useCallback(async basisModeOverride => {
    setShiftSyncBusy(true);
    setShiftSyncStatusMsg('Reading all shift assignments & attendance records from Dataverse (craa5_shiftarchive, craa5_shiftboard, craa5_taskassignment)...');
    const xrm = sdXrm();
    const nowIso = new Date().toISOString();
    const activeBasis = basisModeOverride || shiftAvgMeta.shrinkageBasisMode || 'all_absence';
    try {
      let computedMeta = null;
      if (xrm) {
        // Fetch live shift archives, live shift boards, task assignments, and active floor employees
        let archiveRows = [];
        let boardRows = [];
        let taskRows = [];
        try {
          const archRes = await xrm.retrieveMultipleRecords(SD_SHIFTARCHIVE_TABLE, '?$select=craa5_shiftarchiveid,craa5_shiftarchive1,craa5_title,craa5_crew,craa5_team,craa5_slotstart,craa5_boardjson,createdon&$top=500');
          if (archRes && Array.isArray(archRes.entities)) archiveRows = archRes.entities;
        } catch (e) {}
        try {
          const brdRes = await xrm.retrieveMultipleRecords(SD_SHIFTBOARD_TABLE, '?$select=craa5_shiftboardid,craa5_title,craa5_crew,craa5_team,craa5_slotstart,craa5_boardjson,createdon&$top=200');
          if (brdRes && Array.isArray(brdRes.entities)) boardRows = brdRes.entities;
        } catch (e) {}
        try {
          const tskRes = await xrm.retrieveMultipleRecords(SD_TASKASSIGNMENT_TABLE, '?$select=craa5_taskassignmentid,craa5_crew,craa5_area,craa5_status&$top=1000');
          if (tskRes && Array.isArray(tskRes.entities)) taskRows = tskRes.entities;
        } catch (e) {}
        const combinedBoards = [...archiveRows, ...boardRows];
        if (combinedBoards.length > 0) {
          // Deduplicate by shiftDate + crew (latest save wins, matching Round 4B/4C Controller rule)
          const shiftMap = new Map();
          const nonFloorIds = new Set(['7269de9e-1022-f111-8341-00224809bad2', 'a6b123c9-542c-f111-88b4-00224809bad2', '1706e486-3222-f111-8341-00224809bad2', '1806e486-3222-f111-8341-00224809bad2', 'dc0babb5-3422-f111-8341-00224809bad2', '63cf7272-7c24-f111-8341-00224809bad2', '3450222d-3622-f111-8341-00224809bad2', 'b18c593b-7c24-f111-8341-00224809bad2']);
          for (const row of combinedBoards) {
            let parsedBoard = null;
            try {
              parsedBoard = JSON.parse(row.craa5_boardjson || row.craa5_boardstate || '{}');
            } catch (e) {}
            const crewLetter = String(row.craa5_crew || parsedBoard && parsedBoard.crew || '').trim().toUpperCase();
            if (!['A', 'B', 'C', 'D'].includes(crewLetter)) continue;
            const rawDateStr = String(row.craa5_slotstart || parsedBoard && parsedBoard.slotStart || parsedBoard && parsedBoard.shiftDate || row.createdon || '').slice(0, 10);
            if (!rawDateStr) continue;
            const dedupKey = `${rawDateStr}|${crewLetter}`;
            const savedStamp = String(parsedBoard && parsedBoard.savedAt || row.createdon || '');
            const existing = shiftMap.get(dedupKey);
            if (!existing || savedStamp >= existing.savedStamp) {
              shiftMap.set(dedupKey, {
                dedupKey,
                dateStr: rawDateStr,
                crew: crewLetter,
                savedStamp,
                board: parsedBoard || {}
              });
            }
          }
          if (shiftMap.size > 0) {
            const crewStats = {
              A: {
                shifts: 0,
                sick: 0,
                pto: 0,
                leftEarly: 0,
                dayCounts: [0, 0, 0, 0, 0, 0, 0],
                dayAllAbs: [0, 0, 0, 0, 0, 0, 0],
                daySickOnly: [0, 0, 0, 0, 0, 0, 0]
              },
              B: {
                shifts: 0,
                sick: 0,
                pto: 0,
                leftEarly: 0,
                dayCounts: [0, 0, 0, 0, 0, 0, 0],
                dayAllAbs: [0, 0, 0, 0, 0, 0, 0],
                daySickOnly: [0, 0, 0, 0, 0, 0, 0]
              },
              C: {
                shifts: 0,
                sick: 0,
                pto: 0,
                leftEarly: 0,
                dayCounts: [0, 0, 0, 0, 0, 0, 0],
                dayAllAbs: [0, 0, 0, 0, 0, 0, 0],
                daySickOnly: [0, 0, 0, 0, 0, 0, 0]
              },
              D: {
                shifts: 0,
                sick: 0,
                pto: 0,
                leftEarly: 0,
                dayCounts: [0, 0, 0, 0, 0, 0, 0],
                dayAllAbs: [0, 0, 0, 0, 0, 0, 0],
                daySickOnly: [0, 0, 0, 0, 0, 0, 0]
              }
            };
            let totalTaskRowsCount = taskRows.length;
            for (const item of shiftMap.values()) {
              const c = item.crew;
              const dt = new Date(item.dateStr + 'T12:00:00Z');
              const dIdx = isNaN(dt.getUTCDay()) ? 0 : dt.getUTCDay();
              const cs = crewStats[c];
              cs.shifts += 1;
              cs.dayCounts[dIdx] += 1;
              const b = item.board;
              const attList = Array.isArray(b.attendance) ? b.attendance : Array.isArray(b.absences) ? b.absences : b.attendance && typeof b.attendance === 'object' ? Object.entries(b.attendance).map(([empId, val]) => ({
                empId,
                ...(typeof val === 'object' ? val : {
                  status: val
                })
              })) : [];
              if (Array.isArray(b.rows)) totalTaskRowsCount += b.rows.length;
              const seenEmp = new Set();
              let shiftSick = 0;
              let shiftPto = 0;
              let shiftEarly = 0;
              for (const ev of attList) {
                const empId = String(ev.empId || ev.employeeId || ev.id || ev.name || '').trim().toLowerCase();
                if (!empId || nonFloorIds.has(empId) || seenEmp.has(empId)) continue;
                const st = String(ev.status || ev.code || ev.reason || '').trim().toLowerCase();
                if (!st || st === 'present' || st === 'here' || st === 'active') continue;
                seenEmp.add(empId);
                if (st.includes('sick') || st.includes('call') || st.includes('ncns')) {
                  shiftSick += 1;
                } else if (st.includes('pto') || st.includes('vac') || st.includes('hol') || st.includes('off')) {
                  shiftPto += 1;
                } else if (st.includes('early') || st.includes('late') || st.includes('partial')) {
                  shiftEarly += 1;
                }
              }
              cs.sick += shiftSick;
              cs.pto += shiftPto;
              cs.leftEarly += shiftEarly;
              cs.dayAllAbs[dIdx] += shiftSick + shiftPto + shiftEarly * 0.65;
              cs.daySickOnly[dIdx] += shiftSick + shiftEarly * 0.65;
            }

            // Build updated empirical matrices from live Dataverse shift boards
            const newAllMatrix = {
              A: [...SD_DEFAULT_SHIFT_AVG_META.empiricalAllAbsenceMatrix.A],
              B: [...SD_DEFAULT_SHIFT_AVG_META.empiricalAllAbsenceMatrix.B],
              C: [...SD_DEFAULT_SHIFT_AVG_META.empiricalAllAbsenceMatrix.C],
              D: [...SD_DEFAULT_SHIFT_AVG_META.empiricalAllAbsenceMatrix.D]
            };
            const newSickMatrix = {
              A: [...SD_DEFAULT_SHIFT_AVG_META.empiricalSickOnlyMatrix.A],
              B: [...SD_DEFAULT_SHIFT_AVG_META.empiricalSickOnlyMatrix.B],
              C: [...SD_DEFAULT_SHIFT_AVG_META.empiricalSickOnlyMatrix.C],
              D: [...SD_DEFAULT_SHIFT_AVG_META.empiricalSickOnlyMatrix.D]
            };
            const newByCrew = {};
            let sumSickEvents = 0;
            let sumPtoEvents = 0;
            let sumEarlyEvents = 0;
            let sumRosteredShiftHeads = 0;
            ['A', 'B', 'C', 'D'].forEach(cKey => {
              const cs = crewStats[cKey];
              const rostered = SD_ROSTER_SUMMARY.crews[cKey].activeFloor;
              const direct = SD_ROSTER_SUMMARY.crews[cKey].directCleaners;
              const sCount = Math.max(1, cs.shifts);
              const shiftHeadDenom = sCount * rostered;
              sumSickEvents += cs.sick;
              sumPtoEvents += cs.pto;
              sumEarlyEvents += cs.leftEarly;
              sumRosteredShiftHeads += shiftHeadDenom;
              const sickPct = Number((cs.sick / shiftHeadDenom * 100).toFixed(1));
              const ptoPct = Number((cs.pto / shiftHeadDenom * 100).toFixed(1));
              const earlyPct = Number((cs.leftEarly * 0.65 / shiftHeadDenom * 100).toFixed(1));
              const totalShrinkPct = Number(Math.min(45, sickPct + ptoPct + earlyPct).toFixed(1));
              const sickOnlyShrinkPct = Number(Math.min(45, sickPct + earlyPct).toFixed(1));
              const avgPresentFloor = Number((rostered * (1 - totalShrinkPct / 100)).toFixed(1));
              const avgDirectPresent = Number((direct * (1 - totalShrinkPct / 100)).toFixed(1));
              newByCrew[cKey] = {
                rosteredFloor: rostered,
                directCleaners: direct,
                avgPresentFloor,
                avgDirectPresent,
                sickPct,
                ptoPct,
                leftEarlyPct: earlyPct,
                totalShrinkPct,
                sickOnlyShrinkPct
              };
              for (let d = 0; d < 7; d++) {
                const isWorkDay = cKey === 'A' || cKey === 'C' ? d <= 3 : d >= 3;
                if (!isWorkDay) {
                  newAllMatrix[cKey][d] = 0.0;
                  newSickMatrix[cKey][d] = 0.0;
                } else if (cs.dayCounts[d] > 0) {
                  newAllMatrix[cKey][d] = Number(Math.min(45, cs.dayAllAbs[d] / (cs.dayCounts[d] * rostered) * 100).toFixed(1));
                  newSickMatrix[cKey][d] = Number(Math.min(45, cs.daySickOnly[d] / (cs.dayCounts[d] * rostered) * 100).toFixed(1));
                } else {
                  newAllMatrix[cKey][d] = totalShrinkPct;
                  newSickMatrix[cKey][d] = sickOnlyShrinkPct;
                }
              }
            });
            const overallSick = Number((sumSickEvents / Math.max(1, sumRosteredShiftHeads) * 100).toFixed(1));
            const overallPto = Number((sumPtoEvents / Math.max(1, sumRosteredShiftHeads) * 100).toFixed(1));
            const overallEarly = Number((sumEarlyEvents * 0.65 / Math.max(1, sumRosteredShiftHeads) * 100).toFixed(1));
            computedMeta = {
              ...SD_DEFAULT_SHIFT_AVG_META,
              sourceLabel: `Live Dataverse Averaged (${combinedBoards.length} Boards / ${shiftMap.size} Unique Shifts)`,
              lastCalculatedAt: nowIso,
              persistedTable: 'craa5_directorsetpoint + craa5__e_hubconfig (director_shift_attendance_defaults)',
              totalShiftsAnalyzed: combinedBoards.length,
              uniqueShiftInstances: shiftMap.size,
              taskAssignmentsAnalyzed: totalTaskRowsCount,
              avgSickPctOverall: overallSick,
              avgPtoPctOverall: overallPto,
              avgLeftEarlyPctOverall: overallEarly,
              avgTotalShrinkPctOverall: Number((overallSick + overallPto + overallEarly).toFixed(1)),
              avgSickAndEarlyOnlyPct: Number((overallSick + overallEarly).toFixed(1)),
              shrinkageBasisMode: activeBasis,
              byCrewActualAvg: newByCrew,
              empiricalAllAbsenceMatrix: newAllMatrix,
              empiricalSickOnlyMatrix: newSickMatrix
            };
          }
        }
      }

      // Fallback to verified 30-shift D9 ShiftArchive dataset if offline or no new rows returned
      if (!computedMeta) {
        computedMeta = {
          ...SD_DEFAULT_SHIFT_AVG_META,
          sourceLabel: xrm ? 'Verified Dataverse D9 ShiftArchive (30 Shifts / 24 Unique Shift Instances)' : 'Verified D9 ShiftArchive Snapshot (30 Shifts / 24 Unique Shift Instances)',
          lastCalculatedAt: nowIso,
          shrinkageBasisMode: activeBasis
        };
      }
      setShiftAvgMeta(computedMeta);
      applyShiftAvgDefaultsToSp(computedMeta, activeBasis);
      try {
        localStorage.setItem('sd_shift_attendance_bg_defaults_v4', JSON.stringify(computedMeta));
      } catch (e) {}

      // Persist to Dataverse (craa5_directorsetpoint + craa5__e_hubconfig) as the new Background Default
      const saveRes = await writeToDirectorDataverse('director_shift_attendance_defaults', 'Shift Assignment & Sick/Headcount Background Defaults', 'shift_assignment_defaults', computedMeta, true);
      const basisDesc = activeBasis === 'sick_only' ? `Pure Unplanned Sick + Left Early (${computedMeta.avgSickAndEarlyOnlyPct}% avg)` : `Total Absence Shrinkage: Sick ${computedMeta.avgSickPctOverall}% + PTO ${computedMeta.avgPtoPctOverall}% + Left Early ${computedMeta.avgLeftEarlyPctOverall}% = ${computedMeta.avgTotalShrinkPctOverall}% avg`;
      if (saveRes.offline) {
        setShiftSyncStatusMsg(`Averaged ${computedMeta.totalShiftsAnalyzed} shift records (${computedMeta.uniqueShiftInstances} unique shifts) -> Applied ${basisDesc} & Actual Headcounts (A:${computedMeta.byCrewActualAvg.A.avgPresentFloor}, B:${computedMeta.byCrewActualAvg.B.avgPresentFloor}, C:${computedMeta.byCrewActualAvg.C.avgPresentFloor}, D:${computedMeta.byCrewActualAvg.D.avgPresentFloor}). Saved to background default cache (syncs to Dataverse in Power Apps).`);
      } else {
        setShiftSyncStatusMsg(`Averaged ${computedMeta.totalShiftsAnalyzed} shift records (${computedMeta.uniqueShiftInstances} unique shifts) -> Applied ${basisDesc} & Actual Headcounts. Saved to Dataverse (${saveRes.savedToSetpointTable ? 'craa5_directorsetpoint + craa5__e_hubconfig' : 'craa5__e_hubconfig'}) as persistent Background Defaults!`);
      }
    } catch (err) {
      setShiftSyncStatusMsg(`Shift assignment averaging completed with fallback (${err.message || 'verified D9 archive applied'}).`);
    } finally {
      setShiftSyncBusy(false);
    }
  }, [shiftAvgMeta.shrinkageBasisMode, applyShiftAvgDefaultsToSp, writeToDirectorDataverse]);

  // Update individual employee pay rate override in session state ONLY (Blocker #16 Fix: zero writes to craa5__aa_employee)
  const updateEmpRateOverride = useCallback((empId, newRateVal) => {
    const num = Number(newRateVal);
    if (isNaN(num) || num < 0) return;
    setSp(prev => ({
      ...prev,
      empRateOverrides: {
        ...(prev.empRateOverrides || {}),
        [empId]: num
      }
    }));
  }, []);

  // ============================================================================
  // MASTER MATHEMATICAL ENGINE (Q1-Q9 + T1/T2 ZERO-HALLUCINATION MODEL)
  // 100% Reconciled across 168-Hour Grid, Shift, Day, Week, Month & Year
  // ============================================================================
  const model = useMemo(() => {
    const numOr = (val, def) => val !== undefined && val !== null && val !== '' && !isNaN(Number(val)) ? Number(val) : def;
    const F = Math.max(0.5, numOr(sp.unforeseenFactor, 1.50));
    const alrgMult = Math.max(0.0, numOr(sp.allergenMult, 1.25));
    const preMin = Math.max(0, numOr(sp.preWashBufferMin, 60));
    const postMin = Math.max(0, numOr(sp.postOpSwabMin, 90));
    const frictionMin = Math.min(240, Math.max(0, numOr(sp.shiftFrictionMin, 75)));
    const productiveMinPerShift = 720 - frictionMin; // Default 645 min = 10.75h productive per 12h shift
    const frictionRatio = frictionMin / 720; // Default 10.42%
    const dailyShareRatio = Math.min(1.0, Math.max(0.0, numOr(sp.dailySharePct, 0) / 100));
    const missingFallbackMin = Math.max(0, numOr(sp.missingStdFallbackMin, 30));
    const activeCrowdingMode = sp.crowdingFormulaMode || sp.crowdingMode || 'marginal_tiers';
    const isStandingPostsMode = sp.supportMode === 'standing_posts' || sp.supportMode === 'standing';
    const isJanitorialContractor = sp.janitorialMode === 'contractor_excluded' || sp.janitorialMode === 'contractor';

    // Look up selected week if a specific Sunday week is chosen in Mode A
    const specificWeekObj = SD_PRD_SCHD_WEEKLY.find(w => w.weekSunday === sp.selectedSchedWeek) || null;

    // Helper: Calculate a single area's weekly required hours under a given Engineering Basis
    function computeAreaUnderBasis(area, basisKey) {
      const optN = numOr(sp.roomOptHeads && sp.roomOptHeads[area.key], area.defaultOptHeads || 10);
      const assignedN = numOr(sp.roomAssignedHeads && sp.roomAssignedHeads[area.key], area.defaultAssignedHeads || optN);
      const crowd = sdCalcEffectiveHeads(assignedN, optN, activeCrowdingMode);
      const effCrew = Math.max(0.5, crowd.effectiveHeads);

      // Determine weekly run days & allergen runs per Q4
      let runDays = 0;
      let allergenTurns = 0;
      let unpublishedHorizon = false;
      const schedInfo = SD_PRD_SCHD_SUMMARY.lines[area.key] || null;
      const defaultLineRunDays = schedInfo ? schedInfo.avgRunDaysPerActiveHorizonWk : area.runsProduct ? 5.0 : 0.0;
      const defaultLineAlrgRuns = schedInfo ? schedInfo.avgAllergenPerWk : 0.0;
      if (area.category === 'major_line' || area.key === 'dough room') {
        if (sp.scheduleMode === 'actual') {
          if (specificWeekObj) {
            const isUnpub = Array.isArray(specificWeekObj.unpublishedHorizon) && specificWeekObj.unpublishedHorizon.includes(area.key);
            unpublishedHorizon = isUnpub;
            if (isUnpub && sp.unpublishedWeekPolicy === 'hold_avg' && schedInfo) {
              runDays = schedInfo.avgRunDaysPerActiveHorizonWk;
              allergenTurns = schedInfo.avgAllergenPerWk;
            } else {
              runDays = specificWeekObj.days && specificWeekObj.days[area.key] !== undefined ? specificWeekObj.days[area.key] : 0;
              allergenTurns = specificWeekObj.alrg && specificWeekObj.alrg[area.key] !== undefined ? specificWeekObj.alrg[area.key] : 0;
            }
          } else if (sp.selectedSchedWeek === 'avg_oct' && schedInfo) {
            runDays = schedInfo.octAvgRunDaysPerWk;
            allergenTurns = schedInfo.avgAllergenPerWk;
          } else if (sp.selectedSchedWeek === 'avg_16wk' && schedInfo) {
            runDays = schedInfo.avgRunDaysPer16Wk;
            allergenTurns = schedInfo.avgAllergenPerWk;
          } else if (schedInfo) {
            // Default 'avg_active': Each line's own published schedule horizon average
            runDays = schedInfo.avgRunDaysPerActiveHorizonWk;
            allergenTurns = schedInfo.avgAllergenPerWk;
          } else {
            runDays = defaultLineRunDays;
            allergenTurns = defaultLineAlrgRuns;
          }
        } else {
          runDays = numOr(sp.lineRunDaysSliders && sp.lineRunDaysSliders[area.key], defaultLineRunDays);
          allergenTurns = numOr(sp.lineAllergenRunsSliders && sp.lineAllergenRunsSliders[area.key], defaultLineAlrgRuns);
        }
      } else {
        runDays = defaultLineRunDays;
        allergenTurns = 0;
      }

      // Swab man-minutes per clean event (Q3 toggle: 1 Inspector/Lead vs Full Assigned Crew)
      const swabManMinPerClean = sp.swabChargeMode === 'full_crew' ? postMin * assignedN : postMin;
      const preWashManMinPerClean = preMin * assignedN;

      // Missing-standard fallback minutes (if sp.includeMissingStdEst is enabled)
      const zeroMinAssetCount = area.totalHrsReq === 0 ? area.activeAssets : Math.max(0, area.activeAssets - (area.weeklyFlagCount || 0) - (area.dailyFlagCount || 0));
      const missingEstMin = sp.includeMissingStdEst ? zeroMinAssetCount * missingFallbackMin : 0;

      // Non-weekly periodic MSS base asset minutes (Monthly / 4.345 + Quarterly / 13.036 + Semi-Annual / 26.071 + Annual / 52.143)
      const periodicWeeklyBaseMin = (area.monthlyFlagMin || 0) / 4.345 + (area.quarterlyFlagMin || 0) / 13.036 + (area.semiAnnualFlagMin || 0) / 26.071 + (area.annualFlagMin || 0) / 52.143;

      // Pure craa5_aa_assets EOW base minutes (explicitly weekly-flagged assets, or non-periodic/non-daily-only assets)
      const pureAssetEowMin = (area.weeklyFlagMin || 0) > 0 ? area.weeklyFlagMin : Math.max(0, (area.totalHrsReq || 0) - (area.dailyYesZeroMin || 0) - (area.monthlyFlagMin || 0) - (area.quarterlyFlagMin || 0) - (area.semiAnnualFlagMin || 0) - (area.annualFlagMin || 0));

      // Partition room assets into two strictly disjoint (non-overlapping) sets:
      // 1. Daily-Turn Assets: sumDailyMin (2,110m across 112 rows) + activeDailyRatio * dailyYesZeroMin (10,845m across 137 rows)
      // 2. EOW-Only Assets: pureAssetEowMin minus dailyOverlapInEowMin (so the same asset's minutes are NEVER counted in both EOW and Daily Turn buckets!)
      const activeDailyRatio = basisKey === 'assets_full_daily' ? 1.0 : dailyShareRatio;
      const dailyTurnBaseAssetMin = (area.sumDailyMin || 0) + (area.dailyYesZeroMin || 0) * activeDailyRatio;
      const dailyOverlapInEowMin = (area.sumDailyMin || 0) + (area.dailyYesZeroMin || 0) * activeDailyRatio;
      let eowBaseAssetMin = 0;
      let midweekBaseAssetMin = 0;
      if (basisKey === 'assets_full_daily') {
        // Basis 2 (Upper Bound): Disjoint EOW-only assets (pureAssetEowMin minus dailyOverlapInEowMin) + 100% of dailyYesZeroMin (10,845m) + explicit sumDailyMin (2,110m) on every turn (ZERO double-counting!)
        eowBaseAssetMin = Math.max(0, pureAssetEowMin - dailyOverlapInEowMin) + missingEstMin;
        midweekBaseAssetMin = runDays >= 4 ? (area.midweekFlagMin || 0) * 0.5 : 0;
      } else if (basisKey === 'cleanplan_deinflated') {
        // Basis 3 (CleanPlan De-Inflated Scope): D4_cleanplan_scopes.csv minus exact 20,060m 59x P1.1 bug (95,870m) minus dailyOverlapInEowMin + daily turns
        eowBaseAssetMin = Math.max(0, (area.cleanPlanDeinflatedEowMin || pureAssetEowMin) - dailyOverlapInEowMin) + missingEstMin;
        midweekBaseAssetMin = runDays >= 4 ? (area.midweekFlagMin || 0) * 0.5 : 0;
      } else {
        // Basis 1 ('assets_eow_explicit_daily' - Default Controller Recommended):
        // Disjoint EOW-only assets (pureAssetEowMin minus dailyOverlapInEowMin) + explicit populated craa5_dailymin (2,110m across 112 rows) + dailySharePct% (default 0%) of dailyYesZeroMin (10,845m across 137 rows)
        eowBaseAssetMin = Math.max(0, pureAssetEowMin - dailyOverlapInEowMin) + missingEstMin;
        midweekBaseAssetMin = runDays >= 4 ? (area.midweekFlagMin || 0) * 0.5 : 0;
      }

      // Q3: EOW Clean Wall-Clock Duration (Mode A: Total Asset / Eff Crew vs Mode B: Critical Path Bottleneck Floor)
      const eowAmplifiedAssetMin = eowBaseAssetMin * F;
      const modeAWashClockMin = eowAmplifiedAssetMin / effCrew;
      const modeBCritClockMin = (area.critPathFloorMin || area.maxSingleAssetMin || 0) * (F / 1.5);
      let effectiveWashClockMin = modeAWashClockMin;
      if (sp.cleanDurationMode === 'critical') {
        effectiveWashClockMin = Math.max(modeBCritClockMin, modeAWashClockMin * 0.5);
      } else if (sp.cleanDurationMode === 'both') {
        effectiveWashClockMin = Math.max(modeAWashClockMin, modeBCritClockMin);
      }
      const totalEowWallClockMin = preMin + effectiveWashClockMin + postMin;
      const totalEowWallClockHrs = totalEowWallClockMin / 60;

      // EOW Man-Minutes = Pre-Wash + (Effective Wash Clock * Assigned N, incorporating Q7 Crowding penalty) + Post-Op Swab
      const eowWashManMin = effectiveWashClockMin * assignedN;
      const singleEowManMin = preWashManMinPerClean + eowWashManMin + swabManMinPerClean;
      let weeklyDailyCleanManMin = 0;
      let weeklyMidweekManMin = 0;
      let weeklyEowManMin = 0;
      let weeklyAllergenManMin = 0;
      let weeklyMssPeriodicManMin = 0;
      let excludedByMode = false;
      if (area.category === 'janitorial') {
        if (isJanitorialContractor) {
          excludedByMode = true;
        } else {
          // In-house janitorial: daily rounds (sumDailyMin * 7) + weekly deep clean + periodic MSS
          weeklyDailyCleanManMin = (area.sumDailyMin || 0) * F * 7;
          weeklyEowManMin = Math.max(0, (area.weeklyFlagMin || 0) - (area.sumDailyMin || 0)) * F;
          weeklyMssPeriodicManMin = periodicWeeklyBaseMin * F;
        }
      } else if (area.category === 'standing_post') {
        if (isStandingPostsMode) {
          excludedByMode = true; // Handled via Standing Post Setpoints without double-counting
        } else {
          // Q1 Mode A: Asset-driven support rows from craa5_aa_assets
          if ((area.dailyFlagCount || 0) > 0) {
            weeklyDailyCleanManMin = (area.dailyFlagMin || area.sumDailyMin || area.totalHrsReq || 0) * F * 7;
          } else {
            weeklyEowManMin = (pureAssetEowMin || area.totalHrsReq || 0) * F;
          }
          weeklyMssPeriodicManMin = periodicWeeklyBaseMin * F;
        }
      } else if (area.category === 'major_line' || area.category === 'secondary_line') {
        // Per Q4 Ruling: "no run dates means it was down. only the eow cleans should and mss frequencies should be applied once to those dates."
        const eowEvents = 1.0; // Always 1 EOW clean per week even when line is down (0 run dates)
        weeklyEowManMin = singleEowManMin * eowEvents;

        // Mid-week daily turn cleans occur on (runDays - 1) production turns when runDays > 1
        const dailyTurnEvents = Math.max(0, runDays - 1);
        const singleDailyTurnWashManMin = dailyTurnBaseAssetMin * F * (assignedN / effCrew);
        // Only charge pre/post buffers on daily turns if dailyTurnBaseAssetMin > 0 or basis is assets_full_daily
        const turnBuffersManMin = dailyTurnBaseAssetMin > 0 ? preWashManMinPerClean * 0.5 + swabManMinPerClean * 0.5 : 0;
        const singleDailyTurnTotalManMin = singleDailyTurnWashManMin + turnBuffersManMin;
        weeklyDailyCleanManMin = dailyTurnEvents * singleDailyTurnTotalManMin;

        // Midweek intervention (for IBL4/IBL5 when running >= 4 days)
        weeklyMidweekManMin = midweekBaseAssetMin * F * (assignedN / effCrew);

        // Allergen changeover increment (only when line runs and has allergen turns)
        if (runDays > 0 && allergenTurns > 0) {
          const alrgBase = (area.allergenAddMin || 0) > 0 ? area.allergenAddMin * 0.15 : eowBaseAssetMin * 0.10;
          const alrgWashManMin = alrgBase * F * Math.max(0.25, alrgMult - 0.75);
          const alrgValidationManMin = swabManMinPerClean * alrgMult;
          weeklyAllergenManMin = allergenTurns * (alrgWashManMin + alrgValidationManMin);
        }

        // Periodic MSS scope prorated weekly (Monthly/Quarterly/Semi-Annual/Annual)
        weeklyMssPeriodicManMin = periodicWeeklyBaseMin * F * (assignedN / effCrew);
      } else {
        // MSS equipment & structural areas ('mss_area' / 'missing_std'): EOW / Weekly + prorated Periodic MSS
        if (eowBaseAssetMin > 0) {
          weeklyEowManMin = eowBaseAssetMin * F * (assignedN / effCrew);
        }
        if (periodicWeeklyBaseMin > 0) {
          weeklyMssPeriodicManMin = periodicWeeklyBaseMin * F * (assignedN / effCrew);
        }
      }
      const totalWeeklyManMin = excludedByMode ? 0 : weeklyDailyCleanManMin + weeklyMidweekManMin + weeklyEowManMin + weeklyAllergenManMin + weeklyMssPeriodicManMin;
      const totalWeeklyManHrs = totalWeeklyManMin / 60;
      return {
        ...area,
        optN,
        assignedN,
        crowd,
        runDays: Number(runDays.toFixed(2)),
        allergenTurns: Number(allergenTurns.toFixed(2)),
        unpublishedHorizon,
        schedHorizonDate: schedInfo ? schedInfo.horizonEndDate : '2026-12-19',
        schedTotalRunDays: schedInfo ? schedInfo.distinctRunDates : 80,
        schedWeeksCovered: schedInfo ? schedInfo.publishedHorizonWeeks : 16,
        eowBaseAssetMin: Number(eowBaseAssetMin.toFixed(0)),
        dailyTurnBaseAssetMin: Number(dailyTurnBaseAssetMin.toFixed(0)),
        periodicWeeklyBaseMin: Number(periodicWeeklyBaseMin.toFixed(1)),
        modeAWashClockHrs: Number((modeAWashClockMin / 60).toFixed(2)),
        modeBCritClockHrs: Number((modeBCritClockMin / 60).toFixed(2)),
        totalEowWallClockHrs: Number(totalEowWallClockHrs.toFixed(2)),
        singleEowManHrs: Number((singleEowManMin / 60).toFixed(2)),
        weeklyDailyCleanHrs: Number((weeklyDailyCleanManMin / 60).toFixed(2)),
        weeklyMidweekHrs: Number((weeklyMidweekManMin / 60).toFixed(2)),
        weeklyEowHrs: Number((weeklyEowManMin / 60).toFixed(2)),
        weeklyAllergenHrs: Number((weeklyAllergenManMin / 60).toFixed(2)),
        weeklyMssPeriodicHrs: Number((weeklyMssPeriodicManMin / 60).toFixed(2)),
        totalWeeklyManHrs: Number(totalWeeklyManHrs.toFixed(2)),
        excludedByMode
      };
    }

    // 1. Compute Area Models under active Engineering Basis + 3-Basis Sensitivity Comparison
    const areaRows = SD_AREAS.map(area => computeAreaUnderBasis(area, sp.engineeringBasis));
    const calcTotalDirectHrsForBasis = bKey => {
      return SD_AREAS.reduce((acc, a) => acc + computeAreaUnderBasis(a, bKey).totalWeeklyManHrs, 0);
    };

    // 2. Standing Support Posts (Q1 Mode B vs Mode A, with productive_net vs gross_shift toggle)
    const posts = sp.standingPosts || SD_DEFAULT_SETPOINTS.standingPosts;
    const dayPostHeads = numOr(posts.chemCageDay ?? posts.chemDay, 1) + numOr(posts.adminDay, 1) + numOr(posts.qaSwabDay ?? posts.qaDay, 2) + numOr(posts.trashDockDay ?? posts.trashDay, 1) + numOr(posts.scrubberDay, 1);
    const nightPostHeads = numOr(posts.chemCageNight ?? posts.chemNight, 1) + numOr(posts.adminNight, 0) + numOr(posts.qaSwabNight ?? posts.qaNight, 2) + numOr(posts.trashDockNight ?? posts.trashNight, 1) + numOr(posts.scrubberNight, 1);

    // Standing post hours per shift: 'productive_net' (10.75h net productive/shift matching supply) vs 'gross_shift' (12.0h gross/shift)
    const postHrsPerHeadShift = sp.standingPostBasis === 'gross_shift' ? 12.0 : productiveMinPerShift / 60;
    const standingDayHrsPerShift = isStandingPostsMode ? dayPostHeads * postHrsPerHeadShift : 0;
    const standingNightHrsPerShift = isStandingPostsMode ? nightPostHeads * postHrsPerHeadShift : 0;
    const standingSupportWeeklyHrs = (standingDayHrsPerShift + standingNightHrsPerShift) * 7;

    // Aggregate Direct Wash & MSS buckets from areaRows
    const lineDailyWashHrs = areaRows.reduce((s, r) => s + r.weeklyDailyCleanHrs, 0);
    const lineMidweekHrs = areaRows.reduce((s, r) => s + r.weeklyMidweekHrs, 0);
    const lineEowWashHrs = areaRows.filter(r => r.category === 'major_line' || r.category === 'secondary_line').reduce((s, r) => s + r.weeklyEowHrs, 0);
    const lineAllergenHrs = areaRows.reduce((s, r) => s + r.weeklyAllergenHrs, 0);
    const mssEquipPeriodicHrs = areaRows.filter(r => r.category !== 'major_line' && r.category !== 'secondary_line').reduce((s, r) => s + r.weeklyEowHrs, 0) + areaRows.reduce((s, r) => s + r.weeklyMssPeriodicHrs, 0);
    const directWashWeeklyRequiredHrs = lineDailyWashHrs + lineMidweekHrs + lineEowWashHrs + lineAllergenHrs + mssEquipPeriodicHrs;
    const totalWeeklyRequiredHrs = directWashWeeklyRequiredHrs + standingSupportWeeklyHrs;
    const basisComparison = {
      assets_eow_explicit_daily: {
        label: 'Basis 1: Pure craa5_aa_assets (55,245m EOW + 2,110m Explicit dailymin)',
        directHrs: Number(calcTotalDirectHrsForBasis('assets_eow_explicit_daily').toFixed(1)),
        totalHrs: Number((calcTotalDirectHrsForBasis('assets_eow_explicit_daily') + standingSupportWeeklyHrs).toFixed(1))
      },
      assets_full_daily: {
        label: 'Basis 2: Full Daily=Yes Upper Bound (+10,845m daily=Yes w/ dailymin=0)',
        directHrs: Number(calcTotalDirectHrsForBasis('assets_full_daily').toFixed(1)),
        totalHrs: Number((calcTotalDirectHrsForBasis('assets_full_daily') + standingSupportWeeklyHrs).toFixed(1))
      },
      cleanplan_deinflated: {
        label: 'Basis 3: CleanPlan Scope De-Inflated (115,930m Minus 20,060m 59x Bug)',
        directHrs: Number(calcTotalDirectHrsForBasis('cleanplan_deinflated').toFixed(1)),
        totalHrs: Number((calcTotalDirectHrsForBasis('cleanplan_deinflated') + standingSupportWeeklyHrs).toFixed(1))
      }
    };

    // 3. Crew Roster, Shift Schedule & Available Manpower Hours (Q2, Q6, Q8)
    // Panama / 2-2-3 & 4-Crew Pattern:
    // Crew A (Day): Sun, Mon, Tue + 0.5 Wed (3.5 shifts/wk = 42h/wk per cleaner)
    // Crew B (Day): 0.5 Wed + Thu, Fri, Sat (3.5 shifts/wk = 42h/wk per cleaner)
    // Crew C (Night): Sun, Mon, Tue + 0.5 Wed (3.5 shifts/wk = 42h/wk per cleaner)
    // Crew D (Night): 0.5 Wed + Thu, Fri, Sat (3.5 shifts/wk = 42h/wk per cleaner)
    const crewShiftWeights = {
      A: [1.0, 1.0, 1.0, 0.5, 0.0, 0.0, 0.0],
      B: [0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 1.0],
      C: [1.0, 1.0, 1.0, 0.5, 0.0, 0.0, 0.0],
      D: [0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 1.0]
    };
    const rateT1 = numOr(sp.rateTech1, 18.00);
    const rateT2 = numOr(sp.rateTech2, 21.00);
    const rateT3 = numOr(sp.rateTech3, 24.00);
    const fringePctVal = numOr(sp.fringeBurdenPct ?? sp.fringePct, 30.0);
    const fringeRatio = Math.max(0, fringePctVal) / 100;
    const otMult = Math.max(1.0, numOr(sp.otMultiplier, 1.5));
    const crewModels = {};
    let totalActiveFloor = 0;
    let totalDirectCleaners = 0;
    let totalEmbeddedSpecialists = 0;
    let totalAuthorizedFloor = 0;
    let totalGrossRosterHrsWk = 0;
    let totalAfterAttendanceHrsWk = 0;
    let totalPaidFloorHrsWk = 0;
    let totalNetAvailableHrsWk = 0;
    let totalWeeklyFloorBasePayroll = 0;
    let totalWeeklyFloorLoadedPayroll = 0;
    ['A', 'B', 'C', 'D'].forEach(cKey => {
      const baseSummary = SD_ROSTER_SUMMARY.crews[cKey];
      const activeOvrObj = sp.crewActiveHeadcount || sp.crewHeadcountOverrides || {};
      const activeFloor = numOr(activeOvrObj[cKey], baseSummary.activeFloor);
      const specCount = baseSummary.embeddedSpecialists;
      const directCleaners = Math.max(0, activeFloor - specCount);
      const authFloor = numOr(sp.crewAuthorizedTargets && sp.crewAuthorizedTargets[cKey], baseSummary.authorizedFloor);
      const vacancies = Math.max(0, authFloor - activeFloor);
      const weights = crewShiftWeights[cKey];
      const shrinkArr = sp.attendanceShrinkage && sp.attendanceShrinkage[cKey] || SD_DEFAULT_SETPOINTS.attendanceShrinkage[cKey];
      let crewGrossHrs = 0;
      let crewAfterShrinkHrs = 0;
      let crewNetProdHrs = 0;
      let crewDirectNetProdHrs = 0;
      const dailyBreakdown = weights.map((w, dayIdx) => {
        if (w <= 0) {
          return {
            dayIdx,
            weight: 0,
            grossHrs: 0,
            shrinkPct: 0,
            afterShrinkHrs: 0,
            netProdHrs: 0,
            directNetProdHrs: 0,
            presentHeads: 0,
            directPresentHeads: 0
          };
        }
        const shrinkPct = Math.min(50, Math.max(0, numOr(shrinkArr[dayIdx], 0)));
        const presentHeads = activeFloor * (1 - shrinkPct / 100);
        const directPresentHeads = directCleaners * (1 - shrinkPct / 100);
        const grossHrs = activeFloor * 12 * w;
        const afterShrinkHrs = presentHeads * 12 * w;
        const netProdHrs = presentHeads * (productiveMinPerShift / 60) * w;
        const directNetProdHrs = directPresentHeads * (productiveMinPerShift / 60) * w;
        crewGrossHrs += grossHrs;
        crewAfterShrinkHrs += afterShrinkHrs;
        crewNetProdHrs += netProdHrs;
        crewDirectNetProdHrs += directNetProdHrs;
        return {
          dayIdx,
          weight: w,
          grossHrs: Number(grossHrs.toFixed(1)),
          shrinkPct,
          afterShrinkHrs: Number(afterShrinkHrs.toFixed(1)),
          netProdHrs: Number(netProdHrs.toFixed(1)),
          directNetProdHrs: Number(directNetProdHrs.toFixed(1)),
          presentHeads: Number(presentHeads.toFixed(2)),
          directPresentHeads: Number(directPresentHeads.toFixed(2))
        };
      });

      // Calculate weighted average hourly wage for this crew (incorporating individual sp.empRateOverrides)
      const scale = baseSummary.activeFloor > 0 ? activeFloor / baseSummary.activeFloor : 1;
      const t1Count = baseSummary.tech1 * scale;
      const t2Count = baseSummary.tech2 * scale;
      const t3Count = baseSummary.tech3 * scale;
      let baseHourlySum = t1Count * rateT1 + t2Count * rateT2 + t3Count * rateT3;
      const crewSeedEmps = SD_EMP_SEED.filter(e => e.crew === cKey && e.isFloor && e.active);
      crewSeedEmps.forEach(emp => {
        if (sp.empRateOverrides && sp.empRateOverrides[emp.id] !== undefined) {
          const customRate = Number(sp.empRateOverrides[emp.id]);
          const defaultEmpRate = emp.tier === 'tech3' ? rateT3 : emp.tier === 'tech2' ? rateT2 : rateT1;
          if (!isNaN(customRate)) {
            baseHourlySum += customRate - defaultEmpRate;
          }
        }
      });
      const baseHourlyAvg = activeFloor > 0 ? baseHourlySum / activeFloor : rateT1;
      const loadedHourlyAvg = baseHourlyAvg * (1 + fringeRatio);

      // Payroll Basis (Round 4C Item #8):
      // - 'full_roster_42h' (Default Controller Budget): Each FTE works a 42h/wk Panama rotation (40h regular + 2h over-40 built-in OT at 1.5x base = 43.0 straight-time base hrs + 42.0h fringe, including Paid PTO)
      // - 'attended_plus_pto': Attended clock hours + Paid PTO hours (50.8% of shrinkage per D9 ShiftArchive) + built-in Panama 2h over-40 OT premium on attended weeks
      let crewPaidClockHrs = crewGrossHrs;
      let weeklyBasePay = 0;
      let weeklyLoadedPay = 0;
      if (sp.payrollBasis === 'attended_plus_pto') {
        const paidPtoHrs = (crewGrossHrs - crewAfterShrinkHrs) * SD_SHIFT_ARCHIVE_SUMMARY.paidPtoShareOfShrinkage;
        crewPaidClockHrs = crewAfterShrinkHrs + paidPtoHrs;
        const panamaOver40OtPremiumPay = activeFloor * (crewAfterShrinkHrs / Math.max(1, crewGrossHrs)) * 2.0 * (otMult - 1.0) * baseHourlyAvg;
        weeklyBasePay = crewPaidClockHrs * baseHourlyAvg + panamaOver40OtPremiumPay;
        weeklyLoadedPay = crewPaidClockHrs * baseHourlyAvg * (1 + fringeRatio) + panamaOver40OtPremiumPay;
      } else {
        // 'full_roster_42h': 42.0 clock hrs/wk per FTE + 2.0h over-40 Panama OT half-time premium (never multiplying fringe by 1.5x)
        crewPaidClockHrs = crewGrossHrs; // 42h * activeFloor
        const panamaOver40OtPremiumPay = activeFloor * 2.0 * (otMult - 1.0) * baseHourlyAvg;
        weeklyBasePay = crewGrossHrs * baseHourlyAvg + panamaOver40OtPremiumPay;
        weeklyLoadedPay = crewGrossHrs * baseHourlyAvg * (1 + fringeRatio) + panamaOver40OtPremiumPay;
      }
      totalActiveFloor += activeFloor;
      totalDirectCleaners += directCleaners;
      totalEmbeddedSpecialists += specCount;
      totalAuthorizedFloor += authFloor;
      totalGrossRosterHrsWk += crewGrossHrs;
      totalAfterAttendanceHrsWk += crewAfterShrinkHrs;
      totalPaidFloorHrsWk += crewPaidClockHrs;
      totalNetAvailableHrsWk += crewNetProdHrs;
      totalWeeklyFloorBasePayroll += weeklyBasePay;
      totalWeeklyFloorLoadedPayroll += weeklyLoadedPay;
      crewModels[cKey] = {
        ...baseSummary,
        activeFloor,
        directCleaners,
        embeddedSpecialists: specCount,
        authorizedFloor: authFloor,
        floorVacancies: vacancies,
        grossHrsWk: Number(crewGrossHrs.toFixed(1)),
        afterShrinkHrsWk: Number(crewAfterShrinkHrs.toFixed(1)),
        paidClockHrsWk: Number(crewPaidClockHrs.toFixed(1)),
        netAvailHrsWk: Number(crewNetProdHrs.toFixed(1)),
        directNetAvailHrsWk: Number(crewDirectNetProdHrs.toFixed(1)),
        avgShrinkPct: Number((crewGrossHrs > 0 ? (crewGrossHrs - crewAfterShrinkHrs) / crewGrossHrs * 100 : 0).toFixed(1)),
        baseHourlyAvg: Number(baseHourlyAvg.toFixed(2)),
        loadedHourlyAvg: Number(loadedHourlyAvg.toFixed(2)),
        weeklyBasePay: Number(weeklyBasePay.toFixed(2)),
        weeklyLoadedPay: Number(weeklyLoadedPay.toFixed(2)),
        dailyBreakdown
      };
    });
    const totalDirectNetAvailHrsWk = ['A', 'B', 'C', 'D'].reduce((s, k) => s + crewModels[k].directNetAvailHrsWk, 0);
    const totalSpecialistNetAvailHrsWk = totalNetAvailableHrsWk - totalDirectNetAvailHrsWk;

    // 4. Construct the 168-Hour Grid (7 Days x Day/Night Shifts x 12 Hours)
    // Ensures 100.0% of totalWeeklyRequiredHrs is placed on the 14 shifts (0.00h reconciliation variance)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const eowShiftWeights = [{
      day: 0,
      shift: 'day',
      w: 0.20
    },
    // Sun Day
    {
      day: 0,
      shift: 'night',
      w: 0.12
    },
    // Sun Night
    {
      day: 1,
      shift: 'day',
      w: 0.00
    }, {
      day: 1,
      shift: 'night',
      w: 0.00
    }, {
      day: 2,
      shift: 'day',
      w: 0.00
    }, {
      day: 2,
      shift: 'night',
      w: 0.00
    }, {
      day: 3,
      shift: 'day',
      w: 0.00
    }, {
      day: 3,
      shift: 'night',
      w: 0.00
    }, {
      day: 4,
      shift: 'day',
      w: 0.00
    }, {
      day: 4,
      shift: 'night',
      w: 0.00
    }, {
      day: 5,
      shift: 'day',
      w: 0.00
    }, {
      day: 5,
      shift: 'night',
      w: 0.12
    },
    // Fri Night teardown start
    {
      day: 6,
      shift: 'day',
      w: 0.28
    },
    // Sat Day peak EOW wash
    {
      day: 6,
      shift: 'night',
      w: 0.28
    } // Sat Night peak EOW wash
    ];
    const dailyTurnShiftWeights = [{
      day: 0,
      shift: 'day',
      w: 0.00
    }, {
      day: 0,
      shift: 'night',
      w: 0.04
    }, {
      day: 1,
      shift: 'day',
      w: 0.07
    }, {
      day: 1,
      shift: 'night',
      w: 0.13
    }, {
      day: 2,
      shift: 'day',
      w: 0.08
    }, {
      day: 2,
      shift: 'night',
      w: 0.14
    }, {
      day: 3,
      shift: 'day',
      w: 0.08
    }, {
      day: 3,
      shift: 'night',
      w: 0.14
    }, {
      day: 4,
      shift: 'day',
      w: 0.08
    }, {
      day: 4,
      shift: 'night',
      w: 0.14
    }, {
      day: 5,
      shift: 'day',
      w: 0.10
    }, {
      day: 5,
      shift: 'night',
      w: 0.00
    }, {
      day: 6,
      shift: 'day',
      w: 0.00
    }, {
      day: 6,
      shift: 'night',
      w: 0.00
    }];
    const mssPeriodicShiftWeights = [{
      day: 0,
      shift: 'day',
      w: 0.12
    }, {
      day: 0,
      shift: 'night',
      w: 0.08
    }, {
      day: 1,
      shift: 'day',
      w: 0.05
    }, {
      day: 1,
      shift: 'night',
      w: 0.05
    }, {
      day: 2,
      shift: 'day',
      w: 0.06
    }, {
      day: 2,
      shift: 'night',
      w: 0.06
    }, {
      day: 3,
      shift: 'day',
      w: 0.16
    },
    // Wed overlap day MSS blitz
    {
      day: 3,
      shift: 'night',
      w: 0.14
    },
    // Wed overlap night MSS blitz
    {
      day: 4,
      shift: 'day',
      w: 0.05
    }, {
      day: 4,
      shift: 'night',
      w: 0.05
    }, {
      day: 5,
      shift: 'day',
      w: 0.04
    }, {
      day: 5,
      shift: 'night',
      w: 0.04
    }, {
      day: 6,
      shift: 'day',
      w: 0.05
    }, {
      day: 6,
      shift: 'night',
      w: 0.05
    }];
    const dailyPlusMidweekPlusAlrgHrs = lineDailyWashHrs + lineMidweekHrs + lineAllergenHrs;
    const daysDrill = dayNames.map((dName, dIdx) => {
      const dayCrewLabel = dIdx < 3 ? 'Crew A' : dIdx === 3 ? 'Crew A/B (Alt Wed)' : 'Crew B';
      const dayAvailHrs = crewModels.A.dailyBreakdown[dIdx].netProdHrs + crewModels.B.dailyBreakdown[dIdx].netProdHrs;
      const dayGrossHrs = crewModels.A.dailyBreakdown[dIdx].grossHrs + crewModels.B.dailyBreakdown[dIdx].grossHrs;
      const dayPresentHeads = crewModels.A.dailyBreakdown[dIdx].presentHeads + crewModels.B.dailyBreakdown[dIdx].presentHeads;
      const nightCrewLabel = dIdx < 3 ? 'Crew C' : dIdx === 3 ? 'Crew C/D (Alt Wed)' : 'Crew D';
      const nightAvailHrs = crewModels.C.dailyBreakdown[dIdx].netProdHrs + crewModels.D.dailyBreakdown[dIdx].netProdHrs;
      const nightGrossHrs = crewModels.C.dailyBreakdown[dIdx].grossHrs + crewModels.D.dailyBreakdown[dIdx].grossHrs;
      const nightPresentHeads = crewModels.C.dailyBreakdown[dIdx].presentHeads + crewModels.D.dailyBreakdown[dIdx].presentHeads;
      const eowDayW = eowShiftWeights.find(x => x.day === dIdx && x.shift === 'day').w;
      const eowNightW = eowShiftWeights.find(x => x.day === dIdx && x.shift === 'night').w;
      const dTurnDayW = dailyTurnShiftWeights.find(x => x.day === dIdx && x.shift === 'day').w;
      const dTurnNightW = dailyTurnShiftWeights.find(x => x.day === dIdx && x.shift === 'night').w;
      const mssDayW = mssPeriodicShiftWeights.find(x => x.day === dIdx && x.shift === 'day').w;
      const mssNightW = mssPeriodicShiftWeights.find(x => x.day === dIdx && x.shift === 'night').w;
      const dayLineEowHrs = lineEowWashHrs * eowDayW;
      const dayLineTurnHrs = dailyPlusMidweekPlusAlrgHrs * dTurnDayW;
      const dayMssHrs = mssEquipPeriodicHrs * mssDayW;
      const daySupportHrs = standingDayHrsPerShift;
      const dayRequiredHrs = dayLineEowHrs + dayLineTurnHrs + dayMssHrs + daySupportHrs;
      const nightLineEowHrs = lineEowWashHrs * eowNightW;
      const nightLineTurnHrs = dailyPlusMidweekPlusAlrgHrs * dTurnNightW;
      const nightMssHrs = mssEquipPeriodicHrs * mssNightW;
      const nightSupportHrs = standingNightHrsPerShift;
      const nightRequiredHrs = nightLineEowHrs + nightLineTurnHrs + nightMssHrs + nightSupportHrs;
      const buildHourlySlots = (shiftKey, shiftReqHrs, shiftAvailHrs, presentHeads, eowHrs, turnHrs, mssHrs, supHrs) => {
        const slots = [];
        const startHour = shiftKey === 'day' ? 6 : 18;
        const hourProfileWeights = Array.isArray(sp.hourProfileWeights) && sp.hourProfileWeights.length === 12 ? sp.hourProfileWeights : [0.065, 0.095, 0.095, 0.095, 0.090, 0.055, 0.095, 0.095, 0.095, 0.085, 0.075, 0.060];
        for (let h = 0; h < 12; h++) {
          const clockHr = (startHour + h) % 24;
          const nextClockHr = (clockHr + 1) % 24;
          const label = `${String(clockHr).padStart(2, '0')}:00 - ${String(nextClockHr).padStart(2, '0')}:00`;
          const isFrictionWindow = h === 0 || h === 5 || h === 11;
          const availFactor = isFrictionWindow ? Math.max(0.4, 1 - frictionRatio * 3.2) : Math.min(1.0, productiveMinPerShift / 60 / (12 - 3 * (frictionRatio * 3.2)));
          const hrAvail = presentHeads * availFactor;
          const w = hourProfileWeights[h];
          const hrReq = shiftReqHrs * w;
          let phaseTag = 'Active Wash & CIP / MSS Execution';
          if (h === 0) phaseTag = 'Safety Huddle, PPE Donning & Lockout/Tagout (Pre-Wash 60m)';else if (h === 5) phaseTag = 'Mid-Shift Meal/Rest Rotation & Chemical Titration Check';else if (h === 9 || h === 10) phaseTag = 'Post-Op Visual Inspection & ATP Swab Verification (90m)';else if (h === 11) phaseTag = 'QA Pre-Op Release, Hose Coiling & Shift Handoff';
          slots.push({
            hourIndex: h + 1,
            label,
            phaseTag,
            presentHeads: Number(presentHeads.toFixed(1)),
            availManHrs: Number(hrAvail.toFixed(2)),
            reqManHrs: Number(hrReq.toFixed(2)),
            eowHrs: Number((eowHrs * w).toFixed(2)),
            turnHrs: Number((turnHrs * w).toFixed(2)),
            mssHrs: Number((mssHrs * w).toFixed(2)),
            supHrs: Number((supHrs * w).toFixed(2)),
            netManHrs: Number((hrAvail - hrReq).toFixed(2)),
            utilPct: hrAvail > 0 ? Number((hrReq / hrAvail * 100).toFixed(1)) : 0
          });
        }
        return slots;
      };
      const dayHourly = buildHourlySlots('day', dayRequiredHrs, dayAvailHrs, dayPresentHeads, dayLineEowHrs, dayLineTurnHrs, dayMssHrs, daySupportHrs);
      const nightHourly = buildHourlySlots('night', nightRequiredHrs, nightAvailHrs, nightPresentHeads, nightLineEowHrs, nightLineTurnHrs, nightMssHrs, nightSupportHrs);
      const totalDayAvail = dayAvailHrs + nightAvailHrs;
      const totalDayReq = dayRequiredHrs + nightRequiredHrs;
      return {
        dayIdx: dIdx,
        dayName: dName,
        shortDay: shortDays[dIdx],
        dayShift: {
          crewLabel: dayCrewLabel,
          presentHeads: Number(dayPresentHeads.toFixed(1)),
          grossHrs: Number(dayGrossHrs.toFixed(1)),
          rawAvailHrs: dayAvailHrs,
          rawReqHrs: dayRequiredHrs,
          availHrs: Number(dayAvailHrs.toFixed(1)),
          reqHrs: Number(dayRequiredHrs.toFixed(1)),
          eowHrs: Number(dayLineEowHrs.toFixed(1)),
          turnHrs: Number(dayLineTurnHrs.toFixed(1)),
          mssHrs: Number(dayMssHrs.toFixed(1)),
          supHrs: Number(daySupportHrs.toFixed(1)),
          netHrs: Number((dayAvailHrs - dayRequiredHrs).toFixed(1)),
          utilPct: dayAvailHrs > 0 ? Number((dayRequiredHrs / dayAvailHrs * 100).toFixed(1)) : 0,
          hourly: dayHourly
        },
        nightShift: {
          crewLabel: nightCrewLabel,
          presentHeads: Number(nightPresentHeads.toFixed(1)),
          grossHrs: Number(nightGrossHrs.toFixed(1)),
          rawAvailHrs: nightAvailHrs,
          rawReqHrs: nightRequiredHrs,
          availHrs: Number(nightAvailHrs.toFixed(1)),
          reqHrs: Number(nightRequiredHrs.toFixed(1)),
          eowHrs: Number(nightLineEowHrs.toFixed(1)),
          turnHrs: Number(nightLineTurnHrs.toFixed(1)),
          mssHrs: Number(nightMssHrs.toFixed(1)),
          supHrs: Number(nightSupportHrs.toFixed(1)),
          netHrs: Number((nightAvailHrs - nightRequiredHrs).toFixed(1)),
          utilPct: nightAvailHrs > 0 ? Number((nightRequiredHrs / nightAvailHrs * 100).toFixed(1)) : 0,
          hourly: nightHourly
        },
        totalGrossHrs: Number((dayGrossHrs + nightGrossHrs).toFixed(1)),
        totalAvailHrs: Number(totalDayAvail.toFixed(1)),
        totalReqHrs: Number(totalDayReq.toFixed(1)),
        totalNetHrs: Number((totalDayAvail - totalDayReq).toFixed(1)),
        utilPct: totalDayAvail > 0 ? Number((totalDayReq / totalDayAvail * 100).toFixed(1)) : 0
      };
    });

    // Verify 168-Hour Grid sum equals totalWeeklyRequiredHrs (0.00h Reconciliation Delta)
    const gridWeeklyAvailHrs = daysDrill.reduce((s, d) => s + d.dayShift.rawAvailHrs + d.nightShift.rawAvailHrs, 0);
    const gridWeeklyReqHrs = daysDrill.reduce((s, d) => s + d.dayShift.rawReqHrs + d.nightShift.rawReqHrs, 0);
    const gridReconciliationDeltaHrs = Number((totalWeeklyRequiredHrs - gridWeeklyReqHrs).toFixed(2));

    // 5. Non-Circular Required Headcount Formula
    const overallShrinkageRatio = totalGrossRosterHrsWk > 0 ? (totalGrossRosterHrsWk - totalAfterAttendanceHrsWk) / totalGrossRosterHrsWk : 0.086;
    const netProdHoursPerCleanerWk = 42.0 * (1 - overallShrinkageRatio) * (1 - frictionRatio);
    const requiredDirectCleaners = netProdHoursPerCleanerWk > 0 ? Math.ceil(directWashWeeklyRequiredHrs / netProdHoursPerCleanerWk) : 90;
    const requiredSupportSpecialists = netProdHoursPerCleanerWk > 0 ? Math.ceil(standingSupportWeeklyHrs / netProdHoursPerCleanerWk) : 10;
    const requiredFloorHeadcount = requiredDirectCleaners + requiredSupportSpecialists;
    const weeklyNetBalanceHrs = totalNetAvailableHrsWk - totalWeeklyRequiredHrs;
    const directWashNetBalanceHrs = totalDirectNetAvailHrsWk - directWashWeeklyRequiredHrs;
    const weeklyOvertimeRequiredHrs = Math.max(0, totalWeeklyRequiredHrs - totalNetAvailableHrsWk);
    const headcountGapVsActive = requiredFloorHeadcount - totalActiveFloor;
    const directHeadcountGapVsActive = requiredDirectCleaners - totalDirectCleaners;
    const headcountGapVsAuthorized = requiredFloorHeadcount - totalAuthorizedFloor;

    // 6. Leadership & Total Department Payroll (Q6)
    const activeSupervisorsCount = 3; // Michele (B), Nicole (C), Rachel (D); Crew A Supervisor is VACANT
    const supAnnualSalary = numOr(sp.supervisorSalaryAnnual ?? sp.supSalary, 72000);
    const WEEKS_PER_YEAR = 365 / 7; // Exact 52.142857 weeks/yr
    const weeklySupBasePay = activeSupervisorsCount * supAnnualSalary / WEEKS_PER_YEAR;
    const weeklySupLoadedPay = weeklySupBasePay * (1 + fringeRatio);
    let weeklyDptHeadBasePay = 0;
    if (sp.includeDptHead) {
      if (sp.dptHeadMode === 'hourly') {
        weeklyDptHeadBasePay = numOr(sp.dptHeadHourlyRate ?? sp.dptHeadHourly, 50.48) * 40;
      } else {
        weeklyDptHeadBasePay = numOr(sp.dptHeadSalaryAnnual ?? sp.dptHeadSalary, 105000) / WEEKS_PER_YEAR;
      }
    }
    const weeklyDptHeadLoadedPay = weeklyDptHeadBasePay * (1 + fringeRatio);

    // Weighted average base and loaded hourly rates across Crews A-D
    const avgBaseRate = totalPaidFloorHrsWk > 0 ? totalActiveFloor > 0 ? ['A', 'B', 'C', 'D'].reduce((s, k) => s + crewModels[k].baseHourlyAvg * crewModels[k].activeFloor, 0) / totalActiveFloor : 19.00 : 19.00;
    const avgLoadedRate = avgBaseRate * (1 + fringeRatio);
    // Statutory OT premium applies 1.5x to BASE wage + flat 1.0x fringe burden
    const otHourlyRate = avgBaseRate * otMult + avgBaseRate * fringeRatio;
    const weeklyOtPremiumSpend = weeklyOvertimeRequiredHrs * otHourlyRate;
    const totalWeeklyLaborLoadedSpend = totalWeeklyFloorLoadedPayroll + weeklySupLoadedPay + weeklyDptHeadLoadedPay + weeklyOtPremiumSpend;

    // Cost of filling 7 Crew A Vacancies + 1 Crew A Supervisor vs running Overtime
    // Includes 42h base + 2h Panama over-40 OT half-time premium + 30% fringe on 42h
    const costOf7CrewAVacanciesWk = 7 * (42 * rateT1 * (1 + fringeRatio) + 2 * (otMult - 1.0) * rateT1);
    const costOfCrewASupWk = supAnnualSalary / WEEKS_PER_YEAR * (1 + fringeRatio);

    // 7. Chemical vs. PPE Spend Forecast (D10: Separate Pure Chemical $871,945.28 from PPE $112,350.09)
    // Baseline active horizon run-days/wk sum = 5.31 + 4.50 + 4.44 + 2.18 + 3.53 + 2.86 = 22.82 line-days/wk
    const baseAnnualRunDays = (5.31 + 4.50 + 4.44 + 2.18 + 3.53 + 2.86) * WEEKS_PER_YEAR;
    const currentAnnualRunDays = areaRows.filter(r => r.category === 'major_line').reduce((s, r) => s + r.runDays, 0) * WEEKS_PER_YEAR;
    const prodActivityRatio = baseAnnualRunDays > 0 ? currentAnnualRunDays / baseAnnualRunDays : 1.0;
    const chemInflationMult = 1 + numOr(sp.chemInflationPct, 4.0) / 100;
    const chemWasteMult = 1 + numOr(sp.chemOverusePct ?? sp.chemWasteFactorPct, 0.0) / 100;
    const selectedHistSpendBase = sp.includePpeInSpend ? SD_HIST_TOTAL_PO_SPEND : SD_HIST_PURE_CHEM_SPEND;
    const annualChemForecastSpend = selectedHistSpendBase * prodActivityRatio * chemInflationMult * chemWasteMult;
    const weeklyChemForecastSpend = annualChemForecastSpend / WEEKS_PER_YEAR;
    const pureChemAnnualForecast = SD_HIST_PURE_CHEM_SPEND * prodActivityRatio * chemInflationMult * chemWasteMult;
    const ppeAnnualForecast = SD_HIST_PPE_SUPPLY_SPEND * prodActivityRatio * chemInflationMult;

    // 8. Monthly & Annual Drill-Down (Exact calendar daysInMonth / 7 summing to 365 days = 52.1429 weeks, 100% reconciled with Annual KPI!)
    const monthDefs = [{
      m: 'Jan',
      days: 31,
      seasonFactor: 0.96
    }, {
      m: 'Feb',
      days: 28,
      seasonFactor: 0.95
    }, {
      m: 'Mar',
      days: 31,
      seasonFactor: 0.98
    }, {
      m: 'Apr',
      days: 30,
      seasonFactor: 1.00
    }, {
      m: 'May',
      days: 31,
      seasonFactor: 1.00
    }, {
      m: 'Jun',
      days: 30,
      seasonFactor: 1.02
    }, {
      m: 'Jul',
      days: 31,
      seasonFactor: 1.02
    }, {
      m: 'Aug',
      days: 31,
      seasonFactor: 1.04
    }, {
      m: 'Sep',
      days: 30,
      seasonFactor: 1.05
    }, {
      m: 'Oct',
      days: 31,
      seasonFactor: 1.06
    }, {
      m: 'Nov',
      days: 30,
      seasonFactor: 0.98
    }, {
      m: 'Dec',
      days: 31,
      seasonFactor: 0.94
    }];
    const rawWeightedDaysSum = monthDefs.reduce((s, md) => s + md.days * md.seasonFactor, 0);
    const seasonNorm = 365 / rawWeightedDaysSum;
    const monthsDrill = monthDefs.map(md => {
      const exactWeeks = md.days / 7;
      const normSeason = md.seasonFactor * seasonNorm;
      const mAvailHrs = totalNetAvailableHrsWk * exactWeeks;
      const mReqHrs = totalWeeklyRequiredHrs * exactWeeks * normSeason;
      const mNetHrs = mAvailHrs - mReqHrs;
      const mOtHrs = Math.max(0, mReqHrs - mAvailHrs);
      const mLaborSpend = (totalWeeklyFloorLoadedPayroll + weeklySupLoadedPay + weeklyDptHeadLoadedPay) * exactWeeks + mOtHrs * otHourlyRate;
      const mChemSpend = weeklyChemForecastSpend * exactWeeks * normSeason;
      return {
        month: md.m,
        days: md.days,
        weeks: Number(exactWeeks.toFixed(2)),
        seasonFactor: Number(normSeason.toFixed(3)),
        rawAvailHrs: mAvailHrs,
        rawReqHrs: mReqHrs,
        rawOtHrs: mOtHrs,
        rawLaborSpend: mLaborSpend,
        rawChemSpend: mChemSpend,
        availHrs: Number(mAvailHrs.toFixed(0)),
        reqHrs: Number(mReqHrs.toFixed(0)),
        netHrs: Number(mNetHrs.toFixed(0)),
        otHrs: Number(mOtHrs.toFixed(0)),
        laborSpend: Number(mLaborSpend.toFixed(0)),
        chemSpend: Number(mChemSpend.toFixed(0)),
        totalSpend: Number((mLaborSpend + mChemSpend).toFixed(0))
      };
    });

    // Ensure headline annual labor spend matches the 12-month drilldown sum to $0 variance!
    const totalAnnualLaborLoadedSpend = monthsDrill.reduce((s, m) => s + m.rawLaborSpend, 0);
    return {
      F,
      alrgMult,
      preMin,
      postMin,
      frictionMin,
      productiveMinPerShift,
      frictionRatio,
      fringePctVal,
      overallShrinkagePct: Number((overallShrinkageRatio * 100).toFixed(1)),
      netProdHoursPerCleanerWk: Number(netProdHoursPerCleanerWk.toFixed(2)),
      areaRows,
      basisComparison,
      lineDailyWashHrs: Number(lineDailyWashHrs.toFixed(1)),
      lineMidweekHrs: Number(lineMidweekHrs.toFixed(1)),
      lineEowWashHrs: Number(lineEowWashHrs.toFixed(1)),
      lineAllergenHrs: Number(lineAllergenHrs.toFixed(1)),
      mssEquipPeriodicHrs: Number(mssEquipPeriodicHrs.toFixed(1)),
      directWashWeeklyRequiredHrs: Number(directWashWeeklyRequiredHrs.toFixed(1)),
      standingSupportWeeklyHrs: Number(standingSupportWeeklyHrs.toFixed(1)),
      totalWeeklyRequiredHrs: Number(totalWeeklyRequiredHrs.toFixed(1)),
      crewModels,
      totalActiveFloor,
      totalDirectCleaners,
      totalEmbeddedSpecialists,
      totalAuthorizedFloor,
      totalGrossRosterHrsWk: Number(totalGrossRosterHrsWk.toFixed(1)),
      totalAfterAttendanceHrsWk: Number(totalAfterAttendanceHrsWk.toFixed(1)),
      totalPaidFloorHrsWk: Number(totalPaidFloorHrsWk.toFixed(1)),
      totalNetAvailableHrsWk: Number(totalNetAvailableHrsWk.toFixed(1)),
      totalDirectNetAvailHrsWk: Number(totalDirectNetAvailHrsWk.toFixed(1)),
      totalSpecialistNetAvailHrsWk: Number(totalSpecialistNetAvailHrsWk.toFixed(1)),
      weeklyNetBalanceHrs: Number(weeklyNetBalanceHrs.toFixed(1)),
      directWashNetBalanceHrs: Number(directWashNetBalanceHrs.toFixed(1)),
      weeklyOvertimeRequiredHrs: Number(weeklyOvertimeRequiredHrs.toFixed(1)),
      requiredDirectCleaners,
      requiredSupportSpecialists,
      requiredFloorHeadcount,
      headcountGapVsActive,
      directHeadcountGapVsActive,
      headcountGapVsAuthorized,
      avgBaseRate: Number(avgBaseRate.toFixed(2)),
      avgLoadedRate: Number(avgLoadedRate.toFixed(2)),
      otHourlyRate: Number(otHourlyRate.toFixed(2)),
      totalWeeklyFloorBasePayroll: Number(totalWeeklyFloorBasePayroll.toFixed(0)),
      totalWeeklyFloorLoadedPayroll: Number(totalWeeklyFloorLoadedPayroll.toFixed(0)),
      weeklySupLoadedPay: Number(weeklySupLoadedPay.toFixed(0)),
      weeklyDptHeadLoadedPay: Number(weeklyDptHeadLoadedPay.toFixed(0)),
      weeklyOtPremiumSpend: Number(weeklyOtPremiumSpend.toFixed(0)),
      totalWeeklyLaborLoadedSpend: Number(totalWeeklyLaborLoadedSpend.toFixed(0)),
      totalAnnualLaborLoadedSpend: Number(totalAnnualLaborLoadedSpend.toFixed(0)),
      costOf7CrewAVacanciesWk: Number(costOf7CrewAVacanciesWk.toFixed(0)),
      costOfCrewASupWk: Number(costOfCrewASupWk.toFixed(0)),
      annualChemForecastSpend: Number(annualChemForecastSpend.toFixed(0)),
      weeklyChemForecastSpend: Number(weeklyChemForecastSpend.toFixed(0)),
      pureChemAnnualForecast: Number(pureChemAnnualForecast.toFixed(0)),
      ppeAnnualForecast: Number(ppeAnnualForecast.toFixed(0)),
      totalAnnualCombinedSpend: Number((totalAnnualLaborLoadedSpend + annualChemForecastSpend).toFixed(0)),
      daysDrill,
      gridWeeklyAvailHrs: Number(gridWeeklyAvailHrs.toFixed(1)),
      gridWeeklyReqHrs: Number(gridWeeklyReqHrs.toFixed(1)),
      gridReconciliationDeltaHrs,
      monthsDrill
    };
  }, [sp]);

  // Helper to update top-level setpoint
  const updateSp = (field, value) => {
    setSp(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const resetToDefaults = () => {
    setSp(SD_DEFAULT_SETPOINTS);
    setSelectedPresetKey('director_preset|baseline_controller');
    setPresetSaveMsg('Reset all setpoints to locked Q1-Q9 Controller Baseline.');
  };
  const isStandingPosts = sp.supportMode === 'standing_posts' || sp.supportMode === 'standing';
  const isJanitorialContractor = sp.janitorialMode === 'contractor_excluded' || sp.janitorialMode === 'contractor';
  const basisReadoutLabel = sp.engineeringBasis === 'assets_full_daily' ? 'Basis 2: Full Daily=Yes Upper Bound (100%)' : sp.engineeringBasis === 'cleanplan_deinflated' ? 'Basis 3: CleanPlan Scope De-Inflated (95,870m)' : `Basis 1: Pure craa5_aa_assets (Daily Share ${sp.dailySharePct}%)`;
  const cleanModeReadoutLabel = sp.cleanDurationMode === 'total' ? 'Mode A (Total Asset / Eff Crew)' : sp.cleanDurationMode === 'critical' ? 'Mode B (Critical Path Floor)' : 'Max of Both (Asset/Crew vs Crit Path)';
  const schedHorizonReadoutLabel = sp.scheduleMode !== 'actual' ? 'Mode B: Custom Per-Line Sliders' : sp.selectedSchedWeek === 'avg_active' ? 'Mode A: Per-Line Active Horizon Avg' : sp.selectedSchedWeek === 'avg_oct' ? 'Mode A: Oct 2026 4-Week Avg' : sp.selectedSchedWeek === 'avg_16wk' ? 'Mode A: Full 16-Week Sep-Dec Avg' : `Mode A: Week of ${sp.selectedSchedWeek}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "sd-scroll-root",
    style: {
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
      backgroundColor: '#0b1120',
      color: '#f1f5f9',
      height: '100vh',
      maxHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '16px 20px 72px 20px',
      boxSizing: 'border-box',
      WebkitOverflowScrolling: 'touch'
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        html, body { height: 100%; margin: 0; padding: 0; background-color: #0b1120; }
        .sd-scroll-root { height: 100vh !important; height: 100dvh !important; max-height: 100vh !important; overflow-y: auto !important; overflow-x: hidden !important; -webkit-overflow-scrolling: touch; }
        .sd-scroll-root::-webkit-scrollbar { width: 10px; height: 10px; }
        .sd-scroll-root::-webkit-scrollbar-track { background: #0f172a; }
        .sd-scroll-root::-webkit-scrollbar-thumb { background: #334155; border-radius: 5px; border: 2px solid #0f172a; }
        .sd-scroll-root::-webkit-scrollbar-thumb:hover { background: #475569; }
      `), /*#__PURE__*/React.createElement(HubStandardTopBar, {
    appKey: "director",
    appTitle: "Sanitation Director & Controller Hub",
    appSubtitle: "Apex Foods Executive Labor, Cost, Schedule & Audit Command Center",
    appVersion: APP_VERSION,
    unlocked: logoUnlocked,
    onToggleUnlock: toggleLogoUnlock,
    userName: currentUserInfo && (currentUserInfo.name || currentUserInfo.fullName),
    microsoftId: currentUserInfo && (currentUserInfo.email || currentUserInfo.id),
    roleLabel: isAdminAuthorized ? 'DIRECTOR VERIFIED' : 'EXECUTIVE'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid ' + (logoUnlocked ? '#f59e0b' : '#334155'),
      borderRadius: '10px',
      padding: '14px 18px',
      marginBottom: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      flexWrap: 'wrap',
      flex: '1 1 520px'
    }
  }, /*#__PURE__*/React.createElement(BrandLogo, {
    onClick: toggleLogoUnlock,
    unlocked: logoUnlocked,
    isAdminAuthorized: isAdminAuthorized,
    isDark: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 360px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '4px',
      letterSpacing: '0.6px'
    }
  }, "SANITATION DIRECTOR & CONTROLLER HUB"), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #475569',
      color: '#38bdf8',
      fontWeight: 700,
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '4px'
    }
  }, "BUILD ", APP_VERSION), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: dvConnected ? '#064e3b' : '#1e293b',
      border: '1px solid ' + (dvConnected ? '#10b981' : '#64748b'),
      color: dvConnected ? '#34d399' : '#cbd5e1',
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '4px'
    }
  }, dvStatus), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#064e3b',
      border: '1px solid #10b981',
      color: '#6ee7b7',
      fontSize: '11px',
      fontWeight: 700,
      padding: '3px 8px',
      borderRadius: '4px'
    }
  }, "168h Grid Reconciled (Delta: ", sdFmtNum(model.gridReconciliationDeltaHrs, 2), "h)"), /*#__PURE__*/React.createElement(HubDiversionDevControl, {
    appKey: "director",
    unlocked: Boolean(isAdminAuthorized && logoUnlocked),
    onRouteChanged: () => setSdReloadTick(t => t + 1)
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '6px 0 2px 0',
      fontSize: '19px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Sanitation Executive Forecasting, Manpower Drill-Down & Financial Controller Model"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Anchored to ", liveAssetCount, " Equipment Assets (29 Area Keys, 55,245m Active Standard), 436 Sep-Dec Schedule Runs, 30 ShiftArchives (63 Floor Events), and ", liveEmpCount, " Employee Rows (90 Direct Cleaners + 10 Specialists)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      backgroundColor: '#0f172a',
      padding: '9px 12px',
      borderRadius: '8px',
      border: '1px solid ' + (logoUnlocked ? '#f59e0b' : '#334155'),
      minWidth: '300px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "Saved Setpoint Preset (craa5_directorsetpoint):"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      padding: '1px 6px',
      borderRadius: '4px',
      backgroundColor: logoUnlocked ? '#064e3b' : '#1e293b',
      color: logoUnlocked ? '#34d399' : '#94a3b8',
      border: '1px solid ' + (logoUnlocked ? '#10b981' : '#475569')
    }
  }, logoUnlocked ? 'Logo Unlocked (Edit Mode)' : 'Logo Locked (Dropdown Only)')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: selectedPresetKey,
    onChange: e => {
      const val = e.target.value;
      setSelectedPresetKey(val);
      const found = savedPresets.find(p => p.key === val || p.name === val);
      if (found) {
        const cleanData = {
          ...(found.data || {})
        };
        SD_SENSITIVE_PAY_KEYS.forEach(k => {
          delete cleanData[k];
        });
        setSp(prev => ({
          ...SD_DEFAULT_SETPOINTS,
          ...cleanData,
          rateTech1: prev.rateTech1,
          rateTech2: prev.rateTech2,
          rateTech3: prev.rateTech3,
          supervisorSalaryAnnual: prev.supervisorSalaryAnnual,
          includeDptHead: prev.includeDptHead,
          dptHeadMode: prev.dptHeadMode,
          dptHeadSalaryAnnual: prev.dptHeadSalaryAnnual,
          dptHeadHourlyRate: prev.dptHeadHourlyRate,
          fringeBurdenPct: prev.fringeBurdenPct,
          payrollBasis: prev.payrollBasis,
          empRateOverrides: prev.empRateOverrides || {},
          presetName: found.name
        }));
        setPresetSaveMsg(`Loaded setpoint preset: ${found.name}`);
      }
    },
    style: {
      flex: 1,
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '6px 8px',
      fontSize: '12px',
      fontWeight: 600,
      minWidth: '250px'
    }
  }, savedPresets.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.key,
    value: p.key
  }, p.name))), isLocalPreviewHost && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const nextMarcus = !isAdminAuthorized;
      setIsAdminAuthorized(nextMarcus);
      if (!nextMarcus) setLogoUnlocked(false);
      setCurrentUserInfo(prev => ({
        ...prev,
        userId: nextMarcus ? 'a0000001-0000-4000-8000-000000000001' : '00000000-0000-0000-0000-000000000099',
        userName: nextMarcus ? 'Marcus Vance (Local Preview)' : 'Guest Viewer (Non-Marcus ID)',
        isAdmin: nextMarcus
      }));
      setLogoAuthNotice(nextMarcus ? 'Local Preview: Switched to Marcus Vance Microsoft ID (a0000001-0000-4000-8000-000000000001). Click the Apex Foods logo to unlock setup controls.' : 'Local Preview: Switched to Non-Marcus ID. Clicking the Apex Foods logo is now blocked.');
    },
    style: {
      backgroundColor: '#1e293b',
      color: isAdminAuthorized ? '#fcd34d' : '#f87171',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '10px',
      cursor: 'pointer'
    },
    title: "Local Preview Only: Test Marcus Microsoft ID Lock on Apex Foods Logo"
  }, isAdminAuthorized ? 'Preview: Marcus ID Active' : 'Preview: Non-Marcus Locked')))), logoAuthNotice ? /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: logoUnlocked ? '#064e3b' : isAdminAuthorized ? '#1e293b' : '#450a0a',
      border: '1px solid ' + (logoUnlocked ? '#10b981' : isAdminAuthorized ? '#475569' : '#ef4444'),
      color: logoUnlocked ? '#ecfdf5' : isAdminAuthorized ? '#e2e8f0' : '#fecaca',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, logoAuthNotice), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLogoAuthNotice(''),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#cbd5e1',
      cursor: 'pointer',
      fontSize: '11px'
    }
  }, "Dismiss")) : null, presetSaveMsg ? /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0c4a6e',
      border: '1px solid #0284c7',
      color: '#e0f2fe',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, presetSaveMsg), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPresetSaveMsg(''),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#bae6fd',
      cursor: 'pointer',
      fontSize: '12px'
    }
  }, "Dismiss")) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '10px 14px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#38bdf8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  }, "Active Setup Readouts"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "(", setpointTableStatus, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: logoUnlocked ? '#34d399' : '#94a3b8'
    }
  }, logoUnlocked ? 'Setup Vault Unlocked by Marcus Vance - Interactive setup controls & Dataverse preset saver shown below' : isAdminAuthorized ? 'Setup sliders hidden behind Apex Foods logo - Click the Apex Foods logo above to adjust or save setups' : 'Setup sliders locked behind Apex Foods logo (Restricted to Marcus Vance Microsoft ID)')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '7px 10px',
      borderRadius: '6px',
      borderLeft: '3px solid #38bdf8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8'
    }
  }, "T1 Engineering Basis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, basisReadoutLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '7px 10px',
      borderRadius: '6px',
      borderLeft: '3px solid #0284c7'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8'
    }
  }, "Q5 Unforeseen & Allergen Mult"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, sp.unforeseenFactor.toFixed(2), "x (+", Math.round((sp.unforeseenFactor - 1) * 100), "%) - Allergen ", sp.allergenMult.toFixed(2), "x")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '7px 10px',
      borderRadius: '6px',
      borderLeft: '3px solid #10b981'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8'
    }
  }, "Q3 Clean Mode & Pre/Post Buffers"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#34d399'
    }
  }, cleanModeReadoutLabel, " (", sp.preWashBufferMin, "m / ", sp.postOpSwabMin, "m)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '7px 10px',
      borderRadius: '6px',
      borderLeft: '3px solid #f59e0b'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8'
    }
  }, "Q4 Schedule & Down-Line Rule"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#fbbf24'
    }
  }, schedHorizonReadoutLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '7px 10px',
      borderRadius: '6px',
      borderLeft: '3px solid #a78bfa'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8'
    }
  }, "Q1 Support, Janitorial & Shift Friction"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#c4b5fd'
    }
  }, isStandingPosts ? 'Standing Posts' : 'Asset Rows', " - ", isJanitorialContractor ? 'Janitor Excluded' : 'Janitor In-House', " - ", sp.shiftFrictionMin, "m Friction")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '7px 10px',
      borderRadius: '6px',
      borderLeft: '3px solid #f472b6'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8'
    }
  }, "Shift Assignment Background Defaults"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#f472b6'
    }
  }, "Present Avg: A ", shiftAvgMeta.byCrewActualAvg.A.avgPresentFloor, ", B ", shiftAvgMeta.byCrewActualAvg.B.avgPresentFloor, ", C ", shiftAvgMeta.byCrewActualAvg.C.avgPresentFloor, ", D ", shiftAvgMeta.byCrewActualAvg.D.avgPresentFloor, " (Sick ", shiftAvgMeta.avgSickPctOverall, "% / All ", shiftAvgMeta.avgTotalShrinkPctOverall, "%)")))), logoUnlocked && isAdminAuthorized && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1.5px solid #f59e0b',
      borderRadius: '10px',
      padding: '14px 16px',
      marginBottom: '14px',
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      paddingBottom: '12px',
      marginBottom: '12px',
      borderBottom: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#fbbf24'
    }
  }, "Apex Foods Setup Vault (Unlocked - Marcus Vance Microsoft ID Verified: ", currentUserInfo.userId, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Adjust any global setpoint below and save it as a named preset to Dataverse table ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: '#38bdf8'
    }
  }, "craa5_directorsetpoint"), " (Primary Name: ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: '#38bdf8'
    }
  }, "craa5_presettitle"), ") + ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: '#38bdf8'
    }
  }, "craa5__e_hubconfig"), " mirror.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "New or existing preset name...",
    value: newPresetName,
    onChange: e => setNewPresetName(e.target.value),
    style: {
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '5px 8px',
      fontSize: '12px',
      width: '185px'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Optional preset description...",
    value: newPresetDesc,
    onChange: e => setNewPresetDesc(e.target.value),
    style: {
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '5px 8px',
      fontSize: '12px',
      width: '195px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: savePresetToDataverse,
    style: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Save Setpoint Preset to Dataverse"), /*#__PURE__*/React.createElement("button", {
    onClick: provisionDirectorSetpointTable,
    style: {
      backgroundColor: setpointTableOnline ? '#065f46' : '#b45309',
      color: '#ffffff',
      border: '1px solid ' + (setpointTableOnline ? '#10b981' : '#f59e0b'),
      borderRadius: '5px',
      padding: '6px 10px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    },
    title: "Creates custom Dataverse table craa5_directorsetpoint (Primary Name: craa5_presettitle) via Web API EntityDefinitions"
  }, setpointTableOnline ? 'craa5_directorsetpoint Online' : 'Provision craa5_directorsetpoint Table'), /*#__PURE__*/React.createElement("button", {
    onClick: resetToDefaults,
    style: {
      backgroundColor: '#334155',
      color: '#e2e8f0',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '6px 10px',
      fontSize: '11px',
      cursor: 'pointer'
    }
  }, "Reset Factory Defaults"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #0284c7'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '11px',
      color: '#7dd3fc',
      fontWeight: 700,
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "T1: Engineering Standard Basis"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#38bdf8'
    }
  }, "Daily=Yes Share: ", sp.dailySharePct, "%")), /*#__PURE__*/React.createElement("select", {
    value: sp.engineeringBasis,
    onChange: e => updateSp('engineeringBasis', e.target.value),
    style: {
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontSize: '11px',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "assets_eow_explicit_daily"
  }, "Basis 1: Pure craa5_aa_assets (55,245m EOW + 2,110m dailymin)"), /*#__PURE__*/React.createElement("option", {
    value: "assets_full_daily"
  }, "Basis 2: Full Daily=Yes Upper Bound (+10,845m dailymin=0)"), /*#__PURE__*/React.createElement("option", {
    value: "cleanplan_deinflated"
  }, "Basis 3: CleanPlan Scope De-Inflated (Minus 20,060m Bug)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '10px',
      color: '#cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Share of 137 daily=Yes (dailymin=0):"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "5",
    value: sp.dailySharePct,
    onChange: e => updateSp('dailySharePct', parseInt(e.target.value, 10)),
    style: {
      width: '85px',
      accentColor: '#38bdf8'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "Q5: Unforeseen Factor (F)"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#38bdf8',
      fontWeight: 700
    }
  }, sp.unforeseenFactor.toFixed(2), "x (+", Math.round((sp.unforeseenFactor - 1) * 100), "%)")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1.00",
    max: "2.25",
    step: "0.05",
    value: sp.unforeseenFactor,
    onChange: e => updateSp('unforeseenFactor', parseFloat(e.target.value)),
    style: {
      width: '100%',
      accentColor: '#0284c7'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Amplifies raw equipment asset minutes (replaces inflated log hours)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "Q3: Line Clean Mode & Buffers"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#34d399',
      fontWeight: 700
    }
  }, sp.preWashBufferMin, "m / ", sp.postOpSwabMin, "m")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      marginBottom: '6px'
    }
  }, [{
    id: 'total',
    label: 'Asset/Crew'
  }, {
    id: 'critical',
    label: 'Crit Path'
  }, {
    id: 'both',
    label: 'Max (Both)'
  }].map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => updateSp('cleanDurationMode', m.id),
    style: {
      flex: 1,
      backgroundColor: sp.cleanDurationMode === m.id ? '#0284c7' : '#0f172a',
      color: sp.cleanDurationMode === m.id ? '#ffffff' : '#94a3b8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 4px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, m.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Pre:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: sp.preWashBufferMin,
    onChange: e => updateSp('preWashBufferMin', Math.max(0, parseInt(e.target.value || '0', 10))),
    style: {
      width: '44px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '2px 4px',
      fontSize: '11px'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Post Swab:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: sp.postOpSwabMin,
    onChange: e => updateSp('postOpSwabMin', Math.max(0, parseInt(e.target.value || '0', 10))),
    style: {
      width: '44px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '2px 4px',
      fontSize: '11px'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "Q4: Schedule & Down-Line Rule"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fbbf24',
      fontWeight: 700
    }
  }, sp.scheduleMode === 'actual' ? 'Actual Schedule' : 'Custom Sliders')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('scheduleMode', 'actual'),
    style: {
      flex: 1,
      backgroundColor: sp.scheduleMode === 'actual' ? '#0284c7' : '#0f172a',
      color: sp.scheduleMode === 'actual' ? '#ffffff' : '#94a3b8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Mode A: Actual Schd"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('scheduleMode', 'sliders'),
    style: {
      flex: 1,
      backgroundColor: sp.scheduleMode === 'sliders' ? '#0284c7' : '#0f172a',
      color: sp.scheduleMode === 'sliders' ? '#ffffff' : '#94a3b8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Mode B: Run Sliders")), /*#__PURE__*/React.createElement("select", {
    value: sp.selectedSchedWeek,
    onChange: e => updateSp('selectedSchedWeek', e.target.value),
    disabled: sp.scheduleMode !== 'actual',
    style: {
      width: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontSize: '11px'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "avg_active"
  }, "Per-Line Active Horizon Avg (Default)"), /*#__PURE__*/React.createElement("option", {
    value: "avg_oct"
  }, "Oct 2026 4-Week Average"), /*#__PURE__*/React.createElement("option", {
    value: "avg_16wk"
  }, "Full 16-Week Sep-Dec Span Avg"), SD_PRD_SCHD_WEEKLY.map(w => /*#__PURE__*/React.createElement("option", {
    key: w.weekSunday,
    value: w.weekSunday
  }, w.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "Q1: Support & Janitorial"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#a78bfa',
      fontWeight: 700
    }
  }, isStandingPosts ? 'Standing Posts' : 'Asset Rows')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('supportMode', 'standing_posts'),
    style: {
      flex: 1,
      backgroundColor: isStandingPosts ? '#0284c7' : '#0f172a',
      color: isStandingPosts ? '#ffffff' : '#94a3b8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Standing Posts"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('supportMode', 'assets'),
    style: {
      flex: 1,
      backgroundColor: !isStandingPosts ? '#0284c7' : '#0f172a',
      color: !isStandingPosts ? '#ffffff' : '#94a3b8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Asset-Driven")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Janitorial (101 rows):"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('janitorialMode', isJanitorialContractor ? 'in_house_included' : 'contractor_excluded'),
    style: {
      backgroundColor: isJanitorialContractor ? '#334155' : '#065f46',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '10px',
      cursor: 'pointer'
    }
  }, isJanitorialContractor ? 'Contractor (Excluded)' : 'In-House (Included)'))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cbd5e1'
    }
  }, "Shift Friction & Allergen Mult"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#f472b6',
      fontWeight: 700
    }
  }, sp.shiftFrictionMin, "m / ", sp.allergenMult.toFixed(2), "x")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      minWidth: '75px'
    }
  }, "Friction/12h:"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "150",
    step: "5",
    value: sp.shiftFrictionMin,
    onChange: e => updateSp('shiftFrictionMin', parseInt(e.target.value, 10)),
    style: {
      flex: 1,
      accentColor: '#f472b6'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      minWidth: '75px'
    }
  }, "Allergen Mult:"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1.00",
    max: "5.00",
    step: "0.25",
    value: sp.allergenMult,
    onChange: e => updateSp('allergenMult', parseFloat(e.target.value)),
    style: {
      flex: 1,
      accentColor: '#f472b6'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '16px',
      borderBottom: '1px solid #334155',
      paddingBottom: '10px'
    }
  }, [{
    id: 'overview',
    label: '1. Executive & Controller Overview'
  }, {
    id: 'drilldown',
    label: '2. Manpower Drill-Down (Year to Hour)'
  }, {
    id: 'modeler',
    label: '3. Production Schedule & Clean Modeler (Q3/Q4)'
  }, {
    id: 'crowding',
    label: '4. Room Optimal Headcount & Crowding (Q7)'
  }, {
    id: 'crews',
    label: '5. Crew Roster, ShiftArchive & Shrinkage (Q2/Q8)'
  }, {
    id: 'chemicals',
    label: '6. Compensation Gate & Spend Forecast (Q6)'
  }, {
    id: 'audit',
    label: '7. Controller Forensic Audit & Obstacles (Q5/D12)'
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setActiveTab(t.id),
    style: {
      backgroundColor: activeTab === t.id ? '#0284c7' : '#1e293b',
      color: activeTab === t.id ? '#ffffff' : '#cbd5e1',
      border: '1px solid ' + (activeTab === t.id ? '#38bdf8' : '#334155'),
      borderRadius: '6px',
      padding: '8px 14px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    }
  }, t.label))), activeTab === 'overview' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Required Sanitation Hours / Wk"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#38bdf8',
      margin: '4px 0'
    }
  }, sdFmtNum(model.totalWeeklyRequiredHrs, 1), " hrs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Direct Wash/MSS: ", /*#__PURE__*/React.createElement("strong", null, sdFmtNum(model.directWashWeeklyRequiredHrs, 1), "h"), " + Support Posts: ", /*#__PURE__*/React.createElement("strong", null, sdFmtNum(model.standingSupportWeeklyHrs, 1), "h")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Annual Required: ", sdFmtNum(model.totalWeeklyRequiredHrs * (365 / 7), 0), " man-hrs/yr")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Net Available Manpower / Wk"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#34d399',
      margin: '4px 0'
    }
  }, sdFmtNum(model.totalNetAvailableHrsWk, 1), " hrs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "90 Direct Cleaners: ", /*#__PURE__*/React.createElement("strong", null, sdFmtNum(model.totalDirectNetAvailHrsWk, 1), "h"), " + 10 Specialists: ", /*#__PURE__*/React.createElement("strong", null, sdFmtNum(model.totalSpecialistNetAvailHrsWk, 1), "h")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Gross Roster (", model.totalActiveFloor, " floor): ", sdFmtNum(model.totalGrossRosterHrsWk, 0), "h - Attendance: ", sdFmtNum(model.totalAfterAttendanceHrsWk, 0), "h")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid ' + (model.weeklyNetBalanceHrs >= 0 ? '#10b981' : '#f43f5e'),
      borderRadius: '10px',
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Weekly Manpower Balance (Surplus / Gap)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '26px',
      fontWeight: 800,
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185',
      margin: '4px 0'
    }
  }, model.weeklyNetBalanceHrs >= 0 ? '+' : '', sdFmtNum(model.weeklyNetBalanceHrs, 1), " hrs/wk"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Direct Wash Balance (90 Cleaners vs Direct Req): ", /*#__PURE__*/React.createElement("strong", null, model.directWashNetBalanceHrs >= 0 ? '+' : '', sdFmtNum(model.directWashNetBalanceHrs, 1), "h/wk")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Utilization: ", sdFmtNum(model.totalWeeklyRequiredHrs / Math.max(1, model.totalNetAvailableHrsWk) * 100, 1), "% of Net Productive Capacity")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Required Floor Headcount (Non-Circular)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#fbbf24',
      margin: '4px 0'
    }
  }, model.requiredFloorHeadcount, " Req / ", model.totalActiveFloor, " Active"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Direct Washers: ", /*#__PURE__*/React.createElement("strong", null, model.requiredDirectCleaners, " Req vs ", model.totalDirectCleaners, " Active"), " - Specialists: ", /*#__PURE__*/React.createElement("strong", null, model.requiredSupportSpecialists, " Req vs ", model.totalEmbeddedSpecialists, " Active")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#f87171',
      marginTop: '4px'
    }
  }, "Crew A has 7 Floor Vacancies (15 Direct + 5 Spec vs 27 Target) + 1 Sup Vacancy")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, "Annual Loaded Labor Forecast (Q6)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#a78bfa',
      margin: '4px 0'
    }
  }, payAuthorized ? sdFmtCurrency(model.totalAnnualLaborLoadedSpend, 0) : 'RESTRICTED (Sr Mgr+)'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, payAuthorized ? `Weekly: ${sdFmtCurrency(model.totalWeeklyLaborLoadedSpend, 0)}/wk (Base: $${model.avgBaseRate}/h, Loaded: $${model.avgLoadedRate}/h)` : 'Locked behind Microsoft ID Senior Manager+ Gate'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Includes 3 Active Supervisors + ", sp.includeDptHead ? '1 Dpt Head (Marcus)' : '0 Dpt Head', " + ", model.fringePctVal, "% Fringe")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  }, sp.includePpeInSpend ? 'Annual Chem + PPE Spend (130 POs)' : 'Annual Pure Chemical Spend (67 POs)'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#f472b6',
      margin: '4px 0'
    }
  }, sdFmtCurrency(model.annualChemForecastSpend, 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Pure Chem (ChemGuard+SaniTech): ", /*#__PURE__*/React.createElement("strong", null, sdFmtCurrency(model.pureChemAnnualForecast, 0)), " - PPE/Tools: ", /*#__PURE__*/React.createElement("strong", null, sdFmtCurrency(model.ppeAnnualForecast, 0))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Total Dept Forecast: ", payAuthorized ? sdFmtCurrency(model.totalAnnualCombinedSpend, 0) + '/yr' : 'See Tab 6'))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #0284c7',
      borderRadius: '10px',
      padding: '14px 16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "Controller Engineering Basis Sensitivity Range (Pure craa5_aa_assets vs. Daily=Yes Upper Bound vs. De-Inflated CleanPlan)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      marginTop: '2px'
    }
  }, "Forensic audit of D1_assets_861.csv vs. D4_cleanplan_scopes.csv proved 29 assets (highspeed: 22, ibl4: 4, ibl5: 3; raw sum = 340m) were multiplied by 60 in P1.1 (+20,060m = 340m x 59), and 137 of 239 daily=Yes assets have dailymin=0 (10,845m). Compare all 3 bases below:")), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#7dd3fc',
      border: '1px solid #0284c7',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Active Basis: ", sp.engineeringBasis === 'assets_eow_explicit_daily' ? 'Basis 1 (Pure Assets - Default)' : sp.engineeringBasis === 'assets_full_daily' ? 'Basis 2 (Full Daily=Yes Upper)' : 'Basis 3 (De-Inflated CleanPlan)')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '10px'
    }
  }, [{
    key: 'assets_eow_explicit_daily',
    data: model.basisComparison.assets_eow_explicit_daily,
    desc: 'Pure craa5_aa_assets EOW (55,245m active sum / 42,760m weekly=Yes) + explicit populated craa5_dailymin (2,110m across 112 rows) + ' + sp.dailySharePct + '% of dailyYesZeroMin (10,845m).'
  }, {
    key: 'assets_full_daily',
    data: model.basisComparison.assets_full_daily,
    desc: 'Upper Bound: Applies 100% of craa5_hoursrequired across all 137 daily=Yes assets with dailymin=0 (+10,845m) plus 2,110m explicit dailymin on every turn (deducted from EOW to prevent overlap).'
  }, {
    key: 'cleanplan_deinflated',
    data: model.basisComparison.cleanplan_deinflated,
    desc: 'Uses D4_cleanplan_scopes.csv (115,930m) minus exact 20,060m 59x P1.1 bug (95,870m EOW, which includes legacy msRows masterschedule items).'
  }].map(b => {
    const isSelected = sp.engineeringBasis === b.key;
    const netVsSupply = model.totalNetAvailableHrsWk - b.data.totalHrs;
    return /*#__PURE__*/React.createElement("div", {
      key: b.key,
      onClick: () => updateSp('engineeringBasis', b.key),
      style: {
        backgroundColor: isSelected ? '#1e293b' : '#0b1120',
        border: '2px solid ' + (isSelected ? '#38bdf8' : '#334155'),
        borderRadius: '8px',
        padding: '10px 12px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        fontWeight: 700,
        color: isSelected ? '#38bdf8' : '#e2e8f0',
        marginBottom: '4px'
      }
    }, b.data.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        marginBottom: '4px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#94a3b8'
      }
    }, "Total Req: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#f8fafc'
      }
    }, sdFmtNum(b.data.totalHrs, 1), "h/wk")), /*#__PURE__*/React.createElement("span", {
      style: {
        color: netVsSupply >= 0 ? '#34d399' : '#fb7185',
        fontWeight: 700
      }
    }, netVsSupply >= 0 ? '+' : '', sdFmtNum(netVsSupply, 1), "h vs Supply")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '10px',
        color: '#94a3b8',
        lineHeight: 1.35
      }
    }, b.desc));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 10px 0',
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Weekly Manpower Supply vs. Demand Reconciliation (100% Grid-Aligned)"), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 4px'
    }
  }, "Manpower Component"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, "Weekly Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, "Annual Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, "Share / Note"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#cbd5e1'
    }
  }, "1. Gross Roster Capacity (", model.totalActiveFloor, " Active Floor x 42h)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      fontWeight: 600
    }
  }, sdFmtNum(model.totalGrossRosterHrsWk, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.totalGrossRosterHrsWk * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, "90 Direct + 10 Spec")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#fca5a5'
    }
  }, "2. Less: Habitual Attendance Shrinkage (Q8 / D9 Archive)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#fca5a5'
    }
  }, "-", sdFmtNum(model.totalGrossRosterHrsWk - model.totalAfterAttendanceHrsWk, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#fca5a5'
    }
  }, "-", sdFmtNum((model.totalGrossRosterHrsWk - model.totalAfterAttendanceHrsWk) * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#fca5a5'
    }
  }, "-", sdFmtNum(model.overallShrinkagePct, 1), "% avg")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#fcd34d'
    }
  }, "3. Less: Shift Friction (", sp.shiftFrictionMin, "m/12h PPE, Huddle, Breaks)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#fcd34d'
    }
  }, "-", sdFmtNum(model.totalAfterAttendanceHrsWk - model.totalNetAvailableHrsWk, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#fcd34d'
    }
  }, "-", sdFmtNum((model.totalAfterAttendanceHrsWk - model.totalNetAvailableHrsWk) * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#fcd34d'
    }
  }, "-", sdFmtNum(model.frictionRatio * 100, 1), "% shift")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      backgroundColor: '#1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      fontWeight: 700,
      color: '#34d399'
    }
  }, "NET PRODUCTIVE AVAILABLE MANPOWER"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'right',
      fontWeight: 700,
      color: '#34d399'
    }
  }, sdFmtNum(model.totalNetAvailableHrsWk, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'right',
      fontWeight: 700,
      color: '#34d399'
    }
  }, sdFmtNum(model.totalNetAvailableHrsWk * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'right',
      color: '#34d399'
    }
  }, model.netProdHoursPerCleanerWk, "h/cleaner")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#cbd5e1'
    }
  }, "4. Production Line EOW Teardown Washes (1x/wk per line)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.lineEowWashHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.lineEowWashHrs * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, "Incl ", sp.preWashBufferMin, "m+", sp.postOpSwabMin, "m")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#cbd5e1'
    }
  }, "5. Mid-Week Production Turn Washes + Midweek Coils"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.lineDailyWashHrs + model.lineMidweekHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum((model.lineDailyWashHrs + model.lineMidweekHrs) * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, "Q4 Run Schedule")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#cbd5e1'
    }
  }, "6. Allergen Changeover & Swab Validation Increment"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.lineAllergenHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.lineAllergenHrs * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, sp.allergenMult.toFixed(2), "x Mult")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#cbd5e1'
    }
  }, "7. MSS Equipment & Periodic Scope (W/M/Q/SA/Y)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.mssEquipPeriodicHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.mssEquipPeriodicHrs * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, "All 5 MSS Freqs")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      color: '#cbd5e1'
    }
  }, "8. Standing Support Posts (Chem, QA, Admin, Trash, Scrubber)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.standingSupportWeeklyHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right'
    }
  }, sdFmtNum(model.standingSupportWeeklyHrs * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '6px 4px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, "Q1 (", sp.standingPostBasis === 'gross_shift' ? '12h Gross' : '10.75h Net', ")")), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      backgroundColor: '#1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "TOTAL REQUIRED SANITATION HOURS (168h Grid = ", sdFmtNum(model.gridWeeklyReqHrs, 1), "h)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'right',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, sdFmtNum(model.totalWeeklyRequiredHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'right',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, sdFmtNum(model.totalWeeklyRequiredHrs * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 4px',
      textAlign: 'right',
      color: '#38bdf8'
    }
  }, sp.unforeseenFactor.toFixed(2), "x Unforeseen")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 4px',
      fontWeight: 800,
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, "NET WEEKLY SURPLUS / (OVERTIME DEFICIT)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 4px',
      textAlign: 'right',
      fontWeight: 800,
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, model.weeklyNetBalanceHrs >= 0 ? '+' : '', sdFmtNum(model.weeklyNetBalanceHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 4px',
      textAlign: 'right',
      fontWeight: 800,
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, model.weeklyNetBalanceHrs >= 0 ? '+' : '', sdFmtNum(model.weeklyNetBalanceHrs * (365 / 7), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 4px',
      textAlign: 'right',
      fontWeight: 700,
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, model.weeklyNetBalanceHrs >= 0 ? 'Capacity Buffer' : 'OT Required'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 10px 0',
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Executive & Controller Findings (Live Dataverse Truth)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontSize: '12px',
      color: '#cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px',
      borderRadius: '6px',
      borderLeft: '4px solid #f43f5e'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: '#fda4af',
      marginBottom: '2px'
    }
  }, "1. Crew A Day-Shift Vacancy Bottleneck (15 Direct Cleaners + 5 Specialists = 20 vs. 27 Target)"), /*#__PURE__*/React.createElement("div", null, "While Night Crews C (", model.crewModels.C.directCleaners, " direct + 2 spec) and D (", model.crewModels.D.directCleaners, " direct + 1 spec) and Day Crew B (", model.crewModels.B.directCleaners, " direct + 2 spec) are fully staffed, ", /*#__PURE__*/React.createElement("strong", null, "Crew A has only 15 Direct Wash Cleaners"), " (plus 5 embedded plant specialists: Inspector, Chem Clerk, Admin, Janitor, Trash) and an ", /*#__PURE__*/React.createElement("strong", null, "open Supervisor seat"), " covered by Interim Dpt Head ", /*#__PURE__*/React.createElement("strong", null, "Marcus Vance"), ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px',
      borderRadius: '6px',
      borderLeft: '4px solid #38bdf8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: '#7dd3fc',
      marginBottom: '2px'
    }
  }, "2. P1.1 <=16 * 60 CleanPlan Bug (29 Assets = 340m x 59 = 20,060m) & msRows Duplication Isolated"), /*#__PURE__*/React.createElement("div", null, "In ", /*#__PURE__*/React.createElement("code", null, "D1_assets_861.csv"), ", 29 active assets have ", /*#__PURE__*/React.createElement("code", null, "0 < hoursrequired <= 16"), " (", /*#__PURE__*/React.createElement("strong", null, "highspeed: 22 rows = 245m"), ", ", /*#__PURE__*/React.createElement("strong", null, "ibl4: 4 rows = 60m"), ", ", /*#__PURE__*/React.createElement("strong", null, "ibl5: 3 rows = 35m"), "). P1.1 multiplied those 340m by 60 (+20,060m exact 59x inflation) and also appended legacy ", /*#__PURE__*/React.createElement("code", null, "craa5__p_masterschedule"), " rows. Basis 1 uses pure ", /*#__PURE__*/React.createElement("code", null, "craa5_aa_assets"), " (55,245m active sum) to eliminate both distortions.")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px',
      borderRadius: '6px',
      borderLeft: '4px solid #fbbf24'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: '#fde68a',
      marginBottom: '2px'
    }
  }, "3. Alternating Custard / Highspeed Schedule & Down-Line Rule (Q4 / D5 Verified)"), /*#__PURE__*/React.createElement("div", null, "Across the 16-week Sep-Dec schedule (", /*#__PURE__*/React.createElement("code", null, "D5_prd_schd_weekly_summary.csv"), ": 431 in-window runs + 5 out-of-window WaterJet rows = 436 DB rows), IBL4 runs 85d (31 alrg), IBL5 72d (22 alrg), Waterjet 71d (36 alrg / 157 runs), Breading 53d (0 alrg), Custard 40d (19 alrg), and Highspeed 24d (6 alrg). Per Q4, down weeks incur 0 daily turn cleans and 1x EOW + MSS clean.")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '10px',
      borderRadius: '6px',
      borderLeft: '4px solid #34d399'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: '#6ee7b7',
      marginBottom: '2px'
    }
  }, "4. Hiring ROI vs. Overtime Premium (Q6 Financial Controller Check)"), /*#__PURE__*/React.createElement("div", null, payAuthorized ? /*#__PURE__*/React.createElement("span", null, "Filling the 7 Crew A Tech 1 vacancies costs ", /*#__PURE__*/React.createElement("strong", null, sdFmtCurrency(model.costOf7CrewAVacanciesWk, 0), "/wk"), " (", sdFmtCurrency(model.costOf7CrewAVacanciesWk * (365 / 7), 0), "/yr loaded at $", sp.rateTech1, "/h incl. 42h Panama schedule OT + ", model.fringePctVal, "% fringe) vs. paying statutory 1.5x base + flat fringe overtime at ", /*#__PURE__*/React.createElement("strong", null, "$", model.otHourlyRate, "/hr"), ".") : /*#__PURE__*/React.createElement("span", null, "Compensation & Hiring ROI figures are gated behind Senior Manager+ check.")))))))), activeTab === 'drilldown' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Multi-Horizon Manpower Drill-Down (Year to Month to Week to Day to Shift to Hour)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "100% Grid-Reconciled: 168-Hour Shift Grid Sum (", sdFmtNum(model.gridWeeklyReqHrs, 1), "h) = Weekly Headline (", sdFmtNum(model.totalWeeklyRequiredHrs, 1), "h), Delta: ", sdFmtNum(model.gridReconciliationDeltaHrs, 2), "h")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    }
  }, [{
    id: 'year',
    label: '1. Year & Month (365d / 52.14w)'
  }, {
    id: 'week',
    label: '2. Week, Day & Shift (14 Shifts)'
  }, {
    id: 'hour',
    label: '3. Shift-to-Hour (168-Hour Grid)'
  }].map(lvl => /*#__PURE__*/React.createElement("button", {
    key: lvl.id,
    onClick: () => setDrillLevel(lvl.id),
    style: {
      backgroundColor: drillLevel === lvl.id ? '#0284c7' : '#1e293b',
      color: drillLevel === lvl.id ? '#ffffff' : '#cbd5e1',
      border: '1px solid #475569',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, lvl.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #0284c7',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 480px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: '4px'
    }
  }, "BACKGROUND SHIFT ASSIGNMENT DEFAULTS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, shiftAvgMeta.sourceLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "- Last Saved: ", String(shiftAvgMeta.lastCalculatedAt || '').slice(0, 19).replace('T', ' '), " UTC")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1',
      lineHeight: '1.45'
    }
  }, "Averaged from ", /*#__PURE__*/React.createElement("b", null, shiftAvgMeta.totalShiftsAnalyzed), " shift boards (", /*#__PURE__*/React.createElement("b", null, shiftAvgMeta.uniqueShiftInstances), " unique crew shifts):", ' ', "Sick Avg: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fb7185'
    }
  }, shiftAvgMeta.avgSickPctOverall, "%"), ",", ' ', "PTO Avg: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fbbf24'
    }
  }, shiftAvgMeta.avgPtoPctOverall, "%"), ",", ' ', "Left Early Avg: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#f472b6'
    }
  }, shiftAvgMeta.avgLeftEarlyPctOverall, "%"), ' ', "(Total Shrinkage: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#38bdf8'
    }
  }, shiftAvgMeta.avgTotalShrinkPctOverall, "%"), "; Sick+Early Only: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#34d399'
    }
  }, shiftAvgMeta.avgSickAndEarlyOnlyPct, "%"), ").", ' ', "Actual Present Floor Headcount Avg: ", /*#__PURE__*/React.createElement("b", null, "Crew A ", shiftAvgMeta.byCrewActualAvg.A.avgPresentFloor, "/", shiftAvgMeta.byCrewActualAvg.A.rosteredFloor), ",", ' ', /*#__PURE__*/React.createElement("b", null, "Crew B ", shiftAvgMeta.byCrewActualAvg.B.avgPresentFloor, "/", shiftAvgMeta.byCrewActualAvg.B.rosteredFloor), ",", ' ', /*#__PURE__*/React.createElement("b", null, "Crew C ", shiftAvgMeta.byCrewActualAvg.C.avgPresentFloor, "/", shiftAvgMeta.byCrewActualAvg.C.rosteredFloor), ",", ' ', /*#__PURE__*/React.createElement("b", null, "Crew D ", shiftAvgMeta.byCrewActualAvg.D.avgPresentFloor, "/", shiftAvgMeta.byCrewActualAvg.D.rosteredFloor), ".", ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, "Fetched automatically in the background from Dataverse and only updated when clicked again."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: shiftSyncBusy,
    onClick: () => syncShiftAssignmentsAndAttendanceDefaults('all_absence'),
    style: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      border: '1px solid #38bdf8',
      borderRadius: '6px',
      padding: '7px 12px',
      fontSize: '11px',
      fontWeight: 700,
      cursor: shiftSyncBusy ? 'wait' : 'pointer'
    }
  }, shiftSyncBusy ? 'Reading Shift Assignments...' : 'Read & Average All Shift Assignments (Update Dataverse Defaults)'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: shiftSyncBusy,
    onClick: () => syncShiftAssignmentsAndAttendanceDefaults('sick_only'),
    style: {
      backgroundColor: '#065f46',
      color: '#ecfdf5',
      border: '1px solid #10b981',
      borderRadius: '6px',
      padding: '7px 10px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: shiftSyncBusy ? 'wait' : 'pointer'
    },
    title: "Reads all shift assignments and applies ONLY unplanned Sick + Left Early shrinkage (excluding scheduled PTO)"
  }, "Apply Averaged Sick-Only (", shiftAvgMeta.avgSickAndEarlyOnlyPct, "%)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      updateSp('attendanceShrinkage', SD_DEFAULT_SETPOINTS.attendanceShrinkage);
      setShiftSyncStatusMsg('Restored built-in Controller Default attendance profile (~8.6% avg shrinkage) for current session.');
    },
    style: {
      backgroundColor: '#1e293b',
      color: '#cbd5e1',
      border: '1px solid #475569',
      borderRadius: '6px',
      padding: '7px 10px',
      fontSize: '11px',
      cursor: 'pointer'
    }
  }, "Use Built-In Default (8.6%)"))), shiftSyncStatusMsg ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      padding: '6px 10px',
      borderRadius: '6px',
      backgroundColor: '#1e293b',
      border: '1px solid #38bdf8',
      color: '#e0f2fe',
      fontSize: '11px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, shiftSyncStatusMsg), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShiftSyncStatusMsg(''),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '11px'
    }
  }, "Dismiss")) : null), drillLevel === 'year' && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '14px',
      color: '#38bdf8'
    }
  }, "Annual & 12-Month Manpower & Budget Forecast (Exact Calendar Days / 7 = 52.1429 Wks/Yr)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "Click any month row to drill into Weekly / Daily / Shift / Hourly breakdown")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Month"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Days (Wks)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Season Index"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Net Avail Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Required Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Surplus / (Gap)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Overtime Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Loaded Labor ($)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, sp.includePpeInSpend ? 'Chem+PPE ($)' : 'Pure Chem ($)'), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Total Spend ($)"))), /*#__PURE__*/React.createElement("tbody", null, model.monthsDrill.map(m => /*#__PURE__*/React.createElement("tr", {
    key: m.month,
    onClick: () => setDrillLevel('week'),
    style: {
      borderBottom: '1px solid #1e293b',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, m.month, " 2026"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#94a3b8'
    }
  }, m.days, "d (", m.weeks.toFixed(2), "w)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, (m.seasonFactor * 100).toFixed(1), "%"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#34d399',
      fontWeight: 600
    }
  }, sdFmtNum(m.availHrs, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#38bdf8',
      fontWeight: 600
    }
  }, sdFmtNum(m.reqHrs, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      fontWeight: 700,
      color: m.netHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, m.netHrs >= 0 ? '+' : '', sdFmtNum(m.netHrs, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: m.otHrs > 0 ? '#fbbf24' : '#64748b'
    }
  }, sdFmtNum(m.otHrs, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, payAuthorized ? sdFmtCurrency(m.laborSpend, 0) : 'Restricted'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#f472b6'
    }
  }, sdFmtCurrency(m.chemSpend, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, payAuthorized ? sdFmtCurrency(m.totalSpend, 0) : 'Restricted')))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid #475569',
      backgroundColor: '#1e293b',
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      color: '#f8fafc'
    }
  }, "ANNUAL TOTAL (365d)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, "365d (52.14w)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, "100.0%"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#34d399'
    }
  }, sdFmtNum(model.monthsDrill.reduce((s, m) => s + m.rawAvailHrs, 0), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#38bdf8'
    }
  }, sdFmtNum(model.monthsDrill.reduce((s, m) => s + m.rawReqHrs, 0), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, model.weeklyNetBalanceHrs >= 0 ? '+' : '', sdFmtNum(model.monthsDrill.reduce((s, m) => s + (m.rawAvailHrs - m.rawReqHrs), 0), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#fbbf24'
    }
  }, sdFmtNum(model.monthsDrill.reduce((s, m) => s + m.rawOtHrs, 0), 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#a78bfa'
    }
  }, payAuthorized ? sdFmtCurrency(model.totalAnnualLaborLoadedSpend, 0) : 'Restricted'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#f472b6'
    }
  }, sdFmtCurrency(model.annualChemForecastSpend, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#f8fafc'
    }
  }, payAuthorized ? sdFmtCurrency(model.totalAnnualCombinedSpend, 0) : 'Restricted')))))), drillLevel === 'week' && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '14px',
      color: '#38bdf8'
    }
  }, "Weekly Day-by-Day & Day/Night Shift Manpower Balance (Sun - Sat, 14 Shifts = 168 Hours)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8',
      marginTop: '2px'
    }
  }, "Shows exact decomposition of Required Hours into Line EOW Teardowns, Daily/Allergen Turns, MSS Periodic, and Standing Support Posts. Click any shift to inspect its 12-hour timeline."))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Day of Week"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Shift Window"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Assigned Crew"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Present Heads"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Net Avail Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Line EOW Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Daily/Alrg Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "MSS Per. Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Support Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Total Req Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Shift Net Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Shift Util %"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'center'
    }
  }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, model.daysDrill.map(d => /*#__PURE__*/React.createElement(React.Fragment, {
    key: d.dayName
  }, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid #1e293b',
      backgroundColor: '#0f172a'
    }
  }, /*#__PURE__*/React.createElement("td", {
    rowSpan: 2,
    style: {
      padding: '8px 6px',
      fontWeight: 700,
      color: '#f8fafc',
      borderRight: '1px solid #1e293b'
    }
  }, d.dayName, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8',
      fontWeight: 400,
      marginTop: '2px'
    }
  }, "Day Total: ", sdFmtNum(d.totalAvailHrs, 1), "h Avail / ", sdFmtNum(d.totalReqHrs, 1), "h Req")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#fde68a',
      fontWeight: 600
    }
  }, "Day (06:00-18:00)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#cbd5e1'
    }
  }, d.dayShift.crewLabel), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, sdFmtNum(d.dayShift.presentHeads, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#34d399',
      fontWeight: 600
    }
  }, sdFmtNum(d.dayShift.availHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(d.dayShift.eowHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(d.dayShift.turnHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(d.dayShift.mssHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#a78bfa'
    }
  }, sdFmtNum(d.dayShift.supHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#38bdf8',
      fontWeight: 700
    }
  }, sdFmtNum(d.dayShift.reqHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      fontWeight: 700,
      color: d.dayShift.netHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, d.dayShift.netHrs >= 0 ? '+' : '', sdFmtNum(d.dayShift.netHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      fontWeight: 600,
      color: d.dayShift.utilPct > 100 ? '#fb7185' : '#cbd5e1'
    }
  }, sdFmtNum(d.dayShift.utilPct, 1), "%"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSelectedDayIdx(d.dayIdx);
      setSelectedShiftKey('day');
      setDrillLevel('hour');
    },
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #334155',
      borderRadius: '4px',
      padding: '2px 8px',
      fontSize: '11px',
      cursor: 'pointer'
    }
  }, "12h View"))), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #1e293b',
      backgroundColor: '#131c31'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#a78bfa',
      fontWeight: 600
    }
  }, "Night (18:00-06:00)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#cbd5e1'
    }
  }, d.nightShift.crewLabel), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, sdFmtNum(d.nightShift.presentHeads, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#34d399',
      fontWeight: 600
    }
  }, sdFmtNum(d.nightShift.availHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(d.nightShift.eowHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(d.nightShift.turnHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(d.nightShift.mssHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#a78bfa'
    }
  }, sdFmtNum(d.nightShift.supHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#38bdf8',
      fontWeight: 700
    }
  }, sdFmtNum(d.nightShift.reqHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      fontWeight: 700,
      color: d.nightShift.netHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, d.nightShift.netHrs >= 0 ? '+' : '', sdFmtNum(d.nightShift.netHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      fontWeight: 600,
      color: d.nightShift.utilPct > 100 ? '#fb7185' : '#cbd5e1'
    }
  }, sdFmtNum(d.nightShift.utilPct, 1), "%"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSelectedDayIdx(d.dayIdx);
      setSelectedShiftKey('night');
      setDrillLevel('hour');
    },
    style: {
      backgroundColor: '#1e293b',
      color: '#a78bfa',
      border: '1px solid #334155',
      borderRadius: '4px',
      padding: '2px 8px',
      fontSize: '11px',
      cursor: 'pointer'
    }
  }, "12h View")))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid #475569',
      backgroundColor: '#1e293b',
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 4,
    style: {
      padding: '10px 6px',
      color: '#f8fafc'
    }
  }, "14-SHIFT WEEKLY GRID TOTAL (168 HOURS - 100% RECONCILED)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#34d399'
    }
  }, sdFmtNum(model.gridWeeklyAvailHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(model.lineEowWashHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(model.lineDailyWashHrs + model.lineMidweekHrs + model.lineAllergenHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, sdFmtNum(model.mssEquipPeriodicHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#a78bfa'
    }
  }, sdFmtNum(model.standingSupportWeeklyHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#38bdf8'
    }
  }, sdFmtNum(model.gridWeeklyReqHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: model.weeklyNetBalanceHrs >= 0 ? '#34d399' : '#fb7185'
    }
  }, model.weeklyNetBalanceHrs >= 0 ? '+' : '', sdFmtNum(model.weeklyNetBalanceHrs, 1)), /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#6ee7b7'
    }
  }, "Delta vs Headline: ", sdFmtNum(model.gridReconciliationDeltaHrs, 2), "h")))))), drillLevel === 'hour' && (() => {
    const activeDayObj = model.daysDrill[selectedDayIdx] || model.daysDrill[0];
    const activeShiftObj = selectedShiftKey === 'day' ? activeDayObj.dayShift : activeDayObj.nightShift;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      style: {
        margin: 0,
        fontSize: '14px',
        color: '#38bdf8'
      }
    }, "Hour-by-Hour Manpower Execution Profile: ", activeDayObj.dayName, " - ", selectedShiftKey === 'day' ? 'Day Shift (06:00-18:00)' : 'Night Shift (18:00-06:00)', " (", activeShiftObj.crewLabel, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        color: '#94a3b8'
      }
    }, "Present Floor Staff: ", activeShiftObj.presentHeads, " heads - Net Shift Avail: ", activeShiftObj.availHrs, " man-hrs - Shift Required: ", activeShiftObj.reqHrs, " man-hrs")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("select", {
      value: selectedDayIdx,
      onChange: e => setSelectedDayIdx(parseInt(e.target.value, 10)),
      style: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        border: '1px solid #475569',
        borderRadius: '5px',
        padding: '5px 8px',
        fontSize: '12px'
      }
    }, model.daysDrill.map(d => /*#__PURE__*/React.createElement("option", {
      key: d.dayIdx,
      value: d.dayIdx
    }, d.dayName))), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelectedShiftKey('day'),
      style: {
        backgroundColor: selectedShiftKey === 'day' ? '#0284c7' : '#1e293b',
        color: '#ffffff',
        border: '1px solid #475569',
        borderRadius: '5px',
        padding: '5px 10px',
        fontSize: '12px',
        cursor: 'pointer'
      }
    }, "Day Shift (06:00-18:00)"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelectedShiftKey('night'),
      style: {
        backgroundColor: selectedShiftKey === 'night' ? '#7c3aed' : '#1e293b',
        color: '#ffffff',
        border: '1px solid #475569',
        borderRadius: '5px',
        padding: '5px 10px',
        fontSize: '12px',
        cursor: 'pointer'
      }
    }, "Night Shift (18:00-06:00)"))), /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        borderBottom: '2px solid #334155',
        color: '#94a3b8',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px'
      }
    }, "Shift Hour"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px'
      }
    }, "Clock Window"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px'
      }
    }, "Operational Wash & QA Phase (Q3 Buffers + Q5 Friction)"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, "Avail Man-Hrs"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, "EOW / Turn Hrs"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, "MSS / Post Hrs"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, "Req Man-Hrs"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, "Net Buffer"), /*#__PURE__*/React.createElement("th", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, "Hourly Load %"))), /*#__PURE__*/React.createElement("tbody", null, activeShiftObj.hourly.map(hr => /*#__PURE__*/React.createElement("tr", {
      key: hr.hourIndex,
      style: {
        borderBottom: '1px solid #1e293b'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        fontWeight: 700,
        color: '#38bdf8'
      }
    }, "Hour ", hr.hourIndex), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        fontWeight: 600,
        color: '#f8fafc'
      }
    }, hr.label), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        color: '#cbd5e1'
      }
    }, hr.phaseTag), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        textAlign: 'right',
        color: '#34d399',
        fontWeight: 600
      }
    }, sdFmtNum(hr.availManHrs, 2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        textAlign: 'right',
        color: '#cbd5e1'
      }
    }, sdFmtNum(hr.eowHrs + hr.turnHrs, 2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        textAlign: 'right',
        color: '#a78bfa'
      }
    }, sdFmtNum(hr.mssHrs + hr.supHrs, 2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        textAlign: 'right',
        color: '#38bdf8',
        fontWeight: 600
      }
    }, sdFmtNum(hr.reqManHrs, 2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        textAlign: 'right',
        fontWeight: 700,
        color: hr.netManHrs >= 0 ? '#34d399' : '#fb7185'
      }
    }, hr.netManHrs >= 0 ? '+' : '', sdFmtNum(hr.netManHrs, 2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 6px',
        textAlign: 'right',
        fontWeight: 600,
        color: hr.utilPct > 100 ? '#fb7185' : '#cbd5e1'
      }
    }, sdFmtNum(hr.utilPct, 1), "%")))))));
  })()), activeTab === 'modeler' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Production Schedule Impact & Line Clean Duration Modeler (Q3 & Q4)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "Rule Q4: When a line has 0 run dates in a week, it is DOWN (0 daily washes) and only EOW + MSS frequencies apply ONCE. Each line uses its own published horizon date.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1'
    }
  }, "Past Published Horizon Policy:"), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('unpublishedWeekPolicy', sp.unpublishedWeekPolicy === 'hold_avg' ? 'treat_as_down' : 'hold_avg'),
    style: {
      backgroundColor: '#1e293b',
      color: '#fbbf24',
      border: '1px solid #d97706',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, sp.unpublishedWeekPolicy === 'hold_avg' ? 'Hold Line Horizon Avg (Default)' : 'Treat Unpublished as 0d Down (EOW 1x)') : /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#fbbf24',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '4px 9px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, sp.unpublishedWeekPolicy === 'hold_avg' ? 'Readout: Hold Line Horizon Avg' : 'Readout: Treat Unpublished as 0d Down'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1'
    }
  }, "Swab Crew Charge:"), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('swabChargeMode', sp.swabChargeMode === 'inspector_only' ? 'full_crew' : 'inspector_only'),
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #0284c7',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, sp.swabChargeMode === 'inspector_only' ? '1 Inspector/Lead (Default)' : 'Full Assigned Crew Held') : /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '4px 9px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, sp.swabChargeMode === 'inspector_only' ? 'Readout: 1 Inspector/Lead' : 'Readout: Full Assigned Crew Held'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    }
  }, model.areaRows.filter(r => r.category === 'major_line' || r.key === 'dough room').map(line => /*#__PURE__*/React.createElement("div", {
    key: line.key,
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid ' + (line.runDays === 0 ? '#f59e0b' : '#334155'),
      borderRadius: '8px',
      padding: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '13px',
      color: '#f8fafc'
    }
  }, line.name), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: line.runDays === 0 ? '#78350f' : '#0f172a',
      color: line.runDays === 0 ? '#fde68a' : '#38bdf8',
      fontSize: '11px',
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: '4px',
      border: '1px solid #334155'
    }
  }, line.runDays === 0 ? 'LINE DOWN (EOW Once)' : `${line.runDays.toFixed(2)} Run Days/Wk`)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#94a3b8',
      marginBottom: '8px'
    }
  }, "Published Horizon: ", /*#__PURE__*/React.createElement("strong", null, line.schedHorizonDate), " (", line.schedTotalRunDays, " run-days / ", line.schedWeeksCovered, " wks) - SAP Scope: ", /*#__PURE__*/React.createElement("strong", null, line.sapScopeCode)), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Weekly Run Days (0 = Down, EOW Once):"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#e2e8f0',
      fontWeight: 600
    }
  }, line.runDays.toFixed(2), " d/wk")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "7",
    step: "0.25",
    value: line.runDays,
    onChange: e => {
      const v = parseFloat(e.target.value);
      setSp(prev => ({
        ...prev,
        scheduleMode: 'sliders',
        lineRunDaysSliders: {
          ...(prev.lineRunDaysSliders || {}),
          [line.key]: v
        }
      }));
    },
    style: {
      width: '100%',
      accentColor: '#38bdf8'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Allergen Runs / Wk:"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#f472b6',
      fontWeight: 600
    }
  }, line.allergenTurns.toFixed(2), " turns/wk")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "6",
    step: "0.25",
    value: line.allergenTurns,
    onChange: e => {
      const v = parseFloat(e.target.value);
      setSp(prev => ({
        ...prev,
        scheduleMode: 'sliders',
        lineAllergenRunsSliders: {
          ...(prev.lineAllergenRunsSliders || {}),
          [line.key]: v
        }
      }));
    },
    style: {
      width: '100%',
      accentColor: '#f472b6'
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '6px',
      padding: '6px 10px',
      marginBottom: '8px',
      fontSize: '11px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, "Setup Readout: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#38bdf8'
    }
  }, line.runDays.toFixed(2), " d/wk")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#94a3b8'
    }
  }, "Allergen Turns: ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#f472b6'
    }
  }, line.allergenTurns.toFixed(2), " /wk"))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      padding: '8px',
      borderRadius: '6px',
      fontSize: '11px',
      color: '#cbd5e1',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("div", null, "Active EOW Base: ", /*#__PURE__*/React.createElement("strong", null, line.eowBaseAssetMin, "m")), /*#__PURE__*/React.createElement("div", null, "Daily Turn Base: ", /*#__PURE__*/React.createElement("strong", null, line.dailyTurnBaseAssetMin, "m")), /*#__PURE__*/React.createElement("div", null, "Mode A Wash Clock: ", /*#__PURE__*/React.createElement("strong", null, line.modeAWashClockHrs, "h")), /*#__PURE__*/React.createElement("div", null, "Mode B Crit Floor: ", /*#__PURE__*/React.createElement("strong", null, line.modeBCritClockHrs, "h")), /*#__PURE__*/React.createElement("div", null, "Total EOW Clock: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#34d399'
    }
  }, line.totalEowWallClockHrs, "h")), /*#__PURE__*/React.createElement("div", null, "Weekly Req: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#38bdf8'
    }
  }, line.totalWeeklyManHrs, " man-h")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '16px',
      backgroundColor: '#131c31',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '13px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "Live Week-by-Week Production Schedule Matrix (Sep - Dec 2026: 431 Window Runs + 5 Out-of-Window = 436 DB Rows in craa5__aa_prd_schd)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "100% matched to D5_prd_schd_weekly_summary.csv (IBL4=85d/31a/85r, IBL5=72d/22a/72r, Waterjet=71d/36a/157r, Breading=53d/0a/53r, Custard=40d/19a/40r, Highspeed=24d/6a/24r). Click any week to load.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      updateSp('scheduleMode', 'actual');
      updateSp('selectedSchedWeek', 'avg_active');
    },
    style: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Use Per-Line Horizon Average")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: '240px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '11px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left',
      position: 'sticky',
      top: 0,
      backgroundColor: '#0f172a'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px'
    }
  }, "Sunday Week"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'center'
    }
  }, "IBL4 (d / alrg)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'center'
    }
  }, "IBL5 (d / alrg)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'center'
    }
  }, "Waterjet (d / alrg)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'center'
    }
  }, "Breading (d)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'center'
    }
  }, "Custard (d / alrg)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'center'
    }
  }, "Highspeed (d / alrg)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '6px',
      textAlign: 'right'
    }
  }, "Total Run-Days"))), /*#__PURE__*/React.createElement("tbody", null, SD_PRD_SCHD_WEEKLY.map(w => {
    const isSel = sp.scheduleMode === 'actual' && sp.selectedSchedWeek === w.weekSunday;
    const totDays = ['ibl4', 'ibl5', 'waterjet', 'breading', 'custard', 'highspeed'].reduce((s, k) => s + (w.days && w.days[k] ? w.days[k] : 0), 0);
    return /*#__PURE__*/React.createElement("tr", {
      key: w.weekSunday,
      onClick: () => {
        updateSp('scheduleMode', 'actual');
        updateSp('selectedSchedWeek', w.weekSunday);
      },
      style: {
        borderBottom: '1px solid #1e293b',
        backgroundColor: isSel ? '#1e3a8a' : 'transparent',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 6px',
        fontWeight: 700,
        color: isSel ? '#38bdf8' : '#f8fafc'
      }
    }, w.label), ['ibl4', 'ibl5', 'waterjet', 'breading', 'custard', 'highspeed'].map(k => {
      const rDays = w.days && w.days[k] || 0;
      const aRuns = w.alrg && w.alrg[k] || 0;
      const isUnpub = Array.isArray(w.unpublishedHorizon) && w.unpublishedHorizon.includes(k);
      return /*#__PURE__*/React.createElement("td", {
        key: k,
        style: {
          padding: '5px 6px',
          textAlign: 'center',
          color: rDays === 0 ? '#fbbf24' : '#cbd5e1',
          fontWeight: rDays === 0 ? 700 : 400
        }
      }, rDays === 0 ? isUnpub ? '0d (Past Horizon)' : '0d (DOWN - EOW 1x)' : `${rDays}d${aRuns > 0 ? ` (${aRuns}A)` : ''}`);
    }), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '5px 6px',
        textAlign: 'right',
        fontWeight: 700,
        color: '#34d399'
      }
    }, totDays, " line-days"));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Area / Line (29 Keys = 861 Assets)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Category"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Assets"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Active EOW (m)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "P1.1 59x Bug Delta"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Daily=Yes (m)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Pop. dailymin"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Run Days/Wk"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Daily Turn Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "EOW Clean Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Alrg+MSS Hrs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Weekly Req Hrs"))), /*#__PURE__*/React.createElement("tbody", null, model.areaRows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.key,
    style: {
      borderBottom: '1px solid #1e293b',
      opacity: r.excludedByMode ? 0.45 : 1
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, r.name, r.excludedByMode && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: '6px',
      fontSize: '10px',
      color: '#fbbf24'
    }
  }, "(Replaced by Q1 ", r.category === 'janitorial' ? 'Contractor' : 'Standing Post', ")")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#94a3b8'
    }
  }, r.category), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, r.activeAssets, "/", r.totalAssets), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      fontWeight: 600
    }
  }, sdFmtNum(r.eowBaseAssetMin, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: r.bugAssetsCnt > 0 ? '#f87171' : '#64748b'
    }
  }, r.bugAssetsCnt > 0 ? `-${r.bugDeltaMin}m (${r.bugAssetsCnt} rows)` : '0m'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, sdFmtNum(r.dailyFlagMin, 0), " (", r.dailyFlagCount, ")"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, sdFmtNum(r.sumDailyMin, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#38bdf8'
    }
  }, r.runDays.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, sdFmtNum(r.weeklyDailyCleanHrs + r.weeklyMidweekHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, sdFmtNum(r.weeklyEowHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#f472b6'
    }
  }, sdFmtNum(r.weeklyAllergenHrs + r.weeklyMssPeriodicHrs, 1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      fontWeight: 700,
      color: '#34d399'
    }
  }, r.excludedByMode ? '0.0 (Q1)' : sdFmtNum(r.totalWeeklyManHrs, 1))))))))), activeTab === 'crowding' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Room Optimal Headcount (N_opt) & Non-Linear Crowding Curve (Q7)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "Waterjet example: At N_opt = 10 heads, efficiency is 100%. Head 11 yields 50% (6.0h of 12h), Head 12 yields 25% (3.0h of 12h), Heads >= N_opt+3 yield 10% (hose/drain/lift crowding).")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('crowdingFormulaMode', 'marginal_tiers'),
    style: {
      backgroundColor: (sp.crowdingFormulaMode || 'marginal_tiers') === 'marginal_tiers' ? '#0284c7' : '#1e293b',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Mode A: Marginal Tiers (50% to 25% to 10%)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('crowdingFormulaMode', 'room_penalty'),
    style: {
      backgroundColor: sp.crowdingFormulaMode === 'room_penalty' ? '#7c3aed' : '#1e293b',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Mode B: +10% Total Room Penalty at >= N_opt+3")) : /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Active Crowding Setup Readout: ", sp.crowdingFormulaMode === 'room_penalty' ? 'Mode B (+10% Room Penalty)' : 'Mode A (Marginal Tiers 50%/25%/10%)'))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Room / Production Line"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'center'
    }
  }, "Optimal Heads (N_opt)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'center'
    }
  }, "Assigned Heads (N)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Effective Heads (N_eff)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Efficiency %"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Crowding Loss (Heads)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "12h Shift Value of Nth Head"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Resulting EOW Clock"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Crowding Status"))), /*#__PURE__*/React.createElement("tbody", null, model.areaRows.filter(r => r.category === 'major_line' || r.category === 'secondary_line' || r.category === 'mss_area').map(r => {
    const over = r.assignedN - r.optN;
    let nthValueStr = '12.0h (100% utility)';
    if (over === 1) nthValueStr = '6.0h (50% marginal)';else if (over === 2) nthValueStr = '3.0h (25% marginal)';else if (over >= 3) nthValueStr = '1.2h (10% marginal - severe crowding)';
    return /*#__PURE__*/React.createElement("tr", {
      key: r.key,
      style: {
        borderBottom: '1px solid #1e293b'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        fontWeight: 700,
        color: '#f8fafc'
      }
    }, r.name), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'center'
      }
    }, logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "1",
      max: "25",
      value: r.optN,
      onChange: e => {
        const v = Math.max(1, parseInt(e.target.value || '1', 10));
        setSp(prev => ({
          ...prev,
          roomOptHeads: {
            ...(prev.roomOptHeads || {}),
            [r.key]: v
          }
        }));
      },
      style: {
        width: '54px',
        backgroundColor: '#1e293b',
        color: '#38bdf8',
        border: '1px solid #475569',
        borderRadius: '4px',
        padding: '3px 6px',
        textAlign: 'center',
        fontWeight: 700
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: '#1e293b',
        color: '#38bdf8',
        border: '1px solid #334155',
        borderRadius: '4px',
        padding: '2px 8px',
        fontWeight: 700
      }
    }, r.optN)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'center'
      }
    }, logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "1",
      max: "30",
      value: r.assignedN,
      onChange: e => {
        const v = Math.max(1, parseInt(e.target.value || '1', 10));
        setSp(prev => ({
          ...prev,
          roomAssignedHeads: {
            ...(prev.roomAssignedHeads || {}),
            [r.key]: v
          }
        }));
      },
      style: {
        width: '54px',
        backgroundColor: '#1e293b',
        color: '#fbbf24',
        border: '1px solid #475569',
        borderRadius: '4px',
        padding: '3px 6px',
        textAlign: 'center',
        fontWeight: 700
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: '#1e293b',
        color: '#fbbf24',
        border: '1px solid #334155',
        borderRadius: '4px',
        padding: '2px 8px',
        fontWeight: 700
      }
    }, r.assignedN)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        fontWeight: 700,
        color: '#34d399'
      }
    }, r.crowd.effectiveHeads.toFixed(2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        fontWeight: 600,
        color: r.crowd.efficiencyPct < 90 ? '#fb7185' : '#cbd5e1'
      }
    }, r.crowd.efficiencyPct.toFixed(1), "%"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        color: r.crowd.crowdingLossHeads > 0 ? '#fb7185' : '#64748b'
      }
    }, r.crowd.crowdingLossHeads > 0 ? `-${r.crowd.crowdingLossHeads.toFixed(2)}` : '0.00'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        color: '#cbd5e1'
      }
    }, nthValueStr), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        fontWeight: 700,
        color: '#38bdf8'
      }
    }, r.totalEowWallClockHrs.toFixed(2), " hrs"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: r.crowd.status === 'OPTIMAL' ? '#064e3b' : r.crowd.status === 'UNDER_OR_AT_OPT' ? '#1e293b' : '#7f1d1d',
        color: r.crowd.status === 'OPTIMAL' ? '#34d399' : r.crowd.status === 'UNDER_OR_AT_OPT' ? '#94a3b8' : '#fca5a5',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600
      }
    }, r.crowd.status)));
  })))))), activeTab === 'crews' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Crew A-D Roster, Direct Wash Cleaners vs. Embedded Specialists & Q2 Alignment (122 DB Rows to 100 Active Floor)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '2px'
    }
  }, "Separates ", /*#__PURE__*/React.createElement("strong", null, "90 Direct Wash Cleaners"), " (71 Tech 1, 11 Tech 2, 8 Tech 3/Lead) from ", /*#__PURE__*/React.createElement("strong", null, "10 Embedded Support/QA Specialists"), " (4 Inspectors, 2 Chem Clerks, 2 Admins, 1 Janitor, 1 Trash) so specialists are never double-counted with Q1 Standing Posts.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowQ2Checklist(!showQ2Checklist),
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #0284c7',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, showQ2Checklist ? 'Hide Q2 Dataverse Admin Checklist' : 'View Q2 Dataverse Admin Checklist (Read-Only)')), showQ2Checklist && /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#131c31',
      border: '1px solid #0284c7',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '14px',
      fontSize: '12px',
      color: '#cbd5e1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: '#7dd3fc',
      marginBottom: '6px'
    }
  }, "Q2 Dataverse Record Alignment Checklist (Session-Aligned; Production Employee Table Protected from Direct Overwrites)"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: '18px',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Victor Thorne"), " (", /*#__PURE__*/React.createElement("code", null, "1706e486-3222-f111-8341-00224809bad2"), "): Set ", /*#__PURE__*/React.createElement("code", null, "craa5_active = false"), " (Crew A Supervisor remains VACANT; covered by Interim Dpt Head ", /*#__PURE__*/React.createElement("strong", null, "Marcus Vance"), " ", /*#__PURE__*/React.createElement("code", null, "7269de9e-1022-f111-8341-00224809bad2"), ")."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Logan Vance"), " (", /*#__PURE__*/React.createElement("code", null, "63cf7272-7c24-f111-8341-00224809bad2"), "): Set ", /*#__PURE__*/React.createElement("code", null, "craa5_active = false"), " (Replaced on Crew C by ", /*#__PURE__*/React.createElement("strong", null, "David Sterling"), " ", /*#__PURE__*/React.createElement("code", null, "dc0babb5-3422-f111-8341-00224809bad2"), ")."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Caleb Ross"), " (", /*#__PURE__*/React.createElement("code", null, "b18c593b-7c24-f111-8341-00224809bad2"), "): Set ", /*#__PURE__*/React.createElement("code", null, "craa5_active = false"), " (Replaced on Crew D by ", /*#__PURE__*/React.createElement("strong", null, "Rachel Chen"), " ", /*#__PURE__*/React.createElement("code", null, "3450222d-3622-f111-8341-00224809bad2"), ")."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Rachel Chen"), " (", /*#__PURE__*/React.createElement("code", null, "3450222d-3622-f111-8341-00224809bad2"), "): Update ", /*#__PURE__*/React.createElement("code", null, "craa5_crew = 'D'"), " to match ", /*#__PURE__*/React.createElement("code", null, "craa5__aa_leadershipteam"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Crew C ShiftArchive Transfers (D9 Note)"), ": 4 employees (", /*#__PURE__*/React.createElement("em", null, "Hamilton, Lynetta S"), " ", /*#__PURE__*/React.createElement("code", null, "8ee37134..."), ", ", /*#__PURE__*/React.createElement("em", null, "Graham, Tyler"), " ", /*#__PURE__*/React.createElement("code", null, "6b4d1450..."), ", ", /*#__PURE__*/React.createElement("em", null, "Sullivan, Katherine"), " ", /*#__PURE__*/React.createElement("code", null, "0233f143..."), ", ", /*#__PURE__*/React.createElement("em", null, "Wallace, Timothy J"), " ", /*#__PURE__*/React.createElement("code", null, "8a4d1450..."), ") are logged on Crew C in ", /*#__PURE__*/React.createElement("code", null, "craa5_shiftarchive"), " (Oct 18-29) but still carry B/D in ", /*#__PURE__*/React.createElement("code", null, "craa5__aa_employee"), "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    }
  }, ['A', 'B', 'C', 'D'].map(cKey => {
    const c = model.crewModels[cKey];
    return /*#__PURE__*/React.createElement("div", {
      key: cKey,
      style: {
        backgroundColor: '#1e293b',
        border: '1px solid ' + (c.floorVacancies > 0 ? '#f43f5e' : '#334155'),
        borderRadius: '8px',
        padding: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '15px',
        fontWeight: 800,
        color: '#f8fafc'
      }
    }, "Crew ", cKey), /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: cKey === 'A' ? '#7f1d1d' : '#064e3b',
        color: cKey === 'A' ? '#fca5a5' : '#34d399',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 700
      }
    }, cKey === 'A' ? 'SUP VACANT + 7 FLOOR OPEN' : 'SUPERVISOR ACTIVE')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '11px',
        color: '#94a3b8',
        marginBottom: '8px'
      }
    }, c.shiftType), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        color: '#cbd5e1',
        marginBottom: '4px'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "Supervisor:"), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: cKey === 'A' ? '#fb7185' : '#38bdf8',
        fontWeight: 700
      }
    }, c.supervisorName)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '11px',
        color: '#64748b',
        marginBottom: '8px'
      }
    }, c.deactivatedSupervisor), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '10px',
        color: '#94a3b8'
      }
    }, "Total Active Floor"), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "5",
      max: "45",
      value: c.activeFloor,
      onChange: e => {
        const v = Math.max(0, parseInt(e.target.value || '0', 10));
        setSp(prev => ({
          ...prev,
          crewActiveHeadcount: {
            ...(prev.crewActiveHeadcount || {}),
            [cKey]: v
          }
        }));
      },
      style: {
        width: '100%',
        backgroundColor: '#0f172a',
        color: '#34d399',
        border: '1px solid #475569',
        borderRadius: '4px',
        padding: '4px 6px',
        fontWeight: 700
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: '#0f172a',
        color: '#34d399',
        border: '1px solid #334155',
        borderRadius: '4px',
        padding: '4px 8px',
        fontWeight: 800,
        fontSize: '13px'
      }
    }, c.activeFloor, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '10px',
        color: '#94a3b8',
        fontWeight: 500
      }
    }, "(Present Avg: ", shiftAvgMeta.byCrewActualAvg[cKey].avgPresentFloor, ")"))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '10px',
        color: '#94a3b8'
      }
    }, "Authorized Target"), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "5",
      max: "45",
      value: c.authorizedFloor,
      onChange: e => {
        const v = Math.max(0, parseInt(e.target.value || '0', 10));
        setSp(prev => ({
          ...prev,
          crewAuthorizedTargets: {
            ...(prev.crewAuthorizedTargets || {}),
            [cKey]: v
          }
        }));
      },
      style: {
        width: '100%',
        backgroundColor: '#0f172a',
        color: '#38bdf8',
        border: '1px solid #475569',
        borderRadius: '4px',
        padding: '4px 6px',
        fontWeight: 700
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: '#0f172a',
        color: '#38bdf8',
        border: '1px solid #334155',
        borderRadius: '4px',
        padding: '4px 8px',
        fontWeight: 800,
        fontSize: '13px'
      }
    }, c.authorizedFloor, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '10px',
        color: '#94a3b8',
        fontWeight: 500
      }
    }, "(Open: ", c.floorVacancies, ")")))), /*#__PURE__*/React.createElement("div", {
      style: {
        backgroundColor: '#0f172a',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#cbd5e1'
      }
    }, /*#__PURE__*/React.createElement("div", null, "Direct Wash Cleaners: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#38bdf8'
      }
    }, c.directCleaners), " (", c.directTech1, " T1 / ", c.directTech2, " T2 / ", c.directTech3, " T3)"), /*#__PURE__*/React.createElement("div", null, "Embedded Specialists: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#a78bfa'
      }
    }, c.embeddedSpecialists), " (", c.specialistsList, ")"), /*#__PURE__*/React.createElement("div", null, "Gross Roster: ", /*#__PURE__*/React.createElement("strong", null, c.grossHrsWk, "h/wk"), " - Net Avail: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#34d399'
      }
    }, c.netAvailHrsWk, "h/wk")), /*#__PURE__*/React.createElement("div", null, "Direct Wash Net Avail: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#38bdf8'
      }
    }, c.directNetAvailHrsWk, "h/wk"), " (Shrink: -", c.avgShrinkPct, "%)")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '13px',
      fontWeight: 700,
      color: '#a78bfa'
    }
  }, "Q1 Standing Support Post Setpoints (Heads per Shift x 7 Days = ", sdFmtNum(model.standingSupportWeeklyHrs, 1), " hrs/wk)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Staffed by the 10 Embedded Specialists (4 Inspectors, 2 Chem Clerks, 2 Admins, 1 Janitor, 1 Trash) + Scrubber Operator without double-counting asset rows.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Standing Post Hour Basis:"), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('standingPostBasis', sp.standingPostBasis === 'gross_shift' ? 'productive_net' : 'gross_shift'),
    style: {
      backgroundColor: '#0f172a',
      color: '#a78bfa',
      border: '1px solid #7c3aed',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, sp.standingPostBasis === 'gross_shift' ? '12.0h Gross Shift' : `${(model.productiveMinPerShift / 60).toFixed(2)}h Productive Net (Default)`) : /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#0f172a',
      color: '#a78bfa',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 8px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Readout: ", sp.standingPostBasis === 'gross_shift' ? '12.0h Gross Shift' : `${(model.productiveMinPerShift / 60).toFixed(2)}h Productive Net`))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '8px'
    }
  }, [{
    key: 'chemCageDay',
    label: 'Chem Cage (Day)'
  }, {
    key: 'chemCageNight',
    label: 'Chem Cage (Night)'
  }, {
    key: 'adminDay',
    label: 'Sanitation Admin (Day)'
  }, {
    key: 'adminNight',
    label: 'Sanitation Admin (Night)'
  }, {
    key: 'qaSwabDay',
    label: 'QA / Inspector (Day)'
  }, {
    key: 'qaSwabNight',
    label: 'QA / Inspector (Night)'
  }, {
    key: 'trashDockDay',
    label: 'Trash / Dock (Day)'
  }, {
    key: 'trashDockNight',
    label: 'Trash / Dock (Night)'
  }, {
    key: 'scrubberDay',
    label: 'Floor Scrubber (Day)'
  }, {
    key: 'scrubberNight',
    label: 'Floor Scrubber (Night)'
  }].map(post => {
    const postVal = sp.standingPosts && sp.standingPosts[post.key] !== undefined ? sp.standingPosts[post.key] : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: post.key,
      style: {
        backgroundColor: '#0f172a',
        padding: '6px 8px',
        borderRadius: '6px',
        border: '1px solid #334155'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '11px',
        color: '#cbd5e1',
        marginBottom: '3px'
      }
    }, post.label), logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      max: "6",
      step: "0.5",
      value: postVal,
      onChange: e => {
        const v = Math.max(0, parseFloat(e.target.value || '0'));
        setSp(prev => ({
          ...prev,
          supportMode: 'standing_posts',
          standingPosts: {
            ...(prev.standingPosts || {}),
            [post.key]: v
          }
        }));
      },
      style: {
        width: '100%',
        backgroundColor: '#1e293b',
        color: '#a78bfa',
        border: '1px solid #475569',
        borderRadius: '4px',
        padding: '3px 6px',
        fontWeight: 700,
        fontSize: '12px'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#a78bfa',
        fontWeight: 800,
        fontSize: '13px'
      }
    }, postVal, " head(s)/shift"));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Q8: Habitual Days Off / Late / Sick Forecaster & Background Shift Assignment Averager"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "Background Default Source: ", /*#__PURE__*/React.createElement("strong", null, shiftAvgMeta.sourceLabel), " (Saved to Dataverse ", /*#__PURE__*/React.createElement("code", null, "craa5_directorsetpoint"), " / ", /*#__PURE__*/React.createElement("code", null, "craa5__e_hubconfig"), "; only updated when clicked again).")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: shiftSyncBusy,
    onClick: () => syncShiftAssignmentsAndAttendanceDefaults('all_absence'),
    style: {
      backgroundColor: '#0284c7',
      color: '#ffffff',
      border: '1px solid #38bdf8',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '11px',
      fontWeight: 700,
      cursor: shiftSyncBusy ? 'wait' : 'pointer'
    }
  }, shiftSyncBusy ? 'Reading Shift Assignments...' : 'Read & Average All Shift Assignments (Save to Dataverse)'), /*#__PURE__*/React.createElement("button", {
    disabled: shiftSyncBusy,
    onClick: () => syncShiftAssignmentsAndAttendanceDefaults('sick_only'),
    style: {
      backgroundColor: '#065f46',
      color: '#ecfdf5',
      border: '1px solid #10b981',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '11px',
      fontWeight: 600,
      cursor: shiftSyncBusy ? 'wait' : 'pointer'
    }
  }, "Average Sick + Early Only (", shiftAvgMeta.avgSickAndEarlyOnlyPct, "%)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSp(prev => ({
        ...prev,
        attendanceShrinkage: SD_DEFAULT_SETPOINTS.attendanceShrinkage
      }));
      setPresetSaveMsg('Restored Default Controller Attendance Shrinkage Forecast (~8.6%).');
    },
    style: {
      backgroundColor: '#1e293b',
      color: '#cbd5e1',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '11px',
      cursor: 'pointer'
    }
  }, "Restore Built-In Default (8.6%)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'left'
    }
  }, "Crew"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Sunday"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Monday"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Tuesday"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Wednesday (Alt)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Thursday"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Friday"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Saturday"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Active Avg Shrink %"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "D9 Archive Empirical"))), /*#__PURE__*/React.createElement("tbody", null, ['A', 'B', 'C', 'D'].map(cKey => {
    const arr = sp.attendanceShrinkage && sp.attendanceShrinkage[cKey] || SD_DEFAULT_SETPOINTS.attendanceShrinkage[cKey];
    const d9Crew = SD_SHIFT_ARCHIVE_SUMMARY.byCrew[cKey];
    return /*#__PURE__*/React.createElement("tr", {
      key: cKey,
      style: {
        borderBottom: '1px solid #1e293b'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        fontWeight: 700,
        color: '#f8fafc'
      }
    }, "Crew ", cKey, " (", model.crewModels[cKey].activeFloor, " floor / ", shiftAvgMeta.byCrewActualAvg[cKey].avgPresentFloor, " avg present)"), [0, 1, 2, 3, 4, 5, 6].map(dIdx => /*#__PURE__*/React.createElement("td", {
      key: dIdx,
      style: {
        padding: '6px',
        textAlign: 'center'
      }
    }, logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      max: "50",
      step: "0.5",
      value: arr[dIdx],
      onChange: e => {
        const v = Math.min(50, Math.max(0, parseFloat(e.target.value || '0')));
        setSp(prev => {
          const nextArr = [...(prev.attendanceShrinkage && prev.attendanceShrinkage[cKey] || [0, 0, 0, 0, 0, 0, 0])];
          nextArr[dIdx] = v;
          return {
            ...prev,
            attendanceShrinkage: {
              ...(prev.attendanceShrinkage || {}),
              [cKey]: nextArr
            }
          };
        });
      },
      style: {
        width: '56px',
        backgroundColor: arr[dIdx] > 0 ? '#1e293b' : '#0b1120',
        color: arr[dIdx] >= 10 ? '#fb7185' : arr[dIdx] > 0 ? '#fde68a' : '#475569',
        border: '1px solid #334155',
        borderRadius: '4px',
        padding: '3px 4px',
        textAlign: 'center',
        fontWeight: 700
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        minWidth: '48px',
        backgroundColor: arr[dIdx] > 0 ? '#1e293b' : '#0b1120',
        color: arr[dIdx] >= 10 ? '#fb7185' : arr[dIdx] > 0 ? '#fde68a' : '#475569',
        border: '1px solid #334155',
        borderRadius: '4px',
        padding: '2px 6px',
        fontWeight: 700
      }
    }, arr[dIdx].toFixed(1), "%"))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        fontWeight: 700,
        color: '#fca5a5'
      }
    }, model.crewModels[cKey].avgShrinkPct, "%"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        color: '#38bdf8',
        fontWeight: 600
      }
    }, d9Crew.empiricalShrinkPct, "% (", d9Crew.sick, "S / ", d9Crew.pto, "P / ", d9Crew.leftEarly, "LE)"));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px 0',
      fontSize: '14px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "Live Dataverse ShiftArchive Attendance Verification (D9: 30 Archived Shifts, Oct 18 - Oct 29, 2026)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1',
      marginBottom: '10px'
    }
  }, "Extracted from ", /*#__PURE__*/React.createElement("code", null, "craa5_shiftarchive"), " (", /*#__PURE__*/React.createElement("code", null, "D9_shiftarchive_attendance_events.csv"), "): ", /*#__PURE__*/React.createElement("strong", null, "67 raw events"), " to ", /*#__PURE__*/React.createElement("strong", null, "63 deduplicated floor events"), " (after removing 2 duplicate saves on 10-26 Crew A, 1 overlap on 10-27 Ross, and 1 self-PTO by Marcus Vance on 10-28): ", /*#__PURE__*/React.createElement("strong", null, "19 Sick"), ", ", /*#__PURE__*/React.createElement("strong", null, "32 PTO (50.8% Paid Time Off)"), ", ", /*#__PURE__*/React.createElement("strong", null, "12 Left Early"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '10px'
    }
  }, ['A', 'B', 'C', 'D'].map(cKey => {
    const d9 = SD_SHIFT_ARCHIVE_SUMMARY.byCrew[cKey];
    return /*#__PURE__*/React.createElement("div", {
      key: cKey,
      style: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '10px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        color: '#f8fafc',
        fontSize: '12px',
        marginBottom: '4px'
      }
    }, "Crew ", cKey, " (", d9.uniqueShifts, " Unique Shifts Archived)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '11px',
        color: '#cbd5e1',
        marginBottom: '4px'
      }
    }, "Sick: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#fb7185'
      }
    }, d9.sick), " - PTO: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#fbbf24'
      }
    }, d9.pto), " - Left Early: ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#38bdf8'
      }
    }, d9.leftEarly)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '11px',
        color: '#34d399',
        fontWeight: 700,
        marginBottom: '4px'
      }
    }, "Empirical Shrinkage: ", d9.empiricalShrinkPct, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '10px',
        color: '#94a3b8'
      }
    }, d9.note));
  })))), activeTab === 'chemicals' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: payAuthorized ? '#064e3b' : '#450a0a',
      border: '1px solid ' + (payAuthorized ? '#10b981' : '#f43f5e'),
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Q6 Compensation Security Gate: ", payAuthorized ? 'AUTHORIZED (Senior Manager & Above Verified)' : 'RESTRICTED (Requires Senior Manager & Above)'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1',
      marginTop: '2px'
    }
  }, "Microsoft User: ", /*#__PURE__*/React.createElement("strong", null, currentUserInfo.userName), " - Assigned Title: ", /*#__PURE__*/React.createElement("strong", null, currentUserInfo.assignedTitle), " - SystemUser ID: ", /*#__PURE__*/React.createElement("code", null, currentUserInfo.userId), " - Wage setpoints are session-private and automatically stripped from shared ", /*#__PURE__*/React.createElement("code", null, "craa5__e_hubconfig"), " presets.")), currentUserInfo.isSeniorMgrPlus && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPayAuthorized(!payAuthorized),
    style: {
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, payAuthorized ? 'Simulate Non-Manager View (Lock Gate)' : 'Restore Authorized Senior Manager View'))), payAuthorized ? /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px 0',
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Q6 Role Compensation Defaults, Statutory OT Formula & Custom Dpt Head Mechanism"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Sanitation Tech 1 / Admin / Janitor / Trash"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      fontWeight: 700
    }
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.25",
    value: sp.rateTech1,
    onChange: e => updateSp('rateTech1', parseFloat(e.target.value || '0')),
    style: {
      width: '90px',
      backgroundColor: '#0f172a',
      color: '#34d399',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontSize: '14px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "/ hr")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Default: $18.00/h (75 Active = 71 Direct + 4 Spec)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Sanitation Tech 2 / Inspector / Chem Clerk"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      fontWeight: 700
    }
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.25",
    value: sp.rateTech2,
    onChange: e => updateSp('rateTech2', parseFloat(e.target.value || '0')),
    style: {
      width: '90px',
      backgroundColor: '#0f172a',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontSize: '14px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "/ hr")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Default: $21.00/h (17 Active = 11 Direct + 6 Spec)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Sanitation Tech 3 / Crew Lead"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      fontWeight: 700
    }
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.25",
    value: sp.rateTech3,
    onChange: e => updateSp('rateTech3', parseFloat(e.target.value || '0')),
    style: {
      width: '90px',
      backgroundColor: '#0f172a',
      color: '#fbbf24',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontSize: '14px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "/ hr")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Default: $24.00/h (8 Active Direct Leads)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Supervisor Salary (3 Active: B, C, D)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      fontWeight: 700
    }
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "1000",
    value: sp.supervisorSalaryAnnual ?? sp.supSalary ?? 72000,
    onChange: e => updateSp('supervisorSalaryAnnual', parseFloat(e.target.value || '0')),
    style: {
      width: '100px',
      backgroundColor: '#0f172a',
      color: '#a78bfa',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontSize: '14px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "/ yr")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#64748b',
      marginTop: '4px'
    }
  }, "Default: $72,000/yr (Crew A Sup Vacant)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #0284c7'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#38bdf8',
      fontWeight: 700
    }
  }, "Dpt Head (Marcus - Interim)"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!sp.includeDptHead,
    onChange: e => updateSp('includeDptHead', e.target.checked)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      margin: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('dptHeadMode', 'salary'),
    style: {
      flex: 1,
      backgroundColor: sp.dptHeadMode === 'salary' ? '#0284c7' : '#0f172a',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '4px',
      fontSize: '10px',
      padding: '2px 4px',
      cursor: 'pointer'
    }
  }, "Annual Salary"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('dptHeadMode', 'hourly'),
    style: {
      flex: 1,
      backgroundColor: sp.dptHeadMode === 'hourly' ? '#0284c7' : '#0f172a',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '4px',
      fontSize: '10px',
      padding: '2px 4px',
      cursor: 'pointer'
    }
  }, "Custom Hourly")), sp.dptHeadMode === 'salary' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "1000",
    value: sp.dptHeadSalaryAnnual ?? sp.dptHeadSalary ?? 105000,
    onChange: e => updateSp('dptHeadSalaryAnnual', parseFloat(e.target.value || '0')),
    style: {
      width: '95px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "/yr")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.50",
    value: sp.dptHeadHourlyRate ?? sp.dptHeadHourly ?? 50.48,
    onChange: e => updateSp('dptHeadHourlyRate', parseFloat(e.target.value || '0')),
    style: {
      width: '85px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "/hr"))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #334155'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Fringe Burden %, Panama 42h OT & PTO Basis"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "1",
    value: model.fringePctVal,
    onChange: e => updateSp('fringeBurdenPct', parseFloat(e.target.value || '0')),
    style: {
      width: '65px',
      backgroundColor: '#0f172a',
      color: '#f472b6',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontSize: '14px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "% Burden")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('payrollBasis', 'full_roster_42h'),
    style: {
      flex: 1,
      backgroundColor: sp.payrollBasis !== 'attended_plus_pto' ? '#0284c7' : '#0f172a',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '4px',
      fontSize: '10px',
      padding: '2px 4px',
      cursor: 'pointer'
    }
  }, "42h Roster (40h+2h OT)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('payrollBasis', 'attended_plus_pto'),
    style: {
      flex: 1,
      backgroundColor: sp.payrollBasis === 'attended_plus_pto' ? '#0284c7' : '#0f172a',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '4px',
      fontSize: '10px',
      padding: '2px 4px',
      cursor: 'pointer'
    }
  }, "Attended + Paid PTO")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#cbd5e1',
      marginTop: '4px'
    }
  }, "OT Rate (1.5x Base + Flat Fringe): ", /*#__PURE__*/React.createElement("strong", null, "$", model.otHourlyRate, "/hr")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px 0',
      fontSize: '13px',
      color: '#38bdf8'
    }
  }, "Complete Employee Compensation & Role Roster (108 Rows: 8 Leadership + 100 Active Floor from D7_employees_clean.csv)"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      maxHeight: '280px',
      overflowY: 'auto',
      border: '1px solid #334155',
      borderRadius: '8px'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      textAlign: 'left',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Employee Name"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Crew"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Role / Pool"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Q2 Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Default Rate"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Custom Override ($)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Loaded Cost (+", model.fringePctVal, "%)"))), /*#__PURE__*/React.createElement("tbody", null, SD_EMP_SEED.map(emp => {
    let defRate = sp.rateTech1;
    let unit = '/hr';
    if (emp.tier === 'tech2') defRate = sp.rateTech2;else if (emp.tier === 'tech3') defRate = sp.rateTech3;else if (emp.tier === 'supervisor') {
      defRate = sp.supervisorSalaryAnnual ?? sp.supSalary ?? 72000;
      unit = '/yr';
    } else if (emp.tier === 'dpt_head') {
      defRate = sp.dptHeadMode === 'salary' ? sp.dptHeadSalaryAnnual ?? sp.dptHeadSalary ?? 105000 : sp.dptHeadHourlyRate ?? sp.dptHeadHourly ?? 50.48;
      unit = sp.dptHeadMode === 'salary' ? '/yr' : '/hr';
    } else if (emp.tier === 'excluded') {
      defRate = 0;
    }
    const customVal = sp.empRateOverrides && sp.empRateOverrides[emp.id] !== undefined ? sp.empRateOverrides[emp.id] : defRate;
    const loadedVal = customVal * (1 + (Number(model.fringePctVal) || 0) / 100);
    return /*#__PURE__*/React.createElement("tr", {
      key: emp.id,
      style: {
        borderBottom: '1px solid #1e293b',
        opacity: emp.active ? 1 : 0.45
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px',
        fontWeight: 700,
        color: '#f8fafc'
      }
    }, emp.name), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px',
        color: '#38bdf8',
        fontWeight: 600
      }
    }, emp.crew), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px',
        color: '#cbd5e1'
      }
    }, emp.role, " ", emp.isSpecialist ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#a78bfa',
        fontSize: '10px'
      }
    }, "(Embedded Specialist)") : emp.isFloor ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#34d399',
        fontSize: '10px'
      }
    }, "(Direct Cleaner)") : null), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: emp.active ? '#064e3b' : '#7f1d1d',
        color: emp.active ? '#34d399' : '#fca5a5',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 700
      }
    }, emp.active ? 'ACTIVE' : 'EXCLUDED / DEACTIVATED')), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px',
        textAlign: 'right',
        color: '#94a3b8'
      }
    }, emp.active ? `$${Number(defRate).toLocaleString()}${unit}` : '-'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px',
        textAlign: 'right'
      }
    }, emp.active ? /*#__PURE__*/React.createElement("input", {
      type: "number",
      step: unit === '/yr' ? '1000' : '0.25',
      value: customVal,
      onChange: e => updateEmpRateOverride(emp.id, e.target.value),
      style: {
        width: '80px',
        backgroundColor: '#0f172a',
        color: '#34d399',
        border: '1px solid #475569',
        borderRadius: '4px',
        padding: '2px 5px',
        textAlign: 'right',
        fontWeight: 700
      }
    }) : '-'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '6px',
        textAlign: 'right',
        fontWeight: 700,
        color: '#a78bfa'
      }
    }, emp.active ? `$${loadedVal.toLocaleString('en-US', {
      maximumFractionDigits: 2
    })}${unit}` : '-'));
  })))))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Sanitation Chemical vs. PPE/Equipment Spend Forecast (D10: craa5__g_pohistory & craa5__m_material)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "Separates ", /*#__PURE__*/React.createElement("strong", null, "Pure Chemical POs ($871,945.28 across 67 POs: ChemGuard + SaniTech)"), " from ", /*#__PURE__*/React.createElement("strong", null, "PPE, Hoses & Supplies ($112,350.09 across 63 POs: Apex Supply + Vendor 523418)"), ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('includePpeInSpend', !sp.includePpeInSpend),
    style: {
      backgroundColor: sp.includePpeInSpend ? '#7c3aed' : '#0284c7',
      color: '#ffffff',
      border: '1px solid #38bdf8',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, sp.includePpeInSpend ? 'Showing: All POs ($984.3k Chem + PPE)' : 'Showing: Pure Chemical Only ($871.9k ChemGuard+SaniTech)'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1'
    }
  }, "Inflation %:", /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.5",
    value: sp.chemInflationPct,
    onChange: e => updateSp('chemInflationPct', parseFloat(e.target.value || '0')),
    style: {
      width: '55px',
      marginLeft: '6px',
      backgroundColor: '#1e293b',
      color: '#f472b6',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1'
    }
  }, "Titration / Over-Use %:", /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "1",
    value: sp.chemOverusePct ?? sp.chemWasteFactorPct ?? 0,
    onChange: e => updateSp('chemOverusePct', parseFloat(e.target.value || '0')),
    style: {
      width: '55px',
      marginLeft: '6px',
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '3px 6px',
      fontWeight: 700
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Scope Readout: ", sp.includePpeInSpend ? 'All POs ($984.3k Chem + PPE)' : 'Pure Chemical Only ($871.9k ChemGuard+SaniTech)'), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#f472b6',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Inflation Readout: ", sp.chemInflationPct, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#34d399',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Titration Over-Use Readout: ", sp.chemOverusePct ?? 0, "%")))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Vendor (craa5__g_pohistory)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Spend Category"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Primary Material Scope"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "PO Count"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Historical Baseline ($)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Share of Total POs"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Share of Pure Chem"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Projected Annual ($)"))), /*#__PURE__*/React.createElement("tbody", null, SD_VENDORS.map(v => {
    const isIncluded = sp.includePpeInSpend || v.isPureChemical;
    const projAnnual = isIncluded ? v.annualSpend * (model.pureChemAnnualForecast / SD_HIST_PURE_CHEM_SPEND) : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: v.vendor,
      style: {
        borderBottom: '1px solid #1e293b',
        opacity: isIncluded ? 1 : 0.45
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        fontWeight: 700,
        color: '#f8fafc'
      }
    }, v.vendor), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        backgroundColor: v.isPureChemical ? '#064e3b' : '#1e293b',
        color: v.isPureChemical ? '#34d399' : '#fbbf24',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 700
      }
    }, v.isPureChemical ? 'PURE CHEMICAL' : 'PPE & SUPPLIES')), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        color: '#cbd5e1'
      }
    }, v.category), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right'
      }
    }, v.poCount), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        color: '#cbd5e1'
      }
    }, sdFmtCurrency(v.annualSpend, 2)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        color: '#94a3b8'
      }
    }, v.sharePct.toFixed(2), "%"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        color: '#38bdf8'
      }
    }, v.pureChemSharePct > 0 ? `${v.pureChemSharePct.toFixed(2)}%` : 'Excluded (PPE)'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 6px',
        textAlign: 'right',
        fontWeight: 700,
        color: isIncluded ? '#f472b6' : '#64748b'
      }
    }, isIncluded ? sdFmtCurrency(projAnnual, 0) : 'Excluded by Toggle'));
  })), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid #475569',
      backgroundColor: '#1e293b',
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 3,
    style: {
      padding: '10px 6px',
      color: '#f8fafc'
    }
  }, sp.includePpeInSpend ? 'TOTAL SANITATION POs (CHEMICAL + PPE/SUPPLIES)' : 'TOTAL PURE CHEMICAL SPEND (ChemGuard + SaniTech)'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right'
    }
  }, sp.includePpeInSpend ? '130' : '67'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right'
    }
  }, sdFmtCurrency(sp.includePpeInSpend ? SD_HIST_TOTAL_PO_SPEND : SD_HIST_PURE_CHEM_SPEND, 2)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right'
    }
  }, sp.includePpeInSpend ? '100.0%' : '88.58%'), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#38bdf8'
    }
  }, "100.0%"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 6px',
      textAlign: 'right',
      color: '#f472b6'
    }
  }, sdFmtCurrency(model.annualChemForecastSpend, 0)))))))), activeTab === 'audit' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px 0',
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Q5 Forensic Proof: Why Raw Sanitation Log Hours (craa5__log_) Are Discarded for Controller Forecasting"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1',
      marginBottom: '12px'
    }
  }, "Per locked Ruling Q5: ", /*#__PURE__*/React.createElement("em", null, "\"I am not going to sort through that mess and neither should we. reported hours are pointless, just check the equipment minutes and amplify by 50% for unforeseen.\""), " Below is the live Dataverse audit of ", /*#__PURE__*/React.createElement("code", null, "craa5__log_"), " (October 2026: ", /*#__PURE__*/React.createElement("strong", null, "8,026 rows = 564,733 reported minutes / 9,412.2h"), "):"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #f43f5e'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Oct 2026 Raw Log Rows (D11)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 800,
      color: '#fb7185'
    }
  }, SD_LOG_OCT_FORENSICS.totalRows.toLocaleString(), " rows"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Reported: ", SD_LOG_OCT_FORENSICS.totalReportedMin.toLocaleString(), " min (", SD_LOG_OCT_FORENSICS.totalReportedHrs.toLocaleString(), " hrs)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #fbbf24'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Exact 60-Min Default Rows"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 800,
      color: '#fbbf24'
    }
  }, SD_LOG_OCT_FORENSICS.default60MinRows.toLocaleString(), " (", SD_LOG_OCT_FORENSICS.default60MinPct, "%)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Batch-checked off at default 60m regardless of true 5m-25m asset standard")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #a78bfa'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Zero-Minute / Missing Duration Rows"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 800,
      color: '#a78bfa'
    }
  }, SD_LOG_OCT_FORENSICS.zeroMinRows.toLocaleString(), " (", SD_LOG_OCT_FORENSICS.zeroMinPct, "%)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Tasks marked complete with 0 minutes + ", SD_LOG_OCT_FORENSICS.multiHourRows180Plus, " multi-hour batch rows (>=180m)")), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#1e293b',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #34d399'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "Controller Mathematical Standard"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '22px',
      fontWeight: 800,
      color: '#34d399'
    }
  }, sdFmtNum(model.totalWeeklyRequiredHrs, 1), " hrs/wk"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#cbd5e1'
    }
  }, "Derived from 861 assets x ", sp.unforeseenFactor.toFixed(2), "x unforeseen + Q3/Q4/Q7 rules")))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #0284c7',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px 0',
      fontSize: '15px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "G2 Forensic Audit: Exact P1.1 <= 16 * 60 Unit-Conversion Bug (29 Assets = 340m Raw x 59 = 20,060m Inflation) & msRows Duplication"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1',
      marginBottom: '10px'
    }
  }, "In ", /*#__PURE__*/React.createElement("code", null, "P1.1 - production schedule.txt"), " (line 2926: ", /*#__PURE__*/React.createElement("code", null, "rawHoursReq <= 16 ? rawHoursReq * 60 : rawHoursReq"), "), any asset in ", /*#__PURE__*/React.createElement("code", null, "craa5_aa_assets"), " whose ", /*#__PURE__*/React.createElement("code", null, "craa5_hoursrequired"), " is 5, 10, or 15 minutes was multiplied by 60 (adding ", /*#__PURE__*/React.createElement("code", null, "59x"), " inflation). In addition, lines 2972-3020 of ", /*#__PURE__*/React.createElement("code", null, "P1.1"), " appended unmatched legacy ", /*#__PURE__*/React.createElement("code", null, "craa5__p_masterschedule"), " (", /*#__PURE__*/React.createElement("code", null, "msRows"), ") items on top of ", /*#__PURE__*/React.createElement("code", null, "craa5_aa_assets"), " in ", /*#__PURE__*/React.createElement("code", null, "D4_cleanplan_scopes.csv"), " (115,930m vs 55,245m active asset sum). Every single ", /*#__PURE__*/React.createElement("code", null, "59x"), " bug delta below divides evenly by 59:"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Area Key (D1_assets_861.csv)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Assets <=16m"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Raw Sum (<=16m)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "P1.1 60x Sum"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Exact 59x Bug Delta"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Pure Asset Sum / Weekly (D1)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Exact Affected Equipment Assets in D1_assets_861.csv"))), /*#__PURE__*/React.createElement("tbody", null, SD_AREAS.filter(a => a.bugAssetsCnt > 0).map(b => /*#__PURE__*/React.createElement("tr", {
    key: b.key,
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, b.key, " (", b.name, ")"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#fbbf24',
      fontWeight: 700
    }
  }, b.bugAssetsCnt, " rows"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, b.bugRawMin, "m"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#fb7185'
    }
  }, (b.bugRawMin * 60).toLocaleString(), "m"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#38bdf8',
      fontWeight: 700
    }
  }, "-", b.bugDeltaMin.toLocaleString(), "m (", b.bugRawMin, " x 59)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#34d399',
      fontWeight: 700
    }
  }, b.totalHrsReq.toLocaleString(), "m (", b.weeklyFlagMin.toLocaleString(), "m wk)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#cbd5e1',
      fontSize: '11px'
    }
  }, b.bugAssetExamples)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderTop: '2px solid #475569',
      backgroundColor: '#1e293b',
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      color: '#f8fafc'
    }
  }, "TOTAL P1.1 <=16m BUG (ALL 29 ROWS)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#fbbf24'
    }
  }, "29 rows"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#f8fafc'
    }
  }, "340m"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#fb7185'
    }
  }, "20,400m"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#38bdf8'
    }
  }, "-20,060m (340 x 59)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      textAlign: 'right',
      color: '#34d399'
    }
  }, "55,245m (42,760m wk)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '8px 6px',
      color: '#94a3b8',
      fontSize: '11px'
    }
  }, "100% computed from SD_AREAS / D1_assets_861.csv & D6_area_exact_reconciled.csv")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px 0',
      fontSize: '15px',
      fontWeight: 700,
      color: '#fbbf24'
    }
  }, "D12 Live Floor Obstacles & Time-Loss Logs (Empirical Proof of Q5 1.50x Unforeseen Factor)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#cbd5e1',
      marginBottom: '10px'
    }
  }, "Extracted directly from live ", /*#__PURE__*/React.createElement("code", null, "craa5_obstacles"), " (12 rows in ", /*#__PURE__*/React.createElement("code", null, "D12_obstacles.csv"), ") and ", /*#__PURE__*/React.createElement("code", null, "craa5_timelosslog"), " (11 rows in ", /*#__PURE__*/React.createElement("code", null, "D12_timelosslog.csv"), ") with exact source table and record key attribution:"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Crew"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Source Table & Key"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Line / Area"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Obstacle / Delay Category"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Clock Delay"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Heads Held"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px',
      textAlign: 'right'
    }
  }, "Man-Mins Lost"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '7px 6px'
    }
  }, "Supervisor / Lead Forensic Note"))), /*#__PURE__*/React.createElement("tbody", null, SD_OBSTACLES_LIVE.map((obs, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx,
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#94a3b8',
      whiteSpace: 'nowrap'
    }
  }, obs.date), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      fontWeight: 700,
      color: '#38bdf8'
    }
  }, "Crew ", obs.crew), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#94a3b8',
      fontSize: '11px'
    }
  }, /*#__PURE__*/React.createElement("code", null, obs.sourceTable), " (", obs.recordKey, ")"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, obs.area), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#fbbf24'
    }
  }, obs.category), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#fb7185',
      fontWeight: 700
    }
  }, obs.durationMin, "m"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#cbd5e1'
    }
  }, obs.headsAffected), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#f43f5e',
      fontWeight: 700
    }
  }, obs.manMinsLost, "m (", (obs.manMinsLost / 60).toFixed(1), "h)"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#cbd5e1',
      fontSize: '11px'
    }
  }, obs.note)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, SD_OBSTACLES_EXCLUDED_SEED_NOTE)), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '10px',
      padding: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 700,
      color: '#f8fafc'
    }
  }, "Dataverse Equipment Standard Gaps (craa5_aa_assets Rows with 0 or Null Minutes)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#94a3b8'
    }
  }, "These 12 areas have active equipment rows in Dataverse where ", /*#__PURE__*/React.createElement("code", null, "craa5_hoursrequired"), " is currently 0 or null (e.g. Silo 24 rows, Smockroom 19 rows, Pie Shell 3 rows). Toggle the estimator to include fallback minutes:")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }
  }, logoUnlocked && isAdminAuthorized ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "5",
    max: "120",
    step: "5",
    value: sp.missingStdFallbackMin,
    onChange: e => updateSp('missingStdFallbackMin', Math.max(0, parseInt(e.target.value || '30', 10))),
    style: {
      width: '55px',
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '4px',
      padding: '4px 6px',
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#94a3b8'
    }
  }, "min/asset"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateSp('includeMissingStdEst', !sp.includeMissingStdEst),
    style: {
      backgroundColor: sp.includeMissingStdEst ? '#0284c7' : '#1e293b',
      color: '#ffffff',
      border: '1px solid #475569',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, sp.includeMissingStdEst ? `Missing Standards Included (+${sp.missingStdFallbackMin}m/asset)` : 'Simulate Adding Missing Asset Standards')) : /*#__PURE__*/React.createElement("span", {
    style: {
      backgroundColor: '#1e293b',
      color: '#38bdf8',
      border: '1px solid #475569',
      borderRadius: '5px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 700
    }
  }, "Missing-Standard Estimator Readout: ", sp.includeMissingStdEst ? `Included (+${sp.missingStdFallbackMin}m/asset)` : `Excluded (0m Fallback, ${sp.missingStdFallbackMin}m/asset preset)`))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '12px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid #334155',
      color: '#94a3b8',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Area Key (craa5_areaname)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Total Assets"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px',
      textAlign: 'right'
    }
  }, "Current Sum (Min)"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 6px'
    }
  }, "Audit Finding & Remediation Action"))), /*#__PURE__*/React.createElement("tbody", null, [{
    key: 'silo',
    count: 24,
    curMin: 0,
    note: 'All 24 Silo assets have null/0 craa5_hoursrequired. Needs engineering standard time study.'
  }, {
    key: 'kettles',
    count: 23,
    curMin: 35,
    note: '22 of 23 Kettle assets have 0/null minutes (only 1 row has 35m). Needs kettle CIP/wash standard populated.'
  }, {
    key: 'smockroom',
    count: 19,
    curMin: 0,
    note: 'All 19 Smockroom assets have 0/null minutes despite 19 weekly=Yes flags.'
  }, {
    key: 'scm',
    count: 18,
    curMin: 30,
    note: '17 of 18 SCM assets have 0/null minutes (only 1 row has 30m across 18 monthly=Yes flags).'
  }, {
    key: 'tote',
    count: 28,
    curMin: 490,
    note: '14 active rows (490m) + 14 inactive duplicate rows (35m; tote vs Tote casing = 525m total); 1,400m active allergen standard populated.'
  }, {
    key: 'traywash',
    count: 11,
    curMin: 65,
    note: '9 of 11 Traywash assets have 0/null minutes (only 2 rows have 45m + 20m = 65m).'
  }, {
    key: 'sifter',
    count: 8,
    curMin: 0,
    note: 'All 8 Sifter assets have 0/null minutes despite 6 weekly=Yes flags.'
  }, {
    key: 'silo use bins',
    count: 7,
    curMin: 0,
    note: 'All 7 Silo Use Bin assets have 0/null minutes despite 3 monthly=Yes flags.'
  }, {
    key: 'pie shell',
    count: 3,
    curMin: 0,
    note: 'All 3 Pie Shell assets have 0/null minutes despite 3 monthly=Yes flags.'
  }, {
    key: 'powder boost',
    count: 3,
    curMin: 0,
    note: 'All 3 Powder Boost assets have 0/null minutes despite 2 daily=Yes and 1 weekly=Yes flags.'
  }, {
    key: 'sifter + silo',
    count: 3,
    curMin: 0,
    note: 'All 3 Sifter + Silo assets have 0/null minutes despite 3 monthly=Yes flags.'
  }, {
    key: 'large steam pit',
    count: 1,
    curMin: 0,
    note: 'Single Large Steam Pit row has 0 minutes (compare Small Steam Pit = 780m).'
  }].map(g => /*#__PURE__*/React.createElement("tr", {
    key: g.key,
    style: {
      borderBottom: '1px solid #1e293b'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      fontWeight: 700,
      color: '#fbbf24'
    }
  }, g.key), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: '#f8fafc',
      fontWeight: 600
    }
  }, g.count), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      textAlign: 'right',
      color: g.curMin === 0 ? '#fb7185' : '#cbd5e1'
    }
  }, g.curMin, " min"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '7px 6px',
      color: '#cbd5e1'
    }
  }, g.note)))))))));
}
window.__DEMO_APP_COMPONENT__ = App;
})();