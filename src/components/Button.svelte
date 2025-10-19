<script lang="ts">
  import { ripple } from "svelte-ripple-action";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {}

  let { children, ...rest }: Props & HTMLButtonAttributes = $props();
</script>

<button use:ripple {...rest} class="button">
  {@render children?.()}
</button>

<style lang="postcss">
  .button {
    @apply transition-all;
    padding: 0.5rem 1rem;
    background-color: #4a90e2;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 0.5rem;

    &:hover {
      background-color: #357abd;
    }

    /* on attr disabled */
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;

      &:hover {
        background-color: #ccc;
      }
    }
  }
</style>
