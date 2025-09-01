
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';


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
  login: (userId: string) => Promise<void>;
  logout: () => void;
};

/*
 * =================================================================
 * 注意：这是您需要在Firestore的`users`集合中创建的数据的示例。
 * 应用现在将直接从Firestore读取数据。
 * =================================================================
const allMockUsersForFirestore = [
  // Admins
  { id: 'admin-1', name: '李明', email: 'li.ming@example.com', role: 'admin', status: '正常', rating: 5, online: true, specialty: '平台运营', description: '负责平台的日常运营和管理。' },
  
  // Suppliers
  { id: 'supplier-1', name: '创新科技', email: 'contact@chuangxin.tech', role: 'supplier', specialty: '高精度3D打印', status: '正常', rating: 4.8, online: true, description: '一家领先的创新电子元件制造商，拥有超过十年的历史。' },
  { id: 'supplier-2', name: '快速原型公司', email: 'info@rapid-proto.com', role: 'supplier', specialty: 'SLA & FDM 打印', status: '正常', rating: 4.5, online: false, description: '提供快速、可靠的原型制作服务。' },

  // Creators
  { id: 'creator-1', name: '爱丽丝', email: 'alice@example.com', role: 'creator', specialty: '奇幻与科幻角色设计', description: '10年以上角色设计经验，专精于奇幻与科幻风格。', tags: ['3D角色', '科幻', '风格化'], rating: 4.9, online: true, status: '正常' },
  { id: 'creator-2', name: '鲍勃', email: 'bob@example.com', role: 'creator', specialty: '建筑可视化', description: '建筑可视化与写实渲染专家。', tags: ['建筑可视化', '写实', 'UE引擎'], rating: 4.8, online: false, status: '正常' },
  { id: 'creator-3', name: '查理', email: 'charlie@example.com', role: 'creator', specialty: '游戏资产', description: '热衷于创作游戏可用资产与环境。', tags: ['游戏资产', 'PBR', 'Blender'], rating: 5.0, online: true, status: '正常' },
  { id: 'creator-4', name: '戴安娜', email: 'diana@example.com', role: 'creator', specialty: '动态图形与抽象3D艺术', description: '动态图形与抽象3D艺术专家。', tags: ['抽象', 'Houdini', '动态设计'], rating: 4.7, online: true, status: '正常' },

  // Users
  { id: 'user-1', name: '张伟', email: 'zhang.wei@example.com', role: 'user', status: '正常', rating: 3, online: false, description: '一个普通的用户。' },
  { id: 'user-2', name: '陈洁', email: 'chen.jie@example.com', role: 'user', status: '正常', rating: 4, online: true, description: '一个活跃的用户。' },
];
*/


/**
 * Fetches all users from the Firestore 'users' collection.
 * @returns A promise that resolves to an array of all users.
 */
export async function getUsers(): Promise<User[]> {
    try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        return userList;
    } catch (error) {
        console.error("Error fetching users from Firestore:", error);
        return [];
    }
}

/**
 * Fetches a single user by ID from the Firestore 'users' collection.
 * @param userId The ID of the user to fetch.
 * @returns A promise that resolves to the user object or null if not found.
 */
export async function getUserById(userId: string): Promise<User | null> {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return { id: userDocSnap.id, ...userDocSnap.data() } as User;
        } else {
            console.log("No such user document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by ID from Firestore:", error);
        return null;
    }
}


/**
 * Updates a user's data in Firestore.
 * @param userId The ID of the user to update.
 * @param data The data to update.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user in Firestore:", error);
        throw error;
    }
}

/**
 * Deletes a user from Firestore.
 * @param userId The ID of the user to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteUser(userId: string): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
    } catch (error) {
        console.error("Error deleting user from Firestore:", error);
        throw error;
    }
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      login: async (userId: string) => {
        try {
            const userData = await getUserById(userId);
            if (userData) {
              set({ role: userData.role, user: userData });
            } else {
              console.error("Login failed: User not found.");
              set({ role: null, user: null });
            }
        } catch (error) {
            console.error("Error during login:", error);
            set({ role: null, user: null });
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
