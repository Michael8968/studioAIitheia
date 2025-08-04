
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'admin' | 'supplier' | 'user' | 'creator';

export type User = {
  name: string;
  role: Role;
};

type AuthState = {
  role: Role | null;
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
};

const mockUsers: Record<Role, User> = {
  admin: { name: '李明', role: 'admin' },
  supplier: { name: '创新科技', role: 'supplier' },
  user: { name: '张伟', role: 'user' },
  creator: { name: '王芳', role: 'creator' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      login: (role) => set({ role, user: mockUsers[role] }),
      logout: () => set({ role: null, user: null }),
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
