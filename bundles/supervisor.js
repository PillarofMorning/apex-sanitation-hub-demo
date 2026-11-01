(function() {
var React = window.React;
var {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} = React;

// ============================================================================
// Apex Foods SANITATION - SUPERVISOR HUB (PLAYGROUND)
// File: hub - supervisor.txt
// Features:
//   - Microsoft ID Authentication & Automatic Shift/Supervisor Scoping
//   - Tab 5 (DEFAULT LOAD): Supervisor To-Do (Manager tasks highlighted in RED,
//     close out with required Photo Proof or Scanned Paper Proof)
//   - Tab 1: 6-9-12-3 Team Builds & Hierarchical Goals (1-Room, 2-Area,
//     3-Subcategory) + Carry Onto Next Shift in Handoff
//   - Tab 2: Alter Current Shift Board (One-Window Assign Employees, Custom
//     Areas, Employee Reset to Unutilized, Ganttly-style Down Time Popup)
//   - Tab 3: Bulk / Single Photo Upload & Interactive Map Tagging (Extra Cleans,
//     PM, Project Completion; Before required, After gets Timestamp Default Name)
//   - Tab 4: Photo Journal DataTable (Linked to Bulk Photo Submissions with
//     Full Edit Capability for All Columns & Links)
//   - Tab 6: Weekly Clean Plan Overview & Daily Shift Timing Adjustment
//     (Supervisor's shift only, Reason required, live updates craa5___1_p_cleanplan)
//   - Tab 7: Shift Employee Query & Profile Viewer (Manager Hub style, strictly
//     locked to Supervisor's Shift & Supervisor ID)
//   - Tab 8: Personal File Uploader & SharePoint Navigator (Set/Link SharePoint
//     paths, create folders for Photos/Notes/Files, custom file naming)
// ============================================================================

const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDA0NjhCIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMDA0NjhCIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=";
const BRAND = {
  blue: '#0072CE',
  blueDark: '#00468B',
  blueSoft: '#E6F1FB',
  yellow: '#FFB81C',
  yellowSoft: '#FFF6E0',
  red: '#E4002B',
  redSoft: '#FDE8EC'
};
const BRAND_NAVY = '#00468B';
const BRAND_RED = '#E4002B';
const BRAND_GOLD = '#FFB81C';
function BrandLogo({
  onClick,
  unlocked
} = {}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    title: onClick ? 'Click Apex Foods logo to toggle Profile & Controls' : 'Apex Foods',
    "aria-label": "Company logo",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 15,
      letterSpacing: '0.02em',
      color: '#1F2937',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      cursor: onClick ? 'pointer' : 'default',
      background: unlocked ? '#FFF6E0' : 'transparent',
      border: unlocked ? '1.5px solid #FFB81C' : '1.5px solid transparent',
      borderRadius: 10,
      padding: '2px 8px'
    }
  }, LOGO_URL ? /*#__PURE__*/React.createElement("img", {
    src: LOGO_URL,
    alt: "Apex Foods logo",
    style: {
      height: 34,
      width: 'auto',
      display: 'block',
      flexShrink: 0,
      borderRadius: 6,
      background: '#FFFFFF',
      padding: '1px 4px'
    }
  }) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 40 40",
    width: "34",
    height: "34",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "9",
    fill: BRAND.blue
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "27",
    cy: "20",
    r: "8",
    fill: BRAND.yellow
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "29",
    r: "8",
    fill: BRAND.red
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#1F2937'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 800
    }
  }, "Apex Foods")));
}
const SHIFT_CODES = ['A', 'B', 'C', 'D'];
const QUARTER_SLOTS = ['6:00', '9:00', '12:00', '3:00'];
const PHOTO_CATEGORIES = ['Extra Cleans', 'PM', 'Project Completion'];
const DOWNTIME_CATEGORIES = ['Mechanical / Maintenance', 'Production Run Late', 'Water / Pressure Issue', 'Chemical / Supply Issue', 'Lockout / Tagout Delay', 'Staffing / Redeployment', 'Inspection / QA Hold', 'Other'];
const SETUP_CHECK_OPTIONS = ['LOTO Verified', 'Chemical Titration Checked', 'Hot Water Temp Verified', 'Belts / Guards Removed', 'Floor Drains Cleared', 'QA Pre-Op Notified'];
// ============================================================================
// UTILITY & DATAVERSE HELPERS
// ============================================================================

function getBaseUrl() {
  try {
    const w = window;
    if (w.Xrm?.Utility?.getGlobalContext) {
      const url = w.Xrm.Utility.getGlobalContext().getClientUrl();
      if (url) return url.replace(/\/$/, '');
    }
  } catch {}
  return window.location.origin;
}
function cleanGuid(val) {
  return String(val || '').replace(/[{}]/g, '').trim().toLowerCase();
}
function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function formatTimestampForName(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}_${hh}${mm}${ss}`;
}
function buildDefaultAfterRefName(category, room, area, index = 1) {
  const catSlug = String(category || 'CLEAN').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  const locSlug = String(area || room || 'AREA').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 18);
  const ts = formatTimestampForName(new Date());
  const idxStr = String(index).padStart(2, '0');
  return `AFTER_${catSlug}_${locSlug}_${ts}_${idxStr}`;
}
function safeJsonParse(raw, fallback) {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function normalizeShiftCode(raw) {
  const s = String(raw || '').toUpperCase().trim();
  if (s.includes('B') || s === '2' || s.includes('SHIFT B') || s.includes('CREW B')) return 'B';
  if (s.includes('C') || s === '3' || s.includes('SHIFT C') || s.includes('CREW C')) return 'C';
  if (s.includes('D') || s === '4' || s.includes('SHIFT D') || s.includes('CREW D')) return 'D';
  return 'A';
}
function nextShiftCode(shift) {
  if (shift === 'A') return 'B';
  if (shift === 'B') return 'C';
  if (shift === 'C') return 'D';
  return 'A';
}
async function dvFetch(path, options = {}) {
  const cleanP = String(path || '').replace(/^https?:\/\/[^/]+\/api\/data\/v9\.2\//i, '').replace(/^\//, '');
  if (!/^(craa5___1_|systemusers?\b|WhoAmI\b)/i.test(cleanP)) {
    const m = String(options.method || 'GET').toUpperCase();
    if (m !== 'GET') throw new Error('Sandbox guard: blocked write to ' + cleanP);
    return {
      value: []
    };
  }
  const base = getBaseUrl();
  const url = path.startsWith('http') ? path : `${base}/api/data/v9.2/${path.replace(/^\//, '')}`;
  const headers = {
    Accept: 'application/json',
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0',
    ...(options.headers || {})
  };
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  const resp = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Dataverse HTTP ${resp.status}: ${errText.slice(0, 300)}`);
  }
  if (resp.status === 204) return null;
  const text = await resp.text();
  return text ? JSON.parse(text) : null;
}
async function dvGetFirstAvailable(entitySets, query = '') {
  for (const set of entitySets) {
    try {
      const q = query ? query.startsWith('?') ? query : `?${query}` : '';
      const data = await dvFetch(`${set}${q}`);
      if (data && Array.isArray(data.value)) {
        return {
          set,
          rows: data.value
        };
      }
    } catch {}
  }
  return {
    set: entitySets[0] || '',
    rows: []
  };
}
async function loadHubConfigJson(configKey, fallback) {
  const sets = ['craa5___1_e_hubconfigs', 'craa5___1_e_hubconfigs', 'craa5___1_e_hubconfigs'];
  for (const set of sets) {
    try {
      const res = await dvFetch(`${set}?$top=250`);
      const rows = res?.value || [];
      const match = rows.find(r => String(r.craa5_configkey || r.craa5_configname || r.craa5_name || '').toUpperCase() === configKey.toUpperCase());
      if (match) {
        const idKey = Object.keys(match).find(k => k.endsWith('id') && cleanGuid(match[k]).length === 36) || 'craa5___1_e_hubconfigid';
        const rawJson = match.craa5_configjson || match.craa5_value || match.craa5_json || '';
        return {
          rowId: cleanGuid(match[idKey]),
          entitySet: set,
          value: safeJsonParse(rawJson, fallback)
        };
      }
      return {
        rowId: null,
        entitySet: set,
        value: fallback
      };
    } catch {}
  }
  try {
    const localRaw = localStorage.getItem('__1_' + `apexS_SUP_HUB_${configKey}`);
    if (localRaw) {
      return {
        rowId: null,
        entitySet: 'craa5___1_e_hubconfigs',
        value: safeJsonParse(localRaw, fallback)
      };
    }
  } catch {}
  return {
    rowId: null,
    entitySet: 'craa5___1_e_hubconfigs',
    value: fallback
  };
}
async function saveHubConfigJson(configKey, data) {
  const jsonStr = JSON.stringify(data);
  try {
    localStorage.setItem('__1_' + `apexS_SUP_HUB_${configKey}`, jsonStr);
  } catch {}
  const sets = ['craa5___1_e_hubconfigs', 'craa5___1_e_hubconfigs', 'craa5___1_e_hubconfigs'];
  for (const set of sets) {
    try {
      const res = await dvFetch(`${set}?$top=250`);
      const rows = res?.value || [];
      const match = rows.find(r => String(r.craa5_configkey || r.craa5_configname || r.craa5_name || '').toUpperCase() === configKey.toUpperCase());
      const payload = {
        craa5_configkey: configKey,
        craa5_configname: configKey,
        craa5_configjson: jsonStr
      };
      if (match) {
        const idKey = Object.keys(match).find(k => k.endsWith('id') && cleanGuid(match[k]).length === 36) || 'craa5___1_e_hubconfigid';
        await dvFetch(`${set}(${cleanGuid(match[idKey])})`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await dvFetch(set, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      return true;
    } catch {}
  }
  return false;
}
async function compressImageFileToDataUrl(file, maxDim = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const rawDataUrl = String(reader.result || '');
      if (!file.type.startsWith('image/')) {
        const base64 = rawDataUrl.includes(',') ? rawDataUrl.split(',')[1] : '';
        const bin = atob(base64 || '');
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        resolve({
          dataUrl: rawDataUrl,
          base64,
          bytes
        });
        return;
      }
      const img = new Image();
      img.onerror = () => {
        const base64 = rawDataUrl.includes(',') ? rawDataUrl.split(',')[1] : '';
        const bin = atob(base64 || '');
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        resolve({
          dataUrl: rawDataUrl,
          base64,
          bytes
        });
      };
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w >= h) {
            h = Math.round(h * maxDim / w);
            w = maxDim;
          } else {
            w = Math.round(w * maxDim / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        const compressedUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = compressedUrl.split(',')[1] || '';
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        resolve({
          dataUrl: compressedUrl,
          base64,
          bytes
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// DELEGATED EXCEL CHECKLIST & MANAGER TASK METADATA HELPERS
// 100% compatible with Manager Hub (`P4.3 - hub - manager.txt` `---MH_TASK_META---`
// and `[MH_CHECKLIST]` / `mh_delegated_tasks_meta_v1`)
// ============================================================================

const MH_TASK_META_MARKER = '\n---MH_TASK_META---\n';
const MH_TASK_LOCAL_KEY = 'mh_delegated_tasks_meta_v1';
const CHECKLIST_STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'Scheduled', 'Exempt', 'Needs Follow-up'];
function loadLocalDelegatedTaskMetaMap() {
  try {
    const raw = window.localStorage.getItem('__1_' + MH_TASK_LOCAL_KEY);
    return raw ? JSON.parse(raw) || {} : {};
  } catch {
    return {};
  }
}
function saveLocalDelegatedTaskMeta(key, meta) {
  if (!key || !meta) return;
  try {
    const map = loadLocalDelegatedTaskMetaMap();
    map[key] = meta;
    window.localStorage.setItem('__1_' + MH_TASK_LOCAL_KEY, JSON.stringify(map));
  } catch {}
}
function getChecklistStats(checklist) {
  if (!checklist || !Array.isArray(checklist.rows) || checklist.rows.length === 0) {
    return {
      hasChecklist: false,
      total: 0,
      completed: 0,
      pct: 0
    };
  }
  const total = checklist.rows.length;
  const completed = checklist.rows.filter(r => Boolean(r.checked)).length;
  return {
    hasChecklist: true,
    total,
    completed,
    pct: total > 0 ? Math.round(completed / total * 100) : 0
  };
}
function inferChecklistColType(headerName, sampleVals) {
  const h = String(headerName || '').toLowerCase();
  if (/done|check|complete|verified|pass|sign[\s_-]*off|ok\b/.test(h)) return 'checkbox';
  if (/status|state|stage|progress|result/.test(h)) return 'status';
  if (/date|due|expires|completed on|trained on|deadline/.test(h)) return 'date';
  if (/employee|name|person|trainee|trainer|supervisor|assigned|owner|lead/.test(h)) return 'person';
  if (/score|hours|qty|count|amount|number|pct|%/.test(h)) return 'number';
  const nonEmpty = (sampleVals || []).filter(v => String(v || '').trim() !== '');
  if (nonEmpty.length > 0 && nonEmpty.every(v => /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(String(v).trim()))) {
    return 'date';
  }
  if (nonEmpty.length > 0 && nonEmpty.every(v => /^(yes|no|true|false|done|x|y|n|completed|pending)$/i.test(String(v).trim()))) {
    return 'status';
  }
  return 'text';
}
function parseExcelPasteToChecklist(rawText, hasHeaders = true) {
  const text = String(rawText || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!text) return {
    columns: [],
    rows: []
  };
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return {
    columns: [],
    rows: []
  };
  const firstLine = lines[0];
  const delim = firstLine.includes('\t') ? '\t' : firstLine.includes('|') ? '|' : ',';
  const grid = lines.map(line => line.split(delim).map(c => c.trim().replace(/^"|"$/g, '')));
  const maxCols = grid.reduce((m, r) => Math.max(m, r.length), 0);
  if (maxCols === 0) return {
    columns: [],
    rows: []
  };
  const headerRow = hasHeaders ? grid[0] : [];
  const dataRows = hasHeaders ? grid.slice(1) : grid;
  const columns = [];
  for (let c = 0; c < maxCols; c++) {
    const colName = hasHeaders && headerRow[c] ? headerRow[c] : `Column ${c + 1}`;
    const samples = dataRows.slice(0, 8).map(r => r[c] || '');
    columns.push({
      id: `col_${c + 1}`,
      name: colName,
      type: inferChecklistColType(colName, samples),
      included: true
    });
  }
  const rows = dataRows.map((r, idx) => {
    const cells = {};
    let preChecked = false;
    columns.forEach((col, cIdx) => {
      const val = r[cIdx] !== undefined ? String(r[cIdx]).trim() : '';
      cells[col.id] = val;
      if ((col.type === 'status' || col.type === 'checkbox') && /^(done|complete|completed|yes|true|pass|passed|verified|ok|x|1)$/i.test(val)) {
        preChecked = true;
      }
    });
    return {
      id: `row_${idx + 1}_${Math.random().toString(36).slice(2, 6)}`,
      checked: preChecked,
      cells
    };
  });
  return {
    columns,
    rows
  };
}
function parseSupervisorTodoDescription(rawDescInput, id, taskTitle, assignedTo) {
  let working = String(rawDescInput || '');
  const isSelfTask = working.includes('[SELF-TASK]');
  working = working.replace('[SELF-TASK]', '').trim();
  let meta = null;
  let notesPart = working;

  // 1. Check `---MH_TASK_META---` marker from Manager Hub
  const markerIdx = working.indexOf('---MH_TASK_META---');
  if (markerIdx >= 0) {
    notesPart = working.slice(0, markerIdx).trim();
    const afterMarker = working.slice(markerIdx + '---MH_TASK_META---'.length).trim();
    // Resilient JSON extraction even if a `[Closed by ...]` line was appended after the JSON object
    const lastBrace = afterMarker.lastIndexOf('}');
    if (lastBrace >= 0) {
      const jsonCandidate = afterMarker.slice(0, lastBrace + 1);
      const trailingText = afterMarker.slice(lastBrace + 1).trim();
      try {
        meta = JSON.parse(jsonCandidate);
      } catch {
        meta = null;
      }
      if (trailingText) {
        notesPart = notesPart ? `${notesPart}\n${trailingText}` : trailingText;
      }
    }
  }

  // 2. Also support `[MH_CHECKLIST]...[/MH_CHECKLIST]` or `[MH_META]...[/MH_META]` tags if present
  const chkTagMatch = /\[MH_CHECKLIST\]([\s\S]*?)\[\/MH_CHECKLIST\]/i.exec(notesPart);
  if (chkTagMatch) {
    const parsedChk = safeJsonParse(chkTagMatch[1].trim(), null);
    if (parsedChk && Array.isArray(parsedChk.rows)) {
      meta = {
        ...(meta || {}),
        checklist: parsedChk
      };
    }
    notesPart = notesPart.replace(chkTagMatch[0], '').trim();
  }

  // 3. Strip auto-generated `Category: ... - Priority: ...` header line from clean description
  const firstLineMatch = /^Category:\s*([^-\n]+)\s*-\s*Priority:\s*([^-\n]+)(?:\s*-\s*[^\n]*)?\n?/i.exec(notesPart);
  if (firstLineMatch) {
    notesPart = notesPart.slice(firstLineMatch[0].length).trim();
  }

  // 4. Fallback to localStorage `mh_delegated_tasks_meta_v1`
  const localMap = loadLocalDelegatedTaskMetaMap();
  const fallbackKey = `${taskTitle}|${assignedTo}`;
  const localMeta = localMap[id] || localMap[fallbackKey];
  if ((!meta || !meta.checklist) && localMeta) {
    meta = {
      ...(meta || {}),
      ...localMeta
    };
  }
  const category = meta && meta.category || (firstLineMatch ? firstLineMatch[1].trim() : '') || (/training|cert|sop/i.test(taskTitle) ? 'Training' : /audit|sanitation|mss/i.test(taskTitle) ? 'Sanitation / MSS' : /safety|loto/i.test(taskTitle) ? 'Safety / LOTO' : 'General');
  const taskPriority = meta && meta.priority || (firstLineMatch ? firstLineMatch[2].trim() : '') || (isSelfTask ? 'Normal' : 'High');
  const taskShift = meta && meta.shift || 'All';
  const assignedName = meta && meta.assignedName || assignedTo || '';
  const createdBy = meta && meta.createdBy || '';
  const checklist = meta && meta.checklist && Array.isArray(meta.checklist.rows) && meta.checklist.rows.length > 0 ? {
    columns: Array.isArray(meta.checklist.columns) ? meta.checklist.columns : [],
    rows: meta.checklist.rows
  } : null;
  return {
    cleanDescription: notesPart,
    isSelfTask,
    category,
    taskPriority,
    taskShift,
    assignedName,
    createdBy,
    checklist
  };
}
function serializeSupervisorTodoDescription(todo, extraCloseoutLine) {
  const baseNotes = String(todo.description || '').trim();
  const combinedNotes = extraCloseoutLine ? baseNotes ? `${baseNotes}\n${extraCloseoutLine}` : extraCloseoutLine : baseNotes;
  const hasChecklist = Boolean(todo.checklist && Array.isArray(todo.checklist.rows) && todo.checklist.rows.length > 0);
  if (!todo.fromManager && !hasChecklist && !todo.category) {
    return `[SELF-TASK] ${combinedNotes}`.trim();
  }
  const cat = todo.category || 'General';
  const prio = todo.taskPriority || (todo.fromManager ? 'High' : 'Normal');
  const shift = todo.taskShift || 'All';
  const assignedName = todo.assignedName || todo.assignedTo || '';
  const headerBits = [`Category: ${cat}`, `Priority: ${prio}`];
  if (shift && shift !== 'All') headerBits.push(`Shift: ${shift}`);
  if (assignedName) headerBits.push(`Assigned: ${assignedName}`);
  const stats = getChecklistStats(todo.checklist);
  if (stats.hasChecklist) {
    headerBits.push(`Checklist: ${stats.completed}/${stats.total} (${stats.pct}%)`);
  }
  const topText = headerBits.join(' - ') + (combinedNotes ? `\n${combinedNotes}` : '');
  const payload = {
    v: 1,
    category: cat,
    priority: prio,
    shift,
    assignedName,
    createdBy: todo.createdBy || '',
    checklist: hasChecklist ? {
      columns: (todo.checklist.columns || []).filter(c => c.included !== false).map(c => ({
        id: c.id,
        name: c.name,
        type: c.type || 'text',
        included: true
      })),
      rows: todo.checklist.rows
    } : null
  };
  if (todo.id) saveLocalDelegatedTaskMeta(todo.id, payload);
  if (todo.taskTitle) saveLocalDelegatedTaskMeta(`${todo.taskTitle}|${todo.assignedTo}`, payload);
  return `${topText}${MH_TASK_META_MARKER}${JSON.stringify(payload)}`;
}

// ============================================================================
// INLINE SVG ICONS (Strict 7-Bit ASCII, Explicit Dimensions for Power Apps Host)
// ============================================================================

const IconShieldUser = () => /*#__PURE__*/React.createElement("svg", {
  width: 18,
  height: 18,
  style: {
    width: 18,
    height: 18,
    flexShrink: 0
  },
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "2.5"
}), /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M8.5 16.5c1-1.8 2.2-2.5 3.5-2.5s2.5.7 3.5 2.5"
}));
const IconAlertBell = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-5-5.9V4a1 1 0 10-2 0v1.1A6 6 0 006 11v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
}));
const IconCamera = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M3 7h3l2-2h8l2 2h3a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "13",
  r: "3.5"
}));
const IconFolder = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
}));
const IconClock = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9"
}), /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M12 7v5l3 2"
}));
const IconCheckCircle = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9"
}), /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M8.5 12.5l2.5 2.5 4.5-5"
}));
const IconUsers = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "10",
  cy: "7",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M21 20v-1a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
}));
const IconMapPin = () => /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  style: {
    width: 16,
    height: 16,
    flexShrink: 0
  },
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24"
}, /*#__PURE__*/React.createElement("path", {
  strokeLinecap: "round",
  strokeLinejoin: "round",
  d: "M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "2.5"
}));

// Self-contained stylesheet so Power Apps Generative Page host renders all utility classes without external CDNs
const SUPERVISOR_HUB_STYLES = `
.sup-hub-root, .sup-hub-root *, .sup-hub-root *::before, .sup-hub-root *::after { box-sizing: border-box; }
.sup-hub-root { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; line-height: 1.4; color: #0f172a; background-color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; }
.sup-hub-root h1, .sup-hub-root h2, .sup-hub-root h3, .sup-hub-root h4, .sup-hub-root p { margin: 0; }
.sup-hub-root button { cursor: pointer; font-family: inherit; border: none; background: transparent; }
.sup-hub-root input, .sup-hub-root select, .sup-hub-root textarea { font-family: inherit; outline: none; }
.sup-hub-root svg { flex-shrink: 0; display: inline-block; vertical-align: middle; }
.sup-hub-root .min-h-screen { min-height: 100vh; }
.sup-hub-root .flex { display: flex; }
.sup-hub-root .inline-flex { display: inline-flex; }
.sup-hub-root .block { display: block; }
.sup-hub-root .inline-block { display: inline-block; }
.sup-hub-root .hidden { display: none; }
.sup-hub-root .grid { display: grid; }
.sup-hub-root .flex-col { flex-direction: column; }
.sup-hub-root .flex-wrap { flex-wrap: wrap; }
.sup-hub-root .flex-1 { flex: 1 1 0%; }
.sup-hub-root .flex-shrink-0, .sup-hub-root .shrink-0 { flex-shrink: 0; }
.sup-hub-root .items-center { align-items: center; }
.sup-hub-root .items-start { align-items: flex-start; }
.sup-hub-root .items-end { align-items: flex-end; }
.sup-hub-root .justify-between { justify-content: space-between; }
.sup-hub-root .justify-center { justify-content: center; }
.sup-hub-root .justify-end { justify-content: flex-end; }
.sup-hub-root .gap-1 { gap: 0.25rem; }
.sup-hub-root .gap-1\\.5 { gap: 0.375rem; }
.sup-hub-root .gap-2 { gap: 0.5rem; }
.sup-hub-root .gap-2\\.5 { gap: 0.625rem; }
.sup-hub-root .gap-3 { gap: 0.75rem; }
.sup-hub-root .gap-3\\.5 { gap: 0.875rem; }
.sup-hub-root .gap-4 { gap: 1rem; }
.sup-hub-root .gap-5 { gap: 1.25rem; }
.sup-hub-root .gap-6 { gap: 1.5rem; }
.sup-hub-root .space-y-0\\.5 > * + * { margin-top: 0.125rem; }
.sup-hub-root .space-y-1 > * + * { margin-top: 0.25rem; }
.sup-hub-root .space-y-1\\.5 > * + * { margin-top: 0.375rem; }
.sup-hub-root .space-y-2 > * + * { margin-top: 0.5rem; }
.sup-hub-root .space-y-2\\.5 > * + * { margin-top: 0.625rem; }
.sup-hub-root .space-y-3 > * + * { margin-top: 0.75rem; }
.sup-hub-root .space-y-3\\.5 > * + * { margin-top: 0.875rem; }
.sup-hub-root .space-y-4 > * + * { margin-top: 1rem; }
.sup-hub-root .space-y-5 > * + * { margin-top: 1.25rem; }
.sup-hub-root .space-y-6 > * + * { margin-top: 1.5rem; }
.sup-hub-root .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.sup-hub-root .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.sup-hub-root .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sup-hub-root .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
@media (min-width: 640px) {
  .sup-hub-root .sm\\:flex { display: flex; }
  .sup-hub-root .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sup-hub-root .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sup-hub-root .sm\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .sup-hub-root .sm\\:col-span-2 { grid-column: span 2 / span 2; }
}
@media (min-width: 768px) {
  .sup-hub-root .md\\:inline-block { display: inline-block; }
  .sup-hub-root .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sup-hub-root .md\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  .sup-hub-root .md\\:col-span-2 { grid-column: span 2 / span 2; }
  .sup-hub-root .md\\:col-span-3 { grid-column: span 3 / span 3; }
  .sup-hub-root .md\\:col-span-4 { grid-column: span 4 / span 4; }
}
@media (min-width: 1024px) {
  .sup-hub-root .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sup-hub-root .lg\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  .sup-hub-root .lg\\:col-span-2 { grid-column: span 2 / span 2; }
  .sup-hub-root .lg\\:col-span-4 { grid-column: span 4 / span 4; }
  .sup-hub-root .lg\\:col-span-5 { grid-column: span 5 / span 5; }
  .sup-hub-root .lg\\:col-span-7 { grid-column: span 7 / span 7; }
  .sup-hub-root .lg\\:col-span-8 { grid-column: span 8 / span 8; }
}
.sup-hub-root .w-full { width: 100%; }
.sup-hub-root .w-4 { width: 1rem; }
.sup-hub-root .w-5 { width: 1.25rem; }
.sup-hub-root .w-6 { width: 1.5rem; }
.sup-hub-root .w-7 { width: 1.75rem; }
.sup-hub-root .w-12 { width: 3rem; }
.sup-hub-root .w-16 { width: 4rem; }
.sup-hub-root .w-20 { width: 5rem; }
.sup-hub-root .w-24 { width: 6rem; }
.sup-hub-root .w-44 { width: 11rem; }
.sup-hub-root .w-64 { width: 16rem; }
.sup-hub-root .h-4 { height: 1rem; }
.sup-hub-root .h-5 { height: 1.25rem; }
.sup-hub-root .h-6 { height: 1.5rem; }
.sup-hub-root .h-7 { height: 1.75rem; }
.sup-hub-root .h-12 { height: 3rem; }
.sup-hub-root .h-14 { height: 3.5rem; }
.sup-hub-root .h-16 { height: 4rem; }
.sup-hub-root .h-80 { height: 20rem; }
.sup-hub-root .h-full { height: 100%; }
.sup-hub-root .min-w-0 { min-width: 0; }
.sup-hub-root .min-w-\\[120px\\] { min-width: 120px; }
.sup-hub-root .min-w-\\[140px\\] { min-width: 140px; }
.sup-hub-root .min-w-\\[150px\\] { min-width: 150px; }
.sup-hub-root .min-w-\\[160px\\] { min-width: 160px; }
.sup-hub-root .min-w-\\[180px\\] { min-width: 180px; }
.sup-hub-root .min-w-\\[220px\\] { min-width: 220px; }
.sup-hub-root .min-w-\\[280px\\] { min-width: 280px; }
.sup-hub-root .min-w-\\[330px\\] { min-width: 330px; }
.sup-hub-root .max-w-\\[130px\\] { max-width: 130px; }
.sup-hub-root .max-w-\\[260px\\] { max-width: 260px; }
.sup-hub-root .max-w-\\[380px\\] { max-width: 380px; }
.sup-hub-root .max-w-\\[1720px\\] { max-width: 1720px; }
.sup-hub-root .max-w-md { max-width: 28rem; }
.sup-hub-root .max-w-2xl { max-width: 42rem; }
.sup-hub-root .max-w-3xl { max-width: 48rem; }
.sup-hub-root .max-h-28 { max-height: 7rem; }
.sup-hub-root .max-h-44 { max-height: 11rem; }
.sup-hub-root .max-h-\\[380px\\] { max-height: 380px; }
.sup-hub-root .max-h-\\[540px\\] { max-height: 540px; }
.sup-hub-root .max-h-\\[680px\\] { max-height: 680px; }
.sup-hub-root .max-h-\\[90vh\\] { max-height: 90vh; }
.sup-hub-root .max-h-\\[92vh\\] { max-height: 92vh; }
.sup-hub-root .mx-auto { margin-left: auto; margin-right: auto; }
.sup-hub-root .mt-0\\.5 { margin-top: 0.125rem; }
.sup-hub-root .mt-1 { margin-top: 0.25rem; }
.sup-hub-root .mt-1\\.5 { margin-top: 0.375rem; }
.sup-hub-root .mt-2 { margin-top: 0.5rem; }
.sup-hub-root .mt-4 { margin-top: 1rem; }
.sup-hub-root .mb-0\\.5 { margin-bottom: 0.125rem; }
.sup-hub-root .mb-1 { margin-bottom: 0.25rem; }
.sup-hub-root .mb-2 { margin-bottom: 0.5rem; }
.sup-hub-root .ml-1 { margin-left: 0.25rem; }
.sup-hub-root .mr-0\\.5 { margin-right: 0.125rem; }
.sup-hub-root .mr-1 { margin-right: 0.25rem; }
.sup-hub-root .mr-2 { margin-right: 0.5rem; }
.sup-hub-root .p-1 { padding: 0.25rem; }
.sup-hub-root .p-2 { padding: 0.5rem; }
.sup-hub-root .p-2\\.5 { padding: 0.625rem; }
.sup-hub-root .p-3 { padding: 0.75rem; }
.sup-hub-root .p-3\\.5 { padding: 0.875rem; }
.sup-hub-root .p-4 { padding: 1rem; }
.sup-hub-root .p-5 { padding: 1.25rem; }
.sup-hub-root .p-6 { padding: 1.5rem; }
.sup-hub-root .p-8 { padding: 2rem; }
.sup-hub-root .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
.sup-hub-root .px-1\\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }
.sup-hub-root .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.sup-hub-root .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
.sup-hub-root .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.sup-hub-root .px-3\\.5 { padding-left: 0.875rem; padding-right: 0.875rem; }
.sup-hub-root .px-4 { padding-left: 1rem; padding-right: 1rem; }
.sup-hub-root .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.sup-hub-root .py-0\\.2 { padding-top: 0.05rem; padding-bottom: 0.05rem; }
.sup-hub-root .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
.sup-hub-root .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.sup-hub-root .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.sup-hub-root .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.sup-hub-root .py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.sup-hub-root .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.sup-hub-root .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.sup-hub-root .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.sup-hub-root .pt-1 { padding-top: 0.25rem; }
.sup-hub-root .pt-1\\.5 { padding-top: 0.375rem; }
.sup-hub-root .pt-2 { padding-top: 0.5rem; }
.sup-hub-root .pt-3 { padding-top: 0.75rem; }
.sup-hub-root .pb-0 { padding-bottom: 0; }
.sup-hub-root .pb-1 { padding-bottom: 0.25rem; }
.sup-hub-root .pb-2 { padding-bottom: 0.5rem; }
.sup-hub-root .pb-2\\.5 { padding-bottom: 0.625rem; }
.sup-hub-root .pb-3 { padding-bottom: 0.75rem; }
.sup-hub-root .pr-1 { padding-right: 0.25rem; }
.sup-hub-root .rounded { border-radius: 0.25rem; }
.sup-hub-root .rounded-lg { border-radius: 0.5rem; }
.sup-hub-root .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
.sup-hub-root .rounded-xl { border-radius: 0.75rem; }
.sup-hub-root .rounded-2xl { border-radius: 1rem; }
.sup-hub-root .rounded-full { border-radius: 9999px; }
.sup-hub-root .border { border-width: 1px; border-style: solid; border-color: #e2e8f0; }
.sup-hub-root .border-2 { border-width: 2px; border-style: solid; }
.sup-hub-root .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
.sup-hub-root .border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
.sup-hub-root .border-t { border-top-width: 1px; border-top-style: solid; }
.sup-hub-root .border-x { border-left-width: 1px; border-right-width: 1px; border-left-style: solid; border-right-style: solid; }
.sup-hub-root .border-dashed { border-style: dashed; }
.sup-hub-root .border-collapse { border-collapse: collapse; }
.sup-hub-root .divide-y > * + * { border-top: 1px solid #e2e8f0; }
.sup-hub-root .border-\\[\\#0B1F3A\\] { border-color: #00468B; }
.sup-hub-root .border-\\[\\#00468B\\] { border-color: #00468B; }
.sup-hub-root .border-\\[\\#0072CE\\] { border-color: #0072CE; }
.sup-hub-root .border-\\[\\#003366\\] { border-color: #003366; }
.sup-hub-root .border-\\[\\#FFB81C\\] { border-color: #FFB81C; }
.sup-hub-root .border-\\[\\#E4002B\\] { border-color: #E4002B; }
.sup-hub-root .border-white { border-color: #ffffff; }
.sup-hub-root .border-white\\/10 { border-color: rgba(255,255,255,0.1); }
.sup-hub-root .border-slate-100 { border-color: #f1f5f9; }
.sup-hub-root .border-slate-200 { border-color: #e2e8f0; }
.sup-hub-root .border-slate-300 { border-color: #cbd5e1; }
.sup-hub-root .border-slate-400 { border-color: #94a3b8; }
.sup-hub-root .border-slate-600 { border-color: #475569; }
.sup-hub-root .border-slate-700 { border-color: #334155; }
.sup-hub-root .border-slate-800 { border-color: #1e293b; }
.sup-hub-root .border-amber-200 { border-color: #fde68a; }
.sup-hub-root .border-amber-300 { border-color: #fcd34d; }
.sup-hub-root .border-amber-400 { border-color: #fbbf24; }
.sup-hub-root .border-amber-500 { border-color: #f59e0b; }
.sup-hub-root .border-amber-400\\/40 { border-color: rgba(251,191,36,0.4); }
.sup-hub-root .border-emerald-200 { border-color: #a7f3d0; }
.sup-hub-root .border-emerald-300 { border-color: #6ee7b7; }
.sup-hub-root .border-emerald-400 { border-color: #34d399; }
.sup-hub-root .border-rose-200 { border-color: #fecdd3; }
.sup-hub-root .border-rose-300 { border-color: #fda4af; }
.sup-hub-root .border-rose-800\\/70 { border-color: rgba(159,18,57,0.7); }
.sup-hub-root .border-blue-200 { border-color: #bfdbfe; }
.sup-hub-root .bg-transparent { background-color: transparent; }
.sup-hub-root .bg-white { background-color: #ffffff; }
.sup-hub-root .bg-white\\/15 { background-color: rgba(255,255,255,0.15); }
.sup-hub-root .bg-black\\/10 { background-color: rgba(0,0,0,0.1); }
.sup-hub-root .bg-black\\/20 { background-color: rgba(0,0,0,0.2); }
.sup-hub-root .bg-black\\/60 { background-color: rgba(0,0,0,0.6); }
.sup-hub-root .bg-\\[\\#0B1F3A\\] { background-color: #00468B; }
.sup-hub-root .bg-\\[\\#00468B\\] { background-color: #00468B; }
.sup-hub-root .bg-\\[\\#0072CE\\] { background-color: #0072CE; }
.sup-hub-root .bg-\\[\\#E6F1FB\\] { background-color: #E6F1FB; }
.sup-hub-root .bg-\\[\\#FFB81C\\] { background-color: #FFB81C; }
.sup-hub-root .bg-\\[\\#FFF6E0\\] { background-color: #FFF6E0; }
.sup-hub-root .bg-\\[\\#F7F9FC\\] { background-color: #F7F9FC; }
.sup-hub-root .bg-\\[\\#FDE8EC\\] { background-color: #FDE8EC; }
.sup-hub-root .bg-\\[\\#E4002B\\] { background-color: #E4002B; }
.sup-hub-root .bg-slate-50 { background-color: #f8fafc; }
.sup-hub-root .bg-slate-50\\/60 { background-color: rgba(248,250,252,0.6); }
.sup-hub-root .bg-slate-50\\/70 { background-color: rgba(248,250,252,0.7); }
.sup-hub-root .bg-slate-50\\/80 { background-color: rgba(248,250,252,0.8); }
.sup-hub-root .bg-slate-100 { background-color: #f1f5f9; }
.sup-hub-root .bg-slate-200 { background-color: #e2e8f0; }
.sup-hub-root .bg-slate-700 { background-color: #334155; }
.sup-hub-root .bg-slate-800 { background-color: #1e293b; }
.sup-hub-root .bg-slate-800\\/60 { background-color: rgba(30,41,59,0.6); }
.sup-hub-root .bg-slate-800\\/90 { background-color: rgba(30,41,59,0.9); }
.sup-hub-root .bg-slate-800\\/95 { background-color: rgba(30,41,59,0.95); }
.sup-hub-root .bg-slate-900 { background-color: #0f172a; }
.sup-hub-root .bg-slate-900\\/90 { background-color: rgba(15,23,42,0.9); }
.sup-hub-root .bg-slate-950 { background-color: #020617; }
.sup-hub-root .bg-amber-50 { background-color: #fffbeb; }
.sup-hub-root .bg-amber-50\\/50 { background-color: rgba(255,251,235,0.5); }
.sup-hub-root .bg-amber-50\\/80 { background-color: rgba(255,251,235,0.8); }
.sup-hub-root .bg-amber-100 { background-color: #fef3c7; }
.sup-hub-root .bg-amber-200 { background-color: #fde68a; }
.sup-hub-root .bg-amber-400 { background-color: #fbbf24; }
.sup-hub-root .bg-amber-500 { background-color: #f59e0b; }
.sup-hub-root .bg-amber-500\\/20 { background-color: rgba(245,158,11,0.2); }
.sup-hub-root .bg-emerald-50 { background-color: #ecfdf5; }
.sup-hub-root .bg-emerald-50\\/50 { background-color: rgba(236,253,245,0.5); }
.sup-hub-root .bg-emerald-100 { background-color: #d1fae5; }
.sup-hub-root .bg-emerald-600 { background-color: #059669; }
.sup-hub-root .bg-rose-50 { background-color: #fff1f2; }
.sup-hub-root .bg-rose-50\\/70 { background-color: rgba(255,241,242,0.7); }
.sup-hub-root .bg-rose-100 { background-color: #ffe4e6; }
.sup-hub-root .bg-rose-500\\/25 { background-color: rgba(244,63,94,0.25); }
.sup-hub-root .bg-rose-950\\/50 { background-color: rgba(76,5,25,0.5); }
.sup-hub-root .bg-blue-50 { background-color: #eff6ff; }
.sup-hub-root .bg-blue-600 { background-color: #2563eb; }
.sup-hub-root .bg-indigo-900 { background-color: #312e81; }
.sup-hub-root .bg-purple-600 { background-color: #9333ea; }
.sup-hub-root .bg-gradient-to-r { background-image: linear-gradient(to right, #E4002B, #be123c); }
.sup-hub-root .text-white { color: #ffffff; }
.sup-hub-root .text-\\[\\#0B1F3A\\] { color: #00468B; }
.sup-hub-root .text-\\[\\#00468B\\] { color: #00468B; }
.sup-hub-root .text-\\[\\#0072CE\\] { color: #0072CE; }
.sup-hub-root .text-\\[\\#FFB81C\\] { color: #FFB81C; }
.sup-hub-root .text-\\[\\#E4002B\\] { color: #E4002B; }
.sup-hub-root .text-slate-200 { color: #e2e8f0; }
.sup-hub-root .text-slate-300 { color: #cbd5e1; }
.sup-hub-root .text-slate-400 { color: #94a3b8; }
.sup-hub-root .text-slate-500 { color: #64748b; }
.sup-hub-root .text-slate-600 { color: #475569; }
.sup-hub-root .text-slate-700 { color: #334155; }
.sup-hub-root .text-slate-800 { color: #1e293b; }
.sup-hub-root .text-slate-900 { color: #0f172a; }
.sup-hub-root .text-slate-950 { color: #020617; }
.sup-hub-root .text-amber-300 { color: #fcd34d; }
.sup-hub-root .text-amber-400 { color: #fbbf24; }
.sup-hub-root .text-amber-600 { color: #d97706; }
.sup-hub-root .text-amber-700 { color: #b45309; }
.sup-hub-root .text-amber-800 { color: #92400e; }
.sup-hub-root .text-amber-900 { color: #78350f; }
.sup-hub-root .text-amber-950 { color: #451a03; }
.sup-hub-root .text-emerald-300 { color: #6ee7b7; }
.sup-hub-root .text-emerald-700 { color: #047857; }
.sup-hub-root .text-emerald-800 { color: #065f46; }
.sup-hub-root .text-emerald-900 { color: #064e3b; }
.sup-hub-root .text-emerald-950 { color: #022c22; }
.sup-hub-root .text-rose-100 { color: #ffe4e6; }
.sup-hub-root .text-rose-200 { color: #fecdd3; }
.sup-hub-root .text-rose-600 { color: #e11d48; }
.sup-hub-root .text-rose-800 { color: #9f1239; }
.sup-hub-root .text-rose-900 { color: #881337; }
.sup-hub-root .text-rose-950 { color: #4c0519; }
.sup-hub-root .text-blue-700 { color: #1d4ed8; }
.sup-hub-root .text-indigo-200 { color: #c7d2fe; }
.sup-hub-root .text-\\[9px\\] { font-size: 9px; }
.sup-hub-root .text-\\[10px\\] { font-size: 10px; }
.sup-hub-root .text-\\[11px\\] { font-size: 11px; }
.sup-hub-root .text-xs { font-size: 0.75rem; }
.sup-hub-root .text-sm { font-size: 0.875rem; }
.sup-hub-root .text-base { font-size: 1rem; }
.sup-hub-root .text-lg { font-size: 1.125rem; }
.sup-hub-root .text-xl { font-size: 1.25rem; }
.sup-hub-root .font-semibold { font-weight: 600; }
.sup-hub-root .font-bold { font-weight: 700; }
.sup-hub-root .font-extrabold { font-weight: 800; }
.sup-hub-root .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
.sup-hub-root .uppercase { text-transform: uppercase; }
.sup-hub-root .italic { font-style: italic; }
.sup-hub-root .tracking-tight { letter-spacing: -0.025em; }
.sup-hub-root .tracking-wider { letter-spacing: 0.05em; }
.sup-hub-root .text-left { text-align: left; }
.sup-hub-root .text-center { text-align: center; }
.sup-hub-root .text-right { text-align: right; }
.sup-hub-root .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sup-hub-root .whitespace-nowrap { white-space: nowrap; }
.sup-hub-root .whitespace-pre-line { white-space: pre-line; }
.sup-hub-root .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
.sup-hub-root .shadow { box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); }
.sup-hub-root .shadow-md { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); }
.sup-hub-root .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); }
.sup-hub-root .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.sup-hub-root .overflow-hidden { overflow: hidden; }
.sup-hub-root .overflow-x-auto { overflow-x: auto; }
.sup-hub-root .overflow-y-auto { overflow-y: auto; }
.sup-hub-root .relative { position: relative; }
.sup-hub-root .absolute { position: absolute; }
.sup-hub-root .fixed { position: fixed; }
.sup-hub-root .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.sup-hub-root .z-50 { z-index: 50; }
.sup-hub-root .-translate-x-1\\/2 { transform: translate(-50%, -50%); }
.sup-hub-root .cursor-pointer { cursor: pointer; }
.sup-hub-root .cursor-grab { cursor: grab; }
.sup-hub-root .cursor-crosshair { cursor: crosshair; }
.sup-hub-root .select-none { user-select: none; }
.sup-hub-root .pointer-events-none { pointer-events: none; }
.sup-hub-root .object-contain { object-fit: contain; }
.sup-hub-root .object-cover { object-fit: cover; }
.sup-hub-root .align-top { vertical-align: top; }
.sup-hub-root .opacity-70 { opacity: 0.7; }
.sup-hub-root .transition { transition: all 0.15s ease-in-out; }
.sup-hub-root .w-14 { width: 3.5rem; }
.sup-hub-root .w-\\[220px\\] { width: 220px; }
.sup-hub-root .w-\\[270px\\] { width: 270px; }
.sup-hub-root .w-\\[310px\\] { width: 310px; }
.sup-hub-root .max-h-\\[480px\\] { max-height: 480px; }
.sup-hub-root .max-h-\\[600px\\] { max-height: 600px; }
.sup-hub-root .border-l-4 { border-left-width: 4px; border-left-style: solid; }
.sup-hub-root .border-b-4 { border-bottom-width: 4px; border-bottom-style: solid; }
.sup-hub-root .border-l-\\[\\#FFB81C\\] { border-left-color: #FFB81C; }
.sup-hub-root .border-l-\\[\\#0072CE\\] { border-left-color: #0072CE; }
.sup-hub-root .border-l-emerald-600 { border-left-color: #059669; }
.sup-hub-root .border-b-\\[\\#0072CE\\] { border-bottom-color: #0072CE; }
.sup-hub-root .bg-\\[\\#F0F7FD\\] { background-color: #F0F7FD; }
.sup-hub-root .text-\\[\\#8A5A00\\] { color: #8A5A00; }
.sup-hub-root .rounded-md { border-radius: 0.375rem; }
`;

// ============================================================================
// MAIN SUPERVISOR HUB COMPONENT
// ============================================================================

var __MAIN_COMP__ = function SupervisorHubPage() {
  // Default landing tab MUST be Tab 5 ('todo'), or 'employeequery' when launched from Portal 3 Roster & Evaluations tab
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const q = String(window.location.search || '');
      if (q.indexOf('app=people') >= 0 || q.indexOf('tab=employeequery') >= 0) return 'employeequery';
    } catch {}
    return 'todo';
  });
  const [loading, setLoading] = useState(true);
  const [statusBanner, setStatusBanner] = useState(null);

  // Fix 1: Collapsible Top Bar - collapsed by default on load (controlled by Apex Foods Logo Gate)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  useEffect(() => {
    try {
      window.__PORTAL_SET_DETAIL__ = on => setIsHeaderExpanded(Boolean(on));
      window.__PORTAL_APP_COMMANDS__ = {
        openTab: id => setActiveTab(id)
      };
    } catch {}
  }, []);

  // Microsoft ID & Supervisor Scoping State (with Outlook Job Title)
  const [msIdentity, setMsIdentity] = useState({
    systemUserId: '',
    fullName: 'Loading Microsoft ID...',
    email: '',
    outlookTitle: 'Sanitation Supervisor',
    matchedEmployeeId: '',
    matchedEmployeeName: '',
    matchedShift: 'A',
    matchedRole: 'Supervisor',
    isManagerOrAdmin: false
  });
  const [activeShift, setActiveShift] = useState('A');
  const [selectedSupervisorEmpId, setSelectedSupervisorEmpId] = useState('');
  const [msIdBindings, setMsIdBindings] = useState({});
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // Master Data State & Lazy Equipment GUID Cache (Fix 3: Equipment only loads when asked for)
  const [employees, setEmployees] = useState([]);
  const [mssAreaLookup, setMssAreaLookup] = useState([]);
  const [assets, setAssets] = useState([]);
  const equipmentCacheRef = useRef(null);
  const [equipmentCacheLoaded, setEquipmentCacheLoaded] = useState(false);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const [facilityMaps, setFacilityMaps] = useState([]);
  const [selectedMapId, setSelectedMapId] = useState('');

  // Tab 5: To-Do State & Delegated Interactive Checklists
  const [todoList, setTodoList] = useState([]);
  const [todoEntitySet, setTodoEntitySet] = useState('craa5___1_m_supervisortodos');
  const [todoFilter, setTodoFilter] = useState('open');
  const [showAllShiftTodos, setShowAllShiftTodos] = useState(false);
  const [closingTodo, setClosingTodo] = useState(null);
  const [proofType, setProofType] = useState('Photo Proof');
  const [proofFileName, setProofFileName] = useState('');
  const [proofDataUrl, setProofDataUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [savingTodoCloseout, setSavingTodoCloseout] = useState(false);
  const [newSelfTaskTitle, setNewSelfTaskTitle] = useState('');
  const [newSelfTaskDesc, setNewSelfTaskDesc] = useState('');
  const [newSelfTaskTimeframe, setNewSelfTaskTimeframe] = useState('End of Shift');
  const [newSelfTaskCategory, setNewSelfTaskCategory] = useState('General');
  const [showSelfTaskChecklistPaste, setShowSelfTaskChecklistPaste] = useState(false);
  const [newSelfTaskPasteText, setNewSelfTaskPasteText] = useState('');
  const [checklistRowFilterMap, setChecklistRowFilterMap] = useState({});
  const [checklistSearchMap, setChecklistSearchMap] = useState({});
  const [savingChecklistId, setSavingChecklistId] = useState(null);
  const [promotingChecklistId, setPromotingChecklistId] = useState(null);

  // Unified Shift Builder Tab (Bit-for-Bit Like P2.1 - shift start.txt + Planned 9-12-3 + Goals & Handoff)
  const [planDate, setPlanDate] = useState(todayIso());
  const [activeQuarter, setActiveQuarter] = useState('6:00');
  const [sbStep, setSbStep] = useState(3); // Default to Step 3 ('4 Assign Employees') so full board is immediately visible
  const [sbPlanMode, setSbPlanMode] = useState('live');
  const [sbCollapsedLeadCols, setSbCollapsedLeadCols] = useState({});
  const [sbSelectedLeadIds, setSbSelectedLeadIds] = useState([]);
  const [sbSaveCount, setSbSaveCount] = useState(1);
  const [sbLastSavedStr, setSbLastSavedStr] = useState('Just now');
  const [showSbGoalsDrawer, setShowSbGoalsDrawer] = useState(false);
  const [boardRowId, setBoardRowId] = useState(null);
  const [boardEntitySet, setBoardEntitySet] = useState('craa5___1_s_shiftboards');
  const [boardAreaRows, setBoardAreaRows] = useState([]);
  const [attendance, setAttendance] = useState({
    unutilized: [],
    sick: [],
    pto: [],
    late: [],
    leftEarly: []
  });
  const [shiftGoals, setShiftGoals] = useState([]);
  const [incomingHandoffs, setIncomingHandoffs] = useState([]);
  const [goalRoom, setGoalRoom] = useState('');
  const [goalArea, setGoalArea] = useState('');
  const [goalSubcategory, setGoalSubcategory] = useState('');
  const [goalQuarterTarget, setGoalQuarterTarget] = useState('9:00');
  const [goalLeadName, setGoalLeadName] = useState('');
  const [goalNotes, setGoalNotes] = useState('');
  const [handoffTargetCrew, setHandoffTargetCrew] = useState('B');
  const [handoffSummaryNote, setHandoffSummaryNote] = useState('');
  const [savingBoard, setSavingBoard] = useState(false);

  // Shift Builder 'Assign Employees' UI State, Custom Areas & Ganttly Downtime Popup
  const [selectedEmpIdsForAssign, setSelectedEmpIdsForAssign] = useState([]);
  const [targetAreaKeyForAssign, setTargetAreaKeyForAssign] = useState('');
  const [assignAsLead, setAssignAsLead] = useState(false);
  const [deployStaffSearch, setDeployStaffSearch] = useState('');
  const [showOffShiftStaff, setShowOffShiftStaff] = useState(false);
  const [draggedEmpId, setDraggedEmpId] = useState(null);
  const [customRoomInput, setCustomRoomInput] = useState('Bakery');
  const [customAreaInput, setCustomAreaInput] = useState('');
  const [showDowntimeModal, setShowDowntimeModal] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [dtCategory, setDtCategory] = useState(DOWNTIME_CATEGORIES[0]);
  const [dtRoom, setDtRoom] = useState('');
  const [dtArea, setDtArea] = useState('');
  const [dtEquipmentId, setDtEquipmentId] = useState('');
  const [dtStartTime, setDtStartTime] = useState('07:30');
  const [dtStopTime, setDtStopTime] = useState('08:00');
  const [dtMinutes, setDtMinutes] = useState(30);
  const [dtAffectedEmpIds, setDtAffectedEmpIds] = useState([]);
  const [dtSetupRequired, setDtSetupRequired] = useState(false);
  const [dtSetupChecks, setDtSetupChecks] = useState([]);
  const [dtFixedBy, setDtFixedBy] = useState('');
  const [dtNote, setDtNote] = useState('');
  const [savingDowntime, setSavingDowntime] = useState(false);

  // Tab 3 (Bulk Upload): Hidden Map Popup, Mandatory Room ('Other' option), Per-Photo Equipment from Cache
  const [uploadMode, setUploadMode] = useState('bulk');
  const [photoCategory, setPhotoCategory] = useState('Extra Cleans');
  const [photoRoom, setPhotoRoom] = useState('Bakery');
  const [photoArea, setPhotoArea] = useState('');
  const [photoEquipment, setPhotoEquipment] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoNotifyName, setPhotoNotifyName] = useState('');
  const [photoNotifyEmail, setPhotoNotifyEmail] = useState('');
  const [photoSharepointLink, setPhotoSharepointLink] = useState('');
  const [showBulkMapModal, setShowBulkMapModal] = useState(false);
  const [mapModalTargetIdx, setMapModalTargetIdx] = useState(null);
  const [mapTagMode, setMapTagMode] = useState('pin');
  const [mapPinX, setMapPinX] = useState(50);
  const [mapPinY, setMapPinY] = useState(50);
  const [mapBoxW, setMapBoxW] = useState(8);
  const [mapBoxH, setMapBoxH] = useState(8);
  const [pendingBeforeFiles, setPendingBeforeFiles] = useState([]);
  const [selectedPendingJournalId, setSelectedPendingJournalId] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const mapContainerRef = useRef(null);

  // Tab 4: Photo Journal DataTable State
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalSearch, setJournalSearch] = useState('');
  const [journalCategoryFilter, setJournalCategoryFilter] = useState('ALL');
  const [journalStatusFilter, setJournalStatusFilter] = useState('ALL');
  const [editingJournalId, setEditingJournalId] = useState(null);
  const [editingJournalDraft, setEditingJournalDraft] = useState(null);
  const [batchEditJournalMode, setBatchEditJournalMode] = useState(false);

  // Tab 6 (Clean Plan): Medallion View & Double-Click Popup Editor State (Sourced from MSS Room & Area)
  const [cleanPlanRows, setCleanPlanRows] = useState([]);
  const [cleanPlanEntitySet, setCleanPlanEntitySet] = useState('craa5___1_p_cleanplans');
  const [cleanPlanLineFilter, setCleanPlanLineFilter] = useState('ALL');
  const [selectedCleanPlanDay, setSelectedCleanPlanDay] = useState('ALL');
  const [onlyMyShiftCleanPlan, setOnlyMyShiftCleanPlan] = useState(false);
  const [adjustingWindow, setAdjustingWindow] = useState(null);
  const [adjRoom, setAdjRoom] = useState('Bakery');
  const [adjArea, setAdjArea] = useState('IBL4');
  const [adjLine, setAdjLine] = useState('Line 4');
  const [adjProdStart, setAdjProdStart] = useState('06:00');
  const [adjProdStop, setAdjProdStop] = useState('14:00');
  const [adjStartTime, setAdjStartTime] = useState('14:00');
  const [adjEndTime, setAdjEndTime] = useState('18:00');
  const [adjMinutes, setAdjMinutes] = useState(240);
  const [adjCleanKind, setAdjCleanKind] = useState('Wet Clean');
  const [adjNotes, setAdjNotes] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [savingCleanPlanAdjust, setSavingCleanPlanAdjust] = useState(false);

  // Tab 7: Shift Employee Query & Profile Viewer State (Sourced from All Dataverse Tables)
  const [empSearchQuery, setEmpSearchQuery] = useState('');
  const [selectedProfileEmpId, setSelectedProfileEmpId] = useState('');
  const [empLogRows, setEmpLogRows] = useState([]);
  const [empBoardHistory, setEmpBoardHistory] = useState([]);
  const [dvShiftArchives, setDvShiftArchives] = useState([]);
  const [dvTaskAssignments, setDvTaskAssignments] = useState([]);
  const [dvGAssignments, setDvGAssignments] = useState([]);
  const [dvPassoffs, setDvPassoffs] = useState([]);
  const [dvTimeLossLogs, setDvTimeLossLogs] = useState([]);
  const [empNotes, setEmpNotes] = useState([]);
  const [empNoteFilter, setEmpNoteFilter] = useState('ALL');
  const [empNoteCategoryFilter, setEmpNoteCategoryFilter] = useState('All');
  const [newEmpNoteType, setNewEmpNoteType] = useState('Pro');
  const [newEmpNoteRating, setNewEmpNoteRating] = useState(0);
  const [newEmpNoteText, setNewEmpNoteText] = useState('');
  const [savingEmpNote, setSavingEmpNote] = useState(false);

  // Tab 8: Personal File Uploader & SharePoint Navigator State
  const [sharepointBaseUrl, setSharepointBaseUrl] = useState('https://apexs.sharepoint.com/sites/MidwestPlantSanitation/Shared%20Documents/Supervisors');
  const [spFolders, setSpFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('ALL');
  const [personalFiles, setPersonalFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCategory, setNewFolderCategory] = useState('Custom');
  const [customFileNameInput, setCustomFileNameInput] = useState('');
  const [customFileCategory, setCustomFileCategory] = useState('Files');
  const [customFileSharepointLink, setCustomFileSharepointLink] = useState('');
  const [customFileDescription, setCustomFileDescription] = useState('');
  const [pendingUploadFile, setPendingUploadFile] = useState(null);
  const [uploadingPersonalFile, setUploadingPersonalFile] = useState(false);
  const [renamingFileId, setRenamingFileId] = useState(null);
  const [renamingFileText, setRenamingFileText] = useState('');
  const notify = useCallback((type, text) => {
    setStatusBanner({
      type,
      text
    });
  }, []);

  // ==========================================================================
  // ON-DEMAND LAZY EQUIPMENT LOADER WITH PERSISTENT GUID CACHE (FIX 3)
  // Equipment does NOT load on page startup; once requested, GUIDs stay cached
  // in memory until explicitly refreshed.
  // ==========================================================================

  const ensureEquipmentLoaded = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && equipmentCacheRef.current && equipmentCacheRef.current.length > 0) {
      return equipmentCacheRef.current;
    }
    setLoadingEquipment(true);
    try {
      const assetRes = await dvGetFirstAvailable(['craa5___1_a_assetses', 'craa5___1_a_assets'], '$top=2500');
      const loadedAssets = assetRes.rows.map(r => {
        const dynIdKey = Object.keys(r).find(k => k.endsWith('id') && !k.startsWith('_') && cleanGuid(r[k]).length === 36) || '';
        return {
          id: cleanGuid(r.craa5___1_a_assetsid || r.craa5___1_a_assetsid || r.craa5__aa_assetid || r.craa5_assetid || (dynIdKey ? r[dynIdKey] : '')),
          name: String(r.craa5_equipmentidentifier || r.craa5_asset_name || r.craa5_name || r.craa5_description || 'Equipment').trim(),
          room: String(r.craa5_roomname || r.craa5_room || r.craa5_location || 'Main Plant').trim(),
          area: String(r.craa5_areaname || r.craa5_area || r.craa5_line || r.craa5_zone || 'General').trim(),
          subcategory: String(r.craa5_subcategory || r.craa5_category || r.craa5_equipmenttype || r.craa5_group || 'General Equipment').trim(),
          code: String(r.craa5_workareacode || r.craa5_uniqueid || r.craa5_code || r.craa5_asset_id || '').trim()
        };
      }).filter(a => a.id && (a.room || a.area || a.name));
      equipmentCacheRef.current = loadedAssets;
      setAssets(loadedAssets);
      setEquipmentCacheLoaded(true);
      if (forceRefresh) {
        notify('success', `Refreshed Equipment Cache: ${loadedAssets.length} equipment GUIDs cached in memory.`);
      }
      return loadedAssets;
    } catch (err) {
      notify('error', `Failed to load equipment cache: ${err?.message || ''}`);
      return equipmentCacheRef.current || [];
    } finally {
      setLoadingEquipment(false);
    }
  }, [notify]);

  // ==========================================================================
  // INITIAL DATA LOAD & MICROSOFT ID + OUTLOOK TITLE RESOLUTION
  // ==========================================================================

  const loadAllSupervisorHubData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load saved MS ID bindings from HubConfig
      const bindingCfg = await loadHubConfigJson('SUPERVISOR_MSID_MAP', {});
      setMsIdBindings(bindingCfg.value || {});

      // 2. Resolve Microsoft ID + Outlook Job Title from Xrm context + WhoAmI + systemusers
      let sysUserId = '';
      let sysUserName = '';
      let sysUserEmail = '';
      let sysOutlookTitle = '';
      try {
        const w = window;
        if (w.Xrm?.Utility?.getGlobalContext) {
          const us = w.Xrm.Utility.getGlobalContext().userSettings;
          sysUserId = cleanGuid(us?.userId);
          sysUserName = String(us?.userName || '').trim();
        }
      } catch {}
      if (!sysUserId) {
        try {
          const who = await dvFetch('WhoAmI');
          if (who?.UserId) sysUserId = cleanGuid(who.UserId);
        } catch {}
      }
      if (sysUserId) {
        try {
          const su = await dvFetch(`systemusers(${sysUserId})?$select=fullname,internalemailaddress,domainname,title,jobtitle`);
          if (su) {
            sysUserName = String(su.fullname || sysUserName || '').trim();
            sysUserEmail = String(su.internalemailaddress || su.domainname || '').trim().toLowerCase();
            sysOutlookTitle = String(su.title || su.jobtitle || '').trim();
          }
        } catch {
          try {
            const suFallback = await dvFetch(`systemusers(${sysUserId})?$select=fullname,internalemailaddress,domainname,title`);
            if (suFallback) {
              sysUserName = String(suFallback.fullname || sysUserName || '').trim();
              sysUserEmail = String(suFallback.internalemailaddress || suFallback.domainname || '').trim().toLowerCase();
              sysOutlookTitle = String(suFallback.title || '').trim();
            }
          } catch {}
        }
      }

      // Format "Last, First" from AD/Outlook into "First Last" for display while keeping raw match support
      const formattedMsName = sysUserName.includes(',') ? sysUserName.split(',').slice(1).join(' ').trim() + ' ' + sysUserName.split(',')[0].trim() : sysUserName;

      // 3. Load Employees (`craa5___1_a_employees`) including Dataverse Remarks & Training fields
      const empRes = await dvGetFirstAvailable(['craa5___1_a_employees'], '$top=1000');
      const loadedEmployees = empRes.rows.map(r => ({
        id: cleanGuid(r.craa5___1_a_employeeid || r.craa5___1_a_employeeid || r.craa5_employeeid),
        name: String(r.craa5_employeename || r.craa5_name || r.craa5_fullname || 'Unnamed Employee').trim(),
        email: String(r.craa5_email || r.craa5_workemail || '').trim().toLowerCase(),
        badge: String(r.craa5_badgenumber || r.craa5_badge || '').trim(),
        role: String(r.craa5_role || r.craa5_jobtitle || 'Sanitor').trim(),
        shift: normalizeShiftCode(r.craa5_shift || r.craa5_crew || 'A'),
        teamId: cleanGuid(r._craa5_leadershipteamid_value || ''),
        remarks: String(r.craa5_remarks || '').trim(),
        remarkCategory: String(r.craa5_remarkcategory || '').trim(),
        inTraining: Boolean(r.craa5_intraining),
        trainingArea: String(r.craa5_trainingarea || '').trim()
      })).filter(e => e.id && e.name);
      setEmployees(loadedEmployees);

      // Match Microsoft ID against Employee table or saved MSID binding
      const savedBind = sysUserId ? bindingCfg.value?.[sysUserId] : undefined;
      let matchedEmp = loadedEmployees.find(e => savedBind && e.id === savedBind.employeeId);
      if (!matchedEmp && sysUserEmail) {
        matchedEmp = loadedEmployees.find(e => e.email && e.email === sysUserEmail);
      }
      if (!matchedEmp && sysUserName) {
        const lowerRaw = sysUserName.toLowerCase();
        const lowerFmt = formattedMsName.toLowerCase();
        matchedEmp = loadedEmployees.find(e => e.name.toLowerCase() === lowerRaw || e.name.toLowerCase() === lowerFmt);
      }
      if (!matchedEmp) {
        matchedEmp = loadedEmployees.find(e => /sup|lead|manager/i.test(e.role)) || loadedEmployees[0];
      }
      const resolvedShift = savedBind?.shift || (matchedEmp ? normalizeShiftCode(matchedEmp.shift) : 'A');
      const resolvedSupName = savedBind?.supervisorName || formattedMsName || matchedEmp?.name || 'Shift Supervisor';
      const resolvedEmpId = matchedEmp?.id || '';
      const resolvedOutlookTitle = sysOutlookTitle || matchedEmp?.role || 'Sanitation Supervisor';
      setMsIdentity({
        systemUserId: sysUserId || 'msid-local-session',
        fullName: formattedMsName || resolvedSupName,
        email: sysUserEmail || matchedEmp?.email || 'supervisor@apexfoods.demo',
        outlookTitle: resolvedOutlookTitle,
        matchedEmployeeId: resolvedEmpId,
        matchedEmployeeName: resolvedSupName,
        matchedShift: resolvedShift,
        matchedRole: matchedEmp?.role || 'Supervisor',
        isManagerOrAdmin: /manager|admin|director|developer/i.test(resolvedOutlookTitle + ' ' + (matchedEmp?.role || '')) || !sysUserEmail
      });
      setActiveShift(resolvedShift);
      setSelectedSupervisorEmpId(resolvedEmpId);
      setHandoffTargetCrew(nextShiftCode(resolvedShift));

      // NOTE (Fix 3): Equipment (`craa5___1_a_assets`) is NOT loaded on startup!
      // It is loaded lazily via `ensureEquipmentLoaded()` only when requested, and cached by GUID.

      // 4. Load Supervisor To-Do (`craa5___1_m_supervisortodos`) + Proof Store
      const proofCfg = await loadHubConfigJson('SUPERVISOR_TODO_PROOFS', {});
      const proofMap = proofCfg.value || {};
      const todoRes = await dvGetFirstAvailable(['craa5___1_m_supervisortodos', 'craa5___1_m_supervisortodos'], '$top=500&$orderby=createdon desc');
      if (todoRes.set) setTodoEntitySet(todoRes.set);
      const loadedTodos = todoRes.rows.map(r => {
        const id = cleanGuid(r.craa5___1_m_supervisortodoid || r.craa5___1_m_supervisortodoid || r.id);
        const p = proofMap[id] || {};
        const rawDesc = String(r.craa5_taskdescription || r.craa5_notes || r.craa5_description || '');
        const taskTitle = String(r.craa5_task || r.craa5_title || r.craa5_name || 'Manager Assigned Task').trim();
        const assignedTo = String(r.craa5_assignedto || 'All Supervisors').trim();
        const parsedDesc = parseSupervisorTodoDescription(rawDesc, id, taskTitle, assignedTo);
        const isFromMgr = p.fromManager !== undefined ? Boolean(p.fromManager) : !parsedDesc.isSelfTask;
        return {
          id,
          taskTitle,
          description: parsedDesc.cleanDescription,
          assignedTo,
          dateAssigned: r.craa5_dateassigned ? String(r.craa5_dateassigned).slice(0, 10) : String(r.createdon || todayIso()).slice(0, 10),
          timeframe: String(r.craa5_expectationfortimeframe || 'Current Shift').trim(),
          complete: Boolean(r.craa5_complete),
          fromManager: isFromMgr,
          priority: isFromMgr ? 'Urgent Manager' : 'Standard',
          category: parsedDesc.category,
          taskPriority: parsedDesc.taskPriority,
          taskShift: parsedDesc.taskShift,
          assignedName: parsedDesc.assignedName,
          createdBy: parsedDesc.createdBy,
          checklist: parsedDesc.checklist,
          proofType: p.proofType || '',
          proofFileName: p.proofFileName || '',
          proofDataUrl: p.proofDataUrl || '',
          proofLink: p.proofLink || '',
          completionNotes: p.completionNotes || '',
          completedAt: p.completedAt || '',
          completedByMsId: p.completedByMsId || ''
        };
      });
      setTodoList(loadedTodos);

      // 5. Load Facility Maps (`craa5___1_g_mapses`)
      const mapRes = await dvGetFirstAvailable(['craa5___1_g_mapses', 'craa5___1_g_mapses'], '$top=50');
      const base = getBaseUrl();
      const loadedMaps = mapRes.rows.map(r => {
        const id = cleanGuid(r.craa5___1_g_mapsid || r.craa5_mapsid);
        return {
          id,
          facility: String(r.craa5_facility || r.craa5_name || 'Midwest Plant Facility Map').trim(),
          imageUrl: `${base}/api/data/v9.2/${mapRes.set}(${id})/craa5_mapimage/$value?size=full`
        };
      }).filter(m => m.id);
      setFacilityMaps(loadedMaps);
      if (loadedMaps.length > 0) setSelectedMapId(loadedMaps[0].id);

      // 6. Load Photo Journal (`SUPERVISOR_PHOTO_JOURNAL` + `craa5__facilityobservations`)
      const journalCfg = await loadHubConfigJson('SUPERVISOR_PHOTO_JOURNAL', []);
      const obsRes = await dvGetFirstAvailable(['craa5__facilityobservations', 'craa5_facilityobservations'], '$top=250&$orderby=createdon desc');
      const savedJournal = Array.isArray(journalCfg.value) ? [...journalCfg.value] : [];
      const knownObsIds = new Set(savedJournal.map(j => j.observationId).filter(Boolean));
      for (const r of obsRes.rows) {
        const obsId = cleanGuid(r.craa5__facilityobservationid || r.craa5_facilityobservationid);
        if (!obsId || knownObsIds.has(obsId)) continue;
        const customMeta = safeJsonParse(r.craa5__customnote, {});
        const room = String(r.craa5__room || customMeta.room || 'Other');
        const area = String(r.craa5__area || customMeta.area || 'General');
        const cat = PHOTO_CATEGORIES.includes(customMeta.category) ? customMeta.category : 'Extra Cleans';
        savedJournal.push({
          id: `jrn-${obsId}`,
          observationId: obsId,
          title: String(customMeta.title || `${cat} - ${room} / ${area}`),
          category: cat,
          facility: String(r.craa5__facility || 'Midwest Plant'),
          room,
          area,
          equipment: String(r.craa5__equipment || ''),
          equipmentGuid: String(customMeta.equipmentGuid || ''),
          mapX: Number(r.craa5_mapx ?? 50),
          mapY: Number(r.craa5_mapy ?? 50),
          boxWidth: Number(r.craa5__boxwidth ?? 0),
          boxHeight: Number(r.craa5__boxheight ?? 0),
          beforePhotoDataUrl: customMeta.beforePhotoDataUrl || '',
          beforePhotoUrl: `${base}/api/data/v9.2/${obsRes.set}(${obsId})/craa5_pictureof/$value?size=full`,
          beforeFileName: String(customMeta.beforeFileName || 'before_observation.jpg'),
          beforeUploadedAt: String(r.createdon || todayIso()).slice(0, 16).replace('T', ' '),
          afterReferenceName: String(customMeta.afterReferenceName || buildDefaultAfterRefName(cat, room, area, 1)),
          afterPhotoDataUrl: customMeta.afterPhotoDataUrl || '',
          afterPhotoUrl: customMeta.afterPhotoUrl || '',
          afterFileName: String(customMeta.afterFileName || ''),
          afterUploadedAt: String(customMeta.afterUploadedAt || ''),
          status: customMeta.afterPhotoDataUrl || customMeta.afterPhotoUrl ? 'Before & After Complete' : 'Pending After Photo',
          description: String(r.craa5__description || ''),
          whoToNotify: String(r.craa5__whotonotify || ''),
          whoToNotifyEmail: String(r.craa5__whotonotifyemail || ''),
          sharepointLink: String(customMeta.sharepointLink || ''),
          externalLink: String(customMeta.externalLink || ''),
          supervisorName: String(customMeta.supervisorName || resolvedSupName),
          supervisorMsId: String(customMeta.supervisorMsId || sysUserId),
          shift: String(customMeta.shift || resolvedShift)
        });
      }
      setJournalEntries(savedJournal);

      // 7. Load Authoritative MSS Rooms & Areas (`craa5___1_a_mss_areas` + `craa5___1_a_assetses` room/area pairs)
      // and Weekly Clean Plan (`craa5___1_p_cleanplans`) resolved to actual MSS Room & Area
      const mssAreaRes = await dvGetFirstAvailable(['craa5___1_a_mss_areas'], '$filter=statecode eq 0&$top=500');
      const assetRoomAreaRes = await dvGetFirstAvailable(['craa5___1_a_assetses', 'craa5___1_a_assets'], '$select=craa5_roomname,craa5_areaname&$top=2500');

      // Build canonical Area -> Room lookup from actual MSS tables (`Bakery`, `Creme`, `Support`)
      const canonicalRoomByAreaLower = new Map();
      const inferMssRoomForArea = areaName => {
        const low = areaName.toLowerCase();
        if (/highspeed|high speed|custard|pie|tart|crust|spiral|packaging|overwrap|carton|topping|mix room|plate|creme/i.test(low)) {
          return 'Creme';
        }
        if (/tote|locker|hallway|trash|dock|warehouse|utilit|maint|cop|cip|support|amenit|office|welfare/i.test(low)) {
          return 'Support';
        }
        return 'Bakery';
      };
      for (const arRow of assetRoomAreaRes.rows) {
        const rm = String(arRow.craa5_roomname || '').trim();
        const ar = String(arRow.craa5_areaname || '').trim();
        if (rm && ar && !canonicalRoomByAreaLower.has(ar.toLowerCase())) {
          canonicalRoomByAreaLower.set(ar.toLowerCase(), {
            room: rm,
            area: ar
          });
        }
      }
      const loadedMssAreas = [];
      const seenMssKey = new Set();
      for (const mRow of mssAreaRes.rows) {
        const rawAr = String(mRow.craa5_area || mRow.craa5_areaname || mRow.craa5_name || '').trim();
        if (!rawAr) continue;
        const matchedFromAssets = canonicalRoomByAreaLower.get(rawAr.toLowerCase());
        const resolvedRoom = String(mRow.craa5_room || mRow.craa5_roomname || matchedFromAssets?.room || inferMssRoomForArea(rawAr)).trim();
        const resolvedArea = matchedFromAssets?.area || rawAr;
        const key = `${resolvedRoom.toLowerCase()}::${resolvedArea.toLowerCase()}`;
        if (!seenMssKey.has(key)) {
          seenMssKey.add(key);
          canonicalRoomByAreaLower.set(resolvedArea.toLowerCase(), {
            room: resolvedRoom,
            area: resolvedArea
          });
          loadedMssAreas.push({
            id: cleanGuid(mRow.craa5___1_a_mss_areaid || mRow.id || key),
            room: resolvedRoom,
            area: resolvedArea,
            cadences: String(mRow.craa5_cadencesjson || '')
          });
        }
      }

      // Also include any distinct (room, area) pairs from `craa5___1_a_assetses` not yet in `loadedMssAreas`
      canonicalRoomByAreaLower.forEach(val => {
        const key = `${val.room.toLowerCase()}::${val.area.toLowerCase()}`;
        if (!seenMssKey.has(key)) {
          seenMssKey.add(key);
          loadedMssAreas.push({
            id: key,
            room: val.room,
            area: val.area,
            cadences: ''
          });
        }
      });
      if (loadedMssAreas.length === 0) {
        const fallbackMss = [{
          room: 'Bakery',
          area: 'IBL4'
        }, {
          room: 'Bakery',
          area: 'IBL5'
        }, {
          room: 'Bakery',
          area: 'dough room'
        }, {
          room: 'Bakery',
          area: 'waterjet'
        }, {
          room: 'Bakery',
          area: 'breading'
        }, {
          room: 'Bakery',
          area: 'silo use bins'
        }, {
          room: 'Bakery',
          area: 'kettles'
        }, {
          room: 'Creme',
          area: 'highspeed'
        }, {
          room: 'Creme',
          area: 'custard'
        }, {
          room: 'Creme',
          area: 'pie line'
        }, {
          room: 'Creme',
          area: 'crust'
        }, {
          room: 'Creme',
          area: 'spiral'
        }, {
          room: 'Creme',
          area: 'packaging'
        }, {
          room: 'Support',
          area: 'tote wash'
        }, {
          room: 'Support',
          area: 'panwasher'
        }, {
          room: 'Support',
          area: 'main hallway'
        }];
        fallbackMss.forEach(f => {
          canonicalRoomByAreaLower.set(f.area.toLowerCase(), f);
          loadedMssAreas.push({
            id: `${f.room}::${f.area}`,
            room: f.room,
            area: f.area,
            cadences: ''
          });
        });
      }
      setMssAreaLookup(loadedMssAreas);

      // Helper to resolve any Clean Plan row (`rawArea`, `lineKey`, `details`) to actual MSS Room & Area
      const resolveActualMssRoomAndArea = (rawAreaInput, rawLineInput, rawRoomInput, idx) => {
        const cleanRawArea = rawAreaInput.includes(' - ') ? rawAreaInput.split(' - ').slice(1).join(' - ').trim() : rawAreaInput.trim();
        const prefixRoom = rawAreaInput.includes(' - ') ? rawAreaInput.split(' - ')[0].trim() : rawRoomInput.trim();

        // 1. Direct match in canonical MSS areas
        if (cleanRawArea && canonicalRoomByAreaLower.has(cleanRawArea.toLowerCase())) {
          return canonicalRoomByAreaLower.get(cleanRawArea.toLowerCase());
        }
        if (rawLineInput && canonicalRoomByAreaLower.has(rawLineInput.toLowerCase())) {
          return canonicalRoomByAreaLower.get(rawLineInput.toLowerCase());
        }

        // 2. Substring / Line code match to real MSS areas (`IBL4`, `IBL5`, `highspeed`, `custard`, `dough room`, `waterjet`, `breading`, `silo use bins`, `kettles`, `pie line`)
        const combined = `${cleanRawArea} ${rawLineInput} ${prefixRoom}`.toLowerCase();
        for (const m of loadedMssAreas) {
          if (combined.includes(m.area.toLowerCase())) {
            return {
              room: m.room,
              area: m.area
            };
          }
        }
        if (/ibl\s*4|line\s*4|\bl4\b/i.test(combined)) {
          return canonicalRoomByAreaLower.get('ibl4') || {
            room: 'Bakery',
            area: 'IBL4'
          };
        }
        if (/ibl\s*5|line\s*5|\bl5\b/i.test(combined)) {
          return canonicalRoomByAreaLower.get('ibl5') || {
            room: 'Bakery',
            area: 'IBL5'
          };
        }
        if (/high\s*speed|line\s*1|\bl1\b|\bhs\b/i.test(combined)) {
          return canonicalRoomByAreaLower.get('highspeed') || {
            room: 'Creme',
            area: 'highspeed'
          };
        }
        if (/custard|line\s*3|\bl3\b/i.test(combined)) {
          return canonicalRoomByAreaLower.get('custard') || {
            room: 'Creme',
            area: 'custard'
          };
        }
        if (/dough/i.test(combined)) {
          return canonicalRoomByAreaLower.get('dough room') || {
            room: 'Bakery',
            area: 'dough room'
          };
        }
        if (/water\s*jet|line\s*6|\bl6\b/i.test(combined)) {
          return canonicalRoomByAreaLower.get('waterjet') || {
            room: 'Bakery',
            area: 'waterjet'
          };
        }
        if (/bread/i.test(combined)) {
          return canonicalRoomByAreaLower.get('breading') || {
            room: 'Bakery',
            area: 'breading'
          };
        }
        if (/kettle|sauce/i.test(combined)) {
          return canonicalRoomByAreaLower.get('kettles') || {
            room: 'Bakery',
            area: 'kettles'
          };
        }
        if (/silo|bin/i.test(combined)) {
          return canonicalRoomByAreaLower.get('silo use bins') || {
            room: 'Bakery',
            area: 'silo use bins'
          };
        }
        if (/pie|line\s*2|\bl2\b|\bobl\b/i.test(combined)) {
          return canonicalRoomByAreaLower.get('pie line') || {
            room: 'Creme',
            area: 'pie line'
          };
        }
        if (/spiral|scroll|freezer/i.test(combined)) {
          return canonicalRoomByAreaLower.get('spiral') || {
            room: 'Creme',
            area: 'spiral'
          };
        }
        if (/tote|wash|trash|hall/i.test(combined)) {
          return canonicalRoomByAreaLower.get('tote wash') || {
            room: 'Support',
            area: 'tote wash'
          };
        }

        // 3. Fallback to real MSS area from `loadedMssAreas`
        const fallbackMss = loadedMssAreas[idx % loadedMssAreas.length] || {
          room: 'Bakery',
          area: 'IBL4'
        };
        return {
          room: fallbackMss.room,
          area: fallbackMss.area
        };
      };
      const cpRes = await dvGetFirstAvailable(['craa5___1_p_cleanplans', 'craa5___1_p_cleanplans'], '$filter=statecode eq 0&$top=1000');
      if (cpRes.set) setCleanPlanEntitySet(cpRes.set);
      let loadedCp = cpRes.rows.filter(r => {
        const rt = String(r.craa5_rowtype || 'window').toLowerCase();
        const ck = String(r.craa5_cleankind || '').toUpperCase();
        // Exclude scope tracking rows (`s|trash|...`) and non-clean production placeholders (`NONE` / `P72` with 0 clean minutes)
        if (rt === 'scope') return false;
        if ((ck === 'NONE' || ck === 'P72') && Number(r.craa5_minutes || 0) <= 0) return false;
        return rt === 'window' || rt === 'day' || Boolean(r.craa5_start);
      }).map((r, idx) => {
        const id = cleanGuid(r.craa5___1_p_cleanplanid || r.craa5___1_p_cleanplanid);
        const details = safeJsonParse(r.craa5_details, {});
        const rawArea = String(r.craa5_area || details.areaName || details.area || '').trim();
        const rawLine = String(r.craa5_line || r.craa5_linekey || details.line || '').trim();
        const rawRoom = String(details.room || '').trim();
        const resolvedMss = resolveActualMssRoomAndArea(rawArea, rawLine, rawRoom, idx);
        const rawStart = String(r.craa5_start || details.start || '14:00');
        const rawEnd = String(r.craa5_end || details.end || '18:00');
        const fmtTime = (val, fallback) => {
          if (!val) return fallback;
          if (val.includes('T') && val.length >= 16) return val.slice(11, 16);
          return val;
        };
        const cleanKindRaw = String(r.craa5_cleankind || details.cleanKind || 'Wet Clean').trim();
        const friendlyCleanKind = cleanKindRaw === 'TW' ? 'Thorough Wash (TW)' : cleanKindRaw === 'P48' ? '48-Hr Clean (P48)' : cleanKindRaw === 'P24' ? '24-Hr Clean (P24)' : cleanKindRaw;
        return {
          id,
          planKey: String(r.craa5_plankey || r.craa5_name || id),
          rowType: String(r.craa5_rowtype || 'window'),
          lineKey: rawLine || resolvedMss.area,
          room: resolvedMss.room,
          area: resolvedMss.area,
          line: rawLine || resolvedMss.area,
          prodStart: fmtTime(String(details.prodStart || details.productionStart || '06:00'), '06:00'),
          prodStop: fmtTime(String(details.prodStop || details.productionStop || rawStart || '14:00'), '14:00'),
          start: fmtTime(rawStart, '14:00'),
          end: fmtTime(rawEnd, '18:00'),
          cleanKind: friendlyCleanKind,
          minutes: Number(r.craa5_minutes || details.minutes || 240),
          status: String(r.craa5_status || 'Scheduled'),
          reason: String(r.craa5_reason || details.reason || ''),
          shiftCrew: normalizeShiftCode(details.shiftCrew || details.crew || resolvedShift),
          dayDate: rawStart.length >= 10 && rawStart.includes('-') ? rawStart.slice(0, 10) : String(details.dayDate || todayIso()),
          notes: String(details.notes || ''),
          details
        };
      });
      if (loadedCp.length === 0) {
        const dIso = todayIso();
        loadedCp = [{
          id: 'cp-seed-1',
          planKey: `CP_BAKERY_IBL4_${dIso}`,
          rowType: 'window',
          lineKey: 'IBL4',
          room: 'Bakery',
          area: 'IBL4',
          line: 'IBL Line 4',
          prodStart: '05:00',
          prodStop: '13:30',
          start: '13:30',
          end: '17:30',
          cleanKind: 'Wet Clean',
          minutes: 240,
          status: 'Scheduled',
          reason: '',
          shiftCrew: resolvedShift,
          dayDate: dIso,
          notes: 'Full belt teardown, foam & sanitize.',
          details: {}
        }, {
          id: 'cp-seed-2',
          planKey: `CP_BAKERY_IBL5_${dIso}`,
          rowType: 'window',
          lineKey: 'IBL5',
          room: 'Bakery',
          area: 'IBL5',
          line: 'IBL Line 5',
          prodStart: '06:00',
          prodStop: '14:30',
          start: '14:30',
          end: '18:00',
          cleanKind: 'Allergen Clean',
          minutes: 210,
          status: 'Scheduled',
          reason: '',
          shiftCrew: resolvedShift,
          dayDate: dIso,
          notes: 'Allergen changeover verify ATP swabs.',
          details: {}
        }, {
          id: 'cp-seed-3',
          planKey: `CP_CREME_HIGHSPEED_${dIso}`,
          rowType: 'window',
          lineKey: 'highspeed',
          room: 'Creme',
          area: 'highspeed',
          line: 'Highspeed Line',
          prodStart: '06:00',
          prodStop: '15:00',
          start: '15:00',
          end: '18:00',
          cleanKind: 'Wet Clean',
          minutes: 180,
          status: 'Scheduled',
          reason: '',
          shiftCrew: resolvedShift,
          dayDate: dIso,
          notes: 'Highspeed line full sanitation cycle.',
          details: {}
        }, {
          id: 'cp-seed-4',
          planKey: `CP_CREME_CUSTARD_${dIso}`,
          rowType: 'window',
          lineKey: 'custard',
          room: 'Creme',
          area: 'custard',
          line: 'Custard Line',
          prodStart: '05:30',
          prodStop: '14:00',
          start: '14:00',
          end: '18:30',
          cleanKind: 'Deep Clean',
          minutes: 270,
          status: 'Scheduled',
          reason: '',
          shiftCrew: resolvedShift,
          dayDate: dIso,
          notes: 'Custard kettles, depositors & CIP wash.',
          details: {}
        }];
      }
      setCleanPlanRows(loadedCp);

      // 8. Load SharePoint Config & Personal File Library (`SUPERVISOR_SHAREPOINT_HUB` + `craa5___1_m_formtemplates`)
      const spCfg = await loadHubConfigJson('SUPERVISOR_SHAREPOINT_HUB', {
        baseUrl: 'https://apexs.sharepoint.com/sites/MidwestPlantSanitation/Shared%20Documents/Supervisors',
        folders: [],
        files: []
      });
      if (spCfg.value.baseUrl) setSharepointBaseUrl(spCfg.value.baseUrl);
      const defaultFolders = [{
        id: `fld-photos-${resolvedShift}`,
        name: `Shift ${resolvedShift} - Supervisor Photos`,
        category: 'Photos',
        sharepointPath: `${spCfg.value.baseUrl || sharepointBaseUrl}/Shift_${resolvedShift}_${resolvedSupName.replace(/\s+/g, '_')}/Photos`,
        supervisorShift: resolvedShift,
        createdBy: resolvedSupName,
        createdAt: todayIso()
      }, {
        id: `fld-notes-${resolvedShift}`,
        name: `Shift ${resolvedShift} - Shift Notes & Logs`,
        category: 'Notes',
        sharepointPath: `${spCfg.value.baseUrl || sharepointBaseUrl}/Shift_${resolvedShift}_${resolvedSupName.replace(/\s+/g, '_')}/Notes`,
        supervisorShift: resolvedShift,
        createdBy: resolvedSupName,
        createdAt: todayIso()
      }, {
        id: `fld-files-${resolvedShift}`,
        name: `Shift ${resolvedShift} - Reusable SOPs & Files`,
        category: 'Files',
        sharepointPath: `${spCfg.value.baseUrl || sharepointBaseUrl}/Shift_${resolvedShift}_${resolvedSupName.replace(/\s+/g, '_')}/Files`,
        supervisorShift: resolvedShift,
        createdBy: resolvedSupName,
        createdAt: todayIso()
      }];
      const mergedFolders = [...defaultFolders];
      for (const f of spCfg.value.folders || []) {
        if (!mergedFolders.some(d => d.id === f.id)) mergedFolders.push(f);
      }
      setSpFolders(mergedFolders);
      setPersonalFiles(Array.isArray(spCfg.value.files) ? spCfg.value.files : []);

      // 9. Load All Dataverse Tables for Crew Profiles (`craa5___1_m_employeenotes`, `craa5___1_g_notes`,
      // `craa5___1_s_shiftarchives`, `craa5___1_s_taskassignments`, `craa5___1_g_assignments`, `craa5___1_l_logs`,
      // `craa5___1_g_passoffs`, `craa5___1_m_timelosslogs`)
      const [logRes, empNotesRes, persNotesRes, archivesRes, taskAssignRes, gAssignRes, passoffRes, timeLossRes, noteCfg] = await Promise.all([dvGetFirstAvailable(['craa5___1_l_logs', 'craa5___1_l_logs', 'craa5___1_l_logs'], '$top=1000&$orderby=createdon desc'), dvGetFirstAvailable(['craa5___1_m_employeenotes', 'craa5___1_m_employeenotes'], '$filter=statecode eq 0&$top=1000&$orderby=createdon desc'), dvGetFirstAvailable(['craa5___1_g_notes', 'craa5___1_g_notes'], '$top=1000&$orderby=createdon desc'), dvGetFirstAvailable(['craa5___1_s_shiftarchives', 'craa5___1_s_shiftarchives'], '$top=200&$orderby=modifiedon desc'), dvGetFirstAvailable(['craa5___1_s_taskassignments', 'craa5___1_s_taskassignments'], '$top=500&$orderby=createdon desc'), dvGetFirstAvailable(['craa5___1_g_assignments', 'craa5___1_g_assignments'], '$top=500&$orderby=createdon desc'), dvGetFirstAvailable(['craa5___1_g_passoffs', 'craa5___1_g_passoffs'], '$top=300&$orderby=createdon desc'), dvGetFirstAvailable(['craa5___1_m_timelosslogs'], '$top=500&$orderby=createdon desc'), loadHubConfigJson('SUPERVISOR_EMP_NOTES', [])]);
      setEmpLogRows(logRes.rows);
      setDvShiftArchives(archivesRes.rows);
      setDvTaskAssignments(taskAssignRes.rows);
      setDvGAssignments(gAssignRes.rows);
      setDvPassoffs(passoffRes.rows);
      setDvTimeLossLogs(timeLossRes.rows);

      // Merge notes from `craa5___1_m_employeenotes`, `craa5___1_g_notes`, and `craa5___1_a_employees.craa5_remarks`
      const unifiedNotes = [];
      const seenNoteKeys = new Set();
      const resolveEmployeeByIdOrName = (rawId, rawName) => {
        const cId = cleanGuid(rawId);
        if (cId) {
          const byId = loadedEmployees.find(e => e.id === cId);
          if (byId) return byId;
        }
        const lowName = String(rawName || '').trim().toLowerCase();
        if (lowName) {
          return loadedEmployees.find(e => e.name.toLowerCase() === lowName);
        }
        return undefined;
      };

      // A) `craa5___1_m_employeenotes` (Manager & Supervisor Employee Notes + Frozen Snapshots - supports Manager Hub craa5_data JSON + legacy columns)
      for (const r of empNotesRes.rows) {
        if (String(r.craa5_status || 'Active').toLowerCase() === 'removed') continue;
        const id = cleanGuid(r.craa5___1_m_employeenoteid || r.id);
        const dataParsed = r.craa5_data ? safeJsonParse(r.craa5_data, null) : null;
        const empNameRaw = String(r.craa5_employeename || dataParsed && dataParsed.empName || r.craa5_title || '').trim();
        const empIdRaw = String(r.craa5_employeeguid || r.craa5_employeeid || '').trim();
        const matched = resolveEmployeeByIdOrName(empIdRaw, empNameRaw);
        const noteText = String(dataParsed && dataParsed.text || r.craa5_note || '').trim();
        const noteType = String(r.craa5_kind || r.craa5_notetype || r.craa5_category || 'Note').trim();
        const snapObj = dataParsed && dataParsed.snapshot || (r.craa5_snapshotjson ? safeJsonParse(r.craa5_snapshotjson, null) : null);
        if (!noteText && !snapObj) continue;
        const dedup = `${matched?.id || empNameRaw}::${noteType}::${noteText.slice(0, 60)}`;
        if (seenNoteKeys.has(dedup)) continue;
        seenNoteKeys.add(dedup);
        unifiedNotes.push({
          id: id || `dv-enote-${unifiedNotes.length}`,
          empId: matched?.id || cleanGuid(empIdRaw),
          empName: matched?.name || empNameRaw || 'Employee',
          date: String(r.craa5_notedate || dataParsed && dataParsed.at || r.createdon || todayIso()).slice(0, 10),
          type: noteType,
          category: String(r.craa5_category || noteType),
          note: noteText,
          rating: r.craa5_rating !== null && r.craa5_rating !== undefined ? Number(r.craa5_rating) : dataParsed && dataParsed.rating !== undefined ? Number(dataParsed.rating) : null,
          snapshot: snapObj,
          author: String(dataParsed && dataParsed.by || r.craa5_author || 'Supervisor / Manager').trim(),
          shift: normalizeShiftCode(r.craa5_shift || matched?.shift || resolvedShift),
          sourceTable: 'craa5___1_m_employeenotes'
        });
      }

      // B) `craa5___1_g_notes` (Ganttly Floor High Fives & Coaching Concerns)
      for (const r of persNotesRes.rows) {
        const id = cleanGuid(r.craa5___1_g_noteid || r.id);
        const empIdRaw = String(r.craa5_employeeguid || '').trim();
        const empNameRaw = String(r.craa5_employee || r.craa5_employeename || '').trim();
        const matched = resolveEmployeeByIdOrName(empIdRaw, empNameRaw);
        const kind = String(r.craa5_kind || r.craa5_severity || 'pro').toLowerCase();
        const reason = String(r.craa5_tag || r.craa5_reason || '').trim();
        const rawNote = String(r.craa5_note || '').trim();
        const combinedText = reason && rawNote ? `${reason}: ${rawNote}` : reason || rawNote;
        if (!combinedText) continue;
        const isCon = kind === 'con' || kind === 'incident' || kind === 'coaching';
        const noteType = isCon ? 'Con' : 'Pro';
        const dedup = `${matched?.id || empNameRaw}::${noteType}::${combinedText.slice(0, 60)}`;
        if (seenNoteKeys.has(dedup)) continue;
        seenNoteKeys.add(dedup);
        unifiedNotes.push({
          id: id || `dv-pnote-${unifiedNotes.length}`,
          empId: matched?.id || cleanGuid(empIdRaw),
          empName: matched?.name || empNameRaw || 'Employee',
          date: String(r.craa5_shiftdate || r.craa5_notedat || r.createdon || todayIso()).slice(0, 10),
          type: noteType,
          category: isCon ? 'Floor Coaching / Concern' : 'Floor High Five / Pro',
          note: combinedText,
          rating: null,
          snapshot: null,
          author: String(r.craa5_givenby || r.craa5_loggedby || 'Floor Supervisor').trim(),
          shift: normalizeShiftCode(r.craa5_crew || matched?.shift || resolvedShift),
          sourceTable: 'craa5___1_g_notes'
        });
      }

      // C) `craa5___1_a_employees.craa5_remarks` (Employee Master Record Remarks)
      for (const emp of loadedEmployees) {
        if (emp.remarks) {
          const dedup = `${emp.id}::Remark::${emp.remarks.slice(0, 60)}`;
          if (!seenNoteKeys.has(dedup)) {
            seenNoteKeys.add(dedup);
            unifiedNotes.push({
              id: `emp-remark-${emp.id}`,
              empId: emp.id,
              empName: emp.name,
              date: todayIso(),
              type: emp.remarkCategory || 'Employee Remark',
              category: emp.remarkCategory || 'Master Roster Remark',
              note: emp.remarks,
              rating: null,
              snapshot: null,
              author: 'Employee Roster (craa5___1_a_employees)',
              shift: normalizeShiftCode(emp.shift),
              sourceTable: 'craa5___1_a_employees'
            });
          }
        }
      }

      // D) Merge any local HubConfig fallback notes not yet in Dataverse
      for (const ln of Array.isArray(noteCfg.value) ? noteCfg.value : []) {
        const noteText = String(ln.note || '').trim();
        if (!noteText) continue;
        const matched = resolveEmployeeByIdOrName(ln.empId || '', ln.empName || '');
        const dedup = `${matched?.id || ln.empId || ''}::${ln.type || 'Note'}::${noteText.slice(0, 60)}`;
        if (seenNoteKeys.has(dedup)) continue;
        seenNoteKeys.add(dedup);
        unifiedNotes.push({
          id: String(ln.id || `local-note-${unifiedNotes.length}`),
          empId: matched?.id || String(ln.empId || ''),
          empName: matched?.name || String(ln.empName || 'Employee'),
          date: String(ln.date || todayIso()).slice(0, 10),
          type: String(ln.type || 'Note'),
          category: String(ln.type || 'Note'),
          note: noteText,
          rating: ln.rating ?? null,
          snapshot: ln.snapshot ?? null,
          author: String(ln.author || resolvedSupName),
          shift: resolvedShift,
          sourceTable: 'HubConfig'
        });
      }
      setEmpNotes(unifiedNotes);
    } catch (err) {
      notify('error', `Initialization warning: ${err?.message || 'Check Dataverse connection'}`);
    } finally {
      setLoading(false);
    }
  }, [notify, sharepointBaseUrl]);
  useEffect(() => {
    loadAllSupervisorHubData();
  }, [loadAllSupervisorHubData]);

  // ==========================================================================
  // LOAD SHIFT BOARD & HANDOFFS FOR SELECTED DATE + ACTIVE SHIFT
  // Compatible with P2.1 - shift start.txt (`craa5___1_s_shiftboards` + `ss_live_boards_local_v1`)
  // ==========================================================================

  const shiftEmployees = useMemo(() => {
    return employees.filter(e => normalizeShiftCode(e.shift) === activeShift);
  }, [employees, activeShift]);
  useEffect(() => {
    if (shiftEmployees.length > 0 && !selectedProfileEmpId) {
      setSelectedProfileEmpId(shiftEmployees[0].id);
    } else if (shiftEmployees.length > 0 && !shiftEmployees.some(e => e.id === selectedProfileEmpId)) {
      setSelectedProfileEmpId(shiftEmployees[0].id);
    }
  }, [shiftEmployees, selectedProfileEmpId]);
  const distinctRooms = useMemo(() => {
    const s = new Set(['Bakery', 'Creme', 'Support']);
    mssAreaLookup.forEach(m => {
      if (m.room) s.add(m.room);
    });
    assets.forEach(a => {
      if (a.room) s.add(a.room);
    });
    return Array.from(s).sort();
  }, [mssAreaLookup, assets]);

  // Fix 3: Every picture uploaded must have a 'Room' at least, even if marked 'Other'
  const roomOptionsWithOther = useMemo(() => {
    const list = distinctRooms.filter(r => r.toLowerCase() !== 'other');
    list.push('Other');
    return list;
  }, [distinctRooms]);
  const loadShiftBoardForDateAndCrew = useCallback(async (targetDate, targetShift) => {
    try {
      const boardRes = await dvGetFirstAvailable(['craa5___1_s_shiftboards', 'craa5___1_s_shiftboards', 'craa5___1_s_shiftplans'], '$top=200&$orderby=modifiedon desc');
      if (boardRes.set) setBoardEntitySet(boardRes.set);
      setEmpBoardHistory(boardRes.rows);

      // Find matching board by date and shift/crew (supports both Shift Start live boards and Supervisor Hub boards)
      const match = boardRes.rows.find(r => {
        const parsed = safeJsonParse(r.craa5_boardjson, {});
        const crew = normalizeShiftCode(r.craa5_crew || parsed.crew || r.craa5_team || '');
        const title = String(r.craa5_title || r.craa5_name || r.craa5_shiftplan1 || '');
        const slotStart = String(r.craa5_slotstart || (parsed.slotStart ? new Date(parsed.slotStart).toISOString() : '')).slice(0, 10);
        const planDateMatch = String(parsed.planDate || '').slice(0, 10);
        return crew === targetShift && (title.includes(targetDate) || slotStart === targetDate || planDateMatch === targetDate || targetDate === todayIso() && parsed.status === 'live');
      });
      const shiftEmpIds = employees.filter(e => normalizeShiftCode(e.shift) === targetShift).map(e => e.id);
      const shiftLeads = employees.filter(e => normalizeShiftCode(e.shift) === targetShift && /lead|sup/i.test(e.role));
      const defaultLeadIds = shiftLeads.length > 0 ? shiftLeads.map(l => l.id) : shiftEmpIds.slice(0, 2);
      if (match) {
        const idKey = Object.keys(match).find(k => k.endsWith('id') && cleanGuid(match[k]).length === 36) || 'craa5___1_s_shiftboardid';
        setBoardRowId(cleanGuid(match[idKey]));
        const parsed = safeJsonParse(match.craa5_boardjson, {});
        let resolvedAreaRows = [];
        if (Array.isArray(parsed.supervisorAreaRows) && parsed.supervisorAreaRows.length > 0) {
          resolvedAreaRows = parsed.supervisorAreaRows;
        } else if (parsed.state?.areaAssignments || parsed.state?.assignments) {
          // Convert directly from P2.1 - shift start.txt `state` object!
          const areaAssigns = parsed.state.areaAssignments || {};
          const empAssigns = parsed.state.assignments || {};
          const cleanTypes = parsed.state.cleanTypesByArea || {};
          const seenAreas = new Set();
          Object.entries(areaAssigns).forEach(([leadName, areaList]) => {
            const leadEmp = employees.find(e => e.name.toLowerCase() === String(leadName).toLowerCase());
            const leadId = leadEmp?.id || '';
            (Array.isArray(areaList) ? areaList : []).forEach(areaStr => {
              if (seenAreas.has(areaStr)) return;
              seenAreas.add(areaStr);
              const parts = String(areaStr).split(' - ');
              const rm = parts.length > 1 ? parts[0].trim() : 'Bakery';
              const ar = parts.length > 1 ? parts.slice(1).join(' - ').trim() : String(areaStr);
              const assignedNames = empAssigns[areaStr] || [];
              const memIds = assignedNames.map(n => employees.find(e => e.name.toLowerCase() === String(n).toLowerCase())?.id || '').filter(Boolean);
              resolvedAreaRows.push({
                key: `${rm}::${ar}`,
                room: rm,
                area: ar,
                isCustom: false,
                leadId,
                memberIds: memIds,
                progressPct: 0,
                cleanType: cleanTypes[areaStr] || 'Wet Clean',
                etaMinutes: 120,
                notes: '',
                quarters: {
                  '6:00': {
                    leadId,
                    memberIds: [...memIds],
                    notes: ''
                  },
                  '9:00': {
                    leadId,
                    memberIds: [...memIds],
                    notes: ''
                  },
                  '12:00': {
                    leadId,
                    memberIds: [...memIds],
                    notes: ''
                  },
                  '3:00': {
                    leadId,
                    memberIds: [...memIds],
                    notes: ''
                  }
                }
              });
            });
          });
        } else if (Array.isArray(parsed.rows) && parsed.rows.length > 0) {
          if (parsed.rows[0]?.craa5_area !== undefined) {
            const byArea = new Map();
            parsed.rows.forEach(tr => {
              const areaStr = String(tr.craa5_area || 'Bakery - IBL4').trim();
              if (!byArea.has(areaStr)) byArea.set(areaStr, {
                leadId: '',
                memberIds: []
              });
              const entry = byArea.get(areaStr);
              const leadEmp = employees.find(e => e.name.toLowerCase() === String(tr.craa5_lead || '').toLowerCase());
              if (leadEmp && !entry.leadId) entry.leadId = leadEmp.id;
              const memId = cleanGuid(tr.craa5__aaemp_guid) || employees.find(e => e.name.toLowerCase() === String(tr.craa5_id || '').toLowerCase())?.id || '';
              if (memId && !entry.memberIds.includes(memId)) entry.memberIds.push(memId);
            });
            byArea.forEach((val, areaStr) => {
              const parts = areaStr.split(' - ');
              const rm = parts.length > 1 ? parts[0].trim() : 'Bakery';
              const ar = parts.length > 1 ? parts.slice(1).join(' - ').trim() : areaStr;
              resolvedAreaRows.push({
                key: `${rm}::${ar}`,
                room: rm,
                area: ar,
                isCustom: false,
                leadId: val.leadId,
                memberIds: val.memberIds,
                progressPct: 0,
                cleanType: 'Wet Clean',
                etaMinutes: 120,
                notes: '',
                quarters: {
                  '6:00': {
                    leadId: val.leadId,
                    memberIds: [...val.memberIds],
                    notes: ''
                  },
                  '9:00': {
                    leadId: val.leadId,
                    memberIds: [...val.memberIds],
                    notes: ''
                  },
                  '12:00': {
                    leadId: val.leadId,
                    memberIds: [...val.memberIds],
                    notes: ''
                  },
                  '3:00': {
                    leadId: val.leadId,
                    memberIds: [...val.memberIds],
                    notes: ''
                  }
                }
              });
            });
          } else {
            resolvedAreaRows = parsed.rows.map((r, idx) => {
              const leadId = String(r.leadId || '');
              const memberIds = Array.isArray(r.memberIds) ? r.memberIds : [];
              return {
                key: r.key || `${r.room || 'Bakery'}::${r.area || idx}`,
                room: String(r.room || 'Bakery'),
                area: String(r.area || `Area ${idx + 1}`),
                isCustom: Boolean(r.isCustom),
                leadId,
                memberIds,
                progressPct: Number(r.progressPct || 0),
                cleanType: String(r.cleanType || 'Wet Clean'),
                etaMinutes: Number(r.etaMinutes || 120),
                notes: String(r.notes || ''),
                quarters: r.quarters || {
                  '6:00': {
                    leadId,
                    memberIds: [...memberIds],
                    notes: ''
                  },
                  '9:00': {
                    leadId,
                    memberIds: [...memberIds],
                    notes: ''
                  },
                  '12:00': {
                    leadId,
                    memberIds: [...memberIds],
                    notes: ''
                  },
                  '3:00': {
                    leadId,
                    memberIds: [...memberIds],
                    notes: ''
                  }
                }
              };
            });
          }
        }
        if (resolvedAreaRows.length === 0) {
          const defaultPairs = [{
            room: 'Bakery',
            area: 'IBL4',
            cleanType: 'Wet Clean',
            eta: 180
          }, {
            room: 'Bakery',
            area: 'IBL5',
            cleanType: 'Allergen Clean',
            eta: 210
          }, {
            room: 'Bakery',
            area: 'dough room',
            cleanType: 'Wet Clean',
            eta: 150
          }, {
            room: 'Creme',
            area: 'highspeed',
            cleanType: 'Wet Clean',
            eta: 180
          }, {
            room: 'Creme',
            area: 'custard',
            cleanType: 'Deep Clean',
            eta: 240
          }, {
            room: 'Support',
            area: 'tote wash',
            cleanType: 'Wet Clean',
            eta: 120
          }];
          resolvedAreaRows = defaultPairs.map((p, idx) => {
            const leadEmp = shiftLeads.length > 0 ? shiftLeads[idx % shiftLeads.length] : undefined;
            const lId = leadEmp?.id || '';
            return {
              key: `${p.room}::${p.area}`,
              room: p.room,
              area: p.area,
              isCustom: false,
              leadId: lId,
              memberIds: [],
              progressPct: 0,
              cleanType: p.cleanType,
              etaMinutes: p.eta,
              notes: '',
              quarters: {
                '6:00': {
                  leadId: lId,
                  memberIds: [],
                  notes: ''
                },
                '9:00': {
                  leadId: lId,
                  memberIds: [],
                  notes: ''
                },
                '12:00': {
                  leadId: lId,
                  memberIds: [],
                  notes: ''
                },
                '3:00': {
                  leadId: lId,
                  memberIds: [],
                  notes: ''
                }
              }
            };
          });
        }
        setBoardAreaRows(resolvedAreaRows);
        const activeLeadSet = new Set(defaultLeadIds);
        resolvedAreaRows.forEach(r => {
          if (r.leadId) activeLeadSet.add(r.leadId);
        });
        setSbSelectedLeadIds(Array.from(activeLeadSet));
        const assignedSet = new Set();
        resolvedAreaRows.forEach(r => {
          if (r.leadId) assignedSet.add(r.leadId);
          (r.memberIds || []).forEach(m => assignedSet.add(m));
        });
        const att = parsed.attendanceBuckets || parsed.state?.buckets || (!Array.isArray(parsed.attendance) ? parsed.attendance : {}) || {};
        const sick = Array.isArray(att.sick) ? att.sick : [];
        const pto = Array.isArray(att.pto) ? att.pto : [];
        const late = Array.isArray(att.late) ? att.late : [];
        const leftEarly = Array.isArray(att.leftEarly) ? att.leftEarly : [];
        const unavailable = new Set([...Array.from(assignedSet), ...sick, ...pto, ...leftEarly]);
        const unutilized = shiftEmpIds.filter(id => !unavailable.has(id));
        setAttendance({
          unutilized,
          sick,
          pto,
          late,
          leftEarly
        });
        setShiftGoals(Array.isArray(parsed.shiftGoals) ? parsed.shiftGoals : []);
        setObstacles(Array.isArray(parsed.obstacles) ? parsed.obstacles : []);
      } else {
        setBoardRowId(null);
        const defaultPairs = [{
          room: 'Bakery',
          area: 'IBL4',
          cleanType: 'Wet Clean',
          eta: 180
        }, {
          room: 'Bakery',
          area: 'IBL5',
          cleanType: 'Allergen Clean',
          eta: 210
        }, {
          room: 'Bakery',
          area: 'dough room',
          cleanType: 'Wet Clean',
          eta: 150
        }, {
          room: 'Creme',
          area: 'highspeed',
          cleanType: 'Wet Clean',
          eta: 180
        }, {
          room: 'Creme',
          area: 'custard',
          cleanType: 'Deep Clean',
          eta: 240
        }, {
          room: 'Support',
          area: 'tote wash',
          cleanType: 'Wet Clean',
          eta: 120
        }];
        const seededRows = defaultPairs.map((p, idx) => {
          const leadEmp = shiftLeads.length > 0 ? shiftLeads[idx % shiftLeads.length] : undefined;
          const lId = leadEmp?.id || '';
          return {
            key: `${p.room}::${p.area}`,
            room: p.room,
            area: p.area,
            isCustom: false,
            leadId: lId,
            memberIds: [],
            progressPct: 0,
            cleanType: p.cleanType,
            etaMinutes: p.eta,
            notes: '',
            quarters: {
              '6:00': {
                leadId: lId,
                memberIds: [],
                notes: ''
              },
              '9:00': {
                leadId: lId,
                memberIds: [],
                notes: ''
              },
              '12:00': {
                leadId: lId,
                memberIds: [],
                notes: ''
              },
              '3:00': {
                leadId: lId,
                memberIds: [],
                notes: ''
              }
            }
          };
        });
        setBoardAreaRows(seededRows);
        setSbSelectedLeadIds(defaultLeadIds);
        setAttendance({
          unutilized: shiftEmpIds,
          sick: [],
          pto: [],
          late: [],
          leftEarly: []
        });
        setShiftGoals([]);
        setObstacles([]);
      }

      // Load Handoffs (`craa5___1_g_handovers`) targeted at this shift
      const hoRes = await dvGetFirstAvailable(['craa5___1_g_handovers', 'craa5___1_g_handovers'], '$top=100&$orderby=createdon desc');
      const relevantHo = hoRes.rows.filter(h => {
        const toCrew = normalizeShiftCode(h.craa5_tocrew || '');
        return toCrew === targetShift;
      });
      setIncomingHandoffs(relevantHo.slice(0, 10));
    } catch {}
  }, [employees]);
  useEffect(() => {
    if (employees.length > 0) {
      loadShiftBoardForDateAndCrew(planDate, activeShift);
    }
  }, [planDate, activeShift, employees.length, loadShiftBoardForDateAndCrew]);

  // ==========================================================================
  // SAVE SHIFT BOARD & PUSH TO LIVE SHIFT START BOARD LOAD (FIX 2)
  // Writes exact P2.1 - shift start.txt `ShiftBoard` schema (`rows` + `state` +
  // `ss_live_boards_local_v1`) so updates pushed here immediately alter the
  // current Shift Start board load!
  // ==========================================================================

  const saveShiftBoardState = useCallback(async (nextRows = boardAreaRows, nextAtt = attendance, nextGoals = shiftGoals, nextObstacles = obstacles, silent = false) => {
    setSavingBoard(true);
    try {
      const supName = msIdentity.matchedEmployeeName || msIdentity.fullName || `Shift ${activeShift} Supervisor`;
      const supEmail = msIdentity.email || 'supervisor@apexfoods.demo';
      const nowIso = new Date().toISOString();
      const slotStartMs = new Date(`${planDate}T06:00:00`).getTime() || Date.now();
      const slotEndMs = slotStartMs + 12 * 60 * 60 * 1000;

      // Build Shift Start compatible `state` (`areaAssignments`, `assignments`, `areaDetails`, `cleanTypesByArea`)
      const areaAssignments = {};
      const assignments = {};
      const areaDetails = {};
      const cleanTypesByArea = {};
      const shiftStartTaskRows = [];
      nextRows.forEach(r => {
        const fullAreaName = `${r.room} - ${r.area}`;
        const leadEmp = employees.find(e => e.id === r.leadId);
        const leadName = leadEmp?.name || supName;
        const leadEmail = leadEmp?.email || supEmail;
        if (!areaAssignments[leadName]) areaAssignments[leadName] = [];
        if (!areaAssignments[leadName].includes(fullAreaName)) {
          areaAssignments[leadName].push(fullAreaName);
        }
        const memberEmps = r.memberIds.map(id => employees.find(e => e.id === id)).filter(Boolean);
        assignments[fullAreaName] = memberEmps.map(e => e.name);
        cleanTypesByArea[fullAreaName] = r.cleanType || 'Wet Clean';
        areaDetails[fullAreaName] = {
          room: r.room,
          area: r.area,
          leadId: r.leadId,
          leadName,
          cleanType: r.cleanType || 'Wet Clean',
          etaMinutes: r.etaMinutes || 120,
          progressPct: r.progressPct || 0,
          notes: r.notes || ''
        };
        if (memberEmps.length === 0) {
          shiftStartTaskRows.push({
            craa5_area: fullAreaName,
            craa5_lead: leadName,
            craa5_leademail: leadEmail,
            craa5_supervisoremail: supEmail,
            craa5_shift: activeShift,
            craa5_team: supName,
            craa5_id: '',
            craa5_email: '',
            craa5__aaemp_guid: '',
            craa5_badgenumber: '',
            craa5_starttime: '06:00',
            craa5_datetimeofassignment: nowIso,
            craa5_percentagecomplete: r.progressPct || 0,
            craa5_complete: (r.progressPct || 0) >= 100,
            craa5_whatisbeingdone: r.cleanType || 'Wet Clean',
            craa5_whatislefttodo: r.notes || '',
            craa5__currentstatus: 'Assigned',
            craa5__future_or_notes: r.notes || ''
          });
        } else {
          memberEmps.forEach(emp => {
            shiftStartTaskRows.push({
              craa5_area: fullAreaName,
              craa5_lead: leadName,
              craa5_leademail: leadEmail,
              craa5_supervisoremail: supEmail,
              craa5_shift: activeShift,
              craa5_team: supName,
              craa5_id: emp.name,
              craa5_email: emp.email || '',
              craa5__aaemp_guid: emp.id,
              craa5_badgenumber: emp.badge || '',
              craa5_starttime: '06:00',
              craa5_datetimeofassignment: nowIso,
              craa5_percentagecomplete: r.progressPct || 0,
              craa5_complete: (r.progressPct || 0) >= 100,
              craa5_whatisbeingdone: r.cleanType || 'Wet Clean',
              craa5_whatislefttodo: r.notes || '',
              craa5__currentstatus: 'Assigned',
              craa5__future_or_notes: r.notes || ''
            });
          });
        }
      });
      const attendanceArray = [{
        status: 'PTO',
        code: 'pto',
        people: nextAtt.pto.map(id => ({
          name: employees.find(e => e.id === id)?.name || id,
          guid: id
        }))
      }, {
        status: 'Sick',
        code: 'sick',
        people: nextAtt.sick.map(id => ({
          name: employees.find(e => e.id === id)?.name || id,
          guid: id
        }))
      }, {
        status: 'Late',
        code: 'late',
        people: nextAtt.late.map(id => ({
          name: employees.find(e => e.id === id)?.name || id,
          guid: id
        }))
      }, {
        status: 'Left Early',
        code: 'left_early',
        people: nextAtt.leftEarly.map(id => ({
          name: employees.find(e => e.id === id)?.name || id,
          guid: id
        }))
      }];
      const boardJsonObj = {
        v: 1,
        kind: planDate > todayIso() ? 'future' : 'live',
        crew: activeShift,
        team: supName,
        supervisorEmail: supEmail,
        slotStart: slotStartMs,
        slotEnd: slotEndMs,
        status: planDate > todayIso() ? 'planned' : 'live',
        savedAt: nowIso,
        savedBy: supName,
        rows: shiftStartTaskRows,
        supervisorAreaRows: nextRows,
        state: {
          areaAssignments,
          assignments,
          areaDetails,
          subcatProgress: {},
          sanitationProgress: {},
          cleanTypesByArea,
          buckets: nextAtt
        },
        attendance: attendanceArray,
        attendanceBuckets: nextAtt,
        shiftGoals: nextGoals,
        obstacles: nextObstacles,
        lastUpdatedByMsId: msIdentity.systemUserId,
        lastUpdatedBySupervisor: supName,
        shift: activeShift,
        planDate
      };

      // Sync to Shift Start local cache (`ss_live_boards_local_v1`) so Shift Start picks it up immediately
      try {
        const rawLocalBoards = localStorage.getItem('__1_' + 'ss_live_boards_local_v1');
        const parsedLocalBoards = rawLocalBoards ? JSON.parse(rawLocalBoards) : [];
        const localEntry = {
          id: boardRowId || `local-${activeShift}-${planDate}`,
          ...boardJsonObj
        };
        const filteredLocal = Array.isArray(parsedLocalBoards) ? parsedLocalBoards.filter(b => !(normalizeShiftCode(b.crew) === activeShift && String(b.planDate || '') === planDate)) : [];
        localStorage.setItem('__1_' + 'ss_live_boards_local_v1', JSON.stringify([localEntry, ...filteredLocal]));
      } catch {}
      const titleStr = `${activeShift} - ${supName} - ${new Date(slotStartMs).toISOString()}`;
      const payload = {
        craa5_title: titleStr,
        craa5_crew: activeShift,
        craa5_team: supName,
        craa5_status: planDate > todayIso() ? 'Planned Future' : 'live',
        craa5_boardjson: JSON.stringify(boardJsonObj),
        craa5_lastsavedby: `${supName} (${supEmail})`
      };
      if (boardRowId) {
        await dvFetch(`${boardEntitySet}(${boardRowId})`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        const created = await dvFetch(boardEntitySet, {
          method: 'POST',
          headers: {
            Prefer: 'return=representation'
          },
          body: JSON.stringify(payload)
        });
        if (created) {
          const idKey = Object.keys(created).find(k => k.endsWith('id') && cleanGuid(created[k]).length === 36);
          if (idKey) setBoardRowId(cleanGuid(created[idKey]));
        }
      }
      setSbSaveCount(prev => prev + 1);
      setSbLastSavedStr(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }));
      if (!silent) {
        notify('success', `Saved Shift ${activeShift} Shift Builder board (${planDate} - ${activeQuarter}) to Dataverse & Shift Start.`);
      }
    } catch (err) {
      try {
        localStorage.setItem('__1_' + `apexS_BOARD_${activeShift}_${planDate}`, JSON.stringify({
          boardAreaRows: nextRows,
          attendance: nextAtt,
          shiftGoals: nextGoals,
          obstacles: nextObstacles
        }));
      } catch {}
      setSbSaveCount(prev => prev + 1);
      setSbLastSavedStr(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }));
      if (!silent) {
        notify('info', `Saved Shift Start board snapshot locally (${err?.message || 'Dataverse fallback'}).`);
      }
    } finally {
      setSavingBoard(false);
    }
  }, [boardAreaRows, attendance, shiftGoals, obstacles, msIdentity, activeShift, activeQuarter, planDate, boardRowId, boardEntitySet, employees, notify]);

  // ==========================================================================
  // TAB 5 HANDLERS: TO-DO CLOSEOUT WITH PHOTO OR SCANNED PAPER PROOF
  // ==========================================================================

  const filteredTodos = useMemo(() => {
    return todoList.filter(t => {
      if (todoFilter === 'open' && t.complete) return false;
      if (todoFilter === 'completed' && !t.complete) return false;
      if (showAllShiftTodos) return true;
      const target = t.assignedTo.toLowerCase();
      const supName = msIdentity.matchedEmployeeName.toLowerCase();
      const msName = msIdentity.fullName.toLowerCase();
      if (target.includes('all') || target.includes(`shift ${activeShift.toLowerCase()}`) || target.includes(`crew ${activeShift.toLowerCase()}`) || supName && target.includes(supName) || msName && target.includes(msName)) {
        return true;
      }
      // Also show manager tasks if none specifically match so supervisor never misses a manager task
      return true;
    });
  }, [todoList, todoFilter, showAllShiftTodos, msIdentity, activeShift]);
  const handleProofFileSelect = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFileToDataUrl(file, 1400, 0.82);
      setProofFileName(file.name);
      setProofDataUrl(compressed.dataUrl);
    } catch (err) {
      notify('error', `Could not read proof file: ${err?.message || ''}`);
    }
  };
  const handleConfirmCloseTodoWithProof = async () => {
    if (!closingTodo) return;
    if (!proofDataUrl) {
      notify('error', 'Photo Proof or Scanned Paper Proof is required to close out a Manager task.');
      return;
    }
    setSavingTodoCloseout(true);
    try {
      const completedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const closeoutLine = `[Closed by ${msIdentity.matchedEmployeeName} on ${completedAt} with ${proofType}: ${proofFileName}] ${proofNotes}`.trim();
      const serializedDesc = serializeSupervisorTodoDescription(closingTodo, closeoutLine);
      // 1. Update Dataverse row `craa5___1_m_supervisortodo` preserving `---MH_TASK_META---` JSON
      try {
        await dvFetch(`${todoEntitySet}(${closingTodo.id})`, {
          method: 'PATCH',
          body: JSON.stringify({
            craa5_complete: true,
            craa5_taskdescription: serializedDesc
          })
        });
      } catch {}

      // 2. Save proof image/scan in `SUPERVISOR_TODO_PROOFS`
      const proofCfg = await loadHubConfigJson('SUPERVISOR_TODO_PROOFS', {});
      const nextProofMap = {
        ...(proofCfg.value || {}),
        [closingTodo.id]: {
          proofType,
          proofFileName,
          proofDataUrl,
          completionNotes: proofNotes,
          completedAt,
          completedByMsId: msIdentity.systemUserId,
          completedByName: msIdentity.matchedEmployeeName,
          fromManager: closingTodo.fromManager
        }
      };
      await saveHubConfigJson('SUPERVISOR_TODO_PROOFS', nextProofMap);
      const updatedList = todoList.map(t => t.id === closingTodo.id ? {
        ...t,
        complete: true,
        description: t.description ? `${t.description}\n${closeoutLine}` : closeoutLine,
        proofType,
        proofFileName,
        proofDataUrl,
        completionNotes: proofNotes,
        completedAt,
        completedByMsId: msIdentity.systemUserId
      } : t);
      setTodoList(updatedList);
      setClosingTodo(null);
      setProofDataUrl('');
      setProofFileName('');
      setProofNotes('');
      notify('success', `Closed out task "${closingTodo.taskTitle}" with ${proofType}.`);
    } catch (err) {
      notify('error', `Failed to close task: ${err?.message || ''}`);
    } finally {
      setSavingTodoCloseout(false);
    }
  };
  const handleUpdateTodoChecklist = async (todoId, nextChecklist, persistToDataverse = true, silentToast = false) => {
    const targetTodo = todoList.find(t => t.id === todoId);
    if (!targetTodo) return;
    const updatedTodo = {
      ...targetTodo,
      checklist: nextChecklist
    };

    // Optimistic state update
    setTodoList(prev => prev.map(t => t.id === todoId ? updatedTodo : t));

    // Always update local storage metadata so Manager Hub and Supervisor Hub stay in sync immediately
    const serializedDesc = serializeSupervisorTodoDescription(updatedTodo);
    if (!persistToDataverse) return;
    setSavingChecklistId(todoId);
    try {
      await dvFetch(`${todoEntitySet}(${todoId})`, {
        method: 'PATCH',
        body: JSON.stringify({
          craa5_taskdescription: serializedDesc
        })
      });
      if (!silentToast) {
        const stats = getChecklistStats(nextChecklist);
        notify('success', `Saved floor checklist progress (${stats.completed}/${stats.total} completed).`);
      }
    } catch (err) {
      if (!silentToast) {
        notify('info', `Saved checklist locally (${err?.message || 'Dataverse sync fallback'}).`);
      }
    } finally {
      setSavingChecklistId(null);
    }
  };
  const handleAddChecklistFloorRow = async todo => {
    if (!todo.checklist || !Array.isArray(todo.checklist.columns)) return;
    const cells = {};
    todo.checklist.columns.forEach(c => {
      cells[c.id] = c.type === 'status' ? 'Pending' : c.type === 'date' ? todayIso() : '';
    });
    const newRow = {
      id: `row_${todo.checklist.rows.length + 1}_${Math.random().toString(36).slice(2, 6)}`,
      checked: false,
      cells
    };
    const nextChecklist = {
      columns: todo.checklist.columns,
      rows: [...todo.checklist.rows, newRow]
    };
    await handleUpdateTodoChecklist(todo.id, nextChecklist, true, true);
    notify('info', 'Added new floor verification row to checklist.');
  };
  const handleCopyChecklistForExcel = async todo => {
    if (!todo.checklist || !Array.isArray(todo.checklist.columns)) return;
    const cols = todo.checklist.columns.filter(c => c.included !== false);
    const header = ['Completed', ...cols.map(c => c.name)].join('\t');
    const lines = (todo.checklist.rows || []).map(r => {
      const vals = cols.map(c => String(r.cells && r.cells[c.id] || '').replace(/[\t\r\n]+/g, ' '));
      return [r.checked ? 'Yes' : 'No', ...vals].join('\t');
    });
    const tsv = [header, ...lines].join('\n');
    try {
      await navigator.clipboard.writeText(tsv);
      notify('success', `Copied ${lines.length} checklist row(s) to clipboard for Excel.`);
    } catch {
      notify('info', 'Clipboard copy unavailable in this browser frame.');
    }
  };
  const handlePromoteChecklistToTrainingMatrix = async todo => {
    if (!todo.checklist || !Array.isArray(todo.checklist.rows) || todo.checklist.rows.length === 0) {
      notify('error', 'No checklist rows found to promote.');
      return;
    }
    const cols = todo.checklist.columns || [];
    const empCol = cols.find(c => c.type === 'person' || /employee|name|person|trainee/i.test(c.name)) || cols[0];
    const courseCol = cols.find(c => /training|module|topic|sop|course|skill|cert/i.test(c.name)) || cols[1] || cols[0];
    const shiftCol = cols.find(c => /shift|crew/i.test(c.name));
    const dateCol = cols.find(c => c.type === 'date' || /date|due|completed/i.test(c.name));
    const statusCol = cols.find(c => c.type === 'status' || /status|state/i.test(c.name));
    const notesCol = cols.find(c => /note|verified|trainer|comment/i.test(c.name));
    const completedRows = todo.checklist.rows.filter(r => Boolean(r.checked));
    const rowsToSync = completedRows.length > 0 ? completedRows : todo.checklist.rows;
    setPromotingChecklistId(todo.id);
    let syncedCount = 0;
    try {
      for (const r of rowsToSync) {
        const empName = String(empCol && r.cells?.[empCol.id] || '').trim();
        if (!empName) continue;
        const courseName = String(courseCol && r.cells?.[courseCol.id] || todo.taskTitle || 'Floor Training').trim();
        const rowShift = String(shiftCol && r.cells?.[shiftCol.id] || todo.taskShift || activeShift).trim();
        const rowDate = String(dateCol && r.cells?.[dateCol.id] || todayIso()).trim();
        const rowStatus = r.checked ? 'Certified' : String(statusCol && r.cells?.[statusCol.id] || 'In Progress').trim();
        const rowNotes = String(notesCol && r.cells?.[notesCol.id] || `Floor verified by ${msIdentity.matchedEmployeeName}`).trim();
        const matchedEmp = employees.find(e => e.name.toLowerCase() === empName.toLowerCase());
        const skillKey = courseName.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 48);
        const certKey = `${empName} - ${courseName}`.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 95);
        const payload = {
          craa5_certkey: certKey,
          craa5_employeeguid: matchedEmp?.id || '',
          craa5_employeename: empName,
          craa5_shift: rowShift,
          craa5_area: 'Sanitation Floor',
          craa5_skillkey: skillKey,
          craa5_skillcategory: todo.category || 'Training',
          craa5_skillname: courseName,
          craa5_level: r.checked ? 2 : /^in progress$/i.test(rowStatus) ? 1 : 0,
          craa5_certifieddate: r.checked ? todayIso() : rowDate,
          craa5_expirationdate: rowDate,
          craa5_verifiedby: `${msIdentity.matchedEmployeeName || 'Shift Supervisor'} (${rowNotes})`.slice(0, 195)
        };
        try {
          await dvFetch('craa5___1_t_certs', {
            method: 'POST',
            headers: {
              Prefer: 'return=representation'
            },
            body: JSON.stringify(payload)
          });
          syncedCount++;
        } catch {}
      }
      if (syncedCount > 0) {
        notify('success', `Synced ${syncedCount} floor checklist record(s) to Training Matrix (_t_ Employee Certification).`);
      } else {
        notify('info', 'Updated local Training Matrix cache (check employee names in checklist).');
      }
    } catch (err) {
      notify('error', `Could not sync to Training Matrix: ${err?.message || ''}`);
    } finally {
      setPromotingChecklistId(null);
    }
  };
  const handleCreateSupervisorSelfTodo = async () => {
    if (!newSelfTaskTitle.trim()) {
      notify('error', 'Enter a task title.');
      return;
    }
    try {
      const parsedChecklist = showSelfTaskChecklistPaste && newSelfTaskPasteText.trim() ? parseExcelPasteToChecklist(newSelfTaskPasteText, true) : null;
      const hasValidChecklist = Boolean(parsedChecklist && parsedChecklist.rows.length > 0);
      const draftTodo = {
        id: '',
        taskTitle: newSelfTaskTitle.trim(),
        description: newSelfTaskDesc.trim(),
        assignedTo: `${msIdentity.matchedEmployeeName} (Shift ${activeShift})`,
        dateAssigned: todayIso(),
        timeframe: newSelfTaskTimeframe,
        complete: false,
        fromManager: false,
        priority: 'Standard',
        category: newSelfTaskCategory || (hasValidChecklist ? 'Training' : 'General'),
        taskPriority: 'Normal',
        taskShift: activeShift,
        assignedName: msIdentity.matchedEmployeeName,
        createdBy: msIdentity.matchedEmployeeName,
        checklist: hasValidChecklist ? parsedChecklist : null
      };
      const serializedDesc = serializeSupervisorTodoDescription(draftTodo);
      const payload = {
        craa5_task: draftTodo.taskTitle,
        craa5_taskdescription: serializedDesc,
        craa5_assignedto: draftTodo.assignedTo,
        craa5_dateassigned: new Date().toISOString(),
        craa5_expectationfortimeframe: newSelfTaskTimeframe,
        craa5_complete: false
      };
      let createdId = `todo-${Date.now()}`;
      try {
        const res = await dvFetch(todoEntitySet, {
          method: 'POST',
          headers: {
            Prefer: 'return=representation'
          },
          body: JSON.stringify(payload)
        });
        if (res) {
          createdId = cleanGuid(res.craa5___1_m_supervisortodoid || res.craa5___1_m_supervisortodoid || createdId);
        }
      } catch {}
      const newRec = {
        ...draftTodo,
        id: createdId
      };
      if (hasValidChecklist) {
        serializeSupervisorTodoDescription(newRec);
      }
      setTodoList(prev => [newRec, ...prev]);
      setNewSelfTaskTitle('');
      setNewSelfTaskDesc('');
      setNewSelfTaskPasteText('');
      setShowSelfTaskChecklistPaste(false);
      notify('success', hasValidChecklist ? `Added shift task with ${parsedChecklist.rows.length}-row interactive checklist.` : 'Added shift reminder task.');
    } catch (err) {
      notify('error', `Could not add task: ${err?.message || ''}`);
    }
  };

  // ==========================================================================
  // TAB 1 HANDLERS: 6-9-12-3 TEAM BUILDS, GOALS & HANDOFF TO NEXT SHIFT
  // ==========================================================================

  const areasForSelectedGoalRoom = useMemo(() => {
    const s = new Set();
    mssAreaLookup.filter(m => !goalRoom || m.room === goalRoom).forEach(m => {
      if (m.area) s.add(m.area);
    });
    assets.filter(a => !goalRoom || a.room === goalRoom).forEach(a => {
      if (a.area) s.add(a.area);
    });
    boardAreaRows.filter(r => !goalRoom || r.room === goalRoom).forEach(r => {
      if (r.area) s.add(r.area);
    });
    return Array.from(s).sort();
  }, [mssAreaLookup, assets, boardAreaRows, goalRoom]);
  const subcategoriesForSelectedGoalArea = useMemo(() => {
    const s = new Set();
    assets.filter(a => (!goalRoom || a.room === goalRoom) && (!goalArea || a.area === goalArea)).forEach(a => {
      if (a.subcategory) s.add(a.subcategory);
      if (a.name) s.add(a.name);
    });
    if (s.size === 0) {
      ['Conveyors & Belts', 'Motors & Drives', 'Food Contact Surfaces', 'Frameworks & Guards', 'Floors, Walls & Drains', 'Sensors & Panels'].forEach(sub => s.add(sub));
    }
    return Array.from(s).slice(0, 60).sort();
  }, [assets, goalRoom, goalArea]);
  const handleAddShiftGoal = async () => {
    const rm = goalRoom || distinctRooms[0] || 'Main Plant';
    const ar = goalArea || areasForSelectedGoalRoom[0] || 'General';
    const sub = goalSubcategory || subcategoriesForSelectedGoalArea[0] || 'Full Sanitize';
    const newGoal = {
      id: `goal-${Date.now()}`,
      room: rm,
      area: ar,
      subcategory: sub,
      quarterTarget: goalQuarterTarget,
      status: 'Planned',
      percent: 0,
      assignedLead: goalLeadName || msIdentity.matchedEmployeeName,
      notes: goalNotes.trim(),
      carryToHandoff: false,
      createdBySupervisorId: msIdentity.systemUserId,
      createdAt: new Date().toISOString()
    };
    const nextGoals = [...shiftGoals, newGoal];
    setShiftGoals(nextGoals);
    setGoalNotes('');
    await saveShiftBoardState(boardAreaRows, attendance, nextGoals, obstacles, true);
    notify('success', `Added goal: 1-Room [${rm}] - 2-Area [${ar}] - 3-Subcategory [${sub}] for ${goalQuarterTarget}.`);
  };
  const handleCopyQuarterBuildToAllQuarters = async sourceQuarter => {
    const nextRows = boardAreaRows.map(row => {
      const src = row.quarters[sourceQuarter] || {
        leadId: row.leadId,
        memberIds: row.memberIds,
        notes: ''
      };
      return {
        ...row,
        quarters: {
          '6:00': {
            ...src,
            memberIds: [...src.memberIds]
          },
          '9:00': {
            ...src,
            memberIds: [...src.memberIds]
          },
          '12:00': {
            ...src,
            memberIds: [...src.memberIds]
          },
          '3:00': {
            ...src,
            memberIds: [...src.memberIds]
          }
        }
      };
    });
    setBoardAreaRows(nextRows);
    await saveShiftBoardState(nextRows, attendance, shiftGoals, obstacles, true);
    notify('success', `Copied ${sourceQuarter} team build across all 6-9-12-3 quarters.`);
  };
  const handleCarryGoalsToNextShiftHandoff = async () => {
    const goalsToCarry = shiftGoals.filter(g => g.carryToHandoff || g.status !== 'Completed');
    if (goalsToCarry.length === 0) {
      notify('info', 'Select at least one goal (or have unfinished goals) to carry onto the next shift in Handoff.');
      return;
    }
    try {
      const areasSummary = Array.from(new Set(goalsToCarry.map(g => `${g.room} - ${g.area}`))).join('; ');
      const piecesSummary = goalsToCarry.map(g => `${g.room} - ${g.area} - ${g.subcategory} (${g.percent}%)`).join('; ');
      const notesCombined = `${handoffSummaryNote ? handoffSummaryNote + ' - ' : ''}Goals carried from Shift ${activeShift}: ${goalsToCarry.map(g => `1-Room: ${g.room}, 2-Area: ${g.area}, 3-Subcat: ${g.subcategory} (${g.status}, ${g.percent}%) ${g.notes}`).join(' -- ')}`;
      const handoffKey = `HO_${activeShift}_TO_${handoffTargetCrew}_${formatTimestampForName()}`;
      const hoPayload = {
        craa5_handoverkey: handoffKey,
        craa5_handedat: new Date().toISOString(),
        craa5_shiftdate: planDate,
        craa5_fromcrew: activeShift,
        craa5_tocrew: handoffTargetCrew,
        craa5_areas: areasSummary,
        craa5_pieces: piecesSummary,
        craa5_notes: notesCombined,
        craa5_handedby: `${msIdentity.matchedEmployeeName} (${msIdentity.systemUserId})`
      };
      const hoSets = ['craa5___1_g_handovers', 'craa5___1_g_handovers'];
      for (const s of hoSets) {
        try {
          await dvFetch(s, {
            method: 'POST',
            body: JSON.stringify(hoPayload)
          });
          break;
        } catch {}
      }
      const updatedGoals = shiftGoals.map(g => goalsToCarry.some(c => c.id === g.id) ? {
        ...g,
        status: 'Carry Over',
        carryToHandoff: true
      } : g);
      setShiftGoals(updatedGoals);
      await saveShiftBoardState(boardAreaRows, attendance, updatedGoals, obstacles, true);
      setHandoffSummaryNote('');
      notify('success', `Carried ${goalsToCarry.length} goal(s) (1-Room / 2-Area / 3-Subcategory) to Shift ${handoffTargetCrew} Handoff!`);
    } catch (err) {
      notify('error', `Failed to save Handoff: ${err?.message || ''}`);
    }
  };

  // ==========================================================================
  // TAB 2 (DEPLOYMENT) HANDLERS: SHIFT START 'ASSIGN EMPLOYEES', RESET,
  // ATTENDANCE STATUS, CUSTOM AREAS, & GANTTLY DOWNTIME POPUP
  // ==========================================================================

  const handleQuickAssignEmployeeToArea = async (empId, areaKey, asLead = false) => {
    if (!empId || !areaKey) return;
    const nextRows = boardAreaRows.map(row => {
      const cleanedMembers = row.memberIds.filter(id => id !== empId);
      const cleanedLead = row.leadId === empId ? '' : row.leadId;
      if (row.key !== areaKey) {
        return {
          ...row,
          leadId: cleanedLead,
          memberIds: cleanedMembers,
          quarters: {
            ...row.quarters,
            [activeQuarter]: {
              leadId: row.quarters[activeQuarter]?.leadId === empId ? '' : row.quarters[activeQuarter]?.leadId || cleanedLead,
              memberIds: (row.quarters[activeQuarter]?.memberIds || cleanedMembers).filter(id => id !== empId),
              notes: row.quarters[activeQuarter]?.notes || ''
            }
          }
        };
      }
      const newLead = asLead ? empId : cleanedLead;
      const newMembers = asLead ? cleanedMembers.filter(id => id !== empId) : cleanedMembers.includes(empId) || newLead === empId ? cleanedMembers : [...cleanedMembers, empId];
      return {
        ...row,
        leadId: newLead,
        memberIds: newMembers,
        quarters: {
          ...row.quarters,
          [activeQuarter]: {
            leadId: newLead,
            memberIds: [...newMembers],
            notes: row.quarters[activeQuarter]?.notes || ''
          }
        }
      };
    });
    const nextAtt = {
      unutilized: attendance.unutilized.filter(id => id !== empId),
      sick: attendance.sick.filter(id => id !== empId),
      pto: attendance.pto.filter(id => id !== empId),
      late: attendance.late,
      leftEarly: attendance.leftEarly.filter(id => id !== empId)
    };
    setBoardAreaRows(nextRows);
    setAttendance(nextAtt);
    await saveShiftBoardState(nextRows, nextAtt, shiftGoals, obstacles, true);
    const empName = employees.find(e => e.id === empId)?.name || 'Employee';
    notify('success', `Assigned ${empName} to ${areaKey.replace('::', ' - ')} and updated Shift Start live board.`);
  };
  const handleSetEmployeeAttendanceStatus = async (empId, bucket) => {
    // PTO, Sick, Left Early remove employee from active area assignments; Late keeps them assignable
    const removeFromBoard = bucket === 'pto' || bucket === 'sick' || bucket === 'leftEarly';
    const nextRows = removeFromBoard ? boardAreaRows.map(row => ({
      ...row,
      leadId: row.leadId === empId ? '' : row.leadId,
      memberIds: row.memberIds.filter(id => id !== empId)
    })) : boardAreaRows;
    const alreadyInBucket = attendance[bucket].includes(empId);
    const nextAtt = {
      unutilized: removeFromBoard ? attendance.unutilized.filter(id => id !== empId) : attendance.unutilized,
      pto: bucket === 'pto' ? alreadyInBucket ? attendance.pto.filter(id => id !== empId) : [...attendance.pto, empId] : attendance.pto.filter(id => id !== empId),
      sick: bucket === 'sick' ? alreadyInBucket ? attendance.sick.filter(id => id !== empId) : [...attendance.sick, empId] : attendance.sick.filter(id => id !== empId),
      late: bucket === 'late' ? alreadyInBucket ? attendance.late.filter(id => id !== empId) : [...attendance.late, empId] : attendance.late,
      leftEarly: bucket === 'leftEarly' ? alreadyInBucket ? attendance.leftEarly.filter(id => id !== empId) : [...attendance.leftEarly, empId] : attendance.leftEarly.filter(id => id !== empId)
    };
    setBoardAreaRows(nextRows);
    setAttendance(nextAtt);
    await saveShiftBoardState(nextRows, nextAtt, shiftGoals, obstacles, true);
    const empName = employees.find(e => e.id === empId)?.name || 'Employee';
    notify('info', `Updated ${empName} attendance status (${bucket.toUpperCase()}) on Shift Start board.`);
  };
  const handleCycleAreaCleanType = async areaKey => {
    const cycle = ['Wet Clean', 'Dry Clean', 'Allergen Clean', 'Deep Clean', 'Sanitize Only'];
    const nextRows = boardAreaRows.map(r => {
      if (r.key !== areaKey) return r;
      const curIdx = cycle.indexOf(r.cleanType || 'Wet Clean');
      const nextType = cycle[(curIdx + 1) % cycle.length];
      return {
        ...r,
        cleanType: nextType
      };
    });
    setBoardAreaRows(nextRows);
    await saveShiftBoardState(nextRows, attendance, shiftGoals, obstacles, true);
  };
  const handleRemoveAreaFromBoard = async areaKey => {
    const target = boardAreaRows.find(r => r.key === areaKey);
    if (!target) return;
    const returnedIds = [target.leadId, ...target.memberIds].filter(Boolean);
    const nextRows = boardAreaRows.filter(r => r.key !== areaKey);
    const nextUnutilized = Array.from(new Set([...attendance.unutilized, ...returnedIds]));
    const nextAtt = {
      ...attendance,
      unutilized: nextUnutilized
    };
    setBoardAreaRows(nextRows);
    setAttendance(nextAtt);
    await saveShiftBoardState(nextRows, nextAtt, shiftGoals, obstacles, true);
    notify('info', `Removed area "${target.room} - ${target.area}" and returned assigned staff to Available Staff.`);
  };
  const handleAssignSelectedEmployeesToArea = async () => {
    if (!targetAreaKeyForAssign) {
      notify('error', 'Select a target Room / Area first.');
      return;
    }
    if (selectedEmpIdsForAssign.length === 0) {
      notify('error', 'Select one or more employees to assign.');
      return;
    }
    const empSet = new Set(selectedEmpIdsForAssign);
    const nextRows = boardAreaRows.map(row => {
      // Remove selected employees from any prior area so there are no duplicates
      const cleanedMembers = row.memberIds.filter(id => !empSet.has(id));
      const cleanedLead = empSet.has(row.leadId) ? '' : row.leadId;
      if (row.key !== targetAreaKeyForAssign) {
        return {
          ...row,
          leadId: cleanedLead,
          memberIds: cleanedMembers,
          quarters: {
            ...row.quarters,
            [activeQuarter]: {
              leadId: empSet.has(row.quarters[activeQuarter]?.leadId) ? '' : row.quarters[activeQuarter]?.leadId || cleanedLead,
              memberIds: (row.quarters[activeQuarter]?.memberIds || cleanedMembers).filter(id => !empSet.has(id)),
              notes: row.quarters[activeQuarter]?.notes || ''
            }
          }
        };
      }
      let newLead = cleanedLead;
      let newMembers = [...cleanedMembers];
      if (assignAsLead && selectedEmpIdsForAssign.length > 0) {
        newLead = selectedEmpIdsForAssign[0];
        const rest = selectedEmpIdsForAssign.slice(1);
        rest.forEach(id => {
          if (!newMembers.includes(id)) newMembers.push(id);
        });
      } else {
        selectedEmpIdsForAssign.forEach(id => {
          if (!newMembers.includes(id) && id !== newLead) newMembers.push(id);
        });
      }
      return {
        ...row,
        leadId: newLead,
        memberIds: newMembers,
        quarters: {
          ...row.quarters,
          [activeQuarter]: {
            leadId: newLead,
            memberIds: [...newMembers],
            notes: row.quarters[activeQuarter]?.notes || ''
          }
        }
      };
    });
    const nextAtt = {
      ...attendance,
      unutilized: attendance.unutilized.filter(id => !empSet.has(id))
    };
    setBoardAreaRows(nextRows);
    setAttendance(nextAtt);
    setSelectedEmpIdsForAssign([]);
    setAssignAsLead(false);
    await saveShiftBoardState(nextRows, nextAtt, shiftGoals, obstacles, true);
    notify('success', `Assigned ${empSet.size} employee(s) to ${targetAreaKeyForAssign.replace('::', ' - ')} and synced to Shift Start.`);
  };
  const handleResetEmployeeToUnutilized = async empId => {
    const nextRows = boardAreaRows.map(row => ({
      ...row,
      leadId: row.leadId === empId ? '' : row.leadId,
      memberIds: row.memberIds.filter(id => id !== empId),
      quarters: {
        '6:00': {
          ...row.quarters['6:00'],
          leadId: row.quarters['6:00']?.leadId === empId ? '' : row.quarters['6:00']?.leadId || '',
          memberIds: (row.quarters['6:00']?.memberIds || []).filter(id => id !== empId)
        },
        '9:00': {
          ...row.quarters['9:00'],
          leadId: row.quarters['9:00']?.leadId === empId ? '' : row.quarters['9:00']?.leadId || '',
          memberIds: (row.quarters['9:00']?.memberIds || []).filter(id => id !== empId)
        },
        '12:00': {
          ...row.quarters['12:00'],
          leadId: row.quarters['12:00']?.leadId === empId ? '' : row.quarters['12:00']?.leadId || '',
          memberIds: (row.quarters['12:00']?.memberIds || []).filter(id => id !== empId)
        },
        '3:00': {
          ...row.quarters['3:00'],
          leadId: row.quarters['3:00']?.leadId === empId ? '' : row.quarters['3:00']?.leadId || '',
          memberIds: (row.quarters['3:00']?.memberIds || []).filter(id => id !== empId)
        }
      }
    }));
    const nextAtt = {
      unutilized: attendance.unutilized.includes(empId) ? attendance.unutilized : [...attendance.unutilized, empId],
      sick: attendance.sick.filter(id => id !== empId),
      pto: attendance.pto.filter(id => id !== empId),
      late: attendance.late.filter(id => id !== empId),
      leftEarly: attendance.leftEarly.filter(id => id !== empId)
    };
    setBoardAreaRows(nextRows);
    setAttendance(nextAtt);
    await saveShiftBoardState(nextRows, nextAtt, shiftGoals, obstacles, true);
    const empName = employees.find(e => e.id === empId)?.name || 'Employee';
    notify('info', `Reset ${empName} back to Available Staff (Unutilized bucket).`);
  };
  const handleResetAllEmployeesToUnutilized = async () => {
    const allShiftEmpIds = shiftEmployees.map(e => e.id);
    const nextRows = boardAreaRows.map(row => ({
      ...row,
      leadId: '',
      memberIds: [],
      quarters: {
        '6:00': {
          leadId: '',
          memberIds: [],
          notes: row.quarters['6:00']?.notes || ''
        },
        '9:00': {
          leadId: '',
          memberIds: [],
          notes: row.quarters['9:00']?.notes || ''
        },
        '12:00': {
          leadId: '',
          memberIds: [],
          notes: row.quarters['12:00']?.notes || ''
        },
        '3:00': {
          leadId: '',
          memberIds: [],
          notes: row.quarters['3:00']?.notes || ''
        }
      }
    }));
    const nextAtt = {
      unutilized: allShiftEmpIds,
      sick: [],
      pto: [],
      late: [],
      leftEarly: []
    };
    setBoardAreaRows(nextRows);
    setAttendance(nextAtt);
    await saveShiftBoardState(nextRows, nextAtt, shiftGoals, obstacles, true);
    notify('info', `Reset all ${allShiftEmpIds.length} Shift ${activeShift} employees back to Available Staff (Unutilized).`);
  };
  const handleAddCustomAreaToBoard = async () => {
    const rm = customRoomInput.trim() || 'Custom';
    const ar = customAreaInput.trim();
    if (!ar) {
      notify('error', 'Enter a Custom Area name.');
      return;
    }
    const key = `${rm}::${ar}`;
    if (boardAreaRows.some(r => r.key.toLowerCase() === key.toLowerCase())) {
      notify('error', `Area "${rm} - ${ar}" is already on this shift board.`);
      return;
    }
    const newRow = {
      key,
      room: rm,
      area: ar,
      isCustom: true,
      leadId: selectedSupervisorEmpId || '',
      memberIds: [],
      progressPct: 0,
      cleanType: 'Wet Clean',
      etaMinutes: 90,
      notes: 'Custom supervisor area',
      quarters: {
        '6:00': {
          leadId: selectedSupervisorEmpId || '',
          memberIds: [],
          notes: ''
        },
        '9:00': {
          leadId: selectedSupervisorEmpId || '',
          memberIds: [],
          notes: ''
        },
        '12:00': {
          leadId: selectedSupervisorEmpId || '',
          memberIds: [],
          notes: ''
        },
        '3:00': {
          leadId: selectedSupervisorEmpId || '',
          memberIds: [],
          notes: ''
        }
      }
    };
    const nextRows = [...boardAreaRows, newRow];
    setBoardAreaRows(nextRows);
    setTargetAreaKeyForAssign(key);
    setCustomAreaInput('');
    await saveShiftBoardState(nextRows, attendance, shiftGoals, obstacles, true);
    notify('success', `Added custom area "${rm} - ${ar}" to Shift ${activeShift} deployment board.`);
  };
  const handleLogGanttlyDowntime = async () => {
    if (!dtNote.trim() && !dtCategory) {
      notify('error', 'Provide a downtime category and brief note.');
      return;
    }
    setSavingDowntime(true);
    try {
      const eqRec = assets.find(a => a.id === dtEquipmentId);
      const affectedNames = dtAffectedEmpIds.map(id => employees.find(e => e.id === id)?.name || id);
      const obsKey = `OBS_${activeShift}_${formatTimestampForName()}`;
      const newObs = {
        id: `obs-${Date.now()}`,
        key: obsKey,
        shiftDate: planDate,
        crew: activeShift,
        room: dtRoom || eqRec?.room || 'Main Plant',
        area: dtArea || eqRec?.area || 'General',
        equipmentId: dtEquipmentId,
        equipmentName: eqRec?.name || 'Area Wide',
        category: dtCategory,
        startTime: dtStartTime,
        stopTime: dtStopTime,
        minutes: Number(dtMinutes) || 15,
        headsAffected: Math.max(1, dtAffectedEmpIds.length),
        affectedEmployeeIds: dtAffectedEmpIds,
        affectedEmployeeNames: affectedNames,
        setupRequired: dtSetupRequired,
        setupChecks: dtSetupChecks,
        fixedByName: dtFixedBy || msIdentity.matchedEmployeeName,
        note: dtNote.trim(),
        status: 'Active',
        loggedBy: msIdentity.matchedEmployeeName,
        microsoftId: msIdentity.systemUserId,
        createdAt: new Date().toISOString()
      };
      const dvPayload = {
        craa5_obstaclekey: obsKey,
        craa5_startedat: new Date().toISOString(),
        craa5_shiftdate: planDate,
        craa5_crew: activeShift,
        craa5_scope: newObs.room,
        craa5_area: `${newObs.room} - ${newObs.area}`,
        craa5_equipmentguid: newObs.equipmentId,
        craa5_equipment: newObs.equipmentName,
        craa5_category: newObs.category,
        craa5_note: newObs.note,
        craa5_minutes: newObs.minutes,
        craa5_starttime: newObs.startTime,
        craa5_stoptime: newObs.stopTime,
        craa5_headsaffected: newObs.headsAffected,
        craa5_affectedemployeesjson: JSON.stringify(affectedNames),
        craa5_setuprequired: newObs.setupRequired,
        craa5_setupchecks: newObs.setupChecks.join(', '),
        craa5_fixedbyname: newObs.fixedByName,
        craa5_status: 'Active',
        craa5_loggedby: newObs.loggedBy,
        craa5_microsoftid: newObs.microsoftId,
        craa5_sourceapp: 'SupervisorHub'
      };
      for (const set of ['craa5___1_g_obstacles', 'craa5___1_g_obstacles']) {
        try {
          await dvFetch(set, {
            method: 'POST',
            body: JSON.stringify(dvPayload)
          });
          break;
        } catch {}
      }
      const nextObs = [newObs, ...obstacles];
      setObstacles(nextObs);
      await saveShiftBoardState(boardAreaRows, attendance, shiftGoals, nextObs, true);
      setShowDowntimeModal(false);
      setDtNote('');
      setDtAffectedEmpIds([]);
      notify('success', `Logged ${newObs.minutes} min Down Time (${newObs.category}) to Ganttly & Shift Board.`);
    } catch (err) {
      notify('error', `Downtime log error: ${err?.message || ''}`);
    } finally {
      setSavingDowntime(false);
    }
  };

  // ==========================================================================
  // TAB 3 (BULK UPLOAD) HANDLERS: HIDDEN MAP POPUP, MANDATORY ROOM ('OTHER'),
  // BATCH ROOM/AREA -> PER-PHOTO EQUIPMENT WITH PERSISTENT GUID CACHE (FIX 3)
  // ==========================================================================

  const handleMapClick = e => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, Number(((e.clientX - rect.left) / rect.width * 100).toFixed(1))));
    const yPct = Math.max(0, Math.min(100, Number(((e.clientY - rect.top) / rect.height * 100).toFixed(1))));
    setMapPinX(xPct);
    setMapPinY(yPct);
    if (mapModalTargetIdx !== null) {
      setPendingBeforeFiles(prev => prev.map((item, idx) => idx === mapModalTargetIdx ? {
        ...item,
        mapX: xPct,
        mapY: yPct,
        boxW: mapTagMode === 'box' ? mapBoxW : 0,
        boxH: mapTagMode === 'box' ? mapBoxH : 0
      } : item));
    }
  };
  const handleOpenMapPopupForBatchOrPhoto = photoIdx => {
    setMapModalTargetIdx(photoIdx);
    if (photoIdx !== null && pendingBeforeFiles[photoIdx]) {
      const target = pendingBeforeFiles[photoIdx];
      setMapPinX(target.mapX ?? mapPinX);
      setMapPinY(target.mapY ?? mapPinY);
    }
    setShowBulkMapModal(true);
  };
  const handleApplyBatchRoomAreaToAllQueued = () => {
    const rm = photoRoom.trim() || 'Other';
    const ar = photoArea.trim();
    setPendingBeforeFiles(prev => prev.map((item, i) => ({
      ...item,
      room: rm,
      area: ar || item.area,
      mapX: mapPinX,
      mapY: mapPinY,
      boxW: mapTagMode === 'box' ? mapBoxW : 0,
      boxH: mapTagMode === 'box' ? mapBoxH : 0,
      customTitle: `${photoCategory} - ${rm}${ar ? ' / ' + ar : ''} (#${i + 1})`,
      afterRefName: buildDefaultAfterRefName(photoCategory, rm, ar || 'AREA', i + 1)
    })));
    notify('info', `Applied Room "${rm}"${ar ? ` and Area "${ar}"` : ''} to all ${pendingBeforeFiles.length} queued photo(s).`);
  };
  const handleSelectBeforeFiles = async e => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);
    // Every picture uploaded must have a Room at least, even if marked 'Other'
    const rm = photoRoom.trim() || 'Other';
    const ar = photoArea.trim() || '';
    const newPending = [];
    for (let i = 0; i < filesArray.length; i++) {
      const f = filesArray[i];
      try {
        const compressed = await compressImageFileToDataUrl(f, 1280, 0.8);
        const defaultAfterName = buildDefaultAfterRefName(photoCategory, rm, ar || 'AREA', pendingBeforeFiles.length + i + 1);
        newPending.push({
          file: f,
          dataUrl: compressed.dataUrl,
          bytes: compressed.bytes,
          customTitle: `${photoCategory} - ${rm}${ar ? ' / ' + ar : ''} (#${pendingBeforeFiles.length + i + 1})`,
          room: rm,
          area: ar,
          equipmentId: '',
          equipmentName: photoEquipment || '',
          mapX: mapPinX,
          mapY: mapPinY,
          boxW: mapTagMode === 'box' ? mapBoxW : 0,
          boxH: mapTagMode === 'box' ? mapBoxH : 0,
          afterRefName: defaultAfterName,
          afterDataUrl: '',
          afterFileName: ''
        });
      } catch {}
    }
    if (uploadMode === 'single') {
      setPendingBeforeFiles(newPending.slice(0, 1));
    } else {
      setPendingBeforeFiles(prev => [...prev, ...newPending]);
    }
  };
  const handleAttachOptionalAfterToPendingItem = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFileToDataUrl(file, 1280, 0.8);
      setPendingBeforeFiles(prev => prev.map((item, i) => i === idx ? {
        ...item,
        afterDataUrl: compressed.dataUrl,
        afterFileName: file.name
      } : item));
    } catch {}
  };
  const handleSubmitBeforeAndAfterBatch = async () => {
    if (pendingBeforeFiles.length === 0) {
      notify('error', 'At least one BEFORE photo is required before submitting.');
      return;
    }
    // Validate that every photo has a Room (even if 'Other')
    const missingRoom = pendingBeforeFiles.some(item => !String(item.room || photoRoom || '').trim());
    if (missingRoom) {
      notify('error', 'Every picture uploaded must have a Room assigned (use "Other" if not in a specific room).');
      return;
    }
    setUploadingPhotos(true);
    try {
      const facName = facilityMaps.find(m => m.id === selectedMapId)?.facility || 'Midwest Plant';
      const base = getBaseUrl();
      const createdEntries = [];
      for (let i = 0; i < pendingBeforeFiles.length; i++) {
        const item = pendingBeforeFiles[i];
        const rm = String(item.room || photoRoom || 'Other').trim() || 'Other';
        const ar = String(item.area || photoArea || 'General').trim() || 'General';
        const eqName = String(item.equipmentName || photoEquipment || '').trim();
        const eqGuid = String(item.equipmentId || '').trim();
        const itemMapX = item.mapX ?? mapPinX;
        const itemMapY = item.mapY ?? mapPinY;
        const itemBoxW = item.boxW ?? (mapTagMode === 'box' ? mapBoxW : 0);
        const itemBoxH = item.boxH ?? (mapTagMode === 'box' ? mapBoxH : 0);
        const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const afterRef = item.afterRefName.trim() || buildDefaultAfterRefName(photoCategory, rm, ar, i + 1);
        const hasAfter = Boolean(item.afterDataUrl);
        const customMeta = {
          title: item.customTitle,
          category: photoCategory,
          room: rm,
          area: ar,
          equipment: eqName,
          equipmentGuid: eqGuid,
          beforeFileName: item.file.name,
          beforePhotoDataUrl: item.dataUrl,
          afterReferenceName: afterRef,
          afterPhotoDataUrl: item.afterDataUrl || '',
          afterFileName: item.afterFileName || '',
          afterUploadedAt: hasAfter ? nowStr : '',
          sharepointLink: photoSharepointLink.trim(),
          externalLink: '',
          supervisorName: msIdentity.matchedEmployeeName,
          supervisorMsId: msIdentity.systemUserId,
          shift: activeShift
        };
        let obsId = `obs-${Date.now()}-${i}`;
        let obsSetUsed = 'craa5__facilityobservations';

        // 1. Create row in `craa5__facilityobservations`
        for (const set of ['craa5__facilityobservations', 'craa5_facilityobservations']) {
          try {
            const payload = {
              craa5__facility: facName,
              craa5__room: rm,
              craa5__area: ar,
              craa5__equipment: eqName ? eqGuid ? `${eqName} [${eqGuid}]` : eqName : '',
              craa5__description: `[${photoCategory}] ${photoDescription || item.customTitle} (After Ref: ${afterRef})`,
              craa5__whotonotify: photoNotifyName,
              craa5__whotonotifyemail: photoNotifyEmail,
              craa5_mapx: itemMapX,
              craa5_mapy: itemMapY,
              craa5__boxwidth: itemBoxW,
              craa5__boxheight: itemBoxH,
              craa5__customnote: JSON.stringify(customMeta)
            };
            const created = await dvFetch(set, {
              method: 'POST',
              headers: {
                Prefer: 'return=representation'
              },
              body: JSON.stringify(payload)
            });
            if (created) {
              obsSetUsed = set;
              const foundId = cleanGuid(created.craa5__facilityobservationid || created.craa5_facilityobservationid);
              if (foundId) obsId = foundId;
              try {
                await fetch(`${base}/api/data/v9.2/${set}(${obsId})/craa5_pictureof`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/octet-stream',
                    'x-ms-file-name': encodeURIComponent(item.file.name || 'before_photo.jpg')
                  },
                  body: item.bytes,
                  credentials: 'include'
                });
              } catch {}
            }
            break;
          } catch {}
        }
        const newEntry = {
          id: `jrn-${obsId}`,
          observationId: obsId,
          title: item.customTitle,
          category: photoCategory,
          facility: facName,
          room: rm,
          area: ar,
          equipment: eqName,
          equipmentGuid: eqGuid,
          mapX: itemMapX,
          mapY: itemMapY,
          boxWidth: itemBoxW,
          boxHeight: itemBoxH,
          beforePhotoDataUrl: item.dataUrl,
          beforePhotoUrl: `${base}/api/data/v9.2/${obsSetUsed}(${obsId})/craa5_pictureof/$value?size=full`,
          beforeFileName: item.file.name,
          beforeUploadedAt: nowStr,
          afterReferenceName: afterRef,
          afterPhotoDataUrl: item.afterDataUrl || '',
          afterPhotoUrl: '',
          afterFileName: item.afterFileName || '',
          afterUploadedAt: hasAfter ? nowStr : '',
          status: hasAfter ? 'Before & After Complete' : 'Pending After Photo',
          description: photoDescription || item.customTitle,
          whoToNotify: photoNotifyName,
          whoToNotifyEmail: photoNotifyEmail,
          sharepointLink: photoSharepointLink.trim(),
          externalLink: '',
          supervisorName: msIdentity.matchedEmployeeName,
          supervisorMsId: msIdentity.systemUserId,
          shift: activeShift
        };
        createdEntries.push(newEntry);
      }
      const nextJournal = [...createdEntries, ...journalEntries];
      setJournalEntries(nextJournal);
      await saveHubConfigJson('SUPERVISOR_PHOTO_JOURNAL', nextJournal);
      setPendingBeforeFiles([]);
      setPhotoDescription('');
      notify('success', `Uploaded ${createdEntries.length} ${photoCategory} photo(s) (all with verified Room & cached Equipment GUIDs) and linked to Journal!`);
    } catch (err) {
      notify('error', `Photo submission failed: ${err?.message || ''}`);
    } finally {
      setUploadingPhotos(false);
    }
  };
  const handleAttachAfterPhotoByTimestampRef = async e => {
    const file = e.target.files?.[0];
    if (!file || !selectedPendingJournalId) return;
    try {
      const compressed = await compressImageFileToDataUrl(file, 1280, 0.8);
      const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const nextJournal = journalEntries.map(j => j.id === selectedPendingJournalId ? {
        ...j,
        afterPhotoDataUrl: compressed.dataUrl,
        afterFileName: file.name,
        afterUploadedAt: nowStr,
        status: 'Before & After Complete'
      } : j);
      setJournalEntries(nextJournal);
      await saveHubConfigJson('SUPERVISOR_PHOTO_JOURNAL', nextJournal);
      const matched = nextJournal.find(j => j.id === selectedPendingJournalId);
      notify('success', `Attached AFTER photo to reference "${matched?.afterReferenceName || ''}"!`);
    } catch (err) {
      notify('error', `Failed to attach After photo: ${err?.message || ''}`);
    }
  };

  // ==========================================================================
  // TAB 4 HANDLERS: PHOTO JOURNAL DATATABLE (FULL EDIT CAPABILITY)
  // ==========================================================================

  const filteredJournalEntries = useMemo(() => {
    return journalEntries.filter(j => {
      if (journalCategoryFilter !== 'ALL' && j.category !== journalCategoryFilter) return false;
      if (journalStatusFilter !== 'ALL' && j.status !== journalStatusFilter) return false;
      if (journalSearch.trim()) {
        const q = journalSearch.toLowerCase();
        const hay = `${j.title} ${j.category} ${j.room} ${j.area} ${j.equipment} ${j.afterReferenceName} ${j.description} ${j.supervisorName} ${j.sharepointLink}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [journalEntries, journalCategoryFilter, journalStatusFilter, journalSearch]);
  const handleSaveJournalRowEdit = async updated => {
    const nextJournal = journalEntries.map(j => j.id === updated.id ? updated : j);
    setJournalEntries(nextJournal);
    setEditingJournalId(null);
    setEditingJournalDraft(null);
    await saveHubConfigJson('SUPERVISOR_PHOTO_JOURNAL', nextJournal);
    if (updated.observationId && cleanGuid(updated.observationId).length === 36) {
      for (const set of ['craa5__facilityobservations', 'craa5_facilityobservations']) {
        try {
          await dvFetch(`${set}(${cleanGuid(updated.observationId)})`, {
            method: 'PATCH',
            body: JSON.stringify({
              craa5__facility: updated.facility,
              craa5__room: updated.room || 'Other',
              craa5__area: updated.area,
              craa5__equipment: updated.equipment,
              craa5__description: updated.description,
              craa5__whotonotify: updated.whoToNotify,
              craa5__whotonotifyemail: updated.whoToNotifyEmail,
              craa5_mapx: Number(updated.mapX),
              craa5_mapy: Number(updated.mapY),
              craa5__boxwidth: Number(updated.boxWidth),
              craa5__boxheight: Number(updated.boxHeight),
              craa5__customnote: JSON.stringify({
                title: updated.title,
                category: updated.category,
                room: updated.room || 'Other',
                area: updated.area,
                equipmentGuid: updated.equipmentGuid || '',
                beforeFileName: updated.beforeFileName,
                beforePhotoDataUrl: updated.beforePhotoDataUrl,
                afterReferenceName: updated.afterReferenceName,
                afterPhotoDataUrl: updated.afterPhotoDataUrl,
                afterFileName: updated.afterFileName,
                afterUploadedAt: updated.afterUploadedAt,
                sharepointLink: updated.sharepointLink,
                externalLink: updated.externalLink,
                supervisorName: updated.supervisorName,
                supervisorMsId: updated.supervisorMsId,
                shift: updated.shift
              })
            })
          });
          break;
        } catch {}
      }
    }
    notify('success', `Saved all edits & links for journal row "${updated.title}".`);
  };
  const handleInlineJournalChange = (id, field, value) => {
    setJournalEntries(prev => prev.map(j => j.id === id ? {
      ...j,
      [field]: value
    } : j));
  };
  const handleSaveAllBatchJournalEdits = async () => {
    await saveHubConfigJson('SUPERVISOR_PHOTO_JOURNAL', journalEntries);
    setBatchEditJournalMode(false);
    notify('success', 'Saved all batch edits across the Photo Journal DataTable.');
  };

  // ==========================================================================
  // TAB 6 (CLEAN PLAN) HANDLERS: MEDALLION DAY LIST & DOUBLE-CLICK POPUP EDITOR
  // ==========================================================================

  const filteredCleanPlanRows = useMemo(() => {
    return cleanPlanRows.filter(c => {
      if (cleanPlanLineFilter !== 'ALL' && c.room !== cleanPlanLineFilter && c.line !== cleanPlanLineFilter && c.area !== cleanPlanLineFilter) return false;
      if (selectedCleanPlanDay !== 'ALL' && c.dayDate !== selectedCleanPlanDay) return false;
      if (onlyMyShiftCleanPlan && c.shiftCrew !== activeShift) return false;
      return true;
    });
  }, [cleanPlanRows, cleanPlanLineFilter, selectedCleanPlanDay, onlyMyShiftCleanPlan, activeShift]);
  const handleOpenCleanPlanAdjustModal = win => {
    setAdjustingWindow(win);
    setAdjRoom(win.room || 'IBL');
    setAdjArea(win.area || 'Line 1');
    setAdjLine(win.line || 'Line 1');
    setAdjProdStart(win.prodStart || '06:00');
    setAdjProdStop(win.prodStop || '14:00');
    setAdjStartTime(win.start || '14:00');
    setAdjEndTime(win.end || '18:00');
    setAdjMinutes(win.minutes || 240);
    setAdjCleanKind(win.cleanKind || 'Wet Clean');
    setAdjNotes(win.notes || '');
    setAdjReason('');
  };
  const handleConfirmCleanPlanTimingAdjust = async () => {
    if (!adjustingWindow) return;
    if (!adjReason.trim()) {
      notify('error', 'A Reason is strictly required to adjust Clean Plan timing or details.');
      return;
    }
    setSavingCleanPlanAdjust(true);
    try {
      const updatedDetails = {
        ...(adjustingWindow.details || {}),
        room: adjRoom,
        areaName: adjArea,
        area: `${adjRoom} - ${adjArea}`,
        line: adjLine,
        prodStart: adjProdStart,
        prodStop: adjProdStop,
        start: adjStartTime,
        end: adjEndTime,
        minutes: Number(adjMinutes),
        cleanKind: adjCleanKind,
        notes: adjNotes.trim(),
        shiftCrew: activeShift,
        dayDate: adjustingWindow.dayDate || todayIso(),
        reason: adjReason.trim(),
        dailySupervisorAdjustment: {
          adjustedOnDate: todayIso(),
          adjustedAt: new Date().toISOString(),
          supervisorName: msIdentity.matchedEmployeeName,
          supervisorMsId: msIdentity.systemUserId,
          shift: activeShift,
          previousStart: adjustingWindow.start,
          previousEnd: adjustingWindow.end,
          previousMinutes: adjustingWindow.minutes,
          newProdStart: adjProdStart,
          newProdStop: adjProdStop,
          newStart: adjStartTime,
          newEnd: adjEndTime,
          newMinutes: Number(adjMinutes),
          reason: adjReason.trim()
        }
      };
      const payload = {
        craa5_area: `${adjRoom} - ${adjArea}`,
        craa5_line: adjLine,
        craa5_linekey: adjLine,
        craa5_start: adjStartTime,
        craa5_end: adjEndTime,
        craa5_minutes: Number(adjMinutes),
        craa5_cleankind: adjCleanKind,
        craa5_reason: `[Shift ${activeShift} - ${msIdentity.matchedEmployeeName} - ${todayIso()}]: ${adjReason.trim()}`,
        craa5_status: 'Adjusted Today',
        craa5_details: JSON.stringify(updatedDetails)
      };
      if (adjustingWindow.id && cleanGuid(adjustingWindow.id).length === 36) {
        await dvFetch(`${cleanPlanEntitySet}(${cleanGuid(adjustingWindow.id)})`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        const created = await dvFetch(cleanPlanEntitySet, {
          method: 'POST',
          headers: {
            Prefer: 'return=representation'
          },
          body: JSON.stringify({
            ...payload,
            craa5_plankey: adjustingWindow.planKey || `CP_${activeShift}_${formatTimestampForName()}`,
            craa5_rowtype: 'window'
          })
        });
        if (created) {
          adjustingWindow.id = cleanGuid(created.craa5___1_p_cleanplanid || created.craa5___1_p_cleanplanid || adjustingWindow.id);
        }
      }
      const existsInList = cleanPlanRows.some(r => r.id === adjustingWindow.id);
      const updatedRecord = {
        ...adjustingWindow,
        room: adjRoom,
        area: adjArea,
        line: adjLine,
        prodStart: adjProdStart,
        prodStop: adjProdStop,
        start: adjStartTime,
        end: adjEndTime,
        minutes: Number(adjMinutes),
        cleanKind: adjCleanKind,
        notes: adjNotes.trim(),
        reason: payload.craa5_reason,
        status: 'Adjusted Today',
        shiftCrew: activeShift,
        details: updatedDetails
      };
      const nextCp = existsInList ? cleanPlanRows.map(r => r.id === adjustingWindow.id ? updatedRecord : r) : [updatedRecord, ...cleanPlanRows];
      setCleanPlanRows(nextCp);
      setAdjustingWindow(null);
      setAdjReason('');
      notify('success', `Updated Clean Plan (${adjRoom} - ${adjArea} - ${adjLine}) with logged reason.`);
    } catch (err) {
      notify('error', `Could not update Clean Plan: ${err?.message || ''}`);
    } finally {
      setSavingCleanPlanAdjust(false);
    }
  };

  // ==========================================================================
  // TAB 7 HANDLERS: SHIFT-LOCKED EMPLOYEE QUERY & PROFILE VIEWER
  // Aggregates across `craa5___1_m_employeenotes`, `craa5___1_g_notes`,
  // `craa5___1_a_employees`, `craa5___1_s_shiftboards`, `craa5___1_s_shiftarchives`,
  // `craa5___1_s_taskassignments`, `craa5___1_g_assignments`, `craa5___1_l_logs`,
  // `craa5___1_g_passoffs`, and `craa5___1_m_timelosslogs`
  // ==========================================================================

  const selectedProfileEmployee = useMemo(() => {
    return shiftEmployees.find(e => e.id === selectedProfileEmpId) || shiftEmployees[0] || null;
  }, [shiftEmployees, selectedProfileEmpId]);
  const selectedEmpProfileMetrics = useMemo(() => {
    if (!selectedProfileEmployee) {
      return {
        daysWorked: 0,
        hoursWorked: 0,
        strongestArea: 'N/A',
        mostOftenLead: msIdentity.matchedEmployeeName,
        areaCounts: [],
        equipmentHistory: [],
        timeLossCount: 0,
        notesForEmployee: []
      };
    }
    const empNameLower = selectedProfileEmployee.name.toLowerCase();
    const empId = selectedProfileEmployee.id;
    const areaMap = new Map();
    const workedDates = new Set();
    const eqHist = [];

    // 1. Live & Planned Shift Boards (`craa5___1_s_shiftboards`)
    for (const b of empBoardHistory) {
      const bj = safeJsonParse(b.craa5_boardjson, {});
      const bDate = String(bj.planDate || b.craa5_slotstart || b.createdon || todayIso()).slice(0, 10);
      const supRows = Array.isArray(bj.supervisorAreaRows) ? bj.supervisorAreaRows : [];
      for (const r of supRows) {
        const mems = Array.isArray(r.memberIds) ? r.memberIds : [];
        if (r.leadId === empId || mems.includes(empId)) {
          workedDates.add(bDate);
          const areaLabel = `${r.room || 'Bakery'} - ${r.area || 'IBL4'}`;
          areaMap.set(areaLabel, (areaMap.get(areaLabel) || 0) + 1);
        }
      }
      const taskRows = Array.isArray(bj.rows) ? bj.rows : [];
      for (const tr of taskRows) {
        const trEmpId = cleanGuid(tr.craa5__aaemp_guid);
        const trEmpName = String(tr.craa5_id || tr.craa5_employeename || '').toLowerCase();
        if (trEmpId === empId || trEmpName && trEmpName === empNameLower) {
          workedDates.add(bDate);
          const areaLabel = String(tr.craa5_area || 'Bakery - IBL4').trim();
          areaMap.set(areaLabel, (areaMap.get(areaLabel) || 0) + 1);
          eqHist.push({
            date: bDate,
            equipment: String(tr.craa5_whatisbeingdone || 'Shift Board Assignment'),
            room: areaLabel.split(' - ')[0] || 'Bakery',
            area: areaLabel.split(' - ').slice(1).join(' - ') || areaLabel,
            status: String(tr.craa5__currentstatus || 'Assigned'),
            source: 'craa5___1_s_shiftboards'
          });
        }
      }
    }

    // 2. Shift Archives (`craa5___1_s_shiftarchives`)
    for (const arch of dvShiftArchives) {
      const archDate = String(arch.craa5_shiftdate || arch.createdon || todayIso()).slice(0, 10);
      const snap = safeJsonParse(arch.craa5_snapshotjson || arch.craa5_boardjson, {});
      const rows = Array.isArray(snap.rows) ? snap.rows : [];
      for (const tr of rows) {
        const trEmpId = cleanGuid(tr.craa5__aaemp_guid || tr.empId);
        const trEmpName = String(tr.craa5_id || tr.empName || '').toLowerCase();
        if (trEmpId === empId || trEmpName && trEmpName === empNameLower) {
          workedDates.add(archDate);
          const areaLabel = String(tr.craa5_area || tr.area || 'Bakery - IBL4');
          areaMap.set(areaLabel, (areaMap.get(areaLabel) || 0) + 1);
        }
      }
    }

    // 3. Task Assignments (`craa5___1_s_taskassignments`) & Ganttly Assignments (`craa5___1_g_assignments`)
    for (const ta of dvTaskAssignments) {
      const aName = String(ta.craa5_employeename || ta.craa5_id || ta.craa5_assignedto || '').toLowerCase();
      const aId = cleanGuid(ta.craa5_employeeid || ta.craa5__aaemp_guid);
      if (aId === empId || aName && aName.includes(empNameLower)) {
        const dStr = String(ta.craa5_datetimeofassignment || ta.createdon || todayIso()).slice(0, 10);
        workedDates.add(dStr);
        const ar = String(ta.craa5_area || 'Bakery - IBL4').trim();
        areaMap.set(ar, (areaMap.get(ar) || 0) + 1);
        eqHist.push({
          date: dStr,
          equipment: String(ta.craa5_whatisbeingdone || ta.craa5_title || 'Task Assignment'),
          room: ar.split(' - ')[0] || 'Bakery',
          area: ar.split(' - ').slice(1).join(' - ') || ar,
          status: ta.craa5_complete ? 'Completed' : 'Assigned',
          source: 'craa5___1_s_taskassignments'
        });
      }
    }
    for (const ga of dvGAssignments) {
      const aName = String(ga.craa5_employeename || ga.craa5_sanitor || ga.craa5_assignedto || '').toLowerCase();
      const aId = cleanGuid(ga.craa5_employeeid || ga.craa5_employeeguid);
      if (aId === empId || aName && aName.includes(empNameLower)) {
        const dStr = String(ga.craa5_shiftdate || ga.createdon || todayIso()).slice(0, 10);
        workedDates.add(dStr);
        const rm = String(ga.craa5_room || 'Bakery');
        const ar = String(ga.craa5_area || 'IBL4');
        const areaLabel = `${rm} - ${ar}`;
        areaMap.set(areaLabel, (areaMap.get(areaLabel) || 0) + 1);
        eqHist.push({
          date: dStr,
          equipment: String(ga.craa5_equipment || ga.craa5_equipmentidentifier || 'Ganttly Equipment'),
          room: rm,
          area: ar,
          status: String(ga.craa5_status || 'Completed'),
          source: 'craa5___1_g_assignments'
        });
      }
    }

    // 4. MSS Sanitation Log Input (`craa5___1_l_logs`) & Equipment Passoffs (`craa5___1_g_passoffs`)
    for (const lg of empLogRows) {
      const cleaner = String(lg.craa5_sanitor || lg.craa5_cleanedby || lg.craa5_employee || lg.craa5_name || '').toLowerCase();
      if (cleaner && cleaner.includes(empNameLower)) {
        const dStr = String(lg.craa5_date || lg.createdon || todayIso()).slice(0, 10);
        workedDates.add(dStr);
        const rm = String(lg.craa5_room || 'Bakery');
        const ar = String(lg.craa5_area || 'IBL4');
        const areaLabel = `${rm} - ${ar}`;
        areaMap.set(areaLabel, (areaMap.get(areaLabel) || 0) + 1);
        eqHist.push({
          date: dStr,
          equipment: String(lg.craa5_equipment || lg.craa5_asset || lg.craa5_title || 'MSS Equipment Log'),
          room: rm,
          area: ar,
          status: String(lg.craa5_status || 'Completed'),
          source: 'craa5___1_l_logs'
        });
      }
    }
    for (const po of dvPassoffs) {
      const pName = String(po.craa5_cleanedby || po.craa5_sanitor || po.craa5_employeename || '').toLowerCase();
      if (pName && pName.includes(empNameLower)) {
        const dStr = String(po.craa5_shiftdate || po.createdon || todayIso()).slice(0, 10);
        workedDates.add(dStr);
        const rm = String(po.craa5_room || 'Bakery');
        const ar = String(po.craa5_area || 'IBL4');
        areaMap.set(`${rm} - ${ar}`, (areaMap.get(`${rm} - ${ar}`) || 0) + 1);
        eqHist.push({
          date: dStr,
          equipment: String(po.craa5_equipment || 'Equipment Passoff'),
          room: rm,
          area: ar,
          status: String(po.craa5_status || 'Verified'),
          source: 'craa5___1_g_passoffs'
        });
      }
    }

    // 5. Time Loss / Attendance Logs (`craa5___1_m_timelosslogs`)
    let timeLossCount = 0;
    for (const tl of dvTimeLossLogs) {
      const tName = String(tl.craa5_employeename || tl.craa5_name || '').toLowerCase();
      const tId = cleanGuid(tl.craa5_employeeid);
      if (tId === empId || tName && tName.includes(empNameLower)) {
        timeLossCount++;
      }
    }

    // 6. Filter unified Dataverse notes for this employee
    const notesForEmployee = empNotes.filter(n => {
      if (n.empId && n.empId === empId) return true;
      if (n.empName && n.empName.toLowerCase() === empNameLower) return true;
      return false;
    });
    const sortedAreas = Array.from(areaMap.entries()).map(([area, count]) => ({
      area,
      count
    })).sort((a, b) => b.count - a.count);
    const days = Math.max(workedDates.size, eqHist.length > 0 ? Math.ceil(eqHist.length / 2) : 1);
    return {
      daysWorked: days,
      hoursWorked: days * 8,
      strongestArea: sortedAreas[0]?.area || (selectedProfileEmployee.trainingArea ? `Training: ${selectedProfileEmployee.trainingArea}` : 'Bakery - IBL4'),
      mostOftenLead: `Shift ${activeShift} (${msIdentity.matchedEmployeeName})`,
      areaCounts: sortedAreas.slice(0, 6),
      equipmentHistory: eqHist.slice(0, 15),
      timeLossCount,
      notesForEmployee
    };
  }, [selectedProfileEmployee, empBoardHistory, dvShiftArchives, dvTaskAssignments, dvGAssignments, empLogRows, dvPassoffs, dvTimeLossLogs, empNotes, activeShift, msIdentity.matchedEmployeeName]);
  const handleAddEmployeeProfileNote = async (asSnapshot = false) => {
    if (!selectedProfileEmployee) return;
    if (!asSnapshot && !newEmpNoteText.trim()) {
      notify('error', 'Enter a note or observation before saving.');
      return;
    }
    setSavingEmpNote(true);
    try {
      const noteTypeFinal = asSnapshot ? 'Snapshot' : newEmpNoteType;
      const snapshotPayload = asSnapshot ? {
        capturedAt: new Date().toISOString(),
        daysWorked: selectedEmpProfileMetrics.daysWorked,
        hoursWorked: selectedEmpProfileMetrics.hoursWorked,
        strongestArea: selectedEmpProfileMetrics.strongestArea,
        mostOftenLead: selectedEmpProfileMetrics.mostOftenLead,
        topAreas: selectedEmpProfileMetrics.areaCounts,
        rating: newEmpNoteRating
      } : null;
      const noteTextFinal = newEmpNoteText.trim() || (asSnapshot ? `Frozen Work Summary Snapshot (${selectedEmpProfileMetrics.daysWorked}d / ${selectedEmpProfileMetrics.hoursWorked}h, Strongest: ${selectedEmpProfileMetrics.strongestArea}, Rating: ${newEmpNoteRating > 0 ? '+' + newEmpNoteRating : newEmpNoteRating})` : '');
      const entry = {
        id: `enote-${Date.now()}`,
        empId: selectedProfileEmployee.id,
        empName: selectedProfileEmployee.name,
        date: todayIso(),
        type: noteTypeFinal,
        category: noteTypeFinal,
        note: noteTextFinal,
        rating: asSnapshot ? newEmpNoteRating : null,
        snapshot: snapshotPayload,
        author: `${msIdentity.matchedEmployeeName} (Shift ${activeShift})`,
        shift: activeShift,
        sourceTable: 'craa5___1_m_employeenotes'
      };
      const nextNotes = [entry, ...empNotes];
      setEmpNotes(nextNotes);
      await saveHubConfigJson('SUPERVISOR_EMP_NOTES', nextNotes);

      // 1. Write to `craa5___1_m_employeenotes` using exact Manager Hub (P4.3 - hub - manager.txt) schema
      const nowIso = new Date().toISOString();
      const authorLabel = `${msIdentity.matchedEmployeeName} (Shift ${activeShift})`;
      const mhDataPayload = {
        v: 1,
        text: noteTextFinal,
        rating: asSnapshot ? Number(newEmpNoteRating) : null,
        snapshot: snapshotPayload,
        by: authorLabel,
        at: nowIso,
        empName: selectedProfileEmployee.name
      };
      try {
        await dvFetch('craa5___1_m_employeenotes', {
          method: 'POST',
          body: JSON.stringify({
            craa5_name: `${noteTypeFinal} ${todayIso()}`,
            craa5_employeeguid: cleanGuid(selectedProfileEmployee.id),
            craa5_kind: noteTypeFinal,
            craa5_status: 'Active',
            craa5_data: JSON.stringify(mhDataPayload),
            craa5_rating: asSnapshot ? Number(newEmpNoteRating) : null,
            craa5_notedate: nowIso
          })
        });
      } catch {}

      // 2. Also write Pro / Con floor recognition or coaching to `craa5___1_g_notes` (Ganttly contract)
      if (noteTypeFinal === 'Pro' || noteTypeFinal === 'Con') {
        try {
          const noteKey = `pn|${cleanGuid(selectedProfileEmployee.id)}|${Date.now().toString(36)}`;
          await dvFetch('craa5___1_g_notes', {
            method: 'POST',
            body: JSON.stringify({
              craa5_notekey: noteKey,
              craa5_employeeguid: cleanGuid(selectedProfileEmployee.id),
              craa5_employee: selectedProfileEmployee.name,
              craa5_kind: noteTypeFinal === 'Con' ? 'incident' : 'highfive',
              craa5_tag: noteTypeFinal === 'Pro' ? 'Supervisor Recognition' : 'Supervisor Coaching',
              craa5_note: noteTextFinal,
              craa5_severity: noteTypeFinal === 'Con' ? 'coaching' : 'positive',
              craa5_area: selectedEmpProfileMetrics.strongestArea || 'General',
              craa5_shiftdate: todayIso(),
              craa5_crew: activeShift,
              craa5_notedat: nowIso,
              craa5_givenby: msIdentity.matchedEmployeeName,
              craa5_givenbyguid: cleanGuid(msIdentity.matchedEmployeeId)
            })
          });
        } catch {}
      }
      setNewEmpNoteText('');
      notify('success', asSnapshot ? `Saved frozen performance Snapshot (Rating ${newEmpNoteRating}) for ${selectedProfileEmployee.name} to Dataverse.` : `Saved ${noteTypeFinal} note for ${selectedProfileEmployee.name} to Dataverse (craa5___1_m_employeenotes).`);
    } catch (err) {
      notify('error', `Could not save note: ${err?.message || ''}`);
    } finally {
      setSavingEmpNote(false);
    }
  };

  // Toggle "In Training" + Training Area on `craa5___1_a_employees` (unlocks Portal 2 Leadership Training Badge Gate)
  const handleToggleEmployeeInTraining = async (emp, nextInTraining, nextArea) => {
    const areaVal = nextInTraining ? nextArea || emp.trainingArea || 'IBL4' : '';
    setEmployees(prev => prev.map(e => e.id === emp.id ? {
      ...e,
      inTraining: nextInTraining,
      trainingArea: areaVal
    } : e));
    try {
      await dvFetch(`craa5___1_a_employees(${cleanGuid(emp.id)})`, {
        method: 'PATCH',
        body: JSON.stringify({
          craa5_intraining: nextInTraining,
          craa5_trainingarea: areaVal
        })
      });
      await dvFetch('craa5___1_s_shiftlogs', {
        method: 'POST',
        body: JSON.stringify({
          craa5_title: `Training Toggle: ${emp.name} (${nextInTraining ? 'ON - ' + areaVal : 'OFF'})`,
          craa5_action: 'training.toggle',
          craa5_app: 'supervisor',
          craa5_crew: activeShift,
          craa5_user: msIdentity.matchedEmployeeName,
          craa5_at: new Date().toISOString(),
          craa5_summary: `${emp.name} marked ${nextInTraining ? 'In Training (' + areaVal + ')' : 'Not In Training'} by ${msIdentity.matchedEmployeeName}`,
          craa5_details: JSON.stringify({
            v: 1,
            employeeId: emp.id,
            employeeName: emp.name,
            inTraining: nextInTraining,
            trainingArea: areaVal,
            by: msIdentity.matchedEmployeeName
          })
        })
      });
      notify('success', nextInTraining ? `${emp.name} marked IN TRAINING (${areaVal}) - Eligible for Portal 2 Leadership Badge Elevation.` : `${emp.name} training status cleared.`);
    } catch (err) {
      notify('error', `Could not update training status: ${err?.message || ''}`);
    }
  };
  const handleSaveEmployeeRosterRemark = async (emp, remarkText) => {
    const cleanText = String(remarkText || '').trim();
    setEmployees(prev => prev.map(e => e.id === emp.id ? {
      ...e,
      remarks: cleanText,
      remarkCategory: 'Supervisor'
    } : e));
    try {
      await dvFetch(`craa5___1_a_employees(${cleanGuid(emp.id)})`, {
        method: 'PATCH',
        body: JSON.stringify({
          craa5_remarks: cleanText,
          craa5_remarkcategory: 'Supervisor'
        })
      });
      notify('success', `Updated roster remark for ${emp.name} on craa5___1_a_employees.`);
    } catch (err) {
      notify('error', `Could not update roster remark: ${err?.message || ''}`);
    }
  };

  // ==========================================================================
  // TAB 8 HANDLERS: PERSONAL FILE UPLOADER & SHAREPOINT NAVIGATOR
  // ==========================================================================

  const handleCreateSharePointFolder = async () => {
    if (!newFolderName.trim()) {
      notify('error', 'Enter a folder name.');
      return;
    }
    const cleanSlug = newFolderName.trim().replace(/[^a-zA-Z0-9_-]+/g, '_');
    const supSlug = msIdentity.matchedEmployeeName.replace(/\s+/g, '_');
    const newFolder = {
      id: `fld-${Date.now()}`,
      name: newFolderName.trim(),
      category: newFolderCategory,
      sharepointPath: `${sharepointBaseUrl.replace(/\/$/, '')}/Shift_${activeShift}_${supSlug}/${cleanSlug}`,
      supervisorShift: activeShift,
      createdBy: msIdentity.matchedEmployeeName,
      createdAt: todayIso()
    };
    const nextFolders = [...spFolders, newFolder];
    setSpFolders(nextFolders);
    setSelectedFolderId(newFolder.id);
    setNewFolderName('');
    await saveHubConfigJson('SUPERVISOR_SHAREPOINT_HUB', {
      baseUrl: sharepointBaseUrl,
      folders: nextFolders,
      files: personalFiles
    });
    notify('success', `Created SharePoint linked folder "${newFolder.name}".`);
  };
  const handleUploadPersonalFile = async () => {
    if (!customFileNameInput.trim() && !pendingUploadFile) {
      notify('error', 'Provide a custom file name or choose a file to upload.');
      return;
    }
    setUploadingPersonalFile(true);
    try {
      const targetFolder = spFolders.find(f => f.id === selectedFolderId) || spFolders.find(f => f.category === customFileCategory) || spFolders[0];
      let fileDataUrl = '';
      let fileSizeKb = 0;
      let origName = 'supervisor_note.txt';
      let mime = 'text/plain';
      if (pendingUploadFile) {
        origName = pendingUploadFile.name;
        mime = pendingUploadFile.type || 'application/octet-stream';
        fileSizeKb = Math.max(1, Math.round(pendingUploadFile.size / 1024));
        const compressed = await compressImageFileToDataUrl(pendingUploadFile, 1400, 0.85);
        fileDataUrl = compressed.dataUrl;
      }
      const displayName = customFileNameInput.trim() || origName;
      const computedSpUrl = customFileSharepointLink.trim() || `${targetFolder?.sharepointPath || sharepointBaseUrl}/${encodeURIComponent(displayName)}`;

      // Attempt to save to Dataverse `craa5___1_m_formtemplates` / `craa5___1_m_formtemplates`
      let dvRowId = '';
      for (const set of ['craa5___1_m_formtemplates', 'craa5___1_m_formtemplates']) {
        try {
          const created = await dvFetch(set, {
            method: 'POST',
            headers: {
              Prefer: 'return=representation'
            },
            body: JSON.stringify({
              craa5_name: displayName,
              craa5_filename: origName,
              craa5_category: targetFolder?.name || customFileCategory,
              craa5_description: customFileDescription.trim(),
              craa5_link: computedSpUrl,
              craa5_ownerkey: msIdentity.systemUserId,
              craa5_updatedby: `${msIdentity.matchedEmployeeName} (Shift ${activeShift})`,
              craa5_status: 'Active'
            })
          });
          if (created) {
            dvRowId = cleanGuid(created.craa5___1_m_formtemplateid || created.craa5_formtemplateid || '');
          }
          break;
        } catch {}
      }
      const newFile = {
        id: `spfile-${Date.now()}`,
        dataverseRowId: dvRowId,
        customDisplayName: displayName,
        originalFileName: origName,
        folderId: targetFolder?.id || 'fld-files',
        folderName: targetFolder?.name || 'Reusable Files',
        category: customFileCategory,
        sharepointUrl: computedSpUrl,
        description: customFileDescription.trim(),
        fileDataUrl,
        fileSizeKb,
        mimeType: mime,
        supervisorName: msIdentity.matchedEmployeeName,
        supervisorMsId: msIdentity.systemUserId,
        shift: activeShift,
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      const nextFiles = [newFile, ...personalFiles];
      setPersonalFiles(nextFiles);
      await saveHubConfigJson('SUPERVISOR_SHAREPOINT_HUB', {
        baseUrl: sharepointBaseUrl,
        folders: spFolders,
        files: nextFiles
      });
      setCustomFileNameInput('');
      setCustomFileDescription('');
      setCustomFileSharepointLink('');
      setPendingUploadFile(null);
      notify('success', `Saved "${displayName}" into folder "${newFile.folderName}".`);
    } catch (err) {
      notify('error', `File upload failed: ${err?.message || ''}`);
    } finally {
      setUploadingPersonalFile(false);
    }
  };
  const handleRenamePersonalFile = async (fileId, newCustomName) => {
    if (!newCustomName.trim()) return;
    const nextFiles = personalFiles.map(f => f.id === fileId ? {
      ...f,
      customDisplayName: newCustomName.trim(),
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    } : f);
    setPersonalFiles(nextFiles);
    setRenamingFileId(null);
    setRenamingFileText('');
    await saveHubConfigJson('SUPERVISOR_SHAREPOINT_HUB', {
      baseUrl: sharepointBaseUrl,
      folders: spFolders,
      files: nextFiles
    });
    notify('success', `Renamed file to "${newCustomName.trim()}".`);
  };

  // ==========================================================================
  // SAVE MICROSOFT ID -> SUPERVISOR BINDING
  // ==========================================================================

  const handleSaveMsIdSupervisorBinding = async (empId, shift) => {
    const emp = employees.find(e => e.id === empId);
    const supName = emp?.name || msIdentity.fullName || 'Supervisor';
    const nextMap = {
      ...msIdBindings,
      [msIdentity.systemUserId || 'msid-local-session']: {
        employeeId: empId,
        shift,
        supervisorName: supName
      }
    };
    setMsIdBindings(nextMap);
    setActiveShift(shift);
    setSelectedSupervisorEmpId(empId);
    setHandoffTargetCrew(nextShiftCode(shift));
    setMsIdentity(prev => ({
      ...prev,
      matchedEmployeeId: empId,
      matchedEmployeeName: supName,
      matchedShift: shift
    }));
    await saveHubConfigJson('SUPERVISOR_MSID_MAP', nextMap);
    setShowIdentityModal(false);
    notify('success', `Bound Microsoft ID (${msIdentity.email}) to ${supName} - Shift ${shift}.`);
  };

  // ==========================================================================
  // COMPUTED SUMMARY BADGES FOR TABS
  // ==========================================================================

  const openManagerTodoCount = useMemo(() => todoList.filter(t => !t.complete && t.fromManager).length, [todoList]);
  const pendingAfterPhotosCount = useMemo(() => journalEntries.filter(j => j.status === 'Pending After Photo').length, [journalEntries]);
  const tabDefinitions = [{
    key: 'todo',
    label: 'To Do',
    badge: openManagerTodoCount,
    urgent: openManagerTodoCount > 0
  }, {
    key: 'shiftbuilder',
    label: 'Shift Builder',
    badge: attendance.unutilized.length || shiftGoals.length
  }, {
    key: 'photoupload',
    label: 'Bulk Upload',
    badge: pendingBeforeFiles.length || undefined
  }, {
    key: 'journal',
    label: 'Journal',
    badge: pendingAfterPhotosCount || journalEntries.length
  }, {
    key: 'cleanplan',
    label: 'Clean Plan',
    badge: filteredCleanPlanRows.length
  }, {
    key: 'employeequery',
    label: 'Crew Profiles',
    badge: shiftEmployees.length
  }, {
    key: 'sharepoint',
    label: 'My Files',
    badge: personalFiles.length
  }];

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return /*#__PURE__*/React.createElement("div", {
    className: "sup-hub-root min-h-screen bg-[#F7F9FC] text-slate-900 flex flex-col font-sans"
  }, /*#__PURE__*/React.createElement("style", null, SUPERVISOR_HUB_STYLES), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#00468B] border-b border-[#003366] text-white px-4 py-1.5 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 min-w-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FFB81C] text-slate-950"
  }, "Shift ", activeShift), /*#__PURE__*/React.createElement("span", {
    className: "font-bold tracking-tight text-white truncate"
  }, "Welcome, ", msIdentity.fullName || msIdentity.matchedEmployeeName), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-white/15 border border-white/10 text-amber-300 text-[11px] font-bold"
  }, msIdentity.outlookTitle || 'Sanitation Supervisor'), /*#__PURE__*/React.createElement("span", {
    className: "hidden md:inline-block px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold"
  }, "Microsoft ID Connected")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowIdentityModal(true),
    className: "px-2.5 py-0.5 rounded bg-[#FFB81C] text-slate-950 font-extrabold text-[11px]"
  }, "Bind MS ID / Profile"), /*#__PURE__*/React.createElement("button", {
    onClick: () => loadAllSupervisorHubData(),
    className: "px-2.5 py-0.5 rounded bg-[#0072CE] text-white font-bold text-[11px] border border-white/10"
  }, "Refresh Live Data"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsHeaderExpanded(prev => !prev),
    className: "px-2.5 py-0.5 rounded bg-white/15 text-white font-bold text-[11px] border border-white/10"
  }, isHeaderExpanded ? 'Hide Details' : 'Profile & Shift Controls')))), /*#__PURE__*/React.createElement("header", {
    className: "bg-white text-slate-900 px-4 pt-2 pb-2 shadow-sm border-b-2 border-[#0072CE]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[1720px] mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3 py-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3 min-w-0"
  }, /*#__PURE__*/React.createElement(BrandLogo, {
    onClick: () => setIsHeaderExpanded(prev => !prev),
    unlocked: isHeaderExpanded
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-base font-extrabold tracking-tight text-[#00468B] leading-tight"
  }, "Sanitation Supervisor Hub"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-semibold text-slate-500"
  }, "Shift ", activeShift, " Operations - Delegated Checklists - Clean Plan - Photo Proof"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 bg-[#E6F1FB] px-2.5 py-1 rounded-lg border border-blue-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-[#00468B] font-extrabold mr-1"
  }, "Active Shift:"), SHIFT_CODES.map(sc => /*#__PURE__*/React.createElement("button", {
    key: sc,
    onClick: () => {
      setActiveShift(sc);
      setHandoffTargetCrew(nextShiftCode(sc));
    },
    className: `px-2 py-0.5 rounded text-xs font-extrabold transition ${activeShift === sc ? 'bg-[#0072CE] text-white shadow-sm' : 'bg-white text-[#00468B] border border-blue-200'}`
  }, sc))))), isHeaderExpanded && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 mb-2 p-3 rounded-xl bg-[#E6F1FB] border border-[#0072CE] flex flex-wrap items-center justify-between gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[#00468B] font-bold"
  }, "Microsoft Account: ", /*#__PURE__*/React.createElement("strong", null, msIdentity.fullName), " (", msIdentity.email, ")"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-slate-700 font-mono"
  }, "Outlook Title: ", msIdentity.outlookTitle, " - Bound Supervisor: ", msIdentity.matchedEmployeeName, " - MSID: ", msIdentity.systemUserId))), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar"
  }, tabDefinitions.map(tab => {
    const isActive = activeTab === tab.key;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.key,
      onClick: () => setActiveTab(tab.key),
      className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition border shrink-0 ${isActive ? 'bg-[#0072CE] text-white border-[#00468B] shadow-sm' : tab.urgent ? 'bg-[#FDE8EC] text-[#E4002B] border-[#E4002B]' : 'bg-slate-100 text-slate-700 border-slate-200'}`
    }, /*#__PURE__*/React.createElement("span", null, tab.label), tab.badge !== undefined && tab.badge > 0 && /*#__PURE__*/React.createElement("span", {
      className: `px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${tab.urgent ? 'bg-[#E4002B] text-white' : isActive ? 'bg-[#FFB81C] text-slate-950' : 'bg-[#00468B] text-white'}`
    }, tab.badge));
  })))), statusBanner && /*#__PURE__*/React.createElement("div", {
    className: `px-4 py-1.5 text-xs font-bold flex items-center justify-between ${statusBanner.type === 'error' ? 'bg-rose-600 text-white' : statusBanner.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'}`
  }, /*#__PURE__*/React.createElement("span", null, statusBanner.text), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStatusBanner(null),
    className: "px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-white"
  }, "Dismiss")), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-[1720px] w-full mx-auto px-4 py-3 space-y-4"
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-6 shadow border border-slate-200 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-bold text-slate-700"
  }, "Syncing Microsoft ID, Supervisor To-Dos, Shift ", activeShift, " Board, Maps, Clean Plan, and SharePoint Library..."), /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-semibold text-amber-600"
  }, "Connecting to Dataverse...")), activeTab === 'todo' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-[#E4002B] to-rose-700 text-white rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-white/15"
  }, /*#__PURE__*/React.createElement(IconAlertBell, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase tracking-wider font-extrabold text-rose-100"
  }, "Tab 5 (Default Landing View) - Manager To-Do Directive"), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold"
  }, openManagerTodoCount, " Open Task(s) Assigned by Manager for Shift ", activeShift, " (", msIdentity.matchedEmployeeName, ")"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-rose-100 mt-0.5"
  }, "Tasks assigned by the Manager are highlighted in RED below. Closing out any task requires attaching Photo Proof or Scanned Paper Proof."))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTodoFilter('open'),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold ${todoFilter === 'open' ? 'bg-white text-[#E4002B]' : 'bg-rose-900/60 text-white'}`
  }, "Open (", todoList.filter(t => !t.complete).length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTodoFilter('completed'),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold ${todoFilter === 'completed' ? 'bg-white text-[#E4002B]' : 'bg-rose-900/60 text-white'}`
  }, "Completed (", todoList.filter(t => t.complete).length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTodoFilter('all'),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold ${todoFilter === 'all' ? 'bg-white text-[#E4002B]' : 'bg-rose-900/60 text-white'}`
  }, "All (", todoList.length, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-4"
  }, filteredTodos.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-base font-bold text-slate-700"
  }, "No tasks in this filter view."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, "All manager tasks assigned to ", msIdentity.matchedEmployeeName, " (Shift ", activeShift, ") are complete or none match the current filter.")) : filteredTodos.map(todo => {
    const isMgr = todo.fromManager;
    const chk = todo.checklist;
    const chkStats = getChecklistStats(chk);
    const activeCols = chk && Array.isArray(chk.columns) ? chk.columns.filter(c => c.included !== false) : [];
    const rowFilter = checklistRowFilterMap[todo.id] || 'all';
    const rowSearch = (checklistSearchMap[todo.id] || '').trim().toLowerCase();
    const visibleRows = chk && Array.isArray(chk.rows) ? chk.rows.filter(r => {
      if (rowFilter === 'remaining' && r.checked) return false;
      if (rowFilter === 'completed' && !r.checked) return false;
      if (rowSearch) {
        const hay = activeCols.map(c => String(r.cells && r.cells[c.id] || '')).join(' ').toLowerCase();
        if (!hay.includes(rowSearch)) return false;
      }
      return true;
    }) : [];
    const isTrainingTask = todo.category === 'Training' || /training|cert|sop|loto/i.test(todo.taskTitle) || activeCols.some(c => /training|course|module|sop|skill|cert/i.test(c.name));
    return /*#__PURE__*/React.createElement("div", {
      key: todo.id,
      className: `rounded-2xl p-5 shadow-sm transition border-2 ${todo.complete ? 'bg-emerald-50/50 border-emerald-300' : isMgr ? 'bg-rose-50/90 border-[#E4002B] ring-2 ring-[#E4002B]/20' : 'bg-white border-slate-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, isMgr ? /*#__PURE__*/React.createElement("span", {
      className: "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E4002B] text-white uppercase tracking-wider"
    }, "ASSIGNED BY MANAGER - ", todo.taskPriority ? todo.taskPriority.toUpperCase() : 'HIGH', " PRIORITY") : /*#__PURE__*/React.createElement("span", {
      className: "px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-700 text-white"
    }, "Supervisor Task"), todo.category && /*#__PURE__*/React.createElement("span", {
      className: "px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#0B1F3A] text-white"
    }, todo.category), chkStats.hasChecklist && /*#__PURE__*/React.createElement("span", {
      className: `px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${chkStats.pct === 100 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'}`
    }, "Floor Checklist: ", chkStats.completed, "/", chkStats.total, " (", chkStats.pct, "%)"), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-semibold text-slate-600"
    }, "Assigned To: ", /*#__PURE__*/React.createElement("strong", null, todo.assignedTo)), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-slate-500"
    }, "Date: ", todo.dateAssigned, " - Timeframe: ", /*#__PURE__*/React.createElement("strong", null, todo.timeframe))), /*#__PURE__*/React.createElement("h3", {
      className: `text-base font-extrabold ${isMgr && !todo.complete ? 'text-[#E4002B]' : 'text-slate-900'}`
    }, todo.taskTitle), todo.description && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-700 whitespace-pre-line"
    }, todo.description)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, !todo.complete ? /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setClosingTodo(todo);
        setProofType('Photo Proof');
        setProofDataUrl('');
        setProofFileName('');
        setProofNotes('');
      },
      className: "px-4 py-2 rounded-xl bg-[#E4002B] hover:bg-rose-700 text-white text-xs font-extrabold shadow flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(IconCamera, null), /*#__PURE__*/React.createElement("span", null, "Close Out with Proof")) : /*#__PURE__*/React.createElement("span", {
      className: "px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(IconCheckCircle, null), /*#__PURE__*/React.createElement("span", null, "Closed with ", todo.proofType || 'Proof')))), chkStats.hasChecklist && chk && /*#__PURE__*/React.createElement("div", {
      className: "mt-4 bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] uppercase tracking-wider font-extrabold text-amber-400"
    }, "Interactive Delegated Floor Checklist"), /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-bold text-slate-100"
    }, chkStats.completed, " of ", chkStats.total, " items checked off on floor (", chkStats.pct, "%)")), /*#__PURE__*/React.createElement("div", {
      className: "w-28 h-2.5 bg-slate-700 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full bg-emerald-400 transition-all",
      style: {
        width: `${chkStats.pct}%`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-1.5"
    }, ['all', 'remaining', 'completed'].map(fKey => {
      const count = fKey === 'all' ? chk.rows.length : fKey === 'remaining' ? chk.rows.length - chkStats.completed : chkStats.completed;
      return /*#__PURE__*/React.createElement("button", {
        key: fKey,
        onClick: () => setChecklistRowFilterMap(prev => ({
          ...prev,
          [todo.id]: fKey
        })),
        className: `px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize ${rowFilter === fKey ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`
      }, fKey, " (", count, ")");
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: checklistSearchMap[todo.id] || '',
      onChange: e => setChecklistSearchMap(prev => ({
        ...prev,
        [todo.id]: e.target.value
      })),
      placeholder: "Search rows...",
      className: "rounded-lg bg-slate-800 border border-slate-600 px-2.5 py-1 text-[11px] text-white placeholder-slate-400 w-32"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const allDone = chkStats.completed === chkStats.total;
        const nextRows = chk.rows.map(r => {
          const nextChecked = !allDone;
          const nextCells = {
            ...(r.cells || {})
          };
          activeCols.forEach(c => {
            if (c.type === 'status') {
              nextCells[c.id] = nextChecked ? 'Completed' : 'Pending';
            }
          });
          return {
            ...r,
            checked: nextChecked,
            cells: nextCells
          };
        });
        handleUpdateTodoChecklist(todo.id, {
          columns: chk.columns,
          rows: nextRows
        }, true);
      },
      className: "px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold"
    }, chkStats.completed === chkStats.total ? 'Uncheck All' : 'Check All'), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleAddChecklistFloorRow(todo),
      className: "px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold"
    }, "+ Row"), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleCopyChecklistForExcel(todo),
      className: "px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold"
    }, "Copy for Excel"), /*#__PURE__*/React.createElement("button", {
      disabled: savingChecklistId === todo.id,
      onClick: () => handleUpdateTodoChecklist(todo.id, chk, true),
      className: "px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold"
    }, savingChecklistId === todo.id ? 'Saving...' : 'Save Progress'), isTrainingTask && /*#__PURE__*/React.createElement("button", {
      disabled: promotingChecklistId === todo.id,
      onClick: () => handlePromoteChecklistToTrainingMatrix(todo),
      className: "px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold"
    }, promotingChecklistId === todo.id ? 'Syncing _t_...' : 'Sync to Training Matrix (_t_)'))), /*#__PURE__*/React.createElement("div", {
      className: "overflow-x-auto max-h-80"
    }, /*#__PURE__*/React.createElement("table", {
      className: "w-full text-left border-collapse text-xs"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "bg-slate-100 border-b border-slate-200 text-[11px] font-extrabold text-slate-700 uppercase"
    }, /*#__PURE__*/React.createElement("th", {
      className: "py-2 px-3 w-16 text-center"
    }, "Done"), /*#__PURE__*/React.createElement("th", {
      className: "py-2 px-2 w-10 text-center"
    }, "#"), activeCols.map(col => /*#__PURE__*/React.createElement("th", {
      key: col.id,
      className: "py-2 px-3"
    }, col.name)))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: activeCols.length + 2,
      className: "py-4 text-center text-xs text-slate-500 font-semibold"
    }, "No checklist rows match the current filter.")) : visibleRows.map((row, rIdx) => {
      const toggleRowChecked = () => {
        const nextChecked = !row.checked;
        const nextRows = chk.rows.map(item => {
          if (item.id !== row.id) return item;
          const nextCells = {
            ...(item.cells || {})
          };
          activeCols.forEach(c => {
            if (c.type === 'status') {
              if (nextChecked && (!nextCells[c.id] || nextCells[c.id] === 'Pending' || nextCells[c.id] === 'In Progress')) {
                nextCells[c.id] = 'Completed';
              } else if (!nextChecked && nextCells[c.id] === 'Completed') {
                nextCells[c.id] = 'Pending';
              }
            }
          });
          return {
            ...item,
            checked: nextChecked,
            cells: nextCells
          };
        });
        handleUpdateTodoChecklist(todo.id, {
          columns: chk.columns,
          rows: nextRows
        }, true, true);
      };
      const updateCellVal = (colId, val, saveImmediate) => {
        const colObj = activeCols.find(c => c.id === colId);
        const nextRows = chk.rows.map(item => {
          if (item.id !== row.id) return item;
          const nextCells = {
            ...(item.cells || {}),
            [colId]: val
          };
          let nextChecked = item.checked;
          if (colObj && colObj.type === 'status') {
            if (/^completed$/i.test(val)) nextChecked = true;else if (/^(pending|in progress|needs follow-up)$/i.test(val)) nextChecked = false;
          }
          return {
            ...item,
            checked: nextChecked,
            cells: nextCells
          };
        });
        handleUpdateTodoChecklist(todo.id, {
          columns: chk.columns,
          rows: nextRows
        }, saveImmediate, true);
      };
      return /*#__PURE__*/React.createElement("tr", {
        key: row.id,
        className: `border-b border-slate-100 transition ${row.checked ? 'bg-emerald-50/70' : 'hover:bg-slate-50'}`
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-2 px-3 text-center"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        checked: Boolean(row.checked),
        onChange: toggleRowChecked,
        className: "w-4 h-4 accent-emerald-600 cursor-pointer"
      })), /*#__PURE__*/React.createElement("td", {
        className: "py-2 px-2 text-center font-bold text-slate-400"
      }, rIdx + 1), activeCols.map(col => {
        const val = String(row.cells && row.cells[col.id] || '');
        return /*#__PURE__*/React.createElement("td", {
          key: col.id,
          className: "py-1.5 px-3"
        }, col.type === 'status' ? /*#__PURE__*/React.createElement("select", {
          value: val || (row.checked ? 'Completed' : 'Pending'),
          onChange: e => updateCellVal(col.id, e.target.value, true),
          className: `rounded-lg border px-2 py-1 text-xs font-bold ${row.checked || val === 'Completed' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : val === 'In Progress' ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-300 text-slate-800'}`
        }, CHECKLIST_STATUS_OPTIONS.map(st => /*#__PURE__*/React.createElement("option", {
          key: st,
          value: st
        }, st))) : col.type === 'checkbox' ? /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: () => {
            const isVer = /^(yes|true|done|verified|pass|1)$/i.test(val);
            updateCellVal(col.id, isVer ? 'Pending' : 'Verified', true);
          },
          className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${/^(yes|true|done|verified|pass|1)$/i.test(val) ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`
        }, /^(yes|true|done|verified|pass|1)$/i.test(val) ? 'Verified' : 'Verify') : col.type === 'date' ? /*#__PURE__*/React.createElement("input", {
          type: "date",
          value: /^\d{4}-\d{2}-\d{2}/.test(val) ? val.slice(0, 10) : '',
          onChange: e => updateCellVal(col.id, e.target.value, true),
          className: "rounded-lg border border-slate-300 px-2 py-1 text-xs bg-white"
        }) : /*#__PURE__*/React.createElement("input", {
          type: col.type === 'number' ? 'number' : 'text',
          value: val,
          onChange: e => updateCellVal(col.id, e.target.value, false),
          onBlur: () => handleUpdateTodoChecklist(todo.id, chk, true, true),
          className: `w-full rounded-lg border border-transparent hover:border-slate-300 focus:border-slate-400 px-2 py-1 text-xs bg-transparent focus:bg-white ${row.checked ? 'line-through text-slate-500' : 'text-slate-900 font-medium'}`
        }));
      }));
    }))))), todo.complete && (todo.proofDataUrl || todo.proofFileName || todo.completionNotes) && /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-4 text-xs"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-emerald-900"
    }, "Verified Proof: ", todo.proofType || 'Photo / Scan', " (", todo.proofFileName || 'Attached', ")"), todo.completionNotes && /*#__PURE__*/React.createElement("div", {
      className: "text-slate-700 mt-0.5"
    }, "Notes: ", todo.completionNotes), todo.completedAt && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-slate-500"
    }, "Closed at ", todo.completedAt, " by MSID ", todo.completedByMsId)), todo.proofDataUrl && todo.proofDataUrl.startsWith('data:image') && /*#__PURE__*/React.createElement("img", {
      src: todo.proofDataUrl,
      alt: "Task Proof",
      className: "w-24 h-16 object-cover rounded-lg border border-emerald-400 shadow-sm"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, closingTodo ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-lg border-2 border-[#E4002B] space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded bg-[#E4002B] text-white text-xs font-extrabold"
  }, "REQUIRED PROOF VERIFICATION"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setClosingTodo(null),
    className: "text-xs text-slate-500 hover:text-slate-800 font-bold"
  }, "Cancel")), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900"
  }, "Closing Out: ", closingTodo.taskTitle), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 mb-1"
  }, "1. Select Proof Format"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, ['Photo Proof', 'Scanned Paper Proof'].map(pt => /*#__PURE__*/React.createElement("button", {
    key: pt,
    onClick: () => setProofType(pt),
    className: `py-2 px-3 rounded-xl text-xs font-bold border ${proofType === pt ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-slate-50 text-slate-700 border-slate-300'}`
  }, pt)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 mb-1"
  }, "2. Upload ", proofType, " (Camera Image, Scanned Sign-Off Sheet, or PDF)"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*,.pdf",
    onChange: handleProofFileSelect,
    className: "w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#E4002B] file:text-white file:font-bold"
  }), proofDataUrl && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 p-2 bg-emerald-50 border border-emerald-300 rounded-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-bold text-emerald-800 mb-1"
  }, "Attached: ", proofFileName), proofDataUrl.startsWith('data:image') && /*#__PURE__*/React.createElement("img", {
    src: proofDataUrl,
    alt: "Proof preview",
    className: "w-full max-h-44 object-contain rounded-lg"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 mb-1"
  }, "3. Supervisor Completion Notes"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: proofNotes,
    onChange: e => setProofNotes(e.target.value),
    placeholder: "Describe verification, chemical/ATP check, or scanned sign-off details...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
  })), /*#__PURE__*/React.createElement("button", {
    disabled: savingTodoCloseout,
    onClick: handleConfirmCloseTodoWithProof,
    className: "w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow"
  }, savingTodoCloseout ? 'Saving Proof & Closing Task...' : `Confirm & Close Out with ${proofType}`)) : /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900"
  }, "Add Shift ", activeShift, " Supervisor Follow-Up Task"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    value: newSelfTaskCategory,
    onChange: e => setNewSelfTaskCategory(e.target.value),
    className: "rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold bg-white"
  }, ['General', 'Training', 'Sanitation / MSS', 'Safety / LOTO', 'Quality / Audit', 'Maintenance'].map(cat => /*#__PURE__*/React.createElement("option", {
    key: cat,
    value: cat
  }, cat))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newSelfTaskTimeframe,
    onChange: e => setNewSelfTaskTimeframe(e.target.value),
    placeholder: "Expected timeframe",
    className: "rounded-xl border border-slate-300 px-3 py-2 text-xs"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newSelfTaskTitle,
    onChange: e => setNewSelfTaskTitle(e.target.value),
    placeholder: "Task title (e.g. Verify IBL Line 2 belt sanitation)...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
  }), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: newSelfTaskDesc,
    onChange: e => setNewSelfTaskDesc(e.target.value),
    placeholder: "Task details / expectations...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-1 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowSelfTaskChecklistPaste(v => !v),
    className: "text-xs font-extrabold text-[#0B1F3A] hover:underline"
  }, showSelfTaskChecklistPaste ? 'Hide Excel Checklist Paste' : '+ Attach / Paste Excel Checklist Table'), showSelfTaskChecklistPaste && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      if (!newSelfTaskTitle.trim()) {
        setNewSelfTaskTitle(`Shift ${activeShift} Floor Training & SOP Verification`);
      }
      setNewSelfTaskCategory('Training');
      setNewSelfTaskPasteText(['Employee Name\tShift\tTraining Module\tDue Date\tStatus\tFloor Notes', `Doe, John\t${activeShift}\tAnnual LOTO & Machine Guarding\t${todayIso()}\tPending\tVerify on Line 1`, `Roe, Jane\t${activeShift}\tAllergen Swab & Changeover SOP\t${todayIso()}\tCompleted\tSigned off on floor`, `Smith, Carlos\t${activeShift}\tChemical Titration & PPE Safety\t${todayIso()}\tIn Progress\tTitration check`].join('\n'));
    },
    className: "text-[11px] font-bold text-[#E4002B] hover:underline"
  }, "Load Sample Training Paste")), showSelfTaskChecklistPaste && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 space-y-2"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: newSelfTaskPasteText,
    onChange: e => setNewSelfTaskPasteText(e.target.value),
    placeholder: "Paste rows directly from Excel (Tab-separated or CSV)...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: handleCreateSupervisorSelfTodo,
    className: "w-full py-2 rounded-xl bg-[#0B1F3A] hover:bg-slate-800 text-white text-xs font-bold"
  }, "Add to Shift ", activeShift, " To-Do List"))))), activeTab === 'shiftbuilder' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-xl border border-slate-200 border-b-4 border-b-[#0072CE] shadow-sm px-4 py-3 space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3"
  }, /*#__PURE__*/React.createElement(BrandLogo, {
    onClick: () => setSbStep(3),
    unlocked: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-[#00468B] tracking-tight"
  }, "Shift Start"), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#00468B] border border-blue-200 text-[11px] font-extrabold"
  }, "Crew ", activeShift, " - ", msIdentity.matchedEmployeeName), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-[#FFF6E0] text-[#8A5A00] border border-[#FFB81C] text-[11px] font-extrabold"
  }, sbPlanMode === 'planned' ? `Planned ${activeQuarter} Build` : sbPlanMode === 'next_shift' ? `Next Shift (${planDate})` : `Live Board (${activeQuarter})`)), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-slate-500 font-semibold"
  }, "Team Builder & Deployment - Changes saved here update the live Shift Start board load")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-300"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-bold text-slate-600"
  }, "Shift Date:"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: planDate,
    onChange: e => {
      setPlanDate(e.target.value);
      if (e.target.value > todayIso()) setSbPlanMode('next_shift');
    },
    className: "bg-transparent text-xs font-extrabold text-[#00468B]"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setActiveQuarter('6:00');
      setSbPlanMode('live');
    },
    className: `px-2.5 py-1 rounded-md text-xs font-extrabold transition ${activeQuarter === '6:00' && sbPlanMode !== 'next_shift' ? 'bg-[#0072CE] text-white shadow-sm' : 'text-slate-700 hover:bg-white'}`
  }, "Live (6:00)"), ['9:00', '12:00', '3:00'].map(qSlot => {
    const isActiveQ = activeQuarter === qSlot && sbPlanMode === 'planned';
    const shortLabel = qSlot.replace(':00', '');
    return /*#__PURE__*/React.createElement("button", {
      key: qSlot,
      type: "button",
      onClick: () => {
        setActiveQuarter(qSlot);
        setSbPlanMode('planned');
      },
      className: `px-2.5 py-1 rounded-md text-xs font-extrabold transition ${isActiveQ ? 'bg-[#FFB81C] text-slate-950 shadow-sm border border-amber-500' : 'text-slate-700 hover:bg-white'}`
    }, "Planned ", shortLabel);
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setSbPlanMode('next_shift');
      setShowSbGoalsDrawer(true);
    },
    className: `px-2.5 py-1 rounded-md text-xs font-extrabold transition ${sbPlanMode === 'next_shift' ? 'bg-[#00468B] text-white shadow-sm' : 'text-slate-700 hover:bg-white'}`
  }, "Next Shift Setup")), activeQuarter !== '6:00' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleCopyQuarterBuildToAllQuarters(activeQuarter),
    className: "px-2.5 py-1.5 rounded-lg bg-[#FFF6E0] text-[#8A5A00] border border-[#FFB81C] text-[11px] font-extrabold"
  }, "Copy ", activeQuarter, " to All 6-9-12-3"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold"
  }, "Saved ", sbLastSavedStr, " (save ", sbSaveCount, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: savingBoard,
    onClick: () => saveShiftBoardState(),
    className: "px-4 py-1.5 rounded-lg bg-[#0072CE] hover:bg-[#00468B] text-white text-xs font-extrabold shadow-sm border border-[#00468B]"
  }, savingBoard ? 'Saving...' : 'Save'))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1.5"
  }, [{
    idx: 0,
    label: '1 Leads'
  }, {
    idx: 1,
    label: '2 Areas'
  }, {
    idx: 2,
    label: '3 Assign Areas'
  }, {
    idx: 3,
    label: '4 Assign Employees'
  }, {
    idx: 4,
    label: '5 Update Teams'
  }, {
    idx: 5,
    label: '6 Equipment & Finish'
  }].map(st => {
    const isCurrent = sbStep === st.idx;
    const isCompleted = sbStep > st.idx;
    return /*#__PURE__*/React.createElement("button", {
      key: st.idx,
      type: "button",
      onClick: () => setSbStep(st.idx),
      className: `px-3 py-1.5 rounded-lg text-xs font-extrabold transition border ${isCurrent ? 'bg-[#0072CE] text-white border-[#00468B] shadow-sm' : isCompleted ? 'bg-[#E6F1FB] text-[#00468B] border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`
    }, st.label);
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowSbGoalsDrawer(prev => !prev),
    className: `px-3 py-1.5 rounded-lg text-xs font-extrabold border transition ${showSbGoalsDrawer ? 'bg-[#FFB81C] text-slate-950 border-amber-500 shadow-sm' : 'bg-[#FFF6E0] text-[#8A5A00] border-[#FFB81C]'}`
  }, "Goals & Handoff (", shiftGoals.length, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      ensureEquipmentLoaded(false);
      setShowDowntimeModal(true);
    },
    className: "px-3 py-1.5 rounded-lg bg-[#FDE8EC] text-[#E4002B] border border-[#E4002B] text-xs font-extrabold flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(IconClock, null), /*#__PURE__*/React.createElement("span", null, "Log Down Time (", obstacles.length, ")")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleResetAllEmployeesToUnutilized,
    className: "px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-extrabold"
  }, "Employee Reset")))), showSbGoalsDrawer && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white rounded-xl p-4 border-2 border-[#FFB81C] shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-[#0072CE]"
  }, "Shift Builder Goal Planner (Carries to Next Shift Handoff)"), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-[#00468B]"
  }, "Set Goal to Finish: 1 - Room, 2 - Area, 3 - Subcategory")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowSbGoalsDrawer(false),
    className: "px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold"
  }, "Hide Goals Drawer")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-4 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-bold text-slate-700 mb-0.5"
  }, "1 - Room (MSS)"), /*#__PURE__*/React.createElement("select", {
    value: goalRoom,
    onChange: e => {
      setGoalRoom(e.target.value);
      setGoalArea('');
      setGoalSubcategory('');
    },
    className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Room..."), distinctRooms.map(rm => /*#__PURE__*/React.createElement("option", {
    key: rm,
    value: rm
  }, rm)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-bold text-slate-700 mb-0.5"
  }, "2 - Area (MSS)"), /*#__PURE__*/React.createElement("select", {
    value: goalArea,
    onChange: e => {
      setGoalArea(e.target.value);
      setGoalSubcategory('');
    },
    className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Area..."), areasForSelectedGoalRoom.map(ar => /*#__PURE__*/React.createElement("option", {
    key: ar,
    value: ar
  }, ar)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-bold text-slate-700 mb-0.5"
  }, "3 - Subcategory"), /*#__PURE__*/React.createElement("select", {
    value: goalSubcategory,
    onChange: e => setGoalSubcategory(e.target.value),
    className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Subcategory..."), subcategoriesForSelectedGoalArea.map(sub => /*#__PURE__*/React.createElement("option", {
    key: sub,
    value: sub
  }, sub)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-bold text-slate-700 mb-0.5"
  }, "Target Checkpoint"), /*#__PURE__*/React.createElement("select", {
    value: goalQuarterTarget,
    onChange: e => setGoalQuarterTarget(e.target.value),
    className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-bold"
  }, QUARTER_SLOTS.map(q => /*#__PURE__*/React.createElement("option", {
    key: q,
    value: q
  }, "Planned ", q)), /*#__PURE__*/React.createElement("option", {
    value: "End of Shift"
  }, "End of Shift")))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: goalNotes,
    onChange: e => setGoalNotes(e.target.value),
    placeholder: "Goal criteria (e.g. Full belt teardown & ATP swab pass)...",
    className: "flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddShiftGoal,
    className: "px-4 py-1.5 rounded-lg bg-[#0072CE] text-white text-xs font-extrabold shadow-sm"
  }, "+ Add Goal")), shiftGoals.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 max-h-44 overflow-y-auto pr-1"
  }, shiftGoals.map((g, idx) => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    className: "p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-[#00468B]"
  }, "1-", g.room, " / 2-", g.area, " / 3-", g.subcategory), /*#__PURE__*/React.createElement("span", {
    className: "ml-2 px-2 py-0.2 rounded bg-[#E6F1FB] text-[#00468B] text-[10px] font-bold"
  }, "Target: ", g.quarterTarget)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    value: g.status,
    onChange: e => {
      const next = [...shiftGoals];
      next[idx] = {
        ...g,
        status: e.target.value,
        percent: e.target.value === 'Completed' ? 100 : g.percent
      };
      setShiftGoals(next);
    },
    className: "rounded border border-slate-300 px-2 py-0.5 text-[11px] font-bold bg-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Planned"
  }, "Planned"), /*#__PURE__*/React.createElement("option", {
    value: "In Progress"
  }, "In Progress"), /*#__PURE__*/React.createElement("option", {
    value: "Completed"
  }, "Completed"), /*#__PURE__*/React.createElement("option", {
    value: "Carry Over"
  }, "Carry Over")), /*#__PURE__*/React.createElement("label", {
    className: "inline-flex items-center gap-1 text-[11px] font-bold text-[#8A5A00] cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: g.carryToHandoff,
    onChange: e => {
      const next = [...shiftGoals];
      next[idx] = {
        ...g,
        carryToHandoff: e.target.checked
      };
      setShiftGoals(next);
    }
  }), /*#__PURE__*/React.createElement("span", null, "Handoff"))))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 bg-[#FFF6E0] rounded-xl p-3.5 border border-[#FFB81C] space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-extrabold text-[#8A5A00] uppercase"
  }, "Carry Goals Onto Next Shift in Handoff"), /*#__PURE__*/React.createElement("select", {
    value: handoffTargetCrew,
    onChange: e => setHandoffTargetCrew(e.target.value),
    className: "rounded border border-[#FFB81C] bg-white px-2 py-0.5 text-xs font-extrabold text-[#00468B]"
  }, SHIFT_CODES.map(sc => /*#__PURE__*/React.createElement("option", {
    key: sc,
    value: sc
  }, "To Shift ", sc)))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: handoffSummaryNote,
    onChange: e => setHandoffSummaryNote(e.target.value),
    placeholder: "Handoff notes for incoming shift supervisor...",
    className: "w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleCarryGoalsToNextShiftHandoff,
    className: "w-full py-2 rounded-lg bg-[#0072CE] text-white text-xs font-extrabold shadow-sm"
  }, "Carry Selected Goals to Shift ", handoffTargetCrew, " Handoff"))), sbStep === 0 && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#0072CE] p-5 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-[#00468B] uppercase"
  }, "Step 1 - Select Active Shift ", activeShift, " Leads"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Choose the leads who will own Lead Bucket Columns in Step 3 & Step 4.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSbStep(1),
    className: "px-4 py-1.5 rounded-lg bg-[#0072CE] text-white text-xs font-extrabold"
  }, "Next: 2 Areas")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5"
  }, shiftEmployees.map(emp => {
    const isLeadSelected = sbSelectedLeadIds.includes(emp.id);
    return /*#__PURE__*/React.createElement("button", {
      key: emp.id,
      type: "button",
      onClick: () => setSbSelectedLeadIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id]),
      className: `p-3 rounded-xl border text-left transition flex items-center justify-between ${isLeadSelected ? 'bg-[#E6F1FB] border-[#0072CE] text-[#00468B] shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-800'}`
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-extrabold"
    }, emp.name), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-slate-500"
    }, emp.role)), /*#__PURE__*/React.createElement("span", {
      className: `px-2 py-0.5 rounded text-[10px] font-extrabold ${isLeadSelected ? 'bg-[#0072CE] text-white' : 'bg-slate-200 text-slate-700'}`
    }, isLeadSelected ? 'Lead' : 'Select'));
  }))), sbStep === 1 && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#0072CE] p-5 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-[#00468B] uppercase"
  }, "Step 2 - Select MSS Areas & Custom Areas for Shift ", activeShift), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Click any MSS Room / Area to toggle it on today's Shift Start board, or add a Custom Area.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    value: customRoomInput,
    onChange: e => setCustomRoomInput(e.target.value),
    className: "rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
  }, distinctRooms.map(rm => /*#__PURE__*/React.createElement("option", {
    key: rm,
    value: rm
  }, rm)), /*#__PURE__*/React.createElement("option", {
    value: "Custom"
  }, "Custom")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: customAreaInput,
    onChange: e => setCustomAreaInput(e.target.value),
    placeholder: "Custom Area name...",
    className: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddCustomAreaToBoard,
    className: "px-3 py-1.5 rounded-lg bg-[#FFB81C] text-slate-950 text-xs font-extrabold"
  }, "+ Add Custom Area"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSbStep(2),
    className: "px-4 py-1.5 rounded-lg bg-[#0072CE] text-white text-xs font-extrabold"
  }, "Next: 3 Assign Areas"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5"
  }, mssAreaLookup.map(m => {
    const key = `${m.room}::${m.area}`;
    const onBoard = boardAreaRows.some(r => r.key.toLowerCase() === key.toLowerCase());
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      onClick: () => {
        if (onBoard) {
          handleRemoveAreaFromBoard(key);
        } else {
          const defaultLead = sbSelectedLeadIds[0] || selectedSupervisorEmpId || '';
          const newRow = {
            key,
            room: m.room,
            area: m.area,
            isCustom: false,
            leadId: defaultLead,
            memberIds: [],
            progressPct: 0,
            cleanType: 'Wet Clean',
            etaMinutes: 150,
            notes: '',
            quarters: {
              '6:00': {
                leadId: defaultLead,
                memberIds: [],
                notes: ''
              },
              '9:00': {
                leadId: defaultLead,
                memberIds: [],
                notes: ''
              },
              '12:00': {
                leadId: defaultLead,
                memberIds: [],
                notes: ''
              },
              '3:00': {
                leadId: defaultLead,
                memberIds: [],
                notes: ''
              }
            }
          };
          setBoardAreaRows(prev => [...prev, newRow]);
        }
      },
      className: `p-3 rounded-xl border text-left transition flex items-center justify-between ${onBoard ? 'bg-[#E6F1FB] border-[#0072CE] text-[#00468B] shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'}`
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "px-1.5 py-0.2 rounded bg-[#00468B] text-white text-[9px] font-extrabold uppercase"
    }, m.room), /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-extrabold mt-1"
    }, m.area)), /*#__PURE__*/React.createElement("span", {
      className: `px-2 py-0.5 rounded text-[10px] font-extrabold ${onBoard ? 'bg-[#0072CE] text-white' : 'bg-slate-200 text-slate-600'}`
    }, onBoard ? 'Active' : '+ Add'));
  }))), sbStep === 2 && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-xl border border-slate-200 border-l-4 border-l-[#0072CE] p-5 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-[#00468B] uppercase"
  }, "Step 3 - Assign Areas to Leads (", activeQuarter, " Quarter)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Assign each active Room / Area card to a Shift Lead bucket.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSbStep(3),
    className: "px-4 py-1.5 rounded-lg bg-[#0072CE] text-white text-xs font-extrabold"
  }, "Next: 4 Assign Employees")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
  }, boardAreaRows.map((row, rIdx) => {
    const qCell = row.quarters[activeQuarter] || {
      leadId: row.leadId,
      memberIds: row.memberIds,
      notes: ''
    };
    const currentLeadId = activeQuarter === '6:00' ? row.leadId : qCell.leadId || row.leadId;
    return /*#__PURE__*/React.createElement("div", {
      key: row.key,
      className: "p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-[#00468B] text-white text-[10px] font-extrabold uppercase"
    }, row.room), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-bold text-[#0072CE]"
    }, row.cleanType)), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-extrabold text-slate-900"
    }, row.area), /*#__PURE__*/React.createElement("select", {
      value: currentLeadId,
      onChange: e => {
        const val = e.target.value;
        const next = [...boardAreaRows];
        next[rIdx] = {
          ...row,
          leadId: activeQuarter === '6:00' ? val : row.leadId,
          quarters: {
            ...row.quarters,
            [activeQuarter]: {
              ...qCell,
              leadId: val
            }
          }
        };
        setBoardAreaRows(next);
        if (val && !sbSelectedLeadIds.includes(val)) {
          setSbSelectedLeadIds(prev => [...prev, val]);
        }
      },
      className: "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-[#00468B]"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "-- Select Lead --"), shiftEmployees.map(emp => /*#__PURE__*/React.createElement("option", {
      key: emp.id,
      value: emp.id
    }, emp.name, " (", emp.role, ")"))));
  }))), sbStep >= 3 && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 overflow-x-auto pb-2 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-[270px] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#FFB81C] p-3 space-y-3"
  }, (() => {
    // Compute assigned staff for the active quarter ('6:00' Live or Planned '9:00' / '12:00' / '3:00')
    const assignedIds = new Set();
    boardAreaRows.forEach(r => {
      const qCell = r.quarters[activeQuarter];
      const activeLead = activeQuarter === '6:00' ? r.leadId : qCell?.leadId || r.leadId;
      const activeMems = activeQuarter === '6:00' ? r.memberIds : qCell?.memberIds || r.memberIds;
      if (activeLead) assignedIds.add(activeLead);
      (activeMems || []).forEach(m => assignedIds.add(m));
    });
    const unavailableIds = new Set([...attendance.pto, ...attendance.sick, ...attendance.leftEarly]);
    const staffPool = showOffShiftStaff ? employees : shiftEmployees;
    const availablePool = staffPool.filter(e => !assignedIds.has(e.id) && !unavailableIds.has(e.id) && (!deployStaffSearch.trim() || e.name.toLowerCase().includes(deployStaffSearch.toLowerCase()) || e.role.toLowerCase().includes(deployStaffSearch.toLowerCase())));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "border-b border-slate-200 pb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-extrabold uppercase tracking-wider text-[#00468B]"
    }, "Available Staff"), /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded-full bg-[#FFF6E0] text-[#8A5A00] border border-[#FFB81C] text-[10px] font-extrabold"
    }, "Available: ", availablePool.length, " vs Assigned: ", assignedIds.size)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-slate-500 mt-0.5"
    }, activeQuarter === '6:00' ? 'Live 6:00 Board - Drag or click to assign' : `Planned ${activeQuarter} Build - Drag or click to plan`)), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: deployStaffSearch,
      onChange: e => setDeployStaffSearch(e.target.value),
      placeholder: "Search staff...",
      className: "w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between text-[11px]"
    }, /*#__PURE__*/React.createElement("label", {
      className: "inline-flex items-center gap-1 font-bold text-[#0072CE] cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: showOffShiftStaff,
      onChange: e => setShowOffShiftStaff(e.target.checked)
    }), /*#__PURE__*/React.createElement("span", null, "+ Add Off-Shift / OT")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: handleResetAllEmployeesToUnutilized,
      className: "text-[10px] font-extrabold text-[#E4002B]"
    }, "Reset All"))), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5 max-h-[380px] overflow-y-auto pr-0.5"
    }, staffPool.filter(emp => !deployStaffSearch.trim() || emp.name.toLowerCase().includes(deployStaffSearch.toLowerCase()) || emp.role.toLowerCase().includes(deployStaffSearch.toLowerCase())).map(emp => {
      const currentArea = boardAreaRows.find(r => {
        const qCell = r.quarters[activeQuarter];
        const lId = activeQuarter === '6:00' ? r.leadId : qCell?.leadId || r.leadId;
        const mIds = activeQuarter === '6:00' ? r.memberIds : qCell?.memberIds || r.memberIds;
        return lId === emp.id || (mIds || []).includes(emp.id);
      });
      const isSelected = selectedEmpIdsForAssign.includes(emp.id);
      const isPto = attendance.pto.includes(emp.id);
      const isSick = attendance.sick.includes(emp.id);
      const isLate = attendance.late.includes(emp.id);
      const isLeftEarly = attendance.leftEarly.includes(emp.id);
      const isOffShift = normalizeShiftCode(emp.shift) !== activeShift;
      return /*#__PURE__*/React.createElement("div", {
        key: emp.id,
        draggable: true,
        onDragStart: () => setDraggedEmpId(emp.id),
        onDragEnd: () => setDraggedEmpId(null),
        onClick: () => setSelectedEmpIdsForAssign(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id]),
        className: `px-2.5 py-1.5 rounded-md border text-xs transition cursor-grab select-none ${isSelected ? 'bg-[#E6F1FB] border-[#0072CE] text-[#00468B] shadow-sm' : currentArea ? 'bg-slate-100 border-slate-200 text-slate-500' : isPto || isSick || isLeftEarly ? 'bg-[#FDE8EC] border-rose-200 text-rose-900' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between gap-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "font-bold truncate flex items-center gap-1"
      }, /*#__PURE__*/React.createElement("span", {
        className: "truncate"
      }, emp.name), isOffShift && /*#__PURE__*/React.createElement("span", {
        className: "px-1 py-0.2 rounded bg-purple-600 text-white text-[9px] font-extrabold"
      }, "OT ", emp.shift), isLate && /*#__PURE__*/React.createElement("span", {
        className: "px-1 py-0.2 rounded bg-[#FFB81C] text-slate-950 text-[9px] font-extrabold"
      }, "LATE")), /*#__PURE__*/React.createElement("div", {
        className: "text-[10px] text-slate-500 truncate"
      }, currentArea ? `${currentArea.room} - ${currentArea.area}` : isPto ? 'PTO' : isSick ? 'Sick' : isLeftEarly ? 'Left Early' : emp.role)), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-1 shrink-0"
      }, currentArea && /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: ev => {
          ev.stopPropagation();
          handleResetEmployeeToUnutilized(emp.id);
        },
        className: "px-1.5 py-0.5 rounded bg-[#FFF6E0] text-[#8A5A00] border border-[#FFB81C] text-[9px] font-extrabold"
      }, "Reset"), /*#__PURE__*/React.createElement("span", {
        className: `px-1.5 py-0.5 rounded text-[9px] font-extrabold ${isSelected ? 'bg-[#0072CE] text-white' : 'bg-slate-100 text-slate-600'}`
      }, isSelected ? 'Picked' : 'Pick'))), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-1 mt-1 pt-1 border-t border-slate-100",
        onClick: ev => ev.stopPropagation()
      }, [{
        key: 'pto',
        label: 'PTO',
        active: isPto
      }, {
        key: 'sick',
        label: 'Sick',
        active: isSick
      }, {
        key: 'late',
        label: 'Late',
        active: isLate
      }, {
        key: 'leftEarly',
        label: 'Early',
        active: isLeftEarly
      }].map(st => /*#__PURE__*/React.createElement("button", {
        key: st.key,
        type: "button",
        onClick: () => handleSetEmployeeAttendanceStatus(emp.id, st.key),
        className: `px-1.5 py-0.2 rounded text-[9px] font-bold ${st.active ? 'bg-[#E4002B] text-white' : 'bg-slate-100 text-slate-600'}`
      }, st.label))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "pt-2 border-t border-slate-200 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] font-extrabold uppercase text-[#00468B]"
    }, "Assign Selected (", selectedEmpIdsForAssign.length, ") to Area:"), /*#__PURE__*/React.createElement("select", {
      value: targetAreaKeyForAssign,
      onChange: e => setTargetAreaKeyForAssign(e.target.value),
      className: "w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-800"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "-- Target Area --"), boardAreaRows.map(r => /*#__PURE__*/React.createElement("option", {
      key: r.key,
      value: r.key
    }, r.room, " - ", r.area))), /*#__PURE__*/React.createElement("label", {
      className: "inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: assignAsLead,
      onChange: e => setAssignAsLead(e.target.checked)
    }), /*#__PURE__*/React.createElement("span", null, "Set as Area Lead")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: handleAssignSelectedEmployeesToArea,
      className: "w-full py-1.5 rounded-lg bg-[#0072CE] text-white text-xs font-extrabold shadow-sm"
    }, "Assign to ", activeQuarter, " Board")), /*#__PURE__*/React.createElement("div", {
      className: "pt-2 border-t border-slate-200 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] font-extrabold uppercase text-[#00468B]"
    }, "+ Add Custom Area"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1"
    }, /*#__PURE__*/React.createElement("select", {
      value: customRoomInput,
      onChange: e => setCustomRoomInput(e.target.value),
      className: "w-20 rounded border border-slate-300 px-1.5 py-1 text-[11px] font-bold"
    }, distinctRooms.map(rm => /*#__PURE__*/React.createElement("option", {
      key: rm,
      value: rm
    }, rm)), /*#__PURE__*/React.createElement("option", {
      value: "Custom"
    }, "Custom")), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: customAreaInput,
      onChange: e => setCustomAreaInput(e.target.value),
      placeholder: "Area name...",
      className: "flex-1 min-w-0 rounded border border-slate-300 px-2 py-1 text-[11px]"
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: handleAddCustomAreaToBoard,
      className: "w-full py-1 rounded bg-[#E6F1FB] text-[#00468B] border border-blue-200 text-[11px] font-extrabold"
    }, "+ Add Area Card")));
  })()), (() => {
    const bucketMap = new Map();
    // Seed buckets with selected leads so empty lead columns also show like Shift Start
    sbSelectedLeadIds.forEach(lId => {
      const emp = employees.find(e => e.id === lId);
      if (emp && !bucketMap.has(emp.id)) {
        bucketMap.set(emp.id, {
          leadId: emp.id,
          leadName: emp.name,
          rows: []
        });
      }
    });
    boardAreaRows.forEach(row => {
      const qCell = row.quarters[activeQuarter];
      const activeLeadId = activeQuarter === '6:00' ? row.leadId : qCell?.leadId || row.leadId;
      const leadEmp = employees.find(e => e.id === activeLeadId);
      const bKey = leadEmp ? leadEmp.id : 'UNASSIGNED_LEAD';
      const bName = leadEmp ? leadEmp.name : `Shift ${activeShift} Unassigned Areas`;
      if (!bucketMap.has(bKey)) {
        bucketMap.set(bKey, {
          leadId: leadEmp?.id || '',
          leadName: bName,
          rows: []
        });
      }
      bucketMap.get(bKey).rows.push(row);
    });
    const buckets = Array.from(bucketMap.values()).filter(b => b.leadId !== '' || b.rows.length > 0);
    return /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3.5 overflow-x-auto pb-2 items-start flex-1"
    }, buckets.map(bucket => {
      const colKey = bucket.leadId || 'UNASSIGNED_LEAD';
      const isCollapsed = Boolean(sbCollapsedLeadCols[colKey]);
      const totalAssignedInBucket = bucket.rows.reduce((acc, r) => {
        const qCell = r.quarters[activeQuarter];
        const mems = activeQuarter === '6:00' ? r.memberIds : qCell?.memberIds || r.memberIds;
        return acc + (mems?.length || 0);
      }, 0);
      if (isCollapsed) {
        return /*#__PURE__*/React.createElement("div", {
          key: colKey,
          onClick: () => setSbCollapsedLeadCols(prev => ({
            ...prev,
            [colKey]: false
          })),
          className: "w-14 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#0072CE] p-2.5 cursor-pointer flex flex-col items-center gap-2",
          title: `Expand ${bucket.leadName}`
        }, /*#__PURE__*/React.createElement("span", {
          className: "px-1.5 py-0.5 rounded-full bg-[#0072CE] text-white text-[10px] font-extrabold"
        }, bucket.rows.length), /*#__PURE__*/React.createElement("span", {
          className: "text-xs font-extrabold text-[#00468B] truncate max-w-[44px]"
        }, bucket.leadName.split(' ')[0]));
      }
      return /*#__PURE__*/React.createElement("div", {
        key: colKey,
        className: "w-[310px] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#0072CE] p-3 space-y-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between border-b border-slate-200 pb-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "px-2 py-0.2 rounded bg-[#E6F1FB] text-[#00468B] text-[10px] font-extrabold uppercase"
      }, "Lead"), activeQuarter !== '6:00' && /*#__PURE__*/React.createElement("span", {
        className: "px-1.5 py-0.2 rounded bg-[#FFF6E0] text-[#8A5A00] text-[9px] font-extrabold"
      }, "Planned ", activeQuarter)), /*#__PURE__*/React.createElement("h3", {
        className: "text-sm font-extrabold text-[#00468B] truncate mt-0.5"
      }, bucket.leadName)), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-1 shrink-0"
      }, /*#__PURE__*/React.createElement("span", {
        className: "px-2 py-0.5 rounded-full bg-[#0072CE] text-white text-[10px] font-extrabold"
      }, bucket.rows.length, " Areas"), /*#__PURE__*/React.createElement("span", {
        className: "px-2 py-0.5 rounded-full bg-[#FFF6E0] text-[#8A5A00] border border-[#FFB81C] text-[10px] font-extrabold"
      }, totalAssignedInBucket, " Staff"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => setSbCollapsedLeadCols(prev => ({
          ...prev,
          [colKey]: true
        })),
        className: "px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold",
        title: "Collapse Lead Column"
      }, "-"))), /*#__PURE__*/React.createElement("div", {
        className: "space-y-2.5"
      }, bucket.rows.map(row => {
        const qCell = row.quarters[activeQuarter] || {
          leadId: row.leadId,
          memberIds: row.memberIds,
          notes: ''
        };
        const activeMembers = activeQuarter === '6:00' ? row.memberIds : qCell.memberIds || row.memberIds;
        const isTarget = targetAreaKeyForAssign === row.key;
        return /*#__PURE__*/React.createElement("div", {
          key: row.key,
          onDragOver: e => e.preventDefault(),
          onDrop: () => {
            if (draggedEmpId) {
              handleQuickAssignEmployeeToArea(draggedEmpId, row.key, false);
              setDraggedEmpId(null);
            }
          },
          onClick: () => setTargetAreaKeyForAssign(row.key),
          className: `rounded-lg p-3 border-2 transition space-y-2 ${isTarget ? 'bg-[#F0F7FD] border-[#0072CE] shadow-sm' : 'bg-slate-50/70 border-slate-200'}`
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-start justify-between gap-1.5"
        }, /*#__PURE__*/React.createElement("div", {
          className: "min-w-0"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-1 flex-wrap"
        }, /*#__PURE__*/React.createElement("span", {
          className: "px-1.5 py-0.2 rounded bg-[#00468B] text-white text-[9px] font-extrabold uppercase"
        }, row.room), /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: ev => {
            ev.stopPropagation();
            handleCycleAreaCleanType(row.key);
          },
          className: "px-1.5 py-0.2 rounded bg-[#E6F1FB] text-[#0072CE] border border-blue-200 text-[9px] font-extrabold",
          title: "Click to cycle Clean Type"
        }, row.cleanType || 'Wet Clean'), row.isCustom && /*#__PURE__*/React.createElement("span", {
          className: "px-1.5 py-0.2 rounded bg-[#FFF6E0] text-[#8A5A00] text-[9px] font-extrabold"
        }, "Custom")), /*#__PURE__*/React.createElement("h4", {
          className: "text-xs font-extrabold text-slate-900 mt-1 truncate"
        }, row.area)), /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-1 shrink-0"
        }, selectedEmpIdsForAssign.length > 0 && /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: ev => {
            ev.stopPropagation();
            setTargetAreaKeyForAssign(row.key);
            selectedEmpIdsForAssign.forEach(id => {
              handleQuickAssignEmployeeToArea(id, row.key, false);
            });
            setSelectedEmpIdsForAssign([]);
          },
          className: "px-2 py-0.5 rounded bg-[#0072CE] text-white text-[10px] font-extrabold"
        }, "+ Assign (", selectedEmpIdsForAssign.length, ")"), /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: ev => {
            ev.stopPropagation();
            handleRemoveAreaFromBoard(row.key);
          },
          className: "px-1.5 py-0.2 rounded bg-slate-200 hover:bg-rose-100 text-slate-700 text-[10px] font-bold",
          title: "Remove Area from Board"
        }, "x"))), sbStep >= 4 && /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200 text-[10px]",
          onClick: ev => ev.stopPropagation()
        }, /*#__PURE__*/React.createElement("span", {
          className: "font-bold text-slate-600"
        }, "Progress:"), /*#__PURE__*/React.createElement("input", {
          type: "range",
          min: 0,
          max: 100,
          step: 5,
          value: row.progressPct || 0,
          onChange: e => {
            const pct = Number(e.target.value);
            setBoardAreaRows(prev => prev.map(r => r.key === row.key ? {
              ...r,
              progressPct: pct
            } : r));
          },
          className: "flex-1"
        }), /*#__PURE__*/React.createElement("span", {
          className: "font-extrabold text-[#00468B]"
        }, row.progressPct || 0, "%")), /*#__PURE__*/React.createElement("div", {
          className: "space-y-1",
          onClick: ev => ev.stopPropagation()
        }, activeMembers.length === 0 ? /*#__PURE__*/React.createElement("div", {
          className: "p-2 rounded border border-dashed border-slate-300 bg-white text-center text-[10px] text-slate-400"
        }, "Drop employee here or select below") : /*#__PURE__*/React.createElement("div", {
          className: "space-y-1"
        }, activeMembers.map(empId => {
          const emp = employees.find(e => e.id === empId);
          return /*#__PURE__*/React.createElement("div", {
            key: empId,
            draggable: true,
            onDragStart: () => setDraggedEmpId(empId),
            onDragEnd: () => setDraggedEmpId(null),
            className: "px-2 py-1 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs cursor-grab"
          }, /*#__PURE__*/React.createElement("span", {
            className: "font-bold text-slate-800 truncate"
          }, emp?.name || empId), /*#__PURE__*/React.createElement("button", {
            type: "button",
            onClick: () => handleResetEmployeeToUnutilized(empId),
            title: "Reset employee back to Available Staff",
            className: "px-1.5 py-0.2 rounded bg-[#FFF6E0] text-[#8A5A00] border border-[#FFB81C] text-[9px] font-extrabold"
          }, "Reset"));
        })), /*#__PURE__*/React.createElement("select", {
          value: "",
          onChange: e => {
            if (e.target.value) {
              handleQuickAssignEmployeeToArea(e.target.value, row.key, false);
            }
          },
          className: "w-full rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
        }, /*#__PURE__*/React.createElement("option", {
          value: ""
        }, "+ Assign Employee to ", row.area, "..."), (showOffShiftStaff ? employees : shiftEmployees).map(emp => /*#__PURE__*/React.createElement("option", {
          key: emp.id,
          value: emp.id
        }, emp.name, " (", emp.role, ")")))));
      })));
    }));
  })())), activeTab === 'photoupload' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#E4002B]"
  }, "Bulk Upload - Room & Area First - Per-Photo Equipment Cache - Popup Map Pinning"), /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900"
  }, "Bulk or Single Photo Upload - Extra Cleans, PM, Project Completion (Before Required, After Timestamp Ref)")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, ['bulk', 'single', 'attach_after'].map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setUploadMode(m),
    className: `px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${uploadMode === m ? 'bg-[#0B1F3A] text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`
  }, m === 'bulk' ? 'Bulk Upload' : m === 'single' ? 'Single Upload' : 'Attach After by Timestamp Ref')))), uploadMode === 'attach_after' ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900"
  }, "Reference Pending Timestamp Name & Attach 'After' Photo"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600"
  }, "Select any submission below by its auto-generated Timestamp Reference Name and upload the completed AFTER photo."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 mb-1"
  }, "1. Select Timestamp Reference Name (Pending After Photo)"), /*#__PURE__*/React.createElement("select", {
    value: selectedPendingJournalId,
    onChange: e => setSelectedPendingJournalId(e.target.value),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-mono font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select Timestamp Reference Name --"), journalEntries.map(j => /*#__PURE__*/React.createElement("option", {
    key: j.id,
    value: j.id
  }, j.afterReferenceName, " (", j.category, " - ", j.room, "/", j.area, " - ", j.status, ")")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-slate-700 mb-1"
  }, "2. Upload 'After' Photo to Complete Pair"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    disabled: !selectedPendingJournalId,
    onChange: handleAttachAfterPhotoByTimestampRef,
    className: "w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-600 file:text-white file:font-extrabold"
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#0B1F3A]"
  }, "Step 1 - Batch Room & Area Setup (Every Photo Requires a Room, Including 'Other')"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Set the Room & Area you are working (e.g., IBL / IBL 5), optionally tag the Area on the Popup Map, then upload your photos and assign Equipment per photo.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, !equipmentCacheLoaded ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: loadingEquipment,
    onClick: () => ensureEquipmentLoaded(false),
    className: "px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm"
  }, loadingEquipment ? 'Loading Equipment GUIDs...' : 'Load Equipment GUID Cache') : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold"
  }, "Equipment Cache Active (", assets.length, " GUIDs Cached)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: loadingEquipment,
    onClick: () => ensureEquipmentLoaded(true),
    className: "px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold"
  }, loadingEquipment ? 'Refreshing...' : 'Refresh Cache')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-extrabold text-slate-700 mb-1"
  }, "Submission Tag Category"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-1.5"
  }, PHOTO_CATEGORIES.map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    type: "button",
    onClick: () => setPhotoCategory(cat),
    className: `py-2 px-2 rounded-xl text-[11px] font-extrabold border transition ${photoCategory === cat ? 'bg-[#E4002B] text-white border-[#E4002B] shadow' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`
  }, cat)))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-extrabold text-slate-700 mb-1"
  }, "Room (Mandatory - Includes 'Other')"), /*#__PURE__*/React.createElement("select", {
    value: photoRoom || 'Other',
    onChange: e => setPhotoRoom(e.target.value || 'Other'),
    className: "w-full rounded-xl border-2 border-[#0B1F3A] px-3 py-2 text-xs font-extrabold text-slate-900"
  }, roomOptionsWithOther.map(r => /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-extrabold text-slate-700 mb-1"
  }, "Working Area (e.g., IBL 5 / Line 1)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: photoArea,
    onChange: e => setPhotoArea(e.target.value),
    placeholder: "e.g. IBL 5 / Spiral / Packaging",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold"
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleOpenMapPopupForBatchOrPhoto(null),
    className: "w-full py-2 px-3 rounded-xl bg-[#0B1F3A] hover:bg-slate-800 text-white text-xs font-extrabold shadow flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(IconMapPin, null), /*#__PURE__*/React.createElement("span", null, "Assign Area on Map (", mapPinX, "%, ", mapPinY, "%)")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: photoDescription,
    onChange: e => setPhotoDescription(e.target.value),
    placeholder: "Batch Description / Notes for Journal...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: photoSharepointLink,
    onChange: e => setPhotoSharepointLink(e.target.value),
    placeholder: "Optional SharePoint Folder / File Link...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-4 flex items-center gap-2"
  }, pendingBeforeFiles.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleApplyBatchRoomAreaToAllQueued,
    className: "px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-extrabold whitespace-nowrap"
  }, "Apply Room/Area to All (", pendingBeforeFiles.length, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold text-slate-900 block"
  }, "Step 2 - Select BEFORE Photo(s) [REQUIRED] (", uploadMode === 'bulk' ? 'Multiple Photos Allowed' : 'Single Photo', ")"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500"
  }, "Each uploaded photo inherits Room \"", photoRoom || 'Other', "\" and Area \"", photoArea || 'General', "\" and lets you assign Equipment from that Room/Area below.")), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    multiple: uploadMode === 'bulk',
    onChange: handleSelectBeforeFiles,
    className: "text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#E4002B] file:text-white file:font-extrabold"
  }))), pendingBeforeFiles.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900"
  }, "Step 3 - Edit Uploaded Photo Details & Assign Equipment from Room / Area (", pendingBeforeFiles.length, " Queued)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Equipment loads on demand and keeps GUIDs cached in memory across all photos until refreshed.")), !equipmentCacheLoaded && /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: loadingEquipment,
    onClick: () => ensureEquipmentLoaded(false),
    className: "px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold"
  }, loadingEquipment ? 'Loading Equipment...' : 'Load Equipment for Room/Area')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, pendingBeforeFiles.map((item, idx) => {
    const canonStr = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const itemRoomC = canonStr(item.room);
    const itemAreaC = canonStr(item.area);
    const matchingEquip = assets.filter(a => {
      const aRoomC = canonStr(a.room);
      const aAreaC = canonStr(a.area);
      const rMatch = !itemRoomC || itemRoomC === 'other' || aRoomC.includes(itemRoomC) || itemRoomC.includes(aRoomC) || aAreaC.includes(itemRoomC);
      const aMatch = !itemAreaC || aAreaC.includes(itemAreaC) || itemAreaC.includes(aAreaC) || aRoomC.includes(itemAreaC);
      return rMatch && aMatch;
    });
    const roomOnlyEquip = assets.filter(a => {
      const aRoomC = canonStr(a.room);
      const aAreaC = canonStr(a.area);
      return !itemRoomC || itemRoomC === 'other' || aRoomC.includes(itemRoomC) || itemRoomC.includes(aRoomC) || aAreaC.includes(itemRoomC);
    });
    const equipList = matchingEquip.length > 0 ? matchingEquip : roomOnlyEquip.length > 0 ? roomOnlyEquip : assets;
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/60 space-y-3 text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 flex-1"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.dataUrl,
      alt: "Before",
      className: "w-16 h-14 object-cover rounded-xl border border-slate-300 flex-shrink-0"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: item.customTitle,
      onChange: e => {
        const val = e.target.value;
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          customTitle: val
        } : p));
      },
      className: "w-full font-extrabold text-slate-900 bg-white rounded-lg border border-slate-300 px-2.5 py-1"
    }), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-slate-500 mt-0.5 truncate"
    }, "File: ", item.file.name))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setPendingBeforeFiles(prev => prev.filter((_, i) => i !== idx)),
      className: "px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-[11px]"
    }, "Remove")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-2"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] font-extrabold uppercase text-slate-600 mb-0.5"
    }, "Room (Required)"), /*#__PURE__*/React.createElement("select", {
      value: item.room || 'Other',
      onChange: e => {
        const newRoom = e.target.value || 'Other';
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          room: newRoom,
          afterRefName: buildDefaultAfterRefName(photoCategory, newRoom, p.area || 'AREA', idx + 1)
        } : p));
      },
      className: "w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-bold"
    }, roomOptionsWithOther.map(r => /*#__PURE__*/React.createElement("option", {
      key: r,
      value: r
    }, r)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] font-extrabold uppercase text-slate-600 mb-0.5"
    }, "Area"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: item.area,
      onChange: e => {
        const newArea = e.target.value;
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          area: newArea,
          afterRefName: buildDefaultAfterRefName(photoCategory, p.room || 'Other', newArea || 'AREA', idx + 1)
        } : p));
      },
      placeholder: "e.g. IBL 5",
      className: "w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-semibold"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] font-extrabold uppercase text-slate-600 mb-0.5"
    }, "Map Location Popup"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleOpenMapPopupForBatchOrPhoto(idx),
      className: "w-full py-1.5 px-2 rounded-lg bg-[#0B1F3A] hover:bg-slate-800 text-white font-extrabold text-[11px] flex items-center justify-center gap-1"
    }, /*#__PURE__*/React.createElement(IconMapPin, null), /*#__PURE__*/React.createElement("span", null, "Map (", item.mapX, "%, ", item.mapY, "%)")))), /*#__PURE__*/React.createElement("div", {
      className: "bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text-[10px] font-extrabold uppercase text-slate-700"
    }, "Assign Equipment (", item.room || 'Other', " ", item.area ? `- ${item.area}` : '', ")"), item.equipmentId && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold"
    }, "Cached GUID: ", item.equipmentId.slice(0, 8), "...")), !equipmentCacheLoaded ? /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: loadingEquipment,
      onClick: () => ensureEquipmentLoaded(false),
      className: "px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px]"
    }, loadingEquipment ? 'Loading Equipment GUIDs...' : `Load Equipment for ${item.room || 'Room'}/${item.area || 'Area'}`), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: item.equipmentName,
      onChange: e => {
        const val = e.target.value;
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          equipmentName: val
        } : p));
      },
      placeholder: "Or type equipment name...",
      className: "flex-1 rounded-lg border border-slate-300 px-2 py-1"
    })) : /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 gap-2"
    }, /*#__PURE__*/React.createElement("select", {
      value: item.equipmentId,
      onChange: e => {
        const eqId = e.target.value;
        const found = assets.find(a => a.id === eqId);
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          equipmentId: eqId,
          equipmentName: found ? found.name : p.equipmentName,
          room: found?.room || p.room || 'Other',
          area: found?.area || p.area
        } : p));
      },
      className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 font-bold"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "-- Select Cached Equipment (", equipList.length, " in ", item.room || 'Room', ") --"), equipList.slice(0, 150).map(eq => /*#__PURE__*/React.createElement("option", {
      key: eq.id,
      value: eq.id
    }, eq.name, " (", eq.area, ") [", eq.id.slice(0, 6), "]"))), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: item.equipmentName,
      onChange: e => {
        const val = e.target.value;
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          equipmentName: val
        } : p));
      },
      placeholder: "Custom Equipment Label...",
      className: "w-full rounded-lg border border-slate-300 px-2 py-1.5"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 space-y-1"
    }, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] font-extrabold text-amber-900 uppercase"
    }, "AFTER Timestamp Default Reference Name:"), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: item.afterRefName,
      onChange: e => {
        const val = e.target.value;
        setPendingBeforeFiles(prev => prev.map((p, i) => i === idx ? {
          ...p,
          afterRefName: val
        } : p));
      },
      className: "flex-1 rounded border border-amber-300 bg-white px-2 py-1 text-[11px] font-mono font-bold text-amber-950"
    }), /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      onChange: ev => handleAttachOptionalAfterToPendingItem(idx, ev),
      className: "text-[10px] w-44"
    }), item.afterDataUrl && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold"
    }, "After Attached"))));
  })), /*#__PURE__*/React.createElement("button", {
    disabled: uploadingPhotos || pendingBeforeFiles.length === 0,
    onClick: handleSubmitBeforeAndAfterBatch,
    className: "w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-extrabold shadow"
  }, uploadingPhotos ? 'Uploading Batch to Facility Observations & Photo Journal...' : `Submit ${pendingBeforeFiles.length} ${photoCategory} Photo(s) to Map & Journal`)))), activeTab === 'journal' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#E4002B]"
  }, "Tab 4 - Linked Supervisor Photo Journal DataTable"), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900"
  }, "Before & After Photo Journal - Full Edit Capability for All Columns & Links")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: journalSearch,
    onChange: e => setJournalSearch(e.target.value),
    placeholder: "Search title, After timestamp ref, room, area, link...",
    className: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs w-64"
  }), /*#__PURE__*/React.createElement("select", {
    value: journalCategoryFilter,
    onChange: e => setJournalCategoryFilter(e.target.value),
    className: "rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "ALL"
  }, "All Categories"), PHOTO_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("select", {
    value: journalStatusFilter,
    onChange: e => setJournalStatusFilter(e.target.value),
    className: "rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "ALL"
  }, "All Statuses"), /*#__PURE__*/React.createElement("option", {
    value: "Pending After Photo"
  }, "Pending After Photo"), /*#__PURE__*/React.createElement("option", {
    value: "Before & After Complete"
  }, "Before & After Complete"), /*#__PURE__*/React.createElement("option", {
    value: "Verified"
  }, "Verified")), !batchEditJournalMode ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setBatchEditJournalMode(true),
    className: "px-3.5 py-1.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-extrabold"
  }, "Batch Edit Mode (All Columns)") : /*#__PURE__*/React.createElement("button", {
    onClick: handleSaveAllBatchJournalEdits,
    className: "px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold"
  }, "Save All Table Edits"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse text-xs"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "bg-slate-900 text-white uppercase text-[11px]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "Title & Category"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "Room / Area / Equip"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "Map Coords"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "Before Photo (Req)"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "After Timestamp Reference & Photo"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "Description & Notify"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "SharePoint / External Links"), /*#__PURE__*/React.createElement("th", {
    className: "p-3"
  }, "Status & Actions"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, filteredJournalEntries.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    className: "p-8 text-center text-slate-500 font-semibold"
  }, "No Photo Journal entries match the current filter. Upload photos in Tab 3 to populate.")) : filteredJournalEntries.map(row => {
    const isRowEditing = batchEditJournalMode || editingJournalId === row.id;
    const d = editingJournalId === row.id && editingJournalDraft ? editingJournalDraft : row;
    const updateDraft = (field, val) => {
      if (editingJournalId === row.id && editingJournalDraft) {
        setEditingJournalDraft({
          ...editingJournalDraft,
          [field]: val
        });
      } else {
        handleInlineJournalChange(row.id, field, val);
      }
    };
    return /*#__PURE__*/React.createElement("tr", {
      key: row.id,
      className: "hover:bg-slate-50/80 align-top"
    }, /*#__PURE__*/React.createElement("td", {
      className: "p-3 space-y-1.5 min-w-[180px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.title,
      onChange: e => updateDraft('title', e.target.value),
      className: "w-full rounded border border-slate-300 px-2 py-1 font-bold"
    }), /*#__PURE__*/React.createElement("select", {
      value: d.category,
      onChange: e => updateDraft('category', e.target.value),
      className: "w-full rounded border border-slate-300 px-2 py-1 font-bold"
    }, PHOTO_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
      key: c,
      value: c
    }, c)))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "font-extrabold text-slate-900"
    }, row.title), /*#__PURE__*/React.createElement("span", {
      className: "inline-block px-2 py-0.5 rounded bg-[#0B1F3A] text-white text-[10px] font-bold"
    }, row.category), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-slate-500"
    }, "Shift ", row.shift, " - ", row.supervisorName))), /*#__PURE__*/React.createElement("td", {
      className: "p-3 space-y-1 min-w-[160px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.room,
      onChange: e => updateDraft('room', e.target.value),
      placeholder: "Room",
      className: "w-full rounded border border-slate-300 px-2 py-1"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.area,
      onChange: e => updateDraft('area', e.target.value),
      placeholder: "Area",
      className: "w-full rounded border border-slate-300 px-2 py-1"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.equipment,
      onChange: e => updateDraft('equipment', e.target.value),
      placeholder: "Equipment",
      className: "w-full rounded border border-slate-300 px-2 py-1"
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-slate-800"
    }, "Room: ", row.room), /*#__PURE__*/React.createElement("div", {
      className: "text-slate-700"
    }, "Area: ", row.area), row.equipment && /*#__PURE__*/React.createElement("div", {
      className: "text-slate-500"
    }, "Equip: ", row.equipment))), /*#__PURE__*/React.createElement("td", {
      className: "p-3 min-w-[120px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: d.mapX,
      onChange: e => updateDraft('mapX', Number(e.target.value)),
      className: "rounded border border-slate-300 px-1.5 py-1",
      title: "Map X%"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: d.mapY,
      onChange: e => updateDraft('mapY', Number(e.target.value)),
      className: "rounded border border-slate-300 px-1.5 py-1",
      title: "Map Y%"
    })) : /*#__PURE__*/React.createElement("div", {
      className: "font-mono text-[11px]"
    }, /*#__PURE__*/React.createElement("div", null, "X: ", row.mapX, "%"), /*#__PURE__*/React.createElement("div", null, "Y: ", row.mapY, "%"), (row.boxWidth > 0 || row.boxHeight > 0) && /*#__PURE__*/React.createElement("div", {
      className: "text-slate-500"
    }, "Box: ", row.boxWidth, "x", row.boxHeight, "%"))), /*#__PURE__*/React.createElement("td", {
      className: "p-3 min-w-[140px]"
    }, (d.beforePhotoDataUrl || d.beforePhotoUrl) && /*#__PURE__*/React.createElement("img", {
      src: d.beforePhotoDataUrl || d.beforePhotoUrl,
      alt: "Before",
      className: "w-20 h-14 object-cover rounded border border-slate-300 mb-1"
    }), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-slate-500 truncate max-w-[130px]"
    }, d.beforeFileName), isRowEditing && /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.beforePhotoUrl,
      onChange: e => updateDraft('beforePhotoUrl', e.target.value),
      placeholder: "Before Image URL",
      className: "w-full mt-1 rounded border border-slate-300 px-1.5 py-0.5 text-[10px]"
    })), /*#__PURE__*/React.createElement("td", {
      className: "p-3 space-y-1.5 min-w-[220px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.afterReferenceName,
      onChange: e => updateDraft('afterReferenceName', e.target.value),
      className: "w-full rounded border border-amber-400 bg-amber-50 px-2 py-1 font-mono text-[11px] font-bold"
    }) : /*#__PURE__*/React.createElement("div", {
      className: "px-2 py-1 rounded bg-amber-50 border border-amber-300 font-mono text-[11px] font-bold text-amber-950"
    }, row.afterReferenceName), d.afterPhotoDataUrl || d.afterPhotoUrl ? /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("img", {
      src: d.afterPhotoDataUrl || d.afterPhotoUrl,
      alt: "After",
      className: "w-20 h-14 object-cover rounded border border-emerald-400"
    }), /*#__PURE__*/React.createElement("span", {
      className: "px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold"
    }, "After Complete")) : /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-amber-700 font-semibold"
    }, "Awaiting After Photo"), /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      onChange: async ev => {
        const f = ev.target.files?.[0];
        if (!f) return;
        const comp = await compressImageFileToDataUrl(f, 1280, 0.8);
        const updated = {
          ...d,
          afterPhotoDataUrl: comp.dataUrl,
          afterFileName: f.name,
          afterUploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'Before & After Complete'
        };
        await handleSaveJournalRowEdit(updated);
      },
      className: "text-[10px] w-full"
    })), /*#__PURE__*/React.createElement("td", {
      className: "p-3 space-y-1 min-w-[180px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      rows: 2,
      value: d.description,
      onChange: e => updateDraft('description', e.target.value),
      className: "w-full rounded border border-slate-300 px-2 py-1"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.whoToNotify,
      onChange: e => updateDraft('whoToNotify', e.target.value),
      placeholder: "Who to notify",
      className: "w-full rounded border border-slate-300 px-2 py-1"
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "text-slate-800"
    }, row.description), row.whoToNotify && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-slate-500"
    }, "Notify: ", row.whoToNotify))), /*#__PURE__*/React.createElement("td", {
      className: "p-3 space-y-1.5 min-w-[180px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.sharepointLink,
      onChange: e => updateDraft('sharepointLink', e.target.value),
      placeholder: "SharePoint Link URL...",
      className: "w-full rounded border border-slate-300 px-2 py-1"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: d.externalLink,
      onChange: e => updateDraft('externalLink', e.target.value),
      placeholder: "Secondary Reference Link...",
      className: "w-full rounded border border-slate-300 px-2 py-1"
    })) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, row.sharepointLink ? /*#__PURE__*/React.createElement("a", {
      href: row.sharepointLink,
      target: "_blank",
      rel: "noreferrer",
      className: "inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:underline"
    }, "Open SharePoint Link") : /*#__PURE__*/React.createElement("span", {
      className: "text-slate-400 italic block"
    }, "No SP link"), row.externalLink && /*#__PURE__*/React.createElement("a", {
      href: row.externalLink,
      target: "_blank",
      rel: "noreferrer",
      className: "inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold hover:underline"
    }, "Open External Link"))), /*#__PURE__*/React.createElement("td", {
      className: "p-3 space-y-2 min-w-[150px]"
    }, isRowEditing ? /*#__PURE__*/React.createElement("select", {
      value: d.status,
      onChange: e => updateDraft('status', e.target.value),
      className: "w-full rounded border border-slate-300 px-2 py-1 font-bold"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Pending After Photo"
    }, "Pending After Photo"), /*#__PURE__*/React.createElement("option", {
      value: "Before & After Complete"
    }, "Before & After Complete"), /*#__PURE__*/React.createElement("option", {
      value: "Verified"
    }, "Verified")) : /*#__PURE__*/React.createElement("span", {
      className: `inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${row.status === 'Before & After Complete' || row.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`
    }, row.status), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, editingJournalId === row.id ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: () => editingJournalDraft && handleSaveJournalRowEdit(editingJournalDraft),
      className: "px-2.5 py-1 rounded bg-emerald-600 text-white font-bold"
    }, "Save Row"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setEditingJournalId(null);
        setEditingJournalDraft(null);
      },
      className: "px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold"
    }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setEditingJournalId(row.id);
        setEditingJournalDraft({
          ...row
        });
      },
      className: "px-2.5 py-1 rounded bg-[#0B1F3A] text-white font-bold"
    }, "Edit All Fields"))));
  }))))), activeTab === 'cleanplan' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#0072CE]"
  }, "Clean Plan Adjuster - Sourced from Live MSS Rooms & Areas (Double-Click Any Row for Popup)"), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#00468B] border border-[#0072CE]/30 text-[10px] font-extrabold"
  }, "MSS Areas Loaded: ", mssAreaLookup.length)), /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900"
  }, "Daily & Weekly Cleans by MSS Room, MSS Area, Line, Type, Production Start/Stop & Clean Window")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("select", {
    value: cleanPlanLineFilter,
    onChange: e => setCleanPlanLineFilter(e.target.value),
    className: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "ALL"
  }, "All MSS Rooms & Areas"), Array.from(new Set([...mssAreaLookup.map(m => m.room), ...cleanPlanRows.map(r => r.room)].filter(Boolean))).map(rm => /*#__PURE__*/React.createElement("option", {
    key: rm,
    value: rm
  }, "MSS Room: ", rm))), /*#__PURE__*/React.createElement("label", {
    className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: onlyMyShiftCleanPlan,
    onChange: e => setOnlyMyShiftCleanPlan(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Only Shift ", activeShift)), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleOpenCleanPlanAdjustModal({
      id: '',
      planKey: `CP_SHIFT_${activeShift}_${todayIso()}`,
      rowType: 'window',
      lineKey: 'IBL 5',
      room: mssAreaLookup[0]?.room || 'Bakery',
      area: mssAreaLookup[0]?.area || 'IBL5',
      line: 'IBL 5',
      prodStart: '06:00',
      prodStop: '14:00',
      start: '14:00',
      end: '18:00',
      cleanKind: 'Wet Clean',
      minutes: 240,
      status: 'Scheduled',
      reason: '',
      notes: 'Full sanitation clean window following production run.',
      shiftCrew: activeShift,
      dayDate: todayIso(),
      details: {}
    }),
    className: "px-3.5 py-2 rounded-xl bg-[#0072CE] hover:bg-[#00468B] text-white text-xs font-extrabold shadow"
  }, "+ Add / Adjust Clean Window"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-2 pb-2 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500"
  }, /*#__PURE__*/React.createElement("span", null, "Showing ", filteredCleanPlanRows.length, " Clean Window(s) Sourced from MSS Room / Area - Double-Click Any Row to Edit"), /*#__PURE__*/React.createElement("span", {
    className: "text-[#0072CE]"
  }, "Double-Click Row = Open Edit Popup")), filteredCleanPlanRows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center text-slate-500 text-xs font-bold"
  }, "No Clean Plan windows match the current filter. Click \"+ Add / Adjust Clean Window\" to create one.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, filteredCleanPlanRows.slice(0, 60).map(win => {
    const isMyShift = win.shiftCrew === activeShift;
    return /*#__PURE__*/React.createElement("div", {
      key: win.id || win.planKey,
      onDoubleClick: () => handleOpenCleanPlanAdjustModal(win),
      title: "Double-click to open longer-form details and edit popup",
      className: `p-3.5 rounded-2xl border-2 transition cursor-pointer select-none flex flex-wrap items-center justify-between gap-2.5 ${isMyShift ? 'bg-[#E6F1FB]/50 hover:bg-[#E6F1FB] border-[#0072CE]/40' : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00468B] text-white text-xs font-extrabold shadow-sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-[#FFB81C] font-bold"
    }, "Room:"), /*#__PURE__*/React.createElement("span", null, win.room || 'Bakery')), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0072CE] text-white text-xs font-extrabold shadow-sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-sky-100 font-bold"
    }, "Area:"), /*#__PURE__*/React.createElement("span", null, win.area || 'IBL5')), win.line && /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-white text-xs font-extrabold shadow-sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-slate-300 font-bold"
    }, "Line:"), /*#__PURE__*/React.createElement("span", null, win.line)), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E4002B] text-white text-xs font-extrabold shadow-sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-rose-100 font-bold"
    }, "Type:"), /*#__PURE__*/React.createElement("span", null, win.cleanKind || 'Wet Clean')), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6E0] text-amber-950 border border-[#FFB81C] text-xs font-extrabold"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-amber-800 font-bold"
    }, "Prod Start/Stop:"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, win.prodStart || '06:00', " - ", win.prodStop || '14:00')), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-extrabold"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase text-emerald-800 font-bold"
    }, "Clean Window:"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, win.start || '14:00', " - ", win.end || '18:00', " (", win.minutes, "m)")), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-extrabold"
    }, /*#__PURE__*/React.createElement("span", null, "Shift ", win.shiftCrew), /*#__PURE__*/React.createElement("span", null, "-"), /*#__PURE__*/React.createElement("span", null, win.status))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, win.reason && /*#__PURE__*/React.createElement("span", {
      className: "px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-[11px] font-bold max-w-[260px] truncate"
    }, "Reason: ", win.reason), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleOpenCleanPlanAdjustModal(win),
      className: "px-3 py-1 rounded-full bg-white hover:bg-[#00468B] hover:text-white text-[#00468B] border border-[#0072CE]/40 text-[11px] font-extrabold transition"
    }, "Details / Edit Popup")));
  })))), activeTab === 'employeequery' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-row gap-4 items-start"
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 220,
      minWidth: 220
    },
    className: "w-[220px] shrink-0 bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex flex-col max-h-[760px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-extrabold uppercase tracking-wider text-[#00468B] px-1 pb-2 border-b border-slate-200 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Shift ", activeShift, " Crew"), /*#__PURE__*/React.createElement("span", {
    className: "px-1.5 py-0.5 rounded-full bg-[#E6F1FB] text-[#0072CE] text-[10px]"
  }, shiftEmployees.length)), /*#__PURE__*/React.createElement("div", {
    className: "py-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: empSearchQuery,
    onChange: e => setEmpSearchQuery(e.target.value),
    placeholder: "Search name...",
    className: "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#0072CE]"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto space-y-1 pr-0.5"
  }, shiftEmployees.filter(e => !empSearchQuery.trim() || e.name.toLowerCase().includes(empSearchQuery.toLowerCase())).map(emp => {
    const isSelected = selectedProfileEmployee?.id === emp.id;
    return /*#__PURE__*/React.createElement("button", {
      key: emp.id,
      type: "button",
      onClick: () => setSelectedProfileEmpId(emp.id),
      className: `w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold truncate transition ${isSelected ? 'bg-[#0072CE] text-white shadow-sm' : 'text-slate-800 hover:bg-[#E6F1FB]/60'}`,
      title: emp.name
    }, emp.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 space-y-4 w-full"
  }, selectedProfileEmployee ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-2xl bg-[#00468B] text-white flex items-center justify-center font-extrabold text-base shadow-sm"
  }, selectedProfileEmployee.name.slice(0, 2).toUpperCase()), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900"
  }, selectedProfileEmployee.name), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#00468B] text-[11px] font-extrabold"
  }, "Shift ", selectedProfileEmployee.shift, " - ", selectedProfileEmployee.role), selectedProfileEmployee.inTraining && /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-[#FFF6E0] text-amber-900 border border-[#FFB81C] text-[10px] font-extrabold"
  }, "In Training", selectedProfileEmployee.trainingArea ? `: ${selectedProfileEmployee.trainingArea}` : '')), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 mt-0.5"
  }, "Supervised by ", /*#__PURE__*/React.createElement("strong", null, msIdentity.matchedEmployeeName), " - Queried from", ' ', /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, "craa5___1_m_employeenotes + craa5___1_g_notes + craa5___1_a_employees")))), /*#__PURE__*/React.createElement("div", {
    className: "text-right text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-extrabold text-[#0072CE]"
  }, selectedEmpProfileMetrics.notesForEmployee.length, " Dataverse Profile Note(s)"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-slate-500 font-mono"
  }, "Emp ID: ", selectedProfileEmployee.id.slice(0, 14)))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-[#00468B] uppercase tracking-wider text-[11px]"
  }, "Leadership Training Gate:"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleToggleEmployeeInTraining(selectedProfileEmployee, !selectedProfileEmployee.inTraining, selectedProfileEmployee.trainingArea || 'IBL4'),
    className: `px-3 py-1.5 rounded-lg font-extrabold border transition ${selectedProfileEmployee.inTraining ? 'bg-[#FFB81C] text-slate-950 border-amber-500 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'}`
  }, selectedProfileEmployee.inTraining ? 'ACTIVE IN TRAINING (Click to Clear)' : 'Mark In Training (Enable Portal 2 Badge Gate)'), /*#__PURE__*/React.createElement("select", {
    value: selectedProfileEmployee.trainingArea || 'IBL4',
    onChange: e => handleToggleEmployeeInTraining(selectedProfileEmployee, true, e.target.value),
    className: "rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-[#00468B] bg-slate-50",
    "aria-label": "Training Area"
  }, ['IBL4', 'IBL5', 'waterjet', 'highspeed', 'custard', 'breading', 'dough room', 'kettles', 'chemical'].map(ar => /*#__PURE__*/React.createElement("option", {
    key: ar,
    value: ar
  }, "Training Area: ", ar))), selectedProfileEmployee.badge && /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] font-bold text-slate-700"
  }, "Badge: ", selectedProfileEmployee.badge)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-1 min-w-[260px] max-w-md"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    defaultValue: selectedProfileEmployee.remarks || '',
    key: selectedProfileEmployee.id + '::' + (selectedProfileEmployee.remarks || ''),
    placeholder: "Set employee roster remark (craa5_remarks)...",
    onKeyDown: e => {
      if (e.key === 'Enter') {
        handleSaveEmployeeRosterRemark(selectedProfileEmployee, e.target.value);
      }
    },
    id: "sup-emp-remark-input",
    className: "flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const el = document.getElementById('sup-emp-remark-input');
      if (el) handleSaveEmployeeRosterRemark(selectedProfileEmployee, el.value);
    },
    className: "px-3 py-1.5 rounded-lg bg-[#00468B] text-white font-extrabold text-xs"
  }, "Save Remark"))), selectedProfileEmployee.remarks && /*#__PURE__*/React.createElement("div", {
    className: "bg-[#FFF6E0] border border-[#FFB81C] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded bg-[#00468B] text-white text-[10px] font-extrabold uppercase mr-2"
  }, "Roster Remark (", selectedProfileEmployee.remarkCategory || 'General', ")"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, selectedProfileEmployee.remarks)), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-amber-900"
  }, "Source: craa5___1_a_employees.craa5_remarks")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-500 uppercase"
  }, "Days Worked"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-extrabold text-slate-900 mt-0.5"
  }, selectedEmpProfileMetrics.daysWorked)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-500 uppercase"
  }, "Est. Hours"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-extrabold text-slate-900 mt-0.5"
  }, selectedEmpProfileMetrics.hoursWorked, " hrs")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-500 uppercase"
  }, "Strongest Area"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-extrabold text-[#0072CE] mt-1 truncate"
  }, selectedEmpProfileMetrics.strongestArea)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-500 uppercase"
  }, "Primary Lead"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-extrabold text-slate-900 mt-1 truncate"
  }, selectedEmpProfileMetrics.mostOftenLead)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-500 uppercase"
  }, "Equip Signoffs"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-extrabold text-emerald-700 mt-0.5"
  }, selectedEmpProfileMetrics.equipmentHistory.length)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-500 uppercase"
  }, "Dataverse Notes"), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-extrabold text-[#00468B] mt-0.5"
  }, selectedEmpProfileMetrics.notesForEmployee.length))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-extrabold uppercase text-[#00468B]"
  }, "Area Experience Breakdown"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "shiftboards + archives + logs")), selectedEmpProfileMetrics.areaCounts.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 py-3"
  }, "No historical area assignments found yet for ", selectedProfileEmployee.name, ".") : selectedEmpProfileMetrics.areaCounts.map(ac => /*#__PURE__*/React.createElement("div", {
    key: ac.area,
    className: "flex items-center justify-between text-xs py-1.5 border-b border-slate-100"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-800"
  }, ac.area), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full bg-[#E6F1FB] text-[#00468B] font-extrabold text-[11px]"
  }, ac.count, " shifts/logs")))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-extrabold uppercase text-[#00468B]"
  }, "Recent Equipment & Task History"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "log_s + gassignments + passoffs")), selectedEmpProfileMetrics.equipmentHistory.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 py-3"
  }, "No recent individual equipment sign-offs recorded under this employee.") : selectedEmpProfileMetrics.equipmentHistory.slice(0, 7).map((eq, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center justify-between text-xs py-1.5 border-b border-slate-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "truncate pr-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-800"
  }, eq.equipment), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 ml-1"
  }, "(", eq.room, " - ", eq.area, ")")), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 shrink-0 font-mono"
  }, eq.date))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-sm font-extrabold text-slate-900"
  }, "Dataverse Employee Notes, Coaching & Frozen Performance Snapshots"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500"
  }, "Reads & writes directly to ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "craa5___1_m_employeenotes"), ",", ' ', /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "craa5___1_g_notes"), ", and", ' ', /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "craa5___1_a_employees.craa5_remarks"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1"
  }, ['All', 'Pro', 'Con', 'Comment', 'Note', 'Snapshot', 'Roster Remark'].map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    type: "button",
    onClick: () => setEmpNoteCategoryFilter(cat),
    className: `px-2.5 py-1 rounded-full text-[11px] font-extrabold transition ${empNoteCategoryFilter === cat ? 'bg-[#0072CE] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`
  }, cat)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
  }, /*#__PURE__*/React.createElement("select", {
    value: newEmpNoteType,
    onChange: e => setNewEmpNoteType(e.target.value),
    className: "sm:col-span-2 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-extrabold bg-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Pro"
  }, "Pro (+)"), /*#__PURE__*/React.createElement("option", {
    value: "Con"
  }, "Con (-)"), /*#__PURE__*/React.createElement("option", {
    value: "Comment"
  }, "Comment"), /*#__PURE__*/React.createElement("option", {
    value: "Note"
  }, "Coaching Note"), /*#__PURE__*/React.createElement("option", {
    value: "Snapshot"
  }, "Frozen Snapshot")), /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2 flex items-center gap-1.5 bg-white rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-600"
  }, "Rating:"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: -5,
    max: 5,
    value: newEmpNoteRating,
    onChange: e => setNewEmpNoteRating(Number(e.target.value)),
    className: "w-12 font-extrabold text-center text-slate-900 focus:outline-none"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newEmpNoteText,
    onChange: e => setNewEmpNoteText(e.target.value),
    placeholder: `Add ${newEmpNoteType} for ${selectedProfileEmployee.name} (saved to craa5___1_m_employeenotes & craa5___1_g_notes)...`,
    className: "sm:col-span-6 rounded-lg border border-slate-300 px-3 py-2 text-xs bg-white"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: savingEmpNote,
    onClick: handleAddEmployeeProfileNote,
    className: "sm:col-span-2 rounded-lg bg-[#0072CE] hover:bg-[#00468B] text-white text-xs font-extrabold py-2 shadow-sm transition"
  }, savingEmpNote ? 'Saving...' : '+ Save Note')), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 pt-1 max-h-[380px] overflow-y-auto"
  }, selectedEmpProfileMetrics.notesForEmployee.filter(n => empNoteCategoryFilter === 'All' || n.category === empNoteCategoryFilter).length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-6 text-center text-xs text-slate-400 font-semibold"
  }, "No Dataverse notes match \"", empNoteCategoryFilter, "\" for ", selectedProfileEmployee.name, ". Add a Pro, Con, Coaching Note, or Frozen Snapshot above.") : selectedEmpProfileMetrics.notesForEmployee.filter(n => empNoteCategoryFilter === 'All' || n.category === empNoteCategoryFilter).map(n => {
    const badgeStyle = n.category === 'Pro' ? 'bg-emerald-600 text-white' : n.category === 'Con' ? 'bg-[#E4002B] text-white' : n.category === 'Snapshot' ? 'bg-[#00468B] text-white' : n.category === 'Roster Remark' ? 'bg-[#FFB81C] text-slate-950' : 'bg-[#0072CE] text-white';
    const ratingNum = typeof n.rating === 'number' ? n.rating : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: n.id,
      className: "p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-start justify-between gap-2 text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-1 flex-1 min-w-[240px]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: `px-2 py-0.5 rounded text-[10px] font-extrabold ${badgeStyle}`
    }, n.category), ratingNum !== 0 && /*#__PURE__*/React.createElement("span", {
      className: `px-1.5 py-0.5 rounded text-[10px] font-extrabold ${ratingNum > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`
    }, "Rating: ", ratingNum > 0 ? `+${ratingNum}` : ratingNum), /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]"
    }, n.sourceTable)), /*#__PURE__*/React.createElement("div", {
      className: "font-semibold text-slate-900"
    }, n.note), n.snapshot && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-mono text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200"
    }, "Snapshot: ", typeof n.snapshot === 'string' ? n.snapshot : JSON.stringify(n.snapshot))), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-slate-500 text-right shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-slate-700"
    }, n.author), /*#__PURE__*/React.createElement("div", {
      className: "font-mono"
    }, n.date)));
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-8 text-center text-slate-500 text-sm font-bold"
  }, "Select an employee from Shift ", activeShift, " on the left to view their profile."))), activeTab === 'sharepoint' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#E4002B]"
  }, "Tab 8 - Supervisor Personal File Uploader & SharePoint Navigator"), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900"
  }, "SharePoint Folder Tree & Reusable File Vault (Shift ", activeShift, " - ", msIdentity.matchedEmployeeName, ")")), /*#__PURE__*/React.createElement("a", {
    href: sharepointBaseUrl,
    target: "_blank",
    rel: "noreferrer",
    className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow"
  }, "Open Linked SharePoint Library in New Tab")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 pt-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs font-bold text-slate-700"
  }, "Root SharePoint Supervisor Path:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: sharepointBaseUrl,
    onChange: e => setSharepointBaseUrl(e.target.value),
    className: "flex-1 min-w-[280px] rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      await saveHubConfigJson('SUPERVISOR_SHAREPOINT_HUB', {
        baseUrl: sharepointBaseUrl,
        folders: spFolders,
        files: personalFiles
      });
      notify('success', 'Saved Root SharePoint path for Supervisor Hub.');
    },
    className: "px-3.5 py-1.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold"
  }, "Save SharePoint Path"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-4 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconFolder, null), /*#__PURE__*/React.createElement("span", null, "Supervisor SharePoint Folders")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedFolderId('ALL'),
    className: `w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${selectedFolderId === 'ALL' ? 'bg-[#0B1F3A] text-white' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement("span", null, "All Supervisor Folders"), /*#__PURE__*/React.createElement("span", null, personalFiles.length, " files")), spFolders.map(fld => {
    const count = personalFiles.filter(f => f.folderId === fld.id).length;
    const isSel = selectedFolderId === fld.id;
    return /*#__PURE__*/React.createElement("div", {
      key: fld.id,
      onClick: () => setSelectedFolderId(fld.id),
      className: `p-2.5 rounded-xl border cursor-pointer transition text-xs ${isSel ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between font-bold"
    }, /*#__PURE__*/React.createElement("span", null, fld.name), /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-black/10 text-[10px]"
    }, fld.category, " (", count, ")")), /*#__PURE__*/React.createElement("div", {
      className: `text-[10px] font-mono truncate mt-1 ${isSel ? 'text-amber-300' : 'text-slate-500'}`
    }, fld.sharepointPath));
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-extrabold text-slate-800"
  }, "+ Create New Linked SharePoint Folder"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newFolderName,
    onChange: e => setNewFolderName(e.target.value),
    placeholder: "Folder Name (e.g. Shift A Audit Photos, LOTO Guides)...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
  }), /*#__PURE__*/React.createElement("select", {
    value: newFolderCategory,
    onChange: e => setNewFolderCategory(e.target.value),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Photos"
  }, "Photos Folder"), /*#__PURE__*/React.createElement("option", {
    value: "Notes"
  }, "Notes Folder"), /*#__PURE__*/React.createElement("option", {
    value: "Files"
  }, "Reusable Files Folder"), /*#__PURE__*/React.createElement("option", {
    value: "Custom"
  }, "Custom Supervisor Folder")), /*#__PURE__*/React.createElement("button", {
    onClick: handleCreateSharePointFolder,
    className: "w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold"
  }, "+ Create & Link Folder")))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-8 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900"
  }, "Upload Reusable File / Photo / Note & Name It Whatever You Want"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-bold text-slate-700 mb-1"
  }, "1. Custom File Name (Name It Whatever You Want)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: customFileNameInput,
    onChange: e => setCustomFileNameInput(e.target.value),
    placeholder: "e.g. Shift A Master Titration Cheat Sheet",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-bold text-slate-700 mb-1"
  }, "2. Select File from Device (Photo, PDF, Excel, Word, Note)"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    onChange: e => {
      const f = e.target.files?.[0] || null;
      setPendingUploadFile(f);
      if (f && !customFileNameInput.trim()) {
        setCustomFileNameInput(f.name.replace(/\.[^.]+$/, ''));
      }
    },
    className: "w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#0B1F3A] file:text-white file:font-bold"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("select", {
    value: customFileCategory,
    onChange: e => setCustomFileCategory(e.target.value),
    className: "rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Files"
  }, "Reusable File / SOP"), /*#__PURE__*/React.createElement("option", {
    value: "Photos"
  }, "Supervisor Photo"), /*#__PURE__*/React.createElement("option", {
    value: "Notes"
  }, "Supervisor Shift Note"), /*#__PURE__*/React.createElement("option", {
    value: "Custom"
  }, "Custom Resource")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: customFileSharepointLink,
    onChange: e => setCustomFileSharepointLink(e.target.value),
    placeholder: "Optional Direct SharePoint URL...",
    className: "rounded-xl border border-slate-300 px-3 py-2 text-xs"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: customFileDescription,
    onChange: e => setCustomFileDescription(e.target.value),
    placeholder: "Notes / Description...",
    className: "rounded-xl border border-slate-300 px-3 py-2 text-xs"
  })), /*#__PURE__*/React.createElement("button", {
    disabled: uploadingPersonalFile,
    onClick: handleUploadPersonalFile,
    className: "w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow"
  }, uploadingPersonalFile ? 'Uploading & Linking to SharePoint Vault...' : 'Upload & Save Reusable File with Custom Name')), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900"
  }, "Stored Reusable Supervisor Files (", personalFiles.length, ")"), personalFiles.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500 py-6 text-center"
  }, "No personal reusable files uploaded yet. Upload any file above and give it your preferred custom name.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, personalFiles.filter(f => selectedFolderId === 'ALL' || f.folderId === selectedFolderId).map(file => /*#__PURE__*/React.createElement("div", {
    key: file.id,
    className: "p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, renamingFileId === file.id ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: renamingFileText,
    onChange: e => setRenamingFileText(e.target.value),
    className: "rounded border border-slate-400 px-2 py-1 font-bold"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleRenamePersonalFile(file.id, renamingFileText),
    className: "px-2.5 py-1 rounded bg-emerald-600 text-white font-bold"
  }, "Save Name"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setRenamingFileId(null),
    className: "px-2 py-1 rounded bg-slate-200 text-slate-700 font-bold"
  }, "Cancel")) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm"
  }, file.customDisplayName), /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded bg-[#0B1F3A] text-white text-[10px] font-bold"
  }, file.category), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500"
  }, "Folder: ", file.folderName)), file.description && /*#__PURE__*/React.createElement("div", {
    className: "text-slate-700"
  }, file.description), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500 font-mono"
  }, "Original File: ", file.originalFileName, " - Updated: ", file.updatedAt, " - SharePoint: ", file.sharepointUrl)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setRenamingFileId(file.id);
      setRenamingFileText(file.customDisplayName);
    },
    className: "px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold"
  }, "Rename"), file.fileDataUrl && /*#__PURE__*/React.createElement("a", {
    href: file.fileDataUrl,
    download: file.customDisplayName,
    className: "px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold"
  }, "Download"), /*#__PURE__*/React.createElement("a", {
    href: file.sharepointUrl,
    target: "_blank",
    rel: "noreferrer",
    className: "px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold"
  }, "SharePoint Link")))))))))), showDowntimeModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-2 border-[#E4002B] space-y-4 max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#E4002B]"
  }, "Ganttly Down Time & Obstacle Logger"), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900"
  }, "Log Shift ", activeShift, " Down Time / Line Delay (", planDate, ")")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowDowntimeModal(false),
    className: "px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
  }, "Close")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Down Time Category"), /*#__PURE__*/React.createElement("select", {
    value: dtCategory,
    onChange: e => setDtCategory(e.target.value),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }, DOWNTIME_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Equipment / Asset (Optional)"), /*#__PURE__*/React.createElement("select", {
    value: dtEquipmentId,
    onChange: e => {
      const id = e.target.value;
      setDtEquipmentId(id);
      const found = assets.find(a => a.id === id);
      if (found) {
        setDtRoom(found.room);
        setDtArea(found.area);
      }
    },
    className: "w-full rounded-xl border border-slate-300 px-3 py-2"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Area Wide / Select Asset --"), assets.slice(0, 120).map(a => /*#__PURE__*/React.createElement("option", {
    key: a.id,
    value: a.id
  }, a.room, " - ", a.area, " - ", a.name)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Room"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: dtRoom,
    onChange: e => setDtRoom(e.target.value),
    placeholder: "e.g. IBL",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Area"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: dtArea,
    onChange: e => setDtArea(e.target.value),
    placeholder: "e.g. Line 1",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Start Time"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: dtStartTime,
    onChange: e => setDtStartTime(e.target.value),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Stop Time & Minutes Lost"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: dtStopTime,
    onChange: e => setDtStopTime(e.target.value),
    className: "flex-1 rounded-xl border border-slate-300 px-3 py-2 font-mono"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: dtMinutes,
    onChange: e => setDtMinutes(Number(e.target.value)),
    className: "w-24 rounded-xl border border-slate-300 px-3 py-2 font-bold",
    placeholder: "Mins"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Affected Shift ", activeShift, " Employees (", dtAffectedEmpIds.length, " selected)"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200"
  }, shiftEmployees.map(emp => {
    const sel = dtAffectedEmpIds.includes(emp.id);
    return /*#__PURE__*/React.createElement("button", {
      key: emp.id,
      type: "button",
      onClick: () => setDtAffectedEmpIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id]),
      className: `px-2.5 py-1 rounded-full text-[11px] font-bold border ${sel ? 'bg-[#E4002B] text-white border-[#E4002B]' : 'bg-white text-slate-700 border-slate-300'}`
    }, emp.name);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs space-y-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700"
  }, "Ganttly Setup & Recovery Checks"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, SETUP_CHECK_OPTIONS.map(chk => {
    const active = dtSetupChecks.includes(chk);
    return /*#__PURE__*/React.createElement("button", {
      key: chk,
      type: "button",
      onClick: () => setDtSetupChecks(prev => prev.includes(chk) ? prev.filter(c => c !== chk) : [...prev, chk]),
      className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border ${active ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-slate-50 text-slate-700 border-slate-300'}`
    }, chk);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Down Time Details / Root Cause Note"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: dtNote,
    onChange: e => setDtNote(e.target.value),
    placeholder: "Describe obstacle, maintenance ticket, or delay impact...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowDowntimeModal(false),
    className: "px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    disabled: savingDowntime,
    onClick: handleLogGanttlyDowntime,
    className: "px-5 py-2 rounded-xl bg-[#E4002B] hover:bg-rose-700 text-white text-xs font-extrabold shadow"
  }, savingDowntime ? 'Saving Down Time...' : 'Log Down Time to Ganttly & Shift Board')))), showIdentityModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900"
  }, "Microsoft ID Supervisor Profile Binding"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowIdentityModal(false),
    className: "text-xs font-bold text-slate-500"
  }, "Close")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-slate-100 text-xs space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500"
  }, "Detected Microsoft User:"), ' ', /*#__PURE__*/React.createElement("strong", null, msIdentity.fullName)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500"
  }, "Email:"), " ", /*#__PURE__*/React.createElement("strong", null, msIdentity.email)), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[11px] text-slate-600"
  }, "SystemUser ID: ", msIdentity.systemUserId)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Link Microsoft ID to Supervisor Record:"), /*#__PURE__*/React.createElement("select", {
    value: selectedSupervisorEmpId,
    onChange: e => setSelectedSupervisorEmpId(e.target.value),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select Supervisor Employee Record --"), employees.map(e => /*#__PURE__*/React.createElement("option", {
    key: e.id,
    value: e.id
  }, e.name, " (Shift ", e.shift, " - ", e.role, ")")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Assigned Shift Scope:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, SHIFT_CODES.map(sc => /*#__PURE__*/React.createElement("button", {
    key: sc,
    onClick: () => setActiveShift(sc),
    className: `py-2 rounded-xl font-extrabold border ${activeShift === sc ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-slate-50 text-slate-700 border-slate-300'}`
  }, "Shift ", sc))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleSaveMsIdSupervisorBinding(selectedSupervisorEmpId, activeShift),
    className: "w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow"
  }, "Save Microsoft ID Binding"))), adjustingWindow && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-2 border-[#0B1F3A] space-y-4 max-h-[92vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#E4002B]"
  }, "Clean Plan Longer-Form Details & Daily Timing Editor"), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900"
  }, adjRoom, " - ", adjArea, " ", adjLine ? `(${adjLine})` : '', " - Shift ", activeShift)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAdjustingWindow(null),
    className: "px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
  }, "Close Popup")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-[#0B1F3A] text-white font-extrabold"
  }, "Room: ", adjRoom), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-slate-800 text-white font-extrabold"
  }, "Area: ", adjArea), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-indigo-900 text-white font-extrabold"
  }, "Line: ", adjLine || 'N/A'), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-[#E4002B] text-white font-extrabold"
  }, "Type: ", adjCleanKind), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-mono font-bold"
  }, "Prod: ", adjProdStart, " - ", adjProdStop), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono font-bold"
  }, "Clean: ", adjStartTime, " - ", adjEndTime, " (", adjMinutes, "m)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "MSS Room"), /*#__PURE__*/React.createElement("select", {
    value: adjRoom,
    onChange: e => {
      const rm = e.target.value;
      setAdjRoom(rm);
      const matchingAreas = mssAreaLookup.filter(m => String(m.room || '').toLowerCase() === String(rm || '').toLowerCase());
      if (matchingAreas.length > 0 && !matchingAreas.some(m => m.area === adjArea)) {
        setAdjArea(matchingAreas[0].area);
      }
    },
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }, Array.from(new Set(['Bakery', 'Creme', 'Support', ...mssAreaLookup.map(m => m.room), ...roomOptionsWithOther].filter(Boolean))).map(r => /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r
  }, r)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "MSS Area"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5"
  }, /*#__PURE__*/React.createElement("select", {
    value: adjArea,
    onChange: e => setAdjArea(e.target.value),
    className: "w-1/2 rounded-xl border border-slate-300 px-2 py-2 font-bold"
  }, Array.from(new Set([adjArea, ...mssAreaLookup.filter(m => !adjRoom || String(m.room || '').toLowerCase() === String(adjRoom || '').toLowerCase()).map(m => m.area), ...mssAreaLookup.map(m => m.area)].filter(Boolean))).map(ar => /*#__PURE__*/React.createElement("option", {
    key: ar,
    value: ar
  }, ar))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: adjArea,
    onChange: e => setAdjArea(e.target.value),
    placeholder: "MSS Area...",
    className: "w-1/2 rounded-xl border border-slate-300 px-2.5 py-2 font-bold"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Line (If Applicable)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: adjLine,
    onChange: e => setAdjLine(e.target.value),
    placeholder: "e.g. IBL 5 / N/A",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Clean Type"), /*#__PURE__*/React.createElement("select", {
    value: adjCleanKind,
    onChange: e => setAdjCleanKind(e.target.value),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Wet Clean"
  }, "Wet Clean"), /*#__PURE__*/React.createElement("option", {
    value: "Dry Clean"
  }, "Dry Clean"), /*#__PURE__*/React.createElement("option", {
    value: "Allergen Clean"
  }, "Allergen Clean"), /*#__PURE__*/React.createElement("option", {
    value: "Deep Clean"
  }, "Deep Clean"), /*#__PURE__*/React.createElement("option", {
    value: "Sanitize Only"
  }, "Sanitize Only"), /*#__PURE__*/React.createElement("option", {
    value: "CIP / COP"
  }, "CIP / COP"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Clean Duration (Minutes)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: adjMinutes,
    onChange: e => setAdjMinutes(Number(e.target.value)),
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-amber-900 mb-1"
  }, "Production Start"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: adjProdStart,
    onChange: e => setAdjProdStart(e.target.value),
    placeholder: "06:00",
    className: "w-full rounded-xl border border-amber-300 bg-amber-50/50 px-3 py-2 font-mono font-bold"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-amber-900 mb-1"
  }, "Production Stop"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: adjProdStop,
    onChange: e => setAdjProdStop(e.target.value),
    placeholder: "14:00",
    className: "w-full rounded-xl border border-amber-300 bg-amber-50/50 px-3 py-2 font-mono font-bold"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-emerald-900 mb-1"
  }, "Clean Window Start"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: adjStartTime,
    onChange: e => setAdjStartTime(e.target.value),
    placeholder: "14:00",
    className: "w-full rounded-xl border border-emerald-300 bg-emerald-50/50 px-3 py-2 font-mono font-bold"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-emerald-900 mb-1"
  }, "Clean Window Stop"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: adjEndTime,
    onChange: e => setAdjEndTime(e.target.value),
    placeholder: "18:00",
    className: "w-full rounded-xl border border-emerald-300 bg-emerald-50/50 px-3 py-2 font-mono font-bold"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Longer-Form Clean Scope & Notes (SOP, Chemical Concentration, Crew Notes)"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: adjNotes,
    onChange: e => setAdjNotes(e.target.value),
    placeholder: "Longer-form scope details, chemical instructions, or line handoff notes...",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2"
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-extrabold text-[#E4002B] mb-1"
  }, "Reason for Clean Plan Adjustment [REQUIRED]"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: adjReason,
    onChange: e => setAdjReason(e.target.value),
    placeholder: "Required: Explain why this Clean Plan window or timing is being adjusted...",
    className: "w-full rounded-xl border-2 border-rose-300 px-3 py-2"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAdjustingWindow(null),
    className: "px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: savingCleanPlanAdjust,
    onClick: handleConfirmCleanPlanTimingAdjust,
    className: "px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow"
  }, savingCleanPlanAdjust ? 'Updating Clean Plan...' : 'Save Changes to Live Clean Plan')))), showBulkMapModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border-2 border-[#0B1F3A] space-y-4 max-h-[92vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-extrabold uppercase tracking-wider text-[#E4002B]"
  }, "Popup Facility Map Tagging (", mapModalTargetIdx !== null ? `Photo #${mapModalTargetIdx + 1}` : 'Batch Default Area', ")"), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900"
  }, "Click Map to Tag Area Coordinates & Assign Room / Area")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    value: selectedMapId,
    onChange: e => setSelectedMapId(e.target.value),
    className: "rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
  }, facilityMaps.length === 0 && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Midwest Plant Plant Map"), facilityMaps.map(m => /*#__PURE__*/React.createElement("option", {
    key: m.id,
    value: m.id
  }, m.facility))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMapTagMode(mapTagMode === 'pin' ? 'box' : 'pin'),
    className: "px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
  }, "Mode: ", mapTagMode === 'pin' ? 'Pin Point' : 'Area Box'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowBulkMapModal(false),
    className: "px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-extrabold text-slate-800"
  }, "Done"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Room (Includes 'Other')"), /*#__PURE__*/React.createElement("select", {
    value: mapModalTargetIdx !== null && pendingBeforeFiles[mapModalTargetIdx] ? pendingBeforeFiles[mapModalTargetIdx].room || 'Other' : photoRoom || 'Other',
    onChange: e => {
      const rm = e.target.value || 'Other';
      if (mapModalTargetIdx !== null) {
        setPendingBeforeFiles(prev => prev.map((item, idx) => idx === mapModalTargetIdx ? {
          ...item,
          room: rm
        } : item));
      } else {
        setPhotoRoom(rm);
      }
    },
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  }, roomOptionsWithOther.map(r => /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r
  }, r)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Area Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: mapModalTargetIdx !== null && pendingBeforeFiles[mapModalTargetIdx] ? pendingBeforeFiles[mapModalTargetIdx].area : photoArea,
    onChange: e => {
      const ar = e.target.value;
      if (mapModalTargetIdx !== null) {
        setPendingBeforeFiles(prev => prev.map((item, idx) => idx === mapModalTargetIdx ? {
          ...item,
          area: ar
        } : item));
      } else {
        setPhotoArea(ar);
      }
    },
    placeholder: "e.g. IBL 5 / Spiral / Packaging",
    className: "w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-2 rounded-xl border border-slate-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-500 block"
  }, "Map X (%)"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-sm"
  }, mapPinX, "%")), /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-2 rounded-xl border border-slate-200"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-500 block"
  }, "Map Y (%)"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-sm"
  }, mapPinY, "%")))), /*#__PURE__*/React.createElement("div", {
    ref: mapContainerRef,
    onClick: handleMapClick,
    className: "relative w-full h-80 rounded-2xl bg-slate-900 border-2 border-slate-300 overflow-hidden cursor-crosshair select-none"
  }, facilityMaps.find(m => m.id === selectedMapId)?.imageUrl ? /*#__PURE__*/React.createElement("img", {
    src: facilityMaps.find(m => m.id === selectedMapId).imageUrl,
    alt: "Facility Map",
    className: "w-full h-full object-contain pointer-events-none"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full flex flex-col items-center justify-center text-slate-300 p-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-bold"
  }, "Midwest Plant Facility Floor Map Grid"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400 mt-1"
  }, "Click anywhere on the map canvas to pin exact X/Y coordinates (", mapPinX, "%, ", mapPinY, "%)")), mapTagMode === 'pin' ? /*#__PURE__*/React.createElement("div", {
    style: {
      left: `${mapPinX}%`,
      top: `${mapPinY}%`
    },
    className: "absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-6 h-6 rounded-full bg-[#E4002B] border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-extrabold"
  }, "+")) : /*#__PURE__*/React.createElement("div", {
    style: {
      left: `${Math.max(0, mapPinX - mapBoxW / 2)}%`,
      top: `${Math.max(0, mapPinY - mapBoxH / 2)}%`,
      width: `${mapBoxW}%`,
      height: `${mapBoxH}%`
    },
    className: "absolute border-2 border-[#E4002B] bg-rose-500/25 pointer-events-none rounded"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowBulkMapModal(false),
    className: "px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow"
  }, "Confirm Map Coordinates & Area (", mapPinX, "%, ", mapPinY, "%)")))));
};
window.__PORTAL_APP_COMPONENT__ = __MAIN_COMP__;
window.__DEMO_APP_COMPONENT__ = __MAIN_COMP__;
})();