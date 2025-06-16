import React, { useEffect, useState } from 'react';
import './Solutions.css';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [activeSolution, setActiveSolution] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetch('/myntora-site/data/solutions.json')
      .then(res => res.json())
      .then(data => setSolutions(data));
  }, []);

  const handleSubmit = () => {
    if (!activeSolution) return;

    const correctAnswer = activeSolution.answer;
    const inputAnswer = userInput.trim().toLowerCase();

    if (activeSolution.type === 'choice' && activeSolution.outcomes) {
      // Room-103 gibi outcome odaklı oyunlarda doğruluk kontrolü yok
      setIsCorrect(true); // sadece outcome göstereceğiz
      return;
    }

    if (Array.isArray(correctAnswer)) {
      setIsCorrect(correctAnswer.map(a => a.toLowerCase()).includes(inputAnswer));
    } else {
      setIsCorrect(inputAnswer === correctAnswer.trim().toLowerCase());
    }
  };

  const handleClose = () => {
    setActiveSolution(null);
    setUserInput('');
    setIsCorrect(null);
  };

  return (
    <div className="solutions-wrapper">
      <div className="solutions-header">
        <p className="solutions-label">🗄️ CONFIDENTIAL ARCHIVE – AUTHORIZED ACCESS ONLY</p>
        <h1 className="solutions-title">Solution Terminal</h1>
        <p className="solutions-tagline">Each file below requires a case-specific code. Input wisely.</p>
      </div>

      <div className="solutions-grid">
        {solutions.map((s) => (
          <div key={s.slug} className="solution-card" onClick={() => setActiveSolution(s)}>
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

            {activeSolution.type === 'choice' ? (
              <select
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}>
                <option value="">Choose an option</option>
                {activeSolution.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
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
                <div className="correct">
                  ✅ Correct! You solved it.
                </div>
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
              userInput in activeSolution.outcomes && (
                <p className="choice-outcome">
                  {activeSolution.outcomes[userInput]}
                </p>
            )}

            <button className="close-btn" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
