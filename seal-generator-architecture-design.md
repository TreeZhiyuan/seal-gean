# Seal Generator 新项目架构与详细设计

> 基于 `TreeZhiyuan/seal` 的核心印章 Canvas 算法，重新开发一个现代化 React 前端项目。
>
> 原项目：https://github.com/TreeZhiyuan/seal 本地目录：F:\github_repos\seal
>
> 目标：Node.js 24.19.0 + React + TypeScript + Vite + pnpm + GitHub Actions + GitHub Pages。
>
> 本文档用于后续交给 Codex 按阶段实施，要求先阅读本文档，再修改代码；不要无依据扩大技术栈或重写印章算法。

---

## 1. 项目目标

创建一个全新的、独立于原 `seal` Monorepo 的前端项目，实现：

1. 复用原项目成熟的 Canvas 印章生成核心逻辑。
2. 使用现代 React + TypeScript 重新开发演示/生成页面。
3. 使用 Vite 作为构建工具，不再依赖 Dumi/Umi/Lerna。
4. 使用 Node.js `24.19.0`。
5. 使用 pnpm 管理依赖。
6. 支持 React Router 路由。
7. 支持页面按钮点击后调用一次外部 Open API。
8. API 请求与 UI、印章生成核心解耦。
9. 印章生成完全在浏览器 Canvas 中完成，不依赖后端。
10. 支持 PNG 下载。
11. 支持 GitHub Actions 自动构建并部署到 GitHub Pages。
12. 后续可以接入 Cloudflare 自定义域名。
13. 架构简单，方便 Codex/其他 AI 工具继续开发。

---

# 2. 原项目分析

原项目当前采用 Monorepo，核心包和 React 包位于：

```text
packages/
├── core/
└── react/
```

其中 `packages/core/src/index.ts` 的 `Seal` 类直接创建 HTML Canvas、绘制边框、五角星、环绕文字、中心文字和序列号，并提供 `update()`、`destroy()`、`toBase64()` 等能力。

原项目的核心入口：

```text
packages/core/src/index.ts
packages/core/src/types.ts
packages/core/src/config.ts
packages/core/src/utils.ts
```

原项目 React 封装位于：

```text
packages/react/
```

原项目演示网站使用 Dumi，`.umirc.ts` 中明确配置：

```ts
resolve: {
  includes: [
    'docs',
    'packages/core/docs',
    'packages/react/docs'
  ]
}
```

因此原项目是：

```text
Dumi/Umi
   ↓
docs
   ↓
React/组件演示
   ↓
packages/core/src
   ↓
Canvas
```

新项目不再复制 Dumi 文档体系，而是重新建立独立 React 页面。

---

# 3. 原项目核心能力

原项目 `Options` 支持：

```ts
type: 'company' | 'personal'

shape: 'circle' | 'square' | 'ellipse'

color?: string

showTransparent?: boolean

width?: number
height?: number

fiveStar?: FiveStar

text?: TextOptions

serNo?: TextOptions

subText?: TextOptions

centerText?: TextOptions

border?: BorderOptions

innerBorder?: BorderOptions

innerLoopLine?: BorderOptions
```

文本支持：

```ts
visible
color
fontSize
fontWeight
text
distance
radius
startDegree
```

环绕文本支持：

```ts
position: 'top' | 'bottom'
```

默认配置包括：

```text
canvas: 300 x 300
type: company
shape: circle
color: red
transparent: true

border:
  visible: true
  width: 6
  radius: 140

innerBorder:
  visible: true
  width: 1
  radius: 130

innerLoopLine:
  visible: false
  width: 2
  radius: 80

fiveStar:
  visible: true
  size: 30

text:
  visible: true
  fontSize: 30
  fontWeight: 600
  radius: 120
  startDegree: 25

subText:
  visible: true
  fontSize: 24
  fontWeight: 600
  distance: 75

centerText:
  visible: false
  fontSize: 24
  fontWeight: 600

serNo:
  visible: true
  fontSize: 18
  fontWeight: 600
  radius: 120
  text: 01234566667890
  startDegree: 45
```

