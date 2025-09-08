import React, { useEffect, useState } from 'react';
import './Solutions.css';

// --- Choice outcome renderer for structured outcomes (Room 103) ---
const ChoiceOutcome = ({ outcome }) => {
  if (!outcome) return null;
  const { title, profile, reasoning, contradictions, closing } = outcome;

  return (
    <div className="choice-outcome">
      {title && <h3 style={{ marginTop: 8 }}>{title}</h3>}

      {profile && (
        <div style={{ margin: '8px 0 12px' }}>
          <div style={{ fontWeight: 600 }}>{profile.label}</div>
          <div style={{ opacity: 0.9 }}>{profile.description}</div>
        </div>
      )}

      {Array.isArray(reasoning) && reasoning.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Reasoning</strong>
          <ul style={{ marginTop: 6 }}>
            {reasoning.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {Array.isArray(contradictions) && contradictions.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Contradictions</strong>
          <ul style={{ marginTop: 6 }}>
            {contradictions.map((c, i) => <li key={i}>{c}</li>)}
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

  function normalize(v) {
    return (v || '').trim().toLowerCase();
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

    // ------ TEXT/CODE MODE ------
    const correctAnswer = activeSolution.answer;
    const inputAnswer = normalize(userInput);

    if (Array.isArray(correctAnswer)) {
      setIsCorrect(correctAnswer.map(a => normalize(a)).includes(inputAnswer));
    } else {
      setIsCorrect(inputAnswer === normalize(correctAnswer));
    }
  };

  const handleOpen = (s) => {
    setActiveSolution(s);
    setUserInput('');
    setIsCorrect(null);
    setVerdictQ1('');
    setVerdictQ2('');
    setVerdictOther('');
  };

  const handleClose = () => {
    setActiveSolution(null);
    setUserInput('');
    setIsCorrect(null);
    setVerdictQ1('');
    setVerdictQ2('');
    setVerdictOther('');
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
                {activeSolution.fullSolutionText && (
                  <div className="solution-reveal">
                    <p>{activeSolution.fullSolutionText}</p>
                  </div>
                )}
              </>
            )}

            {isCorrect === false && (
              <p className="incorrect">❌ Incorrect. Try again.</p>
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
