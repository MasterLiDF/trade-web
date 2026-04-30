import mongoose from 'mongoose';
import { DB_CONFIG } from '@/config';
import { registerUser } from '@/app/api/register/route';

const { MONGODB_URI } = DB_CONFIG;

// 预定义的账号信息
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

async function registerAdmin() {
  try {
    // 连接数据库
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');

    // 调用共享的注册逻辑
    const result = await registerUser(ADMIN_USERNAME, ADMIN_PASSWORD);

    if (result.success) {
      console.log('注册成功！');
      console.log(`用户名: ${ADMIN_USERNAME}`);
      console.log(`密码: ${ADMIN_PASSWORD}`);
    } else {
      console.log(result.message);
    }

    await mongoose.disconnect();
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('注册失败:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

registerAdmin();
