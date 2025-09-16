import { useState } from "react";
import "./App.css";
import ScenarioPicker from "./components/ScenarioPicker";
import Simulator from "./components/Simulator";
import ResultView from "./components/ResultView";
import FileBar from "./components/FileBar";
import type { ScenarioFile } from "./types";
import { initScore } from "./engine/scorer";

export default function App() {
  const [scenario, setScenario] = useState<ScenarioFile | null>(null);
  const [done, setDone] = useState<{score: ReturnType<typeof initScore>, endId: string} | null>(null);
  const [log, setLog] = useState<any>({ selections: [] });

  function start(s: ScenarioFile) {
    setScenario(s);
    setDone(null);
    setLog({ scenarioId: s.id, selections: [], startedAt: new Date().toISOString() });
  }

  return (
    <div className="container">
      <div style={{maxWidth:880, width:'100%'}}>
        <FileBar scenario={scenario ?? undefined} log={log} />
        {!scenario && <ScenarioPicker onLoaded={start} />}

        {scenario && !done && (
          <Simulator
            scenario={scenario}
            onFinish={(score, endId)=>{
              setDone({score, endId});
              setLog((prev:any)=>({ ...prev, endedAt: new Date().toISOString(), score, endId }));
            }}
          />
        )}

        {scenario && done && (
          <ResultView
            scenario={scenario}
            score={done.score}
            endId={done.endId}
            onRestart={()=>{
              setScenario(null);
              setDone(null);
              setLog({ selections: [] });
            }}
          />
        )}
      </div>
    </div>
  );
}
