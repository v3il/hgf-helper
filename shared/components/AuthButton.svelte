<button class={['uk-button', 'uk-button-primary', props.class]} onclick={() => auth()} disabled={isProcessing}>
    Sign in with Twitch
</button>

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { AuthWindow } from '@shared/views';
import { AUTH_URL } from '@shared/consts';

const props = $props();

const authFacade = Container.get(AuthFacade);

let isProcessing = $state(false);

async function auth() {
    isProcessing = true;

    try {
        const authWindow = new AuthWindow();
        const token = await authWindow.open(AUTH_URL);

        if (token) {
            await authFacade.auth(token);
        }
    } catch (error) {
        console.error(error);
    } finally {
        isProcessing = false;
    }
}
</script>
