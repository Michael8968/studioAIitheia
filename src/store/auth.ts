
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'admin' | 'supplier' | 'user' | 'creator';
export type UserStatus = "正常" | "已暂停" | "黑名单";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  specialty?: string;
  description?: string;
  tags?: string[];
  rating?: number;
  online?: boolean;
  status?: UserStatus;
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
  'admin-1': { name: '李明', email: 'li.ming@example.com', role: 'admin', status: '正常', rating: 5, online: true },
  
  // Suppliers
  'supplier-1': { name: '创新科技', email: 'contact@chuangxin.tech', role: 'supplier', specialty: '高精度3D打印', status: '正常', rating: 4, online: true },
  'supplier-2': { name: '快速原型公司', email: 'info@rapid-proto.com', role: 'supplier', specialty: 'SLA & FDM 打印', status: '正常', rating: 4.5, online: false },

  // Creators
  'creator-1': { name: '爱丽丝', email: 'alice@example.com', role: 'creator', specialty: '奇幻与科幻角色设计', description: '10年以上角色设计经验，专精于奇幻与科幻风格。', tags: ['3D角色', '科幻', '风格化'], rating: 4.9, online: true, status: '正常' },
  'creator-2': { name: '鲍勃', email: 'bob@example.com', role: 'creator', specialty: '建筑可视化', description: '建筑可视化与写实渲染专家。', tags: ['建筑可视化', '写实', 'UE引擎'], rating: 4.8, online: false, status: '正常' },
  'creator-3': { name: '查理', email: 'charlie@example.com', role: 'creator', specialty: '游戏资产', description: '热衷于创作游戏可用资产与环境。', tags: ['游戏资产', 'PBR', 'Blender'], rating: 5.0, online: true, status: '正常' },
  'creator-4': { name: '戴安娜', email: 'diana@example.com', role: 'creator', specialty: '动态图形与抽象3D艺术', description: '动态图形与抽象3D艺术专家。', tags: ['抽象', 'Houdini', '动态设计'], rating: 4.7, online: true, status: '正常' },

  // Users
  'user-1': { name: '张伟', email: 'zhang.wei@example.com', role: 'user', status: '已暂停', rating: 3, online: false },
  'user-2': { name: '陈洁', email: 'chen.jie@example.com', role: 'user', status: '黑名单', rating: 1, online: false },
};


/**
 * Simulates fetching all users from a database.
 * In a real application, this would be a fetch call to a backend API.
 * @returns A promise that resolves to an array of all users.
 */
export async function getUsers(): Promise<User[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const usersArray = Object.entries(allMockUsers).map(([id, userData]) => ({
        id,
        ...userData
    }));
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
