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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var React = window.React; var { useState, useEffect, useMemo, useCallback, useRef } = React;
// ============================================================================
// DATAVERSE MONITOR v2.2 (was: Midwest Plant Dataverse Ecosystem Organizer)
// v2.1: the table list comes from the shared data contract (ecosystem/contract.json).
// v2.2: reads each app's manifest (tables and columns it needs) from Hub config and checks it.
// One place to see whether every hub table is there, readable, and has the
// columns the apps need. v2.0 rule: never show green unless Dataverse itself
// confirmed it. Every table ends in one of: OK, Empty, Missing columns,
// Columns not checked, No permission, Missing, Could not tell.
// No row values are kept or printed. Browser storage is read, never written.
// Strict 7-bit ASCII build.
// ============================================================================
var LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDA0NjhCIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMDA0NjhCIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=";
var BRAND = { blue: '#0072CE', blueDark: '#00468B', blueSoft: '#E6F1FB', yellow: '#FFB81C', yellowSoft: '#FFF6E0', red: '#E4002B', redSoft: '#FDE8EC' };
var MONITOR_VERSION = 'v3.2.1';
var ORG_LANG_KEY = 'MidwestPlant_org_lang_v1';
var ORG_THEME_KEY = 'MidwestPlant_org_dark_v1';
// Spanish names for categories and tables (Spanish is plain ASCII, no accents, per workspace rules).
var ES_LABELS = {
    'Core Master Data': 'Datos maestros',
    'Shift Operations': 'Operacion de turnos',
    'Production & Clean Planning': 'Produccion y plan de limpieza',
    'MSS Compliance & Logging': 'Cumplimiento y registro MSS',
    'Shared Ecosystem Config & Audit': 'Configuracion compartida',
    'Facility Maps & BOLO': 'Mapas y BOLO',
    'Manager Hub & Specialty': 'Hub de gerente',
    'Chemical Hub': 'Hub de quimicos',
    'Floor work': 'Trabajo en piso',
    'Reference data': 'Datos de referencia',
    'Data passed between apps': 'Datos entre apps',
    'Other': 'Otras',
    'Named in app code, not confirmed': 'Nombrada en el codigo, sin confirmar',
    'Abandoned': 'Abandonada',
    'Old tables no app uses': 'Tablas viejas sin uso',
    'MSS Areas / Rooms': 'Areas / cuartos MSS',
    'Equipment Assets (Primary)': 'Equipos (principal)',
    'Master Sanitation SAP Assets': 'Equipos SAP de sanitizacion',
    'Employees Roster': 'Lista de empleados',
    'Leadership Teams': 'Equipos de liderazgo',
    'Work Shifts Rotation': 'Rotacion de turnos',
    'Live Shift Boards': 'Tableros de turno en vivo',
    'Planned Shift & PBED Setups': 'Turnos planeados y PBED',
    'Archived Shift Boards': 'Tableros archivados',
    'Shift Presets (Templates)': 'Plantillas de turno',
    'Shift Audit Log': 'Bitacora de turnos',
    'Row-Level Task Assignments': 'Asignaciones de tareas',
    'Ganttly Live Equipment Checkoffs': 'Marcas de equipo Ganttly',
    'Production Schedule Runs': 'Corridas de produccion',
    'Published Sanitation Clean Plan': 'Plan de limpieza publicado',
    'Production Line Priorities': 'Prioridades de lineas',
    'Line Changeover Rules': 'Reglas de cambio de linea',
    'SKU Master Catalog': 'Catalogo de SKU',
    'Sanitation Completion Log': 'Registro de limpiezas',
    'Sanitation Schedule Events': 'Eventos del calendario',
    'Shared Hub Configuration Store': 'Configuracion del hub',
    'Facility Observations & Harborage Pins': 'Observaciones y pines',
    'Facility Floor Maps': 'Mapas de planta',
    'Pathogen BOLO Swab Catalog': 'Catalogo de hisopos BOLO',
    'Supervisor To-Do Tasks': 'Pendientes de supervisor',
    'Manager Form Templates': 'Plantillas de formularios',
    'Manager Time Loss Log': 'Registro de tiempo perdido',
    'Manager Quick Tasks': 'Tareas rapidas',
    'Chemicals': 'Quimicos',
    'Distributors': 'Distribuidores',
    'Chemical Inventory': 'Inventario de quimicos',
    'Carts (SAP Orders)': 'Carritos (pedidos SAP)',
    'Cart Lines': 'Lineas de carrito',
    'Chemical Counts': 'Conteos de quimicos',
    'Chemical Usage Log': 'Registro de uso de quimicos',
    'Area Aliases': 'Alias de areas',
    'Chemical Aliases': 'Alias de quimicos',
    'Titration Targets': 'Metas de titulacion',
    'Checklist Tasks': 'Tareas de lista',
    'Clerk Checklists': 'Listas del auxiliar',
    'Chemical Standards': 'Estandares de quimicos',
    'Sanitation Budget': 'Presupuesto de sanitizacion'
};
function esLabel(lang, en) { return lang === 'es' && ES_LABELS[en] ? ES_LABELS[en] : en; }
// Generated from ecosystem-contract/contract.json (version 1.0.69). Do not edit by hand; rebuild from the contract.
var CONTRACT_VERSION = '1.0.69';
var CONTRACT_TABLES = [
    { "logicalName": "craa5___1_a_mss_area", "entitySetName": "craa5___1_a_mss_areas", "primaryId": "craa5___1_a_mss_areaid", "primaryName": "craa5_area", "status": "live", "ownership": "User", "group": "reference", "writers": ["Admin (model-driven form)"], "readers": ["Production Scheduler", "Shift Start", "Ganttly", "MSS Calendar", "MSS Log Input", "Manager hub", "PBED", "Map submission tool", "Pathogen BOLO"], "requiredCols": ["craa5___1_a_mss_areaid", "craa5_area"], "keys": [{ "column": "craa5_area", "kind": "area", "mustMatch": "primary key (name)" }], "candidates": ["craa5___1_a_mss_area"], "notes": "Area name is the area key. Line setup columns read by Scheduler and Ganttly.", "columnOwners": [{ "columns": ["craa5_clipboard"], "writer": "Shift Start" }] },
    { "logicalName": "craa5___1_a_assets", "entitySetName": "craa5___1_a_assetses", "primaryId": "craa5___1_a_assetsid", "primaryName": "craa5_equipmentidentifier", "status": "live", "ownership": "User", "group": "reference", "writers": ["Admin (model-driven form)"], "readers": ["Production Scheduler", "Shift Start", "Ganttly", "MSS Calendar", "MSS Log Input", "Manager hub", "PBED", "Map submission tool", "Pathogen BOLO", "Sanitation director"], "requiredCols": ["craa5___1_a_assetsid", "craa5_equipmentidentifier", "craa5_areaname", "craa5_roomname", "craa5_hoursrequired", "craa5_dailyclean", "craa5_weeklyclean", "craa5_monthlyclean", "craa5_midweek"], "keys": [{ "column": "craa5___1_a_assetsid", "kind": "equipment", "mustMatch": "primary key (GUID)" }, { "column": "craa5_areaname", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_workareacode", "kind": "sapw", "mustMatch": "craa5___1_a_assets.craa5_title" }], "candidates": ["craa5___1_a_assets"], "notes": "craa5_hoursrequired = standard labor MINUTES. craa5_uniqueid = number shown to people. craa5_midweek exists. craa5_eggallergen / craa5_pecanallergen flags exist (2026-10-22); craa5_allergenclean is the old combined flag. craa5_month = 6-month (semiannual) flag (meant to be craa5_6month). Optional (table-prompts part 7, not yet made): craa5_eggminutes, craa5_pecanminutes; craa5_minalrg = old combined allergen minutes; egg/pecan minutes mean the same per allergen (labor person-minutes), blank or 0 = use craa5_minalrg.", "optionalCols": ["craa5_eggallergen", "craa5_eggminutes", "craa5_pecanallergen", "craa5_pecanminutes", "craa5_minalrg"], "columnOwners": [{ "columns": ["craa5_dailyclean", "craa5_midweek", "craa5_weeklyclean", "craa5_monthlyclean", "craa5_month", "craa5_quarterly", "craa5_annually", "craa5_eggallergen", "craa5_pecanallergen"], "writer": "MSS Calendar" }, { "columns": ["craa5_maplocation", "craa5_picture", "craa5_pictureofequipment"], "writer": "Map submission tool" }], "colTypes": { "craa5_eggminutes": { "type": "int" }, "craa5_pecanminutes": { "type": "int" }, "craa5_eggallergen": { "type": "yesno" }, "craa5_pecanallergen": { "type": "yesno" } } },
    { "logicalName": "craa5___1_a_assets", "entitySetName": "craa5___1_a_assetses", "primaryId": "craa5___1_a_assetsid", "primaryName": "craa5_title", "status": "live", "ownership": "User", "group": "reference", "writers": ["Admin (model-driven form)", "MSS Log Input"], "readers": ["MSS Log Input", "MSS Calendar", "Production Scheduler"], "requiredCols": ["craa5___1_a_assetsid", "craa5_title", "craa5_equipment"], "keys": [{ "column": "craa5_textarea", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }], "candidates": ["craa5___1_a_assets"], "notes": "craa5_hourstoclean read as minutes (open question Q3)." },
    { "logicalName": "craa5___1_a_employee", "entitySetName": "craa5___1_a_employees", "primaryId": "craa5___1_a_employeeid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "reference", "writers": ["Manager hub", "Admin (model-driven form)"], "readers": ["Production Scheduler", "Shift Start", "Ganttly", "MSS Calendar", "MSS Log Input", "Manager hub", "PBED", "Sanitation director"], "requiredCols": ["craa5___1_a_employeeid", "craa5_name", "craa5_shift", "craa5_role"], "keys": [{ "column": "craa5___1_a_employeeid", "kind": "employee", "mustMatch": "primary key (GUID)" }, { "column": "craa5_shift", "kind": "crew", "mustMatch": "A-D via hubCrew" }, { "column": "craa5_email", "kind": "user", "mustMatch": "systemuser.internalemailaddress" }, { "column": "craa5_roleid", "kind": "payrole", "mustMatch": "lookup to craa5___1_a_role; its display name = craa5___1_e_laborrate.craa5_role (any case)" }], "candidates": ["craa5___1_a_employee"], "notes": "Role 256000000 Sanitor, 256000001 Lead, 256000002 Supervisor (hub role). craa5_roleid = pay role (lookup to craa5___1_a_role). Leavers = statecode 1 (Shift Start \"No longer with us\" sets statecode/statuscode only; nothing is deleted).", "optionalCols": ["craa5_roleid"], "columnOwners": [{ "columns": ["craa5_remarks", "craa5_remarkcategory"], "writer": "Ganttly" }, { "columns": ["statecode", "statuscode"], "writer": "Shift Start" }] },
    { "logicalName": "craa5___1_a_leadershipteam", "entitySetName": "craa5___1_a_leadershipteams", "primaryId": "craa5___1_a_leadershipteamid", "primaryName": "craa5_teamname", "status": "live", "ownership": "User", "group": "reference", "writers": ["Admin (model-driven form)"], "readers": ["Shift Start"], "requiredCols": ["craa5___1_a_leadershipteamid", "craa5_teamname"], "keys": [], "candidates": ["craa5___1_a_leadershipteam"], "notes": "" },
    { "logicalName": "craa5___1_a_workshift", "entitySetName": "craa5___1_a_workshifts", "primaryId": "craa5___1_a_workshiftid", "primaryName": "craa5_dayname", "status": "live", "ownership": "User", "group": "reference", "writers": ["Admin (model-driven form)"], "readers": ["Shift Start", "Ganttly", "Production Scheduler", "Manager hub", "Sanitation director"], "requiredCols": ["craa5___1_a_workshiftid", "craa5_shiftcode", "craa5_dayname", "craa5_daynumber", "craa5_shiftstarthour", "craa5_shiftendhour"], "keys": [{ "column": "craa5_shiftcode", "kind": "crew", "mustMatch": "A-D" }], "candidates": ["craa5___1_a_workshift"], "notes": "" },
    { "logicalName": "craa5___1_p_linepriority", "entitySetName": "craa5___1_p_linepriorities", "primaryId": "craa5___1_p_linepriorityid", "primaryName": "craa5_linepriority1", "status": "live", "ownership": "User", "group": "reference", "writers": ["Manager hub", "Production Scheduler"], "readers": ["Ganttly", "Production Scheduler"], "requiredCols": ["craa5___1_p_linepriorityid", "craa5_linepriority1", "craa5_priority"], "keys": [], "candidates": ["craa5___1_p_linepriority"], "notes": "" },
    { "logicalName": "craa5___1_p_changeoverrule", "entitySetName": "craa5___1_p_changeoverrules", "primaryId": "craa5___1_p_changeoverruleid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "reference", "writers": ["Production Scheduler"], "readers": ["Production Scheduler", "PBED"], "requiredCols": ["craa5___1_p_changeoverruleid", "craa5_name", "craa5_line"], "keys": [], "candidates": ["craa5___1_p_changeoverrule"], "notes": "The clean rules per line live here only. Proposed (Scheduler game plan 2026-10-23, not approved): craa5_ruletype values together, apart, nights-only, clean-order, details in craa5_rule_condition_json. No new columns." },
    { "logicalName": "craa5___1_p_skumaster", "entitySetName": "craa5___1_p_skumasters", "primaryId": "craa5___1_p_skumasterid", "primaryName": "craa5_skucode", "status": "live", "ownership": "User", "group": "reference", "writers": ["Production Scheduler"], "readers": ["Production Scheduler"], "requiredCols": ["craa5___1_p_skumasterid", "craa5_skucode"], "keys": [], "candidates": ["craa5___1_p_skumaster"], "notes": "" },
    { "logicalName": "craa5___1_e_laborrate", "entitySetName": "(probe)", "primaryId": "craa5___1_e_laborrateid", "primaryName": "craa5_name", "status": "live", "ownership": "Organization", "group": "reference", "writers": ["Admin (model-driven form)"], "readers": ["Manager hub", "PBED", "Ganttly", "Sanitation director"], "requiredCols": ["craa5_name", "craa5_role", "craa5_hourlyrate", "craa5_effectivefrom"], "keys": [{ "column": "craa5_role", "kind": "payrole", "mustMatch": "craa5___1_a_employee.craa5_roleid (trimmed, any case)" }], "candidates": ["craa5___1_e_laborrate", "craa5_e_laborrate", "craa5_laborrate"], "notes": "The only labor rate. Currency. Rows entered by hand (Alex). Roles as made 2026-10-23: sanitation tech 1, sanitation tech 2, sanitation tech 3, Adm, Int. Rate for a role = newest Effective from on or before the shift date; fallback role sanitation tech 2, then Sanitor, then All; else no rate set.", "colTypes": { "craa5_role": { "type": "text", "len": 50 }, "craa5_hourlyrate": { "type": "money" }, "craa5_effectivefrom": { "type": "date" }, "craa5_notes": { "type": "memo" } } },
    { "logicalName": "craa5___1_p_prodschedule", "entitySetName": "craa5___1_p_prodschedules", "primaryId": "craa5___1_p_prodscheduleid", "primaryName": "craa5_area", "status": "live", "ownership": "User", "group": "flow", "writers": ["Production Scheduler"], "readers": ["Ganttly", "Shift Start", "MSS Calendar", "PBED", "Manager hub"], "requiredCols": ["craa5___1_p_prodscheduleid", "craa5_area", "craa5_line", "craa5_datestarttime", "craa5_dateendtime", "craa5_product"], "keys": [{ "column": "craa5___1_p_prodscheduleid", "kind": "run", "mustMatch": "primary key (GUID)" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }], "candidates": ["craa5___1_p_prodschedule"], "notes": "Line key = hubLineKey(craa5_area, craa5_line). craa5_cleanoverride (Scheduler only): midweek|who|why, skip|who|why, pin|who|why|YYYY-MM-DDTHH:MM (plant time; Scheduler v4.6)." },
    { "logicalName": "craa5___1_p_cleanplan", "entitySetName": "craa5___1_p_cleanplans", "primaryId": "craa5___1_p_cleanplanid", "primaryName": "craa5_cleanplanname", "status": "live", "ownership": "Organization", "group": "flow", "writers": ["Production Scheduler"], "readers": ["Ganttly", "Shift Start", "MSS Calendar", "PBED", "Manager hub", "Sanitation director"], "requiredCols": ["craa5___1_p_cleanplanid", "craa5_plankey", "craa5_rowtype", "craa5_linekey", "craa5_start", "craa5_end", "craa5_day", "craa5_cleankind", "craa5_minutes", "craa5_status", "craa5_details"], "keys": [{ "column": "craa5_plankey", "kind": "cleanwindow", "mustMatch": "primary key (text)" }, { "column": "craa5_linekey", "kind": "line", "mustMatch": "hubLineKey" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_mssareaguid", "kind": "areaguid", "mustMatch": "craa5___1_a_mss_area.craa5___1_a_mss_areaid" }], "candidates": ["craa5___1_p_cleanplan"], "notes": "Reader guide: production-schedule/clean-plan-contract.md (summary in data-contract.md 6.5). Rowtypes also scope (s|line|kind|part) and alert (a|over72|..., status open/approved). Kinds: allergen, weekly(=eow), midweek, full(=daily), changeover, none. Rowtypes window/day/week/config/alert. Plan keys w|prev|next, o|prev|next, d|line|day, k|Monday, config. Dates UTC. Proposed (not approved): rowtype staff, key f|YYYY-MM-DD|crew, one row per day and crew (heads needed, heads on crew, hours used, peak hour); no new columns." },
    { "logicalName": "craa5___1_p_schedulechange", "entitySetName": "craa5___1_p_schedulechanges", "primaryId": "craa5___1_p_schedulechangeid", "primaryName": "", "status": "proposed", "ownership": "User", "group": "flow", "writers": ["Production Scheduler"], "readers": ["Production Scheduler"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_p_schedulechange"], "notes": "Schedule change email inbox. Optional: only needed if Alex wants the inbox; the Scheduler works without it. The monitor lists it as a table he can build." },
    { "logicalName": "craa5___1_s_shiftboard", "entitySetName": "craa5___1_s_shiftboards", "primaryId": "craa5___1_s_shiftboardid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "flow", "writers": ["Shift Start"], "readers": ["Ganttly", "Manager hub", "PBED", "Sanitation director"], "requiredCols": ["craa5___1_s_shiftboardid", "craa5_boardjson", "craa5_crew", "craa5_slotstart", "craa5_status"], "keys": [{ "column": "craa5_crew", "kind": "crew", "mustMatch": "A-D" }, { "column": "craa5_slotstart", "kind": "shiftdate", "mustMatch": "hubShiftDate" }], "candidates": ["craa5___1_s_shiftboard"], "notes": "Shift Start writes boardjson; Ganttly writes only craa5_updatesjson.", "columnOwners": [{ "columns": ["craa5_updatesjson"], "writer": "Ganttly" }], "colTypes": { "craa5_boardjson": { "type": "memo", "len": 1048576, "label": "Board json" }, "craa5_status": { "type": "text", "len": 50, "label": "Status" }, "craa5_crew": { "type": "text", "len": 10, "label": "Crew" }, "craa5_team": { "type": "text", "len": 200, "label": "Team" }, "craa5_slotstart": { "type": "datetime", "label": "Slot start" }, "craa5_slotend": { "type": "datetime", "label": "Slot end" }, "craa5_savecount": { "type": "int", "label": "Save count" }, "craa5_lastsavedby": { "type": "text", "len": 200, "label": "Last saved by" }, "craa5_archivedon": { "type": "datetime", "label": "Archived on" }, "craa5_archivedby": { "type": "text", "len": 200, "label": "Archived by" } } },
    { "logicalName": "craa5___1_s_shiftplan", "entitySetName": "craa5___1_s_shiftplans", "primaryId": "craa5___1_s_shiftplanid", "primaryName": "craa5_shiftplan1", "status": "live", "ownership": "User", "group": "flow", "writers": ["Shift Start"], "readers": ["Shift Start", "Ganttly", "PBED"], "requiredCols": ["craa5___1_s_shiftplanid", "craa5_boardjson"], "keys": [], "candidates": ["craa5___1_s_shiftplan"], "notes": "", "colTypes": { "craa5_boardjson": { "type": "memo", "len": 1048576, "label": "Board json" }, "craa5_status": { "type": "text", "len": 50, "label": "Status" }, "craa5_crew": { "type": "text", "len": 10, "label": "Crew" }, "craa5_team": { "type": "text", "len": 200, "label": "Team" }, "craa5_slotstart": { "type": "datetime", "label": "Slot start" }, "craa5_slotend": { "type": "datetime", "label": "Slot end" }, "craa5_savecount": { "type": "int", "label": "Save count" }, "craa5_lastsavedby": { "type": "text", "len": 200, "label": "Last saved by" }, "craa5_usedon": { "type": "datetime", "label": "Used on" }, "craa5_usedby": { "type": "text", "len": 200, "label": "Used by" }, "craa5_liveboardid": { "type": "text", "len": 100, "label": "Live board id" } } },
    { "logicalName": "craa5___1_s_shiftarchive", "entitySetName": "craa5___1_s_shiftarchives", "primaryId": "craa5___1_s_shiftarchiveid", "primaryName": "craa5_shiftarchive1", "status": "live", "ownership": "User", "group": "flow", "writers": ["Shift Start"], "readers": ["Manager hub", "Ganttly", "Sanitation director"], "requiredCols": ["craa5___1_s_shiftarchiveid", "craa5_boardjson"], "keys": [], "candidates": ["craa5___1_s_shiftarchive"], "notes": "Shift Start is the only archiver, including boards left open past their shift (close-out button, or archived by Shift Start when next opened). Ganttly stops its 4 h fallback archive (1.0.43).", "colTypes": { "craa5_boardjson": { "type": "memo", "len": 1048576, "label": "Board json" }, "craa5_status": { "type": "text", "len": 50, "label": "Status" }, "craa5_crew": { "type": "text", "len": 10, "label": "Crew" }, "craa5_team": { "type": "text", "len": 200, "label": "Team" }, "craa5_slotstart": { "type": "datetime", "label": "Slot start" }, "craa5_slotend": { "type": "datetime", "label": "Slot end" }, "craa5_savecount": { "type": "int", "label": "Save count" }, "craa5_lastsavedby": { "type": "text", "len": 200, "label": "Last saved by" }, "craa5_archivedon": { "type": "datetime", "label": "Archived on" }, "craa5_archivedby": { "type": "text", "len": 200, "label": "Archived by" }, "craa5_updatesjson": { "type": "memo", "len": 1048576, "label": "Updates json" }, "craa5_source": { "type": "text", "len": 50, "label": "Source" }, "craa5_sourceboardid": { "type": "text", "len": 100, "label": "Source board id" }, "craa5_retiredon": { "type": "datetime", "label": "Retired on" } } },
    { "logicalName": "craa5___1_s_shiftpreset", "entitySetName": "craa5___1_s_shiftpresets", "primaryId": "craa5___1_s_shiftpresetid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "flow", "writers": ["Shift Start"], "readers": ["Shift Start"], "requiredCols": ["craa5___1_s_shiftpresetid", "craa5_name", "craa5_boardjson"], "keys": [], "candidates": ["craa5___1_s_shiftpreset"], "notes": "" },
    { "logicalName": "craa5___1_s_updatepreset", "entitySetName": "craa5___1_s_updatepresets", "primaryId": "craa5___1_s_updatepresetid", "primaryName": "craa5_updatepreset1", "status": "live", "ownership": "User", "group": "flow", "writers": ["Shift Start"], "readers": ["Shift Start"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_s_updatepreset"], "notes": "", "colTypes": { "craa5_configjson": { "type": "memo", "len": 100000, "label": "Config json" }, "craa5_ownerkey": { "type": "text", "len": 100, "label": "Owner key" }, "craa5_ownername": { "type": "text", "len": 100, "label": "Owner name" }, "craa5_useforall": { "type": "yesno", "label": "Use for all" }, "craa5_isownerdefault": { "type": "yesno", "label": "Is owner default" } } },
    { "logicalName": "craa5___1_s_shiftlog", "entitySetName": "craa5___1_s_shiftlogs", "primaryId": "craa5___1_s_shiftlogid", "primaryName": "craa5_action", "status": "live", "ownership": "User", "group": "flow", "writers": ["Shift Start", "MSS Log Input"], "readers": ["Manager hub", "Dataverse monitor"], "requiredCols": ["craa5___1_s_shiftlogid", "craa5_action"], "keys": [], "candidates": ["craa5___1_s_shiftlog"], "notes": "Ganttly is not a writer: its archive log row went with its fallback archive (1.0.43/1.0.44).", "colTypes": { "craa5_details": { "type": "memo", "len": 1048576, "label": "Details" }, "craa5_user": { "type": "text", "len": 200, "label": "User" }, "craa5_useremail": { "type": "text", "len": 200, "label": "User email" }, "craa5_role": { "type": "text", "len": 50, "label": "Role" }, "craa5_board": { "type": "text", "len": 200, "label": "Board" }, "craa5_boardid": { "type": "text", "len": 100, "label": "Board id" }, "craa5_crew": { "type": "text", "len": 10, "label": "Crew" }, "craa5_team": { "type": "text", "len": 200, "label": "Team" }, "craa5_summary": { "type": "memo", "len": 4000, "label": "Summary" }, "craa5_app": { "type": "text", "len": 50, "label": "App" }, "craa5_at": { "type": "datetime", "label": "At" } } },
    { "logicalName": "craa5___1_s_taskassignment", "entitySetName": "craa5___1_s_taskassignments", "primaryId": "craa5___1_s_taskassignmentid", "primaryName": "craa5_id", "status": "legacy", "ownership": "User", "group": "flow", "writers": ["Shift Start"], "readers": ["Ganttly", "Manager hub", "PBED"], "requiredCols": ["craa5___1_s_taskassignmentid", "craa5_id", "craa5_area", "craa5_shift"], "keys": [{ "column": "craa5__aaemp_guid", "kind": "employee", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_shift", "kind": "crew", "mustMatch": "A-D" }], "candidates": ["craa5___1_s_taskassignment"], "notes": "Move readers to the board, then retire." },
    { "logicalName": "craa5___1_s_cleancheckoff", "entitySetName": "craa5___1_s_cleancheckoffs", "primaryId": "craa5___1_s_cleancheckoffid", "primaryName": "craa5_checkoffkey", "status": "live", "ownership": "User", "group": "flow", "writers": ["Ganttly"], "readers": ["Ganttly", "Manager hub", "PBED"], "requiredCols": ["craa5___1_s_cleancheckoffid", "craa5_checkoffkey", "craa5_status", "craa5_details"], "keys": [{ "column": "craa5_checkoffkey", "kind": "checkoff", "mustMatch": "primary key (text): Ganttly block id + \"~\" + first press time; row id = hubIdFromKey" }, { "column": "craa5_equipmentguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }, { "column": "craa5_completionkey", "kind": "completion", "mustMatch": "craa5___1_l_log.craa5_completionkey" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area (older rows may hold the room)" }, { "column": "craa5_employeeguids", "kind": "employees", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }], "candidates": ["craa5___1_s_cleancheckoff", "craa5__cleancheckoff", "craa5_ganttlycheckoff"], "notes": "Live Start/Done/Undo, one row per check-off, updated in place. Stored status: started, done, undone. Columns: craa5_startedat, craa5_doneat, craa5_keepuntil (date-time UTC), craa5_equipment (name), craa5_details JSON {status,parentId,name,startMs,durationMins,laneKeys,workMins,heads,updatedAt,startedAt,doneAt,noStart,syncAt}; proposed craa5_shiftdate, craa5_cleankind, craa5_completionkey, craa5_employeeguids. modifiedon = last change, for ordering only.", "colTypes": { "craa5_shiftdate": { "type": "text", "len": 10 }, "craa5_cleankind": { "type": "text", "len": 20 }, "craa5_completionkey": { "type": "text", "len": 200 }, "craa5_employeeguids": { "type": "memo", "len": 4000 } } },
    { "logicalName": "craa5___1_l_log", "entitySetName": "craa5___1_l_logs", "primaryId": "craa5___1_l_logid", "primaryName": "craa5_uid", "status": "live", "ownership": "User", "group": "flow", "writers": ["Ganttly", "MSS Log Input", "MSS Calendar"], "readers": ["MSS Calendar", "MSS Log Input", "Manager hub", "PBED", "Ganttly", "Sanitation director"], "requiredCols": ["craa5___1_l_logid", "craa5_equipmentguid", "craa5_lastcleaned", "craa5_lastcleanedby", "craa5_daily", "craa5_weekly", "craa5_monthly", "craa5_pathogen", "craa5_completionkey", "craa5_shiftdate", "craa5_cleankind", "craa5_laborminutes"], "keys": [{ "column": "craa5_equipmentguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }, { "column": "craa5_completionkey", "kind": "completion", "mustMatch": "hubCompletionKey, or key|2..key|9 for a separate entry by other people (MSS LOG WRITE v1.4); unique per row; count a clean once by the base key (trailing |n removed)" }, { "column": "craa5_sapw", "kind": "sapw", "mustMatch": "craa5___1_a_assets.craa5_workareacode" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_employeeguids", "kind": "employees", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }, { "column": "craa5_plankey", "kind": "cleanwindow", "mustMatch": "craa5___1_p_cleanplan.craa5_plankey" }, { "column": "craa5_linekey", "kind": "line", "mustMatch": "hubLineKey" }], "candidates": ["craa5___1_l_log"], "notes": "One row per piece per clean per shift date. Row id = hubLogIdOf(completionkey). Shift Start does not write. New columns: completionkey, shiftdate, shiftcode, cleankind, laborminutes, employeeguids, markedby, source, doneat, plankey, linekey.", "colTypes": { "craa5_sapw": { "type": "text", "len": 100 }, "craa5_completionkey": { "type": "text", "len": 200 }, "craa5_shiftdate": { "type": "text", "len": 10 }, "craa5_shiftcode": { "type": "text", "len": 5 }, "craa5_cleankind": { "type": "text", "len": 20 }, "craa5_laborminutes": { "type": "int" }, "craa5_employeeguids": { "type": "memo", "len": 4000 }, "craa5_markedby": { "type": "text", "len": 200 }, "craa5_source": { "type": "text", "len": 50 }, "craa5_doneat": { "type": "datetime" }, "craa5_plankey": { "type": "text", "len": 200 }, "craa5_linekey": { "type": "text", "len": 50 }, "craa5_equipmentguid": { "type": "guid" } }, "alternateKey": "craa5_completionkey" },
    { "logicalName": "craa5_mss_skipcode", "entitySetName": "craa5_mss_skipcodes", "primaryId": "craa5_mss_skipcodeid", "primaryName": "craa5_code", "status": "proposed", "ownership": "User", "group": "flow", "writers": [], "readers": ["MSS Calendar"], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_skipcode"], "notes": "Optional, not needed today: skip codes live in Hub config MSS_SKIP_CODES (writer MSS Log Input, 1.0.63). No app writes this table." },
    { "logicalName": "craa5___1_m_timelosslog", "entitySetName": "(probe)", "primaryId": "craa5___1_m_timelosslogid", "primaryName": "craa5_name", "status": "proposed", "ownership": "Organization", "group": "flow", "writers": ["Manager hub", "PBED"], "readers": ["Manager hub", "PBED"], "requiredCols": ["craa5_name", "craa5_kind", "craa5_occurredon", "craa5_minuteslost"], "keys": [{ "column": "craa5_assetguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }, { "column": "craa5_responsibleguid", "kind": "employee", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }, { "column": "craa5_crew", "kind": "crew", "mustMatch": "A-D" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }], "candidates": ["craa5___1_m_timelosslog", "craa5_timelosslog"], "notes": "Not made yet (monitor 2026-10-21); prompts in manager-hub-preview/v6.8/table-prompts.md." },
    { "logicalName": "craa5___1_p_plan", "entitySetName": "(probe)", "primaryId": "craa5___1_p_planid", "primaryName": "craa5_name", "status": "live", "ownership": "Organization", "group": "flow", "writers": ["PBED"], "readers": ["PBED", "Manager hub"], "requiredCols": ["craa5_weekendkey", "craa5_planjson"], "keys": [], "candidates": ["craa5___1_p_plan", "craa5_p_plan"], "notes": "" },
    { "logicalName": "craa5___1_p_milestone", "entitySetName": "(probe)", "primaryId": "craa5___1_p_milestoneid", "primaryName": "craa5_name", "status": "live", "ownership": "Organization", "group": "flow", "writers": ["PBED"], "readers": ["PBED"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_p_milestone"], "notes": "" },
    { "logicalName": "craa5___1_p_workorder", "entitySetName": "(probe)", "primaryId": "craa5___1_p_workorderid", "primaryName": "craa5_name", "status": "live", "ownership": "Organization", "group": "flow", "writers": ["PBED"], "readers": ["PBED"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_p_workorder"], "notes": "" },
    { "logicalName": "craa5___1_p_flocmap", "entitySetName": "(probe)", "primaryId": "craa5___1_p_flocmapid", "primaryName": "craa5_name", "status": "live", "ownership": "Organization", "group": "flow", "writers": ["PBED"], "readers": ["PBED"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_p_flocmap"], "notes": "" },
    { "logicalName": "craa5__facilityobservation", "entitySetName": "craa5__facilityobservations", "primaryId": "craa5__facilityobservationid", "primaryName": "craa5__area", "status": "live", "ownership": "User", "group": "other", "writers": ["Map submission tool", "Pathogen BOLO"], "readers": ["Pathogen BOLO", "Manager hub"], "requiredCols": ["craa5__facilityobservationid", "craa5__area"], "keys": [{ "column": "craa5__area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_equipmentguids", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid (kept in the order of craa5__equipment names)" }, { "column": "craa5_mssareaguid", "kind": "areaguid", "mustMatch": "craa5___1_a_mss_area.craa5___1_a_mss_areaid" }], "candidates": ["craa5__facilityobservation"], "notes": "Map tool owns the table. Pathogen BOLO creates its own pin rows only (a positive or a harborage concern: craa5_mapx, craa5_mapy, craa5__boxwidth, craa5__boxheight, craa5__room, craa5__area, craa5__equipment, craa5__description, craa5__whotonotify, craa5__customnote, craa5__facility, plus craa5_equipmentguids / craa5_mssareaguid once made), with a fixed row id hubIdFromKey(\"bolo|\" + swab key) so a re-push updates; it never edits a row the Map tool made. BOLO rows are marked by craa5__description starting \"(PATHOGEN BOLO - \" or \"(HARBORAGE CONCERN - \"; the Map tool shows them read only. Keep these prefixes stable. A few early pins (BOLO v2.4) carry an older id (hash of BOLO_HIT:: + hit id); find BOLO pins by the prefix, never by computing the id.", "colTypes": { "craa5_equipmentguids": { "type": "memo", "len": 4000 }, "craa5_mssareaguid": { "type": "guid" } } },
    { "logicalName": "craa5___1_g_maps", "entitySetName": "craa5___1_g_mapses", "primaryId": "craa5___1_g_mapsid", "primaryName": "craa5_facility", "status": "live", "ownership": "User", "group": "other", "writers": ["Map submission tool"], "readers": ["Pathogen BOLO"], "requiredCols": ["craa5___1_g_mapsid", "craa5_facility"], "keys": [], "candidates": ["craa5___1_g_maps"], "notes": "" },
    { "logicalName": "craa5_pathogenboloswabcatalog9900", "entitySetName": "craa5_pathogenboloswabcatalog9900s", "primaryId": "craa5_pathogenboloswabcatalog9900id", "primaryName": "craa5_pathogenboloswabcatalog99001", "status": "live", "ownership": "User", "group": "other", "writers": ["Pathogen BOLO"], "readers": ["Pathogen BOLO", "Ganttly", "Map submission tool"], "requiredCols": [], "keys": [{ "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_equipmentguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }], "candidates": ["craa5_pathogenboloswabcatalog9900"], "notes": "Gains text columns craa5_sitecode, craa5_area, craa5_equipmentguid, craa5_sapw (BOLO v2.2).", "colTypes": { "craa5_sitecode": { "type": "text", "len": 80 }, "craa5_area": { "type": "text", "len": 100 }, "craa5_equipmentguid": { "type": "guid", "len": 40 }, "craa5_sapw": { "type": "text", "len": 30 } } },
    { "logicalName": "craa5__b_swabresult", "entitySetName": "craa5__b_swabresults", "primaryId": "craa5__b_swabresultid", "primaryName": "craa5_name", "status": "live", "ownership": "Organization", "group": "other", "writers": ["Pathogen BOLO"], "readers": ["Manager hub", "Ganttly", "MSS Calendar"], "requiredCols": ["craa5_name", "craa5_sampleid", "craa5_collectiondate", "craa5_result", "craa5_sitecode", "craa5_area"], "keys": [{ "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_equipmentguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }, { "column": "craa5_sapw", "kind": "sapw", "mustMatch": "craa5___1_a_assets.craa5_workareacode" }, { "column": "craa5_sitecode", "kind": "swabsite", "mustMatch": "craa5_pathogenboloswabcatalog9900.craa5_sitecode" }, { "column": "craa5_closedkey", "kind": "completion", "mustMatch": "completion key of the MSS log row that closed it (any clean kind since BOLO v2.4)" }], "candidates": ["craa5__b_swabresult", "craa5_b_swabresult"], "notes": "Columns (text unless noted): craa5_name (\"sampleid | description\"), craa5_sampleid, craa5_sampledescription, craa5_testmethod, craa5_rawresult, craa5_collectiondate (YYYY-MM-DD plant day), craa5_result (positive/negative/pending/count/replaced; count = lab number with no pass or fail, replaced = superseded row, never deleted), craa5_test, craa5_stage, craa5_sitecode, craa5_swabzone, craa5_area, craa5_room, craa5_sapw, craa5_equipmentguid, craa5_assettag, craa5_surface, craa5_closedkey, craa5_closedon (YYYY-MM-DD), craa5_source. Row id = hubIdFromKey(\"swab|\" + sampleid + \"|\" + description + \"|\" + test) (BOLO v2.3: one row per test, so Listeria and Salmonella from one sponge are two rows). Open hits: craa5_result eq positive and craa5_closedkey null and statecode eq 0 and craa5_collectiondate ge (today - alertMonths from PATHOGEN_BOLO_RULES, default 2 months); older positives are history, never looked up for closure. Closed by ANY MSS log row of the same equipment GUID (or same area when the site has no equipment) with shift date on or after the collection date (Alex 2026-10-23: every clean follows the presumptive process). Results: > or TNTC readings on APC, ATP, coliform, yeast/mold = positive; EST is wording only (2,500 EST = 2500). count = a lab number: a pass in APC and ATP rates, in no rate elsewhere (Listeria, Salmonella). replaced is skipped everywhere. Prompts: pathogen-bolo/table-prompts.md.", "colTypes": { "craa5_sampleid": { "type": "text", "len": 100 }, "craa5_sampledescription": { "type": "memo", "len": 4000 }, "craa5_testmethod": { "type": "text", "len": 200 }, "craa5_rawresult": { "type": "text", "len": 100 }, "craa5_collectiondate": { "type": "text", "len": 10 }, "craa5_result": { "type": "text", "len": 10 }, "craa5_test": { "type": "text", "len": 20 }, "craa5_stage": { "type": "text", "len": 10 }, "craa5_sitecode": { "type": "text", "len": 80 }, "craa5_swabzone": { "type": "text", "len": 50 }, "craa5_area": { "type": "text", "len": 100 }, "craa5_room": { "type": "text", "len": 100 }, "craa5_sapw": { "type": "text", "len": 30 }, "craa5_equipmentguid": { "type": "guid", "len": 40 }, "craa5_assettag": { "type": "text", "len": 80 }, "craa5_surface": { "type": "text", "len": 100 }, "craa5_closedkey": { "type": "text", "len": 200 }, "craa5_closedon": { "type": "text", "len": 10 }, "craa5_source": { "type": "text", "len": 50 } } },
    { "logicalName": "craa5___1_m_supervisortodo", "entitySetName": "craa5___1_m_supervisortodos", "primaryId": "craa5___1_m_supervisortodoid", "primaryName": "craa5_task", "status": "live", "ownership": "User", "group": "other", "writers": ["Manager hub"], "readers": ["Manager hub"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_m_supervisortodo"], "notes": "" },
    { "logicalName": "craa5___1_m_formtemplate", "entitySetName": "(probe)", "primaryId": "craa5___1_m_formtemplateid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "other", "writers": ["Manager hub"], "readers": ["Manager hub"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_m_formtemplate", "craa5_formtemplate"], "notes": "" },
    { "logicalName": "craa5___1_m_quicktask", "entitySetName": "(probe)", "primaryId": "craa5___1_m_quicktaskid", "primaryName": "craa5_name", "status": "proposed", "ownership": "User", "group": "other", "writers": ["Manager hub"], "readers": ["Manager hub"], "requiredCols": [], "keys": [], "candidates": ["craa5___1_m_quicktask", "craa5_quicktask"], "notes": "Not made yet (monitor 2026-10-21). Personal list: User-owned on purpose." },
    { "logicalName": "craa5___1_m_employeenote", "entitySetName": "(probe)", "primaryId": "craa5___1_m_employeenoteid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "other", "writers": ["Manager hub"], "readers": ["Manager hub"], "requiredCols": [], "keys": [{ "column": "craa5_employeeguid", "kind": "employee", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }], "candidates": ["craa5___1_m_employeenote", "craa5___1_m_employeenote"], "notes": "Sensitive manager notes on people. User-owned; Read only for the manager role. Never shown to peers." },
    { "logicalName": "craa5___1_e_hubconfig", "entitySetName": "craa5___1_e_hubconfigs", "primaryId": "craa5___1_e_hubconfigid", "primaryName": "craa5_configname", "status": "live", "ownership": "Organization", "group": "other", "writers": ["MSS Log Input", "MSS Calendar", "PBED", "Pathogen BOLO", "Manager hub", "Ganttly", "Production Scheduler"], "readers": ["MSS Log Input", "MSS Calendar", "PBED", "Pathogen BOLO", "Manager hub", "Ganttly", "Production Scheduler", "Sanitation director"], "requiredCols": ["craa5_configname", "craa5_configkey", "craa5_configjson"], "keys": [{ "column": "craa5_configkey", "kind": "configkey", "mustMatch": "one writer app per key" }], "candidates": ["craa5___1_e_hubconfig", "craa5___1_e_hubconfig"], "notes": "Shared settings and app manifests (2026-10-22, replaces craa5___1_e_hubconfig). Organization-owned; craa5_configjson Multiple lines max 1048576 holds every JSON value. Each app writes only its own keys; always fill craa5_configkey. Apps probe craa5___1_e_hubconfig first, then the old craa5___1_e_hubconfig (User-owned, configjson only 100 chars, JSON in its craa5_manifestjson) until the new one exists. Read JSON with hubConfigJsonOf. Fixed row ids hubIdFromKey('hubconfig|' + key). Monitor 2026-10-23: the new table has no craa5_configkey yet, so readers fall back to the old table until Alex adds Config key (table-prompts part 8). craa5_manifestjson is optional (old table only).", "optionalCols": ["craa5_manifestjson"], "colTypes": { "craa5_configkey": { "type": "text", "len": 200 }, "craa5_configjson": { "type": "memo", "len": 1048576 } }, "noBuildCols": ["craa5_manifestjson"] },
    { "logicalName": "craa5__sani_schedule_", "entitySetName": "craa5__sani_schedule_s", "primaryId": "craa5__sani_schedule_id", "primaryName": "craa5_title", "status": "live", "ownership": "User", "group": "other", "writers": ["MSS Calendar"], "readers": ["MSS Calendar"], "requiredCols": [], "keys": [], "candidates": ["craa5__sani_schedule_"], "notes": "" },
    { "logicalName": "craa5_mss_useraccesslog", "entitySetName": "craa5_mss_useraccesslogs", "primaryId": "craa5_mss_useraccesslogid", "primaryName": "", "status": "missing", "ownership": "User", "group": "other", "writers": ["MSS Calendar"], "readers": ["Dataverse monitor"], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_useraccesslog"], "notes": "Not in Dataverse (monitor 2026-10-21). Access logging is optional." },
    { "logicalName": "craa5_useraccesslog", "entitySetName": "craa5_useraccesslogs", "primaryId": "craa5_useraccesslogid", "primaryName": "", "status": "missing", "ownership": "User", "group": "other", "writers": ["Shift Start"], "readers": ["Dataverse monitor"], "requiredCols": [], "keys": [], "candidates": ["craa5_useraccesslog"], "notes": "Not in Dataverse (monitor 2026-10-21). Access logging is optional." },
    { "logicalName": "craa5_dailyproduction", "entitySetName": "craa5_dailyproductions", "primaryId": "craa5_dailyproductionid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "other", "writers": ["Admin (model-driven form)"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": [], "keys": [], "candidates": ["craa5_dailyproduction"], "notes": "" },
    { "logicalName": "craa5___1_t_skill", "entitySetName": "(probe)", "primaryId": "craa5___1_t_skillid", "primaryName": "craa5_skillkey", "status": "proposed", "ownership": "Organization", "group": "reference", "writers": ["Training matrix"], "readers": ["Training matrix", "Manager hub", "Ganttly", "Shift Start"], "requiredCols": ["craa5_skillkey", "craa5_kind", "craa5_area"], "keys": [{ "column": "craa5_skillkey", "kind": "skill", "mustMatch": "primary key (text): exact area name or SYS-xxx" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }], "candidates": ["craa5___1_t_skill", "craa5_t_skill"], "notes": "One row per skill. Training thresholds in hubconfig key training_settings." },
    { "logicalName": "craa5___1_t_skilllevel", "entitySetName": "(probe)", "primaryId": "craa5___1_t_skilllevelid", "primaryName": "craa5_levelkey", "status": "proposed", "ownership": "Organization", "group": "flow", "writers": ["Training matrix"], "readers": ["Training matrix", "Manager hub", "Ganttly", "Shift Start"], "requiredCols": ["craa5_levelkey", "craa5_employeeguid", "craa5_skillkey", "craa5_level"], "keys": [{ "column": "craa5_levelkey", "kind": "skilllevel", "mustMatch": "employeeguid|skillkey; row id hubIdFromKey" }, { "column": "craa5_employeeguid", "kind": "employee", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }, { "column": "craa5_skillkey", "kind": "skill", "mustMatch": "craa5___1_t_skill.craa5_skillkey" }], "candidates": ["craa5___1_t_skilllevel", "craa5___1_t_skilllevel", "craa5_t_skilllevel"], "notes": "One row per person per skill, level 0-3." },
    { "logicalName": "craa5___1_t_event", "entitySetName": "(probe)", "primaryId": "craa5___1_t_eventid", "primaryName": "craa5_eventkey", "status": "proposed", "ownership": "Organization", "group": "flow", "writers": ["Training matrix"], "readers": ["Training matrix", "Manager hub"], "requiredCols": ["craa5_eventkey", "craa5_employeeguid", "craa5_skillkey", "craa5_kind", "craa5_eventdate"], "keys": [{ "column": "craa5_employeeguid", "kind": "employee", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }, { "column": "craa5_trainerguid", "kind": "employee", "mustMatch": "craa5___1_a_employee.craa5___1_a_employeeid" }, { "column": "craa5_skillkey", "kind": "skill", "mustMatch": "craa5___1_t_skill.craa5_skillkey" }], "candidates": ["craa5___1_t_event", "craa5_t_trainingevent"], "notes": "Append-only. Kinds level, session, refresher, manualread, removed, baseline. eventdate = plant day." },
    { "logicalName": "craa5__c_distributor", "entitySetName": "(probe)", "primaryId": "craa5__c_distributorid", "primaryName": "craa5__c_distributorname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_distributorid", "craa5__c_distributorname", "craa5_vendornumber", "craa5_approved", "craa5_active"], "keys": [{ "column": "craa5_vendornumber", "kind": "vendor", "mustMatch": "primary key (vendor number, one row each)" }], "candidates": ["craa5__c_distributor"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_leadtimedays", "craa5_cartlimit", "craa5_notes"], "colTypes": { "craa5_vendornumber": { "type": "text", "label": "Vendor number", "len": 20 }, "craa5_approved": { "type": "yesno", "label": "Approved" }, "craa5_leadtimedays": { "type": "int", "label": "Lead time (days)" }, "craa5_cartlimit": { "type": "money", "label": "Cart limit" }, "craa5_active": { "type": "yesno", "label": "Active" }, "craa5_notes": { "type": "memo", "label": "Notes", "len": 4000 } }, "label": "_c_ Distributor", "owner": "user", "primary": { "n": "craa5__c_distributorname", "label": "_c_ Distributor name" } },
    { "logicalName": "craa5__c_chemical", "entitySetName": "(probe)", "primaryId": "craa5__c_chemicalid", "primaryName": "craa5__c_chemical_name", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": ["craa5__c_chemicalid", "craa5__c_chemical_name", "craa5_itemnumber", "craa5_vendornumber", "craa5_priceperunit", "craa5_category", "craa5_active"], "keys": [{ "column": "craa5_itemnumber", "kind": "item", "mustMatch": "primary key (SAP item number, one row each)" }, { "column": "craa5_vendornumber", "kind": "vendor", "mustMatch": "craa5__c_distributor.craa5_vendornumber (text)" }], "candidates": ["craa5__c_chemical"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Primary column is craa5__c_chemical_name (planned craa5__c_chemicalname; Dataverse would not add it: too similar). The hub takes the primary column from the table definition. Price per unit is the current price of one container (Container size and unit say how much is in it); cart lines copy it when ordered, so past spend comes from Cart line unit prices. A second column craa5_chemicalname also exists on this table; the hub neither reads nor writes it. The hub writes the SAP description to the primary column; rows made outside the hub may hold it in craa5_chemicalname instead (not checked). Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_commonname", "craa5_subcategory", "craa5_useclass", "craa5_containersize", "craa5_containerunit", "craa5_gallonspercontainer", "craa5_costcenter", "craa5_glaccount", "craa5_purchasinggroup", "craa5_plant", "craa5_quotenumber", "craa5_quoteexpires", "craa5_sdsurl", "craa5_titrated", "craa5_sortorder"], "colTypes": { "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 }, "craa5_commonname": { "type": "text", "label": "Common name", "len": 100 }, "craa5_vendornumber": { "type": "text", "label": "Vendor number", "len": 20 }, "craa5_priceperunit": { "type": "money", "label": "Price per unit" }, "craa5_category": { "type": "choice", "label": "Category", "options": ["Chemical", "Test reagent", "Supply", "PPE / Safety", "Equipment", "Service"] }, "craa5_subcategory": { "type": "choice", "label": "Subcategory", "options": ["Sanitizer", "Detergent", "Detergent / sanitizer", "Equipment", "Safety", "Supply"] }, "craa5_useclass": { "type": "choice", "label": "Use class", "options": ["CIP", "Equipment", "Floor", "GMP", "Drain", "Oven", "Dry", "Special", "PPE", "Clean", "Test"] }, "craa5_containersize": { "type": "decimal", "label": "Container size" }, "craa5_containerunit": { "type": "choice", "label": "Container unit", "options": ["Gallon", "Pound", "Each", "Ounce", "Case", "Liter"] }, "craa5_gallonspercontainer": { "type": "decimal", "label": "Gallons per container" }, "craa5_costcenter": { "type": "text", "label": "Cost center", "len": 20 }, "craa5_glaccount": { "type": "text", "label": "GL account", "len": 20 }, "craa5_purchasinggroup": { "type": "text", "label": "Purchasing group", "len": 50 }, "craa5_plant": { "type": "text", "label": "Plant", "len": 20 }, "craa5_quotenumber": { "type": "text", "label": "Quote number", "len": 40 }, "craa5_quoteexpires": { "type": "date", "label": "Quote expires" }, "craa5_sdsurl": { "type": "text", "label": "SDS URL", "len": 500 }, "craa5_titrated": { "type": "yesno", "label": "Titrated" }, "craa5_active": { "type": "yesno", "label": "Active" }, "craa5_sortorder": { "type": "int", "label": "Sort order" } }, "label": "_c_ Chemical", "owner": "user", "primary": { "n": "craa5__c_chemical_name", "label": "_c_ Chemical name", "len": 200 } },
    { "logicalName": "craa5__c_chemicalinventory", "entitySetName": "(probe)", "primaryId": "craa5__c_chemicalinventoryid", "primaryName": "craa5__c_chemicalinventoryname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": ["craa5__c_chemicalinventoryid", "craa5__c_chemicalinventoryname", "craa5_itemnumber", "craa5_location", "craa5_quantityonhand", "craa5_minimumthreshold", "craa5_quantityonorder"], "keys": [{ "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }, { "column": "craa5_location", "kind": "location", "mustMatch": "choice: one of the six count locations" }], "candidates": ["craa5__c_chemicalinventory"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_parlevel", "craa5_displayorder", "craa5_lastupdated", "craa5_lastcountdate"], "colTypes": { "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 }, "craa5_location": { "type": "choice", "label": "Location", "options": ["Chemical room", "Creme CIP room", "Warehouse", "Chemical cages", "Supplies cage", "Point of use"] }, "craa5_quantityonhand": { "type": "decimal", "label": "Quantity on hand" }, "craa5_minimumthreshold": { "type": "decimal", "label": "Minimum threshold" }, "craa5_parlevel": { "type": "decimal", "label": "Par level" }, "craa5_quantityonorder": { "type": "decimal", "label": "Quantity on order" }, "craa5_displayorder": { "type": "int", "label": "Display order" }, "craa5_lastupdated": { "type": "datetime", "label": "Last updated" }, "craa5_lastcountdate": { "type": "date", "label": "Last count date" } }, "label": "_c_ Chemical inventory", "owner": "user", "primary": { "n": "craa5__c_chemicalinventoryname", "label": "_c_ Chemical inventory name" } },
    { "logicalName": "craa5__c_cart", "entitySetName": "(probe)", "primaryId": "craa5__c_cartid", "primaryName": "craa5__c_cartname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": ["craa5__c_cartid", "craa5__c_cartname", "craa5_vendornumber", "craa5_cartstatus", "craa5_carttotal"], "keys": [{ "column": "craa5__c_cartname", "kind": "cart", "mustMatch": "primary key (cart title, one row each)" }, { "column": "craa5_sapcartnumber", "kind": "sapcart", "mustMatch": "unique when filled" }, { "column": "craa5_vendornumber", "kind": "vendor", "mustMatch": "craa5__c_distributor.craa5_vendornumber (text)" }], "candidates": ["craa5__c_cart"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_sapcartnumber", "craa5_draftedon", "craa5_submittedon", "craa5_approvedon", "craa5_approvedby", "craa5_eta", "craa5_receivedon", "craa5_notes"], "colTypes": { "craa5_sapcartnumber": { "type": "text", "label": "SAP cart number", "len": 20 }, "craa5_vendornumber": { "type": "text", "label": "Vendor number", "len": 20 }, "craa5_cartstatus": { "type": "choice", "label": "Cart status", "options": ["Draft (not in SAP yet)", "Submitted", "Approved", "Ordered", "Partially received", "Received", "Cancelled"] }, "craa5_carttotal": { "type": "money", "label": "Cart total" }, "craa5_draftedon": { "type": "datetime", "label": "Drafted on" }, "craa5_submittedon": { "type": "datetime", "label": "Submitted on" }, "craa5_approvedon": { "type": "datetime", "label": "Approved on" }, "craa5_approvedby": { "type": "text", "label": "Approved by", "len": 100 }, "craa5_eta": { "type": "date", "label": "ETA" }, "craa5_receivedon": { "type": "datetime", "label": "Received on" }, "craa5_notes": { "type": "memo", "label": "Notes", "len": 4000 } }, "label": "_c_ Cart", "owner": "user", "primary": { "n": "craa5__c_cartname", "label": "_c_ Cart name", "len": 100 } },
    { "logicalName": "craa5__c_cartline", "entitySetName": "(probe)", "primaryId": "craa5__c_cartlineid", "primaryName": "craa5_cartlinename", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": ["craa5__c_cartlineid", "craa5_cartlinename", "craa5_itemnumber", "craa5_quantity", "craa5_unitprice", "craa5_linetotal", "craa5_source"], "keys": [{ "column": "craa5__c_cartname", "kind": "cart", "mustMatch": "craa5__c_cart.craa5__c_cartname (blank = a request with no cart yet)" }, { "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }], "candidates": ["craa5__c_cartline"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Primary column is craa5_cartlinename (planned craa5__c_cartlinename; Dataverse would not add it: too similar). The hub takes the primary column from the table definition. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5__c_cartname", "craa5_quantityreceived", "craa5_receivedon", "craa5_requestedby", "craa5_reason"], "colTypes": { "craa5__c_cartname": { "type": "text", "label": "_c_ Cart name", "len": 100 }, "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 }, "craa5_quantity": { "type": "decimal", "label": "Quantity" }, "craa5_unitprice": { "type": "money", "label": "Unit price" }, "craa5_linetotal": { "type": "money", "label": "Line total" }, "craa5_quantityreceived": { "type": "decimal", "label": "Quantity received" }, "craa5_receivedon": { "type": "date", "label": "Received on" }, "craa5_source": { "type": "choice", "label": "Source", "options": ["Suggested", "Clerk request", "Supervisor request", "Manual", "Imported"] }, "craa5_requestedby": { "type": "text", "label": "Requested by", "len": 100 }, "craa5_reason": { "type": "text", "label": "Reason", "len": 500 } }, "label": "_c_ Cart line", "owner": "user", "primary": { "n": "craa5_cartlinename", "label": "_c_ Cart line name", "len": 200 } },
    { "logicalName": "craa5__c_chemicalcount", "entitySetName": "(probe)", "primaryId": "craa5__c_chemicalcountid", "primaryName": "craa5_chemicalname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": ["craa5__c_chemicalcountid", "craa5_chemicalname", "craa5_itemnumber", "craa5_location", "craa5_countdate", "craa5_quantity"], "keys": [{ "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }, { "column": "craa5_location", "kind": "location", "mustMatch": "choice: one of the six count locations" }, { "column": "craa5_countdate", "kind": "countday", "mustMatch": "one count per item, location and day" }], "candidates": ["craa5__c_chemicalcount"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Counts are taken on Sunday, the last day of the contract week (hubWeekKey). Primary column is craa5_chemicalname (planned craa5__c_chemicalcountname; Dataverse would not add it: too similar). The hub takes the primary column from the table definition. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_countedby", "craa5_expected", "craa5_expirydate", "craa5_variancereason", "craa5_note"], "colTypes": { "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 }, "craa5_location": { "type": "choice", "label": "Location", "options": ["Chemical room", "Creme CIP room", "Warehouse", "Chemical cages", "Supplies cage", "Point of use"] }, "craa5_countdate": { "type": "date", "label": "Count date" }, "craa5_countedby": { "type": "text", "label": "Counted by", "len": 100 }, "craa5_quantity": { "type": "decimal", "label": "Quantity" }, "craa5_expected": { "type": "decimal", "label": "Expected" }, "craa5_expirydate": { "type": "date", "label": "Expiry date" }, "craa5_variancereason": { "type": "choice", "label": "Variance reason", "options": ["Spill", "Damage", "Transfer", "Miscount", "Other"] }, "craa5_note": { "type": "text", "label": "Note", "len": 500 } }, "label": "_c_ Chemical count", "owner": "user", "primary": { "n": "craa5_chemicalname", "label": "_c_ Chemical count name", "len": 200 } },
    { "logicalName": "craa5__c_chemicalusagelog", "entitySetName": "(probe)", "primaryId": "craa5__c_chemicalusagelogid", "primaryName": "craa5__c_chemicalusagelogname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_chemicalusagelogid", "craa5__c_chemicalusagelogname", "craa5_entrytype", "craa5_logdate", "craa5_shift", "craa5_itemnumber"], "keys": [{ "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area when the spelling is mapped (craa5_areaaswritten keeps the old log text)" }], "candidates": ["craa5__c_chemicalusagelog"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. craa5_employee, craa5_shift and craa5_equipment stay text/choice as on the paper log (no employee or equipment ids there). Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_employee", "craa5_application", "craa5_jugnumber", "craa5_amount", "craa5_amountunit", "craa5_gallons", "craa5_area", "craa5_spot", "craa5_equipment", "craa5_drops", "craa5_ppm", "craa5_targetmin", "craa5_targetmax", "craa5_inrange", "craa5_actiontaken", "craa5_returned", "craa5_used", "craa5_msslogid", "craa5_chemicalaswritten", "craa5_areaaswritten", "craa5_note"], "colTypes": { "craa5_entrytype": { "type": "choice", "label": "Entry type", "options": ["Jug issued", "Point-of-use barrel change", "Return", "Titration check"] }, "craa5_logdate": { "type": "datetime", "label": "Log date" }, "craa5_shift": { "type": "choice", "label": "Shift", "options": ["1st", "2nd", "PSSI"] }, "craa5_employee": { "type": "text", "label": "Employee", "len": 100 }, "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 }, "craa5_application": { "type": "choice", "label": "Application", "options": ["FC foamer (food contact)", "NFC (non-food contact)", "Spray jug", "Pump-up", "SCM CIP", "Other"] }, "craa5_jugnumber": { "type": "text", "label": "Jug number", "len": 10 }, "craa5_amount": { "type": "decimal", "label": "Amount", "precision": 4 }, "craa5_amountunit": { "type": "choice", "label": "Amount unit", "options": ["Gallon", "Ounce", "Pound"] }, "craa5_gallons": { "type": "decimal", "label": "Gallons", "precision": 4 }, "craa5_area": { "type": "text", "label": "Area", "len": 100 }, "craa5_spot": { "type": "text", "label": "Spot", "len": 100 }, "craa5_equipment": { "type": "text", "label": "Equipment", "len": 100 }, "craa5_drops": { "type": "int", "label": "Drops" }, "craa5_ppm": { "type": "decimal", "label": "PPM" }, "craa5_targetmin": { "type": "decimal", "label": "Target min" }, "craa5_targetmax": { "type": "decimal", "label": "Target max" }, "craa5_inrange": { "type": "yesno", "label": "In range" }, "craa5_actiontaken": { "type": "text", "label": "Action taken", "len": 200 }, "craa5_returned": { "type": "yesno", "label": "Returned" }, "craa5_used": { "type": "yesno", "label": "Used" }, "craa5_msslogid": { "type": "text", "label": "MSS log ID", "len": 100 }, "craa5_chemicalaswritten": { "type": "text", "label": "Chemical as written", "len": 200 }, "craa5_areaaswritten": { "type": "text", "label": "Area as written", "len": 200 }, "craa5_note": { "type": "text", "label": "Note", "len": 500 } }, "label": "_c_ Chemical usage log", "owner": "user", "primary": { "n": "craa5__c_chemicalusagelogname", "label": "_c_ Chemical usage log name" } },
    { "logicalName": "craa5__c_titrationtarget", "entitySetName": "(probe)", "primaryId": "craa5__c_titrationtargetid", "primaryName": "craa5__c_titrationtargetname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_titrationtargetid", "craa5__c_titrationtargetname", "craa5_itemnumber", "craa5_application", "craa5_minppm", "craa5_maxppm", "craa5_active"], "keys": [{ "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }], "candidates": ["craa5__c_titrationtarget"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_testmethod", "craa5_ppmperdrop", "craa5_notes"], "colTypes": { "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 }, "craa5_application": { "type": "choice", "label": "Application", "options": ["FC foamer (food contact)", "NFC (non-food contact)", "Spray jug", "Pump-up", "SCM CIP", "Other"] }, "craa5_minppm": { "type": "decimal", "label": "Min PPM" }, "craa5_maxppm": { "type": "decimal", "label": "Max PPM" }, "craa5_testmethod": { "type": "text", "label": "Test method", "len": 200 }, "craa5_ppmperdrop": { "type": "decimal", "label": "PPM per drop" }, "craa5_active": { "type": "yesno", "label": "Active" }, "craa5_notes": { "type": "memo", "label": "Notes", "len": 4000 } }, "label": "_c_ Titration target", "owner": "user", "primary": { "n": "craa5__c_titrationtargetname", "label": "_c_ Titration target name", "len": 200 } },
    { "logicalName": "craa5__c_checklisttask", "entitySetName": "(probe)", "primaryId": "craa5__c_checklisttaskid", "primaryName": "craa5__c_checklisttaskname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_checklisttaskid", "craa5__c_checklisttaskname", "craa5_group", "craa5_shiftrule", "craa5_sortorder", "craa5_active"], "keys": [], "candidates": ["craa5__c_checklisttask"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": [] },
    { "logicalName": "craa5__c_clerkchecklist", "entitySetName": "(probe)", "primaryId": "craa5__c_clerkchecklistid", "primaryName": "craa5__c_clerkchecklist1", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_clerkchecklistid", "craa5__c_clerkchecklist1", "craa5_shiftdate", "craa5_shift", "craa5_clerk", "craa5_tasksjson", "craa5_donecount", "craa5_totalcount"], "keys": [], "candidates": ["craa5__c_clerkchecklist"], "notes": "User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. craa5_shiftdate here is a Date only column, not the contract's YYYY-MM-DD text. Primary column is craa5__c_clerkchecklist1 (planned craa5__c_clerkchecklistname; Dataverse would not add it: too similar). The hub takes the primary column from the table definition. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_comments", "craa5_signedoff"] },
    { "logicalName": "craa5__c_chemicalstandard", "entitySetName": "(probe)", "primaryId": "craa5__c_chemicalstandardid", "primaryName": "craa5__c_chemicalstandardname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Admin (model-driven form)"], "readers": ["Chemical hub", "Manager hub"], "requiredCols": ["craa5__c_chemicalstandardid", "craa5__c_chemicalstandardname", "craa5_itemnumber", "craa5_cleantype", "craa5_gallonsperclean", "craa5_basis"], "keys": [{ "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }], "candidates": ["craa5__c_chemicalstandard"], "notes": "Optional; made in Alex's org (5 rows, Dataverse monitor 2026-10-21). No chemical hub screen uses it yet; the Manager hub (v7.0) reads it. Gallons per clean is read as gallons of product as issued (undiluted), the same basis as the usage log's Gallons and Gallons per container; Alex to confirm for SSOP or supplier-spec rows. Clean type is matched by label (7 labels). User or team owned: every hub role needs Organization-level Read. Rows are typed in the model-driven form for now; no app writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_area", "craa5_equipment", "craa5_validfrom"] },
    { "logicalName": "craa5__c_areaalias", "entitySetName": "(probe)", "primaryId": "craa5__c_areaaliasid", "primaryName": "craa5__c_areaaliasname", "status": "live", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_areaaliasid", "craa5__c_areaaliasname"], "keys": [{ "column": "craa5__c_areaaliasname", "kind": "spelling", "mustMatch": "primary key (one row per spelling, compared after folding case, accents and spaces)" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_room", "kind": "room", "mustMatch": "room name (craa5_parentroom / craa5_roomname)" }], "candidates": ["craa5__c_areaalias"], "notes": "Optional; the hub works without it and says so. User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_area", "craa5_spot", "craa5_room", "craa5_entrytypehint"], "colTypes": { "craa5_area": { "type": "text", "label": "Area", "len": 100 }, "craa5_spot": { "type": "text", "label": "Spot", "len": 100 }, "craa5_room": { "type": "text", "label": "Room", "len": 50 }, "craa5_entrytypehint": { "type": "choice", "label": "Entry type hint", "options": ["Jug issued", "Point-of-use barrel change", "Return", "Titration check"] } }, "label": "_c_ Area alias", "owner": "user", "primary": { "n": "craa5__c_areaaliasname", "label": "_c_ Area alias name", "len": 200 } },
    { "logicalName": "craa5__c_chemicalalias", "entitySetName": "(probe)", "primaryId": "craa5__c_chemicalaliasid", "primaryName": "craa5__c_chemicalaliasname", "status": "proposed", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_chemicalaliasid", "craa5__c_chemicalaliasname"], "keys": [{ "column": "craa5__c_chemicalaliasname", "kind": "spelling", "mustMatch": "primary key (one row per name)" }, { "column": "craa5_itemnumber", "kind": "item", "mustMatch": "craa5__c_chemical.craa5_itemnumber (SAP item number, text)" }], "candidates": ["craa5__c_chemicalalias"], "notes": "Optional. Asked of Alex on 2026-10-20 (copilot-table-prompts.md); the hub works without it and says so. User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_itemnumber"], "colTypes": { "craa5_itemnumber": { "type": "text", "label": "Item number", "len": 40 } }, "label": "_c_ Chemical alias", "owner": "user", "primary": { "n": "craa5__c_chemicalaliasname", "label": "_c_ Chemical alias name", "len": 200 } },
    { "logicalName": "craa5__c_sanitationbudget", "entitySetName": "(probe)", "primaryId": "craa5__c_sanitationbudgetid", "primaryName": "craa5__c_sanitationbudgetname", "status": "proposed", "ownership": "User", "group": "chemical", "writers": ["Chemical hub"], "readers": ["Chemical hub"], "requiredCols": ["craa5__c_sanitationbudgetid", "craa5__c_sanitationbudgetname", "craa5_month", "craa5_amount"], "keys": [], "candidates": ["craa5__c_sanitationbudget"], "notes": "Later: not created; no screen uses it yet. User or team owned: every hub role needs Organization-level Read. Row ids are chGuidFrom(text key), the recorded exception to rule 6; only the Chemical hub writes it. Choices are matched by label; the hub reads the option values from Dataverse. Spec: chemical-ordering/table-spec.md.", "optionalCols": ["craa5_category", "craa5_glaccount", "craa5_costcenter", "craa5_notes"] },
    { "logicalName": "craa5_sanitationshiftreport", "entitySetName": "(probe)", "primaryId": "craa5_sanitationshiftreportid", "primaryName": "", "status": "legacy", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationshiftreport"], "notes": "Exists with 0 rows (monitor 2026-10-21). Ganttly reads it; nothing new may depend on it." },
    { "logicalName": "craa5_mss_shift_capacity", "entitySetName": "(probe)", "primaryId": "craa5_mss_shift_capacityid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_shift_capacity"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_mss_quality_verifications", "entitySetName": "(probe)", "primaryId": "craa5_mss_quality_verificationsid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_quality_verifications"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_mss_downtime_events", "entitySetName": "(probe)", "primaryId": "craa5_mss_downtime_eventsid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_downtime_events"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_mss_cost_model", "entitySetName": "(probe)", "primaryId": "craa5_mss_cost_modelid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_cost_model"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_mss_capex_lifecycle", "entitySetName": "(probe)", "primaryId": "craa5_mss_capex_lifecycleid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_capex_lifecycle"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_pathogen_bolo_sample", "entitySetName": "(probe)", "primaryId": "craa5_pathogen_bolo_sampleid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_pathogen_bolo_sample"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_pathogen_bolo_harborage", "entitySetName": "(probe)", "primaryId": "craa5_pathogen_bolo_harborageid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_pathogen_bolo_harborage"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5_quickload_assets", "entitySetName": "(probe)", "primaryId": "craa5_quickload_assetsid", "primaryName": "", "status": "absent", "ownership": "", "group": "unknown", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_quickload_assets"], "notes": "Not in Dataverse (monitor 2026-10-21). Named in old app code only; remove the code that reads it." },
    { "logicalName": "craa5___1_a_assets", "entitySetName": "craa5___1_a_assetses", "primaryId": "craa5___1_a_assetsid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_a_assets"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_a_employee", "entitySetName": "craa5___1_a_employees", "primaryId": "craa5___1_a_employeeid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_a_employee"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_a_mss_area", "entitySetName": "craa5___1_a_mss_areas", "primaryId": "craa5___1_a_mss_areaid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_a_mss_area"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_p_prodschedule", "entitySetName": "craa5___1_p_prodschedules", "primaryId": "craa5___1_p_prodscheduleid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_p_prodschedule"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5__0_saporder", "entitySetName": "craa5__0_saporders", "primaryId": "craa5__0_saporderid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5__0_saporder"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_s_shiftarchive", "entitySetName": "craa5___1_s_shiftarchives", "primaryId": "craa5___1_s_shiftarchiveid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_s_shiftarchive"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_s_shiftboard", "entitySetName": "craa5___1_s_shiftboards", "primaryId": "craa5___1_s_shiftboardid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_s_shiftboard"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_s_shiftlog", "entitySetName": "craa5___1_s_shiftlogs", "primaryId": "craa5___1_s_shiftlogid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_s_shiftlog"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_s_shiftplan", "entitySetName": "craa5___1_s_shiftplans", "primaryId": "craa5___1_s_shiftplanid", "primaryName": "", "status": "abandoned", "ownership": "User", "group": "abandoned", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_s_shiftplan"], "notes": "Abandoned set; no app may use it." },
    { "logicalName": "craa5___1_g_assignment", "entitySetName": "(probe)", "primaryId": "craa5___1_g_assignmentid", "primaryName": "craa5_assignmentkey", "status": "live", "ownership": "Organization", "group": "floor", "writers": ["Ganttly", "Shift Start"], "readers": ["Ganttly", "Shift Start", "Manager hub"], "requiredCols": ["craa5_assignmentkey", "craa5_equipmentguid", "craa5_shiftdate", "craa5_crew", "craa5_team", "craa5_cleankind", "craa5_employeeguids", "craa5_pinned", "craa5_source", "craa5_rev"], "keys": [{ "column": "craa5_assignmentkey", "kind": "assignment", "mustMatch": "<shift date>|<crew>|<equipment guid>|<kind>; row id hubIdFromKey(\"asg|\" + key)" }, { "column": "craa5_equipmentguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_boardid", "kind": "board", "mustMatch": "craa5___1_s_shiftboard row id" }, { "column": "craa5_team", "kind": "employee", "mustMatch": "lead employee GUID" }, { "column": "craa5_employeeguids", "kind": "employee", "mustMatch": "hubGuidList" }], "candidates": ["craa5___1_g_assignment", "craa5___1_g_assignment", "craa5_g_assignment", "craa5___1_g_assignments"], "notes": "Equipment to people, shared by Shift Start and Ganttly (spec /mnt/project-files/ganttly-overhaul/shared-assignment.md). One row per piece per shift, updated in place, inactive instead of deleted. pinned = a person placed it (auto never moves it); source auto / ganttly / shiftstart; rev +1 per save, higher rev wins between pinned saves. Even split by the shared ASSIGN SPLIT v1.0 block (/mnt/project-files/ganttly-overhaul/assign-split.js): saved rows keep their people, new rows source auto pinned No, a reorder sets craa5_order and pins the row, Ganttly fills craa5_plannedstart/craa5_plannedminutes without bumping rev. Real table name unconfirmed (Alex made it 2026-10-22; apps also probe craa5_g_assignment, craa5___1_g_assignments, craa5___1_g_assignment)." },
    { "logicalName": "craa5___1_g_obstacle", "entitySetName": "(probe)", "primaryId": "craa5___1_g_obstacleid", "primaryName": "craa5_obstaclekey", "status": "proposed", "ownership": "Organization", "group": "floor", "writers": ["Ganttly"], "readers": ["Ganttly"], "requiredCols": ["craa5_obstaclekey", "craa5_startedat", "craa5_shiftdate", "craa5_crew", "craa5_scope", "craa5_area", "craa5_equipmentguid", "craa5_status"], "keys": [{ "column": "craa5_obstaclekey", "kind": "text", "mustMatch": "obs|<base36 time>|<device>" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }, { "column": "craa5_equipmentguid", "kind": "equipment", "mustMatch": "craa5___1_a_assets.craa5___1_a_assetsid" }, { "column": "craa5_shiftdate", "kind": "shiftdate", "mustMatch": "YYYY-MM-DD plant day" }], "candidates": ["craa5___1_g_obstacle", "craa5_g_obstacle"], "notes": "Ganttly thread prompts: /mnt/project-files/ganttly-overhaul/g-tables-prompts.md. Used by Ganttly 1.4 (PR #32; row id hubIdFromKey(\"ganttly|\" + key); probes craa5__g_x, craa5_g_x, craa5__g_xs). No lookups; rows deactivated, never deleted. Something that stopped or slowed a clean; Ganttly also shows it as downtime. Status active / resolved." },
    { "logicalName": "craa5___1_g_handover", "entitySetName": "(probe)", "primaryId": "craa5___1_g_handoverid", "primaryName": "craa5_handoverkey", "status": "proposed", "ownership": "Organization", "group": "floor", "writers": ["Ganttly"], "readers": ["Ganttly"], "requiredCols": ["craa5_handoverkey", "craa5_handedat", "craa5_shiftdate", "craa5_fromcrew", "craa5_tocrew", "craa5_equipmentguids"], "keys": [{ "column": "craa5_handoverkey", "kind": "text", "mustMatch": "ho|<shift date>|<from crew>|<to crew>|<base36 time>" }, { "column": "craa5_equipmentguids", "kind": "equipment", "mustMatch": "hubGuidList of craa5___1_a_assetsid" }, { "column": "craa5_shiftdate", "kind": "shiftdate", "mustMatch": "outgoing shift date" }], "candidates": ["craa5___1_g_handover", "craa5_g_handover"], "notes": "Ganttly thread prompts: /mnt/project-files/ganttly-overhaul/g-tables-prompts.md. Used by Ganttly 1.4 (PR #32; row id hubIdFromKey(\"ganttly|\" + key); probes craa5__g_x, craa5_g_x, craa5__g_xs). No lookups; rows deactivated, never deleted. Pieces handed from one crew to the next with the outgoing supervisor note." },
    { "logicalName": "craa5___1_g_note", "entitySetName": "(probe)", "primaryId": "craa5___1_g_noteid", "primaryName": "craa5_notekey", "status": "proposed", "ownership": "User", "group": "floor", "writers": ["Ganttly"], "readers": ["Ganttly", "Manager hub"], "requiredCols": ["craa5_notekey", "craa5_employeeguid", "craa5_kind", "craa5_notedat"], "keys": [{ "column": "craa5_notekey", "kind": "text", "mustMatch": "pn|<employee guid>|<base36 time>" }, { "column": "craa5_employeeguid", "kind": "employee", "mustMatch": "craa5___1_a_employee id" }, { "column": "craa5_givenbyguid", "kind": "employee", "mustMatch": "writer, when known" }], "candidates": ["craa5___1_g_note", "craa5_g_personnelnote"], "notes": "Ganttly thread prompts: /mnt/project-files/ganttly-overhaul/g-tables-prompts.md. Used by Ganttly 1.4 (PR #32; row id hubIdFromKey(\"ganttly|\" + key); probes craa5__g_x, craa5_g_x, craa5__g_xs). No lookups; rows deactivated, never deleted. SENSITIVE: never shown to peers, never exported, never in the repo. Floor users Create + User-level Read/Write; managers Organization Read (they keep reading after supervisors lose Manager hub access). Separate from craa5___1_m_employeenote (manager-only). Replaces the craa5_remarks JSON on the Employee row." },
    { "logicalName": "craa5___1_a_role", "entitySetName": "(probe)", "primaryId": "craa5___1_a_roleid", "primaryName": "craa5_name", "status": "live", "ownership": "User", "group": "reference", "writers": ["Admin (model-driven form)"], "readers": ["PBED", "Ganttly", "Sanitation director", "Manager hub"], "requiredCols": ["craa5___1_a_roleid"], "keys": [], "candidates": ["craa5___1_a_role"], "notes": "Pay roles. craa5___1_a_employee.craa5_roleid is a lookup to this table; its name is the role matched to craa5___1_e_laborrate.craa5_role (any case). Read the lookup formatted value; when only the id comes back, read craa5_name here. Never use the hub role choice craa5_role as a pay role." },
    { "logicalName": "craa5_mssresourcechemicalstandard", "entitySetName": "(probe)", "primaryId": "craa5_mssresourcechemicalstandardid", "primaryName": "", "status": "unclaimed", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mssresourcechemicalstandard"], "notes": "In Dataverse, not in the hub plan (found by the monitor 2026-10-23). No hub app reads or writes it; chemical standards live in craa5__c_chemicalstandard. Leave it alone until Alex says what it is." },
    { "logicalName": "craa5_sanitationheadcountshiftrosterledger", "entitySetName": "(probe)", "primaryId": "craa5_sanitationheadcountshiftrosterledgerid", "primaryName": "", "status": "unclaimed", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationheadcountshiftrosterledger"], "notes": "In Dataverse, not in the hub plan (found by the monitor 2026-10-23). No hub app reads or writes it; heads needed per shift come from clean plan staff rows (section 7). Leave it alone until Alex says what it is." },
    { "logicalName": "craa5__aa_eeutilization", "entitySetName": "(probe)", "primaryId": "craa5__aa_eeutilizationid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5__aa_eeutilization"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5__c_areaalias1", "entitySetName": "(probe)", "primaryId": "craa5__c_areaalias1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5__c_areaalias1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5__tskmstr", "entitySetName": "(probe)", "primaryId": "craa5__tskmstrid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5__tskmstr"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_aa_mss_facility", "entitySetName": "(probe)", "primaryId": "craa5_aa_mss_facilityid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_aa_mss_facility"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_aa_mss_freq", "entitySetName": "(probe)", "primaryId": "craa5_aa_mss_freqid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_aa_mss_freq"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_l_log", "entitySetName": "(probe)", "primaryId": "craa5___1_l_logid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_l_log"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_aa_mss_saporders", "entitySetName": "(probe)", "primaryId": "craa5_aa_mss_sapordersid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_aa_mss_saporders"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_a_leadershipteam", "entitySetName": "(probe)", "primaryId": "craa5___1_a_leadershipteamid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_a_leadershipteam"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_a_employee", "entitySetName": "(probe)", "primaryId": "craa5___1_a_employeeid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_a_employee"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_area", "entitySetName": "(probe)", "primaryId": "craa5_areaid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_area"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_areaalias", "entitySetName": "(probe)", "primaryId": "craa5_areaaliasid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_areaalias"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_cart", "entitySetName": "(probe)", "primaryId": "craa5_cartid", "primaryName": "", "status": "legacy", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_cart"], "notes": "Old chemical cart (supp - chemlog); replaced by craa5__c_cart." },
    { "logicalName": "craa5_cartline", "entitySetName": "(probe)", "primaryId": "craa5_cartlineid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_cartline"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_checklisttask", "entitySetName": "(probe)", "primaryId": "craa5_checklisttaskid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_checklisttask"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_chemicalstandard", "entitySetName": "(probe)", "primaryId": "craa5_chemicalstandardid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_chemicalstandard"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_chemicalstandard1", "entitySetName": "(probe)", "primaryId": "craa5_chemicalstandard1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_chemicalstandard1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_contentlockrecord", "entitySetName": "(probe)", "primaryId": "craa5_contentlockrecordid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_contentlockrecord"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_contentlockrecord1", "entitySetName": "(probe)", "primaryId": "craa5_contentlockrecord1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_contentlockrecord1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_description", "entitySetName": "(probe)", "primaryId": "craa5_descriptionid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_description"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_distributor", "entitySetName": "(probe)", "primaryId": "craa5_distributorid", "primaryName": "", "status": "legacy", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_distributor"], "notes": "Old chemical distributor (supp - chemlog); replaced by craa5__c_distributor." },
    { "logicalName": "craa5_dsrp", "entitySetName": "(probe)", "primaryId": "craa5_dsrpid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_dsrp"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_dsrreporting", "entitySetName": "(probe)", "primaryId": "craa5_dsrreportingid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_dsrreporting"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_dsrstst", "entitySetName": "(probe)", "primaryId": "craa5_dsrststid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_dsrstst"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_equipment", "entitySetName": "(probe)", "primaryId": "craa5_equipmentid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_equipment"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_facilities", "entitySetName": "(probe)", "primaryId": "craa5_facilitiesid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_facilities"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_facility", "entitySetName": "(probe)", "primaryId": "craa5_facilityid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_facility"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_l_log", "entitySetName": "(probe)", "primaryId": "craa5___1_l_logid", "primaryName": "", "status": "legacy", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_l_log"], "notes": "Old MSS log (alpha - msslog); replaced by craa5___1_l_log." },
    { "logicalName": "craa5_maintenancewo", "entitySetName": "(probe)", "primaryId": "craa5_maintenancewoid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_maintenancewo"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_maintenancewo1", "entitySetName": "(probe)", "primaryId": "craa5_maintenancewo1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_maintenancewo1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_mss_room", "entitySetName": "(probe)", "primaryId": "craa5_mss_roomid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_mss_room"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_room", "entitySetName": "(probe)", "primaryId": "craa5_roomid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_room"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_roomsubcategory", "entitySetName": "(probe)", "primaryId": "craa5_roomsubcategoryid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_roomsubcategory"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_sanitationarea", "entitySetName": "(probe)", "primaryId": "craa5_sanitationareaid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationarea"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_sanitationarea1", "entitySetName": "(probe)", "primaryId": "craa5_sanitationarea1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationarea1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_sanitationbudget", "entitySetName": "(probe)", "primaryId": "craa5_sanitationbudgetid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationbudget"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_sanitationprogress", "entitySetName": "(probe)", "primaryId": "craa5_sanitationprogressid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationprogress"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_sanitationprogress1", "entitySetName": "(probe)", "primaryId": "craa5_sanitationprogress1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationprogress1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_sanitationschedule", "entitySetName": "(probe)", "primaryId": "craa5_sanitationscheduleid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_sanitationschedule"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_s_shiftboard", "entitySetName": "(probe)", "primaryId": "craa5_shiftboard1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_s_shiftboard"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_shiftreport", "entitySetName": "(probe)", "primaryId": "craa5_shiftreportid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_shiftreport"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_e_shifttask", "entitySetName": "(probe)", "primaryId": "craa5___1_e_shifttaskid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5___1_e_shifttask"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_stock", "entitySetName": "(probe)", "primaryId": "craa5_stockid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_stock"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_table1", "entitySetName": "(probe)", "primaryId": "craa5_table1id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_table1"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_table11", "entitySetName": "(probe)", "primaryId": "craa5_table11id", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_table11"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_taskprogress", "entitySetName": "(probe)", "primaryId": "craa5_taskprogressid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_taskprogress"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5_titrationtarget", "entitySetName": "(probe)", "primaryId": "craa5_titrationtargetid", "primaryName": "", "status": "abandoned", "ownership": "", "group": "unlisted", "writers": [], "readers": [], "requiredCols": [], "keys": [], "candidates": ["craa5_titrationtarget"], "notes": "In Dataverse, used by no current app (checked against all app files 2026-10-21). Delete only when Alex chooses." },
    { "logicalName": "craa5___1_e_shifttask", "entitySetName": "(probe)", "primaryId": "craa5___1_e_shifttaskid", "primaryName": "craa5_name", "status": "proposed", "ownership": "Organization", "group": "reference", "writers": ["Sanitation director"], "readers": ["Shift Start", "Ganttly", "Manager hub"], "requiredCols": ["craa5_name", "craa5_taskkey", "craa5_shift", "craa5_days", "craa5_heads", "craa5_minutes", "craa5_area", "craa5_active", "craa5_sortorder"], "keys": [{ "column": "craa5_taskkey", "kind": "text", "mustMatch": "<shift>|<task>, e.g. night|trash" }, { "column": "craa5_area", "kind": "area", "mustMatch": "craa5___1_a_mss_area.craa5_area" }], "candidates": ["craa5___1_e_shifttask", "craa5_e_shifttask"], "notes": "Mandatory tasks per shift with no clean minutes (trash, admin, chemical clerk, janitorial, small and large steam pit, ...). craa5_shift day/night/both; craa5_days 7 digits Sun..Sat (0111110); craa5_minutes per shift, blank = whole shift. Written by the Sanitation director (v1.1, ground rule 11). Shift Start reads it later (planned: once the director rows carry fixed posts; v0.0018 does not read it); the Scheduler Crew plan no longer writes it. Never fall back to the plain craa5___1_e_shifttask: that is an old unused table with other columns. Not made yet: prompt in table-prompts.md part 9. Default 1.0.50: replaces the fixed posts in MSS_LOG_MANPOWER_SETUP (one manpower engine).", "colTypes": { "craa5_taskkey": { "type": "text", "len": 100 }, "craa5_shift": { "type": "text", "len": 10 }, "craa5_days": { "type": "text", "len": 7 }, "craa5_heads": { "type": "int" }, "craa5_minutes": { "type": "int" }, "craa5_area": { "type": "text", "len": 100 }, "craa5_active": { "type": "yesno" }, "craa5_sortorder": { "type": "int" } }, "new": true, "label": "_e_ Shift task", "owner": "org", "primary": { "n": "craa5_name", "len": 100 }, "alternateKey": "craa5_taskkey" }
];
var CONTRACT_CONFIG_KEYS = [
    { "key": "hub_people_thresholds", "app": "managerhub", "status": "planned", "note": "People thresholds (coaching below 75 % pace for 14 days, high performer list)." },
    { "key": "ganttly_settings", "app": "ganttly", "status": "planned", "note": "Ganttly settings (moved from itp_* browser keys)." },
    { "key": "mss_view_rules", "app": "msslog", "status": "planned", "note": "Log Input view rules (from browser key mss_log_input_view_module_v1). MSS_LOG_VIEW_CONFIG holds them today." },
    { "key": "scheduler_shared", "app": "prodsched", "status": "planned", "note": "Scheduler shared settings; today the config row in the Clean Plan, which may stay there." },
    { "key": "training_settings", "app": "training", "status": "planned", "note": "Minimum shifts, refresher days." },
    { "key": "mss_completion_exclusions", "app": "msscalendar", "status": "planned", "note": "Rooms, areas and equipment left out of MSS percentages." },
    { "key": "mss_line_downtime", "app": "msscalendar", "status": "planned", "note": "Only lines the Scheduler does not plan." },
    { "key": "MSS_CALENDAR_VIEW_CONFIG", "app": "msscalendar", "status": "inuse", "note": "Calendar view settings (in the app today)." },
    { "key": "MSS_LOG_VIEW_CONFIG", "app": "msslog", "status": "inuse", "note": "Log Input view permissions; the Calendar reads it. Becomes mss_view_rules." },
    { "key": "MSS_SKIP_CODES", "app": "msslog", "status": "inuse", "note": "Skip / not-done codes until the skip code table exists. The Calendar only reads it." },
    { "key": "MSS_LOG_ACCESS_LOG", "app": "msslog", "status": "inuse", "note": "Who opened MSS Log Input (names, emails): never export or print." },
    { "key": "MSS_CALENDAR_ACCESS_LOG", "app": "msscalendar", "status": "inuse", "note": "Who opened the MSS Calendar (names, emails), same shape as MSS_LOG_ACCESS_LOG: never export or print. Calendar PR #38." },
    { "key": "MSS_SKIPPED_ENTRIES_LOG", "app": "msscalendar", "status": "inuse", "note": "Calendar skipped entries history (Calendar only)." },
    { "key": "MSS_LOG_MANPOWER_SETUP", "app": "msslog", "status": "retiring", "note": "Manpower plan setup: fixed posts with no clean minutes (supervisor, leads, trash room, steam pits, admin) and vacation cover. {v:1, vacation, pct, basis, posts:[{id,name,heads,covers,days,hoursWeek}], savedBy, savedAt}. A screen estimate, not a section 7 metric. Retiring (1.0.60): headcount planning moves to the Sanitation director; its fixed posts go to _e_ Shift task." },
    { "key": "MSS_LOG_SKIPPED_ENTRIES", "app": "msslog", "status": "inuse", "note": "MSS Log Input skipped entries (PR #40); Log Input used to write MSS_SKIPPED_ENTRIES_LOG." },
    { "key": "PBED_WEEKEND_PLAN", "app": "pbed", "status": "legacy", "note": "Old PBED mirror; hub - pbed v1.x no longer uses it. Safe to leave; delete only when Alex chooses." },
    { "key": "PATHOGEN_BOLO_CONFIG", "app": "bolo", "status": "inuse", "note": "BOLO settings." },
    { "key": "PATHOGEN_BOLO_ACCESS_LOG", "app": "bolo", "status": "inuse", "note": "Who opened BOLO (names, emails): never export or print." },
    { "key": "PATHOGEN_BOLO_SUGGESTED_ACTIONS", "app": "bolo", "status": "inuse", "note": "Suggested actions." },
    { "key": "PATHOGEN_BOLO_HARBORAGE_CONCERNS", "app": "bolo", "status": "inuse", "note": "Harborage concerns." },
    { "key": "PATHOGEN_BOLO_USER_PROFILES_JSON", "app": "bolo", "status": "inuse", "note": "User profiles (names): never export or print." },
    { "key": "PATHOGEN_BOLO_EXEC_SYNOPSES", "app": "bolo", "status": "inuse", "note": "Executive synopses." },
    { "key": "PATHOGEN_BOLO_YOY_BENCHMARKS", "app": "bolo", "status": "inuse", "note": "Year over year benchmarks." },
    { "key": "PATHOGEN_BOLO_MANAGERS_HUB_GRAPHS", "app": "bolo", "status": "inuse", "note": "Graph data for the Manager hub (was a browser blob)." },
    { "key": "PATHOGEN_BOLO_RULES", "app": "bolo", "status": "inuse", "note": "{targets:{pathogen,apc,atp} percent, repeatDays, alertMonths, closeDays, updatedAt, updatedBy}. Defaults 2 / 5 / 5, 21 days, 2 months, 7 days (a positive with no MSS log clean of its equipment or area within closeDays of the swab is Overdue). Apps that show swab targets or open hits read it." },
    { "key": "PATHOGEN_BOLO_AREA_ALIASES", "app": "bolo", "status": "inuse", "note": "Area name aliases." },
    { "key": "PRODSCHED_CREWPLAN", "app": "prodsched", "status": "legacy", "note": "No longer written (Scheduler v4.9, 1.0.66). The Sanitation director read it once to seed director_settings. The row can be deleted once Alex has opened the director." },
    { "key": "PRODSCHED_SCENARIOS", "app": "prodsched", "status": "planned", "note": "Scheduler what-if scenarios (proposed 2026-10-23, not approved)." },
    { "key": "CHANGEOVER_RULES", "app": "unknown", "status": "unknown", "note": "Found 2026-10-22 with empty JSON. Not the Production Scheduler (its changeover rules are rows in craa5___1_p_changeoverrule). Maybe an older Gemini Argon build or the Dataverse organizer. Safe to leave." },
    { "key": "DIRECTOR_HEADS", "app": "director", "status": "inuse", "note": "Heads needed per shift (contract section 7), this plant week + 13 weeks: {v, from, to, share, vacation, basis, dayFrom, dayTo, cols, shifts:[[day, crew, start, hours, dn, need, clean, fixed, onCrew, used, from]], crews:{L:{need, vac, plan, planYear, onCrew, busiest, basis}}, tasksFrom, hash, at}. The number other apps read. Guide /mnt/project-files/sanitation-director/director-heads.md." },
    { "key": "director_settings", "app": "director", "status": "inuse", "note": "Sanitation director app: crew builder setups, target utilization, day/night cutoff (default day = start hour 04:00-15:59)." },
    { "key": "MONITOR_BUILD_LOG", "app": "monitor", "status": "legacy", "note": "No longer written (monitor v3.2): the monitor never builds. Old rows may remain." },
    { "key": "MONITOR_HISTORY", "app": "monitor", "status": "inuse", "note": "One counts-only summary per day (monitor v2.8). No names or row data." }
];
var CONTRACT_APP_IDS = ["ganttly", "shiftstart", "prodsched", "msscalendar", "msslog", "pbed", "bolo", "managerhub", "chemicals", "mapsubmit", "monitor", "training", "director"];
// First list from the Antigravity organizer: labels and optional columns only (see the contract list below).
var LEGACY_TABLES = [
    {
        logicalName: 'craa5___1_a_mss_area',
        entitySetName: 'craa5___1_a_mss_areas',
        primaryId: 'craa5___1_a_mss_areaid',
        primaryName: 'craa5_area',
        category: 'Core Master Data',
        label: 'MSS Areas / Rooms',
        usedBy: ['shift_start', 'ganttly', 'prod_sched', 'manager_hub'],
        requiredCols: ['craa5___1_a_mss_areaid', 'craa5_area'],
        optionalCols: [
            'craa5_production', 'craa5_runsproduct', 'craa5_everyday', 'craa5_clipboard',
            'craa5_emojiselection', 'craa5_numberoflines', 'craa5_supportingpart',
            'craa5_textadditions', 'craa5_parentroom', 'craa5_daily', 'craa5_eeutilization',
            '_craa5_roomlookup_value'
        ],
        notes: 'Primary Name is craa5_area. Supporting lines live in craa5_supportingpart; extra config (offset/priority) lives in craa5_textadditions and craa5___1_p_linepriority.'
    },
    {
        logicalName: 'craa5___1_a_assets',
        entitySetName: 'craa5___1_a_assetses',
        primaryId: 'craa5___1_a_assetsid',
        primaryName: 'craa5_equipmentidentifier',
        category: 'Core Master Data',
        label: 'Equipment Assets (Primary)',
        usedBy: ['shift_start', 'ganttly', 'prod_sched', 'mss_input', 'mss_cal', 'pbed', 'bolo', 'map_tool'],
        requiredCols: ['craa5___1_a_assetsid', 'craa5_equipmentidentifier', 'craa5_roomname', 'craa5_areaname'],
        optionalCols: [
            'craa5_subcategory', 'craa5_hoursrequired', 'craa5_dailymin', 'craa5_minalrg',
            'craa5_heads', 'craa5_uniqueid', 'craa5_priority', 'craa5_cleanorder',
            'craa5_dailyclean', 'craa5_midweek', 'craa5_weeklyclean', 'craa5_monthlyclean',
            'craa5_month', 'craa5_quarterly', 'craa5_annually', 'craa5_maplocation',
            'craa5_departmentcode', 'craa5_workareacode', 'craa5_picture',
            'craa5_pictureofequipment', 'craa5_ssop', 'craa5_sop1', 'craa5_sop2', 'craa5_sop3',
            'craa5_sapshift', 'craa5_sapmonthly', 'craa5_saptwomonth', 'craa5_sapquarterly',
            'craa5_sapsixmonth', 'craa5_sapannually', '_craa5_area_lookup_value'
        ],
        notes: 'Primary Name is craa5_equipmentidentifier. Notice craa5_hoursrequired stores minutes in live records.'
    },
    {
        logicalName: 'craa5___1_a_assets',
        entitySetName: 'craa5___1_a_assetses',
        primaryId: 'craa5___1_a_assetsid',
        primaryName: 'craa5_title',
        category: 'Core Master Data',
        label: 'Master Sanitation SAP Assets',
        usedBy: ['prod_sched', 'mss_input', 'mss_cal'],
        requiredCols: ['craa5___1_a_assetsid', 'craa5_title', 'craa5_equipment'],
        optionalCols: [
            'craa5_textroom', 'craa5_textarea', 'craa5_olduid', 'craa5_hourstoclean',
            'craa5_headstoclean', 'craa5_freqofclean', 'craa5_sapshift', 'craa5_sapdaily',
            'craa5_sapw', 'craa5_sapmonthly', 'craa5_saptwomonth', 'craa5_sapquarterly',
            'craa5_sapsixmonth', 'craa5_sapannual', '_craa5_area_lu_value',
            'craa5_locationonmap', 'craa5_pictureofequipment1', 'craa5_pictureofequipment2'
        ],
        notes: 'Primary Name is craa5_title (SAP code). Links to craa5___1_a_assets via equipment/room/SAP codes.'
    },
    {
        logicalName: 'craa5___1_a_employee',
        entitySetName: 'craa5___1_a_employees',
        primaryId: 'craa5___1_a_employeeid',
        primaryName: 'craa5_name',
        category: 'Core Master Data',
        label: 'Employees Roster',
        usedBy: ['shift_start', 'ganttly', 'prod_sched', 'pbed', 'manager_hub'],
        requiredCols: ['craa5___1_a_employeeid', 'craa5_name', 'craa5_shift', 'craa5_role'],
        optionalCols: [
            'craa5_badgenumber', 'craa5_email', 'craa5_utilized', 'craa5_intraining',
            'craa5_trainingarea', '_craa5_leadershipteamid_value', '_craa5_roleid_value',
            'craa5_remarks', 'craa5_remarkcategory', 'craa5_pin'
        ],
        notes: 'Primary Name is craa5_name. Includes craa5_intraining and craa5_trainingarea. craa5_role: 256000000=Sanitor, 256000001=Lead, 256000002=Supervisor.'
    },
    {
        logicalName: 'craa5___1_a_leadershipteam',
        entitySetName: 'craa5___1_a_leadershipteams',
        primaryId: 'craa5___1_a_leadershipteamid',
        primaryName: 'craa5_teamname',
        category: 'Core Master Data',
        label: 'Leadership Teams',
        usedBy: ['shift_start'],
        requiredCols: ['craa5___1_a_leadershipteamid', 'craa5_teamname'],
        optionalCols: ['_craa5_teamleademployeeid_value', 'craa5_active'],
        notes: 'Maps Employee _craa5_leadershipteamid_value to Supervisor/Lead team names in Shift Start.'
    },
    {
        logicalName: 'craa5___1_a_workshift',
        entitySetName: 'craa5___1_a_workshifts',
        primaryId: 'craa5___1_a_workshiftid',
        primaryName: 'craa5_dayname',
        category: 'Core Master Data',
        label: 'Work Shifts Rotation',
        usedBy: ['shift_start', 'ganttly', 'prod_sched', 'manager_hub'],
        requiredCols: ['craa5___1_a_workshiftid', 'craa5_shiftcode', 'craa5_dayname', 'craa5_daynumber', 'craa5_shiftstarthour', 'craa5_shiftendhour'],
        optionalCols: [],
        notes: 'Defines 24/7 crew rotation windows by day of week and start/end hours.'
    },
    {
        logicalName: 'craa5___1_s_shiftboard',
        entitySetName: 'craa5___1_s_shiftboards',
        primaryId: 'craa5___1_s_shiftboardid',
        primaryName: 'craa5_name',
        category: 'Shift Operations',
        label: 'Live Shift Boards',
        usedBy: ['shift_start', 'ganttly', 'manager_hub'],
        requiredCols: ['craa5___1_s_shiftboardid', 'craa5_boardjson'],
        optionalCols: [
            'craa5_title', 'craa5_name', 'craa5_updatesjson', 'craa5_status',
            'craa5_crew', 'craa5_team', 'craa5_slotstart', 'craa5_slotend',
            'craa5_savecount', 'craa5_lastsavedby', 'craa5_archivedon', 'craa5_archivedby'
        ],
        notes: 'Primary live board store between Shift Start, Ganttly, and Manager Hub. craa5_updatesjson syncs live equipment started/done/undone events.'
    },
    {
        logicalName: 'craa5___1_s_shiftplan',
        entitySetName: 'craa5___1_s_shiftplans',
        primaryId: 'craa5___1_s_shiftplanid',
        primaryName: 'craa5_shiftplan1',
        category: 'Shift Operations',
        label: 'Planned Shift & PBED Setups',
        usedBy: ['shift_start', 'ganttly', 'pbed'],
        requiredCols: ['craa5___1_s_shiftplanid', 'craa5_boardjson'],
        optionalCols: [
            'craa5_shiftplan1', 'craa5_title', 'craa5_status', 'craa5_crew', 'craa5_team',
            'craa5_slotstart', 'craa5_slotend', 'craa5_savecount', 'craa5_lastsavedby',
            'craa5_usedon', 'craa5_usedby', 'craa5_liveboardid', 'craa5_updatesjson'
        ],
        notes: 'Primary Name is craa5_shiftplan1 (plus craa5_title). Stores upcoming shift setups from Shift Start and weekend plans from PBED.'
    },
    {
        logicalName: 'craa5___1_s_shiftarchive',
        entitySetName: 'craa5___1_s_shiftarchives',
        primaryId: 'craa5___1_s_shiftarchiveid',
        primaryName: 'craa5_shiftarchive1',
        category: 'Shift Operations',
        label: 'Archived Shift Boards',
        usedBy: ['shift_start', 'ganttly'],
        requiredCols: ['craa5___1_s_shiftarchiveid', 'craa5_boardjson'],
        optionalCols: [
            'craa5_shiftarchive1', 'craa5_title', 'craa5_updatesjson', 'craa5_status',
            'craa5_crew', 'craa5_team', 'craa5_slotstart', 'craa5_slotend',
            'craa5_source', 'craa5_sourceboardid', 'craa5_retiredon', 'craa5_archivedon', 'craa5_archivedby'
        ],
        notes: 'Primary Name is craa5_shiftarchive1 (plus craa5_title). Historical completed shift boards for 6-week crew experience.'
    },
    {
        logicalName: 'craa5___1_s_shiftpreset',
        entitySetName: 'craa5___1_s_shiftpresets',
        primaryId: 'craa5___1_s_shiftpresetid',
        primaryName: 'craa5_name',
        category: 'Shift Operations',
        label: 'Shift Presets (Templates)',
        usedBy: ['shift_start'],
        requiredCols: ['craa5___1_s_shiftpresetid', 'craa5_name', 'craa5_boardjson'],
        optionalCols: ['craa5_crew', 'craa5_slotstart', 'craa5_supervisor', 'craa5_savedby'],
        notes: 'Reusable crew/supervisor board templates.'
    },
    {
        logicalName: 'craa5___1_s_shiftlog',
        entitySetName: 'craa5___1_s_shiftlogs',
        primaryId: 'craa5___1_s_shiftlogid',
        primaryName: 'craa5_action',
        category: 'Shift Operations',
        label: 'Shift Audit Log',
        usedBy: ['shift_start', 'ganttly', 'mss_input', 'mss_cal'],
        requiredCols: ['craa5___1_s_shiftlogid', 'craa5_action'],
        optionalCols: ['craa5_details', 'craa5_user', 'craa5_useremail', 'craa5_role', 'craa5_board', 'craa5_boardid', 'craa5_crew', 'craa5_team', 'craa5_summary', 'craa5_app', 'craa5_at'],
        notes: 'Audit log of shift actions and user sessions.'
    },
    {
        logicalName: 'craa5___1_s_taskassignment',
        entitySetName: 'craa5___1_s_taskassignments',
        primaryId: 'craa5___1_s_taskassignmentid',
        primaryName: 'craa5_id',
        category: 'Shift Operations',
        label: 'Row-Level Task Assignments',
        usedBy: ['shift_start', 'ganttly', 'pbed', 'manager_hub'],
        requiredCols: ['craa5___1_s_taskassignmentid', 'craa5_id', 'craa5_area', 'craa5_shift'],
        optionalCols: [
            'craa5__aaemp_guid', 'craa5_lead', 'craa5_team', 'craa5_room',
            'craa5_equip', 'craa5_equipment', 'craa5_datetimeofassignment',
            'craa5_starttime', 'craa5_endtime', 'craa5_percentagecomplete',
            'craa5_complete', 'craa5_whatisbeingdone', 'craa5_whatislefttodo',
            'craa5__currentstatus', 'craa5_beforepicture', 'craa5_afterpicture'
        ],
        notes: 'Primary Name is craa5_id (Employee Name). Synced alongside craa5___1_s_shiftboard so Manager Hub, PBED, and Ganttly see live row assignments.'
    },
    {
        logicalName: 'craa5___1_s_cleancheckoff',
        entitySetName: 'craa5___1_s_cleancheckoffs',
        primaryId: 'craa5___1_s_cleancheckoffid',
        primaryName: 'craa5_cleancheckoff1',
        category: 'Shift Operations',
        label: 'Ganttly Live Equipment Checkoffs',
        usedBy: ['ganttly'],
        requiredCols: ['craa5___1_s_cleancheckoffid', 'craa5_checkoffkey', 'craa5_status', 'craa5_details'],
        optionalCols: [
            'craa5_cleancheckoff1', 'craa5_name', 'craa5_equipmentguid', 'craa5_equipmentid',
            'craa5_equipment', 'craa5_area', 'craa5_startedat', 'craa5_doneat', 'craa5_keepuntil'
        ],
        notes: 'Primary Name is craa5_cleancheckoff1. Stores real-time started/done/undone equipment checkoffs in Ganttly.'
    },
    {
        logicalName: 'craa5___1_p_prodschedule',
        entitySetName: 'craa5___1_p_prodschedules',
        primaryId: 'craa5___1_p_prodscheduleid',
        primaryName: 'craa5_area',
        category: 'Production & Clean Planning',
        label: 'Production Schedule Runs',
        usedBy: ['shift_start', 'ganttly', 'prod_sched', 'mss_cal', 'pbed', 'manager_hub'],
        requiredCols: ['craa5___1_p_prodscheduleid', 'craa5_area', 'craa5_line', 'craa5_datestarttime', 'craa5_dateendtime', 'craa5_product'],
        optionalCols: [
            'craa5_productcode', 'craa5_allergen', 'craa5_crumbclean', 'craa5_typeofallergen',
            'craa5_ordernumber', 'craa5_cases', 'craa5_notes', 'craa5_mssareaguid', 'craa5_importbatch'
        ],
        notes: 'Master production schedule table written by Production Scheduler and Manager Hub, read across 6 apps.'
    },
    {
        logicalName: 'craa5___1_p_cleanplan',
        entitySetName: 'craa5___1_p_cleanplans',
        primaryId: 'craa5___1_p_cleanplanid',
        primaryName: 'craa5_cleanplanname',
        category: 'Production & Clean Planning',
        label: 'Published Sanitation Clean Plan',
        usedBy: ['prod_sched', 'ganttly', 'shift_start'],
        requiredCols: ['craa5___1_p_cleanplanid', 'craa5_plankey', 'craa5_rowtype', 'craa5_area'],
        optionalCols: [
            'craa5_cleanplanname', 'craa5_name', 'craa5_linekey', 'craa5_line', 'craa5_mssareaguid',
            'craa5_day', 'craa5_start', 'craa5_end', 'craa5_cleankind', 'craa5_minutes',
            'craa5_status', 'craa5_reason', 'craa5_details', 'craa5_publishbatch', 'craa5_contenthash'
        ],
        notes: 'Primary Name is craa5_cleanplanname (plus craa5_name). Published by Production Scheduler and consumed by Ganttly and Shift Start.'
    },
    {
        logicalName: 'craa5___1_p_linepriority',
        entitySetName: 'craa5___1_p_linepriorities',
        primaryId: 'craa5___1_p_linepriorityid',
        primaryName: 'craa5_linepriority1',
        category: 'Production & Clean Planning',
        label: 'Production Line Priorities',
        usedBy: ['ganttly', 'manager_hub', 'prod_sched'],
        requiredCols: ['craa5___1_p_linepriorityid', 'craa5_linepriority1', 'craa5_priority'],
        optionalCols: ['craa5_name', 'craa5_aliases', 'craa5_otherspellings'],
        notes: 'Primary Name is craa5_linepriority1 (plus craa5_name). Managed in Manager Hub & Production Scheduler, read by Ganttly.'
    },
    {
        logicalName: 'craa5___1_p_changeoverrule',
        entitySetName: 'craa5___1_p_changeoverrules',
        primaryId: 'craa5___1_p_changeoverruleid',
        primaryName: 'craa5_name',
        category: 'Production & Clean Planning',
        label: 'Line Changeover Rules',
        usedBy: ['prod_sched'],
        requiredCols: ['craa5___1_p_changeoverruleid', 'craa5_name', 'craa5_line'],
        optionalCols: [
            'craa5_ruletype', 'craa5_cleaning_tier', 'craa5_base_wash_minutes',
            'craa5_heads_required', 'craa5_requires_swab', 'craa5_active', 'craa5_rule_condition_json'
        ],
        notes: 'Primary Name is craa5_name. Full rule configuration JSON is stored in craa5_rule_condition_json.'
    },
    {
        logicalName: 'craa5___1_p_skumaster',
        entitySetName: 'craa5___1_p_skumasters',
        primaryId: 'craa5___1_p_skumasterid',
        primaryName: 'craa5_skucode',
        category: 'Production & Clean Planning',
        label: 'SKU Master Catalog',
        usedBy: ['prod_sched'],
        requiredCols: ['craa5___1_p_skumasterid', 'craa5_skucode'],
        optionalCols: [
            'craa5_productname', 'craa5_allergens', 'craa5_actualcaserate', 'craa5_idealcaserate',
            'craa5_line', 'craa5_notes', 'craa5_packsize', 'craa5_productfamily',
            'craa5_specialrules', 'craa5_unitspercase', 'craa5_activeequipmentids',
            'craa5_baselineefficiency', 'craa5_coldholdallowed', 'craa5_crustcolor', 'craa5_crustprofile'
        ],
        notes: 'Primary Name is craa5_skucode; product description is craa5_productname; allergens in craa5_allergens.'
    },
    {
        logicalName: 'craa5___1_l_log',
        entitySetName: 'craa5___1_l_logs',
        primaryId: 'craa5___1_l_logid',
        primaryName: 'craa5_uid',
        category: 'MSS Compliance & Logging',
        label: 'Sanitation Completion Log',
        usedBy: ['shift_start', 'ganttly', 'prod_sched', 'mss_input', 'mss_cal'],
        requiredCols: ['craa5___1_l_logid', 'craa5_equipment', 'craa5_lastcleaned', 'craa5_lastcleanedby'],
        optionalCols: [
            'craa5_uid', 'craa5_equipmentguid', 'craa5_room', 'craa5_area', 'craa5_sap',
            'craa5_sapw', 'craa5_hoursworked', 'craa5_daily', 'craa5_weekly', 'craa5_monthly',
            'craa5_allergenclean', 'craa5_pathogen', 'craa5_bundle', 'craa5_idofssop',
            'craa5_nameofemployee', 'craa5_pictureorfileofpaperwork', 'craa5_pictureorfileofpaperwork_name'
        ],
        notes: 'Primary Name is craa5_uid. Master ledger of completed and skipped sanitation tasks across MSS Log Input, MSS Calendar, Ganttly, Shift Start, and Production Scheduler.'
    },
    {
        logicalName: 'craa5__sani_schedule_',
        entitySetName: 'craa5__sani_schedule_s',
        primaryId: 'craa5__sani_schedule_id',
        primaryName: 'craa5_title',
        category: 'MSS Compliance & Logging',
        label: 'Sanitation Schedule Events',
        usedBy: ['mss_cal'],
        requiredCols: ['craa5__sani_schedule_id', 'craa5_title'],
        optionalCols: [
            'craa5_areaaffected', 'craa5_category', 'craa5_datetimestart', 'craa5_datetimeend',
            'craa5_details', 'craa5_comments', 'craa5_nameofcommentor', 'craa5_nameforpto', 'craa5_hoursworked'
        ],
        notes: 'Calendar schedule events and PTO entries.'
    },
    {
        logicalName: 'craa5___1_e_hubconfig',
        entitySetName: 'craa5___1_e_hubconfigs',
        primaryId: 'craa5___1_e_hubconfigid',
        primaryName: 'craa5_configname',
        category: 'Shared Ecosystem Config & Audit',
        label: 'Shared Hub Configuration Store',
        usedBy: ['mss_input', 'mss_cal', 'pbed', 'bolo'],
        requiredCols: ['craa5___1_e_hubconfigid', 'craa5_configname', 'craa5_configkey', 'craa5_configjson'],
        optionalCols: [
            'craa5_category', 'craa5_isownerdefault', 'craa5_notes', 'craa5_ownerkey',
            'craa5_ownername', 'craa5_scope', 'craa5_updatedby', 'craa5_useforall', 'craa5_version'
        ],
        notes: 'Primary Name is craa5_configname; Key is craa5_configkey; JSON payload is craa5_configjson. Shared across MSS Log Input, MSS Calendar, PBED, and Pathogen BOLO.'
    },
    {
        logicalName: 'craa5__facilityobservation',
        entitySetName: 'craa5__facilityobservations',
        primaryId: 'craa5__facilityobservationid',
        primaryName: 'craa5__area',
        category: 'Facility Maps & BOLO',
        label: 'Facility Observations & Harborage Pins',
        usedBy: ['map_tool', 'bolo'],
        requiredCols: ['craa5__facilityobservationid', 'craa5__area'],
        optionalCols: [
            'craa5__room', 'craa5__description', 'craa5__whotonotify', 'craa5__whotonotifyemail',
            'craa5__equipment', 'craa5__facility', 'craa5__customnote', 'craa5_mapx', 'craa5_mapy',
            'craa5__boxwidth', 'craa5__boxheight', 'craa5_pictureof'
        ],
        notes: 'Primary Name is craa5__area; Primary Image is craa5_pictureof. Uses double-underscore text columns (craa5__room, craa5__description, craa5__whotonotify, craa5__equipment, craa5__facility, craa5__customnote, craa5__boxwidth, craa5__boxheight) and single-underscore craa5_mapx, craa5_mapy.'
    },
    {
        logicalName: 'craa5___1_g_maps',
        entitySetName: 'craa5___1_g_mapses',
        primaryId: 'craa5___1_g_mapsid',
        primaryName: 'craa5_facility',
        category: 'Facility Maps & BOLO',
        label: 'Facility Floor Maps',
        usedBy: ['map_tool', 'bolo'],
        requiredCols: ['craa5___1_g_mapsid', 'craa5_facility'],
        optionalCols: ['craa5_mapimage', 'craa5_area', 'craa5_room', 'craa5_equipment'],
        notes: 'Stores high-res facility map images read by Map Submission Tool and Pathogen BOLO.'
    },
    {
        logicalName: 'craa5_pathogenboloswabcatalog9900',
        entitySetName: 'craa5_pathogenboloswabcatalog9900s',
        primaryId: 'craa5_pathogenboloswabcatalog9900id',
        primaryName: 'craa5_pathogenboloswabcatalog99001',
        category: 'Facility Maps & BOLO',
        label: 'Pathogen BOLO Swab Catalog',
        usedBy: ['bolo'],
        requiredCols: ['craa5_pathogenboloswabcatalog9900id', 'craa5_pathogenboloswabcatalog99001'],
        optionalCols: [],
        notes: 'Live Dataverse Pathogen BOLO swab catalog table.'
    },
    {
        logicalName: 'craa5___1_m_supervisortodo',
        entitySetName: 'craa5___1_m_supervisortodos',
        primaryId: 'craa5___1_m_supervisortodoid',
        primaryName: 'craa5_task',
        category: 'Manager Hub & Specialty',
        label: 'Supervisor To-Do Tasks',
        usedBy: ['manager_hub'],
        requiredCols: ['craa5___1_m_supervisortodoid', 'craa5_task'],
        optionalCols: [
            'craa5_taskdescription', 'craa5_assignedto', 'craa5_dateassigned',
            'craa5_complete', 'craa5_expectationfortimeframe', 'craa5_area', 'craa5_room',
            'craa5_equipment', 'craa5_completiondate', 'craa5_photoofcompletion', 'craa5_pictureofareaonmap'
        ],
        notes: 'Supervisor action items in Manager Hub.'
    }
];
// Tables made after the first organizer list: hub - manager "_m_" tables and hub - chemicals "_c_" tables.
// Entity set names are read from Dataverse at scan time, so they are not listed here.
var MH_TABLES = [
    { key: 'formtemplate', label: 'Manager Form Templates' },
    { key: 'timelosslog', label: 'Manager Time Loss Log' },
    { key: 'quicktask', label: 'Manager Quick Tasks' }
].map(function (t) { return ({
    logicalName: 'craa5__m_' + t.key,
    primaryId: 'craa5__m_' + t.key + 'id',
    primaryName: 'craa5_name',
    category: 'Manager Hub & Specialty',
    label: t.label,
    usedBy: ['manager_hub'],
    requiredCols: ['craa5__m_' + t.key + 'id', 'craa5_name'],
    optionalCols: [],
    notes: 'hub - manager v6.8 looks for this "_m_" table first and the plain name second.'
}); });
var CHEM_TABLES = [
    ['chemical', 'Chemicals'], ['distributor', 'Distributors'], ['chemicalinventory', 'Chemical Inventory'],
    ['cart', 'Carts (SAP Orders)'], ['cartline', 'Cart Lines'], ['chemicalcount', 'Chemical Counts'],
    ['chemicalusagelog', 'Chemical Usage Log'], ['areaalias', 'Area Aliases'], ['chemicalalias', 'Chemical Aliases'],
    ['titrationtarget', 'Titration Targets'], ['checklisttask', 'Checklist Tasks'], ['clerkchecklist', 'Clerk Checklists'],
    ['chemicalstandard', 'Chemical Standards'], ['sanitationbudget', 'Sanitation Budget']
].map(function (p) { return ({
    logicalName: 'craa5__c_' + p[0],
    primaryId: 'craa5__c_' + p[0] + 'id',
    primaryName: 'craa5__c_' + p[0] + 'name',
    category: 'Chemical Hub',
    label: p[1],
    usedBy: ['chem_hub'],
    requiredCols: ['craa5__c_' + p[0] + 'id', 'craa5__c_' + p[0] + 'name'],
    optionalCols: [],
    notes: 'hub - chemicals table (see chemical-ordering/table-spec.md for its full column list).'
}); });
MH_TABLES.concat(CHEM_TABLES).forEach(function (t) { return LEGACY_TABLES.push(t); });
// ---------------------------------------------------------------------------
// The table list the monitor checks comes from the shared data contract above.
// The older organizer list (LEGACY_TABLES) only supplies screen labels and
// extra optional columns; tables only it knows (the _c_ chemical tables) are
// added after the contract's.
// ---------------------------------------------------------------------------
var GROUP_LABELS = {
    reference: 'Reference data',
    flow: 'Data passed between apps',
    other: 'Other',
    unknown: 'Named in app code, not confirmed',
    abandoned: 'Abandoned',
    unlisted: 'Old tables no app uses',
    chemical: 'Chemical Hub',
    floor: 'Floor work'
};
// The contract's optional columns per table (checked, never required). The printout says whether each is there.
var NOTE_OPTIONAL_COLS = {};
CONTRACT_TABLES.forEach(function (c) { if (c.optionalCols && c.optionalCols.length)
    NOTE_OPTIONAL_COLS[c.logicalName] = c.optionalCols; });
function uniqList(list) { var seen = {}; return list.filter(function (x) { return (x && !seen[x] ? (seen[x] = true) : false); }); }
function prettyTableName(logical) { return String(logical).replace(/^craa5_+/, '').replace(/_+/g, ' ').trim(); }
var LEGACY_BY_NAME = {};
LEGACY_TABLES.forEach(function (t) { LEGACY_BY_NAME[t.logicalName] = t; });
var ECOSYSTEM_TABLES = CONTRACT_TABLES.map(function (c) {
    var old = LEGACY_BY_NAME[c.logicalName] || {};
    var req = (c.requiredCols && c.requiredCols.length) ? c.requiredCols : (old.requiredCols || []);
    var keyCols = (c.keys || []).map(function (k) { return k.column; });
    var opt = uniqList((old.optionalCols || []).concat(c.optionalCols || [], NOTE_OPTIONAL_COLS[c.logicalName] || [], keyCols)).filter(function (x) { return req.indexOf(x) === -1; });
    var writers = c.writers || [];
    var readers = c.readers || [];
    return {
        logicalName: c.logicalName,
        entitySetName: c.entitySetName && c.entitySetName !== '(probe)' ? c.entitySetName : '',
        primaryId: c.primaryId || old.primaryId || c.logicalName + 'id',
        primaryName: c.primaryName || old.primaryName || '',
        status: c.status || 'live',
        expectedOwnership: c.ownership || '',
        category: GROUP_LABELS[c.group] || c.group || 'Other',
        label: old.label || prettyTableName(c.logicalName),
        writers: writers,
        readers: readers,
        usedBy: uniqList(writers.concat(readers).map(appIdOf)),
        requiredCols: req,
        optionalCols: opt,
        keys: c.keys || [],
        columnOwners: c.columnOwners || [],
        candidates: (c.candidates && c.candidates.length) ? c.candidates : [c.logicalName],
        notes: c.notes || old.notes || '',
        colTypes: c.colTypes || {},
        isNew: c['new'] === true,
        newLabel: c.label || '',
        newOwner: c.owner || '',
        newPrimary: c.primary || null,
        alternateKey: c.alternateKey || '',
        noBuildCols: c.noBuildCols || []
    };
});
(function addTablesOnlyTheOldListKnows() {
    var inContract = {};
    ECOSYSTEM_TABLES.forEach(function (t) { return t.candidates.concat([t.logicalName]).forEach(function (n) { inContract[n] = true; }); });
    LEGACY_TABLES.forEach(function (t) {
        if (inContract[t.logicalName] || t.category !== 'Chemical Hub')
            return;
        ECOSYSTEM_TABLES.push({
            logicalName: t.logicalName, entitySetName: '', primaryId: t.primaryId, primaryName: t.primaryName,
            status: 'live', expectedOwnership: '', category: GROUP_LABELS.chemical, label: t.label,
            writers: ['Chemical hub'], readers: ['Chemical hub'], usedBy: ['chemical_hub'],
            requiredCols: t.requiredCols, optionalCols: t.optionalCols, keys: [], candidates: [t.logicalName],
            notes: t.notes + ' Not in the data contract yet.'
        });
    });
})();
var ECOSYSTEM_APPS = uniqList(ECOSYSTEM_TABLES.reduce(function (acc, t) { return acc.concat(t.writers, t.readers); }, []))
    .sort(function (a, b) { return a.localeCompare(b); })
    .map(function (name) { return ({ id: appIdOf(name), name: name }); });
var STORAGE_BRIDGES = [
    {
        key: 'ss_live_boards_local_v1',
        store: 'localStorage',
        writers: ['Shift Start', 'Ganttly'],
        readers: ['Shift Start', 'Ganttly'],
        contract: 'Array of live shift board objects ({ id, recordId, crew, team, slotStart, slotEnd, status, rows, updates }). Archived boards must be pruned immediately.'
    },
    {
        key: 'ss_presets_v1',
        store: 'localStorage',
        writers: ['Shift Start'],
        readers: ['Shift Start', 'Ganttly'],
        contract: 'Object dictionary keyed by "<shift>|<slotEpochHours>" (or Array) of planned shift setups.'
    },
    {
        key: 'SS_DATA_CACHE_V2',
        store: 'sessionStorage',
        writers: ['Shift Start', 'Ganttly'],
        readers: ['Shift Start', 'Ganttly'],
        contract: 'Synchronized with SS_DATA_CACHE_V1. Holds { ts, employees, areas, assets, shifts, recentRows, liveBoards }.'
    },
    {
        key: 'SS_DATA_CACHE_V1',
        store: 'sessionStorage',
        writers: ['Shift Start', 'Ganttly'],
        readers: ['Shift Start', 'Ganttly'],
        contract: 'Synchronized companion to SS_DATA_CACHE_V2 for cross-tab/component boot caching.'
    },
    {
        key: 'prodsched_clean_windows_v1',
        store: 'localStorage',
        writers: ['Production Scheduler'],
        readers: ['Production Scheduler', 'Ganttly', 'Shift Start'],
        contract: 'Array of computed sanitation clean windows between production runs.'
    },
    {
        key: 'mss_log_asset_catalog_v4',
        store: 'sessionStorage',
        writers: ['MSS Log Input', 'MSS Calendar'],
        readers: ['MSS Log Input', 'MSS Calendar'],
        contract: 'Object { ts, complete, msCount, items: [...], assets: [...] } containing enriched asset + SAP code catalog.'
    },
    {
        key: 'mss_log_input_view_module_v1',
        store: 'localStorage',
        writers: ['MSS Log Input'],
        readers: ['MSS Log Input', 'MSS Calendar'],
        contract: 'Object { version, plantDefaultPreset, userAssignments: [...] } imported by MSS Calendar into userRules.'
    },
    {
        key: 'mss_log_input_access_audit_v1',
        store: 'localStorage',
        writers: ['MSS Log Input', 'MSS Calendar'],
        readers: ['MSS Log Input', 'MSS Calendar'],
        contract: 'Array of session audit entries with normalized accessedAt, lastActiveAt, viewPreset, and tabsVisited.'
    }
];
// ============================================================================
// DATAVERSE CHECK ENGINE (no React in this block, so it can be tested alone)
// Rule: a table is only called found when Dataverse said so; a column is only
// called there or missing when the table's metadata (or a real row) said so.
// Anything else is "could not tell" and never shows green.
// ============================================================================
var DV_TIMEOUT_MS = 15000;
var DV_COUNT_CAP_FETCH = 5000;
var DV_COUNT_CAP_AGG = 50000;
function dvErrText(e) {
    if (!e)
        return '';
    if (typeof e === 'string')
        return e.replace(/\s+/g, ' ').slice(0, 400);
    var m = '';
    try {
        m = e.message || (e.error && e.error.message) || '';
    }
    catch (x) { }
    if (!m) {
        try {
            m = JSON.stringify(e);
        }
        catch (x) {
            m = String(e);
        }
    }
    var code = (e && (e.errorCode || e.code)) ? ' (' + (e.errorCode || e.code) + ')' : '';
    return (String(m) + code).replace(/\s+/g, ' ').slice(0, 400);
}
// What kind of refusal this is. Wordings are the ones Dataverse uses (same list as hub - manager).
function dvClassify(err) {
    var m = typeof err === 'string' ? err : dvErrText(err);
    if (/resource not found for the segment|not found in the metadatacache/i.test(m))
        return 'table';
    if (/could not find a property|property .{0,80}(does not exist|not found)|undeclared property|not a valid (attribute|property|column)|invalid (column|attribute|property)|(attribute|column) .{0,60}(does not exist|not found)|0x80040203|0x80060888|(does not|doesn'?t) contain (an? )?(attribute|column|property)/i.test(m))
        return 'column';
    if (/with ids? ?=.{0,80}(does not|do not) exist/i.test(m))
        return 'gone';
    if (/(entity|table) .{0,120}(does not exist|not found)|could not find (an? )?(entity|table)|could not find table with name|(unable to|could not) (find|retrieve|load) (the )?(entity )?metadata|not a valid (entity|table)|unknown (table|entity)|\b404\b|0x80040217|0x80060891|0x80094005|doesn'?t exist/i.test(m))
        return 'table';
    if (/\b40[13]\b|forbidden|privilege|prv(read|create|write|append|delete)|access (is )?denied|not authori[sz]ed|unauthori[sz]ed|permission|does not have \w*access right|SecLib::AccessCheckEx|0x80040220|0x80040277|-2147187962/i.test(m))
        return 'denied';
    if (/timed out|timeout expired|sql timeout|0x80044151|failed to fetch|network|offline|\b(429|5\d\d)\b|unavailable|too many requests|number of requests exceeded|0x8007232[126]|try again later|server busy|gateway time-?out|bad gateway/i.test(m))
        return 'network';
    return 'other';
}
// A refusal that names a privilege proves the table is there; a bare 401/403 (sign-in) proves nothing.
function dvNamesPrivilege(m) {
    return /prv(read|create|write|append|delete)|privilege|SecLib::AccessCheckEx|0x80040220|0x80040277|-2147187962|principal user/i.test(String(m || ''));
}
function dvTimeout(make, label, ms) {
    return new Promise(function (resolve, reject) {
        var t = setTimeout(function () { return reject(new Error(label + ' timed out')); }, ms || DV_TIMEOUT_MS);
        var p;
        try {
            p = typeof make === 'function' ? make() : make;
        }
        catch (e) {
            clearTimeout(t);
            reject(e);
            return;
        }
        Promise.resolve(p).then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
}
// "_craa5_area_lookup_value" (how rows show a lookup) and "craa5_area_lookup" (its metadata name) are the same column.
function dvColKey(c) {
    var s = String(c || '').toLowerCase();
    var m = s.match(/^_(.+)_value$/);
    return m ? m[1] : s;
}
function dvIsLookupCol(c) { return /^_.+_value$/i.test(String(c || '')); }
function dvFrames() {
    var out = [];
    try {
        if (typeof window !== 'undefined')
            out.push(window);
    }
    catch (e) { }
    try {
        if (typeof window !== 'undefined' && window.parent && window.parent !== window)
            out.push(window.parent);
    }
    catch (e) { }
    try {
        if (typeof window !== 'undefined' && window.top && window.top !== window)
            out.push(window.top);
    }
    catch (e) { }
    return out;
}
function dvFindXrm() {
    var fr = dvFrames();
    for (var i = 0; i < fr.length; i++) {
        try {
            if (fr[i] && fr[i].Xrm)
                return fr[i].Xrm;
        }
        catch (e) { }
    }
    return null;
}
// Every way this page can reach Dataverse. Found once per page, not on every render.
function dvConnect(props) {
    var conn = { web: null, dataApi: null, clientUrl: '', xrm: null, routes: [] };
    try {
        if (props && props.webApi && typeof props.webApi.retrieveMultipleRecords === 'function')
            conn.web = props.webApi;
        else if (props && props.context && props.context.webAPI && typeof props.context.webAPI.retrieveMultipleRecords === 'function')
            conn.web = props.context.webAPI;
    }
    catch (e) { }
    var xrm = dvFindXrm();
    conn.xrm = xrm;
    try {
        if (!conn.web && xrm && xrm.WebApi && typeof xrm.WebApi.retrieveMultipleRecords === 'function')
            conn.web = xrm.WebApi;
    }
    catch (e) { }
    try {
        if (props && props.dataApi && typeof props.dataApi.queryTable === 'function')
            conn.dataApi = props.dataApi;
    }
    catch (e) { }
    try {
        if (xrm && xrm.Utility && typeof xrm.Utility.getGlobalContext === 'function') {
            var ctx = xrm.Utility.getGlobalContext();
            if (ctx && typeof ctx.getClientUrl === 'function')
                conn.clientUrl = String(ctx.getClientUrl() || '').replace(/\/+$/, '');
        }
    }
    catch (e) { }
    try {
        if (!conn.clientUrl && typeof window !== 'undefined' && window.location && /\.crm[0-9]*\.dynamics\.com$/i.test(window.location.hostname)) {
            conn.clientUrl = window.location.origin.replace(/\/+$/, '');
        }
    }
    catch (e) { }
    if (conn.web)
        conn.routes.push('Xrm.WebApi');
    if (conn.clientUrl)
        conn.routes.push('Web API');
    if (conn.dataApi)
        conn.routes.push('dataApi');
    return conn;
}
// Who is signed in. Never invents an ID: unknown stays unknown.
function dvReadUser(conn, props) {
    try {
        var xrm = conn && conn.xrm;
        if (xrm && xrm.Utility && typeof xrm.Utility.getGlobalContext === 'function') {
            var us = xrm.Utility.getGlobalContext().userSettings;
            if (us && (us.userName || us.userId)) {
                return { userName: String(us.userName || '').trim(), userId: String(us.userId || '').replace(/[{}]/g, ''), source: 'Dataverse' };
            }
        }
    }
    catch (e) { }
    try {
        var us = props && props.context && props.context.userSettings;
        if (us && (us.userName || us.userId)) {
            return { userName: String(us.userName || '').trim(), userId: String(us.userId || '').replace(/[{}]/g, ''), source: 'Dataverse' };
        }
    }
    catch (e) { }
    return { userName: '', userId: '', source: 'unknown' };
}
function dvFetchJson(conn, path) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, json, txt, e_1, msg, j, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn || !conn.clientUrl || typeof fetch !== 'function')
                        return [2 /*return*/, { ok: false, status: 0, json: null, err: 'No Web API address on this page.' }];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, dvTimeout(function () { return fetch(conn.clientUrl + '/api/data/v9.2/' + path, {
                            headers: { 'Accept': 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Prefer': 'odata.include-annotations="*"' },
                            credentials: 'same-origin'
                        }); }, 'Web API')];
                case 2:
                    resp = _a.sent();
                    if (!resp.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, resp.json()];
                case 3:
                    json = _a.sent();
                    return [2 /*return*/, { ok: true, status: resp.status, json: json, err: '' }];
                case 4:
                    txt = '';
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, resp.text()];
                case 6:
                    txt = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    return [3 /*break*/, 8];
                case 8:
                    msg = txt;
                    try {
                        j = JSON.parse(txt);
                        if (j && j.error && j.error.message)
                            msg = j.error.message;
                    }
                    catch (e) { }
                    return [2 /*return*/, { ok: false, status: resp.status, json: null, err: 'HTTP ' + resp.status + ': ' + dvErrText(msg) }];
                case 9:
                    e_2 = _a.sent();
                    return [2 /*return*/, { ok: false, status: 0, json: null, err: dvErrText(e_2) }];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// The table's definition. state: 'found' | 'missing' | 'unknown'. cols: Set of column logical names, or null when columns could not be read.
function dvReadMeta(conn, logical, wantCols) {
    return __awaiter(this, void 0, void 0, function () {
        var out, r, xrm, asked_1, md, names, e_3, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    out = { state: 'unknown', meta: null, cols: null, colSource: '', err: '' };
                    if (!conn.clientUrl) return [3 /*break*/, 2];
                    return [4 /*yield*/, dvFetchJson(conn, "EntityDefinitions(LogicalName='" + logical + "')?$select=LogicalName,EntitySetName,PrimaryIdAttribute,PrimaryNameAttribute,OwnershipType,ObjectTypeCode&$expand=Attributes($select=LogicalName,AttributeType)")];
                case 1:
                    r = _a.sent();
                    if (r.ok && r.json) {
                        out.state = 'found';
                        out.meta = {
                            EntitySetName: r.json.EntitySetName || '',
                            PrimaryIdAttribute: r.json.PrimaryIdAttribute || '',
                            PrimaryNameAttribute: r.json.PrimaryNameAttribute || '',
                            OwnershipType: r.json.OwnershipType || '',
                            ObjectTypeCode: r.json.ObjectTypeCode || null
                        };
                        if (Array.isArray(r.json.Attributes) && r.json.Attributes.length > 0) {
                            out.cols = new Set(r.json.Attributes.map(function (a) { return String(a && a.LogicalName || '').toLowerCase(); }).filter(Boolean));
                            out.colSource = 'metadata';
                            out.types = dvAttrTypes(r.json.Attributes);
                        }
                        return [2 /*return*/, out];
                    }
                    out.err = r.err;
                    if (r.status === 404 || dvClassify(r.err) === 'table') {
                        out.state = 'missing';
                        return [2 /*return*/, out];
                    }
                    _a.label = 2;
                case 2:
                    xrm = conn.xrm;
                    if (!(xrm && xrm.Utility && typeof xrm.Utility.getEntityMetadata === 'function')) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    asked_1 = (wantCols || []).map(dvColKey);
                    return [4 /*yield*/, dvTimeout(function () { return xrm.Utility.getEntityMetadata(logical, asked_1); }, 'Xrm metadata')];
                case 4:
                    md = _a.sent();
                    if (md) {
                        out.state = 'found';
                        out.meta = {
                            EntitySetName: md.EntitySetName || '',
                            PrimaryIdAttribute: md.PrimaryIdAttribute || '',
                            PrimaryNameAttribute: md.PrimaryNameAttribute || '',
                            OwnershipType: md.OwnershipType || '',
                            ObjectTypeCode: md.ObjectTypeCode || null
                        };
                        names = dvAttrNames(md.Attributes);
                        out.types = dvAttrTypes(md.Attributes);
                        // An empty answer to a non-empty ask is more likely a client quirk than a table with none of its columns: leave columns unchecked.
                        if (names && !(names.length === 0 && asked_1.length > 0)) {
                            out.cols = new Set(names);
                            out.colSource = 'metadata';
                            out.colsAskedOnly = true;
                        }
                        out.err = '';
                        return [2 /*return*/, out];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _a.sent();
                    m = dvErrText(e_3);
                    if (!out.err)
                        out.err = m;
                    if (dvClassify(m) === 'table') {
                        out.state = 'missing';
                        out.err = m;
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, out];
            }
        });
    });
}
// Xrm metadata hands back its Attributes in different shapes depending on the client.
function dvAttrNames(attrs) {
    try {
        if (!attrs)
            return null;
        var list = null;
        if (typeof attrs.getAll === 'function')
            list = attrs.getAll();
        else if (Array.isArray(attrs))
            list = attrs;
        else if (attrs._collection && typeof attrs._collection === 'object')
            list = Object.keys(attrs._collection).map(function (k) { return attrs._collection[k]; });
        if (!Array.isArray(list))
            return null;
        return list.map(function (a) { return String((a && (a.LogicalName || a.logicalName)) || '').toLowerCase(); }).filter(Boolean);
    }
    catch (e) {
        return null;
    }
}
// Column types by name ('Boolean', 'Integer', 'Decimal', 'String', ...). Xrm gives a number, the Web API a word.
var ATTR_TYPE_CODES = { 0: 'Boolean', 1: 'Customer', 2: 'DateTime', 3: 'Decimal', 4: 'Double', 5: 'Integer', 6: 'Lookup', 7: 'Memo', 8: 'Money', 9: 'Owner', 10: 'PartyList', 11: 'Picklist', 12: 'State', 13: 'Status', 14: 'String', 15: 'Uniqueidentifier', 18: 'BigInt' };
function dvAttrTypes(attrs) {
    var out = {};
    try {
        var list = null;
        if (!attrs)
            return out;
        if (typeof attrs.getAll === 'function')
            list = attrs.getAll();
        else if (Array.isArray(attrs))
            list = attrs;
        else if (attrs._collection && typeof attrs._collection === 'object')
            list = Object.keys(attrs._collection).map(function (k) { return attrs._collection[k]; });
        (list || []).forEach(function (a) {
            var n = String((a && (a.LogicalName || a.logicalName)) || '').toLowerCase();
            var t = a && (a.AttributeType != null ? a.AttributeType : a.attributeType);
            if (n && t != null)
                out[n] = typeof t === 'number' ? (ATTR_TYPE_CODES[t] || String(t)) : String(t);
        });
    }
    catch (e) { }
    return out;
}
// How many rows the table holds (active and inactive). Tries each route; the most useful refusal wins.
function dvCountRows(conn, logical, idCol, entitySet) {
    return __awaiter(this, void 0, void 0, function () {
        var tries, best, rank, i, r;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tries = [];
                    if (conn.web) {
                        tries.push(function () { return __awaiter(_this, void 0, void 0, function () {
                            var xml, res, row, n, e_4, m;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        xml = "<fetch aggregate='true'><entity name='" + logical + "'><attribute name='" + idCol + "' aggregate='count' alias='n'/></entity></fetch>";
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, dvTimeout(function () { return conn.web.retrieveMultipleRecords(logical, '?fetchXml=' + encodeURIComponent(xml)); }, 'Xrm.WebApi ' + logical)];
                                    case 2:
                                        res = _a.sent();
                                        row = res && Array.isArray(res.entities) ? res.entities[0] : null;
                                        n = row ? Number(row.n) : NaN;
                                        if (!isFinite(n))
                                            return [2 /*return*/, { ok: false, err: 'Count answer held no number.' }];
                                        return [2 /*return*/, { ok: true, count: n, capped: false, via: 'Xrm.WebApi' }];
                                    case 3:
                                        e_4 = _a.sent();
                                        m = dvErrText(e_4);
                                        if (/aggregatequeryrecordlimit|maximum record limit|exceeded/i.test(m))
                                            return [2 /*return*/, { ok: true, count: DV_COUNT_CAP_AGG, capped: true, via: 'Xrm.WebApi' }];
                                        return [2 /*return*/, { ok: false, err: m }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    if (conn.clientUrl && entitySet) {
                        tries.push(function () { return __awaiter(_this, void 0, void 0, function () {
                            var r, n;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dvFetchJson(conn, entitySet + '?$select=' + idCol + '&$count=true&$top=1')];
                                    case 1:
                                        r = _a.sent();
                                        if (!r.ok)
                                            return [2 /*return*/, { ok: false, err: r.err }];
                                        n = Number(r.json && r.json['@odata.count']);
                                        if (!isFinite(n))
                                            return [2 /*return*/, { ok: false, err: 'Count answer held no number.' }];
                                        return [2 /*return*/, { ok: true, count: n, capped: n >= DV_COUNT_CAP_FETCH, via: 'Web API' }];
                                }
                            });
                        }); });
                    }
                    if (conn.dataApi) {
                        tries.push(function () { return __awaiter(_this, void 0, void 0, function () {
                            var page, n, more, e_5;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, dvTimeout(function () { return conn.window.__pgQ(dataApi, logical, { select: [idCol], pageSize: DV_COUNT_CAP_FETCH }); }, 'dataApi ' + logical)];
                                    case 1:
                                        page = _a.sent();
                                        if (!page || !Array.isArray(page.rows))
                                            return [2 /*return*/, { ok: false, err: 'The answer for ' + logical + ' held no list of rows.' }];
                                        n = page.rows.length;
                                        more = !!(page.hasMoreRows || page.hasMore || page.nextLink || page['@odata.nextLink']);
                                        return [2 /*return*/, { ok: true, count: n, capped: more || n >= DV_COUNT_CAP_FETCH, via: 'dataApi' }];
                                    case 2:
                                        e_5 = _a.sent();
                                        return [2 /*return*/, { ok: false, err: dvErrText(e_5) }];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    if (tries.length === 0)
                        return [2 /*return*/, { ok: false, err: 'No way to reach Dataverse on this page.', kind: 'none' }];
                    best = null;
                    rank = function (k) { return ({ denied: 4, network: 3, other: 3, column: 2, table: 1 }[k] || 0); };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < tries.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, tries[i]()];
                case 2:
                    r = _a.sent();
                    if (r.ok)
                        return [2 /*return*/, r];
                    r.kind = dvClassify(r.err);
                    if (!best || rank(r.kind) > rank(best.kind))
                        best = r;
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, best];
            }
        });
    });
}
// One row, all columns, only used to see which columns exist when metadata could not be read. The row's values are dropped at once.
function dvSampleKeys(conn, logical) {
    return __awaiter(this, void 0, void 0, function () {
        var res, row, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn.web)
                        return [2 /*return*/, null];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dvTimeout(function () { return conn.web.retrieveMultipleRecords(logical, '?$top=1'); }, 'Xrm.WebApi ' + logical)];
                case 2:
                    res = _a.sent();
                    row = res && Array.isArray(res.entities) ? res.entities[0] : null;
                    if (!row)
                        return [2 /*return*/, null];
                    return [2 /*return*/, new Set(Object.keys(row).filter(function (k) { return k.indexOf('@') === -1; }).map(dvColKey))];
                case 3:
                    e_6 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// The whole check for one table. Returns plain data only (no rows).
function dvAuditTable(conn, spec) {
    return __awaiter(this, void 0, void 0, function () {
        var want, meta, idCol, entitySet, cnt, _a, r, k, m, colSet, fromRow, realPrimary;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    want = (spec.requiredCols || []).concat(spec.optionalCols || []);
                    return [4 /*yield*/, dvReadMeta(conn, spec.logicalName, want)];
                case 1:
                    meta = _b.sent();
                    idCol = (meta.meta && meta.meta.PrimaryIdAttribute) || spec.primaryId || (spec.logicalName + 'id');
                    entitySet = (meta.meta && meta.meta.EntitySetName) || spec.entitySetName || '';
                    if (!(meta.state === 'missing')) return [3 /*break*/, 2];
                    _a = null;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, dvCountRows(conn, spec.logicalName, idCol, entitySet)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    cnt = _a;
                    r = {
                        logicalName: spec.logicalName,
                        entitySetName: entitySet,
                        primaryId: idCol,
                        primaryName: (meta.meta && meta.meta.PrimaryNameAttribute) || spec.primaryName || '',
                        ownership: (meta.meta && meta.meta.OwnershipType) || '',
                        state: 'unknown',
                        count: null,
                        countCapped: false,
                        via: '',
                        colSource: '',
                        cols: {},
                        missingRequired: [],
                        uncheckedRequired: [],
                        missingOptional: [],
                        error: ''
                    };
                    // Table state
                    if (meta.state === 'missing') {
                        r.state = 'missing';
                        r.error = meta.err;
                    }
                    else if (cnt && cnt.ok) {
                        r.state = 'found';
                        r.count = cnt.count;
                        r.countCapped = !!cnt.capped;
                        r.via = cnt.via;
                    }
                    else {
                        k = cnt ? cnt.kind : 'other';
                        m = cnt ? cnt.err : '';
                        r.error = m || meta.err;
                        if (k === 'denied' && (meta.state === 'found' || dvNamesPrivilege(m)))
                            r.state = 'denied';
                        else if (k === 'table' && meta.state !== 'found')
                            r.state = 'missing';
                        else if ((k === 'column' || k === 'table') && meta.state === 'found') {
                            r.state = 'found';
                            r.countUnknown = true;
                        }
                        else
                            r.state = 'unknown';
                    }
                    colSet = meta.cols;
                    fromRow = false;
                    if (!(!colSet && r.state === 'found' && r.count > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, dvSampleKeys(conn, spec.logicalName)];
                case 5:
                    colSet = _b.sent();
                    fromRow = !!colSet;
                    _b.label = 6;
                case 6:
                    realPrimary = meta.meta && meta.meta.PrimaryNameAttribute ? String(meta.meta.PrimaryNameAttribute).toLowerCase() : '';
                    if (colSet && realPrimary && spec.primaryName && dvColKey(spec.primaryName) !== realPrimary && colSet.has(realPrimary)) {
                        colSet = new Set(colSet);
                        colSet.add(dvColKey(spec.primaryName));
                        r.primaryNameAlias = realPrimary;
                    }
                    r.colSource = colSet ? (fromRow ? 'row' : 'metadata') : '';
                    // Names only (no values): the table's own columns, for the filled-value count.
                    r.allCols = meta.cols && !meta.colsAskedOnly ? Array.from(meta.cols).filter(function (c) { return c.indexOf('craa5_') === 0; }).sort() : [];
                    want.forEach(function (c) {
                        var key = dvColKey(c);
                        var st = 'unchecked';
                        if (colSet && r.state !== 'missing') {
                            if (colSet.has(key))
                                st = 'present';
                            else if (!fromRow)
                                st = 'missing'; // one row can leave a column out, so only metadata says missing
                        }
                        r.cols[c] = st;
                    });
                    // For a missing column, name the table's columns that end the same way (craa5__c_chemicalname missing, craa5_chemicalname there).
                    r.similar = {};
                    (spec.requiredCols || []).forEach(function (c) {
                        if (r.cols[c] !== 'missing' || !colSet)
                            return;
                        var stem = dvColKey(c).split('_').filter(Boolean).pop() || '';
                        if (stem.length < 4)
                            return;
                        var near = Array.from(colSet).filter(function (x) { return x !== dvColKey(c) && x.indexOf(stem) !== -1 && x.indexOf('@') === -1; }).slice(0, 5);
                        if (near.length)
                            r.similar[c] = near;
                    });
                    (spec.requiredCols || []).forEach(function (c) {
                        if (r.cols[c] === 'missing')
                            r.missingRequired.push(c);
                        else if (r.cols[c] === 'unchecked')
                            r.uncheckedRequired.push(c);
                    });
                    (spec.optionalCols || []).forEach(function (c) { if (r.cols[c] === 'missing')
                        r.missingOptional.push(c); });
                    return [2 /*return*/, r];
            }
        });
    });
}
// Tries each name the contract lists for a table, in order (Alex's prefixed name first, plain name after).
// A name that is there wins; a name that could not be told does not stop the later ones.
function dvAuditCandidates(conn, spec) {
    return __awaiter(this, void 0, void 0, function () {
        var names, tried, firstUnsure, last, i, name, same, r, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    names = (spec.candidates && spec.candidates.length) ? spec.candidates : [spec.logicalName];
                    tried = [];
                    firstUnsure = null;
                    last = null;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < names.length)) return [3 /*break*/, 4];
                    name = names[i];
                    same = name === spec.logicalName;
                    return [4 /*yield*/, dvAuditTable(conn, __assign(__assign({}, spec), { logicalName: name, primaryId: same ? spec.primaryId : name + 'id', entitySetName: same ? spec.entitySetName : '' }))];
                case 2:
                    r = _a.sent();
                    r.resolvedName = name;
                    r.triedNames = tried.slice();
                    if (r.state === 'found' || r.state === 'denied')
                        return [2 /*return*/, r];
                    if (r.state === 'unknown' && !firstUnsure)
                        firstUnsure = r;
                    tried.push(name + ': ' + r.state);
                    last = r;
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    out = firstUnsure || last;
                    out.triedNames = tried;
                    if (!firstUnsure)
                        out.resolvedName = '';
                    return [2 /*return*/, out];
            }
        });
    });
}
// The one word each table gets. Green only for a table that was read AND whose required columns were all seen.
// spec.status from the contract: a missing 'abandoned' or 'proposed' table is expected, not a problem.
function dvVerdict(r, spec) {
    if (!r)
        return { code: 'notscanned', tone: 'gray' };
    var status = spec && spec.status;
    if (status === 'abandoned') {
        if (r.state === 'missing')
            return { code: 'gone', tone: 'gray' };
        if (r.state === 'found')
            return { code: 'abandonedthere', tone: 'gray', n: r.count, capped: r.countCapped };
    }
    if (status === 'proposed' && r.state === 'missing')
        return { code: 'notmade', tone: 'gray' };
    if (status === 'absent' && r.state === 'missing')
        return { code: 'absent', tone: 'gray' };
    if (r.state === 'missing')
        return { code: 'missing', tone: 'red' };
    if (r.state === 'denied')
        return { code: 'denied', tone: 'purple' };
    if (r.state !== 'found')
        return { code: 'unknown', tone: 'gray' };
    if (r.missingRequired.length > 0)
        return { code: 'missingcols', tone: 'amber', n: r.missingRequired.length };
    if (r.uncheckedRequired.length > 0)
        return { code: 'colsunchecked', tone: 'amber' };
    if (r.countUnknown)
        return { code: 'foundnocount', tone: 'amber' };
    if (r.count === 0)
        return { code: 'empty', tone: 'teal' };
    return { code: 'ok', tone: 'green', n: r.count, capped: r.countCapped };
}
// Every craa5 table in the environment (needs the Web API address). null = could not list.
function dvListCustomTables(conn) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn.clientUrl)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, dvFetchJson(conn, 'EntityDefinitions?$select=LogicalName,EntitySetName,PrimaryIdAttribute,PrimaryNameAttribute,OwnershipType')];
                case 1:
                    r = _a.sent();
                    if (!r.ok || !r.json || !Array.isArray(r.json.value))
                        return [2 /*return*/, null];
                    return [2 /*return*/, r.json.value
                            .filter(function (d) { return d && d.LogicalName && d.LogicalName.indexOf('craa5_') === 0; })
                            .map(function (d) { return ({ logicalName: d.LogicalName, entitySetName: d.EntitySetName || '', primaryId: d.PrimaryIdAttribute || '', primaryName: d.PrimaryNameAttribute || '', ownership: d.OwnershipType || '' }); })
                            .sort(function (a, b) { return a.logicalName.localeCompare(b.logicalName); })];
            }
        });
    });
}
// Runs the checks a few at a time so a big list does not flood the server.
function dvRunPool(items, worker, size, onEach) {
    return __awaiter(this, void 0, void 0, function () {
        var out, next, lanes, l;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    out = new Array(items.length);
                    next = 0;
                    lanes = [];
                    for (l = 0; l < Math.min(size, items.length); l++) {
                        lanes.push((function () { return __awaiter(_this, void 0, void 0, function () {
                            var i, _a, _b, e_7;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!(next < items.length)) return [3 /*break*/, 5];
                                        i = next++;
                                        _c.label = 1;
                                    case 1:
                                        _c.trys.push([1, 3, , 4]);
                                        _a = out;
                                        _b = i;
                                        return [4 /*yield*/, worker(items[i], i)];
                                    case 2:
                                        _a[_b] = _c.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_7 = _c.sent();
                                        out[i] = null;
                                        return [3 /*break*/, 4];
                                    case 4:
                                        if (onEach)
                                            onEach(i, out[i]);
                                        return [3 /*break*/, 0];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })());
                    }
                    return [4 /*yield*/, Promise.all(lanes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, out];
            }
        });
    });
}
// The display name to type so Dataverse makes exactly this logical name (craa5_ + display name in lower case, no spaces).
function colDisplay(logical) { return String(logical || '').replace(/^craa5_/, ''); }
// A first guess at a column's type from its name. The maker can change it; text is the safe default.
function colTypeGuess(logical) {
    var n = String(logical || '').toLowerCase();
    if (/(date|on|at|start|end|time)$/.test(n) && !/(location|reason|section|option|button|downtime|runtime|overtime)$/.test(n))
        return 'date and time';
    if (/(minutes|minuteslost|count|qty|quantity|number|total|heads|hour|hours)$/.test(n) && !/(itemnumber|vendornumber|badgenumber|ordernumber)$/.test(n))
        return 'whole number';
    if (/(price|cost|amount|rate)$/.test(n))
        return 'currency';
    if (/^(craa5_)?(is|has)|active|complete|done$/.test(n))
        return 'yes/no';
    return 'text';
}
// How many rows have a value in one column (a count only; no values are read).
function dvCountFilled(conn, logical, idCol, entitySet, col) {
    return __awaiter(this, void 0, void 0, function () {
        var xml_1, res, n, e_8, m, r, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn.web) return [3 /*break*/, 4];
                    xml_1 = "<fetch aggregate='true'><entity name='" + logical + "'><attribute name='" + idCol + "' aggregate='count' alias='n'/><filter><condition attribute='" + col + "' operator='not-null'/></filter></entity></fetch>";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dvTimeout(function () { return conn.web.retrieveMultipleRecords(logical, '?fetchXml=' + encodeURIComponent(xml_1)); }, 'Xrm.WebApi ' + logical)];
                case 2:
                    res = _a.sent();
                    n = res && res.entities && res.entities[0] ? Number(res.entities[0].n) : NaN;
                    if (isFinite(n))
                        return [2 /*return*/, { ok: true, count: n }];
                    return [3 /*break*/, 4];
                case 3:
                    e_8 = _a.sent();
                    m = dvErrText(e_8);
                    if (/aggregatequeryrecordlimit/i.test(m))
                        return [2 /*return*/, { ok: true, count: DV_COUNT_CAP_AGG, capped: true }];
                    if (!conn.clientUrl || !entitySet)
                        return [2 /*return*/, { ok: false, err: m }];
                    return [3 /*break*/, 4];
                case 4:
                    if (!(conn.clientUrl && entitySet)) return [3 /*break*/, 6];
                    return [4 /*yield*/, dvFetchJson(conn, entitySet + '?$select=' + idCol + '&$filter=' + col + ' ne null&$count=true&$top=1')];
                case 5:
                    r = _a.sent();
                    if (r.ok) {
                        n = Number(r.json && r.json['@odata.count']);
                        if (isFinite(n))
                            return [2 /*return*/, { ok: true, count: n, capped: n >= DV_COUNT_CAP_FETCH }];
                    }
                    return [2 /*return*/, { ok: false, err: r.err }];
                case 6: return [2 /*return*/, { ok: false, err: 'No way to count on this page.' }];
            }
        });
    });
}
// ============================================================================
// APP MANIFESTS (v2.2). Each app saves one row in Hub config:
//   craa5_configkey = 'manifest|<appId>', craa5_configjson = {"m":1,"app","appId","version","savedAt",
//   "tables":[{"t":logical,"names":[candidates],"read":[cols],"write":[cols]}]}
// The monitor only reads these rows. Logical names only; no data.
// ============================================================================
var HUBCONFIG_NAMES = ['craa5___1_e_hubconfig', 'craa5___1_e_hubconfig']; // the new shared table first, the old one second
var MANIFEST_PREFIX = 'manifest|';
// The contract's fixed app ids and the writer names the contract uses for them.
var APP_WRITER_NAMES = {
    ganttly: 'Ganttly', shiftstart: 'Shift Start', prodsched: 'Production Scheduler', msscalendar: 'MSS Calendar', msslog: 'MSS Log Input',
    pbed: 'PBED', bolo: 'Pathogen BOLO', managerhub: 'Manager hub', chemicals: 'Chemical hub', mapsubmit: 'Map submission tool',
    monitor: 'Dataverse monitor', training: 'Training matrix', director: 'Sanitation director'
};
function appIdOf(name) { return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''); }
// Turns one saved row into a checked-shape manifest, or an error saying what is wrong with it.
function dvParseManifest(row) {
    var key = String(row && row.craa5_configkey || '');
    var out = { key: key, source: '', fromScan: key.indexOf('scan|') === 0, appId: key.slice(key.indexOf('|') + 1), app: String(row && row.craa5_configname || '').replace(/ manifest$/i, ''), version: '', savedAt: '', contract: '', hash: '', config: [], tables: [], error: '', modifiedOn: row && row.modifiedon ? String(row.modifiedon) : '' };
    // The full list lives in Manifest json when the table has that column; Config json then holds only a pointer.
    var mText = row && row.craa5_manifestjson != null ? String(row.craa5_manifestjson) : '';
    out.source = mText.trim() ? 'craa5_manifestjson' : 'craa5_configjson';
    var j = null;
    try {
        j = JSON.parse(mText.trim() ? mText : String(row && row.craa5_configjson || ''));
    }
    catch (e) {
        out.error = 'not valid JSON in ' + out.source + ' (' + dvErrText(e).slice(0, 80) + ')';
        return out;
    }
    if (j && typeof j === 'object' && !Array.isArray(j.tables) && j.in && out.source === 'craa5_configjson') {
        // A pointer alone: the app saved its list to a column that is empty or not readable here. Not a broken manifest.
        out.stub = true;
        out.pointer = String(j.in);
        out.version = String(j.version || '');
        out.savedAt = String(j.savedAt || '');
        out.hash = String(j.hash || '');
        if (j.appId)
            out.appId = String(j.appId);
        out.app = String(j.app || out.app || out.appId);
        return out;
    }
    if (!j || typeof j !== 'object' || !Array.isArray(j.tables)) {
        out.error = 'no "tables" list';
        return out;
    }
    out.app = String(j.app || out.app || out.appId);
    out.version = String(j.version || '');
    out.savedAt = String(j.savedAt || '');
    out.contract = String(j.contract || '');
    out.hash = String(j.hash || '');
    if (j.appId)
        out.appId = String(j.appId);
    var clean = function (list) { return (Array.isArray(list) ? list : []).map(function (x) { return String(x || '').trim().toLowerCase(); }).filter(function (x) { return /^[a-z0-9_]+$/.test(x); }); };
    j.tables.forEach(function (t) {
        if (!t || typeof t !== 'object')
            return;
        var logical = String(t.t || '').trim().toLowerCase();
        if (!/^[a-z0-9_]+$/.test(logical))
            return;
        var names = clean(t.names);
        var row = { t: logical, names: names.length ? names : [logical], read: clean(t.read), write: clean(t.write), opt: clean(t.opt) };
        // Manifest v2 (HUB SHARED v1.2): column types and what a new table should look like. The builder reads these.
        if (t.cols && typeof t.cols === 'object') {
            row.cols = {};
            Object.keys(t.cols).forEach(function (c) { var k = String(c).trim().toLowerCase(); var v = t.cols[c]; if (/^[a-z0-9_]+$/.test(k) && v && typeof v === 'object' && typeof v.type === 'string')
                row.cols[k] = v; });
        }
        if (t.label)
            row.label = String(t.label);
        if (typeof t.prompt === 'string' && t.prompt.trim())
            row.prompt = t.prompt.trim().slice(0, 4000);
        if (t['new'] === true)
            row['new'] = true;
        if (t.owner === 'org' || t.owner === 'user')
            row.owner = t.owner;
        if (t.primary && t.primary.n)
            row.primary = { n: String(t.primary.n).toLowerCase(), len: t.primary.len, label: t.primary.label };
        out.tables.push(row);
    });
    out.config = (Array.isArray(j.config) ? j.config : []).map(function (x) { return String(x || ''); }).filter(Boolean);
    return out;
}
// Reads Hub config rows (only the manifest rows when prefix is given). Resolves { state: 'ok'|'missing'|'denied'|'unknown', table, rows, err }.
function dvReadManifestRows(conn) { return dvReadHubConfigRows(conn, MANIFEST_PREFIX); }
// Tries each Hub config table in order (new first). On each, asks for Manifest json too and drops it if that table has no such column.
function dvReadHubConfigRows(conn, prefix, tables) {
    return __awaiter(this, void 0, void 0, function () {
        var names, base, last, notes, i, first, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    names = tables || HUBCONFIG_NAMES;
                    base = ['craa5_configkey', 'craa5_configname', 'craa5_configjson', 'modifiedon'];
                    last = null;
                    notes = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < names.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, dvReadHubConfigRowsWith(conn, prefix, base.concat(['craa5_manifestjson']), [names[i]])];
                case 2:
                    first = _a.sent();
                    if (first.state === 'ok')
                        return [2 /*return*/, Object.assign(first, { manifestCol: true, notes: notes })];
                    res = first;
                    if (!(first.kind === 'column')) return [3 /*break*/, 4];
                    return [4 /*yield*/, dvReadHubConfigRowsWith(conn, prefix, base, [names[i]])];
                case 3:
                    res = _a.sent();
                    if (res.state === 'ok')
                        return [2 /*return*/, Object.assign(res, { manifestCol: false, notes: notes })];
                    _a.label = 4;
                case 4:
                    if (res.state !== 'missing')
                        notes.push(names[i] + ': ' + res.state + (res.err ? ' (' + res.err + ')' : ''));
                    last = res;
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, Object.assign(last || { state: 'unknown', rows: [], err: '' }, { manifestCol: null, notes: notes })];
            }
        });
    });
}
function dvReadHubConfigRowsWith(conn, prefix, select, tables) {
    return __awaiter(this, void 0, void 0, function () {
        var lastErr, lastKind, _loop_1, i, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastErr = '';
                    lastKind = '';
                    _loop_1 = function (i) {
                        var t, q_1, res, e_9, page, e_10, m;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    t = tables[i];
                                    if (!conn.web) return [3 /*break*/, 4];
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    q_1 = '?$select=' + select.join(',') + (prefix ? "&$filter=startswith(craa5_configkey,'" + prefix + "')" : '') + '&$top=500';
                                    return [4 /*yield*/, dvTimeout(function () { return conn.web.retrieveMultipleRecords(t, q_1); }, 'Xrm.WebApi ' + t)];
                                case 2:
                                    res = _b.sent();
                                    return [2 /*return*/, { value: { state: 'ok', table: t, rows: (res && res.entities) || [] } }];
                                case 3:
                                    e_9 = _b.sent();
                                    lastErr = dvErrText(e_9);
                                    lastKind = dvClassify(lastErr);
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (!conn.dataApi) return [3 /*break*/, 8];
                                    _b.label = 5;
                                case 5:
                                    _b.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, dvTimeout(function () { return conn.window.__pgQ(dataApi, t, prefix ? { select: select, filter: "startswith(craa5_configkey,'" + prefix + "')", pageSize: 500 } : { select: select, pageSize: 500 }); }, 'dataApi ' + t)];
                                case 6:
                                    page = _b.sent();
                                    if (page && Array.isArray(page.rows))
                                        return [2 /*return*/, { value: { state: 'ok', table: t, rows: page.rows } }];
                                    return [3 /*break*/, 8];
                                case 7:
                                    e_10 = _b.sent();
                                    m = dvErrText(e_10);
                                    if (!lastErr || dvClassify(m) === 'denied') {
                                        lastErr = m;
                                        lastKind = dvClassify(m);
                                    }
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < tables.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!conn.web && !conn.dataApi)
                        return [2 /*return*/, { state: 'unknown', rows: [], err: 'No way to read Hub config on this page.' }];
                    return [2 /*return*/, { state: lastKind === 'table' ? 'missing' : (lastKind === 'denied' ? 'denied' : 'unknown'), kind: lastKind, rows: [], err: lastErr }];
            }
        });
    });
}
// Checks one manifest against Dataverse metadata. metaCache is shared across manifests so a table is asked about once.
function dvCheckManifest(conn, man, metaCache, contractTables) {
    return __awaiter(this, void 0, void 0, function () {
        var tables, _loop_2, i, problems, unsure;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tables = [];
                    _loop_2 = function (i) {
                        var mt, cols, found, lastState, k, name, ck, meta, row, set_1, realPrimary_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    mt = man.tables[i];
                                    cols = Array.from(new Set(mt.read.concat(mt.write, mt.opt || [])));
                                    found = null;
                                    lastState = 'unknown';
                                    k = 0;
                                    _b.label = 1;
                                case 1:
                                    if (!(k < mt.names.length && !found)) return [3 /*break*/, 4];
                                    name = mt.names[k];
                                    ck = name + '|' + cols.join(',');
                                    if (!metaCache[ck])
                                        metaCache[ck] = dvReadMeta(conn, name, cols);
                                    return [4 /*yield*/, metaCache[ck]];
                                case 2:
                                    meta = _b.sent();
                                    lastState = meta.state;
                                    if (meta.state === 'found')
                                        found = { name: name, meta: meta };
                                    else if (meta.state === 'unknown')
                                        return [3 /*break*/, 4]; // no clear answer: do not guess the next name
                                    _b.label = 3;
                                case 3:
                                    k++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    row = { t: mt.t, foundAs: found ? found.name : '', state: found ? 'found' : lastState, missingRead: [], missingWrite: [], notYet: [], unchecked: [], contractNotes: [] };
                                    if (found) {
                                        set_1 = found.meta.cols;
                                        realPrimary_1 = found.meta.meta && found.meta.meta.PrimaryNameAttribute ? String(found.meta.meta.PrimaryNameAttribute).toLowerCase() : '';
                                        cols.forEach(function (c) {
                                            var key = dvColKey(c);
                                            if (!set_1) {
                                                row.unchecked.push(c);
                                                return;
                                            }
                                            if (set_1.has(key) || key === realPrimary_1)
                                                return;
                                            // "opt" wins when a column is listed in read or write too: the app drops it from its saves when it is not there.
                                            if ((mt.opt || []).indexOf(c) !== -1)
                                                row.notYet.push(c);
                                            else if (mt.write.indexOf(c) !== -1)
                                                row.missingWrite.push(c);
                                            else if (mt.read.indexOf(c) !== -1)
                                                row.missingRead.push(c);
                                            else
                                                row.notYet.push(c); // an "opt" column: the app works without it
                                        });
                                    }
                                    tables.push(row);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < man.tables.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    // Against the contract: tables it does not know, abandoned or absent tables, and writes by an app the contract does not list as a writer.
                    if (contractTables) {
                        tables.forEach(function (row, i) {
                            var mt = man.tables[i];
                            var spec = contractTables.find(function (s) { return s.logicalName === mt.t || (s.candidates || []).indexOf(mt.t) !== -1 || mt.names.indexOf(s.logicalName) !== -1; });
                            if (!spec) {
                                row.contractNotes.push('notincontract');
                                return;
                            }
                            if (spec.status === 'abandoned' || spec.status === 'absent')
                                row.contractNotes.push('status:' + spec.status);
                            var me = APP_WRITER_NAMES[man.appId];
                            // A column listed under columnOwners for this app may be written by it even when it is not a table writer.
                            var ownCols = (spec.columnOwners || []).filter(function (o) { return appIdOf(o.writer) === appIdOf(me); }).reduce(function (a, o) { return a.concat(o.columns || []); }, []);
                            var notAllowed = mt.write.filter(function (c) { return ownCols.indexOf(c) === -1; });
                            if (notAllowed.length && me && (spec.writers || []).map(appIdOf).indexOf(appIdOf(me)) === -1) {
                                row.contractNotes.push('notwriter');
                                row.notAllowed = notAllowed;
                            }
                        });
                    }
                    problems = tables.filter(function (t) { return t.state !== 'found' || t.missingRead.length || t.missingWrite.length || t.contractNotes.length; }).length;
                    unsure = tables.filter(function (t) { return t.state === 'unknown' || t.unchecked.length; }).length;
                    return [2 /*return*/, { tables: tables, problems: problems, unsure: unsure }];
            }
        });
    });
}
// The Hub config keys the contract lists (contract.json configKeys), matched exactly, case included.
// status: planned (contract key, may not exist yet), inuse (an older key apps write today), legacy (unused).
var HUB_CONFIG_KEYS = CONTRACT_CONFIG_KEYS;
// Checks every Hub config row the way the tables are checked: is it what the contract expects, and is it healthy.
// Looks at keys, text length and whether the text is valid JSON. Never keeps or shows the values.
function dvCheckHubConfig(rows, maxLen, apps, mMaxLen) {
    var keyCount = {};
    var list = (rows || []).map(function (r) {
        var rawKey = String(r && r.craa5_configkey || '').trim();
        var nameKey = String(r && r.craa5_configname || '').trim();
        // Readers match Config key first and Config name second (old rows with a blank key).
        var key = rawKey || (HUB_CONFIG_KEYS.some(function (k) { return k.key === nameKey; }) ? nameKey : '');
        var text = r && r.craa5_configjson != null ? String(r.craa5_configjson) : '';
        if (key)
            keyCount[key] = (keyCount[key] || 0) + 1;
        var json = 'empty';
        var jsonAppId = '';
        if (text.trim()) {
            try {
                var j = JSON.parse(text);
                json = 'ok';
                if (j && typeof j === 'object' && j.appId)
                    jsonAppId = String(j.appId);
            }
            catch (e) {
                json = 'bad';
            }
        }
        var mText = r && r.craa5_manifestjson != null ? String(r.craa5_manifestjson) : '';
        var mjson = 'empty';
        if (mText.trim()) {
            try {
                JSON.parse(mText);
                mjson = 'ok';
            }
            catch (e) {
                mjson = 'bad';
            }
        }
        var stub = false;
        if (json === 'ok') {
            try {
                var j = JSON.parse(text);
                stub = !!(j && typeof j === 'object' && j.in && !Array.isArray(j.tables));
            }
            catch (e) {
                stub = false;
            }
        }
        var isManifest = key.indexOf(MANIFEST_PREFIX) === 0;
        var isScan = key.indexOf('scan|') === 0;
        var setting = HUB_CONFIG_KEYS.find(function (k) { return k.key === key; });
        var appId = isManifest || isScan ? key.slice(key.indexOf('|') + 1) : (setting ? setting.app : '');
        return { key: key, keyInName: !rawKey && !!key, name: nameKey, len: text.length, json: json, jsonAppId: jsonAppId, kind: isManifest ? 'manifest' : isScan ? 'scan' : (setting ? (setting.status === 'legacy' ? 'legacy' : 'setting') : 'unlisted'), appId: appId, mLen: mText.length, mjson: mjson, stub: stub, modifiedOn: r && r.modifiedon ? String(r.modifiedon) : '', issues: [], warnings: setting && setting.otherWriters && setting.otherWriters.length ? ['twowriters'] : [] };
    });
    list.forEach(function (x) {
        if (!x.key)
            x.issues.push('blankkey');
        else if (keyCount[x.key] > 1)
            x.issues.push('dupkey');
        if (x.keyInName)
            x.warnings.push('keyinname');
        if (x.json === 'bad')
            x.issues.push(maxLen && x.len >= maxLen ? 'cutoff' : 'badjson');
        if (x.json === 'empty' && x.mjson === 'empty' && x.key)
            x.warnings.push('emptyjson'); // waiting for the app to save
        if (x.json === 'empty' && x.mjson === 'empty' && !x.key)
            x.issues.push('emptyjson');
        if (maxLen && x.json !== 'bad' && x.len >= maxLen * 0.9)
            x.issues.push('nearlimit');
        if (x.kind === 'manifest' && CONTRACT_APP_IDS.indexOf(x.appId) === -1)
            x.issues.push('unknownapp');
        if (x.mjson === 'bad')
            x.issues.push(mMaxLen && x.mLen >= mMaxLen ? 'mcutoff' : 'mbadjson');
        if (mMaxLen && x.mjson === 'ok' && x.mLen >= mMaxLen * 0.9)
            x.issues.push('mnearlimit');
        if (x.stub && x.mjson === 'empty')
            x.warnings.push('pointeronly');
        if (x.kind === 'manifest' && x.jsonAppId && x.jsonAppId !== x.appId)
            x.issues.push('appmismatch');
    });
    var have = new Set(list.map(function (x) { return x.key; }));
    // Legacy keys are not needed: listed only when the row is still there.
    var expected = HUB_CONFIG_KEYS.filter(function (k) { return k.status !== 'legacy' || have.has(k.key); }).map(function (k) { return ({ key: k.key, app: k.app, otherWriters: k.otherWriters || [], status: k.status || 'planned', note: k.note || '', kind: 'setting' }); })
        .concat(CONTRACT_APP_IDS.map(function (a) { return ({ key: MANIFEST_PREFIX + a, app: a, otherWriters: [], status: 'manifest', kind: 'manifest' }); }))
        .map(function (e) { var row = list.find(function (x) { return x.key === e.key; }); return Object.assign(e, { state: !have.has(e.key) ? 'notyet' : (row.issues.length ? 'problem' : (row.warnings.length ? 'warn' : 'saved')) }); });
    // Keys a manifest says the app writes: must be on the contract's list and belong to that app.
    var claims = [];
    (apps || []).forEach(function (a) { return (a.config || []).forEach(function (k) {
        // Case-insensitive: manifests saved before hubManifest kept case may hold lower-cased keys. Row keys stay exact.
        var owner = HUB_CONFIG_KEYS.find(function (x) { return x.key.toLowerCase() === String(k).toLowerCase(); });
        if (k.indexOf(MANIFEST_PREFIX) === 0)
            return;
        if (!owner)
            claims.push({ appId: a.appId, key: k, issue: 'notincontract' });
        else if (owner.app !== a.appId && (owner.otherWriters || []).indexOf(a.appId) === -1)
            claims.push({ appId: a.appId, key: k, issue: 'otherapp', owner: owner.app });
    }); });
    var problems = list.filter(function (x) { return x.issues.length; }).length + claims.length;
    var warnings = list.filter(function (x) { return x.warnings.length && !x.issues.length; }).length;
    return { rows: list, expected: expected, claims: claims, unlisted: list.filter(function (x) { return x.kind === 'unlisted' && x.key; }).map(function (x) { return x.key; }), problems: problems, warnings: warnings };
}
// How long the config text column may be (so a manifest is known to fit). null = could not tell.
function dvConfigJsonMaxLength(conn, hubTable, column) {
    return __awaiter(this, void 0, void 0, function () {
        var base, kinds, i, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn.clientUrl)
                        return [2 /*return*/, null];
                    base = "EntityDefinitions(LogicalName='" + hubTable + "')/Attributes(LogicalName='" + (column || 'craa5_configjson') + "')/";
                    kinds = ['Microsoft.Dynamics.CRM.MemoAttributeMetadata', 'Microsoft.Dynamics.CRM.StringAttributeMetadata'];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < kinds.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, dvFetchJson(conn, base + kinds[i] + '?$select=MaxLength')];
                case 2:
                    r = _a.sent();
                    if (r.ok && r.json && isFinite(Number(r.json.MaxLength)))
                        return [2 /*return*/, Number(r.json.MaxLength)];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// App code scanner: finds the craa5 tables and columns an app's code names,
// checks them against Dataverse, and can save the result in Hub config
// (key scan|<appId>) so every later check watches that app. Only names are
// kept, never the code itself.
// ---------------------------------------------------------------------------
var SCAN_PREFIX = 'scan|';
var SCAN_TABLE_CALL = /(retrieveMultipleRecords|retrieveRecord|createRecord|updateRecord|deleteRecord|queryTable|getEntityMetadata|LogicalName=)\W{0,6}$/;
// known: { tables: Set of logical names, sets: { entitySetName: logical } }
function dvScanCode(code, known) {
    var text = String(code || '');
    var tokens = [];
    var re = /(_?)(craa5_[a-z0-9_]*[a-z0-9])/gi;
    var m;
    while ((m = re.exec(text)) !== null) {
        var name = m[2].toLowerCase();
        var lookup = false;
        if (m[1] === '_' && /_value$/.test(name)) {
            name = name.replace(/_value$/, '');
            lookup = true;
        }
        if (name.replace(/^craa5_+/, '').replace(/_/g, '').length < 3)
            continue; // prefix pieces like craa5__c
        var before = text.slice(Math.max(0, m.index - 40), m.index);
        tokens.push({ name: name, pos: m.index, lookup: lookup, call: SCAN_TABLE_CALL.test(before) });
    }
    var isTable = function (tok) { return known.tables.has(tok.name) || !!known.sets[tok.name] || (tok.call && !tok.lookup); };
    var tablePos = [];
    var tableSet = {};
    tokens.forEach(function (tok) {
        if (!isTable(tok))
            return;
        var t = known.sets[tok.name] || tok.name;
        tableSet[t] = true;
        tablePos.push({ t: t, pos: tok.pos });
    });
    var colPos = {};
    tokens.forEach(function (tok) {
        if (isTable(tok) && !tok.lookup)
            return;
        if (tableSet[tok.name.replace(/id$/, '')] && /id$/.test(tok.name))
            return; // a table's own id column
        (colPos[tok.name] = colPos[tok.name] || []).push(tok.pos);
    });
    return { tables: Object.keys(tableSet).sort(), cols: Object.keys(colPos).sort(), tablePos: tablePos, colPos: colPos };
}
// The table written closest before a column (else closest after): the best guess when no table has the column.
function dvNearestTable(scan, col) {
    var best = null;
    (scan.colPos[col] || []).forEach(function (p) {
        scan.tablePos.forEach(function (tp) {
            var d = tp.pos <= p ? p - tp.pos : (tp.pos - p) * 4; // before counts more than after
            if (!best || d < best.d)
                best = { t: tp.t, d: d };
        });
    });
    return best ? best.t : '';
}
// Checks the scanned names in Dataverse. Columns go to the table that has them; the rest to the nearest table (a guess).
function dvScanCheck(conn, scan) {
    return __awaiter(this, void 0, void 0, function () {
        var metas, out, byName, loose;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metas = {};
                    return [4 /*yield*/, dvRunPool(scan.tables, function (t) { return dvReadMeta(conn, t, scan.cols); }, 4, function (i, res) { metas[scan.tables[i]] = res; })];
                case 1:
                    _a.sent();
                    out = scan.tables.map(function (t) { return ({ t: t, state: metas[t] ? metas[t].state : 'unknown', checked: !!(metas[t] && metas[t].cols), have: [], missing: [], err: metas[t] ? metas[t].err || '' : '' }); });
                    byName = {};
                    out.forEach(function (r) { byName[r.t] = r; });
                    loose = [];
                    scan.cols.forEach(function (c) {
                        var owners = out.filter(function (r) { return metas[r.t] && metas[r.t].cols && metas[r.t].cols.has(c); });
                        if (owners.length) {
                            owners.forEach(function (r) { return r.have.push(c); });
                            return;
                        }
                        var anyUnchecked = out.some(function (r) { return r.state === 'found' && !r.checked; });
                        var guess = dvNearestTable(scan, c);
                        if (guess && byName[guess] && !anyUnchecked)
                            byName[guess].missing.push(c);
                        else
                            loose.push(c);
                    });
                    return [2 /*return*/, { tables: out, loose: loose }];
            }
        });
    });
}
// The list saved for a scanned app, in the manifest format, so the manifest checks run on it.
function dvScanManifest(appId, app, result) {
    return {
        m: 1,
        appId: appId,
        app: app,
        source: 'scan', savedAt: new Date().toISOString(),
        tables: result.tables.map(function (r) { return ({ t: r.t, names: [r.t], read: r.have.concat(r.missing).sort(), write: [], opt: [] }); })
    };
}
// One create or update through Xrm.WebApi, else the Web API. Resolves { ok, id, err }.
function dvWriteRow(conn, logical, entitySet, id, body) {
    return __awaiter(this, void 0, void 0, function () {
        var r, url, resp, t, e_11, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    if (!(conn.web && typeof conn.web.createRecord === 'function')) return [3 /*break*/, 4];
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, dvTimeout(function () { return conn.web.updateRecord(logical, id, body); }, 'save')];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { ok: true, id: id, err: '' }];
                case 2: return [4 /*yield*/, dvTimeout(function () { return conn.web.createRecord(logical, body); }, 'save')];
                case 3:
                    r = _a.sent();
                    return [2 /*return*/, { ok: true, id: r && r.id ? String(r.id) : '', err: '' }];
                case 4:
                    if (!(conn.clientUrl && entitySet && typeof fetch === 'function')) return [3 /*break*/, 10];
                    url = conn.clientUrl + '/api/data/v9.2/' + entitySet + (id ? '(' + String(id).replace(/[{}]/g, '') + ')' : '');
                    return [4 /*yield*/, fetch(url, { method: id ? 'PATCH' : 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' }, body: JSON.stringify(body) })];
                case 5:
                    resp = _a.sent();
                    if (resp.ok)
                        return [2 /*return*/, { ok: true, id: id || '', err: '' }];
                    t = '';
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, resp.text()];
                case 7:
                    t = _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_11 = _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, { ok: false, id: '', err: 'HTTP ' + resp.status + ': ' + dvErrText(t) }];
                case 10: return [2 /*return*/, { ok: false, id: '', err: 'This page has no way to save.' }];
                case 11:
                    e_12 = _a.sent();
                    return [2 /*return*/, { ok: false, id: '', err: dvErrText(e_12) }];
                case 12: return [2 /*return*/];
            }
        });
    });
}
// Saves (or replaces) the scan|<appId> row.
function dvSaveScan(conn, hubTable, appId, app, result, rows, manifestCol) {
    return __awaiter(this, void 0, void 0, function () {
        var key, old, idCol, list, body;
        return __generator(this, function (_a) {
            key = SCAN_PREFIX + appId;
            old = (rows || []).find(function (r) { return String(r.craa5_configkey || '') === key; });
            idCol = hubTable + 'id';
            list = JSON.stringify(dvScanManifest(appId, app, result));
            body = manifestCol === false ? { craa5_configkey: key, craa5_configname: app + ' scan', craa5_configjson: list }
                : { craa5_configkey: key, craa5_configname: app + ' scan', craa5_manifestjson: list };
            return [2 /*return*/, dvWriteRow(conn, hubTable, hubTable + 's', old ? old[idCol] : '', body)];
        });
    });
}
// Reads every row of a table, page by page (Xrm.WebApi). Resolves { ok, rows, err }.
function dvReadAllRows(conn, logical, select, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, options, guard, res, e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn.web)
                        return [2 /*return*/, { ok: false, rows: [], err: 'This page cannot read rows page by page.' }];
                    rows = [];
                    options = '?$select=' + select.join(',');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    guard = 0;
                    _a.label = 2;
                case 2:
                    if (!(guard < 200)) return [3 /*break*/, 5];
                    return [4 /*yield*/, dvTimeout(function () { return conn.web.retrieveMultipleRecords(logical, options, 500); }, 'read ' + logical)];
                case 3:
                    res = _a.sent();
                    (res && res.entities || []).forEach(function (e) { return rows.push(e); });
                    if (rows.length >= (limit || 20000) || !res || !res.nextLink)
                        return [3 /*break*/, 5];
                    options = '?' + String(res.nextLink).split('?').slice(1).join('?');
                    _a.label = 4;
                case 4:
                    guard++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, { ok: true, rows: rows, err: '' }];
                case 6:
                    e_13 = _a.sent();
                    return [2 /*return*/, { ok: false, rows: rows, err: dvErrText(e_13) }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Turns a value into what the target column takes. { ok, v }. A save with the wrong kind of value fails in Dataverse
// (error 0x80048d19), so every value is converted here first, or the row is left out and counted.
var TYPE_WORDS = { Boolean: 'Yes/No', Integer: 'Whole number', BigInt: 'Whole number', Decimal: 'Decimal', Double: 'Float', Money: 'Currency', String: 'Text', Memo: 'Multiline text', Picklist: 'Choice', DateTime: 'Date', Lookup: 'Lookup' };
function dvConvertValue(v, type) {
    var num = typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' && isFinite(Number(v)) ? Number(v) : NaN);
    switch (type) {
        case 'Boolean':
            if (typeof v === 'boolean')
                return { ok: true, v: v };
            if (isFinite(num))
                return { ok: true, v: num > 0 };
            if (/^(yes|true|si|y)$/i.test(String(v).trim()))
                return { ok: true, v: true };
            if (/^(no|false|n)$/i.test(String(v).trim()))
                return { ok: true, v: false };
            return { ok: false };
        case 'Integer':
        case 'BigInt':
            if (typeof v === 'boolean')
                return { ok: false };
            return isFinite(num) ? { ok: true, v: Math.round(num) } : { ok: false };
        case 'Decimal':
        case 'Double':
        case 'Money':
            if (typeof v === 'boolean')
                return { ok: false };
            return isFinite(num) ? { ok: true, v: num } : { ok: false };
        case 'String':
        case 'Memo':
            return { ok: true, v: typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v) };
        case 'Picklist':
            return isFinite(num) && Math.round(num) === num ? { ok: true, v: num } : { ok: false };
        case undefined:
        case '':
            return { ok: true, v: v };
        default:
            return typeof v === 'object' ? { ok: false } : { ok: true, v: v };
    }
}
// Copy one column's value into other columns on the same rows. Plan first (no writes), then run.
// types: { column: AttributeType } when known; values are converted to each target's type.
function dvPlanCopy(rows, idCol, from, to, types) {
    var ty = types || {};
    var changes = [];
    var skippedBlank = 0;
    var cannot = 0;
    rows.forEach(function (r) {
        var v = r[from];
        if (v === null || v === undefined || v === '') {
            skippedBlank++;
            return;
        }
        var body = {};
        var bad = false;
        to.forEach(function (c) {
            var cv = dvConvertValue(v, ty[c]);
            if (!cv.ok) {
                bad = true;
                return;
            }
            if (r[c] !== cv.v)
                body[c] = cv.v;
        });
        if (bad) {
            cannot++;
            return;
        }
        if (Object.keys(body).length)
            changes.push({ id: r[idCol], body: body });
    });
    // A number into a Yes/No column only says "has minutes"; say so on the page.
    var toFlag = to.filter(function (c) { return ty[c] === 'Boolean' && ty[from] && ty[from] !== 'Boolean'; });
    return { total: rows.length, changes: changes, skippedBlank: skippedBlank, cannot: cannot, types: ty, toFlag: toFlag };
}
function dvRunCopy(conn, logical, plan, onProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var done, failed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    done = 0;
                    failed = [];
                    return [4 /*yield*/, dvRunPool(plan.changes, function (ch) { return dvWriteRow(conn, logical, '', ch.id, ch.body); }, 4, function (i, res) {
                            done++;
                            if (!res.ok)
                                failed.push(res.err);
                            if (onProgress)
                                onProgress(done, failed.length);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { done: done, failed: failed }];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Security roles: which roles can read, write and create each craa5 table, and
// at what level (own rows, business unit, organization). Read only.
// ---------------------------------------------------------------------------
var DEPTH_NAMES = { Basic: 'User', Local: 'BU', Deep: 'Parent BU', Global: 'Org', 0: 'User', 1: 'BU', 2: 'Parent BU', 3: 'Org' };
var DEPTH_RANK = { User: 1, BU: 2, 'Parent BU': 3, Org: 4 };
var PRIV_OPS = ['Create', 'Read', 'Write', 'Delete', 'AppendTo', 'Append', 'Assign', 'Share'];
function dvParsePrivName(name) {
    var n = String(name || '');
    for (var i = 0; i < PRIV_OPS.length; i++) {
        var p = 'prv' + PRIV_OPS[i];
        if (n.indexOf(p) === 0 && /^craa5_/i.test(n.slice(p.length)))
            return { op: PRIV_OPS[i], table: n.slice(p.length).toLowerCase() };
    }
    return null;
}
// Resolves { state: 'ok'|'denied'|'unknown', roles: [{ id, name, privs: { table: { Read: 'Org', ... } } }], mine: [names], err }.
function dvReadRoles(conn, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pr, privById, rr, roles, mine, ur;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!conn.clientUrl)
                        return [2 /*return*/, { state: 'unknown', roles: [], mine: [], err: 'Needs the Web API address, which this page does not have.' }];
                    return [4 /*yield*/, dvFetchJson(conn, "privileges?$select=privilegeid,name&$filter=contains(name,'craa5_')")];
                case 1:
                    pr = _a.sent();
                    if (!pr.ok)
                        return [2 /*return*/, { state: dvClassify(pr.err) === 'denied' ? 'denied' : 'unknown', roles: [], mine: [], err: pr.err }];
                    privById = {};
                    (pr.json.value || []).forEach(function (p) { var x = dvParsePrivName(p.name); if (x)
                        privById[String(p.privilegeid).toLowerCase()] = x; });
                    return [4 /*yield*/, dvFetchJson(conn, 'roles?$select=name,roleid,ismanaged&$filter=_parentroleid_value eq null&$orderby=name')];
                case 2:
                    rr = _a.sent();
                    if (!rr.ok)
                        return [2 /*return*/, { state: dvClassify(rr.err) === 'denied' ? 'denied' : 'unknown', roles: [], mine: [], err: rr.err }];
                    roles = (rr.json.value || []).map(function (r) { return ({ id: String(r.roleid), name: String(r.name || ''), managed: r.ismanaged === true, privs: {}, err: '' }); });
                    return [4 /*yield*/, dvRunPool(roles, function (role) { return __awaiter(_this, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dvFetchJson(conn, 'RetrieveRolePrivilegesRole(RoleId=' + role.id + ')')];
                                    case 1:
                                        res = _a.sent();
                                        if (!res.ok) {
                                            role.err = res.err;
                                            return [2 /*return*/];
                                        }
                                        (res.json.RolePrivileges || []).forEach(function (p) {
                                            var x = privById[String(p.PrivilegeId).toLowerCase()];
                                            if (!x)
                                                return;
                                            var d = DEPTH_NAMES[p.Depth] || String(p.Depth);
                                            var t = role.privs[x.table] = role.privs[x.table] || {};
                                            if (!t[x.op] || DEPTH_RANK[d] > DEPTH_RANK[t[x.op]])
                                                t[x.op] = d;
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 4)];
                case 3:
                    _a.sent();
                    mine = [];
                    if (!userId) return [3 /*break*/, 5];
                    return [4 /*yield*/, dvFetchJson(conn, 'systemusers(' + String(userId).replace(/[{}]/g, '') + ')/systemuserroles_association?$select=name')];
                case 4:
                    ur = _a.sent();
                    if (ur.ok)
                        mine = (ur.json.value || []).map(function (r) { return String(r.name || ''); });
                    _a.label = 5;
                case 5: return [2 /*return*/, { state: 'ok', roles: roles.filter(function (r) { return Object.keys(r.privs).length || r.err; }), mine: mine, err: '' }];
            }
        });
    });
}
// Roles Dataverse makes by itself. They get rights on new tables automatically (or are for support staff), so they
// say nothing about whether the hub's own users can open a table and are left out of the findings.
// A managed role came with Dataverse or an installed solution; roles Alex makes are unmanaged.
var BUILTIN_ROLES = ['support user', 'delegate', 'service reader', 'service writer', 'service deleter', 'async ingestion', 'system administrator', 'system customizer', 'environment maker', 'app opener', 'common data service role'];
// Basic User is managed too, but it is the role most staff get, so it always counts.
function dvIsBuiltinRole(name, managed) { if (String(name || '').trim().toLowerCase() === 'basic user')
    return false; return managed === true || BUILTIN_ROLES.indexOf(String(name || '').trim().toLowerCase()) !== -1; }
// The roles (not built in) that give rights on at least one hub table: [{ name, tables }].
function dvHubRoles(roles) {
    return roles.filter(function (r) { return !dvIsBuiltinRole(r.name, r.managed) && Object.keys(r.privs).length; }).map(function (r) { return ({ name: r.name, tables: Object.keys(r.privs).length }); });
}
// What the role levels mean for the apps. tables: [{ logicalName, resolved, ownership }]. Built-in roles do not count.
function dvRoleFindings(allRoles, tables) {
    var roles = allRoles.filter(function (r) { return !dvIsBuiltinRole(r.name, r.managed); });
    var out = [];
    tables.forEach(function (t) {
        var name = t.resolved || t.logicalName;
        var withRead = roles.filter(function (r) { return r.privs[name] && r.privs[name].Read; });
        if (!withRead.length) {
            out.push({ table: name, kind: 'noread' });
            return;
        }
        if (/user/i.test(t.ownership || '')) {
            var partial = withRead.filter(function (r) { return r.privs[name].Read !== 'Org'; }).map(function (r) { return r.name; });
            if (partial.length)
                out.push({ table: name, kind: 'ownonly', roles: partial });
        }
        if (t.written && !roles.some(function (r) { return r.privs[name] && (r.privs[name].Write || r.privs[name].Create); }))
            out.push({ table: name, kind: 'nowrite' });
    });
    return out;
}
// ---------------------------------------------------------------------------
// Cross-app keys: for each contract key "this column must match that table's
// column", counts rows whose value is not found there. Counts only, no values.
// ---------------------------------------------------------------------------
// A few unmatched rows, each with its own value, in a table made by the Copilot table maker: most likely the sample rows it adds.
function dvKeyLooksLikeSamples(k) { return k.bad > 0 && k.bad <= 10 && k.badDistinct === k.bad; }
var KEY_EXACT_KINDS = ['equipment', 'employee', 'employees', 'areaguid', 'user'];
function dvKeyCanon(kind, v) {
    var s = String(v == null ? '' : v).trim().toLowerCase();
    // A clean can have several log rows: key, key|2 .. key|9 (contract 1.0.54). They all match the base key.
    if (kind === 'completion')
        s = s.replace(/\|[2-9]$/, '');
    if (KEY_EXACT_KINDS.indexOf(kind) !== -1)
        return s.replace(/[{}]/g, '');
    return s.replace(/[^a-z0-9]/g, '');
}
// Which keys can be checked: mustMatch names one table.column, and both tables were found.
function dvKeyPlan(tables, results) {
    var byName = {};
    tables.forEach(function (t) { byName[t.logicalName] = t; });
    var plan = [];
    tables.forEach(function (t) { return (t.keys || []).forEach(function (k) {
        var m = String(k.mustMatch || '').match(/^(craa5_[a-z0-9_]+)\.(craa5_[a-z0-9_]+)/);
        if (!m || !byName[m[1]])
            return;
        var rFrom = results[t.logicalName];
        var rTo = results[m[1]];
        if (!rFrom || rFrom.state !== 'found' || !rTo || rTo.state !== 'found')
            return;
        var notMade = [];
        if (dvColNotMade(rFrom, k.column))
            notMade.push((rFrom.resolvedName || t.logicalName) + '.' + k.column);
        if (dvColNotMade(rTo, m[2]))
            notMade.push((rTo.resolvedName || m[1]) + '.' + m[2]);
        plan.push({ notMade: notMade, from: t.logicalName, fromAs: rFrom.resolvedName || t.logicalName, col: k.column, to: m[1], toAs: rTo.resolvedName || m[1], toCol: m[2], kind: k.kind });
    }); });
    return plan;
}
// True only when the table's full column list was read and the column is not on it.
function dvColNotMade(r, col) {
    if (r.cols && r.cols[col] === 'missing')
        return true;
    return !!(r.allCols && r.allCols.length && r.allCols.indexOf(String(col).toLowerCase()) === -1);
}
// Up to 3 unmatched values are shown, only for kinds that name places and things (never people or free text),
// and never from the tables that hold names, emails or notes.
var KEY_EXAMPLE_KINDS = ['area', 'room', 'item', 'sapw', 'vendor', 'line', 'location', 'cart', 'sapcart', 'equipment', 'areaguid', 'skill', 'skilllevel', 'swabsite', 'payrole', 'crew'];
var KEY_NO_EXAMPLE_TABLES = /personnelnote|employeenote|accesslog|access_log/;
function dvKeyExamplesAllowed(p) {
    return KEY_EXAMPLE_KINDS.indexOf(p.kind) !== -1 && !KEY_NO_EXAMPLE_TABLES.test(p.from + ' ' + p.fromAs);
}
function dvKeyCheck(conn, plan, limit, onProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var cache, readOne, readCol, out, _loop_3, i;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cache = {};
                    readOne = function (t, c) { return __awaiter(_this, void 0, void 0, function () {
                        var r, lk, r2, fv;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, dvReadAllRows(conn, t, [c], limit)];
                                case 1:
                                    r = _a.sent();
                                    if (r.ok || !/could not find a property/i.test(r.err || ''))
                                        return [2 /*return*/, r];
                                    lk = '_' + c + '_value';
                                    return [4 /*yield*/, dvReadAllRows(conn, t, [lk], limit)];
                                case 2:
                                    r2 = _a.sent();
                                    if (!r2.ok)
                                        return [2 /*return*/, r];
                                    fv = lk + '@OData.Community.Display.V1.FormattedValue';
                                    return [2 /*return*/, { ok: true, lookup: true, err: '', rows: r2.rows.map(function (x) {
                                                var _a;
                                                return (_a = {}, _a[c] = x[fv] != null ? x[fv] : x[lk], _a);
                                            }) }];
                            }
                        });
                    }); };
                    readCol = function (t, c) { return (cache[t + '|' + c] = cache[t + '|' + c] || readOne(t, c)); };
                    out = [];
                    _loop_3 = function (i) {
                        var p, _b, a, b, target, blank, bad, badDistinct, examples, showEx, lookupValues, seen_1, side, col_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    p = plan[i];
                                    if (onProgress)
                                        onProgress(i + 1, plan.length);
                                    if (p.notMade && p.notMade.length) {
                                        out.push(Object.assign({}, p, { err: '' }));
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, Promise.all([readCol(p.fromAs, p.col), readCol(p.toAs, p.toCol)])];
                                case 1:
                                    _b = _c.sent(), a = _b[0], b = _b[1];
                                    if (!a.ok || !b.ok) {
                                        out.push(Object.assign({}, p, { err: (a.ok ? b.err : a.err) || 'could not read' }));
                                        return [2 /*return*/, "continue"];
                                    }
                                    target = new Set();
                                    b.rows.forEach(function (r) { return String(r[p.toCol] == null ? '' : r[p.toCol]).split(';').forEach(function (v) { var c = dvKeyCanon(p.kind, v); if (c)
                                        target.add(c); }); });
                                    blank = 0;
                                    bad = 0;
                                    badDistinct = new Set();
                                    examples = [];
                                    showEx = dvKeyExamplesAllowed(p);
                                    a.rows.forEach(function (r) {
                                        var raw = String(r[p.col] == null ? '' : r[p.col]).split(';').map(function (v) { return v.trim(); }).filter(function (v) { return dvKeyCanon(p.kind, v); });
                                        if (!raw.length) {
                                            blank++;
                                            return;
                                        }
                                        var miss = raw.filter(function (v) { return !target.has(dvKeyCanon(p.kind, v)); });
                                        if (miss.length) {
                                            bad++;
                                            miss.forEach(function (v) {
                                                var c = dvKeyCanon(p.kind, v);
                                                if (showEx && !badDistinct.has(c) && examples.length < 3)
                                                    examples.push(v.length > 40 ? v.slice(0, 40) + '...' : v);
                                                badDistinct.add(c);
                                            });
                                        }
                                    });
                                    lookupValues = void 0;
                                    if ((a.lookup || b.lookup) && p.kind === 'payrole') {
                                        seen_1 = {};
                                        side = a.lookup ? a : b;
                                        col_1 = a.lookup ? p.col : p.toCol;
                                        side.rows.forEach(function (r) { var v = String(r[col_1] == null ? '' : r[col_1]).trim(); if (v)
                                            seen_1[v] = true; });
                                        lookupValues = Object.keys(seen_1).sort().slice(0, 20);
                                    }
                                    out.push(Object.assign({}, p, { lookup: !!a.lookup, toLookup: !!b.lookup, lookupValues: lookupValues, rows: a.rows.length, blank: blank, bad: bad, badDistinct: badDistinct.size, examples: examples, capped: a.rows.length >= (limit || 20000), targetEmpty: target.size === 0, err: '' }));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < plan.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_3(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, out];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// App health and daily history. One dot per app from its tables, its saved
// app list (manifest) and the key checks; one summary per day kept in Hub
// config (key MONITOR_HISTORY) so the trend shows. Counts only, never values.
// ---------------------------------------------------------------------------
var HISTORY_KEY = 'MONITOR_HISTORY';
var HISTORY_DAYS = 60;
if (!HUB_CONFIG_KEYS.some(function (k) { return k.key === HISTORY_KEY; })) {
    HUB_CONFIG_KEYS.push({ key: HISTORY_KEY, app: 'monitor', otherWriters: [], status: 'live', note: 'Dataverse monitor: one summary per day (counts only).' });
}
// The manifest saved by this app (contract id -> app name -> card id), or null.
function dvAppManifest(apps, cardId) {
    return (apps || []).find(function (a) { return !a.fromScan && appIdOf(APP_WRITER_NAMES[a.appId] || a.appId) === cardId; })
        || (apps || []).find(function (a) { return a.fromScan && appIdOf(APP_WRITER_NAMES[a.appId] || a.appId) === cardId; }) || null;
}
// { tone: 'green'|'amber'|'red'|'gray', reasons: [text] }. Red: a table the app needs is missing, or its own
// list names a table or written column that is not there. Amber: anything else that needs a look.
function dvAppHealth(cardId, appTables, verdicts, man, keyResults) {
    var reasons = [];
    var tone = 'green';
    var bump = function (t) { if (t === 'red' || (t === 'amber' && tone === 'green'))
        tone = t; };
    if (!appTables.some(function (t) { return verdicts[t.logicalName] && verdicts[t.logicalName].code !== 'notscanned'; }))
        return { tone: 'gray', reasons: ['not checked yet'] };
    var bad = appTables.filter(function (t) { return NOT_PROBLEMS.indexOf(verdicts[t.logicalName].code) === -1; });
    var redT = bad.filter(function (t) { return verdicts[t.logicalName].tone === 'red'; });
    if (redT.length) {
        bump('red');
        reasons.push(redT.length + ' table(s) missing or broken');
    }
    if (bad.length > redT.length) {
        bump('amber');
        reasons.push((bad.length - redT.length) + ' table(s) need a look');
    }
    if (man && man.error) {
        bump('amber');
        reasons.push('saved app list cannot be read');
    }
    if (man && man.check) {
        var gone = man.check.tables.filter(function (t) { return t.state !== 'found'; });
        var wMiss = man.check.tables.reduce(function (n, t) { return n + t.missingWrite.length; }, 0);
        var rMiss = man.check.tables.reduce(function (n, t) { return n + t.missingRead.length; }, 0);
        var notes = man.check.tables.filter(function (t) { return t.contractNotes.length; }).length;
        if (gone.length) {
            bump('red');
            reasons.push(gone.length + ' table(s) in its list not found');
        }
        if (wMiss) {
            bump('red');
            reasons.push(wMiss + ' column(s) it saves to are missing');
        }
        if (rMiss) {
            bump('amber');
            reasons.push(rMiss + ' column(s) it reads are missing');
        }
        if (notes) {
            bump('amber');
            reasons.push(notes + ' table(s) differ from the contract');
        }
    }
    if (keyResults) {
        var names_1 = {};
        appTables.forEach(function (t) { if (t.writers.map(appIdOf).indexOf(cardId) !== -1)
            names_1[t.logicalName] = true; });
        var kb = keyResults.filter(function (k) { return names_1[k.from] && !k.err && !(k.notMade && k.notMade.length) && k.bad > 0; });
        if (kb.length) {
            bump('amber');
            reasons.push(kb.length + ' key column(s) with values not found');
        }
    }
    if (!reasons.length)
        reasons.push(man ? 'all good' : 'tables good (no saved app list yet)');
    return { tone: tone, reasons: reasons };
}
function dvLocalDay(d) {
    var x = d || new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
}
// Reads the saved history from the Hub config rows already read. Resolves to { row, days: [] }.
function dvReadHistory(rows) {
    var row = (rows || []).find(function (r) { return String(r.craa5_configkey || '') === HISTORY_KEY; }) || null;
    if (!row)
        return { row: null, days: [] };
    var text = String(row.craa5_manifestjson || '').trim() || String(row.craa5_configjson || '').trim();
    try {
        var j = JSON.parse(text);
        return { row: row, days: Array.isArray(j.days) ? j.days.filter(function (x) { return x && typeof x.d === 'string'; }) : [] };
    }
    catch (e) {
        return { row: row, days: [] };
    }
}
// Puts today's counts in (replacing today's earlier entry, keeping fields not given) and keeps the last 60 days.
function dvMergeHistory(days, entry) {
    var list = (days || []).filter(function (x) { return x.d !== entry.d; });
    var prev = (days || []).find(function (x) { return x.d === entry.d; }) || {};
    var merged = Object.assign({}, prev);
    Object.keys(entry).forEach(function (k) { if (entry[k] !== undefined)
        merged[k] = entry[k]; });
    return list.concat([merged]).sort(function (a, b) { return a.d.localeCompare(b.d); }).slice(-HISTORY_DAYS);
}
// Saves the history row. New table: the list in Config json. Old table: the list in Manifest json, a pointer in Config json.
function dvSaveHistory(conn, hubTable, row, days, manifestCol) {
    return __awaiter(this, void 0, void 0, function () {
        var list, body;
        return __generator(this, function (_a) {
            list = JSON.stringify({ m: 1, days: days });
            body = manifestCol === true
                ? { craa5_configkey: HISTORY_KEY, craa5_configname: 'Dataverse monitor history', craa5_configjson: JSON.stringify({ m: 1, in: 'craa5_manifestjson' }), craa5_manifestjson: list }
                : { craa5_configkey: HISTORY_KEY, craa5_configname: 'Dataverse monitor history', craa5_configjson: list };
            return [2 /*return*/, dvWriteRow(conn, hubTable, hubTable + 's', row ? row[hubTable + 'id'] : '', body)];
        });
    });
}
// ---------------------------------------------------------------------------
// Table builder, part 1: the build list (read only). Merges what the contract
// and each app's saved list (manifest) need with what Dataverse really has, and
// says per table what to make or change. Types: the contract decides; a manifest
// type that disagrees is a conflict and is not built. Names only, never values.
// ---------------------------------------------------------------------------
var BUILD_TYPES = {
    text: { attr: 'String', word: 'Single line of text', len: 200 },
    memo: { attr: 'Memo', word: 'Multiple lines of text', len: 100000 },
    int: { attr: 'Integer', word: 'Whole number' },
    decimal: { attr: 'Decimal', word: 'Decimal number' },
    money: { attr: 'Money', word: 'Currency' },
    yesno: { attr: 'Boolean', word: 'Yes/No' },
    date: { attr: 'DateTime', word: 'Date only', format: 'DateOnly' },
    datetime: { attr: 'DateTime', word: 'Date and time', format: 'DateAndTime' },
    choice: { attr: 'Picklist', word: 'Choice' },
    guid: { attr: 'String', word: 'Single line of text (id)', len: 100 },
    image: { attr: 'Virtual', word: 'Image' },
    file: { attr: 'Virtual', word: 'File' }
};
// The old name-based guess, in the builder's words. Always marked as a guess.
function dvGuessType(col) {
    var g = colTypeGuess(col);
    if (/(picture|image|photo)/.test(col))
        return 'image';
    if (/(file|_ssop$|_sop\d*$)/.test(col))
        return 'file';
    return g === 'date and time' ? 'datetime' : g === 'whole number' ? 'int' : g === 'currency' ? 'money' : g === 'yes/no' ? 'yesno' : /guids?$/.test(col) ? (/guids$/.test(col) ? 'memo' : 'guid') : 'text';
}
function dvTypeWord(spec) {
    if (!spec)
        return 'unknown';
    var b = BUILD_TYPES[spec.type];
    return (b ? b.word : spec.type) + (spec.len ? ' (' + spec.len + ')' : '') + (dvHasPlaces(spec) ? ' (' + spec.precision + ' decimal places)' : '');
}
// True when this display name would make this schema name: "_c_ Chemical" makes craa5__c_chemical, "Chemicals" makes craa5_chemicals.
function dvLabelFits(label, logical) {
    var n = String(label || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
    return !!n && 'craa5_' + n === String(logical || '').toLowerCase();
}
// Decimal places only matter for decimal and currency columns, and only when someone said how many.
function dvHasPlaces(spec) { return !!spec && (spec.type === 'decimal' || spec.type === 'money') && typeof spec.precision === 'number' && spec.precision >= 0; }
// A name the builder may make: a plain craa5 column. Lookup forms (_x_value) and annotations never are.
function dvBuildable(c) { return /^craa5_[a-z0-9_]*[a-z0-9]$/.test(String(c || '')) && !/_value$/.test(c); }
// What each table needs: { logical: { t, names, label, isNew, owner, primary, status, named: {col: [who]}, types: {col: spec+source}, conflicts: [] } }.
// apps: parsed manifests (dvParseManifest), scans included (they name columns, never types).
function dvBuildWants(tables, apps) {
    var out = {};
    var byName = {};
    tables.forEach(function (t) {
        var w = out[t.logicalName] = { t: t.logicalName, names: t.candidates && t.candidates.length ? t.candidates : [t.logicalName], label: t.newLabel || t.label || '', isNew: !!t.isNew, owner: t.newOwner || '', primary: t.newPrimary || null, status: t.status, spec: t, named: {}, types: {}, conflicts: [], optOnly: {}, noBuild: {} };
        w.names.concat([t.logicalName]).forEach(function (n) { byName[n] = w; });
        var name = function (c, who) { if (!dvBuildable(c))
            return; (w.named[c] = w.named[c] || []).indexOf(who) === -1 && w.named[c].push(who); };
        if (!w.primary && t.primaryName && t.primaryName !== t.primaryId)
            w.primary = { n: t.primaryName, len: 200 };
        (t.requiredCols || []).forEach(function (c) { return name(c, 'contract'); });
        (t.optionalCols || []).forEach(function (c) { name(c, 'contract'); w.optOnly[c] = true; });
        (t.columnOwners || []).forEach(function (o) { return (o.columns || []).forEach(function (c) { return name(c, 'contract'); }); });
        (t.noBuildCols || []).forEach(function (c) { w.noBuild[c] = true; });
        Object.keys(t.colTypes || {}).forEach(function (c) { name(c, 'contract'); w.types[c] = Object.assign({}, t.colTypes[c], { source: 'contract' }); });
    });
    (apps || []).forEach(function (a) { return (a.tables || []).forEach(function (mt) {
        var w = byName[mt.t] || (mt.names || []).map(function (n) { return byName[n]; }).find(Boolean);
        if (!w) {
            w = out[mt.t] = { t: mt.t, names: mt.names && mt.names.length ? mt.names : [mt.t], label: mt.label || '', isNew: !!mt['new'], owner: mt.owner || '', primary: mt.primary || null, status: 'app only', spec: null, named: {}, types: {}, conflicts: [], optOnly: {}, noBuild: {} };
            w.names.forEach(function (n) { byName[n] = w; });
        }
        if (mt['new'] && !w.spec)
            w.isNew = true;
        // The display name decides the schema name Dataverse makes, so the name that gives this table's own schema name wins (the contract's, unless only the app's fits).
        if (!w.label && mt.label)
            w.label = mt.label;
        else if (mt.label && !dvLabelFits(w.label, w.t) && dvLabelFits(mt.label, w.t))
            w.label = mt.label;
        if (mt.prompt)
            (w.prompts = w.prompts || []).push({ app: a.appId, text: mt.prompt });
        if (!w.owner && mt.owner)
            w.owner = mt.owner;
        if (!w.primary && mt.primary)
            w.primary = mt.primary;
        else if (w.primary && mt.primary && !w.primary.label && mt.primary.label && String(w.primary.n || '').toLowerCase() === mt.primary.n)
            w.primary = Object.assign({}, w.primary, { label: mt.primary.label });
        var who = a.appId + (a.fromScan ? ' (scan)' : '');
        (mt.opt || []).filter(dvBuildable).forEach(function (c) { if (!w.named[c])
            w.optOnly[c] = true; });
        mt.read.concat(mt.write).filter(dvBuildable).forEach(function (c) { delete w.optOnly[c]; });
        mt.read.concat(mt.write, mt.opt || []).filter(dvBuildable).forEach(function (c) { (w.named[c] = w.named[c] || []).indexOf(who) === -1 && w.named[c].push(who); });
        Object.keys(mt.cols || {}).filter(dvBuildable).forEach(function (c) {
            var want = mt.cols[c];
            (w.named[c] = w.named[c] || []).indexOf(who) === -1 && w.named[c].push(who);
            var have = w.types[c];
            if (!have) {
                w.types[c] = Object.assign({}, want, { source: a.appId });
                return;
            }
            if (have.type !== want.type)
                w.conflicts.push({ col: c, have: dvTypeWord(have) + ' from ' + have.source, want: dvTypeWord(want) + ' from ' + a.appId });
            else if (dvHasPlaces(have) && dvHasPlaces(want) && have.precision !== want.precision)
                w.conflicts.push({ col: c, have: dvTypeWord(have) + ' from ' + have.source, want: dvTypeWord(want) + ' from ' + a.appId });
            else {
                // Text length: the column must hold what the longest-needing app writes. The contract decides; an app that needs more than it says is a conflict.
                if ((want.type === 'text' || want.type === 'memo' || want.type === 'guid') && want.len) {
                    var cur = have.len || (have.source === 'contract' ? (BUILD_TYPES[have.type] || {}).len : 0);
                    if (!cur) {
                        have.len = want.len;
                        have.lenFrom = a.appId;
                    }
                    else if (want.len > cur) {
                        if (have.source === 'contract')
                            w.conflicts.push({ col: c, have: dvTypeWord(Object.assign({}, have, { len: cur })) + ' from contract', want: dvTypeWord(want) + ' from ' + a.appId });
                        else {
                            have.len = want.len;
                            have.lenFrom = a.appId;
                        }
                    }
                }
                // Names, decimal places and choices an app adds where the contract is silent (the contract still decides the type).
                if (!have.label && want.label)
                    have.label = want.label;
                if (!dvHasPlaces(have) && dvHasPlaces(want))
                    have.precision = want.precision;
                if (!have.options && want.options)
                    have.options = want.options;
            }
        });
    }); });
    return out;
}
// One table's columns with type and length (Web API). Resolves { ok, cols: { name: { type, maxLen, format, custom, helper } }, err }.
function dvReadColumnDetails(conn, logical) {
    return __awaiter(this, void 0, void 0, function () {
        var base, all, cols, extra, _loop_4, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    base = "EntityDefinitions(LogicalName='" + logical + "')/Attributes";
                    return [4 /*yield*/, dvFetchJson(conn, base + '?$select=LogicalName,AttributeType,IsCustomAttribute,AttributeOf')];
                case 1:
                    all = _a.sent();
                    if (!all.ok)
                        return [2 /*return*/, { ok: false, cols: {}, err: all.err }];
                    cols = {};
                    (all.json.value || []).forEach(function (a) {
                        var n = String(a.LogicalName || '').toLowerCase();
                        if (n)
                            cols[n] = { type: String(a.AttributeType || ''), custom: a.IsCustomAttribute === true, helper: !!a.AttributeOf };
                    });
                    extra = [['StringAttributeMetadata', 'MaxLength', 'maxLen'], ['MemoAttributeMetadata', 'MaxLength', 'maxLen'], ['DateTimeAttributeMetadata', 'Format', 'format'], ['DecimalAttributeMetadata', 'Precision', 'precision'], ['MoneyAttributeMetadata', 'Precision,PrecisionSource', 'precision']];
                    _loop_4 = function (i) {
                        var r;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, dvFetchJson(conn, base + '/Microsoft.Dynamics.CRM.' + extra[i][0] + '?$select=LogicalName,' + extra[i][1])];
                                case 1:
                                    r = _b.sent();
                                    if (r.ok)
                                        (r.json.value || []).forEach(function (a) {
                                            var n = String(a.LogicalName || '').toLowerCase();
                                            if (!cols[n])
                                                return;
                                            var prop = extra[i][1].split(',')[0];
                                            if (extra[i][0] === 'MoneyAttributeMetadata') {
                                                if (a.PrecisionSource === 0)
                                                    cols[n].precision = a.Precision;
                                                else
                                                    cols[n].followsCurrency = true;
                                            }
                                            else
                                                cols[n][extra[i][2]] = a[prop];
                                        });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < extra.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_4(i)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, { ok: true, cols: cols, err: '' }];
            }
        });
    });
}
// The build list. found: { logical: { name (real), primaryId, primaryName } | null when missing | undefined when unknown }.
// details: { realName: dvReadColumnDetails result }. manifestApps: app ids with a saved list (not a scan).
function dvBuildPlan(wants, found, details, manifestApps) {
    var items = [];
    var haveList = new Set(manifestApps || []);
    Object.keys(wants).sort().forEach(function (k) {
        var w = wants[k];
        if (w.status === 'abandoned' || w.status === 'absent')
            return;
        w.conflicts.forEach(function (c) { return items.push({ kind: 'conflict', t: w.t, col: c.col, text: c.have + ' vs ' + c.want }); });
        var f = found[w.t];
        if (f === null) {
            if (w.isNew || w.status === 'live' || w.status === 'proposed' || w.status === 'app only') {
                var cols = Object.keys(w.named).filter(function (c) { return c !== w.t + 'id' && !(w.primary && c === w.primary.n) && !(w.optOnly[c] && !w.types[c]) && !w.noBuild[c]; });
                items.push({ kind: 'table', t: w.t, appPrompts: w.prompts || [], alternateKey: w.spec ? w.spec.alternateKey : '', label: w.label, owner: w.owner || 'org', primary: w.primary || { n: 'craa5_name', len: 200 }, cols: cols.map(function (c) { return ({ col: c, spec: w.types[c] || { type: dvGuessType(c), source: 'guess' } }); }), text: (w.label || w.t) + ', ' + (w.owner === 'user' ? 'user' : 'organization') + '-owned, ' + cols.length + ' columns' });
            }
            return;
        }
        if (!f)
            return;
        var d = details[f.name];
        if (!d || !d.ok) {
            items.push({ kind: 'unread', t: w.t, text: d ? d.err : 'columns not read' });
            return;
        }
        var skip = function (c) { return c === (f.primaryId || w.t + 'id') || c === f.primaryName || (w.spec && c === w.spec.primaryName && f.primaryName); };
        Object.keys(w.named).sort().forEach(function (c) {
            if (skip(c) || c.indexOf('@') !== -1)
                return;
            var have = d.cols[c];
            var spec = w.types[c];
            if (!have) {
                // A column only named as optional, with no type from anyone, is not offered (its absence breaks nothing).
                if (w.noBuild[c])
                    return;
                if (!spec && w.optOnly[c])
                    return;
                var s = spec || { type: dvGuessType(c), source: 'guess' };
                items.push({ kind: 'column', t: w.t, as: f.name, col: c, spec: s, who: w.named[c], appPrompts: w.prompts || [], text: dvTypeWord(s) + (s.source === 'guess' ? ' (guessed from the name)' : ' (' + s.source + ')') });
                return;
            }
            if (!spec || !BUILD_TYPES[spec.type])
                return;
            var b = BUILD_TYPES[spec.type];
            // Date only versus Date and time is judged for every typed source (an app's type counts as much as the contract's).
            if (have.type !== b.attr || (b.format && have.format && have.format !== b.format)) {
                items.push({ kind: 'type', t: w.t, as: f.name, col: c, spec: spec, text: 'is ' + have.type + (have.format ? ' ' + have.format : '') + ', should be ' + dvTypeWord(spec) + ' (' + spec.source + ')' });
                return;
            }
            var wantLen = spec.len || b.len;
            if ((spec.type === 'text' || spec.type === 'memo' || spec.type === 'guid') && spec.len && have.maxLen && have.maxLen < wantLen) {
                items.push({ kind: 'short', t: w.t, as: f.name, col: c, spec: spec, have: have.maxLen, text: 'holds ' + have.maxLen + ', needs ' + wantLen + ' (' + (spec.lenFrom || spec.source) + ')' });
            }
            // Too few decimal places rounds every saved value; more than needed is harmless.
            if (dvHasPlaces(spec)) {
                if (have.followsCurrency)
                    items.push({ kind: 'unread', t: w.t, col: c, text: 'follows the currency\'s decimals, so its places cannot be read; the app needs ' + spec.precision + ' (set the column to ' + spec.precision + ' decimal places)' });
                else if (typeof have.precision !== 'number' && have.type === 'Decimal')
                    items.push({ kind: 'unread', t: w.t, col: c, text: 'decimal places could not be read; the app needs ' + spec.precision });
                else if (typeof have.precision === 'number' && have.precision < spec.precision)
                    items.push({ kind: 'precision', t: w.t, as: f.name, col: c, spec: spec, have: have.precision, text: 'keeps ' + have.precision + ' decimal places, needs ' + spec.precision + ' (' + spec.source + ')' });
            }
        });
        // Unused: only judged when every app that uses the table has saved its list, or a name would be missed.
        var users = w.spec ? w.spec.writers.concat(w.spec.readers).filter(function (x) { return !/model-driven/i.test(x); }).map(function (x) { return Object.keys(APP_WRITER_NAMES).find(function (id) { return appIdOf(APP_WRITER_NAMES[id]) === appIdOf(x); }); }).filter(Boolean) : [];
        if (users.length && users.every(function (u) { return haveList.has(u); })) {
            Object.keys(d.cols).sort().forEach(function (c) {
                var x = d.cols[c];
                if (!x.custom || x.helper || c.indexOf('craa5_') !== 0 || skip(c) || w.named[c])
                    return;
                items.push({ kind: 'unused', t: w.t, as: f.name, col: c, text: 'named by no app and not in the contract' });
            });
        }
    });
    return items;
}
var BUILD_KIND_WORDS = { table: 'Table to make', column: 'Column to add', short: 'Text too short', precision: 'Too few decimal places', type: 'Wrong type', conflict: 'Type conflict', unused: 'Not used', unread: 'Could not read' };
// ---------------------------------------------------------------------------
// Part 2: prompts and steps for Alex. The monitor never creates or changes
// anything in Dataverse itself (Alex, 2026-10-23): it reads, shows and tests;
// Alex builds with the Copilot table maker or by hand.
// ---------------------------------------------------------------------------
function dvPrettyCol(col) {
    var s = String(col || '').replace(/^craa5_+/, '').replace(/_/g, ' ').trim();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : col;
}
// How a column reads in a prompt or a step: "Min shifts (whole number)".
function dvColPhrase(col, spec) {
    var s = spec || { type: 'text' };
    var name = s.label || dvPrettyCol(col);
    var t = s.type;
    var how = (BUILD_TYPES[t] ? BUILD_TYPES[t].word : 'Single line of text').toLowerCase();
    if (t === 'text' || t === 'guid' || t === 'memo')
        how += ', max ' + (s.len || (BUILD_TYPES[t] || BUILD_TYPES.text).len) + ' characters';
    if (dvHasPlaces(s))
        how += ', ' + s.precision + ' decimal places';
    if (t === 'int' && (s.min != null || s.max != null))
        how += ', ' + (s.min != null ? s.min : '') + ' to ' + (s.max != null ? s.max : '');
    if (t === 'yesno' && s['default'] != null)
        how += ', default ' + (s['default'] ? 'yes' : 'no');
    if (t === 'choice' && s.options && s.options.length)
        how += ': ' + s.options.join(' / ');
    if (t === 'image')
        how += ', can store full images';
    return name + ' (' + how + ')';
}
// One Copilot create prompt, at most 2,000 characters. Columns that do not fit are returned to add by hand.
// Guessed types are never put in a prompt: they come back as "check the type first".
function dvTablePrompt(item) {
    var p = item.primary || { n: 'craa5_name', len: 200 };
    var typed = (item.cols || []).filter(function (c) { return c.spec && c.spec.source !== 'guess'; });
    var guessed = (item.cols || []).filter(function (c) { return !c.spec || c.spec.source === 'guess'; });
    var head = 'Create one table. Display name: ' + (item.label || dvPrettyCol(item.t)) + '. Schema name: ' + item.t + '. Ownership: ' + (item.owner === 'user' ? 'User or team' : 'Organization') + '. Primary column: ' + dvColPhrase(p.n, { type: 'text', len: p.len || 200, label: p.label }) + '.';
    var tail = ' Use these exact names. No lookup or formula columns. Do not add any other columns.';
    var body = '';
    var inPrompt = [];
    var byHand = [];
    typed.forEach(function (c) {
        var piece = (inPrompt.length ? ', ' : ' Add only these columns: ') + dvColPhrase(c.col, c.spec) + ' [' + c.col + ']';
        if ((head + body + piece + '.' + tail).length <= 2000) {
            body += piece;
            inPrompt.push(c.col);
        }
        else
            byHand.push(c);
    });
    return { text: head + body + (body ? '.' : '') + tail, inPrompt: inPrompt, byHand: byHand, guessed: guessed };
}
// Steps to widen a column that exists (Dataverse lets text length and decimal places grow, never shrink).
function dvChangeSteps(table, col, spec, kind) {
    var name = (spec && spec.label) || dvPrettyCol(col);
    if (kind === 'short')
        return 'Tables - ' + table + ' - Columns - ' + name + ' (' + col + ') - Edit: set Maximum character count to ' + ((spec && spec.len) || '') + '.';
    if (kind === 'precision')
        return 'Tables - ' + table + ' - Columns - ' + name + ' (' + col + ') - Edit: set Precision to ' + (spec ? spec.precision : '') + ' decimal places.';
    return '';
}
// Steps to add one column by hand (Copilot cannot edit an existing table well).
function dvColumnSteps(table, col, spec) {
    return 'Tables - ' + table + ' - New - Column: Display name ' + ((spec && spec.label) || dvPrettyCol(col)) + ', schema name ' + col + ', data type ' + dvColPhrase(col, spec).replace(/^[^(]*\(/, '').replace(/\)$/, '') + '.';
}
function BrandLogo(_a) {
    var isDark = _a.isDark, lang = _a.lang;
    return (React.createElement("div", { "aria-label": lang === 'es' ? 'Logo de la empresa' : 'Company logo', style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: isDark ? '#F8FAFC' : '#1F2937', flexShrink: 0, whiteSpace: 'nowrap' } },
        LOGO_URL ? (React.createElement("img", { src: LOGO_URL, alt: "Apex Foods logo", style: { height: 34, width: 'auto', display: 'block', borderRadius: 6, background: '#FFFFFF', padding: isDark ? '2px 6px' : '1px 4px' } })) : (React.createElement("svg", { viewBox: "0 0 40 40", width: "34", height: "34", "aria-hidden": "true" },
            React.createElement("circle", { cx: "15", cy: "12", r: "9", fill: BRAND.blue }),
            React.createElement("circle", { cx: "27", cy: "20", r: "8", fill: BRAND.yellow }),
            React.createElement("circle", { cx: "15", cy: "29", r: "8", fill: BRAND.red }))),
        React.createElement("b", { style: { fontWeight: 800 } }, "Apex Foods")));
}
// Read-only look at the browser storage keys the apps share. Nothing here writes.
function inspectStorage() {
    return STORAGE_BRIDGES.map(function (b) {
        var status = 'empty';
        var detail = '';
        var issue = '';
        try {
            var storeObj = b.store === 'sessionStorage' ? window.sessionStorage : window.localStorage;
            var raw = storeObj ? storeObj.getItem(b.key) : null;
            if (raw) {
                var parsed = JSON.parse(raw);
                var chars = raw.length;
                status = 'ok';
                if (b.key === 'ss_live_boards_local_v1' && Array.isArray(parsed)) {
                    var now_1 = Date.now();
                    var stale = parsed.filter(function (x) { return x && (x.status === 'archived' || (x.slotEnd && (now_1 - new Date(x.slotEnd).getTime() > 4 * 3600000))); });
                    detail = parsed.length + ' board(s), ' + chars + ' chars';
                    if (stale.length > 0) {
                        status = 'warn';
                        issue = 'stale:' + stale.length;
                    }
                }
                else if (b.key === 'mss_log_asset_catalog_v4' && parsed && typeof parsed === 'object') {
                    var hasBoth = Array.isArray(parsed.items) && Array.isArray(parsed.assets);
                    var cnt = Array.isArray(parsed.items) ? parsed.items.length : (Array.isArray(parsed.assets) ? parsed.assets.length : 0);
                    detail = cnt + ' item(s), ' + chars + ' chars';
                    if (!hasBoth) {
                        status = 'warn';
                        issue = 'onekey';
                    }
                }
                else {
                    detail = (Array.isArray(parsed) ? parsed.length + ' item(s)' : (parsed && typeof parsed === 'object' ? Object.keys(parsed).length + ' key(s)' : 'value')) + ', ' + chars + ' chars';
                }
            }
        }
        catch (err) {
            status = 'bad';
            issue = 'json';
            detail = dvErrText(err);
        }
        return { key: b.key, store: b.store, writers: b.writers, readers: b.readers, contract: b.contract, status: status, detail: detail, issue: issue };
    });
}
var TONES = {
    green: { bg: '#064e3b', fg: '#a7f3d0' },
    teal: { bg: '#134e4a', fg: '#99f6e4' },
    amber: { bg: '#78350f', fg: '#fde68a' },
    red: { bg: '#7f1d1d', fg: '#fecaca' },
    purple: { bg: '#4c1d95', fg: '#ddd6fe' },
    gray: { bg: '#334155', fg: '#e2e8f0' }
};
// The last 14 daily summaries as small bars (tables that need a look; the red part is missing or broken).
function HistoryPanel(_a) {
    var days = _a.days, note = _a.note, bgCard = _a.bgCard, borderCol = _a.borderCol, textSub = _a.textSub;
    var list = (days || []).slice(-14);
    var max = Math.max.apply(Math, __spreadArray([1], list.map(function (d) { return d.p || 0; }), false));
    var last = list[list.length - 1];
    var weekAgo = list.length > 1 ? list[Math.max(0, list.length - 8)] : null;
    return (React.createElement("div", { style: { background: bgCard, padding: '14px 16px', borderRadius: '8px', border: '1px solid ' + borderCol, marginBottom: '16px' } },
        React.createElement("div", { style: { fontSize: '15px', fontWeight: 700 } }, "Daily history"),
        React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '2px', marginBottom: '10px' } }, 'Each time this page runs its check, today\'s counts are saved (one entry per day, counts only, last 60 days). ' + (last ? 'Today: ' + last.p + ' table(s) need a look, ' + last.r + ' red' + (last.a != null ? ', ' + last.a + ' app(s) red' : '') + '.' + (weekAgo && weekAgo !== last ? ' On ' + weekAgo.d + ': ' + weekAgo.p + ' need a look, ' + weekAgo.r + ' red.' : '') : 'Nothing saved yet.')),
        list.length > 0 && (React.createElement("div", { style: { display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' } }, list.map(function (d) {
            var h = Math.round(50 * (d.p || 0) / max);
            var hr = Math.round(50 * (d.r || 0) / max);
            return (React.createElement("div", { key: d.d, title: d.d + ': ' + d.p + ' need a look, ' + d.r + ' red', style: { flex: '1 1 0', maxWidth: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '60px' } },
                React.createElement("div", { style: { height: Math.max(0, h - hr) + 'px', background: '#d97706', borderRadius: '2px 2px 0 0' } }),
                React.createElement("div", { style: { height: hr + 'px', background: '#dc2626' } }),
                React.createElement("div", { style: { height: '2px', background: '#9ca3af' } })));
        }))),
        note && React.createElement("div", { style: { fontSize: '11px', color: textSub, marginTop: '8px' } }, note)));
}
function verdictText(v, lang) {
    var es = lang === 'es';
    switch (v.code) {
        case 'ok': return (es ? 'OK - ' : 'OK - ') + v.n.toLocaleString() + (v.capped ? '+' : '') + (es ? ' filas' : ' rows');
        case 'empty': return es ? 'Vacia (0 filas)' : 'Empty (0 rows)';
        case 'missingcols': return (es ? 'Faltan columnas (' : 'Missing columns (') + v.n + ')';
        case 'colsunchecked': return es ? 'Columnas sin revisar' : 'Columns not checked';
        case 'foundnocount': return es ? 'Existe, sin conteo' : 'Found, no count';
        case 'denied': return es ? 'Sin permiso' : 'No permission';
        case 'missing': return es ? 'No existe' : 'Missing';
        case 'unknown': return es ? 'No se pudo saber' : 'Could not tell';
        case 'gone': return es ? 'Abandonada - ya no existe' : 'Abandoned - gone';
        case 'abandonedthere': return (es ? 'Abandonada - sigue ahi' : 'Abandoned - still there') + (v.n != null ? ' (' + v.n.toLocaleString() + (v.capped ? '+' : '') + ')' : '');
        case 'notmade': return es ? 'Propuesta - no creada' : 'Proposed - not made yet';
        case 'absent': return es ? 'No existe (esperado)' : 'Not there (expected)';
        default: return es ? 'Sin revisar' : 'Not scanned';
    }
}
// One plain sentence that says what the badge means for this table.
function verdictSentence(r, v, lang) {
    var es = lang === 'es';
    var n = r && r.count != null ? r.count.toLocaleString() + (r.countCapped ? '+' : '') : '';
    switch (v.code) {
        case 'ok': return es ? ('La tabla existe, se pudo leer y tiene ' + n + ' filas. Todas las columnas requeridas estan.') : ('The table exists, could be read, and holds ' + n + ' rows. Every required column is there.');
        case 'empty': return es ? 'La tabla existe y se pudo leer, pero no tiene filas. Las apps que la leen no veran datos.' : 'The table exists and could be read, but it has no rows. Apps that read it will show nothing.';
        case 'missingcols': return es ? 'La tabla existe, pero le faltan columnas requeridas (en rojo abajo). Las apps que las usan fallaran al leer o guardar.' : 'The table exists but is missing required columns (red below). Apps that use them will fail to read or save.';
        case 'colsunchecked': return es ? 'La tabla existe, pero no se pudo leer su lista de columnas, asi que no se sabe si estan las requeridas.' : 'The table exists, but its column list could not be read, so it is not known whether the required columns are there.';
        case 'foundnocount': return es ? 'La tabla existe, pero no se pudo contar sus filas (ver el error abajo).' : 'The table exists, but its rows could not be counted (see the error below).';
        case 'denied': return es ? 'La tabla existe, pero tu rol de seguridad no permite leerla. Las apps la veran vacia o con error para ti.' : 'The table exists, but your security role cannot read it. Apps will show it empty or failing for you.';
        case 'missing': return es ? 'Dataverse dice que esta tabla no existe con este nombre.' : 'Dataverse says no table has this name.';
        case 'unknown': return es ? 'No hubo una respuesta clara (sin conexion, tiempo agotado o inicio de sesion rechazado). No se asume nada.' : 'There was no clear answer (offline, timed out, or sign-in refused). Nothing is assumed.';
        case 'gone': return es ? 'El contrato marca esta tabla como abandonada y ya no existe. Nada que hacer.' : 'The contract marks this table abandoned and it is gone. Nothing to do.';
        case 'abandonedthere': return es ? 'El contrato marca esta tabla como abandonada, pero sigue en Dataverse. Ninguna app deberia usarla; se puede borrar cuando quiera.' : 'The contract marks this table abandoned, but it is still in Dataverse. No app should use it; it can be deleted whenever you choose.';
        case 'absent': return es ? 'El contrato ya sabe que esta tabla no existe. Nada que hacer.' : 'The contract already knows this table does not exist. Nothing to do.';
        case 'notmade': return es ? 'El contrato propone esta tabla, pero aun no se crea. Se espera.' : 'The contract proposes this table, but it has not been made yet. That is expected.';
        default: return es ? 'Todavia no se ha revisado.' : 'Not checked yet.';
    }
}
var CODE_TONE = { absent: 'gray', gone: 'gray', abandonedthere: 'gray', notmade: 'gray', ok: 'green', empty: 'teal', missingcols: 'amber', colsunchecked: 'amber', foundnocount: 'amber', denied: 'purple', missing: 'red', unknown: 'gray', notscanned: 'gray' };
function summaryLabel(code, lang) {
    var es = lang === 'es';
    var w = {
        ok: ['OK', 'OK'], empty: ['Empty', 'Vacias'], missingcols: ['Missing columns', 'Faltan columnas'],
        colsunchecked: ['Columns not checked', 'Columnas sin revisar'], foundnocount: ['Found, no count', 'Existe, sin conteo'],
        denied: ['No permission', 'Sin permiso'], missing: ['Missing', 'No existen'], unknown: ['Could not tell', 'No se pudo saber'],
        notscanned: ['Not scanned', 'Sin revisar'], gone: ['Abandoned, gone', 'Abandonadas, borradas'],
        abandonedthere: ['Abandoned, still there', 'Abandonadas, siguen'], absent: ['Not there (expected)', 'No existen (esperado)'], notmade: ['Proposed, not made', 'Propuestas, sin crear']
    }[code] || [code, code];
    return es ? w[1] : w[0];
}
var VERDICT_ORDER = ['missing', 'denied', 'missingcols', 'unknown', 'colsunchecked', 'foundnocount', 'empty', 'ok', 'notmade', 'absent', 'abandonedthere', 'gone', 'notscanned'];
var NOT_PROBLEMS = ['ok', 'empty', 'notmade', 'absent', 'abandonedthere', 'gone', 'notscanned'];
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function DataverseOrganizerApp(props) {
    var _this = this;
    var rootRef = useRef(null);
    var _a = useState(function () {
        try {
            var v = window.localStorage.getItem('__1_' + ORG_THEME_KEY);
            return v === null ? true : v === '1';
        }
        catch (e) {
            return true;
        }
    }), isDark = _a[0], setIsDark = _a[1];
    // English only (Alex, 2026-10-22): the Spanish text stays in the code but is never shown.
    var _b = useState('en'), lang = _b[0], setLang = _b[1];
    var L = useCallback(function (en, es) { return (lang === 'es' ? es : en); }, [lang]);
    // The ways to reach Dataverse are found once; the host passing new props must not start a new scan.
    var dataApiProp = props ? props.dataApi : null;
    var webApiProp = props ? props.webApi : null;
    var conn = useMemo(function () { return dvConnect(props); }, [dataApiProp, webApiProp]); // eslint-disable-line react-hooks/exhaustive-deps
    var msUser = useMemo(function () { return dvReadUser(conn, props); }, [conn]); // eslint-disable-line react-hooks/exhaustive-deps
    var online = conn.routes.length > 0;
    var _c = useState('audit'), activeTab = _c[0], setActiveTab = _c[1];
    var _d = useState(false), scanning = _d[0], setScanning = _d[1];
    var _e = useState(0), scanDone = _e[0], setScanDone = _e[1];
    var _f = useState({}), tableResults = _f[0], setTableResults = _f[1];
    var _g = useState(null), discovered = _g[0], setDiscovered = _g[1];
    var _h = useState([]), storageState = _h[0], setStorageState = _h[1];
    var _j = useState(ECOSYSTEM_TABLES[0].logicalName), selectedTable = _j[0], setSelectedTable = _j[1];
    var _k = useState('all'), filterApp = _k[0], setFilterApp = _k[1];
    var _l = useState('all'), filterState = _l[0], setFilterState = _l[1];
    var _m = useState('problems'), printoutMode = _m[0], setPrintoutMode = _m[1];
    var _o = useState(''), toast = _o[0], setToast = _o[1];
    var _p = useState(null), lastScanTime = _p[0], setLastScanTime = _p[1];
    var _q = useState({}), fillCounts = _q[0], setFillCounts = _q[1];
    var _r = useState(''), fillBusy = _r[0], setFillBusy = _r[1];
    var _s = useState(null), manifests = _s[0], setManifests = _s[1];
    var _t = useState(''), scanApp = _t[0], setScanApp = _t[1];
    var _u = useState(''), scanOther = _u[0], setScanOther = _u[1];
    var _v = useState(''), scanCode = _v[0], setScanCode = _v[1];
    var _w = useState(false), scanBusy = _w[0], setScanBusy = _w[1];
    var _x = useState(null), scanResult = _x[0], setScanResult = _x[1];
    var _y = useState(''), scanSaved = _y[0], setScanSaved = _y[1];
    var _z = useState('craa5___1_a_assets'), copyTable = _z[0], setCopyTable = _z[1];
    var _0 = useState('craa5_allergenclean'), copyFrom = _0[0], setCopyFrom = _0[1];
    var _1 = useState('craa5_eggallergen, craa5_pecanallergen'), copyTo = _1[0], setCopyTo = _1[1];
    var _2 = useState(null), copyPlan = _2[0], setCopyPlan = _2[1];
    var _3 = useState(''), copyBusy = _3[0], setCopyBusy = _3[1];
    var _4 = useState(null), copyDone = _4[0], setCopyDone = _4[1];
    var _5 = useState(false), copyConfirm = _5[0], setCopyConfirm = _5[1];
    var _6 = useState(''), keyAdd = _6[0], setKeyAdd = _6[1];
    var _7 = useState(null), roleData = _7[0], setRoleData = _7[1];
    var _8 = useState(false), roleBusy = _8[0], setRoleBusy = _8[1];
    var _9 = useState(null), keyResults = _9[0], setKeyResults = _9[1];
    var _10 = useState(''), keyBusy = _10[0], setKeyBusy = _10[1];
    var _11 = useState({ days: [], note: '' }), history = _11[0], setHistory = _11[1];
    var _12 = useState(null), buildItems = _12[0], setBuildItems = _12[1];
    var _13 = useState(''), buildBusy = _13[0], setBuildBusy = _13[1];
    var _14 = useState(''), buildOpen = _14[0], setBuildOpen = _14[1];
    var scanRef = useRef(0);
    var toggleTheme = useCallback(function (mode) {
        var nextDark = mode === 'dark';
        setIsDark(nextDark);
        try {
            window.localStorage.setItem('__1_' + ORG_THEME_KEY, nextDark ? '1' : '0');
        }
        catch (e) { }
    }, []);
    var toggleLang = useCallback(function (next) {
        var norm = next === 'es' ? 'es' : 'en';
        setLang(norm);
        try {
            window.localStorage.setItem('__1_' + ORG_LANG_KEY, norm);
        }
        catch (e) { }
    }, []);
    var showToast = useCallback(function (msg) { setToast(msg); setTimeout(function () { return setToast(''); }, 3500); }, []);
    var refreshStorage = useCallback(function () { return setStorageState(inspectStorage()); }, []);
    var runScan = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var myScan, listP, done, list, read, old, _a, isMan, newManRows, newKeys, oldManRows, manRows, cache, apps, i, man, _b, _c, maxLen, _d, hubSpec, hubRes, _e, manifestCol, mMaxLen, _f, hub, oldKeys, newNeedsKey, nm;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!online)
                        return [2 /*return*/];
                    myScan = ++scanRef.current;
                    setScanning(true);
                    setScanDone(0);
                    setTableResults({});
                    listP = dvListCustomTables(conn);
                    done = 0;
                    return [4 /*yield*/, dvRunPool(ECOSYSTEM_TABLES, function (spec) { return dvAuditCandidates(conn, spec); }, 4, function (i, r) {
                            if (scanRef.current !== myScan)
                                return;
                            done++;
                            setScanDone(done);
                            if (r)
                                setTableResults(function (prev) {
                                    var _a;
                                    return (__assign(__assign({}, prev), (_a = {}, _a[ECOSYSTEM_TABLES[i].logicalName] = r, _a)));
                                });
                        })];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, listP];
                case 2:
                    list = _g.sent();
                    if (scanRef.current !== myScan)
                        return [2 /*return*/];
                    setDiscovered(list);
                    return [4 /*yield*/, dvReadHubConfigRows(conn, '')];
                case 3:
                    read = _g.sent();
                    if (!(read.state === 'ok' && read.table !== 'craa5___1_e_hubconfig')) return [3 /*break*/, 5];
                    return [4 /*yield*/, dvReadHubConfigRows(conn, '', ['craa5___1_e_hubconfig'])];
                case 4:
                    _a = _g.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = null;
                    _g.label = 6;
                case 6:
                    old = _a;
                    isMan = function (r) { var k = String(r.craa5_configkey || ''); return k.indexOf(MANIFEST_PREFIX) === 0 || k.indexOf(SCAN_PREFIX) === 0; };
                    newManRows = read.rows.filter(isMan);
                    newKeys = new Set(newManRows.map(function (r) { return String(r.craa5_configkey); }));
                    oldManRows = old && old.state === 'ok' ? old.rows.filter(function (r) { return isMan(r) && !newKeys.has(String(r.craa5_configkey)); }) : [];
                    manRows = newManRows.concat(oldManRows);
                    cache = {};
                    apps = [];
                    i = 0;
                    _g.label = 7;
                case 7:
                    if (!(i < manRows.length)) return [3 /*break*/, 12];
                    man = dvParseManifest(manRows[i]);
                    man.inTable = i < newManRows.length ? read.table : 'craa5___1_e_hubconfig';
                    _b = man;
                    if (!(man.error || man.stub)) return [3 /*break*/, 8];
                    _c = null;
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, dvCheckManifest(conn, man, cache, ECOSYSTEM_TABLES)];
                case 9:
                    _c = _g.sent();
                    _g.label = 10;
                case 10:
                    _b.check = _c;
                    apps.push(man);
                    _g.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 7];
                case 12:
                    apps.sort(function (a, b) { return a.app.localeCompare(b.app); });
                    if (!read.table) return [3 /*break*/, 14];
                    return [4 /*yield*/, dvConfigJsonMaxLength(conn, read.table)];
                case 13:
                    _d = _g.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _d = null;
                    _g.label = 15;
                case 15:
                    maxLen = _d;
                    if (scanRef.current !== myScan)
                        return [2 /*return*/];
                    hubSpec = ECOSYSTEM_TABLES.find(function (t) { return t.logicalName === read.table; });
                    if (!read.table) return [3 /*break*/, 17];
                    return [4 /*yield*/, dvReadMeta(conn, read.table, ['craa5_manifestjson'])];
                case 16:
                    _e = _g.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _e = null;
                    _g.label = 18;
                case 18:
                    hubRes = _e;
                    manifestCol = hubRes && hubRes.cols ? hubRes.cols.has('craa5_manifestjson') : read.manifestCol;
                    if (!manifestCol) return [3 /*break*/, 20];
                    return [4 /*yield*/, dvConfigJsonMaxLength(conn, read.table, 'craa5_manifestjson')];
                case 19:
                    _f = _g.sent();
                    return [3 /*break*/, 21];
                case 20:
                    _f = null;
                    _g.label = 21;
                case 21:
                    mMaxLen = _f;
                    if (scanRef.current !== myScan)
                        return [2 /*return*/];
                    hub = read.state === 'ok' ? dvCheckHubConfig(read.rows, maxLen, apps, mMaxLen) : null;
                    oldKeys = null;
                    if (old && old.state === 'ok')
                        oldKeys = old.rows.map(function (r) { return String(r.craa5_configkey || '').trim() || String(r.craa5_configname || '').trim(); }).filter(Boolean);
                    newNeedsKey = false;
                    if (!(read.table !== 'craa5___1_e_hubconfig')) return [3 /*break*/, 23];
                    return [4 /*yield*/, dvReadMeta(conn, 'craa5___1_e_hubconfig', ['craa5_configkey'])];
                case 22:
                    nm = _g.sent();
                    newNeedsKey = nm.state === 'found' && !!nm.cols && !nm.cols.has('craa5_configkey');
                    _g.label = 23;
                case 23:
                    if (scanRef.current !== myScan)
                        return [2 /*return*/];
                    setManifests({ newNeedsKey: newNeedsKey, state: read.state, table: read.table || '', err: read.err || '', rows: read.rows, apps: apps, maxLen: maxLen, hub: hub, oldKeys: oldKeys, readNotes: read.notes || [], manifestCol: manifestCol, mMaxLen: mMaxLen, ownership: hubRes && hubRes.meta ? hubRes.meta.OwnershipType : '', expectedOwnership: hubSpec ? hubSpec.expectedOwnership : '' });
                    setLastScanTime(new Date().toISOString());
                    setScanning(false);
                    if (read.state === 'ok')
                        setHistory(function (h) { return (__assign(__assign({}, h), { days: dvReadHistory(read.rows).days, read: { table: read.table, rows: read.rows, manifestCol: manifestCol, maxLen: maxLen } })); });
                    return [2 /*return*/];
            }
        });
    }); }, [conn, online]);
    useEffect(function () {
        refreshStorage();
        runScan();
    }, [refreshStorage, runScan]);
    var verdicts = useMemo(function () {
        var out = {};
        ECOSYSTEM_TABLES.forEach(function (t) { out[t.logicalName] = dvVerdict(tableResults[t.logicalName], t); });
        return out;
    }, [tableResults]);
    var summary = useMemo(function () {
        var s = {};
        VERDICT_ORDER.forEach(function (c) { s[c] = 0; });
        ECOSYSTEM_TABLES.forEach(function (t) { s[verdicts[t.logicalName].code]++; });
        return s;
    }, [verdicts]);
    var unclaimed = useMemo(function () {
        if (!Array.isArray(discovered))
            return null;
        var known = new Set();
        ECOSYSTEM_TABLES.forEach(function (t) { return t.candidates.concat([t.logicalName]).forEach(function (n) { return known.add(n.toLowerCase()); }); });
        return discovered.filter(function (d) { return !known.has(d.logicalName.toLowerCase()); });
    }, [discovered]);
    var filteredTables = useMemo(function () {
        var list = ECOSYSTEM_TABLES;
        if (filterApp !== 'all')
            list = list.filter(function (t) { return t.usedBy.indexOf(filterApp) !== -1; });
        if (filterState === 'problems')
            list = list.filter(function (t) { return NOT_PROBLEMS.indexOf(verdicts[t.logicalName].code) === -1; });
        return list;
    }, [filterApp, filterState, verdicts]);
    // One dot per app: its tables, its saved app list and the key checks.
    var appHealth = useMemo(function () {
        var out = {};
        ECOSYSTEM_APPS.forEach(function (app) {
            var appTables = ECOSYSTEM_TABLES.filter(function (t) { return t.usedBy.indexOf(app.id) !== -1; });
            var man = manifests && manifests.apps ? dvAppManifest(manifests.apps, app.id) : null;
            out[app.id] = dvAppHealth(app.id, appTables, verdicts, man, keyResults);
        });
        return out;
    }, [verdicts, manifests, keyResults]);
    // Daily history: after a full check (and again after key checks), today's counts replace today's entry.
    useEffect(function () {
        var rd = history.read;
        if (!rd || scanning || !Object.keys(tableResults).length)
            return;
        var entry = {
            d: dvLocalDay(), v: MONITOR_VERSION, c: CONTRACT_VERSION,
            t: ECOSYSTEM_TABLES.filter(function (t) { return verdicts[t.logicalName].code !== 'notscanned'; }).length,
            p: ECOSYSTEM_TABLES.filter(function (t) { return NOT_PROBLEMS.indexOf(verdicts[t.logicalName].code) === -1; }).length,
            r: ECOSYSTEM_TABLES.filter(function (t) { return verdicts[t.logicalName].tone === 'red'; }).length,
            m: manifests && manifests.apps ? manifests.apps.filter(function (a) { return a.check && a.check.tables.some(function (t) { return t.state !== 'found' || t.missingWrite.length || t.missingRead.length; }); }).length : undefined,
            k: keyResults ? keyResults.filter(function (k) { return k.bad && !k.err; }).length : undefined,
            a: ECOSYSTEM_APPS.filter(function (a) { return appHealth[a.id].tone === 'red'; }).length
        };
        var days = dvMergeHistory(history.days, entry);
        var text = JSON.stringify({ m: 1, days: days });
        // Old table without Manifest json: Config json is too short for the list, so nothing is saved.
        if (rd.manifestCol !== true && rd.maxLen != null && text.length > rd.maxLen) {
            setHistory(function (h) { return (__assign(__assign({}, h), { days: days, read: null, note: 'History not saved: Config json in ' + rd.table + ' is too short.' })); });
            return;
        }
        setHistory(function (h) { return (__assign(__assign({}, h), { days: days, read: null, note: 'Saving today\'s summary...' })); });
        var row = dvReadHistory(rd.rows).row;
        dvSaveHistory(conn, rd.table, row, days, rd.manifestCol).then(function (res) {
            var _a;
            if (res.ok && !row && res.id)
                rd.rows.push((_a = { craa5_configkey: HISTORY_KEY }, _a[rd.table + 'id'] = res.id, _a));
            setHistory(function (h) { return (__assign(__assign({}, h), { note: res.ok ? 'Today\'s summary saved in ' + rd.table + ' (' + HISTORY_KEY + ').' : 'History not saved: ' + res.err, rows: rd })); });
        });
    }, [history.read, scanning, tableResults, verdicts, manifests, keyResults, appHealth, conn]);
    // The printout carries states, counts, column names and errors. It never carries row values.
    var printoutText = useMemo(function () {
        var rows = ECOSYSTEM_TABLES.map(function (t) {
            var r = tableResults[t.logicalName];
            var v = verdicts[t.logicalName];
            var base = {
                table: t.logicalName,
                contractStatus: t.status,
                foundAs: r && r.resolvedName && r.resolvedName !== t.logicalName ? r.resolvedName : undefined,
                result: verdictText(v, 'en'),
                rows: r && r.count != null ? (r.count + (r.countCapped ? '+' : '')) : null,
                usedBy: t.usedBy,
                missingRequired: r ? r.missingRequired : [],
                similarColumns: r && r.similar && Object.keys(r.similar).length ? r.similar : undefined,
                primaryNameInDataverse: r && r.missingRequired.length ? r.primaryName : undefined,
                notCheckedRequired: r ? r.uncheckedRequired : [],
                missingOptional: r ? r.missingOptional : [],
                columnsFrom: r ? (r.colSource || 'not read') : 'not scanned',
                error: r && r.error ? r.error : null,
                filledValues: fillCounts[t.logicalName] ? Object.keys(fillCounts[t.logicalName].cols).map(function (c) { var f = fillCounts[t.logicalName].cols[c]; return c + ': ' + (f && f.ok ? f.count + (f.capped ? '+' : '') : '?'); }) : undefined
            };
            if (printoutMode === 'full') {
                base.entitySet = r ? r.entitySetName : '';
                base.primaryId = r ? r.primaryId : t.primaryId;
                base.primaryName = r ? r.primaryName : t.primaryName;
                base.ownership = r ? r.ownership : '';
                base.readVia = r ? r.via : '';
            }
            return base;
        });
        var payload = {
            tool: 'Dataverse Monitor ' + MONITOR_VERSION,
            contractVersion: CONTRACT_VERSION,
            generatedAt: new Date().toISOString(),
            lastScan: lastScanTime,
            routes: conn.routes,
            environment: conn.clientUrl || 'unknown',
            summary: VERDICT_ORDER.filter(function (c) { return summary[c] > 0; }).map(function (c) { return summaryLabel(c, 'en') + ': ' + summary[c]; }),
            tables: printoutMode === 'full' ? rows : rows.filter(function (x) { return NOT_PROBLEMS.indexOf(verdicts[x.table].code) === -1 || x.filledValues; }),
            // Columns other threads are waiting on (contract notes): there, missing, or not checked.
            watchedColumns: Object.keys(NOTE_OPTIONAL_COLS).map(function (t) { var r = tableResults[t]; return t + ': ' + NOTE_OPTIONAL_COLS[t].map(function (c) { return c + ' ' + (!r || !r.cols || !r.cols[c] ? 'not checked' : r.cols[c]); }).join(', '); }),
            // Tables found under a name other than the contract's first one (answers "which name did Alex make?").
            foundUnderOtherName: ECOSYSTEM_TABLES.filter(function (t) { var r = tableResults[t.logicalName]; return r && r.resolvedName && r.resolvedName !== t.logicalName; }).map(function (t) { return t.logicalName + ' -> ' + tableResults[t.logicalName].resolvedName; }),
            notConfirmedTables: ECOSYSTEM_TABLES.filter(function (t) { return t.status === 'unknown'; }).map(function (t) { return t.logicalName + ': ' + verdictText(verdicts[t.logicalName], 'en'); }),
            hubConfig: !manifests ? 'not read' : (manifests.state !== 'ok' || !manifests.hub ? manifests.state + (manifests.err ? ': ' + manifests.err : '') : {
                rows: manifests.hub.rows.length,
                configJsonMaxLength: manifests.maxLen,
                manifestJsonColumn: manifests.manifestCol === true ? 'present' : (manifests.manifestCol === false ? 'not there' : 'could not tell'),
                manifestJsonMaxLength: manifests.mMaxLen,
                ownership: manifests.ownership || 'unknown',
                warnings: manifests.hub.rows.filter(function (x) { return x.warnings.length && !x.issues.length; }).map(function (x) { return x.key + ': ' + x.warnings.join(','); }),
                problems: manifests.hub.rows.filter(function (x) { return x.issues.length; }).map(function (x) { return (x.key || '(blank key, name "' + x.name + '")') + ': ' + x.issues.join(',') + ' (' + x.len + ' chars' + (x.mLen ? ', manifestjson ' + x.mLen : '') + ')'; }).concat(manifests.hub.claims.map(function (c) { return c.appId + ' writes ' + c.key + ': ' + (c.issue === 'otherapp' ? 'belongs to ' + c.owner : 'not in contract'); })),
                notSavedYet: manifests.hub.expected.filter(function (e) { return e.state === 'notyet' && !(manifests.oldKeys && manifests.oldKeys.indexOf(e.key) !== -1); }).map(function (e) { return e.key; }),
                onlyOnOldTable: manifests.oldKeys ? manifests.hub.expected.filter(function (e) { return e.state === 'notyet' && manifests.oldKeys.indexOf(e.key) !== -1; }).map(function (e) { return e.key; }) : undefined,
                notInContract: manifests.hub.unlisted,
                largest: manifests.hub.rows.slice().sort(function (a, b) { return b.len - a.len; }).slice(0, 3).map(function (x) { return (x.key || 'name "' + x.name + '"') + ' ' + x.len; })
            }),
            appManifests: !manifests ? 'not read' : (manifests.state !== 'ok' ? manifests.state + (manifests.err ? ': ' + manifests.err : '') : {
                configJsonMaxLength: manifests.maxLen,
                manifestJsonColumn: manifests.manifestCol === true ? 'present' : (manifests.manifestCol === false ? 'not there' : 'could not tell'),
                manifestJsonMaxLength: manifests.mMaxLen,
                hubConfigOwnership: manifests.ownership || 'unknown',
                apps: manifests.apps.map(function (a) { return ({
                    app: a.app, appId: a.appId, version: a.version, savedIn: a.inTable, hubShared: a.contract, savedAt: a.savedAt, error: a.error || undefined, source: a.source || undefined, pointerOnly: a.stub ? a.pointer : undefined,
                    problems: a.check ? a.check.tables.filter(function (t) { return t.state !== 'found' || t.missingRead.length || t.missingWrite.length || t.contractNotes.length; }).map(function (t) { return t.t + (t.state !== 'found' ? ': ' + t.state : '') + (t.missingWrite.length ? ' write-missing ' + t.missingWrite.join(',') : '') + (t.missingRead.length ? ' read-missing ' + t.missingRead.join(',') : '') + (t.contractNotes.length ? ' contract ' + t.contractNotes.join(',') + (t.notAllowed ? ' (' + t.notAllowed.join(',') + ')' : '') : ''); }) : [],
                    notYet: a.check ? a.check.tables.filter(function (t) { return t.notYet.length; }).map(function (t) { return t.t + ' ' + t.notYet.join(','); }) : []
                }); })
            }),
            securityRoles: !roleData ? 'not read (press Read security roles)' : (roleData.state !== 'ok' ? roleData.state + ': ' + roleData.err : {
                yourRoles: roleData.mine,
                rolesWithHubRights: (roleData.hubRoles || []).map(function (r) { return r.name + ' (' + r.tables + ' tables)'; }),
                builtInRolesLeftOut: roleData.builtin || [],
                findings: roleData.findings.map(function (f) { return f.table + ': ' + f.kind + (f.roles ? ' (' + f.roles.join(', ') + ')' : ''); })
            }),
            keyChecks: !keyResults ? 'not run (press Check keys)' : keyResults.filter(function (k) { return k.bad || k.err || k.targetEmpty || (k.notMade && k.notMade.length); }).map(function (k) { return k.from + '.' + k.col + ' -> ' + k.to + '.' + k.toCol + ': ' + (k.notMade && k.notMade.length ? 'column not made yet: ' + k.notMade.join(', ') : (k.err ? 'error ' + k.err : k.bad + ' of ' + k.rows + ' rows not found (' + k.badDistinct + ' distinct)' + (k.examples && k.examples.length ? ', e.g. ' + k.examples.map(function (x) { return '"' + x + '"'; }).join(', ') : '') + (k.lookup || k.toLookup ? ', lookup (display names compared)' : '') + (dvKeyLooksLikeSamples(k) ? ', maybe Copilot sample rows' : '') + (k.targetEmpty ? ', target empty' : '') + (k.capped ? ', first 20000 rows' : ''))); }),
            lookupRoleNames: keyResults ? Array.from(new Set(keyResults.filter(function (k) { return (k.lookup || k.toLookup) && k.lookupValues; }).map(function (k) { return (k.lookup ? k.from + '.' + k.col : k.to + '.' + k.toCol) + ' (lookup) carries: ' + k.lookupValues.join(', '); }))) : undefined,
            buildList: !buildItems ? 'not made (press Make build list)' : buildItems.map(function (b) { return BUILD_KIND_WORDS[b.kind] + ': ' + b.t + (b.col ? '.' + b.col : '') + ' - ' + b.text; }),
            appHealth: ECOSYSTEM_APPS.map(function (a) { return a.name + ': ' + appHealth[a.id].tone + ' - ' + appHealth[a.id].reasons.join('; '); }),
            history: history.days.length ? history.days.slice(-7).map(function (d) { return d.d + ' problems ' + d.p + ' red ' + d.r + ' app-list ' + d.m + (d.k != null ? ' keys ' + d.k : ''); }) : 'none saved yet',
            tablesNotOnList: unclaimed ? unclaimed.map(function (d) { return d.logicalName; }) : 'could not list (no Web API address)',
            browserStorage: storageState.filter(function (s) { return printoutMode === 'full' || s.status === 'warn' || s.status === 'bad'; }).map(function (s) { return ({ key: s.key, status: s.status, detail: s.detail, issue: s.issue || null }); })
        };
        return JSON.stringify(payload, null, 2);
    }, [tableResults, verdicts, summary, lastScanTime, conn, printoutMode, unclaimed, storageState, fillCounts, manifests, roleData, keyResults, appHealth, history, buildItems]);
    // Work for the table maker, one card per table. Copilot does best with one short prompt per table and
    // cannot edit tables, so a missing table gets a short create prompt (required columns only) and missing
    // columns on an existing table are listed to add by hand. Lookup columns are never asked for.
    // Code scanner: which names are tables. Ecosystem tables by name; any Dataverse table by its plural (entity set) name.
    var scanKnown = useMemo(function () {
        var tables = new Set();
        var sets = {};
        ECOSYSTEM_TABLES.forEach(function (t) { tables.add(t.logicalName); (t.candidates || []).forEach(function (c) { return tables.add(c); }); if (t.entitySetName)
            sets[t.entitySetName] = t.logicalName; });
        (Array.isArray(discovered) ? discovered : []).forEach(function (d) { if (d.entitySetName && d.entitySetName !== d.logicalName)
            sets[d.entitySetName.toLowerCase()] = d.logicalName; });
        return { tables: tables, sets: sets };
    }, [discovered]);
    var scanAppId = scanApp === 'other' ? appIdOf(scanOther) : scanApp;
    var scanAppName = scanApp === 'other' ? scanOther.trim() : (APP_WRITER_NAMES[scanApp] || scanApp);
    var runCodeScan = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var sc, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setScanBusy(true);
                    setScanSaved('');
                    setScanResult(null);
                    sc = dvScanCode(scanCode, scanKnown);
                    return [4 /*yield*/, dvScanCheck(conn, sc)];
                case 1:
                    res = _a.sent();
                    setScanResult(Object.assign(res, { tokenTables: sc.tables.length, tokenCols: sc.cols.length }));
                    setScanBusy(false);
                    return [2 /*return*/];
            }
        });
    }); }, [conn, scanCode, scanKnown]);
    var saveCodeScan = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!scanResult || !scanAppId || !manifests || !manifests.table)
                        return [2 /*return*/];
                    setScanSaved(L('Saving...', 'Guardando...'));
                    return [4 /*yield*/, dvSaveScan(conn, manifests.table, scanAppId, scanAppName || scanAppId, scanResult, manifests.rows || [], manifests.manifestCol)];
                case 1:
                    r = _a.sent();
                    setScanSaved(r.ok ? L('Saved. Every check now watches this app.', 'Guardado. Cada revision ahora vigila esta app.') : L('Could not save: ', 'No se pudo guardar: ') + r.err);
                    if (r.ok)
                        runScan();
                    return [2 /*return*/];
            }
        });
    }); }, [conn, scanResult, scanAppId, scanAppName, manifests, L]);
    var scanCards = useMemo(function () {
        if (!scanResult)
            return [];
        return scanResult.tables.map(function (r) {
            var cols = r.missing.filter(function (c) { return !dvIsLookupCol(c); });
            var text = r.state === 'missing' ? 'Create one table. Display name: ' + colDisplay(r.t) + '. Primary column: name (text).'
                + (cols.length ? ' Add only these columns: ' + cols.map(function (c) { return colDisplay(c) + ' (' + colTypeGuess(c) + ')'; }).join(', ') + '.' : '')
                + ' No lookup, choice or formula columns. Do not add any other columns.' : '';
            return Object.assign({}, r, { text: text, cols: cols });
        });
    }, [scanResult]);
    // Copy column values: plan (read only), then copy on a second press.
    var planCopy = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var table, from, to, meta, missingCols, idCol, read;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    table = copyTable.trim().toLowerCase();
                    from = copyFrom.trim().toLowerCase();
                    to = copyTo.split(/[ ,]+/).map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
                    setCopyPlan(null);
                    setCopyDone(null);
                    setCopyConfirm(false);
                    if (!table || !from || !to.length)
                        return [2 /*return*/];
                    setCopyBusy(L('Reading rows...', 'Leyendo filas...'));
                    return [4 /*yield*/, dvReadMeta(conn, table, [from].concat(to))];
                case 1:
                    meta = _a.sent();
                    if (meta.state !== 'found') {
                        setCopyPlan({ err: L('Table not found or no permission: ', 'Tabla no encontrada o sin permiso: ') + (meta.err || meta.state) });
                        setCopyBusy('');
                        return [2 /*return*/];
                    }
                    missingCols = meta.cols ? [from].concat(to).filter(function (c) { return !meta.cols.has(c); }) : [];
                    if (missingCols.length) {
                        setCopyPlan({ err: L('These columns are not on the table: ', 'Estas columnas no estan en la tabla: ') + missingCols.join(', ') });
                        setCopyBusy('');
                        return [2 /*return*/];
                    }
                    idCol = (meta.meta && meta.meta.PrimaryIdAttribute) || table + 'id';
                    return [4 /*yield*/, dvReadAllRows(conn, table, [idCol, from].concat(to))];
                case 2:
                    read = _a.sent();
                    if (!read.ok) {
                        setCopyPlan({ err: read.err });
                        setCopyBusy('');
                        return [2 /*return*/];
                    }
                    setCopyPlan(Object.assign(dvPlanCopy(read.rows, idCol, from, to, meta.types || {}), { table: table, from: from, to: to }));
                    setCopyBusy('');
                    return [2 /*return*/];
            }
        });
    }); }, [conn, copyTable, copyFrom, copyTo, L]);
    var runCopy = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!copyPlan || !copyPlan.changes || !copyPlan.changes.length)
                        return [2 /*return*/];
                    // No browser pop-up: Power Apps pages block them, so the second press on the page is the confirmation.
                    setCopyConfirm(false);
                    if (!conn.web || typeof conn.web.updateRecord !== 'function') {
                        setCopyDone({ done: 0, failed: ['This page cannot save rows (no Xrm.WebApi).'] });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, dvRunCopy(conn, copyPlan.table, copyPlan, function (d, f) { return setCopyBusy(L('Copying ', 'Copiando ') + d + ' / ' + copyPlan.changes.length + (f ? L(', failed ', ', fallaron ') + f : '')); })];
                case 1:
                    res = _a.sent();
                    setCopyBusy('');
                    setCopyDone(res);
                    setCopyPlan(null);
                    return [2 /*return*/];
            }
        });
    }); }, [conn, copyPlan, L]);
    // Adds the settings rows the contract lists to the new Hub config table: key and name filled, JSON left for the app.
    var addKeyRows = useCallback(function (keys) { return __awaiter(_this, void 0, void 0, function () {
        var ok, errs, i, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!manifests || !manifests.table)
                        return [2 /*return*/];
                    ok = 0;
                    errs = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < keys.length)) return [3 /*break*/, 4];
                    setKeyAdd(L('Adding ', 'Agregando ') + (i + 1) + ' / ' + keys.length);
                    return [4 /*yield*/, dvWriteRow(conn, manifests.table, manifests.table + 's', '', { craa5_configkey: keys[i], craa5_configname: keys[i] })];
                case 2:
                    r = _a.sent();
                    if (r.ok)
                        ok++;
                    else
                        errs.push(keys[i] + ': ' + r.err);
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    setKeyAdd(L('Added ', 'Agregadas ') + ok + L(' rows', ' filas') + (errs.length ? L('. Failed: ', '. Fallaron: ') + errs.join('; ') : '.'));
                    runScan();
                    return [2 /*return*/];
            }
        });
    }); }, [conn, manifests, L]);
    // Security roles (on demand, read only).
    var readRoles = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var d, found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRoleBusy(true);
                    return [4 /*yield*/, dvReadRoles(conn, msUser && msUser.userId)];
                case 1:
                    d = _a.sent();
                    found = ECOSYSTEM_TABLES.filter(function (t) { return t.status === 'live' && tableResults[t.logicalName] && tableResults[t.logicalName].state === 'found'; })
                        .map(function (t) { return ({ logicalName: t.logicalName, resolved: tableResults[t.logicalName].resolvedName || t.logicalName, ownership: tableResults[t.logicalName].ownership || (tableResults[t.logicalName].meta && tableResults[t.logicalName].meta.OwnershipType) || '', written: (t.writers || []).some(function (w) { return !/admin/i.test(w); }) }); });
                    d.tables = found;
                    d.findings = d.state === 'ok' ? dvRoleFindings(d.roles, found) : [];
                    d.hubRoles = d.state === 'ok' ? dvHubRoles(d.roles) : [];
                    d.builtin = d.state === 'ok' ? d.roles.filter(function (r) { return dvIsBuiltinRole(r.name, r.managed); }).map(function (r) { return r.name; }) : [];
                    setRoleData(d);
                    setRoleBusy(false);
                    return [2 /*return*/];
            }
        });
    }); }, [conn, msUser, tableResults]);
    // Build list (on demand, read only): what to make or change, from the contract and the apps' saved lists.
    var runBuildList = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, wants, found, names, details, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apps = manifests && manifests.apps ? manifests.apps.filter(function (a) { return !a.error && !a.stub; }) : [];
                    wants = dvBuildWants(ECOSYSTEM_TABLES, apps);
                    found = {};
                    Object.keys(wants).forEach(function (k) {
                        var r = tableResults[k];
                        if (r) {
                            found[k] = r.state === 'found' ? { name: r.resolvedName || k, primaryId: r.primaryId, primaryName: r.primaryName } : (r.state === 'missing' ? null : undefined);
                            return;
                        }
                        var st;
                        apps.forEach(function (a) { return a.check && a.check.tables.forEach(function (t) { if (t.t === k)
                            st = t.state === 'found' ? { name: t.foundAs || k, primaryId: (t.foundAs || k) + 'id', primaryName: '' } : (t.state === 'missing' ? null : st); }); });
                        found[k] = st;
                    });
                    names = Array.from(new Set(Object.keys(found).filter(function (k) { return found[k] && Object.keys(wants[k].named).length; }).map(function (k) { return found[k].name; })));
                    details = {};
                    n = 0;
                    setBuildBusy('Reading columns 0 / ' + names.length);
                    return [4 /*yield*/, dvRunPool(names, function (nm) { return dvReadColumnDetails(conn, nm); }, 4, function (i, res) { details[names[i]] = res; n++; setBuildBusy('Reading columns ' + n + ' / ' + names.length); })];
                case 1:
                    _a.sent();
                    setBuildItems(dvBuildPlan(wants, found, details, apps.filter(function (a) { return !a.fromScan; }).map(function (a) { return a.appId; })));
                    setBuildBusy('');
                    return [2 /*return*/];
            }
        });
    }); }, [conn, manifests, tableResults]);
    // Cross-app keys (on demand; reads the key columns only, counts only).
    var runKeyChecks = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var plan, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plan = dvKeyPlan(ECOSYSTEM_TABLES, tableResults);
                    setKeyBusy('Checking 0 / ' + plan.length);
                    return [4 /*yield*/, dvKeyCheck(conn, plan, 20000, function (i, n) { return setKeyBusy('Checking ' + i + ' / ' + n); })];
                case 1:
                    res = _a.sent();
                    setKeyResults(res);
                    setKeyBusy('');
                    setHistory(function (h) { return (h.rows ? __assign(__assign({}, h), { read: h.rows }) : h); });
                    return [2 /*return*/];
            }
        });
    }); }, [conn, tableResults]);
    var promptCards = useMemo(function () {
        var cards = [];
        ECOSYSTEM_TABLES.forEach(function (t) {
            var r = tableResults[t.logicalName];
            if (!r || (t.status !== 'live' && t.status !== 'proposed'))
                return;
            if (r.state === 'missing') {
                var cols = t.requiredCols.filter(function (c) { return !dvIsLookupCol(c) && c !== t.primaryId && c !== t.primaryName; });
                var text = 'Create one table. Display name: ' + colDisplay(t.logicalName) + '. Primary column: ' + colDisplay(t.primaryName || 'craa5_name') + ' (text).'
                    + (cols.length ? ' Add only these columns: ' + cols.map(function (c) { return colDisplay(c) + ' (' + colTypeGuess(c) + ')'; }).join(', ') + '.' : '')
                    + ' No lookup, choice or formula columns. Do not add any other columns.';
                cards.push({ key: t.logicalName, kind: 'create', table: t, text: text });
            }
            else if (r.state === 'found') {
                var cols = r.missingRequired.filter(function (c) { return !dvIsLookupCol(c); });
                if (cols.length)
                    cards.push({ key: t.logicalName, kind: 'add', table: t, cols: cols, similar: r.similar || {} });
            }
        });
        return cards;
    }, [tableResults]);
    // Counts how many rows have a value in each of the selected table's columns. On demand only: one small count per column.
    var countFilled = useCallback(function (spec, r) { return __awaiter(_this, void 0, void 0, function () {
        var table, cols, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!r || r.state !== 'found')
                        return [2 /*return*/];
                    table = r.resolvedName || spec.logicalName;
                    cols = r.allCols && r.allCols.length ? r.allCols : spec.requiredCols.concat(spec.optionalCols).map(dvColKey).filter(function (c) { return r.cols && Object.keys(r.cols).some(function (k) { return dvColKey(k) === c && r.cols[k] === 'present'; }); });
                    setFillBusy(spec.logicalName);
                    out = {};
                    return [4 /*yield*/, dvRunPool(cols, function (c) { return dvCountFilled(conn, table, r.primaryId, r.entitySetName, c); }, 4, function (i, res) { out[cols[i]] = res; })];
                case 1:
                    _a.sent();
                    setFillCounts(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[spec.logicalName] = { total: r.count, cols: out, at: new Date().toISOString() }, _a)));
                    });
                    setFillBusy('');
                    return [2 /*return*/];
            }
        });
    }); }, [conn]);
    var copyText = useCallback(function (txt, label) {
        try {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(txt);
            }
            else {
                var ta = document.createElement('textarea');
                ta.value = txt;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast(L('Copied ', 'Copiado: ') + label);
        }
        catch (e) {
            showToast(L('Copy failed - select the text and press Ctrl+C.', 'No se pudo copiar - seleccione el texto y presione Ctrl+C.'));
        }
    }, [L, showToast]);
    var selectedSpec = useMemo(function () { return ECOSYSTEM_TABLES.find(function (t) { return t.logicalName === selectedTable; }) || ECOSYSTEM_TABLES[0]; }, [selectedTable]);
    var selectedResult = tableResults[selectedSpec.logicalName] || null;
    var selectedVerdict = verdicts[selectedSpec.logicalName];
    var bgMain = isDark ? '#0f172a' : '#f8fafc';
    var bgCard = isDark ? '#1e293b' : '#ffffff';
    var bgSub = isDark ? '#0f172a' : '#f1f5f9';
    var textMain = isDark ? '#f8fafc' : '#0f172a';
    var textSub = isDark ? '#94a3b8' : '#475569';
    var borderCol = isDark ? '#334155' : '#cbd5e1';
    var pill = function (tone) { return ({ padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: TONES[tone].bg, color: TONES[tone].fg, whiteSpace: 'nowrap' }); };
    var btn = function (primary, color) { return ({
        padding: '8px 14px', borderRadius: '6px', border: primary ? 'none' : '1px solid ' + borderCol,
        background: primary ? (color || '#2563eb') : bgSub, color: primary ? '#ffffff' : textMain,
        fontWeight: 600, fontSize: '13px', cursor: 'pointer'
    }); };
    var colChip = function (st) {
        var tone = st === 'present' ? 'green' : (st === 'missing' ? 'red' : 'gray');
        return { padding: '3px 8px', borderRadius: '4px', fontFamily: 'Consolas, monospace', fontSize: '12px', background: TONES[tone].bg, color: TONES[tone].fg };
    };
    var colWord = function (st) { return (st === 'present' ? L('there', 'esta') : (st === 'missing' ? L('missing', 'falta') : L('not checked', 'sin revisar'))); };
    var appName = function (id) {
        var a = ECOSYSTEM_APPS.find(function (x) { return x.id === id; });
        return a ? a.name : id;
    };
    var userLabel = msUser.userName || L('unknown user', 'usuario desconocido');
    return (React.createElement("div", { ref: rootRef, style: { fontFamily: 'Segoe UI, system-ui, sans-serif', background: bgMain, color: textMain, minHeight: '100vh', padding: '16px 20px' } },
        React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '10px 16px', marginBottom: '14px', borderRadius: '10px', background: bgCard, border: '1px solid ' + borderCol, borderBottom: '4px solid ' + BRAND.yellow } },
            React.createElement("div", { style: { fontSize: '13px', fontWeight: 700 } },
                L('Welcome ', 'Bienvenido(a) ') + userLabel + L(' to the Dataverse Monitor', ' al Monitor de Dataverse'),
                msUser.source === 'unknown' && (React.createElement("span", { style: { marginLeft: 8, fontSize: '11px', fontWeight: 400, color: textSub } }, L('(this page could not read who is signed in)', '(esta pagina no pudo leer quien inicio sesion)')))),
            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
                React.createElement(BrandLogo, { isDark: isDark, lang: lang }),
                React.createElement("div", { style: { display: 'flex', padding: 2, borderRadius: 8, border: '1px solid ' + borderCol, background: bgSub } }, ['light', 'dark'].map(function (m) { return (React.createElement("button", { key: m, type: "button", onClick: function () { return toggleTheme(m); }, style: { padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: (m === 'dark') === isDark ? (isDark ? '#1E293B' : '#FFFFFF') : 'transparent', color: (m === 'dark') === isDark ? (isDark ? '#38BDF8' : '#0F172A') : textSub } }, m === 'light' ? L('Light', 'Claro') : L('Dark', 'Oscuro'))); })))),
        React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', borderBottom: '1px solid ' + borderCol, paddingBottom: '14px', marginBottom: '14px' } },
            React.createElement("div", null,
                React.createElement("h1", { style: { margin: 0, fontSize: '20px', fontWeight: 700 } },
                    L('Dataverse Monitor', 'Monitor de Dataverse'),
                    " ",
                    React.createElement("span", { style: { fontSize: '12px', color: textSub, fontWeight: 600 } }, MONITOR_VERSION)),
                React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px' } }, L('Checks every hub table: is it there, can you read it, how many rows, and are the needed columns there.', 'Revisa cada tabla del hub: si existe, si la puede leer, cuantas filas tiene y si estan las columnas necesarias.'))),
            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
                React.createElement("span", { style: __assign(__assign({}, pill(online ? 'green' : 'amber')), { fontSize: '12px', padding: '6px 12px' }) }, online ? L('Connected: ', 'Conectado: ') + conn.routes.join(' + ') : L('Not connected - open this page inside the Power App', 'Sin conexion - abra esta pagina dentro de la Power App')),
                React.createElement("button", { type: "button", onClick: runScan, disabled: scanning || !online, style: __assign(__assign({}, btn(true)), { cursor: scanning ? 'wait' : (online ? 'pointer' : 'not-allowed'), opacity: online ? 1 : 0.5 }) }, scanning ? L('Checking ', 'Revisando ') + scanDone + ' / ' + ECOSYSTEM_TABLES.length + '...' : L('Run full check', 'Revisar todo')),
                React.createElement("button", { type: "button", onClick: function () { return copyText(printoutText, L('the printout', 'el reporte')); }, style: btn(true, '#0284c7') }, L('Copy printout', 'Copiar reporte')))),
        toast && (React.createElement("div", { style: { marginBottom: '12px', padding: '10px 14px', borderRadius: '6px', background: '#065f46', color: '#ecfdf5', fontSize: '13px', fontWeight: 600 } }, toast)),
        React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' } },
            VERDICT_ORDER.filter(function (c) { return summary[c] > 0; }).map(function (c) {
                var tone = CODE_TONE[c];
                return (React.createElement("span", { key: c, style: __assign(__assign({}, pill(tone)), { fontSize: '12px', padding: '5px 10px' }) },
                    summaryLabel(c, lang),
                    ": ",
                    summary[c]));
            }),
            lastScanTime && (React.createElement("span", { style: { fontSize: '12px', color: textSub } }, L('Last check: ', 'Ultima revision: ') + new Date(lastScanTime).toLocaleString()))),
        React.createElement("div", { style: { display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' } }, [
            { id: 'audit', label: L('Tables', 'Tablas') + ' (' + ECOSYSTEM_TABLES.length + ')' },
            { id: 'printout', label: L('Printout', 'Reporte') },
            { id: 'bridges', label: L('Browser storage', 'Almacenamiento del navegador') + ' (' + STORAGE_BRIDGES.length + ')' },
            { id: 'apps', label: L('Apps', 'Apps') + ' (' + ECOSYSTEM_APPS.length + ')' },
            { id: 'manifests', label: L('Hub config', 'Hub config') + (manifests && manifests.hub ? ' (' + manifests.hub.rows.length + (manifests.hub.problems ? ', ' + manifests.hub.problems + L(' to fix', ' por corregir') : '') + ')' : '') },
            { id: 'prompts', label: L('Table maker prompt', 'Prompt para crear tablas') },
            { id: 'scancode', label: L('Scan app code', 'Escanear codigo') },
            { id: 'copy', label: L('Copy column values', 'Copiar valores') },
            { id: 'security', label: 'Security roles' + (roleData && roleData.findings ? ' (' + roleData.findings.length + ')' : '') },
            { id: 'build', label: 'Build' + (buildItems ? ' (' + buildItems.filter(function (b) { return b.kind !== 'unused'; }).length + ')' : '') },
            { id: 'keys', label: 'Key checks' + (keyResults ? ' (' + keyResults.filter(function (k) { return (k.bad || k.err) && !(k.notMade && k.notMade.length); }).length + ')' : '') }
        ].map(function (tab) { return (React.createElement("button", { key: tab.id, type: "button", onClick: function () { return setActiveTab(tab.id); }, style: { padding: '9px 16px', borderRadius: '6px', border: '1px solid ' + (activeTab === tab.id ? '#3b82f6' : borderCol), background: activeTab === tab.id ? '#1d4ed8' : bgCard, color: activeTab === tab.id ? '#ffffff' : textMain, fontWeight: 600, fontSize: '13px', cursor: 'pointer' } }, tab.label)); })),
        activeTab === 'audit' && (React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' } },
            React.createElement("div", { style: { flex: '1 1 300px', minWidth: 0, boxSizing: 'border-box', maxWidth: '420px', background: bgCard, borderRadius: '8px', padding: '14px', border: '1px solid ' + borderCol } },
                React.createElement("label", { style: { display: 'block', fontSize: '12px', color: textSub, marginBottom: '4px' } }, L('App:', 'App:')),
                React.createElement("select", { value: filterApp, onChange: function (e) { return setFilterApp(e.target.value); }, style: { width: '100%', padding: '7px 10px', borderRadius: '6px', background: bgSub, color: textMain, border: '1px solid ' + borderCol, fontSize: '13px', marginBottom: '8px' } },
                    React.createElement("option", { value: "all" }, L('All apps', 'Todas las apps')),
                    ECOSYSTEM_APPS.map(function (a) { return React.createElement("option", { key: a.id, value: a.id }, a.name); })),
                React.createElement("div", { style: { display: 'flex', gap: '6px', marginBottom: '10px' } }, [['all', L('All tables', 'Todas')], ['problems', L('Only problems', 'Solo problemas')]].map(function (o) { return (React.createElement("button", { key: o[0], type: "button", onClick: function () { return setFilterState(o[0]); }, style: __assign(__assign({}, btn(filterState === o[0])), { padding: '5px 10px', fontSize: '12px' }) }, o[1])); })),
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '680px', overflowY: 'auto' } },
                    filteredTables.length === 0 && (React.createElement("div", { style: { fontSize: '13px', color: textSub, padding: '8px' } }, L('No tables match.', 'Ninguna tabla coincide.'))),
                    filteredTables.map(function (t) {
                        var v = verdicts[t.logicalName];
                        var isSel = t.logicalName === selectedSpec.logicalName;
                        return (React.createElement("div", { key: t.logicalName, onClick: function () { return setSelectedTable(t.logicalName); }, style: { padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', background: isSel ? (isDark ? '#1e3a8a' : '#dbeafe') : bgSub, border: '1px solid ' + (isSel ? '#3b82f6' : borderCol), display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } },
                            React.createElement("div", { style: { minWidth: 0 } },
                                React.createElement("div", { style: { fontSize: '13px', fontWeight: 600 } }, esLabel(lang, t.label)),
                                React.createElement("div", { style: { fontSize: '11px', color: textSub, fontFamily: 'Consolas, monospace', overflow: 'hidden', textOverflow: 'ellipsis' } }, t.logicalName)),
                            React.createElement("span", { style: pill(v.tone) }, verdictText(v, lang))));
                    })),
                unclaimed && unclaimed.length > 0 && (React.createElement("div", { style: { marginTop: '14px', paddingTop: '10px', borderTop: '1px solid ' + borderCol } },
                    React.createElement("div", { style: { fontSize: '12px', fontWeight: 700, color: textSub, marginBottom: '6px' } },
                        L('craa5 tables no app on this list uses', 'Tablas craa5 que ninguna app de la lista usa'),
                        " (",
                        unclaimed.length,
                        ")"),
                    React.createElement("div", { style: { fontFamily: 'Consolas, monospace', fontSize: '11px', color: textSub, lineHeight: 1.6, wordBreak: 'break-word' } }, unclaimed.map(function (d) { return d.logicalName; }).join(', '))))),
            React.createElement("div", { style: { flex: '2 1 420px', minWidth: 0, boxSizing: 'border-box', background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
                React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', borderBottom: '1px solid ' + borderCol, paddingBottom: '12px', marginBottom: '14px' } },
                    React.createElement("div", { style: { minWidth: 0 } },
                        React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, esLabel(lang, selectedSpec.label)),
                        React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '4px', fontFamily: 'Consolas, monospace', wordBreak: 'break-word' } },
                            selectedSpec.logicalName,
                            selectedResult && selectedResult.entitySetName ? ' - ' + selectedResult.entitySetName : ''),
                        React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '2px' } },
                            esLabel(lang, selectedSpec.category),
                            selectedResult && selectedResult.ownership ? ' - ' + L('Owner type: ', 'Tipo de propietario: ') + selectedResult.ownership : '')),
                    React.createElement("span", { style: __assign(__assign({}, pill(selectedVerdict.tone)), { fontSize: '13px', padding: '5px 12px' }) }, verdictText(selectedVerdict, lang))),
                React.createElement("div", { style: { marginBottom: '14px', padding: '10px 12px', borderRadius: '6px', background: bgSub, border: '1px solid ' + borderCol, fontSize: '13px' } },
                    verdictSentence(selectedResult, selectedVerdict, lang),
                    selectedResult && selectedResult.ownership === 'UserOwned' && (React.createElement("div", { style: { marginTop: '6px', color: TONES.amber.fg } }, L('This table is User-owned: every hub role needs Read at Organization level, or people only see their own rows.', 'Esta tabla es de propiedad de usuario: cada rol del hub necesita Leer a nivel Organizacion, o cada quien solo vera sus propias filas.')))),
                React.createElement("div", { style: { marginBottom: '14px' } },
                    [['w', L('Written by:', 'Escrita por:'), selectedSpec.writers], ['r', L('Read by:', 'Leida por:'), selectedSpec.readers]].filter(function (g) { return g[2].length > 0; }).map(function (g) { return (React.createElement("div", { key: g[0], style: { display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '6px' } },
                        React.createElement("span", { style: { fontSize: '12px', fontWeight: 600, color: textSub, minWidth: '80px' } }, g[1]),
                        g[2].map(function (n) { return (React.createElement("span", { key: n, style: { padding: '4px 10px', borderRadius: '999px', background: '#1e3a8a', color: '#bfdbfe', fontSize: '12px', fontWeight: 600 } }, n)); }))); }),
                    React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '4px' } },
                        L('Contract status: ', 'Estado en el contrato: '),
                        React.createElement("strong", null, selectedSpec.status),
                        selectedSpec.expectedOwnership ? ' - ' + L('expected owner type: ', 'tipo de propietario esperado: ') + selectedSpec.expectedOwnership : '',
                        selectedSpec.candidates.length > 1 ? ' - ' + L('names tried in order: ', 'nombres probados en orden: ') + selectedSpec.candidates.join(', ') : ''),
                    selectedResult && selectedResult.primaryNameAlias && (React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '4px' } },
                        L('Name column in Dataverse: ', 'Columna de nombre en Dataverse: '),
                        React.createElement("strong", null, selectedResult.primaryNameAlias),
                        L(' (counts as ', ' (cuenta como ') + selectedSpec.primaryName + ')')),
                    selectedResult && selectedResult.resolvedName && selectedResult.resolvedName !== selectedSpec.logicalName && (React.createElement("div", { style: { fontSize: '12px', color: TONES.amber.fg, marginTop: '4px' } },
                        L('Found under the name ', 'Encontrada con el nombre '),
                        React.createElement("strong", null, selectedResult.resolvedName)))),
                [['req', L('Required columns', 'Columnas requeridas'), selectedSpec.requiredCols], ['opt', L('Optional columns', 'Columnas opcionales'), selectedSpec.optionalCols]].filter(function (g) { return g[2].length > 0; }).map(function (g) { return (React.createElement("div", { key: g[0], style: { background: bgSub, padding: '12px', borderRadius: '6px', border: '1px solid ' + borderCol, marginBottom: '12px' } },
                    React.createElement("div", { style: { fontSize: '13px', fontWeight: 600, marginBottom: '8px' } },
                        g[1],
                        " (",
                        g[2].length,
                        ")"),
                    React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }, g[2].map(function (c) {
                        var st = selectedResult ? (selectedResult.cols[c] || 'unchecked') : 'unchecked';
                        return React.createElement("span", { key: c, title: colWord(st), style: colChip(st) }, c);
                    })))); }),
                React.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', color: textSub, marginBottom: '12px' } },
                    React.createElement("span", null,
                        React.createElement("span", { style: colChip('present') }, L('green', 'verde')),
                        " ",
                        L('there', 'esta')),
                    React.createElement("span", null,
                        React.createElement("span", { style: colChip('missing') }, L('red', 'rojo')),
                        " ",
                        L('missing', 'falta')),
                    React.createElement("span", null,
                        React.createElement("span", { style: colChip('unchecked') }, L('gray', 'gris')),
                        " ",
                        L('not checked', 'sin revisar')),
                    selectedResult && selectedResult.colSource === 'row' && (React.createElement("span", null, L('Columns read from one row: a gray column may still be there.', 'Columnas leidas de una fila: una columna gris aun puede existir.')))),
                selectedResult && selectedResult.similar && Object.keys(selectedResult.similar).length > 0 && (React.createElement("div", { style: { padding: '10px 12px', borderRadius: '6px', background: bgSub, border: '1px solid ' + borderCol, fontSize: '12px', marginBottom: '12px' } },
                    React.createElement("strong", null, L('Columns with a similar name in Dataverse:', 'Columnas con nombre parecido en Dataverse:')),
                    Object.keys(selectedResult.similar).map(function (c) { return (React.createElement("div", { key: c, style: { fontFamily: 'Consolas, monospace', marginTop: '3px', wordBreak: 'break-word' } },
                        c,
                        " ",
                        '=>',
                        " ",
                        selectedResult.similar[c].join(', '))); }))),
                selectedResult && selectedResult.error && (React.createElement("div", { style: { padding: '10px 12px', borderRadius: '6px', background: TONES.red.bg, color: TONES.red.fg, fontSize: '12px', fontFamily: 'Consolas, monospace', marginBottom: '12px', wordBreak: 'break-word' } },
                    L('What Dataverse said: ', 'Lo que dijo Dataverse: '),
                    selectedResult.error)),
                selectedResult && selectedResult.state === 'found' && (React.createElement("div", { style: { background: bgSub, padding: '12px', borderRadius: '6px', border: '1px solid ' + borderCol, marginBottom: '12px' } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
                        React.createElement("div", { style: { fontSize: '13px', fontWeight: 600 } }, L('Filled values per column', 'Valores llenos por columna')),
                        React.createElement("button", { type: "button", disabled: !!fillBusy, onClick: function () { return countFilled(selectedSpec, selectedResult); }, style: __assign(__assign({}, btn(false)), { padding: '5px 10px', fontSize: '12px' }) }, fillBusy === selectedSpec.logicalName ? L('Counting...', 'Contando...') : L('Count filled values', 'Contar valores llenos'))),
                    React.createElement("div", { style: { fontSize: '11px', color: textSub, marginTop: '4px' } }, L('How many rows have something in each column. Counts only; no values are read. It also goes in the printout.', 'Cuantas filas tienen algo en cada columna. Solo conteos; no se leen valores. Tambien va en el reporte.')),
                    fillCounts[selectedSpec.logicalName] && (React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' } }, Object.keys(fillCounts[selectedSpec.logicalName].cols).map(function (c) {
                        var f = fillCounts[selectedSpec.logicalName].cols[c];
                        var total = fillCounts[selectedSpec.logicalName].total;
                        var tone = !f || !f.ok ? 'gray' : (f.count === 0 ? 'red' : (total != null && f.count < total ? 'amber' : 'green'));
                        return React.createElement("span", { key: c, title: f && !f.ok ? f.err : '', style: __assign(__assign({}, colChip('present')), { background: TONES[tone].bg, color: TONES[tone].fg }) },
                            c,
                            ": ",
                            f && f.ok ? f.count.toLocaleString() + (f.capped ? '+' : '') : '?',
                            total != null ? ' / ' + total.toLocaleString() : '');
                    }))))),
                selectedSpec.keys.length > 0 && (React.createElement("div", { style: { background: bgSub, padding: '12px', borderRadius: '6px', border: '1px solid ' + borderCol, marginBottom: '12px' } },
                    React.createElement("div", { style: { fontSize: '13px', fontWeight: 600, marginBottom: '8px' } }, L('Keys that must match other tables', 'Claves que deben coincidir con otras tablas')),
                    selectedSpec.keys.map(function (k) { return (React.createElement("div", { key: k.column, style: { fontSize: '12px', fontFamily: 'Consolas, monospace', marginBottom: '3px', wordBreak: 'break-word' } },
                        k.column,
                        " (",
                        k.kind,
                        ") ",
                        '=>',
                        " ",
                        k.mustMatch)); }),
                    React.createElement("div", { style: { fontSize: '11px', color: textSub, marginTop: '6px' } }, L('Checking the values themselves comes in v2.3.', 'La revision de los valores llega en v2.3.')))),
                React.createElement("div", { style: { fontSize: '12px', color: textSub } },
                    React.createElement("strong", null, L('Note:', 'Nota:')),
                    " ",
                    selectedSpec.notes)))),
        activeTab === 'printout' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' } },
                React.createElement("div", null,
                    React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, L('Printout for a bug-hunting thread', 'Reporte para un hilo de busqueda de errores')),
                    React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px' } }, L('Table states, row counts, column names and errors. No row values, names or PINs are ever included.', 'Estados, conteos, nombres de columnas y errores. Nunca incluye valores de filas, nombres ni PIN.'))),
                React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                    React.createElement("button", { type: "button", onClick: function () { return setPrintoutMode('problems'); }, style: btn(printoutMode === 'problems') }, L('Problems only', 'Solo problemas')),
                    React.createElement("button", { type: "button", onClick: function () { return setPrintoutMode('full'); }, style: btn(printoutMode === 'full') }, L('Every table', 'Todas las tablas')),
                    React.createElement("button", { type: "button", onClick: function () { return copyText(printoutText, L('the printout', 'el reporte')); }, style: btn(true, '#059669') }, L('Copy printout', 'Copiar reporte')))),
            React.createElement("textarea", { readOnly: true, value: printoutText, style: { width: '100%', boxSizing: 'border-box', height: '540px', background: '#0f172a', color: '#a7f3d0', border: '1px solid ' + borderCol, borderRadius: '6px', padding: '12px', fontFamily: 'Consolas, monospace', fontSize: '12px' } }))),
        activeTab === 'bridges' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' } },
                React.createElement("div", null,
                    React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, L('Browser storage the apps share', 'Almacenamiento del navegador que comparten las apps')),
                    React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px' } }, L('Read only. This page never changes another app\'s saved data. It only sees keys saved by apps opened in this same browser and site.', 'Solo lectura. Esta pagina nunca cambia los datos guardados de otra app. Solo ve claves guardadas por apps abiertas en este mismo navegador y sitio.'))),
                React.createElement("button", { type: "button", onClick: refreshStorage, style: btn(false) }, L('Look again', 'Revisar de nuevo'))),
            React.createElement("div", { style: { display: 'grid', gap: '12px' } }, storageState.map(function (b) {
                var tone = b.status === 'ok' ? 'green' : (b.status === 'empty' ? 'gray' : (b.status === 'bad' ? 'red' : 'amber'));
                var word = b.status === 'ok' ? L('Readable', 'Legible') : (b.status === 'empty' ? L('Nothing saved here', 'Nada guardado aqui') : (b.status === 'bad' ? L('Broken JSON', 'JSON danado') : L('Needs a look', 'Revisar')));
                var issue = '';
                if (b.issue && b.issue.indexOf('stale:') === 0)
                    issue = L(b.issue.slice(6) + ' ended or archived board(s) still saved. Shift Start or Ganttly should drop them.', b.issue.slice(6) + ' tablero(s) terminados o archivados siguen guardados. Shift Start o Ganttly deberian quitarlos.');
                else if (b.issue === 'onekey')
                    issue = L('Only one of "items" / "assets" is saved; MSS Log Input and MSS Calendar each read a different one.', 'Solo se guardo "items" o "assets"; MSS Log Input y MSS Calendar leen uno distinto cada uno.');
                else if (b.issue === 'json')
                    issue = L('The saved value is not valid JSON; the app that wrote it should overwrite it on its next save.', 'El valor guardado no es JSON valido; la app que lo escribio deberia reemplazarlo al guardar.');
                return (React.createElement("div", { key: b.key, style: { background: bgSub, padding: '14px', borderRadius: '6px', border: '1px solid ' + borderCol } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' } },
                        React.createElement("div", { style: { fontFamily: 'Consolas, monospace', fontSize: '13px', fontWeight: 700, color: '#0284c7', wordBreak: 'break-all' } },
                            b.store,
                            ": ",
                            b.key),
                        React.createElement("span", { style: pill(tone) },
                            word,
                            b.detail ? ' - ' + b.detail : '')),
                    React.createElement("div", { style: { fontSize: '12px', marginBottom: '4px' } },
                        React.createElement("strong", null, L('Written by:', 'Escrito por:')),
                        " ",
                        b.writers.join(', '),
                        " - ",
                        React.createElement("strong", null, L('Read by:', 'Leido por:')),
                        " ",
                        b.readers.join(', ')),
                    React.createElement("div", { style: { fontSize: '12px', color: textSub } }, b.contract),
                    issue && React.createElement("div", { style: { marginTop: '6px', fontSize: '12px', color: '#d97706', fontWeight: 600 } }, issue)));
            })))),
        activeTab === 'apps' && (React.createElement("div", null,
            React.createElement(HistoryPanel, { days: history.days, note: history.note, bgCard: bgCard, borderCol: borderCol, textSub: textSub }),
            React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' } }, ECOSYSTEM_APPS.map(function (app) {
                var appTables = ECOSYSTEM_TABLES.filter(function (t) { return t.usedBy.indexOf(app.id) !== -1; });
                var h = appHealth[app.id];
                var dot = { green: '#16a34a', amber: '#d97706', red: '#dc2626', gray: '#9ca3af' }[h.tone];
                return (React.createElement("div", { key: app.id, style: { background: bgCard, padding: '16px', borderRadius: '8px', border: '1px solid ' + borderCol } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement("span", { title: h.tone, style: { width: '12px', height: '12px', borderRadius: '50%', background: dot, flexShrink: 0 } }),
                        React.createElement("h3", { style: { margin: 0, fontSize: '16px' } }, app.name)),
                    React.createElement("div", { style: { fontSize: '12px', color: h.tone === 'red' ? TONES.red.fg : (h.tone === 'amber' ? TONES.amber.fg : textSub), marginTop: '6px' } }, h.reasons.join('; ')),
                    React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '6px', marginBottom: '10px' } }, L('Writes ', 'Escribe ') + appTables.filter(function (t) { return t.writers.map(appIdOf).indexOf(app.id) !== -1; }).length + L(' table(s), reads ', ' tabla(s), lee ') + appTables.filter(function (t) { return t.readers.map(appIdOf).indexOf(app.id) !== -1; }).length),
                    React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }, appTables.map(function (t) {
                        var v = verdicts[t.logicalName];
                        return (React.createElement("span", { key: t.logicalName, onClick: function () { setSelectedTable(t.logicalName); setActiveTab('audit'); }, title: verdictText(v, lang), style: __assign(__assign({}, pill(v.tone)), { fontFamily: 'Consolas, monospace', fontWeight: 600, cursor: 'pointer', borderRadius: '4px' }) }, t.logicalName));
                    }))));
            })))),
        activeTab === 'manifests' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, L('Hub config (shared settings)', 'Hub config (configuracion compartida)')),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, L('Every row in ' + ((manifests && manifests.table) || 'Hub config') + ' is checked (the new craa5___1_e_hubconfig when it exists, else craa5___1_e_hubconfig): its key is on the contract list and written by the right app, it is there only once, its text is valid JSON, and it fits the column. Values are never shown or copied. The table itself (columns, row count) is checked in the Tables tab like every other table.', 'Se revisa cada fila de ' + ((manifests && manifests.table) || 'Hub config') + ' (la nueva craa5___1_e_hubconfig si existe, si no craa5___1_e_hubconfig): su clave esta en la lista del contrato y la escribe la app correcta, esta una sola vez, su texto es JSON valido y cabe en la columna. Los valores nunca se muestran ni se copian. La tabla misma (columnas, filas) se revisa en la pestana Tablas como las demas.')),
            manifests && manifests.state === 'ok' && manifests.maxLen != null && manifests.maxLen < 10000 && manifests.manifestCol !== true && (React.createElement("div", { style: { fontSize: '13px', color: TONES.amber.fg, background: TONES.amber.bg, padding: '10px 12px', borderRadius: '6px', marginBottom: '14px' } },
                React.createElement("b", null, L('To do: add the Manifest json column. ', 'Pendiente: agregue la columna Manifest json. ')),
                L('Config json holds only ' + manifests.maxLen.toLocaleString() + ' characters, too small for the app lists (up to about 8,000). Do not change Config json. In Tables - hubconfig - New - Column add: Display name Manifest json, type Multiple lines of text, Maximum character count 100000 (set it while creating). Apps use it by themselves once it is there.', 'Config json solo acepta ' + manifests.maxLen.toLocaleString() + ' caracteres, muy poco para las listas de las apps (hasta unos 8,000). No cambie Config json. En Tablas - hubconfig - Nueva - Columna agregue: Nombre Manifest json, tipo Varias lineas de texto, Cantidad maxima de caracteres 100000 (al crearla). Las apps la usan solas una vez que existe.'))),
            manifests && manifests.state === 'ok' && manifests.manifestCol === true && (React.createElement("div", { style: { fontSize: '12px', color: textSub, marginBottom: '10px' } },
                L('Manifest json column is there', 'La columna Manifest json existe') + (manifests.mMaxLen != null ? L(' (holds up to ', ' (acepta hasta ') + manifests.mMaxLen.toLocaleString() + ')' : '') + L('; app lists are read from it, and from Config json for rows without it.', '; las listas se leen de ahi, y de Config json en filas sin ella.'),
                manifests.mMaxLen != null && manifests.mMaxLen < 10000 && React.createElement("span", { style: { color: TONES.amber.fg } }, L(' It is too short: it needs 100000.', ' Es muy corta: necesita 100000.')))),
            manifests && manifests.newNeedsKey && (React.createElement("div", { style: { fontSize: '13px', color: TONES.red.fg, background: TONES.red.bg, padding: '10px 12px', borderRadius: '6px', marginBottom: '14px' } },
                React.createElement("b", null, "To do: add the Config key column to the new Hub config table. "),
                'craa5___1_e_hubconfig is there but has no Config key column (craa5_configkey), so no app can find its settings in it and everything still runs from the old craa5___1_e_hubconfig. In Tables - _e_ Hub config - New - Column add: Display name Config key, type Single line of text, Maximum character count 200. Then press Run check again.')),
            manifests && manifests.readNotes && manifests.readNotes.length > 0 && (React.createElement("div", { style: { fontSize: '12px', color: TONES.amber.fg, marginBottom: '10px' } }, L('Could not use: ', '') + manifests.readNotes.join('; '))),
            manifests && manifests.hub && (function () {
                var hub = manifests.hub;
                var issueText = function (i) { return ({ blankkey: L('blank key', 'clave vacia'), dupkey: L('key saved more than once (apps may read the wrong one)', 'clave guardada mas de una vez (las apps pueden leer la equivocada)'), badjson: L('text is not valid JSON (the app cannot read it)', 'el texto no es JSON valido (la app no lo puede leer)'), cutoff: L('text was cut off at the column limit; raise the maximum length', 'el texto se corto en el limite de la columna; suba la longitud maxima'), emptyjson: L('no text saved', 'sin texto guardado'), keyinname: L('the key is in the Name column, not in Config key (apps look for it in Config key)', 'la clave esta en la columna Nombre, no en Config key (las apps la buscan en Config key)'), nearlimit: L('within 10% of the column limit', 'a menos del 10% del limite de la columna'), unknownapp: L('manifest for an app the contract does not know', 'manifiesto de una app que el contrato no conoce'), appmismatch: L('appId inside does not match the key', 'el appId de adentro no coincide con la clave'), mbadjson: L('Manifest json is not valid JSON', 'Manifest json no es JSON valido'), mcutoff: L('Manifest json was cut off at its column limit', 'Manifest json se corto en el limite de su columna'), mnearlimit: L('Manifest json within 10% of its column limit', 'Manifest json a menos del 10% del limite de su columna') }[i] || i); };
                var warnText = function (x) { return x.warnings.map(function (w) { return ({ pointeronly: L(' - holds only a pointer to Manifest json, which is empty or missing', ''), twowriters: L(' - two apps write this key; the contract thread will pick one owner', ''), emptyjson: L(' - no JSON yet, waiting for the app to save', ''), keyinname: L(' - the key is only in Config name (old row); apps still find it, but fill Config key too', '') }[w] || ' - ' + w); }).join(''); };
                var appName = function (a) { return APP_WRITER_NAMES[a] || a; };
                var stateTone = { saved: 'green', notyet: 'gray', problem: 'red', warn: 'amber' };
                var stateWord = { saved: L('saved', 'guardada'), notyet: L('not saved yet', 'aun no guardada'), problem: L('needs a fix', 'por corregir'), warn: L('there (see note)', 'ver nota') };
                var statusWord = { planned: L('planned', 'planeada'), inuse: L('in use today', 'en uso hoy'), legacy: L('old, not used', 'vieja, sin uso'), unknown: L('owner unknown', 'dueno desconocido'), manifest: '' };
                return (React.createElement("div", { style: { marginBottom: '18px' } },
                    React.createElement("div", { style: { fontSize: '14px', fontWeight: 700, marginBottom: '6px' } }, L('Keys the apps need', 'Claves que necesitan las apps')),
                    manifests.table === 'craa5___1_e_hubconfig' && (React.createElement("div", { style: { fontSize: '13px', color: TONES.amber.fg, background: TONES.amber.bg, padding: '10px 12px', borderRadius: '6px', marginBottom: '10px' } }, L('The new table _e_ Hub config (craa5___1_e_hubconfig) was not found, so this is the old table. Make the new table first (table-prompts.md part 8), then add these keys there.', ''))),
                    (function () {
                        var toAdd = hub.expected.filter(function (e) { return e.kind === 'setting' && e.state === 'notyet' && e.status !== 'legacy' && e.status !== 'unknown'; });
                        return (React.createElement("div", { style: { marginBottom: '12px' } },
                            React.createElement("div", { style: { fontSize: '12px', color: textSub, marginBottom: '8px' } }, L('Each settings key is one row in ' + manifests.table + '. Fill two columns with the key exactly as shown (upper and lower case matter): Config key (craa5_configkey) and Config name (craa5_configname). Leave Config json (craa5_configjson) empty: the app named on the row fills it the next time it saves. App lists (manifest|...) and code scans (scan|...) are added by the apps and by this page, never by hand.', '')),
                            toAdd.length > 0 && manifests.table !== 'craa5___1_e_hubconfig' && (React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' } },
                                React.createElement("button", { type: "button", disabled: !!keyAdd && /^Adding/.test(keyAdd), onClick: function () { return addKeyRows(toAdd.map(function (e) { return e.key; })); }, style: btn(true, '#059669') }, L('Add the ' + toAdd.length + ' missing rows for me', '')),
                                keyAdd && React.createElement("span", { style: { fontSize: '12px', color: /Failed/.test(keyAdd) ? TONES.red.fg : textSub } }, keyAdd))),
                            React.createElement("div", { style: { overflowX: 'auto' } },
                                React.createElement("table", { style: { borderCollapse: 'collapse', fontSize: '12px', width: '100%', minWidth: '560px' } },
                                    React.createElement("thead", null,
                                        React.createElement("tr", { style: { textAlign: 'left', color: textSub } }, ['Config key and Config name', 'Config json', 'Filled by', 'What it holds', 'In ' + manifests.table].map(function (h) { return React.createElement("th", { key: h, style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, fontWeight: 600 } }, h); }))),
                                    React.createElement("tbody", null, hub.expected.filter(function (e) { return e.kind === 'setting'; }).map(function (e) { return (React.createElement("tr", { key: e.key },
                                        React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, fontFamily: 'Consolas, monospace', wordBreak: 'break-word' } },
                                            e.key,
                                            React.createElement("button", { type: "button", onClick: function () { return copyText(e.key, e.key); }, style: { marginLeft: '6px', padding: '1px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid ' + borderCol, background: bgSub, color: textMain, cursor: 'pointer' } }, L('copy', ''))),
                                        React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, color: textSub } }, L('leave empty', '')),
                                        React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol } }, appName(e.app) + (e.otherWriters.length ? ' + ' + e.otherWriters.map(appName).join(', ') : '')),
                                        React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, color: textSub } }, (statusWord[e.status] ? statusWord[e.status] + '. ' : '') + e.note),
                                        React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol } },
                                            React.createElement("span", { style: pill(stateTone[e.state]) }, stateWord[e.state]),
                                            manifests.oldKeys && manifests.oldKeys.indexOf(e.key) !== -1 && React.createElement("span", { style: { color: textSub } }, L(' (also on the old table)', ''))))); })))),
                            React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '8px' } }, L('App lists: ', '') + hub.expected.filter(function (e) { return e.kind === 'manifest'; }).map(function (e) { return e.key + ' ' + (e.state === 'notyet' ? '(not yet)' : '(' + stateWord[e.state] + ')'); }).join(', '))));
                    })(),
                    React.createElement("div", { style: { fontSize: '14px', fontWeight: 700, margin: '14px 0 6px' } }, L('Every row', 'Todas las filas') + ' (' + hub.rows.length + ')'),
                    hub.rows.length === 0 && React.createElement("div", { style: { fontSize: '13px', color: textSub } }, L('Hub config has no rows yet.', 'Hub config aun no tiene filas.')),
                    React.createElement("div", { style: { display: 'grid', gap: '4px' } }, hub.rows.map(function (x, i) { return (React.createElement("div", { key: x.key + '-' + i, style: { fontSize: '12px', fontFamily: 'Consolas, monospace', wordBreak: 'break-word', color: x.issues.length ? textMain : textSub } },
                        (x.key || L('(blank key', '(clave vacia') + (x.name ? L(', name "', ', nombre "') + x.name + '"' : '') + ')') + ' - ' + x.len.toLocaleString() + L(' chars', ' caracteres') + (x.json === 'ok' ? ' - JSON ok' : '') + (x.stub ? L(' (pointer)', ' (enlace)') : '') + (x.mLen ? ' - Manifest json ' + x.mLen.toLocaleString() + L(' chars', ' caracteres') + (x.mjson === 'ok' ? ' - JSON ok' : '') : ''),
                        x.kind === 'legacy' && React.createElement("span", { style: { color: textSub } }, L(' - old key, no app uses it (safe to leave)', ' - clave vieja, ninguna app la usa (se puede dejar)')),
                        x.warnings.length > 0 && !x.issues.length && React.createElement("span", { style: { color: TONES.amber.fg } }, warnText(x)),
                        x.kind === 'unlisted' && x.key && React.createElement("span", { style: { color: TONES.amber.fg } }, L(' - not on the contract list (tell the contract thread)', ' - no esta en la lista del contrato (avise al hilo del contrato)')),
                        x.issues.length > 0 && React.createElement("span", { style: { color: TONES.red.fg } }, ' - ' + x.issues.map(issueText).join('; ')))); })),
                    hub.claims.length > 0 && (React.createElement("div", { style: { marginTop: '10px' } }, hub.claims.map(function (c) { return (React.createElement("div", { key: c.appId + c.key, style: { fontSize: '12px', color: TONES.red.fg } }, appName(c.appId) + L(' says it writes ', ' dice que escribe ') + c.key + ': ' + (c.issue === 'otherapp' ? L('that key belongs to ', 'esa clave es de ') + appName(c.owner) : L('the contract does not list that key', 'el contrato no lista esa clave')))); })))));
            })(),
            React.createElement("div", { style: { fontSize: '14px', fontWeight: 700, marginBottom: '4px' } }, L('App manifests: what each app says it needs', 'Manifiestos: lo que cada app dice que necesita')),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, L('Each app saves a short list of the tables and columns it reads and writes (its manifest) in Hub config when its version changes. This tab checks every list against Dataverse, so a new app version is checked without changing this page.', 'Cada app guarda una lista corta de las tablas y columnas que lee y escribe (su manifiesto) en Hub config cuando cambia de version. Esta pestana revisa cada lista contra Dataverse, asi una version nueva se revisa sin cambiar esta pagina.')),
            !manifests && React.createElement("div", { style: { fontSize: '13px', color: textSub } }, L('Run a check first.', 'Primero haga una revision.')),
            manifests && manifests.state !== 'ok' && (React.createElement("div", { style: { fontSize: '13px', color: TONES.amber.fg } },
                manifests.state === 'missing' ? L('The Hub config table was not found.', 'No se encontro la tabla Hub config.') : (manifests.state === 'denied' ? L('Your role cannot read Hub config.', 'Su rol no puede leer Hub config.') : L('Could not read Hub config.', 'No se pudo leer Hub config.')),
                manifests.err ? ' (' + manifests.err + ')' : '')),
            manifests && manifests.state === 'ok' && (React.createElement("div", null,
                React.createElement("div", { style: { fontSize: '12px', color: textSub, marginBottom: '10px' } }, L('Read from ', 'Leido de ') + manifests.table + ' - ' + L('config text column holds up to ', 'la columna de texto acepta hasta ') + (manifests.maxLen != null ? manifests.maxLen.toLocaleString() : L('(could not tell)', '(no se pudo saber)')) + L(' characters', ' caracteres') + (manifests.ownership ? ' - ' + L('owner type: ', 'tipo de propietario: ') + manifests.ownership : '')),
                manifests.ownership === 'UserOwned' && (React.createElement("div", { style: { fontSize: '12px', color: textSub, marginBottom: '10px' } }, L('Hub config is User-owned: every hub role needs Read at Organization level, and Write at Organization level for a newer app version to replace a manifest someone else saved.', 'Hub config es de propiedad de usuario: cada rol del hub necesita Leer a nivel Organizacion, y Escribir a nivel Organizacion para que una version nueva reemplace un manifiesto que guardo otra persona.'))),
                manifests.apps.length === 0 && (React.createElement("div", { style: { fontSize: '13px', color: textSub } }, L('No app has saved a manifest yet. Ganttly will be the first.', 'Ninguna app ha guardado un manifiesto todavia. Ganttly sera la primera.'))),
                React.createElement("div", { style: { display: 'grid', gap: '12px' } }, manifests.apps.map(function (a) {
                    var c = a.check;
                    var tone = a.error ? 'red' : (a.stub ? 'amber' : (c && c.problems ? 'amber' : (c && c.unsure ? 'gray' : 'green')));
                    var word = a.error ? L('Unreadable list', 'Lista ilegible') : a.stub ? L('List not readable here (pointer only)', 'Lista no legible aqui (solo enlace)') : (c && c.problems ? c.problems + L(' table(s) need a look', ' tabla(s) por revisar') : (c && c.unsure ? L('Some columns not checked', 'Algunas columnas sin revisar') : L('Everything it needs is there', 'Todo lo que necesita existe')));
                    return (React.createElement("div", { key: a.key, style: { background: bgSub, padding: '14px', borderRadius: '6px', border: '1px solid ' + borderCol } },
                        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' } },
                            React.createElement("div", null,
                                React.createElement("div", { style: { fontSize: '14px', fontWeight: 700 } },
                                    a.app,
                                    a.version ? ' ' + a.version : '',
                                    a.fromScan ? L(' (from a code scan)', ' (de un escaneo de codigo)') : ''),
                                React.createElement("div", { style: { fontSize: '11px', color: textSub } },
                                    L('Saved ', 'Guardado ') + (a.savedAt ? new Date(a.savedAt).toLocaleString() : (a.modifiedOn ? new Date(a.modifiedOn).toLocaleString() : '?')),
                                    a.contract ? ' - ' + L('uses HUB SHARED ', '') + a.contract : '')),
                            React.createElement("span", { style: pill(tone) }, word)),
                        a.error && React.createElement("div", { style: { fontSize: '12px', color: TONES.red.fg } }, a.error),
                        a.stub && React.createElement("div", { style: { fontSize: '12px', color: TONES.amber.fg } }, L('The app saved its list in ' + a.pointer + ', which is empty or not on the table. Add the Manifest json column (see the note at the top); the app fills it the next time it opens.', 'La app guardo su lista en ' + a.pointer + ', que esta vacia o no existe en la tabla. Agregue la columna Manifest json (vea la nota arriba); la app la llena la proxima vez que abra.')),
                        !a.stub && !a.error && a.source === 'craa5_manifestjson' && React.createElement("div", { style: { fontSize: '11px', color: textSub } }, L('Read from Manifest json', 'Leido de Manifest json')),
                        c && c.tables.map(function (t) {
                            var ok = t.state === 'found' && !t.missingRead.length && !t.missingWrite.length && !t.unchecked.length && !t.contractNotes.length;
                            var noteText = function (n) { return (n === 'notincontract' ? L('not in the contract', 'no esta en el contrato') : (n === 'notwriter' ? L('writes here but the contract does not list it as a writer', 'escribe aqui pero el contrato no la lista como escritora') : (n === 'status:abandoned' ? L('table is abandoned in the contract', 'tabla abandonada en el contrato') : (n === 'status:absent' ? L('table is absent in the contract', 'tabla ausente en el contrato') : n)))); };
                            return (React.createElement("div", { key: t.t, style: { fontSize: '12px', fontFamily: 'Consolas, monospace', marginTop: '3px', wordBreak: 'break-word', color: ok ? textSub : textMain } },
                                t.t,
                                t.foundAs && t.foundAs !== t.t ? ' (' + L('as ', 'como ') + t.foundAs + ')' : '',
                                ": ",
                                t.state === 'found' ? (ok ? L('ok', 'ok') : '') : (t.state === 'missing' ? L('TABLE MISSING', 'FALTA LA TABLA') : (t.state === 'denied' ? L('no permission', 'sin permiso') : L('could not tell', 'no se pudo saber'))),
                                t.missingWrite.length > 0 && React.createElement("span", { style: { color: TONES.red.fg } }, L(' missing (writes): ', ' faltan (escribe): ') + t.missingWrite.join(', ')),
                                t.missingRead.length > 0 && React.createElement("span", { style: { color: TONES.amber.fg } }, L(' missing (reads): ', ' faltan (lee): ') + t.missingRead.join(', ')),
                                t.unchecked.length > 0 && React.createElement("span", { style: { color: textSub } }, L(' not checked: ', ' sin revisar: ') + t.unchecked.join(', ')),
                                t.notYet.length > 0 && React.createElement("span", { style: { color: textSub } }, L(' not yet (app works without): ', ' aun no (la app funciona sin ellas): ') + t.notYet.join(', ')),
                                t.contractNotes.length > 0 && React.createElement("span", { style: { color: TONES.amber.fg } }, ' - ' + t.contractNotes.map(noteText).join('; ') + (t.notAllowed ? ': ' + t.notAllowed.join(', ') : ''))));
                        })));
                })))))),
        activeTab === 'scancode' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, L('Scan an app\'s code', 'Escanear el codigo de una app')),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, L('Paste an app\'s code (or load its .txt file). The monitor finds every craa5 table and column the code names, checks them in Dataverse, and writes one short Copilot prompt per missing table. Save the scan and every later check watches that app, with no change to this page. Only table and column names are saved, never the code. Columns the code names that no table has are given to the nearest table in the code: that part is a guess, check it before you make the column.', 'Pegue el codigo de una app (o cargue su archivo .txt). El monitor encuentra cada tabla y columna craa5 que nombra el codigo, las revisa en Dataverse y escribe un prompt corto de Copilot por cada tabla que falta. Guarde el escaneo y cada revision siguiente vigila esa app, sin cambiar esta pagina. Solo se guardan nombres de tablas y columnas, nunca el codigo. Las columnas que ninguna tabla tiene se asignan a la tabla mas cercana en el codigo: eso es una suposicion, revisela antes de crear la columna.')),
            React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' } },
                React.createElement("select", { value: scanApp, onChange: function (e) { return setScanApp(e.target.value); }, style: { padding: '7px 10px', borderRadius: '6px', background: bgSub, color: textMain, border: '1px solid ' + borderCol, fontSize: '13px', maxWidth: '100%' } },
                    React.createElement("option", { value: "" }, L('Which app is this?', 'Que app es?')),
                    CONTRACT_APP_IDS.map(function (a) { return React.createElement("option", { key: a, value: a }, APP_WRITER_NAMES[a] || a); }),
                    React.createElement("option", { value: "other" }, L('Other (type a name)', 'Otra (escriba un nombre)'))),
                scanApp === 'other' && React.createElement("input", { value: scanOther, onChange: function (e) { return setScanOther(e.target.value); }, placeholder: L('App name', 'Nombre de la app'), style: { padding: '7px 10px', borderRadius: '6px', background: bgSub, color: textMain, border: '1px solid ' + borderCol, fontSize: '13px', minWidth: 0 } }),
                React.createElement("input", { type: "file", accept: ".txt,.js,.jsx,.ts,.tsx,.html", onChange: function (e) { var f = e.target.files && e.target.files[0]; if (!f)
                        return; var fr = new FileReader(); fr.onload = function () { return setScanCode(String(fr.result || '')); }; fr.readAsText(f); }, style: { fontSize: '12px', color: textSub, maxWidth: '100%' } })),
            React.createElement("textarea", { value: scanCode, onChange: function (e) { return setScanCode(e.target.value); }, placeholder: L('Paste the app code here', 'Pegue aqui el codigo de la app'), style: { width: '100%', boxSizing: 'border-box', height: '140px', background: bgSub, color: textMain, border: '1px solid ' + borderCol, borderRadius: '6px', padding: '10px', fontFamily: 'Consolas, monospace', fontSize: '12px' } }),
            React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'center' } },
                React.createElement("button", { type: "button", disabled: !scanCode.trim() || scanBusy, onClick: runCodeScan, style: btn(true) }, scanBusy ? L('Scanning...', 'Escaneando...') : L('Scan code', 'Escanear codigo')),
                scanResult && React.createElement("button", { type: "button", disabled: !scanAppId || !manifests || !manifests.table, onClick: saveCodeScan, style: btn(true, '#059669') }, L('Save scan so every check watches this app', 'Guardar para que cada revision vigile esta app')),
                scanResult && !scanAppId && React.createElement("span", { style: { fontSize: '12px', color: TONES.amber.fg } }, L('Pick the app first.', 'Primero elija la app.')),
                scanSaved && React.createElement("span", { style: { fontSize: '12px', color: /^(Could|No se)/.test(scanSaved) ? TONES.red.fg : textSub } }, scanSaved)),
            scanResult && (React.createElement("div", { style: { marginTop: '14px' } },
                React.createElement("div", { style: { fontSize: '13px', color: textSub, marginBottom: '8px' } }, L('Found ', 'Se encontraron ') + scanResult.tokenTables + L(' tables and ', ' tablas y ') + scanResult.tokenCols + L(' column names.', ' nombres de columna.')),
                React.createElement("div", { style: { display: 'grid', gap: '10px' } }, scanCards.map(function (c) {
                    var tone = c.state === 'missing' ? 'red' : (c.state === 'denied' ? 'purple' : (c.state === 'found' ? (c.missing.length ? 'amber' : 'green') : 'gray'));
                    var word = c.state === 'missing' ? L('Table missing', 'Falta la tabla') : (c.state === 'denied' ? L('No permission', 'Sin permiso') : (c.state === 'found' ? (c.missing.length ? c.missing.length + L(' column(s) missing', ' columna(s) faltan') : (c.checked ? L('Everything there', 'Todo existe') : L('Columns not checked', 'Columnas sin revisar'))) : L('Could not tell', 'No se pudo saber')));
                    return (React.createElement("div", { key: c.t, style: { background: bgSub, padding: '12px', borderRadius: '6px', border: '1px solid ' + borderCol } },
                        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
                            React.createElement("span", { style: { fontFamily: 'Consolas, monospace', fontSize: '13px', fontWeight: 700, wordBreak: 'break-word', minWidth: 0 } }, c.t),
                            React.createElement("span", { style: pill(TONES[tone] ? tone : 'gray') }, word)),
                        c.have.length > 0 && React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '4px', wordBreak: 'break-word' } }, L('There: ', 'Existen: ') + c.have.join(', ')),
                        c.missing.length > 0 && React.createElement("div", { style: { fontSize: '12px', color: TONES.amber.fg, marginTop: '4px', wordBreak: 'break-word' } }, (c.state === 'missing' ? L('Columns (guessed from the code): ', 'Columnas (adivinadas del codigo): ') : L('Missing (guessed, add by hand): ', 'Faltan (adivinadas, agregue a mano): ')) + c.missing.join(', ')),
                        c.text && React.createElement("button", { type: "button", onClick: function () { return copyText(c.text, L('the prompt', 'el prompt')); }, style: __assign(__assign({}, btn(true, '#059669')), { marginTop: '8px' }) },
                            L('Copy prompt', 'Copiar prompt'),
                            " (",
                            c.text.length,
                            " ",
                            L('chars', 'caracteres'),
                            ")")));
                })),
                scanResult.loose.length > 0 && React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '10px', wordBreak: 'break-word' } }, L('Names not placed on a table (could be settings keys or text): ', 'Nombres sin tabla (pueden ser claves o texto): ') + scanResult.loose.join(', ')))))),
        activeTab === 'copy' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, L('Copy one column into others', 'Copiar una columna a otras')),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, L('For one-time fills, like copying the old allergen clean flag into the new egg and pecan columns. Check first only reads and counts. Copy changes only the "to" columns, only where they differ, and skips rows where the "from" column is blank. This tab and saving a code scan are the only parts of the monitor that write to Dataverse.', 'Para llenados de una sola vez, como copiar la marca vieja de limpieza de alergeno a las columnas nuevas de huevo y nuez. Revisar solo lee y cuenta. Copiar cambia solo las columnas "a", solo donde son distintas, y salta filas donde la columna "de" esta vacia. Esta pestana y guardar un escaneo son las unicas partes del monitor que escriben en Dataverse.')),
            [[L('Table', 'Tabla'), copyTable, setCopyTable], [L('From column', 'De la columna'), copyFrom, setCopyFrom], [L('To columns (comma between)', 'A las columnas (separe con coma)'), copyTo, setCopyTo]].map(function (f) { return (React.createElement("label", { key: f[0], style: { display: 'block', fontSize: '12px', color: textSub, marginBottom: '8px' } },
                f[0],
                React.createElement("input", { value: f[1], onChange: function (e) { f[2](e.target.value); setCopyPlan(null); setCopyConfirm(false); }, style: { display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '3px', padding: '7px 10px', borderRadius: '6px', background: bgSub, color: textMain, border: '1px solid ' + borderCol, fontSize: '13px', fontFamily: 'Consolas, monospace' } }))); }),
            React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } },
                React.createElement("button", { type: "button", disabled: !!copyBusy, onClick: planCopy, style: btn(false) }, L('Check first', 'Revisar primero')),
                copyPlan && copyPlan.changes && copyPlan.changes.length > 0 && !copyConfirm && React.createElement("button", { type: "button", disabled: !!copyBusy, onClick: function () { return setCopyConfirm(true); }, style: btn(true, '#b45309') }, L('Copy to ', 'Copiar a ') + copyPlan.changes.length + L(' rows', ' filas')),
                copyPlan && copyPlan.changes && copyPlan.changes.length > 0 && copyConfirm && React.createElement("button", { type: "button", disabled: !!copyBusy, onClick: runCopy, style: btn(true, '#b91c1c') }, L('Yes, change ' + copyPlan.changes.length + ' rows in ' + copyPlan.table, 'Si, cambiar ' + copyPlan.changes.length + ' filas')),
                copyConfirm && React.createElement("button", { type: "button", onClick: function () { return setCopyConfirm(false); }, style: btn(false) }, L('Cancel', 'Cancelar')),
                copyBusy && React.createElement("span", { style: { fontSize: '12px', color: textSub } }, copyBusy)),
            copyPlan && copyPlan.err && React.createElement("div", { style: { fontSize: '13px', color: TONES.red.fg, marginTop: '10px' } }, copyPlan.err),
            copyPlan && copyPlan.changes && (React.createElement("div", { style: { fontSize: '13px', marginTop: '10px' } },
                copyPlan.total + L(' rows read. ', ' filas leidas. ') + copyPlan.changes.length + L(' will change. ', ' van a cambiar. ') + copyPlan.skippedBlank + L(' skipped because ', ' se saltan porque ') + copyPlan.from + L(' is blank.', ' esta vacia.'),
                copyPlan.cannot > 0 && React.createElement("span", { style: { color: TONES.amber.fg } }, ' ' + copyPlan.cannot + ' left out because the value does not fit the target column.'),
                Object.keys(copyPlan.types || {}).length > 0 && React.createElement("div", { style: { fontSize: '12px', color: textSub, marginTop: '4px' } }, 'Column types: ' + [copyPlan.from].concat(copyPlan.to).map(function (c) { return c + ' ' + (TYPE_WORDS[copyPlan.types[c]] || copyPlan.types[c] || 'unknown'); }).join(', ') + '.'),
                copyPlan.toFlag && copyPlan.toFlag.length > 0 && React.createElement("div", { style: { fontSize: '12px', color: TONES.amber.fg, marginTop: '4px' } }, copyPlan.toFlag.join(' and ') + (copyPlan.toFlag.length > 1 ? ' are' : ' is') + ' Yes/No, so it will be set to Yes where ' + copyPlan.from + ' is above 0 and No where it is 0. To copy the minutes themselves, copy into Whole number columns instead (for example craa5_eggminutes and craa5_pecanminutes).'),
                copyPlan.changes.length === 0 && React.createElement("span", { style: { color: TONES.green.fg } }, L(' Nothing to copy: the columns already match.', ' Nada que copiar: las columnas ya coinciden.')))),
            copyDone && (React.createElement("div", { style: { fontSize: '13px', marginTop: '10px', color: copyDone.failed.length ? TONES.red.fg : TONES.green.fg } }, L('Done: ', 'Listo: ') + (copyDone.done - copyDone.failed.length) + L(' rows changed', ' filas cambiadas') + (copyDone.failed.length ? L(', ', ', ') + copyDone.failed.length + L(' failed (first error: ', ' fallaron (primer error: ') + copyDone.failed[0] + ')' : '') + L('. Press Check first again to confirm.', '. Presione Revisar primero otra vez para confirmar.'))))),
        activeTab === 'security' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, "Security roles"),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, "Which roles can read (R), write (W) and create (C) each hub table, and how far: User = own rows only, BU = business unit, Org = everyone's rows. Read only. Needs a role that may read security roles (System Customizer or System Administrator); otherwise it says no permission."),
            React.createElement("button", { type: "button", disabled: roleBusy || !Object.keys(tableResults).length, onClick: readRoles, style: btn(true) }, roleBusy ? 'Reading...' : 'Read security roles'),
            roleData && roleData.state !== 'ok' && React.createElement("div", { style: { fontSize: '13px', color: TONES.amber.fg, marginTop: '10px' } }, (roleData.state === 'denied' ? 'Your role cannot read security roles. ' : 'Could not read security roles. ') + roleData.err),
            roleData && roleData.state === 'ok' && (React.createElement("div", { style: { marginTop: '12px' } },
                React.createElement("div", { style: { fontSize: '12px', color: textSub, marginBottom: '8px' } }, 'Your roles: ' + (roleData.mine.length ? roleData.mine.join(', ') : '(could not tell)') + '. Roles with hub table rights: ' + (roleData.hubRoles.length ? roleData.hubRoles.map(function (r) { return r.name; }).join(', ') : 'none yet, so only administrators can use the hub tables') + '.'),
                roleData.builtin.length > 0 && React.createElement("div", { style: { fontSize: '12px', color: textSub, marginBottom: '8px' } }, 'Left out (built into Dataverse, not used by hub staff): ' + roleData.builtin.join(', ') + '.'),
                roleData.findings.length > 0 && (React.createElement("div", { style: { marginBottom: '12px' } }, roleData.findings.map(function (f, i) { return (React.createElement("div", { key: i, style: { fontSize: '12px', marginBottom: '3px', color: f.kind === 'noread' ? TONES.red.fg : TONES.amber.fg } },
                    React.createElement("span", { style: { fontFamily: 'Consolas, monospace' } }, f.table),
                    f.kind === 'noread' ? ': no hub role can read it (only administrators see it)' : (f.kind === 'nowrite' ? ': no role can write or create rows, but an app saves here' : ': owned by user, and these roles read only their own rows, so they miss other people\'s: ' + f.roles.join(', ')))); }))),
                React.createElement("div", { style: { overflowX: 'auto' } },
                    React.createElement("table", { style: { borderCollapse: 'collapse', fontSize: '11px', minWidth: '100%' } },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", { style: { textAlign: 'left', padding: '4px 6px', borderBottom: '1px solid ' + borderCol, position: 'sticky', left: 0, background: bgCard } }, "Table"),
                                roleData.roles.filter(function (r) { return !dvIsBuiltinRole(r.name, r.managed); }).map(function (r) { return React.createElement("th", { key: r.id, style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, whiteSpace: 'nowrap', color: roleData.mine.indexOf(r.name) !== -1 ? '#60a5fa' : textMain } }, r.name); }))),
                        React.createElement("tbody", null, roleData.tables.map(function (t) { return (React.createElement("tr", { key: t.resolved },
                            React.createElement("td", { style: { padding: '3px 6px', borderBottom: '1px solid ' + borderCol, fontFamily: 'Consolas, monospace', position: 'sticky', left: 0, background: bgCard, whiteSpace: 'nowrap' } }, t.resolved),
                            roleData.roles.filter(function (r) { return !dvIsBuiltinRole(r.name, r.managed); }).map(function (r) {
                                var p = r.privs[t.resolved] || {};
                                var txt = ['Read', 'Write', 'Create'].filter(function (op) { return p[op]; }).map(function (op) { return op[0] + ':' + p[op]; }).join(' ');
                                return React.createElement("td", { key: r.id, style: { padding: '3px 6px', borderBottom: '1px solid ' + borderCol, whiteSpace: 'nowrap', color: txt ? textMain : textSub } }, txt || '-');
                            }))); })))))))),
        activeTab === 'build' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, "Build list"),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, "The monitor is the one table builder: apps only say what they need in their saved lists, and the contract decides each column's type. This list compares both with Dataverse and says what to make or change. The monitor never creates or changes anything in Dataverse: it reads what each app stores in Hub config, shows it here and tests it against Dataverse. You build. For a table to make, copy its prompt into the Copilot table maker (the app's own prompt when it sent one, else one written from the contract and app types). For a column to add, follow the steps (Copilot does not edit tables well). A type marked with ? is guessed from the column name: check it first, because Dataverse cannot change a column's type later. Press Make build list again afterwards to test."),
            React.createElement("button", { type: "button", disabled: !!buildBusy || !Object.keys(tableResults).length || !manifests, onClick: runBuildList, style: btn(true) }, buildBusy || 'Make build list'),
            buildItems && buildItems.length === 0 && React.createElement("div", { style: { fontSize: '13px', color: TONES.green.fg, marginTop: '12px' } }, "Nothing to build: every table and column the contract and the apps name is there with the right type."),
            buildItems && buildItems.length > 0 && (React.createElement("div", { style: { marginTop: '12px' } },
                React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' } }, Object.keys(BUILD_KIND_WORDS).filter(function (k) { return buildItems.some(function (b) { return b.kind === k; }); }).map(function (k) { return React.createElement("span", { key: k, style: pill(k === 'conflict' || k === 'type' ? 'red' : (k === 'unused' || k === 'unread' ? 'gray' : 'amber')) }, BUILD_KIND_WORDS[k] + ': ' + buildItems.filter(function (b) { return b.kind === k; }).length); })),
                Array.from(new Set(buildItems.map(function (b) { return b.t; }))).map(function (t) { return (React.createElement("div", { key: t, style: { background: bgSub, borderRadius: '6px', padding: '10px 12px', marginBottom: '8px', border: '1px solid ' + borderCol } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' } },
                        React.createElement("div", { style: { fontFamily: 'Consolas, monospace', fontSize: '13px', fontWeight: 700, wordBreak: 'break-word' } }, t),
                        (function () {
                            var cols = buildItems.filter(function (b) { return b.t === t && b.kind === 'column' && b.spec.source !== 'guess'; });
                            if (cols.length < 2)
                                return null;
                            return React.createElement("button", { type: "button", onClick: function () { return copyText(cols.map(function (b) { return dvColumnSteps(b.as || b.t, b.col, b.spec); }).join('\n'), 'the steps'); }, style: btn(false) }, 'Copy steps for ' + cols.length + ' typed columns');
                        })()),
                    buildItems.filter(function (b) { return b.t === t; }).map(function (b, i) { return (React.createElement("div", { key: i, style: { fontSize: '12px', marginBottom: '4px', wordBreak: 'break-word' } },
                        React.createElement("span", { style: pill(b.kind === 'conflict' || b.kind === 'type' ? 'red' : (b.kind === 'unused' || b.kind === 'unread' ? 'gray' : 'amber')) }, BUILD_KIND_WORDS[b.kind]),
                        b.col && React.createElement("span", { style: { fontFamily: 'Consolas, monospace' } }, ' ' + b.col),
                        React.createElement("span", { style: { color: textSub } }, ' ' + b.text),
                        b.kind === 'column' && i === buildItems.filter(function (x) { return x.t === t; }).findIndex(function (x) { return x.kind === 'column'; }) && (b.appPrompts || []).map(function (ap, k) { return React.createElement("div", { key: 'ap' + k, style: { margin: '2px 0 6px' } },
                            React.createElement("button", { type: "button", onClick: function () { return copyText(ap.text, 'the prompt'); }, style: __assign(__assign({}, btn(true, '#059669')), { padding: '3px 10px', fontSize: '12px' }) }, 'Copy ' + ap.app + "'s prompt for this table (" + ap.text.length + ' chars)')); }),
                        b.kind === 'column' && React.createElement("span", null,
                            ' ',
                            React.createElement("button", { type: "button", onClick: function () { return copyText(dvColumnSteps(b.as || b.t, b.col, b.spec), 'the steps'); }, style: __assign(__assign({}, btn(false)), { padding: '3px 10px', fontSize: '12px' }) }, "Copy steps")),
                        (b.kind === 'short' || b.kind === 'precision') && React.createElement("span", null,
                            ' ',
                            React.createElement("button", { type: "button", onClick: function () { return copyText(dvChangeSteps(b.as || b.t, b.col, b.spec, b.kind), 'the steps'); }, style: __assign(__assign({}, btn(false)), { padding: '3px 10px', fontSize: '12px' }) }, "Copy steps")),
                        b.kind === 'table' && React.createElement("span", null,
                            ' ',
                            React.createElement("button", { type: "button", onClick: function () { return setBuildOpen(buildOpen === b.t ? '' : b.t); }, style: __assign(__assign({}, btn(false)), { padding: '3px 10px', fontSize: '12px' }) }, buildOpen === b.t ? 'Hide prompt' : 'Show prompt')),
                        b.kind === 'table' && buildOpen === b.t && (function () {
                            var pr = dvTablePrompt(b);
                            return (React.createElement("div", { style: { marginTop: '6px' } },
                                b.appPrompts.map(function (ap, k) { return (React.createElement("div", { key: k, style: { marginBottom: '6px' } },
                                    React.createElement("button", { type: "button", onClick: function () { return copyText(ap.text, 'the prompt'); }, style: __assign(__assign({}, btn(true, '#059669')), { padding: '3px 10px', fontSize: '12px' }) }, 'Copy ' + ap.app + "'s prompt (" + ap.text.length + ' chars)'),
                                    React.createElement("div", { style: { fontFamily: 'Consolas, monospace', fontSize: '12px', marginTop: '4px', wordBreak: 'break-word' } }, ap.text))); }),
                                React.createElement("button", { type: "button", onClick: function () { return copyText(pr.text, 'the prompt'); }, style: __assign(__assign({}, btn(true, '#059669')), { padding: '3px 10px', fontSize: '12px' }) }, 'Copy prompt from the types (' + pr.text.length + ' chars)'),
                                React.createElement("div", { style: { fontFamily: 'Consolas, monospace', fontSize: '12px', marginTop: '4px', wordBreak: 'break-word' } }, pr.text),
                                pr.byHand.length > 0 && React.createElement("div", { style: { marginTop: '4px', color: TONES.amber.fg } }, 'Did not fit in 2,000 characters, add by hand after: ' + pr.byHand.map(function (c) { return dvColPhrase(c.col, c.spec); }).join(', ')),
                                pr.guessed.length > 0 && React.createElement("div", { style: { marginTop: '4px', color: TONES.amber.fg } }, 'No type given yet (left out of the prompt; check, then add by hand): ' + pr.guessed.map(function (c) { return c.col + ' (guess: ' + dvTypeWord(c.spec) + ')'; }).join(', '))));
                        })(),
                        b.kind === 'table' && React.createElement("div", { style: { marginTop: '4px', color: textSub } }, 'Name column ' + b.primary.n + ' (' + (b.primary.len || 200) + '). Columns: ' + b.cols.map(function (c) { return c.col + ' ' + dvTypeWord(c.spec) + (c.spec.source === 'guess' ? '?' : ''); }).join(', ')))); }))); }))))),
        activeTab === 'keys' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, "Key checks between apps"),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, "The contract says some columns must match another table (for example an asset's area name must be an area in the MSS area table). This counts the rows whose value is not found there. For places and things (areas, rooms, items, SAP work areas, vendors, equipment ids) up to 3 unmatched values are shown so you can tell typos from sample rows; values from people columns are never shown. A pair whose column has not been made yet says so instead of failing. Area and room names are compared ignoring case, spaces and punctuation; ids are compared exactly. Reads up to 20,000 rows per table."),
            React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
                React.createElement("button", { type: "button", disabled: !!keyBusy || !Object.keys(tableResults).length, onClick: runKeyChecks, style: btn(true) }, keyBusy || 'Check keys')),
            keyResults && (React.createElement("div", { style: { overflowX: 'auto', marginTop: '12px' } },
                React.createElement("table", { style: { borderCollapse: 'collapse', fontSize: '12px', width: '100%', minWidth: '600px' } },
                    React.createElement("thead", null,
                        React.createElement("tr", { style: { textAlign: 'left', color: textSub } }, ['Column', 'Must match', 'Rows', 'Blank', 'Not found', 'Result'].map(function (h) { return React.createElement("th", { key: h, style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, fontWeight: 600 } }, h); }))),
                    React.createElement("tbody", null, keyResults.map(function (k, i) {
                        var notMade = k.notMade && k.notMade.length;
                        var tone = notMade || k.err ? 'gray' : (k.bad ? 'amber' : (k.targetEmpty ? 'gray' : 'green'));
                        var word = notMade ? 'column not made yet' : (k.err ? 'could not read' : (k.bad ? k.bad + ' rows (' + k.badDistinct + ' values) not found' : (k.targetEmpty ? 'target empty' : 'all match')));
                        var extra = notMade ? ' ' + k.notMade.join(', ') : (k.err ? ' ' + k.err : ((k.examples && k.examples.length ? ' e.g. ' + k.examples.map(function (x) { return '"' + x + '"'; }).join(', ') : '') + (dvKeyLooksLikeSamples(k) ? ' (only a few: maybe the sample rows the Copilot table maker adds)' : '')));
                        return (React.createElement("tr", { key: i },
                            React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, fontFamily: 'Consolas, monospace', wordBreak: 'break-word' } }, k.from + '.' + k.col),
                            React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, fontFamily: 'Consolas, monospace', wordBreak: 'break-word' } }, k.to + '.' + k.toCol),
                            React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol } }, k.err || notMade ? '-' : k.rows + (k.capped ? '+' : '')),
                            React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol } }, k.err || notMade ? '-' : k.blank),
                            React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol } }, k.err || notMade ? '-' : k.bad),
                            React.createElement("td", { style: { padding: '4px 6px', borderBottom: '1px solid ' + borderCol, wordBreak: 'break-word' } },
                                React.createElement("span", { style: pill(tone) }, word),
                                extra ? React.createElement("span", { style: { color: textSub } }, extra) : null)));
                    }))),
                keyResults.length === 0 && React.createElement("div", { style: { fontSize: '13px', color: textSub } }, "No key pairs to check yet: both tables of a pair must be found first."))))),
        activeTab === 'prompts' && (React.createElement("div", { style: { background: bgCard, borderRadius: '8px', padding: '18px', border: '1px solid ' + borderCol } },
            React.createElement("h2", { style: { margin: 0, fontSize: '18px' } }, L('Tables and columns to make', 'Tablas y columnas por crear')),
            React.createElement("div", { style: { fontSize: '13px', color: textSub, marginTop: '4px', marginBottom: '14px' } }, L('One table at a time. Paste a create prompt into the Copilot table maker by itself. Missing columns on a table that already exists are faster to add by hand (Tables - the table - New column), because Copilot does not edit tables well. If Dataverse says a name is too similar to one that exists, tell this thread; the existing column is usually the one to keep.', 'Una tabla a la vez. Pegue cada prompt solo en el creador de tablas de Copilot. Las columnas que faltan en una tabla existente se agregan mas rapido a mano (Tablas - la tabla - Nueva columna), porque Copilot no edita bien las tablas. Si Dataverse dice que un nombre se parece demasiado a uno existente, aviselo en este hilo; casi siempre se queda la columna existente.')),
            promptCards.length === 0 && (React.createElement("div", { style: { fontSize: '13px', color: textSub } }, Object.keys(tableResults).length ? L('Nothing to make: no live table or required column is missing.', 'Nada por crear: no falta ninguna tabla activa ni columna requerida.') : L('Run a check first.', 'Primero haga una revision.'))),
            React.createElement("div", { style: { display: 'grid', gap: '12px' } }, promptCards.map(function (c) { return (React.createElement("div", { key: c.key, style: { background: bgSub, padding: '14px', borderRadius: '6px', border: '1px solid ' + borderCol } },
                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: '14px', fontWeight: 700 } }, esLabel(lang, c.table.label)),
                        React.createElement("div", { style: { fontSize: '11px', color: textSub, fontFamily: 'Consolas, monospace' } },
                            c.table.logicalName,
                            c.table.status === 'proposed' ? ' - ' + L('proposed', 'propuesta') : '')),
                    c.kind === 'create' ? (React.createElement("button", { type: "button", onClick: function () { return copyText(c.text, L('the prompt', 'el prompt')); }, style: btn(true, '#059669') },
                        L('Copy prompt', 'Copiar prompt'),
                        " (",
                        c.text.length,
                        " ",
                        L('chars', 'caracteres'),
                        ")")) : (React.createElement("span", { style: pill('amber') }, L('Add by hand', 'Agregar a mano')))),
                c.kind === 'create' ? (React.createElement("div", { style: { fontFamily: 'Consolas, monospace', fontSize: '12px', lineHeight: 1.5, wordBreak: 'break-word' } }, c.text)) : (React.createElement("div", { style: { fontSize: '12px' } }, c.cols.map(function (col) { return (React.createElement("div", { key: col, style: { marginBottom: '4px', wordBreak: 'break-word' } },
                    React.createElement("span", { style: { fontFamily: 'Consolas, monospace' } },
                        L('Display name ', 'Nombre para mostrar ') + colDisplay(col),
                        " (",
                        colTypeGuess(col),
                        ")"),
                    c.similar[col] && React.createElement("span", { style: { color: TONES.amber.fg } }, L(' - already there with a similar name: ', ' - ya existe con nombre parecido: ') + c.similar[col].join(', ') + L('. Keep that one and skip this.', '. Use esa y omita esta.')))); }))))); }))))));
}

})();