新项目第一阶段应保持这些参数和绘制效果兼容。

---

# 4. 技术栈

## 4.1 固定技术

```text
Node.js     24.19.0
React       19.x
React DOM   19.x
TypeScript  5.x
Vite        7.x
pnpm        10.x
React Router 7.x
```

具体小版本优先采用项目初始化时稳定版本，不要为了追求最新版引入不必要风险。

## 4.2 不使用

新项目第一阶段不要引入：

```text
Dumi
Umi
Webpack
Lerna
Ant Design
Redux
MobX
Zustand
Axios
```

除非后续需求明确要求。

优先使用：

```text
React useState/useEffect/useMemo/useRef
Fetch API
HTML
CSS
Canvas API
```

---

# 5. 总体架构

```text
                    React Application
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Router          API        Seal Engine
              │            │            │
              ▼            ▼            ▼
            Pages      Open API       Canvas
              │
              ▼
         UI Components
```

三大核心模块必须保持解耦：

### Router

负责：

- 页面路由
- 页面切换
- 路由监听

### API

负责：

- 外部 Open API
- HTTP 请求
- 错误处理
- 超时处理
- 请求状态

### Seal Engine

负责：

- Canvas
- 印章绘制
- 配置解析
- PNG/Base64

Seal Engine 不允许依赖 React。

---

# 6. 推荐项目目录

```text
seal-generator/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── client.ts
│   │   ├── openApi.ts
│   │   └── types.ts
│   │
│   ├── components/
│   │   ├── SealCanvas/
│   │   │   ├── SealCanvas.tsx
│   │   │   └── SealCanvas.css
│   │   │
│   │   ├── SealForm/
│   │   │   ├── SealForm.tsx
│   │   │   └── SealForm.css
│   │   │
│   │   ├── Preview/
│   │   │   ├── Preview.tsx
│   │   │   └── Preview.css
│   │   │
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Generator.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
│   │
│   ├── router/
│   │   └── index.tsx
│   │
│   ├── seal/
│   │   ├── Seal.ts
│   │   ├── types.ts
│   │   ├── config.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useSeal.ts
│   │   └── useRouteListener.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.development
├── .env.production
├── .nvmrc
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

---

# 7. Seal Engine 详细设计

## 7.1 原则

`src/seal/` 是整个项目最重要的独立模块。

要求：

```text
Seal Engine
    ↓
只依赖浏览器 Canvas API
    ↓
不依赖 React
    ↓
不依赖 Router
    ↓
不依赖 API
```

这样未来可以单独迁移到：

- Vue
- 原生 JS
- Electron
- 其他前端项目

---

## 7.2 Seal 类

建议：

```ts
export class Seal {
  constructor(container: HTMLElement, options: Options);

  update(options: Options): void;

  render(): void;

  destroy(): void;

  toBase64(download?: boolean): string | undefined;
}
```

第一阶段尽量保持原项目 API 兼容。

---

## 7.3 React 封装

`SealCanvas.tsx` 负责把：

```text
React
  ↓
DOM container
  ↓
new Seal()
  ↓
Canvas
```

连接起来。

伪代码：

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const sealRef = useRef<Seal>();

useEffect(() => {
  if (!containerRef.current) return;

  sealRef.current = new Seal(
    containerRef.current,
    options
  );

  return () => {
    sealRef.current?.destroy();
    sealRef.current = undefined;
  };
}, []);

useEffect(() => {
  sealRef.current?.update(options);
}, [options]);

return <div ref={containerRef} />;
```

注意避免因为普通 options 对象引用变化而反复创建 Seal。

---

# 8. 印章页面设计

尽量保持原项目的页面功能，核心页面：

```text
/pages/Generator.tsx
```

页面采用左右布局：

