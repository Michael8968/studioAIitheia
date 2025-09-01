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

// This now acts as our mock database table for users.
const allMockUsers: Record<string, Omit<User, 'role' | 'id'> & {role: Role}> = {
  'admin-1': { name: '李明', email: 'li.ming@example.com', role: 'admin' },
  'supplier-1': { name: '创新科技', email: 'contact@chuangxin.tech', role: 'supplier' },
  'creator-1': { name: '王芳', email: 'wang.fang@example.com', role: 'creator' },
  'user-1': { name: '张伟', email: 'zhang.wei@example.com', role: 'user' },
  'user-2': { name: '陈洁', email: 'chen.jie@example.com', role: 'user' },
};


/**
 * Simulates fetching all users from a database.
 * In a real application, this would be a fetch call to a backend API.
 * @returns A promise that resolves to an array of all users.
 */
export async function getUsers(): Promise<User[]> {
    console.log("Simulating fetching users from the database...");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const usersArray = Object.entries(allMockUsers).map(([id, userData]) => ({
        id,
        ...userData
    }));
    console.log("Fetched users:", usersArray);
    return usersArray;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      login: (userId, role) => {
        const userData = Object.entries(allMockUsers).find(([id, _]) => id === userId);
        if (userData) {
          const [id, data] = userData;
          set({ role, user: { id, ...data } });
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
