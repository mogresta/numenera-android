export enum PlanTypes {
  CYPHER = 1,
  INSTALLATION,
  ARTEFACT,
  AUTOMATON,
  VEHICLE,
}

export const PlanTypeNames: Record<PlanTypes, string> = {
  [PlanTypes.CYPHER]: "Cypher",
  [PlanTypes.INSTALLATION]: "Installation",
  [PlanTypes.ARTEFACT]: "Artefact",
  [PlanTypes.AUTOMATON]: "Automaton",
  [PlanTypes.VEHICLE]: "Vehicle",
}