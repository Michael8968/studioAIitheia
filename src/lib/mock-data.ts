// 模拟数据服务 - 当Firestore不可用时使用
import { User, Role, UserStatus } from '@/store/auth';
import { Demand } from '@/store/demands';
import { KnowledgeEntry } from '@/store/knowledge';
import { PublicLink, PublicApi } from '@/store/resources';

// 模拟用户数据
export const mockUsers: User[] = [
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

// 模拟需求数据
export const mockDemands: Demand[] = [
  { id: 'demand-1', title: '为新的咖啡品牌设计一个定制logo', description: '我们需要一个现代、简约且令人难忘的logo，要能体现咖啡的温暖和社区感。颜色以棕色和米色为主。', budget: '¥3,500 - ¥7,000', category: '平面设计', status: '开放中', created: '2024-08-01', authorId: 'user-1' },
  { id: 'demand-2', title: '开发一款宠物看护服务的移动应用', description: '一款iOS和Android应用，功能包括用户注册、宠物档案管理、服务预订、在线支付和实时聊天。', budget: '¥56,000 - ¥84,000', category: '软件开发', status: '洽谈中', created: '2024-07-28', authorId: 'user-2' },
  { id: 'demand-3', title: '为一个新奇小工具寻找3D打印原型', description: '一个手持式电子产品的外壳原型，需要高精度打印，材料为ABS或类似强度的塑料。需要提供3D模型文件。', budget: '¥10,000 - ¥17,500', category: '3D建模', status: '开放中', created: '2024-07-25', authorId: 'user-1' },
  { id: 'demand-4', title: '网站专业翻译（中到英）', description: '一个大约5000字的营销网站，内容涉及科技和金融，需要翻译成地道的商务英语。', budget: '¥5,600 - ¥8,400', category: '翻译', status: '已完成', created: '2024-07-15', authorId: 'user-2' },
  { id: 'demand-5', title: '寻找环保包装的供应商', description: '为化妆品系列寻找可持续、可回收的包装解决方案，包括瓶子、罐子和外包装盒。', budget: '可议价', category: '采购', status: '开放中', created: '2024-08-05', authorId: 'user-1' },
];

// 模拟知识库数据
export const mockKnowledgeEntries: KnowledgeEntry[] = [
  { id: 'knowledge-1', name: '3D打印材料指南', category: '制造', tags: ['PLA', 'ABS', '树脂'], content: '详细介绍各种3D打印材料的特性、用途和打印参数。', created: '2024-08-01' },
  { id: 'knowledge-2', name: '标准供应链术语', category: '物流', tags: ['FOB', 'CIF', 'EXW'], content: '解释国际贸易中常用的供应链术语含义。', created: '2024-07-28' },
  { id: 'knowledge-3', name: '设计师色彩理论', category: '设计原则', tags: ['类比', '互补'], content: '涵盖色彩搭配的基本原则、心理学和在设计中的应用。', created: '2024-07-25' },
];

// 模拟公共链接数据
export const mockPublicLinks: PublicLink[] = [
  { id: 'link-1', name: 'ShadCN UI 文档', url: 'https://ui.shadcn.com', desc: '组件库文档。' },
  { id: 'link-2', name: 'Lucide 图标集', url: 'https://lucide.dev', desc: '项目所使用的图标库。' },
];

// 模拟公共API数据
export const mockPublicApis: PublicApi[] = [
  { id: 'api-1', name: 'Stripe API', endpoint: 'https://api.stripe.com', status: '生效中' },
  { id: 'api-2', name: 'Google Maps API', endpoint: 'https://maps.googleapis.com', status: '生效中' },
  { id: 'api-3', name: '内部用户数据API', endpoint: '/api/internal/users', status: '已禁用' },
];

// 模拟数据服务函数
export const mockDataService = {
  // 用户相关
  getUsers: async (): Promise<User[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockUsers];
  },

  getUserById: async (userId: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.find(user => user.id === userId) || null;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
    }
  },

  // 需求相关
  getDemands: async (): Promise<Demand[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockDemands];
  },

  addDemand: async (demandData: Omit<Demand, 'id' | 'created' | 'status'>): Promise<Demand> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDemand: Demand = {
      ...demandData,
      id: `demand-${Date.now()}`,
      status: '开放中',
      created: new Date().toISOString().split('T')[0],
    };
    mockDemands.unshift(newDemand);
    return newDemand;
  },

  deleteDemand: async (demandId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const demandIndex = mockDemands.findIndex(demand => demand.id === demandId);
    if (demandIndex !== -1) {
      mockDemands.splice(demandIndex, 1);
    }
  },

  // 知识库相关
  getKnowledgeEntries: async (): Promise<KnowledgeEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockKnowledgeEntries];
  },

  addKnowledgeEntry: async (entryData: Omit<KnowledgeEntry, 'id' | 'created'>): Promise<KnowledgeEntry> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEntry: KnowledgeEntry = {
      ...entryData,
      id: `knowledge-${Date.now()}`,
      created: new Date().toISOString().split('T')[0],
    };
    mockKnowledgeEntries.unshift(newEntry);
    return newEntry;
  },

  // 公共资源相关
  getLinks: async (): Promise<PublicLink[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPublicLinks];
  },

  addLink: async (linkData: Omit<PublicLink, 'id'>): Promise<PublicLink> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newLink: PublicLink = {
      ...linkData,
      id: `link-${Date.now()}`,
    };
    mockPublicLinks.push(newLink);
    return newLink;
  },

  getApis: async (): Promise<PublicApi[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPublicApis];
  },

  addApi: async (apiData: Omit<PublicApi, 'id'>): Promise<PublicApi> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newApi: PublicApi = {
      ...apiData,
      id: `api-${Date.now()}`,
    };
    mockPublicApis.push(newApi);
    return newApi;
  },
};
