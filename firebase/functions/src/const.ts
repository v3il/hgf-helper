export const REDIRECT_URI = process.env.FUNCTIONS_EMULATOR
    ? 'http://localhost:5001/hgf-helper/us-central1/twitchAuth/callback'
    : 'https://twitchauth-hyzmjwwhoq-uc.a.run.app/callback';
