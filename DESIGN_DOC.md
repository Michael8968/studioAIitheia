
# AI 智能匹配平台 - V2.0 全栈架构设计文档

## 1. 概述 (Overview)

本文档是“AI 智能匹配平台”项目 **V2.0 全栈架构的最终版技术与功能蓝图**。其目标是提供一份极度详尽、精确到架构和数据库层面的说明，足以让任何具备相应技术栈的开发团队，能够仅凭此文档从零开始，1:1地、像素级地复现当前版本的完整项目。

这份文档不仅是产品需求（PRD）和工作范围（SOW）的集合，更是一份**可执行的全栈开发圣经**。

---

## 2. 核心设计语言与UI系统 (Core Design Language & UI System)

平台UI遵循一套统一、现代且富有亲和力的设计规范，确保在所有模块和组件中提供一致、高质量的视觉体验。

### 2.1. 色彩系统 (Color System)

色彩配置定义在 `src/app/globals.css` 文件中，通过CSS HSL变量实现，确保主题的灵活性和一致性。

| 用途 | 变量名 | HSL 值 | 十六进制 (参考) | 描述 |
| --- | --- | --- | --- | --- |
| **背景** | `--background` | `216 100% 96%` | `#EAF2FF` | 提供明亮、干净的画布 |
| **前景/文字**| `--foreground` | `224 71.4% 4.1%`| `#0A1C2C` | 主要文字颜色 |
| **卡片背景** | `--card` | `216 100% 98%` | `#F5FAFF` | 卡片组件的背景色，与主背景形成层次 |
| **主色调** | `--primary` | `212 98% 73%` | `#77B5FE` | 用于关键操作、活动状态和高亮元素 |
| **强调色** | `--accent` | `275 43% 77%` | `#BBA0D7` | 用于AI相关或需要特别突出的功能区域 |
| **边框** | `--border` | `215.3 25% 86.5%`| `#D5DDE6` | 组件的边框颜色 |
| **输入框** | `--input` | `215.3 25% 86.5%`| `#D5DDE6` | 输入框的边框颜色 |

### 2.2. 字体排版 (Typography)

字体配置定义在 `tailwind.config.ts` 和 `src/app/layout.tsx` 中。

*   **标题字体 (Headline)**: `Space Grotesk` (通过 `font-headline` class 调用) - 用于所有页面标题、卡片标题，赋予平台独特的品牌个性。
*   **正文字体 (Body)**: `Inter` (通过 `font-body` class 调用) - 用于所有段落、描述和UI控件，确保高度的可读性。

### 2.3. 组件风格 (Component Style)

*   **圆角**: 全局应用 `0.5rem` (`--radius`) 的圆角，定义在 `tailwind.config.ts` 中，营造现代柔和的视觉感受。
*   **阴影**: 广泛使用 `shadow-sm` 和 `shadow-lg` 创建深度和层次感，特别是在卡片和弹窗上。
*   **间距**: 严格遵循 Tailwind CSS 的标准间距单位 (`p-4`, `space-y-6` 等)，确保布局的和谐与平衡。

---

## 3. 全栈技术架构 (Full-Stack Tech Architecture)

项目采用现代化的三层架构，实现了前后端分离和数据持久化。

