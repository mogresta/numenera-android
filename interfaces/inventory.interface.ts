import Character from "@/interfaces/character.interface";
import {Item} from "@/interfaces/item.interface";
import {GroupInventory} from "@/interfaces/groupInventory.interface";

export interface Inventory {
  id: number;
  character: Character;
  slots: number;
  items: InventoryItem[];
}

export interface InventoryItem {
  id: number;
  expended: boolean;
  inventory: Inventory;
  groupInventory: GroupInventory;
  item: Item;
}

export interface InventoryResponse {
  inventory: Inventory;
  message?: string;
}