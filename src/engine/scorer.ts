import type { Effects, Competency } from "../types";

export type ScoreState = Record<Competency, number>;

export const initScore = (): ScoreState => ({
  "수업설계": 0, "수업실행": 0, "학생평가": 0, "수업성찰": 0
});

export function applyEffects(score: ScoreState, eff?: Effects): ScoreState {
  if (!eff) return score;

  // 1. 원본의 복사본을 만듭니다.
  const newScore = { ...score };

  for (const k of Object.keys(eff) as Competency[]) {
    // 2. 복사본의 값을 수정합니다.
    newScore[k] = (newScore[k] ?? 0) + (eff[k] ?? 0);
  }
  // 3. 수정된 복사본을 반환합니다.
  
  console.log(newScore)
  return newScore;
}

export function levelize(v: number) {
  if (v >= 5) return "강점";
  if (v >= 0) return "보통";
  return "개선 필요";
}
