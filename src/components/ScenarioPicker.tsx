import { useState } from "react";
import type { ScenarioFile } from "../types";
import styles from "./ScenarioPickerModern.module.css";

type Props = {
  onLoaded: (s: ScenarioFile) => void;
};

const preset = [
  { key: "과학", file: "/assets/scenarios/science.json" },
  { key: "사회", file: "/assets/scenarios/social.json" },
  { key: "수학", file: "/assets/scenarios/math.json" },
];

export default function ScenarioPicker({ onLoaded }: Props) {
  const [loading, setLoading] = useState<string>("");

  async function load(file: string) {
    setLoading(file);
    const res = await fetch(file);
    const json = await res.json();
    onLoaded(json as ScenarioFile);
    setLoading("");
  }

  return (
    <div className={styles["main-container"]}>
      <h1>시뮬레이션 선택</h1>
      <div className={styles["card-wrapper"]}>
        {preset.map((p) => (
          <div
            key={p.key}
            className={styles["subject-card"]}
            onClick={() => load(p.file)}
            style={{ pointerEvents: loading ? "none" : "auto" }}
          >
            <div className={styles["card-icon"]}>
              {p.key === "과학" && <span>🔬</span>}
              {p.key === "사회" && <span>🌏</span>}
              {p.key === "수학" && <span>📐</span>}
            </div>
            <h3>{loading === p.file ? "불러오는 중..." : p.key}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}