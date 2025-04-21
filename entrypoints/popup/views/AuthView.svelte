<div class="uk-flex uk-flex-center uk-flex-middle uk-height-medium hgf-p-16">
    <button class="uk-button uk-button-primary uk-button-large" onclick={() => auth()}>
        Sign in with Twitch
    </button>
</div>

<script lang="ts">
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { AuthWindow } from '@shared/views';
import { AUTH_URL } from '@shared/consts';

const authFacade = Container.get(AuthFacade);

async function auth() {
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
