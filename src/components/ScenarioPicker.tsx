import { useState } from "react";
import type { ScenarioFile } from "../types";

type Props = {
  onLoaded: (s: ScenarioFile) => void;
};

const preset = [
  { key: "과학", file: "/src/assets/scenarios/science.json" },
  { key: "사회", file: "/src/assets/scenarios/social.json" },
  { key: "수학", file: "/src/assets/scenarios/math.json" },
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
    <div className="p-4 space-y-2">
      <h2 style={{fontWeight:700, fontSize:18}}>시나리오 선택</h2>
      <div style={{display:"flex", gap:8}}>
        {preset.map(p=>(
          <button
            key={p.key}
            onClick={()=>load(p.file)}
            disabled={!!loading}
            style={{
              padding:"10px 14px", border:"1px solid #e5e7eb", borderRadius:8, cursor:"pointer"
            }}>
            {loading===p.file ? "불러오는 중..." : p.key}
          </button>
        ))}
      </div>

      <div>
        <label style={{fontSize:12, color:"#6b7280"}}>또는 JSON 불러오기</label><br/>
        <input
          type="file"
          accept="application/json"
          onChange={async (e)=>{
            const f = e.target.files?.[0];
            if (!f) return;
            const txt = await f.text();
            onLoaded(JSON.parse(txt) as ScenarioFile);
          }}
        />
      </div>
    </div>
  );
}
