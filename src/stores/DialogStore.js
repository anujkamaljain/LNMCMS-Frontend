import { create } from 'zustand';

export const useDialogStore = create((set) => ({
  notFoundList: [],
  failedList: [],
  alreadyCreatedList: [],
  type: '',
  isOpen: false,
  setDialogData: (data) => set({ ...data, isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));

