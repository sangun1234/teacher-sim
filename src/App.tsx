import React, { useState } from "react";
import type { ScenarioFile } from "./types";
import { type ScoreState } from "./engine/scorer";
import Simulator from "./components/Simulator";
import ScenarioPicker from "./components/ScenarioPicker";
import ResultView from "./components/ResultView";

// 과학 시나리오용 배경/캐릭터 이미지 import (파일명에 맞게 수정)
import bgScience from "./assets/backgrounds/science/sc_background.jpg";
import charScience from "./assets/characters/science/sc_teacher.png";
// 아래는 아직 이미지가 없으므로 주석 처리
// import bgMath from "./assets/backgrounds/math/classroom.jpg";
// import charMath from "./assets/characters/math/teacher.png";
// import bgSocial from "./assets/backgrounds/social/street.jpg";
// import charSocial from "./assets/characters/social/teacher.png";

export default function App() {
  const [scenario, setScenario] = useState<ScenarioFile | null>(null);
  const [done, setDone] = useState<{ score: ScoreState; endId: string } | null>(null);
  const [log, setLog] = useState<any>({
    scenarioId: null,
    scenarioTitle: null,
    selections: [],
    startedAt: null,
    endedAt: null,
  });
  function formatKoreanDateTime(isoString: string | null): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  // 1. 날짜 부분 (기존과 동일)
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  // 2. 시간 정보 가져오기
  let hours = date.getHours(); // 0-23시 형식으로 시간을 가져옴
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // 3. '오전/오후' 및 12시간제 변환
  const ampm = hours >= 12 ? "오후" : "오전";
  hours = hours % 12;
  if (hours === 0) { // 0시는 12시로 표시 (오전 12시, 오후 12시)
    hours = 12;
  }
  
  // 4. 최종 형식으로 조합하여 반환
  return `${yyyy}-${mm}-${dd} ${ampm} ${hours}:${minutes}`;
}
  function start(s: ScenarioFile) {
    setScenario(s);
    setDone(null);
    setLog({
      scenarioId: s.id,
      scenarioTitle: s.title,
      selections: [],
      startedAt: formatKoreanDateTime(new Date().toISOString()),
      endedAt: null,
    });
  }

  // 선택 기록 함수 (Simulator에서 호출)
  function recordSelection(nodeId: string, optionId: string, optionText: string) {
    setLog((prev: any) => ({
      ...prev,
      selections: [
        ...prev.selections,
        {
          nodeId,
          optionId,
          optionText,
          time: formatKoreanDateTime(new Date().toISOString()),
        },
      ],
    }));
  }

  // 시나리오별 이미지 매핑 (과학만 사용)
  let backgroundImageUrl = "";
  let characterImageUrl = "";
  if (scenario) {
    if (scenario.id.includes("science")) {
      backgroundImageUrl = bgScience;
      characterImageUrl = charScience;
    }
    // else if (scenario.id.includes("math")) {
    //   backgroundImageUrl = bgMath;
    //   characterImageUrl = charMath;
    // } else if (scenario.id.includes("social")) {
    //   backgroundImageUrl = bgSocial;
    //   characterImageUrl = charSocial;
    // }
  }

  // 시나리오 종료 시 기록 저장
  function finishScenario(score: ScoreState, endId: string) {
    setDone({ score, endId });
    setLog((prev: any) => {
      const newLog = { ...prev, endedAt: formatKoreanDateTime(new Date().toISOString()), score, endId };
      localStorage.setItem("teacher-sim-log", JSON.stringify(newLog));
      return newLog;
    });
  }

  return (
    <div className="container">
      {!scenario && (
        <ScenarioPicker onLoaded={start} />
      )}
      {scenario && !done && (
        <Simulator
          scenario={scenario}
          onFinish={finishScenario}
          backgroundImageUrl={backgroundImageUrl}
          characterImageUrl={characterImageUrl}
          onRecordSelection={recordSelection}
        />
      )}
      {scenario && done && (
        <ResultView
          scenario={scenario}
          score={done.score}
          endId={done.endId}
          onRestart={() => {
            setScenario(null);
            setDone(null);
          }}
        />
      )}
    </div>
  );
}