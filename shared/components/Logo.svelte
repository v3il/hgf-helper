<img src={url} alt="logo" width={size} class={['rounded-[4px]', 'shrink-0', 'aspect-square']} />

<script lang="ts">
import logoUrl from '/logo.png';

interface Props {
    size?: number;
}

const { size = 32 }: Props = $props();
const url = chrome.runtime.getURL(logoUrl);
</script>

