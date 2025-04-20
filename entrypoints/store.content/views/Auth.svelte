<div class="uk-background-secondary uk-flex uk-flex-between uk-flex-middle uk-padding-small uk-panel hgf-bt-primary hgf-color-white">
    <p>Sign in to unlock all the HGF-Helper functions</p>
    <button class="uk-button uk-button-primary" onclick={triggerAuth}>Sign in with Twitch</button>
</div>

<script lang="ts">
import { AuthFacade } from '@shared/modules';
import { Container } from 'typedi';
import { AuthWindow } from '@shared/views';
import { AUTH_URL } from '@shared/consts';

const authFacade = Container.get(AuthFacade);

async function triggerAuth() {
    try {
        const authWindow = new AuthWindow();
        const token = await authWindow.open(AUTH_URL);

        if (token) {
            await authFacade.auth(token);
        }
    } catch (error) {
        console.error(error);
    }
}
</script>
