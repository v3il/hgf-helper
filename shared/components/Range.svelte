<input
    type="range"
    {min}
    {max}
    {value}
    step="1"
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
    oninput={handleInput}
>

<script lang="ts">
interface Props {
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
}

let { min = 0, max = 100, value, onChange }: Props = $props();

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = parseInt(target.value, 10);

    onChange(newValue);
}
</script>
