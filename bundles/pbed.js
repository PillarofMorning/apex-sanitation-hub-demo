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
var PB_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDA0NjhCIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMDA0NjhCIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=";
var HUB_CONTRACT_VERSION = "1.2";
var HUB_TZ = "America/Chicago";
function hubCanon(s) {
  return String(s === void 0 || s === null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function hubLineKey(area, line) {
  var n = Math.floor(Number(line));
  return hubCanon(area) + (n > 1 ? String(n) : "");
}
function hubSameName(a, b) {
  var x = hubCanon(a);
  return x !== "" && x === hubCanon(b);
}
function hubGuid(v) {
  return String(v === void 0 || v === null ? "" : v).replace(/[{}]/g, "").trim().toLowerCase();
}
function hubIsGuid(v) {
  return /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(hubGuid(v));
}
function hubGuidList(list) {
  var seen = {}, out = [];
  (list || []).forEach(function(v) {
    var g = hubGuid(v);
    if (g && !seen[g]) {
      seen[g] = true;
      out.push(g);
    }
  });
  return out.sort().join("; ");
}
function hubSplitGuids(text) {
  return String(text || "").split(/[;,\s]+/).map(hubGuid).filter(hubIsGuid);
}
function hubCrew(val) {
  if (val === void 0 || val === null || val === "") return "";
  var s = String(typeof val === "object" ? val.Label || val.Value || val.name || "" : val).toUpperCase().trim();
  if (s.indexOf("256000000") > -1 || s === "1") return "A";
  if (s.indexOf("256000001") > -1 || s === "2") return "B";
  if (s.indexOf("256000002") > -1 || s === "3") return "C";
  if (s.indexOf("256000003") > -1 || s === "4") return "D";
  var m = s.match(/(?:^|[^A-Z])([ABCD])(?=$|[^A-Z])/);
  return m ? m[1] : "";
}
function hubIdFromKey(key) {
  var s = String(key).toLowerCase();
  var h = function(seed) {
    var x = (2166136261 ^ seed * 2654435761) >>> 0;
    for (var i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul ? Math.imul(x, 16777619) >>> 0 : x * 16777619 >>> 0;
    }
    return ("0000000" + x.toString(16)).slice(-8);
  };
  var g = h(1) + h(2) + h(3) + h(4);
  return g.slice(0, 8) + "-" + g.slice(8, 12) + "-4" + g.slice(13, 16) + "-" + "89ab".charAt(parseInt(g.charAt(16), 16) % 4) + g.slice(17, 20) + "-" + g.slice(20, 32);
}
function hubPad2(n) {
  return (n < 10 ? "0" : "") + n;
}
function hubPlantParts(ms) {
  var d = new Date(typeof ms === "number" ? ms : Date.parse(ms));
  if (isNaN(d.getTime())) return null;
  var f = new Intl.DateTimeFormat("en-US", { timeZone: HUB_TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  var o = {};
  f.formatToParts(d).forEach(function(p) {
    if (p.type !== "literal") o[p.type] = Number(p.value);
  });
  return { y: o.year, m: o.month, d: o.day, h: o.hour === 24 ? 0 : o.hour, min: o.minute };
}
function hubPlantDay(ms) {
  var p = hubPlantParts(ms);
  return p ? p.y + "-" + hubPad2(p.m) + "-" + hubPad2(p.d) : "";
}
function hubShiftDate(slotStart) {
  return hubPlantDay(slotStart);
}
function hubShiftKey(shiftDate, crew) {
  return String(shiftDate) + "|" + hubCrew(crew);
}
function hubDateOnlyUtc(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(day)) ? String(day) + "T00:00:00Z" : "";
}
function hubDayFromDateOnly(v) {
  var s = String(v || "");
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : "";
}
function hubAddDays(day, n) {
  var t = Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) + n * 864e5, d = new Date(t);
  return d.getUTCFullYear() + "-" + hubPad2(d.getUTCMonth() + 1) + "-" + hubPad2(d.getUTCDate());
}
function hubWeekKey(day) {
  var dow = new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)))).getUTCDay();
  return hubAddDays(day, dow === 0 ? -6 : 1 - dow);
}
var HUB_CLEAN_KINDS = ["daily", "midweek", "eow", "allergen", "egg", "pecan", "changeover", "monthly", "quarterly", "semiannual", "annual", "corrective", "other"];
var HUB_PLAN_KIND_MAP = { full: "daily", weekly: "eow", midweek: "midweek", allergen: "allergen", changeover: "changeover" };
function hubCleanKind(k) {
  var s = String(k || "").toLowerCase().trim();
  if (HUB_PLAN_KIND_MAP[s]) return HUB_PLAN_KIND_MAP[s];
  return HUB_CLEAN_KINDS.indexOf(s) > -1 ? s : "";
}
var HUB_FREQS = [
  { code: "D", kind: "daily", rank: 1, flag: "craa5_dailyclean" },
  { code: "MW", kind: "midweek", rank: 2, flag: "craa5_midweek" },
  { code: "W", kind: "eow", rank: 3, flag: "craa5_weeklyclean" },
  { code: "M", kind: "monthly", rank: 4, flag: "craa5_monthlyclean" },
  { code: "Q", kind: "quarterly", rank: 5, flag: "craa5_quarterly" },
  { code: "S", kind: "semiannual", rank: 6, flag: "craa5_month" },
  { code: "A", kind: "annual", rank: 7, flag: "craa5_annually" }
];
var HUB_KIND_RANK = { daily: 1, allergen: 1, egg: 1, pecan: 1, changeover: 1, corrective: 1, midweek: 2, eow: 3, monthly: 4, quarterly: 5, semiannual: 6, annual: 7, other: 0 };
function hubKindRank(kind) {
  var k = hubCleanKind(kind);
  return k ? HUB_KIND_RANK[k] || 0 : 0;
}
function hubLogRank(row) {
  if (!row) return 0;
  if (hubCleanKind(row.craa5_cleankind)) return hubKindRank(row.craa5_cleankind);
  var yes = function(v) {
    return v === true || v === 1 || /^(yes|true|1)$/i.test(String(v === void 0 || v === null ? "" : v));
  };
  return yes(row.craa5_monthly) ? 7 : yes(row.craa5_weekly) ? 3 : yes(row.craa5_daily) ? 2 : 9;
}
function hubFreqRank(code) {
  for (var i = 0; i < HUB_FREQS.length; i++) if (HUB_FREQS[i].code === code) return HUB_FREQS[i].rank;
  return 0;
}
function hubPeriodKey(code, day) {
  var d = String(day || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return "";
  var y = d.slice(0, 4), m = Number(d.slice(5, 7));
  switch (code) {
    case "D":
      return d;
    case "MW":
    case "W":
      return "w" + hubWeekKey(d);
    case "M":
      return y + "-" + d.slice(5, 7);
    case "Q":
      return y + "-Q" + Math.ceil(m / 3);
    case "S":
      return y + "-H" + (m <= 6 ? 1 : 2);
    case "A":
      return y;
  }
  return "";
}
function hubFreqDone(code, doneDays, today) {
  var need = hubFreqRank(code), p = hubPeriodKey(code, today);
  if (!need || !p) return false;
  for (var i = 0; i < (doneDays || []).length; i++) {
    var x = doneDays[i];
    if (x && (x.rank !== void 0 ? x.rank : hubKindRank(x.kind)) >= need && hubPeriodKey(code, x.day) === p) return true;
  }
  return false;
}
function hubCompletionKey(assetGuid, shiftDate, kind) {
  var g = hubGuid(assetGuid), k = hubCleanKind(kind);
  return g && /^\d{4}-\d{2}-\d{2}$/.test(String(shiftDate)) && k ? g + "|" + shiftDate + "|" + k : "";
}
function hubLogIdOf(completionKey) {
  return completionKey ? hubIdFromKey("log|" + completionKey) : "";
}
function hubStdMinutes(v) {
  var n = Number(v);
  return v === null || v === void 0 || v === "" || !isFinite(n) || n <= 0 ? null : n;
}
function hubPace(stdMinutes, actualMinutes) {
  return stdMinutes > 0 && actualMinutes > 0 ? Math.round(1e3 * stdMinutes / actualMinutes) / 10 : null;
}
function hubShare(minutes, people) {
  return people > 0 && minutes > 0 ? minutes / people : 0;
}
function hubLaborCost(minutes, hourlyRate) {
  return minutes > 0 && hourlyRate > 0 ? Math.round(minutes * hourlyRate / 60 * 100) / 100 : 0;
}
var HUB_LANG_KEY = "hub_lang";
var HUB_OLD_LANG_KEYS = ["itp_lang_v1", "ss_lang_v1", "prodsched_lang_v1", "MidwestPlant_mst_lang_v1", "MidwestPlant_org_lang_v1"];
function hubGetLang() {
  try {
    var v = window.localStorage.getItem('__1_' + HUB_LANG_KEY);
    if (v === "en" || v === "es") return v;
    for (var i = 0; i < HUB_OLD_LANG_KEYS.length; i++) if (window.localStorage.getItem('__1_' + HUB_OLD_LANG_KEYS[i]) === "es") return "es";
  } catch (e) {
  }
  return "en";
}
function hubSetLang(l) {
  try {
    window.localStorage.setItem('__1_' + HUB_LANG_KEY, l === "es" ? "es" : "en");
  } catch (e) {
  }
}
var HUB_ACC = { a: 225, e: 233, i: 237, o: 243, u: 250, n: 241, A: 193, E: 201, I: 205, O: 211, U: 218, N: 209, "?": 191, "!": 161, w: 252 };
function hubDecodeEs(s) {
  return String(s).replace(/%([aeiounAEIOUN?!w%])/g, function(m, c) {
    return c === "%" ? "%" : String.fromCharCode(HUB_ACC[c]);
  });
}
var HUB_ES = {
  "Planned": "Planeado",
  "Started": "En proceso",
  "Done": "Terminado",
  "Skipped": "Omitido",
  "Overdue": "Atrasado",
  "At risk": "En riesgo",
  "Daily": "Diaria",
  "Midweek 72h": "Media semana 72h",
  "End of week": "Fin de semana",
  "EOW": "Fin de semana",
  "Allergen": "Al%ergeno",
  "Egg allergen": "Al%ergeno huevo",
  "Pecan allergen": "Al%ergeno nuez pecana",
  "Changeover": "Cambio de producto",
  "Monthly": "Mensual",
  "Quarterly": "Trimestral",
  "Semiannual": "Semestral",
  "Annual": "Anual",
  "Corrective": "Correctiva",
  "Other": "Otra",
  "Present": "Presente",
  "Late": "Retardo",
  "Sick": "Enfermo",
  "PTO": "Vacaciones (PTO)",
  "Left early": "Sali%o temprano",
  "No call": "Falta sin aviso",
  "Loaned": "Prestado",
  "Training": "Capacitaci%on",
  "Sanitor": "Sanitizador",
  "Lead": "L%ider",
  "Supervisor": "Supervisor",
  "Manager": "Gerente",
  "Loading": "Cargando",
  "Ready": "Listo",
  "Nothing here yet": "Todav%ia no hay datos",
  "Table missing": "Falta la tabla",
  "No access": "Sin acceso",
  "Could not load": "No se pudo cargar",
  "Area": "%Area",
  "Room": "Cuarto",
  "Line": "L%inea",
  "Equipment": "Equipo",
  "Shift": "Turno",
  "Crew": "Cuadrilla",
  "Team": "Grupo",
  "Clean": "Limpieza",
  "Run": "Corrida",
  "Headcount": "Personal",
  "Minutes": "Minutos",
  "Standard": "Est%andar",
  "Pace": "Ritmo",
  "On time": "A tiempo",
  "Labor cost": "Costo de mano de obra",
  "Swab": "Hisopo",
  "Pathogen": "Pat%ogeno",
  "Work order": "Orden de trabajo",
  "Skip code": "C%odigo de omisi%on",
  "High five": "Reconocimiento",
  "Sign-off": "Aprobaci%on",
  "Help": "Ayuda",
  "Print": "Imprimir"
};
var HUB_ES_DONE = null;
function hubT(s, lang, extra) {
  if ((lang || hubGetLang()) !== "es") return s;
  if (!HUB_ES_DONE) {
    HUB_ES_DONE = {};
    for (var k in HUB_ES) if (Object.prototype.hasOwnProperty.call(HUB_ES, k)) HUB_ES_DONE[k] = hubDecodeEs(HUB_ES[k]);
  }
  if (Object.prototype.hasOwnProperty.call(HUB_ES_DONE, s)) return HUB_ES_DONE[s];
  if (extra && Object.prototype.hasOwnProperty.call(extra, s)) return hubDecodeEs(extra[s]);
  return s;
}
var HUB_THEME_KEY = "hub_theme";
function hubGetTheme() {
  try {
    var v = window.localStorage.getItem('__1_' + HUB_THEME_KEY) || window.localStorage.getItem('__1_' + "itp_theme_v1");
    return v === "dark" ? "dark" : "light";
  } catch (e) {
    return "light";
  }
}
function hubSetTheme(t) {
  try {
    window.localStorage.setItem('__1_' + HUB_THEME_KEY, t === "dark" ? "dark" : "light");
  } catch (e) {
  }
}
var HUB_COLORS = {
  light: { bg: "#F1F5F9", card: "#FFFFFF", border: "#E2E8F0", text: "#1E293B", muted: "#64748B", primary: "#0072CE", primaryDark: "#00468B", accent: "#FFB81C", accentSoft: "#FFF6E0", primarySoft: "#E6F1FB" },
  dark: { bg: "#1B2740", card: "#24324D", border: "#33425F", text: "#E2E8F0", muted: "#94A3B8", primary: "#4DA3E8", primaryDark: "#B3D4F2", accent: "#FFB81C", accentSoft: "#3A3320", primarySoft: "#1E2A42" }
};
var HUB_STATUS_COLORS = { done: "#059669", started: "#0072CE", planned: "#64748B", overdue: "#DC2626", atrisk: "#D97706", skipped: "#D97706" };
var HUB_BRAND_RED = "#E4002B";
var HUB_APP_IDS = ["ganttly", "shiftstart", "prodsched", "msscalendar", "msslog", "pbed", "bolo", "managerhub", "chemicals", "mapsubmit", "monitor", "training"];
var HUB_CONFIG_TABLES = ["craa5___1_e_hubconfig", "craa5___1_e_hubconfig"];
var HUB_MANIFEST_TABLE = HUB_CONFIG_TABLES[0];
function hubNameList(a, keepCase) {
  var out = [], seen = {};
  (a || []).forEach(function(x) {
    var v = String(x === void 0 || x === null ? "" : x).trim();
    if (!keepCase) v = v.toLowerCase();
    if (v && !seen[v]) {
      seen[v] = 1;
      out.push(v);
    }
  });
  return out;
}
var HUB_COL_TYPES = ["text", "memo", "int", "decimal", "money", "yesno", "date", "datetime", "choice", "guid"];
function hubNum(v) {
  var n = Number(v);
  return v === "" || v === null || v === void 0 || isNaN(n) ? void 0 : n;
}
function hubColSpec(c) {
  c = typeof c === "string" ? { type: c } : c || {};
  var type = String(c.type || "").trim().toLowerCase();
  if (HUB_COL_TYPES.indexOf(type) < 0) return null;
  var o = { type }, k;
  var nums = { len: hubNum(c.len), min: hubNum(c.min), max: hubNum(c.max), precision: hubNum(c.precision) };
  for (k in nums) if (nums[k] !== void 0) o[k] = nums[k];
  if (c.label) o.label = String(c.label).trim();
  if (c.options && c.options.length) o.options = c.options.map(function(x) {
    return String(x).trim();
  }).filter(function(x) {
    return !!x;
  });
  if (c["default"] !== void 0 && c["default"] !== null && c["default"] !== "") o["default"] = typeof c["default"] === "boolean" || typeof c["default"] === "number" ? c["default"] : String(c["default"]);
  return o;
}
function hubManifest(m, nowIso) {
  m = m || {};
  var tables = (m.tables || []).map(function(t) {
    var name = String(t.t || "").trim().toLowerCase();
    var out2 = { t: name, names: hubNameList(t.names && t.names.length ? t.names : [name]), read: hubNameList(t.read).sort(), write: hubNameList(t.write).sort(), opt: hubNameList(t.opt).sort() };
    var cols = {}, n = 0;
    Object.keys(t.cols || {}).sort().forEach(function(c) {
      var k = String(c).trim().toLowerCase(), v = hubColSpec(t.cols[c]);
      if (k && v) {
        cols[k] = v;
        n++;
      }
    });
    if (n) out2.cols = cols;
    if (t.label) out2.label = String(t.label).trim();
    if (t["new"] === true) out2["new"] = true;
    var ow = String(t.owner || "").trim().toLowerCase();
    if (ow === "org" || ow === "user") out2.owner = ow;
    if (t.primary && t.primary.n) {
      out2.primary = { n: String(t.primary.n).trim().toLowerCase() };
      if (hubNum(t.primary.len) !== void 0) out2.primary.len = hubNum(t.primary.len);
      if (t.primary.label) out2.primary.label = String(t.primary.label).trim();
    }
    return out2;
  }).filter(function(t) {
    return !!t.t;
  }).sort(function(a, b) {
    return a.t < b.t ? -1 : a.t > b.t ? 1 : 0;
  });
  var out = { m: 1, appId: hubCanon(m.appId), app: String(m.app || ""), version: String(m.version || ""), contract: HUB_CONTRACT_VERSION, tables, config: hubNameList(m.config, true).sort() };
  out.hash = hubIdFromKey(JSON.stringify(out)).slice(0, 8);
  out.savedAt = nowIso || (/* @__PURE__ */ new Date()).toISOString();
  return out;
}
function hubManifestKey(appId) {
  return "manifest|" + hubCanon(appId);
}
var HUB_MANIFEST_COL = "craa5_manifestjson";
function hubConfigJsonOf(row) {
  return row ? String(row[HUB_MANIFEST_COL] || row.craa5_configjson || "") : "";
}
function hubSaveManifest(io, m) {
  try {
    var man = hubManifest(m), key = hubManifestKey(man.appId);
    if (!man.appId) return Promise.resolve("failed: no appId");
    var fail = function(e) {
      return "failed: " + String(e && e.message || e);
    };
    var spots = [[HUB_CONFIG_TABLES[0], "craa5_configjson", []], [HUB_CONFIG_TABLES[1], HUB_MANIFEST_COL, ["craa5_configjson"]], [HUB_CONFIG_TABLES[1], "craa5_configjson", []]];
    var read = function(i) {
      if (i >= spots.length) return Promise.reject(new Error("no hub config table"));
      var sp = spots[i], idCol = sp[0] + "id";
      return Promise.resolve(io.query(sp[0], { select: [idCol, sp[1]].concat(sp[2]), filter: "craa5_configkey eq '" + key + "' and statecode eq 0", top: 5 })).then(function(res) {
        var rows = res && res.rows !== void 0 ? res.rows : res;
        if (!rows) throw new Error(res && res.err || "read failed");
        return { rows, table: sp[0], col: sp[1], idCol };
      }).then(null, function(e) {
        return i + 1 < spots.length ? read(i + 1) : Promise.reject(e);
      });
    };
    return read(0).then(function(r) {
      var body = { craa5_configkey: key, craa5_configname: (man.app || man.appId) + " manifest" };
      body[r.col] = JSON.stringify(man);
      var row = r.rows[0];
      if (row) {
        var old = {};
        try {
          old = JSON.parse(row[r.col] || "{}");
        } catch (e) {
        }
        if (old && old.hash === man.hash) return "same";
        return Promise.resolve(io.update(r.table, hubGuid(row[r.idCol]), body)).then(function() {
          return "saved";
        }, fail);
      }
      var create = {};
      for (var k in body) create[k] = body[k];
      create[r.idCol] = hubIdFromKey("hubconfig|" + key);
      return Promise.resolve(io.create(r.table, create)).then(function() {
        return "saved";
      }, fail);
    }, fail);
  } catch (e) {
    return Promise.resolve("failed: " + String(e && e.message || e));
  }
}
var PB_MIN = 6e4;
var PB_HOUR = 36e5;
var PB_DAY = 864e5;
var PB_BUCKET_MIN = 15;
var PB_LANG = "en";
var PB_ES = {};
var PB_ES_DONE = null;
var PB_ACC = { a: 225, e: 233, i: 237, o: 243, u: 250, n: 241, A: 193, E: 201, I: 205, O: 211, U: 218, N: 209, "?": 191, "!": 161, w: 252 };
var PB_MISSING = {};
function pbDecodeEs(s) {
  return String(s).replace(/%([aeiounAEIOUN?!w%])/g, function(m, c) {
    return c === "%" ? "%" : String.fromCharCode(PB_ACC[c]);
  });
}
function pbEsReady() {
  if (!PB_ES_DONE) {
    PB_ES_DONE = {};
    for (var k in PB_ES) if (Object.prototype.hasOwnProperty.call(PB_ES, k)) PB_ES_DONE[k] = pbDecodeEs(PB_ES[k]);
    if (typeof HUB_ES === "object" && HUB_ES) {
      for (var h in HUB_ES) if (Object.prototype.hasOwnProperty.call(HUB_ES, h)) PB_ES_DONE[h] = pbDecodeEs(HUB_ES[h]);
    }
  }
  return PB_ES_DONE;
}
function pbSetLang(l) {
  PB_LANG = l === "es" ? "es" : "en";
}
function pbT(s, vars) {
  var out = String(s);
  if (PB_LANG === "es") {
    var es = pbEsReady();
    if (Object.prototype.hasOwnProperty.call(es, out)) out = es[out];
    else if (out) PB_MISSING[out] = 1;
  }
  if (vars) out = out.replace(/\{(\w+)\}/g, function(m, k) {
    return vars[k] !== void 0 && vars[k] !== null ? String(vars[k]) : m;
  });
  if (PB_LANG === "es") out = out.replace(/ ([ap])\. m\.\./g, " $1. m.");
  return out;
}
function pbTn(n, one, many, vars) {
  var v = {};
  if (vars) {
    for (var k in vars) if (Object.prototype.hasOwnProperty.call(vars, k)) v[k] = vars[k];
  }
  v.n = n;
  return pbT(n === 1 ? one : many, v);
}
function pbTName(s) {
  var t = String(s == null ? "" : s);
  if (PB_LANG !== "es" || !t) return t;
  var es = pbEsReady();
  return Object.prototype.hasOwnProperty.call(es, t) ? es[t] : t;
}
function pbCanon(s) {
  return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]/g, "");
}
function pbTrim(s) {
  return String(s == null ? "" : s).replace(/[\t\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}
function pbNum(v) {
  if (v === null || v === void 0 || v === "") return null;
  var n = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
  return isFinite(n) ? n : null;
}
function pbInt(v, dflt) {
  var n = pbNum(v);
  return n === null ? dflt : Math.round(n);
}
function pbPad(n) {
  return n < 10 ? "0" + n : String(n);
}
function pbClamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function pbUniq(arr) {
  var seen = {}, out = [];
  for (var i = 0; i < arr.length; i++) {
    var k = String(arr[i]);
    if (!seen[k]) {
      seen[k] = 1;
      out.push(arr[i]);
    }
  }
  return out;
}
function pbSum(arr, fn) {
  var t = 0;
  for (var i = 0; i < arr.length; i++) t += (fn ? fn(arr[i]) : arr[i]) || 0;
  return t;
}
function pbKeys(o) {
  return o ? Object.keys(o) : [];
}
function pbGuidLike(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(s || "").replace(/[{}]/g, ""));
}
function pbCleanId(s) {
  return String(s || "").replace(/[{}]/g, "").toLowerCase();
}
function pbYmd(d) {
  d = d instanceof Date ? d : new Date(d);
  return d.getFullYear() + "-" + pbPad(d.getMonth() + 1) + "-" + pbPad(d.getDate());
}
function pbFromYmd(ymd) {
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(ymd || ""));
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
function pbAddDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes(), d.getSeconds());
}
function pbAt(day, hour, min) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, min || 0, 0).getTime();
}
function pbIsoZ(ms) {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}
function pbMs(v) {
  if (v === null || v === void 0 || v === "") return null;
  if (typeof v === "number") return v;
  var t = new Date(v).getTime();
  return isFinite(t) ? t : null;
}
function pbDefaultWeekend(now) {
  var d = new Date(now);
  d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var dow = d.getDay();
  var back = { 0: 1, 1: 2, 2: 3 };
  if (back[dow] !== void 0) return pbYmd(pbAddDays(d, -back[dow]));
  return pbYmd(pbAddDays(d, 6 - dow));
}
function pbWeekendFrame(sat) {
  var s = pbFromYmd(sat);
  return {
    sat: s,
    focusStart: pbAt(pbAddDays(s, -1), 18),
    focusEnd: pbAt(pbAddDays(s, 2), 6),
    readStart: pbAt(pbAddDays(s, -3), 0),
    readEnd: pbAt(pbAddDays(s, 4), 0)
  };
}
var PB_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var PB_DAY_NAMES_ES = ["dom", "lun", "mar", "mi%e", "jue", "vie", "s%ab"];
function pbDayName(i) {
  return PB_LANG === "es" ? pbDecodeEs(PB_DAY_NAMES_ES[i]) : PB_DAY_NAMES[i];
}
function pbFmtTime(ms) {
  if (ms === null || ms === void 0 || !isFinite(ms)) return "--";
  var d = new Date(ms);
  var h = d.getHours();
  var h12 = h % 12 === 0 ? 12 : h % 12;
  var ap = PB_LANG === "es" ? h < 12 ? "a. m." : "p. m." : h < 12 ? "AM" : "PM";
  return h12 + ":" + pbPad(d.getMinutes()) + " " + ap;
}
function pbFmtDayTime(ms) {
  if (ms === null || ms === void 0 || !isFinite(ms)) return "--";
  return pbDayName(new Date(ms).getDay()) + " " + pbFmtTime(ms);
}
function pbFmtDate(ms) {
  if (ms === null || ms === void 0) return "--";
  var d = new Date(ms);
  return pbDayName(d.getDay()) + " " + (PB_LANG === "es" ? d.getDate() + "/" + (d.getMonth() + 1) : d.getMonth() + 1 + "/" + d.getDate());
}
function pbFmtHours(min) {
  if (min === null || min === void 0 || !isFinite(min)) return "--";
  var neg = min < 0;
  var m = Math.round(Math.abs(min));
  var h = Math.floor(m / 60);
  var r = m % 60;
  return (neg ? "-" : "") + (h ? h + "h" : "") + (h && r ? " " : "") + (r || !h ? r + "m" : "");
}
function pbFmtNum(n, dp) {
  if (n === null || n === void 0 || !isFinite(n)) return "--";
  var p = Math.pow(10, dp || 0);
  var v = Math.round(n * p) / p;
  var s = String(Math.abs(v));
  var i = s.indexOf(".");
  var whole = i < 0 ? s : s.slice(0, i);
  return (v < 0 ? "-" : "") + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (i < 0 ? "" : s.slice(i));
}
function pbFmtMoney(n) {
  if (n === null || n === void 0 || !isFinite(n)) return "--";
  var s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (n < 0 ? "-$" : "$") + s;
}
function pbFmtPct(part, whole) {
  return whole ? Math.round(100 * part / whole) + "%" : "--";
}
function pbToLocalInput(ms) {
  if (ms === null || ms === void 0) return "";
  var d = new Date(ms);
  return pbYmd(d) + "T" + pbPad(d.getHours()) + ":" + pbPad(d.getMinutes());
}
function pbFromLocalInput(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s || ""));
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime() : null;
}
function pbReadLocal(key, dflt) {
  try {
    var raw = window.localStorage.getItem('__1_' + key);
    return raw ? JSON.parse(raw) : dflt;
  } catch (e) {
    return dflt;
  }
}
function pbWriteLocal(key, val) {
  try {
    window.localStorage.setItem('__1_' + key, JSON.stringify(val));
    return true;
  } catch (e) {
    return false;
  }
}
function pbDropLocal(key) {
  try {
    window.localStorage.removeItem('__1_' + key);
  } catch (e) {
  }
}
function pbReadSession(key) {
  try {
    return window.sessionStorage.getItem('__1_' + key);
  } catch (e) {
    return null;
  }
}
function pbWriteSession(key, v) {
  try {
    if (v === null) window.sessionStorage.removeItem('__1_' + key);
    else window.sessionStorage.setItem('__1_' + key, v);
  } catch (e) {
  }
}
function pbClone(o) {
  return o === void 0 ? void 0 : JSON.parse(JSON.stringify(o));
}
function pbErrText(e) {
  if (!e) return "Unknown error";
  var m = e.message || e.errorMessage || e.error && e.error.message || (typeof e === "string" ? e : "");
  if (!m) {
    try {
      m = JSON.stringify(e).slice(0, 200);
    } catch (x) {
      m = String(e);
    }
  }
  return String(m).replace(/[^\x20-\x7E\xA0-\xFF]/g, " ").slice(0, 300);
}
function pbField(row, name, formatted) {
  if (!row) return void 0;
  if (formatted) {
    var f = row[name + "@OData.Community.Display.V1.FormattedValue"];
    if (f !== void 0 && f !== null && f !== "") return f;
  }
  if (row[name] !== void 0) return row[name];
  var low = name.toLowerCase();
  for (var k in row) {
    if (Object.prototype.hasOwnProperty.call(row, k) && k.toLowerCase() === low) return row[k];
  }
  return void 0;
}
PB_ES = {
  " ({step} ran {over} over)": " ({step} se pas%o {over})",
  '"Foam" is matched in the subcategory name (change the word on Setup).': '"Foam" se busca en el nombre de la subcategor%ia (cambie la palabra en Configuraci%on).',
  '"auto" = filled in from Ganttly check-offs and the Shift Start board; a time you press or type wins.': '"auto" = se llena con las marcas de Ganttly y el tablero de Shift Start; la hora que usted marque o escriba manda.',
  "(2nd of the month)": "(2o del mes)",
  "(blank)": "(vac%io)",
  "(from pressed or typed times; no MSS log rows yet)": "(de horas presionadas o escritas; a%un no hay filas del registro MSS)",
  "(no name)": "(sin nombre)",
  "(no order number)": "(sin n%umero de orden)",
  "(no subcategory)": "(sin subcategor%ia)",
  "(not in the Employees table)": "(no est%a en la tabla de empleados)",
  "(projected)": "(proyectado)",
  "(read with all columns)": "(le%ida con todas las columnas)",
  "* = picked for a milestone on the Plan tab.": "* = elegido para un hito en la pesta%na Plan.",
  "1st pie": "1er pay",
  "2nd week of the month only": "Solo la 2a semana del mes",
  "A column is missing in {t}: {err}": "Falta una columna en {t}: {err}",
  "A milestone or step with one of these words in its name is starred, for example cip. Any goalpost can also be starred by hand.": "Un hito o paso con una de estas palabras en su nombre se marca con estrella, por ejemplo cip. Cualquier meta tambi%en se puede marcar a mano.",
  "A weekend uses these unless its presets were changed on the Brief tab.": "Un fin de semana usa estos, salvo que sus predeterminados se cambien en la pesta%na Junta.",
  "A word in the subcategory name. Each line can move it.": "Una palabra en el nombre de la subcategor%ia. Cada l%inea puede moverlo.",
  "Actual": "Real",
  "Actual end": "Fin real",
  "Actual start": "Inicio real",
  "Add": "Agregar",
  "Add a note": "Agregar nota",
  "Add a step": "Agregar paso",
  "Add general notes, a note per line and a note per goalpost. They print and copy with the brief.": "Agregue notas generales, una nota por l%inea y una nota por meta. Se imprimen y se copian con la junta.",
  "Add me ({who})": "Agregarme ({who})",
  "Add time loss": "Agregar tiempo perdido",
  "Add time loss with its reason and department. It goes to the time loss log the manager hub reads.": "Agregue tiempo perdido con su motivo y departamento. Va al registro de tiempo perdido que lee el hub de gerencia.",
  "Add to plan": "Agregar al plan",
  "Add work orders from SAP": "Agregar %ordenes de trabajo de SAP",
  "After milestone {name}": "Despu%es del hito {name}",
  "After the foam milestone (default)": "Despu%es del hito Foam (predeterminado)",
  "After the sanitation milestones": "Despu%es de los hitos de sanidad",
  "All": "Todas",
  "All {n} found": "Las {n} encontradas",
  "Allergen clean": "Limpieza de al%ergenos",
  "Already down before Friday in the schedule: set the stop time": "Ya en paro antes del viernes en el programa: fije la hora de paro",
  "Area": "%Area",
  "Area code {a}": "C%odigo de %area {a}",
  "Area...": "%Area...",
  "Areas with equipment that are not in the plan this weekend (no stop in the production schedule, or taken out).": "%Areas con equipo que no est%an en el plan este fin de semana (sin paro en el programa de producci%on, o quitadas).",
  "Assets (Ganttly, MSS)": "Activos (Ganttly, MSS)",
  "BIGGEST COSTS": "MAYORES COSTOS",
  "Back to default": "Volver al predeterminado",
  "Back to the default presets": "Volver a los predeterminados",
  "Before the first sanitation milestone": "Antes del primer hito de sanidad",
  "Before the sanitation milestones": "Antes de los hitos de sanidad",
  "Biggest costs this weekend": "Mayores costos este fin de semana",
  "Biggest time loss: {reason}, {ph} people-hours{money}.": "Mayor tiempo perdido: {reason}, {ph} horas-persona{money}.",
  "Blank = the Shift Start board": "Vac%io = el tablero de Shift Start",
  "Blank = the preset": "Vac%io = el predeterminado",
  "Blank = the roster": "Vac%io = la plantilla",
  "Blank = the work orders total, {h} h": "Vac%io = total de %ordenes de trabajo, {h} h",
  "Brief": "Junta",
  "Brief - weekend of {date}": "Junta - fin de semana del {date}",
  "By department": "Por departamento",
  "Cancel": "Cancelar",
  "Check columns": "Revisar columnas",
  "Checking...": "Revisando...",
  "Chemical or supplies": "Qu%imicos o insumos",
  "Clean done": "Limpieza terminada",
  "Clean done (actual)": "Limpieza terminada (real)",
  "Clean done (plan)": "Limpieza terminada (plan)",
  "Clean done = the last sanitation milestone or maintenance block. Ready for restart = the last step before the restart (swab); projected from the clean when it was not recorded.": "Limpieza terminada = el %ultimo hito de sanidad o bloque de mantenimiento. Listo para arranque = el %ultimo paso antes del arranque (hisopado); se proyecta desde la limpieza si no se registr%o.",
  "Clean on plan": "Limpieza seg%un plan",
  "Clean plan (stops and restarts)": "Plan de limpieza (paros y arranques)",
  "Clean plan alerts": "Alertas del plan de limpieza",
  "Close": "Cerrar",
  "Close up": "De cerca",
  "Columns": "Columnas",
  "Copied": "Copiado",
  "Copy brief as text": "Copiar junta como texto",
  "Copy brief puts the text on the clipboard for Teams or email. Print gives the paper copy.": "Copiar la junta pone el texto en el portapapeles para Teams o correo. Imprimir da la copia en papel.",
  "Copy debrief as text": "Copiar cierre como texto",
  "Copy debrief as text for the email, or Print for paper.": "Copiar cierre como texto para el correo, o Imprimir para papel.",
  "Copy failed": "No se pudo copiar",
  "Copy failed: select the text and copy it by hand": "No se pudo copiar: seleccione el texto y c%opielo a mano",
  "Could not load": "No se pudo cargar",
  "Could not remove it: {err}": "No se pudo quitar: {err}",
  "Could not tell": "No se pudo saber",
  "Could not tell whether the column craa5_plan_json exists: {err}": "No se pudo saber si existe la columna craa5_plan_json: {err}",
  "Crew": "Cuadrilla",
  "Crew for this line": "Cuadrilla para esta l%inea",
  "Crew on shift - people": "Cuadrilla en turno - personas",
  "Crew {crew} ({when}) had {n} more on shift than the plan needed at its busiest: {ph} people-hours not booked.": "La cuadrilla {crew} ({when}) tuvo {n} m%as en turno de lo que el plan necesit%o en su pico: {ph} horas-persona sin asignar.",
  "Crew {crew} ({when}) was {n} short at the busiest point of the plan.": "La cuadrilla {crew} ({when}) tuvo {n} de menos en el pico del plan.",
  "Crew {crew} - {from} to {to}": "Cuadrilla {crew} - {from} a {to}",
  "Crew {crew} {from} to {to}: {n} people. Double click to change.": "Cuadrilla {crew} {from} a {to}: {n} personas. Doble clic para cambiar.",
  "Crew {crew}: {from} to {to}": "Cuadrilla {crew}: {from} a {to}",
  "Crew {c}": "Cuadrilla {c}",
  "Crew {c} is on shift when it starts.": "La cuadrilla {c} est%a en turno cuando empieza.",
  "Dark mode": "Modo oscuro",
  "Data": "Datos",
  "Days": "D%ias",
  "Debrief": "Cierre",
  "Debrief - weekend of {date}": "Cierre - fin de semana del {date}",
  "Debris pick up, rinse down, handoff to sanitation": "Recoger residuos, enjuague, entrega a sanidad",
  "Default goalpost presets (every weekend)": "Metas predeterminadas (todos los fines de semana)",
  "Default {d}: the heads the pieces need ({h})": "Predeterminado {d}: las personas que piden las piezas ({h})",
  "Delete from {t}": "Borrar de {t}",
  "Delete is not available here": "Aqu%i no se puede borrar",
  "Department": "Departamento",
  "Department responsible": "Departamento responsable",
  "Dept": "Depto",
  "Details": "Detalles",
  "Developer access": "Acceso de desarrollador",
  "Developer access: Add me locks Setup and Data to the listed Microsoft accounts. Until someone is listed they stay open to anyone who clicks the logo.": "Acceso de desarrollador: Agregarme bloquea Ajustes y Datos a las cuentas de Microsoft de la lista. Hasta que haya alguien en la lista, quedan abiertos para cualquiera que haga clic en el logo.",
  "Dismiss": "Descartar",
  "Done": "Terminado",
  "Done (Ganttly and Shift Start)": "Terminado (Ganttly y Shift Start)",
  "Done editing": "Terminar edici%on",
  "Double click a name to see their experience by area. An asterisk marks people picked for a milestone on the Plan tab.": "Haga doble clic en un nombre para ver su experiencia por %area. Un asterisco marca a la gente elegida para un hito en la pesta%na Plan.",
  "Double click for details.": "Doble clic para ver detalles.",
  "Double click for experience": "Doble clic para ver experiencia",
  "Down": "Bajar",
  'Each block is a subcategory milestone: its number is the clean order and "4p" is the people on it. Same numbers run side by side. Click a line name to open its steps; double click any block for its equipment, people and times. Gold outline = key goalpost. The thin bar under a block is what really happened (green on time, red late). Black line = production stops, red dashed line = restart.': 'Cada bloque es un hito de subcategor%ia: su n%umero es el orden de limpieza y "4p" son las personas asignadas. Los n%umeros iguales van en paralelo. Haga clic en el nombre de una l%inea para abrir sus pasos; doble clic en cualquier bloque para ver equipo, personas y horas. Contorno dorado = meta clave. La barra delgada bajo un bloque es lo que pas%o en realidad (verde a tiempo, rojo tarde). L%inea negra = paro de producci%on, l%inea roja punteada = arranque.',
  "Each line shows its stop and restart from the clean plan of the Scheduler, or from the production runs until a plan is published. Click a line name to change them, mark an allergen clean or leave the line out.": "Cada l%inea muestra su paro y su arranque seg%un el plan de limpieza del Programador, o seg%un las corridas de producci%on hasta que se publique un plan. Haga clic en el nombre de la l%inea para cambiarlos, marcar una limpieza de al%ergeno o dejar la l%inea fuera.",
  "Each milestone fills in by itself from Ganttly check-offs and the Shift Start board: started at the first piece, done when every piece is done.": "Cada hito se llena solo con las marcas de Ganttly y el tablero de Shift Start: inicia con la primera pieza y termina cuando todas las piezas est%an listas.",
  "Each person is costed at the rate of the pay role on their employee row (the Role lookup); no role, or no rate row for it, counts as sanitation tech 2.": "Cada persona se costea a la tarifa del rol de pago de su fila de empleado (la b%usqueda Role); sin rol, o sin fila de tarifa para %el, cuenta como sanitation tech 2.",
  "Each weekend shift lists who is on it from the Shift Start board, or the Employees roster when there is no board yet.": "Cada turno del fin de semana muestra qui%en est%a en %el seg%un el tablero de Shift Start, o la lista de Empleados cuando a%un no hay tablero.",
  "Edit": "Editar",
  "Edit presets": "Editar predeterminados",
  "Edit presets changes the OPS and FSQ steps for this weekend only. Make these the default saves them for every weekend.": "Editar predeterminados cambia los pasos de OPS y FSQ solo para este fin de semana. El bot%on para hacerlos predeterminados los guarda para todos los fines de semana.",
  "Email of another developer": "Correo de otro desarrollador",
  "Employees": "Empleados",
  "Employees could not be read: {err}": "No se pudieron leer los empleados: {err}",
  "Employees table": "Tabla de empleados",
  "End": "Fin",
  "Equipment": "Equipo",
  "Equipment (assets) could not be read: {err}": "No se pudo leer el equipo (activos): {err}",
  "Equipment ({n})": "Equipo ({n})",
  "Equipment breakdown": "Falla de equipo",
  "Equipment in the plan": "Equipo en el plan",
  'Equipment named "2nd Wk of Month" only on the 2nd weekend (Saturday the 8th to 14th)': 'Equipo llamado "2nd Wk of Month" solo en el 2o fin de semana (s%abado del 8 al 14)',
  "Every line is ready with 2 hours or more to spare.": "Todas las l%ineas est%an listas con 2 horas o m%as de sobra.",
  "Every milestone: plan against actual ({n} recorded)": "Todos los hitos: plan contra real ({n} registrados)",
  "Every number on the page comes from these reads. When one fails, the page says what is missing instead of making anything up.": "Cada n%umero en la p%agina sale de estas lecturas. Si una falla, la p%agina dice qu%e falta en vez de inventar algo.",
  "Execute": "Ejecuci%on",
  "Experience is still being worked out from Shift Start history. Try again in a moment.": "La experiencia a%un se est%a calculando con el historial de Shift Start. Intente de nuevo en un momento.",
  "Experience is still being worked out in the background, so the list is not ranked yet.": "La experiencia a%un se calcula en segundo plano, as%i que la lista todav%ia no est%a ordenada.",
  "FSQ inspect": "Inspecci%on FSQ",
  "Failed inspection or swab (re-clean)": "Falla en inspecci%on o hisopado (relimpieza)",
  "Filled in from Ganttly check-offs and the Shift Start board": "Llenado con las marcas de Ganttly y el tablero de Shift Start",
  "First stop": "Primer paro",
  "Focus areas, call-outs, contractor work, anything the crews need to know": "%Areas de enfoque, avisos, trabajo de contratistas, todo lo que las cuadrillas deben saber",
  "For example: CIP must be signed off before swab": "Por ejemplo: CIP debe firmarse antes del hisopado",
  "For example: contractor on the oven Saturday 6 AM": "Por ejemplo: contratista en el horno el s%abado 6 AM",
  "Found as": "Encontrada como",
  "From the Employees table roster (no Shift Start board for this shift yet).": "De la plantilla en la tabla de empleados (a%un no hay tablero de Shift Start para este turno).",
  "From the Scheduler, for this plant week and the weekend. An alert is never a clean.": "Del Programador, para esta semana de planta y el fin de semana. Una alerta nunca es una limpieza.",
  "From the Shift Start board.": "Del tablero de Shift Start.",
  "From the Shift Start planned board.": "Del tablero planeado de Shift Start.",
  "From the clean plan (Scheduler):": "Del plan de limpieza (Programador):",
  "From the clean plan.": "Del plan de limpieza.",
  "From the last run ({yn})": "De la %ultima corrida ({yn})",
  "From the production schedule.": "Del programa de producci%on.",
  "From the production schedule:": "Del programa de producci%on:",
  "Ganttly check-offs": "Marcas de Ganttly",
  "Goalpost presets": "Metas predeterminadas",
  "HEADLINES": "RESUMEN",
  "Headcount": "Personal",
  "Headcount by shift (needed at peak / on shift):": "Personas por turno (necesarias en pico / en turno):",
  "Headcount comes from the crew on shift. Click a shift to change its headcount for this weekend.": "El personal viene de la cuadrilla en turno. Haga clic en un turno para cambiar su personal en este fin de semana.",
  "Heads": "Personas",
  "Help": "Ayuda",
  "Help: {tab}": "Ayuda: {tab}",
  "Hide": "Ocultar",
  "Hide the developer tools": "Ocultar herramientas de desarrollador",
  "Highspeed and Custard both scheduled": "Highspeed y Custard programadas a la vez",
  "Hit": "Cumplida",
  "Hours": "Horas",
  "Hours not used": "Horas sin usar",
  "Hours used": "Horas usadas",
  "How to use this tab": "C%omo usar esta pesta%na",
  "In": "Incluir",
  "In the SAP export, select the rows with the header row (Priority, Order, Description, Description2, Order Type, Functional loc., Bas. start date, Main WorkCtr, Sort field), copy, and paste here. A .csv or .txt file works too.": "En la exportaci%on de SAP, seleccione las filas con la fila de encabezados (Priority, Order, Description, Description2, Order Type, Functional loc., Bas. start date, Main WorkCtr, Sort field), copie y pegue aqu%i. Tambi%en sirve un archivo .csv o .txt.",
  "In the plan this weekend": "En el plan este fin de semana",
  'It is saved to the _p_ Plan table (row "config") when you press Save setup.': 'Se guarda en la tabla _p_ Plan (fila "config") al presionar Guardar configuraci%on.',
  "It took {n} rows of {c} characters: the {col} column of _p_ Plan is smaller than the plan.": "Ocup%o {n} filas de {c} caracteres: la columna {col} de _p_ Plan es m%as chica que el plan.",
  "It took {n} rows: the {col} column of _p_ Plan holds only {c} characters.": "Ocup%o {n} filas: la columna {col} de _p_ Plan guarda solo {c} caracteres.",
  "It waits {t} after the step before it, because the people are busy on other lines.": "Espera {t} despu%es del paso anterior, porque las personas est%an ocupadas en otras l%ineas.",
  "KEY GOALPOSTS": "METAS CLAVE",
  "KEY GOALPOSTS: {hit} of {n} hit": "METAS CLAVE: {hit} de {n} cumplidas",
  "Keep these times": "Conservar estas horas",
  "Keep these times saves the automatic times to the _p_ Milestone table, so the debrief has them later.": "Conservar estas horas guarda las horas autom%aticas en la tabla _p_ Milestone, para que el cierre las tenga despu%es.",
  "Key goalpost": "Meta clave",
  "Key goalpost words": "Palabras de meta clave",
  "Key goalpost words: a milestone or step with one of these words in its name is starred by itself.": "Palabras de meta clave: un hito o paso con una de estas palabras en su nombre se marca solo con estrella.",
  "Key goalpost: click to unstar": "Meta clave: clic para quitar estrella",
  "Key goalposts": "Metas clave",
  "Key goalposts lead the brief, Execute and the debrief.": "Las metas clave van primero en la junta, Ejecuci%on y el cierre.",
  "Labor": "Mano de obra",
  "Labor (MSS log)": "Mano de obra (registro MSS)",
  "Labor against plan": "Mano de obra contra plan",
  "Labor comes from the MSS log when Ganttly logged the pieces; until then from the times pressed or typed on Execute.": "La mano de obra viene del registro MSS cuando Ganttly registr%o las piezas; hasta entonces, de las horas presionadas o escritas en Ejecuci%on.",
  "Labor rate": "Tarifa de mano de obra",
  "Labor rate per hour": "Tarifa de mano de obra por hora",
  "Language": "Idioma",
  "Last 56 days, from Shift Start boards (archive) and task assignments. A row with no end time counts as a day but no hours.": "%Ultimos 56 d%ias, de tableros de Shift Start (archivo) y asignaciones de tareas. Una fila sin hora de fin cuenta como d%ia pero sin horas.",
  "Last clean done": "%Ultima limpieza terminada",
  "Last clean done {at}.": "%Ultima limpieza terminada {at}.",
  "Last seen": "%Ultima vez",
  "Late production handoff": "Entrega tard%ia de producci%on",
  'Leave out "on demand" subcategories': 'Dejar fuera subcategor%ias "on demand"',
  "Leave out {name}": "Dejar fuera {name}",
  "Left out by hand": "Quitado a mano",
  "Left out by the Scheduler": "Fuera por el Programador",
  "Left out of this area ({n})": "Fuera de esta %area ({n})",
  "Light mode": "Modo claro",
  "Line": "L%inea",
  "Line note": "Nota de l%inea",
  "Line order": "Orden de l%ineas",
  "Lines in the plan": "L%ineas en el plan",
  "Listed with the most time in {area} first (last 56 days). Double click a name to see their experience.": "Primero quienes tienen m%as tiempo en {area} (%ultimos 56 d%ias). Doble clic en un nombre para ver su experiencia.",
  "Live from Ganttly and Shift Start": "En vivo de Ganttly y Shift Start",
  "Live shift boards": "Tableros de turno en vivo",
  "Load theirs (drop mine)": "Cargar la de ellos (descartar la m%ia)",
  "Loading": "Cargando",
  "Logged labor is costed by each person's role.": "La mano de obra registrada se costea seg%un el rol de cada persona.",
  "Logged labor is costed by each person's role; {n} at the {role} rate (no role, or no rate row for it).": "La mano de obra registrada se costea seg%un el rol de cada persona; {n} a la tarifa de {role} (sin rol, o sin fila de tarifa para %el).",
  "Looks like {name}: use it": "Parece {name}: usarlo",
  "Lost": "Perdido",
  "MSS log (finished cleans)": "Registro MSS (limpiezas terminadas)",
  "Maintenance": "Mantenimiento",
  "Maintenance PM/CM": "Mantenimiento PM/CM",
  "Maintenance goes after the foam milestone with the hours of its work orders. Open its block to move it, change the hours or let it take the spare time before the restart.": "Mantenimiento va despu%es del hito Foam con las horas de sus %ordenes de trabajo. Abra su bloque para moverlo, cambiar las horas o dejar que tome el margen antes del arranque.",
  "Maintenance goes after the milestone named": "Mantenimiento va despu%es del hito llamado",
  "Maintenance has {n} work order but no hours: add hours on the Work orders tab or on the block": "Mantenimiento tiene {n} orden de trabajo pero sin horas: agregue horas en la pesta%na %Ordenes de trabajo o en el bloque",
  "Maintenance has {n} work orders but no hours: add hours on the Work orders tab or on the block": "Mantenimiento tiene {n} %ordenes de trabajo pero sin horas: agregue horas en la pesta%na %Ordenes de trabajo o en el bloque",
  "Maintenance hours": "Horas de mantenimiento",
  "Maintenance overrun": "Mantenimiento excedido",
  "Maintenance runs until the restart; sanitation does not move.": "Mantenimiento corre hasta el arranque; sanidad no se mueve.",
  "Maintenance takes all the spare time before the restart": "Mantenimiento toma todo el margen antes del arranque",
  "Maintenance takes the spare time before the restart on every line (each line can turn it off in its maintenance window)": "Mantenimiento toma el margen antes del arranque en todas las l%ineas (cada l%inea puede quitarlo en su ventana de mantenimiento)",
  "Make the four _p_ tables with the Copilot prompts in pbed-table-prompts.md (one table per prompt, no lookups). The time loss log is the manager hub table _m_Time loss log (prompts 2 and 3 in the manager hub table prompts): if it already exists, nothing to do.": "Cree las cuatro tablas _p_ con los prompts de Copilot en pbed-table-prompts.md (una tabla por prompt, sin columnas de b%usqueda). El registro de tiempo perdido es la tabla del manager hub _m_Time loss log (prompts 2 y 3 en los prompts de tablas del manager hub): si ya existe, no hay nada que hacer.",
  "Make these the default for every weekend": "Usar como predeterminado para todos los fines de semana",
  "Milestone": "Hito",
  "Milestone {n}": "Hito {n}",
  "Milestones are the equipment subcategories in clean order. Click a block to set the people on it, leave out a piece or pick names.": "Los hitos son las subcategor%ias del equipo en orden de limpieza. Haga clic en un bloque para poner la gente, dejar fuera una pieza o elegir nombres.",
  "Minutes": "Minutos",
  "Minutes come from the assets table (Hours required holds minutes)": "Los minutos vienen de la tabla de activos (Hours required guarda minutos)",
  "Minutes lost": "Minutos perdidos",
  "Minutes on this line": "Minutos en esta l%inea",
  "Missed": "No cumplida",
  "Missed: {list}.": "No cumplidas: {list}.",
  "Missing: {list}": "Faltan: {list}",
  "Most people one milestone gets. Blank = {src}.": "M%aximo de personas por hito. Vac%io = {src}.",
  "Move down": "Mover abajo",
  "Move up": "Mover arriba",
  "Needs equipment": "Sin equipo",
  "New step": "Paso nuevo",
  "Next": "Siguiente",
  "No": "No",
  'No "Order" column was found in the first row. Copy the header row from the SAP export too.': 'No se encontr%o la columna "Order" en la primera fila. Copie tambi%en la fila de encabezados de la exportaci%on de SAP.',
  'No "{col}" column: asset matching will be by hand': 'Sin columna "{col}": la asignaci%on de activos ser%a a mano',
  "No Dataverse here": "Sin Dataverse aqu%i",
  "No End of Week clean this week": "Sin limpieza de fin de semana esta semana",
  "No access": "Sin acceso",
  "No crew": "Sin cuadrilla",
  "No crew is known for this time.": "No se conoce cuadrilla para esta hora.",
  "No equipment in the assets table": "No hay equipo en la tabla de activos",
  "No equipment with a subcategory for this area in the assets table": "No hay equipo con subcategor%ia para esta %area en la tabla de activos",
  "No headcount limit on this line (it still counts in the totals)": "Sin l%imite de personas en esta l%inea (s%i cuenta en los totales)",
  "No labor rate set: add a row to the _e_ Labor rate table (hub - manager Setup).": "No hay tarifa de mano de obra: agregue una fila a la tabla _e_ Labor rate (Ajustes de hub - manager).",
  "No labor rate set: add a row to the _e_ Labor rate table (role sanitation tech 2, or Sanitor, or All).": "No hay tarifa de mano de obra: agregue una fila a la tabla _e_ Labor rate (rol sanitation tech 2, o Sanitor, o All).",
  "No line is in the plan for this weekend yet.": "A%un no hay l%ineas en el plan para este fin de semana.",
  "No line is in the plan for this weekend. Lines join when the production schedule shows them stopping for the weekend, or add one on the Other areas list below.": "No hay l%ineas en el plan para este fin de semana. Las l%ineas entran cuando el programa de producci%on muestra su paro de fin de semana, o agregue una en la lista Otras %areas abajo.",
  "No live Shift Start board now": "No hay tablero de Shift Start en vivo ahora",
  "No maintenance block this weekend": "Sin bloque de mantenimiento este fin de semana",
  "No maintenance hours set": "Sin horas de mantenimiento",
  "No permission to read {t}": "Sin permiso para leer {t}",
  "No regular employee on this shift was found in the Employees table.": "No se encontr%o ning%un empleado regular de este turno en la tabla de empleados.",
  "No restart set": "Sin arranque fijado",
  "No rows came back from {t}": "No llegaron filas de {t}",
  "No run after the weekend in the production schedule yet: set the restart time": "A%un no hay corrida despu%es del fin de semana en el programa de producci%on: fije la hora de arranque",
  "No runs in the production schedule this week": "No hay corridas en el programa de producci%on esta semana",
  "No shift history for this person in the last 56 days (Shift Start boards and task assignments).": "Sin historial de turnos de esta persona en los %ultimos 56 d%ias (tableros de Shift Start y asignaciones de tareas).",
  "No spare time to add this weekend": "No hay margen que agregar este fin de semana",
  "No time loss recorded.": "Sin tiempo perdido registrado.",
  "No work orders for this line this weekend": "Sin %ordenes de trabajo para esta l%inea este fin de semana",
  "Nobody found.": "No se encontr%o a nadie.",
  "None here.": "Ninguno aqu%i.",
  'None yet. Paste the SAP list on the Work orders tab and tick "This weekend".': 'A%un no hay. Pegue la lista de SAP en la pesta%na %Ordenes de trabajo y marque "Este fin de semana".',
  "None.": "Ninguno.",
  "Normal": "Normal",
  "Not a key goalpost": "No es meta clave",
  "Not in the production schedule: type it.": "No est%a en el programa de producci%on: escr%ibala.",
  "Not locked yet: anyone who clicks the logo can open Setup and Data. Add yourself to lock it.": "A%un sin bloquear: cualquiera que haga clic en el logo puede abrir Configuraci%on y Datos. Agr%eguese para bloquearlo.",
  "Not ready for the restart: {lines}.": "No listas para el arranque: {lines}.",
  "Not saved yet": "A%un no guardado",
  "Not saved: {err}": "No guardado: {err}",
  "Note": "Nota",
  "Note for the brief": "Nota para la junta",
  "Note for this goalpost": "Nota para esta meta",
  "Notes": "Notas",
  "Notes for the brief": "Notas para la junta",
  "Nothing here yet": "Todav%ia no hay datos",
  "Nothing recorded yet. Times come in from Ganttly and Shift Start, or are pressed on Execute.": "A%un no hay nada registrado. Las horas llegan de Ganttly y Shift Start, o se marcan en Ejecuci%on.",
  "Nothing to do": "Nada que hacer",
  "Nothing to extend: no work orders and no hours.": "Nada que alargar: sin %ordenes de trabajo ni horas.",
  "Nothing was pasted": "No se peg%o nada",
  "Nothing yet: record actual times on Execute and time loss below.": "A%un nada: registre horas reales en Ejecuci%on y el tiempo perdido abajo.",
  "Off by": "Diferencia",
  "Offset minutes": "Minutos de desfase",
  "On demand": "Bajo demanda",
  "On shift": "En turno",
  "On track": "En tiempo",
  "One less": "Uno menos",
  "One more": "Uno m%as",
  "Open": "Pendiente",
  "Open Setup": "Abrir Configuraci%on",
  "Operations": "Operaciones",
  "Optional: names the pay role when an employee row carries only its id": "Opcional: da el nombre del rol de pago cuando la fila del empleado solo trae su id",
  "Order": "Orden",
  "Order {order} is pasted twice; the first one was kept": "La orden {order} se peg%o dos veces; se dej%o la primera",
  "Orders with a basic start date on or before Monday of this weekend are put on this weekend.": "Las %ordenes con fecha de inicio b%asica hasta el lunes de este fin de semana se ponen en este fin de semana.",
  "Other": "Otro",
  "Other areas": "Otras %areas",
  "Over 72 h without a Midweek clean": "M%as de 72 h sin limpieza de media semana",
  "Overdue": "Atrasado",
  "Overlaps a run": "Se encima con una corrida",
  "Overran: {line} - {step}": "Se pas%o: {line} - {step}",
  "PBED DEBRIEF - weekend of {date}": "PBED CIERRE - fin de semana del {date}",
  "PBED brief - weekend of {date}": "PBED junta - fin de semana del {date}",
  "Paste the SAP work order rows (with the header row) or load a .csv file, then Read the paste.": "Pegue las filas de %ordenes de trabajo de SAP (con la fila de encabezado) o cargue un archivo .csv, y luego Leer lo pegado.",
  "Paste the rows here": "Pegue las filas aqu%i",
  "Peak needed": "Necesarias en pico",
  "Peak people needed": "Personas necesarias en pico",
  "People": "Personas",
  "People by shift": "Personas por turno",
  "People for sanitation on this shift": "Personas de sanidad en este turno",
  "People in this area on the Shift Start board now": "Personas en esta %area en el tablero de Shift Start ahora",
  "People on it": "Personas asignadas",
  "People on shift but not booked on a weekend clean": "Personas en turno sin asignar a una limpieza de fin de semana",
  "People waiting": "Personas esperando",
  "People who did it": "Personas que lo hicieron",
  "People-hours not used": "Horas-persona sin usar",
  "Pick a line": "Elija una l%inea",
  "Pick an area first": "Primero elija un %area",
  "Pick the area and the equipment for each order once; the page remembers the location for next time.": "Elija el %area y el equipo de cada orden una vez; la p%agina recuerda la ubicaci%on para la pr%oxima.",
  "Pick the equipment...": "Elija el equipo...",
  "Pick the weekend with Prev, Next or the date box. The page reads the production schedule, equipment, shifts and employees for it.": "Elija el fin de semana con Anterior, Siguiente o la casilla de fecha. La p%agina lee el programa de producci%on, el equipo, los turnos y los empleados de ese fin de semana.",
  "Picked": "Elegido",
  "Picked for {list}": "Elegido para {list}",
  "Pieces logged": "Piezas registradas",
  "Pieces logged = MSS log rows for this weekend (pieces / person-minutes).": "Piezas registradas = filas del registro MSS de este fin de semana (piezas / minutos-persona).",
  "Pieces logged = cleans in the MSS log for this weekend (pieces / person-minutes); a second crew's entry for the same piece counts once, its minutes add up.": "Piezas registradas = limpiezas del registro MSS de este fin de semana (piezas / minutos-persona); la entrada de otra cuadrilla para la misma pieza cuenta una vez y sus minutos se suman.",
  "Pieces the Scheduler left out of this clean (case-out, dry clean, freezer) are listed under Left out in the block window with the reason; Put back adds one for this weekend. Clean plan alerts (over 72 h without a midweek clean, no End of Week clean, Highspeed and Custard together) show above the timeline for this plant week.": "Las piezas que el Programador dej%o fuera de esta limpieza (case-out, limpieza en seco, congelador) aparecen bajo Fuera en la ventana del bloque con el motivo; Regresar agrega una para este fin de semana. Las alertas del plan de limpieza (m%as de 72 h sin limpieza de media semana, sin limpieza de fin de semana, Highspeed y Custard a la vez) se muestran arriba de la l%inea de tiempo para esta semana de planta.",
  "Plan": "Plan",
  "Plan - Brief - Execute - Debrief": "Plan - Junta - Ejecuci%on - Cierre",
  "Plan being updated": "Plan en actualizaci%on",
  "Plan saved on this computer only: the _p_ Plan table was not found (see Data).": "Plan guardado solo en esta computadora: no se encontr%o la tabla _p_ Plan (vea Datos).",
  "Plan saved to Dataverse.": "Plan guardado en Dataverse.",
  "Planned end": "Fin planeado",
  "Planned hours": "Horas planeadas",
  "Planned shift boards": "Tableros de turno planeados",
  "Planned {from} to {to}": "Planeado {from} a {to}",
  "Preflight": "Prearranque",
  "Press Check columns": "Presione Revisar columnas",
  "Press Save plan. Unsaved changes are kept on this computer until you do.": "Presione Guardar plan. Los cambios sin guardar se quedan en esta computadora hasta que lo haga.",
  "Press Start or Done on a block to record a time by hand. A pressed or typed time always wins over the automatic one.": "Presione Inicio o Terminado en un bloque para registrar una hora a mano. Una hora presionada o escrita siempre gana a la autom%atica.",
  "Prev": "Anterior",
  "Pri": "Prio",
  "Print": "Imprimir",
  "Production restarts": "Arranque de producci%on",
  "Production restarts {at}": "Arranque de producci%on {at}",
  "Production schedule runs": "Corridas del programa de producci%on",
  "Production stops": "Paro de producci%on",
  "Production stops {at}": "Paro de producci%on {at}",
  "Put back": "Regresar",
  "Quality (FSQ)": "Calidad (FSQ)",
  "Read": "Lectura",
  "Read again": "Leer de nuevo",
  "Read from the shared _e_ Labor rate table: the newest row whose Effective from is on or before the weekend (undated rows are not used). Each person is costed at the rate of the role on their employee row ({n} roles have a rate); no role, or no row for it, counts as {role}. Planned cost uses that rate too.": "Se lee de la tabla compartida _e_ Labor rate: la fila m%as reciente cuya fecha Effective from es igual o anterior al fin de semana (las filas sin fecha no se usan). Cada persona se costea a la tarifa del rol de su fila de empleado ({n} roles tienen tarifa); sin rol, o sin fila para %el, cuenta como {role}. El costo planeado usa esa misma tarifa.",
  "Read from the shared _e_ Labor rate table: the newest row whose Effective from is on or before the weekend, role Sanitor, else All. It is not typed here any more.": "Se lee de la tabla compartida _e_ Labor rate: la fila m%as nueva cuya fecha Effective from es igual o anterior al fin de semana, rol Sanitor, si no All. Ya no se escribe aqu%i.",
  "Read in the background for experience": "Se lee en segundo plano para la experiencia",
  "Read now": "Leer ahora",
  "Read of {t}": "Lectura de {t}",
  "Read the paste": "Leer lo pegado",
  "Read {at}. Reads again every 2 minutes while this tab is open.": "Le%ido {at}. Se vuelve a leer cada 2 minutos con esta pesta%na abierta.",
  "Reading equipment, shifts and employees from Dataverse...": "Leyendo equipos, turnos y empleados de Dataverse...",
  "Reading your user record": "Lectura de su usuario",
  "Reading...": "Leyendo...",
  "Ready": "Listo",
  "Ready for restart": "Listo para arranque",
  "Reason": "Motivo",
  "Remove": "Quitar",
  "Restart": "Arranque",
  "Restart time": "Marcar inicio otra vez",
  "Restarts": "Arranque",
  "Roles (pay role names)": "Roles (nombres del rol de pago)",
  "Room": "Cuarto",
  "Rooms: {list}": "Cuartos: {list}",
  "Roster": "Plantilla",
  "Roster = active employees on crew {crews} who are not a lead, supervisor or manager. Shift Start = people on the board for this shift, less PTO, sick and late.": "Plantilla = empleados activos de la cuadrilla {crews} que no son l%ider, supervisor ni gerente. Shift Start = personas en el tablero de este turno, menos vacaciones, enfermos y retardos.",
  "Roster names ({n})": "Nombres de plantilla ({n})",
  "Rounded up to 15 minutes.": "Redondeado hacia arriba a 15 minutos.",
  "Row {n} has no order number and was skipped": "La fila {n} no tiene n%umero de orden y se omiti%o",
  "Rules": "Reglas",
  "Rules, line order and default presets apply to every weekend. Press Save setup when done.": "Las reglas, el orden de l%ineas y los pasos predeterminados aplican a todos los fines de semana. Presione Guardar ajustes al terminar.",
  "Runs through the weekend in the production schedule (no stop of an hour or more)": "Corre todo el fin de semana en el programa de producci%on (sin paro de una hora o m%as)",
  "SAP asset and location": "Activo y ubicaci%on SAP",
  "SCORECARD": "RESULTADOS",
  "Sanitation": "Sanidad",
  "Sanitation labor": "Mano de obra de sanidad",
  "Sanitation people working (blue) and on shift (grey)": "Personas de sanidad trabajando (azul) y en turno (gris)",
  "Sanitation waits for maintenance to finish before the next milestone (like the PBED sheet)": "Sanidad espera a que mantenimiento termine antes del siguiente hito (como en la hoja PBED)",
  "Save": "Guardar",
  "Save mine over theirs": "Guardar los m%ios sobre los suyos",
  "Save plan": "Guardar plan",
  "Save plan keeps the notes and presets with the weekend.": "Guardar plan conserva las notas y los pasos con el fin de semana.",
  "Save setup": "Guardar ajustes",
  "Save the work orders. Ones already saved are updated; their equipment and hours stay.": "Guarde las %ordenes de trabajo. Las ya guardadas se actualizan; su equipo y sus horas se conservan.",
  "Save to {t}": "Guardar en {t}",
  "Save {n} work order": "Guardar {n} orden de trabajo",
  "Save {n} work orders": "Guardar {n} %ordenes de trabajo",
  "Saved for this location and asset": "Guardado para esta ubicaci%on y activo",
  'Saved to the time loss log the manager hub reads (kind "Weekend clean").': 'Se guarda en el registro de tiempo perdido que lee hub - manager (tipo "Weekend clean").',
  "Saved {at}": "Guardado {at}",
  "Saving now would replace their changes with yours.": "Guardar ahora reemplazar%ia los cambios de la otra persona con los suyos.",
  "Saving...": "Guardando...",
  "Scheduler": "Programador",
  "Scope rows missing ({found} of {parts}): the Scheduler is still publishing this clean, so no piece is left out yet.": "Faltan filas de alcance ({found} de {parts}): el Programador a%un est%a publicando esta limpieza, as%i que todav%ia no se deja fuera ninguna pieza.",
  "Scope rows were not read ({e}): no piece is marked left out by the Scheduler.": "No se leyeron las filas de alcance ({e}): ninguna pieza queda marcada como fuera por el Programador.",
  "Scorecard": "Resultados",
  "Set by hand.": "Capturado a mano.",
  "Set the restart time to see the spare.": "Fije la hora de arranque para ver el margen.",
  "Setup": "Ajustes",
  "Setup and Data open only when one of these Microsoft accounts clicks the logo. It hides the tools on this page; what each person can change in Dataverse is still set by their security role.": "Ajustes y Datos solo se abren cuando una de estas cuentas de Microsoft da clic en el logo. Esto oculta las herramientas en esta p%agina; lo que cada persona puede cambiar en Dataverse lo sigue definiendo su rol de seguridad.",
  "Setup applies to every weekend and every line.": "Los ajustes aplican a todos los fines de semana y todas las l%ineas.",
  "Setup could not be read: {err}": "No se pudieron leer los ajustes: {err}",
  "Setup saved": "Ajustes guardados",
  "Setup saved on this computer only.": "Ajustes guardados solo en esta computadora.",
  "Setup saved.": "Ajustes guardados.",
  "Setup was not saved: {err}": "Los ajustes no se guardaron: {err}",
  "Shift": "Turno",
  "Shift Start": "Shift Start",
  "Shift board archive (experience)": "Archivo de tableros de turno (experiencia)",
  "Shifts from the first stop to the last restart. Hours not used = people on shift times shift hours, less the hours the plan books on weekend cleans. Double click a row to change its headcount.": "Turnos del primer paro al %ultimo arranque. Horas sin usar = personas en turno por horas del turno, menos las horas que el plan asigna a limpiezas de fin de semana. Doble clic en una fila para cambiar sus personas.",
  "Short of people": "Falta gente",
  "Short staffed": "Falta de personal",
  "Show the developer tools": "Mostrar herramientas de desarrollador",
  "Show {n}": "Mostrar {n}",
  "Signed in as {who}.": "Sesi%on iniciada como {who}.",
  "Someone saved this plan after you opened it": "Alguien guard%o este plan despu%es de que usted lo abri%o",
  "Star a block to make it a key goalpost (CIP is starred by itself). Key goalposts lead the brief, Execute and the debrief.": "Marque con estrella un bloque para hacerlo meta clave (CIP se marca solo). Las metas clave encabezan la junta, la ejecuci%on y el cierre.",
  "Star as a key goalpost": "Marcar como meta clave",
  "Start": "Inicio",
  "Started": "En proceso",
  "Starts": "Inicia",
  "Step name": "Nombre del paso",
  "Stops": "Paro",
  "Stops {at}": "Paro {at}",
  "Stops {stop} - restarts {restart} - {down} down": "Paro {stop} - arranque {restart} - {down} sin producir",
  "Swab": "Hisopo",
  "TIME LOST: {t} ({ph} people-hours)": "TIEMPO PERDIDO: {t} ({ph} horas-persona)",
  "Table": "Tabla",
  "Table missing": "Falta la tabla",
  "Table missing: kept on this computer": "Falta la tabla: se guarda en esta computadora",
  "Tables this page saves to": "Tablas donde guarda esta p%agina",
  "Tables this page saves to: Check columns lists any column missing from the _p_ tables. Make missing tables from the Copilot prompts.": "Tablas donde guarda esta p%agina: Revisar columnas lista las columnas que faltan en las tablas _p_. Cree las tablas que falten con los prompts de Copilot.",
  "Tables this page saves to: Check columns lists any column missing from the _p_ tables. What to build shows in the Dataverse monitor; this page makes nothing.": "Tablas en las que guarda esta p%agina: Revisar columnas lista cualquier columna que falte en las tablas _p_. Qu%e crear se muestra en el monitor de Dataverse; esta p%agina no crea nada.",
  "Task assignments (experience)": "Asignaciones de tareas (experiencia)",
  "The Scheduler has not published a clean plan for this week yet, so stops and restarts come from the production runs.": "El Programador a%un no publica un plan de limpieza para esta semana, as%i que los paros y arranques vienen de las corridas de producci%on.",
  "The _p_ Plan table was not found, so setup is kept on this computer.": "No se encontr%o la tabla _p_ Plan, as%i que los ajustes se guardan en esta computadora.",
  "The _p_ Work order table was not found, so work orders are kept on this computer only. Make the table from the prompts (Data tab).": "No se encontr%o la tabla _p_ Work order, as%i que las %ordenes de trabajo se guardan solo en esta computadora. Cree la tabla con los prompts (pesta%na Datos).",
  "The _p_ Work order table was not found, so work orders are kept on this computer only. The Dataverse monitor shows what to build from the manifest this page saves to Hub config.": "No se encontr%o la tabla _p_ Work order, as%i que las %ordenes de trabajo se guardan solo en esta computadora. El monitor de Dataverse muestra qu%e crear a partir del manifiesto que esta p%agina guarda en Hub config.",
  "The assets table has no active rows, so there are no milestones.": "La tabla de activos no tiene filas activas, as%i que no hay hitos.",
  "The brief is the Friday handoff: key goalposts first, then each line with its stop, clean done and restart.": "La junta es la entrega del viernes: primero las metas clave, luego cada l%inea con su paro, limpieza terminada y arranque.",
  "The clean plan could not be read ({why}), so stops and restarts come from the production runs.": "No se pudo leer el plan de limpieza ({why}), as%i que los paros y arranques vienen de las corridas de producci%on.",
  "The clean plan for this week is still being published, so stops and restarts come from the production runs for now.": "El plan de limpieza de esta semana todav%ia se est%a publicando, as%i que por ahora los paros y arranques vienen de las corridas de producci%on.",
  "The clean plan has no stop for this line this weekend.": "El plan de limpieza no tiene un paro para esta l%inea este fin de semana.",
  "The column craa5_plan_json was not found: the plan text goes in the old column craa5_planjson.": "No se encontr%o la columna craa5_plan_json: el texto del plan va en la columna anterior craa5_planjson.",
  "The crew rotation (Work shifts table) could not be read, so the plan does not check how many people are on shift. Every milestone gets the people it asks for. See the Data tab.": "No se pudo leer la rotaci%on de cuadrillas (tabla Turnos de trabajo), as%i que el plan no revisa cu%antas personas hay en turno. Cada hito recibe las personas que pide. Vea la pesta%na Datos.",
  "The crew rotation could not be read, so shifts cannot be listed.": "No se pudo leer la rotaci%on de cuadrillas, as%i que no se pueden listar los turnos.",
  "The developer tools are locked to other accounts.": "Las herramientas de desarrollador est%an reservadas a otras cuentas.",
  "The developer tools are not locked to anyone yet. Lock them on Setup.": "Las herramientas de desarrollador a%un no est%an reservadas a nadie. Res%ervelas en Ajustes.",
  "The end is before the start.": "El fin es antes del inicio.",
  "The equipment list changed after the Scheduler published this clean; the newer scope rows are used.": "La lista de equipo cambi%o despu%es de que el Programador public%o esta limpieza; se usan las filas de alcance m%as nuevas.",
  "The goalposts each department is held to: when each line is handed over, when each milestone must be done, and when production restarts. Star the ones that matter most; add notes anywhere.": "Las metas de cada departamento: cu%ando se entrega cada l%inea, cu%ando debe estar listo cada hito y cu%ando arranca producci%on. Marque con estrella las m%as importantes; agregue notas donde quiera.",
  "The headline and the five numbers are the Monday story: clean on plan, key goalposts, labor, time lost and people-hours not used.": "El titular y los cinco n%umeros son la historia del lunes: limpieza a tiempo, metas clave, mano de obra, tiempo perdido y horas-persona sin usar.",
  "The labor rate is read from the shared _e_ Labor rate table (hub - manager Setup), not typed here.": "La tarifa de mano de obra se lee de la tabla compartida _e_ Labor rate (Ajustes de hub - manager), no se escribe aqu%i.",
  "The milestones and steps after it keep their length; they end at the restart instead of early.": "Los hitos y pasos que siguen conservan su duraci%on; terminan al arranque en vez de antes.",
  "The page reads again every 2 minutes while Execute is open. Read now reads at once.": "La p%agina vuelve a leer cada 2 minutos mientras Ejecuci%on est%a abierta. Leer ahora lee de inmediato.",
  "The page styling (cdn.tailwindcss.com) did not load on this computer, so the page looks plain. Everything still works.": "El estilo de la p%agina (cdn.tailwindcss.com) no carg%o en esta computadora, por eso se ve simple. Todo sigue funcionando.",
  "The plan text is saved in {col}.": "El texto del plan se guarda en {col}.",
  "The plan was not saved: {err}. Your changes are kept on this computer.": "El plan no se guard%o: {err}. Sus cambios se guardan en esta computadora.",
  "The production schedule could not be read: {err}. Stop and restart times must be typed by hand.": "No se pudo leer el programa de producci%on: {err}. Las horas de paro y arranque se deben capturar a mano.",
  "The saved plan for this weekend is incomplete: one of its parts is missing in the _p_ Plan table.": "El plan guardado de este fin de semana est%a incompleto: falta una de sus partes en la tabla _p_ Plan.",
  "The starting presets came from the PBED example sheet: handoff 1 h at the stop, FSQ inspect 1 h, swab 1.5 h, preflight 2 h from an hour before the restart, 1st pie an hour after it.": "Los predeterminados iniciales vienen de la hoja de ejemplo PBED: entrega 1 h en el paro, inspecci%on FSQ 1 h, hisopado 1.5 h, prearranque 2 h desde una hora antes del arranque, 1er pay una hora despu%es.",
  "The time loss log table was not found: entries stay on this computer.": "No se encontr%o la tabla del registro de tiempo perdido: los registros se quedan en esta computadora.",
  "The {col} column holds {n} characters; longer plans are saved in parts. Raise its Maximum character count (up to 1,048,576) to keep one row per weekend.": "La columna {col} guarda {n} caracteres; los planes m%as largos se guardan en partes. Suba su n%umero m%aximo de caracteres (hasta 1,048,576) para tener una sola fila por fin de semana.",
  "The {col} column is smaller than a plan (parts of {n} characters fit). Raise its Maximum character count (up to 1,048,576) to keep one row per weekend.": "La columna {col} es m%as chica que un plan (caben partes de {n} caracteres). Suba su n%umero m%aximo de caracteres (hasta 1,048,576) para tener una sola fila por fin de semana.",
  "The {col} column of _p_ Plan is too small for a plan (under 100 characters): raise its Maximum character count.": "La columna {col} de _p_ Plan es demasiado chica para un plan (menos de 100 caracteres): suba su n%umero m%aximo de caracteres.",
  "These are unsaved changes kept on this computer from {at}": "Hay cambios sin guardar en esta computadora, de {at}",
  "These times were filled in from Ganttly and Shift Start. Saving keeps them in the plan.": "Estas horas se llenaron desde Ganttly y Shift Start. Al guardar quedan en el plan.",
  'This milestone needs {n} people at once, but the crew on shift does not have that many free. Lower the people on it, raise the shift headcount, or tick "No headcount limit" on the line.': 'Este hito necesita {n} personas a la vez, pero la cuadrilla en turno no tiene tantas libres. Baje las personas del hito, suba las personas del turno o marque "Sin l%imite de personas" en la l%inea.',
  "This page cannot write to Dataverse here.": "Esta p%agina no puede escribir en Dataverse aqu%i.",
  "This page has no Dataverse connection (no Xrm.WebApi and no dataApi).": "Esta p%agina no tiene conexi%on a Dataverse (sin Xrm.WebApi ni dataApi).",
  "This page is not connected to Dataverse (no Xrm.WebApi and no dataApi). Open it inside the model-driven app. Nothing below is real data until it is.": "Esta p%agina no est%a conectada a Dataverse (sin Xrm.WebApi ni dataApi). %Abrala dentro de la app basada en modelo. Nada de lo que sigue es dato real hasta que lo est%e.",
  "This page makes no table: it saves the tables and columns it uses to Hub config (manifest|pbed) once per load, and the Dataverse monitor shows what is missing and what to build. Check columns only reads.": "Esta p%agina no crea tablas: guarda las tablas y columnas que usa en Hub config (manifest|pbed) una vez por carga, y el monitor de Dataverse muestra qu%e falta y qu%e crear. Revisar columnas solo lee.",
  "This step {how}. Its name, order and time for every line are the presets on the Brief tab.": "Este paso {how}. Su nombre, orden y tiempo en cada l%inea son los predeterminados de la pesta%na Junta.",
  "This weekend": "Este fin de semana",
  "This weekend has its own presets (changed here). Every line uses them.": "Este fin de semana tiene sus propios predeterminados (cambiados aqu%i). Todas las l%ineas los usan.",
  "This weekend in one line": "Este fin de semana en resumen",
  "This weekend uses the default presets. A change here applies to this weekend only, unless you make it the default.": "Este fin de semana usa los predeterminados. Un cambio aqu%i aplica solo a este fin de semana, a menos que lo haga predeterminado.",
  "Throw them away": "Descartarlos",
  "Tick This weekend to put an order on the weekend plan. Its hours become the maintenance block on the line.": "Marque Este fin de semana para poner una orden en el plan del fin de semana. Sus horas se vuelven el bloque de mantenimiento de la l%inea.",
  "Tight": "Al l%imite",
  "Time": "Tiempo",
  "Time frame": "Duraci%on",
  "Time loss added.": "Tiempo perdido agregado.",
  "Time loss entry removed.": "Registro de tiempo perdido eliminado.",
  "Time loss log (shared with hub - manager)": "Registro de tiempo perdido (compartido con hub - manager)",
  "Time loss: {reason}": "Tiempo perdido: {reason}",
  "Time lost": "Tiempo perdido",
  "Time lost by reason": "Tiempo perdido por motivo",
  "Time lost, people-hours not used and Biggest costs are at the {role} rate ({rate}/h).": "Tiempo perdido, horas-persona sin usar y Mayores costos van a la tarifa de {role} ({rate}/h).",
  "Times and crew": "Horarios y cuadrilla",
  "Times you press or type save {where}.": "Las horas que marque o escriba se guardan {where}.",
  "Unknown person": "Persona desconocida",
  "Unsaved changes": "Cambios sin guardar",
  "Untick a piece to leave it out of this weekend.": "Desmarque una pieza para dejarla fuera de este fin de semana.",
  "Up": "Subir",
  "Use the schedule": "Usar el programa",
  "Version {v}": "Versi%on {v}",
  "Waiting on FSQ": "Esperando a FSQ",
  "Warehouse": "Almac%en",
  "Water, steam or utilities": "Agua, vapor o servicios",
  "Weekend": "Fin de semana",
  "Weekend after": "Fin de semana siguiente",
  "Weekend before": "Fin de semana anterior",
  "Weekend of {date}": "Fin de semana del {date}",
  "Weekend timeline": "Cronograma del fin de semana",
  "Welcome to the PBED": "Bienvenido(a) al PBED",
  "Welcome, {name}, to the PBED": "Bienvenido(a), {name}, al PBED",
  "What": "Qu%e",
  "What happened": "Qu%e pas%o",
  "What this page read": "Lo que ley%o esta p%agina",
  "What this page read: one line per table with Ready, Nothing here yet, Table missing, No access or Could not load. Read again reads everything once more.": "Lo que ley%o esta p%agina: una l%inea por tabla con Listo, Todav%ia no hay datos, Falta la tabla, Sin acceso o No se pudo cargar. Leer de nuevo vuelve a leer todo.",
  "When people are short, lines higher on this list get them first.": "Cuando faltan personas, las l%ineas m%as arriba en esta lista las reciben primero.",
  "Where it goes": "D%onde va",
  "Who ({n} picked)": "Qui%enes ({n} elegidos)",
  "Who is on each weekend shift. Experience is worked out in the background from the last 56 days of Shift Start boards and task assignments ({state}); double click a name to see it.": "Qui%en est%a en cada turno del fin de semana. La experiencia se calcula en segundo plano con los %ultimos 56 d%ias de tableros de Shift Start y asignaciones de tareas ({state}); doble clic en un nombre para verla.",
  "Whole line": "Toda la l%inea",
  "Work order file": "Archivo de %ordenes de trabajo",
  "Work orders": "%Ordenes de trabajo",
  "Work orders on this line this weekend ({n})": "%Ordenes de trabajo en esta l%inea este fin de semana ({n})",
  "Work shifts (crew rotation)": "Turnos de trabajo (rotaci%on de cuadrillas)",
  "Worst: {line}, {late} late{why}.": "Peor: {line}, {late} tarde{why}.",
  "Written by {app}": "Escrito por {app}",
  "Yes: use allergen minutes": "S%i: usar minutos de al%ergeno",
  "Your Microsoft account could not be read on this computer, so the lock cannot be set from here.": "No se pudo leer su cuenta de Microsoft en esta computadora, as%i que el bloqueo no se puede poner desde aqu%i.",
  "Zoom": "Zoom",
  "_e_ Labor rate": "_e_ Labor rate",
  "_p_ FLOC map": "_p_ FLOC map",
  "_p_ Milestone": "_p_ Milestone",
  "_p_ Plan": "_p_ Plan",
  "_p_ Work order": "_p_ Work order",
  "after the step before, plus": "despu%es del paso anterior, m%as",
  "all done {at}": "todo listo {at}",
  "allergen": "al%ergeno",
  "approved": "aprobada",
  "approved by {who}": "aprobada por {who}",
  "approved by {who}: {why}": "aprobada por {who}: {why}",
  "archived board": "tablero archivado",
  "at the restart, plus": "en el arranque, m%as",
  "at the stop, plus": "en el paro, m%as",
  "auto": "auto",
  "but the longest piece alone takes {t}": "pero la pieza m%as larga sola toma {t}",
  "by this plan": "seg%un este plan",
  "by {at}": "para {at}",
  "by {who}": "por {who}",
  "caseout": "case-out",
  "clean done {at} (plan {plan}, {delta})": "limpieza lista {at} (plan {plan}, {delta})",
  "clean done {at} ({status})": "limpieza lista {at} ({status})",
  "clean not finished or not recorded ({d} of {n} milestones)": "limpieza sin terminar o sin registrar ({d} de {n} hitos)",
  "clean plan": "plan de limpieza",
  "clean planned {from} to {to}": "limpieza planeada de {from} a {to}",
  "done {at}": "listo {at}",
  "dry clean": "limpieza en seco",
  "first started {at}": "primer inicio {at}",
  "floors": "pisos",
  "follows the step before it": "sigue al paso anterior",
  "freezer": "congelador",
  "from {at}": "de {at}",
  "hit": "cumplidas",
  "hours": "horas",
  "in progress": "en curso",
  "is set from the restart time": "se fija desde la hora de arranque",
  "last run before the weekend not found": "no se encontr%o la %ultima corrida antes del fin de semana",
  "last run before the weekend {what} ends {at}": "%ultima corrida antes del fin de semana {what} termina {at}",
  "last run {what}": "%ultima corrida {what}",
  "lead": "l%ider",
  "line {n}": "l%inea {n}",
  "lines finished on time": "l%ineas terminadas a tiempo",
  "live board": "tablero en vivo",
  "maintenance": "mantenimiento",
  "manager": "gerente",
  "min": "min",
  "min, lasts": "min, dura",
  "needs a look": "por revisar",
  "needs {hc} people but the shift does not have them free": "necesita {hc} personas pero el turno no las tiene libres",
  "newer than the plan saved {at}": "m%as recientes que el plan guardado {at}",
  "next run not scheduled yet": "siguiente corrida a%un sin programar",
  "next run {what} starts {at}": "siguiente corrida {what} inicia {at}",
  "no": "no",
  "no board yet": "sin tablero a%un",
  "no crew": "sin cuadrilla",
  "no headcount known": "sin dato de personas",
  "no labor rate set": "sin tarifa de mano de obra",
  "no limit": "sin l%imite",
  "no line finished yet": "ninguna l%inea ha terminado",
  "no milestone has both times yet": "ning%un hito tiene ambas horas a%un",
  "no more than the line crew of {c}": "no m%as que la cuadrilla de la l%inea de {c}",
  "no runs on this line this week.": "no hay corridas en esta l%inea esta semana.",
  "none": "ninguno",
  "none late": "ninguna tarde",
  "none starred": "ninguna marcada",
  "not available: neither history table could be read": "no disponible: no se pudo leer ninguna tabla de historial",
  "not enough people free": "no hay suficientes personas libres",
  "not recorded": "sin registrar",
  "not set": "sin definir",
  "not started": "sin iniciar",
  "now": "ahora",
  "of {c} on shift": "de {c} en turno",
  "of {n} on that shift": "de {n} en ese turno",
  "on shift, not booked by the plan": "en turno, sin asignar por el plan",
  "on this computer only, because the _p_ Milestone table was not found": "solo en esta computadora, porque no se encontr%o la tabla _p_ Milestone",
  "p-h": "h-p",
  "pace {p}% against standard": "ritmo {p}%% contra el est%andar",
  "past its goalpost": "pas%o su meta",
  "people": "personas",
  "plan": "plan",
  "plan {plan}, actual {act} - {state}": "plan {plan}, real {act} - {state}",
  "planned board": "tablero planeado",
  "production schedule": "programa de producci%on",
  "ready": "listo",
  "ready {at}{proj}, restart {restart}": "listo {at}{proj}, arranque {restart}",
  "regular": "regular",
  "run": "corrida",
  "set by hand": "capturado a mano",
  "setup was not read": "no se leyeron los ajustes",
  "shadow boards": "tableros de sombra",
  "shadowboard": "tablero de sombra",
  "share of the people on shift when it stops": "parte de las personas en turno al parar",
  "shifts not read": "turnos no le%idos",
  "start {d}": "inicio {d}",
  "started": "iniciado",
  "started {at}": "iniciado {at}",
  "starts when production stops": "inicia cuando para la producci%on",
  "stops {stop}, restarts {restart}": "paro {stop}, arranque {restart}",
  "stops {stop}; the next run is not scheduled yet": "para {stop}; la siguiente corrida a%un no est%a programada",
  "sub area {s}": "sub%area {s}",
  "supervisor": "supervisor",
  "the _p_ Milestone rows are not read yet. Reload the page and try again.": "las filas de _p_ Milestone a%un no se leen. Recargue la p%agina e intente otra vez.",
  "the page could not tell whether _p_ Plan has the column craa5_plan_json ({err}); try again": "la p%agina no pudo saber si _p_ Plan tiene la columna craa5_plan_json ({err}); intente de nuevo",
  "the saved setup is incomplete (a part is missing in the _p_ Plan table); the setup on this computer is in use": "la configuraci%on guardada est%a incompleta (falta una parte en la tabla _p_ Plan); se usa la configuraci%on de esta computadora",
  "this is an allergen clean, so a piece with allergen minutes uses those": "es limpieza de al%ergeno, as%i que una pieza con minutos de al%ergeno usa esos",
  "times and crew": "horarios y cuadrilla",
  "to": "a",
  "to Dataverse (_p_ Milestone)": "en Dataverse (_p_ Milestone)",
  "waiting for the main read": "esperando la lectura principal",
  "waits {t} for people": "espera {t} por personas",
  "week of {date}": "semana del {date}",
  "weekend cleans": "limpiezas de fin de semana",
  "working it out": "calculando",
  "yes": "s%i",
  "{a} h used for {p} h planned (1 milestone)": "{a} h usadas de {p} h planeadas (1 hito)",
  "{a} h used for {p} h planned ({n} milestones)": "{a} h usadas de {p} h planeadas ({n} hitos)",
  "{cost} at {rate}/h": "{cost} a {rate}/h",
  "{cost} at {rate}/h ({role})": "{cost} a {rate}/h ({role})",
  "{d} of {n}": "{d} de {n}",
  "{d} of {n} milestones done": "{d} de {n} hitos listos",
  "{d} of {n} pieces done": "{d} de {n} piezas listas",
  "{d}/{n} done": "{d}/{n} listos",
  "{hit} of {n} key goalposts hit.": "{hit} de {n} metas clave cumplidas.",
  "{hit} of {n} lines finished the clean on plan.": "{hit} de {n} l%ineas terminaron la limpieza seg%un el plan.",
  "{h} h run": "corrida de {h} h",
  "{h} h run against a {limit} h limit": "{h} h de corrida contra un l%imite de {limit} h",
  "{k} are already saved and will be updated (their equipment and hours stay).": "{k} ya est%an guardadas y se actualizar%an (su equipo y horas se quedan).",
  "{n} for sanitation": "{n} para sanidad",
  "{n} late": "{n} tarde",
  "{n} left out by the Scheduler": "{n} fuera por el Programador",
  "{n} line down this weekend.": "{n} l%inea parada este fin de semana.",
  "{n} line has less than 2 hours to spare.": "{n} l%inea tiene menos de 2 horas de margen.",
  "{n} line will not be ready for its restart.": "{n} l%inea no estar%a lista para su arranque.",
  "{n} lines down this weekend.": "{n} l%ineas paradas este fin de semana.",
  "{n} lines have less than 2 hours to spare.": "{n} l%ineas tienen menos de 2 horas de margen.",
  "{n} lines will not be ready for their restart.": "{n} l%ineas no estar%an listas para su arranque.",
  "{n} logged entries have no rate for their shift date": "{n} entradas registradas no tienen tarifa para su fecha de turno",
  "{n} logged entries name nobody and are costed at the {role} rate.": "{n} entradas registradas no nombran a nadie y se costean a la tarifa de {role}.",
  "{n} logged entry has no rate for its shift date": "{n} entrada registrada no tiene tarifa para su fecha de turno",
  "{n} logged entry names nobody and is costed at the {role} rate.": "{n} entrada registrada no nombra a nadie y se costea a la tarifa de {role}.",
  "{n} maintenance work order on this line.": "{n} orden de trabajo de mantenimiento en esta l%inea.",
  "{n} maintenance work orders on this line.": "{n} %ordenes de trabajo de mantenimiento en esta l%inea.",
  "{n} min of overlap": "{n} min encimados",
  "{n} min over the limit": "{n} min sobre el l%imite",
  "{n} people": "{n} personas",
  "{n} people on the board now": "{n} personas en el tablero ahora",
  "{n} person": "{n} persona",
  "{n} person on the board now": "{n} persona en el tablero ahora",
  "{n} piece has no clean time in the assets table": "{n} pieza no tiene tiempo de limpieza en la tabla de activos",
  "{n} piece has no standard": "{n} pieza sin est%andar",
  "{n} piece logged": "{n} pieza registrada",
  "{n} piece of equipment": "{n} pieza de equipo",
  "{n} pieces have no clean time in the assets table": "{n} piezas no tienen tiempo de limpieza en la tabla de activos",
  "{n} pieces have no standard": "{n} piezas sin est%andar",
  "{n} pieces logged": "{n} piezas registradas",
  "{n} pieces of equipment": "{n} piezas de equipo",
  "{n} row": "{n} fila",
  "{n} rows": "{n} filas",
  "{n} tight": "{n} al l%imite",
  "{n} time kept.": "{n} hora guardada.",
  "{n} time was filled in from Ganttly and Shift Start but is not kept in the plan yet. Keep it so the debrief still has it after Ganttly clears its check-offs.": "{n} hora se llen%o desde Ganttly y Shift Start pero a%un no se guarda en el plan. Gu%ardela para que el cierre la tenga despu%es de que Ganttly borre sus marcas.",
  "{n} times kept.": "{n} horas guardadas.",
  "{n} times were filled in from Ganttly and Shift Start but are not kept in the plan yet. Keep them so the debrief still has them after Ganttly clears its check-offs.": "{n} horas se llenaron desde Ganttly y Shift Start pero a%un no se guardan en el plan. Gu%ardelas para que el cierre las tenga despu%es de que Ganttly borre sus marcas.",
  "{n} work order": "{n} orden de trabajo",
  "{n} work order read.": "{n} orden de trabajo le%ida.",
  "{n} work order saved.": "{n} orden de trabajo guardada.",
  "{n} work orders": "{n} %ordenes de trabajo",
  "{n} work orders read.": "{n} %ordenes de trabajo le%idas.",
  "{n} work orders saved.": "{n} %ordenes de trabajo guardadas.",
  "{ph} people-hours": "{ph} horas-persona",
  "{ph} sanitation people-hours{money}.": "{ph} horas-persona de sanidad{money}.",
  "{p} percent done": "{p} por ciento listo",
  "{rate}/h ({role}, from {date})": "{rate}/h ({role}, desde {date})",
  "{t} of clean time": "{t} de tiempo de limpieza",
  "{t} of clean time divided by {n} people": "{t} de tiempo de limpieza entre {n} personas",
  "{t} of spare time added: maintenance now ends {end}": "{t} de margen agregados: mantenimiento ahora termina {end}",
  "{t} over": "{t} excedido",
  "{t} spare": "{t} de margen",
  "{t} spare, given to maintenance": "{t} de margen, dados a mantenimiento",
  "{u} people working": "{u} personas trabajando",
  "{what} timed out": "{what}: se agot%o el tiempo de espera"
};
var PB_TIMEOUT = 25e3;
var PB_PAGE_CAP = 20;
var PB_TABLES = {
  assets: { names: ["craa5___1_a_assets"], label: "Assets (Ganttly, MSS)", owner: "Ganttly" },
  runs: { names: ["craa5___1_p_prodschedule"], label: "Production schedule runs", owner: "Production Scheduler" },
  workshift: { names: ["craa5___1_a_workshift"], label: "Work shifts (crew rotation)", owner: "Shift Start" },
  employees: { names: ["craa5___1_a_employee", "craa5___1_a_employee"], label: "Employees", owner: "Shift Start" },
  roles: { names: ["craa5___1_a_role", "craa5_aa_role"], label: "Roles (pay role names)", owner: "admin (by hand)" },
  shiftplan: { names: ["craa5___1_s_shiftplan"], label: "Planned shift boards", owner: "Shift Start" },
  shiftboard: { names: ["craa5___1_s_shiftboard"], label: "Live shift boards", owner: "Shift Start" },
  shiftarchive: { names: ["craa5___1_s_shiftarchive"], label: "Shift board archive (experience)", owner: "Shift Start" },
  taskassignment: { names: ["craa5___1_s_taskassignment"], label: "Task assignments (experience)", owner: "Shift Start" },
  checkoff: { names: ["craa5___1_s_cleancheckoff", "craa5__cleancheckoff"], label: "Ganttly check-offs", owner: "Ganttly" },
  msslog: { names: ["craa5___1_l_log"], label: "MSS log (finished cleans)", owner: "Ganttly, MSS Log Input, MSS Calendar" },
  laborrate: { names: ["craa5___1_e_laborrate", "craa5_e_laborrate"], label: "_e_ Labor rate", owner: "hub - manager" },
  cleanplan: { names: ["craa5___1_p_cleanplan", "craa5__cleanplan"], label: "Clean plan (stops and restarts)", owner: "hub - production schedule" },
  plan: { names: ["craa5___1_p_plan", "craa5_p_plan"], label: "_p_ Plan", owner: "PBED", mine: true },
  milestone: { names: ["craa5___1_p_milestone", "craa5_p_milestone"], label: "_p_ Milestone", owner: "PBED", mine: true },
  workorder: { names: ["craa5___1_p_workorder", "craa5_p_workorder"], label: "_p_ Work order", owner: "PBED", mine: true },
  flocmap: { names: ["craa5___1_p_flocmap", "craa5_p_flocmap"], label: "_p_ FLOC map", owner: "PBED", mine: true },
  timeloss: { names: ["craa5___1_m_timelosslog", "craa5_timelosslog"], label: "Time loss log (shared with hub - manager)", owner: "hub - manager", mine: true }
};
function pbLoadWord(src) {
  if (!src || src.loading || !src.rows && !src.err && !src.kind) return "Loading";
  if (src.rows) return src.rows.length ? "Ready" : "Nothing here yet";
  if (src.kind === "missing") return "Table missing";
  if (src.kind === "denied") return "No access";
  return "Could not load";
}
var PB_COLS = {
  plan: ["craa5_name", "craa5_weekendkey", "craa5_plan_json", "craa5_planjson", "craa5_status", "craa5_version", "craa5_savedby", "craa5_savedon"],
  milestone: ["craa5_name", "craa5_weekendkey", "craa5_areakey", "craa5_stepkey", "craa5_stepname", "craa5_department", "craa5_plannedstart", "craa5_plannedend", "craa5_actualstart", "craa5_actualend", "craa5_headcount", "craa5_notes", "craa5_updatedby"],
  workorder: ["craa5_name", "craa5_priority", "craa5_description", "craa5_assetdescription", "craa5_ordertype", "craa5_functionallocation", "craa5_basicstart", "craa5_workcenter", "craa5_sortfield", "craa5_assetguid", "craa5_equipment", "craa5_areakey", "craa5_plannedhours", "craa5_weekendkey", "craa5_status", "craa5_importedby", "craa5_importedon"],
  flocmap: ["craa5_name", "craa5_functionallocation", "craa5_assetdescription", "craa5_assetguid", "craa5_equipment", "craa5_areakey", "craa5_mappedby"],
  timeloss: ["craa5_name", "craa5_kind", "craa5_occurredon", "craa5_minuteslost", "craa5_reason", "craa5_description", "craa5_equipment", "craa5_area", "craa5_department", "craa5_status", "craa5_crew", "craa5_loggedby", "craa5_data"]
};
var PB_APP_VERSION = "1.8";
var PB_BOARD_READ = ["craa5_crew", "craa5_slotstart", "craa5_slotend", "craa5_boardjson", "craa5_status", "modifiedon", "statecode"];
var PB_MANIFEST = {
  appId: "pbed",
  app: "hub - pbed",
  version: PB_APP_VERSION,
  tables: [
    { t: "craa5___1_a_assets", read: ["craa5___1_a_assetsid", "craa5_equipmentidentifier", "craa5_areaname", "craa5_roomname", "craa5_subcategory", "craa5_hoursrequired", "craa5_minalrg", "craa5_heads", "craa5_weeklyclean", "craa5_monthlyclean", "craa5_month", "statecode"] },
    { t: "craa5___1_p_prodschedule", read: ["craa5___1_p_prodscheduleid", "craa5_area", "craa5_line", "craa5_datestarttime", "craa5_dateendtime", "craa5_product", "craa5_allergen", "craa5_typeofallergen", "statecode"] },
    { t: "craa5___1_a_workshift", read: ["craa5_daynumber", "craa5_shiftcode", "craa5_shiftstarthour", "craa5_shiftendhour", "statecode"] },
    { t: "craa5___1_a_employee", names: PB_TABLES.employees.names, read: ["craa5___1_a_employeeid", "craa5_name", "craa5_shift", "craa5_role", "statecode"], opt: ["craa5_roleid"] },
    { t: "craa5___1_a_role", names: PB_TABLES.roles.names, read: [], opt: ["craa5___1_a_roleid", "craa5_name"] },
    { t: "craa5___1_s_shiftplan", read: PB_BOARD_READ },
    { t: "craa5___1_s_shiftboard", read: PB_BOARD_READ, opt: ["craa5_updatesjson"] },
    { t: "craa5___1_s_shiftarchive", read: PB_BOARD_READ.concat(["createdon"]), opt: ["craa5_updatesjson"] },
    { t: "craa5___1_s_taskassignment", read: ["craa5__aaemp_guid", "craa5_id", "craa5_area", "craa5_starttime", "craa5_endtime", "craa5_datetimeofassignment", "createdon"] },
    { t: "craa5___1_s_cleancheckoff", names: PB_TABLES.checkoff.names, read: ["craa5_equipmentguid", "craa5_status", "craa5_startedat", "craa5_doneat", "modifiedon"], opt: ["craa5_employeeguids", "craa5_source"] },
    { t: "craa5___1_l_log", read: ["craa5___1_l_logid", "craa5_equipmentguid", "craa5_lastcleaned", "statecode"], opt: ["craa5_shiftdate", "craa5_cleankind", "craa5_completionkey", "craa5_doneat", "craa5_laborminutes", "craa5_employeeguids", "craa5_lastcleanedby", "craa5_area", "craa5_source"] },
    { t: "craa5___1_e_laborrate", names: PB_TABLES.laborrate.names, read: ["craa5_name", "craa5_role", "craa5_hourlyrate", "craa5_effectivefrom", "statecode"] },
    { t: "craa5___1_p_cleanplan", names: PB_TABLES.cleanplan.names, read: ["craa5___1_p_cleanplanid", "craa5_rowtype", "craa5_plankey", "craa5_linekey", "craa5_start", "craa5_end", "craa5_day", "craa5_cleankind", "craa5_minutes", "craa5_status", "craa5_reason", "craa5_area", "craa5_line", "craa5_mssareaguid", "craa5_details", "statecode"] },
    // The four _p_ tables this page owns, with their column types (HUB SHARED v1.2 cols; ground rule 10: the Dataverse monitor shows what
    // is missing from this manifest and Alex builds it, this page never does). Organization-owned, no lookups.
    {
      t: "craa5___1_p_plan",
      names: PB_TABLES.plan.names,
      read: PB_COLS.plan.filter(function(c) {
        return c !== "craa5_planjson";
      }),
      write: PB_COLS.plan.filter(function(c) {
        return c !== "craa5_planjson";
      }),
      opt: ["craa5_planjson", "craa5__p_plan1"],
      label: "_p_ Plan",
      owner: "org",
      primary: { n: "craa5_name", len: 200, label: "Name" },
      cols: { craa5_weekendkey: { type: "text", len: 20, label: "Weekend key" }, craa5_plan_json: { type: "memo", len: 1e6, label: "Plan_json" }, craa5_planjson: { type: "memo", len: 1e6, label: "Plan json" }, craa5_status: { type: "text", len: 20, label: "Status" }, craa5_version: { type: "int", label: "Version" }, craa5_savedby: { type: "text", len: 200, label: "Saved by" }, craa5_savedon: { type: "datetime", label: "Saved on" } }
    },
    {
      t: "craa5___1_p_milestone",
      names: PB_TABLES.milestone.names,
      read: PB_COLS.milestone,
      write: PB_COLS.milestone,
      label: "_p_ Milestone",
      owner: "org",
      primary: { n: "craa5_name", len: 100, label: "Name" },
      cols: { craa5_weekendkey: { type: "text", len: 20, label: "Weekend key" }, craa5_areakey: { type: "text", len: 50, label: "Area key" }, craa5_stepkey: { type: "text", len: 200, label: "Step key" }, craa5_stepname: { type: "text", len: 200, label: "Step name" }, craa5_department: { type: "text", len: 20, label: "Department" }, craa5_plannedstart: { type: "datetime", label: "Planned start" }, craa5_plannedend: { type: "datetime", label: "Planned end" }, craa5_actualstart: { type: "datetime", label: "Actual start" }, craa5_actualend: { type: "datetime", label: "Actual end" }, craa5_headcount: { type: "int", label: "Headcount" }, craa5_notes: { type: "memo", len: 2e3, label: "Notes" }, craa5_updatedby: { type: "text", len: 200, label: "Updated by" } }
    },
    {
      t: "craa5___1_p_workorder",
      names: PB_TABLES.workorder.names,
      read: PB_COLS.workorder,
      write: PB_COLS.workorder,
      label: "_p_ Work order",
      owner: "org",
      primary: { n: "craa5_name", len: 100, label: "Name" },
      cols: { craa5_priority: { type: "text", len: 10, label: "Priority" }, craa5_description: { type: "text", len: 500, label: "Description" }, craa5_assetdescription: { type: "text", len: 200, label: "Asset description" }, craa5_ordertype: { type: "text", len: 20, label: "Order type" }, craa5_functionallocation: { type: "text", len: 100, label: "Functional location" }, craa5_basicstart: { type: "datetime", label: "Basic start" }, craa5_workcenter: { type: "text", len: 50, label: "Work center" }, craa5_sortfield: { type: "text", len: 100, label: "Sort field" }, craa5_assetguid: { type: "guid", label: "Asset guid" }, craa5_equipment: { type: "text", len: 200, label: "Equipment" }, craa5_areakey: { type: "text", len: 50, label: "Area key" }, craa5_plannedhours: { type: "decimal", precision: 2, label: "Planned hours" }, craa5_weekendkey: { type: "text", len: 20, label: "Weekend key" }, craa5_status: { type: "text", len: 20, label: "Status" }, craa5_importedby: { type: "text", len: 200, label: "Imported by" }, craa5_importedon: { type: "datetime", label: "Imported on" } }
    },
    {
      t: "craa5___1_p_flocmap",
      names: PB_TABLES.flocmap.names,
      read: PB_COLS.flocmap,
      write: PB_COLS.flocmap,
      opt: ["craa5__p_flocmap1"],
      label: "_p_ FLOC map",
      owner: "org",
      primary: { n: "craa5_name", len: 300, label: "Name" },
      cols: { craa5_functionallocation: { type: "text", len: 100, label: "Functional location" }, craa5_assetdescription: { type: "text", len: 200, label: "Asset description" }, craa5_assetguid: { type: "guid", label: "Asset guid" }, craa5_equipment: { type: "text", len: 200, label: "Equipment" }, craa5_areakey: { type: "text", len: 50, label: "Area key" }, craa5_mappedby: { type: "text", len: 200, label: "Mapped by" } }
    },
    // The manager hub's time loss log (its table): the columns this page writes, typed as the manager hub prompts 2 and 3 have them, so the monitor can show the missing ones.
    {
      t: "craa5___1_m_timelosslog",
      names: PB_TABLES.timeloss.names,
      read: PB_COLS.timeloss,
      write: PB_COLS.timeloss,
      cols: { craa5_kind: { type: "text", len: 20, label: "Kind" }, craa5_occurredon: { type: "datetime", label: "Occurred on" }, craa5_minuteslost: { type: "int", label: "Minutes lost" }, craa5_reason: { type: "text", len: 50, label: "Reason" }, craa5_description: { type: "memo", len: 4e3, label: "Description" }, craa5_equipment: { type: "text", len: 200, label: "Equipment" }, craa5_area: { type: "text", len: 100, label: "Area" }, craa5_department: { type: "text", len: 50, label: "Department" }, craa5_status: { type: "text", len: 20, label: "Status" }, craa5_crew: { type: "text", len: 10, label: "Crew" }, craa5_loggedby: { type: "text", len: 200, label: "Logged by" }, craa5_data: { type: "memo", len: 1e5, label: "Data" } }
    }
  ],
  config: []
};
function pbManifestIo(dataApi) {
  var wr = pbWriter(dataApi);
  return {
    query: function(t, o) {
      return pbQuery(dataApi, t, { select: o.select, filter: o.filter, top: o.top || 5, strictSelect: true });
    },
    create: function(t, b) {
      return wr ? wr.create(t, b) : Promise.reject(new Error("no writer"));
    },
    update: function(t, id, b) {
      return wr ? wr.update(t, id, b) : Promise.reject(new Error("no writer"));
    }
  };
}
function pbXrm() {
  if (typeof window === "undefined") return null;
  if (window.Xrm) return window.Xrm;
  try {
    if (window.parent && window.parent !== window && window.Xrm) return window.Xrm;
  } catch (e) {
  }
  try {
    if (window.top && window.top !== window && window.Xrm) return window.Xrm;
  } catch (e2) {
  }
  return null;
}
function pbWeb() {
  var x = pbXrm();
  return x && x.WebApi && x.WebApi.retrieveMultipleRecords ? x.WebApi : null;
}
function pbTimeout(fn, label) {
  return new Promise(function(resolve, reject) {
    var t = setTimeout(function() {
      reject(new Error(pbT("{what} timed out", { what: label })));
    }, PB_TIMEOUT);
    Promise.resolve().then(fn).then(function(v) {
      clearTimeout(t);
      resolve(v);
    }, function(e) {
      clearTimeout(t);
      reject(e);
    });
  });
}
function pbEnc(s) {
  return String(s).replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23").replace(/\+/g, "%2B");
}
function pbIdCol(table) {
  return table + "id";
}
function pbErrKind(msg) {
  var m = String(msg || "").toLowerCase();
  if (/resource not found for the segment|entity.*does not exist|entity.*cannot be found|could not find (a|an) (entity|table)|metadatacache|no entity|not exist.*entity|entityname/.test(m)) return "missing";
  if (/could not find a property|property .* does not exist|invalid column|is not a valid attribute|doesn't have an attribute|does not have a column/.test(m)) return "column";
  if (/privilege|prvread|not have permission|access is denied|principal user/.test(m)) return "denied";
  return "unknown";
}
function pbQuery(dataApi, table, opts) {
  opts = opts || {};
  var top = opts.top || 5e3;
  var sel = opts.select && opts.select.length ? opts.select : null;
  var web = pbWeb();
  var firstErr = null;
  function viaXrm(useSel) {
    var parts = [];
    if (opts.filter) parts.push("$filter=" + pbEnc(opts.filter));
    if (useSel) parts.push("$select=" + useSel.join(","));
    if (opts.orderBy) parts.push("$orderby=" + opts.orderBy);
    var q = "?" + parts.join("&");
    var rows = [];
    var pages = 0;
    function page(query) {
      return pbTimeout(function() {
        return web.retrieveMultipleRecords(table, query, Math.min(top, 5e3));
      }, pbT("Read of {t}", { t: table })).then(function(res) {
        var ents = res && res.entities ? res.entities : [];
        rows = rows.concat(ents);
        pages++;
        var next = res && res.nextLink;
        if (next && rows.length < top && pages < PB_PAGE_CAP) {
          var i = next.indexOf("?");
          return page(i >= 0 ? next.slice(i) : next);
        }
        return rows.slice(0, top);
      });
    }
    return page(q);
  }
  function viaApi(useSel) {
    var q = { pageSize: Math.min(top, 500) };
    if (opts.filter) q.filter = opts.filter;
    if (opts.orderBy) q.orderBy = opts.orderBy;
    if (useSel) q.select = useSel;
    return pbTimeout(function() {
      return window.__pgQ(dataApi, table, q);
    }, pbT("Read of {t}", { t: table })).then(function(pg) {
      var rows = pg && pg.rows ? Array.prototype.slice.call(pg.rows) : null;
      if (!rows) throw new Error(pbT("No rows came back from {t}", { t: table }));
      var n = 0;
      function more(p) {
        if (p && p.hasMoreRows && typeof p.loadMoreRows === "function" && rows.length < top && n < 200) {
          n++;
          return pbTimeout(function() {
            return p.loadMoreRows();
          }, pbT("Read of {t}", { t: table })).then(function(nx) {
            rows = rows.concat(nx && nx.rows ? Array.prototype.slice.call(nx.rows) : []);
            return more(nx);
          });
        }
        return rows.slice(0, top);
      }
      return more(pg);
    });
  }
  function attempt(useSel) {
    if (web) {
      return viaXrm(useSel).then(function(rows) {
        return { rows, via: "Xrm.WebApi" };
      }, function(e) {
        firstErr = pbErrText(e);
        if (dataApi && dataApi.queryTable) return viaApi(useSel).then(function(rows) {
          return { rows, via: "dataApi" };
        }, function(e2) {
          return { rows: null, err: firstErr || pbErrText(e2) };
        });
        return { rows: null, err: firstErr };
      });
    }
    if (dataApi && dataApi.queryTable) return viaApi(useSel).then(function(rows) {
      return { rows, via: "dataApi" };
    }, function(e) {
      return { rows: null, err: pbErrText(e) };
    });
    return Promise.resolve({ rows: null, err: pbT("This page has no Dataverse connection (no Xrm.WebApi and no dataApi)."), kind: "nohost" });
  }
  return attempt(sel).then(function(r) {
    if (r.rows || !sel || pbErrKind(r.err) !== "column" || opts.strictSelect) {
      if (!r.rows && !r.kind) r.kind = pbErrKind(r.err);
      return r;
    }
    return attempt(null).then(function(r2) {
      r2.droppedSelect = true;
      if (!r2.rows && !r2.kind) r2.kind = pbErrKind(r2.err);
      return r2;
    });
  });
}
function pbQueryFirst(dataApi, names, opts) {
  var i = 0;
  var last = null;
  function next() {
    if (i >= names.length) return Promise.resolve(last || { rows: null, err: "No table name to try", kind: "missing" });
    var t = names[i++];
    return pbQuery(dataApi, t, opts).then(function(r) {
      r.table = t;
      if (r.rows) return r;
      if (!last || last.kind === "missing") last = r;
      if (r.kind === "missing") return next();
      return r;
    });
  }
  return next();
}
function pbProbe(dataApi, names) {
  var i = 0;
  var res = { table: null, state: "missing", why: "" };
  function next() {
    if (i >= names.length) return Promise.resolve(res);
    var t = names[i++];
    return pbQuery(dataApi, t, { select: [pbIdCol(t)], top: 1, strictSelect: true }).then(function(r) {
      if (r.rows) return { table: t, state: "found", why: "" };
      var k = r.kind || pbErrKind(r.err);
      if (k === "column") return { table: t, state: "found", why: "The id column " + pbIdCol(t) + " was not found, so its name differs: " + r.err };
      if (k === "denied") return { table: t, state: "denied", why: r.err };
      if (k === "nohost") return { table: null, state: "nohost", why: r.err };
      if (k === "unknown") {
        res = { table: null, state: "unknown", why: r.err };
        return next();
      }
      if (res.state === "missing") res.why = r.err;
      return next();
    });
  }
  return next();
}
function pbProbeCols(dataApi, table, cols) {
  var out = {};
  var chain = Promise.resolve();
  cols.forEach(function(c) {
    chain = chain.then(function() {
      return pbQuery(dataApi, table, { select: [c], top: 1, strictSelect: true }).then(function(r) {
        out[c] = r.rows ? "found" : pbErrKind(r.err) === "column" ? "missing" : "unknown";
      });
    });
  });
  return chain.then(function() {
    return out;
  });
}
function pbIdOf(res) {
  var id = typeof res === "string" ? res : res && (res.id || res.entityId || res.recordId);
  return id ? pbCleanId(id) : null;
}
function pbWriter(dataApi) {
  var x = pbXrm();
  var web = x && x.WebApi;
  if (web && web.createRecord && web.updateRecord) {
    return {
      create: function(t, body) {
        return pbTimeout(function() {
          return web.createRecord(t, body);
        }, pbT("Save to {t}", { t })).then(pbIdOf);
      },
      update: function(t, id, body) {
        return pbTimeout(function() {
          return web.updateRecord(t, id, body);
        }, pbT("Save to {t}", { t }));
      },
      remove: function(t, id) {
        return pbTimeout(function() {
          return web.deleteRecord(t, id);
        }, pbT("Delete from {t}", { t }));
      }
    };
  }
  if (dataApi && dataApi.createRow && dataApi.updateRow) {
    return {
      create: function(t, body) {
        return pbTimeout(function() {
          return window.__pgC(dataApi, t, body);
        }, pbT("Save to {t}", { t })).then(pbIdOf);
      },
      update: function(t, id, body) {
        return pbTimeout(function() {
          return window.__pgU(dataApi, t, id, body);
        }, pbT("Save to {t}", { t }));
      },
      remove: function(t, id) {
        return dataApi.deleteRow ? pbTimeout(function() {
          return window.__pgD(dataApi, t, id);
        }, pbT("Delete from {t}", { t })) : Promise.reject(new Error(pbT("Delete is not available here")));
      }
    };
  }
  return null;
}
function pbSave(dataApi, table, id, body) {
  var w = pbWriter(dataApi);
  if (!w) return Promise.reject(new Error(pbT("This page cannot write to Dataverse here.")));
  var p = id ? w.update(table, id, body).then(function() {
    return id;
  }) : w.create(table, body);
  return p.catch(function(e) {
    var m = pbErrText(e);
    if (pbErrKind(m) === "column") throw new Error(pbT("A column is missing in {t}: {err}", { t: table, err: m }));
    throw new Error(m);
  });
}
var PB_PLAN_CHUNKS = [4e3, 2e3, 1e3, 500, 250, 100];
var PB_PLAN_JSON_COLS = ["craa5_plan_json", "craa5_planjson"];
function pbPlanText(row) {
  var nw = pbField(row, PB_PLAN_JSON_COLS[0]);
  var old = pbField(row, PB_PLAN_JSON_COLS[1]);
  var hasN = nw !== null && nw !== void 0 && String(nw) !== "";
  var hasO = old !== null && old !== void 0 && String(old) !== "";
  if (hasN && hasO) return String(old);
  return hasN ? String(nw) : hasO ? String(old) : "";
}
function pbPlanColProbe(dataApi, table) {
  var nw = PB_PLAN_JSON_COLS[0];
  var old = PB_PLAN_JSON_COLS[1];
  function one(c) {
    return pbQuery(dataApi, table, { select: [c], top: 1, strictSelect: true }).then(function(r) {
      return r.rows ? "found" : pbErrKind(r.err) === "column" ? "missing" : "unknown:" + (r.err || "");
    });
  }
  return one(nw).then(function(a) {
    if (a === "found") return one(old).then(function(b) {
      return { col: nw, state: "new", why: "", clear: b === "found" ? old : null };
    });
    if (a === "missing") return { col: old, state: "old", why: "", clear: null };
    return { col: old, state: "unknown", why: String(a).slice(8, 128), clear: null };
  });
}
function pbIsTooLong(msg) {
  return /exceed(s|ed)? the maximum|maximum (number of characters|allowed length)|m.ximo de caracteres|longitud m.xima|too long|would be truncated|StringLengthTooLong/i.test(String(msg || ""));
}
function pbSplitText(s, size) {
  var out = [];
  var i = 0;
  s = String(s || "");
  if (!size || size < 50) return [s];
  while (i < s.length) {
    var n = Math.min(size, s.length - i);
    var c = s.charCodeAt(i + n - 1);
    if (n > 1 && c >= 55296 && c <= 56319) n--;
    out.push(s.slice(i, i + n));
    i += n;
  }
  return out.length ? out : [""];
}
function pbJoinPlanRows(rows, key) {
  var main = [];
  var extra = [];
  (rows || []).forEach(function(r) {
    var wk = pbTrim(pbField(r, "craa5_weekendkey"));
    if (wk === key) main.push(r);
    else if (wk.indexOf(key + "#") === 0) extra.push({ i: parseInt(wk.slice(key.length + 1), 10), r });
  });
  main.sort(function(a, b) {
    return (pbNum(pbField(b, "craa5_version")) || 0) - (pbNum(pbField(a, "craa5_version")) || 0) || (pbMs(pbField(b, "modifiedon")) || 0) - (pbMs(pbField(a, "modifiedon")) || 0);
  });
  var row = main[0] || null;
  function tag(r) {
    return /(\d+)\/(\d+)(?: (\w+))?$/.exec(pbTrim(pbField(r, "craa5_status")));
  }
  var m = row ? tag(row) : null;
  var n = m ? parseInt(m[2], 10) : 1;
  var stamp = m && m[3] ? m[3] : "";
  var want = {};
  var stale = [];
  extra.forEach(function(x) {
    var sm = tag(x.r);
    var ok = x.i >= 2 && x.i <= n && !want[x.i] && !!sm && parseInt(sm[1], 10) === x.i && parseInt(sm[2], 10) === n && (!stamp || sm[3] === stamp);
    if (ok) want[x.i] = x.r;
    else stale.push(x.r.__id);
  });
  var text = row ? pbPlanText(row) : "";
  var missing = false;
  for (var j = 2; j <= n; j++) {
    if (!want[j]) {
      missing = true;
      break;
    }
    text += pbPlanText(want[j]);
  }
  var partIds = {};
  pbKeys(want).forEach(function(k) {
    partIds[k] = want[k].__id;
  });
  return { row, json: row && !missing ? text : null, n, partIds, stale, missing };
}
function pbSlimLines(plan) {
  var out = pbClone(plan || {});
  var lines = out.lines || {};
  var kept = {};
  function empty(v) {
    return v === null || v === void 0 || v === "" || Array.isArray(v) && !v.length || typeof v === "object" && !Array.isArray(v) && !pbKeys(v).length;
  }
  pbKeys(lines).forEach(function(k) {
    var l = lines[k];
    if (!l || typeof l !== "object") return;
    var o = {};
    pbKeys(l).forEach(function(f) {
      var v = l[f];
      if (v && typeof v === "object" && !Array.isArray(v)) {
        var m = {};
        pbKeys(v).forEach(function(g) {
          if (!empty(v[g])) m[g] = v[g];
        });
        v = m;
      }
      if (!empty(v)) o[f] = v;
    });
    if (pbKeys(o).length) kept[k] = o;
  });
  out.lines = kept;
  return out;
}
function pbColumnMax(table, col) {
  var x = pbXrm();
  if (!x || !x.Utility || typeof x.Utility.getEntityMetadata !== "function") return Promise.resolve(null);
  var p;
  try {
    p = Promise.resolve(x.Utility.getEntityMetadata(table, [col]));
  } catch (e) {
    return Promise.resolve(null);
  }
  return p.then(function(md) {
    var a = null;
    var at = md && md.Attributes;
    try {
      if (at && typeof at.get === "function") a = at.get(col);
    } catch (e1) {
      a = null;
    }
    try {
      if (!a && at && typeof at.forEach === "function") at.forEach(function(it) {
        if (it && it.LogicalName === col) a = it;
      });
    } catch (e2) {
      a = null;
    }
    if (!a && at && at.length) {
      for (var i = 0; i < at.length; i++) {
        if (at[i] && at[i].LogicalName === col) a = at[i];
      }
    }
    var n = a ? pbNum(a.MaxLength) : null;
    return n && n > 0 ? n : null;
  }, function() {
    return null;
  });
}
function pbUserName() {
  var x = pbXrm();
  try {
    var gc = x && x.Utility && x.Utility.getGlobalContext && x.Utility.getGlobalContext();
    var u = gc && gc.userSettings;
    if (u && u.userName) return String(u.userName);
  } catch (e) {
  }
  return "";
}
function pbReadUser(props) {
  var out = { id: "", name: "", first: "", email: "", source: "", warn: "" };
  var x = pbXrm();
  try {
    var gc = x && x.Utility && x.Utility.getGlobalContext ? x.Utility.getGlobalContext() : null;
    var us = gc ? gc.userSettings : null;
    if (!us && props && props.context) us = props.context.userSettings;
    if (us) {
      out.id = pbCleanId(us.userId || "");
      out.name = pbTrim(us.userName || "");
      out.source = "Power Apps sign-in";
    }
  } catch (e) {
    out.warn = pbErrText(e);
  }
  if (out.name.indexOf("@") > 0) {
    out.email = out.name.toLowerCase();
    out.name = "";
  }
  var web = x && x.WebApi;
  if (!out.id || !web || typeof web.retrieveRecord !== "function") {
    out.first = pbFirstName(out.name);
    return Promise.resolve(out);
  }
  return pbTimeout(function() {
    return web.retrieveRecord("systemuser", out.id, "?$select=fullname,firstname,internalemailaddress,domainname");
  }, pbT("Reading your user record")).then(function(r) {
    r = r || {};
    out.name = pbTrim(r.fullname) || out.name;
    out.first = pbTrim(r.firstname) || pbFirstName(out.name);
    out.email = String(r.internalemailaddress || r.domainname || out.email || "").trim().toLowerCase();
    out.source = "Power Apps sign-in and your user record";
    return out;
  }, function(e) {
    out.first = pbFirstName(out.name);
    out.warn = pbErrText(e);
    return out;
  });
}
function pbFirstName(n) {
  var s = pbTrim(n);
  if (!s) return "";
  if (s.indexOf(",") > 0) return pbTrim(s.split(",")[1]).split(" ")[0] || s;
  return s.split(" ")[0];
}
function pbIsDev(user, devUsers) {
  var list = Array.isArray(devUsers) ? devUsers : [];
  if (!list.length) return true;
  if (!user) return false;
  return list.some(function(d) {
    return !!d && (d.id && user.id && pbCleanId(d.id) === user.id || d.email && user.email && String(d.email).toLowerCase() === user.email);
  });
}
var PB_STATUS_AREA = /\b(pto|sick|late|left early|ncns|no call|unassigned|vacation|fmla)\b/i;
var PB_ROLE = { 256e6: "regular", 256000001: "lead", 256000002: "supervisor", 256000003: "manager" };
var PB_RATE_FALLBACK = ["sanitation tech 2", "Sanitor", "All"];
var PB_DEPTS = ["SAN", "MNT", "FSQ", "OPS"];
var PB_DEPT_NAME = { SAN: "Sanitation", MNT: "Maintenance", FSQ: "Quality (FSQ)", OPS: "Operations" };
function pbDefaultConfig() {
  return {
    v: 1,
    rate: null,
    keyGoals: ["cip"],
    // milestones and steps whose name has one of these words are key goalposts (starred)
    devUsers: [],
    // Microsoft accounts that can open Setup and Data (empty = not locked yet)
    excludeOnDemand: true,
    monthlyRule: true,
    mntPattern: "foam",
    mntFill: false,
    // maintenance takes the spare time before the restart (each line can override)
    lineOrder: [],
    pre: [{ id: "handoff", dept: "OPS", name: "Debris pick up, rinse down, handoff to sanitation", anchor: "stop", offset: 0, minutes: 60, hc: 0 }],
    tail: [
      { id: "fsqinspect", dept: "FSQ", name: "FSQ inspect", anchor: "chain", offset: 0, minutes: 60, hc: 0 },
      { id: "swab", dept: "FSQ", name: "Swab", anchor: "chain", offset: 0, minutes: 90, hc: 0 },
      { id: "preflight", dept: "OPS", name: "Preflight", anchor: "restart", offset: -60, minutes: 120, hc: 0 },
      { id: "firstpie", dept: "OPS", name: "1st pie", anchor: "restart", offset: 60, minutes: 0, hc: 0 }
    ]
  };
}
function pbMergeConfig(saved) {
  var d = pbDefaultConfig();
  if (!saved || typeof saved !== "object") return d;
  var out = pbClone(d);
  ["rate", "excludeOnDemand", "monthlyRule", "mntPattern", "mntFill", "lineOrder", "pre", "tail", "keyGoals", "devUsers"].forEach(function(k) {
    if (saved[k] !== void 0) out[k] = saved[k];
  });
  if (!Array.isArray(out.pre)) out.pre = d.pre;
  if (!Array.isArray(out.tail)) out.tail = d.tail;
  if (!Array.isArray(out.lineOrder)) out.lineOrder = [];
  if (!Array.isArray(out.keyGoals)) out.keyGoals = d.keyGoals;
  if (!Array.isArray(out.devUsers)) out.devUsers = [];
  return out;
}
function pbEmptyPlan(weekend) {
  return { v: 1, weekend, lines: {}, shiftHc: {}, notes: "", presets: null };
}
function pbKeyByName(name, words) {
  var c = pbCanon(name);
  return (words || []).some(function(w) {
    var k = pbCanon(w);
    return !!k && c.indexOf(k) >= 0;
  });
}
function pbSubcatOrder(s) {
  var m = /(\d+(\.\d+)?)/.exec(String(s || ""));
  return m ? parseFloat(m[1]) : null;
}
function pbIsOnDemand(s) {
  return /on\s*-?\s*deman/i.test(String(s || ""));
}
function pbIsSecondWeekItem(name) {
  return /2nd\s*w(ee)?k|2nd\s*wom|2nd\s*week/i.test(String(name || ""));
}
function pbIsSecondWeekend(satYmd) {
  var d = pbFromYmd(satYmd);
  return !!d && d.getDate() >= 8 && d.getDate() <= 14;
}
function pbNormAsset(r) {
  var area = pbTrim(pbField(r, "craa5_areaname", true));
  var sub = pbTrim(pbField(r, "craa5_subcategory", true));
  var min = pbNum(pbField(r, "craa5_hoursrequired"));
  return {
    id: pbCleanId(pbField(r, "craa5___1_a_assetsid")),
    name: pbTrim(pbField(r, "craa5_equipmentidentifier")) || "(no name)",
    area,
    areaKey: pbCanon(area),
    room: pbTrim(pbField(r, "craa5_roomname", true)),
    subcat: sub,
    order: pbSubcatOrder(sub),
    minutes: min !== null && min > 0 ? min : null,
    // craa5_hoursrequired holds minutes (Ganttly, Production Scheduler)
    allergenMin: pbNum(pbField(r, "craa5_minalrg")),
    heads: Math.max(1, pbInt(pbField(r, "craa5_heads"), 1) || 1),
    headsKnown: pbNum(pbField(r, "craa5_heads")) !== null,
    weekly: pbField(r, "craa5_weeklyclean") === true,
    monthly: pbField(r, "craa5_monthlyclean") === true || pbField(r, "craa5_month") === true,
    secondWeek: pbIsSecondWeekItem(pbField(r, "craa5_equipmentidentifier")),
    onDemand: pbIsOnDemand(sub),
    active: pbField(r, "statecode") === void 0 || pbField(r, "statecode") === 0
  };
}
function pbGroupAreas(assets) {
  var areas = {};
  assets.forEach(function(a) {
    if (!a.active || !a.areaKey) return;
    var g = areas[a.areaKey] || (areas[a.areaKey] = { key: a.areaKey, name: a.area, rooms: [], assets: [] });
    g.assets.push(a);
    if (a.room && g.rooms.indexOf(a.room) < 0) g.rooms.push(a.room);
  });
  return areas;
}
function pbMilestones(area, opts) {
  opts = opts || {};
  var exclude = {};
  (opts.exclude || []).forEach(function(id) {
    exclude[id] = 1;
  });
  var keep = {};
  (opts.keep || []).forEach(function(id) {
    keep[id] = 1;
  });
  var groups = {};
  var left = [];
  (area ? area.assets : []).forEach(function(a) {
    var why = "";
    var word = "";
    var sc = opts.scope ? opts.scope[a.id] : null;
    if (exclude[a.id]) why = "hand";
    else if (sc && sc.leftOutBy && !keep[a.id]) {
      why = "plan";
      word = sc.leftOutBy;
    } else if (opts.excludeOnDemand && a.onDemand) why = "ondemand";
    else if (opts.monthlyRule && a.secondWeek && !opts.secondWeekend) why = "secondweek";
    if (why) {
      left.push({ asset: a, why, word });
      return;
    }
    var label = a.subcat || "(no subcategory)";
    var key = pbCanon(label) || "none";
    var g = groups[key] || (groups[key] = { key, name: label, order: a.order, pieces: [], totalMin: 0, maxWall: 0, headsSum: 0, missingMin: 0 });
    var min = a.minutes;
    if (opts.allergen && a.allergenMin && a.allergenMin > 0) min = a.allergenMin;
    g.pieces.push({ asset: a, minutes: min });
    if (min === null) g.missingMin++;
    else {
      g.totalMin += min;
      g.maxWall = Math.max(g.maxWall, min / a.heads);
    }
    g.headsSum += a.heads;
  });
  var list = pbKeys(groups).map(function(k) {
    return groups[k];
  });
  list.sort(function(a, b) {
    var oa = a.order === null ? 1e9 : a.order;
    var ob = b.order === null ? 1e9 : b.order;
    return oa - ob || a.name.localeCompare(b.name);
  });
  list.forEach(function(g) {
    g.pieces.sort(function(x, y) {
      return (y.minutes || 0) - (x.minutes || 0);
    });
  });
  return { groups: list, left };
}
function pbNormRun(r) {
  return {
    id: pbCleanId(pbField(r, "craa5___1_p_prodscheduleid")),
    area: pbTrim(pbField(r, "craa5_area")),
    line: pbInt(pbField(r, "craa5_line"), 1) || 1,
    start: pbMs(pbField(r, "craa5_datestarttime")),
    end: pbMs(pbField(r, "craa5_dateendtime")),
    product: pbTrim(pbField(r, "craa5_product")),
    allergen: pbField(r, "craa5_allergen") === true,
    allergenType: pbTrim(pbField(r, "craa5_typeofallergen"))
  };
}
function pbRunAreaKey(run, known) {
  var a = pbCanon(run.area);
  var cands = [a + String(run.line), a];
  for (var i = 0; i < cands.length; i++) if (known[cands[i]]) return cands[i];
  return a + (run.line > 1 ? String(run.line) : "");
}
function pbRunsByArea(runs, known) {
  var out = {};
  runs.forEach(function(r) {
    if (r.start === null || r.end === null || r.end <= r.start) return;
    if (/maint/i.test(r.product)) return;
    var k = pbRunAreaKey(r, known);
    (out[k] || (out[k] = [])).push(r);
  });
  pbKeys(out).forEach(function(k) {
    out[k].sort(function(a, b) {
      return a.start - b.start;
    });
  });
  return out;
}
function pbFindWindow(runs, frame) {
  if (!runs || !runs.length) return { status: "noruns", stop: null, restart: null, note: pbT("No runs in the production schedule this week") };
  var merged = [];
  runs.forEach(function(r) {
    var last = merged[merged.length - 1];
    if (last && r.start <= last.end + 30 * PB_MIN) {
      if (r.end > last.end) {
        last.end = r.end;
        last.lastRun = r;
      }
    } else merged.push({ start: r.start, end: r.end, firstRun: r, lastRun: r });
  });
  var gaps = [];
  if (merged[0].start > frame.focusStart) gaps.push({ start: null, end: merged[0].start, next: merged[0].firstRun });
  for (var i = 0; i < merged.length - 1; i++) gaps.push({ start: merged[i].end, end: merged[i + 1].start, prev: merged[i].lastRun, next: merged[i + 1].firstRun });
  var tail = merged[merged.length - 1];
  gaps.push({ start: tail.end, end: null, prev: tail.lastRun });
  var best = null;
  var bestOv = 0;
  gaps.forEach(function(g) {
    var s = g.start === null ? frame.readStart : g.start;
    var e = g.end === null ? frame.readEnd : g.end;
    if (e - s < 60 * PB_MIN) return;
    var ov = Math.min(e, frame.focusEnd) - Math.max(s, frame.focusStart);
    if (ov > bestOv) {
      bestOv = ov;
      best = g;
    }
  });
  if (!best) return { status: "runsthrough", stop: null, restart: null, note: pbT("Runs through the weekend in the production schedule (no stop of an hour or more)") };
  var out = { stop: best.start, restart: best.end, prev: best.prev || null, next: best.next || null, status: "ok", note: "" };
  if (best.start === null) {
    out.status = "nostop";
    out.note = pbT("Already down before Friday in the schedule: set the stop time");
  } else if (best.end === null) {
    out.status = "norestart";
    out.note = pbT("No run after the weekend in the production schedule yet: set the restart time");
  }
  return out;
}
function pbNormShift(v) {
  if (v === null || v === void 0 || v === "") return "";
  var n = pbNum(v);
  if (n !== null) {
    if (n >= 256e6 && n <= 256000003) return "ABCD".charAt(n - 256e6);
    if (n >= 1 && n <= 4) return "ABCD".charAt(n - 1);
  }
  var s = String(v).trim().toUpperCase();
  var m = /^(?:CREW|SHIFT|TEAM)?\s*([A-D])\b/.exec(s);
  return m ? m[1] : "";
}
function pbPayRole(r) {
  var name = "";
  var id = "";
  function take(v) {
    if (v === void 0 || v === null) return;
    if (typeof v === "object") {
      take(v.name || v.craa5_name || v.primaryName);
      take(v.id || v.craa5___1_a_roleid || v.craa5_aa_roleid);
      return;
    }
    var s = pbTrim(v);
    if (!s) return;
    if (pbGuidLike(s)) {
      if (!id) id = pbCleanId(s);
    } else if (!name && !pbPureNumber(s)) name = s;
  }
  take(pbField(r, "_craa5_roleid_value", true));
  take(pbField(r, "_craa5_roleid_value"));
  take(pbField(r, "craa5_roleid"));
  return { name, id };
}
function pbPureNumber(s) {
  return /^\s*-?\d+(\.\d+)?\s*$/.test(String(s));
}
function pbRoleNames(rows) {
  var map = {};
  (rows || []).forEach(function(r) {
    var id = "";
    var name = pbTrim(pbField(r, "craa5_name"));
    for (var k in r) {
      if (!Object.prototype.hasOwnProperty.call(r, k) || k.indexOf("@") >= 0) continue;
      var v = r[k];
      if (typeof v !== "string") continue;
      if (/roleid$/i.test(k) && pbGuidLike(v)) {
        if (!id) id = pbCleanId(v);
      } else if (!name && /^craa5_/i.test(k) && !/id$/i.test(k) && v.trim() && !pbGuidLike(v) && !pbPureNumber(v)) name = v.trim();
    }
    if (id && name) map[id] = name;
  });
  return map;
}
function pbFillRoleNames(employees, map) {
  if (map) employees.forEach(function(e) {
    if (!e.roleName && e.roleId && map[e.roleId]) e.roleName = map[e.roleId];
  });
  return employees;
}
function pbNormEmployee(r) {
  var role = pbNum(pbField(r, "craa5_role"));
  var pr = pbPayRole(r);
  return {
    id: pbCleanId(pbField(r, "craa5___1_a_employeeid") || pbField(r, "craa5___1_a_employeeid")),
    name: pbTrim(pbField(r, "craa5_name")),
    crew: pbNormShift(pbField(r, "craa5_shift")),
    role: role === null ? "regular" : PB_ROLE[role] || "regular",
    roleName: pr.name,
    roleId: pr.id,
    active: pbField(r, "statecode") === void 0 || pbField(r, "statecode") === 0
  };
}
function pbFixHour(h) {
  var n = pbInt(h, null);
  if (n === null) return null;
  return n === 1 ? 0 : n;
}
function pbShiftSlots(rows, fromMs, toMs) {
  var segs = [];
  rows.forEach(function(r) {
    var code = pbNormShift(pbField(r, "craa5_shiftcode"));
    var day = pbInt(pbField(r, "craa5_daynumber"), null);
    var s = pbFixHour(pbField(r, "craa5_shiftstarthour"));
    var e = pbInt(pbField(r, "craa5_shiftendhour"), null);
    if (!code || day === null || s === null || e === null) return;
    segs.push({ code, dow: (day - 1 + 7) % 7, s, e });
  });
  if (!segs.length) return [];
  function crewsAt(t2) {
    var d = new Date(t2);
    var dow = d.getDay();
    var h = d.getHours();
    var prev = (dow + 6) % 7;
    var out = [];
    segs.forEach(function(g) {
      var on = false;
      if (g.e > g.s) on = g.dow === dow && h >= g.s && h < g.e;
      else on = g.dow === dow && h >= g.s || g.dow === prev && h < g.e;
      if (on && out.indexOf(g.code) < 0) out.push(g.code);
    });
    out.sort();
    return out;
  }
  var slots = [];
  var t0 = new Date(fromMs);
  t0.setMinutes(0, 0, 0);
  for (var t = t0.getTime(); t < toMs; t += PB_HOUR) {
    var c = crewsAt(t);
    var key = c.join("");
    var last = slots[slots.length - 1];
    if (last && last.key === key) last.end = t + PB_HOUR;
    else slots.push({ key, crews: c, start: t, end: t + PB_HOUR });
  }
  return slots;
}
function pbNormBoard(r, src) {
  var raw = pbField(r, "craa5_boardjson");
  var j = null;
  try {
    j = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (e) {
    j = null;
  }
  var crew = pbNormShift(pbField(r, "craa5_crew") || j && j.crew);
  var ss = pbMs(pbField(r, "craa5_slotstart"));
  if (ss === null && j && j.slotStart) ss = pbMs(j.slotStart);
  var se = pbMs(pbField(r, "craa5_slotend"));
  if (se === null && j && j.slotEnd) se = pbMs(j.slotEnd);
  var ids = [];
  var names = {};
  var absent = {};
  if (j && Array.isArray(j.attendance)) j.attendance.forEach(function(g) {
    (g && g.people || []).forEach(function(p) {
      if (p && p.guid) absent[pbCleanId(p.guid)] = 1;
    });
  });
  var rows = j && Array.isArray(j.rows) ? j.rows : [];
  rows.forEach(function(x) {
    var area = x.craa5_area || x.area || "";
    if (PB_STATUS_AREA.test(String(area))) {
      var g = pbCleanId(x.craa5__aaemp_guid || x.empId);
      if (g) absent[g] = 1;
      return;
    }
    var id = pbCleanId(x.craa5__aaemp_guid || x.empId);
    var nm = pbTrim(x.craa5_id || x.emp);
    var k = id || (nm ? "n:" + pbCanon(nm) : "");
    if (!k) return;
    if (ids.indexOf(k) < 0) {
      ids.push(k);
      names[k] = nm;
    }
  });
  ids = ids.filter(function(k) {
    return !absent[k];
  });
  var byArea = {};
  rows.forEach(function(x) {
    var area = pbTrim(x.craa5_area || x.area || "");
    if (!area || PB_STATUS_AREA.test(area)) return;
    var id = pbCleanId(x.craa5__aaemp_guid || x.empId) || "n:" + pbCanon(x.craa5_id || x.emp);
    if (absent[id]) return;
    var ak = pbCanon(area);
    byArea[ak] = byArea[ak] || [];
    if (byArea[ak].indexOf(id) < 0) byArea[ak].push(id);
  });
  var upd = null;
  try {
    var ru = pbField(r, "craa5_updatesjson");
    upd = ru ? typeof ru === "string" ? JSON.parse(ru) : ru : null;
  } catch (e2) {
    upd = null;
  }
  var work = upd && Array.isArray(upd.work) ? upd.work.map(function(w) {
    return { guid: pbCleanId(w && w.equipmentGuid), started: pbMs(w && w.startedAt), done: pbMs(w && w.doneAt), workers: (w && w.workers || []).map(function(p) {
      return pbCleanId(p && p.empId) || (p && p.name ? "n:" + pbCanon(p.name) : "");
    }).filter(Boolean) };
  }).filter(function(w) {
    return w.guid;
  }) : [];
  return { src, crew, start: ss, end: se, ids, names, byArea, work, absent: pbKeys(absent).length, status: pbTrim(pbField(r, "craa5_status")), savedAt: pbMs(pbField(r, "modifiedon")) };
}
function pbSlotHeadcount(slot, employees, boards, override) {
  var roster = employees.filter(function(e) {
    return e.active && e.crew && slot.crews.indexOf(e.crew) >= 0 && e.role === "regular";
  });
  var rank = { board: 3, archive: 2, plan: 1 };
  var match = null;
  boards.forEach(function(b) {
    if (!b.crew || slot.crews.indexOf(b.crew) < 0 || b.start === null) return;
    if (Math.abs(b.start - slot.start) > 2 * PB_HOUR) return;
    if (!match || rank[b.src] > rank[match.src] || rank[b.src] === rank[match.src] && (b.savedAt || 0) > (match.savedAt || 0)) match = b;
  });
  var out = { roster: roster.length, rosterIds: roster.map(function(e) {
    return e.id;
  }), board: match ? match.ids.length : null, boardSrc: match ? match.src : "", boardIds: match ? match.ids : [] };
  if (override !== null && override !== void 0 && override !== "" && isFinite(override)) {
    out.value = Number(override);
    out.src = "override";
  } else if (match) {
    out.value = match.ids.length;
    out.src = match.src;
  } else {
    out.value = roster.length;
    out.src = "roster";
  }
  return out;
}
function pbRoundUp(min) {
  return Math.ceil(min / PB_BUCKET_MIN) * PB_BUCKET_MIN;
}
function pbGroupDuration(g, hc) {
  if (!hc || hc < 1) hc = 1;
  var d = Math.max(g.totalMin / hc, g.maxWall);
  return pbRoundUp(Math.max(d, PB_BUCKET_MIN));
}
function pbDefaultHc(g, lineCrew) {
  var h = Math.max(1, g.headsSum);
  if (lineCrew && lineCrew > 0) h = Math.min(h, lineCrew);
  return Math.max(1, Math.round(h));
}
function pbCrewShare(lines, capAt) {
  var out = {};
  lines.forEach(function(l) {
    if (l.stop === null || capAt(l.stop) === Infinity) {
      out[l.key] = null;
      return;
    }
    var rivals = lines.filter(function(o) {
      return o.stop !== null && o.stop <= l.stop + 4 * PB_HOUR && (o.restart === null || o.restart > l.stop);
    });
    var tot = pbSum(rivals, function(o) {
      return o.workMin;
    });
    var cap = capAt(l.stop);
    out[l.key] = tot > 0 ? Math.max(1, Math.round(cap * l.workMin / tot)) : Math.max(1, cap);
  });
  return out;
}
function pbSchedule(lines, slots, config) {
  var active = lines.filter(function(l) {
    return l.stop !== null && l.stop !== void 0;
  });
  if (!active.length) return { lines: {}, profile: [], start: null, end: null, capped: !!slots };
  var h0 = Math.min.apply(null, active.map(function(l) {
    return l.stop;
  }));
  var h1 = Math.max.apply(null, active.map(function(l) {
    return (l.restart || l.stop) + 48 * PB_HOUR;
  }));
  h0 = Math.floor(h0 / (PB_BUCKET_MIN * PB_MIN)) * PB_BUCKET_MIN * PB_MIN;
  var nb = Math.ceil((h1 - h0) / (PB_BUCKET_MIN * PB_MIN));
  var used = [];
  var cap = [];
  for (var b = 0; b < nb; b++) {
    used.push(0);
    var t = h0 + b * PB_BUCKET_MIN * PB_MIN;
    var c = slots ? 0 : Infinity;
    if (slots) {
      for (var si = 0; si < slots.length; si++) if (t >= slots[si].start && t < slots[si].end) {
        c = slots[si].cap;
        break;
      }
    }
    cap.push(c);
  }
  function bk(ms) {
    return Math.max(0, Math.round((ms - h0) / (PB_BUCKET_MIN * PB_MIN)));
  }
  function fits(sb, n, hc) {
    for (var i2 = sb; i2 < sb + n; i2++) {
      if (i2 >= nb) return false;
      if (used[i2] + hc > cap[i2]) return false;
    }
    return true;
  }
  function book(sb, n, hc) {
    for (var i2 = sb; i2 < sb + n && i2 < nb; i2++) used[i2] += hc;
  }
  function place(ready, minutes, hc, ignoreCap) {
    var n = Math.max(0, Math.round(minutes / PB_BUCKET_MIN));
    var sb = bk(ready);
    if (hc <= 0 || n === 0) return { start: h0 + sb * PB_BUCKET_MIN * PB_MIN, over: false, waited: 0 };
    if (ignoreCap) {
      book(sb, n, hc);
      return { start: h0 + sb * PB_BUCKET_MIN * PB_MIN, over: false, waited: 0 };
    }
    for (var s = sb; s + n <= nb; s++) {
      if (fits(s, n, hc)) {
        book(s, n, hc);
        return { start: h0 + s * PB_BUCKET_MIN * PB_MIN, over: false, waited: (s - sb) * PB_BUCKET_MIN };
      }
    }
    book(sb, n, hc);
    return { start: h0 + sb * PB_BUCKET_MIN * PB_MIN, over: true, waited: 0 };
  }
  function schedAll(extra2) {
    for (var ui = 0; ui < nb; ui++) used[ui] = 0;
    var res2 = {};
    active.forEach(function(l) {
      var blocks = [];
      var issues = [];
      var chain = l.stop;
      function step(st, dept) {
        var start;
        if (st.anchor === "stop") start = l.stop + (st.offset || 0) * PB_MIN;
        else if (st.anchor === "restart" && l.restart !== null) start = l.restart + (st.offset || 0) * PB_MIN;
        else start = chain + (st.offset || 0) * PB_MIN;
        var minutes = Math.max(0, pbNum(st.minutes) || 0);
        var hc = Math.max(0, pbInt(st.hc, 0) || 0);
        var over = false;
        if (st.dept === "SAN" && hc > 0) {
          var p = place(start, pbRoundUp(minutes), hc, l.ignoreCap);
          start = p.start;
          over = p.over;
        }
        var blk = { id: "step:" + st.id, stepId: st.id, kind: "step", dept: st.dept, name: st.name, start, end: start + minutes * PB_MIN, minutes, hc, anchor: st.anchor, over, milestone: minutes === 0, keyPreset: !!st.key };
        blocks.push(blk);
        if (st.anchor !== "restart") chain = Math.max(chain, blk.end);
        return blk;
      }
      (l.pre || []).forEach(function(st) {
        step(st);
      });
      var orders = [];
      l.groups.forEach(function(g) {
        var o = g.order === null ? 1e9 : g.order;
        if (orders.indexOf(o) < 0) orders.push(o);
      });
      orders.sort(function(a, b2) {
        return a - b2;
      });
      var mntIdx = -1;
      if (l.mntAfter === "none") mntIdx = -2;
      else if (l.mntAfter && l.mntAfter !== "auto") {
        l.groups.forEach(function(g) {
          if (g.key === l.mntAfter) mntIdx = orders.indexOf(g.order === null ? 1e9 : g.order);
        });
        if (l.mntAfter === "start") mntIdx = -3;
      }
      if (mntIdx === -1) {
        var re = null;
        try {
          re = new RegExp(config && config.mntPattern ? config.mntPattern : "foam", "i");
        } catch (e) {
          re = /foam/i;
        }
        l.groups.forEach(function(g) {
          if (mntIdx === -1 && re.test(g.name)) mntIdx = orders.indexOf(g.order === null ? 1e9 : g.order);
        });
        if (mntIdx === -1) mntIdx = orders.length - 1;
      }
      var mntBlk = null;
      function doMnt() {
        var m = Math.max(0, pbNum(l.mntMinutes) || 0);
        var add = extra2[l.key] || 0;
        mntBlk = { id: "mnt", kind: "mnt", dept: "MNT", name: pbT("Maintenance PM/CM") + (l.woCount ? " (" + pbTn(l.woCount, "{n} work order", "{n} work orders") + ")" : ""), start: chain, end: chain + (m + add) * PB_MIN, minutes: m + add, planned: m, filled: add, hc: 0, over: false, milestone: m + add === 0 };
        if (m === 0) issues.push(l.woCount ? pbTn(l.woCount, "Maintenance has {n} work order but no hours: add hours on the Work orders tab or on the block", "Maintenance has {n} work orders but no hours: add hours on the Work orders tab or on the block") : pbT("No maintenance hours set"));
        blocks.push(mntBlk);
        if (l.sanWaits !== false) chain = mntBlk.end;
      }
      if (mntIdx === -3 && orders.length) doMnt();
      orders.forEach(function(o, oi) {
        var ready = chain;
        var groupEnd = chain;
        l.groups.forEach(function(g) {
          if ((g.order === null ? 1e9 : g.order) !== o) return;
          var hc = l.hc && l.hc[g.key] ? Math.max(1, pbInt(l.hc[g.key], 1)) : pbDefaultHc(g, l.crew);
          var dur = pbGroupDuration(g, hc);
          var p = place(ready, dur, hc, l.ignoreCap);
          var blk = { id: "sub:" + g.key, kind: "sub", dept: "SAN", name: g.name, order: g.order, group: g, start: p.start, end: p.start + dur * PB_MIN, minutes: dur, hc, laborMin: hc * dur, over: p.over, waited: p.waited, hcSet: !!(l.hc && l.hc[g.key]) };
          if (g.missingMin) issues.push(g.name + ": " + pbTn(g.missingMin, "{n} piece has no clean time in the assets table", "{n} pieces have no clean time in the assets table"));
          if (p.over) issues.push(g.name + ": " + pbT("needs {hc} people but the shift does not have them free", { hc }));
          blocks.push(blk);
          groupEnd = Math.max(groupEnd, blk.end);
        });
        chain = groupEnd;
        if (oi === mntIdx) doMnt();
      });
      if (!orders.length) issues.push(pbT("No equipment with a subcategory for this area in the assets table"));
      if (!mntBlk && mntIdx !== -2 && ((pbNum(l.mntMinutes) || 0) > 0 || l.woCount)) doMnt();
      (l.tail || []).forEach(function(st) {
        step(st);
      });
      var finish = chain;
      if (mntBlk) finish = Math.max(finish, mntBlk.end);
      var slack = l.restart !== null && l.restart !== void 0 ? (l.restart - finish) / PB_MIN : null;
      var status = slack === null ? "norestart" : slack < 0 ? "late" : slack < 120 ? "tight" : "ok";
      var labor = pbSum(blocks, function(x) {
        return x.dept === "SAN" ? x.hc * x.minutes : 0;
      });
      blocks.sort(function(a, b2) {
        return a.start - b2.start || (a.kind === "step" ? -1 : 1);
      });
      res2[l.key] = { key: l.key, blocks, finish, slack, status, laborMin: labor, issues, mntBlk, filled: 0, slackLeft: slack };
    });
    return res2;
  }
  var res = schedAll({});
  var first = res;
  var extra = {};
  var good = {};
  var bad = {};
  function canFill(l) {
    var r = first[l.key];
    return !!(l.mntFill && r && r.mntBlk && l.restart !== null && l.restart !== void 0 && (r.mntBlk.planned > 0 || l.woCount));
  }
  function overs(r) {
    var n = 0;
    r.blocks.forEach(function(x) {
      if (x.over) n++;
    });
    return n;
  }
  function fine(l, r) {
    return r && r.slack !== null && r.slack >= 0 && overs(r) <= overs(first[l.key]);
  }
  var cand = active.filter(canFill);
  if (cand.length) {
    var pass = 0;
    while (pass < 12) {
      var want = {};
      var changed = false;
      cand.forEach(function(l) {
        var k = l.key;
        var r = res[k];
        var cur = extra[k] || 0;
        var ok = cur === 0 || fine(l, r);
        var next;
        if (ok) {
          good[k] = Math.max(good[k] || 0, cur);
          if (bad[k] !== void 0 && bad[k] <= good[k]) delete bad[k];
        } else bad[k] = bad[k] === void 0 ? cur : Math.min(bad[k], cur);
        if (ok) {
          var gap = l.sanWaits !== false ? l.restart - r.finish : l.restart - r.mntBlk.end;
          next = cur + Math.floor(gap / PB_MIN / PB_BUCKET_MIN) * PB_BUCKET_MIN;
          if (bad[k] !== void 0 && next >= bad[k]) next = bad[k] - PB_BUCKET_MIN;
          if (next < cur) next = cur;
        } else {
          var g = good[k] || 0;
          next = g + Math.floor((cur - g) / 2 / PB_BUCKET_MIN) * PB_BUCKET_MIN;
          if (next <= g) next = g;
        }
        if (next > 0) want[k] = next;
        if (next !== cur) changed = true;
      });
      if (!changed) break;
      extra = want;
      res = schedAll(extra);
      pass++;
    }
    var redo = false;
    cand.forEach(function(l) {
      var k = l.key;
      if (extra[k] && !fine(l, res[k])) {
        redo = true;
        if (good[k]) extra[k] = good[k];
        else delete extra[k];
      }
    });
    if (redo) {
      res = schedAll(extra);
      var drop = false;
      cand.forEach(function(l) {
        var k = l.key;
        if (extra[k] && !fine(l, res[k])) {
          delete extra[k];
          drop = true;
        }
      });
      if (drop) res = schedAll(extra);
    }
    pbKeys(extra).forEach(function(k) {
      var r = res[k];
      var r0 = first[k];
      if (!r || !r0 || !extra[k]) return;
      r.filled = extra[k];
      r.slackLeft = r.slack;
      r.slack = r0.slack;
      r.status = r0.status;
    });
  }
  var profile = [];
  for (var i = 0; i < nb; i++) {
    if (used[i] || cap[i] !== Infinity && i % 4 === 0) profile.push({ t: h0 + i * PB_BUCKET_MIN * PB_MIN, used: used[i], cap: cap[i] });
  }
  var end = Math.max.apply(null, pbKeys(res).map(function(k) {
    return res[k].finish;
  }));
  return { lines: res, profile, used, cap, h0, nb, start: h0, end, capped: !!slots };
}
function pbSlotUse(sched, slots) {
  return slots.map(function(s) {
    var peak = 0;
    var sum = 0;
    var n = 0;
    if (sched && sched.used) for (var i = 0; i < sched.nb; i++) {
      var t = sched.h0 + i * PB_BUCKET_MIN * PB_MIN;
      if (t >= s.start && t < s.end) {
        peak = Math.max(peak, sched.used[i]);
        sum += sched.used[i];
        n++;
      }
    }
    var hours = (s.end - s.start) / PB_HOUR;
    var usedHrs = sum * PB_BUCKET_MIN / 60;
    return { slot: s, peak, usedHours: usedHrs, paidHours: s.cap === Infinity ? null : s.cap * hours, idleHours: s.cap === Infinity ? null : Math.max(0, s.cap * hours - usedHrs) };
  });
}
function pbExperience(taskRows, archiveRows, sinceMs) {
  var byEmp = {};
  var seen = {};
  function add(empId, name, area, start, end) {
    if (!area || PB_STATUS_AREA.test(area)) return;
    var id = pbCleanId(empId) || (name ? "n:" + pbCanon(name) : "");
    if (!id) return;
    if (start === null || start < sinceMs) return;
    var ak = pbCanon(area);
    var sk = id + "|" + ak + "|" + Math.round(start / (5 * PB_MIN));
    if (seen[sk]) return;
    seen[sk] = 1;
    var hrs = end !== null && end > start ? Math.min(16, (end - start) / PB_HOUR) : 0;
    var e = byEmp[id] || (byEmp[id] = { id, name: name || "", areas: {}, hours: 0, days: {}, last: 0 });
    if (!e.name && name) e.name = name;
    var a = e.areas[ak] || (e.areas[ak] = { name: area, hours: 0, days: {} });
    var day = pbYmd(start);
    a.hours += hrs;
    a.days[day] = 1;
    e.hours += hrs;
    e.days[day] = 1;
    e.last = Math.max(e.last, start);
  }
  (taskRows || []).forEach(function(r) {
    add(
      pbField(r, "craa5__aaemp_guid"),
      pbTrim(pbField(r, "craa5_id")),
      pbTrim(pbField(r, "craa5_area")),
      pbMs(pbField(r, "craa5_starttime")) || pbMs(pbField(r, "craa5_datetimeofassignment")) || pbMs(pbField(r, "createdon")),
      pbMs(pbField(r, "craa5_endtime"))
    );
  });
  (archiveRows || []).forEach(function(r) {
    var b = null;
    try {
      var raw = pbField(r, "craa5_boardjson");
      b = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (e) {
      b = null;
    }
    if (!b || !Array.isArray(b.rows)) return;
    var ss = pbMs(pbField(r, "craa5_slotstart")) || pbMs(b.slotStart);
    var se = pbMs(pbField(r, "craa5_slotend")) || pbMs(b.slotEnd);
    b.rows.forEach(function(x) {
      var st = pbMs(x.craa5_starttime) || ss;
      var en = pbMs(x.craa5_endtime) || se || (st !== null ? st + 12 * PB_HOUR : null);
      add(x.craa5__aaemp_guid || x.empId, pbTrim(x.craa5_id || x.emp), pbTrim(x.craa5_area || x.area), st, en);
    });
  });
  pbKeys(byEmp).forEach(function(k) {
    var e = byEmp[k];
    e.dayCount = pbKeys(e.days).length;
    pbKeys(e.areas).forEach(function(ak) {
      e.areas[ak].dayCount = pbKeys(e.areas[ak].days).length;
    });
  });
  return byEmp;
}
function pbSuggestPeople(exp, employees, crews, areaKey, limit) {
  var list = employees.filter(function(e) {
    return e.active && e.role === "regular" && crews.indexOf(e.crew) >= 0;
  }).map(function(e) {
    var x = exp ? exp[e.id] || exp["n:" + pbCanon(e.name)] : null;
    var a = x && x.areas[areaKey];
    return { emp: e, hours: a ? a.hours : 0, days: a ? a.dayCount : 0 };
  });
  list.sort(function(a, b) {
    return b.hours - a.hours || b.days - a.days || a.emp.name.localeCompare(b.emp.name);
  });
  return list.slice(0, limit || 50);
}
function pbSplitRows(text) {
  var t = String(text || "").replace(/\r\n?/g, "\n");
  var firstLine = t.split("\n")[0] || "";
  var delim = firstLine.indexOf("	") >= 0 ? "	" : firstLine.indexOf(";") >= 0 && firstLine.indexOf(",") < 0 ? ";" : ",";
  var rows = [];
  var row = [];
  var cell = "";
  var q = false;
  for (var i = 0; i < t.length; i++) {
    var ch = t.charAt(i);
    if (q) {
      if (ch === '"') {
        if (t.charAt(i + 1) === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"' && cell === "") {
      q = true;
      continue;
    }
    if (ch === delim) {
      row.push(cell);
      cell = "";
      continue;
    }
    if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter(function(r) {
    return r.some(function(c) {
      return pbTrim(c) !== "";
    });
  });
}
var PB_WO_HEAD = {
  priority: /^priority$|^prio/,
  order: /^order$|^ordernumber$|^order(no|num|#)/,
  description: /^description$|^desc$/,
  description2: /^description2$|^desc2$|^asset|^equipment/,
  ordertype: /^ordertype$|^type$/,
  floc: /^functionalloc|^floc|^functionallocation/,
  basstart: /^basstart|^basicstart|^startdate/,
  workctr: /^mainworkctr|^workctr|^workcenter|^maint?workcenter/,
  sortfield: /^sortfield|^sort/
};
function pbParseDate(v) {
  var s = pbTrim(v);
  if (!s) return null;
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/.exec(s);
  if (m) {
    var y = +m[3];
    if (y < 100) y += 2e3;
    return new Date(y, +m[1] - 1, +m[2]).getTime();
  }
  var n = pbNum(s);
  if (n !== null && n > 3e4 && n < 8e4) {
    var base = new Date(1899, 11, 30);
    return pbAddDays(base, Math.floor(n)).getTime();
  }
  return null;
}
function pbParseWorkOrders(text) {
  var rows = pbSplitRows(text);
  var issues = [];
  if (!rows.length) return { rows: [], issues: [pbT("Nothing was pasted")] };
  var head = rows[0].map(function(h) {
    return pbCanon(h);
  });
  var idx = {};
  pbKeys(PB_WO_HEAD).forEach(function(k) {
    for (var i = 0; i < head.length; i++) {
      if (PB_WO_HEAD[k].test(head[i]) && !(k === "description" && head[i] === "description2") && !(k === "order" && /type/.test(head[i]))) {
        if (idx[k] === void 0) idx[k] = i;
      }
    }
  });
  if (idx.order === void 0) return { rows: [], issues: [pbT('No "Order" column was found in the first row. Copy the header row from the SAP export too.')] };
  ["floc", "description2"].forEach(function(k) {
    if (idx[k] === void 0) issues.push(pbT('No "{col}" column: asset matching will be by hand', { col: k === "floc" ? "Functional loc." : "Description2" }));
  });
  var out = [];
  var seen = {};
  rows.slice(1).forEach(function(r, i) {
    function g(k) {
      return idx[k] === void 0 ? "" : pbTrim(r[idx[k]]);
    }
    var order = g("order").replace(/\.0+$/, "");
    if (!order) {
      issues.push(pbT("Row {n} has no order number and was skipped", { n: i + 2 }));
      return;
    }
    if (seen[order]) {
      issues.push(pbT("Order {order} is pasted twice; the first one was kept", { order }));
      return;
    }
    seen[order] = 1;
    var bs = g("basstart");
    out.push({ order, priority: g("priority"), description: g("description"), assetDesc: g("description2"), orderType: g("ordertype"), floc: g("floc").toUpperCase(), basicStart: pbParseDate(bs), basicStartText: bs, workCenter: g("workctr"), sortField: g("sortfield") });
  });
  return { rows: out, issues };
}
function pbParseFloc(f) {
  var p = String(f || "").toUpperCase().split("-");
  return { state: p[0] || "", site: p[1] || "", area: p[2] || "", sub: p.slice(3).join("-") };
}
function pbFlocKey(floc, desc) {
  return (String(floc || "").toUpperCase().trim() + "|" + pbCanon(desc)).slice(0, 300);
}
function pbTokens(s) {
  return pbUniq(String(s || "").toLowerCase().replace(/\(.*?\)/g, " ").split(/[^a-z0-9]+/).filter(function(w) {
    return w.length > 1 && !/^(the|and|of|on|to|for|with|line|left|right)$/.test(w);
  }));
}
function pbSuggestAsset(wo, assets, maps) {
  var key = pbFlocKey(wo.floc, wo.assetDesc);
  if (maps[key]) return { how: "saved", map: maps[key], assetId: maps[key].assetId, areaKey: maps[key].areaKey, score: 1 };
  var fl = pbParseFloc(wo.floc);
  var areaKey = "";
  var ac = pbCanon(fl.area);
  var areaKeys = pbUniq(assets.map(function(a) {
    return a.areaKey;
  }));
  if (ac && areaKeys.indexOf(ac) >= 0) areaKey = ac;
  if (!areaKey) {
    pbKeys(maps).forEach(function(k) {
      var m = maps[k];
      if (!areaKey && m.areaKey && pbCanon(pbParseFloc(m.floc).area) === ac) areaKey = m.areaKey;
    });
  }
  var toks = pbTokens(wo.assetDesc);
  var best = null;
  var bestScore = 0;
  if (toks.length) assets.forEach(function(a) {
    if (areaKey && a.areaKey !== areaKey) return;
    var at = pbTokens(a.name);
    var hit = 0;
    toks.forEach(function(t) {
      if (at.indexOf(t) >= 0) hit++;
    });
    var sc = hit / toks.length;
    if (sc > bestScore) {
      bestScore = sc;
      best = a;
    }
  });
  if (best && bestScore >= 0.5) return { how: "guess", assetId: best.id, areaKey: best.areaKey, score: bestScore };
  return { how: areaKey ? "area" : "none", assetId: "", areaKey, score: 0 };
}
function pbProgressIndex(checkoffRows, boards, from, to) {
  var out = {};
  function get(g) {
    return out[g] || (out[g] = { started: null, done: null, workers: [], undoneAt: 0, doneSrc: "" });
  }
  (checkoffRows || []).forEach(function(r) {
    var g = pbCleanId(pbField(r, "craa5_equipmentguid"));
    if (!g) return;
    var st = pbTrim(pbField(r, "craa5_status")).toLowerCase();
    var det = null;
    try {
      var raw = pbField(r, "craa5_details");
      det = raw ? typeof raw === "string" ? JSON.parse(raw) : raw : null;
    } catch (e) {
      det = null;
    }
    var started = pbMs(pbField(r, "craa5_startedat"));
    if (started === null && det) started = pbMs(det.startedAt);
    var done = pbMs(pbField(r, "craa5_doneat"));
    if (done === null && det) done = pbMs(det.doneAt);
    var mod = pbMs(pbField(r, "modifiedon"));
    var p = get(g);
    if (st === "undone") {
      p.undoneAt = Math.max(p.undoneAt, mod || done || started || 0);
      return;
    }
    if (started !== null && started >= from && started <= to && (p.started === null || started < p.started)) p.started = started;
    if (st === "done" && done !== null && done >= from && done <= to && (p.done === null || done > p.done)) {
      p.done = done;
      p.doneSrc = "ganttly";
    }
    hubSplitGuids(pbField(r, "craa5_employeeguids")).forEach(function(id) {
      if (p.workers.indexOf(id) < 0) p.workers.push(id);
    });
  });
  (boards || []).forEach(function(b) {
    (b.work || []).forEach(function(w) {
      var p = out[w.guid];
      if (!p) return;
      w.workers.forEach(function(id) {
        if (p.workers.indexOf(id) < 0) p.workers.push(id);
      });
    });
  });
  pbKeys(out).forEach(function(g) {
    var p = out[g];
    if (p.undoneAt && (p.done === null || p.done <= p.undoneAt)) {
      p.done = null;
      p.doneSrc = "";
    }
  });
  return out;
}
function pbGroupProgress(group, idx) {
  var out = { total: 0, done: 0, started: null, finished: null, lastDone: null, workers: [] };
  (group && group.pieces || []).forEach(function(pc) {
    out.total++;
    var p = idx[pc.asset.id];
    if (!p) return;
    var s = p.started !== null ? p.started : p.done;
    if (s !== null && (out.started === null || s < out.started)) out.started = s;
    if (p.done !== null) {
      out.done++;
      if (out.lastDone === null || p.done > out.lastDone) out.lastDone = p.done;
    }
    p.workers.forEach(function(id) {
      if (out.workers.indexOf(id) < 0) out.workers.push(id);
    });
  });
  if (out.total > 0 && out.done === out.total) out.finished = out.lastDone;
  return out;
}
function pbRateFor(rows, day, role) {
  var want = pbCanon(role);
  var order = [want].concat(PB_RATE_FALLBACK.map(pbCanon)).filter(function(x, i, a) {
    return !!x && a.indexOf(x) === i;
  });
  var best = null;
  (rows || []).forEach(function(r) {
    if (pbNum(pbField(r, "statecode")) === 1) return;
    var rate = pbNum(pbField(r, "craa5_hourlyrate"));
    if (rate === null || rate <= 0) return;
    var from = hubDayFromDateOnly(pbField(r, "craa5_effectivefrom"));
    if (!from || from > String(day || "")) return;
    var rl = pbCanon(pbField(r, "craa5_role")) || "all";
    var i = order.indexOf(rl);
    if (i < 0) return;
    var score = order.length - i;
    if (!best || score > best.score || score === best.score && from > best.from) best = { rate, from, role: pbTrim(pbField(r, "craa5_role")) || "All", score, exact: i === 0 && !!want };
  });
  return best;
}
function pbRateBook(rows, weekend) {
  var cache = {};
  function get(role, day) {
    var d = day || weekend || "";
    var k = pbCanon(role) + "|" + d;
    if (!(k in cache)) cache[k] = pbRateFor(rows, d, role || PB_RATE_FALLBACK[0]);
    return cache[k];
  }
  function roles() {
    var seen = {};
    var out = [];
    (rows || []).forEach(function(r) {
      var n = pbTrim(pbField(r, "craa5_role"));
      var c = pbCanon(n);
      if (!c || seen[c]) return;
      seen[c] = 1;
      var g = get(n, weekend);
      if (g && g.exact) out.push(n);
    });
    return out;
  }
  return {
    def: function(day) {
      return get(PB_RATE_FALLBACK[0], day);
    },
    forEmp: function(emp, day) {
      return get(emp && emp.roleName ? emp.roleName : PB_RATE_FALLBACK[0], day);
    },
    roles,
    // { cost (null = no rate for that day), noRole, noRoleIds (people at the fallback rate), noPeople (1 = nobody named on the row), noRate (1 = no rate for its day) }
    rowCost: function(x, empById) {
      var out = { cost: 0, noRole: 0, noRoleIds: [], noPeople: 0, noRate: 0 };
      if (x.minutes === null || x.minutes <= 0) return out;
      var ppl = x.people || [];
      var sum = 0;
      var ok = true;
      if (!ppl.length) {
        var rr = get(PB_RATE_FALLBACK[0], x.day);
        out.noPeople = 1;
        if (rr) out.cost = hubLaborCost(x.minutes, rr.rate);
        else {
          out.cost = null;
          out.noRate = 1;
        }
        return out;
      }
      ppl.forEach(function(pid) {
        var em = empById ? empById[pid] : null;
        var r = get(em && em.roleName ? em.roleName : PB_RATE_FALLBACK[0], x.day);
        if (!r) {
          ok = false;
          return;
        }
        if (!(em && em.roleName) || !r.exact) {
          out.noRole++;
          out.noRoleIds.push(pid);
        }
        sum += x.minutes / ppl.length * r.rate / 60;
      });
      if (ok) out.cost = Math.round(sum * 100) / 100;
      else {
        out.cost = null;
        out.noRate = 1;
        out.noRole = 0;
        out.noRoleIds = [];
      }
      return out;
    }
  };
}
function pbNormLog(r) {
  var id = pbCleanId(pbField(r, "__id"));
  var asset = pbCleanId(pbField(r, "craa5_equipmentguid"));
  var day = pbTrim(pbField(r, "craa5_shiftdate")) || hubDayFromDateOnly(pbField(r, "craa5_lastcleaned"));
  var kind = hubCleanKind(pbField(r, "craa5_cleankind"));
  var key = pbTrim(pbField(r, "craa5_completionkey"));
  return {
    id,
    asset,
    day,
    kind,
    key,
    baseKey: key ? key.replace(/\|[2-9]$/, "") : hubCompletionKey(asset, day, kind) || id,
    doneAt: pbMs(pbField(r, "craa5_doneat")),
    minutes: pbNum(pbField(r, "craa5_laborminutes")),
    people: hubSplitGuids(pbField(r, "craa5_employeeguids")),
    names: pbTrim(pbField(r, "craa5_lastcleanedby")),
    area: pbTrim(pbField(r, "craa5_area")),
    source: pbTrim(pbField(r, "craa5_source")),
    active: pbNum(pbField(r, "statecode")) !== 1
  };
}
var PB_CP_STATUS = { ok: "On track", tight: "Tight", short: "Short of people", overlap: "Overlaps a run", nocrew: "No crew", none: "Nothing to do" };
function pbNormPlanRow(r) {
  var det = null;
  try {
    var raw = pbField(r, "craa5_details");
    det = raw ? typeof raw === "string" ? JSON.parse(raw) : raw : null;
  } catch (e) {
    det = null;
  }
  return {
    id: pbCleanId(pbField(r, "__id") || pbField(r, "craa5___1_p_cleanplanid")),
    rowtype: pbTrim(pbField(r, "craa5_rowtype")).toLowerCase(),
    planKey: pbTrim(pbField(r, "craa5_plankey")),
    lineKey: pbCanon(pbField(r, "craa5_linekey")),
    start: pbMs(pbField(r, "craa5_start")),
    end: pbMs(pbField(r, "craa5_end")),
    day: hubDayFromDateOnly(pbField(r, "craa5_day")),
    kind: hubCleanKind(pbField(r, "craa5_cleankind")),
    rawKind: pbTrim(pbField(r, "craa5_cleankind")).toLowerCase(),
    minutes: pbNum(pbField(r, "craa5_minutes")),
    status: pbTrim(pbField(r, "craa5_status")).toLowerCase(),
    reason: pbTrim(pbField(r, "craa5_reason")),
    area: pbTrim(pbField(r, "craa5_area")),
    line: pbInt(pbField(r, "craa5_line"), 1) || 1,
    areaId: pbCleanId(pbField(r, "craa5_mssareaguid")),
    details: det && typeof det === "object" ? det : null,
    active: pbNum(pbField(r, "statecode")) !== 1,
    // An open stop (no next run yet: plan key w|<run>|last, details.open): craa5_end is where the plan ends, never a restart.
    open: /\|last$/i.test(pbTrim(pbField(r, "craa5_plankey"))) || !!(det && typeof det === "object" && det.open)
  };
}
var PB_SCOPE_COLS = ["id", "name", "area", "room", "mins", "heads", "offsetMins", "leftOutBy"];
function pbScopePart(x) {
  var d = x.details || {};
  var n = pbInt(d.part, 0);
  if (!n) {
    var kp = String(x.planKey || "").split("|");
    n = pbInt(kp[kp.length - 1], 0);
  }
  return n || 0;
}
function pbPlanScope(rows, key) {
  var want = "s|" + pbTrim(key).toLowerCase() + "|";
  var all = [];
  (rows || []).forEach(function(x) {
    if (x.rowtype === "scope" && x.active && String(x.planKey || "").toLowerCase().indexOf(want) === 0) all.push(x);
  });
  if (!all.length) return null;
  all.sort(function(a, b) {
    return pbScopePart(a) - pbScopePart(b);
  });
  var first = null;
  all.forEach(function(x) {
    if (!first && x.details && Array.isArray(x.details.pieces)) first = x.details;
  });
  if (!first) return { key: pbTrim(key), parts: pbInt((all[0].details || {}).parts, 0) || all.length, found: 0, complete: false, hash: "", pieces: [], byId: {}, left: 0 };
  var expected = pbInt(first.parts, 0) || all.length;
  var hash = pbTrim(first.hash);
  var cols = Array.isArray(first.cols) && first.cols.length ? first.cols : PB_SCOPE_COLS;
  var pieces = [];
  var byId = {};
  var seen = {};
  var left = 0;
  var found = {};
  var nFound = 0;
  all.forEach(function(x) {
    var det = x.details;
    var pn = pbScopePart(x);
    if (!det || !Array.isArray(det.pieces) || pn < 1 || pn > expected || found[pn]) return;
    if (hash && pbTrim(det.hash) !== hash) return;
    found[pn] = 1;
    nFound++;
    det.pieces.forEach(function(row) {
      if (!Array.isArray(row)) return;
      var o = {};
      cols.forEach(function(c, i2) {
        o[c] = row[i2];
      });
      var id = pbCleanId(o.id);
      if (!id || seen[id]) return;
      seen[id] = 1;
      var pc = { id, name: pbTrim(o.name), area: pbTrim(o.area), room: pbTrim(o.room), mins: pbNum(o.mins), heads: pbNum(o.heads), offsetMins: pbNum(o.offsetMins) || 0, leftOutBy: pbTrim(o.leftOutBy) };
      pieces.push(pc);
      byId[id] = pc;
      if (pc.leftOutBy) left++;
    });
  });
  var complete = true;
  for (var i = 1; i <= expected; i++) if (!found[i]) complete = false;
  return { key: pbTrim(key), parts: expected, found: nFound, complete, hash, pieces, byId, left };
}
var PB_ALERT_LABEL = { over72: "Over 72 h without a Midweek clean", noeow: "No End of Week clean this week", apart: "Highspeed and Custard both scheduled" };
function pbPlanAlerts(rows, frame) {
  var from = pbAt(pbAddDays(frame.sat, -5), 0);
  var to = frame.readEnd;
  var out = [];
  var plantWeek = pbYmd(pbAddDays(frame.sat, -5));
  var spell = {};
  (rows || []).forEach(function(x) {
    if (x.area) {
      var k = x.lineKey || pbCanon(hubLineKey(x.area, x.line));
      if (k && !spell[k]) spell[k] = { area: x.area, line: x.line };
    }
  });
  (rows || []).forEach(function(x) {
    if (x.rowtype !== "alert" || !x.active || x.start === null || x.end === null) return;
    var kp = String(x.planKey || "").split("|");
    var kind = x.rawKind || pbTrim(kp[1]).toLowerCase();
    var det = x.details || {};
    var week = "";
    if (kind === "noeow") {
      week = pbTrim(det.week) || pbTrim(kp[3]);
      if (week ? week !== plantWeek : x.end <= from || x.start >= pbAt(pbAddDays(frame.sat, 2), 0)) return;
    } else if (x.end <= from || x.start >= to) return;
    if (pbPlanWeekState(rows, x.start) !== "done") return;
    var lines = [];
    if (kind === "apart") lines = (Array.isArray(det.lines) ? det.lines : []).map(function(s) {
      return pbCanon(s);
    }).filter(Boolean);
    else if (kp[2]) lines = [pbCanon(kp[2])];
    if (!lines.length && x.lineKey) lines = [x.lineKey];
    var spelled = lines.map(function(k) {
      return spell[k] || null;
    });
    out.push({ id: x.id, kind, known: !!PB_ALERT_LABEL[kind], status: x.status === "approved" ? "approved" : "open", start: x.start, end: x.end, minutes: x.minutes, week, lines, spelled, area: x.area, label: PB_ALERT_LABEL[kind] || kind, details: det, reason: x.reason });
  });
  out.sort(function(a, b) {
    return a.start - b.start || String(a.kind).localeCompare(String(b.kind));
  });
  return out;
}
function pbPlanWeekState(weeks, t) {
  var w = null;
  (weeks || []).forEach(function(x) {
    if (x.rowtype === "week" && x.active && x.start !== null && x.end !== null && t >= x.start && t < x.end) w = x;
  });
  return !w ? "missing" : w.status === "done" ? "done" : "writing";
}
function pbPlanWindow(rows, lineKey, frame) {
  var best = null;
  var bestOv = 0;
  (rows || []).forEach(function(x) {
    if (x.rowtype !== "window" || !x.active || x.start === null || x.end === null || x.end <= x.start) return;
    if (x.lineKey !== lineKey && hubLineKey(x.area, x.line) !== lineKey) return;
    var ov = Math.min(x.end, frame.focusEnd) - Math.max(x.start, frame.focusStart);
    if (ov > bestOv) {
      bestOv = ov;
      best = x;
    }
  });
  var state = pbPlanWeekState(rows, best ? best.start : frame.focusStart);
  return { row: best, state, used: !!best && state === "done" };
}
var PB_BLUE = "#0072CE";
var PB_NAVY = "#00468B";
var PB_GOLD = "#FFB81C";
var PB_DEPT_COLOR = { SAN: "#0072CE", MNT: "#FF8200", FSQ: "#7C3AED", OPS: "#64748B" };
var PB_STATUS_CHIP = {
  ok: { label: "On track", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  tight: { label: "Tight", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  late: { label: "Overdue", cls: "bg-red-50 text-red-700 border-red-200" },
  // the clean ends after the restart (Late means attendance, data contract 9)
  norestart: { label: "No restart set", cls: "bg-slate-100 text-slate-600 border-slate-200" }
};
var PB_THEME = {
  light: { page: "#F1F5F9", text: "#1E293B" },
  // HUB_COLORS light / dark bg and text (data contract 10)
  dark: { page: "#1B2740", text: "#E2E8F0" }
};
var PB_DARK_RULES = [
  ["bg-white", "background-color:#24324D"],
  ["bg-slate-50", "background-color:#1E2A42"],
  ["bg-slate-100", "background-color:#2B3A57"],
  ["bg-slate-200", "background-color:#33425F"],
  ["bg-[#E6F1FB]", "background-color:#1E2A42"],
  ["bg-[#FFF6E0]", "background-color:#3A3320"],
  ["bg-emerald-50", "background-color:rgba(16,185,129,0.14)"],
  ["bg-amber-50", "background-color:rgba(245,158,11,0.14)"],
  ["bg-red-50", "background-color:rgba(239,68,68,0.15)"],
  ["bg-pink-50", "background-color:rgba(236,72,153,0.15)"],
  ["bg-violet-50", "background-color:rgba(139,92,246,0.15)"],
  ["text-slate-400", "color:#7C8BA5"],
  ["text-slate-500", "color:#94A3B8"],
  ["text-slate-600", "color:#A9B6CA"],
  ["text-slate-700", "color:#CBD5E1"],
  ["text-slate-800", "color:#E2E8F0"],
  ["text-slate-900", "color:#F1F5F9"],
  ["text-[#00468B]", "color:#B3D4F2"],
  ["text-[#0072CE]", "color:#4DA3E8"],
  ["text-[#7A5600]", "color:#FFD27A"],
  ["text-emerald-700", "color:#6EE7B7"],
  ["text-emerald-800", "color:#A7F3D0"],
  ["text-amber-700", "color:#FCD34D"],
  ["text-amber-800", "color:#FDE68A"],
  ["text-red-600", "color:#F87171"],
  ["text-red-700", "color:#FCA5A5"],
  ["text-red-800", "color:#FECACA"],
  ["text-pink-700", "color:#F9A8D4"],
  ["text-violet-700", "color:#C4B5FD"],
  ["border-slate-100", "border-color:#2B3A57"],
  ["border-slate-200", "border-color:#33425F"],
  ["border-slate-300", "border-color:#3E4F6E"],
  ["border-slate-400", "border-color:#475569"],
  ["border-[#B3D4F2]", "border-color:#2B4E78"],
  ["border-[#FFB81C]", "border-color:#B7860F"],
  ["border-emerald-200", "border-color:#1F5A47"],
  ["border-amber-200", "border-color:#6B5418"],
  ["border-red-200", "border-color:#6B2A2A"],
  ["border-pink-200", "border-color:#6B2A50"],
  ["border-violet-200", "border-color:#4C3A7A"],
  ["hover:bg-slate-50", "background-color:#2B3A57", 1],
  ["hover:bg-slate-100", "background-color:#33425F", 1],
  ["hover:bg-[#E6F1FB]", "background-color:#2B3A57", 1],
  ["hover:bg-red-50", "background-color:rgba(239,68,68,0.2)", 1]
];
function pbCssEsc(cls) {
  return cls.replace(/([\[\]#\/:.%(),])/g, "\\$1");
}
function pbStyleText() {
  var out = [
    ".pb-root{color-scheme:light}",
    ".pb-root.pb-dark{color-scheme:dark}",
    ".pb-root ::-webkit-scrollbar{width:12px;height:12px}",
    ".pb-root ::-webkit-scrollbar-track{background:rgba(148,163,184,0.15)}",
    ".pb-root ::-webkit-scrollbar-thumb{background:#94A3B8;border-radius:8px;border:2px solid transparent;background-clip:padding-box}",
    ".pb-root ::-webkit-scrollbar-thumb:hover{background:#64748B;background-clip:padding-box}",
    ".pb-root *{scrollbar-width:auto;scrollbar-color:#94A3B8 rgba(148,163,184,0.15)}",
    ".pb-root .pb-tabs::-webkit-scrollbar{height:6px}",
    ".pb-dark input,.pb-dark select,.pb-dark textarea{background-color:#1B2740;color:#E2E8F0;border-color:#3E4F6E}",
    ".pb-dark .divide-slate-100>:not([hidden])~:not([hidden]){border-color:#2B3A57}",
    ".pb-printonly{display:none}",
    "@media print{.pb-noprint{display:none!important}.pb-printonly{display:block!important}.pb-root{height:auto!important;overflow:visible!important}}"
  ];
  PB_DARK_RULES.forEach(function(r) {
    var sel = ".pb-dark ." + pbCssEsc(r[0]) + (r[2] ? ":hover" : "");
    out.push(sel + "{" + r[1] + "}");
  });
  return out.join("\n");
}
function pbEnsureStyles(onResult) {
  if (typeof document === "undefined") return;
  var st = document.getElementById("pbed-style");
  if (!st) {
    st = document.createElement("style");
    st.id = "pbed-style";
    document.head.appendChild(st);
  }
  st.textContent = pbStyleText();
  var w = window;
  if (!document.getElementById("tailwind-cdn")) {
    var sc = document.createElement("script");
    sc.id = "tailwind-cdn";
    sc.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(sc);
  }
  var t0 = Date.now();
  var failed = false;
  var timer = setInterval(function() {
    if (w.tailwind) {
      clearInterval(timer);
      onResult(true);
    } else if (!failed && Date.now() - t0 > 8e3) {
      failed = true;
      onResult(false);
    } else if (Date.now() - t0 > 12e4) clearInterval(timer);
  }, 250);
}
var PB_ICON_PATH = {
  star: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z",
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  lock: "M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11",
  unlock: "M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 6.8-1.2",
  check: "M4 12.5l5 5L20 6.5",
  clock: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
};
function PbIcon(props) {
  var fill = props.fill ? "currentColor" : "none";
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: props.size || 16, height: props.size || 16, fill, stroke: "currentColor", strokeWidth: props.fill ? 1 : 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: props.className || "", style: props.style }, /* @__PURE__ */ React.createElement("path", { d: PB_ICON_PATH[props.name] || "" }));
}
function PbStar(props) {
  var on = !!props.on;
  var icon = /* @__PURE__ */ React.createElement(PbIcon, { name: "star", fill: on, size: props.size || 16, style: { color: on ? PB_GOLD : "#94A3B8" } });
  if (!props.onClick) return on ? /* @__PURE__ */ React.createElement("span", { title: pbT("Key goalpost"), className: "inline-flex shrink-0" }, icon) : null;
  return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: props.onClick, "aria-pressed": on, title: on ? pbT("Key goalpost: click to unstar") : pbT("Star as a key goalpost"), className: "inline-flex shrink-0 p-1 rounded hover:bg-slate-100" }, icon);
}
function PbChip(props) {
  return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap " + (props.cls || "bg-slate-100 text-slate-600 border-slate-200"), title: props.title || "" }, props.children);
}
function PbStatusChip(props) {
  var s = PB_STATUS_CHIP[props.status] || PB_STATUS_CHIP.norestart;
  var slack = props.slack !== null && props.slack !== void 0 ? " (" + (props.slack >= 0 ? props.filled ? pbT("{t} spare, given to maintenance", { t: pbFmtHours(props.slack) }) : pbT("{t} spare", { t: pbFmtHours(props.slack) }) : pbT("{t} over", { t: pbFmtHours(-props.slack) })) + ")" : "";
  return /* @__PURE__ */ React.createElement(PbChip, { cls: s.cls, title: props.title }, pbT(s.label), slack);
}
var PB_GOAL_CHIP = {
  hit: { label: "Hit", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  missed: { label: "Missed", cls: "bg-red-50 text-red-700 border-red-200" },
  overdue: { label: "Overdue", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  open: { label: "Open", cls: "bg-slate-100 text-slate-600 border-slate-200" }
};
function PbGoalChip(props) {
  var g = PB_GOAL_CHIP[props.state] || PB_GOAL_CHIP.open;
  return /* @__PURE__ */ React.createElement(PbChip, { cls: g.cls }, pbT(g.label));
}
function PbBtn(props) {
  var kind = props.kind || "plain";
  var cls = kind === "primary" ? "bg-[#0072CE] hover:bg-[#00468B] text-white border-transparent" : kind === "danger" ? "bg-white hover:bg-red-50 text-red-700 border-red-200" : kind === "ghost" ? "bg-transparent hover:bg-slate-100 text-slate-600 border-transparent" : "bg-white hover:bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]";
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      disabled: props.disabled,
      onClick: props.onClick,
      title: props.title || "",
      "aria-label": props.label || void 0,
      "aria-pressed": props.pressed,
      className: "min-h-[36px] px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 " + cls + " " + (props.className || "")
    },
    props.children
  );
}
function PbCard(props) {
  return /* @__PURE__ */ React.createElement("section", { className: "bg-white rounded-xl border border-slate-200 shadow-sm " + (props.className || ""), style: props.accent ? { borderTop: "4px solid " + props.accent } : void 0 }, props.title && /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 px-4 py-3 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("h2", { className: "text-sm font-black text-[#00468B] uppercase tracking-widest flex-1 min-w-[160px] inline-flex items-center gap-2" }, props.icon, props.title), props.right), /* @__PURE__ */ React.createElement("div", { className: props.pad === false ? "" : "p-4" }, props.children));
}
function PbModal(props) {
  var downOnBack = useRef(false);
  var closeRef = useRef(props.onClose);
  closeRef.current = props.onClose;
  useEffect(function() {
    function onKey(e) {
      if (e.key === "Escape") closeRef.current();
    }
    window.addEventListener("keydown", onKey);
    return function() {
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-2 sm:p-6", style: { overflowY: "auto" }, onMouseDown: function(e) {
    downOnBack.current = e.target === e.currentTarget;
  }, onClick: function(e) {
    if (downOnBack.current && e.target === e.currentTarget) props.onClose();
  } }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-2xl w-full " + (props.wide ? "max-w-4xl" : "max-w-2xl") + " my-4", onClick: function(e) {
    e.stopPropagation();
  }, role: "dialog", "aria-label": props.title }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3 px-5 py-4 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-black text-[#00468B] break-words" }, props.title), props.sub && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-0.5" }, props.sub)), props.head, /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: props.onClose, title: pbT("Close") }, pbT("Close"))), /* @__PURE__ */ React.createElement("div", { className: "p-5 space-y-4" }, props.children)));
}
function PbNote(props) {
  var tone = props.tone || "info";
  var cls = tone === "warn" ? "bg-amber-50 border-amber-200 text-amber-800" : tone === "bad" ? "bg-red-50 border-red-200 text-red-800" : tone === "good" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-[#E6F1FB] border-[#B3D4F2] text-[#00468B]";
  return /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border px-3 py-2 text-sm " + cls + " " + (props.className || "") }, props.children);
}
function PbNumInput(props) {
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      inputMode: "decimal",
      value: props.value === null || props.value === void 0 ? "" : props.value,
      min: props.min,
      step: props.step || 1,
      placeholder: props.placeholder || "",
      onChange: function(e) {
        var v = e.target.value;
        props.onChange(v === "" ? null : Number(v));
      },
      className: "border border-slate-300 rounded-lg px-2 py-1 text-sm w-24 " + (props.className || ""),
      "aria-label": props.label || ""
    }
  );
}
function PbTextSave(props) {
  var st = useState(props.value || "");
  var v = st[0];
  var last = useRef(props.value || "");
  useEffect(function() {
    if ((props.value || "") !== last.current) {
      last.current = props.value || "";
      st[1](props.value || "");
    }
  }, [props.value]);
  function commit() {
    if (v !== (props.value || "")) {
      last.current = v;
      props.onSave(v);
    }
  }
  var printed = v ? /* @__PURE__ */ React.createElement("div", { className: "pb-printonly whitespace-pre-wrap text-sm " + (props.className || "") }, v) : null;
  if (props.rows) return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("textarea", { rows: props.rows, className: "pb-noprint block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm " + (props.className || ""), value: v, placeholder: props.placeholder || "", "aria-label": props.label || "", onChange: function(e) {
    st[1](e.target.value);
  }, onBlur: commit }), printed);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { className: "pb-noprint border border-slate-300 rounded-lg px-2 py-1 text-sm " + (props.className || ""), value: v, placeholder: props.placeholder || "", "aria-label": props.label || "", onChange: function(e) {
    st[1](e.target.value);
  }, onBlur: commit, onKeyDown: function(e) {
    if (e.key === "Enter") commit();
  } }), printed);
}
function PbStepper(props) {
  var v = props.value || 0;
  return /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-1" }, /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
    props.onChange(Math.max(props.min || 1, v - 1));
  }, title: pbT("One less") }, "-"), /* @__PURE__ */ React.createElement("span", { className: "min-w-[40px] text-center text-lg font-black text-slate-800", "data-stepper-value": "1" }, v), /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
    props.onChange(v + 1);
  }, title: pbT("One more") }, "+"));
}
function PbDot(props) {
  return /* @__PURE__ */ React.createElement("span", { className: "inline-block w-2.5 h-2.5 rounded-sm shrink-0", style: { backgroundColor: PB_DEPT_COLOR[props.dept] || "#94A3B8" } });
}
function PbSourceLine(props) {
  var s = props.src || {};
  var word = pbLoadWord(s);
  var state = pbT(word) + (s.rows && s.rows.length ? " (" + pbTn(s.rows.length, "{n} row", "{n} rows") + ")" : "");
  return /* @__PURE__ */ React.createElement("tr", { className: "border-t border-slate-100 align-top" }, /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-3 font-semibold text-slate-700" }, props.label, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-normal text-slate-400" }, props.owner)), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-3 font-mono text-xs text-slate-500 break-all" }, s.table || props.names), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-3 text-sm " + (word === "Ready" ? "text-emerald-700" : word === "Loading" || word === "Nothing here yet" ? "text-slate-500" : "text-amber-700") }, state, s.droppedSelect ? " " + pbT("(read with all columns)") : ""), /* @__PURE__ */ React.createElement("td", { className: "py-2 text-xs text-slate-500 break-words" }, [props.note, s.err, s.scopeErr].filter(Boolean).join(" ")));
}
function PbStat(props) {
  var tone = props.tone === "bad" ? "text-red-700" : props.tone === "warn" ? "text-amber-700" : props.tone === "good" ? "text-emerald-700" : "text-slate-500";
  var bar = props.tone === "bad" ? "#DC2626" : props.tone === "warn" ? "#D97706" : props.tone === "good" ? "#059669" : "#CBD5E1";
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3", style: { borderLeft: "4px solid " + bar } }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, props.label), /* @__PURE__ */ React.createElement("div", { className: (props.big ? "text-3xl" : "text-xl") + " font-black text-slate-800 mt-1 break-words" }, props.value), props.sub && /* @__PURE__ */ React.createElement("div", { className: "text-xs mt-0.5 " + tone }, props.sub));
}
function pbNormWo(r) {
  return {
    id: pbCleanId(pbField(r, "__id")),
    order: pbTrim(pbField(r, "craa5_name")),
    priority: pbTrim(pbField(r, "craa5_priority")),
    description: pbTrim(pbField(r, "craa5_description")),
    assetDesc: pbTrim(pbField(r, "craa5_assetdescription")),
    orderType: pbTrim(pbField(r, "craa5_ordertype")),
    floc: pbTrim(pbField(r, "craa5_functionallocation")).toUpperCase(),
    basicStart: pbMs(pbField(r, "craa5_basicstart")),
    workCenter: pbTrim(pbField(r, "craa5_workcenter")),
    sortField: pbTrim(pbField(r, "craa5_sortfield")),
    assetId: pbCleanId(pbField(r, "craa5_assetguid")),
    equipment: pbTrim(pbField(r, "craa5_equipment")),
    areaKey: pbTrim(pbField(r, "craa5_areakey")),
    plannedHours: pbNum(pbField(r, "craa5_plannedhours")),
    weekendKey: pbTrim(pbField(r, "craa5_weekendkey")),
    status: pbTrim(pbField(r, "craa5_status")) || "Open",
    raw: r
  };
}
function pbNormMap(r) {
  return { id: pbCleanId(pbField(r, "__id")), key: pbTrim(pbField(r, "craa5_name") || pbField(r, "craa5__p_flocmap1")), floc: pbTrim(pbField(r, "craa5_functionallocation")).toUpperCase(), assetDesc: pbTrim(pbField(r, "craa5_assetdescription")), assetId: pbCleanId(pbField(r, "craa5_assetguid")), equipment: pbTrim(pbField(r, "craa5_equipment")), areaKey: pbTrim(pbField(r, "craa5_areakey")) };
}
function pbNormActual(r) {
  return { id: pbCleanId(pbField(r, "__id")), areaKey: pbTrim(pbField(r, "craa5_areakey")), stepKey: pbTrim(pbField(r, "craa5_stepkey")), stepName: pbTrim(pbField(r, "craa5_stepname")), actualStart: pbMs(pbField(r, "craa5_actualstart")), actualEnd: pbMs(pbField(r, "craa5_actualend")), plannedStart: pbMs(pbField(r, "craa5_plannedstart")), plannedEnd: pbMs(pbField(r, "craa5_plannedend")), headcount: pbNum(pbField(r, "craa5_headcount")), notes: pbTrim(pbField(r, "craa5_notes")), by: pbTrim(pbField(r, "craa5_updatedby")) };
}
function pbNormLoss(r) {
  var d = {};
  try {
    var raw = pbField(r, "craa5_data");
    d = raw ? typeof raw === "string" ? JSON.parse(raw) : raw : {};
  } catch (e) {
    d = {};
  }
  return { id: pbCleanId(pbField(r, "__id")), name: pbTrim(pbField(r, "craa5_name")), at: pbMs(pbField(r, "craa5_occurredon")), minutes: pbNum(pbField(r, "craa5_minuteslost")) || 0, reason: pbTrim(pbField(r, "craa5_reason")), description: pbTrim(pbField(r, "craa5_description")), step: pbTrim(pbField(r, "craa5_equipment")), area: pbTrim(pbField(r, "craa5_area")), dept: pbTrim(pbField(r, "craa5_department")), crew: pbTrim(pbField(r, "craa5_crew")), by: pbTrim(pbField(r, "craa5_loggedby")), weekend: d.weekend || "", areaKey: d.areaKey || pbCanon(pbField(r, "craa5_area")), stepKey: d.stepKey || "", heads: pbNum(d.heads) || 1, app: d.app || "" };
}
function pbBlockName(b) {
  if (b.kind === "sub") return b.name === "(no subcategory)" ? pbT(b.name) : (b.order !== null && b.order !== void 0 ? b.order + ". " : "") + b.name.replace(/^\s*\d+(\.\d+)?\s*[-.]?\s*/, "");
  if (b.kind === "step") return pbTName(b.name);
  return b.name;
}
var PB_LOSS_REASONS = ["Late production handoff", "Maintenance overrun", "Equipment breakdown", "Short staffed", "Waiting on FSQ", "Failed inspection or swab (re-clean)", "Chemical or supplies", "Water, steam or utilities", "Other"];
var PB_LOSS_DEPTS = ["Operations", "Maintenance", "Quality (FSQ)", "Warehouse", "Sanitation", "Other"];
function pbPresets(plan, config) {
  var p = plan && plan.presets;
  return { pre: p && Array.isArray(p.pre) ? p.pre : config.pre, tail: p && Array.isArray(p.tail) ? p.tail : config.tail, own: !!(p && (Array.isArray(p.pre) || Array.isArray(p.tail))) };
}
function pbBuildModel(d, plan, config, weekend) {
  var frame = pbWeekendFrame(weekend);
  var assets = (d.assets.rows || []).map(pbNormAsset);
  var areas = pbGroupAreas(assets);
  var runs = (d.runs.rows || []).map(pbNormRun);
  var runsBy = pbRunsByArea(runs, areas);
  var allEmployees = (d.employees.rows || []).map(pbNormEmployee).filter(function(e) {
    return e.id || e.name;
  });
  pbFillRoleNames(allEmployees, pbRoleNames(d.roles && d.roles.rows ? d.roles.rows : null));
  var employees = allEmployees.filter(function(e) {
    return e.active;
  });
  var empById = {};
  allEmployees.forEach(function(e) {
    empById[e.id] = e;
  });
  var rateBook = pbRateBook(d.laborrate && d.laborrate.rows ? d.laborrate.rows : null, weekend);
  var boards = d.boards || [];
  var wos = (d.workorder.rows || []).map(pbNormWo);
  var progress = pbProgressIndex(d.checkoff.rows || [], boards, frame.readStart, frame.readEnd);
  var assetById = {};
  assets.forEach(function(a) {
    assetById[a.id] = a;
  });
  var logs = (d.msslog && d.msslog.rows ? d.msslog.rows : []).map(pbNormLog).filter(function(x) {
    return x.active && x.asset;
  });
  var dayFrom = hubPlantDay(frame.focusStart);
  var dayTo = hubPlantDay(frame.focusEnd);
  var cpSrc = d.cleanplan || {};
  var planRows = (cpSrc.rows || []).map(pbNormPlanRow).filter(function(x) {
    return x.active;
  });
  var planState = cpSrc.rows ? pbPlanWeekState(planRows, frame.focusStart) : cpSrc.err || cpSrc.kind ? "unread" : "loading";
  var planNote = planState === "unread" ? pbT("The clean plan could not be read ({why}), so stops and restarts come from the production runs.", { why: pbT(pbLoadWord(cpSrc)) }) : planState === "missing" ? pbT("The Scheduler has not published a clean plan for this week yet, so stops and restarts come from the production runs.") : planState === "writing" ? pbT("The clean plan for this week is still being published, so stops and restarts come from the production runs for now.") : "";
  var secondWeekend = pbIsSecondWeekend(weekend);
  var pl = plan.lines || {};
  var presets = pbPresets(plan, config);
  var keys = pbKeys(areas);
  pbKeys(runsBy).forEach(function(k) {
    if (keys.indexOf(k) < 0 && runsBy[k].some(function(r) {
      return r.end > frame.readStart && r.start < frame.readEnd;
    })) keys.push(k);
  });
  var order = config.lineOrder || [];
  var lines = keys.map(function(k) {
    var p = pl[k] || {};
    var area = areas[k] || null;
    var win = pbFindWindow(runsBy[k] || [], frame);
    var hasRuns = !!(runsBy[k] && runsBy[k].length);
    var cp = pbPlanWindow(planRows, k, frame);
    var cpRow = cp.used ? cp.row : null;
    var include = p.include !== void 0 ? !!p.include : (!!cpRow || hasRuns && win.status !== "runsthrough") && !!area;
    var stop = p.stop !== void 0 && p.stop !== null ? p.stop : cpRow ? cpRow.start : win.stop;
    var cpRestart = cpRow && !cpRow.open ? cpRow.end : null;
    var restart = p.restart !== void 0 && p.restart !== null ? p.restart : cpRestart !== null ? cpRestart : win.restart;
    var stopFrom = p.stop !== void 0 && p.stop !== null ? "hand" : cpRow ? "plan" : win.stop !== null ? "runs" : "";
    var restartFrom = p.restart !== void 0 && p.restart !== null ? "hand" : cpRestart !== null ? "plan" : win.restart !== null ? "runs" : "";
    var cpAllergen = cpRow ? cpRow.kind === "allergen" || !!(cpRow.details && cpRow.details.allergen) : null;
    var allergen = p.allergen !== void 0 && p.allergen !== null ? !!p.allergen : cpAllergen !== null ? cpAllergen : !!(win.prev && win.prev.allergen);
    var scopeMeta = cpRow && cpRow.details && cpRow.details.scope && cpRow.details.scope.key ? cpRow.details.scope : null;
    var cpScope = scopeMeta ? pbPlanScope(planRows, scopeMeta.key) : null;
    var scopeUsed = !!(cpScope && cpScope.complete);
    var scopeUpdating = !!(scopeUsed && scopeMeta.hash && cpScope.hash && cpScope.hash !== scopeMeta.hash);
    var ms = pbMilestones(area, { exclude: p.exclude || [], keep: p.keep || [], scope: scopeUsed ? cpScope.byId : null, excludeOnDemand: config.excludeOnDemand, monthlyRule: config.monthlyRule, secondWeekend, allergen });
    var scopeWords = [];
    ms.left.forEach(function(x) {
      if (x.why === "plan" && x.word && scopeWords.indexOf(pbTName(x.word)) < 0) scopeWords.push(pbTName(x.word));
    });
    var lineWos = wos.filter(function(w) {
      return w.areaKey === k && w.weekendKey === weekend && !/^(closed|done|cancel)/i.test(w.status);
    });
    var woMin = pbSum(lineWos, function(w) {
      return (w.plannedHours || 0) * 60;
    });
    var mntMinutes = p.mntMinutes !== void 0 && p.mntMinutes !== null ? p.mntMinutes : woMin;
    var workMin = pbSum(ms.groups, function(g) {
      return g.totalMin;
    });
    var pieces = pbSum(ms.groups, function(g) {
      return g.pieces.length;
    });
    var pFrom = stop !== null && stop !== void 0 ? Math.max(frame.readStart, stop - 6 * PB_HOUR) : frame.readStart;
    var pTo = restart !== null && restart !== void 0 ? Math.min(frame.readEnd, restart + 6 * PB_HOUR) : frame.readEnd;
    var lineProg = pbProgressIndex(d.checkoff.rows || [], boards, pFrom, pTo);
    var done = 0;
    ms.groups.forEach(function(g) {
      g.prog = pbGroupProgress(g, lineProg);
      g.done = g.prog.done;
      done += g.prog.done;
    });
    var lFrom = stop !== null && stop !== void 0 ? stop - 6 * PB_HOUR : frame.focusStart;
    var lTo = restart !== null && restart !== void 0 ? restart + 6 * PB_HOUR : frame.focusEnd;
    var log = { pieces: 0, entries: 0, cleans: {}, minutes: 0, std: 0, noStd: 0, people: {}, rows: [], cost: 0, costOk: true, noRole: 0, noRoleIds: {}, noPeople: 0, noRate: 0 };
    logs.forEach(function(x) {
      var a = assetById[x.asset];
      if (!a || a.areaKey !== k) return;
      if (x.doneAt !== null ? x.doneAt < lFrom || x.doneAt > lTo : !x.day || x.day < dayFrom || x.day > dayTo) return;
      log.entries++;
      log.rows.push(x);
      if (!log.cleans[x.baseKey]) {
        log.cleans[x.baseKey] = 1;
        log.pieces++;
        var sm = hubStdMinutes(a.minutes);
        if (sm !== null) log.std += sm;
        else log.noStd++;
      }
      if (x.minutes !== null && x.minutes > 0) log.minutes += x.minutes;
      x.people.forEach(function(pid) {
        log.people[pid] = 1;
      });
      var rc = rateBook.rowCost(x, empById);
      if (rc.cost === null) log.costOk = false;
      else log.cost += rc.cost;
      log.noRole += rc.noRole;
      rc.noRoleIds.forEach(function(pid) {
        log.noRoleIds[pid] = 1;
      });
      log.noPeople += rc.noPeople;
      log.noRate += rc.noRate;
    });
    var srcHand = pbT("set by hand");
    var srcSched = pbT("production schedule");
    var srcPlan = pbT("clean plan");
    var srcOf = function(from) {
      return from === "hand" ? srcHand : from === "plan" ? srcPlan : from === "runs" ? srcSched : "";
    };
    return {
      progress: lineProg,
      log,
      key: k,
      name: area ? area.name : runsBy[k] && runsBy[k][0] ? runsBy[k][0].area + (runsBy[k][0].line > 1 ? " " + pbT("line {n}", { n: runsBy[k][0].line }) : "") : k,
      area,
      rooms: area ? area.rooms : [],
      hasAssets: !!area,
      hasRuns,
      win,
      include,
      stop,
      restart,
      stopFrom,
      restartFrom,
      stopSrc: srcOf(stopFrom),
      restartSrc: srcOf(restartFrom),
      cp,
      cpRow,
      cpNote: cpRow ? "" : planState === "done" ? pbT("The clean plan has no stop for this line this weekend.") : planNote,
      scope: cpScope,
      scopeLeft: ms.left.filter(function(x) {
        return x.why === "plan";
      }).length,
      scopeWords: scopeWords.join(", "),
      scopeUpdating,
      // The window names a scope that is not (fully) here: still being published, or not read at all (then the Plan tab's planWarn says why).
      scopeNote: scopeMeta && !scopeUsed && !(cpSrc.err && !cpScope) ? pbT("Scope rows missing ({found} of {parts}): the Scheduler is still publishing this clean, so no piece is left out yet.", { found: cpScope ? cpScope.found : 0, parts: cpScope ? cpScope.parts : pbInt(scopeMeta.parts, 0) || 1 }) : "",
      allergen,
      allergenSrc: p.allergen !== void 0 && p.allergen !== null ? srcHand : cpRow && cpAllergen ? srcPlan : win.prev && win.prev.allergen ? pbT("last run {what}", { what: win.prev.allergenType || pbT("allergen") }) : "",
      ms,
      workMin,
      pieces,
      done,
      wos: lineWos,
      woMin,
      mntMinutes,
      mntAfter: p.mntAfter || "auto",
      sanWaits: p.sanWaits !== false,
      mntFill: p.mntFill !== void 0 && p.mntFill !== null ? !!p.mntFill : !!(config && config.mntFill),
      hc: p.hc || {},
      people: p.people || {},
      crewSet: p.crew,
      ignoreCap: !!p.ignoreCap,
      stepMin: p.stepMin || {},
      note: p.note || "",
      goalNotes: p.goalNotes || {},
      stars: p.stars || {},
      rank: order.indexOf(k) >= 0 ? order.indexOf(k) : 1e3
    };
  });
  lines.sort(function(a, b) {
    return a.rank - b.rank || (a.restart || 9e15) - (b.restart || 9e15) || a.name.localeCompare(b.name);
  });
  var slotFrom = frame.focusStart - 12 * PB_HOUR;
  var slotTo = frame.readEnd;
  var incl = lines.filter(function(l) {
    return l.include && l.stop !== null;
  });
  if (incl.length) {
    slotFrom = Math.min(slotFrom, Math.min.apply(null, incl.map(function(l) {
      return l.stop;
    })) - PB_HOUR);
  }
  var rawSlots = pbShiftSlots(d.workshift.rows || [], slotFrom, slotTo);
  var shiftHc = plan.shiftHc || {};
  var slots = rawSlots.map(function(s) {
    var hc = pbSlotHeadcount(s, employees, boards, shiftHc[String(s.start)]);
    return { start: s.start, end: s.end, crews: s.crews, key: s.key, hc, cap: s.crews.length ? hc.value : 0 };
  });
  var slotsOk = slots.length > 0 && slots.some(function(s) {
    return s.crews.length;
  });
  function capAt(t) {
    if (!slotsOk) return Infinity;
    for (var i = 0; i < slots.length; i++) if (t >= slots[i].start && t < slots[i].end) return slots[i].cap;
    return 0;
  }
  function slotAt(t) {
    for (var i = 0; i < slots.length; i++) if (t >= slots[i].start && t < slots[i].end) return slots[i];
    return null;
  }
  var share = pbCrewShare(incl, capAt);
  var inputs = incl.map(function(l) {
    l.crew = l.crewSet !== void 0 && l.crewSet !== null ? l.crewSet : share[l.key];
    l.crewSrc = l.crewSet !== void 0 && l.crewSet !== null ? pbT("set by hand") : share[l.key] ? pbT("share of the people on shift when it stops") : pbT("no headcount known");
    function withMin(list) {
      return (list || []).map(function(st) {
        var o = pbClone(st);
        if (l.stepMin[st.id] !== void 0 && l.stepMin[st.id] !== null) o.minutes = l.stepMin[st.id];
        return o;
      });
    }
    return { key: l.key, name: l.name, stop: l.stop, restart: l.restart, groups: l.ms.groups, hc: l.hc, crew: l.crew, mntAfter: l.mntAfter, mntMinutes: l.mntMinutes, sanWaits: l.sanWaits, mntFill: l.mntFill, woCount: l.wos.length, pre: withMin(presets.pre), tail: withMin(presets.tail), ignoreCap: l.ignoreCap };
  });
  var sched = pbSchedule(inputs, slotsOk ? slots : null, config);
  lines.forEach(function(l) {
    l.sched = sched.lines[l.key] || null;
  });
  var actuals = {};
  (d.milestone.rows || []).map(pbNormActual).forEach(function(a) {
    var k = a.areaKey + "|" + a.stepKey;
    if (!actuals[k]) actuals[k] = a;
  });
  var act = {};
  incl.forEach(function(l) {
    if (!l.sched) return;
    l.sched.blocks.forEach(function(b) {
      var star = l.stars[b.id];
      b.key = star !== void 0 && star !== null ? !!star : b.kind === "step" ? !!b.keyPreset || pbKeyByName(b.name, config.keyGoals) : pbKeyByName(b.kind === "mnt" ? "Maintenance PM/CM" : b.name, config.keyGoals);
      b.note = l.goalNotes[b.id] || "";
      var man = actuals[l.key + "|" + b.id] || null;
      var auto = b.kind === "sub" && b.group && b.group.prog ? b.group.prog : null;
      var o = {
        id: man ? man.id : null,
        notes: man ? man.notes : "",
        manual: man,
        auto,
        actualStart: man && man.actualStart !== null ? man.actualStart : auto ? auto.started : null,
        actualEnd: man && man.actualEnd !== null ? man.actualEnd : auto ? auto.finished : null,
        headcount: man && man.headcount !== null ? man.headcount : auto && auto.workers.length ? auto.workers.length : null
      };
      o.startSrc = man && man.actualStart !== null ? "manual" : o.actualStart !== null ? "auto" : "";
      o.endSrc = man && man.actualEnd !== null ? "manual" : o.actualEnd !== null ? "auto" : "";
      act[l.key + "|" + b.id] = o;
    });
  });
  var winFrom = incl.length ? Math.min.apply(null, incl.map(function(l) {
    return l.stop;
  })) : frame.focusStart;
  var winTo = incl.length ? Math.max.apply(null, incl.map(function(l) {
    return Math.max(l.restart || 0, l.sched ? l.sched.finish : 0);
  })) : frame.focusEnd;
  var use = slotsOk ? pbSlotUse(sched, slots.filter(function(s) {
    return s.crews.length && s.end > winFrom && s.start < winTo;
  })) : [];
  var laborMin = pbSum(incl, function(l) {
    return l.sched ? l.sched.laborMin : 0;
  });
  var rateRow = rateBook.def();
  var rate = rateRow ? rateRow.rate : null;
  var losses = (d.timeloss.rows || []).map(pbNormLoss).filter(function(x) {
    return !x.weekend || x.weekend === weekend;
  });
  var maps = {};
  (d.flocmap.rows || []).map(pbNormMap).forEach(function(mp) {
    if (mp.key) maps[mp.key] = mp;
  });
  function onBoard(areaKey, t) {
    var best = null;
    boards.forEach(function(b) {
      if (b.src === "plan" || b.start === null) return;
      var e = b.end !== null ? b.end : b.start + 12 * PB_HOUR;
      if (t < b.start - PB_HOUR || t > e) return;
      if (!best || (b.savedAt || 0) > (best.savedAt || 0)) best = b;
    });
    if (!best) return null;
    var ids = best.byArea[areaKey] || [];
    if (!ids.length) pbKeys(best.byArea).forEach(function(k) {
      if (!ids.length && (k.indexOf(areaKey) === 0 || areaKey.indexOf(k) === 0)) ids = best.byArea[k];
    });
    return { ids, src: best.src, crew: best.crew };
  }
  var keyBlocks = [];
  incl.forEach(function(l) {
    if (l.sched) l.sched.blocks.forEach(function(b) {
      if (b.key) keyBlocks.push({ l, b });
    });
  });
  keyBlocks.sort(function(a, b) {
    return a.b.end - b.b.end;
  });
  return {
    frame,
    weekend,
    secondWeekend,
    assets,
    areas,
    runs,
    runsBy,
    employees,
    empById,
    lines,
    included: incl,
    slots,
    slotsOk,
    capAt,
    slotAt,
    sched,
    use,
    laborMin,
    rate,
    rateRow,
    rateBook,
    rateRoles: rateBook.roles(),
    cost: rate !== null ? laborMin / 60 * rate : null,
    logs,
    late: incl.filter(function(l) {
      return l.sched && l.sched.status === "late";
    }).length,
    tight: incl.filter(function(l) {
      return l.sched && l.sched.status === "tight";
    }).length,
    wos,
    maps,
    actuals,
    act,
    losses,
    progress,
    boards,
    onBoard,
    presets,
    keyBlocks,
    notes: plan.notes || "",
    planRows,
    planState,
    planNote,
    planWarn: cpSrc.rows && cpSrc.err ? cpSrc.err : "",
    alerts: pbPlanAlerts(planRows, frame).map(function(a) {
      a.lineNames = a.lines.map(function(k, i) {
        var l = null;
        lines.forEach(function(x) {
          if (x.key === k) l = x;
        });
        if (l) return l.name;
        if (areas[k]) return areas[k].name;
        var sp = a.spelled[i] || (runsBy[k] && runsBy[k][0] ? { area: runsBy[k][0].area, line: runsBy[k][0].line } : null);
        return sp ? sp.area + (sp.line > 1 ? " " + pbT("line {n}", { n: sp.line }) : "") : k;
      }).join(" + ");
      return a;
    })
  };
}
function pbGoalState(b, a, now) {
  if (a && a.actualEnd !== null && a.actualEnd !== void 0) return a.actualEnd <= b.end ? "hit" : "missed";
  return now > b.end ? "overdue" : "open";
}
function pbDebrief(m, now) {
  var t = now || Date.now();
  var lines = [];
  var rows = [];
  m.included.forEach(function(l) {
    var s = l.sched;
    if (!s) return;
    var clean = s.blocks.filter(function(b) {
      return b.kind === "sub" || b.kind === "mnt";
    });
    var subs = s.blocks.filter(function(b) {
      return b.kind === "sub";
    });
    var mntDone = clean.every(function(b) {
      if (b.kind !== "mnt") return true;
      var a = m.act[l.key + "|" + b.id];
      return !!(a && a.actualEnd !== null);
    });
    var cmp = mntDone ? clean : subs;
    var planClean = cmp.length ? Math.max.apply(null, cmp.map(function(b) {
      return b.end;
    })) : null;
    var recorded = subs.filter(function(b) {
      var a = m.act[l.key + "|" + b.id];
      return a && a.actualEnd !== null;
    });
    var allDone = subs.length > 0 && recorded.length === subs.length;
    var ends = cmp.map(function(b) {
      var a = m.act[l.key + "|" + b.id];
      return a && a.actualEnd !== null ? a.actualEnd : null;
    }).filter(function(x) {
      return x !== null;
    });
    var actClean = allDone && ends.length ? Math.max.apply(null, ends) : null;
    var chainBlocks = s.blocks.filter(function(b) {
      return b.kind !== "step" || b.anchor !== "restart";
    });
    var lastChain = chainBlocks.length ? chainBlocks.reduce(function(a, b) {
      return b.end > a.end ? b : a;
    }) : null;
    var lastAct = lastChain ? m.act[l.key + "|" + lastChain.id] : null;
    var ready = lastAct && lastAct.actualEnd !== null ? lastAct.actualEnd : actClean !== null && planClean !== null ? actClean + (s.finish - planClean) : null;
    var readyProjected = !(lastAct && lastAct.actualEnd !== null);
    var worst = null;
    s.blocks.forEach(function(b) {
      var a = m.act[l.key + "|" + b.id];
      var varMin = a && a.actualEnd !== null ? (a.actualEnd - b.end) / PB_MIN : null;
      var durVar = a && a.actualEnd !== null && a.actualStart !== null && a.actualEnd >= a.actualStart ? (a.actualEnd - a.actualStart - (b.end - b.start)) / PB_MIN : null;
      var heads = a && a.headcount ? a.headcount : b.hc || 1;
      var r = { l, b, a, varMin, durVar, heads, state: pbGoalState(b, a, t) };
      rows.push(r);
      if (b.dept === "SAN" && durVar !== null && durVar > 0 && (!worst || durVar > worst.durVar)) worst = r;
    });
    lines.push({
      l,
      planClean,
      actClean,
      cleanDelta: actClean !== null && planClean !== null ? (actClean - planClean) / PB_MIN : null,
      done: recorded.length,
      total: subs.length,
      restart: l.restart,
      ready,
      readyProjected,
      readyGap: ready !== null && l.restart ? (l.restart - ready) / PB_MIN : null,
      worst
    });
  });
  var keys = rows.filter(function(r) {
    return r.b.key;
  });
  var keyHit = keys.filter(function(r) {
    return r.state === "hit";
  }).length;
  var keyMissed = keys.filter(function(r) {
    return r.state === "missed" || r.state === "overdue";
  });
  var labPlan = 0;
  var labAct = 0;
  var labN = 0;
  rows.forEach(function(r) {
    if (r.b.kind !== "sub" || !r.a || r.a.actualStart === null || r.a.actualEnd === null || r.a.actualEnd < r.a.actualStart) return;
    labN++;
    labPlan += r.b.hc * r.b.minutes / 60;
    labAct += r.heads * (r.a.actualEnd - r.a.actualStart) / PB_HOUR;
  });
  var logN = 0;
  var logMin = 0;
  var logStd = 0;
  var logNoStd = 0;
  var logPeople = {};
  var logCostSum = 0;
  var logCostOk = true;
  var logNoRoleIds = {};
  var logNoPeople = 0;
  var logNoRate = 0;
  m.included.forEach(function(l) {
    var g = l.log;
    if (!g) return;
    logN += g.pieces;
    logMin += g.minutes;
    logStd += g.std;
    logNoStd += g.noStd;
    pbKeys(g.people).forEach(function(p) {
      logPeople[p] = 1;
    });
    if (!g.costOk) logCostOk = false;
    logCostSum += g.cost || 0;
    pbKeys(g.noRoleIds || {}).forEach(function(pid) {
      logNoRoleIds[pid] = 1;
    });
    logNoPeople += g.noPeople || 0;
    logNoRate += g.noRate || 0;
  });
  var logNoRole = pbKeys(logNoRoleIds).length;
  var logPace = hubPace(logStd, logMin);
  var logCost = m.rate !== null && logMin > 0 && logCostOk ? Math.round(logCostSum * 100) / 100 : null;
  var losses = m.losses;
  var lossMin = pbSum(losses, function(x) {
    return x.minutes;
  });
  var lossPH = pbSum(losses, function(x) {
    return x.minutes * (x.heads || 1);
  }) / 60;
  var byReason = {};
  var byDept = {};
  losses.forEach(function(x) {
    var k = x.reason || "Other";
    byReason[k] = (byReason[k] || 0) + x.minutes * (x.heads || 1) / 60;
    var dk = x.dept || "Other";
    byDept[dk] = (byDept[dk] || 0) + x.minutes * (x.heads || 1) / 60;
  });
  var reasonList = pbKeys(byReason).map(function(k) {
    return { what: k, hours: byReason[k] };
  }).sort(function(a, b) {
    return b.hours - a.hours;
  });
  var deptList = pbKeys(byDept).map(function(k) {
    return { what: k, hours: byDept[k] };
  }).sort(function(a, b) {
    return b.hours - a.hours;
  });
  var idle = pbSum(m.use, function(u) {
    return u.idleHours || 0;
  });
  var spare = m.use.map(function(u) {
    return { u, spare: u.slot.cap - u.peak };
  });
  var mostSpare = spare.filter(function(x) {
    return x.spare > 0;
  }).sort(function(a, b) {
    return (b.u.idleHours || 0) - (a.u.idleHours || 0);
  })[0] || null;
  var short = spare.filter(function(x) {
    return x.spare < 0;
  }).sort(function(a, b) {
    return a.spare - b.spare;
  })[0] || null;
  var overrunPH = pbSum(rows, function(r) {
    return r.b.dept === "SAN" && r.durVar !== null && r.durVar > 0 ? r.durVar * r.heads / 60 : 0;
  });
  var costs = [];
  reasonList.forEach(function(x) {
    costs.push({ what: pbT("Time loss: {reason}", { reason: pbT(x.what) }), hours: x.hours });
  });
  rows.forEach(function(r) {
    if (r.durVar !== null && r.durVar > 15 && r.b.dept === "SAN") costs.push({ what: pbT("Overran: {line} - {step}", { line: r.l.name, step: pbBlockName(r.b) }), hours: r.durVar * r.heads / 60 });
  });
  if (idle > 0) costs.push({ what: pbT("People on shift but not booked on a weekend clean"), hours: idle });
  costs.sort(function(a, b) {
    return b.hours - a.hours;
  });
  var take = [];
  var lateLines = lines.filter(function(x) {
    return x.cleanDelta !== null && x.cleanDelta > 0;
  }).sort(function(a, b) {
    return b.cleanDelta - a.cleanDelta;
  });
  var doneLines = lines.filter(function(x) {
    return x.actClean !== null;
  });
  if (doneLines.length) take.push(pbT("{hit} of {n} lines finished the clean on plan.", { hit: doneLines.length - lateLines.length, n: doneLines.length }) + (lateLines.length ? " " + pbT("Worst: {line}, {late} late{why}.", { line: lateLines[0].l.name, late: pbFmtHours(lateLines[0].cleanDelta), why: lateLines[0].worst ? pbT(" ({step} ran {over} over)", { step: pbBlockName(lateLines[0].worst.b), over: pbFmtHours(lateLines[0].worst.durVar) }) : "" }) : ""));
  var notReady = lines.filter(function(x) {
    return x.readyGap !== null && x.readyGap < 0;
  });
  if (notReady.length) take.push(pbT("Not ready for the restart: {lines}.", { lines: notReady.map(function(x) {
    return x.l.name + " (" + pbFmtHours(-x.readyGap) + ")";
  }).join(", ") }));
  if (keys.length) take.push(pbT("{hit} of {n} key goalposts hit.", { hit: keyHit, n: keys.length }) + (keyMissed.length ? " " + pbT("Missed: {list}.", { list: keyMissed.slice(0, 3).map(function(r) {
    return r.l.name + " " + pbBlockName(r.b);
  }).join(", ") }) : ""));
  if (reasonList.length) take.push(pbT("Biggest time loss: {reason}, {ph} people-hours{money}.", { reason: pbT(reasonList[0].what), ph: pbFmtNum(reasonList[0].hours, 1), money: m.rate !== null ? " (" + pbFmtMoney(reasonList[0].hours * m.rate) + ")" : "" }));
  if (short) take.push(pbT("Crew {crew} ({when}) was {n} short at the busiest point of the plan.", { crew: short.u.slot.key, when: pbFmtDayTime(short.u.slot.start), n: -short.spare }));
  if (mostSpare) take.push(pbT("Crew {crew} ({when}) had {n} more on shift than the plan needed at its busiest: {ph} people-hours not booked.", { crew: mostSpare.u.slot.key, when: pbFmtDayTime(mostSpare.u.slot.start), n: mostSpare.spare, ph: pbFmtNum(mostSpare.u.idleHours, 1) }));
  return {
    lines,
    rows,
    keys,
    keyHit,
    keyMissed,
    labPlan,
    labAct,
    labN,
    lossMin,
    lossPH,
    reasons: reasonList,
    depts: deptList,
    idle,
    overrunPH,
    costs,
    take,
    logN,
    logMin,
    logStd,
    logNoStd,
    logPace,
    logCost,
    logNoRole,
    logNoPeople,
    logNoRate,
    logPeople: pbKeys(logPeople).length,
    recorded: rows.filter(function(r) {
      return r.a && r.a.actualEnd !== null;
    }).length,
    unsavedAuto: rows.filter(function(r) {
      return r.a && r.a.auto && (r.a.startSrc === "auto" && (!r.a.manual || r.a.manual.actualStart === null) || r.a.endSrc === "auto" && (!r.a.manual || r.a.manual.actualEnd === null));
    })
  };
}
function pbBriefGoal(b) {
  return b.kind !== "step" || b.anchor !== "chain" || b.milestone || b.dept !== "SAN" || b.key || !!b.note;
}
function pbBriefText(m) {
  var out = [pbT("PBED brief - weekend of {date}", { date: pbFmtDate(m.frame.sat.getTime()) })];
  if (m.notes) {
    out.push("");
    out.push(m.notes);
  }
  if (m.keyBlocks.length) {
    out.push("");
    out.push(pbT("KEY GOALPOSTS"));
    m.keyBlocks.forEach(function(k) {
      out.push("  * " + pbFmtDayTime(k.b.end) + "  " + k.l.name + ": " + pbBlockName(k.b) + (k.b.note ? " - " + k.b.note : ""));
    });
  }
  m.included.forEach(function(l) {
    var s = l.sched;
    out.push("");
    out.push(l.name + ": " + pbT("stops {stop}, restarts {restart}", { stop: pbFmtDayTime(l.stop), restart: pbFmtDayTime(l.restart) }) + (s ? ", " + pbT("clean done {at} ({status})", { at: pbFmtDayTime(s.finish), status: pbT((PB_STATUS_CHIP[s.status] || {}).label || "") }) : ""));
    if (l.note) out.push("  " + pbT("Note") + ": " + l.note);
    if (s) s.blocks.forEach(function(b) {
      if (pbBriefGoal(b)) out.push("  " + (b.key ? "* " : "- ") + pbFmtDayTime(b.end) + "  " + pbBlockName(b) + (b.hc ? " (" + pbTn(b.hc, "{n} person", "{n} people") + ")" : "") + (b.note ? " - " + b.note : ""));
    });
  });
  if (m.slotsOk) {
    out.push("");
    out.push(pbT("Headcount by shift (needed at peak / on shift):"));
    m.use.forEach(function(u) {
      if (u.peak || u.slot.cap) out.push("  - " + u.slot.key + " " + pbFmtDayTime(u.slot.start) + ": " + u.peak + " / " + u.slot.cap);
    });
  }
  return out.join("\n");
}
var PB_CREW_BG = { A: "#E0F2FE", B: "#DCFCE7", C: "#FEF3C7", D: "#EDE9FE" };
function pbBlockLabel(b) {
  return pbBlockName(b);
}
function pbDeptName(d) {
  return pbT(PB_DEPT_NAME[d] || d);
}
function PbGantt(props) {
  var m = props.m;
  var pxh = props.pxh || 28;
  var incl = m.included;
  var nowState = useState(Date.now());
  useEffect(function() {
    var t2 = setInterval(function() {
      nowState[1](Date.now());
    }, 6e4);
    return function() {
      clearInterval(t2);
    };
  }, []);
  if (!incl.length) return /* @__PURE__ */ React.createElement(PbNote, null, pbT("No line is in the plan for this weekend. Lines join when the production schedule shows them stopping for the weekend, or add one on the Other areas list below."));
  var t0 = Math.min.apply(null, incl.map(function(l) {
    return l.stop;
  })) - 2 * PB_HOUR;
  var t1 = Math.max.apply(null, incl.map(function(l) {
    return Math.max(l.restart || 0, l.sched ? l.sched.finish : 0, l.stop + 12 * PB_HOUR);
  })) + 3 * PB_HOUR;
  t0 = Math.floor(t0 / PB_HOUR) * PB_HOUR;
  t1 = Math.min(t1, t0 + 6 * PB_DAY);
  var hours = Math.ceil((t1 - t0) / PB_HOUR);
  var width = hours * pxh;
  function x(ms) {
    return (ms - t0) / PB_HOUR * pxh;
  }
  var ticks = [];
  for (var h = 0; h <= hours; h++) {
    var t = t0 + h * PB_HOUR;
    var d = new Date(t);
    ticks.push({ t, x: h * pxh, day: d.getHours() === 0, label: d.getHours() % 6 === 0 });
  }
  var now = nowState[0];
  var nowX = now > t0 && now < t1 ? x(now) : null;
  var LABEL_W = 210;
  function row(content, label, key, tall, onLabel) {
    return /* @__PURE__ */ React.createElement("div", { key, className: "flex border-t border-slate-100", style: { minWidth: LABEL_W + width } }, /* @__PURE__ */ React.createElement("div", { className: "sticky left-0 z-10 bg-white border-r border-slate-200 shrink-0 px-2 py-1 text-xs", style: { width: LABEL_W }, onClick: onLabel }, label), /* @__PURE__ */ React.createElement("div", { className: "relative shrink-0", style: { width, height: tall ? 46 : 30 } }, ticks.map(function(tk) {
      return tk.day ? /* @__PURE__ */ React.createElement("div", { key: tk.t, className: "absolute top-0 bottom-0 border-l border-slate-300", style: { left: tk.x } }) : null;
    }), nowX !== null && /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 bottom-0", style: { left: nowX, borderLeft: "2px solid #E4002B", opacity: 0.55 } }), content));
  }
  function blockEl(l, b, single) {
    var left = x(b.start);
    var w = Math.max(b.milestone ? 0 : 3, x(b.end) - left);
    var col = PB_DEPT_COLOR[b.dept] || "#94A3B8";
    var title = pbTName(b.name) + " - " + pbFmtDayTime(b.start) + " " + pbT("to") + " " + pbFmtDayTime(b.end) + (b.hc ? " - " + pbTn(b.hc, "{n} person", "{n} people") : "") + (b.over ? " - " + pbT("not enough people free") : "") + (b.key ? " - " + pbT("Key goalpost") : "") + ". " + pbT("Double click for details.");
    var a = m.act[l.key + "|" + b.id];
    var actEl = a && a.actualStart !== null ? (function() {
      var ae = a.actualEnd !== null ? a.actualEnd : Math.min(now, t1);
      var ax = x(a.actualStart);
      var aw = Math.max(3, x(ae) - ax);
      var late = a.actualEnd !== null ? a.actualEnd > b.end : now > b.end;
      return /* @__PURE__ */ React.createElement("div", { key: b.id + ":a", className: "absolute rounded-sm", style: { left: ax, width: aw, top: single ? 26 : 41, height: 4, backgroundColor: late ? "#DC2626" : "#059669", opacity: a.actualEnd !== null ? 1 : 0.6 }, title: pbT("Actual") + ": " + pbFmtDayTime(a.actualStart) + " - " + (a.actualEnd !== null ? pbFmtDayTime(a.actualEnd) : pbT("in progress")) });
    })() : null;
    var ring = b.key ? "0 0 0 2px " + PB_GOLD : void 0;
    if (b.milestone) {
      return [/* @__PURE__ */ React.createElement("div", { key: b.id, title, onDoubleClick: function() {
        props.onOpen(l, b);
      }, className: "absolute cursor-pointer", style: { left: left - 7, top: single ? 8 : 15, width: 14, height: 14, transform: "rotate(45deg)", backgroundColor: b.key ? PB_GOLD : col, border: "2px solid white", boxShadow: "0 0 0 1px " + col } }), actEl];
    }
    return [/* @__PURE__ */ React.createElement(
      "div",
      {
        key: b.id,
        title,
        "data-pb-block": l.key + "|" + b.id,
        onDoubleClick: function() {
          props.onOpen(l, b);
        },
        className: "absolute rounded text-[10px] leading-tight font-bold text-white overflow-hidden whitespace-nowrap px-1 cursor-pointer select-none " + (b.over ? "ring-2 ring-red-500" : ""),
        style: { left, width: w, top: single ? 4 : 6, height: single ? 22 : 34, backgroundColor: col, opacity: b.kind === "step" ? 0.8 : 1, boxShadow: ring }
      },
      /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-0.5" }, b.key && w > 16 ? /* @__PURE__ */ React.createElement(PbIcon, { name: "star", fill: true, size: 10, style: { color: PB_GOLD } }) : null, w > 26 ? b.kind === "sub" ? (b.order !== null && b.order !== void 0 ? b.order : "") + (b.hc ? " - " + b.hc + "p" : "") : b.dept === "MNT" ? "MNT" : "" : ""),
      !single && w > 70 && /* @__PURE__ */ React.createElement("div", { className: "font-normal opacity-90 truncate" }, pbBlockName(b))
    ), actEl];
  }
  var expanded = props.expanded || {};
  var rows = [];
  rows.push(row(m.slots.filter(function(s) {
    return s.end > t0 && s.start < t1;
  }).map(function(s) {
    var l = Math.max(0, x(s.start));
    var r = Math.min(width, x(s.end));
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.start,
        onDoubleClick: function() {
          props.onSlot(s);
        },
        title: pbT("Crew {crew} {from} to {to}: {n} people. Double click to change.", { crew: s.key || pbT("none"), from: pbFmtDayTime(s.start), to: pbFmtDayTime(s.end), n: s.cap }),
        className: "absolute top-1 bottom-1 rounded border border-white text-[10px] font-bold px-1 overflow-hidden whitespace-nowrap cursor-pointer",
        style: { left: l, width: Math.max(2, r - l), backgroundColor: PB_CREW_BG[s.crews[0]] || "#F1F5F9", color: "#334155" }
      },
      s.key ? s.key + " - " + s.cap : pbT("no crew")
    );
  }), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-500" }, pbT("Crew on shift - people")), "shift"));
  incl.forEach(function(l) {
    var s = l.sched;
    if (!s) return;
    var marks = [
      /* @__PURE__ */ React.createElement("div", { key: "stop", className: "absolute top-0 bottom-0 border-l-2 border-slate-800", style: { left: x(l.stop), borderColor: "#475569" }, title: pbT("Production stops {at}", { at: pbFmtDayTime(l.stop) }) }),
      l.restart ? /* @__PURE__ */ React.createElement("div", { key: "rs", className: "absolute top-0 bottom-0 border-l-2 border-dashed border-red-600", style: { left: x(l.restart) }, title: pbT("Production restarts {at}", { at: pbFmtDayTime(l.restart) }) }) : null
    ];
    var blocks = [];
    s.blocks.forEach(function(b) {
      blocks = blocks.concat(blockEl(l, b));
    });
    rows.push(row(
      marks.concat(blocks),
      /* @__PURE__ */ React.createElement("div", { className: "cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 w-3" }, expanded[l.key] ? "-" : "+"), /* @__PURE__ */ React.createElement("span", { className: "font-black text-slate-800 truncate" }, l.name)), /* @__PURE__ */ React.createElement("div", { className: "pl-4 mt-0.5" }, /* @__PURE__ */ React.createElement(PbStatusChip, { status: s.status, slack: s.slack, filled: s.filled }))),
      "l:" + l.key,
      true,
      function() {
        props.onToggle(l.key);
      }
    ));
    if (expanded[l.key]) s.blocks.forEach(function(b) {
      rows.push(row(blockEl(l, b, true), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 pl-4 truncate", title: pbTName(b.name) }, /* @__PURE__ */ React.createElement(PbDot, { dept: b.dept }), /* @__PURE__ */ React.createElement("span", { className: "truncate text-slate-600" }, pbBlockName(b)), b.key ? /* @__PURE__ */ React.createElement(PbStar, { on: true, size: 12 }) : null), "b:" + l.key + b.id));
    });
  });
  var sch = m.sched;
  var bars = [];
  if (sch && sch.used) {
    var maxv = 1;
    for (var i = 0; i < sch.nb; i++) {
      maxv = Math.max(maxv, sch.used[i], sch.cap[i] === Infinity ? 0 : sch.cap[i]);
    }
    for (var j = 0; j < sch.nb; j++) {
      var tt = sch.h0 + j * PB_BUCKET_MIN * PB_MIN;
      if (tt < t0 || tt >= t1) continue;
      var u = sch.used[j];
      var c = sch.cap[j];
      var bw = pxh / 4;
      if (c !== Infinity && c > 0) bars.push(/* @__PURE__ */ React.createElement("div", { key: "c" + j, className: "absolute bottom-0", style: { left: x(tt), width: bw, height: Math.round(40 * c / maxv), backgroundColor: "rgba(148,163,184,0.45)" } }));
      if (u) bars.push(/* @__PURE__ */ React.createElement("div", { key: "u" + j, className: "absolute bottom-0", style: { left: x(tt), width: bw, height: Math.round(40 * u / maxv), backgroundColor: c !== Infinity && u > c ? "#DC2626" : PB_BLUE }, title: pbFmtDayTime(tt) + ": " + pbT("{u} people working", { u }) + (c !== Infinity ? " " + pbT("of {c} on shift", { c }) : "") }));
    }
  }
  rows.push(row(bars, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-500" }, pbT("Sanitation people working (blue) and on shift (grey)")), "hc", true));
  return /* @__PURE__ */ React.createElement("div", { className: "border border-slate-200 rounded-lg", style: { overflowX: "auto", overflowY: "hidden" } }, /* @__PURE__ */ React.createElement("div", { className: "flex", style: { minWidth: LABEL_W + width } }, /* @__PURE__ */ React.createElement("div", { className: "sticky left-0 z-10 bg-slate-50 border-r border-slate-200 shrink-0", style: { width: LABEL_W } }), /* @__PURE__ */ React.createElement("div", { className: "relative bg-slate-50 shrink-0", style: { width, height: 34 } }, ticks.map(function(tk) {
    return tk.label ? /* @__PURE__ */ React.createElement("div", { key: tk.t, className: "absolute top-0 text-[10px] whitespace-nowrap pl-1 border-l " + (tk.day ? "border-slate-400 font-black text-slate-700" : "border-slate-200 text-slate-500"), style: { left: tk.x } }, tk.day ? pbFmtDate(tk.t) : "", /* @__PURE__ */ React.createElement("div", null, pbFmtTime(tk.t).replace(":00", ""))) : null;
  }), nowX !== null && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 text-[10px] font-bold px-1 rounded", style: { left: nowX + 2, color: "#E4002B" } }, pbT("now")))), rows);
}
function PbAlertsCard(props) {
  var m = props.m;
  return /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Clean plan alerts"), accent: "#F59E0B" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, pbT("From the Scheduler, for this plant week and the weekend. An alert is never a clean.")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-1.5 text-sm", "data-pb-alerts": m.alerts.length }, m.alerts.map(function(a) {
    var det = a.details || {};
    var bits = [];
    var wk = a.week && pbFromYmd(a.week) ? pbFromYmd(a.week).getTime() : a.start;
    if (a.kind === "noeow") bits.push(pbT("week of {date}", { date: pbFmtDate(wk) }));
    else bits.push(pbFmtDayTime(a.start) + " - " + pbFmtDayTime(a.end));
    if (a.kind === "over72" && a.minutes) bits.push(pbT("{n} min over the limit", { n: pbFmtNum(a.minutes) }));
    if (a.kind === "apart" && a.minutes) bits.push(pbT("{n} min of overlap", { n: pbFmtNum(a.minutes) }));
    if (a.kind === "over72" && pbNum(det.hours) !== null) bits.push(pbNum(det.limit) !== null ? pbT("{h} h run against a {limit} h limit", { h: pbFmtNum(det.hours, 1), limit: pbFmtNum(det.limit) }) : pbT("{h} h run", { h: pbFmtNum(det.hours, 1) }));
    if (a.status === "approved" && det.by) bits.push(det.why ? pbT("approved by {who}: {why}", { who: det.by, why: det.why }) : pbT("approved by {who}", { who: det.by }));
    return /* @__PURE__ */ React.createElement("li", { key: a.id, className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(PbChip, { cls: a.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200" }, a.status === "approved" ? pbT("approved") : pbT("needs a look")), /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-800" }, a.lineNames), /* @__PURE__ */ React.createElement("span", { title: a.reason || void 0 }, a.known ? pbT(a.label) : a.reason || a.label), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, bits.join("; ")));
  })));
}
function PbMilestoneTable(props) {
  var l = props.line;
  var s = l.sched;
  var m = props.m;
  if (!s) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-1" }), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Dept")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Milestone")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Start")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("End")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("People")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("Time")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("Labor")), /* @__PURE__ */ React.createElement("th", { className: "py-1" }))), /* @__PURE__ */ React.createElement("tbody", null, s.blocks.map(function(b) {
    return /* @__PURE__ */ React.createElement("tr", { key: b.id, className: "border-t border-slate-100 hover:bg-slate-50 cursor-pointer " + (b.key ? "bg-[#FFF6E0]" : ""), onDoubleClick: function() {
      props.onOpen(l, b);
    } }, /* @__PURE__ */ React.createElement("td", { className: "py-1 pr-1" }, /* @__PURE__ */ React.createElement(PbStar, { on: b.key, onClick: function() {
      props.act.star(l, b, !b.key);
    } })), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1 text-xs font-bold text-slate-600" }, /* @__PURE__ */ React.createElement(PbDot, { dept: b.dept }), b.dept)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 font-semibold text-slate-800" }, pbBlockName(b), b.over && /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-[11px] font-bold text-red-600" }, pbT("not enough people free")), b.waited ? /* @__PURE__ */ React.createElement("span", { className: "ml-2 text-[11px] text-amber-700" }, pbT("waits {t} for people", { t: pbFmtHours(b.waited) })) : null, b.note ? /* @__PURE__ */ React.createElement("div", { className: "text-xs font-normal text-slate-500" }, b.note) : null), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap" }, pbFmtDayTime(b.start)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap" }, pbFmtDayTime(b.end)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right" }, b.hc || ""), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right whitespace-nowrap" }, b.milestone ? "" : b.filled ? pbFmtHours(b.planned) + " + " + pbFmtHours(b.filled) : pbFmtHours(b.minutes)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right whitespace-nowrap" }, b.dept === "SAN" && b.hc ? pbFmtNum(b.hc * b.minutes / 60, 1) + " h" : ""), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-xs font-bold text-[#0072CE] hover:underline", onClick: function() {
      props.onOpen(l, b);
    } }, pbT("Details"))));
  }))));
}
function pbPlanHeadline(m) {
  if (!m.included.length) return pbT("No line is in the plan for this weekend yet.");
  var lastDone = Math.max.apply(null, m.included.map(function(l) {
    return l.sched ? l.sched.finish : 0;
  }));
  var restarts = m.included.filter(function(l) {
    return l.restart;
  }).map(function(l) {
    return l.restart;
  });
  var parts = [pbTn(m.included.length, "{n} line down this weekend.", "{n} lines down this weekend.")];
  parts.push(pbT("Last clean done {at}.", { at: pbFmtDayTime(lastDone) }));
  if (m.late) parts.push(pbTn(m.late, "{n} line will not be ready for its restart.", "{n} lines will not be ready for their restart."));
  else if (m.tight) parts.push(pbTn(m.tight, "{n} line has less than 2 hours to spare.", "{n} lines have less than 2 hours to spare."));
  else if (restarts.length) parts.push(pbT("Every line is ready with 2 hours or more to spare."));
  parts.push(pbT("{ph} sanitation people-hours{money}.", { ph: pbFmtNum(m.laborMin / 60, 1), money: m.cost !== null ? " (" + pbFmtMoney(m.cost) + ")" : "" }));
  return parts.join(" ");
}
function PbKeyStrip(props) {
  var m = props.m;
  var now = props.now || Date.now();
  if (!m.keyBlocks.length) return null;
  return /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Key goalposts"), icon: /* @__PURE__ */ React.createElement(PbIcon, { name: "star", fill: true, size: 16, style: { color: PB_GOLD } }), accent: PB_GOLD }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, m.keyBlocks.map(function(k) {
    var a = m.act[k.l.key + "|" + k.b.id];
    var st = pbGoalState(k.b, a, now);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k.l.key + k.b.id,
        type: "button",
        onDoubleClick: function() {
          props.act.openBlock(k.l, k.b);
        },
        title: pbT("Double click for details."),
        className: "text-left rounded-lg border border-[#FFB81C] bg-[#FFF6E0] px-3 py-2 min-w-[180px]"
      },
      /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-[#7A5600]" }, k.l.name),
      /* @__PURE__ */ React.createElement("div", { className: "font-black text-slate-800" }, pbBlockName(k.b)),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mt-1 text-xs text-slate-600" }, /* @__PURE__ */ React.createElement("span", null, pbT("by {at}", { at: pbFmtDayTime(k.b.end) })), /* @__PURE__ */ React.createElement(PbGoalChip, { state: st }))
    );
  })));
}
function PbPlanTab(props) {
  var m = props.m;
  var act = props.act;
  var expandedState = useState({});
  var expanded = expandedState[0];
  var setExpanded = expandedState[1];
  var zoomState = useState(24);
  var zoom = zoomState[0];
  var setZoom = zoomState[1];
  var showAllState = useState(false);
  function toggle(k) {
    var n = pbClone(expanded);
    n[k] = !n[k];
    setExpanded(n);
  }
  var peak = 0;
  m.use.forEach(function(u) {
    peak = Math.max(peak, u.peak);
  });
  var onShiftPeak = 0;
  m.use.forEach(function(u) {
    if (u.peak === peak) onShiftPeak = Math.max(onShiftPeak, u.slot.cap);
  });
  var others = m.lines.filter(function(l) {
    return !l.include;
  });
  var lastDone = m.included.length ? Math.max.apply(null, m.included.map(function(l) {
    return l.sched ? l.sched.finish : 0;
  })) : null;
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-xl px-4 py-3 text-white", style: { background: "linear-gradient(90deg," + PB_NAVY + "," + PB_BLUE + ")" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-widest opacity-80" }, pbT("This weekend in one line")), /* @__PURE__ */ React.createElement("div", { className: "text-base sm:text-lg font-bold mt-0.5", "data-headline": "plan" }, pbPlanHeadline(m))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3" }, /* @__PURE__ */ React.createElement(PbStat, { label: pbT("Lines in the plan"), value: m.included.length, sub: m.late ? pbT("{n} late", { n: m.late }) : m.tight ? pbT("{n} tight", { n: m.tight }) : pbT("none late"), tone: m.late ? "bad" : m.tight ? "warn" : "good" }), /* @__PURE__ */ React.createElement(PbStat, { label: pbT("First stop"), value: m.included.length ? pbFmtDayTime(Math.min.apply(null, m.included.map(function(l) {
    return l.stop;
  }))) : "--" }), /* @__PURE__ */ React.createElement(PbStat, { label: pbT("Last clean done"), value: lastDone ? pbFmtDayTime(lastDone) : "--" }), /* @__PURE__ */ React.createElement(PbStat, { label: pbT("Sanitation labor"), value: pbFmtNum(m.laborMin / 60, 1) + " h", sub: m.cost !== null ? pbT("{cost} at {rate}/h ({role})", { cost: pbFmtMoney(m.cost), rate: pbFmtMoney(m.rate), role: m.rateRow.role }) : pbT("no labor rate set") }), /* @__PURE__ */ React.createElement(PbStat, { label: pbT("Peak people needed"), value: m.slotsOk ? String(peak) : "--", sub: m.slotsOk ? pbT("of {n} on that shift", { n: onShiftPeak }) : pbT("shifts not read"), tone: m.slotsOk && peak > onShiftPeak ? "bad" : void 0 })), /* @__PURE__ */ React.createElement(PbKeyStrip, { m, act }), m.planNote ? /* @__PURE__ */ React.createElement(PbNote, null, m.planNote) : null, m.planWarn ? /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, m.planWarn) : null, m.alerts.length > 0 && /* @__PURE__ */ React.createElement(PbAlertsCard, { m }), !m.slotsOk && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("The crew rotation (Work shifts table) could not be read, so the plan does not check how many people are on shift. Every milestone gets the people it asks for. See the Data tab.")), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Weekend timeline"), right: /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs text-slate-500" }, /* @__PURE__ */ React.createElement("span", null, pbT("Zoom")), [14, 24, 40].map(function(z) {
    return /* @__PURE__ */ React.createElement(PbBtn, { key: z, kind: zoom === z ? "primary" : "plain", onClick: function() {
      setZoom(z);
    } }, z === 14 ? pbT("Weekend") : z === 24 ? pbT("Normal") : pbT("Close up"));
  })) }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mb-3" }, pbT('Each block is a subcategory milestone: its number is the clean order and "4p" is the people on it. Same numbers run side by side. Click a line name to open its steps; double click any block for its equipment, people and times. Gold outline = key goalpost. The thin bar under a block is what really happened (green on time, red late). Black line = production stops, red dashed line = restart.')), /* @__PURE__ */ React.createElement(PbGantt, { m, pxh: zoom, expanded, onToggle: toggle, onOpen: act.openBlock, onSlot: act.openSlot }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-3 mt-3 text-xs text-slate-600" }, PB_DEPTS.map(function(dp) {
    return /* @__PURE__ */ React.createElement("span", { key: dp, className: "inline-flex items-center gap-1" }, /* @__PURE__ */ React.createElement(PbDot, { dept: dp }), pbDeptName(dp));
  }), /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1" }, /* @__PURE__ */ React.createElement(PbStar, { on: true, size: 12 }), pbT("Key goalpost")))), m.included.map(function(l) {
    var s = l.sched;
    if (!s) return null;
    return /* @__PURE__ */ React.createElement(PbCard, { key: l.key, title: l.name, right: /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(PbStatusChip, { status: s.status, slack: s.slack, filled: s.filled }), l.cpRow ? /* @__PURE__ */ React.createElement(PbChip, { cls: l.cpRow.status === "ok" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : l.cpRow.status === "none" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-amber-50 text-amber-700 border-amber-200", title: l.cpRow.reason }, pbT("Scheduler"), ": ", pbT(PB_CP_STATUS[l.cpRow.status] || l.cpRow.status || "none")) : null, l.scopeLeft > 0 && /* @__PURE__ */ React.createElement(PbChip, { cls: "bg-slate-100 text-slate-600 border-slate-200", title: l.scopeWords }, pbT("{n} left out by the Scheduler", { n: l.scopeLeft })), l.scopeUpdating && /* @__PURE__ */ React.createElement(PbChip, { cls: "bg-amber-50 text-amber-700 border-amber-200", title: pbT("The equipment list changed after the Scheduler published this clean; the newer scope rows are used.") }, pbT("Plan being updated")), l.allergen && /* @__PURE__ */ React.createElement(PbChip, { cls: "bg-pink-50 text-pink-700 border-pink-200", title: l.allergenSrc }, pbT("Allergen clean")), /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      act.openLine(l);
    } }, pbT("Times and crew"))) }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 mb-3" }, /* @__PURE__ */ React.createElement("span", null, pbT("Stops"), " ", /* @__PURE__ */ React.createElement("b", { className: "text-slate-800" }, pbFmtDayTime(l.stop)), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" }, l.stopSrc)), /* @__PURE__ */ React.createElement("span", null, pbT("Restarts"), " ", /* @__PURE__ */ React.createElement("b", { className: "text-slate-800" }, pbFmtDayTime(l.restart)), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" }, l.restartSrc)), /* @__PURE__ */ React.createElement("span", null, pbT("Clean done"), " ", /* @__PURE__ */ React.createElement("b", { className: "text-slate-800" }, pbFmtDayTime(s.finish))), /* @__PURE__ */ React.createElement("span", null, pbTn(l.pieces, "{n} piece of equipment", "{n} pieces of equipment"), ", ", pbT("{t} of clean time", { t: pbFmtHours(l.workMin) })), /* @__PURE__ */ React.createElement("span", null, pbT("Crew for this line"), " ", /* @__PURE__ */ React.createElement("b", { className: "text-slate-800" }, l.crew === null || l.crew === void 0 ? pbT("no limit") : l.crew), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-400" }, l.crewSrc))), l.note ? /* @__PURE__ */ React.createElement(PbNote, { className: "mb-3" }, l.note) : null, l.scopeNote ? /* @__PURE__ */ React.createElement(PbNote, { tone: "warn", className: "mb-3" }, l.scopeNote) : null, s.issues.length > 0 && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn", className: "mb-3" }, /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5 space-y-0.5" }, s.issues.map(function(t, i) {
      return /* @__PURE__ */ React.createElement("li", { key: i }, t);
    }))), /* @__PURE__ */ React.createElement(PbMilestoneTable, { m, line: l, onOpen: act.openBlock, act }));
  }), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Other areas"), right: /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
    showAllState[1](!showAllState[0]);
  } }, showAllState[0] ? pbT("Hide") : pbT("Show {n}", { n: others.length })) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT("Areas with equipment that are not in the plan this weekend (no stop in the production schedule, or taken out).")), showAllState[0] && /* @__PURE__ */ React.createElement("div", { className: "mt-3 divide-y divide-slate-100" }, others.map(function(l) {
    return /* @__PURE__ */ React.createElement("div", { key: l.key, className: "flex flex-wrap items-center gap-3 py-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-slate-800 min-w-[140px]" }, l.name), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500 flex-1" }, !l.hasAssets ? pbT("No equipment in the assets table") : l.win.note || pbT("Stops {at}", { at: pbFmtDayTime(l.stop) })), /* @__PURE__ */ React.createElement(PbBtn, { disabled: !l.hasAssets, onClick: function() {
      act.line(l.key, { include: true });
      act.openLine(l);
    } }, pbT("Add to plan")));
  }))));
}
var PB_WHY = { hand: "Left out by hand", plan: "Left out by the Scheduler", ondemand: "On demand", secondweek: "2nd week of the month only" };
function PbGoalExtras(props) {
  var l = props.line;
  var b = props.block;
  var act = props.act;
  return /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-3 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(PbStar, { on: b.key, onClick: function() {
    act.star(l, b, !b.key);
  }, size: 18 }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-slate-700" }, b.key ? pbT("Key goalpost") : pbT("Not a key goalpost")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("Key goalposts lead the brief, Execute and the debrief."))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Note for the brief")), /* @__PURE__ */ React.createElement(PbTextSave, { className: "mt-1 w-full", value: b.note, onSave: function(v) {
    act.goalNote(l, b, v);
  }, placeholder: pbT("For example: CIP must be signed off before swab"), label: pbT("Note for the brief") })));
}
function PbSubModal(props) {
  var m = props.m;
  var l = props.line;
  var b = props.block;
  var act = props.act;
  var g = b.group;
  var p = l;
  var exclude = (props.plan.lines[l.key] || {}).exclude || [];
  var slot = m.slotAt(b.start);
  var crews = slot ? slot.crews : [];
  var people = pbSuggestPeople(props.exp, m.employees, crews, l.key, 60);
  var assigned = p.people[g.key] || [];
  var defHc = pbDefaultHc(g, l.crew);
  var left = l.ms.left;
  var prog = g.prog || { done: 0, total: g.pieces.length, started: null, finished: null, workers: [] };
  function setHc(v) {
    var hc = pbClone(p.hc);
    if (v === defHc) delete hc[g.key];
    else hc[g.key] = v;
    act.line(l.key, { hc });
  }
  function toggleAsset(id) {
    var ex = exclude.slice();
    var i = ex.indexOf(id);
    if (i >= 0) ex.splice(i, 1);
    else ex.push(id);
    act.line(l.key, { exclude: ex });
  }
  function keepAsset(id) {
    var kp = ((props.plan.lines[l.key] || {}).keep || []).slice();
    if (kp.indexOf(id) < 0) kp.push(id);
    act.line(l.key, { keep: kp });
  }
  function togglePerson(id) {
    var all = pbClone(p.people);
    var list = (all[g.key] || []).slice();
    var i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
    all[g.key] = list;
    act.line(l.key, { people: all });
  }
  return /* @__PURE__ */ React.createElement(PbModal, { title: l.name + ": " + g.name, sub: pbT("Milestone {n}", { n: g.order === null ? pbT("(no order number)") : g.order }) + " - " + pbFmtDayTime(b.start) + " " + pbT("to") + " " + pbFmtDayTime(b.end), onClose: props.onClose, wide: true, head: /* @__PURE__ */ React.createElement(PbStar, { on: b.key, onClick: function() {
    act.star(l, b, !b.key);
  }, size: 20 }) }, /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-3 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, pbT("People on it")), /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, /* @__PURE__ */ React.createElement(PbStepper, { value: b.hc, onChange: setHc })), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, b.hcSet ? pbT("Set by hand.") + " " : "", pbT("Default {d}: the heads the pieces need ({h})", { d: defHc, h: g.headsSum }), l.crew ? ", " + pbT("no more than the line crew of {c}", { c: l.crew }) : "", "."), b.hcSet && /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-xs font-bold text-[#0072CE] hover:underline mt-1", onClick: function() {
    setHc(defHc);
  } }, pbT("Back to default"))), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, pbT("Time frame")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black text-slate-800 mt-1" }, pbFmtHours(b.minutes)), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, pbT("{t} of clean time divided by {n} people", { t: pbFmtHours(g.totalMin), n: b.hc }), g.maxWall > g.totalMin / b.hc ? ", " + pbT("but the longest piece alone takes {t}", { t: pbFmtHours(g.maxWall) }) : "", ". ", pbT("Rounded up to 15 minutes."))), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, pbT("Done (Ganttly and Shift Start)")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black text-slate-800 mt-1" }, pbT("{d} of {n}", { d: prog.done, n: g.pieces.length })), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500 mt-1" }, prog.started !== null ? pbT("first started {at}", { at: pbFmtDayTime(prog.started) }) : pbT("not started"), prog.finished !== null ? "; " + pbT("all done {at}", { at: pbFmtDayTime(prog.finished) }) : ""))), b.over && /* @__PURE__ */ React.createElement(PbNote, { tone: "bad" }, pbT('This milestone needs {n} people at once, but the crew on shift does not have that many free. Lower the people on it, raise the shift headcount, or tick "No headcount limit" on the line.', { n: b.hc })), b.waited ? /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("It waits {t} after the step before it, because the people are busy on other lines.", { t: pbFmtHours(b.waited) })) : null, /* @__PURE__ */ React.createElement(PbGoalExtras, { line: l, block: b, act }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-black text-slate-700 mb-2" }, pbT("Equipment ({n})", { n: g.pieces.length })), /* @__PURE__ */ React.createElement("div", { className: "border border-slate-100 rounded-lg", style: { overflow: "auto", maxHeight: 320 } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50 sticky top-0" }, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "p-2" }, pbT("In")), /* @__PURE__ */ React.createElement("th", { className: "p-2" }, pbT("Equipment")), /* @__PURE__ */ React.createElement("th", { className: "p-2" }, pbT("Room")), /* @__PURE__ */ React.createElement("th", { className: "p-2 text-right" }, pbT("Minutes")), /* @__PURE__ */ React.createElement("th", { className: "p-2 text-right" }, pbT("Heads")), /* @__PURE__ */ React.createElement("th", { className: "p-2" }, pbT("Done")))), /* @__PURE__ */ React.createElement("tbody", null, g.pieces.map(function(pc) {
    var pr = (l.progress || m.progress)[pc.asset.id];
    return /* @__PURE__ */ React.createElement("tr", { key: pc.asset.id, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "p-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: true, onChange: function() {
      toggleAsset(pc.asset.id);
    }, "aria-label": pbT("Leave out {name}", { name: pc.asset.name }) })), /* @__PURE__ */ React.createElement("td", { className: "p-2 text-slate-800" }, pbTName(pc.asset.name)), /* @__PURE__ */ React.createElement("td", { className: "p-2 text-slate-500" }, pc.asset.room), /* @__PURE__ */ React.createElement("td", { className: "p-2 text-right " + (pc.minutes === null ? "text-red-600 font-bold" : "") }, pc.minutes === null ? pbT("none") : pbFmtNum(pc.minutes)), /* @__PURE__ */ React.createElement("td", { className: "p-2 text-right" }, pc.asset.heads, pc.asset.headsKnown ? "" : " " + pbT("(blank)")), /* @__PURE__ */ React.createElement("td", { className: "p-2 text-xs" }, pr && pr.done !== null ? /* @__PURE__ */ React.createElement("span", { className: "text-emerald-700 font-bold" }, pbFmtDayTime(pr.done)) : pr && pr.started !== null ? /* @__PURE__ */ React.createElement("span", { className: "text-amber-700" }, pbT("started")) : ""));
  })))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, pbT("Minutes come from the assets table (Hours required holds minutes)"), l.allergen ? "; " + pbT("this is an allergen clean, so a piece with allergen minutes uses those") : "", ". ", pbT("Untick a piece to leave it out of this weekend.")), left.length > 0 && /* @__PURE__ */ React.createElement("details", { className: "mt-2" }, /* @__PURE__ */ React.createElement("summary", { className: "text-xs font-bold text-slate-600 cursor-pointer" }, pbT("Left out of this area ({n})", { n: left.length })), /* @__PURE__ */ React.createElement("ul", { className: "mt-1 text-xs text-slate-600 space-y-1" }, left.map(function(x) {
    return /* @__PURE__ */ React.createElement("li", { key: x.asset.id, className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, pbTName(x.asset.subcat), " - ", pbTName(x.asset.name), ": ", pbT(PB_WHY[x.why] || x.why), x.word ? " (" + pbTName(x.word) + ")" : ""), x.why === "hand" && /* @__PURE__ */ React.createElement("button", { type: "button", className: "font-bold text-[#0072CE] hover:underline", onClick: function() {
      toggleAsset(x.asset.id);
    } }, pbT("Put back")), x.why === "plan" && /* @__PURE__ */ React.createElement("button", { type: "button", className: "font-bold text-[#0072CE] hover:underline", onClick: function() {
      keepAsset(x.asset.id);
    } }, pbT("Put back")));
  })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-black text-slate-700 mb-1" }, pbT("Who ({n} picked)", { n: assigned.length })), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, crews.length ? pbT("Crew {c} is on shift when it starts.", { c: crews.join(" / ") }) + " " : pbT("No crew is known for this time.") + " ", props.exp ? pbT("Listed with the most time in {area} first (last 56 days). Double click a name to see their experience.", { area: l.name }) : pbT("Experience is still being worked out in the background, so the list is not ranked yet.")), people.length === 0 ? /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("No regular employee on this shift was found in the Employees table.")) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, people.map(function(x) {
    var on = assigned.indexOf(x.emp.id) >= 0;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: x.emp.id,
        type: "button",
        onClick: function() {
          togglePerson(x.emp.id);
        },
        onDoubleClick: function() {
          act.openPerson(x.emp.id);
        },
        className: "px-2.5 py-1 rounded-full border text-xs font-semibold " + (on ? "bg-[#0072CE] text-white border-[#0072CE]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
      },
      x.emp.name
    );
  }))));
}
function PbMntModal(props) {
  var m = props.m;
  var l = props.line;
  var act = props.act;
  var b = props.block;
  var opts = [{ v: "auto", t: pbT("After the foam milestone (default)") }, { v: "start", t: pbT("Before the first sanitation milestone") }];
  var seenOrder = {};
  l.ms.groups.forEach(function(g) {
    var o = g.order === null ? "none" : String(g.order);
    if (seenOrder[o]) return;
    seenOrder[o] = 1;
    opts.push({ v: g.key, t: pbT("After milestone {name}", { name: (g.order === null ? "" : g.order + ". ") + g.name }) });
  });
  opts.push({ v: "none", t: pbT("No maintenance block this weekend") });
  return /* @__PURE__ */ React.createElement(PbModal, { title: l.name + ": " + pbT("maintenance"), sub: b ? pbFmtDayTime(b.start) + " " + pbT("to") + " " + pbFmtDayTime(b.end) : "", onClose: props.onClose, wide: true, head: b ? /* @__PURE__ */ React.createElement(PbStar, { on: b.key, onClick: function() {
    act.star(l, b, !b.key);
  }, size: 20 }) : null }, /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Where it goes")), /* @__PURE__ */ React.createElement("select", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: l.mntAfter, onChange: function(e) {
    act.line(l.key, { mntAfter: e.target.value });
  } }, opts.map(function(o) {
    return /* @__PURE__ */ React.createElement("option", { key: o.v, value: o.v }, o.t);
  })), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT('"Foam" is matched in the subcategory name (change the word on Setup).'))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Hours")), /* @__PURE__ */ React.createElement("div", { className: "mt-1 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PbNumInput, { value: (props.plan.lines[l.key] || {}).mntMinutes === void 0 || (props.plan.lines[l.key] || {}).mntMinutes === null ? null : pbFmtNum(l.mntMinutes / 60, 2), step: 0.5, placeholder: pbFmtNum(l.woMin / 60, 2), onChange: function(v) {
    act.line(l.key, { mntMinutes: v === null ? null : v * 60 });
  }, label: pbT("Maintenance hours") }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, l.wos.length ? pbT("Blank = the work orders total, {h} h", { h: pbFmtNum(l.woMin / 60, 1) }) : pbT("No work orders for this line this weekend"))))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: l.sanWaits, onChange: function(e) {
    act.line(l.key, { sanWaits: e.target.checked });
  } }), pbT("Sanitation waits for maintenance to finish before the next milestone (like the PBED sheet)")), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: l.mntFill, onChange: function(e) {
    act.line(l.key, { mntFill: e.target.checked });
  } }), pbT("Maintenance takes all the spare time before the restart")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, l.sanWaits ? pbT("The milestones and steps after it keep their length; they end at the restart instead of early.") : pbT("Maintenance runs until the restart; sanitation does not move."), l.mntFill && l.sched && l.sched.mntBlk ? " " + (l.sched.filled ? pbT("{t} of spare time added: maintenance now ends {end}", { t: pbFmtHours(l.sched.filled), end: pbFmtDayTime(l.sched.mntBlk.end) }) : l.restart === null || l.restart === void 0 ? pbT("Set the restart time to see the spare.") : !l.wos.length && !(l.mntMinutes > 0) ? pbT("Nothing to extend: no work orders and no hours.") : pbT("No spare time to add this weekend")) : ""), b && /* @__PURE__ */ React.createElement(PbGoalExtras, { line: l, block: b, act }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-black text-slate-700 mb-2" }, pbT("Work orders on this line this weekend ({n})", { n: l.wos.length })), l.wos.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT('None yet. Paste the SAP list on the Work orders tab and tick "This weekend".')) : /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Order")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Pri")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("What")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Equipment")), /* @__PURE__ */ React.createElement("th", { className: "py-1 text-right" }, pbT("Hours")))), /* @__PURE__ */ React.createElement("tbody", null, l.wos.map(function(w) {
    return /* @__PURE__ */ React.createElement("tr", { key: w.order, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 font-mono text-xs" }, w.order), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, w.priority), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, w.description), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, w.equipment || w.assetDesc), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, w.plannedHours === null ? pbT("not set") : pbFmtNum(w.plannedHours, 1)));
  }))))));
}
function PbStepModal(props) {
  var l = props.line;
  var b = props.block;
  var act = props.act;
  var id = b.id.replace(/^step:/, "");
  var cur = (props.plan.lines[l.key] || {}).stepMin || {};
  var anchorText = b.anchor === "stop" ? pbT("starts when production stops") : b.anchor === "restart" ? pbT("is set from the restart time") : pbT("follows the step before it");
  return /* @__PURE__ */ React.createElement(PbModal, { title: l.name + ": " + pbBlockName(b), sub: pbDeptName(b.dept) + " - " + pbFmtDayTime(b.start) + (b.milestone ? "" : " " + pbT("to") + " " + pbFmtDayTime(b.end)), onClose: props.onClose, head: /* @__PURE__ */ React.createElement(PbStar, { on: b.key, onClick: function() {
    act.star(l, b, !b.key);
  }, size: 20 }) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600" }, pbT("This step {how}. Its name, order and time for every line are the presets on the Brief tab.", { how: anchorText })), /* @__PURE__ */ React.createElement("label", { className: "flex flex-wrap items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Minutes on this line")), /* @__PURE__ */ React.createElement(PbNumInput, { value: cur[id] === void 0 ? null : cur[id], placeholder: String(b.minutes), step: 15, onChange: function(v) {
    var n = pbClone(cur);
    if (v === null) delete n[id];
    else n[id] = v;
    act.line(l.key, { stepMin: n });
  }, label: pbT("Minutes") }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("Blank = the preset"))), /* @__PURE__ */ React.createElement(PbGoalExtras, { line: l, block: b, act }));
}
function PbLineModal(props) {
  var l = props.line;
  var act = props.act;
  var p = props.plan.lines[l.key] || {};
  var w = l.win;
  function setTime(field, v) {
    var o = {};
    o[field] = v;
    act.line(l.key, o);
  }
  return /* @__PURE__ */ React.createElement(PbModal, { title: l.name + ": " + pbT("times and crew"), sub: l.rooms.length ? pbT("Rooms: {list}", { list: l.rooms.join(", ") }) : "", onClose: props.onClose, wide: true }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm font-bold text-slate-700" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: l.include, onChange: function(e) {
    act.line(l.key, { include: e.target.checked });
  } }), pbT("In the plan this weekend")), /* @__PURE__ */ React.createElement(PbNote, null, pbT("From the production schedule:"), " ", w.status === "noruns" ? pbT("no runs on this line this week.") : w.status === "runsthrough" ? w.note + "." : /* @__PURE__ */ React.createElement("span", null, w.prev ? pbT("last run before the weekend {what} ends {at}", { what: w.prev.product || pbT("run"), at: pbFmtDayTime(w.prev.end) }) + (w.prev.allergen ? " (" + pbT("allergen") + " " + (w.prev.allergenType || "") + ")" : "") : pbT("last run before the weekend not found"), "; ", w.next ? pbT("next run {what} starts {at}", { what: w.next.product || pbT("run"), at: pbFmtDayTime(w.next.start) }) : pbT("next run not scheduled yet"), ".")), l.cpRow ? /* @__PURE__ */ React.createElement(PbNote, null, pbT("From the clean plan (Scheduler):"), " ", l.cpRow.open ? pbT("stops {stop}; the next run is not scheduled yet", { stop: pbFmtDayTime(l.cpRow.start) }) : pbT("stops {stop}, restarts {restart}", { stop: pbFmtDayTime(l.cpRow.start), restart: pbFmtDayTime(l.cpRow.end) }), l.cpRow.details && l.cpRow.details.cleanStart && l.cpRow.details.cleanEnd ? "; " + pbT("clean planned {from} to {to}", { from: pbFmtDayTime(pbMs(l.cpRow.details.cleanStart)), to: pbFmtDayTime(pbMs(l.cpRow.details.cleanEnd)) }) : "", l.cpRow.minutes ? " (" + pbFmtHours(l.cpRow.minutes) + ")" : "", "; ", pbT(PB_CP_STATUS[l.cpRow.status] || l.cpRow.status || "none"), ".", l.cpRow.reason ? " " + l.cpRow.reason : "") : l.cpNote ? /* @__PURE__ */ React.createElement(PbNote, null, l.cpNote) : null, /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 gap-4" }, [["stop", pbT("Production stops"), l.stop, l.stopFrom], ["restart", pbT("Production restarts"), l.restart, l.restartFrom]].map(function(f) {
    var setByHand = p[f[0]] !== void 0 && p[f[0]] !== null;
    return /* @__PURE__ */ React.createElement("label", { key: f[0], className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, f[1]), /* @__PURE__ */ React.createElement("input", { type: "datetime-local", className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: pbToLocalInput(setByHand ? p[f[0]] : f[2]), onChange: function(e) {
      setTime(f[0], pbFromLocalInput(e.target.value));
    } }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, setByHand ? pbT("Set by hand.") + " " : f[3] === "plan" ? pbT("From the clean plan.") + " " : f[2] !== null ? pbT("From the production schedule.") + " " : pbT("Not in the production schedule: type it.") + " "), setByHand && /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-xs font-bold text-[#0072CE] hover:underline", onClick: function() {
      setTime(f[0], null);
    } }, pbT("Use the schedule")));
  })), /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Crew for this line")), /* @__PURE__ */ React.createElement("div", { className: "mt-1 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PbNumInput, { value: p.crew === void 0 ? null : p.crew, min: 1, placeholder: l.crew === null || l.crew === void 0 ? pbT("none") : String(l.crew), onChange: function(v) {
    act.line(l.key, { crew: v });
  }, label: pbT("Crew") }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("Most people one milestone gets. Blank = {src}.", { src: l.crewSrc })))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Allergen clean")), /* @__PURE__ */ React.createElement("select", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm", value: p.allergen === void 0 || p.allergen === null ? "auto" : p.allergen ? "yes" : "no", onChange: function(e) {
    act.line(l.key, { allergen: e.target.value === "auto" ? null : e.target.value === "yes" });
  } }, /* @__PURE__ */ React.createElement("option", { value: "auto" }, pbT("From the last run ({yn})", { yn: w.prev && w.prev.allergen ? pbT("yes") : pbT("no") })), /* @__PURE__ */ React.createElement("option", { value: "yes" }, pbT("Yes: use allergen minutes")), /* @__PURE__ */ React.createElement("option", { value: "no" }, pbT("No"))))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: !!p.ignoreCap, onChange: function(e) {
    act.line(l.key, { ignoreCap: e.target.checked });
  } }), pbT("No headcount limit on this line (it still counts in the totals)")));
}
function PbSlotModal(props) {
  var m = props.m;
  var s = props.slot;
  var act = props.act;
  var cur = props.plan.shiftHc[String(s.start)];
  var u = null;
  m.use.forEach(function(x) {
    if (x.slot.start === s.start) u = x;
  });
  var roster = s.hc.rosterIds.map(function(id) {
    return m.empById[id];
  }).filter(Boolean);
  return /* @__PURE__ */ React.createElement(PbModal, { title: pbT("Crew {crew}: {from} to {to}", { crew: s.key || pbT("none"), from: pbFmtDayTime(s.start), to: pbFmtDayTime(s.end) }), onClose: props.onClose }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase text-slate-400" }, pbT("Roster")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black" }, s.hc.roster), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, pbT("Employees table"))), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase text-slate-400" }, pbT("Shift Start")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black" }, s.hc.board === null ? "--" : s.hc.board), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, s.hc.boardSrc ? s.hc.boardSrc === "plan" ? pbT("planned board") : s.hc.boardSrc === "board" ? pbT("live board") : pbT("archived board") : pbT("no board yet"))), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase text-slate-400" }, pbT("Peak needed")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black" }, u ? u.peak : "--"), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, pbT("by this plan")))), /* @__PURE__ */ React.createElement("label", { className: "flex flex-wrap items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("People for sanitation on this shift")), /* @__PURE__ */ React.createElement(PbNumInput, { value: cur === void 0 ? null : cur, min: 0, placeholder: String(s.hc.board !== null ? s.hc.board : s.hc.roster), onChange: function(v) {
    act.shiftHc(s.start, v);
  }, label: pbT("Headcount") }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, s.hc.board !== null ? pbT("Blank = the Shift Start board") : pbT("Blank = the roster"))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, pbT("Roster = active employees on crew {crews} who are not a lead, supervisor or manager. Shift Start = people on the board for this shift, less PTO, sick and late.", { crews: s.crews.join(", ") })), roster.length > 0 && /* @__PURE__ */ React.createElement("details", null, /* @__PURE__ */ React.createElement("summary", { className: "text-sm font-bold text-slate-700 cursor-pointer" }, pbT("Roster names ({n})", { n: roster.length })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 mt-2" }, roster.map(function(e) {
    return /* @__PURE__ */ React.createElement("button", { key: e.id, type: "button", onDoubleClick: function() {
      act.openPerson(e.id);
    }, className: "px-2.5 py-1 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50", title: pbT("Double click for experience") }, e.name);
  }))));
}
function PbPersonModal(props) {
  var m = props.m;
  var id = props.id;
  var e = m.empById[id] || { id, name: pbT("(not in the Employees table)"), crew: "", role: "" };
  var x = props.exp ? props.exp[id] || props.exp["n:" + pbCanon(e.name)] : null;
  var areas = x ? pbKeys(x.areas).map(function(k) {
    return x.areas[k];
  }).sort(function(a, b) {
    return b.hours - a.hours;
  }) : [];
  return /* @__PURE__ */ React.createElement(PbModal, { title: e.name, sub: (e.crew ? pbT("Crew {c}", { c: e.crew }) : pbT("No crew")) + (e.role && e.role !== "regular" ? " - " + pbT(e.role) : ""), onClose: props.onClose }, !props.exp ? /* @__PURE__ */ React.createElement(PbNote, null, pbT("Experience is still being worked out from Shift Start history. Try again in a moment.")) : !x ? /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("No shift history for this person in the last 56 days (Shift Start boards and task assignments).")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase text-slate-400" }, pbT("Hours")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black" }, pbFmtNum(x.hours, 0))), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase text-slate-400" }, pbT("Days")), /* @__PURE__ */ React.createElement("div", { className: "text-xl font-black" }, x.dayCount)), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-slate-200 p-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase text-slate-400" }, pbT("Last seen")), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-black mt-1" }, pbFmtDate(x.last)))), /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1" }, pbT("Area")), /* @__PURE__ */ React.createElement("th", { className: "py-1 text-right" }, pbT("Hours")), /* @__PURE__ */ React.createElement("th", { className: "py-1 text-right" }, pbT("Days")))), /* @__PURE__ */ React.createElement("tbody", null, areas.map(function(a) {
    return /* @__PURE__ */ React.createElement("tr", { key: a.name, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5" }, a.name), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, pbFmtNum(a.hours, 1)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, a.dayCount));
  }))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, pbT("Last 56 days, from Shift Start boards (archive) and task assignments. A row with no end time counts as a day but no hours."))));
}
function pbCopy(text, done) {
  function legacy() {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      done(ok);
    } catch (e2) {
      done(false);
    }
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        done(true);
      }, legacy);
      return;
    }
  } catch (e) {
  }
  legacy();
}
function PbCopyBox(props) {
  if (!props.text) return null;
  return /* @__PURE__ */ React.createElement("textarea", { readOnly: true, rows: 10, className: "w-full text-xs font-mono border border-slate-300 rounded-lg p-2 mb-3 pb-noprint", value: props.text, onFocus: function(e) {
    e.target.select();
  }, "aria-label": pbT("Copy brief as text") });
}
function PbPresetEditor(props) {
  function edit(list, i, k, v) {
    var arr = pbClone(props[list]);
    arr[i][k] = v;
    props.onChange(list, arr);
  }
  function move(list, i, d) {
    var arr = pbClone(props[list]);
    var j = i + d;
    if (j < 0 || j >= arr.length) return;
    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
    props.onChange(list, arr);
  }
  function del(list, i) {
    var arr = pbClone(props[list]);
    arr.splice(i, 1);
    props.onChange(list, arr);
  }
  function add(list) {
    var arr = pbClone(props[list]);
    arr.push({ id: "s" + Date.now().toString(36), dept: "FSQ", name: "New step", anchor: list === "pre" ? "stop" : "chain", offset: 0, minutes: 60, hc: 0, key: false });
    props.onChange(list, arr);
  }
  function table(list, title) {
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-black text-slate-700 flex-1" }, title), /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      add(list);
    } }, pbT("Add a step"))), props[list].length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT("None.")), props[list].map(function(st, i) {
      return /* @__PURE__ */ React.createElement("div", { key: st.id, className: "flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2", "data-preset": st.id }, /* @__PURE__ */ React.createElement(PbStar, { on: !!st.key, onClick: function() {
        edit(list, i, "key", !st.key);
      } }), /* @__PURE__ */ React.createElement("select", { className: "border border-slate-300 rounded px-1 py-1 text-xs", value: st.dept, onChange: function(e) {
        edit(list, i, "dept", e.target.value);
      }, "aria-label": pbT("Department") }, PB_DEPTS.map(function(d) {
        return /* @__PURE__ */ React.createElement("option", { key: d, value: d }, d);
      })), /* @__PURE__ */ React.createElement(PbTextSave, { className: "flex-1 min-w-[180px]", value: pbTName(st.name), onSave: function(v) {
        edit(list, i, "name", v);
      }, label: pbT("Step name") }), /* @__PURE__ */ React.createElement("select", { className: "border border-slate-300 rounded px-1 py-1 text-xs", value: st.anchor, onChange: function(e) {
        edit(list, i, "anchor", e.target.value);
      }, "aria-label": pbT("Starts") }, /* @__PURE__ */ React.createElement("option", { value: "stop" }, pbT("at the stop, plus")), /* @__PURE__ */ React.createElement("option", { value: "chain" }, pbT("after the step before, plus")), /* @__PURE__ */ React.createElement("option", { value: "restart" }, pbT("at the restart, plus"))), /* @__PURE__ */ React.createElement(PbNumInput, { value: st.offset, step: 15, onChange: function(v) {
        edit(list, i, "offset", v);
      }, label: pbT("Offset minutes"), className: "w-20" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("min, lasts")), /* @__PURE__ */ React.createElement(PbNumInput, { value: st.minutes, min: 0, step: 15, onChange: function(v) {
        edit(list, i, "minutes", v || 0);
      }, label: pbT("Minutes"), className: "w-20" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("min")), st.dept === "SAN" && /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1 text-xs text-slate-500" }, /* @__PURE__ */ React.createElement(PbNumInput, { value: st.hc, min: 0, onChange: function(v) {
        edit(list, i, "hc", v || 0);
      }, label: pbT("People"), className: "w-16" }), pbT("people")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
        move(list, i, -1);
      }, title: pbT("Move up") }, pbT("Up")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
        move(list, i, 1);
      }, title: pbT("Move down") }, pbT("Down")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "danger", onClick: function() {
        del(list, i);
      } }, pbT("Remove")));
    }));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, table("pre", pbT("Before the sanitation milestones")), table("tail", pbT("After the sanitation milestones")));
}
function PbBriefTab(props) {
  var m = props.m;
  var act = props.act;
  var copiedState = useState("");
  var copied = copiedState[0];
  var setCopied = copiedState[1];
  var presetOpen = useState(false);
  var noteOpen = useState({});
  var failText = useState("");
  function openNote(k) {
    var n = pbClone(noteOpen[0]);
    n[k] = true;
    noteOpen[1](n);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Brief - weekend of {date}", { date: pbFmtDate(m.frame.sat.getTime()) }), right: /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 pb-noprint" }, /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
    try {
      window.print();
    } catch (e) {
    }
  } }, pbT("Print")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", onClick: function() {
    var t = pbBriefText(m);
    pbCopy(t, function(ok) {
      setCopied(ok ? pbT("Copied") : pbT("Copy failed: select the text and copy it by hand"));
      failText[1](ok ? "" : t);
    });
  } }, pbT("Copy brief as text"))) }, copied && /* @__PURE__ */ React.createElement(PbNote, { className: "mb-3" }, copied), /* @__PURE__ */ React.createElement(PbCopyBox, { text: failText[0] }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600" }, pbT("The goalposts each department is held to: when each line is handed over, when each milestone must be done, and when production restarts. Star the ones that matter most; add notes anywhere.")), /* @__PURE__ */ React.createElement("label", { className: "block text-sm mt-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Notes for the brief")), /* @__PURE__ */ React.createElement(PbTextSave, { rows: 3, className: "mt-1", value: props.plan.notes || "", onSave: function(v) {
    act.notes(v);
  }, label: pbT("Notes for the brief"), placeholder: pbT("Focus areas, call-outs, contractor work, anything the crews need to know") }))), /* @__PURE__ */ React.createElement(PbKeyStrip, { m, act }), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-2 gap-4" }, m.included.map(function(l) {
    var s = l.sched;
    if (!s) return null;
    var goal = s.blocks.filter(pbBriefGoal);
    return /* @__PURE__ */ React.createElement(PbCard, { key: l.key, title: l.name, right: /* @__PURE__ */ React.createElement(PbStatusChip, { status: s.status, slack: s.slack, filled: s.filled }) }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-600 mb-2" }, pbT("Stops {stop} - restarts {restart} - {down} down", { stop: pbFmtDayTime(l.stop), restart: pbFmtDayTime(l.restart), down: pbFmtHours(l.restart && l.stop ? (l.restart - l.stop) / PB_MIN : null) })), /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("tbody", null, goal.map(function(b) {
      var nk = l.key + "|" + b.id;
      return /* @__PURE__ */ React.createElement("tr", { key: b.id, className: "border-t border-slate-100 align-top " + (b.key ? "bg-[#FFF6E0]" : "") }, /* @__PURE__ */ React.createElement("td", { className: "py-1 pr-1 w-8" }, /* @__PURE__ */ React.createElement(PbStar, { on: b.key, onClick: function() {
        act.star(l, b, !b.key);
      } })), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap font-bold text-slate-800" }, pbFmtDayTime(b.end)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(PbDot, { dept: b.dept }), /* @__PURE__ */ React.createElement("span", { className: b.key ? "font-black" : "" }, pbBlockName(b))), b.note || noteOpen[0][nk] ? /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, /* @__PURE__ */ React.createElement(PbTextSave, { className: "w-full text-xs", value: b.note, onSave: function(v) {
        act.goalNote(l, b, v);
      }, label: pbT("Note for the brief"), placeholder: pbT("Note for this goalpost") })) : /* @__PURE__ */ React.createElement("button", { type: "button", className: "block text-[11px] font-bold text-[#0072CE] hover:underline pb-noprint", onClick: function() {
        openNote(nk);
      } }, pbT("Add a note"))), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right text-xs text-slate-500 whitespace-nowrap" }, b.hc ? pbTn(b.hc, "{n} person", "{n} people") : pbDeptName(b.dept)));
    }))), l.wos.length > 0 && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, pbTn(l.wos.length, "{n} maintenance work order on this line.", "{n} maintenance work orders on this line.")), /* @__PURE__ */ React.createElement("label", { className: "block text-sm mt-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("Line note")), /* @__PURE__ */ React.createElement(PbTextSave, { rows: 2, className: "mt-1", value: l.note, onSave: function(v) {
      act.line(l.key, { note: v || null });
    }, label: pbT("Line note"), placeholder: pbT("For example: contractor on the oven Saturday 6 AM") })));
  })), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Goalpost presets"), right: /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
    presetOpen[1](!presetOpen[0]);
  }, pressed: presetOpen[0] }, presetOpen[0] ? pbT("Done editing") : pbT("Edit presets")) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600" }, m.presets.own ? pbT("This weekend has its own presets (changed here). Every line uses them.") : pbT("This weekend uses the default presets. A change here applies to this weekend only, unless you make it the default.")), !presetOpen[0] && /* @__PURE__ */ React.createElement("ul", { className: "mt-2 text-sm text-slate-700 space-y-0.5" }, m.presets.pre.concat(m.presets.tail).map(function(st) {
    return /* @__PURE__ */ React.createElement("li", { key: st.id, className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(PbDot, { dept: st.dept }), st.key ? /* @__PURE__ */ React.createElement(PbStar, { on: true, size: 12 }) : null, /* @__PURE__ */ React.createElement("span", null, pbTName(st.name)), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbFmtHours(st.minutes)));
  })), presetOpen[0] && /* @__PURE__ */ React.createElement("div", { className: "mt-3 space-y-4" }, /* @__PURE__ */ React.createElement(PbPresetEditor, { pre: m.presets.pre, tail: m.presets.tail, onChange: function(list, arr) {
    act.presets(list, arr);
  } }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, m.presets.own && /* @__PURE__ */ React.createElement(PbBtn, { onClick: act.presetsReset }, pbT("Back to the default presets")), m.presets.own && /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: props.busy, onClick: act.presetsToDefault }, pbT("Make these the default for every weekend"))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, pbT("The starting presets came from the PBED example sheet: handoff 1 h at the stop, FSQ inspect 1 h, swab 1.5 h, preflight 2 h from an hour before the restart, 1st pie an hour after it.")))), m.slotsOk && /* @__PURE__ */ React.createElement(PbCard, { title: pbT("People by shift") }, /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Crew")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Shift")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("On shift")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("Peak needed")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("Hours used")), /* @__PURE__ */ React.createElement("th", { className: "py-1 text-right" }, pbT("Hours not used")))), /* @__PURE__ */ React.createElement("tbody", null, m.use.map(function(u) {
    return /* @__PURE__ */ React.createElement("tr", { key: u.slot.start, className: "border-t border-slate-100 cursor-pointer hover:bg-slate-50", onDoubleClick: function() {
      act.openSlot(u.slot);
    } }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 font-bold" }, u.slot.key), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap" }, pbFmtDayTime(u.slot.start), " ", pbT("to"), " ", pbFmtTime(u.slot.end)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right" }, u.slot.cap), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right " + (u.peak > u.slot.cap ? "text-red-700 font-bold" : "") }, u.peak), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right" }, pbFmtNum(u.usedHours, 1)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, u.idleHours === null ? "--" : pbFmtNum(u.idleHours, 1)));
  })))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, pbT("Shifts from the first stop to the last restart. Hours not used = people on shift times shift hours, less the hours the plan books on weekend cleans. Double click a row to change its headcount."))));
}
var PB_LIVE_MS = 2 * 6e4;
function PbSrcTag(props) {
  if (props.src !== "auto") return null;
  return /* @__PURE__ */ React.createElement("span", { className: "ml-1 text-[10px] font-bold uppercase tracking-wider px-1 rounded bg-violet-50 text-violet-700 border border-violet-200", title: pbT("Filled in from Ganttly check-offs and the Shift Start board") }, pbT("auto"));
}
function PbExecuteTab(props) {
  var m = props.m;
  var act = props.act;
  var nowState = useState(Date.now());
  var now = nowState[0];
  var actRef = useRef(act);
  actRef.current = act;
  useEffect(function() {
    var t = setInterval(function() {
      nowState[1](Date.now());
    }, 6e4);
    var r = setInterval(function() {
      actRef.current.refreshLive();
    }, PB_LIVE_MS);
    return function() {
      clearInterval(t);
      clearInterval(r);
    };
  }, []);
  var dbf = pbDebrief(m, now);
  var totPieces = pbSum(m.included, function(l) {
    return l.pieces;
  });
  var totDone = pbSum(m.included, function(l) {
    return l.done;
  });
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-[220px]" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400" }, pbT("Live from Ganttly and Shift Start")), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-700" }, props.liveAt ? pbT("Read {at}. Reads again every 2 minutes while this tab is open.", { at: pbFmtTime(props.liveAt) }) : pbT("Reading..."))), /* @__PURE__ */ React.createElement("div", { className: "text-right" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-black text-slate-800" }, pbFmtPct(totDone, totPieces)), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500" }, pbT("{d} of {n} pieces done", { d: totDone, n: totPieces }))), /* @__PURE__ */ React.createElement(PbBtn, { onClick: act.refreshLive, disabled: props.liveBusy }, /* @__PURE__ */ React.createElement(PbIcon, { name: "refresh" }), props.liveBusy ? pbT("Reading...") : pbT("Read now"))), dbf.unsavedAuto.length > 0 && /* @__PURE__ */ React.createElement(PbNote, { tone: "info" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, pbTn(dbf.unsavedAuto.length, "{n} time was filled in from Ganttly and Shift Start but is not kept in the plan yet. Keep it so the debrief still has it after Ganttly clears its check-offs.", "{n} times were filled in from Ganttly and Shift Start but are not kept in the plan yet. Keep them so the debrief still has them after Ganttly clears its check-offs.")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: props.busy, onClick: act.keepAuto }, pbT("Keep these times")))), /* @__PURE__ */ React.createElement(PbKeyStrip, { m, act, now }), m.included.map(function(l) {
    var s = l.sched;
    if (!s) return null;
    var ob = m.onBoard(l.key, now);
    var pct = l.pieces ? Math.round(100 * l.done / l.pieces) : 0;
    return /* @__PURE__ */ React.createElement(PbCard, { key: l.key, title: l.name, right: /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 text-xs text-slate-500" }, ob ? /* @__PURE__ */ React.createElement("span", { title: pbT("People in this area on the Shift Start board now") }, pbTn(ob.ids.length, "{n} person on the board now", "{n} people on the board now")) : /* @__PURE__ */ React.createElement("span", null, pbT("No live Shift Start board now")), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-700" }, pbT("{d} of {n} pieces done", { d: l.done, n: l.pieces }))) }, /* @__PURE__ */ React.createElement("div", { className: "h-2 rounded-full bg-slate-100 overflow-hidden mb-3", "aria-label": pbT("{p} percent done", { p: pct }) }, /* @__PURE__ */ React.createElement("div", { className: "h-2 rounded-full", style: { width: pct + "%", backgroundColor: "#059669" } })), /* @__PURE__ */ React.createElement("div", { className: "divide-y divide-slate-100" }, s.blocks.map(function(b) {
      var a = m.act[l.key + "|" + b.id] || {};
      var man = a.manual || null;
      var st = pbGoalState(b, a, now);
      var g = b.group;
      return /* @__PURE__ */ React.createElement("div", { key: b.id, className: "flex flex-wrap items-center gap-2 py-2 " + (b.key ? "bg-[#FFF6E0] px-2 rounded" : "") }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1.5 min-w-[200px] flex-1 font-semibold text-slate-800" }, b.key ? /* @__PURE__ */ React.createElement(PbStar, { on: true }) : null, /* @__PURE__ */ React.createElement(PbDot, { dept: b.dept }), pbBlockName(b), g ? /* @__PURE__ */ React.createElement("span", { className: "text-xs font-normal text-slate-500" }, pbT("{d}/{n} done", { d: g.prog ? g.prog.done : 0, n: g.pieces.length })) : null), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500 whitespace-nowrap w-[160px]" }, pbT("plan"), " ", pbFmtTime(b.start), " - ", pbFmtDayTime(b.end)), /* @__PURE__ */ React.createElement("span", { className: "text-xs whitespace-nowrap w-[160px]" }, a.actualStart ? pbT("started {at}", { at: pbFmtDayTime(a.actualStart) }) : "", /* @__PURE__ */ React.createElement(PbSrcTag, { src: a.startSrc })), /* @__PURE__ */ React.createElement("span", { className: "text-xs whitespace-nowrap w-[160px] " + (st === "hit" ? "text-emerald-700 font-bold" : st === "missed" ? "text-red-700 font-bold" : st === "overdue" ? "text-amber-700" : "") }, a.actualEnd ? pbT("done {at}", { at: pbFmtDayTime(a.actualEnd) }) : st === "overdue" ? pbT("past its goalpost") : "", /* @__PURE__ */ React.createElement(PbSrcTag, { src: a.endSrc })), /* @__PURE__ */ React.createElement(PbBtn, { disabled: props.busy || !!a.actualEnd, onClick: function() {
        act.actual(l, b, { actualStart: Date.now() });
      } }, man && man.actualStart !== null ? pbT("Restart time") : pbT("Started")), /* @__PURE__ */ React.createElement(PbBtn, { kind: a.actualEnd ? "plain" : "primary", disabled: props.busy, onClick: function() {
        var nowMs = Date.now();
        act.actual(l, b, man && man.actualStart !== null ? { actualEnd: nowMs } : { actualStart: a.actualStart || (b.start <= nowMs ? b.start : nowMs - (b.end - b.start)), actualEnd: nowMs });
      } }, pbT("Done")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
        act.openActual(l, b);
      } }, pbT("Edit")));
    })));
  }), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, pbT("Times you press or type save {where}.", { where: props.canSave.milestone ? pbT("to Dataverse (_p_ Milestone)") : pbT("on this computer only, because the _p_ Milestone table was not found") }), " ", pbT('"auto" = filled in from Ganttly check-offs and the Shift Start board; a time you press or type wins.')));
}
function PbActualModal(props) {
  var l = props.line;
  var b = props.block;
  var a = props.actual || {};
  var st = useState({ s: a.actualStart || null, e: a.actualEnd || null, n: a.notes || "", h: a.headcount === null || a.headcount === void 0 ? null : a.headcount });
  var v = st[0];
  var set = st[1];
  return /* @__PURE__ */ React.createElement(PbModal, { title: l.name + ": " + pbBlockName(b), sub: pbT("Planned {from} to {to}", { from: pbFmtDayTime(b.start), to: pbFmtDayTime(b.end) }), onClose: props.onClose }, a.auto && (a.startSrc === "auto" || a.endSrc === "auto") && /* @__PURE__ */ React.createElement(PbNote, null, pbT("These times were filled in from Ganttly and Shift Start. Saving keeps them in the plan.")), /* @__PURE__ */ React.createElement("div", { className: "grid sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Actual start")), /* @__PURE__ */ React.createElement("input", { type: "datetime-local", className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: pbToLocalInput(v.s), onChange: function(e) {
    set({ s: pbFromLocalInput(e.target.value), e: v.e, n: v.n, h: v.h });
  } })), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Actual end")), /* @__PURE__ */ React.createElement("input", { type: "datetime-local", className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: pbToLocalInput(v.e), onChange: function(e) {
    set({ s: v.s, e: pbFromLocalInput(e.target.value), n: v.n, h: v.h });
  } }))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("People who did it")), /* @__PURE__ */ React.createElement(PbNumInput, { value: v.h, min: 0, placeholder: String(b.hc || 0), onChange: function(x) {
    set({ s: v.s, e: v.e, n: v.n, h: x });
  }, label: pbT("People") })), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Notes")), /* @__PURE__ */ React.createElement("textarea", { rows: 3, className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: v.n, onChange: function(e) {
    set({ s: v.s, e: v.e, n: e.target.value, h: v.h });
  } })), v.s !== null && v.e !== null && v.e < v.s && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("The end is before the start.")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 justify-end" }, /* @__PURE__ */ React.createElement(PbBtn, { onClick: props.onClose }, pbT("Cancel")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: props.busy || v.s !== null && v.e !== null && v.e < v.s, onClick: function() {
    props.onSave({ actualStart: v.s, actualEnd: v.e, notes: v.n, headcount: v.h });
  } }, pbT("Save"))));
}
function pbDebriefText(m, d) {
  var out = [pbT("PBED DEBRIEF - weekend of {date}", { date: pbFmtDate(m.frame.sat.getTime()) }), ""];
  if (d.take.length) {
    out.push(pbT("HEADLINES"));
    d.take.forEach(function(t, i) {
      out.push(i + 1 + ". " + t);
    });
    out.push("");
  }
  out.push(pbT("SCORECARD"));
  d.lines.forEach(function(x) {
    out.push("- " + x.l.name + ": " + (x.actClean !== null ? pbT("clean done {at} (plan {plan}, {delta})", { at: pbFmtDayTime(x.actClean), plan: pbFmtDayTime(x.planClean), delta: (x.cleanDelta > 0 ? "+" : "") + pbFmtHours(x.cleanDelta) }) : pbT("clean not finished or not recorded ({d} of {n} milestones)", { d: x.done, n: x.total })) + (x.ready !== null ? "; " + pbT("ready {at}{proj}, restart {restart}", { at: pbFmtDayTime(x.ready), proj: x.readyProjected ? " " + pbT("(projected)") : "", restart: pbFmtDayTime(x.restart) }) : ""));
  });
  if (d.keys.length) {
    out.push("");
    out.push(pbT("KEY GOALPOSTS: {hit} of {n} hit", { hit: d.keyHit, n: d.keys.length }));
    d.keys.forEach(function(r) {
      out.push("* " + r.l.name + " " + pbBlockName(r.b) + ": " + pbT("plan {plan}, actual {act} - {state}", { plan: pbFmtDayTime(r.b.end), act: r.a && r.a.actualEnd !== null ? pbFmtDayTime(r.a.actualEnd) : "--", state: pbT((PB_GOAL_CHIP[r.state] || PB_GOAL_CHIP.open).label) }));
    });
  }
  out.push("");
  if (d.logN > 0) {
    out.push(pbT("Labor (MSS log)") + ": " + pbTn(d.logN, "{n} piece logged", "{n} pieces logged") + ", " + pbFmtNum(d.logMin / 60, 1) + " h" + (d.logPace !== null ? ", " + pbT("pace {p}% against standard", { p: pbFmtNum(d.logPace) }) : "") + (d.logCost !== null ? " (" + pbFmtMoney(d.logCost) + ")" : "") + (m.rate !== null && d.logCost === null && d.logNoRate ? "; " + pbTn(d.logNoRate, "{n} logged entry has no rate for its shift date", "{n} logged entries have no rate for their shift date") : ""));
  }
  var rn = pbRateNote(m, d);
  if (rn) out.push(rn);
  if (d.logN > 0 || rn) out.push("");
  out.push(pbT("TIME LOST: {t} ({ph} people-hours)", { t: pbFmtHours(d.lossMin), ph: pbFmtNum(d.lossPH, 1) }));
  d.reasons.forEach(function(x) {
    out.push("  - " + pbT(x.what) + ": " + pbT("{ph} people-hours", { ph: pbFmtNum(x.hours, 1) }));
  });
  if (d.costs.length) {
    out.push("");
    out.push(pbT("BIGGEST COSTS"));
    d.costs.slice(0, 6).forEach(function(c) {
      out.push("  - " + c.what + ": " + pbT("{ph} people-hours", { ph: pbFmtNum(c.hours, 1) }) + (m.rate !== null ? " (" + pbFmtMoney(c.hours * m.rate) + ")" : ""));
    });
  }
  return out.join("\n");
}
function PbBars(props) {
  var max = 0;
  props.items.forEach(function(x) {
    max = Math.max(max, x.hours);
  });
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, props.items.map(function(x) {
    return /* @__PURE__ */ React.createElement("div", { key: x.what, className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "w-44 shrink-0 truncate text-slate-700", title: pbT(x.what) }, pbT(x.what)), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-3 rounded bg-slate-100 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-3 rounded", style: { width: (max ? Math.max(3, 100 * x.hours / max) : 0) + "%", backgroundColor: props.color || "#D97706" } })), /* @__PURE__ */ React.createElement("span", { className: "w-24 text-right text-xs text-slate-600 whitespace-nowrap" }, pbFmtNum(x.hours, 1), " ", pbT("p-h")));
  }));
}
function pbRateNote(m, d) {
  if (m.rate === null) return "";
  var role = m.rateRow.role;
  var parts = [];
  if (d.logN > 0 && d.logCost !== null) parts.push(d.logNoRole ? pbT("Logged labor is costed by each person's role; {n} at the {role} rate (no role, or no rate row for it).", { n: d.logNoRole, role }) : pbT("Logged labor is costed by each person's role."));
  if (d.logN > 0 && d.logCost !== null && d.logNoPeople) parts.push(pbTn(d.logNoPeople, "{n} logged entry names nobody and is costed at the {role} rate.", "{n} logged entries name nobody and are costed at the {role} rate.", { role }));
  parts.push(pbT("Time lost, people-hours not used and Biggest costs are at the {role} rate ({rate}/h).", { role, rate: pbFmtMoney(m.rate) }));
  return parts.join(" ");
}
function PbDebriefTab(props) {
  var m = props.m;
  var act = props.act;
  var formState = useState({ area: "", step: "", dept: "Sanitation", reason: PB_LOSS_REASONS[0], minutes: null, heads: null, text: "" });
  var f = formState[0];
  var setF = formState[1];
  var copiedState = useState("");
  function upd(k, v) {
    var n = pbClone(f);
    n[k] = v;
    setF(n);
  }
  var d = pbDebrief(m, Date.now());
  var doneLines = d.lines.filter(function(x) {
    return x.actClean !== null;
  });
  var onPlan = doneLines.filter(function(x) {
    return x.cleanDelta !== null && x.cleanDelta <= 0;
  }).length;
  var labDelta = d.labN ? d.labAct - d.labPlan : null;
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-xl px-4 py-4 text-white", style: { background: "linear-gradient(90deg," + PB_NAVY + "," + PB_BLUE + ")" } }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-[240px]" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-widest opacity-80" }, pbT("Debrief - weekend of {date}", { date: pbFmtDate(m.frame.sat.getTime()) })), /* @__PURE__ */ React.createElement("div", { className: "text-lg sm:text-xl font-black mt-1", "data-headline": "debrief" }, d.take.length ? d.take[0] : pbT("Nothing recorded yet. Times come in from Ganttly and Shift Start, or are pressed on Execute."))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 pb-noprint" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "px-3 py-1.5 rounded-lg text-sm font-bold", style: { background: "rgba(255,255,255,0.15)", color: "#fff" }, onClick: function() {
    try {
      window.print();
    } catch (e) {
    }
  } }, pbT("Print")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "px-3 py-1.5 rounded-lg text-sm font-bold", style: { background: "#fff", color: PB_NAVY }, onClick: function() {
    pbCopy(pbDebriefText(m, d), function(ok) {
      copiedState[1](ok ? pbT("Copied") : pbT("Copy failed"));
    });
  } }, pbT("Copy debrief as text")))), copiedState[0] && /* @__PURE__ */ React.createElement("div", { className: "text-xs mt-2 opacity-90" }, copiedState[0])), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3" }, /* @__PURE__ */ React.createElement(PbStat, { big: true, label: pbT("Clean on plan"), value: doneLines.length ? onPlan + " / " + doneLines.length : "--", sub: doneLines.length ? pbT("lines finished on time") : pbT("no line finished yet"), tone: doneLines.length ? onPlan === doneLines.length ? "good" : "bad" : void 0 }), /* @__PURE__ */ React.createElement(PbStat, { big: true, label: pbT("Key goalposts"), value: d.keys.length ? d.keyHit + " / " + d.keys.length : "--", sub: d.keys.length ? pbT("hit") : pbT("none starred"), tone: d.keys.length ? d.keyMissed.length ? "bad" : "good" : void 0 }), d.logN > 0 ? /* @__PURE__ */ React.createElement(PbStat, { big: true, label: pbT("Labor (MSS log)"), value: pbFmtNum(d.logMin / 60, 1) + " h", sub: pbTn(d.logN, "{n} piece logged", "{n} pieces logged") + (d.logPace !== null ? ", " + pbT("pace {p}% against standard", { p: pbFmtNum(d.logPace) }) : "") + (d.logCost !== null ? " - " + pbFmtMoney(d.logCost) : "") + (m.rate !== null && d.logCost === null && d.logNoRate ? "; " + pbTn(d.logNoRate, "{n} logged entry has no rate for its shift date", "{n} logged entries have no rate for their shift date") : "") + (d.logNoStd ? "; " + pbTn(d.logNoStd, "{n} piece has no standard", "{n} pieces have no standard") : ""), tone: d.logPace === null ? void 0 : d.logPace >= 95 ? "good" : "warn" }) : /* @__PURE__ */ React.createElement(PbStat, { big: true, label: pbT("Labor against plan"), value: labDelta === null ? "--" : (labDelta > 0 ? "+" : "") + pbFmtNum(labDelta, 1) + " h", sub: (labDelta === null ? pbT("no milestone has both times yet") : pbTn(d.labN, "{a} h used for {p} h planned (1 milestone)", "{a} h used for {p} h planned ({n} milestones)", { a: pbFmtNum(d.labAct, 1), p: pbFmtNum(d.labPlan, 1), n: d.labN })) + " " + pbT("(from pressed or typed times; no MSS log rows yet)"), tone: labDelta === null ? void 0 : labDelta > 0.5 ? "warn" : "good" }), /* @__PURE__ */ React.createElement(PbStat, { big: true, label: pbT("Time lost"), value: pbFmtHours(d.lossMin), sub: pbT("{ph} people-hours", { ph: pbFmtNum(d.lossPH, 1) }) + (m.rate !== null ? " - " + pbFmtMoney(d.lossPH * m.rate) : ""), tone: d.lossMin ? "warn" : "good" }), /* @__PURE__ */ React.createElement(PbStat, { big: true, label: pbT("People-hours not used"), value: m.slotsOk ? pbFmtNum(d.idle, 1) : "--", sub: m.slotsOk ? pbT("on shift, not booked by the plan") + (m.rate !== null ? " - " + pbFmtMoney(d.idle * m.rate) : "") : pbT("shifts not read"), tone: m.slotsOk && d.idle > 0 ? "warn" : void 0 })), m.rate !== null && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500", "data-pb-rolecost": "1" }, pbRateNote(m, d)), d.take.length > 0 && /* @__PURE__ */ React.createElement(PbCard, { title: pbT("What happened") }, /* @__PURE__ */ React.createElement("ol", { className: "space-y-2" }, d.take.map(function(t, i) {
    return /* @__PURE__ */ React.createElement("li", { key: i, className: "flex gap-3 text-sm sm:text-base" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center", style: { backgroundColor: PB_BLUE } }, i + 1), /* @__PURE__ */ React.createElement("span", { className: "text-slate-800 font-semibold" }, t));
  }))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Scorecard") }, /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Line")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Clean done (plan)")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Clean done (actual)")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("Off by")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Ready for restart")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Restart")), /* @__PURE__ */ React.createElement("th", { className: "py-1 text-right" }, pbT("Pieces logged")))), /* @__PURE__ */ React.createElement("tbody", null, d.lines.map(function(x) {
    return /* @__PURE__ */ React.createElement("tr", { key: x.l.key, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 font-black text-slate-800" }, x.l.name), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 whitespace-nowrap" }, pbFmtDayTime(x.planClean)), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 whitespace-nowrap" }, x.actClean !== null ? pbFmtDayTime(x.actClean) : /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, pbT("{d} of {n} milestones done", { d: x.done, n: x.total }))), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 text-right whitespace-nowrap font-bold " + (x.cleanDelta === null ? "" : x.cleanDelta > 0 ? "text-red-700" : "text-emerald-700") }, x.cleanDelta === null ? "" : (x.cleanDelta > 0 ? "+" : "") + pbFmtHours(x.cleanDelta)), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 whitespace-nowrap" }, x.ready !== null ? /* @__PURE__ */ React.createElement("span", { className: x.readyGap !== null && x.readyGap < 0 ? "text-red-700 font-bold" : "text-emerald-700 font-bold" }, pbFmtDayTime(x.ready), x.readyProjected ? " " + pbT("(projected)") : "") : /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "--")), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 whitespace-nowrap" }, pbFmtDayTime(x.restart)), /* @__PURE__ */ React.createElement("td", { className: "py-2 text-right whitespace-nowrap" }, x.l.log && x.l.log.pieces ? x.l.log.pieces + " / " + pbFmtNum(x.l.log.minutes) + " min" : /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "--")));
  })))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, pbT("Clean done = the last sanitation milestone or maintenance block. Ready for restart = the last step before the restart (swab); projected from the clean when it was not recorded."), " ", pbT("Pieces logged = cleans in the MSS log for this weekend (pieces / person-minutes); a second crew's entry for the same piece counts once, its minutes add up."))), d.keys.length > 0 && /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Key goalposts"), icon: /* @__PURE__ */ React.createElement(PbIcon, { name: "star", fill: true, size: 16, style: { color: PB_GOLD } }), accent: PB_GOLD }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("tbody", null, d.keys.map(function(r) {
    return /* @__PURE__ */ React.createElement("tr", { key: r.l.key + r.b.id, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 font-semibold" }, r.l.name), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, pbBlockName(r.b)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap text-slate-500" }, pbT("plan"), " ", pbFmtDayTime(r.b.end)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap" }, r.a && r.a.actualEnd !== null ? pbFmtDayTime(r.a.actualEnd) : "--"), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, /* @__PURE__ */ React.createElement(PbGoalChip, { state: r.state })));
  })))), /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Time lost by reason") }, d.reasons.length ? /* @__PURE__ */ React.createElement(PbBars, { items: d.reasons }) : /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT("No time loss recorded.")), d.depts.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1" }, pbT("By department")), /* @__PURE__ */ React.createElement(PbBars, { items: d.depts, color: "#64748B" }))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Biggest costs this weekend") }, d.costs.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT("Nothing yet: record actual times on Execute and time loss below.")) : /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("tbody", null, d.costs.slice(0, 8).map(function(c, i) {
    return /* @__PURE__ */ React.createElement("tr", { key: i, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, c.what), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right whitespace-nowrap" }, pbT("{ph} people-hours", { ph: pbFmtNum(c.hours, 1) })), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right whitespace-nowrap font-bold" }, m.rate !== null ? pbFmtMoney(c.hours * m.rate) : ""));
  }))), m.rate === null && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, pbT("No labor rate set: add a row to the _e_ Labor rate table (role sanitation tech 2, or Sanitor, or All).")))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Add time loss"), className: "pb-noprint" }, /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-3" }, /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Line")), /* @__PURE__ */ React.createElement("select", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: f.area, onChange: function(e) {
    upd("area", e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, pbT("Pick a line")), m.included.map(function(l) {
    return /* @__PURE__ */ React.createElement("option", { key: l.key, value: l.key }, l.name);
  }))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Milestone")), /* @__PURE__ */ React.createElement("select", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: f.step, onChange: function(e) {
    upd("step", e.target.value);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, pbT("Whole line")), (m.included.filter(function(l) {
    return l.key === f.area;
  })[0] || { sched: { blocks: [] } }).sched.blocks.map(function(b) {
    return /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.id }, pbBlockName(b));
  }))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Department responsible")), /* @__PURE__ */ React.createElement("select", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: f.dept, onChange: function(e) {
    upd("dept", e.target.value);
  } }, PB_LOSS_DEPTS.map(function(x) {
    return /* @__PURE__ */ React.createElement("option", { key: x, value: x }, pbT(x));
  }))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Reason")), /* @__PURE__ */ React.createElement("select", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: f.reason, onChange: function(e) {
    upd("reason", e.target.value);
  } }, PB_LOSS_REASONS.map(function(x) {
    return /* @__PURE__ */ React.createElement("option", { key: x, value: x }, pbT(x));
  }))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Minutes lost")), /* @__PURE__ */ React.createElement(PbNumInput, { className: "mt-1 block w-full", value: f.minutes, min: 0, step: 5, onChange: function(v) {
    upd("minutes", v);
  }, label: pbT("Minutes lost") })), /* @__PURE__ */ React.createElement("label", { className: "block text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("People waiting")), /* @__PURE__ */ React.createElement(PbNumInput, { className: "mt-1 block w-full", value: f.heads, min: 1, placeholder: "1", onChange: function(v) {
    upd("heads", v);
  }, label: pbT("People") }))), /* @__PURE__ */ React.createElement("label", { className: "block text-sm mt-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("What happened")), /* @__PURE__ */ React.createElement("textarea", { rows: 2, className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: f.text, onChange: function(e) {
    upd("text", e.target.value);
  } })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 mt-3" }, /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: !f.area || !f.minutes || props.busy, onClick: function() {
    act.addLoss(f, function() {
      setF({ area: f.area, step: "", dept: f.dept, reason: f.reason, minutes: null, heads: null, text: "" });
    });
  } }, pbT("Add time loss")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, props.canSave.timeloss ? pbT('Saved to the time loss log the manager hub reads (kind "Weekend clean").') : pbT("The time loss log table was not found: entries stay on this computer."))), m.losses.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm mt-4" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Line")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Milestone")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Reason")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Dept")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2 text-right" }, pbT("Lost")), /* @__PURE__ */ React.createElement("th", { className: "py-1" }))), /* @__PURE__ */ React.createElement("tbody", null, m.losses.map(function(x) {
    return /* @__PURE__ */ React.createElement("tr", { key: x.id, className: "border-t border-slate-100 align-top" }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 font-semibold" }, x.area), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, pbTName(x.step)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, pbT(x.reason), x.description ? /* @__PURE__ */ React.createElement("div", { className: "text-xs text-slate-500" }, x.description) : null), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, pbT(x.dept)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 text-right whitespace-nowrap" }, pbFmtHours(x.minutes), x.heads > 1 ? " x " + x.heads : ""), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-xs font-bold text-red-700 hover:underline", onClick: function() {
      act.removeLoss(x);
    } }, pbT("Remove"))));
  }))))), /* @__PURE__ */ React.createElement("details", { className: "bg-white rounded-xl border border-slate-200 shadow-sm" }, /* @__PURE__ */ React.createElement("summary", { className: "px-4 py-3 text-sm font-black text-[#00468B] uppercase tracking-widest cursor-pointer" }, pbT("Every milestone: plan against actual ({n} recorded)", { n: d.recorded })), /* @__PURE__ */ React.createElement("div", { className: "px-4 pb-4", style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Line")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Milestone")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Planned end")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Actual end")), /* @__PURE__ */ React.createElement("th", { className: "py-1 text-right" }, pbT("Off by")))), /* @__PURE__ */ React.createElement("tbody", null, d.rows.map(function(r) {
    return /* @__PURE__ */ React.createElement("tr", { key: r.l.key + r.b.id, className: "border-t border-slate-100" }, /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 font-semibold" }, r.l.name), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2" }, r.b.key ? /* @__PURE__ */ React.createElement(PbStar, { on: true, size: 12 }) : null, " ", pbBlockName(r.b)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap" }, pbFmtDayTime(r.b.end)), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 pr-2 whitespace-nowrap" }, r.a && r.a.actualEnd !== null ? pbFmtDayTime(r.a.actualEnd) : /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, pbT("not recorded")), /* @__PURE__ */ React.createElement(PbSrcTag, { src: r.a ? r.a.endSrc : "" })), /* @__PURE__ */ React.createElement("td", { className: "py-1.5 text-right whitespace-nowrap " + (r.varMin > 0 ? "text-red-700 font-bold" : r.varMin !== null ? "text-emerald-700" : "") }, r.varMin === null ? "" : (r.varMin > 0 ? "+" : "") + pbFmtHours(r.varMin)));
  }))))));
}
function PbWorkOrdersTab(props) {
  var m = props.m;
  var act = props.act;
  var textState = useState("");
  var parsedState = useState(null);
  var filterState = useState("weekend");
  var parsed = parsedState[0];
  var areaKeys = pbKeys(m.areas).sort();
  var list = m.wos.filter(function(w) {
    return filterState[0] === "all" ? true : filterState[0] === "weekend" ? w.weekendKey === m.weekend : !w.areaKey || !w.assetId;
  });
  list.sort(function(a, b) {
    return String(a.priority).localeCompare(String(b.priority)) || a.order.localeCompare(b.order);
  });
  function onFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var r = new FileReader();
    r.onload = function() {
      textState[1](String(r.result || ""));
      parsedState[1](pbParseWorkOrders(String(r.result || "")));
    };
    r.readAsText(file);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Add work orders from SAP") }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 mb-2" }, pbT("In the SAP export, select the rows with the header row (Priority, Order, Description, Description2, Order Type, Functional loc., Bas. start date, Main WorkCtr, Sort field), copy, and paste here. A .csv or .txt file works too.")), /* @__PURE__ */ React.createElement("textarea", { rows: 5, className: "block w-full border border-slate-300 rounded-lg px-2 py-1.5 font-mono text-xs", value: textState[0], onChange: function(e) {
    textState[1](e.target.value);
    parsedState[1](null);
  }, placeholder: pbT("Paste the rows here") }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 mt-2" }, /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
    parsedState[1](pbParseWorkOrders(textState[0]));
  }, disabled: !textState[0] }, pbT("Read the paste")), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".csv,.txt,.tsv", onChange: onFile, className: "text-xs", "aria-label": pbT("Work order file") })), parsed && /* @__PURE__ */ React.createElement("div", { className: "mt-3 space-y-2" }, parsed.issues.length > 0 && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, /* @__PURE__ */ React.createElement("ul", { className: "list-disc pl-5" }, parsed.issues.map(function(t, i) {
    return /* @__PURE__ */ React.createElement("li", { key: i }, t);
  }))), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-700" }, pbTn(parsed.rows.length, "{n} work order read.", "{n} work orders read."), " ", pbT("{k} are already saved and will be updated (their equipment and hours stay).", { k: parsed.rows.filter(function(r) {
    return m.wos.some(function(w) {
      return w.order === r.order;
    });
  }).length })), /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: !parsed.rows.length || props.busy, onClick: function() {
    act.importWos(parsed.rows, function() {
      textState[1]("");
      parsedState[1](null);
    });
  } }, pbTn(parsed.rows.length, "Save {n} work order", "Save {n} work orders")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500 ml-2" }, pbT("Orders with a basic start date on or before Monday of this weekend are put on this weekend.")))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Work orders"), right: /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, [["weekend", pbT("This weekend")], ["unmapped", pbT("Needs equipment")], ["all", pbT("All")]].map(function(o) {
    return /* @__PURE__ */ React.createElement(PbBtn, { key: o[0], kind: filterState[0] === o[0] ? "primary" : "plain", onClick: function() {
      filterState[1](o[0]);
    } }, o[1]);
  })) }, !props.canSave.workorder && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn", className: "mb-3" }, pbT("The _p_ Work order table was not found, so work orders are kept on this computer only. The Dataverse monitor shows what to build from the manifest this page saves to Hub config.")), list.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT("None here.")) : /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Order")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Pri")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("What")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("SAP asset and location")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Equipment in the plan")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-2" }, pbT("Hours")), /* @__PURE__ */ React.createElement("th", { className: "py-1" }, pbT("This weekend")))), /* @__PURE__ */ React.createElement("tbody", null, list.map(function(w) {
    return /* @__PURE__ */ React.createElement(PbWoRow, { key: w.order, w, m, act, areaKeys, busy: props.busy });
  }))))));
}
function PbWoRow(props) {
  var w = props.w;
  var m = props.m;
  var act = props.act;
  var sug = pbSuggestAsset(w, m.assets, m.maps);
  var areaState = useState(w.areaKey || sug.areaKey || "");
  var area = areaState[0];
  var options = m.assets.filter(function(a) {
    return a.areaKey === area;
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  var guessed = !w.assetId && sug.how === "guess" ? m.assets.filter(function(a) {
    return a.id === sug.assetId;
  })[0] : null;
  var fl = pbParseFloc(w.floc);
  var hrsState = useState(w.plannedHours === null ? "" : String(w.plannedHours));
  return /* @__PURE__ */ React.createElement("tr", { className: "border-t border-slate-100 align-top" }, /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 font-mono text-xs" }, w.order, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400" }, w.orderType)), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2" }, w.priority), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 max-w-[220px]" }, w.description, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400" }, w.basicStart ? pbT("start {d}", { d: pbFmtDate(w.basicStart) }) : w.basicStartText, " ", w.workCenter)), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 max-w-[200px]" }, w.assetDesc, /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-400 font-mono", title: fl.area ? pbT("Area code {a}", { a: fl.area }) + (fl.sub ? ", " + pbT("sub area {s}", { s: fl.sub }) : "") : "" }, w.floc)), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2 min-w-[220px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("select", { className: "border border-slate-300 rounded px-1 py-1 text-xs", value: area, onChange: function(e) {
    areaState[1](e.target.value);
  }, "aria-label": pbT("Area") }, /* @__PURE__ */ React.createElement("option", { value: "" }, pbT("Area...")), props.areaKeys.map(function(k) {
    return /* @__PURE__ */ React.createElement("option", { key: k, value: k }, m.areas[k].name);
  })), /* @__PURE__ */ React.createElement("select", { className: "border border-slate-300 rounded px-1 py-1 text-xs", value: w.assetId, disabled: !area || props.busy, onChange: function(e) {
    var a = m.assets.filter(function(x) {
      return x.id === e.target.value;
    })[0];
    act.mapWo(w, a || null, area);
  }, "aria-label": pbT("Equipment") }, /* @__PURE__ */ React.createElement("option", { value: "" }, area ? pbT("Pick the equipment...") : pbT("Pick an area first")), options.map(function(a) {
    return /* @__PURE__ */ React.createElement("option", { key: a.id, value: a.id }, pbTName(a.name), a.subcat ? " (" + pbTName(a.subcat) + ")" : "");
  })), w.assetId && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-emerald-700" }, sug.how === "saved" ? pbT("Saved for this location and asset") : pbT("Picked")), guessed && /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-left text-[11px] font-bold text-[#0072CE] hover:underline", onClick: function() {
    act.mapWo(w, guessed, guessed.areaKey);
  } }, pbT("Looks like {name}: use it", { name: guessed.name })))), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      inputMode: "decimal",
      min: 0,
      step: 0.5,
      placeholder: pbT("hours"),
      "aria-label": pbT("Planned hours"),
      className: "border border-slate-300 rounded-lg px-2 py-1 text-sm w-20",
      value: hrsState[0],
      onChange: function(e) {
        hrsState[1](e.target.value);
      },
      onBlur: function() {
        var v = hrsState[0] === "" ? null : Number(hrsState[0]);
        if (v !== w.plannedHours && (v === null || isFinite(v))) act.saveWo(w, { craa5_plannedhours: v });
      }
    }
  )), /* @__PURE__ */ React.createElement("td", { className: "py-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: w.weekendKey === m.weekend, disabled: props.busy, onChange: function(e) {
    act.saveWo(w, { craa5_weekendkey: e.target.checked ? m.weekend : "" });
  }, "aria-label": pbT("This weekend") })));
}
function PbCrewTab(props) {
  var m = props.m;
  var act = props.act;
  var slots = m.slots.filter(function(s) {
    return s.crews.length && s.end > m.frame.focusStart - 12 * PB_HOUR && s.start < m.frame.focusEnd;
  });
  var assignedTo = {};
  m.included.forEach(function(l) {
    pbKeys(l.people).forEach(function(gk) {
      (l.people[gk] || []).forEach(function(id) {
        (assignedTo[id] = assignedTo[id] || []).push(l.name);
      });
    });
  });
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(PbNote, null, pbT("Who is on each weekend shift. Experience is worked out in the background from the last 56 days of Shift Start boards and task assignments ({state}); double click a name to see it.", { state: pbT(props.expState) })), !m.slotsOk && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("The crew rotation could not be read, so shifts cannot be listed.")), slots.map(function(s) {
    var ids = s.hc.boardIds.length ? s.hc.boardIds : s.hc.rosterIds;
    return /* @__PURE__ */ React.createElement(PbCard, { key: s.start, title: pbT("Crew {crew} - {from} to {to}", { crew: s.key, from: pbFmtDayTime(s.start), to: pbFmtDayTime(s.end) }), right: /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      act.openSlot(s);
    } }, pbT("{n} for sanitation", { n: s.cap })) }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mb-2" }, s.hc.boardIds.length ? s.hc.boardSrc === "plan" ? pbT("From the Shift Start planned board.") : pbT("From the Shift Start board.") : pbT("From the Employees table roster (no Shift Start board for this shift yet).")), ids.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500" }, pbT("Nobody found.")) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5" }, ids.map(function(id) {
      var e = m.empById[id];
      var nm = e ? e.name : id.indexOf("n:") === 0 ? id.slice(2) : pbT("Unknown person");
      return /* @__PURE__ */ React.createElement("button", { key: id, type: "button", onDoubleClick: function() {
        act.openPerson(id);
      }, className: "px-2.5 py-1 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50", title: assignedTo[id] ? pbT("Picked for {list}", { list: assignedTo[id].join(", ") }) : pbT("Double click for experience") }, nm, assignedTo[id] ? " *" : "");
    })));
  }), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, pbT("* = picked for a milestone on the Plan tab.")));
}
function PbSetupTab(props) {
  var cfg = props.config;
  var act = props.act;
  var m = props.m;
  var user = props.user || {};
  var emailState = useState("");
  function setCfg(patch) {
    var n = pbClone(cfg);
    pbKeys(patch).forEach(function(k) {
      n[k] = patch[k];
    });
    act.config(n);
  }
  var order = (cfg.lineOrder || []).slice();
  m.lines.forEach(function(l) {
    if (order.indexOf(l.key) < 0 && l.include) order.push(l.key);
  });
  function moveLine(i, d) {
    var arr = order.slice();
    var j = i + d;
    if (j < 0 || j >= arr.length) return;
    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
    setCfg({ lineOrder: arr });
  }
  var devs = cfg.devUsers || [];
  var meListed = devs.some(function(d) {
    return d.id && d.id === user.id || d.email && user.email && d.email === user.email;
  });
  var meKnown = !!(user.id || user.email);
  function addDev(d) {
    var list = devs.slice();
    if (!pbIsDev(user, list.concat([d]))) {
      if (!meKnown) return;
      list.push({ id: user.id, email: user.email, name: user.name });
    }
    list.push(d);
    setCfg({ devUsers: list });
  }
  function canDrop(i) {
    var rest = devs.filter(function(x, j) {
      return j !== i;
    });
    return pbIsDev(user, rest);
  }
  function dropDev(i) {
    var list = devs.slice();
    list.splice(i, 1);
    setCfg({ devUsers: list });
  }
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(PbNote, null, pbT("Setup applies to every weekend and every line."), " ", props.canSave.plan ? pbT('It is saved to the _p_ Plan table (row "config") when you press Save setup.') : pbT("The _p_ Plan table was not found, so setup is kept on this computer.")), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Developer access"), icon: /* @__PURE__ */ React.createElement(PbIcon, { name: "lock" }), right: /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: props.busy || !props.configDirty, onClick: act.saveConfig }, props.configDirty ? pbT("Save setup") : pbT("Setup saved")) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 mb-2" }, pbT("Setup and Data open only when one of these Microsoft accounts clicks the logo. It hides the tools on this page; what each person can change in Dataverse is still set by their security role.")), devs.length === 0 && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn", className: "mb-2" }, pbT("Not locked yet: anyone who clicks the logo can open Setup and Data. Add yourself to lock it.")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-1 mb-3" }, devs.map(function(d, i) {
    return /* @__PURE__ */ React.createElement("li", { key: i, className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, /* @__PURE__ */ React.createElement("b", null, d.name || d.email || d.id), " ", /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, d.email)), /* @__PURE__ */ React.createElement(PbBtn, { kind: "danger", disabled: !canDrop(i), onClick: function() {
      dropDev(i);
    }, title: pbT("Remove") }, pbT("Remove")));
  })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, !meListed && (user.id || user.email) && /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", onClick: function() {
    addDev({ id: user.id, email: user.email, name: user.name });
  } }, pbT("Add me ({who})", { who: user.name || user.email })), /* @__PURE__ */ React.createElement("input", { className: "border border-slate-300 rounded-lg px-2 py-1 text-sm min-w-[220px]", value: emailState[0], onChange: function(e) {
    emailState[1](e.target.value);
  }, placeholder: pbT("Email of another developer"), "aria-label": pbT("Email of another developer") }), /* @__PURE__ */ React.createElement(PbBtn, { disabled: !/@/.test(emailState[0]) || !meKnown, onClick: function() {
    addDev({ email: emailState[0].trim().toLowerCase(), name: "" });
    emailState[1]("");
  } }, pbT("Add"))), !meKnown && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn", className: "mt-2" }, pbT("Your Microsoft account could not be read on this computer, so the lock cannot be set from here.")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, pbT("Signed in as {who}.", { who: (user.name || "?") + (user.email ? " (" + user.email + ")" : "") }))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Rules") }, /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-4 text-sm" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Labor rate per hour")), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-sm font-semibold text-slate-800", "data-rate": "1" }, m.rateRow ? pbT("{rate}/h ({role}, from {date})", { rate: pbFmtMoney(m.rateRow.rate), role: m.rateRow.role, date: m.rateRow.from }) : pbT("No labor rate set: add a row to the _e_ Labor rate table (role sanitation tech 2, or Sanitor, or All).")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("Read from the shared _e_ Labor rate table: the newest row whose Effective from is on or before the weekend (undated rows are not used). Each person is costed at the rate of the role on their employee row ({n} roles have a rate); no role, or no row for it, counts as {role}. Planned cost uses that rate too.", { n: m.rateRoles.length, role: m.rateRow ? m.rateRow.role : PB_RATE_FALLBACK[0] }))), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Maintenance goes after the milestone named")), /* @__PURE__ */ React.createElement("input", { className: "mt-1 block w-full border border-slate-300 rounded-lg px-2 py-1.5", value: cfg.mntPattern, onChange: function(e) {
    setCfg({ mntPattern: e.target.value });
  } }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("A word in the subcategory name. Each line can move it."))), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, pbT("Key goalpost words")), /* @__PURE__ */ React.createElement(PbTextSave, { className: "mt-1 block w-full", value: (cfg.keyGoals || []).join(", "), onSave: function(v) {
    setCfg({ keyGoals: v.split(",").map(function(x) {
      return pbTrim(x);
    }).filter(Boolean) });
  }, label: pbT("Key goalpost words") }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, pbT("A milestone or step with one of these words in its name is starred, for example cip. Any goalpost can also be starred by hand."))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: cfg.excludeOnDemand, onChange: function(e) {
    setCfg({ excludeOnDemand: e.target.checked });
  } }), pbT('Leave out "on demand" subcategories')), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: cfg.monthlyRule, onChange: function(e) {
    setCfg({ monthlyRule: e.target.checked });
  } }), pbT('Equipment named "2nd Wk of Month" only on the 2nd weekend (Saturday the 8th to 14th)')), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", "data-pb-mntfill": "1", checked: !!cfg.mntFill, onChange: function(e) {
    setCfg({ mntFill: e.target.checked });
  } }), pbT("Maintenance takes the spare time before the restart on every line (each line can turn it off in its maintenance window)"))))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Line order") }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500 mb-2" }, pbT("When people are short, lines higher on this list get them first.")), /* @__PURE__ */ React.createElement("ol", { className: "space-y-1" }, order.map(function(k, i) {
    var l = m.lines.filter(function(x) {
      return x.key === k;
    })[0];
    if (!l) return null;
    return /* @__PURE__ */ React.createElement("li", { key: k, className: "flex items-center gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "w-6 text-right text-slate-400" }, i + 1, "."), /* @__PURE__ */ React.createElement("span", { className: "flex-1 font-semibold" }, l.name), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
      moveLine(i, -1);
    } }, pbT("Up")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
      moveLine(i, 1);
    } }, pbT("Down")));
  }))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Default goalpost presets (every weekend)") }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-500 mb-3" }, pbT("A weekend uses these unless its presets were changed on the Brief tab.")), /* @__PURE__ */ React.createElement(PbPresetEditor, { pre: cfg.pre, tail: cfg.tail, onChange: function(list, arr) {
    var o = {};
    o[list] = arr;
    setCfg(o);
  } })));
}
function PbDataTab(props) {
  var d = props.data;
  var probes = props.probes;
  var colState = useState(null);
  var colBusy = useState(false);
  var cols = colState[0];
  function runCols() {
    colBusy[1](true);
    var out = {};
    var chain = Promise.resolve();
    ["plan", "milestone", "workorder", "flocmap", "timeloss"].forEach(function(k) {
      var p = probes[k];
      if (!p || p.state !== "found") return;
      chain = chain.then(function() {
        return pbProbeCols(props.dataApi, p.table, PB_COLS[k]).then(function(r) {
          out[k] = r;
        });
      });
    });
    chain.then(function() {
      return props.onColumns ? Promise.resolve(props.onColumns()).then(null, function() {
        return null;
      }) : null;
    }).then(function() {
      colState[1](out);
      colBusy[1](false);
    });
  }
  var readKeys = ["assets", "runs", "cleanplan", "workshift", "employees", "roles", "shiftplan", "shiftboard", "checkoff", "msslog", "laborrate", "taskassignment", "shiftarchive"];
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(PbCard, { title: pbT("What this page read"), right: /* @__PURE__ */ React.createElement(PbBtn, { onClick: props.onReload, disabled: props.busy }, pbT("Read again")) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600 mb-2" }, pbT("Every number on the page comes from these reads. When one fails, the page says what is missing instead of making anything up.")), /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-3" }, pbT("Data")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-3" }, pbT("Table")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-3" }, pbT("Read")), /* @__PURE__ */ React.createElement("th", { className: "py-1" }, pbT("Note")))), /* @__PURE__ */ React.createElement("tbody", null, readKeys.map(function(k) {
    return /* @__PURE__ */ React.createElement(PbSourceLine, { key: k, label: pbT(PB_TABLES[k].label), owner: pbT("Written by {app}", { app: PB_TABLES[k].owner }), names: PB_TABLES[k].names.join(" / "), src: d[k], note: k === "taskassignment" || k === "shiftarchive" ? pbT("Read in the background for experience") : k === "roles" ? pbT("Optional: names the pay role when an employee row carries only its id") : "" });
  }))))), /* @__PURE__ */ React.createElement(PbCard, { title: pbT("Tables this page saves to"), right: /* @__PURE__ */ React.createElement(PbBtn, { onClick: runCols, disabled: colBusy[0] }, colBusy[0] ? pbT("Checking...") : pbT("Check columns")) }, /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-400" }, /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-3" }, pbT("Table")), /* @__PURE__ */ React.createElement("th", { className: "py-1 pr-3" }, pbT("Found as")), /* @__PURE__ */ React.createElement("th", { className: "py-1" }, pbT("Columns")))), /* @__PURE__ */ React.createElement("tbody", null, ["plan", "milestone", "workorder", "flocmap", "timeloss"].map(function(k) {
    var p = probes[k] || {};
    var c = cols && cols[k];
    var missing = c ? pbKeys(c).filter(function(x) {
      return c[x] === "missing";
    }) : [];
    var skip = k === "plan" && c && PB_PLAN_JSON_COLS.some(function(x) {
      return c[x] === "found";
    }) ? PB_PLAN_JSON_COLS.filter(function(x) {
      return c[x] !== "found";
    }) : [];
    missing = missing.filter(function(x) {
      return skip.indexOf(x) < 0;
    });
    var total = c ? pbKeys(c).length - skip.length : 0;
    var pc = k === "plan" ? props.planCol : null;
    var pm = pc && props.planMax && props.planMax.col === pc.col && props.planMax.n < 1e5 ? props.planMax : null;
    return /* @__PURE__ */ React.createElement("tr", { key: k, className: "border-t border-slate-100 align-top" }, /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-3 font-semibold" }, pbT(PB_TABLES[k].label), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-mono font-normal text-slate-400" }, PB_TABLES[k].names[0])), /* @__PURE__ */ React.createElement("td", { className: "py-2 pr-3 " + (p.state === "found" ? "text-emerald-700" : "text-amber-700") }, p.state === "found" ? p.table : p.state === "denied" ? pbT("No permission to read {t}", { t: p.table }) : p.state === "unknown" ? pbT("Could not tell") : p.state === "nohost" ? pbT("No Dataverse here") : p.state ? pbT("Table missing: kept on this computer") : pbT("Checking..."), p.why && p.state !== "missing" ? /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, p.why) : null), /* @__PURE__ */ React.createElement("td", { className: "py-2 text-xs" }, !c ? p.state === "found" ? pbT("Press Check columns") : "" : missing.length ? /* @__PURE__ */ React.createElement("span", { className: "text-amber-700" }, pbT("Missing: {list}", { list: missing.join(", ") })) : /* @__PURE__ */ React.createElement("span", { className: "text-emerald-700" }, pbT("All {n} found", { n: total })), pc ? /* @__PURE__ */ React.createElement("div", { className: "mt-1 " + (pc.state === "new" ? "text-slate-500" : "text-amber-700") }, pc.state === "new" ? pbT("The plan text is saved in {col}.", { col: pc.col }) : pc.state === "old" ? pbT("The column craa5_plan_json was not found: the plan text goes in the old column craa5_planjson.") : pbT("Could not tell whether the column craa5_plan_json exists: {err}", { err: pc.why })) : null, pm ? /* @__PURE__ */ React.createElement("div", { className: "text-amber-700 mt-1" }, pm.exact ? pbT("The {col} column holds {n} characters; longer plans are saved in parts. Raise its Maximum character count (up to 1,048,576) to keep one row per weekend.", { n: pm.n, col: pc.col }) : pbT("The {col} column is smaller than a plan (parts of {n} characters fit). Raise its Maximum character count (up to 1,048,576) to keep one row per weekend.", { n: pm.n, col: pc.col })) : null));
  })))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-2" }, pbT("This page makes no table: it saves the tables and columns it uses to Hub config (manifest|pbed) once per load, and the Dataverse monitor shows what is missing and what to build. Check columns only reads."))));
}
var PB_HELP = {
  plan: [
    "Pick the weekend with Prev, Next or the date box. The page reads the production schedule, equipment, shifts and employees for it.",
    "Each line shows its stop and restart from the clean plan of the Scheduler, or from the production runs until a plan is published. Click a line name to change them, mark an allergen clean or leave the line out.",
    "Milestones are the equipment subcategories in clean order. Click a block to set the people on it, leave out a piece or pick names.",
    "Pieces the Scheduler left out of this clean (case-out, dry clean, freezer) are listed under Left out in the block window with the reason; Put back adds one for this weekend. Clean plan alerts (over 72 h without a midweek clean, no End of Week clean, Highspeed and Custard together) show above the timeline for this plant week.",
    "Maintenance goes after the foam milestone with the hours of its work orders. Open its block to move it, change the hours or let it take the spare time before the restart.",
    "Headcount comes from the crew on shift. Click a shift to change its headcount for this weekend.",
    "Star a block to make it a key goalpost (CIP is starred by itself). Key goalposts lead the brief, Execute and the debrief.",
    "Press Save plan. Unsaved changes are kept on this computer until you do."
  ],
  brief: [
    "The brief is the Friday handoff: key goalposts first, then each line with its stop, clean done and restart.",
    "Edit presets changes the OPS and FSQ steps for this weekend only. Make these the default saves them for every weekend.",
    "Add general notes, a note per line and a note per goalpost. They print and copy with the brief.",
    "Copy brief puts the text on the clipboard for Teams or email. Print gives the paper copy.",
    "Save plan keeps the notes and presets with the weekend."
  ],
  execute: [
    "Each milestone fills in by itself from Ganttly check-offs and the Shift Start board: started at the first piece, done when every piece is done.",
    "Press Start or Done on a block to record a time by hand. A pressed or typed time always wins over the automatic one.",
    "Keep these times saves the automatic times to the _p_ Milestone table, so the debrief has them later.",
    "The page reads again every 2 minutes while Execute is open. Read now reads at once."
  ],
  debrief: [
    "The headline and the five numbers are the Monday story: clean on plan, key goalposts, labor, time lost and people-hours not used.",
    "Labor comes from the MSS log when Ganttly logged the pieces; until then from the times pressed or typed on Execute.",
    "Add time loss with its reason and department. It goes to the time loss log the manager hub reads.",
    "Copy debrief as text for the email, or Print for paper."
  ],
  workorders: [
    "Paste the SAP work order rows (with the header row) or load a .csv file, then Read the paste.",
    "Save the work orders. Ones already saved are updated; their equipment and hours stay.",
    "Pick the area and the equipment for each order once; the page remembers the location for next time.",
    "Tick This weekend to put an order on the weekend plan. Its hours become the maintenance block on the line."
  ],
  crew: [
    "Each weekend shift lists who is on it from the Shift Start board, or the Employees roster when there is no board yet.",
    "Double click a name to see their experience by area. An asterisk marks people picked for a milestone on the Plan tab."
  ],
  setup: [
    "Developer access: Add me locks Setup and Data to the listed Microsoft accounts. Until someone is listed they stay open to anyone who clicks the logo.",
    "The labor rate is read from the shared _e_ Labor rate table (hub - manager Setup), not typed here.",
    "Each person is costed at the rate of the pay role on their employee row (the Role lookup); no role, or no rate row for it, counts as sanitation tech 2.",
    "Rules, line order and default presets apply to every weekend. Press Save setup when done.",
    "Key goalpost words: a milestone or step with one of these words in its name is starred by itself."
  ],
  data: [
    "What this page read: one line per table with Ready, Nothing here yet, Table missing, No access or Could not load. Read again reads everything once more.",
    "Tables this page saves to: Check columns lists any column missing from the _p_ tables. What to build shows in the Dataverse monitor; this page makes nothing."
  ]
};
function PbHelpModal(props) {
  var tab = props.tab || "plan";
  var label = (PB_TABS.concat(PB_DEV_TABS).filter(function(t) {
    return t[0] === tab;
  })[0] || ["", "Plan"])[1];
  var steps = PB_HELP[tab] || [];
  return /* @__PURE__ */ React.createElement(PbModal, { title: pbT("Help: {tab}", { tab: pbT(label) }), onClose: props.onClose }, /* @__PURE__ */ React.createElement("h4", { className: "text-sm font-black text-slate-700" }, pbT("How to use this tab")), /* @__PURE__ */ React.createElement("ol", { className: "space-y-2 list-decimal pl-5" }, steps.map(function(s, i) {
    return /* @__PURE__ */ React.createElement("li", { key: i, className: "text-sm text-slate-800" }, pbT(s));
  })));
}
var PB_TABS = [["plan", "Plan"], ["brief", "Brief"], ["execute", "Execute"], ["debrief", "Debrief"], ["workorders", "Work orders"], ["crew", "Crew"]];
var PB_DEV_TABS = [["setup", "Setup"], ["data", "Data"]];
var PB_EXP_DAYS = 56;
var PB_EXP_CACHE = "pb_exp_v1";
var PB_DEV_KEY = "pb_dev_v1";
var PB_OWN = ["plan", "milestone", "workorder", "flocmap", "timeloss"];
var PB_EMPTY_SRC = { rows: null, err: "", table: "" };
var PB_BOARD_COLS = ["craa5_name", "craa5_crew", "craa5_slotstart", "craa5_slotend", "craa5_boardjson", "craa5_status", "modifiedon"];
function pbSatOf(ymd) {
  var d = pbFromYmd(ymd);
  if (!d || d.getFullYear() < 2e3 || d.getFullYear() > 2100) return null;
  var dow = d.getDay();
  var add = dow === 0 ? -1 : dow === 1 ? -2 : 6 - dow;
  return pbYmd(pbAddDays(d, add));
}
function pbLocalRows(kind) {
  var v = pbReadLocal("pb_local_" + kind, []);
  return Array.isArray(v) ? v : [];
}
function pbTagRows(rows, table) {
  return (rows || []).map(function(r) {
    var o = r;
    o.__id = pbCleanId(r[table + "id"] || r.__id || "");
    return o;
  });
}
function pbStartLang() {
  var shared = null;
  try {
    shared = window.localStorage.getItem('__1_' + HUB_LANG_KEY);
  } catch (e) {
    shared = null;
  }
  if (shared === "es" || shared === "en") return shared;
  var saved = pbReadLocal("pb_lang", null);
  if (saved === "es" || saved === "en") {
    hubSetLang(saved);
    return saved;
  }
  if (hubGetLang() === "es") return "es";
  try {
    var x = pbXrm();
    var us = x && x.Utility && x.Utility.getGlobalContext ? x.Utility.getGlobalContext().userSettings : null;
    var id = us ? Number(us.languageId) : 0;
    if (id === 2058 || id === 3082 || id === 1034) return "es";
  } catch (e) {
  }
  return "en";
}
function pbStartTheme() {
  var shared = null;
  try {
    shared = window.localStorage.getItem('__1_' + HUB_THEME_KEY);
  } catch (e) {
    shared = null;
  }
  if (shared === "dark" || shared === "light") return shared;
  var saved = pbReadLocal("pb_theme", null);
  if (saved === "dark" || saved === "light") {
    hubSetTheme(saved);
    return saved;
  }
  if (hubGetTheme() === "dark") return "dark";
  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch (e) {
  }
  return "light";
}
function PbLogo(props) {
  var img = /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center rounded-lg px-1.5 py-1", style: { background: "#FFFFFF" } }, /* @__PURE__ */ React.createElement("img", { src: PB_LOGO, alt: "Apex Foods", style: { height: 34, width: "auto", display: "block" } }));
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "data-pb-logo": "1",
      onClick: props.onClick,
      "aria-pressed": props.open,
      title: props.allowed ? props.open ? pbT("Hide the developer tools") : pbT("Show the developer tools") : "",
      className: "relative inline-flex items-center rounded-lg border-0 bg-transparent p-0 cursor-pointer",
      style: { outline: props.open ? "2px solid " + PB_BLUE : "none", outlineOffset: 2 }
    },
    img,
    props.open && /* @__PURE__ */ React.createElement("span", { className: "absolute -bottom-1 -right-1 rounded-full text-white p-0.5", style: { background: PB_BLUE } }, /* @__PURE__ */ React.createElement(PbIcon, { name: "unlock", size: 11 }))
  );
}
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function PbedApp(props) {
  var dataApi = props && props.dataApi;
  var langState = useState(pbStartLang);
  var lang = langState[0];
  pbSetLang(lang);
  var themeState = useState(pbStartTheme);
  var theme = themeState[0];
  var twState = useState("loading");
  var userState = useState(null);
  var user = userState[0];
  var devOpenState = useState(pbReadSession(PB_DEV_KEY) === "1");
  var weekendState = useState(pbDefaultWeekend(Date.now()));
  var weekend = weekendState[0];
  var setWeekend = weekendState[1];
  var weekendRef = useRef(weekend);
  weekendRef.current = weekend;
  var tabState = useState("plan");
  var tab = tabState[0];
  var dataState = useState({
    assets: PB_EMPTY_SRC,
    runs: PB_EMPTY_SRC,
    workshift: PB_EMPTY_SRC,
    employees: PB_EMPTY_SRC,
    roles: PB_EMPTY_SRC,
    shiftplan: PB_EMPTY_SRC,
    shiftboard: PB_EMPTY_SRC,
    shiftarchiveWk: PB_EMPTY_SRC,
    checkoff: PB_EMPTY_SRC,
    workorder: PB_EMPTY_SRC,
    flocmap: PB_EMPTY_SRC,
    milestone: PB_EMPTY_SRC,
    timeloss: PB_EMPTY_SRC,
    taskassignment: PB_EMPTY_SRC,
    shiftarchive: PB_EMPTY_SRC,
    msslog: PB_EMPTY_SRC,
    laborrate: PB_EMPTY_SRC,
    cleanplan: PB_EMPTY_SRC
  });
  var data = dataState[0];
  var setData = dataState[1];
  var dataRef = useRef(data);
  dataRef.current = data;
  var probesState = useState({});
  var probes = probesState[0];
  var probesRef = useRef(probes);
  probesRef.current = probes;
  var planMaxState = useState((function() {
    var v = pbReadLocal("pb_planchunk", null);
    return typeof v === "number" ? { n: v, exact: false, col: PB_PLAN_JSON_COLS[1] } : v && v.n ? { n: v.n, exact: !!v.exact, col: v.col || PB_PLAN_JSON_COLS[1] } : null;
  })());
  var planMaxRef = useRef(planMaxState[0]);
  planMaxRef.current = planMaxState[0];
  var planColState = useState(null);
  var planColRef = useRef(planColState[0]);
  planColRef.current = planColState[0];
  var planState = useState(pbEmptyPlan(weekend));
  var plan = planState[0];
  var setPlan = planState[1];
  var planMetaState = useState({ id: null, version: 0, savedBy: "", savedOn: null, dirty: false, draftAt: null, loaded: false, wk: "" });
  var planMeta = planMetaState[0];
  var setPlanMeta = planMetaState[1];
  var planReady = planMeta.loaded && planMeta.wk === weekend;
  var planRef = useRef(plan);
  planRef.current = plan;
  var configState = useState(pbMergeConfig(pbReadLocal("pb_config", null)));
  var config = configState[0];
  var configMetaState = useState({ id: null, dirty: false, loaded: false });
  var expState = useState(null);
  var exp = expState[0];
  var expNoteState = useState("waiting for the main read");
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
  var liveState = useState({ at: null, busy: false });
  var rootRef = useRef(null);
  var heightState = useState(0);
  useEffect(function() {
    pbEnsureStyles(function(ok) {
      twState[1](ok ? "ok" : "failed");
    });
    pbReadUser(props).then(function(u) {
      userState[1](u);
    });
    function fit() {
      var el = rootRef.current;
      if (!el) return;
      var top = el.getBoundingClientRect().top;
      heightState[1](Math.max(320, Math.floor(window.innerHeight - Math.max(0, top))));
    }
    fit();
    var t = setTimeout(fit, 600);
    window.addEventListener("resize", fit);
    return function() {
      clearTimeout(t);
      window.removeEventListener("resize", fit);
    };
  }, []);
  function patchData(patch) {
    setData(function(cur) {
      var n = {};
      pbKeys(cur).forEach(function(k) {
        n[k] = cur[k];
      });
      pbKeys(patch).forEach(function(k) {
        n[k] = patch[k];
      });
      return n;
    });
  }
  function ownFound(kind) {
    var p = probesRef.current[kind];
    return !!(p && p.state === "found");
  }
  function readOwn(kind, opts) {
    var p = probesRef.current[kind];
    if (!p || p.state !== "found") return Promise.resolve({ rows: pbLocalRows(kind), err: p && p.state !== "missing" ? p.why : "", table: "", local: true });
    return pbQuery(dataApi, p.table, opts).then(function(r) {
      r.table = p.table;
      if (r.rows) r.rows = pbTagRows(r.rows, p.table);
      return r;
    });
  }
  function readFirst(key, opts) {
    return pbQueryFirst(dataApi, PB_TABLES[key].names, opts).then(function(r) {
      return r;
    });
  }
  function readBoards(key, frame) {
    var sel = key === "shiftplan" ? PB_BOARD_COLS : PB_BOARD_COLS.concat(["craa5_updatesjson"]);
    var from = frame.focusStart - 24 * PB_HOUR;
    var to = frame.readEnd;
    return readFirst(key, { select: sel, filter: "statecode eq 0 and craa5_slotstart ge " + pbIsoZ(from) + " and craa5_slotstart le " + pbIsoZ(to), top: 500 }).then(function(r) {
      if (r.rows || r.kind === "missing" || r.kind === "denied" || r.kind === "nohost") return r;
      return readFirst(key, { filter: "modifiedon ge " + pbIsoZ(from - 21 * PB_DAY), top: 2e3, orderBy: "modifiedon desc" }).then(function(r2) {
        if (r2.rows) r2.rows = r2.rows.filter(function(x) {
          var s = pbMs(pbField(x, "craa5_slotstart"));
          return s !== null && s >= from && s <= to;
        });
        return r2;
      });
    });
  }
  function readCheckoffs(frame) {
    return readFirst("checkoff", { filter: "modifiedon ge " + pbIsoZ(frame.readStart), top: 5e3 });
  }
  var PB_PLAN_SELECT = ["craa5___1_p_cleanplanid", "craa5_rowtype", "craa5_plankey", "craa5_linekey", "craa5_start", "craa5_end", "craa5_day", "craa5_cleankind", "craa5_minutes", "craa5_status", "craa5_reason", "craa5_area", "craa5_line", "craa5_mssareaguid", "craa5_details", "statecode"];
  function readPlan(frame) {
    var from = pbAt(pbAddDays(frame.sat, -5), 0);
    return readFirst("cleanplan", { select: PB_PLAN_SELECT, filter: "statecode eq 0 and craa5_start le " + pbIsoZ(frame.readEnd) + " and craa5_end ge " + pbIsoZ(from), top: 2e3 }).then(function(r) {
      if (!r.rows) return r;
      return readFirst("cleanplan", { select: PB_PLAN_SELECT, filter: "statecode eq 0 and craa5_rowtype eq 'scope'", top: 500 }).then(function(s) {
        if (s.rows) r.rows = r.rows.concat(s.rows);
        else {
          r.scopeErr = s.err || "";
          r.err = [r.err, pbT("Scope rows were not read ({e}): no piece is marked left out by the Scheduler.", { e: pbT(pbLoadWord(s)) })].filter(Boolean).join(" ");
        }
        return r;
      });
    });
  }
  function readLog(frame) {
    return readFirst("msslog", {
      select: ["craa5___1_l_logid", "craa5_equipmentguid", "craa5_lastcleaned", "craa5_shiftdate", "craa5_cleankind", "craa5_doneat", "craa5_laborminutes", "craa5_employeeguids", "craa5_lastcleanedby", "craa5_area", "craa5_source", "statecode"],
      filter: "statecode eq 0 and craa5_lastcleaned ge " + pbIsoZ(frame.readStart - PB_DAY) + " and craa5_lastcleaned le " + pbIsoZ(frame.readEnd),
      top: 5e3
    });
  }
  useEffect(function() {
    var alive = true;
    loadingState[1](true);
    Promise.all(PB_OWN.map(function(k) {
      return pbProbe(dataApi, PB_TABLES[k].names).then(function(p) {
        return [k, p];
      });
    })).then(function(list) {
      if (!alive) return;
      var pr = {};
      list.forEach(function(x) {
        pr[x[0]] = x[1];
      });
      probesRef.current = pr;
      probesState[1](pr);
      try {
        hubSaveManifest(pbManifestIo(dataApi), PB_MANIFEST);
      } catch (e) {
      }
      var loading = { rows: null, err: "", loading: true };
      patchData({ assets: loading, workshift: loading, employees: loading, roles: loading, flocmap: loading, laborrate: loading });
      return Promise.all([
        readFirst("assets", { select: ["craa5___1_a_assetsid", "craa5_equipmentidentifier", "craa5_areaname", "craa5_roomname", "craa5_subcategory", "craa5_hoursrequired", "craa5_minalrg", "craa5_heads", "craa5_weeklyclean", "craa5_monthlyclean", "craa5_month", "statecode"], filter: "statecode eq 0", top: 1e4 }),
        readFirst("workshift", { filter: "statecode eq 0", top: 500 }),
        readFirst("employees", { select: ["craa5___1_a_employeeid", "craa5_name", "craa5_shift", "craa5_role", "_craa5_roleid_value", "statecode"], top: 5e3 }),
        // leavers too (statecode 1): they keep their pay role on old MSS log rows; craa5_roleid = pay role lookup (its name rides along as the formatted value); when the column is missing or plain text the read repeats without the select
        readOwn("flocmap", { filter: "statecode eq 0", top: 5e3 }),
        readOwn("plan", { filter: "startswith(craa5_weekendkey,'config')", top: 200 }),
        readFirst("laborrate", { filter: "statecode eq 0", top: 500 }),
        readFirst("roles", { filter: "statecode eq 0", top: 500 })
        // optional: names a pay role when the employee row carries only its id
      ]).then(function(res) {
        if (!alive) return;
        patchData({ assets: res[0], workshift: res[1], employees: res[2], flocmap: res[3], laborrate: res[5], roles: res[6] });
        var pp = probesRef.current.plan;
        if (pp && pp.state === "found") pbPlanColProbe(dataApi, pp.table).then(function(pc) {
          if (!alive) return;
          planColState[1](pc);
          if (pc.state === "unknown") return;
          pbColumnMax(pp.table, pc.col).then(function(n) {
            if (alive && n) {
              var m1 = { n, exact: true, col: pc.col };
              planMaxState[1](m1);
              pbWriteLocal("pb_planchunk", m1);
            }
          });
        });
        var cj = pbJoinPlanRows(res[4].rows || [], "config");
        if (cj.row) {
          var row = cj.row;
          var saved = null;
          try {
            saved = JSON.parse(cj.json || "null");
          } catch (e) {
            saved = null;
          }
          if (saved) {
            configState[1](pbMergeConfig(saved));
            pbWriteLocal("pb_config", saved);
          } else setMsg({ tone: "bad", text: pbT("Setup could not be read: {err}", { err: pbT("the saved setup is incomplete (a part is missing in the _p_ Plan table); the setup on this computer is in use") }) });
          configMetaState[1]({ id: row.__id || null, dirty: false, loaded: true });
        } else {
          configMetaState[1]({ id: configMetaState[0].id, dirty: configMetaState[0].dirty, loaded: !!res[4].rows });
          if (!res[4].rows) setMsg({ tone: "bad", text: pbT("Setup could not be read: {err}", { err: res[4].err || "?" }) });
        }
        loadingState[1](false);
        startExperience();
      });
    });
    return function() {
      alive = false;
    };
  }, [reloadState[0]]);
  useEffect(function() {
    var alive = true;
    if (!pbKeys(probesRef.current).length) return function() {
      alive = false;
    };
    var frame = pbWeekendFrame(weekend);
    var loading = { rows: null, err: "", loading: true };
    patchData({ runs: loading, shiftplan: loading, shiftboard: loading, shiftarchiveWk: loading, checkoff: loading, workorder: loading, milestone: loading, timeloss: loading, msslog: loading, cleanplan: loading });
    Promise.all([
      readFirst("runs", { select: ["craa5___1_p_prodscheduleid", "craa5_area", "craa5_line", "craa5_datestarttime", "craa5_dateendtime", "craa5_product", "craa5_allergen", "craa5_typeofallergen"], filter: "statecode eq 0 and craa5_datestarttime lt " + pbIsoZ(frame.readEnd) + " and craa5_dateendtime gt " + pbIsoZ(frame.readStart), orderBy: "craa5_datestarttime asc", top: 3e3 }),
      readBoards("shiftplan", frame),
      readBoards("shiftboard", frame),
      readBoards("shiftarchive", frame),
      readCheckoffs(frame),
      readOwn("workorder", { filter: "statecode eq 0", top: 5e3 }),
      readOwn("milestone", { filter: "craa5_weekendkey eq '" + weekend + "'", top: 2e3 }),
      readOwn("timeloss", { filter: "craa5_kind eq 'Weekend clean' and craa5_occurredon ge " + pbIsoZ(frame.readStart) + " and craa5_occurredon le " + pbIsoZ(frame.readEnd), top: 2e3 }),
      readOwn("plan", { filter: "startswith(craa5_weekendkey,'" + weekend + "')", top: 200 }),
      readLog(frame),
      readPlan(frame)
    ]).then(function(res) {
      if (!alive) return;
      var local = function(r, kind) {
        if (r.local) r.rows = r.rows.filter(function(x) {
          return kind === "milestone" ? pbField(x, "craa5_weekendkey") === weekend : true;
        });
        return r;
      };
      patchData({ runs: res[0], shiftplan: res[1], shiftboard: res[2], shiftarchiveWk: res[3], checkoff: res[4], workorder: res[5], milestone: local(res[6], "milestone"), timeloss: res[7], msslog: res[9], cleanplan: res[10] });
      liveState[1]({ at: Date.now(), busy: false });
      var pj = pbJoinPlanRows(res[8].rows || [], weekend);
      var row = pj.row;
      var saved = null;
      if (row) {
        try {
          saved = JSON.parse(pj.json || "null");
        } catch (e) {
          saved = null;
        }
      }
      var broken = !!row && !(saved && saved.lines);
      if (broken) setMsg({ tone: "bad", text: pbT("The saved plan for this weekend is incomplete: one of its parts is missing in the _p_ Plan table.") });
      var draft = pbReadLocal("pb_draft_" + weekend, null);
      var savedOn = row ? pbMs(pbField(row, "craa5_savedon")) || pbMs(pbField(row, "modifiedon")) : null;
      var meta = { id: row ? row.__id : null, version: row ? pbNum(pbField(row, "craa5_version")) || 0 : 0, savedBy: row ? pbTrim(pbField(row, "craa5_savedby")) : "", savedOn, dirty: false, draftAt: null, loaded: true, local: !!res[8].local, wk: weekend };
      if (draft && draft.plan && (broken || !savedOn || (draft.at || 0) > savedOn)) {
        setPlan(draft.plan);
        meta.dirty = true;
        meta.draftAt = draft.at;
      } else setPlan(saved && saved.lines ? saved : pbEmptyPlan(weekend));
      setPlanMeta(meta);
    });
    return function() {
      alive = false;
    };
  }, [weekend, probes, reloadState[0]]);
  function refreshLive() {
    if (!pbKeys(probesRef.current).length) return;
    var wk = weekend;
    var frame = pbWeekendFrame(wk);
    liveState[1](function(s) {
      return { at: s.at, busy: true };
    });
    Promise.all([readCheckoffs(frame), readBoards("shiftboard", frame), readBoards("shiftarchive", frame), readLog(frame)]).then(function(res) {
      if (weekendRef.current !== wk) {
        liveState[1](function(s) {
          return { at: s.at, busy: false };
        });
        return;
      }
      var p = {};
      if (res[0].rows) p.checkoff = res[0];
      if (res[1].rows) p.shiftboard = res[1];
      if (res[2].rows) p.shiftarchiveWk = res[2];
      if (res[3].rows) p.msslog = res[3];
      patchData(p);
      liveState[1]({ at: Date.now(), busy: false });
    });
  }
  function startExperience() {
    var cached = pbReadLocal(PB_EXP_CACHE, null);
    if (cached && cached.at && Date.now() - cached.at < 6 * PB_HOUR && cached.exp) {
      expState[1](cached.exp);
      expNoteState[1]("ready");
      return;
    }
    expNoteState[1]("working it out");
    var since = Date.now() - PB_EXP_DAYS * PB_DAY;
    patchData({ taskassignment: { rows: null, loading: true }, shiftarchive: { rows: null, loading: true } });
    Promise.all([
      readFirst("taskassignment", { select: ["craa5__aaemp_guid", "craa5_id", "craa5_area", "craa5_starttime", "craa5_endtime", "craa5_datetimeofassignment", "createdon"], filter: "createdon ge " + pbIsoZ(since), top: 2e4 }),
      readFirst("shiftarchive", { select: ["craa5_slotstart", "craa5_slotend", "craa5_boardjson"], filter: "createdon ge " + pbIsoZ(since), top: 5e3 })
    ]).then(function(res) {
      var lite = function(r) {
        return { rows: r.rows ? { length: r.rows.length } : null, err: r.err, table: r.table, droppedSelect: r.droppedSelect };
      };
      patchData({ taskassignment: lite(res[0]), shiftarchive: lite(res[1]) });
      if (!res[0].rows && !res[1].rows) {
        expNoteState[1]("not available: neither history table could be read");
        expState[1]({});
        return;
      }
      var e = pbExperience(res[0].rows || [], res[1].rows || [], since);
      expState[1](e);
      expNoteState[1]("ready");
      pbWriteLocal(PB_EXP_CACHE, { at: Date.now(), exp: e });
    });
  }
  var model = useMemo(function() {
    pbSetLang(lang);
    var boards = [];
    [["shiftplan", "plan"], ["shiftboard", "board"], ["shiftarchiveWk", "archive"]].forEach(function(x) {
      (data[x[0]].rows || []).forEach(function(r) {
        boards.push(pbNormBoard(r, x[1]));
      });
    });
    var d = { assets: data.assets, runs: data.runs, workshift: data.workshift, employees: data.employees, roles: data.roles, boards, checkoff: data.checkoff, workorder: data.workorder, flocmap: data.flocmap, milestone: data.milestone, timeloss: data.timeloss, msslog: data.msslog, laborrate: data.laborrate, cleanplan: data.cleanplan };
    return pbBuildModel(d, plan, config, weekend);
  }, [data, plan, config, weekend, lang]);
  function changePlan(fn) {
    if (!planReady) return;
    setPlan(function(cur) {
      var n = pbClone(cur);
      fn(n);
      n.weekend = weekend;
      pbWriteLocal("pb_draft_" + weekend, { plan: n, at: Date.now() });
      return n;
    });
    setPlanMeta(function(mm) {
      var o = pbClone(mm);
      o.dirty = true;
      return o;
    });
  }
  function lineOf(n, key) {
    return n.lines[key] || (n.lines[key] = {});
  }
  var act = {
    line: function(key, patch) {
      changePlan(function(n) {
        var l = lineOf(n, key);
        pbKeys(patch).forEach(function(k) {
          if (patch[k] === null || patch[k] === void 0) delete l[k];
          else l[k] = patch[k];
        });
      });
    },
    star: function(l, b, on) {
      changePlan(function(n) {
        var x = lineOf(n, l.key);
        x.stars = x.stars || {};
        x.stars[b.id] = !!on;
      });
    },
    goalNote: function(l, b, v) {
      changePlan(function(n) {
        var x = lineOf(n, l.key);
        x.goalNotes = x.goalNotes || {};
        if (v) x.goalNotes[b.id] = String(v).slice(0, 500);
        else delete x.goalNotes[b.id];
      });
    },
    presets: function(list, arr) {
      changePlan(function(n) {
        if (!n.presets) n.presets = { pre: pbClone(model.presets.pre), tail: pbClone(model.presets.tail) };
        n.presets[list] = arr;
      });
    },
    presetsReset: function() {
      changePlan(function(n) {
        n.presets = null;
      });
    },
    presetsToDefault: function() {
      presetsToDefault();
    },
    shiftHc: function(start, v) {
      changePlan(function(n) {
        n.shiftHc = n.shiftHc || {};
        if (v === null || v === void 0) delete n.shiftHc[String(start)];
        else n.shiftHc[String(start)] = v;
      });
    },
    notes: function(t) {
      changePlan(function(n) {
        n.notes = t;
      });
    },
    openBlock: function(l, b) {
      setModal({ type: b.kind === "sub" ? "sub" : b.kind === "mnt" ? "mnt" : "step", key: l.key, id: b.id });
    },
    openLine: function(l) {
      setModal({ type: "line", key: l.key });
    },
    openSlot: function(s) {
      setModal({ type: "slot", start: s.start });
    },
    openPerson: function(id) {
      setModal({ type: "person", id });
    },
    openActual: function(l, b) {
      setModal({ type: "actual", key: l.key, id: b.id });
    },
    config: function(c) {
      configState[1](c);
      configMetaState[1]({ id: configMetaState[0].id, dirty: true, loaded: true });
      pbWriteLocal("pb_config", c);
    },
    saveConfig: function() {
      saveConfig(config);
    },
    actual: function(l, b, patch) {
      saveActual(l, b, patch);
    },
    keepAuto: function() {
      keepAuto();
    },
    refreshLive: function() {
      refreshLive();
    },
    addLoss: function(f, done) {
      addLoss(f, done);
    },
    removeLoss: function(x) {
      removeOwn("timeloss", x.id).then(function() {
        setMsg({ tone: "good", text: pbT("Time loss entry removed.") });
      });
    },
    importWos: function(rows, done) {
      importWos(rows, done);
    },
    saveWo: function(w, patch) {
      saveOwn("workorder", w.id, patch, w.raw).catch(function(e) {
        setMsg({ tone: "bad", text: pbErrText(e) });
      });
    },
    mapWo: function(w, a, areaKey) {
      mapWo(w, a, areaKey);
    }
  };
  function saveOwn(kind, id, body, base, fixedId) {
    var p = probesRef.current[kind];
    if (p && p.state === "found") {
      if (kind === "plan" && body && body.craa5_name && !body.craa5__p_plan1) {
        body.craa5__p_plan1 = body.craa5_name;
      }
      if (kind === "flocmap" && body && body.craa5_name && !body.craa5__p_flocmap1) {
        body.craa5__p_flocmap1 = body.craa5_name;
      }
      var updId = id && id.indexOf("local-") !== 0 ? id : null;
      var write = pbSave(dataApi, p.table, updId, updId || !fixedId ? body : (function() {
        var b = pbClone(body);
        b[pbIdCol(p.table)] = fixedId;
        return b;
      })());
      if (!updId && fixedId) write = write.catch(function(e) {
        if (/exist|duplicate|0x80040237/i.test(pbErrText(e))) return pbSave(dataApi, p.table, fixedId, body);
        throw e;
      });
      return write.then(function(newId) {
        var cur = dataRef.current[kind] || PB_EMPTY_SRC;
        var rows = (cur.rows || []).slice();
        var hit = false;
        rows = rows.map(function(r) {
          if (r.__id === newId || id && r.__id === id) {
            hit = true;
            var o = {};
            pbKeys(r).forEach(function(k) {
              o[k] = r[k];
            });
            pbKeys(body).forEach(function(k) {
              o[k] = body[k];
            });
            o.__id = newId;
            return o;
          }
          return r;
        });
        if (!hit) {
          var o2 = base ? pbClone(base) : {};
          pbKeys(body).forEach(function(k) {
            o2[k] = body[k];
          });
          o2.__id = newId;
          rows.push(o2);
        }
        if (kind !== "plan") {
          var np = {};
          np[kind] = { rows, err: "", table: p.table, via: cur.via };
          patchData(np);
          dataRef.current = Object.assign({}, dataRef.current, np);
        }
        return newId;
      });
    }
    var all = pbLocalRows(kind);
    var lid = id || fixedId || "local-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    var found = false;
    all = all.map(function(r) {
      if (r.__id === lid) {
        found = true;
        var o = {};
        pbKeys(r).forEach(function(k) {
          o[k] = r[k];
        });
        pbKeys(body).forEach(function(k) {
          o[k] = body[k];
        });
        return o;
      }
      return r;
    });
    if (!found) {
      var o3 = base ? pbClone(base) : {};
      pbKeys(body).forEach(function(k) {
        o3[k] = body[k];
      });
      o3.__id = lid;
      all.push(o3);
    }
    pbWriteLocal("pb_local_" + kind, all);
    var cur2 = dataRef.current[kind] || PB_EMPTY_SRC;
    var rows2 = all;
    if (kind === "milestone") rows2 = all.filter(function(r) {
      return pbField(r, "craa5_weekendkey") === weekend;
    });
    if (kind !== "plan") {
      var np2 = {};
      np2[kind] = { rows: rows2, err: cur2.err, table: "", local: true };
      patchData(np2);
      dataRef.current = Object.assign({}, dataRef.current, np2);
    }
    return Promise.resolve(lid);
  }
  function removeOwn(kind, id) {
    var p = probesRef.current[kind];
    var drop = function() {
      var cur = dataRef.current[kind];
      var np = {};
      np[kind] = { rows: (cur.rows || []).filter(function(r) {
        return r.__id !== id;
      }), err: cur.err, table: cur.table };
      patchData(np);
    };
    if (p && p.state === "found" && id.indexOf("local-") !== 0) {
      var w = pbWriter(dataApi);
      if (!w) return Promise.resolve();
      return w.remove(p.table, id).then(drop, function(e) {
        setMsg({ tone: "bad", text: pbT("Could not remove it: {err}", { err: pbErrText(e) }) });
      });
    }
    pbWriteLocal("pb_local_" + kind, pbLocalRows(kind).filter(function(r) {
      return r.__id !== id;
    }));
    drop();
    return Promise.resolve();
  }
  function reprobePlanCol() {
    var pp = probesRef.current.plan;
    if (!(pp && pp.state === "found")) return Promise.resolve(null);
    return pbPlanColProbe(dataApi, pp.table).then(function(pc) {
      planColState[1](pc);
      return pc;
    });
  }
  function savePlanRow(key, id, body, json) {
    var p = probesRef.current.plan;
    if (!(p && p.state === "found")) {
      var bl = pbClone(body);
      bl[PB_PLAN_JSON_COLS[0]] = json;
      return saveOwn("plan", id, bl).then(function(nid) {
        return { id: nid, parts: 1, size: null, exact: false, col: PB_PLAN_JSON_COLS[0] };
      });
    }
    var pc0 = planColRef.current;
    var ensure = pc0 && pc0.state === "new" ? Promise.resolve(pc0) : pbPlanColProbe(dataApi, p.table).then(function(pc) {
      planColState[1](pc);
      return pc;
    });
    return ensure.then(function(pc) {
      if (pc.state === "unknown") throw new Error(pbT("the page could not tell whether _p_ Plan has the column craa5_plan_json ({err}); try again", { err: pc.why }));
      var col = pc.col;
      var mem0 = planMaxRef.current;
      var mem = mem0 && mem0.col === col ? mem0 : null;
      var exact = mem && mem.exact ? mem.n : null;
      var rungs = PB_PLAN_CHUNKS.filter(function(x) {
        return x < json.length;
      });
      var stamp = Date.now().toString(36).slice(-6);
      var wr = pbWriter(dataApi);
      function attempt(size) {
        var parts = size && json.length > size ? pbSplitText(json, size) : [json];
        var n = parts.length;
        var st = String(body.craa5_status || "saved");
        var made = [];
        var chain = Promise.resolve();
        parts.slice(1).forEach(function(txt, i) {
          var idx = i + 2;
          chain = chain.then(function() {
            var bp = { craa5_name: (String(body.craa5_name || key) + " " + idx).slice(0, 100), craa5_weekendkey: (key + "#" + idx).slice(0, 20), craa5_status: (st + " " + idx + "/" + n + " " + stamp).slice(0, 20), craa5_savedby: body.craa5_savedby, craa5_savedon: body.craa5_savedon };
            bp[col] = txt;
            if (body.craa5_version !== void 0) bp.craa5_version = body.craa5_version;
            return saveOwn("plan", null, bp).then(function(pid) {
              made.push(pid);
            });
          });
        });
        return chain.then(function() {
          var b1 = pbClone(body);
          b1[col] = parts[0];
          if (n > 1) b1.craa5_status = (st + " 1/" + n + " " + stamp).slice(0, 20);
          if (id && pc.clear && pc.clear !== col) b1[pc.clear] = null;
          return saveOwn("plan", id, b1);
        }).then(function(nid) {
          var isExact = !!exact && (size === null || size === exact);
          if (n > 1 && size) {
            var m2 = { n: size, exact: isExact, col };
            planMaxState[1](m2);
            pbWriteLocal("pb_planchunk", m2);
          } else if (mem0 && (!mem0.exact || mem0.col !== col)) {
            planMaxState[1](null);
            pbDropLocal("pb_planchunk");
          }
          var done = { id: nid, parts: n, size, exact: isExact, col };
          return readOwn("plan", { filter: "startswith(craa5_weekendkey,'" + key + "#')", select: [pbIdCol(p.table), "craa5_weekendkey"], top: 500 }).then(function(r) {
            (r.rows || []).forEach(function(x) {
              if (made.indexOf(x.__id) < 0 && wr) {
                wr.remove(p.table, x.__id).catch(function() {
                  return null;
                });
              }
            });
            return done;
          }, function() {
            return done;
          });
        }, function(e) {
          if (!pbIsTooLong(pbErrText(e))) throw e;
          var next = size === null && mem && !mem.exact && mem.n < json.length ? mem.n : rungs.filter(function(x) {
            return !size || x < size;
          })[0];
          if (!next) throw new Error(pbT("The {col} column of _p_ Plan is too small for a plan (under 100 characters): raise its Maximum character count.", { col }));
          return attempt(next);
        });
      }
      return attempt(exact && json.length > exact ? exact : null);
    });
  }
  function savePlan(force, baseVer) {
    if (!planReady) return;
    var p = probesRef.current.plan;
    var who = pbUserName();
    var sent = plan;
    var base = baseVer !== void 0 ? baseVer : planMeta.version || 0;
    var nextVer = base + 1;
    var body = { craa5_name: ("PBED weekend " + weekend).slice(0, 100), craa5_weekendkey: weekend, craa5_status: "saved", craa5_version: nextVer, craa5_savedby: who, craa5_savedon: (/* @__PURE__ */ new Date()).toISOString() };
    var json = JSON.stringify(pbSlimLines(plan));
    setBusy(true);
    setMsg(null);
    var check = p && p.state === "found" && !force ? pbQuery(dataApi, p.table, { filter: "craa5_weekendkey eq '" + weekend + "'", select: [pbIdCol(p.table), "craa5_version", "craa5_savedby", "craa5_savedon"], top: 20 }) : Promise.resolve({ rows: [] });
    check.then(function(r) {
      var newest = 0;
      var by = "";
      (r.rows || []).forEach(function(x) {
        var v = pbNum(pbField(x, "craa5_version")) || 0;
        if (v > newest) {
          newest = v;
          by = pbTrim(pbField(x, "craa5_savedby"));
        }
      });
      if (newest > base) {
        setBusy(false);
        setModal({ type: "conflict", by, version: newest });
        return;
      }
      return savePlanRow(weekend, planMeta.id, body, json).then(function(out) {
        var id = out.id;
        var same = planRef.current === sent;
        if (same) pbDropLocal("pb_draft_" + weekend);
        setPlanMeta({ id, version: nextVer, savedBy: who, savedOn: Date.now(), dirty: !same, draftAt: null, loaded: true, local: !(p && p.state === "found"), wk: weekend });
        setMsg({ tone: "good", text: p && p.state === "found" ? pbT("Plan saved to Dataverse.") + (out.parts > 1 ? " " + (out.exact ? pbT("It took {n} rows: the {col} column of _p_ Plan holds only {c} characters.", { n: out.parts, c: out.size, col: out.col }) : pbT("It took {n} rows of {c} characters: the {col} column of _p_ Plan is smaller than the plan.", { n: out.parts, c: out.size, col: out.col })) : "") : pbT("Plan saved on this computer only: the _p_ Plan table was not found (see Data).") });
        setBusy(false);
      });
    }).catch(function(e) {
      setBusy(false);
      setMsg({ tone: "bad", text: pbT("The plan was not saved: {err}. Your changes are kept on this computer.", { err: pbErrText(e) }) });
    });
  }
  function saveConfig(cfg, after, rowId) {
    if (!configMetaState[0].loaded) {
      setMsg({ tone: "bad", text: pbT("Setup was not saved: {err}", { err: pbT("setup was not read") }) });
      return;
    }
    var body = { craa5_name: "PBED setup", craa5_weekendkey: "config", craa5_status: "config", craa5_savedby: pbUserName(), craa5_savedon: (/* @__PURE__ */ new Date()).toISOString() };
    setBusy(true);
    savePlanRow("config", rowId !== void 0 ? rowId : configMetaState[0].id, body, JSON.stringify(cfg)).then(function(out) {
      var id = out.id;
      configState[1](cfg);
      pbWriteLocal("pb_config", cfg);
      configMetaState[1]({ id, dirty: false, loaded: true });
      setBusy(false);
      setMsg({ tone: "good", text: ownFound("plan") ? pbT("Setup saved.") : pbT("Setup saved on this computer only.") });
      if (after) after();
    }, function(e) {
      setBusy(false);
      setMsg({ tone: "bad", text: pbT("Setup was not saved: {err}", { err: pbErrText(e) }) });
    });
  }
  function presetsToDefault() {
    var pre = pbClone(model.presets.pre);
    var tail = pbClone(model.presets.tail);
    var put = function(saved, rowId) {
      var c = pbMergeConfig(saved || config);
      c.pre = pre;
      c.tail = tail;
      saveConfig(c, function() {
        changePlan(function(n) {
          n.presets = null;
        });
      }, rowId);
    };
    if (!ownFound("plan")) {
      put(null);
      return;
    }
    setBusy(true);
    readOwn("plan", { filter: "startswith(craa5_weekendkey,'config')", top: 200 }).then(function(r) {
      setBusy(false);
      if (!r.rows) {
        setMsg({ tone: "bad", text: pbT("Setup was not saved: {err}", { err: r.err || "?" }) });
        return;
      }
      var cj2 = pbJoinPlanRows(r.rows, "config");
      var row = cj2.row;
      var saved = null;
      if (row) {
        try {
          saved = JSON.parse(cj2.json || "null");
        } catch (e) {
          saved = null;
        }
      }
      put(saved, row ? row.__id : void 0);
    });
  }
  function saveActual(l, b, patch) {
    var msRows = dataRef.current.milestone.rows;
    if (!msRows) {
      setMsg({ tone: "bad", text: pbT("Not saved: {err}", { err: pbT("the _p_ Milestone rows are not read yet. Reload the page and try again.") }) });
      return Promise.resolve(false);
    }
    var a = msRows.map(pbNormActual).filter(function(x) {
      return x.areaKey === l.key && x.stepKey === b.id;
    })[0] || null;
    var body = { craa5_name: (weekend + " " + l.name + " " + pbBlockName(b)).slice(0, 100), craa5_weekendkey: weekend, craa5_areakey: l.key, craa5_stepkey: b.id.slice(0, 200), craa5_stepname: (b.kind === "mnt" ? "Maintenance PM/CM" : b.name).slice(0, 200), craa5_department: b.dept, craa5_plannedstart: pbIsoZ(b.start), craa5_plannedend: pbIsoZ(b.end), craa5_updatedby: pbUserName() };
    if (patch.actualStart !== void 0) body.craa5_actualstart = patch.actualStart ? pbIsoZ(patch.actualStart) : null;
    if (patch.actualEnd !== void 0) body.craa5_actualend = patch.actualEnd ? pbIsoZ(patch.actualEnd) : null;
    if (patch.notes !== void 0) body.craa5_notes = String(patch.notes || "").slice(0, 2e3);
    if (patch.headcount !== void 0) body.craa5_headcount = patch.headcount === null ? null : Math.round(patch.headcount);
    if (!a && body.craa5_headcount === void 0) body.craa5_headcount = b.hc || null;
    setBusy(true);
    return saveOwn("milestone", a ? a.id : null, body, null, hubIdFromKey("pbed|milestone|" + weekend + "|" + l.key + "|" + b.id)).then(function() {
      setBusy(false);
      return true;
    }, function(e) {
      setBusy(false);
      setMsg({ tone: "bad", text: pbT("Not saved: {err}", { err: pbErrText(e) }) });
      return false;
    });
  }
  function keepAuto() {
    var list = pbDebrief(model, Date.now()).unsavedAuto;
    var chain = Promise.resolve();
    var n = 0;
    var bad = 0;
    list.forEach(function(r) {
      chain = chain.then(function() {
        var patch = {};
        if (r.a.startSrc === "auto") patch.actualStart = r.a.actualStart;
        if (r.a.endSrc === "auto") patch.actualEnd = r.a.actualEnd;
        if (r.a.auto && r.a.auto.workers.length && (!r.a.manual || r.a.manual.headcount === null)) patch.headcount = r.a.auto.workers.length;
        return saveActual(r.l, r.b, patch).then(function(ok) {
          if (ok) n++;
          else bad++;
        });
      });
    });
    chain.then(function() {
      if (!bad) setMsg({ tone: "good", text: pbTn(n, "{n} time kept.", "{n} times kept.") });
    });
  }
  function addLoss(f, done) {
    var l = model.lines.filter(function(x) {
      return x.key === f.area;
    })[0];
    if (!l) return;
    var b = l.sched ? l.sched.blocks.filter(function(x) {
      return x.id === f.step;
    })[0] : null;
    var at = b ? b.start : l.stop || Date.now();
    var slot = model.slotAt(at);
    var body = {
      craa5_name: ("Weekend " + weekend + " " + l.name + " " + f.reason).slice(0, 100),
      craa5_kind: "Weekend clean",
      craa5_occurredon: pbIsoZ(at),
      craa5_minuteslost: Math.round(f.minutes),
      craa5_reason: String(f.reason).slice(0, 50),
      craa5_description: String(f.text || "").slice(0, 4e3),
      craa5_equipment: b ? (b.kind === "mnt" ? "Maintenance PM/CM" : b.name).slice(0, 200) : "",
      craa5_area: l.name.slice(0, 100),
      craa5_department: f.dept,
      craa5_status: "Open",
      craa5_crew: slot ? slot.key.slice(0, 10) : "",
      craa5_loggedby: pbUserName(),
      craa5_data: JSON.stringify({ app: "pbed", weekend, areaKey: l.key, stepKey: f.step || "", heads: f.heads || 1 })
    };
    setBusy(true);
    saveOwn("timeloss", null, body).then(function() {
      setBusy(false);
      done();
      setMsg({ tone: "good", text: pbT("Time loss added.") });
    }, function(e) {
      setBusy(false);
      setMsg({ tone: "bad", text: pbT("Not saved: {err}", { err: pbErrText(e) }) });
    });
  }
  function importWos(rows, done) {
    var who = pbUserName();
    var frame = model.frame;
    setBusy(true);
    var chain = Promise.resolve();
    var n = 0;
    var errs = [];
    rows.forEach(function(r) {
      chain = chain.then(function() {
        var existing = model.wos.filter(function(w) {
          return w.order === r.order;
        })[0];
        var body = { craa5_name: r.order, craa5_priority: r.priority.slice(0, 10), craa5_description: r.description.slice(0, 500), craa5_assetdescription: r.assetDesc.slice(0, 200), craa5_ordertype: r.orderType.slice(0, 20), craa5_functionallocation: r.floc.slice(0, 100), craa5_basicstart: r.basicStart ? pbIsoZ(r.basicStart) : null, craa5_workcenter: r.workCenter.slice(0, 50), craa5_sortfield: r.sortField.slice(0, 100), craa5_importedby: who, craa5_importedon: (/* @__PURE__ */ new Date()).toISOString() };
        if (!existing) {
          body.craa5_status = "Open";
          body.craa5_weekendkey = r.basicStart !== null && r.basicStart <= frame.focusEnd ? weekend : "";
          var sug = pbSuggestAsset(r, model.assets, model.maps);
          if (sug.how === "saved") {
            var a = model.assets.filter(function(x) {
              return x.id === sug.assetId;
            })[0];
            body.craa5_assetguid = sug.assetId;
            body.craa5_areakey = sug.areaKey;
            body.craa5_equipment = a ? a.name.slice(0, 200) : sug.map.equipment;
          }
        }
        return saveOwn("workorder", existing ? existing.id : null, body, existing ? existing.raw : null).then(function() {
          n++;
        }, function(e) {
          errs.push(r.order + ": " + pbErrText(e));
        });
      });
    });
    chain.then(function() {
      setBusy(false);
      setMsg({ tone: errs.length ? "bad" : "good", text: pbTn(n, "{n} work order saved.", "{n} work orders saved.") + (errs.length ? " " + pbT("Not saved: {err}", { err: errs.slice(0, 3).join("; ") }) : "") });
      if (!errs.length) done();
    });
  }
  function mapWo(w, a, areaKey) {
    var body = { craa5_assetguid: a ? a.id : "", craa5_equipment: a ? a.name.slice(0, 200) : "", craa5_areakey: a ? a.areaKey : areaKey };
    setBusy(true);
    saveOwn("workorder", w.id, body, w.raw).then(function() {
      if (!a || !w.floc) return;
      var key = pbFlocKey(w.floc, w.assetDesc);
      var old = model.maps[key];
      return saveOwn("flocmap", old ? old.id : null, { craa5_name: key, craa5_functionallocation: w.floc.slice(0, 100), craa5_assetdescription: w.assetDesc.slice(0, 200), craa5_assetguid: a.id, craa5_equipment: a.name.slice(0, 200), craa5_areakey: a.areaKey, craa5_mappedby: pbUserName() });
    }).then(function() {
      setBusy(false);
    }, function(e) {
      setBusy(false);
      setMsg({ tone: "bad", text: pbT("Not saved: {err}", { err: pbErrText(e) }) });
    });
  }
  var devAllowed = configMetaState[0].loaded && (config.devUsers && config.devUsers.length ? !!user && pbIsDev(user, config.devUsers) : true);
  var devOpen = devAllowed && devOpenState[0];
  function onLogo() {
    if (!devAllowed) {
      setMsg({ tone: "info", text: pbT("The developer tools are locked to other accounts.") });
      return;
    }
    var next = !devOpenState[0];
    devOpenState[1](next);
    pbWriteSession(PB_DEV_KEY, next ? "1" : null);
    if (next) tabState[1]("setup");
    else if (tab === "setup" || tab === "data") tabState[1]("plan");
  }
  var tabs = PB_TABS.concat(devOpen ? PB_DEV_TABS : []);
  var shownTab = (tab === "setup" || tab === "data") && !devOpen ? "plan" : tab;
  function setLang(l) {
    pbSetLang(l);
    hubSetLang(l);
    pbDropLocal("pb_lang");
    langState[1](l);
    setMsg(null);
  }
  function setTheme(t) {
    hubSetTheme(t);
    pbDropLocal("pb_theme");
    themeState[1](t);
  }
  var m = model;
  var canSave = {};
  PB_OWN.forEach(function(k) {
    canSave[k] = !!(probes[k] && probes[k].state === "found");
  });
  var noHost = !pbWeb() && !(dataApi && dataApi.queryTable);
  var problems = [];
  if (data.assets.err) problems.push(pbT("Equipment (assets) could not be read: {err}", { err: data.assets.err }));
  else if (data.assets.rows && !data.assets.rows.length) problems.push(pbT("The assets table has no active rows, so there are no milestones."));
  if (data.runs.err) problems.push(pbT("The production schedule could not be read: {err}. Stop and restart times must be typed by hand.", { err: data.runs.err }));
  if (data.employees.err) problems.push(pbT("Employees could not be read: {err}", { err: data.employees.err }));
  var mdl = modal;
  var ml = mdl && mdl.key ? m.lines.filter(function(l) {
    return l.key === mdl.key;
  })[0] : null;
  var mb = ml && ml.sched && mdl.id ? ml.sched.blocks.filter(function(b) {
    return b.id === mdl.id;
  })[0] : null;
  var ms = mdl && mdl.type === "slot" ? m.slots.filter(function(s) {
    return s.start === mdl.start;
  })[0] : null;
  function close() {
    setModal(null);
  }
  function goWeekend(s) {
    if (s === weekend) return;
    setWeekend(s);
    setModal(null);
    setPlan(pbEmptyPlan(s));
    setPlanMeta({ id: null, version: 0, savedBy: "", savedOn: null, dirty: false, draftAt: null, loaded: false, wk: "" });
  }
  function shiftWeekend(n) {
    goWeekend(pbYmd(pbAddDays(pbFromYmd(weekend), 7 * n)));
  }
  var dark = theme === "dark";
  var th = dark ? PB_THEME.dark : PB_THEME.light;
  var first = user && user.first ? user.first : "";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: rootRef,
      className: "pb-root " + (dark ? "pb-dark" : ""),
      "data-theme": theme,
      lang: lang === "es" ? "es-MX" : "en",
      style: { height: heightState[0] ? heightState[0] : "100vh", overflowY: "auto", overflowX: "hidden", backgroundColor: th.page, color: th.text, fontFamily: "'Segoe UI', Arial, sans-serif", position: "relative" }
    },
    /* @__PURE__ */ React.createElement("header", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 pb-noprint" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 px-4 py-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mr-2" }, /* @__PURE__ */ React.createElement(PbLogo, { onClick: onLogo, open: devOpen, allowed: devAllowed }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-black text-[#00468B] leading-tight", "data-welcome": "1" }, first ? pbT("Welcome, {name}, to the PBED", { name: first }) : pbT("Welcome to the PBED")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500 leading-tight" }, pbT("Plan - Brief - Execute - Debrief"), " - ", pbT("weekend cleans")))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-1" }, /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      shiftWeekend(-1);
    }, title: pbT("Weekend before") }, pbT("Prev")), /* @__PURE__ */ React.createElement("input", { type: "date", key: weekend, className: "border border-slate-300 rounded-lg px-2 py-1.5 text-sm", defaultValue: weekend, onChange: function(e) {
      var s = pbSatOf(e.target.value);
      if (s) goWeekend(s);
    }, "aria-label": pbT("Weekend") }), /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      shiftWeekend(1);
    }, title: pbT("Weekend after") }, pbT("Next")), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-slate-600 ml-1" }, pbT("Weekend of {date}", { date: pbFmtDate(m.frame.sat.getTime()) }), m.secondWeekend ? " " + pbT("(2nd of the month)") : "")), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex rounded-lg border border-slate-300 overflow-hidden", role: "group", "aria-label": pbT("Language") }, [["en", "EN"], ["es", "ES"]].map(function(x) {
      return /* @__PURE__ */ React.createElement("button", { key: x[0], type: "button", "data-lang": x[0], onClick: function() {
        setLang(x[0]);
      }, "aria-pressed": lang === x[0], title: x[0] === "en" ? "English" : "Espa" + String.fromCharCode(241) + "ol (M" + String.fromCharCode(233) + "xico)", className: "px-2.5 py-1.5 text-xs font-black " + (lang === x[0] ? "bg-[#0072CE] text-white" : "bg-white text-slate-600 hover:bg-slate-100") }, x[1]);
    })), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
      setTheme(dark ? "light" : "dark");
    }, title: dark ? pbT("Light mode") : pbT("Dark mode"), label: dark ? pbT("Light mode") : pbT("Dark mode"), pressed: dark }, /* @__PURE__ */ React.createElement(PbIcon, { name: dark ? "sun" : "moon", size: 18 })), /* @__PURE__ */ React.createElement(PbBtn, { kind: "ghost", onClick: function() {
      setModal({ type: "help" });
    }, title: pbT("Help"), label: pbT("Help"), className: "font-black text-base" }, "?"), planMeta.dirty ? /* @__PURE__ */ React.createElement(PbChip, { cls: "bg-amber-50 text-amber-700 border-amber-200" }, pbT("Unsaved changes"), planMeta.draftAt ? " " + pbT("from {at}", { at: pbFmtDayTime(planMeta.draftAt) }) : "") : planMeta.savedOn ? /* @__PURE__ */ React.createElement(PbChip, { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", title: pbT("Version {v}", { v: planMeta.version }) }, pbT("Saved {at}", { at: pbFmtDayTime(planMeta.savedOn) }), planMeta.savedBy ? " " + pbT("by {who}", { who: planMeta.savedBy }) : "") : /* @__PURE__ */ React.createElement(PbChip, null, pbT("Not saved yet")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "primary", disabled: busy || !planMeta.dirty || !planReady, onClick: function() {
      savePlan(false);
    } }, busy ? pbT("Saving...") : pbT("Save plan")))), /* @__PURE__ */ React.createElement("nav", { className: "flex gap-1 px-3 pb-2 pb-tabs", style: { overflowX: "auto" }, role: "tablist" }, tabs.map(function(t) {
      return /* @__PURE__ */ React.createElement("button", { key: t[0], type: "button", "data-testtab": t[0], role: "tab", "aria-selected": shownTab === t[0], onClick: function() {
        tabState[1](t[0]);
      }, className: "px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap inline-flex items-center gap-1 " + (shownTab === t[0] ? "bg-[#0072CE] text-white" : "text-[#00468B] hover:bg-[#E6F1FB]") }, t[0] === "setup" || t[0] === "data" ? /* @__PURE__ */ React.createElement(PbIcon, { name: "lock", size: 12 }) : null, pbT(t[1]));
    }))),
    /* @__PURE__ */ React.createElement("main", { className: "p-3 sm:p-4 space-y-4 max-w-[1600px] mx-auto" }, twState[0] === "failed" && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, pbT("The page styling (cdn.tailwindcss.com) did not load on this computer, so the page looks plain. Everything still works.")), noHost && /* @__PURE__ */ React.createElement(PbNote, { tone: "bad" }, pbT("This page is not connected to Dataverse (no Xrm.WebApi and no dataApi). Open it inside the model-driven app. Nothing below is real data until it is.")), loadingState[0] && !noHost && /* @__PURE__ */ React.createElement(PbNote, null, pbT("Reading equipment, shifts and employees from Dataverse...")), problems.map(function(p, i) {
      return /* @__PURE__ */ React.createElement(PbNote, { key: i, tone: "warn" }, p);
    }), msg && /* @__PURE__ */ React.createElement(PbNote, { tone: msg.tone }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, msg.text), /* @__PURE__ */ React.createElement("button", { type: "button", className: "font-bold", onClick: function() {
      setMsg(null);
    } }, pbT("Dismiss")))), devOpen && (!config.devUsers || !config.devUsers.length) && shownTab !== "setup" && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, pbT("The developer tools are not locked to anyone yet. Lock them on Setup.")), /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      tabState[1]("setup");
    } }, pbT("Open Setup")))), planMeta.draftAt && planMeta.dirty && /* @__PURE__ */ React.createElement(PbNote, { tone: "warn" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, pbT("These are unsaved changes kept on this computer from {at}", { at: pbFmtDayTime(planMeta.draftAt) }), planMeta.savedOn ? ", " + pbT("newer than the plan saved {at}", { at: pbFmtDayTime(planMeta.savedOn) }) : "", "."), /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      pbDropLocal("pb_draft_" + weekend);
      reloadState[1](reloadState[0] + 1);
    } }, pbT("Throw them away")))), shownTab === "plan" && /* @__PURE__ */ React.createElement(PbPlanTab, { m, act, plan }), shownTab === "brief" && /* @__PURE__ */ React.createElement(PbBriefTab, { m, act, plan, busy }), shownTab === "execute" && /* @__PURE__ */ React.createElement(PbExecuteTab, { key: weekend, m, act, busy, canSave, liveAt: liveState[0].at, liveBusy: liveState[0].busy }), shownTab === "debrief" && /* @__PURE__ */ React.createElement(PbDebriefTab, { m, act, busy, canSave }), shownTab === "workorders" && /* @__PURE__ */ React.createElement(PbWorkOrdersTab, { m, act, busy, canSave }), shownTab === "crew" && /* @__PURE__ */ React.createElement(PbCrewTab, { m, act, expState: expNoteState[0] }), shownTab === "setup" && /* @__PURE__ */ React.createElement(PbSetupTab, { m, act, config, busy, configDirty: configMetaState[0].dirty, canSave, user }), shownTab === "data" && /* @__PURE__ */ React.createElement(PbDataTab, { data, probes, planMax: planMaxState[0], planCol: planColState[0], onColumns: reprobePlanCol, dataApi, busy, onReload: function() {
      pbDropLocal(PB_EXP_CACHE);
      reloadState[1](reloadState[0] + 1);
    } })),
    mdl && mdl.type === "sub" && ml && mb && /* @__PURE__ */ React.createElement(PbSubModal, { m, line: ml, block: mb, act, plan, exp, onClose: close }),
    mdl && mdl.type === "mnt" && ml && /* @__PURE__ */ React.createElement(PbMntModal, { m, line: ml, block: mb, act, plan, onClose: close }),
    mdl && mdl.type === "step" && ml && mb && /* @__PURE__ */ React.createElement(PbStepModal, { line: ml, block: mb, act, plan, onClose: close }),
    mdl && mdl.type === "line" && ml && /* @__PURE__ */ React.createElement(PbLineModal, { line: ml, act, plan, onClose: close }),
    mdl && mdl.type === "slot" && ms && /* @__PURE__ */ React.createElement(PbSlotModal, { m, slot: ms, act, plan, onClose: close }),
    mdl && mdl.type === "person" && /* @__PURE__ */ React.createElement(PbPersonModal, { m, id: mdl.id, exp, onClose: close }),
    mdl && mdl.type === "actual" && ml && mb && /* @__PURE__ */ React.createElement(PbActualModal, { line: ml, block: mb, actual: m.act[ml.key + "|" + mb.id], busy, onClose: close, onSave: function(p) {
      saveActual(ml, mb, p);
      close();
    } }),
    mdl && mdl.type === "help" && /* @__PURE__ */ React.createElement(PbHelpModal, { tab: shownTab, onClose: close }),
    mdl && mdl.type === "conflict" && /* @__PURE__ */ React.createElement(PbModal, { title: pbT("Someone saved this plan after you opened it"), sub: pbT("Version {v}", { v: mdl.version }) + (mdl.by ? " " + pbT("by {who}", { who: mdl.by }) : ""), onClose: close }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-slate-600" }, pbT("Saving now would replace their changes with yours.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 justify-end" }, /* @__PURE__ */ React.createElement(PbBtn, { onClick: function() {
      pbDropLocal("pb_draft_" + weekend);
      close();
      reloadState[1](reloadState[0] + 1);
    } }, pbT("Load theirs (drop mine)")), /* @__PURE__ */ React.createElement(PbBtn, { kind: "danger", onClick: function() {
      close();
      savePlan(true, mdl.version);
    } }, pbT("Save mine over theirs"))))
  );
}

})();