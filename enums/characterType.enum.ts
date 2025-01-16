export enum CharacterTypes {
  NANO = 1,
  JACK,
  GLAIVE,
  ARKUS,
  WRIGHT,
  DELVE,
}

export const CharacterTypeNames: Record<CharacterTypes, string> = {
  [CharacterTypes.NANO]: "Nano",
  [CharacterTypes.JACK]: "Jack",
  [CharacterTypes.GLAIVE]: "Glaive",
  [CharacterTypes.ARKUS]: "Arkus",
  [CharacterTypes.WRIGHT]: "Wright",
  [CharacterTypes.DELVE]: "Delve",
}