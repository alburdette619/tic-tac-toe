import AsyncStorage from "@react-native-async-storage/async-storage";
import { subMonths } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { HistoryType, WinCondition } from "../types/ticTacToeTypes";

interface HistoryStoreState {
  addItem: (result: WinCondition) => void;
  history: HistoryType[];
}

export const useHistoryStore = create<HistoryStoreState>()(
  persist(
    (set, get) => ({
      addItem: (result) => {
        const { history: currentHistory } = get();
        return set(() => ({
          history: [
            { result, timestamp: new Date().getTime() },
            ...currentHistory,
          ],
        }));
      },
      history: [],
    }),
    {
      name: "game-history",
      partialize: (state) => ({
        history: state.history.filter((item) => {
          const oneMonthAgo = subMonths(new Date(), 1).getTime();
          return item.timestamp > oneMonthAgo;
        }),
      }),
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
