<table class="hgf-hidden-offers-manager__table">
    <tbody>
        {#each offers as offer}
            <tr class='hgf-hidden-offers-manager__row'>
                <td class="hgf-hidden-offers-manager__cell hgf-hidden-offers-manager__cell--name">{offer}</td>
                <td class="hgf-hidden-offers-manager__cell">
                    <button class="hgf-hidden-offers-manager__remove-button" onclick={() => onOfferRemove(offer)}>
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

<style>
.hgf-hidden-offers-manager__table {
    margin-bottom: 8px;
    width: 100%;
    color: rgba(255, 255, 255, .87);
}

.hgf-hidden-offers-manager__row:nth-child(odd) {
    background-color: #232428;
}

.hgf-hidden-offers-manager__cell {
    height: 40px;
    vertical-align: middle;
    padding: 8px 24px;
}

.hgf-hidden-offers-manager__cell--name {
    width: 100%;
    text-transform: capitalize;
}

.hgf-hidden-offers-manager__remove-button {
    background-color: transparent;
    border: none;
    color: lightcoral;
}
</style>
