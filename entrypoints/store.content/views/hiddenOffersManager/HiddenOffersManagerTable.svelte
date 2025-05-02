<table class="mb-[8px]">
    <tbody>
        {#each offers as offer}
            <tr class='odd:bg-[#232428]'>
                <td class="h-[40px] align-middle px-[24px] py-[8px] w-full text-[rgba(255,255,255,.87)] capitalize">
                    {offer}
                </td>

                <td class="h-[40px] align-middle px-[24px] py-[8px]">
                    <button class="bg-transparent border-none text-[lightcoral]" onclick={() => onOfferRemove(offer)}>
                        Unhide
                    </button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<script lang="ts">
interface Props {
    offers: string[];
    onOfferRemove: (offer: string) => void;
}

const { offers, onOfferRemove }: Props = $props();
</script>
