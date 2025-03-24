import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

const twitchSecret = defineSecret("TWITCH_CLIENT_SECRET");

export const twitchAuth = onRequest({
  secrets: [twitchSecret],
}, (request, response) => {
  const secretValue = twitchSecret.value();

  response.send({data: secretValue});
});

