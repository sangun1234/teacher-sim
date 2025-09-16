import type { ScenarioFile, ScenarioNode } from "../types";

export function getNode(map: Record<string, ScenarioNode>, id: string) {
  const n = map[id];
  if (!n) throw new Error(`노드를 찾을 수 없습니다: ${id}`);
  return n;
}

export function indexNodes(scn: ScenarioFile) {
  const map: Record<string, ScenarioNode> = {};
  for (const n of scn.nodes) map[n.id] = n;
  return map;
}

export function isEnding(id: string) {
  return id.startsWith("end");
}
