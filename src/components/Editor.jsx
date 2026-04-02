import React, { useRef, useState, useEffect } from 'react';
import { EXAMPLES } from '../compiler';

export default function Editor({ value, onChange, onRun }) {
  const taRef   = useRef(null);
  const numRef  = useRef(null);
  const [lines, setLines] = useState(1);

  useEffect(() => {
    const count = (value.match(/\n/g) || []).length + 1;
    setLines(count);
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = taRef.current;
      const s  = ta.selectionStart;
      const newVal = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
      });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  }

  function syncScroll() {
    if (numRef.current && taRef.current)
      numRef.current.scrollTop = taRef.current.scrollTop;
  }

  return (
    <div style={styles.wrap}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.dots}>
          <span style={{ ...styles.dot, background: '#ff5f57' }} />
          <span style={{ ...styles.dot, background: '#febc2e' }} />
          <span style={{ ...styles.dot, background: '#28c840' }} />
        </div>
        <span style={styles.filename}>main.hin</span>
        <div style={styles.exampleBtns}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              style={styles.exBtn}
              onClick={() => onChange(ex.code)}
              title={ex.label}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor body */}
      <div style={styles.editorBody}>
        <div ref={numRef} style={styles.lineNums}>
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} style={styles.lineNum}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={taRef}
          style={styles.textarea}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder="// Yahan HinglishScript likho...&#10;// Ctrl+Enter se compile karo"
        />
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <button style={styles.runBtn} onClick={onRun}>
          ▶ &nbsp;Compile &amp; Run
          <span style={styles.shortcut}>Ctrl+Enter</span>
        </button>
        <button style={styles.clearBtn} onClick={() => onChange('')}>
          Clear
        </button>
        <span style={styles.hint}>
          {lines} line{lines !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #e5e5e5',
    background: '#fff',
    overflow: 'hidden',
  },
  topBar: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 16px',
    borderBottom: '1px solid #e5e5e5',
    background: '#fafafa',
    flexShrink: 0,
  },
  dots: {
    display: 'flex',
    gap: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  filename: {
    fontSize: 12,
    fontWeight: 500,
    color: '#666',
    fontFamily: 'JetBrains Mono, monospace',
  },
  exampleBtns: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 5,
  },
  exBtn: {
    fontSize: 11,
    fontWeight: 500,
    color: '#666',
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    padding: '3px 8px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.1s',
  },
  editorBody: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  lineNums: {
    width: 44,
    padding: '14px 0',
    background: '#fafafa',
    borderRight: '1px solid #f0f0f0',
    overflow: 'hidden',
    flexShrink: 0,
    userSelect: 'none',
  },
  lineNum: {
    height: '1.65em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    fontSize: 12,
    color: '#ccc',
    fontFamily: 'JetBrains Mono, monospace',
    lineHeight: 1.65,
  },
  textarea: {
    flex: 1,
    border: 'none',
    outline: 'none',
    resize: 'none',
    padding: '14px 16px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13,
    lineHeight: 1.65,
    color: '#1a1a1a',
    background: 'transparent',
    caretColor: '#1a1a1a',
    tabSize: 2,
  },
  bottomBar: {
    height: 48,
    borderTop: '1px solid #e5e5e5',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fafafa',
    flexShrink: 0,
  },
  runBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 16px',
    borderRadius: 7,
    border: '1px solid #1a1a1a',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'opacity 0.15s',
  },
  shortcut: {
    fontSize: 10,
    color: '#888',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    padding: '1px 5px',
  },
  clearBtn: {
    padding: '7px 14px',
    borderRadius: 7,
    border: '1px solid #e5e5e5',
    background: '#fff',
    color: '#666',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  hint: {
    marginLeft: 'auto',
    fontSize: 11,
    color: '#bbb',
  },
};
