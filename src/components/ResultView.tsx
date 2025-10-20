import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { ScenarioFile } from "../types";
import { levelize } from "../engine/scorer";
import FileBar from "./FileBar";

type Props = {
  scenario: ScenarioFile;
  score: Record<string, number>;
  endId: string;
  onRestart: () => void;
  log?: any;
};

const RADAR_LABELS = [
  { key: "수업설계", label: "수업설계" },
  { key: "수업실행", label: "수업실행" },
  { key: "학생평가", label: "학생평가" },
  { key: "수업성찰", label: "수업성찰" },
];

export default function ResultView({ scenario, score, endId, onRestart, log }: Props) {
  // 그래프에는 음수값을 0으로 표시하도록 처리
  const radarData = RADAR_LABELS.map(({ key, label }) => {
    const raw = score[key] ?? 0;
    const displayScore = Math.max(0, raw); // 음수는 0으로 표시
    return {
      subject: label,
      score: displayScore,
      fullMark: 40,
    };
  });

  const ending = scenario.endings?.[endId];
  const feedback = ending?.feedback || "전반적으로 우수한 역량을 보였습니다. 일부 영역에서 추가적인 성장이 기대됩니다.";
  const strengths = Object.keys(score).filter(k => (score[k] ?? 0) >= 80);
  const improvements = Object.keys(score).filter(k => (score[k] ?? 0) < 80);

  return (
    <div className="result-card">
      <FileBar scenario={scenario} log={log} />

      <h2 className="card-title">최종 역량 진단 결과</h2>
      <div className="card-content">
        <div className="chart-container" style={{ minWidth: 320, height: 400 }}>
          <ResponsiveContainer width="100%" height={380}>
            <RadarChart data={radarData} margin={{ top: 30, right: 40, left: 40, bottom: 30 }}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 16, fontWeight: 600, fill: 'white' }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} axisLine={false} />
              <Radar 
                name="나의 역량" 
                dataKey="score" 
                stroke="#007bff" 
                fill="#007bff" 
                fillOpacity={0.6} 
                strokeWidth={2}
                dot={{ r: 4, fill: '#007bff' }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '10px', 
                  borderColor: '#ddd',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="feedback-container">
          <h3>종합 피드백</h3>
          <p>{feedback}</p>
          <h3>세부 분석</h3>
          <ul>
            {strengths.map((k) => (
              <li key={k}>✅ <b>{k}</b>: {score[k]}점 → {levelize(score[k])}</li>
            ))}
            {improvements.map((k) => (
              <li key={k}>⚠️ <b>{k}</b>: {score[k]}점 → {levelize(score[k])}</li>
            ))}
          </ul>
        </div>
      </div>
      <button className="restart-button" onClick={onRestart}>
        다시 시작하기
      </button>
    </div>
  );
}