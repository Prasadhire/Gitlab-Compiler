import React from 'react';
import { TT } from '../compiler/lexer';

const TOKEN_STYLE = {
  // Keywords - warm gray
  [TT.RAKHO]:  { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.AGAR]:   { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.WARNA]:  { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.TOH]:    { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.JBTK]:   { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.KARO]:   { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.DIKHAO]: { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  [TT.KHATAM]: { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  // Booleans
  [TT.SAHI]:   { color: '#065f46', bg: '#d1fae5', border: '#a7f3d0' },
  [TT.GALAT]:  { color: '#991b1b', bg: '#fee2e2', border: '#fecaca' },
  // Literals
  [TT.NUMBER]: { color: '#1e3a8a', bg: '#eff6ff', border: '#bfdbfe' },
  [TT.STRING]: { color: '#7c2d12', bg: '#fff7ed', border: '#fed7aa' },
  [TT.IDENT]:  { color: '#374151', bg: '#f9fafb', border: '#e5e7eb' },
  // Operators
  [TT.PLUS]:  { color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe' },
  [TT.MINUS]: { color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe' },
  [TT.MUL]:   { color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe' },
  [TT.DIV]:   { color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe' },
  [TT.MOD]:   { color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe' },
  [TT.EQ]:    { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
  [TT.EQEQ]:  { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
  [TT.NEQ]:   { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
  [TT.LT]:    { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
  [TT.GT]:    { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
  [TT.LTE]:   { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
  [TT.GTE]:   { color: '#134e4a', bg: '#f0fdfa', border: '#99f6e4' },
};

export default function TokenPanel({ tokens, error }) {
  if (error) return <ErrorView msg={error} />;
  if (!tokens) return <EmptyView />;

  const visible = tokens.filter(t => t.type !== TT.EOF && t.type !== TT.NEWLINE);

  const counts = visible.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={styles.wrap}>
      <div style={styles.meta}>
        <span style={styles.metaMain}>{visible.length} tokens</span>
        <span style={styles.metaSep}>·</span>
        <span style={styles.metaDetail}>
          {counts[TT.IDENT] || 0} identifiers &nbsp;
          {counts[TT.NUMBER] || 0} numbers &nbsp;
          {counts[TT.STRING] || 0} strings
        </span>
      </div>

      <div style={styles.legend}>
        {[
          ['Keyword', { color:'#92400e', bg:'#fef3c7', border:'#fde68a' }],
          ['Number',  { color:'#1e3a8a', bg:'#eff6ff', border:'#bfdbfe' }],
          ['String',  { color:'#7c2d12', bg:'#fff7ed', border:'#fed7aa' }],
          ['Ident',   { color:'#374151', bg:'#f9fafb', border:'#e5e7eb' }],
          ['Operator',{ color:'#4c1d95', bg:'#f5f3ff', border:'#ddd6fe' }],
        ].map(([label, s]) => (
          <span key={label} style={{ ...styles.chip, color: s.color, background: s.bg, borderColor: s.border }}>
            {label}
          </span>
        ))}
      </div>

      <div style={styles.tokenGrid}>
        {visible.map((t, i) => {
          const s = TOKEN_STYLE[t.type] || { color: '#374151', bg: '#f9fafb', border: '#e5e7eb' };
          const display = t.type === TT.STRING ? `"${t.value}"` : t.value;
          return (
            <div key={i} style={{ ...styles.tokenCard, borderColor: s.border, background: s.bg }}>
              <span style={{ ...styles.tokenType, color: s.color }}>{t.type}</span>
              <span style={{ ...styles.tokenVal, color: s.color }}>{display}</span>
              <span style={styles.tokenLine}>L{t.line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyView() {
  return (
    <div style={styles.empty}>
      <span style={styles.emptyIcon}>⚡</span>
      <p style={styles.emptyText}>Run the compiler to see tokens</p>
    </div>
  );
}

function ErrorView({ msg }) {
  return (
    <div style={styles.errorWrap}>
      <span style={styles.errorIcon}>✕</span>
      <p style={styles.errorMsg}>{msg}</p>
    </div>
  );
}

const styles = {
  wrap: { padding: '16px 20px', overflowY: 'auto', height: '100%' },
  meta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 },
  metaMain: { fontSize: 13, fontWeight: 600, color: '#1a1a1a' },
  metaSep: { color: '#ccc', fontSize: 12 },
  metaDetail: { fontSize: 12, color: '#999' },
  legend: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 },
  chip: {
    fontSize: 10, fontWeight: 600,
    padding: '2px 8px', borderRadius: 4,
    border: '1px solid', fontFamily: 'Inter, sans-serif',
  },
  tokenGrid: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tokenCard: {
    display: 'flex', flexDirection: 'column', gap: 1,
    padding: '5px 9px', borderRadius: 6,
    border: '1px solid', minWidth: 60,
  },
  tokenType: { fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' },
  tokenVal: { fontSize: 12, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' },
  tokenLine: { fontSize: 9, color: '#bbb' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 },
  emptyIcon: { fontSize: 28, opacity: 0.25 },
  emptyText: { fontSize: 13, color: '#bbb', margin: 0 },
  errorWrap: { padding: 20, display: 'flex', alignItems: 'flex-start', gap: 10 },
  errorIcon: { color: '#ef4444', fontWeight: 700, flexShrink: 0 },
  errorMsg: { fontSize: 13, color: '#ef4444', margin: 0, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 },
};
