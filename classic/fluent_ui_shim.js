(function (global) {
  var React = global.React;
  if (!React) return;
  var h = React.createElement;
  var useContext = React.useContext;
  var createContext = React.createContext;
  var forwardRef = React.forwardRef;

  var styleSheetEl = null;
  var injectedRules = {};
  var classCounter = 0;

  function ensureStyleSheet() {
    if (styleSheetEl) return styleSheetEl;
    if (typeof document === 'undefined') return null;
    styleSheetEl = document.getElementById('fui-shim-styles');
    if (!styleSheetEl) {
      styleSheetEl = document.createElement('style');
      styleSheetEl.id = 'fui-shim-styles';
      document.head.appendChild(styleSheetEl);
    }
    return styleSheetEl;
  }

  function camelToKebab(str) {
    return String(str).replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); });
  }

  function cssValue(prop, val) {
    if (val === null || val === undefined || val === '') return '';
    if (typeof val === 'number' && !/^(opacity|zIndex|fontWeight|lineHeight|flex|flexGrow|flexShrink|order|zoom| scale)$/i.test(prop)) {
      return val + 'px';
    }
    return String(val);
  }

  function emitCssRules(className, styleObj) {
    var sheet = ensureStyleSheet();
    if (!sheet || !styleObj || typeof styleObj !== 'object') return;
    var baseDecls = [];
    var nested = [];
    Object.keys(styleObj).forEach(function (k) {
      var v = styleObj[k];
      if (v && typeof v === 'object') {
        nested.push({ key: k, val: v });
      } else if (v !== undefined && v !== null) {
        baseDecls.push(camelToKebab(k) + ':' + cssValue(k, v) + ';');
      }
    });
    var rules = [];
    if (baseDecls.length) {
      rules.push('.' + className + '{' + baseDecls.join('') + '}');
    }
    nested.forEach(function (n) {
      var k = n.key.trim();
      if (k.indexOf('@media') === 0) {
        var subDecls = [];
        Object.keys(n.val).forEach(function (sk) {
          var sv = n.val[sk];
          if (sv !== undefined && sv !== null && typeof sv !== 'object') {
            subDecls.push(camelToKebab(sk) + ':' + cssValue(sk, sv) + ';');
          }
        });
        if (subDecls.length) {
          rules.push(k + '{.' + className + '{' + subDecls.join('') + '}}');
        }
      } else {
        var sel = k.charAt(0) === ':' ? '.' + className + k : (k.indexOf('&') > -1 ? k.replace(/&/g, '.' + className) : '.' + className + ' ' + k);
        var subDecls2 = [];
        Object.keys(n.val).forEach(function (sk) {
          var sv = n.val[sk];
          if (sv !== undefined && sv !== null && typeof sv !== 'object') {
            subDecls2.push(camelToKebab(sk) + ':' + cssValue(sk, sv) + ';');
          }
        });
        if (subDecls2.length) {
          rules.push(sel + '{' + subDecls2.join('') + '}');
        }
      }
    });
    if (rules.length) {
      sheet.appendChild(document.createTextNode(rules.join('\n') + '\n'));
    }
  }

  function makeStyles(stylesMap) {
    var compiled = {};
    Object.keys(stylesMap || {}).forEach(function (slot) {
      var sig = slot + ':' + JSON.stringify(stylesMap[slot]);
      if (!injectedRules[sig]) {
        classCounter++;
        var cls = 'fui-' + slot.replace(/[^a-zA-Z0-9_-]/g, '') + '-' + classCounter;
        injectedRules[sig] = cls;
        emitCssRules(cls, stylesMap[slot]);
      }
      compiled[slot] = injectedRules[sig];
    });
    return function useStyles() {
      return compiled;
    };
  }

  function mergeClasses() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var a = arguments[i];
      if (a && typeof a === 'string') out.push(a);
    }
    return out.join(' ');
  }

  function createLightTheme(ramp) { return { mode: 'light', ramp: ramp || {} }; }
  function createDarkTheme(ramp) { return { mode: 'dark', ramp: ramp || {} }; }

  var FluentProvider = function (props) {
    return h('div', { className: mergeClasses('fui-FluentProvider', props.className), style: props.style }, props.children);
  };

  var Button = forwardRef(function (props, ref) {
    var appearance = props.appearance || 'secondary';
    var size = props.size || 'medium';
    var bg = appearance === 'primary' ? '#006ECD' : appearance === 'subtle' || appearance === 'transparent' ? 'transparent' : '#FFFFFF';
    var color = appearance === 'primary' ? '#FFFFFF' : '#10233A';
    var border = appearance === 'primary' ? '1px solid #005A9E' : appearance === 'subtle' || appearance === 'transparent' ? '1px solid transparent' : '1px solid #CBD9EA';
    var pad = size === 'small' ? '4px 10px' : size === 'large' ? '8px 16px' : '6px 12px';
    var fz = size === 'small' ? 12 : 13;
    var rest = Object.assign({}, props);
    delete rest.appearance;
    delete rest.size;
    delete rest.icon;
    delete rest.iconPosition;
    delete rest.shape;
    var baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      background: bg,
      color: color,
      border: border,
      borderRadius: props.shape === 'circular' ? '999px' : '6px',
      padding: pad,
      fontSize: fz,
      fontWeight: 600,
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.55 : 1,
      lineHeight: 1.25
    };
    rest.ref = ref;
    rest.type = props.type || 'button';
    rest.style = Object.assign(baseStyle, props.style || {});
    return h('button', rest, props.icon || null, props.children);
  });

  var Text = forwardRef(function (props, ref) {
    var tag = props.as || (props.block ? 'div' : 'span');
    var sizeMap = { 100: 10, 200: 12, 300: 13, 400: 14, 500: 16, 600: 20, 700: 24, 800: 28, 900: 32 };
    var weightMap = { regular: 400, medium: 500, semibold: 600, bold: 700 };
    var st = {
      fontSize: sizeMap[props.size] || undefined,
      fontWeight: weightMap[props.weight] || props.weight || undefined,
      display: props.block ? 'block' : undefined,
      fontFamily: props.font === 'monospace' ? 'monospace' : undefined
    };
    var rest = Object.assign({}, props);
    delete rest.as;
    delete rest.block;
    delete rest.size;
    delete rest.weight;
    delete rest.font;
    delete rest.truncate;
    delete rest.wrap;
    rest.ref = ref;
    rest.style = Object.assign(st, props.style || {});
    return h(tag, rest, props.children);
  });

  var Input = forwardRef(function (props, ref) {
    var rest = Object.assign({}, props);
    delete rest.contentBefore;
    delete rest.contentAfter;
    delete rest.appearance;
    delete rest.size;
    rest.ref = ref;
    rest.value = props.value !== undefined && props.value !== null ? props.value : (props.defaultValue !== undefined ? undefined : '');
    rest.onChange = function (e) {
      if (typeof props.onChange === 'function') {
        props.onChange(e, { value: e.target.value });
      }
    };
    rest.style = Object.assign({
      border: '1px solid #CBD9EA',
      borderRadius: '4px',
      padding: props.size === 'small' ? '3px 6px' : '5px 8px',
      fontSize: props.size === 'small' ? '12px' : '13px',
      background: props.disabled ? '#F1F5F9' : '#FFFFFF',
      color: '#0F172A'
    }, props.style || {});
    return h('input', rest);
  });

  var Select = forwardRef(function (props, ref) {
    var rest = Object.assign({}, props);
    delete rest.size;
    delete rest.appearance;
    rest.ref = ref;
    rest.onChange = function (e) {
      if (typeof props.onChange === 'function') {
        props.onChange(e, { value: e.target.value });
      }
    };
    rest.style = Object.assign({
      border: '1px solid #CBD9EA',
      borderRadius: '4px',
      padding: props.size === 'small' ? '3px 6px' : '5px 8px',
      fontSize: props.size === 'small' ? '12px' : '13px',
      background: props.disabled ? '#F1F5F9' : '#FFFFFF',
      color: '#0F172A'
    }, props.style || {});
    return h('select', rest, props.children);
  });

  var Checkbox = forwardRef(function (props, ref) {
    var inputProps = Object.assign({}, props);
    delete inputProps.label;
    delete inputProps.shape;
    delete inputProps.size;
    inputProps.type = 'checkbox';
    inputProps.ref = ref;
    inputProps.checked = !!props.checked;
    inputProps.onChange = function (e) {
      if (typeof props.onChange === 'function') {
        props.onChange(e, { checked: !!e.target.checked });
      }
    };
    return h('label', {
      className: props.className,
      style: Object.assign({ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: props.disabled ? 'not-allowed' : 'pointer', fontSize: '13px' }, props.style || {})
    }, h('input', inputProps), props.label || props.children || null);
  });

  var TabListCtx = createContext({ selectedValue: null, onTabSelect: null });
  var TabList = function (props) {
    return h(TabListCtx.Provider, { value: { selectedValue: props.selectedValue, onTabSelect: props.onTabSelect } },
      h('div', {
        role: 'tablist',
        'aria-label': props['aria-label'],
        className: props.className,
        style: Object.assign({ display: 'flex', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid #CBD9EA', paddingBottom: '4px' }, props.style || {})
      }, props.children)
    );
  };
  var Tab = function (props) {
    var ctx = useContext(TabListCtx);
    var active = ctx && ctx.selectedValue === props.value;
    return h('button', {
      type: 'button',
      role: 'tab',
      'aria-selected': active ? 'true' : 'false',
      'data-tab-value': props.value,
      disabled: props.disabled,
      className: props.className,
      onClick: function (e) {
        if (ctx && typeof ctx.onTabSelect === 'function') {
          ctx.onTabSelect(e, { value: props.value });
        }
      },
      style: Object.assign({
        padding: '6px 12px',
        borderRadius: '6px 6px 0 0',
        border: active ? '1px solid #006ECD' : '1px solid transparent',
        background: active ? '#006ECD' : 'transparent',
        color: active ? '#FFFFFF' : '#10233A',
        fontWeight: active ? 700 : 600,
        fontSize: '13px',
        cursor: props.disabled ? 'not-allowed' : 'pointer'
      }, props.style || {})
    }, props.icon || null, props.children);
  };

  var RadioGroupCtx = createContext({ value: null, onChange: null, name: 'fui-radio' });
  var RadioGroup = function (props) {
    return h(RadioGroupCtx.Provider, { value: { value: props.value, onChange: props.onChange, name: props['aria-label'] || 'fui-radio' } },
      h('div', {
        role: 'radiogroup',
        'aria-label': props['aria-label'],
        className: props.className,
        style: Object.assign({ display: 'flex', flexDirection: props.layout === 'horizontal' ? 'row' : 'column', gap: '10px', alignItems: props.layout === 'horizontal' ? 'center' : 'flex-start' }, props.style || {})
      }, props.children)
    );
  };
  var Radio = function (props) {
    var ctx = useContext(RadioGroupCtx);
    var checked = ctx ? ctx.value === props.value : !!props.checked;
    return h('label', {
      style: { display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '13px' }
    },
      h('input', {
        type: 'radio',
        name: ctx ? ctx.name : undefined,
        value: props.value,
        checked: checked,
        disabled: props.disabled,
        onChange: function (e) {
          if (ctx && typeof ctx.onChange === 'function') {
            ctx.onChange(e, { value: props.value });
          }
        }
      }),
      props.label || props.children
    );
  };

  var Combobox = function (props) {
    return h('div', { style: { display: 'inline-flex', flexDirection: 'column', position: 'relative' } },
      h('input', {
        type: 'text',
        value: props.value || '',
        placeholder: props.placeholder,
        'aria-label': props['aria-label'],
        onChange: function (e) {
          if (typeof props.onChange === 'function') props.onChange(e);
          if (typeof props.onOptionSelect === 'function') {
            props.onOptionSelect(e, { optionValue: e.target.value, optionText: e.target.value, selectedOptions: [e.target.value] });
          }
        },
        style: Object.assign({ border: '1px solid #CBD9EA', borderRadius: '4px', padding: '5px 8px', fontSize: '13px' }, props.style || {})
      })
    );
  };
  var Option = function (props) {
    return h('option', { value: props.value || props.text }, props.children);
  };

  var Dialog = function (props) {
    if (!props.open) return null;
    return h('div', {
      role: 'dialog',
      'aria-modal': 'true',
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }
    }, props.children);
  };
  var DialogSurface = function (props) {
    return h('div', {
      className: props.className,
      style: Object.assign({
        background: '#FFFFFF',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
      }, props.style || {})
    }, props.children);
  };
  var DialogBody = function (props) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } }, props.children); };
  var DialogTitle = function (props) { return h('div', { style: { fontSize: '16px', fontWeight: 700, color: '#0F172A' } }, props.children); };
  var DialogContent = function (props) { return h('div', { style: { fontSize: '13px', color: '#334155' } }, props.children); };
  var DialogActions = function (props) { return h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' } }, props.children); };

  var DataGridCtx = createContext({ items: [], columns: [], getRowId: null, selectionMode: null, selectedItems: null, onSelectionChange: null });
  var DataGridRowCtx = createContext({ item: null, rowId: null, isHeader: false });

  function createTableColumn(def) { return def; }

  var DataGrid = function (props) {
    var ctxVal = {
      items: Array.isArray(props.items) ? props.items : [],
      columns: Array.isArray(props.columns) ? props.columns : [],
      getRowId: props.getRowId,
      selectionMode: props.selectionMode,
      selectedItems: props.selectedItems,
      onSelectionChange: props.onSelectionChange
    };
    return h(DataGridCtx.Provider, { value: ctxVal },
      h('table', {
        className: props.className,
        style: Object.assign({ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }, props.style || {})
      }, props.children)
    );
  };
  var DataGridHeader = function (props) {
    return h(DataGridRowCtx.Provider, { value: { item: null, rowId: '__header__', isHeader: true } },
      h('thead', { className: props.className, style: props.style }, props.children)
    );
  };
  var DataGridBody = function (props) {
    var g = useContext(DataGridCtx);
    return h('tbody', { className: props.className, style: props.style },
      (g.items || []).map(function (item, idx) {
        var rowId = typeof g.getRowId === 'function' ? g.getRowId(item) : (item && (item.id || item.key) ? (item.id || item.key) : String(idx));
        return h(DataGridRowCtx.Provider, { key: rowId || idx, value: { item: item, rowId: rowId, isHeader: false } },
          typeof props.children === 'function' ? props.children({ item: item, rowId: rowId }) : props.children
        );
      })
    );
  };
  var DataGridRow = function (props) {
    var g = useContext(DataGridCtx);
    var r = useContext(DataGridRowCtx);
    var isSelected = false;
    if (!r.isHeader && g.selectedItems && r.rowId !== undefined) {
      if (typeof g.selectedItems.has === 'function') isSelected = g.selectedItems.has(r.rowId);
      else if (Array.isArray(g.selectedItems)) isSelected = g.selectedItems.indexOf(r.rowId) > -1;
    }
    return h('tr', {
      className: props.className,
      title: props.title,
      onDoubleClick: props.onDoubleClick,
      onClick: function (e) {
        if (!r.isHeader && g.selectionMode && typeof g.onSelectionChange === 'function') {
          g.onSelectionChange(e, { selectedItems: new Set([r.rowId]) });
        }
        if (typeof props.onClick === 'function') props.onClick(e);
      },
      style: Object.assign({
        borderBottom: '1px solid #E2E8F0',
        background: isSelected ? '#E0F2FE' : undefined
      }, props.style || {})
    }, (g.columns || []).map(function (col, cIdx) {
      var cellOut = typeof props.children === 'function'
        ? props.children({
            columnId: col.columnId,
            renderHeaderCell: col.renderHeaderCell || function () { return col.columnId; },
            renderCell: col.renderCell || function () { return ''; }
          })
        : props.children;
      return h(React.Fragment, { key: col.columnId || cIdx }, cellOut);
    }));
  };
  var DataGridHeaderCell = function (props) {
    return h('th', {
      className: props.className,
      style: Object.assign({ textAlign: 'left', padding: '8px 10px', fontWeight: 700, borderBottom: '2px solid #CBD9EA', background: '#F8FAFC' }, props.style || {})
    }, props.children);
  };
  var DataGridCell = function (props) {
    return h('td', {
      className: props.className,
      style: Object.assign({ padding: '6px 10px', verticalAlign: 'middle' }, props.style || {})
    }, props.children);
  };
  var TableCellLayout = function (props) {
    return h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, props.media || null, props.children);
  };
  var ProgressBar = function (props) {
    var pct = Math.max(0, Math.min(100, (Number(props.value) || 0) * (props.max ? 100 / Number(props.max) : 100)));
    return h('div', { style: { width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' } },
      h('div', { style: { width: pct + '%', height: '100%', background: '#006ECD' } })
    );
  };
  var Divider = function (props) {
    return h('hr', { style: Object.assign({ border: 0, borderTop: '1px solid #CBD9EA', margin: '8px 0' }, props.style || {}) });
  };
  var Badge = function (props) {
    return h('span', {
      className: props.className,
      style: Object.assign({ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: '#E0F2FE', color: '#0369A1' }, props.style || {})
    }, props.children);
  };
  var Spinner = function (props) {
    return h('span', { style: { fontSize: '12px', fontWeight: 600, color: '#006ECD' } }, props.label || 'Loading...');
  };

  global.FluentUIShim = {
    FluentProvider: FluentProvider,
    createLightTheme: createLightTheme,
    createDarkTheme: createDarkTheme,
    Button: Button,
    Input: Input,
    Text: Text,
    DataGrid: DataGrid,
    DataGridHeader: DataGridHeader,
    DataGridBody: DataGridBody,
    DataGridRow: DataGridRow,
    DataGridCell: DataGridCell,
    DataGridHeaderCell: DataGridHeaderCell,
    TableCellLayout: TableCellLayout,
    createTableColumn: createTableColumn,
    ProgressBar: ProgressBar,
    Divider: Divider,
    Badge: Badge,
    Spinner: Spinner,
    TabList: TabList,
    Tab: Tab,
    makeStyles: makeStyles,
    mergeClasses: mergeClasses,
    Select: Select,
    Checkbox: Checkbox,
    Combobox: Combobox,
    Option: Option,
    RadioGroup: RadioGroup,
    Radio: Radio,
    Dialog: Dialog,
    DialogSurface: DialogSurface,
    DialogBody: DialogBody,
    DialogTitle: DialogTitle,
    DialogContent: DialogContent,
    DialogActions: DialogActions
  };
})(typeof window !== 'undefined' ? window : globalThis);
