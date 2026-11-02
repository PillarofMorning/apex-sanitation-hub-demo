(function() {
var React = window.React;
var {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} = React;

// ============================================================================
// PORTAL 1: LEAD + EMPLOYEE MOBILE & PODIUM TABLET HUB
// File: P6.1 - employee hub.txt
// Target Bundle: bundles/employee.js
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
const DEFAULT_SKILLS = [{
  name: '0 Drains & Sanitizer Step',
  level: 'Certified (L3)'
}, {
  name: 'PIC Infrastructure & Foam',
  level: 'Certified (L3)'
}, {
  name: 'Breading Line Teardown & LOTO',
  level: 'Certified (L2)'
}, {
  name: 'Allergen Changeover Verification',
  level: 'In Training (L1)'
}];
const DEMO_EMP = {
  id: 'a0000099-0000-4000-8000-000000000099',
  name: 'Rivera, Alex (Demo)',
  fullName: 'Alex Rivera',
  badge: 'DEMO-101',
  pin: '1234',
  role: 'Sanitarian Tech 2',
  shift: 'B',
  area: 'breading',
  room: 'bakery',
  lead: 'Mendez, Carlos',
  inTraining: true,
  trainingArea: 'breading',
  skills: DEFAULT_SKILLS
};
function buildInitialLiveEmployee() {
  if (IS_PUBLIC_DEMO) return DEMO_EMP;
  const eng = getPortalEngine();
  const eff = eng && typeof eng.getEffectiveUser === 'function' ? eng.getEffectiveUser() : null;
  const uName = eff && eff.userName ? String(eff.userName).trim() : 'Authenticated Employee';
  const uId = eff && (eff.employeeId || eff.userId) ? String(eff.employeeId || eff.userId).replace(/[{}]/g, '').trim().toLowerCase() : '';
  const uRole = eff && (eff.roleName || eff.title) ? String(eff.roleName || eff.title).trim() : 'Sanitarian';
  const uCrew = eff && eff.crew && eff.crew !== 'ALL' ? String(eff.crew).trim() : 'A';
  return {
    id: uId || 'live-session-user',
    name: uName,
    fullName: uName,
    badge: 'APX-LIVE',
    pin: '',
    role: uRole,
    shift: uCrew,
    area: 'breading',
    room: 'bakery',
    lead: 'Shift Lead',
    inTraining: false,
    trainingArea: 'breading',
    skills: DEFAULT_SKILLS
  };
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
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function EmployeePodiumHub() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('__1_ss_lang_v1') === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });
  const tr = useCallback((en, es) => lang === 'es' ? es : en, [lang]);
  const [detailMode, setDetailMode] = useState(false);
  const [podiumLocked, setPodiumLocked] = useState(() => {
    try {
      const own = window.location.hash.indexOf('mode=podium') >= 0 || window.location.search.indexOf('mode=podium') >= 0;
      if (own) return true;
      if (window.parent && window.parent !== window) {
        return String(window.parent.location.hash || '').indexOf('mode=podium') >= 0;
      }
      return false;
    } catch {
      return false;
    }
  });
  const [badgeInput, setBadgeInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [requirePinMode, setRequirePinMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scanError, setScanError] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const videoRef = useRef(null);
  const wedgeBufRef = useRef({
    chars: '',
    lastMs: 0
  });
  const [employees, setEmployees] = useState(() => IS_PUBLIC_DEMO ? [DEMO_EMP] : []);
  const [activeEmployee, setActiveEmployee] = useState(() => buildInitialLiveEmployee());
  const [activeCard, setActiveCard] = useState(null);

  // Operational data states
  const [myTasks, setMyTasks] = useState([]);
  const [areaAssets, setAreaAssets] = useState([]);
  const [preInspectRequests, setPreInspectRequests] = useState([]);
  const [selectedPreInspectIds, setSelectedPreInspectIds] = useState([]);
  const [preInspectNote, setPreInspectNote] = useState('');
  const [submittingPreInspect, setSubmittingPreInspect] = useState(false);
  const [scheduleRuns, setScheduleRuns] = useState([]);
  const [supervisorGoals, setSupervisorGoals] = useState([]);
  const [ackedGoalIds, setAckedGoalIds] = useState({});

  // Problem submit state
  const [probCategory, setProbCategory] = useState('Mechanical / Maintenance');
  const [probEquip, setProbEquip] = useState('');
  const [probNote, setProbNote] = useState('');
  const [probPhotoName, setProbPhotoName] = useState('');
  const [probSubmitted, setProbSubmitted] = useState([]);

  // High Five state
  const [hfRecipientId, setHfRecipientId] = useState('');
  const [hfTag, setHfTag] = useState('Teamwork');
  const [hfNote, setHfNote] = useState('');
  const [hfSentList, setHfSentList] = useState([]);
  const toggleLanguage = useCallback(nextLang => {
    const target = nextLang || (lang === 'en' ? 'es' : 'en');
    setLang(target);
    try {
      localStorage.setItem('__1_ss_lang_v1', target);
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'hub:lang',
          lang: target
        }, '*');
      }
    } catch {}
  }, [lang]);

  // Listen to parent shell detail toggle & language sync
  useEffect(() => {
    window.__PORTAL_SET_DETAIL__ = on => setDetailMode(Boolean(on));
    window.__PORTAL_APP_COMMANDS__ = {
      openTab: cardId => setActiveCard(cardId || null),
      setLang: l => setLang(l === 'es' ? 'es' : 'en')
    };
    const onMsg = ev => {
      const d = ev && ev.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'hub:detail') setDetailMode(Boolean(d.on));
      if (d.type === 'hub:lang' && (d.lang === 'en' || d.lang === 'es')) setLang(d.lang);
      if (d.type === 'hub:preinspect-updated') loadPreInspectRequests();
    };
    window.addEventListener('message', onMsg);
    let bc = null;
    try {
      bc = new BroadcastChannel('__MidwestPlant_HUB_SYNC_V1__');
      bc.onmessage = ev => {
        if (ev.data && (ev.data.entitySet === 'craa5___1_e_hubconfigs' || ev.data.type === 'PREINSPECT_SYNC')) {
          loadPreInspectRequests();
        }
      };
    } catch {}
    return () => {
      window.removeEventListener('message', onMsg);
      if (bc) try {
        bc.close();
      } catch {}
    };
  }, []);

  // Load Dataverse data
  const loadPreInspectRequests = useCallback(async () => {
    try {
      const r = await fetch("/api/data/v9.2/craa5___1_e_hubconfigs?$select=craa5_configkey,craa5_configjson,modifiedon,statecode&$filter=startswith(craa5_configkey,'PREINSPECT|')");
      if (!r.ok) return;
      const data = await r.json();
      const rows = (data.value || []).map(row => {
        const parsed = safeJsonParse(row.craa5_configjson, null);
        return parsed ? {
          ...parsed,
          _modifiedon: row.modifiedon,
          _statecode: row.statecode
        } : null;
      }).filter(Boolean);
      rows.sort((a, b) => String(b.result?.verifiedAt || b._modifiedon || b.requestedAt || '').localeCompare(String(a.result?.verifiedAt || a._modifiedon || a.requestedAt || '')));
      const seenReq = new Set();
      const deduped = rows.filter(item => {
        const k = String(item.requestId || '');
        if (!k || seenReq.has(k)) return false;
        seenReq.add(k);
        return true;
      });
      setPreInspectRequests(deduped);
    } catch {}
  }, []);
  const loadAllFloorData = useCallback(async () => {
    try {
      const eng = getPortalEngine();
      const eff = eng && typeof eng.getEffectiveUser === 'function' ? eng.getEffectiveUser() : null;

      // 1. Employees
      const empRes = await fetch('/api/data/v9.2/craa5___1_a_employees?$top=250');
      let liveEmployees = [];
      if (empRes.ok) {
        const empJson = await empRes.json();
        const SHIFT_MAP = {
          '1': 'A',
          '2': 'B',
          '3': 'C',
          '4': 'D'
        };
        const mapped = (empJson.value || []).filter(r => r.statecode === 0 || r.statecode === undefined).map((r, idx) => {
          const rawShift = String(r['craa5_shift@OData.Community.Display.V1.FormattedValue'] || r.craa5_shift || r.craa5_crew || 'A').trim();
          const normShift = SHIFT_MAP[rawShift] || rawShift;
          return {
            id: cleanGuid(r.craa5___1_a_employeeid || r.id),
            name: String(r.craa5_employeename || r.craa5_name || 'Employee').trim(),
            fullName: String(r.craa5_employeename || r.craa5_name || 'Employee').trim(),
            email: String(r.craa5_email || '').trim().toLowerCase(),
            badge: String(r.craa5_badgenumber || r.craa5_badge || `APX-${100 + idx}`).trim(),
            role: String(r['_craa5_roleid_value@OData.Community.Display.V1.FormattedValue'] || r['craa5_role@OData.Community.Display.V1.FormattedValue'] || r.craa5_role || 'Sanitarian').trim(),
            shift: normShift,
            area: String(r.craa5_trainingarea || 'breading').trim(),
            room: 'bakery',
            lead: 'Mendez, Carlos',
            inTraining: Boolean(r.craa5_intraining),
            trainingArea: String(r.craa5_trainingarea || 'breading').trim(),
            skills: DEFAULT_SKILLS
          };
        }).filter(e => e.id);
        liveEmployees = IS_PUBLIC_DEMO ? [DEMO_EMP, ...mapped.filter(e => e.badge !== 'DEMO-101')] : mapped;
        setEmployees(liveEmployees);
        if (!IS_PUBLIC_DEMO && mapped.length > 0) {
          const effId = cleanGuid(eff && (eff.employeeId || eff.userId));
          const effEmail = String(eff && eff.email || '').trim().toLowerCase();
          const effName = String(eff && eff.userName || '').trim().toLowerCase();
          const matchedEmp = mapped.find(e => effId && e.id === effId) || mapped.find(e => effEmail && e.email && e.email === effEmail) || mapped.find(e => effName && e.name.toLowerCase() === effName) || mapped.find(e => effName && effName.indexOf('vance') >= 0 && e.name.toLowerCase().indexOf('vance') >= 0) || (eff && eff.isSimulated ? mapped.find(e => e.shift === (eff.crew || 'A')) : null) || mapped[0];
          if (matchedEmp) {
            setActiveEmployee(matchedEmp);
            setHfRecipientId(prev => prev || (mapped.find(e => e.id !== matchedEmp.id) || mapped[0]).id);
          }
        }
      }

      // 2. Assets for area
      const astRes = await fetch('/api/data/v9.2/craa5___1_a_assetses?$top=500');
      let allAssets = [];
      if (astRes.ok) {
        const astJson = await astRes.json();
        allAssets = (astJson.value || []).filter(a => a.statecode === 0 || a.statecode === undefined).map(a => ({
          id: cleanGuid(a.craa5___1_a_assetsid || a.id),
          name: String(a.craa5_equipmentidentifier || a.craa5_name || 'Equipment').trim(),
          area: String(a.craa5_areaname || 'breading').trim(),
          room: String(a.craa5_roomname || 'bakery').trim(),
          subcat: String(a.craa5_supportroom || a.craa5_subcategory || 'frontline').trim(),
          mins: Number(a.craa5_hoursrequired) || 35,
          step: Number(a.craa5_cleanorder) || 2
        }));
        setAreaAssets(allAssets);
      }

      // 3. Assignments & Checkoffs
      const [asgRes, chkRes] = await Promise.all([fetch('/api/data/v9.2/craa5___1_g_assignments?$top=200&$orderby=createdon desc'), fetch('/api/data/v9.2/craa5___1_s_cleancheckoffs?$top=200&$orderby=modifiedon desc')]);
      const doneSet = new Set();
      if (chkRes && chkRes.ok) {
        const chkJson = await chkRes.json();
        (chkJson.value || []).forEach(c => {
          if (c.craa5_status === 'done' && c.craa5_equipmentguid) {
            doneSet.add(cleanGuid(c.craa5_equipmentguid));
          }
        });
      }
      let taskRows = [];
      if (asgRes && asgRes.ok) {
        const asgJson = await asgRes.json();
        taskRows = (asgJson.value || []).slice(0, 16).map(a => {
          const eqGuid = cleanGuid(a.craa5_equipmentguid || a.craa5___1_g_assignmentid);
          return {
            id: eqGuid,
            name: String(a.craa5_equipment || 'Assigned Equipment'),
            area: String(a.craa5_area || 'breading'),
            employeeGuid: cleanGuid(a.craa5_employeeguid),
            employeeName: String(a.craa5_employee || ''),
            mins: Number(a.craa5_stdminutes) || 35,
            status: doneSet.has(eqGuid) ? 'done' : 'working'
          };
        });
      }
      if (IS_PUBLIC_DEMO && taskRows.length === 0 && allAssets.length > 0) {
        taskRows = allAssets.slice(0, 6).map((a, idx) => ({
          id: a.id,
          name: a.name,
          area: a.area,
          mins: a.mins,
          status: idx < 4 ? 'done' : 'working'
        }));
      }
      setMyTasks(taskRows);

      // 4. Today & Tomorrow Production Schedule
      const schRes = await fetch('/api/data/v9.2/craa5___1_p_prodschedules?$top=80&$orderby=craa5_datestarttime desc');
      if (schRes.ok) {
        const schJson = await schRes.json();
        const runs = (schJson.value || []).slice(0, 16).map(r => ({
          id: cleanGuid(r.craa5___1_p_prodscheduleid || r.id),
          area: String(r.craa5_area || 'IBL4'),
          line: String(r.craa5_line || '1'),
          product: String(r.craa5_product || r.craa5_runtitle || 'Scheduled Run'),
          start: String(r.craa5_datestarttime || ''),
          end: String(r.craa5_dateendtime || ''),
          allergen: Boolean(r.craa5_allergen),
          allergenType: String(r.craa5_typeofallergen || 'Standard'),
          crumb: Boolean(r.craa5_crumbclean)
        }));
        setScheduleRuns(runs);
      }

      // 5. Shift Board Goals
      const brdRes = await fetch('/api/data/v9.2/craa5___1_s_shiftboards?$top=5&$orderby=modifiedon desc');
      let loadedGoals = [];
      if (brdRes.ok) {
        const brdJson = await brdRes.json();
        for (const b of brdJson.value || []) {
          const parsed = safeJsonParse(b.craa5_boardjson, null);
          if (parsed && Array.isArray(parsed.shiftGoals) && parsed.shiftGoals.length > 0) {
            loadedGoals = parsed.shiftGoals;
            break;
          }
        }
      }
      if (IS_PUBLIC_DEMO && loadedGoals.length === 0) {
        loadedGoals = [{
          id: 'g-6',
          quarterTarget: '6:00',
          area: 'breading',
          subcategory: '0 drains & LOTO',
          status: 'Completed',
          percent: 100,
          assignedLead: 'Carlos Mendez',
          notes: 'Complete LOTO verification, pull drain baskets, and clear bulk debris prior to rinse.'
        }, {
          id: 'g-9',
          quarterTarget: '9:00',
          area: 'breading',
          subcategory: '1 pic & batter teardown',
          status: 'Completed',
          percent: 100,
          assignedLead: 'Carlos Mendez',
          notes: 'Foam and scrub batter applicator, wire belts, and overhead framework.'
        }, {
          id: 'g-12',
          quarterTarget: '12:00',
          area: 'breading',
          subcategory: 'frontline & pre-inspection call',
          status: 'In Progress',
          percent: 75,
          assignedLead: 'Carlos Mendez',
          notes: 'Complete detail scrub on Breading Machine 1 & 2 and call FSQ Inspector for Pre-Op.'
        }, {
          id: 'g-3',
          quarterTarget: '3:00',
          area: 'breading',
          subcategory: 'sanitizer & line release',
          status: 'Planned',
          percent: 0,
          assignedLead: 'Carlos Mendez',
          notes: 'Final 200ppm quat flood sanitize, reassembly check, and Startup Handshake.'
        }];
      }
      setSupervisorGoals(loadedGoals);

      // 6. Recent Shift High Fives
      try {
        const hfRes = await fetch('/api/data/v9.2/craa5___1_g_notes?$top=30&$orderby=createdon desc');
        let loadedHf = [];
        if (hfRes.ok) {
          const hfJson = await hfRes.json();
          loadedHf = (hfJson.value || []).filter(n => String(n.craa5_kind || '').toLowerCase() === 'highfive' || String(n.craa5_severity || '').toLowerCase() === 'positive').map((n, idx) => ({
            id: String(n.craa5_notekey || n.craa5___1_g_noteid || `hf-${idx}`),
            to: String(n.craa5_employee || 'Teammate'),
            from: String(n.craa5_givenby || 'Crew Lead'),
            tag: String(n.craa5_tag || 'Teamwork'),
            note: String(n.craa5_note || ''),
            area: String(n.craa5_area || 'breading'),
            at: n.craa5_notedat ? new Date(n.craa5_notedat).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }) : ''
          }));
        }
        if (IS_PUBLIC_DEMO && loadedHf.length === 0) {
          loadedHf = [{
            id: 'hf-seed-1',
            to: 'Vance, Marcus T',
            from: 'Mendez, Carlos',
            tag: 'Inspection Ready',
            note: 'Zero ATP re-swabs on Line 2 Wire Belt and Batter Applicator teardown - passed FSQ Pre-Op on first walk.',
            area: 'breading',
            at: '11:20 AM'
          }, {
            id: 'hf-seed-2',
            to: 'Delgado, Elena R',
            from: 'Mercer, Jordan K',
            tag: 'Teamwork',
            note: 'Jumped in to help finish Bakery Spiral 1 foam & detail scrub 25 minutes ahead of turnaround window.',
            area: 'spiral 1',
            at: '09:50 AM'
          }, {
            id: 'hf-seed-3',
            to: 'Kowalski, Devon P',
            from: 'Mendez, Carlos',
            tag: 'Safety First',
            note: 'Caught a worn LOTO hasp on IBL4 Mixer 1 before washdown and coordinated immediate maintenance swap.',
            area: 'ibl4',
            at: '08:15 AM'
          }];
        }
        setHfSentList(loadedHf);
      } catch {}
      await loadPreInspectRequests();
    } catch {}
  }, [loadPreInspectRequests]);
  useEffect(() => {
    loadAllFloorData();
    const timer = setInterval(loadPreInspectRequests, 10000);
    return () => clearInterval(timer);
  }, [loadAllFloorData, loadPreInspectRequests]);

  // USB/Bluetooth Keyboard-Wedge Scanner Listener
  useEffect(() => {
    const onKeyDown = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
      const now = Date.now();
      if (e.key === 'Enter') {
        if (wedgeBufRef.current.chars.length >= 4 && now - wedgeBufRef.current.lastMs < 120) {
          handleBadgeVerify(wedgeBufRef.current.chars, 'USB/BT Wedge Scanner');
        }
        wedgeBufRef.current.chars = '';
        return;
      }
      if (e.key && e.key.length === 1) {
        if (now - wedgeBufRef.current.lastMs > 120) {
          wedgeBufRef.current.chars = e.key;
        } else {
          wedgeBufRef.current.chars += e.key;
        }
        wedgeBufRef.current.lastMs = now;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Camera Scanner Lifecycle
  useEffect(() => {
    let stream = null;
    if (cameraActive && videoRef.current && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      }).then(s => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      }).catch(() => {
        setScanStatus(tr('Camera preview simulated for presentation desk.', 'Vista de camara simulada para presentacion.'));
      });
    }
    return () => {
      if (stream) {
        try {
          stream.getTracks().forEach(t => t.stop());
        } catch {}
      }
    };
  }, [cameraActive, tr]);
  const handleBadgeVerify = async (rawCode, methodLabel) => {
    const code = String(rawCode || badgeInput || '').trim().toUpperCase();
    if (!code) return;
    setScanError('');
    let matched = employees.find(e => String(e.badge || '').toUpperCase() === code || e.name.toUpperCase().indexOf(code) >= 0);
    if (!matched && IS_PUBLIC_DEMO && (code === 'DEMO-101' || code === '101' || code === '1234')) {
      matched = DEMO_EMP;
    }
    if (!matched) {
      // Server-side badge lookup fallback (never selecting craa5_pin)
      try {
        const res = await fetch(`/api/data/v9.2/craa5___1_a_employees?$select=craa5___1_a_employeeid,craa5_employeename,craa5_badgenumber,craa5_role,craa5_shift,craa5_intraining,craa5_trainingarea&$filter=craa5_badgenumber eq '${code.replace(/'/g, '')}' and statecode eq 0&$top=1`);
        if (res.ok) {
          const d = await res.json();
          if (d.value && d.value.length > 0) {
            const r = d.value[0];
            matched = {
              id: cleanGuid(r.craa5___1_a_employeeid),
              name: String(r.craa5_employeename || 'Verified Employee'),
              fullName: String(r.craa5_employeename || 'Verified Employee'),
              badge: String(r.craa5_badgenumber || code),
              role: String(r.craa5_role || 'Sanitarian'),
              shift: String(r.craa5_shift || 'B'),
              area: String(r.craa5_trainingarea || 'breading'),
              room: 'bakery',
              lead: 'Mendez, Carlos',
              inTraining: Boolean(r.craa5_intraining),
              trainingArea: String(r.craa5_trainingarea || 'breading'),
              skills: DEFAULT_SKILLS
            };
          }
        }
      } catch {}
    }
    if (!matched && IS_PUBLIC_DEMO) {
      matched = DEMO_EMP;
    }
    if (!matched) {
      setScanError(`[ERR-BADGE-NOT-FOUND] ${tr('Badge not found in live Dataverse employee roster:', 'Gafete no encontrado en la lista de empleados de Dataverse:')} ${code}`);
      return;
    }
    setActiveEmployee(matched);
    setPodiumLocked(false);
    setCameraActive(false);
    setBadgeInput('');
    setPinInput('');
    const stamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setScanStatus(`${tr('Verified Badge', 'Gafete Verificado')}: ${matched.name} (${matched.badge}) via ${methodLabel} @ ${stamp}`);
    setScanHistory(prev => [{
      at: stamp,
      badge: matched.badge,
      name: matched.name,
      method: methodLabel
    }, ...prev.slice(0, 19)]);
    try {
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `Badge Scan: ${matched.name} (${matched.badge})`,
          craa5_action: 'badge.scan',
          craa5_app: 'portal1',
          craa5_crew: matched.shift || 'B',
          craa5_user: matched.name,
          craa5_at: new Date().toISOString(),
          craa5_summary: `Podium badge scan verified via ${methodLabel}`,
          craa5_details: JSON.stringify({
            v: 1,
            employeeId: matched.id,
            badge: matched.badge,
            method: methodLabel
          })
        })
      });
    } catch {}
  };

  // Toggle task piece completion
  const handleToggleTaskDone = async task => {
    const nextStatus = task.status === 'done' ? 'working' : 'done';
    setMyTasks(prev => prev.map(t => t.id === task.id ? {
      ...t,
      status: nextStatus
    } : t));
    try {
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `Task ${nextStatus.toUpperCase()}: ${task.name}`,
          craa5_action: 'EMP_PIECE_DONE',
          craa5_app: 'portal1',
          craa5_crew: activeEmployee.shift,
          craa5_user: activeEmployee.name,
          craa5_at: new Date().toISOString(),
          craa5_summary: `${activeEmployee.name} marked ${task.name} as ${nextStatus}`,
          craa5_details: JSON.stringify({
            v: 1,
            equipmentId: task.id,
            equipment: task.name,
            area: task.area,
            status: nextStatus
          })
        })
      });
    } catch {}
  };

  // Call for Pre-Inspection (Portal 1 -> Portal 2 Live Loop)
  const handleCallPreInspection = async (areaNameOverride, equipNameOverride) => {
    setSubmittingPreInspect(true);
    try {
      const reqId = 'REQ-' + Date.now().toString(36).toUpperCase();
      const targetArea = areaNameOverride || activeEmployee.area || 'breading';
      const chosenAssets = areaAssets.filter(a => selectedPreInspectIds.includes(a.id));
      const equipNames = equipNameOverride ? [equipNameOverride] : chosenAssets.length > 0 ? chosenAssets.map(a => a.name) : [`${targetArea} - Breading Machine 1 & Wire Belt`];
      const payload = {
        v: 1,
        requestId: reqId,
        status: 'open',
        area: targetArea,
        room: activeEmployee.room || 'bakery',
        equipmentGuids: chosenAssets.map(a => a.id),
        equipmentNames: equipNames,
        note: preInspectNote.trim() || 'Foam, detail scrub, and rinse complete. Ready for FSQ Pre-Op verification.',
        requestedBy: {
          guid: activeEmployee.id,
          name: activeEmployee.name,
          badge: activeEmployee.badge,
          crew: activeEmployee.shift || 'B'
        },
        requestedAt: new Date().toISOString()
      };
      const cfgKey = `PREINSPECT|${reqId}`;
      await fetch('/api/data/v9.2/craa5___1_e_hubconfigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_configkey: cfgKey,
          craa5_configname: `Pre-Inspection: ${targetArea} (${equipNames[0]})`,
          craa5_configjson: JSON.stringify(payload)
        })
      });
      await fetch('/api/data/v9.2/craa5___1_s_shiftlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `Pre-Inspection Called: ${targetArea} - ${equipNames[0]}`,
          craa5_action: 'PREINSPECT_REQUESTED',
          craa5_app: 'portal1',
          craa5_crew: activeEmployee.shift || 'B',
          craa5_user: activeEmployee.name,
          craa5_at: payload.requestedAt,
          craa5_summary: `${activeEmployee.name} called for Pre-Inspection on ${targetArea} (${equipNames.join(', ')})`,
          craa5_details: JSON.stringify(payload)
        })
      });
      setPreInspectRequests(prev => [payload, ...prev]);
      setSelectedPreInspectIds([]);
      setPreInspectNote('');
      try {
        const bc = new BroadcastChannel('__MidwestPlant_HUB_SYNC_V1__');
        bc.postMessage({
          type: 'PREINSPECT_SYNC',
          requestId: reqId,
          payload
        });
        bc.close();
      } catch {}
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'hub:preinspect-created',
            payload
          }, '*');
        }
      } catch {}
    } finally {
      setSubmittingPreInspect(false);
    }
  };

  // Submit Problem / Observation
  const handleSubmitProblem = async () => {
    if (!probNote.trim()) return;
    const nowIso = new Date().toISOString();
    const item = {
      id: 'PROB-' + Date.now(),
      category: probCategory,
      area: activeEmployee.area || 'breading',
      equipment: probEquip || 'Area Wide',
      note: probNote.trim(),
      photo: probPhotoName || '',
      at: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setProbSubmitted(prev => [item, ...prev]);
    setProbNote('');
    setProbPhotoName('');
    try {
      await fetch('/api/data/v9.2/craa5___1_m_supervisortodos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_title: `[Floor Issue] ${item.category} - ${item.area}`,
          craa5_task: `${item.category}: ${item.note}`,
          craa5_taskdescription: `Reported by ${activeEmployee.name} (${activeEmployee.badge}) on ${item.area} / ${item.equipment}: ${item.note}`,
          craa5_area: item.area,
          craa5_room: activeEmployee.room || 'bakery',
          craa5_equipment: item.equipment,
          craa5_dateassigned: nowIso
        })
      });
      await fetch('/api/data/v9.2/craa5___1_g_obstacles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_obstaclekey: item.id,
          craa5_shiftdate: todayIso(),
          craa5_crew: activeEmployee.shift || 'B',
          craa5_room: activeEmployee.room || 'bakery',
          craa5_area: item.area,
          craa5_equipment: item.equipment,
          craa5_category: item.category,
          craa5_minutes: 15,
          craa5_note: item.note,
          craa5_status: 'Active',
          craa5_loggedby: activeEmployee.name
        })
      });
    } catch {}
  };

  // Submit High Five
  const handleSendHighFive = async (overrideNote, overrideTag) => {
    const recip = employees.find(e => e.id === hfRecipientId) || employees[0] || activeEmployee;
    const noteText = typeof overrideNote === 'string' && overrideNote.trim() ? overrideNote.trim() : hfNote.trim();
    const tagText = typeof overrideTag === 'string' && overrideTag.trim() ? overrideTag.trim() : hfTag;
    if (!noteText) return;
    const nowIso = new Date().toISOString();
    const key = `pn|${cleanGuid(recip.id)}|${Date.now().toString(36)}`;
    const sent = {
      id: key,
      to: recip.name,
      from: activeEmployee.name,
      tag: tagText,
      note: noteText,
      area: activeEmployee.area || 'breading',
      at: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setHfSentList(prev => [sent, ...prev]);
    setHfNote('');
    try {
      await fetch('/api/data/v9.2/craa5___1_g_notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          craa5_notekey: key,
          craa5_employeeguid: cleanGuid(recip.id),
          craa5_employee: recip.name,
          craa5_kind: 'highfive',
          craa5_tag: tagText,
          craa5_note: sent.note,
          craa5_severity: 'positive',
          craa5_area: activeEmployee.area || 'breading',
          craa5_shiftdate: todayIso(),
          craa5_crew: activeEmployee.shift || 'B',
          craa5_notedat: nowIso,
          craa5_givenby: activeEmployee.name,
          craa5_givenbyguid: cleanGuid(activeEmployee.id)
        })
      });
    } catch {}
  };
  const quickPresetBadge = IS_PUBLIC_DEMO ? 'DEMO-101' : activeEmployee.badge || employees[0] && employees[0].badge || 'APX-100';
  useEffect(() => {
    window.__PORTAL_APP_COMMANDS__ = {
      openTab: cardId => setActiveCard(cardId || null),
      setLang: l => setLang(l === 'es' ? 'es' : 'en'),
      unlockPodium: badgeCode => handleBadgeVerify(badgeCode || quickPresetBadge, 'Badge Scan'),
      lockPodium: () => setPodiumLocked(true),
      sendDemoHighFive: () => {
        setActiveCard('highfive');
        handleSendHighFive('Outstanding Pre-Op detail scrub on Breading Line 2 Wire Belt and zero ATP re-swabs - thank you for backing up the crew!', 'Inspection Ready');
      },
      callDemoPreInspect: () => {
        setActiveCard('preinspect');
        handleCallPreInspection('breading', 'Breading Machine 1 & Wire Belt');
      }
    };
  });
  const doneTasksCount = useMemo(() => myTasks.filter(t => t.status === 'done').length, [myTasks]);
  const totalTasksCount = myTasks.length;
  const areaCompletionPct = totalTasksCount > 0 ? Math.round(doneTasksCount / totalTasksCount * 100) : 0;
  const latestPreInspect = preInspectRequests[0] || null;

  // PODIUM LOCK SCREEN
  if (podiumLocked) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #002B55 0%, #00468B 100%)',
        color: '#FFFFFF',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 480,
        width: '100%',
        background: 'rgba(15, 23, 42, 0.78)',
        border: '2px solid #FFB81C',
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: '#FFB81C',
        color: '#0F172A',
        padding: '6px 16px',
        borderRadius: 999,
        fontWeight: 900,
        fontSize: 13,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 14
      }
    }, tr('Podium Kiosk - Scan Badge', 'Kiosco de Piso - Escanear Gafete')), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 26,
        fontWeight: 900,
        margin: '0 0 6px'
      }
    }, tr('Scan Your Employee Badge', 'Escanee su Gafete de Empleado')), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: '#CBD5E1',
        margin: '0 0 18px'
      }
    }, tr('Present barcode to the podium scanner, use camera, or enter your badge number below.', 'Presente el codigo de barras al escaner del podio, use la camara o ingrese su numero de gafete.')), scanError && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12,
        padding: '8px 12px',
        borderRadius: 10,
        background: 'rgba(228,0,43,0.2)',
        border: '1px solid #F87171',
        color: '#FECACA',
        fontSize: 12,
        fontWeight: 800
      }
    }, scanError), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: badgeInput,
      onChange: e => setBadgeInput(e.target.value),
      placeholder: tr(`Badge # (e.g. ${quickPresetBadge})`, `No. Gafete (ej. ${quickPresetBadge})`),
      style: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        border: '1px solid #475569',
        background: '#0F172A',
        color: '#FFFFFF',
        padding: '0 16px',
        fontSize: 18,
        fontWeight: 800,
        textAlign: 'center'
      }
    }), requirePinMode && /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: pinInput,
      onChange: e => setPinInput(e.target.value),
      placeholder: "PIN",
      maxLength: 6,
      style: {
        width: 110,
        height: 52,
        borderRadius: 12,
        border: '1px solid #475569',
        background: '#0F172A',
        color: '#FFB81C',
        padding: '0 12px',
        fontSize: 18,
        fontWeight: 800,
        textAlign: 'center'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 16
      }
    }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', quickPresetBadge].map(k => /*#__PURE__*/React.createElement("button", {
      key: k,
      type: "button",
      onClick: () => {
        if (k === 'CLR') {
          setBadgeInput('');
          setPinInput('');
          setScanError('');
        } else if (k === quickPresetBadge) {
          handleBadgeVerify(quickPresetBadge, 'Badge Preset');
        } else setBadgeInput(prev => prev + k);
      },
      style: {
        height: 58,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.2)',
        background: k === quickPresetBadge ? '#FFB81C' : 'rgba(255,255,255,0.08)',
        color: k === quickPresetBadge ? '#0F172A' : '#FFFFFF',
        fontSize: k === quickPresetBadge ? 13 : 20,
        fontWeight: 900,
        cursor: 'pointer'
      }
    }, k))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => handleBadgeVerify(badgeInput || quickPresetBadge, 'Podium Keypad'),
      style: {
        flex: 1,
        height: 54,
        borderRadius: 12,
        border: 'none',
        background: '#059669',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 900,
        cursor: 'pointer'
      }
    }, tr('Sign In with Badge', 'Iniciar con Gafete')), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => toggleLanguage(),
      style: {
        height: 54,
        padding: '0 16px',
        borderRadius: 12,
        border: '1px solid #64748B',
        background: 'transparent',
        color: '#E2E8F0',
        fontSize: 13,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, lang === 'en' ? 'Espanol (MX)' : 'English'))));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      paddingBottom: 32
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      background: '#002B55',
      color: '#FFFFFF',
      padding: '10px 16px',
      borderBottom: '3px solid #FFB81C',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      position: 'sticky',
      top: 0,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      const next = !detailMode;
      setDetailMode(next);
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'hub:detail-changed',
            appKey: 'employee',
            on: next
          }, '*');
        }
      } catch {}
    },
    title: tr('Click Logo to toggle Further Details', 'Clic en el logo para ver Mas Detalles'),
    style: {
      background: detailMode ? '#FFB81C' : '#00468B',
      color: detailMode ? '#0F172A' : '#FFFFFF',
      border: '1.5px solid #FFB81C',
      borderRadius: 8,
      padding: '5px 10px',
      fontWeight: 900,
      fontSize: 12,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, tr('PORTAL 1: EMPLOYEE & LEAD HUB', 'PORTAL 1: CENTRO DE EMPLEADOS Y LIDERES'))), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(255,184,28,0.18)',
      border: '1px solid #FFB81C',
      color: '#FDE68A',
      padding: '4px 10px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 800
    }
  }, activeEmployee.name, " (", activeEmployee.badge, ") - ", tr('Shift', 'Turno'), " ", activeEmployee.shift, " - ", activeEmployee.area.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleBadgeVerify(quickPresetBadge, 'Quick Badge Scan'),
    style: {
      background: '#FFB81C',
      color: '#0F172A',
      border: 'none',
      borderRadius: 8,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr(`Scan Badge (${quickPresetBadge})`, `Escanear Gafete (${quickPresetBadge})`)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setCameraActive(prev => !prev),
    style: {
      background: cameraActive ? '#059669' : 'rgba(255,255,255,0.12)',
      color: '#FFFFFF',
      border: '1px solid rgba(255,255,255,0.28)',
      borderRadius: 8,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, cameraActive ? tr('Close Scanner', 'Cerrar Escaner') : tr('Camera / Podium Scan', 'Camara / Podio')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => toggleLanguage(),
    style: {
      background: 'rgba(255,255,255,0.12)',
      color: '#FFFFFF',
      border: '1px solid rgba(255,255,255,0.28)',
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, lang === 'en' ? 'ES' : 'EN'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setPodiumLocked(true),
    style: {
      background: '#E4002B',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, tr('Lock Podium', 'Bloquear')))), cameraActive && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1140,
      margin: '12px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      color: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      border: '2px solid #FFB81C',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      height: 92,
      borderRadius: 10,
      background: '#1E293B',
      border: '2px dashed #38BDF8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    autoPlay: true,
    playsInline: true,
    muted: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 800,
      color: '#38BDF8',
      background: 'rgba(15,23,42,0.55)'
    }
  }, tr('BARCODE LASER ACTIVE', 'LASER DE CODIGO ACTIVO'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#FFB81C'
    }
  }, tr('Podium Barcode & Badge Reader Ready', 'Lector de Gafete y Codigo de Barras Listo')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#CBD5E1',
      marginTop: 2
    }
  }, tr('Scan physical Code-128 / QR badge or tap a preset employee badge below:', 'Escanee el gafete fisico o seleccione un gafete de prueba abajo:')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8
    }
  }, employees.slice(0, 5).map(e => /*#__PURE__*/React.createElement("button", {
    key: e.id,
    type: "button",
    onClick: () => handleBadgeVerify(e.badge, 'Camera Barcode Scan'),
    style: {
      background: '#1E293B',
      color: '#F8FAFC',
      border: '1px solid #475569',
      borderRadius: 8,
      padding: '5px 10px',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, e.badge, " - ", e.name))))))), scanStatus && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1140,
      margin: '10px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ECFDF5',
      border: '1px solid #059669',
      color: '#047857',
      borderRadius: 10,
      padding: '8px 14px',
      fontSize: 12,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, scanStatus), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setScanStatus(''),
    style: {
      background: 'transparent',
      border: 'none',
      color: '#047857',
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Dismiss', 'Cerrar')))), detailMode && /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1140,
      margin: '12px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#E6F1FB',
      border: '1.5px solid #0072CE',
      borderRadius: 12,
      padding: 14,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      color: '#00468B',
      marginBottom: 6
    }
  }, tr('Apex Foods Logo Gate Unlocked - Portal 1 Podium & Badge Diagnostics', 'Puerta de Detalles Desbloqueada - Diagnostico de Podio y Gafete')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
      color: '#334155',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", null, "Employee GUID: ", activeEmployee.id), /*#__PURE__*/React.createElement("span", null, "Roster Loaded: ", employees.length), /*#__PURE__*/React.createElement("span", null, "Area Assets: ", areaAssets.length), /*#__PURE__*/React.createElement("span", null, "Open Pre-Inspections: ", preInspectRequests.filter(r => r.status === 'open').length), /*#__PURE__*/React.createElement("span", null, "Recent Badge Scans: ", scanHistory.length)))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1140,
      margin: '14px auto 0',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#FFFFFF',
      border: '2px solid #00468B',
      borderRadius: 16,
      padding: '14px 18px',
      marginBottom: 14,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      boxShadow: '0 4px 12px rgba(0,43,85,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#0072CE',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, tr('Instant Floor-to-Inspector Handshake', 'Conexion Instantanea Piso a Inspector')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 900,
      color: '#0F172A'
    }
  }, tr('Area', 'Area'), ": ", activeEmployee.area.toUpperCase(), " - ", doneTasksCount, "/", totalTasksCount, " ", tr('Tasks Complete', 'Tareas Completas'), " (", areaCompletionPct, "%)"), latestPreInspect && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      marginTop: 3,
      color: latestPreInspect.status === 'passed' ? '#047857' : latestPreInspect.status === 'failed' ? '#E4002B' : '#B45309'
    }
  }, latestPreInspect.status === 'passed' ? `${tr('PASSED Pre-Inspection by', 'APROBADO por')} ${latestPreInspect.result?.inspectorName || 'Inspector'}` : latestPreInspect.status === 'failed' ? `${tr('ACTION REQUIRED:', 'ACCION REQUERIDA:')} ${latestPreInspect.result?.note || 'See inspector note'}` : `${tr('WAITING FOR INSPECTOR:', 'ESPERANDO INSPECTOR:')} ${latestPreInspect.requestId} (${(latestPreInspect.equipmentNames || [])[0] || activeEmployee.area})`)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: submittingPreInspect,
    onClick: () => handleCallPreInspection(activeEmployee.area, `${activeEmployee.area} - Breading Machine 1 & Wire Belt`),
    style: {
      height: 52,
      padding: '0 22px',
      borderRadius: 12,
      border: 'none',
      background: '#FFB81C',
      color: '#0F172A',
      fontSize: 15,
      fontWeight: 900,
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(255,184,28,0.4)'
    }
  }, submittingPreInspect ? tr('Calling Inspector...', 'Llamando Inspector...') : tr('Call for Pre-Inspection Now', 'Solicitar Pre-Inspeccion Ahora')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'tasks' ? null : 'tasks'),
    style: {
      textAlign: 'left',
      background: activeCard === 'tasks' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'tasks' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'tasks' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: activeCard === 'tasks' ? '#FFB81C' : '#0072CE'
    }
  }, tr('1. Shift Execution', '1. Ejecucion de Turno')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#E6F1FB',
      color: '#00468B',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, doneTasksCount, "/", totalTasksCount)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('My Shift Tasks', 'Mis Tareas del Turno')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'tasks' ? '#CBD5E1' : '#047857'
    }
  }, areaCompletionPct, "% ", tr('Done in', 'Completado en'), " ", activeEmployee.area)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'preinspect' ? null : 'preinspect'),
    style: {
      textAlign: 'left',
      background: activeCard === 'preinspect' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'preinspect' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'preinspect' ? '2px solid #FFB81C' : '1.5px solid #FFB81C',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#D97706'
    }
  }, tr('2. Inspector Queue', '2. Cola de Inspector')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FFF6E0',
      color: '#92400E',
      border: '1px solid #FFB81C',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, preInspectRequests.filter(r => r.status === 'open').length, " ", tr('Open', 'Abiertas'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Call Pre-Inspection', 'Solicitar Pre-Inspeccion')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'preinspect' ? '#FDE68A' : '#B45309'
    }
  }, latestPreInspect ? `${tr('Latest:', 'Ultimo:')} ${latestPreInspect.status.toUpperCase()}` : tr('Tap when equipment is ready', 'Toque cuando el equipo este listo'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'clock' ? null : 'clock'),
    style: {
      textAlign: 'left',
      background: activeCard === 'clock' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'clock' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'clock' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: activeCard === 'clock' ? '#FFB81C' : '#0072CE'
    }
  }, tr('3. Live Area Clock', '3. Reloj de Area en Vivo')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#ECFDF5',
      color: '#047857',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, "ETA 14:15")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Area Ganttly Clock', 'Reloj Ganttly del Area')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'clock' ? '#CBD5E1' : '#334155'
    }
  }, activeEmployee.area.toUpperCase(), " - ", tr('Step 2: Frontline Scrub', 'Paso 2: Lavado Frontal'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'schedule' ? null : 'schedule'),
    style: {
      textAlign: 'left',
      background: activeCard === 'schedule' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'schedule' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'schedule' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: activeCard === 'schedule' ? '#FFB81C' : '#0072CE'
    }
  }, tr('4. 48-Hour Line View', '4. Vista 48 Horas')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#E6F1FB',
      color: '#00468B',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, scheduleRuns.length, " ", tr('Runs', 'Corridas'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Today & Tomorrow', 'Hoy y Manana')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'schedule' ? '#CBD5E1' : '#334155'
    }
  }, tr('What lines & allergens run next', 'Que lineas y alergenos corren hoy'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'goals' ? null : 'goals'),
    style: {
      textAlign: 'left',
      background: activeCard === 'goals' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'goals' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'goals' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: activeCard === 'goals' ? '#FFB81C' : '#0072CE'
    }
  }, tr('5. 6-9-12-3 Targets', '5. Metas 6-9-12-3')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FFF6E0',
      color: '#92400E',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, supervisorGoals.length, " ", tr('Goals', 'Metas'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Supervisor Goals', 'Metas del Supervisor')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'goals' ? '#CBD5E1' : '#334155'
    }
  }, tr('Quarter milestones from', 'Metas por cuarto de'), " ", activeEmployee.lead)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'problem' ? null : 'problem'),
    style: {
      textAlign: 'left',
      background: activeCard === 'problem' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'problem' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'problem' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#E4002B'
    }
  }, tr('6. Fast Escalation', '6. Escalacion Rapida')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FDE8EC',
      color: '#E4002B',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, tr('1-Tap Submit', 'Envio Rapido'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Report Problem', 'Reportar Problema')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'problem' ? '#CBD5E1' : '#334155'
    }
  }, tr('Maintenance, LOTO, or QA issue', 'Mantenimiento, LOTO o problema QA'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'highfive' ? null : 'highfive'),
    style: {
      textAlign: 'left',
      background: activeCard === 'highfive' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'highfive' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'highfive' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#059669'
    }
  }, tr('7. Peer Recognition', '7. Reconocimiento')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#ECFDF5',
      color: '#047857',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, hfSentList.length, " ", tr('Sent', 'Enviados'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Send High Five', 'Enviar High Five')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'highfive' ? '#CBD5E1' : '#334155'
    }
  }, tr('Recognize a teammate on the floor', 'Reconocer a un companero del turno'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setActiveCard(activeCard === 'profile' ? null : 'profile'),
    style: {
      textAlign: 'left',
      background: activeCard === 'profile' ? '#002B55' : '#FFFFFF',
      color: activeCard === 'profile' ? '#FFFFFF' : '#0F172A',
      border: activeCard === 'profile' ? '2px solid #FFB81C' : '1.5px solid #E2E8F0',
      borderRadius: 16,
      padding: 18,
      minHeight: 148,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: activeCard === 'profile' ? '#FFB81C' : '#0072CE'
    }
  }, tr('8. Badge & Skills', '8. Gafete y Habilidades')), /*#__PURE__*/React.createElement("span", {
    style: {
      background: activeEmployee.inTraining ? '#FFF6E0' : '#E6F1FB',
      color: activeEmployee.inTraining ? '#92400E' : '#00468B',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, activeEmployee.inTraining ? tr('In Training', 'En Entrenamiento') : activeEmployee.role)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      margin: '8px 0 4px'
    }
  }, tr('Profile Center', 'Centro de Perfil')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: activeCard === 'profile' ? '#CBD5E1' : '#334155'
    }
  }, activeEmployee.badge, " - ", tr('Shift', 'Turno'), " ", activeEmployee.shift))), activeCard && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      background: '#FFFFFF',
      border: '2px solid #00468B',
      borderRadius: 18,
      padding: 20,
      boxShadow: '0 10px 30px rgba(0,43,85,0.1)'
    }
  }, activeCard === 'tasks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 12px'
    }
  }, tr('My Assigned Shift Tasks', 'Mis Tareas Asignadas del Turno'), " (", activeEmployee.area.toUpperCase(), ")"), myTasks.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      borderRadius: 12,
      background: '#F8FAFC',
      border: '1.5px dashed #CBD5E1',
      color: '#475569',
      fontSize: 13,
      fontWeight: 700
    }
  }, tr('0 tasks currently assigned in Dataverse (craa5___1_g_assignments). Use Team Builder (Shift Start) to assign equipment to this shift.', '0 tareas asignadas actualmente en Dataverse (craa5___1_g_assignments).')) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, myTasks.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: 12,
      background: t.status === 'done' ? '#ECFDF5' : '#F8FAFC',
      border: t.status === 'done' ? '1.5px solid #059669' : '1.5px solid #CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#0F172A'
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#475569',
      fontWeight: 700
    }
  }, t.area, " - ", t.mins, " mins")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleToggleTaskDone(t),
    style: {
      height: 46,
      padding: '0 18px',
      borderRadius: 10,
      border: 'none',
      background: t.status === 'done' ? '#059669' : '#00468B',
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, t.status === 'done' ? tr('Completed (Tap to Undo)', 'Completado') : tr('Mark Done', 'Marcar Listo')))))), activeCard === 'preinspect' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 8px'
    }
  }, tr('Call FSQ / Sanitation Inspector for Pre-Inspection', 'Solicitar Pre-Inspeccion al Inspector FSQ')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: '#475569',
      margin: '0 0 12px'
    }
  }, tr('Select the equipment ready for inspection and tap Call Inspector. Your request appears immediately on Portal 2.', 'Seleccione el equipo listo para inspeccion. Su solicitud aparece de inmediato en el Portal 2.')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: preInspectNote,
    onChange: e => setPreInspectNote(e.target.value),
    placeholder: tr('Optional readiness note (e.g. Drains & guards ready)...', 'Nota opcional (ej. Drenajes y guardas listos)...'),
    style: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 14px',
      fontSize: 14,
      fontWeight: 600
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleCallPreInspection(activeEmployee.area),
    style: {
      height: 48,
      padding: '0 22px',
      borderRadius: 10,
      border: 'none',
      background: '#FFB81C',
      color: '#0F172A',
      fontSize: 14,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Call Inspector Now', 'Llamar Inspector Ahora'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, preInspectRequests.slice(0, 5).map(req => /*#__PURE__*/React.createElement("div", {
    key: req.requestId,
    style: {
      padding: '10px 14px',
      borderRadius: 10,
      background: req.status === 'passed' ? '#ECFDF5' : req.status === 'failed' ? '#FDE8EC' : '#FFFBEB',
      border: '1px solid #CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, req.area.toUpperCase()), " - ", (req.equipmentNames || []).join(', '), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#475569'
    }
  }, req.note)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 900,
      color: req.status === 'passed' ? '#047857' : req.status === 'failed' ? '#E4002B' : '#B45309'
    }
  }, req.status.toUpperCase()))))), activeCard === 'clock' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "160",
    height: "160",
    viewBox: "0 0 160 160"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "80",
    r: "64",
    fill: "none",
    stroke: "#E2E8F0",
    strokeWidth: "16"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "80",
    r: "64",
    fill: "none",
    stroke: "#059669",
    strokeWidth: "16",
    strokeDasharray: `${Math.round(402 * (areaCompletionPct / 100))} 402`,
    strokeLinecap: "round",
    transform: "rotate(-90 80 80)"
  }), /*#__PURE__*/React.createElement("text", {
    x: "80",
    y: "76",
    textAnchor: "middle",
    fill: "#002B55",
    fontSize: "28",
    fontWeight: "900"
  }, areaCompletionPct, "%"), /*#__PURE__*/React.createElement("text", {
    x: "80",
    y: "98",
    textAnchor: "middle",
    fill: "#475569",
    fontSize: "11",
    fontWeight: "800"
  }, "ETA 14:15")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 6px'
    }
  }, activeEmployee.area.toUpperCase(), " - ", tr('Live Sanitation Clock', 'Reloj de Sanitizacion en Vivo')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: '#475569',
      margin: '0 0 12px',
      fontWeight: 600
    }
  }, tr('Step 0 (Drains): Done - Step 1 (PIC): Done - Step 2 (Frontline Foam & Scrub): In Progress', 'Paso 0 (Drenajes): Listo - Paso 1 (PIC): Listo - Paso 2 (Espuma y Lavado): En Progreso')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F1F5F9',
      padding: '10px 14px',
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#64748B'
    }
  }, tr('COMPLETED PIECES', 'PIEZAS LISTAS')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#047857'
    }
  }, doneTasksCount, " / ", totalTasksCount)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F1F5F9',
      padding: '10px 14px',
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#64748B'
    }
  }, tr('AREA LEAD', 'LIDER DE AREA')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#00468B'
    }
  }, activeEmployee.lead))))), activeCard === 'schedule' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 10px'
    }
  }, tr('Today & Tomorrow Production Schedule (Simplified Floor View)', 'Horario de Produccion de Hoy y Manana')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, scheduleRuns.slice(0, 8).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      padding: '10px 14px',
      borderRadius: 10,
      background: r.allergen ? '#FFFBEB' : '#F8FAFC',
      border: r.allergen ? '1.5px solid #F59E0B' : '1px solid #CBD5E1',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 900,
      color: '#00468B',
      marginRight: 8
    }
  }, r.area.toUpperCase(), " L", r.line), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      color: '#0F172A'
    }
  }, r.product)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      fontWeight: 800
    }
  }, r.allergen && /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#FDE8EC',
      color: '#E4002B',
      padding: '2px 8px',
      borderRadius: 999
    }
  }, "ALLERGEN: ", r.allergenType), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#475569'
    }
  }, String(r.start).slice(0, 16).replace('T', ' '))))))), activeCard === 'goals' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 10px'
    }
  }, tr('Supervisor 6-9-12-3 Shift Goals', 'Metas del Supervisor 6-9-12-3')), supervisorGoals.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      borderRadius: 12,
      background: '#F8FAFC',
      border: '1.5px dashed #CBD5E1',
      color: '#475569',
      fontSize: 13,
      fontWeight: 700
    }
  }, tr('0 shift goals published in Dataverse (craa5___1_s_shiftboards). Use Supervisor Hub or Team Builder to publish 6-9-12-3 shift milestones.', '0 metas de turno publicadas en Dataverse (craa5___1_s_shiftboards).')) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, supervisorGoals.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    style: {
      padding: '12px 16px',
      borderRadius: 12,
      background: '#F8FAFC',
      border: '1.5px solid #CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#00468B'
    }
  }, g.quarterTarget, " - ", String(g.area || '').toUpperCase(), " (", g.subcategory, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#334155',
      marginTop: 2
    }
  }, g.notes)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAckedGoalIds(prev => ({
      ...prev,
      [g.id]: true
    })),
    style: {
      height: 42,
      padding: '0 16px',
      borderRadius: 10,
      border: 'none',
      background: ackedGoalIds[g.id] ? '#059669' : '#0072CE',
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer',
      flexShrink: 0
    }
  }, ackedGoalIds[g.id] ? tr('Acknowledged', 'Confirmado') : tr('Got It', 'Entendido')))))), activeCard === 'problem' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 10px'
    }
  }, tr('Submit Floor Problem / Obstacle (Submit-Only)', 'Reportar Problema en Piso')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: probCategory,
    onChange: e => setProbCategory(e.target.value),
    style: {
      height: 46,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 700
    }
  }, ['Mechanical / Maintenance', 'Water / Pressure Issue', 'Chemical / Supply Issue', 'Lockout / Tagout Delay', 'Safety / QA Observation'].map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: probEquip,
    onChange: e => setProbEquip(e.target.value),
    placeholder: tr('Equipment name (optional)...', 'Nombre del equipo (opcional)...'),
    style: {
      height: 46,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 600
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: probNote,
    onChange: e => setProbNote(e.target.value),
    placeholder: tr('Describe the issue clearly for the Supervisor & Maintenance...', 'Describa el problema para el Supervisor...'),
    style: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 14px',
      fontSize: 14,
      fontWeight: 600
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleSubmitProblem,
    style: {
      height: 48,
      padding: '0 22px',
      borderRadius: 10,
      border: 'none',
      background: '#E4002B',
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Submit Issue', 'Enviar Reporte'))), probSubmitted.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: 800,
      color: '#047857'
    }
  }, tr('Submitted to Supervisor To-Do & Ganttly Downtime:', 'Enviado al Supervisor:'), " ", probSubmitted[0].category, " - ", probSubmitted[0].note, " (", probSubmitted[0].at, ")")), activeCard === 'highfive' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 10px'
    }
  }, tr('Send a Peer High Five', 'Enviar un High Five a un Companero')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: hfRecipientId,
    onChange: e => setHfRecipientId(e.target.value),
    style: {
      height: 46,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 700
    }
  }, employees.map(e => /*#__PURE__*/React.createElement("option", {
    key: e.id,
    value: e.id
  }, e.name, " (", e.badge, ")"))), /*#__PURE__*/React.createElement("select", {
    value: hfTag,
    onChange: e => setHfTag(e.target.value),
    style: {
      height: 46,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 12px',
      fontSize: 14,
      fontWeight: 700
    }
  }, ['Teamwork', 'Leadership', 'Detail Oriented', 'Safety First', 'Inspection Ready'].map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: hfNote,
    onChange: e => setHfNote(e.target.value),
    placeholder: tr('Write a quick shoutout for your teammate...', 'Escriba un mensaje de reconocimiento...'),
    style: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      border: '1px solid #CBD5E1',
      padding: '0 14px',
      fontSize: 14,
      fontWeight: 600
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "btn-send-highfive",
    onClick: () => handleSendHighFive(),
    style: {
      height: 48,
      padding: '0 22px',
      borderRadius: 10,
      border: 'none',
      background: '#059669',
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 900,
      cursor: 'pointer'
    }
  }, tr('Send High Five', 'Enviar High Five'))), hfSentList.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#00468B',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: 8
    }
  }, tr('Recent Shift High Fives & Peer Recognition Feed', 'Reconocimientos Recientes del Turno'), " (", hfSentList.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, hfSentList.slice(0, 5).map((item, idx) => /*#__PURE__*/React.createElement("div", {
    key: item.id || idx,
    style: {
      padding: '10px 14px',
      borderRadius: 12,
      background: idx === 0 ? '#ECFDF5' : '#F8FAFC',
      border: idx === 0 ? '1.5px solid #10B981' : '1px solid #CBD5E1',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: '#0F172A'
    }
  }, "To: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#00468B'
    }
  }, item.to), item.from ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: '#64748B'
    }
  }, " - From: ", item.from) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#059669',
      color: '#FFFFFF',
      padding: '2px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, item.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#64748B'
    }
  }, item.at))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#1E293B'
    }
  }, "\"", item.note, "\"")))))), activeCard === 'profile' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 900,
      color: '#002B55',
      margin: '0 0 10px'
    }
  }, tr('Employee Profile & Training Center', 'Centro de Perfil y Entrenamiento')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F8FAFC',
      padding: 14,
      borderRadius: 12,
      border: '1px solid #CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#64748B'
    }
  }, tr('EMPLOYEE & BADGE', 'EMPLEADO Y GAFETE')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#0F172A',
      marginTop: 4
    }
  }, activeEmployee.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: '#00468B',
      marginTop: 2
    }
  }, tr('Badge', 'Gafete'), ": ", activeEmployee.badge, " - ", tr('Shift', 'Turno'), ": ", activeEmployee.shift), activeEmployee.inTraining && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'inline-block',
      background: '#FFF6E0',
      border: '1px solid #FFB81C',
      color: '#92400E',
      padding: '4px 10px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 900
    }
  }, tr('Leadership In-Training Eligible:', 'Elegible para Entrenamiento de Liderazgo:'), " ", activeEmployee.trainingArea)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#F8FAFC',
      padding: 14,
      borderRadius: 12,
      border: '1px solid #CBD5E1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: '#64748B',
      marginBottom: 6
    }
  }, tr('SKILL CERTIFICATIONS', 'CERTIFICACIONES')), (activeEmployee.skills || DEMO_EMP.skills).map((sk, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      fontWeight: 700,
      padding: '3px 0'
    }
  }, /*#__PURE__*/React.createElement("span", null, sk.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#047857',
      fontWeight: 900
    }
  }, sk.level)))))))));
};
})();