import './style.css';
import { Container } from 'typedi';
import template from './template.html?raw';
import { Commands, InjectionTokens, Timing } from '../../consts';
import { promisifiedSetTimeout } from '../../utils';

export class ExtensionContainer {
    static create() {
        const hitsquadRunner = Container.get(InjectionTokens.HITSQUAD_RUNNER);
        const twitchChatService = Container.get(InjectionTokens.CHAT_SERVICE);
        const streamStatusService = Container.get(InjectionTokens.STREAM_STATUS_SERVICE);
        const settingsService = Container.get(InjectionTokens.SETTINGS_SERVICE);

        return new ExtensionContainer({
            hitsquadRunner, streamStatusService, twitchChatService, settingsService
        });
    }

    #el;
    #streamStatusService;
    #twitchChatService;
    #hitsquadRunner;
    #settingsService;

    constructor({
        streamStatusService, twitchChatService, hitsquadRunner, settingsService
    }) {
        this.#el = this.#createElement();
        this.#streamStatusService = streamStatusService;
        this.#twitchChatService = twitchChatService;
        this.#hitsquadRunner = hitsquadRunner;
        this.#settingsService = settingsService;

        this.#listenEvents();
        this.#renderChecksResult();
        this.#toggleStatusClass();
    }

    #listenEvents() {
        const toggleGamesEl = this.el.querySelector('[data-toggle-games]');
        const isHitsquadRunning = this.#settingsService.getSetting('hitsquadRunner');

        toggleGamesEl.checked = isHitsquadRunning;

        if (isHitsquadRunning) {
            this.#hitsquadRunner.start();
        }

        toggleGamesEl.addEventListener('change', ({ target }) => {
            target.checked ? this.#hitsquadRunner.start() : this.#hitsquadRunner.stop();
            this.#settingsService.setSetting('hitsquadRunner', target.checked);
        });

        this.#streamStatusService.events.on('check', async () => {
            if (this.#streamStatusService.lastCheckData.isReload) {
                this.#toggleStatusClass();
                await promisifiedSetTimeout(Timing.MINUTE);
                return window.location.reload();
            }

            this.#renderChecksResult();
            this.#toggleStatusClass();
        });

        const sendHitsquadButton = this.#el.querySelector('[data-hitsquad]');

        sendHitsquadButton.addEventListener('click', () => {
            this.#twitchChatService.sendMessage(Commands.HITSQUAD);
        });
    }

    get el() {
        return this.#el;
    }

    mount(rootEl) {
        rootEl.appendChild(this.el);
    }

    #toggleStatusClass() {
        const { lastCheckData } = this.#streamStatusService;

        if (lastCheckData.isReload) {
            return this.el.classList.add('haf-extension-container--reload');
        }

        this.el.classList.toggle('haf-extension-container--ban-phase', lastCheckData.isBan);
        this.el.classList.toggle('haf-extension-container--no-ban-phase', !lastCheckData.isBan);
    }

    #createElement() {
        const containerEl = document.createElement('div');
        containerEl.innerHTML = template;

        return containerEl.firstChild;
    }

    #renderChecksResult() {
        const successfulChecksEl = this.el.querySelector('[data-successful-checks]');
        const totalChecksEl = this.el.querySelector('[data-total-checks]');

        const { successfulChecks, totalChecks } = this.#streamStatusService.lastCheckData;

        successfulChecksEl.textContent = successfulChecks;
        totalChecksEl.textContent = totalChecks;
    }
}
