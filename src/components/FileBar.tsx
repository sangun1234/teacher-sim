import type { ScenarioFile } from "../types";

type Props = {
  scenario?: ScenarioFile;
  log: any;
};

export default function FileBar({ scenario, log }: Props) {
  function saveJSON(obj: any, filename: string) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div style={{display:"flex", gap:8, alignItems:"center", padding:"8px 12px", borderBottom:"1px solid #e5e7eb"}}>
      <div style={{fontWeight:600}}>파일</div>
      {scenario && (
        <button onClick={()=>saveJSON(scenario, `${scenario.id}.json`)}
          style={{padding:"6px 10px", border:"1px solid #e5e7eb", borderRadius:6, cursor:"pointer"}}>
          시나리오 저장
        </button>
      )}
      <button onClick={()=>saveJSON(log, `result_${Date.now()}.json`)}
        style={{padding:"6px 10px", border:"1px solid #e5e7eb", borderRadius:6, cursor:"pointer"}}>
        결과 로그 저장
      </button>
    </div>
  );
}
