<button
    onclick={auth}
    disabled={isProcessing}
    class={buttonClasses}
>
    <Twitch size="16" class="mr-[8px]" />
    Sign in with Twitch
</button>

<script lang="ts">
import { Twitch } from '@lucide/svelte';
import { Container } from 'typedi';
import { AuthFacade } from '@shared/modules';
import { AuthWindow } from '@shared/views';
import { AUTH_URL } from '@shared/consts';

interface Props {
    classes?: string;
}

const { classes = '' }: Props = $props();

const authFacade = Container.get(AuthFacade);

let isProcessing = $state(false);

const buttonClasses = $derived(`flex-shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md bg-[#9146FF] hover:bg-[#7c31ff] text-white text-[14px] ${classes}`)

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
