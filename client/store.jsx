import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24h

const useStore = create(
  persist(
    (set) => ({
      user: false,
      setUser: (value) => set({ user: value, timestamp: Date.now() }),
      
      isAuthenticated: false,
      setIsAuthenticated: (value) => set({ isAuthenticated: value, timestamp: Date.now() }),
      
      isAdmin: false,
      setIsAdmin: (value) => set({ isAdmin: value, timestamp: Date.now() }),
      
      signOut: () => {
        // Clear all session storage items
        sessionStorage.removeItem("auth-storage"); 
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("first_name");
        sessionStorage.removeItem("last_name");
        
        // Reset all state to initial values
        set({ 
          user: false, 
          isAuthenticated: false,
          isAdmin: false,
          timestamp: Date.now() 
        }); 
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
      serialize: (state) => JSON.stringify({ state, timestamp: Date.now() }),
      deserialize: (str) => {
        try {
          const data = JSON.parse(str);
          if (data?.timestamp) {
            const now = Date.now();
            if (now - data.timestamp > EXPIRATION_TIME) {
              sessionStorage.removeItem("auth-storage");
              return { state: { user: false, isAuthenticated: false, isAdmin: false } };
            }
          }
          return data;
        } catch {
          return { state: { user: false, isAuthenticated: false, isAdmin: false } };
        }
      },
    }
  )
);

export default useStore;