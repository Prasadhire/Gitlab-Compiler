import React, { useState } from 'react';
import Header     from './components/Header';
import Pipeline   from './components/Pipeline';
import Editor     from './components/Editor';
import TokenPanel from './components/TokenPanel';
import ASTPanel   from './components/ASTPanel';
import { SemanticPanel, CodeGenPanel, OutputPanel } from './components/OutputPanels';
import { compile, EXAMPLES } from './compiler';
import './index.css';

const TABS = [
  { id: 'tokens',   label: 'Tokens'   },
  { id: 'ast',      label: 'AST'      },
  { id: 'semantic', label: 'Semantic' },
  { id: 'codegen',  label: 'Code Gen' },
  { id: 'output',   label: 'Output'   },
];

export default function App() {
  const [code,      setCode]      = useState(EXAMPLES[0].code);
  const [results,   setResults]   = useState(null);
  const [activeTab, setActiveTab] = useState('tokens');

  function handleRun() {
    const r = compile(code);
    setResults(r);

    // Auto-switch to first error tab, or output if all ok
    if (r.tokens.error)   { setActiveTab('tokens');   return; }
    if (r.ast.error)      { setActiveTab('ast');       return; }
    if (r.semantic.error) { setActiveTab('semantic');  return; }
    if (r.codegen.error)  { setActiveTab('codegen');   return; }
    setActiveTab('output');
  }

  function renderPanel() {
    if (!results) {
      const empty = {
        tokens:   <TokenPanel   tokens={null}   error={null} />,
        ast:      <ASTPanel     ast={null}       error={null} />,
        semantic: <SemanticPanel data={null}     error={null} />,
        codegen:  <CodeGenPanel  code={null}     error={null} />,
        output:   <OutputPanel   output={null}   error={null} />,
      };
      return empty[activeTab];
    }

    switch (activeTab) {
      case 'tokens':
        return <TokenPanel tokens={results.tokens.data} error={results.tokens.error} />;
      case 'ast':
        return <ASTPanel   ast={results.ast.data}       error={results.ast.error || results.tokens.error} />;
      case 'semantic':
        return <SemanticPanel
          data={{ infos: results.semantic.infos, warnings: results.semantic.warnings }}
          error={results.semantic.error || results.ast.error || results.tokens.error}
        />;
      case 'codegen':
        return <CodeGenPanel code={results.codegen.data} error={results.codegen.error || results.semantic.error} />;
      case 'output':
        return <OutputPanel output={results.output} error={results.codegen.error} />;
      default:
        return null;
    }
  }

  return (
    <div style={styles.app}>
      <Header />
      <Pipeline
        results={results ? {
          tokens:   results.tokens,
          ast:      results.ast,
          semantic: { ...results.semantic, data: results.semantic.infos?.length > 0 ? true : null },
          codegen:  results.codegen,
          output:   { data: results.output?.lines?.length >= 0 ? true : null, error: results.output?.error },
        } : null}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div style={styles.body}>
        {/* Left: Editor */}
        <div style={styles.editorPane}>
          <Editor value={code} onChange={setCode} onRun={handleRun} />
        </div>

        {/* Right: Output */}
        <div style={styles.outputPane}>
          {/* Tab bar */}
          <div style={styles.tabBar}>
            {TABS.map(t => (
              <button
                key={t.id}
                style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
                {results && getTabStatus(results, t.id) === 'error' && (
                  <span style={styles.tabErr}>●</span>
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div style={styles.panel}>
            {renderPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTabStatus(results, id) {
  if (id === 'tokens'   && results.tokens.error)   return 'error';
  if (id === 'ast'      && results.ast.error)       return 'error';
  if (id === 'semantic' && results.semantic.error)  return 'error';
  if (id === 'codegen'  && results.codegen.error)   return 'error';
  if (id === 'output'   && results.output?.error)   return 'error';
  return 'ok';
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'Inter, sans-serif',
    background: '#fff',
  },
  body: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    flex: 1,
    overflow: 'hidden',
  },
  editorPane: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  outputPane: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#fff',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid #e5e5e5',
    background: '#fafafa',
    flexShrink: 0,
  },
  tab: {
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 500,
    color: '#999',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'color 0.1s',
  },
  tabActive: {
    color: '#1a1a1a',
    borderBottom: '2px solid #1a1a1a',
    background: '#fff',
  },
  tabErr: {
    color: '#ef4444',
    fontSize: 8,
  },
  panel: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};
