// 数据库配置
export const DB_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/trade-web',
  JWT_SECRET:process.env.MONGODB_URI||'',
  PORT:3000
};

// 应用配置
export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
};
