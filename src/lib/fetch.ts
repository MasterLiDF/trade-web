// 封装 fetch，自动携带 token
export async function httpFetch(url: string, options: RequestInit = {}) {
  // 1. 从 localStorage 拿 token
  const token = localStorage.getItem('token');

  // 2. 自动带上请求头
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: token?`Bearer ${token}`:''
  };

  // 3. 发送请求
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 4. 处理返回数据
  const data = await response.json();

  if (response.status != 200 ) {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  }

  return data;
}