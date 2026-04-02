import React, { useState } from 'react';

function ASTNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true);

  if (node === null || node === undefined) return <span style={styles.null}>null</span>;
  if (typeof node === 'string')  return <span style={styles.string}>"{node}"</span>;
  if (typeof node === 'number')  return <span style={styles.number}>{node}</span>;
  if (typeof node === 'boolean') return <span style={styles.bool}>{String(node)}</span>;

  if (Array.isArray(node)) {
    if (node.length === 0) return <span style={styles.punct}>[]</span>;
    return (
      <span>
        <span style={styles.punct}>[</span>
        {open && node.map((item, i) => (
          <div key={i} style={{ paddingLeft: 16 }}>
            <ASTNode node={item} depth={depth + 1} />
            {i < node.length - 1 && <span style={styles.punct}>,</span>}
          </div>
        ))}
        <span style={styles.punct}>]</span>
      </span>
    );
  }

  if (typeof node === 'object') {
    const keys = Object.keys(node);
    const hasType = node.type;
    return (
      <span>
        <button
          style={{ ...styles.typeTag, cursor: 'pointer' }}
          onClick={() => setOpen(o => !o)}
        >
          {hasType ? node.type : '{}'}
          <span style={styles.toggleIcon}>{open ? ' ▾' : ' ▸'}</span>
        </button>
        {open && (
          <div style={{ paddingLeft: 16, borderLeft: '1px solid #f0f0f0', marginLeft: 4 }}>
            {keys.filter(k => k !== 'type').map(k => (
              <div key={k} style={styles.row}>
                <span style={styles.key}>{k}</span>
                <span style={styles.colon}>: </span>
                <ASTNode node={node[k]} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return <span>{String(node)}</span>;
}

export default function ASTPanel({ ast, error }) {
  if (error) return <ErrorView msg={error} />;
  if (!ast)  return <EmptyView />;

  return (
    <div style={styles.wrap}>
      <div style={styles.meta}>
        <span style={styles.metaMain}>{ast.body.length} statement{ast.body.length !== 1 ? 's' : ''}</span>
        <span style={styles.metaHint}>· click nodes to expand/collapse</span>
      </div>
      <div style={styles.tree}>
        <ASTNode node={ast} />
      </div>
    </div>
  );
}

function EmptyView() {
  return (
    <div style={styles.empty}>
      <span style={styles.emptyIcon}>🌳</span>
      <p style={styles.emptyText}>Run the compiler to see the AST</p>
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
  meta: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 },
  metaMain: { fontSize: 13, fontWeight: 600, color: '#1a1a1a' },
  metaHint: { fontSize: 11, color: '#bbb' },
  tree: { fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8 },
  typeTag: {
    display: 'inline-flex', alignItems: 'center',
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    color: '#166534', borderRadius: 4,
    fontSize: 11, fontWeight: 600,
    padding: '1px 6px', fontFamily: 'JetBrains Mono, monospace',
    cursor: 'pointer',
  },
  toggleIcon: { opacity: 0.5, fontSize: 10, marginLeft: 2 },
  row: { display: 'flex', alignItems: 'flex-start', gap: 0, paddingTop: 1 },
  key: { color: '#3b82f6', fontSize: 12, minWidth: 60 },
  colon: { color: '#bbb', marginRight: 6, fontSize: 12 },
  string: { color: '#ea580c', fontSize: 12 },
  number: { color: '#2563eb', fontSize: 12 },
  bool:   { color: '#16a34a', fontSize: 12 },
  null:   { color: '#bbb', fontSize: 12 },
  punct:  { color: '#bbb', fontSize: 12 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 },
  emptyIcon: { fontSize: 28, opacity: 0.25 },
  emptyText: { fontSize: 13, color: '#bbb', margin: 0 },
  errorWrap: { padding: 20, display: 'flex', alignItems: 'flex-start', gap: 10 },
  errorIcon: { color: '#ef4444', fontWeight: 700, flexShrink: 0 },
  errorMsg: { fontSize: 13, color: '#ef4444', margin: 0, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 },
};
