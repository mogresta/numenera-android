import Character from "@/interfaces/character.interface";
import {Item} from "@/interfaces/item.interface";

export interface GroupInventory {
  id: number;
  character: Character;
  expended: boolean;
  loaned: boolean;
  item: Item;
}

export interface GroupInventoryResponse {
  inventory: GroupInventory[];
  message?: string;
}