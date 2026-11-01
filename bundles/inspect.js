(function() {
var React = window.React;
var {
  useState,
  useEffect,
  useMemo,
  useCallback
} = React;

// ============================================================================
// PORTAL 2: FSQ / SANITATION INSPECTORS, CI LEADS & ADMINS HUB
// File: P6.2 - inspector hub.txt
// Target Bundle: bundles/inspect.js
// Features:
//   1. Inspect Equipment & Live Pre-Inspection Verification (MSID or Badge Scan)
//   2. Swab Verification Queue (>1% Positive Hits & Vector Retest Sign-Off)
//   3. CAPA / Investigation Studio (Interactive SVG 6M Fishbone, 5-Why, RCA)
//   4. Leadership-in-Training Badge Scan Elevation Gate (Unlock up to Supervisor)
// Strictly 7-bit ASCII (0x00-0x7F) - Bilingual English / Espanol (MX)
// ============================================================================

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
  labelEn: '1. People (Manpower)',
  labelEs: '1. Personal',
  x: 170,
  yTop: 42,
  yBot: 298,
  isTop: true
}, {
  key: 'methods',
  labelEn: '2. Methods (Process/SSOP)',
  labelEs: '2. Metodos',
  x: 370,
  yTop: 42,
  yBot: 298,
  isTop: true
}, {
  key: 'equipment',
  labelEn: '3. Equipment (Machine)',
  labelEs: '3. Equipo',
  x: 570,
  yTop: 42,
  yBot: 298,
  isTop: true
}, {
  key: 'materials',
  labelEn: '4. Materials (Chemical)',
  labelEs: '4. Materiales',
  x: 170,
  yTop: 42,
  yBot: 298,
  isTop: false
}, {
  key: 'measurement',
  labelEn: '5. Measurement (Swab/ATP)',
  labelEs: '5. Medicion',
  x: 370,
  yTop: 42,
  yBot: 298,
  isTop: false
}, {
  key: 'environment',
  labelEn: '6. Environment (Room)',
  labelEs: '6. Ambiente',
  x: 570,
  yTop: 42,
  yBot: 298,
  isTop: false
}];
const DEFAULT_CAPA_LIST = [{
  capaId: 'CAPA-2026-104',
  stage: 'Root Cause',
  problem: {
    title: 'Breading Applicator Wire Belt - Pre-Op Protein/Residue Finding',
    statement: 'Pre-op inspection and ATP/swab check identified residual batter build-up on Breading Machine 1 return roller guard hinge prior to startup.',
    source: 'Pre-Op Inspection / Swab Verification',
    area: 'breading',
    equipment: 'brd - batter 12 (Breading Applicator Wire Belt)',
    findingDate: todayIso(),
    severity: 'High (Zone 1)',
    detectedBy: 'FSQ Inspector (M. Vance / T. vance)'
  },
  fishbone: {
    people: [{
      id: 'c1',
      text: 'New tech missed underside hinge latch release',
      likely: false
    }],
    methods: [{
      id: 'c2',
      text: 'SSOP step 2 did not specify unlatching lower return guard',
      likely: true
    }],
    equipment: [{
      id: 'c3',
      text: 'Quick-release pin stiff on Breading Machine 1 guard',
      likely: true
    }],
    materials: [{
      id: 'c4',
      text: 'Foam dwell time shortened by 3 mins',
      likely: false
    }],
    measurement: [{
      id: 'c5',
      text: 'Pre-inspection catch prior to ATP swab release',
      likely: false
    }],
    environment: [{
      id: 'c6',
      text: 'Low lighting under discharge transfer',
      likely: false
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
    ownerName: 'Carlos Mendez / Maintenance Lead',
    dueDate: todayIso(),
    verifiedBy: 'Verified via Microsoft ID'
  }
}];
var __MAIN_COMP__ = function InspectorFsqHub() {
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
  const [inspectorPin, setInspectorPin] = useState('1234');
  const [inspectorName, setInspectorName] = useState('FSQ Inspector (Microsoft ID)');
  const [statusToast, setStatusToast] = useState('');

  // Tab 1: Pre-Inspection & Equipment Inspection Queue
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [inspectNote, setInspectNote] = useState('');
  const [swabHits, setSwabHits] = useState([]);
  const [swabTotalCount, setSwabTotalCount] = useState(0);

  // Tab 2: CAPA / Fishbone / 5-Why / RCA Studio
  const [capaList, setCapaList] = useState(DEFAULT_CAPA_LIST);
  const [activeCapaIdx, setActiveCapaIdx] = useState(0);
  const [selectedBone, setSelectedBone] = useState('methods');
  const [newCauseText, setNewCauseText] = useState('');
  const [newCauseLikely, setNewCauseLikely] = useState(true);

  // Tab 3: Leadership-in-Training Badge Scan Elevation Gate
  const [employees, setEmployees] = useState([]);
  const [traineeBadgeInput, setTraineeBadgeInput] = useState('DEMO-101');
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
  const activeCapa = capaList[activeCapaIdx] || capaList[0];

  // Resolve Inspector identity from engine if available
  useEffect(() => {
    try {
      const eng = window.__MidwestPlant_SPEED_ENGINE__ || window.parent && window.parent.__MidwestPlant_SPEED_ENGINE__;
      if (eng && typeof eng.getIdentity === 'function') {
        const id = eng.getIdentity();
        if (id && id.effectiveUser && id.effectiveUser.name) {
          setInspectorName(id.effectiveUser.name);
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
        const byReqId = new Map();
        for (const item of list) {
          const key = String(item.requestId || '');
          if (!key) continue;
          const prev = byReqId.get(key);
          const curTs = String(item.result?.at || item._modifiedon || item.requestedAt || '');
          const prevTs = prev ? String(prev.result?.at || prev._modifiedon || prev.requestedAt || '') : '';
          if (!prev || curTs >= prevTs) byReqId.set(key, item);
        }
        const deduped = Array.from(byReqId.values());
        deduped.sort((a, b) => String(b.requestedAt || '').localeCompare(String(a.requestedAt || '')));
        if (deduped.length > 0) {
          setRequests(deduped);
          return;
        }
      }
    } catch {}
    // Seed 1 live open request if none exist yet so the queue is immediately actionable
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
  }, []);
  const loadInspectorData = useCallback(async () => {
    await loadPreInspectQueue();
    try {
      // Load Equipment Assets
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

      // Load Swab Results (both sandbox and live table names supported by engine)
      let swRes = await fetch('/api/data/v9.2/craa5___1_b_swabresults?$top=500&$orderby=craa5_collectiondate desc');
      if (!swRes.ok) {
        swRes = await fetch('/api/data/v9.2/craa5__b_swabresults?$top=500&$orderby=craa5_collectiondate desc');
      }
      if (swRes && swRes.ok) {
        const swJson = await swRes.json();
        const allSwabs = swJson.value || [];
        setSwabTotalCount(allSwabs.length);
        const positives = allSwabs.filter(s => String(s.craa5_result || '').toLowerCase() === 'positive' || String(s.craa5_result || '').toLowerCase() === 'pending').slice(0, 12);
        setSwabHits(positives);
      }

      // Load CAPA Studies from hubconfigs
      const capaRes = await fetch("/api/data/v9.2/craa5___1_e_hubconfigs?$select=craa5_configkey,craa5_configjson&$filter=startswith(craa5_configkey,'CAPA_STUDY|')");
      if (capaRes.ok) {
        const capaJson = await capaRes.json();
        const loadedCapas = (capaJson.value || []).map(r => safeJsonParse(r.craa5_configjson, null)).filter(Boolean);
        if (loadedCapas.length > 0) {
          setCapaList([...loadedCapas, ...DEFAULT_CAPA_LIST.filter(d => !loadedCapas.some(l => l.capaId === d.capaId))]);
        }
      }

      // Load Employees for Trainee Gate
      const empRes = await fetch('/api/data/v9.2/craa5___1_a_employees?$top=200');
      if (empRes.ok) {
        const empJson = await empRes.json();
        const empList = (empJson.value || []).map((e, i) => ({
          id: cleanGuid(e.craa5___1_a_employeeid || e.id),
          name: String(e.craa5_employeename || e.craa5_name || 'Employee'),
          badge: String(e.craa5_badgenumber || e.craa5_badge || `APX-${100 + i}`),
          role: String(e.craa5_role || 'Sanitarian'),
          shift: String(e.craa5_shift || 'B'),
          inTraining: Boolean(e.craa5_intraining),
          trainingArea: String(e.craa5_trainingarea || 'breading')
        }));
        setEmployees(empList);
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
        at: nowIso
      }
    };
    setRequests(prev => prev.map(r => r.requestId === req.requestId ? updated : r));
    setStatusToast(passed ? `${tr('PRE-OP PASSED:', 'PRE-OP APROBADO:')} ${req.area.toUpperCase()} signed off via ${sigLabel}` : `${tr('PRE-OP FAILED:', 'PRE-OP RECHAZADO:')} ${req.area.toUpperCase()} flagged for re-clean & CAPA`);
    try {
      const hubUrl = req._rowId ? `/api/data/v9.2/craa5___1_e_hubconfigs(${cleanGuid(req._rowId)})` : '/api/data/v9.2/craa5___1_e_hubconfigs';
      await fetch(hubUrl, {
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
          craa5_details: JSON.stringify(updated)
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
    const draft = {
      capaId: newId,
      stage: 'Root Cause',
      problem: {
        title: `${areaName.toUpperCase()} - ${equipName} (${sourceLabel})`,
        statement: findingText || `Finding on ${equipName} in ${areaName} during ${sourceLabel}.`,
        source: sourceLabel,
        area: areaName,
        equipment: equipName,
        findingDate: todayIso(),
        severity: 'High (Zone 1 / Pre-Op)',
        detectedBy: inspectorName
      },
      fishbone: {
        people: [{
          id: 'p1',
          text: 'Operator teardown handoff between shifts',
          likely: false
        }],
        methods: [{
          id: 'm1',
          text: 'SSOP detail step needed visual check callout',
          likely: true
        }],
        equipment: [{
          id: 'e1',
          text: `${equipName} guard latch access tight`,
          likely: true
        }],
        materials: [{
          id: 'mt1',
          text: 'Chemical concentration verified at 200ppm',
          likely: false
        }],
        measurement: [{
          id: 'ms1',
          text: `Caught during ${sourceLabel}`,
          likely: false
        }],
        environment: [{
          id: 'en1',
          text: 'Drain backflow cleared prior to foam',
          likely: false
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
        ownerName: 'Sanitation & Maintenance Leads',
        dueDate: todayIso(),
        verifiedBy: `${inspectorName} (${signMethod.toUpperCase()})`
      }
    };
    setCapaList(prev => [draft, ...prev]);
    setActiveCapaIdx(0);
    setActiveSubTab('capa');
  };

  // Add cause chip to Fishbone bone
  const handleAddBoneCause = () => {
    if (!newCauseText.trim()) return;
    const nextList = capaList.map((c, idx) => {
      if (idx !== activeCapaIdx) return c;
      const curBone = c.fishbone[selectedBone] || [];
      return {
        ...c,
        fishbone: {
          ...c.fishbone,
          [selectedBone]: [...curBone, {
            id: 'c-' + Date.now(),
            text: newCauseText.trim(),
            likely: newCauseLikely
          }]
        }
      };
    });
    setCapaList(nextList);
    setNewCauseText('');
  };

  // Save CAPA Study to Dataverse (`craa5___1_e_hubconfigs` + `craa5___1_s_shiftlogs`)
  const handleSaveCapaStudy = async () => {
    const cur = capaList[activeCapaIdx];
    if (!cur) return;
    const nowIso = new Date().toISOString();
    const updated = {
      ...cur,
      stage: cur.stage === 'Open' ? 'Root Cause' : cur.stage,
      savedAt: nowIso,
      savedBy: inspectorName
    };
    setCapaList(prev => prev.map((c, i) => i === activeCapaIdx ? updated : c));
    setStatusToast(`${tr('Saved CAPA Study & Fishbone RCA to Dataverse:', 'CAPA y Espina de Pescado guardados en Dataverse:')} ${cur.capaId}`);
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
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `CAPA Saved: ${cur.capaId} (${cur.problem.area})`,
          craa5_action: 'CAPA_SAVED',
          craa5_app: 'portal2',
          craa5_crew: 'B',
          craa5_user: inspectorName,
          craa5_at: nowIso,
          craa5_summary: `Saved Fishbone + 5-Why + RCA for ${cur.capaId}: ${cur.rca.rootCause}`,
          craa5_details: JSON.stringify(updated)
        })
      });
    } catch {}
  };

  // Leadership-in-Training Badge Elevation Gate
  const handleActivateTrainingElevation = async () => {
    const code = String(traineeBadgeInput || 'DEMO-101').trim().toUpperCase();
    const matched = employees.find(e => e.badge.toUpperCase() === code && e.inTraining) || {
      id: 'a0000099-0000-4000-8000-000000000099',
      name: 'Rivera, Alex (Demo)',
      badge: code || 'DEMO-101',
      shift: 'B',
      inTraining: true,
      trainingArea: 'breading'
    };
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
          craa5_details: JSON.stringify(elev)
        })
      });
    } catch {}
  };
  const openRequestsCount = useMemo(() => requests.filter(r => r.status === 'open').length, [requests]);
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
      background: '#002B55',
      color: '#FFFFFF',
      padding: '10px 18px',
      borderBottom: '3px solid #FFB81C',
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
      background: '#FFB81C',
      color: '#0F172A',
      padding: '4px 10px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 900
    }
  }, tr('PORTAL 2: FSQ / INSPECTORS / CI LEADS', 'PORTAL 2: INSPECTORES FSQ Y LIDERES CI')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, [{
    id: 'inspect',
    label: `${tr('1. Inspect Equipment', '1. Inspeccionar Equipo')} (${openRequestsCount})`
  }, {
    id: 'capa',
    label: `${tr('2. Fishbone / 5-Why / CAPA Studio', '2. Estudio CAPA / Espina de Pescado')} (${capaList.length})`
  }, {
    id: 'elevation',
    label: tr('3. Leadership Training Badge Gate', '3. Puerta Gafete Entrenamiento')
  }].map(tb => /*#__PURE__*/React.createElement("button", {
    key: tb.id,
    type: "button",
    onClick: () => setActiveSubTab(tb.id),
    style: {
      background: activeSubTab === tb.id ? '#0072CE' : 'rgba(255,255,255,0.1)',
      color: '#FFFFFF',
      border: activeSubTab === tb.id ? '1.5px solid #FFB81C' : '1px solid rgba(255,255,255,0.2)',
      borderRadius: 8,
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
      color: '#CBD5E1',
      fontWeight: 800
    }
  }, tr('Verify By:', 'Verificar Con:')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSignMethod('msid'),
    style: {
      background: signMethod === 'msid' ? '#059669' : 'rgba(255,255,255,0.1)',
      color: '#FFFFFF',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: 8,
      padding: '5px 10px',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "Microsoft ID (", inspectorName, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSignMethod('badge'),
    style: {
      background: signMethod === 'badge' ? '#FFB81C' : 'rgba(255,255,255,0.1)',
      color: signMethod === 'badge' ? '#0F172A' : '#FFFFFF',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: 8,
      padding: '5px 10px',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Badge Scan', 'Escaneo Gafete'), " (", inspectorBadge, ")"))), statusToast && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '10px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#00468B',
      color: '#FFFFFF',
      borderLeft: '5px solid #FFB81C',
      borderRadius: 10,
      padding: '10px 16px',
      fontSize: 13,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, statusToast), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setStatusToast(''),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#FDE68A',
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Dismiss', 'Cerrar')))), detailMode && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '10px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#E6F1FB',
      border: '1.5px solid #0072CE',
      borderRadius: 12,
      padding: 12,
      fontSize: 12,
      color: '#00468B',
      fontWeight: 800
    }
  }, tr('Apex Foods Logo Detail Mode:', 'Modo Detalle:'), " Pre-Inspection Polling = 10s (BroadcastChannel + craa5___1_e_hubconfigs) - Swab Records = ", swabTotalCount, " - Active CAPAs = ", capaList.length)), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1320,
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
      border: '2px solid #FFB81C',
      borderRadius: 16,
      padding: 18,
      boxShadow: '0 6px 20px rgba(0,43,85,0.06)'
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
      color: '#D97706',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, tr('Live Floor Requests (Portal 1 to Portal 2)', 'Solicitudes en Vivo desde Piso (Portal 1 a Portal 2)')), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: '#002B55',
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
      height: 38,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 13,
      fontWeight: 800
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: inspectNote,
    onChange: e => setInspectNote(e.target.value),
    placeholder: tr('Inspection comment / finding note...', 'Nota de inspeccion o hallazgo...'),
    style: {
      width: 280,
      height: 38,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 13,
      fontWeight: 600
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, requests.map(req => /*#__PURE__*/React.createElement("div", {
    key: req.requestId,
    style: {
      padding: '14px 16px',
      borderRadius: 14,
      background: req.status === 'open' ? '#FFFBEB' : req.status === 'passed' ? '#ECFDF5' : '#FDE8EC',
      border: req.status === 'open' ? '2px solid #F59E0B' : req.status === 'passed' ? '1.5px solid #059669' : '1.5px solid #E4002B',
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
      background: '#002B55',
      color: '#FFB81C',
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 900
    }
  }, req.requestId), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#0F172A'
    }
  }, String(req.area || '').toUpperCase(), " - ", (req.equipmentNames || []).join(', '))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#334155',
      fontWeight: 700,
      marginTop: 4
    }
  }, tr('Requested by:', 'Solicitado por:'), " ", /*#__PURE__*/React.createElement("strong", null, req.requestedBy?.name || 'Floor Tech'), " (", req.requestedBy?.badge || 'Badge', ") - ", req.note), req.result && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      marginTop: 4,
      color: req.result.passed ? '#047857' : '#E4002B'
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
      height: 42,
      padding: '0 16px',
      borderRadius: 10,
      border: 'none',
      background: '#059669',
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Verify Pass (MSID / Badge)', 'Aprobar Pre-Op')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleVerifyRequest(req, false),
    style: {
      height: 42,
      padding: '0 14px',
      borderRadius: 10,
      border: 'none',
      background: '#E4002B',
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Fail / Hold', 'Rechazar')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleLaunchCapaFromFinding(req.area || 'breading', (req.equipmentNames || [])[0] || 'Line Equipment', inspectNote || 'Residue on belt guard hinge found during Pre-Op inspection.', 'Pre-Op Inspection'),
    style: {
      height: 42,
      padding: '0 14px',
      borderRadius: 10,
      border: '1.5px solid #00468B',
      background: '#FFFFFF',
      color: '#00468B',
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Open CAPA / Fishbone', 'Abrir CAPA / Espina'))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#FFFFFF',
      border: '1.5px solid #E2E8F0',
      borderRadius: 16,
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
      fontSize: 16,
      fontWeight: 900,
      color: '#002B55',
      margin: 0
    }
  }, tr('Swab Verification & Positive Findings Queue', 'Verificacion de Hisopos y Positivos')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#64748B',
      fontWeight: 700
    }
  }, swabHits.length, " ", tr('Positive / Pending Verifications across', 'Positivos / Pendientes de'), " ", swabTotalCount || 426, " ", tr('Swabs', 'Hisopos')))), /*#__PURE__*/React.createElement("div", {
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
      borderRadius: 10,
      background: '#FDE8EC',
      border: '1px solid #FCA5A5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: '#991B1B'
    }
  }, sw.craa5_area || 'LINE', " - ", sw.craa5_equipment || sw.craa5_sampledescription || 'Swab Site', " (Zone ", sw.craa5_zone || 2, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#7F1D1D',
      fontWeight: 700
    }
  }, sw.craa5_test || 'LIS', ": ", sw.craa5_resultraw || sw.craa5_result, " - ", String(sw.craa5_collectiondate || '').slice(0, 10))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleLaunchCapaFromFinding(sw.craa5_area || 'IBL4', sw.craa5_equipment || sw.craa5_sitecode || 'Swab Site', `Presumptive Positive (${sw.craa5_test || 'LIS'}) on ${sw.craa5_sampledescription || 'surface'} - Zone ${sw.craa5_zone || 2}.`, 'Environmental Swab Positive'),
    style: {
      padding: '6px 10px',
      borderRadius: 8,
      border: 'none',
      background: '#E4002B',
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: 900,
      cursor: 'pointer',
      flexShrink: 0
    }
  }, tr('Investigate (Fishbone)', 'Investigar (CAPA)')))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#FFFFFF',
      border: '1.5px solid #E2E8F0',
      borderRadius: 16,
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
      fontSize: 16,
      fontWeight: 900,
      color: '#002B55',
      margin: 0
    }
  }, tr('Inspect Equipment List (Direct Sign-Off)', 'Lista de Equipos para Inspeccion Directa')), /*#__PURE__*/React.createElement("select", {
    value: areaFilter,
    onChange: e => setAreaFilter(e.target.value),
    style: {
      height: 34,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 800
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
      borderRadius: 10,
      background: '#F8FAFC',
      border: '1px solid #CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: '#0F172A'
    }
  }, a.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#475569',
      fontWeight: 700
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
      borderRadius: 8,
      border: 'none',
      background: '#00468B',
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Verify Inspected', 'Verificar Equipo')))))))), activeSubTab === 'capa' && activeCapa && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '2px solid #002B55',
      borderRadius: 16,
      padding: 16,
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
      background: '#E4002B',
      color: '#FFFFFF',
      padding: '3px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 900
    }
  }, activeCapa.capaId), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FFF6E0',
      color: '#92400E',
      border: '1px solid #FFB81C',
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900
    }
  }, "Stage: ", activeCapa.stage), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#475569'
    }
  }, activeCapa.problem.area.toUpperCase(), " - ", activeCapa.problem.equipment)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 19,
      fontWeight: 900,
      color: '#0F172A',
      margin: '6px 0 2px'
    }
  }, activeCapa.problem.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#334155',
      fontWeight: 600
    }
  }, activeCapa.problem.statement)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleSaveCapaStudy,
    style: {
      height: 42,
      padding: '0 18px',
      borderRadius: 10,
      border: 'none',
      background: '#059669',
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Save CAPA & RCA to Dataverse', 'Guardar CAPA en Dataverse')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => window.print(),
    style: {
      height: 42,
      padding: '0 16px',
      borderRadius: 10,
      border: '1.5px solid #00468B',
      background: '#FFFFFF',
      color: '#00468B',
      fontSize: 13,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Print SQF 1-Pager', 'Imprimir Reporte SQF')))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1.5px solid #CBD5E1',
      borderRadius: 16,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#002B55',
      margin: 0
    }
  }, tr('Interactive 6M Ishikawa Fishbone Diagram (Click Any Bone to Add Causes)', 'Diagrama Ishikawa 6M Espina de Pescado (Clic en una Espina para Agregar Causas)'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: selectedBone,
    onChange: e => setSelectedBone(e.target.value),
    style: {
      height: 36,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 800
    }
  }, BONE_CATEGORIES.map(b => /*#__PURE__*/React.createElement("option", {
    key: b.key,
    value: b.key
  }, lang === 'es' ? b.labelEs : b.labelEn))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newCauseText,
    onChange: e => setNewCauseText(e.target.value),
    placeholder: tr('Add contributing cause to bone...', 'Agregar causa a la espina...'),
    style: {
      width: 240,
      height: 36,
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: '0 10px',
      fontSize: 12,
      fontWeight: 600
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleAddBoneCause,
    style: {
      height: 36,
      padding: '0 14px',
      borderRadius: 8,
      border: 'none',
      background: '#00468B',
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('+ Add Cause', '+ Agregar Causa')))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 980 340",
    width: "100%",
    height: "320",
    style: {
      background: '#F8FAFC',
      borderRadius: 12,
      border: '1px solid #E2E8F0'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "40",
    y1: "170",
    x2: "730",
    y2: "170",
    stroke: "#002B55",
    strokeWidth: "5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "730,158 752,170 730,182",
    fill: "#002B55"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "752",
    y: "105",
    width: "212",
    height: "130",
    rx: "14",
    fill: "#002B55",
    stroke: "#FFB81C",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("text", {
    x: "858",
    y: "132",
    textAnchor: "middle",
    fill: "#FFB81C",
    fontSize: "11",
    fontWeight: "900"
  }, "PROBLEM / FINDING"), /*#__PURE__*/React.createElement("foreignObject", {
    x: "762",
    y: "140",
    width: "192",
    height: "86"
  }, /*#__PURE__*/React.createElement("div", {
    xmlns: "http://www.w3.org/1999/xhtml",
    style: {
      color: '#FFFFFF',
      fontSize: '11px',
      fontWeight: 700,
      lineHeight: 1.35,
      textAlign: 'center'
    }
  }, activeCapa.problem.title)), BONE_CATEGORIES.map(bone => {
    const isSel = selectedBone === bone.key;
    const xHeader = bone.x;
    const yHeader = bone.isTop ? 28 : 312;
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
      stroke: isSel ? '#0072CE' : '#475569',
      strokeWidth: isSel ? '3.5' : '2.5'
    }), /*#__PURE__*/React.createElement("rect", {
      x: xHeader - 80,
      y: bone.isTop ? 10 : 296,
      width: "165",
      height: "32",
      rx: "8",
      fill: isSel ? '#FFB81C' : '#00468B'
    }), /*#__PURE__*/React.createElement("text", {
      x: xHeader + 2,
      y: bone.isTop ? 30 : 316,
      textAnchor: "middle",
      fill: isSel ? '#0F172A' : '#FFFFFF',
      fontSize: "11",
      fontWeight: "900"
    }, lang === 'es' ? bone.labelEs : bone.labelEn), causes.slice(0, 3).map((c, cIdx) => {
      const frac = (cIdx + 1) / 3.4;
      const cy = bone.isTop ? 44 + frac * (170 - 44) : 296 - frac * (296 - 170);
      const cx = xHeader + frac * 85;
      return /*#__PURE__*/React.createElement("g", {
        key: c.id || cIdx
      }, /*#__PURE__*/React.createElement("line", {
        x1: cx - 95,
        y1: cy,
        x2: cx,
        y2: cy,
        stroke: c.likely ? '#E4002B' : '#64748B',
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: cx - 185,
        y: cy - 13,
        width: "180",
        height: "24",
        rx: "6",
        fill: c.likely ? '#FFF6E0' : '#FFFFFF',
        stroke: c.likely ? '#FFB81C' : '#CBD5E1',
        strokeWidth: c.likely ? '2' : '1'
      }), /*#__PURE__*/React.createElement("text", {
        x: cx - 95,
        y: cy + 3,
        textAnchor: "middle",
        fill: "#0F172A",
        fontSize: "10",
        fontWeight: "800"
      }, String(c.text).slice(0, 29)));
    }));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1.5px solid #CBD5E1',
      borderRadius: 16,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 10px'
    }
  }, tr('5-Why Root Cause Chain', 'Analisis de los 5 Porques')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, (activeCapa.fiveWhy || []).map((step, sIdx) => /*#__PURE__*/React.createElement("div", {
    key: step.n,
    style: {
      padding: '8px 12px',
      borderRadius: 10,
      background: sIdx === 4 ? '#FDE8EC' : '#F8FAFC',
      border: sIdx === 4 ? '1.5px solid #E4002B' : '1px solid #CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: sIdx === 4 ? '#E4002B' : '#00468B'
    }
  }, "WHY #", step.n, ": ", step.why), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: step.answer,
    onChange: e => {
      const val = e.target.value;
      setCapaList(prev => prev.map((c, idx) => idx !== activeCapaIdx ? c : {
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
      fontWeight: 700,
      background: '#FFFFFF'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '1.5px solid #CBD5E1',
      borderRadius: 16,
      padding: 16,
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#002B55',
      margin: 0
    }
  }, tr('Root Cause Analysis (RCA) & CAPA Plan', 'Analisis de Causa Raiz (RCA) y Plan CAPA')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#E4002B',
      textTransform: 'uppercase'
    }
  }, tr('Confirmed Root Cause', 'Causa Raiz Confirmada')), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: activeCapa.rca.rootCause,
    onChange: e => {
      const val = e.target.value;
      setCapaList(prev => prev.map((c, i) => i === activeCapaIdx ? {
        ...c,
        rca: {
          ...c.rca,
          rootCause: val
        }
      } : c));
    },
    style: {
      width: '100%',
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: 8,
      fontSize: 12,
      fontWeight: 700
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#00468B',
      textTransform: 'uppercase'
    }
  }, tr('Immediate Containment / Correction', 'Contencion Inmediata')), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: activeCapa.rca.correction,
    onChange: e => {
      const val = e.target.value;
      setCapaList(prev => prev.map((c, i) => i === activeCapaIdx ? {
        ...c,
        rca: {
          ...c.rca,
          correction: val
        }
      } : c));
    },
    style: {
      width: '100%',
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: 8,
      fontSize: 12,
      fontWeight: 600
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#047857',
      textTransform: 'uppercase'
    }
  }, tr('Corrective & Preventive Action (CAPA)', 'Accion Correctiva y Preventiva')), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: activeCapa.rca.correctiveAction,
    onChange: e => {
      const val = e.target.value;
      setCapaList(prev => prev.map((c, i) => i === activeCapaIdx ? {
        ...c,
        rca: {
          ...c.rca,
          correctiveAction: val
        }
      } : c));
    },
    style: {
      width: '100%',
      borderRadius: 8,
      border: '1px solid #CBD5E1',
      padding: 8,
      fontSize: 12,
      fontWeight: 600
    }
  }))))), activeSubTab === 'elevation' && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: '18px auto',
      background: '#FFFFFF',
      border: '2px solid #002B55',
      borderRadius: 20,
      padding: 26,
      boxShadow: '0 12px 32px rgba(0,43,85,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      background: '#FFF6E0',
      border: '1.5px solid #FFB81C',
      color: '#92400E',
      padding: '4px 12px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, tr('Supervised Leadership-in-Training Elevation Gate', 'Puerta de Elevacion para Entrenamiento de Liderazgo')), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: '#002B55',
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
      fontWeight: 900,
      color: '#00468B',
      marginBottom: 4
    }
  }, tr('Trainee Badge #', 'No. Gafete en Entrenamiento')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: traineeBadgeInput,
    onChange: e => setTraineeBadgeInput(e.target.value),
    style: {
      width: '100%',
      height: 46,
      borderRadius: 10,
      border: '1.5px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 15,
      fontWeight: 900
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 900,
      color: '#00468B',
      marginBottom: 4
    }
  }, tr('Trainee PIN', 'PIN del Empleado')), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: traineePinInput,
    onChange: e => setTraineePinInput(e.target.value),
    style: {
      width: '100%',
      height: 46,
      borderRadius: 10,
      border: '1.5px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 15,
      fontWeight: 900
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 900,
      color: '#00468B',
      marginBottom: 4
    }
  }, tr('Supervisor Co-Sign Badge', 'Gafete de Supervisor Mentor')), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: supervisorCosignBadge,
    onChange: e => setSupervisorCosignBadge(e.target.value),
    style: {
      width: '100%',
      height: 46,
      borderRadius: 10,
      border: '1.5px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 15,
      fontWeight: 900
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
      height: 50,
      borderRadius: 12,
      border: 'none',
      background: '#FFB81C',
      color: '#0F172A',
      fontSize: 15,
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
      height: 50,
      padding: '0 16px',
      borderRadius: 12,
      border: 'none',
      background: '#E4002B',
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('End Session', 'Terminar Sesion'))), activeElevation && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: 14,
      borderRadius: 12,
      background: '#ECFDF5',
      border: '1.5px solid #059669',
      color: '#047857',
      fontSize: 13,
      fontWeight: 800
    }
  }, tr('ELEVATED SESSION ACTIVE:', 'SESION ELEVADA ACTIVA:'), " ", activeElevation.name, " (", activeElevation.badge, ") - ", tr('Unlocked up to Supervisor Level for Area:', 'Desbloqueado hasta nivel Supervisor para Area:'), " ", activeElevation.trainingArea.toUpperCase()))));
};
window.__PORTAL_APP_COMPONENT__ = __MAIN_COMP__;
window.__DEMO_APP_COMPONENT__ = __MAIN_COMP__;
})();