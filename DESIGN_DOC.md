# AI 智能匹配平台 - V1.0 最终版技术规格与功能说明书

## 1. 概述 (Overview)

本文档是“AI 智能匹配平台”项目的 **最终版技术与功能蓝图**。其目标是提供一份极度详尽、精确到代码实现层面的说明，足以让任何具备相应技术栈（Next.js, React, TypeScript, Tailwind CSS, Genkit）的开发团队，能够仅凭此文档从零开始，1:1地、像素级地复现当前版本的完整项目。

这份文档不仅是产品需求（PRD）和工作范围（SOW）的集合，更是一份**可执行的开发圣经**。

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

## 3. 技术栈与项目架构 (Tech Stack & Architecture)

*   **框架**: [Next.js 15.3.3](https://nextjs.org/) (采用 App Router)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **UI库**: [React 18.3.1](https://reactjs.org/)
*   **UI组件**: [ShadCN/UI](https://ui.shadcn.com/) - 完全集成的组件库，位于 `src/components/ui`。
*   **样式**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI集成**: [Genkit](https://firebase.google.com/docs/genkit) (通过 `@genkit-ai/googleai` 插件)
*   **全局状态管理**: [Zustand](https://zustand-demo.pmnd.rs/) - 用于管理认证状态 (`useAuthStore`)。

### 3.1. 项目结构 (Project Structure)

```
/
├── src/
│   ├── app/                 # Next.js App Router 路由
│   │   ├── (page-routes)/   # 各个页面的路由文件夹
│   │   │   └── page.tsx     # 页面组件
│   │   ├── globals.css      # 全局样式与CSS变量
│   │   └── layout.tsx       # 根布局
│   ├── ai/
│   │   ├── flows/           # Genkit AI 流程定义
│   │   └── genkit.ts        # Genkit 全局配置
│   ├── components/
│   │   ├── features/        # 特定业务功能的大型组件
│   │   └── ui/              # ShadCN/UI基础组件
│   ├── hooks/               # 自定义Hooks (e.g., useToast)
│   ├── lib/                 # 工具函数 (e.g., cn)
│   └── store/               # Zustand 全局状态存储
├── public/                  # 静态资源 (此项目为空)
├── DESIGN_DOC.md            # 本文档
└── package.json             # 项目依赖与脚本
```

### 3.2. 路由与文件重构历史

为提供清晰的项目演进上下文，以下是关键的重构记录：

*   `/demands` 路由已重构为 `/demand-pool`。
*   `/permission-management` 路由已重构为 `/permissions`。
*   `/supplier-onboarding` 路由已重构为 `/suppliers`。
*   `/shopping-assistant` 页面已移动到根路由 `/`。
*   `app-shell.tsx` 组件已重命名为 `app-layout.tsx`。

---

## 4. 全局功能与核心逻辑 (Global Features & Core Logic)

### 4.1. 认证与角色 (`src/store/auth.ts`)

*   **实现**: 使用 Zustand 的 `persist` 中间件，将认证状态（角色和用户信息）存储在 `localStorage` 中。
*   **角色 (Roles)**: `'admin'`, `'supplier'`, `'user'`, `'creator'`。
*   **数据**: `allMockUsers` 对象模拟了一个用户数据库。
*   **逻辑**:
    *   `login(userId, role)`: 根据传入的 `userId` 和 `role` 设置全局状态。
    *   `logout()`: 清空状态，实现登出。

### 4.2. 应用布局与路由守卫 (`src/components/app-layout.tsx`)

*   **功能**: 作为所有页面的外壳，提供持久化的侧边栏和顶部导航。
*   **路由守卫 (Route Guard)**:
    *   使用 `useEffect` 钩子和 `usePathname`, `useRouter`。
    *   在组件挂载后 (`mounted` state aſter `useEffect`) 检查 `role` 是否存在。
    *   如果用户未登录 (`!role`) 且不在登录页 (`/login`)，则强制重定向到登录页。
    *   **关键修复**: 在 `useEffect` 中执行路由跳转，避免了在组件渲染期间更新路由而导致的 Next.js 错误。
*   **动态导航**: `navItemsByRole` 对象定义了不同角色可见的导航菜单，侧边栏根据当前登录用户的 `role` 动态渲染菜单项。

---

## 5. 模块化功能深度剖析 (Deep Dive into Functional Modules)

### 5.1. 登录页 (`/login/page.tsx`)

*   **UI**: 以卡片形式展示四个预设的模拟角色。每个卡片包含头像、角色名称。
*   **功能**:
    *   点击任意角色的“登录”按钮。
    *   **Action**: 调用 `useAuthStore` 的 `login(roleId, role)` 方法。
    *   **Result**: 更新全局状态，并使用 Next.js `useRouter` 跳转到应用首页 (`/`)。

### 5.2. AI购物助手 (`/page.tsx`)

*   **主组件**: `src/components/features/shopping-assistant.tsx`
*   **UI布局**:
    *   **左侧 (2/3 宽度)**: 聊天界面。
    *   **右侧 (1/3 宽度)**: “高端定制服务”功能卡片。
*   **聊天界面**:
    *   **消息状态管理**: 使用 `useState<Message[]>` 管理整个对话流。`Message` 是一个联合类型，可以是 `'user'`, `'ai'`, 或 `'loading'`。
    *   **表单处理**: 使用 `react-hook-form` 和 `zod` 进行输入验证。
    *   **图片处理**:
        *   `handleFileChange`: 监听文件输入，使用 `URL.createObjectURL` 生成本地预览。
        *   `fileToDataUri`: 在表单提交时，将 `File` 对象异步转换为 Base64编码的 Data URI，以便传递给AI流程。
    *   **提交逻辑 (`onSubmit`)**:
        1.  向 `messages` 状态中添加用户的消息和一个 `'loading'` 占位符。
        2.  **异步调用链**:
            a. `await generateUserProfile(...)`: 首先调用用户画像生成流程。
            b. `await getProductRecommendations(...)`: 将上一步的用户画像作为输入，调用商品推荐流程。
        3.  **UI更新**: 找到 `'loading'` 消息，并将其替换为包含画像和推荐结果的 `'ai'` 消息。
        4.  **错误处理**: 使用 `try...catch` 捕获API调用失败，并通过 `useToast` 显示错误信息。
    *   **示例提示按钮**:
        *   一个包含示例问题的字符串数组。
        *   使用 `.map()` 渲染成一系列 `Button` 组件。
        *   **onClick**: 调用 `form.setValue('description', promptText)`，快速填充输入框。

### 5.3. 需求池 (`/demand-pool/page.tsx`)

*   **状态管理**:
    *   `isRecDialogOpen`: 控制推荐对话框的显示/隐藏。
    *   `selectedDemand`: 存储当用户点击单行“推荐”时所选的需求对象。
    *   `selectedRows`: 存储被复选框选中的所有需求的ID数组。
*   **表格交互**:
    *   **复选框逻辑**:
        *   `handleSelectRow`: 更新 `selectedRows` 数组（添加/删除ID）。
        *   `handleSelectAll`: 根据全选框状态，设置 `selectedRows` 为所有需求的ID或空数组。
*   **批量推荐**:
    *   **按钮状态**: “批量推荐”按钮的 `disabled` 状态与 `selectedRows.length === 0` 绑定。
    *   **触发逻辑**: `handleBatchRecommendClick` 将 `selectedDemand` 设为 `null`，并打开推荐对话框。
*   **`RecommendationDialog` 组件**:
    *   **模式判断**: 通过 `selectedDemands.length > 0` 判断当前是批量模式还是单项模式，并动态更新标题。
    *   **AI推荐逻辑 (`handleAiRecommend`)**:
        1.  设置 `isLoading` 为 `true`，清空旧结果。
        2.  `await recommendCreatives(...)`: 调用AI流程，并传入第一个选中需求的数据作为分析样本。
        3.  **UI更新**:
            *   **加载中**: 显示 `Loader2` 旋转图标。
            *   **成功**: 将返回结果存入 `aiResults` 状态，并渲染推荐列表。每个推荐项都包含头像、名称、理由和默认选中的复选框。
            *   **失败**: 使用 `toast` 显示错误信息。

### 5.4. 供应商中心 (`/suppliers/page.tsx`)

*   **核心动态列表**: 使用 `useState<ProductService[]>` 管理一个产品/服务对象数组。
*   **增/删/改逻辑**:
    *   `addProduct`: 向 `products` 数组中添加一个新的、通过 `initialProductService()` 创建的默认对象。
    *   `removeProduct`: 使用 `.filter()` 方法，根据ID从 `products` 数组中移除一个对象。
    *   `updateProduct`: 使用 `.map()` 方法，找到指定ID的对象并用新对象替换它。这个函数作为 prop 传递给 `ProductServiceItem`。
*   **`ProductServiceItem` 组件 (子模块)**:
    *   接收 `product` 对象和 `onUpdate` 回调函数。
    *   内部所有输入框的 `onChange` 事件都会创建一个新的 `product` 对象副本，并调用 `onUpdate` 将其传回父组件，实现受控组件模式下的状态提升。
*   **`SupplementaryFieldsManager` (可复用组件)**:
    *   实现了与 `ProductServiceItem` 类似的状态管理逻辑（增删改），但操作的是 `SupplementaryField` 数组。
    *   在“基本信息”和每个“商品/服务”卡片中都被复用。

### 5.5. 管理模块

*   **知识库 (`/knowledge-base/page.tsx`)**:
    *   `EntryFormDialog`: 通过 `useState` 控制的表单弹窗，用于添加新条目。提交时，会创建一个新的条目对象并更新主页面的 `entries` 状态数组。
*   **公共资源库 (`/public-resources/page.tsx`)**:
    *   **Tab切换**: 使用 `useState` 跟踪 `activeTab` ('links' 或 'apis')。
    *   **导出 (`handleExport`)**:
        1.  根据 `activeTab` 确定要导出的数据集 (`mockLinks` 或 `mockApis`)。
        2.  在客户端将JS对象数组动态转换为CSV格式的字符串。
        3.  创建一个 `Blob` 对象，然后通过 `URL.createObjectURL` 生成一个临时的URL。
        4.  创建一个隐藏的 `<a>` 标签，设置其 `href` 和 `download` 属性，并以编程方式触发点击，从而启动浏览器下载。
*   **提示词管理 (`/prompts/page.tsx`)**:
    *   `PromptConfigDialog`: 同样由 `useState` 控制，`handleConfigClick` 负责设置 `selectedPrompt` 并打开对话框。`onSave` 回调函数负责更新主页面的 `prompts` 状态。
*   **权限管理 (`/permissions/page.tsx`)**:
    *   直接在客户端通过 `useState` 管理 `users` 数组。`handleRoleChange` 使用 `.map` 来更新特定用户的角色。

---

## 6. AI 流程定义 (`src/ai/flows/`)

所有AI流程都使用 `genkit` 定义，并遵循统一的模式：

1.  **`'use server';`**: 确保代码仅在服务端运行。
2.  **Zod Schemas**: 为输入和输出定义严格的 `z.object` 模式，确保类型安全和数据结构的可靠性。
3.  **`ai.definePrompt`**: 定义核心的提示词模板。
    *   使用 `Handlebars` 语法 (`{{{...}}}`) 注入输入数据。
    *   在 prompt 字符串中直接引用 `output` Zod schema，指示AI以指定的JSON格式返回数据。
4.  **`ai.defineFlow`**: 将 prompt 包装成一个流程，可以添加额外的业务逻辑。
5.  **Exported Wrapper Function**: 导出一个简单的异步函数，作为客户端调用的入口，它内部直接调用并返回 flow 的结果。

---

**文档结论:**

这份文档详细记录了“AI智能匹配平台”V1.0版本的每一个技术决策、UI实现和功能逻辑。它不仅是对当前状态的快照，更是一份动态的、可维护的、旨在指导未来所有开发工作的核心资产。

---
