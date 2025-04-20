<div class="hgf-mb-16">
    <button class="uk-button uk-button-primary uk-width-1-1 uk-button-large" onclick={() => { isDialogOpened = true; }}>
        Manage hidden offers
    </button>

    <HiddenOffersManagerDialog isOpened={isDialogOpened} onclose={() => { isDialogOpened = false; }} />
</div>

<script lang="ts">
import HiddenOffersManagerDialog from './HiddenOffersManagerDialog.svelte';

let isDialogOpened = $state(false);
</script>
