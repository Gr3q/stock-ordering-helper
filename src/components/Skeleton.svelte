<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";

    interface Props {}

    let {
        children,
        class: className = "",
        ...rest
    }: Props & HTMLAttributes<any> = $props();
</script>

<div
    class="skeleton"
    {...rest}
>
    {@render children?.()}
</div>

<style lang="postcss">
    @reference "../app.css";

    .skeleton {
        @apply animate-pulse bg-white/30 rounded-lg;

        :global(*) {
            opacity: 0;
            pointer-events: none;
        }
    }
</style>
