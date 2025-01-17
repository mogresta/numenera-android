import React, { createContext, useContext, useState } from 'react';
import Character from '@/interfaces/character.interface';

interface CharacterContextType {
  editingCharacter: Character | null;
  setEditingCharacter: (character: Character | null) => void;
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
}

export const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  return (
    <CharacterContext.Provider value={{
      editingCharacter,
      setEditingCharacter,
      characters,
      setCharacters
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterEdit() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacterEdit must be used within a CharacterEditProvider');
  }
  return context;
}

export function useCharacters() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacters must be used within a CharacterEditProvider');
  }
  return context;
}