```text
┌─────────────────────────────────────────────┐
│                    Header                   │
├──────────────────────┬──────────────────────┤
│                      │                      │
│     配置面板          │       印章预览       │
│                      │                      │
│  类型                 │       Canvas        │
│  ○ 公司 ○ 个人       │                      │
│                      │                      │
│  形状                 │                      │
│  ○ 圆 ○ 方 ○ 椭圆     │                      │
│                      │                      │
│  颜色                 │                      │
│                      │                      │
│  主文字               │                      │
│  [____________]      │                      │
│                      │                      │
│  副文字               │                      │
│  [____________]      │                      │
│                      │                      │
│  编号                 │                      │
│  [____________]      │                      │
│                      │                      │
│  [生成/调用API]       │     [下载 PNG]       │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

---

# 9. 状态管理

第一阶段不引入状态管理库。

使用：

```tsx
const [options, setOptions] =
  useState<SealOptions>(defaultOptions);
```

数据流：

```text
用户修改表单
     ↓
setOptions
     ↓
Generator
     ↓
SealCanvas
     ↓
Seal.update()
     ↓
Canvas重新绘制
```

建议使用不可变更新：

```ts
setOptions(prev => ({
  ...prev,
  text: {
    ...prev.text,
    text: value
  }
}));
```

---

# 10. Open API 架构

API 单独放在：

```text
src/api/
```

推荐：

```text
api/
├── client.ts
├── openApi.ts
└── types.ts
```

## 10.1 client.ts

统一处理：

- fetch
- HTTP 状态
- JSON
- timeout
- error

示例：

```ts
export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
```

后续可以扩展 AbortController。

---

# 11. 每点击一次请求一次 API

如果需求是：

> 用户每点击一次按钮，就必须请求一次外部 Open API。

必须把请求放在事件处理函数中：

```tsx
const handleClick = async () => {
  setLoading(true);

  try {
    const result = await generateSomething({
      ...
    });

    setResult(result);
  } finally {
    setLoading(false);
  }
};
```

不要通过 `useEffect` 模拟按钮点击。

这样：

```text
第一次点击 → API #1
第二次点击 → API #2
第三次点击 → API #3
```

是否允许重复点击由业务决定。

如果不允许并发请求：

```ts
if (loading) return;
```

按钮：

```tsx
<button disabled={loading}>
  {loading ? '请求中...' : '生成'}
</button>
```

如果明确要求每次点击都必须产生一次请求，则不要做请求缓存。

---

# 12. Open API 环境变量

使用：

```text
.env.development
.env.production
```

例如：

```env
VITE_OPEN_API_URL=https://api.example.com
```

代码：

```ts
const API_BASE_URL =
  import.meta.env.VITE_OPEN_API_URL;
```

注意：

任何 `VITE_*` 环境变量都会进入前端构建产物。

因此绝对不能把：

```text
API Secret
Private Key
数据库密码
```

放入 `VITE_*`。

---

# 13. Open API 安全架构

如果 Open API 完全公开：

```text
React
  ↓
Open API
```

可以直接 fetch。

如果需要：

```text
API Key
Secret
签名
内部 Token
```

必须改成：

```text
React
  ↓
Cloudflare Worker / 后端
  ↓
Open API
```

推荐：

```text
GitHub Pages
      ↓
Cloudflare Worker
      ↓
External Open API
```

这样 Secret 留在 Worker。

---

# 14. 路由设计

第一阶段：

```text
/
  Home

/generator
  Generator

/about
  About

