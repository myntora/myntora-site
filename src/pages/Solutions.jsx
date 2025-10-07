import React, { useEffect, useState } from 'react';
import './Solutions.css';

const ChoiceOutcome = ({ outcome }) => {
  if (!outcome || typeof outcome !== 'object') return null;

  // Eski ve yeni şemayı birlikte destekle
  const verdict =
    typeof outcome.verdictLabel === 'string'
      ? outcome.verdictLabel
      : typeof outcome.title === 'string'
        ? outcome.title
        : '';

  const profileLabel =
    outcome && outcome.profile && typeof outcome.profile.label === 'string'
      ? outcome.profile.label
      : '';

  const profileDesc =
    outcome && outcome.profile && typeof outcome.profile.description === 'string'
      ? outcome.profile.description
      : '';

  const empath = typeof outcome.empath === 'string' ? outcome.empath : '';

  const reasoning = Array.isArray(outcome.reasoning) ? outcome.reasoning : [];
  const contradictions = Array.isArray(outcome.contradictions) ? outcome.contradictions : [];

  const closing =
    typeof outcome.closing === 'string'
      ? outcome.closing
      : typeof outcome.footer === 'string'
        ? outcome.footer
        : '';

  return (
    <div className="choice-outcome">
      {verdict && <p><em>Your Verdict:</em> {verdict}</p>}

      {(profileLabel || profileDesc || empath) && (
        <div style={{ margin: '8px 0 12px' }}>
          {profileLabel && <div style={{ fontWeight: 600 }}>{profileLabel}</div>}
          {profileDesc && <div style={{ opacity: 0.9 }}>{profileDesc}</div>}
          {empath && (
            <>
              <div style={{ fontWeight: 600, marginTop: 10 }}>Empath</div>
              <div style={{ opacity: 0.9 }}>{empath}</div>
            </>
          )}
        </div>
      )}

      {reasoning.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Reasoning</strong>
          <ul style={{ marginTop: 6 }}>
            {reasoning.map((r, i) => <li key={i}>{String(r)}</li>)}
          </ul>
        </div>
      )}

      {contradictions.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Contradictions</strong>
          <ul style={{ marginTop: 6 }}>
            {contradictions.map((c, i) => <li key={i}>{String(c)}</li>)}
          </ul>
        </div>
      )}

      {closing && <p style={{ fontStyle: 'italic', marginTop: 8 }}>{closing}</p>}
    </div>
  );
};


