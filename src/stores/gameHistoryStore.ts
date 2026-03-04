import { create } from "zustand";

import { HistoryType, WinCondition } from "../types/ticTacToeTypes";

interface HistoryStoreState {
  addItem: (result: WinCondition) => void;
  history: HistoryType[];
}

export const useHistoryStore = create<HistoryStoreState>((set, get) => ({
  addItem: (result) => {
    const { history: currentHistory } = get();
    return set(() => ({
      history: [...currentHistory, { result, timestamp: new Date() }],
    }));
  },
  history: [],
}));
