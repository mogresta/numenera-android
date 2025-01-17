import client from '../api/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpdateUsernameResponse, User} from '@/interfaces/user.interface';
import Character from '@/interfaces/character.interface';
import {ItemResponse, ItemsResponse} from "@/interfaces/item.interface";
import {Sources} from "@/enums/source.enum";
import {Types} from "@/enums/type.enum";
import {PlanTypes} from "@/enums/planType.enum";
import {InventoryResponse} from "@/interfaces/inventory.interface";
import {GroupInventoryResponse} from "@/interfaces/groupInventory.interface";

export const apiService = {
  async updateUsername(userId: number, username: string): Promise<User> {
    try {
      const response = await client.post<UpdateUsernameResponse>('/update-username', {
        id: userId,
        username: username
      });
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
      }

      return response.data.user;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  },

  async deleteCharacter(characterId: number): Promise<void> {
    try {
      await client.delete(`/characters/delete/${characterId}`);
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  },

  async getCharacters(userId: number): Promise<Character[]> {
    try {
      const response = await client.post('/characters/all', {user: userId});

      return response.data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  },

  async updateCharacter(characterId: number, characterData: Character): Promise<void> {
    console.log(characterData)
    console.log(characterId)
    try {
      await client.patch(`/characters/update`, {
        id: characterId,
        ...characterData
      });
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  },

  async getItems(sources: Sources[] = [], types: Types[] = [], planTypes: PlanTypes[] = []): Promise<ItemsResponse> {
    try {
      const response = await client.get('/items/all', {
        params: {
          sources: sources.join(','),
          types: types.join(','),
          planTypes: planTypes.join(','),
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  async getGroupItems(): Promise<GroupInventoryResponse> {
    try {
      const response = await client.get('/group-inventory');

      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  async getInventoryItems(characterId: number): Promise<InventoryResponse> {
    try {
      const response = await client.post('/inventory', { character: characterId });

      return response.data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  async searchItems(name: string): Promise<ItemsResponse> {
    try {
      const response = await client.post('/items/search', { name: name });
      return response.data;
    } catch (error) {
      console.error('Error searching items:', error);
      throw error;
    }
  },

  async getItem(id: number): Promise<ItemResponse> {
    try {
      const response = await client.get(`/items/${id}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  async createCharacter(data: Character): Promise<void> {
    console.log(data)
    try {
      await client.post('/characters/create', data);
    } catch (error) {
      console.error('Error creating character:', error);
      throw error;
    }
  },

  async addItemToGroupInventory(itemId: number) {
    const response = await client.post('/group-inventory/add', {item: itemId});
    return response.data;
  },

  async addItemToCharacterInventory(characterId: number, itemId: number, groupInventoryId: number | null = null) {
    const parameters = {
      item: itemId,
      character: characterId,
      groupInventoryId: groupInventoryId ?? null
    }

    const response = await client.post('/inventory/add', parameters);

    return response.data;
  },

  async loanItemFromGroup(itemId: number, characterId: number) {
    const response = await client.patch('/group-inventory/lend', {
      groupInventory: itemId,
      character: characterId,
    });
    return response.data;
  },

  async expendItem(inventoryItemId: number) {
    const response = await client.patch('/inventory/expend', {
      id: inventoryItemId
    });
    return response.data;
  },

  async returnItemToGroup(itemId: number, groupInventoryId: number) {
    const response = await client.post('/group-inventory/add', {
      item: itemId,
      groupInventory: groupInventoryId
    });
    return response.data;
  }
};