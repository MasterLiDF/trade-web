# 项目需求文档：皮革行业外贸官网
## 项目概述
为皮革行业外贸企业开发响应式官方网站，支持 PC 端 + 移动端适配，提供中英文双语切换，展示企业品牌、皮革产品信息、联系方式。
## 技术栈
- 框架：Next.js (App Router)
- 语言：React + TypeScript
- 后端: Node.js + MongoDB
- 状态管理：Redux Toolkit（@reduxjs/toolkit）
- 样式：TailwindCSS
- 国际化：next-i18next（多语言）
### 目录结构
src/
├── app/            # 前端页面
|    └── admin/     # 后台管理页面
|    └── api/       # 全部 Node.js 后端代码放这里 
├── components/     # 组件
├── lib/            # 工具、数据库、认证
├── messages/       # 多语言
└── types/          # TS 类型
## 代码规范
- 组件：函数式
- 禁止：class组件、any类型
- 文件：`Page.tsx`, `Component.tsx`, `hooks/useX.ts`, `stores/`
- 接口请求：统一使用src/lib中的httpFetch
## 多语言要求
- 支持：中文 / 英文,路由：/zh,/en
- /admin/*的是后台页面,所有文案固定中文即可，不需要国际化配置。

 ## 详细文档
 - 接口设计: 见 `docs/api.md`
 - 上传图片接口设计: 见 `docs/upload-image.md`


