
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'admin' | 'supplier' | 'user' | 'creator';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  // Creator/Supplier specific fields can be added here later
  specialty?: string; 
};

type AuthState = {
  role: Role | null;
  user: User | null;
  login: (userId: string, role: Role) => void;
  logout: () => void;
};

// This now acts as our mock database table for users.
const allMockUsers: Record<string, Omit<User, 'id'>> = {
  // Admins
  'admin-1': { name: '李明', email: 'li.ming@example.com', role: 'admin' },
  
  // Suppliers
  'supplier-1': { name: '创新科技', email: 'contact@chuangxin.tech', role: 'supplier', specialty: '高精度3D打印' },
  'supplier-2': { name: '快速原型公司', email: 'info@rapid-proto.com', role: 'supplier', specialty: 'SLA & FDM 打印' },

  // Creators
  'creator-1': { name: '爱丽丝', email: 'alice@example.com', role: 'creator', specialty: '奇幻与科幻角色设计' },
  'creator-2': { name: '鲍勃', email: 'bob@example.com', role: 'creator', specialty: '建筑可视化' },
  'creator-3': { name: '查理', email: 'charlie@example.com', role: 'creator', specialty: '游戏资产' },
  'creator-4': { name: '戴安娜', email: 'diana@example.com', role: 'creator', specialty: '动态图形与抽象3D艺术' },


  // Users
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
