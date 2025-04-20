<p class="hgf-hidden-offers-manager__empty">
    {message}
</p>

<script lang="ts">
interface Props {
    message: string;
}

const { message }: Props = $props();
</script>

<style>
.hgf-hidden-offers-manager__empty {
    padding: 16px;
    text-align: center;
    color: rgba(255, 255, 255, .87);
}
</style>
