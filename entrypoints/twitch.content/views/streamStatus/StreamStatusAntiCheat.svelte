<StreamStatusItem Icon={ShieldAlert} isOk={!streamStatusService.isAntiCheat} {tooltip} />

<script lang="ts">
import { ShieldAlert } from '@lucide/svelte';
import StreamStatusItem from './StreamStatusItem.svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';

const streamStatusService = Container.get(StreamStatusService);

const tooltip = $derived(
    streamStatusService.isAntiCheat
        ? 'Anti-cheat is active. Mini-game commands are on hold'
        : 'Anti-cheat is inactive'
);
</script>
