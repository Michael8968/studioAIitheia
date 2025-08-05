import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'admin' | 'supplier' | 'user' | 'creator';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  role: Role | null;
  user: User | null;
  login: (userId: string, role: Role) => void;
  logout: () => void;
};

// Simplified mock data based on PRD
const allMockUsers: Record<string, Omit<User, 'role'>> = {
  'admin-1': { id: 'admin-1', name: '李明', email: 'li.ming@example.com' },
  'supplier-1': { id: 'supplier-1', name: '创新科技', email: 'contact@chuangxin.tech' },
  'user-1': { id: 'user-1', name: '张伟', email: 'zhang.wei@example.com' },
  'creator-1': { id: 'creator-1', name: '王芳', email: 'wang.fang@example.com' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      login: (userId, role) => {
        const userData = allMockUsers[userId];
        if (userData) {
          set({ role, user: { ...userData, role } });
        }
      },
      logout: () => set({ role: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
