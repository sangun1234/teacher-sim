import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { ScenarioFile } from "../types";
import { levelize } from "../engine/scorer";

type Props = {
  scenario: ScenarioFile;
  score: Record<string, number>;
  endId: string;
  onRestart: () => void;
};

const RADAR_LABELS = [
  { key: "수업설계", label: "수업설계" },
  { key: "수업실행", label: "수업실행" },
  { key: "학생평가", label: "학생평가" },
  { key: "수업성찰", label: "수업성찰" },
];

export default function ResultView({ scenario, score, endId, onRestart }: Props) {
  const radarData = RADAR_LABELS.map(({ key, label }) => ({
    subject: label,
    score: score[key] ?? 0, // 'value'에서 'score'로 변경하여 명확성 증대
    fullMark: 50,
  }));

  const ending = scenario.endings?.[endId];
  const feedback = ending?.feedback || "전반적으로 우수한 역량을 보였습니다. 일부 영역에서 추가적인 성장이 기대됩니다.";
  const strengths = Object.keys(score).filter(k => score[k] >= 80);
  const improvements = Object.keys(score).filter(k => score[k] < 80);

  return (
    <div className="result-card">
      <h2 className="card-title">최종 역량 진단 결과</h2>
      <div className="card-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 14, fontWeight: 600, fill: '#333' }} 
              />
              <PolarRadiusAxis angle={90} domain={[0, 20]} tick={false} axisLine={false} />
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