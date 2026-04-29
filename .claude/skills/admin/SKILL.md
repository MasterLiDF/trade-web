---
name: admin
description: 后台管理规范
---

## 后台管理（/app/admin）规范
- 路由：/admin/*
- 风格：简约、深色/浅色管理后台风格
- 包含：登录、产品管理、基础信息管理
- 布局：侧边栏 + 顶部导航 + 内容区
- 权限：简单登录验证（无复杂权限）
- 表格：产品列表、增删改查（UI 层面）
- 表单：产品上传表单（UI 层面）

## 后台页面清单
1. /admin                后台首页（概览）
2. /admin/login          登录页
3. /admin/products        产品管理列表(列表/搜索/新增/删除/编辑)
4. /admin/products/create  创建产品
5. /admin/products/[id]    编辑产品