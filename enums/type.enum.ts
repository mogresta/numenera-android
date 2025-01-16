export enum Types {
  ARTEFACT = 1,
  AUTOMATON,
  CYPHER,
  INSTALLATION,
  ODDITY,
  PLAN,
  VEHICLE,
}

export const TypeNames: Record<Types, string> = {
  [Types.ARTEFACT]: "Artefact",
  [Types.AUTOMATON]: "Automaton",
  [Types.CYPHER]: "Cypher",
  [Types.INSTALLATION]: "Installation",
  [Types.ODDITY]: "Oddity",
  [Types.PLAN]: "Plan",
  [Types.VEHICLE]: "Vehicle",
}