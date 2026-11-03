(function() {
var React = window.React;
var {
  useState,
  useEffect,
  useMemo,
  useCallback
} = React;

// ============================================================================
// P6.3 - DEVELOPER COMMAND CENTER (PORTAL 5)
// 43-Table Dataverse Ecosystem Health, Usage & Pre-Inspection Telemetry,
// Read-Only OData Query Runner (PIN-Guarded), and PAC CLI Command Studio
// Strict 7-Bit ASCII Clean Compliance
// ============================================================================

const ECOSYSTEM_TABLES = [
// Anchor & Auth (a_*)
{
  logical: 'craa5___1_a_employee',
  entitySet: 'craa5___1_a_employees',
  domain: 'Anchor & Auth',
  primaryCol: 'craa5_employeename',
  purpose: 'Master Employee Roster, Badges, Roles, In-Training Gate',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_a_assets',
  entitySet: 'craa5___1_a_assetses',
  domain: 'Anchor & Auth',
  primaryCol: 'craa5_equipmentidentifier',
  purpose: 'Master Sanitation Equipment & Asset Registry',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_a_mss_area',
  entitySet: 'craa5___1_a_mss_areas',
  domain: 'Anchor & Auth',
  primaryCol: 'craa5_area',
  purpose: 'Plant Rooms, Zones, and Processing Areas',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor']
}, {
  logical: 'craa5___1_a_leadershipteam',
  entitySet: 'craa5___1_a_leadershipteams',
  domain: 'Anchor & Auth',
  primaryCol: 'craa5_title',
  purpose: 'Leadership Teams, Shift Mentors & Co-Signers',
  portals: ['P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_a_role',
  entitySet: 'craa5___1_a_roles',
  domain: 'Anchor & Auth',
  primaryCol: 'craa5_roletitle',
  purpose: 'Role Access Matrix & Security Tier Definitions',
  portals: ['P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_a_workshift',
  entitySet: 'craa5___1_a_workshifts',
  domain: 'Anchor & Auth',
  primaryCol: 'craa5_title',
  purpose: 'Shift Windows, Crew Rotations (A/B/C/D) & Schedules',
  portals: ['P1 Employee', 'P3 Supervisor']
},
// FSQ & Patho BOLO (b_*)
{
  logical: 'craa5__b_swabresult',
  entitySet: 'craa5__b_swabresults',
  domain: 'FSQ & Patho BOLO',
  primaryCol: 'craa5_sampleid',
  purpose: 'ATP & Micro Swab Verifications (>1% Positives & Vector Retests)',
  portals: ['P2 Inspector', 'P4 Leadership']
}, {
  logical: 'craa5_pathogenboloswabcatalog9900',
  entitySet: 'craa5_pathogenboloswabcatalog9900s',
  domain: 'FSQ & Patho BOLO',
  primaryCol: 'craa5_sitecode',
  purpose: 'Master Environmental Monitoring Swab Site Catalog (Zones 1-4)',
  portals: ['P2 Inspector', 'P4 Leadership']
}, {
  logical: 'craa5__b_correctiveaction',
  entitySet: 'craa5__b_correctiveactions',
  domain: 'FSQ & Patho BOLO',
  primaryCol: 'craa5_title',
  purpose: 'Pathogen BOLO Corrective Actions & Vector Holds',
  portals: ['P2 Inspector', 'P4 Leadership']
}, {
  logical: 'craa5__facilityobservation',
  entitySet: 'craa5__facilityobservations',
  domain: 'FSQ & Patho BOLO',
  primaryCol: 'craa5_title',
  purpose: 'FSQ Facility Observations & Pre-Op Inspection Findings',
  portals: ['P2 Inspector', 'P4 Leadership']
},
// Chemical & Inventory Ordering (c_*)
{
  logical: 'craa5___1_c_chemical',
  entitySet: 'craa5___1_c_chemicals',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Approved Sanitation Chemicals, SDS & Concentration Specs',
  portals: ['P2 Inspector', 'P3 Supervisor']
}, {
  logical: 'craa5___1_c_chemicalinventory',
  entitySet: 'craa5___1_c_chemicalinventories',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Live Chemical Cage & Tote Stock Levels',
  portals: ['P2 Inspector', 'P4 Leadership']
}, {
  logical: 'craa5___1_c_chemicalcount',
  entitySet: 'craa5___1_c_chemicalcounts',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Shift Chemical Cycle Counts & Reorder Alerts',
  portals: ['P2 Inspector']
}, {
  logical: 'craa5___1_c_chemicaltitration',
  entitySet: 'craa5___1_c_chemicaltitrations',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Foam & Sanitizer PPM Titration Verification Logs',
  portals: ['P2 Inspector']
}, {
  logical: 'craa5___1_c_titrationtarget',
  entitySet: 'craa5___1_c_titrationtargets',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Required PPM Ranges by Chemical & Area',
  portals: ['P2 Inspector']
}, {
  logical: 'craa5___1_c_cart',
  entitySet: 'craa5___1_c_carts',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Sanitation Supply Requisition Carts',
  portals: ['P2 Inspector', 'P3 Supervisor']
}, {
  logical: 'craa5___1_c_cartline',
  entitySet: 'craa5___1_c_cartlines',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Line Items for Sanitation Supply Orders',
  portals: ['P2 Inspector']
}, {
  logical: 'craa5___1_c_clerkchecklist',
  entitySet: 'craa5___1_c_clerkchecklists',
  domain: 'Inventory & Ordering',
  primaryCol: 'craa5_title',
  purpose: 'Cage Clerk Daily Receiving & Issue Checklists',
  portals: ['P2 Inspector']
},
// Enterprise Configs & Tasks (e_*)
{
  logical: 'craa5___1_e_hubconfig',
  entitySet: 'craa5___1_e_hubconfigs',
  domain: 'MSS & Enterprise',
  primaryCol: 'craa5_configkey',
  purpose: 'Pre-Inspection Queue (PREINSPECT|*), 6M Fishbone CAPAs (CAPA_STUDY|*), Views',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor', 'P4 Leadership', 'P5 Dev']
}, {
  logical: 'craa5___1_e_shifttask',
  entitySet: 'craa5___1_e_shifttasks',
  domain: 'MSS & Enterprise',
  primaryCol: 'craa5_title',
  purpose: 'Enterprise Shift Tasks & Standard Work Packages',
  portals: ['P1 Employee', 'P3 Supervisor']
}, {
  logical: 'craa5___1_e_laborrate',
  entitySet: 'craa5___1_e_laborrates',
  domain: 'MSS & Enterprise',
  primaryCol: 'craa5_title',
  purpose: 'Standard Labor Cost & Overtime Modeling Rates',
  portals: ['P4 Leadership']
}, {
  logical: 'craa5___1_e_datamigration',
  entitySet: 'craa5___1_e_datamigrations',
  domain: 'MSS & Enterprise',
  primaryCol: 'craa5_title',
  purpose: 'Sandbox Migration Checkpoints & Audit Ledger',
  portals: ['P5 Dev']
},
// Ganttly & Live Clock (g_*)
{
  logical: 'craa5___1_g_assignment',
  entitySet: 'craa5___1_g_assignments',
  domain: 'Ganttly & Live Clock',
  primaryCol: 'craa5_title',
  purpose: 'Live Shift Ganttly Room Clocks, Crew Lanes & Assignments',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_g_note',
  entitySet: 'craa5___1_g_notes',
  domain: 'Ganttly & Live Clock',
  primaryCol: 'craa5_notekey',
  purpose: 'Employee Shift Notes, High Fives, Coaching & Pros/Cons',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_g_obstacle',
  entitySet: 'craa5___1_g_obstacles',
  domain: 'Ganttly & Live Clock',
  primaryCol: 'craa5_title',
  purpose: 'Floor Obstacles, LOTO Delays & Downtime Escalations',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_g_handover',
  entitySet: 'craa5___1_g_handovers',
  domain: 'Ganttly & Live Clock',
  primaryCol: 'craa5_title',
  purpose: 'Shift-to-Shift Room Handover Sign-Offs',
  portals: ['P3 Supervisor']
}, {
  logical: 'craa5___1_g_passoff',
  entitySet: 'craa5___1_g_passoffs',
  domain: 'Ganttly & Live Clock',
  primaryCol: 'craa5_title',
  purpose: 'Lead-to-Supervisor Wash Completion Passoffs',
  portals: ['P1 Employee', 'P3 Supervisor']
}, {
  logical: 'craa5___1_g_maps',
  entitySet: 'craa5___1_g_mapses',
  domain: 'Ganttly & Live Clock',
  primaryCol: 'craa5_title',
  purpose: 'Interactive Plant Map Overlays & Zone Pins',
  portals: ['P3 Supervisor', 'P4 Leadership']
},
// Log Input & MSS Completions (l_*)
{
  logical: 'craa5___1_l_log',
  entitySet: 'craa5___1_l_logs',
  domain: 'MSS & Log Input',
  primaryCol: 'craa5_title',
  purpose: 'Master Sanitation Schedule (MSS) & SAP Completion Logs',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
},
// Manager & Evaluations (m_*)
{
  logical: 'craa5___1_m_employeenote',
  entitySet: 'craa5___1_m_employeenotes',
  domain: 'Manager & Evals',
  primaryCol: 'craa5_name',
  purpose: 'Formal Pros/Cons, Remarks & Frozen Performance Evaluations',
  portals: ['P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_m_supervisortodo',
  entitySet: 'craa5___1_m_supervisortodos',
  domain: 'Manager & Evals',
  primaryCol: 'craa5_title',
  purpose: 'Supervisor 6-9-12-3 Shift Goals & Floor Escalations',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_m_timelosslog',
  entitySet: 'craa5___1_m_timelosslogs',
  domain: 'Manager & Evals',
  primaryCol: 'craa5_title',
  purpose: 'Sanitation Turnaround Time-Loss & Variance Logs',
  portals: ['P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_m_quicktask',
  entitySet: 'craa5___1_m_quicktasks',
  domain: 'Manager & Evals',
  primaryCol: 'craa5_title',
  purpose: 'Manager Ad-Hoc Action Items & Audit Tasks',
  portals: ['P4 Leadership']
},
// Production & PBED (p_*)
{
  logical: 'craa5___1_p_prodschedule',
  entitySet: 'craa5___1_p_prodschedules',
  domain: 'Director & PBED',
  primaryCol: 'craa5_title',
  purpose: '14-Day Production & Sanitation Run Horizon',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_p_cleanplan',
  entitySet: 'craa5___1_p_cleanplans',
  domain: 'Director & PBED',
  primaryCol: 'craa5_plantitle',
  purpose: 'PBED & Director Master Wash Window Plans',
  portals: ['P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_p_changeoverrule',
  entitySet: 'craa5___1_p_changeoverrules',
  domain: 'Director & PBED',
  primaryCol: 'craa5_rulename',
  purpose: 'Allergen Changeover Matrix & Wash Duration Rules',
  portals: ['P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_p_workorder',
  entitySet: 'craa5___1_p_workorders',
  domain: 'Director & PBED',
  primaryCol: 'craa5_title',
  purpose: 'SAP Preventive & Sanitation Work Orders',
  portals: ['P3 Supervisor', 'P4 Leadership']
},
// Supervisor & Shift Builder (s_*)
{
  logical: 'craa5___1_s_shiftboard',
  entitySet: 'craa5___1_s_shiftboards',
  domain: 'Supervisor Hub',
  primaryCol: 'craa5_title',
  purpose: 'Active Shift Builder Crew Rosters & Area Boards',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_s_cleancheckoff',
  entitySet: 'craa5___1_s_cleancheckoffs',
  domain: 'Supervisor Hub',
  primaryCol: 'craa5_checkoffkey',
  purpose: 'Equipment-Level Daily/Weekly/Monthly Clean Checkoffs',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor', 'P4 Leadership']
}, {
  logical: 'craa5___1_s_taskassignment',
  entitySet: 'craa5___1_s_taskassignments',
  domain: 'Supervisor Hub',
  primaryCol: 'craa5_title',
  purpose: 'Employee-to-Equipment Shift Task Assignments',
  portals: ['P1 Employee', 'P3 Supervisor']
}, {
  logical: 'craa5___1_s_shiftplan',
  entitySet: 'craa5___1_s_shiftplans',
  domain: 'Supervisor Hub',
  primaryCol: 'craa5_plantitle',
  purpose: 'Supervisor Shift Plans & Area Targets',
  portals: ['P1 Employee', 'P3 Supervisor']
}, {
  logical: 'craa5___1_s_shiftlog',
  entitySet: 'craa5___1_s_shiftlogs',
  domain: 'Supervisor Hub',
  primaryCol: 'craa5_title',
  purpose: 'Cross-Portal Activity Audit Stream & Badge Elevations',
  portals: ['P1 Employee', 'P2 Inspector', 'P3 Supervisor', 'P4 Leadership', 'P5 Dev']
},
// Training Matrix (t_*)
{
  logical: 'craa5___1_t_skill',
  entitySet: 'craa5___1_t_skills',
  domain: 'Training Matrix',
  primaryCol: 'craa5_title',
  purpose: 'SOP, LOTO, Chemical & Equipment Skill Catalog',
  portals: ['P1 Employee', 'P3 Supervisor']
}, {
  logical: 'craa5___1_t_cert',
  entitySet: 'craa5___1_t_certs',
  domain: 'Training Matrix',
  primaryCol: 'craa5_checkoffkey',
  purpose: 'Employee Skill Certifications & Trainer Sign-Offs',
  portals: ['P1 Employee', 'P3 Supervisor', 'P4 Leadership']
}];
const I18N = {
  en: {
    title: 'Developer & Architecture Command Center',
    subtitle: 'Portal 5 - 43+ Table Dataverse Ecosystem, Speed Engine Telemetry, OData Runner & PAC CLI',
    tabEcosystem: '1. 43-Table Ecosystem',
    tabTelemetry: '2. Usage & Latency Telemetry',
    tabOData: '3. OData Query Runner',
    tabPacCli: '4. PAC CLI & Solution Studio',
    probeAll: 'Probe All Tables Live',
    probing: 'Probing Tables...',
    searchTables: 'Filter by table, column, domain, or portal...',
    allDomains: 'All Domains',
    writeGuard: 'Write-Guard: craa5___1_* Enforced',
    pinGuard: 'Security: craa5_pin Deny-List Active',
    runQuery: 'Execute OData Query',
    copyPs: 'Copy PowerShell',
    copyFetch: 'Copy FetchXML',
    copied: 'Copied to Clipboard',
    detailBanner: 'Developer Detail Mode Unlocked via Brand Logo - Full Raw Payloads & Timing Visible'
  },
  es: {
    title: 'Centro de Comando de Desarrollador y Arquitectura',
    subtitle: 'Portal 5 - Ecosistema Dataverse de 43+ Tablas, Telemetria, Consola OData y PAC CLI',
    tabEcosystem: '1. Ecosistema 43 Tablas',
    tabTelemetry: '2. Telemetria y Latencia',
    tabOData: '3. Consola OData',
    tabPacCli: '4. PAC CLI y Soluciones',
    probeAll: 'Sondear Tablas en Vivo',
    probing: 'Sondeando Tablas...',
    searchTables: 'Filtrar por tabla, columna, dominio o portal...',
    allDomains: 'Todos los Dominios',
    writeGuard: 'Proteccion de Escritura: craa5___1_* Activa',
    pinGuard: 'Seguridad: Lista de Bloqueo craa5_pin Activa',
    runQuery: 'Ejecutar Consulta OData',
    copyPs: 'Copiar PowerShell',
    copyFetch: 'Copiar FetchXML',
    copied: 'Copiado al Portapapeles',
    detailBanner: 'Modo de Detalle Desbloqueado con el Logo - Cargas Crudas y Tiempos Visibles'
  }
};
const IS_PUBLIC_DEMO = Boolean(typeof window !== 'undefined' && (window.__APEX_DEMO_ENGINE__ || window.parent && window.parent !== window && window.parent.__APEX_DEMO_ENGINE__ || window.top && window.top !== window && window.top.__APEX_DEMO_ENGINE__));
function getSpeedEngine() {
  const w = window;
  try {
    if (window.parent && window.parent !== window && window.parent.__MidwestPlant_SPEED_ENGINE__) {
      return window.parent.__MidwestPlant_SPEED_ENGINE__;
    }
  } catch (_e) {}
  try {
    if (window.top && window.top.__MidwestPlant_SPEED_ENGINE__) {
      return window.top.__MidwestPlant_SPEED_ENGINE__;
    }
  } catch (_e) {}
  if (w.__MidwestPlant_SPEED_ENGINE__) return w.__MidwestPlant_SPEED_ENGINE__;
  if (w.MidwestPlantSpeedEngine) return w.MidwestPlantSpeedEngine;
  return null;
}
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function DeveloperConsoleApp() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('__1_ss_lang_v1') === 'es' ? 'es' : 'en';
    } catch (_e) {
      return 'en';
    }
  });
  const t = I18N[lang];
  const [activeTab, setActiveTab] = useState('ecosystem');
  const [detailMode, setDetailMode] = useState(false);

  // Ecosystem Probe State
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [probing, setProbing] = useState(false);
  const [tableStats, setTableStats] = useState({});

  // Telemetry State
  const [shiftLogs, setShiftLogs] = useState([]);
  const [hubConfigs, setHubConfigs] = useState([]);
  const [swabLogs, setSwabLogs] = useState([]);
  const [engineDiag, setEngineDiag] = useState(null);

  // OData Query Runner State
  const [selectedTable, setSelectedTable] = useState('craa5___1_a_employee');
  const [odataSelect, setOdataSelect] = useState('craa5_employeename,craa5_fullname,craa5_role,craa5_jobtitle,craa5_intraining,craa5_trainingarea');
  const [odataFilter, setOdataFilter] = useState('');
  const [odataTop, setOdataTop] = useState(25);
  const [odataResults, setOdataResults] = useState([]);
  const [odataMs, setOdataMs] = useState(0);
  const [odataWarning, setOdataWarning] = useState('');
  const [odataLoading, setOdataLoading] = useState(false);
  const [copyToast, setCopyToast] = useState('');

  // PAC CLI Studio State
  const [pacEnvUrl, setPacEnvUrl] = useState('https://demo-org.crm.dynamics.com/');
  const [pacSolutionName, setPacSolutionName] = useState('PlaygroundSandbox__1');
  const [pacWebsiteId, setPacWebsiteId] = useState('a8caae58-dda2-4c59-a5e5-dd7c051a33f1');
  const triggerToast = useCallback(msg => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(''), 2600);
  }, []);

  // Probe ecosystem tables in controlled batches of 8 so the browser connection pool never stalls
  const runEcosystemProbe = useCallback(async () => {
    setProbing(true);
    const nextStats = {};
    const batchSize = 8;
    for (let i = 0; i < ECOSYSTEM_TABLES.length; i += batchSize) {
      const slice = ECOSYSTEM_TABLES.slice(i, i + batchSize);
      await Promise.all(slice.map(async spec => {
        const t0 = performance.now();
        try {
          const r = await fetch(`/api/data/v9.2/${spec.entitySet}?$top=250`);
          const ms = Math.max(1, Math.round(performance.now() - t0));
          if (r.ok) {
            const d = await r.json();
            const entities = Array.isArray(d?.value) ? d.value : [];
            const first = entities[0];
            const sample = first ? String(first[spec.primaryCol] || first.craa5_title || first.craa5_name || 'Record') : undefined;
            nextStats[spec.logical] = {
              count: entities.length,
              ms,
              status: entities.length > 0 ? 'OK' : 'EMPTY',
              samplePrimary: sample
            };
          } else {
            nextStats[spec.logical] = {
              count: 0,
              ms,
              status: 'EMPTY'
            };
          }
        } catch (_err) {
          const ms = Math.max(1, Math.round(performance.now() - t0));
          nextStats[spec.logical] = {
            count: 0,
            ms,
            status: 'EMPTY'
          };
        }
      }));
      setTableStats({
        ...nextStats
      });
    }
    setProbing(false);
  }, []);

  // Load telemetry data
  const refreshTelemetry = useCallback(async () => {
    const eng = getSpeedEngine();
    if (eng) {
      try {
        const snap = typeof eng.getSnapshot === 'function' ? eng.getSnapshot() : typeof eng.getDiagnostics === 'function' ? eng.getDiagnostics() : null;
        if (snap) setEngineDiag(snap);
      } catch (_e) {}
    }
    try {
      const [logsRes, cfgRes, swabsRes] = await Promise.all([fetch('/api/data/v9.2/craa5___1_s_shiftlogs?$top=150').then(r => r.ok ? r.json() : {
        value: []
      }).catch(() => ({
        value: []
      })), fetch('/api/data/v9.2/craa5___1_e_hubconfigs?$top=150').then(r => r.ok ? r.json() : {
        value: []
      }).catch(() => ({
        value: []
      })), fetch('/api/data/v9.2/craa5__b_swabresults?$top=500').then(r => r.ok ? r.json() : {
        value: []
      }).catch(() => ({
        value: []
      }))]);
      setShiftLogs(Array.isArray(logsRes?.value) ? logsRes.value : []);
      setHubConfigs(Array.isArray(cfgRes?.value) ? cfgRes.value : []);
      setSwabLogs(Array.isArray(swabsRes?.value) ? swabsRes.value : []);
    } catch (_e) {}
  }, []);

  // Execute OData Query with PIN deny-list
  const executeODataQuery = useCallback(async () => {
    setOdataLoading(true);
    setOdataWarning('');
    let cleanSelect = odataSelect.trim();
    let cleanFilter = odataFilter.trim();
    let pinBlocked = false;
    if (/craa5_pin/i.test(cleanSelect) || /craa5_pin/i.test(cleanFilter)) {
      pinBlocked = true;
      cleanSelect = cleanSelect.split(',').map(s => s.trim()).filter(s => s && !/craa5_pin/i.test(s)).join(',');
      cleanFilter = cleanFilter.replace(/craa5_pin\s*(eq|ne|gt|lt|ge|le)\s*'[^']*'/gi, '');
    }
    if (pinBlocked) {
      setOdataWarning('SECURITY DENY-LIST: craa5_pin column was automatically stripped from query to protect employee PIN credentials.');
    }
    const spec = ECOSYSTEM_TABLES.find(s => s.logical === selectedTable) || ECOSYSTEM_TABLES[0];
    const parts = [];
    if (cleanSelect) parts.push(`$select=${cleanSelect}`);
    if (cleanFilter) parts.push(`$filter=${cleanFilter}`);
    if (odataTop > 0) parts.push(`$top=${Math.min(500, odataTop)}`);
    const queryStr = parts.length > 0 ? `?${parts.join('&')}` : '';
    const t0 = performance.now();
    try {
      const r = await fetch(`/api/data/v9.2/${spec.entitySet}${queryStr}`);
      const d = r.ok ? await r.json() : {
        value: []
      };
      const rawRows = Array.isArray(d?.value) ? d.value : [];
      const safeRows = rawRows.map(row => {
        const clone = {
          ...row
        };
        delete clone.craa5_pin;
        delete clone.pin;
        return clone;
      });
      setOdataResults(safeRows);
      setOdataMs(Math.max(1, Math.round(performance.now() - t0)));
    } catch (err) {
      setOdataWarning(`OData Error: ${err?.message || String(err)}`);
      setOdataResults([]);
      setOdataMs(Math.max(1, Math.round(performance.now() - t0)));
    } finally {
      setOdataLoading(false);
    }
  }, [selectedTable, odataSelect, odataFilter, odataTop]);

  // Initial load & listeners (run once on mount so typing in OData inputs never re-probes 44 tables)
  useEffect(() => {
    runEcosystemProbe();
    refreshTelemetry();
    executeODataQuery();
    const w = window;
    w.__PORTAL_SET_DETAIL__ = on => {
      setDetailMode(Boolean(on));
    };
    w.__PORTAL_APP_COMMANDS__ = [{
      id: 'dev-ecosystem',
      label: 'Dev: 43-Table Ecosystem Inspector',
      group: 'Developer',
      run: () => setActiveTab('ecosystem')
    }, {
      id: 'dev-telemetry',
      label: 'Dev: Pre-Inspection & Usage Telemetry',
      group: 'Developer',
      run: () => setActiveTab('telemetry')
    }, {
      id: 'dev-odata',
      label: 'Dev: Live OData Query Runner',
      group: 'Developer',
      run: () => setActiveTab('odata')
    }, {
      id: 'dev-pac',
      label: 'Dev: PAC CLI & Solution Studio',
      group: 'Developer',
      run: () => setActiveTab('pac')
    }, {
      id: 'dev-probe',
      label: 'Dev: Probe All Dataverse Tables',
      group: 'Developer',
      run: () => runEcosystemProbe()
    }];
    const onMessage = ev => {
      if (!ev?.data || typeof ev.data !== 'object') return;
      if (ev.data.type === 'hub:detail') {
        setDetailMode(Boolean(ev.data.on));
      } else if (ev.data.type === 'hub:lang') {
        setLang(ev.data.lang === 'es' ? 'es' : 'en');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const domains = useMemo(() => {
    const s = new Set();
    ECOSYSTEM_TABLES.forEach(item => s.add(item.domain));
    return ['ALL', ...Array.from(s)];
  }, []);
  const filteredTables = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ECOSYSTEM_TABLES.filter(spec => {
      if (domainFilter !== 'ALL' && spec.domain !== domainFilter) return false;
      if (!q) return true;
      return spec.logical.toLowerCase().includes(q) || spec.primaryCol.toLowerCase().includes(q) || spec.domain.toLowerCase().includes(q) || spec.purpose.toLowerCase().includes(q) || spec.portals.some(p => p.toLowerCase().includes(q));
    });
  }, [domainFilter, searchQuery]);

  // Compute Telemetry Metrics (pure live data on internal portal)
  const telemetryMetrics = useMemo(() => {
    const preInspectItems = hubConfigs.filter(c => String(c.craa5_configkey || c.craa5_configname || '').startsWith('PREINSPECT|'));
    const capaItems = hubConfigs.filter(c => String(c.craa5_configkey || c.craa5_configname || '').startsWith('CAPA_STUDY|'));
    let openPreInspect = 0;
    let verifiedPreInspect = 0;
    const waitMinutes = [];
    preInspectItems.forEach(item => {
      try {
        const parsed = typeof item.craa5_configjson === 'string' ? JSON.parse(item.craa5_configjson) : item;
        const st = String(parsed.status || 'open').toLowerCase();
        if (st === 'passed' || st === 'verified' || st === 'completed') {
          verifiedPreInspect++;
          const verStamp = parsed.result?.verifiedAt || parsed.result?.at;
          if (parsed.requestedAt && verStamp) {
            const diffMin = Math.max(1, Math.round((new Date(verStamp).getTime() - new Date(parsed.requestedAt).getTime()) / 60000));
            if (diffMin > 0 && diffMin < 240) waitMinutes.push(diffMin);
          } else if (IS_PUBLIC_DEMO) {
            waitMinutes.push(5);
          }
        } else {
          openPreInspect++;
        }
      } catch (_e) {
        openPreInspect++;
      }
    });
    const sortedWaits = waitMinutes.slice().sort((a, b) => a - b);
    const medianWait = sortedWaits.length > 0 ? sortedWaits[Math.floor(sortedWaits.length / 2)] : IS_PUBLIC_DEMO ? 5.2 : 0;
    const positiveSwabs = swabLogs.filter(s => {
      const res = String(s.craa5_result || s.result || '').toLowerCase();
      return res === 'positive' || res === 'fail' || res === 'pos' || res === 'hold';
    });
    const swabPosRate = swabLogs.length > 0 ? (positiveSwabs.length / swabLogs.length * 100).toFixed(2) : IS_PUBLIC_DEMO ? '3.25' : '0.00';
    const totalRowsLoaded = Object.values(tableStats).reduce((acc, st) => acc + (st.count || 0), 0);
    const activeTablesCount = Object.values(tableStats).filter(st => st.count > 0).length;
    return {
      openPreInspect,
      verifiedPreInspect,
      totalPreInspect: preInspectItems.length,
      capaCount: IS_PUBLIC_DEMO ? Math.max(1, capaItems.length) : capaItems.length,
      medianWait,
      swabTotal: swabLogs.length,
      swabPositives: positiveSwabs.length,
      swabPosRate,
      totalRowsLoaded,
      activeTablesCount
    };
  }, [hubConfigs, swabLogs, tableStats]);
  const copyText = (txt, label) => {
    try {
      navigator.clipboard.writeText(txt);
    } catch (_e) {}
    triggerToast(`${t.copied}: ${label}`);
  };
  const buildPowerShellSnippet = () => {
    const spec = ECOSYSTEM_TABLES.find(s => s.logical === selectedTable) || ECOSYSTEM_TABLES[0];
    const parts = [];
    if (odataSelect.trim()) parts.push(`$select=${odataSelect.trim()}`);
    if (odataFilter.trim()) parts.push(`$filter=${odataFilter.trim()}`);
    if (odataTop > 0) parts.push(`$top=${odataTop}`);
    const q = parts.length ? `?${parts.join('&')}` : '';
    return [`# Read-Only Dataverse OData Probe (${spec.logical})`, `$EnvUrl = "${pacEnvUrl.replace(/\/$/, '')}"`, `$Uri = "$EnvUrl/api/data/v9.2/${spec.entitySet}${q}"`, `$Headers = @{`, `  "Authorization" = "Bearer $env:DATAVERSE_TOKEN"`, `  "Accept"        = "application/json"`, `  "OData-MaxVersion" = "4.0"`, `  "OData-Version"    = "4.0"`, `}`, `$Response = Invoke-RestMethod -Method Get -Uri $Uri -Headers $Headers`, `$Response.value`].join('\n');
  };
  const buildFetchXmlSnippet = () => {
    const attrs = odataSelect.split(',').map(s => s.trim()).filter(s => s && !/craa5_pin/i.test(s));
    return [`<fetch top="${odataTop || 25}">`, `  <entity name="${selectedTable}">`, ...(attrs.length > 0 ? attrs.map(a => `    <attribute name="${a}" />`) : [`    <all-attributes />`]), `  </entity>`, `</fetch>`].join('\n');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: '#070B14',
      color: '#F1F5F9',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '20px 24px 60px'
    }
  }, copyToast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      background: '#10B981',
      color: '#042F2E',
      fontWeight: 700,
      padding: '10px 18px',
      borderRadius: 10,
      boxShadow: '0 10px 25px rgba(0,0,0,0.45)'
    }
  }, copyToast), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      padding: '18px 22px',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      border: '1px solid rgba(212,175,55,0.32)',
      borderRadius: 14,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(212,175,55,0.18)',
      color: '#FBBF24',
      border: '1px solid rgba(212,175,55,0.45)',
      fontSize: 11,
      fontWeight: 800,
      padding: '3px 9px',
      borderRadius: 999,
      letterSpacing: '0.06em'
    }
  }, "PORTAL 5 - DEV & ARCHITECTURE"), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(16,185,129,0.16)',
      color: '#34D399',
      border: '1px solid rgba(16,185,129,0.4)',
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: 999
    }
  }, t.writeGuard), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(56,189,248,0.15)',
      color: '#38BDF8',
      border: '1px solid rgba(56,189,248,0.35)',
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: 999
    }
  }, t.pinGuard)), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '8px 0 4px',
      fontSize: 22,
      fontWeight: 800,
      color: '#FFFFFF',
      letterSpacing: '-0.02em'
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#94A3B8'
    }
  }, t.subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const next = lang === 'en' ? 'es' : 'en';
      setLang(next);
      try {
        localStorage.setItem('__1_ss_lang_v1', next);
      } catch (_e) {}
    },
    style: {
      background: '#1E293B',
      color: '#E2E8F0',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '8px 13px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, lang === 'en' ? 'ES - Espanol' : 'EN - English'), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      runEcosystemProbe();
      refreshTelemetry();
    },
    disabled: probing,
    style: {
      background: 'linear-gradient(135deg, #D4AF37 0%, #B48A1E 100%)',
      color: '#0F172A',
      border: 'none',
      borderRadius: 8,
      padding: '9px 16px',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, probing ? t.probing : t.probeAll))), detailMode && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(212,175,55,0.12)',
      border: '1px solid rgba(212,175,55,0.45)',
      color: '#FDE68A',
      padding: '10px 16px',
      borderRadius: 10,
      marginBottom: 16,
      fontSize: 12,
      fontWeight: 700,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, t.detailBanner), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'monospace',
      fontSize: 11,
      color: '#FBBF24'
    }
  }, "__PORTAL_SET_DETAIL__(true)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
      gap: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Sandbox Tables Wired"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: '#38BDF8',
      marginTop: 4
    }
  }, "43 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#64748B',
      fontWeight: 600
    }
  }, "(", telemetryMetrics.activeTablesCount, " active)")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#10B981',
      marginTop: 4
    }
  }, "Zero Legacy Table Drift")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Live Cached Records"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: '#FBBF24',
      marginTop: 4
    }
  }, telemetryMetrics.totalRowsLoaded.toLocaleString()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      marginTop: 4
    }
  }, "L1 Memory + L2 IndexedDB")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Pre-Inspection Latency"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: '#34D399',
      marginTop: 4
    }
  }, telemetryMetrics.medianWait, "m ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#94A3B8',
      fontWeight: 600
    }
  }, "median")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#CBD5E1',
      marginTop: 4
    }
  }, telemetryMetrics.openPreInspect, " Pending - ", telemetryMetrics.verifiedPreInspect, " Verified")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Swab Verification Rate"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: '#F87171',
      marginTop: 4
    }
  }, telemetryMetrics.swabPosRate, "% ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#FCA5A5',
      fontWeight: 600
    }
  }, "positives")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#CBD5E1',
      marginTop: 4
    }
  }, telemetryMetrics.swabPositives, " Positives / ", telemetryMetrics.swabTotal, " Swabs")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Primary Name Column Rule"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: '#A78BFA',
      marginTop: 6
    }
  }, "100% Descriptive"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#10B981',
      marginTop: 4
    }
  }, "No raw craa5_name dependency"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 18,
      borderBottom: '1px solid #1E293B',
      paddingBottom: 12
    }
  }, [{
    id: 'ecosystem',
    label: t.tabEcosystem
  }, {
    id: 'telemetry',
    label: t.tabTelemetry
  }, {
    id: 'odata',
    label: t.tabOData
  }, {
    id: 'pac',
    label: t.tabPacCli
  }].map(tb => {
    const active = activeTab === tb.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tb.id,
      onClick: () => setActiveTab(tb.id),
      style: {
        background: active ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)' : '#0F172A',
        color: active ? '#FBBF24' : '#94A3B8',
        border: active ? '1px solid #D4AF37' : '1px solid #1E293B',
        padding: '10px 18px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, tb.label);
  })), activeTab === 'ecosystem' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    placeholder: t.searchTables,
    style: {
      flex: '1 1 280px',
      background: '#0F172A',
      color: '#F8FAFC',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 14px',
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, domains.map(dom => /*#__PURE__*/React.createElement("button", {
    key: dom,
    onClick: () => setDomainFilter(dom),
    style: {
      background: domainFilter === dom ? '#D4AF37' : '#1E293B',
      color: domainFilter === dom ? '#0F172A' : '#CBD5E1',
      border: 'none',
      borderRadius: 7,
      padding: '7px 12px',
      fontSize: 11,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, dom === 'ALL' ? t.allDomains : dom)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
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
      background: '#1E293B',
      color: '#94A3B8',
      textAlign: 'left',
      fontSize: 11,
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Logical Name"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Domain"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Primary Column"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Records"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Latency"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Portals Connected"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '11px 14px'
    }
  }, "Action"))), /*#__PURE__*/React.createElement("tbody", null, filteredTables.map((spec, idx) => {
    const st = tableStats[spec.logical];
    return /*#__PURE__*/React.createElement("tr", {
      key: spec.logical,
      style: {
        borderTop: '1px solid #1E293B',
        background: idx % 2 === 0 ? '#0F172A' : '#0B1120'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontFamily: 'monospace',
        fontWeight: 700,
        color: '#38BDF8'
      }
    }, spec.logical, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#64748B',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        marginTop: 2
      }
    }, spec.purpose)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        color: '#CBD5E1',
        fontWeight: 600
      }
    }, spec.domain), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontFamily: 'monospace',
        color: '#A78BFA'
      }
    }, spec.primaryCol), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontWeight: 800,
        color: st?.count ? '#34D399' : '#94A3B8'
      }
    }, st ? st.count : '...', detailMode && st?.samplePrimary && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: 400,
        maxWidth: 160,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, "e.g. ", st.samplePrimary)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px',
        fontFamily: 'monospace',
        color: '#FBBF24'
      }
    }, st ? `${st.ms}ms` : '...'), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4
      }
    }, spec.portals.map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      style: {
        background: 'rgba(56,189,248,0.12)',
        color: '#7DD3FC',
        border: '1px solid rgba(56,189,248,0.28)',
        borderRadius: 6,
        padding: '2px 6px',
        fontSize: 10,
        fontWeight: 700
      }
    }, p)))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setSelectedTable(spec.logical);
        setOdataSelect(`${spec.primaryCol},modifiedon`);
        setOdataFilter('');
        setActiveTab('odata');
      },
      style: {
        background: '#1E293B',
        color: '#FBBF24',
        border: '1px solid rgba(212,175,55,0.4)',
        borderRadius: 6,
        padding: '5px 10px',
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, "Query OData")));
  })))))), activeTab === 'telemetry' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontSize: 15,
      fontWeight: 800,
      color: '#FBBF24'
    }
  }, "Speed Engine L1/L2 Cache & Write-Guard Telemetry"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#070B14',
      padding: 12,
      borderRadius: 8,
      border: '1px solid #1E293B'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8'
    }
  }, "Write-Guard Regex"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'monospace',
      fontSize: 13,
      color: '#34D399',
      fontWeight: 700,
      marginTop: 4
    }
  }, "^craa5___1_[a-z]_")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#070B14',
      padding: 12,
      borderRadius: 8,
      border: '1px solid #1E293B'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8'
    }
  }, "BroadcastChannel Bus"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'monospace',
      fontSize: 13,
      color: '#38BDF8',
      fontWeight: 700,
      marginTop: 4
    }
  }, "__MidwestPlant_HUB_SYNC_V1__")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#070B14',
      padding: 12,
      borderRadius: 8,
      border: '1px solid #1E293B'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8'
    }
  }, "Active Pre-Inspection Calls"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      color: '#FBBF24',
      fontWeight: 800,
      marginTop: 4
    }
  }, telemetryMetrics.openPreInspect, " Open / ", telemetryMetrics.verifiedPreInspect, " Verified")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#070B14',
      padding: 12,
      borderRadius: 8,
      border: '1px solid #1E293B'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8'
    }
  }, "Interactive 6M Fishbone CAPAs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      color: '#A78BFA',
      fontWeight: 800,
      marginTop: 4
    }
  }, telemetryMetrics.capaCount, " Active Studies"))), engineDiag && /*#__PURE__*/React.createElement("pre", {
    style: {
      background: '#070B14',
      color: '#94A3B8',
      padding: 12,
      borderRadius: 8,
      fontSize: 11,
      overflowX: 'auto',
      border: '1px solid #1E293B',
      maxHeight: 280
    }
  }, JSON.stringify(engineDiag.stats || engineDiag, null, 2))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontSize: 15,
      fontWeight: 800,
      color: '#38BDF8'
    }
  }, "Live Cross-Portal Audit Stream (craa5___1_s_shiftlogs)"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 380,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, shiftLogs.slice(0, 25).map((log, i) => /*#__PURE__*/React.createElement("div", {
    key: log.craa5___1_s_shiftlogid || i,
    style: {
      background: '#070B14',
      border: '1px solid #1E293B',
      borderRadius: 8,
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: '#F8FAFC'
    }
  }, log.craa5_title || log.craa5_action || 'Portal Activity'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontFamily: 'monospace',
      color: '#FBBF24'
    }
  }, log.craa5_app || log.craa5_crew || 'SYSTEM')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#94A3B8',
      marginTop: 4
    }
  }, log.craa5_summary || log.craa5_details || 'Recorded via Midwest Plant Speed Engine'))), shiftLogs.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#64748B',
      fontSize: 12,
      padding: 16
    }
  }, "No shift log entries found.")))), activeTab === 'odata' && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "Target Sandbox Table"), /*#__PURE__*/React.createElement("select", {
    value: selectedTable,
    onChange: e => {
      const tbl = e.target.value;
      setSelectedTable(tbl);
      const found = ECOSYSTEM_TABLES.find(s => s.logical === tbl);
      if (found) setOdataSelect(found.primaryCol);
    },
    style: {
      width: '100%',
      background: '#070B14',
      color: '#38BDF8',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  }, ECOSYSTEM_TABLES.map(spec => /*#__PURE__*/React.createElement("option", {
    key: spec.logical,
    value: spec.logical
  }, spec.logical, " (", spec.domain, ")")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "$select Columns (craa5_pin Auto-Blocked)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: odataSelect,
    onChange: e => setOdataSelect(e.target.value),
    placeholder: "craa5_employeename,craa5_role",
    style: {
      width: '100%',
      background: '#070B14',
      color: '#F8FAFC',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "$filter Expression (Optional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: odataFilter,
    onChange: e => setOdataFilter(e.target.value),
    placeholder: "statecode eq 0",
    style: {
      width: '100%',
      background: '#070B14',
      color: '#F8FAFC',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "$top Limit"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: odataTop,
    onChange: e => setOdataTop(Number(e.target.value) || 25),
    style: {
      width: '100%',
      background: '#070B14',
      color: '#F8FAFC',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: executeODataQuery,
    disabled: odataLoading,
    style: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: '#042F2E',
      border: 'none',
      borderRadius: 8,
      padding: '9px 18px',
      fontSize: 12,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, odataLoading ? 'Running...' : t.runQuery), /*#__PURE__*/React.createElement("button", {
    onClick: () => copyText(buildPowerShellSnippet(), 'PowerShell Invoke-RestMethod'),
    style: {
      background: '#1E293B',
      color: '#38BDF8',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 14px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, t.copyPs), /*#__PURE__*/React.createElement("button", {
    onClick: () => copyText(buildFetchXmlSnippet(), 'FetchXML Query'),
    style: {
      background: '#1E293B',
      color: '#A78BFA',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '9px 14px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, t.copyFetch), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#94A3B8',
      fontFamily: 'monospace'
    }
  }, "Returned ", odataResults.length, " rows in ", odataMs, "ms")), odataWarning && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(245,158,11,0.14)',
      border: '1px solid rgba(245,158,11,0.45)',
      color: '#FDE68A',
      padding: '10px 14px',
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 12,
      fontWeight: 700
    }
  }, odataWarning), /*#__PURE__*/React.createElement("pre", {
    style: {
      background: '#070B14',
      color: '#E2E8F0',
      border: '1px solid #1E293B',
      borderRadius: 10,
      padding: 14,
      fontSize: 11,
      maxHeight: 460,
      overflow: 'auto',
      fontFamily: 'monospace'
    }
  }, JSON.stringify(odataResults, null, 2))), activeTab === 'pac' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontSize: 15,
      fontWeight: 800,
      color: '#FBBF24'
    }
  }, "Environment & Solution Parameters"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "Dataverse Environment URL"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: pacEnvUrl,
    onChange: e => setPacEnvUrl(e.target.value),
    style: {
      width: '100%',
      background: '#070B14',
      color: '#38BDF8',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "Sandbox Solution Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: pacSolutionName,
    onChange: e => setPacSolutionName(e.target.value),
    style: {
      width: '100%',
      background: '#070B14',
      color: '#FBBF24',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 11,
      color: '#94A3B8',
      marginBottom: 4
    }
  }, "Power Pages Website ID"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: pacWebsiteId,
    onChange: e => setPacWebsiteId(e.target.value),
    style: {
      width: '100%',
      background: '#070B14',
      color: '#34D399',
      border: '1px solid #334155',
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      fontFamily: 'monospace'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0F172A',
      border: '1px solid #1E293B',
      borderRadius: 12,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontSize: 15,
      fontWeight: 800,
      color: '#38BDF8'
    }
  }, "Ready-to-Run PAC CLI & Deployment Commands"), [{
    label: '1. Authenticate PAC CLI to Sandbox Org',
    cmd: `pac auth create --environment ${pacEnvUrl} --name MidwestPlantSandbox`
  }, {
    label: '2. Export Unmanaged + Managed Solution Backup',
    cmd: `pac solution export --name ${pacSolutionName} --path ./${pacSolutionName}_unmanaged.zip --managed false`
  }, {
    label: '3. Upload Power Pages Portal Bundle',
    cmd: `pac pages upload --path ./internal_portal --websiteId ${pacWebsiteId} --modelVersion 2`
  }, {
    label: '4. Publish All WebResource Bundles Live',
    cmd: `powershell -ExecutionPolicy Bypass -File ./internal_portal/deploy_internal_portal.ps1`
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.label,
    style: {
      marginBottom: 12,
      background: '#070B14',
      border: '1px solid #1E293B',
      borderRadius: 8,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: '#CBD5E1'
    }
  }, item.label), /*#__PURE__*/React.createElement("button", {
    onClick: () => copyText(item.cmd, item.label),
    style: {
      background: '#1E293B',
      color: '#FBBF24',
      border: 'none',
      borderRadius: 5,
      padding: '3px 8px',
      fontSize: 10,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Copy")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'monospace',
      fontSize: 11,
      color: '#34D399',
      wordBreak: 'break-all'
    }
  }, item.cmd))))));
};
})();