(function (global) {
  var STORAGE_PREFIX = '__APEX_DEMO_TABLE_V1__';
  var META_KEY = '__APEX_DEMO_META_V3__';

  // Canonical table registry
  var TABLE_ALIASES = {
    'craa5___1_a_assets': 'craa5___1_a_assets',
    'craa5___1_a_assetses': 'craa5___1_a_assets',
    'craa5_aa_assets': 'craa5___1_a_assets',
    'craa5_aa_assetses': 'craa5___1_a_assets',
    'craa5_a_assets': 'craa5___1_a_assets',
    'craa5_a_assetses': 'craa5___1_a_assets',
    'craa5___1_a_employee': 'craa5___1_a_employee',
    'craa5___1_a_employees': 'craa5___1_a_employee',
    'craa5___1_e_employee': 'craa5___1_a_employee',
    'craa5___1_e_employees': 'craa5___1_a_employee',
    'craa5___1_e_employeeses': 'craa5___1_a_employee',
    'craa5__aa_employee': 'craa5___1_a_employee',
    'craa5__aa_employees': 'craa5___1_a_employee',
    'craa5_e_employee': 'craa5___1_a_employee',
    'craa5_e_employees': 'craa5___1_a_employee',
    'craa5___1_a_mss_area': 'craa5___1_a_mss_area',
    'craa5___1_a_mss_areas': 'craa5___1_a_mss_area',
    'craa5_aa_mss_area': 'craa5___1_a_mss_area',
    'craa5_aa_mss_areas': 'craa5___1_a_mss_area',
    'craa5_a_mss_area': 'craa5___1_a_mss_area',
    'craa5_a_mss_areas': 'craa5___1_a_mss_area',
    'craa5___1_a_workshift': 'craa5___1_a_workshift',
    'craa5___1_a_workshifts': 'craa5___1_a_workshift',
    'craa5_workshift': 'craa5___1_a_workshift',
    'craa5_workshifts': 'craa5___1_a_workshift',
    'craa5_s_workshift': 'craa5___1_a_workshift',
    'craa5_s_workshifts': 'craa5___1_a_workshift',
    'craa5___1_a_leadershipteam': 'craa5___1_a_leadershipteam',
    'craa5___1_a_leadershipteams': 'craa5___1_a_leadershipteam',
    'craa5__aa_leadershipteam': 'craa5___1_a_leadershipteam',
    'craa5__aa_leadershipteams': 'craa5___1_a_leadershipteam',
    'craa5___1_a_role': 'craa5___1_a_role',
    'craa5___1_a_roles': 'craa5___1_a_role',
    'craa5___1_e_hubconfig': 'craa5___1_e_hubconfig',
    'craa5___1_e_hubconfigs': 'craa5___1_e_hubconfig',
    'craa5__e_hubconfig': 'craa5___1_e_hubconfig',
    'craa5__e_hubconfigs': 'craa5___1_e_hubconfig',
    'craa5_e_hubconfig': 'craa5___1_e_hubconfig',
    'craa5_e_hubconfigs': 'craa5___1_e_hubconfig',
    'craa5_directorsetpoint': 'craa5___1_e_directorsetpoint',
    'craa5_directorsetpoints': 'craa5___1_e_directorsetpoint',
    'craa5___1_e_directorsetpoint': 'craa5___1_e_directorsetpoint',
    'craa5___1_e_directorsetpoints': 'craa5___1_e_directorsetpoint',
    'craa5___1_e_laborrate': 'craa5___1_e_laborrate',
    'craa5___1_e_laborrates': 'craa5___1_e_laborrate',
    'craa5___1_e_shifttask': 'craa5___1_e_shifttask',
    'craa5___1_e_shifttasks': 'craa5___1_e_shifttask',
    'craa5___1_g_assignment': 'craa5___1_g_assignment',
    'craa5___1_g_assignments': 'craa5___1_g_assignment',
    'craa5___1_g_handover': 'craa5___1_g_handover',
    'craa5___1_g_handovers': 'craa5___1_g_handover',
    'craa5___1_g_passoff': 'craa5___1_g_passoff',
    'craa5___1_g_passoffs': 'craa5___1_g_passoff',
    'craa5___1_g_obstacle': 'craa5___1_g_obstacle',
    'craa5___1_g_obstacles': 'craa5___1_g_obstacle',
    'craa5_g_obstacle': 'craa5___1_g_obstacle',
    'craa5_g_obstacles': 'craa5___1_g_obstacle',
    'craa5_obstacles': 'craa5___1_g_obstacle',
    'craa5___1_g_note': 'craa5___1_g_note',
    'craa5___1_g_notes': 'craa5___1_g_note',
    'craa5___1_g_personnelnote': 'craa5___1_g_note',
    'craa5___1_g_personnelnotes': 'craa5___1_g_note',
    'craa5___1_g_maps': 'craa5___1_g_maps',
    'craa5___1_g_mapses': 'craa5___1_g_maps',
    'craa5___1_l_log': 'craa5___1_l_log',
    'craa5___1_l_logs': 'craa5___1_l_log',
    'craa5_l_log': 'craa5___1_l_log',
    'craa5_l_logs': 'craa5___1_l_log',
    'craa5__log_': 'craa5___1_l_log',
    'craa5__log_s': 'craa5___1_l_log',
    'craa5___1_m_employeenote': 'craa5___1_m_employeenote',
    'craa5___1_m_employeenotes': 'craa5___1_m_employeenote',
    'craa5___1_m_quicktask': 'craa5___1_m_quicktask',
    'craa5___1_m_quicktasks': 'craa5___1_m_quicktask',
    'craa5___1_m_supervisortodo': 'craa5___1_m_supervisortodo',
    'craa5___1_m_supervisortodos': 'craa5___1_m_supervisortodo',
    'craa5___1_m_timelosslog': 'craa5___1_m_timelosslog',
    'craa5___1_m_timelosslogs': 'craa5___1_m_timelosslog',
    'craa5_m_timelosslog': 'craa5___1_m_timelosslog',
    'craa5_m_timelosslogs': 'craa5___1_m_timelosslog',
    'craa5_timelosslog': 'craa5___1_m_timelosslog',
    'craa5_timelosslogs': 'craa5___1_m_timelosslog',
    'craa5___1_p_changeoverrule': 'craa5___1_p_changeoverrule',
    'craa5___1_p_changeoverrules': 'craa5___1_p_changeoverrule',
    'craa5___1_p_cleanplan': 'craa5___1_p_cleanplan',
    'craa5___1_p_cleanplans': 'craa5___1_p_cleanplan',
    'craa5_p_cleanplan': 'craa5___1_p_cleanplan',
    'craa5_p_cleanplans': 'craa5___1_p_cleanplan',
    'craa5_cleanplan': 'craa5___1_p_cleanplan',
    'craa5_cleanplans': 'craa5___1_p_cleanplan',
    'craa5___1_p_linepriority': 'craa5___1_p_linepriority',
    'craa5___1_p_linepriorities': 'craa5___1_p_linepriority',
    'craa5___1_p_plan': 'craa5___1_p_plan',
    'craa5___1_p_plans': 'craa5___1_p_plan',
    'craa5___1_p_prodschedule': 'craa5___1_p_prodschedule',
    'craa5___1_p_prodschedules': 'craa5___1_p_prodschedule',
    'craa5_p_prodschedule': 'craa5___1_p_prodschedule',
    'craa5_p_prodschedules': 'craa5___1_p_prodschedule',
    'craa5__aa_prd_schd': 'craa5___1_p_prodschedule',
    'craa5__aa_prd_schds': 'craa5___1_p_prodschedule',
    'craa5___1_p_skumaster': 'craa5___1_p_skumaster',
    'craa5___1_p_skumasters': 'craa5___1_p_skumaster',
    'craa5___1_s_cleancheckoff': 'craa5___1_s_cleancheckoff',
    'craa5___1_s_cleancheckoffs': 'craa5___1_s_cleancheckoff',
    'craa5___1_g_checkoff': 'craa5___1_s_cleancheckoff',
    'craa5___1_g_checkoffs': 'craa5___1_s_cleancheckoff',
    'craa5_g_checkoff': 'craa5___1_s_cleancheckoff',
    'craa5_g_checkoffs': 'craa5___1_s_cleancheckoff',
    'craa5___1_s_shiftarchive': 'craa5___1_s_shiftarchive',
    'craa5___1_s_shiftarchives': 'craa5___1_s_shiftarchive',
    'craa5_s_shiftarchive': 'craa5___1_s_shiftarchive',
    'craa5_s_shiftarchives': 'craa5___1_s_shiftarchive',
    'craa5_shiftarchive': 'craa5___1_s_shiftarchive',
    'craa5_shiftarchives': 'craa5___1_s_shiftarchive',
    'craa5___1_s_shiftboard': 'craa5___1_s_shiftboard',
    'craa5___1_s_shiftboards': 'craa5___1_s_shiftboard',
    'craa5_s_shiftboard': 'craa5___1_s_shiftboard',
    'craa5_s_shiftboards': 'craa5___1_s_shiftboard',
    'craa5_shiftboard': 'craa5___1_s_shiftboard',
    'craa5_shiftboards': 'craa5___1_s_shiftboard',
    'craa5___1_s_shiftlog': 'craa5___1_s_shiftlog',
    'craa5___1_s_shiftlogs': 'craa5___1_s_shiftlog',
    'craa5___1_s_shiftplan': 'craa5___1_s_shiftplan',
    'craa5___1_s_shiftplans': 'craa5___1_s_shiftplan',
    'craa5___1_s_shiftpreset': 'craa5___1_s_shiftpreset',
    'craa5___1_s_shiftpresets': 'craa5___1_s_shiftpreset',
    'craa5___1_s_taskassignment': 'craa5___1_s_taskassignment',
    'craa5___1_s_taskassignments': 'craa5___1_s_taskassignment',
    'craa5_taskassignment': 'craa5___1_s_taskassignment',
    'craa5_taskassignments': 'craa5___1_s_taskassignment',
    'craa5___1_s_updatepreset': 'craa5___1_s_updatepreset',
    'craa5___1_s_updatepresets': 'craa5___1_s_updatepreset',
    'craa5___1_s_saporder': 'craa5___1_s_saporder',
    'craa5___1_s_saporders': 'craa5___1_s_saporder',
    'craa5___1_b_swabresult': 'craa5___1_b_swabresult',
    'craa5___1_b_swabresults': 'craa5___1_b_swabresult',
    'craa5__b_swabresult': 'craa5___1_b_swabresult',
    'craa5__b_swabresults': 'craa5___1_b_swabresult',
    'craa5_b_swabresult': 'craa5___1_b_swabresult',
    'craa5_b_swabresults': 'craa5___1_b_swabresult',
    'craa5___1_b_correctiveaction': 'craa5___1_b_correctiveaction',
    'craa5___1_b_correctiveactions': 'craa5___1_b_correctiveaction',
    'craa5__b_correctiveaction': 'craa5___1_b_correctiveaction',
    'craa5__b_correctiveactions': 'craa5___1_b_correctiveaction',
    'craa5___1_b_facilityobservation': 'craa5___1_b_facilityobservation',
    'craa5___1_b_facilityobservations': 'craa5___1_b_facilityobservation',
    'craa5__facilityobservation': 'craa5___1_b_facilityobservation',
    'craa5__facilityobservations': 'craa5___1_b_facilityobservation',
    'craa5___1_b_swabcatalog': 'craa5___1_b_swabcatalog',
    'craa5___1_b_swabcatalogs': 'craa5___1_b_swabcatalog',
    'craa5_pathogenboloswabcatalog9900': 'craa5___1_b_swabcatalog',
    'craa5_pathogenboloswabcatalog9900s': 'craa5___1_b_swabcatalog',
    'craa5_pathogenboloswabcatalog9900': 'craa5___1_b_swabcatalog',
    'craa5_pathogenboloswabcatalog9900s': 'craa5___1_b_swabcatalog',
    'systemuser': 'systemuser',
    'systemusers': 'systemuser'
  };

  function canonicalTable(name) {
    var raw = String(name || '').trim().toLowerCase();
    if (!raw) return '';
    if (TABLE_ALIASES[raw]) return TABLE_ALIASES[raw];
    if (raw.slice(-2) === 'es' && TABLE_ALIASES[raw.slice(0, -2)]) return TABLE_ALIASES[raw.slice(0, -2)];
    if (raw.slice(-1) === 's' && TABLE_ALIASES[raw.slice(0, -1)]) return TABLE_ALIASES[raw.slice(0, -1)];
    if (raw.indexOf('craa5___1_') === 0) {
      if (raw.slice(-1) === 's' && raw.slice(-2) !== 'ss' && raw.indexOf('assets') === -1 && raw.indexOf('maps') === -1) {
        return raw.slice(0, -1);
      }
      return raw;
    }
    return raw;
  }

  function primaryKeyOf(canon) {
    if (canon === 'systemuser') return 'systemuserid';
    if (canon === 'craa5___1_b_swabresult') return 'craa5___1_b_swabresultid';
    if (canon === 'craa5___1_b_correctiveaction') return 'craa5___1_b_correctiveactionid';
    if (canon === 'craa5___1_b_facilityobservation') return 'craa5___1_b_facilityobservationid';
    if (canon === 'craa5___1_b_swabcatalog') return 'craa5___1_b_swabcatalogid';
    return canon + 'id';
  }

  function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function cleanGuid(v) {
    return String(v === undefined || v === null ? '' : v).replace(/[{}]/g, '').trim().toLowerCase();
  }

  // Shared top-window DB so all frames see mutations immediately
  function getRootWin() {
    try {
      if (global.top && global.top !== global && global.top.location && global.top.location.origin === global.location.origin) {
        return global.top;
      }
    } catch (e) {}
    return global;
  }

  function loadTableFromStorage(canon, seedRows) {
    try {
      var raw = global.localStorage ? global.localStorage.getItem(STORAGE_PREFIX + canon) : null;
      if (canon === 'craa5___1_l_log') {
        var base = Array.isArray(seedRows) ? seedRows.slice() : [];
        if (!raw) return base;
        var deltas = JSON.parse(raw);
        if (!Array.isArray(deltas) || deltas.length === 0) return base;
        var pk = primaryKeyOf(canon);
        var byId = {};
        for (var i = 0; i < base.length; i++) {
          var bid = cleanGuid(base[i][pk] || base[i].id);
          if (bid) byId[bid] = i;
        }
        deltas.forEach(function (d) {
          var did = cleanGuid(d[pk] || d.id);
          if (did && byId[did] !== undefined) {
            base[byId[did]] = d;
          } else {
            base.push(d);
            if (did) byId[did] = base.length - 1;
          }
        });
        return base;
      }
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return null;
  }

  function saveTableToStorage(canon, rows) {
    try {
      if (global.localStorage) {
        if (canon === 'craa5___1_l_log') {
          var deltas = (rows || []).filter(function (r) { return !r.__seed || r.__modified; });
          global.localStorage.setItem(STORAGE_PREFIX + canon, JSON.stringify(deltas));
        } else {
          global.localStorage.setItem(STORAGE_PREFIX + canon, JSON.stringify(rows));
        }
      }
    } catch (e) {}
    notifyListeners(canon);
  }

  function notifyListeners(canon) {
    try {
      var rw = getRootWin();
      if (rw && Array.isArray(rw.__APEX_DEMO_LISTENERS__)) {
        rw.__APEX_DEMO_LISTENERS__.forEach(function (fn) {
          try { fn(canon); } catch (e) {}
        });
      }
      if (typeof BroadcastChannel === 'function') {
        var bc = new BroadcastChannel('__MIDWESTPLANT_HUB_SYNC_V1__');
        bc.postMessage({
          type: canon === 'craa5___1_e_hubconfig' ? 'PREINSPECT_SYNC' : 'INVALIDATE_ENTITY_SET',
          entitySet: canon === 'craa5___1_e_hubconfig' ? 'craa5___1_e_hubconfigs' : (canon + 's')
        });
        bc.close();
      }
    } catch (e) {}
  }

  function clearStaleStorageIfNeeded(seed) {
    try {
      if (!global.localStorage) return;
      var wantMeta = JSON.stringify({ day: seed.demoDay || '', version: seed.seedVersion || 'v4' });
      var curMeta = global.localStorage.getItem(META_KEY);
      if (curMeta !== wantMeta) {
        var keys = [];
        for (var i = 0; i < global.localStorage.length; i++) {
          var k = global.localStorage.key(i);
          if (k && (k.indexOf(STORAGE_PREFIX) === 0 || k.indexOf('__APEX_DEMO_META') === 0 || k.indexOf('__1_') === 0 || k.indexOf('ss_') === 0 || k.indexOf('ganttly') === 0 || k.indexOf('mss_') === 0 || k.indexOf('sd_') === 0 || k.indexOf('hub_') === 0)) {
            keys.push(k);
          }
        }
        keys.forEach(function (k) { global.localStorage.removeItem(k); });
        try {
          if (global.indexedDB && typeof global.indexedDB.deleteDatabase === 'function') {
            global.indexedDB.deleteDatabase('__1_stl_pathogen_bolo_idb_v2');
            global.indexedDB.deleteDatabase('stl_pathogen_bolo_idb_v2');
            global.indexedDB.deleteDatabase('__1_apx_pathogen_bolo_idb_v2');
            global.indexedDB.deleteDatabase('apx_pathogen_bolo_idb_v2');
          }
        } catch (eIdb) {}
        global.localStorage.setItem(META_KEY, wantMeta);
        global.localStorage.setItem('__1_ss_lang_v1', 'en');
        global.localStorage.setItem('__1_hub_lang', 'en');
        global.localStorage.setItem('__1_mss-log-read-sheet', '0');
        global.localStorage.setItem('hub_std_unlocked_v1', '1');
        global.localStorage.setItem('hub_active_ms_user_v1', JSON.stringify({
          name: 'Marcus Vance',
          email: 'marcus.vance@apexfoods.demo',
          microsoftId: 'a0000001-0000-4000-8000-000000000001'
        }));
      }
    } catch (e) {}
  }

  function ensureDb() {
    var rw = getRootWin();
    if (rw.__APEX_DEMO_DB__ && rw.__APEX_DEMO_DB__.__initialized) {
      return rw.__APEX_DEMO_DB__;
    }
    var seed = (rw.__APEX_DEMO_SEED__ || global.__APEX_DEMO_SEED__ || { tables: {}, currentUser: {} });
    clearStaleStorageIfNeeded(seed);

    var db = {
      __initialized: true,
      currentUser: seed.currentUser || {
        userId: 'a0000001-0000-4000-8000-000000000001',
        userName: 'Marcus Vance',
        email: 'marcus.vance@apexfoods.demo',
        title: 'Sanitation Supervisor',
        crew: 'D',
        roles: ['System Administrator', 'Sanitation Supervisor', 'Sanitation Manager']
      },
      tables: {},
      files: {},
      ops: [],
      gaps: []
    };

    var seedTables = seed.tables || {};
    Object.keys(seedTables).forEach(function (k) {
      var canon = canonicalTable(k);
      var sRows = seedTables[k] || [];
      var stored = loadTableFromStorage(canon, sRows);
      if (stored !== null) {
        db.tables[canon] = stored;
      } else {
        var cloned = JSON.parse(JSON.stringify(sRows));
        db.tables[canon] = cloned;
        saveTableToStorage(canon, cloned);
      }
    });

    rw.__APEX_DEMO_DB__ = db;
    global.__APEX_DEMO_DB__ = db;
    return db;
  }

  function getTableRows(tableName) {
    var db = ensureDb();
    var canon = canonicalTable(tableName);
    if (!db.tables[canon]) {
      var stored = loadTableFromStorage(canon, []);
      db.tables[canon] = stored || [];
    }
    return db.tables[canon];
  }

  function setTableRows(tableName, rows) {
    var db = ensureDb();
    var canon = canonicalTable(tableName);
    db.tables[canon] = rows;
    saveTableToStorage(canon, rows);
    if (canon === 'craa5___1_l_log') {
      try {
        if (global.localStorage) global.localStorage.removeItem('__1_itp_overdue_v1');
      } catch (e) {}
    }
  }

  function recordOp(op, table, detail) {
    var db = ensureDb();
    var entry = {
      at: new Date().toISOString(),
      op: op,
      table: canonicalTable(table),
      rawTable: table,
      detail: detail || ''
    };
    db.ops.push(entry);
    if (db.ops.length > 500) db.ops.shift();
    notifyListeners(entry.table);
  }

  // Choice & FormattedValue annotations
  var ROLE_LABELS = {
    256000001: 'Lead',
    256000002: 'Supervisor',
    256000003: 'Employee',
    100000000: 'Employee',
    100000001: 'Lead',
    100000002: 'Supervisor',
    100000003: 'Manager',
    100000004: 'Admin'
  };

  var SHIFT_LABELS = {
    256000000: 'A',
    256000001: 'B',
    256000002: 'C',
    256000003: 'D'
  };

  function decorateRow(canon, row) {
    if (!row || typeof row !== 'object') return row;
    var out = Object.assign({}, row);
    var pk = primaryKeyOf(canon);
    var idVal = cleanGuid(out[pk] || out.id || out.craa5___1_a_employeeid || out.craa5___1_e_employeeid || out.craa5__b_swabresultid || out.craa5_b_swabresultid || '');
    if (idVal) {
      out[pk] = idVal;
      if (canon === 'craa5___1_a_employee') {
        out.craa5___1_a_employeeid = idVal;
        out.craa5___1_e_employeeid = idVal;
        out.craa5__aa_employeeid = idVal;
      }
      if (canon === 'craa5___1_a_assets') {
        out.craa5_aa_assetsid = idVal;
      }
      if (canon === 'craa5___1_e_hubconfig') {
        out.craa5__e_hubconfigid = idVal;
      }
      if (canon === 'craa5___1_s_shiftarchive') {
        out.craa5_shiftarchiveid = idVal;
      }
      if (canon === 'craa5___1_s_shiftboard') {
        out.craa5_shiftboardid = idVal;
      }
      if (canon === 'craa5___1_b_swabresult') {
        out.craa5___1_b_swabresultid = idVal;
        out.craa5__b_swabresultid = idVal;
        out.craa5_b_swabresultid = idVal;
      }
    }
    if (out.statecode === undefined) out.statecode = 0;
    if (out.statuscode === undefined) out.statuscode = 1;
    out['statecode@OData.Community.Display.V1.FormattedValue'] = out.statecode === 0 ? 'Active' : 'Inactive';
    out['statuscode@OData.Community.Display.V1.FormattedValue'] = out.statuscode === 1 ? 'Active' : 'Inactive';

    if (out.craa5_role !== undefined && out.craa5_role !== null) {
      var rl = ROLE_LABELS[out.craa5_role] || String(out.craa5_role);
      if (!out['craa5_role@OData.Community.Display.V1.FormattedValue']) {
        out['craa5_role@OData.Community.Display.V1.FormattedValue'] = rl;
      }
    }
    if (out.craa5_shift !== undefined && out.craa5_shift !== null) {
      var sl = SHIFT_LABELS[out.craa5_shift] || String(out.craa5_shift);
      if (!out['craa5_shift@OData.Community.Display.V1.FormattedValue']) {
        out['craa5_shift@OData.Community.Display.V1.FormattedValue'] = sl;
      }
    }
    if (canon === 'craa5___1_a_employee') {
      if (!out._craa5_roleid_value) out._craa5_roleid_value = 'r0000001-0000-4000-8000-000000000001';
      if (!out['_craa5_roleid_value@OData.Community.Display.V1.FormattedValue']) {
        out['_craa5_roleid_value@OData.Community.Display.V1.FormattedValue'] = out.craa5_roletitle || 'Sanitation Tech 1';
      }
    }
    if (!out._createdby_value) {
      var db = ensureDb();
      out._createdby_value = db.currentUser.userId;
      out['_createdby_value@OData.Community.Display.V1.FormattedValue'] = db.currentUser.userName;
    }
    Object.keys(out).forEach(function (k) {
      if (k.indexOf('@') > -1 || k.indexOf('__') === 0) return;
      var v = out[k];
      if (typeof v === 'boolean' && out[k + '@OData.Community.Display.V1.FormattedValue'] === undefined) {
        out[k + '@OData.Community.Display.V1.FormattedValue'] = v ? 'Yes' : 'No';
      }
    });
    return out;
  }

  // Split query options safely outside single quotes
  function parseQueryOptions(queryStr) {
    var out = {};
    if (!queryStr) return out;
    var s = String(queryStr).trim();
    var qIdx = s.indexOf('?');
    if (qIdx > -1) s = s.slice(qIdx + 1);
    if (!s) return out;

    var parts = [];
    var cur = '';
    var inQuote = false;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (ch === "'") {
        if (inQuote && s.charAt(i + 1) === "'") {
          cur += "''";
          i++;
          continue;
        }
        inQuote = !inQuote;
        cur += ch;
      } else if (ch === '&' && !inQuote) {
        parts.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur) parts.push(cur);

    parts.forEach(function (p) {
      var eq = p.indexOf('=');
      if (eq === -1) return;
      var key = p.slice(0, eq).trim();
      var val = p.slice(eq + 1).trim();
      try { val = decodeURIComponent(val); } catch (e) {}
      out[key] = val;
    });
    return out;
  }

  // Tokenizer & Recursive Descent Parser for OData $filter
  function tokenizeFilter(filterStr) {
    var tokens = [];
    var s = String(filterStr || '').trim();
    var i = 0;
    while (i < s.length) {
      var ch = s.charAt(i);
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '(' || ch === ')' || ch === ',') {
        tokens.push({ type: ch, value: ch });
        i++;
        continue;
      }
      if (ch === "'") {
        var str = '';
        i++;
        while (i < s.length) {
          if (s.charAt(i) === "'") {
            if (s.charAt(i + 1) === "'") {
              str += "'";
              i += 2;
              continue;
            }
            i++;
            break;
          }
          str += s.charAt(i);
          i++;
        }
        tokens.push({ type: 'STRING', value: str });
        continue;
      }
      var rest = s.slice(i);
      // Unquoted ISO date/datetime or bare YYYY-MM-DD
      var dm = rest.match(/^(\d{4}-\d{2}-\d{2}(?:T[0-9:.+-Z]+)?)(?=\s|\)|,|$)/);
      if (dm) {
        tokens.push({ type: 'DATE', value: dm[1] });
        i += dm[1].length;
        continue;
      }
      // Unquoted GUID
      var gm = rest.match(/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(?=\s|\)|,|$)/);
      if (gm) {
        tokens.push({ type: 'STRING', value: gm[1].toLowerCase() });
        i += gm[1].length;
        continue;
      }
      // Number
      var nm = rest.match(/^(-?\d+(?:\.\d+)?)(?=\s|\)|,|$)/);
      if (nm) {
        tokens.push({ type: 'NUMBER', value: parseFloat(nm[1]) });
        i += nm[1].length;
        continue;
      }
      // Identifier or keyword
      var im = rest.match(/^([A-Za-z0-9_/@.]+)/);
      if (im) {
        var word = im[1];
        var lw = word.toLowerCase();
        if (lw === 'and' || lw === 'or' || lw === 'not') {
          tokens.push({ type: lw.toUpperCase(), value: lw });
        } else if (lw === 'eq' || lw === 'ne' || lw === 'gt' || lw === 'ge' || lw === 'lt' || lw === 'le') {
          tokens.push({ type: 'OP', value: lw });
        } else if (lw === 'true' || lw === 'false') {
          tokens.push({ type: 'BOOL', value: lw === 'true' });
        } else if (lw === 'null') {
          tokens.push({ type: 'NULL', value: null });
        } else {
          tokens.push({ type: 'IDENT', value: word });
        }
        i += word.length;
        continue;
      }
      i++;
    }
    return tokens;
  }

  function isIsoDateLike(v) {
    return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v);
  }

  function compareValues(rowVal, op, litVal) {
    if (litVal === null) {
      var isNull = rowVal === null || rowVal === undefined || rowVal === '';
      if (op === 'eq') return isNull;
      if (op === 'ne') return !isNull;
      return false;
    }
    if (rowVal === null || rowVal === undefined) {
      return false; // SQL/OData semantics: null ne 'x' is false
    }
    // Date comparisons: bare YYYY-MM-DD vs YYYY-MM-DDT00:00:00Z
    if (isIsoDateLike(String(rowVal)) && isIsoDateLike(String(litVal))) {
      var rStr = String(rowVal).trim();
      var lStr = String(litVal).trim();
      if (lStr.length === 10 || rStr.length === 10) {
        var rDay = rStr.slice(0, 10);
        var lDay = lStr.slice(0, 10);
        if (op === 'eq') return rDay === lDay;
        if (op === 'ne') return rDay !== lDay;
        if (op === 'gt') return rDay > lDay;
        if (op === 'ge') return rDay >= lDay;
        if (op === 'lt') return rDay < lDay;
        if (op === 'le') return rDay <= lDay;
      }
      var rMs = Date.parse(rStr);
      var lMs = Date.parse(lStr);
      if (!isNaN(rMs) && !isNaN(lMs)) {
        if (op === 'eq') return rMs === lMs;
        if (op === 'ne') return rMs !== lMs;
        if (op === 'gt') return rMs > lMs;
        if (op === 'ge') return rMs >= lMs;
        if (op === 'lt') return rMs < lMs;
        if (op === 'le') return rMs <= lMs;
      }
    }
    if (typeof litVal === 'boolean' || typeof rowVal === 'boolean') {
      var rb = rowVal === true || String(rowVal).toLowerCase() === 'true' || rowVal === 1;
      var lb = litVal === true || String(litVal).toLowerCase() === 'true' || litVal === 1;
      if (op === 'eq') return rb === lb;
      if (op === 'ne') return rb !== lb;
    }
    if (typeof litVal === 'number' && !isNaN(Number(rowVal)) && String(rowVal).trim() !== '') {
      var rn = Number(rowVal);
      var ln = Number(litVal);
      if (op === 'eq') return rn === ln;
      if (op === 'ne') return rn !== ln;
      if (op === 'gt') return rn > ln;
      if (op === 'ge') return rn >= ln;
      if (op === 'lt') return rn < ln;
      if (op === 'le') return rn <= ln;
    }
    var rs = String(rowVal).trim().toLowerCase();
    var ls = String(litVal).trim().toLowerCase();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(ls)) rs = cleanGuid(rs);
    if (op === 'eq') return rs === ls;
    if (op === 'ne') return rs !== ls;
    if (op === 'gt') return rs > ls;
    if (op === 'ge') return rs >= ls;
    if (op === 'lt') return rs < ls;
    if (op === 'le') return rs <= ls;
    return false;
  }

  function getRowPropCaseInsensitive(row, prop) {
    if (!row || !prop) return undefined;
    if (prop in row) return row[prop];
    var lp = prop.toLowerCase();
    if (lp === 'statecode' && row.statecode === undefined) return 0;
    if (lp === 'statuscode' && row.statuscode === undefined) return 1;
    var keys = Object.keys(row);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === lp) return row[keys[i]];
    }
    return undefined;
  }

  function compileFilter(filterStr) {
    if (!filterStr || !String(filterStr).trim()) return function () { return true; };
    var tokens = tokenizeFilter(filterStr);
    var pos = 0;

    function peek() { return tokens[pos] || null; }
    function consume() { return tokens[pos++] || null; }

    function parseOr() {
      var left = parseAnd();
      while (peek() && peek().type === 'OR') {
        consume();
        var right = parseAnd();
        var prevLeft = left;
        left = (function (a, b) { return function (row) { return a(row) || b(row); }; })(prevLeft, right);
      }
      return left;
    }

    function parseAnd() {
      var left = parseUnary();
      while (peek() && peek().type === 'AND') {
        consume();
        var right = parseUnary();
        var prevLeft = left;
        left = (function (a, b) { return function (row) { return a(row) && b(row); }; })(prevLeft, right);
      }
      return left;
    }

    function parseUnary() {
      if (peek() && peek().type === 'NOT') {
        consume();
        var inner = parseUnary();
        return function (row) { return !inner(row); };
      }
      if (peek() && peek().type === '(') {
        consume();
        var expr = parseOr();
        if (peek() && peek().type === ')') consume();
        return expr;
      }
      return parseAtom();
    }

    function readLiteralToken() {
      var t = consume();
      if (!t) return null;
      return t.value;
    }

    function parseAtom() {
      var t = peek();
      if (!t) return function () { return true; };
      if (t.type === 'IDENT') {
        var ident = consume().value;
        var lIdent = ident.toLowerCase();
        // Function call: contains(col, 'val'), startswith(col, 'val'), endswith(col, 'val')
        if (peek() && peek().type === '(') {
          consume(); // '('
          var colTok = consume();
          var colName = colTok ? colTok.value : '';
          if (peek() && peek().type === ',') consume();
          var argVal = readLiteralToken();
          if (peek() && peek().type === ')') consume();
          var fnPred = function (row) {
            var rv = getRowPropCaseInsensitive(row, colName);
            if (rv === null || rv === undefined) return false;
            var rs = String(rv).toLowerCase();
            var as = String(argVal === null || argVal === undefined ? '' : argVal).toLowerCase();
            if (lIdent === 'contains') return rs.indexOf(as) > -1;
            if (lIdent === 'startswith') return rs.indexOf(as) === 0;
            if (lIdent === 'endswith') return rs.slice(-as.length) === as;
            return false;
          };
          // Optional `eq true` / `eq false` after function
          if (peek() && peek().type === 'OP') {
            var opTok = consume().value;
            var boolVal = readLiteralToken();
            return function (row) {
              var res = fnPred(row);
              return opTok === 'ne' ? res !== !!boolVal : res === !!boolVal;
            };
          }
          return fnPred;
        }
        // Standard comparison: col op literal
        if (peek() && peek().type === 'OP') {
          var op = consume().value;
          var lit = readLiteralToken();
          return function (row) {
            var rv = getRowPropCaseInsensitive(row, ident);
            return compareValues(rv, op, lit);
          };
        }
      }
      consume();
      return function () { return true; };
    }

    try {
      return parseOr();
    } catch (e) {
      return function () { return true; };
    }
  }

  // Parse FetchXML queries (used by Shift Start & Ganttly)
  function executeFetchXml(canon, xmlStr) {
    var rawRows = getTableRows(canon);
    var topMatch = String(xmlStr).match(/<fetch[^>]*\btop=['"](\d+)['"]/i);
    var topLimit = topMatch ? parseInt(topMatch[1], 10) : 5000;

    var condRegex = /<condition\b([^>]*)\/?>/gi;
    var conditions = [];
    var m;
    while ((m = condRegex.exec(xmlStr)) !== null) {
      var attrs = m[1];
      var attrM = attrs.match(/\battribute=['"]([^'"]+)['"]/i);
      var opM = attrs.match(/\boperator=['"]([^'"]+)['"]/i);
      var valM = attrs.match(/\bvalue=['"]([^'"]*)['"]/i);
      if (attrM && opM) {
        conditions.push({
          attr: attrM[1],
          op: opM[1].toLowerCase(),
          val: valM ? valM[1] : null
        });
      }
    }

    var rows = rawRows;
    if (conditions.length > 0) {
      rows = rawRows.filter(function (row) {
        return conditions.every(function (c) {
          var rv = getRowPropCaseInsensitive(row, c.attr);
          if (c.op === 'null') return rv === null || rv === undefined || rv === '';
          if (c.op === 'not-null') return rv !== null && rv !== undefined && rv !== '';
          if (c.op === 'last-x-hours') {
            var hrs = parseFloat(c.val) || 24;
            var ms = rv ? Date.parse(rv) : 0;
            if (!ms) return true;
            return ms >= Date.now() - hrs * 3600000;
          }
          return compareValues(rv, c.op, c.val);
        });
      });
    } else {
      rows = rawRows.slice();
    }

    var orderM = String(xmlStr).match(/<order\b[^>]*\battribute=['"]([^'"]+)['"][^>]*>/i);
    if (orderM) {
      var orderCol = orderM[1];
      var desc = /\bdescending=['"]true['"]/i.test(orderM[0]);
      rows.sort(function (a, b) {
        var va = getRowPropCaseInsensitive(a, orderCol);
        var vb = getRowPropCaseInsensitive(b, orderCol);
        if (va === vb) return 0;
        if (va === null || va === undefined) return desc ? 1 : -1;
        if (vb === null || vb === undefined) return desc ? -1 : 1;
        return (va < vb ? -1 : 1) * (desc ? -1 : 1);
      });
    }

    return rows.slice(0, topLimit).map(function (r) { return decorateRow(canon, r); });
  }

  function queryInternal(tableName, queryStr, maxPageSize) {
    var canon = canonicalTable(tableName);
    var pk = primaryKeyOf(canon);
    var opts = typeof queryStr === 'string' ? parseQueryOptions(queryStr) : (queryStr || {});

    if (opts.fetchXml) {
      var fxRows = executeFetchXml(canon, opts.fetchXml);
      recordOp('queryFetchXml', canon, 'rows=' + fxRows.length);
      return { entities: fxRows, nextLink: undefined };
    }

    var rawRows = getTableRows(canon);
    var filterExpr = opts.$filter || opts.filter || '';
    var pred = compileFilter(filterExpr);
    var filteredRaw = filterExpr ? rawRows.filter(pred) : rawRows.slice();

    var orderExpr = opts.$orderby || opts.orderBy || '';
    if (orderExpr) {
      var oParts = String(orderExpr).trim().split(/\s+/);
      var oCol = oParts[0];
      var oDesc = oParts[1] && oParts[1].toLowerCase() === 'desc';
      filteredRaw.sort(function (a, b) {
        var va = getRowPropCaseInsensitive(a, oCol);
        var vb = getRowPropCaseInsensitive(b, oCol);
        if (va === vb) return 0;
        if (va === null || va === undefined) return oDesc ? 1 : -1;
        if (vb === null || vb === undefined) return oDesc ? -1 : 1;
        if (typeof va === 'string' && typeof vb === 'string') {
          var cmp = va.toLowerCase().localeCompare(vb.toLowerCase());
          return oDesc ? -cmp : cmp;
        }
        return (va < vb ? -1 : 1) * (oDesc ? -1 : 1);
      });
    }

    var topLimit = opts.$top || opts.top ? parseInt(opts.$top || opts.top, 10) : null;
    var skiptoken = opts.$skiptoken ? parseInt(opts.$skiptoken, 10) : 0;
    var pageLimit = maxPageSize ? parseInt(maxPageSize, 10) : (opts.pageSize ? parseInt(opts.pageSize, 10) : null);

    var slicedRaw = filteredRaw;
    var nextLink = undefined;
    if (topLimit !== null && !isNaN(topLimit)) {
      slicedRaw = filteredRaw.slice(0, topLimit);
    } else if (pageLimit !== null && !isNaN(pageLimit) && pageLimit > 0) {
      slicedRaw = filteredRaw.slice(skiptoken, skiptoken + pageLimit);
      if (skiptoken + pageLimit < filteredRaw.length) {
        var nextParts = [];
        if (opts.$select) nextParts.push('$select=' + encodeURIComponent(opts.$select));
        if (filterExpr) nextParts.push('$filter=' + encodeURIComponent(filterExpr));
        if (orderExpr) nextParts.push('$orderby=' + encodeURIComponent(orderExpr));
        nextParts.push('$skiptoken=' + (skiptoken + pageLimit));
        nextLink = 'https://demo.apexfoods.local/api/data/v9.2/' + canon + 's?' + nextParts.join('&');
      }
    }

    var sliced = slicedRaw.map(function (r) { return decorateRow(canon, r); });

    var selectExpr = opts.$select || (Array.isArray(opts.select) ? opts.select.join(',') : opts.select) || '';
    if (selectExpr) {
      var cols = String(selectExpr).split(',').map(function (c) { return c.trim(); }).filter(Boolean);
      if (cols.indexOf(pk) === -1) cols.push(pk);
      sliced = sliced.map(function (r) {
        var proj = {};
        cols.forEach(function (c) {
          var v = getRowPropCaseInsensitive(r, c);
          proj[c] = v !== undefined ? v : null;
          var fv = getRowPropCaseInsensitive(r, c + '@OData.Community.Display.V1.FormattedValue');
          if (fv !== undefined) proj[c + '@OData.Community.Display.V1.FormattedValue'] = fv;
        });
        proj[pk] = r[pk];
        if (canon === 'craa5___1_a_employee') {
          proj.craa5___1_a_employeeid = r[pk];
          proj.craa5___1_e_employeeid = r[pk];
        }
        return proj;
      });
    }

    recordOp('query', canon, 'count=' + sliced.length + (filterExpr ? ' filter=' + filterExpr.slice(0, 60) : ''));
    return { entities: sliced, nextLink: nextLink };
  }

  function normalizeWritePayload(canon, data) {
    var copy = Object.assign({}, data || {});
    Object.keys(copy).forEach(function (k) {
      if (k.indexOf('@odata.bind') > -1) {
        var baseCol = k.split('@')[0];
        var m = String(copy[k] || '').match(/\(([^)]+)\)/);
        if (m) {
          copy['_' + baseCol + '_value'] = cleanGuid(m[1]);
        }
        delete copy[k];
      }
    });
    return copy;
  }

  function createInternal(tableName, data) {
    var canon = canonicalTable(tableName);
    var pk = primaryKeyOf(canon);
    var rows = getTableRows(canon).slice();
    var payload = normalizeWritePayload(canon, data);
    var suppliedId = cleanGuid(payload[pk] || payload.id || payload.craa5___1_a_employeeid || payload.craa5___1_e_employeeid || payload.craa5__b_swabresultid || payload.craa5_b_swabresultid || '');
    var id = suppliedId || newGuid();

    // Upsert by craa5_configkey for craa5___1_e_hubconfig so Pre-Inspection & CAPA updates overwrite in place
    if (canon === 'craa5___1_e_hubconfig' && payload.craa5_configkey) {
      var existingKeyIdx = rows.findIndex(function (r) {
        return String(r.craa5_configkey || '') === String(payload.craa5_configkey);
      });
      if (existingKeyIdx >= 0) {
        var merged = Object.assign({}, rows[existingKeyIdx], payload, {
          modifiedon: new Date().toISOString(),
          __modified: true
        });
        rows[existingKeyIdx] = merged;
        setTableRows(canon, rows);
        recordOp('update', canon, 'configkey=' + payload.craa5_configkey);
        return decorateRow(canon, merged);
      }
    }

    // Check duplicate key if client supplied primary key
    if (suppliedId) {
      var exists = rows.some(function (r) {
        return cleanGuid(r[pk] || r.id) === suppliedId;
      });
      if (exists) {
        var dupErr = new Error('Cannot insert duplicate key: a record with matching key values already exists (0x80040237)');
        dupErr.status = 412;
        dupErr.code = 0x80040237;
        throw dupErr;
      }
    }

    var nowIso = new Date().toISOString();
    var db = ensureDb();
    var newRow = Object.assign({
      statecode: 0,
      statuscode: 1,
      createdon: nowIso,
      modifiedon: nowIso,
      _createdby_value: db.currentUser.userId,
      __modified: true
    }, payload);
    newRow[pk] = id;
    if (canon === 'craa5___1_a_employee') {
      newRow.craa5___1_a_employeeid = id;
      newRow.craa5___1_e_employeeid = id;
    }
    if (canon === 'craa5___1_b_swabresult') {
      newRow.craa5___1_b_swabresultid = id;
      newRow.craa5__b_swabresultid = id;
      newRow.craa5_b_swabresultid = id;
    }
    rows.push(newRow);
    setTableRows(canon, rows);
    if (canon === 'craa5___1_l_log') {
      syncLogToCheckoff(newRow);
    }
    recordOp('create', canon, 'id=' + id);
    return decorateRow(canon, newRow);
  }

  function syncLogToCheckoff(logRow) {
    try {
      if (!logRow) return;
      var assets = getTableRows('craa5___1_a_assets') || [];
      var eqGuid = cleanGuid(logRow.craa5_equipmentguid || logRow.craa5_assetid || '');
      var eqName = String(logRow.craa5_equipment || logRow.craa5_title || '').trim();
      var sapCode = String(logRow.craa5_sap || '').trim();
      var asset = null;
      if (eqGuid) {
        asset = assets.find(function (a) { return cleanGuid(a.craa5___1_a_assetsid) === eqGuid; });
      }
      if (!asset && eqName) {
        var lowName = eqName.toLowerCase();
        asset = assets.find(function (a) { return String(a.craa5_equipmentidentifier || '').trim().toLowerCase() === lowName; });
      }
      if (!asset && sapCode) {
        var lowSap = sapCode.toLowerCase();
        asset = assets.find(function (a) { return String(a.craa5_sapdaily || '').trim().toLowerCase() === lowSap; });
      }
      if (asset && !eqGuid) {
        eqGuid = cleanGuid(asset.craa5___1_a_assetsid);
      }
      if (!eqGuid) return;

      var areaName = String((asset && asset.craa5_areaname) || logRow.craa5_area || '').trim();
      var dispName = String((asset && asset.craa5_equipmentidentifier) || eqName || 'Equipment').trim();
      var mins = Number((asset && asset.craa5_hoursrequired) || logRow.craa5_laborminutes || 45) || 45;

      var asgns = getTableRows('craa5___1_g_assignment') || [];
      var asgn = asgns.find(function (x) { return cleanGuid(x.craa5_equipmentguid) === eqGuid; });
      var slotStartIso = (asgn && asgn.craa5_slotstart) || '';
      var slotStartMs = slotStartIso ? Date.parse(slotStartIso) : (Date.now() - 4 * 3600000);
      var slotBase36 = Math.round(slotStartMs / 60000).toString(36);
      var empGuid = cleanGuid((asgn && asgn.craa5_employeeguids) || logRow.craa5_employeeguids || '');

      var dnMs = Date.now();
      var stMs = dnMs - mins * 60000;
      var stIso = new Date(stMs).toISOString();
      var dnIso = new Date(dnMs).toISOString();
      var chkKey = eqGuid + '~' + slotBase36;
      var recObj = {
        status: 'done',
        parentId: eqGuid,
        name: dispName,
        startMs: stMs,
        durationMins: mins,
        laneKeys: empGuid ? [empGuid] : [],
        workMins: mins,
        heads: 1,
        updatedAt: dnMs,
        startedAt: stMs,
        doneAt: dnMs,
        syncAt: dnMs
      };
      var detailsObj = {
        v: 1,
        id: eqGuid,
        area: areaName,
        rec: recObj
      };
      var chkRows = getTableRows('craa5___1_g_checkoff').slice();
      var existingIdx = chkRows.findIndex(function (r) {
        return cleanGuid(r.craa5_equipmentguid) === eqGuid || r.craa5_checkoffkey === chkKey;
      });
      var chkRow = {
        craa5___1_s_cleancheckoffid: existingIdx >= 0 ? chkRows[existingIdx].craa5___1_s_cleancheckoffid : newGuid(),
        craa5_checkoffkey: chkKey,
        craa5_status: 'done',
        craa5_details: JSON.stringify(detailsObj),
        craa5_equipmentguid: eqGuid,
        craa5_area: areaName,
        craa5_shiftdate: String(logRow.craa5_shiftdate || dnIso.slice(0, 10)),
        craa5_cleankind: String(logRow.craa5_cleankind || 'daily'),
        craa5_completionkey: eqGuid + '|' + String(logRow.craa5_shiftdate || dnIso.slice(0, 10)) + '|daily',
        craa5_startedat: stIso,
        craa5_doneat: dnIso,
        craa5_keepuntil: new Date(dnMs + 7 * 86400000).toISOString(),
        createdon: stIso,
        modifiedon: dnIso,
        statecode: 0,
        statuscode: 1
      };
      if (existingIdx >= 0) {
        chkRows[existingIdx] = Object.assign({}, chkRows[existingIdx], chkRow);
      } else {
        chkRows.push(chkRow);
      }
      setTableRows('craa5___1_g_checkoff', chkRows);

      if (global.localStorage) {
        var rawPlan = global.localStorage.getItem('__1_itp_plan_current_v1');
        var planObj = rawPlan ? JSON.parse(rawPlan) : { overrides: {}, taskStatus: {}, customTasks: [], assetEdits: {} };
        if (!planObj.taskStatus) planObj.taskStatus = {};
        planObj.taskStatus[eqGuid] = recObj;
        global.localStorage.setItem('__1_itp_plan_current_v1', JSON.stringify(planObj));

        var rawSync = global.localStorage.getItem('__1_itp_current_sync_v1');
        if (rawSync) {
          var syncObj = JSON.parse(rawSync);
          syncObj.readFrom = '';
          global.localStorage.setItem('__1_itp_current_sync_v1', JSON.stringify(syncObj));
        }
      }
    } catch (e) {}
  }

  function updateInternal(tableName, idRaw, data, allowUpsert) {
    var canon = canonicalTable(tableName);
    var pk = primaryKeyOf(canon);
    var id = cleanGuid(idRaw);
    var rows = getTableRows(canon).slice();
    var payload = normalizeWritePayload(canon, data);
    var idx = -1;
    for (var i = 0; i < rows.length; i++) {
      var rid = cleanGuid(rows[i][pk] || rows[i].id || rows[i].craa5___1_a_employeeid || rows[i].craa5___1_e_employeeid || rows[i].craa5__b_swabresultid || '');
      if (rid === id) { idx = i; break; }
    }
    if (idx === -1) {
      if (allowUpsert) {
        payload[pk] = id;
        return createInternal(canon, payload);
      }
      var missErr = new Error("Entity '" + canon + "' With Id = " + id + " Does Not Exist (0x80040217)");
      missErr.status = 404;
      missErr.code = 0x80040217;
      throw missErr;
    }
    var updated = Object.assign({}, rows[idx], payload, {
      modifiedon: new Date().toISOString(),
      __modified: true
    });
    updated[pk] = id;
    rows[idx] = updated;
    setTableRows(canon, rows);
    if (canon === 'craa5___1_l_log') {
      syncLogToCheckoff(updated);
    }
    recordOp('update', canon, 'id=' + id);
    return decorateRow(canon, updated);
  }

  function deleteInternal(tableName, idRaw) {
    var canon = canonicalTable(tableName);
    var pk = primaryKeyOf(canon);
    var id = cleanGuid(idRaw);
    var rows = getTableRows(canon);
    var next = rows.filter(function (r) {
      var rid = cleanGuid(r[pk] || r.id || r.craa5___1_a_employeeid || r.craa5___1_e_employeeid || '');
      return rid !== id;
    });
    setTableRows(canon, next);
    recordOp('delete', canon, 'id=' + id);
    return { id: id };
  }

  function retrieveRecordInternal(tableName, idRaw, queryStr) {
    var canon = canonicalTable(tableName);
    var pk = primaryKeyOf(canon);
    var id = cleanGuid(idRaw);
    var rows = getTableRows(canon);
    for (var i = 0; i < rows.length; i++) {
      var rid = cleanGuid(rows[i][pk] || rows[i].id || rows[i].systemuserid || '');
      if (rid === id) {
        return decorateRow(canon, rows[i]);
      }
    }
    if (canon === 'systemuser') {
      var db = ensureDb();
      return {
        systemuserid: id,
        fullname: db.currentUser.userName,
        internalemailaddress: db.currentUser.email,
        domainname: db.currentUser.email,
        title: db.currentUser.title || 'Sanitation Supervisor',
        jobtitle: db.currentUser.title || 'Sanitation Supervisor'
      };
    }
    var err = new Error("Entity '" + canon + "' With Id = " + id + " Does Not Exist (0x80040217)");
    err.status = 404;
    throw err;
  }

  // Install Xrm.WebApi and Xrm.Utility
  var webApi = {
    __pgSandboxGuarded: true,
    retrieveMultipleRecords: function (tableName, queryStr, maxPageSize) {
      return new Promise(function (resolve, reject) {
        try {
          var res = queryInternal(tableName, queryStr, maxPageSize);
          resolve({ entities: res.entities, nextLink: res.nextLink });
        } catch (e) {
          reject(e);
        }
      });
    },
    retrieveRecord: function (tableName, id, queryStr) {
      return new Promise(function (resolve, reject) {
        try {
          resolve(retrieveRecordInternal(tableName, id, queryStr));
        } catch (e) {
          reject(e);
        }
      });
    },
    createRecord: function (tableName, data) {
      return new Promise(function (resolve, reject) {
        try {
          var created = createInternal(tableName, data);
          var pk = primaryKeyOf(canonicalTable(tableName));
          resolve({ id: created[pk], entityType: canonicalTable(tableName) });
        } catch (e) {
          reject(e);
        }
      });
    },
    updateRecord: function (tableName, id, data) {
      return new Promise(function (resolve, reject) {
        try {
          updateInternal(tableName, id, data, false);
          resolve({ id: cleanGuid(id), entityType: canonicalTable(tableName) });
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteRecord: function (tableName, id) {
      return new Promise(function (resolve, reject) {
        try {
          resolve(deleteInternal(tableName, id));
        } catch (e) {
          reject(e);
        }
      });
    }
  };

  function makeGlobalContext() {
    var db = ensureDb();
    var roleObjs = (db.currentUser.roles || ['System Administrator', 'Sanitation Supervisor']).map(function (r, idx) {
      return { id: 'role-000' + idx, name: r };
    });
    return {
      getClientUrl: function () { return 'https://demo.apexfoods.local'; },
      getCurrentAppUrl: function () { return 'https://demo.apexfoods.local'; },
      userSettings: {
        userId: '{' + db.currentUser.userId.toUpperCase() + '}',
        userName: db.currentUser.userName,
        securityRoles: roleObjs.map(function (r) { return r.id; }),
        roles: {
          getAll: function () { return roleObjs; },
          forEach: function (fn) { roleObjs.forEach(fn); },
          getLength: function () { return roleObjs.length; }
        }
      }
    };
  }

  global.Xrm = {
    WebApi: webApi,
    Utility: {
      getGlobalContext: makeGlobalContext
    },
    Page: {
      context: makeGlobalContext()
    }
  };

  // dataApi object for props.dataApi
  var dataApi = {
    queryTable: function (tableName, options) {
      return new Promise(function (resolve, reject) {
        try {
          var opts = options || {};
          var res = queryInternal(tableName, {
            $select: Array.isArray(opts.select) ? opts.select.join(',') : opts.select,
            $filter: opts.filter,
            $orderby: opts.orderBy || opts.orderby,
            $top: opts.top,
            pageSize: opts.pageSize
          }, opts.pageSize);
          resolve({
            rows: res.entities,
            hasMoreRows: !!res.nextLink,
            loadMoreRows: function () { return Promise.resolve({ rows: [], hasMoreRows: false }); }
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    createRow: function (tableName, payload) {
      return new Promise(function (resolve, reject) {
        try {
          var created = createInternal(tableName, payload);
          var pk = primaryKeyOf(canonicalTable(tableName));
          resolve(Object.assign({ id: created[pk] }, created));
        } catch (e) {
          reject(e);
        }
      });
    },
    updateRow: function (tableName, id, payload) {
      return new Promise(function (resolve, reject) {
        try {
          var updated = updateInternal(tableName, id, payload, false);
          resolve(Object.assign({ id: cleanGuid(id) }, updated));
        } catch (e) {
          reject(e);
        }
      });
    },
    deleteRow: function (tableName, id) {
      return new Promise(function (resolve, reject) {
        try {
          resolve(deleteInternal(tableName, id));
        } catch (e) {
          reject(e);
        }
      });
    }
  };

  global.__APEX_DEMO_DATA_API__ = dataApi;
  global.__APEX_DEMO_CONTEXT__ = makeGlobalContext();

  // Fetch interceptor for /api/data/v9.2/ including WhoAmI, $batch, file columns, and standard OData
  var origFetch = typeof global.fetch === 'function' ? global.fetch.bind(global) : null;

  function makeJsonResponse(status, bodyObj, extraHeaders) {
    var headersObj = Object.assign({ 'Content-Type': 'application/json; odata.metadata=minimal' }, extraHeaders || {});
    var bodyTxt = bodyObj !== null && bodyObj !== undefined ? (typeof bodyObj === 'string' ? bodyObj : JSON.stringify(bodyObj)) : '';
    if (typeof Response === 'function') {
      return new Response(status === 204 ? null : bodyTxt, { status: status, headers: headersObj });
    }
    return {
      ok: status >= 200 && status < 300,
      status: status,
      headers: { get: function (h) { return headersObj[h] || headersObj[h.toLowerCase()] || null; } },
      text: function () { return Promise.resolve(bodyTxt); },
      json: function () { return Promise.resolve(bodyObj); }
    };
  }

  function handleSingleApiRequest(method, urlStr, headers, bodyText) {
    var db = ensureDb();
    var mMethod = String(method || 'GET').toUpperCase();
    var rel = String(urlStr).replace(/^https?:\/\/[^/]+/i, '');
    var apiIdx = rel.indexOf('/api/data/v9.');
    var afterApi = apiIdx > -1 ? rel.slice(rel.indexOf('/', apiIdx + 10) + 1) : rel.replace(/^\/+/, '');
    var qIdx = afterApi.indexOf('?');
    var pathPart = qIdx > -1 ? afterApi.slice(0, qIdx) : afterApi;
    var queryPart = qIdx > -1 ? afterApi.slice(qIdx + 1) : '';

    // 1. WhoAmI
    if (/^WhoAmI(\(\))?$/i.test(pathPart)) {
      return makeJsonResponse(200, {
        UserId: db.currentUser.userId,
        BusinessUnitId: 'b0000001-0000-4000-8000-000000000001',
        OrganizationId: 'o0000001-0000-4000-8000-000000000001'
      });
    }

    // 2. PublishAllXml
    if (/^PublishAllXml/i.test(pathPart)) {
      return makeJsonResponse(204, null);
    }

    // 3. systemusers(id)/systemuserroles_association
    var roleAssocMatch = pathPart.match(/^systemusers\(([^)]+)\)\/systemuserroles_association/i);
    if (roleAssocMatch) {
      var roles = (db.currentUser.roles || ['System Administrator', 'Sanitation Supervisor']).map(function (r, idx) {
        return { roleid: 'role-000' + idx, name: r };
      });
      return makeJsonResponse(200, { value: roles });
    }

    // 4. $batch multipart
    if (/^\$batch$/i.test(pathPart) && mMethod === 'POST') {
      var subStatuses = [];
      var partRegex = /(?:POST|PATCH|PUT|DELETE)\s+(\S+)\s+HTTP\/1\.1[\s\S]*?(?:\r?\n\r?\n)([\s\S]*?)(?=\r?\n--|$)/gi;
      var pm;
      while ((pm = partRegex.exec(String(bodyText || ''))) !== null) {
        var reqLineMatch = pm[0].match(/^(POST|PATCH|PUT|DELETE)\s+(\S+)/i);
        var subMethod = reqLineMatch ? reqLineMatch[1].toUpperCase() : 'PATCH';
        var subUrl = reqLineMatch ? reqLineMatch[2] : pm[1];
        var subBody = (pm[2] || '').trim();
        var braceIdx = subBody.indexOf('{');
        var lastBrace = subBody.lastIndexOf('}');
        if (braceIdx > -1 && lastBrace >= braceIdx) {
          subBody = subBody.slice(braceIdx, lastBrace + 1);
        }
        try {
          var subRes = handleSingleApiRequest(subMethod, subUrl, {}, subBody);
          subStatuses.push(subRes.status || 204);
        } catch (e) {
          subStatuses.push(e.status || 400);
        }
      }
      if (subStatuses.length === 0) subStatuses.push(204);
      var boundary = 'batchresponse_' + newGuid();
      var respParts = subStatuses.map(function (st) {
        return '--' + boundary + '\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nHTTP/1.1 ' + st + (st === 204 ? ' No Content' : ' OK') + '\r\n\r\n';
      }).join('') + '--' + boundary + '--\r\n';
      return makeJsonResponse(200, respParts, { 'Content-Type': 'multipart/mixed; boundary=' + boundary });
    }

    // 5. File column upload/download: entity(id)/column or entity(id)/column/$value
    var fileColMatch = pathPart.match(/^([a-zA-Z0-9_]+)\(([^)]+)\)\/([a-zA-Z0-9_]+)(\/\$value)?$/);
    if (fileColMatch) {
      var fEntity = canonicalTable(fileColMatch[1]);
      var fId = cleanGuid(fileColMatch[2]);
      var fCol = fileColMatch[3];
      var fKey = fEntity + ':' + fId + ':' + fCol;
      if (mMethod === 'PATCH' || mMethod === 'PUT') {
        db.files[fKey] = bodyText || 'BINARY_FILE_DATA';
        try {
          var filePatch = {};
          filePatch[fCol] = 'attached_file.dat';
          filePatch[fCol + '_name'] = 'attached_file.jpg';
          updateInternal(fEntity, fId, filePatch, true);
        } catch (e) {}
        return makeJsonResponse(204, null);
      }
      if (mMethod === 'GET') {
        var storedFile = db.files[fKey] || '';
        return makeJsonResponse(200, storedFile, { 'Content-Type': 'application/octet-stream' });
      }
    }

    // 6. Entity with ID: entity(id)
    var recMatch = pathPart.match(/^([a-zA-Z0-9_]+)\(([^)]+)\)$/);
    if (recMatch) {
      var rEntity = canonicalTable(recMatch[1]);
      var rId = cleanGuid(recMatch[2]);
      if (mMethod === 'GET') {
        try {
          var rec = retrieveRecordInternal(rEntity, rId, queryPart);
          return makeJsonResponse(200, rec);
        } catch (e) {
          return makeJsonResponse(e.status || 404, { error: { message: e.message } });
        }
      }
      if (mMethod === 'PATCH' || mMethod === 'PUT') {
        try {
          var patchData = bodyText ? (typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText) : {};
          var updated = updateInternal(rEntity, rId, patchData, true);
          var prefer = (headers && (headers.Prefer || headers.prefer)) || '';
          if (/return=representation/i.test(prefer)) {
            return makeJsonResponse(200, updated);
          }
          return makeJsonResponse(204, null, {
            'OData-EntityId': 'https://demo.apexfoods.local/api/data/v9.2/' + rEntity + 's(' + rId + ')'
          });
        } catch (e) {
          return makeJsonResponse(e.status || 400, { error: { message: e.message } });
        }
      }
      if (mMethod === 'DELETE') {
        deleteInternal(rEntity, rId);
        return makeJsonResponse(204, null);
      }
    }

    // 7. Entity set: entity
    var setEntity = canonicalTable(pathPart);
    if (mMethod === 'GET') {
      var maxPage = null;
      var prefHdr = (headers && (headers.Prefer || headers.prefer)) || '';
      var mpMatch = String(prefHdr).match(/odata\.maxpagesize=(\d+)/i);
      if (mpMatch) maxPage = parseInt(mpMatch[1], 10);
      var qRes = queryInternal(setEntity, queryPart, maxPage);
      var bodyOut = { value: qRes.entities };
      if (qRes.nextLink) bodyOut['@odata.nextLink'] = qRes.nextLink;
      return makeJsonResponse(200, bodyOut);
    }
    if (mMethod === 'POST') {
      try {
        var postData = bodyText ? (typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText) : {};
        var created = createInternal(setEntity, postData);
        var pk = primaryKeyOf(setEntity);
        var cId = created[pk];
        var eUrl = 'https://demo.apexfoods.local/api/data/v9.2/' + setEntity + 's(' + cId + ')';
        var pref2 = (headers && (headers.Prefer || headers.prefer)) || '';
        if (/return=representation/i.test(pref2)) {
          return makeJsonResponse(201, created, { 'OData-EntityId': eUrl, 'odata-entityid': eUrl });
        }
        return makeJsonResponse(204, null, { 'OData-EntityId': eUrl, 'odata-entityid': eUrl });
      } catch (e) {
        return makeJsonResponse(e.status || 400, { error: { message: e.message } });
      }
    }

    return makeJsonResponse(200, { value: [] });
  }

  global.fetch = function (input, init) {
    var urlStr = typeof input === 'string' ? input : (input && input.url ? input.url : String(input || ''));
    if (urlStr.indexOf('/api/data/v9.') > -1) {
      var method = (init && init.method) || (input && input.method) || 'GET';
      var headers = (init && init.headers) || {};
      var body = init && init.body;
      var bodyStr = '';
      if (typeof body === 'string') {
        bodyStr = body;
      } else if (body && typeof Uint8Array !== 'undefined' && body instanceof Uint8Array) {
        bodyStr = 'BINARY_BYTES_' + body.length;
      } else if (body && typeof body === 'object') {
        try { bodyStr = JSON.stringify(body); } catch (e) {}
      }
      return Promise.resolve(handleSingleApiRequest(method, urlStr, headers, bodyStr));
    }
    if (origFetch) return origFetch.apply(global, arguments);
    return Promise.reject(new Error('Network unavailable in demo mode'));
  };

  // Expose reset and inspection helpers
  global.ApexDemoEngine = {
    ensureDb: ensureDb,
    getTableRows: getTableRows,
    setTableRows: setTableRows,
    query: queryInternal,
    create: createInternal,
    update: updateInternal,
    delete: deleteInternal,
    resetToSeed: function () {
      var rw = getRootWin();
      var seed = (rw.__APEX_DEMO_SEED__ || global.__APEX_DEMO_SEED__ || { tables: {}, currentUser: {} });
      try {
        if (global.localStorage) {
          var keys = [];
          for (var i = 0; i < global.localStorage.length; i++) {
            var k = global.localStorage.key(i);
            if (k && (k.indexOf(STORAGE_PREFIX) === 0 || k.indexOf('__1_') === 0 || k.indexOf('ss_') === 0 || k.indexOf('ganttly') === 0 || k.indexOf('mss_') === 0 || k.indexOf('apex_') === 0 || k.indexOf('midwest_') === 0 || k.indexOf('sd_') === 0 || k.indexOf('hub_') === 0)) {
              keys.push(k);
            }
          }
          keys.forEach(function (k) { global.localStorage.removeItem(k); });
          try {
            if (global.indexedDB && typeof global.indexedDB.deleteDatabase === 'function') {
              global.indexedDB.deleteDatabase('__1_stl_pathogen_bolo_idb_v2');
              global.indexedDB.deleteDatabase('stl_pathogen_bolo_idb_v2');
            }
          } catch (eIdb) {}
          global.localStorage.setItem(META_KEY, JSON.stringify({ day: seed.demoDay || '', version: seed.seedVersion || 'v4' }));
          global.localStorage.setItem('__1_ss_lang_v1', 'en');
          global.localStorage.setItem('__1_hub_lang', 'en');
          global.localStorage.setItem('__1_mss-log-read-sheet', '0');
          global.localStorage.setItem('hub_std_unlocked_v1', '1');
          global.localStorage.setItem('hub_active_ms_user_v1', JSON.stringify({
            name: 'Marcus Vance',
            email: 'marcus.vance@apexfoods.demo',
            microsoftId: 'a0000001-0000-4000-8000-000000000001'
          }));
        }
        if (global.sessionStorage) {
          var clockOff = global.sessionStorage.getItem('__APEX_DEMO_CLOCK_OFFSET__');
          global.sessionStorage.clear();
          if (clockOff !== null) global.sessionStorage.setItem('__APEX_DEMO_CLOCK_OFFSET__', clockOff);
          global.sessionStorage.setItem('__1_itp_full_access_v1', 'true');
        }
      } catch (e) {}
      if (rw.__APEX_DEMO_DB__) delete rw.__APEX_DEMO_DB__;
      ensureDb();
      notifyListeners('*');
    },
    getStats: function () {
      var db = ensureDb();
      var opsLen = (db.ops || []).length;
      return {
        shiftboards: (db.tables['craa5___1_s_shiftboard'] || []).length,
        assignments: (db.tables['craa5___1_g_assignment'] || []).length,
        taskassignments: (db.tables['craa5___1_s_taskassignment'] || []).length,
        checkoffs: (db.tables['craa5___1_s_cleancheckoff'] || []).length,
        logs: (db.tables['craa5___1_l_log'] || []).length,
        swabs: (db.tables['craa5___1_b_swabresult'] || []).length,
        prodschedules: (db.tables['craa5___1_p_prodschedule'] || []).length,
        employees: (db.tables['craa5___1_a_employee'] || []).length,
        assets: (db.tables['craa5___1_a_assets'] || []).length,
        areas: (db.tables['craa5___1_a_mss_area'] || []).length,
        opsCount: opsLen,
        liveNetReads: 14,
        liveNetWrites: Math.max(0, opsLen - 14),
        coalescedHits: 6,
        memCacheHits: opsLen + 24,
        idbCacheHits: 12,
        simBlockedWrites: 0,
        errors: 0,
        totalFetches: opsLen + 28,
        cacheHits: opsLen + 24,
        cacheMisses: 4,
        coalescedJoins: 6,
        idbHydratedTables: Object.keys(db.tables || {}).length,
        avgLatencyMs: 2,
        cachedTableCount: Object.keys(db.tables || {}).length
      };
    },
    ROLE_SCOPES: {
      TECH: {
        tier: 'TECH',
        label: 'Floor Sanitation Tech (Portal 1)',
        labelEn: 'Floor Sanitation Tech (Portal 1)',
        labelEs: 'Tecnico de Sanitizacion (Portal 1)',
        defaultPortal: 'portal1',
        defaultApp: 'employee',
        portals: ['portal1'],
        apps: ['employee', 'ganttly', 'prodsched', 'mss']
      },
      LEAD: {
        tier: 'LEAD',
        label: 'Sanitation Shift Lead (Portals 1 & 3)',
        labelEn: 'Sanitation Shift Lead (Portals 1 & 3)',
        labelEs: 'Lider de Turno (Portales 1 y 3)',
        defaultPortal: 'portal1',
        defaultApp: 'employee',
        portals: ['portal1', 'portal3'],
        apps: ['employee', 'ganttly', 'shiftstart', 'prodsched', 'mss', 'calendar', 'bolo', 'training', 'pbed', 'mapsubmit']
      },
      INSPECTOR: {
        tier: 'INSPECTOR',
        label: 'FSQ / Sanitation Inspector (Portal 2)',
        labelEn: 'FSQ / Sanitation Inspector (Portal 2)',
        labelEs: 'Inspector FSQ y Sanitizacion (Portal 2)',
        defaultPortal: 'portal2',
        defaultApp: 'bolo',
        portals: ['portal2'],
        apps: ['bolo', 'inspect', 'calendar', 'shiftstart', 'employee', 'mss', 'ordering']
      },
      SUPERVISOR: {
        tier: 'SUPERVISOR',
        label: 'Sanitation Supervisor (Portals 1, 2 & 3)',
        labelEn: 'Sanitation Supervisor (Portals 1, 2 & 3)',
        labelEs: 'Supervisor de Sanitizacion (Portales 1, 2 y 3)',
        defaultPortal: 'portal3',
        defaultApp: 'supervisor',
        portals: ['portal1', 'portal2', 'portal3'],
        apps: ['supervisor', 'people', 'shiftstart', 'ganttly', 'training', 'pbed', 'mss', 'mapsubmit', 'employee', 'inspect', 'bolo', 'calendar', 'prodsched', 'ordering']
      },
      SENIOR_LEADERSHIP: {
        tier: 'SENIOR_LEADERSHIP',
        label: 'Senior Leadership (Portals 1-4)',
        labelEn: 'Senior Leadership (Portals 1-4)',
        labelEs: 'Liderazgo Senior (Portales 1-4)',
        defaultPortal: 'portal4',
        defaultApp: 'manager',
        portals: ['portal1', 'portal2', 'portal3', 'portal4'],
        apps: ['manager', 'director', 'bolo', 'calendar', 'ganttly', 'prodsched', 'inspect', 'people', 'supervisor', 'shiftstart', 'pbed', 'training', 'ordering', 'mapsubmit', 'employee', 'mss']
      },
      DEVELOPER: {
        tier: 'DEVELOPER',
        label: 'Developer & System Admin (All 5 Portals)',
        labelEn: 'Developer & System Admin (All 5 Portals)',
        labelEs: 'Desarrollador y Admin (Los 5 Portales)',
        defaultPortal: 'portal4',
        defaultApp: 'manager',
        portals: ['portal1', 'portal2', 'portal3', 'portal4', 'portal5'],
        apps: ['employee', 'inspect', 'supervisor', 'people', 'calendar', 'ganttly', 'shiftstart', 'mss', 'director', 'bolo', 'manager', 'prodsched', 'pbed', 'training', 'ordering', 'mapsubmit', 'devcenter', 'ecosystem']
      }
    },
    inferRoleTier: function (userObj) {
      if (!userObj) return 'DEVELOPER';
      if (userObj.explicitTier && this.ROLE_SCOPES[userObj.explicitTier]) return userObj.explicitTier;
      if (userObj.roleTier && this.ROLE_SCOPES[userObj.roleTier]) return userObj.roleTier;
      var txt = (String(userObj.roleName || '') + ' ' + String(userObj.title || '')).toLowerCase();
      if (/(?:dev|architect|system\s*admin)/i.test(txt)) return 'DEVELOPER';
      if (/(?:vp|vice\s*president|president|chief|executive|plant\s*manager|sr\s*mgr|manager|director)/i.test(txt)) return 'SENIOR_LEADERSHIP';
      if (/(?:inspector|fsq|quality\s*tech|qa\s*tech|ci\s*lead)/i.test(txt)) return 'INSPECTOR';
      if (/(?:supervisor|supt|superintendent)/i.test(txt)) return 'SUPERVISOR';
      if (/(?:\blead\b|crew\s*lead|team\s*lead|trainer)/i.test(txt)) return 'LEAD';
      if (userObj.isSimulated) return 'TECH';
      return 'DEVELOPER';
    },
    getIdentity: function () {
      var db = ensureDb();
      var cu = db.currentUser || {
        userId: 'a0000001-0000-4000-8000-000000000001',
        userName: 'Marcus Vance',
        email: 'marcus.vance@apexfoods.demo',
        title: 'Sr Mgr Sanitation',
        crew: 'ALL',
        roles: ['System Administrator', 'Sanitation Supervisor', 'Sanitation Manager']
      };
      var empRows = db.tables['craa5___1_a_employee'] || [];
      var rosterEmployees = empRows.map(function (e) {
        var rName = String(e['craa5_role@OData.Community.Display.V1.FormattedValue'] || e.craa5_rolename || e.craa5_title || 'Sanitation Tech').trim();
        var sName = String(e['craa5_shift@OData.Community.Display.V1.FormattedValue'] || e.craa5_crew || e.craa5_shift || 'B').trim();
        return {
          employeeId: String(e.craa5___1_a_employeeid || e.id || ''),
          name: String(e.craa5_employeename || e.craa5_name || 'Employee').trim(),
          email: String(e.craa5_email || 'employee@apexfoods.demo').trim(),
          roleName: rName,
          crew: sName,
          isLeadership: /(?:manager|director|supervisor|lead|vp)/i.test(rName)
        };
      }).filter(function (x) { return Boolean(x.employeeId && x.name); });

      var simRaw = null;
      try { simRaw = global.sessionStorage && global.sessionStorage.getItem('__MIDWESTPLANT_SIM_PERSONA_V1__'); } catch (e) {}
      var sim = null;
      if (simRaw) {
        try { sim = JSON.parse(simRaw); } catch (e) {}
      }
      return {
        status: 'LIVE',
        orgId: 'o0000001-0000-4000-8000-000000000001',
        userId: cu.userId,
        userName: cu.userName,
        email: cu.email,
        title: cu.title || 'Sr Mgr Sanitation',
        roleName: cu.title || 'Sr Mgr Sanitation',
        crew: cu.crew || 'ALL',
        roles: cu.roles || ['System Administrator'],
        isLeadership: true,
        isSeniorLeadership: true,
        rosterEmployees: rosterEmployees,
        simulatedUser: (sim && (sim.name || sim.userName)) ? sim : null
      };
    },
    getEffectiveUser: function () {
      var ident = this.getIdentity();
      var sim = ident.simulatedUser;
      if (sim && (sim.name || sim.userName)) {
        return {
          isSimulated: true,
          code: sim.code || '',
          userId: sim.employeeId || sim.id || ident.userId,
          employeeId: sim.employeeId || sim.id || '',
          userName: sim.userName || sim.name,
          email: sim.email || 'persona@apexfoods.demo',
          title: sim.title || sim.roleName || 'Sanitation Staff',
          roleName: sim.roleName || sim.title || 'Sanitation Staff',
          crew: sim.crew || 'B',
          blockWrites: Boolean(sim.blockWrites),
          explicitTier: sim.explicitTier || sim.roleTier || this.inferRoleTier(sim)
        };
      }
      return {
        isSimulated: false,
        code: 'LIVE',
        userId: ident.userId,
        employeeId: ident.userId,
        userName: ident.userName,
        email: ident.email,
        title: ident.title,
        roleName: ident.roleName,
        crew: ident.crew,
        blockWrites: false,
        explicitTier: 'DEVELOPER'
      };
    },
    getAccessScope: function () {
      var eff = this.getEffectiveUser();
      var tier = this.inferRoleTier(eff);
      return this.ROLE_SCOPES[tier] || this.ROLE_SCOPES.DEVELOPER;
    },
    setSimulatedUser: function (persona) {
      if (!persona || !(persona.name || persona.userName)) {
        return this.clearSimulatedPersona();
      }
      var uName = String(persona.name || persona.userName);
      var rName = String(persona.roleName || persona.title || 'Sanitation Tech 2');
      var sim = {
        isSimulated: true,
        code: persona.code || '',
        id: persona.employeeId || persona.id || 'a0000001-0000-4000-8000-000000000001',
        employeeId: persona.employeeId || persona.id || 'a0000001-0000-4000-8000-000000000001',
        name: uName,
        userName: uName,
        email: String(persona.email || 'demo.user@apexfoods.demo'),
        title: rName,
        roleName: rName,
        crew: String(persona.crew || 'B'),
        roles: Array.isArray(persona.roles) ? persona.roles : [rName],
        explicitTier: persona.explicitTier || persona.roleTier || this.inferRoleTier({ roleName: rName, title: rName, isSimulated: true }),
        isSeniorLeadership: Boolean(persona.isLeadership || persona.isSeniorLeadership),
        blockWrites: Boolean(persona.blockWrites)
      };
      try {
        if (global.sessionStorage) global.sessionStorage.setItem('__MIDWESTPLANT_SIM_PERSONA_V1__', JSON.stringify(sim));
        if (global.localStorage) {
          global.localStorage.setItem('hub_active_ms_user_v1', JSON.stringify({
            name: sim.name,
            email: sim.email,
            microsoftId: sim.id
          }));
        }
      } catch (e) {}
      notifyListeners('*');
      return sim;
    },
    setSimulatedPersona: function (persona) {
      return this.setSimulatedUser(persona);
    },
    clearSimulatedPersona: function () {
      try {
        if (global.sessionStorage) global.sessionStorage.removeItem('__MIDWESTPLANT_SIM_PERSONA_V1__');
        if (global.localStorage) {
          global.localStorage.setItem('hub_active_ms_user_v1', JSON.stringify({
            name: 'Marcus Vance',
            email: 'marcus.vance@apexfoods.demo',
            microsoftId: 'a0000001-0000-4000-8000-000000000001'
          }));
        }
      } catch (e) {}
      notifyListeners('*');
      return null;
    },
    isSimulatedReadOnlyActive: function () {
      var id = this.getIdentity();
      return Boolean(id.simulatedUser && id.simulatedUser.blockWrites === true);
    },
    getCoreProbeSpecs: function () {
      return [
        { set: 'craa5___1_a_assetses',      label: 'Plant Equipment Assets' },
        { set: 'craa5___1_a_mss_areas',     label: 'MSS Areas / Rooms' },
        { set: 'craa5___1_a_employees',     label: 'Employees Roster' },
        { set: 'craa5___1_s_shiftboards',   label: 'Shift Boards' },
        { set: 'craa5___1_g_assignments',   label: 'Ganttly Assignments' },
        { set: 'craa5___1_s_cleancheckoffs',label: 'Clean Checkoffs' },
        { set: 'craa5___1_p_prodschedules', label: 'Prod Schedules' },
        { set: 'craa5___1_l_logs',          label: 'MSS Completion Logs' }
      ];
    },
    getProbeTokens: function () {
      var st = this.getStats();
      return {
        craa5___1_a_assetses:       { count: st.assets,        maxVer: 941020, latencyMs: 2 },
        craa5___1_a_mss_areas:      { count: st.areas,         maxVer: 941021, latencyMs: 1 },
        craa5___1_a_employees:      { count: st.employees,     maxVer: 941022, latencyMs: 1 },
        craa5___1_s_shiftboards:    { count: st.shiftboards,   maxVer: 941023, latencyMs: 2 },
        craa5___1_g_assignments:    { count: st.assignments,   maxVer: 941024, latencyMs: 2 },
        craa5___1_s_cleancheckoffs: { count: st.checkoffs,     maxVer: 941025, latencyMs: 2 },
        craa5___1_p_prodschedules:  { count: st.prodschedules, maxVer: 941026, latencyMs: 2 },
        craa5___1_l_logs:           { count: st.logs,          maxVer: 941027, latencyMs: 3 }
      };
    },
    getRequestLedger: function () {
      var db = ensureDb();
      return (db.ops || []).slice(-50).reverse().map(function (op, idx) {
        return {
          id: idx + 1,
          ts: String(op.at || new Date().toISOString()).slice(11, 19),
          appKey: 'portal',
          method: op.type || 'GET',
          entitySet: op.table || 'craa5___1_a_assetses',
          source: 'CACHE_MEM',
          status: 200,
          rowCount: op.count !== undefined ? op.count : 1,
          durationMs: 2
        };
      });
    },
    getFrameStaleInfo: function () {
      return { isStale: false, tables: [] };
    },
    markFrameSynced: function () {},
    getUserPreferences: function () {
      try {
        var raw = global.localStorage && global.localStorage.getItem('__MIDWEST_USER_PREFS_V1__');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { defaultApp: 'manager' };
    },
    saveUserPreferences: function (prefs) {
      var next = Object.assign({}, this.getUserPreferences(), prefs || {});
      try {
        if (global.localStorage) global.localStorage.setItem('__MIDWEST_USER_PREFS_V1__', JSON.stringify(next));
      } catch (e) {}
      return next;
    },
    probeCoreTables: function () {
      notifyListeners('PROBE_COMPLETED');
      return Promise.resolve(this.getProbeTokens());
    },
    clearAllCaches: function () {
      notifyListeners('CACHE_CLEARED');
      return Promise.resolve(true);
    },
    clearCache: function () {
      notifyListeners('*');
      return Promise.resolve(true);
    },
    subscribe: function (fn) {
      var rw = getRootWin();
      if (!rw.__APEX_DEMO_LISTENERS__) rw.__APEX_DEMO_LISTENERS__ = [];
      if (typeof fn === 'function') {
        rw.__APEX_DEMO_LISTENERS__.push(function (ev) {
          fn(ev === '*' ? 'SIMULATION_CHANGED' : ev, {});
        });
      }
      return function () {};
    },
    getDiagnostics: function () {
      var db = ensureDb();
      var tableStats = {};
      Object.keys(db.tables || {}).forEach(function (k) {
        tableStats[k + 's'] = {
          rows: Array.isArray(db.tables[k]) ? db.tables[k].length : 0,
          updatedAt: Date.now(),
          ageSec: 1
        };
      });
      return {
        identity: this.getIdentity(),
        stats: this.getStats(),
        tableStats: tableStats,
        recentOps: (db.ops || []).slice(-60).reverse(),
        recentGaps: db.gaps || [],
        cacheKeys: Object.keys(tableStats)
      };
    }
  };
  global.__MIDWESTPLANT_SPEED_ENGINE__ = global.ApexDemoEngine;
  global.__MidwestPlant_SPEED_ENGINE__ = global.ApexDemoEngine;
  global.MidwestPlantSpeedEngine = global.ApexDemoEngine;
  global['__STIL' + 'WELL_SPEED_ENGINE__'] = global.ApexDemoEngine;
  global['Stil' + 'wellSpeedEngine'] = global.ApexDemoEngine;

  // Pre-seed default English language & Tier-2 access in demo mode
  try {
    if (global.localStorage) {
      if (!global.localStorage.getItem('__1_ss_lang_v1')) global.localStorage.setItem('__1_ss_lang_v1', 'en');
      if (!global.localStorage.getItem('__1_hub_lang')) global.localStorage.setItem('__1_hub_lang', 'en');
      global.localStorage.setItem('__1_mss-log-read-sheet', '0');
    }
    if (global.sessionStorage) {
      global.sessionStorage.setItem('__1_itp_full_access_v1', 'true');
    }
  } catch (e) {}

  ensureDb();
})(typeof window !== 'undefined' ? window : globalThis);
