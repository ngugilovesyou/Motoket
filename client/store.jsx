import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      user: false,
      setUser: (value) => set({ user: value }),
      isAuthenticated:false,
      setIsAuthenticated: (value) =>set({isAuthenticated:value}),
    }),
    
    {
      name: "auth-storage", 
      getStorage: () => sessionStorage, 
    }
  )
);

export default useStore;
