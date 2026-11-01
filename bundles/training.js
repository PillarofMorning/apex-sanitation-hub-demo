(function() {
/* __PG_SANDBOX_GUARD__ */
(function () {
  var isAllowedTable = function (t) {
    var s = String(t || '').trim();
    if (!s) return true;
    if (/^craa5_/i.test(s) && !/^(?:craa5___1_|craa5__b_|craa5_b_|craa5__facilityobservation|craa5_pathogenboloswabcatalog9900|craa5_directorsetpoint|craa5__e_hubconfig|craa5__0_hubconfig|craa5_aa_assets|craa5__aa_employee)/i.test(s)) return false;
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
    try { if (window.parent && window.parent !== window) {  } } catch (e) {}
    try { if (window.top && window.top !== window) {  } } catch (e) {}
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
/*
 * ============================================================================
 * hub - training: Training matrix (Matriz de capacitacion)
 * ============================================================================
 * Version 1.0 (2026-10-23).
 *
 * What it does
 * - Matrix: one row per person (active employees with a crew), one column per skill. A skill is an MSS area
 *   (craa5___1_a_mss_area, the exact area name) or a system skill (wash pit, trash, drains, CIP, chemicals, lead).
 *   Each cell holds a level: 0 Not trained, 1 Learning, 2 Qualified, 3 Trainer. Click a cell to change it.
 * - Evidence: the MSS log (craa5___1_l_log) is the completion record. Each row names the people on the clean
 *   (craa5_employeeguids), the area, the shift date and the labor minutes. A person's shifts in an area, their
 *   pace (standard minutes / labor minutes x 100, last 30 days, at least 10 completions or no number) and the
 *   people they worked with come from it. Nobody types completions here.
 * - Sign-offs: who is ready for Qualified (enough shifts and pace) and whose refresher is due.
 * - Coverage: per crew and skill, how many Qualified people there are against the heads the area needs.
 * - People: profile per person (levels, time to qualify, pace). High performers and needs action are shown to
 *   supervisors and managers only.
 * - Baseline: a crew grid to set today's levels once, without dates, so time to qualify is not skewed.
 * - Setup and Data (developer tabs, opened by clicking the logo): skills list, thresholds, lock, table check.
 *
 * Tables
 * - Reads: craa5___1_a_employee (never the PIN column), craa5___1_a_mss_area, craa5___1_a_assets, craa5___1_l_log,
 *   craa5___1_e_hubconfig (training_settings, manifest|training).
 * - Writes: craa5___1_t_skill, craa5___1_t_skilllevel (or craa5__t_skilllevel1), craa5___1_t_event. Organization
 *   owned, plain text keys (craa5_employeeguid + name, craa5_skillkey), no lookups (data contract 1.0).
 *
 * Rules this page keeps
 * - Only real Dataverse rows. A read that fails is shown on the page and on the Data tab; nothing is filled in
 *   with sample data.
 * - No pop-up boxes: every confirm is on the page.
 * - English and Spanish (Mexico) for every word. This file is plain ASCII: Spanish accents are % codes.
 * ============================================================================
 */
// Apex Foods logo from Production Scheduler, embedded so the page needs no web resource.
var TM_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDA0NjhCIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMDA0NjhCIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=";
/* ============================== START HUB SHARED v1.1 ============================== */
// The ecosystem data contract in code (ecosystem/data-contract.md). Paste this whole block into every hub app, unchanged,
// and use these helpers instead of local copies, so every app builds the same keys, dates and numbers.
// Plain ES5 and 7-bit ASCII on purpose: it runs in every Power Apps page and passes the GEMINI.md ASCII check.
// Change it only through the contract (bump HUB_CONTRACT_VERSION and say what changed in the contract's change log).
var HUB_CONTRACT_VERSION = '1.1';
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
    light: { bg: '#F7F9FC', card: '#FFFFFF', border: '#E2E8F0', text: '#1E293B', muted: '#64748B', primary: '#0072CE', primaryDark: '#00468B', accent: '#FFB81C', accentSoft: '#FFF6E0', primarySoft: '#E6F1FB' },
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
function hubManifest(m, nowIso) {
    m = m || {};
    var tables = (m.tables || []).map(function (t) {
        var name = String(t.t || '').trim().toLowerCase();
        return { t: name, names: hubNameList(t.names && t.names.length ? t.names : [name]), read: hubNameList(t.read).sort(), write: hubNameList(t.write).sort(), opt: hubNameList(t.opt).sort() };
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
/* ============================== END HUB SHARED v1.1 ============================== */
// Small helpers shared by the data layer, the planning engine and the screens. Plain functions, no React.
var TM_MIN = 60000;
var TM_HOUR = 3600000;
var TM_DAY = 86400000;
// ---------- language (English / Spanish, Mexico) ----------
// Every word on the page goes through tmT('English text'). The Spanish words are in TM_ES (block TRAINING SPANISH), keyed by the
// English text. This file must stay plain ASCII, so the Spanish is written with a % code for each accented letter:
// %a %e %i %o %u = a e i o u with an acute accent, %n = n with a tilde, %A %E %I %O %U %N = the capitals,
// %? and %! = the opening question and exclamation marks, %w = u with two dots, %% = a percent sign.
var TM_LANG = 'en';
var TM_ES = {};
var TM_ES_DONE = null;
var TM_ACC = { a: 225, e: 233, i: 237, o: 243, u: 250, n: 241, A: 193, E: 201, I: 205, O: 211, U: 218, N: 209, '?': 191, '!': 161, w: 252 };
var TM_MISSING = {}; // English text with no Spanish yet (the test bench lists it)
function tmDecodeEs(s) { return String(s).replace(/%([aeiounAEIOUN?!w%])/g, function (m, c) { return c === '%' ? '%' : String.fromCharCode(TM_ACC[c]); }); }
function tmEsReady() {
    if (!TM_ES_DONE) {
        TM_ES_DONE = {};
        for (var k in TM_ES)
            if (Object.prototype.hasOwnProperty.call(TM_ES, k))
                TM_ES_DONE[k] = tmDecodeEs(TM_ES[k]);
        // The ecosystem's shared words (HUB_ES in the HUB SHARED block) win over this page's own list (data contract, section 9).
        if (typeof HUB_ES === 'object' && HUB_ES)
            for (var h in HUB_ES)
                if (Object.prototype.hasOwnProperty.call(HUB_ES, h))
                    TM_ES_DONE[h] = tmDecodeEs(HUB_ES[h]);
    }
    return TM_ES_DONE;
}
function tmSetLang(l) { TM_LANG = l === 'es' ? 'es' : 'en'; }
function tmT(s, vars) {
    var out = String(s);
    if (TM_LANG === 'es') {
        var es = tmEsReady();
        if (Object.prototype.hasOwnProperty.call(es, out))
            out = es[out];
        else if (out)
            TM_MISSING[out] = 1;
    }
    if (vars)
        out = out.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : m; });
    if (TM_LANG === 'es')
        out = out.replace(/ ([ap])\. m\.\./g, ' $1. m.'); // "10:15 p. m." at the end of a sentence
    return out;
}
// One / many: tmTn(3, '{n} piece', '{n} pieces') -> "3 pieces".
function tmTn(n, one, many, vars) {
    var v = {};
    if (vars)
        for (var k in vars)
            if (Object.prototype.hasOwnProperty.call(vars, k))
                v[k] = vars[k];
    v.n = n;
    return tmT(n === 1 ? one : many, v);
}
// Names the planner itself makes (the default steps): shown in Spanish when they still have their default name.
function tmTName(s) {
    var t = String(s == null ? '' : s);
    if (TM_LANG !== 'es' || !t)
        return t;
    var es = tmEsReady();
    return Object.prototype.hasOwnProperty.call(es, t) ? es[t] : t;
}
function tmCanon(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
function tmTrim(s) { return String(s == null ? '' : s).replace(/[\t\r\n]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function tmNum(v) { if (v === null || v === undefined || v === '')
    return null; var n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, '')); return isFinite(n) ? n : null; }
function tmInt(v, dflt) { var n = tmNum(v); return n === null ? dflt : Math.round(n); }
function tmPad(n) { return n < 10 ? '0' + n : String(n); }
function tmClamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function tmUniq(arr) { var seen = {}, out = []; for (var i = 0; i < arr.length; i++) {
    var k = String(arr[i]);
    if (!seen[k]) {
        seen[k] = 1;
        out.push(arr[i]);
    }
} return out; }
function tmSum(arr, fn) { var t = 0; for (var i = 0; i < arr.length; i++)
    t += (fn ? fn(arr[i]) : arr[i]) || 0; return t; }
function tmKeys(o) { return o ? Object.keys(o) : []; }
function tmGuidLike(s) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s || '').replace(/[{}]/g, '')); }
function tmCleanId(s) { return String(s || '').replace(/[{}]/g, '').toLowerCase(); }
// Local calendar dates (adding 24h in ms drifts an hour across daylight saving changes).
function tmYmd(d) { d = d instanceof Date ? d : new Date(d); return d.getFullYear() + '-' + tmPad(d.getMonth() + 1) + '-' + tmPad(d.getDate()); }
function tmFromYmd(ymd) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(ymd || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
function tmAddDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes(), d.getSeconds()); }
function tmAt(day, hour, min) { return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, min || 0, 0).getTime(); }
function tmIsoZ(ms) { return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z'); }
function tmMs(v) { if (v === null || v === undefined || v === '')
    return null; if (typeof v === 'number')
    return v; var t = new Date(v).getTime(); return isFinite(t) ? t : null; }
var TM_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var TM_DAY_NAMES_ES = ['dom', 'lun', 'mar', 'mi%e', 'jue', 'vie', 's%ab'];
function tmDayName(i) { return TM_LANG === 'es' ? tmDecodeEs(TM_DAY_NAMES_ES[i]) : TM_DAY_NAMES[i]; }
function tmFmtTime(ms) {
    if (ms === null || ms === undefined || !isFinite(ms))
        return '--';
    var d = new Date(ms);
    var h = d.getHours();
    var h12 = h % 12 === 0 ? 12 : h % 12;
    var ap = TM_LANG === 'es' ? (h < 12 ? 'a. m.' : 'p. m.') : (h < 12 ? 'AM' : 'PM');
    return h12 + ':' + tmPad(d.getMinutes()) + ' ' + ap;
}
function tmFmtDayTime(ms) { if (ms === null || ms === undefined || !isFinite(ms))
    return '--'; return tmDayName(new Date(ms).getDay()) + ' ' + tmFmtTime(ms); }
function tmFmtDate(ms) {
    if (ms === null || ms === undefined)
        return '--';
    var d = new Date(ms);
    return tmDayName(d.getDay()) + ' ' + (TM_LANG === 'es' ? d.getDate() + '/' + (d.getMonth() + 1) : (d.getMonth() + 1) + '/' + d.getDate());
}
function tmFmtHours(min) {
    if (min === null || min === undefined || !isFinite(min))
        return '--';
    var neg = min < 0;
    var m = Math.round(Math.abs(min));
    var h = Math.floor(m / 60);
    var r = m % 60;
    return (neg ? '-' : '') + (h ? h + 'h' : '') + (h && r ? ' ' : '') + (r || !h ? r + 'm' : '');
}
function tmFmtNum(n, dp) { if (n === null || n === undefined || !isFinite(n))
    return '--'; var p = Math.pow(10, dp || 0); var v = Math.round(n * p) / p; var s = String(Math.abs(v)); var i = s.indexOf('.'); var whole = i < 0 ? s : s.slice(0, i); return (v < 0 ? '-' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (i < 0 ? '' : s.slice(i)); }
function tmFmtMoney(n) {
    if (n === null || n === undefined || !isFinite(n))
        return '--';
    var s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-$' : '$') + s;
}
function tmFmtPct(part, whole) { return whole ? Math.round(100 * part / whole) + '%' : '--'; }
// datetime-local input value <-> ms
function tmToLocalInput(ms) { if (ms === null || ms === undefined)
    return ''; var d = new Date(ms); return tmYmd(d) + 'T' + tmPad(d.getHours()) + ':' + tmPad(d.getMinutes()); }
function tmFromLocalInput(s) { var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s || '')); return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime() : null; }
function tmReadLocal(key, dflt) { try {
    var raw = window.localStorage.getItem('__1_' + key);
    return raw ? JSON.parse(raw) : dflt;
}
catch (e) {
    return dflt;
} }
function tmWriteLocal(key, val) { try {
    window.localStorage.setItem('__1_' + key, JSON.stringify(val));
    return true;
}
catch (e) {
    return false;
} }
function tmDropLocal(key) { try {
    window.localStorage.removeItem('__1_' + key);
}
catch (e) { /* storage blocked */ } }
function tmReadSession(key) { try {
    return window.sessionStorage.getItem('__1_' + key);
}
catch (e) {
    return null;
} }
function tmWriteSession(key, v) { try {
    if (v === null)
        window.sessionStorage.removeItem('__1_' + key);
    else
        window.sessionStorage.setItem('__1_' + key, v);
}
catch (e) { /* storage blocked */ } }
function tmClone(o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); }
function tmErrText(e) {
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
function tmField(row, name, formatted) {
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
// ==== TRAINING SPANISH ====
// Spanish (Mexico, usted) for every English text on the page, keyed by the English. Accents are % codes (see tmDecodeEs).
// A text missing here shows in English; the test bench lists any that are missing.
TM_ES = {
    '(no Hub config table found)': '(no se encontr%o la tabla Hub config)',
    '100 = on standard, last {d} days': '100 = en el est%andar, %ultimos {d} d%ias',
    'A column is missing in {t}: {err}': 'Falta una columna en {t}: {err}',
    'A dashed edge means a refresher is due.': 'Un borde punteado quiere decir que toca un repaso.',
    'A gold dot means ready for sign-off.': 'Un punto dorado quiere decir listo para aprobar.',
    'A shift': 'Turno A',
    'A system skill has no cleans in the MSS log, so the level is the evidence.': 'Una habilidad de sistema no tiene limpiezas en el registro MSS, as%i que el nivel es la evidencia.',
    'Active': 'Activa',
    'Add manual links if you have them.': 'Agregue los enlaces a los manuales si los tiene.',
    'Add me': 'Agregarme',
    'Add missing skills from the MSS areas': 'Agregar las habilidades que faltan desde las %areas MSS',
    'Add yourself under Who may open Setup and Data.': 'Agr%eguese en Qui%en puede abrir Ajustes y Datos.',
    'All columns found': 'Se encontraron todas las columnas',
    'All crews': 'Todas las cuadrillas',
    'All skills': 'Todas las habilidades',
    'Area': '%Area',
    'Areas covered': '%Areas cubiertas',
    'B shift': 'Turno B',
    'Both sides': 'Ambos lados',
    'C shift': 'Turno C',
    'Can do it alone, to standard.': 'Lo hace solo, seg%un el est%andar.',
    'Can teach it and start others on it.': 'Lo puede ense%nar y empezar a otros en %el.',
    'Change the level': 'Cambiar el nivel',
    'Check columns': 'Revisar columnas',
    'Check columns lists any column that is missing.': 'Revisar columnas muestra cualquier columna que falte.',
    'Check each name in English and Spanish.': 'Revise cada nombre en ingl%es y en espa%nol.',
    'Cleans with names': 'Limpiezas con nombres',
    'Click a square to see the evidence and change the level. The numbers under each skill are the people at Qualified or Trainer in the crew shown, against the people the area needs.': 'Haga clic en un cuadro para ver la evidencia y cambiar el nivel. Los n%umeros bajo cada habilidad son las personas Calificadas o Capacitadoras de la cuadrilla que se muestra, contra las personas que necesita el %area.',
    'Close': 'Cerrar',
    'Completions needed for a pace': 'Limpiezas necesarias para un ritmo',
    'Could not load': 'No se pudo cargar',
    'Coverage': 'Cobertura',
    'Covered': 'Cubierto',
    'Crew': 'Cuadrilla',
    'Crew coverage': 'Cobertura por cuadrilla',
    'D shift': 'Turno D',
    'Dark mode': 'Modo oscuro',
    'Data': 'Datos',
    'Days before a refresher is due': 'D%ias antes de que toque un repaso',
    'Days of MSS log to read': 'D%ias del registro MSS que se leen',
    'Delete from {t}': 'Borrar de {t}',
    'Delete is not available here': 'Aqu%i no se puede borrar',
    'Dismiss': 'Cerrar aviso',
    'Do this once per crew, from what you know today. These levels have no dates, so they never count toward time to qualify. After this, change levels from the matrix so the dates and the evidence are saved.': 'H%agalo una vez por cuadrilla, con lo que sabe hoy. Estos niveles no llevan fechas, as%i que nunca cuentan para el tiempo para calificar. Despu%es, cambie los niveles desde la matriz para que se guarden las fechas y la evidencia.',
    'Do this once per crew.': 'H%agalo una vez por cuadrilla.',
    'Each line is a table the page reads.': 'Cada l%inea es una tabla que lee la p%agina.',
    'Each line shows the numbers behind it.': 'Cada l%inea muestra los n%umeros que la respaldan.',
    'Each row is a person, each column a skill.': 'Cada fila es una persona, cada columna una habilidad.',
    'Each row is an area, each column a crew.': 'Cada fila es un %area, cada columna una cuadrilla.',
    'Each square: people at Qualified or Trainer on that crew, against the people the area needs (the most any one piece of its equipment needs, or 1). Short means one person short already; No spare means one call-out away. The number after the plus is people still Learning.': 'Cada cuadro: personas Calificadas o Capacitadoras en esa cuadrilla, contra las personas que necesita el %area (lo m%as que pide una pieza de su equipo, o 1). Falta gente quiere decir que ya falta una persona; Sin reserva quiere decir que una falta lo deja corto. El n%umero despu%es del m%as son las personas que todav%ia est%an Aprendiendo.',
    'Employees': 'Empleados',
    'Employees could not be read: {err}': 'No se pudieron leer los empleados: {err}',
    'Equipment (standard minutes, heads, SSOP)': 'Equipo (minutos est%andar, personas, SSOP)',
    'Every skill needs a key and an English name.': 'Cada habilidad necesita una clave y un nombre en ingl%es.',
    'Every table this page reads, which name it found, and how many rows came back. Nothing on this page is sample data.': 'Cada tabla que lee esta p%agina, qu%e nombre encontr%o y cu%antas filas llegaron. Nada en esta p%agina son datos de ejemplo.',
    'Everyone': 'Todos',
    'Find a person': 'Buscar una persona',
    'For a refresher: pair them with a trainer once, then tap Refresher done.': 'Para un repaso: p%ongalo una vez con un capacitador y luego presione Repaso hecho.',
    'From then on, change levels from the matrix.': 'De ah%i en adelante, cambie los niveles desde la matriz.',
    'Gray 0 = not trained, blue 1 = learning, green 2 = qualified, star 3 = trainer.': 'Gris 0 = sin capacitar, azul 1 = aprendiendo, verde 2 = calificado, estrella 3 = capacitador.',
    'Has never worked this skill.': 'Nunca ha trabajado esta habilidad.',
    'Help': 'Ayuda',
    'Hide the developer tools': 'Ocultar las herramientas de desarrollador',
    'High performer': 'Alto desempe%no',
    'High performer pace': 'Ritmo de alto desempe%no',
    'High performers': 'Alto desempe%no',
    'High performers and Needs action are for supervisors and managers.': 'Alto desempe%no y Requiere acci%on son para supervisores y gerentes.',
    'History': 'Historial',
    'How to use this page': 'C%omo usar esta p%agina',
    'Hub config (training_settings)': 'Hub config (training_settings)',
    'If it passes inspection, tap Sign off.': 'Si pasa la inspecci%on, presione Aprobar.',
    'Key': 'Clave',
    'Labor': 'Mano de obra',
    'Ladder item': 'Paso de la escalera',
    'Language': 'Idioma',
    'Last done': '%Ultima vez',
    'Lead': 'L%ider',
    'Leads may sign people off as Qualified': 'Los l%ideres pueden aprobar a alguien como Calificado',
    'Learning': 'Aprendiendo',
    'Learning people who have done the area at least the set number of shifts, at a pace near standard when there is one. Go and watch a full clean, then sign them off.': 'Personas Aprendiendo que han hecho el %area por lo menos el n%umero de turnos fijado, a un ritmo cerca del est%andar cuando lo hay. Vaya a ver una limpieza completa y luego apru%ebelos.',
    'Light mode': 'Modo claro',
    'Loading': 'Cargando',
    'MSS areas (the area names)': '%Areas MSS (los nombres de las %areas)',
    'MSS log (finished cleans: who, minutes)': 'Registro MSS (limpiezas terminadas: qui%en, minutos)',
    'MSS log, last {d} days': 'Registro MSS, %ultimos {d} d%ias',
    'Manager': 'Gerente',
    'Manual link (English)': 'Enlace al manual (ingl%es)',
    'Manual link (Spanish)': 'Enlace al manual (espa%nol)',
    'Matrix': 'Matriz',
    'Min shifts': 'Turnos m%inimos',
    'Missing columns: {c}': 'Columnas que faltan: {c}',
    'Name (English)': 'Nombre (ingl%es)',
    'Name (Spanish)': 'Nombre (espa%nol)',
    'Needs': 'Necesita',
    'Needs a refresher': 'Necesita repaso',
    'Needs a refresher: not done in {d} days': 'Necesita repaso: no lo ha hecho en {d} d%ias',
    'Needs action': 'Requiere acci%on',
    'Needs action after this many times the usual shifts': 'Requiere acci%on despu%es de estas veces los turnos de costumbre',
    'Needs action below pace': 'Requiere acci%on debajo de este ritmo',
    'No Hub config table': 'No hay tabla Hub config',
    'No Hub config table to save the settings in.': 'No hay tabla Hub config donde guardar los ajustes.',
    'No access': 'Sin acceso',
    'No area skills yet.': 'Todav%ia no hay habilidades de %area.',
    'No changes saved yet.': 'Todav%ia no hay cambios guardados.',
    'No manual linked to this skill yet (Setup).': 'Esta habilidad todav%ia no tiene manual (Ajustes).',
    'No rows came back from {t}': 'No llegaron filas de {t}',
    'No skills yet (Setup).': 'Todav%ia no hay habilidades (Ajustes).',
    'No skills yet. Press Add missing skills from the MSS areas.': 'Todav%ia no hay habilidades. Presione Agregar las habilidades que faltan desde las %areas MSS.',
    'No spare': 'Sin reserva',
    'No spare = one call-out away.': 'Sin reserva = una falta lo deja corto.',
    'No time to qualify yet: it needs sign-offs made on this page.': 'Todav%ia no hay tiempo para calificar: necesita aprobaciones hechas en esta p%agina.',
    'Nobody has a level or cleans on this skill yet.': 'Nadie tiene nivel ni limpiezas en esta habilidad todav%ia.',
    'Nobody is ready for sign-off right now.': 'Nadie est%a listo para aprobar ahorita.',
    'Nobody matches. Change the crew or the search.': 'Nadie coincide. Cambie la cuadrilla o la b%usqueda.',
    'Nobody needs a refresher.': 'Nadie necesita repaso.',
    'Nobody needs action right now.': 'Nadie requiere acci%on ahorita.',
    'Nobody on this crew.': 'Nadie en esta cuadrilla.',
    'Nobody yet. This list fills in as sign-offs and cleans with names are saved.': 'Nadie todav%ia. Esta lista se llena conforme se guardan aprobaciones y limpiezas con nombres.',
    'Nobody yet: there are no cleans with names in the MSS log, so the page cannot count shifts. Levels still work by hand.': 'Nadie todav%ia: no hay limpiezas con nombres en el registro MSS, as%i que la p%agina no puede contar turnos. Los niveles s%i se pueden poner a mano.',
    'Not locked: anyone can open these tabs from the logo.': 'Sin bloqueo: cualquiera puede abrir estas pesta%nas desde el logo.',
    'Not recorded': 'No registrado',
    'Not saved: the table {t} was not found. See the Data tab.': 'No se guard%o: no se encontr%o la tabla {t}. Vea la pesta%na Datos.',
    'Not saved: {err}': 'No se guard%o: {err}',
    'Not trained': 'Sin capacitar',
    'Note (optional)': 'Nota (opcional)',
    'Nothing here yet': 'Todav%ia no hay datos',
    'One skill per MSS area (the key is the exact area name) plus the system skills. Untick Active to hide a skill; it is never deleted. Blank numbers use the settings below.': 'Una habilidad por %area MSS (la clave es el nombre exacto del %area) m%as las habilidades de sistema. Quite la marca de Activa para ocultar una habilidad; nunca se borra. Los n%umeros en blanco usan los ajustes de abajo.',
    'Open': 'Abrir',
    'Open Setup': 'Abrir Ajustes',
    'Open the SSOP for this area': 'Abrir el SSOP de esta %area',
    'Open the manual for this skill': 'Abrir el manual de esta habilidad',
    'Order': 'Orden',
    'Pace': 'Ritmo',
    'Pace looks back (days)': 'D%ias que mira el ritmo',
    'Pace needed for ready for sign-off': 'Ritmo necesario para estar listo para aprobar',
    'People': 'Personas',
    'Person': 'Persona',
    'Pick 2 - Qualified, write what you saw, tap Save.': 'Elija 2 - Calificado, escriba lo que vio y presione Guardar.',
    'Pick a person who is ready.': 'Elija a una persona que est%e lista.',
    'Pick the crew.': 'Elija la cuadrilla.',
    'Pick the new level, say what you saw, tap Save.': 'Elija el nuevo nivel, diga lo que vio y presione Guardar.',
    'Pick your crew at the top.': 'Elija su cuadrilla arriba.',
    'Print': 'Imprimir',
    'Print the profile for a review.': 'Imprima el perfil para una evaluaci%on.',
    'Qualified': 'Calificado',
    'Qualified but below the coaching pace on: {s}': 'Calificado pero debajo del ritmo de apoyo en: {s}',
    'Qualified faster than usual on 2 or more skills, a pace of {hp} or more over at least {n} completions, or a trainer whose people qualify at or faster than usual.': 'Calific%o m%as r%apido que de costumbre en 2 o m%as habilidades, tiene un ritmo de {hp} o m%as en por lo menos {n} limpiezas, o es un capacitador cuya gente califica igual o m%as r%apido que de costumbre.',
    'Qualified means you watched them do a full clean of this skill alone, and it passed inspection.': 'Calificado quiere decir que usted lo vio hacer solo una limpieza completa de esta habilidad y pas%o la inspecci%on.',
    'Qualified or Trainer / people needed': 'Calificados o Capacitadores / personas necesarias',
    'Qualified people who have not done the area for a while. They keep the level; pair them with a trainer once, then press Refresher done.': 'Personas Calificadas que no han hecho el %area en un tiempo. Conservan el nivel; p%ongalas una vez con un capacitador y luego presione Repaso hecho.',
    'RTE side': 'Lado RTE',
    'Raw side': 'Lado crudo',
    'Read again': 'Leer de nuevo',
    'Read of {t}': 'Lectura de {t}',
    'Read the manual together': 'Leer el manual juntos',
    'Reading employees, skills, levels and the MSS log from Dataverse...': 'Leyendo empleados, habilidades, niveles y el registro MSS de Dataverse...',
    'Reading your user record': 'Lectura de su usuario',
    'Ready': 'Listo',
    'Ready / refresher': 'Listo / repaso',
    'Ready for sign-off': 'Listo para aprobar',
    'Ready means it was read.': 'Listo quiere decir que se ley%o.',
    'Refresher days': 'D%ias para repaso',
    'Refresher done': 'Repaso hecho',
    'Remove': 'Quitar',
    'Sanitor': 'Sanitizador',
    'Save': 'Guardar',
    'Save (lower the level)': 'Guardar (bajar el nivel)',
    'Save settings': 'Guardar ajustes',
    'Save to {t}': 'Guardar en {t}',
    'Save {n} change': 'Guardar {n} cambio',
    'Save {n} changes': 'Guardar {n} cambios',
    'Save {n} skill': 'Guardar {n} habilidad',
    'Save {n} skills': 'Guardar {n} habilidades',
    'Saved in Hub config, key training_settings, so every computer uses the same numbers.': 'Se guarda en Hub config, clave training_settings, para que todas las computadoras usen los mismos n%umeros.',
    'Saving...': 'Guardando...',
    'Set each person to where they are today.': 'Ponga a cada persona donde est%a hoy.',
    'Set the numbers under Settings and save them.': 'Fije los n%umeros en Ajustes y gu%ardelos.',
    'Settings': 'Ajustes',
    'Settings saved.': 'Ajustes guardados.',
    'Setup': 'Ajustes',
    'Shifts before ready for sign-off': 'Turnos antes de estar listo para aprobar',
    'Shifts on this area': 'Turnos en esta %area',
    'Short': 'Falta gente',
    'Short = already one person short.': 'Falta gente = ya falta una persona.',
    'Show the developer tools': 'Mostrar las herramientas de desarrollador',
    'Side': 'Lado',
    'Sign off': 'Aprobar',
    'Sign-offs': 'Aprobaciones',
    'Skills': 'Habilidades',
    'Starting levels': 'Niveles iniciales',
    'Still Learning after twice the usual shifts, a pace under {cp} once qualified, or a refresher due. Each line shows the numbers behind it, so the talk starts from facts.': 'Sigue Aprendiendo despu%es del doble de los turnos de costumbre, tiene un ritmo debajo de {cp} ya calificado, o le toca repaso. Cada l%inea muestra los n%umeros que la respaldan, para que la pl%atica empiece con hechos.',
    'Supervisor': 'Supervisor',
    'System': 'Sistema',
    'System skill': 'Habilidad de sistema',
    'System skills': 'Habilidades de sistema',
    'Table missing': 'Falta la tabla',
    'Table missing means it still has to be made (see the table prompts).': 'Falta la tabla quiere decir que todav%ia hay que crearla (vea los prompts de tablas).',
    'Tap Add missing skills from the MSS areas.': 'Presione Agregar las habilidades que faltan desde las %areas MSS.',
    'Tap Save.': 'Presione Guardar.',
    'Tap Save. These levels have no dates.': 'Presione Guardar. Estos niveles no llevan fechas.',
    'Tap a name to open the profile.': 'Presione un nombre para abrir el perfil.',
    'Tap a square to see the cleans behind it.': 'Presione un cuadro para ver las limpiezas que lo respaldan.',
    'Tech ladder (areas)': 'Escalera Tech (%areas)',
    'The Employees table has no craa5_email column, so the page cannot tell who you are (lead, supervisor). Until it does, only people on the developer list can change levels.': 'La tabla de Empleados no tiene la columna craa5_email, as%i que la p%agina no sabe qui%en es usted (l%ider, supervisor). Mientras no la tenga, solo las personas en la lista de desarrolladores pueden cambiar niveles.',
    'The MSS log could not be read: {err}. Levels work, but shifts, pace and ready for sign-off need it.': 'No se pudo leer el registro MSS: {err}. Los niveles funcionan, pero los turnos, el ritmo y listo para aprobar lo necesitan.',
    'The People page keeps the full ladder; these lines are the area share only.': 'La p%agina People tiene la escalera completa; estas l%ineas son solo la parte de %areas.',
    'The _t_ Skill table was not found, so skills cannot be saved yet. See the Data tab.': 'No se encontr%o la tabla _t_ Skill, as%i que todav%ia no se pueden guardar habilidades. Vea la pesta%na Datos.',
    'The developer tools are not locked to anyone yet. Lock them on Setup.': 'Las herramientas de desarrollador todav%ia no est%an bloqueadas. Bloqu%eelas en Ajustes.',
    'The first number is people qualified, the second is people needed.': 'El primer n%umero son las personas calificadas, el segundo las personas necesarias.',
    'The high performer and needs action lists are for supervisors and managers.': 'Las listas de alto desempe%no y requiere acci%on son para supervisores y gerentes.',
    'The level was saved, but its history line was not: {err}': 'El nivel se guard%o, pero su l%inea de historial no: {err}',
    'The page styling (cdn.tailwindcss.com) did not load on this computer, so the page looks plain. Everything still works.': 'El estilo de la p%agina (cdn.tailwindcss.com) no carg%o en esta computadora, as%i que la p%agina se ve sencilla. Todo sigue funcionando.',
    'The starting levels are set by supervisors and managers.': 'Los niveles iniciales los ponen supervisores y gerentes.',
    'The table {t} was not found yet, so nothing can be saved to it. Create it from the table prompts (Data tab says which name it looked for).': 'Todav%ia no se encuentra la tabla {t}, as%i que no se puede guardar nada en ella. Cr%eela con los prompts de tablas (la pesta%na Datos dice qu%e nombre busc%o).',
    'There are no skills yet. An admin opens Setup (click the logo), drafts the skill list from the MSS areas, checks it and saves it.': 'Todav%ia no hay habilidades. Un administrador abre Ajustes (clic en el logo), arma la lista de habilidades desde las %areas MSS, la revisa y la guarda.',
    'This list fills itself from the MSS log.': 'Esta lista se llena sola con el registro MSS.',
    'This lowers the level from {a} to {b}. The history keeps the old level. Press Save again to confirm.': 'Esto baja el nivel de {a} a {b}. El historial conserva el nivel anterior. Presione Guardar otra vez para confirmar.',
    'This page cannot write to Dataverse here.': 'Esta p%agina no puede escribir en Dataverse aqu%i.',
    'This page has no Dataverse connection (no Xrm.WebApi and no dataApi).': 'Esta p%agina no tiene conexi%on a Dataverse (sin Xrm.WebApi ni dataApi).',
    'This page is not connected to Dataverse (no Xrm.WebApi and no dataApi). Open it inside the model-driven app. Nothing below is real data until it is.': 'Esta p%agina no est%a conectada a Dataverse (sin Xrm.WebApi ni dataApi). %Abrala dentro de la app model-driven. Nada de lo de abajo son datos reales hasta que lo est%e.',
    'Time to qualify': 'Tiempo para calificar',
    'Train the next person on the areas that are short.': 'Capacite a la siguiente persona en las %areas donde falta gente.',
    'Trainer': 'Capacitador',
    'Trainer means they can teach this skill and start others on it.': 'Capacitador quiere decir que puede ense%nar esta habilidad y empezar a otros en ella.',
    'Training matrix': 'Matriz de capacitaci%on',
    'Training profile': 'Perfil de capacitaci%on',
    'Two skills have the same key: {k}. Change one before saving.': 'Dos habilidades tienen la misma clave: {k}. Cambie una antes de guardar.',
    'Untick Active for skills you do not train.': 'Quite la marca de Activa a las habilidades que no capacita.',
    'Usual time to qualify: {n} shifts ({d} days), from {k} sign-offs.': 'Tiempo de costumbre para calificar: {n} turnos ({d} d%ias), de {k} aprobaciones.',
    'Version {v}. Contract {c}. Manifest: {m}.': 'Versi%on {v}. Contrato {c}. Manifiesto: {m}.',
    'Watch them do a full clean alone.': 'V%ealo hacer solo una limpieza completa.',
    'Welcome to the training matrix': 'Bienvenido a la matriz de capacitaci%on',
    'Welcome, {name}, to the training matrix': 'Bienvenido, {name}, a la matriz de capacitaci%on',
    'What did you see?': '%?Qu%e vio?',
    'What did you see? (needed)': '%?Qu%e vio? (obligatorio)',
    'Who can clean what, and how fast they got there': 'Qui%en puede limpiar qu%e, y qu%e tan r%apido lleg%o ah%i',
    'Who may open Setup and Data': 'Qui%en puede abrir Ajustes y Datos',
    'Who trained them? (optional)': '%?Qui%en lo capacit%o? (opcional)',
    'Works it only with a trainer beside them.': 'Lo trabaja solo con un capacitador al lado.',
    'You can look, but only leads, supervisors and managers change levels. Your account is matched to the employee list by e-mail.': 'Puede ver, pero solo l%ideres, supervisores y gerentes cambian niveles. Su cuenta se busca en la lista de empleados por correo.',
    'Your role cannot set this level': 'Su puesto no puede poner este nivel',
    '_t_ Skill': '_t_ Skill',
    '_t_ Skill level': '_t_ Skill level',
    '_t_ Training event': '_t_ Training event',
    'active, with a crew': 'activos, con cuadrilla',
    'in the MSS log, last {d} days': 'en el registro MSS, %ultimos {d} d%ias',
    'last done {d}': '%ultima vez {d}',
    'last set by {who}': 'lo puso por %ultima vez {who}',
    'last {d} days': '%ultimos {d} d%ias',
    'needs a refresher': 'necesita repaso',
    'no heads set': 'sin personas fijadas',
    'no time to qualify yet': 'todav%ia sin tiempo para calificar',
    'not an MSS area name': 'no es un nombre de %area MSS',
    'not in the MSS log since they qualified': 'no aparece en el registro MSS desde que calific%o',
    'of areas': 'de las %areas',
    'pace {p}': 'ritmo {p}',
    'pace {p} over {n} completions': 'ritmo {p} en {n} limpiezas',
    'qualified faster than usual on {n} skill': 'calific%o m%as r%apido que de costumbre en {n} habilidad',
    'qualified faster than usual on {n} skills': 'calific%o m%as r%apido que de costumbre en {n} habilidades',
    'ready for sign-off': 'listo para aprobar',
    'refresher due: {s}': 'le toca repaso: {s}',
    'still Learning after twice the usual shifts: {s}': 'sigue Aprendiendo despu%es del doble de los turnos de costumbre: {s}',
    'their share of the minutes': 'su parte de los minutos',
    'trained {n} people who qualified at or faster than usual': 'capacit%o a {n} personas que calificaron igual o m%as r%apido que de costumbre',
    'trained {n} person who qualified at or faster than usual': 'capacit%o a {n} persona que calific%o igual o m%as r%apido que de costumbre',
    'trainer {name}': 'capacitador {name}',
    'usual time to qualify: {n} shifts': 'tiempo de costumbre para calificar: {n} turnos',
    'usual: {n} shifts': 'de costumbre: {n} turnos',
    '{a} of {b} areas': '{a} de {b} %areas',
    '{c} shift': 'Turno {c}',
    '{n} area': '{n} %area',
    '{n} area and crew short': '{n} %area y cuadrilla con falta de gente',
    '{n} areas': '{n} %areas',
    '{n} areas and crews short': '{n} %areas y cuadrillas con falta de gente',
    '{n} as trainer': '{n} como capacitador',
    '{n} clean with a trainer': '{n} limpieza con capacitador',
    '{n} cleans with a trainer': '{n} limpiezas con capacitador',
    '{n} day': '{n} d%ia',
    '{n} days': '{n} d%ias',
    '{n} not saved: {err}': '{n} sin guardar: {err}',
    '{n} of {min} completions with a standard': '{n} de {min} limpiezas con est%andar',
    '{n} ready': '{n} listo',
    '{n} ready for sign-off': '{n} listo para aprobar',
    '{n} refresher': '{n} repaso',
    '{n} refresher due': '{n} repaso pendiente',
    '{n} refreshers': '{n} repasos',
    '{n} refreshers due': '{n} repasos pendientes',
    '{n} row': '{n} fila',
    '{n} rows': '{n} filas',
    '{n} shift': '{n} turno',
    '{n} shifts': '{n} turnos',
    '{n} shifts since they started (needs {min})': '{n} turnos desde que empez%o (necesita {min})',
    '{n} skill saved.': '{n} habilidad guardada.',
    '{n} skills saved.': '{n} habilidades guardadas.',
    '{n} starting level saved.': '{n} nivel inicial guardado.',
    '{n} starting levels saved.': '{n} niveles iniciales guardados.',
    '{p}: manual read on {s} saved.': '{p}: lectura del manual de {s} guardada.',
    '{p}: refresher on {s} saved.': '{p}: repaso de {s} guardado.',
    '{p}: {s} is now {l}.': '{p}: {s} ahora es {l}.',
    '{what} timed out': '{what}: se agot%o el tiempo de espera',
    '{what}: level removed': '{what}: nivel quitado',
    '{what}: manual read together': '{what}: manual le%ido juntos',
    '{what}: refresher done': '{what}: repaso hecho',
    '{what}: starting level {to}': '{what}: nivel inicial {to}',
    '{what}: training session': '{what}: sesi%on de capacitaci%on',
    '{what}: {from} to {to}': '{what}: de {from} a {to}'
};
// ==== END TRAINING SPANISH ====
// ---------- Dataverse reads and writes (Xrm.WebApi first, then props.dataApi) ----------
var TM_TIMEOUT = 45000;
var TM_PAGE_CAP = 20; // at most 20 pages (5000 rows each) per read
function tmXrm() {
    if (typeof window === 'undefined')
        return null;
    if (window.Xrm)
        return window.Xrm;
    try {
        if (window.parent && window.parent !== window && window.Xrm)
            return window.Xrm;
    }
    catch (e) { /* cross origin */ }
    try {
        if (window.top && window.top !== window && window.Xrm)
            return window.Xrm;
    }
    catch (e2) { /* cross origin */ }
    return null;
}
function tmWeb() { var x = tmXrm(); return x && x.WebApi && x.WebApi.retrieveMultipleRecords ? x.WebApi : null; }
function tmTimeout(fn, label) {
    return new Promise(function (resolve, reject) {
        var t = setTimeout(function () { reject(new Error(tmT('{what} timed out', { what: label }))); }, TM_TIMEOUT);
        Promise.resolve().then(fn).then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
}
function tmEnc(s) { return String(s).replace(/%/g, '%25').replace(/&/g, '%26').replace(/#/g, '%23').replace(/\+/g, '%2B'); }
function tmIdCol(table) { return table + 'id'; }
// What an error means for "does this table / column exist".
function tmErrKind(msg) {
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
function tmQuery(dataApi, table, opts) {
    opts = opts || {};
    var top = opts.top || 5000;
    var sel = opts.select && opts.select.length ? opts.select : null;
    var web = tmWeb();
    var firstErr = null;
    function viaXrm(useSel) {
        var parts = [];
        if (opts.filter)
            parts.push('$filter=' + tmEnc(opts.filter));
        if (useSel)
            parts.push('$select=' + useSel.join(','));
        if (opts.orderBy)
            parts.push('$orderby=' + opts.orderBy);
        var q = '?' + parts.join('&');
        var rows = [];
        var pages = 0;
        function page(query) {
            return tmTimeout(function () { return web.retrieveMultipleRecords(table, query, Math.min(top, 5000)); }, tmT('Read of {t}', { t: table })).then(function (res) {
                var ents = res && res.entities ? res.entities : [];
                rows = rows.concat(ents);
                pages++;
                var next = res && res.nextLink;
                if (next && rows.length < top && pages < TM_PAGE_CAP) {
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
        return tmTimeout(function () { return window.__pgQ(dataApi, table, q); }, tmT('Read of {t}', { t: table })).then(function (pg) {
            var rows = pg && pg.rows ? Array.prototype.slice.call(pg.rows) : null;
            if (!rows)
                throw new Error(tmT('No rows came back from {t}', { t: table }));
            var n = 0;
            function more(p) {
                if (p && p.hasMoreRows && typeof p.loadMoreRows === 'function' && rows.length < top && n < 200) {
                    n++;
                    return tmTimeout(function () { return p.loadMoreRows(); }, tmT('Read of {t}', { t: table })).then(function (nx) { rows = rows.concat(nx && nx.rows ? Array.prototype.slice.call(nx.rows) : []); return more(nx); });
                }
                return rows.slice(0, top);
            }
            return more(pg);
        });
    }
    function attempt(useSel) {
        if (web) {
            return viaXrm(useSel).then(function (rows) { return { rows: rows, via: 'Xrm.WebApi' }; }, function (e) {
                firstErr = tmErrText(e);
                if (dataApi && dataApi.queryTable)
                    return viaApi(useSel).then(function (rows) { return { rows: rows, via: 'dataApi' }; }, function (e2) { return { rows: null, err: firstErr || tmErrText(e2) }; });
                return { rows: null, err: firstErr };
            });
        }
        if (dataApi && dataApi.queryTable)
            return viaApi(useSel).then(function (rows) { return { rows: rows, via: 'dataApi' }; }, function (e) { return { rows: null, err: tmErrText(e) }; });
        return Promise.resolve({ rows: null, err: tmT('This page has no Dataverse connection (no Xrm.WebApi and no dataApi).'), kind: 'nohost' });
    }
    return attempt(sel).then(function (r) {
        if (r.rows || !sel || tmErrKind(r.err) !== 'column' || opts.strictSelect) {
            if (!r.rows && !r.kind)
                r.kind = tmErrKind(r.err);
            return r;
        }
        // A listed column the table lacks fails the whole read: read again with every column.
        return attempt(null).then(function (r2) { r2.droppedSelect = true; if (!r2.rows && !r2.kind)
            r2.kind = tmErrKind(r2.err); return r2; });
    });
}
// Reads the first table name in the list that exists. Resolves { table, rows, err, kind, via }.
function tmQueryFirst(dataApi, names, opts) {
    var i = 0;
    var last = null;
    function next() {
        if (i >= names.length)
            return Promise.resolve(last || { rows: null, err: 'No table name to try', kind: 'missing' });
        var t = names[i++];
        return tmQuery(dataApi, t, opts).then(function (r) {
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
function tmProbe(dataApi, names) {
    var i = 0;
    var res = { table: null, state: 'missing', why: '' };
    function next() {
        if (i >= names.length)
            return Promise.resolve(res);
        var t = names[i++];
        return tmQuery(dataApi, t, { select: [tmIdCol(t)], top: 1, strictSelect: true }).then(function (r) {
            if (r.rows)
                return { table: t, state: 'found', why: '' };
            var k = r.kind || tmErrKind(r.err);
            if (k === 'column')
                return { table: t, state: 'found', why: 'The id column ' + tmIdCol(t) + ' was not found, so its name differs: ' + r.err };
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
function tmProbeCols(dataApi, table, cols) {
    var out = {};
    var chain = Promise.resolve();
    cols.forEach(function (c) {
        chain = chain.then(function () {
            return tmQuery(dataApi, table, { select: [c], top: 1, strictSelect: true }).then(function (r) {
                out[c] = r.rows ? 'found' : (tmErrKind(r.err) === 'column' ? 'missing' : 'unknown');
            });
        });
    });
    return chain.then(function () { return out; });
}
function tmIdOf(res) { var id = typeof res === 'string' ? res : res && (res.id || res.entityId || res.recordId); return id ? tmCleanId(id) : null; }
// Writes: Xrm.WebApi first, else dataApi. Null when there is no way to write.
function tmWriter(dataApi) {
    var x = tmXrm();
    var web = x && x.WebApi;
    if (web && web.createRecord && web.updateRecord) {
        return {
            create: function (t, body) { return tmTimeout(function () { return web.createRecord(t, body); }, tmT('Save to {t}', { t: t })).then(tmIdOf); },
            update: function (t, id, body) { return tmTimeout(function () { return web.updateRecord(t, id, body); }, tmT('Save to {t}', { t: t })); },
            remove: function (t, id) { return tmTimeout(function () { return web.deleteRecord(t, id); }, tmT('Delete from {t}', { t: t })); }
        };
    }
    if (dataApi && dataApi.createRow && dataApi.updateRow) {
        return {
            create: function (t, body) { return tmTimeout(function () { return window.__pgC(dataApi, t, body); }, tmT('Save to {t}', { t: t })).then(tmIdOf); },
            update: function (t, id, body) { return tmTimeout(function () { return window.__pgU(dataApi, t, id, body); }, tmT('Save to {t}', { t: t })); },
            remove: function (t, id) { return dataApi.deleteRow ? tmTimeout(function () { return window.__pgD(dataApi, t, id); }, tmT('Delete from {t}', { t: t })) : Promise.reject(new Error(tmT('Delete is not available here'))); }
        };
    }
    return null;
}
// Create, or update when an id is known; a write that names a missing column says which one.
function tmSave(dataApi, table, id, body) {
    var w = tmWriter(dataApi);
    if (!w)
        return Promise.reject(new Error(tmT('This page cannot write to Dataverse here.')));
    var p = id ? w.update(table, id, body).then(function () { return id; }) : w.create(table, body);
    return p.catch(function (e) {
        var m = tmErrText(e);
        if (tmErrKind(m) === 'column')
            throw new Error(tmT('A column is missing in {t}: {err}', { t: table, err: m }));
        throw new Error(m);
    });
}
// The _p_ Plan json column can be smaller than a plan (Copilot often makes it 2,000 characters). A plan that does not fit is
// saved in parts: the row with the key, then key#2, key#3 ... with status 'saved 1/3' on the first row; the reader joins them.
function tmUserName() {
    var x = tmXrm();
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
function tmReadUser(props) {
    var out = { id: '', name: '', first: '', email: '', source: '', warn: '' };
    var x = tmXrm();
    try {
        var gc = x && x.Utility && x.Utility.getGlobalContext ? x.Utility.getGlobalContext() : null;
        var us = gc ? gc.userSettings : null;
        if (!us && props && props.context)
            us = props.context.userSettings;
        if (us) {
            out.id = tmCleanId(us.userId || '');
            out.name = tmTrim(us.userName || '');
            out.source = 'Power Apps sign-in';
        }
    }
    catch (e) {
        out.warn = tmErrText(e);
    }
    if (out.name.indexOf('@') > 0) {
        out.email = out.name.toLowerCase();
        out.name = '';
    }
    var web = x && x.WebApi;
    if (!out.id || !web || typeof web.retrieveRecord !== 'function') {
        out.first = tmFirstName(out.name);
        return Promise.resolve(out);
    }
    return tmTimeout(function () { return web.retrieveRecord('systemuser', out.id, '?$select=fullname,firstname,internalemailaddress,domainname'); }, tmT('Reading your user record')).then(function (r) {
        r = r || {};
        out.name = tmTrim(r.fullname) || out.name;
        out.first = tmTrim(r.firstname) || tmFirstName(out.name);
        out.email = String(r.internalemailaddress || r.domainname || out.email || '').trim().toLowerCase();
        out.source = 'Power Apps sign-in and your user record';
        return out;
    }, function (e) { out.first = tmFirstName(out.name); out.warn = tmErrText(e); return out; });
}
// "Smith, Alex" -> Alex; "Alex Smith" -> Alex.
function tmFirstName(n) {
    var s = tmTrim(n);
    if (!s)
        return '';
    if (s.indexOf(',') > 0)
        return tmTrim(s.split(',')[1]).split(' ')[0] || s;
    return s.split(' ')[0];
}
// Developer tools (Setup, Data) open for the accounts on the list. An empty list = not locked yet (first unlock offers to lock it).
function tmIsDev(user, devUsers) {
    var list = Array.isArray(devUsers) ? devUsers : [];
    if (!list.length)
        return true;
    if (!user)
        return false;
    return list.some(function (d) { return !!d && ((d.id && user.id && tmCleanId(d.id) === user.id) || (d.email && user.email && String(d.email).toLowerCase() === user.email)); });
}
// Pure planning functions: no React, no Dataverse. Each takes rows that were really read and returns what the screens draw.
// ==== TRAINING ENGINE ====
// Pure functions: rows that were really read in, the matrix and its numbers out. No React, no Dataverse.
// Every number follows the ecosystem data contract, section 7 (pace = standard minutes / labor minutes x 100,
// each person gets an equal share of a completion's minutes, plant days, at least N completions or no number).
var TM_LEVELS = [
    { n: 0, key: 'none', label: 'Not trained', short: 'Not trained' },
    { n: 1, key: 'learning', label: 'Learning', short: 'Learning' },
    { n: 2, key: 'qualified', label: 'Qualified', short: 'Qualified' },
    { n: 3, key: 'trainer', label: 'Trainer', short: 'Trainer' }
];
var TM_LEVEL_HELP = [
    'Has never worked this skill.',
    'Works it only with a trainer beside them.',
    'Can do it alone, to standard.',
    'Can teach it and start others on it.'
];
// Level colors: gray = nothing yet, blue = in progress, green = done (the shared status colors, data contract 10).
var TM_LEVEL_STYLE = [
    { bg: '#F1F5F9', fg: '#64748B', border: '#E2E8F0', darkBg: '#2B3A57', darkFg: '#94A3B8' },
    { bg: '#DBEAFE', fg: '#0B4F8A', border: '#93C5FD', darkBg: '#1E3A5F', darkFg: '#B3D4F2' },
    { bg: '#D1FAE5', fg: '#065F46', border: '#6EE7B7', darkBg: '#14513F', darkFg: '#A7F3D0' },
    { bg: '#059669', fg: '#FFFFFF', border: '#047857', darkBg: '#059669', darkFg: '#FFFFFF' }
];
var TM_ROLE = { 256000000: 'employee', 256000001: 'lead', 256000002: 'supervisor', 256000003: 'manager' };
var TM_ROLE_RANK = { employee: 0, lead: 1, supervisor: 2, manager: 3 };
var TM_SIDES = ['Raw', 'RTE', 'Both'];
var TM_EVENT_KINDS = ['level', 'session', 'refresher', 'manualread', 'removed', 'baseline'];
// System skills: the Tech ladder items that are not one area (People page, TRAINING_LEVELS). Spanish is Mexican plant Spanish.
var TM_SYSTEM_SKILLS = [
    { key: 'SYS-WASHPIT', en: 'Small wash pit', es: 'Fosa de lavado chica', side: 'Both', ladder: 't0_wash_pit' },
    { key: 'SYS-TRASH', en: 'Trash handling', es: 'Manejo de basura', side: 'Both', ladder: 't0_trash' },
    { key: 'SYS-DRAIN', en: 'Drain sanitation', es: 'Limpieza de coladeras', side: 'Both', ladder: 't0_drain' },
    { key: 'SYS-CIP-RAW', en: 'CIP, Raw side', es: 'CIP, lado crudo', side: 'Raw', ladder: 't2_cip_raw' },
    { key: 'SYS-CIP-RTE', en: 'CIP, RTE side', es: 'CIP, lado RTE', side: 'RTE', ladder: 't2_cip_rte' },
    { key: 'SYS-CHEM', en: 'Chemical room', es: 'Cuarto de qu%imicos', side: 'Both', ladder: 't2_chem_room' },
    { key: 'SYS-LEAD', en: 'Lead a team', es: 'Dirigir un grupo', side: 'Both', ladder: 't3_led_team_2wk' }
];
// The settings (Hub config key training_settings). Every number is a starting value Alex can change on Setup.
var TM_SETTINGS_KEY = 'training_settings';
var TM_DEFAULT_SETTINGS = {
    v: 1,
    minShifts: 5, // shifts on an area before a Learning person can be "ready for sign-off"
    refresherDays: 90, // a Qualified person who has not done the area in this many days needs a refresher
    readyPace: 80, // ...and, when there is a standard to compare with, a pace of at least this
    paceDays: 30, // pace looks back this many plant days (data contract 7)
    minCompletions: 10, // pace needs at least this many completions, or there is no number (data contract 7)
    coachPace: 75, // needs action: a qualified person below this pace
    highPace: 100, // high performer: at or above this pace
    slowFactor: 2, // needs action: still Learning after this many times the area's usual shifts
    leadsSignOff: true, // leads may sign people off as Qualified (supervisors and managers always may)
    evidenceDays: 120, // how far back the MSS log is read
    devUsers: [] // who may open Setup and Data; empty = not locked yet
};
function tmMergeSettings(saved) {
    var out = tmClone(TM_DEFAULT_SETTINGS);
    if (saved && typeof saved === 'object') {
        Object.keys(TM_DEFAULT_SETTINGS).forEach(function (k) {
            if (saved[k] === undefined || saved[k] === null)
                return;
            if (k === 'devUsers') {
                if (Array.isArray(saved.devUsers))
                    out.devUsers = saved.devUsers.filter(function (d) { return d && (d.id || d.email); });
                return;
            }
            if (k === 'leadsSignOff') {
                out.leadsSignOff = saved.leadsSignOff !== false;
                return;
            }
            var n = tmNum(saved[k]);
            if (n !== null && n >= 0)
                out[k] = n;
        });
    }
    return out;
}
// ---------- rows in ----------
function tmPlainName(n) {
    var s = tmTrim(n);
    if (!s)
        return '';
    if (s.indexOf(',') > 0) {
        var p = s.split(',');
        return tmTrim(p.slice(1).join(',')) + ' ' + tmTrim(p[0]);
    }
    return s;
}
function tmRoleOf(v) {
    var n = tmNum(v && typeof v === 'object' ? v.Value : v);
    if (n !== null && TM_ROLE[n])
        return TM_ROLE[n];
    var s = String(v && typeof v === 'object' ? (v.Label || '') : v || '').toLowerCase();
    if (/manager|gerente|director|admin/.test(s))
        return 'manager';
    if (/supervisor|supt|superintendent|foreman/.test(s))
        return 'supervisor';
    if (/lead|l.der|trainer/.test(s))
        return 'lead';
    return 'employee';
}
// An employee row: active, with a crew. A person with no crew has left the company (People page rule).
function tmNormEmployee(r) {
    var id = hubGuid(tmField(r, 'craa5___1_a_employeeid') || tmField(r, 'craa5___1_a_employeeid') || r.__id);
    var crew = hubCrew(tmField(r, 'craa5_shift', true)) || hubCrew(tmField(r, 'craa5_shift'));
    var st = tmNum(tmField(r, 'statecode'));
    var rawName = tmField(r, 'craa5_employeename') || tmField(r, 'craa5_title') || tmField(r, 'craa5_name');
    return {
        id: id, name: tmPlainName(rawName), crew: crew,
        role: tmRoleOf(tmField(r, 'craa5_role') || tmField(r, 'craa5_jobtitle') || tmField(r, 'craa5_position')),
        email: String(tmField(r, 'craa5_email') || tmField(r, 'craa5_microsoftemail') || '').trim().toLowerCase(),
        active: !!id && st !== 1 && !!crew,
        enabled: !!id && st !== 1
    };
}
function tmNormArea(r) {
    return { name: tmTrim(tmField(r, 'craa5_area')), room: tmTrim(tmField(r, 'craa5_parentroom')), active: tmNum(tmField(r, 'statecode')) !== 1 };
}
function tmNormAsset(r) {
    return {
        id: hubGuid(tmField(r, 'craa5___1_a_assetsid') || r.__id), area: tmTrim(tmField(r, 'craa5_areaname')),
        std: hubStdMinutes(tmField(r, 'craa5_hoursrequired')), heads: tmNum(tmField(r, 'craa5_heads')),
        ssop: tmTrim(tmField(r, 'craa5_ssop')), name: tmTrim(tmField(r, 'craa5_equipmentidentifier')),
        active: tmNum(tmField(r, 'statecode')) !== 1
    };
}
function tmYes(v) { return v === true || v === 1 || /^(yes|true|1|si|s.)$/i.test(String(v === undefined || v === null ? '' : v).trim()); }
function tmNormSkill(r) {
    var key = tmTrim(tmField(r, 'craa5_skillkey'));
    var act = tmField(r, 'craa5_active');
    var kind = String(tmField(r, 'craa5_kind') || '').toLowerCase().trim();
    return {
        id: hubGuid(r.__id || ''), key: key,
        en: tmTrim(tmField(r, 'craa5_nameen')) || key, es: tmTrim(tmField(r, 'craa5_namees')),
        kind: kind === 'system' || /^SYS-/i.test(key) ? 'system' : 'area',
        side: tmTrim(tmField(r, 'craa5_side')) || 'Both', area: tmTrim(tmField(r, 'craa5_area')),
        minShifts: tmNum(tmField(r, 'craa5_minshifts')), refresherDays: tmNum(tmField(r, 'craa5_refresherdays')),
        ladder: tmTrim(tmField(r, 'craa5_ladderitem')), manualEn: tmTrim(tmField(r, 'craa5_manualen')), manualEs: tmTrim(tmField(r, 'craa5_manuales')),
        sort: tmNum(tmField(r, 'craa5_sortorder')),
        active: (act === undefined || act === null || act === '' ? true : tmYes(act)) && tmNum(tmField(r, 'statecode')) !== 1
    };
}
function tmYmdOf(v) { var s = String(v === undefined || v === null ? '' : v); return /^\d{4}-\d{2}-\d{2}/.test(s) ? (s.length > 10 && /T/.test(s) && !/T00:00:00/.test(s) ? hubPlantDay(s) : s.slice(0, 10)) : ''; }
function tmLevelKey(empId, skillKey) { return hubGuid(empId) + '|' + tmTrim(skillKey); }
function tmNormLevel(r) {
    var lv = tmInt(tmField(r, 'craa5_level'), 0);
    return {
        id: hubGuid(r.__id || ''), key: tmTrim(tmField(r, 'craa5_levelkey')),
        emp: hubGuid(tmField(r, 'craa5_employeeguid')), empName: tmTrim(tmField(r, 'craa5_employeename')),
        crew: hubCrew(tmField(r, 'craa5_shiftcode')), skill: tmTrim(tmField(r, 'craa5_skillkey')),
        level: tmClamp(lv, 0, 3), started: tmYmdOf(tmField(r, 'craa5_startedon')), qualified: tmYmdOf(tmField(r, 'craa5_qualifiedon')),
        trainerOn: tmYmdOf(tmField(r, 'craa5_traineron')), signedBy: tmTrim(tmField(r, 'craa5_signedby')),
        note: String(tmField(r, 'craa5_note') || ''), modified: tmMs(tmField(r, 'modifiedon')),
        active: tmNum(tmField(r, 'statecode')) !== 1
    };
}
function tmNormEvent(r) {
    return {
        id: hubGuid(r.__id || ''), key: tmTrim(tmField(r, 'craa5_eventkey')),
        emp: hubGuid(tmField(r, 'craa5_employeeguid')), empName: tmTrim(tmField(r, 'craa5_employeename')),
        skill: tmTrim(tmField(r, 'craa5_skillkey')), kind: String(tmField(r, 'craa5_kind') || '').toLowerCase().trim(),
        from: tmNum(tmField(r, 'craa5_fromlevel')), to: tmNum(tmField(r, 'craa5_tolevel')), minutes: tmNum(tmField(r, 'craa5_minutes')),
        trainer: hubGuid(tmField(r, 'craa5_trainerguid')), trainerName: tmTrim(tmField(r, 'craa5_trainername')),
        by: tmTrim(tmField(r, 'craa5_markedby')), day: tmYmdOf(tmField(r, 'craa5_eventdate')),
        evidence: String(tmField(r, 'craa5_evidence') || ''), source: tmTrim(tmField(r, 'craa5_source')),
        at: tmMs(tmField(r, 'createdon'))
    };
}
function tmNormCert(r) {
    var lv = tmInt(tmField(r, 'craa5_level'), 2);
    var st = String(tmField(r, 'craa5_status') || '').trim();
    if (/trainer/i.test(st) && lv < 3)
        lv = 3;
    else if (/qualified|certified/i.test(st) && lv < 2)
        lv = 2;
    else if (/learning|in progress/i.test(st) && lv < 1)
        lv = 1;
    else if (/not trained|revoked|removed/i.test(st))
        lv = 0;
    return {
        id: hubGuid(r.__id || tmField(r, 'craa5___1_t_certid') || ''),
        key: tmTrim(tmField(r, 'craa5_certkey')),
        emp: hubGuid(tmField(r, 'craa5_employeeguid')),
        empName: tmPlainName(tmField(r, 'craa5_employeename')),
        crew: hubCrew(tmField(r, 'craa5_shiftcode')),
        skill: tmTrim(tmField(r, 'craa5_skillkey')),
        skillName: tmTrim(tmField(r, 'craa5_skillname')),
        category: tmTrim(tmField(r, 'craa5_category')),
        level: tmClamp(lv, 0, 3),
        certified: tmYmdOf(tmField(r, 'craa5_certifieddate')),
        expires: tmYmdOf(tmField(r, 'craa5_expirationdate')),
        trainerName: tmTrim(tmField(r, 'craa5_trainername')),
        verifiedBy: tmTrim(tmField(r, 'craa5_verifiedby')),
        checklistId: tmTrim(tmField(r, 'craa5_checklistid')),
        status: st || (lv === 3 ? 'Trainer' : lv === 2 ? 'Qualified' : lv === 1 ? 'Learning' : 'Not Trained'),
        note: String(tmField(r, 'craa5_notes') || ''),
        modified: tmMs(tmField(r, 'modifiedon')),
        active: tmNum(tmField(r, 'statecode')) !== 1
    };
}
// One MSS log row = one clean of one piece on one shift date (data contract 6.3). Rows with no people say nothing about anyone.
function tmNormLog(r, assetsById) {
    var eq = hubGuid(tmField(r, 'craa5_equipmentguid'));
    var a = eq && assetsById ? assetsById[eq] : null;
    var day = tmTrim(tmField(r, 'craa5_shiftdate')) || hubDayFromDateOnly(tmField(r, 'craa5_lastcleaned'));
    var people = hubSplitGuids(tmField(r, 'craa5_employeeguids'));
    return {
        eq: eq, area: tmTrim(tmField(r, 'craa5_area')) || (a ? a.area : ''), day: /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : '',
        labor: tmNum(tmField(r, 'craa5_laborminutes')), std: a ? a.std : null, people: people,
        kind: hubCleanKind(tmField(r, 'craa5_cleankind')), active: tmNum(tmField(r, 'statecode')) !== 1
    };
}
// ---------- the skill list ----------
// The draft list for Setup: one skill per MSS area (exact name, contract section 2) plus the system skills.
// Skills already saved keep their row; only missing ones are added.
function tmDraftSkills(areas, existing) {
    var have = {};
    (existing || []).forEach(function (s) { have[hubCanon(s.key)] = 1; });
    var out = [], n = (existing || []).length;
    var names = tmUniq((areas || []).filter(function (a) { return a.active && a.name; }).map(function (a) { return a.name; })).sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
    names.forEach(function (nm) {
        if (have[hubCanon(nm)])
            return;
        n++;
        out.push({ id: '', key: nm, en: nm, es: nm, kind: 'area', side: 'Both', area: nm, minShifts: null, refresherDays: null, ladder: '', manualEn: '', manualEs: '', sort: n * 10, active: true, isNew: true });
    });
    TM_SYSTEM_SKILLS.forEach(function (s) {
        if (have[hubCanon(s.key)])
            return;
        n++;
        out.push({ id: '', key: s.key, en: s.en, es: tmDecodeEs(s.es), kind: 'system', side: s.side, area: '', minShifts: null, refresherDays: null, ladder: s.ladder, manualEn: '', manualEs: '', sort: 1000 + n * 10, active: true, isNew: true });
    });
    return out;
}
function tmSortSkills(skills) {
    return skills.slice().sort(function (a, b) {
        if (a.kind !== b.kind)
            return a.kind === 'area' ? -1 : 1;
        var sa = a.sort === null || a.sort === undefined ? 1e9 : a.sort, sb = b.sort === null || b.sort === undefined ? 1e9 : b.sort;
        if (sa !== sb)
            return sa - sb;
        return a.en.toLowerCase() < b.en.toLowerCase() ? -1 : 1;
    });
}
function tmSkillName(s) { if (!s)
    return ''; return TM_LANG === 'es' && s.es ? s.es : s.en; }
// ---------- evidence from the MSS log ----------
// For each person and area: the completions they were on. Area skills only; a system skill has no log rows.
// ev[emp][canonArea] = { days: {day: 1}, rows: [ {day, labor share, std share, people} ], lastDay }
function tmEvidence(logs) {
    var ev = {};
    (logs || []).forEach(function (l) {
        if (!l.active || !l.day || !l.area || !l.people.length)
            return;
        var a = hubCanon(l.area), n = l.people.length;
        var share = l.labor !== null && l.labor > 0 ? hubShare(l.labor, n) : null;
        var stdShare = l.std !== null && l.std > 0 ? l.std / n : null;
        l.people.forEach(function (p) {
            var m = ev[p] = ev[p] || {};
            var e = m[a] = m[a] || { days: {}, rows: [], lastDay: '' };
            e.days[l.day] = 1;
            e.rows.push({ day: l.day, labor: share, std: stdShare, people: l.people });
            if (l.day > e.lastDay)
                e.lastDay = l.day;
        });
    });
    return ev;
}
// Pace over the rows with both a standard and labor minutes, last `days` plant days, at least `minN` completions (contract 7).
function tmPaceOf(rows, today, days, minN) {
    var from = hubAddDays(today, -days), std = 0, lab = 0, n = 0;
    (rows || []).forEach(function (r) { if (r.day > from && r.day <= today && r.std !== null && r.labor !== null && r.labor > 0) {
        std += r.std;
        lab += r.labor;
        n++;
    } });
    return { pace: n >= minN ? hubPace(std, lab) : null, n: n, std: std, labor: lab };
}
function tmEvidenceFor(ev, emp, skill) {
    if (!skill || skill.kind !== 'area')
        return null;
    var m = ev && ev[emp];
    var e = m ? m[hubCanon(skill.area || skill.key)] : null;
    return e || null;
}
function tmShiftsBetween(e, fromDay, toDay) {
    if (!e)
        return 0;
    var n = 0;
    Object.keys(e.days).forEach(function (d) { if ((!fromDay || d >= fromDay) && (!toDay || d <= toDay))
        n++; });
    return n;
}
function tmLaborBetween(e, fromDay, toDay) {
    if (!e)
        return 0;
    var t = 0;
    e.rows.forEach(function (r) { if ((!fromDay || r.day >= fromDay) && (!toDay || r.day <= toDay) && r.labor)
        t += r.labor; });
    return t;
}
// ---------- the model every tab draws ----------
// d = { employees, areas, skills, levels, certs, events, logs, assets, settings, today }  (normalized rows)
function tmBuildModel(d) {
    var S = tmMergeSettings(d.settings), today = d.today;
    var people = (d.employees || []).filter(function (p) { return p.active; }).sort(function (a, b) { return a.crew !== b.crew ? (a.crew < b.crew ? -1 : 1) : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1); });
    var byId = {}, byName = {};
    (d.employees || []).forEach(function (p) {
        if (p.id)
            byId[p.id] = p;
        var cn = hubCanon(p.name);
        if (cn && (!byName[cn] || (p.active && !byName[cn].active)))
            byName[cn] = p;
    });
    var savedSkills = (d.skills || []).filter(function (s) { return s.active && s.key; });
    var skillsFromAreas = !savedSkills.length && d.areas && d.areas.length ? tmDraftSkills(d.areas, []) : [];
    var skills = tmSortSkills(savedSkills.length ? savedSkills : skillsFromAreas);
    var skillByKey = {}, skillByCanon = {};
    skills.forEach(function (s) {
        skillByKey[s.key] = s;
        if (hubCanon(s.key))
            skillByCanon[hubCanon(s.key)] = s;
        if (hubCanon(s.en))
            skillByCanon[hubCanon(s.en)] = s;
        if (hubCanon(s.area))
            skillByCanon[hubCanon(s.area)] = s;
    });
    // The newest row wins when two rows carry the same key (a second device before the fixed ids, or a hand edit).
    var cell = {};
    (d.levels || []).forEach(function (l) {
        if (!l.active || !l.emp || !l.skill)
            return;
        var k = tmLevelKey(l.emp, l.skill), old = cell[k];
        if (!old || (l.modified || 0) > (old.modified || 0))
            cell[k] = l;
    });
    // Merge live _t_ Employee certification rows (promoted from Supervisor Hub checklists or Manager Hub Training & Certs).
    var certs = (d.certs || []).filter(function (c) { return c.active; }).map(function (c) {
        var empObj = (c.emp && byId[c.emp]) ? byId[c.emp] : (c.empName ? byName[hubCanon(c.empName)] : null);
        var skObj = (c.skill && skillByKey[c.skill]) ? skillByKey[c.skill] : (skillByCanon[hubCanon(c.skill)] || skillByCanon[hubCanon(c.skillName)] || null);
        var resolvedEmp = empObj ? empObj.id : c.emp;
        var resolvedSkill = skObj ? skObj.key : (c.skill || c.skillName);
        if (resolvedEmp && resolvedSkill && skillByKey[resolvedSkill]) {
            var ck = tmLevelKey(resolvedEmp, resolvedSkill), prev = cell[ck];
            if (!prev || (c.modified || 0) >= (prev.modified || 0)) {
                cell[ck] = {
                    id: prev ? prev.id : '',
                    certId: c.id,
                    certKey: c.key,
                    key: ck,
                    emp: resolvedEmp,
                    empName: empObj ? empObj.name : c.empName,
                    crew: empObj ? empObj.crew : c.crew,
                    skill: resolvedSkill,
                    level: c.level,
                    started: (prev && prev.started) ? prev.started : (c.level >= 1 ? c.certified : ''),
                    qualified: c.level >= 2 ? (c.certified || (prev ? prev.qualified : '')) : '',
                    trainerOn: c.level >= 3 ? (c.certified || (prev ? prev.trainerOn : '')) : '',
                    signedBy: c.verifiedBy || c.trainerName || (prev ? prev.signedBy : ''),
                    note: c.note || (prev ? prev.note : ''),
                    modified: Math.max(c.modified || 0, prev ? (prev.modified || 0) : 0),
                    active: true
                };
            }
            else if (prev) {
                prev.certId = c.id;
                prev.certKey = c.key;
            }
        }
        return {
            id: c.id, key: c.key, emp: resolvedEmp, empName: empObj ? empObj.name : c.empName,
            crew: empObj ? empObj.crew : c.crew, skill: resolvedSkill, skillName: skObj ? tmSkillName(skObj) : (c.skillName || c.skill),
            category: c.category, level: c.level, certified: c.certified, expires: c.expires,
            trainerName: c.trainerName, verifiedBy: c.verifiedBy, checklistId: c.checklistId,
            status: c.status, note: c.note, modified: c.modified
        };
    }).sort(function (a, b) { return (b.certified || '') < (a.certified || '') ? -1 : 1; });
    var events = (d.events || []).slice().sort(function (a, b) { return (b.day || '') < (a.day || '') ? -1 : (b.day || '') > (a.day || '') ? 1 : (b.at || 0) - (a.at || 0); });
    var ev = tmEvidence(d.logs);
    var assetsByArea = {};
    (d.assets || []).forEach(function (a) { if (!a.active || !a.area)
        return; var k = hubCanon(a.area); (assetsByArea[k] = assetsByArea[k] || []).push(a); });
    function levelOf(emp, sk) { var c = cell[tmLevelKey(emp, sk)]; return c ? c.level : 0; }
    // The newest refresher (or manual read on an area) also counts as having done the skill recently.
    var refreshed = {};
    events.forEach(function (e) { if ((e.kind === 'refresher') && e.emp && e.skill && e.day) {
        var k = tmLevelKey(e.emp, e.skill);
        if (!refreshed[k] || e.day > refreshed[k])
            refreshed[k] = e.day;
    } });
    // Per cell: level, evidence, marks.
    var cells = {};
    people.forEach(function (p) {
        skills.forEach(function (s) {
            var c = cell[tmLevelKey(p.id, s.key)] || null, lv = c ? c.level : 0;
            var e = tmEvidenceFor(ev, p.id, s);
            var pace = e ? tmPaceOf(e.rows, today, S.paceDays, S.minCompletions) : { pace: null, n: 0 };
            var shifts = e ? Object.keys(e.days).length : 0;
            var sinceStart = e && c && c.started ? tmShiftsBetween(e, c.started, today) : shifts;
            var minS = s.minShifts !== null && s.minShifts !== undefined ? s.minShifts : S.minShifts;
            var refDays = s.refresherDays !== null && s.refresherDays !== undefined ? s.refresherDays : S.refresherDays;
            var ready = s.kind === 'area' && lv === 1 && sinceStart >= minS && (pace.pace === null || pace.pace >= S.readyPace);
            var lastDay = e ? e.lastDay : '';
            var lastKnown = [lastDay, c ? c.qualified : '', c ? c.trainerOn : '', refreshed[tmLevelKey(p.id, s.key)] || ''].reduce(function (x, y) { return y && y > x ? y : x; }, '');
            var refresh = s.kind === 'area' && lv >= 2 && refDays > 0 && !!lastKnown && lastKnown < hubAddDays(today, -refDays);
            // Training sessions on the floor: a completion with a Learning person and a Trainer on the same area.
            var sessions = 0;
            if (e && lv <= 1)
                e.rows.forEach(function (r) { if (r.people.some(function (o) { return o !== p.id && levelOf(o, s.key) === 3; }))
                    sessions++; });
            cells[tmLevelKey(p.id, s.key)] = { emp: p.id, skill: s.key, level: lv, row: c, shifts: shifts, sinceStart: sinceStart, minShifts: minS, pace: pace.pace, paceN: pace.n, labor: e ? tmLaborBetween(e, '', today) : 0, lastDay: lastDay, ready: ready, refresh: refresh, refreshDays: refDays, sessions: sessions };
        });
    });
    // Time to qualify per skill: shifts from the first Learning day to the Qualified day (baseline levels have no dates and do not count).
    var ttq = {};
    skills.forEach(function (s) {
        var list = [];
        Object.keys(cell).forEach(function (k) {
            var c = cell[k];
            if (c.skill !== s.key || !c.started || !c.qualified || c.qualified < c.started)
                return;
            var e = tmEvidenceFor(ev, c.emp, s);
            list.push({ emp: c.emp, days: tmDiffDays(c.started, c.qualified), shifts: tmShiftsBetween(e, c.started, c.qualified), labor: tmLaborBetween(e, c.started, c.qualified) });
        });
        ttq[s.key] = { list: list, medianShifts: tmMedian(list.map(function (x) { return x.shifts; })), medianDays: tmMedian(list.map(function (x) { return x.days; })), medianLabor: tmMedian(list.map(function (x) { return x.labor; })) };
    });
    // Coverage: people at Qualified or Trainer per crew and area skill, against the heads the area needs (craa5_heads, the most any piece needs).
    var crews = ['A', 'B', 'C', 'D'];
    var coverage = skills.map(function (s) {
        var need = null;
        if (s.kind === 'area')
            (assetsByArea[hubCanon(s.area || s.key)] || []).forEach(function (a) { if (a.heads !== null && a.heads > 0 && (need === null || a.heads > need))
                need = a.heads; });
        var needN = need === null ? 1 : need;
        var by = {};
        crews.forEach(function (cr) {
            var q = 0, l = 0;
            people.forEach(function (p) { if (p.crew !== cr)
                return; var lv = levelOf(p.id, s.key); if (lv >= 2)
                q++;
            else if (lv === 1)
                l++; });
            by[cr] = { qualified: q, learning: l, need: needN, state: q < needN ? 'short' : q === needN ? 'nospare' : 'ok' };
        });
        return { skill: s, need: need, needN: needN, byCrew: by };
    });
    // People: breadth, pace, time to qualify against the median, lists.
    var areaSkills = skills.filter(function (s) { return s.kind === 'area'; });
    var personStats = {};
    people.forEach(function (p) {
        var q = 0, learning = 0, trainer = 0, allRows = [], faster = 0, slowLearning = [], lowPace = [], refresh = [], ready = [];
        skills.forEach(function (s) {
            var c = cells[tmLevelKey(p.id, s.key)];
            if (c.level >= 2)
                q++;
            if (c.level === 1)
                learning++;
            if (c.level === 3)
                trainer++;
            if (c.ready)
                ready.push(s.key);
            if (c.refresh)
                refresh.push(s.key);
            var e = tmEvidenceFor(ev, p.id, s);
            if (e)
                allRows = allRows.concat(e.rows);
            var t = ttq[s.key], mine = t ? t.list.filter(function (x) { return x.emp === p.id; })[0] : null;
            if (mine && t.list.length >= 2 && t.medianShifts !== null && mine.shifts < t.medianShifts)
                faster++;
            if (c.level === 1 && s.kind === 'area') {
                var base = t && t.list.length >= 2 && t.medianShifts ? t.medianShifts : c.minShifts;
                if (base > 0 && c.sinceStart >= S.slowFactor * base)
                    slowLearning.push(s.key);
            }
            if (c.level >= 2 && c.pace !== null && c.pace < S.coachPace)
                lowPace.push(s.key);
        });
        var aq = areaSkills.filter(function (s) { return cells[tmLevelKey(p.id, s.key)].level >= 2; }).length;
        var pace = tmPaceOf(allRows, today, S.paceDays, S.minCompletions);
        personStats[p.id] = {
            qualified: q, learning: learning, trainer: trainer, areaQualified: aq, areaTotal: areaSkills.length,
            breadth: areaSkills.length ? Math.round(100 * aq / areaSkills.length) : null,
            pace: pace.pace, paceN: pace.n, faster: faster, slowLearning: slowLearning, lowPace: lowPace, refresh: refresh, ready: ready
        };
    });
    // Trainers: people they took from Learning to Qualified (a trainer named on the Qualified event), and how fast.
    var trainerOf = {};
    events.forEach(function (e) { if (e.kind === 'level' && e.to === 2 && e.trainer)
        (trainerOf[e.trainer] = trainerOf[e.trainer] || []).push(e); });
    var high = [], action = [];
    people.forEach(function (p) {
        var st = personStats[p.id], why = [];
        if (st.faster >= 2)
            why.push({ k: 'faster', n: st.faster });
        if (st.pace !== null && st.pace >= S.highPace)
            why.push({ k: 'pace', pace: st.pace, n: st.paceN });
        var tr = trainerOf[p.id] || [], quick = 0;
        tr.forEach(function (e) { var t = ttq[e.skill], mine = t ? t.list.filter(function (x) { return x.emp === e.emp; })[0] : null; if (mine && t.medianShifts !== null && t.list.length >= 2 && mine.shifts <= t.medianShifts)
            quick++; });
        if (quick >= 2)
            why.push({ k: 'trainer', n: quick });
        if (why.length)
            high.push({ emp: p.id, why: why });
        var bad = [];
        if (st.slowLearning.length)
            bad.push({ k: 'slow', skills: st.slowLearning });
        if (st.pace !== null && st.pace < S.coachPace)
            bad.push({ k: 'pace', pace: st.pace, n: st.paceN });
        else if (st.lowPace.length)
            bad.push({ k: 'areapace', skills: st.lowPace });
        if (st.refresh.length)
            bad.push({ k: 'refresh', skills: st.refresh });
        if (bad.length)
            action.push({ emp: p.id, why: bad });
    });
    var readyList = [], refreshList = [];
    people.forEach(function (p) { skills.forEach(function (s) { var c = cells[tmLevelKey(p.id, s.key)]; if (c.ready)
        readyList.push(c); if (c.refresh)
        refreshList.push(c); }); });
    readyList.sort(function (a, b) { return b.sinceStart - a.sinceStart; });
    refreshList.sort(function (a, b) { return (a.lastDay || '') < (b.lastDay || '') ? -1 : 1; });
    return {
        settings: S, today: today, people: people, byId: byId, skills: skills, skillsAreDraft: !savedSkills.length && skills.length > 0,
        skillByKey: skillByKey, cells: cells, cellRows: cell, certs: certs,
        events: events, ttq: ttq, coverage: coverage, personStats: personStats, high: high, action: action,
        readyList: readyList, refreshList: refreshList, logCount: (d.logs || []).filter(function (l) { return l.active && l.people.length; }).length,
        assetsByArea: assetsByArea
    };
}
function tmMedian(arr) {
    var a = (arr || []).filter(function (x) { return x !== null && x !== undefined && isFinite(x); }).sort(function (x, y) { return x - y; });
    if (!a.length)
        return null;
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
function tmDiffDays(a, b) {
    var ta = Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10)), tb = Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10));
    return Math.round((tb - ta) / 86400000);
}
// "Oct 21" / "21 oct" from a plant day.
var TM_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var TM_MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function tmFmtYmd(ymd) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(String(ymd || '')))
        return '--';
    var m = +ymd.slice(5, 7) - 1, d = +ymd.slice(8, 10);
    return TM_LANG === 'es' ? d + ' ' + TM_MONTHS_ES[m] + ' ' + ymd.slice(0, 4) : TM_MONTHS[m] + ' ' + d + ', ' + ymd.slice(0, 4);
}
// ---------- rights ----------
// Who may do what. dev = on the developer list (or the list is empty). Role comes from the employee rows matching the
// signed-in user's e-mail or canonical name, picking the highest role rank when two rows exist (e.g. Acting Supervisor + Acting Manager).
function tmRights(user, employees, S) {
    var me = null, bestRank = -1, fallbackCrew = '';
    var uEmail = user && user.email ? String(user.email).trim().toLowerCase() : '';
    var uCanon = user && user.name ? hubCanon(tmPlainName(user.name)) : '';
    if (uEmail || uCanon) {
        (employees || []).forEach(function (p) {
            if (p.enabled === false)
                return;
            var emailMatch = !!(uEmail && p.email && p.email === uEmail);
            var nameMatch = !!(uCanon && p.name && hubCanon(p.name) === uCanon);
            if (!emailMatch && !nameMatch)
                return;
            if (p.crew && !fallbackCrew)
                fallbackCrew = p.crew;
            var rRank = p.role && TM_ROLE_RANK[p.role] !== undefined ? TM_ROLE_RANK[p.role] : 0;
            if (!me || rRank > bestRank || (rRank === bestRank && p.crew && !me.crew)) {
                me = p;
                bestRank = rRank;
            }
        });
    }
    if (me && !me.crew && fallbackCrew) {
        var meCopy = {};
        for (var k in me)
            if (Object.prototype.hasOwnProperty.call(me, k))
                meCopy[k] = me[k];
        meCopy.crew = fallbackCrew;
        me = meCopy;
    }
    var role = me ? me.role : '';
    var rank = role ? TM_ROLE_RANK[role] : -1;
    var dev = tmIsDev(user, S.devUsers);
    var locked = S.devUsers && S.devUsers.length > 0;
    return {
        me: me, role: role, dev: dev && !!user,
        signQualified: (locked && dev) || rank >= 2 || (rank === 1 && S.leadsSignOff),
        setLearning: (locked && dev) || rank >= 1,
        setTrainer: (locked && dev) || rank >= 2,
        baseline: (locked && dev) || rank >= 2,
        lists: (locked && dev) || rank >= 2
    };
}
// The highest level this person may set (or 0 when only viewing). Lowering is allowed to the same people.
function tmMaxLevel(r) { return r.setTrainer ? 3 : r.signQualified ? 2 : r.setLearning ? 1 : -1; }
// ---------- writes (bodies only; the app sends them) ----------
// The Skill level row for a change. Dates are filled once, when a level is first reached; going down clears the dates above it.
function tmLevelBody(person, skill, old, level, who, today, note, baseline) {
    var b = {
        craa5_levelkey: tmLevelKey(person.id, skill.key), craa5_employeeguid: person.id, craa5_employeename: person.name,
        craa5_shiftcode: person.crew, craa5_skillkey: skill.key, craa5_level: String(level),
        craa5_signedby: who.name || who.email || '', craa5_signedbyemail: who.email || ''
    };
    var o = old || {};
    if (!baseline) {
        b.craa5_startedon = level >= 1 ? (o.started || today) : null;
        b.craa5_qualifiedon = level >= 2 ? (o.qualified || today) : null;
        b.craa5_traineron = level >= 3 ? (o.trainerOn || today) : null;
    }
    else {
        // A baseline says where someone already is: no dates, so it never counts toward time to qualify.
        b.craa5_startedon = level >= 1 ? (o.started || null) : null;
        b.craa5_qualifiedon = level >= 2 ? (o.qualified || null) : null;
        b.craa5_traineron = level >= 3 ? (o.trainerOn || null) : null;
    }
    if (note !== undefined && note !== null)
        b.craa5_note = String(note).slice(0, 2000);
    return b;
}
function tmLevelRowId(levelKey) { return hubIdFromKey('skilllevel|' + levelKey); }
function tmEventBody(kind, person, skill, from, to, who, today, evidence, trainer, source, stamp) {
    var key = person.id + '|' + skill.key + '|' + kind + '|' + (stamp || Date.now());
    var b = {
        craa5_eventkey: key, craa5_employeeguid: person.id, craa5_employeename: person.name, craa5_skillkey: skill.key,
        craa5_kind: kind, craa5_fromlevel: from, craa5_tolevel: to, craa5_markedby: who.name || who.email || '',
        craa5_eventdate: today, craa5_evidence: String(evidence || '').slice(0, 2000), craa5_source: source || 'Training page'
    };
    if (trainer && trainer.id) {
        b.craa5_trainerguid = trainer.id;
        b.craa5_trainername = trainer.name;
    }
    return b;
}
function tmEventRowId(eventKey) { return hubIdFromKey('trainingevent|' + eventKey); }
function tmSkillBody(s) {
    return {
        craa5_skillkey: s.key, craa5_nameen: s.en, craa5_namees: s.es, craa5_kind: s.kind, craa5_side: s.side, craa5_area: s.kind === 'area' ? (s.area || s.key) : '',
        craa5_minshifts: s.minShifts === null || s.minShifts === undefined ? null : s.minShifts,
        craa5_refresherdays: s.refresherDays === null || s.refresherDays === undefined ? null : s.refresherDays,
        craa5_ladderitem: s.ladder || '', craa5_manualen: s.manualEn || '', craa5_manuales: s.manualEs || '',
        craa5_sortorder: s.sort === null || s.sort === undefined ? null : s.sort, craa5_active: s.active !== false
    };
}
function tmSkillRowId(key) { return hubIdFromKey('skill|' + hubCanon(key)); }
function tmCertKey(empId, skillKey) { return 'CERT-' + hubCanon(empId).slice(0, 12) + '-' + hubCanon(skillKey).slice(0, 24); }
function tmCertRowId(certKey) { return hubIdFromKey('empcert|' + certKey); }
function tmCertBody(person, skill, old, level, who, today, note, trainer, refresherDays) {
    var ck = (old && old.certKey) ? old.certKey : tmCertKey(person.id, skill.key);
    var certDate = level >= 2 ? ((old && old.qualified) || today) : (level === 1 ? ((old && old.started) || today) : today);
    var expDays = (skill && skill.refresherDays) ? skill.refresherDays : (refresherDays || 365);
    var expDate = level >= 2 && expDays > 0 ? hubAddDays(certDate, expDays) : '';
    var status = level === 3 ? 'Trainer' : level === 2 ? 'Qualified' : level === 1 ? 'Learning' : 'Not Trained';
    return {
        craa5_certkey: ck,
        craa5_employeeguid: person.id,
        craa5_employeename: person.name,
        craa5_shiftcode: person.crew || '',
        craa5_skillkey: skill.key,
        craa5_skillname: skill.en || skill.key,
        craa5_category: skill.kind === 'system' ? 'System Skill' : 'MSS Area',
        craa5_level: level,
        craa5_certifieddate: certDate,
        craa5_expirationdate: expDate,
        craa5_trainername: (trainer && trainer.name) ? trainer.name : (who.name || who.email || ''),
        craa5_verifiedby: who.name || who.email || '',
        craa5_status: status,
        craa5_notes: String(note || '').slice(0, 2000)
    };
}
// ==== END TRAINING ENGINE ====
// ==== TRAINING TABLES ====
// What the page reads (made by other apps) and the four _t_ tables it owns (data contract 3 and 12; contract.json lists them).
var TM_APP_VERSION = '1.1.0';
var TM_TABLES = {
    employees: { names: ['craa5___1_a_employee', 'craa5___1_a_employee'], label: 'Employees', owner: 'People page / Shift Start' },
    areas: { names: ['craa5___1_a_mss_area'], label: 'MSS areas (the area names)', owner: 'MSS' },
    assets: { names: ['craa5___1_a_assets'], label: 'Equipment (standard minutes, heads, SSOP)', owner: 'Ganttly' },
    msslog: { names: ['craa5___1_l_log'], label: 'MSS log (finished cleans: who, minutes)', owner: 'Ganttly, MSS Log Input, MSS Calendar' },
    skill: { names: ['craa5___1_t_skill', 'craa5_t_skill'], label: '_t_ Skill', owner: 'Training matrix', mine: true },
    skilllevel: { names: ['craa5___1_t_skilllevel', 'craa5___1_t_skilllevel', 'craa5_t_skilllevel'], label: '_t_ Skill level', owner: 'Training matrix', mine: true },
    cert: { names: ['craa5___1_t_cert', 'craa5_t_employeecertification'], label: '_t_ Employee certification', owner: 'Training matrix, Supervisor Hub, Manager Hub', mine: true },
    event: { names: ['craa5___1_t_event', 'craa5_t_trainingevent'], label: '_t_ Training event', owner: 'Training matrix', mine: true },
    config: { names: HUB_CONFIG_TABLES, label: 'Hub config (training_settings)', owner: 'Training matrix writes its own key' }
};
// The employee columns are named one by one: the table also holds a PIN column that this page must never read.
var TM_READ = {
    employees: ['craa5_name', 'craa5_shift', 'craa5_role', 'craa5_email', 'statecode'],
    areas: ['craa5_area', 'craa5_parentroom', 'statecode'],
    assets: ['craa5___1_a_assetsid', 'craa5_equipmentidentifier', 'craa5_areaname', 'craa5_hoursrequired', 'craa5_heads', 'craa5_ssop', 'statecode'],
    msslog: ['craa5_equipmentguid', 'craa5_area', 'craa5_shiftdate', 'craa5_lastcleaned', 'craa5_laborminutes', 'craa5_employeeguids', 'craa5_cleankind', 'statecode']
};
var TM_COLS = {
    skill: ['craa5_skillkey', 'craa5_nameen', 'craa5_namees', 'craa5_kind', 'craa5_side', 'craa5_area', 'craa5_minshifts', 'craa5_refresherdays', 'craa5_ladderitem', 'craa5_manualen', 'craa5_manuales', 'craa5_sortorder', 'craa5_active'],
    skilllevel: ['craa5_levelkey', 'craa5_employeeguid', 'craa5_employeename', 'craa5_shiftcode', 'craa5_skillkey', 'craa5_level', 'craa5_startedon', 'craa5_qualifiedon', 'craa5_traineron', 'craa5_signedby', 'craa5_signedbyemail', 'craa5_note'],
    cert: ['craa5_certkey', 'craa5_employeename', 'craa5_employeeguid', 'craa5_shiftcode', 'craa5_skillkey', 'craa5_skillname', 'craa5_category', 'craa5_level', 'craa5_certifieddate', 'craa5_expirationdate', 'craa5_trainername', 'craa5_verifiedby', 'craa5_checklistid', 'craa5_status', 'craa5_notes'],
    event: ['craa5_eventkey', 'craa5_employeeguid', 'craa5_employeename', 'craa5_skillkey', 'craa5_kind', 'craa5_fromlevel', 'craa5_tolevel', 'craa5_minutes', 'craa5_trainerguid', 'craa5_trainername', 'craa5_markedby', 'craa5_eventdate', 'craa5_evidence', 'craa5_source']
};
var TM_MANIFEST = {
    appId: 'training', app: 'hub - training', version: TM_APP_VERSION,
    tables: [
        { t: 'craa5___1_a_employee', names: TM_TABLES.employees.names, read: ['craa5___1_a_employeeid'].concat(TM_READ.employees) },
        { t: 'craa5___1_a_mss_area', read: ['craa5___1_a_mss_areaid', 'craa5_area', 'statecode'], opt: ['craa5_parentroom'] },
        { t: 'craa5___1_a_assets', read: TM_READ.assets.filter(function (c) { return c !== 'craa5_ssop' && c !== 'craa5_heads'; }), opt: ['craa5_ssop', 'craa5_heads'] },
        { t: 'craa5___1_l_log', read: ['craa5___1_l_logid', 'craa5_equipmentguid', 'craa5_lastcleaned', 'statecode'], opt: ['craa5_area', 'craa5_shiftdate', 'craa5_laborminutes', 'craa5_employeeguids', 'craa5_cleankind'] },
        { t: 'craa5___1_t_skill', names: TM_TABLES.skill.names, read: TM_COLS.skill, write: TM_COLS.skill },
        { t: 'craa5___1_t_skilllevel', names: TM_TABLES.skilllevel.names, read: TM_COLS.skilllevel, write: TM_COLS.skilllevel },
        { t: 'craa5___1_t_cert', names: TM_TABLES.cert.names, read: TM_COLS.cert, write: TM_COLS.cert },
        { t: 'craa5___1_t_event', names: TM_TABLES.event.names, read: TM_COLS.event, write: TM_COLS.event }
    ],
    config: [TM_SETTINGS_KEY]
};
var TM_EMPTY_SRC = { rows: null, err: '', table: '' };
function tmLoadWord(src) {
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
function tmTagRows(rows, table) { return (rows || []).map(function (r) { var o = r; o.__id = tmCleanId(r[table + 'id'] || r.__id || ''); return o; }); }
function tmManifestIo(dataApi) {
    var wr = tmWriter(dataApi);
    return {
        query: function (t, o) { return tmQuery(dataApi, t, { select: o.select, filter: o.filter, top: o.top || 5, strictSelect: true }); },
        create: function (t, b) { return wr ? wr.create(t, b) : Promise.reject(new Error('no writer')); },
        update: function (t, id, b) { return wr ? wr.update(t, id, b) : Promise.reject(new Error('no writer')); }
    };
}
// A row with a fixed id (hubIdFromKey of its key): update it when it is known, else create it with that id; a create that
// finds the id already taken (another device was first) updates instead. Never two rows for one key (contract rule 6).
function tmUpsert(dataApi, table, knownId, fixedId, body) {
    var w = tmWriter(dataApi);
    if (!w)
        return Promise.reject(new Error(tmT('This page cannot write to Dataverse here.')));
    var colErr = function (e) { var m = tmErrText(e); if (tmErrKind(m) === 'column')
        throw new Error(tmT('A column is missing in {t}: {err}', { t: table, err: m })); throw new Error(m); };
    if (knownId)
        return w.update(table, knownId, body).then(function () { return knownId; }, colErr);
    var create = {};
    for (var k in body)
        if (Object.prototype.hasOwnProperty.call(body, k))
            create[k] = body[k];
    create[table + 'id'] = fixedId;
    return w.create(table, create).then(function (id) { return id || fixedId; }, function (e) {
        var m = tmErrText(e);
        if (/duplicate|already exists|cannot insert duplicate|0x80040237/i.test(m))
            return w.update(table, fixedId, body).then(function () { return fixedId; }, colErr);
        return colErr(e);
    });
}
// ---------- settings (Hub config key training_settings) ----------
// New _e_ Hub config: JSON in craa5_configjson. Old _0_ hubconfig: JSON in craa5_manifestjson (its configjson holds 100 characters).
// Resolves { settings (merged), saved (raw or null), table, col, id, err }. Empty JSON = no settings yet (contract 1.0.31).
function tmReadSettings(dataApi) {
    var spots = [[HUB_CONFIG_TABLES[0], 'craa5_configjson'], [HUB_CONFIG_TABLES[1], HUB_MANIFEST_COL]];
    var i = 0, lastErr = '';
    function next() {
        if (i >= spots.length)
            return Promise.resolve({ settings: tmMergeSettings(null), saved: null, table: '', col: '', id: '', err: lastErr || tmT('No Hub config table') });
        var sp = spots[i++];
        var cols = [sp[0] + 'id', 'craa5_configkey', sp[1]];
        if (sp[1] !== 'craa5_configjson')
            cols.push('craa5_configjson');
        return tmQuery(dataApi, sp[0], { select: cols, filter: "craa5_configkey eq '" + TM_SETTINGS_KEY + "' and statecode eq 0", top: 5, strictSelect: true }).then(function (r) {
            if (!r.rows) {
                lastErr = r.err || '';
                return next();
            }
            var row = r.rows[0], raw = null;
            if (row) {
                var txt = hubConfigJsonOf(row);
                if (txt && txt.trim()) {
                    try {
                        raw = JSON.parse(txt);
                    }
                    catch (e) {
                        raw = null;
                    }
                }
            }
            return { settings: tmMergeSettings(raw), saved: raw, table: sp[0], col: sp[1], id: row ? hubGuid(row[sp[0] + 'id']) : '', err: '' };
        });
    }
    return next();
}
function tmSaveSettings(dataApi, where, settings) {
    if (!where || !where.table)
        return Promise.reject(new Error(tmT('No Hub config table to save the settings in.')));
    var body = { craa5_configkey: TM_SETTINGS_KEY, craa5_configname: 'Training matrix settings' };
    body[where.col] = JSON.stringify(settings);
    return tmUpsert(dataApi, where.table, where.id, hubIdFromKey('hubconfig|' + TM_SETTINGS_KEY), body);
}
// ==== END TRAINING TABLES ====
// ==== TRAINING UI PARTS ====
// manager hub). v1.0 forgot this, which is why it showed up unstyled. The rules below add what Tailwind does not give:
// scrollbars you can see and grab, and the dark mode (the same class names, re-colored under .tm-dark with HUB_COLORS.dark).
var TM_DARK_RULES = [
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
function tmCssEsc(cls) { return cls.replace(/([\[\]#\/:.%(),])/g, '\\$1'); }
function tmStyleText() {
    var out = [
        '.tm-root{color-scheme:light}',
        '.tm-root.tm-dark{color-scheme:dark}',
        '.tm-root ::-webkit-scrollbar{width:12px;height:12px}',
        '.tm-root ::-webkit-scrollbar-track{background:rgba(148,163,184,0.15)}',
        '.tm-root ::-webkit-scrollbar-thumb{background:#94A3B8;border-radius:8px;border:2px solid transparent;background-clip:padding-box}',
        '.tm-root ::-webkit-scrollbar-thumb:hover{background:#64748B;background-clip:padding-box}',
        '.tm-root *{scrollbar-width:auto;scrollbar-color:#94A3B8 rgba(148,163,184,0.15)}',
        '.tm-root .tm-tabs::-webkit-scrollbar{height:6px}',
        '.tm-dark input,.tm-dark select,.tm-dark textarea{background-color:#1B2740;color:#E2E8F0;border-color:#3E4F6E}',
        '.tm-dark .divide-slate-100>:not([hidden])~:not([hidden]){border-color:#2B3A57}',
        '.tm-printonly{display:none}',
        '@media print{.tm-noprint{display:none!important}.tm-printonly{display:block!important}.tm-root{height:auto!important;overflow:visible!important}}'
    ];
    TM_DARK_RULES.forEach(function (r) {
        var sel = '.tm-dark .' + tmCssEsc(r[0]) + (r[2] ? ':hover' : '');
        out.push(sel + '{' + r[1] + '}');
    });
    return out.join('\n');
}
// Loads Tailwind once and puts this page's rules in the head. Calls back with false when Tailwind has not arrived in 8 seconds.
function tmEnsureStyles(onResult) {
    if (typeof document === 'undefined')
        return;
    var st = document.getElementById('training-style');
    if (!st) {
        st = document.createElement('style');
        st.id = 'training-style';
        document.head.appendChild(st);
    }
    st.textContent = tmStyleText();
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
var TM_ICON_PATH = {
    star: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z',
    sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
    lock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
    unlock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 6.8-1.2',
    check: 'M4 12.5l5 5L20 6.5',
    clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'
};
function TmIcon(props) {
    var fill = props.fill ? 'currentColor' : 'none';
    return (React.createElement("svg", { viewBox: "0 0 24 24", width: props.size || 16, height: props.size || 16, fill: fill, stroke: "currentColor", strokeWidth: props.fill ? 1 : 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: props.className || '', style: props.style },
        React.createElement("path", { d: TM_ICON_PATH[props.name] || '' })));
}
function TmChip(props) {
    return React.createElement("span", { className: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ' + (props.cls || 'bg-slate-100 text-slate-600 border-slate-200'), title: props.title || '' }, props.children);
}
function TmBtn(props) {
    var kind = props.kind || 'plain';
    var cls = kind === 'primary' ? 'bg-[#0072CE] hover:bg-[#00468B] text-white border-transparent'
        : kind === 'danger' ? 'bg-white hover:bg-red-50 text-red-700 border-red-200'
            : kind === 'ghost' ? 'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent'
                : 'bg-white hover:bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]';
    return (React.createElement("button", { type: "button", disabled: props.disabled, onClick: props.onClick, title: props.title || '', "aria-label": props.label || undefined, "aria-pressed": props.pressed, className: 'min-h-[36px] px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 ' + cls + ' ' + (props.className || '') }, props.children));
}
function TmCard(props) {
    return (React.createElement("section", { className: 'bg-white rounded-xl border border-slate-200 shadow-sm ' + (props.className || ''), style: props.accent ? { borderTop: '4px solid ' + props.accent } : undefined },
        props.title && (React.createElement("div", { className: "flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-100" },
            React.createElement("h2", { className: "text-sm font-black text-[#00468B] uppercase tracking-widest flex-1 min-w-[160px] inline-flex items-center gap-2" },
                props.icon,
                props.title),
            props.right)),
        React.createElement("div", { className: props.pad === false ? '' : 'p-4' }, props.children)));
}
function TmModal(props) {
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
                React.createElement(TmBtn, { kind: "ghost", onClick: props.onClose, title: tmT('Close') }, tmT('Close'))),
            React.createElement("div", { className: "p-5 space-y-4" }, props.children))));
}
function TmNote(props) {
    var tone = props.tone || 'info';
    var cls = tone === 'warn' ? 'bg-amber-50 border-amber-200 text-amber-800' : tone === 'bad' ? 'bg-red-50 border-red-200 text-red-800' : tone === 'good' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-[#E6F1FB] border-[#B3D4F2] text-[#00468B]';
    return React.createElement("div", { className: 'rounded-lg border px-3 py-2 text-sm ' + cls + ' ' + (props.className || '') }, props.children);
}
function TmNumInput(props) {
    return (React.createElement("input", { type: "number", inputMode: "decimal", value: props.value === null || props.value === undefined ? '' : props.value, min: props.min, step: props.step || 1, placeholder: props.placeholder || '', onChange: function (e) { var v = e.target.value; props.onChange(v === '' ? null : Number(v)); }, className: 'border border-slate-300 rounded-lg px-2 py-1 text-sm w-24 ' + (props.className || ''), "aria-label": props.label || '' }));
}
// A text box that saves when it loses focus (not on every key), like the work order hours.
function TmTextSave(props) {
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
    var printed = v ? React.createElement("div", { className: 'tm-printonly whitespace-pre-wrap text-sm ' + (props.className || '') }, v) : null; // the whole note on paper
    if (props.rows)
        return React.createElement(React.Fragment, null,
            React.createElement("textarea", { rows: props.rows, className: 'tm-noprint block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm ' + (props.className || ''), value: v, placeholder: props.placeholder || '', "aria-label": props.label || '', onChange: function (e) { st[1](e.target.value); }, onBlur: commit }),
            printed);
    return React.createElement(React.Fragment, null,
        React.createElement("input", { className: 'tm-noprint border border-slate-300 rounded-lg px-2 py-1 text-sm ' + (props.className || ''), value: v, placeholder: props.placeholder || '', "aria-label": props.label || '', onChange: function (e) { st[1](e.target.value); }, onBlur: commit, onKeyDown: function (e) { if (e.key === 'Enter')
                commit(); } }),
        printed);
}
// A big number tile. tone: good / warn / bad colors the line under the number; big = the debrief headline size.
function TmStat(props) {
    var tone = props.tone === 'bad' ? 'text-red-700' : props.tone === 'warn' ? 'text-amber-700' : props.tone === 'good' ? 'text-emerald-700' : 'text-slate-500';
    var bar = props.tone === 'bad' ? '#DC2626' : props.tone === 'warn' ? '#D97706' : props.tone === 'good' ? '#059669' : '#CBD5E1';
    return (React.createElement("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3", style: { borderLeft: '4px solid ' + bar } },
        React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, props.label),
        React.createElement("div", { className: (props.big ? 'text-3xl' : 'text-xl') + ' font-black text-slate-800 mt-1 break-words' }, props.value),
        props.sub && React.createElement("div", { className: 'text-xs mt-0.5 ' + tone }, props.sub)));
}
// ==== END TRAINING UI PARTS ====
// Turns what was read plus the saved plan into the one picture every tab draws (lines, shifts, schedule, costs, debrief).
// ==== TRAINING MATRIX TAB ====
function tmLevelLabel(n) { var l = TM_LEVELS[n] || TM_LEVELS[0]; return tmT(l.label); }
// One cell: the level number on its color, a gold dot when ready for sign-off, an amber dashed edge when a refresher is due.
function TmLevelCell(props) {
    var c = props.cell || { level: 0 };
    var st = TM_LEVEL_STYLE[c.level] || TM_LEVEL_STYLE[0];
    var dark = props.dark;
    var title = tmLevelLabel(c.level) + (c.ready ? ' - ' + tmT('ready for sign-off') : '') + (c.refresh ? ' - ' + tmT('needs a refresher') : '');
    var look = { width: 34, height: 28, backgroundColor: dark ? st.darkBg : st.bg, color: dark ? st.darkFg : st.fg, border: (c.refresh ? '2px dashed #D97706' : '1px solid ' + st.border) };
    var inner = [c.level === 3 ? React.createElement(TmIcon, { key: "i", name: "star", fill: true, size: 13, style: { color: '#FFB81C' } }) : String(c.level), c.ready ? React.createElement("span", { key: "r", "data-ready": "1", className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full", style: { backgroundColor: '#FFB81C', border: '1px solid #FFFFFF' } }) : null];
    // The legend and the modal header show a cell that is only a picture: a span, not a button.
    if (!props.onClick)
        return React.createElement("span", { className: "relative inline-flex items-center justify-center rounded-md text-xs font-black", style: look, title: title, "aria-hidden": "true" }, inner);
    return (React.createElement("button", { type: "button", "data-cell": c.emp + '|' + c.skill, "data-level": c.level, onClick: props.onClick, title: title, "aria-label": (props.who || '') + ', ' + (props.what || '') + ': ' + title, className: "relative inline-flex items-center justify-center rounded-md text-xs font-black", style: look }, inner));
}
function TmLegend(props) {
    return (React.createElement("div", { className: "flex flex-wrap items-center gap-3 text-xs text-slate-600" },
        TM_LEVELS.map(function (l) { return React.createElement("span", { key: l.n, className: "inline-flex items-center gap-1.5" },
            React.createElement(TmLevelCell, { cell: { level: l.n }, dark: props.dark }),
            tmT(l.label)); }),
        React.createElement("span", { className: "inline-flex items-center gap-1.5" },
            React.createElement(TmLevelCell, { cell: { level: 1, ready: true }, dark: props.dark }),
            tmT('Ready for sign-off')),
        React.createElement("span", { className: "inline-flex items-center gap-1.5" },
            React.createElement(TmLevelCell, { cell: { level: 2, refresh: true }, dark: props.dark }),
            tmT('Needs a refresher'))));
}
function tmCrewOptions() { return [['all', 'All crews'], ['A', 'A shift'], ['B', 'B shift'], ['C', 'C shift'], ['D', 'D shift']]; }
function TmFilters(props) {
    var f = props.filter;
    return (React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
        React.createElement("select", { className: "border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: f.crew, onChange: function (e) { props.onChange({ crew: e.target.value }); }, "aria-label": tmT('Crew') }, tmCrewOptions().map(function (o) { return React.createElement("option", { key: o[0], value: o[0] }, tmT(o[1])); })),
        React.createElement("select", { className: "border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: f.side, onChange: function (e) { props.onChange({ side: e.target.value }); }, "aria-label": tmT('Side') },
            React.createElement("option", { value: "all" }, tmT('All skills')),
            React.createElement("option", { value: "Raw" }, tmT('Raw side')),
            React.createElement("option", { value: "RTE" }, tmT('RTE side')),
            React.createElement("option", { value: "system" }, tmT('System skills'))),
        React.createElement("input", { className: "border border-slate-300 rounded-lg px-2 py-1.5 text-sm w-44", placeholder: tmT('Find a person'), value: f.q, onChange: function (e) { props.onChange({ q: e.target.value }); }, "aria-label": tmT('Find a person') })));
}
function tmFilterPeople(m, f) {
    var q = hubCanon(f.q);
    return m.people.filter(function (p) { return (f.crew === 'all' || p.crew === f.crew) && (!q || hubCanon(p.name).indexOf(q) > -1); });
}
function tmFilterSkills(m, f) {
    return m.skills.filter(function (s) { return f.side === 'all' || (f.side === 'system' ? s.kind === 'system' : s.kind === 'area' && (s.side === f.side || s.side === 'Both')); });
}
function TmMatrixTab(props) {
    var m = props.m, f = props.filter;
    var people = tmFilterPeople(m, f), skills = tmFilterSkills(m, f);
    var cov = {};
    m.coverage.forEach(function (c) { cov[c.skill.key] = c; });
    if (!m.skills.length)
        return (React.createElement(TmCard, { title: tmT('Training matrix') },
            React.createElement(TmNote, { tone: "warn" }, tmT('There are no skills yet. An admin opens Setup (click the logo), drafts the skill list from the MSS areas, checks it and saves it.'))));
    return (React.createElement(TmCard, { title: tmT('Training matrix'), right: React.createElement(TmFilters, { filter: f, onChange: props.onFilter }), pad: false },
        React.createElement("div", { className: "px-4 pt-3 pb-2 space-y-2" },
            React.createElement(TmLegend, { dark: props.dark }),
            React.createElement("p", { className: "text-xs text-slate-500" }, tmT('Click a square to see the evidence and change the level. The numbers under each skill are the people at Qualified or Trainer in the crew shown, against the people the area needs.'))),
        !people.length ? React.createElement("div", { className: "p-4" },
            React.createElement(TmNote, null, tmT('Nobody matches. Change the crew or the search.'))) : (React.createElement("div", { style: { overflow: 'auto', maxHeight: props.maxHeight || 640 } },
            React.createElement("table", { className: "text-sm border-separate", style: { borderSpacing: 0 }, "data-matrix": "1" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "sticky left-0 top-0 z-20 bg-white border-b border-slate-200 px-3 py-2 text-left text-xs font-black text-slate-500 uppercase", style: { minWidth: 180 } }, tmT('Person')),
                        skills.map(function (s) {
                            var c = cov[s.key], q = 0, need = c ? c.needN : 1;
                            if (c) {
                                if (f.crew === 'all')
                                    ['A', 'B', 'C', 'D'].forEach(function (cr) { q += c.byCrew[cr].qualified; });
                                else
                                    q = c.byCrew[f.crew].qualified;
                            }
                            var short = f.crew !== 'all' && c && c.byCrew[f.crew].state === 'short';
                            return (React.createElement("th", { key: s.key, className: "sticky top-0 z-10 bg-white border-b border-slate-200 px-1 py-2 align-bottom", style: { minWidth: 44 } },
                                React.createElement("button", { type: "button", onClick: function () { props.onSkill(s.key); }, className: "block mx-auto text-[11px] font-bold text-[#00468B] hover:underline", style: { writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, title: tmSkillName(s) }, tmSkillName(s)),
                                s.kind === 'area' && React.createElement("div", { className: 'text-[10px] font-bold mt-1 text-center ' + (short ? 'text-amber-700' : 'text-slate-400'), title: tmT('Qualified or Trainer / people needed') },
                                    q,
                                    f.crew !== 'all' ? '/' + need : '')));
                        }),
                        React.createElement("th", { className: "sticky top-0 z-10 bg-white border-b border-slate-200 px-2 py-2 text-xs font-black text-slate-500 uppercase text-left" }, tmT('Qualified')))),
                React.createElement("tbody", null, people.map(function (p) {
                    var st = m.personStats[p.id];
                    return (React.createElement("tr", { key: p.id, "data-person": p.id },
                        React.createElement("td", { className: "sticky left-0 z-10 bg-white border-b border-slate-100 px-3 py-1" },
                            React.createElement("button", { type: "button", className: "text-left font-semibold text-slate-800 hover:underline", onClick: function () { props.onPerson(p.id); } }, p.name),
                            React.createElement("div", { className: "text-[11px] text-slate-400" },
                                tmT('{c} shift', { c: p.crew }),
                                p.role !== 'employee' ? ' - ' + tmT(p.role === 'lead' ? 'Lead' : p.role === 'supervisor' ? 'Supervisor' : 'Manager') : '')),
                        skills.map(function (s) {
                            var c = m.cells[tmLevelKey(p.id, s.key)];
                            return React.createElement("td", { key: s.key, className: "border-b border-slate-100 px-1 py-1 text-center" },
                                React.createElement(TmLevelCell, { cell: c, dark: props.dark, who: p.name, what: tmSkillName(s), onClick: function () { props.onCell(p.id, s.key); } }));
                        }),
                        React.createElement("td", { className: "border-b border-slate-100 px-2 py-1 text-xs text-slate-600 whitespace-nowrap" },
                            st.qualified,
                            st.breadth !== null ? ' (' + st.breadth + '% ' + tmT('of areas') + ')' : '')));
                })))))));
}
// ---------- one cell: evidence, history, change the level ----------
function TmEvidenceLines(props) {
    var c = props.cell, s = props.skill, m = props.m;
    if (s.kind !== 'area')
        return React.createElement("p", { className: "text-sm text-slate-500" }, tmT('A system skill has no cleans in the MSS log, so the level is the evidence.'));
    var t = m.ttq[s.key];
    return (React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2" },
        React.createElement(TmStat, { label: tmT('Shifts on this area'), value: String(c.shifts), sub: tmT('in the MSS log, last {d} days', { d: m.settings.evidenceDays }) }),
        React.createElement(TmStat, { label: tmT('Labor'), value: tmFmtHours(c.labor), sub: tmT('their share of the minutes') }),
        React.createElement(TmStat, { label: tmT('Pace'), value: c.pace === null ? '--' : String(c.pace), sub: c.pace === null ? tmT('{n} of {min} completions with a standard', { n: c.paceN, min: m.settings.minCompletions }) : tmT('100 = on standard, last {d} days', { d: m.settings.paceDays }), tone: c.pace === null ? '' : c.pace >= 100 ? 'good' : c.pace < m.settings.coachPace ? 'warn' : '' }),
        React.createElement(TmStat, { label: tmT('Last done'), value: c.lastDay ? tmFmtYmd(c.lastDay) : '--', sub: t && t.medianShifts !== null ? tmT('usual time to qualify: {n} shifts', { n: tmFmtNum(t.medianShifts, 1) }) : tmT('no time to qualify yet'), tone: c.refresh ? 'warn' : '' })));
}
function TmHistory(props) {
    var list = props.events;
    if (!list.length)
        return React.createElement("p", { className: "text-sm text-slate-500" }, tmT('No changes saved yet.'));
    return (React.createElement("ul", { className: "divide-y divide-slate-100 text-sm" }, list.slice(0, props.max || 50).map(function (e, i) {
        return (React.createElement("li", { key: e.id || i, className: "py-1.5" },
            React.createElement("span", { className: "font-semibold text-slate-700" }, tmFmtYmd(e.day)),
            React.createElement("span", { className: "text-slate-600" },
                " - ",
                tmEventText(e, props.m)),
            e.by ? React.createElement("span", { className: "text-slate-400" },
                " - ",
                e.by) : null,
            e.evidence ? React.createElement("div", { className: "text-xs text-slate-500 whitespace-pre-wrap" }, e.evidence) : null));
    })));
}
function tmEventText(e, m) {
    var s = m && m.skillByKey[e.skill];
    var what = s ? tmSkillName(s) : e.skill;
    var lv = function (n) { return n === null || n === undefined ? '?' : tmLevelLabel(n); };
    if (e.kind === 'baseline')
        return tmT('{what}: starting level {to}', { what: what, to: lv(e.to) });
    if (e.kind === 'manualread')
        return tmT('{what}: manual read together', { what: what }) + (e.trainerName ? ' (' + e.trainerName + ')' : '');
    if (e.kind === 'refresher')
        return tmT('{what}: refresher done', { what: what });
    if (e.kind === 'session')
        return tmT('{what}: training session', { what: what }) + (e.minutes ? ' (' + tmFmtHours(e.minutes) + ')' : '');
    if (e.kind === 'removed')
        return tmT('{what}: level removed', { what: what });
    return tmT('{what}: {from} to {to}', { what: what, from: lv(e.from), to: lv(e.to) }) + (e.trainerName ? ' - ' + tmT('trainer {name}', { name: e.trainerName }) : '');
}
function TmCellModal(props) {
    var m = props.m, p = m.byId[props.emp], s = m.skillByKey[props.skill];
    var c = m.cells[tmLevelKey(props.emp, props.skill)];
    var maxLv = props.maxLevel;
    var pickState = useState(c ? c.level : 0);
    var pick = pickState[0];
    var evState = useState('');
    var evidence = evState[0];
    var trState = useState('');
    var trainer = trState[0];
    var sureState = useState(false);
    if (!p || !s || !c)
        return null;
    var history = m.events.filter(function (e) { return e.emp === p.id && e.skill === s.key; });
    var trainers = m.people.filter(function (o) { return o.id !== p.id && m.cells[tmLevelKey(o.id, s.key)].level === 3; });
    var changed = pick !== c.level, down = pick < c.level;
    var needsEvidence = changed && pick >= 2 && !down;
    var canPick = function (n) { return maxLv >= 0 && n <= maxLv && c.level <= maxLv; };
    var manual = TM_LANG === 'es' ? (s.manualEs || s.manualEn) : (s.manualEn || s.manualEs);
    var ssop = '';
    if (!manual && s.kind === 'area')
        (m.assetsByArea[hubCanon(s.area || s.key)] || []).forEach(function (a) { if (!ssop && /^https?:\/\//i.test(a.ssop))
            ssop = a.ssop; });
    function save() {
        if (down && !sureState[0]) {
            sureState[1](true);
            return;
        }
        var tr = trainer ? m.byId[trainer] : null;
        props.onSave(p, s, c.row, pick, evidence, tr);
    }
    return (React.createElement(TmModal, { title: p.name + ' - ' + tmSkillName(s), sub: tmT('{c} shift', { c: p.crew }) + ' - ' + (s.kind === 'area' ? tmT('Area') + ': ' + (s.area || s.key) : tmT('System skill')), onClose: props.onClose, wide: true },
        React.createElement("div", { className: "flex flex-wrap items-center gap-3" },
            React.createElement(TmLevelCell, { cell: c, dark: props.dark }),
            React.createElement("div", { className: "flex-1 min-w-[200px]" },
                React.createElement("div", { className: "font-black text-slate-800" }, tmLevelLabel(c.level)),
                React.createElement("div", { className: "text-xs text-slate-500" },
                    tmT(TM_LEVEL_HELP[c.level]),
                    c.row && c.row.signedBy ? ' - ' + tmT('last set by {who}', { who: c.row.signedBy }) : '')),
            c.ready && React.createElement(TmChip, { cls: "bg-[#FFF6E0] text-[#7A5600] border-[#FFB81C]" }, tmT('Ready for sign-off')),
            c.refresh && React.createElement(TmChip, { cls: "bg-amber-50 text-amber-700 border-amber-200" }, tmT('Needs a refresher: not done in {d} days', { d: c.refreshDays })),
            c.sessions > 0 && React.createElement(TmChip, null, tmTn(c.sessions, '{n} clean with a trainer', '{n} cleans with a trainer'))),
        React.createElement(TmEvidenceLines, { cell: c, skill: s, m: m }),
        (manual || ssop) ? React.createElement("p", { className: "text-sm" },
            React.createElement("a", { href: manual || ssop, target: "_blank", rel: "noopener noreferrer", className: "font-bold text-[#0072CE] underline" }, manual ? tmT('Open the manual for this skill') : tmT('Open the SSOP for this area'))) : React.createElement("p", { className: "text-xs text-slate-500" }, tmT('No manual linked to this skill yet (Setup).')),
        maxLv < 0 ? React.createElement(TmNote, null, tmT('You can look, but only leads, supervisors and managers change levels. Your account is matched to the employee list by e-mail.')) : (React.createElement("div", { className: "rounded-lg border border-slate-200 p-3 space-y-3", "data-setlevel": "1" },
            React.createElement("div", { className: "text-sm font-black text-[#00468B] uppercase tracking-wider" }, tmT('Change the level')),
            React.createElement("div", { className: "flex flex-wrap gap-2" }, TM_LEVELS.map(function (l) {
                var ok = canPick(l.n);
                return React.createElement(TmBtn, { key: l.n, kind: pick === l.n ? 'primary' : 'plain', disabled: !ok || props.busy, pressed: pick === l.n, onClick: function () { pickState[1](l.n); sureState[1](false); }, title: ok ? tmT(TM_LEVEL_HELP[l.n]) : tmT('Your role cannot set this level') },
                    React.createElement("span", { "data-pick": l.n },
                        l.n,
                        " - ",
                        tmT(l.label)));
            })),
            changed && !down && pick >= 2 && React.createElement("p", { className: "text-xs text-slate-600" }, pick === 2 ? tmT('Qualified means you watched them do a full clean of this skill alone, and it passed inspection.') : tmT('Trainer means they can teach this skill and start others on it.')),
            changed && (React.createElement("label", { className: "block text-sm" },
                React.createElement("span", { className: "font-semibold text-slate-700" }, needsEvidence ? tmT('What did you see? (needed)') : tmT('Note (optional)')),
                React.createElement("textarea", { rows: 2, className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: evidence, onChange: function (e) { evState[1](e.target.value); }, "aria-label": tmT('What did you see?'), "data-evidence": "1" }))),
            changed && pick === 2 && trainers.length > 0 && (React.createElement("label", { className: "block text-sm" },
                React.createElement("span", { className: "font-semibold text-slate-700" }, tmT('Who trained them? (optional)')),
                React.createElement("select", { className: "mt-1 block border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: trainer, onChange: function (e) { trState[1](e.target.value); } },
                    React.createElement("option", { value: "" }, tmT('Not recorded')),
                    trainers.map(function (o) { return React.createElement("option", { key: o.id, value: o.id },
                        o.name,
                        " (",
                        o.crew,
                        ")"); })))),
            sureState[0] && React.createElement(TmNote, { tone: "warn" }, tmT('This lowers the level from {a} to {b}. The history keeps the old level. Press Save again to confirm.', { a: tmLevelLabel(c.level), b: tmLevelLabel(pick) })),
            React.createElement("div", { className: "flex flex-wrap gap-2 justify-end" },
                c.level >= 1 && s.kind === 'area' && !changed && React.createElement(TmBtn, { disabled: props.busy, onClick: function () { props.onEvent(p, s, 'refresher', c.level, evidence); } }, tmT('Refresher done')),
                !changed && React.createElement(TmBtn, { disabled: props.busy, onClick: function () { props.onEvent(p, s, 'manualread', c.level, evidence); } }, tmT('Read the manual together')),
                React.createElement(TmBtn, { kind: "primary", disabled: !changed || props.busy || (needsEvidence && !tmTrim(evidence)), onClick: save }, props.busy ? tmT('Saving...') : sureState[0] ? tmT('Save (lower the level)') : tmT('Save'))))),
        React.createElement("div", null,
            React.createElement("div", { className: "text-sm font-black text-[#00468B] uppercase tracking-wider mb-1" }, tmT('History')),
            React.createElement(TmHistory, { events: history, m: m }))));
}
// ==== END TRAINING MATRIX TAB ====
// ==== TRAINING LISTS (sign-offs, coverage, people) ====
function TmPersonSkill(props) {
    var m = props.m, c = props.cell, p = m.byId[c.emp], s = m.skillByKey[c.skill];
    return (React.createElement("li", { className: "flex flex-wrap items-center gap-3 py-2" },
        React.createElement(TmLevelCell, { cell: c, dark: props.dark, who: p ? p.name : '', what: tmSkillName(s), onClick: function () { props.onCell(c.emp, c.skill); } }),
        React.createElement("div", { className: "flex-1 min-w-[200px]" },
            React.createElement("div", { className: "font-semibold text-slate-800" },
                p ? p.name : c.emp,
                " ",
                React.createElement("span", { className: "text-slate-400 font-normal" },
                    "- ",
                    tmSkillName(s))),
            React.createElement("div", { className: "text-xs text-slate-500" }, props.line)),
        React.createElement(TmBtn, { onClick: function () { props.onCell(c.emp, c.skill); } }, props.action)));
}
function TmSignoffsTab(props) {
    var m = props.m, f = props.filter;
    var inCrew = function (c) { var p = m.byId[c.emp]; return p && (f.crew === 'all' || p.crew === f.crew); };
    var ready = m.readyList.filter(inCrew), refresh = m.refreshList.filter(inCrew);
    var certs = (m.certs || []).filter(function (c) { return f.crew === 'all' || !c.crew || c.crew === f.crew; });
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement(TmCard, { title: tmT('Ready for sign-off'), right: React.createElement(TmFilters, { filter: f, onChange: props.onFilter }) },
            React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('Learning people who have done the area at least the set number of shifts, at a pace near standard when there is one. Go and watch a full clean, then sign them off.')),
            !ready.length ? React.createElement(TmNote, null, m.logCount ? tmT('Nobody is ready for sign-off right now.') : tmT('Nobody yet: there are no cleans with names in the MSS log, so the page cannot count shifts. Levels still work by hand.')) : (React.createElement("ul", { className: "divide-y divide-slate-100", "data-list": "ready" }, ready.map(function (c) { return React.createElement(TmPersonSkill, { key: c.emp + c.skill, m: m, cell: c, dark: props.dark, onCell: props.onCell, action: tmT('Sign off'), line: tmT('{n} shifts since they started (needs {min})', { n: c.sinceStart, min: c.minShifts }) + (c.pace !== null ? ' - ' + tmT('pace {p}', { p: c.pace }) : '') + (c.sessions ? ' - ' + tmTn(c.sessions, '{n} clean with a trainer', '{n} cleans with a trainer') : '') }); })))),
        React.createElement(TmCard, { title: tmT('Needs a refresher') },
            React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('Qualified people who have not done the area for a while. They keep the level; pair them with a trainer once, then press Refresher done.')),
            !refresh.length ? React.createElement(TmNote, null, tmT('Nobody needs a refresher.')) : (React.createElement("ul", { className: "divide-y divide-slate-100", "data-list": "refresh" }, refresh.map(function (c) { return React.createElement(TmPersonSkill, { key: c.emp + c.skill, m: m, cell: c, dark: props.dark, onCell: props.onCell, action: tmT('Open'), line: c.lastDay ? tmT('last done {d}', { d: tmFmtYmd(c.lastDay) }) : tmT('not in the MSS log since they qualified') }); })))),
        React.createElement(TmCard, { title: tmT('Employee certifications (_t_ Employee certification)'), right: React.createElement(TmChip, { cls: "bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]" }, certs.length + ' ' + tmT('records')) },
            React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('Live records from craa5___1_t_cert promoted from Supervisor Hub checklists, Manager Hub Training & Certs, or saved on this matrix.')),
            !certs.length ? React.createElement(TmNote, null, tmT('No certification records in _t_ Employee certification yet.')) : (React.createElement("div", { style: { overflowX: 'auto' } },
                React.createElement("table", { className: "text-sm w-full", "data-certs": "1" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs font-black text-slate-500 uppercase" },
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Person')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Crew')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Skill')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Level')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Certified')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Expires')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Verified by')),
                            React.createElement("th", { className: "py-2 pr-3" }))),
                    React.createElement("tbody", null, certs.map(function (c, idx) {
                        var hasCell = !!(c.emp && c.skill && m.cells[tmLevelKey(c.emp, c.skill)]);
                        return (React.createElement("tr", { key: c.id || c.key || idx, className: "border-t border-slate-100" },
                            React.createElement("td", { className: "py-1.5 pr-3 font-semibold text-slate-800" }, c.empName || c.emp || '--'),
                            React.createElement("td", { className: "py-1.5 pr-3" }, c.crew || '--'),
                            React.createElement("td", { className: "py-1.5 pr-3" }, c.skillName || c.skill || '--'),
                            React.createElement("td", { className: "py-1.5 pr-3" },
                                React.createElement(TmLevelCell, { cell: { level: c.level }, dark: props.dark })),
                            React.createElement("td", { className: "py-1.5 pr-3 text-xs text-slate-600" }, c.certified ? tmFmtYmd(c.certified) : '--'),
                            React.createElement("td", { className: "py-1.5 pr-3 text-xs text-slate-600" }, c.expires ? tmFmtYmd(c.expires) : '--'),
                            React.createElement("td", { className: "py-1.5 pr-3 text-xs text-slate-500" }, c.verifiedBy || c.trainerName || '--'),
                            React.createElement("td", { className: "py-1.5 pr-3 text-right" }, hasCell ? React.createElement(TmBtn, { onClick: function () { props.onCell(c.emp, c.skill); } }, tmT('Open')) : null)));
                    }))))))));
}
var TM_COVER_STYLE = {
    short: { cls: 'bg-red-50 text-red-700 border-red-200', label: 'Short' },
    nospare: { cls: 'bg-[#FFF6E0] text-[#7A5600] border-[#FFB81C]', label: 'No spare' },
    ok: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Covered' }
};
function TmCoverageTab(props) {
    var m = props.m;
    var areas = m.coverage.filter(function (c) { return c.skill.kind === 'area'; });
    var shortN = 0;
    areas.forEach(function (c) { ['A', 'B', 'C', 'D'].forEach(function (cr) { if (c.byCrew[cr].state === 'short')
        shortN++; }); });
    return (React.createElement(TmCard, { title: tmT('Crew coverage'), right: React.createElement(TmChip, { cls: shortN ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200' }, tmTn(shortN, '{n} area and crew short', '{n} areas and crews short')) },
        React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, tmT('Each square: people at Qualified or Trainer on that crew, against the people the area needs (the most any one piece of its equipment needs, or 1). Short means one person short already; No spare means one call-out away. The number after the plus is people still Learning.')),
        !areas.length ? React.createElement(TmNote, null, tmT('No area skills yet.')) : (React.createElement("div", { style: { overflowX: 'auto' } },
            React.createElement("table", { className: "text-sm w-full", "data-coverage": "1" },
                React.createElement("thead", null,
                    React.createElement("tr", { className: "text-left text-xs font-black text-slate-500 uppercase" },
                        React.createElement("th", { className: "py-2 pr-3" }, tmT('Area')),
                        React.createElement("th", { className: "py-2 pr-3" }, tmT('Needs')),
                        ['A', 'B', 'C', 'D'].map(function (cr) { return React.createElement("th", { key: cr, className: "py-2 pr-3" }, tmT('{c} shift', { c: cr })); }))),
                React.createElement("tbody", null, areas.map(function (c) {
                    return (React.createElement("tr", { key: c.skill.key, className: "border-t border-slate-100" },
                        React.createElement("td", { className: "py-1.5 pr-3" },
                            React.createElement("button", { type: "button", className: "font-semibold text-slate-800 hover:underline text-left", onClick: function () { props.onSkill(c.skill.key); } }, tmSkillName(c.skill))),
                        React.createElement("td", { className: "py-1.5 pr-3 text-slate-600" },
                            c.needN,
                            c.need === null ? React.createElement("span", { className: "text-slate-400" },
                                " (",
                                tmT('no heads set'),
                                ")") : null),
                        ['A', 'B', 'C', 'D'].map(function (cr) {
                            var b = c.byCrew[cr], st = TM_COVER_STYLE[b.state];
                            return React.createElement("td", { key: cr, className: "py-1.5 pr-3" },
                                React.createElement("span", { "data-cover": c.skill.key + '|' + cr, "data-state": b.state, className: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold ' + st.cls, title: tmT(st.label) },
                                    b.qualified,
                                    "/",
                                    b.need,
                                    b.learning ? ' +' + b.learning : ''));
                        })));
                })))))));
}
function tmWhyText(w, m) {
    var names = function (keys) { return keys.map(function (k) { return tmSkillName(m.skillByKey[k]); }).join(', '); };
    if (w.k === 'faster')
        return tmTn(w.n, 'qualified faster than usual on {n} skill', 'qualified faster than usual on {n} skills');
    if (w.k === 'pace')
        return tmT('pace {p} over {n} completions', { p: w.pace, n: w.n });
    if (w.k === 'trainer')
        return tmTn(w.n, 'trained {n} person who qualified at or faster than usual', 'trained {n} people who qualified at or faster than usual');
    if (w.k === 'slow')
        return tmT('still Learning after twice the usual shifts: {s}', { s: names(w.skills) });
    if (w.k === 'areapace')
        return tmT('Qualified but below the coaching pace on: {s}', { s: names(w.skills) });
    if (w.k === 'refresh')
        return tmT('refresher due: {s}', { s: names(w.skills) });
    return '';
}
function TmPeopleTab(props) {
    var m = props.m, f = props.filter, r = props.rights, S = m.settings;
    var people = tmFilterPeople(m, f);
    var inCrew = function (x) { var p = m.byId[x.emp]; return p && (f.crew === 'all' || p.crew === f.crew); };
    return (React.createElement("div", { className: "space-y-4" },
        r.lists ? (React.createElement("div", { className: "grid lg:grid-cols-2 gap-4" },
            React.createElement(TmCard, { title: tmT('High performers'), accent: "#059669" },
                React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('Qualified faster than usual on 2 or more skills, a pace of {hp} or more over at least {n} completions, or a trainer whose people qualify at or faster than usual.', { hp: S.highPace, n: S.minCompletions })),
                !m.high.filter(inCrew).length ? React.createElement(TmNote, null, tmT('Nobody yet. This list fills in as sign-offs and cleans with names are saved.')) : React.createElement("ul", { className: "divide-y divide-slate-100 text-sm", "data-list": "high" }, m.high.filter(inCrew).map(function (h) { var p = m.byId[h.emp]; return React.createElement("li", { key: h.emp, className: "py-1.5" },
                    React.createElement("button", { type: "button", className: "font-semibold text-slate-800 hover:underline", onClick: function () { props.onPerson(h.emp); } }, p.name),
                    " ",
                    React.createElement("span", { className: "text-slate-400" },
                        "(",
                        p.crew,
                        ")"),
                    React.createElement("div", { className: "text-xs text-slate-600" }, h.why.map(function (w) { return tmWhyText(w, m); }).join('; '))); }))),
            React.createElement(TmCard, { title: tmT('Needs action'), accent: "#D97706" },
                React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('Still Learning after twice the usual shifts, a pace under {cp} once qualified, or a refresher due. Each line shows the numbers behind it, so the talk starts from facts.', { cp: S.coachPace })),
                !m.action.filter(inCrew).length ? React.createElement(TmNote, null, tmT('Nobody needs action right now.')) : React.createElement("ul", { className: "divide-y divide-slate-100 text-sm", "data-list": "action" }, m.action.filter(inCrew).map(function (h) { var p = m.byId[h.emp]; return React.createElement("li", { key: h.emp, className: "py-1.5" },
                    React.createElement("button", { type: "button", className: "font-semibold text-slate-800 hover:underline", onClick: function () { props.onPerson(h.emp); } }, p.name),
                    " ",
                    React.createElement("span", { className: "text-slate-400" },
                        "(",
                        p.crew,
                        ")"),
                    React.createElement("div", { className: "text-xs text-slate-600" }, h.why.map(function (w) { return tmWhyText(w, m); }).join('; '))); }))))) : React.createElement(TmNote, null, tmT('The high performer and needs action lists are for supervisors and managers.')),
        React.createElement(TmCard, { title: tmT('Everyone'), right: React.createElement(TmFilters, { filter: f, onChange: props.onFilter }) },
            React.createElement("div", { style: { overflowX: 'auto' } },
                React.createElement("table", { className: "text-sm w-full", "data-people": "1" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-xs font-black text-slate-500 uppercase" },
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Person')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Crew')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Qualified')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Learning')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Areas covered')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Pace')),
                            React.createElement("th", { className: "py-2 pr-3" }, tmT('Ready / refresher')))),
                    React.createElement("tbody", null, people.map(function (p) {
                        var st = m.personStats[p.id];
                        return (React.createElement("tr", { key: p.id, className: "border-t border-slate-100" },
                            React.createElement("td", { className: "py-1.5 pr-3" },
                                React.createElement("button", { type: "button", className: "font-semibold text-slate-800 hover:underline text-left", onClick: function () { props.onPerson(p.id); } }, p.name)),
                            React.createElement("td", { className: "py-1.5 pr-3" }, p.crew),
                            React.createElement("td", { className: "py-1.5 pr-3" },
                                st.qualified,
                                st.trainer ? ' (' + tmTn(st.trainer, '{n} as trainer', '{n} as trainer') + ')' : ''),
                            React.createElement("td", { className: "py-1.5 pr-3" }, st.learning),
                            React.createElement("td", { className: "py-1.5 pr-3" }, st.breadth === null ? '--' : st.breadth + '%'),
                            React.createElement("td", { className: "py-1.5 pr-3" }, st.pace === null ? React.createElement("span", { className: "text-slate-400", title: tmT('{n} of {min} completions with a standard', { n: st.paceN, min: S.minCompletions }) }, "--") : st.pace),
                            React.createElement("td", { className: "py-1.5 pr-3 text-xs" },
                                st.ready.length ? tmTn(st.ready.length, '{n} ready', '{n} ready') : '',
                                st.ready.length && st.refresh.length ? ', ' : '',
                                st.refresh.length ? tmTn(st.refresh.length, '{n} refresher', '{n} refreshers') : '')));
                    })))))));
}
// The Tech ladder's percent items, worked out from the matrix (People page, TRAINING_LEVELS).
var TM_LADDER_STEPS = [{ tech: 1, pct: 50, label: 'Tech 1: capable on 50-60% of areas' }, { tech: 2, pct: 90, label: 'Tech 2: 90% of the standard work' }, { tech: 3, pct: 96, label: 'Tech 3: more than 95% of areas' }];
function TmProfileModal(props) {
    var m = props.m, p = m.byId[props.emp], r = props.rights;
    if (!p)
        return null;
    var st = m.personStats[p.id];
    var mine = m.skills.map(function (s) { return { s: s, c: m.cells[tmLevelKey(p.id, s.key)] }; });
    var history = m.events.filter(function (e) { return e.emp === p.id; });
    var high = m.high.filter(function (h) { return h.emp === p.id; })[0], act = m.action.filter(function (h) { return h.emp === p.id; })[0];
    var ttq = mine.map(function (x) { var t = m.ttq[x.s.key]; var me = t ? t.list.filter(function (y) { return y.emp === p.id; })[0] : null; return me ? { s: x.s, me: me, med: t.medianShifts, n: t.list.length } : null; }).filter(Boolean);
    return (React.createElement(TmModal, { title: p.name, sub: tmT('{c} shift', { c: p.crew }) + ' - ' + tmT('Training profile') + ' - ' + tmFmtYmd(m.today), onClose: props.onClose, wide: true, head: React.createElement(TmBtn, { onClick: function () { try {
                window.print();
            }
            catch (e) { /* print blocked */ } } }, tmT('Print')) },
        React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2" },
            React.createElement(TmStat, { label: tmT('Qualified'), value: String(st.qualified), sub: tmTn(st.trainer, '{n} as trainer', '{n} as trainer') }),
            React.createElement(TmStat, { label: tmT('Learning'), value: String(st.learning), sub: st.ready.length ? tmTn(st.ready.length, '{n} ready for sign-off', '{n} ready for sign-off') : '' }),
            React.createElement(TmStat, { label: tmT('Areas covered'), value: st.breadth === null ? '--' : st.breadth + '%', sub: tmT('{a} of {b} areas', { a: st.areaQualified, b: st.areaTotal }) }),
            React.createElement(TmStat, { label: tmT('Pace'), value: st.pace === null ? '--' : String(st.pace), sub: st.pace === null ? tmT('{n} of {min} completions with a standard', { n: st.paceN, min: m.settings.minCompletions }) : tmT('last {d} days', { d: m.settings.paceDays }), tone: st.pace === null ? '' : st.pace >= m.settings.highPace ? 'good' : st.pace < m.settings.coachPace ? 'warn' : '' })),
        React.createElement("div", { className: "text-sm" },
            React.createElement("div", { className: "font-black text-[#00468B] uppercase tracking-wider text-xs mb-1" }, tmT('Tech ladder (areas)')),
            React.createElement("ul", { className: "space-y-0.5" }, TM_LADDER_STEPS.map(function (x) { var ok = st.breadth !== null && st.breadth >= x.pct; return React.createElement("li", { key: x.tech, className: ok ? 'text-emerald-700' : 'text-slate-600' },
                ok ? React.createElement(TmIcon, { name: "check", size: 13 }) : '-',
                " ",
                tmT(x.label)); })),
            React.createElement("p", { className: "text-xs text-slate-400 mt-1" }, tmT('The People page keeps the full ladder; these lines are the area share only.'))),
        r.lists && (high || act) && (React.createElement("div", { className: "space-y-1 text-sm" },
            high && React.createElement(TmNote, { tone: "good" },
                tmT('High performer'),
                ": ",
                high.why.map(function (w) { return tmWhyText(w, m); }).join('; ')),
            act && React.createElement(TmNote, { tone: "warn" },
                tmT('Needs action'),
                ": ",
                act.why.map(function (w) { return tmWhyText(w, m); }).join('; ')))),
        React.createElement("div", null,
            React.createElement("div", { className: "font-black text-[#00468B] uppercase tracking-wider text-xs mb-1" }, tmT('Skills')),
            React.createElement("div", { className: "flex flex-wrap gap-2" }, mine.map(function (x) { return React.createElement("span", { key: x.s.key, className: "inline-flex items-center gap-1.5 text-xs border border-slate-200 rounded-lg px-1.5 py-1" },
                React.createElement(TmLevelCell, { cell: x.c, dark: props.dark, who: p.name, what: tmSkillName(x.s), onClick: function () { props.onCell(p.id, x.s.key); } }),
                tmSkillName(x.s)); }))),
        ttq.length > 0 && (React.createElement("div", null,
            React.createElement("div", { className: "font-black text-[#00468B] uppercase tracking-wider text-xs mb-1" }, tmT('Time to qualify')),
            React.createElement("table", { className: "text-sm" },
                React.createElement("tbody", null, ttq.map(function (x) { return React.createElement("tr", { key: x.s.key },
                    React.createElement("td", { className: "pr-3 py-0.5" }, tmSkillName(x.s)),
                    React.createElement("td", { className: "pr-3" },
                        tmTn(x.me.shifts, '{n} shift', '{n} shifts'),
                        ", ",
                        tmTn(x.me.days, '{n} day', '{n} days')),
                    React.createElement("td", { className: "text-slate-500" }, x.n >= 2 && x.med !== null ? tmT('usual: {n} shifts', { n: tmFmtNum(x.med, 1) }) : '')); }))))),
        React.createElement("div", null,
            React.createElement("div", { className: "font-black text-[#00468B] uppercase tracking-wider text-xs mb-1" }, tmT('History')),
            React.createElement(TmHistory, { events: history, m: m, max: 100 }))));
}
// One skill across everyone: who is where on it.
function TmSkillModal(props) {
    var m = props.m, s = m.skillByKey[props.skill];
    if (!s)
        return null;
    var t = m.ttq[s.key];
    var rows = m.people.map(function (p) { return { p: p, c: m.cells[tmLevelKey(p.id, s.key)] }; }).filter(function (x) { return x.c.level > 0 || x.c.shifts > 0; }).sort(function (a, b) { return b.c.level - a.c.level || b.c.shifts - a.c.shifts; });
    return (React.createElement(TmModal, { title: tmSkillName(s), sub: s.kind === 'area' ? tmT('Area') + ': ' + (s.area || s.key) : tmT('System skill'), onClose: props.onClose, wide: true },
        s.kind === 'area' && React.createElement("p", { className: "text-sm text-slate-600" }, t && t.list.length ? tmT('Usual time to qualify: {n} shifts ({d} days), from {k} sign-offs.', { n: tmFmtNum(t.medianShifts, 1), d: tmFmtNum(t.medianDays, 0), k: t.list.length }) : tmT('No time to qualify yet: it needs sign-offs made on this page.')),
        !rows.length ? React.createElement(TmNote, null, tmT('Nobody has a level or cleans on this skill yet.')) : (React.createElement("ul", { className: "divide-y divide-slate-100" }, rows.map(function (x) { return React.createElement(TmPersonSkill, { key: x.p.id, m: m, cell: x.c, dark: props.dark, onCell: props.onCell, action: tmT('Open'), line: tmT('{c} shift', { c: x.p.crew }) + (s.kind === 'area' ? ' - ' + tmTn(x.c.shifts, '{n} shift', '{n} shifts') + (x.c.lastDay ? ' - ' + tmT('last done {d}', { d: tmFmtYmd(x.c.lastDay) }) : '') : '') }); })))));
}
// ==== END TRAINING LISTS ====
// ==== TRAINING BASELINE, SETUP, DATA, HELP ====
// Baseline: a supervisor sets where each person on a crew already is, once. Saved with kind "baseline" and no dates,
// so it never counts toward time to qualify.
function TmBaselineTab(props) {
    var m = props.m, r = props.rights;
    var crewState = useState(props.filter.crew === 'all' ? (r.me && r.me.crew ? r.me.crew : 'A') : props.filter.crew);
    var crew = crewState[0];
    var sideState = useState('all');
    var side = sideState[0];
    var draftState = useState({});
    var draft = draftState[0];
    var setDraft = draftState[1];
    if (!r.baseline)
        return React.createElement(TmNote, null, tmT('The starting levels are set by supervisors and managers.'));
    var people = m.people.filter(function (p) { return p.crew === crew; });
    var skills = tmFilterSkills(m, { side: side });
    var changes = Object.keys(draft).filter(function (k) { var c = m.cells[k]; return c && draft[k] !== c.level; });
    function setOne(k, v) { var d = {}; for (var x in draft)
        d[x] = draft[x]; d[k] = v; setDraft(d); }
    return (React.createElement(TmCard, { title: tmT('Starting levels'), right: React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
            React.createElement("select", { className: "border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: crew, onChange: function (e) { crewState[1](e.target.value); setDraft({}); }, "aria-label": tmT('Crew') }, ['A', 'B', 'C', 'D'].map(function (c) { return React.createElement("option", { key: c, value: c }, tmT('{c} shift', { c: c })); })),
            React.createElement("select", { className: "border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: side, onChange: function (e) { sideState[1](e.target.value); }, "aria-label": tmT('Side') },
                React.createElement("option", { value: "all" }, tmT('All skills')),
                React.createElement("option", { value: "Raw" }, tmT('Raw side')),
                React.createElement("option", { value: "RTE" }, tmT('RTE side')),
                React.createElement("option", { value: "system" }, tmT('System skills'))),
            React.createElement(TmBtn, { kind: "primary", disabled: !changes.length || props.busy, onClick: function () { props.onSave(changes.map(function (k) { return { key: k, level: draft[k] }; }), function () { setDraft({}); }); } }, props.busy ? tmT('Saving...') : tmTn(changes.length, 'Save {n} change', 'Save {n} changes'))) },
        React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, tmT('Do this once per crew, from what you know today. These levels have no dates, so they never count toward time to qualify. After this, change levels from the matrix so the dates and the evidence are saved.')),
        !skills.length || !people.length ? React.createElement(TmNote, null, !skills.length ? tmT('No skills yet (Setup).') : tmT('Nobody on this crew.')) : (React.createElement("div", { style: { overflow: 'auto', maxHeight: 640 } },
            React.createElement("table", { className: "text-sm", "data-baseline": "1" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "sticky left-0 top-0 z-20 bg-white px-2 py-2 text-left text-xs font-black text-slate-500 uppercase" }, tmT('Person')),
                        skills.map(function (s) { return React.createElement("th", { key: s.key, className: "sticky top-0 bg-white px-1 py-2 text-[11px] font-bold text-[#00468B] align-bottom", style: { minWidth: 60 } }, tmSkillName(s)); }))),
                React.createElement("tbody", null, people.map(function (p) {
                    return (React.createElement("tr", { key: p.id, className: "border-t border-slate-100" },
                        React.createElement("td", { className: "sticky left-0 bg-white px-2 py-1 font-semibold text-slate-800 whitespace-nowrap" }, p.name),
                        skills.map(function (s) {
                            var k = tmLevelKey(p.id, s.key), c = m.cells[k], v = draft[k] !== undefined ? draft[k] : c.level;
                            return React.createElement("td", { key: s.key, className: "px-1 py-1 text-center" },
                                React.createElement("select", { "data-base": k, className: 'border rounded px-1 py-0.5 text-xs ' + (v !== c.level ? 'border-[#FFB81C] bg-[#FFF6E0]' : 'border-slate-300'), value: v, onChange: function (e) { setOne(k, Number(e.target.value)); }, "aria-label": p.name + ', ' + tmSkillName(s) }, TM_LEVELS.map(function (l) { return React.createElement("option", { key: l.n, value: l.n }, l.n); })));
                        })));
                })))))));
}
// Setup (developer tools): the skill list and the settings.
function TmSetupTab(props) {
    var m = props.m, S = props.settings;
    var listState = useState(null);
    var list = listState[0];
    var setList = listState[1];
    var base = props.skills; // every saved skill row, active or not
    var rows = list || base;
    var setState = useState(null);
    var sDraft = setState[0] || S;
    function edit(i, k, v) { var nl = rows.map(function (x, j) { if (j !== i)
        return x; var o = {}; for (var q in x)
        o[q] = x[q]; o[k] = v; o.dirty = true; return o; }); setList(nl); }
    function draftFromAreas() { var add = tmDraftSkills(props.areas, rows); setList(rows.concat(add)); }
    var dirty = rows.filter(function (x) { return x.dirty || x.isNew; });
    var keysSeen = {}, dupKeys = [];
    rows.forEach(function (x) { var k = hubCanon(x.key); if (keysSeen[k])
        dupKeys.push(x.key); keysSeen[k] = 1; });
    var areaNames = {};
    (props.areas || []).forEach(function (a) { areaNames[hubCanon(a.name)] = 1; });
    function num(v) { return v === '' || v === null || v === undefined ? null : Number(v); }
    function setS(k, v) { var o = {}; for (var q in sDraft)
        o[q] = sDraft[q]; o[k] = v; setState[1](o); }
    return (React.createElement("div", { className: "space-y-4" },
        React.createElement(TmCard, { title: tmT('Skills'), right: React.createElement("div", { className: "flex flex-wrap gap-2" },
                React.createElement(TmBtn, { onClick: draftFromAreas, disabled: !props.areas || !props.areas.length }, tmT('Add missing skills from the MSS areas')),
                React.createElement(TmBtn, { kind: "primary", disabled: !dirty.length || !!dupKeys.length || props.busy || !props.canSave, onClick: function () { props.onSaveSkills(dirty, function () { setList(null); }); } }, props.busy ? tmT('Saving...') : tmTn(dirty.length, 'Save {n} skill', 'Save {n} skills'))) },
            React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('One skill per MSS area (the key is the exact area name) plus the system skills. Untick Active to hide a skill; it is never deleted. Blank numbers use the settings below.')),
            !props.canSave && React.createElement(TmNote, { tone: "warn" }, tmT('The _t_ Skill table was not found, so skills cannot be saved yet. See the Data tab.')),
            dupKeys.length > 0 && React.createElement(TmNote, { tone: "bad" }, tmT('Two skills have the same key: {k}. Change one before saving.', { k: dupKeys.join(', ') })),
            !rows.length ? React.createElement(TmNote, null, tmT('No skills yet. Press Add missing skills from the MSS areas.')) : (React.createElement("div", { style: { overflowX: 'auto' } },
                React.createElement("table", { className: "text-sm", "data-skills": "1" },
                    React.createElement("thead", null,
                        React.createElement("tr", { className: "text-left text-[11px] font-black text-slate-500 uppercase" },
                            React.createElement("th", { className: "p-1" }, tmT('Active')),
                            React.createElement("th", { className: "p-1" }, tmT('Key')),
                            React.createElement("th", { className: "p-1" }, tmT('Name (English)')),
                            React.createElement("th", { className: "p-1" }, tmT('Name (Spanish)')),
                            React.createElement("th", { className: "p-1" }, tmT('Side')),
                            React.createElement("th", { className: "p-1" }, tmT('Min shifts')),
                            React.createElement("th", { className: "p-1" }, tmT('Refresher days')),
                            React.createElement("th", { className: "p-1" }, tmT('Ladder item')),
                            React.createElement("th", { className: "p-1" }, tmT('Manual link (English)')),
                            React.createElement("th", { className: "p-1" }, tmT('Manual link (Spanish)')),
                            React.createElement("th", { className: "p-1" }, tmT('Order')))),
                    React.createElement("tbody", null, rows.map(function (x, i) {
                        var badArea = x.kind === 'area' && !areaNames[hubCanon(x.area || x.key)] && props.areas && props.areas.length;
                        return (React.createElement("tr", { key: i, className: 'border-t border-slate-100 ' + (x.isNew ? 'bg-[#E6F1FB]' : x.dirty ? 'bg-[#FFF6E0]' : ''), "data-skillrow": x.key },
                            React.createElement("td", { className: "p-1 text-center" },
                                React.createElement("input", { type: "checkbox", checked: x.active !== false, onChange: function (e) { edit(i, 'active', e.target.checked); }, "aria-label": tmT('Active') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-32 font-mono", value: x.key, disabled: !!x.id, onChange: function (e) { edit(i, 'key', e.target.value); }, "aria-label": tmT('Key') }),
                                badArea ? React.createElement("div", { className: "text-[10px] text-amber-700" }, tmT('not an MSS area name')) : null,
                                React.createElement("div", { className: "text-[10px] text-slate-400" }, x.kind === 'area' ? tmT('Area') : tmT('System'))),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-36", value: x.en, onChange: function (e) { edit(i, 'en', e.target.value); }, "aria-label": tmT('Name (English)') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-36", value: x.es, onChange: function (e) { edit(i, 'es', e.target.value); }, "aria-label": tmT('Name (Spanish)') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("select", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs", value: x.side, onChange: function (e) { edit(i, 'side', e.target.value); }, "aria-label": tmT('Side') }, TM_SIDES.map(function (sd) { return React.createElement("option", { key: sd, value: sd }, tmT(sd === 'Both' ? 'Both sides' : sd === 'Raw' ? 'Raw side' : 'RTE side')); }))),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { type: "number", min: 0, className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-16", value: x.minShifts === null || x.minShifts === undefined ? '' : x.minShifts, placeholder: String(sDraft.minShifts), onChange: function (e) { edit(i, 'minShifts', num(e.target.value)); }, "aria-label": tmT('Min shifts') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { type: "number", min: 0, className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-16", value: x.refresherDays === null || x.refresherDays === undefined ? '' : x.refresherDays, placeholder: String(sDraft.refresherDays), onChange: function (e) { edit(i, 'refresherDays', num(e.target.value)); }, "aria-label": tmT('Refresher days') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-24 font-mono", value: x.ladder || '', onChange: function (e) { edit(i, 'ladder', e.target.value); }, "aria-label": tmT('Ladder item') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-40", value: x.manualEn || '', placeholder: "https://", onChange: function (e) { edit(i, 'manualEn', e.target.value); }, "aria-label": tmT('Manual link (English)') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-40", value: x.manualEs || '', placeholder: "https://", onChange: function (e) { edit(i, 'manualEs', e.target.value); }, "aria-label": tmT('Manual link (Spanish)') })),
                            React.createElement("td", { className: "p-1" },
                                React.createElement("input", { type: "number", className: "border border-slate-300 rounded px-1 py-0.5 text-xs w-16", value: x.sort === null || x.sort === undefined ? '' : x.sort, onChange: function (e) { edit(i, 'sort', num(e.target.value)); }, "aria-label": tmT('Order') }))));
                    })))))),
        React.createElement(TmCard, { title: tmT('Settings'), right: React.createElement(TmBtn, { kind: "primary", disabled: !setState[0] || props.busy || !props.settingsWhere || !props.settingsWhere.table, onClick: function () { props.onSaveSettings(sDraft, function () { setState[1](null); }); } }, tmT('Save settings')) },
            React.createElement("p", { className: "text-xs text-slate-500 mb-3" },
                tmT('Saved in Hub config, key training_settings, so every computer uses the same numbers.'),
                " ",
                props.settingsWhere && props.settingsWhere.table ? '(' + props.settingsWhere.table + ')' : tmT('(no Hub config table found)')),
            React.createElement("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm" },
                [['minShifts', 'Shifts before ready for sign-off'], ['readyPace', 'Pace needed for ready for sign-off'], ['refresherDays', 'Days before a refresher is due'], ['paceDays', 'Pace looks back (days)'], ['minCompletions', 'Completions needed for a pace'], ['highPace', 'High performer pace'], ['coachPace', 'Needs action below pace'], ['slowFactor', 'Needs action after this many times the usual shifts'], ['evidenceDays', 'Days of MSS log to read']].map(function (f) {
                    return React.createElement("label", { key: f[0], className: "block" },
                        React.createElement("span", { className: "font-semibold text-slate-700" }, tmT(f[1])),
                        React.createElement("input", { type: "number", min: 0, className: "mt-1 block border border-slate-300 rounded-lg px-2 py-1 text-sm w-28", value: sDraft[f[0]], onChange: function (e) { setS(f[0], num(e.target.value)); }, "data-setting": f[0] }));
                }),
                React.createElement("label", { className: "flex items-center gap-2" },
                    React.createElement("input", { type: "checkbox", checked: sDraft.leadsSignOff !== false, onChange: function (e) { setS('leadsSignOff', e.target.checked); } }),
                    React.createElement("span", { className: "font-semibold text-slate-700" }, tmT('Leads may sign people off as Qualified')))),
            React.createElement("div", { className: "mt-4 border-t border-slate-100 pt-3" },
                React.createElement("div", { className: "text-sm font-black text-[#00468B] uppercase tracking-wider mb-1" }, tmT('Who may open Setup and Data')),
                !sDraft.devUsers || !sDraft.devUsers.length ? React.createElement("p", { className: "text-sm text-amber-700" }, tmT('Not locked: anyone can open these tabs from the logo.')) : React.createElement("ul", { className: "text-sm text-slate-700" }, sDraft.devUsers.map(function (d, i) { return React.createElement("li", { key: i, className: "flex items-center gap-2" },
                    d.name || d.email || d.id,
                    React.createElement("button", { type: "button", className: "text-xs text-red-700 underline", onClick: function () { setS('devUsers', sDraft.devUsers.filter(function (x, j) { return j !== i; })); } }, tmT('Remove'))); })),
                props.user && props.user.id && !(sDraft.devUsers || []).some(function (d) { return d.id === props.user.id || (d.email && d.email === props.user.email); }) && React.createElement(TmBtn, { className: "mt-2", onClick: function () { setS('devUsers', (sDraft.devUsers || []).concat([{ id: props.user.id, email: props.user.email, name: props.user.name }])); } }, tmT('Add me'))))));
}
function TmSrcRow(props) {
    var s = props.src || {};
    var word = tmLoadWord(s);
    return (React.createElement("tr", { className: "border-t border-slate-100 align-top" },
        React.createElement("td", { className: "py-2 pr-3 font-semibold text-slate-700" },
            tmT(props.label),
            React.createElement("div", { className: "text-[11px] font-normal text-slate-400" }, props.owner)),
        React.createElement("td", { className: "py-2 pr-3 font-mono text-xs text-slate-500 break-all" }, s.table || props.names),
        React.createElement("td", { className: 'py-2 pr-3 text-sm ' + (word === 'Ready' ? 'text-emerald-700' : word === 'Loading' || word === 'Nothing here yet' ? 'text-slate-500' : 'text-amber-700') },
            tmT(word),
            s.rows && s.rows.length ? ' (' + tmTn(s.rows.length, '{n} row', '{n} rows') + ')' : ''),
        React.createElement("td", { className: "py-2 text-xs text-slate-500 break-words" },
            s.err || '',
            props.cols ? React.createElement("div", null, Object.keys(props.cols).filter(function (c) { return props.cols[c] === 'missing'; }).length ? tmT('Missing columns: {c}', { c: Object.keys(props.cols).filter(function (c) { return props.cols[c] === 'missing'; }).join(', ') }) : tmT('All columns found')) : null)));
}
function TmDataTab(props) {
    var d = props.data;
    return (React.createElement(TmCard, { title: tmT('Data'), right: React.createElement("div", { className: "flex gap-2" },
            React.createElement(TmBtn, { onClick: props.onCheckCols, disabled: props.busy }, tmT('Check columns')),
            React.createElement(TmBtn, { onClick: props.onReload, disabled: props.busy },
                React.createElement(TmIcon, { name: "refresh", size: 14 }),
                tmT('Read again'))) },
        React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, tmT('Every table this page reads, which name it found, and how many rows came back. Nothing on this page is sample data.')),
        React.createElement("div", { style: { overflowX: 'auto' } },
            React.createElement("table", { className: "text-sm w-full" },
                React.createElement("tbody", null,
                    Object.keys(TM_TABLES).filter(function (k) { return k !== 'config'; }).map(function (k) { var t = TM_TABLES[k]; return React.createElement(TmSrcRow, { key: k, label: t.label, owner: t.owner, names: t.names.join(' / '), src: d[k], cols: props.cols[k] }); }),
                    React.createElement(TmSrcRow, { label: TM_TABLES.config.label, owner: TM_TABLES.config.owner, names: HUB_CONFIG_TABLES.join(' / '), src: { table: props.settingsWhere && props.settingsWhere.table, rows: props.settingsWhere && props.settingsWhere.table ? (props.settingsWhere.id ? [1] : []) : null, err: props.settingsWhere && props.settingsWhere.err, kind: props.settingsWhere && !props.settingsWhere.table ? 'missing' : '' } })))),
        React.createElement("p", { className: "text-xs text-slate-500 mt-3" }, tmT('Version {v}. Contract {c}. Manifest: {m}.', { v: TM_APP_VERSION, c: HUB_CONTRACT_VERSION, m: props.manifest || '--' }))));
}
// Help: one page per tab, at most 7 short steps, in the page language (data contract 9).
var TM_HELP = {
    matrix: ['Pick your crew at the top.', 'Each row is a person, each column a skill.', 'Gray 0 = not trained, blue 1 = learning, green 2 = qualified, star 3 = trainer.', 'A gold dot means ready for sign-off.', 'A dashed edge means a refresher is due.', 'Tap a square to see the cleans behind it.', 'Pick the new level, say what you saw, tap Save.'],
    signoffs: ['This list fills itself from the MSS log.', 'Pick a person who is ready.', 'Watch them do a full clean alone.', 'If it passes inspection, tap Sign off.', 'Pick 2 - Qualified, write what you saw, tap Save.', 'For a refresher: pair them with a trainer once, then tap Refresher done.'],
    coverage: ['Each row is an area, each column a crew.', 'The first number is people qualified, the second is people needed.', 'Short = already one person short.', 'No spare = one call-out away.', 'Train the next person on the areas that are short.'],
    people: ['High performers and Needs action are for supervisors and managers.', 'Each line shows the numbers behind it.', 'Tap a name to open the profile.', 'Print the profile for a review.'],
    baseline: ['Do this once per crew.', 'Pick the crew.', 'Set each person to where they are today.', 'Tap Save. These levels have no dates.', 'From then on, change levels from the matrix.'],
    setup: ['Tap Add missing skills from the MSS areas.', 'Check each name in English and Spanish.', 'Untick Active for skills you do not train.', 'Add manual links if you have them.', 'Tap Save.', 'Set the numbers under Settings and save them.', 'Add yourself under Who may open Setup and Data.'],
    data: ['Each line is a table the page reads.', 'Ready means it was read.', 'Table missing means it still has to be made (see the table prompts).', 'Check columns lists any column that is missing.']
};
function TmHelpModal(props) {
    var steps = TM_HELP[props.tab] || TM_HELP.matrix;
    return (React.createElement(TmModal, { title: tmT('How to use this page'), sub: tmT('Training matrix'), onClose: props.onClose, head: React.createElement(TmBtn, { onClick: function () { try {
                window.print();
            }
            catch (e) { /* print blocked */ } } }, tmT('Print')) },
        React.createElement("ol", { className: "list-decimal pl-5 space-y-1.5 text-sm text-slate-700", "data-help": props.tab }, steps.map(function (s, i) { return React.createElement("li", { key: i }, tmT(s)); })),
        React.createElement(TmLegend, { dark: props.dark })));
}
// ==== END TRAINING BASELINE, SETUP, DATA, HELP ====
// ==== TRAINING APP ====
var TM_TAB_LIST = [['matrix', 'Matrix'], ['signoffs', 'Sign-offs'], ['coverage', 'Coverage'], ['people', 'People'], ['baseline', 'Starting levels']];
var TM_DEV_TAB_LIST = [['setup', 'Setup'], ['data', 'Data']];
var TM_DEV_KEY = 'tm_dev_v1';
var TM_FILTER_KEY = 'tm_filter_v1';
var TM_OWN = ['skill', 'skilllevel', 'cert', 'event'];
function tmStartLang() {
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
        var x = tmXrm();
        var us = x && x.Utility && x.Utility.getGlobalContext ? x.Utility.getGlobalContext().userSettings : null;
        var id = us ? Number(us.languageId) : 0;
        if (id === 2058 || id === 3082 || id === 1034)
            return 'es';
    }
    catch (e) { /* not in host */ }
    return 'en';
}
function tmStartTheme() {
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
function TmLogo(props) {
    return (React.createElement("button", { type: "button", "data-tm-logo": "1", onClick: props.onClick, "aria-pressed": props.open, title: props.allowed ? (props.open ? tmT('Hide the developer tools') : tmT('Show the developer tools')) : '', className: "relative inline-flex items-center gap-2 rounded-lg border-0 bg-transparent p-0 cursor-pointer", style: { outline: props.open ? '2px solid #0072CE' : 'none', outlineOffset: 2 } },
        React.createElement("span", { className: "inline-flex items-center rounded-lg px-1.5 py-1", style: { background: '#FFFFFF' } },
            React.createElement("img", { src: TM_LOGO, alt: "Apex Foods", style: { height: 36, width: 'auto', display: 'block' } })),
        React.createElement("span", { className: "flex flex-col items-start pr-1" },
            React.createElement("span", { className: "text-base font-black tracking-tight text-[#00468B] leading-none" }, "Apex Foods"),
            React.createElement("span", { className: "h-1 w-full bg-[#E4002B] mt-0.5 rounded-full" })),
        props.open && React.createElement("span", { className: "absolute -bottom-1 -right-1 rounded-full text-white p-0.5", style: { background: '#0072CE' } },
            React.createElement(TmIcon, { name: "unlock", size: 11 }))));
}
// Finds the table (first name that exists), then reads it with its own id column plus the listed columns.
function tmLoad(dataApi, key, cols, filter, top) {
    var names = TM_TABLES[key].names;
    return tmProbe(dataApi, names).then(function (pr) {
        if (pr.state !== 'found' || !pr.table)
            return { rows: null, err: pr.why || tmT('Table missing'), kind: pr.state === 'denied' ? 'denied' : pr.state === 'nohost' ? 'nohost' : pr.state === 'unknown' ? 'unknown' : 'missing', table: '', probe: pr };
        var t = pr.table;
        // Employees: never read with every column (the table holds a PIN). A missing e-mail column is read again without it.
        var strict = key === 'employees';
        return tmQuery(dataApi, t, { select: [t + 'id'].concat(cols), filter: filter, top: top || 5000, strictSelect: strict }).then(function (r) {
            if (strict && !r.rows && r.kind === 'column' && cols.indexOf('craa5_email') >= 0) {
                return tmQuery(dataApi, t, { select: [t + 'id'].concat(cols.filter(function (c) { return c !== 'craa5_email'; })), filter: filter, top: top || 5000, strictSelect: true }).then(function (r2) { r2.noEmail = true; return r2; });
            }
            return r;
        }).then(function (r) {
            r.table = t;
            r.probe = pr;
            if (r.rows)
                r.rows = tmTagRows(r.rows, t);
            return r;
        });
    });
}
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function TrainingApp(props) {
    var dataApi = props && props.dataApi;
    var langState = useState(tmStartLang);
    var lang = langState[0];
    tmSetLang(lang);
    var themeState = useState(tmStartTheme);
    var theme = themeState[0];
    var twState = useState('loading');
    var userState = useState(null);
    var user = userState[0];
    var devOpenState = useState(tmReadSession(TM_DEV_KEY) === '1');
    var tabState = useState('matrix');
    var tab = tabState[0];
    var filterState = useState((function () { var f = tmReadLocal(TM_FILTER_KEY, null); return { crew: f && /^(all|[ABCD])$/.test(f.crew) ? f.crew : 'all', side: f && /^(all|Raw|RTE|system)$/.test(f.side) ? f.side : 'all', q: '' }; })());
    var filter = filterState[0];
    var dataState = useState({ employees: TM_EMPTY_SRC, areas: TM_EMPTY_SRC, assets: TM_EMPTY_SRC, msslog: TM_EMPTY_SRC, skill: TM_EMPTY_SRC, skilllevel: TM_EMPTY_SRC, cert: TM_EMPTY_SRC, event: TM_EMPTY_SRC });
    var data = dataState[0];
    var setData = dataState[1];
    var settingsState = useState({ settings: tmMergeSettings(null), saved: null, table: '', col: '', id: '', err: '', loaded: false });
    var sw = settingsState[0];
    var colsState = useState({});
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
        tmEnsureStyles(function (ok) { twState[1](ok ? 'ok' : 'failed'); });
        tmReadUser(props).then(function (u) { userState[1](u); });
        function fit() { var el = rootRef.current; if (!el)
            return; var top = el.getBoundingClientRect().top; heightState[1](Math.max(320, Math.floor(window.innerHeight - Math.max(0, top)))); }
        fit();
        window.addEventListener('resize', fit);
        return function () { window.removeEventListener('resize', fit); };
    }, []);
    // Everything is read again on Read again; the four own tables are read again after each save.
    function readOwn() {
        return Promise.all([
            tmLoad(dataApi, 'skill', TM_COLS.skill.concat(['statecode']), 'statecode eq 0'),
            tmLoad(dataApi, 'skilllevel', TM_COLS.skilllevel.concat(['statecode', 'modifiedon']), 'statecode eq 0'),
            tmLoad(dataApi, 'cert', TM_COLS.cert.concat(['statecode', 'modifiedon']), 'statecode eq 0'),
            tmLoad(dataApi, 'event', TM_COLS.event.concat(['createdon']), 'statecode eq 0')
        ]).then(function (res) { return { skill: res[0], skilllevel: res[1], cert: res[2], event: res[3] }; });
    }
    useEffect(function () {
        var dead = false;
        loadingState[1](true);
        var noHost = !tmWeb() && !(dataApi && dataApi.queryTable);
        if (noHost) {
            loadingState[1](false);
            return;
        }
        tmReadSettings(dataApi).then(function (w) {
            if (dead)
                return;
            w.loaded = true;
            settingsState[1](w);
            var S = w.settings, from = hubAddDays(hubPlantDay(Date.now()), -Math.max(1, S.evidenceDays));
            return Promise.all([
                tmLoad(dataApi, 'employees', TM_READ.employees, 'statecode eq 0'),
                tmLoad(dataApi, 'areas', TM_READ.areas, 'statecode eq 0'),
                tmLoad(dataApi, 'assets', TM_READ.assets.filter(function (c) { return c !== 'craa5___1_a_assetsid'; }), 'statecode eq 0'),
                tmLoad(dataApi, 'msslog', TM_READ.msslog, 'statecode eq 0 and craa5_lastcleaned ge ' + from + 'T00:00:00Z', 50000),
                readOwn()
            ]).then(function (res) {
                if (dead)
                    return;
                setData({ employees: res[0], areas: res[1], assets: res[2], msslog: res[3], skill: res[4].skill, skilllevel: res[4].skilllevel, cert: res[4].cert, event: res[4].event });
                loadingState[1](false);
                // The page's manifest for the Dataverse monitor (contract 12.1): table and column names only, once per build.
                hubSaveManifest(tmManifestIo(dataApi), TM_MANIFEST).then(function (r) { manifestState[1](r); });
            });
        }).then(null, function (e) { if (!dead) {
            loadingState[1](false);
            setMsg({ tone: 'bad', text: tmErrText(e) });
        } });
        return function () { dead = true; };
    }, [reloadState[0]]);
    var S = sw.settings;
    var today = hubPlantDay(Date.now());
    var norm = useMemo(function () {
        var assets = (data.assets.rows || []).map(tmNormAsset);
        var byId = {};
        assets.forEach(function (a) { if (a.id)
            byId[a.id] = a; });
        return {
            employees: (data.employees.rows || []).map(tmNormEmployee),
            areas: (data.areas.rows || []).map(tmNormArea),
            assets: assets,
            logs: (data.msslog.rows || []).map(function (r) { return tmNormLog(r, byId); }),
            skills: (data.skill.rows || []).map(tmNormSkill),
            levels: (data.skilllevel.rows || []).map(tmNormLevel),
            certs: (data.cert.rows || []).map(tmNormCert),
            events: (data.event.rows || []).map(tmNormEvent)
        };
    }, [data]);
    var m = useMemo(function () { return tmBuildModel({ employees: norm.employees, areas: norm.areas, skills: norm.skills, levels: norm.levels, certs: norm.certs, events: norm.events, logs: norm.logs, assets: norm.assets, settings: S, today: today }); }, [norm, S, today, lang]);
    var rights = tmRights(user, norm.employees, S);
    var maxLevel = tmMaxLevel(rights);
    var devAllowed = !!user && tmIsDev(user, S.devUsers);
    var devOpen = devOpenState[0] && devAllowed;
    var canSave = {};
    TM_OWN.forEach(function (k) { canSave[k] = !!(data[k] && data[k].table); });
    var who = { name: user ? (user.name || user.email) : '', email: user ? user.email : '' };
    function onFilter(p) { var f = {}; for (var k in filter)
        f[k] = filter[k]; for (var q in p)
        f[q] = p[q]; filterState[1](f); tmWriteLocal(TM_FILTER_KEY, { crew: f.crew, side: f.side }); }
    function onLogo() { if (!devAllowed)
        return; var v = !devOpenState[0]; devOpenState[1](v); tmWriteSession(TM_DEV_KEY, v ? '1' : null); if (!v && (tab === 'setup' || tab === 'data'))
        tabState[1]('matrix'); }
    function afterSave(text) {
        return readOwn().then(function (o) {
            setData(function (d) { var n = {}; for (var k in d)
                n[k] = d[k]; n.skill = o.skill; n.skilllevel = o.skilllevel; n.cert = o.cert; n.event = o.event; return n; });
            setMsg({ tone: 'good', text: text });
        });
    }
    function fail(e) { setMsg({ tone: 'bad', text: tmT('Not saved: {err}', { err: tmErrText(e) }) }); }
    function needTables(keys) {
        var miss = keys.filter(function (k) { return !canSave[k]; });
        if (miss.length) {
            setMsg({ tone: 'bad', text: tmT('Not saved: the table {t} was not found. See the Data tab.', { t: miss.map(function (k) { return TM_TABLES[k].label; }).join(', ') }) });
            return false;
        }
        return true;
    }
    function writeEvent(body) { return tmUpsert(dataApi, data.event.table, '', tmEventRowId(body.craa5_eventkey), body); }
    function ensureSkillSaved(s) {
        if (!s || !s.isNew || !canSave.skill)
            return Promise.resolve();
        var k = tmTrim(s.key);
        return tmUpsert(dataApi, data.skill.table, s.id || '', tmSkillRowId(k), tmSkillBody(s));
    }
    function writeCert(p, s, oldRow, level, note, trainer) {
        if (!canSave.cert)
            return Promise.resolve();
        var cb = tmCertBody(p, s, oldRow, level, who, today, note, trainer, S.refresherDays);
        return tmUpsert(dataApi, data.cert.table, oldRow && oldRow.certId ? oldRow.certId : '', tmCertRowId(cb.craa5_certkey), cb);
    }
    function saveLevel(p, s, oldRow, level, evidence, trainer) {
        if (busy || !needTables(['skilllevel', 'event']))
            return;
        var from = oldRow ? oldRow.level : 0;
        var noteText = evidence ? evidence : (oldRow ? oldRow.note : '');
        var body = tmLevelBody(p, s, oldRow, level, who, today, noteText, false);
        setBusy(true);
        setMsg(null);
        ensureSkillSaved(s).then(function () {
            return tmUpsert(dataApi, data.skilllevel.table, oldRow && oldRow.id ? oldRow.id : '', tmLevelRowId(body.craa5_levelkey), body);
        }).then(function () {
            return writeCert(p, s, oldRow, level, noteText, trainer).then(null, function () { return null; });
        }).then(function () {
            var kind = level === 0 && from > 0 ? 'removed' : 'level';
            return writeEvent(tmEventBody(kind, p, s, from, level, who, today, evidence, trainer, 'Training page')).then(null, function (e) { throw new Error(tmT('The level was saved, but its history line was not: {err}', { err: tmErrText(e) })); });
        }).then(function () { setModal(null); return afterSave(tmT('{p}: {s} is now {l}.', { p: p.name, s: tmSkillName(s), l: tmLevelLabel(level) })); }).then(null, fail).then(function () { setBusy(false); });
    }
    function saveEvent(p, s, kind, level, evidence) {
        if (busy || !needTables(['event']))
            return;
        setBusy(true);
        setMsg(null);
        var cellObj = m.cells[tmLevelKey(p.id, s.key)];
        var oldRow = cellObj ? cellObj.row : null;
        writeEvent(tmEventBody(kind, p, s, level, level, who, today, evidence, null, 'Training page')).then(function () {
            if (kind === 'refresher' && canSave.cert) {
                var refreshedOld = oldRow ? { certId: oldRow.certId, certKey: oldRow.certKey, qualified: today, started: oldRow.started } : { qualified: today };
                return writeCert(p, s, refreshedOld, level, evidence || 'Refresher completed', null).then(null, function () { return null; });
            }
            return null;
        }).then(function () { setModal(null); return afterSave(kind === 'refresher' ? tmT('{p}: refresher on {s} saved.', { p: p.name, s: tmSkillName(s) }) : tmT('{p}: manual read on {s} saved.', { p: p.name, s: tmSkillName(s) })); }).then(null, fail).then(function () { setBusy(false); });
    }
    function saveBaseline(changes, done) {
        if (busy || !needTables(['skilllevel', 'event']))
            return;
        setBusy(true);
        setMsg(null);
        var ok = 0, errs = [], stamp = Date.now();
        var chain = Promise.resolve();
        changes.forEach(function (ch, i) {
            chain = chain.then(function () {
                var c = m.cells[ch.key];
                var p = m.byId[c.emp], s = m.skillByKey[c.skill];
                var old = c.row;
                var body = tmLevelBody(p, s, old, ch.level, who, today, old ? old.note : '', true);
                return ensureSkillSaved(s).then(function () {
                    return tmUpsert(dataApi, data.skilllevel.table, old && old.id ? old.id : '', tmLevelRowId(body.craa5_levelkey), body);
                }).then(function () {
                    return writeCert(p, s, old, ch.level, old ? old.note : 'Starting level baseline', null).then(null, function () { return null; });
                }).then(function () {
                    return writeEvent(tmEventBody('baseline', p, s, old ? old.level : 0, ch.level, who, today, '', null, 'Training page', stamp + i));
                }).then(function () { ok++; }, function (e) { errs.push(p.name + ' / ' + tmSkillName(s) + ': ' + tmErrText(e)); });
            });
        });
        chain.then(function () { if (!errs.length)
            done(); return afterSave(tmTn(ok, '{n} starting level saved.', '{n} starting levels saved.')); }).then(function () { if (errs.length)
            setMsg({ tone: 'bad', text: tmT('{n} not saved: {err}', { n: errs.length, err: errs.slice(0, 3).join('; ') }) }); }, fail).then(function () { setBusy(false); });
    }
    function saveSkills(list, done) {
        if (busy || !needTables(['skill']))
            return;
        var bad = list.filter(function (s) { return !tmTrim(s.key) || !tmTrim(s.en); });
        if (bad.length) {
            setMsg({ tone: 'bad', text: tmT('Every skill needs a key and an English name.') });
            return;
        }
        setBusy(true);
        setMsg(null);
        var errs = [], chain = Promise.resolve();
        list.forEach(function (s) { chain = chain.then(function () { var k = tmTrim(s.key); var sk = {}; for (var q in s)
            sk[q] = s[q]; sk.key = k; return tmUpsert(dataApi, data.skill.table, s.id || '', tmSkillRowId(k), tmSkillBody(sk)).then(null, function (e) { errs.push(k + ': ' + tmErrText(e)); }); }); });
        chain.then(function () { if (!errs.length)
            done(); return afterSave(tmTn(list.length - errs.length, '{n} skill saved.', '{n} skills saved.')); }).then(function () { if (errs.length)
            setMsg({ tone: 'bad', text: tmT('{n} not saved: {err}', { n: errs.length, err: errs.slice(0, 3).join('; ') }) }); }, fail).then(function () { setBusy(false); });
    }
    function saveSettings(s, done) {
        if (busy)
            return;
        setBusy(true);
        setMsg(null);
        var clean = tmMergeSettings(s);
        tmSaveSettings(dataApi, sw, clean).then(function (id) {
            settingsState[1](function (o) { var n = {}; for (var k in o)
                n[k] = o[k]; n.settings = clean; n.saved = clean; n.id = id || o.id; return n; });
            done();
            setMsg({ tone: 'good', text: tmT('Settings saved.') });
        }, fail).then(function () { setBusy(false); });
    }
    function checkCols() {
        setBusy(true);
        var out = {}, chain = Promise.resolve();
        TM_OWN.forEach(function (k) { if (!data[k].table)
            return; chain = chain.then(function () { return tmProbeCols(dataApi, data[k].table, TM_COLS[k]).then(function (r) { out[k] = r; }); }); });
        chain.then(function () { colsState[1](out); setBusy(false); });
    }
    var tabs = TM_TAB_LIST.filter(function (t) { return t[0] !== 'baseline' || rights.baseline; }).concat(devOpen ? TM_DEV_TAB_LIST : []);
    var shownTab = tabs.some(function (t) { return t[0] === tab; }) ? tab : 'matrix';
    function setLang(l) { tmSetLang(l); hubSetLang(l); langState[1](l); setMsg(null); }
    function setTheme(t) { hubSetTheme(t); themeState[1](t); }
    var dark = theme === 'dark';
    var th = dark ? HUB_COLORS.dark : HUB_COLORS.light;
    var noHost = !tmWeb() && !(dataApi && dataApi.queryTable);
    var problems = [];
    if (data.employees.err)
        problems.push(tmT('Employees could not be read: {err}', { err: data.employees.err }));
    TM_OWN.forEach(function (k) { if (!loadingState[0] && !noHost && !data[k].table)
        problems.push(tmT('The table {t} was not found yet, so nothing can be saved to it. Create it from the table prompts (Data tab says which name it looked for).', { t: TM_TABLES[k].label })); });
    if (data.employees.noEmail)
        problems.push(tmT('The Employees table has no craa5_email column, so the page cannot tell who you are (lead, supervisor). Until it does, only people on the developer list can change levels.'));
    if (data.msslog.err)
        problems.push(tmT('The MSS log could not be read: {err}. Levels work, but shifts, pace and ready for sign-off need it.', { err: data.msslog.err }));
    var first = user && user.name ? tmFirstName(user.name) : '';
    var mdl = modal;
    var openCell = function (emp, skill) { setModal({ type: 'cell', emp: emp, skill: skill }); };
    var openPerson = function (emp) { setModal({ type: 'person', emp: emp }); };
    var openSkill = function (skill) { setModal({ type: 'skill', skill: skill }); };
    return (React.createElement("div", { ref: rootRef, className: 'tm-root ' + (dark ? 'tm-dark' : ''), "data-theme": theme, lang: lang === 'es' ? 'es-MX' : 'en', style: { height: heightState[0] ? heightState[0] : '100vh', overflowY: 'auto', overflowX: 'hidden', backgroundColor: th.bg, color: th.text, fontFamily: "'Segoe UI', Arial, sans-serif", position: 'relative' } },
        React.createElement("header", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm tm-noprint" },
            React.createElement("div", { className: "px-4 py-2 flex flex-wrap items-center justify-between gap-2", style: { backgroundColor: '#00468B', color: '#FFFFFF', borderBottom: '1px solid #003366' } },
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("div", { className: "text-sm font-black tracking-wide", "data-welcome": "1" }, first ? tmT('Welcome, {name}, to the training matrix', { name: first }) : tmT('Welcome to the training matrix')),
                    React.createElement("div", { className: "text-[11px] font-semibold", style: { color: '#B3D4F2' } }, tmT('Who can clean what, and how fast they got there'))),
                React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-xs font-bold" },
                    rights.role ? React.createElement("span", { className: "px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[11px] font-black", style: { backgroundColor: '#003366', color: '#FFB81C', border: '1px solid rgba(255,184,28,0.4)' } }, tmT(rights.role === 'lead' ? 'Lead' : rights.role === 'supervisor' ? 'Supervisor' : rights.role === 'manager' ? 'Manager' : 'Sanitor')) : null,
                    React.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold", style: { backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF' } }, (m.certs ? m.certs.length : 0) + ' ' + tmT('Certs (_t_)')))),
            React.createElement("div", { className: "flex flex-wrap items-center gap-3 px-4 py-2.5" },
                React.createElement("div", { className: "flex items-center gap-3 mr-2" },
                    React.createElement(TmLogo, { onClick: onLogo, open: devOpen, allowed: devAllowed }),
                    React.createElement("div", { className: "border-l border-slate-200 pl-3" },
                        React.createElement("div", { className: "font-black text-[#00468B] text-base tracking-tight leading-tight" }, tmT('Training matrix')),
                        React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight" }, "Midwest Plant Sanitation System"))),
                React.createElement("nav", { className: "flex gap-1 tm-tabs", style: { overflowX: 'auto' }, role: "tablist" }, tabs.map(function (t) {
                    var n = t[0] === 'signoffs' ? m.readyList.length : 0;
                    return React.createElement("button", { key: t[0], type: "button", "data-testtab": t[0], role: "tab", "aria-selected": shownTab === t[0], onClick: function () { tabState[1](t[0]); }, className: 'px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap inline-flex items-center gap-1 transition-colors ' + (shownTab === t[0] ? 'bg-[#0072CE] text-white shadow-sm' : 'text-[#00468B] hover:bg-[#E6F1FB]') },
                        t[0] === 'setup' || t[0] === 'data' ? React.createElement(TmIcon, { name: "lock", size: 12 }) : null,
                        tmT(t[1]),
                        n ? React.createElement("span", { className: "ml-1 rounded-full px-1.5 text-[11px] font-black", style: { backgroundColor: '#FFB81C', color: '#1E293B' } }, n) : null);
                })),
                React.createElement("div", { className: "flex-1" }),
                React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                    React.createElement("div", { className: "inline-flex rounded-lg border border-slate-300 overflow-hidden", role: "group", "aria-label": tmT('Language') }, [['en', 'EN'], ['es', 'ES']].map(function (x) { return React.createElement("button", { key: x[0], type: "button", "data-lang": x[0], onClick: function () { setLang(x[0]); }, "aria-pressed": lang === x[0], title: x[0] === 'en' ? 'English' : 'Espa' + String.fromCharCode(241) + 'ol (M' + String.fromCharCode(233) + 'xico)', className: 'px-2.5 py-1.5 text-xs font-black ' + (lang === x[0] ? 'bg-[#0072CE] text-white' : 'bg-white text-slate-600 hover:bg-slate-100') }, x[1]); })),
                    React.createElement(TmBtn, { kind: "ghost", onClick: function () { setTheme(dark ? 'light' : 'dark'); }, title: dark ? tmT('Light mode') : tmT('Dark mode'), label: dark ? tmT('Light mode') : tmT('Dark mode'), pressed: dark },
                        React.createElement(TmIcon, { name: dark ? 'sun' : 'moon', size: 18 })),
                    React.createElement(TmBtn, { kind: "ghost", onClick: function () { setModal({ type: 'help' }); }, title: tmT('Help'), label: tmT('Help'), className: "font-black text-base" }, "?"),
                    React.createElement(TmBtn, { onClick: function () { reloadState[1](reloadState[0] + 1); }, disabled: busy || loadingState[0], title: tmT('Read again') },
                        React.createElement(TmIcon, { name: "refresh", size: 14 }),
                        tmT('Read again'))))),
        React.createElement("main", { className: "p-3 sm:p-4 space-y-4 max-w-[1600px] mx-auto" },
            twState[0] === 'failed' && React.createElement(TmNote, { tone: "warn" }, tmT('The page styling (cdn.tailwindcss.com) did not load on this computer, so the page looks plain. Everything still works.')),
            noHost && React.createElement(TmNote, { tone: "bad" }, tmT('This page is not connected to Dataverse (no Xrm.WebApi and no dataApi). Open it inside the model-driven app. Nothing below is real data until it is.')),
            loadingState[0] && !noHost && React.createElement(TmNote, null, tmT('Reading employees, skills, levels and the MSS log from Dataverse...')),
            problems.map(function (p, i) { return React.createElement(TmNote, { key: i, tone: "warn" }, p); }),
            msg && React.createElement(TmNote, { tone: msg.tone },
                React.createElement("div", { className: "flex items-start gap-2" },
                    React.createElement("span", { className: "flex-1", "data-msg": msg.tone }, msg.text),
                    React.createElement("button", { type: "button", className: "font-bold", onClick: function () { setMsg(null); } }, tmT('Dismiss')))),
            devOpen && (!S.devUsers || !S.devUsers.length) && shownTab !== 'setup' && React.createElement(TmNote, { tone: "warn" },
                React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                    React.createElement("span", { className: "flex-1" }, tmT('The developer tools are not locked to anyone yet. Lock them on Setup.')),
                    React.createElement(TmBtn, { onClick: function () { tabState[1]('setup'); } }, tmT('Open Setup')))),
            !loadingState[0] && !noHost && (React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 tm-noprint" },
                React.createElement(TmStat, { label: tmT('People'), value: String(m.people.length), sub: tmT('active, with a crew') }),
                React.createElement(TmStat, { label: tmT('Skills'), value: String(m.skills.length), sub: tmTn(m.skills.filter(function (s) { return s.kind === 'area'; }).length, '{n} area', '{n} areas') }),
                React.createElement(TmStat, { label: tmT('Ready for sign-off'), value: String(m.readyList.length), sub: tmTn(m.refreshList.length, '{n} refresher due', '{n} refreshers due'), tone: m.readyList.length ? 'warn' : '' }),
                React.createElement(TmStat, { label: tmT('Cleans with names'), value: String(m.logCount), sub: tmT('MSS log, last {d} days', { d: S.evidenceDays }) }))),
            shownTab === 'matrix' && React.createElement(TmMatrixTab, { m: m, filter: filter, onFilter: onFilter, dark: dark, onCell: openCell, onPerson: openPerson, onSkill: openSkill, maxHeight: Math.max(360, heightState[0] - 260) }),
            shownTab === 'signoffs' && React.createElement(TmSignoffsTab, { m: m, filter: filter, onFilter: onFilter, dark: dark, onCell: openCell }),
            shownTab === 'coverage' && React.createElement(TmCoverageTab, { m: m, onSkill: openSkill }),
            shownTab === 'people' && React.createElement(TmPeopleTab, { m: m, filter: filter, onFilter: onFilter, rights: rights, onPerson: openPerson }),
            shownTab === 'baseline' && React.createElement(TmBaselineTab, { m: m, filter: filter, rights: rights, busy: busy, onSave: saveBaseline }),
            shownTab === 'setup' && React.createElement(TmSetupTab, { m: m, skills: tmSortSkills(norm.skills), areas: norm.areas, settings: S, settingsWhere: sw, user: user, busy: busy, canSave: canSave.skill, onSaveSkills: saveSkills, onSaveSettings: saveSettings }),
            shownTab === 'data' && React.createElement(TmDataTab, { data: data, cols: colsState[0], settingsWhere: sw, manifest: manifestState[0], busy: busy, onCheckCols: checkCols, onReload: function () { reloadState[1](reloadState[0] + 1); } })),
        mdl && mdl.type === 'cell' && React.createElement(TmCellModal, { key: mdl.emp + mdl.skill, m: m, emp: mdl.emp, skill: mdl.skill, maxLevel: maxLevel, busy: busy, dark: dark, onClose: function () { setModal(null); }, onSave: saveLevel, onEvent: saveEvent }),
        mdl && mdl.type === 'person' && React.createElement(TmProfileModal, { m: m, emp: mdl.emp, rights: rights, dark: dark, onCell: openCell, onClose: function () { setModal(null); } }),
        mdl && mdl.type === 'skill' && React.createElement(TmSkillModal, { m: m, skill: mdl.skill, dark: dark, onCell: openCell, onClose: function () { setModal(null); } }),
        mdl && mdl.type === 'help' && React.createElement(TmHelpModal, { tab: shownTab, dark: dark, onClose: function () { setModal(null); } })));
}
// ==== END TRAINING APP ====

})();