<div class="flex items-center gap-[16px]">
    <StreamStatusItem Icon={Bot} isOk={streamStatusService.isBotWorking} name="Mini-games bot" />
    <StreamStatusItem Icon={Activity} isOk={streamStatusService.isStreamOk} name="Stream" />
    <StreamStatusItem Icon={ShieldAlert} isOk={!streamStatusService.isAntiCheat} name="Anti-cheat" />
</div>

<script lang="ts">
import { Bot, Activity, ShieldAlert } from '@lucide/svelte';
import StreamStatusItem from './StreamStatusItem.svelte';
import { StreamStatusService } from '@twitch/modules/stream';
import { Container } from 'typedi';

const streamStatusService = Container.get(StreamStatusService);
</script>
