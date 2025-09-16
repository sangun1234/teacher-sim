import React, { useState } from 'react';
import type { ScenarioFile, ScenarioNode, ScenarioOption } from '../types';
import ResultView from './ResultView';
import { initScore, applyEffects } from '../engine/scorer';

interface SimulatorProps {
  scenario: ScenarioFile;
  onFinish: (score: Record<string, number>, endId: string) => void;
}

const Simulator: React.FC<SimulatorProps> = ({ scenario, onFinish }) => {
  const [currentNode, setCurrentNode] = useState<ScenarioNode>(scenario.nodes[0]);
  const [score, setScore] = useState<Record<string, number>>(initScore());
  const [endId, setEndId] = useState<string | null>(null);

  const handleOptionClick = (option: ScenarioOption) => {
    setScore(prevScore => {
      const updatedScore = applyEffects(prevScore, option.effects);
      if (option.goto.startsWith('end')) {
        setEndId(option.goto);
        onFinish(updatedScore, option.goto);
      } else {
        const nextNode = scenario.nodes.find(n => n.id === option.goto);
        if (nextNode) setCurrentNode(nextNode);
      }
      return updatedScore;
    });
  };

  if (endId) {
    return <ResultView scenario={scenario} score={score} endId={endId} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="simulator-card">
      <h2 className="scenario-title">{scenario.title}</h2>
      <p className="prompt-text">{currentNode.prompt}</p>
      <div className="options-grid">
        {currentNode.options.map((option, idx) => (
          <button
            key={idx}
            className={`option-button${idx === 0 ? ' primary' : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Simulator;