*   **前端 (Frontend)**: [Next.js 15.3.3](https://nextjs.org/) (采用 App Router), [React 18.3.1](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [ShadCN/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **后端 (Backend)**: [Genkit](https://firebase.google.com/docs/genkit) (用于AI流程), **模拟后端服务层** (`src/store/*.ts` files) (用于业务逻辑和数据库交互)。
*   **数据库 (Database)**: **Cloud Firestore** (NoSQL 文档数据库)。
*   **状态管理 (State Management)**:
    *   **客户端状态**: [Zustand](https://zustand-demo.pmnd.rs/) - 用于管理全局UI状态，如认证信息 (`useAuthStore`)。
    *   **服务端缓存与数据获取**: **React Server Components (RSC)** 与异步函数调用，结合 `useEffect` 在客户端组件中获取数据。

### 3.1. 项目结构 (Project Structure)

```
/
├── src/
│   ├── app/                 # Next.js App Router 路由
│   │   ├── (page-routes)/   # 各个页面的路由文件夹
│   │   │   └── page.tsx     # 页面组件 (大部分为 'use client' 组件)
│   │   ├── globals.css      # 全局样式与CSS变量
│   │   └── layout.tsx       # 根布局
│   ├── ai/
│   │   ├── flows/           # Genkit AI 流程定义 ('use server')
│   │   └── genkit.ts        # Genkit 全局配置
│   ├── components/
│   │   ├── features/        # 特定业务功能的大型组件
│   │   └── ui/              # ShadCN/UI基础组件
│   ├── hooks/               # 自定义Hooks (e.g., useToast)
│   ├── lib/                 # 工具函数 (e.g., cn, firebase.ts)
│   └── store/               # 数据服务层 (与Firestore交互)
│       ├── auth.ts          # 用户数据获取与管理
│       └── demands.ts       # 需求数据获取与管理
├── public/                  # 静态资源
├── DESIGN_DOC.md            # 本文档
└── package.json             # 项目依赖与脚本
```

---

## 4. 数据库设计 (Database Design - Firestore)

项目核心数据存储在Cloud Firestore中，主要包含两个顶级集合：`users` 和 `demands`。

### 4.1. `users` 集合

存储所有平台参与者的信息，包括管理员、供应商、创意者和普通用户。

**文档ID**: `userId` (自动生成或使用 Firebase Auth UID)

| 字段名 | 数据类型 | 描述 | 示例 |
|---|---|---|---|
| `name` | `string` | 用户或公司的法定名称。 | "李明", "创新科技" |
| `email` | `string` | 用户的联系邮箱，用于登录和通知。 | "li.ming@example.com" |
| `role` | `string` | 用户角色: 'admin', 'supplier', 'creator', 'user'。 | "admin" |
| `specialty`| `string` | (可选) 供应商或创意者的专长领域。 | "高精度3D打印" |
| `description`| `string` | (可选) 个人或公司的详细简介。 | "10年以上角色设计经验..." |
| `tags`| `array<string>` | (可选) 描述技能或业务范围的标签。 | `['3D角色', '科幻']` |
| `rating` | `number` | (可选) 用户的平均评分 (1-5)。 | `4.9` |
| `online` | `boolean` | (可选) 用户当前是否在线。 | `true` |
| `status` | `string` | 用户状态: '正常', '已暂停', '黑名单'。 | "正常" |

### 4.2. `demands` 集合

存储所有由用户发布的需求信息。

**文档ID**: `demandId` (自动生成)

| 字段名 | 数据类型 | 描述 | 示例 |
|---|---|---|---|
| `title` | `string` | 需求的简明标题。 | "为新的咖啡品牌设计一个定制logo" |
| `description`| `string` | 需求的详细描述。 | "我们需要一个现代、简约的logo..." |
| `budget` | `string` | 项目的预算范围。 | "¥3,500 - ¥7,000" |
| `category` | `string` | 需求所属的类别。 | "平面设计" |
| `status` | `string` | 需求当前状态: '开放中', '洽谈中', '已完成', '已关闭'。 | "开放中" |
| `created` | `Timestamp` | **[重要]** 需求创建的Firestore时间戳。 | `Timestamp(seconds=1690848000, nanoseconds=0)` |
| `authorId` | `string` | **[关联字段]** 发布该需求的用户ID，关联到`users`集合。 | "userId123" |

### 4.3. 关联关系 (Relationships)

*   **`demands` -> `users` (多对一)**: 一个用户可以发布多个需求，但一个需求只有一个发布者。通过 `demands.authorId` 字段与 `users` 集合的文档ID建立关联。在需要显示需求发布者信息时，可以通过 `authorId` 查询 `users` 集合。

---

## 5. 核心逻辑与数据流 (Core Logic & Data Flow)

### 5.1. 数据获取 (Read)

*   前端客户端组件 (Client Components with `'use client'`) 使用 `useEffect` 钩子在组件挂载时，调用 `src/store/` 目录下的数据服务函数 (如 `getUsers()`, `getDemands()`)。
*   这些服务函数 (`getUsers`, `getDemands`) 内部封装了对 **Firestore SDK** 的调用，以从数据库中异步获取真实数据。
*   加载状态 (`isLoading`) 被广泛用于在数据返回前显示骨架屏或加载指示器，提升用户体验。所有数据获取操作都应被 `try...catch` 块包裹，以处理潜在的后端错误，并通过 `toast` 组件向用户提供反馈。

### 5.2. 数据修改 (Write/Update/Delete)

*   **用户操作**: 用户在UI上执行操作（如发布新需求、保存配置、删除用户）。
*   **调用服务函数**: 前端组件调用相应的数据服务函数 (如 `addDemand(...)`, `updateUser(...)`, `deleteDemand(...)`)。
*   **后端处理**: 这些服务函数内部使用 **Firestore SDK** (如 `addDoc`, `updateDoc`, `deleteDoc`) 与数据库进行交互，执行业务逻辑。
*   **状态更新与反馈**: 函数成功返回后，前端组件会更新其本地状态（如从列表中移除已删除的项），以即时反映UI的变化。同时，使用 `toast` 组件向用户确认操作成功或失败。

---

## 6. AI 流程定义 (`src/ai/flows/`)

AI流程是项目智能化的核心，全部使用`genkit`定义，并严格遵循服务端执行模式。

1.  **`'use server';`**: 确保代码仅在服务端运行，保护API密钥和业务逻辑。
2.  **Zod Schemas**: 为输入和输出定义严格的`z.object`模式，确保类型安全和数据结构的可靠性。
3.  **`ai.definePrompt`**: 定义核心的提示词模板，使用 `Handlebars` 语法 (`{{{...}}}`) 注入动态数据。
4.  **`ai.defineFlow`**: 将 prompt 包装成一个可执行的流程。
5.  **Exported Wrapper Function**: 导出一个简单的异步函数作为客户端调用的入口。

---

**文档结论:**

这份V2.0文档详细记录了“AI智能匹配平台”从一个前端原型到全栈应用的架构演进。它清晰地定义了前后端职责、数据库结构和核心数据流，为项目的下一步开发、部署和维护提供了坚实可靠的技术蓝图。
