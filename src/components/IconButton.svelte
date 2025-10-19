<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { ripple } from "svelte-ripple-action";
  import CircularProgress from "./CircularProgress.svelte";

  interface Props {
    color?: "primary" | "success" | "error" | "warning";
    loading?: boolean;
    size?: "sm" | "md" | "2xl";
    ref?: HTMLButtonElement | null;
  }

  let {
    color,
    disabled = false,
    loading = false,
    children,
    class: className = "",
    size = "sm",
    ref = $bindable(),
    ...rest
  }: Props & HTMLButtonAttributes = $props();
</script>

<button
  bind:this={ref}
  use:ripple={{
    disabled: disabled ?? false,
  }}
  class={`
        flex
        row
        items-center
        rounded-full
        p-2
        gap-1
        text-${size}
        radius-lg
        button
        ${disabled ? "" : color}
        ${disabled ? "disabled" : ""}
        transition-all
        ${className}
    `}
  {...rest}
>
  {#if loading}
    <CircularProgress {size} />
  {:else}
    {@render children?.()}
  {/if}
</button>

<style lang="postcss">
  @reference "../app.css";
  .button {
    @apply uppercase font-bold bg-white/0 cursor-pointer;
  }

  .button:hover {
    @apply bg-white/10 text-white/100;
  }

  .button.disabled {
    @apply text-white/40 cursor-not-allowed bg-white/0;
  }
  .button.disabled:hover {
    @apply text-white/40 bg-white/0;
  }
</style>
