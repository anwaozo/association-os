import { create } from "zustand";

export const useSelectedItem = create((set) => ({
   item: null,
   setItem: (item) => set({ item }),
   clearItem: () => set({ item: null }),
}));
