import React from 'react';

// ── Semantic Panel ───────────────────────────────────────────
export function SemanticPanel({ data, error }) {
  if (error) return <ErrorView msg={error} />;
  if (!data)  return <EmptyView icon="🔍" text="Run the compiler to see semantic analysis" />;

  const { infos, warnings } = data;

  return (
    <div style={styles.wrap}>
      <div style={styles.summary}>
        <Pill label={`${infos.length} declarations`}  color="green" />
        <Pill label={`${warnings.length} warnings`}   color={warnings.length ? 'yellow' : 'gray'} />
        <Pill label="0 errors"                        color="green" />
      </div>

      {infos.length > 0 && (
        <Section title="Symbol Table">
          {infos.map((item, i) => (
            <Row key={i} icon="✓" iconColor="#16a34a" bgColor="#f0fdf4" borderColor="#bbf7d0">
              <span style={styles.infoMsg}>{item.msg}</span>
              <span style={styles.infoDetail}>{item.detail}</span>
            </Row>
          ))}
        </Section>
      )}

      {warnings.length > 0 && (
        <Section title="Warnings">
          {warnings.map((w, i) => (
            <Row key={i} icon="⚠" iconColor="#d97706" bgColor="#fffbeb" borderColor="#fde68a">
              <span style={styles.warnMsg}>{w}</span>
            </Row>
          ))}
        </Section>
      )}

      {infos.length === 0 && warnings.length === 0 && (
        <Row icon="✓" iconColor="#16a34a" bgColor="#f0fdf4" borderColor="#bbf7d0">
          <span style={styles.infoMsg}>Semantic analysis passed — no issues found</span>
        </Row>
      )}
    </div>
  );
}

// ── Code Gen Panel ───────────────────────────────────────────
export function CodeGenPanel({ code, error }) {
  if (error) return <ErrorView msg={error} />;
  if (!code)  return <EmptyView icon="⚙️" text="Run the compiler to see generated code" />;

  const lines = code.split('\n');

  return (
    <div style={styles.wrap}>
      <div style={styles.summary}>
        <Pill label={`${lines.length} lines`}  color="blue" />
        <Pill label="Target: JavaScript"       color="gray" />
      </div>
      <div style={styles.codeWrap}>
        <div style={styles.lineNums}>
          {lines.map((_, i) => (
            <div key={i} style={styles.lineNum}>{i + 1}</div>
          ))}
        </div>
        <pre style={styles.code}>{code}</pre>
      </div>
    </div>
  );
}

// ── Output Panel ─────────────────────────────────────────────
export function OutputPanel({ output, error }) {
  if (!output && !error)
    return <EmptyView icon="▶" text="Run the compiler to see output" />;

  const lines = output?.lines || [];
  const runtimeErr = output?.error || error;

  return (
    <div style={styles.wrap}>
      <div style={styles.summary}>
        <Pill label={`${lines.length} output line${lines.length !== 1 ? 's' : ''}`} color="gray" />
        {runtimeErr && <Pill label="Runtime error" color="red" />}
      </div>

      <div style={styles.console}>
        {lines.length === 0 && !runtimeErr && (
          <div style={styles.consoleLine}>
            <span style={styles.consoleInfo}>
              // Program ran successfully — koi output nahi
            </span>
          </div>
        )}
        {lines.map((line, i) => (
          <div key={i} style={styles.consoleLine}>
            <span style={styles.consolePrompt}>▶</span>
            <span style={styles.consoleOut}>{line}</span>
          </div>
        ))}
        {runtimeErr && (
          <div style={styles.consoleLine}>
            <span style={styles.consoleErr}>✕  {runtimeErr}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={sectionTitle}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>{children}</div>
    </div>
  );
}

const sectionTitle = { fontSize: 11, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, marginTop: 0 };

function Row({ icon, iconColor, bgColor, borderColor, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, background: bgColor, border: `1px solid ${borderColor}` }}>
      <span style={{ color: iconColor, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{icon}</span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </div>
  );
}

const PILL_COLORS = {
  green:  { color: '#166534', bg: '#dcfce7', border: '#bbf7d0' },
  yellow: { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  blue:   { color: '#1e3a8a', bg: '#eff6ff', border: '#bfdbfe' },
  red:    { color: '#991b1b', bg: '#fee2e2', border: '#fecaca' },
  gray:   { color: '#374151', bg: '#f9fafb', border: '#e5e7eb' },
};

function Pill({ label, color = 'gray' }) {
  const s = PILL_COLORS[color];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontFamily: 'Inter, sans-serif' }}>
      {label}
    </span>
  );
}

function EmptyView({ icon, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
      <span style={{ fontSize: 28, opacity: 0.2 }}>{icon}</span>
      <p style={{ fontSize: 13, color: '#bbb', margin: 0 }}>{text}</p>
    </div>
  );
}

function ErrorView({ msg }) {
  return (
    <div style={{ padding: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>✕</span>
      <p style={{ fontSize: 13, color: '#ef4444', margin: 0, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>{msg}</p>
    </div>
  );
}

const styles = {
  wrap: { padding: '16px 20px', overflowY: 'auto', height: '100%' },
  summary: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 },

  // Semantic
  infoMsg:    { fontSize: 12, fontWeight: 500, color: '#166534' },
  infoDetail: { fontSize: 11, color: '#86efac', background: '#dcfce7', padding: '1px 6px', borderRadius: 4 },
  warnMsg:    { fontSize: 12, color: '#92400e' },

  // CodeGen
  codeWrap: { display: 'flex', background: '#fafafa', borderRadius: 8, border: '1px solid #e5e5e5', overflow: 'hidden' },
  lineNums: { padding: '14px 10px', background: '#f4f4f4', borderRight: '1px solid #e5e5e5', userSelect: 'none' },
  lineNum:  { fontSize: 11, color: '#ccc', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.65, textAlign: 'right', minWidth: 20 },
  code: {
    flex: 1, margin: 0, padding: '14px 16px',
    fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5,
    lineHeight: 1.65, color: '#1a1a1a',
    overflowX: 'auto', whiteSpace: 'pre',
  },

  // Console
  console: {
    background: '#1a1a1a', borderRadius: 8,
    padding: '14px 16px',
    fontFamily: 'JetBrains Mono, monospace',
  },
  consoleLine:   { display: 'flex', gap: 10, padding: '2px 0', alignItems: 'flex-start' },
  consolePrompt: { color: '#555', fontSize: 11, flexShrink: 0, marginTop: 1 },
  consoleOut:    { fontSize: 13, color: '#4ade80', lineHeight: 1.6 },
  consoleErr:    { fontSize: 13, color: '#f87171', lineHeight: 1.6 },
  consoleInfo:   { fontSize: 12, color: '#555', lineHeight: 1.6 },
};
