import { ChatFacade } from '@farm/modules/chat';

interface IParams {
    el: HTMLElement;
    chatFacade: ChatFacade,
}

export const useAnticheatButton = ({ el, chatFacade }: IParams) => {
    const buttonEl = el.querySelector<HTMLButtonElement>('[data-anticheat-button]')!;

    buttonEl.addEventListener('click', () => {
        chatFacade.sendMessage('!anticheat');
    });
};
