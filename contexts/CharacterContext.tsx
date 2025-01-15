import React, { createContext, useContext, useState } from 'react';
import Character from '@/interfaces/character.interface';

interface CharacterEditContextType {
  editingCharacter: Character | null;
  setEditingCharacter: (character: Character | null) => void;
}

const CharacterContext = createContext<CharacterEditContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  return (
    <CharacterContext.Provider value={{ editingCharacter, setEditingCharacter }}>
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