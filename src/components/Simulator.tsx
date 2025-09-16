import React, { useState } from 'react';
import type { ScenarioFile, ScenarioNode, ScenarioOption } from '../types';
import ResultView from './ResultView';

interface SimulatorProps {
  scenario: ScenarioFile;
  onFinish: (score: Record<string, number>, endId: string) => void;
}

const Simulator: React.FC<SimulatorProps> = ({ scenario, onFinish }) => {
  const [currentNode, setCurrentNode] = useState<ScenarioNode>(scenario.nodes[0]);
  const [score, setScore] = useState<Record<string, number>>({});
  const [endId, setEndId] = useState<string | null>(null);

  const handleOptionClick = (option: ScenarioOption) => {
    if (option.goto.startsWith('end')) {
      setEndId(option.goto);
      onFinish(score, option.goto);
    } else {
      const nextNode = scenario.nodes.find(n => n.id === option.goto);
      if (nextNode) setCurrentNode(nextNode);
      if (option.effects) {
        setScore(prev => {
          const updated = { ...prev };
          Object.entries(option.effects!).forEach(([k, v]) => {
            updated[k] = (updated[k] || 0) + v;
          });
          return updated;
        });
      }
    }
  };

  if (endId) {
    return <ResultView scenario={scenario} score={score} endId={endId} onRestart={()=>window.location.reload()} />;
  }

  return (
    <div className="simulator-card">
      <h2 className="scenario-title">{scenario.title}</h2>
      <p className="prompt-text">{currentNode.prompt}</p>
      <div className="options-grid">
        <button
          className="option-button primary"
          onClick={() => handleOptionClick(currentNode.options[0])}
        >
          {currentNode.options[0].text}
        </button>
        <button
          className="option-button"
          onClick={() => handleOptionClick(currentNode.options[1])}
        >
          {currentNode.options[1].text}
        </button>
      </div>
    </div>
  );
};

export default Simulator;