// --- Verdict outcome form (One Hour Left) ---
const VerdictForm = ({ cfg, verdictQ1, setVerdictQ1, verdictQ2, setVerdictQ2, verdictOther, setVerdictOther }) => {
  const { q1, q2 } = cfg;
  return (
    <div className="verdict-form">
      <p className="solution-prompt">{q1.prompt}</p>
      <div className="verdict-q1">
        {q1.options.map(opt => (
          <label key={opt} className="verdict-radio">
            <span>{opt}</span>

            <input
              type="radio"
              name="verdict-q1"
              value={opt}
              checked={verdictQ1 === opt}
              onChange={(e) => setVerdictQ1(e.target.value)}
            />
          </label>
        ))}
      </div>

      <p className="solution-prompt">{q2.prompt}</p>
      <select
        className="verdict-select"
        value={verdictQ2}
        onChange={(e) => setVerdictQ2(e.target.value)}
      >
        <option value="">Choose a suspect</option>
        {q2.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>

      {verdictQ2 === 'Other' && (
        <input
          type="text"
          placeholder="Type the name…"
          value={verdictOther}
          onChange={(e) => setVerdictOther(e.target.value)}
        />
      )}
    </div>
  );
};

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [activeSolution, setActiveSolution] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [hint, setHint] = useState('');
  const [caseSel, setCaseSel] = useState({});
  const [caseErr, setCaseErr] = useState({});

  // verdict state
  const [verdictQ1, setVerdictQ1] = useState('');
  const [verdictQ2, setVerdictQ2] = useState('');
  const [verdictOther, setVerdictOther] = useState('');

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/solutions.json')
      .then(res => res.json())
      .then(data => setSolutions(data))
      .catch(err => console.error("Failed to load solutions.json", err));
  }, []);
  function getTargetedHint(solution, guessRaw) {
    const g = normalize(guessRaw);
    const bySus = solution?.incorrect?.bySuspect || {};
    for (const key of Object.keys(bySus)) {
      if (g.includes(normalize(key))) return bySus[key];
    }
    return solution?.incorrect?.generic || 'Incorrect. Try again.';
  }
  function normalize(v) {
    return (v || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\p{Letter}\p{Number}\s]/gu, '') // noktalama/aksan temizle
      .replace(/\s+/g, ' ')                        // çoklu boşluk → tek boşluk
      .trim();
  }
  const handleSubmit = () => {
    if (!activeSolution) return;

    // ------ VERDICT MODE ------
    if (activeSolution.type === 'verdict' && activeSolution.verdict) {
      const { q1, q2 } = activeSolution.verdict;

      const ansQ1 = normalize(q1.answer);
      const ansQ2 = normalize(q2.answer);

      const userQ1 = normalize(verdictQ1);
      const userQ2 = normalize(verdictQ2 === 'Other' ? verdictOther : verdictQ2);

      const ok = userQ1 === ansQ1 && userQ2 === ansQ2;
      setIsCorrect(ok);

      if (ok && activeSolution.redirectUrl) {
        setTimeout(() => {
          window.location.href = activeSolution.redirectUrl;
        }, 1200);
      }
      return;
    }

    // ------ CHOICE MODE ------
    if (activeSolution.type === 'choice' && activeSolution.outcomes) {
      setIsCorrect(true);
      return;
    }
    // ------ CASE-MATCHER MODE ------
    if (activeSolution?.type === 'case-matcher') {
      const items = activeSolution.cases || [];
      const errs = {};
      let allOk = true;

      items.forEach(it => {
        const sel = (caseSel[it.id] || '').trim();
        const ans = (it.answer || '').trim();
        const ok = sel === ans;
        errs[it.id] = !ok;
        if (!ok) allOk = false;
      });

      setCaseErr(errs);
      setIsCorrect(allOk);
      return;
    }

    // ------ TEXT/CODE MODE ------
    const correctAnswer = activeSolution.answer;
    const inputAnswer = normalize(userInput);

    let ok = false;
    if (Array.isArray(correctAnswer)) {
      ok = correctAnswer.map(a => normalize(a)).includes(inputAnswer);
    } else {
      ok = inputAnswer === normalize(correctAnswer);
    }
    setIsCorrect(ok);
    if (!ok) setHint(getTargetedHint(activeSolution, userInput));
  };

  const handleOpen = (s) => {
    setActiveSolution(s);
    setUserInput('');
    setIsCorrect(null);
    setHint('');
    setVerdictQ1('');
    setVerdictQ2('');
    setVerdictOther('');
    setCaseSel({});
    setCaseErr({});
  };

  const handleClose = () => {
    setActiveSolution(null);
    setUserInput('');
    setIsCorrect(null);
    setHint('');
    setVerdictQ1('');
    setVerdictQ2('');
    setVerdictOther('');
    setCaseSel({});
    setCaseErr({});
  };

  return (
    <div className="solutions-wrapper">
      <div className="solutions-header">
        <p className="solutions-label">🗄️ CONFIDENTIAL ARCHIVE – AUTHORIZED ACCESS ONLY</p>
        <h1 className="solutions-title">Solution Terminal</h1>
        <p className="solutions-tagline">Each file below requires a case-specific solution. Input wisely.</p>
      </div>

      <div className="solutions-grid">
        {solutions.map((s) => (
          <div key={s.slug} className="solution-card" onClick={() => handleOpen(s)}>
            <h3>{s.title}</h3>
            <p>Click to enter your solution</p>
          </div>
        ))}
      </div>


      {activeSolution && (
        <div className="solution-modal-backdrop">
          <div className="solution-modal">
            <h2>{activeSolution.title}</h2>
            <p className="solution-prompt">{activeSolution.prompt}</p>

            {activeSolution.type === 'verdict' && activeSolution.verdict && (
              <VerdictForm
                cfg={activeSolution.verdict}
                verdictQ1={verdictQ1}
                setVerdictQ1={setVerdictQ1}
                verdictQ2={verdictQ2}
                setVerdictQ2={setVerdictQ2}
                verdictOther={verdictOther}
                setVerdictOther={setVerdictOther}
              />
            )}
            {activeSolution?.type === 'case-matcher' && (
              <div className="caseMatcher">
                {(activeSolution.cases || []).map(cs => (
                  <div key={cs.id} className={`caseRow ${caseErr[cs.id] ? 'is-error' : ''}`}>
                    <div className="caseLabel">{cs.label}</div>
                    <select
                      className="caseSelect"
                      value={caseSel[cs.id] || ''}
                      onChange={(e) => setCaseSel(prev => ({ ...prev, [cs.id]: e.target.value }))}
                    >
                      <option value="">— Select a crime —</option>
                      {(activeSolution.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {caseErr[cs.id] && <div className="caseHint">Wrong match</div>}
                  </div>
                ))}
              </div>
            )}

            {activeSolution.type === 'choice' ? (
              <select
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}>
                <option value="">Choose an option</option>
                {activeSolution.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : null}

            {(activeSolution.type === 'text' || activeSolution.type === 'code') && (
              <input
                type="text"
                placeholder="Enter your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className={isCorrect === false ? 'input-error' : ''}
              />
            )}

            <button onClick={handleSubmit}>Submit</button>

            {isCorrect === true && (
              <>
                <div className="correct">✅ Correct! You solved it.</div>

                {typeof activeSolution.fullSolutionText === 'string' && (
                  <div className="solution-reveal">
                    <p>{activeSolution.fullSolutionText}</p>
                  </div>
                )}

                {activeSolution.reveal && typeof activeSolution.reveal === 'object' && (
                  <div className="solution-reveal">
                    {typeof activeSolution.reveal.verdict === 'string' && (
                      <p><strong>Verdict:</strong> {activeSolution.reveal.verdict}</p>
                    )}
                    {typeof activeSolution.reveal.motive === 'string' && (
                      <p><strong>Motive:</strong> {activeSolution.reveal.motive}</p>
                    )}
                    {typeof activeSolution.reveal.method === 'string' && (
                      <p><strong>Method:</strong> {activeSolution.reveal.method}</p>
                    )}

                    {Array.isArray(activeSolution.reveal.evidence) && activeSolution.reveal.evidence.length > 0 && (
                      <>
                        <p><strong>Key Evidence</strong></p>
                        <ul>{activeSolution.reveal.evidence.map((e, i) => <li key={i}>{String(e)}</li>)}</ul>
                      </>
                    )}

                    {Array.isArray(activeSolution.reveal.timeline) && activeSolution.reveal.timeline.length > 0 && (
                      <>
                        <p><strong>Timeline</strong></p>
                        <ul>{activeSolution.reveal.timeline.map((t, i) => <li key={i}>{String(t)}</li>)}</ul>
                      </>
                    )}

                    {typeof activeSolution.reveal.epilogue === 'string' && (
                      <p style={{ fontStyle: 'italic' }}>{activeSolution.reveal.epilogue}</p>
                    )}
                  </div>
                )}

              </>
            )}


            {isCorrect === false && (
              <p className="incorrect">❌ {hint || 'Incorrect. Try again.'}</p>
            )}

            {activeSolution.type === 'choice' &&
              isCorrect === true &&
              activeSolution.outcomes &&
              userInput &&
              activeSolution.outcomes[userInput] && (
                <ChoiceOutcome outcome={activeSolution.outcomes[userInput]} />
              )}

            <button className="close-btn" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Solutions;
