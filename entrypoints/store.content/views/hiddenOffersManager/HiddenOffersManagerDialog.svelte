<dialog class="hgf-dialog" bind:this={dialogRef}>
    <h3 class="mb-[16px] text-white text-[20px]">Manage hidden offers</h3>

    <Tabs variants={TABS} dark>
        {#snippet content(activeTab)}
            <div class="h-[600px]">
                {#if activeTab === 'existing'}
                    <HiddenOffersManagerSaved />
                {/if}

                {#if activeTab === 'migration'}
                    <HiddenOffersManagerMigration />
                {/if}
            </div>
        {/snippet}
    </Tabs>

    <div class="flex grow-0">
        <button
            class="ml-auto mt-[8px] whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#d4d4d8]"
            onclick={onclose}
        >
            Close
        </button>
    </div>
</dialog>

<script lang="ts">
import { Tabs } from '@shared/components';
import { HiddenOffersManagerSaved } from './existing';
import { HiddenOffersManagerMigration } from './migration';
import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';

interface Props {
    isOpened: boolean;
    onclose: () => void;
}

const { isOpened, onclose }: Props = $props();

let dialogRef: HTMLDialogElement | null = null;

const offersFacade = Container.get(OffersFacade);

const TABS = $derived([
    {
        label: `Hidden Offers (${offersFacade.hiddenOffers.length})`,
        value: 'existing'
    },
    {
        label: 'Offers Migration',
        value: 'migration'
    }
]);

$effect(() => {
    isOpened ? dialogRef?.showModal() : dialogRef?.close();
});
</script>

<style>
.hgf-dialog[open] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    border-radius: 8px;
    letter-spacing: 0;
    background-color: #131315;
    border: 2px solid gray;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.hgf-dialog::backdrop {
    background-color: #121212;
    opacity: 0.85;
}
</style>
