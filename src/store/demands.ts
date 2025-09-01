
export type Demand = {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  status: '开放中' | '洽谈中' | '已完成' | '已关闭';
  created: string;
  // This could be a reference to a user ID in the 'users' collection
  authorId?: string; 
};

// This is a placeholder for our mock database table for demands.
// In a real full-stack application, this would be a Firestore collection.
let demandsDB: Demand[] = [
  { id: 'D001', title: '为新的咖啡品牌设计一个定制logo', description: '我们需要一个现代、简约且令人难忘的logo，要能体现咖啡的温暖和社区感。颜色以棕色和米色为主。', budget: '¥3,500 - ¥7,000', category: '平面设计', status: '开放中', created: '2024-08-01', authorId: 'user-1' },
  { id: 'D002', title: '开发一款宠物看护服务的移动应用', description: '一款iOS和Android应用，功能包括用户注册、宠物档案管理、服务预订、在线支付和实时聊天。', budget: '¥56,000 - ¥84,000', category: '软件开发', status: '洽谈中', created: '2024-07-28', authorId: 'user-2' },
  { id: 'D003', title: '为一个新奇小工具寻找3D打印原型', description: '一个手持式电子产品的外壳原型，需要高精度打印，材料为ABS或类似强度的塑料。需要提供3D模型文件。', budget: '¥10,000 - ¥17,500', category: '3D建模', status: '开放中', created: '2024-07-25', authorId: 'user-1' },
  { id: 'D004', title: '网站专业翻译（中到英）', description: '一个大约5000字的营销网站，内容涉及科技和金融，需要翻译成地道的商务英语。', budget: '¥5,600 - ¥8,400', category: '翻译', status: '已完成', created: '2024-07-15', authorId: 'user-2' },
  { id: 'D005', title: '寻找环保包装的供应商', description: '为化妆品系列寻找可持续、可回收的包装解决方案，包括瓶子、罐子和外包装盒。', budget: '可议价', category: '采购', status: '开放中', created: '2024-08-05', authorId: 'user-1' },
];

/**
 * Simulates fetching all demands from a database (e.g., Firestore).
 * @returns A promise that resolves to an array of all demands.
 */
export async function getDemands(): Promise<Demand[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return a copy to prevent direct mutation, sorted by creation date.
  return [...demandsDB].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

/**
 * Simulates adding a new demand to the database (e.g., Firestore).
 * @param demandData The data for the new demand.
 * @returns A promise that resolves to the newly created demand.
 */
export async function addDemand(demandData: Omit<Demand, 'id' | 'created' | 'status'>): Promise<Demand> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newDemand: Demand = {
        ...demandData,
        id: `D${String(demandsDB.length + 1).padStart(3, '0')}`,
        status: '开放中',
        created: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    // Prepend to the array to show the newest first
    demandsDB = [newDemand, ...demandsDB];
    return newDemand;
}
