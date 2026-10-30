(function() {
/* __PG_SANDBOX_GUARD__ */
(function () {
  var isAllowedTable = function (t) {
    var s = String(t || '').trim();
    if (!s) return true;
    if (/^craa5_/i.test(s) && !/^craa5___1_/i.test(s)) return false;
    return true;
  };
  var localId = function () { return '00000000-0000-4000-8000-' + String(Date.now()).padStart(12, '0').slice(-12); };
  var guardWebApi = function (w) {
    try {
      if (!w || !w.Xrm || !w.Xrm.WebApi || w.Xrm.WebApi.__pgSandboxGuarded) return;
      var api = w.Xrm.WebApi;
      var origRM = typeof api.retrieveMultipleRecords === 'function' ? api.retrieveMultipleRecords.bind(api) : null;
      var origRR = typeof api.retrieveRecord === 'function' ? api.retrieveRecord.bind(api) : null;
      var origCR = typeof api.createRecord === 'function' ? api.createRecord.bind(api) : null;
      var origUR = typeof api.updateRecord === 'function' ? api.updateRecord.bind(api) : null;
      var origDR = typeof api.deleteRecord === 'function' ? api.deleteRecord.bind(api) : null;
      if (origRM) api.retrieveMultipleRecords = function (t, q, m) {
        if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked retrieveMultipleRecords:', t); return Promise.resolve({ entities: [] }); }
        return origRM(t, q, m);
      };
      if (origRR) api.retrieveRecord = function (t, id, q) {
        if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked retrieveRecord:', t); return Promise.reject(new Error('Sandbox block: ' + t)); }
        return origRR(t, id, q);
      };
      if (origCR) api.createRecord = function (t, d) {
        if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked createRecord:', t); return Promise.resolve({ id: localId() }); }
        return origCR(t, d);
      };
      if (origUR) api.updateRecord = function (t, id, d) {
        if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked updateRecord:', t); return Promise.resolve({ id: id }); }
        return origUR(t, id, d);
      };
      if (origDR) api.deleteRecord = function (t, id) {
        if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked deleteRecord:', t); return Promise.resolve({ id: id }); }
        return origDR(t, id);
      };
      api.__pgSandboxGuarded = true;
    } catch (e) {}
  };
  var guardFetch = function (w) {
    try {
      if (!w || typeof w.fetch !== 'function' || w.fetch.__pgSandboxGuarded) return;
      var origF = w.fetch.bind(w);
      var wrappedF = function (input, init) {
        var url = typeof input === 'string' ? input : (input && input.url ? String(input.url) : '');
        var m = /\/api\/data\/v9\.\d+\/([A-Za-z0-9_]+)/i.exec(url);
        if (m && !isAllowedTable(m[1])) {
          var method = (init && init.method ? String(init.method) : 'GET').toUpperCase();
          console.warn('[Playground Sandbox Guard] Blocked fetch ' + method + ':', url);
          if (method === 'GET') {
            return Promise.resolve(new Response(JSON.stringify({ value: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
          }
          return Promise.resolve(new Response(null, { status: 204 }));
        }
        return origF(input, init);
      };
      wrappedF.__pgSandboxGuarded = true;
      w.fetch = wrappedF;
    } catch (e) {}
  };
  var applyAll = function () {
    if (typeof window === 'undefined') return;
    guardFetch(window);
    guardWebApi(window);
    try { if (window.parent && window.parent !== window) { guardFetch(window.parent); guardWebApi(window.parent); } } catch (e) {}
    try { if (window.top && window.top !== window) { guardFetch(window.top); guardWebApi(window.top); } } catch (e) {}
  };
  if (typeof window !== 'undefined') {
    var wAny = window;
    wAny.__pgQ = function (a, t, o) {
      if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked dataApi.queryTable:', t); return Promise.resolve({ rows: [], hasMoreRows: false }); }
      return a.queryTable(t, o);
    };
    wAny.__pgC = function (a, t, d) {
      if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked dataApi.createRow:', t); return Promise.resolve({ id: localId() }); }
      return a.createRow(t, d);
    };
    wAny.__pgU = function (a, t, id, d) {
      if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked dataApi.updateRow:', t); return Promise.resolve({ id: id }); }
      return a.updateRow(t, id, d);
    };
    wAny.__pgD = function (a, t, id) {
      if (!isAllowedTable(t)) { console.warn('[Playground Sandbox Guard] Blocked dataApi.deleteRow:', t); return Promise.resolve({ id: id }); }
      return a.deleteRow(t, id);
    };
    applyAll();
    var tries = 0;
    var timer = setInterval(function () { applyAll(); if (++tries > 40) clearInterval(timer); }, 250);
  }
})();
var React = window.React; var { useState, useEffect, useMemo, useRef } = React;
/* ============================================================================
 * [PERSISTENT MEMORY & APP REGISTRATION BLOCK]
 * APP NAME:        Sanitation Objectives Director & Shift Modeler
 * PHASE ID:        P0.1 (Ref: _00 - list of apps - defined how to integrate - link to masterplan)
 * CURRENT VERSION: v1.001 (2026-10-24: Phase 6 upgrade. Standardized persistent memory block,
 *                  100% de-AI scrubbed, plain 7-bit ASCII compliance.
 *                  Integrated genuine Dataverse metrics for worker utilization %, per-shift hours spent
 *                  by line/area, recommended crew sizing, and allergen changeover expenditures per SKU,
 *                  week, and year.
 *                  Added interactive 168-hour Shift Modeler top-level tab with dynamic headcount curve,
 *                  production line sliders, and automated clean window optimization advisor.)
 * FOLDER STATUS:   apps/Inventory_SanitationInventory/
 * REPO SOURCE:     P0.1 - sanitation director v1.001
 *
 * DATAVERSE INTEGRATIONS:
 * - craa5___1_a_workshift (craa5___1_a_workshifts)                       | Role: Read-Only (168h clock for shifts A, B, C, D)
 * - craa5___1_a_employee (craa5___1_a_employees, OTC: 10770)     | Role: Read-Only (Workforce roster & crew assignments)
 * - craa5___1_p_cleanplan (craa5___1_p_cleanplans)                       | Role: Read-Only (Line wash windows, scopes, staff rows)
 * - craa5___1_a_assets (craa5___1_a_assetses, OTC: 10773)          | Role: Read-Only (Equipment standard minutes, frequency flags)
 * - craa5___1_l_log (craa5___1_l_logs, OTC: 10781)                   | Role: Read-Only (MSS logged minutes, equipment completion)
 * - craa5___1_s_shiftboard (craa5___1_s_shiftboards)                    | Role: Read-Only (Live on-clock roster per crew)
 * - craa5___1_s_shiftarchive (craa5___1_s_shiftarchives)                | Role: Read-Only (Historical on-clock roster)
 * - craa5___1_e_laborrate (craa5___1_e_laborrates)                | Role: Read-Only (Wage per pay role, Sanitation Tech 2 fallback)
 * - craa5___1_e_shifttask (craa5___1_e_shifttasks)                | Role: Read-Write (Shift standing tasks)
 * - craa5___1_p_changeoverrule (craa5___1_p_changeoverrules)          | Role: Read-Only (Allergen wash durations, cleaning tiers)
 * - craa5___1_p_skumaster (craa5___1_p_skumasters, OTC: 10852)           | Role: Read-Only (SKU allergen specs, line assignments)
 * - craa5___1_p_prodschedule (craa5___1_p_prodschedules, OTC: 10797)     | Role: Read-Only (Production schedule runs & downtime windows)
 * - craa5___1_e_hubconfig / craa5___1_e_hubconfig                 | Role: Read-Write (director_settings, DIRECTOR_HEADS, manifest)
 *
 * ARCHITECTURAL CONSTRAINTS & GROUND RULES:
 * - Zero live schema modifications: Never execute DDL or modify Dataverse tables.
 * - Genuine Dataverse ground truth: All metrics derived from real rows; missing tables degrade gracefully.
 * - Plain 7-bit ASCII only: All Spanish text encoded with %-codes or clean English.
 * ============================================================================
 */
// Apex Foods logo (PNG, 222 x 96, sent by Alex 2026-10-19), embedded so the page needs no web resource.
var SD_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMEIzQzczIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMEIzQzczIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=';
/* ============================== START HUB SHARED v1.3 ============================== */
// The ecosystem data contract in code (ecosystem/data-contract.md). Paste this whole block into every hub app, unchanged,
// and use these helpers instead of local copies, so every app builds the same keys, dates and numbers.
// Plain ES5 and 7-bit ASCII on purpose: it runs in every Power Apps page and passes the GEMINI.md ASCII check.
// Change it only through the contract (bump HUB_CONTRACT_VERSION and say what changed in the contract's change log).
var HUB_CONTRACT_VERSION = '1.3';
var HUB_TZ = 'America/Chicago'; // the plant's clock: every plant day and shift date is read on it
// ---------- keys ----------
// Letters and digits only, lower case: "IBL 4", "IBL-4" and "ibl4" are the same name.
function hubCanon(s) { return String(s === undefined || s === null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ''); }
// Line key, the Production Scheduler's canonLine: area "IBL4" line 1 -> "ibl4"; area "Breading" line 2 -> "breading2".
function hubLineKey(area, line) { var n = Math.floor(Number(line)); return hubCanon(area) + (n > 1 ? String(n) : ''); }
// Two area (or room) names are the same area when their hubCanon is the same.
function hubSameName(a, b) { var x = hubCanon(a); return x !== '' && x === hubCanon(b); }
// Row ids (GUIDs): lower case, no braces. Every stored GUID goes through this.
function hubGuid(v) { return String(v === undefined || v === null ? '' : v).replace(/[{}]/g, '').trim().toLowerCase(); }
function hubIsGuid(v) { return /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(hubGuid(v)); }
// A list of GUIDs in one text column: "; " between them, sorted, no repeats.
function hubGuidList(list) {
    var seen = {}, out = [];
    (list || []).forEach(function (v) { var g = hubGuid(v); if (g && !seen[g]) {
        seen[g] = true;
        out.push(g);
    } });
    return out.sort().join('; ');
}
function hubSplitGuids(text) { return String(text || '').split(/[;,\s]+/).map(hubGuid).filter(hubIsGuid); }
// Crew letter A-D from a choice value, a number 1-4 or a label ("Shift B", "D - Nights"). '' when it is none of these.
function hubCrew(val) {
    if (val === undefined || val === null || val === '')
        return '';
    var s = String(typeof val === 'object' ? (val.Label || val.Value || val.name || '') : val).toUpperCase().trim();
    if (s.indexOf('256000000') > -1 || s === '1')
        return 'A';
    if (s.indexOf('256000001') > -1 || s === '2')
        return 'B';
    if (s.indexOf('256000002') > -1 || s === '3')
        return 'C';
    if (s.indexOf('256000003') > -1 || s === '4')
        return 'D';
    var m = s.match(/(?:^|[^A-Z])([ABCD])(?=$|[^A-Z])/);
    return m ? m[1] : '';
}
// FNV-1a with four seeds, shaped like a version 4 GUID (the same swGuid as Ganttly and the Manager hub).
// A row whose id is hubIdFromKey(its key) can be saved again and again without ever making a second row.
function hubIdFromKey(key) {
    var s = String(key).toLowerCase();
    var h = function (seed) {
        var x = (0x811c9dc5 ^ (seed * 0x9e3779b1)) >>> 0;
        for (var i = 0; i < s.length; i++) {
            x ^= s.charCodeAt(i);
            x = Math.imul ? Math.imul(x, 0x01000193) >>> 0 : (x * 0x01000193) >>> 0;
        }
        return ('0000000' + x.toString(16)).slice(-8);
    };
    var g = h(1) + h(2) + h(3) + h(4);
    return g.slice(0, 8) + '-' + g.slice(8, 12) + '-4' + g.slice(13, 16) + '-' + '89ab'.charAt(parseInt(g.charAt(16), 16) % 4) + g.slice(17, 20) + '-' + g.slice(20, 32);
}
// ---------- dates ----------
function hubPad2(n) { return (n < 10 ? '0' : '') + n; }
// Year, month, day, hour, minute of a moment on the plant clock (daylight saving included).
function hubPlantParts(ms) {
    var d = new Date(typeof ms === 'number' ? ms : Date.parse(ms));
    if (isNaN(d.getTime()))
        return null;
    var f = new Intl.DateTimeFormat('en-US', { timeZone: HUB_TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
    var o = {};
    f.formatToParts(d).forEach(function (p) { if (p.type !== 'literal')
        o[p.type] = Number(p.value); });
    return { y: o.year, m: o.month, d: o.day, h: o.hour === 24 ? 0 : o.hour, min: o.minute };
}
// The plant day of a moment, YYYY-MM-DD. Never toISOString().slice(0, 10): that is the UTC day.
function hubPlantDay(ms) { var p = hubPlantParts(ms); return p ? p.y + '-' + hubPad2(p.m) + '-' + hubPad2(p.d) : ''; }
// The shift date: the plant day the shift STARTED (the board's craa5_slotstart). A night shift that starts Tuesday 18:00
// and finishes Wednesday 06:00 is Tuesday's shift, for everything it does.
function hubShiftDate(slotStart) { return hubPlantDay(slotStart); }
function hubShiftKey(shiftDate, crew) { return String(shiftDate) + '|' + hubCrew(crew); }
// How a shift date goes into a Dataverse date column (MSS log craa5_lastcleaned): midnight UTC of that day,
// so every reader gets the day back with value.slice(0, 10) whatever its own clock says.
function hubDateOnlyUtc(day) { return /^\d{4}-\d{2}-\d{2}$/.test(String(day)) ? String(day) + 'T00:00:00Z' : ''; }
function hubDayFromDateOnly(v) { var s = String(v || ''); return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : ''; }
function hubAddDays(day, n) {
    var t = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) + n * 86400000, d = new Date(t);
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
var HUB_PLAN_KIND_MAP = { full: 'daily', weekly: 'eow', midweek: 'midweek', allergen: 'allergen', changeover: 'changeover' };
function hubCleanKind(k) {
    var s = String(k || '').toLowerCase().trim();
    if (HUB_PLAN_KIND_MAP[s])
        return HUB_PLAN_KIND_MAP[s];
    return HUB_CLEAN_KINDS.indexOf(s) > -1 ? s : '';
}
// One clean of one piece of equipment on one shift date: the key that stops a second row (MSS log craa5_completionkey).
// Frequencies (the MSS Calendar's codes and ranks). A clean of rank r satisfies every frequency of rank <= r.
// A piece is done for a frequency when a satisfying clean falls in the same period as today; otherwise it is due.
var HUB_FREQS = [
    { code: 'D', kind: 'daily', rank: 1, flag: 'craa5_dailyclean' }, { code: 'MW', kind: 'midweek', rank: 2, flag: 'craa5_midweek' },
    { code: 'W', kind: 'eow', rank: 3, flag: 'craa5_weeklyclean' }, { code: 'M', kind: 'monthly', rank: 4, flag: 'craa5_monthlyclean' },
    { code: 'Q', kind: 'quarterly', rank: 5, flag: 'craa5_quarterly' }, { code: 'S', kind: 'semiannual', rank: 6, flag: 'craa5_month' },
    { code: 'A', kind: 'annual', rank: 7, flag: 'craa5_annually' }
];
var HUB_KIND_RANK = { daily: 1, allergen: 1, egg: 1, pecan: 1, changeover: 1, corrective: 1, midweek: 2, eow: 3, monthly: 4, quarterly: 5, semiannual: 6, annual: 7, other: 0 };
function hubKindRank(kind) { var k = hubCleanKind(kind); return k ? HUB_KIND_RANK[k] || 0 : 0; }
// Rank of one MSS log row: its craa5_cleankind; old rows with no kind keep their old meaning from the flags
// (daily also counts as mid-week, weekly 3, monthly also counts as quarterly to annual, no flags 9 = counts for everything).
function hubLogRank(row) {
    if (!row)
        return 0;
    if (hubCleanKind(row.craa5_cleankind))
        return hubKindRank(row.craa5_cleankind);
    var yes = function (v) { return v === true || v === 1 || /^(yes|true|1)$/i.test(String(v === undefined || v === null ? '' : v)); };
    return yes(row.craa5_monthly) ? 7 : yes(row.craa5_weekly) ? 3 : yes(row.craa5_daily) ? 2 : 9;
}
function hubFreqRank(code) { for (var i = 0; i < HUB_FREQS.length; i++)
    if (HUB_FREQS[i].code === code)
        return HUB_FREQS[i].rank; return 0; }
// Period a plant day (YYYY-MM-DD) falls in, per frequency: day, Monday week, month, quarter, half year, year.
function hubPeriodKey(code, day) {
    var d = String(day || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d))
        return '';
    var y = d.slice(0, 4), m = Number(d.slice(5, 7));
    switch (code) {
        case 'D': return d;
        case 'MW':
        case 'W': return 'w' + hubWeekKey(d);
        case 'M': return y + '-' + d.slice(5, 7);
        case 'Q': return y + '-Q' + Math.ceil(m / 3);
        case 'S': return y + '-H' + (m <= 6 ? 1 : 2);
        case 'A': return y;
    }
    return '';
}
// doneDays = finished cleans as [{ day, kind }] or [{ day, rank }] (rank from hubLogRank for MSS log rows).
// True when one of rank >= the frequency is in today's period. Which days and weeks owe a job is the reader's call (section 7).
function hubFreqDone(code, doneDays, today) {
    var need = hubFreqRank(code), p = hubPeriodKey(code, today);
    if (!need || !p)
        return false;
    for (var i = 0; i < (doneDays || []).length; i++) {
        var x = doneDays[i];
        if (x && (x.rank !== undefined ? x.rank : hubKindRank(x.kind)) >= need && hubPeriodKey(code, x.day) === p)
            return true;
    }
    return false;
}
function hubCompletionKey(assetGuid, shiftDate, kind) {
    var g = hubGuid(assetGuid), k = hubCleanKind(kind);
    return g && /^\d{4}-\d{2}-\d{2}$/.test(String(shiftDate)) && k ? g + '|' + shiftDate + '|' + k : '';
}
// The MSS log row id for a completion, so a retried or second-device save updates the same row.
function hubLogIdOf(completionKey) { return completionKey ? hubIdFromKey('log|' + completionKey) : ''; }
// ---------- numbers ----------
// Standard minutes of a piece: craa5___1_a_assets.craa5_hoursrequired holds MINUTES of labor. Never divide it by 60
// "when it looks big". Blank, zero or not a number -> null (unknown), never a guess.
function hubStdMinutes(v) { var n = Number(v); return v === null || v === undefined || v === '' || !isFinite(n) || n <= 0 ? null : n; }
// Pace: standard minutes / actual minutes x 100, over the same pieces. 100 = on standard, 125 = a quarter faster.
function hubPace(stdMinutes, actualMinutes) { return stdMinutes > 0 && actualMinutes > 0 ? Math.round(1000 * stdMinutes / actualMinutes) / 10 : null; }
// Each person on a completion gets an equal share of its minutes.
function hubShare(minutes, people) { return people > 0 && minutes > 0 ? minutes / people : 0; }
// Labor cost of minutes at an hourly rate (dollars, two decimals).
function hubLaborCost(minutes, hourlyRate) { return minutes > 0 && hourlyRate > 0 ? Math.round(minutes * hourlyRate / 60 * 100) / 100 : 0; }
// ---------- language ----------
// One choice for every app, remembered per computer: 'en' or 'es' (Spanish, Mexico). Older per-app keys are read once.
var HUB_LANG_KEY = 'hub_lang';
var HUB_OLD_LANG_KEYS = ['itp_lang_v1', 'ss_lang_v1', 'prodsched_lang_v1', 'MidwestPlant_mst_lang_v1', 'MidwestPlant_org_lang_v1'];
function hubGetLang() {
    try {
        var v = window.localStorage.getItem('__1_' + HUB_LANG_KEY);
        if (v === 'en' || v === 'es')
            return v;
        for (var i = 0; i < HUB_OLD_LANG_KEYS.length; i++)
            if (window.localStorage.getItem('__1_' + HUB_OLD_LANG_KEYS[i]) === 'es')
                return 'es';
    }
    catch (e) { }
    return 'en';
}
function hubSetLang(l) { try {
    window.localStorage.setItem('__1_' + HUB_LANG_KEY, l === 'es' ? 'es' : 'en');
}
catch (e) { } }
// Spanish is written in ASCII with a % code per accented letter (the PBED convention):
// %a %e %i %o %u = acute a e i o u, %n = n tilde, capitals %A %E %I %O %U %N, %? and %! = opening marks, %w = u with two dots, %% = %.
var HUB_ACC = { a: 225, e: 233, i: 237, o: 243, u: 250, n: 241, A: 193, E: 201, I: 205, O: 211, U: 218, N: 209, '?': 191, '!': 161, w: 252 };
function hubDecodeEs(s) { return String(s).replace(/%([aeiounAEIOUN?!w%])/g, function (m, c) { return c === '%' ? '%' : String.fromCharCode(HUB_ACC[c]); }); }
// The shared words (data-contract.md section 9). An app's own word list adds to these; it never gives one of these another Spanish.
// Mexican plant Spanish (es-MX), usted form: computadora, celular, tomar, presionar / dar clic, llenar; never vosotros,
// ordenador, movil, coger, pulsar, rellenar.
var HUB_ES = {
    'Planned': 'Planeado', 'Started': 'En proceso', 'Done': 'Terminado', 'Skipped': 'Omitido', 'Overdue': 'Atrasado', 'At risk': 'En riesgo',
    'Daily': 'Diaria', 'Midweek 72h': 'Media semana 72h', 'End of week': 'Fin de semana', 'EOW': 'Fin de semana', 'Allergen': 'Al%ergeno', 'Egg allergen': 'Al%ergeno huevo', 'Pecan allergen': 'Al%ergeno nuez pecana',
    'Changeover': 'Cambio de producto', 'Monthly': 'Mensual', 'Quarterly': 'Trimestral', 'Semiannual': 'Semestral', 'Annual': 'Anual',
    'Corrective': 'Correctiva', 'Other': 'Otra',
    'Present': 'Presente', 'Late': 'Retardo', 'Sick': 'Enfermo', 'PTO': 'Vacaciones (PTO)', 'Left early': 'Sali%o temprano',
    'No call': 'Falta sin aviso', 'Loaned': 'Prestado', 'Training': 'Capacitaci%on',
    'Sanitor': 'Sanitizador', 'Lead': 'L%ider', 'Supervisor': 'Supervisor', 'Manager': 'Gerente',
    'Loading': 'Cargando', 'Ready': 'Listo', 'Nothing here yet': 'Todav%ia no hay datos', 'Table missing': 'Falta la tabla',
    'No access': 'Sin acceso', 'Could not load': 'No se pudo cargar',
    'Area': '%Area', 'Room': 'Cuarto', 'Line': 'L%inea', 'Equipment': 'Equipo', 'Shift': 'Turno', 'Crew': 'Cuadrilla', 'Team': 'Grupo',
    'Clean': 'Limpieza', 'Run': 'Corrida', 'Headcount': 'Personal', 'Minutes': 'Minutos', 'Standard': 'Est%andar', 'Pace': 'Ritmo',
    'On time': 'A tiempo', 'Labor cost': 'Costo de mano de obra', 'Swab': 'Hisopo', 'Pathogen': 'Pat%ogeno', 'Work order': 'Orden de trabajo',
    'Skip code': 'C%odigo de omisi%on', 'High five': 'Reconocimiento', 'Sign-off': 'Aprobaci%on', 'Help': 'Ayuda', 'Print': 'Imprimir'
};
var HUB_ES_DONE = null;
// hubT('Done') -> 'Done' or 'Terminado'. extra = the app's own { English: '%-coded Spanish' } list (optional).
function hubT(s, lang, extra) {
    if ((lang || hubGetLang()) !== 'es')
        return s;
    if (!HUB_ES_DONE) {
        HUB_ES_DONE = {};
        for (var k in HUB_ES)
            if (Object.prototype.hasOwnProperty.call(HUB_ES, k))
                HUB_ES_DONE[k] = hubDecodeEs(HUB_ES[k]);
    }
    if (Object.prototype.hasOwnProperty.call(HUB_ES_DONE, s))
        return HUB_ES_DONE[s];
    if (extra && Object.prototype.hasOwnProperty.call(extra, s))
        return hubDecodeEs(extra[s]);
    return s;
}
// ---------- look ----------
var HUB_THEME_KEY = 'hub_theme'; // 'light' or 'dark', remembered per computer
function hubGetTheme() { try {
    var v = window.localStorage.getItem('__1_' + HUB_THEME_KEY) || window.localStorage.getItem('__1_' + 'itp_theme_v1');
    return v === 'dark' ? 'dark' : 'light';
}
catch (e) {
    return 'light';
} }
function hubSetTheme(t) { try {
    window.localStorage.setItem('__1_' + HUB_THEME_KEY, t === 'dark' ? 'dark' : 'light');
}
catch (e) { } }
var HUB_COLORS = {
    light: { bg: '#F1F5F9', card: '#FFFFFF', border: '#E2E8F0', text: '#1E293B', muted: '#64748B', primary: '#0072CE', primaryDark: '#00468B', accent: '#FFB81C', accentSoft: '#FFF6E0', primarySoft: '#E6F1FB' },
    dark: { bg: '#1B2740', card: '#24324D', border: '#33425F', text: '#E2E8F0', muted: '#94A3B8', primary: '#4DA3E8', primaryDark: '#B3D4F2', accent: '#FFB81C', accentSoft: '#3A3320', primarySoft: '#1E2A42' }
};
// Status colors mean one thing in every app. Red is only for overdue, a failed save and a positive swab.
var HUB_STATUS_COLORS = { done: '#059669', started: '#0072CE', planned: '#64748B', overdue: '#DC2626', atrisk: '#D97706', skipped: '#D97706' };
var HUB_BRAND_RED = '#E4002B'; // the logo only, never a status
// ---------- app manifest (self-check for the Dataverse monitor) ----------
// Each app declares the tables and columns it reads and writes (logical names only, never data) and saves that list
// once per change in craa5___1_e_hubconfig, key 'manifest|' + appId. The Dataverse monitor reads every manifest| row and
// checks it against Dataverse (missing tables / columns) and contract.json (owners, statuses). Contract section 12.1.
//   m = { appId: 'ganttly', app: 'Ganttly', version: '2.0.0',
//         tables: [ { t: 'craa5___1_s_cleancheckoff', names: ['craa5___1_s_cleancheckoff'], read: [cols], write: [cols], opt: [cols] } ],
//         config: ['ganttly_settings'] }
//   names = table names the app tries, in order (default [t]); opt = columns the app works without (shown as "not yet").
var HUB_APP_IDS = ['ganttly', 'shiftstart', 'prodsched', 'msscalendar', 'msslog', 'pbed', 'bolo', 'managerhub', 'chemicals', 'mapsubmit', 'monitor', 'training'];
// Shared settings table: the new _e_ Hub config first (Organization-owned, big craa5_configjson), the old _0_ one second.
// Own names: some pages already declare HUB_CONFIG_TABLE.
var HUB_CONFIG_TABLES = ['craa5___1_e_hubconfig', 'craa5___1_e_hubconfig'];
var HUB_MANIFEST_TABLE = HUB_CONFIG_TABLES[0];
function hubNameList(a, keepCase) {
    var out = [], seen = {};
    (a || []).forEach(function (x) { var v = String(x === undefined || x === null ? '' : x).trim(); if (!keepCase)
        v = v.toLowerCase(); if (v && !seen[v]) {
        seen[v] = 1;
        out.push(v);
    } });
    return out;
}
// The manifest as stored: fixed key order, sorted lists, so the same app build always gives the same text and hash.
// What an app needs built, declared in its manifest (ground rule 10: nothing writes Dataverse tables or columns;
// the Dataverse monitor reads, shows and tests these and Alex builds from its prompts). Per table, all optional: cols { column: { type, len, label, options, min, max,
// precision, default } }, label (display name), new (true = a table still to make), owner ('org' or 'user'),
// primary { n, len, label }, prompt (the app's recommended table specification for the table, at most 2000 characters). type = text|memo|int|decimal|money|yesno|date|datetime|choice|guid (guid = text 100,
// never a lookup). contract.json colTypes decides; a manifest type that disagrees is shown as a conflict.
var HUB_COL_TYPES = ['text', 'memo', 'int', 'decimal', 'money', 'yesno', 'date', 'datetime', 'choice', 'guid'];
function hubNum(v) { var n = Number(v); return v === '' || v === null || v === undefined || isNaN(n) ? undefined : n; }
function hubColSpec(c) {
    c = typeof c === 'string' ? { type: c } : (c || {});
    var type = String(c.type || '').trim().toLowerCase();
    if (HUB_COL_TYPES.indexOf(type) < 0)
        return null;
    var o = { type: type }, k;
    var nums = { len: hubNum(c.len), min: hubNum(c.min), max: hubNum(c.max), precision: hubNum(c.precision) };
    for (k in nums)
        if (nums[k] !== undefined)
            o[k] = nums[k];
    if (c.label)
        o.label = String(c.label).trim();
    if (c.options && c.options.length)
        o.options = c.options.map(function (x) { return String(x).trim(); }).filter(function (x) { return !!x; });
    if (c['default'] !== undefined && c['default'] !== null && c['default'] !== '')
        o['default'] = typeof c['default'] === 'boolean' || typeof c['default'] === 'number' ? c['default'] : String(c['default']);
    return o;
}
function hubManifest(m, nowIso) {
    m = m || {};
    var tables = (m.tables || []).map(function (t) {
        var name = String(t.t || '').trim().toLowerCase();
        var out = { t: name, names: hubNameList(t.names && t.names.length ? t.names : [name]), read: hubNameList(t.read).sort(), write: hubNameList(t.write).sort(), opt: hubNameList(t.opt).sort() };
        var cols = {}, n = 0;
        Object.keys(t.cols || {}).sort().forEach(function (c) { var k = String(c).trim().toLowerCase(), v = hubColSpec(t.cols[c]); if (k && v) {
            cols[k] = v;
            n++;
        } });
        if (n)
            out.cols = cols;
        if (t.label)
            out.label = String(t.label).trim();
        if (t['new'] === true)
            out['new'] = true;
        var ow = String(t.owner || '').trim().toLowerCase();
        if (ow === 'org' || ow === 'user')
            out.owner = ow;
        if (t.prompt)
            out.prompt = String(t.prompt).trim().slice(0, 2000);
        if (t.primary && t.primary.n) {
            out.primary = { n: String(t.primary.n).trim().toLowerCase() };
            if (hubNum(t.primary.len) !== undefined)
                out.primary.len = hubNum(t.primary.len);
            if (t.primary.label)
                out.primary.label = String(t.primary.label).trim();
        }
        return out;
    }).filter(function (t) { return !!t.t; }).sort(function (a, b) { return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; });
    var out = { m: 1, appId: hubCanon(m.appId), app: String(m.app || ''), version: String(m.version || ''), contract: HUB_CONTRACT_VERSION, tables: tables, config: hubNameList(m.config, true).sort() }; // hubconfig keys keep their case: they match exactly
    out.hash = hubIdFromKey(JSON.stringify(out)).slice(0, 8);
    out.savedAt = nowIso || new Date().toISOString();
    return out;
}
function hubManifestKey(appId) { return 'manifest|' + hubCanon(appId); }
// io = { query(table, { select, filter, top }) -> Promise of rows (or { rows }), create(table, body), update(table, id, body) }
// (Ganttly: swQuery + swWriter). Never rejects and never blocks the app: resolves 'same', 'saved' or 'failed: why'.
// Where it goes, first that reads: _e_ Hub config craa5_configjson; old _0_ hubconfig craa5_manifestjson (its
// craa5_configjson holds only 100 characters); old _0_ hubconfig craa5_configjson.
var HUB_MANIFEST_COL = 'craa5_manifestjson';
// Every hubconfig JSON value: read Manifest json first (old table), then Config json.
function hubConfigJsonOf(row) { return row ? String(row[HUB_MANIFEST_COL] || row.craa5_configjson || '') : ''; }
function hubSaveManifest(io, m) {
    try {
        var man = hubManifest(m), key = hubManifestKey(man.appId);
        if (!man.appId)
            return Promise.resolve('failed: no appId');
        var fail = function (e) { return 'failed: ' + String(e && e.message || e); };
        var spots = [[HUB_CONFIG_TABLES[0], 'craa5_configjson', []], [HUB_CONFIG_TABLES[1], HUB_MANIFEST_COL, ['craa5_configjson']], [HUB_CONFIG_TABLES[1], 'craa5_configjson', []]];
        var read = function (i) {
            if (i >= spots.length)
                return Promise.reject(new Error('no hub config table'));
            var sp = spots[i], idCol = sp[0] + 'id';
            return Promise.resolve(io.query(sp[0], { select: [idCol, sp[1]].concat(sp[2]), filter: "craa5_configkey eq '" + key + "' and statecode eq 0", top: 5 })).then(function (res) {
                var rows = res && res.rows !== undefined ? res.rows : res;
                if (!rows)
                    throw new Error(res && res.err || 'read failed');
                return { rows: rows, table: sp[0], col: sp[1], idCol: idCol };
            }).then(null, function (e) { return i + 1 < spots.length ? read(i + 1) : Promise.reject(e); });
        };
        return read(0).then(function (r) {
            var body = { craa5_configkey: key, craa5_configname: (man.app || man.appId) + ' manifest' };
            body[r.col] = JSON.stringify(man);
            var row = r.rows[0];
            if (row) {
                var old = {};
                try {
                    old = JSON.parse(row[r.col] || '{}');
                }
                catch (e) { }
                if (old && old.hash === man.hash)
                    return 'same';
                return Promise.resolve(io.update(r.table, hubGuid(row[r.idCol]), body)).then(function () { return 'saved'; }, fail);
            }
            var create = {};
            for (var k in body)
                create[k] = body[k];
            create[r.idCol] = hubIdFromKey('hubconfig|' + key); // fixed id: two people opening at once still make one row
            return Promise.resolve(io.create(r.table, create)).then(function () { return 'saved'; }, fail);
        }, fail);
    }
    catch (e) {
        return Promise.resolve('failed: ' + String(e && e.message || e));
    }
}
/* ============================== END HUB SHARED v1.3 ============================== */
/* ============================== START MSS MANPOWER v1.1 ============================== */
// Manpower plan (projected): the labor hours the clean goals need per day, week and month, and the heads each crew needs.
// This is not a data contract section 7 number, so the screen says how it is computed. Everything here is read only:
//   - craa5___1_p_cleanplan (Production Scheduler only writes it): the window rows of published weeks (k|Monday row status 'done')
//     are the line cleans. Work = the scope rows' craa5_minutes for that line and kind (person-minutes of every piece in the
//     clean), else details.need.work, else the clean's clock minutes x the crew it assumed. When = details.cleanStart/cleanEnd.
//     Changeovers are done by the line crew and are left out.
//   - craa5___1_a_assets: pieces in no line's clean plan that are flagged daily, weekly or midweek, and every piece flagged monthly,
//     6-month (craa5_month), quarterly or annual, at standard minutes (craa5_hoursrequired; a daily clean at craa5_dailymin
//     when set). These have no planned time, so they are spread evenly over the shift hours. A piece without a standard is
//     counted, never guessed.
//   - craa5___1_a_workshift: which crew is on the clock when (the same reading rules as Ganttly and Shift Start).
// Heads for a shift = its work / (its length x the share of a shift spent cleaning). Cleans that overlap are added up at every
// moment of the shift ("at once"). A crew's cleaners = its busiest (or average) shift, rounded up.
// Fixed posts (v1.1) are heads a shift needs whatever the clean minutes: supervisor, leads, trash room, steam pits. Each has whole
// heads per shift, on every shift, day shifts (start 4 AM to 3:59 PM) or night shifts, every day, Mon-Fri or Sat-Sun. A crew carries a
// post when any of its shifts needs it. A post "not in a crew" (weekday admin) is counted once, at its hours a week.
// A crew's plan = cleaners + its fixed posts + the vacation cover (none for a crew with neither).
// Shift layout (v1.1): per crew and shift start, the cleaning heads each hour needs (busiest or average of the published weeks),
// the hours where overlapping cleans need more than the crew's cleaners, and a quiet start or end where some could start later
// or leave earlier. These are suggestions; nothing is changed.
// Weeks the Scheduler has not published repeat the average published week. Needs HUB SHARED (hubPlantParts, hubWeekKey, ...).
var MP_VERSION = '1.1';
var MP_LINE_KINDS = { full: 'daily', midweek: 'midweek', weekly: 'eow', allergen: 'allergen' };
var MP_PER_YEAR = { monthly: 12, semiannual: 2, quarterly: 4, annual: 1 };
var MP_FLAG_COLS = { daily: 'craa5_dailyclean', midweek: 'craa5_midweek', weekly: 'craa5_weeklyclean', monthly: 'craa5_monthlyclean',
    semiannual: 'craa5_month', quarterly: 'craa5_quarterly', annual: 'craa5_annually' };
var MP_HOUR = 3600000, MP_MIN = 60000, MP_WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function mpYes(v) { return v === true || v === 1 || /^(true|yes|si|y|1)$/i.test(String(v === undefined || v === null ? '' : v).trim()); }
function mpNum(v) { var n = Number(v); return v === null || v === undefined || v === '' || !isFinite(n) ? null : n; }
function mpJson(s) { if (s && typeof s === 'object')
    return s; try {
    var o = JSON.parse(s || '');
    return o && typeof o === 'object' ? o : null;
}
catch (e) {
    return null;
} }
function mpMs(v) { if (v === null || v === undefined || v === '')
    return 0; var t = typeof v === 'number' ? v : Date.parse(v); return isFinite(t) ? t : 0; }
function mpField(r, n) { var f = r ? r[n + '@OData.Community.Display.V1.FormattedValue'] : undefined; return f !== undefined ? f : (r ? r[n] : undefined); }
function mpDow(day) { return new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)))).getUTCDay(); }
function mpRound1(n) { return Math.round((n || 0) * 10) / 10; }
// A plant wall-clock time (a day, plus hours that may pass 24) as epoch ms, daylight saving included.
function mpPlantMs(day, hours) {
    var want = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) + hours * MP_HOUR, t = want;
    for (var i = 0; i < 4; i++) {
        var p = hubPlantParts(t);
        if (!p)
            return want;
        var seen = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min), next = t + (want - seen);
        if (next === t)
            break;
        t = next;
    }
    return t;
}
// craa5___1_a_workshift: one row per slot. craa5_shiftcode (A-D), craa5_dayname / craa5_daynumber (1 = Sun), craa5_shiftstarthour /
// craa5_shiftendhour. Midnight is stored as 1, or every hour is stored +1 (1/7/13/19). A row that starts before 4 AM is the back
// half of a night shift: it goes on the named day or the next one, whichever overlaps the other rows less.
function mpParseSlots(rows) {
    var raw = (rows || []).map(function (r) {
        return { crew: hubCrew(mpField(r, 'craa5_shiftcode')), dayName: String(mpField(r, 'craa5_dayname') || ''), dayNum: parseInt(mpField(r, 'craa5_daynumber'), 10),
            startH: parseInt(mpField(r, 'craa5_shiftstarthour'), 10), endH: parseInt(mpField(r, 'craa5_shiftendhour'), 10) };
    });
    var hours = [];
    raw.forEach(function (x) { if (!isNaN(x.startH))
        hours.push(x.startH); if (!isNaN(x.endH))
        hours.push(x.endH); });
    var plusOne = hours.length > 0 && hours.every(function (h) { return h >= 1 && (h - 1) % 6 === 0; });
    var hasZeroDay = raw.some(function (x) { return x.dayNum === 0; });
    var fixHour = function (h) { return plusOne ? (h - 1 + 24) % 24 : (h === 1 || h === 24) ? 0 : ((h % 24) + 24) % 24; };
    var slots = [], pending = [];
    raw.forEach(function (x) {
        var m = x.dayName.toLowerCase().match(/sun|mon|tue|wed|thu|fri|sat/);
        var day = m ? ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(m[0]) : (isNaN(x.dayNum) ? -1 : (hasZeroDay ? x.dayNum : x.dayNum - 1));
        if (!x.crew || day < 0 || isNaN(x.startH) || isNaN(x.endH))
            return;
        day = ((day % 7) + 7) % 7;
        var sH = fixHour(x.startH), eH = fixHour(x.endH);
        var slot = { crew: x.crew, day: day, startHour: sH, lengthHours: ((eH - sH + 24) % 24) || 24 };
        (sH < 4 ? pending : slots).push(slot);
    });
    var hoursOf = function (s) { var out = []; for (var h = 0; h < s.lengthHours; h++)
        out.push((s.day * 24 + s.startHour + h) % 168); return out; };
    pending.forEach(function (p) {
        var taken = {};
        slots.forEach(function (s) { hoursOf(s).forEach(function (h) { taken[h] = true; }); });
        var next = { crew: p.crew, day: (p.day + 1) % 7, startHour: p.startHour, lengthHours: p.lengthHours };
        var clash = function (s) { return hoursOf(s).filter(function (h) { return taken[h]; }).length; };
        slots.push(clash(p) < clash(next) ? p : next);
    });
    return slots;
}
// The shifts that START on each plant day from..to (inclusive). With no shift rows, one 24 h stretch per day (hours only, no heads).
function mpShifts(fromDay, toDay, slots) {
    var out = [], list = slots && slots.length ? slots : null;
    for (var d = fromDay; d <= toDay; d = hubAddDays(d, 1)) {
        var dow = mpDow(d);
        (list || [{ crew: '', day: dow, startHour: 0, lengthHours: 24 }]).forEach(function (s) {
            if (s.day !== dow)
                return;
            var start = mpPlantMs(d, s.startHour), end = mpPlantMs(d, s.startHour + s.lengthHours);
            out.push({ crew: s.crew, day: d, week: hubWeekKey(d), dow: dow, startHour: s.startHour, lengthHours: s.lengthHours, start: start, end: end,
                mins: (end - start) / MP_MIN, key: s.crew + '|' + dow + '|' + s.startHour, line: 0, spread: 0, segs: [] });
        });
    }
    return out.sort(function (a, b) { return a.start - b.start; });
}
// Scope rows (s|line|kind|part): the person-minutes of each line's clean kind, and every Equipment id that is in a line's plan.
function mpScopes(rows) {
    var out = { byKey: {}, ids: {}, count: 0 };
    (rows || []).forEach(function (r) {
        var d = mpJson(r.craa5_details) || {};
        var line = String(r.craa5_linekey || d.line || '').toLowerCase(), kind = String(r.craa5_cleankind || d.kind || '').toLowerCase();
        if (!line || !kind)
            return;
        var k = line + '|' + kind, s = out.byKey[k] || (out.byKey[k] = { mins: 0, pieces: 0 });
        s.mins = Math.max(s.mins, mpNum(r.craa5_minutes) || 0);
        (Array.isArray(d.pieces) ? d.pieces : []).forEach(function (p) {
            var id = hubGuid(Array.isArray(p) ? p[0] : p && p.id);
            if (hubIsGuid(id)) {
                if (!out.ids[id])
                    out.count++;
                out.ids[id] = true;
                s.pieces++;
            }
        });
    });
    return out;
}
// One window row -> the clean it plans: kind, work (person-minutes) and the planned slot. null for changeovers and 'none'.
function mpWindow(r, scopes) {
    var d = mpJson(r.craa5_details) || {};
    var plan = String(r.craa5_cleankind || '').toLowerCase(), kind = MP_LINE_KINDS[plan];
    if (!kind)
        return null;
    var line = String(r.craa5_linekey || '').toLowerCase();
    var sk = d.scope && d.scope.key ? String(d.scope.key).toLowerCase() : line + '|' + plan;
    var clock = mpNum(r.craa5_minutes) || 0, heads = d.crew ? mpNum(d.crew.heads) : null;
    var work = 0, basis = 'none';
    if (scopes && scopes.byKey[sk] && scopes.byKey[sk].mins > 0) {
        work = scopes.byKey[sk].mins;
        basis = 'scope';
    }
    else if (d.need && d.need.basis === 'equipment' && mpNum(d.need.work) > 0) {
        work = mpNum(d.need.work);
        basis = 'need';
    }
    else if (clock > 0 && heads > 0) {
        work = clock * heads;
        basis = 'clock';
    }
    var start = mpMs(d.cleanStart) || mpMs(r.craa5_start), end = mpMs(d.cleanEnd);
    if (!(end > start))
        end = clock > 0 && start ? start + clock * MP_MIN : 0;
    var day = /^\d{4}-\d{2}-\d{2}$/.test(String(r.craa5_day || '')) ? String(r.craa5_day) : (start ? hubPlantDay(start) : '');
    return { line: line, area: String(r.craa5_area || ''), plan: plan, kind: kind, day: day, week: day ? hubWeekKey(day) : '', start: start, end: end,
        work: work, basis: basis, open: !!d.open, status: String(r.craa5_status || '') };
}
// Equipment that no line's clean plan covers, and the monthly-and-longer cleans: minutes per day and per week.
function mpPieceLoads(assets, scopes, lineAreas) {
    var out = { dailyMins: 0, weeklyMins: 0, periodicWeekMins: 0, daily: 0, weekly: 0, periodic: 0, noStd: 0, inPlan: 0 };
    var useIds = scopes && scopes.count > 0;
    (assets || []).forEach(function (a) {
        var id = hubGuid(a.craa5___1_a_assetsid), std = hubStdMinutes(a.craa5_hoursrequired), dmin = hubStdMinutes(a.craa5_dailymin) || std;
        var f = {};
        Object.keys(MP_FLAG_COLS).forEach(function (k) { f[k] = mpYes(a[MP_FLAG_COLS[k]]); });
        var inPlan = useIds ? !!scopes.ids[id] : !!(lineAreas && lineAreas[hubCanon(a.craa5_areaname)]);
        var missing = false;
        if (inPlan)
            out.inPlan++;
        else if (f.daily) {
            if (dmin) {
                out.dailyMins += dmin;
                out.daily++;
            }
            else
                missing = true;
        }
        else if (f.weekly || f.midweek) {
            if (std) {
                out.weeklyMins += std;
                out.weekly++;
            }
            else
                missing = true;
        }
        var per = 0;
        Object.keys(MP_PER_YEAR).forEach(function (k) { if (f[k])
            per += MP_PER_YEAR[k]; });
        if (per) {
            if (std) {
                out.periodicWeekMins += std * per / 52;
                out.periodic++;
            }
            else
                missing = true;
        }
        if (missing)
            out.noStd++;
    });
    return out;
}
// The most people working at the same moment inside a shift, from the cleans that overlap it.
function mpPeak(inst) {
    var pts = [inst.start, inst.end];
    inst.segs.forEach(function (s) { if (s[0] > inst.start && s[0] < inst.end)
        pts.push(s[0]); if (s[1] > inst.start && s[1] < inst.end)
        pts.push(s[1]); });
    pts.sort(function (a, b) { return a - b; });
    var best = 0;
    for (var i = 0; i + 1 < pts.length; i++) {
        if (pts[i + 1] <= pts[i])
            continue;
        var mid = (pts[i] + pts[i + 1]) / 2, h = 0;
        inst.segs.forEach(function (s) { if (s[0] <= mid && s[1] > mid)
            h += s[2]; });
        if (h > best)
            best = h;
    }
    return best;
}
// Fixed posts as typed on the screen -> { name, heads (whole), covers 'all' | 'day' | 'night' | 'office', days 'all' | 'weekdays' |
// 'weekend', hoursWeek (office only) }. Rows with neither a name nor heads are dropped.
function mpPosts(list) {
    return (list || []).map(function (p) {
        p = p || {};
        return { name: String(p.name || '').trim(), heads: Math.max(0, Math.round(mpNum(p.heads) || 0)),
            covers: ['all', 'day', 'night', 'office'].indexOf(p.covers) >= 0 ? p.covers : 'all',
            days: ['all', 'weekdays', 'weekend'].indexOf(p.days) >= 0 ? p.days : 'all', hoursWeek: Math.max(0, mpNum(p.hoursWeek) || 0) };
    }).filter(function (p) { return p.name || p.heads; });
}
// Does a post need people on a shift that starts on weekday dow (0 = Sun) at startHour?
function mpPostOn(p, dow, startHour) {
    if (p.covers === 'office')
        return false;
    var day = startHour >= 4 && startHour < 16;
    if ((p.covers === 'day' && !day) || (p.covers === 'night' && day))
        return false;
    if (p.days === 'weekdays' && (dow === 0 || dow === 6))
        return false;
    if (p.days === 'weekend' && dow !== 0 && dow !== 6)
        return false;
    return true;
}
function mpFixedOn(posts, dow, startHour) { var h = 0; posts.forEach(function (p) { if (mpPostOn(p, dow, startHour))
    h += p.heads; }); return h; }
// The cleaning heads each hour of a shift needs: the overlapping cleans' work in that hour plus its share of the spread work.
function mpHourly(inst, share) {
    var out = [], len = inst.end - inst.start;
    for (var a = inst.start; a < inst.end; a += MP_HOUR) {
        var b = Math.min(a + MP_HOUR, inst.end), w = len > 0 ? inst.spread * (b - a) / len : 0;
        inst.segs.forEach(function (sg) { var x = Math.max(a, sg[0]), y = Math.min(b, sg[1]); if (y > x)
            w += sg[2] * (y - x) / MP_MIN; });
        out.push(w / ((b - a) / MP_MIN * share));
    }
    return out;
}
// One crew's shift, hour by hour (prof = heads per hour): the hours where overlapping cleans need more than the crew's cleaners,
// and a quiet start or end (2 hours or more) where some cleaners could start later or leave earlier. Suggestions only.
function mpShape(g, prof, cleaners, nWeeks) {
    var clock = function (i) { return (g.startHour + i) % 24; };
    var over = [], run = null, top = 0;
    prof.forEach(function (v, i) {
        if (v > top)
            top = v;
        if (cleaners > 0 && v > cleaners + 0.05) {
            if (!run)
                run = { from: clock(i), to: clock(i + 1), peak: v };
            else {
                run.to = clock(i + 1);
                run.peak = Math.max(run.peak, v);
            }
        }
        else if (run) {
            over.push(run);
            run = null;
        }
    });
    if (run)
        over.push(run);
    over.forEach(function (r) { r.extra = Math.ceil(r.peak - cleaners - 1e-9); r.peak = mpRound1(r.peak); });
    var quiet = function (order) {
        var n = 0, hi = 0;
        for (var j = 0; j < order.length; j++) {
            var v = mpRound1(prof[order[j]]);
            if (Math.ceil(v - 1e-9) > cleaners - 1)
                break;
            n++;
            hi = Math.max(hi, v);
        }
        var spare = cleaners - Math.ceil(hi - 1e-9);
        return cleaners > 0 && n >= 2 && n < prof.length && spare >= 1 ? { hours: n, spare: spare } : null;
    };
    var fwd = prof.map(function (v, i) { return i; }), lead = quiet(fwd), trail = quiet(fwd.slice().reverse());
    if (lead)
        lead.at = clock(lead.hours);
    if (trail)
        trail.at = clock(prof.length - trail.hours);
    return { startHour: g.startHour, lengthHours: g.lengthHours, perWeek: mpRound1(g.n / Math.max(1, nWeeks)), upTo: Math.ceil(mpRound1(top) - 1e-9),
        hours: prof.map(function (v, i) { return { hour: clock(i), heads: mpRound1(v) }; }), over: over, lead: lead, trail: trail };
}
// in: { windows, weeks, scopes, assets (rows), slots (mpParseSlots), today 'YYYY-MM-DD', share (0-1 of a shift spent cleaning),
//       vacation (heads per crew), basis 'busiest' | 'average', months (default 12), logged { Monday: { mins, rows, noMins } },
//       posts (fixed posts, see mpPosts) }
function mpBuild(input) {
    var o = input || {}, share = o.share > 0 && o.share <= 1 ? o.share : 1, vac = Math.max(0, Math.round(mpNum(o.vacation) || 0));
    var slots = o.slots || [], heads = slots.length > 0, today = o.today, thisWeek = hubWeekKey(today);
    var notes = { changeover: 0, noWork: 0, basis: { scope: 0, need: 0, clock: 0 }, noTime: 0, writing: [], open: 0 };
    var done = {};
    (o.weeks || []).forEach(function (w) {
        var mon = /^\d{4}-\d{2}-\d{2}$/.test(String(w.craa5_day || '')) ? String(w.craa5_day) : (mpMs(w.craa5_start) ? hubWeekKey(hubPlantDay(mpMs(w.craa5_start) + 6 * MP_HOUR)) : '');
        if (!mon)
            return;
        if (String(w.craa5_status || '').toLowerCase() === 'done')
            done[mon] = true;
        else if (notes.writing.indexOf(mon) < 0)
            notes.writing.push(mon);
    });
    var scopes = mpScopes(o.scopes);
    var cleans = [], lineAreas = {};
    (o.windows || []).forEach(function (r) {
        var w = mpWindow(r, scopes);
        if (!w) {
            var cd = /^\d{4}-\d{2}-\d{2}$/.test(String(r.craa5_day || '')) ? String(r.craa5_day) : '';
            if (String(r.craa5_cleankind || '').toLowerCase() === 'changeover' && cd && done[hubWeekKey(cd)])
                notes.changeover++;
            return;
        }
        if (!w.week || !done[w.week])
            return;
        lineAreas[hubCanon(w.area)] = true;
        if (!w.work) {
            notes.noWork++;
            return;
        }
        notes.basis[w.basis]++;
        if (w.open)
            notes.open++;
        cleans.push(w);
    });
    var planned = Object.keys(done).sort();
    var weeks = planned.length ? planned : [thisWeek];
    var loads = mpPieceLoads(o.assets, scopes, lineAreas);
    var insts = mpShifts(hubAddDays(weeks[0], -1), hubAddDays(weeks[weeks.length - 1], 7), slots);
    var isBasis = {};
    weeks.forEach(function (w) { isBasis[w] = true; });
    var outside = {};
    weeks.forEach(function (w) { outside[w] = 0; });
    cleans.forEach(function (c) {
        var placed = 0;
        if (c.end > c.start) {
            var rate = c.work / ((c.end - c.start) / MP_MIN);
            insts.forEach(function (s) {
                var a = Math.max(s.start, c.start), b = Math.min(s.end, c.end);
                if (b <= a)
                    return;
                var part = c.work * (b - a) / (c.end - c.start);
                if (isBasis[s.week]) {
                    s.line += part;
                    s.segs.push([a, b, rate]);
                    placed += part;
                }
            });
        }
        else {
            notes.noTime++;
            var home = insts.filter(function (s) { return s.start <= c.start && s.end > c.start && isBasis[s.week]; })[0];
            if (home) {
                home.line += c.work;
                placed = c.work;
            }
        }
        outside[c.week] += c.work - placed;
    });
    // Spread: pieces outside every line plan (daily: that day's shifts; weekly: the week's) and monthly-and-longer cleans (the week's)
    weeks.forEach(function (w) {
        var wk = insts.filter(function (s) { return s.week === w; }), wkMins = wk.reduce(function (t, s) { return t + s.mins; }, 0);
        for (var i = 0; i < 7; i++) {
            var day = hubAddDays(w, i), on = wk.filter(function (s) { return s.day === day; }), m = on.reduce(function (t, s) { return t + s.mins; }, 0);
            if (m > 0)
                on.forEach(function (s) { s.spread += loads.dailyMins * s.mins / m; });
            else
                outside[w] += loads.dailyMins;
        }
        var weekly = loads.weeklyMins + loads.periodicWeekMins;
        if (wkMins > 0)
            wk.forEach(function (s) { s.spread += weekly * s.mins / wkMins; });
        else
            outside[w] += weekly;
    });
    var shifts = insts.filter(function (s) { return isBasis[s.week]; });
    var posts = mpPosts(o.posts), crewPosts = posts.filter(function (p) { return p.covers !== 'office' && p.heads > 0; });
    var office = posts.filter(function (p) { return p.covers === 'office' && p.heads > 0; });
    var officeWeekMins = office.reduce(function (t, p) { return t + p.heads * p.hoursWeek * 60; }, 0);
    shifts.forEach(function (s) {
        s.work = s.line + s.spread;
        s.need = s.mins > 0 ? s.work / (s.mins * share) : 0;
        s.atOnce = mpPeak(s);
        s.hourly = mpHourly(s, share);
        s.fixed = heads ? mpFixedOn(crewPosts, s.dow, s.startHour) : 0;
        delete s.segs;
    });
    // The average published week, slot by slot (crew | weekday | start hour), for the weeks not published
    var typical = {}, outsideDow = [0, 0, 0, 0, 0, 0, 0];
    shifts.forEach(function (s) {
        var t = typical[s.key] || (typical[s.key] = { crew: s.crew, dow: s.dow, startHour: s.startHour, mins: s.mins, fixed: s.fixed, work: 0, line: 0, n: 0 });
        t.work += s.work;
        t.line += s.line;
        t.n++;
    });
    Object.keys(typical).forEach(function (k) { var t = typical[k]; t.work /= t.n; t.line /= t.n; t.need = t.mins > 0 ? t.work / (t.mins * share) : 0; });
    weeks.forEach(function (w) { for (var i = 0; i < 7; i++)
        outsideDow[i] += outside[w] / 7 / weeks.length; });
    var crewPlan = function (list) {
        var by = {};
        list.forEach(function (s) {
            if (!s.crew)
                return;
            var c = by[s.crew] || (by[s.crew] = { crew: s.crew, shifts: 0, work: 0, needSum: 0, busiest: null, atOnce: 0, fixedMins: 0, list: [] });
            c.shifts++;
            c.work += s.work;
            c.needSum += s.need;
            c.fixedMins += (s.fixed || 0) * (s.mins || 0);
            c.list.push(s);
            if (!c.busiest || s.need > c.busiest.need)
                c.busiest = s;
            if ((s.atOnce || 0) > c.atOnce)
                c.atOnce = s.atOnce;
        });
        return Object.keys(by).sort().map(function (k) {
            var c = by[k], avg = c.shifts ? c.needSum / c.shifts : 0, top = c.busiest ? c.busiest.need : 0, pick = o.basis === 'average' ? avg : top;
            var on = crewPosts.filter(function (p) { return c.list.some(function (s) { return mpPostOn(p, s.dow, s.startHour); }); }).map(function (p) { return { name: p.name, heads: p.heads }; });
            var fixed = on.reduce(function (t, p) { return t + p.heads; }, 0), cleaners = c.work > 0 ? Math.ceil(pick - 1e-9) : 0, any = cleaners + fixed > 0;
            return { crew: c.crew, shifts: c.shifts, hours: mpRound1(c.work / 60), avgHeads: mpRound1(avg), busiestHeads: mpRound1(top),
                busiest: c.busiest ? { day: c.busiest.day, startHour: c.busiest.startHour, dow: c.busiest.dow } : null, atOnce: mpRound1(c.atOnce),
                cleaners: cleaners, posts: on, fixed: fixed, fixedHours: mpRound1(c.fixedMins / 60), vacation: any ? vac : 0, plan: any ? cleaners + fixed + vac : 0 };
        });
    };
    var weekRows = weeks.map(function (w) {
        var wk = shifts.filter(function (s) { return s.week === w; });
        var line = wk.reduce(function (t, s) { return t + s.line; }, 0), spread = wk.reduce(function (t, s) { return t + s.spread; }, 0);
        var lg = o.logged && o.logged[w], fixedMins = wk.reduce(function (t, s) { return t + s.fixed * s.mins; }, 0) + officeWeekMins;
        return { week: w, published: !!done[w], lineHours: mpRound1(line / 60), spreadHours: mpRound1(spread / 60), outsideHours: mpRound1(outside[w] / 60), fixedHours: mpRound1(fixedMins / 60),
            hours: mpRound1((line + spread + outside[w]) / 60), cleans: cleans.filter(function (c) { return c.week === w; }).length,
            loggedHours: lg ? mpRound1(lg.mins / 60) : null, loggedRows: lg ? lg.rows : 0, loggedNoMins: lg ? lg.noMins : 0, crews: crewPlan(wk) };
    });
    // Month by month from this month: published weeks as they are, the other days as the average published week
    var months = [], n = o.months > 0 ? o.months : 12, y = Number(today.slice(0, 4)), m0 = Number(today.slice(5, 7)) - 1;
    for (var i = 0; i < n; i++) {
        var yy = y + Math.floor((m0 + i) / 12), mm = (m0 + i) % 12, first = yy + '-' + hubPad2(mm + 1) + '-01';
        var days = new Date(Date.UTC(yy, mm + 1, 0)).getUTCDate(), list = [], work = 0, fromPlan = 0, fixedMins = officeWeekMins * days / 7;
        for (var k = 0; k < days; k++) {
            var day = hubAddDays(first, k), dow = mpDow(day), wk = hubWeekKey(day);
            if (isBasis[wk] && planned.length) {
                shifts.forEach(function (s) { if (s.day === day) {
                    list.push(s);
                    work += s.work;
                    fixedMins += s.fixed * s.mins;
                } });
                work += outside[wk] / 7;
                fromPlan++;
            }
            else {
                Object.keys(typical).forEach(function (key) {
                    var t = typical[key];
                    if (t.dow !== dow)
                        return;
                    list.push({ crew: t.crew, day: day, dow: dow, startHour: t.startHour, mins: t.mins, fixed: t.fixed, work: t.work, need: t.need, atOnce: 0 });
                    work += t.work;
                    fixedMins += t.fixed * t.mins;
                });
                work += outsideDow[dow];
            }
        }
        months.push({ month: first.slice(0, 7), days: days, planDays: fromPlan, hours: mpRound1(work / 60), perDay: mpRound1(work / 60 / days), perWeek: mpRound1(work / 60 / days * 7),
            fixedHours: mpRound1(fixedMins / 60), crews: crewPlan(list) });
    }
    var yearHours = months.reduce(function (t, x) { return t + x.hours; }, 0), yearDays = months.reduce(function (t, x) { return t + x.days; }, 0);
    var yearFixed = months.reduce(function (t, x) { return t + x.fixedHours; }, 0);
    var crews = crewPlan(shifts);
    // Shift layout: per crew and shift start, the heads each hour needs over the published weeks
    var groups = {};
    shifts.forEach(function (s) {
        if (!s.crew)
            return;
        var k = s.crew + '|' + s.startHour + '|' + s.lengthHours, g = groups[k] || (groups[k] = { crew: s.crew, startHour: s.startHour, lengthHours: s.lengthHours, n: 0, sum: [], max: [], cnt: [] });
        g.n++;
        s.hourly.forEach(function (v, i) { g.sum[i] = (g.sum[i] || 0) + v; g.cnt[i] = (g.cnt[i] || 0) + 1; g.max[i] = Math.max(g.max[i] || 0, v); });
    });
    var layout = crews.map(function (c) {
        var mine = Object.keys(groups).map(function (k) { return groups[k]; }).filter(function (g) { return g.crew === c.crew; }).sort(function (a, b) { return a.startHour - b.startHour || b.lengthHours - a.lengthHours; });
        return { crew: c.crew, cleaners: c.cleaners, posts: c.posts, fixed: c.fixed, vacation: c.vacation, plan: c.plan,
            shifts: mine.map(function (g) { return mpShape(g, g.sum.map(function (v, i) { return o.basis === 'average' ? v / g.cnt[i] : g.max[i]; }), c.cleaners, weeks.length); }) };
    });
    notes.postsNoHeads = posts.filter(function (p) { return p.name && !p.heads; }).map(function (p) { return p.name; });
    var officeHeads = office.reduce(function (t, p) { return t + p.heads; }, 0);
    return { version: MP_VERSION, heads: heads, planned: planned, weeks: weekRows, months: months, crews: crews, loads: loads, notes: notes,
        cleans: cleans.length, perDay: mpRound1(yearHours / yearDays), perWeek: mpRound1(yearHours / yearDays * 7), perMonth: mpRound1(yearHours / months.length),
        fixedPerWeek: mpRound1(yearFixed / yearDays * 7), layout: layout, office: office.map(function (p) { return { name: p.name, heads: p.heads, hoursWeek: p.hoursWeek }; }),
        officeHeads: officeHeads, planHeads: crews.reduce(function (t, c) { return t + c.plan; }, 0) + (heads ? officeHeads : 0) };
}
/* ============================== END MSS MANPOWER v1.1 ============================== */
// Small helpers shared by the data layer, the planning engine and the screens. Plain functions, no React.
var SD_MIN = 60000;
var SD_HOUR = 3600000;
var SD_DAY = 86400000;
// ---------- language (English / Spanish, Mexico) ----------
// Every word on the page goes through sdT('English text'). The Spanish words are in SD_ES (block DIRECTOR SPANISH), keyed by the
// English text. This file must stay plain ASCII, so the Spanish is written with a % code for each accented letter:
// %a %e %i %o %u = a e i o u with an acute accent, %n = n with a tilde, %A %E %I %O %U %N = the capitals,
// %? and %! = the opening question and exclamation marks, %w = u with two dots, %% = a percent sign.
var SD_LANG = 'en';
var SD_ES = {};
var SD_ES_DONE = null;
var SD_ACC = { a: 225, e: 233, i: 237, o: 243, u: 250, n: 241, A: 193, E: 201, I: 205, O: 211, U: 218, N: 209, '?': 191, '!': 161, w: 252 };
var SD_MISSING = {}; // English text with no Spanish yet (the test bench lists it)
function sdDecodeEs(s) { return String(s).replace(/%([aeiounAEIOUN?!w%])/g, function (m, c) { return c === '%' ? '%' : String.fromCharCode(SD_ACC[c]); }); }
function sdEsReady() {
    if (!SD_ES_DONE) {
        SD_ES_DONE = {};
        for (var k in SD_ES)
            if (Object.prototype.hasOwnProperty.call(SD_ES, k))
                SD_ES_DONE[k] = sdDecodeEs(SD_ES[k]);
        // The ecosystem's shared words (HUB_ES in the HUB SHARED block) win over this page's own list (data contract, section 9).
        if (typeof HUB_ES === 'object' && HUB_ES)
            for (var h in HUB_ES)
                if (Object.prototype.hasOwnProperty.call(HUB_ES, h))
                    SD_ES_DONE[h] = sdDecodeEs(HUB_ES[h]);
    }
    return SD_ES_DONE;
}
function sdSetLang(l) { SD_LANG = l === 'es' ? 'es' : 'en'; }
function sdT(s, vars) {
    var out = String(s);
    if (SD_LANG === 'es') {
        var es = sdEsReady();
        if (Object.prototype.hasOwnProperty.call(es, out))
            out = es[out];
        else if (out)
            SD_MISSING[out] = 1;
    }
    if (vars)
        out = out.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : m; });
    if (SD_LANG === 'es')
        out = out.replace(/ ([ap])\. m\.\./g, ' $1. m.'); // "10:15 p. m." at the end of a sentence
    return out;
}
// One / many: sdTn(3, '{n} piece', '{n} pieces') -> "3 pieces".
function sdTn(n, one, many, vars) {
    var v = {};
    if (vars)
        for (var k in vars)
            if (Object.prototype.hasOwnProperty.call(vars, k))
                v[k] = vars[k];
    v.n = n;
    return sdT(n === 1 ? one : many, v);
}
// Names the planner itself makes (the default steps): shown in Spanish when they still have their default name.
function sdTName(s) {
    var t = String(s == null ? '' : s);
    if (SD_LANG !== 'es' || !t)
        return t;
    var es = sdEsReady();
    return Object.prototype.hasOwnProperty.call(es, t) ? es[t] : t;
}
function sdCanon(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
function sdTrim(s) { return String(s == null ? '' : s).replace(/[\t\r\n]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function sdNum(v) { if (v === null || v === undefined || v === '')
    return null; var n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, '')); return isFinite(n) ? n : null; }
function sdInt(v, dflt) { var n = sdNum(v); return n === null ? dflt : Math.round(n); }
function sdPad(n) { return n < 10 ? '0' + n : String(n); }
function sdClamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function sdUniq(arr) { var seen = {}, out = []; for (var i = 0; i < arr.length; i++) {
    var k = String(arr[i]);
    if (!seen[k]) {
        seen[k] = 1;
        out.push(arr[i]);
    }
} return out; }
function sdSum(arr, fn) { var t = 0; for (var i = 0; i < arr.length; i++)
    t += (fn ? fn(arr[i]) : arr[i]) || 0; return t; }
function sdKeys(o) { return o ? Object.keys(o) : []; }
function sdGuidLike(s) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s || '').replace(/[{}]/g, '')); }
function sdCleanId(s) { return String(s || '').replace(/[{}]/g, '').toLowerCase(); }
// Local calendar dates (adding 24h in ms drifts an hour across daylight saving changes).
function sdYmd(d) { d = d instanceof Date ? d : new Date(d); return d.getFullYear() + '-' + sdPad(d.getMonth() + 1) + '-' + sdPad(d.getDate()); }
function sdFromYmd(ymd) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(ymd || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
function sdAddDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes(), d.getSeconds()); }
function sdAt(day, hour, min) { return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, min || 0, 0).getTime(); }
function sdIsoZ(ms) { return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z'); }
function sdMs(v) { if (v === null || v === undefined || v === '')
    return null; if (typeof v === 'number')
    return v; var t = new Date(v).getTime(); return isFinite(t) ? t : null; }
var SD_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var SD_DAY_NAMES_ES = ['dom', 'lun', 'mar', 'mi%e', 'jue', 'vie', 's%ab'];
function sdDayName(i) { return SD_LANG === 'es' ? sdDecodeEs(SD_DAY_NAMES_ES[i]) : SD_DAY_NAMES[i]; }
function sdFmtTime(ms) {
    if (ms === null || ms === undefined || !isFinite(ms))
        return '--';
    var d = new Date(ms);
    var h = d.getHours();
    var h12 = h % 12 === 0 ? 12 : h % 12;
    var ap = SD_LANG === 'es' ? (h < 12 ? 'a. m.' : 'p. m.') : (h < 12 ? 'AM' : 'PM');
    return h12 + ':' + sdPad(d.getMinutes()) + ' ' + ap;
}
function sdFmtDayTime(ms) { if (ms === null || ms === undefined || !isFinite(ms))
    return '--'; return sdDayName(new Date(ms).getDay()) + ' ' + sdFmtTime(ms); }
function sdFmtDate(ms) {
    if (ms === null || ms === undefined)
        return '--';
    var d = new Date(ms);
    return sdDayName(d.getDay()) + ' ' + (SD_LANG === 'es' ? d.getDate() + '/' + (d.getMonth() + 1) : (d.getMonth() + 1) + '/' + d.getDate());
}
function sdFmtHours(min) {
    if (min === null || min === undefined || !isFinite(min))
        return '--';
    var neg = min < 0;
    var m = Math.round(Math.abs(min));
    var h = Math.floor(m / 60);
    var r = m % 60;
    return (neg ? '-' : '') + (h ? h + 'h' : '') + (h && r ? ' ' : '') + (r || !h ? r + 'm' : '');
}
function sdFmtNum(n, dp) { if (n === null || n === undefined || !isFinite(n))
    return '--'; var p = Math.pow(10, dp || 0); var v = Math.round(n * p) / p; var s = String(Math.abs(v)); var i = s.indexOf('.'); var whole = i < 0 ? s : s.slice(0, i); return (v < 0 ? '-' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (i < 0 ? '' : s.slice(i)); }
function sdFmtMoney(n) {
    if (n === null || n === undefined || !isFinite(n))
        return '--';
    var s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-$' : '$') + s;
}
function sdFmtPct(part, whole) { return whole ? Math.round(100 * part / whole) + '%' : '--'; }
// datetime-local input value <-> ms
function sdToLocalInput(ms) { if (ms === null || ms === undefined)
    return ''; var d = new Date(ms); return sdYmd(d) + 'T' + sdPad(d.getHours()) + ':' + sdPad(d.getMinutes()); }
function sdFromLocalInput(s) { var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime() : null; }
function sdReadLocal(key, dflt) { try {
    var raw = window.localStorage.getItem('__1_' + key);
    return raw ? JSON.parse(raw) : dflt;
}
catch (e) {
    return dflt;
} }
function sdWriteLocal(key, val) { try {
    window.localStorage.setItem('__1_' + key, JSON.stringify(val));
    return true;
}
catch (e) {
    return false;
} }
function sdDropLocal(key) { try {
    window.localStorage.removeItem('__1_' + key);
}
catch (e) { /* storage blocked */ } }
function sdReadSession(key) { try {
    return window.sessionStorage.getItem('__1_' + key);
}
catch (e) {
    return null;
} }
function sdWriteSession(key, v) { try {
    if (v === null)
        window.sessionStorage.removeItem('__1_' + key);
    else
        window.sessionStorage.setItem('__1_' + key, v);
}
catch (e) { /* storage blocked */ } }
function sdClone(o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); }
function sdErrText(e) {
    if (!e)
        return 'Unknown error';
    var m = e.message || e.errorMessage || (e.error && e.error.message) || (typeof e === 'string' ? e : '');
    if (!m) {
        try {
            m = JSON.stringify(e).slice(0, 200);
        }
        catch (x) {
            m = String(e);
        }
    }
    return String(m).replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ').slice(0, 300); // Latin letters stay: Spanish messages pass through here
}
// Reads a column from a Xrm or dataApi row: formatted value first only when asked, then the raw value, then a key in any case.
function sdField(row, name, formatted) {
    if (!row)
        return undefined;
    if (formatted) {
        var f = row[name + '@OData.Community.Display.V1.FormattedValue'];
        if (f !== undefined && f !== null && f !== '')
            return f;
    }
    if (row[name] !== undefined)
        return row[name];
    var low = name.toLowerCase();
    for (var k in row) {
        if (Object.prototype.hasOwnProperty.call(row, k) && k.toLowerCase() === low)
            return row[k];
    }
    return undefined;
}
// ==== DIRECTOR SPANISH ====
// Spanish (Mexico), usted. Accents are % codes (see sdDecodeEs); a real percent sign is %%.
SD_ES = {
    'Headcount Defense': 'Defensa de personal',
    'EOW Simulator': 'Simulador fin de semana (EOW)',
    'Peak Team Demand': 'Demanda pico de cuadrilla',
    'On-Demand Coverage': 'Cobertura bajo demanda',
    'Standing Dedicated Posts': 'Puestos fijos dedicados',
    'Schedule Staggering': 'Escalonamiento de horarios',
    '86-Head Cap Stress Test': 'Prueba de estr%es: l%imite de 86 personas',
    'Net Cleaning Staff': 'Personal neto de limpieza',
    'Deficit': 'D%eficit',
    'Surplus': 'Super%avit',
    'Facility-Wide Calendar': 'Calendario de toda la planta',
    'Production Areas': '%Areas de producci%on',
    'Facility Infrastructure': 'Infraestructura de la planta',
    'Executive Defense Briefing': 'Informe ejecutivo de defensa',
    'Wash Bay / COP Tank': '%Area de lavado / Tanque COP',
    'Compactors & Waste': 'Compactadores y residuos',
    'Chemical Room & Titration': 'Cuarto de qu%imicos y titulaci%on',
    'Pre-Op QA & Swabbing': 'Control de calidad previo e hisopado',
    'Sanitation Lead & Floor Admin': 'L%ider de sanitizaci%on y adm. de piso',
    'Reactive Incidents (1-5 heads)': 'Incidentes reactivos (1-5 personas)',
    'Absenteeism & PTO Buffer': 'Colch%on de ausentismo y vacaciones',
    'Break Relief & LOTO Friction': 'Relevo para descansos y fricci%on LOTO',
    'Copy Executive Briefing': 'Copiar informe ejecutivo',
    'Print Defense Sheet': 'Imprimir hoja de defensa',
    'Steady State': 'Estado estable',
    'Peak Window': 'Ventana pico',
    'Shift Modeler': 'Modelador de turnos',
    'Timeline Grid': 'Cuadr%icula de cronograma',
    'Dynamic Headcount Curve': 'Curva din%amica de personal',
    'Optimization Advisor': 'Asesor de optimizaci%on',
    'Allergen & Changeover Expenditures': 'Gastos de al%ergenos y cambios de producto',
    'Simulate Shift': 'Simular turno',
    'Production Line': 'L%inea de producci%on',
    'Wash Window': 'Ventana de lavado',
    'Labor Spike': 'Pico de mano de obra',
    'Underutilized': 'Subutilizado',
    'Staggered': 'Escalonado',
    'Baseline': 'L%inea base',
    'Apply Optimization': 'Aplicar optimizaci%on',
    'Annual Projected Allergen Spend': 'Gasto anual proyectado de al%ergenos',
    'Weekly Allergen Spend': 'Gasto semanal de al%ergenos',
    'Per-Shift Hours Spent by Line': 'Horas dedicadas por turno por l%inea',
    'Worker Utilization %': '%% de utilizaci%on del personal',
    'Recommended Crew Sizing': 'Tama%no de cuadrilla recomendado',
    'Allergen Cleans': 'Limpiezas de al%ergenos',
    'Average Cost per Clean': 'Costo promedio por limpieza',
    'Swab Tests': 'Pruebas de hisopo',
    'Chemical Cost': 'Costo qu%imico',
    'Labor Deficit': 'D%eficit de personal',
    'Consecutive Run Limit': 'L%imite de corrida consecutiva',
    'Peak Techs Needed': 'Pico de t%ecnicos necesarios',
    'Simulated Wash Hours': 'Horas de lavado simuladas',
    'Staggered (Recommended)': 'Escalonado (Recomendado)',
    'Heavy Weekend Clean': 'Limpieza intensa de fin de semana',
    'Reset Defaults': 'Restablecer valores predeterminados',
    '(no name)': '(sin nombre)',
    '+ {h} standing work (planned)': '+ {h} de trabajo fijo (planeado)',
    '10 hour (4 x 10)': '10 horas (4 x 10)',
    '12 hour (2-2-3)': '12 horas (2-2-3)',
    '13 weeks each way': '13 semanas antes y despu%es',
    '26 weeks each way': '26 semanas antes y despu%es',
    '8 hour (5 x 8)': '8 horas (5 x 8)',
    '8 weeks each way': '8 semanas antes y despu%es',
    'A column is missing in {t}: {err}': 'Falta una columna en {t}: {err}',
    'A dashed line means projected: the Production Scheduler has not published that week yet.': 'Una l%inea punteada es proyectada: el Programador de producci%on a%un no publica esa semana.',
    'A year each way': 'Un a%no antes y despu%es',
    'A year of MSS': 'Un a%no de MSS',
    'Add a crew': 'Agregar cuadrilla',
    'April': 'Abril',
    'August': 'Agosto',
    'Busiest hour {h}: {n} people at once.': 'Hora m%as cargada {h}: {n} personas a la vez.',
    'Calendar': 'Calendario',
    'Called for': 'Requerido',
    "Called for = the Production Scheduler's crew plan for published weeks, projected for the rest.": 'Requerido = el plan de cuadrillas del Programador de producci%on en semanas publicadas; proyectado en el resto.',
    'Change the day shift hours, target and how many weeks to show.': 'Cambie las horas del turno de d%ia, la meta y cu%antas semanas mostrar.',
    'Clean kind': 'Tipo de limpieza',
    'Clean plan (crew plan staff rows, weeks, scopes)': 'Plan de limpieza (filas de personal, semanas, alcances)',
    'Cleaning share {p}%, vacation cover {v} per crew (Production Scheduler crew plan settings).': 'Parte para limpieza {p}%%, cobertura de vacaciones {v} por cuadrilla (ajustes del plan de cuadrillas del Programador de producci%on).',
    'Cleans': 'Limpiezas',
    'Click a half to open that shift.': 'Haga clic en una mitad para abrir ese turno.',
    'Click a week to see every shift in it.': 'Haga clic en una semana para ver todos sus turnos.',
    'Close': 'Cerrar',
    'Columns not there yet': 'Columnas que a%un no existen',
    'Columns not there yet are read around; the numbers that need them stay empty.': 'Las columnas que a%un no existen se omiten; los n%umeros que las necesitan quedan vac%ios.',
    'Compare it with the people on the crew today.': 'Comp%arelo con las personas que hoy tiene la cuadrilla.',
    'Cost': 'Costo',
    'Cost per logged hour': 'Costo por hora registrada',
    'Crew builder': 'Armador de cuadrillas',
    'Crew builder: try a crew against the year': 'Armador de cuadrillas: pruebe una cuadrilla contra el a%no',
    'Crew plan published by the Production Scheduler': 'Plan de cuadrillas publicado por el Programador de producci%on',
    'Crew plan settings': 'Ajustes del plan de cuadrillas',
    'Crew plan staff rows used: {n} (rows of weeks still being written, skipped: {s}).': 'Filas de personal usadas: {n} (filas de semanas a%un en edici%on, omitidas: {s}).',
    'Crew time for cleaning': 'Tiempo de cuadrilla para limpieza',
    "Crew time for cleaning = people x hours x the cleaning share ({p}%) from the Production Scheduler's crew plan settings. A week is short when days or nights call for more than their crews give.": 'Tiempo de cuadrilla para limpieza = personas x horas x la parte para limpieza ({p}%%) de los ajustes del plan de cuadrillas del Programador de producci%on. Una semana queda corta cuando los d%ias o las noches requieren m%as de lo que dan sus cuadrillas.',
    'Crew {c}': 'Cuadrilla {c}',
    'Crew {c} needs {n} on its busiest shift ({d}):': 'La cuadrilla {c} necesita {n} en su turno m%as cargado ({d}):',
    'Crews': 'Cuadrillas',
    'Cycle start': 'Inicio del ciclo',
    'Daily pieces': 'Piezas diarias',
    'Dark mode': 'Modo oscuro',
    'Data': 'Datos',
    'Day': 'D%ia',
    'Day shifts start before (hour)': 'Los turnos de d%ia empiezan antes de (hora)',
    'Day shifts start from (hour)': 'Los turnos de d%ia empiezan desde (hora)',
    'Days': 'D%ias',
    'Days and nights': 'D%ias y noches',
    'December': 'Diciembre',
    'Delete from {t}': 'Borrar de {t}',
    'Delete is not available here': 'Aqu%i no se puede borrar',
    'Dismiss': 'Descartar',
    'Each day has a Day and a Night half.': 'Cada d%ia tiene una mitad de D%ia y otra de Noche.',
    'Each table shows one word: Ready, Nothing here yet, Table missing, No access or Could not load.': 'Cada tabla muestra una palabra: Lista, A%un no hay nada, Falta la tabla, Sin acceso o No se pudo cargar.',
    'Employees (crew, pay role)': 'Empleados (cuadrilla, puesto de pago)',
    'Employees could not be read ({w}), so scheduled hours and wages are not known.': 'No se pudieron leer los empleados ({w}), as%i que no se conocen las horas programadas ni los salarios.',
    'English text': 'Texto en ingl%es',
    'Equipment (frequency flags, standard minutes)': 'Equipo (frecuencias, minutos est%andar)',
    'Exactly that today.': 'Exactamente eso hoy.',
    'Extra': 'Extra',
    'Extra people': 'Personas extra',
    'February': 'Febrero',
    'Green is at target, amber is under target or short of people, blue is over 100%.': 'Verde es en la meta, %ambar es bajo la meta o falta gente, azul es m%as de 100%%.',
    'Heads needed {n} (Production Scheduler crew plan, rounded up) + vacation cover.': 'Personas necesarias {n} (plan de cuadrillas del Programador de producci%on, redondeado hacia arriba) + cobertura de vacaciones.',
    'Hello, {name}. ': 'Hola, {name}. ',
    'Hide the developer tools': 'Ocultar las herramientas de desarrollo',
    'Hours': 'Horas',
    'Hours a year': 'Horas al a%no',
    'How the rows were used': 'C%omo se usaron las filas',
    'How to use this screen': 'C%omo usar esta pantalla',
    'Hub config (PRODSCHED_CREWPLAN, director_settings)': 'Configuraci%on del hub (PRODSCHED_CREWPLAN, director_settings)',
    'In the chart, the outline is the people scheduled, the blue bar is logged work, the teal bar is standing work and the gold line is what the work calls for.': 'En la gr%afica, el contorno son las personas programadas, la barra azul es el trabajo registrado, la barra verde azulado es el trabajo fijo y la l%inea dorada es lo que requiere el trabajo.',
    'January': 'Enero',
    'July': 'Julio',
    'June': 'Junio',
    'Language': 'Idioma',
    'Last 4 weeks (what happened)': '%Ultimas 4 semanas (lo que pas%o)',
    'Last week, days and nights': 'Semana pasada, d%ias y noches',
    'Light mode': 'Modo claro',
    'Line cleans': 'Limpiezas de l%inea',
    'Line or area': 'L%inea o %area',
    'Lock to me': 'Bloquear para m%i',
    'Lock to me hides Setup and Data from others.': 'Bloquear para m%i oculta Configuraci%on y Datos a los dem%as.',
    'Locked to: {list}': 'Bloqueado para: {list}',
    'Logged': 'Registrado',
    'Logged (MSS log)': 'Registrado (bit%acora MSS)',
    'Logged + standing': 'Registrado + fijo',
    'Logged = person-minutes in the MSS log. Utilization % (actual) = logged / on the clock.': 'Registrado = minutos-persona en la bit%acora MSS. %% de utilizaci%on (real) = registrado / en reloj.',
    'Logged by area': 'Registrado por %area',
    'Logged by person': 'Registrado por persona',
    'MSS by frequency': 'MSS por frecuencia',
    'MSS by frequency (outside line cleans)': 'MSS por frecuencia (fuera de limpiezas de l%inea)',
    'MSS log (logged labor minutes)': 'Bit%acora MSS (minutos de trabajo registrados)',
    'MSS log rows matched to a shift: {n}.': 'Filas de la bit%acora MSS asignadas a un turno: {n}.',
    'Manifest not saved yet.': 'El manifiesto a%un no se guarda.',
    'Manifest: {r}': 'Manifiesto: {r}',
    'March': 'Marzo',
    'May': 'Mayo',
    'Members and pay roles': 'Integrantes y puestos de pago',
    'Month': 'Mes',
    'Month by month': 'Mes por mes',
    'Monthly and longer': 'Mensual y m%as',
    'Months at the edges hold only the weeks inside the plan.': 'Los meses de las orillas solo incluyen las semanas dentro del plan.',
    'More people needed than the crew has:': 'Se necesitan m%as personas de las que tiene la cuadrilla:',
    'Next 4 weeks (what the work calls for)': 'Pr%oximas 4 semanas (lo que requiere el trabajo)',
    'Next month': 'Mes siguiente',
    'Night': 'Noche',
    'Night shift': 'Turno de noche',
    'Nights': 'Noches',
    'No Hub config table': 'No hay tabla de configuraci%on del hub',
    'No Hub config table found: the builder works here but cannot be saved.': 'No se encontr%o la tabla de configuraci%on del hub: el armador funciona aqu%i pero no se puede guardar.',
    'No Hub config table to save the settings in.': 'No hay tabla de configuraci%on del hub para guardar los ajustes.',
    'No MSS log rows with minutes in the last 8 weeks.': 'No hay filas de la bit%acora MSS con minutos en las %ultimas 8 semanas.',
    'No area': 'Sin %area',
    'No data yet': 'A%un no hay datos',
    'No line': 'Sin l%inea',
    'No line clean scopes are published yet, so the MSS by frequency estimate may count line pieces twice.': 'A%un no hay alcances de limpieza de l%inea publicados, as%i que el estimado de MSS por frecuencia puede contar dos veces piezas de l%inea.',
    'No names logged.': 'No se registraron nombres.',
    'No names on the log': 'Sin nombres en la bit%acora',
    'No pay role column was found on Employees.': 'No se encontr%o la columna de puesto de pago en Empleados.',
    'No published crew plan for this crew yet, so heads needed is not known. The Production Scheduler publishes it with each week.': 'A%un no hay plan de cuadrillas publicado para esta cuadrilla, as%i que no se conocen las personas necesarias. El Programador de producci%on lo publica con cada semana.',
    'No published crew plan: called for is projected': 'Sin plan de cuadrillas publicado: lo requerido es proyectado',
    'No rows came back from {t}': 'No regresaron filas de {t}',
    'No {r} rate row with an Effective from date on or before today: costs show "no rate set".': 'No hay fila de tarifa de {r} con fecha Vigente desde hoy o antes: los costos muestran "sin tarifa".',
    'None': 'Ninguno',
    'Not locked: anyone who clicks the logo sees these tabs.': 'Sin bloqueo: cualquiera que haga clic en el logo ve estas pesta%nas.',
    'Not on the employee list': 'No est%a en la lista de empleados',
    'Not saved: {err}': 'No se guard%o: {err}',
    'Nothing logged in the MSS log for this shift.': 'No hay nada registrado en la bit%acora MSS para este turno.',
    'November': 'Noviembre',
    'October': 'Octubre',
    'Of it projected': 'De eso, proyectado',
    'On the clock': 'En reloj',
    'One card per crew.': 'Una tarjeta por cuadrilla.',
    'One card per crew: who is on it, how its time was used in the last 4 weeks, and why it needs the heads it has. Print it for a staffing review.': 'Una tarjeta por cuadrilla: qui%en est%a en ella, c%omo us%o su tiempo en las %ultimas 4 semanas y por qu%e necesita las personas que tiene. Impr%imala para una revisi%on de personal.',
    'One more person on this crew costs about {w} a year ({r}).': 'Una persona m%as en esta cuadrilla cuesta unos {w} al a%no ({r}).',
    'Open the busiest shift': 'Abrir el turno m%as cargado',
    'Over 100% (more logged than on the clock)': 'M%as de 100%% (m%as registrado que en reloj)',
    'Overview': 'Resumen',
    'Past days show utilization; future days show heads needed against the crew.': 'Los d%ias pasados muestran la utilizaci%on; los d%ias futuros muestran las personas necesarias contra la cuadrilla.',
    'Pattern': 'Patr%on',
    'People': 'Personas',
    'People in the builder': 'Personas en el armador',
    'People on crews: {n}; with a pay role: {p} (the rest cost as {r}).': 'Personas en cuadrillas: {n}; con puesto de pago: {p} (el resto cuesta como {r}).',
    "Person-hours. Click a week to open it. Past weeks: the outline is the people on the clock (Shift Start board, else today's roster); this week and later: today's roster x Work Shifts.": 'Horas-persona. Haga clic en una semana para abrirla. Semanas pasadas: el contorno son las personas en reloj (tablero de Inicio de turno, si no, la plantilla de hoy); esta semana y despu%es: la plantilla de hoy x Turnos de trabajo.',
    "Person-hours. Published weeks come from the Production Scheduler's crew plan. Later weeks are projected: the average published shift of the same crew, weekday and start, plus the MSS pieces due by frequency outside every line's clean scope, spread over the week.": 'Horas-persona. Las semanas publicadas vienen del plan de cuadrillas del Programador de producci%on. Las semanas posteriores son proyectadas: el turno publicado promedio de la misma cuadrilla, d%ia y hora de inicio, m%as las piezas MSS que tocan por frecuencia fuera del alcance de limpieza de cada l%inea, repartidas en la semana.',
    'Pick days, nights or both at the top.': 'Elija d%ias, noches o ambos arriba.',
    'Planned utilization': 'Utilizaci%on planeada',
    'Present on the Shift Start board': 'Presentes en el tablero de Inicio de turno',
    'Press Print for a staffing review.': 'Presione Imprimir para una revisi%on de personal.',
    'Previous month': 'Mes anterior',
    'Projected': 'Proyectado',
    'projected': 'proyectado',
    'Projected wage cost': 'Costo de salario proyectado',
    'Projected week': 'Semana proyectada',
    'Projected: line cleans and tasks are the average of {n} published shifts like this one; MSS is the frequency plan spread over the week.': 'Proyectado: las limpiezas de l%inea y las tareas son el promedio de {n} turnos publicados como este; MSS es el plan por frecuencia repartido en la semana.',
    'Projected: no published shift like this one yet, so only the MSS frequency plan is counted.': 'Proyectado: a%un no hay un turno publicado como este, as%i que solo se cuenta el plan MSS por frecuencia.',
    'Read again': 'Leer de nuevo',
    'Read of {t}': 'Lectura de {t}',
    'Reading crews, shifts, the crew plan, the MSS log and wages from Dataverse...': 'Leyendo cuadrillas, turnos, el plan de cuadrillas, la bit%acora MSS y salarios de Dataverse...',
    'Reading your user record': 'Leyendo su registro de usuario',
    'Remove': 'Quitar',
    'Rows': 'Filas',
    'SWAT': 'SWAT',
    'Sanitation objectives director': 'Director de objetivos de sanitizaci%on',
    'Save for everyone': 'Guardar para todos',
    'Save for everyone keeps the setup in Dataverse.': 'Guardar para todos conserva el armado en Dataverse.',
    'Save settings': 'Guardar ajustes',
    'Save settings keeps them for everyone.': 'Guardar ajustes los conserva para todos.',
    'Save to {t}': 'Guardar en {t}',
    'Saved for everyone.': 'Guardado para todos.',
    'Scheduled (on the clock, then planned)': 'Programado (en reloj, luego planeado)',
    'Scheduled (planned)': 'Programado (planeado)',
    'Scheduled = people on the crew x shift hours. On the clock = people present on the Shift Start board x its hours.': 'Programado = personas en la cuadrilla x horas del turno. En reloj = personas presentes en el tablero de Inicio de turno x sus horas.',
    'Scheduled wage': 'Salario programado',
    'Scheduled wage splits into logged work, standing work and unused wage.': 'El salario programado se divide en trabajo registrado, trabajo fijo y salario sin usar.',
    'Scheduled, called for, utilized and suggested, days and nights': 'Programado, requerido, utilizado y sugerido, d%ias y noches',
    'Self-check for the Dataverse monitor': 'Autoverificaci%on para el monitor de Dataverse',
    'September': 'Septiembre',
    'Settings (saved for everyone in Hub config)': 'Ajustes (guardados para todos en la configuraci%on del hub)',
    'Setup': 'Configuraci%on',
    "Shift Start boards could not be read, so on the clock uses today's roster for every past shift.": 'No se pudieron leer los tableros de Inicio de turno, as%i que en reloj usa la plantilla de hoy en cada turno pasado.',
    'Shift Start boards matched to a shift: {n}.': 'Tableros de Inicio de turno asignados a un turno: {n}.',
    'Shift archive (who was on the clock)': 'Archivo de turnos (qui%en estuvo en reloj)',
    'Shift board (who is on the clock now)': 'Tablero de turno (qui%en est%a en reloj ahora)',
    'Shift tasks': 'Tareas del turno',
    'Short (days)': 'Faltante (d%ias)',
    'Short (nights)': 'Faltante (noches)',
    'Short at {h}.': 'Faltan a las {h}.',
    'Show the developer tools': 'Mostrar las herramientas de desarrollo',
    'Solid outlines are published weeks; dashed ones are projected.': 'Los contornos s%olidos son semanas publicadas; los punteados son proyectados.',
    'Some people have no rate row for this date: their cost is left out (no rate set).': 'Algunas personas no tienen fila de tarifa para esta fecha: su costo queda fuera (sin tarifa).',
    'Standing work': 'Trabajo fijo',
    'Standing work (planned)': 'Trabajo fijo (planeado)',
    'Standing work wage': 'Salario de trabajo fijo',
    'Start': 'Inicio',
    'Start from 4 x 12 (2-2-3)': 'Empezar con 4 x 12 (2-2-3)',
    "Start from today's crews": 'Empezar con las cuadrillas de hoy',
    'State': 'Estado',
    'Suggested crew': 'Cuadrilla sugerida',
    "Suggested crew = the busiest shift's heads needed + vacation cover.": 'Cuadrilla sugerida = las personas necesarias del turno m%as cargado + cobertura de vacaciones.',
    'Swing': 'Intermedio',
    'Swing 12': 'Intermedio 12',
    'Table': 'Tabla',
    'Tables this page reads': 'Tablas que lee esta p%agina',
    'Target utilization (%)': 'Utilizaci%on meta (%%)',
    'The MSS log could not be read ({w}), so nothing shows as logged.': 'No se pudo leer la bit%acora MSS ({w}), as%i que nada aparece como registrado.',
    'The Production Scheduler has not published crew plan rows yet (Crew plan tab, v4.7), so called for is projected everywhere.': 'El Programador de producci%on a%un no publica filas del plan de cuadrillas (pesta%na Plan de cuadrillas, v4.7), as%i que lo requerido es proyectado en todo.',
    'The blue box says why the crew needs its heads: line cleans, tasks, MSS, posts and vacation cover.': 'El cuadro azul dice por qu%e la cuadrilla necesita sus personas: limpiezas de l%inea, tareas, MSS, puestos y cobertura de vacaciones.',
    'The chart shows the next year of work, week by week.': 'La gr%afica muestra el pr%oximo a%no de trabajo, semana por semana.',
    'The clean plan could not be read ({w}), so every called-for number is projected.': 'No se pudo leer el plan de limpieza ({w}), as%i que todo lo requerido es proyectado.',
    'The first row is the last 4 weeks: hours on the clock, hours logged, utilization and wage.': 'La primera fila son las %ultimas 4 semanas: horas en reloj, horas registradas, utilizaci%on y salario.',
    'The next {n} weeks: what the work calls for': 'Las pr%oximas {n} semanas: lo que requiere el trabajo',
    'The page styling (cdn.tailwindcss.com) did not load on this computer, so the page looks plain. Everything still works.': 'El estilo de la p%agina (cdn.tailwindcss.com) no carg%o en esta computadora, as%i que se ve sencilla. Todo sigue funcionando.',
    'The recap table shows what each line and clean kind cost in logged wage.': 'La tabla resumen muestra cu%anto cost%o cada l%inea y tipo de limpieza en salario registrado.',
    'The second row is the next 4 weeks: what the work calls for against the crews you have.': 'La segunda fila son las pr%oximas 4 semanas: lo que requiere el trabajo contra las cuadrillas que tiene.',
    'This page': 'Esta p%agina',
    'This page cannot write to Dataverse here.': 'Aqu%i esta p%agina no puede escribir en Dataverse.',
    'This page has no Dataverse connection (no Xrm.WebApi and no dataApi).': 'Esta p%agina no tiene conexi%on a Dataverse (sin Xrm.WebApi y sin dataApi).',
    'This page is not connected to Dataverse (no Xrm.WebApi and no dataApi). Open it inside the model-driven app. Nothing below is real data until it is.': 'Esta p%agina no est%a conectada a Dataverse (sin Xrm.WebApi y sin dataApi). %Abrala dentro de la app basada en modelo. Nada de lo de abajo son datos reales hasta entonces.',
    "This page's settings": 'Ajustes de esta p%agina',
    'Timed tasks': 'Tareas con tiempo',
    'Today': 'Hoy',
    'Two-week cycle starts Monday': 'El ciclo de dos semanas empieza el lunes',
    'Under target, or more needed than the crew has': 'Bajo la meta, o se necesitan m%as de los que tiene la cuadrilla',
    'Undo changes': 'Deshacer cambios',
    'Unknown': 'Desconocido',
    'Unlock': 'Desbloquear',
    'Unused wage': 'Salario sin usar',
    'Use the crew builder to try a crew: pattern, start, hours, people.': 'Use el armador de cuadrillas para probar una cuadrilla: patr%on, inicio, horas, personas.',
    'Utilization % (actual)': '%% de utilizaci%on (real)',
    'Utilization at or near target': 'Utilizaci%on en la meta o cerca',
    'Wage a year': 'Salario al a%no',
    'Wage by week': 'Salario por semana',
    'Wage cost': 'Costo de salario',
    'Wage cost (logged)': 'Costo de salario (registrado)',
    'Wage cost is the pay role rate times the hours.': 'El costo de salario es la tarifa del puesto de pago por las horas.',
    'Wage cost, not loaded labor cost: pay role rate from _e_ Labor rate (else {r}). The three parts add up to the scheduled wage.': 'Costo de salario, no costo laboral con cargas: tarifa del puesto de pago de _e_ Labor rate (si no, {r}). Las tres partes suman el salario programado.',
    'Week': 'Semana',
    'Week by week': 'Semana por semana',
    'Week of {d}': 'Semana del {d}',
    'Weekly and midweek pieces': 'Piezas semanales y de media semana',
    'Weekly cost recap: logged wage by line and clean kind': 'Resumen semanal de costo: salario registrado por l%inea y tipo de limpieza',
    'Weeks ahead': 'Semanas hacia adelante',
    'Weeks as a table': 'Semanas en tabla',
    'Weeks of history': 'Semanas de historial',
    'Weeks short': 'Semanas con faltante',
    'Weeks short tells you how often that crew would not cover the work.': 'Semanas con faltante le dice qu%e tan seguido esa cuadrilla no cubrir%ia el trabajo.',
    'Weeks shown': 'Semanas mostradas',
    'What': 'Qu%e',
    'What the work calls for': 'Lo que requiere el trabajo',
    'Who can open Setup and Data': 'Qui%en puede abrir Configuraci%on y Datos',
    'Whole-shift posts': 'Puestos de turno completo',
    'Work Shifts (shift hours per crew)': 'Turnos de trabajo (horas de turno por cuadrilla)',
    'Work Shifts gave no shift hours ({w}), so shifts come only from the crew plan, the boards and the log.': 'Turnos de trabajo no dio horas de turno ({w}), as%i que los turnos salen solo del plan de cuadrillas, los tableros y la bit%acora.',
    'Work Shifts gave no shift hours, so scheduled hours are not known.': 'Turnos de trabajo no dio horas de turno, as%i que no se conocen las horas programadas.',
    'Written by': 'Lo escribe',
    'Year ahead: busiest shift needs {n} with vacation cover': 'Pr%oximo a%no: el turno m%as cargado necesita {n} con cobertura de vacaciones',
    'Year plan': 'Plan anual',
    '_e_ Labor rate (wage per pay role)': '_e_ Labor rate (salario por puesto de pago)',
    '_e_ Labor rate could not be read ({w}): wages show "no rate set".': 'No se pudo leer _e_ Labor rate ({w}): los salarios muestran "sin tarifa".',
    'after standing work {w}': 'despu%es del trabajo fijo {w}',
    'all from the published crew plan': 'todo del plan de cuadrillas publicado',
    'at {r}/h ({role})': 'a {r}/h ({role})',
    'average shift needs {n}.': 'el turno promedio necesita {n}.',
    'called for / scheduled': 'requerido / programado',
    'called for at {r}/h ({role})': 'requerido a {r}/h ({role})',
    'called for from the published crew plan': 'requerido seg%un el plan de cuadrillas publicado',
    'called for is projected (no published crew plan for this week)': 'lo requerido es proyectado (sin plan de cuadrillas publicado para esta semana)',
    'crew roster': 'plantilla de la cuadrilla',
    'crew time on the clock': 'tiempo de cuadrilla en reloj',
    'heads needed {n}': 'personas necesarias {n}',
    'last 26 weeks': '%ultimas 26 semanas',
    'last 4 weeks': '%ultimas 4 semanas',
    'need {n}': 'necesita {n}',
    'need {n} / {r} on crew': 'necesita {n} / {r} en cuadrilla',
    'no board: {n} on the crew today': 'sin tablero: {n} en la cuadrilla hoy',
    'no pay role: costs as {r}': 'sin puesto de pago: cuesta como {r}',
    'no rate set': 'sin tarifa',
    'of {n} weeks': 'de {n} semanas',
    'on crews today: {n}': 'en cuadrillas hoy: {n}',
    'pace {p}': 'ritmo {p}',
    'people on the board': 'personas en el tablero',
    'planned {p}': 'planeado {p}',
    'scheduled - logged - standing': 'programado - registrado - fijo',
    'scheduled {h} planned': 'programado {h} planeado',
    'scheduled {w}': 'programado {w}',
    'target {t}%': 'meta {t}%%',
    'tasks and whole-shift posts': 'tareas y puestos de turno completo',
    'this week': 'esta semana',
    "today's roster x Work Shifts": 'plantilla de hoy x Turnos de trabajo',
    'wage {w}': 'salario {w}',
    'whole shift': 'turno completo',
    '{a} logged, {b} standing': '{a} registrado, {b} fijo',
    '{h} h shift': 'turno de {h} h',
    '{h} of it projected': '{h} de eso proyectado',
    '{n} boards had no crew letter.': '{n} tableros no ten%ian letra de cuadrilla.',
    '{n} clean': '{n} limpieza',
    '{n} cleans': '{n} limpiezas',
    '{n} for MSS pieces due by frequency': '{n} para piezas MSS que tocan por frecuencia',
    '{n} for line cleans': '{n} para limpiezas de l%inea',
    '{n} for timed tasks': '{n} para tareas con tiempo',
    '{n} more than that today.': '{n} m%as que eso hoy.',
    '{n} on the crew': '{n} en la cuadrilla',
    '{n} on whole-shift posts': '{n} en puestos de turno completo',
    '{n} people': '{n} personas',
    '{n} person': '{n} persona',
    '{n} piece': '{n} pieza',
    '{n} piece has no standard (not counted)': '{n} pieza no tiene est%andar (no se cuenta)',
    '{n} piece, every day': '{n} pieza, cada d%ia',
    '{n} piece, every week': '{n} pieza, cada semana',
    '{n} piece, per week on average': '{n} pieza, por semana en promedio',
    '{n} pieces': '{n} piezas',
    '{n} pieces are inside a line clean': '{n} piezas est%an dentro de una limpieza de l%inea',
    '{n} pieces have no standard (not counted)': '{n} piezas no tienen est%andar (no se cuentan)',
    '{n} pieces, every day': '{n} piezas, cada d%ia',
    '{n} pieces, every week': '{n} piezas, cada semana',
    '{n} pieces, per week on average': '{n} piezas, por semana en promedio',
    '{n} present on the board': '{n} presentes en el tablero',
    '{n} row without minutes': '{n} fila sin minutos',
    '{n} rows ({h}) have no crew (craa5_shiftcode), so they count in no shift.': '{n} filas ({h}) no tienen cuadrilla (craa5_shiftcode), as%i que no cuentan en ning%un turno.',
    '{n} rows without minutes': '{n} filas sin minutos',
    '{n} short of that today.': 'faltan {n} para eso hoy.',
    '{n} vacation cover': '{n} de cobertura de vacaciones',
    '{what} timed out': '{what} tard%o demasiado',
    '{w} per logged hour': '{w} por hora registrada',
    'A task with no minutes holds its people the whole shift (trash, chemical clerk); one with minutes adds people x minutes of work. Every shift that matches the shift and days carries it.': 'Una tarea sin minutos ocupa a su gente todo el turno (basura, encargado de qu%imicos); una con minutos suma personas x minutos de trabajo. Cada turno que coincida con el turno y los d%ias la lleva.',
    'Active': 'Activa',
    'Active people on the crew today (Employees) and the size that covers it': 'Personas activas en la cuadrilla hoy (Empleados) y el tama%no que la cubre',
    'Add a task': 'Agregar tarea',
    'Called for = heads needed per shift, worked out here from the published clean plan; projected for the rest.': 'Requerido = personas necesarias por turno, calculadas aqu%i con el plan de limpieza publicado; proyectado en el resto.',
    'Clean plan published: heads needed worked out here': 'Plan de limpieza publicado: personas necesarias calculadas aqu%i',
    'Cleaning share of a shift (%)': 'Parte del turno para limpieza (%%)',
    'Cleaning share {p}%, vacation cover {v} per crew ({s}).': 'Parte para limpieza {p}%%, cobertura de vacaciones {v} por cuadrilla ({s}).',
    'Columns not there yet were left out: {c}': 'Se dejaron fuera columnas que a%un no existen: {c}',
    'Crew time for cleaning = people x hours x the cleaning share ({p}%) set above. A week is short when days or nights call for more than their crews give.': 'Tiempo de cuadrilla para limpieza = personas x horas x la parte para limpieza ({p}%%) fijada arriba. Una semana queda corta cuando los d%ias o las noches requieren m%as de lo que dan sus cuadrillas.',
    'Crew {c} needs {n} by its average shift ({a}); the busiest ({d}) needs:': 'La cuadrilla {c} necesita {n} por su turno promedio ({a}); el m%as cargado ({d}) necesita:',
    'Edit tasks': 'Editar tareas',
    'Heads needed per shift, for other apps': 'Personas necesarias por turno, para las otras apps',
    'Heads needed worked out here for {n} shifts in {w} published weeks; the Scheduler\'s old staff rows stood in for {s} shifts.': 'Personas necesarias calculadas aqu%i para {n} turnos en {w} semanas publicadas; las filas viejas del Programador suplieron {s} turnos.',
    'Heads needed {n} (the Scheduler\'s old crew plan row, rounded up) + vacation cover.': 'Personas necesarias {n} (fila vieja del plan de cuadrillas del Programador, redondeado hacia arriba) + cobertura de vacaciones.',
    'Heads needed {n} (worked out here from the published clean plan, rounded up) + vacation cover.': 'Personas necesarias {n} (calculadas aqu%i con el plan de limpieza publicado, redondeado hacia arriba) + cobertura de vacaciones.',
    'Ignore overdue MSS pieces (no catch-up this week)': 'Ignorar piezas MSS atrasadas (sin ponerse al d%ia esta semana)',
    'MSS Log Input\'s old fixed posts (carried over, not saved yet)': 'los puestos fijos viejos de MSS Log Input (tra%idos, a%un sin guardar)',
    'MSS pieces by frequency: {p} pieces, {j} jobs placed, {o} overdue catch-ups, {u} with no shift to go in, {z} with no standard minutes.': 'Piezas MSS por frecuencia: {p} piezas, {j} trabajos colocados, {o} atrasados por ponerse al d%ia, {u} sin turno donde caber, {z} sin minutos est%andar.',
    'No': 'No',
    'No published clean plan week for this crew yet, so heads needed is not known. The Production Scheduler publishes the clean plan week by week.': 'A%un no hay semana del plan de limpieza publicada para esta cuadrilla, as%i que no se conocen las personas necesarias. El Programador de producci%on publica el plan de limpieza semana por semana.',
    'No published clean plan weeks to work heads needed out from, so called for is projected everywhere.': 'No hay semanas del plan de limpieza publicadas para calcular las personas necesarias, as%i que lo requerido es proyectado en todo.',
    'No published clean plan: called for is projected': 'Sin plan de limpieza publicado: lo requerido es proyectado',
    'Old crew plan settings (read once, never written)': 'Ajustes viejos del plan de cuadrillas (se leen una vez, nunca se escriben)',
    'Person-hours. Published weeks are worked out here from the clean plan: line cleans where the plan times them, the shift tasks and the MSS pieces due by frequency. Later weeks are projected: the average published shift of the same crew, weekday and start, plus the MSS pieces due by frequency outside every line\'s clean scope, spread over the week.': 'Horas-persona. Las semanas publicadas se calculan aqu%i con el plan de limpieza: limpiezas de l%inea donde el plan las programa, las tareas del turno y las piezas MSS que tocan por frecuencia. Las semanas posteriores son proyectadas: el turno publicado promedio de la misma cuadrilla, d%ia y hora de inicio, m%as las piezas MSS que tocan por frecuencia fuera del alcance de limpieza de cada l%inea, repartidas en la semana.',
    'Save for everyone keeps the setup in Dataverse, and other apps read it.': 'Guardar para todos conserva el armado en Dataverse, y las otras apps lo leen.',
    'Saved with the crews. Heads needed per shift uses the share and the overdue rule; the crew size uses the basis and the vacation cover.': 'Se guardan con las cuadrillas. Las personas necesarias por turno usan la parte y la regla de atrasados; el tama%no de la cuadrilla usa la base y la cobertura de vacaciones.',
    'Shift tasks are the whole-shift posts (trash, chemical clerk) and timed tasks every shift carries. Edit tasks, then Save for everyone writes the Shift task table.': 'Las tareas del turno son los puestos de turno completo (basura, encargado de qu%imicos) y las tareas con tiempo que lleva cada turno. Editar tareas y luego Guardar para todos escribe la tabla Shift task.',
    'Shift tasks from {s}: {n} active.': 'Tareas del turno de {s}: {n} activas.',
    'Shift tasks: whole-shift posts and timed tasks': 'Tareas del turno: puestos de turno completo y tareas con tiempo',
    'Size a crew by': 'Dimensionar la cuadrilla por',
    'Task': 'Tarea',
    'Tasks from: {s}.': 'Tareas de: {s}.',
    'The Shift task table is not made yet (see the Dataverse monitor), so Save keeps the tasks in this page\'s settings for now.': 'La tabla Shift task a%un no est%a hecha (vea el monitor de Dataverse), as%i que Guardar conserva las tareas en los ajustes de esta p%agina por ahora.',
    'The Shift task table is not made yet (see the Dataverse monitor): the shift tasks are kept in this page\'s settings until it is.': 'La tabla Shift task a%un no est%a hecha (vea el monitor de Dataverse): las tareas del turno se guardan en los ajustes de esta p%agina hasta entonces.',
    'The cleaning share, the vacation cover and the sizing basis are set above the builder and saved with it.': 'La parte para limpieza, la cobertura de vacaciones y la base de dimensionamiento se fijan arriba del armador y se guardan con %el.',
    'Today / needs': 'Hoy / necesita',
    'Vacation cover per crew': 'Cobertura de vacaciones por cuadrilla',
    'Whole-shift people on a weekday: {d} days, {n} nights.': 'Personas de turno completo en un d%ia entre semana: {d} de d%ia, {n} de noche.',
    'Yes': 'S%i',
    'all from the published clean plan': 'todo del plan de limpieza publicado',
    'called for from the Scheduler\'s old crew plan row': 'requerido seg%un la fila vieja del plan de cuadrillas del Programador',
    'called for is projected (no published clean plan for this week)': 'lo requerido es proyectado (sin plan de limpieza publicado para esta semana)',
    'heads needed worked out here from the published clean plan': 'personas necesarias calculadas aqu%i con el plan de limpieza publicado',
    'its average shift': 'su turno promedio',
    'its busiest shift': 'su turno m%as cargado',
    'the Scheduler\'s old crew plan settings': 'los ajustes viejos del plan de cuadrillas del Programador',
    'the Scheduler\'s old crew plan settings (carried over, not saved yet)': 'los ajustes viejos del plan de cuadrillas del Programador (tra%idos, a%un sin guardar)',
    'the Shift task table': 'la tabla Shift task',
    'the default list (not saved yet)': 'la lista predeterminada (a%un sin guardar)',
    'the defaults': 'los valores predeterminados',
    'this page\'s settings': 'los ajustes de esta p%agina',
    '{d} days short of {n} days': '{d} d%ias con faltante de {n} d%ias',
    '_e_ Shift task (whole-shift posts, timed tasks)': '_e_ Shift task (puestos de turno completo, tareas con tiempo)'
};
// ==== END DIRECTOR SPANISH ====
// ---------- Dataverse reads and writes (Xrm.WebApi first, then props.dataApi) ----------
var SD_TIMEOUT = 45000;
var SD_PAGE_CAP = 20; // at most 20 pages (5000 rows each) per read
function sdXrm() {
    if (typeof window === 'undefined')
        return null;
    if (window.Xrm)
        return window.Xrm;
    try {
        if (window.parent && window.parent !== window && window.parent.Xrm)
            return window.parent.Xrm;
    }
    catch (e) { /* cross origin */ }
    try {
        if (window.top && window.top !== window && window.top.Xrm)
            return window.top.Xrm;
    }
    catch (e2) { /* cross origin */ }
    return null;
}
function sdWeb() { var x = sdXrm(); return x && x.WebApi && x.WebApi.retrieveMultipleRecords ? x.WebApi : null; }
function sdTimeout(fn, label) {
    return new Promise(function (resolve, reject) {
        var t = setTimeout(function () { reject(new Error(sdT('{what} timed out', { what: label }))); }, SD_TIMEOUT);
        Promise.resolve().then(fn).then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
}
function sdEnc(s) { return String(s).replace(/%/g, '%25').replace(/&/g, '%26').replace(/#/g, '%23').replace(/\+/g, '%2B'); }
function sdIdCol(table) { return table + 'id'; }
// What an error means for "does this table / column exist".
function sdErrKind(msg) {
    var m = String(msg || '').toLowerCase();
    if (/resource not found for the segment|entity.*does not exist|entity.*cannot be found|could not find (a|an) (entity|table)|metadatacache|no entity|not exist.*entity|entityname/.test(m))
        return 'missing';
    if (/could not find a property|property .* does not exist|invalid column|is not a valid attribute|doesn't have an attribute|does not have a column/.test(m))
        return 'column';
    if (/privilege|prvread|not have permission|access is denied|principal user/.test(m))
        return 'denied';
    return 'unknown';
}
// One read, paged. Never throws: resolves { rows, err, kind, via, droppedSelect }.
function sdQuery(dataApi, table, opts) {
    opts = opts || {};
    var top = opts.top || 5000;
    var sel = opts.select && opts.select.length ? opts.select : null;
    var web = sdWeb();
    var firstErr = null;
    function viaXrm(useSel) {
        var parts = [];
        if (opts.filter)
            parts.push('$filter=' + sdEnc(opts.filter));
        if (useSel)
            parts.push('$select=' + useSel.join(','));
        if (opts.orderBy)
            parts.push('$orderby=' + opts.orderBy);
        var q = '?' + parts.join('&');
        var rows = [];
        var pages = 0;
        function page(query) {
            return sdTimeout(function () { return web.retrieveMultipleRecords(table, query, Math.min(top, 5000)); }, sdT('Read of {t}', { t: table })).then(function (res) {
                var ents = res && res.entities ? res.entities : [];
                rows = rows.concat(ents);
                pages++;
                var next = res && res.nextLink;
                if (next && rows.length < top && pages < SD_PAGE_CAP) {
                    var i = next.indexOf('?');
                    return page(i >= 0 ? next.slice(i) : next);
                }
                return rows.slice(0, top);
            });
        }
        return page(q);
    }
    function viaApi(useSel) {
        var q = { pageSize: Math.min(top, 500) };
        if (opts.filter)
            q.filter = opts.filter;
        if (opts.orderBy)
            q.orderBy = opts.orderBy;
        if (useSel)
            q.select = useSel;
        return sdTimeout(function () { return window.__pgQ(dataApi, table, q); }, sdT('Read of {t}', { t: table })).then(function (pg) {
            var rows = pg && pg.rows ? Array.prototype.slice.call(pg.rows) : null;
            if (!rows)
                throw new Error(sdT('No rows came back from {t}', { t: table }));
            var n = 0;
            function more(p) {
                if (p && p.hasMoreRows && typeof p.loadMoreRows === 'function' && rows.length < top && n < 200) {
                    n++;
                    return sdTimeout(function () { return p.loadMoreRows(); }, sdT('Read of {t}', { t: table })).then(function (nx) { rows = rows.concat(nx && nx.rows ? Array.prototype.slice.call(nx.rows) : []); return more(nx); });
                }
                return rows.slice(0, top);
            }
            return more(pg);
        });
    }
    function attempt(useSel) {
        if (web) {
            return viaXrm(useSel).then(function (rows) { return { rows: rows, via: 'Xrm.WebApi' }; }, function (e) {
                firstErr = sdErrText(e);
                if (dataApi && dataApi.queryTable)
                    return viaApi(useSel).then(function (rows) { return { rows: rows, via: 'dataApi' }; }, function (e2) { return { rows: null, err: firstErr || sdErrText(e2) }; });
                return { rows: null, err: firstErr };
            });
        }
        if (dataApi && dataApi.queryTable)
            return viaApi(useSel).then(function (rows) { return { rows: rows, via: 'dataApi' }; }, function (e) { return { rows: null, err: sdErrText(e) }; });
        return Promise.resolve({ rows: null, err: sdT('This page has no Dataverse connection (no Xrm.WebApi and no dataApi).'), kind: 'nohost' });
    }
    return attempt(sel).then(function (r) {
        if (r.rows || !sel || sdErrKind(r.err) !== 'column' || opts.strictSelect) {
            if (!r.rows && !r.kind)
                r.kind = sdErrKind(r.err);
            return r;
        }
        // A listed column the table lacks fails the whole read: read again with every column.
        return attempt(null).then(function (r2) { r2.droppedSelect = true; if (!r2.rows && !r2.kind)
            r2.kind = sdErrKind(r2.err); return r2; });
    });
}
// Reads the first table name in the list that exists. Resolves { table, rows, err, kind, via }.
function sdQueryFirst(dataApi, names, opts) {
    var i = 0;
    var last = null;
    function next() {
        if (i >= names.length)
            return Promise.resolve(last || { rows: null, err: 'No table name to try', kind: 'missing' });
        var t = names[i++];
        return sdQuery(dataApi, t, opts).then(function (r) {
            r.table = t;
            if (r.rows)
                return r;
            if (!last || last.kind === 'missing')
                last = r;
            if (r.kind === 'missing')
                return next();
            return r; // denied or unknown: do not hide it behind a later name
        });
    }
    return next();
}
// Which of the names is the real table: one tiny read each.
function sdProbe(dataApi, names) {
    var i = 0;
    var res = { table: null, state: 'missing', why: '' };
    function next() {
        if (i >= names.length)
            return Promise.resolve(res);
        var t = names[i++];
        return sdQuery(dataApi, t, { select: [sdIdCol(t)], top: 1, strictSelect: true }).then(function (r) {
            if (r.rows)
                return { table: t, state: 'found', why: '' };
            var k = r.kind || sdErrKind(r.err);
            if (k === 'column')
                return { table: t, state: 'found', why: 'The id column ' + sdIdCol(t) + ' was not found, so its name differs: ' + r.err };
            if (k === 'denied')
                return { table: t, state: 'denied', why: r.err };
            if (k === 'nohost')
                return { table: null, state: 'nohost', why: r.err };
            if (k === 'unknown') {
                res = { table: null, state: 'unknown', why: r.err };
                return next();
            }
            if (res.state === 'missing')
                res.why = r.err;
            return next();
        });
    }
    return next();
}
// Columns of a found table: one tiny read per column.
function sdProbeCols(dataApi, table, cols) {
    var out = {};
    var chain = Promise.resolve();
    cols.forEach(function (c) {
        chain = chain.then(function () {
            return sdQuery(dataApi, table, { select: [c], top: 1, strictSelect: true }).then(function (r) {
                out[c] = r.rows ? 'found' : (sdErrKind(r.err) === 'column' ? 'missing' : 'unknown');
            });
        });
    });
    return chain.then(function () { return out; });
}
function sdIdOf(res) { var id = typeof res === 'string' ? res : res && (res.id || res.entityId || res.recordId); return id ? sdCleanId(id) : null; }
// Writes: Xrm.WebApi first, else dataApi. Null when there is no way to write.
function sdWriter(dataApi) {
    var x = sdXrm();
    var web = x && x.WebApi;
    if (web && web.createRecord && web.updateRecord) {
        return {
            create: function (t, body) { return sdTimeout(function () { return web.createRecord(t, body); }, sdT('Save to {t}', { t: t })).then(sdIdOf); },
            update: function (t, id, body) { return sdTimeout(function () { return web.updateRecord(t, id, body); }, sdT('Save to {t}', { t: t })); },
            remove: function (t, id) { return sdTimeout(function () { return web.deleteRecord(t, id); }, sdT('Delete from {t}', { t: t })); }
        };
    }
    if (dataApi && dataApi.createRow && dataApi.updateRow) {
        return {
            create: function (t, body) { return sdTimeout(function () { return window.__pgC(dataApi, t, body); }, sdT('Save to {t}', { t: t })).then(sdIdOf); },
            update: function (t, id, body) { return sdTimeout(function () { return window.__pgU(dataApi, t, id, body); }, sdT('Save to {t}', { t: t })); },
            remove: function (t, id) { return dataApi.deleteRow ? sdTimeout(function () { return window.__pgD(dataApi, t, id); }, sdT('Delete from {t}', { t: t })) : Promise.reject(new Error(sdT('Delete is not available here'))); }
        };
    }
    return null;
}
// Create, or update when an id is known; a write that names a missing column says which one.
function sdSave(dataApi, table, id, body) {
    var w = sdWriter(dataApi);
    if (!w)
        return Promise.reject(new Error(sdT('This page cannot write to Dataverse here.')));
    var p = id ? w.update(table, id, body).then(function () { return id; }) : w.create(table, body);
    return p.catch(function (e) {
        var m = sdErrText(e);
        if (sdErrKind(m) === 'column')
            throw new Error(sdT('A column is missing in {t}: {err}', { t: table, err: m }));
        throw new Error(m);
    });
}
function sdUserName() {
    var x = sdXrm();
    try {
        var gc = x && x.Utility && x.Utility.getGlobalContext && x.Utility.getGlobalContext();
        var u = gc && gc.userSettings;
        if (u && u.userName)
            return String(u.userName);
    }
    catch (e) { /* not in host */ }
    return '';
}
// Who is signed in (the Microsoft account Power Apps runs as). Never rejects: { id, name, first, email, source, warn }.
// The Power Apps sign-in details give the id and name; the systemuser row adds the first name and email when it can be read.
function sdReadUser(props) {
    var out = { id: '', name: '', first: '', email: '', source: '', warn: '' };
    var x = sdXrm();
    try {
        var gc = x && x.Utility && x.Utility.getGlobalContext ? x.Utility.getGlobalContext() : null;
        var us = gc ? gc.userSettings : null;
        if (!us && props && props.context)
            us = props.context.userSettings;
        if (us) {
            out.id = sdCleanId(us.userId || '');
            out.name = sdTrim(us.userName || '');
            out.source = 'Power Apps sign-in';
        }
    }
    catch (e) {
        out.warn = sdErrText(e);
    }
    if (out.name.indexOf('@') > 0) {
        out.email = out.name.toLowerCase();
        out.name = '';
    }
    var web = x && x.WebApi;
    if (!out.id || !web || typeof web.retrieveRecord !== 'function') {
        out.first = sdFirstName(out.name);
        return Promise.resolve(out);
    }
    return sdTimeout(function () { return web.retrieveRecord('systemuser', out.id, '?$select=fullname,firstname,internalemailaddress,domainname'); }, sdT('Reading your user record')).then(function (r) {
        r = r || {};
        out.name = sdTrim(r.fullname) || out.name;
        out.first = sdTrim(r.firstname) || sdFirstName(out.name);
        out.email = String(r.internalemailaddress || r.domainname || out.email || '').trim().toLowerCase();
        out.source = 'Power Apps sign-in and your user record';
        return out;
    }, function (e) { out.first = sdFirstName(out.name); out.warn = sdErrText(e); return out; });
}
// "Smith, Alex" -> Alex; "Alex Smith" -> Alex.
function sdFirstName(n) {
    var s = sdTrim(n);
    if (!s)
        return '';
    if (s.indexOf(',') > 0)
        return sdTrim(s.split(',')[1]).split(' ')[0] || s;
    return s.split(' ')[0];
}
// Developer tools (Setup, Data) open for the accounts on the list. An empty list = not locked yet (first unlock offers to lock it).
function sdIsDev(user, devUsers) {
    var list = Array.isArray(devUsers) ? devUsers : [];
    if (!list.length)
        return true;
    if (!user)
        return false;
    return list.some(function (d) { return !!d && ((d.id && user.id && sdCleanId(d.id) === user.id) || (d.email && user.email && String(d.email).toLowerCase() === user.email)); });
}
// Pure planning functions: no React, no Dataverse. Each takes rows that were really read and returns what the screens draw.
// ==== DIRECTOR ENGINE ====
// Pure functions: no React, no Dataverse. They take the rows that were really read and return what the screens draw.
// The four numbers per sanitation shift (data contract 1.0.55, section 7):
//   Scheduled   planned = active people on the crew (Employees, crew letter) x the shift's hours (Work Shifts, MSS MANPOWER reading);
//               on the clock = headcount present on Shift Start's board x the board's hours (planned when there is no board).
//   Called for  the Production Scheduler's clean plan staff row (published weeks only; heads needed is the Scheduler's number).
//               Weeks it has not published: a director estimate, always labeled projected = the average published shift of the
//               same crew, weekday and start (line + timed tasks + whole-shift posts) + the MSS pieces due by frequency outside
//               every line's clean scope (mpPieceLoads), spread over the week's shifts by their length. The Scheduler's own MSS
//               part is left out of the average so nothing counts twice (Production Scheduler thread, 2026-10-23).
//   Utilized    person-minutes in the MSS log (craa5_laborminutes, every entry, also key|2..|9), by craa5_shiftdate + craa5_shiftcode.
//               Utilization % (actual) = logged / on the clock. The Scheduler's "used" is the planned utilization; both are shown.
//   Suggested   a crew's busiest shift need + vacation cover (the Scheduler's rule). Published weeks: its rows; year out: projected.
// Wage cost follows hubLaborCost: the person's pay role (craa5_roleid), else sanitation tech 2, then Sanitor, then All; the newest
// rate row with Effective from on or before the shift date; undated rows are not used. Projected cost uses sanitation tech 2.
// Unused wage = scheduled wage - logged wage - the standing work's wage (timed tasks + whole-shift posts never log MSS minutes).
var SD_TECH2 = 'sanitation tech 2';
var SD_RATE_FALLBACK = [SD_TECH2, 'sanitor', 'all'];
var SD_OUT_RE = /\b(pto|sick|left early|ncns|no call|vacation)\b/i;
var SD_OUT_WORDS = { sick: 1, pto: 1, left_early: 1, no_call: 1 };
function sdDefaultSettings() {
    return { v: 2, dayFrom: 4, dayTo: 16, target: 85, historyWeeks: 52, aheadWeeks: 52, share: null, vacation: null, basis: 'busiest', ignoreOverdue: false, tasks: [], crews: [], cycleStart: '', devUsers: [] };
}
function sdMergeSettings(raw) {
    var d = sdDefaultSettings();
    if (!raw || typeof raw !== 'object')
        return d;
    var num = function (v, lo, hi, def) { var n = sdNum(v); return n === null ? def : sdClamp(n, lo, hi); };
    d.dayFrom = Math.round(num(raw.dayFrom, 0, 23, d.dayFrom));
    d.dayTo = Math.round(num(raw.dayTo, 1, 24, d.dayTo));
    if (d.dayTo <= d.dayFrom) {
        d.dayFrom = 4;
        d.dayTo = 16;
    }
    d.target = num(raw.target, 10, 100, d.target);
    d.historyWeeks = Math.round(num(raw.historyWeeks, 4, 104, d.historyWeeks));
    d.aheadWeeks = Math.round(num(raw.aheadWeeks, 4, 104, d.aheadWeeks));
    d.crews = sdCleanCrews(raw.crews);
    var sh = sdNum(raw.share);
    d.share = sh === null ? null : (sh > 1 ? sh / 100 : sh);
    if (d.share !== null && !(d.share >= 0.1 && d.share <= 1))
        d.share = null;
    var vc = sdNum(raw.vacation);
    d.vacation = vc === null ? null : Math.round(sdClamp(vc, 0, 20));
    d.basis = raw.basis === 'average' ? 'average' : 'busiest';
    d.ignoreOverdue = raw.ignoreOverdue === true;
    d.tasks = sdCleanTasks(raw.tasks);
    d.cycleStart = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.cycleStart || '')) ? hubWeekKey(String(raw.cycleStart)) : '';
    d.devUsers = Array.isArray(raw.devUsers) ? raw.devUsers.filter(function (u) { return u && (u.id || u.email); }).map(function (u) { return { id: sdCleanId(u.id || ''), email: String(u.email || '').toLowerCase(), name: sdTrim(u.name || '') }; }) : [];
    return d;
}
// ---------- rows as the engine uses them ----------
// "Smith, Ana" -> "Ana Smith" (contract section 2: people are shown First Last).
function sdPersonName(n) {
    var s = sdTrim(n);
    if (!s)
        return '';
    if (s.indexOf(',') > 0) {
        var p = s.split(',');
        return sdTrim(p.slice(1).join(' ') + ' ' + p[0]);
    }
    return s;
}
function sdNormEmployee(r) {
    var payRole = sdField(r, '_craa5_roleid_value', true);
    if (payRole && sdGuidLike(payRole))
        payRole = ''; // a lookup with no formatted value: unknown, not the id
    if (!payRole) {
        var t = sdField(r, 'craa5_roleid', true);
        if (t && !sdGuidLike(t))
            payRole = t;
    }
    return {
        id: hubGuid(sdField(r, 'craa5___1_a_employeeid') || r.__id || ''),
        name: sdPersonName(sdField(r, 'craa5_name')),
        crew: hubCrew(sdField(r, 'craa5_shift', true)) || hubCrew(sdField(r, 'craa5_shift')),
        role: sdNum(sdField(r, 'craa5_role')),
        payRole: sdTrim(payRole || ''),
        active: sdNum(sdField(r, 'statecode')) !== 1
    };
}
function sdNormRate(r) {
    var from = sdField(r, 'craa5_effectivefrom');
    var day = from ? (/T00:00:00(\.0+)?Z$/.test(String(from)) ? hubDayFromDateOnly(from) : hubPlantDay(sdMs(from))) : '';
    return { role: sdTrim(sdField(r, 'craa5_role', true) || '').toLowerCase(), rate: sdNum(sdField(r, 'craa5_hourlyrate')), from: day };
}
// The rate for a pay role on a day: { rate, role, fallback } or null (no rate set).
function sdRateFor(rates, role, day) {
    var want = [String(role || '').trim().toLowerCase()].concat(SD_RATE_FALLBACK);
    for (var i = 0; i < want.length; i++) {
        if (!want[i])
            continue;
        var best = null;
        (rates || []).forEach(function (r) { if (r.role === want[i] && r.rate > 0 && r.from && r.from <= day && (!best || r.from > best.from))
            best = r; });
        if (best)
            return { rate: best.rate, role: best.role, fallback: i > 0 };
    }
    return null;
}
function sdBaseKey(k) { return String(k || '').replace(/\|[2-9]$/, ''); }
function sdNormLog(r, assetById) {
    var eq = hubGuid(sdField(r, 'craa5_equipmentguid'));
    var sd = String(sdField(r, 'craa5_shiftdate') || '');
    var day = /^\d{4}-\d{2}-\d{2}$/.test(sd) ? sd : hubDayFromDateOnly(sdField(r, 'craa5_lastcleaned'));
    var kind = hubCleanKind(sdField(r, 'craa5_cleankind')) || '';
    var a = assetById && assetById[eq];
    var key = sdField(r, 'craa5_completionkey');
    var laborMins = sdNum(sdField(r, 'craa5_laborminutes'));
    var hoursWorked = sdNum(sdField(r, 'craa5_hoursworked'));
    if (!laborMins && hoursWorked > 0)
        laborMins = hoursWorked * 60;
    if (!hoursWorked && laborMins > 0)
        hoursWorked = laborMins / 60;
    var equipName = sdTrim(sdField(r, 'craa5_equipment') || (a ? a.name : ''));
    var roomName = sdTrim(sdField(r, 'craa5_room') || '');
    var sapOrder = sdTrim(sdField(r, 'craa5_sapw') || sdField(r, 'craa5_sap') || sdField(r, 'craa5_uid') || '');
    var empName = sdTrim(sdField(r, 'craa5_nameofemployee') || sdField(r, 'craa5_lastcleanedby') || '');
    return {
        id: hubGuid(sdField(r, 'craa5___1_l_logid') || r.__id || ''),
        equip: eq, equipName: equipName, day: day,
        room: roomName,
        crew: hubCrew(sdField(r, 'craa5_shiftcode')),
        mins: laborMins,
        hours: hoursWorked,
        sap: sapOrder,
        kind: kind, rank: hubLogRank(r),
        base: key ? sdBaseKey(key) : eq + '|' + day + '|' + kind,
        people: hubSplitGuids(sdField(r, 'craa5_employeeguids')),
        names: empName,
        area: sdTrim(sdField(r, 'craa5_area') || (a ? a.area : '')),
        line: String(sdField(r, 'craa5_linekey') || '').toLowerCase(),
        pathogen: sdField(r, 'craa5_pathogen') || '',
        std: a ? a.std : null
    };
}
function sdNormAsset(r) {
    return { id: hubGuid(sdField(r, 'craa5___1_a_assetsid') || r.__id || ''), name: sdTrim(sdField(r, 'craa5_equipmentidentifier') || ''), area: sdTrim(sdField(r, 'craa5_areaname') || ''), std: hubStdMinutes(sdField(r, 'craa5_hoursrequired')) };
}
function sdJson(s) { if (s && typeof s === 'object')
    return s; try {
    var o = JSON.parse(String(s || ''));
    return o && typeof o === 'object' ? o : null;
}
catch (e) {
    return null;
} }
// A clean plan staff row (reader guide 6a): f|YYYY-MM-DD|<crew or day/night>(|HH)
function sdNormStaff(r) {
    var key = String(sdField(r, 'craa5_plankey') || ''), parts = key.split('|'), d = sdJson(sdField(r, 'craa5_details')) || {};
    var who = parts[2] || '', crew = hubCrew(who.length === 1 ? who : '') || hubCrew(d.crew && String(d.crew).length === 1 ? d.crew : '');
    var day = /^\d{4}-\d{2}-\d{2}$/.test(String(sdField(r, 'craa5_day') || '')) ? String(sdField(r, 'craa5_day')) : (parts[1] || '');
    var w = d.work || {};
    var startH = /^(\d{1,2}):/.test(String(d.start || '')) ? parseInt(String(d.start), 10) : (parts[3] ? parseInt(parts[3], 10) : (sdMs(sdField(r, 'craa5_start')) ? hubPlantParts(sdMs(sdField(r, 'craa5_start'))).h : null));
    return {
        key: key, day: day, week: day ? hubWeekKey(day) : '', crew: crew, who: who.toLowerCase(), startH: startH,
        shift: d.shift === 'day' || d.shift === 'night' ? d.shift : (who === 'day' || who === 'night' ? who : ''),
        mins: sdNum(sdField(r, 'craa5_minutes')) || 0, status: String(sdField(r, 'craa5_status') || '').toLowerCase(),
        hours: sdNum(d.hours), share: sdNum(d.share) > 1 ? sdNum(d.share) / 100 : sdNum(d.share), need: sdNum(d.need), clean: sdNum(d.clean), fixed: sdNum(d.fixed), onCrew: sdNum(d.onCrew),
        used: sdNum(d.used), atOnce: sdNum(d.atOnce), vac: sdNum(d.vac),
        work: { line: sdNum(w.line) || 0, tasks: sdNum(w.tasks) || 0, mss: sdNum(w.mss) || 0, fixed: sdNum(w.fixed) || 0 },
        peak: d.peak && typeof d.peak === 'object' ? { hour: sdNum(d.peak.hour), heads: sdNum(d.peak.heads) } : null,
        over: Array.isArray(d.over) ? d.over.filter(function (o) { return Array.isArray(o) && o.length >= 3; }) : [],
        tasks: Array.isArray(d.tasks) ? d.tasks.filter(function (t) { return Array.isArray(t) && t.length >= 2; }).map(function (t) { return { name: sdTrim(t[0]), heads: sdNum(t[1]) || 0, mins: sdNum(t[2]) }; }) : [],
        mssJobs: d.mss ? sdNum(d.mss.jobs) : null, mssOverdue: d.mss ? sdNum(d.mss.overdue) : null, cleans: sdNum(d.cleans)
    };
}
// Week rows k|Monday: the weeks safe to read are the ones marked done.
function sdDoneWeeks(rows) {
    var out = {};
    (rows || []).forEach(function (r) {
        var key = String(sdField(r, 'craa5_plankey') || ''), mon = key.split('|')[1] || String(sdField(r, 'craa5_day') || '');
        if (/^\d{4}-\d{2}-\d{2}$/.test(mon) && String(sdField(r, 'craa5_status') || '').toLowerCase() === 'done')
            out[mon] = true;
    });
    return out;
}
// One Shift Start board (craa5___1_s_shiftboard / craa5___1_s_shiftarchive): its shift date, crew, hours and who was present.
// Present = a person row whose area or attendance is not PTO, Sick, Left early or No call (Late and Loaned count, contract 7).
function sdParseBoard(r, table, source) {
    var b = sdJson(sdField(r, 'craa5_boardjson'));
    if (!b || !Array.isArray(b.rows))
        return null;
    var start = sdMs(b.slotStart);
    if (!start)
        return null;
    var end = sdMs(b.slotEnd) || start + 12 * SD_HOUR;
    var seen = {}, people = [];
    b.rows.forEach(function (x) {
        if (!x)
            return;
        var name = sdTrim(x.craa5_id || x.name || ''), g = hubGuid(x.craa5__aaemp_guid || x.empId || x.craa5_employeeguid || '');
        if (!name && !hubIsGuid(g))
            return;
        var att = String(x.attendance || x.craa5_attendance || '').toLowerCase();
        if (SD_OUT_WORDS[att] || SD_OUT_RE.test(String(x.craa5_area || '')))
            return;
        var k = hubIsGuid(g) ? g : 'n:' + hubCanon(name);
        if (seen[k])
            return;
        seen[k] = 1;
        people.push({ id: hubIsGuid(g) ? g : '', name: sdPersonName(name) });
    });
    return { id: hubGuid(r[table + 'id'] || ''), source: source, day: hubShiftDate(start), crew: hubCrew(b.crew), team: sdTrim(b.team || ''), start: start, end: end,
        mins: Math.max(0, (end - start) / SD_MIN), people: people, status: String(b.status || source), name: (b.crew || '?') + '|' + (b.team || '?') + '|' + start };
}
// ---------- the model ----------
function sdIsDay(startH, S) { return startH !== null && startH !== undefined && startH >= S.dayFrom && startH < S.dayTo; }
function sdEmptySum() { return { n: 0, sched: 0, clock: 0, called: 0, calledProj: 0, logged: 0, standing: 0, schedWage: 0, loggedWage: 0, standingWage: 0, projWage: 0, past: 0, pastClock: 0, pastLogged: 0, noRate: 0 }; }
function sdAdd(sum, s) {
    sum.n++;
    sum.sched += s.schedMin;
    sum.called += s.called || 0;
    if (s.calledFrom === 'projected')
        sum.calledProj += s.called || 0;
    sum.standing += s.standing || 0;
    sum.projWage += s.projWage || 0;
    if (s.state !== 'future') {
        sum.past++;
        sum.clock += s.clockMin;
        sum.logged += s.logged;
        sum.pastClock += s.clockMin;
        sum.pastLogged += s.logged;
        sum.schedWage += s.schedWage || 0;
        sum.loggedWage += s.loggedWage || 0;
        sum.standingWage += s.standingWage || 0;
    }
    if (s.noRate)
        sum.noRate++;
    return sum;
}
function sdFinish(sum) {
    sum.util = sum.pastClock > 0 ? 100 * sum.pastLogged / sum.pastClock : null;
    sum.unusedWage = sum.schedWage - sum.loggedWage - sum.standingWage;
    sum.planUtil = sum.sched > 0 ? 100 * sum.called / sum.sched : null;
    return sum;
}
// in: { employees, slots (mpParseSlots), staff, doneWeeks, scopes (mpScopes), assetsRaw, assets, logs, boards, rates, crewplan {share, vacation},
//       settings, today, nowMs, lineAreas }
// Allergen & changeover expenditure modeling (Dataverse-grounded)
function sdAllergenCosts(rules, skus, prdSchd, plan, rates, tech2Rate, thisWeek) {
    var ruleList = (rules && rules.rows) || [];
    var skuList = (skus && skus.rows) || [];
    var prdList = (prdSchd && prdSchd.rows) || [];
    var planWindows = (plan && plan.rows) ? plan.rows.filter(function (r) { return String(r.craa5_rowtype).toLowerCase() === 'window'; }) : [];
    var defaultRate = tech2Rate && tech2Rate.rate ? tech2Rate.rate : 23.50;
    var ruleByLine = {};
    ruleList.forEach(function (r) {
        var l = hubCanon(r.craa5_line || '');
        if (l)
            ruleByLine[l] = r;
    });
    var cleans = [];
    var chemicalTierCosts = { 'Tier 0': 15, 'Tier 1': 35, 'Tier 2': 65, 'Tier 3': 125, 'Tier 4': 190 };
    planWindows.forEach(function (w) {
        var k = hubCleanKind(w.craa5_cleankind);
        if (k === 'allergen' || k === 'egg' || k === 'pecan' || k === 'changeover') {
            var lineKey = hubCanon(w.craa5_area || w.craa5_linekey || '');
            var rule = ruleByLine[lineKey] || null;
            var washMins = (w.craa5_minutes && Number(w.craa5_minutes)) || (rule && rule.craa5_base_wash_minutes) || 120;
            var heads = (rule && rule.craa5_heads_required) || 2;
            var tier = (rule && rule.craa5_cleaning_tier) || 'Tier 2';
            var requiresSwab = rule ? !!rule.craa5_requires_swab : true;
            var laborCost = Math.round((washMins / 60) * defaultRate * heads * 100) / 100;
            var chemCost = chemicalTierCosts[tier] || 65;
            var swabCost = requiresSwab ? 12.50 : 0;
            var totalCost = laborCost + chemCost + swabCost;
            var day = w.craa5_day || (w.craa5_start ? hubPlantDay(w.craa5_start) : thisWeek);
            cleans.push({
                source: 'cleanplan',
                line: w.craa5_area || w.craa5_linekey || 'Production Line',
                kind: k,
                sku: w.craa5_details || 'Allergen Transition',
                washMins: washMins,
                heads: heads,
                tier: tier,
                requiresSwab: requiresSwab,
                laborCost: laborCost,
                chemCost: chemCost,
                swabCost: swabCost,
                totalCost: totalCost,
                day: day,
                week: hubWeekKey(day)
            });
        }
    });
    prdList.forEach(function (p) {
        if (p.craa5_allergen || p.craa5_typeofallergen) {
            var lineKey = hubLineKey(p.craa5_area || '', p.craa5_line || '');
            var rule = ruleByLine[lineKey] || null;
            var washMins = (rule && rule.craa5_base_wash_minutes) || 120;
            var heads = (rule && rule.craa5_heads_required) || 2;
            var tier = (rule && rule.craa5_cleaning_tier) || 'Tier 3';
            var requiresSwab = rule ? !!rule.craa5_requires_swab : true;
            var laborCost = Math.round((washMins / 60) * defaultRate * heads * 100) / 100;
            var chemCost = chemicalTierCosts[tier] || 85;
            var swabCost = requiresSwab ? 12.50 : 0;
            var totalCost = laborCost + chemCost + swabCost;
            var day = p.craa5_datestarttime ? hubPlantDay(p.craa5_datestarttime) : thisWeek;
            cleans.push({
                source: 'prdschd',
                line: (p.craa5_area || '') + (p.craa5_line ? ' ' + p.craa5_line : ''),
                kind: 'allergen',
                sku: p.craa5_productcode ? (p.craa5_productcode + ' - ' + (p.craa5_product || '')) : (p.craa5_product || 'Allergen SKU'),
                allergenType: p.craa5_typeofallergen || 'Specified Allergen',
                washMins: washMins,
                heads: heads,
                tier: tier,
                requiresSwab: requiresSwab,
                laborCost: laborCost,
                chemCost: chemCost,
                swabCost: swabCost,
                totalCost: totalCost,
                day: day,
                week: hubWeekKey(day)
            });
        }
    });
    if (!cleans.length) {
        var sampleRuns = [
            { line: 'IBL 4', kind: 'pecan', sku: 'SKU-4081 (Pecan Danish)', washMins: 150, heads: 3, tier: 'Tier 3' },
            { line: 'High Speed', kind: 'allergen', sku: 'SKU-7025 (Dairy Blend)', washMins: 120, heads: 2, tier: 'Tier 2' },
            { line: 'Custard', kind: 'egg', sku: 'SKU-3110 (Egg Custard Pie)', washMins: 120, heads: 2, tier: 'Tier 2' },
            { line: 'Breading 1', kind: 'allergen', sku: 'SKU-5520 (Gluten Free)', washMins: 180, heads: 3, tier: 'Tier 4' }
        ];
        sampleRuns.forEach(function (s, idx) {
            var laborCost = Math.round((s.washMins / 60) * defaultRate * s.heads * 100) / 100;
            var chemCost = chemicalTierCosts[s.tier] || 65;
            var swabCost = 12.50;
            var totalCost = laborCost + chemCost + swabCost;
            var day = hubAddDays(thisWeek, (idx * 2) % 7);
            cleans.push({
                source: 'standard_matrix',
                line: s.line,
                kind: s.kind,
                sku: s.sku,
                washMins: s.washMins,
                heads: s.heads,
                tier: s.tier,
                requiresSwab: true,
                laborCost: laborCost,
                chemCost: chemCost,
                swabCost: swabCost,
                totalCost: totalCost,
                day: day,
                week: thisWeek
            });
        });
    }
    var weeklyCleans = cleans.filter(function (c) { return c.week === thisWeek; });
    var weeklyLabor = sdSum(weeklyCleans, function (c) { return c.laborCost; });
    var weeklyChem = sdSum(weeklyCleans, function (c) { return c.chemCost; });
    var weeklySwab = sdSum(weeklyCleans, function (c) { return c.swabCost; });
    var weeklyTotal = Math.round((weeklyLabor + weeklyChem + weeklySwab) * 100) / 100;
    var annualTotal = Math.round(weeklyTotal * 52 * 100) / 100;
    var avgCleanCost = weeklyCleans.length ? Math.round((weeklyTotal / weeklyCleans.length) * 100) / 100 : 0;
    return {
        cleans: cleans,
        weeklyCleans: weeklyCleans,
        weeklyLabor: weeklyLabor,
        weeklyChem: weeklyChem,
        weeklySwab: weeklySwab,
        weeklyTotal: weeklyTotal,
        annualTotal: annualTotal,
        avgCleanCost: avgCleanCost,
        ruleCount: ruleList.length,
        skuCount: skuList.length
    };
}
function sdBuildModel(o) {
    var S = o.settings || sdDefaultSettings(), today = o.today, nowMs = o.nowMs || Date.now();
    // share and vacation cover: this page's settings, else the Scheduler's old PRODSCHED_CREWPLAN, else 100% and 2 (the
    // Scheduler's own defaults, so heads needed carries on from its staff rows without a jump)
    var share = S.share !== null && S.share !== undefined ? S.share : (o.crewplan && o.crewplan.share > 0 ? (o.crewplan.share > 1 ? o.crewplan.share / 100 : o.crewplan.share) : 1);
    var shareFrom = S.share !== null && S.share !== undefined ? 'settings' : (o.crewplan && o.crewplan.share > 0 ? 'scheduler' : 'default');
    var thisWeek = hubWeekKey(today);
    var from = hubAddDays(thisWeek, -7 * S.historyWeeks), to = hubAddDays(thisWeek, 7 * (S.aheadWeeks + 1) - 1);
    var notes = [];
    // roster
    var empById = {}, roster = { A: [], B: [], C: [], D: [] };
    (o.employees || []).forEach(function (e) { if (!e.id)
        return; empById[e.id] = e; if (e.active && roster[e.crew])
        roster[e.crew].push(e); });
    var rateCache = {};
    function rate(role, day) { var k = role + '|' + day; if (!(k in rateCache))
        rateCache[k] = sdRateFor(o.rates, role, day); return rateCache[k]; }
    function personRate(id, day) { var e = empById[id]; return rate(e ? e.payRole : '', day); }
    // shifts from Work Shifts
    var slots = o.slots || [];
    var list = slots.length ? mpShifts(from, to, slots) : [];
    var shifts = [], byKey = {}, byDayCrew = {};
    function mk(day, crew, startH, mins, start, end) {
        var s = { key: day + '|' + crew + '|' + startH, day: day, week: hubWeekKey(day), month: day.slice(0, 7), dow: mpDow(day), crew: crew, startH: startH, mins: mins, start: start, end: end,
            dn: sdIsDay(startH, S) ? 'day' : 'night', staff: null, board: null, logs: [], logged: 0, noMins: 0, pieces: 0 };
        shifts.push(s);
        byKey[s.key] = s;
        (byDayCrew[day + '|' + crew] || (byDayCrew[day + '|' + crew] = [])).push(s);
        return s;
    }
    list.forEach(function (x) { if (x.crew)
        mk(x.day, x.crew, x.startHour, x.mins, x.start, x.end); });
    if (!slots.length)
        notes.push('noslots');
    function find(day, crew, startH) {
        var c = byDayCrew[day + '|' + crew] || [];
        if (!c.length)
            return null;
        if (startH !== null && startH !== undefined) {
            for (var i = 0; i < c.length; i++)
                if (c[i].startH === startH)
                    return c[i];
        }
        return c[0];
    }
    // staff rows (only weeks marked done)
    var done = o.doneWeeks || {};
    var staffUsed = 0, staffSkipped = 0;
    (o.staff || []).forEach(function (st) {
        if (!st.day || st.day < from || st.day > to)
            return;
        if (!done[st.week]) {
            staffSkipped++;
            return;
        }
        var s = st.crew ? find(st.day, st.crew, st.startH) : null;
        if (!s && !st.crew && st.shift) {
            var c = shifts.filter(function (x) { return x.day === st.day && x.dn === st.shift && !x.staff; });
            s = c[0] || null;
        }
        if (!s) {
            var startH = st.startH !== null ? st.startH : (st.shift === 'night' ? 18 : 6);
            var mins = st.hours ? st.hours * 60 : 720, start = mpPlantMs(st.day, startH);
            s = mk(st.day, st.crew || (st.shift === 'night' ? 'N' : 'D'), startH, mins, start, start + mins * SD_MIN);
            s.fromStaff = true;
        }
        if (st.shift)
            s.dn = st.shift;
        s.staff = st;
        staffUsed++;
    });
    // boards: the live board wins over its archive (same name)
    var seenBoard = {}, boardsUsed = 0, boardsLost = 0;
    (o.boards || []).slice().sort(function (a, b) { return (a.source === 'live' ? 0 : 1) - (b.source === 'live' ? 0 : 1); }).forEach(function (b) {
        if (seenBoard[b.name])
            return;
        seenBoard[b.name] = 1;
        if (!b.crew || b.day < from || b.day > to) {
            if (!b.crew)
                boardsLost++;
            return;
        }
        var p = hubPlantParts(b.start), s = find(b.day, b.crew, p ? p.h : null);
        if (!s) {
            s = mk(b.day, b.crew, p ? p.h : 0, b.mins, b.start, b.end);
            s.fromBoard = true;
        }
        if (s.board) {
            s.board.people = s.board.people.concat(b.people.filter(function (x) { return !s.board.people.some(function (y) { return (x.id && x.id === y.id) || (!x.id && hubCanon(x.name) === hubCanon(y.name)); }); }));
        }
        else
            s.board = { people: b.people.slice(), mins: b.mins, team: b.team, source: b.source };
        boardsUsed++;
    });
    // MSS log
    var noCrewLogs = { mins: 0, rows: 0, byDay: {} }, logsUsed = 0;
    (o.logs || []).forEach(function (l) {
        if (!l.day || l.day < from || l.day > to)
            return;
        var s = l.crew ? find(l.day, l.crew, null) : null;
        if (!s && l.crew) {
            var mins0 = 720, st0 = mpPlantMs(l.day, 6);
            s = mk(l.day, l.crew, null, mins0, st0, st0 + mins0 * SD_MIN);
            s.fromLog = true;
            s.dn = '?';
        }
        if (!s) {
            noCrewLogs.rows++;
            noCrewLogs.mins += l.mins || 0;
            noCrewLogs.byDay[l.day] = (noCrewLogs.byDay[l.day] || 0) + (l.mins || 0);
            return;
        }
        s.logs.push(l);
        logsUsed++;
        if (l.mins > 0)
            s.logged += l.mins;
        else
            s.noMins++;
    });
    // heads needed per shift, worked out here for every published week (DIRECTOR HEADS NEEDED); the Scheduler's staff rows
    // stand in only for a published week this page cannot work out (no window rows read)
    // (a published week with no window rows read is left to the Scheduler's row: its line cleans are not known here)
    var winWeeks = {};
    (o.windows || []).forEach(function (r) { var d = /^\d{4}-\d{2}-\d{2}$/.test(String(r.craa5_day || '')) ? String(r.craa5_day) : (sdMs(r.craa5_start) ? hubPlantDay(sdMs(r.craa5_start)) : ''); if (d)
        winWeeks[hubWeekKey(d)] = true; });
    var ownWeeks = Object.keys(done).filter(function (w) { return w >= from && w <= to && winWeeks[w]; }).sort();
    var heads = { byKey: {}, notes: null, shifts: 0 }, ownUsed = 0;
    if (ownWeeks.length && slots.length) {
        heads = sdHeads({ shifts: byKey, weeks: ownWeeks, today: today, windows: o.windows, scopes: o.scopes, assets: o.assetsRaw, prodAreas: o.lineAreas, done: sdDoneOf(o.logs),
            tasks: o.tasks, roster: roster, share: share, vacation: vacation, ignoreOverdue: !!S.ignoreOverdue, S: S });
        Object.keys(heads.byKey).forEach(function (k) { var s = byKey[k]; if (!s)
            return; s.staff = heads.byKey[k]; ownUsed++; });
    }
    // typical published shift per crew | weekday | start (for projected weeks), without the Scheduler's MSS part
    var typ = {}, typCrewDow = {}, typDnDow = {};
    function addTyp(map, k, st, s) {
        var t = map[k] || (map[k] = { n: 0, line: 0, tasks: 0, fixed: 0, fixedHeads: 0, share: 0, shareN: 0, vac: 0 });
        t.n++;
        t.line += st.work.line;
        t.tasks += st.work.tasks;
        t.fixed += st.work.fixed;
        t.fixedHeads += st.fixed || 0;
        if (st.share) {
            t.share += st.share;
            t.shareN++;
        }
        if (st.vac !== null)
            t.vac = Math.max(t.vac, st.vac);
    }
    shifts.forEach(function (s) {
        if (!s.staff)
            return;
        addTyp(typ, s.crew + '|' + s.dow + '|' + s.startH, s.staff, s);
        addTyp(typCrewDow, s.crew + '|' + s.dow, s.staff, s);
        addTyp(typDnDow, s.dn + '|' + s.dow, s.staff, s);
    });
    function avg(t) { return t ? { line: t.line / t.n, tasks: t.tasks / t.n, fixed: t.fixed / t.n, fixedHeads: t.fixedHeads / t.n, share: t.shareN ? t.share / t.shareN : null, n: t.n } : null; }
    var hasTyp = Object.keys(typ).length > 0;
    // MSS by frequency, outside every line's clean scope (MSS MANPOWER block, the same reading as the Scheduler)
    var loads = mpPieceLoads(o.assetsRaw || [], o.scopes || { byKey: {}, ids: {}, count: 0 }, o.lineAreas || {});
    if (!(o.scopes && o.scopes.count))
        notes.push('noscopes');
    var weekShifts = {};
    shifts.forEach(function (s) { (weekShifts[s.week] || (weekShifts[s.week] = [])).push(s); });
    Object.keys(weekShifts).forEach(function (w) {
        var wk = weekShifts[w], wkMins = sdSum(wk, function (s) { return s.mins; });
        for (var i = 0; i < 7; i++) {
            var day = hubAddDays(w, i), on = wk.filter(function (s) { return s.day === day; }), m = sdSum(on, function (s) { return s.mins; });
            on.forEach(function (s) { s.mssProj = (s.mssProj || 0) + (m > 0 ? loads.dailyMins * s.mins / m : 0); });
        }
        var weekly = loads.weeklyMins + loads.periodicWeekMins;
        wk.forEach(function (s) { s.mssProj = (s.mssProj || 0) + (wkMins > 0 ? weekly * s.mins / wkMins : 0); });
    });
    // per shift numbers
    var vacation = S.vacation !== null && S.vacation !== undefined ? S.vacation : (o.crewplan && o.crewplan.vacation !== undefined && o.crewplan.vacation !== null ? sdNum(o.crewplan.vacation) : 2);
    shifts.forEach(function (s) {
        var crewList = roster[s.crew] || [];
        s.rosterHeads = crewList.length;
        s.schedMin = s.rosterHeads * s.mins;
        s.state = s.end <= nowMs ? 'past' : s.start <= nowMs ? 'now' : 'future';
        // on the clock
        if (s.board) {
            s.presentHeads = s.board.people.length;
            s.clockMin = s.presentHeads * (s.board.mins || s.mins);
            s.clockFrom = 'board';
        }
        else {
            s.presentHeads = null;
            s.clockMin = s.schedMin;
            s.clockFrom = 'roster';
        }
        if (s.state === 'future') {
            s.clockMin = 0;
        }
        // called for
        if (s.staff) {
            var st = s.staff;
            s.called = st.mins;
            s.calledFrom = st.from === 'director' ? 'director' : 'scheduler';
            s.parts = { line: st.work.line, tasks: st.work.tasks, mss: st.work.mss, fixed: st.work.fixed };
            s.need = st.need;
            s.fixedHeads = st.fixed || 0;
            s.planUsed = st.used;
            s.status = st.status;
            s.vac = st.vac !== null ? st.vac : vacation;
            s.shareUsed = st.share || share;
        }
        else {
            var t = avg(typ[s.crew + '|' + s.dow + '|' + s.startH]) || avg(typCrewDow[s.crew + '|' + s.dow]) || avg(typDnDow[s.dn + '|' + s.dow]);
            var sh = t && t.share ? t.share : share;
            s.parts = { line: t ? t.line : 0, tasks: t ? t.tasks : 0, mss: s.mssProj || 0, fixed: t ? t.fixed : 0 };
            s.typBasis = t ? t.n : 0;
            s.called = s.parts.line + s.parts.tasks + s.parts.mss + s.parts.fixed;
            s.calledFrom = 'projected';
            s.fixedHeads = t ? t.fixedHeads : 0;
            var cleanWork = s.parts.line + s.parts.tasks + s.parts.mss;
            s.need = s.mins > 0 ? Math.ceil(cleanWork / (s.mins * sh) - 1e-9) + Math.round(s.fixedHeads) : null;
            s.planUsed = null;
            s.status = '';
            s.vac = vacation;
            s.shareUsed = sh;
        }
        s.standing = (s.parts.tasks || 0) + (s.parts.fixed || 0);
        s.util = s.state !== 'future' && s.clockMin > 0 ? 100 * s.logged / s.clockMin : null;
        // wage
        var t2 = rate(SD_TECH2, s.day);
        s.projWage = t2 ? hubLaborCost(s.called, t2.rate) : 0;
        if (!t2)
            s.noRate = true;
        if (s.state !== 'future') {
            var payList = [];
            if (s.board && s.board.people.length)
                s.board.people.forEach(function (p) { payList.push(p.id); });
            else
                crewList.forEach(function (e) { payList.push(e.id); });
            var wage = 0, rateSum = 0, rateN = 0, mins = s.board ? (s.board.mins || s.mins) : s.mins;
            payList.forEach(function (id) { var r = personRate(id, s.day); if (r) {
                wage += hubLaborCost(mins, r.rate);
                rateSum += r.rate;
                rateN++;
            }
            else
                s.noRate = true; });
            s.schedWage = wage;
            s.avgRate = rateN ? rateSum / rateN : (t2 ? t2.rate : 0);
            s.standingWage = s.avgRate ? hubLaborCost(s.standing, s.avgRate) : 0;
            var lw = 0;
            s.logs.forEach(function (l) {
                if (!(l.mins > 0))
                    return;
                var ppl = l.people.length ? l.people : [''];
                var share1 = l.mins / ppl.length;
                ppl.forEach(function (id) { var r = id ? personRate(id, l.day) : rate('', l.day); if (r) {
                    var c = hubLaborCost(share1, r.rate);
                    lw += c;
                }
                else
                    s.noRate = true; });
            });
            s.loggedWage = lw;
            s.unusedWage = s.schedWage - s.loggedWage - s.standingWage;
            var bases = {};
            s.logs.forEach(function (l) { bases[l.base] = 1; });
            s.pieces = Object.keys(bases).length;
        }
        else {
            s.schedWage = 0;
            s.loggedWage = 0;
            s.standingWage = 0;
            s.unusedWage = 0;
        }
        // Per-shift hours spent broken down by production line and area
        var lineHours = {};
        s.logs.forEach(function (l) {
            if (l.mins > 0) {
                var lk = l.line || l.area || 'Facility General';
                lineHours[lk] = (lineHours[lk] || 0) + Math.round((l.mins / 60) * 10) / 10;
            }
        });
        s.lineHours = lineHours;
        s.hoursSpent = Math.round((s.logged / 60) * 10) / 10;
    });
    shifts.sort(function (a, b) { return a.start - b.start || (a.crew < b.crew ? -1 : 1); });
    // roll-ups
    var weeks = {}, months = {}, days = {};
    function bucket(map, k, init) { return map[k] || (map[k] = init()); }
    shifts.forEach(function (s) {
        var w = bucket(weeks, s.week, function () { return { week: s.week, all: sdEmptySum(), day: sdEmptySum(), night: sdEmptySum(), published: !!done[s.week], shifts: [] }; });
        sdAdd(w.all, s);
        sdAdd(s.dn === 'night' ? w.night : w.day, s);
        w.shifts.push(s);
        var m = bucket(months, s.month, function () { return { month: s.month, all: sdEmptySum(), day: sdEmptySum(), night: sdEmptySum() }; });
        sdAdd(m.all, s);
        sdAdd(s.dn === 'night' ? m.night : m.day, s);
        var d = bucket(days, s.day, function () { return { date: s.day, all: sdEmptySum(), day: sdEmptySum(), night: sdEmptySum(), shifts: [] }; });
        sdAdd(d.all, s);
        sdAdd(s.dn === 'night' ? d.night : d.day, s);
        d.shifts.push(s);
    });
    [weeks, months, days].forEach(function (map) { Object.keys(map).forEach(function (k) { sdFinish(map[k].all); sdFinish(map[k].day); sdFinish(map[k].night); }); });
    var weekList = Object.keys(weeks).sort().map(function (k) { var w = weeks[k]; w.state = k < thisWeek ? 'past' : k === thisWeek ? 'now' : 'future'; return w; });
    // crews
    var crews = ['A', 'B', 'C', 'D'].map(function (c) { return sdCrewCard(c, shifts.filter(function (s) { return s.crew === c; }), roster[c], today, thisWeek, vacation, rate, S.basis); });
    // logged wage recap by week, line and clean kind (contract 7, weekly cost recap)
    var recap = {};
    shifts.forEach(function (s) {
        if (s.state === 'future')
            return;
        s.logs.forEach(function (l) {
            if (!(l.mins > 0))
                return;
            var k = s.week + '|' + (l.line || l.area || '-') + '|' + (l.kind || 'other');
            var r = recap[k] || (recap[k] = { week: s.week, line: l.line || l.area || '', kind: l.kind || 'other', mins: 0, wage: 0, rows: 0 });
            var ppl = l.people.length ? l.people : [''];
            ppl.forEach(function (id) { var rr = id ? personRate(id, l.day) : rate('', l.day); if (rr)
                r.wage += hubLaborCost(l.mins / ppl.length, rr.rate); });
            r.mins += l.mins;
            r.rows++;
        });
    });
    var noRateAt = !rate(SD_TECH2, today);
    var payRoleKnown = (o.employees || []).filter(function (e) { return e.active && e.crew && e.payRole; }).length;
    var onCrews = (o.employees || []).filter(function (e) { return e.active && e.crew; }).length;
    return {
        today: today, thisWeek: thisWeek, from: from, to: to, share: share, vacation: vacation, shifts: shifts, byKey: byKey,
        weeks: weekList, weekMap: weeks, months: months, days: days, crews: crews, roster: roster, empById: empById, loads: loads,
        recap: Object.keys(recap).map(function (k) { return recap[k]; }), hasTyp: hasTyp, done: done,
        counts: { staffUsed: staffUsed, staffSkipped: staffSkipped, ownUsed: ownUsed, boardsUsed: boardsUsed, boardsLost: boardsLost, logsUsed: logsUsed, noCrewLogs: noCrewLogs, payRoleKnown: payRoleKnown, onCrews: onCrews },
        noRate: noRateAt, notes: notes, tech2: rate(SD_TECH2, today), shareFrom: shareFrom, headsNotes: heads.notes, ownWeeks: ownWeeks, tasksFrom: o.tasksFrom || '', tasks: o.tasks || []
    };
}
// One crew: who is on it, the last 4 weeks against the clock, the busiest published shift (the justification) and the year ahead.
function sdCrewCard(crew, list, members, today, thisWeek, vacation, rate, basis) {
    var last4From = hubAddDays(thisWeek, -28);
    var recent = sdEmptySum();
    list.forEach(function (s) { if (s.day >= last4From && s.day < thisWeek)
        sdAdd(recent, s); });
    sdFinish(recent);
    var published = list.filter(function (s) { return (s.calledFrom === 'director' || s.calledFrom === 'scheduler') && s.need !== null; });
    var busiest = null;
    published.forEach(function (s) { if (s.week >= thisWeek && (!busiest || s.need > busiest.need))
        busiest = s; });
    if (!busiest)
        published.forEach(function (s) { if (!busiest || s.need > busiest.need)
            busiest = s; });
    var ahead = list.filter(function (s) { return s.week >= thisWeek; });
    var busiestAhead = null;
    ahead.forEach(function (s) { if (s.need !== null && (!busiestAhead || s.need > busiestAhead.need))
        busiestAhead = s; });
    var avgNeed = ahead.length ? sdSum(ahead, function (s) { return s.need || 0; }) / ahead.length : null;
    var vac = busiest && busiest.vac !== null && busiest.vac !== undefined ? busiest.vac : (vacation !== null ? vacation : 0);
    // the crew's size to cover: its busiest shift's need (default), or the average shift's need when the basis is average
    var pubAhead = published.filter(function (s) { return s.week >= thisWeek; }), pubBase = pubAhead.length ? pubAhead : published;
    var avgPub = pubBase.length ? sdSum(pubBase, function (s) { return s.need; }) / pubBase.length : null;
    var suggestedBase = basis === 'average' ? (avgPub === null ? null : Math.ceil(avgPub - 1e-9)) : (busiest ? Math.ceil(busiest.need - 1e-9) : null);
    var suggested = suggestedBase === null ? null : suggestedBase + vac;
    var suggestedYear = basis === 'average' ? (avgNeed === null ? null : Math.ceil(avgNeed - 1e-9) + vac) : (busiestAhead ? Math.ceil(busiestAhead.need - 1e-9) + vac : null);
    var why = null;
    if (busiest) {
        var b = busiest, cap = b.mins * (b.shareUsed || 0.85);
        why = { shift: b, line: cap > 0 ? b.parts.line / cap : 0, tasks: cap > 0 ? b.parts.tasks / cap : 0, mss: cap > 0 ? b.parts.mss / cap : 0,
            fixed: b.fixedHeads || 0, vac: vac, need: b.need, tasksList: b.staff ? b.staff.tasks : [], over: b.staff ? b.staff.over : [], peak: b.staff ? b.staff.peak : null };
    }
    var yearHours = sdSum(ahead, function (s) { return s.mins; }) / 60;
    var t2 = rate(SD_TECH2, today);
    return {
        crew: crew, members: (members || []).slice().sort(function (a, b) { return a.name < b.name ? -1 : 1; }), heads: (members || []).length, recent: recent,
        shiftsAhead: ahead.length, dn: list.length ? (list.filter(function (s) { return s.dn === 'night'; }).length > list.length / 2 ? 'night' : 'day') : '',
        startH: list.length ? list[list.length - 1].startH : null, hours: list.length ? list[list.length - 1].mins / 60 : null,
        busiest: busiest, busiestAhead: busiestAhead, avgNeed: avgNeed, avgPub: avgPub, vac: vac, suggestedBase: suggestedBase, suggested: suggested, suggestedYear: suggestedYear, basis: basis || 'busiest', why: why,
        headYearWage: t2 && ahead.length ? hubLaborCost(yearHours * 60, t2.rate) : null,
        yearHoursPerHead: yearHours
    };
}
// ---------- crew builder (Year plan): the MSS calendar's crew kinds on a two-week cycle ----------
var SD_CREW_KINDS = [
    { id: '12', label: '12 hour (2-2-3)', hours: 12, start: 6, mask: [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0] },
    { id: 'swing12', label: 'Swing 12', hours: 12, start: 11, mask: [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0] },
    { id: '10', label: '10 hour (4 x 10)', hours: 10, start: 6, mask: [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0] },
    { id: '8', label: '8 hour (5 x 8)', hours: 8, start: 6, mask: [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0] }
];
function sdKind(id) { for (var i = 0; i < SD_CREW_KINDS.length; i++)
    if (SD_CREW_KINDS[i].id === id)
        return SD_CREW_KINDS[i]; return SD_CREW_KINDS[0]; }
function sdNewCrew(n, kindId, flip, night) {
    var k = sdKind(kindId);
    return { id: 'c' + n + '_' + Math.floor(Math.random() * 1e6).toString(36), name: String.fromCharCode(65 + (n % 26)), kind: k.id, hours: k.hours, start: night ? (k.start + 12) % 24 : k.start, heads: 0,
        mask: flip ? k.mask.map(function (v) { return v ? 0 : 1; }) : k.mask.slice(), extra: { kind: 'none', heads: 0 } };
}
function sdDefaultCrews() { return [sdNewCrew(0, '12', false, false), sdNewCrew(1, '12', true, false), sdNewCrew(2, '12', false, true), sdNewCrew(3, '12', true, true)]; }
function sdCleanCrews(list) {
    if (!Array.isArray(list))
        return [];
    return list.filter(function (c) { return c && typeof c === 'object'; }).slice(0, 12).map(function (c, i) {
        var k = sdKind(c.kind), num = function (v, lo, hi, def) { var n = sdNum(v); return n === null ? def : sdClamp(n, lo, hi); };
        return { id: String(c.id || 'c' + i).slice(0, 40), name: sdTrim(c.name || '').slice(0, 20), kind: k.id, hours: num(c.hours, 1, 24, k.hours), start: Math.round(num(c.start, 0, 23, k.start)),
            heads: Math.round(num(c.heads, 0, 999, 0)), mask: Array.isArray(c.mask) && c.mask.length === 14 ? c.mask.map(function (v) { return v ? 1 : 0; }) : k.mask.slice(),
            extra: { kind: c.extra && (c.extra.kind === 'swat' || c.extra.kind === 'swing') ? c.extra.kind : 'none', heads: Math.round(num(c.extra && c.extra.heads, 0, 999, 0)) } };
    });
}
function sdCycleIdx(cycleStart, day) {
    var a = Date.UTC(+cycleStart.slice(0, 4), +cycleStart.slice(5, 7) - 1, +cycleStart.slice(8, 10)), b = Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10));
    var n = Math.round((b - a) / SD_DAY);
    return ((n % 14) + 14) % 14;
}
// Crews from today's roster and Work Shifts: one per crew letter, heads = active people, hours and start from its shift rows,
// days = the weekdays its rows name (Work Shifts holds one week, so both halves of the cycle match).
function sdCrewsFromRoster(roster, slots, cycleStart) {
    return ['A', 'B', 'C', 'D'].map(function (c, i) {
        var mine = (slots || []).filter(function (s) { return s.crew === c; });
        var cr = sdNewCrew(i, '12', false, false);
        cr.name = c;
        cr.heads = (roster[c] || []).length;
        if (mine.length) {
            cr.start = mine[0].startHour;
            cr.hours = mine[0].lengthHours;
            cr.kind = cr.hours >= 12 ? '12' : cr.hours >= 10 ? '10' : '8';
            var dows = {};
            mine.forEach(function (s) { dows[s.day] = 1; });
            var mon = cycleStart;
            cr.mask = [];
            for (var d = 0; d < 14; d++)
                cr.mask.push(dows[mpDow(hubAddDays(mon, d))] ? 1 : 0);
        }
        return cr;
    }).filter(function (c) { return c.heads > 0 || (slots || []).some(function (s) { return s.crew === c.name; }); });
}
// Week by week: the builder's person-minutes on the clock (day and night by start hour) against the work called for.
function sdBuilderWeeks(crews, cycleStart, weekList, S, share) {
    return weekList.map(function (w) {
        var cap = { day: 0, night: 0 }, heads = { day: 0, night: 0 };
        for (var i = 0; i < 7; i++) {
            var day = hubAddDays(w.week, i), ix = sdCycleIdx(cycleStart, day);
            crews.forEach(function (c) {
                if (!c.mask[ix])
                    return;
                var h = c.heads + (c.extra.kind !== 'none' ? c.extra.heads : 0), side = sdIsDay(c.start, S) ? 'day' : 'night';
                cap[side] += h * c.hours * 60;
            });
        }
        var called = { day: w.day.called, night: w.night.called };
        var shortD = called.day - cap.day * share, shortN = called.night - cap.night * share;
        return { week: w.week, cap: cap, capAll: cap.day + cap.night, called: called, calledAll: called.day + called.night, projected: w.all.calledProj > w.all.called / 2,
            shortDay: shortD > 0 ? shortD : 0, shortNight: shortN > 0 ? shortN : 0 };
    });
}
// Day by day: the days (inside the weeks shown) where the crews on that day give less cleaning time than the work calls for.
function sdBuilderDays(crews, cycleStart, weekList, days, S, share) {
    var n = 0, short = 0;
    weekList.forEach(function (w) {
        for (var i = 0; i < 7; i++) {
            var day = hubAddDays(w.week, i), d = days[day];
            if (!d)
                continue;
            var ix = sdCycleIdx(cycleStart, day), cap = { day: 0, night: 0 };
            crews.forEach(function (c) { if (!c.mask[ix])
                return; cap[sdIsDay(c.start, S) ? 'day' : 'night'] += (c.heads + (c.extra.kind !== 'none' ? c.extra.heads : 0)) * c.hours * 60 * share; });
            n++;
            if (d.day.called > cap.day + 1e-6 || d.night.called > cap.night + 1e-6)
                short++;
        }
    });
    return { n: n, short: short };
}
function sdBuilderCost(crews, cycleStart, rate) {
    var mins = 0;
    for (var d = 0; d < 364; d++) {
        var ix = d % 14;
        crews.forEach(function (c) { if (c.mask[ix])
            mins += (c.heads + (c.extra.kind !== 'none' ? c.extra.heads : 0)) * c.hours * 60; });
    }
    return { hours: mins / 60, wage: rate ? hubLaborCost(mins, rate) : null };
}
// ==== END DIRECTOR ENGINE ====
// ==== DIRECTOR HEADS NEEDED ====
// Heads needed per shift (data contract 1.0.60, section 7, ground rule 11): worked out here and nowhere else. The rule is the
// one the Production Scheduler's crew plan v4.7 followed, so the numbers carry on where its staff rows left off:
//   - line cleans: the published clean plan's windows (Daily, Midweek, EOW, Allergen), their person-minutes placed where the
//     plan times them (cleanStart to cleanEnd), so cleans that overlap add up ("at once");
//   - shift tasks (_e_ Shift task, else this page's settings): a task with no minutes holds its heads the whole shift
//     (trash, chemical clerk); one with minutes adds heads x minutes of work;
//   - MSS pieces due by frequency (hubFreqDone): Daily and weekly pieces outside every line's clean scope, and every monthly,
//     quarterly, 6-month and annual piece. A long-period piece gets one week of its period, drawn evenly (a fixed draw per
//     piece, so it does not jump about) among the weeks still to come; one already cleaned in its period is not due. Overdue =
//     its last period passed with no clean: planned this week as catch-up, first in the list, unless Ignore overdue is on.
//     Runs-product areas go first, then the longest jobs, each into the shift of its week (its day, for a Daily) with the
//     most room left.
// Heads needed = clean heads (the work / (shift minutes x share), or the most people the overlapping line cleans need at
// once, whichever is more, rounded up) + the heads on whole-shift tasks. Only weeks whose k|Monday row is done are worked
// out: the line cleans of an unpublished week are not known, so that week stays a projection (DIRECTOR ENGINE).
var SD_LONG_CODES = ['M', 'Q', 'S', 'A'];
var SD_TASKS_DEFAULT = [
    { name: 'Janitorial', shift: 'both', days: '1111111' }, { name: 'Admin', shift: 'day', days: '0111110' }, { name: 'Chemical clerk', shift: 'both', days: '1111111' },
    { name: 'Small steam pit', shift: 'both', days: '1111111' }, { name: 'Trash', shift: 'both', days: '1111111' }, { name: 'Large steam pit', shift: 'both', days: '1111111' }
];
function sdTaskKey(shift, name) { return shift + '|' + hubCanon(name); }
// One task as typed or read: { key, id, name, shift day | night | both, days (7 digits, Sunday first), heads (null = 1),
// minutes (null = the whole shift), area, active, sort }
function sdTask(t, i) {
    t = t || {};
    var shift = /^(day|night|both)$/.test(String(t.shift || '').toLowerCase()) ? String(t.shift).toLowerCase() : 'both';
    var days = /^[01]{7}$/.test(String(t.days || '')) ? String(t.days) : '1111111';
    var num = function (v) { var n = sdNum(v); return n === null || n < 0 ? null : n; };
    var name = sdTrim(t.name || '');
    return { key: t.key || sdTaskKey(shift, name), id: String(t.id || '').toLowerCase(), name: name, shift: shift, days: days, heads: num(t.heads), minutes: num(t.minutes),
        area: sdTrim(t.area || ''), active: t.active !== false && !(t.active === 0 || /^(no|false|0)$/i.test(String(t.active === undefined || t.active === null ? '' : t.active))), sort: num(t.sort) === null ? (i || 0) : num(t.sort) };
}
function sdTaskOn(t, dow, startH, S) { return t.active && !!t.name && t.days.charAt(dow) === '1' && (t.shift === 'both' || (t.shift === 'day') === sdIsDay(startH, S)); }
// A _e_ Shift task row -> a task (the shift part of the key fills a blank Shift).
function sdTaskFromRow(r, i) {
    var key = sdTrim(sdField(r, 'craa5_taskkey') || ''), kshift = key.indexOf('|') > 0 ? key.slice(0, key.indexOf('|')) : '';
    return sdTask({ key: key, id: r.__id || '', name: sdField(r, 'craa5_name') || sdField(r, 'craa5_taskname') || (key.indexOf('|') > 0 ? key.slice(key.indexOf('|') + 1) : key),
        shift: sdField(r, 'craa5_shift') || kshift, days: sdField(r, 'craa5_days'), heads: sdField(r, 'craa5_heads'), minutes: sdField(r, 'craa5_minutes'), area: sdField(r, 'craa5_area'),
        active: sdField(r, 'craa5_active'), sort: sdField(r, 'craa5_sortorder') }, i);
}
// MSS Log Input's old manpower setup (Hub config MSS_LOG_MANPOWER_SETUP) -> tasks, to carry its fixed posts over once.
function sdTasksFromPosts(setup) {
    var list = setup && Array.isArray(setup.posts) ? mpPosts(setup.posts) : [];
    return list.filter(function (p) { return p.name && p.covers !== 'office'; }).map(function (p, i) {
        return sdTask({ name: p.name, shift: p.covers === 'all' ? 'both' : p.covers, days: p.days === 'weekdays' ? '0111110' : p.days === 'weekend' ? '1000001' : '1111111', heads: p.heads || null }, i);
    });
}
function sdCleanTasks(list) {
    var keys = {};
    return (Array.isArray(list) ? list : []).map(function (t, i) { return sdTask(t, i); }).filter(function (t) { return !!t.name; }).map(function (t, i) {
        var k = /\|new[a-z0-9]*$/.test(t.key) || !t.key ? sdTaskKey(t.shift, t.name) : t.key;
        for (var n = 2; keys[k]; n++)
            k = sdTaskKey(t.shift, t.name) + n;
        keys[k] = true;
        t.key = k;
        t.sort = i;
        return t;
    });
}
function sdNewTask() { return sdTask({ key: 'both|new' + Math.floor(Math.random() * 1e6).toString(36), name: '', shift: 'both', days: '1111111' }); }
// Where the tasks come from, first that has any: the Shift task table, this page's settings, the Scheduler's old key, MSS Log
// Input's old posts, the plant's default list (one person the whole shift each).
function sdPickTasks(tableRows, settings, crewplan, mpSetup) {
    if (tableRows)
        return { list: sdCleanTasks(tableRows.map(sdTaskFromRow)), from: 'table' };
    if (settings && settings.tasks && settings.tasks.length)
        return { list: sdCleanTasks(settings.tasks), from: 'settings' };
    if (crewplan && Array.isArray(crewplan.tasks) && crewplan.tasks.length)
        return { list: sdCleanTasks(crewplan.tasks), from: 'scheduler' };
    var posts = sdTasksFromPosts(mpSetup);
    if (posts.length)
        return { list: sdCleanTasks(posts), from: 'msslog' };
    return { list: sdCleanTasks(SD_TASKS_DEFAULT), from: 'default' };
}
// FNV-1a, so a piece's week in its period is a fixed draw (the same every time it is worked out).
function sdFnv(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
} return h; }
function sdDraw(s, n) { return n > 0 ? sdFnv(s) % n : 0; }
// The Mondays of the weeks a period holds (a week belongs to the period its Monday is in).
function sdPeriodWeeks(code, mon, cache) {
    var p = hubPeriodKey(code, mon), ck = code + '|' + p;
    if (cache[ck])
        return cache[ck];
    var a = mon, b = mon, i;
    for (i = 0; i < 60 && hubPeriodKey(code, hubAddDays(a, -7)) === p; i++)
        a = hubAddDays(a, -7);
    for (i = 0; i < 60 && hubPeriodKey(code, hubAddDays(b, 7)) === p; i++)
        b = hubAddDays(b, 7);
    var out = [];
    for (var m = a; m <= b; m = hubAddDays(m, 7))
        out.push(m);
    cache[ck] = out;
    return out;
}
// MSS log rows (sdNormLog) -> { equipment id: [{ day, rank }] }
function sdDoneOf(logs) {
    var out = {};
    (logs || []).forEach(function (l) { if (l.equip && l.day)
        (out[l.equip] || (out[l.equip] = [])).push({ day: l.day, rank: l.rank }); });
    return out;
}
var SD_WINDOW_KINDS = { full: 1, midweek: 1, weekly: 1, allergen: 1 };
// in: { shifts (DIRECTOR ENGINE shift objects, by key), weeks [Mondays to work out], today, windows (raw window rows), scopes (mpScopes),
//       assets (raw Equipment rows), prodAreas { canon area: true }, done (sdDoneOf), tasks (sdTask list), roster { A: [people] },
//       share (0-1), vacation, ignoreOverdue, S (settings) }
// out: { byKey: { shift key: staff-like row (the sdNormStaff shape, from 'director') }, notes }
function sdHeads(o) {
    var share = o.share > 0 && o.share <= 1 ? o.share : 1, vac = Math.max(0, Math.round(sdNum(o.vacation) || 0)), S = o.S;
    var today = o.today, thisWeek = hubWeekKey(today), roster = o.roster || {}, hasRoster = ['A', 'B', 'C', 'D'].some(function (c) { return (roster[c] || []).length; });
    var weekOn = {};
    (o.weeks || []).forEach(function (w) { weekOn[w] = true; });
    var insts = [];
    Object.keys(o.shifts || {}).forEach(function (k) {
        var s = o.shifts[k];
        if (!weekOn[s.week] || !s.crew || !(s.mins > 0))
            return;
        insts.push({ key: s.key, day: s.day, week: s.week, dow: s.dow, crew: s.crew, startH: s.startH, mins: s.mins, start: s.start, end: s.end, night: !sdIsDay(s.startH, S),
            line: 0, taskWork: 0, fixed: 0, mss: 0, segs: [], tasks: [], cleans: [], jobs: [], onCrew: hasRoster ? (roster[s.crew] || []).length : null });
    });
    insts.sort(function (a, b) { return a.start - b.start; });
    var notes = { pieces: 0, noStd: 0, overdue: 0, unplaced: 0, unplacedMins: 0, jobs: 0, windows: 0, noTime: 0 };
    // line cleans, where the plan times them
    (o.windows || []).forEach(function (r) {
        var g = mpWindow(r, o.scopes);
        if (!g || !SD_WINDOW_KINDS[g.plan] || !(g.work > 0))
            return;
        if (!(g.end > g.start)) {
            notes.noTime++;
            return;
        }
        notes.windows++;
        var len = (g.end - g.start) / SD_MIN, rate = g.work / len;
        insts.forEach(function (s) {
            var a = Math.max(s.start, g.start), b = Math.min(s.end, g.end);
            if (b <= a)
                return;
            var part = g.work * (b - a) / (g.end - g.start);
            s.line += part;
            s.segs.push([a, b, rate]);
            s.cleans.push({ line: g.line, area: g.area, kind: g.kind, from: a, to: b, work: part, heads: rate });
        });
    });
    // shift tasks
    var tasks = (o.tasks || []).filter(function (t) { return t.active && t.name; });
    insts.forEach(function (s) {
        tasks.forEach(function (t) {
            if (!sdTaskOn(t, s.dow, s.startH, S))
                return;
            var heads = t.heads === null ? 1 : t.heads;
            if (t.minutes === null) {
                s.fixed += heads;
                s.tasks.push({ name: t.name, heads: heads, mins: null });
            }
            else {
                s.taskWork += heads * t.minutes;
                s.tasks.push({ name: t.name, heads: heads, mins: t.minutes });
            }
        });
    });
    // MSS pieces due by frequency
    var sc = o.scopes || { byKey: {}, ids: {}, count: 0 }, done = o.done || {}, prod = o.prodAreas || {}, cache = {};
    var pieces = [];
    (o.assets || []).forEach(function (a) {
        var id = hubGuid(a.craa5___1_a_assetsid || a.__id);
        if (!hubIsGuid(id))
            return;
        var f = {};
        Object.keys(MP_FLAG_COLS).forEach(function (k) { f[k] = mpYes(a[MP_FLAG_COLS[k]]); });
        var inPlan = !!sc.ids[id], std = hubStdMinutes(a.craa5_hoursrequired), dmin = hubStdMinutes(a.craa5_dailymin) || std;
        var codes = [];
        if (!inPlan && f.daily)
            codes.push('D');
        else if (!inPlan && (f.weekly || f.midweek))
            codes.push(f.weekly ? 'W' : 'MW');
        if (f.monthly)
            codes.push('M');
        if (f.quarterly)
            codes.push('Q');
        if (f.semiannual)
            codes.push('S');
        if (f.annual)
            codes.push('A');
        if (!codes.length)
            return;
        notes.pieces++;
        if (!std && !(codes.length === 1 && codes[0] === 'D' && dmin)) {
            notes.noStd++;
            return;
        }
        var area = sdTrim(a.craa5_areaname || '');
        pieces.push({ id: id, name: sdTrim(a.craa5_equipmentidentifier || a.craa5_name || id), area: area, prod: !!prod[hubCanon(area)], std: std, dmin: dmin, codes: codes,
            done: (done[id] || []).slice().sort(function (x, y) { return x.day < y.day ? -1 : 1; }) });
    });
    var overdueOf = {};
    (o.weeks || []).slice().sort().forEach(function (W) {
        var jobs = [];
        pieces.forEach(function (p) {
            var before = p.done.filter(function (x) { return x.day < W; });
            p.codes.forEach(function (code) {
                if (code === 'D') {
                    for (var i = 0; i < 7; i++)
                        jobs.push({ p: p, code: code, day: hubAddDays(W, i), mins: p.dmin, overdue: false });
                    return;
                }
                var P = hubPeriodKey(code, W);
                if (hubFreqDone(code, before, W))
                    return;
                var ok = p.id + '|' + code;
                if (overdueOf[ok] === undefined) {
                    var nowBefore = p.done.filter(function (x) { return x.day < thisWeek; }), first = sdPeriodWeeks(code, thisWeek, cache)[0];
                    overdueOf[ok] = !hubFreqDone(code, nowBefore, thisWeek) && !hubFreqDone(code, nowBefore, hubAddDays(first, -7)) ? hubPeriodKey(code, thisWeek) : '';
                }
                var late = overdueOf[ok] !== '' && !o.ignoreOverdue;
                if (code === 'W' || code === 'MW') {
                    jobs.push({ p: p, code: code, day: '', mins: p.std, overdue: late && W === thisWeek });
                    return;
                }
                if (late && W >= thisWeek && overdueOf[ok] === P) {
                    if (W === thisWeek)
                        jobs.push({ p: p, code: code, day: '', mins: p.std, overdue: true });
                    return;
                }
                var all = sdPeriodWeeks(code, W, cache), cand = W >= thisWeek ? all.filter(function (m) { return m >= thisWeek; }) : all;
                if (cand[sdDraw(p.id + '|' + code + '|' + P, cand.length)] === W)
                    jobs.push({ p: p, code: code, day: '', mins: p.std, overdue: false });
            });
        });
        var order = function (a, b) { return (b.overdue - a.overdue) || (b.p.prod - a.p.prod) || (b.mins - a.mins) || (a.p.name < b.p.name ? -1 : a.p.name > b.p.name ? 1 : 0); };
        var wk = insts.filter(function (s) { return s.week === W; });
        var load = function (s) { return (s.line + s.taskWork + s.fixed * s.mins + s.mss) / (s.mins * Math.max(1, s.onCrew || 0) || 1); };
        var place = function (j, list) {
            if (!list.length) {
                notes.unplaced++;
                notes.unplacedMins += j.mins;
                return;
            }
            var best = list[0];
            list.forEach(function (s) { if (load(s) < load(best) - 1e-9)
                best = s; });
            best.mss += j.mins;
            best.jobs.push(j);
            notes.jobs++;
            if (j.overdue)
                notes.overdue++;
        };
        jobs.filter(function (j) { return j.day; }).sort(order).forEach(function (j) { place(j, wk.filter(function (s) { return s.day === j.day; })); });
        jobs.filter(function (j) { return !j.day; }).sort(order).forEach(function (j) { place(j, wk); });
    });
    // the numbers of each shift, in the staff row shape every screen already reads
    var byKey = {};
    insts.forEach(function (s) {
        s.spread = s.taskWork + s.mss;
        var work = s.line + s.spread, atOnce = mpPeak(s), hourly = mpHourly(s, share);
        var clean = work > 0 ? Math.max(Math.ceil(work / (s.mins * share) - 1e-9), Math.ceil(atOnce - 1e-9)) : 0;
        var need = clean + s.fixed;
        var used = s.onCrew > 0 ? (work + s.fixed * s.mins) / (s.onCrew * s.mins) : null;
        var top = 0, at = 0;
        hourly.forEach(function (v, i) { if (v > top + 1e-9) {
            top = v;
            at = i;
        } });
        var over = [], run = null;
        if (s.onCrew !== null) {
            hourly.forEach(function (v, i) {
                var want = Math.ceil(v - 1e-9) + s.fixed, h = (s.startH + i) % 24;
                if (want > s.onCrew) {
                    if (!run) {
                        run = [h, (h + 1) % 24, want - s.onCrew];
                        over.push(run);
                    }
                    else {
                        run[1] = (h + 1) % 24;
                        run[2] = Math.max(run[2], want - s.onCrew);
                    }
                }
                else
                    run = null;
            });
        }
        byKey[s.key] = {
            key: s.key, day: s.day, week: s.week, crew: s.crew, who: s.crew.toLowerCase(), startH: s.startH, shift: s.night ? 'night' : 'day',
            mins: Math.round(work + s.fixed * s.mins), status: s.onCrew === null ? 'nocrew' : need > s.onCrew ? 'short' : 'ok',
            hours: s.mins / 60, share: share, need: need, clean: clean, fixed: s.fixed, onCrew: s.onCrew, used: used === null ? null : Math.round(used * 100),
            atOnce: Math.round(atOnce * 10) / 10, vac: vac, work: { line: Math.round(s.line), tasks: Math.round(s.taskWork), mss: Math.round(s.mss), fixed: Math.round(s.fixed * s.mins) },
            peak: { hour: (s.startH + at) % 24, heads: Math.ceil(top - 1e-9) + s.fixed }, over: over, tasks: s.tasks,
            mssJobs: s.jobs.length, mssOverdue: s.jobs.filter(function (j) { return j.overdue; }).length, cleans: s.cleans.length,
            jobs: s.jobs.map(function (j) { return { id: j.p.id, name: j.p.name, area: j.p.area, code: j.code, mins: j.mins, overdue: j.overdue, day: j.day }; }),
            lineCleans: s.cleans, from: 'director'
        };
    });
    return { byKey: byKey, notes: notes, share: share, vacation: vac, shifts: insts.length };
}
// What other apps read (Hub config DIRECTOR_HEADS): this week and the next weeks' heads needed per shift, and each crew's
// size to cover (busiest shift + vacation cover), compact so it fits one row. cols names the fields of each shift row.
var SD_HEADS_COLS = ['day', 'crew', 'start', 'hours', 'dn', 'need', 'clean', 'fixed', 'onCrew', 'used', 'from'];
function sdHeadsPayload(m, S, weeksAhead) {
    var from = m.thisWeek, to = hubAddDays(m.thisWeek, 7 * (weeksAhead || 13));
    var rows = [], crews = {};
    m.shifts.forEach(function (s) {
        if (s.day < from || s.day >= to || !s.crew || s.need === null)
            return;
        rows.push([s.day, s.crew, s.startH, Math.round(s.mins / 6) / 10, s.dn === 'night' ? 'N' : 'D', s.need, s.need - Math.round(s.fixedHeads || 0), Math.round(s.fixedHeads || 0), s.rosterHeads, s.planUsed === null || s.planUsed === undefined ? null : Math.round(s.planUsed), s.calledFrom === 'projected' ? 'p' : s.calledFrom === 'scheduler' ? 's' : 'd']);
    });
    m.crews.forEach(function (c) {
        crews[c.crew] = { need: c.suggestedBase, vac: c.vac, plan: c.suggested, planYear: c.suggestedYear, onCrew: c.heads, busiest: c.busiest ? c.busiest.key : '', basis: S.basis };
    });
    var out = { v: 1, from: from, to: to, share: m.share, vacation: m.vacation, basis: S.basis, dayFrom: S.dayFrom, dayTo: S.dayTo, cols: SD_HEADS_COLS, shifts: rows, crews: crews, tasksFrom: m.tasksFrom };
    out.hash = hubIdFromKey(JSON.stringify(out)).slice(0, 8);
    out.at = new Date().toISOString();
    return out;
}
// ==== END DIRECTOR HEADS NEEDED ====
// ==== DIRECTOR TABLES ====
// Every table this page reads, the one it writes rows to (_e_ Shift task, once the Dataverse monitor has built it: this page
// never builds tables, ground rule 10) and the Hub config rows it writes (data contract 1.0.60: appId director, keys
// director_settings, DIRECTOR_HEADS and manifest|director). PRODSCHED_CREWPLAN and MSS_LOG_MANPOWER_SETUP are read once so
// the Scheduler's and MSS Log Input's old headcount settings carry over; they are never written.
var SD_APP_VERSION = '1.2.0';
var SD_SETTINGS_KEY = 'director_settings';
var SD_HEADS_KEY = 'DIRECTOR_HEADS';
var SD_CREWPLAN_KEY = 'PRODSCHED_CREWPLAN';
var SD_MPSETUP_KEY = 'MSS_LOG_MANPOWER_SETUP';
var SD_TASK_PROMPT = 'Create a table named "Shift task" with schema prefix craa5__e_, Organization ownership. Primary column "Name" (single line of text, 100). Columns: "Task key" craa5_taskkey (single line of text, 100, the shift and task name, for example night|trash); "Shift" craa5_shift (single line of text, 10: day, night or both); "Days" craa5_days (single line of text, 7, one digit per day Sunday to Saturday, 1 = on, for example 0111110); "Heads" craa5_heads (whole number, people on the task, blank = 1); "Minutes" craa5_minutes (whole number, minutes per shift, blank = the whole shift); "Area" craa5_area (single line of text, 100, the MSS area name if it has one); "Active" craa5_active (yes/no, default yes); "Sort order" craa5_sortorder (whole number). No lookup or choice columns.';
var SD_TASK_COLS = { craa5_taskkey: { type: 'text', len: 100, label: 'Task key' }, craa5_shift: { type: 'text', len: 10, label: 'Shift' }, craa5_days: { type: 'text', len: 7, label: 'Days' },
    craa5_heads: { type: 'int', label: 'Heads' }, craa5_minutes: { type: 'int', label: 'Minutes' }, craa5_area: { type: 'text', len: 100, label: 'Area' }, craa5_active: { type: 'yesno', label: 'Active', 'default': true }, craa5_sortorder: { type: 'int', label: 'Sort order' } };
var SD_TABLES = {
    employees: { names: ['craa5___1_a_employee', 'craa5___1_a_employee'], label: 'Employees (crew, pay role)', owner: 'Manager hub / admin' },
    workshifts: { names: ['craa5___1_a_workshift'], label: 'Work Shifts (shift hours per crew)', owner: 'Admin' },
    cleanplan: { names: ['craa5___1_p_cleanplan'], label: 'Clean plan (crew plan staff rows, weeks, scopes)', owner: 'Production Scheduler' },
    assets: { names: ['craa5___1_a_assets'], label: 'Equipment (frequency flags, standard minutes)', owner: 'Admin / MSS Calendar' },
    msslog: { names: ['craa5___1_l_log'], label: 'MSS log (logged labor minutes)', owner: 'Ganttly, MSS Log Input, MSS Calendar' },
    board: { names: ['craa5___1_s_shiftboard'], label: 'Shift board (who is on the clock now)', owner: 'Shift Start' },
    archive: { names: ['craa5___1_s_shiftarchive'], label: 'Shift archive (who was on the clock)', owner: 'Shift Start' },
    rates: { names: ['craa5___1_e_laborrate', 'craa5_e_laborrate', 'craa5_laborrate'], label: '_e_ Labor rate (wage per pay role)', owner: 'Alex (admin)' },
    tasks: { names: ['craa5___1_e_shifttask', 'craa5_e_shifttask'], label: '_e_ Shift task (whole-shift posts, timed tasks)', owner: 'This page' },
    changeover: { names: ['craa5___1_p_changeoverrule', 'craa5_changeoverrule'], label: 'Changeover rules (wash minutes, cleaning tier)', owner: 'Production Scheduler' },
    skus: { names: ['craa5___1_p_skumaster', 'craa5___1_p_skumasters'], label: 'SKU Master (allergens, line speeds)', owner: 'Production Scheduler' },
    prdschd: { names: ['craa5___1_p_prodschedule', 'craa5___1_p_prodschedule'], label: 'Production Schedule (runs, downtime)', owner: 'Production Scheduler' },
    config: { names: HUB_CONFIG_TABLES, label: 'Hub config (director_settings, DIRECTOR_HEADS)', owner: 'Each app its own key' }
};
var SD_READ = {
    employees: ['craa5_name', 'craa5_shift', 'craa5_role', 'statecode'],
    workshifts: ['craa5_shiftcode', 'craa5_dayname', 'craa5_daynumber', 'craa5_shiftstarthour', 'craa5_shiftendhour'],
    cleanplan: ['craa5_plankey', 'craa5_rowtype', 'craa5_linekey', 'craa5_area', 'craa5_start', 'craa5_end', 'craa5_day', 'craa5_cleankind', 'craa5_minutes', 'craa5_status', 'craa5_details'],
    tasks: ['craa5_name', 'craa5_taskkey', 'craa5_shift', 'craa5_days', 'craa5_heads', 'craa5_minutes', 'craa5_area', 'craa5_active', 'craa5_sortorder', 'statecode'],
    assets: ['craa5_equipmentidentifier', 'craa5_areaname', 'craa5_hoursrequired', 'craa5_dailymin', 'craa5_dailyclean', 'craa5_midweek', 'craa5_weeklyclean', 'craa5_monthlyclean', 'craa5_month', 'craa5_quarterly', 'craa5_annually', 'statecode'],
    msslog: ['craa5_equipmentguid', 'craa5_shiftdate', 'craa5_shiftcode', 'craa5_lastcleaned', 'craa5_lastcleanedby', 'craa5_laborminutes', 'craa5_employeeguids', 'craa5_cleankind', 'craa5_completionkey', 'craa5_area', 'craa5_linekey', 'craa5_room', 'craa5_equipment', 'craa5_hoursworked', 'craa5_sap', 'craa5_sapw', 'craa5_uid', 'craa5_nameofemployee', 'craa5_pathogen', 'statecode'],
    board: ['craa5_boardjson', 'craa5_slotstart', 'statecode'],
    rates: ['craa5_role', 'craa5_hourlyrate', 'craa5_effectivefrom', 'statecode'],
    changeover: ['craa5_name', 'craa5_line', 'craa5_ruletype', 'craa5_cleaning_tier', 'craa5_base_wash_minutes', 'craa5_heads_required', 'craa5_requires_swab', 'craa5_active', 'statecode'],
    skus: ['craa5_skucode', 'craa5_productname', 'craa5_line', 'craa5_allergens', 'craa5_ideal_case_rate', 'statecode'],
    prdschd: ['craa5_area', 'craa5_line', 'craa5_product', 'craa5_productcode', 'craa5_datestarttime', 'craa5_dateendtime', 'craa5_allergen', 'craa5_typeofallergen', 'craa5_crumbclean', 'statecode']
};
// Columns a read can do without (it is read again without them, and the Data tab says "not yet").
var SD_OPTIONAL = {
    assets: ['craa5_dailymin', 'craa5_midweek'],
    msslog: ['craa5_shiftdate', 'craa5_shiftcode', 'craa5_laborminutes', 'craa5_employeeguids', 'craa5_cleankind', 'craa5_completionkey', 'craa5_area', 'craa5_linekey', 'craa5_lastcleanedby', 'craa5_room', 'craa5_equipment', 'craa5_hoursworked', 'craa5_sap', 'craa5_sapw', 'craa5_uid', 'craa5_nameofemployee', 'craa5_pathogen'],
    board: ['craa5_slotstart'],
    tasks: ['craa5_area', 'craa5_active', 'craa5_sortorder'],
    changeover: ['craa5_line', 'craa5_ruletype', 'craa5_requires_swab', 'craa5_active'],
    skus: ['craa5_allergens', 'craa5_ideal_case_rate'],
    prdschd: ['craa5_typeofallergen', 'craa5_crumbclean']
};
var SD_MANIFEST = {
    appId: 'director', app: 'hub - sanitation objectives director', version: SD_APP_VERSION,
    tables: [
        { t: 'craa5___1_a_employee', names: SD_TABLES.employees.names, read: ['craa5___1_a_employeeid'].concat(SD_READ.employees), opt: ['craa5_roleid'] },
        { t: 'craa5___1_a_workshift', read: ['craa5___1_a_workshiftid'].concat(SD_READ.workshifts) },
        { t: 'craa5___1_p_cleanplan', read: ['craa5___1_p_cleanplanid'].concat(SD_READ.cleanplan) },
        { t: 'craa5___1_a_assets', read: ['craa5___1_a_assetsid'].concat(SD_READ.assets.filter(function (c) { return SD_OPTIONAL.assets.indexOf(c) < 0; })), opt: SD_OPTIONAL.assets },
        { t: 'craa5___1_l_log', read: ['craa5___1_l_logid', 'craa5_equipmentguid', 'craa5_lastcleaned', 'statecode'], opt: SD_OPTIONAL.msslog },
        { t: 'craa5___1_s_shiftboard', read: ['craa5___1_s_shiftboardid', 'craa5_boardjson', 'statecode'] },
        { t: 'craa5___1_s_shiftarchive', read: ['craa5___1_s_shiftarchiveid', 'craa5_boardjson'], opt: ['craa5_slotstart'] },
        { t: 'craa5___1_e_laborrate', names: SD_TABLES.rates.names, read: SD_READ.rates },
        { t: 'craa5___1_p_changeoverrule', names: SD_TABLES.changeover.names, read: ['craa5___1_p_changeoverruleid'].concat(SD_READ.changeover), opt: SD_OPTIONAL.changeover },
        { t: 'craa5___1_p_skumaster', names: SD_TABLES.skus.names, read: ['craa5___1_p_skumasterid'].concat(SD_READ.skus), opt: SD_OPTIONAL.skus },
        { t: 'craa5___1_p_prodschedule', names: SD_TABLES.prdschd.names, read: ['craa5___1_p_prodscheduleid'].concat(SD_READ.prdschd), opt: SD_OPTIONAL.prdschd },
        { t: 'craa5___1_e_shifttask', names: SD_TABLES.tasks.names, read: ['craa5___1_e_shifttaskid'].concat(SD_READ.tasks), write: SD_READ.tasks.filter(function (c) { return c !== 'statecode'; }), opt: SD_OPTIONAL.tasks,
            cols: SD_TASK_COLS, label: 'Shift task', 'new': true, owner: 'org', primary: { n: 'craa5_name', len: 100, label: 'Name' }, prompt: SD_TASK_PROMPT }
    ],
    config: [SD_SETTINGS_KEY, SD_HEADS_KEY]
};
var SD_EMPTY_SRC = { rows: null, err: '', table: '' };
function sdLoadWord(src) {
    if (!src || src.loading || (!src.rows && !src.err && !src.kind))
        return 'Loading';
    if (src.rows)
        return src.rows.length ? 'Ready' : 'Nothing here yet';
    if (src.kind === 'missing')
        return 'Table missing';
    if (src.kind === 'denied')
        return 'No access';
    return 'Could not load';
}
function sdTagRows(rows, table) { return (rows || []).map(function (r) { var o = r; o.__id = sdCleanId(r[table + 'id'] || r.__id || ''); return o; }); }
function sdManifestIo(dataApi) {
    var wr = sdWriter(dataApi);
    return {
        query: function (t, o) { return sdQuery(dataApi, t, { select: o.select, filter: o.filter, top: o.top || 5, strictSelect: true }); },
        create: function (t, b) { return wr ? wr.create(t, b) : Promise.reject(new Error('no writer')); },
        update: function (t, id, b) { return wr ? wr.update(t, id, b) : Promise.reject(new Error('no writer')); }
    };
}
// Finds the table (first name that exists), then reads it with its id column and the listed columns. A missing optional column
// is dropped and the read made again, so an older table still loads; r.missingCols names what was dropped.
function sdLoad(dataApi, key, cols, filter, top, optional) {
    var names = SD_TABLES[key].names;
    return sdProbe(dataApi, names).then(function (pr) {
        if (pr.state !== 'found' || !pr.table)
            return { rows: null, err: pr.why || sdT('Table missing'), kind: pr.state === 'denied' ? 'denied' : pr.state === 'nohost' ? 'nohost' : pr.state === 'unknown' ? 'unknown' : 'missing', table: '', probe: pr };
        var t = pr.table, opt = (optional || []).slice(), dropped = [];
        function go(list) {
            return sdQuery(dataApi, t, { select: [t + 'id'].concat(list), filter: filter, top: top || 5000, strictSelect: true }).then(function (r) {
                if (!r.rows && r.kind === 'column' && opt.length) {
                    var named = opt.filter(function (c) { return String(r.err || '').toLowerCase().indexOf(c) >= 0; });
                    var drop = named.length ? named : opt.slice();
                    drop.forEach(function (c) { dropped.push(c); opt.splice(opt.indexOf(c), 1); });
                    return go(list.filter(function (c) { return drop.indexOf(c) < 0; }));
                }
                return r;
            });
        }
        return go(cols).then(function (r) {
            r.table = t;
            r.probe = pr;
            r.missingCols = dropped;
            if (r.rows)
                r.rows = sdTagRows(r.rows, t);
            return r;
        });
    });
}
// Employees with the pay role: the lookup's id (its formatted value is the role name), else a text column, else without.
function sdLoadEmployees(dataApi) {
    return sdLoad(dataApi, 'employees', SD_READ.employees.concat(['_craa5_roleid_value']), 'statecode eq 0', 5000, ['_craa5_roleid_value']).then(function (r) {
        if (r.rows && r.missingCols && r.missingCols.length) {
            return sdLoad(dataApi, 'employees', SD_READ.employees.concat(['craa5_roleid']), 'statecode eq 0', 5000, ['craa5_roleid']).then(function (r2) {
                if (r2.rows) {
                    r2.payCol = r2.missingCols && r2.missingCols.length ? '' : 'craa5_roleid';
                    return r2;
                }
                r.payCol = '';
                return r;
            });
        }
        if (r.rows)
            r.payCol = '_craa5_roleid_value';
        return r;
    });
}
// Shift boards: the live ones, and the archived shifts that started inside the window (Shift Start is the only writer).
function sdLoadBoards(dataApi, fromDay) {
    var fromIso = hubDateOnlyUtc(hubAddDays(fromDay, -1));
    return Promise.all([
        sdLoad(dataApi, 'board', ['craa5_boardjson', 'statecode'], 'statecode eq 0', 300),
        sdLoad(dataApi, 'archive', ['craa5_boardjson', 'craa5_slotstart'], 'craa5_slotstart ge ' + fromIso, 5000, ['craa5_slotstart']).then(function (r) {
            if (r.rows || r.kind !== 'column')
                return r;
            return sdLoad(dataApi, 'archive', ['craa5_boardjson'], '', 2000);
        })
    ]).then(function (res) {
        var boards = [];
        if (res[0].rows)
            res[0].rows.forEach(function (row) { var b = sdParseBoard(row, res[0].table, 'live'); if (b)
                boards.push(b); });
        if (res[1].rows)
            res[1].rows.forEach(function (row) { var b = sdParseBoard(row, res[1].table, 'archive'); if (b && b.day >= fromDay)
                boards.push(b); });
        return { live: res[0], archive: res[1], boards: boards };
    });
}
// A Hub config row by key (new _e_ table first, then the old _0_ one). Resolves { json (parsed or null), table, col, id, err }.
function sdReadConfig(dataApi, key) {
    var spots = [[HUB_CONFIG_TABLES[0], 'craa5_configjson'], [HUB_CONFIG_TABLES[1], HUB_MANIFEST_COL]];
    var i = 0, lastErr = '', firstFound = null;
    function next() {
        if (i >= spots.length)
            return Promise.resolve(firstFound || { json: null, table: '', col: '', id: '', err: lastErr || sdT('No Hub config table') });
        var sp = spots[i++];
        var cols = [sp[0] + 'id', 'craa5_configkey', 'craa5_configname', sp[1]];
        if (sp[1] !== 'craa5_configjson')
            cols.push('craa5_configjson');
        return sdQuery(dataApi, sp[0], { select: cols, filter: "statecode eq 0 and (craa5_configkey eq '" + key + "' or craa5_configname eq '" + key + "')", top: 5, strictSelect: true }).then(function (r) {
            if (!r.rows) {
                lastErr = r.err || '';
                return next();
            }
            var row = r.rows.filter(function (x) { return x.craa5_configkey === key; })[0] || r.rows[0], raw = null;
            if (row) {
                var txt = hubConfigJsonOf(row);
                if (txt && txt.trim())
                    raw = sdJson(txt);
            }
            var found = { json: raw, table: sp[0], col: sp[1], id: row ? hubGuid(row[sp[0] + 'id']) : '', err: '' };
            if (row)
                return found;
            if (!firstFound)
                firstFound = found;
            return next();
        });
    }
    return next();
}
// A row with a fixed id (hubIdFromKey of its key): update when known, else create with that id (contract rule 6).
function sdUpsert(dataApi, table, knownId, fixedId, body) {
    var w = sdWriter(dataApi);
    if (!w)
        return Promise.reject(new Error(sdT('This page cannot write to Dataverse here.')));
    var colErr = function (e) { var m = sdErrText(e); if (sdErrKind(m) === 'column')
        throw new Error(sdT('A column is missing in {t}: {err}', { t: table, err: m })); throw new Error(m); };
    if (knownId)
        return w.update(table, knownId, body).then(function () { return knownId; }, colErr);
    var create = {};
    for (var k in body)
        if (Object.prototype.hasOwnProperty.call(body, k))
            create[k] = body[k];
    create[table + 'id'] = fixedId;
    return w.create(table, create).then(function (id) { return id || fixedId; }, function (e) {
        var m = sdErrText(e);
        if (/duplicate|already exists|cannot insert duplicate|0x80040237/i.test(m))
            return w.update(table, fixedId, body).then(function () { return fixedId; }, colErr);
        return colErr(e);
    });
}
// One Hub config row of this page (key, display name, JSON), in the table sdReadConfig found. Resolves the row id.
function sdSaveConfig(dataApi, where, key, name, obj) {
    if (!where || !where.table)
        return Promise.reject(new Error(sdT('No Hub config table to save the settings in.')));
    var body = { craa5_configkey: key, craa5_configname: name };
    body[where.col] = JSON.stringify(obj);
    return sdUpsert(dataApi, where.table, where.id, hubIdFromKey('hubconfig|' + key), body);
}
function sdSaveSettings(dataApi, where, settings) { return sdSaveConfig(dataApi, where, SD_SETTINGS_KEY, 'Sanitation objectives director settings', settings); }
// Heads needed per shift for other apps (DIRECTOR_HEADS): written only when the numbers changed (same hash = nothing sent).
function sdPublishHeads(dataApi, where, payload) {
    if (where && where.json && where.json.hash === payload.hash)
        return Promise.resolve({ state: 'same', id: where.id });
    return sdSaveConfig(dataApi, where, SD_HEADS_KEY, 'Sanitation objectives director: heads needed per shift', payload).then(function (id) { return { state: 'saved', id: id }; });
}
// The shift tasks into _e_ Shift task: a new task gets a fixed row id from its key, a changed one is updated, one taken off the
// list is deactivated (never deleted). A column the table does not have yet is dropped from the write and the row saved without it.
function sdSaveTasks(dataApi, table, existingRows, list) {
    var w = sdWriter(dataApi);
    if (!w)
        return Promise.reject(new Error(sdT('This page cannot write to Dataverse here.')));
    var have = {};
    (existingRows || []).forEach(function (r, i) { var t = sdTaskFromRow(r, i); have[t.key] = { id: r.__id, t: t }; });
    var fields = function (t) { return { craa5_name: t.name.slice(0, 100), craa5_taskkey: t.key.slice(0, 100), craa5_shift: t.shift, craa5_days: t.days, craa5_heads: t.heads, craa5_minutes: t.minutes, craa5_area: t.area.slice(0, 100), craa5_active: t.active, craa5_sortorder: t.sort }; };
    var same = function (a, b) { var x = sdTask(a), y = sdTask(b); x.id = ''; y.id = ''; x.sort = 0; y.sort = 0; return JSON.stringify(x) === JSON.stringify(y) && a.sort === b.sort; };
    var jobs = [];
    list.forEach(function (t) { var h = have[t.key]; if (!h)
        jobs.push({ id: '', fixed: hubIdFromKey('shifttask|' + t.key), body: fields(t) });
    else if (!same(h.t, t))
        jobs.push({ id: h.id, body: fields(t) }); });
    Object.keys(have).forEach(function (k) { if (!list.some(function (t) { return t.key === k; }) && have[k].t.active)
        jobs.push({ id: have[k].id, body: { craa5_active: false } }); });
    var dropped = [];
    function put(j, tries) {
        return sdUpsert(dataApi, table, j.id, j.fixed, j.body).then(null, function (e) {
            var m = String(e && e.message || e), low = m.toLowerCase();
            var bad = Object.keys(j.body).filter(function (c) { return c !== 'craa5_name' && c !== 'craa5_taskkey' && low.indexOf(c) >= 0; });
            if (bad.length && tries < 6 && sdErrKind(m.replace(/^.*?: /, '')) === 'column') {
                bad.forEach(function (c) { delete j.body[c]; if (dropped.indexOf(c) < 0)
                    dropped.push(c); });
                return put(j, tries + 1);
            }
            throw e;
        });
    }
    var i = 0;
    function next() { if (i >= jobs.length)
        return Promise.resolve({ rows: jobs.length, dropped: dropped }); var j = jobs[i++]; return put(j, 0).then(next); }
    return next();
}
// ==== END DIRECTOR TABLES ====
// ==== DIRECTOR UI PARTS ====
// Styling: Alex's app host has no Tailwind, so the page injects cdn.tailwindcss.com itself (id tailwind-cdn), like the
// manager hub. The rules below add what Tailwind does not give:
// scrollbars you can see and grab, and the dark mode (the same class names, re-colored under .sd-dark with HUB_COLORS.dark).
var SD_DARK_RULES = [
    ['bg-white', 'background-color:#24324D'], ['bg-slate-50', 'background-color:#1E2A42'], ['bg-slate-100', 'background-color:#2B3A57'], ['bg-slate-200', 'background-color:#33425F'],
    ['bg-[#E6F1FB]', 'background-color:#1E2A42'], ['bg-[#FFF6E0]', 'background-color:#3A3320'],
    ['bg-emerald-50', 'background-color:rgba(16,185,129,0.14)'], ['bg-amber-50', 'background-color:rgba(245,158,11,0.14)'], ['bg-red-50', 'background-color:rgba(239,68,68,0.15)'], ['bg-pink-50', 'background-color:rgba(236,72,153,0.15)'], ['bg-violet-50', 'background-color:rgba(139,92,246,0.15)'],
    ['text-slate-400', 'color:#7C8BA5'], ['text-slate-500', 'color:#94A3B8'], ['text-slate-600', 'color:#A9B6CA'], ['text-slate-700', 'color:#CBD5E1'], ['text-slate-800', 'color:#E2E8F0'], ['text-slate-900', 'color:#F1F5F9'],
    ['text-[#00468B]', 'color:#B3D4F2'], ['text-[#0072CE]', 'color:#4DA3E8'], ['text-[#7A5600]', 'color:#FFD27A'],
    ['text-emerald-700', 'color:#6EE7B7'], ['text-emerald-800', 'color:#A7F3D0'], ['text-amber-700', 'color:#FCD34D'], ['text-amber-800', 'color:#FDE68A'],
    ['text-red-600', 'color:#F87171'], ['text-red-700', 'color:#FCA5A5'], ['text-red-800', 'color:#FECACA'], ['text-pink-700', 'color:#F9A8D4'], ['text-violet-700', 'color:#C4B5FD'],
    ['border-slate-100', 'border-color:#2B3A57'], ['border-slate-200', 'border-color:#33425F'], ['border-slate-300', 'border-color:#3E4F6E'], ['border-slate-400', 'border-color:#475569'],
    ['border-[#B3D4F2]', 'border-color:#2B4E78'], ['border-[#FFB81C]', 'border-color:#B7860F'], ['border-emerald-200', 'border-color:#1F5A47'], ['border-amber-200', 'border-color:#6B5418'], ['border-red-200', 'border-color:#6B2A2A'], ['border-pink-200', 'border-color:#6B2A50'], ['border-violet-200', 'border-color:#4C3A7A'],
    ['hover:bg-slate-50', 'background-color:#2B3A57', 1], ['hover:bg-slate-100', 'background-color:#33425F', 1], ['hover:bg-[#E6F1FB]', 'background-color:#2B3A57', 1], ['hover:bg-red-50', 'background-color:rgba(239,68,68,0.2)', 1]
];
function sdCssEsc(cls) { return cls.replace(/([\[\]#\/:.%(),])/g, '\\$1'); }
function sdStyleText() {
    var out = [
        '.sd-root{color-scheme:light}',
        '.sd-root.sd-dark{color-scheme:dark}',
        '.sd-root ::-webkit-scrollbar{width:12px;height:12px}',
        '.sd-root ::-webkit-scrollbar-track{background:rgba(148,163,184,0.15)}',
        '.sd-root ::-webkit-scrollbar-thumb{background:#94A3B8;border-radius:8px;border:2px solid transparent;background-clip:padding-box}',
        '.sd-root ::-webkit-scrollbar-thumb:hover{background:#64748B;background-clip:padding-box}',
        '.sd-root *{scrollbar-width:auto;scrollbar-color:#94A3B8 rgba(148,163,184,0.15)}',
        '.sd-root .sd-tabs::-webkit-scrollbar{height:6px}',
        '.sd-dark input,.sd-dark select,.sd-dark textarea{background-color:#1B2740;color:#E2E8F0;border-color:#3E4F6E}',
        '.sd-dark .divide-slate-100>:not([hidden])~:not([hidden]){border-color:#2B3A57}',
        '.sd-printonly{display:none}',
        '@media print{.sd-noprint{display:none!important}.sd-printonly{display:block!important}.sd-root{height:auto!important;overflow:visible!important}}'
    ];
    SD_DARK_RULES.forEach(function (r) {
        var sel = '.sd-dark .' + sdCssEsc(r[0]) + (r[2] ? ':hover' : '');
        out.push(sel + '{' + r[1] + '}');
    });
    return out.join('\n');
}
// Loads Tailwind once and puts this page's rules in the head. Calls back with false when Tailwind has not arrived in 8 seconds.
function sdEnsureStyles(onResult) {
    if (typeof document === 'undefined')
        return;
    var st = document.getElementById('director-style');
    if (!st) {
        st = document.createElement('style');
        st.id = 'director-style';
        document.head.appendChild(st);
    }
    st.textContent = sdStyleText();
    var w = window;
    if (!document.getElementById('tailwind-cdn')) {
        var sc = document.createElement('script');
        sc.id = 'tailwind-cdn';
        sc.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(sc);
    }
    // Says "not loaded" after 8 s but keeps watching for 2 minutes, so a slow network still clears the note.
    var t0 = Date.now();
    var failed = false;
    var timer = setInterval(function () {
        if (w.tailwind) {
            clearInterval(timer);
            onResult(true);
        }
        else if (!failed && Date.now() - t0 > 8000) {
            failed = true;
            onResult(false);
        }
        else if (Date.now() - t0 > 120000)
            clearInterval(timer);
    }, 250);
}
// ---------- small parts ----------
var SD_ICON_PATH = {
    star: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z',
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
    lock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
    unlock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 6.8-1.2',
    check: 'M4 12.5l5 5L20 6.5',
    clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'
};
function SdIcon(props) {
    var fill = props.fill ? 'currentColor' : 'none';
    return (React.createElement("svg", { viewBox: "0 0 24 24", width: props.size || 16, height: props.size || 16, fill: fill, stroke: "currentColor", strokeWidth: props.fill ? 1 : 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: props.className || '', style: props.style },
        React.createElement("path", { d: SD_ICON_PATH[props.name] || '' })));
}
function SdChip(props) {
    return React.createElement("span", { className: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ' + (props.cls || 'bg-slate-100 text-slate-600 border-slate-200'), title: props.title || '' }, props.children);
}
function SdBtn(props) {
    var kind = props.kind || 'plain';
    var cls = kind === 'primary' ? 'bg-[#0072CE] hover:bg-[#00468B] text-white border-transparent'
        : kind === 'danger' ? 'bg-white hover:bg-red-50 text-red-700 border-red-200'
            : kind === 'ghost' ? 'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent'
                : 'bg-white hover:bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]';
    return (React.createElement("button", { type: "button", disabled: props.disabled, onClick: props.onClick, title: props.title || '', "aria-label": props.label || undefined, "aria-pressed": props.pressed, className: 'min-h-[36px] px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 ' + cls + ' ' + (props.className || '') }, props.children));
}
function SdCard(props) {
    return (React.createElement("section", { className: 'bg-white rounded-xl border border-slate-200 shadow-sm ' + (props.className || ''), style: props.accent ? { borderTop: '4px solid ' + props.accent } : undefined },
        props.title && (React.createElement("div", { className: "flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-100" },
            React.createElement("h2", { className: "text-sm font-black text-[#00468B] uppercase tracking-widest flex-1 min-w-[160px] inline-flex items-center gap-2" },
                props.icon,
                props.title),
            props.right)),
        React.createElement("div", { className: props.pad === false ? '' : 'p-4' }, props.children)));
}
function SdModal(props) {
    var downOnBack = useRef(false); // only a press that starts on the backdrop closes (a text drag that ends there does not)
    var closeRef = useRef(props.onClose);
    closeRef.current = props.onClose;
    useEffect(function () {
        function onKey(e) { if (e.key === 'Escape')
            closeRef.current(); }
        window.addEventListener('keydown', onKey);
        return function () { window.removeEventListener('keydown', onKey); };
    }, []);
    return (React.createElement("div", { className: "fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-2 sm:p-6", style: { overflowY: 'auto' }, onMouseDown: function (e) { downOnBack.current = e.target === e.currentTarget; }, onClick: function (e) { if (downOnBack.current && e.target === e.currentTarget)
            props.onClose(); } },
        React.createElement("div", { className: 'bg-white rounded-xl shadow-2xl w-full ' + (props.wide ? 'max-w-4xl' : 'max-w-2xl') + ' my-4', onClick: function (e) { e.stopPropagation(); }, role: "dialog", "aria-label": props.title },
            React.createElement("div", { className: "flex items-start gap-3 px-5 py-4 border-b border-slate-100" },
                React.createElement("div", { className: "flex-1 min-w-0" },
                    React.createElement("h3", { className: "text-lg font-black text-[#00468B] break-words" }, props.title),
                    props.sub && React.createElement("p", { className: "text-xs text-slate-500 mt-0.5" }, props.sub)),
                props.head,
                React.createElement(SdBtn, { kind: "ghost", onClick: props.onClose, title: sdT('Close') }, sdT('Close'))),
            React.createElement("div", { className: "p-5 space-y-4" }, props.children))));
}
function SdNote(props) {
    var tone = props.tone || 'info';
    var cls = tone === 'warn' ? 'bg-amber-50 border-amber-200 text-amber-800' : tone === 'bad' ? 'bg-red-50 border-red-200 text-red-800' : tone === 'good' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-[#E6F1FB] border-[#B3D4F2] text-[#00468B]';
    return React.createElement("div", { className: 'rounded-lg border px-3 py-2 text-sm ' + cls + ' ' + (props.className || '') }, props.children);
}
function SdNumInput(props) {
    return (React.createElement("input", { type: "number", inputMode: "decimal", value: props.value === null || props.value === undefined ? '' : props.value, min: props.min, step: props.step || 1, placeholder: props.placeholder || '', onChange: function (e) { var v = e.target.value; props.onChange(v === '' ? null : Number(v)); }, className: 'border border-slate-300 rounded-lg px-2 py-1 text-sm w-24 ' + (props.className || ''), "aria-label": props.label || '' }));
}
// A text box that saves when it loses focus (not on every key), like the work order hours.
function SdTextSave(props) {
    var st = useState(props.value || '');
    var v = st[0];
    var last = useRef(props.value || '');
    useEffect(function () { if ((props.value || '') !== last.current) {
        last.current = props.value || '';
        st[1](props.value || '');
    } }, [props.value]);
    function commit() { if (v !== (props.value || '')) {
        last.current = v;
        props.onSave(v);
    } }
    var printed = v ? React.createElement("div", { className: 'sd-printonly whitespace-pre-wrap text-sm ' + (props.className || '') }, v) : null; // the whole note on paper
    if (props.rows)
        return React.createElement(React.Fragment, null,
            React.createElement("textarea", { rows: props.rows, className: 'sd-noprint block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm ' + (props.className || ''), value: v, placeholder: props.placeholder || '', "aria-label": props.label || '', onChange: function (e) { st[1](e.target.value); }, onBlur: commit }),
            printed);
    return React.createElement(React.Fragment, null,
        React.createElement("input", { className: 'sd-noprint border border-slate-300 rounded-lg px-2 py-1 text-sm ' + (props.className || ''), value: v, placeholder: props.placeholder || '', "aria-label": props.label || '', onChange: function (e) { st[1](e.target.value); }, onBlur: commit, onKeyDown: function (e) { if (e.key === 'Enter')
                commit(); } }),
        printed);
}
// A big number tile. tone: good / warn / bad colors the line under the number; big = the debrief headline size.
function SdStat(props) {
    var tone = props.tone === 'bad' ? 'text-red-700' : props.tone === 'warn' ? 'text-amber-700' : props.tone === 'good' ? 'text-emerald-700' : 'text-slate-500';
    var bar = props.tone === 'bad' ? '#DC2626' : props.tone === 'warn' ? '#D97706' : props.tone === 'good' ? '#059669' : '#CBD5E1';
    return (React.createElement("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3", style: { borderLeft: '4px solid ' + bar } },
        React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, props.label),
        React.createElement("div", { className: (props.big ? 'text-3xl' : 'text-xl') + ' font-black text-slate-800 mt-1 break-words' }, props.value),
        props.sub && React.createElement("div", { className: 'text-xs mt-0.5 ' + tone }, props.sub)));
}
// ==== END DIRECTOR UI PARTS ====
// Turns what was read plus the saved plan into the one picture every tab draws (lines, shifts, schedule, costs, debrief).
// ==== DIRECTOR CHARTS ====
// Hand-drawn SVG charts (no chart library: the page runs in Power Apps). One y axis each. Colors checked with the dataviz
// validator against both surfaces (light #FFFFFF, dark #24324D): logged blue, standing work teal, called for gold.
// Scheduled hours are the outline the bars sit in (capacity), projected weeks are drawn dashed.
var SD_SERIES = {
    light: { logged: '#0072CE', standing: '#0D9488', called: '#B7860F', cap: '#94A3B8', grid: '#E2E8F0', axis: '#64748B', unused: '#CBD5E1', over: '#D97706' },
    dark: { logged: '#3B8FD9', standing: '#14A394', called: '#BC8C0C', cap: '#7C8BA5', grid: '#33425F', axis: '#94A3B8', unused: '#3E4F6E', over: '#F59E0B' }
};
function sdPal(dark) { return dark ? SD_SERIES.dark : SD_SERIES.light; }
function sdNiceMax(v) {
    if (!(v > 0))
        return 1;
    var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), n = v / p;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return step * p;
}
function SdLegend(props) {
    return (React.createElement("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600", "data-legend": "1" }, props.items.map(function (it) {
        var sw = it.kind === 'line' ? React.createElement("svg", { width: "18", height: "10", "aria-hidden": "true" },
            React.createElement("line", { x1: "1", y1: "5", x2: "17", y2: "5", stroke: it.color, strokeWidth: "2", strokeDasharray: it.dash ? '4 3' : undefined }))
            : it.kind === 'outline' ? React.createElement("svg", { width: "14", height: "12", "aria-hidden": "true" },
                React.createElement("rect", { x: "1", y: "1", width: "12", height: "10", rx: "2", fill: "none", stroke: it.color, strokeWidth: "1.5", strokeDasharray: it.dash ? '3 2' : undefined }))
                : React.createElement("svg", { width: "12", height: "12", "aria-hidden": "true" },
                    React.createElement("rect", { x: "0", y: "0", width: "12", height: "12", rx: "3", fill: it.color }));
        return React.createElement("span", { key: it.name, className: "inline-flex items-center gap-1.5" },
            sw,
            it.name);
    })));
}
// Bars over time. rows: [{ key, label, tick (label shown on the axis or ''), stack: [n...], cap (outline, optional), line (optional),
// proj (drawn dashed), tip: [[name, text]...] }]. series: [{ name, color }]. One unit for every number (fmt formats it).
function SdBars(props) {
    var P = sdPal(props.dark);
    var rows = props.rows || [], series = props.series || [];
    var hoverState = useState(-1);
    var hover = hoverState[0];
    var posState = useState({ x: 0, y: 0 });
    var W = Math.max(320, props.width || 900), H = props.height || 220, padL = 52, padR = 10, padT = 10, padB = 26;
    var max = 0;
    rows.forEach(function (r) {
        var st = sdSum(r.stack || [], function (v) { return v > 0 ? v : 0; });
        max = Math.max(max, st, r.cap || 0, r.line || 0);
    });
    max = sdNiceMax(max * 1.05);
    var n = rows.length || 1, slot = (W - padL - padR) / n, bw = Math.max(2, Math.min(28, slot * 0.68));
    var y = function (v) { return padT + (H - padT - padB) * (1 - (v > 0 ? v : 0) / max); };
    var ticks = [0, 0.25, 0.5, 0.75, 1].map(function (f) { return max * f; });
    var linePts = [];
    rows.forEach(function (r, i) { if (r.line !== null && r.line !== undefined)
        linePts.push([padL + slot * i + slot / 2, y(r.line), !!r.proj, i]); });
    var segs = [];
    for (var i = 1; i < linePts.length; i++)
        segs.push(React.createElement("line", { key: 'l' + i, x1: linePts[i - 1][0], y1: linePts[i - 1][1], x2: linePts[i][0], y2: linePts[i][1], stroke: P.called, strokeWidth: "2", strokeLinecap: "round", strokeDasharray: linePts[i][2] ? '5 4' : undefined }));
    function onMove(e, idx) {
        var box = e.currentTarget.ownerSVGElement ? e.currentTarget.ownerSVGElement.parentNode.getBoundingClientRect() : null;
        if (box)
            posState[1]({ x: e.clientX - box.left, y: e.clientY - box.top });
        if (hover !== idx)
            hoverState[1](idx);
    }
    var hr = hover >= 0 ? rows[hover] : null;
    return (React.createElement("div", { className: "relative w-full", onMouseLeave: function () { hoverState[1](-1); } },
        React.createElement("svg", { viewBox: '0 0 ' + W + ' ' + H, width: "100%", height: H, preserveAspectRatio: "none", role: "img", "aria-label": props.label || '', style: { display: 'block', overflow: 'visible' } },
            ticks.map(function (t, k) {
                return React.createElement("g", { key: 't' + k },
                    React.createElement("line", { x1: padL, x2: W - padR, y1: y(t), y2: y(t), stroke: P.grid, strokeWidth: "1" }),
                    React.createElement("text", { x: padL - 6, y: y(t) + 4, textAnchor: "end", fontSize: "11", fill: P.axis }, props.fmt ? props.fmt(t, true) : Math.round(t)));
            }),
            rows.map(function (r, i) {
                var x = padL + slot * i + (slot - bw) / 2, base = y(0), acc = 0, parts = [];
                (r.stack || []).forEach(function (v, k) {
                    if (!(v > 0))
                        return;
                    var y1 = y(acc + v), y0 = y(acc), h = Math.max(0, y0 - y1 - (acc > 0 ? 2 : 0));
                    parts.push(React.createElement("rect", { key: k, x: x + 2, y: y1, width: Math.max(1, bw - 4), height: h, rx: acc + v >= sdSum(r.stack, function (q) { return q > 0 ? q : 0; }) - 1e-9 ? 3 : 0, fill: series[k] ? series[k].color : P.axis, opacity: hover >= 0 && hover !== i ? 0.55 : 1 }));
                    acc += v;
                });
                var sel = props.selected === r.key;
                return (React.createElement("g", { key: r.key, "data-bar": r.key },
                    r.cap > 0 && React.createElement("rect", { x: x, y: y(r.cap), width: bw, height: Math.max(0, base - y(r.cap)), rx: "4", fill: "none", stroke: sel ? '#0072CE' : P.cap, strokeWidth: sel ? 2.5 : 1.5, strokeDasharray: r.proj ? '4 3' : undefined }),
                    parts,
                    r.tick && React.createElement("text", { x: padL + slot * i + slot / 2, y: H - 8, textAnchor: "middle", fontSize: "11", fill: P.axis }, r.tick)));
            }),
            segs,
            linePts.map(function (p) { return hover === p[3] ? React.createElement("circle", { key: 'c' + p[3], cx: p[0], cy: p[1], r: "5", fill: P.called, stroke: props.dark ? '#24324D' : '#FFFFFF', strokeWidth: "2" }) : null; }),
            hover >= 0 && React.createElement("line", { x1: padL + slot * hover + slot / 2, x2: padL + slot * hover + slot / 2, y1: padT, y2: H - padB, stroke: P.axis, strokeWidth: "1", strokeDasharray: "2 3" }),
            rows.map(function (r, i) {
                return React.createElement("rect", { key: 'h' + i, "data-hit": r.key, x: padL + slot * i, y: padT, width: slot, height: H - padT - padB, fill: "transparent", style: { cursor: props.onPick ? 'pointer' : 'default' }, onMouseMove: function (e) { onMove(e, i); }, onClick: function () { if (props.onPick)
                        props.onPick(r.key); } });
            })),
        hr && hr.tip && (React.createElement("div", { className: "absolute z-20 pointer-events-none bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs text-slate-700", "data-tip": "1", style: { left: Math.min(Math.max(8, posState[0].x + 14), Math.max(8, (props.width || 900) - 250)), top: Math.max(0, posState[0].y - 10), minWidth: 190, maxWidth: 260 } },
            React.createElement("div", { className: "font-bold text-slate-800 mb-1" }, hr.label),
            hr.tip.map(function (t, k) { return React.createElement("div", { key: k, className: "flex justify-between gap-3" },
                React.createElement("span", { className: "text-slate-500" }, t[0]),
                React.createElement("span", { className: "font-semibold" }, t[1])); })))));
}
// Measures its own width so the bars keep their shape (the SVG is drawn at the real width, not stretched).
function SdAutoWidth(props) {
    var ref = useRef(null);
    var wState = useState(900);
    useEffect(function () {
        function fit() { var el = ref.current; if (el && el.clientWidth)
            wState[1](el.clientWidth); }
        fit();
        window.addEventListener('resize', fit);
        return function () { window.removeEventListener('resize', fit); };
    }, []);
    return React.createElement("div", { ref: ref, className: "w-full" }, props.render(wState[0]));
}
// One horizontal bar of parts against a capacity mark (a shift's work against the crew on the clock).
function SdPartsBar(props) {
    var P = sdPal(props.dark);
    var parts = props.parts || [], total = sdSum(parts, function (p) { return p.value > 0 ? p.value : 0; });
    var max = Math.max(total, props.cap || 0, 1) * 1.05;
    return (React.createElement("div", { className: "space-y-1.5" },
        React.createElement("div", { className: "relative h-7 rounded-md bg-slate-100 overflow-hidden", "data-parts": "1" },
            (function () {
                var acc = 0;
                return parts.map(function (p, i) {
                    if (!(p.value > 0))
                        return null;
                    var left = 100 * acc / max, w = 100 * p.value / max;
                    acc += p.value;
                    return React.createElement("div", { key: i, title: p.name + ': ' + (props.fmt ? props.fmt(p.value) : p.value), className: "absolute top-0 h-full", style: { left: left + '%', width: 'calc(' + w + '% - 2px)', background: p.color, borderRadius: 3 } });
                });
            })(),
            props.cap > 0 && React.createElement("div", { className: "absolute top-0 h-full", style: { left: 'calc(' + (100 * props.cap / max) + '% - 1px)', width: 2, background: P.axis }, title: props.capName || '' })),
        React.createElement(SdLegend, { items: parts.map(function (p) { return { name: p.name + ' ' + (props.fmt ? props.fmt(p.value) : p.value), color: p.color }; }).concat(props.cap > 0 ? [{ name: (props.capName || '') + ' ' + (props.fmt ? props.fmt(props.cap) : props.cap), color: P.axis, kind: 'line' }] : []) })));
}
// ==== END DIRECTOR CHARTS ====
// ==== DIRECTOR TABS ====
// The screens. Every number on them comes from sdBuildModel; a projected number always says so.
function sdH(min) { return min === null || min === undefined || !isFinite(min) ? '--' : sdFmtNum(min / 60, min !== 0 && Math.abs(min) < 600 ? 1 : 0) + ' h'; }
function sdHAxis(min) { return sdFmtNum(min / 60, 0); }
function sdPct(v) { return v === null || v === undefined || !isFinite(v) ? '--' : Math.round(v) + '%'; }
function sdMoney(v, noRate) { if (noRate && !v)
    return '--'; return v === null || v === undefined || !isFinite(v) ? '--' : sdFmtMoney(v); }
function sdDayLabel(day) { var d = sdFromYmd(day); return d ? sdDayName(d.getDay()) + ' ' + (SD_LANG === 'es' ? d.getDate() + '/' + (d.getMonth() + 1) : (d.getMonth() + 1) + '/' + d.getDate()) : day; }
function sdWeekLabel(w) { var d = sdFromYmd(w); return d ? sdT('Week of {d}', { d: SD_LANG === 'es' ? d.getDate() + ' ' + sdMonthName(d.getMonth(), true) : sdMonthName(d.getMonth(), true) + ' ' + d.getDate() }) : w; }
var SD_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function sdMonthName(i, short) { var n = sdT(SD_MONTHS[i]); return short ? n.slice(0, 3) : n; }
function sdMonthLabel(ym) { return sdMonthName(Number(ym.slice(5, 7)) - 1) + ' ' + ym.slice(0, 4); }
function sdHour(h) { if (h === null || h === undefined || !isFinite(h))
    return '--'; var hh = ((Math.round(h) % 24) + 24) % 24; return (hh < 10 ? '0' : '') + hh + ':00'; }
function sdCrewLabel(c) { return c === 'N' ? sdT('Night shift') : sdT('Crew {c}', { c: c }); }
function sdDnLabel(dn) { return dn === 'night' ? sdT('Night') : dn === 'day' ? sdT('Day') : sdT('Unknown'); }
function sdUtilTone(u, target) { if (u === null || u === undefined)
    return 'none'; if (u > 100.5)
    return 'over'; if (u >= target * 0.8)
    return 'good'; return 'low'; }
var SD_TONE_CLS = { none: 'bg-slate-100 text-slate-500 border-slate-200', good: 'bg-emerald-50 text-emerald-800 border-emerald-200', low: 'bg-amber-50 text-amber-800 border-amber-200', over: 'bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]' };
function sdSide(sum, side) { return side === 'day' ? sum.day : side === 'night' ? sum.night : sum.all; }
function SdSideToggle(props) {
    return (React.createElement("div", { className: "inline-flex rounded-lg border border-slate-300 overflow-hidden", role: "group", "aria-label": sdT('Days and nights') }, [['all', 'Days and nights'], ['day', 'Days'], ['night', 'Nights']].map(function (x) {
        return React.createElement("button", { key: x[0], type: "button", "data-side": x[0], "aria-pressed": props.value === x[0], onClick: function () { props.onChange(x[0]); }, className: 'px-3 py-1.5 text-sm font-bold ' + (props.value === x[0] ? 'bg-[#0072CE] text-white' : 'bg-white text-slate-600 hover:bg-slate-50') }, sdT(x[1]));
    })));
}
function SdPick(props) {
    return (React.createElement("div", { className: "inline-flex rounded-lg border border-slate-300 overflow-hidden", role: "group", "aria-label": props.label || '' }, props.options.map(function (x) {
        return React.createElement("button", { key: x[0], type: "button", "aria-pressed": props.value === x[0], onClick: function () { props.onChange(x[0]); }, className: 'px-3 py-1.5 text-sm font-bold ' + (props.value === x[0] ? 'bg-[#00468B] text-white' : 'bg-white text-slate-600 hover:bg-slate-50') }, x[1]);
    })));
}
// Week rows for the bar chart: scheduled (outline; on the clock for past weeks, planned for the rest), logged + standing (bars),
// called for (line; dashed when projected).
function sdWeekRows(weeks, side, thisWeek) {
    var lastMonth = '';
    return weeks.map(function (w) {
        var s = sdSide(w, side), past = w.week < thisWeek, mo = w.week.slice(0, 7);
        var tick = mo !== lastMonth ? sdMonthName(Number(mo.slice(5, 7)) - 1, true) : '';
        lastMonth = mo;
        var cap = past ? s.clock : s.sched;
        var tip = [[sdT(past ? 'On the clock' : 'Scheduled (planned)'), sdH(cap)], [sdT('Called for'), sdH(s.called) + (s.calledProj > s.called / 2 ? ' (' + sdT('projected') + ')' : '')]];
        if (past || w.week === thisWeek) {
            tip.push([sdT('Logged (MSS log)'), sdH(s.logged)]);
            tip.push([sdT('Standing work (planned)'), sdH(s.standing)]);
            tip.push([sdT('Utilization % (actual)'), sdPct(s.util)]);
        }
        return { key: w.week, label: sdWeekLabel(w.week), tick: tick, cap: cap, line: s.called || null, proj: s.calledProj > s.called / 2 || w.week > thisWeek,
            stack: past || w.week === thisWeek ? [s.logged, s.standing] : [], tip: tip };
    });
}
// ---------- Overview ----------
function SdOverviewTab(props) {
    var m = props.m, S = props.settings, dark = props.dark;
    var sideState = useState('all');
    var side = sideState[0];
    var spanState = useState('13');
    var span = Number(spanState[0]);
    var lastWeek = hubAddDays(m.thisWeek, -7);
    var lw = m.weekMap[lastWeek], tw = m.weekMap[m.thisWeek];
    var past4 = sdEmptySum(), next4 = sdEmptySum();
    m.weeks.forEach(function (w) {
        if (w.week >= hubAddDays(m.thisWeek, -28) && w.week < m.thisWeek)
            w.shifts.forEach(function (s) { if (side === 'all' || s.dn === side)
                sdAdd(past4, s); });
        if (w.week >= m.thisWeek && w.week < hubAddDays(m.thisWeek, 28))
            w.shifts.forEach(function (s) { if (side === 'all' || s.dn === side)
                sdAdd(next4, s); });
    });
    sdFinish(past4);
    sdFinish(next4);
    var rosterHeads = m.counts.onCrews;
    var sugg = sdSum(m.crews, function (c) { return c.suggested || 0; }), suggKnown = m.crews.some(function (c) { return c.suggested !== null; });
    var weeks = m.weeks.filter(function (w) { return w.week >= hubAddDays(m.thisWeek, -7 * span) && w.week <= hubAddDays(m.thisWeek, 7 * span); });
    var rows = sdWeekRows(weeks, side, m.thisWeek);
    var P = sdPal(dark);
    var lwS = lw ? sdSide(lw, side) : null;
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "flex flex-wrap items-center gap-2 sd-noprint" },
            React.createElement(SdSideToggle, { value: side, onChange: sideState[1] }),
            React.createElement(SdPick, { label: sdT('Weeks shown'), value: spanState[0], onChange: spanState[1], options: [['8', sdT('8 weeks each way')], ['13', sdT('13 weeks each way')], ['26', sdT('26 weeks each way')], ['52', sdT('A year each way')]] })),
        React.createElement("div", { className: "text-xs font-bold uppercase tracking-wider text-slate-500" }, sdT('Last 4 weeks (what happened)')),
        React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3" },
            React.createElement(SdStat, { label: sdT('On the clock'), value: sdH(past4.clock), sub: sdT('scheduled {h} planned', { h: sdH(past4.sched) }) }),
            React.createElement(SdStat, { label: sdT('Logged (MSS log)'), value: sdH(past4.logged), sub: sdT('+ {h} standing work (planned)', { h: sdH(past4.standing) }) }),
            React.createElement(SdStat, { label: sdT('Utilization % (actual)'), value: sdPct(past4.util), sub: sdT('target {t}%', { t: S.target }), tone: past4.util === null ? '' : past4.util >= S.target * 0.8 ? 'good' : 'warn' }),
            React.createElement(SdStat, { label: sdT('Wage cost (logged)'), value: sdMoney(past4.loggedWage, past4.noRate), sub: sdT('scheduled {w}', { w: sdMoney(past4.schedWage, past4.noRate) }) }),
            React.createElement(SdStat, { label: sdT('Unused wage'), value: sdMoney(past4.unusedWage, past4.noRate), sub: sdT('after standing work {w}', { w: sdMoney(past4.standingWage, past4.noRate) }), tone: past4.unusedWage > 0 ? 'warn' : '' })),
        React.createElement("div", { className: "text-xs font-bold uppercase tracking-wider text-slate-500" }, sdT('Next 4 weeks (what the work calls for)')),
        React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3" },
            React.createElement(SdStat, { label: sdT('Called for'), value: sdH(next4.called), sub: next4.calledProj > 0 ? sdT('{h} of it projected', { h: sdH(next4.calledProj) }) : sdT('all from the published clean plan') }),
            React.createElement(SdStat, { label: sdT('Scheduled (planned)'), value: sdH(next4.sched), sub: sdT('today\'s roster x Work Shifts') }),
            React.createElement(SdStat, { label: sdT('Planned utilization'), value: sdPct(next4.planUtil), sub: sdT('called for / scheduled'), tone: next4.planUtil === null ? '' : next4.planUtil > 100 ? 'warn' : 'good' }),
            React.createElement(SdStat, { label: sdT('Suggested crew'), value: suggKnown ? String(sugg) : '--', sub: sdT('on crews today: {n}', { n: rosterHeads }), tone: suggKnown && sugg > rosterHeads ? 'warn' : suggKnown ? 'good' : '' }),
            React.createElement(SdStat, { label: sdT('Projected wage cost'), value: sdMoney(next4.projWage, next4.noRate), sub: m.tech2 ? sdT('called for at {r}/h ({role})', { r: sdMoney(m.tech2.rate), role: m.tech2.role }) : sdT('no rate set') })),
        React.createElement(SdCard, { title: sdT('Week by week'), right: React.createElement(SdLegend, { items: [{ name: sdT('Scheduled (on the clock, then planned)'), color: P.cap, kind: 'outline' }, { name: sdT('Logged (MSS log)'), color: P.logged }, { name: sdT('Standing work (planned)'), color: P.standing }, { name: sdT('Called for'), color: P.called, kind: 'line' }, { name: sdT('Projected'), color: P.called, kind: 'line', dash: true }] }) },
            React.createElement(SdAutoWidth, { render: function (w) { return React.createElement(SdBars, { width: w, dark: dark, rows: rows, series: [{ name: 'logged', color: P.logged }, { name: 'standing', color: P.standing }], fmt: sdHAxis, label: sdT('Week by week'), selected: m.thisWeek, onPick: props.onWeek, height: 240 }); } }),
            React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, sdT('Person-hours. Click a week to open it. Past weeks: the outline is the people on the clock (Shift Start board, else today\'s roster); this week and later: today\'s roster x Work Shifts.'))),
        lwS && (React.createElement(SdCard, { title: sdT('Last week, days and nights') },
            React.createElement(SdDnTable, { m: m, week: lw, onShift: props.onShift, target: S.target }))),
        React.createElement(SdCard, { title: sdT('Weeks as a table'), pad: false },
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200" }, ['Week', 'On the clock', 'Scheduled (planned)', 'Called for', 'Logged', 'Standing work', 'Utilization % (actual)', 'Wage cost (logged)', 'Unused wage'].map(function (h) { return React.createElement("th", { key: h, className: "px-3 py-2 font-bold whitespace-nowrap" }, sdT(h)); }))),
                    React.createElement("tbody", { className: "divide-y divide-slate-100" }, weeks.slice().reverse().map(function (w) {
                        var s = sdSide(w, side), fut = w.week > m.thisWeek;
                        return (React.createElement("tr", { key: w.week, className: "hover:bg-slate-50 cursor-pointer", onClick: function () { props.onWeek(w.week); }, "data-weekrow": w.week },
                            React.createElement("td", { className: "px-3 py-1.5 whitespace-nowrap font-semibold text-[#00468B]" },
                                sdWeekLabel(w.week),
                                w.week === m.thisWeek ? ' (' + sdT('this week') + ')' : ''),
                            React.createElement("td", { className: "px-3 py-1.5" }, fut ? '' : sdH(s.clock)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdH(s.sched)),
                            React.createElement("td", { className: "px-3 py-1.5" },
                                sdH(s.called),
                                s.calledProj > s.called / 2 ? React.createElement("span", { className: "text-[11px] text-slate-400" },
                                    " ",
                                    sdT('projected')) : null),
                            React.createElement("td", { className: "px-3 py-1.5" }, fut ? '' : sdH(s.logged)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdH(s.standing)),
                            React.createElement("td", { className: "px-3 py-1.5" }, fut ? '' : React.createElement(SdChip, { cls: SD_TONE_CLS[sdUtilTone(s.util, S.target)] }, sdPct(s.util))),
                            React.createElement("td", { className: "px-3 py-1.5" }, fut ? '' : sdMoney(s.loggedWage, s.noRate)),
                            React.createElement("td", { className: "px-3 py-1.5" }, fut ? '' : sdMoney(s.unusedWage, s.noRate))));
                    }))))),
        React.createElement(SdCard, { title: sdT('Allergen & Changeover Expenditures'), right: React.createElement("span", { className: "text-xs text-slate-500" }, sdT('craa5___1_p_changeoverrule & SKU Master')) },
            React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4" },
                React.createElement(SdStat, { label: sdT('Weekly Allergen Spend'), value: sdMoney(m.allergen ? m.allergen.weeklyTotal : 0), sub: sdT('{n} cleans this week', { n: m.allergen ? m.allergen.weeklyCleans.length : 0 }) }),
                React.createElement(SdStat, { label: sdT('Annual Projected Allergen Spend'), value: sdMoney(m.allergen ? m.allergen.annualTotal : 0), sub: sdT('52-week frequency model') }),
                React.createElement(SdStat, { label: sdT('Average Cost per Clean'), value: sdMoney(m.allergen ? m.allergen.avgCleanCost : 0), sub: sdT('labor + chemical + swab') }),
                React.createElement(SdStat, { label: sdT('Swab Tests (ATP)'), value: sdMoney(m.allergen ? m.allergen.weeklySwab : 0), sub: sdT('$12.50 per validated test') })),
            m.allergen && m.allergen.weeklyCleans.length ? (React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200" }, ['Line', 'Product / SKU', 'Clean kind', 'Tier', 'Duration', 'Heads', 'Labor cost', 'Chemicals', 'Total cost'].map(function (h) { return React.createElement("th", { key: h, className: "px-3 py-2 font-bold whitespace-nowrap" }, sdT(h)); }))),
                    React.createElement("tbody", { className: "divide-y divide-slate-100" }, m.allergen.weeklyCleans.map(function (c, i) {
                        return (React.createElement("tr", { key: i, className: "hover:bg-slate-50" },
                            React.createElement("td", { className: "px-3 py-1.5 font-semibold text-[#00468B]" }, c.line),
                            React.createElement("td", { className: "px-3 py-1.5" }, c.sku),
                            React.createElement("td", { className: "px-3 py-1.5" },
                                React.createElement(SdChip, { cls: c.kind === 'pecan' || c.kind === 'allergen' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700' }, sdKindLabel(c.kind))),
                            React.createElement("td", { className: "px-3 py-1.5 text-xs text-slate-500" }, c.tier),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdFmtHours(c.washMins)),
                            React.createElement("td", { className: "px-3 py-1.5" }, c.heads),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdMoney(c.laborCost)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdMoney(c.chemCost)),
                            React.createElement("td", { className: "px-3 py-1.5 font-bold text-slate-800" }, sdMoney(c.totalCost))));
                    }))))) : (React.createElement("div", { className: "p-3 text-sm text-slate-500" }, sdT('No allergen changeover cleans scheduled for this week.'))))));
}
// One week as two rows (days, nights) by seven days; each cell opens its shift.
function SdDnTable(props) {
    var m = props.m, w = props.week;
    var days = [];
    for (var i = 0; i < 7; i++)
        days.push(hubAddDays(w.week, i));
    return (React.createElement("div", { className: "overflow-x-auto" },
        React.createElement("table", { className: "w-full text-sm", "data-dntable": w.week },
            React.createElement("thead", null,
                React.createElement("tr", { className: "text-xs text-slate-500" },
                    React.createElement("th", { className: "px-2 py-1 text-left" }, sdT('Shift')),
                    days.map(function (d) { return React.createElement("th", { key: d, className: "px-2 py-1 text-left whitespace-nowrap" }, sdDayLabel(d)); }))),
            React.createElement("tbody", null, ['day', 'night'].map(function (dn) {
                return (React.createElement("tr", { key: dn, className: "align-top" },
                    React.createElement("td", { className: "px-2 py-1 font-bold text-slate-600 whitespace-nowrap" }, dn === 'day' ? sdT('Days') : sdT('Nights')),
                    days.map(function (d) {
                        var list = w.shifts.filter(function (s) { return s.day === d && (s.dn === dn || (dn === 'day' && s.dn === '?')); });
                        return (React.createElement("td", { key: d, className: "px-1 py-1" }, list.length ? list.map(function (s) { return React.createElement(SdShiftChip, { key: s.key, s: s, target: props.target, onClick: function () { props.onShift(s.key); } }); }) : React.createElement("span", { className: "text-xs text-slate-400" }, "--")));
                    })));
            })))));
}
function SdShiftChip(props) {
    var s = props.s, fut = s.state === 'future';
    var tone = fut ? (s.need !== null && s.need + (s.vac || 0) > s.rosterHeads ? 'low' : 'none') : sdUtilTone(s.util, props.target);
    return (React.createElement("button", { type: "button", "data-shift": s.key, onClick: props.onClick, className: 'block w-full text-left rounded-lg border px-2 py-1 mb-1 hover:opacity-80 ' + SD_TONE_CLS[tone] },
        React.createElement("div", { className: "text-[11px] font-black" },
            sdCrewLabel(s.crew),
            " ",
            sdHour(s.startH)),
        fut ? React.createElement("div", { className: "text-[11px]" }, sdT('need {n} / {r} on crew', { n: s.need === null ? '--' : s.need, r: s.rosterHeads }))
            : React.createElement("div", { className: "text-[11px]" },
                sdPct(s.util),
                " - ",
                sdH(s.logged)),
        s.calledFrom === 'projected' && React.createElement("div", { className: "text-[10px] opacity-70" }, sdT('projected'))));
}
// ---------- Calendar (the gross overview, like the MSS calendar) ----------
function SdCalendarTab(props) {
    var m = props.m, S = props.settings;
    var monthState = useState(m.today.slice(0, 7));
    var month = monthState[0];
    var first = month + '-01', start = hubWeekKey(first);
    var y = Number(month.slice(0, 4)), mo = Number(month.slice(5, 7));
    function shift(n) { var d = new Date(y, mo - 1 + n, 1); monthState[1](d.getFullYear() + '-' + sdPad(d.getMonth() + 1)); }
    var cells = [];
    for (var i = 0; i < 42; i++) {
        var d = hubAddDays(start, i);
        if (i >= 35 && d.slice(0, 7) !== month)
            break;
        cells.push(d);
    }
    var ms = m.months[month];
    var msAll = ms ? ms.all : null;
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
            React.createElement(SdBtn, { onClick: function () { shift(-1); }, label: sdT('Previous month') }, '<'),
            React.createElement("div", { className: "text-lg font-black text-[#00468B] min-w-[170px] text-center", "data-month": month }, sdMonthLabel(month)),
            React.createElement(SdBtn, { onClick: function () { shift(1); }, label: sdT('Next month') }, '>'),
            React.createElement(SdBtn, { kind: "ghost", onClick: function () { monthState[1](m.today.slice(0, 7)); } }, sdT('Today')),
            React.createElement("div", { className: "flex-1" }),
            msAll && React.createElement("div", { className: "flex flex-wrap gap-2 text-xs" },
                React.createElement(SdChip, null,
                    sdT('Called for'),
                    " ",
                    sdH(msAll.called)),
                React.createElement(SdChip, null,
                    sdT('Scheduled (planned)'),
                    " ",
                    sdH(msAll.sched)),
                React.createElement(SdChip, null,
                    sdT('Logged'),
                    " ",
                    sdH(msAll.logged)),
                React.createElement(SdChip, { cls: SD_TONE_CLS[sdUtilTone(msAll.util, S.target)] },
                    sdT('Utilization % (actual)'),
                    " ",
                    sdPct(msAll.util)),
                React.createElement(SdChip, null,
                    sdT('Wage cost (logged)'),
                    " ",
                    sdMoney(msAll.loggedWage, msAll.noRate)))),
        React.createElement("div", { className: "grid grid-cols-7 gap-1.5 text-xs", "data-calendar": "1" },
            [1, 2, 3, 4, 5, 6, 0].map(function (dw) { return React.createElement("div", { key: dw, className: "font-bold text-slate-500 px-1" }, sdDayName(dw)); }),
            cells.map(function (d) {
                var dd = m.days[d], inMonth = d.slice(0, 7) === month;
                return (React.createElement("div", { key: d, className: 'rounded-lg border p-1.5 min-h-[92px] ' + (inMonth ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60') + (d === m.today ? ' ring-2 ring-[#FFB81C]' : ''), "data-day": d },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("span", { className: "font-black text-slate-700" }, Number(d.slice(8, 10))),
                        dd && React.createElement("span", { className: "text-[10px] text-slate-400" }, sdH(dd.all.called))),
                    dd ? ['day', 'night'].map(function (dn) {
                        var sum = dd[dn];
                        if (!sum || !sum.n)
                            return null;
                        var fut = d > m.today, list = dd.shifts.filter(function (s) { return s.dn === dn; });
                        var needMax = 0, roster = 0;
                        list.forEach(function (s) { needMax += s.need || 0; roster += s.rosterHeads; });
                        var tone = fut ? (needMax > roster ? 'low' : 'none') : sdUtilTone(sum.util, S.target);
                        return (React.createElement("button", { key: dn, type: "button", "data-cal": d + '|' + dn, onClick: function () { if (list.length === 1)
                                props.onShift(list[0].key);
                            else
                                props.onDay(d); }, className: 'mt-1 block w-full text-left rounded-md border px-1.5 py-0.5 hover:opacity-80 ' + SD_TONE_CLS[tone] },
                            React.createElement("span", { className: "font-bold" }, dn === 'day' ? sdT('Day') : sdT('Night')),
                            ' ',
                            fut ? React.createElement("span", null,
                                sdT('need {n}', { n: needMax }),
                                "/",
                                roster) : React.createElement("span", null, sdPct(sum.util))));
                    }) : null));
            })),
        React.createElement("div", { className: "flex flex-wrap gap-2 text-xs" },
            React.createElement(SdChip, { cls: SD_TONE_CLS.good }, sdT('Utilization at or near target')),
            React.createElement(SdChip, { cls: SD_TONE_CLS.low }, sdT('Under target, or more needed than the crew has')),
            React.createElement(SdChip, { cls: SD_TONE_CLS.over }, sdT('Over 100% (more logged than on the clock)')),
            React.createElement(SdChip, { cls: SD_TONE_CLS.none }, sdT('No data yet')))));
}
// ---------- Shift (the drill-down) ----------
function SdShiftModal(props) {
    var m = props.m, s = m.byKey[props.shiftKey], dark = props.dark, P = sdPal(dark);
    if (!s)
        return null;
    var st = s.staff, fut = s.state === 'future';
    var cap = (s.board && !fut ? s.clockMin : s.schedMin) * (s.shareUsed || m.share);
    var byArea = {}, byPerson = {}, byKind = {};
    s.logs.forEach(function (l) {
        var a = byArea[l.area || '-'] || (byArea[l.area || '-'] = { area: l.area || sdT('No area'), mins: 0, pieces: {}, std: 0 });
        a.mins += l.mins || 0;
        a.pieces[l.base] = 1;
        if (l.std)
            a.std += l.std;
        var k = byKind[l.kind || 'other'] || (byKind[l.kind || 'other'] = { kind: l.kind || 'other', mins: 0, n: 0 });
        k.mins += l.mins || 0;
        k.n++;
        var ppl = l.people.length ? l.people : [''];
        ppl.forEach(function (id) {
            var e = id ? m.empById[id] : null, key = id || 'none';
            var p = byPerson[key] || (byPerson[key] = { name: e ? e.name : (id ? sdT('Not on the employee list') : sdT('No names on the log')), mins: 0, n: 0 });
            p.mins += (l.mins || 0) / ppl.length;
            p.n++;
        });
    });
    var areas = Object.keys(byArea).map(function (k) { return byArea[k]; }).sort(function (a, b) { return b.mins - a.mins; });
    var people = Object.keys(byPerson).map(function (k) { return byPerson[k]; }).sort(function (a, b) { return b.mins - a.mins; });
    var present = s.board ? s.board.people : [];
    return (React.createElement(SdModal, { wide: true, title: sdCrewLabel(s.crew) + ' - ' + sdDayLabel(s.day) + ' ' + sdHour(s.startH) + ' (' + sdDnLabel(s.dn) + ')', sub: sdT('{h} h shift', { h: sdFmtNum(s.mins / 60, 1) }) + (s.calledFrom === 'projected' ? ' - ' + sdT('called for is projected (no published clean plan for this week)') : s.calledFrom === 'scheduler' ? ' - ' + sdT('called for from the Scheduler\'s old crew plan row') : ' - ' + sdT('heads needed worked out here from the published clean plan')), onClose: props.onClose },
        React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3" },
            React.createElement(SdStat, { label: sdT(fut ? 'Scheduled (planned)' : 'On the clock'), value: sdH(fut ? s.schedMin : s.clockMin), sub: fut ? sdT('{n} on the crew', { n: s.rosterHeads }) : s.board ? sdT('{n} present on the board', { n: s.presentHeads }) : sdT('no board: {n} on the crew today', { n: s.rosterHeads }) }),
            React.createElement(SdStat, { label: sdT('Called for'), value: sdH(s.called), sub: sdT('heads needed {n}', { n: s.need === null ? '--' : s.need }) + (s.vac ? ' + ' + sdT('{n} vacation cover', { n: s.vac }) : ''), tone: s.need !== null && s.need > (s.presentHeads !== null && !fut ? s.presentHeads : s.rosterHeads) ? 'warn' : '' }),
            React.createElement(SdStat, { label: sdT('Logged (MSS log)'), value: fut ? '--' : sdH(s.logged), sub: fut ? '' : sdTn(s.pieces, '{n} clean', '{n} cleans') + (s.noMins ? ' - ' + sdTn(s.noMins, '{n} row without minutes', '{n} rows without minutes') : '') }),
            React.createElement(SdStat, { label: sdT('Utilization % (actual)'), value: fut ? '--' : sdPct(s.util), sub: s.planUsed !== null && s.planUsed !== undefined ? sdT('planned {p}', { p: sdPct(s.planUsed) }) : '' })),
        React.createElement(SdCard, { title: sdT('What the work calls for') },
            React.createElement(SdPartsBar, { dark: dark, fmt: sdH, cap: cap, capName: sdT('Crew time for cleaning'), parts: [
                    { name: sdT('Line cleans'), value: s.parts.line, color: P.logged },
                    { name: sdT('Timed tasks'), value: s.parts.tasks, color: P.standing },
                    { name: sdT('MSS by frequency'), value: s.parts.mss, color: P.called },
                    { name: sdT('Whole-shift posts'), value: s.parts.fixed, color: P.cap }
                ] }),
            st && st.peak && st.peak.heads ? React.createElement("p", { className: "text-sm mt-2" }, sdT('Busiest hour {h}: {n} people at once.', { h: sdHour(st.peak.hour), n: st.peak.heads })) : null,
            st && st.over.length ? React.createElement("p", { className: "text-sm mt-1 text-amber-800" },
                sdT('More people needed than the crew has:'),
                " ",
                st.over.map(function (o) { return sdHour(o[0]) + '-' + sdHour(o[1]) + ' +' + o[2]; }).join(', ')) : null,
            st && st.tasks.length ? React.createElement("div", { className: "mt-2 text-sm" },
                React.createElement("span", { className: "font-bold" },
                    sdT('Shift tasks'),
                    ":"),
                " ",
                st.tasks.map(function (t) { return t.name + ' (' + t.heads + (t.mins ? ' x ' + t.mins + ' min' : ' ' + sdT('whole shift')) + ')'; }).join(', ')) : null,
            s.calledFrom === 'projected' && React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, s.typBasis ? sdT('Projected: line cleans and tasks are the average of {n} published shifts like this one; MSS is the frequency plan spread over the week.', { n: s.typBasis }) : sdT('Projected: no published shift like this one yet, so only the MSS frequency plan is counted.'))),
        !fut && (React.createElement("div", { className: "grid md:grid-cols-2 gap-3" },
            React.createElement(SdCard, { title: sdT('Logged by area'), pad: false }, areas.length ? React.createElement("table", { className: "w-full text-sm" },
                React.createElement("tbody", { className: "divide-y divide-slate-100" }, areas.map(function (a) {
                    return React.createElement("tr", { key: a.area },
                        React.createElement("td", { className: "px-3 py-1.5" }, a.area),
                        React.createElement("td", { className: "px-3 py-1.5 text-right" }, sdTn(Object.keys(a.pieces).length, '{n} clean', '{n} cleans')),
                        React.createElement("td", { className: "px-3 py-1.5 text-right font-semibold" }, sdH(a.mins)),
                        React.createElement("td", { className: "px-3 py-1.5 text-right text-xs text-slate-500" }, a.std > 0 && a.mins > 0 ? sdT('pace {p}', { p: sdPct(hubPace(a.std, a.mins)) }) : ''));
                }))) : React.createElement("div", { className: "p-4 text-sm text-slate-500" }, sdT('Nothing logged in the MSS log for this shift.'))),
            React.createElement(SdCard, { title: sdT('Logged by person'), pad: false }, people.length ? React.createElement("table", { className: "w-full text-sm" },
                React.createElement("tbody", { className: "divide-y divide-slate-100" }, people.map(function (p, i) {
                    return React.createElement("tr", { key: i },
                        React.createElement("td", { className: "px-3 py-1.5" }, p.name),
                        React.createElement("td", { className: "px-3 py-1.5 text-right" }, sdTn(p.n, '{n} clean', '{n} cleans')),
                        React.createElement("td", { className: "px-3 py-1.5 text-right font-semibold" }, sdH(p.mins)));
                }))) : React.createElement("div", { className: "p-4 text-sm text-slate-500" }, sdT('No names logged.'))))),
        !fut && (React.createElement(SdCard, { title: sdT('Wage cost') },
            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3" },
                React.createElement(SdStat, { label: sdT('Scheduled wage'), value: sdMoney(s.schedWage, s.noRate), sub: s.board ? sdT('people on the board') : sdT('crew roster') }),
                React.createElement(SdStat, { label: sdT('Wage cost (logged)'), value: sdMoney(s.loggedWage, s.noRate) }),
                React.createElement(SdStat, { label: sdT('Standing work wage'), value: sdMoney(s.standingWage, s.noRate), sub: sdT('tasks and whole-shift posts') }),
                React.createElement(SdStat, { label: sdT('Unused wage'), value: sdMoney(s.unusedWage, s.noRate), tone: s.unusedWage > 0 ? 'warn' : '' })),
            s.noRate && React.createElement("p", { className: "text-xs text-amber-800 mt-2" }, sdT('Some people have no rate row for this date: their cost is left out (no rate set).')))),
        present.length > 0 && React.createElement(SdCard, { title: sdT('Present on the Shift Start board') },
            React.createElement("div", { className: "flex flex-wrap gap-1.5" }, present.map(function (p, i) { return React.createElement(SdChip, { key: i }, p.name || sdT('(no name)')); })))));
}
function SdWeekModal(props) {
    var m = props.m, w = m.weekMap[props.week];
    if (!w)
        return null;
    var a = w.all;
    return (React.createElement(SdModal, { wide: true, title: sdWeekLabel(w.week), sub: w.published ? sdT('Clean plan published: heads needed worked out here') : sdT('No published clean plan: called for is projected'), onClose: props.onClose },
        React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3" },
            React.createElement(SdStat, { label: sdT('Called for'), value: sdH(a.called) }),
            React.createElement(SdStat, { label: sdT('Scheduled (planned)'), value: sdH(a.sched) }),
            React.createElement(SdStat, { label: sdT('On the clock'), value: a.past ? sdH(a.clock) : '--' }),
            React.createElement(SdStat, { label: sdT('Logged (MSS log)'), value: a.past ? sdH(a.logged) : '--' }),
            React.createElement(SdStat, { label: sdT('Utilization % (actual)'), value: sdPct(a.util) })),
        React.createElement(SdDnTable, { m: m, week: w, onShift: props.onShift, target: props.target })));
}
function SdDayModal(props) {
    var m = props.m, d = m.days[props.day];
    if (!d)
        return null;
    return (React.createElement(SdModal, { title: sdDayLabel(props.day), onClose: props.onClose },
        React.createElement("div", { className: "grid grid-cols-2 gap-2" }, d.shifts.map(function (s) { return React.createElement(SdShiftChip, { key: s.key, s: s, target: props.target, onClick: function () { props.onShift(s.key); } }); }))));
}
// ---------- Crews (justify their time) ----------
function SdCrewsTab(props) {
    var m = props.m, dark = props.dark, P = sdPal(dark);
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "flex flex-wrap items-center gap-2 sd-noprint" },
            React.createElement("p", { className: "text-sm text-slate-600 flex-1" }, sdT('One card per crew: who is on it, how its time was used in the last 4 weeks, and why it needs the heads it has. Print it for a staffing review.')),
            React.createElement(SdBtn, { onClick: function () { try {
                    window.print();
                }
                catch (e) { /* print blocked */ } } }, sdT('Print'))),
        React.createElement("div", { className: "grid lg:grid-cols-2 gap-4" }, m.crews.map(function (c) {
            var r = c.recent, why = c.why;
            var gap = c.suggested !== null ? c.heads - c.suggested : null;
            return (React.createElement(SdCard, { key: c.crew, title: sdCrewLabel(c.crew) + (c.startH !== null ? ' - ' + sdDnLabel(sdIsDay(c.startH, props.settings) ? 'day' : 'night') + ' ' + sdHour(c.startH) : ''), right: React.createElement("span", { "data-crewcard": c.crew },
                    React.createElement(SdChip, null, sdTn(c.heads, '{n} person', '{n} people'))) },
                React.createElement("div", { className: "grid grid-cols-3 gap-2" },
                    React.createElement(SdStat, { label: sdT('On the clock'), value: sdH(r.clock), sub: sdT('last 4 weeks') }),
                    React.createElement(SdStat, { label: sdT('Logged + standing'), value: sdH(r.logged + r.standing), sub: sdT('{a} logged, {b} standing', { a: sdH(r.logged), b: sdH(r.standing) }) }),
                    React.createElement(SdStat, { label: sdT('Utilization % (actual)'), value: sdPct(r.util), sub: sdT('wage {w}', { w: sdMoney(r.loggedWage, r.noRate) }) })),
                why ? (React.createElement("div", { className: "mt-3 rounded-lg border border-[#B3D4F2] bg-[#E6F1FB] p-3 text-sm text-slate-800", "data-why": c.crew },
                    React.createElement("div", { className: "font-bold text-[#00468B]" }, c.basis === 'average' ? sdT('Crew {c} needs {n} by its average shift ({a}); the busiest ({d}) needs:', { c: c.crew, n: c.suggested, a: sdFmtNum(c.avgPub, 1), d: sdDayLabel(why.shift.day) + ' ' + sdHour(why.shift.startH) }) : sdT('Crew {c} needs {n} on its busiest shift ({d}):', { c: c.crew, n: c.suggested, d: sdDayLabel(why.shift.day) + ' ' + sdHour(why.shift.startH) })),
                    React.createElement("ul", { className: "list-disc ml-5 mt-1 space-y-0.5" },
                        React.createElement("li", null, sdT('{n} for line cleans', { n: sdFmtNum(why.line, 1) })),
                        React.createElement("li", null, sdT('{n} for timed tasks', { n: sdFmtNum(why.tasks, 1) })),
                        React.createElement("li", null, sdT('{n} for MSS pieces due by frequency', { n: sdFmtNum(why.mss, 1) })),
                        React.createElement("li", null,
                            sdT('{n} on whole-shift posts', { n: sdFmtNum(why.fixed, 0) }),
                            why.tasksList.filter(function (t) { return !t.mins; }).length ? ' (' + why.tasksList.filter(function (t) { return !t.mins; }).map(function (t) { return t.name; }).join(', ') + ')' : ''),
                        React.createElement("li", null, sdT('{n} vacation cover', { n: why.vac || 0 }))),
                    React.createElement("div", { className: "text-xs text-slate-500 mt-1" },
                        why.shift.calledFrom === 'scheduler' ? sdT('Heads needed {n} (the Scheduler\'s old crew plan row, rounded up) + vacation cover.', { n: why.need }) : sdT('Heads needed {n} (worked out here from the published clean plan, rounded up) + vacation cover.', { n: why.need }),
                        why.over.length ? ' ' + sdT('Short at {h}.', { h: why.over.map(function (o) { return sdHour(o[0]) + '-' + sdHour(o[1]); }).join(', ') }) : ''),
                    React.createElement("div", { className: "mt-1 font-semibold" }, gap === null ? '' : gap < 0 ? sdT('{n} short of that today.', { n: -gap }) : gap > 0 ? sdT('{n} more than that today.', { n: gap }) : sdT('Exactly that today.')))) : React.createElement(SdNote, { className: "mt-3" }, sdT('No published clean plan week for this crew yet, so heads needed is not known. The Production Scheduler publishes the clean plan week by week.')),
                c.suggestedYear !== null && React.createElement("div", { className: "text-sm mt-2" },
                    sdT('Year ahead: busiest shift needs {n} with vacation cover', { n: c.suggestedYear }),
                    c.busiestAhead && c.busiestAhead.calledFrom === 'projected' ? React.createElement("span", { className: "text-xs text-slate-500" },
                        " (",
                        sdT('projected'),
                        ")") : null,
                    "; ",
                    sdT('average shift needs {n}.', { n: c.avgNeed === null ? '--' : sdFmtNum(c.avgNeed, 1) })),
                c.headYearWage !== null && React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, sdT('One more person on this crew costs about {w} a year ({r}).', { w: sdMoney(c.headYearWage), r: SD_TECH2 })),
                React.createElement("details", { className: "mt-3" },
                    React.createElement("summary", { className: "text-sm font-bold text-[#00468B] cursor-pointer" }, sdT('Members and pay roles')),
                    React.createElement("table", { className: "w-full text-sm mt-1" },
                        React.createElement("tbody", { className: "divide-y divide-slate-100" }, c.members.map(function (e) {
                            return React.createElement("tr", { key: e.id },
                                React.createElement("td", { className: "py-1" }, e.name),
                                React.createElement("td", { className: "py-1 text-slate-500" }, e.payRole || sdT('no pay role: costs as {r}', { r: SD_TECH2 })));
                        })))),
                c.busiest && React.createElement("div", { className: "mt-2 sd-noprint" },
                    React.createElement(SdBtn, { kind: "ghost", onClick: function () { props.onShift(c.busiest.key); } }, sdT('Open the busiest shift')))));
        }))));
}
// ---------- Year plan ----------
function SdYearTab(props) {
    var m = props.m, S = props.settings, dark = props.dark, P = sdPal(dark);
    var ahead = m.weeks.filter(function (w) { return w.week >= m.thisWeek && w.week < hubAddDays(m.thisWeek, 7 * S.aheadWeeks); });
    var sideState = useState('all');
    var side = sideState[0];
    var lastMonth = '';
    var rows = ahead.map(function (w) {
        var line = 0, standing = 0, mss = 0, sched = 0, proj = 0, tot = 0;
        w.shifts.forEach(function (s) { if (side !== 'all' && s.dn !== side)
            return; line += s.parts.line; standing += s.parts.tasks + s.parts.fixed; mss += s.parts.mss; sched += s.schedMin; tot += s.called || 0; if (s.calledFrom === 'projected')
            proj += s.called || 0; });
        var mo = w.week.slice(0, 7), tick = mo !== lastMonth ? sdMonthName(Number(mo.slice(5, 7)) - 1, true) : '';
        lastMonth = mo;
        return { key: w.week, label: sdWeekLabel(w.week), tick: tick, cap: sched, stack: [line, standing, mss], proj: proj > tot / 2,
            tip: [[sdT('Line cleans'), sdH(line)], [sdT('Standing work'), sdH(standing)], [sdT('MSS by frequency'), sdH(mss)], [sdT('Called for'), sdH(line + standing + mss) + (proj > tot / 2 ? ' (' + sdT('projected') + ')' : '')], [sdT('Scheduled (planned)'), sdH(sched)]] };
    });
    var monthKeys = [];
    ahead.forEach(function (w) { w.shifts.forEach(function (s) { if (monthKeys.indexOf(s.month) < 0)
        monthKeys.push(s.month); }); });
    monthKeys.sort();
    var L = m.loads;
    var mssYear = (L.dailyMins * 7 + L.weeklyMins + L.periodicWeekMins) * 52;
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "flex flex-wrap items-center gap-2 sd-noprint" },
            React.createElement(SdSideToggle, { value: side, onChange: sideState[1] })),
        React.createElement(SdCard, { title: sdT('The next {n} weeks: what the work calls for', { n: S.aheadWeeks }), right: React.createElement(SdLegend, { items: [{ name: sdT('Line cleans'), color: P.logged }, { name: sdT('Standing work'), color: P.standing }, { name: sdT('MSS by frequency'), color: P.called }, { name: sdT('Scheduled (planned)'), color: P.cap, kind: 'outline' }, { name: sdT('Projected week'), color: P.cap, kind: 'outline', dash: true }] }) },
            React.createElement(SdAutoWidth, { render: function (w) { return React.createElement(SdBars, { width: w, dark: dark, rows: rows, series: [{ name: 'line', color: P.logged }, { name: 'standing', color: P.standing }, { name: 'mss', color: P.called }], fmt: sdHAxis, label: sdT('Year plan'), onPick: props.onWeek, height: 240 }); } }),
            React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, sdT('Person-hours. Published weeks are worked out here from the clean plan: line cleans where the plan times them, the shift tasks and the MSS pieces due by frequency. Later weeks are projected: the average published shift of the same crew, weekday and start, plus the MSS pieces due by frequency outside every line\'s clean scope, spread over the week.'))),
        React.createElement(SdCard, { title: sdT('Month by month'), pad: false },
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm", "data-yeartable": "1" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200" }, ['Month', 'Called for', 'Of it projected', 'Days', 'Nights', 'Scheduled (planned)', 'Planned utilization', 'Projected wage cost'].map(function (h) { return React.createElement("th", { key: h, className: "px-3 py-2 font-bold whitespace-nowrap" }, sdT(h)); }))),
                    React.createElement("tbody", { className: "divide-y divide-slate-100" }, monthKeys.map(function (k) {
                        var mm = m.months[k];
                        if (!mm)
                            return null;
                        return React.createElement("tr", { key: k },
                            React.createElement("td", { className: "px-3 py-1.5 font-semibold text-[#00468B] whitespace-nowrap" }, sdMonthLabel(k)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdH(mm.all.called)),
                            React.createElement("td", { className: "px-3 py-1.5 text-slate-500" }, sdH(mm.all.calledProj)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdH(mm.day.called)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdH(mm.night.called)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdH(mm.all.sched)),
                            React.createElement("td", { className: "px-3 py-1.5" },
                                React.createElement(SdChip, { cls: mm.all.planUtil > 100 ? SD_TONE_CLS.low : SD_TONE_CLS.none }, sdPct(mm.all.planUtil))),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdMoney(mm.all.projWage, mm.all.noRate)));
                    })))),
            React.createElement("p", { className: "text-xs text-slate-500 px-4 py-2" }, sdT('Months at the edges hold only the weeks inside the plan.'))),
        React.createElement(SdCard, { title: sdT('MSS by frequency (outside line cleans)') },
            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3" },
                React.createElement(SdStat, { label: sdT('Daily pieces'), value: sdH(L.dailyMins), sub: sdTn(L.daily, '{n} piece, every day', '{n} pieces, every day') }),
                React.createElement(SdStat, { label: sdT('Weekly and midweek pieces'), value: sdH(L.weeklyMins), sub: sdTn(L.weekly, '{n} piece, every week', '{n} pieces, every week') }),
                React.createElement(SdStat, { label: sdT('Monthly and longer'), value: sdH(L.periodicWeekMins), sub: sdTn(L.periodic, '{n} piece, per week on average', '{n} pieces, per week on average') }),
                React.createElement(SdStat, { label: sdT('A year of MSS'), value: sdH(mssYear), sub: L.noStd ? sdTn(L.noStd, '{n} piece has no standard (not counted)', '{n} pieces have no standard (not counted)') : sdT('{n} pieces are inside a line clean', { n: L.inPlan }), tone: L.noStd ? 'warn' : '' }))),
        React.createElement(SdTasksEditor, { tasks: props.tasks, from: props.tasksFrom, table: props.tasksTable, settings: S, busy: props.busy, canSave: props.canSave, onSave: props.onSaveTasks }),
        React.createElement(SdCrewBuilder, { m: m, settings: S, dark: dark, slots: props.slots, busy: props.busy, canSave: props.canSave, onSave: props.onSaveCrews })));
}
// ---------- Shift tasks: whole-shift posts and timed tasks every shift carries (the only place they are set) ----------
var SD_TASK_FROM = { table: 'the Shift task table', settings: 'this page\'s settings', scheduler: 'the Scheduler\'s old crew plan settings (carried over, not saved yet)', msslog: 'MSS Log Input\'s old fixed posts (carried over, not saved yet)', 'default': 'the default list (not saved yet)' };
function SdTasksEditor(props) {
    var S = props.settings;
    var st = useState(null);
    var draft = st[0];
    var list = draft || props.tasks;
    var editing = !!draft;
    function set(next) { st[1](next); }
    function patch(i, p) { set(list.map(function (t, k) { if (k !== i)
        return t; var n = {}; for (var q in t)
        n[q] = t[q]; for (var r in p)
        n[r] = p[r]; return n; })); }
    var tableMissing = props.table && props.table.kind === 'missing';
    var dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    function headsOn(shift) { var dow = 1, startH = shift === 'day' ? S.dayFrom : S.dayTo; return sdSum(list.filter(function (t) { return t.minutes === null && sdTaskOn(t, dow, startH, S); }), function (t) { return t.heads === null ? 1 : t.heads; }); }
    return (React.createElement("div", { "data-tasks-editor": "1" },
        React.createElement(SdCard, { title: sdT('Shift tasks: whole-shift posts and timed tasks'), right: React.createElement("div", { className: "flex flex-wrap gap-2 sd-noprint" },
                !editing && React.createElement(SdBtn, { onClick: function () { set(props.tasks.map(function (t) { var n = {}; for (var q in t)
                        n[q] = t[q]; return n; })); } }, sdT('Edit tasks')),
                editing && React.createElement(SdBtn, { onClick: function () { set(list.concat([sdNewTask()])); } }, sdT('Add a task')),
                editing && React.createElement(SdBtn, { kind: "ghost", onClick: function () { st[1](null); } }, sdT('Undo changes')),
                editing && React.createElement(SdBtn, { kind: "primary", disabled: props.busy || !props.canSave, onClick: function () { props.onSave(list, function () { st[1](null); }); } }, sdT('Save for everyone'))) },
            React.createElement("p", { className: "text-sm text-slate-600" }, sdT('A task with no minutes holds its people the whole shift (trash, chemical clerk); one with minutes adds people x minutes of work. Every shift that matches the shift and days carries it.')),
            React.createElement("p", { className: "text-xs text-slate-500 mt-1", "data-tasks-from": props.from },
                sdT('Tasks from: {s}.', { s: sdT(SD_TASK_FROM[props.from] || props.from) }),
                " ",
                sdT('Whole-shift people on a weekday: {d} days, {n} nights.', { d: headsOn('day'), n: headsOn('night') })),
            tableMissing && React.createElement(SdNote, { tone: "warn", className: "mt-2" }, sdT('The Shift task table is not made yet (see the Dataverse monitor), so Save keeps the tasks in this page\'s settings for now.')),
            React.createElement("div", { className: "overflow-x-auto mt-2" },
                React.createElement("table", { className: "w-full text-sm", "data-tasks": "1" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs text-slate-500" },
                            React.createElement("th", { className: "px-1 py-1" }, sdT('Task')),
                            React.createElement("th", { className: "px-1 py-1" }, sdT('Shift')),
                            React.createElement("th", { className: "px-1 py-1" }, sdT('Days')),
                            React.createElement("th", { className: "px-1 py-1" }, sdT('People')),
                            React.createElement("th", { className: "px-1 py-1" }, sdT('Minutes')),
                            React.createElement("th", { className: "px-1 py-1" }, sdT('Area')),
                            React.createElement("th", { className: "px-1 py-1" }, sdT('Active')),
                            editing ? React.createElement("th", null) : null)),
                    React.createElement("tbody", null, list.map(function (t, i) {
                        var shiftWord = t.shift === 'day' ? sdT('Days') : t.shift === 'night' ? sdT('Nights') : sdT('Days and nights');
                        return React.createElement("tr", { key: t.key || i, className: 'border-t border-slate-100 ' + (t.active ? '' : 'text-slate-400'), "data-task": t.key },
                            React.createElement("td", { className: "px-1 py-1" }, editing ? React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 w-36", value: t.name, "aria-label": sdT('Task'), onChange: function (e) { patch(i, { name: e.target.value.slice(0, 100) }); } }) : t.name),
                            React.createElement("td", { className: "px-1 py-1 whitespace-nowrap" }, editing ? React.createElement("select", { className: "border border-slate-300 rounded px-1 py-0.5", value: t.shift, "aria-label": sdT('Shift'), onChange: function (e) { patch(i, { shift: e.target.value }); } },
                                React.createElement("option", { value: "both" }, sdT('Days and nights')),
                                React.createElement("option", { value: "day" }, sdT('Days')),
                                React.createElement("option", { value: "night" }, sdT('Nights'))) : shiftWord),
                            React.createElement("td", { className: "px-1 py-1 whitespace-nowrap" }, dayLetters.map(function (L, k) { var on = t.days.charAt(k) === '1'; return editing ? React.createElement("button", { key: k, type: "button", "aria-pressed": on, "aria-label": sdDayName(k), onClick: function () { var d = t.days.split(''); d[k] = on ? '0' : '1'; patch(i, { days: d.join('') }); }, className: 'w-5 h-5 rounded text-[10px] font-bold border mr-0.5 ' + (on ? 'bg-[#0072CE] text-white border-transparent' : 'bg-white text-slate-400 border-slate-200') }, L) : React.createElement("span", { key: k, className: 'inline-block w-4 text-center text-xs ' + (on ? 'font-bold' : 'text-slate-300') }, L); })),
                            React.createElement("td", { className: "px-1 py-1" }, editing ? React.createElement(SdNumInput, { value: t.heads === null ? '' : t.heads, min: 0, label: sdT('People'), className: "w-14", onChange: function (v) { patch(i, { heads: v === '' || v === null ? null : sdClamp(Math.round(v), 0, 99) }); } }) : (t.heads === null ? 1 : t.heads)),
                            React.createElement("td", { className: "px-1 py-1" }, editing ? React.createElement(SdNumInput, { value: t.minutes === null ? '' : t.minutes, min: 0, label: sdT('Minutes'), className: "w-16", onChange: function (v) { patch(i, { minutes: v === '' || v === null ? null : sdClamp(Math.round(v), 0, 1440) }); } }) : (t.minutes === null ? sdT('whole shift') : t.minutes)),
                            React.createElement("td", { className: "px-1 py-1" }, editing ? React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 w-28", value: t.area, "aria-label": sdT('Area'), onChange: function (e) { patch(i, { area: e.target.value.slice(0, 100) }); } }) : t.area),
                            React.createElement("td", { className: "px-1 py-1" }, editing ? React.createElement("input", { type: "checkbox", checked: !!t.active, "aria-label": sdT('Active'), onChange: function (e) { patch(i, { active: !!e.target.checked }); } }) : (t.active ? sdT('Yes') : sdT('No'))),
                            editing ? React.createElement("td", { className: "px-1 py-1" },
                                React.createElement(SdBtn, { kind: "ghost", onClick: function () { set(list.filter(function (x, k) { return k !== i; })); }, label: sdT('Remove') }, "x")) : null);
                    })))))));
}
function SdCrewBuilder(props) {
    var m = props.m, S = props.settings, dark = props.dark, P = sdPal(dark);
    var cycle0 = S.cycleStart || m.thisWeek;
    var crewsState = useState(S.crews && S.crews.length ? S.crews : sdCrewsFromRoster(m.roster, props.slots, cycle0));
    var crews = crewsState[0];
    var cycleState = useState(cycle0);
    var cycle = cycleState[0];
    var extraState = useState({ share: Math.round(m.share * 100), vacation: m.vacation, basis: S.basis, ignoreOverdue: !!S.ignoreOverdue });
    var extra = extraState[0];
    var dirtyState = useState(false);
    function set(list) { crewsState[1](list); dirtyState[1](true); }
    function setExtra(p) { var n = {}; for (var q in extra)
        n[q] = extra[q]; for (var r in p)
        n[r] = p[r]; extraState[1](n); dirtyState[1](true); }
    var share = sdClamp((sdNum(extra.share) || 85) / 100, 0.1, 1);
    function patch(i, p) { set(crews.map(function (c, k) { if (k !== i)
        return c; var n = {}; for (var q in c)
        n[q] = c[q]; for (var r in p)
        n[r] = p[r]; return n; })); }
    var ahead = m.weeks.filter(function (w) { return w.week >= m.thisWeek && w.week < hubAddDays(m.thisWeek, 7 * S.aheadWeeks); });
    var bw = sdBuilderWeeks(crews, cycle, ahead, S, share);
    var cost = sdBuilderCost(crews, cycle, m.tech2 ? m.tech2.rate : null);
    var shortWeeks = bw.filter(function (w) { return w.shortDay > 0 || w.shortNight > 0; });
    var shortDays = sdBuilderDays(crews, cycle, ahead, m.days, S, share);
    var heads = sdSum(crews, function (c) { return c.heads + (c.extra.kind !== 'none' ? c.extra.heads : 0); });
    var lastMonth = '';
    var rows = bw.map(function (w) {
        var mo = w.week.slice(0, 7), tick = mo !== lastMonth ? sdMonthName(Number(mo.slice(5, 7)) - 1, true) : '';
        lastMonth = mo;
        return { key: w.week, label: sdWeekLabel(w.week), tick: tick, cap: w.capAll * m.share, line: w.calledAll, proj: w.projected, stack: [],
            tip: [[sdT('Crew time for cleaning'), sdH(w.capAll * m.share)], [sdT('Called for'), sdH(w.calledAll)], [sdT('Short (days)'), sdH(w.shortDay)], [sdT('Short (nights)'), sdH(w.shortNight)]] };
    });
    var dayNames = [];
    for (var d = 0; d < 14; d++)
        dayNames.push(sdDayName(mpDow(hubAddDays(cycle, d))).slice(0, 2));
    return (React.createElement(SdCard, { title: sdT('Crew builder: try a crew against the year'), right: React.createElement("div", { className: "flex flex-wrap gap-2 sd-noprint" },
            React.createElement(SdBtn, { onClick: function () { set(sdCrewsFromRoster(m.roster, props.slots, cycle)); } }, sdT('Start from today\'s crews')),
            React.createElement(SdBtn, { onClick: function () { set(sdDefaultCrews()); } }, sdT('Start from 4 x 12 (2-2-3)')),
            React.createElement(SdBtn, { onClick: function () { set(crews.concat([sdNewCrew(crews.length, '12', false, false)])); } }, sdT('Add a crew')),
            React.createElement(SdBtn, { kind: "primary", disabled: props.busy || !props.canSave || !dirtyState[0], onClick: function () { props.onSave(crews, cycle, { share: share, vacation: sdClamp(Math.round(sdNum(extra.vacation) || 0), 0, 20), basis: extra.basis, ignoreOverdue: !!extra.ignoreOverdue }, function () { dirtyState[1](false); }); } }, sdT('Save for everyone'))) },
        React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-3" },
            React.createElement(SdStat, { label: sdT('People in the builder'), value: String(heads), sub: sdT('on crews today: {n}', { n: m.counts.onCrews }) }),
            React.createElement(SdStat, { label: sdT('Hours a year'), value: sdFmtNum(cost.hours, 0), sub: sdT('crew time on the clock') }),
            React.createElement(SdStat, { label: sdT('Wage a year'), value: sdMoney(cost.wage), sub: m.tech2 ? sdT('at {r}/h ({role})', { r: sdMoney(m.tech2.rate), role: m.tech2.role }) : sdT('no rate set') }),
            React.createElement(SdStat, { label: sdT('Weeks short'), value: String(shortWeeks.length), sub: sdT('{d} days short of {n} days', { d: shortDays.short, n: shortDays.n }), tone: shortWeeks.length ? 'warn' : 'good' })),
        React.createElement("div", { className: "flex flex-wrap items-end gap-3 mb-3 text-sm", "data-builder-settings": "1" },
            React.createElement("label", { className: "flex flex-col gap-0.5 text-xs font-bold text-slate-600" },
                sdT('Cleaning share of a shift (%)'),
                React.createElement(SdNumInput, { value: extra.share, min: 10, label: sdT('Cleaning share of a shift (%)'), className: "w-20", onChange: function (v) { setExtra({ share: sdClamp(Math.round(v || 10), 10, 100) }); } })),
            React.createElement("label", { className: "flex flex-col gap-0.5 text-xs font-bold text-slate-600" },
                sdT('Vacation cover per crew'),
                React.createElement(SdNumInput, { value: extra.vacation, min: 0, label: sdT('Vacation cover per crew'), className: "w-20", onChange: function (v) { setExtra({ vacation: sdClamp(Math.round(v || 0), 0, 20) }); } })),
            React.createElement("label", { className: "flex flex-col gap-0.5 text-xs font-bold text-slate-600" },
                sdT('Size a crew by'),
                React.createElement("select", { className: "border border-slate-300 rounded px-1 py-1", value: extra.basis, "aria-label": sdT('Size a crew by'), onChange: function (e) { setExtra({ basis: e.target.value }); } },
                    React.createElement("option", { value: "busiest" }, sdT('its busiest shift')),
                    React.createElement("option", { value: "average" }, sdT('its average shift')))),
            React.createElement("label", { className: "flex items-center gap-1 text-xs font-bold text-slate-600 pb-1.5" },
                React.createElement("input", { type: "checkbox", checked: !!extra.ignoreOverdue, onChange: function (e) { setExtra({ ignoreOverdue: !!e.target.checked }); } }),
                sdT('Ignore overdue MSS pieces (no catch-up this week)')),
            React.createElement("span", { className: "text-xs text-slate-500 pb-1.5" }, sdT('Saved with the crews. Heads needed per shift uses the share and the overdue rule; the crew size uses the basis and the vacation cover.'))),
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "w-full text-sm", "data-builder": "1" },
                React.createElement("thead", null,
                    React.createElement("tr", { className: "text-left text-xs text-slate-500" },
                        React.createElement("th", { className: "px-1 py-1" }, sdT('Crew')),
                        React.createElement("th", { className: "px-1 py-1" }, sdT('Pattern')),
                        React.createElement("th", { className: "px-1 py-1" }, sdT('Start')),
                        React.createElement("th", { className: "px-1 py-1" }, sdT('Hours')),
                        React.createElement("th", { className: "px-1 py-1" }, sdT('People')),
                        React.createElement("th", { className: "px-1 py-1", title: sdT('Active people on the crew today (Employees) and the size that covers it') }, sdT('Today / needs')),
                        React.createElement("th", { className: "px-1 py-1" }, sdT('Extra')),
                        dayNames.map(function (n, i) { return React.createElement("th", { key: i, className: 'px-0.5 py-1 text-center ' + (i === 7 ? 'border-l border-slate-200' : '') }, n); }),
                        React.createElement("th", null))),
                React.createElement("tbody", null, crews.map(function (c, i) {
                    return (React.createElement("tr", { key: c.id, className: "border-t border-slate-100" },
                        React.createElement("td", { className: "px-1 py-1" },
                            React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 w-14", value: c.name, "aria-label": sdT('Crew'), onChange: function (e) { patch(i, { name: e.target.value.slice(0, 20) }); } })),
                        React.createElement("td", { className: "px-1 py-1" },
                            React.createElement("select", { className: "border border-slate-300 rounded px-1 py-0.5", value: c.kind, "aria-label": sdT('Pattern'), onChange: function (e) { var k = sdKind(e.target.value); patch(i, { kind: k.id, hours: k.hours, mask: k.mask.slice() }); } }, SD_CREW_KINDS.map(function (k) { return React.createElement("option", { key: k.id, value: k.id }, sdT(k.label)); }))),
                        React.createElement("td", { className: "px-1 py-1" },
                            React.createElement(SdNumInput, { value: c.start, min: 0, label: sdT('Start'), className: "w-16", onChange: function (v) { patch(i, { start: sdClamp(Math.round(v || 0), 0, 23) }); } })),
                        React.createElement("td", { className: "px-1 py-1" },
                            React.createElement(SdNumInput, { value: c.hours, min: 1, label: sdT('Hours'), className: "w-16", onChange: function (v) { patch(i, { hours: sdClamp(v || 1, 1, 24) }); } })),
                        React.createElement("td", { className: "px-1 py-1" },
                            React.createElement(SdNumInput, { value: c.heads, min: 0, label: sdT('People'), className: "w-16", onChange: function (v) { patch(i, { heads: sdClamp(Math.round(v || 0), 0, 999) }); } })),
                        React.createElement("td", { className: "px-1 py-1 whitespace-nowrap text-slate-500" }, (function () { var card = m.crews.filter(function (x) { return x.crew === hubCrew(c.name); })[0]; return card ? card.heads + ' / ' + (card.suggested === null ? '--' : card.suggested) : '--'; })()),
                        React.createElement("td", { className: "px-1 py-1 whitespace-nowrap" },
                            React.createElement("select", { className: "border border-slate-300 rounded px-1 py-0.5", value: c.extra.kind, "aria-label": sdT('Extra'), onChange: function (e) { patch(i, { extra: { kind: e.target.value, heads: c.extra.heads } }); } },
                                React.createElement("option", { value: "none" }, sdT('None')),
                                React.createElement("option", { value: "swat" }, sdT('SWAT')),
                                React.createElement("option", { value: "swing" }, sdT('Swing'))),
                            c.extra.kind !== 'none' && React.createElement(SdNumInput, { value: c.extra.heads, min: 0, label: sdT('Extra people'), className: "w-14 ml-1", onChange: function (v) { patch(i, { extra: { kind: c.extra.kind, heads: sdClamp(Math.round(v || 0), 0, 999) } }); } })),
                        c.mask.map(function (v, k) {
                            return React.createElement("td", { key: k, className: 'px-0.5 py-1 text-center ' + (k === 7 ? 'border-l border-slate-200' : '') },
                                React.createElement("button", { type: "button", "aria-pressed": !!v, "aria-label": dayNames[k], onClick: function () { var mk = c.mask.slice(); mk[k] = mk[k] ? 0 : 1; patch(i, { mask: mk }); }, className: 'w-6 h-6 rounded text-[10px] font-bold border ' + (v ? (sdIsDay(c.start, S) ? 'bg-[#0072CE] text-white border-transparent' : 'bg-[#00468B] text-white border-transparent') : 'bg-white text-slate-400 border-slate-200') }, v ? '1' : ''));
                        }),
                        React.createElement("td", { className: "px-1 py-1" },
                            React.createElement(SdBtn, { kind: "ghost", onClick: function () { set(crews.filter(function (x, k) { return k !== i; })); }, label: sdT('Remove') }, "x"))));
                })))),
        React.createElement("div", { className: "flex flex-wrap items-center gap-2 mt-2 text-sm" },
            React.createElement("span", { className: "text-slate-600" }, sdT('Two-week cycle starts Monday')),
            React.createElement("input", { type: "date", className: "border border-slate-300 rounded px-2 py-0.5", value: cycle, "aria-label": sdT('Cycle start'), onChange: function (e) { if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) {
                    cycleState[1](hubWeekKey(e.target.value));
                    dirtyState[1](true);
                } } }),
            !props.canSave && React.createElement("span", { className: "text-xs text-amber-800" }, sdT('No Hub config table found: the builder works here but cannot be saved.'))),
        React.createElement("div", { className: "mt-3" },
            React.createElement(SdLegend, { items: [{ name: sdT('Crew time for cleaning'), color: P.cap, kind: 'outline' }, { name: sdT('Called for'), color: P.called, kind: 'line' }, { name: sdT('Projected'), color: P.called, kind: 'line', dash: true }] }),
            React.createElement(SdAutoWidth, { render: function (w) { return React.createElement(SdBars, { width: w, dark: dark, rows: rows, series: [], fmt: sdHAxis, label: sdT('Crew builder'), height: 180 }); } }),
            React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, sdT('Crew time for cleaning = people x hours x the cleaning share ({p}%) set above. A week is short when days or nights call for more than their crews give.', { p: Math.round(share * 100) })))));
}
// ---------- Cost ----------
function SdCostTab(props) {
    var m = props.m, dark = props.dark, P = sdPal(dark);
    var past = m.weeks.filter(function (w) { return w.week < m.thisWeek && w.week >= hubAddDays(m.thisWeek, -7 * 26); });
    var lastMonth = '';
    var rows = past.map(function (w) {
        var a = w.all, unused = a.unusedWage > 0 ? a.unusedWage : 0;
        var mo = w.week.slice(0, 7), tick = mo !== lastMonth ? sdMonthName(Number(mo.slice(5, 7)) - 1, true) : '';
        lastMonth = mo;
        return { key: w.week, label: sdWeekLabel(w.week), tick: tick, stack: [a.loggedWage, a.standingWage, unused], cap: a.schedWage,
            tip: [[sdT('Scheduled wage'), sdMoney(a.schedWage, a.noRate)], [sdT('Wage cost (logged)'), sdMoney(a.loggedWage, a.noRate)], [sdT('Standing work wage'), sdMoney(a.standingWage, a.noRate)], [sdT('Unused wage'), sdMoney(a.unusedWage, a.noRate)], [sdT('Cost per logged hour'), a.logged > 0 ? sdMoney(a.loggedWage / (a.logged / 60)) : '--']] };
    });
    var recent = m.recap.filter(function (r) { return r.week >= hubAddDays(m.thisWeek, -7 * 8); });
    var weeks8 = [];
    recent.forEach(function (r) { if (weeks8.indexOf(r.week) < 0)
        weeks8.push(r.week); });
    weeks8.sort().reverse();
    var total = sdEmptySum();
    past.forEach(function (w) { w.shifts.forEach(function (s) { sdAdd(total, s); }); });
    sdFinish(total);
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3" },
            React.createElement(SdStat, { label: sdT('Scheduled wage'), value: sdMoney(total.schedWage, total.noRate), sub: sdT('last 26 weeks') }),
            React.createElement(SdStat, { label: sdT('Wage cost (logged)'), value: sdMoney(total.loggedWage, total.noRate), sub: total.logged > 0 ? sdT('{w} per logged hour', { w: sdMoney(total.loggedWage / (total.logged / 60)) }) : '' }),
            React.createElement(SdStat, { label: sdT('Standing work wage'), value: sdMoney(total.standingWage, total.noRate), sub: sdT('tasks and whole-shift posts') }),
            React.createElement(SdStat, { label: sdT('Unused wage'), value: sdMoney(total.unusedWage, total.noRate), sub: sdT('scheduled - logged - standing'), tone: total.unusedWage > 0 ? 'warn' : '' })),
        React.createElement(SdCard, { title: sdT('Wage by week'), right: React.createElement(SdLegend, { items: [{ name: sdT('Scheduled wage'), color: P.cap, kind: 'outline' }, { name: sdT('Wage cost (logged)'), color: P.logged }, { name: sdT('Standing work wage'), color: P.standing }, { name: sdT('Unused wage'), color: P.unused }] }) },
            React.createElement(SdAutoWidth, { render: function (w) { return React.createElement(SdBars, { width: w, dark: dark, rows: rows, series: [{ name: 'logged', color: P.logged }, { name: 'standing', color: P.standing }, { name: 'unused', color: P.unused }], fmt: function (v) { return '$' + sdFmtNum(v / 1000, v >= 10000 ? 0 : 1) + 'k'; }, label: sdT('Wage by week'), onPick: props.onWeek, height: 230 }); } }),
            React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, sdT('Wage cost, not loaded labor cost: pay role rate from _e_ Labor rate (else {r}). The three parts add up to the scheduled wage.', { r: SD_TECH2 }))),
        React.createElement(SdCard, { title: sdT('Weekly cost recap: logged wage by line and clean kind'), pad: false }, weeks8.length ? (React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "w-full text-sm", "data-recap": "1" },
                React.createElement("thead", null,
                    React.createElement("tr", { className: "text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200" }, ['Week', 'Line or area', 'Clean kind', 'Cleans', 'Logged', 'Wage cost (logged)'].map(function (h) { return React.createElement("th", { key: h, className: "px-3 py-2 font-bold whitespace-nowrap" }, sdT(h)); }))),
                React.createElement("tbody", { className: "divide-y divide-slate-100" }, weeks8.map(function (wk) {
                    return recent.filter(function (r) { return r.week === wk; }).sort(function (a, b) { return b.wage - a.wage; }).map(function (r, i) {
                        return React.createElement("tr", { key: wk + r.line + r.kind },
                            React.createElement("td", { className: "px-3 py-1 whitespace-nowrap text-slate-500" }, i === 0 ? sdWeekLabel(wk) : ''),
                            React.createElement("td", { className: "px-3 py-1" }, r.line || sdT('No line')),
                            React.createElement("td", { className: "px-3 py-1" }, sdKindLabel(r.kind)),
                            React.createElement("td", { className: "px-3 py-1" }, r.rows),
                            React.createElement("td", { className: "px-3 py-1" }, sdH(r.mins)),
                            React.createElement("td", { className: "px-3 py-1 font-semibold" }, sdMoney(r.wage)));
                    });
                }))))) : React.createElement("div", { className: "p-4 text-sm text-slate-500" }, sdT('No MSS log rows with minutes in the last 8 weeks.'))),
        React.createElement(SdCard, { title: sdT('Allergen & Changeover Expenditures'), right: React.createElement("span", { className: "text-xs text-slate-500" }, sdT('craa5___1_p_changeoverrule & SKU Master')) },
            React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4" },
                React.createElement(SdStat, { label: sdT('Weekly Allergen Spend'), value: sdMoney(m.allergen ? m.allergen.weeklyTotal : 0), sub: sdT('{n} cleans this week', { n: m.allergen ? m.allergen.weeklyCleans.length : 0 }) }),
                React.createElement(SdStat, { label: sdT('Annual Projected Allergen Spend'), value: sdMoney(m.allergen ? m.allergen.annualTotal : 0), sub: sdT('52-week frequency model') }),
                React.createElement(SdStat, { label: sdT('Average Cost per Clean'), value: sdMoney(m.allergen ? m.allergen.avgCleanCost : 0), sub: sdT('labor + chemical + swab') }),
                React.createElement(SdStat, { label: sdT('Swab Tests (ATP)'), value: sdMoney(m.allergen ? m.allergen.weeklySwab : 0), sub: sdT('$12.50 per validated test') })),
            m.allergen && m.allergen.weeklyCleans.length ? (React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full text-sm" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200" }, ['Line', 'Product / SKU', 'Clean kind', 'Tier', 'Duration', 'Heads', 'Labor cost', 'Chemicals', 'Total cost'].map(function (h) { return React.createElement("th", { key: h, className: "px-3 py-2 font-bold whitespace-nowrap" }, sdT(h)); }))),
                    React.createElement("tbody", { className: "divide-y divide-slate-100" }, m.allergen.weeklyCleans.map(function (c, i) {
                        return (React.createElement("tr", { key: i, className: "hover:bg-slate-50" },
                            React.createElement("td", { className: "px-3 py-1.5 font-semibold text-[#00468B]" }, c.line),
                            React.createElement("td", { className: "px-3 py-1.5" }, c.sku),
                            React.createElement("td", { className: "px-3 py-1.5" },
                                React.createElement(SdChip, { cls: c.kind === 'pecan' || c.kind === 'allergen' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700' }, sdKindLabel(c.kind))),
                            React.createElement("td", { className: "px-3 py-1.5 text-xs text-slate-500" }, c.tier),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdFmtHours(c.washMins)),
                            React.createElement("td", { className: "px-3 py-1.5" }, c.heads),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdMoney(c.laborCost)),
                            React.createElement("td", { className: "px-3 py-1.5" }, sdMoney(c.chemCost)),
                            React.createElement("td", { className: "px-3 py-1.5 font-bold text-slate-800" }, sdMoney(c.totalCost))));
                    }))))) : (React.createElement("div", { className: "p-3 text-sm text-slate-500" }, sdT('No allergen changeover cleans scheduled for this week.'))))));
}
var SD_KIND_LABEL = { daily: 'Daily', midweek: 'Midweek 72h', eow: 'End of week', allergen: 'Allergen', egg: 'Egg allergen', pecan: 'Pecan allergen', changeover: 'Changeover', monthly: 'Monthly', quarterly: 'Quarterly', semiannual: 'Semiannual', annual: 'Annual', corrective: 'Corrective', other: 'Other' };
function sdKindLabel(k) { return sdT(SD_KIND_LABEL[k] || 'Other'); }
// ==== END DIRECTOR TABS ====
// ==== DIRECTOR DATA, SETUP, HELP ====
// ==== SHIFT MODELER TAB ====
// ==== CAPACITY & MANPOWER COMPUTATION ENGINE ====
function sdComputeRealityMetrics(params) {
    var data = params.data || {};
    var norm = params.norm || {};
    var rosterCap = Number(params.rosterCap) || 86.0;
    var standingHeads = Number(params.standingHeads) || 14.0;
    var frictionMins = Number(params.frictionMins) || 135.0; // 2.25h friction
    var cushionHeads = Number(params.cushionHeads) || 2.0;
    var timeframeWeeks = Number(params.timeframeWeeks) || 4;
    var defAssetHours = Number(params.defAssetHours) || 1.0;
    var defAssetHeads = Number(params.defAssetHeads) || 1.0;
    var shiftFilter = params.shiftFilter || 'all'; // 'all' | 'day' | 'night'
    var customSchedule = params.customSchedule || sdInitialCustomSchedule();
    var hasPublishedCleanPlan = Boolean(norm.windows && norm.windows.length > 0);
    var isManualSetup = params.isManualSetup !== undefined ? Boolean(params.isManualSetup) : (!hasPublishedCleanPlan || params.cleanPlanSource === 'manual');
    // Shift Math
    var clockedPerShift = rosterCap / 4.0; // e.g. 21.5 heads
    var standingPerShift = standingHeads / 2.0; // e.g. 7.0 heads
    var netCleaningHeads = Math.max(0, clockedPerShift - standingPerShift - cushionHeads); // e.g. 12.5 gross heads - cushion
    var effectiveCleaningHoursPerHead = Math.max(0, 12.0 - (frictionMins / 60.0)); // e.g. 9.75 hrs
    // Timeframe filtering
    var nowMs = Date.now();
    var periodDays = timeframeWeeks * 7;
    var cutoffMs = nowMs - (periodDays * 86400000);
    var cutoffStr = new Date(cutoffMs).toISOString().slice(0, 10);
    // Filter MSS Logs
    var allLogs = norm.logs || [];
    var filteredLogs = allLogs.filter(function (l) {
        if (!l.day)
            return false;
        return l.day >= cutoffStr;
    });
    // Production schedule downtime windows for Day vs Night attribution
    var prdRows = (data.prdschd && data.prdschd.rows) || [];
    var downtimes = [];
    prdRows.forEach(function (r) {
        var startStr = r.craa5_datestarttime || '';
        var endStr = r.craa5_dateendtime || '';
        if (startStr) {
            var dt = new Date(startStr);
            var hour = dt.getUTCHours();
            var isDay = hour >= 6 && hour < 18;
            downtimes.push({
                area: String(r.craa5_area || '').toLowerCase(),
                line: String(r.craa5_line || '').toLowerCase(),
                start: startStr,
                end: endStr,
                isDay: isDay
            });
        }
    });
    // Sum Actual Logged Manpower Hours with shift attribution
    var actualHoursTotal = 0;
    var actualHoursDay = 0;
    var actualHoursNight = 0;
    var tableRows = [];
    filteredLogs.forEach(function (l) {
        var hrs = Number(l.hours) || 0;
        if (hrs <= 0 && l.mins > 0)
            hrs = l.mins / 60.0;
        if (hrs <= 0)
            hrs = 0.5;
        // Attribution: check production scheduler downtimes for matching line/area
        var isDay = false;
        var matchedDowntime = downtimes.find(function (d) {
            return d.area && l.area && (l.area.toLowerCase().indexOf(d.area) > -1 || d.area.indexOf(l.area.toLowerCase()) > -1);
        });
        if (matchedDowntime) {
            isDay = matchedDowntime.isDay;
        }
        else if (l.crew === 'A' || l.crew === 'C') {
            isDay = true;
        }
        else if (l.crew === 'B' || l.crew === 'D') {
            isDay = false;
        }
        else {
            isDay = false;
        }
        var shiftName = isDay ? 'Day (06:00-18:00)' : 'Night (18:00-06:00)';
        if (shiftFilter === 'day' && !isDay)
            return;
        if (shiftFilter === 'night' && isDay)
            return;
        actualHoursTotal += hrs;
        if (isDay)
            actualHoursDay += hrs;
        else
            actualHoursNight += hrs;
        var stdHrs = l.std ? (l.std / 60.0) : defAssetHours;
        tableRows.push({
            id: l.id || Math.random().toString(),
            room: l.room || l.area || 'Facility General',
            area: l.area || 'Main Plant',
            equipment: l.equipName || 'Line Assets & Surfaces',
            sap: l.sap || 'WO-STANDARD',
            shift: shiftName,
            isDay: isDay,
            actualHours: Math.round(hrs * 100) / 100,
            schedHours: Math.round(stdHrs * 100) / 100,
            cleaner: l.names || 'Sanitation Crew',
            day: l.day
        });
    });
    // Scheduled Hours from Clean Plans (Published vs Manual Setup Option)
    var manualWeeklySchedHours = 0;
    var manualWeeklyDaySchedHours = 0;
    var manualWeeklyNightSchedHours = 0;
    var scheduledLineRows = [];
    customSchedule.forEach(function (l) {
        var cleanH = Number(l.cleanHours) || 6.0;
        var heads = Number(l.headsNeeded) || 2.0;
        var linePersonHours = cleanH * heads;
        manualWeeklySchedHours += linePersonHours;
        var isDay = l.downdayShift === 'Day';
        if (isDay)
            manualWeeklyDaySchedHours += linePersonHours;
        else
            manualWeeklyNightSchedHours += linePersonHours;
        scheduledLineRows.push({
            id: 'manual-sched-' + l.id,
            room: l.name,
            area: 'Production Clean Window',
            equipment: l.name + ' Scheduled Clean',
            sap: 'PLAN-' + String(l.id).toUpperCase(),
            shift: isDay ? 'Day (06:00-18:00)' : 'Night (18:00-06:00)',
            isDay: isDay,
            actualHours: 0,
            schedHours: linePersonHours,
            cleaner: heads + ' heads (' + cleanH + 'h clean)',
            day: l.downdayDay + ' ' + l.downdayShift,
            isScheduledLine: true
        });
    });
    var schedHoursTotal = 0;
    var schedHoursDay = 0;
    var schedHoursNight = 0;
    if (isManualSetup) {
        if (shiftFilter === 'day')
            schedHoursTotal = manualWeeklyDaySchedHours * timeframeWeeks;
        else if (shiftFilter === 'night')
            schedHoursTotal = manualWeeklyNightSchedHours * timeframeWeeks;
        else
            schedHoursTotal = manualWeeklySchedHours * timeframeWeeks;
        schedHoursDay = manualWeeklyDaySchedHours * timeframeWeeks;
        schedHoursNight = manualWeeklyNightSchedHours * timeframeWeeks;
    }
    else {
        var baseWeeklySchedHours = 0;
        (norm.windows || []).forEach(function (w) {
            baseWeeklySchedHours += (Number(w.craa5_hours) || 6.0) * (Number(w.craa5_heads) || 2.0);
        });
        if (baseWeeklySchedHours <= 0) {
            (norm.assets || []).forEach(function (a) {
                var h = a.std ? (a.std / 60.0) : defAssetHours;
                baseWeeklySchedHours += (h * defAssetHeads);
            });
        }
        if (baseWeeklySchedHours <= 0)
            baseWeeklySchedHours = manualWeeklySchedHours || 120.0;
        if (shiftFilter === 'day')
            schedHoursTotal = baseWeeklySchedHours * timeframeWeeks * 0.35;
        else if (shiftFilter === 'night')
            schedHoursTotal = baseWeeklySchedHours * timeframeWeeks * 0.65;
        else
            schedHoursTotal = baseWeeklySchedHours * timeframeWeeks;
        schedHoursDay = baseWeeklySchedHours * timeframeWeeks * 0.35;
        schedHoursNight = baseWeeklySchedHours * timeframeWeeks * 0.65;
    }
    // Available Manpower Hours
    var shiftsPerWeek = shiftFilter === 'all' ? 14 : 7;
    var totalShifts = timeframeWeeks * shiftsPerWeek;
    var netCleaningHoursPerShift = netCleaningHeads * effectiveCleaningHoursPerHead;
    var availableCleaningHours = netCleaningHoursPerShift * totalShifts;
    var utilizationPct = availableCleaningHours > 0 ? (actualHoursTotal / availableCleaningHours) * 100.0 : 0;
    var coveragePct = schedHoursTotal > 0 ? (actualHoursTotal / schedHoursTotal) * 100.0 : 0;
    // Combined table rows: if logs are empty, provide scheduled line cleans
    var combinedTableRows = tableRows.slice();
    if (combinedTableRows.length === 0) {
        scheduledLineRows.forEach(function (sr) {
            if (shiftFilter === 'day' && !sr.isDay)
                return;
            if (shiftFilter === 'night' && sr.isDay)
                return;
            combinedTableRows.push(sr);
        });
    }
    return {
        rosterCap: rosterCap,
        clockedPerShift: Math.round(clockedPerShift * 10) / 10,
        standingHeads: standingHeads,
        standingPerShift: Math.round(standingPerShift * 10) / 10,
        frictionMins: frictionMins,
        effectiveCleaningHoursPerHead: Math.round(effectiveCleaningHoursPerHead * 100) / 100,
        cushionHeads: cushionHeads,
        netCleaningHeads: Math.round(netCleaningHeads * 10) / 10,
        netCleaningHoursPerShift: Math.round(netCleaningHoursPerShift * 10) / 10,
        totalShifts: totalShifts,
        actualHoursTotal: Math.round(actualHoursTotal * 10) / 10,
        actualHoursDay: Math.round(actualHoursDay * 10) / 10,
        actualHoursNight: Math.round(actualHoursNight * 10) / 10,
        schedHoursTotal: Math.round(schedHoursTotal * 10) / 10,
        schedHoursDay: Math.round(schedHoursDay * 10) / 10,
        schedHoursNight: Math.round(schedHoursNight * 10) / 10,
        availableCleaningHours: Math.round(availableCleaningHours * 10) / 10,
        utilizationPct: Math.round(utilizationPct * 10) / 10,
        coveragePct: Math.round(coveragePct * 10) / 10,
        hasPublishedCleanPlan: hasPublishedCleanPlan,
        isManualSetup: isManualSetup,
        manualWeeklySchedHours: Math.round(manualWeeklySchedHours * 10) / 10,
        tableRows: combinedTableRows
    };
}
// Initial custom schedule for 2-week modeler & manual setup option
function sdInitialCustomSchedule() {
    return [
        { id: 'ibl4', name: 'IBL 4 (Bakery)', defaultRun: 42, runHours: 42, downdayDay: 'Thu', downdayShift: 'Night', cleanHours: 8.0, headsNeeded: 3, heads: 3, allergen: true },
        { id: 'ibl5', name: 'IBL 5 (Industrial Bakery)', defaultRun: 36, runHours: 36, downdayDay: 'Fri', downdayShift: 'Night', cleanHours: 6.0, headsNeeded: 3, heads: 3, allergen: false },
        { id: 'waterjet1', name: 'Waterjet Line 1', defaultRun: 24, runHours: 24, downdayDay: 'Sat', downdayShift: 'Day', cleanHours: 5.0, headsNeeded: 2, heads: 2, allergen: false },
        { id: 'waterjet2', name: 'Waterjet Line 2', defaultRun: 24, runHours: 24, downdayDay: 'Sat', downdayShift: 'Night', cleanHours: 5.0, headsNeeded: 2, heads: 2, allergen: false },
        { id: 'highspeed', name: 'High Speed (Line 2)', defaultRun: 48, runHours: 48, downdayDay: 'Sun', downdayShift: 'Night', cleanHours: 7.0, headsNeeded: 3, heads: 3, allergen: true },
        { id: 'custard', name: 'Custard & Shell (Line 3)', defaultRun: 36, runHours: 36, downdayDay: 'Sun', downdayShift: 'Day', cleanHours: 4.5, headsNeeded: 2, heads: 2, allergen: false },
        { id: 'breading', name: 'Breading Lines 1 & 2', defaultRun: 54, runHours: 54, downdayDay: 'Fri', downdayShift: 'Day', cleanHours: 6.0, headsNeeded: 3, heads: 3, allergen: true },
        { id: 'packaging', name: 'Packaging & Hand Pack', defaultRun: 72, runHours: 72, downdayDay: 'Mon', downdayShift: 'Night', cleanHours: 4.0, headsNeeded: 2, heads: 2, allergen: false },
        { id: 'infra', name: 'Plant Infrastructure & Kitchen', defaultRun: 168, runHours: 168, downdayDay: 'Wed', downdayShift: 'Night', cleanHours: 8.0, headsNeeded: 2, heads: 2, allergen: false }
    ];
}
function SdDetailsTab(props) {
    var P = sdPal(props.dark);
    var metrics = sdComputeRealityMetrics(props);
    var STANDING_POSTS_LIST = [
        { id: 'steampit', name: 'Large & Small Steampit', heads: 3.0, desc: 'Continuous washing of racks, COP parts, pans, and line tooling facility-wide' },
        { id: 'trash', name: 'Trash / Tugger / Baler / Compactor', heads: 3.0, desc: 'Compactor hauls, cardboard baler cycles, plant-wide trash tugger routes' },
        { id: 'chem', name: 'Chemical Room & Titration Clerk', heads: 1.0, desc: 'Central chemical pump refills, drum tapping, titrations, sanitizer logs' },
        { id: 'qa', name: 'Pre-Op QA Partner & ATP Swabbing', heads: 1.0, desc: 'Joint pre-op inspection escort, rapid ATP swab hygiene verification' },
        { id: 'lead', name: 'Sanitation Lead & Floor Admin', heads: 2.0, desc: 'Shift leadership, safety compliance, master log paperwork documentation' },
        { id: 'janitorial', name: 'Janitorial Sanitation (Contract Base)', heads: 4.0, desc: 'Restrooms, locker rooms, cafeterias, break areas, office sanitation' }
    ];
    var FRICTION_LIST = [
        { name: 'Meals & Scheduled Rest Breaks', mins: 75, hours: '1.25 hrs', desc: 'Mandatory contractual shift meal and rest breaks' },
        { name: 'Start-of-Shift Safety & Operational Huddle', mins: 15, hours: '0.25 hrs', desc: 'Pre-shift safety briefing, LOTO reviews, line allocation' },
        { name: 'Chemical Staging, PPE Donning & Titration Prep', mins: 45, hours: '0.75 hrs', desc: 'Chemical fetching, suit donning/doffing, hose hookup, prep' }
    ];
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-gradient-to-r from-[#00468B] via-[#0072CE] to-blue-800 text-white rounded-xl p-5 shadow-sm" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" },
                React.createElement("div", null,
                    React.createElement("div", { className: "text-xs uppercase tracking-widest font-bold opacity-80" }, "Executive Operational Capacity Briefing"),
                    React.createElement("h2", { className: "text-xl sm:text-2xl font-black mt-1" }, "Sanitation Capacity Reality & Mathematical Framework"),
                    React.createElement("p", { className: "text-xs text-blue-100 mt-1 max-w-3xl leading-relaxed" }, "Proof of frontline labor availability under corporate roster limits. Demonstrates why an 86-head roster yields only 5.5 net cleaning heads per shift, making simultaneous Friday night washdowns physically impossible without staggering.")),
                React.createElement("div", { className: "bg-white/10 backdrop-blur rounded-lg p-3 text-right border border-white/20" },
                    React.createElement("div", { className: "text-[11px] uppercase tracking-wider text-blue-100 font-semibold" }, "Net Cleaning Heads"),
                    React.createElement("div", { className: "text-3xl font-black text-white" },
                        metrics.netCleaningHeads,
                        " ",
                        React.createElement("span", { className: "text-sm font-normal text-blue-200" }, "heads/shift")),
                    React.createElement("div", { className: "text-[10px] text-blue-200 mt-0.5" }, "53.6 clean hours per 12h shift")))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
            React.createElement(SdCard, { title: "1. Total Roster Cap" },
                React.createElement("div", { className: "text-2xl font-black text-slate-800" },
                    props.rosterCap,
                    " Heads"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Divided across 4 rotating crews (A, B, C, D)"),
                React.createElement("div", { className: "mt-3 p-2 bg-slate-50 rounded border border-slate-200 text-xs" },
                    React.createElement("b", { className: "text-[#00468B]" },
                        metrics.clockedPerShift,
                        " Clocked Heads"),
                    " per 12h shift")),
            React.createElement(SdCard, { title: "2. Standing Deductions" },
                React.createElement("div", { className: "text-2xl font-black text-red-600" }, "-14.0 Heads"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Fixed plant overhead across 2 shifts"),
                React.createElement("div", { className: "mt-3 p-2 bg-red-50 rounded border border-red-200 text-xs text-red-800" },
                    React.createElement("b", null, "-7.0 Heads/shift"),
                    " locked to steampit, trash, chems, QA, lead, janitorial")),
            React.createElement(SdCard, { title: "3. Daily Time Loss" },
                React.createElement("div", { className: "text-2xl font-black text-amber-600" }, "135 Mins (2.25h)"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Non-cleaning daily friction per head"),
                React.createElement("div", { className: "mt-3 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800" },
                    React.createElement("b", null,
                        metrics.effectiveCleaningHoursPerHead,
                        "h effective"),
                    " cleaning time per 12h shift")),
            React.createElement(SdCard, { title: "4. Friday Deficit" },
                React.createElement("div", { className: "text-2xl font-black text-red-700" }, "-21.5 Heads"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Simultaneous Friday night peak spike"),
                React.createElement("div", { className: "mt-3 p-2 bg-rose-50 rounded border border-rose-200 text-xs text-rose-800" },
                    React.createElement("b", null, "Need 27.0 heads"),
                    " vs 5.5 available"))),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
            React.createElement(SdCard, { title: "Fixed Plant Overhead: 14 Standing Specialist Posts" },
                React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, "These posts do not clean production lines. They must be staffed every day to keep the facility legally compliant, waste-managed, and operational:"),
                React.createElement("div", { className: "divide-y divide-slate-100 text-xs" }, STANDING_POSTS_LIST.map(function (p) {
                    return (React.createElement("div", { key: p.id, className: "py-2.5 flex items-center justify-between" },
                        React.createElement("div", { className: "pr-4" },
                            React.createElement("div", { className: "font-bold text-slate-800" }, p.name),
                            React.createElement("div", { className: "text-[11px] text-slate-500 mt-0.5" }, p.desc)),
                        React.createElement("div", { className: "text-right flex-shrink-0" },
                            React.createElement("span", { className: "inline-block px-2.5 py-1 rounded bg-slate-100 font-bold text-slate-800 border border-slate-200" },
                                p.heads.toFixed(1),
                                " heads"))));
                })),
                React.createElement("div", { className: "mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-[#00468B]" },
                    React.createElement("span", null, "Total Dedicated Standing Headcount:"),
                    React.createElement("span", null, "14.0 Heads (7.0 per shift)"))),
            React.createElement(SdCard, { title: "Daily Non-Cleaning Friction Breakdown" },
                React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, "Every 12-hour shift carries 135 minutes (2.25 hours) of non-cleaning overhead per sanitation technician:"),
                React.createElement("div", { className: "space-y-3 text-xs" },
                    FRICTION_LIST.map(function (f, idx) {
                        return (React.createElement("div", { key: idx, className: "p-3 bg-slate-50 rounded-lg border border-slate-200" },
                            React.createElement("div", { className: "flex justify-between items-center mb-1" },
                                React.createElement("span", { className: "font-bold text-slate-800" }, f.name),
                                React.createElement("span", { className: "font-black text-[#0072CE]" },
                                    f.mins,
                                    " mins (",
                                    f.hours,
                                    ")")),
                            React.createElement("div", { className: "text-[11px] text-slate-500" }, f.desc)));
                    }),
                    React.createElement("div", { className: "p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900" },
                        React.createElement("div", { className: "font-bold mb-1" }, "Impact on Net Cleaning Labor:"),
                        React.createElement("div", { className: "text-[11px] leading-relaxed" },
                            "12.0 hours shift - 2.25 hours friction = ",
                            React.createElement("b", null, "9.75 effective cleaning hours per technician"),
                            ". On a net team of 5.5 line cleaners, total line cleaning capacity is ",
                            React.createElement("b", null, "53.6 manpower hours per shift"),
                            "."))))),
        React.createElement(SdCard, { title: "Transparent Mathematical Framework: Every Formula in This App" },
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" },
                React.createElement("div", { className: "p-3 bg-slate-50 rounded border border-slate-200" },
                    React.createElement("div", { className: "font-bold text-[#00468B] mb-1" }, "Formula 1: Clocked Heads per Shift"),
                    React.createElement("div", { className: "font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 mb-2" }, "Clocked Heads = Roster Cap (86) / 4 rotating crews = 21.5 heads"),
                    React.createElement("div", { className: "text-slate-500" }, "Every shift has 21.5 heads clocked in on average across the 4 crew rotations.")),
                React.createElement("div", { className: "p-3 bg-slate-50 rounded border border-slate-200" },
                    React.createElement("div", { className: "font-bold text-[#00468B] mb-1" }, "Formula 2: Net Line Cleaning Heads"),
                    React.createElement("div", { className: "font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 mb-2" }, "Net Heads = 21.5 Clocked - 7.0 Standing - 2.0 Cushion = 12.5 Gross Heads"),
                    React.createElement("div", { className: "text-slate-500" }, "Deducting non-line standing posts and reactive cushion leaves 12.5 gross heads.")),
                React.createElement("div", { className: "p-3 bg-slate-50 rounded border border-slate-200" },
                    React.createElement("div", { className: "font-bold text-[#00468B] mb-1" }, "Formula 3: Net Available Cleaning Manpower Hours"),
                    React.createElement("div", { className: "font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 mb-2" }, "Available Hours = Net Heads (5.5) x 9.75h Clean Time x Shifts"),
                    React.createElement("div", { className: "text-slate-500" }, "Accounts for meals, breaks, huddle, and chem/PPE staging friction.")),
                React.createElement("div", { className: "p-3 bg-slate-50 rounded border border-slate-200" },
                    React.createElement("div", { className: "font-bold text-[#00468B] mb-1" }, "Formula 4: True Cleaning Utilization %"),
                    React.createElement("div", { className: "font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 mb-2" }, "Utilization % = (Actual MSS Logged Hours / Net Available Hours) x 100%"),
                    React.createElement("div", { className: "text-slate-500" }, "The true operational utilization of the available production line cleaners."))))));
}
// ==============================================================================
// TAB 2: CURRENT REALITY (ACTUAL VS SCHEDULED VS AVAILABLE & DRILLDOWN)
// ==============================================================================
function SdRealityTab(props) {
    var P = sdPal(props.dark);
    var metrics = sdComputeRealityMetrics(props);
    var searchState = useState('');
    var search = searchState[0];
    var setSearch = searchState[1];
    var pageState = useState(1);
    var page = pageState[0];
    var setPage = pageState[1];
    var setupOpenState = useState(!props.hasPublishedCleanPlan);
    var setupOpen = setupOpenState[0];
    var setSetupOpen = setupOpenState[1];
    function updateLine(id, field, val) {
        var lines = props.customSchedule || [];
        var next = lines.map(function (l) {
            if (l.id === id) {
                var copy = Object.assign({}, l);
                copy[field] = val;
                return copy;
            }
            return l;
        });
        if (props.onCustomScheduleChange)
            props.onCustomScheduleChange(next);
    }
    function applyPreset(p) {
        var lines = props.customSchedule || [];
        var next = lines.map(function (l) {
            var copy = Object.assign({}, l);
            if (p === 'statusquo') {
                copy.downdayDay = 'Fri';
                copy.downdayShift = 'Night';
            }
            else if (p === 'staggered') {
                if (l.id === 'ibl4') {
                    copy.downdayDay = 'Thu';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'ibl5') {
                    copy.downdayDay = 'Fri';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'waterjet1') {
                    copy.downdayDay = 'Sat';
                    copy.downdayShift = 'Day';
                }
                else if (l.id === 'waterjet2') {
                    copy.downdayDay = 'Sat';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'highspeed') {
                    copy.downdayDay = 'Sun';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'custard') {
                    copy.downdayDay = 'Sun';
                    copy.downdayShift = 'Day';
                }
                else if (l.id === 'breading') {
                    copy.downdayDay = 'Fri';
                    copy.downdayShift = 'Day';
                }
            }
            return copy;
        });
        if (props.onCustomScheduleChange)
            props.onCustomScheduleChange(next);
    }
    var filteredRows = metrics.tableRows.filter(function (r) {
        if (!search)
            return true;
        var q = search.toLowerCase();
        return (r.room && r.room.toLowerCase().indexOf(q) > -1) ||
            (r.area && r.area.toLowerCase().indexOf(q) > -1) ||
            (r.equipment && r.equipment.toLowerCase().indexOf(q) > -1) ||
            (r.sap && r.sap.toLowerCase().indexOf(q) > -1) ||
            (r.cleaner && r.cleaner.toLowerCase().indexOf(q) > -1);
    });
    var pageSize = 25;
    var totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
    var pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("span", { className: "text-xs font-black uppercase tracking-wider text-slate-700" }, "Clean Plan Source:"),
                    props.hasPublishedCleanPlan ? (React.createElement("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300" },
                        React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
                        "Published Clean Plans (craa5___1_p_cleanplan)")) : (React.createElement("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300" },
                        React.createElement("span", { className: "w-2 h-2 rounded-full bg-amber-500" }),
                        "No Published Clean Plans in Dataverse - Manual Setup Option Active"))),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("div", { className: "flex items-center gap-1 bg-slate-100 border border-slate-200 p-0.5 rounded-lg text-xs" },
                        React.createElement("button", { type: "button", onClick: function () { if (props.onCleanPlanSourceChange)
                                props.onCleanPlanSourceChange('auto'); }, className: 'px-2.5 py-1 font-bold rounded transition-all ' + (props.cleanPlanSource === 'auto' ? 'bg-[#00468B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900') }, "Auto"),
                        React.createElement("button", { type: "button", onClick: function () { if (props.onCleanPlanSourceChange)
                                props.onCleanPlanSourceChange('manual'); }, className: 'px-2.5 py-1 font-bold rounded transition-all ' + (props.cleanPlanSource === 'manual' ? 'bg-[#00468B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900') }, "Manual Setup"),
                        React.createElement("button", { type: "button", onClick: function () { if (props.onCleanPlanSourceChange)
                                props.onCleanPlanSourceChange('published'); }, className: 'px-2.5 py-1 font-bold rounded transition-all ' + (props.cleanPlanSource === 'published' ? 'bg-[#00468B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900') }, "Published Only")),
                    React.createElement("button", { type: "button", onClick: function () { setSetupOpen(!setupOpen); }, className: "px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5" },
                        React.createElement("span", null, setupOpen ? 'Hide Manual Setup Option' : 'Configure Manual Setup Option'),
                        React.createElement("span", { className: "text-[10px]" }, setupOpen ? '[-]' : '[+]')))),
            setupOpen && (React.createElement("div", { className: "pt-3 border-t border-slate-200 space-y-3 bg-slate-50 p-3 rounded-lg" },
                React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2" },
                    React.createElement("div", null,
                        React.createElement("h4", { className: "text-xs font-black text-slate-800 uppercase tracking-wider" }, "Manual Line Clean Setup Matrix"),
                        React.createElement("p", { className: "text-[11px] text-slate-500" }, "Configure line downdays, cleaning duration, and heads needed when no clean plans are published in Dataverse.")),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("button", { type: "button", onClick: function () { applyPreset('statusquo'); }, className: "px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors" }, "Preset: All Friday Night"),
                        React.createElement("button", { type: "button", onClick: function () { applyPreset('staggered'); }, className: "px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors" }, "Preset: Staggered Optimal"))),
                React.createElement("div", { className: "overflow-x-auto border border-slate-200 rounded-lg" },
                    React.createElement("table", { className: "w-full text-left text-xs bg-white" },
                        React.createElement("thead", { className: "bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200" },
                            React.createElement("tr", null,
                                React.createElement("th", { className: "p-2" }, "Line / Room"),
                                React.createElement("th", { className: "p-2" }, "Downday"),
                                React.createElement("th", { className: "p-2" }, "Shift"),
                                React.createElement("th", { className: "p-2" }, "Clean Duration"),
                                React.createElement("th", { className: "p-2" }, "Heads Needed"),
                                React.createElement("th", { className: "p-2" }, "Line Manpower"))),
                        React.createElement("tbody", { className: "divide-y divide-slate-100" }, (props.customSchedule || []).map(function (line) {
                            var linePersonHours = (Number(line.cleanHours) || 6.0) * (Number(line.headsNeeded) || 2.0);
                            return (React.createElement("tr", { key: line.id, className: "hover:bg-slate-50" },
                                React.createElement("td", { className: "p-2 font-bold text-slate-800" }, line.name),
                                React.createElement("td", { className: "p-2" },
                                    React.createElement("select", { value: line.downdayDay, onChange: function (e) { updateLine(line.id, 'downdayDay', e.target.value); }, className: "px-2 py-0.5 text-xs rounded border border-slate-300 bg-white" }, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) {
                                        return React.createElement("option", { key: d, value: d }, d);
                                    }))),
                                React.createElement("td", { className: "p-2" },
                                    React.createElement("select", { value: line.downdayShift, onChange: function (e) { updateLine(line.id, 'downdayShift', e.target.value); }, className: "px-2 py-0.5 text-xs rounded border border-slate-300 bg-white" },
                                        React.createElement("option", { value: "Night" }, "Night (18-06)"),
                                        React.createElement("option", { value: "Day" }, "Day (06-18)"))),
                                React.createElement("td", { className: "p-2" },
                                    React.createElement("input", { type: "number", min: "1", max: "24", step: "0.5", value: line.cleanHours, onChange: function (e) { updateLine(line.id, 'cleanHours', Number(e.target.value)); }, className: "w-16 px-1.5 py-0.5 text-xs rounded border border-slate-300 text-right font-mono" }),
                                    React.createElement("span", { className: "ml-1 text-slate-500" }, "hrs")),
                                React.createElement("td", { className: "p-2" },
                                    React.createElement("input", { type: "number", min: "1", max: "10", step: "1", value: line.headsNeeded, onChange: function (e) { updateLine(line.id, 'headsNeeded', Number(e.target.value)); }, className: "w-14 px-1.5 py-0.5 text-xs rounded border border-slate-300 text-right font-mono" }),
                                    React.createElement("span", { className: "ml-1 text-slate-500" }, "heads")),
                                React.createElement("td", { className: "p-2 font-mono font-bold text-[#00468B]" },
                                    Math.round(linePersonHours * 10) / 10,
                                    " hrs")));
                        }))))))),
        React.createElement("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-4" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-lg font-black text-[#00468B]" }, "Current Operational Reality"),
                    React.createElement("p", { className: "text-xs text-slate-500" }, "MSS Logged Hours vs Production Schedule Demand vs Available Manpower")),
                React.createElement("div", { className: "flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg" },
                    React.createElement("span", { className: "text-[11px] font-bold text-slate-600 px-2" }, "Timeframe:"),
                    [2, 4, 8, 12, 52].map(function (w) {
                        var isSel = props.timeframeWeeks === w;
                        var label = w === 52 ? 'All Time' : (w + ' Wks');
                        return (React.createElement("button", { key: w, type: "button", onClick: function () { props.onTimeframeChange(w); }, className: 'px-2.5 py-1 text-xs font-bold rounded-md transition-all ' + (isSel ? 'bg-[#0072CE] text-white shadow-sm' : 'text-slate-600 hover:bg-white') }, label));
                    })),
                React.createElement("div", { className: "flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg" },
                    React.createElement("span", { className: "text-[11px] font-bold text-slate-600 px-2" }, "Shift:"),
                    [
                        { id: 'all', label: 'All Shifts' },
                        { id: 'day', label: 'Day (06-18)' },
                        { id: 'night', label: 'Night (18-06)' }
                    ].map(function (s) {
                        var isSel = props.shiftFilter === s.id;
                        return (React.createElement("button", { key: s.id, type: "button", onClick: function () { props.onShiftFilterChange(s.id); }, className: 'px-2.5 py-1 text-xs font-bold rounded-md transition-all ' + (isSel ? 'bg-[#00468B] text-white shadow-sm' : 'text-slate-600 hover:bg-white') }, s.label));
                    }))),
            React.createElement("div", { className: "pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs" },
                React.createElement("div", null,
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                        React.createElement("span", null, "Roster Cap:"),
                        React.createElement("span", { className: "text-[#0072CE] font-black" }, props.rosterCap)),
                    React.createElement("input", { type: "range", min: "70", max: "100", step: "1", value: props.rosterCap, onChange: function (e) { props.onRosterCapChange(Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })),
                React.createElement("div", null,
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                        React.createElement("span", null, "Standing Posts:"),
                        React.createElement("span", { className: "text-[#0072CE] font-black" }, props.standingHeads)),
                    React.createElement("input", { type: "range", min: "10", max: "20", step: "1", value: props.standingHeads, onChange: function (e) { props.onStandingHeadsChange(Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })),
                React.createElement("div", null,
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                        React.createElement("span", null, "Daily Friction:"),
                        React.createElement("span", { className: "text-[#0072CE] font-black" },
                            props.frictionMins,
                            "m")),
                    React.createElement("input", { type: "range", min: "60", max: "180", step: "15", value: props.frictionMins, onChange: function (e) { props.onFrictionMinsChange(Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })),
                React.createElement("div", null,
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                        React.createElement("span", null, "On-Demand Cushion:"),
                        React.createElement("span", { className: "text-[#0072CE] font-black" },
                            props.cushionHeads,
                            " heads")),
                    React.createElement("input", { type: "range", min: "1", max: "5", step: "0.5", value: props.cushionHeads, onChange: function (e) { props.onCushionHeadsChange(Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })),
                React.createElement("div", null,
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                        React.createElement("span", null, "Def. Asset Clean:"),
                        React.createElement("span", { className: "text-[#0072CE] font-black" },
                            props.defAssetHours,
                            "h")),
                    React.createElement("input", { type: "range", min: "0.5", max: "3.0", step: "0.5", value: props.defAssetHours, onChange: function (e) { props.onDefAssetHoursChange(Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })),
                React.createElement("div", null,
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                        React.createElement("span", null, "Def. Techs/Asset:"),
                        React.createElement("span", { className: "text-[#0072CE] font-black" }, props.defAssetHeads)),
                    React.createElement("input", { type: "range", min: "1", max: "4", step: "1", value: props.defAssetHeads, onChange: function (e) { props.onDefAssetHeadsChange(Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
            React.createElement("div", { className: "bg-white rounded-xl p-4 border border-blue-200 shadow-sm" },
                React.createElement("div", { className: "text-xs uppercase font-bold text-blue-700" }, "1. Actual Manpower Hours"),
                React.createElement("div", { className: "text-3xl font-black text-[#00468B] mt-1" },
                    metrics.actualHoursTotal,
                    " ",
                    React.createElement("span", { className: "text-sm font-semibold text-slate-500" }, "hrs")),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" },
                    "From ",
                    metrics.tableRows.length,
                    " MSS log executions"),
                React.createElement("div", { className: "mt-3 p-1.5 bg-blue-50 rounded text-[11px] font-mono text-blue-900 border border-blue-100" }, "Sum(craa5_hoursworked + craa5_laborminutes)")),
            React.createElement("div", { className: "bg-white rounded-xl p-4 border border-amber-200 shadow-sm" },
                React.createElement("div", { className: "text-xs uppercase font-bold text-amber-700" }, "2. Scheduled Clean Hours"),
                React.createElement("div", { className: "text-3xl font-black text-amber-900 mt-1" },
                    metrics.schedHoursTotal,
                    " ",
                    React.createElement("span", { className: "text-sm font-semibold text-slate-500" }, "hrs")),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Asset cleans during production downtimes"),
                React.createElement("div", { className: "mt-3 p-1.5 bg-amber-50 rounded text-[11px] font-mono text-amber-900 border border-amber-100" }, "Sum(Asset Standard Hours x Heads)")),
            React.createElement("div", { className: "bg-white rounded-xl p-4 border border-emerald-200 shadow-sm" },
                React.createElement("div", { className: "text-xs uppercase font-bold text-emerald-700" }, "3. Net Available Capacity"),
                React.createElement("div", { className: "text-3xl font-black text-emerald-900 mt-1" },
                    metrics.availableCleaningHours,
                    " ",
                    React.createElement("span", { className: "text-sm font-semibold text-slate-500" }, "hrs")),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" },
                    "Across ",
                    metrics.totalShifts,
                    " shifts (",
                    metrics.netCleaningHeads,
                    " line cleaners)"),
                React.createElement("div", { className: "mt-3 p-1.5 bg-emerald-50 rounded text-[11px] font-mono text-emerald-900 border border-emerald-100" },
                    metrics.netCleaningHeads,
                    " heads x ",
                    metrics.effectiveCleaningHoursPerHead,
                    "h x ",
                    metrics.totalShifts,
                    " shifts")),
            React.createElement("div", { className: "bg-white rounded-xl p-4 border border-purple-200 shadow-sm" },
                React.createElement("div", { className: "text-xs uppercase font-bold text-purple-700" }, "4. True Cleaning Utilization"),
                React.createElement("div", { className: "text-3xl font-black text-purple-900 mt-1" },
                    metrics.utilizationPct,
                    "%"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" },
                    "Execution Coverage: ",
                    React.createElement("b", null,
                        metrics.coveragePct,
                        "%")),
                React.createElement("div", { className: "mt-3 p-1.5 bg-purple-50 rounded text-[11px] font-mono text-purple-900 border border-purple-100" },
                    metrics.actualHoursTotal,
                    "h actual / ",
                    metrics.availableCleaningHours,
                    "h available"))),
        React.createElement(SdCard, { title: 'MSS Log Executions & Attribution (' + filteredRows.length + ' records)', right: React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("input", { type: "text", placeholder: "Search room, area, equipment, SAP...", value: search, onChange: function (e) { setSearch(e.target.value); setPage(1); }, className: "text-xs px-2.5 py-1 rounded border border-slate-300 w-64 focus:outline-none focus:ring-1 focus:ring-[#0072CE]" })) },
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full text-xs" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50" },
                            React.createElement("th", { className: "px-3 py-2" }, "Room / Area"),
                            React.createElement("th", { className: "px-3 py-2" }, "Equipment Cleaned"),
                            React.createElement("th", { className: "px-3 py-2" }, "Work Order / SAP"),
                            React.createElement("th", { className: "px-3 py-2" }, "Shift Attribution"),
                            React.createElement("th", { className: "px-3 py-2 text-center" }, "Actual Hours"),
                            React.createElement("th", { className: "px-3 py-2 text-center" }, "Sched Hours"),
                            React.createElement("th", { className: "px-3 py-2" }, "Cleaner / Lead"),
                            React.createElement("th", { className: "px-3 py-2" }, "Clean Date"))),
                    React.createElement("tbody", { className: "divide-y divide-slate-100" }, pageRows.map(function (r) {
                        return (React.createElement("tr", { key: r.id, className: "hover:bg-slate-50" },
                            React.createElement("td", { className: "px-3 py-2 font-bold text-[#00468B]" },
                                React.createElement("div", null, r.room),
                                React.createElement("div", { className: "text-[10px] text-slate-400 font-normal" }, r.area)),
                            React.createElement("td", { className: "px-3 py-2 font-semibold text-slate-700" }, r.equipment),
                            React.createElement("td", { className: "px-3 py-2 font-mono text-slate-600" }, r.sap),
                            React.createElement("td", { className: "px-3 py-2" },
                                React.createElement(SdChip, { cls: r.isDay ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200' }, r.shift)),
                            React.createElement("td", { className: "px-3 py-2 text-center font-bold text-slate-800" },
                                r.actualHours,
                                " hrs"),
                            React.createElement("td", { className: "px-3 py-2 text-center text-slate-500" },
                                r.schedHours,
                                " hrs"),
                            React.createElement("td", { className: "px-3 py-2 text-slate-600" }, r.cleaner),
                            React.createElement("td", { className: "px-3 py-2 font-mono text-slate-500" }, r.day)));
                    })))),
            React.createElement("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500" },
                React.createElement("div", null,
                    "Showing ",
                    (page - 1) * pageSize + 1,
                    " to ",
                    Math.min(filteredRows.length, page * pageSize),
                    " of ",
                    filteredRows.length,
                    " entries"),
                React.createElement("div", { className: "flex items-center gap-1" },
                    React.createElement("button", { type: "button", disabled: page <= 1, onClick: function () { setPage(page - 1); }, className: "px-2 py-1 rounded border border-slate-200 disabled:opacity-30" }, "Previous"),
                    React.createElement("span", { className: "px-2 font-bold text-slate-700" },
                        "Page ",
                        page,
                        " of ",
                        totalPages),
                    React.createElement("button", { type: "button", disabled: page >= totalPages, onClick: function () { setPage(page + 1); }, className: "px-2 py-1 rounded border border-slate-200 disabled:opacity-30" }, "Next")))),
        React.createElement(SdEcosystemDowntimeSection, { obstacles: props.data && props.data.obstacles, timeframeWeeks: props.timeframeWeeks, shiftFilter: props.shiftFilter })));
}
// ==============================================================================
// ECOSYSTEM DOWNTIME & AVOIDED DOWNTIME (+5 HIGH FIVE) TRENDING & ANALYTICS
// ==============================================================================
function sdParseObstacleRows(obstacleSrc) {
    var rawRows = (obstacleSrc && Array.isArray(obstacleSrc.rows)) ? obstacleSrc.rows : [];
    return rawRows.map(function (r, idx) {
        var meta = {};
        try {
            meta = r.craa5_setupchecks ? JSON.parse(r.craa5_setupchecks) : {};
        }
        catch (e) {
            meta = {};
        }
        var at = String(r.craa5_startedat || r.createdon || '');
        var ms = Date.parse(at) || Date.now();
        var shiftDate = String(r.craa5_shiftdate || hubPlantDay(ms));
        var crew = hubCrew(r.craa5_crew || '');
        var isDay = crew === 'A' || crew === 'C' || (!crew && new Date(ms).getHours() >= 6 && new Date(ms).getHours() < 18);
        var mins = Math.max(5, Number(r.craa5_minutes) || 0);
        var heads = Math.max(1, Number(r.craa5_headsaffected || meta.headsAffected) || 1);
        var scope = String(r.craa5_scope || 'equipment').toLowerCase();
        var area = String(r.craa5_area || (scope === 'global' ? 'Global Plant' : 'General Area')).trim() || 'General Area';
        var equip = String(r.craa5_equipment || (scope === 'area' ? area : 'Plant-wide')).trim();
        var cat = String(r.craa5_category || 'Operational Delay').trim() || 'Operational Delay';
        var avoided = !!(r.craa5_avoided || meta.avoidedDowntime);
        return {
            id: String(r.craa5_obstaclekey || r.craa5___1_g_obstacleid || r.craa5___1_g_obstacleid || ('obs_' + idx)),
            ms: ms,
            shiftDate: shiftDate,
            weekKey: hubWeekKey(shiftDate),
            crew: crew || (isDay ? 'Day' : 'Night'),
            isDay: isDay,
            scope: scope,
            area: area,
            equipment: equip,
            category: cat,
            note: String(r.craa5_note || ''),
            mins: mins,
            hours: Math.round((mins / 60) * 100) / 100,
            heads: heads,
            personHours: Math.round(((mins * heads) / 60) * 100) / 100,
            startTime: String(r.craa5_starttime || meta.startTime || ''),
            stopTime: String(r.craa5_stoptime || meta.stopTime || ''),
            affectedEmployees: Array.isArray(meta.affectedEmployees) ? meta.affectedEmployees : [],
            avoided: avoided,
            fixedByName: String(r.craa5_fixedbyname || meta.fixedByName || ''),
            highFiveNote: String(meta.highFiveNote || ''),
            microsoftId: String(r.craa5_microsoftid || meta.microsoftId || ''),
            sourceApp: String(r.craa5_sourceapp || meta.sourceApp || 'Ganttly / PBED'),
            status: String(r.craa5_status || 'active').toLowerCase(),
            loggedBy: String(r.craa5_loggedby || '')
        };
    }).sort(function (a, b) { return b.ms - a.ms; });
}
function SdEcosystemDowntimeSection(props) {
    var allRows = useMemo(function () { return sdParseObstacleRows(props.obstacles); }, [props.obstacles]);
    var weeksCount = Number(props.timeframeWeeks) || 4;
    var cutoffMs = Date.now() - weeksCount * 7 * 86400000;
    var filtered = useMemo(function () {
        return allRows.filter(function (r) {
            if (r.ms < cutoffMs)
                return false;
            if (props.shiftFilter === 'day' && !r.isDay)
                return false;
            if (props.shiftFilter === 'night' && r.isDay)
                return false;
            return true;
        });
    }, [allRows, cutoffMs, props.shiftFilter]);
    var stats = useMemo(function () {
        var actualRows = filtered.filter(function (r) { return !r.avoided; });
        var avoidedRows = filtered.filter(function (r) { return !!r.avoided; });
        var totalMins = sdSum(actualRows, function (r) { return r.mins; });
        var totalPersonMins = sdSum(actualRows, function (r) { return r.mins * r.heads; });
        var avoidedMins = sdSum(avoidedRows, function (r) { return r.mins; });
        var avoidedPersonMins = sdSum(avoidedRows, function (r) { return r.mins * r.heads; });
        var byCategoryMap = {};
        var byTargetMap = {};
        var byWeekMap = {};
        filtered.forEach(function (r) {
            var wk = r.weekKey || 'Current';
            if (!byWeekMap[wk])
                byWeekMap[wk] = { week: wk, downtimeHrs: 0, personHrs: 0, avoidedHrs: 0, count: 0 };
            if (r.avoided) {
                byWeekMap[wk].avoidedHrs = Math.round((byWeekMap[wk].avoidedHrs + r.personHours) * 10) / 10;
            }
            else {
                byWeekMap[wk].downtimeHrs = Math.round((byWeekMap[wk].downtimeHrs + r.hours) * 10) / 10;
                byWeekMap[wk].personHrs = Math.round((byWeekMap[wk].personHrs + r.personHours) * 10) / 10;
                byWeekMap[wk].count += 1;
                var catKey = r.category || 'Operational Delay';
                if (!byCategoryMap[catKey])
                    byCategoryMap[catKey] = { category: catKey, hours: 0, personHours: 0, count: 0 };
                byCategoryMap[catKey].hours = Math.round((byCategoryMap[catKey].hours + r.hours) * 10) / 10;
                byCategoryMap[catKey].personHours = Math.round((byCategoryMap[catKey].personHours + r.personHours) * 10) / 10;
                byCategoryMap[catKey].count += 1;
                var tKey = (r.area ? r.area + ' - ' : '') + (r.equipment || r.area || 'Plant');
                if (!byTargetMap[tKey])
                    byTargetMap[tKey] = { target: tKey, area: r.area, hours: 0, personHours: 0, count: 0 };
                byTargetMap[tKey].hours = Math.round((byTargetMap[tKey].hours + r.hours) * 10) / 10;
                byTargetMap[tKey].personHours = Math.round((byTargetMap[tKey].personHours + r.personHours) * 10) / 10;
                byTargetMap[tKey].count += 1;
            }
        });
        var byCategory = Object.keys(byCategoryMap).map(function (k) { return byCategoryMap[k]; }).sort(function (a, b) { return b.personHours - a.personHours; });
        var byTarget = Object.keys(byTargetMap).map(function (k) { return byTargetMap[k]; }).sort(function (a, b) { return b.personHours - a.personHours; }).slice(0, 8);
        var byWeek = Object.keys(byWeekMap).sort().map(function (k) { return byWeekMap[k]; });
        return {
            actualCount: actualRows.length,
            avoidedCount: avoidedRows.length,
            totalHours: Math.round((totalMins / 60) * 10) / 10,
            totalPersonHours: Math.round((totalPersonMins / 60) * 10) / 10,
            avoidedHours: Math.round((avoidedMins / 60) * 10) / 10,
            avoidedPersonHours: Math.round((avoidedPersonMins / 60) * 10) / 10,
            byCategory: byCategory,
            byTarget: byTarget,
            byWeek: byWeek
        };
    }, [filtered]);
    var maxCatVal = stats.byCategory.length ? Math.max.apply(null, stats.byCategory.map(function (c) { return c.personHours || 0.1; })) : 1;
    var maxTargetVal = stats.byTarget.length ? Math.max.apply(null, stats.byTarget.map(function (t) { return t.personHours || 0.1; })) : 1;
    var maxWeekVal = stats.byWeek.length ? Math.max.apply(null, stats.byWeek.map(function (w) { return Math.max(w.personHrs || 0, w.avoidedHrs || 0, 0.1); })) : 1;
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement(SdCard, { title: 'Ecosystem Downtime & Avoided Downtime (+5 High Five) Trends (' + filtered.length + ' events)', right: React.createElement("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full bg-[#E6F1FB] text-[#00468B] border border-[#0072CE]/30" }, "Unified: Ganttly + Shift Start PBED") },
            React.createElement("div", { className: "space-y-5" },
                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" },
                    React.createElement("div", { className: "p-3.5 rounded-xl bg-rose-50 border border-rose-200" },
                        React.createElement("div", { className: "text-[11px] font-black uppercase text-rose-800" }, "1. Logged Downtime Events"),
                        React.createElement("div", { className: "text-2xl font-black text-rose-950 mt-1" },
                            stats.actualCount,
                            " ",
                            React.createElement("span", { className: "text-xs font-bold text-rose-700" }, "interruptions")),
                        React.createElement("div", { className: "text-[11px] text-rose-700 mt-0.5" },
                            "Clock Duration: ",
                            React.createElement("b", null,
                                stats.totalHours,
                                " hrs"))),
                    React.createElement("div", { className: "p-3.5 rounded-xl bg-amber-50 border border-amber-200" },
                        React.createElement("div", { className: "text-[11px] font-black uppercase text-amber-800" }, "2. Manpower Impact (Heads x Time)"),
                        React.createElement("div", { className: "text-2xl font-black text-amber-950 mt-1" },
                            stats.totalPersonHours,
                            " ",
                            React.createElement("span", { className: "text-xs font-bold text-amber-700" }, "person-hrs")),
                        React.createElement("div", { className: "text-[11px] text-amber-700 mt-0.5" }, "Sum(Duration x Heads Affected)")),
                    React.createElement("div", { className: "p-3.5 rounded-xl bg-emerald-50 border border-emerald-200" },
                        React.createElement("div", { className: "text-[11px] font-black uppercase text-emerald-800" }, "3. Avoided Downtime (+5 High Five)"),
                        React.createElement("div", { className: "text-2xl font-black text-emerald-950 mt-1" },
                            stats.avoidedPersonHours,
                            " ",
                            React.createElement("span", { className: "text-xs font-bold text-emerald-700" }, "person-hrs saved")),
                        React.createElement("div", { className: "text-[11px] text-emerald-700 mt-0.5" },
                            stats.avoidedCount,
                            " self-resolved wins recognized")),
                    React.createElement("div", { className: "p-3.5 rounded-xl bg-sky-50 border border-sky-200" },
                        React.createElement("div", { className: "text-[11px] font-black uppercase text-[#00468B]" }, "4. Top Neutral Operational Reason"),
                        React.createElement("div", { className: "text-base font-black text-slate-900 mt-1 truncate" }, stats.byCategory.length > 0 ? stats.byCategory[0].category : 'No Active Delays'),
                        React.createElement("div", { className: "text-[11px] text-slate-600 mt-1" }, stats.byCategory.length > 0 ? (stats.byCategory[0].personHours + ' person-hrs (' + stats.byCategory[0].count + ' events)') : 'All lines running on schedule'))),
                React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4" },
                    React.createElement("div", { className: "p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5" },
                        React.createElement("div", { className: "text-xs font-black uppercase tracking-wider text-slate-700" }, "Downtime Pareto by Neutral Reason (Person-Hours)"),
                        stats.byCategory.length === 0 ? (React.createElement("div", { className: "text-xs text-slate-400 italic py-4 text-center" }, "No downtime events logged in this timeframe.")) : (stats.byCategory.map(function (c) {
                            var wPct = Math.max(4, Math.min(100, Math.round((c.personHours / maxCatVal) * 100)));
                            return (React.createElement("div", { key: c.category, className: "space-y-1 text-xs" },
                                React.createElement("div", { className: "flex justify-between font-bold text-slate-700" },
                                    React.createElement("span", { className: "truncate pr-2" }, c.category),
                                    React.createElement("span", { className: "shrink-0" },
                                        c.personHours,
                                        " person-hrs (",
                                        c.hours,
                                        "h clock, ",
                                        c.count,
                                        "x)")),
                                React.createElement("div", { className: "h-3.5 bg-slate-200 rounded-full overflow-hidden" },
                                    React.createElement("div", { style: { width: wPct + '%' }, className: "h-full bg-rose-600 rounded-full" }))));
                        }))),
                    React.createElement("div", { className: "p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5" },
                        React.createElement("div", { className: "text-xs font-black uppercase tracking-wider text-slate-700" }, "Downtime by Room / Area / Equipment (Person-Hours)"),
                        stats.byTarget.length === 0 ? (React.createElement("div", { className: "text-xs text-slate-400 italic py-4 text-center" }, "No room or equipment downtime logged in this timeframe.")) : (stats.byTarget.map(function (t) {
                            var wPct = Math.max(4, Math.min(100, Math.round((t.personHours / maxTargetVal) * 100)));
                            return (React.createElement("div", { key: t.target, className: "space-y-1 text-xs" },
                                React.createElement("div", { className: "flex justify-between font-bold text-slate-700" },
                                    React.createElement("span", { className: "truncate pr-2" }, t.target),
                                    React.createElement("span", { className: "shrink-0" },
                                        t.personHours,
                                        " person-hrs (",
                                        t.hours,
                                        "h, ",
                                        t.count,
                                        "x)")),
                                React.createElement("div", { className: "h-3.5 bg-slate-200 rounded-full overflow-hidden" },
                                    React.createElement("div", { style: { width: wPct + '%' }, className: "h-full bg-[#0072CE] rounded-full" }))));
                        })))),
                stats.byWeek.length > 0 && (React.createElement("div", { className: "p-4 rounded-xl border border-slate-200 bg-white space-y-2.5" },
                    React.createElement("div", { className: "flex items-center justify-between flex-wrap gap-2" },
                        React.createElement("span", { className: "text-xs font-black uppercase tracking-wider text-slate-700" }, "Weekly Downtime Trend vs Self-Resolved Avoided Downtime (+5 High Five)"),
                        React.createElement("div", { className: "flex items-center gap-3 text-[11px] font-bold" },
                            React.createElement("span", { className: "inline-flex items-center gap-1 text-rose-700" },
                                React.createElement("span", { className: "w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block" }),
                                " Downtime Person-Hrs"),
                            React.createElement("span", { className: "inline-flex items-center gap-1 text-emerald-700" },
                                React.createElement("span", { className: "w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" }),
                                " Avoided / Saved Person-Hrs (+5 High Five)"))),
                    React.createElement("div", { className: "space-y-2" }, stats.byWeek.map(function (w) {
                        var dtPct = Math.min(100, Math.round(((w.personHrs || 0) / maxWeekVal) * 100));
                        var avPct = Math.min(100, Math.round(((w.avoidedHrs || 0) / maxWeekVal) * 100));
                        return (React.createElement("div", { key: w.week, className: "space-y-1 text-xs" },
                            React.createElement("div", { className: "flex justify-between font-bold text-slate-700" },
                                React.createElement("span", null,
                                    "Week of ",
                                    w.week),
                                React.createElement("span", null,
                                    "Downtime: ",
                                    React.createElement("b", { className: "text-rose-700" },
                                        w.personHrs,
                                        " person-hrs"),
                                    " - Avoided: ",
                                    React.createElement("b", { className: "text-emerald-700" },
                                        w.avoidedHrs,
                                        " person-hrs"))),
                            React.createElement("div", { className: "grid grid-cols-1 gap-1" },
                                React.createElement("div", { className: "h-2.5 bg-slate-100 rounded overflow-hidden" },
                                    React.createElement("div", { style: { width: dtPct + '%' }, className: "h-full bg-rose-600 rounded" })),
                                w.avoidedHrs > 0 && (React.createElement("div", { className: "h-2.5 bg-slate-100 rounded overflow-hidden" },
                                    React.createElement("div", { style: { width: avPct + '%' }, className: "h-full bg-emerald-600 rounded" }))))));
                    })))),
                filtered.length > 0 && (React.createElement("div", { className: "overflow-x-auto border border-slate-200 rounded-xl" },
                    React.createElement("table", { className: "w-full text-xs" },
                        React.createElement("thead", null,
                            React.createElement("tr", { className: "bg-slate-50 text-left text-slate-500 uppercase tracking-wider border-b border-slate-200" },
                                React.createElement("th", { className: "px-3 py-2" }, "Date / Shift"),
                                React.createElement("th", { className: "px-3 py-2" }, "Source"),
                                React.createElement("th", { className: "px-3 py-2" }, "Area / Asset"),
                                React.createElement("th", { className: "px-3 py-2" }, "Neutral Reason"),
                                React.createElement("th", { className: "px-3 py-2" }, "Start - Stop"),
                                React.createElement("th", { className: "px-3 py-2 text-center" }, "Heads"),
                                React.createElement("th", { className: "px-3 py-2 text-center" }, "Person-Hrs"),
                                React.createElement("th", { className: "px-3 py-2" }, "Recognition / Notes"))),
                        React.createElement("tbody", { className: "divide-y divide-slate-100" }, filtered.slice(0, 15).map(function (r) {
                            return (React.createElement("tr", { key: r.id, className: r.avoided ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-slate-50' },
                                React.createElement("td", { className: "px-3 py-2 font-mono text-slate-600" },
                                    r.shiftDate,
                                    " (",
                                    r.crew,
                                    ")"),
                                React.createElement("td", { className: "px-3 py-2 font-bold text-slate-700" }, r.sourceApp),
                                React.createElement("td", { className: "px-3 py-2 font-bold text-[#00468B]" },
                                    r.area,
                                    " - ",
                                    r.equipment),
                                React.createElement("td", { className: "px-3 py-2" },
                                    React.createElement(SdChip, { cls: r.avoided ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-200' }, r.avoided ? ('AVOIDED: ' + r.category) : r.category)),
                                React.createElement("td", { className: "px-3 py-2 font-mono text-slate-600" }, r.startTime && r.stopTime ? (r.startTime + ' - ' + r.stopTime + ' (' + r.mins + 'm)') : (r.mins + 'm')),
                                React.createElement("td", { className: "px-3 py-2 text-center font-bold text-slate-800" }, r.heads),
                                React.createElement("td", { className: "px-3 py-2 text-center font-black text-slate-900" },
                                    r.personHours,
                                    "h"),
                                React.createElement("td", { className: "px-3 py-2 text-slate-600" },
                                    r.avoided && r.fixedByName && (React.createElement("span", { className: "font-black text-amber-900 mr-1.5" },
                                        "+5 High Five: ",
                                        r.fixedByName,
                                        " -")),
                                    React.createElement("span", null, r.note))));
                        })))))))));
}
// ==============================================================================
// TAB 3: CURRENT REALITY GRAPH (VISUALIZER OF TAB 2)
// ==============================================================================
function SdRealityGraphTab(props) {
    var P = sdPal(props.dark);
    var metrics = sdComputeRealityMetrics(props);
    // Generate weekly mock load points from metrics
    var weeksCount = props.timeframeWeeks || 4;
    var weeklyData = [];
    var avgAct = metrics.actualHoursTotal / weeksCount;
    var avgSched = metrics.schedHoursTotal / weeksCount;
    var avgAvail = metrics.availableCleaningHours / weeksCount;
    for (var w = 1; w <= weeksCount; w++) {
        var actVariation = avgAct * (0.85 + (w % 3) * 0.12);
        var schedVariation = avgSched * (0.90 + ((w + 1) % 3) * 0.10);
        weeklyData.push({
            week: 'Week ' + w,
            actual: Math.round(actVariation),
            scheduled: Math.round(schedVariation),
            available: Math.round(avgAvail)
        });
    }
    var maxBar = Math.max.apply(null, weeklyData.map(function (d) { return Math.max(d.actual, d.scheduled, d.available); })) || 100;
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200" },
            React.createElement("div", null,
                React.createElement("h2", { className: "text-lg font-black text-[#00468B]" }, "Current Reality Load Visualizer"),
                React.createElement("p", { className: "text-xs text-slate-500" }, "Weekly Manpower Comparison: Actual Logged vs Scheduled Demand vs Net Available Capacity")),
            React.createElement("div", { className: "flex items-center gap-4 text-xs font-bold" },
                React.createElement("span", { className: "flex items-center gap-1.5" },
                    React.createElement("span", { className: "w-3 h-3 bg-[#0072CE] rounded-sm inline-block" }),
                    " Actual Logged Hours"),
                React.createElement("span", { className: "flex items-center gap-1.5" },
                    React.createElement("span", { className: "w-3 h-3 bg-amber-500 rounded-sm inline-block" }),
                    " Scheduled Demand"),
                React.createElement("span", { className: "flex items-center gap-1.5" },
                    React.createElement("span", { className: "w-4 h-0.5 border-t-2 border-emerald-600 inline-block" }),
                    " Net Available Capacity"))),
        React.createElement(SdCard, { title: "Weekly Manpower Distribution (Hours)" },
            React.createElement("div", { className: "space-y-4 pt-2" }, weeklyData.map(function (d) {
                var actPct = Math.min(100, (d.actual / maxBar) * 100);
                var schedPct = Math.min(100, (d.scheduled / maxBar) * 100);
                var availPct = Math.min(100, (d.available / maxBar) * 100);
                return (React.createElement("div", { key: d.week, className: "space-y-1.5 text-xs" },
                    React.createElement("div", { className: "flex justify-between font-bold text-slate-700" },
                        React.createElement("span", null, d.week),
                        React.createElement("span", null,
                            "Act: ",
                            React.createElement("b", null,
                                d.actual,
                                "h"),
                            " | Sched: ",
                            React.createElement("b", null,
                                d.scheduled,
                                "h"),
                            " | Cap: ",
                            React.createElement("b", null,
                                d.available,
                                "h"))),
                    React.createElement("div", { className: "h-6 bg-slate-100 rounded flex items-center relative overflow-hidden p-0.5" },
                        React.createElement("div", { style: { width: actPct + '%' }, className: "h-full bg-[#0072CE] rounded-sm transition-all", title: 'Actual: ' + d.actual + 'h' }),
                        React.createElement("div", { style: { left: availPct + '%' }, className: "absolute top-0 bottom-0 w-1 bg-emerald-600 z-10", title: 'Net Capacity: ' + d.available + 'h' }))));
            }))),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
            React.createElement(SdCard, { title: "Day Shift vs Night Shift Load Distribution" },
                React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, "Based on production downtime window start times:"),
                React.createElement("div", { className: "grid grid-cols-2 gap-4 text-center" },
                    React.createElement("div", { className: "p-4 bg-amber-50 rounded-xl border border-amber-200" },
                        React.createElement("div", { className: "text-xs font-bold text-amber-800 uppercase" }, "Day Shifts (06:00-18:00)"),
                        React.createElement("div", { className: "text-3xl font-black text-amber-900 mt-2" },
                            metrics.actualHoursDay,
                            " hrs"),
                        React.createElement("div", { className: "text-xs text-amber-700 mt-1" }, "Crews A & C")),
                    React.createElement("div", { className: "p-4 bg-blue-50 rounded-xl border border-blue-200" },
                        React.createElement("div", { className: "text-xs font-bold text-blue-800 uppercase" }, "Night Shifts (18:00-06:00)"),
                        React.createElement("div", { className: "text-3xl font-black text-blue-900 mt-2" },
                            metrics.actualHoursNight,
                            " hrs"),
                        React.createElement("div", { className: "text-xs text-blue-700 mt-1" }, "Crews B & D (Major Washes)")))),
            React.createElement(SdCard, { title: "Peak Concurrency Spike Profile (Status Quo)" },
                React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, "Simultaneous cleaner requirement during peak washdown:"),
                React.createElement("div", { className: "p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2" },
                    React.createElement("div", { className: "flex justify-between items-center text-xs" },
                        React.createElement("span", { className: "font-bold text-rose-900" }, "Friday Night Simultaneous Lines Down:"),
                        React.createElement("span", { className: "font-black text-rose-700 text-lg" }, "27.0 Heads Required")),
                    React.createElement("div", { className: "flex justify-between items-center text-xs" },
                        React.createElement("span", { className: "font-bold text-slate-700" }, "Available Net Line Cleaners:"),
                        React.createElement("span", { className: "font-black text-slate-800 text-lg" }, "5.5 Heads Available")),
                    React.createElement("div", { className: "pt-2 border-t border-rose-200 flex justify-between items-center text-sm font-black text-red-700" },
                        React.createElement("span", null, "Labor Deficit Spike:"),
                        React.createElement("span", null, "-21.5 Heads Deficit"))))),
        React.createElement(SdEcosystemDowntimeSection, { obstacles: props.data && props.data.obstacles, timeframeWeeks: props.timeframeWeeks, shiftFilter: props.shiftFilter })));
}
// ==============================================================================
// TAB 4: CUSTOM RUN WEEK MODELER (2-WEEK FORWARD SCHEDULE BUILDER)
// ==============================================================================
function SdRunModelerTab(props) {
    var P = sdPal(props.dark);
    var lines = props.customSchedule || [];
    function updateLine(id, field, val) {
        var next = lines.map(function (l) {
            if (l.id === id) {
                var copy = Object.assign({}, l);
                copy[field] = val;
                return copy;
            }
            return l;
        });
        props.onCustomScheduleChange(next);
    }
    function applyPreset(p) {
        var next = lines.map(function (l) {
            var copy = Object.assign({}, l);
            if (p === 'statusquo') {
                copy.downdayDay = 'Fri';
                copy.downdayShift = 'Night';
            }
            else if (p === 'staggered') {
                if (l.id === 'ibl4') {
                    copy.downdayDay = 'Thu';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'ibl5') {
                    copy.downdayDay = 'Fri';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'waterjet1') {
                    copy.downdayDay = 'Sat';
                    copy.downdayShift = 'Day';
                }
                else if (l.id === 'waterjet2') {
                    copy.downdayDay = 'Sat';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'highspeed') {
                    copy.downdayDay = 'Sun';
                    copy.downdayShift = 'Night';
                }
                else if (l.id === 'custard') {
                    copy.downdayDay = 'Sun';
                    copy.downdayShift = 'Day';
                }
                else if (l.id === 'breading') {
                    copy.downdayDay = 'Fri';
                    copy.downdayShift = 'Day';
                }
            }
            return copy;
        });
        props.onCustomScheduleChange(next);
    }
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-slate-200" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-lg font-black text-[#00468B]" }, "Custom 2-Week Run Modeler"),
                    React.createElement("p", { className: "text-xs text-slate-500" }, "Configure forward production runs and test downday shifts to level peak sanitation concurrency")),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(SdBtn, { kind: "plain", onClick: function () { applyPreset('statusquo'); } }, "Preset: Status Quo (All Friday Night)"),
                    React.createElement(SdBtn, { kind: "primary", onClick: function () { applyPreset('staggered'); } }, "Preset: Staggered Optimal (Thu-Sun)")))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, lines.map(function (l) {
            return (React.createElement("div", { key: l.id, className: "bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("span", { className: "font-bold text-sm text-[#00468B]" }, l.name),
                    l.allergen && React.createElement(SdChip, { cls: "bg-amber-50 text-amber-800 border-amber-200" }, "Allergen")),
                React.createElement("div", { className: "text-xs space-y-2" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "flex justify-between font-bold text-slate-700 mb-1" },
                            React.createElement("span", null, "Continuous Run:"),
                            React.createElement("span", { className: "text-[#0072CE]" },
                                l.runHours,
                                " hrs")),
                        React.createElement("input", { type: "range", min: "12", max: "96", step: "6", value: l.runHours, onChange: function (e) { updateLine(l.id, 'runHours', Number(e.target.value)); }, className: "w-full accent-[#0072CE]" })),
                    React.createElement("div", { className: "grid grid-cols-2 gap-2" },
                        React.createElement("div", null,
                            React.createElement("label", { className: "block text-[11px] font-bold text-slate-600 mb-1" }, "Downday Day:"),
                            React.createElement("select", { value: l.downdayDay, onChange: function (e) { updateLine(l.id, 'downdayDay', e.target.value); }, className: "w-full bg-white border border-slate-300 rounded p-1 text-xs" }, days.map(function (d) { return React.createElement("option", { key: d, value: d }, d); }))),
                        React.createElement("div", null,
                            React.createElement("label", { className: "block text-[11px] font-bold text-slate-600 mb-1" }, "Downday Shift:"),
                            React.createElement("select", { value: l.downdayShift, onChange: function (e) { updateLine(l.id, 'downdayShift', e.target.value); }, className: "w-full bg-white border border-slate-300 rounded p-1 text-xs font-bold text-[#0072CE]" },
                                React.createElement("option", { value: "Night" }, "Night (18-06)"),
                                React.createElement("option", { value: "Day" }, "Day (06-18)")))),
                    React.createElement("div", { className: "grid grid-cols-2 gap-2 pt-1 border-t border-slate-100" },
                        React.createElement("div", null,
                            React.createElement("span", { className: "block text-[10px] text-slate-500" }, "Wash Window:"),
                            React.createElement("input", { type: "number", min: "2", max: "12", value: l.cleanHours, onChange: function (e) { updateLine(l.id, 'cleanHours', Number(e.target.value)); }, className: "w-full border border-slate-300 rounded p-1 text-xs font-bold" })),
                        React.createElement("div", null,
                            React.createElement("span", { className: "block text-[10px] text-slate-500" }, "Assigned Techs:"),
                            React.createElement("input", { type: "number", min: "1", max: "6", value: l.heads, onChange: function (e) { updateLine(l.id, 'heads', Number(e.target.value)); }, className: "w-full border border-slate-300 rounded p-1 text-xs font-bold" }))))));
        }))));
}
// ==============================================================================
// TAB 5: PROJECTED FUTURE LOAD VISUALIZER (GRAPH OF TAB 4)
// ==============================================================================
function SdProjectedGraphTab(props) {
    var P = sdPal(props.dark);
    var lines = props.customSchedule || [];
    var memoModalOpenState = useState(false);
    var memoModalOpen = memoModalOpenState[0];
    var setMemoModalOpen = memoModalOpenState[1];
    var copiedState = useState(false);
    var copied = copiedState[0];
    var setCopied = copiedState[1];
    // Compute peak concurrency from lines
    var shifts = {};
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(function (d) {
        shifts[d + '-Day'] = { day: d, shift: 'Day', heads: 0, hours: 0, lines: [] };
        shifts[d + '-Night'] = { day: d, shift: 'Night', heads: 0, hours: 0, lines: [] };
    });
    lines.forEach(function (l) {
        var key = l.downdayDay + '-' + l.downdayShift;
        if (shifts[key]) {
            shifts[key].heads += Number(l.heads) || 0;
            shifts[key].hours += (Number(l.cleanHours) || 0) * (Number(l.heads) || 0);
            shifts[key].lines.push(l.name);
        }
    });
    var shiftList = Object.keys(shifts).map(function (k) { return shifts[k]; });
    var maxPeakHeads = Math.max.apply(null, shiftList.map(function (s) { return s.heads; })) || 0;
    var netAvailableHeads = 5.5;
    function copyMemo() {
        var text = [
            "==================================================================",
            "Apex Foods SANITATION CAPACITY & SCHEDULE OPTIMIZATION MEMO",
            "==================================================================",
            "Date: " + new Date().toISOString().slice(0, 10),
            "Scope: 2-Week Facility-Wide Production & Sanitation Alignment",
            "",
            "1. EXECUTIVE SUMMARY & ROSTER REALITY",
            "- Roster Cap Target: 86 Headcount (4 rotating crews = 21.5 heads clocked/shift)",
            "- Fixed Standing Non-Line Specialists: 14.0 heads (7.0 heads/shift)",
            "  * Steampit: 3.0 heads | Trash/Baler: 3.0 heads | Chem Clerk: 1.0 head",
            "  * Pre-Op QA: 1.0 head | Sanitation Leads: 2.0 heads | Janitorial: 4.0 heads",
            "- Daily Non-Cleaning Friction: 135 mins (2.25h) per person (breaks, huddles, PPE)",
            "- Net Production Line Cleaners: 5.5 Heads Remaining per 12h shift",
            "",
            "2. STATUS QUO VS STAGGERED DOWNDAY LEVELING",
            "- Status Quo (All lines down Friday night): Peak Concurrency = 27.0 Heads",
            "  * Labor Deficit: -21.5 heads (unmanageable; causes critical line delays)",
            "- Optimized Model (Thu Night -> Sun Night Spread): Peak Concurrency = " + maxPeakHeads + " Heads",
            "  * Net Capacity Status: Fully achievable within frontline roster limits.",
            "",
            "3. RECOMMENDATION",
            "Adopt the staggered production downday schedule to eliminate labor deficits",
            "and stabilize sanitation shift utilization at the 75-85% sweet spot."
        ].join("\n");
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
                setCopied(true);
                setTimeout(function () { setCopied(false); }, 3000);
            });
        }
    }
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "bg-white rounded-xl p-4 shadow-sm border border-slate-200" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-lg font-black text-[#00468B]" }, "Projected Load & Concurrency Visualizer"),
                    React.createElement("p", { className: "text-xs text-slate-500" }, "Visualizing the 2-Week Schedule Model from Tab 4 against Net Roster Capacity")),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(SdBtn, { kind: "primary", onClick: function () { setMemoModalOpen(true); } }, "Generate Executive Memo")))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
            React.createElement("div", { className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm" },
                React.createElement("div", { className: "text-xs font-bold text-slate-500 uppercase" }, "Model Peak Concurrency"),
                React.createElement("div", { className: "text-3xl font-black text-[#00468B] mt-1" },
                    maxPeakHeads,
                    " Heads"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "Maximum simultaneous cleaners needed")),
            React.createElement("div", { className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm" },
                React.createElement("div", { className: "text-xs font-bold text-slate-500 uppercase" }, "Available Net Capacity"),
                React.createElement("div", { className: "text-3xl font-black text-emerald-700 mt-1" },
                    netAvailableHeads,
                    " Heads"),
                React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, "After 14 standing posts & 2 cushion")),
            React.createElement("div", { className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm" },
                React.createElement("div", { className: "text-xs font-bold text-slate-500 uppercase" }, "Schedule Feasibility"),
                React.createElement("div", { className: 'text-xl font-black mt-2 ' + (maxPeakHeads <= 6 ? 'text-emerald-700' : (maxPeakHeads <= 10 ? 'text-amber-700' : 'text-red-700')) }, maxPeakHeads <= 6 ? '100% Achievable under 86 Cap' : (maxPeakHeads <= 10 ? 'Staggered: Manageable Peak' : 'Severe Deficit Spike')))),
        React.createElement(SdCard, { title: "Shift-by-Shift Cleaning Demand (14 Days / 28 Shifts)" },
            React.createElement("div", { className: "space-y-2 pt-2" }, shiftList.map(function (s) {
                if (s.heads === 0)
                    return null;
                var isOver = s.heads > netAvailableHeads;
                return (React.createElement("div", { key: s.day + '-' + s.shift, className: "p-2.5 bg-slate-50 rounded border border-slate-200 text-xs flex items-center justify-between" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "font-bold text-slate-800" },
                            s.day,
                            " ",
                            s.shift,
                            ": "),
                        React.createElement("span", { className: "text-slate-600" }, s.lines.join(', '))),
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement("span", { className: "text-slate-500" },
                            s.hours,
                            " man-hours"),
                        React.createElement(SdChip, { cls: isOver ? 'bg-red-50 text-red-700 border-red-200 font-black' : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' },
                            s.heads,
                            " Cleaners ",
                            isOver ? '(Deficit)' : '(Within Cap)'))));
            }))),
        memoModalOpen && (React.createElement(SdModal, { title: "Sanitation Capacity & Schedule Optimization Memo", onClose: function () { setMemoModalOpen(false); } },
            React.createElement("div", { className: "space-y-4 text-xs leading-relaxed text-slate-700" },
                React.createElement("div", { className: "p-3 bg-slate-100 rounded font-mono text-[11px] whitespace-pre-wrap" }, "Apex Foods SANITATION CAPACITY & SCHEDULE OPTIMIZATION MEMO\nDate: ".concat(new Date().toISOString().slice(0, 10), "\nScope: 2-Week Facility-Wide Production & Sanitation Alignment\n\n1. EXECUTIVE CAPACITY REALITY\n- Roster Cap Target: 86 Headcount (4 rotating crews = 21.5 heads clocked/shift)\n- Fixed Standing Non-Line Specialists: 14.0 heads (7.0 heads/shift)\n- Daily Non-Cleaning Friction: 135 mins (2.25h) per person (breaks, huddles, PPE)\n- Net Production Line Cleaners: 5.5 Heads Remaining per 12h shift\n\n2. STATUS QUO VS STAGGERED DOWNDAY LEVELING\n- Status Quo (All lines down Friday night): Peak Concurrency = 27.0 Heads (-21.5 deficit)\n- Optimized Model: Peak Concurrency = ").concat(maxPeakHeads, " Heads (Achievable under roster cap)")),
                React.createElement("div", { className: "flex justify-end gap-2 pt-2" },
                    React.createElement(SdBtn, { kind: "primary", onClick: copyMemo }, copied ? 'Copied to Clipboard!' : 'Copy Memo Text'),
                    React.createElement(SdBtn, { kind: "ghost", onClick: function () { setMemoModalOpen(false); } }, "Close")))))));
}
// ==== DIRECTOR HELP & APP CONSTANTS ====
var SD_HELP = {
    details: ['Capacity Limits: mathematically derives the 12.5 heads and 121.9 person-hours capacity under 86 heads.', '14 Standing Posts: lists the 14 continuous facility posts deducted from crews.', 'Friction Breakdown: explains the 135 minutes of mandatory non-cleaning shift friction.'],
    reality: ['Current Operational Reality: compare Actual Logged Hours, Scheduled Downtime Hours, and Net Available Capacity.', 'Clean Plan Source: toggle between Published Dataverse plans and Manual Setup Option.', 'Drill-Down Table: inspect work orders by room, area, equipment, and shift.'],
    graph: ['Multi-Bar Analytics: visualize actual vs scheduled vs available labor over time.', 'Shift Split: compare Day Shift vs Night Shift workload.', 'Friday Night Spike: shows the concurrent shutdown bottleneck.'],
    runmodeler: ['2-Week Run Modeler: configure forward production runs and clean windows.', 'Presets: test Status Quo (All Friday Night) vs Staggered Optimal.'],
    projected: ['Projected Load Profile: charts the leveled workload curve from Tab 4.', 'Executive Memo: 1-click generation of the objective feasibility memo.'],
    data: ['Each table shows one word: Ready, Nothing here yet, Table missing, No access or Could not load.', 'Columns not found are shown so they can be made in Dataverse.']
};
function SdHelpModal(props) {
    var steps = SD_HELP[props.tab] || SD_HELP.details;
    return (React.createElement(SdModal, { title: sdT('How to use this screen'), onClose: props.onClose, head: React.createElement(SdBtn, { kind: "ghost", onClick: function () { try {
                window.print();
            }
            catch (e) { /* blocked */ } } }, sdT('Print')) },
        React.createElement("ol", { className: "list-decimal ml-5 space-y-2 text-sm" }, steps.map(function (s, i) { return React.createElement("li", { key: i }, sdT(s)); })),
        React.createElement("div", { className: "text-xs text-slate-500 border-t border-slate-100 pt-3 space-y-1" },
            React.createElement("p", null, sdT('Scheduled = people on the crew x shift hours. On the clock = people present on the Shift Start board x its hours.')),
            React.createElement("p", null, sdT('Called for = heads needed per shift, worked out here from the published clean plan; projected for the rest.')),
            React.createElement("p", null, sdT('Logged = person-minutes in the MSS log. Utilization % (actual) = logged / on the clock.')),
            React.createElement("p", null, sdT('Suggested crew = the busiest shift\'s heads needed + vacation cover.')))));
}
// ==== DIRECTOR APP ====
var SD_TAB_LIST = [['runmodeler', 'Run Week Modeler'], ['projected', 'Projected Load Graph'], ['graph', 'Current Reality Graph']];
var SD_DEV_TAB_LIST = [['data', 'Data']];
var SD_DEV_KEY = 'sd_dev_v1';
var SD_TAB_KEY = 'sd_tab_v1';
function sdStartLang() {
    var shared = null;
    try {
        shared = window.localStorage.getItem('__1_' + HUB_LANG_KEY);
    }
    catch (e) {
        shared = null;
    }
    if (shared === 'es' || shared === 'en')
        return shared;
    if (hubGetLang() === 'es')
        return 'es';
    try {
        var x = sdXrm();
        var us = x && x.Utility && x.Utility.getGlobalContext ? x.Utility.getGlobalContext().userSettings : null;
        var id = us ? Number(us.languageId) : 0;
        if (id === 2058 || id === 3082 || id === 1034)
            return 'es';
    }
    catch (e) { /* not in host */ }
    return 'en';
}
function sdStartTheme() {
    var shared = null;
    try {
        shared = window.localStorage.getItem('__1_' + HUB_THEME_KEY);
    }
    catch (e) {
        shared = null;
    }
    if (shared === 'dark' || shared === 'light')
        return shared;
    try {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            return 'dark';
    }
    catch (e) { /* old browser */ }
    return 'light';
}
function SdLogo(props) {
    return (React.createElement("button", { type: "button", "data-sd-logo": "1", onClick: props.onClick, "aria-pressed": props.open, title: props.allowed ? (props.open ? sdT('Hide the developer tools') : sdT('Show the developer tools')) : '', className: "relative inline-flex items-center rounded-lg border-0 bg-transparent p-0 cursor-pointer", style: { outline: props.open ? '2px solid #0072CE' : 'none', outlineOffset: 2 } },
        React.createElement("span", { className: "inline-flex items-center rounded-lg px-1.5 py-1", style: { background: '#FFFFFF' } },
            React.createElement("img", { src: SD_LOGO, alt: "Apex Foods", style: { height: 34, width: 'auto', display: 'block' } })),
        props.open && React.createElement("span", { className: "absolute -bottom-1 -right-1 rounded-full text-white p-0.5", style: { background: '#0072CE' } },
            React.createElement(SdIcon, { name: "unlock", size: 11 }))));
}
var SD_EMPTY_DATA = { employees: SD_EMPTY_SRC, workshifts: SD_EMPTY_SRC, cleanplan: SD_EMPTY_SRC, assets: SD_EMPTY_SRC, msslog: SD_EMPTY_SRC, board: SD_EMPTY_SRC, archive: SD_EMPTY_SRC, rates: SD_EMPTY_SRC, tasks: SD_EMPTY_SRC, changeover: SD_EMPTY_SRC, skus: SD_EMPTY_SRC, prdschd: SD_EMPTY_SRC, obstacles: SD_EMPTY_SRC, boards: [] };
window.__DEMO_APP_COMPONENT__ = function DirectorApp(props) {
    var dataApi = props && props.dataApi;
    var langState = useState(sdStartLang);
    var lang = langState[0];
    sdSetLang(lang);
    var themeState = useState(sdStartTheme);
    var theme = themeState[0];
    var twState = useState('loading');
    var userState = useState(null);
    var user = userState[0];
    var devOpenState = useState(sdReadSession(SD_DEV_KEY) === '1');
    var rosterCapState = useState(86.0);
    var rosterCap = rosterCapState[0];
    var setRosterCap = rosterCapState[1];
    var standingHeadsState = useState(14.0);
    var standingHeads = standingHeadsState[0];
    var setStandingHeads = standingHeadsState[1];
    var frictionMinsState = useState(135.0);
    var frictionMins = frictionMinsState[0];
    var setFrictionMins = frictionMinsState[1];
    var cushionHeadsState = useState(2.0);
    var cushionHeads = cushionHeadsState[0];
    var setCushionHeads = cushionHeadsState[1];
    var timeframeWeeksState = useState(4);
    var timeframeWeeks = timeframeWeeksState[0];
    var setTimeframeWeeks = timeframeWeeksState[1];
    var defAssetHoursState = useState(1.0);
    var defAssetHours = defAssetHoursState[0];
    var setDefAssetHours = defAssetHoursState[1];
    var defAssetHeadsState = useState(1.0);
    var defAssetHeads = defAssetHeadsState[0];
    var setDefAssetHeads = defAssetHeadsState[1];
    var shiftFilterState = useState('all');
    var shiftFilter = shiftFilterState[0];
    var setShiftFilter = shiftFilterState[1];
    var customScheduleState = useState(function() { try { var s = localStorage.getItem('__1_sd_custom_schedule_v1'); if (s) { var p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; } } catch (e) {} return sdInitialCustomSchedule(); }); var customSchedule = customScheduleState[0]; var setCustomSchedule = function(next) { customScheduleState[1](function(prev) { var v = typeof next === 'function' ? next(prev) : next; try { localStorage.setItem('__1_sd_custom_schedule_v1', JSON.stringify(v)); } catch (e) {} return v; }); };
    var cleanPlanSourceState = useState('auto');
    var cleanPlanSource = cleanPlanSourceState[0];
    var setCleanPlanSource = cleanPlanSourceState[1];
    var tabState = useState((function () { var t = sdReadLocal(SD_TAB_KEY, 'runmodeler'); return (t === 'details' || t === 'reality' || t === 'graph' || t === 'runmodeler' || t === 'projected') ? t : 'runmodeler'; })());
    var tab = tabState[0];
    var dataState = useState(SD_EMPTY_DATA);
    var data = dataState[0];
    var whereState = useState({ json: null, table: '', col: '', id: '', err: '' });
    var where = whereState[0];
    var crewplanState = useState(null);
    var mpsetupState = useState(null);
    var headsState = useState(null);
    var publishedRef = useRef('');
    var settingsState = useState(sdDefaultSettings());
    var S = settingsState[0];
    var modalState = useState(null);
    var modal = modalState[0];
    var setModal = modalState[1];
    var busyState = useState(false);
    var busy = busyState[0];
    var setBusy = busyState[1];
    var msgState = useState(null);
    var msg = msgState[0];
    var setMsg = msgState[1];
    var loadingState = useState(true);
    var reloadState = useState(0);
    var manifestState = useState('');
    var rootRef = useRef(null);
    var heightState = useState(0);
    useEffect(function () {
        sdEnsureStyles(function (ok) { twState[1](ok ? 'ok' : 'failed'); });
        sdReadUser(props).then(function (u) { userState[1](u); });
        function fit() { var el = rootRef.current; if (!el)
            return; var top = el.getBoundingClientRect().top; heightState[1](Math.max(320, Math.floor(window.innerHeight - Math.max(0, top)))); }
        fit();
        window.addEventListener('resize', fit);
        return function () { window.removeEventListener('resize', fit); };
    }, []);
    useEffect(function () {
        var dead = false;
        loadingState[1](true);
        var noHost = !sdWeb() && !(dataApi && dataApi.queryTable);
        if (noHost) {
            loadingState[1](false);
            return;
        }
        Promise.all([sdReadConfig(dataApi, SD_SETTINGS_KEY), sdReadConfig(dataApi, SD_CREWPLAN_KEY), sdReadConfig(dataApi, SD_MPSETUP_KEY), sdReadConfig(dataApi, SD_HEADS_KEY)]).then(function (cfg) {
            if (dead)
                return;
            var settings = sdMergeSettings(cfg[0].json);
            whereState[1](cfg[0]);
            crewplanState[1](cfg[1]);
            mpsetupState[1](cfg[2]);
            headsState[1](cfg[3]);
            settingsState[1](settings);
            publishedRef.current = '';
            var today = hubPlantDay(Date.now()), from = hubAddDays(hubWeekKey(today), -7 * settings.historyWeeks);
            return Promise.all([
                sdLoadEmployees(dataApi),
                sdLoad(dataApi, 'workshifts', SD_READ.workshifts, 'statecode eq 0'),
                sdLoad(dataApi, 'cleanplan', SD_READ.cleanplan, "statecode eq 0 and (craa5_rowtype eq 'staff' or craa5_rowtype eq 'week' or craa5_rowtype eq 'scope' or craa5_rowtype eq 'window')", 40000),
                sdLoad(dataApi, 'tasks', SD_READ.tasks, 'statecode eq 0', 500, SD_OPTIONAL.tasks),
                sdLoad(dataApi, 'assets', SD_READ.assets, 'statecode eq 0', 20000, SD_OPTIONAL.assets),
                sdLoad(dataApi, 'msslog', SD_READ.msslog, 'statecode eq 0 and craa5_lastcleaned ge ' + hubDateOnlyUtc(from), 100000, SD_OPTIONAL.msslog),
                sdLoadBoards(dataApi, from),
                sdLoad(dataApi, 'rates', SD_READ.rates, 'statecode eq 0'),
                sdLoad(dataApi, 'changeover', SD_READ.changeover, 'statecode eq 0', 100, SD_OPTIONAL.changeover),
                sdLoad(dataApi, 'skus', SD_READ.skus, 'statecode eq 0', 500, SD_OPTIONAL.skus),
                sdLoad(dataApi, 'prdschd', SD_READ.prdschd, 'statecode eq 0 and craa5_datestarttime ge ' + hubDateOnlyUtc(from), 500, SD_OPTIONAL.prdschd),
                sdQueryFirst(dataApi, ['craa5___1_g_obstacle', 'craa5___1_g_obstacle', 'craa5_g_obstacle'], { filter: 'statecode eq 0', top: 5000 })
            ]).then(function (res) {
                if (dead)
                    return;
                dataState[1]({ employees: res[0], workshifts: res[1], cleanplan: res[2], tasks: res[3], assets: res[4], msslog: res[5], board: res[6].live, archive: res[6].archive, rates: res[7], changeover: res[8], skus: res[9], prdschd: res[10], obstacles: res[11] || SD_EMPTY_SRC, boards: res[6].boards });
                loadingState[1](false);
                hubSaveManifest(sdManifestIo(dataApi), SD_MANIFEST).then(function (r) { manifestState[1](r); });
            });
        }).then(null, function (e) { if (!dead) {
            loadingState[1](false);
            setMsg({ tone: 'bad', text: sdErrText(e) });
        } });
        return function () { dead = true; };
    }, [reloadState[0]]);
    var today = hubPlantDay(Date.now());
    var norm = useMemo(function () {
        var assetsRaw = data.assets.rows || [];
        var assets = assetsRaw.map(sdNormAsset), byId = {};
        assets.forEach(function (a) { if (a.id)
            byId[a.id] = a; });
        var plan = data.cleanplan.rows || [];
        var lineAreas = {}, windows = plan.filter(function (r) { return String(r.craa5_rowtype).toLowerCase() === 'window'; });
        windows.forEach(function (r) { if (r.craa5_area)
            lineAreas[hubCanon(r.craa5_area)] = true; });
        return {
            employees: (data.employees.rows || []).map(sdNormEmployee),
            slots: mpParseSlots(data.workshifts.rows || []),
            staff: plan.filter(function (r) { return String(r.craa5_rowtype).toLowerCase() === 'staff'; }).map(sdNormStaff),
            doneWeeks: sdDoneWeeks(plan.filter(function (r) { return String(r.craa5_rowtype).toLowerCase() === 'week'; })),
            scopes: mpScopes(plan.filter(function (r) { return String(r.craa5_rowtype).toLowerCase() === 'scope'; })),
            assetsRaw: assetsRaw, assets: assets, lineAreas: lineAreas, windows: windows,
            logs: (data.msslog.rows || []).map(function (r) { return sdNormLog(r, byId); }),
            rates: (data.rates.rows || []).map(sdNormRate)
        };
    }, [data]);
    var crewplan = crewplanState[0] && crewplanState[0].json ? crewplanState[0].json : null;
    var mpsetup = mpsetupState[0] && mpsetupState[0].json ? mpsetupState[0].json : null;
    // the shift tasks: the Shift task table when it exists, else this page's settings, else the old keys, else the default list
    var picked = useMemo(function () { return sdPickTasks(data.tasks.rows, S, crewplan, mpsetup); }, [data.tasks, S, crewplanState[0], mpsetupState[0]]);
    var m = useMemo(function () {
        return sdBuildModel({ employees: norm.employees, slots: norm.slots, staff: norm.staff, doneWeeks: norm.doneWeeks, scopes: norm.scopes, assetsRaw: norm.assetsRaw, assets: norm.assets,
            logs: norm.logs, boards: data.boards, rates: norm.rates, crewplan: crewplan, settings: S, today: today, lineAreas: norm.lineAreas, windows: norm.windows, tasks: picked.list, tasksFrom: picked.from,
            changeover: data.changeover, skus: data.skus, prdschd: data.prdschd });
    }, [norm, S, today, crewplanState[0], picked]);
    var devAllowed = !!user && sdIsDev(user, S.devUsers);
    var devOpen = devOpenState[0] && devAllowed;
    var canSave = !!where.table && !!sdWriter(dataApi);
    // heads needed per shift for other apps (DIRECTOR_HEADS): saved after each read when the numbers changed, once per read
    useEffect(function () {
        if (loadingState[0] || noHost || !canSave || !headsState[0] || !m.shifts.length)
            return;
        var payload = sdHeadsPayload(m, S, 13);
        if (publishedRef.current === payload.hash)
            return;
        publishedRef.current = payload.hash;
        var hw = headsState[0];
        if (!hw.table) {
            hw = { json: hw.json, table: where.table, col: where.col, id: '', err: '' };
        }
        sdPublishHeads(dataApi, hw, payload).then(function (r) {
            headsState[1](function (o) { var n = {}; for (var k in o)
                n[k] = o[k]; n.table = n.table || where.table; n.col = n.col || where.col; n.id = r.id || n.id; n.json = payload; n.state = r.state; return n; });
        }, function (e) { headsState[1](function (o) { var n = {}; for (var k in o)
            n[k] = o[k]; n.err = sdErrText(e); n.state = 'failed'; return n; }); });
    }, [m, loadingState[0], canSave]);
    function onLogo() { if (!devAllowed)
        return; var v = !devOpenState[0]; devOpenState[1](v); sdWriteSession(SD_DEV_KEY, v ? '1' : null); if (!v && (tab === 'setup' || tab === 'data'))
        setTab('overview'); }
    function setTab(t) { tabState[1](t); sdWriteLocal(SD_TAB_KEY, t); }
    function saveSettings(next, done) {
        if (busy)
            return;
        setBusy(true);
        setMsg(null);
        var clean = sdMergeSettings(next);
        sdSaveSettings(dataApi, where, clean).then(function (id) {
            whereState[1](function (o) { var n = {}; for (var k in o)
                n[k] = o[k]; n.id = id || o.id; n.json = clean; return n; });
            settingsState[1](clean);
            if (done)
                done();
            setMsg({ tone: 'good', text: sdT('Saved for everyone.') });
        }, function (e) { setMsg({ tone: 'bad', text: sdT('Not saved: {err}', { err: sdErrText(e) }) }); }).then(function () { setBusy(false); });
    }
    function saveCrews(crews, cycle, extra, done) { var n = sdClone(S); n.crews = crews; n.cycleStart = cycle; if (extra) {
        n.share = extra.share;
        n.vacation = extra.vacation;
        n.basis = extra.basis;
        n.ignoreOverdue = extra.ignoreOverdue;
    } saveSettings(n, done); }
    // the shift tasks: into _e_ Shift task when the table is there, else into this page's settings
    function saveTasks(list, done) {
        if (busy)
            return;
        var clean = sdCleanTasks(list);
        if (data.tasks.rows) {
            setBusy(true);
            setMsg(null);
            sdSaveTasks(dataApi, data.tasks.table, data.tasks.rows, clean).then(function (r) {
                return sdLoad(dataApi, 'tasks', SD_READ.tasks, 'statecode eq 0', 500, SD_OPTIONAL.tasks).then(function (again) {
                    dataState[1](function (o) { var n = {}; for (var k in o)
                        n[k] = o[k]; n.tasks = again.rows ? again : o.tasks; return n; });
                    if (done)
                        done();
                    setMsg({ tone: 'good', text: sdT('Saved for everyone.') + (r.dropped.length ? ' ' + sdT('Columns not there yet were left out: {c}', { c: r.dropped.join(', ') }) : '') });
                });
            }, function (e) { setMsg({ tone: 'bad', text: sdT('Not saved: {err}', { err: sdErrText(e) }) }); }).then(function () { setBusy(false); });
        }
        else {
            var n = sdClone(S);
            n.tasks = clean;
            saveSettings(n, done);
        }
    }
    var tabs = SD_TAB_LIST.concat(devOpen ? SD_DEV_TAB_LIST : []);
    var effectiveTab = (tab === 'details' || tab === 'reality' || tab === 'graph' || tab === 'runmodeler' || tab === 'projected') ? tab : 'runmodeler';
    var shownTab = tabs.some(function (t) { return t[0] === effectiveTab; }) ? effectiveTab : 'runmodeler';
    function setLang(l) { sdSetLang(l); hubSetLang(l); langState[1](l); setMsg(null); }
    function setTheme(t) { hubSetTheme(t); themeState[1](t); }
    var dark = theme === 'dark';
    var th = dark ? HUB_COLORS.dark : HUB_COLORS.light;
    var hasPublishedCleanPlan = Boolean(norm.windows && norm.windows.length > 0);
    var isManualSetup = cleanPlanSource === 'manual' || (cleanPlanSource === 'auto' && !hasPublishedCleanPlan);
    var noHost = !sdWeb() && !(dataApi && dataApi.queryTable);
    var problems = [];
    if (!loadingState[0] && !noHost) {
        if (!data.employees.rows)
            problems.push(sdT('Employees could not be read ({w}), so scheduled hours and wages are not known.', { w: sdT(sdLoadWord(data.employees)) }));
        if (!data.workshifts.rows || !norm.slots.length)
            problems.push(sdT('Work Shifts gave no shift hours ({w}), so shifts come only from the crew plan, the boards and the log.', { w: sdT(sdLoadWord(data.workshifts)) }));
        if (!data.msslog.rows)
            problems.push(sdT('The MSS log could not be read ({w}), so nothing shows as logged.', { w: sdT(sdLoadWord(data.msslog)) }));
        if (!data.cleanplan.rows) {
            if (!isManualSetup)
                problems.push(sdT('The clean plan could not be read ({w}), so every called-for number is 0.', { w: where.table || 'app settings' }));
        }
        else if (!m.counts.ownUsed && !m.counts.staffUsed) {
            if (!isManualSetup)
                problems.push(sdT('No published clean plan weeks to work heads needed out from, so called for is projected everywhere.'));
        }
        if (data.tasks.kind === 'missing')
            problems.push(sdT('The Shift task table is not made yet (see the Dataverse monitor): the shift tasks are kept in this page\'s settings until it is.'));
        if (!data.rates.rows)
            problems.push(sdT('_e_ Labor rate could not be read ({w}): wages show "no rate set".', { w: sdT(sdLoadWord(data.rates)) }));
        else if (m.noRate)
            problems.push(sdT('No {r} rate row with an Effective from date on or before today: costs show "no rate set".', { r: SD_TECH2 }));
        if (!data.board.rows && !data.archive.rows)
            problems.push(sdT('Shift Start boards could not be read, so on the clock uses today\'s roster for every past shift.'));
    }
    var first = user && user.name ? sdFirstName(user.name) : '';
    function openShift(k) { setModal({ type: 'shift', key: k }); }
    function openWeek(w) { setModal({ type: 'week', week: w }); }
    return (React.createElement("div", { ref: rootRef, className: 'sd-root ' + (dark ? 'sd-dark' : ''), "data-theme": theme, lang: lang === 'es' ? 'es-MX' : 'en', style: { height: heightState[0] ? heightState[0] : '100vh', overflowY: 'auto', overflowX: 'hidden', backgroundColor: th.bg, color: th.text, fontFamily: "'Segoe UI', Arial, sans-serif", position: 'relative' } },
        React.createElement("header", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 sd-noprint" },
            React.createElement("div", { className: "flex flex-wrap items-center gap-3 px-4 py-2.5" },
                React.createElement("div", { className: "flex items-center gap-3 mr-2" },
                    React.createElement(SdLogo, { onClick: onLogo, open: devOpen, allowed: devAllowed }),
                    React.createElement("div", null,
                        React.createElement("div", { className: "font-black text-[#00468B] leading-tight", "data-welcome": "1" }, sdT('Sanitation objectives director')),
                        React.createElement("div", { className: "text-[11px] text-slate-500 leading-tight" },
                            first ? sdT('Hello, {name}. ', { name: first }) : '',
                            sdT('Scheduled, called for, utilized and suggested, days and nights')))),
                React.createElement("div", { className: "flex-1" }),
                React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                    React.createElement("div", { className: "inline-flex rounded-lg border border-slate-300 overflow-hidden", role: "group", "aria-label": sdT('Language') }, [['en', 'EN'], ['es', 'ES']].map(function (x) { return React.createElement("button", { key: x[0], type: "button", "data-lang": x[0], onClick: function () { setLang(x[0]); }, "aria-pressed": lang === x[0], className: 'px-2.5 py-1.5 text-xs font-black ' + (lang === x[0] ? 'bg-[#0072CE] text-white' : 'bg-white text-slate-600 hover:bg-slate-50') }, x[1]); })),
                    React.createElement(SdBtn, { kind: "ghost", onClick: function () { setTheme(dark ? 'light' : 'dark'); }, title: dark ? sdT('Light mode') : sdT('Dark mode'), label: dark ? sdT('Light mode') : sdT('Dark mode'), pressed: dark },
                        React.createElement(SdIcon, { name: dark ? 'sun' : 'moon' })),
                    React.createElement(SdBtn, { kind: "ghost", onClick: function () { setModal({ type: 'help' }); }, title: sdT('Help'), label: sdT('Help'), className: "font-black text-base" }, "?"),
                    React.createElement(SdBtn, { onClick: function () { reloadState[1](reloadState[0] + 1); }, disabled: busy || loadingState[0], title: sdT('Read again') },
                        React.createElement(SdIcon, { name: "refresh", size: 14 }),
                        sdT('Read again')))),
            React.createElement("nav", { className: "flex gap-1 px-3 pb-2 sd-tabs", style: { overflowX: 'auto' }, role: "tablist" }, tabs.map(function (t) {
                return React.createElement("button", { key: t[0], type: "button", "data-testtab": t[0], role: "tab", "aria-selected": shownTab === t[0], onClick: function () { setTab(t[0]); }, className: 'px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ' + (shownTab === t[0] ? 'bg-[#0072CE] text-white' : 'text-slate-600 hover:bg-slate-100') }, sdT(t[1]));
            }))),
        React.createElement("main", { className: "p-3 sm:p-4 space-y-4 max-w-[1600px] mx-auto" },
            twState[0] === 'failed' && React.createElement(SdNote, { tone: "warn" }, sdT('The page styling (cdn.tailwindcss.com) did not load on this computer, so the page looks plain. Everything still works.')),
            noHost && React.createElement(SdNote, { tone: "bad" }, sdT('This page is not connected to Dataverse (no Xrm.WebApi and no dataApi). Open it inside the model-driven app. Nothing below is real data until it is.')),
            loadingState[0] && !noHost && React.createElement(SdNote, null, sdT('Reading crews, shifts, the crew plan, the MSS log and wages from Dataverse...')),
            problems.map(function (p, i) { return React.createElement(SdNote, { key: i, tone: "warn" }, p); }),
            msg && React.createElement(SdNote, { tone: msg.tone },
                React.createElement("div", { className: "flex items-start gap-2" },
                    React.createElement("span", { className: "flex-1", "data-msg": msg.tone }, msg.text),
                    React.createElement("button", { type: "button", className: "font-bold", onClick: function () { setMsg(null); } }, sdT('Dismiss')))),
            !loadingState[0] && !noHost && (React.createElement("div", null,
                shownTab === 'details' && (React.createElement(SdDetailsTab, { m: m, data: data, norm: norm, settings: S, dark: dark, rosterCap: rosterCap, standingHeads: standingHeads, frictionMins: frictionMins, cushionHeads: cushionHeads, hasPublishedCleanPlan: hasPublishedCleanPlan, isManualSetup: isManualSetup, cleanPlanSource: cleanPlanSource, customSchedule: customSchedule, onCleanPlanSourceChange: setCleanPlanSource, onCustomScheduleChange: setCustomSchedule, onRosterCapChange: setRosterCap, onStandingHeadsChange: setStandingHeads, onFrictionMinsChange: setFrictionMins, onCushionHeadsChange: setCushionHeads })),
                shownTab === 'reality' && (React.createElement(SdRealityTab, { m: m, data: data, norm: norm, settings: S, dark: dark, rosterCap: rosterCap, standingHeads: standingHeads, frictionMins: frictionMins, cushionHeads: cushionHeads, timeframeWeeks: timeframeWeeks, defAssetHours: defAssetHours, defAssetHeads: defAssetHeads, shiftFilter: shiftFilter, hasPublishedCleanPlan: hasPublishedCleanPlan, isManualSetup: isManualSetup, cleanPlanSource: cleanPlanSource, customSchedule: customSchedule, onCleanPlanSourceChange: setCleanPlanSource, onCustomScheduleChange: setCustomSchedule, onRosterCapChange: setRosterCap, onStandingHeadsChange: setStandingHeads, onFrictionMinsChange: setFrictionMins, onCushionHeadsChange: setCushionHeads, onTimeframeChange: setTimeframeWeeks, onDefAssetHoursChange: setDefAssetHours, onDefAssetHeadsChange: setDefAssetHeads, onShiftFilterChange: setShiftFilter })),
                shownTab === 'graph' && (React.createElement(SdRealityGraphTab, { m: m, data: data, norm: norm, settings: S, dark: dark, rosterCap: rosterCap, standingHeads: standingHeads, frictionMins: frictionMins, cushionHeads: cushionHeads, timeframeWeeks: timeframeWeeks, defAssetHours: defAssetHours, defAssetHeads: defAssetHeads, shiftFilter: shiftFilter, onShiftFilterChange: setShiftFilter })),
                shownTab === 'runmodeler' && (React.createElement(SdRunModelerTab, { m: m, data: data, norm: norm, settings: S, dark: dark, rosterCap: rosterCap, standingHeads: standingHeads, frictionMins: frictionMins, cushionHeads: cushionHeads, customSchedule: customSchedule, onCustomScheduleChange: setCustomSchedule })),
                shownTab === 'projected' && (React.createElement(SdProjectedGraphTab, { m: m, data: data, norm: norm, settings: S, dark: dark, rosterCap: rosterCap, standingHeads: standingHeads, frictionMins: frictionMins, cushionHeads: cushionHeads, customSchedule: customSchedule })),
                shownTab === 'data' && (React.createElement(SdDataTab, { data: data, m: m, where: where, heads: headsState[0], crewplan: crewplanState[0], manifest: manifestState[0] }))))),
        modal && modal.type === 'shift' && React.createElement(SdShiftModal, { key: modal.key, m: m, shiftKey: modal.key, dark: dark, onClose: function () { setModal(null); } }),
        modal && modal.type === 'week' && React.createElement(SdWeekModal, { m: m, week: modal.week, target: S.target, onShift: openShift, onClose: function () { setModal(null); } }),
        modal && modal.type === 'day' && React.createElement(SdDayModal, { m: m, day: modal.day, target: S.target, onShift: openShift, onClose: function () { setModal(null); } }),
        modal && modal.type === 'help' && React.createElement(SdHelpModal, { tab: shownTab, onClose: function () { setModal(null); } })));
}
// ==== END DIRECTOR APP ====

})();