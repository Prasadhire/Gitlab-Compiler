import React from 'react';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.logoWrap}>
          <span style={styles.logoText}>ह</span>
        </div>
        <div>
          <h1 style={styles.title}>HinglishScript</h1>
          <p style={styles.sub}>Compiler Design · Phase 1 Submission</p>
        </div>
      </div>
      <div style={styles.right}>
        <span style={styles.badge}>4 Phases</span>
        <span style={styles.badge}>React + JS</span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 56,
    borderBottom: '1px solid #e5e5e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    background: '#fff',
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoWrap: {
    width: 32,
    height: 32,
    background: '#1a1a1a',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'serif',
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  sub: {
    fontSize: 12,
    color: '#999',
    margin: 0,
    marginTop: 1,
  },
  right: {
    display: 'flex',
    gap: 6,
  },
  badge: {
    fontSize: 11,
    fontWeight: 500,
    color: '#666',
    background: '#f4f4f4',
    border: '1px solid #e5e5e5',
    padding: '3px 9px',
    borderRadius: 20,
  },
};
