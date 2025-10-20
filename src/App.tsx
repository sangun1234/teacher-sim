import  { useState } from "react";
import type { ScenarioFile } from "./types";
import { type ScoreState } from "./engine/scorer";
import Simulator from "./components/Simulator";
import ScenarioPicker from "./components/ScenarioPicker";
import ResultView from "./components/ResultView";



export default function App() {
  const [scenario, setScenario] = useState<ScenarioFile | null>(null);
  const [done, setDone] = useState<{ score: ScoreState; endId: string } | null>(null);
  const [_log, setLog] = useState<any>({
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
     backgroundImageUrl = "/assets/backgrounds/science/sc_background.jpg";
      characterImageUrl = "/assets/characters/science/sc_teacher.png";
    }
    else if (scenario.id.includes("math")) {
      backgroundImageUrl = "/assets/backgrounds/social/social_background.png";
      characterImageUrl = "/assets/characters/math/math_teacher.png";
    } else if (scenario.id.includes("social")) {
      backgroundImageUrl = "/assets/backgrounds/social/social_background.png";
      characterImageUrl = "/assets/characters/social/social_teacher.png";
    }
  }

  // 시나리오 종료 시 호출: 점수, 종료 ID 저장 및 로그를 localStorage에 저장
  function finishScenario(score: ScoreState, endId: string) {
    setDone({ score, endId }); // 완료 상태 저장
    setLog((prev: any) => {
      // 종료 시간, 점수, 종료 ID 추가
      const newLog = { ...prev, endedAt: formatKoreanDateTime(new Date().toISOString()), score, endId };
      // localStorage에 로그 저장 (새로고침해도 기록 유지)
      localStorage.setItem("teacher-sim-log", JSON.stringify(newLog));
      return newLog;
    });
  }

  // 렌더링: 시나리오 선택, 시뮬레이터, 결과 화면 중 하나만 보여줌
  return (
    <div className="container">
      {/* 시나리오가 선택되지 않았을 때: 시나리오 선택 화면 */}
      {!scenario && (
        <ScenarioPicker onLoaded={start} />
      )}
      {/* 시나리오가 선택되고, 아직 끝나지 않았을 때: 시뮬레이터 화면 */}
      {scenario && !done && (
        <Simulator
          scenario={scenario}
          onFinish={finishScenario}
          backgroundImageUrl={backgroundImageUrl}
          characterImageUrl={characterImageUrl}
          onRecordSelection={recordSelection}
        />
      )}
      {/* 시나리오가 끝났을 때: 결과 화면 */}
      {scenario && done && (
        <ResultView
          scenario={scenario}
          score={done.score}
          endId={done.endId}
          log={_log}
          onRestart={() => {
            // 다시 시작: 상태 초기화
            setScenario(null);
            setDone(null);
          }}
        />
      )}
    </div>
  );
}