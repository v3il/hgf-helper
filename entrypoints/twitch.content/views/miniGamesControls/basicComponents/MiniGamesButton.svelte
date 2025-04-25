<button class="hgf-twitch-extension-button" {disabled} {onclick}>Send</button>

<script lang="ts">
interface Props {
    disabled?: boolean;
    onclick?: () => void;
}

const { disabled = false, onclick }: Props = $props();
</script>

<style>
.hgf-twitch-extension-button {
    line-height: 1;

    &:disabled {
        opacity: 0.5;
    }
}
</style>
