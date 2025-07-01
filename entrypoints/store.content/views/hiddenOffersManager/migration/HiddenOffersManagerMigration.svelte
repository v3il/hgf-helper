<p class="mb-[8px] text-[14px] text-[#d4d4d8]">
    This widget allows you to migrate hidden offers from <b>version 1</b> to <b>version 2</b> of the extension.
</p>

<p class="mb-[16px] text-[14px] text-[#d4d4d8]">
    To proceed, you’ll need to provide your <b>JSONBin X-Access-Key</b> with <b>read access</b>.
    The offers stored in JSONBin will be <b>merged</b> with your existing hidden offers — no data will be lost.
</p>

<label class="text-[#d4d4d8] text-[14px] mb-[16px]">
    JSONBin URL

    <input
        class="w-full rounded-md border px-[16px] py-[8px] mb-[16px] mt-[4px] outline-0 text-base ring-offset-background bg-[#27272a] border-[#3f3f46] text-[#d4d4d8] placeholder:text-[#71717a]"
        placeholder="https://api.jsonbin.io/v3/b/"
        bind:value={jsonBinUrl}
    >
</label>

<label class="text-[#d4d4d8] text-[14px] mb-[16px]">
    JSONBin X-Access-Key

    <input
        class="w-full rounded-md border px-[16px] py-[8px] mb-[16px] mt-[4px] outline-0 text-base ring-offset-background bg-[#27272a] border-[#3f3f46] text-[#d4d4d8] placeholder:text-[#71717a]"
        placeholder="JSONBin X-Access-Key"
        bind:value={jsonBinAccessKey}
    >
</label>

<button
    class="ml-auto block rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#9146FF] hover:bg-[#7c31ff] text-white"
    onclick={migrateHiddenOffers}
    disabled={isProcessing}
>
    Import
</button>

<script lang="ts">
import { Container } from 'typedi';
import { OffersFacade } from '@store/modules';

let jsonBinUrl = $state('');
let jsonBinAccessKey = $state('');
let isProcessing = $state(false);

const offersFacade = Container.get(OffersFacade);

async function migrateHiddenOffers() {
    try {
        isProcessing = true;

        const offersCount = await offersFacade.migrateHiddenOffers({
            jsonBinUrl,
            jsonBinAccessKey
        });

        alert(`Migrated ${offersCount} new offer(s)`);
    } catch (error: unknown) {
        alert('Error fetching hidden offers: ' + (error as Error).message);
    } finally {
        isProcessing = false;
    }
}
</script>
