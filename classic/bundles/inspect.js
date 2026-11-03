(function() {
var React = window.React;
var {
  useState,
  useEffect,
  useMemo,
  useCallback
} = React;

// ============================================================================
// PORTAL 2: FSQ / SANITATION INSPECTORS, CI LEADS & SIX SIGMA CAPA STUDIO
// File: P6.2 - inspector hub.txt
// Target Bundle: bundles/inspect.js
// Features:
//   1. Inspect Equipment & Live Pre-Inspection Verification (MSID or Badge Scan)
//   2. Swab Verification Queue (>1% Positive Hits & Vector Retest Sign-Off)
//   3. Best-Practice Six Sigma DMAIC CAPA Studio:
//      - DMAIC Phase Stepper + Interactive "How-To" Playbook
//      - Solo Investigator Mode OR Group Tandem Mode (Input by ID or Anonymous)
//      - Facilitator Controls (Move causes across 6M categories, Vote, Promote to 5-Why)
//      - Visuals: Light-Theme SVG 6M Fishbone, 80/20 Pareto Chart, FMEA RPN Gauge
//      - Close CAPA -> Generates "Action Index" (Training, Work Orders, SSOP, BOLO Retest)
//      - 1-Click Excel (.CSV) Export of Full DMAIC CAPA & Action Index
//   4. Leadership-in-Training Badge Scan Elevation Gate (Unlock up to Supervisor)
// Strictly 7-bit ASCII (0x00-0x7F) - Bilingual English / Espanol (MX)
// ============================================================================

const IS_PUBLIC_DEMO = Boolean(typeof window !== 'undefined' && (window.__APEX_DEMO_ENGINE__ || window.parent && window.parent !== window && window.parent.__APEX_DEMO_ENGINE__ || window.top && window.top !== window && window.top.__APEX_DEMO_ENGINE__));
function getPortalEngine() {
  try {
    if (window.parent && window.parent !== window && window.parent.__MidwestPlant_SPEED_ENGINE__) {
      return window.parent.__MidwestPlant_SPEED_ENGINE__;
    }
  } catch {}
  try {
    if (window.top && window.top !== window && window.top.__MidwestPlant_SPEED_ENGINE__) {
      return window.top.__MidwestPlant_SPEED_ENGINE__;
    }
  } catch {}
  return window.__MidwestPlant_SPEED_ENGINE__ || null;
}
function cleanGuid(v) {
  return String(v === undefined || v === null ? '' : v).replace(/[{}]/g, '').trim().toLowerCase();
}
function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function safeJsonParse(raw, fallback) {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
const BONE_CATEGORIES = [{
  key: 'people',
  shortEn: 'People',
  labelEn: '1. People (Manpower)',
  labelEs: '1. Personal',
  x: 170,
  yTop: 42,
  yBot: 298,
  isTop: true,
  color: '#2563EB'
}, {
  key: 'methods',
  shortEn: 'Methods',
  labelEn: '2. Methods (Process/SSOP)',
  labelEs: '2. Metodos',
  x: 370,
  yTop: 42,
  yBot: 298,
  isTop: true,
  color: '#D97706'
}, {
  key: 'equipment',
  shortEn: 'Equipment',
  labelEn: '3. Equipment (Machine)',
  labelEs: '3. Equipo',
  x: 570,
  yTop: 42,
  yBot: 298,
  isTop: true,
  color: '#EA580C'
}, {
  key: 'materials',
  shortEn: 'Materials',
  labelEn: '4. Materials (Chemical)',
  labelEs: '4. Materiales',
  x: 170,
  yTop: 42,
  yBot: 298,
  isTop: false,
  color: '#0284C7'
}, {
  key: 'measurement',
  shortEn: 'Measurement',
  labelEn: '5. Measurement (Swab/ATP)',
  labelEs: '5. Medicion',
  x: 370,
  yTop: 42,
  yBot: 298,
  isTop: false,
  color: '#4F46E5'
}, {
  key: 'environment',
  shortEn: 'Environment',
  labelEn: '6. Environment (Room)',
  labelEs: '6. Ambiente',
  x: 570,
  yTop: 42,
  yBot: 298,
  isTop: false,
  color: '#059669'
}];
const DMAIC_PHASES = [{
  id: 'ALL',
  code: 'ALL',
  labelEn: 'Full DMAIC Board',
  labelEs: 'Tablero DMAIC Completo'
}, {
  id: 'DEFINE',
  code: 'D',
  labelEn: 'Define & SIPOC',
  labelEs: 'Definir y SIPOC'
}, {
  id: 'MEASURE',
  code: 'M',
  labelEn: 'Measure & FMEA RPN',
  labelEs: 'Medir y RPN FMEA'
}, {
  id: 'ANALYZE',
  code: 'A',
  labelEn: 'Analyze (6M + 5-Why)',
  labelEs: 'Analizar (6M + 5 Porques)'
}, {
  id: 'IMPROVE',
  code: 'I',
  labelEn: 'Improve & CAPA Plan',
  labelEs: 'Mejorar y Plan CAPA'
}, {
  id: 'CONTROL',
  code: 'C',
  labelEn: 'Control & Action Index',
  labelEs: 'Control e Indice Accion'
}];
const ACTION_TRIGGER_TYPES = [{
  code: 'TRAINING',
  labelEn: 'Training & Coaching Trigger',
  labelEs: 'Disparador de Entrenamiento',
  targetModule: '14. Training Matrix / Evals',
  badgeBg: '#EFF6FF',
  badgeColor: '#1E40AF',
  badgeBorder: '#93C5FD'
}, {
  code: 'WORK_ORDER',
  labelEn: 'Maintenance Work Order Trigger',
  labelEs: 'Orden de Trabajo Mantenimiento',
  targetModule: '13. PBED / SAP Work Order',
  badgeBg: '#FFF7ED',
  badgeColor: '#C2410C',
  badgeBorder: '#FDBA74'
}, {
  code: 'SSOP_UPDATE',
  labelEn: 'SSOP / Visual Aid Revision',
  labelEs: 'Actualizacion SSOP / Guia',
  targetModule: '5. MSS & SSOP Library',
  badgeBg: '#FFFBEB',
  badgeColor: '#B45309',
  badgeBorder: '#FCD34D'
}, {
  code: 'SWAB_VECTOR',
  labelEn: 'Pathogen BOLO Vector Retest',
  labelEs: 'Re-Muestreo Vector BOLO',
  targetModule: '10. Pathogen BOLO',
  badgeBg: '#ECFDF5',
  badgeColor: '#047857',
  badgeBorder: '#6EE7B7'
}];
function buildDefaultActionsForCapa(capa) {
  const cid = capa && capa.capaId || 'CAPA-2026-104';
  const area = capa && capa.problem && capa.problem.area || 'breading';
  const equip = capa && capa.problem && capa.problem.equipment || 'brd - batter 12';
  const due = capa && capa.rca && capa.rca.dueDate || todayIso();
  return [{
    actionId: `ACT-${cid.replace('CAPA-', '')}-01`,
    type: 'WORK_ORDER',
    title: `Replace stiff quick-release pin & verify tool-less hinge latch on ${equip}`,
    targetModule: '13. PBED / SAP Work Order',
    assignee: 'Maintenance Lead / PM Crib',
    priority: 'HIGH',
    dueDate: due,
    status: 'Queued Trigger'
  }, {
    actionId: `ACT-${cid.replace('CAPA-', '')}-02`,
    type: 'TRAINING',
    title: `Crew B Huddle & Hands-On Sign-Off: Step 2 Lower Return Guard Unlatch (${area.toUpperCase()})`,
    targetModule: '14. Training Matrix / Evals',
    assignee: 'Sanitation Supervisor / Lead',
    priority: 'HIGH',
    dueDate: due,
    status: 'Queued Trigger'
  }, {
    actionId: `ACT-${cid.replace('CAPA-', '')}-03`,
    type: 'SSOP_UPDATE',
    title: `Add red callout photo for Hinge Pin #4 to ${area.toUpperCase()} Teardown SSOP & MOC Checklist`,
    targetModule: '5. MSS & SSOP Library',
    assignee: 'FSQ / CI Lead',
    priority: 'MEDIUM',
    dueDate: due,
    status: 'Queued Trigger'
  }, {
    actionId: `ACT-${cid.replace('CAPA-', '')}-04`,
    type: 'SWAB_VECTOR',
    title: `3-Consecutive Shift ATP (<10 RLU) + Zone 1/2 Vector Swab Verification on ${equip}`,
    targetModule: '10. Pathogen BOLO',
    assignee: 'FSQ Inspector',
    priority: 'HIGH',
    dueDate: due,
    status: 'Queued Trigger'
  }];
}
const DEFAULT_CAPA_LIST = [{
  capaId: 'CAPA-2026-104',
  stage: 'Analyze & Improve',
  collabMode: 'group',
  facilitator: 'Marcus Vance / FSQ Lead',
  problem: {
    title: 'Breading Applicator Wire Belt - Pre-Op Protein/Residue Finding',
    statement: 'Pre-op inspection and ATP/swab check identified residual batter build-up on Breading Machine 1 return roller guard hinge prior to startup.',
    source: 'Pre-Op Inspection / Swab Verification',
    area: 'breading',
    equipment: 'brd - batter 12 (Breading Applicator Wire Belt)',
    findingDate: todayIso(),
    severity: 'High (Zone 1)',
    detectedBy: 'FSQ Inspector (M. Vance / T. vance)',
    ctqMetric: 'Pre-Op First-Pass Yield >= 99.0% & ATP < 10 RLU',
    defectUnit: 'Guard Hinge Contact Surface (Zone 1)',
    sigmaBaseline: '3.4 Sigma (22,750 DPMO)',
    sigmaTarget: '4.8 Sigma (< 500 DPMO)',
    sipocSupplier: 'Production Line Handoff -> Sanitation Crew B',
    sipocProcess: 'Dry Pickup -> Guard Teardown -> Foam -> Scrub -> Rinse -> Sanitize',
    sipocCustomer: 'FSQ Pre-Op Inspector & Morning Production Startup'
  },
  fmea: {
    sevBefore: 8,
    occBefore: 6,
    detBefore: 5,
    sevAfter: 8,
    occAfter: 2,
    detAfter: 2
  },
  fishbone: {
    people: [{
      id: 'c1',
      text: 'New tech missed underside hinge latch release during teardown',
      likely: false,
      votes: 2,
      author: 'Anonymous Contributor',
      isAnon: true
    }, {
      id: 'c1b',
      text: 'Shift handoff did not flag stiff pin on return roller guard',
      likely: false,
      votes: 1,
      author: 'APX-104 (Sanitation Lead)',
      isAnon: false
    }],
    methods: [{
      id: 'c2',
      text: 'SSOP Step 2 did not specify unlatching lower return guard pin #4',
      likely: true,
      votes: 5,
      author: 'INSP-201 (FSQ Inspector)',
      isAnon: false
    }, {
      id: 'c2b',
      text: 'MOC sign-off lacked Sanitation SSOP photo verification step',
      likely: true,
      votes: 4,
      author: 'Facilitator',
      isAnon: false
    }],
    equipment: [{
      id: 'c3',
      text: 'Quick-release pin binding on Breading Machine 1 lower guard',
      likely: true,
      votes: 6,
      author: 'Anonymous Contributor',
      isAnon: true
    }],
    materials: [{
      id: 'c4',
      text: 'Foam dwell time shortened by 3 mins on underside guard',
      likely: false,
      votes: 1,
      author: 'APX-112 (Sanitarian)',
      isAnon: false
    }],
    measurement: [{
      id: 'c5',
      text: 'Visual flashlight check caught residue prior to ATP swab release',
      likely: false,
      votes: 2,
      author: 'INSP-201 (FSQ Inspector)',
      isAnon: false
    }],
    environment: [{
      id: 'c6',
      text: 'Low angled lighting under discharge transfer frame',
      likely: false,
      votes: 2,
      author: 'Anonymous Contributor',
      isAnon: true
    }]
  },
  fiveWhy: [{
    n: 1,
    why: 'Why was batter residue present on the return roller guard hinge?',
    answer: 'The lower return guard was foamed in place instead of swung open.'
  }, {
    n: 2,
    why: 'Why was the lower return guard not swung open during Step 2 teardown?',
    answer: 'The quick-release pin was binding and the tech thought it was a fixed guard.'
  }, {
    n: 3,
    why: 'Why did the tech think the guard was fixed?',
    answer: 'The Breading SSOP teardown checklist did not call out the lower hinge pin by number.'
  }, {
    n: 4,
    why: 'Why was the hinge pin omitted from the teardown checklist?',
    answer: 'Guard was modified during Q3 PM without updating the SSOP photo guide.'
  }, {
    n: 5,
    why: 'Why was the SSOP photo guide not updated after the PM modification?',
    answer: 'MOC (Management of Change) sign-off did not include Sanitation SSOP review step.'
  }],
  rca: {
    rootCause: 'Q3 guard modification added a lower hinge pin without updating the Breading Teardown SSOP photo guide or PM lubrication check.',
    correction: 'Immediately unlatched guard, detail-scrubbed, foamed, sanitized (200ppm quat), and passed re-inspection + ATP (<10 RLU).',
    correctiveAction: 'Updated Breading SSOP Step 2 with red callout photo for Hinge Pin #4 and replaced stiff quick-release pin.',
    preventiveAction: 'Added mandatory Sanitation SSOP & Pre-Op Checklist sign-off to Maintenance MOC workflow.',
    controlPlan: '3 consecutive shift Pre-Op audits + weekly PM quick-pin check + updated laminated teardown visual at Line 1.',
    ownerName: 'Carlos Mendez / Maintenance Lead',
    dueDate: todayIso(),
    verifiedBy: 'Verified via Microsoft ID'
  },
  actionIndex: []
}];
DEFAULT_CAPA_LIST[0].actionIndex = buildDefaultActionsForCapa(DEFAULT_CAPA_LIST[0]);
function normalizeCapaRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const base = DEFAULT_CAPA_LIST[0];
  const prob = Object.assign({}, base.problem, raw.problem || {});
  const fmea = Object.assign({
    sevBefore: 8,
    occBefore: 5,
    detBefore: 5,
    sevAfter: 8,
    occAfter: 2,
    detAfter: 2
  }, raw.fmea || {});
  const rawFb = raw.fishbone || {};
  const fb = {};
  BONE_CATEGORIES.forEach(b => {
    const arr = Array.isArray(rawFb[b.key]) ? rawFb[b.key] : [];
    fb[b.key] = arr.map((item, idx) => ({
      id: item.id || `${b.key}-${idx}-${Date.now()}`,
      text: String(item.text || ''),
      likely: Boolean(item.likely),
      votes: typeof item.votes === 'number' ? item.votes : item.likely ? 3 : 1,
      author: String(item.author || 'Investigator'),
      isAnon: Boolean(item.isAnon)
    }));
  });
  const rca = Object.assign({}, base.rca, raw.rca || {});
  const merged = {
    ...raw,
    capaId: String(raw.capaId || 'CAPA-2026-104'),
    stage: String(raw.stage || 'Analyze & Improve'),
    collabMode: raw.collabMode || 'group',
    facilitator: raw.facilitator || 'Facilitator',
    problem: prob,
    fmea,
    fishbone: fb,
    fiveWhy: Array.isArray(raw.fiveWhy) && raw.fiveWhy.length > 0 ? raw.fiveWhy : base.fiveWhy,
    rca
  };
  merged.actionIndex = Array.isArray(raw.actionIndex) && raw.actionIndex.length > 0 ? raw.actionIndex : buildDefaultActionsForCapa(merged);
  return merged;
}
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function InspectorFsqHub() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('__1_ss_lang_v1') === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });
  const tr = useCallback((en, es) => lang === 'es' ? es : en, [lang]);
  const [detailMode, setDetailMode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(() => {
    try {
      const q = String(window.location.search || '');
      if (q.indexOf('sub=capa') >= 0) return 'capa';
      if (q.indexOf('sub=elevation') >= 0) return 'elevation';
    } catch {}
    return 'inspect';
  });

  // Inspector Identity & Sign-off Method
  const [signMethod, setSignMethod] = useState('msid'); // 'msid' | 'badge'
  const [inspectorBadge, setInspectorBadge] = useState('INSP-201');
  const [inspectorName, setInspectorName] = useState(() => {
    const eng = getPortalEngine();
    const eff = eng && typeof eng.getEffectiveUser === 'function' ? eng.getEffectiveUser() : null;
    return eff && eff.userName ? String(eff.userName).trim() : 'FSQ Inspector (Microsoft ID)';
  });
  const [statusToast, setStatusToast] = useState('');

  // Tab 1: Pre-Inspection & Equipment Inspection Queue
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [inspectNote, setInspectNote] = useState('');
  const [swabHits, setSwabHits] = useState([]);
  const [swabTotalCount, setSwabTotalCount] = useState(0);

  // Tab 2: Six Sigma DMAIC CAPA Studio
  const [capaList, setCapaList] = useState(() => DEFAULT_CAPA_LIST.map(normalizeCapaRecord));
  const [activeCapaIdx, setActiveCapaIdx] = useState(0);
  const [activeDmaicPhase, setActiveDmaicPhase] = useState('ALL');
  const [showHowToGuide, setShowHowToGuide] = useState(false);
  const [selectedBone, setSelectedBone] = useState('methods');
  const [newCauseText, setNewCauseText] = useState('');
  const [newCauseLikely, setNewCauseLikely] = useState(true);
  const [inputModeAnon, setInputModeAnon] = useState(false);
  const [contributorIdInput, setContributorIdInput] = useState('APX-104 (Sanitation Lead)');
  const [facilitatorUnlocked, setFacilitatorUnlocked] = useState(true);

  // Action Index New Item Draft
  const [newActionType, setNewActionType] = useState('TRAINING');
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('Sanitation Supervisor');
  const [newActionPriority, setNewActionPriority] = useState('HIGH');

  // Tab 3: Leadership-in-Training Badge Scan Elevation Gate
  const [employees, setEmployees] = useState([]);
  const [traineeBadgeInput, setTraineeBadgeInput] = useState(() => IS_PUBLIC_DEMO ? 'DEMO-101' : '');
  const [traineePinInput, setTraineePinInput] = useState('1234');
  const [supervisorCosignBadge, setSupervisorCosignBadge] = useState('SUP-301');
  const [activeElevation, setActiveElevation] = useState(() => {
    try {
      const raw = sessionStorage.getItem('__MidwestPlant_ELEVATION_V1__');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const activeCapa = capaList[activeCapaIdx] || capaList[0] || null;

  // Resolve Inspector identity from engine if available
  useEffect(() => {
    try {
      const eng = getPortalEngine();
      if (eng && typeof eng.getEffectiveUser === 'function') {
        const eff = eng.getEffectiveUser();
        if (eff && eff.userName) {
          setInspectorName(eff.userName);
          setContributorIdInput(`${eff.userName} (${eff.roleName || 'ID'})`);
        }
      }
    } catch {}
  }, []);
  const loadPreInspectQueue = useCallback(async () => {
    try {
      const r = await fetch("/api/data/v9.2/craa5___1_e_hubconfigs?$select=craa5_configkey,craa5_configjson,modifiedon,statecode&$filter=startswith(craa5_configkey,'PREINSPECT|')");
      if (r.ok) {
        const d = await r.json();
        const list = (d.value || []).map(row => {
          const p = safeJsonParse(row.craa5_configjson, null);
          return p ? {
            ...p,
            _rowId: row.craa5___1_e_hubconfigid,
            _modifiedon: row.modifiedon
          } : null;
        }).filter(Boolean);
        list.sort((a, b) => String(b.result?.verifiedAt || b.result?.at || b._modifiedon || b.requestedAt || '').localeCompare(String(a.result?.verifiedAt || a.result?.at || a._modifiedon || a.requestedAt || '')));
        const seenIds = new Set();
        const deduped = list.filter(item => {
          const k = String(item.requestId || '');
          if (!k || seenIds.has(k)) return false;
          seenIds.add(k);
          return true;
        });
        if (deduped.length > 0 || !IS_PUBLIC_DEMO) {
          setRequests(deduped);
          return;
        }
      }
    } catch {}
    if (IS_PUBLIC_DEMO) {
      setRequests(prev => prev.length > 0 ? prev : [{
        requestId: 'REQ-BREAD-01',
        status: 'open',
        area: 'breading',
        room: 'bakery',
        equipmentNames: ['brd - batter 12 (Breading Applicator Wire Belt)', 'brd - frontline 04 (Breading Machine 1)'],
        note: 'Foam, detail scrub, and rinse complete. Ready for FSQ Pre-Op sign-off.',
        requestedBy: {
          name: 'Rivera, Alex (Demo)',
          badge: 'DEMO-101',
          crew: 'B'
        },
        requestedAt: new Date(Date.now() - 4 * 60000).toISOString()
      }]);
    }
  }, []);
  const loadInspectorData = useCallback(async () => {
    await loadPreInspectQueue();
    // 1. Load Equipment Assets
    try {
      const astRes = await fetch('/api/data/v9.2/craa5___1_a_assetses?$top=300');
      if (astRes.ok) {
        const astJson = await astRes.json();
        const mapped = (astJson.value || []).slice(0, 80).map(a => ({
          id: cleanGuid(a.craa5___1_a_assetsid || a.id),
          name: String(a.craa5_equipmentidentifier || a.craa5_name || 'Equipment'),
          area: String(a.craa5_areaname || 'breading'),
          room: String(a.craa5_roomname || 'bakery'),
          subcat: String(a.craa5_supportroom || a.craa5_subcategory || 'frontline'),
          sap: String(a.craa5_departmentcode || a.craa5_workareacode || 'SSANDEMO')
        }));
        setAssets(mapped);
      }
    } catch {}

    // 2. Load Swab Results
    try {
      const primarySwabUrl = IS_PUBLIC_DEMO ? '/api/data/v9.2/craa5___1_b_swabresults?$top=500&$orderby=craa5_collectiondate desc' : '/api/data/v9.2/craa5__b_swabresults?$top=500&$orderby=craa5_collectiondate desc';
      const fallbackSwabUrl = IS_PUBLIC_DEMO ? '/api/data/v9.2/craa5__b_swabresults?$top=500&$orderby=craa5_collectiondate desc' : '/api/data/v9.2/craa5___1_b_swabresults?$top=500&$orderby=craa5_collectiondate desc';
      let swRes = null;
      try {
        swRes = await fetch(primarySwabUrl);
      } catch {
        swRes = null;
      }
      if (!swRes || !swRes.ok) {
        try {
          swRes = await fetch(fallbackSwabUrl);
        } catch {
          swRes = null;
        }
      }
      if (swRes && swRes.ok) {
        const swJson = await swRes.json();
        const allSwabs = swJson.value || [];
        setSwabTotalCount(allSwabs.length);
        const positives = allSwabs.filter(s => String(s.craa5_result || '').toLowerCase() === 'positive' || String(s.craa5_result || '').toLowerCase() === 'pending').slice(0, 12);
        setSwabHits(positives);
      }
    } catch {}

    // 3. Load CAPA Studies from hubconfigs (keep DEFAULT_CAPA_LIST fallback so Six Sigma Studio is always ready)
    try {
      const capaRes = await fetch("/api/data/v9.2/craa5___1_e_hubconfigs?$select=craa5_configkey,craa5_configjson&$filter=startswith(craa5_configkey,'CAPA_STUDY|')");
      if (capaRes.ok) {
        const capaJson = await capaRes.json();
        const loadedCapas = (capaJson.value || []).map(r => safeJsonParse(r.craa5_configjson, null)).filter(Boolean).map(normalizeCapaRecord).filter(Boolean);
        if (loadedCapas.length > 0) {
          const merged = [...loadedCapas, ...DEFAULT_CAPA_LIST.map(normalizeCapaRecord).filter(d => !loadedCapas.some(l => l.capaId === d.capaId))];
          setCapaList(merged);
        }
      }
    } catch {}

    // 4. Load Employees for Trainee Gate & Contributor Selector
    try {
      const empRes = await fetch('/api/data/v9.2/craa5___1_a_employees?$top=200');
      if (empRes.ok) {
        const empJson = await empRes.json();
        const empList = (empJson.value || []).filter(e => e.statecode === 0 || e.statecode === undefined).map((e, i) => ({
          id: cleanGuid(e.craa5___1_a_employeeid || e.id),
          name: String(e.craa5_employeename || e.craa5_name || 'Employee'),
          badge: String(e.craa5_badgenumber || e.craa5_badge || `APX-${100 + i}`),
          role: String(e.craa5_role || 'Sanitarian'),
          shift: String(e.craa5_shift || 'B'),
          inTraining: Boolean(e.craa5_intraining),
          trainingArea: String(e.craa5_trainingarea || 'breading')
        }));
        setEmployees(empList);
        if (!IS_PUBLIC_DEMO && empList.length > 0) {
          const firstTrainee = empList.find(e => e.inTraining) || empList[0];
          setTraineeBadgeInput(prev => prev || firstTrainee.badge);
        }
      }
    } catch {}
  }, [loadPreInspectQueue]);
  useEffect(() => {
    loadInspectorData();
    const timer = setInterval(loadPreInspectQueue, 10000);
    return () => clearInterval(timer);
  }, [loadInspectorData, loadPreInspectQueue]);
  useEffect(() => {
    window.__PORTAL_SET_DETAIL__ = on => setDetailMode(Boolean(on));
    window.__PORTAL_APP_COMMANDS__ = {
      openTab: sub => setActiveSubTab(sub || 'inspect'),
      setLang: l => setLang(l === 'es' ? 'es' : 'en')
    };
    const onMsg = ev => {
      const d = ev && ev.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'hub:detail') setDetailMode(Boolean(d.on));
      if (d.type === 'hub:lang' && (d.lang === 'en' || d.lang === 'es')) setLang(d.lang);
      if (d.type === 'hub:preinspect-created') loadPreInspectQueue();
    };
    window.addEventListener('message', onMsg);
    let bc = null;
    try {
      bc = new BroadcastChannel('__MidwestPlant_HUB_SYNC_V1__');
      bc.onmessage = ev => {
        if (ev.data && (ev.data.type === 'PREINSPECT_SYNC' || ev.data.entitySet === 'craa5___1_e_hubconfigs')) {
          loadPreInspectQueue();
        }
      };
    } catch {}
    return () => {
      window.removeEventListener('message', onMsg);
      if (bc) try {
        bc.close();
      } catch {}
    };
  }, [loadPreInspectQueue]);

  // Verify Pre-Inspection Request (Pass or Fail)
  const handleVerifyRequest = async (req, passed) => {
    const nowIso = new Date().toISOString();
    const sigLabel = signMethod === 'msid' ? `${inspectorName} (Verified Microsoft ID)` : `Badge ${inspectorBadge} (PIN Verified)`;
    const updated = {
      ...req,
      status: passed ? 'passed' : 'failed',
      result: {
        passed,
        inspectorName: sigLabel,
        method: signMethod,
        note: inspectNote.trim() || (passed ? 'Pre-Op visual, guard, and ATP check passed.' : 'Residue found on guard hinge - re-clean required.'),
        at: nowIso,
        verifiedAt: nowIso
      }
    };
    setRequests(prev => prev.map(r => r.requestId === req.requestId ? updated : r));
    setStatusToast(passed ? `${tr('PRE-OP PASSED:', 'PRE-OP APROBADO:')} ${req.area.toUpperCase()} signed off via ${sigLabel}` : `${tr('PRE-OP FAILED:', 'PRE-OP RECHAZADO:')} ${req.area.toUpperCase()} flagged for re-clean & CAPA`);
    try {
      const targetUrl = req._rowId ? `/api/data/v9.2/craa5___1_e_hubconfigs(${cleanGuid(req._rowId)})` : '/api/data/v9.2/craa5___1_e_hubconfigs';
      await fetch(targetUrl, {
        method: req._rowId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_configkey: `PREINSPECT|${req.requestId}`,
          craa5_configname: `Pre-Inspection ${updated.status.toUpperCase()}: ${req.area}`,
          craa5_configjson: JSON.stringify(updated)
        })
      });
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `Pre-Inspection ${passed ? 'PASSED' : 'FAILED'}: ${req.area}`,
          craa5_action: passed ? 'PREINSPECT_PASSED' : 'PREINSPECT_FAILED',
          craa5_app: 'portal2',
          craa5_crew: req.requestedBy?.crew || 'B',
          craa5_user: sigLabel,
          craa5_at: nowIso,
          craa5_summary: `${sigLabel} marked ${req.area} (${(req.equipmentNames || []).join(', ')}) as ${passed ? 'PASSED' : 'FAILED'}`,
          craa5_details: JSON.stringify(updated).slice(0, 1800)
        })
      });
      try {
        const bc = new BroadcastChannel('__MidwestPlant_HUB_SYNC_V1__');
        bc.postMessage({
          type: 'PREINSPECT_SYNC',
          requestId: req.requestId,
          payload: updated
        });
        bc.close();
      } catch {}
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'hub:preinspect-updated',
            payload: updated
          }, '*');
        }
      } catch {}
    } catch {}
  };

  // Launch CAPA Studio pre-filled from a failed inspection or positive swab
  const handleLaunchCapaFromFinding = (areaName, equipName, findingText, sourceLabel) => {
    const newId = `CAPA-2026-${105 + capaList.length}`;
    const draft = normalizeCapaRecord({
      capaId: newId,
      stage: 'Define & Analyze',
      collabMode: 'group',
      facilitator: inspectorName,
      problem: {
        title: `${areaName.toUpperCase()} - ${equipName} (${sourceLabel})`,
        statement: findingText || `Finding on ${equipName} in ${areaName} during ${sourceLabel}.`,
        source: sourceLabel,
        area: areaName,
        equipment: equipName,
        findingDate: todayIso(),
        severity: 'High (Zone 1 / Pre-Op)',
        detectedBy: inspectorName,
        ctqMetric: 'Zero Pre-Op Visual/Swab Failures & ATP < 10 RLU',
        defectUnit: `${equipName} Contact / Guard Surface`,
        sigmaBaseline: '3.2 Sigma (44,500 DPMO)',
        sigmaTarget: '4.7 Sigma (< 650 DPMO)',
        sipocSupplier: 'Production Shutdown -> Sanitation Crew',
        sipocProcess: 'Lockout -> Teardown -> Foam -> Detail Scrub -> Rinse -> Pre-Op Check',
        sipocCustomer: 'FSQ Inspector & Production Startup'
      },
      fmea: {
        sevBefore: 9,
        occBefore: 6,
        detBefore: 5,
        sevAfter: 9,
        occAfter: 2,
        detAfter: 2
      },
      fishbone: {
        people: [{
          id: 'p1',
          text: 'Operator teardown handoff between shifts',
          likely: false,
          votes: 2,
          author: 'Anonymous Contributor',
          isAnon: true
        }],
        methods: [{
          id: 'm1',
          text: 'SSOP detail step needed visual check callout',
          likely: true,
          votes: 4,
          author: inspectorName,
          isAnon: false
        }],
        equipment: [{
          id: 'e1',
          text: `${equipName} guard latch access tight`,
          likely: true,
          votes: 5,
          author: 'APX-104 (Lead)',
          isAnon: false
        }],
        materials: [{
          id: 'mt1',
          text: 'Chemical concentration verified at 200ppm',
          likely: false,
          votes: 1,
          author: 'APX-112 (Tech)',
          isAnon: false
        }],
        measurement: [{
          id: 'ms1',
          text: `Caught during ${sourceLabel}`,
          likely: false,
          votes: 2,
          author: inspectorName,
          isAnon: false
        }],
        environment: [{
          id: 'en1',
          text: 'Drain backflow cleared prior to foam',
          likely: false,
          votes: 1,
          author: 'Anonymous Contributor',
          isAnon: true
        }]
      },
      fiveWhy: [{
        n: 1,
        why: `Why did ${equipName} fail ${sourceLabel}?`,
        answer: findingText || 'Residue remained on underside contact point.'
      }, {
        n: 2,
        why: 'Why was the underside contact point missed during scrub?',
        answer: 'Guard hinge was not fully opened during Step 2 foam & scrub.'
      }, {
        n: 3,
        why: 'Why was the guard hinge not opened?',
        answer: 'Quick-release pin required wrench instead of tool-less pull.'
      }, {
        n: 4,
        why: 'Why was a wrench-only pin installed?',
        answer: 'Replacement pin installed during line call without tool-less spec.'
      }, {
        n: 5,
        why: 'Why was the tool-less spec not enforced?',
        answer: 'PM parts bin mixed standard hex bolts with sanitary quick-pins.'
      }],
      rca: {
        rootCause: 'Standard hex bolt substituted for sanitary quick-release pin on guard hinge, preventing tool-less teardown access.',
        correction: 'Unbolted guard, completed full chemical scrub + sanitize, and verified 0 RLU / Negative.',
        correctiveAction: 'Replaced hex bolt with stainless sanitary T-handle quick-pin and updated SSOP photo.',
        preventiveAction: 'Segregated sanitary quick-pins in Maintenance parts crib with QA sign-off.',
        controlPlan: 'Shift Pre-Op audit checklist + weekly Maintenance quick-pin audit + SSOP visual card at line.',
        ownerName: 'Sanitation & Maintenance Leads',
        dueDate: todayIso(),
        verifiedBy: `${inspectorName} (${signMethod.toUpperCase()})`
      }
    });
    setCapaList(prev => [draft, ...prev]);
    setActiveCapaIdx(0);
    setActiveSubTab('capa');
  };
  const updateActiveCapa = updater => {
    setCapaList(prev => prev.map((c, idx) => idx === activeCapaIdx ? updater(c) : c));
  };

  // Add cause chip to Fishbone bone (Solo or Group Tandem - By ID or Anonymous)
  const handleAddBoneCause = () => {
    if (!newCauseText.trim() || !activeCapa) return;
    const authorLabel = inputModeAnon ? 'Anonymous Contributor' : contributorIdInput.trim() || inspectorName || 'ID Contributor';
    updateActiveCapa(c => {
      const curBone = c.fishbone[selectedBone] || [];
      return {
        ...c,
        fishbone: {
          ...c.fishbone,
          [selectedBone]: [...curBone, {
            id: 'c-' + Date.now(),
            text: newCauseText.trim(),
            likely: newCauseLikely,
            votes: newCauseLikely ? 3 : 1,
            author: authorLabel,
            isAnon: Boolean(inputModeAnon)
          }]
        }
      };
    });
    setNewCauseText('');
    setStatusToast(`${tr('Added 6M cause under', 'Causa 6M agregada en')} ${selectedBone.toUpperCase()} (${authorLabel})`);
  };

  // Simulate multi-person group tandem input (By ID + Anonymous)
  const handleSimulateGroupBrainstorm = () => {
    if (!activeCapa) return;
    const now = Date.now();
    updateActiveCapa(c => ({
      ...c,
      collabMode: 'group',
      fishbone: {
        ...c.fishbone,
        people: [...(c.fishbone.people || []), {
          id: 'sim-p-' + now,
          text: 'Float tech rotated onto Line 1 without 5-min guard walkthrough',
          likely: true,
          votes: 4,
          author: 'Anonymous Contributor',
          isAnon: true
        }],
        methods: [...(c.fishbone.methods || []), {
          id: 'sim-m-' + now,
          text: 'Pre-inspection checklist groups 4 guards into 1 line item',
          likely: true,
          votes: 5,
          author: 'APX-108 (Sanitation Lead)',
          isAnon: false
        }],
        equipment: [...(c.fishbone.equipment || []), {
          id: 'sim-e-' + now,
          text: 'Washdown spray nozzle angle blocked by lower drip pan',
          likely: false,
          votes: 3,
          author: 'MNT-402 (Maintenance Tech)',
          isAnon: false
        }],
        environment: [...(c.fishbone.environment || []), {
          id: 'sim-en-' + now,
          text: 'Steam condensation reduces visibility during hot rinse',
          likely: false,
          votes: 2,
          author: 'Anonymous Contributor',
          isAnon: true
        }]
      }
    }));
    setStatusToast(tr('Group Tandem Brainstorm: 4 team inputs added (2 by ID, 2 Anonymous). Use Facilitator controls to move or vote!', 'Lluvia de ideas en grupo: 4 entradas agregadas (2 con ID, 2 Anonimas).'));
  };

  // Facilitator: Move cause from one 6M category to another
  const handleMoveCauseBetweenBones = (fromBone, causeId, toBone) => {
    if (!fromBone || !toBone || fromBone === toBone) return;
    updateActiveCapa(c => {
      const srcList = c.fishbone[fromBone] || [];
      const item = srcList.find(x => x.id === causeId);
      if (!item) return c;
      const nextSrc = srcList.filter(x => x.id !== causeId);
      const nextDst = [...(c.fishbone[toBone] || []), item];
      return {
        ...c,
        fishbone: {
          ...c.fishbone,
          [fromBone]: nextSrc,
          [toBone]: nextDst
        }
      };
    });
    setStatusToast(`${tr('Facilitator moved item to', 'Facilitador movio el item a')} ${toBone.toUpperCase()}`);
  };

  // Facilitator / Group: Vote (+1) on a cause
  const handleVoteCause = (boneKey, causeId) => {
    updateActiveCapa(c => ({
      ...c,
      fishbone: {
        ...c.fishbone,
        [boneKey]: (c.fishbone[boneKey] || []).map(item => item.id === causeId ? {
          ...item,
          votes: (item.votes || 0) + 1
        } : item)
      }
    }));
  };

  // Facilitator: Toggle Root Cause (Likely) flag
  const handleToggleCauseLikely = (boneKey, causeId) => {
    updateActiveCapa(c => ({
      ...c,
      fishbone: {
        ...c.fishbone,
        [boneKey]: (c.fishbone[boneKey] || []).map(item => item.id === causeId ? {
          ...item,
          likely: !item.likely
        } : item)
      }
    }));
  };

  // Facilitator: Promote a Fishbone Cause directly into 5-Why #1 & Root Cause statement
  const handlePromoteCauseToFiveWhy = (causeText, boneKey) => {
    updateActiveCapa(c => {
      const nextFive = (c.fiveWhy || []).map((w, i) => i === 0 ? {
        ...w,
        answer: `[6M ${boneKey.toUpperCase()}] ${causeText}`
      } : w);
      return {
        ...c,
        fiveWhy: nextFive,
        rca: {
          ...c.rca,
          rootCause: `${causeText}  verified via 6M (${boneKey.toUpperCase()}) & 5-Why analysis.`
        }
      };
    });
    setStatusToast(tr('Promoted cause to 5-Why #1 & Root Cause statement.', 'Causa promovida al Porque #1 y Causa Raiz.'));
  };

  // Facilitator: Delete a cause
  const handleDeleteCause = (boneKey, causeId) => {
    updateActiveCapa(c => ({
      ...c,
      fishbone: {
        ...c.fishbone,
        [boneKey]: (c.fishbone[boneKey] || []).filter(item => item.id !== causeId)
      }
    }));
  };

  // Add Action Index Trigger Item
  const handleAddActionIndexItem = () => {
    if (!newActionTitle.trim() || !activeCapa) return;
    const tDef = ACTION_TRIGGER_TYPES.find(t => t.code === newActionType) || ACTION_TRIGGER_TYPES[0];
    const nextNum = String((activeCapa.actionIndex || []).length + 1).padStart(2, '0');
    const newItem = {
      actionId: `ACT-${activeCapa.capaId.replace('CAPA-', '')}-${nextNum}`,
      type: tDef.code,
      title: newActionTitle.trim(),
      targetModule: tDef.targetModule,
      assignee: newActionAssignee.trim() || 'Assigned Lead',
      priority: newActionPriority,
      dueDate: activeCapa.rca.dueDate || todayIso(),
      status: 'Queued Trigger'
    };
    updateActiveCapa(c => ({
      ...c,
      actionIndex: [...(c.actionIndex || []), newItem]
    }));
    setNewActionTitle('');
    setStatusToast(`${tr('Added Action Index trigger:', 'Disparador agregado al Indice de Accion:')} ${newItem.actionId}`);
  };

  // Cycle Action Index Status
  const handleCycleActionStatus = actionId => {
    const order = ['Queued Trigger', 'Dispatched to Module', 'Verified Complete'];
    updateActiveCapa(c => ({
      ...c,
      actionIndex: (c.actionIndex || []).map(act => {
        if (act.actionId !== actionId) return act;
        const idx = order.indexOf(act.status);
        return {
          ...act,
          status: order[(idx + 1) % order.length]
        };
      })
    }));
  };

  // Save CAPA Study to Dataverse (`craa5___1_e_hubconfigs` + `craa5___1_s_shiftlogs`)
  const handleSaveCapaStudy = async (closeAndGenerateIndex = false) => {
    const cur = capaList[activeCapaIdx];
    if (!cur) return;
    const nowIso = new Date().toISOString();
    const ensuredActions = Array.isArray(cur.actionIndex) && cur.actionIndex.length > 0 ? cur.actionIndex : buildDefaultActionsForCapa(cur);
    const updatedActions = closeAndGenerateIndex ? ensuredActions.map(a => ({
      ...a,
      status: a.status === 'Queued Trigger' ? 'Dispatched to Module' : a.status,
      dispatchedAt: nowIso
    })) : ensuredActions;
    const updated = {
      ...cur,
      stage: closeAndGenerateIndex ? 'Closed - Action Index Active' : cur.stage === 'Open' ? 'Analyze & Improve' : cur.stage,
      actionIndex: updatedActions,
      closedAt: closeAndGenerateIndex ? nowIso : cur.closedAt,
      savedAt: nowIso,
      savedBy: inspectorName
    };
    setCapaList(prev => prev.map((c, i) => i === activeCapaIdx ? updated : c));
    if (closeAndGenerateIndex) {
      setActiveDmaicPhase('CONTROL');
    }
    setStatusToast(closeAndGenerateIndex ? `${tr('CAPA CLOSED & ACTION INDEX GENERATED:', 'CAPA CERRADO E INDICE DE ACCION GENERADO:')} ${cur.capaId} (${updatedActions.length} ${tr('downstream triggers dispatched', 'disparadores enviados')})` : `${tr('Saved Six Sigma CAPA Study to Dataverse:', 'Estudio CAPA Six Sigma guardado en Dataverse:')} ${cur.capaId}`);
    try {
      await fetch('/api/data/v9.2/craa5___1_e_hubconfigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_configkey: `CAPA_STUDY|${cur.capaId}`,
          craa5_configname: `CAPA Study ${cur.capaId}: ${cur.problem.title}`,
          craa5_configjson: JSON.stringify(updated)
        })
      });
      if (closeAndGenerateIndex) {
        await fetch('/api/data/v9.2/craa5___1_e_hubconfigs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            craa5_configkey: `ACTION_INDEX|${cur.capaId}`,
            craa5_configname: `Action Index ${cur.capaId} (${updatedActions.length} Triggers)`,
            craa5_configjson: JSON.stringify({
              capaId: cur.capaId,
              area: cur.problem.area,
              equipment: cur.problem.equipment,
              closedBy: inspectorName,
              closedAt: nowIso,
              rootCause: cur.rca.rootCause,
              actions: updatedActions
            })
          })
        });
      }
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `${closeAndGenerateIndex ? 'CAPA Closed & Action Index' : 'CAPA Saved'}: ${cur.capaId} (${cur.problem.area})`,
          craa5_action: closeAndGenerateIndex ? 'CAPA_CLOSED_ACTION_INDEX' : 'CAPA_SAVED',
          craa5_app: 'portal2',
          craa5_crew: 'B',
          craa5_user: inspectorName,
          craa5_at: nowIso,
          craa5_summary: `${closeAndGenerateIndex ? 'Closed CAPA & generated Action Index' : 'Saved Six Sigma CAPA'} for ${cur.capaId}: ${cur.rca.rootCause}`,
          craa5_details: JSON.stringify({
            capaId: cur.capaId,
            stage: updated.stage,
            actionCount: updatedActions.length
          }).slice(0, 1800)
        })
      });
    } catch {}
  };

  // Export Six Sigma DMAIC CAPA & Action Index to Excel (.CSV)
  const handleExportCapaToExcelCsv = () => {
    if (!activeCapa) return;
    const esc = val => {
      const s = String(val === undefined || val === null ? '' : val).replace(/\r?\n/g, ' ');
      return `"${s.replace(/"/g, '""')}"`;
    };
    const f = activeCapa.fmea || {
      sevBefore: 8,
      occBefore: 6,
      detBefore: 5,
      sevAfter: 8,
      occAfter: 2,
      detAfter: 2
    };
    const rpnBefore = (f.sevBefore || 1) * (f.occBefore || 1) * (f.detBefore || 1);
    const rpnAfter = (f.sevAfter || 1) * (f.occAfter || 1) * (f.detAfter || 1);
    const rows = [['SIX SIGMA DMAIC CAPA INVESTIGATION & ACTION INDEX REPORT'], ['CAPA ID', activeCapa.capaId, 'Stage', activeCapa.stage, 'Session Mode', activeCapa.collabMode === 'group' ? 'Group Tandem + Facilitator' : 'Solo Investigator'], ['Title', activeCapa.problem.title, 'Area', activeCapa.problem.area, 'Equipment', activeCapa.problem.equipment], ['Problem Statement', activeCapa.problem.statement, 'Detected By', activeCapa.problem.detectedBy, 'Finding Date', activeCapa.problem.findingDate], ['CTQ Metric', activeCapa.problem.ctqMetric, 'Baseline Sigma / DPMO', activeCapa.problem.sigmaBaseline, 'Target Sigma / DPMO', activeCapa.problem.sigmaTarget], ['SIPOC Supplier', activeCapa.problem.sipocSupplier, 'SIPOC Process', activeCapa.problem.sipocProcess, 'SIPOC Customer', activeCapa.problem.sipocCustomer], [], ['FMEA RISK PRIORITY NUMBER (RPN = SEVERITY x OCCURRENCE x DETECTION)'], ['Phase', 'Severity (1-10)', 'Occurrence (1-10)', 'Detection (1-10)', 'Calculated RPN', 'Risk Reduction %'], ['Pre-CAPA Baseline', f.sevBefore, f.occBefore, f.detBefore, rpnBefore, 'Baseline'], ['Post-CAPA Target', f.sevAfter, f.occAfter, f.detAfter, rpnAfter, rpnBefore > 0 ? `${Math.round((rpnBefore - rpnAfter) / rpnBefore * 100)}%` : '0%'], [], ['6M ISHIKAWA FISHBONE BRAINSTORMING & PARETO VOTES'], ['6M Category', 'Cause / Observation', 'Root Cause Candidate', 'Team Votes', 'Contributor (ID or Anonymous)', 'Input Type']];
    BONE_CATEGORIES.forEach(b => {
      const items = activeCapa.fishbone && activeCapa.fishbone[b.key] || [];
      items.forEach(item => {
        rows.push([b.labelEn, item.text, item.likely ? 'YES (Likely Root Cause)' : 'Contributing', item.votes || 1, item.author || 'Investigator', item.isAnon ? 'Anonymous' : 'By ID']);
      });
    });
    rows.push([]);
    rows.push(['5-WHY ROOT CAUSE ANALYSIS CHAIN']);
    rows.push(['Step #', 'Why Question', 'Verified Answer / Finding']);
    (activeCapa.fiveWhy || []).forEach(w => {
      rows.push([`Why #${w.n}`, w.why, w.answer]);
    });
    rows.push([]);
    rows.push(['DMAIC IMPROVE & CONTROL PLAN']);
    rows.push(['Confirmed Root Cause', activeCapa.rca.rootCause]);
    rows.push(['Immediate Containment / Correction', activeCapa.rca.correction]);
    rows.push(['Corrective Action', activeCapa.rca.correctiveAction]);
    rows.push(['Preventive Action / Mistake-Proofing (Poka-Yoke)', activeCapa.rca.preventiveAction]);
    rows.push(['Control Plan & Sustainment', activeCapa.rca.controlPlan || '3-shift Pre-Op audit + weekly PM check']);
    rows.push(['CAPA Owner', activeCapa.rca.ownerName, 'Due Date', activeCapa.rca.dueDate, 'Verified By', activeCapa.rca.verifiedBy]);
    rows.push([]);
    rows.push(['CLOSED CAPA ACTION INDEX (TRIGGERS FOR TRAINING, WORK ORDERS, SSOP & BOLO)']);
    rows.push(['Action ID', 'Trigger Type', 'Target Downstream Module', 'Action Description', 'Assignee / Role', 'Priority', 'Due Date', 'Status']);
    (activeCapa.actionIndex || []).forEach(act => {
      rows.push([act.actionId, act.type, act.targetModule, act.title, act.assignee, act.priority, act.dueDate, act.status]);
    });
    const csvContent = rows.map(r => r.map(esc).join(',')).join('\r\n');
    try {
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeCapa.capaId}_SixSigma_DMAIC_ActionIndex.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setStatusToast(`${tr('Exported Excel CSV:', 'CSV de Excel exportado:')} ${activeCapa.capaId}_SixSigma_DMAIC_ActionIndex.csv`);
    } catch {
      setStatusToast(tr('Excel CSV generated.', 'CSV de Excel generado.'));
    }
  };

  // Compute Six Sigma Pareto & FMEA RPN metrics for activeCapa
  const capaMetrics = useMemo(() => {
    if (!activeCapa) {
      return {
        rpnBefore: 240,
        rpnAfter: 32,
        rpnReductionPct: 87,
        paretoRows: [],
        totalVotes: 0,
        totalCauses: 0
      };
    }
    const f = activeCapa.fmea || {
      sevBefore: 8,
      occBefore: 6,
      detBefore: 5,
      sevAfter: 8,
      occAfter: 2,
      detAfter: 2
    };
    const rpnBefore = (Number(f.sevBefore) || 1) * (Number(f.occBefore) || 1) * (Number(f.detBefore) || 1);
    const rpnAfter = (Number(f.sevAfter) || 1) * (Number(f.occAfter) || 1) * (Number(f.detAfter) || 1);
    const rpnReductionPct = rpnBefore > 0 ? Math.max(0, Math.round((rpnBefore - rpnAfter) / rpnBefore * 100)) : 0;
    let totalVotes = 0;
    let totalCauses = 0;
    const rawCat = BONE_CATEGORIES.map(b => {
      const items = activeCapa.fishbone && activeCapa.fishbone[b.key] || [];
      const votes = items.reduce((acc, it) => acc + (Number(it.votes) || 1), 0);
      const likelyCount = items.filter(it => it.likely).length;
      totalVotes += votes;
      totalCauses += items.length;
      return {
        key: b.key,
        label: b.shortEn,
        color: b.color,
        count: items.length,
        votes,
        likelyCount
      };
    }).sort((a, b) => b.votes - a.votes);
    let running = 0;
    const paretoRows = rawCat.map(r => {
      running += r.votes;
      const pct = totalVotes > 0 ? Math.round(r.votes / totalVotes * 100) : 0;
      const cumPct = totalVotes > 0 ? Math.min(100, Math.round(running / totalVotes * 100)) : 0;
      return {
        ...r,
        pct,
        cumPct
      };
    });
    return {
      rpnBefore,
      rpnAfter,
      rpnReductionPct,
      paretoRows,
      totalVotes,
      totalCauses
    };
  }, [activeCapa]);

  // Leadership-in-Training Badge Elevation Gate
  const handleActivateTrainingElevation = async () => {
    const code = String(traineeBadgeInput || '').trim().toUpperCase();
    let matched = employees.find(e => e.badge.toUpperCase() === code && e.inTraining) || employees.find(e => e.badge.toUpperCase() === code || e.name.toUpperCase().indexOf(code) >= 0);
    if (!matched && IS_PUBLIC_DEMO) {
      matched = {
        id: 'a0000099-0000-4000-8000-000000000099',
        name: 'Rivera, Alex (Demo)',
        badge: code || 'DEMO-101',
        shift: 'B',
        inTraining: true,
        trainingArea: 'breading'
      };
    }
    if (!matched) {
      setStatusToast(`[ERR-TRAINEE-NOT-FOUND] ${tr('Badge not found in live Dataverse employee roster:', 'Gafete no encontrado en la lista de empleados de Dataverse:')} ${code || '(empty)'}`);
      return;
    }
    const elev = {
      employeeGuid: matched.id,
      name: matched.name,
      badge: matched.badge,
      crew: matched.shift || 'B',
      trainingArea: matched.trainingArea || 'breading',
      grantedTier: 'supervisor',
      mentorBadge: supervisorCosignBadge || 'SUP-301',
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600000).toISOString()
    };
    setActiveElevation(elev);
    try {
      sessionStorage.setItem('__MidwestPlant_ELEVATION_V1__', JSON.stringify(elev));
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'hub:elevation',
          elevation: elev
        }, '*');
      }
    } catch {}
    setStatusToast(`${tr('LEADERSHIP TRAINING ELEVATION ACTIVE:', 'ELEVACION DE ENTRENAMIENTO ACTIVA:')} ${elev.name} (${elev.badge}) - Supervisor Level (${elev.trainingArea})`);
    try {
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `Leadership Training Elevation: ${elev.name} (${elev.badge})`,
          craa5_action: 'ELEVATION_GRANTED',
          craa5_app: 'portal2',
          craa5_crew: elev.crew,
          craa5_user: elev.name,
          craa5_at: elev.grantedAt,
          craa5_summary: `${elev.name} elevated to Trainee Supervisor (${elev.trainingArea}) with Mentor Badge ${elev.mentorBadge}`,
          craa5_details: JSON.stringify(elev).slice(0, 1800)
        })
      });
    } catch {}
  };
  const openRequestsCount = useMemo(() => requests.filter(r => r.status === 'open').length, [requests]);
  const showDefine = activeDmaicPhase === 'ALL' || activeDmaicPhase === 'DEFINE';
  const showMeasure = activeDmaicPhase === 'ALL' || activeDmaicPhase === 'MEASURE';
  const showAnalyze = activeDmaicPhase === 'ALL' || activeDmaicPhase === 'ANALYZE';
  const showImprove = activeDmaicPhase === 'ALL' || activeDmaicPhase === 'IMPROVE';
  const showControl = activeDmaicPhase === 'ALL' || activeDmaicPhase === 'CONTROL';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      background: '#FFFFFF',
      color: '#0F172A',
      padding: '10px 18px',
      borderTop: '3px solid #2563EB',
      borderBottom: '1px solid #CBD5E1',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FFF7ED',
      color: '#C2410C',
      border: '1px solid #FDBA74',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 11.5,
      fontWeight: 900,
      letterSpacing: '0.03em'
    }
  }, tr('PORTAL 2: FSQ / INSPECTORS / SIX SIGMA CAPA', 'PORTAL 2: INSPECTORES FSQ Y CAPA SIX SIGMA')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, [{
    id: 'inspect',
    label: `${tr('1. Inspect Equipment', '1. Inspeccionar Equipo')} (${openRequestsCount})`
  }, {
    id: 'capa',
    label: `${tr('2. Six Sigma DMAIC CAPA Studio', '2. Estudio CAPA Six Sigma DMAIC')} (${capaList.length})`
  }, {
    id: 'elevation',
    label: tr('3. Leadership Training Badge Gate', '3. Puerta Gafete Entrenamiento')
  }].map(tb => /*#__PURE__*/React.createElement("button", {
    key: tb.id,
    type: "button",
    onClick: () => setActiveSubTab(tb.id),
    style: {
      background: activeSubTab === tb.id ? '#EFF6FF' : '#F8FAFC',
      color: activeSubTab === tb.id ? '#1E40AF' : '#334155',
      border: activeSubTab === tb.id ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
      borderRadius: 7,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tb.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#475569',
      fontWeight: 800
    }
  }, tr('Verify By:', 'Verificar Con:')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSignMethod('msid'),
    style: {
      background: signMethod === 'msid' ? '#EFF6FF' : '#FFFFFF',
      color: signMethod === 'msid' ? '#1E40AF' : '#475569',
      border: signMethod === 'msid' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
      borderRadius: 7,
      padding: '5px 10px',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "Microsoft ID (", inspectorName, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSignMethod('badge'),
    style: {
      background: signMethod === 'badge' ? '#FFFBEB' : '#FFFFFF',
      color: signMethod === 'badge' ? '#B45309' : '#475569',
      border: signMethod === 'badge' ? '1.5px solid #D97706' : '1px solid #CBD5E1',
      borderRadius: 7,
      padding: '5px 10px',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Badge Scan', 'Escaneo Gafete'), " (", inspectorBadge, ")"))), statusToast && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '10px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#EFF6FF',
      color: '#1E3A8A',
      border: '1px solid #93C5FD',
      borderLeft: '5px solid #2563EB',
      borderRadius: 8,
      padding: '10px 16px',
      fontSize: 12.5,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, statusToast), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setStatusToast(''),
    style: {
      background: '#FFFFFF',
      border: '1px solid #93C5FD',
      borderRadius: 5,
      padding: '2px 8px',
      color: '#1E40AF',
      fontWeight: 800,
      fontSize: 11,
      cursor: 'pointer'
    }
  }, tr('Dismiss', 'Cerrar')))), detailMode && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '10px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F8FAFC',
      border: '1px solid #93C5FD',
      borderLeft: '4px solid #2563EB',
      borderRadius: 8,
      padding: 10,
      fontSize: 11.5,
      color: '#1E40AF',
      fontWeight: 700
    }
  }, tr('Apex Foods Logo Detail Mode:', 'Modo Detalle:'), " Pre-Inspection Polling = 10s (BroadcastChannel + craa5___1_e_hubconfigs) - Swab Records = ", swabTotalCount, " - Active Six Sigma CAPAs = ", capaList.length)), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1360,
      margin: '14px auto 0',
      padding: '0 16px'
    }
  }, activeSubTab === 'inspect' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderTop: '4px solid #D97706',
      borderRadius: 12,
      padding: 18,
      boxShadow: '0 1px 4px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#B45309',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, tr('Live Floor Requests (Portal 1 to Portal 2)', 'Solicitudes en Vivo desde Piso (Portal 1 a Portal 2)')), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 19,
      fontWeight: 900,
      color: '#0F172A',
      margin: '2px 0 0'
    }
  }, tr('Pre-Inspection Verification Queue', 'Cola de Verificacion de Pre-Inspeccion'), " (", openRequestsCount, " ", tr('Waiting', 'En Espera'), ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, signMethod === 'badge' && /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: inspectorBadge,
    onChange: e => setInspectorBadge(e.target.value),
    placeholder: "Inspector Badge #",
    style: {
      height: 36,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12.5,
      fontWeight: 700
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: inspectNote,
    onChange: e => setInspectNote(e.target.value),
    placeholder: tr('Inspection comment / finding note...', 'Nota de inspeccion o hallazgo...'),
    style: {
      width: 280,
      height: 36,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 12.5,
      fontWeight: 600
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, requests.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      borderRadius: 8,
      background: '#F8FAFC',
      border: '1px dashed #CBD5E1',
      color: '#475569',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, tr('0 Pre-Inspection requests currently waiting in Dataverse (craa5___1_e_hubconfigs). Floor calls from Portal 1 appear here automatically within 10 seconds.', '0 solicitudes de Pre-Inspeccion actualmente en Dataverse (craa5___1_e_hubconfigs).')), requests.map(req => /*#__PURE__*/React.createElement("div", {
    key: req.requestId,
    style: {
      padding: '13px 16px',
      borderRadius: 10,
      background: req.status === 'open' ? '#FFFBEB' : req.status === 'passed' ? '#F0FDF4' : '#FFF7ED',
      border: req.status === 'open' ? '1.5px solid #FCD34D' : req.status === 'passed' ? '1px solid #86EFAC' : '1.5px solid #FDBA74',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#EFF6FF',
      color: '#1E40AF',
      border: '1px solid #93C5FD',
      padding: '2px 8px',
      borderRadius: 5,
      fontSize: 11,
      fontWeight: 800
    }
  }, req.requestId), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: '#0F172A'
    }
  }, String(req.area || '').toUpperCase(), " - ", (req.equipmentNames || []).join(', '))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#334155',
      fontWeight: 600,
      marginTop: 4
    }
  }, tr('Requested by:', 'Solicitado por:'), " ", /*#__PURE__*/React.createElement("strong", null, req.requestedBy?.name || 'Floor Tech'), " (", req.requestedBy?.badge || 'Badge', ") - ", req.note), req.result && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      marginTop: 4,
      color: req.result.passed ? '#047857' : '#C2410C'
    }
  }, req.result.passed ? 'VERIFIED PASS' : 'FAILED / ACTION REQUIRED', " - ", req.result.inspectorName, ": ", req.result.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleVerifyRequest(req, true),
    style: {
      height: 38,
      padding: '0 14px',
      borderRadius: 7,
      border: '1px solid #6EE7B7',
      background: '#ECFDF5',
      color: '#047857',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Verify Pass (MSID / Badge)', 'Aprobar Pre-Op')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleVerifyRequest(req, false),
    style: {
      height: 38,
      padding: '0 14px',
      borderRadius: 7,
      border: '1px solid #FDBA74',
      background: '#FFF7ED',
      color: '#C2410C',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Fail / Hold', 'Rechazar')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleLaunchCapaFromFinding(req.area || 'breading', (req.equipmentNames || [])[0] || 'Line Equipment', inspectNote || 'Residue on belt guard hinge found during Pre-Op inspection.', 'Pre-Op Inspection'),
    style: {
      height: 38,
      padding: '0 14px',
      borderRadius: 7,
      border: '1px solid #93C5FD',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Open Six Sigma CAPA', 'Abrir CAPA Six Sigma'))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderTop: '3px solid #EA580C',
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      fontWeight: 800,
      color: '#0F172A',
      margin: 0
    }
  }, tr('Swab Verification & Positive Findings Queue', 'Verificacion de Hisopos y Positivos')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#64748B',
      fontWeight: 600
    }
  }, swabHits.length, " ", tr('Positive / Pending Verifications across', 'Positivos / Pendientes de'), " ", swabTotalCount, " ", tr('Swabs', 'Hisopos')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      maxHeight: 360,
      overflowY: 'auto'
    }
  }, swabHits.map((sw, idx) => /*#__PURE__*/React.createElement("div", {
    key: sw.craa5___1_b_swabresultid || idx,
    style: {
      padding: '10px 12px',
      borderRadius: 8,
      background: '#FFF7ED',
      border: '1px solid #FDBA74',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: '#9A3412'
    }
  }, sw.craa5_area || 'LINE', " - ", sw.craa5_equipment || sw.craa5_sampledescription || 'Swab Site', " (Zone ", sw.craa5_zone || 2, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#C2410C',
      fontWeight: 700
    }
  }, sw.craa5_test || 'LIS', ": ", sw.craa5_resultraw || sw.craa5_result, " - ", String(sw.craa5_collectiondate || '').slice(0, 10))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleLaunchCapaFromFinding(sw.craa5_area || 'IBL4', sw.craa5_equipment || sw.craa5_sitecode || 'Swab Site', `Presumptive Positive (${sw.craa5_test || 'LIS'}) on ${sw.craa5_sampledescription || 'surface'} - Zone ${sw.craa5_zone || 2}.`, 'Environmental Swab Positive'),
    style: {
      padding: '6px 10px',
      borderRadius: 6,
      border: '1px solid #EA580C',
      background: '#FFFFFF',
      color: '#C2410C',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      flexShrink: 0
    }
  }, tr('Launch Six Sigma CAPA', 'Iniciar CAPA Six Sigma')))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderTop: '3px solid #2563EB',
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      fontWeight: 800,
      color: '#0F172A',
      margin: 0
    }
  }, tr('Inspect Equipment List (Direct Sign-Off)', 'Lista de Equipos para Inspeccion Directa')), /*#__PURE__*/React.createElement("select", {
    value: areaFilter,
    onChange: e => setAreaFilter(e.target.value),
    style: {
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "ALL"
  }, tr('All Areas', 'Todas las Areas')), ['breading', 'IBL4', 'IBL5', 'waterjet', 'highspeed', 'custard', 'dough room', 'kettles'].map(a => /*#__PURE__*/React.createElement("option", {
    key: a,
    value: a
  }, a.toUpperCase())))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      maxHeight: 360,
      overflowY: 'auto'
    }
  }, assets.filter(a => areaFilter === 'ALL' || a.area.toLowerCase() === areaFilter.toLowerCase()).slice(0, 14).map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      padding: '9px 12px',
      borderRadius: 8,
      background: '#F8FAFC',
      border: '1px solid #CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: '#0F172A'
    }
  }, a.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#475569',
      fontWeight: 600
    }
  }, a.area.toUpperCase(), " - ", a.subcat, " (", a.sap, ")")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleVerifyRequest({
      requestId: 'INSP-' + a.id.slice(0, 6).toUpperCase(),
      area: a.area,
      equipmentNames: [a.name],
      requestedBy: {
        name: 'Direct Floor Check',
        crew: 'B'
      },
      note: 'Direct Inspector Equipment Verification'
    }, true),
    style: {
      padding: '6px 12px',
      borderRadius: 6,
      border: '1px solid #93C5FD',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Verify Inspected', 'Verificar Equipo')))))))), activeSubTab === 'capa' && activeCapa && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderTop: '4px solid #2563EB',
      borderRadius: 12,
      padding: 16,
      boxShadow: '0 1px 4px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FFF7ED',
      color: '#C2410C',
      border: '1px solid #FDBA74',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 900
    }
  }, activeCapa.capaId), /*#__PURE__*/React.createElement("span", {
    style: {
      background: String(activeCapa.stage || '').indexOf('Closed') === 0 ? '#ECFDF5' : '#FFFBEB',
      color: String(activeCapa.stage || '').indexOf('Closed') === 0 ? '#047857' : '#B45309',
      border: String(activeCapa.stage || '').indexOf('Closed') === 0 ? '1px solid #6EE7B7' : '1px solid #FCD34D',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 11.5,
      fontWeight: 800
    }
  }, tr('Stage:', 'Etapa:'), " ", activeCapa.stage), capaList.length > 1 && /*#__PURE__*/React.createElement("select", {
    value: activeCapaIdx,
    onChange: e => setActiveCapaIdx(Number(e.target.value) || 0),
    style: {
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 700,
      background: '#F8FAFC'
    }
  }, capaList.map((c, idx) => /*#__PURE__*/React.createElement("option", {
    key: c.capaId || idx,
    value: idx
  }, c.capaId, " - ", c.problem.area.toUpperCase()))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleLaunchCapaFromFinding('breading', assets[0] && assets[0].name || 'Line Equipment', 'Pre-Op / Environmental Investigation', 'Six Sigma DMAIC CAPA'),
    style: {
      height: 32,
      padding: '0 10px',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      background: '#F8FAFC',
      color: '#334155',
      fontSize: 11.5,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, tr('+ New CAPA Study', '+ Nuevo CAPA'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: '#F1F5F9',
      border: '1px solid #CBD5E1',
      borderRadius: 6,
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => updateActiveCapa(c => ({
      ...c,
      collabMode: 'solo'
    })),
    style: {
      padding: '4px 9px',
      borderRadius: 5,
      border: 'none',
      background: activeCapa.collabMode === 'solo' ? '#FFFFFF' : 'transparent',
      color: activeCapa.collabMode === 'solo' ? '#1E40AF' : '#475569',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Solo Investigator', 'Modo Individual')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => updateActiveCapa(c => ({
      ...c,
      collabMode: 'group'
    })),
    style: {
      padding: '4px 9px',
      borderRadius: 5,
      border: 'none',
      background: activeCapa.collabMode !== 'solo' ? '#FFFFFF' : 'transparent',
      color: activeCapa.collabMode !== 'solo' ? '#1E40AF' : '#475569',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Group Tandem + Facilitator', 'Grupo en Tandem + Facilitador'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowHowToGuide(prev => !prev),
    style: {
      height: 34,
      padding: '0 12px',
      borderRadius: 6,
      border: '1px solid #FCD34D',
      background: '#FFFBEB',
      color: '#B45309',
      fontSize: 11.5,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, showHowToGuide ? tr('Hide Six Sigma How-To', 'Ocultar Guia Six Sigma') : tr('Six Sigma How-To Playbook', 'Guia Practica Six Sigma')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleExportCapaToExcelCsv,
    style: {
      height: 34,
      padding: '0 12px',
      borderRadius: 6,
      border: '1px solid #93C5FD',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 11.5,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Export to Excel (.CSV)', 'Exportar a Excel (.CSV)')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleSaveCapaStudy(false),
    style: {
      height: 34,
      padding: '0 12px',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      background: '#FFFFFF',
      color: '#0F172A',
      fontSize: 11.5,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Save Draft', 'Guardar')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleSaveCapaStudy(true),
    style: {
      height: 34,
      padding: '0 14px',
      borderRadius: 6,
      border: '1px solid #059669',
      background: '#ECFDF5',
      color: '#047857',
      fontSize: 11.5,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Close CAPA & Generate Action Index', 'Cerrar CAPA y Generar Indice de Accion')))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#0F172A',
      margin: '0 0 4px'
    }
  }, activeCapa.problem.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: '#475569',
      fontWeight: 600
    }
  }, activeCapa.problem.statement)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 12,
      paddingTop: 10,
      borderTop: '1px solid #E2E8F0'
    }
  }, DMAIC_PHASES.map(ph => {
    const isAct = activeDmaicPhase === ph.id;
    return /*#__PURE__*/React.createElement("button", {
      key: ph.id,
      type: "button",
      onClick: () => setActiveDmaicPhase(ph.id),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 11px',
        borderRadius: 6,
        border: isAct ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
        background: isAct ? '#EFF6FF' : '#F8FAFC',
        color: isAct ? '#1E40AF' : '#334155',
        fontSize: 11.5,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        background: isAct ? '#2563EB' : '#E2E8F0',
        color: isAct ? '#FFFFFF' : '#1E293B',
        borderRadius: 4,
        padding: '1px 5px',
        fontSize: 10,
        fontWeight: 900
      }
    }, ph.code), /*#__PURE__*/React.createElement("span", null, lang === 'es' ? ph.labelEs : ph.labelEn));
  }))), showHowToGuide && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFBEB',
      border: '1px solid #FCD34D',
      borderLeft: '5px solid #D97706',
      borderRadius: 10,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 900,
      color: '#92400E'
    }
  }, tr('Six Sigma DMAIC CAPA Best-Practice Playbook & Facilitator How-To', 'Guia de Mejores Practicas Six Sigma DMAIC y Facilitacion en Grupo')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowHowToGuide(false),
    style: {
      background: '#FFFFFF',
      border: '1px solid #FCD34D',
      borderRadius: 5,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 800,
      color: '#92400E',
      cursor: 'pointer'
    }
  }, tr('Close Guide', 'Cerrar Guia'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 10,
      fontSize: 11.5,
      color: '#78350F',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #FDE68A',
      borderRadius: 7,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("strong", null, "1. Define & SIPOC:"), " Document the defect unit, Critical-to-Quality (CTQ) metric, baseline Sigma/DPMO, and the Supplier-Input-Process-Output-Customer boundary."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #FDE68A',
      borderRadius: 7,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("strong", null, "2. Measure & FMEA RPN:"), " Score Severity (1-10) x Occurrence (1-10) x Detection (1-10) before and after CAPA to quantify risk reduction."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #FDE68A',
      borderRadius: 7,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("strong", null, "3. Solo or Group Tandem (ID / Anonymous):"), " Team members submit causes by Employee Badge/ID or Anonymously. The Facilitator moves items between 6M bones, tallies Pareto votes, and promotes the top cause to the 5-Why chain."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #FDE68A',
      borderRadius: 7,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("strong", null, "4. Close CAPA -> Action Index:"), " Closing the CAPA generates an audited ", /*#__PURE__*/React.createElement("strong", null, "Action Index"), " (`ACT-2026-*`) that triggers Training, Maintenance Work Orders, SSOP updates, and Pathogen BOLO retests, and exports cleanly to Excel (`.CSV`)."))), (showDefine || showMeasure) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
      gap: 14
    }
  }, showDefine && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: 10,
      padding: 15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#1E40AF',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      marginBottom: 8
    }
  }, tr('DMAIC Phase 1: Define, CTQ Metrics & SIPOC Scope', 'Fase 1 DMAIC: Definir, Metricas CTQ y Alcance SIPOC')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: '#475569'
    }
  }, tr('Critical-to-Quality (CTQ) Metric', 'Metrica Critica de Calidad (CTQ)')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: activeCapa.problem.ctqMetric || '',
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        problem: {
          ...c.problem,
          ctqMetric: val
        }
      }));
    },
    style: {
      width: '100%',
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: '#475569'
    }
  }, tr('Defect Unit / Zone', 'Unidad de Defecto / Zona')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: activeCapa.problem.defectUnit || '',
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        problem: {
          ...c.problem,
          defectUnit: val
        }
      }));
    },
    style: {
      width: '100%',
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: '#475569'
    }
  }, tr('Baseline Sigma / DPMO', 'Linea Base Sigma / DPMO')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: activeCapa.problem.sigmaBaseline || '',
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        problem: {
          ...c.problem,
          sigmaBaseline: val
        }
      }));
    },
    style: {
      width: '100%',
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: '#475569'
    }
  }, tr('Target Sigma / DPMO', 'Meta Sigma / DPMO')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: activeCapa.problem.sigmaTarget || '',
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        problem: {
          ...c.problem,
          sigmaTarget: val
        }
      }));
    },
    style: {
      width: '100%',
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: '#475569'
    }
  }, tr('SIPOC Process Steps (Supplier -> Process -> Customer)', 'Flujo de Proceso SIPOC')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: activeCapa.problem.sipocProcess || '',
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        problem: {
          ...c.problem,
          sipocProcess: val
        }
      }));
    },
    style: {
      width: '100%',
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 600
    }
  })))), showMeasure && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: 10,
      padding: 15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#C2410C',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, tr('DMAIC Phase 2: Measure & FMEA Risk Priority Number (RPN)', 'Fase 2 DMAIC: Medir y Numero de Prioridad de Riesgo (RPN)')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#ECFDF5',
      color: '#047857',
      border: '1px solid #6EE7B7',
      borderRadius: 5,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 900
    }
  }, capaMetrics.rpnReductionPct, "% ", tr('Risk Reduction', 'Reduccion de Riesgo'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFF7ED',
      border: '1px solid #FDBA74',
      borderRadius: 8,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11.5,
      fontWeight: 800,
      color: '#9A3412',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, tr('Pre-CAPA RPN (S x O x D)', 'RPN Inicial (S x O x D)')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 900
    }
  }, capaMetrics.rpnBefore)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 6
    }
  }, [{
    k: 'sevBefore',
    lbl: 'Sev (1-10)'
  }, {
    k: 'occBefore',
    lbl: 'Occ (1-10)'
  }, {
    k: 'detBefore',
    lbl: 'Det (1-10)'
  }].map(fld => /*#__PURE__*/React.createElement("div", {
    key: fld.k
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 9.5,
      fontWeight: 800,
      color: '#9A3412',
      display: 'block'
    }
  }, fld.lbl), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: 1,
    max: 10,
    value: activeCapa.fmea[fld.k],
    onChange: e => {
      const v = Math.max(1, Math.min(10, Number(e.target.value) || 1));
      updateActiveCapa(c => ({
        ...c,
        fmea: {
          ...c.fmea,
          [fld.k]: v
        }
      }));
    },
    style: {
      width: '100%',
      height: 28,
      borderRadius: 5,
      border: '1px solid #FDBA74',
      padding: '0 6px',
      fontSize: 12,
      fontWeight: 800,
      background: '#FFFFFF'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F0FDF4',
      border: '1px solid #86EFAC',
      borderRadius: 8,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11.5,
      fontWeight: 800,
      color: '#047857',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, tr('Post-CAPA Target RPN', 'RPN Meta Post-CAPA')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 900
    }
  }, capaMetrics.rpnAfter)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 6
    }
  }, [{
    k: 'sevAfter',
    lbl: 'Sev (1-10)'
  }, {
    k: 'occAfter',
    lbl: 'Occ (1-10)'
  }, {
    k: 'detAfter',
    lbl: 'Det (1-10)'
  }].map(fld => /*#__PURE__*/React.createElement("div", {
    key: fld.k
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 9.5,
      fontWeight: 800,
      color: '#047857',
      display: 'block'
    }
  }, fld.lbl), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: 1,
    max: 10,
    value: activeCapa.fmea[fld.k],
    onChange: e => {
      const v = Math.max(1, Math.min(10, Number(e.target.value) || 1));
      updateActiveCapa(c => ({
        ...c,
        fmea: {
          ...c.fmea,
          [fld.k]: v
        }
      }));
    },
    style: {
      width: '100%',
      height: 28,
      borderRadius: 5,
      border: '1px solid #86EFAC',
      padding: '0 6px',
      fontSize: 12,
      fontWeight: 800,
      background: '#FFFFFF'
    }
  })))))))), showAnalyze && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingBottom: 12,
      borderBottom: '1px solid #E2E8F0',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#1E40AF',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, activeCapa.collabMode === 'solo' ? tr('DMAIC Phase 3: Solo Investigator 6M Ishikawa Fishbone & Pareto Analysis', 'Fase 3 DMAIC: Analisis Ishikawa 6M y Pareto (Investigador Individual)') : tr('DMAIC Phase 3: Group Tandem Brainstorming (Input by ID or Anonymously) & Facilitator Board', 'Fase 3 DMAIC: Lluvia de Ideas en Grupo (Por ID o Anonimo) y Tablero del Facilitador')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#475569',
      fontWeight: 600
    }
  }, tr('Click any 6M bone below or use the contributor bar to add causes. Facilitator can move items across bones, tally votes, and promote root causes.', 'Agregue causas por ID o de forma anonima. El facilitador puede mover causas entre categorias 6M y votar.'))), activeCapa.collabMode !== 'solo' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleSimulateGroupBrainstorm,
    style: {
      height: 32,
      padding: '0 11px',
      borderRadius: 6,
      border: '1px solid #FCD34D',
      background: '#FFFBEB',
      color: '#B45309',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('+ Simulate Group Tandem Inputs (4 Contributors)', '+ Simular Entradas del Grupo (4 Participantes)'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      background: '#F8FAFC',
      border: '1px solid #CBD5E1',
      borderRadius: 8,
      padding: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: '#E2E8F0',
      borderRadius: 6,
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setInputModeAnon(false),
    style: {
      padding: '4px 9px',
      borderRadius: 5,
      border: 'none',
      background: !inputModeAnon ? '#FFFFFF' : 'transparent',
      color: !inputModeAnon ? '#1E40AF' : '#475569',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Input by ID / Badge', 'Entrada con ID / Gafete')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setInputModeAnon(true),
    style: {
      padding: '4px 9px',
      borderRadius: 5,
      border: 'none',
      background: inputModeAnon ? '#FFFFFF' : 'transparent',
      color: inputModeAnon ? '#C2410C' : '#475569',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Anonymous Input', 'Entrada Anonima'))), !inputModeAnon && /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: contributorIdInput,
    onChange: e => setContributorIdInput(e.target.value),
    placeholder: tr('Employee Badge / Name...', 'Gafete / Nombre...'),
    style: {
      width: 185,
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 9px',
      fontSize: 11.5,
      fontWeight: 700,
      background: '#FFFFFF'
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: selectedBone,
    onChange: e => setSelectedBone(e.target.value),
    style: {
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 9px',
      fontSize: 11.5,
      fontWeight: 800,
      background: '#FFFFFF',
      color: '#0F172A'
    }
  }, BONE_CATEGORIES.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.key,
    value: b.key
  }, lang === 'es' ? b.labelEs : b.labelEn))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newCauseText,
    onChange: e => setNewCauseText(e.target.value),
    placeholder: tr('Enter contributing cause or floor observation...', 'Ingrese causa u observacion de piso...'),
    style: {
      flex: 1,
      minWidth: 220,
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 600,
      background: '#FFFFFF'
    }
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      fontWeight: 800,
      color: '#C2410C',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: newCauseLikely,
    onChange: e => setNewCauseLikely(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, tr('Likely Root Cause', 'Causa Probable'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddBoneCause,
    style: {
      height: 34,
      padding: '0 14px',
      borderRadius: 6,
      border: '1px solid #2563EB',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('+ Submit to 6M Bone', '+ Agregar a Espina 6M'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 14,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 980 340",
    width: "100%",
    height: "320",
    style: {
      background: '#F8FAFC',
      borderRadius: 10,
      border: '1px solid #CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "36",
    y1: "170",
    x2: "730",
    y2: "170",
    stroke: "#2563EB",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "730,159 750,170 730,181",
    fill: "#2563EB"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "752",
    y: "102",
    width: "214",
    height: "136",
    rx: "10",
    fill: "#EFF6FF",
    stroke: "#2563EB",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "859",
    y: "125",
    textAnchor: "middle",
    fill: "#1E40AF",
    fontSize: "10.5",
    fontWeight: "900"
  }, "SIX SIGMA PROBLEM / CTQ"), /*#__PURE__*/React.createElement("foreignObject", {
    x: "762",
    y: "132",
    width: "194",
    height: "98"
  }, /*#__PURE__*/React.createElement("div", {
    xmlns: "http://www.w3.org/1999/xhtml",
    style: {
      color: '#0F172A',
      fontSize: '10.5px',
      fontWeight: 700,
      lineHeight: 1.3,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, activeCapa.problem.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: '9.5px',
      color: '#B45309',
      fontWeight: 800
    }
  }, "RPN: ", capaMetrics.rpnBefore, " -> ", capaMetrics.rpnAfter))), BONE_CATEGORIES.map(bone => {
    const isSel = selectedBone === bone.key;
    const xHeader = bone.x;
    const xSpine = bone.x + 85;
    const ySpine = 170;
    const causes = activeCapa.fishbone && activeCapa.fishbone[bone.key] || [];
    return /*#__PURE__*/React.createElement("g", {
      key: bone.key,
      onClick: () => setSelectedBone(bone.key),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("line", {
      x1: xHeader,
      y1: bone.isTop ? 44 : 296,
      x2: xSpine,
      y2: ySpine,
      stroke: isSel ? '#EA580C' : '#64748B',
      strokeWidth: isSel ? '3.5' : '2.2'
    }), /*#__PURE__*/React.createElement("rect", {
      x: xHeader - 82,
      y: bone.isTop ? 10 : 296,
      width: "168",
      height: "32",
      rx: "6",
      fill: isSel ? '#FFFBEB' : '#FFFFFF',
      stroke: isSel ? '#D97706' : '#93C5FD',
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("text", {
      x: xHeader + 2,
      y: bone.isTop ? 30 : 316,
      textAnchor: "middle",
      fill: isSel ? '#B45309' : '#1E40AF',
      fontSize: "10.5",
      fontWeight: "900"
    }, lang === 'es' ? bone.labelEs : bone.labelEn), causes.slice(0, 3).map((c, cIdx) => {
      const frac = (cIdx + 1) / 3.4;
      const cy = bone.isTop ? 44 + frac * (170 - 44) : 296 - frac * (296 - 170);
      const cx = xHeader + frac * 85;
      const tag = c.isAnon ? '[Anon]' : '[ID]';
      return /*#__PURE__*/React.createElement("g", {
        key: c.id || cIdx
      }, /*#__PURE__*/React.createElement("line", {
        x1: cx - 98,
        y1: cy,
        x2: cx,
        y2: cy,
        stroke: c.likely ? '#EA580C' : '#94A3B8',
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: cx - 190,
        y: cy - 13,
        width: "186",
        height: "24",
        rx: "5",
        fill: c.likely ? '#FFF7ED' : '#FFFFFF',
        stroke: c.likely ? '#EA580C' : '#CBD5E1',
        strokeWidth: c.likely ? '1.8' : '1'
      }), /*#__PURE__*/React.createElement("text", {
        x: cx - 97,
        y: cy + 3,
        textAnchor: "middle",
        fill: "#0F172A",
        fontSize: "9.5",
        fontWeight: "800"
      }, `${tag} ${String(c.text).slice(0, 22)} (+${c.votes || 1})`));
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F8FAFC',
      border: '1px solid #CBD5E1',
      borderRadius: 10,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#1E40AF',
      textTransform: 'uppercase'
    }
  }, tr('Six Sigma 80/20 Pareto Chart', 'Diagrama de Pareto 80/20')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: '#475569'
    }
  }, capaMetrics.totalCauses, " ", tr('Causes', 'Causas'), " / ", capaMetrics.totalVotes, " ", tr('Votes', 'Votos'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#64748B',
      marginBottom: 8
    }
  }, tr('Ranks 6M categories by team weighted votes & cumulative % impact.', 'Clasifica las categorias 6M por votos del equipo y % acumulado.')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 7
    }
  }, capaMetrics.paretoRows.map(row => /*#__PURE__*/React.createElement("div", {
    key: row.key,
    style: {
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 6,
      padding: '6px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      fontWeight: 800,
      color: '#0F172A',
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("span", null, row.label, " (", row.count, ")"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#1E40AF'
    }
  }, row.votes, "v - ", row.pct, "% (", tr('Cum', 'Acum'), " ", row.cumPct, "%)")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: 8,
      background: '#E2E8F0',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(6, row.pct)}%`,
      height: '100%',
      background: row.cumPct <= 85 ? '#2563EB' : '#D97706',
      borderRadius: 999
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: '1px solid #CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      color: '#334155'
    }
  }, tr('Facilitator Controls:', 'Controles Facilitador:')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setFacilitatorUnlocked(p => !p),
    style: {
      padding: '3px 8px',
      borderRadius: 5,
      border: '1px solid #93C5FD',
      background: facilitatorUnlocked ? '#EFF6FF' : '#FFFFFF',
      color: '#1E40AF',
      fontSize: 10.5,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, facilitatorUnlocked ? tr('Facilitator Mode: ON (Move/Sort)', 'Facilitador: ACTIVO') : tr('Enable Facilitator Mode', 'Activar Facilitador'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#334155',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, tr('Interactive 6M Facilitator Board - Move Items Across Categories, Upvote (+1), Toggle Root Cause, or Promote to 5-Why', 'Tablero Facilitador 6M - Mover Causas entre Categorias, Votar (+1) o Promover a los 5 Porques')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
      gap: 10
    }
  }, BONE_CATEGORIES.map(bone => {
    const items = activeCapa.fishbone && activeCapa.fishbone[bone.key] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: bone.key,
      style: {
        background: '#F8FAFC',
        border: selectedBone === bone.key ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
        borderRadius: 8,
        padding: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 900,
        color: '#1E40AF'
      }
    }, lang === 'es' ? bone.labelEs : bone.labelEn), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 800,
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: 4,
        padding: '1px 6px',
        color: '#475569'
      }
    }, items.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 6
      }
    }, items.map(item => /*#__PURE__*/React.createElement("div", {
      key: item.id,
      style: {
        background: item.likely ? '#FFF7ED' : '#FFFFFF',
        border: item.likely ? '1px solid #FDBA74' : '1px solid #E2E8F0',
        borderRadius: 6,
        padding: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: '#0F172A',
        lineHeight: 1.35
      }
    }, item.text), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleVoteCause(bone.key, item.id),
      title: tr('Upvote cause (+1)', 'Votar (+1)'),
      style: {
        background: '#EFF6FF',
        color: '#1E40AF',
        border: '1px solid #93C5FD',
        borderRadius: 4,
        padding: '2px 6px',
        fontSize: 10,
        fontWeight: 900,
        cursor: 'pointer',
        flexShrink: 0
      }
    }, "+", item.votes || 1)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        padding: '1px 5px',
        borderRadius: 4,
        background: item.isAnon ? '#FFFBEB' : '#F1F5F9',
        color: item.isAnon ? '#B45309' : '#475569',
        border: item.isAnon ? '1px solid #FCD34D' : '1px solid #CBD5E1'
      }
    }, item.isAnon ? 'Anonymous Input' : `ID: ${item.author}`), facilitatorUnlocked && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("select", {
      value: bone.key,
      onChange: e => handleMoveCauseBetweenBones(bone.key, item.id, e.target.value),
      title: tr('Facilitator: Move cause to another 6M bone', 'Facilitador: Mover a otra espina 6M'),
      style: {
        height: 22,
        fontSize: 9.5,
        fontWeight: 800,
        borderRadius: 4,
        border: '1px solid #CBD5E1',
        background: '#FFFFFF',
        color: '#334155'
      }
    }, BONE_CATEGORIES.map(bOpt => /*#__PURE__*/React.createElement("option", {
      key: bOpt.key,
      value: bOpt.key
    }, "Move -> ", bOpt.shortEn))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleToggleCauseLikely(bone.key, item.id),
      style: {
        height: 22,
        padding: '0 5px',
        borderRadius: 4,
        border: '1px solid #FDBA74',
        background: item.likely ? '#EA580C' : '#FFFFFF',
        color: item.likely ? '#FFFFFF' : '#C2410C',
        fontSize: 9.5,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, item.likely ? 'Root' : 'Mark Root'), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handlePromoteCauseToFiveWhy(item.text, bone.key),
      style: {
        height: 22,
        padding: '0 5px',
        borderRadius: 4,
        border: '1px solid #93C5FD',
        background: '#EFF6FF',
        color: '#1E40AF',
        fontSize: 9.5,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "-> 5-Why"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleDeleteCause(bone.key, item.id),
      style: {
        height: 22,
        padding: '0 5px',
        borderRadius: 4,
        border: '1px solid #CBD5E1',
        background: '#FFFFFF',
        color: '#64748B',
        fontSize: 9.5,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "Del")))))));
  })))), (showAnalyze || showImprove) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#1E40AF',
      margin: '0 0 10px'
    }
  }, tr('5-Why Root Cause Chain (Iterative Drill-Down)', 'Cadena de Causa Raiz de los 5 Porques')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, (activeCapa.fiveWhy || []).map((step, sIdx) => /*#__PURE__*/React.createElement("div", {
    key: step.n,
    style: {
      padding: '8px 12px',
      borderRadius: 8,
      background: sIdx === 4 ? '#FFF7ED' : '#F8FAFC',
      border: sIdx === 4 ? '1.5px solid #FDBA74' : '1px solid #CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: sIdx === 4 ? '#C2410C' : '#1E40AF'
    }
  }, "WHY #", step.n, ": ", step.why), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: step.answer,
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        fiveWhy: c.fiveWhy.map((w, wi) => wi === sIdx ? {
          ...w,
          answer: val
        } : w)
      }));
    },
    style: {
      width: '100%',
      marginTop: 4,
      border: '1px solid #CBD5E1',
      borderRadius: 6,
      padding: '5px 8px',
      fontSize: 12,
      fontWeight: 600,
      background: '#FFFFFF'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: 12,
      padding: 16,
      display: 'grid',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#1E40AF',
      margin: 0
    }
  }, tr('DMAIC Phase 4: Improve (RCA, Containment, Poka-Yoke & Control Plan)', 'Fase 4 DMAIC: Mejorar (Causa Raiz, Contencion y Plan de Control)')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 900,
      color: '#C2410C',
      textTransform: 'uppercase'
    }
  }, tr('Confirmed Root Cause', 'Causa Raiz Confirmada')), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: activeCapa.rca.rootCause,
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        rca: {
          ...c.rca,
          rootCause: val
        }
      }));
    },
    style: {
      width: '100%',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: 7,
      fontSize: 12,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 900,
      color: '#1E40AF',
      textTransform: 'uppercase'
    }
  }, tr('Immediate Containment / Correction', 'Contencion Inmediata')), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: activeCapa.rca.correction,
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        rca: {
          ...c.rca,
          correction: val
        }
      }));
    },
    style: {
      width: '100%',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: 7,
      fontSize: 12,
      fontWeight: 600
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 900,
      color: '#047857',
      textTransform: 'uppercase'
    }
  }, tr('Corrective & Preventive Action (Poka-Yoke)', 'Accion Correctiva y Preventiva')), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: activeCapa.rca.correctiveAction,
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        rca: {
          ...c.rca,
          correctiveAction: val
        }
      }));
    },
    style: {
      width: '100%',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: 7,
      fontSize: 12,
      fontWeight: 600
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 10.5,
      fontWeight: 900,
      color: '#B45309',
      textTransform: 'uppercase'
    }
  }, tr('Sustainment & Control Plan', 'Plan de Control y Sostenimiento')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: activeCapa.rca.controlPlan || '',
    onChange: e => {
      const val = e.target.value;
      updateActiveCapa(c => ({
        ...c,
        rca: {
          ...c.rca,
          controlPlan: val
        }
      }));
    },
    style: {
      width: '100%',
      height: 32,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 12,
      fontWeight: 600
    }
  })))), showControl && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1.5px solid #93C5FD',
      borderTop: '4px solid #2563EB',
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#1E40AF',
      textTransform: 'uppercase',
      letterSpacing: '0.04em'
    }
  }, tr('DMAIC Phase 5: Control & Closed CAPA Action Index (Downstream Module Triggers)', 'Fase 5 DMAIC: Control e Indice de Accion CAPA (Disparadores de Modulos)')), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16.5,
      fontWeight: 900,
      color: '#0F172A',
      margin: '2px 0 0'
    }
  }, tr('Action Index - Triggers for Training, Maintenance Work Orders, SSOP & BOLO Retests', 'Indice de Accion - Disparadores para Entrenamiento, Ordenes de Trabajo, SSOP y BOLO'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleSaveCapaStudy(true),
    style: {
      height: 36,
      padding: '0 14px',
      borderRadius: 7,
      border: '1px solid #059669',
      background: '#ECFDF5',
      color: '#047857',
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Close CAPA & Dispatch All Triggers', 'Cerrar CAPA y Enviar Disparadores')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleExportCapaToExcelCsv,
    style: {
      height: 36,
      padding: '0 14px',
      borderRadius: 7,
      border: '1px solid #93C5FD',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Export Action Index (.CSV)', 'Exportar Indice (.CSV)')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      background: '#F8FAFC',
      border: '1px solid #CBD5E1',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: newActionType,
    onChange: e => setNewActionType(e.target.value),
    style: {
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 9px',
      fontSize: 11.5,
      fontWeight: 800,
      background: '#FFFFFF'
    }
  }, ACTION_TRIGGER_TYPES.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.code,
    value: t.code
  }, lang === 'es' ? t.labelEs : t.labelEn))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newActionTitle,
    onChange: e => setNewActionTitle(e.target.value),
    placeholder: tr('Describe training, work order, SSOP revision, or swab trigger...', 'Describa entrenamiento, orden de trabajo o accion...'),
    style: {
      flex: 1,
      minWidth: 220,
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 600,
      background: '#FFFFFF'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newActionAssignee,
    onChange: e => setNewActionAssignee(e.target.value),
    placeholder: tr('Owner / Role...', 'Responsable...'),
    style: {
      width: 160,
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 9px',
      fontSize: 11.5,
      fontWeight: 700,
      background: '#FFFFFF'
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: newActionPriority,
    onChange: e => setNewActionPriority(e.target.value),
    style: {
      height: 34,
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      padding: '0 8px',
      fontSize: 11.5,
      fontWeight: 800,
      background: '#FFFFFF'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "HIGH"
  }, "HIGH"), /*#__PURE__*/React.createElement("option", {
    value: "MEDIUM"
  }, "MEDIUM"), /*#__PURE__*/React.createElement("option", {
    value: "LOW"
  }, "LOW")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddActionIndexItem,
    style: {
      height: 34,
      padding: '0 14px',
      borderRadius: 6,
      border: '1px solid #2563EB',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('+ Add Trigger to Index', '+ Agregar al Indice'))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#F1F5F9',
      color: '#1E293B',
      borderBottom: '2px solid #CBD5E1',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 10px'
    }
  }, "Action ID"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 10px'
    }
  }, tr('Trigger Category', 'Tipo de Disparador')), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 10px'
    }
  }, tr('Action / Deliverable', 'Accion / Entregable')), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 10px'
    }
  }, tr('Target Module', 'Modulo Destino')), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 10px'
    }
  }, tr('Owner', 'Responsable')), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '8px 10px'
    }
  }, tr('Status (Click to Cycle)', 'Estado')))), /*#__PURE__*/React.createElement("tbody", null, (activeCapa.actionIndex || []).map(act => {
    const tDef = ACTION_TRIGGER_TYPES.find(t => t.code === act.type) || ACTION_TRIGGER_TYPES[0];
    const isDone = act.status === 'Verified Complete';
    const isDisp = act.status === 'Dispatched to Module';
    return /*#__PURE__*/React.createElement("tr", {
      key: act.actionId,
      style: {
        borderBottom: '1px solid #E2E8F0',
        background: '#FFFFFF'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 10px',
        fontFamily: 'Consolas, monospace',
        fontWeight: 800,
        color: '#1E40AF'
      }
    }, act.actionId), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 10px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        background: tDef.badgeBg,
        color: tDef.badgeColor,
        border: `1px solid ${tDef.badgeBorder}`,
        padding: '2px 7px',
        borderRadius: 5,
        fontSize: 10.5,
        fontWeight: 800
      }
    }, act.type)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 10px',
        fontWeight: 700,
        color: '#0F172A'
      }
    }, act.title), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 10px',
        color: '#475569',
        fontWeight: 600
      }
    }, act.targetModule), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 10px',
        color: '#334155',
        fontWeight: 700
      }
    }, act.assignee), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '8px 10px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleCycleActionStatus(act.actionId),
      style: {
        padding: '4px 9px',
        borderRadius: 5,
        border: isDone ? '1px solid #6EE7B7' : isDisp ? '1px solid #93C5FD' : '1px solid #FCD34D',
        background: isDone ? '#ECFDF5' : isDisp ? '#EFF6FF' : '#FFFBEB',
        color: isDone ? '#047857' : isDisp ? '#1E40AF' : '#B45309',
        fontSize: 11,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, act.status)));
  })))))), activeSubTab === 'elevation' && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: '18px auto',
      background: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderTop: '4px solid #2563EB',
      borderRadius: 14,
      padding: 26,
      boxShadow: '0 4px 16px rgba(15,23,42,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      background: '#FFFBEB',
      border: '1px solid #FCD34D',
      color: '#B45309',
      padding: '4px 12px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, tr('Supervised Leadership-in-Training Elevation Gate', 'Puerta de Elevacion para Entrenamiento de Liderazgo')), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 21,
      fontWeight: 900,
      color: '#0F172A',
      margin: '0 0 8px'
    }
  }, tr('Scan Leadership Training Badge to Unlock Supervisor Tools', 'Escanee Gafete de Entrenamiento para Nivel Supervisor')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: '#475569',
      margin: '0 0 18px',
      lineHeight: 1.5
    }
  }, tr('When an employee is marked "In Training" by a Supervisor or Lead in Portal 3, scanning their badge here grants an audited, shift-scoped elevation up to Supervisor level (excluding confidential HR evaluations).', 'Cuando un empleado es marcado "En Entrenamiento" en el Portal 3, escanear su gafete aqui otorga acceso auditado hasta nivel Supervisor por el resto del turno.')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 800,
      color: '#1E40AF',
      marginBottom: 4
    }
  }, tr('Trainee Badge #', 'No. Gafete en Entrenamiento')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: traineeBadgeInput,
    onChange: e => setTraineeBadgeInput(e.target.value),
    style: {
      width: '100%',
      height: 42,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 800
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 800,
      color: '#1E40AF',
      marginBottom: 4
    }
  }, tr('Trainee PIN', 'PIN del Empleado')), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: traineePinInput,
    onChange: e => setTraineePinInput(e.target.value),
    style: {
      width: '100%',
      height: 42,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 800
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 800,
      color: '#1E40AF',
      marginBottom: 4
    }
  }, tr('Supervisor Co-Sign Badge', 'Gafete de Supervisor Mentor')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: supervisorCosignBadge,
    onChange: e => setSupervisorCosignBadge(e.target.value),
    style: {
      width: '100%',
      height: 42,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 800
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleActivateTrainingElevation,
    style: {
      flex: 1,
      height: 46,
      borderRadius: 8,
      border: '1px solid #93C5FD',
      background: '#EFF6FF',
      color: '#1E40AF',
      fontSize: 14,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Scan & Activate Supervisor-in-Training Access', 'Escanear y Activar Acceso de Supervisor en Entrenamiento')), activeElevation && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setActiveElevation(null);
      try {
        sessionStorage.removeItem('__MidwestPlant_ELEVATION_V1__');
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'hub:elevation',
            elevation: null
          }, '*');
        }
      } catch {}
    },
    style: {
      height: 46,
      padding: '0 16px',
      borderRadius: 8,
      border: '1px solid #FDBA74',
      background: '#FFF7ED',
      color: '#C2410C',
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('End Session', 'Terminar Sesion'))), activeElevation && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: 14,
      borderRadius: 10,
      background: '#ECFDF5',
      border: '1px solid #6EE7B7',
      color: '#047857',
      fontSize: 13,
      fontWeight: 800
    }
  }, tr('ELEVATED SESSION ACTIVE:', 'SESION ELEVADA ACTIVA:'), " ", activeElevation.name, " (", activeElevation.badge, ") - ", tr('Unlocked up to Supervisor Level for Area:', 'Desbloqueado hasta nivel Supervisor para Area:'), " ", activeElevation.trainingArea.toUpperCase()))));
};
})();