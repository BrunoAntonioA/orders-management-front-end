function createSupabaseProxy(path) {
  return {
    target: 'https://ykomkgilkbfhrdfltxbk.supabase.co',
    secure: true,
    changeOrigin: true,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq, req) => {
        proxyReq.removeHeader('sec-fetch-mode');
        proxyReq.removeHeader('sec-fetch-site');
        proxyReq.removeHeader('sec-fetch-dest');
        proxyReq.removeHeader('sec-fetch-user');
        proxyReq.setHeader('User-Agent', 'orders-management-local-dev');

        const clientAuth = req.headers['authorization'];
        if (typeof clientAuth === 'string' && clientAuth.startsWith('Bearer eyJ')) {
          proxyReq.setHeader('Authorization', clientAuth);
        } else {
          proxyReq.setHeader('Authorization', `Bearer ${SUPABASE_KEY}`);
        }
      });
    },
  };
}

module.exports = {
  '/rest/v1': createSupabaseProxy('/rest/v1'),
  '/auth/v1': createSupabaseProxy('/auth/v1'),
};
