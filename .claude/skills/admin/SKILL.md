---
name: admin
description: 后台管理规范
---

## 后台管理（/app/admin）规范
- 路由：/admin/*
- 风格：简约/浅色管理后台风格
- 包含：登录、产品管理、
- 布局：左侧边栏 + 右侧内容区 + 顶部导航 
- 权限：简单登录验证（无复杂权限）

## 后台页面清单
1. /admin                后台首页（概览）
2. /admin/login          登录页
3. /admin/products        产品管理列表(列表/搜索/新增/删除/编辑)
4. /admin/products/create  创建产品
5. /admin/products/[id]    编辑产品

## 后台权限说明
1. 只有登录页面不需要校验权限
2. 其他/admin下的页面都需要登录