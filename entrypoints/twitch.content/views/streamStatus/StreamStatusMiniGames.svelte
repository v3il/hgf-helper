<StreamStatusItem Icon={Bot} isOk={streamStatusService.isBotWorking} {tooltip} />

<script lang="ts">
import { Bot } from '@lucide/svelte';
import StreamStatusItem from './StreamStatusItem.svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';

const streamStatusService = Container.get(StreamStatusService);

const tooltip = $derived(
    streamStatusService.isBotWorking
        ? 'Mini-games bot is running'
        : 'Mini-games bot is not running. Mini-game commands are on hold'
);
</script>
