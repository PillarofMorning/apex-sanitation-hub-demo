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
/* =======================================================================
LEARNINGS & CHAT CONTEXT LOG
=======================================================================
- Entry 1-14: Built Dataverse Map tracking app, mapped schema, timeframe filters, location thumbnails, and edit capabilities.
- Entry 15: Removed mock databases, added native fetch wrappers for live API integration (read/write), and added a payload copy button to debug console.
- Entry 16: Restored the accidentally removed `Download` icon definition which was causing a ReferenceError crash on load.
- Entry 17: The three requested changes, plus what they pulled in.
  * Category filter: one shared filter (multi-select chips with counts) for the map, Recent Issues, Gallery and the Data Table tab; the chips double
    as the map legend and flags / pins / badges are coloured by category. Map Submission keeps showing every pin of the timeframe. Free-text notes
    are now the single "note" category (still shown with their text); a Note whose text equals a category name is refused, because category and
    note share the one craa5__customnote column.
  * Pictures: saved and loaded for real. The row is saved first, then the picture is PATCHed to the table's Image/File column as octet-stream
    (DELETE to remove); the column is auto-detected from metadata, or pin PICTURE_COLUMN. Photos are re-encoded as JPEG with the long side capped at
    1600 px. A failed picture upload keeps the saved row and the form open, and Update retries only the picture. Row saves send If-Match on edits
    (a row deleted elsewhere is no longer silently re-created) and show Dataverse's own error message.
  * Data Table is a rolling Action Item Rail: newest first in day groups, windowed 30 at a time, with search, the shared chips, location and photo
    thumbnails, and Locate / Details / Edit.
  * Also fixed: logEvent is stable (the edit form re-rendered in an infinite loop); jumping to an item from the rail or Recent Issues zooms without
    the width animation so the map ends up centred on it; the edit form scrolls the Submission map to its box again.
- Entry 18: "Midwest Plant Facility Submission".
  * Company theme (blue, yellow, red, logo top right; set LOGO_URL to use the official logo), as in the Production Manager and Ganttly.
  * Search: one search box shared by the Overview map, Gallery and Action Item Rail (room, area, equipment, text, notify, who). Enter on the map
    jumps to the item when only one matches.
  * Equipment: attach equipment from the equipment table (craa5___1_a_assets) to an observation, by search or by ticking it in a list of the
    room's equipment. Never loads the whole table: every lookup is a filtered query of at most 100 rows. Names go in craa5__equipment
    ("; " between them); the equipment ids go in a text column whose name looks like "equipment ... guid/id" when the table has one
    (or pin EQUIPMENT_ID_COLUMN). Typed text that is not in the table can still be attached as text.
  * Closed: an observation can be marked Closed (and reopened). This uses the table's built-in Status (statecode 1 = Inactive), so no new
    column is needed. Closed flags are grey with a check on the map; Open / Closed / All sits beside the category chips.
  * HOST RULE: the app host compiles to ES5 without iterable support. Never spread or for-of a Set or Map; use arrays and Array.from.
- Entry 19: Hide closed, and the Assets tab.
  * Overview map: a "Hide closed" switch (on at first, remembered on the device) replaces Open / Closed / Both there. Gallery and the
    Action Item Rail keep Open / Closed / Both.
  * Assets tab (table craa5___1_a_assets): the placed assets are pins on the map; a search list (Dataverse queries, 50 rows a page, never the
    whole table) finds any asset; "+ New asset" creates one with or without a map spot.
  * Smart snap: the map picture is read once into dark lines / light floor (Otsu threshold, small door gaps closed, every light area
    numbered; big pictures are shrunk keeping each cell's darkest pixel so thin walls survive). A click inside an outlined area highlights
    that area and the pin stays where it was clicked; a click on a solid black shape takes the shape; text labels and lines find the
    area around them (pin in its middle); open floor (reaching the picture edge) does not snap. Off = exact click. Pins on the same
    point are fanned out so each can be clicked.
  * Map spots are saved as JSON text {"v":1,"m":"MAIN","x":..,"y":..,"b":[l,t,w,h],"s":1} (percent of the picture) in the Assets text
    column found by name ("Map Location", craa5_maplocation) or pinned in ASSET_MAP_COLUMN. Without that column the tab still lists and
    edits assets and says which column to add.
  * Asset editor: every readable column of the table from its metadata, by type (text, numbers with limits, yes/no switches for the
    cleaning frequencies, choices, dates by their behaviour, lookups via their navigation property), File and Image columns with upload /
    open / remove (their own requests). Saves send only the changed columns with the row's etag (If-Match), so someone else's newer change
    is never overwritten silently ("Save mine anyway" overrides). Unsaved edits are never dropped without asking; the Assets tab stays
    alive (hidden) when another tab is opened, so its edits are still there on the way back. Fields are locked while a save runs.
- Entry 20: Box snap, a map you can turn and pop out, and the equipment table.
  * Assets has two sub-tabs, Map and Equipment table (the last one used is remembered). Both stay alive once opened, so nothing
    typed in one is lost by looking at the other; a save in one shows in the other (pins, list, card, table row).
  * Map: drag a box around something and smart snap fits it to the black lines inside it (enclosed areas plus the lines around
    them; no enclosed area = the lines' own extent; no lines = the box as drawn). Saved with "s":2. A click still snaps as before.
    "Drag: move map" pans instead; the middle button and two fingers always pan, two fingers pinch to zoom.
  * Turn left / right (remembered on the device; pins stay upright, spots are always saved in picture terms), zoom 25-800% with
    the buttons or Ctrl + wheel around the pointer, Fit, and Pop out (the map fills the screen; Esc or Close pop-out comes back).
  * A pin opens a short card (picture, cleaning frequencies, a few facts, Move / Remove from map, "Edit in table"). Every
    column is edited in the Equipment table; the full editor stays on the map only for "+ New asset here".
  * Equipment table: 50 rows a page with the total (Show more for the next 50), search, room, on / off the map, sort by a column
    header (in Dataverse), and a Columns list (sections, remembered on the device). Every column is fetched once, so showing a
    column needs no new query. Cells edit by type; each row saves only its changed columns with its etag (412: "Reload row" or
    "Save mine anyway"); Save all / Discard all; a changed row that drops out of a search is kept at the top. Pictures and files
    upload, open and remove straight from their cells (the table asks for file names and picture time stamps, never the
    pictures). Details opens the full editor in a side panel; + New asset creates one there and keeps it open for uploads.
    If Dataverse refuses the column list, the table asks again for every column instead.
  * A cell typed back to its old value is no change; a copy of a row older than the one on screen (by etag version) is ignored.
    Moving the map by drag follows the pointer at any app zoom, and zooming keeps the point under the pointer still.
    On a short screen (a phone turned sideways) the table page scrolls, so the rows and Show more can be reached.
- Entry 21: SOP and picture uploads fixed, and a Bulk upload sub-tab.
  * Why uploads could not be done: Dataverse reports File columns (SSOP) as not valid for create or update, because their
    bytes only go in through uploads. The app took that as "read-only" and hid every Upload button. File and Image columns
    now always offer Upload; Dataverse checks the user's rights when the file is sent.
  * Uploads try one PATCH with the whole file first; if that is refused (or the file is over 128 MB) the same file goes again
    through Dataverse's block messages (InitializeFileBlocksUpload, 4 MB UploadBlock parts, CommitFileBlocksUpload). A failure
    shows what both ways answered.
  * Bulk upload (Assets, third sub-tab): drop or choose many pictures and documents. Each gets a column (pictures to the Image
    column, documents to the SOP column, or chosen) and a piece of equipment: a suggestion from its file name (the equipment
    named exactly so, else the only one holding all its words; "Use all suggestions"), or a search by name, room, area or id
    (8 at most; the exact name first). Two files for the same equipment and column are stopped. "Upload ready" sends them one
    at a time; each card says where it went and what was sent, and the table, the map card and the pins follow at once.
  * The columns the tab can use are listed (found / missing). Without an Image column, pictures wait for a column choice,
    because a File column holds one file and would take the SOP's place: add an Image column named "Picture".
  * Every picture is saved as a JPG (see Entry 24); for an Image column it is also shrunk to at most 1600 px.
  * A file that would take the place of an SOP or picture already stored is marked in amber and "Upload ready" asks first.
    No permission, file too big and similar answers are said once in plain words and not sent again in parts.
- Entry 22: Picture of Equipment found, columns that can be picked or checked again, asset tabs, issues from Bulk Upload.
  * The app now expects Alex's column names: Picture of Equipment (craa5_pictureofequipment, Image), SSOP and SOP 1 to 3
    (craa5_ssop, craa5_sop1..3, File) and Map Location (craa5_maplocation). An Image or File column is never skipped for
    carrying AttributeOf in the metadata, and one the metadata leaves out is found from the keys of one equipment row.
  * Where a column is missing the app says which one to create, offers "Check again" once it is made, and lets any other
    suitable column be picked instead (kept on this device): equipment pictures, equipment documents, the map spot column and
    the issue picture column.
  * Asset Map, Asset Management (the equipment table) and Bulk Upload are tabs of their own next to Map Submission. From md up
    every tab stays in view: the timeframe, zoom and Debug controls move under the tabs when the row is too narrow.
  * Bulk Upload: each picture goes to equipment, becomes a new issue (category, description from the file name, room and area
    from its equipment, who to notify, a map spot from the equipment or placed on a map, and the time the photo was taken), or
    is added to an issue found by a search. The issue is saved first, then its picture; if only the picture fails, trying again
    sends only the picture. Replacing an issue's picture asks first. "What was saved" shows the payload.
  * File names: "SOP 2" / "sop3" send a document to that SOP column and the number no longer spoils the equipment suggestion.
  * Ctrl+wheel zoom on the asset map keeps the same point under the pointer for a whole gesture (no slow drift).
  * Safety after review: a new issue is created under an id the app picks (an upsert PATCH), so a try whose answer was lost
    and is sent again cannot make a second issue. Check again or a column pick keeps unsaved edits in Details, and a pick still
    works when the browser keeps no storage. After the issue picture column changes, the issues' picture marks are read again
    from it (replace warnings, Remove and the map follow it); a failed Check again keeps a column that works, and a picked
    column is trusted when the lookups fail. Sharing a category no longer clears who to notify on the other issues; spots stay
    inside the map; room, area and code columns are never offered as the map spot column; with no equipment column to take
    them, documents are not added (only pictures, for issues).
- Entry 23: Alex could not find a save button in Bulk Upload.
  * The app's own zoom (header -/+) scaled the one-screen height too: at 110% the app ran past the bottom of the canvas, which
    hid every bottom bar (Bulk Upload's included). The height is now divided by the zoom, so the app fills exactly one screen.
  * The Bulk Upload bar is always on screen (also before files are added) with a "Save to Dataverse (n)" button; when nothing
    is ready it says why (each file shows in amber what it still needs).
- Entry 24: every picture upload converts to JPG automatically (Alex, Oct 9 15:40).
  * One shared block ("PICTURE TO JPG": pictureToJpegDataUrl) opens the picture, flattens it on white and saves it as a JPG, at
    most 1600 px on the long side (an Image column, issue pictures), or at its own size up to 4096 px for a picture going into
    a File column. A JPG that is already in a File column goes as it is (its first bytes are checked, so a HEIC or PNG that was
    only renamed .jpg is converted). Documents are never touched, and neither is a picture this browser cannot open (a TIFF scan
    goes into a File column as it is; an Image column says plainly that it cannot take it).
  * iPhone HEIC photos: Chrome and Edge cannot open them (Safari can), so the first HEIC picked loads a small converter
    (heic2any 0.0.4: cdnjs, then jsdelivr, then unpkg) and converts each photo once. A photo whose name or type was changed
    is recognised by its first bytes. If no address loads, the file says why in plain words and can be tried again.
  * Bulk Upload: HEIC cards show the converted picture and the time the photo was taken (read from its EXIF); every card that is
    that will become a JPG says "Saved as a JPG"; a photo that cannot be converted for good says why and is not counted as
    ready; "What was saved" says "converted from HEIC to JPG". The converter's leftover listener per photo is removed again.
  * The same block is in mss - log input (paperwork), hub - Lead and beta - hub - Employee (before / after / completion photos).
- Entry 25: map roadmap step 1, "one map you can trust" (Alex, Oct 10 00:09).
  * Several maps: the map list reads only each row's id and code (craa5_facility) and a picker shows in the header when there
    are two or more; only the chosen map's picture is downloaded, and the choice is remembered. The main map is the row coded
    MAIN, else the oldest row. New problems are saved with craa5__facility = the map's code (edits never change it) and each
    map shows only its own problems (the main map also shows the old ones with no code). If Dataverse refuses that filter,
    every problem shows on every map and the page says so.
  * Problems are read a page at a time instead of all at once: every open one (500 a page), then the closed ones inside the
    chosen timeframe, 200 at a time, newest closed first, with "Load 200 older" and a Dataverse search of older closed ones.
    Search, counts, Gallery, Data Table and the Bulk "Existing issue" lookup say they cover the loaded ones.
  * Overview layers: Problems and Equipment switches with counts (equipment is only read when switched on) and "Labels on".
    A tap on a touch screen shows a flag's or dot's name first (tap again for details); a dot offers "Open in Asset Map".
  * Header: "Signed in as <name>". An empty map picture says so plainly (no made-up drawing). Debug > Host check lists the
    roles, link parameters, frame, script addresses (CDN), the map picture column, the problem count and the maps; the fake
    "mock" host lines are gone.
- Entry 26 (Current): a column's name can be typed (Alex's rule for every app, Oct 10 08:34).
  * Every column box (pictures, documents, map spot, equipment ids) has "Type a column name": the logical name typed there is
    used at once and kept on this device (in 'Midwest Plant.columnPicks', shared with the other apps); a name the table does not
    have (or not as the right kind of column) is said plainly, and "Back to the app's choice" clears it.
  * The equipment id column of the issues has its own box: the column to create (Multiple lines of text "Equipment GUIDs",
    craa5_equipmentguids), the table's other text columns to pick from, a typed name and Check again. Another column means
    the problems are read again with it.
  * Bulk Upload > "Dataverse columns this tab uses" shows every column's box (folded unless one needs a look).
  * A typed name is not used when it would write over data: an equipment id column the issue already fills (equipment names,
    room, description, craa5__facility ...), or a map spot column that is the equipment's own name, room, area or code. The
    box says why. While the problems are read again with another id column (or that read failed), no ids are written, so an
    edit cannot wipe the ones stored there. The re-read is for the map and timeframe on screen when it starts.
=======================================================================
*/
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var React = window.React; var { useState, useEffect, useRef, useMemo, useCallback } = React;
// --- INLINE SVG ICONS ---
var createIcon = function (paths) { return function (_a) {
    var _b = _a.className, className = _b === void 0 ? "w-6 h-6" : _b, _c = _a.fill, fill = _c === void 0 ? "none" : _c, props = __rest(_a, ["className", "fill"]);
    return (React.createElement("svg", __assign({ className: className }, props, { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: fill, stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), paths));
}; };
var Activity = createIcon(React.createElement("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }));
var MapPin = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
    React.createElement("circle", { cx: "12", cy: "10", r: "3" })));
var MapIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polygon", { points: "1 6 8 2 16 6 23 2 23 18 16 22 8 18 1 22 1 6" }),
    React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "18" }),
    React.createElement("line", { x1: "16", y1: "6", x2: "16", y2: "22" })));
var FlagIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" }),
    React.createElement("line", { x1: "4", y1: "22", x2: "4", y2: "15" })));
var ImageIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    React.createElement("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    React.createElement("polyline", { points: "21 15 16 10 5 21" })));
var TableIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    React.createElement("line", { x1: "3", y1: "9", x2: "21", y2: "9" }),
    React.createElement("line", { x1: "3", y1: "15", x2: "21", y2: "15" }),
    React.createElement("line", { x1: "9", y1: "3", x2: "9", y2: "21" }),
    React.createElement("line", { x1: "15", y1: "3", x2: "15", y2: "21" })));
var Terminal = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polyline", { points: "4 17 10 11 4 5" }),
    React.createElement("line", { x1: "12", y1: "19", x2: "20", y2: "19" })));
var X = createIcon(React.createElement(React.Fragment, null,
    React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })));
var CheckCircle = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement("polyline", { points: "22 4 12 14.01 9 11.01" })));
var Camera = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }),
    React.createElement("circle", { cx: "12", cy: "13", r: "3" })));
var Search = createIcon(React.createElement(React.Fragment, null,
    React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
    React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })));
var Maximize2 = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("polyline", { points: "9 21 3 21 3 15" }),
    React.createElement("line", { x1: "21", y1: "3", x2: "14", y2: "10" }),
    React.createElement("line", { x1: "3", y1: "21", x2: "10", y2: "14" })));
var ZoomIn = createIcon(React.createElement(React.Fragment, null,
    React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
    React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
    React.createElement("line", { x1: "11", y1: "8", x2: "11", y2: "14" }),
    React.createElement("line", { x1: "8", y1: "11", x2: "14", y2: "11" })));
var ZoomOut = createIcon(React.createElement(React.Fragment, null,
    React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
    React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
    React.createElement("line", { x1: "8", y1: "11", x2: "14", y2: "11" })));
var PencilIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" })));
var FilterIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })));
var CopyIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
    React.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })));
var BoxIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
    React.createElement("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
    React.createElement("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })));
var UploadIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    React.createElement("polyline", { points: "17 8 12 3 7 8" }),
    React.createElement("line", { x1: "12", y1: "3", x2: "12", y2: "15" })));
var WrenchIcon = createIcon(React.createElement("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }));
var Download = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    React.createElement("polyline", { points: "7 10 12 15 17 10" }),
    React.createElement("line", { x1: "12", y1: "15", x2: "12", y2: "3" })));
// --- SHARED FACILITY MAP SVG (Fallback if Fetch completely fails) ---
var FacilityMapSvg = function () { return (React.createElement("svg", { className: "w-full h-full text-slate-400", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("rect", { width: "100", height: "100", fill: "#e2e8f0" }),
    React.createElement("path", { d: "M 10,10 L 90,10 L 90,40 L 60,40 L 60,90 L 10,90 Z", fill: "#cbd5e1", stroke: "#94a3b8", strokeWidth: "0.5" }),
    React.createElement("text", { x: "35", y: "50", fontSize: "5", fill: "#94a3b8" }, "No Map Loaded"))); };
// --- COMPANY THEME (same palette as the Production Manager, Ganttly and the Sanitation Scheduler) ---
var APP_TITLE = 'Midwest Plant Facility Submission';
// Official company logo (embedded data URI so it always renders offline and inside Power Apps frames).
var LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMjAgNjAiPjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDA0NjhCIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTYiIGZpbGw9IiNGRkI4MUMiLz48cGF0aCBkPSJNMjQgMzQgTDMwIDIwIEwzNiAzNCBaIiBmaWxsPSIjMDA0NjhCIi8+PHRleHQgeD0iNTYiIHk9IjI3IiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFQRVggRk9PRFM8L3RleHQ+PHRleHQgeD0iNTYiIHk9IjQ0IiBmaWxsPSIjOTNDNUZEIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiPk1JRFdFU1QgUExBTlQgREVNTzwvdGV4dD48L3N2Zz4=";
var BRAND = {
    blue: '#0072CE', blueDark: '#00468B', blueSoft: '#E6F1FB',
    yellow: '#FFB81C', yellowSoft: '#FFF6E0',
    red: '#E4002B', redSoft: '#FDE8EC'
};
var BRAND_FONT = '"Segoe UI", system-ui, -apple-system, sans-serif';
function BrandLogo(_a) {
    var _b = _a === void 0 ? {} : _a, onClick = _b.onClick, unlocked = _b.unlocked;
    return (React.createElement("button", { type: "button", onClick: onClick, title: onClick ? (unlocked ? "Picture Guide unlocked - click Apex Foods logo to hide" : "Click Apex Foods logo to unlock Picture Guide") : "Apex Foods", "aria-label": "Company logo", style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, letterSpacing: '0.02em', color: '#1F2937', flexShrink: 0, whiteSpace: 'nowrap', cursor: onClick ? 'pointer' : 'default', background: unlocked ? '#FFF6E0' : 'transparent', border: unlocked ? '1.5px solid #FFB81C' : '1.5px solid transparent', borderRadius: 10, padding: '2px 8px' } },
        LOGO_URL ? (React.createElement("img", { src: LOGO_URL, alt: "Apex Foods", className: "h-8 sm:h-10 w-auto max-w-[96px] sm:max-w-none block shrink-0 rounded-md shadow-xs" })) : (React.createElement("svg", { viewBox: "0 0 40 40", width: "36", height: "36", "aria-hidden": "true" },
            React.createElement("circle", { cx: "15", cy: "12", r: "9", fill: BRAND.blue }),
            React.createElement("circle", { cx: "27", cy: "20", r: "8", fill: BRAND.yellow }),
            React.createElement("circle", { cx: "15", cy: "29", r: "8", fill: BRAND.red }))),
        React.createElement("span", { className: "hidden sm:inline font-black tracking-wider text-sm", style: { color: BRAND.blueDark } }, "Apex Foods"),
        unlocked && React.createElement("span", { style: { width: 7, height: 7, borderRadius: 999, background: BRAND.yellow, display: 'inline-block' } })));
}
// --- MEXICAN SPANISH (ES-MX) TRANSLATION DICTIONARY & DOM WALKER ---
var ES_MX_EXACT_DICT = {
    "Midwest Plant Facility Submission": "Envio de Observaciones de Planta Midwest Plant",
    "Overview": "Resumen",
    "Map Submission": "Envio en Mapa",
    "Asset Map": "Mapa de Equipos",
    "Asset Management": "Gestion de Equipos",
    "Picture Guide": "Guia de Fotos",
    "Open": "Abierto",
    "Closed": "Cerrado",
    "Both": "Ambos",
    "All": "Todos",
    "Search": "Buscar",
    "Save": "Guardar",
    "Cancel": "Cancelar",
    "Close": "Cerrar",
    "Edit": "Editar",
    "Delete": "Eliminar",
    "Refresh": "Actualizar",
    "Submit": "Enviar",
    "Area": "Area",
    "Room": "Cuarto",
    "Equipment": "Equipo",
    "Description": "Descripcion",
    "Category": "Categoria",
    "Who to Notify": "A Quien Notificar",
    "Picture Upload": "Subir Fotografia",
    "Light": "Claro",
    "Dark": "Oscuro",
    "Safety": "Seguridad",
    "Sanitation": "Sanitizacion",
    "Maintenance": "Mantenimiento",
    "Quality": "Calidad",
    "Other": "Otro",
    // Screen texts added 2026-10-21 (plain ASCII, no accents)
    "No Map Loaded": "No hay mapa cargado",
    "Company logo": "Logotipo de la empresa",
    ", picked on this device.": ", elegido en este dispositivo.",
    "not found.": "no encontrado.",
    "Create": "Crear",
    ") in Dataverse, then press Check again.": ") en Dataverse, luego presione Revisar de nuevo.",
    "The name kept on this device,": "El nombre guardado en este dispositivo,",
    "is not used:": "no se usa:",
    "column of this table": "columna de esta tabla",
    "is used": "se usa",
    ", or go back to the app's choice.": ", o regrese a la opcion de la app.",
    "(typed)": "(escrito)",
    "Type a column name": "Escribir un nombre de columna",
    "Back to the app's choice": "Volver a la opcion de la app",
    ") and press Use it. It is kept on this device.": ") y presione Usarlo. Se guarda en este dispositivo.",
    "Use it": "Usarlo",
    "A logical name has only letters, digits and _ and starts with a letter (like craa5_picture).": "Un nombre logico solo tiene letras, numeros y _ y empieza con una letra (como craa5_picture).",
    "Could not check again:": "No se pudo revisar de nuevo:",
    "Signed in as": "Conectado como",
    "open -": "abiertos -",
    "Active Microsoft / Dataverse Identity - Click to inspect or update": "Identidad activa de Microsoft / Dataverse - Clic para ver o actualizar",
    "Which facility map to show. Each map has its own problems and equipment.": "Que mapa de planta mostrar. Cada mapa tiene sus propios problemas y equipos.",
    "Map": "Mapa",
    "Theme mode toggle": "Cambiar tema",
    "Language translator toggle": "Cambiar idioma",
    "Views": "Vistas",
    "Timeframe": "Periodo",
    "All Time": "Todo el tiempo",
    "Last 24h": "Ultimas 24 h",
    "Last 7 Days": "Ultimos 7 dias",
    "Last 30 Days": "Ultimos 30 dias",
    "Zoom Out App": "Alejar la app",
    "Zoom In App": "Acercar la app",
    "Prev Screen": "Pantalla anterior",
    "Next Screen": "Pantalla siguiente",
    "Numbered Controls on This Screen": "Controles numerados en esta pantalla",
    "Function / Button": "Funcion / Boton",
    "Location": "Ubicacion",
    "What It Does & How To Use It": "Que hace y como usarlo",
    "Live Dataverse Monitor": "Monitor de Dataverse en vivo",
    "Init Load:": "Carga inicial:",
    "Problems loaded:": "Problemas cargados:",
    "Information Log": "Registro de informacion",
    "events": "eventos",
    "No info events logged.": "No hay eventos de informacion.",
    "API Error & Warning Log": "Registro de errores y avisos de API",
    "Copy Error Payload JSON": "Copiar JSON del error",
    "No debug events logged.": "No hay eventos de depuracion.",
    "Dataverse Outbound REST Console": "Consola REST de salida a Dataverse",
    "requests": "solicitudes",
    "Copy exact JSON payload": "Copiar el JSON exacto",
    "Copy Payload": "Copiar datos",
    "No outbound data submissions yet.": "Todavia no se han enviado datos.",
    "Submit or edit a form to view exact REST payloads here.": "Envie o edite un formulario para ver aqui los datos REST exactos.",
    "Host check: what this page can do where it runs": "Revision del host: lo que esta pagina puede hacer donde corre",
    "Run again": "Correr de nuevo",
    "Zoom Out": "Alejar",
    "Zoom In": "Acercar",
    "Hide closed": "Ocultar cerrados",
    "hidden)": "ocultos)",
    "Filter by status": "Filtrar por estado",
    "Filter by category": "Filtrar por categoria",
    "Loading problems from Dataverse...": "Cargando problemas de Dataverse...",
    "Problems could not be loaded:": "No se pudieron cargar los problemas:",
    "Try again": "Intentar de nuevo",
    "Problems are not split by map (": "Los problemas no se separan por mapa (",
    "): every problem shows on every map.": "): cada problema aparece en todos los mapas.",
    "Only the first": "Solo los primeros",
    "open problems are loaded.": "problemas abiertos estan cargados.",
    "Closed problems: the": "Problemas cerrados: los",
    "most recently closed": "cerrados mas recientes",
    "are loaded.": "estan cargados.",
    "Older closed problems could not be loaded:": "No se pudieron cargar los problemas cerrados mas antiguos:",
    "Also search older closed problems in Dataverse for \"": "Buscar tambien problemas cerrados mas antiguos en Dataverse para \"",
    "Observation details": "Detalles de la observacion",
    "Enlarged": "Ampliada",
    "No Image Provided": "Sin imagen",
    "Edit Observation": "Editar observacion",
    "Observation Details": "Detalles de la observacion",
    "Submitted By": "Enviado por",
    "Date": "Fecha",
    "Closed (last change)": "Cerrado (ultimo cambio)",
    "Facility Map Overview": "Resumen del mapa de planta",
    "Search the map: room, area, equipment, text...": "Buscar en el mapa: cuarto, area, equipo, texto...",
    "Map layers": "Capas del mapa",
    "Show": "Mostrar",
    "Problems: a flag in the category's colour; closed ones are grey with a check": "Problemas: una bandera del color de la categoria; los cerrados son grises con una palomita",
    "Problems": "Problemas",
    "Equipment placed on this map: a blue dot (loads when switched on)": "Equipos ubicados en este mapa: un punto azul (se carga al activarlo)",
    "match": "coincide",
    "Clear search": "Borrar busqueda",
    "Main Facility Map": "Mapa principal de la planta",
    "Loading the map picture...": "Cargando la imagen del mapa...",
    "Open in Asset Map": "Abrir en Mapa de Equipos",
    "Tap again for details": "Toque otra vez para ver detalles",
    "Show closed items": "Mostrar cerrados",
    "No reports match the search and filters.": "Ningun reporte coincide con la busqueda y los filtros.",
    "Clear search and filters": "Borrar busqueda y filtros",
    "No reports submitted yet.": "Todavia no hay reportes.",
    "Recent Issues": "Problemas recientes",
    "Equipment:": "Equipo:",
    "No issues match the current filter.": "Ningun problema coincide con el filtro.",
    "Click to select/move box. Drag corner to resize. Dbl-click outside to cancel. Dbl-click inside to open form.": "Clic para seleccionar o mover el cuadro. Arrastre la esquina para cambiar el tamano. Doble clic afuera para cancelar. Doble clic adentro para abrir el formulario.",
    "Pictures cannot be saved yet:": "Todavia no se pueden guardar fotos:",
    "Preview": "Vista previa",
    "Replace picture": "Reemplazar foto",
    "Remove": "Quitar",
    "Take or upload a picture": "Tomar o subir una foto",
    "Any picture (PNG, WebP, an iPhone HEIC photo ...) is converted to a JPG and resized to 1600 px before saving": "Cualquier foto (PNG, WebP, foto HEIC de iPhone ...) se convierte a JPG y se reduce a 1600 px antes de guardar",
    "Converting the picture to a JPG...": "Convirtiendo la foto a JPG...",
    "Not a room of the equipment table. It is saved as typed, but the other apps will not match it.": "No es un cuarto de la tabla de equipos. Se guarda como esta escrito, pero las otras apps no lo van a reconocer.",
    "Not a known area. It is saved as typed, but the other apps will not match it.": "No es un area conocida. Se guarda como esta escrita, pero las otras apps no la van a reconocer.",
    "e.g. Maintenance, Safety Officer": "p. ej. Mantenimiento, Oficial de Seguridad",
    "Issue Category": "Categoria del problema",
    "Custom Text": "Texto personalizado",
    "Enter custom category note...": "Escriba la nota personalizada...",
    "Attach the equipment this request is about. Search, or list the room's equipment and tick it.": "Agregue el equipo de esta solicitud. Busque, o liste el equipo del cuarto y marquelo.",
    "Attached equipment": "Equipo agregado",
    "(text)": "(texto)",
    "Search equipment by name, room or area...": "Buscar equipo por nombre, cuarto o area...",
    "Attach what you typed as text, without a link to the equipment table": "Agregar lo escrito como texto, sin enlace a la tabla de equipos",
    "Add as text": "Agregar como texto",
    "Done": "Listo",
    "Looking up equipment...": "Buscando equipo...",
    "The equipment table did not answer:": "La tabla de equipos no respondio:",
    "Retry": "Reintentar",
    "Showing the first": "Mostrando los primeros",
    "Equipment is saved by name:": "El equipo se guarda por nombre:",
    "Observation Gallery": "Galeria de observaciones",
    "Group By:": "Agrupar por:",
    "Location (Room/Area/Equip)": "Ubicacion (cuarto/area/equipo)",
    "Area Only": "Solo area",
    "Submitter": "Quien envio",
    "items": "elementos",
    "Observation": "Observacion",
    "By:": "Por:",
    "Double-click to expand": "Doble clic para ampliar",
    "No observations match the search and filters.": "Ninguna observacion coincide con la busqueda y los filtros.",
    "Where this was reported": "Donde se reporto",
    "View photo": "Ver foto",
    "Double-click to jump to this location on the map": "Doble clic para ir a este lugar en el mapa",
    "Show only this category": "Mostrar solo esta categoria",
    "Notify:": "Notificar:",
    "By": "Por",
    "Locate on map": "Ubicar en el mapa",
    "Details": "Detalles",
    "Action Item Rail": "Lista de acciones",
    "Newest first. Scroll to roll through every item; double-click a card (or press Locate) to jump to it on the map.": "Lo mas nuevo primero. Desplacese para ver cada elemento; doble clic en una tarjeta (o presione Ubicar) para ir a ella en el mapa.",
    "Showing": "Mostrando",
    "of": "de",
    "loaded items in this timeframe": "elementos cargados en este periodo",
    "Rolling in more items...": "Cargando mas elementos...",
    "End of the rail -": "Fin de la lista -",
    "item": "elemento",
    "Click a room, or drag a box around something, to put an asset there. Click a pin to open its asset.": "Haga clic en un cuarto, o arrastre un cuadro alrededor de algo, para poner un equipo ahi. Clic en un pin para abrir su equipo.",
    "Search assets: name, room, area...": "Buscar equipos: nombre, cuarto, area...",
    "What dragging on the map does": "Que hace arrastrar en el mapa",
    "Turn the map a quarter turn to the left": "Girar el mapa un cuarto a la izquierda",
    "Turn the map left": "Girar el mapa a la izquierda",
    "Turn the map a quarter turn to the right": "Girar el mapa un cuarto a la derecha",
    "Turn the map right": "Girar el mapa a la derecha",
    "Show the whole map": "Mostrar todo el mapa",
    "Fit": "Ajustar",
    "Facility map with assets": "Mapa de planta con equipos",
    "Zoom out": "Alejar",
    "Zoom in": "Acercar",
    "Click the map where": "Haga clic en el mapa donde",
    "is, or drag a box around it.": "esta, o arrastre un cuadro alrededor.",
    "Assets panel": "Panel de equipos",
    "This asset has unsaved changes.": "Este equipo tiene cambios sin guardar.",
    "Discard changes": "Descartar cambios",
    "Keep editing": "Seguir editando",
    "Map spot:": "Lugar en el mapa:",
    "Click the map where this asset is, or drag a box around it...": "Haga clic en el mapa donde esta este equipo, o arrastre un cuadro alrededor...",
    "Remove from map": "Quitar del mapa",
    "Remove the pin?": "Quitar el pin?",
    "Keep": "Conservar",
    "The Assets table's columns could not be read:": "No se pudieron leer las columnas de la tabla de equipos:",
    "Loading the asset...": "Cargando el equipo...",
    "This asset could not be loaded:": "No se pudo cargar este equipo:",
    "The picture could not be shown.": "No se pudo mostrar la foto.",
    "Cleaning frequency": "Frecuencia de limpieza",
    "Nothing else is filled in for this asset yet.": "Este equipo todavia no tiene nada mas lleno.",
    "Edit every column, pictures and files in the table.": "Edite cada columna, fotos y archivos en la tabla.",
    "Edit in table": "Editar en la tabla",
    "The equipment table: change any cell, then Save the row. Pictures and files upload straight from their cells.": "La tabla de equipos: cambie cualquier celda y luego Guarde la fila. Las fotos y archivos se suben desde sus celdas.",
    "Search name, room, area...": "Buscar nombre, cuarto, area...",
    "Filter the table by map spot": "Filtrar la tabla por lugar en el mapa",
    "Filter the table by room": "Filtrar la tabla por cuarto",
    "Every room": "Todos los cuartos",
    "Columns (": "Columnas (",
    "+ New asset": "+ Nuevo equipo",
    "Save all (": "Guardar todo (",
    "Discard all": "Descartar todo",
    "Drop every unsaved change?": "Descartar todos los cambios sin guardar?",
    "Discard": "Descartar",
    "The Assets table's columns could not be read": "No se pudieron leer las columnas de la tabla de equipos",
    "The assets could not be loaded:": "No se pudieron cargar los equipos:",
    "Kept at the top: new, changed or opened from the map": "Arriba: nuevos, cambiados o abiertos desde el mapa",
    "Loading...": "Cargando...",
    "Show more": "Mostrar mas",
    "Reading the Assets table...": "Leyendo la tabla de equipos...",
    "Columns to show": "Columnas a mostrar",
    "Columns": "Columnas",
    "Default": "Predeterminado",
    "Close the column list": "Cerrar la lista de columnas",
    "Saving...": "Guardando...",
    "Open in Details.": "Abrir en Detalles.",
    "Reload row": "Recargar fila",
    "Save mine anyway": "Guardar lo mio de todos modos",
    "change": "cambio",
    "Undo": "Deshacer",
    "Details: every column of this asset": "Detalles: todas las columnas de este equipo",
    "Filter by map spot": "Filtrar por lugar en el mapa",
    "On map": "En el mapa",
    "Other map": "Otro mapa",
    "This spot": "Este lugar",
    "Cancel this spot": "Cancelar este lugar",
    "Assets cannot be placed yet:": "Todavia no se pueden ubicar equipos:",
    "Which asset is here?": "Que equipo esta aqui?",
    "Not on the map yet (latest changed)": "Aun no esta en el mapa (cambiados recientemente)",
    "Click the map where this asset is...": "Haga clic en el mapa donde esta este equipo...",
    "No spot": "Sin lugar",
    "Not on the map. Once it is created, \"Open on map\" takes you there to place it.": "No esta en el mapa. Una vez creado, \"Abrir en el mapa\" lo lleva ahi para ubicarlo.",
    "Record info": "Datos del registro",
    "Pictures and files can be added once the asset is created.": "Las fotos y archivos se pueden agregar una vez creado el equipo.",
    "Reload": "Recargar",
    "Close the asset": "Cerrar el equipo",
    "Clear": "Borrar",
    "Search...": "Buscar...",
    "Could not search:": "No se pudo buscar:",
    "Nothing found.": "No se encontro nada.",
    "Not done:": "No se hizo:",
    "Bulk upload": "Carga masiva",
    "Add pictures and documents. Send each one to a piece of equipment, make a picture a new issue, or add it to an issue, then press Save to Dataverse at the bottom to save them all at once.": "Agregue fotos y documentos. Mande cada uno a un equipo, haga de una foto un problema nuevo, o agreguela a un problema, luego presione Guardar en Dataverse abajo para guardarlos todos a la vez.",
    "Reading the equipment table's columns...": "Leyendo las columnas de la tabla de equipos...",
    "Dataverse columns this tab uses": "Columnas de Dataverse que usa esta pestana",
    "Equipment table (": "Tabla de equipos (",
    "Not found:": "No encontrado:",
    "(File)": "(Archivo)",
    "Issues (": "Problemas (",
    "A new issue is saved with": "Un problema nuevo se guarda con",
    "; its picture goes in its own request.": "; su foto va en su propia solicitud.",
    "Equipment is saved by name only:": "El equipo se guarda solo por nombre:",
    "Every picture (PNG, WebP, iPhone HEIC ...) is converted to a JPG automatically.": "Cada foto (PNG, WebP, HEIC de iPhone ...) se convierte a JPG automaticamente.",
    "Choose pictures and documents to upload": "Elegir fotos y documentos para subir",
    "Choose files": "Elegir archivos",
    "file": "archivo",
    "Use all suggestions (": "Usar todas las sugerencias (",
    "Make every picture a new issue (": "Hacer de cada foto un problema nuevo (",
    "Send every picture to equipment (": "Mandar cada foto a equipo (",
    "Column for every document": "Columna para cada documento",
    "Choose...": "Elegir...",
    "Take every file off this list? Nothing is deleted from Dataverse.": "Quitar todos los archivos de esta lista? No se borra nada de Dataverse.",
    "Clear list": "Borrar lista",
    "Files to upload": "Archivos para subir",
    "No files yet. Add pictures or documents above, then save them to Dataverse here.": "Aun no hay archivos. Agregue fotos o documentos arriba y luego guardelos en Dataverse aqui.",
    "ready,": "listos,",
    "need something,": "necesitan algo,",
    "uploaded": "subidos",
    "replace": "reemplazan",
    "a stored file": "un archivo guardado",
    "Nothing can be saved yet: each file says in amber what it still needs (for example its equipment or its map spot).": "Aun no se puede guardar nada: cada archivo dice en ambar lo que le falta (por ejemplo su equipo o su lugar en el mapa).",
    "Upload anyway?": "Subir de todos modos?",
    "Upload anyway": "Subir de todos modos",
    "Not yet": "Todavia no",
    "Save to Dataverse (": "Guardar en Dataverse (",
    "Clear uploaded (": "Borrar subidos (",
    "Drop to add": "Suelte para agregar",
    "Uploaded to": "Subido a",
    "Sent:": "Enviado:",
    "Open in Asset Management": "Abrir en Gestion de Equipos",
    "What was saved": "Que se guardo",
    "Show on the map": "Mostrar en el mapa",
    "Uploading": "Subiendo",
    "Not uploaded:": "No subido:",
    "Ready. It replaces": "Listo. Reemplaza",
    "Change": "Cambiar",
    "Equipment (optional)": "Equipo (opcional)",
    "Find equipment": "Buscar equipo",
    "Looking for \"": "Buscando \"",
    "From the name:": "Por el nombre:",
    "would replace": "reemplazaria",
    "Use": "Usar",
    "The name lookup failed (": "La busqueda por nombre fallo (",
    "); use Find equipment.": "); use Buscar equipo.",
    "Show the picture large": "Ver la foto grande",
    "Take this file off the list": "Quitar este archivo de la lista",
    "Taken": "Tomada",
    "(preview not ready:": "(vista previa no lista:",
    "Goes to": "Va a",
    "Goes in": "Va en",
    "Choose a column...": "Elegir una columna...",
    "This issue is saved in Dataverse; only its picture is left to send.": "Este problema ya esta en Dataverse; solo falta mandar su foto.",
    "Issue category": "Categoria del problema",
    "Note text": "Texto de la nota",
    "Who to notify": "A quien notificar",
    "e.g. Maintenance": "p. ej. Mantenimiento",
    "Map spot": "Lugar en el mapa",
    "\" to the description": "\" a la descripcion",
    "Use this category": "Usar esta categoria",
    "for every new issue in the list": "para cada problema nuevo de la lista",
    "Issue": "Problema",
    "Find the issue": "Buscar el problema",
    "Equipment name, room or area...": "Nombre del equipo, cuarto o area...",
    "Type at least 2 letters.": "Escriba al menos 2 letras.",
    "Searching...": "Buscando...",
    "The search failed:": "La busqueda fallo:",
    "No equipment matches \"": "Ningun equipo coincide con \"",
    "Matching equipment": "Equipos que coinciden",
    "Has": "Tiene",
    "already": "ya",
    "are shown; type more to narrow it down.": "se muestran; escriba mas para reducir la lista.",
    "Room, area, equipment, words of the issue...": "Cuarto, area, equipo, palabras del problema...",
    "The newest open issues; type to search": "Los problemas abiertos mas nuevos; escriba para buscar",
    "No loaded issue matches \"": "Ningun problema cargado coincide con \"",
    "The issues are still loading from Dataverse...": "Los problemas todavia se estan cargando de Dataverse...",
    "Also search older closed issues in Dataverse": "Buscar tambien problemas cerrados mas antiguos en Dataverse",
    "Matching issues": "Problemas que coinciden",
    "Has a picture already": "Ya tiene foto",
    "Where is it?": "Donde esta?",
    "was taken.": "fue tomada.",
    "Close without placing": "Cerrar sin ubicar",
    "Facility map": "Mapa de planta",
    "Size": "Tamano",
    "Size of the box": "Tamano del cuadro",
    "Use this spot": "Usar este lugar",
    "New Observation": "Nueva observacion",
    "Selected Area": "Area seleccionada",
    "Submit Observation": "Enviar observacion",
    "Note (Custom)": "Nota (personalizada)",
    "To Be Cleaned": "Por limpiar",
    "To Be Fixed": "Por reparar",
    "Safety Concern": "Riesgo de seguridad",
    "FSQ Concern": "Riesgo de FSQ",
    "Note": "Nota",
    "Area is required": "El area es obligatoria",
    "Description is required": "La descripcion es obligatoria",
    "Custom text is required for Notes": "El texto es obligatorio para las notas",
    "Check again": "Revisar de nuevo",
    "Debug": "Depuracion",
    "Gallery": "Galeria",
    "Data Table": "Tabla de datos",
    "Bulk Upload": "Carga masiva",
    "Labels on": "Etiquetas",
    "Open items across the facility. Closed items are hidden on the map.": "Pendientes abiertos en toda la planta. Los cerrados se ocultan en el mapa.",
    "Host check": "Revision del host",
};
var ES_MX_PHRASE_DICT = [
    ["Midwest Plant Facility Submission", "Envio de Observaciones de Planta Midwest Plant"],
    ["Signed in as ", "Conectado como "],
    ["Map Submission", "Envio en Mapa"],
    ["Asset Management", "Gestion de Equipos"],
    ["Asset Map", "Mapa de Equipos"],
    ["Picture Upload", "Subir Fotografia"],
    ["Who to Notify", "A Quien Notificar"]
];
// English text to Spanish: the whole text from ES_MX_EXACT_DICT, else the phrases of ES_MX_PHRASE_DICT inside it
function toSpanish(text) {
    var trimmed = text.trim();
    if (ES_MX_EXACT_DICT[trimmed])
        return text.replace(trimmed, ES_MX_EXACT_DICT[trimmed]);
    var updated = text;
    for (var p = 0; p < ES_MX_PHRASE_DICT.length; p++) {
        var enPhrase = ES_MX_PHRASE_DICT[p][0];
        if (updated.indexOf(enPhrase) >= 0)
            updated = updated.split(enPhrase).join(ES_MX_PHRASE_DICT[p][1]);
    }
    return updated;
}
var TRANSLATED_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'];
// Each node remembers its English (__origEnText) and what was written in its place (__mstLast). When React writes new text
// into a node (a count, a name), that text is the new English: it is translated, never replaced by the old one.
function applyDomTranslation(rootEl, lang) {
    if (!rootEl || typeof document === "undefined")
        return;
    var walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n = walker.nextNode();
    while (n) {
        nodes.push(n);
        n = walker.nextNode();
    }
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var parent = node.parentElement;
        if (!parent)
            continue;
        var tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || parent.closest("[data-no-translate='true']"))
            continue;
        var raw = node.nodeValue || "";
        if (lang === "es") {
            if (node.__origEnText === undefined || raw !== node.__mstLast)
                node.__origEnText = raw; // new or changed by React
            if (!raw.trim())
                continue;
            var updated = toSpanish(node.__origEnText);
            node.__mstLast = updated;
            if (updated !== raw)
                node.nodeValue = updated;
        }
        else if (node.__origEnText !== undefined) {
            if (raw === node.__mstLast)
                node.nodeValue = node.__origEnText; // React's own newer text stays as it is
            delete node.__origEnText;
            delete node.__mstLast;
        }
    }
    var els = rootEl.querySelectorAll('[placeholder],[title],[aria-label],[alt]');
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.closest("[data-no-translate='true']"))
            continue;
        for (var k = 0; k < TRANSLATED_ATTRIBUTES.length; k++) {
            var name = TRANSLATED_ATTRIBUTES[k];
            var store = '__mstAttr_' + name;
            var raw = el.getAttribute(name);
            if (raw === null)
                continue;
            if (lang === "es") {
                if (!el[store] || raw !== el[store].last)
                    el[store] = { en: raw, last: raw };
                var updated = toSpanish(el[store].en);
                el[store].last = updated;
                if (updated !== raw)
                    el.setAttribute(name, updated);
            }
            else if (el[store]) {
                if (raw === el[store].last)
                    el.setAttribute(name, el[store].en);
                el[store] = undefined;
            }
        }
    }
}
function readMidwestPlantMsUser() {
    try {
        var xrm = (typeof window !== 'undefined' && window.Xrm && window.Xrm.Utility)
            ? window.Xrm
            : ((typeof window !== 'undefined' && window.parent && window.Xrm && window.Xrm.Utility)
                ? window.Xrm
                : (typeof window !== 'undefined' && window.top && window.Xrm && window.Xrm.Utility ? window.Xrm : null));
        var us = xrm && typeof xrm.Utility.getGlobalContext === 'function' && xrm.Utility.getGlobalContext().userSettings;
        if (us && (us.userName || us.userId)) {
            var cleanId = String(us.userId || '').replace(/[{}]/g, '');
            var msMatch = String(us.userName || '').match(/u\d{6,8}/i);
            var msId = msMatch ? msMatch[0].toUpperCase() : (cleanId ? cleanId.slice(0, 8).toUpperCase() : '');
            return {
                userName: String(us.userName || '').trim(),
                microsoftId: msId,
                source: 'Dataverse Xrm.Utility.getGlobalContext().userSettings'
            };
        }
    }
    catch (_e) { /* fallback */ }
    try {
        var raw = window.localStorage.getItem('__1_' + 'MidwestPlant_active_ms_user_v1');
        if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && (parsed.userName || parsed.microsoftId)) {
                return {
                    userName: String(parsed.userName || '').trim(),
                    microsoftId: String(parsed.microsoftId || '').trim(),
                    source: parsed.source || 'Midwest Plant Active MS User Session'
                };
            }
        }
    }
    catch (_e) { /* fallback */ }
    return {
        // Nobody is assumed: until the host or Dataverse says who is signed in, the name stays empty.
        userName: '',
        microsoftId: '',
        source: 'Not known yet'
    };
}
// --- DATAVERSE SCHEMA DEFINITIONS (Live https://demo-org.crm.dynamics.com schema) ---
var DATAVERSE_MAPS_SCHEMA = { TableName: 'craa5___1_g_mapses' };
var DATAVERSE_SCHEMA = {
    TableName: 'craa5__facilityobservations',
    LogicalName: 'craa5__facilityobservation',
    IdColumn: 'craa5__facilityobservationid',
    PrimaryNameColumn: 'craa5__area',
    AreaColumn: 'craa5__area',
    RoomColumn: 'craa5__room',
    DescriptionColumn: 'craa5__description',
    WhoToNotifyColumn: 'craa5__whotonotify',
    WhoToNotifyEmailColumn: 'craa5__whotonotifyemail',
    EquipmentColumn: 'craa5__equipment',
    FacilityColumn: 'craa5__facility',
    CustomNoteColumn: 'craa5__customnote',
    BoxWidthColumn: 'craa5__boxwidth',
    BoxHeightColumn: 'craa5__boxheight',
    MapXColumn: 'craa5_mapx',
    MapYColumn: 'craa5_mapy',
    PictureColumn: 'craa5_pictureof'
};
// --- EQUIPMENT (craa5___1_a_assets) ---
// Text column on craa5__facilityobservation that keeps the ids of the attached equipment. Leave it null and the app looks for a text
// column whose name reads like "equipment ... guid / id"; pin it (e.g. 'craa5_equipmentguids') if the table has another name for it.
var EQUIPMENT_ID_COLUMN = null;
var EQUIPMENT_ID_HINT = /equip.*(guid|id)/i;
var ASSET_SET = 'craa5___1_a_assetses';
var ASSET_SELECT = 'craa5___1_a_assetsid,craa5_equipmentidentifier,craa5_roomname,craa5_areaname';
var ASSET_SEARCH_LIMIT = 25; // rows per equipment search
var ASSET_PLACE_LIMIT = 100; // rows when listing one room's equipment
var EQUIPMENT_SEPARATOR = '; ';
var MAX_EQUIPMENT = 20;
// --- STATUS (built-in on every Dataverse table: statecode 0 = Active, 1 = Inactive) ---
// "Closed" is the Inactive state, so marking an observation closed needs no new column.
var STATUS_FILTERS = [
    { key: 'open', label: 'Open' },
    { key: 'closed', label: 'Closed' },
    { key: 'all', label: 'Both' }
];
var CLOSED_COLOR = '#64748b';
var CLOSED_CHECK_COLOR = '#15803d';
// --- PICTURES ---
// Logical name of the Image (or File) column that holds an observation's picture on craa5__facilityobservation.
// Leave it null and the app finds the table's picture column itself; pin it (e.g. 'craa5_picture') if the table has more than one.
var PICTURE_COLUMN = null;
var OBSERVATION_LOGICAL_NAME = 'craa5__facilityobservation';
var ODATA_HEADERS = { 'Accept': 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' };
var PICTURE_NAME_HINT = /pic|photo|image|upload|attach/i;
var apiUrl = function (path) {
    var baseUrl = '';
    try {
        if (typeof window !== 'undefined' && window.Xrm && window.Xrm.Utility)
            baseUrl = window.Xrm.Utility.getGlobalContext().getClientUrl();
    }
    catch (e) { /* same-origin relative URL */ }
    return "".concat(baseUrl, "/api/data/v9.2/").concat(path);
};
var readApiError = function (res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, e_1, parsed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, res.text()];
            case 2:
                text = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                return [3 /*break*/, 4];
            case 4:
                try {
                    parsed = JSON.parse(text);
                    if (parsed && parsed.error && parsed.error.message)
                        return [2 /*return*/, "".concat(parsed.error.message, " (HTTP ").concat(res.status, ")")];
                }
                catch (e) { /* not JSON */ }
                return [2 /*return*/, text ? "".concat(text.slice(0, 300), " (HTTP ").concat(res.status, ")") : "HTTP ".concat(res.status)];
        }
    });
}); };
// Finds the column pictures are stored in: { ready, name, type: 'image' | 'file' | null, reason }
function detectPictureColumn(logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var listColumns, failures, lookup, _a, images, files, choices, picked, type, type, preferredOrder, candidates, rank;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    listColumns = function (cast) { return __awaiter(_this, void 0, void 0, function () {
                        var res, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, fetch(apiUrl("EntityDefinitions(LogicalName='".concat(OBSERVATION_LOGICAL_NAME, "')/Attributes/Microsoft.Dynamics.CRM.").concat(cast, "?$select=LogicalName,SchemaName")), { headers: ODATA_HEADERS })];
                                case 1:
                                    res = _b.sent();
                                    if (!!res.ok) return [3 /*break*/, 3];
                                    _a = Error.bind;
                                    return [4 /*yield*/, readApiError(res)];
                                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                                case 3: return [4 /*yield*/, res.json()];
                                case 4: return [2 /*return*/, ((_b.sent()).value || []).map(function (a) { return a.LogicalName; }).filter(Boolean)];
                            }
                        });
                    }); };
                    failures = [];
                    lookup = function (cast) { return listColumns(cast).catch(function (e) { failures.push(e.message); return []; }); };
                    return [4 /*yield*/, Promise.all([lookup('ImageAttributeMetadata'), lookup('FileAttributeMetadata')])];
                case 1:
                    _a = _b.sent(), images = _a[0], files = _a[1];
                    logEvent("Picture column scan: image columns [".concat(images.join(', '), "], file columns [").concat(files.join(', '), "]"), failures.length ? 'warn' : 'debug', failures.length ? { failures: failures } : null);
                    choices = images.map(function (name) { return ({ name: name, label: name, kind: 'image' }); }).concat(files.map(function (name) { return ({ name: name, label: name, kind: 'file' }); }));
                    picked = readColumnPick('obsPicture');
                    // (also when the lookups failed and cannot say: the pick is then trusted the way PICTURE_COLUMN is)
                    if (picked && (images.indexOf(picked) !== -1 || files.indexOf(picked) !== -1 || failures.length > 0)) {
                        logEvent("Pictures go in ".concat(picked, " (picked on this device)."), 'info');
                        type = images.indexOf(picked) !== -1 ? 'image' : (files.indexOf(picked) !== -1 ? 'file' : null);
                        return [2 /*return*/, { ready: true, name: picked, type: type, reason: '', candidates: choices, picked: picked }];
                    }
                    if (PICTURE_COLUMN) {
                        type = images.includes(PICTURE_COLUMN) ? 'image' : (files.includes(PICTURE_COLUMN) ? 'file' : null);
                        // Both lookups worked and neither lists the pinned column: it is a typo or the wrong kind of column
                        if (!type && failures.length === 0) {
                            return [2 /*return*/, { ready: false, name: null, type: null, reason: "PICTURE_COLUMN \"".concat(PICTURE_COLUMN, "\" is not an Image or File column of ").concat(OBSERVATION_LOGICAL_NAME, "."), candidates: choices }];
                        }
                        return [2 /*return*/, { ready: true, name: PICTURE_COLUMN, type: type, reason: '', candidates: choices }];
                    }
                    preferredOrder = ['craa5_pictureof', 'craa5_picture', 'craa5_photo', 'craa5_image', 'craa5_observationpicture'];
                    candidates = __spreadArray(__spreadArray([], images.map(function (name) { return ({ name: name, type: 'image' }); }), true), files.map(function (name) { return ({ name: name, type: 'file' }); }), true);
                    rank = function (c) {
                        var lc = String(c.name || '').toLowerCase();
                        var prefIdx = preferredOrder.indexOf(lc);
                        var nameScore = prefIdx >= 0 ? prefIdx : (lc === 'entityimage' ? 20 : (PICTURE_NAME_HINT.test(lc) ? 10 : 15));
                        return (c.type === 'file' ? 100 : 0) + nameScore;
                    };
                    candidates.sort(function (a, b) { return rank(a) - rank(b); });
                    if (candidates.length > 0) {
                        if (candidates.length > 1)
                            logEvent("Several picture columns found (".concat(candidates.map(function (c) { return c.name; }).join(', '), "). Using ").concat(candidates[0].name, ". Set PICTURE_COLUMN at the top of the file to choose another."), 'warn');
                        return [2 /*return*/, { ready: true, name: candidates[0].name, type: candidates[0].type, reason: '', candidates: choices }];
                    }
                    if (failures.length > 0) {
                        return [2 /*return*/, { ready: false, name: null, type: null, reason: "the app could not look up the table's columns (".concat(failures[0], "). Press Check again, or set PICTURE_COLUMN at the top of the file to the Image column's logical name."), candidates: choices, lookupFailed: true }];
                    }
                    return [2 /*return*/, { ready: false, name: null, type: null, reason: "the ".concat(OBSERVATION_LOGICAL_NAME, " table has no Image or File column. Add an Image column (for example \"Picture\") in Dataverse, then press Check again."), candidates: choices, missing: true }];
            }
        });
    });
}
// Extra $select fields that tell a row has a picture, tried in order. Selecting the image column itself would drag
// a base64 thumbnail into every row, and a wrong guess is a 400, so the list query steps down until one is accepted.
var pictureSelectOptions = function (col, type) {
    var imageStyle = [["".concat(col, "_timestamp")], ["".concat(col, "_url")]];
    var fileStyle = [["".concat(col, "_name")], [col]];
    var order = type === 'image' ? imageStyle : (type === 'file' ? fileStyle : __spreadArray(__spreadArray([], imageStyle, true), fileStyle, true));
    return __spreadArray(__spreadArray([], order, true), [[]], false);
};
// true / false when the query returned a marker for the picture, null when it could not tell
var rowHasPicture = function (row, fields) {
    if (fields.length === 0)
        return null;
    return fields.some(function (f) {
        var v = row[f];
        return v !== null && v !== undefined && v !== '' && v !== 0 && v !== '0';
    });
};
// Stored pictures: full size first (needs "can store full image"), then the 144 px thumbnail Dataverse always keeps
var storedPictureUrls = function (col, id) { return ({
    full: apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")/").concat(col, "/$value?size=full")),
    thumb: apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")/").concat(col, "/$value"))
}); };
// Every URL that might show this item's picture, best first (small thumbnails want the cheap 144 px one first)
var pictureSources = function (item, thumbFirst) {
    if (thumbFirst === void 0) { thumbFirst = false; }
    if (!item)
        return [];
    if (item.image)
        return [item.image];
    if (item.picture)
        return thumbFirst ? [item.picture.thumb, item.picture.full] : [item.picture.full, item.picture.thumb];
    return [];
};
var GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// One request per picture: Dataverse cannot take it inside the create call (only the table's primary image can)
function uploadPicture(column, id, dataUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!GUID_PATTERN.test(id))
                        throw new Error('Dataverse did not return the new record id, so the picture could not be attached.'); if (!/^craa5___1_/i.test(DATAVERSE_SCHEMA.TableName)) return [2 /*return*/];
                    return [4 /*yield*/, fetch(apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")/").concat(column)), {
                            method: 'PATCH',
                            headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/octet-stream', 'x-ms-file-name': "observation-".concat(id, ".jpg") }),
                            body: dataUrlToBytes(dataUrl)
                        })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    err = new (_a.apply(Error, [void 0, _b.sent()]))();
                    err.status = res.status;
                    throw err;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// A fresh record id made here, so a create can be sent again without making a second record
function newGuid() {
    var c = typeof window !== 'undefined' ? (window.crypto || window.msCrypto) : null;
    if (c && typeof c.randomUUID === 'function')
        return c.randomUUID();
    var b = new Uint8Array(16);
    if (c && typeof c.getRandomValues === 'function')
        c.getRandomValues(b);
    else
        for (var i = 0; i < 16; i += 1)
            b[i] = Math.floor(Math.random() * 256);
    b[6] = (b[6] & 15) | 64;
    b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return "".concat(h.slice(0, 8), "-").concat(h.slice(8, 12), "-").concat(h.slice(12, 16), "-").concat(h.slice(16, 20), "-").concat(h.slice(20));
}
// A new observation from a ready payload (the Bulk Upload tab), saved under an id chosen here (an upsert). If the answer is
// lost and the same id is sent again, Dataverse updates the issue the first try made instead of making a second one.
function createObservation(payload, id) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!GUID_PATTERN.test(id))
                        throw new Error('The new issue has no usable id.'); if (!/^craa5___1_/i.test(DATAVERSE_SCHEMA.TableName)) return [2 /*return*/, id];
                    return [4 /*yield*/, fetch(apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")")), {
                            method: 'PATCH',
                            headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/json' }),
                            body: JSON.stringify(payload)
                        })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    err = new (_a.apply(Error, [void 0, _b.sent()]))();
                    err.status = res.status;
                    throw err;
                case 3: return [2 /*return*/, id];
            }
        });
    });
}
function deletePicture(column, id) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: if (!/^craa5___1_/i.test(DATAVERSE_SCHEMA.TableName)) return [2 /*return*/]; return [4 /*yield*/, fetch(apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")/").concat(column)), { method: 'DELETE', headers: ODATA_HEADERS })];
                case 1:
                    res = _b.sent();
                    if (!(!res.ok && res.status !== 404)) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                case 3: return [2 /*return*/];
            }
        });
    });
}
// --- EQUIPMENT HELPERS ---
// The text columns of the observation table with their length limits, and the column (if any) that keeps the equipment ids.
// Result: { idColumn, equipmentMax, idMax, reason, candidates, picked, typed, typedWhy }. A failed lookup leaves the limits unknown and
// the ids unsaved. A column picked or typed on this device ('obsEquipmentIds') wins while the table has it as a text column.
function detectEquipmentColumns(logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var listColumns, failures, lookup, lists, columns, find, equipmentCol, equipmentMax, candidates, typed, typedTaken, typedWhy, idCol, reason, picked, candidates_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listColumns = function (cast) { return __awaiter(_this, void 0, void 0, function () {
                        var res, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, fetch(apiUrl("EntityDefinitions(LogicalName='".concat(OBSERVATION_LOGICAL_NAME, "')/Attributes/Microsoft.Dynamics.CRM.").concat(cast, "?$select=LogicalName,MaxLength")), { headers: ODATA_HEADERS })];
                                case 1:
                                    res = _b.sent();
                                    if (!!res.ok) return [3 /*break*/, 3];
                                    _a = Error.bind;
                                    return [4 /*yield*/, readApiError(res)];
                                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                                case 3: return [4 /*yield*/, res.json()];
                                case 4: return [2 /*return*/, ((_b.sent()).value || []).filter(function (a) { return a && a.LogicalName; })];
                            }
                        });
                    }); };
                    failures = [];
                    lookup = function (cast) { return listColumns(cast).catch(function (e) { failures.push(e.message); return []; }); };
                    return [4 /*yield*/, Promise.all([lookup('StringAttributeMetadata'), lookup('MemoAttributeMetadata')])];
                case 1:
                    lists = _a.sent();
                    columns = lists[0].concat(lists[1]);
                    find = function (name) { return columns.find(function (c) { return c.LogicalName === name; }) || null; };
                    equipmentCol = find('craa5__equipment');
                    equipmentMax = equipmentCol && equipmentCol.MaxLength ? equipmentCol.MaxLength : null;
                    candidates = columns
                        .filter(function (c) { return ISSUE_COLUMNS.indexOf(c.LogicalName) === -1 && c.LogicalName.indexOf('craa5_') === 0; })
                        .map(function (c) { return ({ name: c.LogicalName, label: c.LogicalName, kind: 'text' }); });
                    typed = readColumnPick('obsEquipmentIds');
                    typedTaken = !!typed && (ISSUE_COLUMNS.indexOf(typed) !== -1 || typed === 'craa5__facilityobservationid');
                    typedWhy = typedTaken ? 'the app already saves part of each issue there (its equipment names, room, description or map)' : '';
                    idCol = null;
                    reason = '';
                    picked = '';
                    if (typed && !typedTaken && (find(typed) || failures.length > 0)) {
                        // (also when the lookups failed and cannot say: the pick is then trusted the way EQUIPMENT_ID_COLUMN is)
                        idCol = find(typed) || { LogicalName: typed, MaxLength: null };
                        picked = typed;
                        logEvent("Equipment ids go in ".concat(typed, " (picked on this device)."), 'info');
                    }
                    else if (EQUIPMENT_ID_COLUMN) {
                        idCol = find(EQUIPMENT_ID_COLUMN);
                        if (!idCol && failures.length === 0)
                            reason = "EQUIPMENT_ID_COLUMN \"".concat(EQUIPMENT_ID_COLUMN, "\" is not a text column of ").concat(OBSERVATION_LOGICAL_NAME, ".");
                        else if (!idCol)
                            idCol = { LogicalName: EQUIPMENT_ID_COLUMN, MaxLength: null };
                    }
                    else {
                        candidates_1 = columns.filter(function (c) { return c.LogicalName !== 'craa5__equipment' && EQUIPMENT_ID_HINT.test(c.LogicalName); });
                        // The longest column wins: it holds the most ids
                        candidates_1.sort(function (a, b) { return (b.MaxLength || 0) - (a.MaxLength || 0); });
                        idCol = candidates_1[0] || null;
                        if (candidates_1.length > 1)
                            logEvent("Several equipment id columns found (".concat(candidates_1.map(function (c) { return c.LogicalName; }).join(', '), "). Using ").concat(idCol.LogicalName, ". Set EQUIPMENT_ID_COLUMN at the top of the file to choose another."), 'warn');
                        if (!idCol) {
                            reason = failures.length
                                ? "the app could not look up the table's columns (".concat(failures[0], ").")
                                : "the ".concat(OBSERVATION_LOGICAL_NAME, " table has no text column for equipment ids (for example \"Equipment GUIDs\", craa5_equipmentguids).");
                        }
                    }
                    if (typed && !picked)
                        logEvent("The equipment id column \"".concat(typed, "\" kept on this device ").concat(typedTaken ? 'already holds part of each issue' : "is not a text column of ".concat(OBSERVATION_LOGICAL_NAME), "; ").concat(idCol ? "using ".concat(idCol.LogicalName) : 'no id column is used', "."), 'warn');
                    logEvent("Equipment columns: names in craa5__equipment (max ".concat(equipmentMax || 'unknown', " characters), ids in ").concat(idCol ? idCol.LogicalName : 'no column', "."), failures.length ? 'warn' : 'debug', failures.length ? { failures: failures } : null);
                    // idsUnknown: the table may have an id column the app could not see, so names must not change on saved observations
                    return [2 /*return*/, { idColumn: idCol ? idCol.LogicalName : null, equipmentMax: equipmentMax, idMax: idCol && idCol.MaxLength ? idCol.MaxLength : null, reason: reason, idsUnknown: !idCol && failures.length > 0, candidates: candidates, picked: picked, typed: typed, typedWhy: typedWhy, lookupFailed: failures.length > 0 }];
            }
        });
    });
}
var escOData = function (s) { return String(s).replace(/'/g, "''"); };
// Inside contains() / startswith() Dataverse treats % _ [ as LIKE wildcards: wrap them in brackets to mean the character itself
var escLike = function (s) { return escOData(s).replace(/\[/g, '[[]').replace(/%/g, '[%]').replace(/_/g, '[_]'); };
var cleanGuid = function (s) { return String(s || '').replace(/[{}]/g, '').trim().toLowerCase(); };
var toAsset = function (row) { return ({
    id: cleanGuid(row.craa5___1_a_assetsid),
    name: (row.craa5_equipmentidentifier || '').trim() || '(no name)',
    room: (row.craa5_roomname || '').trim(),
    area: (row.craa5_areaname || '').trim()
}); };
function queryAssets(filter, top) {
    return __awaiter(this, void 0, void 0, function () {
        var url, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = apiUrl("".concat(ASSET_SET, "?$select=").concat(ASSET_SELECT, "&$filter=").concat(encodeURIComponent(filter), "&$orderby=craa5_equipmentidentifier&$top=").concat(top));
                    return [4 /*yield*/, fetch(url, { headers: ODATA_HEADERS })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                case 3: return [4 /*yield*/, res.json()];
                case 4: return [2 /*return*/, ((_b.sent()).value || []).map(toAsset).filter(function (a) { return GUID_PATTERN.test(a.id); })];
            }
        });
    });
}
// Every typed word must appear in the equipment's name, room or area. Never the whole table: at most ASSET_SEARCH_LIMIT rows.
// When that fills the cap, names that start with the whole text are asked for too (also capped) and listed first, so a
// full name such as "Mixer 7" is not pushed out by "Mixer 1057", "Mixer 17" or equipment in a room with a 7 in its name.
var searchAssets = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var words, wordPart, filter, loose, named, seen;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                words = text.trim().split(/\s+/).filter(Boolean).slice(0, 4);
                wordPart = words.map(function (w) { return "(contains(craa5_equipmentidentifier,'".concat(escLike(w), "') or contains(craa5_roomname,'").concat(escLike(w), "') or contains(craa5_areaname,'").concat(escLike(w), "'))"); }).join(' and ');
                filter = wordPart ? "statecode eq 0 and ".concat(wordPart) : 'statecode eq 0';
                return [4 /*yield*/, queryAssets(filter, ASSET_SEARCH_LIMIT)];
            case 1:
                loose = _a.sent();
                if (loose.length < ASSET_SEARCH_LIMIT)
                    return [2 /*return*/, loose];
                return [4 /*yield*/, queryAssets("statecode eq 0 and startswith(craa5_equipmentidentifier,'".concat(escLike(words.join(' ')), "')"), ASSET_SEARCH_LIMIT)];
            case 2:
                named = _a.sent();
                seen = {};
                return [2 /*return*/, named.concat(loose).filter(function (a) { return (seen[a.id] ? false : (seen[a.id] = true)); }).slice(0, ASSET_SEARCH_LIMIT)];
        }
    });
}); };
// The equipment of one room and area. Area is free text, so when it matches nothing the whole room is listed (one more capped query).
var assetsInPlace = function (room, area) { return __awaiter(void 0, void 0, void 0, function () {
    var roomFilter, rows;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                roomFilter = "statecode eq 0 and craa5_roomname eq '".concat(escOData(room.trim()), "'");
                if (!(area && area.trim())) return [3 /*break*/, 2];
                return [4 /*yield*/, queryAssets("".concat(roomFilter, " and craa5_areaname eq '").concat(escOData(area.trim()), "'"), ASSET_PLACE_LIMIT)];
            case 1:
                rows = _b.sent();
                if (rows.length > 0)
                    return [2 /*return*/, { rows: rows, areaMatched: true }];
                _b.label = 2;
            case 2:
                _a = {};
                return [4 /*yield*/, queryAssets(roomFilter, ASSET_PLACE_LIMIT)];
            case 3: return [2 /*return*/, (_a.rows = _b.sent(), _a.areaMatched = false, _a)];
        }
    });
}); };
// craa5__equipment holds the names with "; " between them; the id column holds the ids in the same order ("" for text-only entries).
var parseEquipment = function (namesText, idsText) {
    var names = (namesText || '').split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    var ids = idsText ? String(idsText).split(';').map(cleanGuid) : [];
    // Ids only count when they line up with the names (someone may have edited one column by hand)
    var aligned = ids.length === names.length;
    return names.map(function (name, i) { return ({ name: name, id: aligned && GUID_PATTERN.test(ids[i]) ? ids[i] : '', room: '', area: '' }); });
};
var equipmentNamesText = function (list) { return list.map(function (e) { return e.name.replace(/;/g, ','); }).join(EQUIPMENT_SEPARATOR); };
// Ids follow the data contract (lower case, "; " between them); they stay in the names' order, "" for a text-only entry
var equipmentIdsText = function (list) { return (list.some(function (e) { return e.id; }) ? list.map(function (e) { return cleanGuid(e.id); }).join(EQUIPMENT_SEPARATOR) : ''); };
var equipmentText = function (item) { return (item.equipmentList || []).map(function (e) { return e.name; }).join(', '); };
// --- STATUS HELPERS ---
var currentUserName = function () {
    try {
        if (window.Xrm && window.Xrm.Utility)
            return window.Xrm.Utility.getGlobalContext().userSettings.userName || SIGNED_IN.name || 'You';
    }
    catch (e) { /* not inside the app */ }
    return SIGNED_IN.name || 'You';
};
// Closed = Inactive (statecode 1, Status Reason 2); Open = Active (statecode 0, Status Reason 1). A table with its own
// Status Reasons may refuse those numbers, so a 400 retries with the state alone and Dataverse picks that state's default reason.
function saveStatus(id, closed, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var path, send, res, _a, _b, _c;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!/^craa5___1_/i.test(DATAVERSE_SCHEMA.TableName)) return [2 /*return*/]; path = "".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")");
                    send = function (body) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            logEvent("PATCH ".concat(closed ? 'close' : 'reopen', " ").concat(id), 'data', body, { method: 'PATCH', path: path, contentType: 'application/json' });
                            return [2 /*return*/, fetch(apiUrl(path), {
                                    method: 'PATCH',
                                    headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/json', 'If-Match': '*' }),
                                    body: JSON.stringify(body)
                                })];
                        });
                    }); };
                    return [4 /*yield*/, send(closed ? { statecode: 1, statuscode: 2 } : { statecode: 0, statuscode: 1 })];
                case 1:
                    res = _d.sent();
                    if (!(res.status === 400)) return [3 /*break*/, 4];
                    _a = logEvent;
                    _b = "Status change with a Status Reason was refused: ".concat;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    _a.apply(void 0, [_b.apply("Status change with a Status Reason was refused: ", [_d.sent(), ". Retrying with the state only."]), 'warn']);
                    return [4 /*yield*/, send({ statecode: closed ? 1 : 0 })];
                case 3:
                    res = _d.sent();
                    _d.label = 4;
                case 4:
                    if (res.status === 404)
                        throw new Error('this observation no longer exists in Dataverse (HTTP 404)');
                    if (!!res.ok) return [3 /*break*/, 6];
                    _c = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 5: throw new (_c.apply(Error, [void 0, _d.sent()]))();
                case 6: return [2 /*return*/];
            }
        });
    });
}
// --- MAPS (craa5___1_g_maps: one row per map picture, craa5_facility = the map's code) ---
// A problem keeps its map's code in craa5__facility. Blank or MAIN counts for the main map (the row coded MAIN, else the
// oldest row), so everything saved before there was a second map stays on the first one.
var MAP_KEY_MAX = 20; // codes are cut to 20 characters: an asset's spot (JSON in a 100-character column) carries the code
var mapKeyOf = function (code) { return String(code || '').trim().toUpperCase().slice(0, MAP_KEY_MAX); };
var onMainMapCode = function (code) { return !code || code === 'MAIN'; };
var MAP_PREF = 'Midwest Plant.mapId';
// The main map's code, set once the map rows are read (pinOnMap needs it)
var MAP_STATE = { mainKey: 'MAIN' };
// The map rows as the picker shows them, the main map first: [{ id, code, key, label, main, renamed }]. A code two rows share
// gets -2, -3 on the second and third, so each map keeps its own problems.
function mapList(rows) {
    var list = (rows || []).map(function (r) { return ({ id: r.craa5___1_g_mapsid || r.craa5___mapsId, code: String(r.craa5_facility || r.craa5_Facility || '').trim() }); }).filter(function (m) { return m.id; });
    if (!list.length)
        return [];
    var mainIndex = -1;
    list.forEach(function (m, i) { if (mainIndex === -1 && mapKeyOf(m.code) === 'MAIN')
        mainIndex = i; });
    if (mainIndex === -1)
        mainIndex = 0;
    var ordered = [list[mainIndex]].concat(list.filter(function (m, i) { return i !== mainIndex; }));
    var used = {};
    return ordered.map(function (m, i) {
        var base = mapKeyOf(m.code) || (i === 0 ? 'MAIN' : "MAP".concat(i + 1));
        var key = base;
        for (var n = 2; used[key]; n += 1)
            key = "".concat(base.slice(0, MAP_KEY_MAX - String(n).length - 1), "-").concat(n);
        used[key] = true;
        return { id: m.id, code: m.code, key: key, label: m.code || (i === 0 ? 'Main map' : "Map ".concat(i + 1)), main: i === 0, renamed: key !== mapKeyOf(m.code) };
    });
}
// The rows of craa5___1_g_maps: ids and codes only (the pictures are fetched one at a time, for the map on screen)
function loadMapRows() {
    return __awaiter(this, void 0, void 0, function () {
        var path, res, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    path = "".concat(DATAVERSE_MAPS_SCHEMA.TableName, "?$select=craa5___1_g_mapsid,craa5_facility");
                    return [4 /*yield*/, fetch(apiUrl("".concat(path, "&$orderby=createdon asc")), { headers: ODATA_HEADERS })];
                case 1:
                    res = _c.sent();
                    if (!(res.status === 400)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch(apiUrl(path), { headers: ODATA_HEADERS })];
                case 2:
                    res = _c.sent();
                    _c.label = 3;
                case 3:
                    if (!!res.ok) return [3 /*break*/, 5];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 4: throw new (_a.apply(Error, [void 0, _c.sent()]))();
                case 5:
                    _b = mapList;
                    return [4 /*yield*/, res.json()];
                case 6: return [2 /*return*/, _b.apply(void 0, [(_c.sent()).value])];
            }
        });
    });
}
// One map's picture: { url, bytes, type } or { note } saying plainly why there is none
function loadMapPicture(map) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a, _b, blob;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetch(apiUrl("".concat(DATAVERSE_MAPS_SCHEMA.TableName, "(").concat(map.id, ")/craa5_mapimage/$value?size=full")))];
                case 1:
                    res = _d.sent();
                    if (res.status === 204 || res.status === 404)
                        return [2 /*return*/, { note: "The map \"".concat(map.label, "\" has no picture in Dataverse yet. Add one to its Map Image column (craa5_mapimage) in the maps table.") }];
                    if (!!res.ok) return [3 /*break*/, 3];
                    _c = {};
                    _b = (_a = "The picture of the map \"".concat(map.label, "\" could not be downloaded (")).concat;
                    return [4 /*yield*/, readApiError(res)];
                case 2: return [2 /*return*/, (_c.note = _b.apply(_a, [_d.sent(), ")."]), _c)];
                case 3: return [4 /*yield*/, res.blob()];
                case 4:
                    blob = _d.sent();
                    if (!blob.size)
                        return [2 /*return*/, { note: "The map \"".concat(map.label, "\" has no picture in Dataverse yet (the picture came back empty). Add one to its Map Image column (craa5_mapimage).") }];
                    return [2 /*return*/, { url: URL.createObjectURL(blob), bytes: blob.size, type: blob.type || '' }];
            }
        });
    });
}
// --- PROBLEMS (craa5__facilityobservations), a page at a time ---
// Open problems are all read (500 a page, at most 5,000). Closed ones come newest-closed first, 200 a page, and only those
// submitted inside the timeframe; "Load older" reads the next page. Only the map on screen. Never the whole table at once.
var OPEN_PAGE = 500;
var OPEN_MAX = 5000;
var CLOSED_PAGE = 200;
var OLDER_SEARCH_TOP = 50;
// statecode / statuscode / modifiedon are system columns every table has: they carry Open / Closed
var PROBLEM_SELECT = 'craa5__facilityobservationid,craa5_mapx,craa5_mapy,craa5__boxwidth,craa5__boxheight,craa5__room,craa5__area,craa5__equipment,craa5__description,craa5__whotonotify,craa5__customnote,createdon,modifiedon,statecode,statuscode';
var PROBLEM_EXPAND = 'createdby($select=fullname),modifiedby($select=fullname)';
var TIMEFRAME_HOURS = { '24h': 24, '7d': 24 * 7, '30d': 24 * 30 };
var timeframeStart = function (timeFilter) { return (TIMEFRAME_HOURS[timeFilter] ? new Date(Date.now() - TIMEFRAME_HOURS[timeFilter] * 3600000).toISOString().replace(/\.\d{3}Z$/, 'Z') : ''); };
// The problems of one map. With a single map row every problem is on it (no filter).
function problemMapFilter(maps, map) {
    if (!map || !maps || maps.length < 2)
        return '';
    var own = "craa5__facility eq '".concat(escOData(map.key), "'");
    if (!map.main)
        return own;
    return "(craa5__facility eq null or craa5__facility eq '' or craa5__facility eq 'MAIN'".concat(map.key !== 'MAIN' ? " or ".concat(own) : '', ")");
}
// The extra columns a problem read asks for, tried in order: the picture marker (and the equipment ids), else plainer
var problemSelectOptions = function (pic, idColumn) {
    var pictureOptions = pic && pic.ready ? pictureSelectOptions(pic.name, pic.type) : [[]];
    return idColumn ? pictureOptions.map(function (extra) { return extra.concat([idColumn]); }).concat([[]]) : pictureOptions;
};
// Every typed word somewhere in the problem's text columns
var problemWordFilter = function (words) { return words.map(function (w) { return "(".concat(['craa5__description', 'craa5__room', 'craa5__area', 'craa5__equipment', 'craa5__customnote', 'craa5__whotonotify'].map(function (c) { return "contains(".concat(c, ",'").concat(escLike(w), "')"); }).join(' or '), ")"); }).join(' and '); };
function problemQueryUrl(select, closed, mapFilter, since, extraFilter) {
    var filter = ["statecode eq ".concat(closed ? 1 : 0), mapFilter, since ? "createdon ge ".concat(since) : '', extraFilter || ''].filter(Boolean).join(' and ');
    var order = "".concat(closed ? 'modifiedon' : 'createdon', " desc,craa5__facilityobservationid asc");
    return apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "?$select=").concat(select, "&$expand=").concat(PROBLEM_EXPAND, "&$filter=").concat(encodeURIComponent(filter), "&$orderby=").concat(encodeURIComponent(order), "&$count=true"));
}
// One page of problems: `url` is a new query, or the nextLink Dataverse gave with the page before
function fetchProblemPage(url, pageSize) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error, _a, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(url, { headers: __assign(__assign({}, ODATA_HEADERS), { Prefer: "odata.include-annotations=\"*\",odata.maxpagesize=".concat(pageSize) }) })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    error = new (_a.apply(Error, [void 0, _b.sent()]))();
                    error.status = res.status;
                    throw error;
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = _b.sent();
                    return [2 /*return*/, {
                            rows: data.value || [],
                            next: data['@odata.nextLink'] || null,
                            count: typeof data['@odata.count'] === 'number' ? data['@odata.count'] : null,
                            countCapped: data['@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded'] === true
                        }];
            }
        });
    });
}
// The first page of open problems. A 400 means Dataverse refused something: the map filter is dropped when the same columns
// work without it, else the next plainer column list is tried, so a wrong guess can never blank the map.
function firstOpenProblems(selectOptions, mapFilter, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var k, extra, select, error_1, page, plain_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    k = 0;
                    _b.label = 1;
                case 1:
                    if (!(k < selectOptions.length)) return [3 /*break*/, 11];
                    extra = selectOptions[k];
                    select = extra.length ? "".concat(PROBLEM_SELECT, ",").concat(extra.join(',')) : PROBLEM_SELECT;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 10]);
                    _a = {};
                    return [4 /*yield*/, fetchProblemPage(problemQueryUrl(select, false, mapFilter, ''), OPEN_PAGE)];
                case 3: return [2 /*return*/, (_a.page = _b.sent(), _a.extra = extra, _a.select = select, _a.splitError = '', _a)];
                case 4:
                    error_1 = _b.sent();
                    if (error_1.status !== 400)
                        throw error_1;
                    if (!mapFilter) return [3 /*break*/, 9];
                    page = null;
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fetchProblemPage(problemQueryUrl(select, false, '', ''), OPEN_PAGE)];
                case 6:
                    page = _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    plain_1 = _b.sent();
                    if (plain_1.status !== 400)
                        throw plain_1;
                    return [3 /*break*/, 8];
                case 8:
                    if (page)
                        return [2 /*return*/, { page: page, extra: extra, select: select, splitError: error_1.message }];
                    _b.label = 9;
                case 9:
                    logEvent("Problem query with extra fields [".concat(extra.join(', ') || 'none', "] was rejected (HTTP 400)."), 'warn');
                    return [3 /*break*/, 10];
                case 10:
                    k += 1;
                    return [3 /*break*/, 1];
                case 11: throw new Error('Dataverse refused every way the app asks for the problems (HTTP 400).');
            }
        });
    });
}
// A problem row as the app holds it. `ctx` = { picReady, picName, pictureFields, idColumn }
function problemFromRow(item, ctx) {
    var id = item.craa5__facilityobservationid || item.craa5_facilityobservationid;
    var hasPicture = ctx.picReady ? rowHasPicture(item, ctx.pictureFields) : false;
    var equipmentList = parseEquipment(item.craa5__equipment || item.craa5_equipment, ctx.idColumn ? item[ctx.idColumn] : '');
    return __assign(__assign({ id: id, mapX: item.craa5_mapx || 0, mapY: item.craa5_mapy || 0, boxW: item.craa5__boxwidth || item.craa5_boxwidth || 10, boxH: item.craa5__boxheight || item.craa5_boxheight || 10, room: item.craa5__room || item.craa5_room || '', area: item.craa5__area || item.craa5_area || 'Unknown Area', equipmentList: equipmentList, equipment: equipmentText({ equipmentList: equipmentList }), description: item.craa5__description || item.craa5_description || '', whoToNotify: item.craa5__whotonotify || item.craa5_whotonotify || '', whoToNotifyEmail: item.craa5__whotonotifyemail || '', facility: item.craa5__facility || '' }, parseCategory(item.craa5__customnote || item.craa5_category)), { closed: item.statecode === 1, statusReason: item['statuscode@OData.Community.Display.V1.FormattedValue'] || '', modifiedOn: item.modifiedon || item.createdon, modifiedBy: item.modifiedby ? item.modifiedby.fullname : (item['_modifiedby_value@OData.Community.Display.V1.FormattedValue'] || ''), image: null, picture: hasPicture === false ? null : storedPictureUrls(ctx.picName, id), submittedOn: item.createdon, submittedBy: item.createdby ? item.createdby.fullname : (item['_createdby_value@OData.Community.Display.V1.FormattedValue'] || 'Unknown') });
}
// New rows join a list once (by id); `fresh` wins over what the list had
var mergeProblems = function (list, fresh) {
    var ids = {};
    fresh.forEach(function (s) { ids[s.id] = true; });
    return list.filter(function (s) { return !ids[s.id]; }).concat(fresh);
};
// --- WHO IS SIGNED IN (the header, the Host check, "modified by" on things saved here) ---
var hostContext = function () {
    try {
        if (window.Xrm && window.Xrm.Utility)
            return window.Xrm.Utility.getGlobalContext();
        if (window.parent && window.Xrm && window.Xrm.Utility)
            return window.Xrm.Utility.getGlobalContext();
        if (window.top && window.Xrm && window.Xrm.Utility)
            return window.Xrm.Utility.getGlobalContext();
        return null;
    }
    catch (e) {
        return null;
    }
};
var SIGNED_IN = { name: '' }; // filled once the name is known (the host's context, else Dataverse's WhoAmI)
function readSignedIn() {
    return __awaiter(this, void 0, void 0, function () {
        var g, s, cleanId, uMatch, msId, who, id, name, e_2, uMatch, msId, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        g = hostContext();
                        s = g && g.userSettings;
                        if (s && s.userName) {
                            cleanId = String(s.userId || '').replace(/[{}]/g, '').toLowerCase();
                            uMatch = String(s.userName || '').match(/u\d{6,8}/i);
                            msId = uMatch ? uMatch[0].toUpperCase() : (cleanId ? cleanId.slice(0, 8).toUpperCase() : '');
                            return [2 /*return*/, { name: s.userName, id: cleanId, microsoftId: msId, how: 'the host' }];
                        }
                    }
                    catch (e) { /* the host does not say */ }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, getJson('WhoAmI')];
                case 2:
                    who = _a.sent();
                    id = who && who.UserId ? String(who.UserId).toLowerCase() : '';
                    if (!id)
                        return [2 /*return*/, { name: '', id: '', how: '', error: 'WhoAmI gave no user id.' }];
                    name = '';
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, getJson("systemusers(".concat(id, ")?$select=fullname"))];
                case 4:
                    name = (_a.sent()).fullname || '';
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    uMatch = String(name || '').match(/u\d{6,8}/i);
                    msId = uMatch ? uMatch[0].toUpperCase() : id.slice(0, 8).toUpperCase();
                    return [2 /*return*/, { name: name, id: id, microsoftId: msId, how: 'Dataverse (WhoAmI)' }];
                case 7:
                    error_2 = _a.sent();
                    return [2 /*return*/, { name: '', id: '', how: '', error: error_2.message }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// --- ISSUE CATEGORIES ---
// One list drives the form dropdown, the map flag colours, the filter chips and the action rail.
var CATEGORIES = [
    // 700-weight colours so white text on a selected chip (and the tinted badge text) stays readable (WCAG AA)
    { key: 'to be cleaned', label: 'To Be Cleaned', color: '#1d4ed8' },
    { key: 'to be fixed', label: 'To Be Fixed', color: '#c2410c' },
    { key: 'safety concern', label: 'Safety Concern', color: '#b91c1c' },
    { key: 'idea', label: 'Idea', color: '#15803d' },
    { key: 'fsq concern', label: 'FSQ Concern', color: '#7e22ce' },
    { key: 'note', label: 'Note', color: '#475569' }
];
// Unknown keys fall back to the last entry, which must stay 'note'
var categoryMeta = function (key) { return CATEGORIES.find(function (c) { return c.key === key; }) || CATEGORIES[CATEGORIES.length - 1]; };
// Dataverse keeps the category AND the custom note in ONE column (craa5__customnote):
// a preset name for the five presets, or free text for a "note". Split it back apart so every
// free-text note counts as the single "note" category instead of becoming a category of its own.
var parseCategory = function (raw) {
    var text = (raw || '').trim();
    var preset = CATEGORIES.find(function (c) { return c.key !== 'note' && c.key === text.toLowerCase(); });
    return preset ? { category: preset.key, customNote: '' } : { category: 'note', customNote: text };
};
var categoryText = function (item) {
    if (item.category === 'note')
        return item.customNote ? "Note: ".concat(item.customNote) : 'Note';
    return categoryMeta(item.category).label;
};
// What the search box looks through
var searchText = function (sub) { return [sub.room, sub.area, sub.equipment, sub.description, sub.whoToNotify, sub.submittedBy, categoryText(sub)].join(' ').toLowerCase(); };
// Flag / pin colour: the category's, or grey once the item is closed
var itemColor = function (item) { return (item.closed ? CLOSED_COLOR : categoryMeta(item.category).color); };
// Small per-device choices (like "Hide closed"). Storage can be blocked (private window, locked-down browser): then the default is used.
var readPref = function (key, fallback) {
    try {
        var raw = window.localStorage.getItem('__1_' + key);
        return raw === null ? fallback : JSON.parse(raw);
    }
    catch (e) {
        return fallback;
    }
};
var writePref = function (key, value) {
    try {
        window.localStorage.setItem('__1_' + key, JSON.stringify(value));
    }
    catch (e) { /* not remembered, still works */ }
};
var HIDE_CLOSED_PREF = 'Midwest Plant.overview.hideClosed';
// The Overview's layer switches: problems on, equipment off (its pins load only when switched on), labels only on a tap
var LAYERS_PREF = 'Midwest Plant.overview.layers';
var DEFAULT_LAYERS = { problems: true, equipment: false, labels: false };
// Top tabs that show the asset part of the app, and the asset view each one opens
var ASSET_TAB_VIEWS = { assetmap: 'map', assettable: 'table', bulk: 'bulk' };
var ASSET_VIEW_TABS = { map: 'assetmap', table: 'assettable', bulk: 'bulk' };
// --- COLUMNS THE APP ASSUMES ---
// The app is written against the column names it expects. When one is not found, the user can pick another column of the
// table, type the name it has in Dataverse (both remembered on this device), or create the suggested column in Dataverse and
// press "Check again". The picks share 'Midwest Plant.columnPicks' with the other apps (the shared Midwest Plant COLUMNS block).
var COLUMN_PICKS_PREF = 'Midwest Plant.columnPicks';
// Picks made this session are held here too, so a pick still works where the browser keeps no storage ('' = cleared)
var columnPicksNow = {};
var readColumnPick = function (key) {
    if (Object.prototype.hasOwnProperty.call(columnPicksNow, key))
        return columnPicksNow[key];
    var picks = readPref(COLUMN_PICKS_PREF, {});
    return picks && typeof picks === 'object' && typeof picks[key] === 'string' ? picks[key] : '';
};
var writeColumnPick = function (key, name) {
    columnPicksNow[key] = name || '';
    var old = readPref(COLUMN_PICKS_PREF, {});
    var next = {};
    if (old && typeof old === 'object')
        Object.keys(old).forEach(function (k) { next[k] = old[k]; });
    if (name)
        next[key] = name;
    else
        delete next[key];
    writePref(COLUMN_PICKS_PREF, next);
};
// A logical name as Dataverse writes it (letters, digits and _; always lower case)
var COLUMN_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;
var cleanColumnName = function (text) { return String(text || '').trim().toLowerCase(); };
// One missing (or swapped) column: what it is for, the column to create, and the table's columns that could stand in.
// candidates: [{ name, label, kind }]. picked: the column chosen on this device and in use ('' = the app's own choice).
// typed: the name stored on this device for it, in use or not ('' = none): one the table does not have says so.
function ColumnFix(_a) {
    var need = _a.need, expected = _a.expected, expectedLabel = _a.expectedLabel, expectedType = _a.expectedType, found = _a.found, candidates = _a.candidates, picked = _a.picked, typed = _a.typed, typedWhy = _a.typedWhy, onPick = _a.onPick, onRecheck = _a.onRecheck, checking = _a.checking, checkError = _a.checkError, testId = _a.testId, message = _a.message;
    var list = (candidates || []).filter(function (c) { return c && c.name; });
    var _b = useState(false), typing = _b[0], setTyping = _b[1];
    var _c = useState(''), text = _c[0], setText = _c[1];
    var name = cleanColumnName(text);
    var nameOk = COLUMN_NAME_PATTERN.test(name);
    // A name kept on this device that the table does not have (or not as the right kind of column, or one the app may not use:
    // typedWhy says why): the app's choice is used. A pick still waiting on a read (picked, not found yet) is not one of them.
    var typedUnused = !!typed && typed !== found && typed !== picked && !checking;
    var apply = function () {
        if (!nameOk)
            return;
        setTyping(false);
        setText('');
        onPick(name);
    };
    return (React.createElement("div", { className: "rounded-md border px-2 py-1.5 text-xs ".concat(found ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-[#FFB81C] bg-[#FFF6E0] text-[#5C3D00]'), "data-testid": testId, "data-column-fix": expected || '' },
        found ? (React.createElement("p", null,
            React.createElement("b", null,
                need,
                ":"),
            " ",
            picked ? React.createElement(React.Fragment, null,
                "using ",
                React.createElement("span", { className: "font-mono break-all" }, found),
                ", picked on this device.") : React.createElement(React.Fragment, null,
                "in ",
                React.createElement("span", { className: "font-mono break-all" }, found),
                "."))) : message ? (React.createElement("p", null,
            React.createElement("b", null,
                need,
                ":"),
            " ",
            message)) : (React.createElement("p", null,
            React.createElement("b", null,
                need,
                ":"),
            " not found.",
            expected ? React.createElement(React.Fragment, null,
                " Create ",
                /^[AEIOU]/i.test(expectedType || '') ? 'an' : 'a',
                " ",
                React.createElement("b", null, expectedType),
                " column named \"",
                expectedLabel || expected,
                "\" (",
                React.createElement("span", { className: "font-mono break-all" }, expected),
                ") in Dataverse, then press Check again.") : ' Pick the column to use, or press Check again.')),
        typedUnused && (React.createElement("p", { className: "mt-1 text-[#7A5200]", "data-testid": testId ? "".concat(testId, "-typed-unused") : undefined },
            "The name kept on this device, ",
            React.createElement("span", { className: "font-mono break-all" }, typed),
            ", ",
            typedWhy ? React.createElement(React.Fragment, null,
                "is not used: ",
                typedWhy) : React.createElement(React.Fragment, null,
                "is not ",
                expectedType ? "".concat(/^[AEIOU]/i.test(expectedType) ? 'an' : 'a', " ").concat(expectedType) : 'a usable',
                " column of this table"),
            found ? React.createElement(React.Fragment, null,
                ", so ",
                React.createElement("span", { className: "font-mono break-all" }, found),
                " is used") : '',
            ". ",
            typedWhy ? 'Type another name' : 'Check the spelling (the logical name)',
            ", or go back to the app's choice.")),
        React.createElement("div", { className: "mt-1 flex flex-wrap items-center gap-1.5" },
            list.length > 0 && (React.createElement("label", { className: "inline-flex items-center gap-1 min-w-0" },
                React.createElement("span", { className: "shrink-0" }, found ? 'Use another:' : 'Or use:'),
                React.createElement("select", { value: picked || '', onChange: function (e) { return onPick(e.target.value); }, "aria-label": "Column for ".concat(need), className: "min-w-0 max-w-[16rem] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-xs" },
                    React.createElement("option", { value: "" }, found && !picked ? 'The app\'s choice' : (picked ? 'Back to the app\'s choice' : 'Pick a column...')),
                    picked && !list.some(function (c) { return c.name === picked; }) && React.createElement("option", { value: picked },
                        picked,
                        " (typed)"),
                    list.map(function (c) { return React.createElement("option", { key: c.name, value: c.name }, c.label && c.label !== c.name ? "".concat(c.label, " (").concat(c.name, ")") : c.name); })))),
            onRecheck && (React.createElement("button", { type: "button", onClick: onRecheck, disabled: !!checking, className: "px-2 py-0.5 rounded font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB] disabled:opacity-60" }, checking ? 'Checking...' : 'Check again')),
            !typing && (React.createElement("button", { type: "button", onClick: function () { setTyping(true); setText(typed || ''); }, className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-[#00468B] hover:bg-slate-50", "data-testid": testId ? "".concat(testId, "-type") : undefined }, "Type a column name")),
            (typedUnused || (picked && list.length === 0)) && (React.createElement("button", { type: "button", onClick: function () { return onPick(''); }, className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-[#00468B] hover:bg-slate-50", "data-testid": testId ? "".concat(testId, "-back") : undefined }, "Back to the app's choice"))),
        typing && (React.createElement("div", { className: "mt-1.5 flex flex-col gap-1" },
            React.createElement("p", null,
                "Type the name the column has in Dataverse (its logical name, like ",
                React.createElement("span", { className: "font-mono" }, expected || 'craa5_columnname'),
                ") and press Use it. It is kept on this device."),
            React.createElement("div", { className: "flex flex-wrap items-center gap-1.5" },
                React.createElement("input", { type: "text", value: text, onChange: function (e) { return setText(e.target.value); }, onKeyDown: function (e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            apply();
                        }
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            e.stopPropagation();
                            setTyping(false);
                        }
                    }, autoFocus: true, autoComplete: "off", autoCapitalize: "off", spellCheck: false, placeholder: expected || 'craa5_columnname', "aria-label": "Column name for ".concat(need), className: "min-w-0 w-56 max-w-full border border-slate-300 rounded px-1.5 py-0.5 bg-white font-mono text-xs", "data-testid": testId ? "".concat(testId, "-name") : undefined }),
                React.createElement("button", { type: "button", onClick: apply, disabled: !nameOk, className: "px-2 py-0.5 rounded font-bold border border-[#0072CE] bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50", "data-testid": testId ? "".concat(testId, "-use") : undefined }, "Use it"),
                React.createElement("button", { type: "button", onClick: function () { return setTyping(false); }, className: "px-2 py-0.5 rounded font-bold text-slate-600 underline" }, "Cancel")),
            text.trim() && !nameOk && React.createElement("p", { className: "text-[#C4001F]" }, "A logical name has only letters, digits and _ and starts with a letter (like craa5_picture)."))),
        checkError && !checking && React.createElement("p", { className: "mt-1 text-[#C4001F]", role: "alert" },
            "Could not check again: ",
            checkError)));
}
// --- TIME HELPERS FOR THE ACTION RAIL ---
// --- PICTURE HELPERS ---
// ===== PICTURE TO JPG (every picture upload goes through this; the same block is in each app that uploads pictures) =====
// Whatever picture is picked (PNG, WebP, GIF, BMP, TIFF, an iPhone HEIC photo ...) goes up as a JPG, as large as maxSide px on
// its long side (default 1600). Chrome and Edge cannot open HEIC (Safari can), so a HEIC photo is turned into a JPG by a small
// converter that is loaded from a CDN the first time one is picked. A photo that fails says why, in plain words.
var PICTURE_MAX_SIDE = 1600;
var HEIC_CONVERTER_URLS = [
    'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js',
    'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
    'https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js'
];
var HEIC_FILE_NAME = /\.(heic|heif)$/i;
var looksLikeHeic = function (file) { return /hei[cf]/i.test((file && file.type) || '') || HEIC_FILE_NAME.test((file && file.name) || ''); };
var isJpegFile = function (file) { return /^image\/(p?jpe?g)$/i.test((file && file.type) || '') || /\.(jpe?g|jfif)$/i.test((file && file.name) || ''); };
var HEIC_HELP = 'this is an iPhone HEIC photo and the converter that turns it into a JPG could not be loaded (is the network blocked?). It can be tried again, or save or share the photo as a JPG first (for new photos, set the iPhone to Settings > Camera > Formats > Most Compatible)';
// heic2any 0.0.4 leaves one "message" listener on its worker for every photo it converts, and each one keeps that photo's bytes in
// memory until the page is reloaded. Each listener answers a single request, so it is taken off again once its answer has come.
function tidyHeicWorker() {
    try {
        var w_1 = window.__heic2any__worker;
        if (!w_1 || w_1.__tidy)
            return;
        w_1.__tidy = true;
        var lastId_1 = null;
        var post_1 = w_1.postMessage.bind(w_1);
        var add_1 = w_1.addEventListener.bind(w_1);
        w_1.postMessage = function (msg) { lastId_1 = msg && msg.id; return post_1.apply(null, arguments); };
        w_1.addEventListener = function (type, fn, opts) {
            if (type !== 'message' || typeof fn !== 'function' || lastId_1 === null)
                return add_1(type, fn, opts);
            var id = lastId_1;
            lastId_1 = null;
            var wrapped = function (ev) {
                fn.call(this, ev);
                if (ev && ev.data && ev.data.id === id)
                    w_1.removeEventListener('message', wrapped);
            };
            return add_1(type, wrapped, opts);
        };
    }
    catch (e) { /* only a tidy-up: the conversion works without it */ }
}
var heicConverterLoading = null;
function loadHeicConverter() {
    var _this = this;
    if (typeof window !== 'undefined' && typeof window.heic2any === 'function')
        return Promise.resolve(window.heic2any);
    if (heicConverterLoading)
        return heicConverterLoading;
    var tryUrl = function (url) { return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = url;
        s.onload = function () { if (typeof window.heic2any === 'function') {
            tidyHeicWorker();
            resolve(window.heic2any);
        }
        else
            reject(new Error('empty')); };
        s.onerror = function () { if (s.parentNode)
            s.parentNode.removeChild(s); reject(new Error('blocked')); };
        document.head.appendChild(s);
    }); };
    heicConverterLoading = (function () { return __awaiter(_this, void 0, void 0, function () {
        var i, e_3, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < HEIC_CONVERTER_URLS.length)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, tryUrl(HEIC_CONVERTER_URLS[i])];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    e_3 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    i += 1;
                    return [3 /*break*/, 1];
                case 6:
                    heicConverterLoading = null; // a later try may work
                    err = new Error(HEIC_HELP);
                    err.retry = true; // not the photo's fault: it can be tried again
                    throw err;
            }
        });
    }); })();
    return heicConverterLoading;
}
// The first bytes of a HEIC / HEIF file: a "ftyp" box that names one of its brands (a photo renamed to .jpg still counts)
function sniffHeic(file) {
    return new Promise(function (resolve) {
        if (!file || typeof FileReader === 'undefined' || !file.slice) {
            resolve(false);
            return;
        }
        var reader = new FileReader();
        reader.onerror = function () { return resolve(false); };
        reader.onload = function () {
            try {
                var b_1 = new Uint8Array(reader.result);
                var tag = function (o) { return String.fromCharCode(b_1[o], b_1[o + 1], b_1[o + 2], b_1[o + 3]); };
                if (b_1.length < 12 || tag(4) !== 'ftyp') {
                    resolve(false);
                    return;
                }
                var brands = [tag(8)];
                for (var o = 16; o + 4 <= b_1.length; o += 4)
                    brands.push(tag(o));
                resolve(brands.some(function (x) { return /^(heic|heix|hevc|hevx|heim|heis|hevm|hevs|mif1|msf1|heif)$/.test(x); }));
            }
            catch (e) {
                resolve(false);
            }
        };
        try {
            reader.readAsArrayBuffer(file.slice(0, 64));
        }
        catch (e) {
            resolve(false);
        }
    });
}
// A HEIC photo as a JPEG blob; one picked file is converted once, however many parts of the app ask
var heicJpegs = typeof WeakMap === 'function' ? new WeakMap() : null;
function heicToJpegBlob(file) {
    if (heicJpegs && heicJpegs.has(file))
        return heicJpegs.get(file);
    var p = loadHeicConverter().then(function (heic2any) { return heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 }).then(function (out) { return (Array.isArray(out) ? out[0] : out); }, function (err) { throw new Error("this HEIC photo could not be converted (".concat((err && (err.message || err.code)) || 'unknown reason', "). Save or share it as a JPG first, then add it again")); }); });
    if (heicJpegs) {
        heicJpegs.set(file, p);
        p.catch(function () { heicJpegs.delete(file); });
    }
    return p;
}
var decodePicture = function (blob) { return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('not a picture this browser can open')); };
    img.src = url;
}); };
// Resolves the picture as a JPEG data URL. opts.maxSide: long side in px (default 1600; 0 keeps the size, up to 4096);
// opts.quality: 0 to 1 (default 0.8). Rejects with a plain sentence.
function pictureToJpegDataUrl(file, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var o, maxSide, quality, img, e_4, _a, jpeg, e2_1, w, h, scale, canvas, ctx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    o = opts || {};
                    maxSide = o.maxSide === undefined ? PICTURE_MAX_SIDE : (o.maxSide || 4096);
                    quality = o.quality || 0.8;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 11]);
                    return [4 /*yield*/, decodePicture(file)];
                case 2:
                    img = _b.sent();
                    return [3 /*break*/, 11];
                case 3:
                    e_4 = _b.sent();
                    _a = looksLikeHeic(file);
                    if (_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, sniffHeic(file)];
                case 4:
                    _a = (_b.sent());
                    _b.label = 5;
                case 5:
                    if (!(_a))
                        throw new Error('That file is not a picture this browser can open. Try a JPG or PNG.');
                    return [4 /*yield*/, heicToJpegBlob(file)];
                case 6:
                    jpeg = _b.sent();
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, decodePicture(jpeg)];
                case 8:
                    img = _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e2_1 = _b.sent();
                    throw new Error('this HEIC photo could not be converted. Save or share it as a JPG first, then add it again');
                case 10: return [3 /*break*/, 11];
                case 11:
                    w = img.naturalWidth || img.width;
                    h = img.naturalHeight || img.height;
                    if (!w || !h)
                        throw new Error('That picture has no size this browser can read.');
                    try {
                        scale = Math.min(1, maxSide / Math.max(w, h));
                        canvas = document.createElement('canvas');
                        canvas.width = Math.max(1, Math.round(w * scale));
                        canvas.height = Math.max(1, Math.round(h * scale));
                        ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#FFFFFF'; // JPEG has no transparency: see-through parts would turn black
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        return [2 /*return*/, canvas.toDataURL('image/jpeg', quality)];
                    }
                    catch (err) {
                        throw new Error('The picture could not be prepared for upload.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// ===== END PICTURE TO JPG =====
// Observation and equipment pictures: a JPG of at most 1600 px (a few hundred KB). Resolves a data URL.
var compressImage = function (file, opts) { return pictureToJpegDataUrl(file, opts); };
var dataUrlToBytes = function (dataUrl) {
    var binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1)
        bytes[i] = binary.charCodeAt(i);
    return bytes;
};
// Scroll a zoomable map container so the point (xPct, yPct) of the map sits in the middle of the view.
// Waits for the map picture to be laid out first: before that the container has nothing to scroll to.
var centerMapOn = function (container, xPct, yPct) {
    if (!container)
        return;
    var img = container.querySelector('img');
    // Measure the zoomed map itself (the container's first child), not the scroll area, so nothing else that overflows
    // (a wide tooltip near the edge) can move the target
    var go = function () {
        var map = container.firstElementChild || container;
        var left = map === container ? 0 : map.offsetLeft;
        var top = map === container ? 0 : map.offsetTop;
        container.scrollTo({
            left: left + (xPct / 100) * map.offsetWidth - container.clientWidth / 2,
            top: top + (yPct / 100) * map.offsetHeight - container.clientHeight / 2,
            behavior: 'smooth'
        });
    };
    if (img && !img.complete)
        img.addEventListener('load', go, { once: true });
    else
        go();
};
// "Tue, Oct 6, 5:49 PM" (the year too when it is not this year)
var formatWhen = function (iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime()))
        return '';
    var date = d.toLocaleDateString(undefined, __assign({ weekday: 'short', month: 'short', day: 'numeric' }, (d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {})));
    return "".concat(date, ", ").concat(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
};
// A relative hint only while it is under a day old, so it can never disagree with the day heading
var recentAgo = function (iso) {
    var mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (isNaN(mins) || mins < 0 || mins >= 24 * 60)
        return '';
    if (mins < 1)
        return 'just now';
    if (mins < 60)
        return "".concat(mins, " min ago");
    return "".concat(Math.floor(mins / 60), " h ago");
};
// Calendar-day buckets so the rail reads "Today / Yesterday / ..." as it rolls
var dayBucket = function (iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime()))
        return 'Older';
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    var days = Math.round((today - d) / 86400000);
    if (days <= 0)
        return 'Today';
    if (days === 1)
        return 'Yesterday';
    if (days <= 7)
        return '2-7 days ago';
    if (days <= 30)
        return '8-30 days ago';
    return 'Older';
};
window.__PORTAL_APP_COMPONENT__ = window.__DEMO_APP_COMPONENT__ = function App() {
    var _this = this;
    var _a = useState('overview'), activeTab = _a[0], setActiveTab = _a[1];
    // The asset tabs (Asset Map, Asset Management, Bulk Upload) share one part of the app that stays alive once opened (hidden
    // on other tabs), so an asset being edited or a list of files being uploaded keeps its state
    var assetView = ASSET_TAB_VIEWS[activeTab] || null;
    var _b = useState(false), assetsOpened = _b[0], setAssetsOpened = _b[1];
    useEffect(function () { if (assetView)
        setAssetsOpened(true); }, [assetView]);
    var _c = useState([]), submissions = _c[0], setSubmissions = _c[1];
    var submissionsRef = useRef(submissions);
    submissionsRef.current = submissions;
    var _d = useState(null), mainMapImage = _d[0], setMainMapImage = _d[1];
    // The maps (craa5___1_g_maps rows), the one on screen, and why its picture is missing ('' = none missing)
    var _f = useState([]), maps = _f[0], setMaps = _f[1];
    var _g = useState(null), mapId = _g[0], setMapId = _g[1];
    var _h = useState({ status: 'loading', note: '', bytes: 0, type: '' }), mapPicture = _h[0], setMapPicture = _h[1];
    var currentMap = useMemo(function () { return maps.filter(function (m) { return m.id === mapId; })[0] || null; }, [maps, mapId]);
    var _j = useState({ name: '', id: '', how: '', checking: true }), signedIn = _j[0], setSignedIn = _j[1];
    // Which problems are loaded: all open ones, the closed ones page by page (see PROBLEMS)
    var _k = useState({ status: 'loading', error: '', openTotal: null, openCapped: false, closedTotal: null, closedCapped: false, closedNext: null, closedCursor: '', olderBusy: false, olderError: '', splitNote: '' }), problemWindow = _k[0], setProblemWindow = _k[1];
    var problemWindowRef = useRef(problemWindow);
    problemWindowRef.current = problemWindow;
    var _l = useState({ text: '', busy: false, found: null, added: 0, error: '' }), olderSearch = _l[0], setOlderSearch = _l[1];
    // Overview layers: problems, equipment and labels (remembered on this device)
    var _m = useState(function () {
        var saved = readPref(LAYERS_PREF, null);
        return __assign(__assign({}, DEFAULT_LAYERS), (saved && typeof saved === 'object' ? saved : {}));
    }), layers = _m[0], setLayers = _m[1];
    useEffect(function () { writePref(LAYERS_PREF, layers); }, [layers]);
    var changeLayers = useCallback(function (change) { return setLayers(function (prev) { return (__assign(__assign({}, prev), change)); }); }, []);
    var _o = useState(null), assetFocusRequest = _o[0], setAssetFocusRequest = _o[1]; // { id, n }: open this asset on the Asset Map
    // UI & View States
    var _p = useState(100), globalZoom = _p[0], setGlobalZoom = _p[1];
    var _q = useState(null), editingItem = _q[0], setEditingItem = _q[1];
    var _r = useState(null), focusItem = _r[0], setFocusItem = _r[1];
    var _s = useState('all'), timeFilter = _s[0], setTimeFilter = _s[1];
    var _t = useState([]), categoryFilter = _t[0], setCategoryFilter = _t[1]; // [] = every category
    var _u = useState('all'), statusFilter = _u[0], setStatusFilter = _u[1]; // 'open' | 'closed' | 'all'
    var _v = useState(''), searchQuery = _v[0], setSearchQuery = _v[1]; // shared by the map, gallery and action rail
    // The Overview map has its own "Hide closed" switch instead of Open / Closed / Both. On at first; remembered on this device.
    var _w = useState(function () { return readPref(HIDE_CLOSED_PREF, true) !== false; }), hideClosedOnMap = _w[0], setHideClosedOnMap = _w[1];
    useEffect(function () { writePref(HIDE_CLOSED_PREF, hideClosedOnMap); }, [hideClosedOnMap]);
    // Where the attached equipment's ids are kept (null = names only)
    var _x = useState({ idColumn: null, equipmentMax: null, idMax: null, reason: 'the app is still checking the observations table.', idsUnknown: true }), equipmentColumns = _x[0], setEquipmentColumns = _x[1];
    // Assets tab: the table's columns and the placed assets, read once and kept while switching tabs
    var _y = useState('MAIN'), mainMapKey = _y[0], setMainMapKey = _y[1];
    var _z = useState({ status: 'idle', ready: false, error: '', entitySet: ASSET_SET, fields: [], mapColumn: null, mapReason: '', warnings: [] }), assetMeta = _z[0], setAssetMeta = _z[1];
    var _0 = useState({ status: 'idle', rows: [], capped: false, error: '' }), assetPins = _0[0], setAssetPins = _0[1];
    var _1 = useState(false), adminOpen = _1[0], setAdminOpen = _1[1];
    var _2 = useState('logs'), drawerView = _2[0], setDrawerView = _2[1]; // 'logs' | 'host' (the Host check card)
    var _3 = useState([]), logs = _3[0], setLogs = _3[1];
    var _4 = useState(0), loadTime = _4[0], setLoadTime = _4[1];
    // Where observation pictures live. Until the table has been checked, saving a picture is held back.
    var _5 = useState({ ready: false, name: null, type: null, reason: 'the app is still checking the observations table.' }), pictureColumn = _5[0], setPictureColumn = _5[1];
    var marksColumn = useRef(null); // the column the loaded issues' picture marks were read with
    // --- ADMIN LOGGER & HELPERS ---
    // Stable identity: effects that list logEvent as a dependency (like the edit-form setup in SubmitTab)
    // would otherwise re-run on every render, and each run logs, which renders again, and so on.
    // `request` ({ method, path, contentType }) is only for 'data' entries that are not the usual JSON call to the table
    var logEvent = useCallback(function (message, type, payload, request) {
        if (type === void 0) { type = 'info'; }
        if (payload === void 0) { payload = null; }
        if (request === void 0) { request = null; }
        setLogs(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ time: new Date().toLocaleTimeString(), message: message, type: type, payload: payload, request: request }], false); });
    }, []);
    // The shared area and room names are read once at start (SHARED PLACE NAMES), so every tab saves the same spelling
    useEffect(function () { loadPlaceLists(logEvent); }, [logEvent]);
    var handleCopyPayload = function (payload) {
        var text = JSON.stringify(payload, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        }
        else {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            textArea.remove();
        }
    };
    // --- PROBLEMS: read a page at a time, for the map on screen (see PROBLEMS above App) ---
    // problemCtx: how problems are read (the columns that worked, the picture and equipment-id columns, whether maps can be told apart)
    var problemCtx = useRef(null);
    var openSeq = useRef(0);
    var closedSeq = useRef(0);
    var fullRead = useRef(false); // a read of the open and the closed problems is under way
    var lastRead = useRef(null); // { mapId, time } the problems on screen were read for
    var openFor = useRef(undefined); // the map id the open problems on screen were read for (undefined: none read, or that read failed)
    var touchedRef = useRef(null); // ids saved here while a read is under way: the copy saved here wins over what the read brings
    var searchSeq = useRef(0); // a newer search of the older closed problems makes an older one drop its answer
    var mapKeyRef = useRef(mainMapKey);
    mapKeyRef.current = mainMapKey;
    // A save made here. The copy saved here wins over a read still under way. A new problem saved for another map (the map was
    // changed while it was being saved) is not put on this one, unless every problem shows on every map.
    var savedHere = useCallback(function (item, update) {
        var ctx = problemCtx.current;
        if (item.mapKey && item.mapKey !== mapKeyRef.current && !(ctx && ctx.splitOff))
            return;
        if (touchedRef.current && item.id)
            touchedRef.current[item.id] = true;
        setSubmissions(update);
    }, []);
    var _6 = useState(false), problemsReady = _6[0], setProblemsReady = _6[1];
    // 'all' = open and closed (the first load, another map); 'closed' = only the closed ones again (another timeframe).
    // A newer read makes an older one drop its answer.
    var readProblems = useCallback(function (requested, mapsNow, map, time) { return __awaiter(_this, void 0, void 0, function () {
        var ctx, readFor, full, touched, oSeq, cSeq, stale, since, mapFilter, openItems_1, openTotal_1, openCapped_1, first, idColumn_1, eq, page, rows, closed_1, closedItems_1, savedMeanwhile_1, lastClosed_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx = problemCtx.current;
                    if (!ctx)
                        return [2 /*return*/];
                    readFor = map ? map.id : null;
                    full = requested === 'all' || fullRead.current || !ctx.select || openFor.current !== readFor;
                    if (full) {
                        openSeq.current += 1;
                        fullRead.current = true;
                        openFor.current = undefined;
                    }
                    closedSeq.current += 1;
                    searchSeq.current += 1;
                    touched = {};
                    touchedRef.current = touched;
                    oSeq = openSeq.current;
                    cSeq = closedSeq.current;
                    stale = function () { return oSeq !== openSeq.current || cSeq !== closedSeq.current; };
                    lastRead.current = { mapId: map ? map.id : null, time: time };
                    setProblemWindow(function (w) { return (__assign(__assign({}, w), { status: 'loading', error: '', closedNext: null, olderBusy: false, olderError: '' })); });
                    setOlderSearch({ text: '', busy: false, found: null, added: 0, error: '' });
                    since = timeframeStart(time);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    mapFilter = ctx.splitOff ? '' : problemMapFilter(mapsNow, map);
                    openItems_1 = [];
                    openTotal_1 = null;
                    openCapped_1 = false;
                    if (!full) return [3 /*break*/, 6];
                    logEvent("Reading the open problems".concat(map ? " of the map ".concat(map.label) : '', "..."), 'debug');
                    return [4 /*yield*/, firstOpenProblems(ctx.selectOptions, mapFilter, logEvent)];
                case 2:
                    first = _a.sent();
                    if (stale())
                        return [2 /*return*/];
                    if (first.splitError) {
                        ctx.splitOff = first.splitError;
                        mapFilter = '';
                        logEvent("Dataverse refused to sort the problems by map (".concat(first.splitError, "). Every problem shows on every map until the craa5__facility column can be read."), 'warn');
                    }
                    if (!ctx.select) {
                        // The first read found the columns that can be read: later reads ask for the same
                        ctx.select = first.select;
                        ctx.selectOptions = [first.extra];
                        idColumn_1 = ctx.eqColumns.idColumn;
                        ctx.pictureFields = first.extra.filter(function (f) { return f !== idColumn_1; });
                        eq = ctx.eqColumns;
                        // The ids are only written back when they could be read: saving without them would wipe the stored ones
                        if (idColumn_1 && first.extra.indexOf(idColumn_1) === -1) {
                            logEvent("The equipment id column \"".concat(idColumn_1, "\" could not be read, so equipment is saved by name only this session."), 'warn');
                            eq = __assign(__assign({}, eq), { idColumn: null, idsUnknown: true, picked: '', typedWhy: eq.picked ? 'Dataverse would not give it when the problems were read' : eq.typedWhy, reason: "the column ".concat(idColumn_1, " could not be read.") });
                        }
                        ctx.idsPending = false;
                        ctx.idColumn = eq.idColumn;
                        setEquipmentColumns(eq);
                        if (ctx.picReady && ctx.pictureFields.length === 0)
                            logEvent('Could not tell which observations have pictures; trying to show a picture for every one.', 'warn');
                        marksColumn.current = ctx.picReady ? ctx.picName : null;
                    }
                    page = first.page;
                    rows = page.rows;
                    openTotal_1 = page.count;
                    _a.label = 3;
                case 3:
                    if (!(page.next && rows.length < OPEN_MAX)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchProblemPage(page.next, OPEN_PAGE)];
                case 4:
                    page = _a.sent();
                    if (stale())
                        return [2 /*return*/];
                    rows = rows.concat(page.rows);
                    return [3 /*break*/, 3];
                case 5:
                    openCapped_1 = !!page.next;
                    if (openCapped_1)
                        logEvent("Only the first ".concat(rows.length, " open problems are loaded; Dataverse has more."), 'warn');
                    openItems_1 = rows.map(function (r) { return problemFromRow(r, ctx); });
                    _a.label = 6;
                case 6: return [4 /*yield*/, fetchProblemPage(problemQueryUrl(ctx.select, true, mapFilter, since), CLOSED_PAGE)];
                case 7:
                    closed_1 = _a.sent();
                    if (stale())
                        return [2 /*return*/];
                    closedItems_1 = closed_1.rows.map(function (r) { return problemFromRow(r, ctx); });
                    savedMeanwhile_1 = function (prev) { return prev.filter(function (s) { return touched[s.id]; }); };
                    if (full) {
                        fullRead.current = false;
                        openFor.current = readFor;
                        setSubmissions(function (prev) { return mergeProblems(mergeProblems(openItems_1, closedItems_1), savedMeanwhile_1(prev)); });
                    }
                    else {
                        // The open ones stay as they are; the closed ones are the new timeframe's
                        setSubmissions(function (prev) { return mergeProblems(mergeProblems(prev.filter(function (s) { return !s.closed; }), closedItems_1), savedMeanwhile_1(prev)); });
                    }
                    if (touchedRef.current === touched)
                        touchedRef.current = null;
                    lastClosed_1 = closed_1.rows[closed_1.rows.length - 1];
                    setProblemWindow(function (w) { return (__assign(__assign({}, w), { status: 'ready', error: '', openTotal: full ? openTotal_1 : w.openTotal, openCapped: full ? openCapped_1 : w.openCapped, closedTotal: closed_1.count, closedCapped: closed_1.countCapped, closedNext: closed_1.next, closedCursor: lastClosed_1 ? lastClosed_1.modifiedon || '' : '', splitNote: ctx.splitOff || '' })); });
                    logEvent("Successfully loaded ".concat(full ? "".concat(openItems_1.length, " open and ") : '').concat(closedItems_1.length, " closed live observations").concat(map ? " for the map ".concat(map.label) : '').concat(closed_1.next ? '; older closed ones load on request' : '', "."), 'success');
                    return [3 /*break*/, 9];
                case 8:
                    error_3 = _a.sent();
                    if (stale())
                        return [2 /*return*/];
                    if (full)
                        fullRead.current = false;
                    if (touchedRef.current === touched)
                        touchedRef.current = null;
                    // The issues on screen were read with the old id column: until a read gives the new one, no ids are written (an edit
                    // would wipe the ones stored there)
                    if (!ctx.select)
                        setEquipmentColumns(ctx.idsPending && ctx.eqColumns.idColumn ? __assign(__assign({}, ctx.eqColumns), { idColumn: null, idsUnknown: true, reason: "the problems could not be read again with ".concat(ctx.eqColumns.idColumn, "; press Check again to try once more.") }) : ctx.eqColumns);
                    logEvent("Observation Live Fetch Failed: ".concat(error_3.message), 'error');
                    setProblemWindow(function (w) { return (__assign(__assign({}, w), { status: 'error', error: error_3.message })); });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [logEvent]);
    // Another map or another timeframe: read again (the first read is started by the start-up below)
    useEffect(function () {
        if (!problemsReady || !lastRead.current)
            return;
        var last = lastRead.current;
        if (last.mapId === mapId && last.time === timeFilter)
            return;
        readProblems(last.mapId === mapId ? 'closed' : 'all', maps, currentMap, timeFilter);
    }, [problemsReady, mapId, timeFilter]); // eslint-disable-line react-hooks/exhaustive-deps
    var retryProblems = useCallback(function () { return readProblems('all', maps, currentMap, timeFilter); }, [readProblems, maps, currentMap, timeFilter]);
    // The next page of closed problems (older closings)
    var olderBusyRef = useRef(false);
    var loadOlderClosed = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var w, ctx, cSeq, page_1, items_1, lastOlder_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    w = problemWindowRef.current;
                    ctx = problemCtx.current;
                    if (!w.closedNext || olderBusyRef.current || !ctx)
                        return [2 /*return*/];
                    olderBusyRef.current = true;
                    cSeq = closedSeq.current;
                    setProblemWindow(function (x) { return (__assign(__assign({}, x), { olderBusy: true, olderError: '' })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetchProblemPage(w.closedNext, CLOSED_PAGE)];
                case 2:
                    page_1 = _a.sent();
                    if (cSeq !== closedSeq.current)
                        return [2 /*return*/];
                    items_1 = page_1.rows.map(function (r) { return problemFromRow(r, ctx); });
                    // A problem already in the lists (changed here meanwhile) keeps the copy the lists have
                    setSubmissions(function (prev) {
                        var have = {};
                        prev.forEach(function (s) { have[s.id] = true; });
                        return prev.concat(items_1.filter(function (s) { return !have[s.id]; }));
                    });
                    lastOlder_1 = page_1.rows[page_1.rows.length - 1];
                    setProblemWindow(function (x) { return (__assign(__assign({}, x), { olderBusy: false, closedNext: page_1.next, closedCursor: lastOlder_1 ? lastOlder_1.modifiedon || x.closedCursor : x.closedCursor })); });
                    logEvent("Loaded ".concat(items_1.length, " older closed problems."), 'info');
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    if (cSeq !== closedSeq.current)
                        return [2 /*return*/];
                    logEvent("Older closed problems could not be loaded: ".concat(error_4.message), 'error');
                    setProblemWindow(function (x) { return (__assign(__assign({}, x), { olderBusy: false, olderError: error_4.message })); });
                    return [3 /*break*/, 5];
                case 4:
                    olderBusyRef.current = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [logEvent]);
    // A search in Dataverse among the closed problems not loaded yet (closed before the oldest one loaded, inside the
    // timeframe; with anyTime also those submitted before the timeframe); what it finds joins the lists
    var searchOlderClosed = useCallback(function (text, opts) { return __awaiter(_this, void 0, void 0, function () {
        var ctx, words, anyTime, sSeq, cSeq, stale, asked, w, since, notLoaded, mapFilter, extra, url, page, items, have_1, fresh_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx = problemCtx.current;
                    words = String(text || '').trim().split(/\s+/).filter(Boolean).slice(0, 6);
                    if (!ctx || !ctx.select || words.length === 0 || problemWindowRef.current.status === 'loading')
                        return [2 /*return*/];
                    anyTime = !!(opts && opts.anyTime);
                    searchSeq.current += 1;
                    sSeq = searchSeq.current;
                    cSeq = closedSeq.current;
                    stale = function () { return sSeq !== searchSeq.current || cSeq !== closedSeq.current; };
                    asked = words.join(' ');
                    w = problemWindowRef.current;
                    since = timeframeStart(timeFilter);
                    notLoaded = [];
                    if (w.closedNext && w.closedCursor)
                        notLoaded.push(since ? "(createdon ge ".concat(since, " and modifiedon le ").concat(w.closedCursor, ")") : "modifiedon le ".concat(w.closedCursor));
                    if (anyTime && since)
                        notLoaded.push("createdon lt ".concat(since));
                    if (notLoaded.length === 0) {
                        setOlderSearch({ text: asked, anyTime: anyTime, busy: false, found: 0, added: 0, more: false, error: '' });
                        return [2 /*return*/];
                    }
                    setOlderSearch({ text: asked, anyTime: anyTime, busy: true, found: null, added: 0, error: '' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    mapFilter = ctx.splitOff ? '' : problemMapFilter(maps, currentMap);
                    extra = "".concat(problemWordFilter(words), " and ").concat(notLoaded.length > 1 ? "(".concat(notLoaded.join(' or '), ")") : notLoaded[0]);
                    url = "".concat(problemQueryUrl(ctx.select, true, mapFilter, '', extra), "&$top=").concat(OLDER_SEARCH_TOP);
                    return [4 /*yield*/, fetchProblemPage(url, OLDER_SEARCH_TOP)];
                case 2:
                    page = _a.sent();
                    if (stale())
                        return [2 /*return*/];
                    items = page.rows.map(function (r) { return problemFromRow(r, ctx); });
                    have_1 = {};
                    submissionsRef.current.forEach(function (s) { have_1[s.id] = true; });
                    fresh_1 = items.filter(function (s) { return !have_1[s.id]; });
                    setSubmissions(function (prev) {
                        var now = {};
                        prev.forEach(function (s) { now[s.id] = true; });
                        return prev.concat(fresh_1.filter(function (s) { return !now[s.id]; }));
                    });
                    setOlderSearch({ text: asked, anyTime: anyTime, busy: false, found: items.length, added: fresh_1.length, more: items.length >= OLDER_SEARCH_TOP, error: '' });
                    logEvent("Searched the older closed problems for \"".concat(asked, "\": ").concat(items.length, " found, ").concat(fresh_1.length, " added to the lists."), 'info');
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    if (stale())
                        return [2 /*return*/];
                    logEvent("Older closed problems could not be searched: ".concat(error_5.message), 'error');
                    setOlderSearch({ text: asked, anyTime: anyTime, busy: false, found: null, added: 0, error: error_5.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [maps, currentMap, timeFilter, logEvent]);
    // The picture of the map on screen: one download per map; the last one is let go
    useEffect(function () {
        if (!currentMap)
            return undefined;
        var alive = true;
        var url = null;
        setMainMapImage(null);
        setMapPicture({ status: 'loading', note: '', bytes: 0, type: '' });
        logEvent("Downloading the picture of the map ".concat(currentMap.label, "..."), 'debug');
        loadMapPicture(currentMap).then(function (r) {
            if (!alive) {
                if (r.url)
                    URL.revokeObjectURL(r.url);
                return;
            }
            if (r.url) {
                url = r.url;
                setMainMapImage(r.url);
                setMapPicture({ status: 'ready', note: '', bytes: r.bytes, type: r.type });
                logEvent("Success: Map Blob loaded (".concat((r.bytes / 1024).toFixed(2), " KB)."), 'success');
            }
            else {
                setMapPicture({ status: 'none', note: r.note, bytes: 0, type: '' });
                logEvent(r.note, 'warn');
            }
        }).catch(function (error) {
            if (!alive)
                return;
            setMapPicture({ status: 'none', note: "The map picture could not be downloaded (".concat(error.message, ")."), bytes: 0, type: '' });
            logEvent("Map picture download failed: ".concat(error.message), 'error');
        });
        return function () {
            alive = false;
            if (url)
                URL.revokeObjectURL(url);
        };
    }, [currentMap && currentMap.id]); // eslint-disable-line react-hooks/exhaustive-deps
    // A picture the browser cannot show: say so instead of an empty map
    var dropMapImage = useCallback(function () {
        setMainMapImage(null);
        setMapPicture(function (p) { return (__assign(__assign({}, p), { status: 'none', note: 'The map picture was downloaded, but this browser cannot show it (it may not be a picture file). Put a PNG or JPG in the map row\'s Map Image column.' })); });
        logEvent('Browser failed to render the map picture.', 'error');
    }, [logEvent]);
    // Another map from the header's picker: its picture and its problems are read; anything placed on the old map is let go
    var chooseMap = useCallback(function (id) {
        var m = maps.filter(function (x) { return x.id === id; })[0];
        if (!m || m.id === mapId)
            return;
        writePref(MAP_PREF, m.id);
        setEditingItem(null);
        setFocusItem(null);
        // The old map's problems go at once: while the new map's are read (or if that fails) none of them shows on it. Whatever is
        // still being read for the old map (the start-up read too, a Load older, a search) drops its answer.
        closedSeq.current += 1;
        searchSeq.current += 1;
        setSubmissions([]);
        setProblemWindow(function (w) { return (__assign(__assign({}, w), { status: 'loading', error: '', openTotal: null, openCapped: false, closedTotal: null, closedCapped: false, closedNext: null, closedCursor: '', olderBusy: false, olderError: '' })); });
        setOlderSearch({ text: '', busy: false, found: null, added: 0, error: '' });
        setMainMapKey(m.key);
        setMapId(m.id);
        logEvent("Map changed to ".concat(m.label, " (code ").concat(m.key, ")."), 'info');
    }, [maps, mapId, logEvent]);
    // Who is signed in (the header and the Host check)
    useEffect(function () {
        var alive = true;
        readSignedIn().then(function (s) {
            if (!alive)
                return;
            if (s.name)
                SIGNED_IN.name = s.name;
            setSignedIn(__assign(__assign({}, s), { checking: false }));
            if (s.name)
                logEvent("Signed in as ".concat(s.name, " (read from ").concat(s.how, ")."), 'info');
            else
                logEvent("Who is signed in could not be read".concat(s.error ? ": ".concat(s.error) : '.'), 'warn');
        });
        return function () { alive = false; };
    }, [logEvent]);
    useEffect(function () {
        // UI FAILSAFE: Inject Tailwind CSS dynamically
        if (!document.getElementById('tailwind-cdn')) {
            var script = document.createElement('script');
            script.id = 'tailwind-cdn';
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        }
        var initializeData = function () { return __awaiter(_this, void 0, void 0, function () {
            var startTime, host, mapsFound, mapsError, error_6, savedMap_1, firstMap, picColumn, error_7, eqColumns, error_8, fatalError_1, endTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = performance.now();
                        logEvent('App initialized. Building component tree...', 'debug');
                        host = hostContext();
                        if (host) {
                            try {
                                logEvent("Detected Xrm Context. Base URL: ".concat(host.getClientUrl()), 'debug');
                            }
                            catch (e) { /* no address */ }
                        }
                        else {
                            logEvent('Xrm Context not found. Will attempt relative fetch (Dev Mode).', 'warn');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 15, , 16]);
                        mapsFound = [];
                        mapsError = '';
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, loadMapRows()];
                    case 3:
                        mapsFound = _a.sent();
                        logEvent("Maps found: ".concat(mapsFound.map(function (m) { return "".concat(m.label, " (code ").concat(m.key, ")"); }).join(', ') || 'none', "."), mapsFound.length ? 'info' : 'warn');
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        mapsError = error_6.message;
                        logEvent("Map Live Fetch Failed: ".concat(error_6.message), 'error');
                        return [3 /*break*/, 5];
                    case 5:
                        MAP_STATE.mainKey = mapsFound.length ? mapsFound[0].key : 'MAIN';
                        savedMap_1 = readPref(MAP_PREF, '');
                        firstMap = mapsFound.filter(function (m) { return m.id === savedMap_1; })[0] || mapsFound[0] || null;
                        setMaps(mapsFound);
                        if (firstMap) {
                            setMainMapKey(firstMap.key);
                            setMapId(firstMap.id);
                        }
                        else {
                            setMapPicture({ status: 'none', note: mapsError ? "The map list could not be read (".concat(mapsError, ").") : 'No map was found in the maps table (craa5___1_g_maps). Add a row with a Map Image to show the facility map.', bytes: 0, type: '' });
                        }
                        picColumn = { ready: false, name: null, type: null, reason: 'the picture column could not be checked.' };
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, detectPictureColumn(logEvent)];
                    case 7:
                        picColumn = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_7 = _a.sent();
                        picColumn.reason = "the picture column check failed (".concat(error_7.message, ").");
                        logEvent("Picture column check failed: ".concat(error_7.message), 'error');
                        return [3 /*break*/, 9];
                    case 9:
                        setPictureColumn(picColumn);
                        if (picColumn.ready)
                            logEvent("Pictures are stored in column \"".concat(picColumn.name, "\" (").concat(picColumn.type || 'type unknown', ")."), 'info');
                        else
                            logEvent("Pictures cannot be saved: ".concat(picColumn.reason), 'warn');
                        eqColumns = { idColumn: null, equipmentMax: null, idMax: null, reason: 'the equipment columns could not be checked.', idsUnknown: true };
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, detectEquipmentColumns(logEvent)];
                    case 11:
                        eqColumns = _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        error_8 = _a.sent();
                        eqColumns.reason = "the equipment column check failed (".concat(error_8.message, ").");
                        logEvent("Equipment column check failed: ".concat(error_8.message), 'error');
                        return [3 /*break*/, 13];
                    case 13:
                        if (eqColumns.idColumn)
                            logEvent("Equipment ids are stored in column \"".concat(eqColumns.idColumn, "\"."), 'info');
                        else
                            logEvent("Equipment is saved by name only: ".concat(eqColumns.reason), 'warn');
                        // Ask for the picture marker (and the equipment ids) too; a rejected column steps down to a plainer query
                        problemCtx.current = {
                            selectOptions: problemSelectOptions(picColumn, eqColumns.idColumn),
                            select: null,
                            pictureFields: [],
                            idColumn: eqColumns.idColumn,
                            picReady: picColumn.ready,
                            picName: picColumn.name,
                            eqColumns: eqColumns,
                            splitOff: ''
                        };
                        return [4 /*yield*/, readProblems('all', mapsFound, firstMap, 'all')];
                    case 14:
                        _a.sent();
                        setProblemsReady(true);
                        return [3 /*break*/, 16];
                    case 15:
                        fatalError_1 = _a.sent();
                        logEvent("Fatal initialization error: ".concat(fatalError_1.message), 'error');
                        return [3 /*break*/, 16];
                    case 16:
                        endTime = performance.now();
                        setLoadTime((endTime - startTime).toFixed(2));
                        return [2 /*return*/];
                }
            });
        }); };
        initializeData();
    }, []);
    // --- TIMEFRAME FILTERING LOGIC ---
    var timeFilteredSubmissions = useMemo(function () {
        var now = new Date();
        return submissions.filter(function (sub) {
            if (timeFilter === 'all')
                return true;
            var subDate = new Date(sub.submittedOn);
            var diffHours = (now - subDate) / (1000 * 60 * 60);
            if (timeFilter === '24h')
                return diffHours <= 24;
            if (timeFilter === '7d')
                return diffHours <= 24 * 7;
            if (timeFilter === '30d')
                return diffHours <= 24 * 30;
            return true;
        });
    }, [submissions, timeFilter]);
    // --- STATUS, SEARCH AND CATEGORY FILTERING (shared by the map, sidebar, gallery and action rail) ---
    // Header line: everything in the timeframe
    var headerCounts = useMemo(function () {
        var closed = timeFilteredSubmissions.filter(function (sub) { return sub.closed; }).length;
        return { open: timeFilteredSubmissions.length - closed, closed: closed };
    }, [timeFilteredSubmissions]);
    // Search: every typed word must appear somewhere in the item (any field, any order)
    var queryMatches = useMemo(function () {
        var words = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
        if (words.length === 0)
            return timeFilteredSubmissions;
        return timeFilteredSubmissions.filter(function (sub) {
            var text = searchText(sub);
            return words.every(function (w) { return text.includes(w); });
        });
    }, [timeFilteredSubmissions, searchQuery]);
    // Open / Closed / Both counts follow the search and categories (as the category chips follow the search and status)
    var statusCounts = useMemo(function () {
        var pool = categoryFilter.length === 0 ? queryMatches : queryMatches.filter(function (sub) { return categoryFilter.includes(sub.category); });
        var closed = pool.filter(function (sub) { return sub.closed; }).length;
        return { open: pool.length - closed, closed: closed, all: pool.length };
    }, [queryMatches, categoryFilter]);
    var searchedSubmissions = useMemo(function () { return queryMatches.filter(function (sub) {
        if (statusFilter === 'open' && sub.closed)
            return false;
        if (statusFilter === 'closed' && !sub.closed)
            return false;
        return true;
    }); }, [queryMatches, statusFilter]);
    var categoryCounts = useMemo(function () {
        var counts = {};
        searchedSubmissions.forEach(function (sub) { counts[sub.category] = (counts[sub.category] || 0) + 1; });
        return counts;
    }, [searchedSubmissions]);
    var filteredSubmissions = useMemo(function () { return (categoryFilter.length === 0
        ? searchedSubmissions
        : searchedSubmissions.filter(function (sub) { return categoryFilter.includes(sub.category); })); }, [searchedSubmissions, categoryFilter]);
    var closedLoaded = useMemo(function () { return timeFilteredSubmissions.filter(function (s) { return s.closed; }).length; }, [timeFilteredSubmissions]);
    var categoryBar = {
        counts: categoryCounts,
        selected: categoryFilter,
        onToggle: function (key) { return setCategoryFilter(function (prev) { return prev.includes(key) ? prev.filter(function (k) { return k !== key; }) : prev.concat([key]); }); },
        onOnly: function (key) { return setCategoryFilter([key]); },
        onClear: function () { return setCategoryFilter([]); },
        status: statusFilter,
        statusCounts: statusCounts,
        onStatus: setStatusFilter,
        query: searchQuery,
        onQuery: setSearchQuery,
        // true while anything besides the timeframe hides items
        narrowed: categoryFilter.length > 0 || statusFilter !== 'all' || searchQuery.trim() !== '',
        onClearAll: function () { setCategoryFilter([]); setStatusFilter('all'); setSearchQuery(''); },
        // Which problems are loaded (all open ones, closed ones page by page): the lists say so and can load or search older ones
        loaded: { window: problemWindow, closedLoaded: closedLoaded, onLoadOlder: loadOlderClosed, onRetry: retryProblems, search: olderSearch, onSearchOlder: searchOlderClosed, timeFilter: timeFilter }
    };
    // Overview: search and categories as everywhere, then the map's own "Hide closed" switch (not the shared status filter)
    var overviewPool = useMemo(function () { return (hideClosedOnMap ? queryMatches.filter(function (sub) { return !sub.closed; }) : queryMatches); }, [queryMatches, hideClosedOnMap]);
    var overviewCategoryCounts = useMemo(function () {
        var counts = {};
        overviewPool.forEach(function (sub) { counts[sub.category] = (counts[sub.category] || 0) + 1; });
        return counts;
    }, [overviewPool]);
    var overviewSubmissions = useMemo(function () { return (categoryFilter.length === 0 ? overviewPool : overviewPool.filter(function (sub) { return categoryFilter.includes(sub.category); })); }, [overviewPool, categoryFilter]);
    // How many closed items the switch is hiding right now (after the search and categories)
    var hiddenClosedCount = useMemo(function () { return (hideClosedOnMap ? queryMatches.filter(function (sub) { return sub.closed && (categoryFilter.length === 0 || categoryFilter.includes(sub.category)); }).length : 0); }, [queryMatches, categoryFilter, hideClosedOnMap]);
    var overviewBar = __assign(__assign({}, categoryBar), { counts: overviewCategoryCounts, status: null, statusCounts: null, onStatus: null, hideClosed: hideClosedOnMap, hiddenClosed: hiddenClosedCount, onHideClosed: setHideClosedOnMap, narrowed: categoryFilter.length > 0 || searchQuery.trim() !== '', onClearAll: function () { setCategoryFilter([]); setSearchQuery(''); } });
    // Columns read once stay in use while "Check again" (or a column pick) reads them again, so the views (and anything being
    // typed in them) stay put; a failed re-read keeps them and only says so
    var assetMetaGood = useRef(false);
    var loadAssetMeta = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var recheck, m, error_9, probe, uploadFields_1, mapPick_1, pickTaken_1, mapName_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    recheck = assetMetaGood.current;
                    setAssetMeta(function (prev) { return (recheck ? __assign(__assign({}, prev), { rechecking: true, recheckError: '' }) : __assign(__assign({}, prev), { status: 'loading', error: '' })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, loadAssetMetadata(logEvent)];
                case 2:
                    m = _a.sent();
                    assetMetaGood.current = true;
                    setAssetMeta(__assign(__assign({}, m), { status: 'ready', rechecking: false, recheckError: '' }));
                    return [3 /*break*/, 5];
                case 3:
                    error_9 = _a.sent();
                    logEvent("The Assets table's columns could not be read: ".concat(error_9.message), 'error');
                    if (recheck) {
                        setAssetMeta(function (prev) { return (__assign(__assign({}, prev), { rechecking: false, recheckError: error_9.message })); });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, probeAssetRowColumns(ASSET_SET)];
                case 4:
                    probe = _a.sent();
                    uploadFields_1 = inferUploadColumns(probe.keys, {}, null);
                    if (uploadFields_1.length)
                        logEvent("Uploads can still use ".concat(uploadFields_1.map(function (f) { return f.name; }).join(', '), " (found from a one-row read)."), 'info');
                    mapPick_1 = readColumnPick('assetMap');
                    pickTaken_1 = !!mapPick_1 && (mapPick_1 === ASSET_NAME_COLUMN || ASSET_MAP_NOT_THESE.indexOf(mapPick_1) !== -1);
                    mapName_1 = mapPick_1 && !pickTaken_1 ? mapPick_1 : ASSET_MAP_COLUMN;
                    setAssetMeta(function (prev) { return (__assign(__assign({}, prev), { status: 'error', error: error_9.message, fields: uploadFields_1, mapColumn: mapName_1 ? { name: mapName_1, maxLength: null } : null, mapPicked: !!mapPick_1 && mapName_1 === mapPick_1, mapTypedWhy: pickTaken_1 ? 'it holds the equipment\'s own name, room, area or code' : '', mapReason: "the Assets table's columns could not be read (".concat(error_9.message, ").") })); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [logEvent]);
    // Observation pictures: check the table again (after a column was created), or use a column picked on this device
    var _7 = useState(false), pictureChecking = _7[0], setPictureChecking = _7[1];
    var pictureColumnRef = useRef(pictureColumn);
    pictureColumnRef.current = pictureColumn;
    // The loaded issues' picture marks (has a picture, where it is) belong to the column they were read with. After a switch
    // they are read again from the new column, so Remove, a replace warning and the map never act on the old one.
    var reloadPictureMarks = useCallback(function (col) { return __awaiter(_this, void 0, void 0, function () {
        var ctx, adopt, ids, options, _loop_1, k, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marksColumn.current = col.name;
                    // Until the new marks are read, any issue may have a picture there: replacing one asks first
                    setSubmissions(function (prev) { return prev.map(function (sub) { return (sub.image ? sub : __assign(__assign({}, sub), { picture: storedPictureUrls(col.name, sub.id) })); }); });
                    ctx = problemCtx.current;
                    adopt = function (fields) {
                        if (!ctx || marksColumn.current !== col.name)
                            return;
                        ctx.picReady = true;
                        ctx.picName = col.name;
                        if (!ctx.select) {
                            ctx.selectOptions = problemSelectOptions(col, ctx.eqColumns.idColumn);
                            return;
                        }
                        ctx.pictureFields = fields;
                        // The id column of the moment (another one may have been chosen while the marks were read)
                        var extra = fields.concat(ctx.idColumn ? [ctx.idColumn] : []);
                        ctx.select = extra.length ? "".concat(PROBLEM_SELECT, ",").concat(extra.join(',')) : PROBLEM_SELECT;
                        ctx.selectOptions = [extra];
                    };
                    ids = submissionsRef.current.map(function (s) { return s.id; }).filter(function (id) { return GUID_PATTERN.test(id); });
                    options = pictureSelectOptions(col.name, col.type).filter(function (extra) { return extra.length > 0; });
                    _loop_1 = function (k) {
                        var extra, has, refused, start, chunk, which, res, _b, _c, _d, error_10;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    extra = options[k];
                                    has = {};
                                    refused = false;
                                    _f.label = 1;
                                case 1:
                                    _f.trys.push([1, 9, , 10]);
                                    start = 0;
                                    _f.label = 2;
                                case 2:
                                    if (!(start < Math.max(ids.length, 1))) return [3 /*break*/, 8];
                                    chunk = ids.slice(start, start + 50);
                                    which = chunk.length ? "&$filter=".concat(encodeURIComponent(chunk.map(function (id) { return "craa5__facilityobservationid eq ".concat(id); }).join(' or '))) : '&$top=1';
                                    return [4 /*yield*/, fetch(apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "?$select=craa5__facilityobservationid,").concat(extra.join(',')).concat(which)), { headers: ODATA_HEADERS })];
                                case 3:
                                    res = _f.sent();
                                    if (res.status === 400) {
                                        refused = true;
                                        return [3 /*break*/, 8];
                                    }
                                    if (!!res.ok) return [3 /*break*/, 5];
                                    _b = logEvent;
                                    _d = (_c = "The issues' pictures in ".concat(col.name, " could not be read: ")).concat;
                                    return [4 /*yield*/, readApiError(res)];
                                case 4:
                                    _b.apply(void 0, [_d.apply(_c, [_f.sent()]), 'warn']);
                                    adopt([]);
                                    return [2 /*return*/, { value: void 0 }];
                                case 5: return [4 /*yield*/, res.json()];
                                case 6:
                                    ((_f.sent()).value || []).forEach(function (row) { has[row.craa5__facilityobservationid] = rowHasPicture(row, extra); });
                                    _f.label = 7;
                                case 7:
                                    start += 50;
                                    return [3 /*break*/, 2];
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    error_10 = _f.sent();
                                    logEvent("The issues' pictures in ".concat(col.name, " could not be read: ").concat(error_10.message), 'warn');
                                    adopt([]);
                                    return [2 /*return*/, { value: void 0 }];
                                case 10:
                                    if (refused)
                                        return [2 /*return*/, "continue"];
                                    if (marksColumn.current !== col.name)
                                        return [2 /*return*/, { value: void 0 }]; // switched again meanwhile
                                    adopt(extra);
                                    setSubmissions(function (prev) { return prev.map(function (sub) { return (sub.image || !(sub.id in has) || has[sub.id] !== false ? sub : __assign(__assign({}, sub), { picture: null })); }); });
                                    logEvent("Issue pictures now read from ".concat(col.name, "."), 'info');
                                    return [2 /*return*/, { value: void 0 }];
                            }
                        });
                    };
                    k = 0;
                    _a.label = 1;
                case 1:
                    if (!(k < options.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(k)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    k += 1;
                    return [3 /*break*/, 1];
                case 4:
                    adopt([]);
                    logEvent("Could not tell which issues have a picture in ".concat(col.name, "; every issue may show one."), 'warn');
                    return [2 /*return*/];
            }
        });
    }); }, [logEvent]);
    var recheckPictureColumn = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var col, before, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setPictureChecking(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, detectPictureColumn(logEvent)];
                case 2:
                    col = _a.sent();
                    before = pictureColumnRef.current;
                    if (!(!col.ready && col.lookupFailed && before && before.ready)) return [3 /*break*/, 3];
                    // A passing hiccup must not turn off a column that works
                    logEvent("The picture column could not be checked again (".concat(col.reason, "). Still using ").concat(before.name, "."), 'warn');
                    setPictureColumn(__assign(__assign({}, before), { candidates: before.candidates || col.candidates }));
                    return [3 /*break*/, 5];
                case 3:
                    setPictureColumn(col);
                    if (col.ready)
                        logEvent("Pictures are stored in column \"".concat(col.name, "\" (").concat(col.type || 'type unknown', ")."), 'info');
                    if (!(col.ready && col.name !== marksColumn.current)) return [3 /*break*/, 5];
                    return [4 /*yield*/, reloadPictureMarks(col)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_11 = _a.sent();
                    logEvent("Picture column check failed: ".concat(error_11.message), 'error');
                    return [3 /*break*/, 7];
                case 7:
                    setPictureChecking(false);
                    return [2 /*return*/];
            }
        });
    }); }, [logEvent, reloadPictureMarks]);
    var pickPictureColumn = useCallback(function (name) { writeColumnPick('obsPicture', name); recheckPictureColumn(); }, [recheckPictureColumn]);
    var pictureFix = useMemo(function () { return ({ recheck: recheckPictureColumn, pick: pickPictureColumn, checking: pictureChecking, typed: readColumnPick('obsPicture') }); }, [recheckPictureColumn, pickPictureColumn, pictureChecking]);
    // The equipment id column: check the table again (after it was created), or use one picked or typed on this device. Another
    // column means the problems are read again, so the equipment of each one comes from it.
    var _8 = useState(false), equipmentChecking = _8[0], setEquipmentChecking = _8[1];
    var _9 = useState(''), equipmentCheckError = _9[0], setEquipmentCheckError = _9[1];
    var equipmentColumnsRef = useRef(equipmentColumns);
    equipmentColumnsRef.current = equipmentColumns;
    // The map and timeframe on screen when the check is done (they may change while the table is asked)
    var readArgsRef = useRef(null);
    readArgsRef.current = { maps: maps, currentMap: currentMap, timeFilter: timeFilter };
    var recheckEquipmentColumns = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var eq, before, ctx, pic, now, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setEquipmentChecking(true);
                    setEquipmentCheckError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, detectEquipmentColumns(logEvent)];
                case 2:
                    eq = _a.sent();
                    before = equipmentColumnsRef.current;
                    ctx = problemCtx.current;
                    if (!(eq.lookupFailed && !eq.idColumn && before && before.idColumn)) return [3 /*break*/, 3];
                    // A passing hiccup must not turn off a column that works
                    logEvent("The equipment id column could not be checked again (".concat(eq.reason, "). Still using ").concat(before.idColumn, "."), 'warn');
                    setEquipmentCheckError(eq.reason);
                    return [3 /*break*/, 6];
                case 3:
                    if (!(!ctx || (ctx.select && eq.idColumn === ctx.idColumn))) return [3 /*break*/, 4];
                    // The same column as now (or nothing read yet): only what is said about it changes
                    setEquipmentColumns(eq);
                    if (ctx)
                        ctx.eqColumns = eq;
                    return [3 /*break*/, 6];
                case 4:
                    pic = pictureColumnRef.current;
                    ctx.eqColumns = eq;
                    ctx.select = null;
                    ctx.selectOptions = problemSelectOptions(pic && pic.ready ? pic : { ready: false }, eq.idColumn);
                    // The picture column chosen last (its marks may still be on their way): the read below asks for it
                    if (pic && pic.ready) {
                        ctx.picReady = true;
                        ctx.picName = pic.name;
                    }
                    // Until the read gives the new column, the issues on screen hold the old one's ids: none are written meanwhile
                    ctx.idsPending = true;
                    setEquipmentColumns(eq.idColumn ? __assign(__assign({}, eq), { idColumn: null, idsUnknown: true, reason: "the problems are being read again with ".concat(eq.idColumn, ".") }) : eq);
                    logEvent(eq.idColumn ? "Equipment ids now read from ".concat(eq.idColumn, "; reading the problems again.") : 'No equipment id column now; reading the problems again.', 'info');
                    now = readArgsRef.current;
                    return [4 /*yield*/, readProblems('all', now.maps, now.currentMap, now.timeFilter)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_12 = _a.sent();
                    logEvent("Equipment column check failed: ".concat(error_12.message), 'error');
                    setEquipmentCheckError(error_12.message);
                    return [3 /*break*/, 8];
                case 8:
                    setEquipmentChecking(false);
                    return [2 /*return*/];
            }
        });
    }); }, [logEvent, readProblems]);
    var pickEquipmentColumn = useCallback(function (name) { writeColumnPick('obsEquipmentIds', name); recheckEquipmentColumns(); }, [recheckEquipmentColumns]);
    var equipmentFix = useMemo(function () { return ({ recheck: recheckEquipmentColumns, pick: pickEquipmentColumn, checking: equipmentChecking, error: equipmentCheckError }); }, [recheckEquipmentColumns, pickEquipmentColumn, equipmentChecking, equipmentCheckError]);
    // What the Bulk Upload tab needs to make issues (observations) from pictures, or add a picture to an issue
    var onIssueSaved = useCallback(function (item, isNew) {
        savedHere(isNew ? item : { id: item.id }, function (prev) { return (isNew
            ? [item].concat(prev.filter(function (sub) { return sub.id !== item.id; }))
            : prev.map(function (sub) { return (sub.id === item.id ? __assign(__assign({}, sub), item) : sub); })); });
    }, [savedHere]);
    var showIssue = useCallback(function (item) { setFocusItem(item); setActiveTab('overview'); }, []);
    var openAssetView = useCallback(function (v) { return setActiveTab(ASSET_VIEW_TABS[v] || 'assetmap'); }, []);
    // closedMore: older closed issues are not loaded, so a search can also ask Dataverse (searchOlder)
    // timeNarrowed: the header's timeframe leaves out closed issues submitted before it (the search can look there too)
    var closedMore = !!problemWindow.closedNext;
    var timeNarrowed = timeFilter !== 'all';
    var problemsLoading = problemWindow.status === 'loading';
    var issueKit = useMemo(function () { return ({
        submissions: submissions,
        pictureColumn: pictureColumn,
        pictureFix: pictureFix,
        equipmentColumns: equipmentColumns,
        equipmentFix: equipmentFix,
        mapImage: mainMapImage, mapKey: mainMapKey,
        onIssueSaved: onIssueSaved,
        onShowIssue: showIssue,
        closedMore: closedMore,
        timeNarrowed: timeNarrowed,
        problemsLoading: problemsLoading,
        searchOlder: searchOlderClosed,
        olderSearch: olderSearch
    }); }, [submissions, pictureColumn, pictureFix, equipmentColumns, equipmentFix, mainMapImage, mainMapKey, onIssueSaved, showIssue, closedMore, timeNarrowed, problemsLoading, searchOlderClosed, olderSearch]);
    // Placed equipment (the Asset Map and the Overview's Equipment layer share it). Spots saved while the pages are still coming
    // in win over what those pages said.
    var assetMapColumn = assetMeta.mapColumn ? assetMeta.mapColumn.name : null;
    var assetMetaDone = assetMeta.status === 'ready' || assetMeta.status === 'error';
    var pinSaves = useRef(null);
    var pinReq = useRef(0); // the newest pin load: an older one (another map column) is dropped when it ends
    var loadPins = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var req, r, saved_1, savedRows, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!assetMapColumn)
                        return [2 /*return*/];
                    pinReq.current += 1;
                    req = pinReq.current;
                    pinSaves.current = {};
                    setAssetPins(function (p) { return (__assign(__assign({}, p), { status: 'loading', error: '' })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadAssetPins(assetMeta.entitySet || ASSET_SET, assetMapColumn, logEvent)];
                case 2:
                    r = _a.sent();
                    if (req !== pinReq.current)
                        return [2 /*return*/];
                    saved_1 = pinSaves.current || {};
                    pinSaves.current = null;
                    savedRows = Object.keys(saved_1).map(function (id) { return saved_1[id]; }).filter(function (p) { return p.location; });
                    setAssetPins({ status: 'ready', rows: r.rows.filter(function (p) { return !saved_1[p.id]; }).concat(savedRows), capped: r.capped, error: '' });
                    return [3 /*break*/, 4];
                case 3:
                    error_13 = _a.sent();
                    if (req !== pinReq.current)
                        return [2 /*return*/];
                    pinSaves.current = null;
                    logEvent("Placed assets could not be loaded: ".concat(error_13.message), 'error');
                    setAssetPins(function (p) { return (__assign(__assign({}, p), { status: 'error', error: error_13.message })); });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [assetMeta.entitySet, assetMapColumn, logEvent]);
    // Another map column (picked on this device, or created and checked again): the pins are read again from it, and a load
    // from the old column still running is dropped. Done while rendering (not in an effect), so the views' effects, which run
    // before this component's, never start a load that this would then drop.
    var _10 = useState(assetMapColumn), pinColumn = _10[0], setPinColumn = _10[1];
    if (pinColumn !== assetMapColumn) {
        setPinColumn(assetMapColumn);
        pinReq.current += 1;
        pinSaves.current = null;
        setAssetPins({ status: 'idle', rows: [], capped: false, error: '' });
    }
    // The Overview's Equipment layer: the columns, then the pins, only once it is switched on
    var equipmentLayerWanted = activeTab === 'overview' && layers.equipment;
    useEffect(function () {
        if (!equipmentLayerWanted)
            return;
        if (assetMeta.status === 'idle')
            loadAssetMeta();
        else if (assetMetaDone && assetMapColumn && assetPins.status === 'idle')
            loadPins();
    }, [equipmentLayerWanted, assetMeta.status, assetMetaDone, assetMapColumn, assetPins.status, loadAssetMeta, loadPins]);
    var overviewPins = useMemo(function () { return (layers.equipment ? assetPins.rows.filter(function (p) { return pinOnMap(p.location, mainMapKey); }) : []); }, [layers.equipment, assetPins.rows, mainMapKey]);
    var equipmentLayer = useMemo(function () {
        if (!layers.equipment)
            return { status: 'off', note: '' };
        if (assetMeta.status === 'idle' || assetMeta.status === 'loading' || (assetMapColumn && (assetPins.status === 'idle' || assetPins.status === 'loading')))
            return { status: 'loading', note: 'Loading equipment...' };
        if (!assetMapColumn)
            return { status: 'none', note: "Equipment cannot be drawn: ".concat(assetMeta.mapReason || 'the assets table has no map spot column.') };
        if (assetPins.status === 'error')
            return { status: 'error', note: "Equipment could not be loaded: ".concat(assetPins.error) };
        return { status: 'ready', note: assetPins.capped ? "Only the first ".concat(assetPins.rows.length, " placed pieces are drawn.") : '' };
    }, [layers.equipment, assetMeta.status, assetMeta.mapReason, assetMapColumn, assetPins.status, assetPins.error, assetPins.capped, assetPins.rows.length]);
    var openAssetOnMap = useCallback(function (id) {
        setAssetFocusRequest(function (prev) { return ({ id: id, n: prev ? prev.n + 1 : 1 }); });
        setActiveTab('assetmap');
        logEvent("Opening asset ".concat(id, " on the Asset Map."), 'info');
    }, [logEvent]);
    // Close or reopen one observation. Resolves to '' when saved, else the reason it was not.
    var setItemClosed = useCallback(function (item, closed) { return __awaiter(_this, void 0, void 0, function () {
        var when_1, who_1, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, saveStatus(item.id, closed, logEvent)];
                case 1:
                    _a.sent();
                    when_1 = new Date().toISOString();
                    who_1 = currentUserName();
                    savedHere({ id: item.id }, function (prev) { return prev.map(function (s) { return (s.id === item.id ? __assign(__assign({}, s), { closed: closed, statusReason: '', modifiedOn: when_1, modifiedBy: who_1 }) : s); }); });
                    logEvent("Observation ".concat(item.id, " ").concat(closed ? 'closed' : 'reopened', "."), 'success');
                    return [2 /*return*/, ''];
                case 2:
                    error_14 = _a.sent();
                    logEvent("Could not ".concat(closed ? 'close' : 'reopen', " ").concat(item.id, ": ").concat(error_14.message), 'error', { id: item.id, closed: closed });
                    return [2 /*return*/, error_14.message];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [logEvent]);
    // Latest copy of every observation by id, so an open details window shows a change (closed, reopened) straight away
    // even when the filters now hide that item
    var liveItems = useMemo(function () {
        var byId = {};
        submissions.forEach(function (s) { byId[s.id] = s; });
        return byId;
    }, [submissions]);
    // The Dataverse address the requests go to (the host's, else this page's own); no line when neither is known
    var hostLine = useMemo(function () {
        var host = '';
        try {
            var g = hostContext();
            host = g ? new URL(g.getClientUrl()).host : window.location.host;
        }
        catch (e) {
            host = '';
        }
        return host ? "Host: ".concat(host, "\n") : '';
    }, []);
    // Group logs for the 3 columns
    var infoLogs = logs.filter(function (l) { return l.type === 'info' || l.type === 'success'; }).reverse();
    var debugLogs = logs.filter(function (l) { return l.type === 'debug' || l.type === 'warn' || l.type === 'error'; }).reverse();
    var dataLogs = logs.filter(function (l) { return l.type === 'data'; }).reverse();
    var _11 = useState(false), logoUnlocked = _11[0], setLogoUnlocked = _11[1];
    var _12 = useState(0), guideSlideIdx = _12[0], setGuideSlideIdx = _12[1];
    var toggleLogoUnlock = function () {
        setLogoUnlocked(function (prev) {
            var next = !prev;
            if (next)
                setActiveTab('guide');
            else if (activeTab === 'guide')
                setActiveTab('overview');
            return next;
        });
    };
    var appRootRef = useRef(null);
    var _13 = useState(function () {
        try {
            return window.localStorage.getItem('__1_' + 'MidwestPlant_mst_dark_v1') === 'dark';
        }
        catch (_e) {
            return false;
        }
    }), isDark = _13[0], setIsDark = _13[1];
    useEffect(function () {
        try {
            window.localStorage.setItem('__1_' + 'MidwestPlant_mst_dark_v1', isDark ? 'dark' : 'light');
        }
        catch (_e) { /* ignore */ }
    }, [isDark]);
    var _14 = useState(function () {
        try {
            return window.localStorage.getItem('__1_' + 'MidwestPlant_mst_lang_v1') === 'es' ? 'es' : 'en';
        }
        catch (_e) {
            return 'en';
        }
    }), lang = _14[0], setLang = _14[1];
    useEffect(function () {
        try {
            window.localStorage.setItem('__1_' + 'MidwestPlant_mst_lang_v1', lang);
        }
        catch (_e) { /* ignore */ }
    }, [lang]);
    var _15 = useState(function () { return readMidwestPlantMsUser(); }), msUser = _15[0], setMsUser = _15[1];
    var _16 = useState(false), msUserModalOpen = _16[0], setMsUserModalOpen = _16[1];
    var _17 = useState(''), draftMsName = _17[0], setDraftMsName = _17[1];
    var _18 = useState(''), draftMsId = _18[0], setDraftMsId = _18[1];
    useEffect(function () {
        if (signedIn && signedIn.name) {
            var uMatch = String(signedIn.name || '').match(/u\d{6,8}/i);
            var msId = signedIn.microsoftId || (uMatch ? uMatch[0].toUpperCase() : (signedIn.id ? String(signedIn.id).slice(0, 8).toUpperCase() : ''));
            var nextUser = {
                userName: signedIn.name,
                microsoftId: msId,
                source: signedIn.how ? "Dataverse (".concat(signedIn.how, ")") : 'Dataverse Session'
            };
            setMsUser(nextUser);
            try {
                window.localStorage.setItem('__1_' + 'MidwestPlant_active_ms_user_v1', JSON.stringify(nextUser));
            }
            catch (_e) { /* ignore */ }
        }
    }, [signedIn]);
    useEffect(function () {
        if (!appRootRef.current)
            return;
        applyDomTranslation(appRootRef.current, lang);
        if (lang !== 'es')
            return;
        var obs = new MutationObserver(function () {
            if (appRootRef.current)
                applyDomTranslation(appRootRef.current, 'es');
        });
        // characterData: React changing a text in place (a count, a name) is translated too; attributes: placeholders and titles
        obs.observe(appRootRef.current, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TRANSLATED_ATTRIBUTES });
        return function () { return obs.disconnect(); };
    }, [lang]);
    // The app zoom scales vh as well: the height is divided by it, so the app always fills exactly one screen (no bar falls
    // off the bottom when zoomed in, no empty band when zoomed out)
    return (React.createElement("div", { ref: appRootRef, className: "flex flex-col h-screen w-full bg-[#F7F9FC] text-slate-900 overflow-hidden ".concat(isDark ? 'mst-dark' : ''), style: { zoom: "".concat(globalZoom, "%"), height: "".concat((10000 / globalZoom).toFixed(3), "vh"), fontFamily: BRAND_FONT } },
        React.createElement("style", null, "\n        .mst-dark { background-color: #0b1120 !important; color: #f1f5f9 !important; }\n        .mst-dark header, .mst-dark nav { background-color: #0f172a !important; border-color: #1e293b !important; color: #f8fafc !important; }\n        .mst-dark .bg-white { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #334155 !important; }\n        .mst-dark .bg-\\[\\#F7F9FC\\], .mst-dark .bg-slate-50, .mst-dark .bg-slate-100 { background-color: #0f172a !important; color: #e2e8f0 !important; border-color: #334155 !important; }\n        .mst-dark .bg-\\[\\#E6F1FB\\] { background-color: #1e3a5f !important; color: #e0f2fe !important; }\n        .mst-dark .text-slate-900, .mst-dark .text-slate-800, .mst-dark .text-slate-700, .mst-dark .text-\\[\\#00468B\\] { color: #f8fafc !important; }\n        .mst-dark .text-slate-600, .mst-dark .text-slate-500, .mst-dark .text-slate-400 { color: #94a3b8 !important; }\n        .mst-dark .border-slate-100, .mst-dark .border-slate-200, .mst-dark .border-slate-300 { border-color: #334155 !important; }\n        .mst-dark input, .mst-dark select, .mst-dark textarea { background-color: #0f172a !important; color: #f8fafc !important; border-color: #475569 !important; }\n      "),
        React.createElement("header", { className: "bg-white border-b-4 border-[#FFB81C] shrink-0 z-[100]" },
            React.createElement("div", { className: "px-4 sm:px-7 min-h-[72px] py-2 flex flex-wrap items-center justify-between gap-4" },
                React.createElement("div", { className: "min-w-0 flex flex-wrap items-center gap-3" },
                    React.createElement("div", null,
                        React.createElement("h1", { className: "text-base sm:text-lg font-black text-[#00468B] leading-tight tracking-tight sm:truncate" }, APP_TITLE),
                        React.createElement("p", { className: "text-[11px] font-bold text-slate-500 leading-snug sm:truncate", "data-testid": "header-line" },
                            signedIn.name ? React.createElement("span", { "data-testid": "signed-in" },
                                "Signed in as ",
                                signedIn.name,
                                " - ") : null,
                            headerCounts.open,
                            " open - ",
                            problemWindow.closedNext && problemWindow.closedTotal !== null
                                ? "".concat(headerCounts.closed, " ").concat(lang === 'es' ? 'de' : 'of', " ").concat(problemWindow.closedTotal).concat(problemWindow.closedCapped ? '+' : '', " ").concat(lang === 'es' ? 'cerrados cargados' : 'closed loaded')
                                : "".concat(headerCounts.closed, " ").concat(lang === 'es' ? 'cerrados' : 'closed'),
                            problemWindow.status === 'loading' ? ' - loading...' : '')),
                    React.createElement("button", { type: "button", "data-no-translate": "true", onClick: function () {
                            setDraftMsName(msUser.userName || '');
                            setDraftMsId(msUser.microsoftId || '');
                            setMsUserModalOpen(true);
                        }, title: "Active Microsoft / Dataverse Identity - Click to inspect or update", className: "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border shadow-sm cursor-pointer ".concat(isDark
                            ? 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
                            : 'bg-[#FFF8E7] text-[#002855] border-[#FFB81C] hover:bg-[#FFF0C8]') },
                        React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
                        React.createElement("span", null, lang === 'es'
                            ? "Bienvenido(a)".concat(msUser.userName ? " ".concat(msUser.userName) : '').concat(msUser.microsoftId ? " (".concat(msUser.microsoftId, ")") : '', " a Map Submission Tool")
                            : "Welcome".concat(msUser.userName ? " ".concat(msUser.userName) : '').concat(msUser.microsoftId ? " (".concat(msUser.microsoftId, ")") : '', " to Map Submission Tool")))),
                React.createElement("div", { className: "flex flex-wrap items-center gap-2.5 shrink-0" },
                    maps.length > 1 && (React.createElement("label", { className: "flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-[#B3D4F2]", title: "Which facility map to show. Each map has its own problems and equipment." },
                        React.createElement(MapIcon, { className: "w-4 h-4 text-[#0072CE] shrink-0" }),
                        React.createElement("span", { className: "sr-only" }, "Map"),
                        React.createElement("select", { value: mapId || '', onChange: function (e) { return chooseMap(e.target.value); }, "aria-label": "Map", "data-testid": "map-picker", className: "bg-transparent text-sm font-bold text-[#00468B] focus:outline-none cursor-pointer max-w-[10rem]" }, maps.map(function (m) { return React.createElement("option", { key: m.id, value: m.id }, m.label); })))),
                    React.createElement(BrandLogo, { onClick: toggleLogoUnlock, unlocked: logoUnlocked }),
                    React.createElement("div", { "data-no-translate": "true", className: "inline-flex items-center rounded-xl p-1 border shadow-inner ".concat(isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'), role: "group", "aria-label": "Theme mode toggle" },
                        React.createElement("button", { type: "button", onClick: function () { return setIsDark(false); }, className: "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ".concat(!isDark
                                ? 'bg-[#00468B] text-white shadow-sm'
                                : 'text-slate-400 hover:text-white') }, lang === 'es' ? 'Claro' : 'Light'),
                        React.createElement("button", { type: "button", onClick: function () { return setIsDark(true); }, className: "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ".concat(isDark
                                ? 'bg-[#FFB81C] text-[#002855] shadow-sm'
                                : 'text-slate-600 hover:text-slate-900') }, lang === 'es' ? 'Oscuro' : 'Dark')),
                    React.createElement("div", { "data-no-translate": "true", className: "inline-flex items-center rounded-xl p-1 border shadow-inner ".concat(isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'), role: "group", "aria-label": "Language translator toggle" },
                        React.createElement("button", { type: "button", onClick: function () { return setLang('en'); }, className: "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ".concat(lang === 'en'
                                ? 'bg-[#00468B] text-white shadow-sm'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900') }, "English"),
                        React.createElement("button", { type: "button", onClick: function () { return setLang('es'); }, className: "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ".concat(lang === 'es'
                                ? 'bg-[#C8102E] text-white shadow-sm'
                                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900') }, "Espanol (MX)"))))),
        msUserModalOpen && (React.createElement("div", { className: "fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4", onClick: function () { return setMsUserModalOpen(false); } },
            React.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4", onClick: function (e) { return e.stopPropagation(); }, "data-no-translate": "true" },
                React.createElement("div", { className: "flex items-center justify-between border-b border-slate-200 pb-3" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-sm font-black uppercase tracking-wider text-[#00468B]" }, lang === 'es' ? 'Identidad de Microsoft / Dataverse' : 'Microsoft / Dataverse Identity'),
                        React.createElement("p", { className: "text-[11px] font-semibold text-slate-500 mt-0.5" }, msUser.source || 'Xrm.Utility.getGlobalContext().userSettings')),
                    React.createElement("button", { type: "button", onClick: function () { return setMsUserModalOpen(false); }, className: "px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200" }, lang === 'es' ? 'Cerrar' : 'Close')),
                React.createElement("div", { className: "space-y-3" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1" }, lang === 'es' ? 'Nombre para Mostrar' : 'Display Name'),
                        React.createElement("input", { type: "text", value: draftMsName, onChange: function (e) { return setDraftMsName(e.target.value); }, placeholder: "First Last", className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1" }, lang === 'es' ? 'ID Corporativo de Microsoft (U-ID / Correo)' : 'Microsoft Corporate ID (U-ID / Email)'),
                        React.createElement("input", { type: "text", value: draftMsId, onChange: function (e) { return setDraftMsId(e.target.value); }, placeholder: "U0000000", className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono font-bold text-slate-800" }))),
                React.createElement("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-200" },
                    React.createElement("button", { type: "button", onClick: function () {
                            try {
                                window.localStorage.removeItem('__1_' + 'MidwestPlant_active_ms_user_v1');
                            }
                            catch (_e) { /* ignore */ }
                            setMsUser(readMidwestPlantMsUser());
                            setMsUserModalOpen(false);
                        }, className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200" }, lang === 'es' ? 'Restablecer desde Xrm' : 'Reset from Xrm'),
                    React.createElement("button", { type: "button", onClick: function () {
                            var next = {
                                userName: String(draftMsName || '').trim(),
                                microsoftId: String(draftMsId || '').trim(),
                                source: 'Saved Microsoft User Profile'
                            };
                            setMsUser(next);
                            try {
                                window.localStorage.setItem('__1_' + 'MidwestPlant_active_ms_user_v1', JSON.stringify(next));
                            }
                            catch (_e) { /* ignore */ }
                            setMsUserModalOpen(false);
                        }, className: "px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#00468B] text-white hover:bg-[#003366]" }, lang === 'es' ? 'Guardar Identidad' : 'Save Identity'))))),
        React.createElement("nav", { className: "bg-white border-b border-slate-200 shrink-0 z-[90]" },
            React.createElement("div", { className: "px-3 sm:px-6 py-2 flex flex-wrap items-center gap-x-4 gap-y-2" },
                React.createElement("div", { className: "flex gap-1 overflow-x-auto flex-1 min-w-[260px] md:flex-none md:flex-wrap md:overflow-visible md:max-w-full", role: "tablist", "aria-label": "Views" },
                    React.createElement(TabButton, { active: activeTab === 'overview', onClick: function () { setActiveTab('overview'); logEvent('Navigated to Map Overview tab', 'info'); }, icon: React.createElement(MapIcon, null), label: "Overview" }),
                    React.createElement(TabButton, { active: activeTab === 'submit', onClick: function () { setActiveTab('submit'); logEvent('Navigated to Submit Map tab', 'info'); }, icon: React.createElement(MapPin, null), label: "Map Submission" }),
                    React.createElement(TabButton, { active: activeTab === 'assetmap', onClick: function () { setActiveTab('assetmap'); logEvent('Navigated to Asset Map tab', 'info'); }, icon: React.createElement(BoxIcon, null), label: "Asset Map" }),
                    React.createElement(TabButton, { active: activeTab === 'assettable', onClick: function () { setActiveTab('assettable'); logEvent('Navigated to Asset Management tab', 'info'); }, icon: React.createElement(WrenchIcon, null), label: "Asset Management" }),
                    React.createElement(TabButton, { active: activeTab === 'bulk', onClick: function () { setActiveTab('bulk'); logEvent('Navigated to Bulk Upload tab', 'info'); }, icon: React.createElement(UploadIcon, null), label: "Bulk Upload" }),
                    React.createElement(TabButton, { active: activeTab === 'gallery', onClick: function () { setActiveTab('gallery'); logEvent('Navigated to Gallery View tab', 'info'); }, icon: React.createElement(ImageIcon, null), label: "Gallery" }),
                    React.createElement(TabButton, { active: activeTab === 'table', onClick: function () { setActiveTab('table'); logEvent('Navigated to Data Table tab', 'info'); }, icon: React.createElement(TableIcon, null), label: "Data Table" }),
                    (logoUnlocked || activeTab === 'guide') && (React.createElement(TabButton, { active: activeTab === 'guide', onClick: function () { setActiveTab('guide'); logEvent('Navigated to Picture Guide tab', 'info'); }, icon: React.createElement(MapIcon, null), label: "Picture Guide" }))),
                React.createElement("div", { className: "flex items-center gap-2 shrink-0 flex-wrap md:ml-auto" },
                    React.createElement("label", { className: "flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#B3D4F2]" },
                        React.createElement(FilterIcon, { className: "w-4 h-4 text-[#0072CE]" }),
                        React.createElement("span", { className: "sr-only" }, "Timeframe"),
                        React.createElement("select", { value: timeFilter, onChange: function (e) { return setTimeFilter(e.target.value); }, className: "bg-transparent text-sm font-bold text-[#00468B] focus:outline-none cursor-pointer" },
                            React.createElement("option", { value: "all" }, "All Time"),
                            React.createElement("option", { value: "24h" }, "Last 24h"),
                            React.createElement("option", { value: "7d" }, "Last 7 Days"),
                            React.createElement("option", { value: "30d" }, "Last 30 Days"))),
                    React.createElement("div", { className: "hidden md:flex items-center gap-1 bg-white px-1.5 py-1 rounded-lg border border-[#B3D4F2]" },
                        React.createElement("button", { onClick: function () { return setGlobalZoom(function (z) { return Math.max(50, z - 10); }); }, className: "p-1 hover:bg-[#E6F1FB] text-[#0072CE] rounded transition-colors", title: "Zoom Out App" },
                            React.createElement(ZoomOut, { className: "w-4 h-4" })),
                        React.createElement("span", { className: "text-xs font-bold text-[#00468B] min-w-[3rem] text-center" },
                            globalZoom,
                            "%"),
                        React.createElement("button", { onClick: function () { return setGlobalZoom(function (z) { return Math.min(200, z + 10); }); }, className: "p-1 hover:bg-[#E6F1FB] text-[#0072CE] rounded transition-colors", title: "Zoom In App" },
                            React.createElement(ZoomIn, { className: "w-4 h-4" }))),
                    React.createElement("button", { onClick: function () {
                            setAdminOpen(!adminOpen);
                            if (!adminOpen)
                                logEvent('Admin monitor opened', 'info');
                        }, title: adminOpen ? 'Close Debug' : 'Debug', "aria-label": adminOpen ? 'Close Debug' : 'Debug', className: "flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors text-xs uppercase tracking-wider ".concat(adminOpen ? 'bg-[#FFB81C] text-slate-900 hover:bg-[#f5aa00]' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300') },
                        React.createElement(Terminal, { className: "w-4 h-4" }),
                        React.createElement("span", { className: adminOpen ? '' : 'hidden 2xl:inline' }, adminOpen ? 'Close Debug' : 'Debug'))))),
        React.createElement("main", { className: "flex-1 overflow-hidden relative transition-all duration-300 ".concat(adminOpen ? 'pb-[40vh]' : 'pb-0') },
            activeTab === 'overview' && (React.createElement(OverviewTab, { submissions: overviewSubmissions, categoryBar: overviewBar, logEvent: logEvent, mapImage: mainMapImage, setMainMapImage: dropMapImage, mapPicture: mapPicture, layers: layers, onLayers: changeLayers, pins: overviewPins, equipmentLayer: equipmentLayer, onOpenAsset: openAssetOnMap, focusItem: focusItem, setFocusItem: setFocusItem, onEdit: function (item) { setEditingItem(item); setActiveTab('submit'); }, onSetClosed: setItemClosed, liveItems: liveItems })),
            activeTab === 'submit' && (React.createElement(SubmitTab, { key: mainMapKey, submissions: timeFilteredSubmissions, savedHere: savedHere, logEvent: logEvent, mapImage: mainMapImage, setMainMapImage: dropMapImage, mapNote: mapPicture.note, mapKey: mainMapKey, editingItem: editingItem, setEditingItem: setEditingItem, pictureColumn: pictureColumn, pictureFix: pictureFix, equipmentColumns: equipmentColumns })),
            (assetView || assetsOpened) && (React.createElement("div", { className: assetView ? 'h-full' : 'hidden' },
                React.createElement(AssetsTab, { view: assetView || 'map', onView: openAssetView, mapImage: mainMapImage, setMainMapImage: dropMapImage, mapNote: mapPicture.note, mapKey: mainMapKey, assetMeta: assetMeta, loadAssetMeta: loadAssetMeta, assetPins: assetPins, setAssetPins: setAssetPins, loadPins: loadPins, pinSaves: pinSaves, focusRequest: assetFocusRequest, issueKit: issueKit, logEvent: logEvent }))),
            activeTab === 'gallery' && (React.createElement(GalleryTab, { submissions: filteredSubmissions, categoryBar: categoryBar, logEvent: logEvent, onEdit: function (item) { setEditingItem(item); setActiveTab('submit'); }, onSetClosed: setItemClosed, liveItems: liveItems })),
            activeTab === 'table' && (React.createElement(TableTab, { submissions: filteredSubmissions, timeFilteredCount: timeFilteredSubmissions.length, timeFilter: timeFilter, categoryBar: categoryBar, mapImage: mainMapImage, logEvent: logEvent, onLocate: function (item) { setFocusItem(item); setActiveTab('overview'); }, onEdit: function (item) { setEditingItem(item); setActiveTab('submit'); }, onSetClosed: setItemClosed, liveItems: liveItems })),
            activeTab === 'guide' && (React.createElement("div", { className: "h-full overflow-y-auto p-4 sm:p-6" }, (function () {
                var slides = [
                    {
                        id: 'overview',
                        badge: 'Screen 1 - Overview Map & Map Submission',
                        title: 'Facility Floor Plan Pins, Layer Filters & New Observation Submission',
                        subtitle: 'Drop pins on the plant floor map to report facility observations, attach photos, and link equipment.',
                        callouts: [
                            { num: '1', title: 'Interactive Floor Map & Layer Toggles', desc: 'Pan and zoom across the Midwest Plant facility map. Toggle Problem Pins, Closed items, or Equipment Pins on and off.' },
                            { num: '2', title: 'Category Filter Bar', desc: 'Filter observations by category (Safety, Sanitation, Maintenance, Quality) or Open/Closed status.' },
                            { num: '3', title: 'Map Submission Tab', desc: 'Click anywhere on the map to drop a pin, select the Area/Room, attach a photo, link affected Equipment, and submit to Dataverse.' },
                            { num: '4', title: 'Map Picker & Apex Foods Logo', desc: 'Switch between facility maps if multiple maps exist, or click the Apex Foods logo to toggle this Picture Guide.' }
                        ]
                    },
                    {
                        id: 'assets',
                        badge: 'Screen 2 - Asset Map, Asset Management & Bulk Upload',
                        title: 'Equipment Pin Placement, Asset Table Editing & CSV Bulk Upload',
                        subtitle: 'Place equipment from craa5___1_a_assets onto the floor map and manage asset attributes.',
                        callouts: [
                            { num: '1', title: 'Asset Map Pinning', desc: 'Pick an unplaced equipment asset from the list and click the floor plan to save its exact (X, Y) coordinates on the map.' },
                            { num: '2', title: 'Asset Management Table', desc: 'Search, filter, create, or edit equipment rows in craa5___1_a_assets (Equipment Identifier, Room, Area, Hours Required, Allergen Mins, Heads).' },
                            { num: '3', title: 'Bulk Upload Tab', desc: 'Upload or paste CSV/spreadsheet rows to batch-create or update equipment records in Dataverse.' },
                            { num: '4', title: 'Report Problem on Asset', desc: 'Click any pinned asset on the map to open a pre-filled observation submission linked to that piece of equipment.' }
                        ]
                    },
                    {
                        id: 'gallery',
                        badge: 'Screen 3 - Photo Gallery, Data Table & Debug Console',
                        title: 'Visual Photo Cards, Tabular Export & Live Dataverse Monitor',
                        subtitle: 'Review submitted photos in a grid, locate pins from the Data Table, or inspect Dataverse diagnostics.',
                        callouts: [
                            { num: '1', title: 'Gallery View', desc: 'Browse photo cards of facility observations, filter by category or timeframe, and mark items Closed or Reopened.' },
                            { num: '2', title: 'Data Table & Locate on Map', desc: 'Sortable table of all observations. Click Locate on any row to jump directly to its pin on the Overview map.' },
                            { num: '3', title: 'Timeframe & App Zoom Controls', desc: 'Filter observations by All Time, Last 24h, 7 Days, or 30 Days, and scale the interface zoom from 50% to 200%.' },
                            { num: '4', title: 'Live Dataverse Debug Drawer', desc: 'Click Debug in the top bar to open the collapsible monitor showing Dataverse API queries, schema checks, and payload logs.' }
                        ]
                    }
                ];
                var cur = slides[guideSlideIdx] || slides[0];
                var functionsTable = [
                    { name: 'Apex Foods Logo (Top Right)', where: 'Header Bar', desc: 'Click to unlock or hide the Picture Guide tab.' },
                    { name: 'Overview Tab', where: 'Navigation Bar', desc: 'Interactive plant map displaying color-coded observation pins, equipment pins, and status filters.' },
                    { name: 'Map Submission Tab', where: 'Navigation Bar', desc: 'Click the map to place a pin, upload a photo, select area/equipment, and save a new facility observation.' },
                    { name: 'Asset Map Tab', where: 'Navigation Bar', desc: 'Pin equipment records from craa5___1_a_assets onto the facility floor plan.' },
                    { name: 'Asset Management Tab', where: 'Navigation Bar', desc: 'Full editor for plant equipment attributes, cleaning durations, allergen flags, and room assignments.' },
                    { name: 'Bulk Upload Tab', where: 'Navigation Bar', desc: 'Batch-import or update equipment assets from spreadsheet data.' },
                    { name: 'Gallery Tab', where: 'Navigation Bar', desc: 'Visual grid of observation photos with quick Edit and Close/Reopen actions.' },
                    { name: 'Data Table Tab', where: 'Navigation Bar', desc: 'Searchable, sortable table of all submissions with one-click map locating.' },
                    { name: 'Timeframe Filter & Zoom', where: 'Navigation Bar Right', desc: 'Filters observations by recency (All, 24h, 7d, 30d) and adjusts overall UI zoom percentage.' },
                    { name: 'Debug Button', where: 'Navigation Bar Right', desc: 'Toggles the bottom Live Dataverse Monitor drawer for connection and column diagnostics.' }
                ];
                return (React.createElement("div", { className: "max-w-7xl mx-auto space-y-6 pb-10" },
                    React.createElement("div", { className: "rounded-2xl p-6 text-white shadow-xl", style: { background: 'linear-gradient(135deg, #001F3F 0%, #00468B 60%, #0072CE 100%)', borderBottom: '4px solid #FFB81C' } },
                        React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-4" },
                            React.createElement("div", null,
                                React.createElement("div", { className: "text-[11px] font-black uppercase tracking-widest text-[#FFB81C] mb-1" }, "Visual Operating Manual - Unlocked Behind Apex Foods Logo"),
                                React.createElement("h2", { className: "text-2xl font-black tracking-tight" }, "Facility Map & Asset Tool Picture Guide"),
                                React.createElement("p", { className: "text-xs text-blue-100 mt-1" }, "Annotated visual screenshots and function guide for the Midwest Plant Facility Submission & Asset Management app.")),
                            React.createElement("div", { className: "flex flex-wrap gap-1.5" }, slides.map(function (s, idx) { return (React.createElement("button", { key: s.id, type: "button", onClick: function () { return setGuideSlideIdx(idx); }, className: "px-3 py-2 rounded-xl text-xs font-black transition-all ".concat(idx === guideSlideIdx ? 'bg-[#FFB81C] text-slate-900 shadow-md' : 'bg-white/10 text-white hover:bg-white/20') },
                                idx + 1,
                                ". ",
                                s.id === 'overview' ? 'Overview & Submit' : s.id === 'assets' ? 'Asset Map & Table' : 'Gallery & Data Table')); })))),
                    React.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
                        React.createElement("div", { className: "px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2" },
                            React.createElement("div", null,
                                React.createElement("span", { className: "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#00468B] mb-1" }, cur.badge),
                                React.createElement("h3", { className: "text-lg font-black text-slate-800" }, cur.title),
                                React.createElement("p", { className: "text-xs text-slate-500 font-semibold" }, cur.subtitle)),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement("button", { type: "button", onClick: function () { return setGuideSlideIdx((guideSlideIdx + slides.length - 1) % slides.length); }, className: "px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100" }, "Prev Screen"),
                                React.createElement("button", { type: "button", onClick: function () { return setGuideSlideIdx((guideSlideIdx + 1) % slides.length); }, className: "px-3 py-1.5 rounded-lg bg-[#0072CE] text-xs font-bold text-white hover:bg-[#00468B]" }, "Next Screen"))),
                        React.createElement("div", { className: "p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" },
                            React.createElement("div", { className: "lg:col-span-7 rounded-xl border-2 border-slate-300 bg-slate-900 overflow-hidden shadow-lg" },
                                React.createElement("div", { className: "bg-white px-4 py-2.5 border-b-2 border-[#FFB81C] flex items-center justify-between text-slate-800" },
                                    React.createElement("span", { className: "font-black text-xs text-[#00468B] uppercase" }, "Midwest Plant Facility Submission"),
                                    React.createElement("span", { className: "px-2 py-0.5 rounded bg-[#FFF6E0] border border-[#FFB81C] text-[10px] font-black text-slate-900" }, "(4) Apex Foods (Unlocked)")),
                                React.createElement("div", { className: "p-4 bg-slate-100 space-y-3 text-slate-800" },
                                    cur.id === 'overview' && (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between" },
                                            React.createElement("span", { className: "text-xs font-black text-[#00468B]" }, "(2) Category Filter: All - Safety - Sanitation - Maintenance"),
                                            React.createElement("span", { className: "px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black" }, "(3) + New Map Pin")),
                                        React.createElement("div", { className: "bg-slate-800 text-white rounded-xl p-6 relative h-40 flex flex-col justify-between border-2 border-slate-400" },
                                            React.createElement("div", { className: "text-xs font-black text-amber-300" }, "(1) Interactive Facility Map Canvas (Pan / Zoom / Click to Drop Pin)"),
                                            React.createElement("div", { className: "flex items-center gap-4" },
                                                React.createElement("span", { className: "px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black" }, "Pin #14: Belt Guard Issue (Open)"),
                                                React.createElement("span", { className: "px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black" }, "Asset Pin: Spiral Freezer 1"))))),
                                    cur.id === 'assets' && (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "bg-white p-3 rounded-xl border border-slate-200 space-y-2" },
                                            React.createElement("div", { className: "flex items-center justify-between" },
                                                React.createElement("span", { className: "text-xs font-black text-[#00468B]" }, "(1) Asset Map Pinning & (2) Asset Management Table"),
                                                React.createElement("span", { className: "px-2 py-0.5 rounded bg-blue-100 text-[#00468B] text-[10px] font-black" }, "(3) Bulk CSV Upload")),
                                            React.createElement("div", { className: "p-2.5 rounded bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between" },
                                                React.createElement("span", null, "Asset: Dicers 1 & 2 - Trim Room - 45 mins - 2 Heads"),
                                                React.createElement("span", { className: "px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black" }, "(4) Report Problem on Asset"))))),
                                    cur.id === 'gallery' && (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "bg-white p-3 rounded-xl border border-slate-200 space-y-2" },
                                            React.createElement("div", { className: "flex items-center justify-between" },
                                                React.createElement("span", { className: "text-xs font-black text-[#00468B]" }, "(1) Photo Gallery Cards & (2) Data Table Locate"),
                                                React.createElement("span", { className: "px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-black" }, "(3) Last 7 Days - 100% Zoom")),
                                            React.createElement("div", { className: "p-2.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px]" }, "(4) Live Dataverse Monitor: Connected - Observations & Assets Ready")))))),
                            React.createElement("div", { className: "lg:col-span-5 space-y-3" },
                                React.createElement("div", { className: "text-xs font-black uppercase tracking-wider text-slate-400" }, "Numbered Controls on This Screen"),
                                cur.callouts.map(function (c) { return (React.createElement("div", { key: c.num, className: "p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex gap-3 items-start" },
                                    React.createElement("span", { className: "w-7 h-7 rounded-full bg-[#00468B] text-[#FFB81C] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5" }, c.num),
                                    React.createElement("div", null,
                                        React.createElement("div", { className: "text-xs font-black text-slate-800" }, c.title),
                                        React.createElement("p", { className: "text-xs text-slate-600 mt-0.5 leading-relaxed" }, c.desc)))); })))),
                    React.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" },
                        React.createElement("div", { className: "px-6 py-4 bg-slate-50 border-b border-slate-200" },
                            React.createElement("h3", { className: "text-base font-black text-slate-800" }, "Complete Facility Map & Asset Tool Function Reference"),
                            React.createElement("p", { className: "text-xs text-slate-500 font-semibold" }, "Quick lookup of every tab and control in the Midwest Plant Facility Submission tool.")),
                        React.createElement("div", { className: "overflow-x-auto" },
                            React.createElement("table", { className: "w-full text-left border-collapse" },
                                React.createElement("thead", null,
                                    React.createElement("tr", { className: "bg-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200" },
                                        React.createElement("th", { className: "py-3 px-4" }, "Function / Button"),
                                        React.createElement("th", { className: "py-3 px-4" }, "Location"),
                                        React.createElement("th", { className: "py-3 px-4" }, "What It Does & How To Use It"))),
                                React.createElement("tbody", { className: "divide-y divide-slate-200 text-xs" }, functionsTable.map(function (row, idx) { return (React.createElement("tr", { key: idx, className: "hover:bg-slate-50" },
                                    React.createElement("td", { className: "py-3 px-4 font-black text-[#00468B] whitespace-nowrap" }, row.name),
                                    React.createElement("td", { className: "py-3 px-4 font-bold text-slate-500 whitespace-nowrap" }, row.where),
                                    React.createElement("td", { className: "py-3 px-4 text-slate-700 font-medium" }, row.desc))); })))))));
            })()))),
        React.createElement("div", { className: "fixed bottom-0 left-0 right-0 bg-slate-950 text-slate-300 font-mono text-xs shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col z-[99999] border-t-4 border-yellow-500 transition-all duration-300 ease-in-out ".concat(adminOpen ? 'h-[40vh] translate-y-0' : 'h-0 translate-y-full') },
            React.createElement("div", { className: "flex justify-between items-center p-3 bg-slate-900 border-b border-slate-700 shrink-0" },
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("div", { className: "flex items-center gap-2 text-yellow-400 font-bold text-sm" },
                        React.createElement(Terminal, { className: "w-5 h-5" }),
                        "Live Dataverse Monitor"),
                    React.createElement("div", { className: "hidden sm:flex gap-2" },
                        React.createElement("div", { className: "px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700" },
                            "Init Load: ",
                            loadTime,
                            "ms"),
                        React.createElement("div", { className: "px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700" },
                            "Problems loaded: ",
                            submissions.length))),
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement("button", { type: "button", onClick: function () { return setDrawerView(function (v) { return (v === 'host' ? 'logs' : 'host'); }); }, "aria-pressed": drawerView === 'host', "data-testid": "host-check-button", className: "px-3 py-1 rounded font-bold border ".concat(drawerView === 'host' ? 'bg-yellow-500 text-slate-900 border-yellow-500' : 'bg-slate-800 text-yellow-300 border-slate-700 hover:bg-slate-700') }, drawerView === 'host' ? 'Back to the logs' : 'Host check'),
                    React.createElement("button", { onClick: function () { return setAdminOpen(false); }, className: "text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded" },
                        React.createElement(X, { className: "w-5 h-5" })))),
            adminOpen && drawerView === 'host' && (React.createElement(HostCheck, { maps: maps, currentMap: currentMap, mapPicture: mapPicture, mapImage: mainMapImage, problemWindow: problemWindow, signedIn: signedIn, loadedCount: submissions.length, timeFilter: timeFilter, logEvent: logEvent })),
            React.createElement("div", { className: "flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden ".concat(drawerView === 'host' ? 'hidden' : '') },
                React.createElement("div", { className: "flex flex-col h-full overflow-hidden" },
                    React.createElement("div", { className: "bg-slate-900 p-2 text-slate-400 font-semibold border-b border-slate-800 shrink-0 flex items-center justify-between" },
                        React.createElement("span", null, "Information Log"),
                        React.createElement("span", { className: "text-[10px] bg-slate-800 px-2 py-0.5 rounded" },
                            infoLogs.length,
                            " events")),
                    React.createElement("div", { className: "flex-1 overflow-y-auto p-2 space-y-1" },
                        infoLogs.map(function (log, i) { return (React.createElement("div", { key: i, className: "flex gap-2 ".concat(log.type === 'success' ? 'text-green-400' : 'text-slate-300') },
                            React.createElement("span", { className: "text-blue-500 shrink-0" },
                                "[",
                                log.time,
                                "]"),
                            React.createElement("span", { className: "break-words" }, log.message))); }),
                        infoLogs.length === 0 && React.createElement("div", { className: "text-slate-600 italic" }, "No info events logged."))),
                React.createElement("div", { className: "flex flex-col h-full overflow-hidden" },
                    React.createElement("div", { className: "bg-slate-900 p-2 text-yellow-500 font-semibold border-b border-slate-800 shrink-0 flex items-center justify-between" },
                        React.createElement("span", null, "API Error & Warning Log"),
                        React.createElement("span", { className: "text-[10px] bg-slate-800 px-2 py-0.5 rounded" },
                            debugLogs.length,
                            " events")),
                    React.createElement("div", { className: "flex-1 overflow-y-auto p-2 space-y-2" },
                        debugLogs.map(function (log, i) { return (React.createElement("div", { key: i, className: "flex flex-col border-b border-slate-800/50 pb-2 ".concat(log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-orange-400' : 'text-yellow-300/80') },
                            React.createElement("div", { className: "flex gap-2" },
                                React.createElement("span", { className: "opacity-70 shrink-0" },
                                    "[",
                                    log.time,
                                    "]"),
                                React.createElement("span", { className: "break-words" }, log.message)),
                            log.payload && (React.createElement("div", { className: "mt-2 ml-14" },
                                React.createElement("button", { onClick: function () { return handleCopyPayload(log.payload); }, className: "flex items-center gap-1 mb-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-[10px] transition-colors w-max border border-slate-700" },
                                    React.createElement(CopyIcon, { className: "w-3 h-3" }),
                                    " Copy Error Payload JSON"),
                                React.createElement("pre", { className: "text-[10px] text-slate-500 whitespace-pre-wrap max-h-24 overflow-y-auto bg-slate-950 p-2 rounded border border-slate-800" }, JSON.stringify(log.payload, null, 2)))))); }),
                        debugLogs.length === 0 && React.createElement("div", { className: "text-slate-600 italic" }, "No debug events logged."))),
                React.createElement("div", { className: "flex flex-col h-full overflow-hidden bg-[#0A0A0A]" },
                    React.createElement("div", { className: "bg-slate-900 p-2 text-green-400 font-semibold border-b border-slate-800 shrink-0 flex items-center justify-between" },
                        React.createElement("span", null, "Dataverse Outbound REST Console"),
                        React.createElement("span", { className: "text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300" },
                            dataLogs.length,
                            " requests")),
                    React.createElement("div", { className: "flex-1 overflow-y-auto p-3 space-y-4" },
                        dataLogs.map(function (log, i) { return (React.createElement("div", { key: i, className: "bg-slate-900 p-2 rounded border border-slate-800 shadow-inner" },
                            React.createElement("div", { className: "flex justify-between items-start mb-2 border-b border-slate-800 pb-2" },
                                React.createElement("div", { className: "flex gap-2 text-green-300" },
                                    React.createElement("span", { className: "text-green-600 shrink-0" },
                                        "[",
                                        log.time,
                                        "]"),
                                    React.createElement("span", { className: "font-bold" }, log.message)),
                                React.createElement("button", { onClick: function () { return handleCopyPayload(log.payload); }, className: "flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded text-[10px] transition-colors shrink-0 border border-slate-700 shadow-sm", title: "Copy exact JSON payload" },
                                    React.createElement(CopyIcon, { className: "w-3 h-3" }),
                                    " Copy Payload")),
                            React.createElement("pre", { className: "text-[10px] text-green-500/80 whitespace-pre-wrap font-mono mt-2" },
                                log.request
                                    ? "".concat(log.request.method, " /api/data/v9.2/").concat(log.request.path, "\n").concat(hostLine, "Content-Type: ").concat(log.request.contentType, "\n\n")
                                    : "".concat(log.message.includes('PATCH') ? 'PATCH' : 'POST', " /api/data/v9.2/").concat(DATAVERSE_SCHEMA.TableName, "\n").concat(hostLine, "Content-Type: application/json\n\n"),
                                JSON.stringify(log.payload, null, 2)))); }),
                        dataLogs.length === 0 && (React.createElement("div", { className: "text-slate-600 italic flex flex-col items-center justify-center h-full text-center p-4" },
                            React.createElement(Download, { className: "w-8 h-8 mb-2 opacity-20" }),
                            "No outbound data submissions yet.",
                            React.createElement("br", null),
                            "Submit or edit a form to view exact REST payloads here."))))))));
}
// ==========================================
// HOST CHECK (Debug drawer): what this page can and cannot do where it is hosted, one line each (green / red / amber,
// with a symbol too). Read once the card is opened; "Run again" reads it again. "Copy as text" for sending it on.
// ==========================================
// Tiny scripts on the three public CDNs (the QR label library the roadmap uses): loaded only when the card runs
var CDN_PROBES = [
    { name: 'cdnjs', url: 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js' },
    { name: 'jsdelivr', url: 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js' },
    { name: 'unpkg', url: 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.js' }
];
var probeScript = function (url, ms) { return new Promise(function (resolve) {
    var tag = document.createElement('script');
    var done = false;
    var timer = null;
    var finish = function (ok) {
        if (done)
            return;
        done = true;
        clearTimeout(timer);
        tag.onload = null;
        tag.onerror = null;
        if (tag.parentNode)
            tag.parentNode.removeChild(tag);
        resolve(ok);
    };
    timer = setTimeout(function () { return finish(false); }, ms);
    tag.onload = function () { return finish(true); };
    tag.onerror = function () { return finish(false); };
    tag.async = true;
    tag.src = url;
    document.head.appendChild(tag);
}); };
var inFrame = function () {
    try {
        return window.self !== window.top;
    }
    catch (e) {
        return true;
    }
};
// What reaches the page from its link: the address after ? and #, and the host's page context (a custom page's input)
function readLinkParams() {
    var found = [];
    var idLike = [];
    var take = function (where, text) {
        String(text || '').replace(/^[?#]/, '').split('&').forEach(function (part) {
            if (!part)
                return;
            var shown = part;
            try {
                shown = decodeURIComponent(part.replace(/\+/g, ' '));
            }
            catch (e) { /* shown as it is */ }
            if (shown.length > 60)
                shown = "".concat(shown.slice(0, 57), "...");
            found.push("".concat(where).concat(shown));
            if (/^(asset|assetid|issue|issueid|id|recordid|entityid|data)=/i.test(part))
                idLike.push("".concat(where).concat(shown));
        });
    };
    try {
        take('?', window.location.search);
        take('#', window.location.hash);
    }
    catch (e) { /* the address cannot be read */ }
    var page = '';
    try {
        var pc = window.Xrm && window.Xrm.Utility && window.Xrm.Utility.getPageContext ? window.Xrm.Utility.getPageContext() : null;
        var input_1 = pc && pc.input;
        if (input_1) {
            page = ['pageType', 'name', 'entityName', 'entityId'].filter(function (k) { return input_1[k]; }).map(function (k) { return "".concat(k, "=").concat(input_1[k]); }).join(', ');
            if (input_1.entityId)
                idLike.push("page context entityId=".concat(input_1.entityId));
            else if (input_1.recordId)
                idLike.push("page context recordId=".concat(input_1.recordId));
            else if (input_1.data)
                idLike.push('page context data');
        }
    }
    catch (e) { /* no page context */ }
    return { found: found, idLike: idLike, page: page };
}
// The signed-in user's security roles: from the host, else the roles given straight to the user in Dataverse
function readRoles(signedIn) {
    return __awaiter(this, void 0, void 0, function () {
        var g, roles, names_1, data, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        g = hostContext();
                        roles = g && g.userSettings && g.userSettings.roles;
                        if (roles && typeof roles.forEach === 'function') {
                            names_1 = [];
                            roles.forEach(function (r) { if (r)
                                names_1.push(r.name || r.id || '?'); });
                            return [2 /*return*/, { ok: true, names: names_1, how: 'host' }];
                        }
                    }
                    catch (e) { /* not from the host */ }
                    if (!signedIn || !signedIn.id)
                        return [2 /*return*/, { ok: false, error: 'the page cannot tell who is signed in' }];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getJson("systemusers(".concat(signedIn.id, ")/systemuserroles_association?$select=name"))];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, { ok: true, names: (data.value || []).map(function (r) { return r.name; }).filter(Boolean), how: 'dataverse' }];
                case 3:
                    error_15 = _a.sent();
                    return [2 /*return*/, { ok: false, error: error_15.message }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// The map picture column's settings: does it keep full-size pictures, and how big may one be
function readMapPictureColumn() {
    return __awaiter(this, void 0, void 0, function () {
        var logical, d, e_5, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logical = 'craa5___1_g_maps';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getJson("EntityDefinitions?$select=LogicalName&$filter=".concat(encodeURIComponent("EntitySetName eq '".concat(DATAVERSE_MAPS_SCHEMA.TableName, "'"))))];
                case 2:
                    d = _a.sent();
                    if (d.value && d.value[0] && d.value[0].LogicalName)
                        logical = d.value[0].LogicalName;
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, getJson("EntityDefinitions(LogicalName='".concat(logical, "')/Attributes(LogicalName='craa5_mapimage')/Microsoft.Dynamics.CRM.ImageAttributeMetadata?$select=CanStoreFullImage,MaxSizeInKB"))];
                case 5:
                    m = _a.sent();
                    return [2 /*return*/, { canFull: m.CanStoreFullImage === true, maxKB: typeof m.MaxSizeInKB === 'number' ? m.MaxSizeInKB : null }];
            }
        });
    });
}
// How many problems the whole table holds (Dataverse keeps this count from a snapshot it refreshes about once a day)
function readProblemTableCount() {
    return __awaiter(this, void 0, void 0, function () {
        var d, c, at;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJson("RetrieveTotalRecordCount(EntityNames=@p)?@p=".concat(encodeURIComponent(JSON.stringify([OBSERVATION_LOGICAL_NAME]))))];
                case 1:
                    d = _a.sent();
                    c = d && d.EntityRecordCountCollection;
                    at = c && c.Keys ? c.Keys.indexOf(OBSERVATION_LOGICAL_NAME) : -1;
                    return [2 /*return*/, at === -1 ? null : c.Values[at]];
            }
        });
    });
}
// Resolves to true when the text was copied (a frame may refuse the clipboard: the old copy command is tried then)
var copyText = function (text) {
    var fallback = function () {
        var area = document.createElement('textarea');
        area.value = text;
        document.body.appendChild(area);
        area.select();
        var ok = false;
        try {
            ok = document.execCommand('copy');
        }
        catch (e) { /* not copied */ }
        area.remove();
        return ok;
    };
    if (navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    return Promise.resolve(fallback());
};
var CHECK_MARK = { ok: 'OK', bad: 'X', warn: '!', info: 'i', wait: '...' };
var CHECK_WORD = { ok: 'fine', bad: 'problem', warn: 'needs a look', info: 'for information', wait: 'checking' };
var CHECK_COLOR = { ok: 'text-green-400', bad: 'text-red-400', warn: 'text-amber-300', info: 'text-sky-300', wait: 'text-slate-500' };
var kb = function (bytes) { return "".concat(Math.round(bytes / 1024).toLocaleString(), " KB"); };
function HostCheck(_a) {
    var maps = _a.maps, currentMap = _a.currentMap, mapPicture = _a.mapPicture, mapImage = _a.mapImage, problemWindow = _a.problemWindow, signedIn = _a.signedIn, loadedCount = _a.loadedCount, timeFilter = _a.timeFilter, logEvent = _a.logEvent;
    var _b = useState(1), run = _b[0], setRun = _b[1];
    var _c = useState({ wait: true }), roles = _c[0], setRoles = _c[1];
    var _d = useState(null), cdn = _d[0], setCdn = _d[1];
    var _f = useState({ wait: true }), pictureMeta = _f[0], setPictureMeta = _f[1];
    var _g = useState({ wait: true }), tableCount = _g[0], setTableCount = _g[1];
    var _h = useState(null), natural = _h[0], setNatural = _h[1];
    var _j = useState(false), copied = _j[0], setCopied = _j[1];
    var link = useMemo(function () { return readLinkParams(); }, [run]); // eslint-disable-line react-hooks/exhaustive-deps
    var framed = useMemo(function () { return inFrame(); }, []);
    useEffect(function () {
        var alive = true;
        setRoles({ wait: true });
        setCdn(null);
        setPictureMeta({ wait: true });
        setTableCount({ wait: true });
        logEvent('Host check: reading roles, scripts, the map picture column and the problem count...', 'debug');
        readRoles(signedIn).then(function (r) { if (alive)
            setRoles(r); });
        Promise.all(CDN_PROBES.map(function (p) { return probeScript(p.url, 8000).then(function (ok) { return ({ name: p.name, ok: ok }); }); })).then(function (r) { if (alive)
            setCdn(r); });
        readMapPictureColumn().then(function (m) { if (alive)
            setPictureMeta(m); }).catch(function (error) { if (alive)
            setPictureMeta({ error: error.message }); });
        readProblemTableCount().then(function (n) { if (alive)
            setTableCount({ n: n }); }).catch(function (error) { if (alive)
            setTableCount({ error: error.message }); });
        return function () { alive = false; };
    }, [run, signedIn.id, signedIn.checking]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(function () {
        setNatural(null);
        if (!mapImage)
            return undefined;
        var alive = true;
        loadPicture(mapImage).then(function (img) { if (alive)
            setNatural({ w: img.naturalWidth, h: img.naturalHeight }); }).catch(function () { });
        return function () { alive = false; };
    }, [mapImage]);
    var lines = [];
    var add = function (key, state, title, text) { return lines.push({ key: key, state: state, title: title, text: text }); };
    if (signedIn.checking)
        add('who', 'wait', 'Signed in', 'Checking...');
    else if (signedIn.name)
        add('who', 'ok', 'Signed in', "".concat(signedIn.name, " (read from ").concat(signedIn.how, ")."));
    else
        add('who', 'bad', 'Signed in', "The page cannot tell who is signed in".concat(signedIn.error ? " (".concat(signedIn.error, ")") : '', ". Saves still carry the Dataverse user."));
    if (roles.wait)
        add('roles', 'wait', 'Security roles', 'Checking...');
    else if (roles.ok) {
        add('roles', roles.names.length ? 'ok' : 'warn', 'Security roles', roles.names.length
            ? "".concat(roles.names.length, ": ").concat(roles.names.join(', ')).concat(roles.how === 'dataverse' ? ' (read from Dataverse: roles given through a team are not listed).' : '.')
            : 'The page can read them, but none are given straight to this user (team roles are not listed).');
    }
    else
        add('roles', 'bad', 'Security roles', "The page cannot read them (".concat(roles.error, "). Showing buttons by role needs them; Dataverse's own security still decides what is saved."));
    if (link.idLike.length)
        add('link', 'ok', 'Link to a record', "The page sees ".concat(link.idLike.join(', '), ", so a link (or a QR code) can open a record."));
    else
        add('link', 'warn', 'Link to a record', "No record id reached the page".concat(link.found.length ? " (the address carries ".concat(link.found.join(', '), ")") : '').concat(link.page ? "; the host's page context: ".concat(link.page) : '', ". To test: add ?asset=TEST to the end of this page's address, open it, and run this check again."));
    add('frame', 'info', 'Runs in a frame', framed ? 'Yes: the page runs inside the app, in a frame.' : 'No: the page has the browser window to itself.');
    var tailwind = typeof window !== 'undefined' && !!window.tailwind;
    if (!cdn)
        add('cdn', 'wait', 'Scripts from CDNs', "Tailwind (the page's styles) ".concat(tailwind ? 'loaded' : 'not loaded', "; testing cdnjs, jsdelivr and unpkg..."));
    else {
        var okCount = cdn.filter(function (c) { return c.ok; }).length;
        add('cdn', okCount === cdn.length && tailwind ? 'ok' : (okCount ? 'warn' : 'bad'), 'Scripts from CDNs', "Tailwind (the page's styles) ".concat(tailwind ? 'loaded' : 'not loaded (the styles come from somewhere else, or are missing)', "; ").concat(cdn.map(function (c) { return "".concat(c.name, " ").concat(c.ok ? 'loads' : 'could not load'); }).join(', '), ". The iPhone photo converter and QR labels need at least one."));
    }
    if (!currentMap)
        add('picture', 'bad', 'Map picture', mapPicture.note || 'No map row was found.');
    else if (mapPicture.status === 'loading')
        add('picture', 'wait', 'Map picture', 'Downloading...');
    else if (mapPicture.status !== 'ready')
        add('picture', 'bad', 'Map picture', mapPicture.note || 'The picture could not be shown.');
    else {
        var size = "".concat(currentMap.label, ": ").concat(kb(mapPicture.bytes)).concat(mapPicture.type ? " ".concat(mapPicture.type.replace('image/', '').toUpperCase()) : '').concat(natural ? ", ".concat(natural.w, " x ").concat(natural.h, " px") : '');
        if (pictureMeta.wait)
            add('picture', 'wait', 'Map picture', "".concat(size, ". Checking the column..."));
        else if (pictureMeta.error)
            add('picture', 'warn', 'Map picture', "".concat(size, ". The column's settings could not be read (").concat(pictureMeta.error, ")."));
        else {
            var small = natural && Math.max(natural.w, natural.h) <= 144;
            add('picture', pictureMeta.canFull && !small ? 'ok' : 'bad', 'Map picture', "".concat(size, ". The Map Image column ").concat(pictureMeta.canFull ? 'keeps full-size pictures' : 'keeps only a small thumbnail: turn on "Can store full images" on craa5_mapimage').concat(pictureMeta.maxKB ? "; the largest picture it takes is ".concat(pictureMeta.maxKB.toLocaleString(), " KB") : '', "."));
        }
    }
    var w = problemWindow;
    var within = TIMEFRAME_WORDS[timeFilter] ? " submitted in ".concat(TIMEFRAME_WORDS[timeFilter]) : '';
    var here = w.status === 'ready'
        ? "This map: ".concat(w.openTotal !== null ? "".concat(w.openTotal).concat(w.openCapped ? '+' : '') : '?', " open, ").concat(w.closedTotal !== null ? "".concat(w.closedTotal).concat(w.closedCapped ? '+' : '') : '?', " closed").concat(within, "; ").concat(loadedCount, " loaded now.")
        : (w.status === 'error' ? "This map's problems could not be read (".concat(w.error, ").") : 'This map: still loading.');
    if (tableCount.wait)
        add('problems', 'wait', 'Problems', "".concat(here, " Counting the whole table..."));
    else
        add('problems', w.status === 'error' ? 'bad' : (tableCount.error ? 'warn' : 'ok'), 'Problems', "".concat(tableCount.error ? "The whole table could not be counted (".concat(tableCount.error, ").") : "About ".concat(tableCount.n !== null && tableCount.n !== undefined ? Number(tableCount.n).toLocaleString() : '?', " in the whole table (a count Dataverse refreshes about once a day)."), " ").concat(here));
    var renamed = maps.filter(function (m) { return m.renamed && !m.main; });
    add('maps', !maps.length ? 'bad' : (renamed.length || w.splitNote ? 'warn' : 'ok'), 'Maps', !maps.length ? 'No map rows in craa5___1_g_maps.'
        : "".concat(maps.length, ": ").concat(maps.map(function (m) { return "".concat(m.label, " (code ").concat(m.key, ")"); }).join(', '), ". ").concat(maps.length < 2 ? 'Every problem is on the only map.' : (w.splitNote ? "Problems cannot be split by map: ".concat(w.splitNote) : 'Each map shows its own problems (craa5__facility; blank or MAIN = the main map).')).concat(renamed.length ? " ".concat(renamed.map(function (m) { return "".concat(m.label, " has no code of its own, so it uses ").concat(m.key); }).join('; '), ": give each map its own Facility code.") : ''));
    var copy = function () {
        var text = lines.map(function (l) { return "".concat(CHECK_MARK[l.state], " ").concat(l.title, ": ").concat(l.text); }).join('\n');
        copyText("Host check (".concat(new Date().toLocaleString(), ")\n").concat(text)).then(function (ok) { setCopied(ok ? 'Copied' : 'Not copied: select the text'); setTimeout(function () { return setCopied(false); }, ok ? 1500 : 4000); });
    };
    return (React.createElement("div", { className: "flex-1 overflow-y-auto p-3", "data-testid": "host-check" },
        React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-2" },
            React.createElement("span", { className: "text-yellow-400 font-bold" }, "Host check: what this page can do where it runs"),
            React.createElement("span", { className: "flex gap-2" },
                React.createElement("button", { type: "button", onClick: function () { return setRun(function (r) { return r + 1; }); }, className: "px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700" }, "Run again"),
                React.createElement("button", { type: "button", onClick: copy, className: "px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700" }, copied || 'Copy as text'))),
        React.createElement("ul", { className: "space-y-1.5" }, lines.map(function (l) { return (React.createElement("li", { key: l.key, className: "flex gap-2", "data-check": l.key, "data-state": l.state },
            React.createElement("span", { className: "w-4 shrink-0 font-bold text-center ".concat(CHECK_COLOR[l.state]), "aria-hidden": "true" }, CHECK_MARK[l.state]),
            React.createElement("span", { className: "break-words min-w-0" },
                React.createElement("span", { className: "font-bold ".concat(CHECK_COLOR[l.state]) }, l.title),
                React.createElement("span", { className: "sr-only" },
                    " (",
                    CHECK_WORD[l.state],
                    ")"),
                React.createElement("span", { className: "text-slate-300" },
                    ": ",
                    l.text)))); }))));
}
// --- TAB COMPONENT LOGIC ---
function TabButton(_a) {
    var active = _a.active, icon = _a.icon, label = _a.label, onClick = _a.onClick;
    return (React.createElement("button", { onClick: onClick, role: "tab", "aria-selected": active, className: "flex items-center gap-2 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] rounded-xl whitespace-nowrap shrink-0 transition-colors ".concat(active ? 'bg-[#0072CE] text-white shadow-[0_6px_14px_rgba(0,114,206,0.25)]' : 'text-slate-500 hover:bg-[#E6F1FB] hover:text-[#0072CE]') },
        React.cloneElement(icon, { className: "w-4 h-4" }),
        label));
}
// ==========================================
// SHARED MAP ZOOM CONTROLS
// ==========================================
function ZoomControls(_a) {
    var zoomLevel = _a.zoomLevel, setZoomLevel = _a.setZoomLevel;
    return (React.createElement("div", { className: "absolute bottom-4 right-4 bg-white rounded-lg shadow-lg flex items-center border border-slate-200 z-10" },
        React.createElement("button", { onClick: function () { return setZoomLevel(function (prev) { return Math.max(50, prev - 25); }); }, className: "p-2 hover:bg-slate-100 text-slate-700 rounded-l-lg transition-colors", title: "Zoom Out" },
            React.createElement(ZoomOut, { className: "w-5 h-5" })),
        React.createElement("span", { className: "px-3 text-sm font-bold text-slate-700 border-x border-slate-200 min-w-[3.5rem] text-center" },
            zoomLevel,
            "%"),
        React.createElement("button", { onClick: function () { return setZoomLevel(function (prev) { return Math.min(500, prev + 25); }); }, className: "p-2 hover:bg-slate-100 text-slate-700 rounded-r-lg transition-colors", title: "Zoom In" },
            React.createElement(ZoomIn, { className: "w-5 h-5" }))));
}
// ==========================================
// MAP NOTE: says plainly why the map picture is missing (rather than a stand-in drawing that looks like the real map)
// ==========================================
function MapNote(_a) {
    var note = _a.note, _b = _a.className, className = _b === void 0 ? '' : _b;
    if (!note)
        return null;
    return (React.createElement("div", { role: "status", "data-testid": "map-note", className: "rounded-md border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold px-3 py-2 shadow-sm ".concat(className) }, note));
}
// ==========================================
// SHARED PICTURE: tries each URL in turn (full size, then thumbnail); `fallback` shows when none loads
// ==========================================
function StoredImage(_a) {
    var sources = _a.sources, alt = _a.alt, className = _a.className, _b = _a.fallback, fallback = _b === void 0 ? null : _b, onMissing = _a.onMissing;
    var key = sources.join('|');
    // The index belongs to ONE list of sources: a different list starts again at its first URL
    var _c = useState({ key: key, index: 0 }), attempt = _c[0], setAttempt = _c[1];
    var index = attempt.key === key ? attempt.index : 0;
    var src = sources[index];
    var exhausted = sources.length > 0 && !src;
    useEffect(function () { if (exhausted && onMissing)
        onMissing(); }, [exhausted, onMissing]);
    if (!src)
        return fallback;
    return React.createElement("img", { src: src, alt: alt, loading: "lazy", className: className, onError: function () { return setAttempt({ key: key, index: index + 1 }); } });
}
// ==========================================
// SHARED CATEGORY FILTER (chips double as the map legend)
// ==========================================
function CategoryFilterBar(_a) {
    var counts = _a.counts, selected = _a.selected, onToggle = _a.onToggle, onClear = _a.onClear, status = _a.status, statusCounts = _a.statusCounts, onStatus = _a.onStatus, hideClosed = _a.hideClosed, hiddenClosed = _a.hiddenClosed, onHideClosed = _a.onHideClosed, _b = _a.className, className = _b === void 0 ? '' : _b;
    var total = CATEGORIES.reduce(function (sum, c) { return sum + (counts[c.key] || 0); }, 0);
    var base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 transition-colors';
    return (React.createElement("div", { className: "flex items-center gap-2 overflow-x-auto md:flex-wrap pb-1 ".concat(className) },
        onHideClosed && (React.createElement(Switch, { on: !!hideClosed, onChange: onHideClosed, title: hideClosed ? 'Closed items are hidden on the map. Click to show them (grey with a check).' : 'Click to hide closed items on the map.', label: React.createElement(React.Fragment, null,
                "Hide closed",
                hideClosed && hiddenClosed > 0 ? React.createElement("span", { className: "font-semibold text-white/80" },
                    "(",
                    hiddenClosed,
                    " hidden)") : null) })),
        onStatus && (React.createElement("div", { className: "inline-flex shrink-0 rounded-full border border-[#B3D4F2] bg-white p-0.5", role: "group", "aria-label": "Filter by status" }, STATUS_FILTERS.map(function (s) { return (React.createElement("button", { key: s.key, type: "button", onClick: function () { return onStatus(s.key); }, "aria-pressed": status === s.key, className: "px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ".concat(status === s.key ? 'bg-[#00468B] text-white' : 'text-[#00468B] hover:bg-[#E6F1FB]') },
            s.label,
            " ",
            React.createElement("span", { className: status === s.key ? 'text-white' : 'text-slate-600' }, statusCounts ? statusCounts[s.key] : ''))); }))),
        React.createElement("span", { className: "contents", role: "group", "aria-label": "Filter by category" },
            React.createElement("button", { type: "button", onClick: onClear, "aria-pressed": selected.length === 0, className: "".concat(base, " ").concat(selected.length === 0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100') },
                "All ",
                React.createElement("span", null, total)),
            CATEGORIES.map(function (c) {
                var on = selected.includes(c.key);
                var n = counts[c.key] || 0;
                return (React.createElement("button", { key: c.key, type: "button", onClick: function () { return onToggle(c.key); }, "aria-pressed": on, disabled: n === 0 && !on, title: on ? "Stop filtering by ".concat(c.label) : "Show only ".concat(c.label), className: "".concat(base, " ").concat(on ? 'text-white' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed'), style: on ? { backgroundColor: c.color, borderColor: c.color } : undefined },
                    React.createElement("span", { className: "w-2 h-2 rounded-full", style: { backgroundColor: on ? '#ffffff' : c.color } }),
                    c.label,
                    " ",
                    React.createElement("span", null, n)));
            }))));
}
// ==========================================
// WHICH PROBLEMS ARE LOADED: every open one; closed ones page by page (newest closed first). Said plainly, with
// "Load older" and a search in Dataverse for older closed ones, so a search or a count never pretends to cover them.
// ==========================================
var TIMEFRAME_WORDS = { '24h': 'the last 24 hours', '7d': 'the last 7 days', '30d': 'the last 30 days' };
function LoadedNote(_a) {
    var loaded = _a.loaded, query = _a.query, _b = _a.showClosed, showClosed = _b === void 0 ? true : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    if (!loaded)
        return null;
    var w = loaded.window;
    if (w.status === 'loading') {
        return React.createElement("div", { role: "status", className: "text-xs text-slate-500 ".concat(className), "data-testid": "loaded-note" }, "Loading problems from Dataverse...");
    }
    if (w.status === 'error') {
        return (React.createElement("div", { role: "alert", className: "text-xs text-[#C4001F] ".concat(className), "data-testid": "loaded-note" },
            "Problems could not be loaded: ",
            w.error,
            ' ',
            React.createElement("button", { type: "button", onClick: loaded.onRetry, className: "font-bold underline" }, "Try again")));
    }
    var words = String(query || '').trim().split(/\s+/).filter(Boolean).slice(0, 6).join(' ');
    var search = loaded.search;
    var result = words && search && search.text === words ? search : null;
    var moreClosed = showClosed && !!w.closedNext;
    var offerSearch = !!words && !!w.closedNext && !result;
    if (!w.splitNote && !w.openCapped && !moreClosed && !w.olderError && !offerSearch && !result)
        return null;
    var within = TIMEFRAME_WORDS[loaded.timeFilter] ? ", submitted in ".concat(TIMEFRAME_WORDS[loaded.timeFilter]) : '';
    return (React.createElement("div", { className: "text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 ".concat(className), "data-testid": "loaded-note" },
        w.splitNote && React.createElement("span", { className: "text-[#7A5200]" },
            "Problems are not split by map (",
            w.splitNote,
            "): every problem shows on every map."),
        w.openCapped && React.createElement("span", { className: "text-[#7A5200]" },
            "Only the first ",
            OPEN_MAX,
            " open problems are loaded."),
        moreClosed && (React.createElement("span", { "data-testid": "closed-window" },
            "Closed problems: the ",
            loaded.closedLoaded,
            " most recently closed",
            w.closedTotal !== null ? " of ".concat(w.closedTotal).concat(w.closedCapped ? '+' : '') : '',
            within,
            " are loaded.",
            ' ',
            React.createElement("button", { type: "button", onClick: loaded.onLoadOlder, disabled: w.olderBusy, className: "font-bold text-[#0072CE] underline hover:text-[#00468B] disabled:opacity-50 disabled:cursor-wait", "data-testid": "load-older" }, w.olderBusy ? 'Loading...' : "Load ".concat(CLOSED_PAGE, " older")))),
        w.olderError && React.createElement("span", { className: "text-[#C4001F]" },
            "Older closed problems could not be loaded: ",
            w.olderError),
        offerSearch && (React.createElement("button", { type: "button", onClick: function () { return loaded.onSearchOlder(words); }, className: "font-bold text-[#0072CE] underline hover:text-[#00468B]", "data-testid": "search-older" },
            "Also search older closed problems in Dataverse for \"",
            words,
            "\"")),
        result && (React.createElement("span", { "data-testid": "search-older-result", className: result.error ? 'text-[#C4001F]' : '' }, result.busy ? 'Searching the older closed problems in Dataverse...'
            : result.error ? "The search in Dataverse could not run: ".concat(result.error)
                : result.found === 0 ? "No older closed problem matches \"".concat(result.text, "\".")
                    : "".concat(result.found).concat(result.more ? '+' : '', " closed problem").concat(result.found === 1 ? '' : 's', " in Dataverse match \"").concat(result.text, "\"").concat(result.added ? "; ".concat(result.added, " added to the lists") : ' (all were already here)', ".")))));
}
// ==========================================
// SHARED SEARCH BOX (one search for the map, gallery and action rail)
// ==========================================
function SearchBox(_a) {
    var query = _a.query, onQuery = _a.onQuery, onEnter = _a.onEnter, _b = _a.placeholder, placeholder = _b === void 0 ? 'Search room, area, equipment, text...' : _b, _c = _a.ariaLabel, ariaLabel = _c === void 0 ? 'Search observations' : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    return (React.createElement("div", { className: "relative ".concat(className) },
        React.createElement(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" }),
        React.createElement("input", { type: "search", value: query, onChange: function (e) { return onQuery(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Enter' && onEnter) {
                e.preventDefault();
                onEnter();
            } }, placeholder: placeholder, "aria-label": ariaLabel, className: "w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/40 focus:border-[#0072CE]" })));
}
// Open / Closed badge
function StatusBadge(_a) {
    var item = _a.item, _b = _a.className, className = _b === void 0 ? '' : _b;
    if (!item.closed)
        return null;
    return (React.createElement("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-800 border border-green-200 shrink-0 ".concat(className) },
        React.createElement(CheckCircle, { className: "w-3 h-3" }),
        " ",
        item.statusReason && item.statusReason !== 'Inactive' ? item.statusReason : 'Closed'));
}
// Close / Reopen button with its own saving state and error
function CloseButton(_a) {
    var _this = this;
    var item = _a.item, onSetClosed = _a.onSetClosed, _b = _a.compact, compact = _b === void 0 ? false : _b;
    var _c = useState(false), busy = _c[0], setBusy = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    if (!onSetClosed)
        return null;
    var toggle = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var reason;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // The second click of a double-click would undo the first once a fast save has returned
                    if (busy || (e && e.detail > 1))
                        return [2 /*return*/];
                    setBusy(true);
                    setError('');
                    return [4 /*yield*/, onSetClosed(item, !item.closed)];
                case 1:
                    reason = _a.sent();
                    if (!mounted.current)
                        return [2 /*return*/];
                    setBusy(false);
                    if (reason)
                        setError("Not saved: ".concat(reason));
                    return [2 /*return*/];
            }
        });
    }); };
    var size = compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
    return (React.createElement("span", { className: "inline-flex flex-col items-start gap-1" },
        React.createElement("button", { type: "button", onClick: toggle, disabled: busy, className: "inline-flex items-center gap-1.5 ".concat(size, " rounded-md font-semibold border shadow-sm disabled:opacity-60 disabled:cursor-wait ").concat(item.closed ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-green-700 text-white border-green-700 hover:bg-green-800') },
            React.createElement(CheckCircle, { className: compact ? 'w-3.5 h-3.5' : 'w-4 h-4' }),
            busy ? 'Saving...' : (item.closed ? 'Reopen' : 'Mark closed')),
        error && React.createElement("span", { className: "text-xs text-[#C4001F] max-w-xs", role: "alert" }, error)));
}
// ==========================================
// SHARED DETAIL MODAL
// ==========================================
function DetailModal(_a) {
    var selectedItem = _a.selectedItem, onClose = _a.onClose, onEdit = _a.onEdit, onSetClosed = _a.onSetClosed;
    var dialogRef = useRef(null);
    var onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    var isOpen = !!selectedItem;
    // Escape closes the window (capture phase: before a focused search box behind it would clear itself), and focus moves in
    useEffect(function () {
        if (!isOpen)
            return undefined;
        var previous = document.activeElement;
        var onKey = function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                e.preventDefault();
                e.stopPropagation();
                onCloseRef.current();
            }
        };
        document.addEventListener('keydown', onKey, true);
        if (dialogRef.current)
            dialogRef.current.focus();
        return function () {
            document.removeEventListener('keydown', onKey, true);
            if (previous && previous.focus && document.body.contains(previous))
                previous.focus();
        };
    }, [isOpen]);
    if (!selectedItem)
        return null;
    var equipmentList = selectedItem.equipmentList || [];
    return (React.createElement("div", { className: "fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[120] p-4 sm:p-8", onClick: onClose },
        React.createElement("div", { ref: dialogRef, tabIndex: -1, role: "dialog", "aria-modal": "true", "aria-label": "Observation details", className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto md:overflow-hidden flex flex-col md:flex-row focus:outline-none animate-in fade-in zoom-in duration-200", onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: "md:w-1/2 bg-slate-100 border-r border-slate-200 flex items-center justify-center relative min-h-[250px]" },
                React.createElement(StoredImage, { sources: pictureSources(selectedItem), alt: "Enlarged", className: "w-full h-full object-contain", fallback: (React.createElement("div", { className: "text-center text-slate-400" },
                        React.createElement(ImageIcon, { className: "w-16 h-16 mx-auto mb-2 opacity-50" }),
                        React.createElement("p", null, "No Image Provided"))) }),
                React.createElement("div", { className: "absolute top-4 left-4" },
                    React.createElement("span", { className: "bg-slate-900/70 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm" }, categoryText(selectedItem)))),
            React.createElement("div", { className: "md:w-1/2 flex flex-col md:min-h-0 bg-white relative" },
                React.createElement("div", { className: "absolute top-4 right-4 flex gap-2 z-10" },
                    onEdit && (React.createElement("button", { onClick: function () { return onEdit(selectedItem); }, className: "text-slate-500 hover:text-[#0072CE] bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors shadow-sm border border-slate-200", title: "Edit Observation" },
                        React.createElement(PencilIcon, { className: "w-4 h-4" }))),
                    React.createElement("button", { onClick: onClose, className: "text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors shadow-sm border border-slate-200" },
                        React.createElement(X, { className: "w-4 h-4" }))),
                React.createElement("div", { className: "p-8 md:flex-1 md:min-h-0 md:overflow-y-auto" },
                    React.createElement("h3", { className: "text-2xl font-black text-[#00468B] mb-6 border-b-2 border-[#E6F1FB] pb-4 pr-16 flex flex-wrap items-center gap-2" },
                        "Observation Details ",
                        React.createElement(StatusBadge, { item: selectedItem })),
                    React.createElement("div", { className: "space-y-4" },
                        React.createElement(DetailRow, { label: "Description", value: selectedItem.description }),
                        React.createElement("div", { className: "grid grid-cols-2 gap-4 pt-2" },
                            React.createElement(DetailRow, { label: "Room", value: selectedItem.room || 'N/A' }),
                            React.createElement(DetailRow, { label: "Area", value: selectedItem.area }),
                            React.createElement(DetailRow, { label: "Notify", value: selectedItem.whoToNotify || 'N/A' })),
                        React.createElement("div", null,
                            React.createElement("span", { className: "block text-sm font-medium text-slate-500 mb-1" }, "Equipment"),
                            equipmentList.length === 0 ? (React.createElement("p", { className: "text-slate-800 font-medium" }, "N/A")) : (React.createElement("ul", { className: "flex flex-wrap gap-1.5" }, equipmentList.map(function (e, i) { return (React.createElement("li", { key: "".concat(e.id || 'text', "-").concat(i), className: "px-2 py-0.5 rounded-md text-xs font-semibold border [overflow-wrap:anywhere] ".concat(e.id ? 'bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]' : 'bg-slate-100 text-slate-700 border-slate-200'), title: e.id ? 'Linked to the equipment table' : 'Typed text, not linked to the equipment table' }, e.name)); })))),
                        React.createElement("div", { className: "border-t border-slate-100 pt-4 mt-4 grid grid-cols-2 gap-4 text-sm" },
                            React.createElement("div", null,
                                React.createElement("span", { className: "block text-slate-400 mb-1" }, "Submitted By"),
                                React.createElement("span", { className: "font-medium text-slate-700" }, selectedItem.submittedBy)),
                            React.createElement("div", null,
                                React.createElement("span", { className: "block text-slate-400 mb-1" }, "Date"),
                                React.createElement("span", { className: "font-medium text-slate-700" }, new Date(selectedItem.submittedOn).toLocaleString())),
                            selectedItem.closed && (React.createElement("div", { className: "col-span-2" },
                                React.createElement("span", { className: "block text-slate-400 mb-1" }, "Closed (last change)"),
                                React.createElement("span", { className: "font-medium text-slate-700" },
                                    formatWhen(selectedItem.modifiedOn),
                                    selectedItem.modifiedBy ? " by ".concat(selectedItem.modifiedBy) : '')))),
                        onSetClosed && (React.createElement("div", { className: "border-t border-slate-100 pt-4" },
                            React.createElement(CloseButton, { key: selectedItem.id, item: selectedItem, onSetClosed: onSetClosed })))))))));
}
function DetailRow(_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", null,
        React.createElement("span", { className: "block text-sm font-medium text-slate-500 mb-1" }, label),
        React.createElement("p", { className: "text-slate-800 font-medium whitespace-pre-wrap" }, value)));
}
// ==========================================
// TAB 0: MAP OVERVIEW
// ==========================================
function OverviewTab(_a) {
    var submissions = _a.submissions, categoryBar = _a.categoryBar, logEvent = _a.logEvent, mapImage = _a.mapImage, setMainMapImage = _a.setMainMapImage, mapPicture = _a.mapPicture, layers = _a.layers, onLayers = _a.onLayers, pins = _a.pins, equipmentLayer = _a.equipmentLayer, onOpenAsset = _a.onOpenAsset, focusItem = _a.focusItem, setFocusItem = _a.setFocusItem, onEdit = _a.onEdit, onSetClosed = _a.onSetClosed, liveItems = _a.liveItems;
    var _b = useState(null), selectedItem = _b[0], setSelectedItem = _b[1];
    // A touch screen has no hover: the first tap on a flag shows its label ('p:<id>'), the next one opens it. A tap on an
    // equipment dot ('a:<id>') shows its label with "Open in Asset Map". A tap on the map itself hides the label again.
    var _c = useState(null), tapped = _c[0], setTapped = _c[1];
    var pointerKind = useRef('mouse');
    var notePointer = function (e) { pointerKind.current = e.pointerType || 'mouse'; };
    var _d = useState(100), zoomLevel = _d[0], setZoomLevel = _d[1];
    var _f = useState(false), jumping = _f[0], setJumping = _f[1]; // zoom without the width animation while jumping to an item
    var containerRef = useRef(null);
    // Handle auto-focus double clicking from the table or sidebar
    useEffect(function () {
        if (focusItem && containerRef.current) {
            logEvent("Centering overview map on observation ID: ".concat(focusItem.id), 'debug');
            // The zoom wrapper animates its width; scrolling while it is still growing would stop short, so jump straight to the final size
            setJumping(true);
            setZoomLevel(300);
            setSelectedItem(focusItem);
            setTimeout(function () {
                centerMapOn(containerRef.current, focusItem.mapX, focusItem.mapY);
                setJumping(false);
                setFocusItem(null);
            }, 100);
        }
    }, [focusItem, setFocusItem, logEvent]);
    var handleImageError = function () {
        logEvent('Browser failed to natively render the Base64 Map Image payload. Dropping to SVG fallback.', 'error');
        setMainMapImage(null);
    };
    // Flags on the map: closed ones first so open flags sit on top. An item opened from the rail or the list keeps its
    // flag while its window is open, even when "Hide closed" leaves it out.
    var mapFlags = useMemo(function () {
        var list = submissions.slice();
        if (selectedItem && !list.some(function (s) { return s.id === selectedItem.id; }))
            list.push(liveItems[selectedItem.id] || selectedItem);
        return list.sort(function (a, b) { return (b.closed ? 1 : 0) - (a.closed ? 1 : 0); });
    }, [submissions, selectedItem, liveItems]);
    return (React.createElement("div", { className: "h-full flex flex-col md:flex-row bg-slate-100 p-4 md:p-6 overflow-hidden gap-4" },
        React.createElement("div", { className: "flex-1 flex flex-col overflow-hidden relative" },
            React.createElement("div", { className: "mb-3 shrink-0 flex flex-wrap items-end justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-2xl font-black text-[#00468B]" }, "Facility Map Overview"),
                    React.createElement("p", { className: "text-sm text-slate-500" }, categoryBar.hideClosed ? 'Open items across the facility. Closed items are hidden on the map.' : 'Every reported item across the facility. Closed items are grey with a check.')),
                React.createElement(SearchBox, { query: categoryBar.query, onQuery: categoryBar.onQuery, onEnter: function () {
                        // Enter jumps straight to the item when the search leaves exactly one on the map
                        if (categoryBar.query.trim() && submissions.length === 1) {
                            logEvent("Map search: jumping to the only match ".concat(submissions[0].id), 'info');
                            setFocusItem(submissions[0]);
                        }
                    }, placeholder: "Search the map: room, area, equipment, text...", className: "w-full sm:w-80" })),
            React.createElement(CategoryFilterBar, __assign({}, categoryBar, { className: "mb-3 shrink-0" })),
            React.createElement("div", { className: "mb-2 shrink-0 flex flex-wrap items-center gap-2", role: "group", "aria-label": "Map layers", "data-testid": "map-layers" },
                React.createElement("span", { className: "text-[11px] font-black uppercase tracking-widest text-slate-500" }, "Show"),
                React.createElement(Switch, { on: layers.problems, onChange: function (v) { return onLayers({ problems: v }); }, title: "Problems: a flag in the category's colour; closed ones are grey with a check", label: React.createElement("span", { className: "inline-flex items-center gap-1" },
                        React.createElement(FlagIcon, { className: "w-3.5 h-3.5", fill: "currentColor" }),
                        " Problems ",
                        React.createElement("span", { className: "font-semibold opacity-80", "data-testid": "layer-problems-count" }, submissions.length)) }),
                React.createElement(Switch, { on: layers.equipment, onChange: function (v) { return onLayers({ equipment: v }); }, title: "Equipment placed on this map: a blue dot (loads when switched on)", label: React.createElement("span", { className: "inline-flex items-center gap-1" },
                        React.createElement("span", { className: "inline-block w-2.5 h-2.5 rounded-full bg-[#0072CE] border border-white", "aria-hidden": "true" }),
                        " Equipment ",
                        layers.equipment && equipmentLayer.status === 'ready' ? React.createElement("span", { className: "font-semibold opacity-80", "data-testid": "layer-equipment-count" }, pins.length) : null) }),
                React.createElement(Switch, { on: layers.labels, onChange: function (v) { return onLayers({ labels: v }); }, title: layers.labels ? 'Every flag and dot shows its name. Click to show names only on a tap or hover.' : 'Show the name of every flag and dot (otherwise tap one to see it)', label: "Labels on" }),
                layers.equipment && equipmentLayer.note && (React.createElement("span", { className: "text-xs ".concat(equipmentLayer.status === 'error' || equipmentLayer.status === 'none' ? 'text-[#C4001F]' : 'text-slate-500'), "data-testid": "equipment-layer-note" }, equipmentLayer.note))),
            React.createElement(LoadedNote, { loaded: categoryBar.loaded, query: categoryBar.query, showClosed: !categoryBar.hideClosed, className: "mb-2 shrink-0" }),
            categoryBar.query.trim() !== '' && (React.createElement("div", { role: "status", className: "mb-2 text-xs text-slate-600 shrink-0" },
                React.createElement("span", { className: "font-bold text-[#00468B]" }, submissions.length),
                " match",
                submissions.length === 1 ? '' : 'es',
                " for \"",
                categoryBar.query.trim(),
                "\"",
                submissions.length === 1 && ' - press Enter to jump to it',
                ' ',
                React.createElement("button", { type: "button", onClick: function () { return categoryBar.onQuery(''); }, className: "text-[#0072CE] underline hover:text-[#00468B]" }, "Clear search"))),
            React.createElement("div", { className: "flex-1 relative rounded-xl shadow-inner border border-slate-400/50 bg-slate-300 overflow-auto", ref: containerRef },
                React.createElement("div", { className: "relative mx-auto origin-top-left ".concat(jumping ? '' : 'transition-all'), style: { width: "".concat(zoomLevel, "%"), minWidth: '100%' }, onClick: function () { return setTapped(null); } },
                    mapImage ? (React.createElement("img", { src: mapImage, onError: handleImageError, alt: "Main Facility Map", className: "w-full h-auto block pointer-events-none select-none", draggable: "false" })) : (
                    // No picture (yet): a plain panel and, once known, why - never a made-up drawing that looks like the real map
                    React.createElement("div", { className: "w-full aspect-[4/3] bg-slate-200 flex items-start justify-center p-4", "data-testid": "map-missing" }, mapPicture && mapPicture.status === 'loading'
                        ? React.createElement("span", { className: "mt-8 text-sm font-semibold text-slate-500" }, "Loading the map picture...")
                        : React.createElement(MapNote, { note: (mapPicture && mapPicture.note) || 'There is no map picture to show.', className: "max-w-xl text-sm" }))),
                    pins.map(function (pin) {
                        var key = "a:".concat(pin.id);
                        var open = tapped === key;
                        var named = open || layers.labels;
                        return (React.createElement("div", { key: pin.id, className: "absolute group ".concat(open ? 'z-30' : 'z-[5]'), style: { left: "".concat(pin.location.x, "%"), top: "".concat(pin.location.y, "%"), transform: 'translate(-50%, -50%)' }, "data-overview-pin": pin.id },
                            React.createElement("button", { type: "button", "aria-label": "Equipment ".concat(pin.name), "aria-expanded": open, onClick: function (e) { e.stopPropagation(); setTapped(open ? null : key); if (!open)
                                    logEvent("Equipment dot tapped on the overview: ".concat(pin.name), 'info'); }, className: "block p-1" },
                                React.createElement("span", { className: "block rounded-full border-2 shadow transition-transform ".concat(open ? 'w-4 h-4 bg-[#FFB81C] border-[#00468B]' : 'w-3 h-3 bg-[#0072CE] border-white group-hover:scale-125') })),
                            React.createElement("div", { onClick: function (e) { return e.stopPropagation(); }, className: "absolute bottom-full mb-0.5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs text-left px-2 py-1 rounded w-max max-w-[16rem] break-words shadow-lg ".concat(open ? 'block' : (named ? 'block pointer-events-none' : 'hidden group-hover:block pointer-events-none')), style: { transform: 'translateX(-50%)' }, "data-testid": named ? 'map-label' : undefined },
                                React.createElement("span", { className: "font-bold block" }, pin.name),
                                open && (pin.room || pin.area) && React.createElement("span", { className: "text-slate-300 block" }, [pin.room, pin.area].filter(Boolean).join(' - ')),
                                open && (React.createElement("button", { type: "button", onClick: function () { return onOpenAsset(pin.id); }, className: "mt-1 px-2 py-0.5 rounded bg-[#FFB81C] text-slate-900 font-bold hover:bg-[#f5aa00]", "data-testid": "open-in-asset-map" }, "Open in Asset Map")))));
                    }),
                    layers.problems && mapFlags.map(function (sub) {
                        var flagColor = itemColor(sub);
                        var key = "p:".concat(sub.id);
                        var open = tapped === key;
                        var named = open || layers.labels;
                        return (React.createElement("div", { key: sub.id, className: "absolute transform -translate-x-1/2 -translate-y-[90%] cursor-pointer group ".concat(open ? 'z-30' : 'z-10', " ").concat(sub.closed ? 'opacity-80 hover:opacity-100' : ''), style: { left: "".concat(sub.mapX, "%"), top: "".concat(sub.mapY, "%") }, onPointerDown: notePointer, onClick: function (e) {
                                e.stopPropagation();
                                if (pointerKind.current === 'touch' && !layers.labels && !open) {
                                    logEvent("Map overview flag tapped (label shown). ID: ".concat(sub.id), 'info');
                                    setTapped(key);
                                    return;
                                }
                                setTapped(null);
                                logEvent("Map overview flag clicked. ID: ".concat(sub.id), 'info');
                                setSelectedItem(sub);
                            }, "data-status": sub.closed ? 'closed' : 'open' },
                            React.createElement(FlagIcon, { className: "w-6 h-6 md:w-8 md:h-8 drop-shadow-md group-hover:scale-125 transition-transform origin-bottom", style: { color: flagColor }, fill: flagColor }),
                            sub.closed && (React.createElement("span", { className: "absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-white shadow flex items-center justify-center pointer-events-none", "aria-hidden": "true" },
                                React.createElement(CheckCircle, { className: "w-3.5 h-3.5", style: { color: CLOSED_CHECK_COLOR } }))),
                            React.createElement("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900/90 backdrop-blur text-white text-xs px-2 py-1 rounded w-max max-w-[16rem] break-words shadow-lg z-20 ".concat(open ? 'block' : (named ? 'block pointer-events-none' : 'hidden group-hover:block pointer-events-none')), "data-testid": named ? 'map-label' : undefined },
                                React.createElement("span", { className: "font-bold block border-b border-slate-700 mb-0.5 pb-0.5" },
                                    sub.closed ? 'Closed - ' : '',
                                    categoryText(sub)),
                                React.createElement("span", { className: "text-slate-300" },
                                    sub.area,
                                    sub.equipment ? " - ".concat(sub.equipment) : ''),
                                open && React.createElement("span", { className: "block mt-0.5 font-bold text-[#FFB81C]" }, "Tap again for details"))));
                    }),
                    layers.problems && submissions.length === 0 && (React.createElement("div", { className: layers.equipment
                            ? 'absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-sm font-medium bg-white/90 rounded-lg shadow px-4 py-2 z-20'
                            : 'absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500 font-medium bg-white/50 backdrop-blur-sm', style: layers.equipment ? { transform: 'translateX(-50%)' } : undefined, onClick: function (e) { return e.stopPropagation(); } }, categoryBar.hideClosed && categoryBar.hiddenClosed > 0 ? (React.createElement(React.Fragment, null,
                        React.createElement("span", null, categoryBar.hiddenClosed === 1 ? 'The only matching item is closed.' : "All ".concat(categoryBar.hiddenClosed, " matching items are closed.")),
                        React.createElement("button", { type: "button", onClick: function () { return categoryBar.onHideClosed(false); }, className: "text-sm text-[#0072CE] underline hover:text-[#00468B]" }, "Show closed items"))) : categoryBar.narrowed ? (React.createElement(React.Fragment, null,
                        React.createElement("span", null, "No reports match the search and filters."),
                        React.createElement("button", { type: "button", onClick: categoryBar.onClearAll, className: "text-sm text-[#0072CE] underline hover:text-[#00468B]" }, "Clear search and filters"))) : (React.createElement("span", null, "No reports submitted yet."))))),
                React.createElement(ZoomControls, { zoomLevel: zoomLevel, setZoomLevel: setZoomLevel }))),
        React.createElement("div", { className: "w-full md:w-72 lg:w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0 mt-4 md:mt-0 h-[30vh] md:h-full" },
            React.createElement("div", { className: "p-3 bg-white border-b-2 border-[#E6F1FB] font-black text-[11px] uppercase tracking-widest text-[#00468B] flex justify-between items-center shrink-0" },
                React.createElement("span", null, "Recent Issues"),
                React.createElement("span", { className: "text-xs bg-[#E6F1FB] text-[#00468B] px-2 py-0.5 rounded-full" }, submissions.length)),
            React.createElement("div", { className: "flex-1 overflow-y-auto p-2 space-y-2" },
                submissions.slice().sort(function (a, b) { return new Date(b.submittedOn) - new Date(a.submittedOn); }).map(function (sub) { return (React.createElement("div", { key: sub.id, onClick: function () {
                        logEvent("Sidebar clicked. Jumping to issue: ".concat(sub.id), 'info');
                        setFocusItem(sub);
                    }, className: "p-3 rounded-lg border hover:border-[#0072CE]/40 hover:bg-[#E6F1FB] cursor-pointer transition-colors shadow-sm ".concat(sub.closed ? 'border-slate-200 bg-slate-50' : 'border-slate-100') },
                    React.createElement("div", { className: "flex justify-between items-start gap-1 mb-2" },
                        React.createElement("span", { className: "font-bold text-slate-800 text-xs" }, new Date(sub.submittedOn).toLocaleDateString()),
                        React.createElement("span", { className: "flex items-center gap-1 min-w-0 max-w-[70%]" },
                            React.createElement(StatusBadge, { item: sub }),
                            React.createElement("span", { className: "text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium inline-flex items-center gap-1 min-w-0" },
                                React.createElement("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { backgroundColor: categoryMeta(sub.category).color } }),
                                React.createElement("span", { className: "truncate" }, categoryText(sub))))),
                    React.createElement("div", { className: "font-semibold text-sm truncate mb-1 ".concat(sub.closed ? 'text-slate-500' : 'text-[#00468B]') },
                        sub.area,
                        " ",
                        sub.room ? "- ".concat(sub.room) : ''),
                    sub.equipment && React.createElement("div", { className: "text-[11px] text-slate-500 truncate mb-1", title: sub.equipment },
                        "Equipment: ",
                        sub.equipment),
                    React.createElement("p", { className: "text-slate-600 text-xs line-clamp-2" }, sub.description))); }),
                submissions.length === 0 && (React.createElement("div", { className: "text-slate-400 text-xs text-center p-4" }, "No issues match the current filter.")))),
        React.createElement(DetailModal, { selectedItem: selectedItem && (liveItems[selectedItem.id] || selectedItem), onClose: function () { return setSelectedItem(null); }, onEdit: onEdit, onSetClosed: onSetClosed })));
}
// ==========================================
// TAB 1: SUBMISSION & MAP
// ==========================================
function SubmitTab(_a) {
    var _this = this;
    var submissions = _a.submissions, savedHere = _a.savedHere, logEvent = _a.logEvent, mapImage = _a.mapImage, setMainMapImage = _a.setMainMapImage, mapNote = _a.mapNote, mapKey = _a.mapKey, editingItem = _a.editingItem, setEditingItem = _a.setEditingItem, pictureColumn = _a.pictureColumn, pictureFix = _a.pictureFix, equipmentColumns = _a.equipmentColumns;
    var mapRef = useRef(null);
    var containerRef = useRef(null);
    var _b = useState(null), selection = _b[0], setSelection = _b[1];
    var _c = useState(false), showForm = _c[0], setShowForm = _c[1];
    var _d = useState(null), hoverPos = _d[0], setHoverPos = _d[1];
    var _f = useState(false), isResizing = _f[0], setIsResizing = _f[1];
    var _g = useState(100), zoomLevel = _g[0], setZoomLevel = _g[1];
    var _h = useState(false), saving = _h[0], setSaving = _h[1];
    var _j = useState(''), saveError = _j[0], setSaveError = _j[1];
    // A ref as well as state: two submits in the same tick would both see saving === false
    var savingRef = useRef(false);
    // The tab may be left while a save is in flight; the save still finishes, but must not touch a form that is gone
    var mountedRef = useRef(true);
    useEffect(function () {
        mountedRef.current = true;
        return function () { mountedRef.current = false; };
    }, []);
    // Catch edit triggers and set form/selection states
    useEffect(function () {
        if (editingItem) {
            logEvent("Edit mode activated for ".concat(editingItem.id, ". Restoring map bounding box."), 'debug');
            setSelection({
                x: editingItem.mapX - (editingItem.boxW / 2),
                y: editingItem.mapY - (editingItem.boxH / 2),
                w: editingItem.boxW,
                h: editingItem.boxH
            });
            centerMapOn(containerRef.current, editingItem.mapX, editingItem.mapY);
            setShowForm(true);
        }
    }, [editingItem, logEvent]);
    var handleMapInteraction = function (e, isDoubleClick) {
        // Prevent interaction trigger if we were just dragging the resize handle
        if (isResizing)
            return;
        if (!mapRef.current)
            return;
        var rect = mapRef.current.getBoundingClientRect();
        // Coordinates mathematically adapt to zoom level because they calculate % of current rect.width
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        if (isDoubleClick) {
            if (selection) {
                // Check bounds to see if user clicked outside the selection box
                var isOutside = x < selection.x || x > selection.x + selection.w || y < selection.y || y > selection.y + selection.h;
                if (isOutside) {
                    setSelection(null);
                    setEditingItem(null);
                    logEvent('Selection canceled by double-clicking outside the box.', 'info');
                    return; // Stop here, don't open the form.
                }
            }
            // If we made it here, double click was inside selection (or selection was null, so we create it)
            if (!selection) {
                setSelection({ x: Math.max(0, x - 5), y: Math.max(0, y - 5), w: 10, h: 10 });
            }
            logEvent("Map region double-clicked. Opening form...", 'info');
            setShowForm(true);
        }
        else {
            // Single Click
            if (selection) {
                // Move existing selection center to the click point
                setSelection(function (prev) { return (__assign(__assign({}, prev), { x: Math.max(0, Math.min(x - prev.w / 2, 100 - prev.w)), y: Math.max(0, Math.min(y - prev.h / 2, 100 - prev.h)) })); });
                logEvent('Selection moved.', 'debug');
            }
            else {
                // Create new default 10x10 selection
                setSelection({
                    x: Math.max(0, Math.min(x - 5, 90)),
                    y: Math.max(0, Math.min(y - 5, 90)),
                    w: 10,
                    h: 10
                });
                logEvent("Map region selected interactively. Pending confirmation.", 'info');
            }
        }
    };
    return (React.createElement("div", { className: "h-full flex flex-col relative" },
        React.createElement("div", { className: "p-3 bg-white shadow-sm z-10 flex flex-wrap gap-2 justify-between items-center text-sm text-slate-600 shrink-0" },
            React.createElement("span", null, "Click to select/move box. Drag corner to resize. Dbl-click outside to cancel. Dbl-click inside to open form."),
            !mapImage && React.createElement(MapNote, { note: mapNote, className: "w-full" }),
            selection && !showForm && (React.createElement("button", { onClick: function () { setShowForm(true); logEvent('User confirmed location. Opening form.', 'info'); }, className: "bg-[#0072CE] text-white px-4 py-1.5 rounded-md hover:bg-[#00468B] shadow flex items-center gap-2 font-semibold" },
                React.createElement(CheckCircle, { className: "w-4 h-4" }),
                " ",
                editingItem ? "Edit Observation" : "Confirm Location"))),
        React.createElement("div", { className: "flex-1 bg-slate-300 relative overflow-auto", ref: containerRef },
            React.createElement("div", { className: "relative mx-auto select-none cursor-crosshair transition-all origin-top-left", ref: mapRef, style: { width: "".concat(zoomLevel, "%"), minWidth: '100%' }, onClick: function (e) { return handleMapInteraction(e, false); }, onDoubleClick: function (e) { return handleMapInteraction(e, true); }, onMouseMove: function (e) {
                    var rect = mapRef.current.getBoundingClientRect();
                    var mouseX = ((e.clientX - rect.left) / rect.width) * 100;
                    var mouseY = ((e.clientY - rect.top) / rect.height) * 100;
                    if (isResizing && selection) {
                        // Resize logic based on mouse drag. Works perfectly regardless of zoom size.
                        setSelection(function (prev) { return (__assign(__assign({}, prev), { w: Math.max(2, Math.min(mouseX - prev.x, 100 - prev.x)), h: Math.max(2, Math.min(mouseY - prev.y, 100 - prev.y)) })); });
                    }
                    else {
                        // Hover guidelines logic mapped to pixel values of the container for visual dash lines
                        setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                }, onMouseUp: function () { return setIsResizing(false); }, onMouseLeave: function () { setHoverPos(null); setIsResizing(false); } },
                mapImage ? (React.createElement("img", { src: mapImage, onError: function () { return setMainMapImage(null); }, alt: "Main Facility Map", className: "w-full h-auto block pointer-events-none select-none", draggable: "false" })) : (React.createElement("div", { className: "w-full aspect-square" },
                    React.createElement(FacilityMapSvg, null))),
                hoverPos && !showForm && !isResizing && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "absolute top-0 bottom-0 border-l border-dashed border-slate-500/50 pointer-events-none", style: { left: hoverPos.x } }),
                    React.createElement("div", { className: "absolute left-0 right-0 border-t border-dashed border-slate-500/50 pointer-events-none", style: { top: hoverPos.y } }))),
                selection && (React.createElement("div", { className: "absolute border-2 border-[#0072CE] bg-[#0072CE]/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] transition-all ".concat(isResizing ? 'duration-0' : 'duration-200 pointer-events-none'), style: {
                        left: "".concat(selection.x, "%"), top: "".concat(selection.y, "%"),
                        width: "".concat(selection.w, "%"), height: "".concat(selection.h, "%")
                    } },
                    React.createElement("div", { className: "absolute -top-6 left-0 bg-[#0072CE] text-white text-xs px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap" }, editingItem ? 'Editing Selection' : 'Selected Area'),
                    React.createElement("div", { className: "absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#0072CE] cursor-se-resize rounded-full pointer-events-auto shadow hover:scale-110 active:scale-95 transition-transform", onMouseDown: function (e) {
                            e.stopPropagation(); // Prevents map single click from firing
                            setIsResizing(true);
                            logEvent('Resizing map selection...', 'debug');
                        } }))),
                submissions.map(function (sub) {
                    if (editingItem && editingItem.id === sub.id)
                        return null;
                    return (React.createElement("div", { key: sub.id, className: "absolute w-2.5 h-2.5 rounded-full border shadow-sm pointer-events-none ".concat(sub.closed ? 'border-slate-500 opacity-70' : 'border-white'), style: { left: "".concat(sub.mapX, "%"), top: "".concat(sub.mapY, "%"), transform: 'translate(-50%, -50%)', backgroundColor: sub.closed ? '#ffffff' : itemColor(sub) }, title: "".concat(sub.closed ? 'Closed: ' : '').concat(sub.description) }));
                })),
            React.createElement(ZoomControls, { zoomLevel: zoomLevel, setZoomLevel: setZoomLevel })),
        showForm && (React.createElement("div", { className: "absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-[110] p-4" },
            React.createElement("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200" },
                React.createElement("div", { className: "p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10" },
                    React.createElement("h2", { className: "text-xl font-black flex flex-wrap items-center gap-2 text-[#00468B]" },
                        React.createElement(Activity, { className: "text-[#0072CE]" }),
                        " ",
                        editingItem ? 'Edit Observation' : 'New Observation',
                        editingItem && React.createElement(StatusBadge, { item: editingItem })),
                    React.createElement("button", { disabled: saving, title: saving ? 'Saving - one moment' : 'Close', onClick: function () {
                            setShowForm(false);
                            setEditingItem(null);
                            setSaveError('');
                            logEvent('Form closed without submission.', 'info');
                        }, className: "text-slate-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-400" },
                        React.createElement(X, { className: "w-6 h-6" }))),
                React.createElement("div", { className: "p-6" },
                    React.createElement(SubmissionForm, { selection: selection, mapKey: mapKey, logEvent: logEvent, editingItem: editingItem, pictureSupport: pictureColumn, pictureFix: pictureFix, equipmentColumns: equipmentColumns, saving: saving, saveError: saveError, onSubmit: function (localData, dbPayload, picture) { return __awaiter(_this, void 0, void 0, function () {
                            var url, method, response, savedId, resData, e_6, entityIdHeader, match, pictureFailure, picErr_1, errData, reason, error_16;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (savingRef.current)
                                            return [2 /*return*/];
                                        savingRef.current = true;
                                        setSaving(true);
                                        setSaveError('');
                                        url = editingItem
                                            ? apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "(").concat(editingItem.id, ")?$select=craa5__facilityobservationid"))
                                            : apiUrl("".concat(DATAVERSE_SCHEMA.TableName, "?$select=craa5__facilityobservationid"));
                                        method = editingItem ? 'PATCH' : 'POST';
                                        logEvent("".concat(method, " Request starting to ").concat(url, "..."), 'data', dbPayload);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 19, 20, 21]);
                                        return [4 /*yield*/, fetch(url, {
                                                method: method,
                                                headers: __assign({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0', 'Prefer': 'return=representation' }, (editingItem ? { 'If-Match': '*' } : {})),
                                                body: JSON.stringify(dbPayload)
                                            })];
                                    case 2:
                                        response = _a.sent();
                                        if (!response.ok) return [3 /*break*/, 16];
                                        savedId = localData.id;
                                        if (!(response.status === 201 || response.status === 200)) return [3 /*break*/, 7];
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, response.json()];
                                    case 4:
                                        resData = _a.sent();
                                        if (resData.craa5__facilityobservationid) {
                                            savedId = resData.craa5__facilityobservationid;
                                            localData.id = savedId;
                                        }
                                        return [3 /*break*/, 6];
                                    case 5:
                                        e_6 = _a.sent();
                                        return [3 /*break*/, 6];
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        if (response.status === 204) {
                                            entityIdHeader = response.headers.get('OData-EntityId');
                                            if (entityIdHeader) {
                                                match = entityIdHeader.match(/\(([^)]+)\)/);
                                                if (match)
                                                    savedId = match[1];
                                                localData.id = savedId;
                                            }
                                        }
                                        _a.label = 8;
                                    case 8:
                                        pictureFailure = '';
                                        if (!picture) return [3 /*break*/, 15];
                                        _a.label = 9;
                                    case 9:
                                        _a.trys.push([9, 14, , 15]);
                                        if (!pictureColumn.ready)
                                            throw new Error("Pictures cannot be saved: ".concat(pictureColumn.reason));
                                        if (!(picture.op === 'new')) return [3 /*break*/, 11];
                                        logEvent("Uploading picture to ".concat(pictureColumn.name, " for ").concat(savedId, " (").concat(Math.round(picture.dataUrl.length * 0.75 / 1024), " KB)..."), 'data', { column: pictureColumn.name, id: savedId, bytes: Math.round(picture.dataUrl.length * 0.75) }, { method: 'PATCH', path: "".concat(DATAVERSE_SCHEMA.TableName, "(").concat(savedId, ")/").concat(pictureColumn.name), contentType: 'application/octet-stream' });
                                        return [4 /*yield*/, uploadPicture(pictureColumn.name, savedId, picture.dataUrl)];
                                    case 10:
                                        _a.sent();
                                        logEvent("Dataverse picture upload Success (ID: ".concat(savedId, ")"), 'success');
                                        return [3 /*break*/, 13];
                                    case 11:
                                        logEvent("Clearing picture in ".concat(pictureColumn.name, " for ").concat(savedId, "..."), 'data', { column: pictureColumn.name, id: savedId, action: 'delete' }, { method: 'DELETE', path: "".concat(DATAVERSE_SCHEMA.TableName, "(").concat(savedId, ")/").concat(pictureColumn.name), contentType: '(no body)' });
                                        return [4 /*yield*/, deletePicture(pictureColumn.name, savedId)];
                                    case 12:
                                        _a.sent();
                                        logEvent("Dataverse picture removal Success (ID: ".concat(savedId, ")"), 'success');
                                        _a.label = 13;
                                    case 13: return [3 /*break*/, 15];
                                    case 14:
                                        picErr_1 = _a.sent();
                                        pictureFailure = picErr_1.message;
                                        logEvent("Dataverse Picture Save Failed: ".concat(picErr_1.message), 'error', { id: savedId, column: pictureColumn.name, op: picture.op });
                                        return [3 /*break*/, 15];
                                    case 15:
                                        // What the lists show: the new picture, none after a removal, or whatever was there before
                                        if (picture && !pictureFailure) {
                                            localData.image = picture.op === 'new' ? picture.dataUrl : null;
                                            localData.picture = null;
                                        }
                                        else if (picture && pictureFailure) {
                                            // The record is saved but the picture is not: show the truth in the lists
                                            localData.image = editingItem ? editingItem.image : null;
                                            localData.picture = editingItem ? editingItem.picture : null;
                                        }
                                        if (editingItem) {
                                            // The edit never writes the status: keep whatever it is now (it may have been closed or reopened meanwhile)
                                            savedHere({ id: localData.id }, function (prev) { return prev.map(function (s) { return (s.id === localData.id ? __assign(__assign({}, localData), { closed: s.closed, statusReason: s.statusReason }) : s); }); });
                                            logEvent("Dataverse PATCH Success (ID: ".concat(localData.id, ")"), 'success');
                                        }
                                        else {
                                            savedHere(localData, function (prev) { return [localData].concat(prev.filter(function (s) { return s.id !== localData.id; })); });
                                            logEvent("Dataverse POST Success (ID: ".concat(localData.id, ")"), 'success');
                                        }
                                        if (pictureFailure) {
                                            // Keep the form open on the saved record so "Update" retries only the picture instead of creating a duplicate
                                            if (mountedRef.current) {
                                                setEditingItem(localData);
                                                setSaveError("The observation was saved, but its picture could not be ".concat(picture.op === 'new' ? 'uploaded' : 'removed', ": ").concat(pictureFailure, " Press Update Observation to try the picture again."));
                                            }
                                        }
                                        else {
                                            setShowForm(false);
                                            setSelection(null);
                                            setEditingItem(null);
                                        }
                                        return [3 /*break*/, 18];
                                    case 16: return [4 /*yield*/, response.text()];
                                    case 17:
                                        errData = _a.sent();
                                        reason = "HTTP ".concat(response.status);
                                        try {
                                            reason = "".concat(JSON.parse(errData).error.message, " (HTTP ").concat(response.status, ")");
                                        }
                                        catch (e) { /* not a Dataverse error body */ }
                                        if (response.status === 404 && editingItem)
                                            reason = 'this observation no longer exists in Dataverse (HTTP 404)';
                                        setSaveError("Dataverse did not save the observation: ".concat(reason, ". Nothing was changed."));
                                        logEvent("Dataverse Save Failed: HTTP ".concat(response.status), 'error', { responseText: errData, payloadSent: dbPayload });
                                        _a.label = 18;
                                    case 18: return [3 /*break*/, 21];
                                    case 19:
                                        error_16 = _a.sent();
                                        setSaveError("The observation could not be sent: ".concat(error_16.message, ". Nothing was changed - try again."));
                                        logEvent("Dataverse Network Error: ".concat(error_16.message), 'error', dbPayload);
                                        return [3 /*break*/, 21];
                                    case 20:
                                        savingRef.current = false;
                                        setSaving(false);
                                        return [7 /*endfinally*/];
                                    case 21: return [2 /*return*/];
                                }
                            });
                        }); } })))))));
}
function SubmissionForm(_a) {
    var _this = this;
    var selection = _a.selection, mapKey = _a.mapKey, onSubmit = _a.onSubmit, logEvent = _a.logEvent, editingItem = _a.editingItem, pictureSupport = _a.pictureSupport, pictureFix = _a.pictureFix, equipmentColumns = _a.equipmentColumns, saving = _a.saving, saveError = _a.saveError;
    var _b = useState({
        image: null, // a NEW picture picked in this form (data URL). The picture already stored is shown via editingItem.
        room: (editingItem === null || editingItem === void 0 ? void 0 : editingItem.room) || '',
        area: (editingItem === null || editingItem === void 0 ? void 0 : editingItem.area) || '',
        equipmentList: editingItem && editingItem.equipmentList ? editingItem.equipmentList : [],
        description: (editingItem === null || editingItem === void 0 ? void 0 : editingItem.description) || '',
        whoToNotify: (editingItem === null || editingItem === void 0 ? void 0 : editingItem.whoToNotify) || '',
        category: (editingItem === null || editingItem === void 0 ? void 0 : editingItem.category) || 'note',
        customNote: (editingItem === null || editingItem === void 0 ? void 0 : editingItem.customNote) || ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    var _d = useState({ areas: [], areaIds: {}, rooms: [], areaIdColumn: '' }), places = _d[0], setPlaces = _d[1]; // shared area and room names (SHARED PLACE NAMES)
    useEffect(function () {
        var live = true;
        loadPlaceLists(logEvent).then(function (p) { if (live)
            setPlaces(p); });
        return function () { live = false; };
    }, [logEvent]);
    var _f = useState(false), removedStored = _f[0], setRemovedStored = _f[1]; // the user pressed Remove on the stored picture
    var _g = useState(false), storedMissing = _g[0], setStoredMissing = _g[1]; // the stored picture turned out not to exist / not to load
    var _h = useState(''), pictureError = _h[0], setPictureError = _h[1];
    var storedSources = editingItem ? pictureSources(editingItem) : [];
    var storedShown = storedSources.length > 0 && !removedStored && !storedMissing;
    var previewSources = formData.image ? [formData.image] : (storedShown ? storedSources : []);
    var handleStoredMissing = useCallback(function () { return setStoredMissing(true); }, []);
    var _j = useState(false), preparingPicture = _j[0], setPreparingPicture = _j[1];
    var pictureSeq = useRef(0); // each pick gets a number; Remove or a newer pick makes an older conversion's result be ignored
    // Stored ids are only trusted while they still name the same equipment (someone may have changed the names elsewhere).
    // One filtered query of at most MAX_EQUIPMENT rows; an id whose equipment now has another name becomes a text entry.
    useEffect(function () {
        var ids = (editingItem && editingItem.equipmentList ? editingItem.equipmentList : []).map(function (e) { return e.id; }).filter(Boolean).slice(0, MAX_EQUIPMENT);
        if (ids.length === 0)
            return undefined;
        var live = true;
        queryAssets(ids.map(function (id) { return "craa5___1_a_assetsid eq ".concat(id); }).join(' or '), MAX_EQUIPMENT).then(function (rows) {
            if (!live)
                return;
            var nameOf = {};
            rows.forEach(function (a) { nameOf[a.id] = a.name.replace(/;/g, ',').trim().toLowerCase(); });
            setFormData(function (prev) { return (__assign(__assign({}, prev), { equipmentList: prev.equipmentList.map(function (e) { return (e.id && nameOf[e.id] !== undefined && nameOf[e.id] !== e.name.trim().toLowerCase() ? __assign(__assign({}, e), { id: '' }) : e); }) })); });
        }).catch(function (err) { return logEvent("Could not check the attached equipment ids: ".concat(err.message), 'warn'); });
        return function () { live = false; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, for the observation the form was opened on
    var handleImageChange = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, mine, dataUrl_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = e.target.files && e.target.files[0];
                    e.target.value = ''; // picking the same file again must still fire onChange
                    if (!file)
                        return [2 /*return*/];
                    logEvent("Image selected: ".concat(file.name, " (").concat((file.size / 1024).toFixed(1), " KB)"), 'debug');
                    setPictureError('');
                    setPreparingPicture(true);
                    mine = ++pictureSeq.current;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, compressImage(file)];
                case 2:
                    dataUrl_1 = _a.sent();
                    if (mine !== pictureSeq.current)
                        return [2 /*return*/]; // Remove was pressed meanwhile: the picture stays removed
                    setFormData(function (prev) { return (__assign(__assign({}, prev), { image: dataUrl_1 })); });
                    logEvent("Image resized for upload: ".concat(Math.round(dataUrl_1.length * 0.75 / 1024), " KB JPEG"), 'debug');
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    if (mine !== pictureSeq.current)
                        return [2 /*return*/];
                    setPictureError(err_1.message);
                    logEvent("Image could not be prepared: ".concat(err_1.message), 'error', { fileName: file.name, fileType: file.type, sizeKB: Math.round(file.size / 1024) });
                    return [3 /*break*/, 5];
                case 4:
                    if (mine === pictureSeq.current)
                        setPreparingPicture(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveImage = function () {
        pictureSeq.current += 1; // a picture still being converted is dropped when it finishes
        setPreparingPicture(false);
        setFormData(function (prev) { return (__assign(__assign({}, prev), { image: null })); });
        setPictureError('');
        // Removing a stored picture means clearing it on the server when the form is saved
        if (storedSources.length > 0)
            setRemovedStored(true);
        logEvent('Picture removed from the form.', 'debug');
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (saving || preparingPicture)
            return;
        logEvent('Validating form data...', 'debug');
        var newErrors = {};
        if (!formData.area.trim())
            newErrors.area = "Area is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        // The names and ids share fixed-length text columns: say so here instead of letting Dataverse refuse the save
        var namesText = equipmentNamesText(formData.equipmentList);
        var idsText = equipmentIdsText(formData.equipmentList);
        if (equipmentColumns.equipmentMax && namesText.length > equipmentColumns.equipmentMax) {
            newErrors.equipment = "The equipment names are ".concat(namesText.length, " characters; the Equipment column holds ").concat(equipmentColumns.equipmentMax, ". Remove some equipment.");
        }
        else if (equipmentColumns.idColumn && equipmentColumns.idMax && idsText.length > equipmentColumns.idMax) {
            newErrors.equipment = "The equipment ids need ".concat(idsText.length, " characters; the ").concat(equipmentColumns.idColumn, " column holds ").concat(equipmentColumns.idMax, " (").concat(Math.max(1, Math.floor((equipmentColumns.idMax + 2) / 38)), " linked pieces). Remove some equipment.");
        }
        else if (editingItem && equipmentColumns.idsUnknown && namesText !== equipmentNamesText(editingItem.equipmentList || [])) {
            // Changing the names without rewriting the stored ids would pair the ids with the wrong names
            newErrors.equipment = "The equipment of a saved observation can't be changed right now: ".concat(equipmentColumns.reason, " Reload the page and try again.");
        }
        if (formData.category === 'note' && !formData.customNote.trim())
            newErrors.customNote = "Custom text is required for Notes";
        // The category and the note share one Dataverse column, so a note reading exactly like a category would become that category on reload
        else if (formData.category === 'note' && CATEGORIES.some(function (c) { return c.key !== 'note' && c.key === formData.customNote.trim().toLowerCase(); }))
            newErrors.customNote = "That is a category name - pick it from the Issue Category list instead";
        if (Object.keys(newErrors).length > 0) {
            logEvent('Form validation failed.', 'warn', newErrors);
            setErrors(newErrors);
            return;
        }
        logEvent('Form validation passed. Compiling payload mapped to live schema...', 'debug');
        // Area and room are saved in the shared spelling, so the other apps find the same place
        var roomText = placeToSave(places.rooms, formData.room);
        var areaText = placeToSave(places.areas, formData.area);
        var localData = __assign(__assign({ id: editingItem ? editingItem.id : "obs-".concat(Date.now()), mapX: selection.x + (selection.w / 2), mapY: selection.y + (selection.h / 2), boxW: selection.w, boxH: selection.h }, formData), { room: roomText, area: areaText, 
            // Without an id column only the names are saved: show them as text now, as they will look after a reload
            equipmentList: equipmentColumns.idColumn ? formData.equipmentList : formData.equipmentList.map(function (e) { return (__assign(__assign({}, e), { id: '' })); }), equipment: equipmentText(formData), 
            // formData.image is only a NEW picture; keep whatever is already stored unless the save changes it
            image: editingItem ? editingItem.image : null, picture: editingItem ? editingItem.picture : null, closed: editingItem ? !!editingItem.closed : false, statusReason: editingItem ? editingItem.statusReason || '' : '', modifiedOn: new Date().toISOString(), modifiedBy: currentUserName(), submittedBy: editingItem ? editingItem.submittedBy : currentUserName(), submittedOn: editingItem ? editingItem.submittedOn : new Date().toISOString() });
        // Mapped STRICTLY to Dataverse Schema Logical Names based on user's column specs
        var dbPayload = {
            craa5_mapx: parseFloat(localData.mapX.toFixed(4)),
            craa5_mapy: parseFloat(localData.mapY.toFixed(4)),
            craa5__boxwidth: parseFloat(localData.boxW.toFixed(4)),
            craa5__boxheight: parseFloat(localData.boxH.toFixed(4)),
            craa5__room: roomText,
            craa5__area: areaText,
            craa5__equipment: namesText,
            craa5__description: formData.description,
            craa5__whotonotify: formData.whoToNotify,
            craa5__customnote: formData.category === 'note' ? formData.customNote : formData.category
        };
        // The area's id (data contract: craa5_mssareaguid), cleared when the area is not an MSS area
        if (places.areaIdColumn)
            dbPayload[places.areaIdColumn] = areaIdOf(places, areaText);
        // A new problem belongs to the map on screen; an edit leaves its map as it is
        if (!editingItem) {
            dbPayload.craa5__facility = mapKey || 'MAIN';
            localData.mapKey = dbPayload.craa5__facility;
        }
        // The ids line up with the names (blank for typed text); only written when the table has a column for them
        if (equipmentColumns.idColumn)
            dbPayload[equipmentColumns.idColumn] = idsText;
        // new picture -> upload it; stored picture removed -> clear it; otherwise leave the picture alone
        var pictureChange = formData.image
            ? { op: 'new', dataUrl: formData.image }
            : (removedStored && storedSources.length > 0 && !storedMissing ? { op: 'removed' } : null);
        onSubmit(localData, dbPayload, pictureChange);
    };
    return (React.createElement("form", { onSubmit: handleSubmit, className: "space-y-5" },
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1" }, "Picture Upload"),
            !pictureSupport.ready && (React.createElement("div", { className: "mb-2 flex flex-col gap-1" },
                React.createElement("div", { className: "text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2" },
                    "Pictures cannot be saved yet: ",
                    pictureSupport.reason),
                pictureFix && (React.createElement(ColumnFix, { need: "Observation picture column", expected: "craa5_pictureof", expectedLabel: "Picture", expectedType: "Image", found: "", message: pictureSupport.missing ? '' : 'pick the column to use, or press Check again.', candidates: pictureSupport.candidates, picked: "", typed: pictureFix.typed, onPick: pictureFix.pick, onRecheck: pictureFix.recheck, checking: pictureFix.checking, testId: "observation-picture-fix" })))),
            React.createElement("div", { className: "mt-1 flex flex-col items-center justify-center gap-3 px-6 py-5 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50" },
                previewSources.length > 0 ? (React.createElement(React.Fragment, null,
                    React.createElement(StoredImage, { sources: previewSources, alt: "Preview", className: "max-h-48 object-contain rounded", onMissing: handleStoredMissing }),
                    React.createElement("div", { className: "flex flex-wrap justify-center gap-2" },
                        React.createElement("label", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm font-medium text-slate-700 focus-within:ring-2 focus-within:ring-[#0072CE]/40 ".concat(pictureSupport.ready && !preparingPicture ? 'cursor-pointer hover:bg-slate-100' : 'opacity-50 cursor-not-allowed') },
                            React.createElement(Camera, { className: "w-4 h-4" }),
                            " Replace picture",
                            React.createElement("input", { type: "file", accept: "image/*,.heic,.heif", className: "sr-only", onChange: handleImageChange, disabled: !pictureSupport.ready || preparingPicture })),
                        React.createElement("button", { type: "button", onClick: handleRemoveImage, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm font-medium text-red-600 hover:bg-red-50" },
                            React.createElement(X, { className: "w-4 h-4" }),
                            " Remove")))) : (React.createElement("label", { className: "space-y-1 text-center rounded-md focus-within:ring-2 focus-within:ring-[#0072CE]/40 ".concat(pictureSupport.ready && !preparingPicture ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed') },
                    React.createElement(Camera, { className: "mx-auto h-12 w-12 text-slate-400" }),
                    React.createElement("span", { className: "block text-sm font-medium text-[#0072CE]" }, "Take or upload a picture"),
                    React.createElement("span", { className: "block text-xs text-slate-500" }, "Any picture (PNG, WebP, an iPhone HEIC photo ...) is converted to a JPG and resized to 1600 px before saving"),
                    React.createElement("input", { id: "file-upload", name: "file-upload", type: "file", accept: "image/*,.heic,.heif", className: "sr-only", onChange: handleImageChange, disabled: !pictureSupport.ready || preparingPicture }))),
                preparingPicture && React.createElement("p", { className: "text-xs text-slate-500" }, "Converting the picture to a JPG..."),
                pictureError && React.createElement("p", { className: "text-xs text-red-600", role: "alert" }, pictureError))),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium text-slate-700" }, "Room"),
                React.createElement("input", { type: "text", list: "mst-room-list", autoComplete: "off", className: "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0072CE] focus:ring-[#0072CE] p-2 border", value: formData.room, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { room: e.target.value })); } }),
                React.createElement("datalist", { id: "mst-room-list" }, places.rooms.map(function (r) { return React.createElement("option", { key: r, value: r }); })),
                formData.room.trim() && places.rooms.length > 0 && !knownPlace(places.rooms, formData.room) && (React.createElement("p", { className: "text-amber-700 text-xs mt-1" }, "Not a room of the equipment table. It is saved as typed, but the other apps will not match it."))),
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium text-slate-700" },
                    "Area ",
                    React.createElement("span", { className: "text-red-500" }, "*")),
                React.createElement("input", { type: "text", className: "mt-1 block w-full rounded-md shadow-sm focus:border-[#0072CE] focus:ring-[#0072CE] p-2 border ".concat(errors.area ? 'border-red-500' : 'border-slate-300'), list: "mst-area-list", autoComplete: "off", value: formData.area, onChange: function (e) { setFormData(__assign(__assign({}, formData), { area: e.target.value })); setErrors(__assign(__assign({}, errors), { area: null })); } }),
                React.createElement("datalist", { id: "mst-area-list" }, places.areas.map(function (a) { return React.createElement("option", { key: a, value: a }); })),
                errors.area && React.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors.area),
                !errors.area && formData.area.trim() && places.areas.length > 0 && !knownPlace(places.areas, formData.area) && (React.createElement("p", { className: "text-amber-700 text-xs mt-1" }, "Not a known area. It is saved as typed, but the other apps will not match it."))),
            React.createElement("div", { className: "md:col-span-2" },
                React.createElement("label", { className: "block text-sm font-medium text-slate-700" }, "Who to Notify"),
                React.createElement("input", { type: "text", className: "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0072CE] focus:ring-[#0072CE] p-2 border", value: formData.whoToNotify, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { whoToNotify: e.target.value })); }, placeholder: "e.g. Maintenance, Safety Officer" }))),
        React.createElement(EquipmentPicker, { value: formData.equipmentList, onChange: function (list) { setFormData(function (prev) { return (__assign(__assign({}, prev), { equipmentList: list })); }); setErrors(function (prev) { return (__assign(__assign({}, prev), { equipment: null })); }); }, onPlace: function (asset) {
                setFormData(function (prev) { return (__assign(__assign({}, prev), { room: prev.room.trim() ? prev.room : asset.room, area: prev.area.trim() ? prev.area : asset.area })); });
                if (asset.area)
                    setErrors(function (prev) { return (__assign(__assign({}, prev), { area: null })); });
            }, room: formData.room, area: formData.area, equipmentColumns: equipmentColumns, error: errors.equipment, logEvent: logEvent }),
        React.createElement("div", null,
            React.createElement("label", { className: "block text-sm font-medium text-slate-700" },
                "Description ",
                React.createElement("span", { className: "text-red-500" }, "*")),
            React.createElement("textarea", { rows: "3", className: "mt-1 block w-full rounded-md shadow-sm focus:border-[#0072CE] focus:ring-[#0072CE] p-2 border ".concat(errors.description ? 'border-red-500' : 'border-slate-300'), value: formData.description, onChange: function (e) { setFormData(__assign(__assign({}, formData), { description: e.target.value })); setErrors(__assign(__assign({}, errors), { description: null })); } }),
            errors.description && React.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors.description)),
        React.createElement("div", { className: "bg-slate-50 p-4 rounded-lg border border-slate-200" },
            React.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-2" }, "Issue Category"),
            React.createElement("select", { className: "block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0072CE] focus:ring-[#0072CE] p-2 border", value: formData.category, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { category: e.target.value })); } }, CATEGORIES.map(function (c) { return (React.createElement("option", { key: c.key, value: c.key }, c.key === 'note' ? 'Note (Custom)' : c.label)); })),
            formData.category === 'note' && (React.createElement("div", { className: "mt-3" },
                React.createElement("label", { className: "block text-sm font-medium text-slate-700" },
                    "Custom Text ",
                    React.createElement("span", { className: "text-red-500" }, "*")),
                React.createElement("input", { type: "text", className: "mt-1 block w-full rounded-md shadow-sm focus:border-[#0072CE] focus:ring-[#0072CE] p-2 border ".concat(errors.customNote ? 'border-red-500' : 'border-slate-300'), value: formData.customNote, onChange: function (e) { setFormData(__assign(__assign({}, formData), { customNote: e.target.value })); setErrors(__assign(__assign({}, errors), { customNote: null })); }, placeholder: "Enter custom category note..." }),
                errors.customNote && React.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors.customNote)))),
        saveError && (React.createElement("div", { className: "text-sm bg-red-50 border border-red-200 text-red-800 rounded-lg p-3", role: "alert" }, saveError)),
        React.createElement("div", { className: "pt-4 flex justify-end" },
            React.createElement("button", { type: "submit", disabled: saving || preparingPicture, className: "bg-[#0072CE] text-white px-6 py-2 rounded-lg shadow hover:bg-[#00468B] focus:ring-4 focus:ring-[#0072CE]/30 transition-all font-medium text-lg disabled:opacity-60 disabled:cursor-not-allowed" }, saving ? 'Saving...' : (editingItem ? 'Update Observation' : 'Submit Observation')))));
}
// ==========================================
// EQUIPMENT PICKER: attach equipment from the equipment table (craa5___1_a_assets) by search or by ticking a room's list.
// Every lookup is a filtered query of at most 100 rows; the equipment table is never loaded whole.
// ==========================================
var EMPTY_RESULTS = { mode: null, label: '', rows: [], loading: false, error: '', limit: 0, retry: null };
function EquipmentPicker(_a) {
    var _this = this;
    var value = _a.value, onChange = _a.onChange, onPlace = _a.onPlace, room = _a.room, area = _a.area, equipmentColumns = _a.equipmentColumns, error = _a.error, logEvent = _a.logEvent;
    var _b = useState(''), text = _b[0], setText = _b[1];
    var _c = useState(EMPTY_RESULTS), results = _c[0], setResults = _c[1];
    var _d = useState(''), notice = _d[0], setNotice = _d[1];
    var requestRef = useRef(0); // only the newest lookup may fill the list
    var modeRef = useRef(null); // which kind of lookup the list shows: 'search' | 'place' | null
    var searchTimerRef = useRef(null); // the typed search still waiting out its pause
    var cancelPendingSearch = function () {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
            searchTimerRef.current = null;
        }
    };
    var cacheRef = useRef({}); // lookups already answered, by mode + text
    var mountedRef = useRef(true);
    useEffect(function () { mountedRef.current = true; return function () { mountedRef.current = false; }; }, []);
    var run = useCallback(function (mode, key, label, limit, loader) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, request, retry, hit, out, found, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "".concat(mode, "|").concat(key.toLowerCase());
                    request = ++requestRef.current;
                    modeRef.current = mode;
                    retry = function () { delete cacheRef.current[cacheKey]; run(mode, key, label, limit, loader); };
                    hit = cacheRef.current[cacheKey];
                    if (hit) {
                        setResults({ mode: mode, label: hit.label, rows: hit.rows, loading: false, error: '', limit: limit, retry: retry });
                        return [2 /*return*/];
                    }
                    setResults(function (prev) { return ({ mode: mode, label: label, rows: prev.mode === mode ? prev.rows : [], loading: true, error: '', limit: limit, retry: retry }); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loader()];
                case 2:
                    out = _a.sent();
                    found = Array.isArray(out) ? { rows: out, label: label } : { rows: out.rows, label: out.label || label };
                    cacheRef.current[cacheKey] = found;
                    logEvent("Equipment lookup (".concat(found.label, "): ").concat(found.rows.length, " found."), 'debug');
                    if (mountedRef.current && request === requestRef.current)
                        setResults({ mode: mode, label: found.label, rows: found.rows, loading: false, error: '', limit: limit, retry: retry });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    logEvent("Equipment lookup failed (".concat(label, "): ").concat(err_2.message), 'error');
                    if (mountedRef.current && request === requestRef.current)
                        setResults({ mode: mode, label: label, rows: [], loading: false, error: err_2.message, limit: limit, retry: retry });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [logEvent]);
    // Search as the user types (a short pause first, at least 2 characters)
    useEffect(function () {
        var q = text.trim();
        if (q.length < 2) {
            // Clearing the search box closes a search list (and drops its pending answer), never a room list
            if (modeRef.current === 'search') {
                requestRef.current += 1;
                modeRef.current = null;
                setResults(EMPTY_RESULTS);
            }
            return undefined;
        }
        var timer = setTimeout(function () {
            searchTimerRef.current = null;
            run('search', q, "Equipment matching \"".concat(q, "\""), ASSET_SEARCH_LIMIT, function () { return searchAssets(q); });
        }, 300);
        searchTimerRef.current = timer;
        return function () {
            clearTimeout(timer);
            if (searchTimerRef.current === timer)
                searchTimerRef.current = null;
        };
    }, [text, run]);
    var placeLabel = [room.trim(), area.trim()].filter(Boolean).join(' / ');
    var listPlace = function () {
        var r = room.trim();
        var a = area.trim();
        if (!r)
            return;
        cancelPendingSearch(); // the list just asked for must not be replaced by a search typed a moment ago
        run('place', "".concat(r, "|").concat(a), "Equipment in ".concat(placeLabel), ASSET_PLACE_LIMIT, function () { return __awaiter(_this, void 0, void 0, function () {
            var found;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, assetsInPlace(r, a)];
                    case 1:
                        found = _a.sent();
                        return [2 /*return*/, {
                                rows: found.rows,
                                label: a && !found.areaMatched ? "Equipment in ".concat(r, " (none listed for area \"").concat(a, "\", showing the whole room)") : "Equipment in ".concat(placeLabel)
                            }];
                }
            });
        }); });
    };
    var isAttached = function (asset) { return value.some(function (e) { return e.id && e.id === asset.id; }); };
    var toggle = function (asset) {
        setNotice('');
        if (isAttached(asset)) {
            onChange(value.filter(function (e) { return e.id !== asset.id; }));
            return;
        }
        if (value.length >= MAX_EQUIPMENT) {
            setNotice("At most ".concat(MAX_EQUIPMENT, " pieces of equipment per observation."));
            return;
        }
        onChange(value.concat([{ id: asset.id, name: asset.name, room: asset.room, area: asset.area }]));
        onPlace(asset);
    };
    var typed = text.trim();
    var typedTaken = typed !== '' && value.some(function (e) { return e.name.toLowerCase() === typed.toLowerCase(); });
    var addText = function () {
        if (!typed || typedTaken)
            return;
        if (value.length >= MAX_EQUIPMENT) {
            setNotice("At most ".concat(MAX_EQUIPMENT, " pieces of equipment per observation."));
            return;
        }
        onChange(value.concat([{ id: '', name: typed.replace(/;/g, ','), room: '', area: '' }]));
        setText('');
        setNotice('');
    };
    var remove = function (index) { onChange(value.filter(function (e, i) { return i !== index; })); setNotice(''); };
    return (React.createElement("div", { className: "bg-[#F7F9FC] p-4 rounded-lg border border-[#B3D4F2]" },
        React.createElement("div", { className: "flex flex-wrap items-baseline justify-between gap-2 mb-2" },
            React.createElement("label", { htmlFor: "equipment-search", className: "block text-sm font-bold text-[#00468B]" }, "Equipment"),
            React.createElement("span", { className: "text-xs text-slate-500" }, "Attach the equipment this request is about. Search, or list the room's equipment and tick it.")),
        value.length > 0 && (React.createElement("ul", { className: "flex flex-wrap gap-1.5 mb-3", "aria-label": "Attached equipment" }, value.map(function (e, i) { return (React.createElement("li", { key: "".concat(e.id || 'text', "-").concat(i), className: "inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md text-xs font-semibold border max-w-full ".concat(e.id ? 'bg-white text-[#00468B] border-[#0072CE]/40' : 'bg-slate-100 text-slate-700 border-slate-300'), title: e.id ? [e.room, e.area].filter(Boolean).join(' / ') || 'Linked to the equipment table' : 'Typed text, not linked to the equipment table' },
            React.createElement("span", { className: "[overflow-wrap:anywhere]" }, e.name),
            !e.id && React.createElement("span", { className: "text-[10px] font-normal text-slate-500" }, "(text)"),
            React.createElement("button", { type: "button", onClick: function () { return remove(i); }, className: "p-0.5 rounded hover:bg-[#FDE8EC] hover:text-[#C4001F]", "aria-label": "Remove ".concat(e.name) },
                React.createElement(X, { className: "w-3 h-3" })))); }))),
        React.createElement("div", { className: "flex flex-wrap gap-2" },
            React.createElement("div", { className: "relative flex-1 min-w-[200px]" },
                React.createElement(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" }),
                React.createElement("input", { id: "equipment-search", type: "search", value: text, onChange: function (e) { return setText(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Enter')
                        e.preventDefault(); }, placeholder: "Search equipment by name, room or area...", autoComplete: "off", className: "w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/40 focus:border-[#0072CE]" })),
            React.createElement("button", { type: "button", onClick: listPlace, disabled: !room.trim(), title: room.trim() ? "List the equipment in ".concat(placeLabel) : 'Fill in the Room first', className: "px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-white text-[#0072CE] border border-[#B3D4F2] hover:bg-[#E6F1FB] disabled:opacity-50 disabled:cursor-not-allowed" }, room.trim() ? "List ".concat(placeLabel) : 'List room equipment'),
            React.createElement("button", { type: "button", onClick: addText, disabled: !typed || typedTaken, title: "Attach what you typed as text, without a link to the equipment table", className: "px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed" }, "Add as text")),
        results.mode && (React.createElement("div", { className: "mt-3 bg-white border border-slate-200 rounded-md" },
            React.createElement("div", { className: "flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-100" },
                React.createElement("span", { className: "text-xs font-bold text-[#00468B] [overflow-wrap:anywhere]" }, results.label),
                React.createElement("button", { type: "button", onClick: function () { cancelPendingSearch(); requestRef.current += 1; modeRef.current = null; setResults(EMPTY_RESULTS); }, className: "text-xs font-semibold text-[#0072CE] hover:underline shrink-0" }, "Done")),
            React.createElement("div", { role: "status", className: "sr-only" }, results.loading ? 'Looking up equipment' : "".concat(results.rows.length, " equipment found")),
            results.loading && React.createElement("p", { className: "px-3 py-2 text-xs text-slate-500" }, "Looking up equipment..."),
            results.error && (React.createElement("p", { className: "px-3 py-2 text-xs text-[#C4001F]", role: "alert" },
                "The equipment table did not answer: ",
                results.error,
                ' ',
                results.retry && React.createElement("button", { type: "button", onClick: results.retry, className: "underline font-semibold" }, "Retry"))),
            !results.loading && !results.error && results.rows.length === 0 && (React.createElement("p", { className: "px-3 py-2 text-xs text-slate-500" }, results.mode === 'search'
                ? 'No equipment found. You can still attach what you typed with Add as text.'
                : "No equipment listed for room \"".concat(room.trim(), "\". Check the Room spelling, or search by name above (you can also type the equipment there and press Add as text)."))),
            results.rows.length > 0 && (React.createElement("ul", { className: "max-h-60 overflow-y-auto divide-y divide-slate-100" }, results.rows.map(function (asset) { return (React.createElement("li", { key: asset.id },
                React.createElement("label", { className: "flex items-start gap-2 px-3 py-2 cursor-pointer hover:bg-[#E6F1FB]" },
                    React.createElement("input", { type: "checkbox", className: "mt-0.5 accent-[#0072CE]", checked: isAttached(asset), onChange: function () { return toggle(asset); } }),
                    React.createElement("span", { className: "min-w-0" },
                        React.createElement("span", { className: "block text-sm font-medium text-slate-800 [overflow-wrap:anywhere]" }, asset.name),
                        React.createElement("span", { className: "block text-[11px] text-slate-500" }, [asset.room, asset.area].filter(Boolean).join(' / ') || 'No room / area'))))); }))),
            !results.loading && results.rows.length >= results.limit && results.limit > 0 && (React.createElement("p", { className: "px-3 py-2 text-[11px] text-slate-500 border-t border-slate-100" },
                "Showing the first ",
                results.limit,
                ". ",
                results.mode === 'search' ? 'Type more of the name to narrow it down.' : 'Search by name to find the rest.')))),
        notice && React.createElement("p", { className: "text-xs text-[#8A5A00] mt-2", role: "alert" }, notice),
        error && React.createElement("p", { className: "text-red-600 text-xs mt-2", role: "alert" }, error),
        !equipmentColumns.idColumn && (React.createElement("p", { className: "text-[11px] text-slate-500 mt-2" },
            "Equipment is saved by name: ",
            equipmentColumns.reason))));
}
// ==========================================
// TAB 2: GALLERY VIEW
// ==========================================
function GalleryTab(_a) {
    var submissions = _a.submissions, categoryBar = _a.categoryBar, logEvent = _a.logEvent, onEdit = _a.onEdit, onSetClosed = _a.onSetClosed, liveItems = _a.liveItems;
    var _b = useState('combined'), groupBy = _b[0], setGroupBy = _b[1]; // 'combined' means Room -> Area -> Equipment
    var _c = useState(null), selectedItem = _c[0], setSelectedItem = _c[1];
    // Group logic
    var groupedData = useMemo(function () {
        return submissions.reduce(function (acc, sub) {
            var key = 'Other';
            if (groupBy === 'combined') {
                key = [sub.room, sub.area, sub.equipment].filter(Boolean).join(' > ') || 'Unassigned Location';
            }
            else if (groupBy === 'category') {
                key = categoryMeta(sub.category).label;
            }
            else {
                key = sub[groupBy] || "No ".concat(groupBy);
            }
            if (!acc[key])
                acc[key] = [];
            acc[key].push(sub);
            return acc;
        }, {});
    }, [submissions, groupBy]);
    var handleDoubleClick = function (item) {
        logEvent("Gallery item double-clicked. ID: ".concat(item.id), 'info');
        setSelectedItem(item);
    };
    return (React.createElement("div", { className: "h-full flex flex-col bg-slate-100 p-6 overflow-auto" },
        React.createElement(LoadedNote, { loaded: categoryBar.loaded, query: categoryBar.query, showClosed: categoryBar.status !== 'open', className: "mb-2" }),
        React.createElement("div", { className: "flex flex-wrap gap-3 justify-between items-center mb-4" },
            React.createElement("h2", { className: "text-2xl font-black text-[#00468B]" }, "Observation Gallery"),
            React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                React.createElement(SearchBox, { query: categoryBar.query, onQuery: categoryBar.onQuery, className: "w-full sm:w-72" }),
                React.createElement("div", { className: "flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm" },
                    React.createElement("label", { className: "text-sm text-slate-600 font-medium" }, "Group By:"),
                    React.createElement("select", { className: "border-slate-300 rounded text-sm p-1", value: groupBy, onChange: function (e) { setGroupBy(e.target.value); logEvent("Gallery grouping changed to: ".concat(e.target.value), 'debug'); } },
                        React.createElement("option", { value: "combined" }, "Location (Room/Area/Equip)"),
                        React.createElement("option", { value: "category" }, "Category"),
                        React.createElement("option", { value: "area" }, "Area Only"),
                        React.createElement("option", { value: "submittedBy" }, "Submitter"))))),
        React.createElement(CategoryFilterBar, __assign({}, categoryBar, { className: "mb-6 shrink-0" })),
        React.createElement("div", { className: "space-y-8 pb-12" },
            Object.entries(groupedData).map(function (_a) {
                var groupName = _a[0], items = _a[1];
                return (React.createElement("div", { key: groupName, className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" },
                    React.createElement("div", { className: "bg-slate-50 border-b border-slate-200 px-4 py-3 font-semibold text-slate-700 text-lg flex items-center gap-2" },
                        React.createElement(Search, { className: "w-5 h-5 text-slate-400" }),
                        " ",
                        groupName,
                        React.createElement("span", { className: "text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full ml-auto" },
                            items.length,
                            " items")),
                    React.createElement("div", { className: "p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" }, items.map(function (item) { return (React.createElement("div", { key: item.id, onDoubleClick: function () { return handleDoubleClick(item); }, className: "group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-[#0072CE] ".concat(item.closed ? 'border-slate-300 opacity-80' : 'border-slate-200') },
                        React.createElement("div", { className: "aspect-video bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100" },
                            React.createElement(StoredImage, { sources: pictureSources(item), alt: "Observation", className: "w-full h-full object-cover group-hover:scale-105 transition-transform", fallback: React.createElement(ImageIcon, { className: "w-10 h-10 text-slate-300" }) })),
                        React.createElement("div", { className: "p-3 space-y-1" },
                            React.createElement("div", { className: "flex justify-between items-start" },
                                React.createElement("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 max-w-[65%]" },
                                    React.createElement("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { backgroundColor: categoryMeta(item.category).color } }),
                                    React.createElement("span", { className: "truncate" }, categoryText(item))),
                                React.createElement("span", { className: "flex items-center gap-1 shrink-0" },
                                    React.createElement(StatusBadge, { item: item }),
                                    React.createElement("span", { className: "text-[10px] text-slate-500" }, new Date(item.submittedOn).toLocaleDateString()))),
                            React.createElement("p", { className: "text-sm font-medium text-slate-800 line-clamp-1" }, item.description),
                            React.createElement("p", { className: "text-xs text-slate-500" },
                                "By: ",
                                item.submittedBy)),
                        React.createElement("div", { className: "absolute inset-0 bg-[#00468B]/0 group-hover:bg-[#00468B]/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none" },
                            React.createElement("span", { className: "bg-slate-900 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all" },
                                React.createElement(Maximize2, { className: "w-3 h-3" }),
                                " Double-click to expand")))); }))));
            }),
            Object.keys(groupedData).length === 0 && (React.createElement("div", { className: "text-center text-slate-500 py-12" }, categoryBar.narrowed ? (React.createElement(React.Fragment, null,
                "No observations match the search and filters.",
                ' ',
                React.createElement("button", { type: "button", onClick: categoryBar.onClearAll, className: "text-[#0072CE] underline hover:text-[#00468B]" }, "Clear search and filters"))) : 'No observations submitted yet.'))),
        React.createElement(DetailModal, { selectedItem: selectedItem && (liveItems[selectedItem.id] || selectedItem), onClose: function () { return setSelectedItem(null); }, onEdit: function (item) { setSelectedItem(null); onEdit(item); }, onSetClosed: onSetClosed })));
}
// ==========================================
// TAB 3: ACTION ITEM RAIL (rolling list - replaces the old raw table)
// ==========================================
var RAIL_PAGE = 30; // cards that roll in at a time as the user scrolls
var THUMB_SIZE = 80; // px, square location / photo thumbnails
var THUMB_MAP_WIDTH = 480; // px the whole map is drawn at inside a location thumbnail
// Natural width/height of the map, so location thumbnails are cropped without squashing the picture
function useImageAspect(src) {
    var _a = useState(null), aspect = _a[0], setAspect = _a[1];
    useEffect(function () {
        if (!src) {
            setAspect(null);
            return undefined;
        }
        var cancelled = false;
        var img = new Image();
        img.onload = function () { if (!cancelled && img.naturalHeight)
            setAspect(img.naturalWidth / img.naturalHeight); };
        img.src = src;
        return function () { cancelled = true; };
    }, [src]);
    return aspect;
}
// Crop of the facility map centred exactly on the reported box
function MapThumb(_a) {
    var item = _a.item, mapImage = _a.mapImage, aspect = _a.aspect;
    if (!mapImage || !aspect) {
        return React.createElement("div", { className: "w-20 h-20 shrink-0 bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center text-[10px] text-slate-400" }, "N/A");
    }
    var color = itemColor(item);
    var mapW = THUMB_MAP_WIDTH;
    var mapH = mapW / aspect;
    var boxW = Math.min(THUMB_SIZE, Math.max(8, (item.boxW / 100) * mapW));
    var boxH = Math.min(THUMB_SIZE, Math.max(8, (item.boxH / 100) * mapH));
    return (React.createElement("div", { className: "w-20 h-20 shrink-0 rounded-lg border border-slate-300 shadow-sm relative overflow-hidden bg-slate-200", title: "Where this was reported", style: {
            backgroundImage: "url(".concat(mapImage, ")"),
            backgroundRepeat: 'no-repeat',
            backgroundSize: "".concat(mapW, "px ").concat(mapH, "px"),
            backgroundPosition: "".concat(THUMB_SIZE / 2 - (item.mapX / 100) * mapW, "px ").concat(THUMB_SIZE / 2 - (item.mapY / 100) * mapH, "px")
        } },
        React.createElement("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 rounded-sm", style: { width: boxW, height: boxH, borderColor: color, backgroundColor: "".concat(color, "33") } })));
}
function PhotoThumb(_a) {
    var item = _a.item, label = _a.label, onClick = _a.onClick;
    var _b = useState(false), missing = _b[0], setMissing = _b[1];
    var sources = pictureSources(item, true);
    var key = sources.join('|');
    useEffect(function () { setMissing(false); }, [key]);
    var handleMissing = useCallback(function () { return setMissing(true); }, []);
    if (sources.length === 0 || missing)
        return null;
    return (React.createElement("button", { type: "button", onClick: onClick, title: "View photo", "aria-label": "View photo for ".concat(label), className: "w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-slate-100 hover:ring-2 hover:ring-[#0072CE] transition" },
        React.createElement(StoredImage, { sources: sources, alt: "Observation", className: "w-full h-full object-cover", onMissing: handleMissing })));
}
function RailCard(_a) {
    var item = _a.item, mapImage = _a.mapImage, aspect = _a.aspect, onLocate = _a.onLocate, onOpen = _a.onOpen, onEdit = _a.onEdit, onPickCategory = _a.onPickCategory, onSetClosed = _a.onSetClosed;
    var meta = categoryMeta(item.category);
    var place = [item.room, item.area].filter(Boolean).join(' / ');
    // Picking a category re-flows the list, so the second click of a double-click can land somewhere else (another card,
    // or the same card's text). Only a double-click whose two clicks were both on this card's body jumps to the map.
    var recentClicks = useRef([]);
    return (React.createElement("article", { "aria-label": "".concat(categoryText(item), ": ").concat(place || 'Unassigned location'), onClick: function (e) { var now = Date.now(); recentClicks.current = __spreadArray(__spreadArray([], recentClicks.current.filter(function (c) { return now - c.at < 600; }), true), [{ at: now, onButton: !!e.target.closest('button') }], false); }, onDoubleClick: function (e) { var last = recentClicks.current.slice(-2); if (!e.target.closest('button') && last.length === 2 && last.every(function (c) { return !c.onButton; }))
            onLocate(item); }, title: "Double-click to jump to this location on the map", className: "group rounded-xl border shadow-sm hover:shadow-md hover:border-[#0072CE]/40 transition-all flex flex-col sm:flex-row gap-3 p-3 sm:p-4 ".concat(item.closed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'), style: { borderLeft: "4px solid ".concat(itemColor(item)) }, "data-status": item.closed ? 'closed' : 'open' },
        React.createElement("div", { className: "flex sm:flex-col gap-2 shrink-0" },
            React.createElement(MapThumb, { item: item, mapImage: mapImage, aspect: aspect }),
            React.createElement(PhotoThumb, { item: item, label: place || 'this item', onClick: function () { return onOpen(item); } })),
        React.createElement("div", { className: "flex-1 min-w-0" },
            React.createElement("div", { className: "flex flex-wrap items-center gap-2 mb-1.5" },
                React.createElement("button", { type: "button", onClick: function () { return onPickCategory(item.category); }, title: "Show only this category", className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border max-w-full", style: { color: meta.color, borderColor: "".concat(meta.color, "55"), backgroundColor: "".concat(meta.color, "14") } },
                    React.createElement("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { backgroundColor: meta.color } }),
                    React.createElement("span", { className: "truncate" }, categoryText(item))),
                React.createElement(StatusBadge, { item: item }),
                React.createElement("time", { dateTime: item.submittedOn, className: "text-xs text-slate-600", title: new Date(item.submittedOn).toLocaleString() },
                    formatWhen(item.submittedOn),
                    recentAgo(item.submittedOn) && React.createElement("span", { className: "text-slate-500" },
                        " - ",
                        recentAgo(item.submittedOn)))),
            React.createElement("h4", { className: "font-semibold text-sm sm:text-base [overflow-wrap:anywhere] ".concat(item.closed ? 'text-slate-500' : 'text-slate-800') }, place || 'Unassigned location'),
            item.equipmentList && item.equipmentList.length > 0 && (React.createElement("ul", { className: "mt-1 flex flex-wrap gap-1", "aria-label": "Equipment" }, item.equipmentList.map(function (e, i) { return (React.createElement("li", { key: "".concat(e.id || 'text', "-").concat(i), className: "px-1.5 py-0.5 rounded text-[11px] font-semibold border [overflow-wrap:anywhere] ".concat(e.id ? 'bg-[#E6F1FB] text-[#00468B] border-[#B3D4F2]' : 'bg-slate-100 text-slate-700 border-slate-200') }, e.name)); }))),
            React.createElement("p", { className: "text-sm text-slate-600 mt-1 line-clamp-3 whitespace-pre-wrap break-words" }, item.description),
            React.createElement("div", { className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600" },
                item.whoToNotify && React.createElement("span", { className: "min-w-0 max-w-full [overflow-wrap:anywhere]" },
                    "Notify: ",
                    React.createElement("span", { className: "font-medium text-slate-700" }, item.whoToNotify)),
                React.createElement("span", { className: "min-w-0 max-w-full [overflow-wrap:anywhere]" },
                    "By ",
                    React.createElement("span", { className: "font-medium text-slate-700" }, item.submittedBy)),
                item.closed && React.createElement("span", { className: "min-w-0 max-w-full [overflow-wrap:anywhere]" },
                    "Closed (last change) ",
                    formatWhen(item.modifiedOn),
                    item.modifiedBy ? " by ".concat(item.modifiedBy) : '')),
            React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" },
                React.createElement("button", { type: "button", onClick: function () { return onLocate(item); }, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0072CE] text-white text-xs font-semibold hover:bg-[#00468B] shadow-sm" },
                    React.createElement(MapPin, { className: "w-3.5 h-3.5" }),
                    " Locate on map"),
                React.createElement("button", { type: "button", onClick: function () { return onOpen(item); }, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-100" },
                    React.createElement(Maximize2, { className: "w-3.5 h-3.5" }),
                    " Details"),
                React.createElement("button", { type: "button", onClick: function () { return onEdit(item); }, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-100" },
                    React.createElement(PencilIcon, { className: "w-3.5 h-3.5" }),
                    " Edit"),
                React.createElement(CloseButton, { item: item, onSetClosed: onSetClosed, compact: true })))));
}
function TableTab(_a) {
    var submissions = _a.submissions, timeFilteredCount = _a.timeFilteredCount, timeFilter = _a.timeFilter, categoryBar = _a.categoryBar, mapImage = _a.mapImage, logEvent = _a.logEvent, onLocate = _a.onLocate, onEdit = _a.onEdit, onSetClosed = _a.onSetClosed, liveItems = _a.liveItems;
    var _b = useState(null), selectedItem = _b[0], setSelectedItem = _b[1];
    var _c = useState(RAIL_PAGE), visibleCount = _c[0], setVisibleCount = _c[1];
    var scrollRef = useRef(null);
    var sentinelRef = useRef(null);
    var aspect = useImageAspect(mapImage);
    // Newest first (the shared search, status and category filters already narrowed `submissions`)
    var items = useMemo(function () { return submissions.slice().sort(function (a, b) { return new Date(b.submittedOn) - new Date(a.submittedOn); }); }, [submissions]);
    // Roll back to the top when the search, a filter or the timeframe changes - not when one item is closed, reopened
    // or edited in place, so someone working down the list keeps their place
    var filterKey = [categoryBar.query.trim().toLowerCase(), categoryBar.status, categoryBar.selected.join('|'), timeFilter].join('#');
    useEffect(function () {
        setVisibleCount(RAIL_PAGE);
        if (scrollRef.current)
            scrollRef.current.scrollTop = 0;
    }, [filterKey]);
    // Roll more cards in as the end of the list comes into view
    var hasMore = visibleCount < items.length;
    useEffect(function () {
        if (!hasMore)
            return undefined;
        if (typeof IntersectionObserver === 'undefined') {
            setVisibleCount(items.length);
            return undefined;
        }
        var node = sentinelRef.current;
        if (!node)
            return undefined;
        var observer = new IntersectionObserver(function (entries) {
            if (entries.some(function (entry) { return entry.isIntersecting; }))
                setVisibleCount(function (count) { return count + RAIL_PAGE; });
        }, { root: scrollRef.current, rootMargin: '400px 0px' });
        observer.observe(node);
        return function () { return observer.disconnect(); };
    }, [hasMore, visibleCount, items.length]);
    // Day groups: Today / Yesterday / 2-7 days ago / ...
    var groups = useMemo(function () {
        var out = [];
        items.slice(0, visibleCount).forEach(function (item) {
            var label = dayBucket(item.submittedOn);
            var last = out[out.length - 1];
            if (last && last.label === label)
                last.items.push(item);
            else
                out.push({ label: label, items: [item] });
        });
        return out;
    }, [items, visibleCount]);
    var locate = function (item) { logEvent("Action rail: locating ".concat(item.id, " on the map"), 'info'); onLocate(item); };
    var open = function (item) { logEvent("Action rail: opened details for ".concat(item.id), 'info'); setSelectedItem(item); };
    var pickCategory = function (key) { return categoryBar.onOnly(key); };
    var hasNarrowing = categoryBar.narrowed;
    return (React.createElement("div", { className: "h-full flex flex-col bg-slate-100" },
        React.createElement("div", { className: "shrink-0 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 py-4 space-y-3 z-10 [@media(max-height:520px)]:py-2 [@media(max-height:520px)]:space-y-1" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-xl font-black text-[#00468B] flex items-center gap-2" },
                        React.createElement(TableIcon, { className: "text-[#0072CE]" }),
                        "Action Item Rail"),
                    React.createElement("p", { className: "text-sm text-slate-600 mt-1 [@media(max-height:520px)]:hidden" }, "Newest first. Scroll to roll through every item; double-click a card (or press Locate) to jump to it on the map.")),
                React.createElement(SearchBox, { query: categoryBar.query, onQuery: categoryBar.onQuery, className: "w-full sm:w-72" })),
            React.createElement(CategoryFilterBar, __assign({}, categoryBar)),
            React.createElement("div", { role: "status", className: "text-xs text-slate-600" },
                "Showing ",
                React.createElement("span", { className: "font-bold text-slate-700" }, items.length),
                " of ",
                timeFilteredCount,
                " loaded items in this timeframe"),
            React.createElement(LoadedNote, { loaded: categoryBar.loaded, query: categoryBar.query, showClosed: categoryBar.status !== 'open' })),
        React.createElement("div", { ref: scrollRef, className: "flex-1 overflow-y-auto overflow-x-hidden" },
            React.createElement("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 pb-8" },
                groups.map(function (group) { return (React.createElement("section", { key: group.label },
                    React.createElement("h3", { className: "sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-slate-100/95 backdrop-blur text-xs font-bold uppercase tracking-wider text-slate-600" }, group.label),
                    React.createElement("ol", { className: "relative ml-3 border-l-2 border-slate-300 space-y-3 py-3 list-none" }, group.items.map(function (item) { return (React.createElement("li", { key: item.id, className: "relative pl-6" },
                        React.createElement("span", { className: "absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 border-white shadow", style: { backgroundColor: itemColor(item) }, "aria-hidden": "true" }),
                        React.createElement(RailCard, { item: item, mapImage: mapImage, aspect: aspect, onLocate: locate, onOpen: open, onEdit: onEdit, onPickCategory: pickCategory, onSetClosed: onSetClosed }))); })))); }),
                hasMore && React.createElement("div", { ref: sentinelRef, className: "py-6 text-center text-xs text-slate-500" }, "Rolling in more items..."),
                !hasMore && items.length > 0 && React.createElement("div", { className: "py-6 text-center text-xs text-slate-500" },
                    "End of the rail - ",
                    items.length,
                    " item",
                    items.length === 1 ? '' : 's',
                    categoryBar.loaded && categoryBar.loaded.window.closedNext && categoryBar.status !== 'open' ? ' (older closed ones are not loaded yet)' : ''),
                items.length === 0 && (React.createElement("div", { className: "text-center text-slate-500 py-16" },
                    timeFilteredCount === 0 ? 'No data available for the selected timeframe.' : 'No action items match the current search or categories.',
                    timeFilteredCount > 0 && hasNarrowing && (React.createElement("div", { className: "mt-2" },
                        React.createElement("button", { type: "button", onClick: categoryBar.onClearAll, className: "text-[#0072CE] underline hover:text-[#00468B]" }, "Clear search and filters"))))))),
        React.createElement(DetailModal, { selectedItem: selectedItem && (liveItems[selectedItem.id] || selectedItem), onClose: function () { return setSelectedItem(null); }, onEdit: function (item) { setSelectedItem(null); onEdit(item); }, onSetClosed: onSetClosed })));
}
// =======================================================================
// ASSETS TAB: equipment on the map (smart snap) and an editor for every column of the equipment table (craa5___1_a_assets)
// =======================================================================
var ASSET_LOGICAL_NAME = 'craa5___1_a_assets';
var ASSET_ID_COLUMN = 'craa5___1_a_assetsid';
var ASSET_NAME_COLUMN = 'craa5_equipmentidentifier';
// The text column that keeps an asset's spot on the map. null = found by its name ("Map Location", craa5_maplocation).
var ASSET_MAP_COLUMN = null;
var ASSET_MAP_HINT = /map.?(loc|pos|pin|point|spot|xy|coord)/i;
// Columns the app expects on Assets (Alex's table, Oct 9). If Dataverse's column list leaves one out, a one-row read
// still finds it; a missing one can be swapped for another column on this device, or created and checked again.
var ASSET_PICTURE_COLUMN = 'craa5_pictureofequipment'; // Image
var ASSET_DOC_COLUMNS = ['craa5_ssop', 'craa5_sop1', 'craa5_sop2', 'craa5_sop3']; // File (the SSOP first)
// Text columns that already hold something the apps read (name, room, area, codes): never offered as the map spot column
var ASSET_MAP_NOT_THESE = ['craa5_equipmentidentifier', 'craa5_roomname', 'craa5_areaname', 'craa5_workareacode', 'craa5_departmentcode', 'craa5_subcategory'];
var ASSET_KNOWN_LABELS = { craa5_pictureofequipment: 'Picture of Equipment', craa5_picture: 'Primary Picture', craa5_pictureof: 'Picture Of', craa5_ssop: 'SSOP', craa5_sop1: 'SOP 1', craa5_sop2: 'SOP 2', craa5_sop3: 'SOP 3', craa5_maplocation: 'Map Location' };
var ASSET_LIST_PAGE = 50; // rows per page in the asset list ("Show more" asks for the next page)
var ASSET_PIN_PAGE = 500; // placed assets per request when the map is drawn
var ASSET_PIN_MAX = 5000; // stop there and say so
var FILE_SINGLE_UPLOAD_MAX = 128 * 1024 * 1024; // the most Dataverse takes in one upload request
var SNAP_PREF = 'Midwest Plant.assets.smartSnap';
var ANNOTATIONS = { Prefer: 'odata.include-annotations="*"' };
// Microsoft's advice for Web API reads: never answer them from the browser cache
var NO_CACHE = { 'If-None-Match': 'null' };
var metaLabel = function (l) {
    if (!l)
        return '';
    if (l.UserLocalizedLabel && l.UserLocalizedLabel.Label)
        return l.UserLocalizedLabel.Label;
    if (l.LocalizedLabels && l.LocalizedLabels.length && l.LocalizedLabels[0].Label)
        return l.LocalizedLabels[0].Label;
    return '';
};
var getJson = function (path, headers) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch(apiUrl(path), { headers: __assign(__assign(__assign({}, ODATA_HEADERS), NO_CACHE), (headers || {})) })];
            case 1:
                res = _b.sent();
                if (!!res.ok) return [3 /*break*/, 3];
                _a = Error.bind;
                return [4 /*yield*/, readApiError(res)];
            case 2:
                err = new (_a.apply(Error, [void 0, _b.sent()]))();
                err.status = res.status;
                throw err;
            case 3: return [2 /*return*/, res.json()];
        }
    });
}); };
var formatted = function (row, key) { return (row ? row["".concat(key, "@OData.Community.Display.V1.FormattedValue")] : undefined); };
// --- WHICH COLUMNS THE EDITOR SHOWS, AND HOW ---
// AttributeTypeName first (it tells File, Image and multi-select choices apart; all three are "Virtual"), then AttributeType
var ASSET_KIND_BY_TYPENAME = {
    StringType: 'text', MemoType: 'memo', IntegerType: 'int', BigIntType: 'int', DecimalType: 'number', DoubleType: 'number', MoneyType: 'number',
    BooleanType: 'bool', PicklistType: 'choice', MultiSelectPicklistType: 'choices', DateTimeType: 'date', LookupType: 'lookup',
    CustomerType: 'fixedlookup', OwnerType: 'fixedlookup', FileType: 'file', ImageType: 'image', StateType: 'status', StatusType: 'status', UniqueidentifierType: 'id'
};
var ASSET_KIND_BY_TYPE = {
    String: 'text', Memo: 'memo', Integer: 'int', BigInt: 'int', Decimal: 'number', Double: 'number', Money: 'number', Boolean: 'bool',
    Picklist: 'choice', DateTime: 'date', Lookup: 'lookup', Customer: 'fixedlookup', Owner: 'fixedlookup', State: 'status', Status: 'status', Uniqueidentifier: 'id'
};
// Bookkeeping columns nobody needs to see
var ASSET_HIDDEN_COLUMNS = ['versionnumber', 'importsequencenumber', 'overriddencreatedon', 'timezoneruleversionnumber', 'utcconversiontimezonecode',
    'owningbusinessunit', 'owninguser', 'owningteam', 'createdonbehalfby', 'modifiedonbehalfby'];
// Shown read-only under "Record info"
var ASSET_INFO_COLUMNS = ['createdon', 'createdby', 'modifiedon', 'modifiedby', 'ownerid', 'statecode', 'statuscode'];
// Sections of the editor, in this order. Known columns keep this order; other columns follow by name.
var ASSET_GROUPS = [
    { key: 'main', title: 'Equipment', names: ['craa5_equipmentidentifier', 'craa5_roomname', 'craa5_areaname', 'craa5_area_lookup', 'craa5_subcategory', 'craa5_uniqueid', 'craa5_departmentcode', 'craa5_workareacode', 'craa5_esequipment'] },
    { key: 'freq', title: 'Cleaning frequency and time', names: ['craa5_dailyclean', 'craa5_midweek', 'craa5_weeklyclean', 'craa5_monthlyclean', 'craa5_month', 'craa5_quarterly', 'craa5_annually', 'craa5_dailyweekly', 'craa5_hoursrequired', 'craa5_minalrg', 'craa5_dailymin', 'craa5_heads', 'craa5_lastcleaneddate', 'craa5_timetocleanaveragefromlog', 'craa5_cleanorder', 'craa5_priority', 'craa5_bundle'], hint: /clean|freq|daily|weekly|monthly|quarter|annual|midweek|minute|hours/i },
    { key: 'docs', title: 'Pictures and documents', kinds: ['file', 'image'] },
    { key: 'other', title: 'Other columns' }
];
// Extra details per column type. Each is its own request, so one that fails only loses that detail.
var ASSET_TYPED_QUERIES = [
    { cast: 'StringAttributeMetadata', q: '$select=LogicalName,MaxLength,FormatName', apply: function (f, a) { f.maxLength = a.MaxLength || null; f.format = a.FormatName && a.FormatName.Value ? a.FormatName.Value : ''; } },
    { cast: 'MemoAttributeMetadata', q: '$select=LogicalName,MaxLength', apply: function (f, a) { f.maxLength = a.MaxLength || null; } },
    { cast: 'IntegerAttributeMetadata', q: '$select=LogicalName,MinValue,MaxValue', apply: function (f, a) { f.min = a.MinValue; f.max = a.MaxValue; } },
    { cast: 'DecimalAttributeMetadata', q: '$select=LogicalName,MinValue,MaxValue,Precision', apply: function (f, a) { f.min = a.MinValue; f.max = a.MaxValue; f.precision = a.Precision; } },
    { cast: 'DoubleAttributeMetadata', q: '$select=LogicalName,MinValue,MaxValue,Precision', apply: function (f, a) { f.min = a.MinValue; f.max = a.MaxValue; f.precision = a.Precision; } },
    { cast: 'BooleanAttributeMetadata', q: '$select=LogicalName&$expand=OptionSet($select=TrueOption,FalseOption)', apply: function (f, a) {
            var os = a.OptionSet || {};
            f.trueLabel = metaLabel(os.TrueOption && os.TrueOption.Label) || 'Yes';
            f.falseLabel = metaLabel(os.FalseOption && os.FalseOption.Label) || 'No';
        } },
    { cast: 'PicklistAttributeMetadata', q: '$select=LogicalName&$expand=OptionSet($select=Options),GlobalOptionSet($select=Options)', apply: function (f, a) { f.options = optionList(a); } },
    { cast: 'MultiSelectPicklistAttributeMetadata', q: '$select=LogicalName&$expand=OptionSet($select=Options),GlobalOptionSet($select=Options)', apply: function (f, a) { f.options = optionList(a); } },
    { cast: 'DateTimeAttributeMetadata', q: '$select=LogicalName,Format,DateTimeBehavior', apply: function (f, a) {
            f.behavior = a.DateTimeBehavior && a.DateTimeBehavior.Value ? a.DateTimeBehavior.Value : 'UserLocal';
            f.dateOnly = a.Format === 'DateOnly' || f.behavior === 'DateOnly';
        } },
    { cast: 'LookupAttributeMetadata', q: '$select=LogicalName,Targets', apply: function (f, a) { f.targets = a.Targets || []; } },
    { cast: 'FileAttributeMetadata', q: '$select=LogicalName,MaxSizeInKB', apply: function (f, a) { f.maxKB = a.MaxSizeInKB || null; } },
    { cast: 'ImageAttributeMetadata', q: '$select=LogicalName,MaxSizeInKB,CanStoreFullImage', apply: function (f, a) { f.maxKB = a.MaxSizeInKB || null; f.fullImage = a.CanStoreFullImage !== false; } }
];
function optionList(a) {
    var set = (a.OptionSet && a.OptionSet.Options && a.OptionSet.Options.length) ? a.OptionSet : a.GlobalOptionSet;
    return ((set && set.Options) || []).map(function (o) { return ({ value: o.Value, label: metaLabel(o.Label) || String(o.Value) }); });
}
var ATTRIBUTE_SELECT = 'LogicalName,AttributeType,AttributeTypeName,DisplayName,Description,RequiredLevel,IsValidForCreate,IsValidForUpdate,IsValidForRead,IsValidODataAttribute,AttributeOf,IsPrimaryId,IsPrimaryName,IsCustomAttribute';
// Everything the Assets tab needs to know about the table, read once.
// Result: { ready, error, entitySet, fields, mapColumn: { name, maxLength } | null, mapReason, warnings }
function loadAssetMetadata(logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var def, entity, attributes, error_17, kindOf, readable, uploadKinds, companions, helperSuffixes, fields, byName, set, probe, added, helpers_1, i, warnings, rels, error_18, textFields, mapField, mapReason, mapPick, pickField, pickTaken, mapTypedWhy, candidates, missing;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    def = "EntityDefinitions(LogicalName='".concat(ASSET_LOGICAL_NAME, "')");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, getJson("".concat(def, "?$select=LogicalName,EntitySetName,PrimaryIdAttribute,PrimaryNameAttribute&$expand=Attributes($select=").concat(ATTRIBUTE_SELECT, ")"))];
                case 2:
                    entity = _a.sent();
                    if (!entity.LogicalName && entity.value && entity.value[0])
                        entity = entity.value[0];
                    attributes = entity.Attributes || [];
                    return [3 /*break*/, 6];
                case 3:
                    error_17 = _a.sent();
                    // Some setups refuse the expand: ask for the table and its columns separately
                    logEvent("Asset table metadata (with columns) failed: ".concat(error_17.message, ". Trying the columns on their own."), 'warn');
                    return [4 /*yield*/, getJson("".concat(def, "?$select=LogicalName,EntitySetName,PrimaryIdAttribute,PrimaryNameAttribute"))];
                case 4:
                    entity = _a.sent();
                    if (!entity.LogicalName && entity.value && entity.value[0])
                        entity = entity.value[0];
                    return [4 /*yield*/, getJson("".concat(def, "/Attributes?$select=").concat(ATTRIBUTE_SELECT))];
                case 5:
                    attributes = (_a.sent()).value || [];
                    return [3 /*break*/, 6];
                case 6:
                    kindOf = function (a) {
                        var typeName = a.AttributeTypeName && a.AttributeTypeName.Value ? a.AttributeTypeName.Value : '';
                        return ASSET_KIND_BY_TYPENAME[typeName] || ASSET_KIND_BY_TYPE[a.AttributeType] || null;
                    };
                    readable = {};
                    attributes.forEach(function (a) { if (a && a.LogicalName && a.IsValidForRead !== false && a.IsValidODataAttribute !== false)
                        readable[a.LogicalName] = a; });
                    uploadKinds = {};
                    Object.keys(readable).forEach(function (n) { var k = kindOf(readable[n]); if (k === 'file' || k === 'image')
                        uploadKinds[n] = k; });
                    companions = {};
                    Object.keys(readable).forEach(function (n) { if (readable[n].AttributeOf && !uploadKinds[n])
                        companions[n] = true; });
                    helperSuffixes = function (kind) { return (kind === 'image' ? ['id', '_url', '_timestamp'] : ['_name']); };
                    Object.keys(uploadKinds).forEach(function (n) { helperSuffixes(uploadKinds[n]).forEach(function (sfx) { if (readable[n + sfx] && !uploadKinds[n + sfx])
                        companions[n + sfx] = true; }); });
                    fields = [];
                    byName = {};
                    attributes.forEach(function (a) {
                        // Companion columns (file names, lookup names) and columns the Web API does not expose are left out
                        if (!a || !a.LogicalName || !readable[a.LogicalName] || companions[a.LogicalName])
                            return;
                        if (ASSET_HIDDEN_COLUMNS.indexOf(a.LogicalName) !== -1)
                            return;
                        var kind = kindOf(a);
                        if (!kind)
                            return;
                        // Dataverse reports File columns as not valid for create or update, because their bytes never go in a row save: they
                        // take an upload of their own once the row exists. So File and Image columns always offer Upload, and Dataverse
                        // checks the user's rights when the upload is sent.
                        var upload = kind === 'file' || kind === 'image';
                        if (a.AttributeOf && !upload)
                            return;
                        var required = a.RequiredLevel && (a.RequiredLevel.Value === 'ApplicationRequired' || a.RequiredLevel.Value === 'SystemRequired');
                        var field = {
                            name: a.LogicalName,
                            label: metaLabel(a.DisplayName) || ASSET_KNOWN_LABELS[a.LogicalName] || a.LogicalName,
                            description: metaLabel(a.Description),
                            kind: kind,
                            required: !!required && kind !== 'id' && kind !== 'status',
                            canCreate: upload ? false : a.IsValidForCreate !== false,
                            canUpdate: upload ? true : a.IsValidForUpdate !== false,
                            isPrimaryName: !!a.IsPrimaryName || a.LogicalName === (entity.PrimaryNameAttribute || ASSET_NAME_COLUMN),
                            isPrimaryId: !!a.IsPrimaryId || a.LogicalName === (entity.PrimaryIdAttribute || ASSET_ID_COLUMN),
                            info: ASSET_INFO_COLUMNS.indexOf(a.LogicalName) !== -1
                        };
                        if (field.kind === 'bool') {
                            field.trueLabel = 'Yes';
                            field.falseLabel = 'No';
                        }
                        // The table asks for these instead of the file itself: the file's name, the picture's time stamp
                        if (field.kind === 'file' && readable["".concat(field.name, "_name")])
                            field.nameColumn = "".concat(field.name, "_name");
                        if (field.kind === 'image' && readable["".concat(field.name, "_timestamp")])
                            field.stampColumn = "".concat(field.name, "_timestamp");
                        fields.push(field);
                        byName[field.name] = field;
                    });
                    set = entity.EntitySetName || ASSET_SET;
                    return [4 /*yield*/, probeAssetRowColumns(set)];
                case 7:
                    probe = _a.sent();
                    if (probe.error)
                        logEvent("The one-row column check of the Assets table failed: ".concat(probe.error), 'warn');
                    added = inferUploadColumns(probe.keys, byName, readable);
                    added.forEach(function (f) { fields.push(f); byName[f.name] = f; });
                    if (added.length) {
                        helpers_1 = {};
                        added.forEach(function (f) { helperSuffixes(f.kind).forEach(function (sfx) { helpers_1[f.name + sfx] = true; }); });
                        for (i = fields.length - 1; i >= 0; i -= 1)
                            if (helpers_1[fields[i].name]) {
                                delete byName[fields[i].name];
                                fields.splice(i, 1);
                            }
                        logEvent("Found ".concat(added.length, " picture or file column").concat(added.length === 1 ? '' : 's', " on Assets from a one-row read: ").concat(added.map(function (f) { return f.name; }).join(', '), "."), 'info');
                    }
                    warnings = [];
                    return [4 /*yield*/, Promise.all(ASSET_TYPED_QUERIES.map(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var list, error_19;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, getJson("".concat(def, "/Attributes/Microsoft.Dynamics.CRM.").concat(t.cast, "?").concat(t.q))];
                                    case 1:
                                        list = (_a.sent()).value || [];
                                        list.forEach(function (a) { if (a && byName[a.LogicalName])
                                            t.apply(byName[a.LogicalName], a); });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_19 = _a.sent();
                                        warnings.push("".concat(t.cast, ": ").concat(error_19.message));
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, getJson("".concat(def, "/ManyToOneRelationships?$select=ReferencingAttribute,ReferencingEntityNavigationPropertyName,ReferencedEntity"))];
                case 10:
                    rels = (_a.sent()).value || [];
                    rels.forEach(function (r) {
                        var f = byName[r.ReferencingAttribute];
                        if (f && f.kind === 'lookup' && !f.nav) {
                            f.nav = r.ReferencingEntityNavigationPropertyName;
                            if (!f.targets || !f.targets.length)
                                f.targets = [r.ReferencedEntity];
                        }
                    });
                    return [3 /*break*/, 12];
                case 11:
                    error_18 = _a.sent();
                    warnings.push("relationships: ".concat(error_18.message));
                    return [3 /*break*/, 12];
                case 12:
                    if (warnings.length)
                        logEvent("Some asset column details could not be read; those columns are shown read-only or plainer.", 'warn', { warnings: warnings });
                    textFields = fields.filter(function (f) { return f.kind === 'text' || f.kind === 'memo'; });
                    mapField = null;
                    mapReason = '';
                    mapPick = readColumnPick('assetMap');
                    pickField = mapPick ? byName[mapPick] || null : null;
                    pickTaken = !!pickField && (pickField.isPrimaryName || ASSET_MAP_NOT_THESE.indexOf(mapPick) !== -1);
                    mapTypedWhy = pickTaken ? 'it holds the equipment\'s own name, room, area or code' : (pickField && !pickField.canUpdate ? 'it cannot be written' : '');
                    if (pickField && (pickField.kind === 'text' || pickField.kind === 'memo') && pickField.canUpdate && !pickTaken) {
                        mapField = pickField;
                        logEvent("Map spots go in ".concat(mapPick, " (picked on this device)."), 'info');
                    }
                    else if (ASSET_MAP_COLUMN) {
                        mapField = byName[ASSET_MAP_COLUMN] || null;
                        if (!mapField)
                            mapReason = "ASSET_MAP_COLUMN \"".concat(ASSET_MAP_COLUMN, "\" is not a text column of the Assets table.");
                    }
                    else {
                        candidates = textFields.filter(function (f) { return f.name === 'craa5_maplocation' || ASSET_MAP_HINT.test(f.name) || /map\s*location/i.test(f.label); });
                        candidates.sort(function (a, b) { return (b.name === 'craa5_maplocation' ? 1 : 0) - (a.name === 'craa5_maplocation' ? 1 : 0) || (b.maxLength || 0) - (a.maxLength || 0); });
                        mapField = candidates[0] || null;
                        if (candidates.length > 1)
                            logEvent("Several map columns found on Assets (".concat(candidates.map(function (c) { return c.name; }).join(', '), "). Using ").concat(mapField.name, ". Set ASSET_MAP_COLUMN at the top of the assets section to choose another."), 'warn');
                        if (!mapField)
                            mapReason = 'the Assets table has no column for map spots yet. Add a "Single line of text" column named "Map Location" (100 characters is enough) and press Check again, or pick a text column below.';
                    }
                    if (mapField && !mapField.canUpdate) {
                        mapReason = "the column ".concat(mapField.name, " cannot be written.");
                        mapField = null;
                    }
                    logEvent("Asset table: ".concat(fields.length, " columns; map spots ").concat(mapField ? "in ".concat(mapField.name) : 'not available', "."), mapField ? 'info' : 'warn');
                    missing = expectedAssetColumns(byName).filter(function (c) { return !c.found; });
                    if (missing.length)
                        logEvent("Expected Assets columns not found: ".concat(missing.map(function (c) { return "".concat(c.name, " (").concat(c.kind, ")"); }).join(', '), "."), 'warn');
                    return [2 /*return*/, {
                            ready: true,
                            error: '',
                            entitySet: set,
                            fields: fields,
                            mapColumn: mapField ? { name: mapField.name, maxLength: mapField.maxLength || null } : null,
                            mapPicked: !!(mapField && mapPick && mapField.name === mapPick),
                            mapTypedWhy: mapTypedWhy,
                            mapReason: mapReason,
                            warnings: warnings
                        }];
            }
        });
    });
}
// Reads one asset row with every column, only for the names of its keys (Alex's own read showed the picture's
// _url / _timestamp and each file's _name). { keys: [] | null, error }
function probeAssetRowColumns(set) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getJson("".concat(set, "?$top=1"))];
                case 1:
                    rows = (_a.sent()).value || [];
                    return [2 /*return*/, { keys: rows[0] ? Object.keys(rows[0]).filter(function (k) { return k.indexOf('@') === -1; }) : null, error: '' }];
                case 2:
                    error_20 = _a.sent();
                    return [2 /*return*/, { keys: null, error: error_20.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Picture and file columns a row's keys show that the column list did not give. `known` = fields by name, `listed` = every
// column Dataverse listed (a column listed as something else is left alone).
function inferUploadColumns(keys, known, listed) {
    if (!keys)
        return [];
    var has = {};
    keys.forEach(function (k) { has[k] = true; });
    var out = [];
    var taken = {};
    keys.forEach(function (k) {
        var name = '';
        var kind = '';
        if (/_timestamp$/.test(k) && has[k.replace(/_timestamp$/, '_url')]) {
            name = k.replace(/_timestamp$/, '');
            kind = 'image';
        }
        else if (/_name$/.test(k) && k.charAt(0) !== '_' && has[k.replace(/_name$/, '')]) {
            name = k.replace(/_name$/, '');
            kind = 'file';
        }
        if (!name || taken[name] || known[name])
            return;
        var l = listed && listed[name];
        if (l && !(l.AttributeTypeName && /^(FileType|ImageType)$/.test(l.AttributeTypeName.Value || '')))
            return;
        taken[name] = true;
        var f = {
            name: name,
            label: ASSET_KNOWN_LABELS[name] || name,
            description: 'Found from a one-row read of the table',
            kind: kind,
            required: false,
            canCreate: false,
            canUpdate: true,
            isPrimaryName: false,
            isPrimaryId: false,
            info: false,
            inferred: true
        };
        if (kind === 'file')
            f.nameColumn = "".concat(name, "_name");
        if (kind === 'image')
            f.stampColumn = "".concat(name, "_timestamp");
        out.push(f);
    });
    return out;
}
// The columns this app expects on Assets, and whether the table has each: [{ role, name, label, kind, found }]
function expectedAssetColumns(byName) {
    var one = function (role, name, kind) { return ({ role: role, name: name, label: ASSET_KNOWN_LABELS[name] || name, kind: kind, found: !!(byName[name] && byName[name].kind === kind) }); };
    var picCol = (byName[ASSET_PICTURE_COLUMN] && byName[ASSET_PICTURE_COLUMN].kind === 'image')
        ? ASSET_PICTURE_COLUMN
        : ((byName['craa5_picture'] && byName['craa5_picture'].kind === 'image') ? 'craa5_picture' : ASSET_PICTURE_COLUMN);
    return [one('picture', picCol, 'image')].concat(ASSET_DOC_COLUMNS.map(function (n) { return one('doc', n, 'file'); }));
}
// --- ASSET ROWS ---
var assetListSelect = function (mapColumn) { return [ASSET_ID_COLUMN, ASSET_NAME_COLUMN, 'craa5_roomname', 'craa5_areaname', 'modifiedon', 'statecode', 'statuscode'].concat(mapColumn ? [mapColumn] : []).join(','); };
var toAssetSummary = function (row, mapColumn) { return (__assign(__assign({}, toAsset(row)), { inactive: row.statecode === 1, modifiedOn: row.modifiedon || '', location: mapColumn ? parseMapLocation(row[mapColumn]) : null })); };
var assetWordFilter = function (words) { return words.map(function (w) { return "(contains(craa5_equipmentidentifier,'".concat(escLike(w), "') or contains(craa5_roomname,'").concat(escLike(w), "') or contains(craa5_areaname,'").concat(escLike(w), "'))"); }); };
// The filter and order of an asset list (the map's list and the equipment table). `sort` = { name, desc } from a column header.
// `status`: 'active' (default, statecode eq 0), 'inactive' (statecode eq 1), or 'all'.
function assetListQuery(_a) {
    var words = _a.words, room = _a.room, placement = _a.placement, status = _a.status, mapColumn = _a.mapColumn, orderById = _a.orderById, sort = _a.sort;
    var parts = assetWordFilter(words || []);
    if (status === 'inactive')
        parts.push('statecode eq 1');
    else if (status !== 'all')
        parts.push('statecode eq 0');
    if (room)
        parts.push("craa5_roomname eq '".concat(escOData(room), "'"));
    if (mapColumn && placement === 'placed')
        parts.push("".concat(mapColumn, " ne null"));
    if (mapColumn && placement === 'unplaced')
        parts.push("".concat(mapColumn, " eq null"));
    // Nothing searched yet: the latest changed first. The id last, so paging never repeats or skips a row.
    var first = '';
    if (sort)
        first = "".concat(sort.name, " ").concat(sort.desc ? 'desc' : 'asc');
    else if (!orderById)
        first = (words || []).length === 0 && !room ? 'modifiedon desc' : "".concat(ASSET_NAME_COLUMN, " asc");
    return { filter: parts.join(' and '), order: first ? "".concat(first, ",").concat(ASSET_ID_COLUMN) : ASSET_ID_COLUMN };
}
// One page of assets. `next` is the previous page's @odata.nextLink (an absolute URL), else a new query.
// Never the whole table: Dataverse sends `pageSize` rows at a time.
function fetchAssetPage(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, q, res, _c, data;
        var set = _b.set, words = _b.words, room = _b.room, placement = _b.placement, mapColumn = _b.mapColumn, next = _b.next, pageSize = _b.pageSize, orderById = _b.orderById;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = next;
                    if (!url) {
                        q = assetListQuery({ words: words, room: room, placement: placement, mapColumn: mapColumn, orderById: orderById });
                        url = apiUrl("".concat(set, "?$select=").concat(assetListSelect(mapColumn)).concat(q.filter ? "&$filter=".concat(encodeURIComponent(q.filter)) : '', "&$orderby=").concat(encodeURIComponent(q.order)));
                    }
                    return [4 /*yield*/, fetch(url, { headers: __assign(__assign(__assign({}, ODATA_HEADERS), NO_CACHE), { Prefer: "odata.maxpagesize=".concat(pageSize || ASSET_LIST_PAGE) }) })];
                case 1:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _c = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2: throw new (_c.apply(Error, [void 0, _d.sent()]))();
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = _d.sent();
                    return [2 /*return*/, {
                            rows: (data.value || []).map(function (r) { return toAssetSummary(r, mapColumn); }).filter(function (a) { return GUID_PATTERN.test(a.id); }),
                            next: data['@odata.nextLink'] || null
                        }];
            }
        });
    });
}
// Every asset that has a map spot (name, room, area and the spot only), page by page up to ASSET_PIN_MAX
function loadAssetPins(set, mapColumn, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, next, pages, page, capped;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rows = [];
                    next = null;
                    pages = 0;
                    _a.label = 1;
                case 1: return [4 /*yield*/, fetchAssetPage({ set: set, words: [], room: '', placement: 'placed', mapColumn: mapColumn, next: next, pageSize: ASSET_PIN_PAGE, orderById: true })];
                case 2:
                    page = _a.sent();
                    rows = rows.concat(page.rows.filter(function (r) { return r.location; }));
                    next = page.next;
                    pages += 1;
                    _a.label = 3;
                case 3:
                    if (next && rows.length < ASSET_PIN_MAX && pages < 50) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    capped = !!next;
                    if (capped)
                        logEvent("Only the first ".concat(rows.length, " placed assets are drawn on the map (more exist)."), 'warn');
                    logEvent("Loaded ".concat(rows.length, " assets that have a map spot."), 'info');
                    return [2 /*return*/, { rows: rows.slice(0, ASSET_PIN_MAX), capped: capped }];
            }
        });
    });
}
// Distinct room names (Dataverse groups them; the rows themselves are not loaded)
function loadAssetRooms(set) {
    return __awaiter(this, void 0, void 0, function () {
        var data, seen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJson("".concat(set, "?$apply=groupby((craa5_roomname))"))];
                case 1:
                    data = _a.sent();
                    seen = {};
                    return [2 /*return*/, (data.value || []).map(function (r) { return (r.craa5_roomname || '').trim(); }).filter(function (r) { return r && !seen[r] && (seen[r] = true); }).sort(function (a, b) { return a.localeCompare(b); })];
            }
        });
    });
}
// ===== SHARED PLACE NAMES (data contract 1.0: area and room spelled the way the other apps keep them) =====
// Areas are the MSS area table's names (craa5___1_a_mss_area.craa5_area, the list Shift Start, the Production Scheduler and Ganttly
// use); without that table the equipment table's own area names are offered, with no area ids. Rooms are the equipment table's
// room names. Names are the same when hubCanon (lower-case letters and digits only) is the same; nothing is matched by nearest
// spelling. Read once per page load; a failed read leaves the boxes as free text, and a later form tries again.
var MSS_AREA_SET = 'craa5___1_a_mss_areas';
var AREA_ID_COLUMN = 'craa5_mssareaguid'; // text column on craa5__facilityobservation: the craa5___1_a_mss_areaid of the area
var PLACE_LISTS = null;
var LAST_PLACES = null; // the lists once read, for code that cannot wait for them (Bulk Upload's new issues)
var placeKey = function (v) { return String(v === undefined || v === null ? '' : v).toLowerCase().replace(/[^a-z0-9]+/g, ''); }; // = hubCanon
function loadPlaceLists(logEvent) {
    if (PLACE_LISTS)
        return PLACE_LISTS;
    var distinct = function (list) { var seen = {}; return list.filter(function (v) { return v && placeKey(v) && !seen[placeKey(v)] && (seen[placeKey(v)] = true); }).sort(function (a, b) { return a.localeCompare(b); }); };
    var areas = getJson("".concat(MSS_AREA_SET, "?$select=craa5___1_a_mss_areaid,craa5_area&$orderby=craa5_area"))
        .then(function (d) {
        var ids = {};
        var names = distinct((d.value || []).map(function (r) {
            var name = String(r.craa5_area || '').trim();
            if (name && !ids[placeKey(name)])
                ids[placeKey(name)] = cleanGuid(r.craa5___1_a_mss_areaid);
            return name;
        }));
        return { names: names, ids: ids, from: 'MSS areas' };
    })
        .catch(function (error) { return getJson("".concat(ASSET_SET, "?$apply=groupby((craa5_areaname))"))
        .then(function (d) {
        if (logEvent)
            logEvent("The MSS area table could not be read (".concat(error.message, "); area names come from the equipment table and no area id is saved."), 'warn');
        return { names: distinct((d.value || []).map(function (r) { return String(r.craa5_areaname || '').trim(); })), ids: {}, from: 'equipment' };
    }); });
    var rooms = loadAssetRooms(ASSET_SET).then(function (names) { return ({ names: distinct(names) }); });
    // Is there an area id column on the problems table? Only then is it written (a missing column would refuse the save).
    var areaIdColumn = getJson("EntityDefinitions(LogicalName='".concat(OBSERVATION_LOGICAL_NAME, "')/Attributes(LogicalName='").concat(AREA_ID_COLUMN, "')?$select=LogicalName"))
        .then(function () { return AREA_ID_COLUMN; })
        .catch(function (error) {
        if (logEvent)
            logEvent("Area ids are not saved: the ".concat(OBSERVATION_LOGICAL_NAME, " table has no ").concat(AREA_ID_COLUMN, " column (Single line of text, 100) or it could not be checked (").concat(error.message, ")."), 'warn');
        return '';
    });
    PLACE_LISTS = Promise.all([areas, rooms, areaIdColumn]).then(function (_a) {
        var a = _a[0], r = _a[1], col = _a[2];
        if (logEvent)
            logEvent("Place lists: ".concat(a.names.length, " areas (from ").concat(a.from, "), ").concat(r.names.length, " rooms; area ids ").concat(col ? "saved in ".concat(col) : 'not saved', "."), 'info');
        LAST_PLACES = { areas: a.names, areaIds: a.ids, rooms: r.names, areaFrom: a.from, areaIdColumn: col };
        return LAST_PLACES;
    }).catch(function (error) {
        PLACE_LISTS = null;
        if (logEvent)
            logEvent("The area and room lists could not be read: ".concat(error.message, ". The boxes take any text."), 'warn');
        return { areas: [], areaIds: {}, rooms: [], areaIdColumn: '', error: error.message };
    });
    return PLACE_LISTS;
}
// The list's own spelling for a typed name, or '' when the list does not have it
function knownPlace(list, value) {
    var k = placeKey(value);
    if (!k || !list)
        return '';
    for (var i = 0; i < list.length; i++)
        if (placeKey(list[i]) === k)
            return list[i];
    return '';
}
// What is saved: the list's spelling when it has the name, else the typed text as it is (trimmed)
var placeToSave = function (list, value) { return knownPlace(list, value) || String(value || '').trim(); };
// The craa5___1_a_mss_areaid of an area name ('' when it is not an MSS area)
var areaIdOf = function (places, value) { return (places && places.areaIds && places.areaIds[placeKey(value)]) || ''; };
// ===== END SHARED PLACE NAMES =====
// All columns of one asset. Image columns are left out of an all-columns read, so they are asked for by name (the
// 144 px thumbnail, small) to tell whether a picture is stored.
function loadAssetRow(set, id, imageColumns) {
    return __awaiter(this, void 0, void 0, function () {
        var row, extra_1, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJson("".concat(set, "(").concat(id, ")"), ANNOTATIONS)];
                case 1:
                    row = _a.sent();
                    if (!(imageColumns && imageColumns.length)) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getJson("".concat(set, "(").concat(id, ")?$select=").concat(imageColumns.join(',')))];
                case 3:
                    extra_1 = _a.sent();
                    imageColumns.forEach(function (c) { if (extra_1[c] !== undefined)
                        row[c] = extra_1[c]; });
                    return [3 /*break*/, 5];
                case 4:
                    e_7 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, row];
            }
        });
    });
}
// PATCH some columns of one asset. `etag` guards against overwriting someone else's change (HTTP 412); '*' = just "it must exist".
function patchAsset(set, id, payload, etag, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var path, res, err, _a, e_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = "".concat(set, "(").concat(id, ")");
                    logEvent("PATCH asset ".concat(id), 'data', payload, { method: 'PATCH', path: path, contentType: 'application/json' });
                    return [4 /*yield*/, fetch(apiUrl(path), {
                            method: 'PATCH',
                            headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/json', 'If-Match': etag || '*', Prefer: 'return=representation,odata.include-annotations="*"' }),
                            body: JSON.stringify(payload)
                        })];
                case 1:
                    res = _b.sent();
                    if (res.status === 412) {
                        err = new Error('someone else changed this asset after you opened it');
                        err.stale = true;
                        throw err;
                    }
                    if (res.status === 404)
                        throw new Error('this asset no longer exists in Dataverse (HTTP 404)');
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                case 3:
                    if (!(res.status === 200)) return [3 /*break*/, 7];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, res.json()];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    e_8 = _b.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, loadAssetRow(set, id)];
            }
        });
    });
}
function createAsset(set, payload, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a, row, e_9, header, match;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logEvent("POST new asset", 'data', payload, { method: 'POST', path: set, contentType: 'application/json' });
                    return [4 /*yield*/, fetch(apiUrl(set), {
                            method: 'POST',
                            headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/json', Prefer: 'return=representation,odata.include-annotations="*"' }),
                            body: JSON.stringify(payload)
                        })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                case 3:
                    if (!(res.status === 201 || res.status === 200)) return [3 /*break*/, 7];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, res.json()];
                case 5:
                    row = _b.sent();
                    if (row && row[ASSET_ID_COLUMN])
                        return [2 /*return*/, row];
                    return [3 /*break*/, 7];
                case 6:
                    e_9 = _b.sent();
                    return [3 /*break*/, 7];
                case 7:
                    header = res.headers.get('OData-EntityId') || '';
                    match = header.match(/\(([0-9a-fA-F-]{36})\)/);
                    if (!match)
                        throw new Error('Dataverse did not return the new asset id.');
                    return [2 /*return*/, loadAssetRow(set, match[1])];
            }
        });
    });
}
// Deactivate (statecode 1, statuscode 2) or Reactivate (statecode 0, statuscode 1) an asset in Dataverse.
function setAssetActiveState(set, id, active, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var path, send, res, _a, _b, _c, row, e_10;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    path = "".concat(set, "(").concat(id, ")");
                    send = function (body) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            logEvent("PATCH ".concat(active ? 'reactivate' : 'deactivate', " asset ").concat(id), 'data', body, { method: 'PATCH', path: path, contentType: 'application/json' });
                            return [2 /*return*/, fetch(apiUrl(path), {
                                    method: 'PATCH',
                                    headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/json', 'If-Match': '*', Prefer: 'return=representation,odata.include-annotations="*"' }),
                                    body: JSON.stringify(body)
                                })];
                        });
                    }); };
                    return [4 /*yield*/, send(active ? { statecode: 0, statuscode: 1 } : { statecode: 1, statuscode: 2 })];
                case 1:
                    res = _d.sent();
                    if (!(res.status === 400)) return [3 /*break*/, 4];
                    _a = logEvent;
                    _b = "Asset status change with statuscode was refused: ".concat;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    _a.apply(void 0, [_b.apply("Asset status change with statuscode was refused: ", [_d.sent(), ". Retrying with statecode only."]), 'warn']);
                    return [4 /*yield*/, send({ statecode: active ? 0 : 1 })];
                case 3:
                    res = _d.sent();
                    _d.label = 4;
                case 4:
                    if (res.status === 404)
                        throw new Error('this asset no longer exists in Dataverse (HTTP 404)');
                    if (!!res.ok) return [3 /*break*/, 6];
                    _c = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 5: throw new (_c.apply(Error, [void 0, _d.sent()]))();
                case 6:
                    if (!(res.status === 200)) return [3 /*break*/, 10];
                    _d.label = 7;
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, res.json()];
                case 8:
                    row = _d.sent();
                    if (row && row[ASSET_ID_COLUMN])
                        return [2 /*return*/, row];
                    return [3 /*break*/, 10];
                case 9:
                    e_10 = _d.sent();
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/, loadAssetRow(set, id)];
            }
        });
    });
}
// File and Image columns take the bytes in their own request (up to 128 MB at once)
// The x-ms-file-name header only takes plain ASCII
var headerFileName = function (name) { return (String(name || 'file').replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_').trim() || 'file'); };
var FILE_BLOCK_SIZE = 4 * 1024 * 1024; // the most one UploadBlock takes
// The part after "base64," of a piece of a file
var blobToBase64 = function (blob) { return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () { var s = String(reader.result || ''); resolve(s.slice(s.indexOf(',') + 1)); };
    reader.onerror = function () { return reject(new Error('the file could not be read')); };
    reader.readAsDataURL(blob);
}); };
function postDataverseMessage(name, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err, _a, e_11;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(apiUrl(name), {
                        method: 'POST',
                        headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/json; charset=utf-8' }),
                        body: JSON.stringify(payload)
                    })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    err = new (_a.apply(Error, [void 0, _b.sent()]))();
                    err.status = res.status;
                    throw err;
                case 3:
                    if (res.status === 204)
                        return [2 /*return*/, {}];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, res.json()];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    e_11 = _b.sent();
                    return [2 /*return*/, {}];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Dataverse's other way in, which works for File and Image columns of any size: start, send 4 MB parts, commit
function uploadAssetFileInBlocks(id, column, blob, fileName, mimeType, onProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var started, token, parts, blockIds, n, blockId, data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, postDataverseMessage('InitializeFileBlocksUpload', {
                        Target: (_a = {}, _a[ASSET_ID_COLUMN] = id, _a['@odata.type'] = "Microsoft.Dynamics.CRM.".concat(ASSET_LOGICAL_NAME), _a),
                        FileAttributeName: column,
                        FileName: fileName
                    })];
                case 1:
                    started = _b.sent();
                    token = started.FileContinuationToken;
                    if (!token)
                        throw new Error('Dataverse did not start the upload');
                    parts = Math.max(1, Math.ceil(blob.size / FILE_BLOCK_SIZE));
                    blockIds = [];
                    n = 0;
                    _b.label = 2;
                case 2:
                    if (!(n < parts)) return [3 /*break*/, 6];
                    blockId = btoa("block-".concat(("00000".concat(n)).slice(-6)));
                    return [4 /*yield*/, blobToBase64(blob.slice(n * FILE_BLOCK_SIZE, (n + 1) * FILE_BLOCK_SIZE))];
                case 3:
                    data = _b.sent();
                    return [4 /*yield*/, postDataverseMessage('UploadBlock', { BlockId: blockId, BlockData: data, FileContinuationToken: token })];
                case 4:
                    _b.sent();
                    blockIds.push(blockId);
                    if (onProgress)
                        onProgress((n + 1) / parts);
                    _b.label = 5;
                case 5:
                    n += 1;
                    return [3 /*break*/, 2];
                case 6: return [4 /*yield*/, postDataverseMessage('CommitFileBlocksUpload', { FileName: fileName, MimeType: mimeType || 'application/octet-stream', BlockList: blockIds, FileContinuationToken: token })];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Answers the other way in would only repeat: signed out, no right to change the row, the row is gone, too many requests,
// or the file is too big for the column
var FINAL_UPLOAD_STATUSES = [401, 403, 404, 429];
var TOO_BIG_ANSWER = /0x80044a02|file size|too big|exceeds the maximum size/i;
var plainUploadError = function (err) {
    if (err.status === 403)
        err.message = "you do not have permission to change this equipment's files in Dataverse (".concat(err.message, ")");
    return err;
};
// One PATCH with the whole file first. If that is refused (or the file is over 128 MB), the same file goes again in parts.
// Resolves { route: 'single' | 'blocks', fileName, bytes }; a failure says what both ways answered.
function uploadAssetFile(set, id, column, body, rawName, logEvent, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var o, realName, fileName, blob, mimeType, path, sent, first, res, _a, e_12, parts, e_13, both;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    o = opts || {};
                    realName = String(rawName || 'file').replace(/[\x00-\x1F]/g, '').trim() || 'file';
                    fileName = headerFileName(realName);
                    blob = body instanceof Blob ? body : new Blob([body]);
                    mimeType = o.mimeType || blob.type || 'application/octet-stream';
                    path = "".concat(set, "(").concat(id, ")/").concat(column);
                    sent = { column: column, id: id, fileName: fileName, bytes: blob.size, mimeType: mimeType };
                    first = null;
                    if (!(blob.size <= FILE_SINGLE_UPLOAD_MAX)) return [3 /*break*/, 6];
                    logEvent("Uploading \"".concat(fileName, "\" to ").concat(column, " of asset ").concat(id), 'data', sent, { method: 'PATCH', path: path, contentType: 'application/octet-stream' });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(apiUrl(path), {
                            method: 'PATCH',
                            headers: __assign(__assign({}, ODATA_HEADERS), { 'Content-Type': 'application/octet-stream', 'x-ms-file-name': fileName }),
                            body: blob
                        })];
                case 2:
                    res = _b.sent();
                    if (res.ok)
                        return [2 /*return*/, { route: 'single', fileName: fileName, bytes: blob.size }];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 3:
                    first = new (_a.apply(Error, [void 0, _b.sent()]))();
                    first.status = res.status;
                    return [3 /*break*/, 5];
                case 4:
                    e_12 = _b.sent();
                    first = e_12;
                    return [3 /*break*/, 5];
                case 5:
                    if (FINAL_UPLOAD_STATUSES.indexOf(first.status) !== -1 || TOO_BIG_ANSWER.test(first.message || ''))
                        throw plainUploadError(first);
                    logEvent("The one-request upload of \"".concat(fileName, "\" was refused (").concat(first.message, "). Sending it in parts instead."), 'warn');
                    _b.label = 6;
                case 6:
                    parts = Math.max(1, Math.ceil(blob.size / FILE_BLOCK_SIZE));
                    logEvent("Uploading \"".concat(realName, "\" to ").concat(column, " of asset ").concat(id, " in ").concat(parts, " part").concat(parts === 1 ? '' : 's'), 'data', __assign(__assign({}, sent), { fileName: realName, parts: parts }), { method: 'POST', path: 'InitializeFileBlocksUpload, UploadBlock, CommitFileBlocksUpload', contentType: 'application/json' });
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, uploadAssetFileInBlocks(id, column, blob, realName, mimeType, o.onProgress)];
                case 8:
                    _b.sent();
                    return [2 /*return*/, { route: 'blocks', fileName: realName, bytes: blob.size }];
                case 9:
                    e_13 = _b.sent();
                    if (!first || e_13.message === first.message)
                        throw plainUploadError(e_13);
                    both = new Error("".concat(first.message, ". Sending it in parts failed too: ").concat(e_13.message));
                    both.status = e_13.status;
                    throw plainUploadError(both);
                case 10: return [2 /*return*/];
            }
        });
    });
}
var formatBytes = function (n) { return (n >= 1024 * 1024 ? "".concat((n / (1024 * 1024)).toFixed(1), " MB") : "".concat(Math.max(1, Math.ceil(n / 1024)), " KB")); };
var PICTURE_FILE_NAME = /\.(jpe?g|jfif|png|gif|bmp|webp|heic|heif|tiff?|avif)$/i;
var isPictureFile = function (file) { return /^image\//i.test((file && file.type) || '') || PICTURE_FILE_NAME.test((file && file.name) || ''); };
var isHeicFile = looksLikeHeic;
var MIME_BY_EXTENSION = {
    pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain', csv: 'text/csv', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', bmp: 'image/bmp',
    webp: 'image/webp', tif: 'image/tiff', tiff: 'image/tiff', heic: 'image/heic', heif: 'image/heif', mp4: 'video/mp4', mov: 'video/quicktime'
};
var mimeFromName = function (name) {
    var m = /\.([a-z0-9]+)$/i.exec(String(name || ''));
    return (m && MIME_BY_EXTENSION[m[1].toLowerCase()]) || 'application/octet-stream';
};
// The first bytes of a file say what it really is, whatever its name claims
var readHead = function (file, n) { return new Promise(function (resolve) {
    try {
        var reader_1 = new FileReader();
        reader_1.onload = function () { return resolve(new Uint8Array(reader_1.result)); };
        reader_1.onerror = function () { return resolve(null); };
        reader_1.readAsArrayBuffer(file.slice(0, n));
    }
    catch (e) {
        resolve(null);
    }
}); };
var hasJpegBytes = function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var head;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readHead(file, 3)];
            case 1:
                head = _a.sent();
                return [2 /*return*/, !head || (head[0] === 0xFF && head[1] === 0xD8 && head[2] === 0xFF)]; // unreadable: take its word
        }
    });
}); };
// What goes up for one picked file. A picture is saved as a JPG: for an Image column it is also shrunk (as observation pictures
// are); for a File column a picture that is not a JPG yet (PNG, HEIC, WebP ...) is converted at its own size, and one that is too
// big for the column is shrunk. A picture this browser cannot open (a TIFF scan, say) goes into a File column as it is, like any
// document. A file that is called .jpg but is really a HEIC or PNG is told apart by its first bytes.
function prepareAssetUpload(file, f) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, tooBig, stem, ext, picture, realJpeg, _a, heic, _b, _c, convertedFrom, asJpg, up, up, error_21, up, e_14;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!file || !file.size)
                        throw new Error('the file is empty');
                    limit = f.maxKB ? f.maxKB * 1024 : 0;
                    tooBig = function (n) { return "the file is ".concat(formatBytes(n), " and ").concat(f.label, " takes at most ").concat(formatBytes(limit)); };
                    stem = String(file.name || '').replace(/\.[^.]+$/, '') || (f.kind === 'image' ? 'picture' : 'file');
                    ext = (/\.([a-z0-9]+)$/i.exec(file.name || '') || ['', ''])[1].toUpperCase();
                    picture = isPictureFile(file);
                    _a = picture && isJpegFile(file);
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, hasJpegBytes(file)];
                case 1:
                    _a = (_d.sent());
                    _d.label = 2;
                case 2:
                    realJpeg = _a;
                    _b = picture && !realJpeg;
                    if (!_b) return [3 /*break*/, 5];
                    _c = looksLikeHeic(file);
                    if (_c) return [3 /*break*/, 4];
                    return [4 /*yield*/, sniffHeic(file)];
                case 3:
                    _c = (_d.sent());
                    _d.label = 4;
                case 4:
                    _b = (_c);
                    _d.label = 5;
                case 5:
                    heic = _b;
                    convertedFrom = realJpeg ? '' : (heic ? 'HEIC' : (isJpegFile(file) ? 'picture' : (ext || 'picture')));
                    asJpg = function (opts) { return __awaiter(_this, void 0, void 0, function () {
                        var bytes, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = dataUrlToBytes;
                                    return [4 /*yield*/, compressImage(file, opts)];
                                case 1:
                                    bytes = _a.apply(void 0, [_b.sent()]);
                                    return [2 /*return*/, { body: bytes, name: "".concat(stem, ".jpg"), mimeType: 'image/jpeg', bytes: bytes.length, shrunk: true, convertedFrom: convertedFrom }];
                            }
                        });
                    }); };
                    if (!(f.kind === 'image')) return [3 /*break*/, 7];
                    if (!picture)
                        throw new Error("".concat(f.label, " only takes pictures"));
                    return [4 /*yield*/, asJpg()];
                case 6:
                    up = _d.sent();
                    if (limit && up.bytes > limit)
                        throw new Error(tooBig(up.bytes));
                    return [2 /*return*/, up];
                case 7:
                    if (!(picture && !realJpeg)) return [3 /*break*/, 13];
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 12, , 13]);
                    return [4 /*yield*/, asJpg({ maxSide: 0, quality: 0.9 })];
                case 9:
                    up = _d.sent();
                    if (!(limit && up.bytes > limit)) return [3 /*break*/, 11];
                    return [4 /*yield*/, asJpg()];
                case 10:
                    up = _d.sent();
                    _d.label = 11;
                case 11:
                    if (limit && up.bytes > limit)
                        throw new Error(tooBig(up.bytes));
                    return [2 /*return*/, up];
                case 12:
                    error_21 = _d.sent();
                    // A HEIC that cannot be turned into a JPG, or a file that is simply too big, stops here; a picture this browser cannot open goes as it is
                    if (heic || error_21.retry || /^the file is /.test(error_21.message))
                        throw error_21;
                    return [3 /*break*/, 13];
                case 13:
                    if (!(limit && file.size > limit)) return [3 /*break*/, 18];
                    if (!picture) return [3 /*break*/, 17];
                    _d.label = 14;
                case 14:
                    _d.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, asJpg()];
                case 15:
                    up = _d.sent();
                    if (up.bytes <= limit)
                        return [2 /*return*/, up];
                    return [3 /*break*/, 17];
                case 16:
                    e_14 = _d.sent();
                    return [3 /*break*/, 17];
                case 17: throw new Error(tooBig(file.size));
                case 18: return [2 /*return*/, { body: file, name: file.name || 'file', mimeType: file.type || mimeFromName(file.name), bytes: file.size, shrunk: false, convertedFrom: '' }];
            }
        });
    });
}
function deleteAssetFile(set, id, column, logEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var path, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = "".concat(set, "(").concat(id, ")/").concat(column);
                    logEvent("Removing the file in ".concat(column, " of asset ").concat(id), 'data', { column: column, id: id, action: 'delete' }, { method: 'DELETE', path: path, contentType: '(no body)' });
                    return [4 /*yield*/, fetch(apiUrl(path), { method: 'DELETE', headers: ODATA_HEADERS })];
                case 1:
                    res = _b.sent();
                    if (!(!res.ok && res.status !== 404)) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Downloads the stored file and hands it to the browser under its own name
function openAssetFile(set, id, column, fileName, isImage) {
    return __awaiter(this, void 0, void 0, function () {
        var tries, res, i, _a, _b, blob, name, url, a;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tries = isImage ? ["".concat(set, "(").concat(id, ")/").concat(column, "/$value?size=full"), "".concat(set, "(").concat(id, ")/").concat(column, "/$value")] : ["".concat(set, "(").concat(id, ")/").concat(column, "/$value")];
                    res = null;
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < tries.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetch(apiUrl(tries[i]), { headers: __assign({ Accept: '*/*' }, NO_CACHE) })];
                case 2:
                    res = _c.sent();
                    // 204 = no full-size copy stored: try the thumbnail
                    if (res.ok && res.status !== 204)
                        return [3 /*break*/, 4];
                    _c.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(!res || !res.ok)) return [3 /*break*/, 8];
                    _a = Error.bind;
                    if (!res) return [3 /*break*/, 6];
                    return [4 /*yield*/, readApiError(res)];
                case 5:
                    _b = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _b = 'no response';
                    _c.label = 7;
                case 7: throw new (_a.apply(Error, [void 0, _b]))();
                case 8:
                    if (res.status === 204)
                        throw new Error('nothing is stored in this column');
                    return [4 /*yield*/, res.blob()];
                case 9:
                    blob = _c.sent();
                    name = fileName || res.headers.get('x-ms-file-name') || "".concat(column).concat(isImage ? '.jpg' : '');
                    url = URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = name;
                    a.rel = 'noopener';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(function () { return URL.revokeObjectURL(url); }, 60000);
                    return [2 /*return*/];
            }
        });
    });
}
// --- MAP SPOTS ---
// Saved as a little JSON text: {"v":1,"m":"MAIN","x":12.34,"y":56.78,"b":[left,top,width,height],"s":1}, in percent of the map picture.
// "s":1 = smart snap found an outline around a click, "s":2 = a dragged box was fitted to the lines in it. "12.3;45.6" typed by
// hand also counts as a spot.
var clampPct = function (n) { return Math.max(0, Math.min(100, n)); };
var round2 = function (n) { return Math.round(n * 100) / 100; };
function parseMapLocation(text) {
    if (text === null || text === undefined || String(text).trim() === '')
        return null;
    var num = function (v) { return (typeof v === 'number' && isFinite(v) ? clampPct(v) : null); };
    try {
        var o = JSON.parse(text);
        if (o && typeof o === 'object') {
            var x = num(o.x);
            var y = num(o.y);
            if (x === null || y === null)
                return null;
            var box = Array.isArray(o.b) && o.b.length === 4 && o.b.every(function (v) { return typeof v === 'number' && isFinite(v); }) ? o.b : null;
            return { x: x, y: y, box: box, snapped: o.s === 1 || o.s === 2, how: o.s === 2 ? 'box' : 'click', map: typeof o.m === 'string' ? o.m.toUpperCase() : '' };
        }
    }
    catch (e) { /* not JSON */ }
    var m = String(text).match(/^\s*(\d+(?:\.\d+)?)\s*[;,]\s*(\d+(?:\.\d+)?)\s*$/);
    return m ? { x: clampPct(parseFloat(m[1])), y: clampPct(parseFloat(m[2])), box: null, snapped: false, how: 'click', map: '' } : null;
}
function mapLocationText(spot, mapKey, maxLength) {
    var o = { v: 1, m: mapKey || 'MAIN', x: round2(spot.x), y: round2(spot.y) };
    if (spot.box)
        o.b = spot.box.map(round2);
    if (spot.snapped)
        o.s = spot.how === 'box' ? 2 : 1;
    var text = JSON.stringify(o);
    if (maxLength && text.length > maxLength) {
        delete o.b;
        text = JSON.stringify(o);
    }
    if (maxLength && text.length > maxLength)
        text = "".concat(o.x, ";").concat(o.y);
    return text;
}
// Pins belong to the map they were placed on; older spots without a map code (or coded MAIN) belong to the main map
var pinOnMap = function (location, mapKey) {
    if (!location)
        return false;
    var key = mapKey || 'MAIN';
    var at = mapKeyOf(location.map);
    return at === key || (onMainMapCode(at) && key === MAP_STATE.mainKey);
};
// --- SMART SNAP ---
// The map picture is read once into a dark / light grid (dark = lines, walls and solid shapes). A click inside an outlined
// area fills outward until the fill meets dark lines. Small gaps such as doors are closed first so the fill stays in the room,
// then the area is grown back to the lines. A fill that reaches the picture's edge or gets huge is open floor: no snap.
var SNAP_MAX_SIDE = 1600; // px; bigger pictures are scaled down before they are analysed (memory on phones)
var SNAP_MAX_SHARE = 0.25; // a fill bigger than this share of the picture is not an outlined area
var SNAP_SOLID_SHARE = 0.02; // a dark shape bigger than this share is the wall network, not a piece of equipment
var SNAP_MIN_PX = 25; // smaller than this is a speck
var snapCache = { src: null, promise: null };
var loadPicture = function (src) { return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () { return resolve(img); };
    img.onerror = function () { return reject(new Error('the map picture could not be opened')); };
    img.src = src;
}); };
// Otsu: the grey level that best splits the picture into dark and light
function otsuThreshold(hist, total) {
    var sum = 0;
    for (var i = 0; i < 256; i += 1)
        sum += i * hist[i];
    var sumB = 0;
    var wB = 0;
    var best = 0;
    var threshold = 128;
    for (var t = 0; t < 256; t += 1) {
        wB += hist[t];
        if (wB === 0)
            continue;
        var wF = total - wB;
        if (wF === 0)
            break;
        sumB += t * hist[t];
        var mB = sumB / wB;
        var mF = (sum - sumB) / wF;
        var between = wB * wF * (mB - mF) * (mB - mF);
        if (between > best) {
            best = between;
            threshold = t + 1;
        }
    }
    return threshold;
}
// Square dilation (a pixel turns dark when any pixel within r is dark), two passes of a sliding window count
function dilate(src, w, h, r) {
    var tmp = new Uint8Array(w * h);
    var out = new Uint8Array(w * h);
    for (var y = 0; y < h; y += 1) {
        var row = y * w;
        var count = 0;
        for (var x = 0; x < Math.min(r, w); x += 1)
            count += src[row + x];
        for (var x = 0; x < w; x += 1) {
            if (x + r < w)
                count += src[row + x + r];
            if (x - r - 1 >= 0)
                count -= src[row + x - r - 1];
            tmp[row + x] = count > 0 ? 1 : 0;
        }
    }
    for (var x = 0; x < w; x += 1) {
        var count = 0;
        for (var y = 0; y < Math.min(r, h); y += 1)
            count += tmp[y * w + x];
        for (var y = 0; y < h; y += 1) {
            if (y + r < h)
                count += tmp[(y + r) * w + x];
            if (y - r - 1 >= 0)
                count -= tmp[(y - r - 1) * w + x];
            out[y * w + x] = count > 0 ? 1 : 0;
        }
    }
    return out;
}
function buildSnapGrid(src) {
    return __awaiter(this, void 0, void 0, function () {
        var img, nw, nh, scale, w, h, canvas, ctx, cell, k, oy, ox, pixels, n, lum, hist, i, i, l, threshold, dark, i, gap, closed, labels, sizes, edges, stack, next, start, top, size, edge, i, x, y;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadPicture(src)];
                case 1:
                    img = _a.sent();
                    nw = img.naturalWidth || img.width;
                    nh = img.naturalHeight || img.height;
                    if (!nw || !nh)
                        throw new Error('the map picture has no size');
                    scale = Math.min(1, SNAP_MAX_SIDE / Math.max(nw, nh));
                    w = Math.max(1, Math.round(nw * scale));
                    h = Math.max(1, Math.round(nh * scale));
                    canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#FFFFFF'; // see-through parts count as light floor
                    ctx.fillRect(0, 0, w, h);
                    if (scale < 1) {
                        cell = 1 / scale;
                        k = Math.min(8, Math.ceil(cell));
                        ctx.imageSmoothingEnabled = false;
                        ctx.globalCompositeOperation = 'darken';
                        for (oy = 0; oy < k; oy += 1) {
                            for (ox = 0; ox < k; ox += 1) {
                                ctx.drawImage(img, (ox * cell) / k, (oy * cell) / k, w * cell, h * cell, 0, 0, w, h);
                            }
                        }
                        ctx.globalCompositeOperation = 'source-over';
                    }
                    else {
                        ctx.drawImage(img, 0, 0, w, h);
                    }
                    try {
                        pixels = ctx.getImageData(0, 0, w, h).data;
                    }
                    catch (e) {
                        throw new Error('this browser does not let the app read the map picture');
                    }
                    n = w * h;
                    lum = new Uint8Array(n);
                    hist = new Array(256);
                    for (i = 0; i < 256; i += 1)
                        hist[i] = 0;
                    for (i = 0; i < n; i += 1) {
                        l = Math.round(0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2]);
                        lum[i] = l;
                        hist[l] += 1;
                    }
                    threshold = Math.max(40, Math.min(200, otsuThreshold(hist, n)));
                    dark = new Uint8Array(n);
                    for (i = 0; i < n; i += 1)
                        dark[i] = lum[i] < threshold ? 1 : 0;
                    gap = Math.max(1, Math.round(Math.max(w, h) / 600));
                    closed = dilate(dark, w, h, gap);
                    labels = new Int32Array(n);
                    sizes = [0];
                    edges = [false];
                    stack = new Int32Array(n);
                    next = 1;
                    for (start = 0; start < n; start += 1) {
                        if (closed[start] || labels[start])
                            continue;
                        top = 0;
                        size = 0;
                        edge = false;
                        stack[top++] = start;
                        labels[start] = next;
                        while (top > 0) {
                            i = stack[--top];
                            size += 1;
                            x = i % w;
                            y = (i - x) / w;
                            if (x === 0 || y === 0 || x === w - 1 || y === h - 1)
                                edge = true;
                            if (x > 0 && !closed[i - 1] && !labels[i - 1]) {
                                labels[i - 1] = next;
                                stack[top++] = i - 1;
                            }
                            if (x < w - 1 && !closed[i + 1] && !labels[i + 1]) {
                                labels[i + 1] = next;
                                stack[top++] = i + 1;
                            }
                            if (y > 0 && !closed[i - w] && !labels[i - w]) {
                                labels[i - w] = next;
                                stack[top++] = i - w;
                            }
                            if (y < h - 1 && !closed[i + w] && !labels[i + w]) {
                                labels[i + w] = next;
                                stack[top++] = i + w;
                            }
                        }
                        sizes.push(size);
                        edges.push(edge);
                        next += 1;
                    }
                    return [2 /*return*/, { w: w, h: h, dark: dark, closed: closed, labels: labels, sizes: sizes, edges: edges, gap: gap, threshold: threshold }];
            }
        });
    });
}
function getSnapGrid(src) {
    if (snapCache.src !== src || !snapCache.promise) {
        snapCache = { src: src, promise: buildSnapGrid(src) };
        // A failure is not kept: the next click tries again
        snapCache.promise.catch(function () { if (snapCache.src === src)
            snapCache = { src: null, promise: null }; });
    }
    return snapCache.promise;
}
// 4-connected fill over cells equal to `want`. Returns { pixels, edge } or null when it passes `maxArea`.
function floodFill(cells, w, h, seed, want, maxArea) {
    if (seed < 0 || cells[seed] !== want)
        return null;
    var seen = new Uint8Array(w * h);
    var stack = [seed];
    var pixels = [];
    var edge = false;
    seen[seed] = 1;
    while (stack.length) {
        var i = stack.pop();
        pixels.push(i);
        if (pixels.length > maxArea)
            return null;
        var x = i % w;
        var y = (i - x) / w;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1)
            edge = true;
        if (x > 0 && !seen[i - 1] && cells[i - 1] === want) {
            seen[i - 1] = 1;
            stack.push(i - 1);
        }
        if (x < w - 1 && !seen[i + 1] && cells[i + 1] === want) {
            seen[i + 1] = 1;
            stack.push(i + 1);
        }
        if (y > 0 && !seen[i - w] && cells[i - w] === want) {
            seen[i - w] = 1;
            stack.push(i - w);
        }
        if (y < h - 1 && !seen[i + w] && cells[i + w] === want) {
            seen[i + w] = 1;
            stack.push(i + w);
        }
    }
    return { pixels: pixels, edge: edge };
}
// Region -> what the map draws and saves: pin point, box (percent) and a mask cut to the box
function describeRegion(grid, pixels, kind, clickIndex) {
    var w = grid.w, h = grid.h;
    var minX = w;
    var minY = h;
    var maxX = 0;
    var maxY = 0;
    var sx = 0;
    var sy = 0;
    for (var k = 0; k < pixels.length; k += 1) {
        var i = pixels[k];
        var x = i % w;
        var y = (i - x) / w;
        if (x < minX)
            minX = x;
        if (x > maxX)
            maxX = x;
        if (y < minY)
            minY = y;
        if (y > maxY)
            maxY = y;
        sx += x;
        sy += y;
    }
    var bw = maxX - minX + 1;
    var bh = maxY - minY + 1;
    var mask = new Uint8Array(bw * bh);
    for (var k = 0; k < pixels.length; k += 1) {
        var i = pixels[k];
        var x = i % w;
        var y = (i - x) / w;
        mask[(y - minY) * bw + (x - minX)] = 1;
    }
    // The pin goes in the middle; for an L or U shape whose middle is outside, the area's pixel nearest the middle
    var cx = Math.round(sx / pixels.length);
    var cy = Math.round(sy / pixels.length);
    if (!mask[(cy - minY) * bw + (cx - minX)]) {
        var best = clickIndex;
        var bestD = Infinity;
        for (var k = 0; k < pixels.length; k += 1) {
            var i = pixels[k];
            var x = i % w;
            var y = (i - x) / w;
            var d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
            if (d < bestD) {
                bestD = d;
                best = i;
            }
        }
        cx = best % w;
        cy = (best - cx) / w;
    }
    return {
        kind: kind,
        x: ((cx + 0.5) / w) * 100,
        y: ((cy + 0.5) / h) * 100,
        box: [(minX / w) * 100, (minY / h) * 100, (bw / w) * 100, (bh / h) * 100],
        mask: { w: bw, h: bh, data: mask },
        origin: [minX, minY],
        area: pixels.length,
        gridW: w
    };
}
// Is grid pixel (px, py) part of the region?
var regionHas = function (region, px, py) {
    var x = px - region.origin[0];
    var y = py - region.origin[1];
    return x >= 0 && y >= 0 && x < region.mask.w && y < region.mask.h && region.mask.data[y * region.mask.w + x] === 1;
};
// The outlined area (or solid shape) at a click, or null when there is none
function snapAt(grid, xPct, yPct) {
    var w = grid.w, h = grid.h, dark = grid.dark, closed = grid.closed, labels = grid.labels, sizes = grid.sizes, edges = grid.edges, gap = grid.gap;
    var n = w * h;
    var px = Math.max(0, Math.min(w - 1, Math.floor((xPct / 100) * w)));
    var py = Math.max(0, Math.min(h - 1, Math.floor((yPct / 100) * h)));
    var click = py * w + px;
    // Smaller than this is a speck (the inside of a letter "o" in a label), not an area
    var minArea = Math.max(SNAP_MIN_PX, Math.floor(n * 0.00004));
    var maxArea = Math.floor(n * SNAP_MAX_SHARE);
    // 'room' = an outlined area, 'open' = open floor (reaches the edge or is huge), 'speck' = too small
    var kindOf = function (label) { return (edges[label] || sizes[label] > maxArea ? 'open' : (sizes[label] < minArea ? 'speck' : 'room')); };
    // The area of a light seed, grown back over the strip the gap closing took, up to the real lines.
    // `inside`: the click itself is in the area (not on its wall or label), so the pin can stay where it was clicked.
    var roomFrom = function (seed) {
        var region = growRoom(seed);
        if (region)
            region.inside = regionHas(region, px, py);
        return region;
    };
    var growRoom = function (seed) {
        var room = floodFill(closed, w, h, seed, 0, maxArea);
        if (!room)
            return null;
        var inside = new Uint8Array(n);
        room.pixels.forEach(function (i) { inside[i] = 1; });
        var frontier = room.pixels;
        var all = room.pixels.slice();
        for (var step = 0; step < gap; step += 1) {
            var nextFrontier = [];
            for (var k = 0; k < frontier.length; k += 1) {
                var i = frontier[k];
                var x = i % w;
                var nb = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w];
                for (var j = 0; j < 4; j += 1) {
                    var q = nb[j];
                    if (q < 0 || q >= n || inside[q] || dark[q])
                        continue;
                    inside[q] = 1;
                    nextFrontier.push(q);
                    all.push(q);
                }
            }
            frontier = nextFrontier;
        }
        return describeRegion(grid, all, 'room', seed);
    };
    if (!closed[click]) {
        var kind = kindOf(labels[click]);
        if (kind === 'room')
            return roomFrom(click);
        if (kind === 'open')
            return null; // open floor: no outlined area here
    }
    else if (dark[click]) {
        // On something dark: a solid shape (equipment drawn in black) is the target when it is filled, chunky and big enough;
        // the strokes of a room's text label or a line are not
        var solid = floodFill(dark, w, h, click, 1, Math.floor(n * SNAP_SOLID_SHARE));
        if (solid && !solid.edge && solid.pixels.length >= Math.max(minArea * 4, Math.floor(n * 0.0003))) {
            var shape = describeRegion(grid, solid.pixels, 'shape', click);
            if (shape.area / (shape.mask.w * shape.mask.h) >= 0.6 && Math.min(shape.mask.w, shape.mask.h) >= gap * 3 + 3)
                return shape;
        }
    }
    // A line, a label or a speck: the nearest outlined area around the click (open floor and specks are skipped)
    var radius = (gap * 3 + 3) * 4;
    var seen = {};
    for (var r = 1; r <= radius; r += 1) {
        var best = -1;
        var bestD = Infinity;
        for (var dy = -r; dy <= r; dy += 1) {
            for (var dx = -r; dx <= r; dx += 1) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) !== r)
                    continue;
                var x = px + dx;
                var y = py + dy;
                if (x < 0 || y < 0 || x >= w || y >= h)
                    continue;
                var i = y * w + x;
                if (closed[i])
                    continue;
                var label = labels[i];
                var d = dx * dx + dy * dy;
                if (!seen[label])
                    seen[label] = kindOf(label);
                if (seen[label] === 'room' && d < bestD) {
                    best = i;
                    bestD = d;
                }
            }
        }
        if (best >= 0)
            return roomFrom(best);
    }
    return null;
}
// Does a freshly found region still match a saved box (the map picture may have been replaced since)?
var boxesAgree = function (a, b) {
    if (!a || !b)
        return false;
    var ix = Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]));
    var iy = Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
    var inter = ix * iy;
    var union = a[2] * a[3] + b[2] * b[3] - inter;
    return union > 0 && inter / union > 0.6;
};
// A dragged box (percent of the picture: [x0, y0, x1, y1]): the outline the black lines inside it draw. Areas those lines
// close off inside the box are filled, with the lines around them; lines that only run on past them are cut. When the lines
// close nothing off, the box shrinks to the lines themselves. No lines in the box: null (the box is used as drawn).
function snapBox(grid, rect) {
    var w = grid.w, h = grid.h, dark = grid.dark, closed = grid.closed, gap = grid.gap;
    var x0 = Math.max(0, Math.floor((Math.min(rect[0], rect[2]) / 100) * w));
    var x1 = Math.min(w - 1, Math.ceil((Math.max(rect[0], rect[2]) / 100) * w) - 1);
    var y0 = Math.max(0, Math.floor((Math.min(rect[1], rect[3]) / 100) * h));
    var y1 = Math.min(h - 1, Math.ceil((Math.max(rect[1], rect[3]) / 100) * h) - 1);
    var bw = x1 - x0 + 1;
    var bh = y1 - y0 + 1;
    if (bw < 3 || bh < 3)
        return null;
    var n = bw * bh;
    var at = function (k) { var lx = k % bw; return (y0 + (k - lx) / bw) * w + x0 + lx; };
    // Light floor that can be reached from the box's edge (with door gaps closed) is outside what the lines draw
    var outside = new Uint8Array(n);
    var stack = new Int32Array(n);
    var top = 0;
    var reach = function (k) { if (!outside[k] && !closed[at(k)]) {
        outside[k] = 1;
        stack[top++] = k;
    } };
    // Every light pixel on the box's edge is outside, even one close to the lines (a box drawn tight round a shape);
    // only the ones clear of the lines spread, so a doorway on the edge does not open the room behind it
    var seed = function (k) { if (outside[k] || dark[at(k)])
        return; outside[k] = 1; if (!closed[at(k)])
        stack[top++] = k; };
    for (var lx = 0; lx < bw; lx += 1) {
        seed(lx);
        seed((bh - 1) * bw + lx);
    }
    for (var ly = 0; ly < bh; ly += 1) {
        seed(ly * bw);
        seed(ly * bw + bw - 1);
    }
    while (top > 0) {
        var k = stack[--top];
        var lx = k % bw;
        if (lx > 0)
            reach(k - 1);
        if (lx < bw - 1)
            reach(k + 1);
        if (k >= bw)
            reach(k - bw);
        if (k + bw < n)
            reach(k + bw);
    }
    // ...and the strip the gap closing took from it, back up to the real lines
    for (var step = 0; step < gap; step += 1) {
        var grow = [];
        for (var k = 0; k < n; k += 1) {
            if (outside[k] || dark[at(k)])
                continue;
            var lx = k % bw;
            if ((lx > 0 && outside[k - 1]) || (lx < bw - 1 && outside[k + 1]) || (k >= bw && outside[k - bw]) || (k + bw < n && outside[k + bw]))
                grow.push(k);
        }
        grow.forEach(function (k) { outside[k] = 1; });
    }
    var isDark = new Uint8Array(n);
    var light = new Uint8Array(n); // closed off by lines, not yet sorted
    var darkCount = 0;
    var minX = bw;
    var minY = bh;
    var maxX = -1;
    var maxY = -1;
    for (var k = 0; k < n; k += 1) {
        if (dark[at(k)]) {
            isDark[k] = 1;
            darkCount += 1;
            var lx = k % bw;
            var ly = (k - lx) / bw;
            if (lx < minX)
                minX = lx;
            if (lx > maxX)
                maxX = lx;
            if (ly < minY)
                minY = ly;
            if (ly > maxY)
                maxY = ly;
        }
        else if (!outside[k]) {
            light[k] = 1;
        }
    }
    if (darkCount === 0)
        return null;
    // Closed-off areas big enough to be a room or an outlined machine (the holes in letters are not)
    var minArea = Math.max(SNAP_MIN_PX, Math.floor(w * h * 0.00004));
    var enclosed = new Uint8Array(n);
    var enclosedCount = 0;
    for (var start = 0; start < n; start += 1) {
        if (!light[start])
            continue;
        var part = [start];
        light[start] = 0;
        for (var j = 0; j < part.length; j += 1) {
            var k = part[j];
            var lx = k % bw;
            if (lx > 0 && light[k - 1]) {
                light[k - 1] = 0;
                part.push(k - 1);
            }
            if (lx < bw - 1 && light[k + 1]) {
                light[k + 1] = 0;
                part.push(k + 1);
            }
            if (k >= bw && light[k - bw]) {
                light[k - bw] = 0;
                part.push(k - bw);
            }
            if (k + bw < n && light[k + bw]) {
                light[k + bw] = 0;
                part.push(k + bw);
            }
        }
        if (part.length >= minArea) {
            part.forEach(function (k) { enclosed[k] = 1; });
            enclosedCount += part.length;
        }
    }
    // Closed-off areas that fill a fair part of the box are what was boxed; a few small pockets (between letters) are not
    if (enclosedCount >= n * 0.1) {
        // The closed-off areas, and the lines around them (lines that run on are cut about one line width past the area)
        var near = dilate(enclosed, bw, bh, gap + 2);
        var pixels = [];
        for (var k = 0; k < n; k += 1)
            if (enclosed[k] || (isDark[k] && near[k]))
                pixels.push(at(k));
        var region = describeRegion(grid, pixels, 'box', at(Math.floor(bh / 2) * bw + Math.floor(bw / 2)));
        region.inside = false;
        return region;
    }
    // Nothing closed off: the box pulled in to the lines in it
    var rw = maxX - minX + 1;
    var rh = maxY - minY + 1;
    var mask = new Uint8Array(rw * rh);
    mask.fill(1);
    return {
        kind: 'box',
        x: ((x0 + minX + rw / 2) / w) * 100,
        y: ((y0 + minY + rh / 2) / h) * 100,
        box: [((x0 + minX) / w) * 100, ((y0 + minY) / h) * 100, (rw / w) * 100, (rh / h) * 100],
        mask: { w: rw, h: rh, data: mask },
        origin: [x0 + minX, y0 + minY],
        area: rw * rh,
        gridW: w,
        inside: false
    };
}
// --- EDITOR VALUES ---
// What a column holds while it is edited: text for text and numbers, true / false / null for yes-no, an array for
// multi-select choices, "YYYY-MM-DD" (or "YYYY-MM-DDTHH:mm") for dates, { id, name, set } for lookups.
var pad2 = function (n) { return (n < 10 ? "0".concat(n) : String(n)); };
var localDateText = function (d) { return "".concat(d.getFullYear(), "-").concat(pad2(d.getMonth() + 1), "-").concat(pad2(d.getDate())); };
function dateToInput(f, v) {
    if (!v)
        return '';
    var s = String(v);
    if (f.dateOnly) {
        // "Date only" behaviour and time-zone independent values are stored as written; user-local ones are an instant
        if (f.behavior !== 'UserLocal' || s.length <= 10)
            return s.slice(0, 10);
        var d_1 = new Date(s);
        return isNaN(d_1.getTime()) ? s.slice(0, 10) : localDateText(d_1);
    }
    if (f.behavior === 'TimeZoneIndependent')
        return s.slice(0, 16);
    var d = new Date(s);
    return isNaN(d.getTime()) ? '' : "".concat(localDateText(d), "T").concat(pad2(d.getHours()), ":").concat(pad2(d.getMinutes()));
}
// The wire format follows the behaviour: "Date only" is a plain date, time-zone independent is the wall clock as written,
// user local is the user's local time as UTC
function inputToDate(f, v) {
    if (!v)
        return null;
    if (f.behavior === 'DateOnly')
        return v;
    if (f.behavior === 'TimeZoneIndependent')
        return f.dateOnly ? "".concat(v, "T00:00:00Z") : "".concat(v, ":00Z");
    return new Date(f.dateOnly ? "".concat(v, "T00:00:00") : v).toISOString();
}
function emptyValue(f) {
    if (f.kind === 'bool')
        return null;
    if (f.kind === 'choices')
        return [];
    if (f.kind === 'lookup')
        return { id: '', name: '' };
    return '';
}
function toEditValue(f, row) {
    if (!row)
        return emptyValue(f);
    var v = f.kind === 'lookup' ? row["_".concat(f.name, "_value")] : row[f.name];
    switch (f.kind) {
        case 'text':
        case 'memo':
        case 'int':
        case 'number':
        case 'choice':
            return v === null || v === undefined ? '' : String(v);
        case 'bool': return v === true ? true : (v === false ? false : null);
        case 'choices': return v === null || v === undefined || v === '' ? [] : String(v).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        case 'date': return dateToInput(f, v);
        case 'lookup': return v ? { id: cleanGuid(v), name: formatted(row, "_".concat(f.name, "_value")) || '' } : { id: '', name: '' };
        default: return v;
    }
}
// Comparable form of a value (to tell what changed)
function editKey(f, v) {
    if (f.kind === 'bool')
        return v === null || v === undefined ? '' : (v ? '1' : '0');
    if (f.kind === 'choices')
        return (v || []).slice().sort().join(',');
    if (f.kind === 'lookup')
        return (v && v.id) || '';
    if (f.kind === 'int' || f.kind === 'number')
        return String(v === null || v === undefined ? '' : v).trim();
    return v === null || v === undefined ? '' : String(v);
}
var parseNumber = function (v) {
    var s = String(v).trim();
    // "12,5" from a comma-decimal keyboard
    return Number(s.indexOf('.') === -1 ? s.replace(',', '.') : s);
};
function isEmptyValue(f, v) {
    if (f.kind === 'bool')
        return v === null || v === undefined;
    if (f.kind === 'choices')
        return !v || v.length === 0;
    if (f.kind === 'lookup')
        return !v || !v.id;
    return String(v === null || v === undefined ? '' : v).trim() === '';
}
function validateField(f, v) {
    if (isEmptyValue(f, v))
        return f.required || f.isPrimaryName ? 'Required.' : '';
    if ((f.kind === 'text' || f.kind === 'memo') && f.maxLength && String(v).length > f.maxLength)
        return "At most ".concat(f.maxLength, " characters (now ").concat(String(v).length, ").");
    if (f.kind === 'int') {
        if (!/^-?\d+$/.test(String(v).trim()))
            return 'Enter a whole number.';
        var n = parseInt(v, 10);
        if (typeof f.min === 'number' && n < f.min)
            return "At least ".concat(f.min, ".");
        if (typeof f.max === 'number' && n > f.max)
            return "At most ".concat(f.max, ".");
    }
    if (f.kind === 'number') {
        var n = parseNumber(v);
        if (!isFinite(n))
            return 'Enter a number.';
        if (typeof f.min === 'number' && n < f.min)
            return "At least ".concat(f.min, ".");
        if (typeof f.max === 'number' && n > f.max)
            return "At most ".concat(f.max, ".");
        var decimals = (String(v).trim().split(/[.,]/)[1] || '').length;
        if (typeof f.precision === 'number' && decimals > f.precision)
            return "At most ".concat(f.precision, " decimal").concat(f.precision === 1 ? '' : 's', ".");
    }
    if (f.kind === 'date' && isNaN(new Date(f.dateOnly ? "".concat(v, "T00:00:00") : v).getTime()))
        return 'Enter a valid date.';
    return '';
}
// [key, value] for the PATCH / POST body
function toPayloadEntry(f, v) {
    switch (f.kind) {
        case 'text':
        case 'memo': return [f.name, String(v).trim() === '' ? null : v];
        case 'int': return [f.name, String(v).trim() === '' ? null : parseInt(v, 10)];
        case 'number': return [f.name, String(v).trim() === '' ? null : parseNumber(v)];
        case 'bool': return [f.name, v];
        case 'choice': return [f.name, v === '' ? null : parseInt(v, 10)];
        case 'choices': return [f.name, v && v.length ? v.join(',') : null];
        case 'date': return [f.name, inputToDate(f, v)];
        // Clearing a lookup is the bare navigation property set to null (Microsoft's recommended form)
        case 'lookup': return v && v.id ? ["".concat(f.nav, "@odata.bind"), "/".concat(v.set, "(").concat(v.id, ")")] : [f.nav, null];
        default: return [f.name, v];
    }
}
// What a column shows when it cannot be edited
function displayValue(f, row) {
    if (!row)
        return '';
    if (f.kind === 'lookup' || f.kind === 'fixedlookup')
        return formatted(row, "_".concat(f.name, "_value")) || '';
    if (f.kind === 'file')
        return row["".concat(f.name, "_name")] || '';
    var fv = formatted(row, f.name);
    if (fv !== undefined && fv !== null)
        return String(fv);
    var v = row[f.name];
    if (v === null || v === undefined)
        return '';
    if (f.kind === 'bool')
        return v ? (f.trueLabel || 'Yes') : (f.falseLabel || 'No');
    if (f.kind === 'date') {
        var d = new Date(v);
        return isNaN(d.getTime()) ? String(v) : (f.dateOnly ? String(v).slice(0, 10) : d.toLocaleString());
    }
    return String(v);
}
// Can the editor change this column (now)?
function isEditableField(f, isNew) {
    if (f.info || f.kind === 'status' || f.kind === 'id' || f.kind === 'fixedlookup' || f.kind === 'file' || f.kind === 'image')
        return false;
    if (isNew ? !f.canCreate : !f.canUpdate)
        return false;
    if (f.kind === 'lookup' && !(f.nav && f.targets && f.targets.length === 1))
        return false;
    if ((f.kind === 'choice' || f.kind === 'choices') && !(f.options && f.options.length))
        return false;
    return true;
}
// Sections of the editor
function groupAssetFields(fields) {
    var groups = ASSET_GROUPS.map(function (g) { return (__assign(__assign({}, g), { items: [] })); });
    var info = [];
    fields.forEach(function (f) {
        if (f.info || f.kind === 'status' || f.kind === 'id' || f.kind === 'fixedlookup') {
            info.push(f);
            return;
        }
        var g = groups.find(function (x) { return x.names && x.names.indexOf(f.name) !== -1; });
        if (!g)
            g = groups.find(function (x) { return x.kinds && x.kinds.indexOf(f.kind) !== -1; });
        if (!g && (f.kind === 'bool' || f.kind === 'int' || f.kind === 'number'))
            g = groups.find(function (x) { return x.hint && (x.hint.test(f.name) || x.hint.test(f.label)); });
        if (!g && f.isPrimaryName)
            g = groups[0];
        if (!g)
            g = groups[groups.length - 1];
        g.items.push(f);
    });
    groups.forEach(function (g) {
        var rank = function (f) { return (g.names && g.names.indexOf(f.name) !== -1 ? g.names.indexOf(f.name) : 1000) - (f.isPrimaryName ? 2000 : 0); };
        g.items.sort(function (a, b) { return rank(a) - rank(b) || a.label.localeCompare(b.label); });
    });
    return { groups: groups.filter(function (g) { return g.items.length > 0; }), info: info };
}
var targetMetaCache = {};
function loadTargetMeta(logicalName) {
    if (!targetMetaCache[logicalName]) {
        targetMetaCache[logicalName] = getJson("EntityDefinitions(LogicalName='".concat(logicalName, "')?$select=EntitySetName,PrimaryIdAttribute,PrimaryNameAttribute"))
            .then(function (d) { return ({ set: d.EntitySetName, id: d.PrimaryIdAttribute, name: d.PrimaryNameAttribute }); });
        targetMetaCache[logicalName].catch(function () { delete targetMetaCache[logicalName]; });
    }
    return targetMetaCache[logicalName];
}
var hexRgb = function (hex) { return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]; };
// ==========================================
// SHARED ON / OFF SWITCH
// ==========================================
function Switch(_a) {
    var on = _a.on, onChange = _a.onChange, label = _a.label, title = _a.title, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    return (React.createElement("button", { type: "button", role: "switch", "aria-checked": !!on, disabled: disabled, onClick: function () { return onChange(!on); }, title: title, className: "inline-flex items-center gap-2 pl-1 pr-3 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ".concat(on ? 'bg-[#00468B] text-white border-[#00468B]' : 'bg-white text-[#00468B] border-[#B3D4F2] hover:bg-[#E6F1FB]', " ").concat(className) },
        React.createElement("span", { className: "relative inline-block w-7 h-4 rounded-full transition-colors ".concat(on ? 'bg-[#FFB81C]' : 'bg-slate-300'), "aria-hidden": "true" },
            React.createElement("span", { className: "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ".concat(on ? 'left-3.5' : 'left-0.5') })),
        label));
}
// Paints a smart-snap area on the map: tinted inside, solid edge. Drawn at the area's own size and stretched over its box.
function RegionOverlay(_a) {
    var region = _a.region, fill = _a.fill, edge = _a.edge, testId = _a.testId;
    var ref = useRef(null);
    useEffect(function () {
        var canvas = ref.current;
        if (!canvas || !region)
            return;
        var _a = region.mask, w = _a.w, h = _a.h, data = _a.data;
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        var img = ctx.createImageData(w, h);
        var f = hexRgb(fill);
        var e = hexRgb(edge);
        // A thicker edge on big pictures, which are shown scaled down
        var t = region.gridW > 1200 ? 2 : 1;
        var inside = function (x, y) { return x >= 0 && y >= 0 && x < w && y < h && data[y * w + x] === 1; };
        for (var y = 0; y < h; y += 1) {
            for (var x = 0; x < w; x += 1) {
                var i = y * w + x;
                if (!data[i])
                    continue;
                var border = false;
                for (var d = 1; d <= t && !border; d += 1)
                    border = !inside(x - d, y) || !inside(x + d, y) || !inside(x, y - d) || !inside(x, y + d);
                var c = border ? e : f;
                img.data[i * 4] = c[0];
                img.data[i * 4 + 1] = c[1];
                img.data[i * 4 + 2] = c[2];
                img.data[i * 4 + 3] = border ? 255 : 95;
            }
        }
        ctx.putImageData(img, 0, 0);
    }, [region, fill, edge]);
    if (!region)
        return null;
    return (React.createElement("canvas", { ref: ref, "aria-hidden": "true", "data-testid": testId, className: "absolute pointer-events-none", style: { left: "".concat(region.box[0], "%"), top: "".concat(region.box[1], "%"), width: "".concat(region.box[2], "%"), height: "".concat(region.box[3], "%"), imageRendering: 'pixelated' } }));
}
// ==========================================
// TAB: ASSETS. Three views of the equipment table (craa5___1_a_assets): the map (smart snap, pins), the equipment table
// (every column, uploads) and bulk upload (many pictures and files, each matched to equipment by a search). Each stays alive
// once opened, so nothing typed in one is lost by looking at another.
// ==========================================
var ASSET_ROTATION_PREF = 'Midwest Plant.assets.rotation';
var ASSET_DRAG_PREF = 'Midwest Plant.assets.drag';
var ASSET_ZOOM_STEPS = [25, 33, 50, 67, 75, 100, 125, 150, 200, 250, 300, 400, 500, 600, 800];
var ASSET_ZOOM_MIN = 25;
var ASSET_ZOOM_MAX = 800;
var RotateRight = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polyline", { points: "23 4 23 10 17 10" }),
    React.createElement("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })));
var RotateLeft = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polyline", { points: "1 4 1 10 7 10" }),
    React.createElement("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" })));
var PopOutIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("polyline", { points: "9 21 3 21 3 15" }),
    React.createElement("line", { x1: "21", y1: "3", x2: "14", y2: "10" }),
    React.createElement("line", { x1: "3", y1: "21", x2: "10", y2: "14" })));
var PopInIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("polyline", { points: "4 14 10 14 10 20" }),
    React.createElement("polyline", { points: "20 10 14 10 14 4" }),
    React.createElement("line", { x1: "14", y1: "10", x2: "21", y2: "3" }),
    React.createElement("line", { x1: "3", y1: "21", x2: "10", y2: "14" })));
function AssetsTab(_a) {
    var view = _a.view, onView = _a.onView, mapImage = _a.mapImage, setMainMapImage = _a.setMainMapImage, mapNote = _a.mapNote, mapKey = _a.mapKey, assetMeta = _a.assetMeta, loadAssetMeta = _a.loadAssetMeta, assetPins = _a.assetPins, setAssetPins = _a.setAssetPins, loadPins = _a.loadPins, pinSaves = _a.pinSaves, focusRequest = _a.focusRequest, issueKit = _a.issueKit, logEvent = _a.logEvent;
    var meta = assetMeta;
    var set = meta.entitySet || ASSET_SET;
    var mapColumn = meta.mapColumn ? meta.mapColumn.name : null;
    // The top tabs (Asset Map, Asset Management, Bulk Upload) choose the view; a link inside one view opens another
    var setView = onView;
    var _b = useState(view === 'table'), tableOpened = _b[0], setTableOpened = _b[1];
    useEffect(function () { if (view === 'table')
        setTableOpened(true); }, [view]);
    var _c = useState(view === 'bulk'), bulkOpened = _c[0], setBulkOpened = _c[1];
    useEffect(function () { if (view === 'bulk')
        setBulkOpened(true); }, [view]);
    // 1. The table's columns (once per session)
    useEffect(function () {
        if (meta.status === 'idle')
            loadAssetMeta();
    }, [meta.status, loadAssetMeta]);
    var metaDone = meta.status === 'ready' || meta.status === 'error';
    // 2. Placed assets for the map (loaded by the app, which shares them with the Overview's Equipment layer)
    useEffect(function () {
        if (metaDone && mapColumn && assetPins.status === 'idle')
            loadPins();
    }, [metaDone, mapColumn, assetPins.status, loadPins]);
    // 3. Room names for the filters
    var _d = useState([]), rooms = _d[0], setRooms = _d[1];
    useEffect(function () {
        if (!metaDone)
            return undefined;
        var alive = true;
        loadAssetRooms(set).then(function (r) { if (alive)
            setRooms(r); }).catch(function (error) { return logEvent("Room list for the asset filter could not be loaded: ".concat(error.message), 'warn'); });
        return function () { alive = false; };
    }, [metaDone, set, logEvent]);
    // 4. A saved asset reaches the pins and the other view
    var _f = useState(null), rowEvent = _f[0], setRowEvent = _f[1]; // { row, summary, from, isNew, n }
    var rowSeq = useRef(0);
    var onAssetSaved = useCallback(function (row, from, isNew) {
        var summary = toAssetSummary(row, mapColumn);
        if (pinSaves.current) {
            if (summary.inactive)
                delete pinSaves.current[summary.id];
            else
                pinSaves.current[summary.id] = summary;
        }
        setAssetPins(function (p) {
            var rows = p.rows.filter(function (r) { return r.id !== summary.id; });
            return __assign(__assign({}, p), { rows: (summary.location && !summary.inactive) ? rows.concat([summary]) : rows });
        });
        rowSeq.current += 1;
        setRowEvent({ row: row, summary: summary, from: from, isNew: !!isNew, n: rowSeq.current });
    }, [mapColumn, setAssetPins]);
    // 5. One view asks the other to show an asset
    var focusSeq = useRef(0);
    var _g = useState(null), mapFocus = _g[0], setMapFocus = _g[1]; // { id, n }
    var _h = useState(null), tableFocus = _h[0], setTableFocus = _h[1]; // { id, n }
    var showOnMap = useCallback(function (id) { focusSeq.current += 1; setMapFocus({ id: id, n: focusSeq.current }); setView('map'); }, [setView]);
    var editInTable = useCallback(function (id) { if (id) {
        focusSeq.current += 1;
        setTableFocus({ id: id, n: focusSeq.current });
    } setView('table'); }, [setView]);
    // An equipment pin on the Overview asked for this asset
    var focusDone = useRef(0);
    useEffect(function () {
        if (!focusRequest || focusRequest.n === focusDone.current)
            return;
        focusDone.current = focusRequest.n;
        showOnMap(focusRequest.id);
    }, [focusRequest, showOnMap]);
    return (React.createElement("div", { className: "h-full flex flex-col bg-slate-100" },
        React.createElement("div", { className: "flex-1 min-h-0" },
            React.createElement("div", { className: view === 'map' ? 'h-full' : 'hidden' },
                React.createElement(AssetsMap, { active: view === 'map', mapImage: mapImage, setMainMapImage: setMainMapImage, mapNote: mapNote, mapKey: mapKey, meta: meta, set: set, mapColumn: mapColumn, metaDone: metaDone, loadAssetMeta: loadAssetMeta, assetPins: assetPins, loadPins: loadPins, rooms: rooms, rowEvent: rowEvent, focus: mapFocus, onAssetSaved: onAssetSaved, onEditInTable: editInTable, logEvent: logEvent })),
            tableOpened && (React.createElement("div", { className: view === 'table' ? 'h-full' : 'hidden' },
                React.createElement(AssetsTable, { meta: meta, set: set, mapColumn: mapColumn, mapKey: mapKey, metaDone: metaDone, loadAssetMeta: loadAssetMeta, rooms: rooms, rowEvent: rowEvent, focus: tableFocus, onAssetSaved: onAssetSaved, onShowOnMap: showOnMap, logEvent: logEvent }))),
            bulkOpened && (React.createElement("div", { className: view === 'bulk' ? 'h-full' : 'hidden' },
                React.createElement(AssetsBulkUpload, { meta: meta, set: set, mapColumn: mapColumn, mapKey: mapKey, metaDone: metaDone, loadAssetMeta: loadAssetMeta, onAssetSaved: onAssetSaved, onEditInTable: editInTable, issueKit: issueKit, logEvent: logEvent }))))));
}
// Where a point of the picture lands on the turned map, and back (fractions 0..1; turns are clockwise)
var turnPoint = function (rotation, x, y) {
    if (rotation === 90)
        return [1 - y, x];
    if (rotation === 180)
        return [1 - x, 1 - y];
    if (rotation === 270)
        return [y, 1 - x];
    return [x, y];
};
var unturnPoint = function (rotation, u, v) {
    if (rotation === 90)
        return [v, 1 - u];
    if (rotation === 180)
        return [1 - u, 1 - v];
    if (rotation === 270)
        return [1 - v, u];
    return [u, v];
};
var clamp01 = function (n) { return Math.max(0, Math.min(1, n)); };
// ==========================================
// ASSETS: THE MAP
// ==========================================
function AssetsMap(_a) {
    var _this = this;
    var active = _a.active, mapImage = _a.mapImage, setMainMapImage = _a.setMainMapImage, mapNote = _a.mapNote, mapKey = _a.mapKey, meta = _a.meta, set = _a.set, mapColumn = _a.mapColumn, metaDone = _a.metaDone, loadAssetMeta = _a.loadAssetMeta, assetPins = _a.assetPins, loadPins = _a.loadPins, rooms = _a.rooms, rowEvent = _a.rowEvent, focus = _a.focus, onAssetSaved = _a.onAssetSaved, onEditInTable = _a.onEditInTable, logEvent = _a.logEvent;
    var rootRef = useRef(null);
    var containerRef = useRef(null);
    var stageRef = useRef(null);
    var _b = useState(100), zoomLevel = _b[0], setZoomLevel = _b[1];
    var _c = useState(function () { var r = readPref(ASSET_ROTATION_PREF, 0); return [0, 90, 180, 270].indexOf(r) !== -1 ? r : 0; }), rotation = _c[0], setRotation = _c[1];
    useEffect(function () { writePref(ASSET_ROTATION_PREF, rotation); }, [rotation]);
    var _d = useState(function () { return (readPref(ASSET_DRAG_PREF, 'box') === 'move' ? 'move' : 'box'); }), dragMode = _d[0], setDragMode = _d[1];
    useEffect(function () { writePref(ASSET_DRAG_PREF, dragMode); }, [dragMode]);
    var _f = useState(false), popped = _f[0], setPopped = _f[1];
    var _g = useState(null), natural = _g[0], setNatural = _g[1]; // { w, h } of the map picture
    var _h = useState(function () { return readPref(SNAP_PREF, true) !== false; }), snapOn = _h[0], setSnapOn = _h[1];
    useEffect(function () { writePref(SNAP_PREF, snapOn); }, [snapOn]);
    var _j = useState(null), selectedId = _j[0], setSelectedId = _j[1]; // asset open in the side panel
    var _k = useState(null), creating = _k[0], setCreating = _k[1]; // { location } while a new asset is filled in
    var _l = useState(null), placingFor = _l[0], setPlacingFor = _l[1]; // { id, name } of the asset being placed, { id: 'new' } for the new-asset form
    var _m = useState(null), spot = _m[0], setSpot = _m[1]; // the picked spot: { x, y, box, snapped, how, region, note }
    var _o = useState(false), snapBusy = _o[0], setSnapBusy = _o[1];
    var _p = useState(false), dirty = _p[0], setDirty = _p[1]; // the new-asset form has unsaved changes
    var _q = useState(null), pendingNav = _q[0], setPendingNav = _q[1]; // { run } waiting for "Discard changes?"
    var _r = useState(0), refreshToken = _r[0], setRefreshToken = _r[1]; // bump: the open asset is read again
    var _s = useState(null), selectedRegion = _s[0], setSelectedRegion = _s[1];
    var _t = useState(''), actionError = _t[0], setActionError = _t[1];
    var _u = useState(false), savingSpot = _u[0], setSavingSpot = _u[1];
    var _v = useState(null), dragRect = _v[0], setDragRect = _v[1]; // [u0, v0, u1, v1] on the turned map while a box is drawn
    var clickSeq = useRef(0);
    // Another map from the header: a spot picked on the old map does not fit this one
    var shownMapKey = useRef(mapKey);
    useEffect(function () {
        if (shownMapKey.current === mapKey)
            return;
        shownMapKey.current = mapKey;
        clickSeq.current += 1;
        setSnapBusy(false);
        setSpot(null);
        setDragRect(null);
        setSelectedRegion(null);
        setCreating(function (c) { return (c && c.location ? __assign(__assign({}, c), { location: null }) : c); });
    }, [mapKey]);
    // Search (one box for the list and the pins)
    var _w = useState(''), query = _w[0], setQuery = _w[1];
    var _x = useState(''), debounced = _x[0], setDebounced = _x[1];
    useEffect(function () {
        var t = setTimeout(function () { return setDebounced(query); }, 300);
        return function () { return clearTimeout(t); };
    }, [query]);
    var words = useMemo(function () { return debounced.trim().split(/\s+/).filter(Boolean).slice(0, 4); }, [debounced]);
    var _y = useState('all'), placement = _y[0], setPlacement = _y[1];
    var _z = useState(''), room = _z[0], setRoom = _z[1];
    var _0 = useState({ rows: [], next: null, loading: true, error: '' }), list = _0[0], setList = _0[1];
    var listReq = useRef(0);
    // The list: the first page whenever the search or filters change
    var listKey = [words.join(' '), room, placement, mapColumn || '', metaDone ? '1' : '0'].join('#');
    useEffect(function () {
        if (!metaDone)
            return;
        var req = listReq.current + 1;
        listReq.current = req;
        setList(function (l) { return (__assign(__assign({}, l), { loading: true, error: '' })); });
        fetchAssetPage({ set: set, words: words, room: room, placement: placement, mapColumn: mapColumn, next: null })
            .then(function (page) { if (req === listReq.current)
            setList({ rows: page.rows, next: page.next, loading: false, error: '' }); })
            .catch(function (error) {
            if (req !== listReq.current)
                return;
            logEvent("Asset list query failed: ".concat(error.message), 'error');
            setList({ rows: [], next: null, loading: false, error: error.message });
        });
    }, [listKey]); // eslint-disable-line react-hooks/exhaustive-deps
    var showMore = function () {
        if (!list.next || list.loading)
            return;
        var req = listReq.current + 1;
        listReq.current = req;
        setList(function (l) { return (__assign(__assign({}, l), { loading: true, error: '' })); });
        fetchAssetPage({ set: set, mapColumn: mapColumn, next: list.next })
            .then(function (page) {
            if (req !== listReq.current)
                return;
            setList(function (l) {
                var have = {};
                l.rows.forEach(function (r) { have[r.id] = true; });
                return { rows: l.rows.concat(page.rows.filter(function (r) { return !have[r.id]; })), next: page.next, loading: false, error: '' };
            });
        })
            .catch(function (error) { if (req === listReq.current)
            setList(function (l) { return (__assign(__assign({}, l), { loading: false, error: error.message })); }); });
    };
    // Keep the list in step with a saved asset (the pins follow in the parent)
    var applyToList = useCallback(function (summary, isNewRow) {
        setList(function (l) { return (__assign(__assign({}, l), { rows: isNewRow ? [summary].concat(l.rows.filter(function (r) { return r.id !== summary.id; })) : l.rows.map(function (r) { return (r.id === summary.id ? summary : r); }) })); });
    }, []);
    var saved = useCallback(function (row, isNewRow) {
        applyToList(toAssetSummary(row, mapColumn), isNewRow);
        onAssetSaved(row, 'map', isNewRow);
    }, [applyToList, onAssetSaved, mapColumn]);
    // Saved in the table: the list and the open card follow
    useEffect(function () {
        if (!rowEvent || rowEvent.from === 'map')
            return;
        applyToList(rowEvent.summary, rowEvent.isNew);
        if (rowEvent.summary.id === selectedId)
            setRefreshToken(function (t) { return t + 1; });
    }, [rowEvent && rowEvent.n]); // eslint-disable-line react-hooks/exhaustive-deps
    // Pins on this map that match the search
    var pinWords = useMemo(function () { return query.trim().toLowerCase().split(/\s+/).filter(Boolean); }, [query]);
    var pinsHere = useMemo(function () { return assetPins.rows.filter(function (p) { return pinOnMap(p.location, mapKey); }); }, [assetPins.rows, mapKey]);
    var visiblePins = useMemo(function () { return (pinWords.length === 0 ? pinsHere : pinsHere.filter(function (p) { var t = "".concat(p.name, " ").concat(p.room, " ").concat(p.area).toLowerCase(); return pinWords.every(function (w) { return t.includes(w); }); })); }, [pinsHere, pinWords]);
    var otherMapPins = assetPins.rows.length - pinsHere.length;
    // Pins on the same point (older spots, or two assets on one machine) are fanned out a little so each can be clicked
    var pinOffsets = useMemo(function () {
        var groups = {};
        visiblePins.forEach(function (p) {
            var k = "".concat(Math.round(p.location.x * 5), ":").concat(Math.round(p.location.y * 5));
            (groups[k] = groups[k] || []).push(p.id);
        });
        var out = {};
        Object.keys(groups).forEach(function (k) {
            var ids = groups[k];
            if (ids.length < 2)
                return;
            var radius = Math.max(9, ids.length * 2);
            ids.forEach(function (id, i) {
                var a = (2 * Math.PI * i) / ids.length - Math.PI / 2;
                out[id] = [Math.round(Math.cos(a) * radius), Math.round(Math.sin(a) * radius)];
            });
        });
        return out;
    }, [visiblePins]);
    var selectedPin = selectedId ? assetPins.rows.find(function (p) { return p.id === selectedId; }) || null : null;
    var selectedLocation = selectedPin && pinOnMap(selectedPin.location, mapKey) ? selectedPin.location : null;
    // The outline of the open asset's saved spot (worked out again from the picture)
    useEffect(function () {
        setSelectedRegion(null);
        var loc = selectedLocation;
        if (!loc || !loc.snapped || !mapImage)
            return undefined;
        var alive = true;
        getSnapGrid(mapImage)
            .then(function (grid) {
            if (!alive)
                return;
            var r = null;
            if (loc.how === 'box' && loc.box) {
                var b = loc.box;
                // A margin wider than the gap closing, so the light edge round the shape is not taken for an area of its own
                var mx = ((grid.gap + 2) / grid.w) * 100;
                var my = ((grid.gap + 2) / grid.h) * 100;
                r = snapBox(grid, [b[0] - mx, b[1] - my, b[0] + b[2] + mx, b[1] + b[3] + my]);
            }
            else {
                r = snapAt(grid, loc.x, loc.y);
            }
            setSelectedRegion(r && (!loc.box || boxesAgree(r.box, loc.box)) ? r : null);
        })
            .catch(function () { });
        return function () { alive = false; };
    }, [selectedId, selectedLocation ? "".concat(selectedLocation.x, ":").concat(selectedLocation.y, ":").concat(selectedLocation.how) : '', mapImage]); // eslint-disable-line react-hooks/exhaustive-deps
    // Unsaved edits are never dropped silently
    var guard = function (run) {
        if (dirty)
            setPendingNav({ run: run });
        else
            run();
    };
    // --- The turned, zoomed map ---
    var quarter = rotation === 90 || rotation === 270;
    var nat = natural || { w: 1, h: 1 };
    // The stage is the map as it is seen (turned); the picture sits in its middle, turned by CSS
    var stageStyle = {
        width: "".concat(zoomLevel, "%"),
        aspectRatio: quarter ? "".concat(nat.h, " / ").concat(nat.w) : "".concat(nat.w, " / ").concat(nat.h),
        touchAction: 'none'
    };
    var pictureStyle = {
        width: quarter ? "".concat((nat.w / nat.h) * 100, "%") : '100%',
        height: quarter ? "".concat((nat.h / nat.w) * 100, "%") : '100%',
        left: '50%',
        top: '50%',
        transform: "translate(-50%, -50%) rotate(".concat(rotation, "deg)")
    };
    // Zooming keeps the point under the pointer (or the middle of the view) where it is
    var zoomAnchor = useRef(null);
    var lastAnchor = useRef(null); // the picture point of the last zoom step, so the steps of one gesture keep exactly that point
    var zoomRef = useRef({ level: 100, zoomTo: null });
    var zoomTo = useCallback(function (target, clientX, clientY) {
        var next = Math.max(ASSET_ZOOM_MIN, Math.min(ASSET_ZOOM_MAX, Math.round(target)));
        var c = containerRef.current;
        var s = stageRef.current;
        if (c && s && next !== zoomRef.current.level) {
            var cr = c.getBoundingClientRect();
            var sr = s.getBoundingClientRect();
            var px = clientX === undefined ? cr.left + cr.width / 2 : clientX;
            var py = clientY === undefined ? cr.top + cr.height / 2 : clientY;
            if (sr.width > 0 && sr.height > 0 && cr.width > 0 && cr.height > 0) {
                // Where the pointer is inside the scrolling area, in the map's own pixels (the app's zoom, borders and scrollbars aside)
                var ox = clientX === undefined ? c.clientWidth / 2 : (px - cr.left) * (c.offsetWidth / cr.width) - c.clientLeft;
                var oy = clientY === undefined ? c.clientHeight / 2 : (py - cr.top) * (c.offsetHeight / cr.height) - c.clientTop;
                var fx = (px - sr.left) / sr.width;
                var fy = (py - sr.top) / sr.height;
                // The pointer has not moved since the last step and the same point (to a pixel or two) is under it: keep that exact
                // point, so the whole-pixel scroll of each step cannot add up to a drift over a long pinch or wheel
                var last = lastAnchor.current;
                if (last && last.px === px && last.py === py && Math.abs((last.fx - fx) * sr.width) < 2 && Math.abs((last.fy - fy) * sr.height) < 2) {
                    fx = last.fx;
                    fy = last.fy;
                }
                lastAnchor.current = { px: px, py: py, fx: fx, fy: fy };
                zoomAnchor.current = { fx: fx, fy: fy, ox: ox, oy: oy };
            }
        }
        zoomRef.current.level = next;
        setZoomLevel(next);
    }, []);
    zoomRef.current.zoomTo = zoomTo;
    React.useLayoutEffect(function () {
        zoomRef.current.level = zoomLevel;
        var a = zoomAnchor.current;
        zoomAnchor.current = null;
        var c = containerRef.current;
        var s = stageRef.current;
        if (!a || !c || !s)
            return;
        c.scrollLeft = s.offsetLeft + a.fx * s.offsetWidth - a.ox;
        c.scrollTop = s.offsetTop + a.fy * s.offsetHeight - a.oy;
    }, [zoomLevel]);
    var zoomStep = function (dir) {
        var cur = zoomRef.current.level;
        var next = dir > 0 ? ASSET_ZOOM_STEPS.find(function (z) { return z > cur; }) : ASSET_ZOOM_STEPS.slice().reverse().find(function (z) { return z < cur; });
        zoomTo(next || (dir > 0 ? ASSET_ZOOM_MAX : ASSET_ZOOM_MIN));
    };
    // The whole map in view
    var fit = function () {
        var c = containerRef.current;
        if (!c)
            return;
        var heightPerWidth = quarter ? nat.w / nat.h : nat.h / nat.w;
        var byHeight = c.clientWidth > 0 ? (c.clientHeight / (c.clientWidth * heightPerWidth)) * 100 : 100;
        zoomAnchor.current = null;
        var next = Math.max(ASSET_ZOOM_MIN, Math.min(100, Math.floor(byHeight)));
        zoomRef.current.level = next;
        setZoomLevel(next);
        c.scrollTo({ left: 0, top: 0 });
    };
    // Ctrl + wheel (and a trackpad pinch) zooms; the wheel alone scrolls as usual
    useEffect(function () {
        var c = containerRef.current;
        if (!c)
            return undefined;
        var onWheel = function (e) {
            if (!(e.ctrlKey || e.metaKey))
                return;
            e.preventDefault();
            // The unrounded level carries on between events, so the small steps of a trackpad pinch add up
            var r = zoomRef.current;
            var base = r.exact !== undefined && Math.round(r.exact) === r.level ? r.exact : r.level;
            r.exact = Math.max(ASSET_ZOOM_MIN, Math.min(ASSET_ZOOM_MAX, base * Math.exp(-e.deltaY * 0.0015)));
            r.zoomTo(r.exact, e.clientX, e.clientY);
        };
        c.addEventListener('wheel', onWheel, { passive: false });
        return function () { return c.removeEventListener('wheel', onWheel); };
    }, []);
    // Scroll so a point of the picture (percent) is in the middle of the view
    var pendingCenter = useRef(null);
    var centerNow = function (loc) {
        var c = containerRef.current;
        var s = stageRef.current;
        if (!c || !s)
            return;
        var f = turnPoint(rotation, loc.x / 100, loc.y / 100);
        c.scrollTo({ left: s.offsetLeft + f[0] * s.offsetWidth - c.clientWidth / 2, top: s.offsetTop + f[1] * s.offsetHeight - c.clientHeight / 2, behavior: 'smooth' });
    };
    var centerOn = function (loc) {
        if (!loc)
            return;
        if (mapImage && !natural) {
            pendingCenter.current = loc;
            return;
        }
        setTimeout(function () { return centerNow(loc); }, 60);
    };
    useEffect(function () {
        if (natural && pendingCenter.current) {
            var loc_1 = pendingCenter.current;
            pendingCenter.current = null;
            setTimeout(function () { return centerNow(loc_1); }, 60);
        }
    }, [natural]); // eslint-disable-line react-hooks/exhaustive-deps
    // Turning keeps the middle of the view in the middle
    var rotate = function (delta) {
        var c = containerRef.current;
        var s = stageRef.current;
        var middle = null;
        if (c && s && s.offsetWidth > 0 && s.offsetHeight > 0) {
            var u = clamp01((c.scrollLeft + c.clientWidth / 2 - s.offsetLeft) / s.offsetWidth);
            var v = clamp01((c.scrollTop + c.clientHeight / 2 - s.offsetTop) / s.offsetHeight);
            var p = unturnPoint(rotation, u, v);
            middle = { x: p[0] * 100, y: p[1] * 100 };
        }
        setRotation(function (r) { return (r + delta + 360) % 360; });
        if (middle)
            pendingCenter.current = middle;
    };
    useEffect(function () {
        if (!pendingCenter.current || (mapImage && !natural))
            return;
        var loc = pendingCenter.current;
        pendingCenter.current = null;
        var c = containerRef.current;
        var s = stageRef.current;
        if (!c || !s)
            return;
        var f = turnPoint(rotation, loc.x / 100, loc.y / 100);
        c.scrollLeft = s.offsetLeft + f[0] * s.offsetWidth - c.clientWidth / 2;
        c.scrollTop = s.offsetTop + f[1] * s.offsetHeight - c.clientHeight / 2;
    }, [rotation]); // eslint-disable-line react-hooks/exhaustive-deps
    // Pop out: the map fills the whole app (and the screen, where the browser allows it). Escape comes back.
    var fullScreenUsed = useRef(false);
    var setPop = function (next) {
        setPopped(next);
        try {
            if (next && rootRef.current && document.fullscreenEnabled && rootRef.current.requestFullscreen) {
                fullScreenUsed.current = true;
                var p = rootRef.current.requestFullscreen();
                if (p && p.catch)
                    p.catch(function () { fullScreenUsed.current = false; });
            }
            else if (!next && document.fullscreenElement && document.exitFullscreen) {
                var p = document.exitFullscreen();
                if (p && p.catch)
                    p.catch(function () { });
            }
        }
        catch (e) {
            fullScreenUsed.current = false; /* the in-app pop-out still works */
        }
    };
    useEffect(function () {
        if (!popped)
            return undefined;
        var onKey = function (e) { if (e.key === 'Escape' && !pendingNav)
            setPop(false); };
        var onFull = function () { if (!document.fullscreenElement && fullScreenUsed.current) {
            fullScreenUsed.current = false;
            setPopped(false);
        } };
        window.addEventListener('keydown', onKey);
        document.addEventListener('fullscreenchange', onFull);
        return function () { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFull); };
    }, [popped, pendingNav]); // eslint-disable-line react-hooks/exhaustive-deps
    // Leaving the map view ends the pop-out
    useEffect(function () { if (!active && popped)
        setPop(false); }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
    // --- Picking a spot: a click (smart snap around it) or a dragged box (fitted to the lines in it) ---
    var stageFraction = function (clientX, clientY) {
        var r = stageRef.current.getBoundingClientRect();
        return [clamp01((clientX - r.left) / r.width), clamp01((clientY - r.top) / r.height)];
    };
    var toPicture = function (u, v) {
        var p = unturnPoint(rotation, u, v);
        return [clampPct(p[0] * 100), clampPct(p[1] * 100)];
    };
    // What to do with a picked spot: the asset being placed gets it, otherwise "which asset is here?"
    var usePicked = function (next) {
        if (placingFor) {
            setSpot(next);
            return;
        }
        guard(function () {
            setSelectedId(null);
            setCreating(null);
            setSpot(next);
        });
    };
    var pickPoint = function (x, y) { return __awaiter(_this, void 0, void 0, function () {
        var seq, region, note, grid, error_22, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (savingSpot)
                        return [2 /*return*/];
                    seq = clickSeq.current + 1;
                    clickSeq.current = seq;
                    setActionError('');
                    region = null;
                    note = '';
                    if (!!mapColumn) return [3 /*break*/, 1];
                    note = 'nocolumn';
                    return [3 /*break*/, 7];
                case 1:
                    if (!(snapOn && mapImage)) return [3 /*break*/, 6];
                    setSnapBusy(true);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getSnapGrid(mapImage)];
                case 3:
                    grid = _a.sent();
                    region = snapAt(grid, x, y);
                    if (!region)
                        note = 'none';
                    return [3 /*break*/, 5];
                case 4:
                    error_22 = _a.sent();
                    note = "error:".concat(error_22.message);
                    logEvent("Smart snap is not available: ".concat(error_22.message), 'warn');
                    return [3 /*break*/, 5];
                case 5:
                    if (seq === clickSeq.current)
                        setSnapBusy(false);
                    return [3 /*break*/, 7];
                case 6:
                    if (snapOn && !mapImage)
                        note = 'nomap';
                    _a.label = 7;
                case 7:
                    if (seq !== clickSeq.current)
                        return [2 /*return*/]; // a later pick won
                    next = region
                        ? { x: region.inside ? x : region.x, y: region.inside ? y : region.y, box: region.box, snapped: true, how: 'click', region: region, note: '' }
                        : { x: x, y: y, box: null, snapped: false, how: 'click', region: null, note: note };
                    logEvent(region ? "Smart snap found an outlined area around ".concat(round2(next.x), "%, ").concat(round2(next.y), "%.") : "Map spot picked at ".concat(round2(x), "%, ").concat(round2(y), "% (").concat(note || 'smart snap off', ")."), 'debug');
                    usePicked(next);
                    return [2 /*return*/];
            }
        });
    }); };
    var pickBox = function (rect) { return __awaiter(_this, void 0, void 0, function () {
        var seq, box, middle, region, note, grid, error_23, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (savingSpot)
                        return [2 /*return*/];
                    seq = clickSeq.current + 1;
                    clickSeq.current = seq;
                    setActionError('');
                    box = [rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]];
                    middle = [rect[0] + box[2] / 2, rect[1] + box[3] / 2];
                    region = null;
                    note = '';
                    if (!!mapColumn) return [3 /*break*/, 1];
                    note = 'nocolumn';
                    return [3 /*break*/, 7];
                case 1:
                    if (!(snapOn && mapImage)) return [3 /*break*/, 6];
                    setSnapBusy(true);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getSnapGrid(mapImage)];
                case 3:
                    grid = _a.sent();
                    region = snapBox(grid, rect);
                    if (!region)
                        note = 'nolines';
                    return [3 /*break*/, 5];
                case 4:
                    error_23 = _a.sent();
                    note = "error:".concat(error_23.message);
                    logEvent("Smart snap is not available: ".concat(error_23.message), 'warn');
                    return [3 /*break*/, 5];
                case 5:
                    if (seq === clickSeq.current)
                        setSnapBusy(false);
                    return [3 /*break*/, 7];
                case 6:
                    if (snapOn && !mapImage)
                        note = 'nomap';
                    _a.label = 7;
                case 7:
                    if (seq !== clickSeq.current)
                        return [2 /*return*/];
                    next = region
                        ? { x: region.x, y: region.y, box: region.box, snapped: true, how: 'box', region: region, note: '' }
                        : { x: middle[0], y: middle[1], box: box, snapped: false, how: 'box', region: null, note: note };
                    logEvent(region ? "Smart snap fitted the box to the lines at ".concat(region.box.map(round2).join(', '), ".") : "Map box drawn at ".concat(box.map(round2).join(', '), " (").concat(note || 'smart snap off', ")."), 'debug');
                    usePicked(next);
                    return [2 /*return*/];
            }
        });
    }); };
    // Pointer gestures on the map: a click picks a point; a drag draws a box (or moves the map); two fingers zoom and move
    var gesture = useRef({ pointers: {}, mode: '', start: null, pinch: null });
    var onPointerDown = function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1)
            return;
        var pinEl = e.target && e.target.closest ? e.target.closest('[data-asset-pin]') : null;
        if (pinEl && !placingFor)
            return; // the pin's own click opens it
        var g = gesture.current;
        g.pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        catch (err) { /* not needed for a plain click */ }
        var ids = Object.keys(g.pointers);
        if (ids.length === 2) {
            var a = g.pointers[ids[0]];
            var b = g.pointers[ids[1]];
            g.mode = 'pinch';
            g.start = null;
            g.pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomRef.current.level, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
            setDragRect(null);
            return;
        }
        if (ids.length > 2)
            return;
        var c = containerRef.current;
        if (e.button === 1)
            e.preventDefault();
        g.mode = 'press';
        g.start = { id: e.pointerId, x: e.clientX, y: e.clientY, left: c ? c.scrollLeft : 0, top: c ? c.scrollTop : 0, button: e.button, pan: e.button === 1 || dragMode === 'move', frac: stageFraction(e.clientX, e.clientY) };
    };
    var onPointerMove = function (e) {
        var g = gesture.current;
        if (!g.pointers[e.pointerId])
            return;
        g.pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
        var c = containerRef.current;
        // Pointer moves are in screen pixels; scrolling is in the map's own pixels, which the app's zoom scales
        var perPx = function () { var w = c ? c.getBoundingClientRect().width : 0; return w > 0 ? c.offsetWidth / w : 1; };
        if (g.mode === 'pinch') {
            var ids = Object.keys(g.pointers);
            if (ids.length < 2 || !c)
                return;
            var a = g.pointers[ids[0]];
            var b = g.pointers[ids[1]];
            var mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            var k = perPx();
            c.scrollLeft -= (mid.x - g.pinch.mid.x) * k;
            c.scrollTop -= (mid.y - g.pinch.mid.y) * k;
            g.pinch.mid = mid;
            var dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (g.pinch.dist > 0) {
                var z = g.pinch.zoom * (dist / g.pinch.dist);
                if (Math.abs(z - zoomRef.current.level) >= 2)
                    zoomTo(z, mid.x, mid.y);
            }
            return;
        }
        var s = g.start;
        if (!s || s.id !== e.pointerId)
            return;
        var dx = e.clientX - s.x;
        var dy = e.clientY - s.y;
        if (g.mode === 'press') {
            if (Math.hypot(dx, dy) < 6)
                return;
            g.mode = s.pan ? 'pan' : 'box';
        }
        if (g.mode === 'pan') {
            if (c) {
                var k = perPx();
                c.scrollLeft = s.left - dx * k;
                c.scrollTop = s.top - dy * k;
            }
            return;
        }
        if (g.mode === 'box') {
            var f = stageFraction(e.clientX, e.clientY);
            setDragRect([s.frac[0], s.frac[1], f[0], f[1]]);
        }
    };
    var onPointerEnd = function (e) {
        var g = gesture.current;
        if (!g.pointers[e.pointerId])
            return;
        delete g.pointers[e.pointerId];
        if (g.mode === 'pinch') {
            if (Object.keys(g.pointers).length === 0) {
                g.mode = '';
                g.pinch = null;
            }
            return;
        }
        var s = g.start;
        var mode = g.mode;
        g.mode = '';
        g.start = null;
        if (!s || s.id !== e.pointerId)
            return;
        if (e.type === 'pointercancel') {
            setDragRect(null);
            return;
        }
        if (mode === 'press') {
            if (s.button === 1)
                return; // the middle button only moves the map
            var p = toPicture(s.frac[0], s.frac[1]);
            pickPoint(p[0], p[1]);
        }
        else if (mode === 'box') {
            setDragRect(null);
            var f = stageFraction(e.clientX, e.clientY);
            var a = toPicture(s.frac[0], s.frac[1]);
            var b = toPicture(f[0], f[1]);
            var rect = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
            // A box too small to mean anything is a click
            if (rect[2] - rect[0] < 0.4 && rect[3] - rect[1] < 0.4)
                pickPoint((rect[0] + rect[2]) / 2, (rect[1] + rect[3]) / 2);
            else
                pickBox(rect);
        }
    };
    var openAsset = function (asset, center) {
        var go = function () {
            setCreating(null);
            setSpot(null);
            setPlacingFor(null);
            setActionError('');
            setSelectedId(asset.id);
            if (center && asset.location && pinOnMap(asset.location, mapKey))
                centerOn(asset.location);
        };
        // The asset already open: nothing to lose
        if (asset.id === selectedId && !creating)
            go();
        else
            guard(go);
    };
    // Asked from the table: open this asset here
    useEffect(function () {
        if (!focus)
            return;
        var pin = assetPins.rows.find(function (p) { return p.id === focus.id; });
        openAsset(pin || { id: focus.id, location: null }, true);
    }, [focus && focus.n]); // eslint-disable-line react-hooks/exhaustive-deps
    var closePanel = function () { return guard(function () {
        setSelectedId(null);
        setCreating(null);
        setPlacingFor(null);
        setSpot(null);
        setActionError('');
    }); };
    var startNew = function (location) { return guard(function () {
        setSelectedId(null);
        setPlacingFor(null);
        setSpot(null);
        setActionError('');
        setCreating({ location: location || null });
    }); };
    // Save (or clear) one asset's spot. Resolves to the saved summary.
    var saveSpot = function (asset, s) { return __awaiter(_this, void 0, void 0, function () {
        var text, row, summary;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    text = s ? mapLocationText(s, mapKey, meta.mapColumn.maxLength) : null;
                    return [4 /*yield*/, patchAsset(set, asset.id, (_a = {}, _a[mapColumn] = text, _a), '*', logEvent)];
                case 1:
                    row = _b.sent();
                    summary = toAssetSummary(row, mapColumn);
                    saved(row, false);
                    setRefreshToken(function (t) { return t + 1; });
                    logEvent(s ? "Saved the map spot of ".concat(summary.name, ".") : "Removed ".concat(summary.name, " from the map."), 'success');
                    return [2 /*return*/, summary];
            }
        });
    }); };
    var confirmPlacing = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!spot || !placingFor)
                        return [2 /*return*/];
                    if (placingFor.id === 'new') {
                        if (creating)
                            setCreating(function (c) { return (__assign(__assign({}, (c || {})), { location: spot })); });
                        setPlacingFor(null);
                        setSpot(null);
                        return [2 /*return*/];
                    }
                    setSavingSpot(true);
                    setActionError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, saveSpot(placingFor, spot)];
                case 2:
                    _a.sent();
                    setPlacingFor(null);
                    setSpot(null);
                    return [3 /*break*/, 5];
                case 3:
                    error_24 = _a.sent();
                    logEvent("Map spot not saved: ".concat(error_24.message), 'error');
                    setActionError("The spot was not saved: ".concat(error_24.message));
                    return [3 /*break*/, 5];
                case 4:
                    setSavingSpot(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var assignSpot = function (asset) { return __awaiter(_this, void 0, void 0, function () {
        var summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saveSpot(asset, spot)];
                case 1:
                    summary = _a.sent();
                    setSpot(null);
                    setSelectedId(summary.id);
                    return [2 /*return*/, summary];
            }
        });
    }); };
    var removeFromMap = function (asset) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saveSpot(asset, null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var panel = creating ? 'editor' : (selectedId ? 'card' : (spot && !placingFor ? 'spot' : 'list'));
    var placingName = placingFor ? (placingFor.id === 'new' ? 'the new asset' : placingFor.name) : '';
    var pinsLine = '';
    if (!metaDone)
        pinsLine = 'Reading the Assets table...';
    else if (!mapColumn)
        pinsLine = 'Assets cannot be placed on the map yet.';
    else if (assetPins.status === 'loading')
        pinsLine = 'Loading the placed assets...';
    else if (assetPins.status === 'error')
        pinsLine = "The placed assets could not be loaded: ".concat(assetPins.error);
    else {
        pinsLine = "".concat(pinsHere.length, " asset").concat(pinsHere.length === 1 ? '' : 's', " on the map");
        if (pinWords.length)
            pinsLine += ", ".concat(visiblePins.length, " match").concat(visiblePins.length === 1 ? 'es' : '', " the search");
        if (otherMapPins > 0)
            pinsLine += " (".concat(otherMapPins, " on other maps)");
        if (assetPins.capped)
            pinsLine += " - only the first ".concat(ASSET_PIN_MAX, " are drawn");
    }
    var toolButton = 'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB] disabled:opacity-50';
    // Where a pin's name shows: below it when the pin is near the top of the view
    var labelBelow = function (loc) { return turnPoint(rotation, loc.x / 100, loc.y / 100)[1] < 0.15; };
    var pinTransform = "translate(-50%, -50%) rotate(".concat(-rotation, "deg)");
    return (React.createElement("div", { ref: rootRef, className: "".concat(popped ? 'fixed inset-0 z-[300]' : 'h-full', " flex flex-col md:flex-row bg-slate-100 p-4 md:p-6 pt-3 md:pt-4 overflow-y-auto md:overflow-hidden gap-4"), "data-testid": "assets-map-view", "data-popped": popped ? 'true' : 'false' },
        React.createElement("div", { className: "flex-1 flex flex-col md:min-h-0 md:overflow-hidden" },
            React.createElement("div", { className: "mb-2 shrink-0 flex flex-wrap items-end justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-2xl font-black text-[#00468B]" }, "Asset Map"),
                    React.createElement("p", { className: "text-sm text-slate-500" }, "Click a room, or drag a box around something, to put an asset there. Click a pin to open its asset.")),
                React.createElement(SearchBox, { query: query, onQuery: setQuery, placeholder: "Search assets: name, room, area...", ariaLabel: "Search assets", className: "w-full sm:w-80" })),
            React.createElement("div", { className: "mb-2 shrink-0 flex flex-wrap items-center gap-x-2 gap-y-2" },
                React.createElement(Switch, { on: snapOn, onChange: setSnapOn, label: "Smart snap", title: snapOn ? 'A click finds the outlined area around it; a dragged box is fitted to the black lines inside it.' : 'A click puts the pin exactly where you click; a dragged box is used as drawn.' }),
                React.createElement("div", { className: "inline-flex shrink-0 rounded-full border border-[#B3D4F2] bg-white p-0.5", role: "group", "aria-label": "What dragging on the map does" }, [['box', 'Drag: box'], ['move', 'Drag: move map']].map(function (_a) {
                    var key = _a[0], label = _a[1];
                    return (React.createElement("button", { key: key, type: "button", onClick: function () { return setDragMode(key); }, "aria-pressed": dragMode === key, className: "px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ".concat(dragMode === key ? 'bg-[#00468B] text-white' : 'text-[#00468B] hover:bg-[#E6F1FB]') }, label));
                })),
                React.createElement("button", { type: "button", onClick: function () { return rotate(-90); }, className: toolButton, title: "Turn the map a quarter turn to the left", "aria-label": "Turn the map left" },
                    React.createElement(RotateLeft, { className: "w-4 h-4" })),
                React.createElement("button", { type: "button", onClick: function () { return rotate(90); }, className: toolButton, title: "Turn the map a quarter turn to the right", "aria-label": "Turn the map right" },
                    React.createElement(RotateRight, { className: "w-4 h-4" })),
                React.createElement("button", { type: "button", onClick: fit, className: toolButton, title: "Show the whole map" }, "Fit"),
                React.createElement("button", { type: "button", onClick: function () { return setPop(!popped); }, className: toolButton, title: popped ? 'Back to the normal view (Esc)' : 'Make the map fill the screen', "aria-pressed": popped },
                    popped ? React.createElement(PopInIcon, { className: "w-4 h-4" }) : React.createElement(PopOutIcon, { className: "w-4 h-4" }),
                    popped ? 'Close pop-out' : 'Pop out'),
                React.createElement("span", { className: "text-xs text-slate-600", role: "status" }, pinsLine),
                assetPins.status === 'error' && React.createElement("button", { type: "button", onClick: loadPins, className: "text-xs text-[#0072CE] underline hover:text-[#00468B]" }, "Try again"),
                metaDone && (!mapColumn || meta.mapPicked || !!readColumnPick('assetMap')) && (React.createElement("div", { className: "basis-full" },
                    React.createElement(ColumnFix, { need: "Map spot column", message: mapColumn ? '' : "To place assets: ".concat(meta.mapReason || 'the map column is missing.'), expected: "craa5_maplocation", expectedLabel: "Map Location", expectedType: "Single line of text", found: mapColumn || '', candidates: (meta.fields || []).filter(function (f) { return (f.kind === 'text' || f.kind === 'memo') && f.canUpdate && !f.isPrimaryName && ASSET_MAP_NOT_THESE.indexOf(f.name) === -1; }), picked: meta.mapPicked ? mapColumn : '', typed: readColumnPick('assetMap'), typedWhy: meta.mapTypedWhy || '', onPick: function (name) { writeColumnPick('assetMap', name); loadAssetMeta(); }, onRecheck: loadAssetMeta, checking: meta.status === 'loading' || !!meta.rechecking, checkError: meta.recheckError, testId: "asset-map-fix" })))),
            React.createElement("div", { className: "flex-1 relative min-h-[50vh] md:min-h-0" },
                !mapImage && React.createElement(MapNote, { note: mapNote, className: "absolute top-2 left-2 right-2 z-40" }),
                React.createElement("div", { className: "absolute inset-0 rounded-xl shadow-inner border border-slate-400/50 bg-slate-300 overflow-auto", ref: containerRef },
                    React.createElement("div", { ref: stageRef, className: "relative mx-auto select-none ".concat(snapBusy ? 'cursor-wait' : (dragMode === 'move' ? 'cursor-grab' : 'cursor-crosshair')), style: stageStyle, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: onPointerEnd, onPointerCancel: onPointerEnd, onContextMenu: function (e) { if (gesture.current.mode)
                            e.preventDefault(); }, "data-testid": "asset-map", "data-rotation": rotation },
                        React.createElement("div", { className: "absolute", style: pictureStyle, "data-testid": "asset-picture" },
                            mapImage ? (React.createElement("img", { src: mapImage, onLoad: function (e) { var im = e.currentTarget; if (im.naturalWidth && im.naturalHeight)
                                    setNatural({ w: im.naturalWidth, h: im.naturalHeight }); }, onError: function () { return setMainMapImage(null); }, alt: "Facility map with assets", className: "w-full h-full block pointer-events-none select-none", draggable: "false" })) : (React.createElement("div", { className: "w-full h-full" },
                                React.createElement(FacilityMapSvg, null))),
                            selectedRegion && React.createElement(RegionOverlay, { region: selectedRegion, fill: "#0072CE", edge: "#00468B", testId: "selected-region" }),
                            !selectedRegion && selectedLocation && selectedLocation.box && (React.createElement("div", { className: "absolute border-2 border-[#00468B] bg-[#0072CE]/15 rounded-sm pointer-events-none", style: { left: "".concat(selectedLocation.box[0], "%"), top: "".concat(selectedLocation.box[1], "%"), width: "".concat(selectedLocation.box[2], "%"), height: "".concat(selectedLocation.box[3], "%") } })),
                            spot && spot.region && React.createElement(RegionOverlay, { region: spot.region, fill: "#FFB81C", edge: "#00468B", testId: "spot-region" }),
                            spot && !spot.region && spot.box && (React.createElement("div", { "data-testid": "spot-box", className: "absolute border-2 border-dashed border-[#00468B] bg-[#FFB81C]/25 pointer-events-none", style: { left: "".concat(spot.box[0], "%"), top: "".concat(spot.box[1], "%"), width: "".concat(spot.box[2], "%"), height: "".concat(spot.box[3], "%") } })),
                            !spot && creating && creating.location && creating.location.region && React.createElement(RegionOverlay, { region: creating.location.region, fill: "#FFB81C", edge: "#00468B", testId: "new-spot-region" }),
                            visiblePins.map(function (pin) {
                                var selected = pin.id === selectedId;
                                var moving = placingFor && placingFor.id === pin.id;
                                var off = pinOffsets[pin.id];
                                return (React.createElement("button", { type: "button", key: pin.id, "data-asset-pin": pin.id, "aria-label": "Asset ".concat(pin.name), onClick: function (e) { e.stopPropagation(); logEvent("Asset pin clicked: ".concat(pin.name), 'info'); openAsset(pin, false); }, className: "absolute group p-1 ".concat(selected ? 'z-20' : 'z-10', " ").concat(moving ? 'opacity-40' : '', " ").concat(placingFor ? 'pointer-events-none' : ''), style: { left: "".concat(pin.location.x, "%"), top: "".concat(pin.location.y, "%"), marginLeft: off ? off[0] : 0, marginTop: off ? off[1] : 0, transform: pinTransform } },
                                    React.createElement("span", { className: "block rounded-full border-2 shadow transition-transform ".concat(selected ? 'w-5 h-5 bg-[#FFB81C] border-[#00468B]' : 'w-3.5 h-3.5 bg-[#0072CE] border-white group-hover:scale-125') }),
                                    React.createElement("span", { className: "absolute ".concat(labelBelow(pin.location) ? 'top-full mt-1' : 'bottom-full mb-1', " left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs text-left px-2 py-1 rounded w-max max-w-[16rem] break-words pointer-events-none shadow-lg ").concat(selected ? 'block' : 'hidden group-hover:block') },
                                        React.createElement("span", { className: "font-bold block" }, pin.name),
                                        (pin.room || pin.area) && React.createElement("span", { className: "text-slate-300" }, [pin.room, pin.area].filter(Boolean).join(' - ')))));
                            }),
                            !spot && creating && creating.location && (React.createElement("span", { "data-testid": "new-spot-pin", className: "absolute w-5 h-5 rounded-full bg-[#FFB81C] border-2 border-[#00468B] shadow-lg pointer-events-none z-30", style: { left: "".concat(creating.location.x, "%"), top: "".concat(creating.location.y, "%"), transform: 'translate(-50%, -50%)' } })),
                            spot && (React.createElement("span", { "data-testid": "spot-pin", className: "absolute w-5 h-5 rounded-full bg-[#FFB81C] border-2 border-[#00468B] shadow-lg pointer-events-none z-30", style: { left: "".concat(spot.x, "%"), top: "".concat(spot.y, "%"), transform: 'translate(-50%, -50%)' } }))),
                        dragRect && (React.createElement("div", { "data-testid": "drag-box", className: "absolute border-2 border-dashed border-[#E4002B] bg-[#E4002B]/10 pointer-events-none z-40", style: { left: "".concat(Math.min(dragRect[0], dragRect[2]) * 100, "%"), top: "".concat(Math.min(dragRect[1], dragRect[3]) * 100, "%"), width: "".concat(Math.abs(dragRect[2] - dragRect[0]) * 100, "%"), height: "".concat(Math.abs(dragRect[3] - dragRect[1]) * 100, "%") } })))),
                React.createElement("div", { className: "absolute bottom-4 right-4 bg-white rounded-lg shadow-lg flex items-center border border-slate-200 z-10" },
                    React.createElement("button", { type: "button", onClick: function () { return zoomStep(-1); }, className: "p-2 hover:bg-slate-100 text-slate-700 rounded-l-lg transition-colors", title: "Zoom Out", "aria-label": "Zoom out" },
                        React.createElement(ZoomOut, { className: "w-5 h-5" })),
                    React.createElement("span", { className: "px-3 text-sm font-bold text-slate-700 border-x border-slate-200 min-w-[3.5rem] text-center", "data-testid": "asset-zoom" },
                        zoomLevel,
                        "%"),
                    React.createElement("button", { type: "button", onClick: function () { return zoomStep(1); }, className: "p-2 hover:bg-slate-100 text-slate-700 rounded-r-lg transition-colors", title: "Zoom In", "aria-label": "Zoom in" },
                        React.createElement(ZoomIn, { className: "w-5 h-5" }))),
                placingFor && (React.createElement("div", { className: "absolute left-3 right-3 sm:right-auto bottom-3 z-30 bg-white rounded-xl shadow-xl border-2 border-[#FFB81C] p-3 max-w-md", role: "status" },
                    !spot ? (React.createElement("p", { className: "text-sm text-slate-700" },
                        React.createElement("span", { className: "font-bold text-[#00468B]" },
                            "Click the map where ",
                            placingName,
                            " is, or drag a box around it."),
                        " ",
                        snapOn ? 'Smart snap fits it to the lines.' : 'The pin goes exactly where you click.')) : (React.createElement(SpotNote, { spot: spot })),
                    actionError && React.createElement("p", { className: "text-xs text-[#C4001F] mt-1", role: "alert" }, actionError),
                    React.createElement("div", { className: "flex flex-wrap gap-2 mt-2" },
                        spot && (React.createElement("button", { type: "button", onClick: confirmPlacing, disabled: savingSpot, className: "bg-[#0072CE] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-[#00468B] disabled:opacity-60" }, savingSpot ? 'Saving...' : (placingFor.id === 'new' ? 'Use this spot' : 'Save this spot'))),
                        React.createElement("button", { type: "button", onClick: function () { setPlacingFor(null); setSpot(null); setActionError(''); }, disabled: savingSpot, className: "px-3 py-1.5 rounded-md text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100" }, "Cancel")))))),
        React.createElement("aside", { className: "w-full md:w-[22rem] lg:w-[26rem] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0 h-[80vh] md:h-full", "aria-label": "Assets panel" },
            pendingNav && (React.createElement("div", { className: "p-3 bg-[#FFF6E0] border-b-2 border-[#FFB81C] text-sm shrink-0", role: "alert" },
                React.createElement("p", { className: "font-semibold text-slate-800" }, "This asset has unsaved changes."),
                React.createElement("div", { className: "flex gap-2 mt-2" },
                    React.createElement("button", { type: "button", onClick: function () { var run = pendingNav.run; setPendingNav(null); setDirty(false); run(); }, className: "px-3 py-1 rounded-md text-xs font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, "Discard changes"),
                    React.createElement("button", { type: "button", onClick: function () { return setPendingNav(null); }, className: "px-3 py-1 rounded-md text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100" }, "Keep editing")))),
            panel === 'editor' && (React.createElement(AssetEditor, { key: "new", meta: meta, set: set, assetId: null, createLocation: creating ? creating.location : null, mapKey: mapKey, placing: !!placingFor, refreshToken: 0, onRetryMeta: loadAssetMeta, onDirtyChange: setDirty, onClose: closePanel, onSaved: function (row) { return saved(row, false); }, onCreated: function (row) {
                    var summary = toAssetSummary(row, mapColumn);
                    saved(row, true);
                    setDirty(false);
                    setCreating(null);
                    setPlacingFor(null);
                    setSpot(null);
                    setSelectedId(summary.id);
                    logEvent("Created asset ".concat(summary.name, " (").concat(summary.id, ")."), 'success');
                }, onPlace: function (asset) { setSpot(null); setActionError(''); setPlacingFor(asset); }, onClearNewSpot: function () { return setCreating(function (c) { return (__assign(__assign({}, (c || {})), { location: null })); }); }, logEvent: logEvent })),
            panel === 'card' && (React.createElement(AssetCard, { key: selectedId, meta: meta, set: set, assetId: selectedId, mapKey: mapKey, pinLocation: selectedPin ? selectedPin.location : undefined, placing: !!placingFor, refreshToken: refreshToken, onRetryMeta: loadAssetMeta, onClose: closePanel, onPlace: function (asset) { setSpot(null); setActionError(''); setPlacingFor(asset); }, onRemoveFromMap: removeFromMap, onLocate: function (loc) { return centerOn(loc); }, onEditInTable: onEditInTable, onSavedRow: function (row) { return saved(row, false); }, logEvent: logEvent })),
            panel === 'spot' && (React.createElement(AssignSpot, { spot: spot, set: set, mapColumn: mapColumn, mapReason: meta.mapReason, canCreate: meta.status === 'ready', onAssign: assignSpot, onCreate: function () { return onEditInTable(''); }, onCancel: function () { return setSpot(null); }, logEvent: logEvent })),
            React.createElement("div", { className: panel === 'list' ? 'flex flex-col flex-1 min-h-0' : 'hidden' },
                React.createElement(AssetBrowser, { meta: meta, list: list, words: words, searching: query !== debounced, placement: placement, setPlacement: setPlacement, room: room, setRoom: setRoom, rooms: rooms, mapColumn: mapColumn, mapKey: mapKey, onShowMore: showMore, onOpen: function (a) { return openAsset(a, true); }, onNew: function () { return onEditInTable(''); } })))));
}
// ==========================================
// THE OPEN ASSET ON THE MAP: a short card; everything else is edited in the equipment table
// ==========================================
function AssetCard(_a) {
    var _this = this;
    var meta = _a.meta, set = _a.set, assetId = _a.assetId, mapKey = _a.mapKey, pinLocation = _a.pinLocation, placing = _a.placing, refreshToken = _a.refreshToken, onRetryMeta = _a.onRetryMeta, onClose = _a.onClose, onPlace = _a.onPlace, onRemoveFromMap = _a.onRemoveFromMap, onLocate = _a.onLocate, onEditInTable = _a.onEditInTable, onSavedRow = _a.onSavedRow, logEvent = _a.logEvent;
    var mapColumn = meta.mapColumn ? meta.mapColumn.name : null;
    var imageField = useMemo(function () { return meta.fields.find(function (f) { return f.kind === 'image'; }) || null; }, [meta.fields]);
    var _b = useState({ status: 'loading', row: null, error: '' }), load = _b[0], setLoad = _b[1];
    var _c = useState(false), confirmRemove = _c[0], setConfirmRemove = _c[1];
    var _d = useState(false), removing = _d[0], setRemoving = _d[1];
    var _f = useState(false), confirmDeact = _f[0], setConfirmDeact = _f[1];
    var _g = useState(false), togglingState = _g[0], setTogglingState = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    var read = useCallback(function (quiet) { return __awaiter(_this, void 0, void 0, function () {
        var row_1, e_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!quiet)
                        setLoad(function (l) { return (__assign(__assign({}, l), { status: 'loading', error: '' })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadAssetRow(set, assetId, imageField ? [imageField.name] : [])];
                case 2:
                    row_1 = _a.sent();
                    if (mounted.current)
                        setLoad({ status: 'ready', row: row_1, error: '' });
                    return [3 /*break*/, 4];
                case 3:
                    e_15 = _a.sent();
                    logEvent("Asset ".concat(assetId, " could not be read: ").concat(e_15.message), 'error');
                    if (mounted.current && !quiet)
                        setLoad({ status: 'error', row: null, error: e_15.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [set, assetId, imageField, logEvent]);
    useEffect(function () { read(false); }, [read]);
    useEffect(function () { if (refreshToken)
        read(true); }, [refreshToken]); // eslint-disable-line react-hooks/exhaustive-deps
    var row = load.row;
    var title = row ? (row[ASSET_NAME_COLUMN] || '(no name)') : 'Asset';
    var place = row ? [row.craa5_roomname, row.craa5_areaname].filter(function (v) { return v && String(v).trim(); }).join(' - ') : '';
    var location = pinLocation !== undefined ? pinLocation : (row && mapColumn ? parseMapLocation(row[mapColumn]) : null);
    var onThisMap = pinOnMap(location, mapKey);
    // A short summary: the cleaning frequencies that are on, and a few filled-in columns
    var summary = useMemo(function () {
        if (!row)
            return { freq: [], facts: [] };
        var groups = groupAssetFields(meta.fields.filter(function (f) { return f.name !== mapColumn; })).groups;
        var freq = groups.find(function (g) { return g.key === 'freq'; });
        var main = groups.find(function (g) { return g.key === 'main'; });
        var skip = [ASSET_NAME_COLUMN, 'craa5_roomname', 'craa5_areaname'];
        var factFields = (freq ? freq.items.filter(function (f) { return f.kind !== 'bool'; }) : []).concat(main ? main.items.filter(function (f) { return skip.indexOf(f.name) === -1; }) : []);
        return {
            freq: freq ? freq.items.filter(function (f) { return f.kind === 'bool' && row[f.name] === true; }).map(function (f) { return f.label; }) : [],
            facts: factFields.map(function (f) { return [f.label, displayValue(f, row)]; }).filter(function (x) { return x[1] !== '' && x[1] !== null && x[1] !== undefined; }).slice(0, 6)
        };
    }, [row, meta.fields, mapColumn]);
    var stamp = row && imageField ? (row["".concat(imageField.name, "_timestamp")] || '') : '';
    var hasPicture = !!(row && imageField && (row[imageField.name] || row["".concat(imageField.name, "_timestamp")] || row["".concat(imageField.name, "_url")]));
    var pictureSources = hasPicture
        ? (imageField.fullImage === false ? [] : [apiUrl("".concat(set, "(").concat(assetId, ")/").concat(imageField.name, "/$value?size=full&t=").concat(encodeURIComponent(String(stamp))))]).concat([apiUrl("".concat(set, "(").concat(assetId, ")/").concat(imageField.name, "/$value?t=").concat(encodeURIComponent(String(stamp))))])
        : [];
    return (React.createElement("div", { className: "flex flex-col flex-1 min-h-0", "data-testid": "asset-card" },
        React.createElement("div", { className: "p-4 border-b-2 border-[#E6F1FB] shrink-0 space-y-2" },
            React.createElement(EditorHeader, { title: title, subtitle: place, onClose: onClose, isNew: false }),
            React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-xs" }, !mapColumn ? (React.createElement("span", { className: "text-[#9A6700]" },
                "Map spot: ",
                meta.mapReason)) : placing ? (React.createElement("span", { className: "font-semibold text-[#00468B]" }, "Click the map where this asset is, or drag a box around it...")) : load.status !== 'ready' ? null : (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "inline-flex items-center gap-1 font-semibold ".concat(onThisMap ? 'text-[#00468B]' : 'text-slate-500') },
                    React.createElement(MapPin, { className: "w-3.5 h-3.5" }),
                    onThisMap ? 'On the map' : (location ? "On another map (".concat(location.map, ")") : 'Not on the map')),
                onThisMap && React.createElement("button", { type: "button", onClick: function () { return onLocate(location); }, className: "px-2 py-1 rounded-md font-bold border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB]" }, "Show"),
                React.createElement("button", { type: "button", onClick: function () { return onPlace({ id: assetId, name: title }); }, className: "px-2 py-1 rounded-md font-bold bg-[#0072CE] text-white hover:bg-[#00468B]" }, location ? 'Move' : 'Place on map'),
                location && !confirmRemove && React.createElement("button", { type: "button", onClick: function () { return setConfirmRemove(true); }, className: "px-2 py-1 rounded-md font-bold border border-slate-300 text-slate-600 hover:bg-slate-100" }, "Remove from map"),
                confirmRemove && (React.createElement("span", { className: "inline-flex items-center gap-1.5 bg-[#FFF6E0] border border-[#FFB81C] rounded-md px-2 py-1" },
                    "Remove the pin?",
                    React.createElement("button", { type: "button", disabled: removing, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                            var e_16;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        setRemoving(true);
                                        setError('');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, 4, 5]);
                                        return [4 /*yield*/, onRemoveFromMap({ id: assetId, name: title })];
                                    case 2:
                                        _a.sent();
                                        if (mounted.current)
                                            setConfirmRemove(false);
                                        return [3 /*break*/, 5];
                                    case 3:
                                        e_16 = _a.sent();
                                        logEvent("Could not remove ".concat(title, " from the map: ").concat(e_16.message), 'error');
                                        if (mounted.current)
                                            setError("The pin was not removed: ".concat(e_16.message));
                                        return [3 /*break*/, 5];
                                    case 4:
                                        if (mounted.current)
                                            setRemoving(false);
                                        return [7 /*endfinally*/];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, className: "font-bold text-[#C4001F] underline" }, removing ? 'Removing...' : 'Remove'),
                    React.createElement("button", { type: "button", onClick: function () { return setConfirmRemove(false); }, className: "font-bold text-slate-600 underline" }, "Keep")))))),
            error && React.createElement("p", { className: "text-xs text-[#C4001F]", role: "alert" }, error)),
        React.createElement("div", { className: "flex-1 overflow-y-auto p-4 space-y-3" },
            meta.fields.length === 0 && meta.status === 'error' && (React.createElement("div", { className: "text-sm text-[#C4001F]", role: "alert" },
                "The Assets table's columns could not be read: ",
                meta.error,
                React.createElement("div", null,
                    React.createElement("button", { type: "button", onClick: onRetryMeta, className: "mt-2 text-[#0072CE] underline" }, "Try again")))),
            load.status === 'loading' && React.createElement("p", { className: "text-sm text-slate-500" }, "Loading the asset..."),
            load.status === 'error' && (React.createElement("div", { className: "text-sm text-[#C4001F]", role: "alert" },
                "This asset could not be loaded: ",
                load.error,
                React.createElement("div", null,
                    React.createElement("button", { type: "button", onClick: function () { return read(false); }, className: "mt-2 text-[#0072CE] underline" }, "Try again")))),
            load.status === 'ready' && (React.createElement(React.Fragment, null,
                hasPicture && (React.createElement("div", { className: "rounded-md border border-slate-200 bg-slate-50 overflow-hidden" },
                    React.createElement(StoredImage, { key: pictureSources.join('|'), sources: pictureSources, alt: imageField.label, className: "w-full h-auto max-h-48 object-contain", fallback: React.createElement("p", { className: "text-xs text-slate-500 p-2" }, "The picture could not be shown.") }))),
                summary.freq.length > 0 && (React.createElement("div", { className: "flex flex-wrap gap-1.5", "aria-label": "Cleaning frequency" }, summary.freq.map(function (label) { return React.createElement("span", { key: label, className: "px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F1FB] text-[#00468B] border border-[#B3D4F2]" }, label); }))),
                summary.facts.length > 0 && (React.createElement("dl", { className: "grid grid-cols-2 gap-x-3 gap-y-2 text-xs" }, summary.facts.map(function (_a) {
                    var label = _a[0], value = _a[1];
                    return (React.createElement("div", { key: label, className: "min-w-0" },
                        React.createElement("dt", { className: "text-slate-400" }, label),
                        React.createElement("dd", { className: "text-slate-700 font-medium [overflow-wrap:anywhere]" }, value)));
                }))),
                !hasPicture && summary.freq.length === 0 && summary.facts.length === 0 && React.createElement("p", { className: "text-sm text-slate-500" }, "Nothing else is filled in for this asset yet.")))),
        React.createElement("div", { className: "p-3 border-t border-slate-200 bg-white shrink-0 space-y-2" },
            load.status === 'ready' && row && (React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 text-xs" }, row.statecode === 1 ? (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "px-2 py-0.5 rounded bg-red-100 text-[#C4001F] font-bold uppercase tracking-wider" }, "Deactivated"),
                React.createElement("button", { type: "button", disabled: togglingState, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                        var fresh, e_17;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setTogglingState(true);
                                    setError('');
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, setAssetActiveState(set, assetId, true, logEvent)];
                                case 2:
                                    fresh = _a.sent();
                                    if (mounted.current) {
                                        setLoad({ status: 'ready', row: fresh, error: '' });
                                        if (onSavedRow)
                                            onSavedRow(fresh);
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    e_17 = _a.sent();
                                    if (mounted.current)
                                        setError("Could not reactivate: ".concat(e_17.message));
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (mounted.current)
                                        setTogglingState(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, className: "px-2.5 py-1 rounded font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" }, togglingState ? 'Reactivating...' : 'Reactivate asset'))) : !confirmDeact ? (React.createElement("button", { type: "button", onClick: function () { return setConfirmDeact(true); }, className: "text-slate-500 hover:text-[#C4001F] font-semibold underline" }, "Deactivate old asset...")) : (React.createElement("span", { className: "inline-flex items-center gap-2 bg-[#FFF6E0] border border-[#FFB81C] rounded px-2 py-1" },
                React.createElement("span", { className: "font-semibold text-slate-800" },
                    "Deactivate ",
                    title,
                    "?"),
                React.createElement("button", { type: "button", disabled: togglingState, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                        var fresh, e_18;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setTogglingState(true);
                                    setError('');
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, setAssetActiveState(set, assetId, false, logEvent)];
                                case 2:
                                    fresh = _a.sent();
                                    if (mounted.current) {
                                        setConfirmDeact(false);
                                        setLoad({ status: 'ready', row: fresh, error: '' });
                                        if (onSavedRow)
                                            onSavedRow(fresh);
                                    }
                                    return [3 /*break*/, 5];
                                case 3:
                                    e_18 = _a.sent();
                                    if (mounted.current)
                                        setError("Could not deactivate: ".concat(e_18.message));
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (mounted.current)
                                        setTogglingState(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, className: "px-2 py-0.5 rounded font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, togglingState ? 'Deactivating...' : 'Confirm'),
                React.createElement("button", { type: "button", onClick: function () { return setConfirmDeact(false); }, className: "font-bold text-slate-600 underline" }, "Cancel"))))),
            React.createElement("div", { className: "flex items-center justify-between gap-2" },
                React.createElement("span", { className: "text-xs text-slate-500" }, "Edit every column, pictures and files in the table."),
                React.createElement("button", { type: "button", onClick: function () { return onEditInTable(assetId); }, className: "px-4 py-1.5 rounded-md text-sm font-bold bg-[#0072CE] text-white hover:bg-[#00468B] shadow-sm shrink-0" }, "Edit in table")))));
}
// ==========================================
// ASSETS: THE EQUIPMENT TABLE. Every column, 50 rows a page (never the whole table). Changes are saved row by row with the
// row's etag; pictures and files upload straight from their cells.
// ==========================================
var ASSET_TABLE_COLUMNS_PREF = 'Midwest Plant.assets.tableColumns';
var ASSET_COL_WIDTHS_PREF = 'Midwest Plant.assets.colWidths';
var ASSET_TABLE_PAGE = 50;
// Column headers that sort: only types Dataverse can sort by
var ASSET_SORTABLE_KINDS = ['text', 'int', 'number', 'date', 'bool', 'choice', 'status'];
// Starting width of each kind of column (and default pixel widths for drag-resizing)
var ASSET_CELL_WIDTH = {
    text: 'min-w-[11rem]', memo: 'min-w-[15rem]', int: 'min-w-[6.5rem]', number: 'min-w-[6.5rem]', bool: 'min-w-[5.5rem]', choice: 'min-w-[9rem]',
    choices: 'min-w-[12rem]', date: 'min-w-[10rem]', lookup: 'min-w-[12rem]', fixedlookup: 'min-w-[10rem]', file: 'min-w-[13rem]', image: 'min-w-[12rem]',
    status: 'min-w-[7rem]', id: 'min-w-[10rem]'
};
var ASSET_DEFAULT_COL_PX = {
    __name: 280, text: 180, memo: 240, int: 110, number: 110, bool: 95, choice: 150,
    choices: 195, date: 165, lookup: 195, fixedlookup: 165, file: 210, image: 195,
    status: 120, id: 165
};
var ASSET_CELL_INPUT = 'w-full bg-transparent px-1.5 py-1 text-sm rounded border border-transparent hover:border-slate-300 focus:border-[#0072CE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/30 disabled:text-slate-500 disabled:hover:border-transparent';
// What the table asks for to show a column: lookups by their id (the name comes as an annotation), files by their name,
// pictures by their time stamp (never the picture itself)
function tableSelectOf(f) {
    if (f.kind === 'lookup' || f.kind === 'fixedlookup')
        return ["_".concat(f.name, "_value")];
    if (f.kind === 'file')
        return f.nameColumn ? [f.name, f.nameColumn] : [f.name];
    if (f.kind === 'image')
        return [f.stampColumn || f.name];
    return [f.name];
}
function assetTableSelect(fields, mapColumn) {
    var seen = {};
    var out = [];
    var add = function (c) { if (c && !seen[c]) {
        seen[c] = true;
        out.push(c);
    } };
    [ASSET_ID_COLUMN, ASSET_NAME_COLUMN, 'craa5_roomname', 'craa5_areaname', 'modifiedon', 'statecode', 'statuscode'].concat(mapColumn ? [mapColumn] : []).forEach(add);
    fields.forEach(function (f) { return tableSelectOf(f).forEach(add); });
    return out.join(',');
}
// One page of whole rows for the table, with the total on the first page (Dataverse counts up to 5000)
function fetchAssetRows(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, q, res, err, _c, data, count;
        var set = _b.set, select = _b.select, words = _b.words, room = _b.room, placement = _b.placement, status = _b.status, mapColumn = _b.mapColumn, sort = _b.sort, next = _b.next;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = next;
                    if (!url) {
                        q = assetListQuery({ words: words, room: room, placement: placement, status: status, mapColumn: mapColumn, sort: sort });
                        url = apiUrl("".concat(set, "?").concat(select ? "$select=".concat(select, "&") : '').concat(q.filter ? "$filter=".concat(encodeURIComponent(q.filter), "&") : '', "$orderby=").concat(encodeURIComponent(q.order), "&$count=true"));
                    }
                    return [4 /*yield*/, fetch(url, { headers: __assign(__assign(__assign({}, ODATA_HEADERS), NO_CACHE), { Prefer: "odata.maxpagesize=".concat(ASSET_TABLE_PAGE, ",odata.include-annotations=\"*\"") }) })];
                case 1:
                    res = _d.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _c = Error.bind;
                    return [4 /*yield*/, readApiError(res)];
                case 2:
                    err = new (_c.apply(Error, [void 0, _d.sent()]))();
                    err.status = res.status;
                    throw err;
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = _d.sent();
                    count = typeof data['@odata.count'] === 'number' ? data['@odata.count'] : null;
                    return [2 /*return*/, {
                            rows: (data.value || []).filter(function (r) { return GUID_PATTERN.test(cleanGuid(r[ASSET_ID_COLUMN])); }),
                            next: data['@odata.nextLink'] || null,
                            count: count,
                            countCapped: data['@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded'] === true || (count !== null && count >= 5000)
                        }];
            }
        });
    });
}
// A row of the table: the row as Dataverse last sent it, the etag a save sends, and what the user has typed
// (edits[name] = { value, from }: `from` is the server value the edit started from)
var blankAssetEntry = function (row) { return ({ row: row || {}, etag: (row && row['@odata.etag']) || '', edits: {}, errors: {}, status: '', message: '', clash: false }); };
// The columns of a row the user has changed (and not changed back)
function changedAssetFields(entry, byName) {
    var out = [];
    if (!entry)
        return out;
    Object.keys(entry.edits).forEach(function (name) {
        var f = byName[name];
        if (f && editKey(f, entry.edits[name].value) !== editKey(f, toEditValue(f, entry.row)))
            out.push(f);
    });
    return out;
}
// The version in a Dataverse etag (W/"12345"); it only goes up
var etagVersion = function (row) { var m = /"(\d+)"/.exec((row && row['@odata.etag']) || ''); return m ? Number(m[1]) : null; };
// A newer copy of a row from Dataverse. The edits stay. If someone else changed a column the user is changing, the etag
// the edit started from is kept, so Save reports the clash instead of quietly writing over their change.
function mergeAssetEntry(entry, fresh, byName) {
    if (!entry)
        return blankAssetEntry(fresh);
    // A copy older than the one here (a list that was on its way while the row saved) changes nothing
    var had = etagVersion(entry.row);
    var got = etagVersion(fresh);
    if (had !== null && got !== null && got < had)
        return entry;
    var row = __assign(__assign({}, entry.row), fresh);
    var freshTag = fresh['@odata.etag'] || entry.etag;
    var clash = entry.clash;
    var edits = {};
    Object.keys(entry.edits).forEach(function (name) {
        var f = byName[name];
        var e = entry.edits[name];
        if (!f) {
            edits[name] = e;
            return;
        }
        var mine = editKey(f, e.value);
        var now = editKey(f, toEditValue(f, row));
        // Typed back to where it started, or Dataverse already holds it: nothing is left to save there
        if (mine === e.from || mine === now)
            return;
        edits[name] = e;
        if (now !== e.from)
            clash = true;
    });
    if (Object.keys(edits).length === 0) {
        var settled = entry.status === 'stale' || entry.status === 'error';
        return __assign(__assign({}, entry), { row: row, edits: {}, errors: {}, clash: false, etag: freshTag, status: settled ? '' : entry.status, message: settled ? '' : entry.message });
    }
    return __assign(__assign({}, entry), { row: row, edits: edits, clash: clash, etag: clash ? entry.etag : freshTag });
}
// A row that must not drop out of view: unsaved, saving, or waiting on a decision
var entryNeedsKeeping = function (e, byName) { return !!e && (changedAssetFields(e, byName).length > 0 || e.status === 'saving' || e.status === 'stale' || e.status === 'error'); };
function AssetsTable(_a) {
    var _this = this;
    var meta = _a.meta, set = _a.set, mapColumn = _a.mapColumn, mapKey = _a.mapKey, metaDone = _a.metaDone, loadAssetMeta = _a.loadAssetMeta, rooms = _a.rooms, rowEvent = _a.rowEvent, focus = _a.focus, onAssetSaved = _a.onAssetSaved, onShowOnMap = _a.onShowOnMap, logEvent = _a.logEvent;
    var ready = meta.status === 'ready' && meta.fields.length > 0;
    // Every column but the id and the map spot (the pin button shows that); the name is always the first column
    var allFields = useMemo(function () { return meta.fields.filter(function (f) { return !f.isPrimaryId && f.name !== mapColumn; }); }, [meta.fields, mapColumn]);
    var byName = useMemo(function () { var o = {}; allFields.forEach(function (f) { o[f.name] = f; }); return o; }, [allFields]);
    var nameField = useMemo(function () { return allFields.find(function (f) { return f.isPrimaryName; }) || null; }, [allFields]);
    var grouped = useMemo(function () { return groupAssetFields(allFields.filter(function (f) { return !f.isPrimaryName; })); }, [allFields]);
    var orderedFields = useMemo(function () {
        var out = [];
        grouped.groups.forEach(function (g) { return g.items.forEach(function (f) { return out.push(f); }); });
        grouped.info.forEach(function (f) { return out.push(f); });
        return out;
    }, [grouped]);
    // At first: the equipment, cleaning and pictures / documents columns. The choice is remembered on this device.
    var defaultColumns = useMemo(function () {
        var out = [];
        grouped.groups.forEach(function (g) { if (g.key !== 'other')
            g.items.forEach(function (f) { return out.push(f.name); }); });
        return out;
    }, [grouped]);
    var _b = useState(function () { var v = readPref(ASSET_TABLE_COLUMNS_PREF, null); return Array.isArray(v) ? v : null; }), columnPref = _b[0], setColumnPref = _b[1];
    useEffect(function () { writePref(ASSET_TABLE_COLUMNS_PREF, columnPref); }, [columnPref]);
    var shownNames = columnPref || defaultColumns;
    var columns = useMemo(function () { return orderedFields.filter(function (f) { return shownNames.indexOf(f.name) !== -1; }); }, [orderedFields, shownNames]);
    // Every column is asked for (not only the shown ones), so showing another column needs no new query
    var select = useMemo(function () { return (ready ? assetTableSelect(allFields, mapColumn) : ''); }, [ready, allFields, mapColumn]);
    var useSelect = useRef(true);
    // Search and filters
    var _c = useState(''), query = _c[0], setQuery = _c[1];
    var _d = useState(''), debounced = _d[0], setDebounced = _d[1];
    useEffect(function () {
        var t = setTimeout(function () { return setDebounced(query); }, 300);
        return function () { return clearTimeout(t); };
    }, [query]);
    var words = useMemo(function () { return debounced.trim().split(/\s+/).filter(Boolean).slice(0, 4); }, [debounced]);
    var _f = useState(''), room = _f[0], setRoom = _f[1];
    var _g = useState('all'), placement = _g[0], setPlacement = _g[1];
    var _h = useState('active'), statusFilter = _h[0], setStatusFilter = _h[1]; // 'active' | 'inactive' | 'all'
    var _j = useState(null), sort = _j[0], setSort = _j[1]; // { name, desc }
    // Resizable column widths (persisted on this device)
    var _k = useState(function () {
        var v = readPref(ASSET_COL_WIDTHS_PREF, null);
        return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
    }), colWidths = _k[0], setColWidths = _k[1];
    useEffect(function () { writePref(ASSET_COL_WIDTHS_PREF, colWidths); }, [colWidths]);
    var getColWidth = useCallback(function (colKey, kind) {
        var custom = Number(colWidths[colKey]);
        if (custom && isFinite(custom))
            return Math.max(70, Math.min(900, Math.round(custom)));
        return ASSET_DEFAULT_COL_PX[colKey] || ASSET_DEFAULT_COL_PX[kind] || 150;
    }, [colWidths]);
    var resetColWidth = useCallback(function (colKey) {
        setColWidths(function (prev) {
            var next = __assign({}, prev);
            delete next[colKey];
            return next;
        });
    }, []);
    var resetAllColWidths = useCallback(function () { return setColWidths({}); }, []);
    var startColResize = useCallback(function (e, colKey, startPx) {
        e.preventDefault();
        e.stopPropagation();
        var startX = e.clientX;
        var onMove = function (ev) {
            var delta = ev.clientX - startX;
            var nextPx = Math.max(70, Math.min(900, Math.round(startPx + delta)));
            setColWidths(function (prev) {
                var _a;
                return (prev[colKey] === nextPx ? prev : __assign(__assign({}, prev), (_a = {}, _a[colKey] = nextPx, _a)));
            });
        };
        var onUp = function () {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    }, []);
    // Multi-row selection & Bulk Edit state
    var _l = useState({}), selectedMap = _l[0], setSelectedMap = _l[1];
    var _m = useState(false), bulkOpen = _m[0], setBulkOpen = _m[1];
    var _o = useState([{ id: 1, col: 'craa5_areaname', value: '', clear: false }]), bulkAssignments = _o[0], setBulkAssignments = _o[1];
    var bulkAssignSeq = useRef(2);
    var _p = useState(''), bulkBusy = _p[0], setBulkBusy = _p[1];
    var _q = useState(false), confirmBulkDeact = _q[0], setConfirmBulkDeact = _q[1];
    // Rows
    var _r = useState({}), rows = _r[0], setRows = _r[1];
    var rowsRef = useRef(rows);
    rowsRef.current = rows;
    var _s = useState({ ids: [], next: null, loading: true, error: '', count: null, countCapped: false }), page = _s[0], setPage = _s[1];
    var pageRef = useRef(page);
    pageRef.current = page;
    // Rows kept at the top: changed rows outside this search, new assets, the asset asked for from the map
    var _t = useState([]), pinned = _t[0], setPinned = _t[1];
    var pinnedRef = useRef(pinned);
    pinnedRef.current = pinned;
    var focusKeep = useRef(null); // the asset asked for from the map stays until the search changes
    var req = useRef(0);
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    var _u = useState(null), drawer = _u[0], setDrawer = _u[1]; // { id } = details of a row, { id: null } = a new asset
    var drawerRef = useRef(drawer);
    drawerRef.current = drawer;
    var _v = useState(false), drawerDirty = _v[0], setDrawerDirty = _v[1];
    var drawerDirtyRef = useRef(false);
    drawerDirtyRef.current = drawerDirty;
    var _w = useState(null), confirmClose = _w[0], setConfirmClose = _w[1]; // { run }
    var _x = useState(0), drawerRefresh = _x[0], setDrawerRefresh = _x[1];
    var _y = useState(null), highlight = _y[0], setHighlight = _y[1]; // { id, n }
    var focusSeqLocal = useRef(0);
    var _z = useState(false), chooserOpen = _z[0], setChooserOpen = _z[1];
    var chooserRef = useRef(null);
    var _0 = useState(false), savingAll = _0[0], setSavingAll = _0[1];
    var _1 = useState(''), bulkNote = _1[0], setBulkNote = _1[1];
    var _2 = useState(false), confirmDiscard = _2[0], setConfirmDiscard = _2[1];
    var _3 = useState(''), notice = _3[0], setNotice = _3[1];
    var scrollRef = useRef(null);
    // The user changed the search: the asset asked for from the map need not stay
    var userChanged = function (fn) { return function (v) { focusKeep.current = null; fn(v); }; };
    var onQuery = userChanged(setQuery);
    var onRoom = userChanged(setRoom);
    var onPlacement = userChanged(setPlacement);
    var onStatusFilter = userChanged(setStatusFilter);
    // A query, with every column by name; if Dataverse refuses a name, once more without the list
    var runQuery = function (args) { return __awaiter(_this, void 0, void 0, function () {
        var error_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchAssetRows(__assign(__assign({}, args), { select: useSelect.current ? select : '' }))];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_25 = _a.sent();
                    if (error_25.status === 400 && useSelect.current && select && !args.next) {
                        useSelect.current = false;
                        logEvent("The equipment table's column list was refused (".concat(error_25.message, "). Asking for every column instead."), 'warn');
                        return [2 /*return*/, fetchAssetRows(__assign(__assign({}, args), { select: '' }))];
                    }
                    throw error_25;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchRow = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var path, error_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = function (withSelect) { return "".concat(set, "(").concat(id, ")").concat(withSelect && select ? "?$select=".concat(select) : ''); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getJson(path(useSelect.current), ANNOTATIONS)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_26 = _a.sent();
                    if (error_26.status !== 400 || !useSelect.current || !select)
                        throw error_26;
                    useSelect.current = false;
                    logEvent("The equipment table's column list was refused (".concat(error_26.message, "). Asking for every column instead."), 'warn');
                    return [2 /*return*/, getJson(path(false), ANNOTATIONS)];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // The first page, whenever the search, filters or sort change (or Try again)
    var _4 = useState(0), reloadSeq = _4[0], setReloadSeq = _4[1];
    var listKey = [words.join(' '), room, placement, statusFilter, sort ? "".concat(sort.name, ":").concat(sort.desc ? 1 : 0) : '', mapColumn || '', select].join('#');
    useEffect(function () {
        if (!ready)
            return;
        var r = req.current + 1;
        req.current = r;
        setPage(function (p) { return (__assign(__assign({}, p), { loading: true, error: '' })); });
        runQuery({ set: set, words: words, room: room, placement: placement, status: statusFilter, mapColumn: mapColumn, sort: sort, next: null })
            .then(function (res) {
            if (r !== req.current || !mounted.current)
                return;
            var cur = rowsRef.current;
            var ids = res.rows.map(function (x) { return cleanGuid(x[ASSET_ID_COLUMN]); });
            var inPage = {};
            ids.forEach(function (id) { inPage[id] = true; });
            var open = drawerRef.current && drawerRef.current.id;
            var before = pinnedRef.current.concat(pageRef.current.ids);
            var keep = before.filter(function (id, i) { return before.indexOf(id) === i && !inPage[id] && (entryNeedsKeeping(cur[id], byName) || id === open || id === focusKeep.current); });
            setRows(function (prev) {
                var next = {};
                keep.forEach(function (id) { if (prev[id])
                    next[id] = prev[id]; });
                res.rows.forEach(function (x) { var id = cleanGuid(x[ASSET_ID_COLUMN]); next[id] = mergeAssetEntry(prev[id], x, byName); });
                return next;
            });
            setPinned(keep);
            setPage({ ids: ids, next: res.next, loading: false, error: '', count: res.count, countCapped: res.countCapped });
        })
            .catch(function (error) {
            if (r !== req.current || !mounted.current)
                return;
            logEvent("Equipment table query failed: ".concat(error.message), 'error');
            setPage(function (p) { return (__assign(__assign({}, p), { next: null, loading: false, error: error.message })); });
        });
    }, [listKey, ready, reloadSeq]); // eslint-disable-line react-hooks/exhaustive-deps
    var retry = function () { return setReloadSeq(function (n) { return n + 1; }); };
    var showMore = function () {
        if (!page.next || page.loading)
            return;
        var r = req.current + 1;
        req.current = r;
        setPage(function (p) { return (__assign(__assign({}, p), { loading: true, error: '' })); });
        runQuery({ set: set, next: page.next })
            .then(function (res) {
            if (r !== req.current || !mounted.current)
                return;
            setRows(function (prev) {
                var next = __assign({}, prev);
                res.rows.forEach(function (x) { var id = cleanGuid(x[ASSET_ID_COLUMN]); next[id] = mergeAssetEntry(prev[id], x, byName); });
                return next;
            });
            setPage(function (p) {
                var have = {};
                p.ids.forEach(function (id) { have[id] = true; });
                var add = res.rows.map(function (x) { return cleanGuid(x[ASSET_ID_COLUMN]); }).filter(function (id) { return !have[id] && (have[id] = true); });
                return __assign(__assign({}, p), { ids: p.ids.concat(add), next: res.next, loading: false, error: '' });
            });
        })
            .catch(function (error) { if (r === req.current && mounted.current)
            setPage(function (p) { return (__assign(__assign({}, p), { loading: false, error: error.message })); }); });
    };
    // --- Row actions ---
    var patchEntry = function (id, changes) { return setRows(function (prev) {
        var _a;
        return (prev[id] ? __assign(__assign({}, prev), (_a = {}, _a[id] = __assign(__assign({}, prev[id]), changes), _a)) : prev);
    }); };
    var setCell = function (id, name, value) {
        setRows(function (prev) {
            var _a, _b, _c;
            var e = prev[id];
            var f = byName[name];
            if (!e || !f || e.status === 'saving')
                return prev;
            var old = e.edits[name];
            var edits = __assign(__assign({}, e.edits), (_a = {}, _a[name] = { value: value, from: old ? old.from : editKey(f, toEditValue(f, e.row)) }, _a));
            // Back to what Dataverse holds: no change is left in that cell
            if (editKey(f, value) === editKey(f, toEditValue(f, e.row)))
                delete edits[name];
            var errors = e.errors[name] ? __assign(__assign({}, e.errors), (_b = {}, _b[name] = '', _b)) : e.errors;
            var settled = e.status === 'saved' || e.status === 'error' || (e.status === '' && e.message);
            return __assign(__assign({}, prev), (_c = {}, _c[id] = __assign(__assign({}, e), { edits: edits, errors: errors, status: settled ? '' : e.status, message: settled ? '' : e.message }), _c));
        });
    };
    var undoRow = function (id) { return setRows(function (prev) {
        var _a;
        return (prev[id] && prev[id].status !== 'saving' ? __assign(__assign({}, prev), (_a = {}, _a[id] = blankAssetEntry(prev[id].row), _a)) : prev);
    }); };
    // Saves one row: only the changed columns, with the etag. Resolves to 'saved', 'error' or 'skip'.
    var saveRow = function (id, force) { return __awaiter(_this, void 0, void 0, function () {
        var e, changed, errs, payload, fresh, base, row_2, error_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e = rowsRef.current[id];
                    if (!e || e.status === 'saving')
                        return [2 /*return*/, 'skip'];
                    changed = changedAssetFields(e, byName);
                    if (changed.length === 0) {
                        patchEntry(id, { edits: {}, errors: {}, status: '', message: '' });
                        return [2 /*return*/, 'skip'];
                    }
                    errs = {};
                    changed.forEach(function (f) { var msg = validateField(f, e.edits[f.name].value); if (msg)
                        errs[f.name] = msg; });
                    if (Object.keys(errs).length > 0) {
                        patchEntry(id, { errors: errs, status: 'error', message: 'Fix the marked cells first.' });
                        return [2 /*return*/, 'error'];
                    }
                    payload = {};
                    changed.forEach(function (f) { var kv = toPayloadEntry(f, e.edits[f.name].value); payload[kv[0]] = kv[1]; });
                    patchEntry(id, { status: 'saving', message: '', errors: {} });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, patchAsset(set, id, payload, force ? '*' : e.etag, logEvent)];
                case 2:
                    fresh = _a.sent();
                    base = rowsRef.current[id];
                    row_2 = __assign(__assign({}, (base ? base.row : e.row)), fresh);
                    setRows(function (prev) {
                        var _a;
                        return (prev[id] ? __assign(__assign({}, prev), (_a = {}, _a[id] = __assign(__assign({}, blankAssetEntry(row_2)), { status: 'saved', message: 'Saved.' }), _a)) : prev);
                    });
                    logEvent("Saved asset ".concat(id, " from the table (").concat(changed.length, " column").concat(changed.length === 1 ? '' : 's', ")."), 'success');
                    onAssetSaved(row_2, 'table', false);
                    return [2 /*return*/, 'saved'];
                case 3:
                    error_27 = _a.sent();
                    logEvent("Asset ".concat(id, " not saved from the table: ").concat(error_27.message), 'error', payload);
                    if (error_27.stale)
                        patchEntry(id, { status: 'stale', message: 'Someone else changed this asset after it was loaded here.' });
                    else
                        patchEntry(id, { status: 'error', message: "Not saved: ".concat(error_27.message) });
                    return [2 /*return*/, 'error'];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Reads one row again. `discard` drops its edits (Reload after a clash); otherwise they stay (after an upload).
    var refreshRow = function (id, discard) { return __awaiter(_this, void 0, void 0, function () {
        var fresh_2, error_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchRow(id)];
                case 1:
                    fresh_2 = _a.sent();
                    if (!mounted.current)
                        return [2 /*return*/, null];
                    setRows(function (prev) {
                        var _a;
                        if (!prev[id])
                            return prev;
                        return __assign(__assign({}, prev), (_a = {}, _a[id] = discard ? blankAssetEntry(__assign(__assign({}, prev[id].row), fresh_2)) : mergeAssetEntry(prev[id], fresh_2, byName), _a));
                    });
                    return [2 /*return*/, fresh_2];
                case 2:
                    error_28 = _a.sent();
                    logEvent("Asset ".concat(id, " could not be read again: ").concat(error_28.message), 'error');
                    if (mounted.current)
                        patchEntry(id, { message: "Could not read this asset again: ".concat(error_28.message) });
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // A picture or file changed (in a cell or in Details): the row, the map card and the pins follow
    var fileChanged = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var fresh, e;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, refreshRow(id, false)];
                case 1:
                    fresh = _a.sent();
                    // Details open on the same asset reads it again too (the upload gave the record a new version)
                    if (fresh && drawerRef.current && drawerRef.current.id === id)
                        setDrawerRefresh(function (t) { return t + 1; });
                    if (fresh) {
                        e = rowsRef.current[id];
                        onAssetSaved(__assign(__assign({}, (e ? e.row : {})), fresh), 'table', false);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // The drawer: one asset's every column (as in the map's editor), or a new asset. Unsaved changes are never dropped silently.
    var requestDrawer = function (next) {
        if (drawerDirtyRef.current)
            setConfirmClose({ run: function () { setDrawerDirty(false); setDrawer(next); } });
        else
            setDrawer(next);
    };
    var closeDrawer = function () { return requestDrawer(null); };
    var openDetails = function (id) {
        if (changedAssetFields(rowsRef.current[id], byName).length > 0) {
            patchEntry(id, { message: 'Save or undo the changes in this row first, then open Details.' });
            return;
        }
        if (drawerRef.current && drawerRef.current.id === id)
            return;
        requestDrawer({ id: id });
    };
    var onDrawerSaved = function (row) {
        var id = cleanGuid(row[ASSET_ID_COLUMN]);
        setRows(function (prev) {
            var _a;
            return (prev[id] ? __assign(__assign({}, prev), (_a = {}, _a[id] = mergeAssetEntry(prev[id], row, byName), _a)) : prev);
        });
        onAssetSaved(row, 'table', false);
    };
    var onDrawerCreated = function (row) {
        var id = cleanGuid(row[ASSET_ID_COLUMN]);
        setRows(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[id] = blankAssetEntry(row), _a)));
        });
        setPinned(function (p) { return [id].concat(p.filter(function (x) { return x !== id; })); });
        onAssetSaved(row, 'table', true);
        logEvent("Created asset ".concat((row[ASSET_NAME_COLUMN] || '').trim() || id, " from the table."), 'success');
        setDrawerDirty(false);
        // Stays open on the new asset, so pictures and files can be added straight away
        setDrawer({ id: id });
        focusSeqLocal.current += 1;
        setHighlight({ id: id, n: focusSeqLocal.current });
    };
    // Deactivate or reactivate a single asset row
    var toggleRowActive = function (id, active) { return __awaiter(_this, void 0, void 0, function () {
        var e, fresh, base, row_3, error_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e = rowsRef.current[id];
                    if (!e || e.status === 'saving')
                        return [2 /*return*/, false];
                    patchEntry(id, { status: 'saving', message: active ? 'Reactivating...' : 'Deactivating...' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, setAssetActiveState(set, id, active, logEvent)];
                case 2:
                    fresh = _a.sent();
                    base = rowsRef.current[id];
                    row_3 = __assign(__assign(__assign({}, (base ? base.row : e.row)), fresh), { statecode: active ? 0 : 1 });
                    setRows(function (prev) {
                        var _a;
                        return (prev[id] ? __assign(__assign({}, prev), (_a = {}, _a[id] = __assign(__assign({}, blankAssetEntry(row_3)), { status: 'saved', message: active ? 'Reactivated.' : 'Deactivated.' }), _a)) : prev);
                    });
                    logEvent("".concat(active ? 'Reactivated' : 'Deactivated', " asset ").concat((row_3[ASSET_NAME_COLUMN] || '').trim() || id, "."), 'success');
                    onAssetSaved(row_3, 'table', false);
                    return [2 /*return*/, true];
                case 3:
                    error_29 = _a.sent();
                    logEvent("Asset ".concat(id, " status change failed: ").concat(error_29.message), 'error');
                    patchEntry(id, { status: 'error', message: "Could not ".concat(active ? 'reactivate' : 'deactivate', ": ").concat(error_29.message) });
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var toggleSelectRow = useCallback(function (id) {
        setSelectedMap(function (prev) {
            var next = __assign({}, prev);
            if (next[id])
                delete next[id];
            else
                next[id] = true;
            return next;
        });
    }, []);
    // Stable handlers for the rows (a row only draws again when its own data changes)
    var act = useRef({});
    act.current = { setCell: setCell, saveRow: saveRow, undoRow: undoRow, openDetails: openDetails, onShowOnMap: onShowOnMap, refreshRow: refreshRow, fileChanged: fileChanged, toggleRowActive: toggleRowActive, toggleSelectRow: toggleSelectRow };
    var actions = useMemo(function () { return ({
        setCell: function (id, name, v) { return act.current.setCell(id, name, v); },
        save: function (id, force) { return act.current.saveRow(id, force); },
        undo: function (id) { return act.current.undoRow(id); },
        details: function (id) { return act.current.openDetails(id); },
        showOnMap: function (id) { return act.current.onShowOnMap(id); },
        reload: function (id) { return act.current.refreshRow(id, true); },
        fileChanged: function (id) { return act.current.fileChanged(id); },
        toggleActive: function (id, active) { return act.current.toggleRowActive(id, active); },
        toggleSelect: function (id) { return act.current.toggleSelectRow(id); }
    }); }, []);
    // Saved on the map: the row here follows; a new asset made there is added at the top
    useEffect(function () {
        if (!rowEvent || rowEvent.from === 'table')
            return;
        var id = rowEvent.summary.id;
        if (rowsRef.current[id])
            setRows(function (prev) {
                var _a;
                return (prev[id] ? __assign(__assign({}, prev), (_a = {}, _a[id] = mergeAssetEntry(prev[id], rowEvent.row, byName), _a)) : prev);
            });
        else if (rowEvent.isNew) {
            setRows(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[id] = blankAssetEntry(rowEvent.row), _a)));
            });
            setPinned(function (p) { return [id].concat(p.filter(function (x) { return x !== id; })); });
        }
        if (drawerRef.current && drawerRef.current.id === id)
            setDrawerRefresh(function (t) { return t + 1; });
    }, [rowEvent && rowEvent.n]); // eslint-disable-line react-hooks/exhaustive-deps
    // Asked from the map ("Edit in table"): show that row at the top and point at it
    var focusDone = useRef(0);
    useEffect(function () {
        var f = focus;
        if (!f || !ready || focusDone.current >= f.n)
            return;
        focusDone.current = f.n;
        var id = f.id;
        focusKeep.current = id;
        // Another asset's Details would cover the row asked for (unsaved changes there are asked about first)
        if (drawerRef.current && drawerRef.current.id !== id)
            requestDrawer(null);
        var show = function () {
            setPinned(function (p) { return (pageRef.current.ids.indexOf(id) !== -1 || p.indexOf(id) !== -1 ? p : [id].concat(p)); });
            focusSeqLocal.current += 1;
            setHighlight({ id: id, n: focusSeqLocal.current });
        };
        if (rowsRef.current[id]) {
            show();
            return;
        }
        fetchRow(id)
            .then(function (fresh) {
            if (!mounted.current)
                return;
            setRows(function (prev) {
                var _a;
                return (prev[id] ? prev : __assign(__assign({}, prev), (_a = {}, _a[id] = blankAssetEntry(fresh), _a)));
            });
            show();
        })
            .catch(function (error) {
            logEvent("Asset ".concat(id, " could not be shown in the table: ").concat(error.message), 'error');
            if (mounted.current)
                setNotice("That asset could not be loaded: ".concat(error.message));
        });
    }, [focus && focus.n, ready]); // eslint-disable-line react-hooks/exhaustive-deps
    // Scroll to the row being pointed at, and let the colour fade
    useEffect(function () {
        if (!highlight)
            return undefined;
        var n = highlight.n;
        var t1 = setTimeout(function () {
            var c = scrollRef.current;
            var tr = c ? c.querySelector("tr[data-row-id=\"".concat(highlight.id, "\"]")) : null;
            if (c && tr) {
                // Rows kept at the top: show the top (with its label); other rows: only scroll if the row is out of view
                var head = c.querySelector('thead');
                var top = tr.offsetTop - (head ? head.offsetHeight : 0);
                if (pinnedRef.current.indexOf(highlight.id) !== -1)
                    c.scrollTop = 0;
                else if (top < c.scrollTop || tr.offsetTop + tr.offsetHeight > c.scrollTop + c.clientHeight)
                    c.scrollTop = Math.max(0, top - 8);
                c.scrollLeft = 0;
            }
        }, 60);
        var t2 = setTimeout(function () { return setHighlight(function (h) { return (h && h.n === n ? null : h); }); }, 2600);
        return function () { clearTimeout(t1); clearTimeout(t2); };
    }, [highlight && highlight.n]); // eslint-disable-line react-hooks/exhaustive-deps
    // The column list closes on a click outside it, or Escape
    useEffect(function () {
        if (!chooserOpen)
            return undefined;
        var onDown = function (e) { if (chooserRef.current && !chooserRef.current.contains(e.target))
            setChooserOpen(false); };
        var onKey = function (e) { if (e.key === 'Escape')
            setChooserOpen(false); };
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('keydown', onKey);
        return function () { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
    }, [chooserOpen]);
    var dirtyIds = Object.keys(rows).filter(function (id) { return rows[id].status !== 'saving' && changedAssetFields(rows[id], byName).length > 0; });
    // Nothing left to discard (saved or undone row by row): the question goes away and does not come back by itself
    useEffect(function () { if (dirtyIds.length === 0 && !savingAll)
        setConfirmDiscard(false); }, [dirtyIds.length, savingAll]);
    var saveAll = function () { return __awaiter(_this, void 0, void 0, function () {
        var ids, ok, bad, i, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (savingAll)
                        return [2 /*return*/];
                    ids = dirtyIds.slice();
                    setSavingAll(true);
                    setBulkNote('');
                    ok = 0;
                    bad = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < ids.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, saveRow(ids[i], false)];
                case 2:
                    r = _a.sent();
                    if (r === 'saved')
                        ok += 1;
                    else if (r === 'error')
                        bad += 1;
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4:
                    if (!mounted.current)
                        return [2 /*return*/];
                    setSavingAll(false);
                    setBulkNote(bad ? "".concat(ok, " saved, ").concat(bad, " not saved (see the marked rows).") : "".concat(ok, " row").concat(ok === 1 ? '' : 's', " saved."));
                    return [2 /*return*/];
            }
        });
    }); };
    var discardAll = function () {
        setRows(function (prev) {
            var next = __assign({}, prev);
            Object.keys(next).forEach(function (id) {
                var e = next[id];
                if (e.status !== 'saving' && (Object.keys(e.edits).length > 0 || e.status === 'stale' || e.status === 'error'))
                    next[id] = blankAssetEntry(e.row);
            });
            return next;
        });
        setConfirmDiscard(false);
        setBulkNote('');
    };
    var toggleSort = function (name) {
        focusKeep.current = null;
        setSort(function (s) { return (!s || s.name !== name ? { name: name, desc: false } : (s.desc ? null : { name: name, desc: true })); });
    };
    // What is drawn: the kept rows first, then the page
    var pinnedShown = pinned.filter(function (id) { return rows[id]; });
    var pinnedIndex = {};
    pinnedShown.forEach(function (id) { pinnedIndex[id] = true; });
    var pageShown = page.ids.filter(function (id) { return rows[id] && !pinnedIndex[id]; });
    var allShownIds = useMemo(function () { return pinnedShown.concat(pageShown); }, [pinnedShown, pageShown]);
    var selectedIds = useMemo(function () { return Object.keys(selectedMap).filter(function (id) { return selectedMap[id] && rows[id]; }); }, [selectedMap, rows]);
    var allShownSelected = allShownIds.length > 0 && allShownIds.every(function (id) { return !!selectedMap[id]; });
    var editableBulkFields = useMemo(function () { return orderedFields.filter(function (f) { return !f.isPrimaryName && isEditableField(f, false); }); }, [orderedFields]);
    var activeSelectedIds = useMemo(function () { return selectedIds.filter(function (id) { return rows[id] && rows[id].row.statecode !== 1; }); }, [selectedIds, rows]);
    var inactiveSelectedIds = useMemo(function () { return selectedIds.filter(function (id) { return rows[id] && rows[id].row.statecode === 1; }); }, [selectedIds, rows]);
    var toggleSelectAllShown = function () {
        setSelectedMap(function (prev) {
            var next = __assign({}, prev);
            if (allShownSelected) {
                allShownIds.forEach(function (id) { delete next[id]; });
            }
            else {
                allShownIds.forEach(function (id) { next[id] = true; });
            }
            return next;
        });
    };
    var selectUnplacedShown = function () {
        setSelectedMap(function (prev) {
            var next = __assign({}, prev);
            allShownIds.forEach(function (id) {
                var r = rows[id] && rows[id].row;
                var loc = r && mapColumn ? parseMapLocation(r[mapColumn]) : null;
                if (!pinOnMap(loc, mapKey))
                    next[id] = true;
            });
            return next;
        });
    };
    var clearSelection = function () { setSelectedMap({}); setConfirmBulkDeact(false); };
    var addBulkAssignment = function () {
        var used = {};
        bulkAssignments.forEach(function (a) { used[a.col] = true; });
        var nextField = editableBulkFields.find(function (f) { return !used[f.name]; }) || editableBulkFields[0];
        if (!nextField)
            return;
        var id = bulkAssignSeq.current;
        bulkAssignSeq.current += 1;
        setBulkAssignments(function (prev) { return prev.concat([{ id: id, col: nextField.name, value: emptyValue(nextField), clear: false }]); });
    };
    var updateBulkAssignment = function (itemId, patch) {
        setBulkAssignments(function (prev) { return prev.map(function (a) {
            if (a.id !== itemId)
                return a;
            var next = __assign(__assign({}, a), patch);
            if (patch.col && patch.col !== a.col) {
                var nf = byName[patch.col];
                next.value = nf ? emptyValue(nf) : '';
                next.clear = false;
            }
            return next;
        }); });
    };
    var removeBulkAssignment = function (itemId) {
        setBulkAssignments(function (prev) { return (prev.length > 1 ? prev.filter(function (a) { return a.id !== itemId; }) : prev); });
    };
    // Stage bulk edits onto all selected rows (and optionally save them immediately to Dataverse)
    var applyBulkEdits = function (saveImmediately) { return __awaiter(_this, void 0, void 0, function () {
        var validAssigns, i, a, f, val, err, targets, ok, bad, _loop_2, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedIds.length || bulkBusy || savingAll)
                        return [2 /*return*/];
                    validAssigns = [];
                    for (i = 0; i < bulkAssignments.length; i += 1) {
                        a = bulkAssignments[i];
                        f = byName[a.col];
                        if (!f || !isEditableField(f, false))
                            continue;
                        val = a.clear ? emptyValue(f) : a.value;
                        if (!a.clear) {
                            err = validateField(f, val);
                            if (err) {
                                setBulkNote("Bulk edit field \"".concat(f.label, "\": ").concat(err));
                                return [2 /*return*/];
                            }
                        }
                        else if (f.required || f.isPrimaryName) {
                            setBulkNote("Bulk edit field \"".concat(f.label, "\" is required and cannot be cleared."));
                            return [2 /*return*/];
                        }
                        validAssigns.push({ f: f, val: val });
                    }
                    if (!validAssigns.length) {
                        setBulkNote('Choose at least one field to bulk edit.');
                        return [2 /*return*/];
                    }
                    // 1. Stage into rows state
                    setRows(function (prev) {
                        var next = __assign({}, prev);
                        selectedIds.forEach(function (id) {
                            var e = next[id];
                            if (!e || e.status === 'saving')
                                return;
                            var edits = __assign({}, e.edits);
                            var errors = __assign({}, e.errors);
                            validAssigns.forEach(function (_a) {
                                var f = _a.f, val = _a.val;
                                var old = edits[f.name];
                                var fromKey = old ? old.from : editKey(f, toEditValue(f, e.row));
                                if (editKey(f, val) === editKey(f, toEditValue(f, e.row)))
                                    delete edits[f.name];
                                else
                                    edits[f.name] = { value: val, from: fromKey };
                                if (errors[f.name])
                                    delete errors[f.name];
                            });
                            next[id] = __assign(__assign({}, e), { edits: edits, errors: errors, status: '', message: '' });
                        });
                        return next;
                    });
                    if (!saveImmediately) {
                        setBulkNote("Staged ".concat(validAssigns.length, " field").concat(validAssigns.length === 1 ? '' : 's', " across ").concat(selectedIds.length, " selected asset").concat(selectedIds.length === 1 ? '' : 's', ". Review the highlighted cells or click Save all."));
                        return [2 /*return*/];
                    }
                    targets = selectedIds.slice();
                    setSavingAll(true);
                    ok = 0;
                    bad = 0;
                    _loop_2 = function (i) {
                        var id, e, payload, fresh, base, row_4, error_30;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    id = targets[i];
                                    setBulkBusy("Saving ".concat(i + 1, " / ").concat(targets.length, "..."));
                                    e = rowsRef.current[id];
                                    if (!e)
                                        return [2 /*return*/, "continue"];
                                    payload = {};
                                    validAssigns.forEach(function (_a) {
                                        var f = _a.f, val = _a.val;
                                        if (editKey(f, val) !== editKey(f, toEditValue(f, e.row))) {
                                            var kv = toPayloadEntry(f, val);
                                            payload[kv[0]] = kv[1];
                                        }
                                    });
                                    if (Object.keys(payload).length === 0) {
                                        patchEntry(id, { edits: {}, errors: {}, status: 'saved', message: 'No change needed.' });
                                        ok += 1;
                                        return [2 /*return*/, "continue"];
                                    }
                                    patchEntry(id, { status: 'saving', message: '', errors: {} });
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, patchAsset(set, id, payload, '*', logEvent)];
                                case 2:
                                    fresh = _b.sent();
                                    base = rowsRef.current[id];
                                    row_4 = __assign(__assign({}, (base ? base.row : e.row)), fresh);
                                    setRows(function (prev) {
                                        var _a;
                                        return (prev[id] ? __assign(__assign({}, prev), (_a = {}, _a[id] = __assign(__assign({}, blankAssetEntry(row_4)), { status: 'saved', message: 'Saved.' }), _a)) : prev);
                                    });
                                    onAssetSaved(row_4, 'table', false);
                                    ok += 1;
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_30 = _b.sent();
                                    logEvent("Bulk save failed on asset ".concat(id, ": ").concat(error_30.message), 'error', payload);
                                    patchEntry(id, { status: 'error', message: "Not saved: ".concat(error_30.message) });
                                    bad += 1;
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < targets.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4:
                    if (!mounted.current)
                        return [2 /*return*/];
                    setBulkBusy('');
                    setSavingAll(false);
                    setBulkNote(bad ? "Bulk save finished: ".concat(ok, " saved, ").concat(bad, " failed (see marked rows).") : "Bulk saved ".concat(ok, " asset").concat(ok === 1 ? '' : 's', " to Dataverse."));
                    return [2 /*return*/];
            }
        });
    }); };
    // Bulk deactivate or reactivate selected assets
    var runBulkActiveState = function (active) { return __awaiter(_this, void 0, void 0, function () {
        var targets, ok, bad, i, worked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targets = (active ? inactiveSelectedIds : activeSelectedIds).slice();
                    if (!targets.length || bulkBusy || savingAll)
                        return [2 /*return*/];
                    setConfirmBulkDeact(false);
                    setSavingAll(true);
                    ok = 0;
                    bad = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < targets.length)) return [3 /*break*/, 4];
                    setBulkBusy("".concat(active ? 'Reactivating' : 'Deactivating', " ").concat(i + 1, " / ").concat(targets.length, "..."));
                    return [4 /*yield*/, toggleRowActive(targets[i], active)];
                case 2:
                    worked = _a.sent();
                    if (worked)
                        ok += 1;
                    else
                        bad += 1;
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4:
                    if (!mounted.current)
                        return [2 /*return*/];
                    setBulkBusy('');
                    setSavingAll(false);
                    setBulkNote(bad
                        ? "".concat(ok, " ").concat(active ? 'reactivated' : 'deactivated', ", ").concat(bad, " failed.")
                        : "".concat(ok, " asset").concat(ok === 1 ? '' : 's', " ").concat(active ? 'reactivated' : 'deactivated', "."));
                    return [2 /*return*/];
            }
        });
    }); };
    var drawerId = drawer ? drawer.id : null;
    var colCount = columns.length + 1;
    var nameColWidth = getColWidth('__name', '__name');
    var hasCustomWidths = Object.keys(colWidths).length > 0;
    var countLine = '';
    if (!metaDone)
        countLine = 'Reading the Assets table...';
    else if (!ready)
        countLine = '';
    else if (page.loading && page.ids.length === 0)
        countLine = 'Loading...';
    else if (page.count !== null)
        countLine = "".concat(page.ids.length, " of ").concat(page.count).concat(page.countCapped ? '+' : '', " ").concat(statusFilter === 'inactive' ? 'deactivated ' : (statusFilter === 'all' ? '' : 'active '), "asset").concat(page.count === 1 ? '' : 's', " shown");
    else
        countLine = "".concat(page.ids.length, " asset").concat(page.ids.length === 1 ? '' : 's', " shown");
    var headerCell = 'sticky top-0 bg-[#00468B] text-white text-left text-[11px] font-bold uppercase tracking-wide px-2 py-2 border-b border-[#003366] align-bottom select-none';
    var renderRow = function (id) { return (React.createElement(AssetTableRow, { key: id, id: id, entry: rows[id], selected: !!selectedMap[id], columns: columns, nameField: nameField, nameColWidth: nameColWidth, getColWidth: getColWidth, byName: byName, mapColumn: mapColumn, mapKey: mapKey, set: set, highlight: !!highlight && highlight.id === id, locked: drawerId === id, actions: actions, logEvent: logEvent })); };
    return (React.createElement("div", { className: "h-full flex flex-col bg-slate-100 p-3 md:p-6 pt-3 md:pt-4 overflow-hidden relative", "data-testid": "assets-table-view" },
        React.createElement("div", { className: "flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto", "data-assets-table-scroll": "" },
            React.createElement("div", { className: "shrink-0 flex flex-wrap items-end justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                        React.createElement("h2", { className: "text-2xl font-black text-[#00468B]" }, "Asset Management"),
                        React.createElement("span", { className: "px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F1FB] text-[#00468B] border border-[#B3D4F2]" }, "Official Asset Creation & Bulk Editor")),
                    React.createElement("p", { className: "hidden sm:block text-sm text-slate-500" }, "New assets are restricted to the Microsoft Form and this tab. Drag column edges to resize, tick rows to bulk edit or deactivate old assets, or edit any cell inline.")),
                React.createElement(SearchBox, { query: query, onQuery: onQuery, placeholder: "Search name, room, area...", ariaLabel: "Search the equipment table", className: "w-full sm:w-80" })),
            React.createElement("div", { className: "shrink-0 flex flex-wrap items-center gap-2 relative" },
                React.createElement("div", { className: "inline-flex shrink-0 rounded-full border border-[#B3D4F2] bg-white p-0.5", role: "group", "aria-label": "Filter assets by active status" }, [['active', 'Active'], ['inactive', 'Deactivated'], ['all', 'All']].map(function (_a) {
                    var key = _a[0], label = _a[1];
                    return (React.createElement("button", { key: key, type: "button", onClick: function () { return onStatusFilter(key); }, "aria-pressed": statusFilter === key, className: "px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ".concat(statusFilter === key ? (key === 'inactive' ? 'bg-[#C4001F] text-white' : 'bg-[#00468B] text-white') : 'text-[#00468B] hover:bg-[#E6F1FB]') }, label));
                })),
                mapColumn && (React.createElement("div", { className: "inline-flex shrink-0 rounded-full border border-[#B3D4F2] bg-white p-0.5", role: "group", "aria-label": "Filter the table by map spot" }, [['all', 'All spots'], ['placed', 'On the map'], ['unplaced', 'Not on the map']].map(function (_a) {
                    var key = _a[0], label = _a[1];
                    return (React.createElement("button", { key: key, type: "button", onClick: function () { return onPlacement(key); }, "aria-pressed": placement === key, className: "px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ".concat(placement === key ? 'bg-[#00468B] text-white' : 'text-[#00468B] hover:bg-[#E6F1FB]') }, label));
                }))),
                rooms.length > 0 && (React.createElement("label", { className: "flex items-center gap-1 text-xs text-slate-600" },
                    React.createElement("span", { className: "sr-only" }, "Room"),
                    React.createElement("select", { value: room, onChange: function (e) { return onRoom(e.target.value); }, "aria-label": "Filter the table by room", className: "border border-slate-300 rounded-md px-2 py-1 text-xs bg-white max-w-[11rem]" },
                        React.createElement("option", { value: "" }, "Every room"),
                        rooms.map(function (r) { return React.createElement("option", { key: r, value: r }, r); })))),
                React.createElement("div", { className: "md:relative", ref: chooserRef },
                    React.createElement("button", { type: "button", onClick: function () { return setChooserOpen(function (o) { return !o; }); }, "aria-expanded": chooserOpen, disabled: !ready, className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB] disabled:opacity-50" },
                        React.createElement(TableIcon, { className: "w-3.5 h-3.5" }),
                        " Columns (",
                        columns.length,
                        ")"),
                    chooserOpen && (React.createElement(AssetColumnChooser, { grouped: grouped, shown: shownNames, onChange: function (names) { return setColumnPref(names); }, onDefault: function () { return setColumnPref(null); }, onAll: function () { return setColumnPref(orderedFields.map(function (f) { return f.name; })); }, hasCustomWidths: hasCustomWidths, onResetWidths: resetAllColWidths, onClose: function () { return setChooserOpen(false); } }))),
                hasCustomWidths && (React.createElement("button", { type: "button", onClick: resetAllColWidths, className: "px-2.5 py-1 rounded-md text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100", title: "Reset all resized column widths to default" }, "Reset widths")),
                React.createElement("button", { type: "button", onClick: function () { return setBulkOpen(function (o) { return !o; }); }, disabled: !ready, "aria-expanded": bulkOpen || selectedIds.length > 0, className: "px-3 py-1 rounded-md text-xs font-bold border transition-colors ".concat(bulkOpen || selectedIds.length > 0 ? 'bg-[#00468B] text-white border-[#00468B]' : 'bg-white text-[#00468B] border-[#B3D4F2] hover:bg-[#E6F1FB]', " disabled:opacity-50") },
                    "Bulk Edit / Deactivate",
                    selectedIds.length > 0 ? " (".concat(selectedIds.length, ")") : ''),
                React.createElement("button", { type: "button", onClick: function () { return requestDrawer({ id: null }); }, disabled: !ready, title: ready ? 'Create a new asset in the official equipment catalog' : 'Waiting for the Assets table columns', className: "bg-[#0072CE] text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-[#00468B] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" }, "+ New asset"),
                React.createElement("span", { className: "text-xs text-slate-600", role: "status" }, countLine),
                (dirtyIds.length > 0 || savingAll) && (React.createElement("span", { className: "sm:ml-auto inline-flex flex-wrap items-center gap-2 bg-[#FFF6E0] border border-[#FFB81C] rounded-md px-2 py-1 text-xs", "data-testid": "table-unsaved" },
                    React.createElement("span", { className: "font-bold text-slate-800" }, bulkBusy || (savingAll ? 'Saving...' : "".concat(dirtyIds.length, " row").concat(dirtyIds.length === 1 ? '' : 's', " with unsaved changes"))),
                    !confirmDiscard ? (React.createElement(React.Fragment, null,
                        React.createElement("button", { type: "button", onClick: saveAll, disabled: savingAll, className: "px-2 py-0.5 rounded font-bold bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50" },
                            "Save all (",
                            dirtyIds.length,
                            ")"),
                        React.createElement("button", { type: "button", onClick: function () { return setConfirmDiscard(true); }, disabled: savingAll, className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50" }, "Discard all"))) : (React.createElement(React.Fragment, null,
                        React.createElement("span", null, "Drop every unsaved change?"),
                        React.createElement("button", { type: "button", onClick: discardAll, className: "px-2 py-0.5 rounded font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, "Discard"),
                        React.createElement("button", { type: "button", onClick: function () { return setConfirmDiscard(false); }, className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" }, "Keep"))))),
                bulkNote && !savingAll && React.createElement("span", { className: "text-xs font-semibold text-[#00468B]", role: "status" }, bulkNote)),
            ready && (bulkOpen || selectedIds.length > 0) && (React.createElement("div", { className: "shrink-0 bg-white rounded-xl border-2 border-[#0072CE] shadow-sm p-3 space-y-2.5", "data-testid": "bulk-edit-panel" },
                React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2" },
                    React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                        React.createElement("span", { className: "text-xs font-black uppercase tracking-wider text-[#00468B]" },
                            "Bulk Edit & Asset Lifecycle (",
                            selectedIds.length,
                            " selected)"),
                        React.createElement("button", { type: "button", onClick: toggleSelectAllShown, className: "px-2 py-0.5 rounded text-xs font-bold border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB]" }, allShownSelected ? 'Deselect shown' : "Select all shown (".concat(allShownIds.length, ")")),
                        mapColumn && (React.createElement("button", { type: "button", onClick: selectUnplacedShown, className: "px-2 py-0.5 rounded text-xs font-bold border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB]" }, "Select unplaced shown")),
                        selectedIds.length > 0 && (React.createElement("button", { type: "button", onClick: clearSelection, className: "px-2 py-0.5 rounded text-xs font-bold border border-slate-300 text-slate-600 hover:bg-slate-100" }, "Clear selection"))),
                    React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                        activeSelectedIds.length > 0 && !confirmBulkDeact && (React.createElement("button", { type: "button", disabled: savingAll, onClick: function () { return setConfirmBulkDeact(true); }, className: "px-2.5 py-1 rounded-md text-xs font-bold bg-[#E4002B] text-white hover:bg-[#C4001F] disabled:opacity-50" },
                            "Deactivate selected (",
                            activeSelectedIds.length,
                            ")")),
                        confirmBulkDeact && (React.createElement("span", { className: "inline-flex items-center gap-2 bg-[#FFF6E0] border border-[#FFB81C] rounded-md px-2.5 py-1 text-xs" },
                            React.createElement("span", { className: "font-bold text-slate-800" },
                                "Deactivate ",
                                activeSelectedIds.length,
                                " asset",
                                activeSelectedIds.length === 1 ? '' : 's',
                                "?"),
                            React.createElement("button", { type: "button", disabled: savingAll, onClick: function () { return runBulkActiveState(false); }, className: "px-2 py-0.5 rounded font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, "Confirm Deactivate"),
                            React.createElement("button", { type: "button", onClick: function () { return setConfirmBulkDeact(false); }, className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-slate-700" }, "Cancel"))),
                        inactiveSelectedIds.length > 0 && (React.createElement("button", { type: "button", disabled: savingAll, onClick: function () { return runBulkActiveState(true); }, className: "px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" },
                            "Reactivate selected (",
                            inactiveSelectedIds.length,
                            ")")),
                        selectedIds.length === 0 && (React.createElement("button", { type: "button", onClick: function () { return setBulkOpen(false); }, className: "text-xs font-bold text-slate-500 hover:text-slate-800" }, "Hide panel")))),
                React.createElement("div", { className: "space-y-2" }, bulkAssignments.map(function (item) {
                    var field = byName[item.col] || editableBulkFields[0];
                    if (!field)
                        return null;
                    return (React.createElement("div", { key: item.id, className: "flex flex-wrap items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-200" },
                        React.createElement("label", { className: "text-xs font-bold text-slate-700" },
                            "Field:",
                            React.createElement("select", { value: field.name, onChange: function (e) { return updateBulkAssignment(item.id, { col: e.target.value }); }, className: "ml-1.5 border border-slate-300 rounded px-2 py-1 text-xs bg-white font-semibold text-[#00468B]" }, editableBulkFields.map(function (f) { return (React.createElement("option", { key: f.name, value: f.name },
                                f.label,
                                " (",
                                f.name,
                                ")")); }))),
                        React.createElement("label", { className: "inline-flex items-center gap-1 text-xs text-slate-600 cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: !!item.clear, onChange: function (e) { return updateBulkAssignment(item.id, { clear: e.target.checked }); }, className: "accent-[#0072CE]" }),
                            "Clear value (blank)"),
                        !item.clear && (React.createElement("div", { className: "flex-1 min-w-[14rem] max-w-md bg-white rounded border border-slate-300 px-2 py-0.5" },
                            React.createElement(AssetCell, { f: field, value: item.value, row: {}, error: "", readOnly: false, disabled: savingAll, label: "Bulk value for ".concat(field.label), onChange: function (v) { return updateBulkAssignment(item.id, { value: v }); } }))),
                        bulkAssignments.length > 1 && (React.createElement("button", { type: "button", onClick: function () { return removeBulkAssignment(item.id); }, className: "text-xs font-bold text-slate-400 hover:text-[#E4002B] px-1.5", title: "Remove this field from bulk edit" }, "Remove"))));
                })),
                React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-1" },
                    React.createElement("button", { type: "button", onClick: addBulkAssignment, disabled: savingAll, className: "text-xs font-bold text-[#0072CE] hover:underline" }, "+ Add another column to bulk edit"),
                    React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                        React.createElement("button", { type: "button", disabled: selectedIds.length === 0 || savingAll, onClick: function () { return applyBulkEdits(false); }, className: "px-3 py-1 rounded-md text-xs font-bold border border-[#0072CE] text-[#0072CE] bg-white hover:bg-[#E6F1FB] disabled:opacity-50" },
                            "Stage on ",
                            selectedIds.length,
                            " row",
                            selectedIds.length === 1 ? '' : 's',
                            " (review first)"),
                        React.createElement("button", { type: "button", disabled: selectedIds.length === 0 || savingAll, onClick: function () { return applyBulkEdits(true); }, className: "px-3 py-1 rounded-md text-xs font-bold bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50 shadow-sm" }, bulkBusy || "Apply & Save ".concat(selectedIds.length, " row").concat(selectedIds.length === 1 ? '' : 's', " now")))))),
            metaDone && !ready && (React.createElement("div", { className: "shrink-0 text-sm text-[#C4001F] bg-white rounded-lg border border-slate-200 p-3", role: "alert" },
                "The Assets table's columns could not be read",
                meta.error ? ": ".concat(meta.error) : '.',
                React.createElement("button", { type: "button", onClick: loadAssetMeta, className: "ml-2 text-[#0072CE] underline" }, "Try again"))),
            page.error && (React.createElement("div", { className: "shrink-0 text-xs text-[#C4001F]", role: "alert" },
                "The assets could not be loaded: ",
                page.error,
                React.createElement("button", { type: "button", onClick: retry, className: "ml-2 text-[#0072CE] underline" }, "Try again"))),
            notice && (React.createElement("div", { className: "shrink-0 text-xs text-[#9A6700]", role: "status" },
                notice,
                React.createElement("button", { type: "button", onClick: function () { return setNotice(''); }, className: "ml-2 text-[#0072CE] underline" }, "OK"))),
            React.createElement("div", { ref: scrollRef, className: "flex-1 min-h-[10rem] overflow-auto bg-white rounded-xl border border-slate-200 shadow-sm relative", "aria-busy": page.loading },
                ready && (React.createElement("table", { className: "border-separate border-spacing-0 text-sm min-w-full", style: { tableLayout: 'fixed' }, "data-testid": "asset-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", { scope: "col", style: { width: "".concat(nameColWidth, "px"), minWidth: "".concat(nameColWidth, "px"), maxWidth: "".concat(nameColWidth, "px") }, className: "".concat(headerCell, " left-0 z-30 border-r relative group") },
                                React.createElement("div", { className: "flex items-center gap-2 pr-2" },
                                    React.createElement("input", { type: "checkbox", checked: allShownSelected, onChange: toggleSelectAllShown, "aria-label": "Select all shown assets", title: "Select or deselect all shown rows for Bulk Edit / Deactivate", className: "w-3.5 h-3.5 accent-[#FFB81C] cursor-pointer shrink-0" }),
                                    React.createElement("div", { className: "min-w-0 flex-1 truncate" }, nameField ? React.createElement(SortHeader, { f: nameField, sort: sort, onSort: toggleSort }) : 'Equipment')),
                                React.createElement("div", { role: "separator", "aria-orientation": "vertical", title: "Drag to resize column (double-click to reset)", onPointerDown: function (e) { return startColResize(e, '__name', nameColWidth); }, onDoubleClick: function () { return resetColWidth('__name'); }, className: "absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-[#FFB81C] active:bg-[#FFB81C] z-40" })),
                            columns.map(function (f) {
                                var w = getColWidth(f.name, f.kind);
                                return (React.createElement("th", { key: f.name, scope: "col", style: { width: "".concat(w, "px"), minWidth: "".concat(w, "px"), maxWidth: "".concat(w, "px") }, className: "".concat(headerCell, " z-20 border-r border-[#003366]/60 relative group"), title: f.description ? "".concat(f.description, " (").concat(f.name, ") - Drag right edge to resize") : "".concat(f.name, " - Drag right edge to resize") },
                                    React.createElement("div", { className: "pr-2 truncate" }, ASSET_SORTABLE_KINDS.indexOf(f.kind) !== -1 ? React.createElement(SortHeader, { f: f, sort: sort, onSort: toggleSort }) : f.label),
                                    React.createElement("div", { role: "separator", "aria-orientation": "vertical", title: "Drag to resize ".concat(f.label, " (double-click to reset)"), onPointerDown: function (e) { return startColResize(e, f.name, w); }, onDoubleClick: function () { return resetColWidth(f.name); }, className: "absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-[#FFB81C] active:bg-[#FFB81C] z-30" })));
                            }))),
                    React.createElement("tbody", null,
                        pinnedShown.length > 0 && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: colCount, className: "bg-[#FFF6E0] border-b border-[#FFB81C] px-2 py-1" },
                                React.createElement("span", { className: "sticky left-2 text-[11px] font-bold uppercase tracking-wider text-[#9A6700]" }, "Kept at the top: new, changed or opened from the map")))),
                        pinnedShown.map(renderRow),
                        pinnedShown.length > 0 && pageShown.length > 0 && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: colCount, className: "h-2 bg-slate-100 border-b border-slate-200" }))),
                        pageShown.map(renderRow),
                        !page.loading && !page.error && pinnedShown.length === 0 && pageShown.length === 0 && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: colCount, className: "p-6" },
                                React.createElement("span", { className: "sticky left-6 text-sm text-slate-500" }, words.length || room || placement !== 'all' ? 'No assets match.' : 'No assets yet.'))))))),
                (page.loading || page.next) && ready && (React.createElement("div", { className: "sticky left-0 p-3 flex justify-center" }, page.loading ? React.createElement("span", { className: "text-xs text-slate-500" }, "Loading...") : (React.createElement("button", { type: "button", onClick: showMore, className: "px-4 py-1.5 text-xs font-bold text-[#0072CE] hover:bg-[#E6F1FB] rounded-lg border border-[#B3D4F2]" }, "Show more")))),
                !metaDone && React.createElement("p", { className: "p-4 text-sm text-slate-500" }, "Reading the Assets table..."))),
        drawer && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "absolute inset-0 bg-slate-900/25 z-40", onClick: closeDrawer, "aria-hidden": "true" }),
            React.createElement("aside", { className: "absolute inset-y-0 right-0 z-50 w-full sm:w-[28rem] lg:w-[32rem] bg-white shadow-2xl border-l border-slate-200 flex flex-col", "aria-label": drawer.id ? 'Asset details' : 'New asset', "data-testid": "asset-drawer" },
                confirmClose && (React.createElement("div", { className: "p-3 bg-[#FFF6E0] border-b-2 border-[#FFB81C] text-sm shrink-0", role: "alert" },
                    React.createElement("p", { className: "font-semibold text-slate-800" }, "This asset has unsaved changes."),
                    React.createElement("div", { className: "flex gap-2 mt-2" },
                        React.createElement("button", { type: "button", onClick: function () { var run = confirmClose.run; setConfirmClose(null); run(); }, className: "px-3 py-1 rounded-md text-xs font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, "Discard changes"),
                        React.createElement("button", { type: "button", onClick: function () { return setConfirmClose(null); }, className: "px-3 py-1 rounded-md text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100" }, "Keep editing")))),
                React.createElement(AssetEditor, { key: drawer.id || 'new', meta: meta, set: set, assetId: drawer.id, createLocation: null, mapKey: mapKey, placing: false, refreshToken: drawerRefresh, onRetryMeta: loadAssetMeta, onDirtyChange: setDrawerDirty, onClose: closeDrawer, onSaved: onDrawerSaved, onCreated: onDrawerCreated, onShowOnMap: onShowOnMap, onFilesChanged: function () { if (drawer.id)
                        fileChanged(drawer.id); }, logEvent: logEvent }))))));
}
function SortHeader(_a) {
    var f = _a.f, sort = _a.sort, onSort = _a.onSort;
    var on = sort && sort.name === f.name;
    return (React.createElement("button", { type: "button", onClick: function () { return onSort(f.name); }, className: "inline-flex items-end gap-1 text-left uppercase font-bold hover:text-[#FFB81C]", "aria-label": "Sort by ".concat(f.label).concat(on ? (sort.desc ? ' (now Z to A)' : ' (now A to Z)') : '') },
        React.createElement("span", null, f.label),
        React.createElement("span", { "aria-hidden": "true", className: on ? 'text-[#FFB81C]' : 'text-white/40' }, on ? (sort.desc ? 'v' : '^') : 'v^')));
}
// The Columns list: tick what the table shows, by section
function AssetColumnChooser(_a) {
    var grouped = _a.grouped, shown = _a.shown, onChange = _a.onChange, onDefault = _a.onDefault, onAll = _a.onAll, hasCustomWidths = _a.hasCustomWidths, onResetWidths = _a.onResetWidths, onClose = _a.onClose;
    var sections = grouped.groups.map(function (g) { return ({ key: g.key, title: g.title, items: g.items }); })
        .concat(grouped.info.length ? [{ key: 'info', title: 'Record info', items: grouped.info }] : []);
    var toggle = function (name) { return onChange(shown.indexOf(name) !== -1 ? shown.filter(function (n) { return n !== name; }) : shown.concat([name])); };
    var setSection = function (items, on) {
        var names = items.map(function (f) { return f.name; });
        onChange(on ? shown.concat(names.filter(function (n) { return shown.indexOf(n) === -1; })) : shown.filter(function (n) { return names.indexOf(n) === -1; }));
    };
    // No taller than the room left below it in the view (in the list's own pixels, as the app may be zoomed)
    var boxRef = useRef(null);
    React.useLayoutEffect(function () {
        var el = boxRef.current;
        var view = el && el.closest ? el.closest('[data-assets-table-scroll]') : null;
        if (!view)
            return;
        var r = el.getBoundingClientRect();
        var vr = view.getBoundingClientRect();
        var k = r.height > 0 ? el.offsetHeight / r.height : 1;
        el.style.maxHeight = "min(60vh, ".concat(Math.max(120, Math.floor((vr.bottom - r.top) * k) - 12), "px)");
    });
    return (React.createElement("div", { ref: boxRef, className: "absolute left-0 top-full mt-1 z-[60] w-[min(22rem,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 p-3 space-y-3", role: "dialog", "aria-label": "Columns to show", "data-testid": "column-chooser" },
        React.createElement("div", { className: "flex items-center justify-between gap-2" },
            React.createElement("span", { className: "font-black text-[11px] uppercase tracking-widest text-[#00468B]" }, "Columns"),
            React.createElement("span", { className: "flex items-center gap-3 text-xs font-bold" },
                hasCustomWidths && React.createElement("button", { type: "button", onClick: onResetWidths, className: "text-[#0072CE] underline" }, "Reset widths"),
                React.createElement("button", { type: "button", onClick: onDefault, className: "text-[#0072CE] underline" }, "Default"),
                React.createElement("button", { type: "button", onClick: onAll, className: "text-[#0072CE] underline" }, "All"),
                React.createElement("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-[#E4002B]", "aria-label": "Close the column list" },
                    React.createElement(X, { className: "w-4 h-4" })))),
        sections.map(function (s) {
            var on = s.items.filter(function (f) { return shown.indexOf(f.name) !== -1; }).length;
            return (React.createElement("div", { key: s.key, role: "group", "aria-label": s.title },
                React.createElement("div", { className: "flex items-center justify-between gap-2 text-xs font-bold text-slate-700" },
                    React.createElement("span", null,
                        s.title,
                        " ",
                        React.createElement("span", { className: "text-slate-400 font-semibold" },
                            "(",
                            on,
                            "/",
                            s.items.length,
                            ")")),
                    React.createElement("button", { type: "button", onClick: function () { return setSection(s.items, on < s.items.length); }, className: "text-[#0072CE] underline" }, on < s.items.length ? 'Show all' : 'Hide all')),
                React.createElement("div", { className: "mt-1 grid grid-cols-2 gap-x-2 gap-y-1" }, s.items.map(function (f) { return (React.createElement("label", { key: f.name, className: "flex items-center gap-1.5 text-xs text-slate-700 min-w-0 cursor-pointer", title: f.name },
                    React.createElement("input", { type: "checkbox", checked: shown.indexOf(f.name) !== -1, onChange: function () { return toggle(f.name); }, className: "accent-[#0072CE] shrink-0" }),
                    React.createElement("span", { className: "truncate" }, f.label))); }))));
        })));
}
// One row of the table. Drawn again only when its own data changes.
var AssetTableRow = React.memo(function AssetTableRow(_a) {
    var id = _a.id, entry = _a.entry, selected = _a.selected, columns = _a.columns, nameField = _a.nameField, nameColWidth = _a.nameColWidth, getColWidth = _a.getColWidth, byName = _a.byName, mapColumn = _a.mapColumn, mapKey = _a.mapKey, set = _a.set, highlight = _a.highlight, locked = _a.locked, actions = _a.actions, logEvent = _a.logEvent;
    var _b = useState(false), confirmDeact = _b[0], setConfirmDeact = _b[1];
    var row = entry.row;
    var inactive = row.statecode === 1;
    var saving = entry.status === 'saving';
    var disabled = saving || locked;
    var changed = changedAssetFields(entry, byName);
    var changedNames = {};
    changed.forEach(function (f) { changedNames[f.name] = true; });
    var dirty = changed.length > 0;
    var valueOf = function (f) { return (entry.edits[f.name] ? entry.edits[f.name].value : toEditValue(f, row)); };
    var name = nameField ? String(valueOf(nameField) || '') : '';
    var label = (row[ASSET_NAME_COLUMN] || '').trim() || name.trim() || '(no name)';
    var location = mapColumn ? parseMapLocation(row[mapColumn]) : null;
    var onMap = pinOnMap(location, mapKey);
    var bg = highlight ? 'bg-[#FFF6E0]' : (selected ? 'bg-[#E6F1FB]/70' : (dirty ? 'bg-[#FFFBEB]' : (inactive ? 'bg-slate-50' : 'bg-white')));
    var stickyBg = highlight ? 'bg-[#FFF6E0]' : (selected ? 'bg-[#E6F1FB]' : (dirty ? 'bg-[#FFFBEB]' : (inactive ? 'bg-slate-50' : 'bg-white')));
    var nameEditable = !!nameField && isEditableField(nameField, false);
    var iconButton = 'p-1 rounded hover:bg-[#E6F1FB] shrink-0 disabled:opacity-40';
    var statusLine = null;
    if (saving)
        statusLine = React.createElement("span", { className: "text-slate-600" }, entry.message || 'Saving...');
    else if (locked)
        statusLine = React.createElement("span", { className: "text-slate-500" }, "Open in Details.");
    else if (entry.status === 'stale') {
        statusLine = (React.createElement(React.Fragment, null,
            React.createElement("span", { className: "text-[#C4001F]" }, entry.message),
            React.createElement("button", { type: "button", onClick: function () { return actions.reload(id); }, className: "font-bold text-[#0072CE] underline" }, "Reload row"),
            React.createElement("button", { type: "button", onClick: function () { return actions.save(id, true); }, className: "font-bold text-[#C4001F] underline" }, "Save mine anyway")));
    }
    else if (dirty || entry.message) {
        statusLine = (React.createElement(React.Fragment, null,
            entry.message && React.createElement("span", { className: entry.status === 'error' ? 'text-[#C4001F]' : (entry.status === 'saved' ? 'text-green-700' : 'text-[#9A6700]') }, entry.message),
            dirty && React.createElement("span", { className: "text-slate-600" },
                changed.length,
                " change",
                changed.length === 1 ? '' : 's'),
            dirty && React.createElement("button", { type: "button", onClick: function () { return actions.save(id, false); }, "aria-label": "Save ".concat(label), className: "px-2 py-0.5 rounded font-bold bg-[#0072CE] text-white hover:bg-[#00468B]" }, "Save"),
            dirty && React.createElement("button", { type: "button", onClick: function () { return actions.undo(id); }, "aria-label": "Undo the changes to ".concat(label), className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" }, "Undo")));
    }
    return (React.createElement("tr", { "data-row-id": id, className: "".concat(bg, " ").concat(highlight ? 'outline outline-2 outline-[#FFB81C]' : ''), "aria-busy": saving },
        React.createElement("td", { style: { width: "".concat(nameColWidth, "px"), minWidth: "".concat(nameColWidth, "px"), maxWidth: "".concat(nameColWidth, "px") }, className: "sticky left-0 z-10 ".concat(stickyBg, " border-b border-r border-slate-200 p-1 align-top") },
            React.createElement("div", { className: "flex items-start gap-1" },
                React.createElement("input", { type: "checkbox", checked: selected, onChange: function () { return actions.toggleSelect(id); }, "aria-label": "Select ".concat(label), className: "mt-1.5 w-3.5 h-3.5 accent-[#0072CE] cursor-pointer shrink-0" }),
                nameEditable ? (React.createElement("input", { value: name, onChange: function (e) { return actions.setCell(id, nameField.name, e.target.value); }, disabled: disabled, "aria-label": "".concat(nameField.label, ", ").concat(label), className: "".concat(ASSET_CELL_INPUT, " font-semibold ").concat(inactive ? 'text-slate-500 line-through' : 'text-[#00468B]', " min-w-0 ").concat(entry.errors[nameField.name] ? 'border-[#E4002B] bg-white' : '', " ").concat(changedNames[nameField.name] ? 'bg-[#FFF6E0]' : '') })) : (React.createElement("span", { className: "flex-1 min-w-0 px-1.5 py-1 font-semibold ".concat(inactive ? 'text-slate-500 line-through' : 'text-[#00468B]', " truncate"), title: label }, label)),
                React.createElement("button", { type: "button", onClick: function () { return actions.details(id); }, className: "".concat(iconButton, " text-[#0072CE]"), title: "Details: every column of this asset", "aria-label": "Details of ".concat(label) },
                    React.createElement(PencilIcon, { className: "w-4 h-4" })),
                React.createElement("button", { type: "button", onClick: function () { return actions.showOnMap(id); }, className: "".concat(iconButton, " ").concat(onMap ? 'text-[#0072CE]' : 'text-slate-400'), title: onMap ? 'Show on the map' : (location ? "On another map (".concat(location.map, ")") : 'Not on the map yet: open it on the map to place it'), "aria-label": "Show ".concat(label, " on the map"), "data-on-map": onMap ? 'true' : 'false' },
                    React.createElement(MapPin, { className: "w-4 h-4", fill: onMap ? 'currentColor' : 'none' }))),
            React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 px-1.5 pt-0.5 text-[11px]" }, inactive ? (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "px-1.5 py-0.2 rounded bg-red-100 text-[#C4001F] font-bold uppercase tracking-wider text-[10px]" }, "Deactivated"),
                React.createElement("button", { type: "button", disabled: disabled, onClick: function () { return actions.toggleActive(id, true); }, className: "font-bold text-emerald-700 hover:underline disabled:opacity-50" }, "Reactivate"))) : !confirmDeact ? (React.createElement("button", { type: "button", disabled: disabled, onClick: function () { return setConfirmDeact(true); }, className: "text-slate-400 hover:text-[#C4001F] font-semibold" }, "Deactivate")) : (React.createElement("span", { className: "inline-flex items-center gap-1 bg-[#FFF6E0] border border-[#FFB81C] rounded px-1.5 py-0.5" },
                React.createElement("span", { className: "text-slate-800 font-semibold" }, "Deactivate?"),
                React.createElement("button", { type: "button", disabled: disabled, onClick: function () { setConfirmDeact(false); actions.toggleActive(id, false); }, className: "font-bold text-[#C4001F] underline" }, "Yes"),
                React.createElement("button", { type: "button", onClick: function () { return setConfirmDeact(false); }, className: "font-bold text-slate-600 underline" }, "No")))),
            nameField && entry.errors[nameField.name] && React.createElement("p", { className: "text-[11px] text-[#C4001F] px-1.5", role: "alert" }, entry.errors[nameField.name]),
            statusLine && React.createElement("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1 px-1.5 pt-0.5 text-[11px]", "data-row-status": true }, statusLine)),
        columns.map(function (f) {
            var w = getColWidth(f.name, f.kind);
            return (React.createElement("td", { key: f.name, "data-cell": "".concat(id, ":").concat(f.name), style: { width: "".concat(w, "px"), minWidth: "".concat(w, "px"), maxWidth: "".concat(w, "px") }, className: "border-b border-r border-slate-100 p-1 align-top overflow-hidden ".concat(changedNames[f.name] ? 'bg-[#FFF6E0]' : '') }, (f.kind === 'file' || f.kind === 'image') ? (React.createElement(AssetFileField, { variant: "cell", assetLabel: label, f: f, row: row, set: set, assetId: id, isNew: false, canWrite: f.canUpdate && !disabled, onChanged: function () { return actions.fileChanged(id); }, logEvent: logEvent })) : (React.createElement(AssetCell, { f: f, value: valueOf(f), row: row, error: entry.errors[f.name], readOnly: !isEditableField(f, false), disabled: disabled, label: "".concat(f.label, ", ").concat(label), onChange: function (v) { return actions.setCell(id, f.name, v); } }))));
        })));
});
// One cell, by the column's type
function AssetCell(_a) {
    var f = _a.f, value = _a.value, row = _a.row, error = _a.error, readOnly = _a.readOnly, disabled = _a.disabled, label = _a.label, onChange = _a.onChange;
    var cls = "".concat(ASSET_CELL_INPUT, " ").concat(error ? 'border-[#E4002B] bg-white' : '');
    var err = error ? React.createElement("p", { className: "text-[11px] text-[#C4001F] px-1.5", role: "alert" }, error) : null;
    if (readOnly || (f.kind === 'lookup' && disabled)) {
        var shown = f.kind === 'lookup' && value && value.id ? (value.name || value.id) : displayValue(f, row);
        return React.createElement("div", { className: "px-1.5 py-1 text-sm text-slate-600 truncate max-w-[18rem]", title: shown || undefined }, shown || React.createElement("span", { className: "text-slate-300" }, "-"));
    }
    var control;
    switch (f.kind) {
        case 'bool':
            control = (React.createElement("label", { className: "flex justify-center py-1 cursor-pointer", title: value === true ? (f.trueLabel || 'Yes') : (value === false ? (f.falseLabel || 'No') : 'Not set') },
                React.createElement("input", { type: "checkbox", checked: value === true, disabled: disabled, onChange: function (e) { return onChange(e.target.checked); }, "aria-label": label, className: "w-4 h-4 accent-[#0072CE] cursor-pointer" })));
            break;
        case 'memo':
            control = React.createElement("textarea", { rows: 1, value: value, onChange: function (e) { return onChange(e.target.value); }, disabled: disabled, "aria-label": label, className: "".concat(cls, " resize-y min-h-[2rem] block") });
            break;
        case 'int':
        case 'number':
            control = React.createElement("input", { type: "text", inputMode: f.kind === 'int' ? 'numeric' : 'decimal', value: value, onChange: function (e) { return onChange(e.target.value); }, disabled: disabled, "aria-label": label, className: "".concat(cls, " text-right tabular-nums") });
            break;
        case 'choice':
            control = (React.createElement("select", { value: value, onChange: function (e) { return onChange(e.target.value); }, disabled: disabled, "aria-label": label, className: cls },
                React.createElement("option", { value: "" }, "-"),
                f.options.map(function (o) { return React.createElement("option", { key: o.value, value: String(o.value) }, o.label); })));
            break;
        case 'choices':
            control = React.createElement(ChoicesCell, { f: f, value: value, disabled: disabled, label: label, onChange: onChange });
            break;
        case 'date':
            control = React.createElement("input", { type: f.dateOnly ? 'date' : 'datetime-local', value: value, onChange: function (e) { return onChange(e.target.value); }, disabled: disabled, "aria-label": label, className: cls });
            break;
        case 'lookup':
            control = React.createElement("div", { className: "px-1.5 py-1 text-sm" },
                React.createElement(LookupField, { id: undefined, f: f, value: value, onChange: onChange, label: label }));
            break;
        default: {
            var type = f.format === 'Email' ? 'email' : (f.format === 'Url' ? 'url' : (f.format === 'Phone' ? 'tel' : 'text'));
            var over = f.maxLength && String(value || '').length > f.maxLength;
            control = React.createElement("input", { type: type, value: value, onChange: function (e) { return onChange(e.target.value); }, disabled: disabled, "aria-label": label, className: "".concat(cls, " ").concat(over ? 'border-[#E4002B]' : ''), title: over ? "At most ".concat(f.maxLength, " characters") : undefined });
        }
    }
    return React.createElement("div", null,
        control,
        err);
}
// Multi-select choices in a cell: the picked ones, and a list to tick when opened
function ChoicesCell(_a) {
    var f = _a.f, value = _a.value, disabled = _a.disabled, label = _a.label, onChange = _a.onChange;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var list = value || [];
    var picked = f.options.filter(function (o) { return list.indexOf(String(o.value)) !== -1; }).map(function (o) { return o.label; });
    return (React.createElement("div", null,
        React.createElement("button", { type: "button", disabled: disabled, onClick: function () { return setOpen(function (o) { return !o; }); }, "aria-expanded": open, "aria-label": "".concat(label, ": ").concat(picked.length ? picked.join(', ') : 'none'), className: "".concat(ASSET_CELL_INPUT, " text-left truncate") }, picked.length ? picked.join(', ') : React.createElement("span", { className: "text-slate-300" }, "-")),
        open && !disabled && (React.createElement("div", { className: "mt-1 flex flex-wrap gap-1 px-1" },
            f.options.map(function (o) {
                var key = String(o.value);
                var on = list.indexOf(key) !== -1;
                return (React.createElement("button", { key: key, type: "button", "aria-pressed": on, onClick: function () { return onChange(on ? list.filter(function (v) { return v !== key; }) : list.concat([key])); }, className: "px-2 py-0.5 rounded-full text-[11px] font-semibold border ".concat(on ? 'bg-[#00468B] text-white border-[#00468B]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100') }, o.label));
            }),
            React.createElement("button", { type: "button", onClick: function () { return setOpen(false); }, className: "text-[11px] font-bold text-[#0072CE] underline" }, "Done")))));
}
// What smart snap made of a click or a dragged box
function SpotNote(_a) {
    var spot = _a.spot;
    var text;
    var failed = spot.note && spot.note.indexOf('error:') === 0 ? spot.note.slice(6) : '';
    if (spot.how === 'box') {
        if (spot.snapped)
            text = 'Smart snap fitted the box to the black lines inside it (highlighted).';
        else if (spot.note === 'nolines')
            text = 'No black lines in the box, so the box you drew is used.';
        else if (spot.note === 'nomap')
            text = 'There is no map picture to snap to, so the box you drew is used.';
        else if (failed)
            text = "Smart snap is not available (".concat(failed, "), so the box you drew is used.");
        else
            text = 'The box you drew is used.';
    }
    else if (spot.snapped)
        text = spot.region && spot.region.kind === 'shape' ? 'Smart snap picked the solid shape you clicked (highlighted).' : (spot.region && spot.region.inside ? 'Smart snap found the outlined area you clicked in (highlighted).' : 'Smart snap found the outlined area next to your click (highlighted). The pin goes in its middle.');
    else if (spot.note === 'none')
        text = 'No closed outline here, so the pin goes exactly where you clicked. Drag a box around it to fit it to the lines instead.';
    else if (spot.note === 'nomap')
        text = 'There is no map picture to snap to, so the pin goes where you clicked.';
    else if (failed)
        text = "Smart snap is not available (".concat(failed, "), so the pin goes where you clicked.");
    else
        text = 'The pin goes exactly where you clicked.';
    return React.createElement("p", { className: "text-sm text-slate-700", "data-testid": "spot-note" }, text);
}
// ==========================================
// ASSET LIST (search results, never the whole table)
// ==========================================
function AssetBrowser(_a) {
    var meta = _a.meta, list = _a.list, words = _a.words, searching = _a.searching, placement = _a.placement, setPlacement = _a.setPlacement, room = _a.room, setRoom = _a.setRoom, rooms = _a.rooms, mapColumn = _a.mapColumn, mapKey = _a.mapKey, onShowMore = _a.onShowMore, onOpen = _a.onOpen, onNew = _a.onNew;
    var title = words.length || room || placement !== 'all' ? 'Matching assets' : 'Recently changed assets';
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "p-3 border-b-2 border-[#E6F1FB] flex items-center justify-between gap-2 shrink-0" },
            React.createElement("span", { className: "font-black text-[11px] uppercase tracking-widest text-[#00468B]" }, title),
            React.createElement("button", { type: "button", onClick: onNew, disabled: meta.status !== 'ready', title: "New assets are restricted to the Microsoft Form or the Asset Management tab", className: "bg-[#0072CE] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#00468B] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" }, "Asset Management")),
        React.createElement("div", { className: "px-3 py-2 border-b border-slate-100 flex flex-wrap items-center gap-2 shrink-0" },
            mapColumn && (React.createElement("div", { className: "inline-flex shrink-0 rounded-full border border-[#B3D4F2] bg-white p-0.5", role: "group", "aria-label": "Filter by map spot" }, [['all', 'All'], ['placed', 'On the map'], ['unplaced', 'Not on the map']].map(function (_a) {
                var key = _a[0], label = _a[1];
                return (React.createElement("button", { key: key, type: "button", onClick: function () { return setPlacement(key); }, "aria-pressed": placement === key, className: "px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ".concat(placement === key ? 'bg-[#00468B] text-white' : 'text-[#00468B] hover:bg-[#E6F1FB]') }, label));
            }))),
            rooms.length > 0 && (React.createElement("label", { className: "flex items-center gap-1 text-xs text-slate-600" },
                React.createElement("span", { className: "sr-only" }, "Room"),
                React.createElement("select", { value: room, onChange: function (e) { return setRoom(e.target.value); }, className: "border border-slate-300 rounded-md px-2 py-1 text-xs bg-white max-w-[11rem]" },
                    React.createElement("option", { value: "" }, "Every room"),
                    rooms.map(function (r) { return React.createElement("option", { key: r, value: r }, r); }))))),
        React.createElement("div", { className: "flex-1 overflow-y-auto p-2 space-y-1.5", "aria-busy": list.loading || searching },
            list.error && (React.createElement("p", { className: "text-xs text-[#C4001F] p-2", role: "alert" },
                "The assets could not be loaded: ",
                list.error)),
            list.rows.map(function (a) {
                var placed = pinOnMap(a.location, mapKey);
                return (React.createElement("button", { type: "button", key: a.id, onClick: function () { return onOpen(a); }, className: "w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-[#0072CE]/40 hover:bg-[#E6F1FB] transition-colors shadow-sm", "data-asset-row": a.id },
                    React.createElement("span", { className: "flex items-start justify-between gap-2" },
                        React.createElement("span", { className: "font-semibold text-sm text-[#00468B] [overflow-wrap:anywhere]" }, a.name),
                        placed && React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E6F1FB] text-[#00468B] border border-[#B3D4F2] shrink-0" }, "On map"),
                        !placed && a.location && React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0" }, "Other map")),
                    React.createElement("span", { className: "block text-xs text-slate-500 mt-0.5" }, [a.room, a.area].filter(Boolean).join(' - ') || 'No room or area')));
            }),
            !list.loading && !list.error && list.rows.length === 0 && (React.createElement("p", { className: "text-xs text-slate-500 text-center p-4" }, words.length || room || placement !== 'all' ? 'No assets match.' : 'No assets yet.')),
            list.loading && React.createElement("p", { className: "text-xs text-slate-500 text-center p-2" }, "Loading..."),
            !list.loading && list.next && (React.createElement("button", { type: "button", onClick: onShowMore, className: "w-full py-2 text-xs font-bold text-[#0072CE] hover:bg-[#E6F1FB] rounded-lg" }, "Show more")))));
}
// ==========================================
// "ASSIGN THIS SPOT": pick the asset for a clicked spot, or create one there
// ==========================================
function AssignSpot(_a) {
    var _this = this;
    var spot = _a.spot, set = _a.set, mapColumn = _a.mapColumn, mapReason = _a.mapReason, canCreate = _a.canCreate, onAssign = _a.onAssign, onCreate = _a.onCreate, onCancel = _a.onCancel, logEvent = _a.logEvent;
    var _b = useState(''), text = _b[0], setText = _b[1];
    var _c = useState({ rows: [], loading: true, error: '', recent: true }), res = _c[0], setRes = _c[1];
    var _d = useState(''), busyId = _d[0], setBusyId = _d[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    var req = useRef(0);
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    useEffect(function () {
        if (!mapColumn)
            return undefined;
        var words = text.trim().split(/\s+/).filter(Boolean).slice(0, 4);
        var t = setTimeout(function () {
            var r = req.current + 1;
            req.current = r;
            setRes(function (p) { return (__assign(__assign({}, p), { loading: true, error: '' })); });
            // Nothing typed: the latest changed assets that are not on the map yet
            fetchAssetPage({ set: set, words: words, mapColumn: mapColumn, placement: words.length ? 'all' : 'unplaced', pageSize: 25 })
                .then(function (page) { if (r === req.current && mounted.current)
                setRes({ rows: page.rows, loading: false, error: '', recent: words.length === 0 }); })
                .catch(function (e) { if (r === req.current && mounted.current)
                setRes({ rows: [], loading: false, error: e.message, recent: words.length === 0 }); });
        }, words.length ? 300 : 0);
        return function () { return clearTimeout(t); };
    }, [text, set, mapColumn]);
    var assign = function (asset) { return __awaiter(_this, void 0, void 0, function () {
        var e_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (busyId)
                        return [2 /*return*/];
                    setBusyId(asset.id);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onAssign(asset)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_19 = _a.sent();
                    logEvent("Could not put ".concat(asset.name, " on the map: ").concat(e_19.message), 'error');
                    if (mounted.current)
                        setError("Not saved: ".concat(e_19.message));
                    return [3 /*break*/, 5];
                case 4:
                    if (mounted.current)
                        setBusyId('');
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "flex flex-col flex-1 min-h-0" },
        React.createElement("div", { className: "p-3 border-b-2 border-[#E6F1FB] flex items-center justify-between gap-2 shrink-0" },
            React.createElement("span", { className: "font-black text-[11px] uppercase tracking-widest text-[#00468B]" }, "This spot"),
            React.createElement("button", { type: "button", onClick: onCancel, className: "text-slate-400 hover:text-[#E4002B]", "aria-label": "Cancel this spot" },
                React.createElement(X, { className: "w-5 h-5" }))),
        React.createElement("div", { className: "p-3 space-y-3 overflow-y-auto flex-1" }, !mapColumn ? (React.createElement("p", { className: "text-sm text-[#9A6700] bg-[#FFF6E0] border border-[#FFB81C] rounded-md p-2" },
            "Assets cannot be placed yet: ",
            mapReason)) : (React.createElement(React.Fragment, null,
            React.createElement(SpotNote, { spot: spot }),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "assign-search", className: "block text-xs font-bold text-slate-600 mb-1" }, "Which asset is here?"),
                React.createElement(SearchBox, { query: text, onQuery: setText, placeholder: "Search name, room, area...", ariaLabel: "Search the asset for this spot" })),
            error && React.createElement("p", { className: "text-xs text-[#C4001F]", role: "alert" }, error),
            res.error && React.createElement("p", { className: "text-xs text-[#C4001F]", role: "alert" },
                "The assets could not be loaded: ",
                res.error),
            React.createElement("div", { className: "space-y-1.5" },
                res.recent && res.rows.length > 0 && React.createElement("p", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-500" }, "Not on the map yet (latest changed)"),
                res.rows.map(function (a) { return (React.createElement("div", { key: a.id, className: "flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-100" },
                    React.createElement("span", { className: "min-w-0" },
                        React.createElement("span", { className: "block font-semibold text-sm text-[#00468B] [overflow-wrap:anywhere]" }, a.name),
                        React.createElement("span", { className: "block text-xs text-slate-500" },
                            [a.room, a.area].filter(Boolean).join(' - ') || 'No room or area',
                            a.location ? ' - already on the map' : '')),
                    React.createElement("button", { type: "button", onClick: function () { return assign(a); }, disabled: !!busyId, className: "shrink-0 bg-[#0072CE] text-white px-2.5 py-1 rounded-md text-xs font-bold hover:bg-[#00468B] disabled:opacity-50", title: a.location ? 'Moves the pin of this asset here' : 'Puts this asset here' }, busyId === a.id ? 'Saving...' : (a.location ? 'Move here' : 'Put here')))); }),
                res.loading && React.createElement("p", { className: "text-xs text-slate-500" }, "Loading..."),
                !res.loading && !res.error && res.rows.length === 0 && (React.createElement("p", { className: "text-xs text-slate-500" }, res.recent ? 'Every asset is already on the map. Search to move one here.' : 'No assets match.')))))),
        React.createElement("div", { className: "p-3 border-t border-slate-100 shrink-0 space-y-2" },
            React.createElement("p", { className: "text-[11px] text-slate-500" }, "New assets are restricted to the Microsoft Form or the Asset Management tab."),
            React.createElement("div", { className: "flex flex-wrap gap-2" },
                React.createElement("button", { type: "button", onClick: onCreate, disabled: !canCreate, className: "bg-[#00468B] text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-[#003366] disabled:opacity-50" }, "Open Asset Management"),
                React.createElement("button", { type: "button", onClick: onCancel, className: "px-3 py-1.5 rounded-md text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100" }, "Cancel")))));
}
// ==========================================
// ASSET EDITOR: every column of one asset, by type. New assets too.
// ==========================================
// On the map (new assets only) it gets onPlace / onClearNewSpot; in the equipment table it gets onShowOnMap and onFilesChanged.
function AssetEditor(_a) {
    var _this = this;
    var meta = _a.meta, set = _a.set, assetId = _a.assetId, createLocation = _a.createLocation, mapKey = _a.mapKey, placing = _a.placing, refreshToken = _a.refreshToken, onRetryMeta = _a.onRetryMeta, onDirtyChange = _a.onDirtyChange, onClose = _a.onClose, onSaved = _a.onSaved, onCreated = _a.onCreated, onPlace = _a.onPlace, onClearNewSpot = _a.onClearNewSpot, onShowOnMap = _a.onShowOnMap, onFilesChanged = _a.onFilesChanged, logEvent = _a.logEvent;
    var isNew = !assetId;
    var mapColumn = meta.mapColumn ? meta.mapColumn.name : null;
    // The map column has its own buttons; the id is shown under Record info
    var fields = useMemo(function () { return meta.fields.filter(function (f) { return f.name !== mapColumn && (!isNew || isEditableField(f, true)); }); }, [meta.fields, mapColumn, isNew]);
    var editable = useMemo(function () { return fields.filter(function (f) { return isEditableField(f, isNew); }); }, [fields, isNew]);
    var emptyForm = function () {
        var v = {};
        fields.forEach(function (f) { v[f.name] = emptyValue(f); });
        return { initial: v, values: __assign({}, v) };
    };
    var _b = useState({ status: isNew ? 'ready' : 'loading', error: '', row: null, etag: '' }), load = _b[0], setLoad = _b[1];
    var _c = useState(emptyForm), form = _c[0], setForm = _c[1];
    var formRef = useRef(form);
    formRef.current = form;
    var clashRef = useRef(false); // kept until the next save or full reload
    var imageColumns = useMemo(function () { return fields.filter(function (f) { return f.kind === 'image'; }).map(function (f) { return f.name; }); }, [fields]);
    var rowRef = useRef(null);
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    var _f = useState(false), saving = _f[0], setSaving = _f[1];
    var _g = useState(''), saveError = _g[0], setSaveError = _g[1];
    var _h = useState(false), stale = _h[0], setStale = _h[1];
    var _j = useState(''), notice = _j[0], setNotice = _j[1];
    var _k = useState(false), confirmDeact = _k[0], setConfirmDeact = _k[1];
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    // Server values in; with keepEdits the fields the user has changed keep the user's text
    var applyRow = useCallback(function (fresh, keepEdits) {
        // A save's answer has no image columns: keep what the last full read said about them
        var row = __assign({}, fresh);
        imageColumns.forEach(function (c) { if (row[c] === undefined && rowRef.current)
            row[c] = rowRef.current[c]; });
        rowRef.current = row;
        var server = {};
        fields.forEach(function (f) { server[f.name] = toEditValue(f, row); });
        // Someone else changed a field the user is still editing: keep the version the edit started from, so Save
        // reports the clash ("Someone else changed this asset") instead of quietly writing over their change
        var clash = false;
        if (keepEdits) {
            var prev_1 = formRef.current;
            fields.forEach(function (f) {
                var was = editKey(f, prev_1.initial[f.name]);
                var mine = editKey(f, prev_1.values[f.name]);
                var now = editKey(f, server[f.name]);
                if (mine !== was && now !== was && now !== mine)
                    clash = true;
            });
        }
        setForm(function (prev) {
            var values = __assign({}, server);
            if (keepEdits) {
                fields.forEach(function (f) {
                    if (editKey(f, prev.values[f.name]) !== editKey(f, prev.initial[f.name]))
                        values[f.name] = prev.values[f.name];
                });
            }
            return { initial: server, values: values };
        });
        if (!keepEdits)
            clashRef.current = false;
        else if (clash)
            clashRef.current = true;
        var keepEtag = clashRef.current;
        setLoad(function (l) { return ({ status: 'ready', error: '', row: row, etag: keepEtag && l.etag ? l.etag : (row['@odata.etag'] || '') }); });
    }, [fields, imageColumns]);
    var reload = useCallback(function (keepEdits) { return __awaiter(_this, void 0, void 0, function () {
        var row_5, error_31;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isNew)
                        return [2 /*return*/];
                    if (!keepEdits)
                        setLoad(function (l) { return (__assign(__assign({}, l), { status: 'loading', error: '' })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadAssetRow(set, assetId, imageColumns)];
                case 2:
                    row_5 = _a.sent();
                    if (mounted.current)
                        applyRow(row_5, keepEdits);
                    return [3 /*break*/, 4];
                case 3:
                    error_31 = _a.sent();
                    logEvent("Asset ".concat(assetId, " could not be read: ").concat(error_31.message), 'error');
                    if (!mounted.current)
                        return [2 /*return*/];
                    if (keepEdits)
                        setNotice("Could not refresh this asset: ".concat(error_31.message));
                    else
                        setLoad({ status: 'error', error: error_31.message, row: null, etag: '' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [isNew, set, assetId, applyRow, imageColumns, logEvent]);
    // The first read fills the form; when the columns are read again later (Check again, a column pick) the row is read again
    // keeping what is being typed
    var loadedOnce = useRef(false);
    useEffect(function () {
        if (meta.fields.length === 0)
            return;
        var keep = loadedOnce.current;
        loadedOnce.current = true;
        reload(keep);
    }, [reload, meta.fields.length]);
    // A spot or file saved elsewhere changed the row: read it again, keep what is being typed
    useEffect(function () {
        if (refreshToken)
            reload(true);
    }, [refreshToken]); // eslint-disable-line react-hooks/exhaustive-deps
    var changed = editable.filter(function (f) { return editKey(f, form.values[f.name]) !== editKey(f, form.initial[f.name]); });
    var isDirty = changed.length > 0;
    useEffect(function () { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);
    useEffect(function () { return function () { return onDirtyChange(false); }; }, [onDirtyChange]);
    var setValue = function (name, value) {
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { values: __assign(__assign({}, prev.values), (_a = {}, _a[name] = value, _a)) }));
        });
        setErrors(function (prev) {
            var _a;
            return (prev[name] ? __assign(__assign({}, prev), (_a = {}, _a[name] = '', _a)) : prev);
        });
        setNotice('');
    };
    var save = function (force) { return __awaiter(_this, void 0, void 0, function () {
        var toCheck, errs, payload, row_6, row_7, error_32;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (saving)
                        return [2 /*return*/];
                    toCheck = isNew ? editable : changed;
                    errs = {};
                    toCheck.forEach(function (f) { var msg = validateField(f, form.values[f.name]); if (msg)
                        errs[f.name] = msg; });
                    setErrors(errs);
                    if (Object.keys(errs).length > 0) {
                        setSaveError('Fix the marked fields first.');
                        return [2 /*return*/];
                    }
                    payload = {};
                    changed.forEach(function (f) { var kv = toPayloadEntry(f, form.values[f.name]); payload[kv[0]] = kv[1]; });
                    if (isNew && createLocation && mapColumn)
                        payload[mapColumn] = mapLocationText(createLocation, mapKey, meta.mapColumn.maxLength);
                    if (!isNew && Object.keys(payload).length === 0)
                        return [2 /*return*/];
                    setSaving(true);
                    setSaveError('');
                    setStale(false);
                    setNotice('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!isNew) return [3 /*break*/, 3];
                    return [4 /*yield*/, createAsset(set, payload, logEvent)];
                case 2:
                    row_6 = _a.sent();
                    if (mounted.current)
                        onCreated(row_6);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, patchAsset(set, assetId, payload, force ? '*' : load.etag, logEvent)];
                case 4:
                    row_7 = _a.sent();
                    logEvent("Saved asset ".concat(assetId, " (").concat(changed.length, " column").concat(changed.length === 1 ? '' : 's', ")."), 'success');
                    if (!mounted.current)
                        return [2 /*return*/];
                    applyRow(row_7, false);
                    setNotice('Saved.');
                    onSaved(row_7);
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_32 = _a.sent();
                    logEvent("Asset ".concat(isNew ? 'create' : 'save', " failed: ").concat(error_32.message), 'error', payload);
                    if (!mounted.current)
                        return [2 /*return*/];
                    if (error_32.stale) {
                        setStale(true);
                        setSaveError('Someone else changed this asset after you opened it. Reload to see their version (your changes here are dropped), or save yours over it.');
                    }
                    else {
                        setSaveError("Not saved: ".concat(error_32.message));
                    }
                    return [3 /*break*/, 8];
                case 7:
                    if (mounted.current)
                        setSaving(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var discard = function () {
        setForm(function (prev) { return ({ initial: prev.initial, values: __assign({}, prev.initial) }); });
        // Nothing of the user's is left to clash with the newer version on screen
        clashRef.current = false;
        setLoad(function (l) { return (__assign(__assign({}, l), { etag: (l.row && l.row['@odata.etag']) || l.etag })); });
        setErrors({});
        setSaveError('');
        setStale(false);
    };
    var row = load.row;
    var nameField = fields.find(function (f) { return f.isPrimaryName; });
    var liveName = nameField ? String(form.values[nameField.name] || '').trim() : '';
    var title = liveName || (isNew ? 'New asset' : '(no name)');
    var placeText = [form.values.craa5_roomname, form.values.craa5_areaname].filter(function (v) { return v && String(v).trim(); }).join(' - ');
    var location = isNew ? createLocation : (row && mapColumn ? parseMapLocation(row[mapColumn]) : null);
    var onThisMap = pinOnMap(location, mapKey);
    if (meta.fields.length === 0) {
        return (React.createElement("div", { className: "flex-1 p-4 space-y-3" },
            React.createElement(EditorHeader, { title: isNew ? 'New asset' : 'Asset', subtitle: "", onClose: onClose, isNew: isNew }),
            meta.status === 'error' ? (React.createElement("div", { className: "text-sm text-[#C4001F]", role: "alert" },
                "The Assets table's columns could not be read: ",
                meta.error,
                React.createElement("div", null,
                    React.createElement("button", { type: "button", onClick: onRetryMeta, className: "mt-2 text-[#0072CE] underline" }, "Try again")))) : React.createElement("p", { className: "text-sm text-slate-500" }, "Reading the Assets table...")));
    }
    var _l = groupAssetFields(fields), groups = _l.groups, info = _l.info;
    return (React.createElement("div", { className: "flex flex-col flex-1 min-h-0", "data-testid": "asset-editor" },
        React.createElement("div", { className: "p-4 border-b-2 border-[#E6F1FB] shrink-0 space-y-2" },
            React.createElement(EditorHeader, { title: title, subtitle: placeText, onClose: onClose, isNew: isNew }),
            React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-xs" }, !mapColumn ? (React.createElement("span", { className: "text-[#9A6700]" },
                "Map spot: ",
                meta.mapReason)) : placing ? (React.createElement("span", { className: "font-semibold text-[#00468B]" }, "Click the map where this asset is...")) : isNew ? (onPlace ? (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "font-semibold ".concat(createLocation ? 'text-[#00468B]' : 'text-slate-500') }, createLocation ? 'Goes on the map at the highlighted spot.' : 'Not on the map.'),
                React.createElement("button", { type: "button", onClick: function () { return onPlace({ id: 'new', name: title }); }, className: "px-2 py-1 rounded-md font-bold border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB]" }, createLocation ? 'Pick another spot' : 'Pick a spot on the map'),
                createLocation && React.createElement("button", { type: "button", onClick: onClearNewSpot, className: "px-2 py-1 rounded-md font-bold border border-slate-300 text-slate-600 hover:bg-slate-100" }, "No spot"))) : (React.createElement("span", { className: "text-slate-500" }, "Not on the map. Once it is created, \"Open on map\" takes you there to place it."))) : load.status !== 'ready' ? null : (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "inline-flex items-center gap-1 font-semibold ".concat(onThisMap ? 'text-[#00468B]' : 'text-slate-500') },
                    React.createElement(MapPin, { className: "w-3.5 h-3.5" }),
                    onThisMap ? 'On the map' : (location ? "On another map (".concat(location.map, ")") : 'Not on the map')),
                onShowOnMap && (React.createElement("button", { type: "button", onClick: function () { return onShowOnMap(assetId); }, className: "px-2 py-1 rounded-md font-bold bg-[#0072CE] text-white hover:bg-[#00468B]" }, onThisMap ? 'Show on map' : 'Open on map')))))),
        React.createElement("fieldset", { disabled: saving, className: "flex-1 overflow-y-auto p-4 space-y-4 min-w-0 m-0 border-0" },
            load.status === 'loading' && React.createElement("p", { className: "text-sm text-slate-500" }, "Loading the asset..."),
            load.status === 'error' && (React.createElement("div", { className: "text-sm text-[#C4001F]", role: "alert" },
                "This asset could not be loaded: ",
                load.error,
                React.createElement("div", null,
                    React.createElement("button", { type: "button", onClick: function () { return reload(false); }, className: "mt-2 text-[#0072CE] underline" }, "Try again")))),
            load.status === 'ready' && groups.map(function (g) {
                var switches = g.key === 'freq' ? g.items.filter(function (f) { return f.kind === 'bool'; }) : [];
                var rest = g.items.filter(function (f) { return switches.indexOf(f) === -1; });
                return (React.createElement("details", { key: g.key, open: true, className: "group/section rounded-lg border border-slate-200" },
                    React.createElement("summary", { className: "cursor-pointer select-none px-3 py-2 bg-[#F7F9FC] rounded-t-lg font-black text-[11px] uppercase tracking-widest text-[#00468B]" }, g.title),
                    React.createElement("div", { className: "p-3 space-y-3" },
                        switches.length > 0 && (React.createElement("div", { className: "grid grid-cols-2 gap-2", role: "group", "aria-label": "Cleaning frequency" }, switches.map(function (f) { return (React.createElement(AssetField, { key: f.name, f: f, value: form.values[f.name], onChange: function (v) { return setValue(f.name, v); }, error: errors[f.name], readOnly: !isEditableField(f, isNew), row: row, compact: true })); }))),
                        rest.map(function (f) { return ((f.kind === 'file' || f.kind === 'image') ? (React.createElement(AssetFileField, { key: f.name, f: f, row: row, set: set, assetId: assetId, isNew: isNew, canWrite: f.canUpdate, onChanged: function () { reload(true); if (onFilesChanged)
                                onFilesChanged(); }, logEvent: logEvent })) : (React.createElement(AssetField, { key: f.name, f: f, value: form.values[f.name], onChange: function (v) { return setValue(f.name, v); }, error: errors[f.name], readOnly: !isEditableField(f, isNew), row: row }))); }))));
            }),
            load.status === 'ready' && !isNew && info.length > 0 && (React.createElement("details", { className: "rounded-lg border border-slate-200" },
                React.createElement("summary", { className: "cursor-pointer select-none px-3 py-2 bg-[#F7F9FC] rounded-t-lg font-black text-[11px] uppercase tracking-widest text-slate-500" }, "Record info"),
                React.createElement("dl", { className: "p-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs" }, info.map(function (f) { return (React.createElement("div", { key: f.name, className: "min-w-0" },
                    React.createElement("dt", { className: "text-slate-400" }, f.label),
                    React.createElement("dd", { className: "text-slate-700 font-medium [overflow-wrap:anywhere]" }, displayValue(f, row) || '-'))); })))),
            isNew && fields.some(function (f) { return f.kind === 'file' || f.kind === 'image'; }) && (React.createElement("p", { className: "text-xs text-slate-500" }, "Pictures and files can be added once the asset is created."))),
        React.createElement("div", { className: "p-3 border-t border-slate-200 bg-white shrink-0 space-y-2" },
            saveError && React.createElement("p", { className: "text-xs text-[#C4001F]", role: "alert" }, saveError),
            stale && (React.createElement("div", { className: "flex gap-2" },
                React.createElement("button", { type: "button", onClick: function () { setStale(false); setSaveError(''); setErrors({}); reload(false); }, className: "px-3 py-1 rounded-md text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100" }, "Reload"),
                React.createElement("button", { type: "button", onClick: function () { return save(true); }, className: "px-3 py-1 rounded-md text-xs font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, "Save mine anyway"))),
            notice && !saveError && React.createElement("p", { className: "text-xs text-green-700", role: "status" }, notice),
            !isNew && load.status === 'ready' && row && (React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 text-xs" }, row.statecode === 1 ? (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "px-2 py-0.5 rounded bg-red-100 text-[#C4001F] font-bold uppercase tracking-wider" }, "Deactivated Asset"),
                React.createElement("button", { type: "button", disabled: saving, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                        var fresh, e_20;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setSaving(true);
                                    setSaveError('');
                                    setNotice('');
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, setAssetActiveState(set, assetId, true, logEvent)];
                                case 2:
                                    fresh = _a.sent();
                                    if (!mounted.current)
                                        return [2 /*return*/];
                                    applyRow(fresh, true);
                                    setNotice('Asset reactivated.');
                                    onSaved(fresh);
                                    return [3 /*break*/, 5];
                                case 3:
                                    e_20 = _a.sent();
                                    if (mounted.current)
                                        setSaveError("Could not reactivate: ".concat(e_20.message));
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (mounted.current)
                                        setSaving(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, className: "px-2.5 py-1 rounded font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" }, "Reactivate asset"))) : !confirmDeact ? (React.createElement("button", { type: "button", disabled: saving, onClick: function () { return setConfirmDeact(true); }, className: "text-slate-500 hover:text-[#C4001F] font-semibold underline" }, "Deactivate old asset...")) : (React.createElement("span", { className: "inline-flex items-center gap-2 bg-[#FFF6E0] border border-[#FFB81C] rounded px-2 py-1" },
                React.createElement("span", { className: "font-bold text-slate-800" }, "Deactivate this asset?"),
                React.createElement("button", { type: "button", disabled: saving, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                        var fresh, e_21;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setSaving(true);
                                    setSaveError('');
                                    setNotice('');
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, setAssetActiveState(set, assetId, false, logEvent)];
                                case 2:
                                    fresh = _a.sent();
                                    if (!mounted.current)
                                        return [2 /*return*/];
                                    setConfirmDeact(false);
                                    applyRow(fresh, true);
                                    setNotice('Asset deactivated.');
                                    onSaved(fresh);
                                    return [3 /*break*/, 5];
                                case 3:
                                    e_21 = _a.sent();
                                    if (mounted.current)
                                        setSaveError("Could not deactivate: ".concat(e_21.message));
                                    return [3 /*break*/, 5];
                                case 4:
                                    if (mounted.current)
                                        setSaving(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, className: "px-2 py-0.5 rounded font-bold bg-[#E4002B] text-white hover:bg-[#C4001F]" }, "Confirm Deactivate"),
                React.createElement("button", { type: "button", onClick: function () { return setConfirmDeact(false); }, className: "font-bold text-slate-600 underline" }, "Cancel"))))),
            React.createElement("div", { className: "flex items-center justify-between gap-2" },
                React.createElement("span", { className: "text-xs text-slate-500" }, isNew && placing ? 'Use the spot or Cancel on the map first.' : (isDirty ? "".concat(changed.length, " unsaved change").concat(changed.length === 1 ? '' : 's') : (isNew ? '' : 'No changes'))),
                React.createElement("div", { className: "flex gap-2" },
                    isDirty && !isNew && React.createElement("button", { type: "button", onClick: discard, disabled: saving, className: "px-3 py-1.5 rounded-md text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100" }, "Discard"),
                    React.createElement("button", { type: "button", onClick: function () { return save(false); }, disabled: saving || load.status !== 'ready' || (!isNew && !isDirty) || (isNew && placing), className: "px-4 py-1.5 rounded-md text-sm font-bold bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" }, saving ? 'Saving...' : (isNew ? 'Create asset' : 'Save changes')))))));
}
function EditorHeader(_a) {
    var title = _a.title, subtitle = _a.subtitle, onClose = _a.onClose, isNew = _a.isNew;
    return (React.createElement("div", { className: "flex items-start justify-between gap-2" },
        React.createElement("div", { className: "min-w-0" },
            React.createElement("p", { className: "text-[11px] font-black uppercase tracking-widest text-[#0072CE]" }, isNew ? 'New asset' : 'Asset'),
            React.createElement("h3", { className: "text-lg font-black text-[#00468B] leading-tight [overflow-wrap:anywhere]" }, title),
            subtitle && React.createElement("p", { className: "text-xs text-slate-500" }, subtitle)),
        React.createElement("button", { type: "button", onClick: onClose, className: "text-slate-400 hover:text-[#E4002B] shrink-0", "aria-label": "Close the asset" },
            React.createElement(X, { className: "w-5 h-5" }))));
}
// One column: label, the control for its type, and its error
function AssetField(_a) {
    var f = _a.f, value = _a.value, onChange = _a.onChange, error = _a.error, readOnly = _a.readOnly, row = _a.row, _b = _a.compact, compact = _b === void 0 ? false : _b;
    var id = "asset-field-".concat(f.name);
    var label = (React.createElement("span", { className: "flex items-baseline justify-between gap-2" },
        React.createElement("label", { htmlFor: id, className: "text-xs font-bold text-slate-700", title: f.description || undefined },
            f.label,
            (f.required || f.isPrimaryName) && !readOnly && React.createElement("span", { className: "text-[#E4002B]" }, " *")),
        !compact && React.createElement("span", { className: "text-[10px] text-slate-400 font-mono truncate", title: f.name }, f.name)));
    var inputClass = "w-full px-2.5 py-1.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/40 ".concat(error ? 'border-[#E4002B]' : 'border-slate-300 focus:border-[#0072CE]');
    var err = error ? React.createElement("p", { className: "text-xs text-[#C4001F] mt-0.5", role: "alert" }, error) : null;
    if (f.kind === 'bool' && compact) {
        return (React.createElement("div", null,
            React.createElement("button", { id: id, type: "button", role: "switch", "aria-checked": value === true, disabled: readOnly, onClick: function () { return onChange(value !== true); }, title: f.description || f.name, className: "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ".concat(value === true ? 'bg-[#E6F1FB] border-[#0072CE] text-[#00468B]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50') },
                React.createElement("span", { className: "text-left [overflow-wrap:anywhere]" }, f.label),
                React.createElement("span", { className: "relative inline-block w-7 h-4 rounded-full shrink-0 transition-colors ".concat(value === true ? 'bg-[#0072CE]' : 'bg-slate-300'), "aria-hidden": "true" },
                    React.createElement("span", { className: "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ".concat(value === true ? 'left-3.5' : 'left-0.5') }))),
            err));
    }
    if (readOnly) {
        var shown = displayValue(f, row);
        return (React.createElement("div", null,
            label,
            React.createElement("p", { id: id, className: "text-sm text-slate-800 mt-0.5 [overflow-wrap:anywhere]" }, shown || React.createElement("span", { className: "text-slate-400" }, "-"))));
    }
    var control;
    switch (f.kind) {
        case 'memo':
            control = React.createElement("textarea", { id: id, rows: 3, value: value, onChange: function (e) { return onChange(e.target.value); }, className: inputClass });
            break;
        case 'int':
        case 'number':
            control = React.createElement("input", { id: id, type: "text", inputMode: f.kind === 'int' ? 'numeric' : 'decimal', value: value, onChange: function (e) { return onChange(e.target.value); }, className: inputClass });
            break;
        case 'bool':
            control = (React.createElement("div", { id: id, className: "inline-flex rounded-md border border-slate-300 overflow-hidden", role: "group", "aria-label": f.label }, [[false, f.falseLabel || 'No'], [true, f.trueLabel || 'Yes']].map(function (_a) {
                var v = _a[0], text = _a[1];
                return (React.createElement("button", { key: text, type: "button", "aria-pressed": value === v, onClick: function () { return onChange(v); }, className: "px-3 py-1 text-xs font-bold ".concat(value === v ? 'bg-[#00468B] text-white' : 'bg-white text-slate-600 hover:bg-slate-100') }, text));
            })));
            break;
        case 'choice':
            control = (React.createElement("select", { id: id, value: value, onChange: function (e) { return onChange(e.target.value); }, className: inputClass },
                React.createElement("option", { value: "" }, "-"),
                f.options.map(function (o) { return React.createElement("option", { key: o.value, value: String(o.value) }, o.label); })));
            break;
        case 'choices':
            control = (React.createElement("div", { id: id, className: "flex flex-wrap gap-1.5", role: "group", "aria-label": f.label }, f.options.map(function (o) {
                var key = String(o.value);
                var on = (value || []).indexOf(key) !== -1;
                return (React.createElement("button", { key: key, type: "button", "aria-pressed": on, onClick: function () { return onChange(on ? value.filter(function (v) { return v !== key; }) : (value || []).concat([key])); }, className: "px-2 py-0.5 rounded-full text-xs font-semibold border ".concat(on ? 'bg-[#00468B] text-white border-[#00468B]' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100') }, o.label));
            })));
            break;
        case 'date':
            control = React.createElement("input", { id: id, type: f.dateOnly ? 'date' : 'datetime-local', value: value, onChange: function (e) { return onChange(e.target.value); }, className: inputClass });
            break;
        case 'lookup':
            control = React.createElement(LookupField, { id: id, f: f, value: value, onChange: onChange });
            break;
        default: {
            var type = f.format === 'Email' ? 'email' : (f.format === 'Url' ? 'url' : (f.format === 'Phone' ? 'tel' : 'text'));
            control = (React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("input", { id: id, type: type, value: value, onChange: function (e) { return onChange(e.target.value); }, className: inputClass }),
                type === 'url' && /^https?:\/\//i.test(value || '') && React.createElement("a", { href: value, target: "_blank", rel: "noopener noreferrer", className: "text-xs font-bold text-[#0072CE] underline shrink-0" }, "Open")));
        }
    }
    var length = (f.kind === 'text' || f.kind === 'memo') && f.maxLength && String(value || '').length > f.maxLength * 0.8
        ? React.createElement("p", { className: "text-[10px] mt-0.5 ".concat(String(value).length > f.maxLength ? 'text-[#C4001F]' : 'text-slate-400') },
            String(value).length,
            " / ",
            f.maxLength)
        : null;
    return (React.createElement("div", null,
        label,
        React.createElement("div", { className: "mt-0.5" }, control),
        length,
        err));
}
// A lookup column: shows the linked row; "Change" searches the target table (25 rows at a time)
function LookupField(_a) {
    var id = _a.id, f = _a.f, value = _a.value, onChange = _a.onChange, label = _a.label;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useState(''), text = _c[0], setText = _c[1];
    var _d = useState(null), target = _d[0], setTarget = _d[1];
    var _f = useState({ rows: [], loading: false, error: '' }), res = _f[0], setRes = _f[1];
    var req = useRef(0);
    useEffect(function () {
        if (!open || target)
            return;
        loadTargetMeta(f.targets[0]).then(setTarget).catch(function (e) { return setRes({ rows: [], loading: false, error: e.message }); });
    }, [open, target, f.targets]);
    useEffect(function () {
        if (!open || !target)
            return undefined;
        var t = setTimeout(function () {
            var r = req.current + 1;
            req.current = r;
            setRes(function (p) { return (__assign(__assign({}, p), { loading: true, error: '' })); });
            var filter = text.trim() ? "&$filter=".concat(encodeURIComponent("contains(".concat(target.name, ",'").concat(escLike(text.trim()), "')"))) : '';
            getJson("".concat(target.set, "?$select=").concat(target.id, ",").concat(target.name).concat(filter, "&$orderby=").concat(target.name, "&$top=25"))
                .then(function (d) { if (r === req.current)
                setRes({ rows: (d.value || []).map(function (x) { return ({ id: cleanGuid(x[target.id]), name: x[target.name] || '(no name)' }); }), loading: false, error: '' }); })
                .catch(function (e) { if (r === req.current)
                setRes({ rows: [], loading: false, error: e.message }); });
        }, text ? 250 : 0);
        return function () { return clearTimeout(t); };
    }, [open, target, text]);
    return (React.createElement("div", { id: id },
        React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("span", { className: "text-sm ".concat(value && value.id ? 'text-slate-800 font-medium' : 'text-slate-400', " [overflow-wrap:anywhere]") }, value && value.id ? (value.name || value.id) : 'Not set'),
            React.createElement("button", { type: "button", onClick: function () { return setOpen(function (o) { return !o; }); }, "aria-label": label ? "".concat(open ? 'Close' : 'Change', " ").concat(label) : undefined, className: "text-xs font-bold text-[#0072CE] underline" }, open ? 'Close' : 'Change'),
            value && value.id && React.createElement("button", { type: "button", onClick: function () { return onChange({ id: '', name: '' }); }, "aria-label": label ? "Clear ".concat(label) : undefined, className: "text-xs font-bold text-slate-500 underline" }, "Clear")),
        open && (React.createElement("div", { className: "mt-1.5 border border-slate-200 rounded-md p-2 space-y-1.5 bg-[#F7F9FC]" },
            React.createElement("input", { type: "search", value: text, onChange: function (e) { return setText(e.target.value); }, placeholder: "Search...", "aria-label": "Search ".concat(f.label), className: "w-full px-2 py-1 text-sm border border-slate-300 rounded-md bg-white" }),
            res.error && React.createElement("p", { className: "text-xs text-[#C4001F]" },
                "Could not search: ",
                res.error),
            res.loading && React.createElement("p", { className: "text-xs text-slate-500" }, "Loading..."),
            React.createElement("ul", { className: "max-h-40 overflow-y-auto space-y-0.5" }, res.rows.map(function (r) { return (React.createElement("li", { key: r.id },
                React.createElement("button", { type: "button", onClick: function () { onChange({ id: r.id, name: r.name, set: target.set }); setOpen(false); }, className: "w-full text-left px-2 py-1 rounded text-sm hover:bg-[#E6F1FB]" }, r.name))); })),
            !res.loading && !res.error && res.rows.length === 0 && target && React.createElement("p", { className: "text-xs text-slate-500" }, "Nothing found.")))));
}
// A File or Image column: upload, open and remove act straight away (they are their own requests in Dataverse).
// variant "cell" is the compact form used in the equipment table.
function AssetFileField(_a) {
    var _this = this;
    var f = _a.f, row = _a.row, set = _a.set, assetId = _a.assetId, isNew = _a.isNew, canWrite = _a.canWrite, onChanged = _a.onChanged, logEvent = _a.logEvent, _b = _a.variant, variant = _b === void 0 ? 'field' : _b, _c = _a.assetLabel, assetLabel = _c === void 0 ? '' : _c;
    var _d = useState(''), busy = _d[0], setBusy = _d[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    var _g = useState(false), confirmDelete = _g[0], setConfirmDelete = _g[1];
    var inputRef = useRef(null);
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    var isImage = f.kind === 'image';
    var fileName = row ? row["".concat(f.name, "_name")] || '' : '';
    var stamp = row ? (row["".concat(f.name, "_timestamp")] || '') : '';
    var has = !!row && (isImage ? !!(row[f.name] || row["".concat(f.name, "_timestamp")] || row["".concat(f.name, "_url")]) : !!(row[f.name] || fileName));
    var sources = has && assetId
        ? (f.fullImage === false ? [] : [apiUrl("".concat(set, "(").concat(assetId, ")/").concat(f.name, "/$value?size=full&t=").concat(encodeURIComponent(String(stamp))))]).concat([apiUrl("".concat(set, "(").concat(assetId, ")/").concat(f.name, "/$value?t=").concat(encodeURIComponent(String(stamp))))])
        : [];
    var run = function (kind, work) { return __awaiter(_this, void 0, void 0, function () {
        var e_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (busy)
                        return [2 /*return*/];
                    setBusy(kind);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, work()];
                case 2:
                    _a.sent();
                    if (mounted.current)
                        setConfirmDelete(false);
                    if (kind !== 'open')
                        onChanged(); // a download does not change the row
                    return [3 /*break*/, 5];
                case 3:
                    e_22 = _a.sent();
                    logEvent("".concat(f.label, ": ").concat(kind, " failed: ").concat(e_22.message), 'error');
                    if (mounted.current)
                        setError(e_22.message);
                    return [3 /*break*/, 5];
                case 4:
                    if (mounted.current)
                        setBusy('');
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var onPick = function (e) {
        var file = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!file)
            return;
        run('upload', function () { return __awaiter(_this, void 0, void 0, function () {
            var up, done;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareAssetUpload(file, f)];
                    case 1:
                        up = _a.sent();
                        return [4 /*yield*/, uploadAssetFile(set, assetId, f.name, up.body, up.name, logEvent, { mimeType: up.mimeType })];
                    case 2:
                        done = _a.sent();
                        logEvent("Uploaded \"".concat(done.fileName, "\" to ").concat(f.name, " of asset ").concat(assetId).concat(done.route === 'blocks' ? ' (sent in parts)' : '', "."), 'success');
                        return [2 /*return*/];
                }
            });
        }); });
    };
    var picker = canWrite && !isNew
        ? React.createElement("input", { ref: inputRef, type: "file", accept: isImage ? 'image/*,.heic,.heif' : undefined, onChange: onPick, className: "hidden", "aria-label": "Upload ".concat(f.label), "data-upload": f.name })
        : null;
    var openIt = function () { return run('open', function () { return openAssetFile(set, assetId, f.name, fileName, isImage); }); };
    var removeConfirm = confirmDelete && (React.createElement("span", { className: "inline-flex items-center gap-1.5 text-xs bg-[#FFF6E0] border border-[#FFB81C] rounded-md px-2 py-1" },
        "Remove ",
        isImage ? 'the picture' : 'the file',
        "?",
        React.createElement("button", { type: "button", disabled: !!busy, onClick: function () { return run('remove', function () { return deleteAssetFile(set, assetId, f.name, logEvent); }); }, className: "font-bold text-[#C4001F] underline" }, busy === 'remove' ? 'Removing...' : 'Remove'),
        React.createElement("button", { type: "button", onClick: function () { return setConfirmDelete(false); }, className: "font-bold text-slate-600 underline" }, "Keep")));
    if (variant === 'cell') {
        // Screen readers hear which asset a cell's buttons are for
        var of = assetLabel ? " of ".concat(assetLabel) : '';
        // The small thumbnail Dataverse keeps (144 px), not the full picture
        var thumb = has && isImage && assetId ? [apiUrl("".concat(set, "(").concat(assetId, ")/").concat(f.name, "/$value?t=").concat(encodeURIComponent(String(stamp))))] : [];
        return (React.createElement("div", { "data-file-field": f.name, className: "min-w-0 px-1 py-0.5" },
            React.createElement("div", { className: "flex items-center gap-1.5" },
                isImage && has && (React.createElement("button", { type: "button", onClick: openIt, disabled: !!busy, title: "Open the ".concat(f.label.toLowerCase()), "aria-label": "Open the ".concat(f.label.toLowerCase()).concat(of), className: "w-9 h-9 rounded border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center" },
                    React.createElement(StoredImage, { key: thumb.join('|'), sources: thumb, alt: f.label, className: "w-full h-full object-cover", fallback: React.createElement(ImageIcon, { className: "w-4 h-4 text-slate-400" }) }))),
                !isImage && has && (React.createElement("button", { type: "button", onClick: openIt, disabled: !!busy, className: "text-xs font-semibold text-[#0072CE] underline truncate max-w-[8rem] disabled:opacity-50", title: "Open ".concat(fileName || 'the file'), "aria-label": "Open ".concat(fileName || 'the file', ", the ").concat(f.label).concat(of) }, busy === 'open' ? 'Opening...' : (fileName || 'Open file'))),
                !has && React.createElement("span", { className: "text-xs text-slate-400" }, isImage ? 'No picture' : 'No file'),
                picker,
                picker && (React.createElement("button", { type: "button", disabled: !!busy, onClick: function () { return inputRef.current && inputRef.current.click(); }, title: "".concat(has ? 'Replace' : 'Upload', " the ").concat(f.label), "aria-label": "".concat(busy === 'upload' ? 'Uploading' : (has ? 'Replace' : 'Upload'), " the ").concat(f.label).concat(of), className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50 shrink-0" },
                    React.createElement(Download, { className: "w-3 h-3 rotate-180" }),
                    busy === 'upload' ? 'Uploading...' : (has ? 'Replace' : 'Upload'))),
                has && canWrite && !confirmDelete && (React.createElement("button", { type: "button", disabled: !!busy, onClick: function () { return setConfirmDelete(true); }, title: "Remove the ".concat(f.label), "aria-label": "Remove the ".concat(f.label).concat(of), className: "p-0.5 rounded text-slate-400 hover:text-[#E4002B] hover:bg-slate-100 disabled:opacity-50 shrink-0" },
                    React.createElement(X, { className: "w-3.5 h-3.5" })))),
            removeConfirm && React.createElement("div", { className: "mt-1" }, removeConfirm),
            error && React.createElement("p", { className: "text-[11px] text-[#C4001F] mt-0.5", role: "alert" },
                "Not done: ",
                error)));
    }
    return (React.createElement("div", { "data-file-field": f.name },
        React.createElement("span", { className: "flex items-baseline justify-between gap-2" },
            React.createElement("span", { className: "text-xs font-bold text-slate-700", title: f.description || undefined }, f.label),
            React.createElement("span", { className: "text-[10px] text-slate-400 font-mono truncate" }, f.name)),
        isImage && has && (React.createElement("div", { className: "mt-1 rounded-md border border-slate-200 bg-slate-50 overflow-hidden max-w-[16rem]" },
            React.createElement(StoredImage, { key: sources.join('|'), sources: sources, alt: f.label, className: "w-full h-auto max-h-48 object-contain", fallback: React.createElement("p", { className: "text-xs text-slate-500 p-2" }, "The picture could not be shown.") }))),
        React.createElement("p", { className: "text-sm text-slate-800 mt-0.5 [overflow-wrap:anywhere]" }, has ? (isImage ? '' : (fileName || 'A file is stored.')) : React.createElement("span", { className: "text-slate-400" }, isImage ? 'No picture' : 'No file')),
        isNew ? null : (React.createElement("div", { className: "flex flex-wrap items-center gap-2 mt-1" },
            picker && (React.createElement(React.Fragment, null,
                picker,
                React.createElement("button", { type: "button", disabled: !!busy, onClick: function () { return inputRef.current && inputRef.current.click(); }, className: "px-2.5 py-1 rounded-md text-xs font-bold bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50" }, busy === 'upload' ? 'Uploading...' : (has ? 'Replace' : (isImage ? 'Upload picture' : 'Upload file'))))),
            has && (React.createElement("button", { type: "button", disabled: !!busy, onClick: openIt, className: "px-2.5 py-1 rounded-md text-xs font-bold border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB] disabled:opacity-50" }, busy === 'open' ? 'Opening...' : 'Open')),
            has && canWrite && !confirmDelete && (React.createElement("button", { type: "button", disabled: !!busy, onClick: function () { return setConfirmDelete(true); }, className: "px-2.5 py-1 rounded-md text-xs font-bold border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50" }, "Remove")),
            removeConfirm)),
        error && React.createElement("p", { className: "text-xs text-[#C4001F] mt-0.5", role: "alert" },
            "Not done: ",
            error)));
}
// ==========================================
// BULK UPLOAD. Many pictures and documents at once. Each file goes to a piece of equipment (one of the equipment table's File
// or Image columns), becomes a new issue (an observation with its picture), or is added to an issue that already exists.
// Equipment is found by a search (or by the suggestion its file name gives); uploads run one at a time and each asks
// Dataverse for its own row only, never the whole table.
// ==========================================
var FileDocIcon = createIcon(React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    React.createElement("polyline", { points: "14 2 14 8 20 8" }),
    React.createElement("line", { x1: "8", y1: "13", x2: "16", y2: "13" }),
    React.createElement("line", { x1: "8", y1: "17", x2: "13", y2: "17" })));
var endSentence = function (s) { var t = String(s || '').trim(); return /[.!?]$/.test(t) ? t : "".concat(t, "."); };
var BULK_SEARCH_TOP = 8; // equipment (or issues) shown for one search
var BULK_SUGGEST_AT_ONCE = 2; // file-name lookups running together
var BULK_PICTURE_COLUMN = /pic|photo|image|img/i;
var BULK_DOC_COLUMN = /sop|procedure|doc|manual|instruction/i;
var BULK_SPOT_SIZES = [{ key: 2, label: 'Small' }, { key: 4, label: 'Medium' }, { key: 8, label: 'Large' }]; // % of the map
// The columns a new issue is saved with (the picture and the equipment ids come on top, when the table has them)
var ISSUE_COLUMNS = ['craa5_mapx', 'craa5_mapy', 'craa5__boxwidth', 'craa5__boxheight', 'craa5__room', 'craa5__area', 'craa5__equipment',
    'craa5__description', 'craa5__whotonotify', 'craa5__customnote', 'craa5__facility'];
var BULK_TARGETS = [{ key: 'asset', label: 'Equipment' }, { key: 'newIssue', label: 'New issue' }, { key: 'issue', label: 'Existing issue' }];
// What to change after a refusal that would come again
var BULK_FATAL_HINT = {
    asset: 'Change the column, the equipment or the file to try again.',
    newIssue: 'Change the details or the file to try again.',
    issue: 'Pick another issue or another file to try again.'
};
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Words in a file name that never name equipment
var BULK_NOISE_WORDS = ['img', 'image', 'images', 'dsc', 'dscn', 'dcim', 'pxl', 'photo', 'photos', 'pic', 'pics', 'picture', 'pictures',
    'scan', 'scanned', 'screenshot', 'whatsapp', 'sop', 'sops', 'ssop', 'ssops', 'final', 'draft', 'copy', 'rev', 'ver', 'new', 'old', 'the', 'of', 'for',
    'mp', 'hdr', 'portrait', 'night', 'burst', 'wa', 'vid', 'mvimg', 'edited'];
// A phone's or camera's own name at the start (IMG_1234, IMG_E1234, PXL_20240105_101532123.MP, DSC01234, IMG-20240105-WA0001)
var BULK_CAMERA_NAME = /^\s*(img|pxl|dsc|dscn|dcim|vid|mvimg|fb_img|photo|image|screenshot|scan|signal)[-_ ]?[a-z]?\d[\w.-]*/i;
// A file name without its type and copy marks: "Mixer 7 (2).jpg" -> "Mixer 7"
var bulkStem = function (fileName) { return String(fileName || '').replace(/\.[^.]*$/, '').replace(/\s*\(\d+\)\s*$/, '').replace(/\s*-\s*copy\s*$/i, '').trim(); };
// "Mixer7_SOP (2).pdf" -> ['Mixer', '7']: the words of a file name that could be in an equipment name, room or area
function bulkNameWords(fileName) {
    // The camera's own name, version marks ("v2", "rev 3") and an SOP's number ("SOP 2", "sop3": it picks the SOP column, it
    // is not part of the equipment's name) go before letters and digits are split apart
    var stem = bulkStem(fileName).replace(BULK_CAMERA_NAME, ' ').replace(/(^|[^a-z0-9])(?:v|ver|rev)\s*\d+(?=$|[^a-z0-9])/gi, '$1 ')
        .replace(/(^|[^a-z0-9])s?sop[\s_\-#]*[0-9](?=$|[^0-9])/gi, '$1 ');
    var words = stem.replace(/([a-z])([0-9])/gi, '$1 $2').replace(/([0-9])([a-z])/gi, '$1 $2').split(/[^A-Za-z0-9]+/).filter(Boolean);
    var kept = words.filter(function (w) { return BULK_NOISE_WORDS.indexOf(w.toLowerCase()) === -1 && !/^\d{5,}$/.test(w) && !/^[a-z]$/i.test(w); });
    // Only numbers left (20240101_101500) says nothing about the equipment
    if (!kept.some(function (w) { return /[a-z]/i.test(w); }))
        return [];
    return kept.slice(0, 4);
}
// A first description for an issue from its file name ("leaking valve_mixer 7.jpg" -> "leaking valve mixer 7"); '' for camera names
function bulkDescriptionFrom(fileName) {
    var stem = bulkStem(fileName);
    if (BULK_CAMERA_NAME.test(stem) || !bulkNameWords(fileName).length)
        return '';
    return stem.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
}
// Does the equipment hold every word as a whole number or the start of a word? ("3" is not in "Slicer 13", "mp" not in "Sump")
function bulkWordsFit(asset, words) {
    var text = " ".concat(asset.name, " ").concat(asset.room, " ").concat(asset.area, " ").toLowerCase().replace(/([a-z])([0-9])/g, '$1 $2').replace(/([0-9])([a-z])/g, '$1 $2');
    return words.every(function (w) {
        var lw = String(w).toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!lw)
            return true;
        return (/^\d+$/.test(lw) ? new RegExp("(^|[^0-9])".concat(lw, "([^0-9]|$)")) : new RegExp("(^|[^a-z])".concat(lw))).test(text);
    });
}
// The picture column and the document column files go to unless the user picks another: a column picked on this device,
// else the expected one (Picture of Equipment / SSOP), else one named like it. '' = none.
function bulkPictureColumn(fields) {
    var picked = readColumnPick('assetPicture');
    var f = fields.filter(function (c) { return c.name === picked; })[0];
    if (f)
        return f.name;
    var images = fields.filter(function (c) { return c.kind === 'image'; });
    var expected = images.filter(function (c) { return c.name === ASSET_PICTURE_COLUMN; })[0];
    if (expected)
        return expected.name;
    var named = images.filter(function (c) { return BULK_PICTURE_COLUMN.test("".concat(c.name, " ").concat(c.label)); })[0] || images[0];
    if (named)
        return named.name;
    var pictureFile = fields.filter(function (c) { return c.kind === 'file' && BULK_PICTURE_COLUMN.test("".concat(c.name, " ").concat(c.label)); })[0];
    return pictureFile ? pictureFile.name : '';
}
function bulkDocColumn(fields) {
    var files = fields.filter(function (c) { return c.kind === 'file'; });
    var picked = files.filter(function (c) { return c.name === readColumnPick('assetDoc'); })[0];
    if (picked)
        return picked.name;
    var _loop_3 = function (i) {
        var expected = files.filter(function (c) { return c.name === ASSET_DOC_COLUMNS[i]; })[0];
        if (expected)
            return { value: expected.name };
    };
    for (var i = 0; i < ASSET_DOC_COLUMNS.length; i += 1) {
        var state_2 = _loop_3(i);
        if (typeof state_2 === "object")
            return state_2.value;
    }
    var docs = files.filter(function (c) { return !BULK_PICTURE_COLUMN.test("".concat(c.name, " ").concat(c.label)); });
    var sop = docs.filter(function (c) { return BULK_DOC_COLUMN.test("".concat(c.name, " ").concat(c.label)); })[0];
    if (sop)
        return sop.name;
    return docs.length === 1 ? docs[0].name : '';
}
// The column a file goes to until the user picks another. A document named "... SOP 2 ..." goes to the SOP 2 column and
// "... SSOP ..." to the SSOP column when the table has them; otherwise pictures to the picture column, documents to the SSOP.
function bulkDefaultColumn(fields, picture, fileName) {
    if (picture)
        return bulkPictureColumn(fields);
    var name = " ".concat(String(fileName || '').toLowerCase().replace(/[_.\-]+/g, ' '), " ");
    var files = fields.filter(function (c) { return c.kind === 'file'; });
    var textOf = function (c) { return "".concat(c.name, " ").concat(c.label).toLowerCase(); };
    var num = /[^a-z]sop\s*([0-9])(?![0-9])/.exec(name);
    if (num) {
        var n_1 = num[1];
        var f = files.filter(function (c) { return new RegExp("(^|[^s])sop\\s*".concat(n_1, "(?![0-9])")).test(textOf(c)); })[0];
        if (f)
            return f.name;
    }
    if (/ssop|sanitation/.test(name)) {
        var f = files.filter(function (c) { return /ssop/.test(textOf(c)); })[0];
        if (f)
            return f.name;
    }
    return bulkDocColumn(fields);
}
// A piece of equipment from a search, with what it already holds in each upload column (when Dataverse said) and its map spot
function bulkAssetOf(row, uploadFields, mapColumn) {
    var current = {};
    uploadFields.forEach(function (f) {
        if (f.kind === 'file') {
            var name = f.nameColumn ? row[f.nameColumn] : undefined;
            if (row[f.name] !== undefined || name !== undefined)
                current[f.name] = { has: !!(row[f.name] || name), name: name || '' };
        }
        else if (f.stampColumn && row[f.stampColumn] !== undefined) {
            current[f.name] = { has: !!row[f.stampColumn], name: '' };
        }
    });
    return {
        id: cleanGuid(row[ASSET_ID_COLUMN]),
        name: String(row[ASSET_NAME_COLUMN] || '').trim() || '(no name)',
        room: row.craa5_roomname || '',
        area: row.craa5_areaname || '',
        location: mapColumn && row[mapColumn] !== undefined ? parseMapLocation(row[mapColumn]) : null,
        current: current
    };
}
// Equipment for a search: typed words (the equipment named exactly so first, then every one whose name, room or area holds
// all the words), an asset id, or a ready-made filter. At most BULK_SEARCH_TOP rows, with what each holds in the upload
// columns and its map spot; if Dataverse refuses those extra columns, once more without them.
function searchBulkAssets(set, text, uploadFields, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var o, trimmed, id, base, extra, query, rows, words, lists, seen;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    o = opts || {};
                    trimmed = String(text || '').trim();
                    id = cleanGuid(trimmed);
                    base = [ASSET_ID_COLUMN, ASSET_NAME_COLUMN, 'craa5_roomname', 'craa5_areaname'];
                    extra = o.mapColumn ? [o.mapColumn] : [];
                    uploadFields.forEach(function (f) {
                        (f.kind === 'file' ? [f.name, f.nameColumn] : [f.stampColumn]).forEach(function (c) { if (c && extra.indexOf(c) === -1)
                            extra.push(c); });
                    });
                    query = function (filter) { return __awaiter(_this, void 0, void 0, function () {
                        var activeFilter, ask, e_23;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    activeFilter = filter ? "statecode eq 0 and (".concat(filter, ")") : 'statecode eq 0';
                                    ask = function (cols) { return getJson("".concat(set, "?$select=").concat(cols.join(','), "&$filter=").concat(encodeURIComponent(activeFilter), "&$orderby=").concat(encodeURIComponent("".concat(ASSET_NAME_COLUMN, " asc,").concat(ASSET_ID_COLUMN)), "&$top=").concat(BULK_SEARCH_TOP)); };
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 5]);
                                    return [4 /*yield*/, ask(base.concat(extra))];
                                case 2: return [2 /*return*/, (_a.sent()).value || []];
                                case 3:
                                    e_23 = _a.sent();
                                    if (e_23.status !== 400 || !extra.length)
                                        throw e_23;
                                    return [4 /*yield*/, ask(base)];
                                case 4: return [2 /*return*/, (_a.sent()).value || []];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!o.filter) return [3 /*break*/, 2];
                    return [4 /*yield*/, query(o.filter)];
                case 1:
                    rows = _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    if (!GUID_PATTERN.test(id)) return [3 /*break*/, 4];
                    return [4 /*yield*/, query("".concat(ASSET_ID_COLUMN, " eq ").concat(id))];
                case 3:
                    rows = _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    words = assetWordFilter(trimmed.split(/\s+/).filter(Boolean).slice(0, 4)).join(' and ');
                    if (!words)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, Promise.all([o.exactFirst === false ? Promise.resolve([]) : query("".concat(ASSET_NAME_COLUMN, " eq '").concat(escOData(trimmed), "'")), query(words)])];
                case 5:
                    lists = _a.sent();
                    rows = lists[0].concat(lists[1]);
                    _a.label = 6;
                case 6:
                    seen = {};
                    return [2 /*return*/, rows.map(function (r) { return bulkAssetOf(r, uploadFields, o.mapColumn); }).filter(function (a) { return GUID_PATTERN.test(a.id) && !seen[a.id] && (seen[a.id] = true); }).slice(0, BULK_SEARCH_TOP)];
            }
        });
    });
}
// What the file would take the place of: { has, name } when something is stored where it goes, else null
function bulkReplaces(it, byName, kit) {
    if (it.target === 'issue') {
        if (!it.existing)
            return null;
        // The issue as it is now (its picture mark changes when the picture column is switched), else as it was when picked
        var sub = kit && kit.submissions ? kit.submissions.find(function (s) { return s.id === it.existing.id; }) : null;
        return (sub ? issueHasPicture(sub) : it.existing.hasPicture) ? { has: true, name: '' } : null;
    }
    if (it.target !== 'asset')
        return null;
    var f = byName[it.column];
    var cur = f && it.asset && it.asset.current ? it.asset.current[f.name] : null;
    return cur && cur.has ? cur : null;
}
// What a file's name suggests: the equipment named exactly like the file (or its words), else the only one whose name, room
// or area holds all its words. { state: 'one', asset } | { state: 'many', count, text } | { state: 'none', text }
function suggestBulkAsset(set, fileName, words, uploadFields, mapColumn) {
    return __awaiter(this, void 0, void 0, function () {
        var text, names, exact, rows, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    text = words.join(' ');
                    names = [bulkStem(fileName), text].filter(function (n, i, all) { return n && all.indexOf(n) === i; });
                    return [4 /*yield*/, searchBulkAssets(set, '', uploadFields, { filter: names.map(function (n) { return "".concat(ASSET_NAME_COLUMN, " eq '").concat(escOData(n), "'"); }).join(' or '), mapColumn: mapColumn })];
                case 1:
                    exact = _b.sent();
                    if (exact.length === 1)
                        return [2 /*return*/, { state: 'one', asset: exact[0] }];
                    if (!(exact.length > 1)) return [3 /*break*/, 2];
                    _a = exact;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, searchBulkAssets(set, text, uploadFields, { exactFirst: false, mapColumn: mapColumn })];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    rows = _a;
                    // One match by its words is only taken when the words really are in it: "Slicer 3" must not turn into "Slicer 13"
                    if (rows.length === 1 && bulkWordsFit(rows[0], words))
                        return [2 /*return*/, { state: 'one', asset: rows[0] }];
                    return [2 /*return*/, rows.length ? { state: 'many', count: rows.length, text: text } : { state: 'none', text: text }];
            }
        });
    });
}
// A spot's box stays inside the map: its centre moves in from the edge by half the box
var clampSpot = function (s) { return (s ? __assign(__assign({}, s), { x: Math.min(100 - s.w / 2, Math.max(s.w / 2, s.x)), y: Math.min(100 - s.h / 2, Math.max(s.h / 2, s.y)) }) : s); };
// An issue's map spot from its equipment's spot on this map: the snapped box, else a medium box around the pin. null = none.
function bulkSpotFromAsset(asset, mapKey) {
    var loc = asset && asset.location;
    if (!loc || !pinOnMap(loc, mapKey))
        return null;
    if (loc.box)
        return clampSpot({ x: loc.box[0] + loc.box[2] / 2, y: loc.box[1] + loc.box[3] / 2, w: Math.min(100, Math.max(1, loc.box[2])), h: Math.min(100, Math.max(1, loc.box[3])), from: 'equipment', map: mapKey });
    var size = 4;
    return clampSpot({ x: loc.x, y: loc.y, w: size, h: size, from: 'equipment', map: mapKey });
}
// A new issue's details, filled from the file name and its equipment (room, area and map spot) where it has one
function bulkIssueDraft(it, mapKey) {
    var a = it.asset;
    return {
        category: '',
        customNote: '',
        description: bulkDescriptionFrom(it.file.name),
        room: a ? a.room : '',
        area: a ? a.area : '',
        roomAuto: !!a,
        areaAuto: !!a,
        whoToNotify: '',
        spot: a ? bulkSpotFromAsset(a, mapKey) : null,
        addTaken: true
    };
}
// The changes when a file gets a piece of equipment: a new issue takes its room, area and map spot unless the user set them
function bulkWithAsset(it, asset, mapKey) {
    var ch = { asset: asset, choosing: false, status: it.status === 'error' ? 'waiting' : it.status, message: '', fatal: false };
    if (it.issue && !it.created) {
        var d = it.issue;
        var fillRoom = !d.room || d.roomAuto;
        var fillArea = !d.area || d.areaAuto;
        ch.issue = __assign(__assign({}, d), { room: fillRoom ? asset.room : d.room, roomAuto: fillRoom ? true : d.roomAuto, area: fillArea ? asset.area : d.area, areaAuto: fillArea ? true : d.areaAuto, spot: d.spot && d.spot.from === 'map' ? d.spot : bulkSpotFromAsset(asset, mapKey) });
    }
    return ch;
}
function bulkWithoutAsset(it) {
    var ch = { asset: null, choosing: false, status: it.status === 'error' ? 'waiting' : it.status, message: '', fatal: false };
    if (it.issue && !it.created) {
        var d = it.issue;
        ch.issue = __assign(__assign({}, d), { room: d.roomAuto ? '' : d.room, roomAuto: false, area: d.areaAuto ? '' : d.area, areaAuto: false, spot: d.spot && d.spot.from === 'map' ? d.spot : null });
    }
    return ch;
}
// "9 Oct 2026, 08:12" from "2026-10-09T08:12:31"
function bulkTakenText(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso || '');
    return m ? "".concat(+m[3], " ").concat(MONTHS[+m[2] - 1] || m[2], " ").concat(m[1], ", ").concat(m[4], ":").concat(m[5]) : '';
}
// When a phone photo was taken, from its EXIF data (JPEG and iPhone HEIC). Resolves '2026-10-09T08:12:31' or '' when it does not say.
function readPhotoTaken(file) {
    return new Promise(function (resolve) {
        var jpeg = /\.(jpe?g|jfif)$/i.test((file && file.name) || '') || /jpe?g/i.test((file && file.type) || '');
        var heic = !jpeg && looksLikeHeic(file);
        if ((!jpeg && !heic) || typeof FileReader === 'undefined') {
            resolve('');
            return;
        }
        var reader = new FileReader();
        reader.onerror = function () { return resolve(''); };
        reader.onload = function () {
            try {
                var view = new DataView(reader.result);
                resolve(heic ? heicTaken(view) : exifTaken(view));
            }
            catch (e) {
                resolve('');
            }
        };
        // A JPEG keeps its EXIF in the first 64 KB; in a HEIC it can sit anywhere in the file (a few MB)
        try {
            reader.readAsArrayBuffer(heic ? file.slice(0, 16 * 1024 * 1024) : file.slice(0, 256 * 1024));
        }
        catch (e) {
            resolve('');
        }
    });
}
// A HEIC file keeps its EXIF as "Exif\0\0" and a TIFF header ("MM\0*" or "II*\0") somewhere in the file
function heicTaken(view) {
    var b = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    var n = b.length;
    for (var i = 0; i + 12 <= n; i += 1) {
        if (b[i] !== 0x45 || b[i + 1] !== 0x78 || b[i + 2] !== 0x69 || b[i + 3] !== 0x66 || b[i + 4] !== 0 || b[i + 5] !== 0)
            continue; // "Exif\0\0"
        var tiff = view.getUint32(i + 6);
        if (tiff !== 0x4D4D002A && tiff !== 0x49492A00)
            continue;
        var text = tiffTaken(view, i + 6, Math.min(n, i + 6 + 65536));
        if (text)
            return text;
    }
    return '';
}
function exifTaken(view) {
    if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8)
        return '';
    var off = 2;
    while (off + 4 <= view.byteLength) {
        var marker = view.getUint16(off);
        var size = view.getUint16(off + 2);
        // APP1 "Exif\0\0", then a TIFF header
        if (marker === 0xFFE1 && off + 10 <= view.byteLength && view.getUint32(off + 4) === 0x45786966) {
            return tiffTaken(view, off + 10, Math.min(view.byteLength, off + 2 + size));
        }
        if ((marker & 0xFF00) !== 0xFF00 || marker === 0xFFDA || size < 2)
            break;
        off += 2 + size;
    }
    return '';
}
function tiffTaken(view, start, end) {
    if (start + 8 > end)
        return '';
    var little = view.getUint16(start) === 0x4949;
    var u16 = function (o) { return view.getUint16(o, little); };
    var u32 = function (o) { return view.getUint32(o, little); };
    var ascii = function (o, n) {
        var t = '';
        for (var i = 0; i < n && o + i < end; i += 1) {
            var c = view.getUint8(o + i);
            if (!c)
                break;
            t += String.fromCharCode(c);
        }
        return t;
    };
    var readIfd = function (ifdOff, want) {
        var out = {};
        var at = start + ifdOff;
        if (ifdOff < 8 || at + 2 > end)
            return out;
        var n = u16(at);
        for (var i = 0; i < n; i += 1) {
            var e = at + 2 + i * 12;
            if (e + 12 > end)
                break;
            var tag = u16(e);
            if (want.indexOf(tag) === -1)
                continue;
            var type = u16(e + 2);
            var count = u32(e + 4);
            if (type === 2)
                out[tag] = ascii(count > 4 ? start + u32(e + 8) : e + 8, Math.min(count, 32));
            else if (type === 4 || type === 13)
                out[tag] = u32(e + 8);
        }
        return out;
    };
    var ifd0 = readIfd(u32(start + 4), [0x0132, 0x8769]);
    var text = '';
    if (ifd0[0x8769]) {
        var exif = readIfd(ifd0[0x8769], [0x9003, 0x9004]);
        text = exif[0x9003] || exif[0x9004] || '';
    }
    if (!text)
        text = ifd0[0x0132] || '';
    var m = /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(text);
    return m && m[1] !== '0000' ? "".concat(m[1], "-").concat(m[2], "-").concat(m[3], "T").concat(m[4], ":").concat(m[5], ":").concat(m[6]) : '';
}
// An issue as the lists show it, and what it says in a line
var issueTitle = function (sub) { return "".concat(categoryText(sub), " - ").concat([sub.area, sub.room].filter(Boolean).join(', ') || 'no area'); };
var issueHasPicture = function (sub) { return !!(sub && (sub.image || sub.picture)); };
var issueSummary = function (sub) { return ({ id: sub.id, title: issueTitle(sub), description: sub.description || '', closed: !!sub.closed, hasPicture: issueHasPicture(sub) }); };
// Issues for a search, from the issues the app already holds (no request): every word somewhere in the issue. Open ones
// first, the newest first. Nothing typed: the newest open issues.
function searchIssues(submissions, text) {
    var words = String(text || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    var list = (submissions || []).filter(function (sub) {
        if (!words.length)
            return !sub.closed;
        var t = searchText(sub);
        return words.every(function (w) { return t.indexOf(w) !== -1; });
    });
    var time = function (sub) { var n = new Date(sub.submittedOn).getTime(); return isNaN(n) ? 0 : n; };
    list.sort(function (a, b) { return (a.closed ? 1 : 0) - (b.closed ? 1 : 0) || time(b) - time(a); });
    return list.slice(0, BULK_SEARCH_TOP);
}
// What a new issue is saved as: the Dataverse payload and the item the map and lists show
function bulkIssuePayload(it, kit) {
    var d = it.issue;
    var eq = kit.equipmentColumns || {};
    var equipmentList = it.asset ? [{ name: it.asset.name, id: eq.idColumn ? it.asset.id : '', room: it.asset.room, area: it.asset.area }] : [];
    var taken = d.addTaken && it.taken ? "\nPhoto taken ".concat(bulkTakenText(it.taken)) : '';
    var description = "".concat(d.description.trim()).concat(taken);
    var category = d.category === 'note' ? d.customNote.trim() : d.category;
    var db = {
        craa5_mapx: parseFloat(d.spot.x.toFixed(4)),
        craa5_mapy: parseFloat(d.spot.y.toFixed(4)),
        craa5__boxwidth: parseFloat(d.spot.w.toFixed(4)),
        craa5__boxheight: parseFloat(d.spot.h.toFixed(4)),
        craa5__room: LAST_PLACES ? placeToSave(LAST_PLACES.rooms, d.room) : d.room.trim(),
        craa5__area: LAST_PLACES ? placeToSave(LAST_PLACES.areas, d.area) : d.area.trim(),
        craa5__equipment: equipmentNamesText(equipmentList),
        craa5__description: description,
        craa5__whotonotify: d.whoToNotify.trim(),
        craa5__customnote: category,
        craa5__facility: kit.mapKey || 'MAIN'
    };
    if (eq.idColumn)
        db[eq.idColumn] = equipmentIdsText(equipmentList);
    if (LAST_PLACES && LAST_PLACES.areaIdColumn)
        db[LAST_PLACES.areaIdColumn] = areaIdOf(LAST_PLACES, db.craa5__area);
    var now = new Date().toISOString();
    var local = __assign(__assign({ id: '', mapX: db.craa5_mapx, mapY: db.craa5_mapy, boxW: db.craa5__boxwidth, boxH: db.craa5__boxheight, room: db.craa5__room, area: db.craa5__area, equipmentList: equipmentList, equipment: equipmentText({ equipmentList: equipmentList }), description: description, whoToNotify: db.craa5__whotonotify }, parseCategory(category)), { closed: false, statusReason: '', image: null, picture: null, modifiedOn: now, modifiedBy: currentUserName(), submittedOn: now, submittedBy: currentUserName(), mapKey: db.craa5__facility });
    return { db: db, local: local };
}
// Picture types every browser opens, so the app can say up front that they become JPGs (a TIFF scan, say, may not open)
var opensInBrowser = function (file) { return /^image\/(png|webp|gif|bmp|avif|apng|svg\+xml)$/i.test((file && file.type) || '') || /\.(png|webp|gif|bmp|avif|apng|svg)$/i.test((file && file.name) || ''); };
// Why a file cannot go up yet ('' = ready). `places` counts the files of the list per destination.
// A file that failed for good (fatal) also waits, until something about it changes.
function bulkProblem(it, byName, places, kit) {
    if (it.status === 'done' || it.status === 'uploading')
        return '';
    if (!it.file.size)
        return 'This file is empty.';
    if (it.convertFatal && it.convertNote) {
        var why = endSentence(it.convertNote);
        return why.charAt(0).toUpperCase() + why.slice(1);
    }
    if (it.target === 'newIssue' || it.target === 'issue')
        return bulkIssueProblem(it, kit, places);
    // The equipment is being changed: it waits until one is picked (or the search is closed)
    if (it.choosing)
        return 'Pick the equipment from the search.';
    var f = byName[it.column];
    if (!f)
        return 'Choose the column it goes in.';
    if (f.kind === 'image' && !it.picture)
        return "".concat(f.label, " only takes pictures. Choose a File column.");
    if (f.kind === 'file' && f.maxKB && it.file.size > f.maxKB * 1024 && !it.picture) {
        return "Too big: ".concat(formatBytes(it.file.size), ", and ").concat(f.label, " takes at most ").concat(formatBytes(f.maxKB * 1024), ".");
    }
    if (!it.asset)
        return 'Find the equipment it belongs to.';
    if ((places["a|".concat(it.asset.id, "|").concat(it.column)] || 0) > 1) {
        return "Another file in this list also goes to ".concat(f.label, " of ").concat(it.asset.name, ". Each column holds one file: choose another column, or remove one of them.");
    }
    return '';
}
function bulkIssueProblem(it, kit, places) {
    if (!it.picture)
        return 'Only pictures can go on an issue. Send this file to equipment instead.';
    var col = kit.pictureColumn;
    if (!col || !col.ready)
        return "Issue pictures cannot be saved yet: ".concat(col ? endSentence(col.reason) : 'the issues table is still being checked.');
    if (it.target === 'issue') {
        if (it.choosingIssue)
            return 'Pick the issue from the search.';
        if (!it.existing)
            return 'Find the issue this picture belongs to.';
        if ((places["i|".concat(it.existing.id)] || 0) > 1)
            return 'Another file in this list also goes to this issue. An issue holds one picture: remove one of them.';
        return '';
    }
    // Already saved (only its picture is left): nothing about the issue can stop it now
    if (it.created)
        return '';
    if (it.choosing)
        return 'Pick the equipment from the search (or press Cancel).';
    var d = it.issue;
    if (!d)
        return 'Fill in the issue.';
    if (!d.category)
        return 'Choose the issue category.';
    if (d.category === 'note' && !d.customNote.trim())
        return 'Write the note text.';
    if (d.category === 'note' && CATEGORIES.some(function (c) { return c.key !== 'note' && c.key === d.customNote.trim().toLowerCase(); }))
        return 'That note is a category name: choose it as the category instead.';
    if (!d.description.trim())
        return 'Write a description.';
    if (!d.area.trim())
        return 'Fill in the area.';
    if (!d.spot)
        return 'Place it on the map (or pick equipment that has a map spot).';
    // A spot placed before the header's map was changed belongs to that other map
    if (d.spot.map && kit.mapKey && d.spot.map !== kit.mapKey)
        return "Its map spot was placed on the map ".concat(d.spot.map, ". Switch back to that map, or place it again on this one.");
    var eq = kit.equipmentColumns || {};
    if (it.asset && eq.equipmentMax && it.asset.name.length > eq.equipmentMax)
        return "The equipment name is longer than the Equipment column holds (".concat(eq.equipmentMax, " characters).");
    return '';
}
var bulkPlaceKey = function (it) {
    if (it.target === 'asset' && it.asset && it.column)
        return "a|".concat(it.asset.id, "|").concat(it.column);
    if (it.target === 'issue' && it.existing)
        return "i|".concat(it.existing.id);
    if (it.target === 'newIssue' && it.created)
        return "i|".concat(it.created);
    return '';
};
function AssetsBulkUpload(_a) {
    var _this = this;
    var meta = _a.meta, set = _a.set, mapColumn = _a.mapColumn, mapKey = _a.mapKey, metaDone = _a.metaDone, loadAssetMeta = _a.loadAssetMeta, onAssetSaved = _a.onAssetSaved, onEditInTable = _a.onEditInTable, issueKit = _a.issueKit, logEvent = _a.logEvent;
    var kit = issueKit || { submissions: [], pictureColumn: { ready: false, reason: 'the issues table is not available here.' }, equipmentColumns: {}, onIssueSaved: function () { }, onShowIssue: function () { } };
    var uploadFields = useMemo(function () { return (meta.fields || []).filter(function (f) { return f.kind === 'file' || f.kind === 'image'; }); }, [meta.fields]);
    var byName = useMemo(function () { var o = {}; uploadFields.forEach(function (f) { o[f.name] = f; }); return o; }, [uploadFields]);
    // The equipment columns are known (or, when the table's column list failed, the picture and file columns a row showed)
    var ready = meta.status === 'ready' || (meta.status === 'error' && uploadFields.length > 0);
    var hasImageColumn = uploadFields.some(function (f) { return f.kind === 'image'; });
    var hasFileColumn = uploadFields.some(function (f) { return f.kind === 'file'; });
    var issuesReady = !!(kit.pictureColumn && kit.pictureColumn.ready);
    var canAdd = metaDone && ((ready && uploadFields.length > 0) || issuesReady);
    // After an upload the row is read again with the equipment table's columns, so the table, the map card and the pins follow
    var rowSelect = useMemo(function () { return (meta.status === 'ready' ? assetTableSelect(meta.fields, mapColumn) : ''); }, [meta.status, meta.fields, mapColumn]);
    var expected = useMemo(function () { return expectedAssetColumns(byName); }, [byName]);
    var _b = useState(function () { return ({ picture: readColumnPick('assetPicture'), doc: readColumnPick('assetDoc') }); }), picks = _b[0], setPicks = _b[1];
    var pictureCol = useMemo(function () { return (ready ? bulkPictureColumn(uploadFields) : ''); }, [ready, uploadFields, picks.picture]);
    var docCol = useMemo(function () { return (ready ? bulkDocColumn(uploadFields) : ''); }, [ready, uploadFields, picks.doc]);
    var _c = useState([]), items = _c[0], setItems = _c[1];
    var itemsRef = useRef(items);
    itemsRef.current = items;
    var seq = useRef(0);
    var mounted = useRef(true);
    useEffect(function () { mounted.current = true; return function () { mounted.current = false; }; }, []);
    // Previews are object URLs: they are let go when their file leaves the list, and all of them when the app closes
    useEffect(function () { return function () { itemsRef.current.forEach(function (it) { if (it.preview)
        URL.revokeObjectURL(it.preview); }); }; }, []);
    var _d = useState(''), note = _d[0], setNote = _d[1];
    var _f = useState(false), running = _f[0], setRunning = _f[1];
    var runningRef = useRef(false);
    var stopRef = useRef(false);
    var _g = useState(false), stopping = _g[0], setStopping = _g[1];
    var _h = useState(false), dragging = _h[0], setDragging = _h[1];
    var _j = useState(null), viewing = _j[0], setViewing = _j[1]; // key of the picture shown large
    var _k = useState(null), placing = _k[0], setPlacing = _k[1]; // key of the file being placed on the map
    var _l = useState(false), confirmClear = _l[0], setConfirmClear = _l[1];
    var inputRef = useRef(null);
    var patchItem = useCallback(function (key, changes) {
        setItems(function (prev) { return prev.map(function (it) { return (it.key === key ? __assign(__assign({}, it), (typeof changes === 'function' ? changes(it) : changes)) : it); }); });
    }, []);
    // Files whose column the user has not chosen follow the columns: a column picked above, or a column found on "Check again"
    useEffect(function () {
        if (!ready)
            return;
        setItems(function (prev) { return prev.map(function (it) {
            if (it.columnTouched || it.status === 'done' || it.status === 'uploading')
                return it;
            var column = bulkDefaultColumn(uploadFields, it.picture, it.file.name);
            return column === it.column ? it : __assign(__assign({}, it), { column: column });
        }); });
    }, [ready, uploadFields, picks.picture, picks.doc]);
    // --- adding files ---
    var addFiles = function (fileList) {
        if (!canAdd || !fileList || !fileList.length)
            return;
        var added = [];
        var same = function (a, b) { return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified; };
        var skipped = 0;
        var notPictures = 0;
        var assetsTake = ready && uploadFields.length > 0;
        var _loop_4 = function (i) {
            var file = fileList[i];
            if (!file)
                return "continue";
            // The same file picked twice is listed once
            if (itemsRef.current.some(function (it) { return it.status !== 'done' && same(it.file, file); }) || added.some(function (it) { return same(it.file, file); })) {
                skipped += 1;
                return "continue";
            }
            // With no equipment column to take it, a document has nowhere to go (issues only take pictures)
            if (!assetsTake && !isPictureFile(file)) {
                notPictures += 1;
                return "continue";
            }
            seq.current += 1;
            var picture = isPictureFile(file);
            var heic = isHeicFile(file);
            var words = bulkNameWords(file.name);
            // With no picture or file column on the equipment table, pictures start as new issues
            var target = picture && !assetsTake ? 'newIssue' : 'asset';
            var it = {
                key: "bulk".concat(seq.current),
                file: file,
                picture: picture,
                heic: heic,
                // A HEIC photo has no preview until it is converted (Chrome and Edge cannot show it as it is)
                preview: picture && !heic ? URL.createObjectURL(file) : '',
                converting: !!(picture && heic),
                convertNote: '',
                convertFatal: false, // the conversion failed for good (a broken photo), not just because the converter could not be loaded
                target: target,
                column: ready ? bulkDefaultColumn(uploadFields, picture, file.name) : '',
                columnTouched: false,
                asset: null,
                words: words,
                suggestion: words.length ? null : { state: 'none' },
                issue: null,
                existing: null,
                taken: picture ? null : '',
                status: 'waiting',
                message: '',
                progress: null,
                sent: null
            };
            if (target === 'newIssue')
                it.issue = bulkIssueDraft(it, mapKey);
            added.push(it);
        };
        for (var i = 0; i < fileList.length; i += 1) {
            _loop_4(i);
        }
        if (added.length)
            setItems(function (prev) { return prev.concat(added); });
        setNote("".concat(added.length, " file").concat(added.length === 1 ? '' : 's', " added").concat(skipped ? "; ".concat(skipped, " already in the list") : '').concat(notPictures ? "; ".concat(notPictures, " not added: only pictures can go in now (to issues), as the equipment table has no file column the app can use") : '', "."));
        if (added.length)
            logEvent("Bulk upload: ".concat(added.length, " file").concat(added.length === 1 ? '' : 's', " added to the list."), 'info');
        // When each photo was taken (it can go in a new issue's description)
        added.forEach(function (it) {
            if (!it.picture)
                return;
            readPhotoTaken(it.file).then(function (taken) { if (mounted.current)
                patchItem(it.key, { taken: taken }); });
        });
        // HEIC photos are turned into JPGs one at a time (it takes a few seconds each); the card shows the converted picture
        var heics = added.filter(function (it) { return it.heic && it.picture; });
        if (heics.length) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var _loop_5, i, state_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                        case 1:
                            _a.sent(); // the new cards are on screen (itemsRef knows them) before the first is looked up
                            _loop_5 = function (i) {
                                var it, url, note_1, failure, e_24, _b, _c, error_33;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            it = heics[i];
                                            if (!mounted.current)
                                                return [2 /*return*/, { value: void 0 }];
                                            if (!itemsRef.current.some(function (x) { return x.key === it.key; }))
                                                return [2 /*return*/, "continue"]; // taken off the list meanwhile
                                            url = '';
                                            note_1 = '';
                                            failure = {};
                                            _d.label = 1;
                                        case 1:
                                            _d.trys.push([1, 7, , 8]);
                                            _d.label = 2;
                                        case 2:
                                            _d.trys.push([2, 4, , 6]);
                                            return [4 /*yield*/, decodePicture(it.file)];
                                        case 3:
                                            _d.sent();
                                            url = URL.createObjectURL(it.file);
                                            return [3 /*break*/, 6];
                                        case 4:
                                            e_24 = _d.sent();
                                            _c = (_b = URL).createObjectURL;
                                            return [4 /*yield*/, heicToJpegBlob(it.file)];
                                        case 5:
                                            url = _c.apply(_b, [_d.sent()]);
                                            return [3 /*break*/, 6];
                                        case 6: return [3 /*break*/, 8];
                                        case 7:
                                            error_33 = _d.sent();
                                            failure = error_33;
                                            note_1 = error_33.message;
                                            logEvent("Bulk upload: \"".concat(it.file.name, "\" could not be converted to a JPG yet: ").concat(error_33.message), 'warn');
                                            return [3 /*break*/, 8];
                                        case 8:
                                            if (!mounted.current || !itemsRef.current.some(function (x) { return x.key === it.key; })) {
                                                if (url)
                                                    URL.revokeObjectURL(url);
                                                return [2 /*return*/, "continue"];
                                            }
                                            patchItem(it.key, { preview: url, converting: false, convertNote: note_1, convertFatal: !!note_1 && !failure.retry });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            i = 0;
                            _a.label = 2;
                        case 2:
                            if (!(i < heics.length)) return [3 /*break*/, 5];
                            return [5 /*yield**/, _loop_5(i)];
                        case 3:
                            state_3 = _a.sent();
                            if (typeof state_3 === "object")
                                return [2 /*return*/, state_3.value];
                            _a.label = 4;
                        case 4:
                            i += 1;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            }); })();
        }
    };
    var onPick = function (e) {
        var files = e.target.files;
        // Copied out before the input is cleared (clearing empties the list the browser handed over)
        var list = [];
        for (var i = 0; files && i < files.length; i += 1)
            list.push(files[i]);
        e.target.value = '';
        addFiles(list);
    };
    var dragHasFiles = function (e) {
        var types = e.dataTransfer && e.dataTransfer.types;
        if (!types)
            return false;
        for (var i = 0; i < types.length; i += 1)
            if (types[i] === 'Files')
                return true;
        return false;
    };
    var onDragOver = function (e) {
        if (!dragHasFiles(e))
            return;
        e.preventDefault();
        if (e.dataTransfer)
            e.dataTransfer.dropEffect = canAdd ? 'copy' : 'none';
        if (!dragging)
            setDragging(true);
    };
    var onDragLeave = function (e) {
        // Only when the pointer leaves the whole view, not when it moves between its parts
        if (e.currentTarget.contains && e.relatedTarget && e.currentTarget.contains(e.relatedTarget))
            return;
        setDragging(false);
    };
    var onDrop = function (e) {
        if (!dragHasFiles(e))
            return;
        e.preventDefault();
        setDragging(false);
        var files = e.dataTransfer.files;
        var list = [];
        for (var i = 0; files && i < files.length; i += 1)
            list.push(files[i]);
        addFiles(list);
    };
    var removeItem = function (key) {
        var it = itemsRef.current.find(function (x) { return x.key === key; });
        if (!it || it.status === 'uploading')
            return;
        if (it.preview)
            URL.revokeObjectURL(it.preview);
        if (viewing === key)
            setViewing(null);
        if (placing === key)
            setPlacing(null);
        setItems(function (prev) { return prev.filter(function (x) { return x.key !== key; }); });
    };
    var clearWhere = function (test) {
        var gone = itemsRef.current.filter(function (it) { return it.status !== 'uploading' && test(it); });
        gone.forEach(function (it) { if (it.preview)
            URL.revokeObjectURL(it.preview); });
        var keys = gone.map(function (it) { return it.key; });
        if (viewing && keys.indexOf(viewing) !== -1)
            setViewing(null);
        if (placing && keys.indexOf(placing) !== -1)
            setPlacing(null);
        setItems(function (prev) { return prev.filter(function (it) { return keys.indexOf(it.key) === -1; }); });
    };
    // --- where a file goes, its equipment, its issue ---
    var retarget = useCallback(function (key, target) {
        patchItem(key, function (it) {
            if (it.created || it.status === 'done' || it.status === 'uploading' || it.target === target)
                return {};
            return {
                target: target,
                status: it.status === 'error' ? 'waiting' : it.status,
                message: '',
                fatal: false,
                choosing: false,
                choosingIssue: false,
                issue: target === 'newIssue' ? (it.issue || bulkIssueDraft(it, mapKey)) : it.issue
            };
        });
    }, [patchItem, mapKey]);
    var chooseAsset = useCallback(function (key, asset) { return patchItem(key, function (it) { return (asset ? bulkWithAsset(it, asset, mapKey) : bulkWithoutAsset(it)); }); }, [patchItem, mapKey]);
    var setIssueField = useCallback(function (key, field, value) {
        patchItem(key, function (it) {
            var _a;
            // Not while it is being sent or once saved: what is shown must be what was sent
            if (!it.issue || it.created || it.status === 'uploading' || it.status === 'done')
                return {};
            var issue = __assign(__assign({}, it.issue), (_a = {}, _a[field] = value, _a));
            if (field === 'room')
                issue.roomAuto = false;
            if (field === 'area')
                issue.areaAuto = false;
            return { issue: issue, status: it.status === 'error' ? 'waiting' : it.status, message: '', fatal: false };
        });
    }, [patchItem]);
    // The category, note and who-to-notify of one new issue, for every other new issue of the list
    var shareIssueDetails = useCallback(function (key) {
        setItems(function (prev) {
            var from = prev.find(function (x) { return x.key === key; });
            if (!from || !from.issue)
                return prev;
            var d = from.issue;
            return prev.map(function (x) { return ((x.key !== key && x.target === 'newIssue' && x.issue && !x.created && x.status !== 'done' && x.status !== 'uploading')
                ? __assign(__assign({}, x), { issue: __assign(__assign(__assign({}, x.issue), { category: d.category, customNote: d.customNote }), ((d.whoToNotify || '').trim() ? { whoToNotify: d.whoToNotify } : {})), status: x.status === 'error' ? 'waiting' : x.status, fatal: false }) : x); });
        });
    }, []);
    // --- suggestions from file names, a few lookups at a time ---
    var suggesting = useRef(0);
    var _m = useState(0), suggestTick = _m[0], setSuggestTick = _m[1];
    useEffect(function () {
        if (!ready || meta.status !== 'ready')
            return;
        var waiting = items.filter(function (it) { return it.suggestion === null; });
        var free = BULK_SUGGEST_AT_ONCE - suggesting.current;
        if (!waiting.length || free <= 0)
            return;
        waiting.slice(0, free).forEach(function (it) {
            suggesting.current += 1;
            patchItem(it.key, { suggestion: { state: 'looking' } });
            suggestBulkAsset(set, it.file.name, it.words, uploadFields, mapColumn)
                .then(function (suggestion) { if (mounted.current)
                patchItem(it.key, { suggestion: suggestion }); })
                .catch(function (error) {
                if (mounted.current)
                    patchItem(it.key, { suggestion: { state: 'error', text: it.words.join(' '), message: error.message } });
            })
                .then(function () {
                suggesting.current -= 1;
                if (mounted.current)
                    setSuggestTick(function (t) { return t + 1; });
            });
        });
    }, [items, ready, meta.status, suggestTick, set, uploadFields, mapColumn, patchItem]);
    // --- what is ready ---
    var places = useMemo(function () {
        var o = {};
        items.forEach(function (it) { var k = bulkPlaceKey(it); if (k)
            o[k] = (o[k] || 0) + 1; });
        return o;
    }, [items]);
    var problems = useMemo(function () {
        var o = {};
        items.forEach(function (it) { o[it.key] = bulkProblem(it, byName, places, kit); });
        return o;
    }, [items, byName, places, kit]);
    var readyItems = items.filter(function (it) { return (it.status === 'waiting' || it.status === 'error') && !it.fatal && !problems[it.key]; });
    var needItems = items.filter(function (it) { return it.status !== 'done' && it.status !== 'uploading' && (problems[it.key] || it.fatal); });
    var replacingItems = readyItems.filter(function (it) { return bulkReplaces(it, byName, kit); });
    var doneItems = items.filter(function (it) { return it.status === 'done'; });
    var suggestedItems = items.filter(function (it) { return !it.asset && it.target !== 'issue' && !it.created && it.status !== 'done' && it.suggestion && it.suggestion.state === 'one'; });
    var open = function (it) { return it.status !== 'done' && it.status !== 'uploading' && !it.created; };
    var picturesNotIssues = items.filter(function (it) { return open(it) && it.picture && it.target !== 'newIssue'; });
    var picturesNotAssets = items.filter(function (it) { return open(it) && it.picture && it.target !== 'asset'; });
    var assetDocs = items.filter(function (it) { return open(it) && !it.picture && it.target === 'asset'; });
    var useAllSuggestions = function () {
        setItems(function (prev) { return prev.map(function (it) { return ((!it.asset && !it.choosing && it.target !== 'issue' && !it.created && it.status !== 'done' && it.status !== 'uploading' && it.suggestion && it.suggestion.state === 'one')
            ? __assign(__assign({}, it), bulkWithAsset(it, it.suggestion.asset, mapKey)) : it); }); });
    };
    var retargetAll = function (list, target) { list.forEach(function (it) { return retarget(it.key, target); }); };
    var setDocColumnForAll = function (column) {
        if (!column)
            return;
        setItems(function (prev) { return prev.map(function (it) { return ((open(it) && !it.picture && it.target === 'asset')
            ? __assign(__assign({}, it), { column: column, columnTouched: true, status: it.status === 'error' ? 'waiting' : it.status, message: '', fatal: false }) : it); }); });
    };
    var pickColumn = function (role, name) {
        writeColumnPick(role === 'picture' ? 'assetPicture' : 'assetDoc', name);
        setPicks(function (p) {
            var _a;
            return (__assign(__assign({}, p), (_a = {}, _a[role] = name, _a)));
        });
    };
    // "Upload anyway?" when some files take the place of a stored file (it hides once none of the ready files does)
    var _o = useState(false), confirmReplace = _o[0], setConfirmReplace = _o[1];
    // A question left open on an emptied list must not come back with the next files
    useEffect(function () { if (!items.length) {
        setConfirmClear(false);
        setConfirmReplace(false);
    } }, [items.length]);
    // --- uploading, one file at a time ---
    var readRow = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_34;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!rowSelect)
                        return [2 /*return*/, getJson("".concat(set, "(").concat(id, ")"), ANNOTATIONS)];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getJson("".concat(set, "(").concat(id, ")?$select=").concat(rowSelect), ANNOTATIONS)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_34 = _a.sent();
                    if (error_34.status !== 400)
                        throw error_34;
                    return [2 /*return*/, getJson("".concat(set, "(").concat(id, ")"), ANNOTATIONS)];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var uploadToAsset = function (it) { return __awaiter(_this, void 0, void 0, function () {
        var f, asset, up, error_35, result, stored_1, withStored_1, sent_1, row, error_36;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = byName[it.column];
                    asset = it.asset;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, prepareAssetUpload(it.file, f)];
                case 2:
                    up = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_35 = _a.sent();
                    if (!error_35.retry)
                        error_35.fatal = true; // this file cannot go in this column as it is (a converter that could not load can be tried again)
                    throw error_35;
                case 4: return [4 /*yield*/, uploadAssetFile(set, asset.id, f.name, up.body, up.name, logEvent, {
                        mimeType: up.mimeType,
                        onProgress: function (p) { if (mounted.current)
                            patchItem(it.key, { progress: p }); }
                    })];
                case 5:
                    result = _a.sent();
                    if (mounted.current) {
                        stored_1 = { has: true, name: f.kind === 'file' ? result.fileName : '' };
                        withStored_1 = function (a) {
                            var _a;
                            return (a && a.id === asset.id ? __assign(__assign({}, a), { current: __assign(__assign({}, (a.current || {})), (_a = {}, _a[f.name] = stored_1, _a)) }) : a);
                        };
                        sent_1 = { kind: 'asset', route: result.route, fileName: result.fileName, bytes: result.bytes, shrunk: up.shrunk, convertedFrom: up.convertedFrom, column: f.name, label: f.label, path: "".concat(set, "(").concat(asset.id, ")/").concat(f.name) };
                        setItems(function (prev) { return prev.map(function (x) {
                            var sug = x.suggestion && x.suggestion.asset ? __assign(__assign({}, x.suggestion), { asset: withStored_1(x.suggestion.asset) }) : x.suggestion;
                            if (x.key === it.key)
                                return __assign(__assign({}, x), { status: 'done', progress: null, message: '', fatal: false, sent: sent_1, suggestion: sug });
                            return __assign(__assign({}, x), { asset: withStored_1(x.asset), suggestion: sug });
                        }); });
                    }
                    logEvent("Bulk upload: \"".concat(result.fileName, "\" went to ").concat(f.label, " of ").concat(asset.name, "."), 'success');
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, readRow(asset.id)];
                case 7:
                    row = _a.sent();
                    if (mounted.current)
                        onAssetSaved(row, 'bulk', false);
                    return [3 /*break*/, 9];
                case 8:
                    error_36 = _a.sent();
                    logEvent("".concat(asset.name, " could not be read again after the upload: ").concat(error_36.message), 'warn');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var uploadToIssue = function (it) { return __awaiter(_this, void 0, void 0, function () {
        var col, dataUrl, error_37, bytes, id, createdNow, payload, p, newId, path, error_38, when, sent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    col = kit.pictureColumn;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, compressImage(it.file)];
                case 2:
                    dataUrl = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_37 = _a.sent();
                    if (it.target === 'newIssue' && it.created) {
                        // It was read fine when its issue was saved: only its picture is left, so it stays ready to try again
                        error_37.message = "The issue was saved, but its picture could not be prepared: ".concat(error_37.message);
                        error_37.retry = true;
                    }
                    else if (!error_37.retry) {
                        error_37.fatal = true; // (a converter that could not load can be tried again)
                    }
                    throw error_37;
                case 4:
                    bytes = dataUrlToBytes(dataUrl).length;
                    id = it.target === 'issue' ? it.existing.id : (it.created || '');
                    createdNow = null;
                    payload = it.payload || null;
                    if (!(it.target === 'newIssue' && !id)) return [3 /*break*/, 6];
                    p = bulkIssuePayload(it, kit);
                    payload = p.db;
                    newId = it.pendingId || newGuid();
                    if (!it.pendingId && mounted.current)
                        patchItem(it.key, { pendingId: newId });
                    logEvent("Bulk upload: creating an issue for \"".concat(it.file.name, "\"..."), 'data', p.db, { method: 'PATCH', path: "".concat(DATAVERSE_SCHEMA.TableName, "(").concat(newId, ")"), contentType: 'application/json' });
                    return [4 /*yield*/, createObservation(p.db, newId)];
                case 5:
                    id = _a.sent();
                    createdNow = __assign(__assign({}, p.local), { id: id });
                    // Saved: from here on only its picture is left, so a retry never makes a second issue
                    if (mounted.current)
                        patchItem(it.key, { created: id, createdItem: createdNow, payload: p.db });
                    kit.onIssueSaved(createdNow, true);
                    logEvent("Bulk upload: issue ".concat(id, " created."), 'success');
                    _a.label = 6;
                case 6:
                    path = "".concat(DATAVERSE_SCHEMA.TableName, "(").concat(id, ")/").concat(col.name);
                    logEvent("Bulk upload: picture of \"".concat(it.file.name, "\" to ").concat(path, " (").concat(formatBytes(bytes), ")..."), 'data', { column: col.name, id: id, bytes: bytes }, { method: 'PATCH', path: path, contentType: 'application/octet-stream' });
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, uploadPicture(col.name, id, dataUrl)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_38 = _a.sent();
                    if (it.target === 'newIssue') {
                        error_38.message = "The issue was saved, but its picture could not be uploaded: ".concat(error_38.message);
                        error_38.retry = true; // the issue exists and cannot change any more: only sending its picture again is left
                    }
                    throw error_38;
                case 10:
                    when = new Date().toISOString();
                    kit.onIssueSaved({ id: id, image: dataUrl, picture: null, modifiedOn: when, modifiedBy: currentUserName() }, false);
                    sent = {
                        kind: it.target,
                        id: id,
                        path: path,
                        bytes: bytes,
                        payload: payload,
                        title: it.target === 'issue' ? it.existing.title : issueTitle(createdNow || it.createdItem || { category: 'note', area: '' })
                    };
                    if (mounted.current)
                        patchItem(it.key, { status: 'done', progress: null, message: '', fatal: false, sent: sent });
                    logEvent("Bulk upload: \"".concat(it.file.name, "\" ").concat(it.target === 'issue' ? 'added to' : 'is the picture of', " issue ").concat(id, "."), 'success');
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadAll = function (replaceOk) { return __awaiter(_this, void 0, void 0, function () {
        var queue, done, failed, _loop_6, k, state_4, left;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (runningRef.current)
                        return [2 /*return*/];
                    queue = readyItems.map(function (it) { return it.key; });
                    if (!queue.length)
                        return [2 /*return*/];
                    // Files that take the place of a stored SOP or picture are asked about first, as removing a file is
                    if (replacingItems.length && replaceOk !== true) {
                        setConfirmReplace(true);
                        return [2 /*return*/];
                    }
                    setConfirmReplace(false);
                    runningRef.current = true;
                    stopRef.current = false;
                    setRunning(true);
                    setStopping(false);
                    setConfirmClear(false);
                    setNote("Uploading ".concat(queue.length, " file").concat(queue.length === 1 ? '' : 's', "..."));
                    done = 0;
                    failed = 0;
                    _loop_6 = function (k) {
                        var now, it, counts, where, error_39, fatal;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (stopRef.current || !mounted.current)
                                        return [2 /*return*/, "break"];
                                    now = itemsRef.current;
                                    it = now.find(function (x) { return x.key === queue[k]; });
                                    if (!it || it.fatal || (it.status !== 'waiting' && it.status !== 'error'))
                                        return [2 /*return*/, "continue"];
                                    counts = {};
                                    now.forEach(function (x) { var c = bulkPlaceKey(x); if (c)
                                        counts[c] = (counts[c] || 0) + 1; });
                                    if (bulkProblem(it, byName, counts, kit))
                                        return [2 /*return*/, "continue"];
                                    patchItem(it.key, { status: 'uploading', message: '', progress: null, sent: null });
                                    where = it.target === 'asset' ? "".concat((byName[it.column] || {}).label, " of ").concat(it.asset.name) : (it.target === 'issue' ? "issue ".concat(it.existing.id) : 'a new issue');
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, , 7]);
                                    if (!(it.target === 'asset')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, uploadToAsset(it)];
                                case 2:
                                    _b.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, uploadToIssue(it)];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    done += 1;
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_39 = _b.sent();
                                    failed += 1;
                                    fatal = !error_39.retry && (!!error_39.fatal || (error_39.status >= 400 && error_39.status < 500 && error_39.status !== 408 && error_39.status !== 429));
                                    logEvent("Bulk upload of \"".concat(it.file.name, "\" to ").concat(where, " failed: ").concat(error_39.message), 'error');
                                    if (mounted.current)
                                        patchItem(it.key, { status: 'error', progress: null, message: error_39.message, fatal: fatal });
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    };
                    k = 0;
                    _a.label = 1;
                case 1:
                    if (!(k < queue.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_6(k)];
                case 2:
                    state_4 = _a.sent();
                    if (state_4 === "break")
                        return [3 /*break*/, 4];
                    _a.label = 3;
                case 3:
                    k += 1;
                    return [3 /*break*/, 1];
                case 4:
                    runningRef.current = false;
                    if (!mounted.current)
                        return [2 /*return*/];
                    setRunning(false);
                    setStopping(false);
                    left = queue.length - done - failed;
                    setNote("".concat(done, " uploaded").concat(failed ? ", ".concat(failed, " not done (the red notes say why)") : '').concat(left > 0 ? ", ".concat(left, " not started") : '', "."));
                    return [2 /*return*/];
            }
        });
    }); };
    var stop = function () { stopRef.current = true; setStopping(true); };
    // --- the picture shown large, the file being placed on the map ---
    var viewed = viewing ? items.find(function (it) { return it.key === viewing; }) : null;
    useEffect(function () {
        if (!viewing)
            return undefined;
        var onKey = function (e) { if (e.key === 'Escape')
            setViewing(null); };
        window.addEventListener('keydown', onKey);
        return function () { return window.removeEventListener('keydown', onKey); };
    }, [viewing]);
    // The picker closes by itself once its file is being sent or saved (its spot can no longer change)
    var placed = placing ? items.find(function (it) { return it.key === placing && !it.created && it.status !== 'uploading' && it.status !== 'done'; }) : null;
    var showIssue = function (id) {
        var sub = (kit.submissions || []).find(function (x) { return x.id === id; });
        if (sub)
            kit.onShowIssue(sub);
    };
    var columnChip = function (f) { return (React.createElement("li", { key: f.name, className: "inline-flex flex-wrap items-center gap-1 max-w-full rounded-2xl border border-green-200 bg-green-50 text-green-900 px-2 py-0.5" },
        React.createElement(CheckCircle, { className: "w-3 h-3" }),
        React.createElement("span", { className: "font-bold" }, f.label),
        React.createElement("span", { className: "font-mono text-[10px] text-green-800/80 break-all min-w-0" }, f.name),
        React.createElement("span", null,
            f.kind === 'image' ? 'Image' : 'File',
            f.maxKB ? ", up to ".concat(formatBytes(f.maxKB * 1024)) : '',
            f.inferred ? ', found from a row' : ''))); };
    var pictureExpected = expected.filter(function (c) { return c.role === 'picture'; })[0];
    var docExpected = expected.filter(function (c) { return c.role === 'doc'; })[0];
    var missingDocs = expected.filter(function (c) { return c.role === 'doc' && !c.found; });
    var eq = kit.equipmentColumns || {};
    return (React.createElement("div", { className: "h-full flex flex-col bg-slate-100 overflow-hidden relative", "data-testid": "assets-bulk-view", onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: onDrop },
        React.createElement("div", { className: "flex-1 min-h-0 overflow-y-auto p-3 md:p-6 pt-3 md:pt-4 flex flex-col gap-3", "data-bulk-scroll": "" },
            React.createElement("div", { className: "shrink-0" },
                React.createElement("h2", { className: "text-2xl font-black text-[#00468B]" }, "Bulk upload"),
                React.createElement("p", { className: "text-sm text-slate-500" }, "Add pictures and documents. Send each one to a piece of equipment, make a picture a new issue, or add it to an issue, then press Save to Dataverse at the bottom to save them all at once.")),
            !metaDone && React.createElement("p", { className: "text-sm text-slate-500", role: "status" }, "Reading the equipment table's columns..."),
            metaDone && !ready && (React.createElement("div", { className: "shrink-0 text-sm text-[#C4001F] bg-white rounded-lg border border-slate-200 p-3", role: "alert" },
                "The Assets table's columns could not be read",
                meta.error ? ": ".concat(meta.error) : '.',
                React.createElement("button", { type: "button", onClick: loadAssetMeta, className: "ml-2 text-[#0072CE] underline" }, "Try again"))),
            metaDone && (React.createElement("details", { className: "shrink-0 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700", "data-testid": "bulk-columns", open: !hasImageColumn || !hasFileColumn || !issuesReady || !!picks.picture || !!picks.doc || missingDocs.length > 0 || (!!eq.typed && !eq.picked) },
                React.createElement("summary", { className: "font-bold text-slate-800 cursor-pointer" }, "Dataverse columns this tab uses"),
                React.createElement("p", { className: "font-bold text-slate-800 mt-2" },
                    "Equipment table (",
                    ASSET_LOGICAL_NAME,
                    ")"),
                ready && (React.createElement("ul", { className: "flex flex-wrap gap-1.5 mt-1.5" },
                    uploadFields.map(columnChip),
                    missingDocs.map(function (c) { return (React.createElement("li", { key: c.name, className: "inline-flex flex-wrap items-center gap-1 max-w-full rounded-2xl border border-slate-300 bg-slate-50 text-slate-600 px-2 py-0.5", "data-missing": c.name },
                        React.createElement("span", { className: "font-bold" }, "Not found:"),
                        " ",
                        c.label,
                        " ",
                        React.createElement("span", { className: "font-mono text-[10px] break-all" }, c.name),
                        " (File)")); }))),
                ready && (React.createElement("div", { className: "mt-1.5 flex flex-col gap-1.5" },
                    React.createElement(ColumnFix, { need: "Equipment pictures", expected: ASSET_PICTURE_COLUMN, expectedLabel: ASSET_KNOWN_LABELS[ASSET_PICTURE_COLUMN], expectedType: "Image", found: pictureCol, candidates: uploadFields.filter(function (f) { return f.kind === 'image'; }).concat(uploadFields.filter(function (f) { return f.kind === 'file'; })), picked: picks.picture && pictureCol === picks.picture ? picks.picture : '', typed: picks.picture || '', onPick: function (name) { return pickColumn('picture', name); }, onRecheck: loadAssetMeta, checking: meta.status === 'loading' || !!meta.rechecking, checkError: meta.recheckError, testId: "bulk-picture-fix" }),
                    React.createElement(ColumnFix, { need: "Equipment documents (SOPs)", expected: ASSET_DOC_COLUMNS[0], expectedLabel: ASSET_KNOWN_LABELS[ASSET_DOC_COLUMNS[0]], expectedType: "File", found: docCol, candidates: uploadFields.filter(function (f) { return f.kind === 'file'; }), picked: picks.doc && docCol === picks.doc ? picks.doc : '', typed: picks.doc || '', onPick: function (name) { return pickColumn('doc', name); }, onRecheck: loadAssetMeta, checking: meta.status === 'loading' || !!meta.rechecking, checkError: meta.recheckError, testId: "bulk-doc-fix" }),
                    React.createElement(ColumnFix, { need: "Map spot column", message: mapColumn ? '' : (meta.mapReason || ''), expected: "craa5_maplocation", expectedLabel: "Map Location", expectedType: "Single line of text", found: mapColumn || '', candidates: (meta.fields || []).filter(function (f) { return (f.kind === 'text' || f.kind === 'memo') && f.canUpdate && !f.isPrimaryName && ASSET_MAP_NOT_THESE.indexOf(f.name) === -1; }), picked: meta.mapPicked ? mapColumn : '', typed: readColumnPick('assetMap'), typedWhy: meta.mapTypedWhy || '', onPick: function (name) { writeColumnPick('assetMap', name); loadAssetMeta(); }, onRecheck: loadAssetMeta, checking: meta.status === 'loading' || !!meta.rechecking, checkError: meta.recheckError, testId: "bulk-map-fix" }))),
                React.createElement("p", { className: "font-bold text-slate-800 mt-3" },
                    "Issues (",
                    OBSERVATION_LOGICAL_NAME,
                    ")"),
                React.createElement("p", { className: "mt-1" },
                    "A new issue is saved with ",
                    React.createElement("span", { className: "font-mono [overflow-wrap:anywhere]" }, ISSUE_COLUMNS.join(', ')),
                    eq.idColumn ? React.createElement(React.Fragment, null,
                        ", the equipment id in ",
                        React.createElement("span", { className: "font-mono" }, eq.idColumn)) : null,
                    "; its picture goes in its own request."),
                !eq.idColumn && React.createElement("p", { className: "mt-1 text-slate-500" },
                    "Equipment is saved by name only: ",
                    endSentence(eq.reason || 'the observations table has no equipment id column.')),
                React.createElement("div", { className: "mt-1.5 flex flex-col gap-1.5" },
                    React.createElement(ColumnFix, { need: "Equipment ids (link each issue to its equipment)", expected: "craa5_equipmentguids", expectedLabel: "Equipment GUIDs", expectedType: "Multiple lines of text", found: eq.idColumn || '', message: !eq.idColumn && (eq.lookupFailed || eq.idsUnknown) ? endSentence(eq.reason || 'the app could not check the observations table.') : '', candidates: eq.candidates || [], picked: eq.picked || '', typed: eq.typed || '', typedWhy: eq.typedWhy || '', onPick: kit.equipmentFix ? kit.equipmentFix.pick : function () { }, onRecheck: kit.equipmentFix ? kit.equipmentFix.recheck : null, checking: kit.equipmentFix ? kit.equipmentFix.checking : false, checkError: kit.equipmentFix ? kit.equipmentFix.error : '', testId: "bulk-equipment-ids-fix" }),
                    React.createElement(ColumnFix, { need: "Issue pictures", expected: issuesReady ? '' : 'craa5_pictureof', expectedLabel: "Picture", expectedType: "Image", found: issuesReady ? kit.pictureColumn.name : '', message: issuesReady || kit.pictureColumn.missing ? '' : kit.pictureColumn.reason, candidates: kit.pictureColumn.candidates || [], picked: kit.pictureColumn.picked || '', typed: kit.pictureFix ? kit.pictureFix.typed : '', onPick: kit.pictureFix ? kit.pictureFix.pick : function () { }, onRecheck: kit.pictureFix ? kit.pictureFix.recheck : null, checking: kit.pictureFix ? kit.pictureFix.checking : false, testId: "bulk-issue-picture-fix" })))),
            React.createElement("div", { className: "shrink-0 rounded-xl border-2 border-dashed p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center transition-colors ".concat(dragging && canAdd ? 'border-[#0072CE] bg-[#E6F1FB]' : 'border-[#B3D4F2] bg-white'), "data-testid": "bulk-drop" },
                React.createElement(ImageIcon, { className: "w-8 h-8 text-[#0072CE] shrink-0" }),
                React.createElement("p", { className: "text-sm text-slate-600" },
                    canAdd ? (ready && uploadFields.length > 0 ? 'Drop pictures and documents here, or' : 'Drop pictures here, or') : (metaDone ? 'Files can be added once the equipment table has a picture or file column, or issues can take pictures (see above).' : 'Files can be added once the columns above are known.'),
                    canAdd && React.createElement("span", { className: "block text-[11px] text-slate-500" }, "Every picture (PNG, WebP, iPhone HEIC ...) is converted to a JPG automatically.")),
                React.createElement("input", { ref: inputRef, type: "file", multiple: true, onChange: onPick, className: "hidden", "aria-label": "Choose pictures and documents to upload", "data-testid": "bulk-input" }),
                React.createElement("button", { type: "button", disabled: !canAdd, onClick: function () { return inputRef.current && inputRef.current.click(); }, className: "bg-[#0072CE] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#00468B] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" }, "Choose files")),
            items.length > 0 && (React.createElement("div", { className: "shrink-0 flex flex-wrap items-center gap-2 text-xs" },
                React.createElement("span", { className: "font-bold text-slate-700" },
                    items.length,
                    " file",
                    items.length === 1 ? '' : 's'),
                suggestedItems.length > 0 && (React.createElement("button", { type: "button", onClick: useAllSuggestions, className: "px-2.5 py-1 rounded-md font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB]", "data-testid": "bulk-use-all" },
                    "Use all suggestions (",
                    suggestedItems.length,
                    ")")),
                picturesNotIssues.length > 0 && (React.createElement("button", { type: "button", onClick: function () { return retargetAll(picturesNotIssues, 'newIssue'); }, className: "px-2.5 py-1 rounded-md font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB]", "data-testid": "bulk-all-issues" },
                    "Make every picture a new issue (",
                    picturesNotIssues.length,
                    ")")),
                picturesNotAssets.length > 0 && uploadFields.length > 0 && (React.createElement("button", { type: "button", onClick: function () { return retargetAll(picturesNotAssets, 'asset'); }, className: "px-2.5 py-1 rounded-md font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB]", "data-testid": "bulk-all-assets" },
                    "Send every picture to equipment (",
                    picturesNotAssets.length,
                    ")")),
                assetDocs.length > 0 && uploadFields.some(function (f) { return f.kind === 'file'; }) && (React.createElement("label", { className: "inline-flex items-center gap-1" },
                    React.createElement("span", { className: "font-bold text-slate-600" }, "Every document in"),
                    React.createElement("select", { value: "", onChange: function (e) { return setDocColumnForAll(e.target.value); }, "aria-label": "Column for every document", className: "border border-slate-300 rounded-md px-1.5 py-1 text-xs bg-white", "data-testid": "bulk-doc-all" },
                        React.createElement("option", { value: "" }, "Choose..."),
                        uploadFields.filter(function (f) { return f.kind === 'file'; }).map(function (f) { return React.createElement("option", { key: f.name, value: f.name }, f.label); })))),
                !running && (confirmClear ? (React.createElement("span", { className: "inline-flex items-center gap-1.5 bg-[#FFF6E0] border border-[#FFB81C] rounded-md px-2 py-1" },
                    "Take every file off this list? Nothing is deleted from Dataverse.",
                    React.createElement("button", { type: "button", onClick: function () { clearWhere(function () { return true; }); setConfirmClear(false); setNote(''); }, className: "font-bold text-[#C4001F] underline" }, "Clear list"),
                    React.createElement("button", { type: "button", onClick: function () { return setConfirmClear(false); }, className: "font-bold text-slate-600 underline" }, "Keep"))) : (React.createElement("button", { type: "button", onClick: function () { return setConfirmClear(true); }, className: "px-2.5 py-1 rounded-md font-bold border border-slate-300 bg-white text-slate-600 hover:bg-slate-100" }, "Clear list"))))),
            items.length > 0 && (React.createElement("ul", { className: "grid gap-2 xl:grid-cols-2 pb-2", "aria-label": "Files to upload" }, items.map(function (it) { return (React.createElement(BulkFileCard, { key: it.key, it: it, problem: problems[it.key], fields: uploadFields, byName: byName, set: set, mapColumn: mapColumn, kit: kit, onChange: patchItem, onRetarget: retarget, onChooseAsset: chooseAsset, onIssueField: setIssueField, onShareIssue: shareIssueDetails, onPlace: setPlacing, onShowIssue: showIssue, onRemove: removeItem, onView: setViewing, onEditInTable: onEditInTable })); })))),
        React.createElement("div", { className: "shrink-0 border-t-4 border-[#FFB81C] bg-white px-3 md:px-6 py-2 flex flex-wrap items-center gap-2 text-xs", "data-testid": "bulk-bar" },
            React.createElement("span", { className: "text-slate-700", role: "status" }, items.length === 0 ? (React.createElement(React.Fragment, null, "No files yet. Add pictures or documents above, then save them to Dataverse here.")) : (React.createElement(React.Fragment, null,
                React.createElement("b", null, readyItems.length),
                " ready, ",
                React.createElement("b", null, needItems.length),
                " need something, ",
                React.createElement("b", null, doneItems.length),
                " uploaded",
                replacingItems.length > 0 && React.createElement("span", { className: "text-[#7A5200]" },
                    "; ",
                    React.createElement("b", null, replacingItems.length),
                    " replace",
                    replacingItems.length === 1 ? 's' : '',
                    " a stored file"),
                !running && readyItems.length === 0 && needItems.length > 0 && (React.createElement("span", { className: "block text-[#7A5200]", "data-testid": "bulk-save-why" }, "Nothing can be saved yet: each file says in amber what it still needs (for example its equipment or its map spot)."))))),
            React.createElement("span", { className: "flex-1" }),
            note && React.createElement("span", { className: "text-slate-600", "data-testid": "bulk-note" }, note),
            !running && confirmReplace && replacingItems.length > 0 ? (React.createElement("span", { className: "inline-flex flex-wrap items-center gap-1.5 bg-[#FFF6E0] border border-[#FFB81C] rounded-md px-2 py-1", "data-testid": "bulk-confirm-replace", role: "alert" },
                replacingItems.length === 1 ? '1 of these takes the place of a file or picture already stored.' : "".concat(replacingItems.length, " of these take the place of a file or picture already stored."),
                " Upload anyway?",
                React.createElement("button", { type: "button", onClick: function () { return uploadAll(true); }, className: "px-2 py-0.5 rounded font-bold bg-[#0072CE] text-white hover:bg-[#00468B]" }, "Upload anyway"),
                React.createElement("button", { type: "button", onClick: function () { return setConfirmReplace(false); }, className: "px-2 py-0.5 rounded font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" }, "Not yet"))) : running ? (React.createElement("button", { type: "button", onClick: stop, disabled: stopping, className: "px-3 py-1.5 rounded-md font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-60" }, stopping ? 'Stopping after this file...' : 'Stop after this file')) : (React.createElement("button", { type: "button", onClick: uploadAll, disabled: readyItems.length === 0, title: readyItems.length === 0 ? 'Nothing is ready to save yet' : "Save the ".concat(readyItems.length, " ready file").concat(readyItems.length === 1 ? '' : 's', " to Dataverse"), className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-[#0072CE] text-white hover:bg-[#00468B] shadow-sm disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed", "data-testid": "bulk-upload" },
                React.createElement(UploadIcon, { className: "w-4 h-4" }),
                " Save to Dataverse (",
                readyItems.length,
                ")")),
            doneItems.length > 0 && (React.createElement("button", { type: "button", onClick: function () { return clearWhere(function (it) { return it.status === 'done'; }); }, className: "px-3 py-1.5 rounded-md font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" },
                "Clear uploaded (",
                doneItems.length,
                ")"))),
        dragging && canAdd && (React.createElement("div", { className: "absolute inset-0 pointer-events-none border-4 border-[#0072CE] rounded-lg bg-[#0072CE]/5 flex items-center justify-center" },
            React.createElement("span", { className: "bg-white text-[#00468B] font-bold text-sm rounded-lg px-4 py-2 shadow" }, "Drop to add"))),
        viewed && viewed.preview && (React.createElement("div", { className: "fixed inset-0 z-[120] bg-black/80 flex flex-col p-3 md:p-6", role: "dialog", "aria-modal": "true", "aria-label": "Picture ".concat(viewed.file.name), onClick: function () { return setViewing(null); } },
            React.createElement("div", { className: "shrink-0 flex items-center gap-2 text-white mb-2" },
                React.createElement("span", { className: "font-bold truncate flex-1 min-w-0" }, viewed.file.name),
                React.createElement("button", { type: "button", onClick: function () { return setViewing(null); }, className: "px-3 py-1.5 rounded-md text-sm font-bold bg-white text-[#00468B] hover:bg-slate-100" }, "Close")),
            React.createElement("div", { className: "flex-1 min-h-0 flex items-center justify-center" },
                React.createElement("img", { src: viewed.preview, alt: viewed.file.name, className: "max-w-full max-h-full object-contain", onClick: function (e) { return e.stopPropagation(); } })))),
        placed && placed.issue && (React.createElement(BulkSpotPicker, { mapImage: kit.mapImage, fileName: placed.file.name, preview: placed.preview, value: placed.issue.spot, onPick: function (spot) { setIssueField(placed.key, 'spot', __assign(__assign({}, spot), { map: kit.mapKey })); setPlacing(null); }, onCancel: function () { return setPlacing(null); } }))));
}
// One file of the bulk list: what it is, where it goes (equipment, a new issue or an issue), and how its upload went
function BulkFileCard(_a) {
    var it = _a.it, problem = _a.problem, fields = _a.fields, byName = _a.byName, set = _a.set, mapColumn = _a.mapColumn, kit = _a.kit, onChange = _a.onChange, onRetarget = _a.onRetarget, onChooseAsset = _a.onChooseAsset, onIssueField = _a.onIssueField, onShareIssue = _a.onShareIssue, onPlace = _a.onPlace, onShowIssue = _a.onShowIssue, onRemove = _a.onRemove, onView = _a.onView, onEditInTable = _a.onEditInTable;
    var toAsset = it.target === 'asset';
    var newIssue = it.target === 'newIssue';
    var toIssue = it.target === 'issue';
    var f = toAsset ? (byName[it.column] || null) : null;
    var busy = it.status === 'uploading';
    var done = it.status === 'done';
    var locked = busy || done;
    // The search is open while the item says "choosing", so an upload run leaves this file alone until one is picked
    var searching = !!it.choosing && !locked;
    var searchingIssue = !!it.choosingIssue && !locked;
    var _b = useState({ text: '', n: 0 }), seed = _b[0], setSeed = _b[1];
    var sug = it.suggestion;
    var current = bulkReplaces(it, byName, kit);
    var where = function (a) { return [a.room, a.area].filter(Boolean).join(', '); };
    // What a piece of equipment already holds in this file's column
    var storedIn = function (a) { return (f && a && a.current && a.current[f.name] && a.current[f.name].has ? a.current[f.name] : null); };
    var storedText = function (cur) { return (toIssue ? 'the picture now on this issue' : (f.kind === 'image' ? "the picture now in ".concat(f.label) : "".concat(cur.name ? "\"".concat(cur.name, "\"") : 'the file', " now in ").concat(f.label))); };
    var choose = function (asset) { return onChooseAsset(it.key, asset); };
    var openSearch = function (text) { setSeed(function (s) { return ({ text: text || '', n: s.n + 1 }); }); onChange(it.key, { choosing: true }); };
    var closeSearch = function () { return onChange(it.key, { choosing: false }); };
    var pickIssue = function (sub) { return onChange(it.key, { existing: issueSummary(sub), choosingIssue: false, status: it.status === 'error' ? 'waiting' : it.status, message: '', fatal: false }); };
    var sugStored = sug && sug.state === 'one' ? storedIn(sug.asset) : null;
    var d = it.issue;
    var formLocked = locked || !!it.created;
    var label = 'block text-[11px] font-bold text-slate-600';
    var input = 'mt-0.5 w-full border border-slate-300 rounded-md px-2 py-1 text-xs bg-white disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0072CE]/40 focus:border-[#0072CE]';
    var state = null;
    if (done && it.sent && it.sent.kind === 'asset') {
        state = (React.createElement("div", { className: "text-xs text-green-800", role: "status" },
            React.createElement("p", { className: "font-bold" },
                "Uploaded to ",
                it.sent.label,
                " of ",
                it.asset.name,
                "."),
            React.createElement("p", { className: "text-[11px] text-slate-500 [overflow-wrap:anywhere]" },
                "Sent: ",
                it.sent.route === 'blocks' ? 'InitializeFileBlocksUpload, UploadBlock, CommitFileBlocksUpload for' : "PATCH ".concat(it.sent.path, ","),
                " \"",
                it.sent.fileName,
                "\", ",
                formatBytes(it.sent.bytes),
                it.sent.convertedFrom ? " (converted from ".concat(it.sent.convertedFrom, " to JPG)") : (it.sent.shrunk ? ' (shrunk to a JPEG)' : '')),
            React.createElement("button", { type: "button", onClick: function () { return onEditInTable(it.asset.id); }, "aria-label": "Open ".concat(it.asset.name, " in Asset Management"), className: "mt-0.5 font-bold text-[#0072CE] underline" }, "Open in Asset Management")));
    }
    else if (done && it.sent) {
        state = (React.createElement("div", { className: "text-xs text-green-800", role: "status" },
            React.createElement("p", { className: "font-bold" }, it.sent.kind === 'issue' ? "Added to the issue ".concat(it.sent.title, ".") : "New issue saved: ".concat(it.sent.title, ".")),
            React.createElement("p", { className: "text-[11px] text-slate-500 [overflow-wrap:anywhere]" },
                "Sent: ",
                it.sent.payload ? "PATCH ".concat(DATAVERSE_SCHEMA.TableName, "(").concat(it.sent.id, ") to create it, then ") : '',
                "PATCH ",
                it.sent.path,
                ", a JPEG of ",
                formatBytes(it.sent.bytes)),
            it.sent.payload && (React.createElement("details", { className: "text-[11px] text-slate-600" },
                React.createElement("summary", { className: "cursor-pointer font-bold" }, "What was saved"),
                React.createElement("pre", { className: "mt-1 whitespace-pre-wrap [overflow-wrap:anywhere] bg-slate-50 border border-slate-200 rounded p-1.5 font-mono text-[10px]", "data-testid": "bulk-issue-payload" }, JSON.stringify(it.sent.payload, null, 2)))),
            React.createElement("button", { type: "button", onClick: function () { return onShowIssue(it.sent.id); }, "aria-label": "Show the issue of ".concat(it.file.name, " on the map"), className: "mt-0.5 font-bold text-[#0072CE] underline" }, "Show on the map")));
    }
    else if (busy) {
        state = (React.createElement("p", { className: "text-xs font-bold text-[#00468B]", role: "status" },
            "Uploading",
            it.progress !== null && it.progress !== undefined ? " in parts, ".concat(Math.round(it.progress * 100), "%") : '...'));
    }
    else if (it.status === 'error') {
        state = (React.createElement("p", { className: "text-xs text-[#C4001F]", role: "alert" },
            "Not uploaded: ",
            endSentence(it.message),
            problem ? " ".concat(problem) : (it.fatal ? " ".concat(BULK_FATAL_HINT[it.target] || BULK_FATAL_HINT.asset) : ' Press Save to Dataverse to try again.')));
    }
    else if (problem) {
        state = React.createElement("p", { className: "text-xs text-[#7A5200]" }, problem);
    }
    else if (current) {
        state = (React.createElement("p", { className: "text-xs text-[#7A5200] bg-[#FFF6E0] border border-[#FFB81C] rounded px-1.5 py-0.5 self-start", "data-replaces": "" },
            "Ready. It replaces ",
            storedText(current),
            "."));
    }
    else {
        state = React.createElement("p", { className: "text-xs text-green-800" }, it.created ? 'The issue is saved; its picture is ready to go.' : 'Ready.');
    }
    // Equipment: the piece the file goes to (or, for a new issue, the one it is about)
    var equipment = (React.createElement("div", { className: "text-xs min-w-0" },
        it.asset && !searching ? (React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 min-w-0" },
            React.createElement("span", { className: "font-bold text-slate-600 shrink-0" }, newIssue ? 'Equipment (optional)' : 'Equipment'),
            React.createElement("span", { className: "inline-flex items-center gap-1 rounded-md bg-[#E6F1FB] text-[#00468B] px-2 py-0.5 min-w-0 max-w-full" },
                React.createElement("span", { className: "font-bold truncate" }, it.asset.name),
                where(it.asset) && React.createElement("span", { className: "text-[11px] text-slate-600 truncate" }, where(it.asset))),
            !locked && !(newIssue && it.created) && React.createElement("button", { type: "button", onClick: function () { return openSearch(''); }, "aria-label": "Change the equipment for ".concat(it.file.name), className: "font-bold text-[#0072CE] underline" }, "Change"),
            !locked && newIssue && !it.created && React.createElement("button", { type: "button", onClick: function () { return choose(null); }, "aria-label": "Remove the equipment from the issue of ".concat(it.file.name), className: "font-bold text-slate-600 underline" }, "Remove"))) : !searching ? (React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 min-w-0" },
            newIssue && React.createElement("span", { className: "font-bold text-slate-600 shrink-0" }, "Equipment (optional)"),
            !locked && !(newIssue && it.created) && (React.createElement("button", { type: "button", onClick: function () { return openSearch(''); }, "aria-label": "Find the equipment for ".concat(it.file.name), className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB]" },
                React.createElement(Search, { className: "w-3 h-3" }),
                " Find equipment")),
            sug && sug.state === 'looking' && React.createElement("span", { className: "text-slate-500" },
                "Looking for \"",
                it.words.join(' '),
                "\"..."),
            sug && sug.state === 'one' && !(newIssue && it.created) && (React.createElement("span", { className: "inline-flex flex-wrap items-center gap-1 min-w-0" },
                React.createElement("span", { className: "text-slate-500" }, "From the name:"),
                React.createElement("span", { className: "font-bold text-slate-800 [overflow-wrap:anywhere]" }, sug.asset.name),
                where(sug.asset) && React.createElement("span", { className: "text-[11px] text-slate-500" }, where(sug.asset)),
                sugStored && React.createElement("span", { className: "text-[11px] text-[#7A5200] bg-[#FFF6E0] rounded px-1" },
                    "would replace ",
                    storedText(sugStored)),
                !locked && React.createElement("button", { type: "button", onClick: function () { return choose(sug.asset); }, "aria-label": "Use ".concat(sug.asset.name, " for ").concat(it.file.name), className: "font-bold text-[#0072CE] underline", "data-testid": "bulk-use" }, "Use"))),
            sug && sug.state === 'many' && !locked && !(newIssue && it.created) && (React.createElement("button", { type: "button", onClick: function () { return openSearch(sug.text); }, "aria-label": "Show the possible matches for ".concat(it.file.name), className: "text-[#0072CE] underline" },
                sug.count >= BULK_SEARCH_TOP ? "".concat(BULK_SEARCH_TOP, " or more possible matches") : "".concat(sug.count, " possible match").concat(sug.count === 1 ? '' : 'es'),
                " for \"",
                sug.text,
                "\"")),
            sug && sug.state === 'error' && React.createElement("span", { className: "text-slate-500" },
                "The name lookup failed (",
                sug.message,
                "); use Find equipment."))) : null,
        searching && !locked && (React.createElement(BulkAssetSearch, { key: seed.n, initialText: seed.text, set: set, fields: fields, mapColumn: mapColumn, column: f, onPick: choose, onCancel: closeSearch, label: it.file.name }))));
    return (React.createElement("li", { className: "bg-white rounded-lg border p-2.5 flex gap-2.5 min-w-0 ".concat(done ? 'border-green-300' : it.status === 'error' ? 'border-[#E4002B]/50' : 'border-slate-200'), "data-bulk-item": it.file.name, "data-target": it.target },
        React.createElement("div", { className: "shrink-0" }, it.preview ? (React.createElement("button", { type: "button", onClick: function () { return onView(it.key); }, title: "Show the picture large", "aria-label": "Show ".concat(it.file.name, " large"), className: "block w-16 h-16 sm:w-20 sm:h-20 rounded-md border border-slate-200 bg-slate-50 overflow-hidden" },
            React.createElement("img", { src: it.preview, alt: "", loading: "lazy", className: "w-full h-full object-cover" }))) : (React.createElement("div", { className: "w-16 h-16 sm:w-20 sm:h-20 rounded-md border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-[10px] font-bold text-slate-500 uppercase" },
            it.picture ? React.createElement(ImageIcon, { className: "w-6 h-6 text-slate-400" }) : React.createElement(FileDocIcon, { className: "w-6 h-6 text-slate-400" }),
            React.createElement("span", { className: "mt-0.5 max-w-full truncate px-1" }, it.converting ? 'to JPG...' : (/\.([a-z0-9]+)$/i.exec(it.file.name) || ['', 'file'])[1])))),
        React.createElement("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5" },
            React.createElement("div", { className: "flex items-start gap-2 min-w-0" },
                React.createElement("p", { className: "flex-1 min-w-0 text-sm font-bold text-slate-800 [overflow-wrap:anywhere]" }, it.file.name),
                React.createElement("span", { className: "shrink-0 text-[11px] text-slate-500" }, formatBytes(it.file.size || 0)),
                !busy && (React.createElement("button", { type: "button", onClick: function () { return onRemove(it.key); }, title: "Take this file off the list", "aria-label": "Take ".concat(it.file.name, " off the list"), className: "shrink-0 p-0.5 rounded text-slate-400 hover:text-[#E4002B] hover:bg-slate-100" },
                    React.createElement(X, { className: "w-4 h-4" })))),
            it.taken && React.createElement("p", { className: "text-[11px] text-slate-500 -mt-1" },
                "Taken ",
                bulkTakenText(it.taken)),
            it.picture && !isJpegFile(it.file) && !done && !it.convertFatal && (it.heic || opensInBrowser(it.file) || it.target !== 'asset' || ((fields.find(function (f) { return f.name === it.column; }) || {}).kind === 'image')) && (React.createElement("p", { className: "text-[11px] text-slate-500 -mt-1", "data-testid": "bulk-to-jpg" },
                it.converting ? 'Converting to JPG...' : 'Saved as a JPG',
                it.convertNote ? React.createElement("span", { className: "text-[#7A5200]" },
                    " (preview not ready: ",
                    endSentence(it.convertNote),
                    ")") : null)),
            React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 text-xs min-w-0" },
                React.createElement("span", { className: "shrink-0 font-bold text-slate-600" }, "Goes to"),
                React.createElement("div", { className: "inline-flex flex-wrap rounded-md border border-[#B3D4F2] bg-white p-0.5", role: "radiogroup", "aria-label": "Where ".concat(it.file.name, " goes") }, BULK_TARGETS.map(function (t) {
                    var off = locked || !!it.created || (t.key !== 'asset' && !it.picture) || (t.key === 'asset' && fields.length === 0);
                    return (React.createElement("button", { key: t.key, type: "button", role: "radio", "aria-checked": it.target === t.key, disabled: off && it.target !== t.key, onClick: function () { if (!off)
                            onRetarget(it.key, t.key); }, title: t.key !== 'asset' && !it.picture ? 'Only pictures can go on an issue' : undefined, className: "px-2 py-0.5 rounded font-bold text-[11px] ".concat(it.target === t.key ? 'bg-[#0072CE] text-white' : 'text-[#00468B] hover:bg-[#E6F1FB] disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed'), "data-testid": "bulk-target-".concat(t.key) }, t.label));
                }))),
            toAsset && (React.createElement(React.Fragment, null,
                React.createElement("label", { className: "flex items-center gap-1.5 text-xs text-slate-600 min-w-0" },
                    React.createElement("span", { className: "shrink-0 font-bold" }, "Goes in"),
                    React.createElement("select", { value: it.column, disabled: locked, onChange: function (e) { return onChange(it.key, { column: e.target.value, columnTouched: true, status: it.status === 'error' ? 'waiting' : it.status, message: '', fatal: false }); }, "aria-label": "Column for ".concat(it.file.name), className: "min-w-0 flex-1 sm:flex-none border border-slate-300 rounded-md px-2 py-1 text-xs bg-white disabled:bg-slate-50" },
                        React.createElement("option", { value: "" }, "Choose a column..."),
                        fields.map(function (c) { return (React.createElement("option", { key: c.name, value: c.name, disabled: c.kind === 'image' && !it.picture },
                            c.label,
                            " (",
                            c.kind === 'image' ? 'picture' : 'file',
                            ")",
                            c.kind === 'image' && !it.picture ? ', pictures only' : '')); }))),
                equipment)),
            newIssue && d && (React.createElement("div", { className: "flex flex-col gap-1.5", "data-testid": "bulk-issue-form" },
                it.created && React.createElement("p", { className: "text-[11px] text-slate-500" }, "This issue is saved in Dataverse; only its picture is left to send."),
                React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5" },
                    React.createElement("label", { className: label },
                        "Issue category ",
                        React.createElement("span", { className: "text-[#C4001F]" }, "*"),
                        React.createElement("select", { value: d.category, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'category', e.target.value); }, className: input, "aria-label": "Issue category for ".concat(it.file.name), "data-testid": "bulk-issue-category" },
                            React.createElement("option", { value: "" }, "Choose..."),
                            CATEGORIES.map(function (c) { return React.createElement("option", { key: c.key, value: c.key }, c.label); }))),
                    d.category === 'note' ? (React.createElement("label", { className: label },
                        "Note text ",
                        React.createElement("span", { className: "text-[#C4001F]" }, "*"),
                        React.createElement("input", { type: "text", value: d.customNote, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'customNote', e.target.value); }, className: input, "aria-label": "Note text for ".concat(it.file.name) }))) : (React.createElement("label", { className: label },
                        "Who to notify",
                        React.createElement("input", { type: "text", value: d.whoToNotify, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'whoToNotify', e.target.value); }, placeholder: "e.g. Maintenance", className: input, "aria-label": "Who to notify for ".concat(it.file.name), "data-testid": "bulk-issue-notify" }))),
                    React.createElement("label", { className: "".concat(label, " sm:col-span-2") },
                        "Description ",
                        React.createElement("span", { className: "text-[#C4001F]" }, "*"),
                        React.createElement("textarea", { rows: 2, value: d.description, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'description', e.target.value); }, className: input, "aria-label": "Description for ".concat(it.file.name), "data-testid": "bulk-issue-description" })),
                    React.createElement("label", { className: label },
                        "Room",
                        React.createElement("input", { type: "text", value: d.room, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'room', e.target.value); }, className: input, "aria-label": "Room for ".concat(it.file.name), "data-testid": "bulk-issue-room" })),
                    React.createElement("label", { className: label },
                        "Area ",
                        React.createElement("span", { className: "text-[#C4001F]" }, "*"),
                        React.createElement("input", { type: "text", value: d.area, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'area', e.target.value); }, className: input, "aria-label": "Area for ".concat(it.file.name), "data-testid": "bulk-issue-area" })),
                    d.category === 'note' && (React.createElement("label", { className: "".concat(label, " sm:col-span-2") },
                        "Who to notify",
                        React.createElement("input", { type: "text", value: d.whoToNotify, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'whoToNotify', e.target.value); }, placeholder: "e.g. Maintenance", className: input, "aria-label": "Who to notify for ".concat(it.file.name), "data-testid": "bulk-issue-notify" })))),
                equipment,
                React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 text-xs" },
                    React.createElement("span", { className: "font-bold text-slate-600" }, "Map spot"),
                    React.createElement("span", { className: d.spot ? 'text-slate-700' : 'text-[#7A5200]', "data-testid": "bulk-issue-spot" }, d.spot ? (d.spot.from === 'equipment' && it.asset ? "from ".concat(it.asset.name, "'s spot on the map") : 'placed on the map') : 'not placed yet'),
                    !formLocked && (React.createElement("button", { type: "button", onClick: function () { return onPlace(it.key); }, className: "px-2 py-0.5 rounded-md font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB]", "aria-label": "Place the issue of ".concat(it.file.name, " on the map"), "data-testid": "bulk-place" }, d.spot ? 'Move' : 'Place on the map'))),
                it.taken && (React.createElement("label", { className: "inline-flex items-center gap-1.5 text-[11px] text-slate-600" },
                    React.createElement("input", { type: "checkbox", checked: !!d.addTaken, disabled: formLocked, onChange: function (e) { return onIssueField(it.key, 'addTaken', e.target.checked); } }),
                    "Add \"Photo taken ",
                    bulkTakenText(it.taken),
                    "\" to the description")),
                !formLocked && d.category && (React.createElement("button", { type: "button", onClick: function () { return onShareIssue(it.key); }, className: "self-start text-[11px] font-bold text-[#0072CE] underline", "data-testid": "bulk-issue-share" },
                    "Use this category",
                    d.whoToNotify ? ' and who to notify' : '',
                    " for every new issue in the list")))),
            toIssue && (React.createElement("div", { className: "text-xs min-w-0" }, it.existing && !searchingIssue ? (React.createElement("div", { className: "flex flex-wrap items-center gap-1.5 min-w-0" },
                React.createElement("span", { className: "font-bold text-slate-600 shrink-0" }, "Issue"),
                React.createElement("span", { className: "inline-flex flex-col rounded-md bg-[#E6F1FB] text-[#00468B] px-2 py-0.5 min-w-0 max-w-full" },
                    React.createElement("span", { className: "font-bold [overflow-wrap:anywhere]" },
                        it.existing.title,
                        it.existing.closed ? ' (closed)' : ''),
                    it.existing.description && React.createElement("span", { className: "text-[11px] text-slate-600 truncate" }, it.existing.description)),
                !locked && React.createElement("button", { type: "button", onClick: function () { return onChange(it.key, { choosingIssue: true }); }, "aria-label": "Change the issue for ".concat(it.file.name), className: "font-bold text-[#0072CE] underline" }, "Change"))) : !searchingIssue ? (!locked && (React.createElement("button", { type: "button", onClick: function () { return onChange(it.key, { choosingIssue: true }); }, "aria-label": "Find the issue for ".concat(it.file.name), className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold border border-[#B3D4F2] bg-white text-[#00468B] hover:bg-[#E6F1FB]", "data-testid": "bulk-find-issue" },
                React.createElement(Search, { className: "w-3 h-3" }),
                " Find the issue"))) : (React.createElement(BulkIssueSearch, { submissions: kit.submissions, kit: kit, initialText: it.asset ? it.asset.name : '', onPick: pickIssue, onCancel: function () { return onChange(it.key, { choosingIssue: false }); }, label: it.file.name })))),
            state)));
}
// The equipment search of one bulk file: typed words (name, room, area) or an asset id; at most BULK_SEARCH_TOP results
function BulkAssetSearch(_a) {
    var initialText = _a.initialText, set = _a.set, fields = _a.fields, mapColumn = _a.mapColumn, column = _a.column, onPick = _a.onPick, onCancel = _a.onCancel, label = _a.label;
    var _b = useState(initialText || ''), text = _b[0], setText = _b[1];
    var _c = useState({ rows: [], loading: false, error: '', asked: '' }), found = _c[0], setFound = _c[1];
    var req = useRef(0);
    var inputRef = useRef(null);
    useEffect(function () { if (inputRef.current)
        inputRef.current.focus(); }, []);
    useEffect(function () {
        var t = text.trim();
        var n = req.current + 1;
        req.current = n;
        if (t.length < 2) {
            setFound({ rows: [], loading: false, error: '', asked: '' });
            return undefined;
        }
        var timer = setTimeout(function () {
            setFound(function (s) { return (__assign(__assign({}, s), { loading: true, error: '' })); });
            searchBulkAssets(set, t, fields, { mapColumn: mapColumn })
                .then(function (rows) { if (req.current === n)
                setFound({ rows: rows, loading: false, error: '', asked: t }); })
                .catch(function (error) { if (req.current === n)
                setFound({ rows: [], loading: false, error: error.message, asked: t }); });
        }, 300);
        return function () { return clearTimeout(timer); };
    }, [text, set, fields, mapColumn]);
    var where = function (a) { return [a.room, a.area].filter(Boolean).join(', '); };
    return (React.createElement("div", { className: "mt-0.5 rounded-md border border-[#B3D4F2] bg-[#F7FBFF] p-2 flex flex-col gap-1.5", "data-testid": "bulk-search" },
        React.createElement("div", { className: "flex items-center gap-1.5" },
            React.createElement("div", { className: "relative flex-1 min-w-0" },
                React.createElement(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" }),
                React.createElement("input", { ref: inputRef, type: "search", value: text, onChange: function (e) { return setText(e.target.value); }, onKeyDown: function (e) {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            onCancel();
                        }
                        // Only the answer for what is typed now (not the one before the last keystroke)
                        if (e.key === 'Enter' && !found.loading && found.asked === text.trim() && found.rows.length === 1) {
                            e.preventDefault();
                            onPick(found.rows[0]);
                        }
                    }, placeholder: "Equipment name, room or area...", "aria-label": "Find the equipment for ".concat(label), className: "w-full pl-7 pr-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/40 focus:border-[#0072CE]" })),
            React.createElement("button", { type: "button", onClick: onCancel, className: "shrink-0 font-bold text-slate-600 underline" }, "Cancel")),
        text.trim().length < 2 && React.createElement("p", { className: "text-[11px] text-slate-500" }, "Type at least 2 letters."),
        found.loading && React.createElement("p", { className: "text-[11px] text-slate-500", role: "status" }, "Searching..."),
        found.error && React.createElement("p", { className: "text-[11px] text-[#C4001F]", role: "alert" },
            "The search failed: ",
            found.error),
        !found.loading && !found.error && found.asked && found.rows.length === 0 && React.createElement("p", { className: "text-[11px] text-slate-500" },
            "No equipment matches \"",
            found.asked,
            "\"."),
        found.rows.length > 0 && (React.createElement("ul", { className: "flex flex-col gap-0.5 max-h-56 overflow-y-auto", "aria-label": "Matching equipment" },
            found.rows.map(function (a) {
                var cur = column && a.current ? a.current[column.name] : null;
                return (React.createElement("li", { key: a.id },
                    React.createElement("button", { type: "button", onClick: function () { return onPick(a); }, className: "w-full text-left rounded px-2 py-1 hover:bg-[#E6F1FB] focus:bg-[#E6F1FB] focus:outline-none" },
                        React.createElement("span", { className: "font-bold text-slate-800" }, a.name),
                        where(a) && React.createElement("span", { className: "text-[11px] text-slate-500" },
                            " ",
                            where(a)),
                        cur && cur.has && React.createElement("span", { className: "block text-[11px] text-[#7A5200]" },
                            "Has ",
                            column.kind === 'image' ? 'a picture' : (cur.name ? "\"".concat(cur.name, "\"") : 'a file'),
                            " in ",
                            column.label,
                            " already"))));
            }),
            found.rows.length >= BULK_SEARCH_TOP && React.createElement("li", { className: "text-[11px] text-slate-500 px-2" },
                "Only the first ",
                BULK_SEARCH_TOP,
                " are shown; type more to narrow it down.")))));
}
// The issue search of one bulk file: the issues the app already holds (open ones first, the newest first). Older closed
// issues are not all loaded: a button asks Dataverse for them, and what it finds joins the list.
function BulkIssueSearch(_a) {
    var submissions = _a.submissions, kit = _a.kit, initialText = _a.initialText, onPick = _a.onPick, onCancel = _a.onCancel, label = _a.label;
    var _b = useState(initialText || ''), text = _b[0], setText = _b[1];
    var inputRef = useRef(null);
    useEffect(function () { if (inputRef.current)
        inputRef.current.focus(); }, []);
    var rows = useMemo(function () { return searchIssues(submissions, text); }, [submissions, text]);
    var day = function (iso) { var t = new Date(iso); return isNaN(t.getTime()) ? '' : "".concat(t.getDate(), " ").concat(MONTHS[t.getMonth()], " ").concat(t.getFullYear()); };
    return (React.createElement("div", { className: "mt-0.5 rounded-md border border-[#B3D4F2] bg-[#F7FBFF] p-2 flex flex-col gap-1.5", "data-testid": "bulk-issue-search" },
        React.createElement("div", { className: "flex items-center gap-1.5" },
            React.createElement("div", { className: "relative flex-1 min-w-0" },
                React.createElement(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" }),
                React.createElement("input", { ref: inputRef, type: "search", value: text, onChange: function (e) { return setText(e.target.value); }, onKeyDown: function (e) {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            onCancel();
                        }
                        if (e.key === 'Enter' && rows.length === 1) {
                            e.preventDefault();
                            onPick(rows[0]);
                        }
                    }, placeholder: "Room, area, equipment, words of the issue...", "aria-label": "Find the issue for ".concat(label), className: "w-full pl-7 pr-2 py-1 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#0072CE]/40 focus:border-[#0072CE]" })),
            React.createElement("button", { type: "button", onClick: onCancel, className: "shrink-0 font-bold text-slate-600 underline" }, "Cancel")),
        !text.trim() && React.createElement("p", { className: "text-[11px] text-slate-500" },
            "The newest open issues; type to search ",
            kit && (kit.closedMore || kit.timeNarrowed) ? 'every open issue and the closed ones loaded so far' : 'them all',
            "."),
        text.trim() && rows.length === 0 && React.createElement("p", { className: "text-[11px] text-slate-500" },
            "No loaded issue matches \"",
            text.trim(),
            "\"."),
        text.trim() && kit && (kit.closedMore || kit.timeNarrowed || (kit.olderSearch && kit.olderSearch.text)) && (function () {
            var words = text.trim().split(/\s+/).filter(Boolean).slice(0, 6).join(' ');
            // A search that stayed inside the timeframe does not answer for the closed issues before it
            var done = kit.olderSearch && kit.olderSearch.text === words && (kit.olderSearch.anyTime || !kit.timeNarrowed) ? kit.olderSearch : null;
            if (done) {
                return (React.createElement("p", { className: "text-[11px] ".concat(done.error ? 'text-[#C4001F]' : 'text-slate-500'), "data-testid": "bulk-older-result" }, done.busy ? 'Searching older closed issues in Dataverse...'
                    : done.error ? "The search in Dataverse could not run: ".concat(done.error)
                        : done.found === 0 ? 'No older closed issue matches either.'
                            : "".concat(done.found).concat(done.more ? '+' : '', " closed issue").concat(done.found === 1 ? '' : 's', " found in Dataverse").concat(done.added ? ' and added to this list' : ' (already in this list)', ".")));
            }
            if (kit.problemsLoading)
                return React.createElement("p", { className: "text-[11px] text-slate-500" }, "The issues are still loading from Dataverse...");
            return kit.closedMore || kit.timeNarrowed ? (React.createElement("button", { type: "button", onClick: function () { return kit.searchOlder(words, { anyTime: true }); }, className: "self-start text-[11px] font-bold text-[#0072CE] underline hover:text-[#00468B]", "data-testid": "bulk-search-older" }, "Also search older closed issues in Dataverse")) : null;
        })(),
        rows.length > 0 && (React.createElement("ul", { className: "flex flex-col gap-0.5 max-h-56 overflow-y-auto", "aria-label": "Matching issues" },
            rows.map(function (sub) { return (React.createElement("li", { key: sub.id },
                React.createElement("button", { type: "button", onClick: function () { return onPick(sub); }, className: "w-full text-left rounded px-2 py-1 hover:bg-[#E6F1FB] focus:bg-[#E6F1FB] focus:outline-none" },
                    React.createElement("span", { className: "font-bold text-slate-800" }, issueTitle(sub)),
                    React.createElement("span", { className: "text-[11px] text-slate-500" },
                        " ",
                        day(sub.submittedOn),
                        sub.closed ? ', closed' : ''),
                    sub.description && React.createElement("span", { className: "block text-[11px] text-slate-600 truncate" }, sub.description),
                    issueHasPicture(sub) && React.createElement("span", { className: "block text-[11px] text-[#7A5200]" }, "Has a picture already")))); }),
            rows.length >= BULK_SEARCH_TOP && React.createElement("li", { className: "text-[11px] text-slate-500 px-2" },
                "Only the first ",
                BULK_SEARCH_TOP,
                " are shown; type more to narrow it down.")))));
}
// Places a new issue on the facility map: a click puts a box of the chosen size there. Scrolls and zooms; Escape cancels.
function BulkSpotPicker(_a) {
    var mapImage = _a.mapImage, fileName = _a.fileName, preview = _a.preview, value = _a.value, onPick = _a.onPick, onCancel = _a.onCancel;
    var _b = useState(value || null), spot = _b[0], setSpot = _b[1];
    var _c = useState(value && value.w ? (BULK_SPOT_SIZES.some(function (s) { return s.key === value.w; }) ? value.w : 4) : 4), size = _c[0], setSize = _c[1];
    var _d = useState(100), zoom = _d[0], setZoom = _d[1];
    var _f = useState(false), imageFailed = _f[0], setImageFailed = _f[1];
    var stageRef = useRef(null);
    useEffect(function () {
        var onKey = function (e) { if (e.key === 'Escape')
            onCancel(); };
        window.addEventListener('keydown', onKey);
        return function () { return window.removeEventListener('keydown', onKey); };
    }, [onCancel]);
    var onClick = function (e) {
        var r = stageRef.current.getBoundingClientRect();
        if (!r.width || !r.height)
            return;
        var x = clampPct(((e.clientX - r.left) / r.width) * 100);
        var y = clampPct(((e.clientY - r.top) / r.height) * 100);
        setSpot(clampSpot({ x: x, y: y, w: size, h: size, from: 'map' }));
    };
    var resize = function (n) { setSize(n); setSpot(function (s) { return (s ? clampSpot(__assign(__assign({}, s), { w: n, h: n, from: 'map' })) : s); }); };
    return (React.createElement("div", { className: "fixed inset-0 z-[120] bg-slate-900/60 flex items-center justify-center p-2 md:p-6", role: "dialog", "aria-modal": "true", "aria-label": "Place ".concat(fileName, " on the map"), "data-testid": "bulk-spot-picker" },
        React.createElement("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-full flex flex-col overflow-hidden" },
            React.createElement("div", { className: "shrink-0 px-3 py-2 border-b border-slate-200 flex items-center gap-2" },
                preview && React.createElement("img", { src: preview, alt: "", className: "w-10 h-10 rounded object-cover border border-slate-200 shrink-0" }),
                React.createElement("div", { className: "min-w-0 flex-1" },
                    React.createElement("p", { className: "font-black text-[#00468B] text-sm" }, "Where is it?"),
                    React.createElement("p", { className: "text-[11px] text-slate-500 truncate" },
                        "Click the map where ",
                        fileName,
                        " was taken.")),
                React.createElement("button", { type: "button", onClick: onCancel, className: "shrink-0 p-1 rounded text-slate-400 hover:text-[#E4002B]", "aria-label": "Close without placing" },
                    React.createElement(X, { className: "w-5 h-5" }))),
            React.createElement("div", { className: "flex-1 min-h-0 overflow-auto bg-slate-200 p-2" },
                React.createElement("div", { ref: stageRef, onClick: onClick, className: "relative cursor-crosshair select-none mx-auto", style: { width: "".concat(zoom, "%") }, "data-testid": "bulk-spot-stage" },
                    mapImage && !imageFailed ? (React.createElement("img", { src: mapImage, alt: "Facility map", className: "w-full h-auto block pointer-events-none", draggable: "false", onError: function () { return setImageFailed(true); } })) : (React.createElement("div", { className: "w-full aspect-square pointer-events-none" },
                        React.createElement(FacilityMapSvg, null))),
                    spot && (React.createElement("div", { className: "absolute border-2 border-[#E4002B] bg-[#E4002B]/20 pointer-events-none", style: { left: "".concat(spot.x - spot.w / 2, "%"), top: "".concat(spot.y - spot.h / 2, "%"), width: "".concat(spot.w, "%"), height: "".concat(spot.h, "%") }, "data-testid": "bulk-spot-box" })))),
            React.createElement("div", { className: "shrink-0 px-3 py-2 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs" },
                React.createElement("span", { className: "font-bold text-slate-600" }, "Size"),
                React.createElement("div", { className: "inline-flex rounded-md border border-[#B3D4F2] bg-white p-0.5", role: "group", "aria-label": "Size of the box" }, BULK_SPOT_SIZES.map(function (s) { return (React.createElement("button", { key: s.key, type: "button", onClick: function () { return resize(s.key); }, "aria-pressed": size === s.key, className: "px-2 py-0.5 rounded font-bold ".concat(size === s.key ? 'bg-[#0072CE] text-white' : 'text-[#00468B] hover:bg-[#E6F1FB]') }, s.label)); })),
                React.createElement("span", { className: "font-bold text-slate-600 ml-1" }, "Zoom"),
                React.createElement("button", { type: "button", onClick: function () { return setZoom(function (z) { return Math.max(50, z - 25); }); }, className: "p-1 rounded border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB]", "aria-label": "Zoom out" },
                    React.createElement(ZoomOut, { className: "w-4 h-4" })),
                React.createElement("span", { className: "min-w-[3rem] text-center font-bold text-[#00468B]" },
                    zoom,
                    "%"),
                React.createElement("button", { type: "button", onClick: function () { return setZoom(function (z) { return Math.min(400, z + 25); }); }, className: "p-1 rounded border border-[#B3D4F2] text-[#0072CE] hover:bg-[#E6F1FB]", "aria-label": "Zoom in" },
                    React.createElement(ZoomIn, { className: "w-4 h-4" })),
                React.createElement("span", { className: "flex-1" }),
                React.createElement("button", { type: "button", onClick: onCancel, className: "px-3 py-1.5 rounded-md font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" }, "Cancel"),
                React.createElement("button", { type: "button", disabled: !spot, onClick: function () { return onPick(spot); }, className: "px-3 py-1.5 rounded-md font-bold bg-[#0072CE] text-white hover:bg-[#00468B] disabled:opacity-50 disabled:cursor-not-allowed", "data-testid": "bulk-spot-use" }, "Use this spot")))));
}

})();