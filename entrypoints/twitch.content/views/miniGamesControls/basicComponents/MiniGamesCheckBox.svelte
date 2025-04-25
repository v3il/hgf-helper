<label class="hgf-twitch-extension-label">
    <span class="hgf-twitch-extension-label__text">
        {@render children()}
    </span>

    <input type="checkbox" {checked} {onchange}>
</label>

<script lang="ts">
import { type Snippet } from 'svelte';

interface Props {
    checked: boolean;
    onchange: (event: Event) => void;
    children: Snippet;
}

const { checked, onchange, children }: Props = $props();
</script>

<style>
.hgf-twitch-extension-label {
    margin-right: 24px;
    display: flex;
    align-items: center;
    line-height: 1;
}

.hgf-twitch-extension-label__text {
    display: inline-block;
    margin-right: 8px;
}
</style>
