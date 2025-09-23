import React, { useState, useEffect, useRef } from "react";
import type { ScenarioFile, ScenarioNode, ScenarioOption } from "../types";
import { initScore, applyEffects, type ScoreState } from "../engine/scorer";
import ResultView from "./ResultView";
import GameScreen from "./GameScreen/GameScreen";

interface SimulatorProps {
  scenario: ScenarioFile;
  onFinish: (score: ScoreState, endId: string) => void;
  backgroundImageUrl: string;
  characterImageUrl: string;
  onRecordSelection?: (nodeId: string, optionId: string, optionText: string) => void;
}

type Mode = "prompt" | "response";

interface HistoryEntry {
  node: ScenarioNode;
  mode: Mode;
  dialogue: string;
  pendingOption: ScenarioOption | null;
  score: ScoreState;
}

const Simulator: React.FC<SimulatorProps> = ({
  scenario,
  onFinish,
  backgroundImageUrl,
  characterImageUrl,
  onRecordSelection,
}) => {
  const [currentNode, setCurrentNode] = useState<ScenarioNode>(scenario.nodes[0]);
  const [score, setScore] = useState<ScoreState>(initScore());
  const [endId, setEndId] = useState<string | null>(null);

  // 비주얼노벨 상태
  const [mode, setMode] = useState<Mode>("prompt");
  const [dialogue, setDialogue] = useState<string>(currentNode.prompt);
  const [pendingOption, setPendingOption] = useState<ScenarioOption | null>(null);

  // 히스토리 스택
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // 타이핑 효과
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  // 시나리오별 기본 캐릭터 이름
  const defaultCharacterName =
    scenario.title.includes("과학") ? "과학 선생님"
    : scenario.title.includes("수학") ? "수학 선생님"
    : scenario.title.includes("사회") ? "사회 선생님"
    : "선생님";

  // 타이핑 효과 구현
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    if (typingInterval.current) clearInterval(typingInterval.current);
    let i = 0;
    typingInterval.current = setInterval(() => {
      setDisplayedText(dialogue.slice(0, i + 1));
      i++;
      if (i >= dialogue.length) {
        if (typingInterval.current) clearInterval(typingInterval.current);
        setIsTyping(false);
      }
    }, 28);
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, [dialogue]);

  // 선택지 클릭 시: 대사 출력 모드로 전환 + 기록 + 히스토리 저장
  const handleOptionClick = (option: ScenarioOption) => {
    // 현재 상태를 히스토리에 저장
    setHistory(prev => [
      ...prev,
      {
        node: currentNode,
        mode,
        dialogue,
        pendingOption,
        score: { ...score },
      },
    ]);
    if (onRecordSelection) {
      onRecordSelection(currentNode.id, option.id, option.text);
    }
    setDialogue(option.response);
    setMode("response");
    setPendingOption(option);
    setScore(prevScore => applyEffects(prevScore, option.effects));
  };

  // 대사 출력 후(▼ 클릭): 다음 노드로 이동
  const handleNext = () => {
    if (mode === "response" && pendingOption) {
      if (pendingOption.goto.startsWith("end")) {
        setEndId(pendingOption.goto);
        onFinish(score, pendingOption.goto);
        return;
      }
      const nextNode = scenario.nodes.find(n => n.id === pendingOption.goto);
      if (nextNode) {
        setCurrentNode(nextNode);
        setDialogue(nextNode.prompt);
        setMode("prompt");
        setPendingOption(null);
      }
    }
  };

  // 뒤로가기: 히스토리에서 이전 상태 복원
  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentNode(prev.node);
    setMode(prev.mode);
    setDialogue(prev.dialogue);
    setPendingOption(prev.pendingOption);
    setScore(prev.score);
  };

  // 홈(메뉴) 버튼: 시작화면으로 이동
  const handleHome = () => {
    window.location.reload(); // 또는 App.tsx에서 setScenario(null) 등으로 구현
  };

  // 시스템 메뉴 버튼 구성
  const SYSTEM_MENUS = [
    { key: "back", label: "뒤로가기", onClick: handleBack },
    { key: "home", label: "홈", onClick: handleHome },
  ];

  // 메인패널 클릭 핸들러
  const handlePanelClick = () => {
    if (isTyping) {
      setDisplayedText(dialogue);
      setIsTyping(false);
      if (typingInterval.current) clearInterval(typingInterval.current);
    } else if (mode === "response") {
      handleNext();
    }
  };

  if (endId) {
    return (
      <ResultView
        scenario={scenario}
        score={score}
        endId={endId}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <GameScreen
        backgroundImageUrl={backgroundImageUrl}
        characterImageUrl={characterImageUrl}
        characterName={defaultCharacterName}
        dialogue={displayedText}
        onClick={handlePanelClick}
        systemMenus={SYSTEM_MENUS}
      />
      {/* 선택지는 대사가 모두 출력되고, mode가 prompt일 때만 캐릭터 위에 표시 */}
      {!isTyping && mode === "prompt" && (
        <div
          className="options-above-character"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "32vh",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 15,
            minWidth: "340px",
            maxWidth: "90vw",
            alignItems: "center",
            opacity: 0,
            animation: "fadeIn 0.7s 0.1s forwards"
          }}
        >
          {currentNode.options.map((option, idx) => (
            <button
              key={idx}
              className="option-button"
              onClick={() => handleOptionClick(option)}
              style={{
                fontSize: "1.1em",
                padding: "1.1em 2em",
                borderRadius: "16px",
                background: "#fff",
                border: "2px solid #e0e0e0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                cursor: "pointer",
                width: "100%",
                maxWidth: "600px",
                wordBreak: "keep-all",
                transition: "background 0.2s, color 0.2s"
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
      {/* ▼ 표시: 대사 출력이 끝나고, response 모드일 때만 */}
      {!isTyping && mode === "response" && (
        <div
          className="next-indicator"
          onClick={handleNext}
          style={{
            position: "absolute",
            right: "3vw",
            bottom: "4vh",
            fontSize: "2.5em",
            color: "#888",
            cursor: "pointer",
            zIndex: 20,
            userSelect: "none",
            animation: "bounce 1.2s infinite"
          }}
        >
          ▼
        </div>
      )}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(12px);}
        }
        `}
      </style>
    </div>
  );
};

export default Simulator;