import React from 'react';

const PHASES = [
  { id: 'tokens',   num: '1', label: 'Lexer',    desc: 'Source → Tokens'   },
  { id: 'ast',      num: '2', label: 'Parser',   desc: 'Tokens → AST'      },
  { id: 'semantic', num: '3', label: 'Semantic', desc: 'Type & Scope Check' },
  { id: 'codegen',  num: '4', label: 'Code Gen', desc: 'AST → JavaScript'  },
  { id: 'output',   num: '▶', label: 'Output',   desc: 'Run Result'        },
];

export default function Pipeline({ results, activeTab, onTabChange }) {

  function getStatus(id) {
    if (!results) return 'idle';
    const r = results[id];
    if (!r) return 'idle';
    if (r.error) return 'error';
    if (r.data !== null || (r.lines !== undefined) || r.infos !== undefined) return 'done';
    return 'idle';
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>Compiler Pipeline</div>
      <div style={styles.row}>
        {PHASES.map((phase, i) => {
          const status  = getStatus(phase.id);
          const active  = activeTab === phase.id;
          return (
            <React.Fragment key={phase.id}>
              <button
                style={{
                  ...styles.step,
                  ...(active  ? styles.stepActive  : {}),
                  ...(status === 'done'  ? styles.stepDone  : {}),
                  ...(status === 'error' ? styles.stepError : {}),
                }}
                onClick={() => onTabChange(phase.id)}
              >
                <span style={{
                  ...styles.num,
                  ...(status === 'done'  ? styles.numDone  : {}),
                  ...(status === 'error' ? styles.numError : {}),
                }}>
                  {status === 'done' ? '✓' : status === 'error' ? '✕' : phase.num}
                </span>
                <span style={styles.info}>
                  <span style={styles.phaseName}>{phase.label}</span>
                  <span style={styles.phaseDesc}>{phase.desc}</span>
                </span>
              </button>
              {i < PHASES.length - 1 && (
                <span style={styles.arrow}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: '14px 24px 14px',
    borderBottom: '1px solid #e5e5e5',
    background: '#fafafa',
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: '#bbb',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    overflowX: 'auto',
    paddingBottom: 2,
  },
  arrow: {
    color: '#d4d4d4',
    fontSize: 13,
    padding: '0 6px',
    flexShrink: 0,
    userSelect: 'none',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 13px',
    borderRadius: 8,
    border: '1px solid #e5e5e5',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
    fontFamily: 'Inter, sans-serif',
  },
  stepActive: {
    borderColor: '#1a1a1a',
    background: '#fff',
    boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
  },
  stepDone: {
    borderColor: '#d1fae5',
    background: '#f0fdf4',
  },
  stepError: {
    borderColor: '#fee2e2',
    background: '#fff5f5',
  },
  num: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#f4f4f4',
    border: '1px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: '#999',
    flexShrink: 0,
  },
  numDone: {
    background: '#22c55e',
    border: '1px solid #22c55e',
    color: '#fff',
  },
  numError: {
    background: '#ef4444',
    border: '1px solid #ef4444',
    color: '#fff',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  phaseName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.2,
  },
  phaseDesc: {
    fontSize: 10,
    color: '#999',
    lineHeight: 1.2,
    marginTop: 1,
  },
};
