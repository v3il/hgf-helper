import { TwitchService } from "./TwitchService";
import { StreamService } from "./StreamService";

const containerEl = document.createElement('div');
containerEl.classList.add('haf-container');
document.body.appendChild(containerEl);

export const twitchService = new TwitchService();
export const streamService = new StreamService({ containerEl });
