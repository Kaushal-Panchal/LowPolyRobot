import { create } from 'zustand';

export const useStore = create((set) => ({
    acceleration: 0,
    setAcceleration: (value) => set({ acceleration: value }),
    currentAction: 'Idle',
    setCurrentAction: (value) => set({ currentAction: value }),
    envAcclerationFac: 1,
    setEnvAcclerationFac: (value) => set({ envAcclerationFac: value }),
}));
