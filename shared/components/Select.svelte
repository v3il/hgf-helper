<select
    onchange={handleInput}
    class={['bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500', classes]}
    aria-label="Select"
    aria-required="true"
>
    {#if options.length === 0}
        <option value="" disabled selected>
            No options available
        </option>
    {/if}
    {#each options as option}
        <option value={option.value} selected={option.value === value}>
            {option.label}
        </option>
    {/each}
</select>

<script lang="ts">
import type { ClassValue } from 'clsx';

interface Props {
    options: Array<{ value: string; label: string }>;
    value: string;
    classes?: ClassValue;
    onChange: (value: string) => void;
}

let { options, value, classes, onChange }: Props = $props();

function handleInput(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;

    onChange(newValue);
}
</script>
