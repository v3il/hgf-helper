<input
    type="range"
    {min}
    {max}
    {value}
    step="1"
    class={['w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500', classes]}
    oninput={handleInput}
>

<script lang="ts">
import type { ClassValue } from 'clsx';

interface Props {
    classes?: ClassValue;
    min: number;
    max: number;
    value: number;
    onInput: (value: number) => void;
}

let { min = 0, max = 100, value, classes, onInput }: Props = $props();

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = parseInt(target.value, 10);

    onInput(newValue);
}
</script>
