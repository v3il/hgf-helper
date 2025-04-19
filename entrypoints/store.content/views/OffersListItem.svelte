<div class="hgfs-container" data-container>
    <a href="/" class="hgfs-container__steam" target="_blank" data-steam-app-link>Steam</a>
    <button class="hgfs-container__hide" data-hide>Hide</button>
</div>

<script lang="ts">
    import { Offer } from "@store/modules/offers/models";

    interface Props {
        offer: Offer;
        offerEl: HTMLElement;
    }

    const {offer}: Props = $props();
</script>;

<style>
    /*todo: refactor styles*/

    .hgfs-container {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        padding: 8px;
        background-color: #121212;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 3px solid #555;
    }

    .hgfs-container--danger {
        border-color: indianred;
    }

    .hgfs-container__hide {
        font-size: 12px;
        display: block;
    }

    .hgfs-offer--hidden.hgfs-offer--hidden.hgfs-offer--hidden {
        display: none !important;
    }

    .hgfs-container__steam {
        font-size: 12px;
        display: block;
        color: #ccc;
        font-weight: bold;
    }

    .hgfs-container__steam:hover {
        text-decoration: underline;
    }
</style>
