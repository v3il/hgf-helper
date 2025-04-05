const BASE_URL = process.env.FUNCTIONS_EMULATOR
    ? 'http://localhost:5001/hgf-helper/us-central1/twitchAuth'
    : 'https://twitchauth-hyzmjwwhoq-uc.a.run.app';

export const AUTH_REDIRECT_URI = `${BASE_URL}/auth/callback`;
export const AUTH_SUCCESS_URL = `${BASE_URL}/auth/success`;
