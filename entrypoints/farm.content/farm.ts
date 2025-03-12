import 'reflect-metadata';
import { Container } from 'typedi';
import { TwitchFacade } from '@farm/modules/twitch';
import { isDev } from '@farm/consts';
import { SettingsFacade } from '@components/shared';

export const main = () => {
    TwitchFacade.instance.init(async () => {
        console.clear();
        console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);
        console.error('Elements ready', TwitchFacade.instance.twitchUserName);

        await SettingsFacade.instance.loadSettings();
    });

    // console.error(elementsRegistry);

    // TwitchFacade.instance.init(async () => {
    //     console.clear();
    //     console.info(`HGF helper is running in ${isDev ? 'dev' : 'prod'} mode`);
    //
    //     console.error(Container.get(OnScreenTextRecognizer));
    //
    //     await SettingsFacade.instance.loadSettings();
    //
    //     ExtensionContainer.create().mount(document.body);
    // });
};
