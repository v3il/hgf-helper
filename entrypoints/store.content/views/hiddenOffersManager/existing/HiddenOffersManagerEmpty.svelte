<p class="p-[16px] text-center text-[rgba(255,255,255,.87)]">
    {message}
</p>

<script lang="ts">
interface Props {
    message: string;
}

const { message }: Props = $props();
</script>
