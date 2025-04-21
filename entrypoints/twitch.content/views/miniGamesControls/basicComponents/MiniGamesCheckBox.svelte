<label class="hgf-twitch-extension-label">
    <span class="hgf-twitch-extension-label__text">
        <slot />
    </span>

    <input type="checkbox">
</label>

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
