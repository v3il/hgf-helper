<button
    type="button"
    role="switch"
    aria-checked="true"
    aria-label="switch"
    data-state={state}
    value={value}
    class="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-[#403E43] data-[state=checked]:bg-purple-500"
    onclick={() => onChange(!isChecked)}
>
    <span data-state={state} class="pointer-events-none block h-[20px] w-[20px] rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-0"></span>
</button>

<script lang="ts">

interface Props {
    isChecked: boolean;
    onChange: (isChecked: boolean) => void;
}

let { isChecked, onChange }: Props = $props();

const state = $derived(isChecked ? 'checked': 'unchecked');
const value = $derived(isChecked ? 'on': 'off');
</script>
