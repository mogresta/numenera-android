import Character from "@/interfaces/character.interface";

interface TypeObject {
  id: number;
  name: string;
}

interface SourceObject {
  id: number;
  name: string;
}

interface PlanTypeObject {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  level?: string;
  forms?: string;
  depletion?: string;
  material?: string;
  modification?: string;
  reproduction?: string;
  type: TypeObject;
  planType?: PlanTypeObject;
  source?: SourceObject;
}

export interface ItemResponse {
  items: Item[];
  message?: string;
}