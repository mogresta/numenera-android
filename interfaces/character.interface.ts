import {CharacterTypes} from "@/enums/characterType.enum";

export default interface Character {
  id?: number;
  name: string;
  description: string;
  tier: string;
  characterType: CharacterTypes;
  user?: number;
  deleted?: boolean;
}