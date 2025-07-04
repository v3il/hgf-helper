<StreamStatusItem Icon={Activity} isOk={streamStatusService.isStreamOk} {tooltip} />

<script lang="ts">
import { Activity } from '@lucide/svelte';
import StreamStatusItem from './StreamStatusItem.svelte';
import { Container } from 'typedi';
import { StreamStatusService } from '@twitch/modules/stream';

const streamStatusService = Container.get(StreamStatusService);

const tooltip = $derived(
    streamStatusService.isStreamOk
        ? 'Stream is running'
        : 'Stream is broken. Mini-game commands are on hold'
);
</script>
