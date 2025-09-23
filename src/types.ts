export type Competency = "수업설계" | "수업실행" | "학생평가" | "수업성찰";

export type Effects = Partial<Record<Competency, number>>;

export interface ScenarioOption { 
  text: string;
  goto: string;        // 다음 노드 ID 또는 "end:*"
  effects?: Effects;   // 역량 가중치
}

export interface ScenarioNode {
  id: string;
  prompt: string;
  options: ScenarioOption[];
}

export interface ScenarioEnding {
  feedback: string;
  rubric?: Partial<Record<Competency, number>>;
}

export interface ScenarioFile {
  id: string;
  title: string;
  competencies: Competency[];
  nodes: ScenarioNode[];
  endings?: Record<string, ScenarioEnding>;
}
