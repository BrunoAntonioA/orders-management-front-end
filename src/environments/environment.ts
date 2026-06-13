export const environment = {
  production: false,
  apiUrl: '/api',
  supabase: {
    url: 'https://ykomkgilkbfhrdfltxbk.supabase.co',
    /** Proxied locally via proxy.conf.js — secret key never hits the browser. */
    restUrl: '/rest/v1',
    authUrl: '/auth/v1',
    /** Optional override. Leave empty to use the first Supabase auth user. */
    ownerId: '',
  },
};
