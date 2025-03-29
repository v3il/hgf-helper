export const isDev = import.meta.env.MODE === 'development';

export const FUNCTION_DOMAIN = isDev
    ? 'http://localhost:5001'
    : 'https://twitchauth-hyzmjwwhoq-uc.a.run.app';

export const FUNCTION_URL = isDev
    ? `${FUNCTION_DOMAIN}/hgf-helper/us-central1/twitchAuth`
    : FUNCTION_DOMAIN;
