---
name: api
description: api接口规范&数据库规范
---

# 数据库规范
1. 使用 MongoDB + Mongoose 连接与操作
2. 数据模型统一放在 src/models/ 目录
3. 连接字符串使用环境变量 .env 存储

# 接口开发规范
1. 采用 Next.js App Router 后端接口，路径统一放在 src/api/ 目录下。
2. 统一使用 JSON 格式返回，格式：{ success: boolean, message: string, data?: any }。
3. 错误处理统一，状态码正确返回。