/*
  NotFound
```

使用：

```text
react-router-dom
```

推荐 BrowserRouter。

---

# 15. 路由监听

如果需要全局监听：

```tsx
const location = useLocation();

useEffect(() => {
  console.log(
    'route:',
    location.pathname
  );
}, [location.pathname]);
```

建议封装：

```text
src/hooks/useRouteListener.ts
```

但不要为了简单的页面加载请求而建立复杂的全局路由事件系统。

如果只是：

> 进入 Generator 页面请求一次 API

直接：

```tsx
useEffect(() => {
  loadData();
}, []);
```

更合理。

---

# 16. GitHub Pages 路由注意事项

GitHub Pages 是静态托管。

如果使用：

```text
BrowserRouter
```

访问：

```text
/generator
```

刷新页面可能出现 404。

第一阶段有两个方案：

### 推荐方案 A

使用 HashRouter：

```text
/#/
/#/generator
/#/about
```

部署最简单。

### 方案 B

BrowserRouter + GitHub Pages SPA fallback。

需要额外处理 `404.html` 和路径恢复。

如果目标是尽快稳定部署，优先：

```text
HashRouter
```

如果后续绑定自定义域名并希望 URL 更漂亮，再考虑 BrowserRouter + fallback。

---

# 17. Vite base

如果 GitHub Pages 地址：

```text
https://username.github.io/seal-generator/
```

则：

```ts
export default defineConfig({
  base: '/seal-generator/',
});
```

如果使用自定义域名：

```text
https://seal.example.com/
```

则：

```ts
base: '/'
```

建议通过环境变量控制：

```ts
base: process.env...
```

或者根据部署方式明确配置。

---

# 18. GitHub Actions

目录：

```text
.github/workflows/deploy.yml
```

目标：

```text
push main
   ↓
checkout
   ↓
setup pnpm
   ↓
setup Node 24.19.0
   ↓
pnpm install --frozen-lockfile
   ↓
pnpm build
   ↓
upload dist
   ↓
deploy GitHub Pages
```

建议 workflow：

```yaml
name: Deploy

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 24.19.0
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages

    runs-on: ubuntu-latest

    needs: build

    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

GitHub 仓库需要在：

```text
Settings
→ Pages
→ Source
→ GitHub Actions
```

选择 GitHub Actions。

---

# 19. Node.js 版本

根目录：

```text
.nvmrc
```

内容：

```text
24.19.0
```

`package.json`：

```json
{
  "engines": {
    "node": "24.19.0"
  },
  "packageManager": "pnpm@10"
}
```

CI：

```yaml
node-version: 24.19.0
```

三处保持一致。

---

# 20. package.json 初始设计

建议：

```json
{
  "name": "seal-generator",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": "24.19.0"
  },
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^7"
  }
}
```

具体依赖小版本由项目初始化时确定，不要在设计阶段虚构不存在的版本。

---

# 21. 组件边界

## SealCanvas

职责：

- 创建/销毁 Seal
- 接收 Options
- 调用 update
- 暴露下载能力

不负责：

- 表单
- API
- Router

## SealForm

职责：

- 展示配置
- 修改 options

不负责：

- Canvas
- API

## Generator

职责：

- 页面级状态
- 组合 Form + Canvas
- 处理生成按钮
- 处理 API 调用

## API

职责：

- Open API

## Seal Engine

职责：

- Canvas 绘制

---

# 22. 建议的组件通信

```text
Generator
   │
   ├── options
   │      ↓
   │   SealForm
   │
   └── options
          ↓
      SealCanvas
```

不要：

```text
SealForm → SealCanvas
```

组件之间尽量通过父组件状态通信。

---

# 23. API 请求与 Seal 生成关系

两者不要强绑定。

例如：

```text
用户点击“调用API”
        ↓
Open API
        ↓
返回数据
        ↓
React 更新 options
        ↓
SealCanvas
        ↓
Seal.update()
        ↓
Canvas
```

这样 Open API 可以返回：

```json
{
  "name": "ABC有限公司",
  "code": "123456"
}
```

React 再转换为：

```ts
{
  text: {
    text: "ABC有限公司"
  },
  serNo: {
    text: "123456"
  }
}
```

最终交给 Seal。

---

# 24. 下载设计

原项目已经提供：

```ts
seal.toBase64(true)
```

新项目继续支持：

```text
下载 PNG
```

推荐 UI：

```tsx
const handleDownload = () => {
  sealRef.current?.toBase64(true);
};
```

如果需要进一步增强：

```text
下载 PNG
复制 Base64
预览 Base64
```

可以后续扩展。

---

# 25. 第一阶段 MVP

Codex 第一阶段只实现：

```text
[ ] Vite + React + TypeScript
[ ] Node 24.19.0
[ ] pnpm
[ ] React Router
[ ] Seal Engine
[ ] SealCanvas
[ ] SealForm
[ ] Generator 页面
[ ] 实时 Canvas 预览
[ ] PNG 下载
[ ] GitHub Actions
[ ] GitHub Pages
```

完成标准：

```bash
pnpm install
pnpm dev
```

能启动。

```bash
pnpm build
```

能构建。

```bash
pnpm preview
```

能预览。

push `main` 后：

```text
GitHub Actions
      ↓
build success
      ↓
GitHub Pages
```

能访问网站。

---

# 26. 第二阶段

在 MVP 稳定后增加：

```text
[ ] Open API
[ ] API loading
[ ] API error
[ ] API timeout
[ ] 每次按钮点击独立请求
[ ] API 返回数据映射到 SealOptions
[ ] 路由监听
[ ] 页面访问统计（如有需求）
```

---

# 27. 第三阶段

可选：

```text
[ ] 本地保存配置
[ ] LocalStorage
[ ] 分享链接
[ ] URL 参数恢复配置
[ ] 多种印章模板
[ ] 历史记录
[ ] 自定义字体
[ ] 图片尺寸调整
[ ] PNG/JPG/SVG
```

SVG 不应在第一阶段实现，因为当前原算法基于 Canvas。

---

# 28. Codex 开发约束

给 Codex 的核心规则：

## 必须

1. 先阅读本设计文档。
2. 先检查项目实际目录和依赖，再修改。
3. 印章绘制算法以原项目 `packages/core/src` 为基础。
4. 保持 Seal Engine 与 React 解耦。
5. API 与 Seal Engine 解耦。
6. 使用 TypeScript。
7. 使用 Node.js 24.19.0。
8. 使用 pnpm。
9. 保持 GitHub Actions 可构建。
10. 每完成一个阶段运行 lint/build。

## 禁止

1. 不要重新发明印章绘制算法。
2. 不要把 Dumi/Umi/Lerna 搬进新项目。
3. 不要把 API Secret 写入 React。
4. 不要为了简单请求引入 Axios。
5. 不要第一阶段引入 Redux。
6. 不要修改 Seal 核心算法，除非发现明确 Bug。
7. 不要一次性引入大量 UI 框架。
8. 不要删除已有功能来解决 TypeScript 错误。
9. 不要把 API 请求直接散落在多个组件中。
10. 不要让 Seal Engine 依赖 React。

---

# 29. Codex 推荐实施顺序

### Step 1

创建 Vite React TypeScript 项目：

```text
Node 24.19.0
pnpm
React
TypeScript
Vite
```

### Step 2

建立目录结构。

### Step 3

迁移：

```text
packages/core/src/types.ts
packages/core/src/config.ts
packages/core/src/utils.ts
packages/core/src/index.ts
```

到：

```text
src/seal/
```

### Step 4

编写：

```text
SealCanvas.tsx
```

验证 Canvas 能正常显示。

### Step 5

编写：

```text
SealForm.tsx
```

实现 Options 编辑。

### Step 6

实现：

```text
Generator.tsx
```

组合表单和 Canvas。

### Step 7

实现 PNG 下载。

### Step 8

加入 React Router。

### Step 9

加入 API Layer。

### Step 10

实现：

```text
按钮点击
  ↓
API 请求
  ↓
返回数据
  ↓
更新 options
  ↓
Canvas 更新
```

### Step 11

加入 GitHub Actions。

### Step 12

部署 GitHub Pages。

### Step 13

最后再考虑 Cloudflare 自定义域名。

---

# 30. 验收标准

## 功能

- [ ] 页面能够生成公司印章
- [ ] 页面能够生成个人印章
- [ ] 可以修改颜色
- [ ] 可以修改主文字
- [ ] 可以修改副文字
- [ ] 可以修改编号
- [ ] 可以显示/隐藏五角星
- [ ] 可以显示/隐藏边框
- [ ] 可以显示/隐藏中心文字
- [ ] Canvas 实时更新
- [ ] PNG 可以下载
- [ ] API 点击一次请求一次
- [ ] API loading 正常
- [ ] API error 正常
- [ ] 路由可以正常切换
- [ ] GitHub Pages 可以访问

## 工程

- [ ] Node 24.19.0
- [ ] pnpm install 成功
- [ ] pnpm build 成功
- [ ] pnpm lint 成功
- [ ] GitHub Actions 成功
- [ ] GitHub Pages 成功
- [ ] 无 Dumi
- [ ] 无 Umi
- [ ] 无 Lerna
- [ ] Seal Engine 不依赖 React
- [ ] API 不包含 Secret

---

# 31. 后续 Cloudflare 部署

最终可以：

```text
GitHub
  │
  │ push
  ▼
GitHub Actions
  │
  ▼
GitHub Pages
  │
  ▼
Cloudflare DNS
  │
  ▼
seal.example.com
```

如果 API 需要隐藏 Secret：

```text
React
  │
  ▼
Cloudflare Worker
  │
  ▼
External Open API
```

这样可以同时满足：

```text
GitHub
→ 源代码 + CI/CD

GitHub Pages
→ 静态网站

Cloudflare
→ DNS/CDN/API Proxy

External Open API
→ 外部数据服务
```

---

# 32. 最终架构图

```text
                         GitHub Repository
                                │
                                │ push main
                                ▼
                        GitHub Actions
                                │
                        Node 24.19.0
                                │
                          pnpm install
                                │
                           pnpm build
                                │
                                ▼
                              dist
                                │
                                ▼
                         GitHub Pages
                                │
                                │ HTTPS
                                ▼
                           React App
                                │
          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
          ▼                     ▼                      ▼
       Router                 API Layer            Seal Engine
          │                     │                      │
          ▼                     ▼                      ▼
        Pages              Open API               Canvas
          │                                            │
          ▼                                            ▼
     Components                                    PNG
          │
          └─────────────── options ───────────────────┘
```

---

# 33. 第一阶段最重要的设计原则

整个项目始终保持：

```text
UI ≠ API ≠ Seal Engine ≠ Deployment
```

也就是：

```text
React
  ↓
负责 UI

API Layer
  ↓
负责网络

Seal Engine
  ↓
负责印章

Vite
  ↓
负责构建

GitHub Actions
  ↓
负责 CI/CD

GitHub Pages
  ↓
负责静态托管
```

这样后续任何一层都可以独立替换。

---

# 34. Codex 首条任务建议

将本文档放入新项目：

```text
docs/architecture.md
```

然后给 Codex：

```text
请先完整阅读 docs/architecture.md。

基于文档设计创建新项目，不要直接修改原 TreeZhiyuan/seal 项目。

第一阶段只完成 MVP：

1. Node.js 24.19.0
2. pnpm
3. React + TypeScript + Vite
4. React Router
5. 从 TreeZhiyuan/seal 的 packages/core/src 迁移 Seal 核心实现
6. 创建 SealCanvas
7. 创建 SealForm
8. 创建 Generator 页面
9. 实现实时 Canvas 印章预览
10. 实现 PNG 下载
11. 配置 GitHub Actions
12. 确保 pnpm build 成功

暂时不要实现 Open API。

不要引入 Dumi、Umi、Lerna、Redux、Axios 或其他非必要框架。

完成后运行：
- pnpm lint
- pnpm build

如果存在问题，先修复后再继续。
```

---

## 35. 参考源码

原项目：

https://github.com/TreeZhiyuan/seal

重点参考：

```text
packages/core/src/index.ts
packages/core/src/types.ts
packages/core/src/config.ts
packages/core/src/utils.ts
packages/react/
.umirc.ts
```

新项目只迁移核心能力，不复制原项目整体工程体系。
